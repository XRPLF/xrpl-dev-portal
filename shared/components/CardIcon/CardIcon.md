# CardIcon Component

A clickable card component featuring an icon (top-left) and label text with arrow (bottom). Supports two color variants with responsive sizing that adapts at breakpoints.

## Features

- **Two Color Variants**: Neutral (gray) and Green
- **Five Interaction States**: Default, Hover, Focused, Pressed, Disabled
- **Responsive Sizing**: Automatically adapts at SM/MD/LG breakpoints
- **Window Shade Animation**: Smooth hover effect with color wipe
- **Accessible**: Full keyboard navigation and ARIA support
- **Flexible Rendering**: Renders as `<a>` or `<button>` based on props

## Responsive Sizes

The component automatically adapts its dimensions based on viewport width:

| Breakpoint | Height | Icon Size | Padding |
|------------|--------|-----------|---------|
| SM (< 576px) | 136px | 56x56 | 8px |
| MD (576px - 991px) | 140px | 60x60 | 12px |
| LG (>= 992px) | 144px | 64x64 | 16px |

## Color States

### Light Mode

#### Neutral Variant
- **Default**: Gray 200 (#E6EAF0) - black text
- **Hover**: Gray 300 (#CAD4DF) - black text
- **Focused**: Gray 300 + 2px black border - black text
- **Pressed**: Gray 400 (#8A919A) - black text
- **Disabled**: Gray 100 (#F0F3F7) - muted text (Gray 400), 50% icon opacity

#### Green Variant
- **Default**: Green 200 (#70EE97) - black text
- **Hover**: Green 300 (#21E46B) - black text
- **Focused**: Green 300 + 2px black border - black text
- **Pressed**: Green 400 (#0DAA3E) - black text
- **Disabled**: Green 100 (#EAFCF1) - muted text (Gray 400), 50% icon opacity

### Dark Mode

#### Neutral Variant
- **Default**: Gray 500 (#72777E) - white text
- **Hover**: Gray 400 (#8A919A) - white text
- **Focused**: Gray 400 + 2px white border - white text
- **Pressed**: Gray 500 at 70% opacity - white text
- **Disabled**: Gray 500 at 30% opacity - white text

#### Green Variant
- **Default**: Green 300 (#21E46B) - black text
- **Hover**: Green 200 (#70EE97) - black text
- **Focused**: Green 200 + 2px white border - black text
- **Pressed**: Green 400 (#0DAA3E) - black text
- **Disabled**: Gray 500 at 30% opacity - white text

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'neutral' \| 'green'` | `'neutral'` | Color variant |
| `icon` | `string` | *required* | Icon image source (URL or path) |
| `iconAlt` | `string` | `''` | Alt text for the icon image |
| `label` | `string` | *required* | Card label text |
| `href` | `string` | - | Link destination (renders as `<a>`) |
| `onClick` | `() => void` | - | Click handler (renders as `<button>`) |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | `''` | Additional CSS classes |

## Usage Examples

### Basic Link Card

```tsx
import { CardIcon } from '@/shared/components/CardIcon';

<CardIcon
  variant="neutral"
  icon="/icons/javascript.svg"
  iconAlt="JavaScript logo"
  label="Get Started with Javascript"
  href="/docs/tutorials/javascript"
/>
```

### Green Variant with Click Handler

```tsx
<CardIcon
  variant="green"
  icon="/icons/python.svg"
  iconAlt="Python logo"
  label="Python Tutorial"
  onClick={() => openTutorial('python')}
/>
```

### Disabled State

```tsx
<CardIcon
  variant="neutral"
  icon="/icons/coming-soon.svg"
  label="Coming Soon"
  disabled
/>
```

### Within a Grid Layout

```tsx
import { PageGrid, PageGridItem } from '@/shared/components/PageGrid';
import { CardIcon } from '@/shared/components/CardIcon';

<PageGrid>
  <PageGridItem colSpan={{ sm: 2, md: 4, lg: 3 }}>
    <CardIcon
      variant="neutral"
      icon="/icons/javascript.svg"
      label="JavaScript"
      href="/docs/javascript"
    />
  </PageGridItem>
  <PageGridItem colSpan={{ sm: 2, md: 4, lg: 3 }}>
    <CardIcon
      variant="green"
      icon="/icons/python.svg"
      label="Python"
      href="/docs/python"
    />
  </PageGridItem>
</PageGrid>
```

## Accessibility

- Uses semantic `<a>` or `<button>` elements based on interaction type
- Includes `aria-label` for screen readers
- Supports keyboard navigation (Tab, Enter, Space)
- Focus states meet WCAG 2.1 AA contrast requirements
- Disabled state includes `aria-disabled` attribute

## CSS Classes (BEM)

| Class | Description |
|-------|-------------|
| `.bds-card-icon` | Base card styles |
| `.bds-card-icon--neutral` | Neutral color variant |
| `.bds-card-icon--green` | Green color variant |
| `.bds-card-icon--hovered` | Hover state (JS-controlled) |
| `.bds-card-icon--disabled` | Disabled state |
| `.bds-card-icon__overlay` | Hover animation overlay |
| `.bds-card-icon__icon` | Icon container |
| `.bds-card-icon__icon-img` | Icon image |
| `.bds-card-icon__content` | Bottom content row |
| `.bds-card-icon__label` | Text label |
| `.bds-card-icon__arrow` | Arrow icon wrapper |

## Design Tokens

The component uses these design tokens from the style system:

- **Colors**: `$gray-100` through `$gray-400`, `$green-100` through `$green-400`
- **Typography**: `body-r` token from `_font.scss`
- **Breakpoints**: `$grid-breakpoints` from `_breakpoints.scss`
- **Animation**: `cubic-bezier(0.98, 0.12, 0.12, 0.98)` timing function
