import React from 'react';

export interface DividerProps {
  /** Divider orientation - horizontal separates vertical content, vertical separates horizontal content */
  orientation?: 'horizontal' | 'vertical';
  /** Stroke weight - controls visual thickness */
  weight?: 'thin' | 'regular' | 'strong';
  /** Color variant - gray (default), black for stronger contrast, green for brand emphasis */
  color?: 'gray' | 'black' | 'green';
  /** Additional CSS classes */
  className?: string;
  /** Whether the divider is purely decorative (hides from screen readers) */
  decorative?: boolean;
}

/**
 * BDS Divider Component
 * 
 * A visual separator component following the XRPL Brand Design System.
 * Provides clear visual separation between sections, elements, or content groups.
 * 
 * @example
 * // Horizontal divider (default)
 * <Divider />
 * 
 * // Vertical divider between columns
 * <Divider orientation="vertical" />
 * 
 * // Strong green divider for emphasis
 * <Divider weight="strong" color="green" />
 * 
 * // Thin black divider
 * <Divider weight="thin" color="black" />
 */
export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  weight = 'regular',
  color = 'gray',
  className = '',
  decorative = true,
}) => {
  // Build class names using BEM with bds namespace
  const classNames = [
    'bds-divider',
    `bds-divider--${orientation}`,
    `bds-divider--${weight}`,
    `bds-divider--${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <hr
      className={classNames}
      aria-hidden={decorative}
      role={decorative ? 'presentation' : 'separator'}
      aria-orientation={!decorative ? orientation : undefined}
    />
  );
};

export default Divider;
