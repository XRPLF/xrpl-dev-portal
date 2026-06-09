interface IconButtonProps {
  /** The icon image source */
  icon: string;
  /** Accessible label for the button */
  ariaLabel: string;
  /** Optional click handler */
  onClick?: () => void;
  /** CSS class name for styling variants */
  className?: string;
  /** Reflects the open/closed state of a controlled disclosure (e.g. menu, dialog) */
  ariaExpanded?: boolean;
  /** ID of the element this button controls (paired with `ariaExpanded`) */
  ariaControls?: string;
}

/**
 * Unified Icon Button component.
 * Used for search, mode toggle, hamburger menu, and other icon-only buttons.
 */
export function IconButton({
  icon,
  ariaLabel,
  onClick,
  className = "bds-navbar__icon",
  ariaExpanded,
  ariaControls,
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      onClick={onClick}
    >
      <img src={icon} alt="" />
    </button>
  );
}
