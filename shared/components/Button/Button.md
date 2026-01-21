# Button Component Documentation

## Overview

The Button component is a scalable, accessible button implementation following the XRPL Brand Design System (BDS). It supports three visual variants (Primary, Secondary, Tertiary) and two color themes (Green, Black), with comprehensive state management and smooth animations.

## Features

- **Three Variants**: Primary (solid), Secondary (outline), Tertiary (text-only)
- **Two Color Themes**: Green (default) and Black
- **Link Support**: Can render as anchor elements for navigation via `href` prop
- **Animated Arrow Icon**: Optional icon with smooth hover animations
- **Full State Support**: Enabled, Hover, Focus, Active, and Disabled states
- **Responsive Design**: Adaptive padding and spacing across breakpoints
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Smooth Animations**: 150ms transitions with custom bezier timing

## Props API

```typescript
interface ButtonProps {
  /** Button variant - determines visual style */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** Color theme - green (default) or black */
  color?: 'green' | 'black';
  /**
   * Force the color to remain constant regardless of theme mode.
   * When true, the button color will not change between light/dark modes.
   * Use this for buttons on colored backgrounds where black should stay black.
   */
  forceColor?: boolean;
  /** Button content/label */
  children: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the arrow icon */
  showIcon?: boolean;
  /** Accessibility label - defaults to button text if not provided */
  ariaLabel?: string;
  /** URL to navigate to - renders as a Link instead of button */
  href?: string;
  /** Link target - only applies when href is provided */
  target?: '_self' | '_blank';
}
```

### Default Values

- `variant`: `'primary'`
- `color`: `'green'`
- `forceColor`: `false`
- `disabled`: `false`
- `type`: `'button'`
- `className`: `''`
- `showIcon`: `true`
- `ariaLabel`: (derived from children text)
- `href`: `undefined`
- `target`: `'_self'`

## Variants

### Primary Button

The Primary button is used for the main call-to-action on a page. It features a solid background that fills from bottom-to-top on hover.

**Visual Characteristics:**
- Solid background (Green 300 / Black)
- High visual emphasis
- Background color transitions on hover
- Black text on green background, white text on black background

**Usage:**
```tsx
<Button variant="primary" onClick={handleClick}>
  Get Started
</Button>
```

### Secondary Button

The Secondary button is used for supporting actions. It features an outline style with a transparent background that fills on hover.

**Visual Characteristics:**
- Transparent background with 2px border
- Medium visual emphasis
- Background fills from bottom-to-top on hover
- Green/Black text and border

**Usage:**
```tsx
<Button variant="secondary" onClick={handleClick}>
  Learn More
</Button>
```

### Tertiary Button

The Tertiary button is used for low-emphasis or contextual actions. It appears as text-only with optional underline on hover.

**Visual Characteristics:**
- Text-only, no background or border
- Lowest visual emphasis
- Underline appears on hover/focus
- Different typography (Body R token vs Label R)

**Usage:**
```tsx
<Button variant="tertiary" onClick={handleClick}>
  View Details
</Button>
```

## Color Themes

### Green Theme (Default)

The green theme uses the XRPL brand green colors:
- **Primary**: Green 300 background (#21E46B), Green 200 hover (#70EE97)
- **Secondary**: Green 400 text/border (#0DAA3E), Green 500 hover (#078139)
- **Tertiary**: Green 400 text (#0DAA3E), Green 500 hover (#078139)

### Black Theme

The black theme provides an alternative color scheme:
- **Primary**: Black background (#141414), 80% black hover
- **Secondary**: Black text/border (#141414), 15% black hover fill
- **Tertiary**: Black text (#141414)

**Usage:**
```tsx
<Button variant="primary" color="black" onClick={handleClick}>
  Dark Button
</Button>
```

### Force Color (Theme-Independent)

By default, black buttons automatically switch to green in dark mode for better visibility. However, when placing buttons on colored backgrounds (e.g., lilac, yellow, green), you may want black buttons to remain black regardless of theme mode.

Use the `forceColor` prop to prevent automatic color switching:

**Usage:**
```tsx
{/* Black button that stays black in both light and dark modes */}
<Button variant="primary" color="black" forceColor onClick={handleClick}>
  Always Black
</Button>

{/* Useful for colored backgrounds like in FeatureTwoColumn pattern */}
<FeatureTwoColumn color="lilac">
  <Button variant="primary" color="black" forceColor href="/get-started">
    Get Started
  </Button>
  <Button variant="tertiary" color="black" forceColor href="/learn-more">
    Learn More
  </Button>
</FeatureTwoColumn>
```

**When to use `forceColor`:**
- Buttons on colored backgrounds (lilac, yellow, green variants)
- When you need consistent button colors regardless of user's theme preference
- Pattern components like `FeatureTwoColumn` where black text is required for readability

**Note:** The `forceColor` prop only affects the color behavior; all other button functionality (hover animations, focus states, etc.) remains the same.

## Link Buttons

The Button component can render as an anchor element for navigation by passing the `href` prop. When `href` is provided, the button is wrapped in a Redocly `Link` component for proper routing support within the application.

### How It Works

- When `href` is provided and button is not disabled, renders as `<Link>` (anchor element)
- When `href` is not provided or button is disabled, renders as `<button>` element
- All visual styles and animations remain identical regardless of element type
- The Redocly Link component handles internal routing and external link handling

### Internal Navigation

For navigating within the application:

```tsx
<Button variant="primary" href="/docs">
  View Documentation
</Button>

<Button variant="secondary" href="/about">
  About Us
</Button>
```

### External Links

For external URLs, use `target="_blank"` to open in a new tab:

```tsx
<Button variant="primary" href="https://xrpl.org" target="_blank">
  Visit XRPL.org
</Button>
```

### Link with Click Handler

You can combine `href` with `onClick` for tracking or additional logic:

```tsx
<Button 
  variant="primary" 
  href="/signup" 
  onClick={() => trackEvent('signup_click')}
>
  Sign Up
</Button>
```

### Disabled Link Buttons

When `disabled={true}` and `href` is provided, the component renders as a `<button>` element instead of a link to prevent navigation:

```tsx
<Button variant="primary" href="/checkout" disabled>
  Checkout (Unavailable)
</Button>
```

### All Variants as Links

All button variants support link functionality:

```tsx
{/* Primary link button */}
<Button variant="primary" href="/get-started">
  Get Started
</Button>

{/* Secondary link button */}
<Button variant="secondary" href="/learn-more">
  Learn More
</Button>

{/* Tertiary link button */}
<Button variant="tertiary" href="/view-details">
  View Details
</Button>

{/* Black theme link button */}
<Button variant="primary" color="black" href="/dashboard">
  Dashboard
</Button>
```

## States

### Enabled State

The default interactive state of the button. All variants display their base styling.

### Hover State

Triggered when the user hovers over the button with a mouse:
- **Primary/Secondary**: Background fills from bottom-to-top
- **Tertiary**: Underline appears, text color darkens
- **All Variants**: Arrow icon line shrinks, gap increases (with icon)

### Focus State

Triggered when the button receives keyboard focus (Tab key):
- Similar visual changes to hover state
- Additional focus outline (2px border/outline)
- Ensures keyboard accessibility

### Active State

Triggered when the button is being pressed:
- Returns to default padding/gap
- Background resets (for Primary/Secondary)
- Maintains visual feedback during press

### Disabled State

When `disabled={true}`:
- Icon is automatically hidden
- Gray text and background (Primary) or border (Secondary)
- Cursor changes to `not-allowed`
- `pointer-events: none` prevents interaction
- `aria-disabled` attribute set for screen readers

**Usage:**
```tsx
<Button variant="primary" disabled>
  Unavailable
</Button>
```

## How It Works

### Component Structure

The Button component uses BEM (Block Element Modifier) naming convention with the `bds` namespace:

- `.bds-btn` - Base button class
- `.bds-btn--primary` - Primary variant modifier
- `.bds-btn--secondary` - Secondary variant modifier
- `.bds-btn--tertiary` - Tertiary variant modifier
- `.bds-btn--green` - Green color theme (default)
- `.bds-btn--black` - Black color theme
- `.bds-btn--disabled` - Disabled state modifier
- `.bds-btn--no-icon` - No icon modifier
- `.bds-btn__label` - Label element
- `.bds-btn__icon` - Icon container
- `.bds-btn__icon-line` - Arrow horizontal line
- `.bds-btn__icon-chevron` - Arrow chevron

### Background Animation

Primary and Secondary variants use a shared animation pattern:

1. **Pseudo-element (`::before`)**: Creates the hover background fill
2. **Transform Origin**: Set to `bottom center` for bottom-to-top fill
3. **Initial State**: `scaleY(0)` - background hidden
4. **Hover/Focus**: `scaleY(1)` - background fills from bottom
5. **Active**: `scaleY(0)` - background resets during press

This creates a smooth, directional fill animation that feels natural and responsive.

### Arrow Icon Animation

The arrow icon consists of two parts:
1. **Horizontal Line**: Shrinks from right to left (`scaleX(0)`) on hover/focus
2. **Chevron**: Stays visible, shifts right via increased gap

The gap between label and icon increases on hover/focus:
- **Default**: 16px (desktop), 16px (mobile)
- **Hover/Focus**: 22px (desktop), 21px (mobile)

This creates the illusion of the arrow "moving forward" as the line disappears.

### Padding Adjustments

On hover/focus, padding adjusts to accommodate the increased gap:
- **Primary**: `8px 19px 8px 20px` → `8px 13px 8px 20px` (desktop)
- **Secondary**: `6px 17px 6px 18px` → `6px 11px 6px 18px` (desktop)
- **Tertiary**: `8px 20px` → `8px 14px 8px 20px` (desktop)

These adjustments maintain visual balance while allowing the icon animation to work smoothly.

### Responsive Behavior

The component adapts to screen size at the `1023px` breakpoint:

**Desktop (≥1024px):**
- Larger padding values
- 22px gap on hover/focus

**Tablet/Mobile (≤1023px):**
- Reduced padding values
- 21px gap on hover/focus

All transitions remain smooth across breakpoints.

## Typography

### Primary & Secondary Variants
- **Font**: Booton, sans-serif
- **Size**: 16px (Label R token)
- **Weight**: 400
- **Line Height**: 23.2px
- **Letter Spacing**: 0px

### Tertiary Variant
- **Font**: Booton, sans-serif
- **Size**: 18px (Body R token)
- **Weight**: 400
- **Line Height**: 26.1px
- **Letter Spacing**: -0.5px

## Spacing & Layout

- **Border Radius**: 100px (fully rounded)
- **Max Height**: 40px
- **Icon Size**: 15px × 14px
- **Transitions**: 150ms with `cubic-bezier(0.98, 0.12, 0.12, 0.98)`

## Usage Examples

### Basic Usage

```tsx
import { Button } from 'shared/components/Button';

// Primary button (default)
<Button onClick={handleClick}>
  Get Started
</Button>

// Secondary button
<Button variant="secondary" onClick={handleClick}>
  Learn More
</Button>

// Tertiary button
<Button variant="tertiary" onClick={handleClick}>
  View Details
</Button>
```

### Form Integration

```tsx
<form onSubmit={handleSubmit}>
  <Button variant="primary" type="submit">
    Submit
  </Button>
  <Button variant="tertiary" type="reset">
    Reset
  </Button>
  <Button variant="tertiary" type="button" onClick={handleCancel}>
    Cancel
  </Button>
</form>
```

### Without Icon

```tsx
<Button variant="primary" showIcon={false} onClick={handleClick}>
  No Arrow
</Button>
```

### Disabled State

```tsx
<Button variant="primary" disabled>
  Unavailable
</Button>
```

### Color Themes

```tsx
{/* Green theme (default) */}
<Button variant="primary" color="green" onClick={handleClick}>
  Green Button
</Button>

{/* Black theme */}
<Button variant="primary" color="black" onClick={handleClick}>
  Black Button
</Button>
```

### Link Buttons

```tsx
{/* Internal navigation */}
<Button variant="primary" href="/docs">
  View Documentation
</Button>

{/* External link (opens in new tab) */}
<Button variant="primary" href="https://xrpl.org" target="_blank">
  Visit XRPL.org
</Button>

{/* Link with click tracking */}
<Button 
  variant="secondary" 
  href="/signup"
  onClick={() => analytics.track('signup_button')}
>
  Sign Up
</Button>

{/* Black theme link button */}
<Button variant="primary" color="black" href="/dashboard">
  Go to Dashboard
</Button>
```

### Visual Hierarchy

```tsx
{/* Use variants to create clear visual hierarchy */}
<Button variant="primary" onClick={handlePrimaryAction}>
  Main Action
</Button>
<Button variant="secondary" onClick={handleSecondaryAction}>
  Secondary Action
</Button>
<Button variant="tertiary" onClick={handleTertiaryAction}>
  Tertiary Action
</Button>
```

## Accessibility

### Keyboard Navigation

- **Tab**: Focus next button
- **Shift+Tab**: Focus previous button
- **Enter/Space**: Activate button
- **Focus Indicator**: Visible outline/border (2px)
- **Disabled buttons**: Not focusable

### Screen Reader Support

- Semantic `<button>` element (or `<a>` for link buttons)
- Button label announced via `aria-label` attribute
- `aria-disabled` attribute for disabled state
- Icon marked with `aria-hidden="true"`
- Link buttons use proper anchor semantics for navigation

### Color Contrast

All variants meet WCAG AA standards:
- **Primary**: Black on Green 300 = sufficient contrast
- **Secondary/Tertiary**: Green 400/500 on White = 4.52:1 / 5.12:1
- **Disabled**: Gray 400/500 indicates non-interactive state

### Focus Management

- Focus outline appears on keyboard navigation (`:focus-visible`)
- Focus styles match hover styles for consistency
- Square corners on Tertiary focus outline for better visibility

## Design Tokens

The component uses design tokens from the XRPL Brand Design System:

### Colors
- `$green-100` through `$green-500`
- `$gray-200`, `$gray-400`, `$gray-500`
- `$white`
- Neutral black (`#141414`)

### Spacing
- Border radius: `100px`
- Focus border width: `2px`
- Responsive breakpoint: `1023px`

### Motion
- Transition duration: `150ms`
- Timing function: `cubic-bezier(0.98, 0.12, 0.12, 0.98)`

## Best Practices

1. **Use Primary for main actions**: Reserve primary buttons for the most important action on a page
2. **Use Secondary for supporting actions**: Use secondary buttons for actions that support the primary action
3. **Use Tertiary for low-emphasis actions**: Use tertiary buttons for cancel, skip, or less important actions
4. **Maintain visual hierarchy**: Don't use multiple primary buttons on the same page
5. **Provide clear labels**: Button text should clearly indicate the action
6. **Handle disabled states**: Always provide feedback when actions are unavailable
7. **Test keyboard navigation**: Ensure all buttons are accessible via keyboard
8. **Consider context**: Choose color theme based on background and design context
9. **Use `href` for navigation**: When the button navigates to a new page, use the `href` prop instead of `onClick` with router navigation
10. **Use `target="_blank"` for external links**: Always open external URLs in a new tab for better UX
11. **Combine `href` with `onClick` for tracking**: When you need both navigation and analytics tracking

## Implementation Details

### Class Name Generation

The component builds class names dynamically:

```typescript
const classNames = [
  'bds-btn',
  `bds-btn--${variant}`,
  `bds-btn--${color}`,
  disabled ? 'bds-btn--disabled' : '',
  !shouldShowIcon ? 'bds-btn--no-icon' : '',
  className,
]
  .filter(Boolean)
  .join(' ');
```

### Icon Visibility Logic

The icon is automatically hidden when:
- `showIcon={false}` is passed
- `disabled={true}` is set

This ensures disabled buttons don't show interactive elements.

### Link Rendering Logic

The component conditionally renders as different elements:

```typescript
// Render as Link when href is provided and not disabled
if (href && !disabled) {
  return (
    <Link to={href} target={target} className={classNames}>
      {content}
    </Link>
  );
}

// Otherwise render as button
return (
  <button type={type} className={classNames} disabled={disabled}>
    {content}
  </button>
);
```

This ensures:
- Link buttons use proper anchor semantics for navigation
- Disabled state always renders as a button to prevent navigation
- Visual styles remain consistent across both element types

### State Management

The component manages states through CSS classes and props:
- **Disabled**: Controlled via `disabled` prop and `aria-disabled` attribute
- **Hover/Focus**: Handled by CSS `:hover` and `:focus-visible` pseudo-classes
- **Active**: Handled by CSS `:active` pseudo-class
- **Link vs Button**: Determined by presence of `href` prop

## Browser Support

The component uses modern CSS features:
- CSS Grid/Flexbox (widely supported)
- `:focus-visible` (supported in modern browsers)
- CSS transforms and transitions (widely supported)
- CSS custom properties (supported in modern browsers)

For older browser support, consider polyfills or fallbacks as needed.

## Related Components

- See showcase pages for interactive examples:
  - `about/button-showcase-tertiary.page.tsx`
  - Other variant showcase pages

## File Structure

```
shared/components/Button/
├── Button.tsx          # Component implementation
├── Button.scss        # Component styles
├── Button.md          # This documentation
└── index.ts           # Exports
```
