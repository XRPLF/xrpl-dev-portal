# PageGrid Component

A responsive grid system component for creating flexible layouts with support for multiple breakpoints.

## Overview

The PageGrid component provides a flexible grid layout system with three main components:
- `PageGrid` - The container component
- `PageGrid.Row` - Row component for grouping columns
- `PageGrid.Col` - Column component with responsive sizing and offset support

## Breakpoints

The grid system supports the following breakpoints:
- `base` - Default/mobile (applies to all sizes)
- `sm` - Small screens
- `md` - Medium screens
- `lg` - Large screens
- `xl` - Extra large screens

## Basic Usage

```tsx
import { PageGrid } from '@/shared/components/PageGrid/page-grid';

function MyComponent() {
  return (
    <PageGrid>
      <PageGrid.Row>
        <PageGrid.Col span={6}>
          Column 1
        </PageGrid.Col>
        <PageGrid.Col span={6}>
          Column 2
        </PageGrid.Col>
      </PageGrid.Row>
    </PageGrid>
  );
}
```

## PageGrid Props

The root `PageGrid` component accepts all standard HTML div attributes:

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes to apply |
| `...rest` | `HTMLDivElement attributes` | Any other HTML div attributes |

## PageGrid.Row Props

The `PageGrid.Row` component accepts all standard HTML div attributes:

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes to apply |
| `...rest` | `HTMLDivElement attributes` | Any other HTML div attributes |

## PageGrid.Col Props

| Prop | Type | Description |
|------|------|-------------|
| `span` | `number \| "auto" \| "fill" \| ResponsiveValue` | Column span width |
| `offset` | `number \| ResponsiveValue` | Column offset (left margin) |
| `className` | `string` | Additional CSS classes to apply |
| `...rest` | `HTMLDivElement attributes` | Any other HTML div attributes |

### Span Values

- **Number** (e.g., `1-12`): Fixed column width
- **"auto"**: Column takes up only the space it needs
- **"fill"**: Column fills remaining available space
- **Responsive Object**: Different spans for different breakpoints

### Offset Values

- **Number** (e.g., `1-12`): Number of columns to offset
- **Responsive Object**: Different offsets for different breakpoints

## Examples

### Fixed Column Widths

```tsx
<PageGrid>
  <PageGrid.Row>
    <PageGrid.Col span={4}>Sidebar</PageGrid.Col>
    <PageGrid.Col span={8}>Main Content</PageGrid.Col>
  </PageGrid.Row>
</PageGrid>
```

### Auto and Fill

```tsx
<PageGrid>
  <PageGrid.Row>
    <PageGrid.Col span="auto">Minimal Width</PageGrid.Col>
    <PageGrid.Col span="fill">Takes Remaining Space</PageGrid.Col>
    <PageGrid.Col span="auto">Another Auto</PageGrid.Col>
  </PageGrid.Row>
</PageGrid>
```

### Responsive Layout

Create layouts that adapt to different screen sizes:

```tsx
<PageGrid>
  <PageGrid.Row>
    <PageGrid.Col 
      span={{
        base: 12,    // Full width on mobile
        sm: 12,      // Full width on small screens
        md: 6,       // Half width on medium screens
        lg: 4,       // Third width on large screens
        xl: 3        // Quarter width on extra large screens
      }}
    >
      Responsive Column
    </PageGrid.Col>
  </PageGrid.Row>
</PageGrid>
```

### Using Offsets

Center content or create spacing with offsets:

```tsx
<PageGrid>
  <PageGrid.Row>
    {/* Center an 8-column element */}
    <PageGrid.Col span={8} offset={2}>
      Centered Content
    </PageGrid.Col>
  </PageGrid.Row>
</PageGrid>
```

### Responsive Offsets

```tsx
<PageGrid>
  <PageGrid.Row>
    <PageGrid.Col 
      span={6}
      offset={{
        base: 0,     // No offset on mobile
        md: 3        // Offset by 3 columns on medium+ screens
      }}
    >
      Content
    </PageGrid.Col>
  </PageGrid.Row>
</PageGrid>
```

### Complex Responsive Layout

```tsx
<PageGrid>
  <PageGrid.Row>
    {/* Hero section */}
    <PageGrid.Col span={12}>
      <h1>Page Title</h1>
    </PageGrid.Col>
  </PageGrid.Row>
  
  <PageGrid.Row>
    {/* Sidebar - full width on mobile, 1/3 on desktop */}
    <PageGrid.Col 
      span={{
        base: 12,
        lg: 4
      }}
    >
      <aside>Sidebar</aside>
    </PageGrid.Col>
    
    {/* Main content - full width on mobile, 2/3 on desktop */}
    <PageGrid.Col 
      span={{
        base: 12,
        lg: 8
      }}
    >
      <main>Main Content</main>
    </PageGrid.Col>
  </PageGrid.Row>
</PageGrid>
```

### Multiple Columns with Equal Width

```tsx
<PageGrid>
  <PageGrid.Row>
    <PageGrid.Col span={3}>Column 1</PageGrid.Col>
    <PageGrid.Col span={3}>Column 2</PageGrid.Col>
    <PageGrid.Col span={3}>Column 3</PageGrid.Col>
    <PageGrid.Col span={3}>Column 4</PageGrid.Col>
  </PageGrid.Row>
</PageGrid>
```

### Nested Grids

```tsx
<PageGrid>
  <PageGrid.Row>
    <PageGrid.Col span={12}>
      <PageGrid>
        <PageGrid.Row>
          <PageGrid.Col span={6}>Nested Column 1</PageGrid.Col>
          <PageGrid.Col span={6}>Nested Column 2</PageGrid.Col>
        </PageGrid.Row>
      </PageGrid>
    </PageGrid.Col>
  </PageGrid.Row>
</PageGrid>
```

## CSS Classes Generated

The component generates the following CSS classes:

### Container
- `xrpl-grid__container`

### Row
- `xrpl-grid__row`

### Column Spans
- `xrpl-grid__col-{number}` (e.g., `xrpl-grid__col-6`)
- `xrpl-grid__col-auto`
- `xrpl-grid__col` (for fill)
- `xrpl-grid__col-{breakpoint}-{number}` (e.g., `xrpl-grid__col-md-6`)
- `xrpl-grid__col-{breakpoint}-auto`
- `xrpl-grid__col-{breakpoint}` (for fill)

### Column Offsets
- `xrpl-grid__offset-{number}` (e.g., `xrpl-grid__offset-2`)
- `xrpl-grid__offset-{breakpoint}-{number}` (e.g., `xrpl-grid__offset-md-2`)

## TypeScript Types

```typescript
type PageGridBreakpoint = "base" | "sm" | "md" | "lg" | "xl";
type ResponsiveValue<T> = T | Partial<Record<PageGridBreakpoint, T>>;
type PageGridSpanValue = number | "auto" | "fill";
type PageGridOffsetValue = number;

interface PageGridColProps {
  span?: ResponsiveValue<PageGridSpanValue>;
  offset?: ResponsiveValue<PageGridOffsetValue>;
  className?: string;
  // ... plus all HTMLDivElement attributes
}
```

## Best Practices

1. **Use semantic HTML**: Wrap content in appropriate semantic elements within columns
2. **Mobile-first**: Start with base/mobile layout and progressively enhance for larger screens
3. **Keep it simple**: Avoid overly complex nested grid structures when possible
4. **Test responsiveness**: Verify layouts work well at all breakpoint transitions
5. **Accessibility**: Ensure grid layouts maintain logical reading order for screen readers

## Notes

- The total columns in the grid system is typically 12 (though this depends on your CSS implementation)
- Responsive values cascade - if you don't specify a value for a breakpoint, it inherits from the previous breakpoint
- All components forward refs, allowing you to attach refs to the underlying DOM elements

