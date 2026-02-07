import React, { useMemo } from 'react';
import clsx from 'clsx';
import { PageGrid, PageGridRow, PageGridCol } from 'shared/components/PageGrid/page-grid';
import { TileLink, TileLinkProps } from '../TileLinks/TileLink';
import { calculateTileOffset } from 'shared/utils/helpers';

export interface LinkItem extends Omit<TileLinkProps, 'variant'> {}

export interface LinkSmallGridProps {
  /** Color variant - determines tile background color */
  variant?: 'gray' | 'lilac';
  /** Heading text (required) */
  heading: string;
  /** Optional description text */
  description?: string;
  /** Array of link items to display in the grid */
  links: LinkItem[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * LinkSmallGrid Component
 *
 * A responsive grid section pattern for displaying navigational links using TileLink components.
 * Features a heading, optional description, and a grid of clickable tiles with 2 color variants
 * and full light/dark mode support.
 *
 * Grid Layout:
 * - Mobile (< 768px): 1 column (full width)
 * - Tablet (768px - 1023px): 2 columns
 * - Desktop (≥ 1024px): 4 columns
 *
 * Each tile uses the TileLink component which features:
 * - Window shade hover animation
 * - Arrow icon with animation
 * - Responsive sizing (64px height)
 * - Support for both links (href) and buttons (onClick)
 *
 * @example
 * // Basic usage with gray variant
 * <LinkSmallGrid
 *   variant="gray"
 *   heading="Quick Links"
 *   description="Navigate to key sections"
 *   links={[
 *     { label: "Documentation", href: "/docs" },
 *     { label: "Tutorials", href: "/tutorials" }
 *   ]}
 * />
 *
 * @example
 * // Lilac variant with click handlers
 * <LinkSmallGrid
 *   variant="lilac"
 *   heading="Get Started"
 *   links={[
 *     { label: "Quick Start", onClick: () => navigate('/start') },
 *     { label: "Examples", href: "/examples" }
 *   ]}
 * />
 */
export const LinkSmallGrid: React.FC<LinkSmallGridProps> = ({
  variant = 'gray',
  heading,
  description,
  links,
  className,
}) => {
  // Build class names using BEM with bds namespace
  const classNames = clsx(
    'bds-link-small-grid',
    `bds-link-small-grid--${variant}`,
    className
  );

  // Memoize offset calculations - only recalculate when links array changes
  const linkOffsets = useMemo(() => {
    const total = links.length;
    return links.map((_, index) => calculateTileOffset(index, total));
  }, [links]);

  return (
    <section className={classNames}>
      <PageGrid>
        <PageGridRow>
          <PageGridCol span={{ base: 4, md: 6, lg: 8 }}>
            {/* Header Section */}
            <div className="bds-link-small-grid__header">
              <h2 className="bds-link-small-grid__heading h-md">{heading}</h2>
              {description && (
                <p className="body-l mb-0">{description}</p>
              )}
            </div>
          </PageGridCol>
        </PageGridRow>
        <PageGridRow>
          {links.map((link, index) => {
            const offset = linkOffsets[index];
            const hasOffset = offset.lg > 0;
            // Use href or label as key, fallback to index
            const key = link.href || link.label || index;
            return (
              <PageGridCol
                key={key}
                span={{ base: 4, md: 4, lg: 3 }}
                offset={hasOffset ? { lg: offset.lg } : undefined}
              >
                <TileLink
                  variant={variant}
                  {...link}
                />
              </PageGridCol>
            );
          })}
        </PageGridRow>
      </PageGrid>
    </section>
  );
};

export default LinkSmallGrid;

