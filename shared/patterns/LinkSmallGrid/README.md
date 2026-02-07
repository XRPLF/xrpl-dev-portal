# LinkSmallGrid Component

A responsive grid section pattern for displaying navigational links using TileLink components.

## Overview

LinkSmallGrid is a pattern component that combines a heading, optional description, and a grid of TileLink components. It provides a consistent layout for presenting multiple navigation options or quick links.

## Features

- **Responsive Grid Layout**: Adapts from 1 column (mobile) to 4 columns (desktop)
- **Two Color Variants**: Gray and Lilac (applied to all tiles)
- **Light/Dark Mode**: Full theming support
- **Right-Alignment**: Automatically right-aligns grids with fewer than 10 tiles at desktop
- **Flexible Content**: Supports both links and click handlers
- **Accessible**: Semantic HTML with proper heading hierarchy

## Grid Layout

Based on a 12-column grid system:

| Breakpoint | Tiles per Row | Tile Span | Total Columns |
|------------|---------------|-----------|---------------|
| Base (< 576px) | 1 | 4 of 4 | Full width |
| MD (576px - 991px) | 2 | 4 of 8 | 50% width each |
| LG (≥ 992px) | 4 | 3 of 12 | 25% width each |

## Right-Alignment Logic

When there are **fewer than 10 total tiles**, the grid is right-aligned at the **LG breakpoint only**:

- **1 tile**: offset 9 columns
- **2 tiles**: offset 6 columns
- **3 tiles**: offset 3 columns
- **4+ tiles**: no offset (fills row)
- **10+ tiles**: no offset (left-aligned grid)

**Note**: MD and Base breakpoints never apply offset (always left-aligned).

## Usage

### Basic Usage (Gray Variant)
```tsx
<LinkSmallGrid
  variant="gray"
  heading="Quick Links"
  description="Navigate to key sections"
  links={[
    { label: "Documentation", href: "/docs" },
    { label: "Tutorials", href: "/tutorials" },
    { label: "API Reference", href: "/api" },
    { label: "Examples", href: "/examples" }
  ]}
/>
```

### Lilac Variant with Click Handlers
```tsx
<LinkSmallGrid
  variant="lilac"
  heading="Get Started"
  links={[
    { label: "Quick Start", onClick: () => navigate('/start') },
    { label: "Examples", href: "/examples" },
    { label: "Templates", href: "/templates" }
  ]}
/>
```

### Without Description
```tsx
<LinkSmallGrid
  variant="gray"
  heading="Resources"
  links={[
    { label: "Blog", href: "/blog" },
    { label: "Community", href: "/community" }
  ]}
/>
```

## Props

### LinkSmallGridProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'gray' \| 'lilac'` | `'gray'` | Color variant for all tiles |
| `heading` | `string` | Required | Section heading |
| `description` | `string` | - | Optional description text |
| `links` | `LinkItem[]` | Required | Array of link items |
| `className` | `string` | - | Additional CSS classes |

### LinkItem (extends TileLinkProps)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Required | Link text/label |
| `href` | `string` | - | Link destination |
| `onClick` | `() => void` | - | Click handler |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | - | Additional CSS classes |

**Note**: `variant` is controlled by the parent LinkSmallGrid component.

## Layout Structure

```
<section className="bds-link-small-grid">
  <PageGrid>
    <PageGridRow>
      <PageGridCol span={{ base: 4, md: 6, lg: 8 }}>
        <header>
          <h2>{heading}</h2>
          <p>{description}</p>
        </header>
      </PageGridCol>
    </PageGridRow>
    <PageGridRow>
      {links.map(link => (
        <PageGridCol span={{ base: 4, md: 4, lg: 3 }} offset={...}>
          <TileLink {...link} />
        </PageGridCol>
      ))}
    </PageGridRow>
  </PageGrid>
</section>
```

## Performance

- **Memoized Offset Calculations**: Uses `useMemo` to avoid recalculating offsets on every render
- **Optimized Keys**: Uses `href` or `label` as React keys instead of array index for better reconciliation

## Files

- `LinkSmallGrid.tsx` - React component
- `LinkSmallGrid.scss` - Styles with BEM naming convention
- `README.md` - This file

## Related Components

- **TileLink**: Atomic component used for each tile in the grid
- **PageGrid/PageGridRow/PageGridCol**: Grid system components
- **calculateTileOffset**: Utility function for offset calculations (in `shared/utils/helpers.ts`)

## Design System

Part of the Brand Design System (BDS) with `bds-` namespace prefix.

## Showcase

See `about/link-small-grid-showcase.page.tsx` for examples with different link counts and variants.

