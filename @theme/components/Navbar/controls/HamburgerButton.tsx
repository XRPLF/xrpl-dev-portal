import { IconButton } from "./IconButton";
import { hamburgerIcon } from "../constants/icons";

interface HamburgerButtonProps {
  onClick?: () => void;
}

/**
 * Hamburger Menu Button Component.
 * Mobile-only button that opens the mobile menu.
 */
export function HamburgerButton({ onClick }: HamburgerButtonProps) {
  return <IconButton icon={hamburgerIcon} ariaLabel="Open menu" className="bds-navbar__hamburger" onClick={onClick} />;
}

