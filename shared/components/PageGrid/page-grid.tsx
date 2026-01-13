import React from "react";
import clsx from "clsx";

type PageGridElementProps = React.HTMLAttributes<HTMLDivElement>;

// Define the standard PageGrid breakpoints
type PageGridBreakpoint = "base" | "sm" | "md" | "lg" | "xl";

// Define the ResponsiveValue type using Partial<Record> for breakpoints
type ResponsiveValue<T> = T | Partial<Record<PageGridBreakpoint, T>>;

export interface PageGridProps extends PageGridElementProps {
  /** Enable wide container layout at xl breakpoint (1504px max-width, 144px padding) */
  containerWide?: boolean;
}

export interface PageGridRowProps extends PageGridElementProps {}

type PageGridSpanValue = number | "auto" | "fill";
type PageGridOffsetValue = number;

export interface PageGridColProps extends PageGridElementProps {
  span?: ResponsiveValue<PageGridSpanValue>;
  offset?: ResponsiveValue<PageGridOffsetValue>;
}

// Keys used for iteration and generating responsive class prefixes
const breakpointKeys: Array<Exclude<PageGridBreakpoint, "base">> = ["sm", "md", "lg", "xl"];

/**
 * Helper function to construct the column span CSS class string.
 * This function relies on the corresponding classes being pre-generated in SCSS.
 * @param prefix The breakpoint prefix (e.g., 'md' or null for base).
 * @param value The span value (number, "auto", or "fill").
 * @returns The full CSS class string.
 */
const classForSpan = (prefix: string | null, value: PageGridSpanValue): string => {
  const prefixStr = prefix ? `-${prefix}` : "";

  if (value === "auto") {
    // Generates bds-grid__col-auto or bds-grid__col-md-auto
    return `bds-grid__col${prefixStr}-auto`;
  }

  if (value === "fill") {
    // Generates bds-grid__col-fill or bds-grid__col-md-fill
    // This allows us to distinguish between "no span" and "span='fill'" in CSS
    return `bds-grid__col${prefixStr}-fill`;
  }

  // Generates bds-grid__col-6 or bds-grid__col-md-6
  return `bds-grid__col${prefixStr}-${value}`;
};

/**
 * Helper function to construct the column offset CSS class string.
 * This function relies on the corresponding classes being pre-generated in SCSS.
 * @param prefix The breakpoint prefix (e.g., 'md' or null for base).
 * @param value The offset value (number).
 * @returns The full CSS class string.
 */
const classForOffset = (prefix: string | null, value: PageGridOffsetValue): string => {
  const prefixStr = prefix ? `-${prefix}` : "";
  // Generates bds-grid__offset-2 or bds-grid__offset-md-2
  return `bds-grid__offset${prefixStr}-${value}`;
};


// --- PageGrid Root Component ---
const PageGridRoot = React.forwardRef<HTMLDivElement, PageGridProps>(
  ({ className, containerWide, ...rest }, ref) => (
    <div 
      ref={ref} 
      className={clsx(
        "bds-grid__container",
        containerWide && "bds-grid__container--wide",
        className
      )} 
      {...rest} 
    />
  )
);

PageGridRoot.displayName = "PageGrid";


// --- PageGrid.Row Component ---
const PageGridRow = React.forwardRef<HTMLDivElement, PageGridRowProps>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={clsx("bds-grid__row", className)} {...rest} />
  )
);

PageGridRow.displayName = "PageGridRow"; // Renamed display name for clarity

// --- PageGrid.Col Component ---
const PageGridCol = React.forwardRef<HTMLDivElement, PageGridColProps>((props, ref) => {
  const { className, span, offset, ...rest } = props;
  const spanClasses: string[] = [];
  const offsetClasses: string[] = [];

  // --- Span Logic ---
  if (typeof span === "number" || typeof span === "string") {
    // Handles fixed/base span={6} or span="auto"
    spanClasses.push(classForSpan(null, span as PageGridSpanValue));
  } else if (span && typeof span === "object") {
    // Handles base breakpoint (no prefix)
    const baseSpan = "base" in span ? span.base : undefined;

    if (baseSpan) {
      spanClasses.push(classForSpan(null, baseSpan));
    } else {
      // If no base span is provided, default to full width (4 columns for base breakpoint)
      // This ensures columns are full width on mobile when only larger breakpoints are specified
      spanClasses.push(classForSpan(null, 4));
    }

    // Handles sm, md, lg, xl breakpoints (with prefix)
    breakpointKeys.forEach((key) => {
      const value = span[key];

      if (value) {
        // Generates classes like bds-grid__col-md-6
        spanClasses.push(classForSpan(key, value));
      }
    });
  }

  // --- Offset Logic ---
  if (typeof offset === "number") {
    // Handles fixed offset={2}
    offsetClasses.push(classForOffset(null, offset));
  } else if (offset && typeof offset === "object") {
    // Handles base offset (no prefix)
    const baseOffset = "base" in offset ? offset.base : undefined;

    if (baseOffset !== undefined) {
      offsetClasses.push(classForOffset(null, baseOffset));
    }

    // Handles sm, md, lg, xl offsets (with prefix)
    breakpointKeys.forEach((key) => {
      const value = offset[key];

      if (value !== undefined) {
        // Generates classes like bds-grid__offset-md-3
        offsetClasses.push(classForOffset(key, value));
      }
    });
  }

  // Ensure the base class is always applied for styling
  return (
    <div
      ref={ref}
      // Note: Added "bds-grid__col" base class for consistent column initialization
      className={clsx("bds-grid__col", className, spanClasses, offsetClasses)} 
      {...rest}
    />
  );
});

PageGridCol.displayName = "PageGridCol";


// --- Component Composition ---
type PageGridComponent = typeof PageGridRoot & {
  Row: typeof PageGridRow;
  Col: typeof PageGridCol;
};

export const PageGrid = PageGridRoot as PageGridComponent;

PageGrid.Row = PageGridRow;
PageGrid.Col = PageGridCol;

export { PageGridRow, PageGridCol };


