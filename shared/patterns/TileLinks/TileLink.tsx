import React, { useState } from 'react';
import clsx from 'clsx';
import { LinkArrow } from '../../components/Link/LinkArrow';

export interface TileLinkProps {
  /** Color variant: 'gray' (default) or 'lilac' */
  variant?: 'gray' | 'lilac';
  /** Link text/label */
  label: string;
  /** Link destination - renders as <a> */
  href?: string;
  /** Click handler - renders as <button> */
  onClick?: () => void;
  /** Disabled state - prevents interaction */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * TileLink Component
 *
 * A clickable tile component for link grids, featuring text content with an arrow icon.
 * Supports two color variants (Gray and Lilac) with full light/dark mode theming and
 * five interaction states (Default, Hover, Focused, Pressed, Disabled).
 *
 * Features a "window shade" hover animation where the hover color wipes from
 * bottom to top on mouse enter, and top to bottom on mouse leave.
 *
 * Responsive Sizing:
 * - Base (< 576px): 64px height, 12px padding, 16px font, 26.1px line-height
 * - MD (576px - 991px): 64px height, 16px padding, 16px font, 26.1px line-height
 * - LG (≥ 992px): 64px height, 20px padding, 18px font, 26.1px line-height
 *
 * Color Variants:
 * - Gray: Light mode (gray-200 bg), Dark mode (gray-500 bg)
 * - Lilac: Same in both light and dark modes (lilac-100 bg)
 *
 * @example
 * // Basic usage with link (gray variant - default)
 * <TileLink
 *   variant="gray"
 *   label="Documentation"
 *   href="/docs"
 * />
 *
 * @example
 * // Lilac variant with click handler
 * <TileLink
 *   variant="lilac"
 *   label="Get Started"
 *   onClick={() => navigate('/start')}
 * />
 *
 * @example
 * // Disabled state
 * <TileLink
 *   variant="gray"
 *   label="Coming Soon"
 *   disabled
 * />
 */
export const TileLink: React.FC<TileLinkProps> = ({
  variant = 'gray',
  label,
  href,
  onClick,
  disabled = false,
  className,
}) => {
  // Track hover state for animation
  const [isHovered, setIsHovered] = useState(false);

  // Build class names using BEM convention
  const classNames = clsx(
    'bds-tile-link',
    `bds-tile-link--${variant}`,
    {
      'bds-tile-link--disabled': disabled,
      'bds-tile-link--hovered': isHovered && !disabled,
    },
    className
  );

  // Hover handlers
  const handleMouseEnter = () => !disabled && setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Common content (overlay + label + arrow)
  const content = (
    <>
      {/* Hover overlay for window shade animation */}
      <div className="bds-tile-link__overlay" aria-hidden="true" />
      
      {/* Content wrapper */}
      <div className="bds-tile-link__content">
        <span className="bds-tile-link__label mb-0 body-r">{label}</span>
        <span className="bds-tile-link__arrow">
          <LinkArrow variant="internal" size="medium" />
        </span>
      </div>
    </>
  );

  // Render as anchor tag when href is provided
  if (href && !disabled) {
    return (
      <a
        href={href}
        className={classNames}
        aria-label={label}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </a>
    );
  }

  // Render as button (for onClick or disabled state)
  return (
    <button
      type="button"
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={label}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </button>
  );
};

export default TileLink;

