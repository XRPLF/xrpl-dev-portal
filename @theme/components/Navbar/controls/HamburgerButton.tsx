import { useThemeHooks } from "@redocly/theme/core/hooks";
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
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return <IconButton icon={hamburgerIcon} ariaLabel={translate("Open menu")} className="bds-navbar__hamburger" onClick={onClick} />;
}

