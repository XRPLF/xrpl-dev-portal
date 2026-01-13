import * as React from "react";

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
interface NavbarProps {
  className?: string;
}

/**
 * Main Navbar Component.
 * Renders the complete navigation bar including:
 * - Alert banner (when enabled)
 * - Logo
 * - Navigation items with desktop submenus
 * - Control buttons (search, theme toggle, language)
 * - Mobile menu
 */
export function Navbar(_props: NavbarProps = {}) {
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
