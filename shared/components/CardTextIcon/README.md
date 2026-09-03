# CardTextIconCard Component

A card component featuring an icon, heading, and description. Built from Section Cards - Icon and Section Cards - Text Grid Figma designs.

## Overview

CardTextIconCard displays an icon at the top, followed by a heading and description. The description accepts `ReactNode`, so it can include hyperlinks and other rich content. No buttons; links are inline within the description.

## Features

- **Icon + Text Layout**: Icon container, heading, and description in a vertical stack (optional)
- **Rich Description**: `description` accepts `ReactNode` for inline links and formatted content
- **Aspect Ratio Foundation**: Optional `aspectRatio` prop for future responsive sizing
- **Light/Dark Mode**: Full theming support
- **Responsive Design**: Adaptive icon size and spacing across breakpoints

## Usage

### Basic Usage

```tsx
<CardTextIconCard
  icon="/icons/docs.svg"
  iconAlt="Documentation"
  heading="Documentation"
  description="Access everything you need to get started with the XRPL."
/>
```

### With Inline Link in Description

```tsx
<CardTextIconCard
  icon="/icons/docs.svg"
  heading="Documentation"
  description={
    <>
      Learn more in our{' '}
      <a href="/docs">documentation</a>.
    </>
  }
/>
```

Inline `<a>` tags in the description share the card’s description styles in `CardTextIconCard.scss`. In **light** mode, global `html.light` link rules can compete with those styles; use **`BdsLink`** with the design-system `bds-link` class if you need consistent BDS link behavior, or see `CardTextIconCard.scss` for `.bds-card-text-icon-card__description` link styling.

### With Aspect Ratio

```tsx
<CardTextIconCard
  icon="/icons/docs.svg"
  heading="Documentation"
  description="Access everything you need."
  aspectRatio={4 / 3}
/>
```

## Props

### CardTextIconCardProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string` | - | Icon image URL |
| `iconAlt` | `string` | `''` | Alt text for the icon image |
| `heading` | `string` | Required | Card heading |
| `headingAs` | `'h1'`–`'h6'` | `'h3'` | Semantic heading element, so cards enter the document outline. Use a level that fits the page hierarchy (typically one below the section heading). |
| `description` | `React.ReactNode` | Required | Card description; accepts rich content (e.g., text with inline links) |
| `aspectRatio` | `number` | - | Optional ratio for future use; applied via CSS variable |
| `gridColSpan` | `ResponsiveValue<PageGridSpanValue>` | - | When provided, the card renders as `PageGrid.Col as="li"` with this span, becoming the grid column itself. See [Grid integration](#grid-integration). |
| `height` | `number` | - | Explicit `height` attribute for the icon image |
| `width` | `number` | - | Explicit `width` attribute for the icon image |
| `className` | `string` | - | Additional CSS classes |

## Grid integration

The card has two rendering modes:

- **Standalone (default)** — renders a plain `<div class="bds-card-text-icon-card">`.
  Use this when you're placing the card inside your own layout.
- **Grid column** — when `gridColSpan` is provided, the card renders as
  `PageGrid.Col as="li"` with the modifier class
  `bds-card-text-icon-card--grid-col`. The card *is* the grid column, so it must
  sit inside a `PageGrid.Row as="ul"`.

This is how [CardsTextGrid](../../sections/CardsTextGrid/README.md) and
[CardsIconGrid](../../sections/CardsIconGrid/README.md) consume it — both pass
`gridColSpan={{ base: 4, md: 4, lg: 6 }}`.

```tsx
<PageGrid.Row as="ul">
  <CardTextIconCard
    heading="Documentation"
    description="Access everything you need."
    gridColSpan={{ base: 4, md: 4, lg: 6 }}
  />
</PageGrid.Row>
```

### Heading levels

`headingAs` defaults to `'h3'`. Because these cards are usually rendered under a
section heading, set it explicitly when `h3` would skip a level:

```tsx
<CardTextIconCard
  heading="Documentation"
  headingAs="h4"
  description="Access everything you need."
/>
```

## Component Structure

```tsx
<>
  <div className="bds-card-text-icon-card__icon">
    {icon && (  
    <img
      src={icon}
      alt={iconAlt}
      {...(iconHeight != null && { height: iconHeight })}
      {...(iconWidth != null && { width: iconWidth })}
      className="bds-card-text-icon-card__icon-img"
    />
    )}
    <strong className="bds-card-text-icon-card__heading sh-md-r">{heading}</strong>
  </div>
  <p className="bds-card-text-icon-card__description body-l">
    {description}
  </p>  
</>
```

## Responsive Sizing

| Breakpoint | Icon Size | Padding | Gap |
|------------|-----------|---------|-----|
| Base (< 576px) | 32px | 16px | 16px |
| MD (576px - 991px) | 36px | 20px | 20px |
| LG (≥ 992px) | 40px | 32px | 24px |

## Files

- `CardTextIconCard.tsx` - React component with TypeScript
- `CardTextIconCard.scss` - Styles with BEM naming
- `index.ts` - Barrel exports
- `README.md` - This file

## Import

```tsx
import { CardTextIconCard } from 'shared/components/CardTextIcon';
// or
import { CardTextIconCard, type CardTextIconCardProps } from 'shared/components/CardTextIcon';
```

## Design System

Part of the Brand Design System (BDS) with `bds-` namespace prefix.
