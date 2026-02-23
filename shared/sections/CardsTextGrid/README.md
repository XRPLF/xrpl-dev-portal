# CardsTextGrid Pattern

A section pattern with a header (heading + description) and a grid of CardTextIconCard components.

## Overview

CardsTextGrid mirrors the LinkTextDirectory header structure and renders cards in a responsive grid using PageGrid.Row as="ul" and CardTextIconCard with gridColSpan. Each card is a PageGrid.Col as="li"—no div wrapper.

## Features

- Header with heading and optional description
- Responsive grid: 3 cards/row at base+md, 2 cards/row at lg
- Aspect ratios: sm 16:9, md 3:2, lg 3:1
- Light/dark mode support

## Usage

```tsx
import { CardsTextGrid } from 'shared/sections/CardsTextGrid';

<CardsTextGrid
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

- base: 4, md: 4, lg: 6 (3 cards/row at base+md, 2 at lg)

## Files

- `CardsTextGrid.tsx` - React component
- `CardsTextGrid.scss` - Styles
- `index.ts` - Barrel exports
- `README.md` - This file
