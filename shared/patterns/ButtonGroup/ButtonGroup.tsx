import React from 'react';
import clsx from 'clsx';
import { Button } from '../../components/Button/Button';
import type { ButtonEmphasis, ButtonSurface } from '../../components/Button';

export interface ButtonConfig {
  /** Button text label */
  label: string;
  /** URL to navigate to - renders button as a link */
  href?: string;
  /** Click handler - matches Button component's onClick signature */
  onClick?: () => void;
}

export interface ButtonGroupValidationResult {
  /** The validated and potentially trimmed list of buttons */
  buttons: ButtonConfig[];
  /** Whether the button list is valid and should render */
  isValid: boolean;
  /** True if there are valid buttons to render (convenience flag) */
  hasButtons: boolean;
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
 * - Automatically logs warnings in development mode
 *
 * @param buttons - Array of button configurations (can be undefined)
 * @param maxButtons - Optional maximum number of buttons to render
 * @param autoLogWarnings - Whether to automatically log warnings in development mode (default: true)
 * @returns Validation result with processed buttons, validity flag, hasButtons flag, and warnings
 *
 * @example
 * // Basic usage with auto-logging
 * const validation = validateButtonGroup(buttons, 2);
 * if (validation.hasButtons) {
 *   <ButtonGroup buttons={validation.buttons} />
 * }
 *
 * @example
 * // Disable auto-logging
 * const validation = validateButtonGroup(buttons, 2, false);
 * // Handle warnings manually
 * validation.warnings.forEach(w => customLogger(w));
 */
export function validateButtonGroup(
  buttons: ButtonConfig[] | undefined,
  maxButtons?: number,
  autoLogWarnings: boolean = true
): ButtonGroupValidationResult {
  // Handle undefined/null buttons
  if (!buttons || buttons.length === 0) {
    return {
      buttons: [],
      isValid: false,
      hasButtons: false,
      warnings: []
    };
  }
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

    // Auto-log warnings in development mode
    if (autoLogWarnings && process.env.NODE_ENV === 'development' && warnings.length > 0) {
      warnings.forEach(warning => console.warn(warning));
    }

    return { buttons: [], isValid: false, hasButtons: false, warnings };
  }

  // Auto-log warnings in development mode
  if (autoLogWarnings && process.env.NODE_ENV === 'development' && warnings.length > 0) {
    warnings.forEach(warning => console.warn(warning));
  }

  const hasButtons = buttonList.length > 0;
  return { buttons: buttonList, isValid: true, hasButtons, warnings };
}

export interface ButtonGroupProps {
  /** Array of button configurations
   * - 1 button: renders with singleButtonEmphasis (default: strong)
   * - 2 buttons: first as strong, second as subtle
   * - 3+ buttons: all subtle in block layout
   */
  buttons: ButtonConfig[];
  /**
   * The token group every button in the set binds: `intention` and `context`
   * together, as one value. `context: 'on-saturated'` is mode-invariant and is
   * what a coloured, non-flipping block needs — it replaces the old
   * `color="black" forceColor` pair.
   *
   * Passed as a single object because the two axes are correlated — `neutral`
   * has no `on-saturated` group — and forwarding them as separate props would
   * discard the union that makes that combination fail to compile.
   */
  surface?: ButtonSurface;
  /** Gap between buttons: `none` / `small` follow base mobile spacing then adjust at md+; `medium` is 16px through tablet, 24px at lg+ */
  gap?: 'none' | 'small' | 'medium';
  /** Additional CSS classes */
  className?: string;
  /** Emphasis for a lone button (default: 'strong'). */
  singleButtonEmphasis?: Extract<ButtonEmphasis, 'strong' | 'standard'>;
  /**
   * Force every button to this emphasis, overriding the count-based defaults
   * (and `singleButtonEmphasis`). Use when a section's design calls for a
   * uniform treatment regardless of how many buttons are passed — e.g.
   * `forceEmphasis="subtle"` for an all-text-link group.
   * Layout (inline vs. block) still follows the button count.
   */
  forceEmphasis?: ButtonEmphasis;
  /** Maximum number of buttons to render. If more buttons are passed, only the first N will be rendered. */
  maxButtons?: number;
}

/**
 * ButtonGroup Component
 *
 * A responsive button group container that displays buttons with adaptive layout:
 * - 1 button: Renders with singleButtonEmphasis (default: strong, can be standard)
 * - 2 buttons: First as strong, second as subtle (responsive layout)
 * - 3+ buttons: All subtle in block layout
 *
 * Pass `forceEmphasis` to opt out of the count-based emphases and render every
 * button the same way; layout still follows the count.
 *
 * @example
 * // Single button
 * <ButtonGroup
 *   buttons={[{ label: "Get Started", href: "/start" }]}
 * />
 *
 * @example
 * // Two buttons (strong + subtle)
 * <ButtonGroup
 *   buttons={[
 *     { label: "Get Started", href: "/start" },
 *     { label: "Learn More", href: "/learn" }
 *   ]}
 * />
 *
 * @example
 * // Three or more buttons (all subtle, block layout)
 * <ButtonGroup
 *   buttons={[
 *     { label: "Option 1", href: "/option1" },
 *     { label: "Option 2", href: "/option2" },
 *     { label: "Option 3", href: "/option3" }
 *   ]}
 * />
 *
 * @example
 * // Uniform subtle treatment regardless of count (flush with surrounding text)
 * <ButtonGroup
 *   buttons={[{ label: "Learn More", href: "/learn" }]}
 *   forceEmphasis="subtle"
 * />
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  buttons,
  surface = {},
  gap = 'small',
  className = '',
  singleButtonEmphasis = 'strong',
  forceEmphasis,
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

  // The 3+ block layout is a flush-left stack, so it defaults to subtle.
  //
  // Padding is NOT stripped to achieve that flush edge. The spec fixes button
  // geometry across every emphasis, and a subtle button that loses its padding
  // is visually indistinguishable from a Link — geometry is one of only two
  // things telling them apart. The block layout pulls the stack back into
  // alignment from the container instead; see ButtonGroup.scss.
  const effectiveEmphasis = forceEmphasis ?? 'subtle';

  // Every button in the set is subtle — either forced, or the 3+ default. Only
  // then does the group sit flush with the text above it; a mixed set keeps its
  // natural left edge because the leading button is filled.
  const isFlush = forceEmphasis === 'subtle' || (isMultiButton && !forceEmphasis);

  const classNames = clsx(
    'bds-button-group',
    `bds-button-group--gap-${gap}`,
    {
      'bds-button-group--block': isMultiButton,
      'bds-button-group--flush': isFlush,
    },
    className
  );

  // Render 3+ buttons: block layout, subtle unless forceEmphasis says otherwise
  if (isMultiButton) {
    return (
      <div className={classNames}>
        {buttonList.map((button, index) => (
          <Button
            key={index}
            emphasis={effectiveEmphasis}
            {...surface}
            href={button.href}
            onClick={button.onClick}
          >
            {button.label}
          </Button>
        ))}
      </div>
    );
  }

  // Render 1-2 buttons
  // Single button: use singleButtonEmphasis (default: strong, can be standard)
  // Two buttons: first as strong, second as subtle
  const firstButtonEmphasis =
    forceEmphasis ?? (buttonList.length === 1 ? singleButtonEmphasis : 'strong');
  const secondButtonEmphasis = forceEmphasis ?? 'subtle';

  return (
    <div className={classNames}>
      {buttonList[0] && (
        <Button
          emphasis={firstButtonEmphasis}
          {...surface}
          href={buttonList[0].href}
          onClick={buttonList[0].onClick}
        >
          {buttonList[0].label}
        </Button>
      )}
      {buttonList[1] && (
        <Button
          emphasis={secondButtonEmphasis}
          {...surface}
          href={buttonList[1].href}
          onClick={buttonList[1].onClick}
        >
          {buttonList[1].label}
        </Button>
      )}
    </div>
  );
};

export default ButtonGroup;
