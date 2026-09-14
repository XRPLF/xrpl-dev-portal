# ButtonGroup Component

A responsive button group container that assigns button emphasis based on the number of buttons passed. Stacks vertically on mobile and horizontally on tablet+.

## Features

- **Auto Emphasis**: Assigns emphasis by button count (override with `forceEmphasis`)
- **Responsive Layout**: Vertical stack on mobile, horizontal row on tablet+ (for 1-2 buttons)
- **Block Layout**: 3+ buttons render as a vertical block
- **Customizable Spacing**: Control gap between buttons on tablet+
- **Surface Support**: One `surface` selects the token group for the whole set
- **Max Buttons Limit**: Optionally limit the number of buttons rendered

## Button Behavior

The component determines emphasis by count:

| Count | Behavior |
|-------|----------|
| 1 button | `singleButtonEmphasis` (default `strong`) |
| 2 buttons | First `strong`, second `subtle` (responsive layout) |
| 3+ buttons | All `subtle` in block layout (vertical on all screen sizes) |

### Overriding the emphasis

Pass `forceEmphasis` for one uniform treatment no matter how many buttons the
section receives. It supersedes both the count-based defaults and
`singleButtonEmphasis`; layout (inline vs. block) still follows the count.

An all-`subtle` set renders as `Link`s rather than Buttons, so the labels sit
flush with the surrounding text. `FeatureTwoColumn` is the reference consumer.

```tsx
<ButtonGroup
  buttons={[{ label: 'Learn More', href: '/learn' }]}
  forceEmphasis="subtle"
/>
```

## Usage

```tsx
import { ButtonGroup } from 'shared/patterns/ButtonGroup';

// Single button (strong by default)
<ButtonGroup buttons={[{ label: "Get Started", href: "/start" }]} />

// Single button as standard
<ButtonGroup
  buttons={[{ label: "Learn More", href: "/learn" }]}
  singleButtonEmphasis="standard"
/>

// Two buttons (auto: strong + subtle)
<ButtonGroup
  buttons={[
    { label: "Get Started", href: "/start" },
    { label: "Learn More", href: "/learn" }
  ]}
/>

// Three or more (auto: all subtle, block layout) on a solid brand block
<ButtonGroup
  buttons={[
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api" },
    { label: "Tutorials", href: "/tutorials" }
  ]}
  surface={{ context: "on-saturated" }}
/>

// Limit to 2 buttons even if more are passed
<ButtonGroup
  buttons={[
    { label: "First", href: "/first" },
    { label: "Second", href: "/second" },
    { label: "Third (not rendered)", href: "/third" }
  ]}
  maxButtons={2}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `buttons` | `ButtonConfig[]` | *required* | Array of button configurations |
| `surface` | `ButtonSurface` | `{}` | `intention` + `context` as one value, for the whole set |
| `gap` | `'none' \| 'small' \| 'medium'` | `'small'` | Gap between buttons: `none`/`small` are 0px/4px on tablet+; `medium` is 16px through tablet, 24px at lg+ |
| `singleButtonEmphasis` | `'strong' \| 'standard'` | `'strong'` | Emphasis for a lone button |
| `forceEmphasis` | `ButtonEmphasis` | - | Force every button to this emphasis, overriding the count-based defaults and `singleButtonEmphasis` |
| `maxButtons` | `number` | - | Maximum number of buttons to render |
| `className` | `string` | `''` | Additional CSS classes |

### ButtonConfig

```tsx
interface ButtonConfig {
  label: string;
  href?: string;
  onClick?: () => void;
}
```

## Responsive Behavior

- **Mobile (<768px)**: Buttons stack vertically with 8px gap, aligned to start
- **Tablet+ (≥768px)**: Buttons align horizontally, centered, with configurable gap (0px or 4px)

## CSS Classes

- `.bds-button-group` - Base component
- `.bds-button-group--gap-none` - No gap on tablet+ (0px)
- `.bds-button-group--gap-small` - Small gap on tablet+ (4px)
