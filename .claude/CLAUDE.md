# XRPL Dev Portal — Claude Code Instructions

## Quick Reference

- **Framework:** Redocly Realm
- **Production branch:** `master`
- **Local preview:** `npm start`
- **Markdoc tags:** `resources/contribute-documentation/markdoc-tags.md`

## XRPL Reference Sources

For up-to-date XRPL protocol, API, or SDK info, use the `xrpl-docs` MCP server. Prefer this over web search or memory when writing code samples, documenting protocol behavior, or answering SDK API questions. The following authoritative sources are indexed weekly:

- [xrpl.org](https://xrpl.org/docs): The official developer portal for up-to-date XRPL docs, including use cases, concepts, tutorials, references, and code samples.
- [opensource.ripple.com](https://opensource.ripple.com/): The technical doc site for all features in development by Ripple.
- [docs.xrplevm.org](https://docs.xrplevm.org/): The technical doc site for the XRPL EVM Sidechain.
- [XRPL-Standards](https://github.com/XRPLF/XRPL-Standards): The repo for community defined suggestions, proposals, and feature specifications for the XRPL.
- [XRPL JavaScript SDK](https://github.com/xrplf/xrpl.js)
- [XRPL Python SDK](https://github.com/xrplf/xrpl-py)

If `xrpl-docs` isn't available, use the `xrpl.org` MCP server (xrpl.org content only) as a fallback. Only call the `search` tool when using `xrpl.org`.

## Localization

- Default: `en-US`
- Japanese: `ja`
- Translations mirror `docs/` structure under `@l10n/<language-code>/`

## Navigation

- Update `sidebars.yaml` when adding new doc pages
- Blog posts have a separate `blog/sidebars.yaml`
- Redirects go in `redirects.yaml`

## Self-improvement

If you encounter a situation where a rule or skill file is wrong or contradicts what you've verified, flag the issue to the user with a link to the specific file and propose changes. Ask whether to update.

Examples of when to flag an issue:
- The user corrects you on something a rule should have covered or got wrong
- You verify code/docs that disprove a claim in a rule
- A rule references a file or behavior that no longer exists

If the user agrees, apply the changes directly to the file and let the user decide how to commit it.

Before editing, confirm the file is in the project's `.claude/` directory (committed to the repo), not the user-level `~/.claude/` directory. If the correction is more of a personal preference than a project rule, suggest writing it to auto memory instead.

## Token Efficiency

If the conversation has accumulated significant context (~50+ exchange pairs, or you've worked through several distinct subtasks) AND the user moves to a new topic that doesn't depend on prior history, suggest cleaning up context:

- Suggest `/compact` when some prior context (corrections, decisions, preferences) still matters but most of the message bulk is unrelated. Compaction keeps a summary.
- Suggest `/clear` when the new topic is genuinely standalone and nothing prior carries forward.

Don't suggest either if the conversation is short or if recent turns include user corrections, preferences, or rules-of-the-road that the new topic still benefits from.
