# Fieldbook

Private operating guides made from sources the user has the right to use.

## What this MVP does

1. Accepts multiple local PDF, DOCX, TXT, Markdown, CSV, JSON, HTML, and RTF source files, extracts their readable text in the browser, and shows a source inventory.
2. Captures a project dossier: desired outcome, audience, problem, current stage, constraints, and operating context.
3. Produces a clearly bounded draft: source signal, assumption, and next experiment.
4. Generates a readable, editable, downloadable `SKILL.md` Skill Pack for agentic coding environments.

The MVP is intentionally local and client-side: source text remains in the browser unless the user chooses to export it. Fieldbook does not impose its own file-count or file-size setting; practical capacity is determined by the user's browser and device memory. It has no accounts, server uploads, database, analytics, external AI call, market-research call, or audio-provider connection.

## Local use

From this directory, run `npm run dev`, then open the local address supplied by the development server. Build verification uses `npm run build`.

## Product limits

- Supply only material you own or are authorized to use.
- Fieldbook does not bundle books or turn books into substitutes for the original work.
- The sample generation is a deterministic MVP demonstration; production synthesis needs an explicitly approved private inference provider and retention policy.
- Skill Packs are portable Markdown, not a guarantee that every agent product will load the same format.

## Skill Pack convention and attribution

Fieldbook adopts a minimal, broadly recognizable layout: YAML front matter, a purpose/use section, operating principles, a source-grounded workflow, and guardrails. That organizational convention was informed by the public MIT-licensed [EveryInc Compound Engineering plugin](https://github.com/EveryInc/compound-engineering-plugin). Fieldbook does not incorporate its skill text, agents, or code. Any future direct reuse must preserve the MIT license and attribution requirements.

## Future path

See [architecture notes](docs/ARCHITECTURE.md) for pluggable research, persistence, and audio-provider design.
