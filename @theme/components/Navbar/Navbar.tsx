import * as React from "react";
import { useLocation } from "react-router-dom";
import { useSearchDialog } from "@redocly/theme/core/hooks";
import { SearchDialog } from "@redocly/theme/components/Search/SearchDialog";

// Import from modular components
import { AlertBanner } from "./components/AlertBanner";
import { NavLogo } from "./components/NavLogo";
import { NavItems } from "./components/NavItems";
import { NavControls, HamburgerButton } from "./controls";
import { DevelopSubmenu, UseCasesSubmenu, CommunitySubmenu, NetworkSubmenu } from "./submenus";
import { MobileMenu } from "./mobile-menu";
import { alertBanner } from "./constants/navigation";

// Re-export AlertBanner for backwards compatibility
export { AlertBanner } from "./components/AlertBanner";

// Props interface for Navbar (extensible for future use)
interface NavbarProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * Main Navbar Component.
 * Renders the complete navigation bar including:
 * - Alert banner (when enabled)
 * - Logo
 * - Navigation items with desktop submenus
 * - Control buttons (search, theme toggle, language)
 * - Mobile menu
 */
export function Navbar({
  className,
  onMouseLeave,
  ...headerProps
}: NavbarProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeSubmenu, setActiveSubmenu] = React.useState<string | null>(null);
  const [closingSubmenu, setClosingSubmenu] = React.useState<string | null>(null);
  const submenuTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const closingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  // Mirror `activeSubmenu` in a ref so the (memoized) closeSubmenu callback
  // can read the latest value without going stale and without triggering
  // side-effects from inside a setState updater (which React may replay).
  const activeSubmenuRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    activeSubmenuRef.current = activeSubmenu;
  }, [activeSubmenu]);

  // Use Redocly's search dialog hook - shared across navbar and mobile menu
  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useSearchDialog();

  // The Navbar persists across client-side (react-router) navigations, so any
  // open menu would otherwise stay open after clicking a nav link. Close the
  // mobile menu and desktop submenus whenever the route changes so the nav
  // hides on each new page load.
  const { pathname } = useLocation();
  const isInitialRender = React.useRef(true);

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

  const closeSubmenu = React.useCallback(() => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
      submenuTimeoutRef.current = null;
    }
    if (closingTimeoutRef.current) {
      clearTimeout(closingTimeoutRef.current);
      closingTimeoutRef.current = null;
    }

    // Snapshot the previously-active submenu so we can trigger its fade-out
    // animation as a separate state update — keeps the setState updaters pure.
    const previouslyActive = activeSubmenuRef.current;
    setActiveSubmenu(null);
    if (previouslyActive !== null) {
      setClosingSubmenu(previouslyActive);
    }

    closingTimeoutRef.current = setTimeout(() => {
      setClosingSubmenu(null);
      closingTimeoutRef.current = null;
    }, 350);
  }, []);

  const handleSubmenuMouseLeave = () => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
      submenuTimeoutRef.current = null;
    }
    submenuTimeoutRef.current = setTimeout(() => {
      submenuTimeoutRef.current = null;
      closeSubmenu();
    }, 150);
  };

  const handleSubmenuClose = () => {
    closeSubmenu();
  };

  // Handle scroll lock + inert page content while a submenu is open.
  // `inert` prevents Tab from reaching links/buttons in the page behind the
  // open submenu. Scoped to the page wrappers + footer so the navbar itself
  // stays interactive. Cleared when the submenu fully closes (no closingSubmenu).
  React.useEffect(() => {
    const isSubmenuVisible = Boolean(activeSubmenu || closingSubmenu);
    const isFullyOpen = Boolean(activeSubmenu); // only inert while truly open, not during closing animation

    if (isSubmenuVisible) {
      document.body.classList.add('bds-submenu-open');
    } else {
      document.body.classList.remove('bds-submenu-open');
    }

    const inertTargets = document.querySelectorAll<HTMLElement>(
      'main, .bds-page-wrapper, footer'
    );
    inertTargets.forEach((el) => {
      if (isFullyOpen) {
        el.setAttribute('inert', '');
      } else {
        el.removeAttribute('inert');
      }
    });

    return () => {
      document.body.classList.remove('bds-submenu-open');
      document
        .querySelectorAll<HTMLElement>('main, .bds-page-wrapper, footer')
        .forEach((el) => el.removeAttribute('inert'));
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

  // Close all menus on route change (client-side navigation). Skip the initial
  // render — nothing is open yet — and clear pending submenu timers so no
  // fade-out animation lingers onto the newly loaded page.
  React.useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
      submenuTimeoutRef.current = null;
    }
    if (closingTimeoutRef.current) {
      clearTimeout(closingTimeoutRef.current);
      closingTimeoutRef.current = null;
    }
    setMobileMenuOpen(false);
    setActiveSubmenu(null);
    setClosingSubmenu(null);
  }, [pathname]);

  const navbarClasses = [
    "bds-navbar",
    alertBanner.show ? "bds-navbar--with-banner" : "",
    className ?? ""
  ].filter(Boolean).join(" ");

  return (
    <>
      {/*
        Preload Booton Regular — the navbar font, used above the fold on every
        page. Without this the browser can't fetch the font until it has
        downloaded + parsed the ~775KB devportal2024-v1.css (which declares the
        `font-family: Booton` usage), so the custom font takes ~1s to swap in.
        This starts the fetch immediately, in parallel with the CSS. The href
        is literal (not bundler-resolved) so it matches the `url("../font/...")`
        the stylesheet resolves to (/font/Booton-Regular.woff2); `crossOrigin`
        is required because fonts are always fetched in CORS mode.
        Only Regular (400) is preloaded globally: docs pages (the bulk of the
        site) render body/headings in system fonts and only use Booton in the
        navbar, so preloading heavier weights here would waste bandwidth on
        those pages. Landing-page hero weights (Booton Light 300 / Bold 700,
        Tobias) should be preloaded per-landing-page instead.
      */}
      <link rel="preload" href="/font/Booton-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <AlertBanner {...alertBanner} />
      {/* Backdrop blur overlay when submenu is open or closing */}
      <div 
        className={`bds-submenu-backdrop ${activeSubmenu || closingSubmenu ? 'bds-submenu-backdrop--active' : ''}`}
        onClick={closeSubmenu}
      />
      <header 
        {...headerProps}
        className={navbarClasses}
        onMouseLeave={(event) => {
          onMouseLeave?.(event);
          handleSubmenuMouseLeave();
        }}
      >
        <div className="bds-navbar__content">
          <NavLogo />
          <NavItems activeSubmenu={activeSubmenu} onSubmenuEnter={handleSubmenuMouseEnter} onSubmenuClose={handleSubmenuClose} />
          <NavControls onSearch={onSearchOpen} />
          <HamburgerButton onClick={handleHamburgerClick} isOpen={mobileMenuOpen} />
        </div>
        {/* Submenus positioned relative to navbar */}
        <div onMouseEnter={() => activeSubmenu && handleSubmenuMouseEnter(activeSubmenu)}>
          <DevelopSubmenu isActive={activeSubmenu === 'Develop'} isClosing={closingSubmenu === 'Develop'} onClose={handleSubmenuClose} />
          <UseCasesSubmenu isActive={activeSubmenu === 'Use Cases'} isClosing={closingSubmenu === 'Use Cases'} onClose={handleSubmenuClose} />
          <CommunitySubmenu isActive={activeSubmenu === 'Community'} isClosing={closingSubmenu === 'Community'} onClose={handleSubmenuClose} />
          <NetworkSubmenu isActive={activeSubmenu === 'Network'} isClosing={closingSubmenu === 'Network'} onClose={handleSubmenuClose} />
        </div>
      </header>
      <MobileMenu isOpen={mobileMenuOpen} onClose={handleMobileMenuClose} onSearch={onSearchOpen} />
      {/* Render SearchDialog when open - this is the actual search modal */}
      {isSearchOpen && <SearchDialog onClose={onSearchClose} />}
    </>
  );
}
