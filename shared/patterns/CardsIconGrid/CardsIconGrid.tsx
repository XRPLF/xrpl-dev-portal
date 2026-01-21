import React from 'react';
import clsx from 'clsx';
import { CardIcon, CardIconProps } from '../../components/CardIcon';
import { PageGrid } from '../../components/PageGrid/page-grid';

/**
 * Configuration for a single card in the CardsIconGrid pattern
 */
export type CardsIconGridCardConfig = CardIconProps;

/**
 * Props for the CardsIconGrid pattern component
 */
export interface CardsIconGridProps extends React.ComponentPropsWithoutRef<'section'> {
  /** Section heading text */
  heading: React.ReactNode;
  /** Section description text (optional) */
  description?: React.ReactNode;
  /** Array of card configurations (uses CardIconProps) */
  cards: readonly CardsIconGridCardConfig[];
}

/**
 * Generate a unique key for a card based on its props
 */
const getCardKey = (card: CardsIconGridCardConfig, index: number): string => {
  if (card.href) return `card-${card.href}-${index}`;
  if (card.label) return `card-${card.label.toString().slice(0, 20)}-${index}`;
  return `card-${index}`;
};

/**
 * CardsIconGrid Pattern Component
 *
 * A section pattern that displays a heading, optional description, and a responsive grid
 * of CardIcon components. Follows the "CardIconGrid" pattern from Figma.
 *
 * Features:
 * - Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)
 * - Heading with `heading-md` typography (Tobias Light)
 * - Optional description with `body-l` typography (Booton Light)
 * - Proper spacing using PageGrid for container and alignment
 * - Full dark mode support
 *
 * @example
 * ```tsx
 * <CardsIconGrid
 *   heading="Unlock new business models with embedded payments"
 *   description="Streamline development and build powerful solutions."
 *   cards={[
 *     {
 *       icon: "/icons/wallet.svg",
 *       label: "Digital Wallets",
 *       href: "/docs/wallets",
 *       variant: "green"
 *     },
 *     {
 *       icon: "/icons/payments.svg",
 *       label: "B2B Payment Rails",
 *       href: "/docs/payments",
 *       variant: "green"
 *     }
 *   ]}
 * />
 * ```
 */
export const CardsIconGrid = React.forwardRef<HTMLElement, CardsIconGridProps>(
  function CardsIconGrid(
    { className, heading, description, cards, ...rest },
    ref
  ) {
    return (
      <section
        ref={ref}
        className={clsx('bds-cards-icon-grid', className)}
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
              <div className="bds-cards-icon-grid__header">
                <h2 className="bds-cards-icon-grid__heading h-md">{heading}</h2>
                {description && (
                  <p className="bds-cards-icon-grid__description body-l">{description}</p>
                )}
              </div>
            </PageGrid.Col>
          </PageGrid.Row>

          {/* Cards grid row */}
          <PageGrid.Row>
            <PageGrid.Col span="fill">
              <div className="bds-cards-icon-grid__cards">
                {cards.map((card, index) => (
                  <div
                    key={getCardKey(card, index)}
                    className="bds-cards-icon-grid__card-wrapper"
                  >
                    <CardIcon {...card} />
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

CardsIconGrid.displayName = 'CardsIconGrid';

export default CardsIconGrid;

