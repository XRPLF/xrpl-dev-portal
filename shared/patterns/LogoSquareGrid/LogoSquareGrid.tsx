import React, { useMemo, memo } from 'react';
import clsx from 'clsx';
import { PageGrid, PageGridCol, PageGridRow, type PageGridColProps } from 'shared/components/PageGrid/page-grid';
import { TileLogo } from '../../components/TileLogo/TileLogo';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';

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
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };
  /** Tertiary button configuration */
  tertiaryButton?: {
    label: string;
    href?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };
  /** Array of logo items to display in the grid */
  logos: LogoItem[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * Generates a stable key for a logo based on its properties.
 * Falls back to index if no stable identifier is available.
 */
const getLogoKey = (logo: LogoItem, index: number): string | number => {
  if (logo.href) return logo.href;
  if (logo.alt) return `${logo.alt}-${index}`;
  return index;
};

/**
 * Memoized logo list item component to prevent unnecessary re-renders
 */
const LogoListItem = memo<{
  logo: LogoItem;
  variant: 'neutral' | 'green';
}>(({ logo, variant }) => (
  <li className="bds-logo-square-grid__logo-item">
    <TileLogo
      shape="square"
      variant={variant}
      logo={logo.src}
      alt={logo.alt}
      href={logo.href}
      onClick={logo.onClick}
      disabled={logo.disabled}
    />
  </li>
));

LogoListItem.displayName = 'LogoListItem';

/**
 * LogoSquareGrid Component
 *
 * A responsive grid pattern for displaying company/partner logos with an optional header section.
 * Features square tiles arranged in a responsive grid with 2 color variants and dark mode support.
 *
 * Offset Logic (based on logo count):
 * - 1 logo: lg offset 11, md offset 6, base no offset
 * - 2 logos: lg offset 10, md offset 4, base no offset
 * - 3+ logos: no offset (left-aligned)
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
  const logoCount = logos.length;
  const tileVariant = variant === 'gray' ? 'neutral' : 'green';

  // Determine if we should show the header section
  const hasHeader = !!(heading || description || primaryButton || tertiaryButton);

  // Calculate offset based on logo count
  // 1 logo: lg offset 11, md offset 6, base no offset
  // 2 logos: lg offset 10, md offset 4, base no offset
  // 3+ logos: no offset
  const gridOffsetConfig: NonNullable<PageGridColProps['offset']> = useMemo(() => {
    if (logoCount === 1) {
      return { base: 0, md: 6, lg: 11 };
    } else if (logoCount === 2) {
      return { base: 0, md: 4, lg: 10 };
    }
    return { base: 0 };
  }, [logoCount]);

  // Calculate span based on logo count
  const gridSpanConfig: NonNullable<PageGridColProps['span']> = useMemo(() => {
    if (logoCount <= 2) {
      // For 1-2 logos, use auto span to fit content
      return 'fill';
    }
    return 'fill';
  }, [logoCount]);

  // Memoize logo items to prevent unnecessary re-renders
  const logoItems = useMemo(
    () =>
      logos.map((logo, index) => (
        <LogoListItem
          key={getLogoKey(logo, index)}
          logo={logo}
          variant={tileVariant}
        />
      )),
    [logos, tileVariant]
  );

  // Memoize grid class names
  const gridClassName = useMemo(
    () =>
      clsx('bds-logo-square-grid__logos-grid', {
        'bds-logo-square-grid__logos-grid--single': logoCount === 1,
        'bds-logo-square-grid__logos-grid--double': logoCount === 2,
      }),
    [logoCount]
  );

  return (
    <PageGrid className={className}>
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
        <PageGridCol
          className="bds-logo-square-grid__logos-wrapper"
          span={gridSpanConfig}
          offset={gridOffsetConfig}
        >
          <ul className={gridClassName} role="list">
            {logoItems}
          </ul>
        </PageGridCol>
      </PageGridRow>
    </PageGrid>
  );
};

export default LogoSquareGrid;
