import React, { useRef, useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { CardOffgrid, CardOffgridProps } from '../../components/CardOffgrid';
import { CarouselButton } from '../../components/CarouselButton';
import type { ButtonProps } from '../../components/Button';

/**
 * Configuration for a single card in the CarouselCardList pattern
 * Extends CardOffgridProps but removes variant (controlled by carousel)
 */
export type CarouselCardConfig = Omit<CardOffgridProps, 'variant'>;

/** BEM class name for card elements */
const CARD_CLASS_NAME = 'bds-carousel-card-list__card';

/**
 * Props for the CarouselCardList pattern component
 */
export interface CarouselCardListProps extends React.ComponentPropsWithoutRef<'section'> {
  /** Color variant of the cards */
  variant?: 'neutral' | 'green';
  /** Color variant of the navigation buttons (independent of card color). Defaults to 'neutral'. Derived from Button color prop. */
  buttonVariant?: ButtonProps['color'] | 'neutral';
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
      const card = container.querySelector(`.${CARD_CLASS_NAME}`) as HTMLElement;
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
            {(['prev', 'next'] as const).map((direction) => (
              <CarouselButton
                key={direction}
                direction={direction}
                variant={buttonVariant}
                disabled={direction === 'prev' ? !canScrollPrev : !canScrollNext}
                onClick={() => scroll(direction)}
                aria-label={direction === 'prev' ? 'Previous cards' : 'Next cards'}
              />
            ))}
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
              <div key={getCardKey(card, index)} className={CARD_CLASS_NAME}>
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

export default CarouselCardList;

