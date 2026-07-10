import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
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
  /** When true, image fills entire container with object-fit: cover (no visible background) */
  fullBleed?: boolean;
  /** Custom background color for image container (defaults to gray-100) */
  backgroundColor?: string;
}

const CtaArrowIcon: React.FC = () => (
  <svg
    className="bds-btn__icon"
    width="15"
    height="14"
    viewBox="0 0 15 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <line
      className="bds-btn__icon-line"
      x1="0"
      y1="7"
      x2="14"
      y2="7"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeMiterlimit="10"
    />
    <path
      className="bds-btn__icon-chevron"
      d="M8.16755 1.16743L14.0005 7.00038L8.16755 12.8333"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeMiterlimit="10"
      fill="none"
    />
  </svg>
);

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
  fullBleed = false,
  backgroundColor,
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
  const classNames = clsx(
    'bds-card-image',
    disabled && 'bds-card-image--disabled',
    isHovered && 'bds-card-image--hovered',
    fullBleed && 'bds-card-image--full-bleed',
    className
  );

  // Handle button click
  const handleButtonClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  // Build inline style for image container background color
  const imageContainerStyle = backgroundColor
    ? { '--bds-card-image-bg': backgroundColor } as React.CSSProperties
    : undefined;

  const cta = href && !disabled ? (
    <span className="bds-btn bds-btn--primary bds-btn--green">
      <span className="bds-btn__label">{buttonLabel}</span>
      <CtaArrowIcon />
    </span>
  ) : (
    <Button
      variant="primary"
      color="green"
      disabled={disabled}
      onClick={handleButtonClick}
    >
      {buttonLabel}
    </Button>
  );

  // Common content structure
  const content = (
    <>
      {/* Image container with customizable background */}
      <div className="bds-card-image__image-container" style={imageContainerStyle}>
        <img
          src={image}
          alt={imageAlt}
          className="bds-card-image__image"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Content area: title, subtitle, and button */}
      <div className="bds-card-image__content">
        <div className="bds-card-image__text">
          <h3 className="bds-card-image__title sh-md-l">{title}</h3>
          <p className="bds-card-image__subtitle body-l">{subtitle}</p>
        </div>

        {cta}
      </div>
    </>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={classNames}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick ? () => onClick() : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={classNames}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-disabled={disabled}
    >
      {content}
    </div>
  );
};

export default CardImage;
