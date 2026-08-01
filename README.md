# Fieldbook

Private operating guides made from sources the user has the right to use.

## Building in public

The repository is public so contributors can follow and improve the product. The app remains local-first, and no real user source material belongs in Git history, issues, pull requests, examples, or screenshots.

## License

Fieldbook is licensed under the [Apache License 2.0](LICENSE). This keeps the code broadly usable while including an explicit patent grant. The Fieldbook name, Coach Jae Hugh marks, and any user-provided source material are not granted for unrestricted trademark or content reuse.

## What this MVP does

1. Accepts multiple local PDF, DOCX, TXT, Markdown, CSV, JSON, HTML, and RTF source files, extracts their readable text in the browser, and shows a source inventory.
2. Captures a project dossier: desired outcome, audience, problem, current stage, constraints, and operating context.
3. Produces a clearly bounded draft: source signal, assumption, and next experiment.
4. Generates a readable, editable, downloadable `SKILL.md` Skill Pack for agentic coding environments.
5. Creates a native Last30Days research handoff for current market evidence, when used in an agent host where that skill is installed.

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

## Human + agent operation

Fieldbook is usable by a human alone, an agent alone with explicit source attachments, or both together. The app creates a private Agent Handoff packet and a portable `SKILL.md`; it does not embed provider keys or direct model integrations. Agent hosts can use their own approved MCP tools for optional research, narration, or other capabilities. See [Agent Handoff](AGENT_HANDOFF.md).

## Current-market research and credits

Fieldbook has a native [Last30Days research lane](FIELD_RESEARCH.md) that generates a private handoff for Matt Van Horn's MIT-licensed [last30days skill](https://github.com/mvanhorn/last30days-skill). It keeps current-market evidence separate from private source material and requires citations before findings become a fieldbook recommendation. See [Credits](CREDITS.md) for every upstream creator and provider relationship.
