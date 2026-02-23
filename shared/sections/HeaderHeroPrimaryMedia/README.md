# HeaderHeroPrimaryMedia Pattern

A page-level hero pattern featuring a headline, subtitle, call-to-action buttons, and a primary media element. Supports images, videos, or custom React elements with enforced aspect ratios and object-fit constraints.

## Overview

The HeaderHeroPrimaryMedia component provides a structured hero section with:

- Responsive headline and subtitle layout
- Primary and optional secondary call-to-action buttons
- Media element (image, video, or custom) with responsive aspect ratios
- Development-time validation warnings

## Basic Usage

```tsx
import HeaderHeroPrimaryMedia from "shared/sections/HeaderHeroPrimaryMedia/HeaderHeroPrimaryMedia";

function MyPage() {
  return (
    <HeaderHeroPrimaryMedia
      headline="Build on XRPL"
      subtitle="Start developing today with our comprehensive developer tools."
      links={[{ label: "Get Started", href: "/docs" }]}
      media={{
        type: "image",
        src: "/img/hero.png",
        alt: "XRPL Development",
      }}
    />
  );
}
```

## Props

| Prop            | Type                           | Required | Description                                                  |
| --------------- | ------------------------------ | -------- | ------------------------------------------------------------ |
| `headline`      | `React.ReactNode`              | Yes      | Hero headline text (display-md typography)                   |
| `subtitle`      | `React.ReactNode`              | Yes      | Hero subtitle text (label-l typography)                      |
| `links`        | `DesignConstrainedLink[]`     | No       | Array of `{ label, href }` for ButtonGroup                   |
| `media`         | `HeaderHeroMedia`              | Yes      | Media element (image, video, or custom)                      |
| `className`     | `string`                       | No       | Additional CSS classes for the header element                |
| `...rest`       | `HTMLHeaderElement attributes` | No       | Any other HTML header attributes                             |

### Links (ButtonGroup)

The `links` prop accepts an array of `{ label, href }` objects for consistent ButtonGroup rendering; `variant` and `color` are set by the component:

- **First link**: `variant="primary"`, `color="green"`
- **Second link**: `variant="tertiary"`, `color="green"`
- Max 2 links supported (ButtonGroup validation)

## Media Types

The `media` prop accepts a discriminated union of three types:

### Image Media

```tsx
media={{
  type: "image",
  src: string,        // Required
  alt: string,        // Required
  // ... all native <img> props except className and style
}}
```

**Example:**

```tsx
media={{
  type: "image",
  src: "/img/hero.png",
  alt: "Hero image",
  loading: "lazy",
  decoding: "async"
}}
```

### Video Media

```tsx
media={{
  type: "video",
  src: string,        // Required
  alt?: string,       // Optional but recommended
  // ... all native <video> props except className and style
}}
```

**Example:**

```tsx
media={{
  type: "video",
  src: "/video/intro.mp4",
  alt: "Introduction video",
  autoPlay: true,
  loop: true,
  muted: true,
  playsInline: true
}}
```

### Custom Element Media

```tsx
media={{
  type: "custom",
  element: React.ReactElement  // Required
}}
```

**Example:**

```tsx
media={{
  type: "custom",
  element: <MyAnimationComponent />
}}
```

## Examples

### With Secondary CTA

```tsx
<HeaderHeroPrimaryMedia
  headline="Real-world asset tokenization"
  subtitle="Learn how to issue crypto tokens and build solutions."
  links={[
    { label: "Get Started", href: "/docs" },
    { label: "Learn More", href: "/about" },
  ]}
  media={{
    type: "image",
    src: "/img/tokenization.png",
    alt: "Tokenization",
  }}
/>
```

### Video Media

```tsx
<HeaderHeroPrimaryMedia
  headline="Watch and Learn"
  subtitle="Explore our video tutorials."
  links={[{ label: "Watch Tutorials", href: "/tutorials" }]}
  media={{
    type: "video",
    src: "/video/intro.mp4",
    alt: "Introduction video",
    autoPlay: true,
    loop: true,
    muted: true,
  }}
/>
```

### Custom Element

```tsx
<HeaderHeroPrimaryMedia
  headline="Interactive Experience"
  subtitle="Engage with custom media."
  links={[{ label: "Explore", href: "/interactive" }]}
  media={{
    type: "custom",
    element: <MyAnimationComponent />,
  }}
/>
```

## Design Constraints

The component enforces specific design requirements:

- **Aspect Ratios**: Media maintains responsive aspect ratios:
  - Base: `16:9`
  - Medium (md+): `2:1`
  - Large (lg+): `3:1`
- **Object Fit**: All media uses `object-fit: cover` to fill the container
- **Type Safety**: TypeScript discriminated unions ensure type-safe media selection

## Validation

The component includes development-time validation that logs warnings to the console when required props are missing:

- Missing `headline`: Component returns `null` (error logged)
- Missing `subtitle`, `links`, or `media`: Warning logged, component still renders

## CSS Classes

The component generates the following CSS classes:

- `bds-header-hero-primary-media` - Root header element
- `bds-header-hero-primary-media__headline` - Headline container
- `bds-header-hero-primary-media__subtitle` - Subtitle element
- `bds-header-hero-primary-media__cta-container` - CTA container
- `bds-header-hero-primary-media__cta-buttons` - CTA buttons wrapper
- `bds-header-hero-primary-media__media-container` - Media container
- `bds-header-hero-primary-media__media-element` - Media element

## Best Practices

1. **Media Selection**: Choose media that works well with the responsive aspect ratios (16:9 base, 2:1 md+, 3:1 lg+)
2. **Alt Text**: Always provide meaningful alt text for images and videos
3. **Performance**: Use `loading="lazy"` for images below the fold
4. **CTAs**: Keep CTA text concise and action-oriented
5. **Headlines**: Keep headlines concise and impactful
