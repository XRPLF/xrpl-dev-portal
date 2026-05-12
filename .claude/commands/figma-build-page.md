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
1. Read the current target page file to understand what already exists
2. Run `find shared/sections -name "*.tsx"` and `find shared/components -name "*.tsx"` to inventory available components
3. Run `find static/img/icons/2026 static/img/logos/black static/img/bds-2026 -type f` to inventory existing assets so the build can reuse them instead of re-exporting duplicates
4. Call `mcp__claude_ai_Figma__get_metadata` on the **page root** (the parent of the `nodeId` you were given) — pass `nodeId="0:1"` if you don't know the page id, otherwise walk up one level from the given node. The goal is to see ALL sibling frames on the canvas, not just the LG/MD/SM page mockups. Section frames alone are not enough — designers also park reference data in sibling frames.

#### Step 2A — Locate the Assets frame (REQUIRED, do this before anything else design-side)

Designers park clean, isolated versions of the page's icons, logos, photos, and **canonical card/list content** in a sibling frame on the same canvas — typically named `Assets`, `Assets Library`, `Exports`, `Resources`, `Content`, or similar. It lives outside the main `LG`/`MD`/`SM` page frames, usually far to the right or below them.

From the page-root metadata, find any frame whose name matches `/asset|export|library|resource|content/i` OR whose x/y position places it clearly outside the LG/MD/SM stack. Record:
- Its `nodeId` and name
- Every child node's `nodeId`, layer name, and visual role (icon vs photo vs logo vs card content)

**Then immediately call `mcp__claude_ai_Figma__get_design_context` on the Assets frame** to extract its contents — child layer names, image asset URLs, and any text labels. Do this BEFORE fetching the section contexts in Step 3, because the Assets frame is the source of truth for:
- **Real partner/customer logos** — the LG frame typically shows placeholder logos (e.g. the same logo repeated 8×); the Assets frame holds the real brand SVGs.
- **Full carousel card sets** — the LG frame may only show 3-4 visible slides (with duplicates as overflow placeholders); the Assets frame holds the full N-card list with no duplicates.
- **Canonical icon artwork** — the icon inside a section is often a low-fidelity instance of the master icon in the Assets frame.
- **Per-card hrefs, hidden subtitles, alt text, video URLs** — content the section mockup doesn't have room to show.

Build an **Assets Index**: `{ layerName, nodeId, role, imageAssetUrl?, associatedSectionHint? }` for every child. Use the layer name to associate each asset with a section (e.g. layer `RWA Partner — Archax` belongs in the logo grid; layer `Carousel Card 04 — Onchain Trading` belongs in the carousel).

**If the page also has annotations pointing at the Assets frame** (e.g. `data-annotations="Logo - see right side asset frame"`, `"Full list in Assets"`, `"Cards continue in Assets frame"`), treat that as a hard contract: the Assets frame is the authoritative content for that section, and the LG mockup is just a visual stub.

**Fail-loud if no Assets frame is found:** if you can't find a sibling frame and the page has more than one media/logo/icon, surface this to the user before continuing — e.g. "I didn't find an Assets/Exports frame on this canvas. The LG mockup shows N placeholder logos and a 3-card carousel — proceed treating those as the final content, or point me at the Assets frame?" Don't silently fall back to the LG mockup when the design clearly references external content.

### Step 3 — Fetch design context for each section (cross-reference with Assets frame)

For every top-level section frame found in the metadata, call `mcp__claude_ai_Figma__get_design_context` in parallel batches (max 3 at a time). For each section, gather:
- The heading/title text
- Any body/description text
- All link labels and their annotation `href` values (from `data-annotations`)
- Color variants visible (background color tells you which variant to use)
- The arrangement (left/right, content vs media position)
- Every distinct image/icon node — capture its Figma `nodeId`, layer name, fill color, and visual role (icon vs photo, monochrome vs colored)

**Then cross-reference against the Assets Index from Step 2A:**
- For carousels/lists: if the LG mockup shows fewer cards than the Assets frame, USE THE ASSETS-FRAME COUNT and content. If cards in the mockup look like exact duplicates (same icon + same text), treat them as overflow placeholders and drop them in favor of the Assets-frame set.
- For logo grids: if the mockup repeats the same logo, IGNORE that and use the distinct logos from the Assets frame.
- For media: if the section's media node and an Assets-frame node share a layer name or visible image, prefer the Assets-frame node — it's higher fidelity and isolated from section chrome.
- For icons: if a section icon has a matching layer name in the Assets frame, export from the Assets frame, not the section instance.

**Important:** Note any Figma annotations that say content should be removed or changed, OR that redirect to the Assets frame ("see right side asset frame", "real logos in assets", etc.) — annotations override what the mockup shows.

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

**A) Source node — always prefer the Assets frame:** For each asset slot in the page, look up the matching node in the Assets Index from Step 2A by layer name or visual match. **Export from the Assets-frame node, not the section instance.** Section instances are often scaled-down thumbnails or shared placeholders; the Assets frame holds the master artwork at its intended export size. Only fall back to the section instance if the Assets frame genuinely doesn't have a counterpart.

**B) Reuse vs export:** If a visually-equivalent asset already exists in the inventory from Step 2 (same role, same color), reuse its path and skip export. Otherwise schedule a new export.

**C) Target folder** — route by section type and asset role:

| Section / role | Folder | Format |
|---|---|---|
| `CarouselCardList` card icons (monochrome glyphs) | `static/img/icons/2026/black/` | `.svg` |
| `CardsIconGrid` card icons (colored glyphs) | `static/img/icons/2026/color/<color>/` | `.svg` |
| `SmallTilesSection` card icons (SDK / language logos) | `static/img/logos/black/` | `.svg` |
| `LogoRectangleGrid` partner logos (rendered from inner `Logo` frame, 1.5× scale) | `static/img/logos/black/` | `.png` |
| `HeaderHeroPrimaryMedia` hero media (photo) | `static/img/bds-2026/` | `.jpg` (screenshot media frame at 1.5×, see Step 7) |
| `HeaderHeroSplitMedia` hero media (photo) | `static/img/bds-2026/` | `.jpg` (screenshot media frame at 1.5×, see Step 7) |
| `FeatureTwoColumn` media (photo) | `static/img/bds-2026/` | `.jpg` (screenshot media frame at 1.5×, see Step 7) |
| `FeatureSingleTopic` media (photo) | `static/img/bds-2026/` | `.jpg` (screenshot media frame at 1.5×, see Step 7) |
| `CardsFeatured` / `logoRectangleGrid`-as-image-cards card media | `static/img/bds-2026/` | `.jpg` (screenshot card-image frame at 1.5×, see Step 7) |
| `FeaturedVideoHero` poster (if used) | `static/img/bds-2026/` | `.jpg` (screenshot media frame at 1.5×, see Step 7) |
| `CarouselFeatured` slide HeroMedia (photo) | `static/img/bds-2026/` | `.jpg` (screenshot media frame at 1.5×, see Step 7) |
| Any other colored decorative icon | `static/img/icons/2026/color/<color>/` | `.svg` |
| Any other monochrome icon | `static/img/icons/2026/black/` | `.svg` |

For the colored-icon folders, pick `<color>` from the Figma fill on the icon (or, if the icon inherits color from a parent component, the parent section's variant prop). Existing folders: `lilac`. Create a new sibling folder (`green`, `yellow`, etc.) if the design uses a new color — never dump differently-colored icons into the wrong folder.

**D) Filename — always kebab-case:**

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
- Figma frame `Logo_Circle` → `Logo` (inner, LogoRectangleGrid partner) → `static/img/logos/black/circle.png` (1.5× PNG, see Step 7)
- Figma frame `Logo_Ondo` → `Logo` (inner, LogoRectangleGrid partner) → `static/img/logos/black/ondo.png`

### Step 7 — Export the assets from Figma

For each scheduled export from Step 6 (sourced from the Assets frame per Step 6A whenever possible):

1. Ensure the target folder exists (`mkdir -p` it if not).
2. **Get the raw Figma asset URL.** Calling `mcp__claude_ai_Figma__get_design_context` on a frame returns inline TS that declares `const imgXxx = "https://www.figma.com/api/mcp/asset/<uuid>"` constants — one per leaf image/icon node. These URLs serve the **raw underlying asset** (SVG for vector icons, PNG for photos/rasters), NOT a re-rendered screenshot of the surrounding chrome. Pull the URL for the specific Assets-frame child you mapped to this slot.
3. **Download with `curl -sL`** for raw vector assets that render as-is with no framing chrome — typically SVG icons and SDK/language logos:
   - SVG icons / vector logos → `curl -sL <url> -o <target>.svg` — Figma serves the actual SVG markup for vector nodes, so no conversion is needed.
   - Verify the format with `file <path>` after downloading the first one of each type, in case Figma serves something unexpected.

3a. **Photographic media with backgrounds — composite the raw image onto the design's background color, save as JPG at native size.** Most media nodes in the design system (hero media, FeatureTwoColumn media, FeatureSingleTopic media, FeaturedVideoHero poster, CardsFeatured card image, CarouselFeatured slide hero) live inside a wrapper frame named `HeroMedia` / `FeatureMedia` / similar. In Figma, that wrapper frame may have a background fill (e.g. `bg-neutral/100` = `#f0f3f7`, `bg-neutral/200` = `#e6eaf0`) BEHIND a foreground illustration. The raw `imgXxx` URL gives you the foreground image only — strips the background, leaves transparent edges. When the JPG converter then flattens to white, the image looks "floating on white" instead of "sitting on the gray tile" the designer intended.

   To capture the composited image + background fill as a flat JPG **at the source image's native size** (no upscale):

   1. **Pull the asset URL from the Assets frame.** This is the priority. Calling `get_design_context` on the Assets frame returns the master `imgXxx = "https://www.figma.com/api/mcp/asset/<uuid>"` constants — clean, isolated, full-size. Only fall back to the section instance's asset URL when the Assets frame has no counterpart.

   2. **Inspect the design context to find the background color** the image sits on. Look at the wrapper frame around the `<img>` for a sibling/child div with `bg-[var(--neutral\/100,#f0f3f7)]`, `bg-[var(--neutral\/200,#e6eaf0)]`, or similar. If there's no bg div, use `#ffffff`.

   3. **Download the raw asset:** `curl -sL <imgXxx-url> -o /tmp/<name>.png`. Most photo nodes return PNG with alpha (illustrations / partial photos); some return JPEG (full-bleed photos with no alpha).

   4. **Composite onto the background color and save as JPG using ImageMagick** (install once with `brew install imagemagick`):
      ```
      magick /tmp/<name>.png -background "<hex>" -alpha remove -alpha off -quality 85 <target>.jpg
      ```
      **No `-resize` flag** — preserve the source's native dimensions. (For very large source PNGs above ~2000px, you may add `-resize "1500x1500>"` to cap size for web, but otherwise leave the native size alone — the designer chose it.) The `-alpha remove -alpha off` flattens alpha onto the `-background` color BEFORE the JPEG encoder strips alpha to white, giving the correct background instead of white.

   5. Save with the `<page-slug>-feature-media-N.jpg` (or `-hero-media.jpg`, `-video-poster.jpg`, etc.) naming convention from Step 6.

   **DO NOT use `get_screenshot` on the media frame** — instance children inside design-system components have IDs like `I<sectionId>;<...>` which are not screenshotable, and the MCP rejects them. The composite-from-raw-asset approach above works for all cases.

   **Sanity-check the first one.** After exporting the first media of each kind, eyeball the JPG: the foreground illustration should sit on a uniform colored tile (`#f0f3f7` light gray, `#e6eaf0` slightly darker gray, etc.) — NOT on white when the design called for gray. If it's still white-flat, you used the wrong `-background` hex; re-read the Figma frame's `bg-` value.
4. **LogoRectangleGrid partner logos — special procedure.** Multi-layer brand logos (Circle, Zeconomy, DB Schenker, etc.) decompose into many vector pieces under `get_design_context`, so the raw-asset-URL technique above gives you fragments, not a composite. Use this instead:
   1. Target the **inner `Logo` frame** (the 170×96 child of `Logo_<Name>`), not the gray-tile parent (`Logo_<Name>`) and not the bottom-most leaf layer (e.g. `Ondo finance`, `DB Schenker_Logo_0 1`).
   2. Call `mcp__claude_ai_Figma__get_screenshot` on that inner Logo frame with `contentsOnly: true` and `maxDimension: 256` to request the longer-edge at ~1.5× the native 170 px. Note that Figma's MCP does not supersample beyond a frame's native render size, so the returned PNG is typically still 170×96 — that's expected, not an error.
   3. Download the PNG: `curl -sL <image_url> -o /tmp/<name>.png`.
   4. Upscale to the 1.5× target dimensions (255×144) using `sips`: `sips -z 144 255 /tmp/<name>.png --out static/img/logos/black/<name>.png`. This gives a crisper-on-retina raster at the design's intended display proportion, even if the resampled pixels don't add new detail.
   5. Save as `.png` (not `.svg` — partner logos in the grid are raster). Filename is kebab-case of the layer name with the `Logo_` prefix stripped (e.g. `Logo_DBS` → `db-schenker.png` — use the visually-recognized brand name, not the literal Figma slug if it's an abbreviation).
   6. **Surface logo-files annotations.** Designers often annotate one of the logo frames (e.g. `Logo_Circle`) with `data-assets-annotations` text like `"Need logo files"` plus a Google Drive link. When present, add a `MISSING_ASSETS` entry: `{ note: "Partner logos are placeholder reproductions — final brand-approved files pending from <Drive URL>", affects: [list of logo paths] }`. The exports are still useful as stand-ins until the user swaps in real assets.
5. **Do NOT use `get_screenshot` on the section frame** to capture media — that re-renders the whole section (chrome, text, padding) and the resulting image cannot be used as a clean media src. The right target for media is the **named media frame inside the section** (e.g. `HeroMedia`, `FeatureMedia`, the `CardImage` media child) per Step 3a above, not the section itself and not the leaf `<img>` (which would strip the background fill).
6. **Fallback when export fails or returns nothing usable:** create a zero-byte placeholder file at the target path AND record `{ figmaNodeId, layerName, targetPath, reason }` in a `MISSING_ASSETS` list. Do not silently drop the asset.

After all attempted exports, run `ls -la` on each unique target folder so the user can see what landed.

### Step 8 — Write the implementation (Plan Mode)

Present a plan first showing:
- All sections in order with their mapped component
- The full content (text, links, variants) for each section
- Any content removed per Figma annotations
- **For each list/grid/carousel section, the canonical item count and source** — e.g. "Logo grid: 8 distinct partner logos from Assets frame (LG mockup showed 8× placeholder, ignored)" or "Carousel: 5 cards from Assets frame (LG mockup showed 3 + 2 duplicates, kept 5)". Make it explicit that the Assets frame won, so the user can spot if something was missed.
- **The asset manifest**: for every image/icon, show `figma layer → source (assets-frame node / section-instance fallback) → target path → status (exported | reused | missing)`

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
- **The Assets frame is the source of truth.** Before fetching any section context, find and read the sibling Assets/Exports/Library/Resources frame on the page canvas. Use it for: real partner logos (not LG mockup placeholders), full carousel/list item sets (not the truncated visible cards), master icon artwork, and per-item hrefs the mockup hides. If you can't find an Assets frame and the design references one (via annotations or repeated placeholders), surface that to the user before guessing.
- **Carousel and logo-grid item counts come from the Assets frame.** If the LG mockup shows repeated identical cards/logos, treat them as overflow placeholders and use the Assets-frame count instead.
- **Export from Assets-frame nodes, not section instances.** Section instances are usually thumbnails of the master artwork in the Assets frame.
- **Always apply links** from Figma annotations to make lists navigable
- **Respect Figma notes** — if a section is annotated for removal, skip it; if it's annotated to redirect content to the Assets frame ("see right side asset frame", "logos in assets", etc.), follow that pointer rather than using the visible mockup content
- **Light mode only** — follow the light mode variant of any design that shows both
- **Always use `require('../static/img/...')` for images** — every image/icon prop must point at a real path under `static/img/` following the folder routing in Step 6. Never pass `src=""` and never inline a remote URL.
- **Kebab-case all new asset filenames.** Shared photographic media in `bds-2026/` must be prefixed with the page slug; icons and logos are not page-prefixed.
- **Reuse existing assets** when the inventory in Step 2 already has a matching icon/logo — do not re-export duplicates with new names.
- **Never delete or overwrite an existing asset** without explicit user confirmation. If an export would collide with an existing file, rename the new export with a `-2` suffix and flag it in the plan.
- **Always use `translate(...)` for visible text.** Import `useThemeHooks` from `@redocly/theme/core/hooks`, call `const { useTranslate } = useThemeHooks(); const { translate } = useTranslate();` at the top of the component, and wrap every user-facing string in `translate(...)`. Never leave a bare string literal in a text-bearing prop or as JSX text. URLs, variant enums, and embed URLs are not text — leave those untranslated.
