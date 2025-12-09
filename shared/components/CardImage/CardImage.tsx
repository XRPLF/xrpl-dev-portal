import React, { useState, useCallback } from 'react';
import { Button } from '../Button';

export interface CardImageProps {
  /** Image source URL */
  image: string;
  /** Alt text for the image */
  imageAlt: string;
  /** Card title (1 line only) */
  title: string;
  /** Card subtitle (max 3 lines) */
  subtitle: string;
  /** Button label text */
  buttonLabel: string;
  /** Link destination (renders card as clickable link) */
  href?: string;
  /** Click handler for the button */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * BDS CardImage Component
 *
 * A responsive card component displaying an image, title, subtitle, and CTA button.
 * Features three responsive size variants (LG/MD/SM) that adapt to viewport width.
 *
 * Key behaviors:
 * - Hovering the card triggers the button's hover animation
 * - Card can link to a URL or trigger a click handler
 * - Supports disabled state
 *
 * @example
 * // Basic card with link
 * <CardImage
 *   image="/images/docs-hero.png"
 *   imageAlt="Documentation illustration"
 *   title="Documentation"
 *   subtitle="Access everything you need to get started working with the XRPL."
 *   buttonLabel="Get Started"
 *   href="/docs"
 * />
 *
 * @example
 * // Card with click handler
 * <CardImage
 *   image="/images/feature.png"
 *   imageAlt="Feature illustration"
 *   title="New Feature"
 *   subtitle="Learn about our latest feature."
 *   buttonLabel="Learn More"
 *   onClick={() => console.log('clicked')}
 * />
 */
export const CardImage: React.FC<CardImageProps> = ({
  image,
  imageAlt,
  title,
  subtitle,
  buttonLabel,
  href,
  onClick,
  disabled = false,
  className = '',
}) => {
  // Track hover state for button animation
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
    'bds-card-image',
    disabled && 'bds-card-image--disabled',
    isHovered && 'bds-card-image--hovered',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Handle card click for linked cards
  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      // If clicking the button directly, don't navigate via card
      if ((e.target as HTMLElement).closest('.bds-btn')) {
        return;
      }
      if (href && !disabled) {
        window.location.href = href;
      }
    },
    [href, disabled]
  );

  // Handle button click
  const handleButtonClick = useCallback(() => {
    if (href) {
      window.location.href = href;
    } else if (onClick) {
      onClick();
    }
  }, [href, onClick]);

  // Common content structure
  const content = (
    <>
      {/* Image container with gray background */}
      <div className="bds-card-image__image-container">
        <img
          src={image}
          alt={imageAlt}
          className="bds-card-image__image"
        />
      </div>

      {/* Content area: title, subtitle, and button */}
      <div className="bds-card-image__content">
        <div className="bds-card-image__text">
          <h3 className="bds-card-image__title sh-md-l">{title}</h3>
          <p className="bds-card-image__subtitle body-l">{subtitle}</p>
        </div>

        <Button
          variant="primary"
          color="green"
          disabled={disabled}
          onClick={handleButtonClick}
        >
          {buttonLabel}
        </Button>
      </div>
    </>
  );

  // Render as clickable div (card itself handles navigation)
  return (
    <div
      className={classNames}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={href ? handleCardClick : undefined}
      role={href ? 'link' : undefined}
      tabIndex={href && !disabled ? 0 : undefined}
      onKeyDown={
        href && !disabled
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = href;
              }
            }
          : undefined
      }
      aria-disabled={disabled}
    >
      {content}
    </div>
  );
};

export default CardImage;
