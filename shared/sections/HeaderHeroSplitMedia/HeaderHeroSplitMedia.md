# HeaderHeroSplitMedia Pattern

A page-level hero pattern that pairs prominent editorial content with a primary media element in a split layout. Designed to introduce major concepts, products, or use cases while maintaining strong visual hierarchy and clear calls to action.

## Overview

Header Hero Split Media supports both neutral and accent surface treatments and adapts responsively across desktop, tablet, and mobile breakpoints while preserving a consistent internal structure.

## When to Use

- The page represents a high priority destination or thematic entry point
- A strong headline and supporting narrative are required
- Visual media reinforces the concept or story being introduced
- One or two clear primary actions should be immediately visible
- The page benefits from a balanced content and media relationship rather than a full bleed hero

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `surface` | `'default' \| 'accent'` | `'default'` | Default uses no background surface behind the hero title. AccentSurface adds an accent background with internal padding behind the hero title |
| `layout` | `'content-left' \| 'content-right'` | `'content-left'` | Controls whether the content block appears on the left or right side of the media |
| `title` | `string` | *required* | Hero title text (display-md typography) |
| `subtitle` | `string` | *required* | Hero subtitle text (subhead-sm-l typography) |
| `description` | `string` | - | Description text below title section (body-l typography) |
| `primaryCta` | `{ label: string; href: string }` | - | Primary CTA button configuration |
| `secondaryCta` | `{ label: string; href: string }` | - | Secondary/Tertiary CTA button configuration |
| `media` | `{ src: string; alt: string }` | *required* | Hero media (image) configuration |
| `className` | `string` | - | Additional CSS classes |

## Variants

### Theme

Theme is automatically controlled by the `html.light` and `html.dark` classes on the document root. The component will automatically adapt its colors based on the current theme.

- **Light**: White background with dark text (when `html.light` is present)
- **Dark**: Dark background with light text (when `html.dark` is present)

### Surface

Controls the hero title section styling.

- **Default**: No background surface behind the hero title
- **Accent**: Adds a green accent background with internal padding behind the hero title and subtitle

### Layout

Controls the position of content relative to media.

- **Content Left** (default): Content on the left, media on the right
- **Content Right**: Content on the right, media on the left

## Basic Usage

```tsx
import { HeaderHeroSplitMedia } from '@/shared/patterns/HeaderHeroSplitMedia';

function MyPage() {
  return (
    <HeaderHeroSplitMedia
      title="Real-world asset tokenization"
      subtitle="Learn how to issue crypto tokens and build tokenization solutions with developer tools and APIs."
      description="XRPL Payments Suite helps fintechs and payment providers move money fast, globally, and at low cost - all through simple APIs."
      primaryCta={{ label: "Get Started", href: "/docs/tutorials" }}
      secondaryCta={{ label: "Learn More", href: "/about" }}
      media={{ src: "/img/hero-tokenization.png", alt: "Tokenization illustration" }}
    />
  );
}
```

## Examples

### Light Theme with Accent Surface

The theme is automatically controlled by the `html.light` class on the document root.

```tsx
<HeaderHeroSplitMedia
  surface="accent"
  layout="content-left"
  title="Real-world asset tokenization"
  subtitle="Learn how to issue crypto tokens and build tokenization solutions."
  description="XRPL helps fintechs move money fast, globally, at low cost."
  primaryCta={{ label: "Primary Link", href: "/docs" }}
  secondaryCta={{ label: "Tertiary Link", href: "/learn" }}
  media={{ src: "/img/hero.png", alt: "Hero" }}
/>
```

### Dark Theme with Accent Surface

The theme is automatically controlled by the `html.dark` class on the document root.

```tsx
<HeaderHeroSplitMedia
  surface="accent"
  layout="content-left"
  title="Build on the XRP Ledger"
  subtitle="Start developing with the most sustainable blockchain."
  description="Join thousands of developers building the future of finance."
  primaryCta={{ label: "Start Building", href: "/docs" }}
  secondaryCta={{ label: "View Tutorials", href: "/tutorials" }}
  media={{ src: "/img/hero-dark.png", alt: "XRPL Hero" }}
/>
```

### Content Right Layout

```tsx
<HeaderHeroSplitMedia
  surface="default"
  layout="content-right"
  title="Enterprise Solutions"
  subtitle="Scale your business with blockchain technology."
  description="Leverage the XRP Ledger for enterprise-grade applications."
  primaryCta={{ label: "Contact Sales", href: "/contact" }}
  media={{ src: "/img/enterprise.png", alt: "Enterprise" }}
/>
```

### Minimal (No Description or Secondary CTA)

```tsx
<HeaderHeroSplitMedia
  title="Quick Start Guide"
  subtitle="Get up and running in minutes."
  primaryCta={{ label: "Begin", href: "/quickstart" }}
  media={{ src: "/img/quickstart.png", alt: "Quick start" }}
/>
```

## Responsive Behavior

### Desktop (≥992px)
- Side-by-side layout with content and media columns (6/12 columns each)
- Media uses 1:1 aspect ratio
- Gap between content and media columns: 8px
- Horizontal gap between CTAs: 24px
- Gap between description and CTA: 40px

### Tablet (576px - 991px)
- Side-by-side layout maintained (4/8 columns each)
- Media uses 2:1 aspect ratio (width:height)
- Gap between content and media columns: 32px
- Horizontal gap between CTAs: 24px
- Gap between description and CTA: 24px

### Mobile (<576px)
- Stacked layout (content above media, 4/4 columns each = full width)
- Media uses 1:1 aspect ratio, full width
- Gap between content and media columns: 32px
- CTAs stack vertically with 16px gap
- Gap between description and CTA: 24px

## Accent Surface Spacing

When using `surface="accent"`, the title section receives a green background with specific padding:

| Breakpoint | Padding Top | Padding Left/Right | Padding Bottom |
|------------|-------------|-------------------|----------------|
| Desktop | 16px | 16px | 24px |
| Tablet | 16px | 16px | 24px |
| Mobile | 8px | 8px | 16px |

## Anatomy

```
HeaderHeroSplitMedia
├── PageGrid Container (responsive padding)
│   └── PageGrid.Row (flex layout with custom gap)
│       ├── PageGrid.Col (content column)
│       │   └── Content
│       │       ├── TitleSurface (optional accent background)
│       │       │   └── TitleGroup
│       │       │       ├── Title (h1, display-md)
│       │       │       └── Subtitle (p, sh-sm-l)
│       │       └── DescriptionGroup
│       │           ├── Description (p, body-l)
│       │           └── CTA
│       │               ├── Primary Button
│       │               └── Tertiary Button
│       └── PageGrid.Col (media column)
│           └── Media
│               └── Image (object-fit: cover)
```

## CTA Guidelines

- **Use Primary and Tertiary buttons only** - Do not use Secondary buttons in this pattern
- Secondary buttons introduce competing visual shapes and reduce clarity
- Using Primary and Tertiary maintains clean hierarchy and avoids visual noise

## Media Guidelines

- Width is always used as the anchor when calculating height
- Media spans the grid width defined by the layout
- Aspect ratio rules by breakpoint:
  - Desktop: 1:1 ratio
  - Tablet: 2:1 ratio (W:H)
  - Mobile: 1:1 ratio

## CSS Classes

| Class | Description |
|-------|-------------|
| `.bds-hero-split-media` | Root element |
| `.bds-hero-split-media--default` | Default surface modifier |
| `.bds-hero-split-media--accent` | Accent surface modifier |
| `.bds-hero-split-media--content-left` | Content left layout |
| `.bds-hero-split-media--content-right` | Content right layout |
| `.bds-hero-split-media__container` | PageGrid container with responsive vertical padding |
| `.bds-hero-split-media__row` | PageGrid.Row with custom gap spacing |
| `.bds-hero-split-media__content-col` | PageGrid.Col wrapper for content |
| `.bds-hero-split-media__content` | Content column |
| `.bds-hero-split-media__title-surface` | Title background wrapper |
| `.bds-hero-split-media__title-group` | Title + subtitle container |
| `.bds-hero-split-media__title` | Main heading |
| `.bds-hero-split-media__subtitle` | Subtitle text |
| `.bds-hero-split-media__description-group` | Description + CTA container |
| `.bds-hero-split-media__description` | Body text |
| `.bds-hero-split-media__cta` | CTA buttons container |
| `.bds-hero-split-media__media-col` | PageGrid.Col wrapper for media |
| `.bds-hero-split-media__media` | Media column |
| `.bds-hero-split-media__media-img` | Media image |

**Note:** This pattern uses the `PageGrid` component system. The container uses `PageGrid` (`.bds-grid__container`), rows use `PageGrid.Row` (`.bds-grid__row`), and columns use `PageGrid.Col` (`.bds-grid__col-*`). Custom classes are applied for pattern-specific styling.

## Accessibility

- Uses semantic `<section>` element for the pattern container
- Title uses `<h1>` heading for proper document structure
- Media requires `alt` text for screen readers
- Buttons inherit accessible labels from the Button component
- Color contrast ratios meet WCAG 2.1 AA standards
