# CardOffgrid Component - Usage Guide

## Overview

`CardOffgrid` is a feature highlight card component designed to showcase key capabilities, features, or resources. It combines an icon, title, and description in a visually engaging, interactive card format with smooth hover animations.

**Use CardOffgrid when:**
- Highlighting key features or capabilities
- Creating feature grids or showcases
- Linking to important documentation or resources
- Presenting product/service highlights

**Don't use CardOffgrid for:**
- Simple content cards (use standard Bootstrap cards)
- Navigation items (use navigation components)
- Data display (use tables or data components)
- Long-form content (use article/page layouts)

---

## When to Use Each Variant

### Neutral Variant (`variant="neutral"`)

**Use for:**
- General feature highlights
- Standard content cards
- Secondary or supporting features
- When you want subtle, professional presentation

**Example use cases:**
- Documentation sections
- Feature lists
- Service offerings
- Standard informational cards

### Green Variant (`variant="green"`)

**Use for:**
- Primary or featured highlights
- Call-to-action cards
- Important announcements
- Brand-emphasized content

**Example use cases:**
- Hero feature cards
- Primary CTAs
- Featured resources
- Branded highlights

---

## Content Best Practices

### Title Guidelines

✅ **Do:**
- Keep titles concise (1-3 words ideal)
- Use line breaks (`\n`) for multi-word titles when needed
- Make titles action-oriented or descriptive
- Examples: "Onchain Metadata", "Token\nManagement", "Cross-Chain\nBridges"

❌ **Don't:**
- Write long sentences as titles
- Use more than 2 lines
- Include punctuation (periods, commas)
- Make titles too generic ("Feature", "Service")

### Description Guidelines

✅ **Do:**
- Write 1-2 sentences (15-25 words ideal)
- Focus on benefits or key information
- Use clear, simple language
- Keep descriptions scannable

❌ **Don't:**
- Write paragraphs (save for full pages)
- Use jargon without context
- Include multiple ideas in one description
- Make descriptions too short (< 10 words) or too long (> 40 words)

### Icon Guidelines

✅ **Do:**
- Use SVG icons for crisp rendering
- Choose icons that represent the feature clearly
- Ensure icons are recognizable at 68×68px
- Use consistent icon style across cards

❌ **Don't:**
- Use low-resolution raster images
- Choose overly complex icons
- Mix icon styles within a single grid
- Use icons that don't relate to the content

---

## Interaction Patterns

### Using `onClick` vs `href`

**Use `onClick` when:**
- Triggering JavaScript actions (modals, analytics, state changes)
- Opening external links in new tabs
- Performing client-side navigation
- Handling complex interactions

```tsx
<CardOffgrid
  variant="neutral"
  icon={<AnalyticsIcon />}
  title="View Analytics"
  description="See detailed usage statistics and insights."
  onClick={() => {
    trackEvent('analytics_viewed');
    openModal('analytics');
  }}
/>
```

**Use `href` when:**
- Navigating to internal pages
- Linking to documentation
- Simple page navigation
- SEO-friendly links

```tsx
<CardOffgrid
  variant="green"
  icon="/icons/docs.svg"
  title="API\nReference"
  description="Complete API documentation and examples."
  href="/docs/api"
/>
```

### Disabled State

Use `disabled` when:
- Feature is coming soon
- Feature requires authentication
- Feature is temporarily unavailable
- You want to show but not allow interaction

```tsx
<CardOffgrid
  variant="neutral"
  icon={<BetaIcon />}
  title="Coming\nSoon"
  description="This feature will be available in the next release."
  disabled
/>
```

---

## Layout Best Practices

### Grid Layouts

**Recommended grid patterns:**

```tsx
// 2-column grid (desktop)
<div className="row">
  <div className="col-md-6 mb-4">
    <CardOffgrid {...props1} />
  </div>
  <div className="col-md-6 mb-4">
    <CardOffgrid {...props2} />
  </div>
</div>

// 3-column grid (desktop)
<div className="row">
  {cards.map(card => (
    <div key={card.id} className="col-md-4 mb-4">
      <CardOffgrid {...card} />
    </div>
  ))}
</div>
```

**Spacing:**
- Use Bootstrap spacing utilities (`mb-4`, `mb-5`) between cards
- Maintain consistent spacing in grids
- Cards are responsive and stack on mobile automatically

### Single Card Usage

For hero sections or featured highlights:

```tsx
<div className="d-flex justify-content-center">
  <CardOffgrid
    variant="green"
    icon={<FeaturedIcon />}
    title="New Feature"
    description="Introducing our latest capability..."
    href="/features/new"
  />
</div>
```

---

## Accessibility Best Practices

### Semantic HTML

The component automatically renders as:
- `<button>` when using `onClick`
- `<a>` when using `href`

This ensures proper semantic meaning for screen readers.

### Keyboard Navigation

✅ **Always test:**
- Tab navigation moves focus to cards
- Enter/Space activates cards
- Focus ring is clearly visible
- Focus order follows logical reading order

### Screen Reader Content

✅ **Ensure:**
- Titles are descriptive and unique
- Descriptions provide context
- Icons have appropriate `aria-hidden="true"` (handled automatically)
- Disabled cards communicate their state

### Color Contrast

All variants meet WCAG AA standards:
- Dark mode: White text on colored backgrounds
- Light mode: Dark text on light backgrounds
- Focus rings provide sufficient contrast

---

## Common Patterns

### Feature Showcase Grid

```tsx
const features = [
  {
    variant: 'green',
    icon: <TokenIcon />,
    title: 'Token\nManagement',
    description: 'Create and manage fungible and non-fungible tokens.',
    href: '/docs/tokens'
  },
  {
    variant: 'neutral',
    icon: <MetadataIcon />,
    title: 'Onchain\nMetadata',
    description: 'Store key asset information using simple APIs.',
    href: '/docs/metadata'
  },
  // ... more features
];

<div className="row">
  {features.map((feature, index) => (
    <div key={index} className="col-md-4 mb-4">
      <CardOffgrid {...feature} />
    </div>
  ))}
</div>
```

### Mixed Variants for Hierarchy

Use green variant for primary features, neutral for supporting:

```tsx
<div className="row">
  <div className="col-md-6 mb-4">
    <CardOffgrid
      variant="green"  // Primary feature
      icon={<PrimaryIcon />}
      title="Main Feature"
      description="Our flagship capability..."
      href="/feature/main"
    />
  </div>
  <div className="col-md-6 mb-4">
    <CardOffgrid
      variant="neutral"  // Supporting feature
      icon={<SupportIcon />}
      title="Supporting Feature"
      description="Complementary capability..."
      href="/feature/support"
    />
  </div>
</div>
```

### Coming Soon Pattern

```tsx
<CardOffgrid
  variant="neutral"
  icon={<ComingSoonIcon />}
  title="Coming\nSoon"
  description="This feature is currently in development and will be available soon."
  disabled
/>
```

---

## Performance Considerations

### Icon Optimization

✅ **Best practices:**
- Use SVG React components (inlined) for small icons
- Use optimized SVG files for image icons
- Avoid large raster images
- Consider lazy loading for below-the-fold cards

### Rendering Performance

- Cards are lightweight components
- Hover animations use CSS transforms (GPU-accelerated)
- No heavy JavaScript calculations
- Suitable for grids with 10+ cards

---

## Troubleshooting

### Common Issues

**Card not clickable:**
- Ensure `onClick` or `href` is provided
- Check that `disabled` is not set to `true`
- Verify no parent element is blocking pointer events

**Icon not displaying:**
- Verify icon path is correct (if using string)
- Check icon component is properly imported
- Ensure icon fits within 68×68px bounds

**Hover animation not working:**
- Check browser supports CSS `clip-path`
- Verify no conflicting CSS is overriding transitions
- Test in different browsers

**Focus ring not visible:**
- Ensure keyboard navigation (Tab key)
- Check focus ring color contrasts with background
- Verify `outline-offset: 2px` is applied

---

## Design System Integration

### Color Tokens

All colors reference `styles/_colors.scss`:
- Dark mode (default): Uses `$gray-500`, `$gray-400`, `$green-300`, `$green-200`
- Light mode (`html.light`): Uses `$gray-200`, `$gray-300`, `$green-200`, `$green-300`

### Typography

- Title: Booton Light, 32px, -1px letter-spacing
- Description: Booton Light, 18px, -0.5px letter-spacing

### Spacing

- Card padding: 24px
- Content gap: 40px (between title and description)
- Icon container: 84×84px

---

## Figma References

- **Light Mode Colors**: [Figma Design - Light Mode](https://www.figma.com/design/vwDwMJ3mFrAklj5zvZwX5M/Card---OffGrid?node-id=8001-1963&m=dev)
- **Dark Mode Colors**: [Figma Design - Dark Mode](https://www.figma.com/design/vwDwMJ3mFrAklj5zvZwX5M/Card---OffGrid?node-id=8001-2321&m=dev)
- **Animation Specs**: [Figma Design - Storyboard](https://www.figma.com/design/vwDwMJ3mFrAklj5zvZwX5M/Card---OffGrid?node-id=8007-1096&m=dev)

---

## Component API

```typescript
interface CardOffgridProps {
  /** Color variant: 'neutral' (default) or 'green' */
  variant?: 'neutral' | 'green';
  
  /** Icon element (ReactNode) or image path (string) */
  icon: React.ReactNode | string;
  
  /** Card title - use \n for line breaks */
  title: string;
  
  /** Card description text (1-2 sentences) */
  description: string;
  
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

## Quick Reference

| Use Case | Variant | Interaction |
|----------|---------|-------------|
| Standard feature | `neutral` | `href` or `onClick` |
| Primary feature | `green` | `href` or `onClick` |
| Coming soon | `neutral` | `disabled` |
| Feature grid | Mix both | `href` preferred |
| Hero section | `green` | `href` |

---

## Examples

See the [CardOffgrid Showcase](/about/card-offgrid-showcase) for live examples and interactive demos.
