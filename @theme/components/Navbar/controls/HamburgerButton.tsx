import { useThemeHooks } from "@redocly/theme/core/hooks";
import { IconButton } from "./IconButton";
import { hamburgerIcon } from "../constants/icons";

interface HamburgerButtonProps {
  onClick?: () => void;
  /** Whether the controlled mobile menu is currently open */
  isOpen?: boolean;
}

/** ID of the mobile-menu container, shared with Navbar so screen readers can link trigger ↔ popup. */
export const MOBILE_MENU_ID = "bds-mobile-menu";

/**
 * Hamburger Menu Button Component.
 * Mobile-only button that opens the mobile menu.
 */
export function HamburgerButton({ onClick, isOpen = false }: HamburgerButtonProps) {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <IconButton
      icon={hamburgerIcon}
      ariaLabel={translate(isOpen ? "Close menu" : "Open menu")}
      className="bds-navbar__hamburger"
      onClick={onClick}
      ariaExpanded={isOpen}
      ariaControls={MOBILE_MENU_ID}
    />
  );
}
