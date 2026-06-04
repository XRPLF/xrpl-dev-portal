---
paths:
  - "docs/tutorials/**/*.md"
---

# XRPL Tutorial Conventions

These conventions **layer on top of** [doc-style-guide.md](./doc-style-guide.md), which applies to every doc under `docs/`. The rules below only cover what's specific to tutorials — writing style, frontmatter, voice/tense, and naming all inherit from the baseline.

## Source files

- **Starting a new tutorial:** copy [_tutorial-template.md](../../resources/contribute-documentation/_tutorial-template.md) as the initial structure.
- **Full conventions, rationale, and edge cases:** see [tutorial-guidelines.md](../../resources/contribute-documentation/tutorial-guidelines.md).

## Structure

Tutorials use a fixed set of `##` top-level headings, in this order:

1. **Introduction** — 2-3 sentences of what/why/when. Link to concept docs rather than explaining at length.
2. **Goals** — bullet list of what the reader will learn.
3. **Prerequisites** — knowledge, dependencies, on-chain state, amendments.
4. **Source Code** — link to the relevant `_code-samples/` folder via `{% repo-link %}`.
5. **Usage** — only for sample apps with GUIs, CLI flags, or multi-script flows. Omit for single-file linear scripts.
6. **Steps** — numbered `###` subsections (see below).
7. **See Also** — links to related tutorials, references, and concepts.

These structural names are fixed. The baseline's "imperative vs. gerund" heading rule applies to content headings (like step titles), not to these top-level structural markers — don't rename `Prerequisites` to `Prepare prerequisites` to make it imperative.

## Steps

- Each step is a numbered `###` subsection, e.g., `### 1. Install dependencies`
- Heading is imperative, sentence case (consistent with the baseline)
- Target **3-7 steps total**. Fewer suggests the page shouldn't be a tutorial; more suggests splitting into multiple tutorials.
- Each step corresponds to one code snippet (with language tabs).
- If steps depend on prior on-chain state (e.g., another script must run first), add an explicit check step and mention it in Prerequisites.

## Code samples

- **Use `{% code-snippet file="..." %}` markdoc tags. Never copy-paste source into the tutorial** — copy-paste means the doc and the source file silently drift apart.
- Wrap snippets in `{% tabs %}` even when only one language is provided, so future translations and additional languages drop in cleanly.
- Use `from=` and `before=` anchors based on **unique comments in the source file**. The first snippet omits `from=`; the last omits `before=`.
- Sample code lives at `_code-samples/<topic>/<lang>/` with a `README.md` at both the topic root (describes the sample) and per-language subfolder (install + run instructions).
- Don't put critical information *only* in code comments. Tutorial prose is translated; comments are not.

## In-code conventions

- Variable name for the XRPL client instance: `client`
- Use the client library's "submit and wait" function for transactions (autofill + sign + submit in one call)
- WebSocket/JSON-RPC API calls: latest API version, `validated` ledger
- Never hardcode secret keys — fund via faucet, read from an env var, or prompt the user to paste a seed
- Print output to the console **before** doing network operations (helps debugging when something hangs mid-submit)
- Avoid JSON-RPC / WebSocket / commandline as primary sample code — they encourage insecure key handling and can't represent the application logic most tutorials need

## Languages

JavaScript (xrpl.js) and Python (xrpl-py) are the maintained languages. Per the full [Language-specific Guidelines](../../resources/contribute-documentation/tutorial-guidelines.md#language-specific-guidelines):

- **JavaScript:** ES Modules (`import`/`export`, not `require`); `await` over `.then()`; [JavaScript Standard Style](https://standardjs.com); compatible with Node.js maintenance versions; for JSON dumps to console, use `JSON.stringify(obj, null, 2)`.
- **Python:** `JsonRpcClient` by default (use async only when needed); [Black Style](https://black.readthedocs.io/en/stable/); compatible with Python maintenance versions.
