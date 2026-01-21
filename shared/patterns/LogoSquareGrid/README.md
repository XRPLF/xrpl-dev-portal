# LogoSquareGrid Component

A responsive grid pattern for displaying company/partner logos with an optional header section. Built on top of the TileLogo component, featuring square tiles arranged in a responsive grid with 2 color variants and full dark mode support.

## Features

- **2 Color Variants**: Gray and Green backgrounds
- **Responsive Grid**: Automatically adapts from 2 columns (mobile) to 4 columns (tablet/desktop)
- **Optional Header**: Includes heading, description, and action buttons
- **Clickable Logos**: Support for optional links on individual logos
- **Dark Mode Support**: Full light and dark mode compatibility
- **Square Tiles**: Maintains perfect square aspect ratio at all breakpoints
- **Grid Integration**: Built-in PageGrid wrapper with standard container support

## Responsive Behavior

The component automatically adapts its grid layout based on viewport width:

| Breakpoint | Columns | Gap | Tile Size |
|------------|---------|-----|-----------|
| Mobile (< 768px) | 2 | 8px | ~183px |
| Tablet (768px - 1023px) | 4 | 8px | ~178px |
| Desktop (≥ 1024px) | 4 | 8px | ~298px |

## Color Variants

The LogoSquareGrid pattern uses two color variants that map directly to TileLogo component variants:

| LogoSquareGrid Variant | TileLogo Variant | Description |
|------------------------|------------------|-------------|
| `gray` | `neutral` | Subtle, professional appearance for general partner showcases |
| `green` | `green` | Highlights featured or primary partners |

Colors are managed by the TileLogo component and automatically adapt between light and dark modes with proper hover states and animations.

## Props API

```typescript
interface LogoItem {
  /** Logo image source URL */
  src: string;
  /** Alt text for the logo image */
  alt: string;
  /** Optional link URL - makes the logo clickable */
  href?: string;
  /** Optional click handler - makes the logo a button */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
}

interface LogoSquareGridProps {
  /** Color variant - determines background color */
  variant?: 'gray' | 'green';
  /** Optional heading text */
  heading?: string;
  /** Optional description text */
  description?: string;
  /** Primary button configuration */
  primaryButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  /** Tertiary button configuration */
  tertiaryButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  /** Array of logo items to display in the grid */
  logos: LogoItem[];
  /** Additional CSS classes */
  className?: string;
}
```

### Default Values

- `variant`: `'gray'`
- `heading`: `undefined`
- `description`: `undefined`
- `primaryButton`: `undefined`
- `tertiaryButton`: `undefined`
- `className`: `''`

### Required Props

- `logos`: Array of logo items (required)

## Usage Examples

### Basic Usage with Gray Variant

```tsx
import { LogoSquareGrid } from 'shared/patterns/LogoSquareGrid';

<LogoSquareGrid
  variant="gray"
  logos={[
    { src: "/img/logos/company1.svg", alt: "Company 1" },
    { src: "/img/logos/company2.svg", alt: "Company 2" },
    { src: "/img/logos/company3.svg", alt: "Company 3" },
    { src: "/img/logos/company4.svg", alt: "Company 4" }
  ]}
/>
```

### With Header Section

```tsx
<LogoSquareGrid
  variant="green"
  heading="Developer tools & APIs"
  description="Streamline development and build powerful RWA tokenization solutions with XRP Ledger's comprehensive developer toolset."
  primaryButton={{ label: "View Documentation", href: "/docs" }}
  tertiaryButton={{ label: "Explore Tools", href: "/tools" }}
  logos={[
    { src: "/img/logos/tool1.svg", alt: "Tool 1" },
    { src: "/img/logos/tool2.svg", alt: "Tool 2" },
    { src: "/img/logos/tool3.svg", alt: "Tool 3" },
    { src: "/img/logos/tool4.svg", alt: "Tool 4" },
    { src: "/img/logos/tool5.svg", alt: "Tool 5" },
    { src: "/img/logos/tool6.svg", alt: "Tool 6" },
    { src: "/img/logos/tool7.svg", alt: "Tool 7" },
    { src: "/img/logos/tool8.svg", alt: "Tool 8" }
  ]}
/>
```

### With Clickable Logos

```tsx
<LogoSquareGrid
  variant="gray"
  heading="Our Partners"
  description="Leading companies building on XRPL."
  logos={[
    { 
      src: "/img/logos/partner1.svg", 
      alt: "Partner 1",
      href: "https://partner1.com"
    },
    { 
      src: "/img/logos/partner2.svg", 
      alt: "Partner 2",
      href: "https://partner2.com"
    }
  ]}
/>
```

### With Button Handlers

```tsx
<LogoSquareGrid
  variant="green"
  heading="Interactive Partners"
  description="Click any logo to learn more."
  logos={[
    { 
      src: "/img/logos/partner1.svg", 
      alt: "Partner 1",
      onClick: () => openModal('partner1')
    },
    { 
      src: "/img/logos/partner2.svg", 
      alt: "Partner 2",
      onClick: () => openModal('partner2')
    }
  ]}
/>
```

### With Disabled State

```tsx
<LogoSquareGrid
  variant="gray"
  heading="Coming Soon"
  description="New partners joining the ecosystem."
  logos={[
    { 
      src: "/img/logos/partner1.svg", 
      alt: "Partner 1",
      href: "/partners/partner1"
    },
    { 
      src: "/img/logos/coming-soon.svg", 
      alt: "Coming Soon",
      disabled: true
    }
  ]}
/>
```

### Without Header (Logo Grid Only)

```tsx
<LogoSquareGrid
  variant="gray"
  logos={[
    { src: "/img/logos/sponsor1.svg", alt: "Sponsor 1" },
    { src: "/img/logos/sponsor2.svg", alt: "Sponsor 2" },
    { src: "/img/logos/sponsor3.svg", alt: "Sponsor 3" },
    { src: "/img/logos/sponsor4.svg", alt: "Sponsor 4" }
  ]}
/>
```

### With Single Button

```tsx
<LogoSquareGrid
  variant="green"
  heading="Featured Integrations"
  description="Connect with leading platforms and services."
  primaryButton={{ label: "See All Integrations", href: "/integrations" }}
  logos={[
    { src: "/img/logos/integration1.svg", alt: "Integration 1" },
    { src: "/img/logos/integration2.svg", alt: "Integration 2" }
  ]}
/>
```

### With Click Handler

```tsx
<LogoSquareGrid
  variant="gray"
  heading="Developer Resources"
  description="Access comprehensive tools and libraries."
  primaryButton={{ 
    label: "Get Started", 
    onClick: () => console.log('Primary clicked')
  }}
  tertiaryButton={{ 
    label: "Learn More", 
    href: "/learn"
  }}
  logos={[
    { src: "/img/logos/resource1.svg", alt: "Resource 1" }
  ]}
/>
```

## Important Implementation Details

### Logo Image Requirements

For best results, logo images should:
- Be SVG format for crisp scaling
- Have transparent backgrounds
- Be reasonably sized (width: 120-200px recommended)
- Use monochrome or simple color schemes
- Have consistent visual weight across all logos

### Grid Behavior

- The grid uses PageGridCol components for responsive layout
- Each tile uses `span={{ base: 2, lg: 3 }}` (2 cols on mobile out of 4, 3 cols on desktop out of 12)
- Tiles maintain a 1:1 aspect ratio using `aspect-ratio: 1`
- Gaps between tiles are handled by PageGrid's built-in gutter system
- Grid automatically wraps to new rows as needed

### Clickable Logo Behavior

Logo tiles leverage the TileLogo component's interactive capabilities:
- **With `href` property**: Renders as a link (`<a>` tag) with window shade hover animation
- **With `onClick` property**: Renders as a button with the same interactive states
- **With `disabled` property**: Prevents interaction and applies disabled styling
- **Interactive states**: Default, Hover, Focused, Pressed, and Disabled
- **Animation**: Window shade effect that wipes from bottom to top on hover
- All tiles automatically maintain focus states for keyboard accessibility

### Header Section Logic

The header section only renders if at least one of the following is provided:
- `heading`
- `description`
- `primaryButton`
- `tertiaryButton`

### Button Styling

- Both primary and tertiary buttons use green color scheme
- Buttons stack vertically on mobile, horizontal on tablet+
- Button spacing: 8px gap on mobile, 4px gap on tablet+
- Button layout is handled by the shared ButtonGroup component

## Styling

### BEM Class Structure

```scss
.bds-logo-square-grid                  // Base component
.bds-logo-square-grid--gray            // Gray variant (maps to TileLogo 'neutral')
.bds-logo-square-grid--green           // Green variant (maps to TileLogo 'green')
.bds-logo-square-grid__header          // Header section container
.bds-logo-square-grid__text            // Text content container
.bds-logo-square-grid__heading         // Heading element
.bds-logo-square-grid__description     // Description element
```

**Note**: Individual logo tiles are rendered using the TileLogo component with its own BEM structure (`bds-tile-logo`). Grid layout is handled by PageGridRow and PageGridCol components. Button layout is handled by the ButtonGroup component (`bds-button-group`).

### Typography Tokens

- **Heading**: Uses `heading-md` type token (Tobias Light font)
  - Desktop: 40px / 46px line-height / -1px letter-spacing
  - Tablet: 36px / 45px line-height / -0.5px letter-spacing
  - Mobile: 32px / 40px line-height / 0px letter-spacing

- **Description**: Uses `body-l` type token (Booton Light font)
  - Desktop: 18px / 26.1px line-height / -0.5px letter-spacing
  - Tablet: 18px / 26.1px line-height / -0.5px letter-spacing
  - Mobile: 18px / 26.1px line-height / -0.5px letter-spacing

### Color Tokens

All colors are sourced from `styles/_colors.scss`:

```scss
// Tile backgrounds
$gray-200     // Gray variant (light mode)
$gray-700     // Gray variant (dark mode)
$green-200    // Green variant (light mode)
$green-300    // Green variant (dark mode)
```

## Accessibility

- Semantic HTML structure with proper heading hierarchy
- All logos include descriptive alt text
- Clickable logos have proper link semantics
- Keyboard navigation support with visible focus states
- ARIA labels provided through Button component
- Color contrast meets WCAG AA standards in all variants

## Best Practices

### When to Use Each Variant

- **Gray**: General-purpose logo grids, subtle integration
- **Green**: Featured partnerships, brand-focused sections

### Content Guidelines

- **Heading**: Keep concise (1 line preferred), use sentence case
- **Description**: Provide context (2-3 lines max), complete sentences
- **Logo Count**: Aim for multiples of 4 for visual balance on desktop
- **Alt Text**: Use company/product names, not generic "logo"

### Logo Preparation

1. **Consistent Sizing**: Ensure all logos have similar visual weight
2. **Format**: Use SVG for scalability and crisp rendering
3. **Background**: Transparent backgrounds work best
4. **Color**: Consider providing light/dark variants if needed
5. **Padding**: Include minimal internal padding in the SVG itself

### Performance

- Use optimized SVG files (run through SVGO or similar)
- Consider lazy loading for grids with many logos
- Provide appropriate alt text for all images
- Use `width` and `height` attributes on img tags when possible

### Technical Implementation

- **Grid System**: Uses PageGridCol with `span={{ base: 2, lg: 3 }}` for responsive layout (2 cols mobile, 4 cols desktop)
- **Tile Rendering**: Leverages TileLogo component for all logo tiles
- **Variant Mapping**: LogoSquareGrid 'gray' → TileLogo 'neutral', LogoSquareGrid 'green' → TileLogo 'green'
- **Interactive States**: TileLogo handles href (links), onClick (buttons), and disabled states
- **Aspect Ratio**: Square tiles maintained by TileLogo with CSS `aspect-ratio: 1`
- **Animations**: Window shade hover effect managed by TileLogo component
- **Button Layout**: Uses shared ButtonGroup component with `gap="small"` (4px on tablet+)

## Files

- `LogoSquareGrid.tsx` - Component implementation
- `LogoSquareGrid.scss` - Styles with color variants and responsive breakpoints
- `index.ts` - Barrel exports
- `README.md` - This documentation

## Related Components

- **TileLogo**: Core component used to render individual logo tiles with interactive states
- **ButtonGroup**: Shared pattern used for responsive button layout in the header
- **PageGrid**: Used internally for responsive grid structure and standard container support

## Design References

- **Figma Design**: [Pattern Logo - Square Grid](https://www.figma.com/design/ThBcoYLNKsBGw3r9g1L6Z8/Pattern-Logo---Square-Grid?node-id=1-2)
- **Showcase Page**: `/about/logo-square-grid-showcase.page.tsx`
- **Component Location**: `shared/patterns/LogoSquareGrid/`

## Version History

- **January 2026**: Initial implementation
  - Figma design alignment with 2 color variants
  - Responsive grid with 2/4 column layout
  - Optional header section with buttons
  - Clickable logo support
  - Refactored to use shared ButtonGroup component for button layout
