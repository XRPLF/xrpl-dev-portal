---
name: generate-release-notes
description: Generate and sort rippled release notes from GitHub commit history
argument-hint: --from <ref> --to <ref> [--date YYYY-MM-DD] [--output <path>]
allowed-tools: Bash, Read, Edit, Write, Grep, Glob
model: "claude-opus-4-8[1m]"
effort: max
---

# Generate rippled Release Notes

This skill generates a draft release notes blog post for a new rippled version, then sorts the entries into the correct subsections.

## Execution constraints

- **Do NOT write scripts** to sort or process the file. Prefer the Edit tool for targeted changes. Use Write only when replacing large sections that are impractical to edit incrementally.
- **Output progress**: Before each major step (generating raw release notes, reviewing file, verifying potential duplicates, processing amendments, sorting entries, reformatting, cleanup), output a brief status message so the user can see progress.

## Step 1: Generate the raw release notes

Run the Python script from the repo root. Pass through all arguments from `$ARGUMENTS`:

```bash
python3 tools/generate-release-notes.py $ARGUMENTS
```

If the user didn't provide `--from` or `--to`, ask them for the base and target refs (tags or branches).

The script will:
- Fetch the version string from `BuildInfo.cpp`
- Fetch all commits between the two refs
- Fetch PR details (title, link, labels, files, description) via GraphQL
- Compare `features.macro` between refs to identify amendment changes
- Auto-sort amendment entries into the Amendments section
- Output all other entries as unsorted with full context

## Step 2: Review the generated file

Read the output file (path shown in script output). Note the **Full Changelog** structure:
- **Amendments section**: Contains auto-sorted entries and an HTML comment listing which amendments to include or remove. Entries are auto-sorted here by touching `features.macro`, so the section sometimes catches PRs that aren't actually about a specific amendment (e.g. macro renames, list-sorting, formatting cleanups).
- **Empty subsections**: Features, Breaking Changes, Bug Fixes, Refactors, Documentation, Testing, CI/Build
- **Unsorted entries**: After the **Bug Bounties and Responsible Disclosures** section is an unsorted list of entries with title, link, labels, files, and description for context
- **Potential duplicates**: Some entries are prefixed with `[POTENTIAL DUPE — VERIFY]`. These are reviewer scaffolding and must be handled in Step 3 before sorting.

## Step 3: Verify and remove potential duplicate entries

Some entries are prefixed with `[POTENTIAL DUPE — VERIFY]` at the start of their title. They represent changes that already shipped in an earlier release. They are scaffolding for the reviewer only — they must NOT appear in the published release notes.

Their purpose is to help spot cherry-picked commits that already went into an earlier release, but their original commits may falsely show up again as a new change.

For each entry with the `[POTENTIAL DUPE — VERIFY]` prefix:

1. Read its title (the text after the dupe marker).
2. Scan the other (unmarked) entries for one that describes the same logical change with a slightly different title. Consider:
  - Typos or missing words (e.g. `overwriting` vs `overwritting`, missing `the`)
  - Different PR-number suffixes from a backport (e.g. `(#6217)` vs `(#6217) (#6957)`)
  - Same PR number with reworded title
  - Same author and same general topic
  - Use additional context provided in dupe and comparison entry if the title match is borderline
3. **If a match is found**:
  - Delete the `[POTENTIAL DUPE — VERIFY]` entry.
  - **Also delete the matched entry** — it represents a change that already shipped in a previous release, so it does NOT belong in this release's notes.
4. **If no match is found**:
  - Delete the `[POTENTIAL DUPE — VERIFY]` entry only.

By the end of this step, **every** `[POTENTIAL DUPE — VERIFY]` entry must be removed.

## Step 4: Process amendments

Handle Amendments first, before sorting other entries.

1. **Process the auto-sorted Amendments subsection**:
  If an entry's title and description don't introduce, enable, retire, or fix a named amendment, it was auto-sorted here by mistake — move it to the appropriate other section (typically Refactors or CI/Build) instead of applying the rules below.

  The HTML comment contains three lists — follow them exactly:
  - **Include**: Keep these entries.
  - **Exclude**: Remove these entries.
  - Entries on **neither** list: Remove these entries.

2. **Scan unsorted entries for unreleased amendment work**:
  Search through ALL unsorted entries for titles, labels, descriptions, or files that reference amendments on the "Exclude" or "Other amendments not part of this release" lists. Remove entries that directly implement, enable, fix, or refactor these amendments. Keep entries that are general changes that merely reference the amendment as motivation — if the code change is useful on its own regardless of whether the amendment ships, keep it.

3. If you disagree with any amendment decisions, make a note to the user but do NOT deviate from the rules.

## Step 5: Sort remaining unsorted entries into subsections

Move each remaining unsorted entry into the appropriate subsection.

Use these signals to categorize:

**Files changed** (strongest signal):
- Only `.github/`, `CMakeLists.txt`, `conan*`, CI config files → **CI/Build**
- Only `src/test/`, `*_test.cpp` files → **Testing**
- Only `*.md`, `docs/` files → **Documentation**

**Labels** (strong signal):
- `Bug` label → **Bug Fixes**

**Title prefixes** (medium signal):
- `fix:` → **Bug Fixes**
- `feat:` → **Features**
- `refactor:` → **Refactors**
- `docs:` → **Documentation**
- `test:` → **Testing**
- `ci:`, `build:`, `chore:` → **CI/Build**

**Description content** (when other signals are ambiguous):
- Read the PR description to understand the change's purpose
- PRs that change API behavior, remove features, or have "Breaking change" checked in their description → **Breaking Changes**

Additional sorting guidance:
- Watch for revert pairs: If a PR was committed and then reverted (or vice versa), check that the net effect is accounted for — don't include both.

## Step 6: Reformat sorted entries

After sorting, reformat each entry to match the release notes style.

**Amendment entries** should follow this format:
```markdown
- **amendmentName**: Description of what the amendment does. ([#1234](https://github.com/XRPLF/rippled/pull/1234))
```
- Use more detail for amendment descriptions since they are the most important. Use present tense.
- If there are multiple entries for the same amendment, merge into one, prioritizing the entry that describes the actual amendment.

**Feature and Breaking Change entries** should follow this format:
```markdown
- Description of the change. ([#1234](https://github.com/XRPLF/rippled/pull/1234))
```
- Keep the description concise. Use past tense.

**All other entries** should follow this format:
```markdown
- The PR title of the entry. ([#1234](https://github.com/XRPLF/rippled/pull/1234))
```
- Copy the PR title as-is. Only fix capitalization, remove conventional commit prefixes (fix:, feat:, ci:, refactor:, docs:, test:, chore:, build:), and adjust to past tense if needed. Do NOT rewrite, paraphrase, or summarize.

## Step 7: Clean up

- Add a short and generic description of changes to the existing `seo.description` frontmatter, e.g., "This version introduces new amendments and bug fixes." Do not create long lists of detailed changes.
- Add a more detailed summary of the release to the existing "Introducing XRP Ledger version X.Y.Z" section. Include amendment names (organized in a list if more than 2), features, and breaking changes. Limit this to 1 paragraph.
- Do NOT delete the **Credits** or **Bug Bounties and Responsible Disclosures** sections
- Remove empty subsections that have no entries
- Remove all HTML comments (sorting instructions)
- Do a final review of the release notes. If you see anything strange, or were forced to take unintuitive actions by these instructions, notify the user, but don't make changes.
