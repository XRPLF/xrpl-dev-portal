# StandardCardGroupSection Pattern

A section pattern that displays a headline, description, and a responsive grid of StandardCard components. All cards share a uniform variant determined by the section, ensuring visual consistency.

## Overview

The StandardCardGroupSection component provides a structured section with:

- Section-level headline and description
- Responsive grid layout (1 column mobile, 3 columns tablet and desktop)
- Uniform variant applied to all cards
- ARIA roles and labels for accessibility
- Full dark mode support

## Basic Usage

```tsx
import StandardCardGroupSection from "shared/patterns/StandardCardGroupSection/StandardCardGroupSection";

function MyPage() {
  return (
    <StandardCardGroupSection
      headline="Our Features"
      description="Explore what we offer"
      variant="neutral"
      cards={[
        {
          headline: "Feature 1",
          children: "Description of feature 1",
          callsToAction: [{ children: "Learn More", href: "/feature1" }],
        },
        {
          headline: "Feature 2",
          children: "Description of feature 2",
          callsToAction: [{ children: "Learn More", href: "/feature2" }],
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `headline` | `React.ReactNode` | Yes | Section headline text (h-md typography) |
| `description` | `React.ReactNode` | Yes | Section description text (body-l typography) |
| `variant` | `StandardCardVariant` | Yes | Background color variant applied uniformly to all cards |
| `cards` | `StandardCardPropsWithoutVariant[]` | Yes | Array of StandardCard configurations (variant is omitted) |
| `className` | `string` | No | Additional CSS classes for the section element |
| `...rest` | `HTMLSectionElement attributes` | No | Any other HTML section attributes |

**Exported Types:** The component file also exports `StandardCardPropsWithoutVariant` and `StandardCardVariant` types for convenience.

### Variant Types

The `variant` prop accepts one of four values:

- **`"neutral"`**: Default neutral background
- **`"green"`**: XRPL brand green background
- **`"yellow"`**: Yellow background
- **`"blue"`**: Blue background

### Cards Array

The `cards` prop accepts an array of `StandardCardPropsWithoutVariant`, which includes:

- `headline: React.ReactNode` - Card headline (required)
- `children?: React.ReactNode` - Card description/content (optional, uses React composition)
- `callsToAction: [DesignConstrainedButtonProps, DesignConstrainedButtonProps?]` - Array with primary CTA (required) and optional secondary CTA

**Note:** The `variant` prop is omitted from individual card configurations. The section's `variant` prop is applied uniformly to all cards.

## Examples

### With Secondary CTA

```tsx
<StandardCardGroupSection
  headline="Services"
  description="Comprehensive solutions for your needs"
  variant="green"
  cards={[
    {
      headline: "Enterprise Solutions",
      children: "Scalable infrastructure for large organizations",
      callsToAction: [
        { children: "Contact Sales", href: "/contact" },
        { children: "View Case Studies", href: "/cases" },
      ],
    },
  ]}
/>
```

### Single CTA Only

```tsx
<StandardCardGroupSection
  headline="Quick Links"
  description="Fast access to key resources"
  variant="neutral"
  cards={[
    {
      headline: "Documentation",
      children: "Complete API reference and guides",
      callsToAction: [{ children: "View Docs", href: "/docs" }],
    },
  ]}
/>
```

### All Variants

```tsx
// Neutral variant
<StandardCardGroupSection variant="neutral" cards={[...]} />

// Green variant
<StandardCardGroupSection variant="green" cards={[...]} />

// Yellow variant
<StandardCardGroupSection variant="yellow" cards={[...]} />

// Blue variant
<StandardCardGroupSection variant="blue" cards={[...]} />
```

## Responsive Layout

The component uses PageGrid for responsive layout:

- **Mobile (base)**: 1 column (`span={{ base: 12 }}`)
- **Tablet (md)**: 3 columns (`span={{ base: 12, md: 4 }}`)
- **Desktop (lg)**: 3 columns (`span={{ base: 12, md: 4, lg: 4 }}`)

Cards automatically adapt to the available space while maintaining consistent spacing.

## Accessibility

The component includes accessibility features:

- **ARIA Roles**: The cards container uses `role="list"` and each card uses `role="listitem"`
- **ARIA Labels**: Dynamic `aria-label` based on the section headline
- **Semantic HTML**: Uses `<section>` for the container and proper heading hierarchy
- **Keyboard Navigation**: Inherited from StandardCard and Button components

## CSS Classes

The component generates the following CSS classes:

- `bds-standard-card-group-section` - Root section element
- `bds-standard-card-group-section__header` - Header wrapper for headline and description
- `bds-standard-card-group-section__headline` - Section headline (uses .h-md)
- `bds-standard-card-group-section__description` - Section description (uses .body-l)

## Best Practices

1. **Variant Consistency**: All cards in a section share the same variant. This ensures visual consistency and prevents individual cards from having different variants.

2. **Card Count**: Aim for multiples of 3 for best visual balance on desktop (3, 6, 9 cards).

3. **Headlines**: Keep card headlines concise and impactful (1-2 lines preferred).

4. **Descriptions**: Provide clear, actionable descriptions (2-3 lines max).

5. **CTAs**: Use action-oriented button text ("Get Started" not "Click Here").

6. **Section Headline**: Make it descriptive and specific to help users understand the card group's purpose.

7. **Type Safety**: The `StandardCardPropsWithoutVariant` type ensures cards cannot include a `variant` prop, enforcing uniformity.

## Design Constraints

- **Uniform Variants**: All cards in a section must share the same variant
- **Responsive Grid**: Layout adapts from 1 column (mobile) to 3 columns (desktop)
- **Consistent Spacing**: Uses PageGrid gutter for consistent spacing between cards
- **Theme Support**: Full light/dark mode support with automatic background color switching
