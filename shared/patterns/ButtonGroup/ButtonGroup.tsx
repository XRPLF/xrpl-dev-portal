import React from 'react';
import clsx from 'clsx';
import { Button } from '../../components/Button/Button';

export interface ButtonConfig {
  /** Button text label */
  label: string;
  /** URL to navigate to - renders button as a link */
  href?: string;
  /** Force the color to remain constant regardless of theme mode */
  forceColor?: boolean;
  /** Click handler - matches Button component's onClick signature */
  onClick?: () => void;
}

export interface ButtonGroupProps {
  /** Primary button configuration */
  primaryButton?: ButtonConfig;
  /** Tertiary button configuration */
  tertiaryButton?: ButtonConfig;
  /** Button color theme */
  color?: 'green' | 'black';
  /** Whether to force the color to remain constant regardless of theme mode */
  forceColor?: boolean; 
  /** Gap between buttons on tablet+ (0px or 4px) */
  gap?: 'none' | 'small';
  /** Additional CSS classes */
  className?: string;
}

/**
 * ButtonGroup Component
 * 
 * A responsive button group container that displays primary and/or tertiary buttons.
 * Stacks vertically on mobile and horizontally on tablet+.
 * 
 * @example
 * // Basic usage with both buttons
 * <ButtonGroup
 *   primaryButton={{ label: "Get Started", href: "/start" }}
 *   tertiaryButton={{ label: "Learn More", href: "/learn" }}
 *   color="green"
 * />
 * 
 * @example
 * // With custom gap
 * <ButtonGroup
 *   primaryButton={{ label: "Action", onClick: handleClick }}
 *   color="black"
 *   gap="small"
 * />
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  primaryButton,
  tertiaryButton,
  color = 'green',
  forceColor = false,
  gap = 'small',
  className = '',
}) => {
  // Don't render if no buttons are provided
  if (!primaryButton && !tertiaryButton) {
    return null;
  }

  const classNames = clsx(
    'bds-button-group',
    `bds-button-group--gap-${gap}`,
    className
  );

  return (
    <div className={classNames}>
      {primaryButton && (
        <Button
          variant="primary"
          color={color}
          forceColor={forceColor}
          href={primaryButton.href}
          onClick={primaryButton.onClick}
        >
          {primaryButton.label}
        </Button>
      )}
      {tertiaryButton && (
        <Button
          variant="tertiary"
          color={color}
          forceColor={forceColor}
          href={tertiaryButton.href}
          onClick={tertiaryButton.onClick}
        >
          {tertiaryButton.label}
        </Button>
      )}
    </div>
  );
};

export default ButtonGroup;
