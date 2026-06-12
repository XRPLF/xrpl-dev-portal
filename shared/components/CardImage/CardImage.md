# CardImage Component Documentation

## Overview

The CardImage component is a responsive card implementation following the XRPL Brand Design System (BDS). It displays an image, title, subtitle, and call-to-action button with three responsive size variants that adapt to viewport width.

## Features

- **Three Responsive Variants**: LG (≥992px), MD (576px-991px), SM (<576px)
- **Interactive States**: Default, Hover, Focus, Pressed, Disabled
- **Button Animation on Card Hover**: Hovering the card triggers the button's hover animation
- **Flexible Usage**: Supports both link navigation and click handlers
- **Accessibility**: Keyboard navigation and screen reader support

## Props API

```typescript
interface CardImageProps {
  /** Image source URL */
  image: string;
  /** Alt text for the image */
  imageAlt: string;
  /** Card title (1 line only) */
  title: string;
  /** Card subtitle (max 3 lines) */
  subtitle: string;
  /** Button label text */
  buttonLabel: string;
  /** Link destination (renders card as clickable link) */
  href?: string;
  /** Click handler for the button */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Optional className for custom styling */
  className?: string;
}
```

### Default Values

- `disabled`: `false`
- `className`: `''`

## Responsive Variants

### LG (Large) - Desktop (≥992px)

- Card height: 620px
- Image height: 400px (1:1 aspect ratio preserved)
- 3-column grid width

### MD (Medium) - Tablet (576px - 991px)

- Card height: 560px
- Image height: 280px
- 2-column grid width

### SM (Small) - Mobile (<576px)

- Card height: 536px
- Image height: 268px
- 1-column grid width (full width)

## States

### Default State

The default interactive state with the button showing its primary green background.

### Hover State

When the user hovers over the card:
- Button background fills from bottom-to-top (green-300 → green-200)
- Arrow icon line shrinks
- Gap between label and icon increases

### Focus State

When the card receives keyboard focus:
- Black border outline around the card
- Button shows focus styling

### Pressed State

When the button is being pressed:
- Button returns to default styling momentarily

### Disabled State

When `disabled={true}`:
- Card is non-interactive
- Button shows disabled styling (gray background, no icon)
- Text colors muted
- Cursor changes to `not-allowed`

## Usage Examples

### Basic Card with Link

```tsx
import { CardImage } from 'shared/components/CardImage';

<CardImage
  image="/images/docs-hero.png"
  imageAlt="Documentation illustration"
  title="Documentation"
  subtitle="Access everything you need to get started working with the XRPL."
  buttonLabel="Get Started"
  href="/docs"
/>
```

### Card with Click Handler

```tsx
<CardImage
  image="/images/feature.png"
  imageAlt="Feature illustration"
  title="New Feature"
  subtitle="Learn about our latest feature and how it can help you build better applications."
  buttonLabel="Learn More"
  onClick={() => console.log('clicked')}
/>
```

### Disabled Card

```tsx
<CardImage
  image="/images/coming-soon.png"
  imageAlt="Coming soon"
  title="Coming Soon"
  subtitle="This feature is not yet available."
  buttonLabel="Unavailable"
  disabled
/>
```

### Card with Custom Class

```tsx
<CardImage
  image="/images/hero.png"
  imageAlt="Hero image"
  title="Custom Styled"
  subtitle="Card with additional custom styling."
  buttonLabel="Explore"
  href="/explore"
  className="my-custom-card"
/>
```

## Design Tokens

### Spacing

| Token | Value | Description |
|-------|-------|-------------|
| Image-to-content gap | 24px | Gap between image and content area |
| Title-to-subtitle gap | 12px | Gap between title and subtitle |
| Content horizontal padding | 8px | Left/right padding for content |
| Button margin-top | 30px | Button locked to bottom |
| Border radius | 16px | Card corner radius |

### Colors

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Card background | #FFFFFF | Gray 800 |
| Card border | Gray 300 (#CAD4DF) | Gray 700 |
| Image background | Gray 100 (#F0F3F7) | Gray 700 |
| Text color | #141414 | White |

### Typography

| Element | Token | Specs |
|---------|-------|-------|
| Title | `.sh-md-l` | 28px/35px, -0.5px letter-spacing, light weight |
| Subtitle | `.body-l` | 18px/26.1px, -0.5px letter-spacing, light weight |

## How It Works

### Hover Animation

The card tracks hover state via React's `useState`. When hovered:
1. A `bds-card-image--hovered` class is added to the card
2. CSS rules target the nested Button component and apply hover styles
3. The button's `::before` pseudo-element animates (background fill)
4. The arrow icon line shrinks via `scaleX(0)`

This approach ensures the button animation triggers even when hovering areas of the card outside the button itself.

### Link Navigation

When `href` is provided:
- The entire card becomes clickable
- Clicking anywhere on the card navigates to the href
- The card is keyboard accessible (Enter/Space to activate)

### Button Integration

The component uses the existing BDS Button component with:
- `variant="primary"` - Solid green background
- `color="green"` - Green color theme

## Accessibility

### Keyboard Navigation

- **Tab**: Focus the card
- **Enter/Space**: Activate the card (navigate to href or trigger onClick)

### Screen Reader Support

- Card has appropriate `role="link"` when href is provided
- Image has descriptive alt text
- `aria-disabled` attribute for disabled state

## File Structure

```
shared/components/CardImage/
├── CardImage.tsx      # Component implementation
├── CardImage.scss     # Component styles
├── CardImage.md       # This documentation
└── index.ts           # Exports
```

## Related Components

- **Button**: Used internally for the CTA button
- **CardOffgrid**: Similar card component with different layout

## Browser Support

The component uses modern CSS features:
- CSS Grid/Flexbox
- CSS transforms and transitions
- `:focus-visible` pseudo-class
- `-webkit-line-clamp` for text truncation

All features are widely supported in modern browsers.
