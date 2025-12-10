# XRPL Dev Portal - AI Agent Guidelines

## Architecture Overview

**XRPL Dev Portal** is a documentation site built with **Redocly Realm** (not a traditional Next.js or Vite app). It serves comprehensive XRP Ledger technical documentation across English (en-US) and Japanese (ja) locales, with Spanish (es-ES) in progress.

### Key Components
- **Frontend Framework**: React 19 with Redocly Realm (modern docs platform)
- **Build Tool**: Realm's proprietary bundler (not Webpack/Vite)
- **Content**: Markdown-based with `.page.tsx` React pages for interactive content
- **Styling**: Sass + Bootstrap 4 (see `styles/xrpl.scss` → `static/css/devportal2024-v1.css`)
- **Internationalization**: `@l10n/` directory mirrors content structure for translations

### File Structure Logic
```
docs/          → Main documentation (markdown + .page.tsx)
_code-samples/ → Multi-language code examples (js, py, java, go, php)
_api-examples/ → Live API request/response examples
@theme/        → Redocly theme customization (React components)
blog/          → Blog posts organized by year
resources/     → Tutorials, guides, code samples index
static/        → Pre-compiled CSS, vendor JS, images
```

## Development Workflow

**Build & Run**: 
```bash
npm install @redocly/realm
npm start  # Runs `realm develop` with hot reload
```

**CSS Changes**:
```bash
npm run build-css           # One-time compile
npm run build-css-watch     # Auto-compile on changes
```
Uses Sass with `--load-path styles/scss` → compiles to `static/css/devportal2024-v1.css`

**Webpack Setup** (only for Domain Verifier tool):
If modifying `assets/js/domain-verifier-checker.js`, run:
```bash
npm install webpack webpack-cli --save-dev
npm install ripple-binary-codec ripple-address-codec ripple-keypairs
cd assets/js && webpack-cli domain-verifier-checker.js --optimize-minimize
```

## Content & Pattern Conventions

### Markdown Pages with Frontmatter
- Use `---` YAML frontmatter for metadata (seo, parent, html filenames)
- Filenames ending in `.page.tsx` render as interactive React pages
- Example: `docs/introduction/index.md` with `html: introduction.html` metadata

### Code Samples Structure
Each sample lives in `_code-samples/{sample-name}/`:
```
_code-samples/send-xrp/
├── README.md        # Required: first heading = title, second element = description
├── js/              # JavaScript/TypeScript implementation
├── py/              # Python implementation
├── java/            # Java implementation
├── go/              # Go implementation
└── php/             # PHP implementation
```
The **code-samples plugin** auto-discovers and indexes these—no manual entry needed.

### Snippets & Partials
- Reusable markdown fragments in `docs/_snippets/` (e.g., common warnings, tables)
- Reference via Markdoc syntax: `{% partial file="snippet-name.md" /%}`
- Configuration in `redocly.yaml`: `partialsFolders: ["docs/_snippets", "_code-samples", "_api-examples"]`

### Custom React Components (Markdoc)
Located in `@theme/markdoc/components.tsx`:
- `<XRPLCard>` - Card with link, title, optional image, body
- `<CardGrid>` - Grid layout for cards
- `<InteractiveBlock>` - Multi-step tutorials with breadcrumbs
- `<IndexPageItems>` - Auto-render child pages from metadata
- `<AmendmentsTable>`, `<Badge>`, `<AmendmentDisclaimer>` - Domain-specific

Export components from `components.tsx` to use in markdown as Markdoc tags.

### Internationalization
- Default: English (en-US) in root directories
- Translations: Mirror structure in `@l10n/{locale}/` (e.g., `@l10n/ja/docs/intro/what-is-xrp.md`)
- Config: `redocly.yaml` defines `l10n.locales` (en-US, ja, es-ES)
- Both paths must exist—missing translations fall back to English

### Sidebar Navigation
`sidebars.yaml` defines all navigation. Structure:
```yaml
- group: Documentation
  page: docs/index.page.tsx
  items:
    - page: docs/introduction/index.md
      items:
        - page: docs/introduction/what-is-xrp.md
```
Changes here immediately appear in the Realm UI—no rebuild needed.

## Theme & Styling

- **Entry Point**: `@theme/plugin.js` registers three Realm plugins: `indexPages`, `codeSamples`, `blogPosts`
- **Components**: `@theme/components/` has XRPLCard, XRPLoader, Amendments, Navbar, LanguagePicker
- **Helpers**: `@theme/helpers.ts` exports `useThemeFromClassList` hook for theme detection
- **Markdoc Schema**: `@theme/markdoc/schema.ts` defines custom block/inline elements
- **Styles**: `@theme/styles.css` for theme-specific overrides; main CSS compiled from `styles/xrpl.scss`

## Critical External Dependencies

- **xrpl**: XRP Ledger JS library (v4.2.5) - used in interactive examples
- **@redocly/realm**: The documentation framework itself (v0.126.0)
- **@codemirror**: Code editor for inline examples
- **lottie-react**: Animations on homepage

**Do not downgrade `@redocly/realm`** without testing the full build—it handles routing, SSG, and i18n.

## Plugin System

Three custom plugins in `@theme/plugins/`:

1. **code-samples.js**: Scans `_code-samples/*/README.md`, extracts title/description, lists language folders, generates shared data for `/resources/code-samples/`
2. **index-pages.js**: Auto-generates child page lists from `metadata.indexPage: true` (used by `{% child-pages /%}`)
3. **blog-posts.js**: Indexes blog posts by year, creates archive pages

**Edit these files when changing how content is discovered or indexed.**

## Common Tasks

**Add a new doc page**:
1. Create `.md` file in appropriate `docs/` subdirectory
2. Add entry to `sidebars.yaml` with `page:` path
3. If adding a new language, create matching file in `@l10n/{locale}/`

**Add a code sample**:
1. Create folder `_code-samples/{name}/`
2. Write `README.md` with title heading and description
3. Create language subfolders (js, py, java, etc.) with code files
4. Plugin auto-discovers—appears on `/resources/code-samples/`

**Add custom React component to markdown**:
1. Define in `@theme/markdoc/components.tsx` and export
2. Add schema definition to `@theme/markdoc/schema.ts` if using custom Markdoc tag syntax
3. Use in markdown as `{% ComponentName prop="value" /%}` or inline JSX

**Modify styling**:
1. Edit `styles/xrpl.scss` (Sass)
2. Run `npm run build-css` or use watch mode
3. Output goes to `static/css/devportal2024-v1.css` (served by Realm)

**Test locally**:
```bash
npm start
```
Opens dev server on `http://localhost:3000` with hot reload. No separate build step needed.

## Important Notes

- **No serverless functions**: This is a static/SSG site—no backend API routes
- **Redirects**: Handled by `redirects.yaml` (mapped in `redocly.yaml`)
- **Search**: Powered by Typesense (integrated in Realm)
- **Analytics**: GTM tracking ID `GTM-KCQZ3L8` in `redocly.yaml` scripts
- **Node requirement**: >= 18 LTS (specified in README)
