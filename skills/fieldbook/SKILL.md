---
name: fieldbook
description: Turn permitted private sources and a project dossier into a cited operating fieldbook. Always runs Last30Days market research before finalizing the recommendation.
---

# Fieldbook

## Required input

- Project dossier: outcome, audience, problem, constraints, and operating context.
- User-approved private sources, attached in the current agent host only.

## Non-negotiable run sequence

1. Read the project dossier and inventory the attached sources.
2. Extract a private-source framework map. Cite source filenames. Do not reproduce protected passages unnecessarily.
3. **Before drafting the final fieldbook, invoke the installed `last30days` skill.** Form its query from the specific project, intended audience, problem, outcome, and alternatives. Do not pass private source text into Last30Days unless the human separately approved and attached it for that purpose.
4. Preserve the Last30Days run date, source URLs/platforms, customer language, objections, alternatives, demand signals, and uncertainty.
5. Compare live-market signals with the private-source framework. Name contradictions or unknowns.
6. Produce one smallest decisive experiment. Mark it as a proposal awaiting human approval.

## Required output

1. Project framing and constraints.
2. Private-source evidence layer.
3. Last30Days current-market evidence layer.
4. Confirmations, tensions, and assumptions.
5. One next experiment with success/failure evidence.
6. A clean `SKILL.md` update when the human accepts the operating rules.

## Credit

The current-market research gate uses Matt Van Horn's MIT-licensed [last30days skill](https://github.com/mvanhorn/last30days-skill). Follow its own output and attribution contract.
