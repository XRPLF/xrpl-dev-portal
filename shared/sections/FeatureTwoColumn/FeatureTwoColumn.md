# FeatureTwoColumn Pattern

A feature section pattern that pairs editorial content with a media element in a two-column layout. Designed for showcasing features, products, or use cases with flexible button configurations based on the number of links.

## Overview

FeatureTwoColumn supports four color theme variants (neutral, lilac, yellow, green) and adapts responsively across desktop, tablet, and mobile breakpoints. The button rendering automatically adjusts based on the number of links provided.

Layout is implemented as a **single flex structure** (no separate mobile/desktop markup): **below the desktop breakpoint, media always appears above content** so stacked sections read consistently as media → content → media → content. The **`arrange` prop only affects desktop** (≥992px), where it alternates content left vs. content right.

## When to Use

- Highlighting a specific feature, product, or use case
- Presenting content with supporting visual media
- Creating visual variety with alternating left/right arrangements **on desktop**
- When 1-5 action links are needed with appropriate button hierarchy

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `'neutral' \| 'lilac' \| 'yellow' \| 'green'` | `'neutral'` | Background color theme variant |
| `arrange` | `'left' \| 'right'` | `'left'` | **Desktop only:** content column on the left (`left`) or right (`right`). Below desktop, layout is always media on top, then content. |
| `title` | `string` | *required* | Feature title text (heading-md typography) |
| `description` | `string` | *required* | Feature description text (body-l typography) |
| `links` | `FeatureTwoColumnLink[]` | *required* | Array of 1-5 links (see button behavior below) |
| `media` | `{ src: string; alt: string }` | *required* | Feature media (image) configuration |
| `className` | `string` | - | Additional CSS classes |

### FeatureTwoColumnLink

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Link label text |
| `href` | `string` | Link URL |

## Button Behavior

The component renders a `ButtonGroup` from the links you pass:

| Link Count | Button Configuration |
|------------|---------------------|
| 1 link | Secondary button (`singleButtonVariant="secondary"`) |
| 2 links | Primary button (first) + Tertiary button (second) |
| 3-5 links | All tertiary buttons in block layout (per `ButtonGroup` rules) |

## Variants

### Color Themes

Background tokens are defined in `FeatureTwoColumn.scss` (`$bds-feature-variants`). At a glance:

- **Neutral**: Light neutral background (dark mode uses a slightly darker neutral)
- **Lilac**, **Yellow**, **Green**: Theme-colored backgrounds (light/dark pairs in SCSS)

### Arrangement (`arrange`)

- **`left` (default, desktop):** Content column on the left, media on the right (50% / 50% row).
- **`right` (desktop):** Media on the left, content on the right (`flex-direction: row-reverse` at ≥992px).
- **Mobile and tablet:** `arrange` does not change stacking; **media is always on top**, then content, so repeated sections keep the same vertical rhythm.

## Basic Usage

```tsx
import { FeatureTwoColumn } from 'shared/sections/FeatureTwoColumn';

function MyPage() {
  return (
    <FeatureTwoColumn
      color="lilac"
      arrange="left"
      title="Institutions"
      description="Banks, asset managers, PSPs, and fintechs use XRPL to build financial products and DeFi solutions efficiently and with more flexibility."
      links={[
        { label: "Get Started", href: "/docs" },
        { label: "Learn More", href: "/about" }
      ]}
      media={{ src: "/img/institutions.png", alt: "Institutions illustration" }}
    />
  );
}
```

## Examples

### Single Link (Secondary Button)

```tsx
<FeatureTwoColumn
  color="green"
  arrange="right"
  title="Developers"
  description="Build powerful applications on XRPL with comprehensive documentation and tools."
  links={[{ label: "View Documentation", href: "/docs" }]}
  media={{ src: "/img/dev.png", alt: "Developer tools" }}
/>
```

### Two Links (Primary + Tertiary)

```tsx
<FeatureTwoColumn
  color="yellow"
  arrange="left"
  title="Enterprise Solutions"
  description="Scale your business with blockchain technology."
  links={[
    { label: "Contact Sales", href: "/contact" },
    { label: "Learn More", href: "/enterprise" }
  ]}
  media={{ src: "/img/enterprise.png", alt: "Enterprise" }}
/>
```

### Multiple Links (3-5 Tertiary)

```tsx
<FeatureTwoColumn
  color="neutral"
  arrange="left"
  title="Explore XRPL"
  description="Discover all the ways to interact with the XRP Ledger."
  links={[
    { label: "Documentation", href: "/docs" },
    { label: "Tutorials", href: "/tutorials" },
    { label: "API Reference", href: "/api" },
    { label: "Community", href: "/community" },
    { label: "GitHub", href: "/github" }
  ]}
  media={{ src: "/img/explore.png", alt: "Explore XRPL" }}
/>
```

## Responsive Behavior

Implementation details live in `FeatureTwoColumn.scss`. Summary:

### Desktop (≥992px)

- **Layout:** One row, two equal-width columns (`width: 50%` each), square (`1:1`) media column.
- **`arrange`:** `left` = content | media; `right` = media | content.
- **Content column:** Internal CSS grid (6 tracks) offsets the text block; vertical padding 96px.
- **Media:** `<img>` with `object-fit: cover` filling the media column (no separate background-image layout).

### Tablet (576px - 991px)

- **Layout:** Stacked column; **media on top**, content below (`flex-direction: column-reverse` on the layout wrapper).
- **Media:** 16:9 aspect ratio.
- **Content column:** Vertical padding 80px; inner grid uses 8 columns with inset content span.

### Mobile (<576px)

- **Layout:** Same stacking as tablet — **media on top**, then content.
- **Media:** 1:1 aspect ratio.
- **Content column:** Vertical padding 64px; inner grid uses 4 columns (full-width content span).

## Anatomy

```
FeatureTwoColumn (<section>)
└── .bds-feature-two-column__layout (flex: column-reverse < lg; row ≥ lg; row-reverse ≥ lg when arrange=right)
    ├── .bds-feature-two-column__content-col
    │   └── .bds-feature-two-column__content-grid (responsive column grid + horizontal padding)
    │       └── .bds-feature-two-column__content-wrapper (grid placement)
    │           └── .bds-feature-two-column__content [+ .bds-feature-two-column__content--multiple when 3+ links]
    │               ├── .bds-feature-two-column__text-group
    │               │   ├── .bds-feature-two-column__title (<h2>, heading-md)
    │               │   └── .bds-feature-two-column__description (<p>, body-l)
    │               └── ButtonGroup (when links present)
    └── .bds-feature-two-column__media-col
        └── .bds-feature-two-column__media
            └── .bds-feature-two-column__media-img (<img>)
```

## CSS Classes

| Class | Description |
|-------|-------------|
| `.bds-feature-two-column` | Root `<section>` |
| `.bds-feature-two-column--neutral` | Neutral color theme |
| `.bds-feature-two-column--lilac` | Lilac color theme |
| `.bds-feature-two-column--yellow` | Yellow color theme |
| `.bds-feature-two-column--green` | Green color theme |
| `.bds-feature-two-column--left` | Desktop: content left (default row order) |
| `.bds-feature-two-column--right` | Desktop: content right (`row-reverse` at ≥992px) |
| `.bds-feature-two-column__layout` | Flex wrapper for content + media columns |
| `.bds-feature-two-column__content-col` | Content column (padding, half width on desktop) |
| `.bds-feature-two-column__content-grid` | Inner grid for horizontal alignment of copy |
| `.bds-feature-two-column__content-wrapper` | Grid cell spanning the intended columns |
| `.bds-feature-two-column__content` | Flex column for text group + buttons |
| `.bds-feature-two-column__content--multiple` | Modifier when three or more links (adjusted flex gaps) |
| `.bds-feature-two-column__text-group` | Title + description container |
| `.bds-feature-two-column__title` | Title heading |
| `.bds-feature-two-column__description` | Description text |
| `.bds-feature-two-column__media-col` | Media column wrapper |
| `.bds-feature-two-column__media` | Media aspect-ratio box |
| `.bds-feature-two-column__media-img` | Image element |

## Accessibility

- Uses semantic `<section>` for the pattern container.
- Title uses `<h2>` for document outline.
- Media uses a real `<img>` with required `alt` text.
- Buttons inherit accessible behavior from the `Button` / `ButtonGroup` components.
- **Note:** On viewports below desktop, **visual order** is media then content, but **DOM order** remains content subtree first, then media. Keyboard and screen-reader order follow the DOM; if reading order must match the visual stack, consider page-level structure or future enhancements.

## Design References

- **Figma Design**: [Pattern - Feature - Two Column](https://www.figma.com/design/3tmqxMrEvOVvpYhgOCxv2D/Pattern-Feature---Two-Column?node-id=20017-3501&m=dev)
- **Component Location**: `shared/sections/FeatureTwoColumn/`
- **Color Tokens**: `styles/_colors.scss`
- **Typography**: `styles/_font.scss`
