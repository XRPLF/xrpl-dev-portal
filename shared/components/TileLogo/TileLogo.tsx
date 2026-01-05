import React, { useState } from 'react';
import clsx from 'clsx';

export interface TileLogoProps {
  /** Shape variant: 'square' (default) or 'rectangle' */
  shape?: 'square' | 'rectangle';
  /** Color variant: 'neutral' (default) or 'green' */
  variant?: 'neutral' | 'green';
  /** Logo image source (URL or path) */
  logo: string;
  /** Alt text for accessibility */
  alt: string;
  /** Click handler - renders as <button> */
  onClick?: () => void;
  /** Link destination - renders as <a> */
  href?: string;
  /** Disabled state - prevents interaction */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * TileLogo Component
 *
 * A tile/card component designed to display brand logos with interactive states.
 * Supports two shape variants (Square and Rectangle) and two color variants
 * (Neutral and Green) with five interaction states (Default, Hover, Focused,
 * Pressed, Disabled).
 *
 * Features a "window shade" hover animation where the hover color wipes from
 * bottom to top on mouse enter, and top to bottom on mouse leave.
 *
 * Shape sizes are responsive and change based on breakpoints:
 * - Square: 1:1 aspect ratio, width controlled by parent (use PageGridCol with span 2/2/3)
 * - Rectangle: 9:5 aspect ratio, width controlled by parent (use PageGridCol with span 2/2/3)
 *
 * @example
 * // Basic usage with link (square shape - default)
 * <TileLogo
 *   variant="neutral"
 *   logo="/logos/partner-logo.svg"
 *   alt="Partner Name"
 *   href="/partners/partner-name"
 * />
 *
 * @example
 * // Rectangle shape with click handler
 * <TileLogo
 *   shape="rectangle"
 *   variant="green"
 *   logo="/logos/featured-logo.svg"
 *   alt="Featured Partner"
 *   onClick={() => openPartnerModal('featured')}
 * />
 *
 * @example
 * // Disabled state
 * <TileLogo
 *   variant="neutral"
 *   logo="/logos/coming-soon.svg"
 *   alt="Coming Soon"
 *   disabled
 * />
 */
export const TileLogo: React.FC<TileLogoProps> = ({
  shape = 'square',
  variant = 'neutral',
  logo,
  alt,
  onClick,
  href,
  disabled = false,
  className = '',
}) => {
  // Track hover state for animation
  const [isHovered, setIsHovered] = useState(false);

  // Build class names using BEM convention
  const classNames = clsx(
    'bds-tile-logo',
    `bds-tile-logo--${shape}`,
    `bds-tile-logo--${variant}`,
    {
      'bds-tile-logo--disabled': disabled,
      'bds-tile-logo--hovered': isHovered && !disabled,
    },
    className
  );

  // Hover handlers
  const handleMouseEnter = () => !disabled && setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Common content (overlay + logo image)
  const content = (
    <>
      {/* Hover overlay for window shade animation */}
      <div className="bds-tile-logo__overlay" aria-hidden="true" />
      <img
        src={logo}
        alt={alt}
        className="bds-tile-logo__image"
        aria-hidden="false"
      />
    </>
  );

  // Render as anchor tag when href is provided
  if (href && !disabled) {
    return (
      <a
        href={href}
        className={classNames}
        aria-label={alt}
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
      aria-label={alt}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </button>
  );
};

export default TileLogo;
