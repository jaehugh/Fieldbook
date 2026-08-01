# Fieldbook Agent Handoff

Fieldbook is designed for human judgment, agent execution, or a deliberate mix of both.

## Human role

- Supply only source material they have the right to use.
- Define the project outcome, constraints, and decision context.
- Review source-grounded findings, assumptions, experiments, and any outward-facing output.
- Approve any source upload to an agent host or use of an MCP tool.

## Agent role

- Read only the user-approved files attached in its host environment.
- Build a traceable framework map and distinguish evidence from assumptions.
- Suggest experiments, create a `SKILL.md`, and prepare optional narration scripts.
- Use available approved MCP tools for optional capabilities such as research or audio. Never embed or request a provider API key in Fieldbook.

## Handoff sequence

1. Human creates a Fieldbook project and uploads sources locally.
2. Human copies the Agent Handoff packet and attaches any permitted source files in their agent host.
3. Agent performs the scoped work and returns cited, reviewable output.
4. Human accepts, changes, or rejects the recommendation.
5. Agent packages accepted operating rules as a Skill Pack.

## Privacy rule

The Fieldbook browser app does not transmit source files. Attaching a file to an agent host is a separate, explicit human decision.
