# CalloutMediaBanner Component

A full-width banner component featuring a heading, subheading, and optional action buttons. Designed for prominent page sections and hero areas with support for 5 color variants or custom background images.

## Features

- **5 Color Variants**: Default (white), Light Gray, Lilac, Green, and Gray
- **Background Image Support**: Optional image with gradient overlay for text readability
- **Responsive Design**: Adapts across mobile, tablet, and desktop breakpoints
- **Flexible Buttons**: Supports primary, tertiary, both, or no buttons
- **Automatic Button Styling**: Intelligently selects button colors based on variant
- **Dark Mode Support**: Full light and dark mode compatibility
- **Grid Integration**: Built-in PageGrid wrapper with wide container support
- **Vertical Centering**: Automatically centers text when no buttons are present

## Responsive Behavior

The component automatically adapts its spacing and typography based on viewport width:

| Breakpoint | Padding | Content Gap | Heading Size | Subheading Size | Min Height |
|------------|---------|-------------|--------------|-----------------|------------|
| Mobile (< 768px) | 24px | 48px | 32px | 24px | 280px |
| Tablet (768px - 1023px) | 32px | 64px | 36px | 28px | 280px |
| Desktop (≥ 1024px) | 40px | 80px | 40px | 32px | 360px |

## Color Variants

### Light Mode

| Variant | Background | Text Color | Button Color |
|---------|------------|------------|--------------|
| `default` | White (#FFFFFF) | Black (#141414) | Green |
| `light-gray` | Gray 200 (#E6EAF0) | Black (#141414) | Black |
| `lilac` | Lilac 300 (#C0A7FF) | Black (#141414) | Black |
| `green` | Green 200 (#70EE97) | Black (#141414) | Black |
| `gray` | Gray 300 (#CAD4DF) | Black (#141414) | Black |
| `image` (textColor='white') | Background Image | White (#FFFFFF) | Green |
| `image` (textColor='black') | Background Image | Black (#141414) | Green |

### Dark Mode

| Variant | Background | Text Color | Button Color |
|---------|------------|------------|--------------|
| `default` | Gray 800 (#232325) | White (#FFFFFF) | Green |
| `light-gray` | Gray 700 (#343437) | White (#FFFFFF) | Black |
| `lilac` | Lilac 400 (#7649E3) | White (#FFFFFF) | Black |
| `green` | Green 300 (#21E46B) | Black (#141414) | Black |
| `gray` | Gray 600 (#454549) | White (#FFFFFF) | Black |
| `image` (textColor='white') | Background Image | White (#FFFFFF) | Green |
| `image` (textColor='black') | Background Image | Black (#141414) | Green |

## Props API

```typescript
interface CalloutMediaBannerProps {
  /** Color variant - determines background color (ignored if backgroundImage is provided) */
  variant?: 'default' | 'light-gray' | 'lilac' | 'green' | 'gray';
  /** Background image URL - overrides variant color when provided */
  backgroundImage?: string;
  /** Text color for image variant - fixes text color across light/dark modes (only applicable when backgroundImage is provided) */
  textColor?: 'white' | 'black';
  /** Main heading text */
  heading?: string;
  /** Subheading/description text */
  subheading: string;
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
  /** Additional CSS classes */
  className?: string;
}
```

### Default Values

- `variant`: `'default'`
- `backgroundImage`: `undefined`
- `textColor`: `'white'` (only used when `backgroundImage` is provided)
- `primaryButton`: `undefined`
- `tertiaryButton`: `undefined`
- `className`: `''`

## Usage Examples

### Basic Usage with Color Variant

```tsx
import { CalloutMediaBanner } from 'shared/patterns/CalloutMediaBanner';

<CalloutMediaBanner
  variant="green"
  heading="The Compliant Ledger Protocol"
  subheading="A decentralized public Layer 1 blockchain for creating, transferring, and exchanging digital assets with a focus on compliance."
  primaryButton={{ label: "Get Started", href: "/docs" }}
  tertiaryButton={{ label: "Learn More", href: "/about" }}
/>
```

### With Background Image (White Text - Default)

```tsx
<CalloutMediaBanner
  backgroundImage="/images/hero-bg.jpg"
  heading="Build on XRPL"
  subheading="Start building your next project on the XRP Ledger."
  primaryButton={{ label: "Start Building", onClick: handleClick }}
/>
```

### With Background Image (Black Text)

```tsx
<CalloutMediaBanner
  backgroundImage="/images/light-hero-bg.jpg"
  textColor="black"
  heading="Build on XRPL"
  subheading="Start building your next project on the XRP Ledger with black text that remains consistent across light and dark modes."
  primaryButton={{ label: "Start Building", onClick: handleClick }}
/>
```

### Single Button

```tsx
<CalloutMediaBanner
  variant="light-gray"
  heading="Developer Resources"
  subheading="Access comprehensive documentation and tutorials."
  primaryButton={{ label: "View Docs", href: "/docs" }}
/>
```

### No Buttons (Informational)

```tsx
<CalloutMediaBanner
  variant="lilac"
  heading="System Announcement"
  subheading="Important information or announcement without requiring user action."
/>
```

### With Click Handler

```tsx
<CalloutMediaBanner
  variant="default"
  heading="Join the Community"
  subheading="Connect with developers, validators, and enthusiasts."
  primaryButton={{ 
    label: "Join Discord", 
    onClick: () => window.open('https://discord.gg/xrpl', '_blank')
  }}
  tertiaryButton={{ label: "View Events", href: "/events" }}
/>
```

## Important Implementation Details

### Image Priority Logic

When `backgroundImage` is provided, it **overrides** the `variant` prop:
- ✅ Image is used as background
- ✅ No solid color background is applied
- ✅ Text color defaults to white (can be set to black via `textColor` prop)
- ✅ Text color remains fixed across both light and dark modes
- ✅ Gradient overlay is automatically added (dark overlay for white text, light overlay for black text)

### Button Color Logic

Buttons automatically use the appropriate color based on the variant:
- **Default variant**: Green buttons
- **Image variant**: Green buttons
- **All other variants** (light-gray, lilac, green, gray): Black buttons

### Vertical Alignment

- **With buttons**: Text stays at top, buttons stick to bottom (`justify-content: space-between`)
- **Without buttons**: Text is vertically centered (`justify-content: center`)

### Grid Integration

The component **already wraps content in PageGrid structure**. Do not nest it inside another PageGrid:

❌ **Don't do this:**
```tsx
<PageGrid>
  <PageGridRow>
    <PageGridCol span={12}>
      <CalloutMediaBanner ... />  {/* Double-wrapped! */}
    </PageGridCol>
  </PageGridRow>
</PageGrid>
```

✅ **Do this:**
```tsx
<CalloutMediaBanner ... />  {/* Already includes PageGrid internally */}
```

## Styling

### BEM Class Structure

```scss
.bds-callout-media-banner                    // Base banner
.bds-callout-media-banner--default           // White background variant
.bds-callout-media-banner--light-gray        // Light gray variant
.bds-callout-media-banner--lilac             // Lilac variant
.bds-callout-media-banner--green             // Green variant
.bds-callout-media-banner--gray              // Gray variant
.bds-callout-media-banner--image             // Background image variant (white text)
.bds-callout-media-banner--image-text-black  // Background image with black text (fixed across modes)
.bds-callout-media-banner--centered          // Centered content modifier
.bds-callout-media-banner__content           // Content wrapper
.bds-callout-media-banner__text              // Text container
.bds-callout-media-banner__heading           // Heading element
.bds-callout-media-banner__subheading        // Subheading element
.bds-callout-media-banner__actions           // Button container
```

### Typography Tokens

- **Heading**: Uses `heading-md` type token (Tobias Light font)
  - Desktop: 40px / 46px line-height / -1px letter-spacing
  - Tablet: 36px / 45px line-height / -0.5px letter-spacing
  - Mobile: 32px / 40px line-height / 0px letter-spacing

- **Subheading**: Uses `subhead-lg-r` type token (Booton Regular font)
  - Desktop: 32px / 40px line-height / -0.5px letter-spacing
  - Tablet: 28px / 35px line-height / -0.75px letter-spacing
  - Mobile: 24px / 30px line-height / -1px letter-spacing

### Color Tokens

All colors are sourced from `styles/_colors.scss`:

```scss
// Backgrounds
$white        // Default variant
$gray-200     // Light Gray variant
$lilac-300    // Lilac variant
$green-200    // Green variant
$gray-300     // Gray variant

// Dark mode backgrounds
$gray-800     // Default (dark)
$gray-700     // Light Gray (dark)
$lilac-400    // Lilac (dark)
$green-300    // Green (dark)
$gray-600     // Gray (dark)
```

## Accessibility

- Semantic HTML structure with proper heading hierarchy
- Button components include ARIA labels
- Keyboard navigation support through Button component
- Focus states with visible outlines
- Sufficient color contrast in all variants

## Best Practices

### When to Use Each Variant

- **Default**: General-purpose banners, clean and neutral
- **Light Gray**: Subtle emphasis, softer than default
- **Lilac**: Special announcements, feature highlights
- **Green**: Primary brand messaging, featured content
- **Gray**: Secondary content, less prominent sections
- **Image**: Hero sections, high-impact visuals

### Content Guidelines

- **Heading**: Keep concise (1-2 short lines), use sentence case
- **Subheading**: Provide context (2-3 lines max), complete sentences
- **Buttons**: Use action-oriented labels ("Get Started" not "Click Here")
- **Button Count**: Primary for main action, tertiary for secondary action

### Image Guidelines

- Minimum recommended resolution: 1920x600px for sharp display
- Use images with clear focal points on the left/center
- **Text Color Selection**:
  - Use `textColor="white"` (default) for dark or colorful images
  - Use `textColor="black"` for light or bright images
  - Text color remains fixed across both light and dark modes
- Ensure sufficient contrast between image and text
- Test with the automatic gradient overlay (dark for white text, light for black text)

## Files

- `CalloutMediaBanner.tsx` - Component implementation
- `CalloutMediaBanner.scss` - Styles with color variants and responsive breakpoints
- `index.ts` - Barrel exports
- `README.md` - This documentation

## Related Components

- **Button**: Used for primary and tertiary action buttons
- **PageGrid**: Used internally for grid structure and wide container support

## Design References

- **Figma Design**: [Callout - Media Banner](https://www.figma.com/design/i4OuOX6QSBauMaJE4iY4kV/Callout---Media-Banner?node-id=1-2&m=dev)
- **Showcase Page**: `/about/callout-media-banner-showcase.page.tsx`
- **Component Location**: `shared/patterns/CalloutMediaBanner/`

## Version History

- Initial implementation: January 2026
- Figma design alignment with 5 color variants + image support
- Responsive typography and spacing
- Automatic button color selection
- Vertical centering for text-only banners

