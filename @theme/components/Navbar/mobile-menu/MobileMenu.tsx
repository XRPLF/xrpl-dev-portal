import * as React from "react";
import { useThemeHooks, useLanguagePicker } from "@redocly/theme/core/hooks";
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

/**
 * Get short display name for a locale code.
 */
function getLocaleShortName(code: string | undefined): string {
  if (!code) return "En";
  const shortNames: Record<string, string> = {
    "en-US": "En",
    "en": "En",
    "ja": "日本語",
  };
  return shortNames[code] || code.substring(0, 2).toUpperCase();
}

function MobileMenuFooter({ onModeToggle, onSearch }: MobileMenuFooterProps) {
  const { currentLocale, locales, setLocale } = useLanguagePicker();
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const displayName = getLocaleShortName(currentLocale?.code);

  const handleLanguageSelect = (localeCode: string) => {
    setLocale(localeCode);
    setIsLangOpen(false);
  };

  return (
    <div className="bds-mobile-menu__footer">
      <div className="bds-mobile-menu__lang-wrapper">
        <button
          type="button"
          className={`bds-mobile-menu__lang-pill ${isLangOpen ? 'bds-mobile-menu__lang-pill--open' : ''}`}
          aria-label="Select language"
          aria-expanded={isLangOpen}
          onClick={() => setIsLangOpen(!isLangOpen)}
        >
          <img src={globeIcon} alt="" className="bds-mobile-menu__lang-pill-icon" />
          <span className="bds-mobile-menu__lang-pill-text">
            <span>{displayName}</span>
            <img src={chevronDown} alt="" className="bds-mobile-menu__lang-pill-chevron" />
          </span>
        </button>
        {isLangOpen && locales.length >= 2 && (
          <div className="bds-lang-dropdown bds-lang-dropdown--mobile" role="menu">
            {locales.map((locale) => {
              const isActive = locale.code === currentLocale?.code;
              return (
                <button
                  key={locale.code}
                  type="button"
                  role="menuitem"
                  className={`bds-lang-dropdown__item ${isActive ? 'bds-lang-dropdown__item--active' : ''}`}
                  onClick={() => handleLanguageSelect(locale.code)}
                >
                  {locale.name || locale.code}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <button type="button" className="bds-mobile-menu__footer-icon" aria-label="Toggle color mode" onClick={onModeToggle}>
        <img src={modeToggleIcon} alt="" />
      </button>
      <button type="button" className="bds-mobile-menu__footer-icon" aria-label="Search" onClick={onSearch}>
        <img src={searchIcon} alt="" />
      </button>
    </div>
  );
}

