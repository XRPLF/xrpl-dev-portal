# ButtonGroup Component

A responsive button group container that automatically assigns button variants based on the number of buttons passed. Stacks vertically on mobile and horizontally on tablet+.

## Features

- **Auto-Variant Assignment**: Automatically assigns Primary/Tertiary/Secondary variants based on button count
- **Responsive Layout**: Vertical stack on mobile, horizontal row on tablet+ (for 1-2 buttons)
- **Block Layout**: 3+ buttons render as all tertiary in a vertical block layout
- **Customizable Spacing**: Control gap between buttons on tablet+ (none or small)
- **Theme Support**: Green or black color themes
- **Max Buttons Limit**: Optionally limit the number of buttons rendered

## Button Behavior

The component automatically determines button variants based on count:

| Count | Behavior |
|-------|----------|
| 1 button | Renders as Primary (or Secondary with `singleButtonVariant="secondary"`) |
| 2 buttons | First as Primary, second as Tertiary (responsive layout) |
| 3+ buttons | All as Tertiary in block layout (vertical on all screen sizes) |

## Usage

```tsx
import { ButtonGroup } from 'shared/patterns/ButtonGroup';

// Single button (Primary by default)
<ButtonGroup
  buttons={[
    { label: "Get Started", href: "/start" }
  ]}
  color="green"
/>

// Single button as Secondary
<ButtonGroup
  buttons={[
    { label: "Learn More", href: "/learn" }
  ]}
  singleButtonVariant="secondary"
  color="green"
/>

// Two buttons (auto: Primary + Tertiary)
<ButtonGroup
  buttons={[
    { label: "Get Started", href: "/start" },
    { label: "Learn More", href: "/learn" }
  ]}
  color="green"
/>

// Three or more buttons (auto: all Tertiary, block layout)
<ButtonGroup
  buttons={[
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api" },
    { label: "Tutorials", href: "/tutorials" }
  ]}
  color="black"
/>

// Limit to 2 buttons even if more are passed
<ButtonGroup
  buttons={[
    { label: "First", href: "/first" },
    { label: "Second", href: "/second" },
    { label: "Third (not rendered)", href: "/third" }
  ]}
  maxButtons={2}
  color="green"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `buttons` | `ButtonConfig[]` | *required* | Array of button configurations |
| `color` | `'green' \| 'black'` | `'green'` | Button color theme |
| `forceColor` | `boolean` | `false` | Force color to remain constant across light/dark modes |
| `gap` | `'none' \| 'small'` | `'small'` | Gap between buttons on tablet+ (0px or 4px) |
| `singleButtonVariant` | `'primary' \| 'secondary'` | `'primary'` | Variant for single button |
| `maxButtons` | `number` | - | Maximum number of buttons to render |
| `className` | `string` | `''` | Additional CSS classes |

### ButtonConfig

```tsx
interface ButtonConfig {
  label: string;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  forceColor?: boolean;
}
```

## Responsive Behavior

- **Mobile (<768px)**: Buttons stack vertically with 8px gap, aligned to start
- **Tablet+ (≥768px)**: Buttons align horizontally, centered, with configurable gap (0px or 4px)

## CSS Classes

- `.bds-button-group` - Base component
- `.bds-button-group--gap-none` - No gap on tablet+ (0px)
- `.bds-button-group--gap-small` - Small gap on tablet+ (4px)
