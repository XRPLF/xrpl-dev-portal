import React from 'react';
import clsx from 'clsx';

/**
 * Props for the CarouselButton component
 */
export interface CarouselButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Arrow direction */
  direction: 'prev' | 'next';
  /** Color variant */
  variant: 'neutral' | 'green' | 'black';
}

/**
 * CarouselButton Component
 * 
 * A circular navigation button for carousel components.
 * Displays left/right arrow icons and supports multiple color variants.
 * 
 * @example
 * ```tsx
 * <CarouselButton
 *   direction="prev"
 *   variant="neutral"
 *   onClick={() => scroll('prev')}
 *   disabled={!canScrollPrev}
 *   aria-label="Previous items"
 * />
 * ```
 */
export const CarouselButton: React.FC<CarouselButtonProps> = ({
  direction,
  variant,
  disabled,
  className,
  ...buttonProps
}) => {
  return (
    <button
      type="button"
      className={clsx(
        'bds-carousel-button',
        `bds-carousel-button--${direction}`,
        `bds-carousel-button--${variant}`,
        { 'bds-carousel-button--disabled': disabled },
        className
      )}
      disabled={disabled}
      {...buttonProps}
    >
      {direction === 'prev' ? <CarouselArrowIconLeft /> : <CarouselArrowIconRight />}
    </button>
  );
};

CarouselButton.displayName = 'CarouselButton';

/**
 * SVG Arrow Icon for carousel navigation - Right arrow
 */
export const CarouselArrowIconRight: React.FC = () => (
  <svg
    className="bds-carousel-button__arrow-icon"
    width="18"
    height="16"
    viewBox="0 0 18 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M9.33387 1.33461L15.9999 8.00058L9.33387 14.6666M15.9982 7.99893L-0.000149269 7.99893"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
  </svg>
);

CarouselArrowIconRight.displayName = 'CarouselArrowIconRight';

/**
 * SVG Arrow Icon for carousel navigation - Left arrow
 */
export const CarouselArrowIconLeft: React.FC = () => (
  <svg
    className="bds-carousel-button__arrow-icon"
    width="18"
    height="15"
    viewBox="0 0 18 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M7.72667 0.530285L1.0607 7.19626L7.72667 13.8622M1.06235 7.19461L17.0607 7.19461"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
  </svg>
);

CarouselArrowIconLeft.displayName = 'CarouselArrowIconLeft';

export default CarouselButton;

