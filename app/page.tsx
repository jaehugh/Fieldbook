"use client";

import { useMemo, useState } from "react";

const starterSource = `Paste a short excerpt, notes, transcript, or a link summary here.\n\nExample: Customers delay decisions when the next step is unclear. Make each test small enough to run this week, and define the evidence that would change your mind.`;

function safeName(value: string) {
  return (value.toLowerCase().match(/[a-z0-9]+/g)?.join("-") || "fieldbook-skill");
}

export default function Home() {
  const [project, setProject] = useState("Neighborhood Renewal Studio");
  const [source, setSource] = useState(starterSource);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const title = project.trim() || "Untitled venture";
  const skill = useMemo(() => `---\nname: ${safeName(title)}\ndescription: Apply the private ${title} fieldbook when shaping decisions, experiments, and next actions.\n---\n\n# ${title} Fieldbook\n\n## When to use\nUse this skill when the user is deciding what to test next for ${title}, needs a source-grounded plan, or wants assumptions made explicit.\n\n## Operating principles\n- Keep source claims separate from assumptions and proposals.\n- Prefer a small, observable experiment over a broad launch.\n- State the evidence that would change the recommendation.\n\n## Source-grounded map\n${source.trim() || "No source text has been supplied yet. Ask the user for permitted source material before making source-derived claims."}\n\n## First field experiment\n1. Name the narrowest audience and problem to test this week.\n2. Make one direct offer or prototype.\n3. Record the response, objections, and one decision for the next cycle.\n\n## Guardrails\n- Treat all supplied material as private.\n- Do not reproduce or distribute copyrighted source text.\n- Cite source excerpts or identifiers in any derived fieldbook.\n`, [title, source]);

  function downloadSkill() {
    const blob = new Blob([skill], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeName(title)}-SKILL.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return <main>
    <section className="hero">
      <div className="eyebrow">Private operating-guide generator</div>
      <h1>Turn a source into<br /><em>a field guide for action.</em></h1>
      <p>Fieldbook turns source material you have the right to use into a private framework map, practical next experiments, and an installable Skill Pack.</p>
      <div className="trust"><span>Private by default</span><span>•</span><span>No bundled books</span><span>•</span><span>Assumptions shown clearly</span></div>
    </section>

    <section className="workspace" aria-label="Fieldbook workspace">
      <div className="steps"><span className="active">01 Source</span><span>02 Context</span><span>03 Fieldbook</span><span>04 Skill Pack</span></div>
      <div className="input-grid">
        <label>Venture or project idea<input value={project} onChange={(event) => setProject(event.target.value)} placeholder="What are you trying to build?" /></label>
        <label>Permitted source material<textarea value={source} onChange={(event) => setSource(event.target.value)} rows={9} placeholder="Paste notes, an excerpt, a transcript, or a sourced web summary..." /></label>
      </div>
      <div className="notice"><strong>Rights check:</strong> Only add material you own or have permission to use. Fieldbook does not store, publish, or rewrite source books.</div>
      <button className="primary" onClick={() => setGenerated(true)}>Generate private fieldbook <span>→</span></button>
    </section>

    {generated && <section className="results">
      <div className="result-header"><div><div className="eyebrow">Draft for {title}</div><h2>Framework map + first experiment</h2></div><span className="private">PRIVATE DRAFT</span></div>
      <div className="cards">
        <article><small>01 / SOURCE SIGNAL</small><h3>Clarity reduces hesitation</h3><p>Your source emphasizes a clear next step and a test small enough to run now.</p><cite>Derived from your supplied material</cite></article>
        <article><small>02 / ASSUMPTION</small><h3>A focused pilot can earn a response</h3><p>Assumption: a narrowly defined offer is more useful than a complete product launch.</p><cite>Validate with real conversations</cite></article>
        <article><small>03 / NEXT EXPERIMENT</small><h3>Invite five qualified people</h3><p>Share a one-sentence offer, ask for a 20-minute conversation, and log language they use.</p><cite>Success: 2+ interested replies</cite></article>
      </div>
      <div className="skill-panel"><div><div className="eyebrow">Installable Skill Pack</div><h2>Readable. Editable. Yours.</h2><p>A portable <code>SKILL.md</code> follows the broadly compatible skill convention: concise front matter, clear use cases, operating rules, and a source-grounded workflow. It is inspired by the organizational pattern of Every Inc.’s MIT-licensed Compound Engineering project, not copied source content.</p></div><div className="skill-actions"><button onClick={() => { navigator.clipboard.writeText(skill); setCopied(true); }}>{copied ? "Copied" : "Copy SKILL.md"}</button><button className="primary" onClick={downloadSkill}>Download Skill Pack</button></div></div>
      <details><summary>Preview generated SKILL.md</summary><pre>{skill}</pre></details>
    </section>}

    <section className="future"><div><div className="eyebrow">Designed to grow carefully</div><h2>Research and audio are adapters, not assumptions.</h2></div><p>Future research adapters can add cited current-market context only when enabled. Audio providers are isolated behind an adapter boundary; Fish Audio is evaluation-only and non-commercial unless its licensing is independently cleared.</p></section>
  </main>;
}
