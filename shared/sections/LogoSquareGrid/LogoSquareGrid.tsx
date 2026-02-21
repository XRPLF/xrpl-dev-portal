import React from 'react';
import clsx from 'clsx';
import { PageGrid, PageGridCol, PageGridRow } from 'shared/components/PageGrid/page-grid';
import { SectionHeader } from 'shared/patterns/SectionHeader';
import { TileLogo, TileLogoProps } from '../../components/TileLogo/TileLogo';
import { ButtonGroup, ButtonConfig, validateButtonGroup } from '../../patterns/ButtonGroup/ButtonGroup';

export interface LogoItem extends TileLogoProps {}

export interface LogoSquareGridProps {
  /** Color variant - determines background color */
  variant?: 'gray' | 'green';
  /** Optional heading text */
  heading?: string;
  /** Optional description text */
  description?: string;
  /** Button configurations (1-2 buttons supported) */
  buttons?: ButtonConfig[];
  /** Array of logo items to display in the grid */
  logos: LogoItem[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * LogoSquareGrid Component
 * 
 * A responsive grid pattern for displaying company/partner logos with an optional header section.
 * Features square tiles arranged in a responsive grid with 2 color variants and dark mode support.
 * 
 * @example
 * // Basic usage with gray variant
 * <LogoSquareGrid
 *   variant="gray"
 *   heading="Developer tools & APIs"
 *   description="Streamline development with comprehensive tools."
 *   logos={[
 *     { src: "/logos/company1.svg", alt: "Company 1" },
 *     { src: "/logos/company2.svg", alt: "Company 2" }
 *   ]}
 * />
 * 
 * @example
 * // With buttons and clickable logos
 * <LogoSquareGrid
 *   variant="green"
 *   heading="Our Partners"
 *   description="Leading companies building on XRPL."
 *   buttons={[
 *     { label: "View All Partners", href: "/partners" },
 *     { label: "Become a Partner", href: "/partner-program" }
 *   ]}
 *   logos={[
 *     { src: "/logos/partner1.svg", alt: "Partner 1", href: "https://partner1.com" }
 *   ]}
 * />
 */
export const LogoSquareGrid: React.FC<LogoSquareGridProps> = ({
  variant = 'gray',
  heading,
  description,
  buttons,
  logos,
  className = '',
}) => {
  // Validate buttons if provided (max 2 buttons supported)
  const buttonValidation = validateButtonGroup(buttons, 2);
  const hasButtons = buttonValidation.hasButtons;

  // Build class names using BEM with bds namespace
  const classNames = clsx(
    'bds-logo-square-grid',
    `bds-logo-square-grid--${variant}`,
    className
  );

  return (
    <PageGrid className={classNames}>
      <SectionHeader
        heading={heading}
        description={description}
        as="h4"
        span={{ base: 4, md: 6, lg: 8 }}
        className="bds-logo-square-grid__section-header"
      >
        {hasButtons && (
          <ButtonGroup
            buttons={buttonValidation.buttons}
            color="green"
            gap="small"
          />
        )}
      </SectionHeader>
      <PageGridRow>
        {logos.map((logo, index) => (
          <PageGridCol key={index} span={{ base: 2, lg: 3 }}>
            <TileLogo
              shape="square"
              variant={variant === 'gray' ? 'neutral' : 'green'}
              {...logo}
            />
          </PageGridCol>
        ))}
      </PageGridRow>
    </PageGrid>
  );
};

export default LogoSquareGrid;
