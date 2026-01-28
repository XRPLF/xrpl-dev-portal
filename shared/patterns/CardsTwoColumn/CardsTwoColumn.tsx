import React from 'react';
import clsx from 'clsx';
import { TextCard, TextCardProps } from 'shared/components/TextCard';
import { PageGrid } from 'shared/components/PageGrid';

/**
 * Configuration for a card in the CardsTwoColumn pattern
 */
export type CardsTwoColumnCardConfig = TextCardProps;

/**
 * Props for the CardsTwoColumn pattern component
 */
export interface CardsTwoColumnProps extends Omit<React.ComponentPropsWithoutRef<'section'>, 'title'> {
  /** Section title (heading-md typography) */
  title: React.ReactNode;
  /** Section description text (body-l typography, muted color) */
  description?: React.ReactNode;
  /** Secondary description paragraph (body-l typography, muted color) */
  secondaryDescription?: React.ReactNode;
  /** Array of 4 card configurations for the 2x2 grid */
  cards: readonly [CardsTwoColumnCardConfig, CardsTwoColumnCardConfig, CardsTwoColumnCardConfig, CardsTwoColumnCardConfig];
}

/**
 * CardsTwoColumn Pattern Component
 *
 * A section pattern that displays a header with title/description and a 2x2 grid
 * of TextCard components. Uses PageGrid for responsive layout.
 *
 * Structure:
 * - Header: Title (left) + Description (right) on desktop, stacked on tablet/mobile
 * - Cards: 2x2 grid on desktop, single column stacked on tablet/mobile
 *
 * Responsive behavior:
 * - Desktop (≥992px):
 *   - Header: Title left (6 cols), description right (6 cols)
 *   - Cards: 2x2 grid (6 cols each)
 *   - Section padding: 40px vertical, 32px horizontal
 *   - Gap between header and cards: 40px
 *   - Gap between cards: 8px
 *
 * - Tablet (576-991px):
 *   - Header: Stacked (title above description, full width)
 *   - Cards: Single column, stacked vertically
 *   - Section padding: 32px vertical, 24px horizontal
 *   - Gap between header and cards: 32px
 *   - Gap between cards: 8px
 *
 * - Mobile (<576px):
 *   - Header: Stacked (title above description, full width)
 *   - Cards: Single column, stacked vertically
 *   - Section padding: 24px vertical, 16px horizontal
 *   - Gap between header and cards: 24px
 *   - Gap between cards: 8px
 *
 * @example
 * ```tsx
 * <CardsTwoColumn
 *   title="The Future of Finance is Already Onchain"
 *   description="XRP Ledger isn't about bold predictions. It's about delivering value now."
 *   secondaryDescription="On XRPL, you're not waiting for the future. You're building it."
 *   cards={[
 *     { title: "Institutions", description: "Banks, asset managers...", color: "lilac" },
 *     { title: "Developers", description: "Build decentralized...", color: "neutral-light" },
 *     { title: "Enterprise", description: "Scale your business...", color: "neutral-dark" },
 *     { title: "Community", description: "Join the global...", color: "green" }
 *   ]}
 * />
 * ```
 */
export const CardsTwoColumn = React.forwardRef<HTMLElement, CardsTwoColumnProps>(
  (props, ref) => {
    const { title, description, secondaryDescription, cards, className, ...rest } = props;

    if (cards.length !== 4) {
      console.warn('CardsTwoColumn: Exactly 4 cards are required');
      return null;
    }

    return (
      <section
        ref={ref}
        className={clsx('bds-cards-two-column', className)}
        {...rest}
      >
        <PageGrid className="bds-cards-two-column__container">
          {/* Header Row */}
          <PageGrid.Row className="bds-cards-two-column__header">
            <PageGrid.Col span={{ md: 8, lg: 6 }} className="bds-cards-two-column__header-left">
              <h2 className="bds-cards-two-column__title h-md">{title}</h2>
            </PageGrid.Col>
            {(description || secondaryDescription) && (
              <PageGrid.Col span={{ md: 8, lg: 6 }} className="bds-cards-two-column__header-right">
                <div className="bds-cards-two-column__description body-l">
                  {description && <p>{description}</p>}
                  {secondaryDescription && <p>{secondaryDescription}</p>}
                </div>
              </PageGrid.Col>
            )}
          </PageGrid.Row>

          {/* Cards Row - 2x2 on desktop, stacked on tablet/mobile */}
          <PageGrid.Row className="bds-cards-two-column__cards">
            {cards.map((card, index) => (
              <PageGrid.Col key={index} span={{ md: 8, lg: 6 }}>
                <TextCard {...card} />
              </PageGrid.Col>
            ))}
          </PageGrid.Row>
        </PageGrid>
      </section>
    );
  }
);

CardsTwoColumn.displayName = 'CardsTwoColumn';

export default CardsTwoColumn;

