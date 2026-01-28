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
  cards: CardStatsCardConfig[];
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
      <PageGrid ref={ref as React.Ref<HTMLDivElement>}
        className={clsx('bds-card-stats', className)}
        {...rest}
      >
        <PageGrid.Row>
          <PageGrid.Col span={{ base: 4, md: 6, lg: 8 }}>
            {/* Header section */}
            <div className="bds-card-stats__header">
              <h2 className="mb-0 h-md">{heading}</h2>
              {description && (
                <p className="bmb-0 body-l">
                  {description}
                </p>
              )}
            </div>
          </PageGrid.Col>
        </PageGrid.Row>
        <PageGrid.Row>
          {cards.map((cardConfig, index) => (
            <CardStat
              key={index}
              {...cardConfig}
              span={cardConfig.span ?? { base: 4, md: 4, lg: 4 }}
            />
          ))}
        </PageGrid.Row>
      </PageGrid>
    );
  }
);

CardStats.displayName = 'CardStats';

export default CardStats;

