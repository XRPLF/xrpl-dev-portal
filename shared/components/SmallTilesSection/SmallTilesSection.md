# SmallTilesSection Component

A section component that displays multiple CardIcon components in a responsive grid layout. This component is tightly coupled to CardIcon and creates a grouping of card icons with consistent styling and behavior.

## Overview

The SmallTilesSection component provides:

- Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)
- Automatic spacer optimization for small card sets (≤8 cards)
- Consistent variant application across all cards
- Semantic HTML structure with proper accessibility

## Basic Usage

```tsx
import { SmallTilesSection } from "@/shared/components/SmallTilesSection/SmallTilesSection";

function MyComponent() {
  const cards = [
    {
      icon: "/icons/javascript.svg",
      iconAlt: "JavaScript",
      label: "JavaScript",
      href: "/docs/javascript",
    },
    {
      icon: "/icons/python.svg",
      iconAlt: "Python",
      label: "Python",
      href: "/docs/python",
    },
  ];

  return (
    <SmallTilesSection
      headline="Language Tutorials"
      subtitle="Choose a language to get started"
      cardVariant="neutral"
      cards={cards}
    />
  );
}
```

## Props

| Prop          | Type                            | Required | Description                                         |
| ------------- | ------------------------------- | -------- | --------------------------------------------------- |
| `headline`    | `React.ReactNode`               | Yes      | Section headline displayed as h2                    |
| `subtitle`    | `React.ReactNode`               | No       | Optional subtitle text displayed below headline     |
| `cardVariant` | `'neutral' \| 'green'`          | Yes      | Color variant applied to all cards in the section   |
| `cards`       | `CardIconProps[]`               | Yes      | Array of card configurations (without variant prop) |
| `className`   | `string`                        | No       | Additional CSS classes for the section element      |
| `...rest`     | `HTMLSectionElement attributes` | No       | Any other HTML section element attributes           |

## Card Props

Each item in the `cards` array accepts all CardIcon props except `variant` (which is controlled by `cardVariant`):

| Prop        | Type         | Required | Description                           |
| ----------- | ------------ | -------- | ------------------------------------- |
| `icon`      | `string`     | Yes      | Icon image source (URL or path)       |
| `iconAlt`   | `string`     | No       | Alt text for the icon image           |
| `label`     | `string`     | Yes      | Card label text                       |
| `href`      | `string`     | No       | Link destination (renders as `<a>`)   |
| `onClick`   | `() => void` | No       | Click handler (renders as `<button>`) |
| `disabled`  | `boolean`    | No       | Disabled state                        |
| `className` | `string`     | No       | Additional CSS classes                |

## Examples

### Basic Usage with Links

```tsx
<SmallTilesSection
  headline="Development Tools"
  subtitle="Explore our available tools"
  cardVariant="neutral"
  cards={[
    { icon: "/icons/js.svg", label: "xrpl.js", href: "/docs/xrpl-js" },
    { icon: "/icons/py.svg", label: "xrpl-py", href: "/docs/xrpl-py" },
    { icon: "/icons/go.svg", label: "xrpl-go", href: "/docs/xrpl-go" },
  ]}
/>
```

### Without Subtitle

```tsx
<SmallTilesSection headline="Quick Links" cardVariant="neutral" cards={cards} />
```

### Green Variant

```tsx
<SmallTilesSection
  headline="Featured Topics"
  subtitle="Recommended content to help you get started"
  cardVariant="green"
  cards={featuredCards}
/>
```

### Mixed Card States

Cards can have different interaction types within the same section:

```tsx
<SmallTilesSection
  headline="Mixed States Example"
  cardVariant="neutral"
  cards={[
    { icon: "/icon.svg", label: "Link Card", href: "/link" },
    { icon: "/icon.svg", label: "Button Card", onClick: () => handleClick() },
    { icon: "/icon.svg", label: "Disabled Card", disabled: true },
  ]}
/>
```

### Large Card Set (Spacer Feature)

When a section contains more than 8 cards, the component automatically adjusts the layout:

```tsx
<SmallTilesSection
  headline="All Topics"
  subtitle={`${largeCardSet.length} topics available`}
  cardVariant="neutral"
  cards={largeCardSet} // 9+ cards
/>
```

## Responsive Behavior

The grid automatically adjusts based on viewport width:

| Breakpoint             | Columns | Layout              |
| ---------------------- | ------- | ------------------- |
| Mobile (< 576px)       | 1       | Single column stack |
| Tablet (576px - 991px) | 2       | Two column grid     |
| Desktop (≥ 992px)      | 3       | Three column grid   |

### Spacer Feature

When card count is ≤8, the component uses a centered 2-column layout on large screens with automatic spacing. This ensures optimal visual alignment for smaller card sets.

## TypeScript Types

```typescript
interface SmallTilesSectionProps
  extends React.ComponentPropsWithoutRef<"section"> {
  headline: React.ReactNode;
  subtitle?: React.ReactNode;
  cardVariant: "neutral" | "green";
  cards: readonly Omit<CardIconProps, "variant">[];
}

// CardIconProps (without variant)
interface ConstrainedCardIconProps {
  icon: string;
  iconAlt?: string;
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}
```

## Best Practices

1. **Consistent Variants**: Use the same `cardVariant` for all cards in a section to maintain visual consistency
2. **Stable Keys**: Cards with `href` or `label` properties will generate stable keys automatically
3. **Empty Arrays**: Component returns `null` if cards array is empty - no need to conditionally render
4. **Accessibility**: Ensure `iconAlt` is provided for meaningful icons to improve screen reader support
5. **Semantic Structure**: The component uses semantic HTML (`<section>`, `<h2>`, `<ul>`) for proper document structure

## Notes

- The component is tightly coupled to `CardIcon` - all cards must use CardIcon props
- All cards in a section share the same `variant` for visual consistency
- The spacer feature (≤8 cards) only affects large screen layouts
- Component forwards refs, allowing you to attach refs to the section element
- Cards are memoized individually to optimize re-render performance
