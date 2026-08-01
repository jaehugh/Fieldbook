"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import mammoth from "mammoth";

type Source = { id: string; name: string; type: string; size: number; text: string; status: "ready" | "reading" | "unsupported" | "error" };
type Brief = { name: string; outcome: string; audience: string; problem: string; context: string; constraints: string; stage: string };

const initialBrief: Brief = { name: "", outcome: "", audience: "", problem: "", context: "", constraints: "", stage: "Exploring" };
const textTypes = [".txt", ".md", ".markdown", ".csv", ".json", ".html", ".htm", ".rtf"];
const formatBytes = (bytes: number) => bytes < 1_000_000 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1_000_000).toFixed(1)} MB`;
const slug = (value: string) => value.toLowerCase().match(/[a-z0-9]+/g)?.join("-") || "fieldbook-skill";

async function extract(file: File): Promise<Pick<Source, "text" | "status">> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages = await Promise.all(Array.from({ length: pdf.numPages }, async (_, index) => {
      const content = await pdf.getPage(index + 1).then(page => page.getTextContent());
      return content.items.map(item => "str" in item ? item.str : "").join(" ");
    }));
    return { text: pages.join("\n\n"), status: "ready" };
  }
  if (name.endsWith(".docx")) return { text: (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value, status: "ready" };
  if (textTypes.some(extension => name.endsWith(extension))) return { text: await file.text(), status: "ready" };
  return { text: "", status: "unsupported" };
}

export default function Home() {
  const [brief, setBrief] = useState<Brief>(initialBrief);
  const [sources, setSources] = useState<Source[]>([]);
  const [notes, setNotes] = useState("");
  const [generated, setGenerated] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");
  const [researchFocus, setResearchFocus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const name = brief.name.trim() || "Untitled project";
  const readySources = sources.filter(source => source.status === "ready");
  const hasInput = readySources.length > 0 || notes.trim().length > 0;

  const sourceDigest = useMemo(() => readySources.map(source => `- ${source.name}: ${source.text.replace(/\s+/g, " ").slice(0, 360) || "No extractable text found."}`).join("\n") || "- Project notes supplied directly in the dossier.", [readySources]);
  const skill = useMemo(() => `---\nname: ${slug(name)}\ndescription: Use this private Fieldbook skill for ${name} to make source-aware decisions, distinguish evidence from assumptions, and plan the next test.\n---\n\n# ${name} Fieldbook\n\n## When to use\nUse when evaluating choices, shaping an experiment, or preparing a practical next step for this project.\n\n## Project brief\n- Stage: ${brief.stage}\n- Desired outcome: ${brief.outcome || "Not yet defined"}\n- Intended audience: ${brief.audience || "Not yet defined"}\n- Problem: ${brief.problem || "Not yet defined"}\n- Constraints: ${brief.constraints || "Not yet defined"}\n\n## Source inventory\n${readySources.map(source => `- ${source.name} (${formatBytes(source.size)})`).join("\n") || "- Direct project notes only"}\n\n## Working rules\n1. Label each conclusion as source-grounded, assumption, or proposal.\n2. Cite a source file by name when relying on it; do not reproduce protected passages.\n3. Prefer the smallest test that can change a decision.\n4. State what evidence would prove the current assumption wrong.\n\n## First field test\n- Hypothesis: ${brief.problem || "The project has a specific, urgent problem worth solving."}\n- Test: Invite 5 people matching ${brief.audience || "the target audience"} to respond to a narrow offer or prototype.\n- Signal: Track replies, objections, and one next decision.\n\n## Privacy\nThis pack references private, user-provided sources. Keep those sources private and do not redistribute them.\n`, [brief, name, readySources]);

  function update(key: keyof Brief, value: string) { setBrief(current => ({ ...current, [key]: value })); }
  async function addFiles(files: FileList | File[]) {
    const selected = Array.from(files);
    setMessage("");
    const provisional = selected.map(file => ({ id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`, name: file.name, type: file.type || "file", size: file.size, text: "", status: "reading" as const }));
    setSources(current => [...current, ...provisional]);
    await Promise.all(provisional.map(async (entry, index) => {
      try { const result = await extract(selected[index]); setSources(current => current.map(source => source.id === entry.id ? { ...source, ...result } : source)); }
      catch { setSources(current => current.map(source => source.id === entry.id ? { ...source, status: "error" } : source)); }
    }));
  }
  function onFileChange(event: ChangeEvent<HTMLInputElement>) { if (event.target.files) addFiles(event.target.files); event.target.value = ""; }
  function download() { const blob = new Blob([skill], { type: "text/markdown" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `${slug(name)}-SKILL.md`; link.click(); URL.revokeObjectURL(url); }
  function copyAgentBrief() {
    const handoff = `# Fieldbook Agent Handoff\n\n## Project\n- Name: ${name}\n- Stage: ${brief.stage}\n- Outcome: ${brief.outcome || "Not yet defined"}\n- Audience: ${brief.audience || "Not yet defined"}\n- Problem: ${brief.problem || "Not yet defined"}\n- Constraints: ${brief.constraints || "Not yet defined"}\n- Context: ${brief.context || "Not yet defined"}\n\n## Private source inventory\n${readySources.map(source => `- ${source.name} (${formatBytes(source.size)})`).join("\n") || "- Direct project notes only"}\n\n## Human observations\n${notes || "None supplied"}\n\n## Instructions\n1. Ask before accessing any source file not attached to this handoff.\n2. Keep sources private. Do not reproduce protected passages.\n3. Separate source-grounded claims, assumptions, and proposals.\n4. Recommend the smallest decisive experiment.\n5. If an approved MCP tool is available for narration, use only the final human-approved narration script.\n`;
    navigator.clipboard.writeText(handoff); setMessage("Agent handoff copied. Attach permitted files directly in your agent host when needed.");
  }
  function copyLast30DaysBrief() {
    const focus = researchFocus.trim() || `${name}: current market, customer language, alternatives, and objections`;
    const handoff = `Use the installed last30days skill for this Fieldbook research request:\n\n/last30days ${focus}\n\nProject context:\n- Project: ${name}\n- Desired outcome: ${brief.outcome || "Not yet defined"}\n- Intended audience: ${brief.audience || "Not yet defined"}\n- Problem: ${brief.problem || "Not yet defined"}\n\nReturn a private research appendix that:\n1. Separates current-market evidence from Fieldbook source material and assumptions.\n2. Preserves source URLs, dates, platform attribution, and uncertainty.\n3. Extracts exact customer language, objections, competitors or alternatives, and testable demand signals.\n4. Recommends one small experiment only after the human reviews the evidence.\n5. Does not upload or quote Fieldbook source files unless the human separately attaches and approves them.\n\nAttribution: research lane powered by Matt Van Horn's MIT-licensed last30days skill: https://github.com/mvanhorn/last30days-skill`;
    navigator.clipboard.writeText(handoff); setMessage("Last30Days research handoff copied. Run it in an agent host where the skill is installed.");
  }

  return <main>
    <header><a className="mark" href="#top">FIELD<span>BOOK</span></a><div className="header-note"><span className="dot" /> LOCAL-FIRST SYSTEM · YOUR SOURCES STAY ON THIS DEVICE</div></header>
    <section className="intro" id="top"><div className="eyebrow">FROM CHAOS TO CLARITY</div><h1>BUILD THE SYSTEM.<br /><em>RUN THE FIELD.</em></h1><p>Bring the PDFs, documents, transcripts, notes, and research you are allowed to use. Add the full project context. Fieldbook turns scattered knowledge into a working operating guide, a first test, and a portable Skill Pack.</p><div className="intro-rule"><span>PRIVATE BY DEFAULT</span><span>STRUCTURE BEFORE SCALE</span><span>SILENT MOVES. LOUD RESULTS.</span></div></section>

    <section className="app-shell" aria-label="Fieldbook project workspace">
      <aside><div className="rail-title">THE FIELD SYSTEM</div><nav><a className="selected" href="#sources">01 Sources <b>{sources.length}</b></a><a href="#brief">02 Project dossier</a><a href="#output">03 Fieldbook</a><a href="#skill">04 Skill Pack</a></nav><div className="privacy-card"><strong>See the full picture.</strong><p>Files are read in your browser. No source content, account, or analytics leaves this device in this MVP.</p></div></aside>
      <div className="canvas">
        <section id="sources" className="section"><div className="section-heading"><div><div className="eyebrow">01 / Evidence locker</div><h2>Add the actual material</h2></div><p>PDF, DOCX, TXT, Markdown, CSV, JSON, HTML, and RTF. Select as many files as you need—there is no Fieldbook file-count or file-size setting.</p></div>
          <input ref={inputRef} hidden type="file" multiple accept=".pdf,.docx,.txt,.md,.markdown,.csv,.json,.html,.htm,.rtf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/*" onChange={onFileChange} />
          <button className={`dropzone ${dragging ? "dragging" : ""}`} onClick={() => inputRef.current?.click()} onDragOver={event => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}><span className="upload-icon">↓</span><strong>Drop your source files here</strong><small>or choose files from this device</small></button>
          {sources.length > 0 && <div className="source-list">{sources.map(source => <article key={source.id}><span className="file-type">{source.name.split(".").pop()?.toUpperCase() || "FILE"}</span><div><strong>{source.name}</strong><small>{formatBytes(source.size)} · {source.status === "ready" ? "Ready locally" : source.status === "reading" ? "Reading locally…" : source.status === "unsupported" ? "Unsupported format" : "Could not read"}</small></div><button aria-label={`Remove ${source.name}`} onClick={() => setSources(current => current.filter(item => item.id !== source.id))}>×</button></article>)}</div>}
          <div className="rights"><b>Use-rights checkpoint</b><span>Only add material you own or have permission to use. Fieldbook maps ideas and sources; it does not publish, train on, or distribute them.</span></div>
        </section>

        <section id="brief" className="section"><div className="section-heading"><div><div className="eyebrow">02 / Project dossier</div><h2>Give the source a real-world job</h2></div><p>Good fieldbooks need more than a one-line idea. Capture the operating context the source cannot know.</p></div>
          <div className="form-grid"><label>Project name<input value={brief.name} onChange={event => update("name", event.target.value)} placeholder="e.g. Neighborhood Renewal Studio" /></label><label>Current stage<select value={brief.stage} onChange={event => update("stage", event.target.value)}><option>Exploring</option><option>Validating</option><option>Building</option><option>Launching</option><option>Operating</option></select></label><label>Outcome you want<textarea value={brief.outcome} onChange={event => update("outcome", event.target.value)} placeholder="What would meaningful progress look like in 90 days?" /></label><label>Who is this for?<textarea value={brief.audience} onChange={event => update("audience", event.target.value)} placeholder="Specific people, context, and urgency—not a demographic label." /></label><label>Problem or opportunity<textarea value={brief.problem} onChange={event => update("problem", event.target.value)} placeholder="What needs to change, and why now?" /></label><label>Constraints and non-negotiables<textarea value={brief.constraints} onChange={event => update("constraints", event.target.value)} placeholder="Time, budget, ethics, existing commitments, decisions already made…" /></label></div>
          <label className="full">Anything else the project needs us to understand<textarea value={brief.context} onChange={event => update("context", event.target.value)} rows={4} placeholder="Existing assets, collaborators, observations, risks, customer language, links, or relevant history…" /></label>
        </section>

        <section id="output" className="section output"><div className="section-heading"><div><div className="eyebrow">03 / Working fieldbook</div><h2>Turn evidence into a next move</h2></div><p>This local version creates a structured, editable decision frame. Add an approved private synthesis provider later for deeper analysis.</p></div><label className="full">Your own observations or excerpts<textarea value={notes} onChange={event => setNotes(event.target.value)} rows={5} placeholder="Add observations you want considered alongside the files…" /></label><button className="primary build" disabled={!hasInput} onClick={() => setGenerated(true)}>{hasInput ? "Build my private fieldbook" : "Add a source or project observation first"} <span>→</span></button>
          {generated && <div className="fieldbook"><div className="fieldbook-top"><div><div className="eyebrow">{name} · working draft</div><h3>Evidence before enthusiasm.</h3></div><span>LOCAL DRAFT</span></div><div className="fieldbook-grid"><article><small>WHAT THE EVIDENCE SAYS</small><p>{sourceDigest}</p></article><article><small>WHAT WE STILL ASSUME</small><p>{brief.problem || "Define the central problem before treating this as a conclusion."}</p></article><article><small>THE NEXT TEST</small><p>Put a narrow version of the offer in front of five people in the intended audience. Record their words before changing the plan.</p></article></div></div>}
          {generated && <div className="audio-adapter"><div><div className="eyebrow">Human + agent handoff</div><h3>Keep judgment human. Let agents carry the load.</h3><p>Copy a private project packet for Codex, Claude Code, Cursor, or another agent host. Attach permitted source files there only when you want an agent to read them. Optional capabilities such as narration should use the MCP tools already approved in that host.</p></div><div className="audio-controls"><button onClick={copyAgentBrief}>Copy agent handoff</button><button className="primary" onClick={download}>Download Skill Pack</button></div></div>}
          {generated && <div className="research-lane"><div><div className="eyebrow">Native research lane / Last30Days</div><h3>Don’t build from stale assumptions.</h3><p>Turn this project into a current-market research request. Run it through the installed Last30Days skill in an agent host, then bring the cited findings back to the human for review.</p></div><div className="audio-controls"><label>Research focus <input value={researchFocus} onChange={event => setResearchFocus(event.target.value)} placeholder="e.g. what independent coaches say about AI operations" /></label><button className="primary" onClick={copyLast30DaysBrief}>Copy Last30Days handoff</button></div></div>}
        </section>

        <section id="skill" className="section skill"><div className="section-heading"><div><div className="eyebrow">04 / Agent-ready Skill Pack</div><h2>Take the fieldbook where work happens</h2></div><p>Export a readable Markdown skill to edit, version, and install in compatible coding-agent environments.</p></div><div className="skill-callout"><div><strong>Portable `SKILL.md`</strong><p>Contains the project brief, source inventory, working rules, next test, and privacy boundary—not the full contents of your private files.</p></div><div><button onClick={async () => { await navigator.clipboard.writeText(skill); setMessage("SKILL.md copied to your clipboard."); }}>Copy</button><button className="primary" onClick={download}>Download SKILL.md</button></div></div>{message && <p className="toast" role="status">{message}</p>}<details><summary>Preview the Skill Pack</summary><pre>{skill}</pre></details></section>
      </div>
    </section>
  </main>;
}
