import React from 'react';
import clsx from 'clsx';
import { Link } from '@redocly/theme/components/Link/Link';

export interface ButtonProps {
  /** Button variant - determines visual style */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** Color theme - green (default) or black */
  color?: 'green' | 'black';
  /**
   * Force the color to remain constant regardless of theme mode.
   * When true, the button color will not change between light/dark modes.
   * Use this for buttons on colored backgrounds where black should stay black.
   */
  forceColor?: boolean;
  /** Button content/label */
  children: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the arrow icon */
  showIcon?: boolean;
  /** Accessibility label - defaults to button text if not provided */
  ariaLabel?: string;
  /** URL to navigate to - renders as a Link instead of button */
  href?: string;
  /** Link target - only applies when href is provided */
  target?: '_self' | '_blank';
}

/**
 * Animated Arrow Icon Component
 * The horizontal line shrinks from left to right on hover/focus,
 * while the chevron shifts right via the gap change.
 */
const ArrowIcon: React.FC = () => (
  <svg
    className="bds-btn__icon"
    width="15"
    height="14"
    viewBox="0 0 15 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Horizontal line - shrinks on hover */}
    <line
      className="bds-btn__icon-line"
      x1="0"
      y1="7"
      x2="14"
      y2="7"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeMiterlimit="10"
    />
    {/* Chevron - stays visible */}
    <path
      className="bds-btn__icon-chevron"
      d="M8.16755 1.16743L14.0005 7.00038L8.16755 12.8333"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeMiterlimit="10"
      fill="none"
    />
  </svg>
);

/**
 * BDS Button Component
 * 
 * A scalable button component following the XRPL Brand Design System.
 * Supports Primary, Secondary, and Tertiary variants with green (default) or black color themes.
 * 
 * @example
 * <Button variant="primary" onClick={handleClick}>Get Started</Button>
 * <Button variant="secondary" onClick={handleClick}>Learn More</Button>
 * <Button variant="tertiary" onClick={handleClick}>View Details</Button>
 * <Button variant="primary" color="black" onClick={handleClick}>Dark Button</Button>
 */
/**
 * Helper function to extract text content from ReactNode
 */
const getTextFromChildren = (children: React.ReactNode): string => {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join('');
  }
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    if (props.children) {
      return getTextFromChildren(props.children);
    }
  }
  return '';
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  color = 'green',
  forceColor = false,
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  showIcon = true,
  ariaLabel,
  href,
  target = '_self',
}) => {
  // Hide icon when disabled (per design spec)
  const shouldShowIcon = showIcon && !disabled;

  // Default ariaLabel to button text if not provided
  const buttonAriaLabel = ariaLabel || getTextFromChildren(children);

  // Build class names using BEM with bds namespace
  const classNames = clsx(
    'bds-btn',
    `bds-btn--${variant}`,
    `bds-btn--${color}`,
    {
      'bds-btn--disabled': disabled,
      'bds-btn--no-icon': !shouldShowIcon,
      'bds-btn--force-color': forceColor,
    },
    className
  );

  // Inner content shared between button and link
  const content = (
    <>
      <span className="bds-btn__label">{children}</span>
      {shouldShowIcon && <ArrowIcon />}
    </>
  );

  // Render as Link when href is provided
  if (href && !disabled) {
    return (
      <Link
        to={href}
        target={target}
        className={classNames}
        onClick={onClick}
        aria-label={buttonAriaLabel}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={buttonAriaLabel}
    >
      {content}
    </button>
  );
};

export default Button;
