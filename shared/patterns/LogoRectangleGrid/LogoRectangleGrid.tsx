import React from 'react';
import clsx from 'clsx';
import { PageGrid, PageGridCol, PageGridRow } from 'shared/components/PageGrid/page-grid';
import { TileLogo } from '../../components/TileLogo/TileLogo';

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

export interface LogoRectangleGridProps {
  /** Color variant - determines background color */
  variant?: 'gray' | 'green';
  /** Heading text (required) */
  heading: string;
  /** Optional description text */
  description?: string;
  /** Array of logo items to display in the grid */
  logos: LogoItem[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * LogoRectangleGrid Component
 * 
 * A responsive grid pattern for displaying company/partner logos with rectangle tiles
 * and dynamic alignment based on tile count. Features 9:5 aspect ratio rectangle tiles
 * with 2 color variants and dark mode support.
 * 
 * Alignment Logic:
 * - 1-3 tiles: Right-aligned
 * - 4 tiles: Left-aligned
 * - 5-9 tiles: Right-aligned
 * - 9+ tiles: Left-aligned
 * 
 * @example
 * // Basic usage with gray variant
 * <LogoRectangleGrid
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
 * // With clickable logos
 * <LogoRectangleGrid
 *   variant="green"
 *   heading="Our Partners"
 *   description="Leading companies building on XRPL."
 *   logos={[
 *     { src: "/logos/partner1.svg", alt: "Partner 1", href: "https://partner1.com" }
 *   ]}
 * />
 */
export const LogoRectangleGrid: React.FC<LogoRectangleGridProps> = ({
  variant = 'gray',
  heading,
  description,
  logos,
  className = '',
}) => {
  // Build class names using BEM with bds namespace
  const classNames = clsx(
    'bds-logo-rectangle-grid',
    `bds-logo-rectangle-grid--${variant}`,
    className
  );

  // Calculate alignment based on logo count
  // 1-3: right aligned, 4: left, 5-9: right, 9+: left
  const logoCount = logos.length;
  const alignRight = 
    (logoCount >= 1 && logoCount <= 3) || 
    (logoCount >= 5 && logoCount <= 9);

  return (
    <PageGrid className={classNames}>
      <PageGridRow>
        <PageGridCol span={{ base: 4, md: 6, lg: 8 }}>
          {/* Header Section */}
          <div className="bds-logo-rectangle-grid__header">
            <div className="bds-logo-rectangle-grid__text">
              <h4 className="h-md mb-0">{heading}</h4>
              {description && <p className="body-l mb-0">{description}</p>}
            </div>
          </div>
        </PageGridCol>
      </PageGridRow>
      <PageGridRow>
        <PageGridCol 
          span={{ base: "fill", lg: alignRight ? 8 : "fill" }}
          offset={{ base: 0, lg: alignRight ? 4 : 0 }}
        >
          <PageGridRow>
            {logos.map((logo, index) => (
              <PageGridCol key={index} span={{ base: 2, md: 2, lg: 3 }}>
                <TileLogo
                  shape="rectangle"
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
        </PageGridCol>
      </PageGridRow>
    </PageGrid>
  );
};

export default LogoRectangleGrid;
