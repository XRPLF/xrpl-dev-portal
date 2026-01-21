# LogoRectangleGrid Component

A responsive grid pattern for displaying company/partner logos with rectangle tiles and dynamic alignment based on tile count. Built on top of the TileLogo component, featuring 9:5 aspect ratio rectangle tiles with 2 color variants and full dark mode support.

## Features

- **2 Color Variants**: Gray and Green backgrounds
- **Dynamic Alignment**: Grid alignment changes based on logo count (1-3: right, 4: left, 5-9: right, 9+: left)
- **Responsive Grid**: Automatically adapts from 2 columns (mobile) to 3 columns (tablet) to 4 columns (desktop)
- **Required Header**: Heading is required, description is optional
- **Clickable Logos**: Support for optional links on individual logos
- **Dark Mode Support**: Full light and dark mode compatibility
- **Rectangle Tiles**: Maintains 9:5 aspect ratio at all breakpoints
- **Grid Integration**: Built-in PageGrid wrapper with standard container support

## Responsive Behavior

The component automatically adapts its grid layout based on viewport width:

| Breakpoint | Columns | Gap | Tile Aspect Ratio |
|------------|---------|-----|-------------------|
| Mobile (< 768px) | 2 | 8px | 9:5 |
| Tablet (768px - 1023px) | 3 | 8px | 9:5 |
| Desktop (≥ 1024px) | 4 | 8px | 9:5 |

## Dynamic Alignment

The grid alignment changes based on the number of logos:

| Logo Count | Alignment | Offset |
|------------|-----------|--------|
| 1-3 | Right | 4 columns |
| 4 | Left | 0 columns |
| 5-9 | Right | 4 columns |
| 9+ | Left | 0 columns |

This creates a visually balanced layout that adapts to different content volumes.

## Color Variants

The LogoRectangleGrid pattern uses two color variants that map directly to TileLogo component variants:

| LogoRectangleGrid Variant | TileLogo Variant | Description |
|---------------------------|------------------|-------------|
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

interface LogoRectangleGridProps {
  /** Color variant - determines background color */
  variant?: 'gray' | 'green';
  /** Heading text (required) */
  heading: string;
  /** Optional description text */
  description?: string;
  /** Array of logo items to display in the grid */
  logos: LogoItem[];
  /** Additional CSS classes */
  className?: string;
}
```

### Default Values

- `variant`: `'gray'`
- `description`: `undefined`
- `className`: `''`

### Required Props

- `heading`: Heading text (required)
- `logos`: Array of logo items (required)

## Usage Examples

### Basic Usage with Gray Variant

```tsx
import { LogoRectangleGrid } from 'shared/patterns/LogoRectangleGrid';

<LogoRectangleGrid
  variant="gray"
  heading="Developer tools & APIs"
  logos={[
    { src: "/img/logos/company1.svg", alt: "Company 1" },
    { src: "/img/logos/company2.svg", alt: "Company 2" },
    { src: "/img/logos/company3.svg", alt: "Company 3" },
    { src: "/img/logos/company4.svg", alt: "Company 4" }
  ]}
/>
```

### With Description

```tsx
<LogoRectangleGrid
  variant="green"
  heading="Developer tools & APIs"
  description="Streamline development and build powerful RWA tokenization solutions with XRP Ledger's comprehensive developer toolset."
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
<LogoRectangleGrid
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
<LogoRectangleGrid
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
<LogoRectangleGrid
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

### Heading Only (No Description)

```tsx
<LogoRectangleGrid
  variant="gray"
  heading="Ecosystem Members"
  logos={[
    { src: "/img/logos/sponsor1.svg", alt: "Sponsor 1" },
    { src: "/img/logos/sponsor2.svg", alt: "Sponsor 2" },
    { src: "/img/logos/sponsor3.svg", alt: "Sponsor 3" },
    { src: "/img/logos/sponsor4.svg", alt: "Sponsor 4" }
  ]}
/>
```

### Demonstrating Alignment Logic

```tsx
// 1-3 logos: Right-aligned
<LogoRectangleGrid
  variant="green"
  heading="Featured Partners"
  logos={[
    { src: "/img/logos/partner1.svg", alt: "Partner 1" },
    { src: "/img/logos/partner2.svg", alt: "Partner 2" }
  ]}
/>

// 4 logos: Left-aligned
<LogoRectangleGrid
  variant="gray"
  heading="Core Technologies"
  logos={[
    { src: "/img/logos/tech1.svg", alt: "Tech 1" },
    { src: "/img/logos/tech2.svg", alt: "Tech 2" },
    { src: "/img/logos/tech3.svg", alt: "Tech 3" },
    { src: "/img/logos/tech4.svg", alt: "Tech 4" }
  ]}
/>

// 5-9 logos: Right-aligned
<LogoRectangleGrid
  variant="green"
  heading="Developer Tools"
  logos={[
    { src: "/img/logos/tool1.svg", alt: "Tool 1" },
    { src: "/img/logos/tool2.svg", alt: "Tool 2" },
    { src: "/img/logos/tool3.svg", alt: "Tool 3" },
    { src: "/img/logos/tool4.svg", alt: "Tool 4" },
    { src: "/img/logos/tool5.svg", alt: "Tool 5" },
    { src: "/img/logos/tool6.svg", alt: "Tool 6" }
  ]}
/>

// 9+ logos: Left-aligned
<LogoRectangleGrid
  variant="gray"
  heading="Partner Ecosystem"
  logos={[
    // ... 12 logos
  ]}
/>
```

## Important Implementation Details

### Logo Image Requirements

For best results, logo images should:
- Be SVG format for crisp scaling
- Have transparent backgrounds
- Be reasonably sized (width: 150-250px recommended for 9:5 aspect ratio)
- Use monochrome or simple color schemes
- Have consistent visual weight across all logos

### Grid Behavior

- The grid uses PageGridCol components for responsive layout
- Each tile uses `span={{ base: 2, md: 2, lg: 3 }}` (2 cols on mobile out of 4, 2 cols on tablet out of 6, 3 cols on desktop out of 12)
- This creates 2 columns on mobile, 3 columns on tablet, and 4 columns on desktop
- Tiles maintain a 9:5 aspect ratio using the TileLogo rectangle shape
- Gaps between tiles are handled by PageGrid's built-in gutter system
- Grid automatically wraps to new rows as needed
- Grid alignment changes dynamically based on logo count

### Alignment Logic Implementation

The alignment is controlled by the `alignRight` variable:

```typescript
const logoCount = logos.length;
const alignRight = 
  (logoCount >= 1 && logoCount <= 3) || 
  (logoCount >= 5 && logoCount <= 9);
```

When `alignRight` is true:
- Grid container spans 8 columns on desktop (lg breakpoint)
- Grid container has 4-column offset on desktop (pushes content right)

When `alignRight` is false:
- Grid container spans full width
- Grid container has 0 offset (content aligns left)

### Clickable Logo Behavior

Logo tiles leverage the TileLogo component's interactive capabilities:
- **With `href` property**: Renders as a link (`<a>` tag) with window shade hover animation
- **With `onClick` property**: Renders as a button with the same interactive states
- **With `disabled` property**: Prevents interaction and applies disabled styling
- **Interactive states**: Default, Hover, Focused, Pressed, and Disabled
- **Animation**: Window shade effect that wipes from bottom to top on hover
- All tiles automatically maintain focus states for keyboard accessibility

## Styling

### BEM Class Structure

```scss
.bds-logo-rectangle-grid                  // Base component
.bds-logo-rectangle-grid--gray            // Gray variant (maps to TileLogo 'neutral')
.bds-logo-rectangle-grid--green           // Green variant (maps to TileLogo 'green')
.bds-logo-rectangle-grid__header          // Header section container
.bds-logo-rectangle-grid__text            // Text content container
```

**Note**: Individual logo tiles are rendered using the TileLogo component with its own BEM structure (`bds-tile-logo`) and `shape="rectangle"`. Grid layout is handled by PageGridRow and PageGridCol components.

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
- Color contrast meets WCAG AA standards in all variants

## Best Practices

### When to Use Each Variant

- **Gray**: General-purpose logo grids, subtle integration
- **Green**: Featured partnerships, brand-focused sections

### Content Guidelines

- **Heading**: Required, keep concise (1-2 lines preferred), use sentence case
- **Description**: Optional, provide context (2-3 lines max), complete sentences
- **Logo Count**: Consider the alignment logic when choosing how many logos to display
- **Alt Text**: Use company/product names, not generic "logo"

### Logo Preparation

1. **Consistent Sizing**: Ensure all logos have similar visual weight
2. **Format**: Use SVG for scalability and crisp rendering
3. **Background**: Transparent backgrounds work best
4. **Aspect Ratio**: Rectangle tiles work well with horizontal logos
5. **Padding**: Include minimal internal padding in the SVG itself

### Performance

- Use optimized SVG files (run through SVGO or similar)
- Consider lazy loading for grids with many logos
- Provide appropriate alt text for all images
- Use `width` and `height` attributes on img tags when possible

### Technical Implementation

- **Grid System**: Uses PageGridCol with `span={{ base: 2, md: 2, lg: 3 }}` for responsive layout
- **Tile Rendering**: Leverages TileLogo component with `shape="rectangle"` for all logo tiles
- **Variant Mapping**: LogoRectangleGrid 'gray' → TileLogo 'neutral', LogoRectangleGrid 'green' → TileLogo 'green'
- **Interactive States**: TileLogo handles href (links), onClick (buttons), and disabled states
- **Aspect Ratio**: Rectangle tiles maintained by TileLogo with CSS `aspect-ratio: 9/5`
- **Animations**: Window shade hover effect managed by TileLogo component
- **Dynamic Alignment**: Grid alignment controlled by conditional offset based on logo count

## Files

- `LogoRectangleGrid.tsx` - Component implementation
- `LogoRectangleGrid.scss` - Styles with color variants and responsive breakpoints
- `index.ts` - Barrel exports
- `README.md` - This documentation

## Related Components

- **TileLogo**: Core component used to render individual logo tiles with interactive states and rectangle shape
- **LogoSquareGrid**: Similar pattern but with square tiles instead of rectangle tiles
- **PageGrid**: Used internally for responsive grid structure and standard container support

## Design References

- **Figma Design**: [Section Logo - Rectangle Grid](https://www.figma.com/design/gaTsImoTRsiRXAGzbGKcCd/Section-Logo---Rectangle-Grid?node-id=1-2)
- **Showcase Page**: `/about/logo-rectangle-grid-showcase.page.tsx`
- **Component Location**: `shared/patterns/LogoRectangleGrid/`

## Version History

- **January 2026**: Initial implementation
  - Figma design alignment with 2 color variants
  - Responsive grid with 2/3/4 column layout
  - Dynamic alignment based on logo count
  - Required header section with optional description
  - Clickable logo support
  - Rectangle tiles with 9:5 aspect ratio
