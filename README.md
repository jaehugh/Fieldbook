# Fieldbook

Turn your own notes into a simple plan you can use.

Fieldbook is a free, local-first tool for people and AI agents. Give it source material you are allowed to use (like your notes, a PDF, a transcript, or a document) and tell it about your project. It helps make a practical Fieldbook: what matters, what is still a guess, and what to try next.

**Your files stay on your computer in this first version.** Fieldbook does not have accounts, uploads, a database, or a secret file-size limit.

## Try it in five minutes

1. Download or clone this project.
2. Open the `Fieldbook` folder in a terminal.
3. Run `npm install` once.
4. Run `npm run dev`.
5. Open the local link it shows (usually `http://localhost:3000`).
6. Add a file and fill in the project questions.
7. Click **Generate Fieldbook**.

That is it. You can download the result as a small `SKILL.md` file for an AI coding tool, or use the plan yourself.

## What to put in it

### Good source material

- Your meeting notes
- A PDF you own or are allowed to use
- A transcript you made
- Your research notes
- A webpage saved as text

### Good project details

Tell Fieldbook:

- What you want to make or improve
- Who it is for
- What problem it solves
- What you already tried
- What you cannot do yet (time, money, rules, tools, and so on)

More helpful details make a better plan. You do not have to start with only one short idea.

## What happens next

Fieldbook makes three clear buckets:

| Bucket | Meaning |
| --- | --- |
| **Source signal** | Something your files actually say. |
| **Assumption** | Something that may be true, but still needs a check. |
| **Next experiment** | A small, safe test to learn what works. |

It also makes an editable Skill Pack called `SKILL.md`. An agent can read that file as instructions for helping with the same project.

## Using it with an AI agent

The browser app is a private workspace. It does not send your files anywhere.

If you want an agent to help:

1. Download the Skill Pack.
2. Attach only the source files you approve in your agent tool.
3. Give the agent the Skill Pack.
4. Ask it to run Fieldbook and show its work.
5. Review the answer before acting on it.

Every real Fieldbook agent run includes a required **Last30Days** check. The agent looks for recent, public market signals about *your* project, then keeps those findings separate from your private files. It must show dates, links, and uncertainty before suggesting a final experiment. The browser alone cannot run this step because it deliberately does not connect to agent tools or the web.

Read the copy-and-paste agent instructions in [AGENT_HANDOFF.md](AGENT_HANDOFF.md). Read the simple research rules in [FIELD_RESEARCH.md](FIELD_RESEARCH.md).

## Things Fieldbook will not do

- It will not include books, PDFs, or client files in this public repository.
- It will not turn a copyrighted book into a replacement for that book.
- It will not pretend a guess is a fact.
- It will not upload your files behind your back.
- It will not promise that every AI tool reads Skill Packs in exactly the same way.

Please use only material you own or have permission to use.

## No file limit? The honest answer

Fieldbook does not set a file count or file-size cap. Your computer and browser are the real limit. A very large PDF can still be slow or make a browser run out of memory. Start with a small, non-sensitive test file first.

## For contributors

Want to help? Try the app with fake or permitted sample material, report what felt confusing, or improve the interface and docs. Never put real customer files, personal data, passwords, or copyrighted books in an issue, pull request, screenshot, or commit.

Fieldbook uses the [Apache License 2.0](LICENSE) for its code. The Fieldbook name and logo/brand are not automatically licensed, and your source material always remains yours.

## Credits

Fieldbook is inspired by open work from people in the agent community. The product uses no copied private books or source libraries. See [CREDITS.md](CREDITS.md) for clear credit and license notes.

## More details

- [Quick agent handoff](AGENT_HANDOFF.md)
- [How the recent-market check works](FIELD_RESEARCH.md)
- [Technical architecture](docs/ARCHITECTURE.md)
- [Contributor task list](TASKS.md)
