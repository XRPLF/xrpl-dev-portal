import React from 'react';
import clsx from 'clsx';
import { CardImage, CardImageProps } from '../../components/CardImage';
import { PageGrid } from '../../components/PageGrid/page-grid';
import { getCardKey, isEnvironment } from '../../utils';

/**
 * Configuration for a single card in the CardsFeatured pattern
 */
export type CardsFeaturedCardConfig = CardImageProps;

/**
 * Props for the CardsFeatured pattern component
 */
export interface CardsFeaturedProps extends React.ComponentPropsWithoutRef<'section'> {
  /** Section heading text */
  heading: React.ReactNode;
  /** Section description text */
  description: React.ReactNode;
  /** Array of card configurations (uses CardImageProps) */
  cards: readonly CardsFeaturedCardConfig[];
}

/**
 * CardsFeatured Pattern Component
 *
 * A section pattern that displays a heading, description, and a responsive grid
 * of CardImage components. Follows the "Logo Rectangle Grid" pattern from Figma.
 *
 * Features:
 * - Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)
 * - Heading with `heading-md` typography (Tobias Light)
 * - Description with `body-l` typography (Booton Light)
 * - Proper spacing using PageGrid for container and alignment
 * - Full dark mode support
 *
 * @example
 * ```tsx
 * <CardsFeatured
 *   heading="Trusted by Leaders in Real-World Asset"
 *   description="Powering institutions and builders who are bringing real world assets on chain at global scale."
 *   cards={[
 *     {
 *       image: "/img/docs.png",
 *       imageAlt: "Documentation",
 *       title: "Documentation",
 *       subtitle: "Access everything you need to get started working with the XRPL.",
 *       buttonLabel: "Get Started",
 *       href: "/docs"
 *     },
 *     // ... more cards
 *   ]}
 * />
 * ```
 */
export const CardsFeatured = React.forwardRef<HTMLElement, CardsFeaturedProps>(
  (props, ref) => {
    const { heading, description, cards, className, ...rest } = props;

    // Early return for empty cards array
    if (cards.length === 0) {
      if (isEnvironment('development')) {
        console.warn('CardsFeatured: No cards provided');
      }
      return null;
    }

    return (
      <section
        ref={ref}
        className={clsx('bds-cards-featured', className)}
        {...rest}
      >
        <PageGrid>
          {/* Header content row */}
          <PageGrid.Row>
            <PageGrid.Col
              span={{
                base: 'fill',
                md: 6,
                lg: 8,
              }}
            >
              <div className="bds-cards-featured__header">
                <h2 className="bds-cards-featured__heading h-md">{heading}</h2>
                <p className="bds-cards-featured__description body-l">{description}</p>
              </div>
            </PageGrid.Col>
          </PageGrid.Row>

          {/* Cards grid row */}
          <PageGrid.Row>
            <PageGrid.Col span="fill">
              <div className="bds-cards-featured__cards">
                {cards.map((card, index) => (
                  <div
                    key={getCardKey(card.href || card.title, index, "card-featured")}
                    className="bds-cards-featured__card-wrapper"
                  >
                    <CardImage {...card} fullBleed />
                  </div>
                ))}
              </div>
            </PageGrid.Col>
          </PageGrid.Row>
        </PageGrid>
      </section>
    );
  }
);

CardsFeatured.displayName = 'CardsFeatured';

export default CardsFeatured;

