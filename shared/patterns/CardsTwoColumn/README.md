# CardsTwoColumn Pattern

A section pattern featuring a header with title and description, plus a 2×2 grid of TextCard components. Designed for showcasing multiple related content areas with visual variety through 5 color variants.

## Features

- **Header Section**: Title (heading-md) with optional description (body-l, muted)
- **4-Card Grid**: 2×2 layout on desktop, single column stacked on tablet/mobile
- **5 Color Variants**: Green, neutral-light, neutral-dark, lilac, and yellow
- **Interactive States**: Hover (window shade animation), focus, and pressed states
- **Responsive Design**: Adapts layout and spacing across all breakpoints
- **Dark Mode Support**: Full dark mode styling via `html.dark`

## Usage

```tsx
import { CardsTwoColumn } from 'shared/patterns/CardsTwoColumn';

<CardsTwoColumn
  title="The Future of Finance is Already Onchain"
  description="XRP Ledger isn't about bold predictions. It's about delivering value now."
  secondaryDescription="On XRPL, you're not waiting for the future. You're building it."
  cards={[
    { title: "Institutions", description: "Banks, asset managers...", color: "lilac" },
    { title: "Developers", description: "Build decentralized...", color: "neutral-light" },
    { title: "Enterprise", description: "Scale your business...", color: "neutral-dark" },
    { title: "Community", description: "Join the global...", color: "green" }
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | *required* | Section title (heading-md typography) |
| `description` | `ReactNode` | - | Section description (body-l, muted color) |
| `secondaryDescription` | `ReactNode` | - | Additional description paragraph |
| `cards` | `[TextCardProps, TextCardProps, TextCardProps, TextCardProps]` | *required* | Array of exactly 4 card configurations |
| `className` | `string` | - | Additional CSS classes |

### TextCardProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | *required* | Card title (heading-lg typography) |
| `description` | `ReactNode` | - | Card description (body-l typography) |
| `href` | `string` | - | Optional link URL (makes card clickable) |
| `color` | `'green' \| 'neutral-light' \| 'neutral-dark' \| 'lilac' \| 'yellow'` | `'neutral-light'` | Background color variant |

## Responsive Behavior

### Desktop (≥992px)
- Header: Two-column layout (title left, description right)
- Cards: 2×2 grid with 8px gap
- Section padding: 40px vertical, 32px horizontal
- Gap between header and cards: 40px
- Card height: 340px, padding: 24px

### Tablet (576-991px)
- Header: Stacked (title above description)
- Cards: Single column, stacked vertically with 8px gap
- Section padding: 32px vertical, 24px horizontal
- Gap between header and cards: 32px
- Card height: 309px, padding: 20px

### Mobile (<576px)
- Header: Stacked (title above description)
- Cards: Single column, stacked vertically with 8px gap
- Section padding: 24px vertical, 16px horizontal
- Gap between header and cards: 24px
- Card height: 274px, padding: 16px

## Color Variants & States (Light Mode)

Each color variant has three interactive states with a "window shade" hover animation:

| Variant | Default | Hover | Pressed |
|---------|---------|-------|---------|
| `green` | `$green-200` (#70EE97) | `$green-300` (#21E46B) | `$green-400` (#0DAA3E) |
| `neutral-light` | `$gray-200` (#E6EAF0) | `$gray-300` (#CAD4DF) | `$gray-400` (#8A919A) |
| `neutral-dark` | `$gray-300` (#CAD4DF) | `$gray-400` (#8A919A) | `$gray-500` (#72777E) |
| `lilac` | `$lilac-200` (#D9CAFF) | `$lilac-300` (#C0A7FF) | `$lilac-400` (#7649E3) |
| `yellow` | `$yellow-100` (#F3F1EB) | `$yellow-200` (#E6F1A7) | `$yellow-300` (#DBF15E) |

## CSS Classes

```
.bds-cards-two-column                    // Section container
.bds-cards-two-column__container         // Inner container with max-width
.bds-cards-two-column__header            // Header section
.bds-cards-two-column__header-left       // Left side (title)
.bds-cards-two-column__header-right      // Right side (description)
.bds-cards-two-column__title             // Section title
.bds-cards-two-column__description       // Section description
.bds-cards-two-column__cards             // Cards grid container
```

## Typography Tokens

- **Section Title**: Uses `h-md` (heading-md, Tobias Light)
  - Desktop: 40px / 46px line-height
  - Tablet: 36px / 45px line-height
  - Mobile: 32px / 40px line-height

- **Section Description**: Uses `body-l` (Booton Light), color: `$gray-500`
  - All breakpoints: 18px / 26.1px line-height

- **Card Title**: Uses `h-lg` (heading-lg, Tobias Light)
  - Desktop: 48px / 52.8px line-height
  - Tablet: 42px / 46.2px line-height
  - Mobile: 36px / 39.6px line-height

- **Card Description**: Uses `body-l` (Booton Light)
  - All breakpoints: 18px / 26.1px line-height

## Files

- `CardsTwoColumn.tsx` - Main pattern component
- `CardsTwoColumn.scss` - Styles with responsive breakpoints
- `index.ts` - Barrel exports
- `README.md` - This documentation

## Related Components

- **TextCard**: Core component for individual cards within the grid (`shared/components/TextCard`)
- **PageGrid**: Can be used alongside for additional layout needs

## Design References

- **Figma Design**: [Section Cards - Two Column](https://www.figma.com/design/MP5gjNp7yPBnKBKleb8LRL/Section-Cards---Two-Column)
- **Showcase Page**: `/about/cards-two-column-showcase`
- **Component Location**: `shared/patterns/CardsTwoColumn/`

## Version History

- **January 2026**: Initial implementation
  - Header section with title and description
  - 2×2 card grid with 5 color variants (green, neutral-light, neutral-dark, lilac, yellow)
  - Window shade hover animation
  - Full responsive design
  - Dark mode support

