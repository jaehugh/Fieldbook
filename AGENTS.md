# Fieldbook — Project Agent Guide

## Purpose

Fieldbook is a private, bring-your-own-source operating-guide generator. It converts user-supplied material that the user is entitled to use into a framework map, clearly labeled assumptions, practical experiments, and an editable/downloadable Skill Pack.

## Status and next gate

- Status: private local MVP; not published.
- Next gate: Jae approves a test with permitted, non-sensitive material and selects a persistence/authentication approach before any hosted or multi-user build.

## Authoritative files

- `README.md` — product orientation and run instructions.
- `docs/ARCHITECTURE.md` — boundaries, data model direction, and adapters.
- `app/page.tsx` — MVP experience and local Skill Pack generator.
- `TASKS.md` — active delivery queue.
- `SESSION_LOG.md` — append-only receipts.

## Boundaries

- Inherit the vault root `AGENTS.md` in full.
- Keep user-provided source material private by default. Do not add real source files, client data, credentials, or copyrighted books to this repository.
- Do not claim to reproduce, replace, distribute, or rewrite copyrighted material. Outputs must distinguish source-grounded observations, assumptions, and proposals.
- Keep Fieldbook unpublished until Jae explicitly approves publication.
- Market research must use a separately enabled adapter and cite its sources. Audio adapters remain optional; Fish Audio is non-commercial evaluation-only unless licensing is independently verified and approved.
- Skill Packs are user-editable `SKILL.md` files, compatible in spirit with agentic coding environments. Preserve attribution for third-party patterns; do not copy third-party source text unless the license permits it and required notices are included.

## Project receipts

After material work, update `TASKS.md` and append `SESSION_LOG.md`. Update root `index.md` and `log.md` when project visibility or cross-vault status changes.
