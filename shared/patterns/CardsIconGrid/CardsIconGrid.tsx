import React from 'react';
import clsx from 'clsx';
import { PageGrid, PageGridRow, PageGridCol } from 'shared/components/PageGrid/page-grid';
import { CardTextIconCard } from 'shared/components/CardTextIcon';

export interface CardTextIconCardData {
  /** Icon image URL */
  icon: string;
  /** Alt text for the icon image */
  iconAlt?: string;
  /** Card heading */
  heading: string;
  /** Card description; accepts rich content (e.g., text with inline links) */
  description: React.ReactNode;
  /** Optional height for the icon image */
  height?: number;
  /** Optional width for the icon image */
  width?: number;
}

export interface CardsIconGridProps {
  /** Section heading (required) */
  heading: string;
  /** Optional description text */
  description?: string;
  /** Array of card data to display */
  cards: CardTextIconCardData[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * CardsIconGrid Component
 *
 * A section pattern with a header (heading + description) and a grid of
 * CardTextIconCard components. Uses PageGrid.Row as="ul" with cards as
 * PageGrid.Col as="li". Aspect ratios: sm 3:2, md/lg 4:3.
 *
 * @example
 * <CardsIconGrid
 *   heading="Explore Tools"
 *   description="Choose a tool to get started"
 *   cards={[
 *     { icon: "/icons/docs.svg", heading: "Documentation", description: "..." },
 *   ]}
 * />
 */
export const CardsIconGrid: React.FC<CardsIconGridProps> = ({
  heading,
  description,
  cards,
  className,
}) => {
  return (
    <PageGrid className={clsx('bds-cards-icon-grid', className)}>
      <PageGridRow>
        <PageGridCol className="bds-cards-icon-grid__header" span={{ base: 12, md: 6, lg: 8 }}>
          <h2 className="h-md">{heading}</h2>
          {description && <p className="body-l">{description}</p>}
        </PageGridCol>
      </PageGridRow>

      <PageGridRow as="ul" className="bds-cards-icon-grid__list list-none pl-0">
        {cards.map((card, index) => (
          <CardTextIconCard
            key={card.heading || index}
            icon={card.icon}
            iconAlt={card.iconAlt}
            heading={card.heading}
            description={card.description}
            height={card.height}
            width={card.width}
            gridColSpan={{ base: 4, md: 4, lg: 4 }}
          />
        ))}
      </PageGridRow>
    </PageGrid>
  );
};

export default CardsIconGrid;
