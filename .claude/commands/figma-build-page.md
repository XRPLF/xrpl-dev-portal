# Figma Build Page

Build a `.page.tsx` file from a Figma design URL by mapping each Figma section to an existing shared section component, and export any new images/icons from Figma into the project's asset folders.

**Usage:** `/figma-build-page <figma-url> <target-page-file>`

**Example:** `/figma-build-page https://www.figma.com/design/7vhTxPgH1in2AjIETuX49Z/Documentation?node-id=0-1 docs/index.page.tsx`

---

## Workflow

### Step 1 — Parse the input

Extract from `$ARGUMENTS`:
- **Figma URL**: extract `fileKey` and `nodeId` (convert `-` to `:` in nodeId)
- **Target file**: the `.page.tsx` file path to rebuild
- **Page slug**: derive from the target file path (e.g. `docs/index.page.tsx` → `docs`, `resources/about.page.tsx` → `resources-about`). This is used to prefix shared media filenames.

### Step 2 — Understand the design structure

Run in parallel:
1. Call `mcp__claude_ai_Figma__get_metadata` with the `fileKey` and `nodeId` (use `0:1` to get the full page if no nodeId given) to get the full section list
2. Read the current target page file to understand what already exists
3. Run `find shared/sections -name "*.tsx"` and `find shared/components -name "*.tsx"` to inventory available components
4. Run `find static/img/icons/2026 static/img/logos/black static/img/bds-2026 -type f` to inventory existing assets so the build can reuse them instead of re-exporting duplicates

**Locate the Assets frame.** Designers frequently park clean, isolated versions of the page's icons and media in a sibling frame on the same canvas — typically named `Assets`, `Assets Library`, `Exports`, or similar. From the metadata in step 1, identify any such frame (it lives outside the main `LG`/`MD`/`SM` page frames, often to the right). Record:
- Its `nodeId` and name
- The `nodeId` and layer name of every child node (each child is usually a single icon, photo, or component instance ready to export)

This Assets frame becomes the **preferred source** for asset exports in Step 7 because its children are isolated (no surrounding section chrome) and rendered at canonical export sizes. The main page frames often reference these via instances, so a node found inline may just be a thumbnail — the Assets frame holds the real artwork.

### Step 3 — Fetch design context for each section

For every top-level section frame found in the metadata, call `mcp__claude_ai_Figma__get_design_context` in parallel batches (max 3 at a time). Focus on:
- The heading/title text
- Any body/description text
- All link labels and their annotation `href` values (from `data-annotations`)
- Color variants visible (background color tells you which variant to use)
- The arrangement (left/right, content vs media position)
- Every distinct image/icon node — capture its Figma `nodeId`, layer name, fill color, and visual role (icon vs photo, monochrome vs colored)

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
- `SmallTilesSection` uses existing logo assets: `require('../static/img/logos/black/javascript.svg')` etc.

### Step 5 — Determine color variants from Figma

Match Figma background colors to component variant props:
- White / `#ffffff` → `"neutral"` or `"gray"` (default)
- Green `#70ee97` / `#21e46b` → `"green"`
- Lilac/purple `#d9caff` → `"lilac"`
- Yellow → `"yellow"`

### Step 6 — Plan asset exports

For every image/icon node identified in Step 3, decide:

**A) Reuse vs export:** If a visually-equivalent asset already exists in the inventory from Step 2 (same role, same color), reuse its path and skip export. Otherwise schedule a new export.

**B) Target folder** — route by section type and asset role:

| Section / role | Folder | Format |
|---|---|---|
| `CarouselCardList` card icons (monochrome glyphs) | `static/img/icons/2026/black/` | `.svg` |
| `CardsIconGrid` card icons (colored glyphs) | `static/img/icons/2026/color/<color>/` | `.svg` |
| `SmallTilesSection` card icons (SDK / language logos) | `static/img/logos/black/` | `.svg` |
| `HeaderHeroPrimaryMedia` hero media (photo) | `static/img/bds-2026/` | `.jpg` |
| `FeatureTwoColumn` media (photo) | `static/img/bds-2026/` | `.jpg` |
| `FeaturedVideoHero` poster (if used) | `static/img/bds-2026/` | `.jpg` |
| Any other colored decorative icon | `static/img/icons/2026/color/<color>/` | `.svg` |
| Any other monochrome icon | `static/img/icons/2026/black/` | `.svg` |

For the colored-icon folders, pick `<color>` from the Figma fill on the icon (or, if the icon inherits color from a parent component, the parent section's variant prop). Existing folders: `lilac`. Create a new sibling folder (`green`, `yellow`, etc.) if the design uses a new color — never dump differently-colored icons into the wrong folder.

**C) Filename — always kebab-case:**

1. Start from the Figma layer name.
2. Lowercase, replace spaces / underscores / camelCase boundaries with `-`, strip non-`[a-z0-9-]`.
3. For shared photographic media in `bds-2026/`, **prefix with the page slug** to avoid cross-page collisions:
   - hero media → `<page-slug>-hero-media.jpg`
   - feature media (multi) → `<page-slug>-feature-media-1.jpg`, `<page-slug>-feature-media-2.jpg`, …
4. Icons and SDK logos are not page-prefixed — they're meant to be reusable across pages.

Examples:
- Figma layer `Ready to Use Code Samples` (CarouselCardList icon) → `static/img/icons/2026/black/ready-to-use-code-samples.svg`
- Figma layer `XRPL Server` (CardsIconGrid icon, lilac fill) → `static/img/icons/2026/color/lilac/xrpl-server.svg`
- Figma layer `Hero Image` on `docs/index.page.tsx` → `static/img/bds-2026/docs-hero-media.jpg`
- Figma layer `Feature 02` on `resources/about.page.tsx` → `static/img/bds-2026/resources-about-feature-media-2.jpg`

### Step 7 — Export the assets from Figma

For each scheduled export from Step 6:

1. Ensure the target folder exists (`mkdir -p` it if not).
2. Attempt to export the asset from Figma via the MCP:
   - **SVG icons:** call `mcp__claude_ai_Figma__get_design_context` on the icon node and look for inline SVG markup in the response; if present, write it to the target path. If not, fall back to step 4 below.
   - **Photographic media (JPG):** call `mcp__claude_ai_Figma__get_screenshot` on the node with a sensible scale and save the returned image to the target path as `.jpg`.
3. If the MCP returns a URL/binary reference rather than raw content, download it with `curl -L -o <target> <url>`.
4. **Fallback when export fails or returns nothing usable:** create a zero-byte placeholder file at the target path AND record `{ figmaNodeId, layerName, targetPath, reason }` in a `MISSING_ASSETS` list. Do not silently drop the asset.

After all attempted exports, run `ls -la` on each unique target folder so the user can see what landed.

### Step 8 — Write the implementation (Plan Mode)

Present a plan first showing:
- All sections in order with their mapped component
- The full content (text, links, variants) for each section
- Any content removed per Figma annotations
- **The asset manifest**: for every image/icon, show `figma layer → target path → status (exported | reused | missing)`

After approval, write the full `.page.tsx`:
1. Keep the existing `frontmatter` export (SEO metadata)
2. Import all section components at the top
3. **Import and use the translate hook inside the default-exported component:**
   ```tsx
   import { useThemeHooks } from '@redocly/theme/core/hooks';
   // ...
   export default function MyPage() {
     const { useTranslate } = useThemeHooks();
     const { translate } = useTranslate();
     return (/* ... */);
   }
   ```
4. **Wrap every user-facing string in `translate(...)`** — this includes every prop value that renders as visible text. No bare string literals in JSX text or text-bearing props. Apply to:
   - `headline`, `subtitle`, `title`, `description`, `heading`, `label`, `iconAlt`, `alt` props
   - Every entry's `title`, `description`, `label`, `heading` inside `cards`, `links`, `buttons` arrays
   - `children` strings (including `callsToAction[].children` on `StandardCardGroupSection`)
   - Inline-link anchor text inside `React.ReactNode` descriptions (e.g. `<a href="...">{translate('Read More')}</a>`)
   - **Do not** translate URLs (`href`, `src`), variant strings (`"green"`, `"left"`), or `embedUrl` values
   - Example pattern (mirrors the project's house style):
     ```tsx
     <HeaderHeroPrimaryMedia
       headline={translate("XRP Ledger (XRPL) Documentation")}
       subtitle={translate("Explore XRPL documentation with our essential guide for developers and admins who want to start building and integrating with the XRP Ledger.")}
       media={{ type: 'image', src: require('../static/img/bds-2026/docs-hero-media.jpg'), alt: translate('XRPL Documentation') }}
     />
     ```
5. Render sections in Figma order inside a wrapper `<div className="landing">`
6. For every image/icon, reference it via `require('../static/img/...')` using the exact path from the manifest — even if the export failed (the placeholder file holds the path)
7. Apply all link `href` values from Figma `data-annotations`
8. Use `React.ReactNode` descriptions to embed inline links where headings link to pages

### Step 9 — Fix TypeScript errors

After writing, check IDE diagnostics and fix:
- Default vs named export mismatches
- Wrong video source type (`type: 'embed'` not `type: 'embed_url'`)
- Missing required props
- `callsToAction` tuple shape `[primary, secondary?]`

### Step 10 — Report

End the run by printing:
- The list of exported assets and their final paths
- The `MISSING_ASSETS` list (if any) so the user knows exactly which Figma nodes need manual export
- The full target file path

---

## Rules

- **Never install Tailwind** — the project uses SCSS + Bootstrap
- **Never create new components** — only use what exists in `shared/sections/` and `shared/components/`
- **Always apply links** from Figma annotations to make lists navigable
- **Respect Figma notes** — if a section is annotated for removal, skip it
- **Light mode only** — follow the light mode variant of any design that shows both
- **Always use `require('../static/img/...')` for images** — every image/icon prop must point at a real path under `static/img/` following the folder routing in Step 6. Never pass `src=""` and never inline a remote URL.
- **Kebab-case all new asset filenames.** Shared photographic media in `bds-2026/` must be prefixed with the page slug; icons and logos are not page-prefixed.
- **Reuse existing assets** when the inventory in Step 2 already has a matching icon/logo — do not re-export duplicates with new names.
- **Never delete or overwrite an existing asset** without explicit user confirmation. If an export would collide with an existing file, rename the new export with a `-2` suffix and flag it in the plan.
- **Always use `translate(...)` for visible text.** Import `useThemeHooks` from `@redocly/theme/core/hooks`, call `const { useTranslate } = useThemeHooks(); const { translate } = useTranslate();` at the top of the component, and wrap every user-facing string in `translate(...)`. Never leave a bare string literal in a text-bearing prop or as JSX text. URLs, variant enums, and embed URLs are not text — leave those untranslated.
