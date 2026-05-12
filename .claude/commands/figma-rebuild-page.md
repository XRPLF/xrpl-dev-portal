# Figma Page Rebuild

Rebuild a `.page.tsx` file from a Figma design URL by mapping each Figma section to an existing shared section component.

**Usage:** `/figma-rebuild-page <figma-url> <target-page-file>`

**Example:** `/figma-rebuild-page https://www.figma.com/design/7vhTxPgH1in2AjIETuX49Z/Documentation?node-id=0-1 docs/index.page.tsx`

---

## Workflow

### Step 1 — Parse the input

Extract from `$ARGUMENTS`:
- **Figma URL**: extract `fileKey` and `nodeId` (convert `-` to `:` in nodeId)
- **Target file**: the `.page.tsx` file path to rebuild

### Step 2 — Understand the design structure

Run in parallel:
1. Call `mcp__claude_ai_Figma__get_metadata` with the `fileKey` and `nodeId` (use `0:1` to get the full page if no nodeId given) to get the full section list
2. Read the current target page file to understand what already exists
3. Run `find shared/sections -name "*.tsx"` and `find shared/components -name "*.tsx"` to inventory available components

### Step 3 — Fetch design context for each section

For every top-level section frame found in the metadata, call `mcp__claude_ai_Figma__get_design_context` in parallel batches (max 3 at a time). Focus on:
- The heading/title text
- Any body/description text
- All link labels and their annotation `href` values (from `data-annotations`)
- Color variants visible (background color tells you which variant to use)
- The arrangement (left/right, content vs media position)

**Important:** Note any Figma annotations that say content should be removed or changed.

### Step 4 — Map sections to existing components

For each Figma section, find the best matching component from `shared/sections/`. Common mappings:

| Figma Section Name | Component | Import |
|---|---|---|
| `headerHeroPrimaryMedia` | `HeaderHeroPrimaryMedia` (default export) | `shared/sections/HeaderHeroPrimaryMedia/HeaderHeroPrimaryMedia` |
| `CarouselCardListOffGrid` | `CarouselCardList` | `shared/sections/CarouselCardList/CarouselCardList` |
| `TextGridCard` | `CardsTextGrid` | `shared/sections/CardsTextGrid/CardsTextGrid` |
| `VideoFeatured` | `FeaturedVideoHero` (default export) | `shared/sections/FeaturedVideoHero/FeaturedVideoHero` |
| `LinkSmallGrid` | `LinkSmallGrid` | `shared/sections/LinkSmallGrid/LinkSmallGrid` |
| `LinkTextDirectory` | `LinkTextDirectory` | `shared/sections/LinkTextDirectory/LinkTextDirectory` |
| `FeatureTwoColumn` | `FeatureTwoColumn` | `shared/sections/FeatureTwoColumn/FeatureTwoColumn` |
| `LinkSmallTiles` | `SmallTilesSection` | `shared/sections/SmallTilesSection/SmallTilesSection` |
| `IconTextGridCard` | `CardsIconGrid` | `shared/sections/CardsIconGrid/CardsIconGrid` |
| `StandardCard` group | `StandardCardGroupSection` | `shared/sections/StandardCardGroupSection/StandardCardGroupSection` |

Read the prop interfaces of each matched component before writing (`head -60` of the component file is usually enough).

**Key prop notes:**
- `HeaderHeroPrimaryMedia` / `FeaturedVideoHero` — **default exports**; all others are named exports
- `FeaturedVideoHero` video source: `{ type: 'embed', embedUrl: 'https://www.youtube.com/embed/VIDEO_ID' }`
- `FeatureTwoColumn` `description` prop is required — pass `""` if the Figma shows no body text
- `LinkTextDirectory` buttons use `ButtonConfig`: `{ label: string; href?: string }`
- `StandardCardGroupSection` callsToAction uses `DesignConstrainedButtonProps`: `{ children: ReactNode; href?: string }`
- `CardsTextGrid` / `CardsIconGrid` `description` field accepts `React.ReactNode` — use this for inline links
- `SmallTilesSection` uses existing logo assets: `require('../static/img/logos/javascript.svg')` etc.

### Step 5 — Determine color variants from Figma

Match Figma background colors to component variant props:
- White / `#ffffff` → `"neutral"` or `"gray"` (default)
- Green `#70ee97` / `#21e46b` → `"green"`
- Lilac/purple `#d9caff` → `"lilac"`
- Yellow → `"yellow"`

### Step 6 — Write the implementation (Plan Mode)

Present a plan first showing:
- All sections in order with their mapped component
- The full content (text, links, variants) for each section
- Any content removed per Figma annotations

After approval, write the full `.page.tsx`:
1. Keep the existing `frontmatter` export (SEO metadata)
2. Import all section components at the top
3. Render sections in Figma order inside a wrapper `<div className="landing">`
4. Use placeholder `src=""` for all images (the user will supply real assets)
5. Apply all link `href` values from Figma `data-annotations`
6. Use `React.ReactNode` descriptions to embed inline links where headings link to pages

### Step 7 — Fix TypeScript errors

After writing, check IDE diagnostics and fix:
- Default vs named export mismatches
- Wrong video source type (`type: 'embed'` not `type: 'embed_url'`)
- Missing required props
- `callsToAction` tuple shape `[primary, secondary?]`

---

## Rules

- **Never install Tailwind** — the project uses SCSS + Bootstrap
- **Never create new components** — only use what exists in `shared/sections/` and `shared/components/`
- **Always apply links** from Figma annotations to make lists navigable
- **Respect Figma notes** — if a section is annotated for removal, skip it
- **Light mode only** — follow the light mode variant of any design that shows both
- **Images are placeholders** — pass `src=""` unless the existing codebase already has the asset
