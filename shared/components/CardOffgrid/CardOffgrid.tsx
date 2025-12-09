import React, { useState, useCallback } from 'react';

export interface CardOffgridProps {
  /** Color variant of the card */
  variant?: 'neutral' | 'green';
  /** Icon element or image source */
  icon: React.ReactNode | string;
  /** Card title (supports multi-line via \n) */
  title: string;
  /** Card description text */
  description: string;
  /** Click handler */
  onClick?: () => void;
  /** Link destination (renders as anchor if provided) */
  href?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * BDS CardOffgrid Component
 * 
 * A versatile card component for displaying feature highlights with an icon,
 * title, and description. Supports neutral and green color variants with
 * interactive states (hover, focus, pressed, disabled).
 * 
 * Features a "window shade" color wipe animation:
 * - Hover in: shade rises from bottom to top (reveals hover color)
 * - Hover out: shade falls from top to bottom (hides hover color)
 * 
 * @example
 * // Basic neutral card
 * <CardOffgrid
 *   variant="neutral"
 *   icon={<MetadataIcon />}
 *   title="Onchain Metadata"
 *   description="Easily store key asset information."
 *   onClick={() => console.log('clicked')}
 * />
 * 
 * @example
 * // Green card with link
 * <CardOffgrid
 *   variant="green"
 *   icon="/icons/metadata.svg"
 *   title="Onchain Metadata"
 *   description="Easily store key asset information."
 *   href="/docs/metadata"
 * />
 */
export const CardOffgrid: React.FC<CardOffgridProps> = ({
  variant = 'neutral',
  icon,
  title,
  description,
  onClick,
  href,
  disabled = false,
  className = '',
}) => {
  // Track hover state for animation
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (!disabled) {
      setIsHovered(true);
    }
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    if (!disabled) {
      setIsHovered(false);
    }
  }, [disabled]);

  // Build class names using BEM with bds namespace
  const classNames = [
    'bds-card-offgrid',
    `bds-card-offgrid--${variant}`,
    disabled && 'bds-card-offgrid--disabled',
    isHovered && 'bds-card-offgrid--hovered',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Render icon - supports both React nodes and image URLs
  const renderIcon = () => {
    if (typeof icon === 'string') {
      return (
        <img
          src={icon}
          alt=""
          className="bds-card-offgrid__icon-image"
          aria-hidden="true"
        />
      );
    }
    return icon;
  };

  // Split title by newline for multi-line support
  const renderTitle = () => {
    const lines = title.split('\n');
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Common content for both button and anchor
  const content = (
    <>
      {/* Hover color wipe overlay */}
      <span className="bds-card-offgrid__overlay" aria-hidden="true" />
      
      <span className="bds-card-offgrid__icon-container">
        {renderIcon()}
      </span>
      
      <span className="bds-card-offgrid__content">
        <span className="bds-card-offgrid__title subhead-lg-l">
          {renderTitle()}
        </span>
        <span className="bds-card-offgrid__description body-l">
          {description}
        </span>
      </span>
    </>
  );

  // Render as anchor if href is provided
  if (href && !disabled) {
    return (
      <a
        href={href}
        className={classNames}
        aria-disabled={disabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </a>
    );
  }

  // Render as button for onClick or disabled state
  return (
    <button
      type="button"
      className={classNames}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </button>
  );
};

export default CardOffgrid;
