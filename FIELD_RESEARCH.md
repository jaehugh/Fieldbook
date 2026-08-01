# Fieldbook’s Recent-Market Check

People change their minds fast. That is why every Fieldbook run with an agent does one required recent-market check before it recommends a test.

## What it does

The agent uses the MIT-licensed [Last30Days skill](https://github.com/mvanhorn/last30days-skill) by Matt Van Horn to look for recent public conversation about this exact project:

- Who the project is for
- What problem it solves
- What outcome people want
- What they already use instead

It looks for useful real-world language: questions, complaints, wishes, objections, and signs people care.

## What it does not do

- It does not send your private PDF, notes, or transcript to the research tool.
- It does not replace your source material.
- It does not turn one online comment into a proven fact.
- It does not run in the browser-only app. It runs in the agent tool after you choose to use an agent.

## The simple order

1. Read the approved project details and private sources.
2. Run Last30Days for the project’s exact scope.
3. Show the research date, links, platforms, and uncertainty.
4. Keep public research and private-source findings in separate sections.
5. Suggest one small experiment for the human to approve.

## If the agent cannot run it

The agent must say so and stop before making the final recommendation. It should ask the human to install Last30Days or choose a different approved research method. It must not pretend the check happened.

## Credit

Fieldbook builds a compatible handoff around the Last30Days skill; it does not copy the skill’s implementation. See [CREDITS.md](CREDITS.md) for the full credit and license note.
