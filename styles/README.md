# XRPL Styles

This folder contains the source files for the XRP Ledger Dev Portal CSS. The optimized, minified version of these styles is `/static/css/devportal2024-v1.css`.

## Build Pipeline

The CSS build uses a modern optimization pipeline:

1. **Sass** - Compiles SCSS to CSS
2. **PostCSS** - Processes CSS with plugins:
   - **PurgeCSS** - Removes unused CSS (production only)
   - **Autoprefixer** - Adds vendor prefixes for browser compatibility
   - **cssnano** - Minifies and optimizes CSS (production only)

### Performance Improvements

The optimized build dramatically improves CSS delivery:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Uncompressed** | 486.64 KB | 280.92 KB | **42% smaller** |
| **Gzipped (network)** | 71.14 KB | 43.32 KB | **39% smaller** |

This improves page load times, developer experience (DevTools filter: 60s → <1s), and reduces bandwidth costs.

## Prerequisites

All dependencies are automatically installed via NPM:

```sh
npm install
```

Key dependencies:
- `sass` - SCSS compiler
- `postcss-cli` - PostCSS command-line interface
- `@fullhuman/postcss-purgecss` - Removes unused CSS
- `autoprefixer` - Browser compatibility
- `cssnano` - CSS minification

## Building

### Production Build

For production deployments with full optimization:

```sh
npm run build-css
```

Includes: PurgeCSS, autoprefixer, minification (no source maps)

### Development Build

For local development with debugging:

```sh
npm run build-css:dev
```

Includes: Autoprefixer, source maps (no PurgeCSS for faster builds)

### Watch Mode

For continuous compilation during development:

```sh
npm run build-css:watch
```

Auto-rebuilds on file changes with source maps

### Analysis

To analyze the CSS bundle composition:

```sh
npm run analyze-css
```

This shows:
- Bundle size and selector counts
- Bootstrap component usage
- Custom component patterns
- Optimization recommendations

## Files Structure

### Main Entry Point

- `xrpl.scss` - Master file that imports all other SCSS files, Bootstrap, and defines variables

### Component Styles

Each `_*.scss` file contains styles for specific components:

- `_colors.scss` - Color palette and variables
- `_font-face.scss` - Font definitions
- `_font.scss` - Typography styles
- `_layout.scss` - Page layout and grid
- `_buttons.scss` - Button styles
- `_forms.scss` - Form controls
- `_cards.scss` - Card components
- `_nav-*.scss` - Navigation components (top-nav, side-nav)
- `_content.scss` - Content area styles
- `_blog.scss` - Blog-specific styles
- `_dev-tools.scss` - Developer tools styles
- `_rpc-tool.scss` - RPC tool interface
- `_tables.scss` - Table styles
- `_footer.scss` - Footer styles
- `_callouts.scss` - Callout/alert boxes
- `_diagrams.scss` - Diagram styles
- `_print.scss` - Print media styles
- `light/_light-theme.scss` - Light theme overrides

## Configuration

### PostCSS Configuration

The PostCSS pipeline is configured in `postcss.config.cjs` at the project root.

**PurgeCSS Safelist:**
- Scans all `.tsx`, `.md`, `.yaml`, and `.html` files for class names
- Preserves dynamically-added classes (Bootstrap JS components, CodeMirror, etc.)
- Keeps state classes (`active`, `disabled`, `show`, etc.)
- Only runs in production builds

### Sass Configuration

Sass is configured via command-line flags in `package.json`:
- `--load-path styles/scss` - Additional import paths
- `--source-map` - Generate source maps (dev only)

## Troubleshooting

### "Classes are missing after build"

If you find missing styles after a production build:

1. Check if the class is dynamically added via JavaScript
2. Add the class pattern to the safelist in `postcss.config.cjs`
3. Rebuild: `npm run build-css`

Example safelist patterns:
```js
deep: [
  /my-dynamic-class/, // Keeps .my-dynamic-class and children
]
```

### "Build is too slow"

For development, use:
```sh
npm run build-css:watch  # Watch mode (no PurgeCSS)
# or
npm run build-css:dev    # One-time dev build (no PurgeCSS)
```

### "Seeing Sass deprecation warnings"

The warnings about `@import` are from Bootstrap 5's use of legacy Sass syntax. They're harmless and will be resolved when Bootstrap updates to the new `@use` syntax.

## Adding New Styles

When adding new component styles:

1. Create `_component-name.scss` in this directory
2. Add `@import "_component-name.scss";` to `xrpl.scss`
3. If using dynamic classes, add them to the PurgeCSS safelist in `postcss.config.cjs`
4. Test: `npm run build-css:dev` (dev) and `npm run build-css` (prod)
5. Analyze: `npm run analyze-css`

## Further Reading

See `CSS-OPTIMIZATION.md` in the project root for detailed information about the optimization implementation and migration process.
