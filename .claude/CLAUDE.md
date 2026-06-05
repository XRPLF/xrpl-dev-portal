# XRPL Dev Portal — Claude Code Instructions

## Quick Reference

- **Framework:** Redocly Realm
- **Production branch:** `master`
- **Local preview:** `npm start`

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

If the user agrees, apply the changes directly to the rule file and let the user decide how to commit it.

Before editing, confirm the file is in the project's `.claude/` directory (committed to the repo), not the user-level `~/.claude/` directory. If the correction is more of a personal preference than a project rule, suggest writing it to auto memory instead.

Do not stash, switch branches, or open a PR autonomously — those are workflow decisions for the user.
