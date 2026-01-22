import React from 'react';
import clsx from 'clsx';
import { PageGrid, PageGridCol, PageGridRow } from 'shared/components/PageGrid/page-grid';
import { TileLogo } from '../../components/TileLogo/TileLogo';
import { ButtonGroup } from '../../components/ButtonGroup/ButtonGroup';

export interface LogoItem {
  /** Logo image source URL */
  src: string;
  /** Alt text for the logo image */
  alt: string;
  /** Optional link URL - makes the logo clickable */
  href?: string;
  /** Optional click handler - makes the logo a button */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
}

export interface LogoSquareGridProps {
  /** Color variant - determines background color */
  variant?: 'gray' | 'green';
  /** Optional heading text */
  heading?: string;
  /** Optional description text */
  description?: string;
  /** Primary button configuration */
  primaryButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  /** Tertiary button configuration */
  tertiaryButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
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
 *   primaryButton={{ label: "View All Partners", href: "/partners" }}
 *   tertiaryButton={{ label: "Become a Partner", href: "/partner-program" }}
 *   logos={[
 *     { src: "/logos/partner1.svg", alt: "Partner 1", href: "https://partner1.com" }
 *   ]}
 * />
 */
export const LogoSquareGrid: React.FC<LogoSquareGridProps> = ({
  variant = 'gray',
  heading,
  description,
  primaryButton,
  tertiaryButton,
  logos,
  className = '',
}) => {
  // Build class names using BEM with bds namespace
  const classNames = clsx(
    'bds-logo-square-grid',
    `bds-logo-square-grid--${variant}`,
    className
  );

  // Determine if we should show the header section
  const hasHeader = !!(heading || description || primaryButton || tertiaryButton);

  return (
    <PageGrid className="">
      <PageGridRow>
        <PageGridCol span={{ base: 4, md: 6, lg: 8 }}>
            {/* Header Section */}
            {hasHeader && (
              <div className="bds-logo-square-grid__header">
                {/* Text Content */}
                {(heading || description) && (
                  <div className="bds-logo-square-grid__text">
                    {heading && <h4 className="h-md mb-0">{heading}</h4>}
                    {description && <p className="body-l mb-0">{description}</p>}
                  </div>
                )}

                {/* Buttons */}
                <ButtonGroup
                  primaryButton={primaryButton}
                  tertiaryButton={tertiaryButton}
                  color="green"
                  gap="small"
                />
              </div>
            )}
        </PageGridCol>
      </PageGridRow>
      <PageGridRow>
        {logos.map((logo, index) => (
          <PageGridCol key={index} span={{ base: 2, lg: 3 }}>
            <TileLogo
              shape="square"
              variant={variant === 'gray' ? 'neutral' : 'green'}
              logo={logo.src}
              alt={logo.alt}
              href={logo.href}
              onClick={logo.onClick}
              disabled={logo.disabled}
            />
          </PageGridCol>
        ))}
      </PageGridRow>
    </PageGrid>
  );
};

export default LogoSquareGrid;
