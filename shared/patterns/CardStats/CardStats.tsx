import React from 'react';
import clsx from 'clsx';
import { CardStat, CardStatProps } from '../../components/CardStat';
import { PageGrid } from '../../components/PageGrid/page-grid';

/**
 * Configuration for a single stat card in the CardStats pattern
 */
export type CardStatsCardConfig = CardStatProps;

/**
 * Props for the CardStats pattern component
 */
export interface CardStatsProps extends React.ComponentPropsWithoutRef<'section'> {
  /** Section heading text */
  heading: React.ReactNode;
  /** Optional section description text */
  description?: React.ReactNode;
  /** Array of CardStat configurations */
  cards: readonly CardStatsCardConfig[];
}

/**
 * CardStats Pattern Component
 *
 * A section pattern that displays a heading, optional description, and a responsive
 * grid of CardStat components. Designed for showcasing key statistics and metrics.
 *
 * Features:
 * - Responsive grid layout (2 columns mobile/tablet, 3 columns desktop)
 * - Heading with `heading-md` typography (Tobias Light)
 * - Optional description with `body-l` typography (Booton Light)
 * - Proper spacing using PageGrid for container and alignment
 * - Full dark mode support
 *
 * @example
 * ```tsx
 * <CardStats
 *   heading="Blockchain Trusted at Scale"
 *   description="Streamline development and build powerful RWA tokenization solutions."
 *   cards={[
 *     {
 *       statistic: "12",
 *       superscript: "+",
 *       label: "Continuous uptime years",
 *       variant: "lilac",
 *       primaryButton: { label: "Learn More", href: "/docs" }
 *     },
 *     {
 *       statistic: "6M",
 *       superscript: "2",
 *       label: "Active wallets",
 *       variant: "light-gray"
 *     },
 *     // ... more cards
 *   ]}
 * />
 * ```
 */
export const CardStats = React.forwardRef<HTMLElement, CardStatsProps>(
  (props, ref) => {
    const { heading, description, cards, className, ...rest } = props;

    // Early return for empty cards array
    if (cards.length === 0) {
      console.warn('CardStats: No cards provided');
      return null;
    }

    return (
      <section
        ref={ref}
        className={clsx('bds-card-stats', className)}
        {...rest}
      >
        <PageGrid>
          <PageGrid.Row>
            <PageGrid.Col span={{ base: 4, md: 8, lg: 12 }}>
              {/* Header section */}
              <div className="bds-card-stats__header">
                <h2 className="bds-card-stats__heading h-md">{heading}</h2>
                {description && (
                  <p className="bds-card-stats__description body-l">
                    {description}
                  </p>
                )}
              </div>

              {/* Cards grid */}
              <div className="bds-card-stats__cards">
                {cards.map((cardConfig, index) => (
                  <div
                    key={`card-stat-${index}`}
                    className="bds-card-stats__card-wrapper"
                  >
                    <CardStat {...cardConfig} />
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

CardStats.displayName = 'CardStats';

export default CardStats;

