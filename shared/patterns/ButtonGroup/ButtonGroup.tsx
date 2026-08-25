import React from 'react';
import clsx from 'clsx';
import { Button } from '../../components/Button/Button';
import type { ButtonEmphasis, ButtonSurface } from '../../components/Button';
import { Link } from '../../components/Link';
import type { LinkColorProps } from '../../components/Link';
import { XrplArrowInternalLinkIcon } from '../../components/Icons';

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

  // Every entry in the set is subtle — either forced, or the 3+ default — so
  // the set sits flush with the text above it. A mixed set keeps its natural
  // left edge because the leading button is filled.
  //
  // Flush is what makes these Links rather than Buttons. button.md: a subtle
  // Button and a resting Link are byte-identical in colour and both underlined,
  // and geometry is one of only two things telling them apart — so a subtle
  // Button pulled flush with the copy beside it has given up the difference.
  // These navigate, so they render as what they are. See
  // components/Button/button-vs-link-candidates.md.
  //
  // No negative margin comes with it any more: that offset existed to cancel
  // the button's own padding, and a Link has none to cancel.
  const isFlush = forceEmphasis === 'subtle' || (isMultiButton && !forceEmphasis);

  const classNames = clsx(
    'bds-button-group',
    `bds-button-group--gap-${gap}`,
    {
      'bds-button-group--block': isMultiButton,
      'bds-button-group--links': isFlush,
    },
    className
  );

  // `surface` is a ButtonSurface, whose members are the same intention/context
  // pairs Link accepts — including the shared rule that neutral + on-saturated
  // does not exist. The cast is between the two unions, not to a flat object:
  // splitting them into independent fields would let `neutral` pair with
  // `on-saturated`, which is the one combination both unions exist to reject.
  // Spread as a unit for the same reason.
  const linkSurface = surface as LinkColorProps;

  /**
   * One entry, as a Link when the set is flush and the entry navigates.
   *
   * An `onClick` entry with no `href` has nothing to navigate to, so it stays a
   * Button — `Link` requires an `href` and would have nowhere to point.
   */
  const renderAction = (
    button: ButtonConfig,
    key: number,
    emphasis: ButtonEmphasis
  ) => {
    if (isFlush && button.href) {
      return (
        <Link
          key={key}
          href={button.href}
          variation="standalone"
          iconEnd
          {...linkSurface}
        >
          {button.label}
        </Link>
      );
    }

    if (isFlush && process.env.NODE_ENV === 'development') {
      console.warn(
        `[ButtonGroup] "${button.label}" has no href, so it stays a Button in a ` +
        `set that otherwise renders as Links. Give it an href, or move the ` +
        `action out of a flush group.`
      );
    }

    return (
      <Button
        key={key}
        emphasis={emphasis}
        {...surface}
        href={button.href}
        onClick={button.onClick}
        iconEnd={<XrplArrowInternalLinkIcon />}
      >
        {button.label}
      </Button>
    );
  };

  // Render 3+ buttons: block layout, subtle unless forceEmphasis says otherwise
  if (isMultiButton) {
    return (
      <div className={classNames}>
        {buttonList.map((button, index) =>
          renderAction(button, index, effectiveEmphasis)
        )}
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
      {buttonList[0] && renderAction(buttonList[0], 0, firstButtonEmphasis)}
      {buttonList[1] && renderAction(buttonList[1], 1, secondButtonEmphasis)}
    </div>
  );
};

export default ButtonGroup;
