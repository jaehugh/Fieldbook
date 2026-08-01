# Fieldbook Session Log

## 2026-08-01 - Native Last30Days research lane and creator credits

- Change: Added an in-product Last30Days research-handoff generator, a strict current-market evidence protocol, and a public credit ledger for Matt Van Horn, Every Inc., and Fish Audio.
- Evidence: `FIELD_RESEARCH.md`, `CREDITS.md`, and the research lane in `app/page.tsx`.
- Blocker: Last30Days must be installed in the selected agent host; Fieldbook does not replace that tool or transmit private files to it.
- Next: Run the first project-specific current-market brief and test the human review loop.

## 2026-08-01 - Human-plus-agent architecture adopted

- Change: Removed the direct Fish Audio API route and key configuration. Fieldbook now exports a private Agent Handoff packet and Skill Pack; optional research, narration, and other tools run through approved MCP tools in the user’s chosen agent host.
- Evidence: `AGENT_HANDOFF.md`, revised Fieldbook UI, and removal of `app/api/narrate/route.ts`.
- Blocker: none.
- Next: Test a real human-to-agent handoff with permitted source files and capture improvements from the first use.

## 2026-08-01 - Fish Audio evaluation adapter

- Change: Added an optional Fish Audio TTS endpoint and fieldbook narration control. API keys remain server-side and the adapter is disabled by default, with an environment and UI non-commercial-use gate.
- Evidence: `app/api/narrate/route.ts`, `.env.example`, and Fieldbook narration UI.
- Blocker: Commercial use is prohibited under the current Fish Audio research license without a separate written commercial license; the adapter cannot be used for a paid product, customer work, or internal business use until cleared.
- Next: Add a separately licensed commercial provider or secure written Fish Audio commercial permission before any commercial release.

## 2026-08-01 - Apache-2.0 adopted

- Change: Added Apache License 2.0 with a 2026 John Hughes III copyright notice and documented its code, trademark, and private-source boundary in the public README.
- Evidence: Root `LICENSE` and README License section.
- Blocker: none.
- Next: Add a public contribution guide and roadmap when ready for outside contributors.

## 2026-08-01 - Coach Jae Hugh brand system and public build

- Change: Applied the approved Coach Jae Hugh visual system: black canvas, signal red, bold display hierarchy, systems-first language, and restrained technical metadata. Changed the GitHub repository to public for build-in-public collaboration; the application remains undeployed.
- Evidence: Local browser refresh verified the branded workspace without a runtime overlay; public repo is `https://github.com/jaehugh/Fieldbook`.
- Blocker: A public repository needs a deliberate open-source license before outside code contributions can be accepted under clear terms.
- Next: Choose Fieldbook's license and contribution policy, then add a public roadmap and issue templates.

## 2026-08-01 - Local source workspace rebuilt

- Change: Replaced the thin source-text demo with an actual browser-local intake workspace supporting multiple PDFs, DOCX files, and common text formats; added a project dossier, source inventory, evidence/assumption/test frame, and safer Skill Pack export.
- Evidence: `npm run build` passes after adding local PDF and DOCX extraction dependencies.
- Blocker: Browser/device memory remains the honest practical bound for local files; no arbitrary Fieldbook file limit is imposed.
- Next: Conduct a usability pass with a real permitted PDF and decide whether to introduce a private hosted synthesis service.

## 2026-08-01 - MVP verified and private remote connected

- Change: Verified the local production build and connected the project to private GitHub repository `jaehugh/Fieldbook`.
- Evidence: `npm run build` completed; commit `28d9397` pushed to `origin/main`.
- Blocker: none.
- Next: Jae approves a private usability test and a production privacy/provider decision before adding persistence or inference.

## 2026-08-01 - Private MVP initialized

- Change: Created the Fieldbook project, locally runnable web MVP, source-privacy boundaries, modular architecture notes, and installable Skill Pack export.
- Evidence: `app/page.tsx`, `README.md`, `docs/ARCHITECTURE.md`, and project operating files.
- Blocker: none.
- Next: Run local build verification and create/connect the private GitHub repository.
