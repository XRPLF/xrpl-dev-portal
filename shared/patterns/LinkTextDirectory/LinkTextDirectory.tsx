import React from 'react';
import clsx from 'clsx';
import { LinkTextCard } from '../LinkTextCard';
import { ButtonConfig } from '../ButtonGroup';
import { PageGrid, PageGridRow, PageGridCol } from 'shared/components/PageGrid/page-grid';

export interface LinkTextCardData {
  /** Heading text for the card */
  heading: string;
  /** Description text for the card */
  description: string;
  /** Array of button configurations (max 2) */
  buttons: ButtonConfig[];
}

export interface LinkTextDirectoryProps {
  /** Section heading (required) */
  heading: string;
  /** Optional description text */
  description?: string;
  /** Array of card data to display */
  cards: LinkTextCardData[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * LinkTextDirectory Component
 *
 * A section pattern that displays a numbered list of LinkTextCard components.
 * Features a heading, optional description, and a vertically stacked list of cards
 * with automatic sequential numbering (01, 02, 03...).
 *
 * Layout:
 * - Header section with heading + description
 * - Responsive vertical spacing between cards
 * - Desktop: Right-aligned cards with 40px gaps
 * - Tablet: Left-aligned cards with 32px gaps
 * - Mobile: Left-aligned cards with 24px gaps
 *
 * @example
 * // Basic usage
 * <LinkTextDirectory
 *   heading="Explore XRPL Developer Tools"
 *   description="XRP Ledger is a compliance-focused blockchain where financial applications come to life"
 *   cards={[
 *     {
 *       heading: "Fast Settlement and Low Fees",
 *       description: "Settle transactions in 3-5 seconds for a fraction of a cent",
 *       buttons: [
 *         { label: "Get Started", href: "/start" },
 *         { label: "Learn More", href: "/docs" }
 *       ]
 *     },
 *     {
 *       heading: "Secure and Reliable",
 *       description: "Built on proven blockchain technology",
 *       buttons: [{ label: "Read Docs", href: "/docs" }]
 *     }
 *   ]}
 * />
 *
 * @example
 * // Without description
 * <LinkTextDirectory
 *   heading="Features"
 *   cards={cardData}
 * />
 */
export const LinkTextDirectory: React.FC<LinkTextDirectoryProps> = ({
  heading,
  description,
  cards,
  className,
}) => {
  return (
    <PageGrid className={clsx('bds-link-text-directory', className)}>
      {/* Header Section */}
      <PageGridRow>
        <PageGridCol className="bds-link-text-directory__header" span={{ base: 12, md: 6, lg: 8}}>
          <h2 className="h-md">{heading}</h2>
          {description && <p className="body-l">{description}</p>}
        </PageGridCol>
      </PageGridRow>

      {/* Cards List */}
      <PageGridRow className="bds-link-text-directory__list">
        <PageGridCol span={{ base: 12, md: 8, lg: 8}} offset={{ lg: 4 }}>
          <ul className="list-none pl-0">
          {cards.map((card, index) => (
            <LinkTextCard
              key={card.heading || index}
              index={index}
              heading={card.heading}
              description={card.description}
              buttons={card.buttons}
            />
          ))}
          </ul>
        </PageGridCol>
      </PageGridRow >
    </PageGrid>
  );
};

export default LinkTextDirectory;
