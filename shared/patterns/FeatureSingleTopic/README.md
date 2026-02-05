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
| `buttons` | `ButtonConfig[]` | `[]` | Array of button configurations (1-5 supported) |
| `singleButtonVariant` | `'primary' \| 'secondary'` | `'primary'` | Button variant for single button configuration |
| `media` | `{ src: string; alt: string }` | *required* | Image configuration |
| `className` | `string` | - | Additional CSS classes |

### ButtonConfig

```tsx
interface ButtonConfig {
  label: string;
  href?: string;
  onClick?: () => void;
  forceColor?: boolean;
}
```

**Note:** Button configurations are handled by the `ButtonGroup` component. See [ButtonGroup documentation](../ButtonGroup/README.md) for more details.

## Button Behavior

The component automatically determines button variants based on count:

| Count | Layout |
|-------|--------|
| 1 button | Primary or Secondary button (configurable via `singleButtonVariant` prop) |
| 2 buttons | Primary + Tertiary side by side |
| 3-5 buttons | All Tertiary buttons stacked |

**Note:** The component supports a maximum of 5 buttons. Additional buttons beyond 5 will trigger a validation warning in development mode and will be ignored. On mobile, the first two buttons (Primary + Tertiary) remain side by side.

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
Image on left, content on right on desktop.

### Right
Image on right, content on left on desktop.

**Note:** On mobile/tablet, content always appears above image regardless of orientation.

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
.bds-feature-single-topic__container         // PageGrid container
.bds-feature-single-topic__row               // PageGrid row (uses flex-column-reverse flex-lg-row)
.bds-feature-single-topic__media-col         // Media column (uses order-lg-1 or order-lg-2)
.bds-feature-single-topic__content-col       // Content column (uses order-lg-1 or order-lg-2)
.bds-feature-single-topic__media             // Media wrapper
.bds-feature-single-topic__media-img         // Image element
.bds-feature-single-topic__content           // Content wrapper
.bds-feature-single-topic__title-section     // Title section
.bds-feature-single-topic__title             // Title element
.bds-feature-single-topic__description-section // Description + buttons wrapper
.bds-feature-single-topic__description       // Description element
```

**Note:**
- Orientation logic is handled via Bootstrap utility classes (`order-lg-1`, `order-lg-2`) applied dynamically in TSX
- Buttons are rendered by the `ButtonGroup` component with its own class structure
- Mobile/tablet layout uses `flex-column-reverse` to show content above image
- Desktop layout uses `flex-lg-row` for side-by-side display

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

