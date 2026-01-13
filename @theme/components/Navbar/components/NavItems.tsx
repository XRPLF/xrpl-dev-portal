import * as React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import { BdsLink } from "../../../../shared/components/Link/Link";
import { navItems } from "../constants/navigation";

interface NavItemsProps {
  activeSubmenu: string | null;
  onSubmenuEnter: (itemLabel: string) => void;
  onSubmenuClose?: () => void;
}

/**
 * Nav Items Component.
 * Centered navigation links with submenu support.
 * ARIA compliant with full keyboard navigation support.
 */
export function NavItems({ activeSubmenu, onSubmenuEnter, onSubmenuClose }: NavItemsProps) {
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

  const handleKeyDown = (event: React.KeyboardEvent, itemLabel: string) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        // Toggle submenu on Enter/Space
        if (activeSubmenu === itemLabel) {
          onSubmenuClose?.();
        } else {
          onSubmenuEnter(itemLabel);
        }
        break;
      case 'Escape':
        event.preventDefault();
        onSubmenuClose?.();
        break;
      case 'Tab':
        // If submenu is open and Tab is pressed (without Shift), move focus into submenu
        if (activeSubmenu === itemLabel && !event.shiftKey) {
          event.preventDefault();
          // Focus first focusable element in submenu
          const submenu = document.querySelector('.bds-submenu--active');
          const firstFocusable = submenu?.querySelector<HTMLElement>('a, button');
          firstFocusable?.focus();
        }
        break;
      case 'ArrowDown':
        // If submenu is open, move focus into submenu
        if (activeSubmenu === itemLabel) {
          event.preventDefault();
          // Focus first focusable element in submenu
          const submenu = document.querySelector('.bds-submenu--active');
          const firstFocusable = submenu?.querySelector<HTMLElement>('a, button');
          firstFocusable?.focus();
        }
        break;
    }
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
          <button
            key={item.label}
            type="button"
            className={`bds-navbar__item ${activeItem === item.label || activeSubmenu === item.label ? 'bds-navbar__item--active' : ''}`}
            onMouseEnter={() => handleMouseEnter(item.label, true)}
            onMouseLeave={() => handleMouseLeave(true)}
            onKeyDown={(e) => handleKeyDown(e, item.label)}
            aria-expanded={activeSubmenu === item.label}
            aria-haspopup="menu"
          >
            {translate(item.labelTranslationKey, item.label)}
          </button>
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

