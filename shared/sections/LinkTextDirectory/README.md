# LinkTextDirectory Component

A section pattern that displays a numbered list of LinkTextCard components with a heading and optional description.

## Overview

LinkTextDirectory is a section-level pattern that combines a header (heading + description) with a vertically stacked list of LinkTextCard components. Each card is automatically numbered sequentially (01, 02, 03...), making it perfect for feature lists, step-by-step guides, or numbered content sections.

## Features

- **Automatic Numbering**: Cards are numbered sequentially starting from 01
- **Responsive Layout**: Adaptive spacing and alignment across breakpoints
- **Desktop Right-Alignment**: Cards are right-aligned on desktop for visual interest
- **Minimal HTML Structure**: Flat, efficient DOM hierarchy
- **Light/Dark Mode**: Full theming support
- **Flexible Content**: Supports any number of cards

## Layout Behavior

| Breakpoint | Card Alignment | Gap Between Cards | Header Gap |
|------------|----------------|-------------------|------------|
| Base (< 576px) | Left | 24px | 8px |
| MD (576px - 991px) | Left | 32px | 8px |
| LG (≥ 992px) | Right | 40px | 16px |

**Desktop Behavior**: Cards are right-aligned using `align-items: flex-end`, creating a visually distinct layout compared to mobile/tablet.

## Usage

### Basic Usage

```tsx
<LinkTextDirectory
  heading="Explore XRPL Developer Tools"
  description="XRP Ledger is a compliance-focused blockchain where financial applications come to life"
  cards={[
    {
      heading: "Fast Settlement and Low Fees",
      description: "Settle transactions in 3-5 seconds for a fraction of a cent, ideal for large-scale, high-volume RWA tokenization",
      buttons: [
        { label: "Get Started", href: "/start" },
        { label: "Learn More", href: "/docs" }
      ]
    },
    {
      heading: "Secure and Reliable",
      description: "Built on proven blockchain technology with enterprise-grade security",
      buttons: [
        { label: "Read Documentation", href: "/docs" }
      ]
    },
    {
      heading: "Developer Friendly",
      description: "Comprehensive APIs and SDKs for seamless integration",
      buttons: [
        { label: "View API", href: "/api" },
        { label: "See Examples", href: "/examples" }
      ]
    }
  ]}
/>
```

### Without Description

```tsx
<LinkTextDirectory
  heading="Key Features"
  cards={featuresList}
/>
```

### With Dynamic Data

```tsx
const features = [
  {
    heading: "Feature One",
    description: "Description for feature one",
    buttons: [{ label: "Learn More", href: "/feature-1" }]
  },
  // ... more features
];

<LinkTextDirectory
  heading="Platform Features"
  description="Everything you need to build amazing applications"
  cards={features}
/>
```

## Props

### LinkTextDirectoryProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | `string` | Required | Section heading |
| `description` | `string` | - | Optional description text |
| `cards` | `LinkTextCardData[]` | Required | Array of card data |
| `className` | `string` | - | Additional CSS classes |

### LinkTextCardData

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | `string` | Required | Card heading |
| `description` | `string` | Required | Card description |
| `buttons` | `ButtonConfig[]` | Required | Array of button configs (max 2) |

### ButtonConfig (from ButtonGroup)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Required | Button text |
| `href` | `string` | - | Link destination |
| `onClick` | `() => void` | - | Click handler |

## Component Structure

```tsx
<PageGrid className="bds-link-text-directory">
  <PageGridRow>
    <PageGridCol className="bds-link-text-directory__header" span={{ base: 12, md: 6, lg: 8 }}>
      <h2 className="h-md">{heading}</h2>
      <p className="body-l">{description}</p>
    </PageGridCol>
  </PageGridRow>

  <PageGridRow>
    <PageGridCol span={{ base: 12, md: 8, lg: 8 }} offset={{ lg: 4 }}>
      <ul>
        {cards.map((card, index) => (
          <LinkTextCard
            key={index}
            index={index}
            heading={card.heading}
            description={card.description}
            buttons={card.buttons}
          />
        ))}
      </ul>
    </PageGridCol>
  </PageGridRow>
</PageGrid>
```

**Key Design Decisions:**
- **PageGrid Integration**: Uses PageGrid system for responsive layout
- **Typography Classes**: Uses existing `h-md` and `body-l` utility classes
- **Flexbox Header**: Header uses flexbox with gap for spacing between heading and description
- **Desktop Right-Alignment**: Cards offset by 4 columns at LG breakpoint (right-aligned)
- **Semantic List**: Cards wrapped in `<ul>` with each card as `<li>`

## Responsive Spacing

| Breakpoint | Section Padding | Header Gap | Header Margin-Bottom |
|------------|-----------------|------------|----------------------|
| Base (< 576px) | 24px | 8px | 24px |
| MD (576px - 991px) | 32px | 8px | 32px |
| LG (≥ 992px) | 40px | 16px | 40px |

**Section Padding**: Top and bottom padding on the entire section
**Header Gap**: Space between heading and description (via flexbox gap)
**Header Margin-Bottom**: Space between header and cards list

## Styling

### CSS Classes

- `.bds-link-text-directory` - Main PageGrid container with section padding
- `.bds-link-text-directory__header` - Header section (flexbox column with gap)

### Typography

- **Heading**: `h-md` class (responsive heading)
- **Description**: `body-l` class (large body text)
- Card content uses LinkTextCard's built-in typography

### Grid Layout

- **Header Column**: `span={{ base: 12, md: 6, lg: 8 }}`
- **Cards Column**: `span={{ base: 12, md: 8, lg: 8 }}` with `offset={{ lg: 4 }}`
- Cards are right-aligned on desktop via the 4-column offset

### Dark Mode

- Text color changes to white in dark mode
- Applied to entire section via `bds-theme-mode(dark)` mixin

## Card Numbering

Cards are automatically numbered based on their array index:

```typescript
cards[0] → LinkTextCard(index: 0) → displays "01"
cards[1] → LinkTextCard(index: 1) → displays "02"
cards[2] → LinkTextCard(index: 2) → displays "03"
// ... and so on
```

## Files

- `LinkTextDirectory.tsx` - React component
- `LinkTextDirectory.scss` - SCSS styles
- `index.ts` - Barrel exports
- `README.md` - This file

## Related Components

- **LinkTextCard**: Used for each card in the list
- **ButtonGroup**: Used by LinkTextCard for action buttons

## Import

```tsx
import { LinkTextDirectory } from 'shared/sections/LinkTextDirectory';
// or
import { 
  LinkTextDirectory, 
  type LinkTextDirectoryProps,
  type LinkTextCardData 
} from 'shared/sections/LinkTextDirectory';
```

## Design System

Part of the Brand Design System (BDS) with `bds-` namespace prefix.

## Best Practices

1. **Consistent Card Content**: Try to keep similar text lengths across cards for visual balance
2. **Limit Cards**: 3-6 cards works best for readability
3. **Clear Descriptions**: Keep descriptions concise but informative
4. **Button Labels**: Use clear, action-oriented button labels
5. **Logical Ordering**: Order cards by priority or logical sequence

## Accessibility

- Semantic HTML with proper heading hierarchy (`<h2>` for section, `<h5>` for cards)
- Semantic list structure: `<ul>` containing `<li>` elements
- Sequential tab order through cards and buttons
- ARIA-compliant button and link elements (via ButtonGroup)
- Maintains focus order: heading → description → card 1 → card 2 → etc.

## Best Practices for React Keys

When mapping over cards, use a stable identifier instead of array index:

```tsx
// ❌ Avoid using index as key
{cards.map((card, index) => (
  <LinkTextCard key={index} ... />
))}

// ✅ Better: Use a unique identifier
{cards.map((card, index) => (
  <LinkTextCard key={card.id || card.heading} ... />
))}

// ✅ Best: Add an id field to LinkTextCardData
interface LinkTextCardData {
  id: string;  // Unique identifier
  heading: string;
  description: string;
  buttons: ButtonConfig[];
}

{cards.map((card) => (
  <LinkTextCard key={card.id} ... />
))}
```

## Example with All Features

```tsx
<LinkTextDirectory
  heading="Why Choose XRPL"
  description="The most efficient blockchain for real-world applications"
  cards={[
    {
      heading: "Lightning Fast",
      description: "Process thousands of transactions per second with sub-3-second finality",
      buttons: [
        { label: "View Benchmarks", href: "/performance" },
        { label: "Try Demo", onClick: () => openDemo() }
      ]
    },
    {
      heading: "Cost Effective",
      description: "Minimal transaction fees make XRPL perfect for micro-transactions and high-volume use cases",
      buttons: [
        { label: "See Pricing", href: "/pricing" }
      ]
    },
    {
      heading: "Battle Tested",
      description: "Over 10 years of continuous operation with billions of transactions processed",
      buttons: [
        { label: "Read Case Studies", href: "/case-studies" },
        { label: "View Stats", href: "/statistics" }
      ]
    }
  ]}
  className="my-custom-class"
/>
```
