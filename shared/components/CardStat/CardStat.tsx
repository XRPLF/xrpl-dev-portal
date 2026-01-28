import React from 'react';
import { Button } from '../Button';
import { PageGridCol } from '../PageGrid/page-grid';
import type { PageGridBreakpoint } from '../PageGrid/page-grid';

interface ButtonConfig {
  /** Button label text */
  label: string;
  /** Click handler for button */
  onClick?: () => void;
  /** Link href for button */
  href?: string;
}

/** Responsive span configuration for PageGridCol */
type SpanConfig = Partial<Record<PageGridBreakpoint, number>>;

export interface CardStatProps {
  /** The main statistic to display (e.g., "6 Million+") */
  statistic: string;
  /** Superscript text for the statistic (symbols like '*', '+' or numeric strings like '1', '12') */
  superscript?: string;
  /** Descriptive label for the statistic */
  label: string;
  /** Background color variant
   * - 'lilac': Purple/lavender background
   * - 'green': XRPL brand green background
   * - 'light-gray': Light gray background (#CAD4DF)
   * - 'dark-gray': Dark gray background (#8A919A)
   */
  variant?: 'lilac' | 'green' | 'light-gray' | 'dark-gray';
  /** Primary button configuration */
  primaryButton?: ButtonConfig;
  /** Secondary button configuration */
  secondaryButton?: ButtonConfig;
  /** Grid column span configuration - defaults to { base: 4, md: 4, lg: 4 } */
  span?: SpanConfig;
  /** Additional CSS classes */
  className?: string;
}

/**
 * BDS CardStat Component
 * 
 * A statistics card component following the XRPL Brand Design System.
 * Displays a prominent statistic with a descriptive label and optional CTA buttons.
 * 
 * Color variants:
 * - lilac: Purple/lavender background
 * - green: XRPL brand green background
 * - light-gray: Light gray background
 * - dark-gray: Dark gray background
 * 
 * @example
 * <CardStat 
 *   statistic="6 Million+" 
 *   label="Active wallets"
 *   variant="lilac"
 *   primaryButton={{ label: "Learn More", href: "/docs" }}
 * />
 */
/** Default span configuration */
const DEFAULT_SPAN: SpanConfig = { base: 4, md: 4, lg: 4 };

export const CardStat: React.FC<CardStatProps> = ({
  statistic,
  superscript,
  label,
  variant = 'lilac',
  primaryButton,
  secondaryButton,
  span = DEFAULT_SPAN,
  className = '',
}) => {
  // Build class names using BEM with bds namespace
  const classNames = [
    'bds-card-stat',
    `bds-card-stat--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasButtons = primaryButton || secondaryButton;

  // Check if superscript is a number (one or more digits), excluding + or - signs
  const isNumericSuperscript = superscript && /^[0-9]+$/.test(superscript);

  return (
    <PageGridCol span={span}>
      <div className={classNames}>
        {/* Text section */}
        <div className="bds-card-stat__text">
          <div className="bds-card-stat__statistic">
            {statistic}{superscript && <sup className={isNumericSuperscript ? 'bds-card-stat__superscript--numeric' : ''}>{superscript}</sup>}</div>
          <div className="body-r">{label}</div>
        </div>

        {/* Buttons section */}
        {hasButtons && (
          <div className="bds-card-stat__buttons">
            {primaryButton && (
              <Button
                forceColor
                variant="primary"
                color="black"
                href={primaryButton.href}
                onClick={primaryButton.onClick}
              >
                {primaryButton.label}
              </Button>
            )}
            {secondaryButton && (
              <Button
                forceColor
                variant="secondary"
                color="black"
                href={secondaryButton.href}
                onClick={secondaryButton.onClick}
              >
                {secondaryButton.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </PageGridCol>
  );
};

export default CardStat;
