import React from 'react';
import { Button } from '../Button';

interface ButtonConfig {
  /** Button label text */
  label: string;
  /** Click handler for button */
  onClick?: () => void;
  /** Link href for button */
  href?: string;
}

export interface CardStatProps {
  /** The main statistic to display (e.g., "6 Million+") */
  statistic: string;
  /** Superscript text for the statistic */
  superscript?: '*' | '+' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0';
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
export const CardStat: React.FC<CardStatProps> = ({
  statistic,
  superscript,
  label,
  variant = 'lilac',
  primaryButton,
  secondaryButton,
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

  return (
    <div className={classNames}>
      <div className="bds-card-stat__content">
        {/* Text section */}
        <div className="bds-card-stat__text">
          <div className="bds-card-stat__statistic">
            {statistic}{superscript && <sup>{superscript}</sup>}</div>
          <div className="body-r">{label}</div>
        </div>

        {/* Buttons section */} 
        {hasButtons && (
          <div className="bds-card-stat__buttons">
            {primaryButton && (
              primaryButton.href ? (
                <a href={primaryButton.href}>
                  <Button variant="primary" color="black">
                    {primaryButton.label}
                  </Button>
                </a>
              ) : (
                <Button 
                  variant="primary" 
                  color="black"
                  onClick={primaryButton.onClick}
                >
                  {primaryButton.label}
                </Button>
              )
            )}
            {secondaryButton && (
              secondaryButton.href ? (
                <a href={secondaryButton.href}>
                  <Button variant="secondary" color="black">
                    {secondaryButton.label}
                  </Button>
                </a>
              ) : (
                <Button 
                  variant="secondary" 
                  color="black"
                  onClick={secondaryButton.onClick}
                >
                  {secondaryButton.label}
                </Button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardStat;
