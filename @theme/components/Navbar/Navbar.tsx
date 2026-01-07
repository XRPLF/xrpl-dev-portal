import * as React from "react";
import { useThemeConfig, useThemeHooks } from "@redocly/theme/core/hooks";
import { Link } from "@redocly/theme/components/Link/Link";
import moment from "moment-timezone";

// Icons
import xrpSymbolBlack from "../../../static/img/navbar/xrp-symbol-black.svg";
import xrpLogotypeBlack from "../../../static/img/navbar/xrp-logotype-black.svg";
import searchIcon from "../../../static/img/navbar/search-icon.svg";
import modeToggleIcon from "../../../static/img/navbar/mode-toggle.svg";
import globeIcon from "../../../static/img/navbar/globe-icon.svg";
import chevronDown from "../../../static/img/navbar/chevron-down.svg";
import hamburgerIcon from "../../../static/img/navbar/hamburger-icon.svg";
import arrowUpRight from "../../../static/img/icons/arrow-up-right-custom.svg";

// Wallet icons for submenu
import greenWallet from "../../../static/img/navbar/green-wallet.svg";
import lilacWallet from "../../../static/img/navbar/lilac-wallet.svg";
import yellowWallet from "../../../static/img/navbar/yellow-wallet.svg";
import pinkWallet from "../../../static/img/navbar/pink-wallet.svg";
import blueWallet from "../../../static/img/navbar/blue-wallet.svg";

// Alert Banner Configuration
const alertBanner = {
  show: false,
  message: "APEX 2025",
  button: "REGISTER",
  link: "https://www.xrpledgerapex.com/?utm_source=xrplwebsite&utm_medium=direct&utm_campaign=xrpl-event-ho-xrplapex-glb-2025-q1_xrplwebsite_ari_arp_bf_rsvp&utm_content=cta_btn_english_pencilbanner"
};

// Nav items with submenu support
const navItems = [
  { label: "Develop", labelTranslationKey: "navbar.develop", href: "/docs", hasSubmenu: true },
  { label: "Use Cases", labelTranslationKey: "navbar.usecases", href: "/about/uses", hasSubmenu: false },
  { label: "Community", labelTranslationKey: "navbar.community", href: "/community", hasSubmenu: false },
  { label: "Network", labelTranslationKey: "navbar.network", href: "/docs/concepts/networks-and-servers", hasSubmenu: false },
];

// Wallet icon mapping
const walletIcons: Record<string, string> = {
  green: greenWallet,
  lilac: lilacWallet,
  yellow: yellowWallet,
  pink: pinkWallet,
  blue: blueWallet,
};

// Types for submenu data
interface SubmenuChild {
  label: string;
  href: string;
  active?: boolean;
}

interface SubmenuItemBase {
  label: string;
  href: string;
  icon: string;
}

interface SubmenuItemWithChildren extends SubmenuItemBase {
  children: SubmenuChild[];
}

type SubmenuItem = SubmenuItemBase | SubmenuItemWithChildren;

// Develop submenu data structure
const developSubmenuData: {
  left: SubmenuItemBase[];
  right: SubmenuItemWithChildren[];
} = {
  left: [
    { label: "Developer's Home", href: "/docs", icon: "green" },
    { label: "Learn", href: "/docs/tutorials", icon: "lilac" },
    { label: "Code Samples", href: "/_code-samples", icon: "yellow" },
  ],
  right: [
    {
      label: "Docs",
      href: "/docs",
      icon: "pink",
      children: [
        { label: "API Reference", href: "/docs/references" },
        { label: "Tutorials", href: "/docs/tutorials", active: true },
        { label: "Concepts", href: "/docs/concepts" },
        { label: "Infrastructure", href: "/docs/infrastructure" },
      ],
    },
    {
      label: "Client Libraries",
      href: "/docs/references/client-libraries",
      icon: "blue",
      children: [
        { label: "JavaScript", href: "/docs/references/xrpljs" },
        { label: "Python", href: "/docs/references/xrpl-py" },
        { label: "PHP", href: "/docs/references/xrpl-php" },
        { label: "Go", href: "/docs/references/xrpl-go" },
      ],
    },
  ],
};

// Arrow Icon Component for submenu links
function SubmenuArrow({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg
      className={className}
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 13L13 1M13 1H3M13 1V11"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Alert Banner Component
export function AlertBanner({ message, button, link, show }) {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const bannerRef = React.useRef<HTMLAnchorElement>(null);
  const [displayDate, setDisplayDate] = React.useState("JUNE 10-12");

  React.useEffect(() => {
    const calculateCountdown = () => {
      const target = moment.tz('2025-06-11 08:00:00', 'Asia/Singapore');
      const now = moment();
      const daysUntil = target.diff(now, 'days');

      let newDisplayDate = "JUNE 10-12";
      if (daysUntil > 0) {
        newDisplayDate = daysUntil === 1 ? 'IN 1 DAY' : `IN ${daysUntil} DAYS`;
      } else if (daysUntil === 0) {
        const hoursUntil = target.diff(now, 'hours');
        newDisplayDate = hoursUntil > 0 ? 'TODAY' : "JUNE 10-12";
      }

      setDisplayDate(newDisplayDate);
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;
    
    const handleMouseEnter = () => {
      banner.classList.add("has-hover");
    };
    
    banner.addEventListener("mouseenter", handleMouseEnter);
    return () => {
      banner.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (!show) return null;

  return (
    <a
      href={link}
      target="_blank"
      ref={bannerRef}
      className="top-banner fixed-top web-banner"
      rel="noopener noreferrer"
      aria-label="Get Tickets for the APEX 2025 Event"
    >
      <div className="banner-event-details">
        <div className="event-info">{translate(message)}</div>
        <div className="event-date">{displayDate}</div>
      </div>
      <div className="banner-button">
        <div className="button-text">{translate(button)}</div>
        <img className="button-icon" src={arrowUpRight} alt="Get Tickets Icon" />
      </div>
    </a>
  );
}

// Logo Component - Shows symbol on desktop/mobile, full logotype on tablet
function NavLogo() {
  return (
    <Link to="/" className="bds-navbar__logo" aria-label="XRP Ledger Home">
      <img
        src={xrpSymbolBlack}
        alt="XRP Ledger"
        className="bds-navbar__logo-symbol"
      />
      <img
        src={xrpLogotypeBlack}
        alt="XRP Ledger"
        className="bds-navbar__logo-full"
      />
    </Link>
  );
}

// Desktop Develop Submenu Component
function DevelopSubmenu({ isActive }: { isActive: boolean }) {
  return (
    <div className={`bds-submenu ${isActive ? 'bds-submenu--active' : ''}`}>
      {/* Left Column */}
      <div className="bds-submenu__left">
        {developSubmenuData.left.map((item) => (
          <div key={item.label} className="bds-submenu__section">
            <div className="bds-submenu__tier1">
              <span className="bds-submenu__icon">
                <img src={walletIcons[item.icon]} alt="" />
              </span>
              <Link to={item.href} className="bds-submenu__link bds-submenu__link--bold">
                {item.label}
                <span className="bds-submenu__arrow">
                  <SubmenuArrow />
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Right Column */}
      <div className="bds-submenu__right">
        {developSubmenuData.right.map((section) => (
          <div key={section.label} className="bds-submenu__section">
            <div className="bds-submenu__tier1">
              <span className="bds-submenu__icon">
                <img src={walletIcons[section.icon]} alt="" />
              </span>
              <Link to={section.href} className="bds-submenu__link bds-submenu__link--bold">
                {section.label}
                <span className="bds-submenu__arrow">
                  <SubmenuArrow />
                </span>
              </Link>
            </div>
            {section.children && (
              <div className="bds-submenu__tier2">
                {section.children.map((child) => (
                  <Link
                    key={child.label}
                    to={child.href}
                    className={`bds-submenu__sublink ${child.active ? 'bds-submenu__sublink--active' : ''}`}
                  >
                    {child.label}
                    {child.active && (
                      <span className="bds-submenu__arrow">
                        <SubmenuArrow color="#0DAA3E" />
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Nav Items Component - Centered navigation links with submenu support
function NavItems({ submenuActive, onSubmenuEnter }: { 
  submenuActive: boolean; 
  onSubmenuEnter: () => void;
}) {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const [activeItem, setActiveItem] = React.useState<string | null>(null);

  const handleMouseEnter = (itemLabel: string, hasSubmenu: boolean) => {
    setActiveItem(itemLabel);
    if (hasSubmenu) {
      onSubmenuEnter();
    }
  };

  const handleMouseLeave = (hasSubmenu: boolean) => {
    if (!hasSubmenu) {
      setActiveItem(null);
    }
    // Don't close submenu on leave - let the parent Navbar handle that
  };

  // Sync activeItem with submenuActive state
  React.useEffect(() => {
    if (!submenuActive) {
      setActiveItem(null);
    }
  }, [submenuActive]);

  return (
    <nav className="bds-navbar__items" aria-label="Main navigation">
      {navItems.map((item) => (
        item.hasSubmenu ? (
          <span
            key={item.label}
            className={`bds-navbar__item ${activeItem === item.label || submenuActive ? 'bds-navbar__item--active' : ''}`}
            onMouseEnter={() => handleMouseEnter(item.label, true)}
            onMouseLeave={() => handleMouseLeave(true)}
            style={{ cursor: 'pointer' }}
          >
            {translate(item.labelTranslationKey, item.label)}
          </span>
        ) : (
          <Link
            key={item.label}
            to={item.href}
            className={`bds-navbar__item ${activeItem === item.label ? 'bds-navbar__item--active' : ''}`}
            onMouseEnter={() => handleMouseEnter(item.label, false)}
            onMouseLeave={() => handleMouseLeave(false)}
          >
            {translate(item.labelTranslationKey, item.label)}
          </Link>
        )
      ))}
    </nav>
  );
}

// Search Button Component
function SearchButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      className="bds-navbar__icon"
      aria-label="Search"
      onClick={onClick}
    >
      <img src={searchIcon} alt="" />
    </button>
  );
}

// Mode Toggle Button Component
function ModeToggleButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      className="bds-navbar__icon"
      aria-label="Toggle color mode"
      onClick={onClick}
    >
      <img src={modeToggleIcon} alt="" />
    </button>
  );
}

// Language Pill Button Component
function LanguagePill({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      className="bds-navbar__lang-pill"
      aria-label="Select language"
      onClick={onClick}
    >
      <img src={globeIcon} alt="" className="bds-navbar__lang-pill-icon" />
      <span className="bds-navbar__lang-pill-text">
        <span>En</span>
        <img src={chevronDown} alt="" className="bds-navbar__lang-pill-chevron" />
      </span>
    </button>
  );
}

// Nav Controls Component - Right side icons and language pill
function NavControls() {
  const handleSearch = () => {
    // Phase 1: Basic click handler - will be enhanced in future phases
    const searchTrigger = document.querySelector('[data-component-name="Search/SearchTrigger"]') as HTMLElement;
    if (searchTrigger) {
      searchTrigger.click();
    }
  };

  const handleModeToggle = () => {
    // Phase 1: Basic theme toggle
    const newTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    window.localStorage.setItem("user-prefers-color", newTheme);
    document.body.style.transition = "background-color .2s ease";
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(newTheme);
  };

  const handleLanguageClick = () => {
    // Phase 1: Placeholder - language selection will be enhanced in future phases
    console.log("Language selector clicked");
  };

  return (
    <div className="bds-navbar__controls">
      <SearchButton onClick={handleSearch} />
      <ModeToggleButton onClick={handleModeToggle} />
      <LanguagePill onClick={handleLanguageClick} />
    </div>
  );
}

// Hamburger Menu Button Component - Mobile only
function HamburgerButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      className="bds-navbar__hamburger"
      aria-label="Open menu"
      onClick={onClick}
    >
      <img src={hamburgerIcon} alt="" />
    </button>
  );
}

// Close Icon Component for Mobile Menu
function CloseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="7" y1="7" x2="21" y2="21" stroke="#141414" strokeWidth="2" strokeLinecap="round" />
      <line x1="21" y1="7" x2="7" y2="21" stroke="#141414" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Chevron Icon Component for Mobile Accordion
function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`bds-mobile-menu__chevron ${expanded ? 'bds-mobile-menu__chevron--expanded' : ''}`}
      width="13"
      height="8"
      viewBox="0 0 13 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1L6.5 6.5L12 1"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Type guard to check if item has children
function hasChildren(item: SubmenuItem): item is SubmenuItemWithChildren {
  return 'children' in item && Array.isArray((item as SubmenuItemWithChildren).children);
}

// Mobile Menu Develop Content (Accordion content for Develop section)
function MobileMenuDevelopContent() {
  // Flatten the submenu data for mobile single-column layout
  const mobileItems: SubmenuItem[] = [
    ...developSubmenuData.left,
    ...developSubmenuData.right,
  ];

  return (
    <div className="bds-mobile-menu__tier-list">
      {mobileItems.map((item) => (
        <React.Fragment key={item.label}>
          <div className="bds-mobile-menu__tier1">
            <span className="bds-mobile-menu__icon">
              <img src={walletIcons[item.icon]} alt="" />
            </span>
            <Link to={item.href} className="bds-mobile-menu__link bds-mobile-menu__link--bold">
              {item.label}
              <span className="bds-mobile-menu__arrow">
                <SubmenuArrow />
              </span>
            </Link>
          </div>
          {/* Show children if they exist (for Docs and Client Libraries) */}
          {hasChildren(item) && (
            <div className="bds-mobile-menu__tier2">
              {item.children.map((child) => (
                <Link
                  key={child.label}
                  to={child.href}
                  className={`bds-mobile-menu__sublink ${child.active ? 'bds-mobile-menu__sublink--active' : ''}`}
                >
                  {child.label}
                  {child.active && (
                    <span className="bds-mobile-menu__arrow">
                      <SubmenuArrow color="#0DAA3E" />
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Mobile Menu Component
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
    const searchTrigger = document.querySelector('[data-component-name="Search/SearchTrigger"]') as HTMLElement;
    if (searchTrigger) {
      searchTrigger.click();
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

  return (
    <div className={`bds-mobile-menu ${isOpen ? 'bds-mobile-menu--open' : ''}`}>
      {/* Header */}
      <div className="bds-mobile-menu__header">
        <Link to="/" className="bds-navbar__logo" aria-label="XRP Ledger Home" onClick={onClose}>
          <img src={xrpSymbolBlack} alt="XRP Ledger" style={{ width: 33, height: 28 }} />
        </Link>
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
                  <Link
                    to={item.href}
                    onClick={onClose}
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
                  </Link>
                )}
              </button>
              {item.hasSubmenu && (
                <div
                  className={`bds-mobile-menu__accordion-content ${
                    expandedItem === item.label ? 'bds-mobile-menu__accordion-content--expanded' : ''
                  }`}
                >
                  <MobileMenuDevelopContent />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bds-mobile-menu__footer">
        <button type="button" className="bds-mobile-menu__lang-pill" aria-label="Select language">
          <img src={globeIcon} alt="" className="bds-mobile-menu__lang-pill-icon" />
          <span className="bds-mobile-menu__lang-pill-text">
            <span>En</span>
            <img src={chevronDown} alt="" className="bds-mobile-menu__lang-pill-chevron" />
          </span>
        </button>
        <button
          type="button"
          className="bds-mobile-menu__footer-icon"
          aria-label="Toggle color mode"
          onClick={handleModeToggle}
        >
          <img src={modeToggleIcon} alt="" />
        </button>
        <button
          type="button"
          className="bds-mobile-menu__footer-icon"
          aria-label="Search"
          onClick={handleSearch}
        >
          <img src={searchIcon} alt="" />
        </button>
      </div>
    </div>
  );
}

// Main Navbar Component
export function Navbar(props) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [submenuActive, setSubmenuActive] = React.useState(false);
  const submenuTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleHamburgerClick = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleSubmenuMouseEnter = () => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
      submenuTimeoutRef.current = null;
    }
    setSubmenuActive(true);
  };

  const handleSubmenuMouseLeave = () => {
    submenuTimeoutRef.current = setTimeout(() => {
      setSubmenuActive(false);
    }, 150);
  };

  // Handle scroll lock when submenu is open
  React.useEffect(() => {
    if (submenuActive) {
      document.body.classList.add('bds-submenu-open');
    } else {
      document.body.classList.remove('bds-submenu-open');
    }
    return () => {
      document.body.classList.remove('bds-submenu-open');
    };
  }, [submenuActive]);

  React.useEffect(() => {
    return () => {
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
    };
  }, []);

  const navbarClasses = [
    "bds-navbar",
    alertBanner.show ? "bds-navbar--with-banner" : ""
  ].filter(Boolean).join(" ");

  return (
    <>
      <AlertBanner {...alertBanner} />
      {/* Backdrop blur overlay when submenu is open */}
      <div 
        className={`bds-submenu-backdrop ${submenuActive ? 'bds-submenu-backdrop--active' : ''}`}
        onClick={() => setSubmenuActive(false)}
      />
      <header 
        className={navbarClasses}
        onMouseLeave={handleSubmenuMouseLeave}
      >
        <div className="bds-navbar__content">
          <NavLogo />
          <NavItems submenuActive={submenuActive} onSubmenuEnter={handleSubmenuMouseEnter} />
          <NavControls />
          <HamburgerButton onClick={handleHamburgerClick} />
        </div>
        {/* Submenu positioned relative to navbar */}
        <div onMouseEnter={handleSubmenuMouseEnter}>
          <DevelopSubmenu isActive={submenuActive} />
        </div>
      </header>
      <MobileMenu isOpen={mobileMenuOpen} onClose={handleMobileMenuClose} />
    </>
  );
}

// Legacy exports for backwards compatibility (can be removed after full migration)
export function NavWrapper(props) {
  return <Navbar {...props} />;
}

export function TopNavCollapsible({ children }) {
  return null; // Phase 1: Not needed
}

export function NavDropdown(props) {
  return null; // Phase 1: Submenus not implemented yet
}

export function NavControls_Legacy(props) {
  return null; // Phase 1: Using new NavControls
}

export function MobileMenuIcon() {
  return null; // Phase 1: Using new HamburgerButton
}

export function GetStartedButton() {
  return null; // Phase 1: Not in new design
}

export function NavItems_Legacy(props) {
  return null; // Phase 1: Using new NavItems
}

export function NavItem(props) {
  return null; // Phase 1: Using inline rendering
}

export function LogoBlock(props) {
  return null; // Phase 1: Using new NavLogo
}

export class ThemeToggle extends React.Component {
  render() {
    return null; // Phase 1: Using new ModeToggleButton
  }
}
