# TextCard Component

A card component with a title at the top and description at the bottom. Used within the CardsTwoColumn pattern to display content in a 2×2 grid, but can also be used independently.

## Features

- **6 Color Variants**: Green, neutral-light, neutral-dark, lilac, yellow, and blue backgrounds
- **Window shade overlay**: On **desktop (≥992px)**, hover animates a bottom-up overlay; **active** (`:active`) shows the pressed overlay color
- **Focus**: Keyboard **Tab** (`:focus-visible`) uses the same card surface as hover for neutral variants; mouse click (`:focus` without `:focus-visible`) keeps the **default** surface so that after release, **hover** still shows the overlay when the pointer is still over the card
- **Visited links** (`<a>` with `href`): When a link has been visited, **default** card colors and a **hidden** overlay apply until hover or active (see [Visited state](#visited-state)); rules are scoped to **`html.light`** and **`html.dark`** so neutrals match each theme
- **Tablet & mobile** (`<992px`): Overlay **transition is off**; hover / focus-visible **jump** to the pressed overlay (same idea as TileLogo). **neutral-light** uses `$gray-400`; **neutral-dark** uses **`$gray-500`** so the two grays stay distinct on tap
- **Responsive Design**: Adapts height and padding across breakpoints
- **Optional Link**: `href` renders an `<a>`; otherwise an `<article>`
- **Flexible Content**: Title and description support `ReactNode`

## Usage

```tsx
import { TextCard } from 'shared/components/TextCard';

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
| `href` | `string` | - | Optional link URL (renders `<a>` instead of `<article>`) |
| `color` | `TextCardColor` | `'neutral-light'` | Background color variant |
| `disabled` | `boolean` | `false` | Whether the card is disabled |
| `className` | `string` | - | Additional CSS classes |

### TextCardColor

```tsx
type TextCardColor = 'green' | 'neutral-light' | 'neutral-dark' | 'lilac' | 'yellow' | 'blue';
```

## Responsive Behavior

| Breakpoint | Height | Padding |
|------------|--------|---------|
| Desktop (≥992px) | 340px | 24px |
| Tablet (576–991px) | 309px | 20px |
| Mobile (<576px) | 274px | 16px |

## Interaction model

- **Default**: Card background color from the variant; overlay is clipped off (shade “up”).
- **Hover** (desktop): Window shade reveals the **hover** overlay color (see tables below).
- **Active** (`:active`): Overlay uses the **pressed** color; shade stays fully revealed while the pointer is down.
- **Keyboard focus** (`:focus-visible`): For **neutral-light** and **neutral-dark**, the **card** background matches the hover surface token; overlay behavior matches hover. Other variants keep the default card background; outline follows focus rules below.
- **Mouse focus** (`:focus` without `:focus-visible`): Neutral variants keep the **default** card background so releasing a click while still hovering does **not** paint the whole card as hover-only— the **overlay** continues to show hover via `:hover`.
- **Tablet / mobile** (`max-width` below `lg`): No clip-path animation; hover/focus-visible shows the **pressed** overlay color immediately. Neutral-dark uses **`$gray-500`** on tap; neutral-light uses **`$gray-400`**.

## Visited state

For linked cards (`href` set), after the URL is visited:

- **Light theme** (`html.light`): `a` **visited** styles reset to the **light-mode default** background for that variant and **hide** the overlay until `:hover` or `:active`.
- **Dark theme** (`html.dark`): Same idea with **dark-mode default** surfaces (e.g. neutral-light **`$gray-300`**, neutral-dark **`$gray-400`**).

Implementation: `TextCard.scss` — visited rules live **only** under `html.light { … }` and `html.dark { … }` so neutral grays never mix themes.

## Color Variants & States

Colors below refer to the **card** default background, **overlay** fill (hover / focus ring of the shade), and **pressed** overlay. The overlay is the animated layer; default column is the base card color.

### Light Mode

| Variant | Default | Hover (overlay) | Focus keyboard (neutral) / overlay others | Pressed (overlay) |
|---------|---------|-----------------|-------------------------------------------|---------------------|
| `green` | `$green-200` (#70EE97) | `$green-300` (#21E46B) | `$green-300` | `$green-400` (#0DAA3E) |
| `neutral-light` | `$gray-200` (#E6EAF0) | `$gray-300` (#CAD4DF) | Card bg `$gray-300` | `$gray-400` (#8A919A) |
| `neutral-dark` | `$gray-300` (#CAD4DF) | `$gray-200` (#E6EAF0) | Card bg `$gray-200` | `$gray-400` (#8A919A) |
| `lilac` | `$lilac-200` (#D9CAFF) | `$lilac-300` (#C0A7FF) | `$lilac-300` | `$lilac-400` (#7649E3) |
| `yellow` | `$yellow-100` (#F3F1EB) | `$yellow-200` (#E6F1A7) | `$yellow-200` | `$yellow-300` (#DBF15E) |
| `blue` | `$blue-100` (#EDF4FF) | `$blue-200` (#93BFF1) | `$blue-200` | `$blue-300` (#428CFF) |

### Dark Mode

| Variant | Default | Hover (overlay) | Focus keyboard (neutral) / overlay others | Pressed (overlay) |
|---------|---------|-----------------|-------------------------------------------|---------------------|
| `green` | `$green-200` (#70EE97) | `$green-300` (#21E46B) | `$green-300` | `$green-400` (#0DAA3E) |
| `neutral-light` | `$gray-300` (#CAD4DF) | `$gray-200` (#E6EAF0) | Card bg `$gray-200` | `$gray-400` (#8A919A) |
| `neutral-dark` | `$gray-400` (#8A919A) | `$gray-300` (#CAD4DF) | Card bg `$gray-300` | `$gray-500` (#72777E) |
| `lilac` | `$lilac-200` (#D9CAFF) | `$lilac-300` (#C0A7FF) | `$lilac-300` | `$lilac-400` (#7649E3) |
| `yellow` | `$yellow-100` (#F3F1EB) | `$yellow-200` (#E6F1A7) | `$yellow-200` | `$yellow-300` (#DBF15E) |
| `blue` | `$blue-100` (#EDF4FF) | `$blue-200` (#93BFF1) | `$blue-200` | `$blue-300` (#428CFF) |

### Disabled State

| Mode | Background | Text |
|------|------------|------|
| Light | `$gray-100` (#F0F3F7) | `$gray-500` (#72777E) |
| Dark | `rgba($gray-500, 0.3)` | Default text color |

### Focus Outline

| Mode | Focus Outline |
|------|---------------|
| Light Mode | 2px solid black outline with 2px offset |
| Dark Mode | 2px solid white outline with 2px offset |

## CSS Classes

```
.bds-text-card                    // Base card container
.bds-text-card--green             // Green variant
.bds-text-card--neutral-light     // Neutral light variant
.bds-text-card--neutral-dark      // Neutral dark variant
.bds-text-card--lilac             // Lilac variant
.bds-text-card--yellow            // Yellow variant
.bds-text-card--blue              // Blue variant
.bds-text-card--disabled         // Disabled modifier
.bds-text-card__overlay           // Window shade overlay
.bds-text-card__title             // Title (h3)
.bds-text-card__description       // Description (p)
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
<TextCard title="Green" description="$green-200" color="green" />
<TextCard title="Neutral Light" description="$gray-200" color="neutral-light" />
<TextCard title="Neutral Dark" description="$gray-300" color="neutral-dark" />
<TextCard title="Lilac" description="$lilac-200" color="lilac" />
<TextCard title="Yellow" description="$yellow-100" color="yellow" />
<TextCard title="Blue" description="$blue-100" color="blue" />
```

### Disabled Card

```tsx
<TextCard
  title="Disabled Card"
  description="This card is disabled and cannot be interacted with."
  color="neutral-light"
  disabled
/>
```

### Within CardsTwoColumn Pattern

```tsx
import { CardsTwoColumn } from 'shared/sections/CardsTwoColumn';

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

## Files

- `TextCard.tsx` - Component implementation
- `TextCard.scss` - Styles (variants, `html.light` / `html.dark`, visited, breakpoint behavior)
- `index.ts` - Barrel exports
- `TextCard.md` - This documentation

## Related Components

- **CardsTwoColumn**: Pattern that uses TextCard in a 2×2 grid (`shared/sections/CardsTwoColumn`)

## Design References

- **Figma Design**: [Section Cards - Two Column](https://www.figma.com/design/MP5gjNp7yPBnKBKleb8LRL/Section-Cards---Two-Column)
- **Showcase**: `/showcase/cards-two-column` (see `showcase/cards-two-column.page.tsx`)
- **Component Location**: `shared/components/TextCard/`
