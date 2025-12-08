# CardStat Component Documentation

## Overview

The CardStat component is a statistics card that displays prominent numerical data with a descriptive label and optional call-to-action buttons. Following the XRPL Brand Design System (BDS), it supports four color variants and responsive layouts to showcase key metrics and statistics effectively.

## Features

- **Four Color Variants**: Lilac (default), Green, Light Gray, and Dark Gray
- **Flexible Content**: Large statistic text with descriptive label
- **Optional CTAs**: Support for 0, 1, or 2 buttons (Primary and/or Secondary)
- **Responsive Design**: Adaptive sizing and typography across breakpoints
- **Theme Support**: Automatic light/dark mode adaptation
- **Accessible**: Semantic HTML with proper button accessibility

## Props API

```typescript
interface ButtonConfig {
  /** Button label text */
  label: string;
  /** Click handler for button */
  onClick?: () => void;
  /** Link href for button */
  href?: string;
}

interface CardStatProps {
  /** The main statistic to display (e.g., "6 Million+") */
  statistic: string;
  /** Descriptive label for the statistic */
  label: string;
  /** Background color variant */
  variant?: 'lilac' | 'green' | 'light-gray' | 'dark-gray';
  /** Primary button configuration */
  primaryButton?: ButtonConfig;
  /** Secondary button configuration */
  secondaryButton?: ButtonConfig;
  /** Additional CSS classes */
  className?: string;
}
```

### Default Values

- `variant`: `'lilac'`
- `primaryButton`: `undefined` (no button)
- `secondaryButton`: `undefined` (no button)
- `className`: `''`

## Color Variants

### Lilac (Default)

A purple/lavender background that provides a soft, friendly appearance.

**Best For:**
- User-focused statistics (active wallets, users)
- Community metrics
- Engagement statistics

**Usage:**
```tsx
<CardStat 
  statistic="6 Million+" 
  label="Active wallets"
  variant="lilac"
/>
```

### Green

XRPL brand green background that reinforces brand identity.

**Best For:**
- Financial metrics (transaction volume, value moved)
- Growth statistics
- Positive indicators

**Usage:**
```tsx
<CardStat 
  statistic="$1 Trillion+" 
  label="Value moved"
  variant="green"
/>
```

### Light Gray

Light gray background for technology and reliability metrics.

**Best For:**
- Technical statistics (uptime, performance)
- Infrastructure metrics
- Stability indicators

**Usage:**
```tsx
<CardStat 
  statistic="12+" 
  label="Continuous uptime years"
  variant="light-gray"
/>
```

### Dark Gray

Neutral dark gray background for general-purpose statistics.

**Best For:**
- Neutral metrics
- Secondary information
- Supporting statistics

**Usage:**
```tsx
<CardStat 
  statistic="70+" 
  label="Ecosystem partners"
  variant="dark-gray"
/>
```

## Button Configurations

### No Buttons

Display statistics without call-to-action buttons for informational purposes.

```tsx
<CardStat 
  statistic="6 Million+" 
  label="Active wallets"
  variant="lilac"
/>
```

### Single Button (Primary)

Include one primary button for a main call-to-action.

```tsx
<CardStat 
  statistic="6 Million+" 
  label="Active wallets"
  variant="lilac"
  primaryButton={{
    label: "Learn More",
    href: "/wallets"
  }}
/>
```

### Two Buttons (Primary + Secondary)

Include both primary and secondary buttons for multiple actions.

```tsx
<CardStat 
  statistic="6 Million+" 
  label="Active wallets"
  variant="lilac"
  primaryButton={{
    label: "Learn More",
    href: "/wallets"
  }}
  secondaryButton={{
    label: "Get Started",
    onClick: handleGetStarted
  }}
/>
```

## How It Works

### Component Structure

The CardStat component uses BEM (Block Element Modifier) naming convention with the `bds` namespace:

- `.bds-card-stat` - Base card class
- `.bds-card-stat--lilac` - Lilac variant modifier
- `.bds-card-stat--green` - Green variant modifier
- `.bds-card-stat--light-gray` - Light gray variant modifier
- `.bds-card-stat--dark-gray` - Dark gray variant modifier
- `.bds-card-stat__content` - Inner content wrapper
- `.bds-card-stat__text` - Text section container
- `.bds-card-stat__statistic` - Large statistic text
- `.bds-card-stat__label` - Descriptive label text
- `.bds-card-stat__buttons` - Button container
- `.bds-card-stat__button-link` - Link wrapper for buttons

### Layout

The card uses flexbox for vertical layout:

1. **Content wrapper** (`.bds-card-stat__content`): Main container with padding
2. **Text section** (`.bds-card-stat__text`): Contains statistic and label
3. **Buttons section** (`.bds-card-stat__buttons`): Optional CTA buttons

The layout automatically adjusts spacing between sections using flexbox `justify-content: space-between`.

### Responsive Behavior

The component adapts to different screen sizes:

**Base (Mobile, <576px):**
- Padding: 8px
- Min height: 200px
- Statistic: 64px font size
- Label: 16px font size

**MD (Tablet, ≥576px):**
- Padding: 12px
- Min height: 208px
- Same typography as mobile

**LG+ (Desktop, ≥992px):**
- Padding: 16px
- Min height: 298px
- Statistic: 72px font size
- Label: 18px font size

### Button Integration

Buttons use the existing BDS Button component with `color="black"` variant to ensure proper contrast on colored backgrounds. Buttons can be either:

- **Links** (`href` provided): Wrapped in an anchor tag for navigation
- **Actions** (`onClick` provided): Rendered as interactive buttons

## Typography

### Statistic Text
- **Font**: Booton, sans-serif
- **Weight**: 228 (Light)
- **Size**: 64px (mobile), 72px (desktop)
- **Line Height**: 70.4px (mobile), 79.2px (desktop)
- **Letter Spacing**: -4.5px (mobile), -5px (desktop)

### Label Text
- **Font**: Booton, sans-serif
- **Weight**: 400 (Regular)
- **Size**: 16px (mobile), 18px (desktop)
- **Line Height**: 23.2px (mobile), 26.1px (desktop)
- **Letter Spacing**: 0px (mobile), -0.5px (desktop)

## Spacing & Layout

- **Border Radius**: 8px
- **Button Gap**: 8px between buttons
- **Text Gap**: 4px between statistic and label
- **Min Heights**: 200px (mobile), 208px (tablet), 298px (desktop)

## Usage Examples

### Basic Usage

```tsx
import { CardStat } from 'shared/components/CardStat';

// Simple statistic card
<CardStat 
  statistic="6 Million+" 
  label="Active wallets"
/>

// With color variant
<CardStat 
  statistic="$1 Trillion+" 
  label="Value moved"
  variant="green"
/>
```

### With Buttons

```tsx
// Single button (Light Gray variant)
<CardStat 
  statistic="12+" 
  label="Continuous uptime years"
  variant="light-gray"
  primaryButton={{
    label: "Learn More",
    href: "/about/uptime"
  }}
/>

// Two buttons (Dark Gray variant)
<CardStat 
  statistic="70+" 
  label="Ecosystem partners"
  variant="dark-gray"
  primaryButton={{
    label: "View Partners",
    href: "/partners"
  }}
  secondaryButton={{
    label: "Become Partner",
    onClick: handlePartnerSignup
  }}
/>
```

### In PageGrid Layout

```tsx
import { CardStat } from 'shared/components/CardStat';
import { PageGrid, PageGridRow, PageGridCol } from 'shared/components/PageGrid/page-grid';

<PageGrid>
  <PageGridRow>
    <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
      <CardStat 
        statistic="6 Million+" 
        label="Active wallets"
        variant="lilac"
      />
    </PageGridCol>
    <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
      <CardStat 
        statistic="$1 Trillion+" 
        label="Value moved"
        variant="green"
      />
    </PageGridCol>
    <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
      <CardStat 
        statistic="12+" 
        label="Continuous uptime years"
        variant="light-gray"
      />
    </PageGridCol>
  </PageGridRow>
</PageGrid>
```

### With Click Handlers

```tsx
const handleLearnMore = () => {
  console.log('Learn more clicked');
};

<CardStat 
  statistic="6 Million+" 
  label="Active wallets"
  variant="lilac"
  primaryButton={{
    label: "Learn More",
    onClick: handleLearnMore
  }}
/>
```

## Accessibility

### Semantic HTML

- Uses `<div>` elements with proper structure
- Button components handle their own accessibility
- Text content is readable by screen readers

### Keyboard Navigation

- Buttons are fully keyboard accessible (Tab, Enter, Space)
- Links are keyboard navigable (Tab, Enter)
- Focus indicators provided by Button component

### Color Contrast

All variants meet WCAG AA standards:
- **Black text on colored backgrounds**: Sufficient contrast
- **Buttons**: Use black variant with proper contrast on all backgrounds
- **Dark mode dark gray**: Switches to white text for proper contrast

## Best Practices

1. **Keep statistics concise** - Use abbreviations (M for million, K for thousand)
2. **Use descriptive labels** - Make it clear what the statistic represents
3. **Choose appropriate variants** - Match color to the type of metric
4. **Limit button usage** - Use buttons only when actionable context is needed
5. **Consider grid layouts** - Use PageGrid for consistent spacing and alignment
6. **Test responsiveness** - Verify cards adapt properly at all breakpoints

## When to Use

Use CardStat to:

- **Highlight key metrics** - Show important numbers prominently
- **Dashboard sections** - Create stat-focused areas on landing pages
- **About pages** - Showcase company or product statistics
- **Feature sections** - Emphasize quantitative benefits
- **Report summaries** - Display high-level data points

## When NOT to Use

Avoid CardStat when:

- **Complex data** - Use charts or tables for detailed information
- **Multiple related metrics** - Consider data visualization components
- **Non-numeric content** - Use regular cards for text-heavy content
- **Real-time updates** - Consider dedicated dashboard components

## Design Tokens

The component uses design tokens from the XRPL Brand Design System:

### Colors
- `$bds-card-stat-lilac-bg`: `#D9CAFF`
- `$bds-card-stat-green-bg`: `$green-300` (#EAFCF1)
- `$bds-card-stat-light-gray-bg`: `#CAD4DF` (light gray)
- `$bds-card-stat-dark-gray-bg`: `#8A919A` (dark gray)
- Text: `#141414` (neutral black)

### Spacing
- Border radius: `8px`
- Button gap: `8px`
- Text gap: `4px`
- Content padding: `8px` (mobile), `12px` (tablet), `16px` (desktop)

### Motion
- Transition duration: `150ms`
- Timing function: `cubic-bezier(0.98, 0.12, 0.12, 0.98)`

## Theme Support

The component automatically adapts for light and dark modes:

### Light Mode (Default)
- All color variants use their defined light backgrounds
- Black text on colored backgrounds

### Dark Mode
- **Dark Gray variant**: Switches to darker gray background (`$gray-400`) with white text
- **Other variants**: Maintain colored backgrounds with black text

## Showcase

See the interactive showcase at `/about/cardstat-showcase` for live examples of all variants, button configurations, and responsive behavior in PageGrid layouts.

## File Structure

```
shared/components/CardStat/
├── CardStat.tsx        # Component implementation
├── CardStat.scss       # Component styles
├── CardStat.md         # This documentation
└── index.ts            # Exports
```

## Related Components

- **Button** - Used for CTA buttons within cards
- **PageGrid** - For laying out multiple cards in responsive grids
- **Divider** - Can be used to separate card sections if needed
