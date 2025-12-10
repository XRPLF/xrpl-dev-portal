# BdsLink Component

A comprehensive, accessible link component from the XRPL.org Brand Design System (BDS). Supports multiple variants, sizes, and automatic theme-aware color states with animated arrow icons.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Props API](#props-api)
- [Variants](#variants)
- [Sizes](#sizes)
- [Color States](#color-states)
- [Icon Animations](#icon-animations)
- [Accessibility](#accessibility)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [Related Components](#related-components)

---

## Installation

```tsx
import { BdsLink } from 'shared/components/Link';
// or
import { BdsLink } from 'shared/components/Link/Link';
```

---

## Basic Usage

```tsx
// Internal link (default)
<BdsLink href="/docs">View Documentation</BdsLink>

// External link
<BdsLink href="https://example.com" variant="external" target="_blank" rel="noopener noreferrer">
  External Resource
</BdsLink>

// Inline link (no icon)
<p>
  Learn more about <BdsLink href="/about" variant="inline">our mission</BdsLink>.
</p>
```

---

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | **required** | The URL the link points to |
| `variant` | `'internal' \| 'external' \| 'inline'` | `'internal'` | Link variant determining icon and behavior |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the link text and icon |
| `icon` | `'arrow' \| 'external' \| null` | `null` | Override icon type (auto-determined by variant if `null`) |
| `disabled` | `boolean` | `false` | Disables the link, preventing navigation |
| `children` | `React.ReactNode` | **required** | Link text content |
| `className` | `string` | - | Additional CSS classes |
| `...rest` | `AnchorHTMLAttributes` | - | All standard anchor attributes (`target`, `rel`, etc.) |

---

## Variants

### Internal (Default)

For navigation within the same website. Displays a horizontal arrow (→) that animates to a chevron (>) on hover.

```tsx
<BdsLink href="/docs" variant="internal">
  Internal Documentation
</BdsLink>
```

### External

For links to external websites. Displays a diagonal arrow with corner bracket (↗) that animates on hover. Always use with `target="_blank"` and `rel="noopener noreferrer"` for security.

```tsx
<BdsLink 
  href="https://github.com/XRPLF" 
  variant="external" 
  target="_blank" 
  rel="noopener noreferrer"
>
  GitHub Repository
</BdsLink>
```

### Inline

For links embedded within body text. No icon is displayed, making the link flow naturally within paragraphs.

```tsx
<p>
  The XRP Ledger is a decentralized blockchain. You can{" "}
  <BdsLink href="/docs" variant="inline">read the documentation</BdsLink>{" "}
  to learn more.
</p>
```

---

## Sizes

| Size | Font Size | Line Height | Icon Gap |
|------|-----------|-------------|----------|
| `small` | 14px | 1.5 | 6px |
| `medium` | 16px | 1.5 | 8px |
| `large` | 20px | 1.5 | 10px |

```tsx
<BdsLink href="/docs" size="small">Small Link</BdsLink>
<BdsLink href="/docs" size="medium">Medium Link</BdsLink>
<BdsLink href="/docs" size="large">Large Link</BdsLink>
```

---

## Color States

The Link component automatically handles color states based on the current theme. Colors are applied via CSS and follow the Figma design specifications.

### Light Mode

| State | Color Token | Hex Value | Additional Styles |
|-------|-------------|-----------|-------------------|
| **Enabled** | Green 400 | `#0DAA3E` | No underline |
| **Hover** | Green 500 | `#078139` | Underline, arrow animates |
| **Focus** | Green 500 | `#078139` | Underline, black outline |
| **Active** | Green 400 | `#0DAA3E` | Underline |
| **Visited** | Lilac 400 | `#7649E3` | No underline |
| **Disabled** | Gray 400 | `#A2A2A4` | No underline, no pointer |

### Dark Mode

| State | Color Token | Hex Value | Additional Styles |
|-------|-------------|-----------|-------------------|
| **Enabled** | Green 300 | `#21E46B` | No underline |
| **Hover** | Green 200 | `#70EE97` | Underline, arrow animates |
| **Focus** | Green 200 | `#70EE97` | Underline, white outline |
| **Active** | Green 300 | `#21E46B` | Underline |
| **Visited** | Lilac 300 | `#C0A7FF` | No underline |
| **Disabled** | Gray 500 | `#838386` | No underline, no pointer |

### Focus Outline

- **Light Mode**: 2px solid black (`#000000`)
- **Dark Mode**: 2px solid white (`#FFFFFF`)

---

## Icon Animations

Both internal and external arrow icons feature a smooth animation on hover/focus:

- **Animation Duration**: 150ms
- **Timing Function**: `cubic-bezier(0.98, 0.12, 0.12, 0.98)`

### Internal Arrow Animation

The horizontal line of the arrow (→) shrinks from left to right, revealing a chevron shape (>).

### External Arrow Animation

The diagonal line of the external arrow (↗) scales down toward the top-right corner, leaving just the corner bracket.

### Disabled State

When disabled, the animation is disabled and the icon opacity is reduced to 50%.

---

## Accessibility

The Link component follows accessibility best practices:

### Keyboard Navigation

- Focusable via Tab key
- Activatable via Enter key
- Clear focus indicator with high-contrast outline

### ARIA Attributes

- `aria-disabled="true"` is applied when the link is disabled
- Icons are marked with `aria-hidden="true"` to prevent screen reader announcement

### Best Practices

1. **Use descriptive link text** - Avoid "click here" or "read more"
2. **External links** - Consider adding "(opens in new tab)" for screen readers
3. **Disabled state** - Provide context for why the link is disabled

```tsx
// Good - Descriptive link text
<BdsLink href="/pricing">View pricing plans</BdsLink>

// Bad - Non-descriptive
<BdsLink href="/pricing">Click here</BdsLink>

// External with screen reader context
<BdsLink 
  href="https://example.com" 
  variant="external" 
  target="_blank"
  rel="noopener noreferrer"
  aria-label="GitHub Repository (opens in new tab)"
>
  GitHub Repository
</BdsLink>
```

---

## Best Practices

### Do's

1. **Use appropriate variants**
   ```tsx
   // Internal navigation
   <BdsLink href="/about" variant="internal">About Us</BdsLink>
   
   // External sites
   <BdsLink href="https://github.com" variant="external" target="_blank" rel="noopener noreferrer">
     GitHub
   </BdsLink>
   
   // Within paragraphs
   <p>Learn about <BdsLink href="/xrp" variant="inline">XRP</BdsLink> today.</p>
   ```

2. **Match size to context**
   ```tsx
   // Navigation/CTA - use large
   <BdsLink href="/get-started" size="large">Get Started</BdsLink>
   
   // Body content - use medium
   <BdsLink href="/docs" size="medium">Documentation</BdsLink>
   
   // Footnotes/captions - use small
   <BdsLink href="/terms" size="small">Terms of Service</BdsLink>
   ```

3. **Always use security attributes for external links**
   ```tsx
   <BdsLink 
     href="https://external-site.com" 
     variant="external"
     target="_blank"
     rel="noopener noreferrer"
   >
     External Site
   </BdsLink>
   ```

### Don'ts

1. **Don't use disabled for navigation prevention** - Use proper routing instead
   ```tsx
   // Bad - Using disabled for auth gate
   <BdsLink href="/dashboard" disabled={!isAuthenticated}>Dashboard</BdsLink>
   
   // Good - Handle in onClick or router
   <BdsLink href="/dashboard" onClick={handleAuthCheck}>Dashboard</BdsLink>
   ```

2. **Don't mix variants inappropriately**
   ```tsx
   // Bad - External link with internal variant
   <BdsLink href="https://example.com" variant="internal">External Site</BdsLink>
   
   // Good
   <BdsLink href="https://example.com" variant="external">External Site</BdsLink>
   ```

3. **Don't use inline variant for standalone links**
   ```tsx
   // Bad - Standalone inline link
   <BdsLink href="/docs" variant="inline">Documentation</BdsLink>
   
   // Good - Use internal for standalone
   <BdsLink href="/docs" variant="internal">Documentation</BdsLink>
   ```

---

## Examples

### Navigation Menu

```tsx
<nav className="d-flex flex-column gap-3">
  <BdsLink href="/docs" size="medium">Documentation</BdsLink>
  <BdsLink href="/tutorials" size="medium">Tutorials</BdsLink>
  <BdsLink href="/api" size="medium">API Reference</BdsLink>
  <BdsLink 
    href="https://github.com/XRPLF" 
    variant="external" 
    size="medium"
    target="_blank"
    rel="noopener noreferrer"
  >
    GitHub
  </BdsLink>
</nav>
```

### Call-to-Action Section

```tsx
<div className="d-flex flex-column gap-4">
  <BdsLink href="/get-started" size="large">
    Get Started with XRPL
  </BdsLink>
  <BdsLink href="/use-cases" size="large">
    Explore Use Cases
  </BdsLink>
</div>
```

### Rich Text Content

```tsx
<article>
  <p>
    The XRP Ledger (XRPL) is a decentralized, public blockchain led by a{" "}
    <BdsLink href="/community" variant="inline">global community</BdsLink>{" "}
    of businesses and developers. It supports a wide variety of{" "}
    <BdsLink href="/use-cases" variant="inline">use cases</BdsLink>{" "}
    including payments, tokenization, and DeFi.
  </p>
  
  <p>
    To learn more, check out the{" "}
    <BdsLink href="/docs" variant="inline">official documentation</BdsLink>{" "}
    or visit the{" "}
    <BdsLink 
      href="https://github.com/XRPLF" 
      variant="inline"
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub repository
    </BdsLink>.
  </p>
</article>
```

### Disabled State

```tsx
<div className="d-flex flex-column gap-3">
  <BdsLink href="/premium" size="medium" disabled>
    Premium Features (Coming Soon)
  </BdsLink>
  <span className="text-muted">This feature is not yet available.</span>
</div>
```

---

## Related Components

- **LinkArrow** - The animated arrow icon component used internally by Link
- **Button** - For actions that don't navigate (forms, modals, etc.)

---

## File Structure

```
shared/components/Link/
├── index.ts          # Exports
├── Link.tsx          # Main component
├── Link.md           # This documentation
├── LinkArrow.tsx     # Arrow icon component
├── _link.scss        # Link styles
└── _link-icons.scss  # Arrow icon styles & animations
```

---

## Changelog

### v1.0.0

- Initial release with internal, external, and inline variants
- Three size options (small, medium, large)
- Theme-aware color states (light/dark mode)
- Animated arrow icons
- Full accessibility support
