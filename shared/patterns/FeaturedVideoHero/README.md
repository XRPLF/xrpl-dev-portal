# FeaturedVideoHero Pattern

A page-level hero pattern featuring a headline, optional subtitle, call-to-action buttons, and a featured video. The video uses native HTML `<video>` props and is displayed in a responsive two-column layout with content on the left and video on the right.

## Overview

The FeaturedVideoHero component provides a structured hero section with:

- Responsive two-column layout (content left, video right) that stacks on smaller screens
- Required headline and video; optional subtitle and call-to-action buttons
- Design-constrained CTAs: primary and optional secondary, with variant and color set by the component
- Development-time validation: returns `null` when required props are missing and logs warnings in development/test

## Basic Usage

```tsx
import { FeaturedVideoHero } from "shared/patterns/FeaturedVideoHero";

function MyPage() {
  return (
    <FeaturedVideoHero
      headline="Build on XRPL"
      subtitle={
        <p>
          Issue, manage, and trade real-world assets without needing to build
          smart contracts.
        </p>
      }
      callsToAction={[{ children: "Get Started", href: "/docs" }]}
      videoElement={{
        src: "/video/intro.mp4",
        autoPlay: true,
        loop: true,
        muted: true,
        playsInline: true,
      }}
    />
  );
}
```

## Props

| Prop            | Type                              | Required | Description                                                                  |
| --------------- | --------------------------------- | -------- | ---------------------------------------------------------------------------- |
| `headline`      | `React.ReactNode`                 | Yes      | Hero headline text (h-md typography)                                         |
| `subtitle`      | `React.ReactNode`                 | No       | Hero subtitle content                                                        |
| `callsToAction` | `DesignConstrainedCallsToActions` | No       | Array with primary CTA and optional secondary CTA. Omit to hide CTA section. |
| `videoElement`  | `DesignConstrainedVideoProps`     | Yes      | Native `<video>` element props (e.g. `src`, `autoPlay`, `loop`, `muted`)     |
| `className`     | `string`                          | No       | Additional CSS classes for the header element                                |
| `...rest`       | `HTMLHeaderElement` attributes    | No       | Any other HTML header attributes                                             |

### Calls to Action

The `callsToAction` prop is optional. When provided, at least one non-empty CTA is required to show the CTA section. The component uses design-constrained Button props; `variant` and `color` are set automatically:

- **Primary CTA**: `variant="primary"`, `color="green"`, `forceColor={true}`
- **Secondary CTA**: `variant="tertiary"`, `color="green"`, `forceColor={true}`

All other Button props are supported (e.g., `children`, `href`, `onClick`). Do not pass `variant` or `color` in the CTA objects.

### Video Element

`videoElement` accepts native HTML video element props. Required and commonly used props:

- `src` (required) – Video URL
- `autoPlay`, `loop`, `muted`, `playsInline` – Typical for background/hero autoplay
- `controls`, `preload`, `poster` – Optional; use for user-controlled playback

The video is rendered with `object-fit: cover` and a 16:9 aspect ratio container.

## Examples

### With primary and secondary CTAs

```tsx
<FeaturedVideoHero
  headline="Real-world asset tokenization"
  subtitle="Learn how to issue crypto tokens and build tokenization solutions."
  callsToAction={[
    { children: "Get Started", href: "/docs" },
    { children: "Learn More", href: "/about" },
  ]}
  videoElement={{
    src: "/video/tokenization.mp4",
    autoPlay: true,
    loop: true,
    muted: true,
    playsInline: true,
  }}
/>
```

### Without subtitle

```tsx
<FeaturedVideoHero
  headline="Headline Only"
  callsToAction={[{ children: "Get Started", href: "/docs" }]}
  videoElement={{
    src: "/video/intro.mp4",
    autoPlay: true,
    loop: true,
    muted: true,
    playsInline: true,
  }}
/>
```

### With video controls

```tsx
<FeaturedVideoHero
  headline="Watch and Learn"
  subtitle="Explore our video tutorials and guides."
  callsToAction={[{ children: "Watch Tutorials", href: "/tutorials" }]}
  videoElement={{
    src: "/video/intro.mp4",
    autoPlay: false,
    loop: true,
    muted: true,
    playsInline: true,
    controls: true,
    preload: "metadata",
  }}
/>
```

## Validation

- **Required props**: `headline`, `videoElement`. If either is missing or empty, the component returns `null` and (in development/test) logs a console warning.
- **Optional props**: `subtitle`, `callsToAction`. Omit `callsToAction` or pass an array with no renderable CTAs to hide the CTA section.

## Responsive Behavior

- **Mobile / small screens**: Content and video stack vertically; video appears below the content block with top margin.
- **Large (lg+)**: Two-column layout: content (5 cols) on the left, video (6 cols, offset 1) on the right. Video container uses 16:9 aspect ratio and `object-fit: cover`.

## CSS Classes

- `bds-featured-video-hero` – Root header element
- `bds-featured-video-hero__content` – Content column (headline, subtitle, CTAs)
- `bds-featured-video-hero__title` – Headline (`h1`)
- `bds-featured-video-hero__subtitle` – Subtitle row
- `bds-featured-video-hero__subtitle-col` – Subtitle column
- `bds-featured-video-hero__cta-buttons` – CTA buttons wrapper
- `bds-featured-video-hero__video-container` – Video wrapper (16:9)
- `bds-featured-video-hero__video` – Video element

## Best Practices

1. **Video format**: Use MP4 with H.264 for broad compatibility; keep file sizes reasonable for fast loading.
2. **Autoplay**: Use `muted` and `playsInline` with `autoPlay` for reliable autoplay on mobile.
3. **CTAs**: Keep CTA text concise and action-oriented; primary CTA should be the main action.
4. **Headlines**: Keep headlines concise; use the subtitle for additional context.
5. **Accessibility**: Provide an `aria-label` (or other accessible name) on the video when it conveys meaningful content.

## Showcase

An interactive showcase with more examples and prop documentation is available at:

- **Showcase page**: `/about/featured-video-hero-showcase.page.tsx`
