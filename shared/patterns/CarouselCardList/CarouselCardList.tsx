import React, { useRef, useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { CardOffgrid, CardOffgridProps } from '../../components/CardOffgrid';

/**
 * Configuration for a single card in the CarouselCardList pattern
 * Extends CardOffgridProps but removes variant (controlled by carousel)
 */
export type CarouselCardConfig = Omit<CardOffgridProps, 'variant'>;

/**
 * Props for the CarouselCardList pattern component
 */
export interface CarouselCardListProps extends React.ComponentPropsWithoutRef<'section'> {
  /** Color variant of the cards */
  variant?: 'neutral' | 'green';
  /** Color variant of the navigation buttons (independent of card color). Defaults to 'neutral' */
  buttonVariant?: 'neutral' | 'green' | 'black';
  /** Section heading text */
  heading: React.ReactNode;
  /** Section description text */
  description: React.ReactNode;
  /** Array of card configurations */
  cards: readonly CarouselCardConfig[];
}

/**
 * Generates a stable key for a card based on its properties.
 */
const getCardKey = (card: CarouselCardConfig, index: number): string | number => {
  if (card.href) return card.href;
  if (card.title) return `${card.title}-${index}`;
  return index;
};

/**
 * CarouselCardList Pattern Component
 *
 * A horizontal scrolling carousel that displays CardOffgrid components.
 * Features navigation buttons that scroll cards in/out of view.
 * The navigation button colors can be set independently of the card colors
 * using the `buttonVariant` prop.
 *
 * @example
 * ```tsx
 * <CarouselCardList
 *   variant="neutral"
 *   buttonVariant="green"
 *   heading="Why Choose Our Platform"
 *   description="Discover the benefits of our solution."
 *   cards={[
 *     { icon: <Icon />, title: "Feature 1", description: "..." },
 *     { icon: <Icon />, title: "Feature 2", description: "..." },
 *   ]}
 * />
 * ```
 */
export const CarouselCardList = React.forwardRef<HTMLElement, CarouselCardListProps>(
  (props, ref) => {
    const { variant = 'neutral', buttonVariant = 'neutral', heading, description, cards, className, ...rest } = props;

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);

    // Check scroll position and update button states
    const updateScrollButtons = useCallback(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollPrev(scrollLeft > 0);
      setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 1);
    }, []);

    // Initialize and listen for scroll events
    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      updateScrollButtons();
      container.addEventListener('scroll', updateScrollButtons, { passive: true });
      window.addEventListener('resize', updateScrollButtons);

      return () => {
        container.removeEventListener('scroll', updateScrollButtons);
        window.removeEventListener('resize', updateScrollButtons);
      };
    }, [updateScrollButtons, cards.length]);

    // Scroll by one card width
    const scroll = useCallback((direction: 'prev' | 'next') => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // Get the first card to determine scroll amount
      const card = container.querySelector('.bds-carousel-card-list__card') as HTMLElement;
      if (!card) return;

      const cardWidth = card.offsetWidth;
      const gap = 8; // 8px gap between cards
      const scrollAmount = cardWidth + gap;

      container.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }, []);

    // Early return for empty cards
    if (cards.length === 0) {
      console.warn('CarouselCardList: No cards provided');
      return null;
    }

    return (
      <section
        ref={ref}
        className={clsx('bds-carousel-card-list', `bds-carousel-card-list--${variant}`, className)}
        {...rest}
      >
        {/* Header with title, description, and navigation buttons */}
        <div className="bds-carousel-card-list__header">
          <div className="bds-carousel-card-list__header-content">
            <h2 className="bds-carousel-card-list__heading h-md">{heading}</h2>
            <p className="bds-carousel-card-list__description body-l">{description}</p>
          </div>
          <div className="bds-carousel-card-list__nav">
            <CarouselButton
              direction="prev"
              variant={buttonVariant}
              disabled={!canScrollPrev}
              onClick={() => scroll('prev')}
              aria-label="Previous cards"
            />
            <CarouselButton
              direction="next"
              variant={buttonVariant}
              disabled={!canScrollNext}
              onClick={() => scroll('next')}
              aria-label="Next cards"
            />
          </div>
        </div>

        {/* Cards scroll container - full bleed */}
        <div className="bds-carousel-card-list__track-wrapper">
          <div
            ref={scrollContainerRef}
            className="bds-carousel-card-list__track"
            role="region"
            aria-label="Card carousel"
            tabIndex={0}
          >
            {cards.map((card, index) => (
              <div key={getCardKey(card, index)} className="bds-carousel-card-list__card">
                <CardOffgrid {...card} variant={variant} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

CarouselCardList.displayName = 'CarouselCardList';

/**
 * Props for the CarouselButton component
 */
interface CarouselButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Arrow direction */
  direction: 'prev' | 'next';
  /** Color variant (independent of card color) */
  variant: 'neutral' | 'green' | 'black';
}

/**
 * Internal CarouselButton component for navigation
 */
const CarouselButton: React.FC<CarouselButtonProps> = ({
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
        'bds-carousel-card-list__button',
        `bds-carousel-card-list__button--${direction}`,
        `bds-carousel-card-list__button--${variant}`,
        { 'bds-carousel-card-list__button--disabled': disabled },
        className
      )}
      disabled={disabled}
      {...buttonProps}
    >
      {direction === 'prev' ? <CarouselArrowIconLeft /> : <CarouselArrowIconRight />}
    </button>
  );
};

/**
 * SVG Arrow Icon for carousel navigation - Right arrow
 */
const CarouselArrowIconRight: React.FC = () => (
  <svg
    className="bds-carousel-card-list__arrow-icon"
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

/**
 * SVG Arrow Icon for carousel navigation - Left arrow
 */
const CarouselArrowIconLeft: React.FC = () => (
  <svg
    className="bds-carousel-card-list__arrow-icon"
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

export default CarouselCardList;

