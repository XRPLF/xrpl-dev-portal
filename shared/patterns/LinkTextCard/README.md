# LinkTextCard Component

A numbered card component displaying a heading, description, and call-to-action buttons.

## Overview

LinkTextCard is a pattern component designed for sequential content presentation. Each card displays a numbered label (01, 02, 03...), a heading, description text, and up to 2 action buttons. Perfect for feature lists, step-by-step guides, or numbered content sections.

## Features

- **Sequential Numbering**: Auto-increments based on index prop with zero-padding (01, 02, 03...)
- **Minimal HTML Structure**: Flat DOM hierarchy for optimal performance
- **ButtonGroup Integration**: Supports up to 2 buttons (Primary + Tertiary layout)
- **Fixed Button Color**: Green buttons for brand consistency
- **Light/Dark Mode**: Full theming support
- **Responsive Design**: Adaptive spacing and typography across breakpoints
- **Top Divider**: Border-top styling with theme-aware colors

## Usage

### Basic Usage (2 Buttons)

```tsx
<LinkTextCard
  index={0}
  heading="Fast Settlement and Low Fees"
  description="Settle transactions in 3-5 seconds for a fraction of a cent, ideal for large-scale, high-volume RWA tokenization"
  buttons={[
    { label: "Get Started", href: "/start" },
    { label: "Learn More", href: "/docs" }
  ]}
/>
```

### Single Button

```tsx
<LinkTextCard
  index={1}
  heading="Secure and Reliable"
  description="Built on proven blockchain technology with enterprise-grade security"
  buttons={[
    { label: "Read Documentation", href: "/docs" }
  ]}
/>
```

### With Click Handlers

```tsx
<LinkTextCard
  index={2}
  heading="Developer Friendly"
  description="Comprehensive APIs and SDKs for seamless integration"
  buttons={[
    { label: "View API", onClick: () => navigate('/api') },
    { label: "See Examples", href: "/examples" }
  ]}
/>
```

### In a List

```tsx
{features.map((feature, index) => (
  <LinkTextCard
    key={feature.id}
    index={index}
    heading={feature.heading}
    description={feature.description}
    buttons={feature.buttons}
  />
))}
```

## Props

### LinkTextCardProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | Required | Card index for numbering (displays as index + 1) |
| `heading` | `string` | Required | Main heading text |
| `description` | `string` | Required | Description/body text |
| `buttons` | `ButtonConfig[]` | Required | Array of button configurations (max 2) |
| `className` | `string` | - | Additional CSS classes |

### ButtonConfig (from ButtonGroup)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Required | Button text |
| `href` | `string` | - | Link destination (renders as anchor) |
| `onClick` | `() => void` | - | Click handler (renders as button) |
| `forceColor` | `boolean` | `false` | Force color regardless of theme |

**Note**: Only the first 2 buttons will be rendered. Button color is fixed to 'green'.

## Component Structure

```tsx
<div className="bds-link-text-card">
  <p className="body-l">01</p>
  <h3 className="subhead-lg-l">Fast Settlement and Low Fees</h3>
  <p className="body-l">Settle transactions in 3-5 seconds...</p>
  <ButtonGroup buttons={[...]} color="green" />
</div>
```

**Key Design Decisions:**
- **Flat Structure**: No nested wrapper divs for minimal DOM depth
- **Border-Top Divider**: Applied directly to container (no separate element)
- **Typography Classes**: Uses existing `body-l` and `subhead-lg-l` classes
- **Flexbox Gap**: Responsive spacing via gap property

## Responsive Spacing

| Breakpoint | Gap | Content Gap | Padding Top |
|------------|-----|-------------|-------------|
| Base (< 576px) | 8px | 24px | 8px |
| MD (576px - 991px) | 12px | 32px | 12px |
| LG (≥ 992px) | 16px | 40px | 16px |

**Gap**: Space between number, heading, description, and buttons  
**Content Gap**: Additional space between description and ButtonGroup  
**Padding Top**: Space from top border to content

## Styling

### CSS Classes

- `.bds-link-text-card` - Main container with flexbox layout
- Leverages existing typography utilities: `body-l`, `subhead-lg-l`

### Color Variables (Light/Dark Mode)

- `--neutral-300` - Border color
- `--neutral-500` - Number text color
- Heading and description colors handled by typography classes

## Number Formatting

The component automatically formats numbers with zero-padding:

```typescript
index: 0  → "01"
index: 1  → "02"
index: 9  → "10"
index: 99 → "100"
```

## Button Behavior

### 1-2 Buttons
- **1 button**: Renders as primary button
- **2 buttons**: First as primary, second as tertiary

### 3+ Buttons
If more than 2 buttons are passed, only the first 2 will be rendered (automatically sliced).

## Files

- `LinkTextCard.tsx` - React component with TypeScript
- `LinkTextCard.scss` - Minimal SCSS with BEM naming
- `index.ts` - Barrel exports
- `README.md` - This file

## Related Components

- **ButtonGroup**: Used for rendering action buttons
- **Button**: Atomic button component used by ButtonGroup

## Import

```tsx
import { LinkTextCard } from 'shared/patterns/LinkTextCard';
// or
import { LinkTextCard, type LinkTextCardProps } from 'shared/patterns/LinkTextCard';
```

## Design System

Part of the Brand Design System (BDS) with `bds-` namespace prefix.

## Best Practices

1. **Use Sequential Indices**: Pass indices 0, 1, 2... for proper numbering
2. **Limit Buttons**: Design works best with 1-2 buttons
3. **Clear Descriptions**: Keep descriptions concise but informative
4. **Consistent Length**: Try to keep similar text lengths across cards in a group

## Accessibility

- Semantic HTML with proper heading hierarchy (`<h3>`)
- Button labels should be descriptive
- Maintains focus order: number → heading → description → buttons
