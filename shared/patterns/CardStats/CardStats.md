# CardStats Pattern

A section pattern that displays a heading, optional description, and a responsive grid of `CardStat` components. Designed for showcasing key statistics and metrics on landing pages.

## Features

- Responsive grid layout (2 columns mobile/tablet, 3 columns desktop)
- Heading with `heading-md` typography (Tobias Light)
- Optional description with `body-l` typography (Booton Light)
- Proper spacing using `PageGrid` for container and alignment
- Full dark mode support
- Reuses the `CardStat` component for consistent styling

## Usage

```tsx
import { CardStats } from 'shared/patterns/CardStats';

<CardStats
  heading="Blockchain Trusted at Scale"
  description="Streamline development and build powerful RWA tokenization solutions with XRP Ledger's comprehensive developer toolset."
  cards={[
    {
      statistic: "12",
      superscript: "+",
      label: "Continuous uptime years",
      variant: "lilac",
      primaryButton: { label: "Learn More", href: "/docs" }
    },
    {
      statistic: "6M",
      superscript: "2",
      label: "Active wallets",
      variant: "light-gray",
      primaryButton: { label: "Explore", href: "/wallets" }
    },
    {
      statistic: "$1T",
      superscript: "+",
      label: "Value transferred",
      variant: "green",
      primaryButton: { label: "View Stats", href: "/stats" }
    },
    // ... more cards
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `heading` | `React.ReactNode` | Yes | Section heading text |
| `description` | `React.ReactNode` | No | Optional section description text |
| `cards` | `CardStatProps[]` | Yes | Array of CardStat configurations |
| `className` | `string` | No | Additional CSS classes |

### CardStat Configuration

Each card in the `cards` array accepts the following props:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `statistic` | `string` | Yes | The main statistic to display (e.g., "6M", "$1T") |
| `superscript` | `'+' \| '*' \| '1'-'9' \| '0'` | No | Superscript text for the statistic |
| `label` | `string` | Yes | Descriptive label for the statistic |
| `variant` | `'lilac' \| 'green' \| 'light-gray' \| 'dark-gray'` | No | Background color variant (default: 'lilac') |
| `primaryButton` | `{ label: string, href?: string, onClick?: () => void }` | No | Primary CTA button |
| `secondaryButton` | `{ label: string, href?: string, onClick?: () => void }` | No | Secondary CTA button |

## Color Variants

| Variant | Color | Hex | Use Case |
|---------|-------|-----|----------|
| `lilac` | Lilac 300 | #C0A7FF | User metrics, community stats |
| `green` | Green 300 | #21E46B | Financial metrics, growth indicators |
| `light-gray` | Gray 200 | #E6EAF0 | Technical stats, reliability metrics |
| `dark-gray` | Gray 300 | #CAD4DF | Neutral metrics, secondary info |

## Responsive Behavior

Uses breakpoints from `styles/_breakpoints.scss`:

| Breakpoint | Width | Columns | Card Gap |
|------------|-------|---------|----------|
| xs (Mobile) | 0 - 575px | 1 | 8px |
| md (Tablet) | 576px - 991px | 2 | 8px |
| lg (Desktop) | 992px+ | 3 | 8px |

## Examples

### With Description

```tsx
<CardStats
  heading="Blockchain Trusted at Scale"
  description="Streamline development and build powerful RWA tokenization solutions."
  cards={statsCards}
/>
```

### Without Description (Heading Only)

```tsx
<CardStats
  heading="XRPL Network Statistics"
  cards={statsCards}
/>
```

### Mixed Card Variants

```tsx
<CardStats
  heading="Why Build on XRPL?"
  cards={[
    { statistic: "12", superscript: "+", label: "Uptime years", variant: "lilac" },
    { statistic: "6M", label: "Active wallets", variant: "green" },
    { statistic: "3-5s", label: "Transaction finality", variant: "light-gray" },
  ]}
/>
```

## CSS Classes

| Class | Description |
|-------|-------------|
| `.bds-card-stats` | Base section container |
| `.bds-card-stats__header` | Header wrapper for heading and description |
| `.bds-card-stats__heading` | Section heading (uses `.h-md`) |
| `.bds-card-stats__description` | Section description (uses `.body-l`) |
| `.bds-card-stats__cards` | Cards grid container |
| `.bds-card-stats__card-wrapper` | Individual card wrapper |

## Design References

- **Figma Design**: [Section Cards - Stats](https://www.figma.com/design/drnQQXnK9Q67MTPPKQsY9l/Section-Cards---Stats?node-id=32051-2839&m=dev)
- **Showcase Page**: `/about/card-stats-showcase`
- **Pattern Location**: `shared/patterns/CardStats/`
- **Component Used**: `shared/components/CardStat/`

## Accessibility

- Uses semantic HTML with `<section>` and proper heading hierarchy
- CardStat buttons include proper focus states
- Color contrast meets WCAG AA requirements
- Responsive layout ensures readability on all devices

## Version History

- Initial implementation: January 2026
- Figma design alignment with 4 color variants
- Responsive grid layout with PageGrid integration

