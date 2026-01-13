import * as React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import { BdsLink } from "../../../../shared/components/Link/Link";
import { CloseIcon, ChevronIcon } from "../icons";
import { xrpSymbolBlack, globeIcon, chevronDown, modeToggleIcon, searchIcon } from "../constants/icons";
import { navItems } from "../constants/navigation";
import { MobileMenuContent, type MobileMenuKey } from "./MobileMenuContent";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: () => void;
}

/**
 * Mobile Menu Component.
 * Full-screen slide-out menu for mobile devices.
 */
export function MobileMenu({ isOpen, onClose, onSearch }: MobileMenuProps) {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const [expandedItem, setExpandedItem] = React.useState<string | null>("Develop");

  // Handle body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('bds-mobile-menu-open');
    } else {
      document.body.classList.remove('bds-mobile-menu-open');
    }
    return () => {
      document.body.classList.remove('bds-mobile-menu-open');
    };
  }, [isOpen]);

  const toggleAccordion = (item: string) => {
    setExpandedItem(expandedItem === item ? null : item);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
    onClose();
  };

  const handleModeToggle = () => {
    const newTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    window.localStorage.setItem("user-prefers-color", newTheme);
    document.body.style.transition = "background-color .2s ease";
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(newTheme);
  };

  const renderAccordionContent = (label: string) => {
    // All nav items with submenus use the unified MobileMenuContent
    const validKeys: MobileMenuKey[] = ['Develop', 'Use Cases', 'Community', 'Network'];
    if (validKeys.includes(label as MobileMenuKey)) {
      return <MobileMenuContent menuKey={label as MobileMenuKey} />;
    }
    return null;
  };

  return (
    <div className={`bds-mobile-menu ${isOpen ? 'bds-mobile-menu--open' : ''}`}>
      {/* Header */}
      <div className="bds-mobile-menu__header">
        <BdsLink href="/" className="bds-navbar__logo" aria-label="XRP Ledger Home" onClick={onClose} variant="inline">
          <img src={xrpSymbolBlack} alt="XRP Ledger" className="bds-navbar__logo-symbol" style={{ width: 33, height: 28 }} />
        </BdsLink>
        <button
          type="button"
          className="bds-mobile-menu__close"
          aria-label="Close menu"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>

      {/* Content */}
      <div className="bds-mobile-menu__content">
        <div className="bds-mobile-menu__accordion">
          {navItems.map((item) => (
            <React.Fragment key={item.label}>
              <button
                type="button"
                className="bds-mobile-menu__accordion-header"
                onClick={() => item.hasSubmenu ? toggleAccordion(item.label) : null}
                aria-expanded={expandedItem === item.label}
              >
                {item.hasSubmenu ? (
                  <>
                    <span>{translate(item.labelTranslationKey, item.label)}</span>
                    <ChevronIcon expanded={expandedItem === item.label} />
                  </>
                ) : (
                  <BdsLink
                    href={item.href}
                    onClick={onClose}
                    variant="inline"
                    style={{ 
                      display: 'flex', 
                      width: '100%', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: 'inherit',
                      textDecoration: 'none'
                    }}
                  >
                    <span>{translate(item.labelTranslationKey, item.label)}</span>
                    <ChevronIcon expanded={false} />
                  </BdsLink>
                )}
              </button>
              {item.hasSubmenu && (
                <div
                  className={`bds-mobile-menu__accordion-content ${
                    expandedItem === item.label ? 'bds-mobile-menu__accordion-content--expanded' : ''
                  }`}
                >
                  {renderAccordionContent(item.label)}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Footer */}
      <MobileMenuFooter 
        onModeToggle={handleModeToggle} 
        onSearch={handleSearch} 
      />
    </div>
  );
}

interface MobileMenuFooterProps {
  onModeToggle: () => void;
  onSearch: () => void;
}

function MobileMenuFooter({ onModeToggle, onSearch }: MobileMenuFooterProps) {
  return (
    <div className="bds-mobile-menu__footer">
      <button type="button" className="bds-mobile-menu__lang-pill" aria-label="Select language">
        <img src={globeIcon} alt="" className="bds-mobile-menu__lang-pill-icon" />
        <span className="bds-mobile-menu__lang-pill-text">
          <span>En</span>
          <img src={chevronDown} alt="" className="bds-mobile-menu__lang-pill-chevron" />
        </span>
      </button>
      <button type="button" className="bds-mobile-menu__footer-icon" aria-label="Toggle color mode" onClick={onModeToggle}>
        <img src={modeToggleIcon} alt="" />
      </button>
      <button type="button" className="bds-mobile-menu__footer-icon" aria-label="Search" onClick={onSearch}>
        <img src={searchIcon} alt="" />
      </button>
    </div>
  );
}

