import { ButtonConfig, validateButtonGroup, ButtonGroupValidationResult } from './ButtonGroup';

/**
 * Validates and prepares button configurations for use in components
 * 
 * @param buttons - Optional array of button configurations
 * @param maxButtons - Maximum number of buttons allowed (default: unlimited)
 * @returns Object containing validation result and helper flags
 * 
 * @example
 * ```tsx
 * const { validation, hasButtons } = useButtonValidation(buttons, 2);
 * 
 * if (hasButtons) {
 *   <ButtonGroup buttons={validation.buttons} color="green" />
 * }
 * ```
 */
export interface ButtonValidationHelper {
  /** Validation result from validateButtonGroup */
  validation: ButtonGroupValidationResult | null;
  /** True if there are valid buttons to render */
  hasButtons: boolean;
}

/**
 * Validates button configurations and returns validation result with helper flags
 * 
 * @param buttons - Optional array of button configurations
 * @param maxButtons - Maximum number of buttons allowed
 * @param logWarnings - Whether to log warnings in development mode (default: true)
 * @returns ButtonValidationHelper object
 */
export function useButtonValidation(
  buttons: ButtonConfig[] | undefined,
  maxButtons?: number,
  logWarnings: boolean = true
): ButtonValidationHelper {
  // Validate buttons if provided
  const validation = buttons ? validateButtonGroup(buttons, maxButtons) : null;

  // Log warnings in development mode
  if (
    logWarnings &&
    process.env.NODE_ENV === 'development' &&
    validation?.warnings.length
  ) {
    validation.warnings.forEach(warning => console.warn(warning));
  }

  // Check if there are any valid buttons
  const hasButtons = validation?.isValid && validation.buttons.length > 0;

  return {
    validation,
    hasButtons: hasButtons ?? false,
  };
}

/**
 * Validates button configurations and logs warnings (legacy helper)
 * 
 * @deprecated Use useButtonValidation instead for better type safety and helper flags
 * 
 * @param buttons - Optional array of button configurations
 * @param maxButtons - Maximum number of buttons allowed
 * @returns ButtonGroupValidationResult or null
 */
export function validateAndLogButtons(
  buttons: ButtonConfig[] | undefined,
  maxButtons?: number
): ButtonGroupValidationResult | null {
  const { validation } = useButtonValidation(buttons, maxButtons, true);
  return validation;
}

