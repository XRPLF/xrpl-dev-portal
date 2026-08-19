# XRPL Brand Update 2026 — Developer Handoff

**Branch:** `xrpl-brand-update-2026` · [PR #3362](https://github.com/XRPLF/xrpl-dev-portal/pull/3362) (WIP)
**Meeting length:** 30 min (≈22 min walkthrough + 8 min Q&A)
**Goal:** Give the team a shared mental model of the refresh, then hand off each system area to a clear owner.

---

## 0:00–4:00 — High-level overview (you lead)

Set the frame before diving into any one area. Cover:

- **What this is:** A full brand + front-end refresh of xrpl.org — not a content rewrite. The scope is design tokens, the component library, navigation, the CSS framework, typography, and the rebranded landing pages.
- **Scale:** ~558 files changed. Most are net-new components, sections, and assets; the docs content itself is largely untouched.
- **Status:** Still WIP. The goal of today is ownership and unblocking, not sign-off.
- **How to run it:** `npm install` then `npm start` for local preview; `npm run build-css` for the production CSS build. Flag that the build pipeline itself changed (covered later).
- **Source of truth:** Design tokens come from the [XRPL.org Design Tokens Figma file](https://figma.com/design/zRyhXG4hRP3Lk3B6Owr3eo/XRPL.org-Design-Tokens). When code and Figma disagree, Figma wins.
- **How we'll run the rest of the meeting:** Six system areas, each gets an owner. Hold deep technical debates for offline — capture them as action items.

> Talking point: emphasize the two big structural shifts everything else hangs off of — **Bootstrap 4 → 5** and the **new design-token system**. Almost every other change is downstream of those two.

---

## 4:00–20:00 — System-area handoffs (one owner each)

### 1. Design tokens & color system — 3 min · Owner: ________

- Old 10-level color scale (100–1000) fully migrated to a new **5-level scale (100–500)**. Backward-compat aliases were **removed** — there is no fallback, so any stale reference breaks.
- Mapping is documented in `COLOR-MIGRATION-SUMMARY.md`. Key files: `styles/_colors.scss`, `styles/light/_light-theme.scss`.
- ⚠️ **Gray/Neutral is intentionally NOT migrated yet** — design tokens weren't ready. Owner needs to track that follow-up.
- New `styles/_spacing.scss` introduces a spacing scale — same principle, use tokens not magic numbers.
- **Owner's first task:** audit for any remaining hard-coded colors / removed token references; confirm dark mode parity.

### 2. Component library — 4 min · Owner: ________

- This is the largest area. New three-tier structure under `shared/`:
  - **`components/`** — primitives (Button, Link, Divider, the Card family, TileLogo, Video, PageGrid, PageWrapper).
  - **`patterns/`** — composites (ButtonGroup, CarouselFeatured, SectionHeader, TileLinks, LinkTextCard).
  - **`sections/`** — page-level blocks (Hero variants, Cards*, Feature*, Callout, Logo grids, etc.).
- Most components ship a co-located `.md` doc and `.scss` — point owner to those as the spec.
- **Owner's first task:** own the component inventory, confirm each has docs + dark mode, and define the "how to add a new section" path for other devs.

### 3. Navigation (navbar + top-nav) — 2.5 min · Owner: ________

- New `styles/_bds-navbar.scss` (~2,500 lines) is a near-complete navbar rebuild.
- `top-nav.yaml` substantially rewritten (~290 lines changed) — this drives nav structure/content.
- New 18×18 navbar icons + dedicated Community icons; `static/js/theme-switch.js` reworked.
- **Owner's first task:** verify nav structure against the IA, check mobile/responsive behavior and the theme toggle.

### 4. Bootstrap 4 → 5 migration — 2.5 min · Owner: ________

- Framework upgraded to Bootstrap 5. `static/js/bootstrap-modal.js` was removed (BS5 handles it natively); `static/vendor/bootstrap.min.js` updated.
- This is the highest-risk area for **regressions** — grid classes, utility renames, and dropped jQuery-style behaviors ripple everywhere.
- **Owner's first task:** sweep for BS4 leftovers (e.g. `.ml-`/`.mr-` spacing utils, removed components) and build a regression checklist.

### 5. Typography & fonts — 2 min · Owner: ________

- Major rework of `styles/_font.scss`, `_font-face.scss`, and new files under `static/font/` (~64 font assets).
- New type scale tied to the brand; check `styles/_font.scss` for the classes.
- **Owner's first task:** confirm font loading/perf (FOUT/FOIT), licensing, and that headings/body render correctly across themes.

### 6. Build pipeline & rebranded content — 2 min · Owner: ________

- **CSS pipeline modernized:** Sass → PostCSS → PurgeCSS/autoprefixer/cssnano. Result is **~42% smaller** uncompressed, ~39% smaller gzipped. See `CSS-OPTIMIZATION-SUMMARY.md` / `CSS-OPTIMIZATION.md`.
- ⚠️ PurgeCSS runs on production builds — dynamically-generated class names can get stripped. Owner must know the safelist.
- Rebranded **home** and **payments** landing pages (`pages/home`, `pages/payments`) plus new imagery under `static/img/payments`.
- New `tools/check-links.py` + `broken-links.txt` and updated `.claude/` rules/commands (incl. Figma build-page command).

---

## 20:00–22:00 — Wrap-up & cross-cutting risks (you lead)

Quick close before questions:

- **Top risks to watch:** removed color aliases (silent breakage), BS5 regressions, PurgeCSS stripping live classes, un-migrated Gray tokens.
- **Dependencies between owners:** tokens → everything; BS5 → components → sections. Sequence merges accordingly.
- **Action items:** each owner leaves with one concrete first task (above) and a date to report back.
- **Open question for the room:** what's the bar to move this PR out of WIP?

---

## 22:00–30:00 — Q&A (5–8 min)

Park anything that turns into a deep technical debate as a follow-up rather than solving live.

---

### Owner assignment grid (fill in live)

| # | Area | Owner | First task | Report-back |
|---|------|-------|-----------|-------------|
| 1 | Design tokens & color | | Audit stale color refs / dark mode | |
| 2 | Component library | | Inventory + "add a section" path | |
| 3 | Navigation | | Verify IA + responsive + theme toggle | |
| 4 | Bootstrap 4→5 | | BS4-leftover sweep + regression list | |
| 5 | Typography & fonts | | Font perf/licensing/render check | |
| 6 | Build & content | | PurgeCSS safelist + landing-page QA | |
