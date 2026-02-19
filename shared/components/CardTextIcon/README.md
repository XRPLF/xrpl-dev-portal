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
| `icon` | `string` | Optional | Icon image URL |
| `iconAlt` | `string` | `''` | Optional | Alt text for the icon image |
| `heading` | `string` | Required | Card heading |
| `description` | `React.ReactNode` | Required | Card description; accepts rich content (e.g., text with inline links) |
| `aspectRatio` | `number` | - | Optional ratio for future use; applied via CSS variable |
| `className` | `string` | - | Additional CSS classes |

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
| Base (< 576px) | 40px | 16px | 16px |
| MD (576px - 991px) | 36px | 20px | 20px |
| LG (≥ 992px) | 64px | 32px | 24px |

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
