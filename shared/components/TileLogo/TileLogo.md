# TileLogo Component - Usage Guidelines

## Overview

`TileLogo` is a tile/card component designed to display brand logos with interactive states. It supports two shape variants (Square and Rectangle), two color variants (Neutral and Green), and responsive sizing that adapts to different breakpoints.

**Use TileLogo when:**
- Displaying partner or ecosystem brand logos
- Creating logo grids or showcases
- Highlighting integrations or collaborations
- Building clickable logo galleries
- Creating featured partner banners

**Don't use TileLogo for:**
- Feature cards with text content (use CardOffgrid)
- Navigation items (use navigation components)
- Image galleries (use gallery components)
- Non-interactive logo displays (use simple image elements)

---

## Shape Variants

### Square Shape (Default)

- **Aspect Ratio:** 1:1 (maintains square proportions)
- **Use Cases:** Logo grids, partner showcases, general logo displays
- **Responsive Padding:**
  - SM: 36px vertical / 20px horizontal
  - MD: 40px vertical / 24px horizontal
  - LG: 72px vertical / 48px horizontal

### Rectangle Shape

- **Height:** Fixed height with full width
- **Use Cases:** Horizontal layouts, featured partner banners, wide logo displays
- **Responsive Sizing:**
  - SM: 96px height, 2 columns width
  - MD: 96px height, 4 columns width
  - LG: 160px height, 4 columns width
- **Responsive Padding:**
  - SM/MD: 20px vertical / 36px horizontal
  - LG: 32px vertical / 64px horizontal

---

## Color Variants

### Neutral Variant (Default)

Use for general partner showcases and standard logo displays. Provides a subtle, professional appearance.

**Best for:**
- Standard partner logos
- General logo grids
- Non-featured content

### Green Variant

Use to highlight featured or primary partners. Creates visual hierarchy and draws attention.

**Best for:**
- Featured partners
- Primary integrations
- Important collaborations
- Creating visual emphasis

---

## Component API

```typescript
interface TileLogoProps {
  /** Shape variant: 'square' (default) or 'rectangle' */
  shape?: 'square' | 'rectangle';
  
  /** Color variant: 'neutral' (default) or 'green' */
  variant?: 'neutral' | 'green';
  
  /** Logo image source (URL or path) */
  logo: string;
  
  /** Alt text for accessibility */
  alt: string;
  
  /** Click handler - renders as <button> */
  onClick?: () => void;
  
  /** Link destination - renders as <a> */
  href?: string;
  
  /** Disabled state - prevents interaction */
  disabled?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}
```

---

## Usage Examples

### Basic Usage with Link

```tsx
<TileLogo
  variant="neutral"
  logo="/logos/partner-logo.svg"
  alt="Partner Name"
  href="/partners/partner-name"
/>
```

### Square Shape with Click Handler

```tsx
<TileLogo
  shape="square"
  variant="green"
  logo="/logos/featured-logo.svg"
  alt="Featured Partner"
  onClick={() => openPartnerModal('featured')}
/>
```

### Rectangle Shape for Banners

```tsx
<TileLogo
  shape="rectangle"
  variant="neutral"
  logo="/logos/partner-logo.svg"
  alt="Partner Banner"
  href="/partners/partner-name"
/>
```

### Logo Grid with Mixed Variants

```tsx
<PageGrid>
  <PageGridRow>
    {partners.map((partner) => (
      <PageGridCol key={partner.id} span={{ base: 4, sm: 4, lg: 3 }}>
        <TileLogo
          shape="square"
          variant={partner.featured ? 'green' : 'neutral'}
          logo={partner.logo}
          alt={partner.name}
          href={partner.url}
        />
      </PageGridCol>
    ))}
  </PageGridRow>
</PageGrid>
```

### Rectangle Banner Layout

```tsx
<PageGrid>
  <PageGridRow>
    <PageGridCol span={{ base: 4, sm: 8, lg: 12 }}>
      <div className="d-flex flex-column gap-4">
        <TileLogo
          shape="rectangle"
          variant="green"
          logo="/logos/featured-partner.svg"
          alt="Featured Partner"
          href="/partners/featured"
        />
        <TileLogo
          shape="rectangle"
          variant="neutral"
          logo="/logos/partner.svg"
          alt="Partner"
          href="/partners/partner"
        />
      </div>
    </PageGridCol>
  </PageGridRow>
</PageGrid>
```

---

## Best Practices

### Choosing the Right Shape

- **Use Square** when:
  - Creating grid layouts
  - Displaying multiple logos in equal-sized tiles
  - Maintaining consistent visual rhythm
  - Logo aspect ratios vary significantly

- **Use Rectangle** when:
  - Creating horizontal banner layouts
  - Displaying logos in a single column
  - Need wider display area for horizontal logos
  - Creating featured partner sections

### Choosing the Right Color Variant

- **Use Neutral** for:
  - Standard partner showcases
  - General logo grids
  - Non-featured content
  - Maintaining visual balance

- **Use Green** for:
  - Featured or primary partners
  - Creating visual hierarchy
  - Highlighting important integrations
  - Drawing user attention

### Logo Image Guidelines

- **Format:** Use SVG when possible for crisp rendering at all sizes
- **Aspect Ratio:** Logos should fit within the padded bounding box
- **Size:** Logo size is variable (designer recommendation) - ensure logos scale appropriately
- **Contrast:** Ensure logos have sufficient contrast with background colors
- **Alt Text:** Always provide meaningful, descriptive alt text

### Layout Recommendations

- **Square Grids:** Use PageGrid with responsive column spans (e.g., `span={{ base: 4, sm: 4, lg: 3 }}`)
- **Rectangle Layouts:** Use full-width containers (`span={{ base: 4, sm: 8, lg: 12 }}`)
- **Spacing:** Use PageGrid's built-in gap spacing for consistent layouts
- **Responsive:** Let the component handle responsive sizing automatically

### Interaction Patterns

- **Links vs Buttons:** Use `href` for navigation, `onClick` for actions (modals, dropdowns)
- **Disabled State:** Use for "coming soon" partners or unavailable content
- **Accessibility:** Always provide meaningful alt text and ensure keyboard navigation works

---

## Accessibility Considerations

### Semantic HTML

The component automatically renders as:
- `<a>` when `href` is provided
- `<button>` when `onClick` is provided or `disabled` is true

### Keyboard Navigation

- **Tab:** Navigates to the tile
- **Enter/Space:** Activates the tile (for buttons)
- **Focus Ring:** Visible 2px border appears on keyboard focus

### Screen Readers

- Always provide meaningful `alt` text describing the partner/brand
- Disabled tiles communicate their state via `aria-disabled`
- Links include proper `href` attributes for navigation context

### Color Contrast

- All component states meet WCAG AA contrast requirements
- Ensure logo images have sufficient contrast with background colors
- Test in both light and dark modes

---

## Design References

- **Square SM:** [Figma - Square SM](https://www.figma.com/design/12qdRGujqX7DWuY8IYmAnh/Tile---Logo?node-id=4047-907&m=dev)
- **Square MD:** [Figma - Square MD](https://www.figma.com/design/12qdRGujqX7DWuY8IYmAnh/Tile---Logo?node-id=4047-819&m=dev)
- **Square LG:** [Figma - Square LG](https://www.figma.com/design/12qdRGujqX7DWuY8IYmAnh/Tile---Logo?node-id=4047-495&m=dev)
- **Rectangle SM:** [Figma - Rectangle SM](https://www.figma.com/design/12qdRGujqX7DWuY8IYmAnh/Tile---Logo?node-id=4049-1350&m=dev)
- **Rectangle MD:** [Figma - Rectangle MD](https://www.figma.com/design/12qdRGujqX7DWuY8IYmAnh/Tile---Logo?node-id=4049-1329&m=dev)
- **Rectangle LG:** [Figma - Rectangle LG](https://www.figma.com/design/12qdRGujqX7DWuY8IYmAnh/Tile---Logo?node-id=4049-1309&m=dev)

---

## Common Patterns

### Partner Showcase Grid

```tsx
<PageGrid>
  <PageGridRow>
    {partners.map((partner) => (
      <PageGridCol key={partner.id} span={{ base: 4, sm: 4, lg: 3 }}>
        <TileLogo
          shape="square"
          variant="neutral"
          logo={partner.logo}
          alt={partner.name}
          href={`/partners/${partner.slug}`}
        />
      </PageGridCol>
    ))}
  </PageGridRow>
</PageGrid>
```

### Featured Partners Section

```tsx
<PageGrid>
  <PageGridRow>
    <PageGridCol span={12}>
      <h2>Featured Partners</h2>
      <PageGridRow>
        {featuredPartners.map((partner) => (
          <PageGridCol key={partner.id} span={{ base: 4, sm: 4, lg: 3 }}>
            <TileLogo
              shape="square"
              variant="green"
              logo={partner.logo}
              alt={partner.name}
              href={`/partners/${partner.slug}`}
            />
          </PageGridCol>
        ))}
      </PageGridRow>
    </PageGridCol>
  </PageGridRow>
</PageGrid>
```

### Partner Banner List

```tsx
<PageGrid>
  <PageGridRow>
    <PageGridCol span={{ base: 4, sm: 8, lg: 12 }}>
      <div className="d-flex flex-column gap-4">
        {partners.map((partner) => (
          <TileLogo
            key={partner.id}
            shape="rectangle"
            variant={partner.featured ? 'green' : 'neutral'}
            logo={partner.logo}
            alt={partner.name}
            href={`/partners/${partner.slug}`}
          />
        ))}
      </div>
    </PageGridCol>
  </PageGridRow>
</PageGrid>
```
