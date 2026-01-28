# ButtonGroup Component

A responsive button group container that displays primary and/or tertiary buttons. Stacks vertically on mobile and horizontally on tablet+.

## Features

- **Responsive Layout**: Vertical stack on mobile, horizontal row on tablet+
- **Flexible Configuration**: Support for primary, tertiary, or both buttons
- **Customizable Spacing**: Control gap between buttons on tablet+ (none or small)
- **Theme Support**: Green or black color themes

## Usage

```tsx
import { ButtonGroup } from 'shared/patterns/ButtonGroup';

// Basic usage with both buttons
<ButtonGroup
  primaryButton={{ label: "Get Started", href: "/start" }}
  tertiaryButton={{ label: "Learn More", href: "/learn" }}
  color="green"
/>

// With no gap on tablet+
<ButtonGroup
  primaryButton={{ label: "Action", onClick: handleClick }}
  color="black"
  gap="none"
/>

// With small gap on tablet+ (4px - default)
<ButtonGroup
  primaryButton={{ label: "Primary Action", href: "/action" }}
  tertiaryButton={{ label: "Secondary", href: "/secondary" }}
  gap="small"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `primaryButton` | `ButtonConfig` | - | Primary button configuration |
| `tertiaryButton` | `ButtonConfig` | - | Tertiary button configuration |
| `color` | `'green' \| 'black'` | `'green'` | Button color theme |
| `gap` | `'none' \| 'small'` | `'small'` | Gap between buttons on tablet+ (0px or 4px) |
| `className` | `string` | `''` | Additional CSS classes |

### ButtonConfig

```tsx
interface ButtonConfig {
  label: string;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

## Responsive Behavior

- **Mobile (<768px)**: Buttons stack vertically with 8px gap, aligned to start
- **Tablet+ (≥768px)**: Buttons align horizontally, centered, with configurable gap (0px or 4px)

## CSS Classes

- `.bds-button-group` - Base component
- `.bds-button-group--gap-none` - No gap on tablet+ (0px)
- `.bds-button-group--gap-small` - Small gap on tablet+ (4px)
