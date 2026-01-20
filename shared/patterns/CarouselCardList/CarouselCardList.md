# CarouselCardList Pattern

A horizontal scrolling carousel pattern that displays `CardOffgrid` components with navigation buttons. Features responsive sizing, smooth scrolling, and full dark/light mode theming support.

## Features

- Horizontal scrolling card carousel with navigation buttons
- Automatic button enable/disable based on scroll position
- Two color variants: `neutral` and `green` (inherited by cards and buttons)
- Responsive card sizing across mobile, tablet, and desktop breakpoints
- Full dark mode and light mode support
- Heading and description constrained to page grid
- Hidden scrollbar with smooth scroll behavior
- Keyboard navigation and accessibility support

## Usage

```tsx
import { CarouselCardList } from 'shared/patterns/CarouselCardList';

<CarouselCardList
  variant="neutral"
  heading="Why Build on the XRP Ledger"
  description="Discover the unique features that make XRPL ideal for your project."
  cards={[
    {
      icon: <TokenIcon />,
      title: "Native\nTokenization",
      description: "Issue and manage digital assets directly on the ledger.",
      href: "/docs/tokenization",
    },
    {
      icon: <WalletIcon />,
      title: "Low Cost\nTransactions",
      description: "Transaction costs are a fraction of a cent.",
      href: "/docs/fees",
    },
    // ... more cards
  ]}
/>
```

## Props

### CarouselCardListProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `'neutral' \| 'green'` | No | `'neutral'` | Color variant for cards and navigation buttons |
| `heading` | `ReactNode` | Yes | - | Section heading text |
| `description` | `ReactNode` | Yes | - | Section description text |
| `cards` | `CarouselCardConfig[]` | Yes | - | Array of card configurations |
| `className` | `string` | No | - | Additional CSS classes for the section |

### CarouselCardConfig

Each card in the `cards` array accepts the following properties (same as `CardOffgridProps`, excluding `variant`):

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `icon` | `ReactNode \| string` | Yes | Icon component or image URL |
| `title` | `string` | Yes | Card title (use `\n` for line breaks) |
| `description` | `string` | Yes | Card description text |
| `href` | `string` | No | Link destination URL |
| `onClick` | `() => void` | No | Click handler function |
| `disabled` | `boolean` | No | Disabled state |
| `className` | `string` | No | Additional CSS classes |

## Variants

### Neutral Variant

The default variant using gray color palette. Best for general purpose content sections.

```tsx
<CarouselCardList
  variant="neutral"
  heading="Platform Features"
  description="Explore what makes our platform unique."
  cards={cards}
/>
```

### Green Variant

Uses the brand green color palette. Best for featured or highlighted sections.

```tsx
<CarouselCardList
  variant="green"
  heading="Enterprise Solutions"
  description="Purpose-built for institutional adoption."
  cards={cards}
/>
```

## Responsive Behavior

| Breakpoint | Card Width | Card Height | Card Padding | Button Size |
|------------|------------|-------------|--------------|-------------|
| Mobile (< 576px) | 343px | 400px | 16px | 37px |
| Tablet (576px - 991px) | 356px | 440px | 20px | 37px |
| Desktop (≥ 992px) | 400px | 480px | 24px | 40px |

### Spacing Tokens

| Token | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| Header gap | 8px | 8px | 16px |
| Section gap | 24px | 32px | 40px |
| Cards gap | 8px | 8px | 8px |

## Accessibility

- Navigation buttons have descriptive `aria-label` attributes ("Previous cards", "Next cards")
- Carousel track has `role="region"` with `aria-label="Card carousel"`
- Keyboard navigation supported via Tab and arrow keys
- Focus ring visible on keyboard navigation (uses `focus-visible`)
- Disabled buttons properly convey state via `disabled` attribute and visual styling
- Cards support keyboard interaction (Tab, Enter, Space)

## Design Tokens

### Colors (Dark Mode - Default)

**Neutral Variant:**
- Button Enabled: `$gray-300` (#CAD4DF)
- Button Hover: `$gray-400` (#8A919A)
- Button Disabled: `$gray-500` @ 50% opacity

**Green Variant:**
- Button Enabled: `$green-300` (#21E46B)
- Button Hover: `$green-200` (#70EE97)
- Button Disabled: `$green-100` (#ACFFC5)

### Colors (Light Mode - `html.light`)

**Neutral Variant:**
- Button Enabled: `$gray-300` (#CAD4DF)
- Button Hover: `$gray-400` (#8A919A)
- Button Disabled: `$gray-100` (#F0F3F7)

**Green Variant:**
- Button Enabled: `$green-300` (#21E46B)
- Button Hover: `$green-200` (#70EE97)
- Button Disabled: `$green-100` (#ACFFC5)

## CSS Classes

| Class | Description |
|-------|-------------|
| `.bds-carousel-card-list` | Base section container |
| `.bds-carousel-card-list--neutral` | Neutral color variant |
| `.bds-carousel-card-list--green` | Green color variant |
| `.bds-carousel-card-list__header` | Header wrapper (title, subtitle, nav) |
| `.bds-carousel-card-list__header-content` | Title and subtitle wrapper |
| `.bds-carousel-card-list__heading` | Section heading (uses `.h-md`) |
| `.bds-carousel-card-list__description` | Section description (uses `.body-l`) |
| `.bds-carousel-card-list__nav` | Navigation buttons wrapper |
| `.bds-carousel-card-list__button` | Navigation button |
| `.bds-carousel-card-list__button--prev` | Previous button modifier |
| `.bds-carousel-card-list__button--disabled` | Disabled button modifier |
| `.bds-carousel-card-list__track-wrapper` | Scroll container wrapper |
| `.bds-carousel-card-list__track` | Horizontal scroll track |
| `.bds-carousel-card-list__card` | Individual card wrapper |

## Showcase

View the pattern showcase at: `/about/carousel-card-list-showcase`

## Design References

- **Main Design:** [Section Carousel - Card List (Figma)](https://www.figma.com/design/w0CVv1c40nWDRD27mLiMWS/Section-Carousel---Card-List?node-id=15055-3730&m=dev)
- **Button States:** [Carousel Button States (Figma)](https://www.figma.com/design/w0CVv1c40nWDRD27mLiMWS/Section-Carousel---Card-List?node-id=15055-1033&m=dev)

