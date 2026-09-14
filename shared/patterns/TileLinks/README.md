# TileLink Component

A clickable tile component for link grids, featuring text content with an arrow icon.

## Overview

TileLink is an atomic component designed for use in grid layouts. It provides a consistent, interactive tile with support for both links (`<a>`) and buttons (`<button>`), featuring smooth animations and full accessibility support.

## Features

- **Two Color Variants**: Gray and Lilac
- **Light/Dark Mode**: Full theming support
- **Five Interaction States**: Default, Hover, Focused, Pressed, Disabled
- **Window Shade Animation**: Hover color wipes from bottom to top on enter, top to bottom on exit
- **Arrow Icon**: Animated arrow that moves on hover
- **Responsive**: Adapts padding and font size across breakpoints
- **Accessible**: Proper ARIA labels, focus states, and semantic HTML

## Responsive Sizing

| Breakpoint | Height | Padding | Font Size | Line Height |
|------------|--------|---------|-----------|-------------|
| Base (< 576px) | 64px | 12px | 16px | 26.1px |
| MD (576px - 991px) | 64px | 16px | 16px | 26.1px |
| LG (≥ 992px) | 64px | 20px | 18px | 26.1px |

## Color Variants

### Gray Variant
- **Light Mode**: gray-200 background (#E6EAF0), black text
- **Dark Mode**: gray-500 background (#5A5A5E), white text

### Lilac Variant
- **Both Modes**: lilac-100 background, black text (consistent across light/dark)

## Usage

### Basic Link (Gray Variant - Default)
```tsx
<TileLink
  variant="gray"
  label="Documentation"
  href="/docs"
/>
```

### Lilac Variant with Click Handler
```tsx
<TileLink
  variant="lilac"
  label="Get Started"
  onClick={() => navigate('/start')}
/>
```

### Disabled State
```tsx
<TileLink
  variant="gray"
  label="Coming Soon"
  disabled
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'gray' \| 'lilac'` | `'gray'` | Color variant |
| `label` | `string` | Required | Link text/label |
| `href` | `string` | - | Link destination (renders as `<a>`) |
| `onClick` | `() => void` | - | Click handler (renders as `<button>`) |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | - | Additional CSS classes |

## Animation Details

- **Transition Duration**: 200ms
- **Timing Function**: cubic-bezier(0.98, 0.12, 0.12, 0.98)
- **Hover Effect**: Window shade animation using `clip-path`
- **Arrow Animation**: Translates 4px to the right on hover

## Accessibility

- Renders as semantic `<a>` when `href` is provided
- Renders as semantic `<button>` when `onClick` is provided
- Includes `aria-label` for screen readers
- Includes `aria-disabled` for disabled states
- 2px focus outline with proper offset
- Keyboard navigable

## Files

- `TileLink.tsx` - React component
- `TileLink.scss` - Styles with BEM naming convention
- `README.md` - This file

## Related Components

- **LinkSmallGrid**: Pattern component that uses TileLink in a responsive grid layout
- **LinkArrow**: Arrow icon component used within TileLink

## Design System

Part of the Brand Design System (BDS) with `bds-` namespace prefix.

## Showcase

See `about/tile-link-showcase.page.tsx` for comprehensive examples of all variants and states.

