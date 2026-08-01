# Fieldbook Current-Market Research Lane

Fieldbook treats current-market research as a separate evidence layer. It never silently mixes current social/web signals with a user's private source material.

## Native workflow

1. A human or agent fills the project dossier and attaches permitted source material.
2. The generated Fieldbook Skill Pack automatically invokes `/last30days` with a query scoped to the project, audience, problem, desired outcome, and alternatives.
3. The agent returns dated, attributable findings with uncertainty intact and merges them into the final Fieldbook.
4. The human decides what experiment to run.

## Required research output

- The exact research question and run date.
- URLs, platform/source attribution, and observed dates.
- Customer language, objections, alternatives, and demand signals.
- Clear separation of current evidence, Fieldbook-source evidence, assumptions, and proposals.
- One proposed experiment, subject to human approval.

## Privacy rule

The automatic Last30Days research request does not include Fieldbook source files. Attaching any private file to an agent host remains a separate explicit human decision.

## Credit

This research lane is powered by the MIT-licensed [last30days skill](https://github.com/mvanhorn/last30days-skill) by Matt Van Horn (`mvanhorn`). Fieldbook does not copy its implementation; it creates a compatible agent handoff and preserves attribution.
