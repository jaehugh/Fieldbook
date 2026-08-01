"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import mammoth from "mammoth";

type Source = { id: string; name: string; type: string; size: number; text: string; status: "ready" | "reading" | "unsupported" | "error" };
type Brief = { name: string; outcome: string; audience: string; problem: string; context: string; constraints: string; stage: string };

const initialBrief: Brief = { name: "", outcome: "", audience: "", problem: "", context: "", constraints: "", stage: "Exploring" };
const textTypes = [".txt", ".md", ".markdown", ".csv", ".json", ".html", ".htm", ".rtf"];
const formatBytes = (bytes: number) => bytes < 1_000_000 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1_000_000).toFixed(1)} MB`;
const slug = (value: string) => value.toLowerCase().match(/[a-z0-9]+/g)?.join("-") || "fieldbook-skill";
const stopWords = new Set("about after again also and any are as at be been being but by can could did do does for from get had has have how if in into is it its just like may more most not of on one or other our out should so some than that the their then there these they this to too up use want was we were what when where which who why will with would you your".split(" "));
const words = (value: string) => value.toLowerCase().match(/[a-z][a-z'-]{2,}/g)?.filter(word => !stopWords.has(word)) || [];
const clean = (value: string) => value.replace(/\s+/g, " ").trim();

function makeEvidence(sources: Source[], projectWords: string[]) {
  const seen = new Set<string>();
  const candidates = sources.flatMap(source => clean(source.text).split(/(?<=[.!?])\s+/).map(sentence => ({ source: source.name, sentence: clean(sentence) })))
    .filter(item => item.sentence.length > 45 && item.sentence.length < 420)
    .map(item => ({ ...item, score: projectWords.reduce((sum, word) => sum + (item.sentence.toLowerCase().includes(word) ? 3 : 0), 0) + Math.min(item.sentence.length / 160, 1) }))
    .sort((a, b) => b.score - a.score);
  return candidates.filter(item => {
    const key = item.sentence.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 5);
}

function makeThemes(sources: Source[]) {
  const counts = new Map<string, number>();
  sources.forEach(source => words(source.text).forEach(word => counts.set(word, (counts.get(word) || 0) + 1)));
  return [...counts.entries()].filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([word]) => word);
}

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
  const [draftLoaded, setDraftLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const name = brief.name.trim() || "Untitled project";
  const readySources = sources.filter(source => source.status === "ready");
  const hasInput = readySources.length > 0 || notes.trim().length > 0;
  const projectWords = useMemo(() => words(`${brief.outcome} ${brief.audience} ${brief.problem} ${brief.context} ${notes}`), [brief, notes]);
  const evidence = useMemo(() => makeEvidence(readySources, projectWords), [readySources, projectWords]);
  const themes = useMemo(() => makeThemes(readySources), [readySources]);

  const sourceDigest = useMemo(() => readySources.map(source => `- ${source.name}: ${source.text.replace(/\s+/g, " ").slice(0, 360) || "No extractable text found."}`).join("\n") || "- Project notes supplied directly in the dossier.", [readySources]);
  const skill = useMemo(() => `---\nname: ${slug(name)}\ndescription: Run the complete Fieldbook process for ${name}: private-source synthesis, mandatory Last30Days market research, and a cited next experiment.\n---\n\n# ${name} Fieldbook\n\n## When to use\nUse when evaluating choices, shaping an experiment, or preparing a practical next step for this project.\n\n## Project brief\n- Stage: ${brief.stage}\n- Desired outcome: ${brief.outcome || "Not yet defined"}\n- Intended audience: ${brief.audience || "Not yet defined"}\n- Problem: ${brief.problem || "Not yet defined"}\n- Constraints: ${brief.constraints || "Not yet defined"}\n\n## Source inventory\n${readySources.map(source => `- ${source.name} (${formatBytes(source.size)})`).join("\n") || "- Direct project notes only"}\n\n## Mandatory current-market gate\nBefore producing the final fieldbook, invoke the installed \`last30days\` skill for this project. Scope the query to the intended audience, problem, outcome, and viable alternatives.\n\nSuggested query: \`/last30days ${name}: ${brief.problem || "current customer needs and objections"} for ${brief.audience || "the intended audience"}\`\n\nDo not skip this gate. Keep Last30Days findings as a separate dated, cited evidence layer. Do not send private source files to the research tool unless the human explicitly attaches and approves them.\n\n## Working rules\n1. Label each conclusion as private-source grounded, current-market grounded, assumption, or proposal.\n2. Cite source files by name and market sources by URL/platform/date; do not reproduce protected passages.\n3. Resolve contradictions between the private source and current market rather than hiding them.\n4. Prefer the smallest test that can change a decision.\n5. State what evidence would prove the current assumption wrong.\n\n## Final Fieldbook output\n1. Project framing and constraints.\n2. Private-source framework map.\n3. Last30Days market signals: customer language, objections, alternatives, demand, and uncertainty.\n4. Tensions or confirmations between the two evidence layers.\n5. One human-approved next experiment.\n\n## Privacy\nThis pack references private, user-provided sources. Keep those sources private and do not redistribute them.\n`, [brief, name, readySources]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("fieldbook-draft-v1");
      if (saved) {
        const draft = JSON.parse(saved) as { brief?: Brief; notes?: string };
        if (draft.brief) setBrief({ ...initialBrief, ...draft.brief });
        if (typeof draft.notes === "string") setNotes(draft.notes);
      }
    } catch { /* A blocked or full browser store should never stop Fieldbook. */ }
    setDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;
    try { window.localStorage.setItem("fieldbook-draft-v1", JSON.stringify({ brief, notes })); }
    catch { /* Keep the in-memory draft working if local storage is unavailable. */ }
  }, [brief, notes, draftLoaded]);

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
    const handoff = `# Fieldbook Agent Handoff\n\n## Project\n- Name: ${name}\n- Stage: ${brief.stage}\n- Outcome: ${brief.outcome || "Not yet defined"}\n- Audience: ${brief.audience || "Not yet defined"}\n- Problem: ${brief.problem || "Not yet defined"}\n- Constraints: ${brief.constraints || "Not yet defined"}\n- Context: ${brief.context || "Not yet defined"}\n\n## Private source inventory\n${readySources.map(source => `- ${source.name} (${formatBytes(source.size)})`).join("\n") || "- Direct project notes only"}\n\n## Human observations\n${notes || "None supplied"}\n\n## Required run sequence\n1. Ask before accessing any source file not attached to this handoff.\n2. Keep sources private. Do not reproduce protected passages.\n3. Extract a private-source framework map.\n4. Before finalizing, automatically invoke the installed \`last30days\` skill using this project’s name, audience, problem, outcome, and alternatives.\n5. Preserve Last30Days dates, URLs/platforms, customer language, objections, alternatives, demand signals, and uncertainty as a separate evidence layer.\n6. Resolve tensions between private source and market evidence, then recommend one smallest decisive experiment for human approval.\n7. If an approved MCP tool is available for narration, use only the final human-approved narration script.\n`;
    navigator.clipboard.writeText(handoff); setMessage("Agent handoff copied. Attach permitted files directly in your agent host when needed.");
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

        <section id="output" className="section output"><div className="section-heading"><div><div className="eyebrow">03 / Your fieldbook</div><h2>Get a real first plan now</h2></div><p>Build a private Fieldbook from your files and project details right here. An agent can later add the required current-market research layer.</p></div><label className="full">Your own observations or excerpts<textarea value={notes} onChange={event => setNotes(event.target.value)} rows={5} placeholder="Add observations you want considered alongside the files…" /></label><button className="primary build" disabled={!hasInput} onClick={() => setGenerated(true)}>{hasInput ? "Build my fieldbook" : "Add a source or project observation first"} <span>→</span></button>
          {generated && <div className="fieldbook"><div className="fieldbook-top"><div><div className="eyebrow">{name} · private fieldbook</div><h3>Your first operating guide.</h3></div><span>BUILT LOCALLY</span></div><div className="fieldbook-grid fieldbook-summary"><article><small>THE JOB TO BE DONE</small><p><b>Outcome:</b> {brief.outcome || "Set the outcome you want."}{"\n\n"}<b>For:</b> {brief.audience || "Name the people this is for."}{"\n\n"}<b>Problem:</b> {brief.problem || "Describe the problem to solve."}</p></article><article><small>FRAMEWORK MAP</small><p>{themes.length ? themes.map(theme => `• ${theme}`).join("\n") : "Add a readable source file to reveal repeating ideas."}</p></article><article><small>WHAT WE STILL ASSUME</small><p>{brief.problem ? `• ${brief.problem}\n\nThis is the problem statement—not proof that the audience agrees. Test it before building too much.` : "• The audience, problem, and desired outcome still need to be defined."}</p></article></div><div className="evidence-card"><small>WHAT YOUR SOURCES ACTUALLY SAY</small>{evidence.length ? <ul>{evidence.map((item, index) => <li key={`${item.source}-${index}`}><b>{item.source}</b><span>{item.sentence}</span></li>)}</ul> : <p>{notes ? `Your observation: ${notes}` : sourceDigest}</p>}</div><div className="experiment-card"><small>FIRST EXPERIMENT</small><h4>Run a small reality check before you build more.</h4><p>Within 7 days, speak with or observe 5 {brief.audience || "people you want to help"}. Show them the problem in plain language: “{brief.problem || "What is hardest about this right now?"}” Ask what they do today, what frustrates them, and what a better outcome would be.</p><div><b>Success sign:</b> At least 3 people describe the problem in similar words or ask for a next step.</div><div><b>Stop sign:</b> People do not recognize the problem, use a different name for it, or already have a good-enough solution.</div></div><div className="market-status"><small>CURRENT-MARKET CHECK</small><p><b>Not run in this browser.</b> Your first Fieldbook is ready. When you use the downloadable Skill Pack in an agent host, it must run Last30Days and add dated, cited market signals before it changes this experiment.</p></div></div>}
          {generated && <div className="audio-adapter"><div><div className="eyebrow">Human + agent handoff</div><h3>Keep judgment human. Let agents carry the load.</h3><p>Copy a private project packet for Codex, Claude Code, Cursor, or another agent host. Attach permitted source files there only when you want an agent to read them. Optional capabilities such as narration should use the MCP tools already approved in that host.</p></div><div className="audio-controls"><button onClick={copyAgentBrief}>Copy agent handoff</button><button className="primary" onClick={download}>Download Skill Pack</button></div></div>}
          {generated && <div className="research-lane"><div><div className="eyebrow">Built into every agent run / Last30Days</div><h3>Private source + live market. One fieldbook.</h3><p>The downloaded Skill Pack automatically runs Last30Days in the agent host using this project’s outcome, audience, and problem. The agent must merge dated, cited live-market evidence into the output before recommending an experiment.</p></div><div className="audio-controls"><button onClick={copyAgentBrief}>Copy full run brief</button><button className="primary" onClick={download}>Download auto-research Skill Pack</button></div></div>}
        </section>

        <section id="skill" className="section skill"><div className="section-heading"><div><div className="eyebrow">04 / Agent-ready Skill Pack</div><h2>Take the fieldbook where work happens</h2></div><p>Export a readable Markdown skill to edit, version, and install in compatible coding-agent environments.</p></div><div className="skill-callout"><div><strong>Portable `SKILL.md`</strong><p>Contains the project brief, source inventory, working rules, next test, and privacy boundary—not the full contents of your private files.</p></div><div><button onClick={async () => { await navigator.clipboard.writeText(skill); setMessage("SKILL.md copied to your clipboard."); }}>Copy</button><button className="primary" onClick={download}>Download SKILL.md</button></div></div>{message && <p className="toast" role="status">{message}</p>}<details><summary>Preview the Skill Pack</summary><pre>{skill}</pre></details></section>
      </div>
    </section>
  </main>;
}
