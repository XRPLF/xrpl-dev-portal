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
 * Calculates the md and lg offsets for the first tile of each row to right-align the grid.
 *
 * This is a 3-tile-per-row grid. To right-align, we offset based on how many tiles are in that row:
 *
 * lg (12 columns, each tile = 3 cols):
 * - 3 tiles in row: offset 3
 * - 2 tiles in row: offset 6
 * - 1 tile in row: offset 9
 *
 * md (8 columns, each tile = 2 cols):
 * - 3 tiles in row: offset 2
 * - 2 tiles in row: offset 4
 * - 1 tile in row: offset 6
 *
 * Only tiles 1-9 (positions 0-8) are right-aligned. 10+ tiles = no offset.
 *
 * @param index - The tile's position (0-based)
 * @param total - Total number of tiles
 * @returns Object with md and lg offset values for this tile (both 0 if not first of row)
 */
const calculateTileOffset = (index: number, total: number): { md: number; lg: number } => {
  // No offset if 10+ tiles total
  if (total >= 10) return { md: 0, lg: 0 };

  // Only first tile of each row gets offset (every 3rd position starting at 0)
  if (index % 3 !== 0) return { md: 0, lg: 0 };

  // Calculate which row this tile is in
  const row = Math.floor(index / 3);

  // Calculate how many tiles are in this row
  const tilesInThisRow = Math.min(3, total - row * 3);

  // Calculate offset to right-align
  // lg: (4 - tilesInRow) * 3 → 3 tiles = 3, 2 tiles = 6, 1 tile = 9
  // md: (4 - tilesInRow) * 2 → 3 tiles = 2, 2 tiles = 4, 1 tile = 6
  const lgOffset = (4 - tilesInThisRow) * 3;
  const mdOffset = (4 - tilesInThisRow) * 2;

  return { md: mdOffset, lg: lgOffset };
};

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
  className = '',
}) => {
  // Build class names using BEM with bds namespace
  const classNames = clsx(
    'bds-logo-rectangle-grid',
    `bds-logo-rectangle-grid--${variant}`,
    className
  );

  const total = logos.length;

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
          const offset = calculateTileOffset(index, total);
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
                logo={logo.src}
                alt={logo.alt}
                href={logo.href}
                onClick={logo.onClick}
                disabled={logo.disabled}
              />
            </PageGridCol>
          );
        })}
      </PageGridRow>
    </PageGrid>
  );
};

export default LogoRectangleGrid;
