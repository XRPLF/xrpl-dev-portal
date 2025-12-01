import React from 'react';

export interface ButtonProps {
  /** Button variant - determines visual style */
  variant?: 'primary'; // Extensible: | 'secondary' | 'tertiary'
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
 * Currently supports the Primary variant with plans for Secondary and Tertiary.
 * 
 * @example
 * <Button variant="primary" onClick={handleClick}>Get Started</Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  showIcon = true,
}) => {
  // Build class names using BEM with bds namespace
  const classNames = [
    'bds-btn',
    `bds-btn--${variant}`,
    disabled ? 'bds-btn--disabled' : '',
    !showIcon ? 'bds-btn--no-icon' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <span className="bds-btn__label">{children}</span>
      {showIcon && <ArrowIcon />}
    </button>
  );
};

export default Button;
