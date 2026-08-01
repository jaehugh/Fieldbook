# Fieldbook architecture notes

## MVP boundary

The current UI is deterministic and browser-local. It validates the product workflow without sending user sources anywhere. The generated Skill Pack is created in memory and downloaded by the browser.

## Future modules

| Module | Responsibility | Privacy/approval boundary |
|---|---|---|
| Source intake | Permission attestation, extraction, source identifiers, local preview | Never train on or publish user material by default. |
| Fieldbook synthesis | Framework map, citations, assumptions, experiments | Send only with an approved inference provider and explicit retention terms. |
| Research adapter | Fresh market context with URLs and access dates | Opt-in per project; outputs remain separately cited from user sources. |
| Skill Pack exporter | Editable `SKILL.md`, optional supporting references | Download-only by default; source excerpts stay minimal and attributed. |
| Audio adapter | Optional narration/export | Provider-isolated. Fish Audio is non-commercial evaluation-only until licensing clearance. |

## Data model direction

`Project`, `Source`, `Claim`, `Assumption`, `Experiment`, `Citation`, and `SkillPack` should remain separate records. A source hash and permission attestation should be stored with each imported source. Do not treat raw source text as the same thing as synthesized recommendations.

## Skill Pack contract

Each generated pack should contain:

1. YAML front matter with an installable name and short description.
2. A clear "When to use" section.
3. Operating principles and decision guardrails.
4. A source-grounded map that identifies source references without reproducing protected text beyond the user's permitted scope.
5. Experiments, confidence labels, and a change-evidence rule.

The structure is intentionally simple so a user can edit it before installing into Codex, Claude Code, Cursor, or another compatible agent environment. Compatibility is a target to test per platform, not a promise of universal installation.
