interface IconButtonProps {
  /** The icon image source */
  icon: string;
  /** Accessible label for the button */
  ariaLabel: string;
  /** Optional click handler */
  onClick?: () => void;
  /** CSS class name for styling variants */
  className?: string;
}

/**
 * Unified Icon Button component.
 * Used for search, mode toggle, hamburger menu, and other icon-only buttons.
 */
export function IconButton({ icon, ariaLabel, onClick, className = "bds-navbar__icon" }: IconButtonProps) {
  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <img src={icon} alt="" />
    </button>
  );
}

