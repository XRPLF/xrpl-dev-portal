import React from 'react';
import clsx from 'clsx';
import { PageGrid, PageGridRow, PageGridCol } from 'shared/components/PageGrid/page-grid';
import { CardTextIconCard, CardTextIconCardProps } from 'shared/components/CardTextIcon';

export interface CardsTextGridProps {
  /** Section heading (required) */
  heading: string;
  /** Optional description text */
  description?: string;
  /** Array of card data to display */
  cards: CardTextIconCardProps[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * CardsTextGrid Component
 *
 * A section pattern with a header (heading + description) and a grid of
 * CardTextIconCard components. Uses PageGrid.Row as="ul" with cards as
 * PageGrid.Col as="li". Aspect ratios: sm 16:9, md 3:2, lg 3:1.
 *
 * @example
 * <CardsTextGrid
 *   heading="Explore Tools"
 *   description="Choose a tool to get started"
 *   cards={[
 *     { icon: "/icons/docs.svg", heading: "Documentation", description: "..." },
 *   ]}
 * />
 */
export const CardsTextGrid: React.FC<CardsTextGridProps> = ({
  heading,
  description,
  cards,
  className,
}) => {
  return (
    <PageGrid className={clsx('bds-cards-text-grid', className)}>
      <PageGridRow>
        <PageGridCol className="bds-cards-text-grid__header" span={{ base: 12, md: 6, lg: 8 }}>
          <h2 className="h-md">{heading}</h2>
          {description && <p className="body-l">{description}</p>}
        </PageGridCol>
      </PageGridRow>

      <PageGridRow as="ul" className="bds-cards-text-grid__list list-none pl-0">
        {cards.map((card, index) => (
          <CardTextIconCard
            key={card.heading || index}
            heading={card.heading}
            description={card.description}
            gridColSpan={{ base: 4, md: 4, lg: 6 }}
          />
        ))}
      </PageGridRow>
    </PageGrid>
  );
};

export default CardsTextGrid;
