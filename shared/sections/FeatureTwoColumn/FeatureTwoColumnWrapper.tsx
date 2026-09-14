import React from "react";
import clsx from "clsx";

export interface FeatureTwoColumnWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Content to render inside the wrapper (typically multiple `FeatureTwoColumn`s). */
  children?: React.ReactNode;
  /** Additional CSS classes appended to the base wrapper class. */
  className?: string;
}

/**
 * FeatureTwoColumnWrapper
 *
 * A purely-semantic wrapper element intended to group a sequence of
 * `FeatureTwoColumn` sections. It renders a single `<div>` with no styles of
 * its own — the goal is to make grouping explicit at the call site so it's
 * obvious that the contained sections belong together (and can be styled or
 * targeted as a unit later if needed).
 *
 * Renders any HTMLDivElement attributes through (`id`, `aria-*`, `data-*`,
 * `style`, etc.) so consumers can attach hooks without escaping the
 * component.
 *
 * @example
 * <FeatureTwoColumnWrapper>
 *   <FeatureTwoColumn ... />
 *   <FeatureTwoColumn ... />
 *   <FeatureTwoColumn ... />
 * </FeatureTwoColumnWrapper>
 */
export const FeatureTwoColumnWrapper: React.FC<FeatureTwoColumnWrapperProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div
      className={clsx("bds-feature-two-column-wrapper", className)}
      {...rest}
    >
      {children}
    </div>
  );
};

export default FeatureTwoColumnWrapper;
