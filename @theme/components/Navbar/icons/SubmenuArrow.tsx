interface ArrowIconProps {
  className?: string;
  color?: string;
  /**
   * When true, the horizontal line has a class for CSS animation (parent links).
   * When false, the full arrow is shown without animation class (child links).
   */
  animated?: boolean;
}

/**
 * Unified Arrow Icon component.
 * - For parent links (animated=true): horizontal line animates away on hover
 * - For child links (animated=false): full static arrow
 */
export function ArrowIcon({ className, color = "currentColor", animated = true }: ArrowIconProps) {
  return (
    <svg
      className={className}
      width="15"
      height="14"
      viewBox="0 0 26 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Chevron part */}
      <path
        d="M14.0019 1.00191L24.0015 11.0015L14.0019 21.001"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      {/* Horizontal line */}
      <path
        d="M23.999 10.999H0"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        className={animated ? "arrow-horizontal" : undefined}
      />
    </svg>
  );
}

// Backwards-compatible aliases
export const SubmenuArrow = (props: Omit<ArrowIconProps, 'animated'>) => (
  <ArrowIcon {...props} animated={true} />
);

export const SubmenuChildArrow = (props: Omit<ArrowIconProps, 'animated'>) => (
  <ArrowIcon {...props} animated={false} />
);

