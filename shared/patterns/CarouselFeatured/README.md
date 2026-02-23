# CarouselFeatured

A featured image carousel pattern with a two-column layout on desktop (image left, content right) and single-column layout on tablet/mobile (content top, image bottom). Features a heading, feature list with dividers, optional buttons, and navigation controls.

## Usage

```tsx
import { CarouselFeatured } from '@/shared/patterns/CarouselFeatured';

<CarouselFeatured
  heading="Powered by Developers"
  features={[
    { title: "Easy-to-Integrate APIs", description: "Build with common languages..." },
    { title: "Full Lifecycle Support", description: "From dev tools to deployment..." },
  ]}
  buttons={[
    { label: "Get Started", href: "/docs" },
    { label: "Learn More", href: "/about" }
  ]}
  slides={[
    { id: 1, imageSrc: '/image1.jpg', imageAlt: 'Slide 1' },
    { id: 2, imageSrc: '/image2.jpg', imageAlt: 'Slide 2' },
  ]}
  background="grey"
/>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `heading` | `string` | Heading text displayed at the top of the content area |
| `features` | `CarouselFeatureItem[]` | Array of feature items with title and description |
| `slides` | `CarouselSlide[]` | Array of slides to display in the carousel |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `buttons` | `ButtonConfig[]` | `undefined` | Array of button configurations (1-2 buttons supported, uses ButtonGroup) |
| `background` | `'grey' \| 'neutral' \| 'yellow'` | `'grey'` | Background color variant |

## Type Definitions

### CarouselSlide

```tsx
interface CarouselSlide {
  id: string | number;  // Unique identifier for the slide
  imageSrc: string;     // Image source URL
  imageAlt: string;     // Alt text for the image
}
```

### CarouselFeatureItem

```tsx
interface CarouselFeatureItem {
  title: string;        // Feature title
  description: string;  // Feature description
}
```

### ButtonConfig

```tsx
interface ButtonConfig {
  label: string;        // Button text
  href?: string;        // Optional link URL
  onClick?: () => void; // Optional click handler
  forceColor?: boolean; // Force button color override
}
```

## Background Variants

The component supports three background variants that adapt to light/dark mode:

- **`grey`** (default): Light mode: gray-200 (#E6EAF0), Dark mode: gray-300 (#CAD4DF)
- **`neutral`**: Light mode: white (#FFF), Dark mode: black (#141414)
- **`yellow`**: Light mode: yellow-100 (#F3F1EB), Dark mode: yellow-100 (#F3F1EB)

## Features

- **Responsive Layout**: Two-column on desktop (lg+), single-column on mobile/tablet
- **Image Carousel**: Navigate through multiple slides with prev/next buttons
- **Auto-hide Navigation**: Navigation buttons automatically hide when only one slide is present
- **Feature List**: Display multiple features with dividers
- **Button Group**: Supports 1-2 buttons with validation
- **Background Variants**: Three color options with light/dark mode support
- **Accessibility**: Proper ARIA labels for navigation buttons

## Layout Behavior

### Desktop (lg+)
- Image column on the left (6 columns)
- Content column on the right (6 columns)
- Navigation buttons in header (desktop variant)

### Tablet/Mobile
- Content section at the top
- Image section at the bottom
- Navigation buttons in CTA section (mobile variant)

## Examples

See the [showcase page](../../../about/carousel-featured-showcase.page.tsx) for live examples with different configurations.

## Notes

- Navigation buttons are automatically hidden when `slides.length === 1`
- Buttons are validated using `validateButtonGroup` with a maximum of 2 buttons
- Button colors are automatically adjusted based on the background variant
- The component uses `ButtonGroup` pattern for consistent button styling

