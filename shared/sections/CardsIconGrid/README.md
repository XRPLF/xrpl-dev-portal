# CardsIconGrid Pattern

A section pattern with a header (heading + description) and a grid of CardTextIconCard components.

## Overview

CardsIconGrid mirrors the LinkTextDirectory header structure and renders cards in a responsive grid using PageGrid.Row as="ul" and CardTextIconCard with gridColSpan. Each card is a PageGrid.Col as="li"—no div wrapper.

## Features

- Header with heading and optional description
- Responsive grid: 3 cards/row at all breakpoints (base, md, lg)
- Aspect ratios: sm 3:2, md/lg 4:3
- Light/dark mode support

## Usage

```tsx
import { CardsIconGrid } from 'shared/patterns/CardsIconGrid';

<CardsIconGrid
  heading="Explore Tools"
  description="Choose a tool to get started"
  cards={[
    {
      icon: "/icons/docs.svg",
      iconAlt: "Documentation",
      heading: "Documentation",
      description: "Access everything you need.",
    },
  ]}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `heading` | `string` | Section heading |
| `description` | `string` | Optional description |
| `cards` | `CardTextIconCardData[]` | Array of card configs |
| `className` | `string` | Additional CSS classes |

## Grid Column Spans

- base: 4, md: 4, lg: 4 (3 cards per row)

## Files

- `CardsIconGrid.tsx` - React component
- `CardsIconGrid.scss` - Styles
- `index.ts` - Barrel exports
- `README.md` - This file
