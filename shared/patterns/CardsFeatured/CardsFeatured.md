# CardsFeatured Pattern

A section pattern that displays a heading, description, and a responsive grid of `CardImage` components. Follows the "Logo Rectangle Grid" design from Figma.

## Features

- Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)
- Heading with `h-md` typography (Tobias Light)
- Description with `body-l` typography (Booton Light)
- Proper spacing using `PageGrid` for container and alignment
- Full dark mode support

## Usage

```tsx
import { CardsFeatured } from 'shared/patterns/CardsFeatured';

<CardsFeatured
  heading="Trusted by Leaders in Real-World Asset Tokenization"
  description="Powering institutions and builders who are bringing real world assets on chain at global scale."
  cards={[
    {
      image: "/img/docs.png",
      imageAlt: "Documentation",
      title: "Documentation",
      subtitle: "Access everything you need to get started working with the XRPL.",
      buttonLabel: "Get Started",
      href: "/docs"
    },
    {
      image: "/img/tutorials.png",
      imageAlt: "Tutorials",
      title: "Tutorials",
      subtitle: "Step-by-step guides to help you build on the XRP Ledger.",
      buttonLabel: "View Tutorials",
      href: "/tutorials"
    },
    // ... more cards
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `heading` | `React.ReactNode` | Yes | Section heading text |
| `description` | `React.ReactNode` | Yes | Section description text |
| `cards` | `CardsFeaturedCardConfig[]` | Yes | Array of card configurations (uses `CardImageProps`) |
| `className` | `string` | No | Additional CSS class names |

### CardsFeaturedCardConfig

Each card in the `cards` array accepts all props from `CardImageProps`:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `image` | `string` | Yes | Image URL |
| `imageAlt` | `string` | Yes | Image alt text |
| `title` | `string` | Yes | Card title |
| `subtitle` | `string` | No | Card subtitle/description |
| `buttonLabel` | `string` | No | Button text |
| `href` | `string` | No | Link URL |

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
- Cards gap: 48px mobile (vertical), 8px tablet/desktop

## CSS Classes

| Class | Description |
|-------|-------------|
| `.bds-cards-featured` | Base section container |
| `.bds-cards-featured__header` | Header wrapper for heading and description |
| `.bds-cards-featured__heading` | Section heading (uses `.h-md`) |
| `.bds-cards-featured__description` | Section description (uses `.body-l`) |
| `.bds-cards-featured__cards` | Cards grid container |
| `.bds-cards-featured__card-wrapper` | Individual card wrapper |

## Showcase

View the pattern showcase at: `/about/cards-featured-showcase`

