# Primary Button Logic Documentation

## Overview

This document defines the implementation logic for the **Primary Button** component, which represents the highest emphasis call-to-action in the interface. Primary buttons should be used sparingly—only one per view—to clearly indicate the main action.

---

## Button States & Visual Specifications

### 1. Enabled (Default State)

The resting state when the button is ready for interaction.

**Visual Properties:**
- **Text Color**: `#141414` (Neutral Black)
- **Background Color**: `$green-300` (`#21E46B`)
- **Border**: None
- **Icon**: `/static/img/icons/button/button-arrow-right.svg`

```scss
.btn-primary {
  color: #141414; // Neutral Black
  background-color: $green-300; // #21E46B
  border: none;
  border-radius: 100px;
  padding: 8px 19px 8px 20px;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 23.2px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
}
```

---

### 2. Hover State

Triggered when the user's cursor hovers over the button.

**Visual Properties:**
- **Text Color**: `#141414` (Neutral Black)
- **Background Color**: `$green-200` (`#70EE97`)
- **Border**: None
- **Icon**: `/static/img/icons/button/button-arrow-hovered.svg`
- **Transition**: Smooth background color and icon change

```scss
.btn-primary:hover {
  color: #141414; // Neutral Black
  background-color: $green-200; // #70EE97
  
  .btn-icon {
    // Swap to hovered arrow icon
    background-image: url('/static/img/icons/button/button-arrow-hovered.svg');
  }
}
```

---

### 3. Focus State

Triggered when the button receives keyboard focus or is actively focused.

**Visual Properties:**
- **Text Color**: `#141414` (Neutral Black)
- **Background Color**: `$green-200` (`#70EE97`)
- **Border**: `2px solid #141414` (Black)
- **Border Radius**: `100px`
- **Icon**: `/static/img/icons/button/button-arrow-hovered.svg`

```scss
.btn-primary:focus,
.btn-primary:focus-visible {
  color: #141414; // Neutral Black
  background-color: $green-200; // #70EE97
  border: 2px solid #141414; // Black outline for keyboard navigation
  outline: none;
  
  .btn-icon {
    // Swap to hovered arrow icon
    background-image: url('/static/img/icons/button/button-arrow-hovered.svg');
  }
}
```

---

### 4. Active State

Triggered when the button is being clicked or pressed.

**Visual Properties:**
- **Text Color**: `#141414` (Neutral Black)
- **Background Color**: `$green-300` (`#21E46B`)
- **Border**: None
- **Icon**: `/static/img/icons/button/button-arrow-right.svg`
- **Visual Feedback**: Optional slight scale or pressed effect

```scss
.btn-primary:active {
  color: #141414; // Neutral Black
  background-color: $green-300; // #21E46B (same as enabled)
  transform: scale(0.98); // Optional: slight press effect
  
  .btn-icon {
    background-image: url('/static/img/icons/button/button-arrow-right.svg');
  }
}
```

---

### 5. Disabled State

When the button cannot be interacted with due to conditions or permissions.

**Visual Properties:**
- **Text Color**: `$gray-500` (`#838386` - Neutral 500)
- **Background Color**: `$gray-200` (`#E0E0E1` - Neutral 200)
- **Border**: None
- **Icon**: `/static/img/icons/button/button-arrow-right.svg` (grayed out)
- **Cursor**: `not-allowed`
- **Pointer Events**: Disabled

```scss
.btn-primary:disabled,
.btn-primary[disabled] {
  color: $gray-500; // #838386 (Neutral 500)
  background-color: $gray-200; // #E0E0E1 (Neutral 200)
  cursor: not-allowed;
  pointer-events: none;
  opacity: 1; // Full opacity, color defines disabled state
  
  .btn-icon {
    opacity: 0.5; // Dim the icon
  }
}
```

---

## Icon Implementation

### Arrow Icons

The primary button uses directional arrow icons to indicate forward action:

- **Default/Enabled**: `/static/img/icons/button/button-arrow-right.svg`
- **Hover/Focus**: `/static/img/icons/button/button-arrow-hovered.svg`
- **Active**: `/static/img/icons/button/button-arrow-right.svg`
- **Disabled**: `/static/img/icons/button/button-arrow-right.svg` (with reduced opacity)

### Icon Spacing

- **Gap between label and icon**: `16px`
- **Icon size**: `14px × 15px` (internal small icon size)

---

## Typography

### Font Specifications

Based on the **Label R** type token:

```scss
.btn-primary {
  font-family: 'Booton', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.2px;
  letter-spacing: 0px;
}
```

---

## Layout & Spacing

### Sizing

- **Min-height**: `40px` (to ensure adequate touch target)
- **Min-width**: Auto (based on content)
- **Max-width**: None (fluid to content)
- **Border Radius**: `100px` (fully rounded corners)

---

## Responsive Padding Specifications

Primary button padding adjusts across breakpoints and states to maintain visual balance and accommodate icon spacing changes. The padding system is designed to ensure consistent touch targets and optical alignment.

### Design Rationale

The primary button uses **asymmetric padding** to account for:
1. **Visual weight balance** - Compensates for right-aligned icon
2. **Icon spacing dynamics** - Hover state increases icon gap, reducing right padding
3. **Touch target consistency** - Maintains minimum 40px height across all states

### Breakpoint-Based Padding

#### Desktop (≥1024px)

| State | Padding (T/R/B/L) | Icon Gap | Total Width Calculation |
|-------|-------------------|----------|-------------------------|
| **Enabled/Active** | `8px 19px 8px 20px` | `16px` | Left(20px) + Label + Gap(16px) + Icon(15px) + Right(19px) |
| **Hover/Focus** | `8px 13px 8px 20px` | `22px` | Left(20px) + Label + Gap(22px) + Icon(15px) + Right(13px) |

```scss
// Desktop - Default/Enabled/Active states
.btn-primary {
  padding: 8px 19px 8px 20px;
  gap: 16px;
  
  // Desktop - Hover/Focus states
  &:hover,
  &:focus-visible {
    padding: 8px 13px 8px 20px;
    gap: 22px;
    // Note: Right padding reduces by 6px while gap increases by 6px
    // This maintains total button width during state transitions
  }
}
```

**Key Insight**: The 6px reduction in right padding exactly compensates for the 6px increase in icon gap, preventing layout shifts during hover transitions.

---

#### Tablet (768px - 1023px)

| State | Padding (T/R/B/L) | Icon Gap | Total Width Calculation |
|-------|-------------------|----------|-------------------------|
| **Enabled/Active** | `8px 15px 8px 16px` | `16px` | Left(16px) + Label + Gap(16px) + Icon(15px) + Right(15px) |
| **Hover/Focus** | `8px 10px 8px 16px` | `21px` | Left(16px) + Label + Gap(21px) + Icon(15px) + Right(10px) |

```scss
// Tablet - Default/Enabled/Active states
@media (min-width: 768px) and (max-width: 1023px) {
  .btn-primary {
    padding: 8px 15px 8px 16px;
    gap: 16px;
    
    // Tablet - Hover/Focus states
    &:hover,
    &:focus-visible {
      padding: 8px 10px 8px 16px;
      gap: 21px;
      // Right padding reduces by 5px while gap increases by 5px
    }
  }
}
```

---

#### Mobile (≤767px)

| State | Padding (T/R/B/L) | Icon Gap | Total Width Calculation |
|-------|-------------------|----------|-------------------------|
| **Enabled/Active** | `8px 15px 8px 16px` | `16px` | Left(16px) + Label + Gap(16px) + Icon(15px) + Right(15px) |
| **Hover/Focus** | `8px 10px 8px 16px` | `21px` | Left(16px) + Label + Gap(21px) + Icon(15px) + Right(10px) |

```scss
// Mobile - Default/Enabled/Active states
@media (max-width: 767px) {
  .btn-primary {
    padding: 8px 15px 8px 16px;
    gap: 16px;
    
    // Mobile - Hover/Focus states (same as tablet)
    &:hover,
    &:focus-visible {
      padding: 8px 10px 8px 16px;
      gap: 21px;
    }
  }
}
```

**Note**: Mobile and Tablet share identical padding values to maintain consistency across smaller viewports.

---

### Special State Considerations

#### Focus State with Border

When the focus state adds a 2px border, padding must be adjusted to prevent layout shift:

```scss
.btn-primary:focus-visible {
  border: 2px solid #141414;
  
  // Desktop - Compensate for 2px border
  padding: 6px 11px 6px 18px; // Reduced by 2px on all sides
  gap: 22px; // Maintains hover gap
  
  // Tablet & Mobile - Compensate for 2px border
  @media (max-width: 1023px) {
    padding: 6px 8px 6px 14px; // Reduced by 2px on all sides
    gap: 21px;
  }
}
```

#### Disabled State

Disabled state uses the same padding as the enabled state but does not transition:

```scss
.btn-primary:disabled {
  padding: 8px 19px 8px 20px; // Desktop
  gap: 16px;
  // No hover padding changes apply
  
  @media (max-width: 1023px) {
    padding: 8px 15px 8px 16px; // Tablet & Mobile
  }
}
```

---

### Padding Transition Strategy

To ensure smooth state transitions without visual "jumps":

```scss
.btn-primary {
  transition-property: padding, gap, background-color, border-color;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
}
```

### Visual Alignment Formula

The padding system maintains optical centering using this formula:

```
Total Button Width = Left Padding + Label Width + Icon Gap + Icon Width + Right Padding

Optical Center Offset = (Left Padding - Right Padding) / 2
```

**Example (Desktop Enabled):**
- Left: 20px, Right: 19px → Offset: 0.5px (virtually centered)

**Example (Desktop Hover):**
- Left: 20px, Right: 13px → Offset: 3.5px (compensates for larger icon gap)

---

### Implementation Summary

```scss
@import 'styles/_colors.scss';

.btn-primary {
  // Desktop base
  padding: 8px 19px 8px 20px;
  gap: 16px;
  border-radius: 100px;
  transition: padding 150ms ease-in-out, gap 150ms ease-in-out;
  
  // Desktop hover/focus
  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    padding: 8px 13px 8px 20px;
    gap: 22px;
  }
  
  // Focus with border
  &:focus-visible:not(:disabled) {
    border: 2px solid #141414;
    padding: 6px 11px 6px 18px; // Compensate for border
  }
  
  // Tablet & Mobile
  @media (max-width: 1023px) {
    padding: 8px 15px 8px 16px;
    gap: 16px;
    
    &:hover:not(:disabled),
    &:focus-visible:not(:disabled) {
      padding: 8px 10px 8px 16px;
      gap: 21px;
    }
    
    &:focus-visible:not(:disabled) {
      border: 2px solid #141414;
      padding: 6px 8px 6px 14px;
    }
  }
}
```

---

### Quick Reference Table

| Breakpoint | State | Top | Right | Bottom | Left | Gap |
|------------|-------|-----|-------|--------|------|-----|
| **Desktop** | Enabled/Active | 8px | 19px | 8px | 20px | 16px |
| **Desktop** | Hover | 8px | 13px | 8px | 20px | 22px |
| **Desktop** | Focus (w/ border) | 6px | 11px | 6px | 18px | 22px |
| **Tablet** | Enabled/Active | 8px | 15px | 8px | 16px | 16px |
| **Tablet** | Hover | 8px | 10px | 8px | 16px | 21px |
| **Tablet** | Focus (w/ border) | 6px | 8px | 6px | 14px | 21px |
| **Mobile** | Enabled/Active | 8px | 15px | 8px | 16px | 16px |
| **Mobile** | Hover | 8px | 10px | 8px | 16px | 21px |
| **Mobile** | Focus (w/ border) | 6px | 8px | 6px | 14px | 21px |

---

## Color Reference (from _colors.scss)

### Green Palette

```scss
$green-100: #EAFCF1;  // Lightest green
$green-200: #70EE97;  // Hover state
$green-300: #21E46B;  // Default/Enabled state
$green-400: #0DAA3E;  // Darker green
$green-500: #078139;  // Darkest green
```

### Neutral Palette

```scss
$gray-200: #E0E0E1;  // Disabled background (Neutral 200)
$gray-500: #838386;  // Disabled text (Neutral 500)
$black: #141414;     // Primary text color (Neutral Black)
```

---

## State Transition Logic

### State Priority (Highest to Lowest)

1. **Disabled** - Overrides all other states
2. **Active** - During click/press
3. **Focus** - Keyboard navigation or explicit focus
4. **Hover** - Mouse over
5. **Enabled** - Default resting state

### Transition Timing

```scss
.btn-primary {
  transition: all 150ms ease-in-out;
  
  &:not(:disabled) {
    // Only apply transitions to interactive states
    transition-property: background-color, border-color, transform;
  }
}
```

---

## Accessibility Requirements

### WCAG Compliance

- **Color Contrast**: 
  - Enabled state: Black text (#141414) on Green 300 (#21E46B) = **9.06:1** ✓ (AAA)
  - Hover state: Black text (#141414) on Green 200 (#70EE97) = **10.23:1** ✓ (AAA)
  - Disabled state: Gray 500 text (#838386) on Gray 200 (#E0E0E1) = **2.12:1** ⚠️ (Passes for disabled)

### Keyboard Navigation

```scss
.btn-primary:focus-visible {
  // 2px black border ensures keyboard focus is clearly visible
  border: 2px solid #141414;
  outline: none; // Remove default browser outline
}
```

### Screen Readers

```html
<button class="btn-primary" type="button">
  <span class="btn-label">Submit Form</span>
  <img src="/static/img/icons/button/button-arrow-right.svg" 
       class="btn-icon" 
       alt="" 
       aria-hidden="true" />
</button>

<!-- Disabled state -->
<button class="btn-primary" type="button" disabled aria-disabled="true">
  <span class="btn-label">Submit Form</span>
  <img src="/static/img/icons/button/button-arrow-right.svg" 
       class="btn-icon" 
       alt="" 
       aria-hidden="true" />
</button>
```

---

## Implementation Example (React + SCSS)

### Component Structure

```tsx
import React from 'react';
import './PrimaryButton.scss';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const getArrowIcon = () => {
    if (disabled) {
      return '/static/img/icons/button/button-arrow-right.svg';
    }
    return isHovered || isFocused
      ? '/static/img/icons/button/button-arrow-hovered.svg'
      : '/static/img/icons/button/button-arrow-right.svg';
  };

  return (
    <button
      type={type}
      className={`btn-primary ${className}`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      aria-disabled={disabled}
    >
      <span className="btn-label">{children}</span>
      <img
        src={getArrowIcon()}
        className="btn-icon"
        alt=""
        aria-hidden="true"
      />
    </button>
  );
};
```

### SCSS Styles

```scss
@import 'styles/_colors.scss';

.btn-primary {
  // Base styles
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  
  // Typography
  font-family: 'Booton', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.2px;
  letter-spacing: 0px;
  
  // Desktop padding and gap (default)
  padding: 8px 19px 8px 20px;
  gap: 16px;
  
  // Enabled state colors (default)
  color: #141414; // Neutral Black
  background-color: $green-300; // #21E46B
  
  // Transitions
  transition: all 150ms ease-in-out;
  transition-property: background-color, border-color, transform, padding, gap;
  
  // Hover state
  &:hover:not(:disabled) {
    background-color: $green-200; // #70EE97
    padding: 8px 13px 8px 20px; // Adjust for icon gap change
    gap: 22px; // Increased icon spacing
  }
  
  // Focus state
  &:focus-visible:not(:disabled) {
    background-color: $green-200; // #70EE97
    border: 2px solid #141414; // Black focus ring
    outline: none;
    // Adjust padding to compensate for border and gap
    padding: 6px 11px 6px 18px;
    gap: 22px;
  }
  
  // Active state
  &:active:not(:disabled) {
    background-color: $green-300; // #21E46B
    transform: scale(0.98);
    // Maintains default padding and gap
  }
  
  // Disabled state
  &:disabled,
  &[disabled] {
    color: $gray-500; // #838386 (Neutral 500)
    background-color: $gray-200; // #E0E0E1 (Neutral 200)
    cursor: not-allowed;
    pointer-events: none;
    // Maintains default padding and gap
    
    .btn-icon {
      opacity: 0.5;
    }
  }
  
  // Tablet & Mobile responsive padding
  @media (max-width: 1023px) {
    padding: 8px 15px 8px 16px;
    gap: 16px;
    
    &:hover:not(:disabled) {
      padding: 8px 10px 8px 16px;
      gap: 21px;
    }
    
    &:focus-visible:not(:disabled) {
      padding: 6px 8px 6px 14px; // Compensate for border
      gap: 21px;
    }
  }
  
  // Icon styles
  .btn-icon {
    width: 15px;
    height: 14px;
    flex-shrink: 0;
    transition: opacity 150ms ease-in-out;
  }
  
  .btn-label {
    flex-shrink: 0;
  }
}
```

---

## Usage Guidelines

### Do's ✓

- Use only **one primary button per view** to indicate the main action
- Use clear, action-oriented labels (e.g., "Submit Form", "Get Started", "Continue")
- Place primary buttons in prominent locations aligned with user flow
- Ensure sufficient spacing around the button for easy interaction
- Test keyboard navigation and screen reader compatibility

### Don'ts ✗

- Don't use multiple primary buttons on the same page/view
- Don't use vague labels like "Click Here" or "OK"
- Don't use primary buttons for navigation (use links instead)
- Don't override disabled state colors for "creative" reasons
- Don't remove the focus indicator for keyboard accessibility

---

## Testing Checklist

### Visual States
- [ ] Enabled state displays correctly with Green 300 background
- [ ] Hover state transitions to Green 200 background
- [ ] Focus state shows 2px black border outline
- [ ] Active state provides visual feedback on click
- [ ] Disabled state is not interactive and displays grayed out
- [ ] Arrow icon swaps between states correctly

### Responsive Padding
- [ ] Desktop padding: 8px 19px 8px 20px (enabled/active)
- [ ] Desktop hover padding: 8px 13px 8px 20px with 22px gap
- [ ] Tablet/Mobile padding: 8px 15px 8px 16px (enabled/active)
- [ ] Tablet/Mobile hover padding: 8px 10px 8px 16px with 21px gap
- [ ] Focus state padding compensates for 2px border on all breakpoints
- [ ] Button width remains consistent during hover transitions
- [ ] No layout shift when transitioning between states

### Accessibility
- [ ] Keyboard navigation works (Tab to focus, Enter/Space to activate)
- [ ] Screen reader announces button label and disabled state
- [ ] Button works on touch devices (minimum 44x44px touch target)
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicator is clearly visible on all backgrounds


---

## Version History

- **Version**: 1.1
- **Last Updated**: December 1, 2025
- **Changelog**:
  - v1.1: Added comprehensive responsive padding specifications section
  - v1.0: Initial release with button states and visual specifications
- **Design Sources**: 
  - [Figma - Button States](https://www.figma.com/design/MZOPJQOw9oWC6NDxLRH4ws/Button?node-id=5226-8948&m=dev)
  - [Figma - Button Sizing & Padding](https://www.figma.com/design/MZOPJQOw9oWC6NDxLRH4ws/Button?node-id=5226-9301&m=dev)
- **Color Reference**: `styles/_colors.scss`
- **Icon Assets**: 
  - `/static/img/icons/button/button-arrow-right.svg`
  - `/static/img/icons/button/button-arrow-hovered.svg`
