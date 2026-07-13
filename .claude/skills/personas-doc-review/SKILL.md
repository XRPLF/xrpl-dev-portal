---
name: personas-doc-review
description: Review an XRPL documentation page through the reader personas relevant to its type. Detects the doc's section (folder) and topic, fans out the matching persona subagents in parallel, then collates findings and suggested fixes for you to act on. Use when asked to review, audit, or get persona feedback on a docs page.
argument-hint: "docs/path/to/page.md  (optional; defaults to the open/most-recent doc)"
allowed-tools: Agent, Read, Grep, Glob
model: "claude-opus-4-8[1m]"
effort: xhigh
---

# Personas Doc Review

This skill reviews a single XRPL documentation page by fanning out the **reader personas** (subagents in `.claude/agents/`) that are relevant to that page, then collating their findings into one report. It **does not** edit the doc — it reports and waits for you to decide.

The personas are: `business-evaluator`, `founder-explorer`, `newcomer`, `software-engineer`, `infrastructure-architect`, `defi-builder`, `fintech-builder`, `rwa-builder`.

## Execution constraints

- **Never edit the reviewed doc.** Report findings and suggested fixes only, then stop and wait for the user.
- **Output progress** before each major step (resolving the doc, selecting personas, launching the review, collating), so the user can follow along.
- **One doc per run.** If the user points at a folder or multiple files, ask them to pick one.
- **Launch personas in parallel.** Put all the `Agent` calls in a single message, not one at a time.

## Step 1: Resolve the target doc

1. If `$ARGUMENTS` contains a path, use it.
2. Otherwise, use the doc currently open in the editor or the one most recently discussed in the conversation.
3. If neither is available, ask the user for the path. Do not guess.

Confirm the resolved target is a Markdown file under a `docs/` tree (either `docs/...` or a localized `@l10n/<lang>/docs/...`). If it lives outside a `docs/` tree, tell the user this skill is designed for docs pages and ask how to proceed.

Announce the resolved path before continuing.

## Step 2: Determine the doc type (folder) → base persona group

Find the **section**: the path segment immediately following the `docs/` component (e.g. `docs/concepts/tokens/lending-protocol.md` → `concepts`; `@l10n/ja/docs/references/...` → `references`).

Map the section to its base group — the personas whose *altitude* fits this type of doc. These always run for the doc's altitude; **Step 3 separately adds any topic-relevant vertical personas.**

| Section (`docs/<section>/`) | Base persona group |
| --- | --- |
| `introduction` | business-evaluator, founder-explorer, newcomer |
| `concepts` | newcomer, software-engineer, founder-explorer |
| `tutorials` | software-engineer, newcomer, founder-explorer |
| `references` | software-engineer, infrastructure-architect |
| `infrastructure` | infrastructure-architect, software-engineer |
| `use-cases` | business-evaluator, founder-explorer |

The three vertical personas — `defi-builder`, `fintech-builder`, `rwa-builder` — are **not** part of any folder group; Step 3 adds them when the doc's topic matches.

If the section is not one of the six above (e.g. a blog post or `docs/agents`), tell the user the skill targets the standard docs sections and ask whether to proceed with a generalist pair (`software-engineer` + `business-evaluator`) or stop.

## Step 3: Add vertical personas by topic

On top of the Step 2 base group, add the vertical personas whose subject matches *this* doc.

1. **Detect the vertical topic.** Check the file **path** first; if inconclusive, read the doc's frontmatter `seo` and its `#`/`##` headings. Match against:

   | Vertical persona | Topic keywords (and related terms) |
   | --- | --- |
   | `defi-builder` | defi, dex, amm, liquidity pool, lending, loan, order book / clob, swap, slippage |
   | `fintech-builder` | payments, treasury, settlement, stablecoin (RLUSD), remittance, on/off-ramp, tokenized fund |
   | `rwa-builder` | rwa, tokenization, tokenize, MPT / Multi-Purpose Token, issued currency, real-world asset |

2. **Add the matches.** Add each vertical persona whose topic matched to the list. If **no** vertical matched, add none — the base group already covers a general doc.

Announce the final persona list.

## Step 4: Run the selected personas in parallel

Launch one subagent per selected persona **in a single message** using the `Agent` tool, with `subagent_type` set to the persona's name (e.g. `subagent_type: software-engineer`).

Give every persona the **same** instruction so their outputs are comparable:

> Review the documentation page at `<resolved/path.md>` as your persona. Read the file yourself. Follow your own "How to review" protocol exactly and recommend a concrete fix. **Do not flag the `status: not_enabled` frontmatter field or the `{% amendment-disclaimer %}` Markdoc tag as issues** — these render live, up-to-date feature-availability and amendment status on the published page, so availability is already communicated to readers; treat the feature as documented-as-available. Return a structured list of findings only — do not edit the file. If the page is solid for your persona, say so.

Personas are read-only (`Read, Grep, Glob`) and already carry their review lens, so no other setup is needed.

## Step 5: Collate and deduplicate

Gather every persona's findings and merge them into one list:

1. **Group by location.** Findings targeting the same `file:line` or section that describe the same underlying issue are one finding.
2. **Attribute.** For each merged finding, record which persona(s) raised it, always by full persona name (e.g., business-evaluator, fintech-builder), never abbreviations. A finding raised by multiple personas is higher-confidence/priority, so flag it as such.
3. **Severity.** When personas disagree, take the **highest** severity.
4. **Fixes.** Keep the union of distinct suggested fixes. If two personas propose conflicting fixes, present both and note the tension.
5. Keep persona-specific findings (raised by only one lens) — they are not noise; they reflect that reader's specific needs.
6. **Drop known non-issues.** Discard any finding that treats the `status: not_enabled` frontmatter or the `{% amendment-disclaimer %}` tag as a gap (e.g., "the page doesn't say the feature isn't live yet") — those tags render current availability/amendment status automatically, so this is never a real finding.

## Step 6: Report findings and wait

Present a single consolidated report:

- A short summary line (doc path, personas run, finding counts by severity).
- Findings ordered `blocker` → `major` → `minor`. For each, include the location, the issue, which persona(s) flagged it (spell out full persona names — e.g. `business-evaluator`, `founder-explorer` — never abbreviations like "BE"/"FE"), and the **suggested fix**. Mark multi-persona findings.

Then **stop**. Do not modify the doc. Explicitly hand control back to the user — let them choose which findings to act on. Only apply fixes if they ask in a follow-up.
