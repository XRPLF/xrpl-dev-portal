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

export interface ButtonGroupValidationResult {
  /** The validated and potentially trimmed list of buttons */
  buttons: ButtonConfig[];
  /** Whether the button list is valid and should render */
  isValid: boolean;
  /** Any warnings generated during validation */
  warnings: string[];
}

/**
 * Validates and processes a ButtonConfig array for ButtonGroup.
 *
 * Performs the following validations:
 * - Applies maxButtons limit if specified
 * - Checks for empty button arrays
 * - Validates individual button configs (label required, href or onClick recommended)
 *
 * @param buttons - Array of button configurations
 * @param maxButtons - Optional maximum number of buttons to render
 * @returns Validation result with processed buttons, validity flag, and warnings
 *
 * @example
 * const result = validateButtonGroup(buttons, 2);
 * if (!result.isValid) return null;
 * // Use result.buttons for rendering
 */
export function validateButtonGroup(
  buttons: ButtonConfig[],
  maxButtons?: number
): ButtonGroupValidationResult {
  const warnings: string[] = [];
  let buttonList = [...buttons];

  // Validate individual button configs
  buttonList.forEach((button, index) => {
    if (!button.label || button.label.trim() === '') {
      warnings.push(
        `[ButtonGroup] Button at index ${index} is missing a label. This button may not render correctly.`
      );
    }
    if (!button.href && !button.onClick) {
      warnings.push(
        `[ButtonGroup] Button "${button.label || `at index ${index}`}" has no href or onClick. Consider adding an action.`
      );
    }
  });

  // Apply maxButtons limit if specified
  if (maxButtons !== undefined && maxButtons > 0 && buttons.length > maxButtons) {
    warnings.push(
      `[ButtonGroup] ${buttons.length} buttons were passed but maxButtons is set to ${maxButtons}. ` +
      `Only the first ${maxButtons} button(s) will be rendered.`
    );
    buttonList = buttonList.slice(0, maxButtons);
  }

  // Check for empty array
  if (buttonList.length === 0) {
    warnings.push(
      `[ButtonGroup] No buttons to render. ` +
      `Either an empty buttons array was passed or all buttons were removed by maxButtons limit.`
    );
    return { buttons: [], isValid: false, warnings };
  }

  return { buttons: buttonList, isValid: true, warnings };
}

export interface ButtonGroupProps {
  /** Array of button configurations
   * - 1 button: renders with singleButtonVariant (default: primary)
   * - 2 buttons: first as primary, second as tertiary
   * - 3+ buttons: all tertiary in block layout
   */
  buttons: ButtonConfig[];
  /** Button color theme */
  color?: 'green' | 'black';
  /** Whether to force the color to remain constant regardless of theme mode */
  forceColor?: boolean;
  /** Gap between buttons on tablet+ (0px or 4px) */
  gap?: 'none' | 'small';
  /** Additional CSS classes */
  className?: string;
  /** Override variant for single button (default: 'primary', can be 'secondary') */
  singleButtonVariant?: 'primary' | 'secondary';
  /** Maximum number of buttons to render. If more buttons are passed, only the first N will be rendered. */
  maxButtons?: number;
}

/**
 * ButtonGroup Component
 *
 * A responsive button group container that displays buttons with adaptive layout:
 * - 1 button: Renders with singleButtonVariant (default: primary, can be secondary)
 * - 2 buttons: First as primary, second as tertiary (responsive layout)
 * - 3+ buttons: All tertiary in block layout
 *
 * @example
 * // Single button
 * <ButtonGroup
 *   buttons={[{ label: "Get Started", href: "/start" }]}
 *   color="green"
 * />
 *
 * @example
 * // Two buttons (primary + tertiary)
 * <ButtonGroup
 *   buttons={[
 *     { label: "Get Started", href: "/start" },
 *     { label: "Learn More", href: "/learn" }
 *   ]}
 *   color="green"
 * />
 *
 * @example
 * // Three or more buttons (all tertiary, block layout)
 * <ButtonGroup
 *   buttons={[
 *     { label: "Option 1", href: "/option1" },
 *     { label: "Option 2", href: "/option2" },
 *     { label: "Option 3", href: "/option3" }
 *   ]}
 *   color="green"
 * />
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  buttons,
  color = 'green',
  forceColor = false,
  gap = 'small',
  className = '',
  singleButtonVariant = 'primary',
  maxButtons,
}) => {
  // Validate and process buttons
  const validation = validateButtonGroup(buttons, maxButtons);

  // Log warnings in development mode
  if (process.env.NODE_ENV === 'development' && validation.warnings.length > 0) {
    validation.warnings.forEach(warning => console.warn(warning));
  }

  // Don't render if validation failed
  if (!validation.isValid) {
    return null;
  }

  const buttonList = validation.buttons;

  const isMultiButton = buttonList.length >= 3;

  const classNames = clsx(
    'bds-button-group',
    `bds-button-group--gap-${gap}`,
    {
      'bds-button-group--block': isMultiButton,
    },
    className
  );

  // Render 3+ buttons: all tertiary in block layout
  if (isMultiButton) {
    return (
      <div className={classNames}>
        {buttonList.map((button, index) => (
          <Button
            key={index}
            variant="tertiary"
            color={color}
            forceColor={forceColor}
            href={button.href}
            onClick={button.onClick}
            forceNoPadding
          >
            {button.label}
          </Button>
        ))}
      </div>
    );
  }

  // Render 1-2 buttons
  // Single button: use singleButtonVariant (default: primary, can be secondary)
  // Two buttons: first as primary, second as tertiary
  const firstButtonVariant = buttonList.length === 1 ? singleButtonVariant : 'primary';

  return (
    <div className={classNames}>
      {buttonList[0] && (
        <Button
          variant={firstButtonVariant}
          color={color}
          forceColor={forceColor}
          {...buttonList[0]}
        >
          {buttonList[0].label}
        </Button>
      )}
      {buttonList[1] && (
        <Button
          variant="tertiary"
          color={color}
          forceColor={forceColor}
          {...buttonList[1]}
        >
          {buttonList[1].label}
        </Button>
      )}
    </div>
  );
};

export default ButtonGroup;
