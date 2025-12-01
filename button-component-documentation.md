# Button Component Documentation

## Overview

Buttons are clickable elements used to trigger actions or guide users toward key interactions. They serve as clear calls to action within the interface, allowing users to engage with a page in various ways. Button labels should clearly describe the action that will occur when the button is clicked.

---

## When to Use

Use buttons to represent actions that users can take on a page or within a component. Buttons communicate intent and encourage interaction. Each view should include only one primary button to clearly indicate the main action. Any secondary or supporting actions should be represented using lower-emphasis button styles such as secondary or tertiary.

---

## When Not to Use

Avoid using buttons for navigation. If the action takes the user to a new page or external destination, use a link instead. Buttons should initiate actions, not navigation, to maintain consistency and clarity in user expectations.

---

## Variants

Each button variant has a particular function, and its design visually communicates that function to the user. It is important that these variants are implemented consistently across XRPL.org to maintain clarity and hierarchy in user actions.

| Variant | Emphasis Level | Style | Purpose / Use Case |
|---------|----------------|-------|-------------------|
| **Primary** | High | Filled green on light backgrounds, Filled black on color backgrounds | The main call to action on a page. Used for primary tasks such as "Get Started" or "Submit." Only one primary button should appear per view. |
| **Secondary** | Medium | Outline (green stroke, transparent fill) | A supporting action that appears alongside a primary button, such as "Learn More" or "Back." Provides a secondary path without competing visually with the primary action. |
| **Tertiary** | Low | Text-only (green text, no border or fill) | A low-emphasis or contextual action, often used inline or in less prominent areas such as "View Details" or "Cancel." |

---

## Anatomy

Buttons consist of the following elements:

1. **Label** - Clear, descriptive text indicating the action
2. **Container** - Background fill or stroke defining the button boundary
3. **Icon** (optional) - Visual indicator supporting the label
4. **Padding** - Internal spacing maintaining touch targets and visual proportion

---

## Sizing

Buttons follow consistent sizing rules across breakpoints, defined by internal padding, spacing, and typography. Primary and Secondary buttons share the same type token, while Tertiary buttons use a lighter text style appropriate for text-only interactions.

Padding adjusts per breakpoint to maintain appropriate touch targets and visual proportion.

### Sizing Specifications

| Breakpoint | Horizontal Padding Left | Horizontal Padding Right | Vertical Padding | Label - Icon Spacing | Type Token (Primary + Secondary) | Type Token (Tertiary) |
|------------|-------------------------|--------------------------|------------------|----------------------|----------------------------------|----------------------|
| **Desktop** | 20px | 19px | 8px | 16px | Label R | Body R |
| **Tablet** | 16px | 15px | 8px | 16px | Label R | Body R |
| **Mobile** | 16px | 15px | 8px | 16px | Label R | Body R |

---

## Color

Buttons use two primary color themes to maintain contrast and clarity across different backgrounds. Green is the default theme across the system, with black used only when the button sits on a green background. Dark Mode uses reversed green values for accessibility and consistency, Black theme also turns to dark green set.

### Theme Guidelines

| Theme | When to Use | Purpose |
|-------|-------------|---------|
| **Green Theme (Default)** | Used on all backgrounds except Green | Primary branded appearance for the Overflow Menu UI |
| **Black Theme** | Used only when the background is Green | Prevents green-on-green blending and maintains visibility |

### Background-Based Theme Behavior

| Background Type | Theme Behavior | Visual Notes |
|----------------|----------------|--------------|
| Light backgrounds (white, light gray, neutral) | Use Green Theme, unless on Green | Text and icons remain dark, green theme maintains brand clarity |
| Green Background | Switch to Black Theme | Ensures contrast and avoids color clash |
| Dark Backgrounds (black, deep surfaces) | Both themes goes to Green dark mode | Backgrounds brightened to remain accessible |

---

## Behaviors

Buttons respond to user interactions through the following states:

### State Overview

- **Enabled** - Default resting state
- **Hover** - Mouse cursor over button
- **Focused** - Keyboard focus or active focus state
- **Active** - Button being pressed/clicked
- **Disabled** - Button cannot be interacted with

### Primary Button - Light Mode

| State | Text | Background | Stroke |
|-------|------|------------|--------|
| Enabled | Neutral Black | Green 300 | None |
| Hover | Neutral Black | Green 200 | None |
| Focused | Neutral Black | Green 200 | Black 2px |
| Active | Neutral Black | Green 300 | None |
| Disabled | Neutral 500 | Neutral 200 | None |

### Primary Button - Dark Mode

| State | Text | Background | Stroke |
|-------|------|------------|--------|
| Enabled | Neutral Black | Green 300 | None |
| Hover | Neutral Black | Green 200 | None |
| Focused | Neutral Black | Green 200 | White 2px |
| Active | Neutral Black | Green 300 | None |
| Disabled | Neutral 300 | Neutral 500 | None |

### Secondary Button - Light Mode

| State | Text | Background | Stroke |
|-------|------|------------|--------|
| Enabled | Green 400 | Transparent | Green 400 2px |
| Hover | Green 500 | Transparent | Green 500 2px |
| Focused | Green 500 | Transparent | Green 500 2px |
| Active | Green 400 | Transparent | Green 400 2px |
| Disabled | Neutral 400 | Transparent | Neutral 400 2px |

### Secondary Button - Dark Mode

| State | Text | Background | Stroke |
|-------|------|------------|--------|
| Enabled | Green 300 | Transparent | Green 300 2px |
| Hover | Green 200 | Transparent | Green 200 2px |
| Focused | Green 200 | Transparent | Green 200 2px |
| Active | Green 300 | Transparent | Green 300 2px |
| Disabled | Neutral 400 | Transparent | Neutral 400 2px |

### Tertiary Button - Light Mode

| State | Text | Text Decoration |
|-------|------|-----------------|
| Enabled | Green 400 | None |
| Hover | Green 500 | Underline |
| Focused | Green 500 | Underline |
| Active | Green 400 | Underline |
| Disabled | Neutral 400 | None |

### Tertiary Button - Dark Mode

| State | Text | Text Decoration |
|-------|------|-----------------|
| Enabled | Green 300 | None |
| Hover | Green 200 | Underline |
| Focused | Green 200 | Underline |
| Active | Green 300 | Underline |
| Disabled | Neutral 400 | None |

---

## Best Practices

### Do's ✓
- Use clear, action-oriented labels (e.g., "Submit", "Download", "Learn More")
- Limit to one primary button per view
- Ensure sufficient color contrast for accessibility
- Maintain consistent sizing across breakpoints
- Use appropriate button variant for the action hierarchy

### Don'ts ✗
- Don't use buttons for navigation (use links instead)
- Don't use vague labels like "Click Here" or "OK"
- Don't stack multiple primary buttons
- Don't use green buttons on green backgrounds
- Don't make disabled buttons look clickable

---

## Accessibility

- Buttons must meet WCAG 2.1 AA contrast ratios (4.5:1 for text)
- All buttons must be keyboard accessible
- Focus states must be clearly visible
- Disabled buttons should be indicated via aria-disabled attribute
- Button labels should be concise and descriptive
- Touch targets should be minimum 44x44px on mobile

---

## Design Tokens

### Typography
- **Label R**: Font size 16px, Line height 23.2px, Letter spacing 0px
- **Body R**: Font size 18px, Line height 26.1px, Letter spacing -0.5px

### Colors - Green Theme
- **Green 200**: `#70ee97`
- **Green 300**: `#21e46b` (Default)
- **Green 400**: `#0daa3e`
- **Green 500**: `#078139`

### Colors - Neutral
- **Neutral Black**: `#141414`
- **Neutral White**: `#ffffff`
- **Neutral 200**: `#e6eaf0`
- **Neutral 300**: `#cad4df`
- **Neutral 400**: `#8a919a`
- **Neutral 500**: `#72777e`

### Spacing
- **Border Radius**: 100px (fully rounded)
- **Border Width**: 2px
- **Icon Spacing**: 16px

---

## Implementation Notes

1. Buttons should use the `Booton` font family
2. Icons should scale proportionally with button size
3. Internal link buttons should use the appropriate link icon
4. All states should have smooth transitions (recommended 150ms ease)
5. Ensure proper touch target sizes on mobile devices
6. Test color contrast in both light and dark modes

---

## Version History

- **Current Version**: 1.0
- **Last Updated**: December 1, 2025
- **Source**: [Figma Design File](https://www.figma.com/design/MZOPJQOw9oWC6NDxLRH4ws/Button?node-id=5004-1245&m=dev)
