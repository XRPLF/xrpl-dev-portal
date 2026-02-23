import React from 'react';
import clsx from 'clsx';

export type LinkArrowVariant = 'internal' | 'external';
export type LinkArrowSize = 'small' | 'medium' | 'large';

export interface LinkArrowProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Arrow variant - internal (→) or external (↗)
   * Both variants animate on hover (horizontal line shrinks to show chevron)
   * @default 'internal'
   */
  variant?: LinkArrowVariant;
  
  /**
   * Size of the arrow icon
   * @default 'medium'
   */
  size?: LinkArrowSize;
  
  /**
   * Color of the arrow (hex color or CSS color value)
   * @default 'currentColor' (inherits from parent)
   */
  color?: string;
  
  /**
   * Disabled state - reduces opacity and prevents hover animation
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

// Size mappings for internal arrow (viewBox 0 0 26 22)
const internalSizeMap: Record<LinkArrowSize, { width: number; height: number }> = {
  small: { width: 15, height: 14 },
  medium: { width: 17, height: 16 },
  large: { width: 26, height: 22 },
};

// Size mappings for external arrow (viewBox 0 0 21 21, square aspect ratio)
const externalSizeMap: Record<LinkArrowSize, { width: number; height: number }> = {
  small: { width: 14, height: 14 },
  medium: { width: 16, height: 16 },
  large: { width: 21, height: 21 },
};

/**
 * LinkArrow Component
 * 
 * A customizable SVG arrow icon for use in link components.
 * Supports internal (→) and external (↗) variants with three size options.
 * Both variants animate on hover - horizontal line shrinks to reveal chevron shape.
 * 
 * @example
 * ```tsx
 * <LinkArrow variant="internal" size="medium" />
 * <LinkArrow variant="external" size="large" color="#0DAA3E" />
 * <LinkArrow variant="internal" size="small" disabled />
 * ```
 */
export const LinkArrow: React.FC<LinkArrowProps> = ({
  variant = 'internal',
  size = 'medium',
  color = 'currentColor',
  disabled = false,
  className,
  ...svgProps
}) => {
  const dimensions = variant === 'external' 
    ? externalSizeMap[size] 
    : internalSizeMap[size];
  
  const classes = clsx(
    'bds-link-icon',
    `bds-link-icon--${variant}`,
    `bds-link-icon--${size}`,
    {
      'bds-link-icon--disabled': disabled,
    },
    className
  );

  // Internal arrow (→) - horizontal arrow pointing right
  // Horizontal line animates away on hover to show chevron
  const renderInternalArrow = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 26 22"
      fill="none"
      aria-hidden="true"
      {...svgProps}
    >
      {/* Chevron part (static) */}
      <path
        d="M14.0019 1.00191L24.0015 11.0015L14.0019 21.001"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      {/* Horizontal line (animates away on hover) */}
      <path
        d="M23.999 10.999H0"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        className="arrow-horizontal"
      />
    </svg>
  );

  // External arrow (↗) - diagonal arrow with corner bracket
  // Diagonal line animates away on hover, leaving just the chevron bracket
  const renderExternalArrow = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 21 21"
      fill="none"
      aria-hidden="true"
      {...svgProps}
    >
      {/* Corner bracket - horizontal line (static) */}
      <path
        d="M4.0031 2L19 2"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      {/* Corner bracket - vertical line (static) */}
      <path
        d="M19 2V17"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      {/* Diagonal arrow line (animates away on hover) */}
      <path
        d="M18.9963 2L1 20"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
        className="arrow-horizontal"
      />
    </svg>
  );

  return (
    <span className={classes}>
      {variant === 'external' ? renderExternalArrow() : renderInternalArrow()}
    </span>
  );
};

LinkArrow.displayName = 'LinkArrow';
