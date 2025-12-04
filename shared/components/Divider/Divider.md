# Divider Component Documentation

## Overview

The Divider component is a visual separator that creates clear boundaries between content sections, elements, or groups. Following the XRPL Brand Design System (BDS), it supports two orientations, three stroke weights, and three color variants to adapt to different visual contexts and hierarchy needs.

## Features

- **Two Orientations**: Horizontal (default) and Vertical
- **Three Stroke Weights**: Thin (0.5px), Regular (1px), Strong (2px)
- **Three Color Variants**: Gray (default), Black, Green
- **Theme Support**: Automatic light/dark mode adaptation
- **Accessibility**: Configurable for decorative or semantic use
- **Flexible Sizing**: Inherits width/height from parent container

## Props API

```typescript
interface DividerProps {
  /** Divider orientation - horizontal separates vertical content, vertical separates horizontal content */
  orientation?: 'horizontal' | 'vertical';
  /** Stroke weight - controls visual thickness */
  weight?: 'thin' | 'regular' | 'strong';
  /** Color variant - gray (default), black for stronger contrast, green for brand emphasis */
  color?: 'gray' | 'black' | 'green';
  /** Additional CSS classes */
  className?: string;
  /** Whether the divider is purely decorative (hides from screen readers) */
  decorative?: boolean;
}
```

### Default Values

- `orientation`: `'horizontal'`
- `weight`: `'regular'`
- `color`: `'gray'`
- `className`: `''`
- `decorative`: `true`

## Orientations

### Horizontal Divider

Horizontal dividers extend left to right to separate vertically stacked content. They span the full width of their container by default.

**Common Uses:**
- Between content blocks or sections
- Separating list items
- Within cards to divide content areas

**Usage:**
```tsx
<Divider orientation="horizontal" />
// or simply (horizontal is default)
<Divider />
```

### Vertical Divider

Vertical dividers extend top to bottom to separate horizontally aligned content. They inherit height from their parent container.

**Common Uses:**
- Between columns in a layout
- Separating navigation items
- Within toolbars or action bars

**Usage:**
```tsx
<Divider orientation="vertical" />
```

**Note:** Vertical dividers require a parent container with a defined height.

## Stroke Weights

### Thin (0.5px)

The lightest weight for subtle, unobtrusive separation. Use when content is closely related but needs minimal visual distinction.

**Best For:**
- Within cards or small content areas
- Between tightly grouped elements
- Dense layouts where heavier dividers would feel cluttered

**Usage:**
```tsx
<Divider weight="thin" />
```

### Regular (1px) - Default

The standard weight for most use cases. Provides clear separation without dominating the visual hierarchy.

**Best For:**
- Most layout and section separations
- Between content blocks
- General-purpose dividers

**Usage:**
```tsx
<Divider weight="regular" />
// or simply (regular is default)
<Divider />
```

### Strong (2px)

The heaviest weight for maximum emphasis. Use sparingly to highlight major transitions or boundaries.

**Best For:**
- Major section breaks
- Key boundaries between distinct content areas
- Emphasizing important transitions

**Usage:**
```tsx
<Divider weight="strong" />
```

## Color Variants

### Gray (Default)

Neutral, subtle separation that works in most contexts without drawing attention.

**Best For:**
- Most separations
- Subtle visual breaks
- Backgrounds where you don't want the divider to stand out

**Usage:**
```tsx
<Divider color="gray" />
// or simply (gray is default)
<Divider />
```

### Black

High-contrast separation for maximum visibility. In dark mode, this renders as white for proper contrast.

**Best For:**
- When stronger contrast is needed
- Light backgrounds where gray may be too subtle
- Important structural boundaries

**Usage:**
```tsx
<Divider color="black" />
```

### Green

Brand-colored separation that reinforces XRPL identity or indicates active/important areas.

**Best For:**
- Highlighting branded sections
- Active or selected states
- Drawing attention to specific content areas

**Usage:**
```tsx
<Divider color="green" />
```

## When to Use

Use a Divider to:

- **Separate content sections** - Create clear boundaries between distinct content groups
- **Organize lists** - Divide list items for better scanability
- **Structure cards** - Separate header, body, and footer areas within cards
- **Define columns** - Visually separate side-by-side content
- **Indicate transitions** - Mark boundaries between zones of information

## When NOT to Use

Avoid using a Divider when:

- **Spacing alone is sufficient** - If whitespace provides enough separation, skip the divider
- **Backgrounds provide contrast** - Different background colors may eliminate the need for dividers
- **It adds clutter** - In minimal designs, too many dividers can distract from content
- **To compensate for poor spacing** - Dividers should enhance, not replace, proper layout structure

## Usage Examples

### Basic Usage

```tsx
import { Divider } from 'shared/components/Divider';

// Default horizontal divider
<Divider />

// Vertical divider
<Divider orientation="vertical" />

// Strong green divider for emphasis
<Divider weight="strong" color="green" />
```

### List Separation

```tsx
<div className="list">
  <div className="list-item">Item One</div>
  <Divider weight="thin" />
  <div className="list-item">Item Two</div>
  <Divider weight="thin" />
  <div className="list-item">Item Three</div>
</div>
```

### Card Content Separation

```tsx
<div className="card">
  <div className="card-header">
    <h3>Card Title</h3>
  </div>
  <Divider weight="thin" color="gray" />
  <div className="card-body">
    <p>Card content goes here...</p>
  </div>
  <Divider weight="thin" color="gray" />
  <div className="card-footer">
    <button>Action</button>
  </div>
</div>
```

### Column Separation

```tsx
<div className="d-flex align-items-stretch" style={{ height: '200px' }}>
  <div className="column">Column One</div>
  <Divider orientation="vertical" color="gray" />
  <div className="column">Column Two</div>
  <Divider orientation="vertical" color="gray" />
  <div className="column">Column Three</div>
</div>
```

### Navigation Separation

```tsx
<nav className="d-flex align-items-center" style={{ height: '24px', gap: '1rem' }}>
  <a href="/">Home</a>
  <Divider orientation="vertical" weight="thin" />
  <a href="/docs">Documentation</a>
  <Divider orientation="vertical" weight="thin" />
  <a href="/api">API</a>
</nav>
```

### Major Section Break

```tsx
<section>
  <h2>Primary Content</h2>
  <p>Main content area...</p>
</section>

<Divider weight="strong" color="green" />

<section>
  <h2>Secondary Content</h2>
  <p>Supporting content area...</p>
</section>
```

### Semantic Divider (Accessible)

```tsx
// For dividers that should be announced by screen readers
<Divider decorative={false} />
```

## Accessibility

### Decorative vs Semantic

By default, dividers are decorative (`decorative={true}`) and hidden from screen readers:
- Sets `aria-hidden="true"`
- Uses `role="presentation"`

For semantic dividers that should be announced:
- Set `decorative={false}`
- Adds `role="separator"`
- Includes `aria-orientation` attribute

### Keyboard Navigation

Dividers are non-interactive elements and do not receive focus.

### Color Contrast

- **Gray variant**: Meets contrast requirements on dark backgrounds; may need weight adjustment on light backgrounds
- **Black variant**: High contrast in both themes (renders as white in dark mode)
- **Green variant**: Brand color provides good contrast in both themes

## Best Practices

1. **Use consistent weights** - Stick to one weight within the same context (e.g., all list dividers should be the same weight)

2. **Match hierarchy to importance** - Use thinner dividers for minor separations, stronger for major breaks

3. **Don't overuse dividers** - If every element has a divider, none stand out; use sparingly for maximum effect

4. **Consider spacing first** - Before adding a divider, try adjusting margins or padding

5. **Maintain alignment** - Dividers should align with content; avoid full-width dividers in padded containers

6. **Use color purposefully** - Reserve green for branded emphasis; gray for most cases; black for high contrast needs

7. **Test in both themes** - Verify dividers are visible and appropriate in both light and dark modes

8. **Parent container setup** - For vertical dividers, ensure the parent has `display: flex`, `align-items: stretch`, and a defined height

## Theme Support

The component automatically adapts colors for light and dark modes:

| Color | Dark Mode (Default) | Light Mode |
|-------|---------------------|------------|
| Gray | `$gray-600` (#454549) | `$gray-300` (#C1C1C2) |
| Black | `$white` (#FFFFFF) | `$gray-900` (#111112) |
| Green | `$green-300` (#21E46B) | `$green-300` (#21E46B) |

## Related Components

- **Card** - Often uses horizontal dividers between sections
- **List** - May use dividers between list items
- **Navigation** - Vertical dividers separate nav groups
- **Form** - Dividers separate form sections

## Showcase

See the interactive showcase at `/about/divider-showcase` for live examples of all variants, weights, colors, and real-world usage patterns.

## File Structure

```
shared/components/Divider/
├── Divider.tsx        # Component implementation
├── Divider.scss       # Component styles
├── Divider.md         # This documentation
└── index.ts           # Exports
```
