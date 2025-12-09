import React, { useState } from 'react';
import { LinkArrow } from '../Link/LinkArrow';

export interface CardIconProps {
  /** Color variant: 'neutral' (default) or 'green' */
  variant?: 'neutral' | 'green';
  /** Icon image source (URL or path) */
  icon: string;
  /** Alt text for the icon image */
  iconAlt?: string;
  /** Card label text */
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
 * CardIcon Component
 *
 * A clickable card component featuring an icon (top-left) and label text with
 * arrow (bottom). Supports two color variants (Neutral and Green) with five
 * interaction states (Default, Hover, Focused, Pressed, Disabled).
 *
 * The component is fully responsive, adapting its size at breakpoints:
 * - SM (< 576px): 136px height, 56x56 icon, 8px padding
 * - MD (576px - 991px): 140px height, 60x60 icon, 12px padding
 * - LG (>= 992px): 144px height, 64x64 icon, 16px padding
 *
 * Features a "window shade" hover animation where the hover color wipes from
 * bottom to top on mouse enter, and top to bottom on mouse leave.
 *
 * @example
 * // Basic usage with link
 * <CardIcon
 *   variant="neutral"
 *   icon="/icons/javascript.svg"
 *   label="Get Started with Javascript"
 *   href="/docs/javascript"
 * />
 *
 * @example
 * // Green variant with click handler
 * <CardIcon
 *   variant="green"
 *   icon="/icons/python.svg"
 *   label="Python Tutorial"
 *   onClick={() => openTutorial('python')}
 * />
 *
 * @example
 * // Disabled state
 * <CardIcon
 *   variant="neutral"
 *   icon="/icons/coming-soon.svg"
 *   label="Coming Soon"
 *   disabled
 * />
 */
export const CardIcon: React.FC<CardIconProps> = ({
  variant = 'neutral',
  icon,
  iconAlt = '',
  label,
  href,
  onClick,
  disabled = false,
  className = '',
}) => {
  // Track hover state for animation
  const [isHovered, setIsHovered] = useState(false);

  // Build class names using BEM convention
  const classNames = [
    'bds-card-icon',
    `bds-card-icon--${variant}`,
    disabled ? 'bds-card-icon--disabled' : '',
    isHovered && !disabled ? 'bds-card-icon--hovered' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Hover handlers
  const handleMouseEnter = () => !disabled && setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Common content
  const content = (
    <>
      {/* Hover overlay for window shade animation */}
      <div className="bds-card-icon__overlay" aria-hidden="true" />

      {/* Icon container */}
      <div className="bds-card-icon__icon">
        <img
          src={icon}
          alt={iconAlt}
          className="bds-card-icon__icon-img"
        />
      </div>

      {/* Bottom content row */}
      <div className="bds-card-icon__content">
        <span className="bds-card-icon__label">{label}</span>
        <span className="bds-card-icon__arrow">
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

export default CardIcon;
