import * as React from "react";
import { useThemeConfig, useThemeHooks } from "@redocly/theme/core/hooks";
import { BdsLink } from "../../../shared/components/Link/Link";
import moment from "moment-timezone";

// Icons
import xrpSymbolBlack from "../../../static/img/navbar/xrp-symbol-black.svg";
import xrpLogotypeBlack from "../../../static/img/navbar/xrp-logotype-black.svg";
import xrpLedgerNav from "../../../static/img/navbar/xrp-ledger-nav.svg";
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

// Develop submenu icons
import devHomeIcon from "../../../static/img/navbar/dev_home.svg";
import learnIcon from "../../../static/img/navbar/learn.svg";
import codeSamplesIcon from "../../../static/img/navbar/code_samples.svg";
import docsIcon from "../../../static/img/navbar/docs.svg";
import clientLibIcon from "../../../static/img/navbar/client_lib.svg";

// Use Cases submenu icons
import paymentsIcon from "../../../static/img/navbar/payments.svg";
import tokenizationIcon from "../../../static/img/navbar/tokenization.svg";
import creditIcon from "../../../static/img/navbar/credit.svg";
import tradingIcon from "../../../static/img/navbar/trading.svg";

// Community submenu icons
import communityIcon from "../../../static/img/navbar/community.svg";

// Network submenu icons
import insightsIcon from "../../../static/img/navbar/insights.svg";
import resourcesIcon from "../../../static/img/navbar/resources.svg";

// Network submenu pattern images
import resourcesPurplePattern from "../../../static/img/navbar/resources-purple.svg";
import insightsGreenPattern from "../../../static/img/navbar/insights-green.svg";
import darkInsightsGreenPattern from "../../../static/img/navbar/dark-insights-green.svg";
import darkLilacPattern from "../../../static/img/navbar/dark-lilac.svg";

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
  { label: "Use Cases", labelTranslationKey: "navbar.usecases", href: "/about/uses", hasSubmenu: true },
  { label: "Community", labelTranslationKey: "navbar.community", href: "/community", hasSubmenu: true },
  { label: "Network", labelTranslationKey: "navbar.network", href: "/docs/concepts/networks-and-servers", hasSubmenu: true },
];

// Wallet icon mapping
const walletIcons: Record<string, string> = {
  green: greenWallet,
  lilac: lilacWallet,
  yellow: yellowWallet,
  pink: pinkWallet,
  blue: blueWallet,
  dev_home: devHomeIcon,
  learn: learnIcon,
  code_samples: codeSamplesIcon,
  docs: docsIcon,
  client_lib: clientLibIcon,
  payments: paymentsIcon,
  tokenization: tokenizationIcon,
  credit: creditIcon,
  trading: tradingIcon,
  community: communityIcon,
  insights: insightsIcon,
  resources: resourcesIcon,
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
    { label: "Developer's Home", href: "/docs", icon: "dev_home" },
    { label: "Learn", href: "/docs/tutorials", icon: "learn" },
    { label: "Code Samples", href: "/_code-samples", icon: "code_samples" },
  ],
  right: [
    {
      label: "Docs",
      href: "/docs",
      icon: "docs",
      children: [
        { label: "API Reference", href: "/docs/references" },
        { label: "Tutorials", href: "/docs/tutorials" },
        { label: "Concepts", href: "/docs/concepts" },
        { label: "Infrastructure", href: "/docs/infrastructure" },
      ],
    },
    {
      label: "Client Libraries",
      href: "/docs/references/client-libraries",
      icon: "client_lib",
      children: [
        { label: "JavaScript", href: "/docs/references/xrpljs" },
        { label: "Python", href: "/docs/references/xrpl-py" },
        { label: "PHP", href: "/docs/references/xrpl-php" },
        { label: "Go", href: "/docs/references/xrpl-go" },
      ],
    },
  ],
};

// Use Cases submenu data structure
const useCasesSubmenuData: {
  left: SubmenuItemWithChildren[];
  right: SubmenuItemWithChildren[];
} = {
  left: [
    {
      label: "Payments",
      href: "/about/uses/payments",
      icon: "payments",
      children: [
        { label: "Direct XRP Payments", href: "/about/uses/direct-xrp-payments" },
        { label: "Cross-currency Payments", href: "/about/uses/cross-currency-payments" },
        { label: "Escrow", href: "/about/uses/escrow" },
        { label: "Checks", href: "/about/uses/checks" },
      ],
    },
    {
      label: "Tokenization",
      href: "/about/uses/tokenization",
      icon: "tokenization",
      children: [
        { label: "Stablecoin", href: "/about/uses/stablecoin" },
        { label: "NFT", href: "/about/uses/nft" },
      ],
    },
  ],
  right: [
    {
      label: "Credit",
      href: "/about/uses/credit",
      icon: "credit",
      children: [
        { label: "Lending", href: "/about/uses/lending" },
        { label: "Collateralization", href: "/about/uses/collateralization" },
        { label: "Sustainability", href: "/about/uses/sustainability" },
      ],
    },
    {
      label: "Trading",
      href: "/about/uses/trading",
      icon: "trading",
      children: [
        { label: "DEX", href: "/about/uses/dex" },
        { label: "Permissioned Trading", href: "/about/uses/permissioned-trading" },
        { label: "AMM", href: "/about/uses/amm" },
      ],
    },
  ],
};

// Community submenu data structure
// Mixed layout: some sections have children, some don't
const communitySubmenuData: {
  left: SubmenuItem[];
  right: SubmenuItem[];
} = {
  left: [
    {
      label: "Community",
      href: "/community",
      icon: "community",
      children: [
        { label: "Events", href: "/community/events" },
        { label: "News", href: "/blog", active: true },
        { label: "Blog", href: "/blog" },
        { label: "Marketplace", href: "/community/marketplace" },
        { label: "Partner Connect", href: "/community/partner-connect" },
      ],
    },
    { label: "Funding", href: "/community/developer-funding", icon: "code_samples" },
  ],
  right: [
    {
      label: "Contribute",
      href: "/resources/contribute-documentation",
      icon: "client_lib",
      children: [
        { label: "Ecosystem Map", href: "/community/ecosystem-map" },
        { label: "Bug Bounty", href: "/community/bug-bounty" },
        { label: "Research", href: "/community/research" },
      ],
    },
    { label: "Creators", href: "/community/ambassadors", icon: "learn" },
  ],
};

// Network submenu data structure - interface for sections with decorative images
interface NetworkSubmenuSection {
  label: string;
  href: string;
  icon: string;
  children: SubmenuChild[];
  patternColor: 'lilac' | 'green';
}

// Network submenu data - 2 sections side by side with decorative images
const networkSubmenuData: NetworkSubmenuSection[] = [
  {
    label: "Resources",
    href: "/docs/concepts/networks-and-servers",
    icon: "resources",
    children: [
      { label: "Validators", href: "/docs/concepts/networks-and-servers/validators" },
      { label: "Governance", href: "/docs/concepts/networks-and-servers/governance", active: true },
      { label: "XRPL Roadmap", href: "/docs/concepts/networks-and-servers/xrpl-roadmap" },
    ],
    patternColor: 'lilac',
  },
  {
    label: "Insights",
    href: "/docs/concepts/networks-and-servers/insights",
    icon: "insights",
    children: [
      { label: "Explorer", href: "https://livenet.xrpl.org" },
      { label: "Data Dashboard", href: "/docs/concepts/networks-and-servers/data-dashboard" },
      { label: "Amendment Voting Status", href: "/docs/concepts/networks-and-servers/amendments" },
    ],
    patternColor: 'green',
  },
];

// Internal Arrow Icon Component for submenu parent links
// Uses same pattern as LinkArrow: chevron (static) + horizontal line (animates away on hover)
function SubmenuArrow({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg
      className={className}
      width="15"
      height="14"
      viewBox="0 0 26 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Chevron part (static) */}
      <path
        d="M14.0019 1.00191L24.0015 11.0015L14.0019 21.001"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      {/* Horizontal line (animates away on hover) */}
      <path
        d="M23.999 10.999H0"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        className="arrow-horizontal"
      />
    </svg>
  );
}

// Full Arrow for submenu child links (no animation, just show/hide)
// Shows full arrow (→) not just chevron (>)
function SubmenuChildArrow({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg
      className={className}
      width="15"
      height="14"
      viewBox="0 0 26 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Chevron part */}
      <path
        d="M14.0019 1.00191L24.0015 11.0015L14.0019 21.001"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      {/* Horizontal line */}
      <path
        d="M23.999 10.999H0"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
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
// On desktop hover, the "XRP LEDGER" text animates out to the right
function NavLogo() {
  return (
    <BdsLink href="/" className="bds-navbar__logo" aria-label="XRP Ledger Home" variant="inline">
      <img
        src={xrpSymbolBlack}
        alt="XRP Ledger"
        className="bds-navbar__logo-symbol"
      />
      <img
        src={xrpLedgerNav}
        alt=""
        className="bds-navbar__logo-text"
      />
      <img
        src={xrpLogotypeBlack}
        alt="XRP Ledger"
        className="bds-navbar__logo-full"
      />
    </BdsLink>
  );
}

// Desktop Develop Submenu Component
function DevelopSubmenu({ isActive, isClosing }: { isActive: boolean; isClosing: boolean }) {
  const classNames = [
    'bds-submenu',
    isActive ? 'bds-submenu--active' : '',
    isClosing ? 'bds-submenu--closing' : '',
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames}>
      {/* Left Column */}
      <div className="bds-submenu__left">
        {developSubmenuData.left.map((item) => (
          <div key={item.label} className="bds-submenu__section">
            <a href={item.href} className="bds-submenu__tier1 bds-submenu__parent-link">
              <span className="bds-submenu__icon">
                <img src={walletIcons[item.icon]} alt="" />
              </span>
              <span className="bds-submenu__link bds-submenu__link--bold">
                {item.label}
                <span className="bds-submenu__arrow">
                  <SubmenuArrow />
                </span>
              </span>
            </a>
          </div>
        ))}
      </div>

      {/* Right Column */}
      <div className="bds-submenu__right">
        {developSubmenuData.right.map((section) => (
          <div key={section.label} className="bds-submenu__section">
            <a href={section.href} className="bds-submenu__tier1 bds-submenu__parent-link">
              <span className="bds-submenu__icon">
                <img src={walletIcons[section.icon]} alt="" />
              </span>
              <span className="bds-submenu__link bds-submenu__link--bold">
                {section.label}
                <span className="bds-submenu__arrow">
                  <SubmenuArrow />
                </span>
              </span>
            </a>
            {section.children && (
              <div className="bds-submenu__tier2">
                {section.children.map((child) => (
                  <a
                    key={child.label}
                    href={child.href}
                    className={`bds-submenu__sublink`}
                  >
                    {child.label}
                    <span className="bds-submenu__sublink-arrow">
                      <SubmenuChildArrow />
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Desktop Use Cases Submenu Component
function UseCasesSubmenu({ isActive, isClosing }: { isActive: boolean; isClosing: boolean }) {
  const classNames = [
    'bds-submenu',
    'bds-submenu--use-cases',
    isActive ? 'bds-submenu--active' : '',
    isClosing ? 'bds-submenu--closing' : '',
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames}>
      {/* Left Column */}
      <div className="bds-submenu__left">
        {useCasesSubmenuData.left.map((section) => (
          <div key={section.label} className="bds-submenu__section">
            <a href={section.href} className="bds-submenu__tier1 bds-submenu__parent-link">
              <span className="bds-submenu__icon">
                <img src={walletIcons[section.icon]} alt="" />
              </span>
              <span className="bds-submenu__link bds-submenu__link--bold">
                {section.label}
                <span className="bds-submenu__arrow">
                  <SubmenuArrow />
                </span>
              </span>
            </a>
            <div className="bds-submenu__tier2">
              {section.children.map((child) => (
                <a
                  key={child.label}
                  href={child.href}
                  className={`bds-submenu__sublink`}
                >
                  {child.label}
                  <span className="bds-submenu__sublink-arrow">
                    <SubmenuChildArrow />
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right Column */}
      <div className="bds-submenu__right">
        {useCasesSubmenuData.right.map((section) => (
          <div key={section.label} className="bds-submenu__section">
            <a href={section.href} className="bds-submenu__tier1 bds-submenu__parent-link">
              <span className="bds-submenu__icon">
                <img src={walletIcons[section.icon]} alt="" />
              </span>
              <span className="bds-submenu__link bds-submenu__link--bold">
                {section.label}
                <span className="bds-submenu__arrow">
                  <SubmenuArrow />
                </span>
              </span>
            </a>
            <div className="bds-submenu__tier2">
              {section.children.map((child) => (
                <a
                  key={child.label}
                  href={child.href}
                  className={`bds-submenu__sublink`}
                >
                  {child.label}
                  <span className="bds-submenu__sublink-arrow">
                    <SubmenuChildArrow />
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Desktop Community Submenu Component
// Mixed layout: some sections have children, some are header-only
function CommunitySubmenu({ isActive, isClosing }: { isActive: boolean; isClosing: boolean }) {
  const classNames = [
    'bds-submenu',
    'bds-submenu--community',
    isActive ? 'bds-submenu--active' : '',
    isClosing ? 'bds-submenu--closing' : '',
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames}>
      {/* Left Column */}
      <div className="bds-submenu__left">
        {communitySubmenuData.left.map((item) => (
          <div key={item.label} className="bds-submenu__section">
            <a href={item.href} className="bds-submenu__tier1 bds-submenu__parent-link">
              <span className="bds-submenu__icon">
                <img src={walletIcons[item.icon]} alt="" />
              </span>
              <span className="bds-submenu__link bds-submenu__link--bold">
                {item.label}
                <span className="bds-submenu__arrow">
                  <SubmenuArrow />
                </span>
              </span>
            </a>
            {hasChildren(item) && (
              <div className="bds-submenu__tier2">
                {item.children.map((child) => (
                  <a
                    key={child.label}
                    href={child.href}
                    className={`bds-submenu__sublink`}
                  >
                    {child.label}
                    <span className="bds-submenu__sublink-arrow">
                      <SubmenuChildArrow />
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right Column */}
      <div className="bds-submenu__right">
        {communitySubmenuData.right.map((item) => (
          <div key={item.label} className="bds-submenu__section">
            <a href={item.href} className="bds-submenu__tier1 bds-submenu__parent-link">
              <span className="bds-submenu__icon">
                <img src={walletIcons[item.icon]} alt="" />
              </span>
              <span className="bds-submenu__link bds-submenu__link--bold">
                {item.label}
                <span className="bds-submenu__arrow">
                  <SubmenuArrow />
                </span>
              </span>
            </a>
            {hasChildren(item) && (
              <div className="bds-submenu__tier2">
                {item.children.map((child) => (
                  <a
                    key={child.label}
                    href={child.href}
                    className={`bds-submenu__sublink`}
                  >
                    {child.label}
                    <span className="bds-submenu__sublink-arrow">
                      <SubmenuChildArrow />
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Desktop Network Submenu Component
// Two sections side by side with decorative images at bottom
function NetworkSubmenu({ isActive, isClosing }: { isActive: boolean; isClosing: boolean }) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Detect theme changes
  React.useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Pattern image mapping - theme-aware
  const patternImages: Record<'lilac' | 'green', string> = React.useMemo(() => ({
    lilac: isDarkMode ? darkLilacPattern : resourcesPurplePattern,
    green: isDarkMode ? darkInsightsGreenPattern : insightsGreenPattern,
  }), [isDarkMode]);

  const classNames = [
    'bds-submenu',
    'bds-submenu--network',
    isActive ? 'bds-submenu--active' : '',
    isClosing ? 'bds-submenu--closing' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {networkSubmenuData.map((section) => (
        <div key={section.label} className="bds-submenu__section">
          {/* Header */}
          <a href={section.href} className="bds-submenu__tier1 bds-submenu__parent-link">
            <span className="bds-submenu__icon">
              <img src={walletIcons[section.icon]} alt="" />
            </span>
            <span className="bds-submenu__link bds-submenu__link--bold">
              {section.label}
              <span className="bds-submenu__arrow">
                <SubmenuArrow />
              </span>
            </span>
          </a>
          
          {/* Content area with links and pattern */}
          <div className="bds-submenu__network-content">
            {/* Links list */}
            <div className="bds-submenu__tier2">
              {section.children.map((child) => (
                <a
                  key={child.label}
                  href={child.href}
                  className={`bds-submenu__sublink`}
                  target={child.href.startsWith('http') ? '_blank' : undefined}
                  rel={child.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {child.label}
                  <span className="bds-submenu__sublink-arrow">
                    <SubmenuChildArrow />
                  </span>
                </a>
              ))}
            </div>
            
            {/* Decorative pattern */}
            <div className="bds-submenu__pattern-container">
              <img 
                src={patternImages[section.patternColor]} 
                alt="" 
                className="bds-submenu__pattern"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Nav Items Component - Centered navigation links with submenu support
function NavItems({ activeSubmenu, onSubmenuEnter }: { 
  activeSubmenu: string | null; 
  onSubmenuEnter: (itemLabel: string) => void;
}) {
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
    <nav className="bds-navbar__items" aria-label="Main navigation">
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
        stroke="currentColor"
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
          <a href={item.href} className="bds-mobile-menu__tier1 bds-mobile-menu__parent-link">
            <span className="bds-mobile-menu__icon">
              <img src={walletIcons[item.icon]} alt="" />
            </span>
            <span className="bds-mobile-menu__link bds-mobile-menu__link--bold">
              {item.label}
              <span className="bds-mobile-menu__arrow">
                <SubmenuArrow />
              </span>
            </span>
          </a>
          {/* Show children if they exist (for Docs and Client Libraries) */}
          {hasChildren(item) && (
            <div className="bds-mobile-menu__tier2">
              {item.children.map((child) => (
                <a
                  key={child.label}
                  href={child.href}
                  className={`bds-mobile-menu__sublink`}
                  target={child.href.startsWith('http') ? '_blank' : undefined}
                  rel={child.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {child.label}
                  <span className="bds-mobile-menu__sublink-arrow">
                    <SubmenuChildArrow />
                  </span>
                </a>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Mobile Menu Use Cases Content (Accordion content for Use Cases section)
function MobileMenuUseCasesContent() {
  // Flatten the submenu data for mobile single-column layout
  const mobileItems: SubmenuItemWithChildren[] = [
    ...useCasesSubmenuData.left,
    ...useCasesSubmenuData.right,
  ];

  return (
    <div className="bds-mobile-menu__tier-list">
      {mobileItems.map((item) => (
        <React.Fragment key={item.label}>
          <a href={item.href} className="bds-mobile-menu__tier1 bds-mobile-menu__parent-link">
            <span className="bds-mobile-menu__icon">
              <img src={walletIcons[item.icon]} alt="" />
            </span>
            <span className="bds-mobile-menu__link bds-mobile-menu__link--bold">
              {item.label}
              <span className="bds-mobile-menu__arrow">
                <SubmenuArrow />
              </span>
            </span>
          </a>
          {/* All Use Cases items have children */}
          <div className="bds-mobile-menu__tier2">
            {item.children.map((child) => (
              <a
                key={child.label}
                href={child.href}
                className={`bds-mobile-menu__sublink`}
              >
                {child.label}
                <span className="bds-mobile-menu__sublink-arrow">
                  <SubmenuChildArrow />
                </span>
              </a>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// Mobile Menu Community Content (Accordion content for Community section)
function MobileMenuCommunityContent() {
  // Flatten the submenu data for mobile single-column layout
  const mobileItems: SubmenuItem[] = [
    ...communitySubmenuData.left,
    ...communitySubmenuData.right,
  ];

  return (
    <div className="bds-mobile-menu__tier-list">
      {mobileItems.map((item) => (
        <React.Fragment key={item.label}>
          <a href={item.href} className="bds-mobile-menu__tier1 bds-mobile-menu__parent-link">
            <span className="bds-mobile-menu__icon">
              <img src={walletIcons[item.icon]} alt="" />
            </span>
            <span className="bds-mobile-menu__link bds-mobile-menu__link--bold">
              {item.label}
              <span className="bds-mobile-menu__arrow">
                <SubmenuArrow />
              </span>
            </span>
          </a>
          {/* Show children if they exist */}
          {hasChildren(item) && (
            <div className="bds-mobile-menu__tier2">
              {item.children.map((child) => (
                <a
                  key={child.label}
                  href={child.href}
                  className={`bds-mobile-menu__sublink`}
                  target={child.href.startsWith('http') ? '_blank' : undefined}
                  rel={child.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {child.label}
                  <span className="bds-mobile-menu__sublink-arrow">
                    <SubmenuChildArrow />
                  </span>
                </a>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Mobile Menu Network Content (Accordion content for Network section)
function MobileMenuNetworkContent() {
  return (
    <div className="bds-mobile-menu__tier-list">
      {networkSubmenuData.map((section) => (
        <React.Fragment key={section.label}>
          <a href={section.href} className="bds-mobile-menu__tier1 bds-mobile-menu__parent-link">
            <span className="bds-mobile-menu__icon">
              <img src={walletIcons[section.icon]} alt="" />
            </span>
            <span className="bds-mobile-menu__link bds-mobile-menu__link--bold">
              {section.label}
              <span className="bds-mobile-menu__arrow">
                <SubmenuArrow />
              </span>
            </span>
          </a>
          {/* Network sections always have children */}
          <div className="bds-mobile-menu__tier2">
            {section.children.map((child) => (
              <a
                key={child.label}
                href={child.href}
                className={`bds-mobile-menu__sublink`}
                target={child.href.startsWith('http') ? '_blank' : undefined}
                rel={child.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {child.label}
                <span className="bds-mobile-menu__sublink-arrow">
                  <SubmenuChildArrow />
                </span>
              </a>
            ))}
          </div>
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
                  {item.label === 'Develop' && <MobileMenuDevelopContent />}
                  {item.label === 'Use Cases' && <MobileMenuUseCasesContent />}
                  {item.label === 'Community' && <MobileMenuCommunityContent />}
                  {item.label === 'Network' && <MobileMenuNetworkContent />}
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
  const [activeSubmenu, setActiveSubmenu] = React.useState<string | null>(null);
  const [closingSubmenu, setClosingSubmenu] = React.useState<string | null>(null);
  const submenuTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const closingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleHamburgerClick = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleSubmenuMouseEnter = (itemLabel: string) => {
    // Clear any pending close/closing timeouts
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
      submenuTimeoutRef.current = null;
    }
    if (closingTimeoutRef.current) {
      clearTimeout(closingTimeoutRef.current);
      closingTimeoutRef.current = null;
    }
    // Cancel closing state and activate the new submenu
    setClosingSubmenu(null);
    setActiveSubmenu(itemLabel);
  };

  const handleSubmenuMouseLeave = () => {
    submenuTimeoutRef.current = setTimeout(() => {
      // Start closing animation
      const currentSubmenu = activeSubmenu;
      if (currentSubmenu) {
        setClosingSubmenu(currentSubmenu);
        setActiveSubmenu(null);
        
        // After animation completes (300ms), clear closing state
        closingTimeoutRef.current = setTimeout(() => {
          setClosingSubmenu(null);
        }, 350); // Slightly longer than animation to ensure completion
      }
    }, 150);
  };

  // Handle scroll lock when submenu is open or closing
  React.useEffect(() => {
    if (activeSubmenu || closingSubmenu) {
      document.body.classList.add('bds-submenu-open');
    } else {
      document.body.classList.remove('bds-submenu-open');
    }
    return () => {
      document.body.classList.remove('bds-submenu-open');
    };
  }, [activeSubmenu, closingSubmenu]);

  React.useEffect(() => {
    return () => {
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
      if (closingTimeoutRef.current) {
        clearTimeout(closingTimeoutRef.current);
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
      {/* Backdrop blur overlay when submenu is open or closing */}
      <div 
        className={`bds-submenu-backdrop ${activeSubmenu || closingSubmenu ? 'bds-submenu-backdrop--active' : ''}`}
        onClick={() => setActiveSubmenu(null)}
      />
      <header 
        className={navbarClasses}
        onMouseLeave={handleSubmenuMouseLeave}
      >
        <div className="bds-navbar__content">
          <NavLogo />
          <NavItems activeSubmenu={activeSubmenu} onSubmenuEnter={handleSubmenuMouseEnter} />
          <NavControls />
          <HamburgerButton onClick={handleHamburgerClick} />
        </div>
        {/* Submenus positioned relative to navbar */}
        <div onMouseEnter={() => activeSubmenu && handleSubmenuMouseEnter(activeSubmenu)}>
          <DevelopSubmenu isActive={activeSubmenu === 'Develop'} isClosing={closingSubmenu === 'Develop'} />
          <UseCasesSubmenu isActive={activeSubmenu === 'Use Cases'} isClosing={closingSubmenu === 'Use Cases'} />
          <CommunitySubmenu isActive={activeSubmenu === 'Community'} isClosing={closingSubmenu === 'Community'} />
          <NetworkSubmenu isActive={activeSubmenu === 'Network'} isClosing={closingSubmenu === 'Network'} />
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
