# CardsIconGrid Pattern

A section pattern that displays a heading, optional description, and a responsive grid of `CardIcon` components. Follows the "CardIconGrid" design from Figma.

## Features

- Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)
- Heading with `heading-md` typography (Tobias Light)
- Optional description with `body-l` typography (Booton Light)
- Proper spacing using `PageGrid` for container and alignment
- Full dark mode support
- Uses the existing `CardIcon` component for cards

## Usage

```tsx
import { CardsIconGrid } from 'shared/patterns/CardsIconGrid';

<CardsIconGrid
  heading="Unlock new business models with embedded payments"
  description="Streamline development and build powerful RWA tokenization solutions with XRP Ledger's comprehensive developer toolset."
  cards={[
    {
      icon: "/icons/wallet.svg",
      label: "Digital Wallets",
      href: "/docs/wallets",
      variant: "green"
    },
    {
      icon: "/icons/payments.svg",
      label: "B2B Payment Rails",
      href: "/docs/payments",
      variant: "green"
    },
    {
      icon: "/icons/compliance.svg",
      label: "Compliance-First Payments",
      href: "/docs/compliance",
      variant: "green"
    }
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `heading` | `React.ReactNode` | Yes | Section heading text |
| `description` | `React.ReactNode` | No | Section description text (optional) |
| `cards` | `CardsIconGridCardConfig[]` | Yes | Array of card configurations (uses `CardIconProps`) |
| `className` | `string` | No | Additional CSS class names |

### CardsIconGridCardConfig

Each card in the `cards` array accepts all props from `CardIconProps`:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `icon` | `string` | Yes | Icon image source (URL or path) |
| `iconAlt` | `string` | No | Alt text for the icon image |
| `label` | `string` | Yes | Card label text |
| `variant` | `'neutral' \| 'green'` | No | Color variant (default: 'neutral') |
| `href` | `string` | No | Link destination - renders as `<a>` |
| `onClick` | `() => void` | No | Click handler - renders as `<button>` |
| `disabled` | `boolean` | No | Disabled state |

## Responsive Behavior

| Breakpoint | Grid Columns | Vertical Padding |
|------------|--------------|------------------|
| Mobile (< 768px) | 1 column | 48px |
| Tablet (768px - 1199px) | 2 columns | 64px |
| Desktop (≥ 1200px) | 3 columns | 80px |

## Design Tokens

### Colors

| Mode | Element | Color |
|------|---------|-------|
| Light | Heading | `$black` (#141414) |
| Light | Description | `$black` (#141414) |
| Dark | Heading | `$white` (#FFFFFF) |
| Dark | Description | `$white` (#FFFFFF) |

### Spacing

- Header gap (heading to description): 8px mobile/tablet, 16px desktop
- Section gap (header to cards): 24px mobile, 32px tablet, 40px desktop
- Cards column gap: 24px mobile, 8px tablet/desktop
- Cards row gap: 24px mobile, 32px tablet, 40px desktop

## CSS Classes

| Class | Description |
|-------|-------------|
| `.bds-cards-icon-grid` | Base section container |
| `.bds-cards-icon-grid__header` | Header wrapper for heading and description |
| `.bds-cards-icon-grid__heading` | Section heading (uses `.h-md`) |
| `.bds-cards-icon-grid__description` | Section description (uses `.body-l`) |
| `.bds-cards-icon-grid__cards` | Cards grid container |
| `.bds-cards-icon-grid__card-wrapper` | Individual card wrapper |

## Card Variants

The pattern supports both CardIcon variants:

### Green Variant
```tsx
cards={[
  { icon: "/icons/wallet.svg", label: "Digital Wallets", href: "/wallets", variant: "green" }
]}
```

### Neutral Variant
```tsx
cards={[
  { icon: "/icons/docs.svg", label: "Documentation", href: "/docs", variant: "neutral" }
]}
```

## Without Description

The description prop is optional:

```tsx
<CardsIconGrid
  heading="Funding & Support Programs"
  cards={[...]}
/>
```

## Figma Reference

- Design: [Section Cards - Icon Grid](https://www.figma.com/design/Ojj6UpFBw3HMb0QqRaKxAU/Section-Cards---Icon?node-id=30071-3082&m=dev)

## Showcase

View the pattern showcase at: `/about/cards-icon-grid-showcase`

