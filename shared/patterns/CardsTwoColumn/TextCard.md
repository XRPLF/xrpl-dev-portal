# TextCard Component

A card component with a title at the top and description at the bottom. Used within the CardsTwoColumn pattern to display content in a 2×2 grid, but can also be used independently.

## Features

- **4 Color Variants**: Green, neutral-light, neutral-dark, and lilac backgrounds
- **Responsive Design**: Adapts height and padding across breakpoints
- **Optional Link**: Can be made clickable with an `href` prop
- **Flexible Content**: Title and description support ReactNode

## Usage

```tsx
import { TextCard } from 'shared/patterns/CardsTwoColumn';

// Basic usage
<TextCard
  title="Institutions"
  description="Banks, asset managers, PSPs, and fintechs use XRPL to build financial products."
  color="green"
/>

// As a clickable card
<TextCard
  title="Developers"
  description="Build decentralized applications with comprehensive documentation."
  href="/developers"
  color="lilac"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | *required* | Card title (heading-lg typography) |
| `description` | `ReactNode` | - | Card description (body-l typography) |
| `href` | `string` | - | Optional link URL (makes card clickable) |
| `color` | `TextCardColor` | `'neutral-light'` | Background color variant |
| `className` | `string` | - | Additional CSS classes |

### TextCardColor

```tsx
type TextCardColor = 'green' | 'neutral-light' | 'neutral-dark' | 'lilac';
```

## Responsive Behavior

| Breakpoint | Height | Padding |
|------------|--------|---------|
| Desktop (≥992px) | 340px | 24px |
| Tablet (576-991px) | 309px | 20px |
| Mobile (<576px) | 274px | 16px |

## Color Variants

| Variant | Light Mode | Dark Mode |
|---------|------------|-----------|
| `green` | `$green-300` (#21E46B) | `$green-300` (#21E46B) |
| `neutral-light` | `$gray-200` (#E6EAF0) | `$gray-300` (#CAD4DF) |
| `neutral-dark` | `$gray-300` (#CAD4DF) | `$gray-400` (#8A919A) |
| `lilac` | `$lilac-200` (#D9CAFF) | `$lilac-200` (#D9CAFF) |

## CSS Classes

```
.bds-text-card                    // Base card container
.bds-text-card--green             // Green variant
.bds-text-card--neutral-light     // Neutral light variant
.bds-text-card--neutral-dark      // Neutral dark variant
.bds-text-card--lilac             // Lilac variant
.bds-text-card__header            // Title container
.bds-text-card__title             // Title element
.bds-text-card__footer            // Description container
.bds-text-card__description       // Description element
```

## Typography

- **Title**: Uses `h-lg` class (heading-lg, Tobias Light font)
  - Desktop: 48px / 52.8px line-height
  - Tablet: 42px / 46.2px line-height
  - Mobile: 36px / 39.6px line-height

- **Description**: Uses `body-l` class (Booton Light font)
  - All breakpoints: 18px / 26.1px line-height
  - Max width: 478px (from Figma)

## Examples

### All Color Variants

```tsx
<TextCard title="Green" description="$green-300" color="green" />
<TextCard title="Neutral Light" description="$gray-200" color="neutral-light" />
<TextCard title="Neutral Dark" description="$gray-300" color="neutral-dark" />
<TextCard title="Lilac" description="$lilac-200" color="lilac" />
```

### Within CardsTwoColumn Pattern

```tsx
import { CardsTwoColumn } from 'shared/patterns/CardsTwoColumn';

<CardsTwoColumn
  title="Section Title"
  description="Section description text."
  cards={[
    { title: "Card 1", description: "Description 1", color: "lilac" },
    { title: "Card 2", description: "Description 2", color: "neutral-light" },
    { title: "Card 3", description: "Description 3", color: "neutral-dark" },
    { title: "Card 4", description: "Description 4", color: "green" }
  ]}
/>
```

## Related Components

- **CardsTwoColumn**: Parent pattern that uses TextCard in a 2×2 grid layout

## Design References

- **Figma Design**: [Section Cards - Two Column](https://www.figma.com/design/MP5gjNp7yPBnKBKleb8LRL/Section-Cards---Two-Column)
- **Component Location**: `shared/patterns/CardsTwoColumn/TextCard.tsx`

