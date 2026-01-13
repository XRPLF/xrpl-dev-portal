import * as React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import { BdsLink } from "../../../../shared/components/Link/Link";
import { navItems } from "../constants/navigation";

interface NavItemsProps {
  activeSubmenu: string | null;
  onSubmenuEnter: (itemLabel: string) => void;
}

/**
 * Nav Items Component.
 * Centered navigation links with submenu support.
 */
export function NavItems({ activeSubmenu, onSubmenuEnter }: NavItemsProps) {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const [activeItem, setActiveItem] = React.useState<string | null>(null);

  const handleMouseEnter = (itemLabel: string, hasSubmenu: boolean) => {
    setActiveItem(itemLabel);
    if (hasSubmenu) {
      onSubmenuEnter(itemLabel);
    }
  };

  const handleMouseLeave = (hasSubmenu: boolean) => {
    if (!hasSubmenu) {
      setActiveItem(null);
    }
    // Don't close submenu on leave - let the parent Navbar handle that
  };

  // Sync activeItem with activeSubmenu state
  React.useEffect(() => {
    if (!activeSubmenu) {
      setActiveItem(null);
    }
  }, [activeSubmenu]);

  return (
    <nav className="bds-navbar__items" aria-label={translate("Main navigation")}>
      {navItems.map((item) => (
        item.hasSubmenu ? (
          <span
            key={item.label}
            className={`bds-navbar__item ${activeItem === item.label || activeSubmenu === item.label ? 'bds-navbar__item--active' : ''}`}
            onMouseEnter={() => handleMouseEnter(item.label, true)}
            onMouseLeave={() => handleMouseLeave(true)}
            style={{ cursor: 'pointer' }}
          >
            {translate(item.labelTranslationKey, item.label)}
          </span>
        ) : (
          <BdsLink
            key={item.label}
            href={item.href}
            className={`bds-navbar__item ${activeItem === item.label ? 'bds-navbar__item--active' : ''}`}
            onMouseEnter={() => handleMouseEnter(item.label, false)}
            onMouseLeave={() => handleMouseLeave(false)}
            variant="inline"
          >
            {translate(item.labelTranslationKey, item.label)}
          </BdsLink>
        )
      ))}
    </nav>
  );
}

