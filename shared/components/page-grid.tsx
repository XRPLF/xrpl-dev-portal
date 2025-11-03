import React from "react";
import clsx from "clsx";

type PageGridElementProps = React.HTMLAttributes<HTMLDivElement>;
type PageGridBreakpoint = "base" | "sm" | "md" | "lg" | "xl";
type ResponsiveValue<T> = T | Partial<Record<PageGridBreakpoint, T>>;

export interface PageGridProps extends PageGridElementProps {}

export interface PageGridRowProps extends PageGridElementProps {}

type PageGridSpanValue = number | "auto" | "fill";
type PageGridOffsetValue = number;

export interface PageGridColProps extends PageGridElementProps {
  span?: ResponsiveValue<PageGridSpanValue>;
  offset?: ResponsiveValue<PageGridOffsetValue>;
}

const breakpointKeys: Array<Exclude<PageGridBreakpoint, "base">> = ["sm", "md", "lg", "xl"];

const classForSpan = (prefix: string | null, value: PageGridSpanValue) => {
  if (value === "auto") {
    return prefix ? `xrpl-grid__col-${prefix}-auto` : "xrpl-grid__col-auto";
  }

  if (value === "fill") {
    return prefix ? `xrpl-grid__col-${prefix}` : "xrpl-grid__col";
  }

  return prefix ? `xrpl-grid__col-${prefix}-${value}` : `xrpl-grid__col-${value}`;
};

const classForOffset = (prefix: string | null, value: PageGridOffsetValue) => {
  return prefix ? `xrpl-grid__offset-${prefix}-${value}` : `xrpl-grid__offset-${value}`;
};

const PageGridRoot = React.forwardRef<HTMLDivElement, PageGridProps>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={clsx("xrpl-grid__container", className)} {...rest} />
  )
);

PageGridRoot.displayName = "PageGrid";

const PageGridRow = React.forwardRef<HTMLDivElement, PageGridRowProps>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={clsx("xrpl-grid__row", className)} {...rest} />
  )
);

PageGridRoot.displayName = "PageGrid";

const PageGridCol = React.forwardRef<HTMLDivElement, PageGridColProps>((props, ref) => {
  const { className, span, offset, ...rest } = props;
  const spanClasses: string[] = [];
  const offsetClasses: string[] = [];

  if (typeof span === "number" || typeof span === "string") {
    spanClasses.push(classForSpan(null, span as PageGridSpanValue));
  } else if (span && typeof span === "object") {
    const baseSpan = "base" in span ? span.base : undefined;

    if (baseSpan) {
      spanClasses.push(classForSpan(null, baseSpan));
    }

    breakpointKeys.forEach((key) => {
      const value = span[key];

      if (value) {
        spanClasses.push(classForSpan(key, value));
      }
    });
  }

  if (typeof offset === "number") {
    offsetClasses.push(classForOffset(null, offset));
  } else if (offset && typeof offset === "object") {
    const baseOffset = "base" in offset ? offset.base : undefined;

    if (baseOffset !== undefined) {
      offsetClasses.push(classForOffset(null, baseOffset));
    }

    breakpointKeys.forEach((key) => {
      const value = offset[key];

      if (value !== undefined) {
        offsetClasses.push(classForOffset(key, value));
      }
    });
  }

  return (
    <div
      ref={ref}
      className={clsx("xrpl-grid__col", className, spanClasses, offsetClasses)}
      {...rest}
    />
  );
});

PageGridCol.displayName = "PageGridCol";

type PageGridComponent = typeof PageGridRoot & {
  Row: typeof PageGridRow;
  Col: typeof PageGridCol;
};

export const PageGrid = PageGridRoot as PageGridComponent;

PageGrid.Row = PageGridRow;
PageGrid.Col = PageGridCol;

export { PageGridRow, PageGridCol };


