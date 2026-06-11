# XRPL Dev Portal — Claude Code Instructions

## Quick Reference

- **Framework:** Redocly Realm
- **Production branch:** `master`
- **Local preview:** `npm start`

## XRPL Reference Sources

For up-to-date XRPL protocol, API, or SDK info, use the `context7` MCP server. The following authoritative sources are indexed:

### Documentation Sites

- `/websites/xrpl` — xrpl.org (this dev portal's published content)
- `/websites/opensource_ripple` — opensource.ripple.com (Ripple's open-source projects)
- `/websites/xrplevm` — docs.xrplevm.org (XRPL EVM sidechain)

### Protocol Implementation

- `/xrplf/rippled` — rippled (C++ reference implementation; authoritative for protocol behavior, transaction validation, and ledger entry structure)

### SDK Libraries

- `/xrplf/xrpl-py` — Python
- `/xrplf/xrpl.js` — JavaScript / TypeScript
- `/xrplf/xrpl-go` — Go
- `/xrplf/xrpl4j` — Java

Since the library IDs are listed above, skip `mcp__context7__resolve-library-id` and call `mcp__context7__query-docs` directly with the relevant ID. Prefer this over web search or memory when writing code samples, documenting protocol behavior, or answering SDK API questions.

### Live xrpl.org Content

Use the `xrpl-dev-portal` MCP server (xrpl.org content only) as a fallback if `context7` is unavailable. **Only `mcp__xrpl-dev-portal__search` is functional**. Do not call the other tools.

## Localization

- Default: `en-US`
- Japanese: `ja`
- Translations mirror `docs/` structure under `@l10n/<language-code>/`

## Navigation

- Update `sidebars.yaml` when adding new doc pages
- Blog posts have a separate `blog/sidebars.yaml`
- Redirects go in `redirects.yaml`
