import React from "react";
import clsx from "clsx";

export type PageWrapperProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * PageWrapper
 *
 * Top-level layout wrapper for BDS-2026 marketing pages. Stacks its section
 * children vertically with responsive inter-section spacing (24/32/40px at
 * mobile/tablet/L-desktop), matching the Figma "Section spacing" annotations.
 *
 * Use as the outermost element of a `.page.tsx` file:
 *
 * @example
 * <PageWrapper className="landing">
 *   <HeaderHeroSplitMedia ... />
 *   <CardsFeatured ... />
 *   <FeatureTwoColumn ... />
 * </PageWrapper>
 *
 * Pairs cleanly with the legacy `.landing` class — keep `.landing` alongside
 * it to retain that class's existing typography and base layout rules; the
 * new `.bds-page-wrapper` only contributes the section gap.
 */
export const PageWrapper = React.forwardRef<HTMLDivElement, PageWrapperProps>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={clsx("bds-page-wrapper", className)} {...rest} />
  ),
);

PageWrapper.displayName = "PageWrapper";
