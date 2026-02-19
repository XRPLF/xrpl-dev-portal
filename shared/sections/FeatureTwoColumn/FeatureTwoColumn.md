# FeatureTwoColumn Pattern

A feature section pattern that pairs editorial content with a media element in a two-column layout. Designed for showcasing features, products, or use cases with flexible button configurations based on the number of links.

## Overview

FeatureTwoColumn supports four color theme variants (neutral, lilac, yellow, green) and adapts responsively across desktop, tablet, and mobile breakpoints. The button rendering automatically adjusts based on the number of links provided.

## When to Use

- Highlighting a specific feature, product, or use case
- Presenting content with supporting visual media
- Creating visual variety with alternating left/right arrangements
- When 1-5 action links are needed with appropriate button hierarchy

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `'neutral' \| 'lilac' \| 'yellow' \| 'green'` | `'neutral'` | Background color theme variant |
| `arrange` | `'left' \| 'right'` | `'left'` | Controls whether content appears on the left or right side |
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

The component automatically renders buttons based on the number of links provided:

| Link Count | Button Configuration |
|------------|---------------------|
| 1 link | Secondary button |
| 2 links | Primary button + Tertiary button |
| 3-5 links | Primary + Tertiary (row), Secondary, then Tertiary links |

## Variants

### Color Themes

- **Neutral**: White background (dark mode: black)
- **Lilac**: Light purple background ($lilac-100, dark mode: $lilac-500)
- **Yellow**: Light yellow background ($yellow-100, dark mode: $yellow-500)
- **Green**: Light green background ($green-100, dark mode: $green-500)

### Arrangement

- **Left** (default): Content on the left, media on the right
- **Right**: Content on the right, media on the left

## Basic Usage

```tsx
import { FeatureTwoColumn } from '@/shared/patterns/FeatureTwoColumn';

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

### Desktop (≥992px)
- Side-by-side layout with content and media columns (6/12 columns each)
- Media uses 1:1 (square) aspect ratio
- Vertical padding: 96px
- Text gap (title to description): 16px
- CTA gap (between buttons): 25px

### Tablet (576px - 991px)
- Stacked layout (content above media, 8/8 columns = full width)
- Media uses 16:9 aspect ratio
- Vertical padding: 80px
- Text gap: 8px
- Content to CTA gap: 32px
- CTA gap: 16px

### Mobile (<576px)
- Stacked layout (content above media, 4/4 columns = full width)
- Media uses 1:1 aspect ratio
- Vertical padding: 64px
- Text gap: 8px
- Content to CTA gap: 24px
- CTA gap: 16px

## Anatomy

```
FeatureTwoColumn
├── PageGrid Container (responsive padding)
│   └── PageGrid.Row (flex layout)
│       ├── PageGrid.Col (content column, 6/12 on desktop)
│       │   └── Content
│       │       ├── TextGroup
│       │       │   ├── Title (h2, heading-md)
│       │       │   └── Description (p, body-l)
│       │       └── CTA (button configuration varies by link count)
│       │           ├── 1 link: Secondary Button
│       │           ├── 2 links: Primary + Tertiary Buttons
│       │           └── 3-5 links: Primary + Tertiary (row), Secondary, Tertiary list
│       └── PageGrid.Col (media column, 6/12 on desktop)
│           └── Media
│               └── Image (object-fit: cover)
```

## CSS Classes

| Class | Description |
|-------|-------------|
| `.bds-feature-two-column` | Root element |
| `.bds-feature-two-column--neutral` | Neutral color theme |
| `.bds-feature-two-column--lilac` | Lilac color theme |
| `.bds-feature-two-column--yellow` | Yellow color theme |
| `.bds-feature-two-column--green` | Green color theme |
| `.bds-feature-two-column--left` | Content left arrangement |
| `.bds-feature-two-column--right` | Content right arrangement |
| `.bds-feature-two-column__container` | PageGrid container |
| `.bds-feature-two-column__row` | PageGrid.Row wrapper |
| `.bds-feature-two-column__content-col` | Content column wrapper |
| `.bds-feature-two-column__content` | Content container |
| `.bds-feature-two-column__text-group` | Title + description container |
| `.bds-feature-two-column__title` | Title heading |
| `.bds-feature-two-column__description` | Description text |
| `.bds-feature-two-column__cta` | CTA buttons container |
| `.bds-feature-two-column__cta--single` | Single button variant |
| `.bds-feature-two-column__cta--double` | Two button variant |
| `.bds-feature-two-column__cta--multiple` | Multiple buttons variant |
| `.bds-feature-two-column__media-col` | Media column wrapper |
| `.bds-feature-two-column__media` | Media container |
| `.bds-feature-two-column__media-img` | Media image |

## Accessibility

- Uses semantic `<section>` element for the pattern container
- Title uses `<h2>` heading for proper document structure
- Media requires `alt` text for screen readers
- Buttons inherit accessible labels from the Button component
- Color contrast ratios meet WCAG 2.1 AA standards

## Design References

- **Figma Design**: [Pattern - Feature - Two Column](https://www.figma.com/design/3tmqxMrEvOVvpYhgOCxv2D/Pattern-Feature---Two-Column?node-id=20017-3501&m=dev)
- **Component Location**: `shared/patterns/FeatureTwoColumn/`
- **Color Tokens**: `styles/_colors.scss`
- **Typography**: `styles/_font.scss`

