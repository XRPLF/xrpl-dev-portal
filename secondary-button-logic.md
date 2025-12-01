# Secondary Button Logic

> **Design Source:** [Figma - Button Component](https://www.figma.com/design/MZOPJQOw9oWC6NDxLRH4ws/Button?node-id=5226-8948&m=dev) (Second Column - Secondary)  
> **Target Component:** `shared/components/Button/Button.tsx` & `Button.scss`

---

## Overview

The **Secondary Button** is an outline-style button used for secondary actions. It features a transparent background with a colored stroke/border, providing visual hierarchy below the Primary button while maintaining brand consistency.

**Key Characteristics:**
- Outline/ghost style (transparent background in default states)
- Green stroke/border in enabled state
- Filled background appears on hover/focus states
- **Shares arrow icon & animation with Primary button** (no duplicate code)

---

## Shared Code Architecture

The Secondary button **inherits** all arrow icon logic from the base `.bds-btn` class. This ensures:
- ✅ No duplicate arrow animation code
- ✅ Consistent hover behavior across variants
- ✅ Single source of truth for icon styling

### Already Shared in Base `.bds-btn` Class

```scss
// These styles are already in the base class and apply to ALL variants:

.bds-btn {
  // Icon element (SVG container) - SHARED
  &__icon {
    width: 15px;
    height: 14px;
    flex-shrink: 0;
    transition: opacity $bds-btn-transition-duration $bds-btn-transition-timing;
    color: currentColor;  // Inherits text color from parent
    overflow: visible;
  }

  // Arrow horizontal line - SHARED
  &__icon-line {
    transform-box: fill-box;
    transform-origin: right center;
    transform: scaleX(1);
    transition: transform $bds-btn-transition-duration $bds-btn-transition-timing;
  }

  // Arrow chevron - SHARED
  &__icon-chevron {
    transition: transform $bds-btn-transition-duration $bds-btn-transition-timing;
  }

  // Hover/Focus animation - SHARED (applies to ALL variants)
  &:hover:not(:disabled):not(.bds-btn--disabled),
  &:focus-visible:not(:disabled):not(.bds-btn--disabled) {
    .bds-btn__icon-line {
      transform: scaleX(0);  // Line shrinks from left-to-right
    }
  }
}
```

### What Secondary Button Needs to Define

The `.bds-btn--secondary` class only needs to define:
1. **Colors** (text, background, border) - different from Primary
2. **Padding & Gap** values per state - adjusted for border width
3. **Border** styling (Primary has no border, Secondary has 2px border)

The icon color automatically updates via `currentColor` inheritance from the text color

---

## Visual Specifications

### Button Structure

```
┌─────────────────────────────────────────────┐
│  [Label Text]         [gap]         [Icon]  │
└─────────────────────────────────────────────┘
        ↑                               ↑
   .bds-btn__label               .bds-btn__icon
```

- **Border Radius:** `100px` (pill shape)
- **Border Width:** `2px` solid
- **Max Height:** `40px`
- **Typography:** Label R token (Booton, 16px, 400 weight, 23.2px line-height)

---

## State Specifications

### 1. Enabled State (Default)

| Property | Value | SCSS Variable |
|----------|-------|---------------|
| **Text Color** | Green 400 `#0DAA3E` | `$green-400` |
| **Background** | Transparent | `transparent` |
| **Border Color** | Green 400 `#0DAA3E` | `$green-400` |
| **Border Width** | `2px` | - |

> **Icon Color:** Inherits text color via `currentColor` (no separate definition needed)

**Desktop Padding & Gap:**
| Property | With Icon | Without Icon |
|----------|-----------|--------------|
| Padding | `8px 19px 8px 20px` | `8px 20px` |
| Gap | `16px` | N/A |

**Tablet/Mobile Padding & Gap (≤1023px):**
| Property | With Icon | Without Icon |
|----------|-----------|--------------|
| Padding | `8px 15px 8px 16px` | `8px 16px` |
| Gap | `16px` | N/A |

---

### 2. Hover State

| Property | Value | SCSS Variable |
|----------|-------|---------------|
| **Text Color** | Green 500 `#078139` | `$green-500` |
| **Background** | Green 100 `#EAFCF1` | `$green-100` |
| **Border Color** | Green 500 `#078139` | `$green-500` |
| **Border Width** | `2px` | - |

> **Icon Color:** Inherits text color via `currentColor` (automatically becomes Green 500)

**Desktop Padding & Gap:**
| Property | With Icon | Without Icon |
|----------|-----------|--------------|
| Padding | `8px 13px 8px 20px` | `8px 20px` |
| Gap | `22px` | N/A |

**Tablet/Mobile Padding & Gap (≤1023px):**
| Property | With Icon | Without Icon |
|----------|-----------|--------------|
| Padding | `8px 10px 8px 16px` | `8px 16px` |
| Gap | `21px` | N/A |

> **Arrow Animation:** Handled by base `.bds-btn` class - line shrinks from left-to-right (shared behavior)

---

### 3. Focus State (Keyboard Navigation)

| Property | Value | SCSS Variable |
|----------|-------|---------------|
| **Text Color** | Green 500 `#078139` | `$green-500` |
| **Background** | Green 100 `#EAFCF1` | `$green-100` |
| **Border Color** | Green 500 `#078139` | `$green-500` |
| **Border Width** | `2px` | - |
| **Focus Ring** | Black `#141414`, 2px | `$bds-btn-primary-focus-border` |

> **Icon Color:** Inherits text color via `currentColor` (automatically becomes Green 500)

The focus state shows a **double border** effect:
1. Inner border: Green 500 (the button's stroke)
2. Outer border: Black (focus indicator ring)

**Desktop Padding & Gap:**
| Property | With Icon | Without Icon |
|----------|-----------|--------------|
| Padding | `6px 11px 6px 18px` | `6px 17px 6px 18px` |
| Gap | `22px` | N/A |

> **Note:** Padding is reduced by 2px on all sides to compensate for the additional focus ring border.

**Tablet/Mobile Padding & Gap (≤1023px):**
| Property | With Icon | Without Icon |
|----------|-----------|--------------|
| Padding | `6px 8px 6px 14px` | `6px 13px 6px 14px` |
| Gap | `21px` | N/A |

---

### 4. Active State (Being Pressed)

| Property | Value | SCSS Variable |
|----------|-------|---------------|
| **Text Color** | Green 400 `#0DAA3E` | `$green-400` |
| **Background** | Transparent | `transparent` |
| **Border Color** | Green 400 `#0DAA3E` | `$green-400` |
| **Border Width** | `2px` | - |
| **Transform** | `scale(0.98)` | - |

> **Icon Color:** Inherits text color via `currentColor` (returns to Green 400)

**Padding & Gap:** Returns to enabled state values
- Desktop: `8px 19px 8px 20px`, gap `16px`
- Tablet/Mobile: `8px 15px 8px 16px`, gap `16px`

---

### 5. Disabled State

| Property | Value | SCSS Variable |
|----------|-------|---------------|
| **Text Color** | Neutral 400 `#8A919A` | `$gray-400` ¹ |
| **Background** | Transparent | `transparent` |
| **Border Color** | Neutral 400 `#8A919A` | `$gray-400` ¹ |
| **Border Width** | `2px` | - |
| **Cursor** | `not-allowed` | - |
| **Pointer Events** | `none` | - |
| **Icon** | Hidden (removed) | - |

> ¹ **Note:** The Figma design uses `#8A919A` for Neutral 400. The existing `_colors.scss` has `$gray-400: #A2A2A4`. Either use the existing variable for consistency or add a new token. Recommend using existing `$gray-400` for codebase consistency.

**Padding & Gap:** Same as enabled state
- Desktop: `8px 19px 8px 20px`, gap `16px`
- Tablet/Mobile: `8px 15px 8px 16px`, gap `16px`

---

## Color Token Mapping

### Required Colors from `_colors.scss`

```scss
// Already available in styles/_colors.scss
$green-100: #EAFCF1;  // Hover/Focus background
$green-400: #0DAA3E;  // Enabled state (text, border, icon)
$green-500: #078139;  // Hover/Focus state (text, border, icon)
$gray-400: #A2A2A4;   // Disabled state (text, border) - closest match
```

### Recommended SCSS Variables for Secondary Button

```scss
// Colors - Secondary Button
$bds-btn-secondary-text: $green-400;              // #0DAA3E - Enabled
$bds-btn-secondary-text-hover: $green-500;        // #078139 - Hover/Focus
$bds-btn-secondary-border: $green-400;            // #0DAA3E - Enabled
$bds-btn-secondary-border-hover: $green-500;      // #078139 - Hover/Focus
$bds-btn-secondary-bg-hover: $green-100;          // #EAFCF1 - Hover/Focus fill
$bds-btn-secondary-disabled-text: $gray-400;      // Disabled text & border
$bds-btn-secondary-disabled-border: $gray-400;    // Disabled border
```

---

## Implementation Structure

### CSS Class Names (BEM)

```
// SHARED (already exist in base .bds-btn - DO NOT DUPLICATE)
.bds-btn                    // Base button layout, typography, transitions
.bds-btn__label             // Label element
.bds-btn__icon              // Icon container (uses currentColor)
.bds-btn__icon-line         // Arrow line + hover animation
.bds-btn__icon-chevron      // Arrow chevron
.bds-btn--disabled          // Disabled state modifier
.bds-btn--no-icon           // No icon modifier

// VARIANT-SPECIFIC (add for secondary)
.bds-btn--secondary         // Colors, borders, padding/gap values only
```

### Component Props

The existing `ButtonProps` interface supports the secondary variant:

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';  // Add 'secondary' to union type
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  showIcon?: boolean;
}
```

---

## SCSS Implementation Guide

> ⚠️ **Important:** Do NOT add any icon/arrow styles to `.bds-btn--secondary`. The icon inherits its color via `currentColor` and the hover animation is already handled in the base `.bds-btn` class.

### Design Tokens to Add

```scss
// =============================================================================
// Design Tokens - Secondary Button
// =============================================================================

// Colors - Secondary Button
$bds-btn-secondary-text: $green-400;              // #0DAA3E
$bds-btn-secondary-text-hover: $green-500;        // #078139
$bds-btn-secondary-bg: transparent;
$bds-btn-secondary-bg-hover: $green-100;          // #EAFCF1
$bds-btn-secondary-border: $green-400;            // #0DAA3E
$bds-btn-secondary-border-hover: $green-500;      // #078139
$bds-btn-secondary-disabled-text: $gray-400;      // Disabled state
$bds-btn-secondary-disabled-border: $gray-400;    // Disabled border
```

### State Styles Structure

```scss
// =============================================================================
// Secondary Variant
// =============================================================================
// NOTE: Arrow icon animation is inherited from base .bds-btn class.
// The icon color automatically follows text color via currentColor.
// Only define: colors, backgrounds, borders, padding, and gap.

.bds-btn--secondary {
  // Default/Enabled state
  color: $bds-btn-secondary-text;
  background-color: $bds-btn-secondary-bg;
  border: 2px solid $bds-btn-secondary-border;

  // Desktop padding and gap (≥1024px)
  padding: 6px 17px 6px 18px;  // Compensate for 2px border
  gap: 16px;

  // No icon - symmetric padding
  &.bds-btn--no-icon {
    padding: 6px 18px;
  }

  // ---------------------------------------------------------------------------
  // Hover State
  // ---------------------------------------------------------------------------
  &:hover:not(:disabled):not(.bds-btn--disabled):not(.bds-btn--no-icon) {
    color: $bds-btn-secondary-text-hover;
    background-color: $bds-btn-secondary-bg-hover;
    border-color: $bds-btn-secondary-border-hover;
    padding: 6px 11px 6px 18px;
    gap: 22px;
  }

  &:hover:not(:disabled):not(.bds-btn--disabled).bds-btn--no-icon {
    color: $bds-btn-secondary-text-hover;
    background-color: $bds-btn-secondary-bg-hover;
    border-color: $bds-btn-secondary-border-hover;
  }

  // ---------------------------------------------------------------------------
  // Focus State (keyboard navigation)
  // ---------------------------------------------------------------------------
  &:focus-visible:not(:disabled):not(.bds-btn--disabled):not(.bds-btn--no-icon) {
    color: $bds-btn-secondary-text-hover;
    background-color: $bds-btn-secondary-bg-hover;
    border-color: $bds-btn-secondary-border-hover;
    outline: $bds-btn-focus-border-width solid $bds-btn-primary-focus-border;
    outline-offset: 0;
    padding: 6px 11px 6px 18px;
    gap: 22px;
  }

  &:focus-visible:not(:disabled):not(.bds-btn--disabled).bds-btn--no-icon {
    color: $bds-btn-secondary-text-hover;
    background-color: $bds-btn-secondary-bg-hover;
    border-color: $bds-btn-secondary-border-hover;
    outline: $bds-btn-focus-border-width solid $bds-btn-primary-focus-border;
    outline-offset: 0;
    padding: 6px 17px 6px 18px;
  }

  // ---------------------------------------------------------------------------
  // Active State (being pressed)
  // ---------------------------------------------------------------------------
  &:active:not(:disabled):not(.bds-btn--disabled) {
    color: $bds-btn-secondary-text;
    background-color: $bds-btn-secondary-bg;
    border-color: $bds-btn-secondary-border;
    transform: scale(0.98);
    padding: 6px 17px 6px 18px;
    gap: 16px;
  }

  // ---------------------------------------------------------------------------
  // Disabled State
  // Note: Icon is hidden via component logic when disabled
  // ---------------------------------------------------------------------------
  &:disabled,
  &.bds-btn--disabled {
    color: $bds-btn-secondary-disabled-text;
    background-color: transparent;
    border-color: $bds-btn-secondary-disabled-border;
    cursor: not-allowed;
    pointer-events: none;
  }

  // ---------------------------------------------------------------------------
  // Tablet & Mobile Responsive Styles (≤1023px)
  // ---------------------------------------------------------------------------
  @media (max-width: 1023px) {
    padding: 6px 13px 6px 14px;
    gap: 16px;

    &.bds-btn--no-icon {
      padding: 6px 14px;
    }

    &:hover:not(:disabled):not(.bds-btn--disabled):not(.bds-btn--no-icon) {
      padding: 6px 8px 6px 14px;
      gap: 21px;
    }

    &:hover:not(:disabled):not(.bds-btn--disabled).bds-btn--no-icon {
      // Background and border color changes applied, padding stable
    }

    &:focus-visible:not(:disabled):not(.bds-btn--disabled):not(.bds-btn--no-icon) {
      padding: 6px 8px 6px 14px;
      gap: 21px;
    }

    &:focus-visible:not(:disabled):not(.bds-btn--disabled).bds-btn--no-icon {
      padding: 6px 13px 6px 14px;
    }

    &:active:not(:disabled):not(.bds-btn--disabled) {
      padding: 6px 13px 6px 14px;
      gap: 16px;
    }
  }
}
```

---

## Key Differences from Primary Button

| Aspect | Primary | Secondary |
|--------|---------|-----------|
| **Background (Enabled)** | Green 300 `#21E46B` | Transparent |
| **Background (Hover/Focus)** | Green 200 `#70EE97` | Green 100 `#EAFCF1` |
| **Border (Enabled)** | None | 2px Green 400 `#0DAA3E` |
| **Border (Hover/Focus)** | None (only focus ring) | 2px Green 500 `#078139` |
| **Text Color (Enabled)** | Neutral Black `#141414` | Green 400 `#0DAA3E` |
| **Text Color (Hover/Focus)** | Neutral Black `#141414` | Green 500 `#078139` |
| **Disabled Background** | Gray 200 `#E0E0E1` | Transparent |
| **Disabled Border** | None | 2px Gray 400 |
| **Focus Ring** | 2px Black border | 2px Black outline (additional) |
| **Arrow Icon** | ✅ Shared (base class) | ✅ Shared (base class) |
| **Arrow Animation** | ✅ Shared (base class) | ✅ Shared (base class) |

---

## Accessibility Notes

1. **Color Contrast:** Green 400/500 on white background meets WCAG AA requirements
2. **Focus Indicator:** Black outline provides clear keyboard navigation visibility
3. **Disabled State:** Reduced opacity icon + muted colors clearly indicate non-interactive state
4. **Icon:** `aria-hidden="true"` on arrow icon (decorative)
5. **Button:** `aria-disabled` attribute mirrors disabled prop

---

## Usage Example

```tsx
// Secondary button with icon (default)
<Button variant="secondary" onClick={handleClick}>
  Learn More
</Button>

// Secondary button without icon
<Button variant="secondary" showIcon={false} onClick={handleClick}>
  Cancel
</Button>

// Disabled secondary button
<Button variant="secondary" disabled>
  Unavailable
</Button>
```

---

## Checklist for Implementation

- [ ] Add `'secondary'` to variant union type in `ButtonProps`
- [ ] Add Secondary button SCSS variables to design tokens section
- [ ] Implement `.bds-btn--secondary` styles (colors, borders, padding/gap only)
- [ ] Add responsive styles for tablet/mobile breakpoint
- [ ] **DO NOT duplicate arrow icon or animation styles** (inherited from base)
- [ ] Verify arrow icon color changes automatically via `currentColor`
- [ ] Test hover, focus, active, disabled states
- [ ] Verify arrow icon animation works correctly (inherited behavior)
- [ ] Test with and without icon (`showIcon` prop)
- [ ] Verify color contrast meets WCAG requirements
- [ ] Test keyboard navigation (Tab + Enter/Space)
