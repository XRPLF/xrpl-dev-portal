import React, { useMemo } from 'react';
import clsx from 'clsx';
import { PageGrid, PageGridCol, PageGridRow } from 'shared/components/PageGrid/page-grid';
import { TileLogo, TileLogoProps } from '../../components/TileLogo/TileLogo';
import { calculateTileOffset } from 'shared/utils/helpers';

export interface LogoItem extends TileLogoProps {}

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
 * and dynamic offset based on tile count. Features 9:5 aspect ratio rectangle tiles
 * with 2 color variants and dark mode support.
 *
 * Offset Logic (lg breakpoint only, applied to first tile):
 * - 1 tile: offset 9
 * - 2 tiles: offset 6
 * - 3 tiles: offset 3
 * - 4 tiles: offset 9
 * - 5 tiles: offset 6
 * - 6 tiles: offset 3
 * - 7 tiles: offset 9
 * - 8 tiles: offset 6
 * - 9 tiles: offset 3
 * - 10+ tiles: no offset
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
  className,
}) => {
  // Build class names using BEM with bds namespace
  const classNames = clsx(
    'bds-logo-rectangle-grid',
    `bds-logo-rectangle-grid--${variant}`,
  );

  // Memoize offset calculations - only recalculate when logos array changes
  const logoOffsets = useMemo(() => {
    const total = logos.length;
    return logos.map((_, index) => calculateTileOffset(index, total));
  }, [logos]);

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
        {logos.map((logo, index) => {
          const offset = logoOffsets[index];
          const hasOffset = offset.md > 0 || offset.lg > 0;
          return (
            <PageGridCol
              key={index}
              span={{ base: 2, md: 2, lg: 3 }}
              offset={hasOffset ? { md: offset.md, lg: offset.lg } : undefined}
            >
              <TileLogo
                shape="rectangle"
                variant={variant === 'gray' ? 'neutral' : 'green'}
                {...logo}
              />
            </PageGridCol>
          );
        })}
      </PageGridRow>
    </PageGrid>
  );
};

export default LogoRectangleGrid;
