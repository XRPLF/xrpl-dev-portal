# FeatureSingleTopic Pattern

A feature section pattern that pairs a title/description with a media element in a two-column layout. Supports two variants (default, accentSurface) and two orientations (left, right).

## Features

- Responsive two-column layout (image + content) that stacks on smaller screens
- Two background variants: default (no background) and accentSurface (gray title background)
- Two orientations: left (image left) and right (image right)
- Flexible button layout supporting 1-5 links with automatic variant assignment
- Responsive image aspect ratios per Figma design
- Full dark mode support
- Uses PageGrid for consistent spacing

## Basic Usage

```tsx
import { FeatureSingleTopic } from 'shared/patterns/FeatureSingleTopic';

<FeatureSingleTopic
  variant="default"
  orientation="left"
  title="Developer Spotlight"
  description="Are you building a peer-to-peer payments solution?"
  media={{
    src: "/img/feature-image.png",
    alt: "Feature image"
  }}
  links={[
    { label: "Get Started", href: "/start" },
    { label: "Learn More", href: "/learn" }
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'accentSurface'` | `'default'` | Background variant for title section |
| `orientation` | `'left' \| 'right'` | `'left'` | Image position relative to content |
| `title` | `string` | *required* | Feature title (heading-md typography) |
| `description` | `string` | - | Feature description (label-l typography) |
| `links` | `FeatureSingleTopicLink[]` | `[]` | Array of CTA links (1-5 supported) |
| `media` | `{ src: string; alt: string }` | *required* | Image configuration |
| `className` | `string` | - | Additional CSS classes |

### FeatureSingleTopicLink

```tsx
interface FeatureSingleTopicLink {
  label: string;
  href: string;
}
```

## Button Behavior

The component automatically determines button variants based on count:

| Count | Layout |
|-------|--------|
| 1 link | Primary button |
| 2 links | Primary + Tertiary side by side |
| 3 links | Primary + Tertiary side by side, Secondary button below |
| 4-5 links | Primary + Tertiary side by side, remaining Tertiary stacked |

## Variants

### Default
No background on the title section. Clean, minimal look.

```tsx
<FeatureSingleTopic variant="default" ... />
```

### AccentSurface
Gray background (#E6EAF0 light / #CAD4DF dark) on the title section.

```tsx
<FeatureSingleTopic variant="accentSurface" ... />
```

## Orientation

### Left (default)
Image on left, content on right on desktop. On mobile/tablet, content appears above image.

### Right
Image on right, content on left on desktop. On mobile/tablet, image appears above content.

## Responsive Behavior

### Desktop (≥992px)
- Side-by-side layout: 7-column image, 5-column content
- Fixed height: 565px
- Image aspect ratio: 701/561

### Tablet (768px - 991px)
- Stacked layout with 32px gap between sections
- Image aspect ratio: 16/9
- Content min-height: 320px

### Mobile (<768px)
- Stacked layout with 24px gap between sections
- Image aspect ratio: 343/193
- Content min-height: 280px

## CSS Classes

```
.bds-feature-single-topic                    // Section container
.bds-feature-single-topic--default           // Default variant modifier
.bds-feature-single-topic--accentSurface     // AccentSurface variant modifier
.bds-feature-single-topic--left              // Left orientation modifier
.bds-feature-single-topic--right             // Right orientation modifier
.bds-feature-single-topic__container         // PageGrid container
.bds-feature-single-topic__row               // PageGrid row
.bds-feature-single-topic__media-col         // Media column
.bds-feature-single-topic__content-col       // Content column
.bds-feature-single-topic__media             // Media wrapper
.bds-feature-single-topic__media-img         // Image element
.bds-feature-single-topic__content           // Content wrapper
.bds-feature-single-topic__title-section     // Title section
.bds-feature-single-topic__title             // Title element
.bds-feature-single-topic__description-section // Description + CTA wrapper
.bds-feature-single-topic__description       // Description element
.bds-feature-single-topic__cta               // CTA buttons wrapper
.bds-feature-single-topic__cta-row           // Primary + Tertiary row
```

## Typography Tokens

- **Title**: Uses `heading-md` type token (Tobias Light font)
  - Desktop: 40px / 46px line-height / -1px letter-spacing

- **Description**: Uses `label-l` type token (Booton Light font)
  - Desktop: 16px / 23.2px line-height

## Dark Mode

Full dark mode support with `html.dark` selector:

- **Section background**: #141414 (black)
- **Title (default variant)**: #FFFFFF (white)
- **Title (accentSurface)**: #141414 (black) on #CAD4DF background
- **Description**: #FFFFFF (white)

## Files

- `FeatureSingleTopic.tsx` - Main pattern component
- `FeatureSingleTopic.scss` - Styles with responsive breakpoints
- `index.ts` - Barrel exports
- `README.md` - This documentation

## Design References

- **Figma Design**: [Section Feature - Single Topic](https://www.figma.com/design/sg6T5EptbN0V2olfCSHzcx/Section-Feature---Single-Topic?node-id=18030-2250&m=dev)
- **Showcase Page**: `/about/feature-single-topic-showcase`
- **Component Location**: `shared/patterns/FeatureSingleTopic/`

## Related Components

- **Button**: Used for CTA buttons
- **PageGrid**: Used for responsive grid layout

## Version History

- **February 2026**: Initial implementation
  - Two variants (default, accentSurface)
  - Two orientations (left, right)
  - Responsive image aspect ratios
  - 1-5 link support with automatic button variant assignment
  - Full dark mode support

