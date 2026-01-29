import * as React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import { SubmenuSection } from "./SubmenuSection";
import { ArrowIcon } from "../icons";
import { walletIcons, resourcesIconPattern, insightsIconPattern } from "../constants/icons";
import { developSubmenuData, useCasesSubmenuData, communitySubmenuData, networkSubmenuData } from "../constants/navigation";
import type { SubmenuItem, SubmenuItemWithChildren, NetworkSubmenuSection } from "../types";

export type SubmenuVariant = 'develop' | 'use-cases' | 'community' | 'network';

interface SubmenuProps {
  /** Which submenu variant to render */
  variant: SubmenuVariant;
  /** Whether this submenu is currently active (visible) */
  isActive: boolean;
  /** Whether this submenu is in closing animation */
  isClosing: boolean;
  /** Callback when submenu should close (e.g., Escape key) */
  onClose?: () => void;
}

/** Get submenu data based on variant */
function getSubmenuData(variant: SubmenuVariant) {
  switch (variant) {
    case 'develop': return developSubmenuData;
    case 'use-cases': return useCasesSubmenuData;
    case 'community': return communitySubmenuData;
    case 'network': return networkSubmenuData;
  }
}

/** Get CSS modifier class for variant */
function getVariantClass(variant: SubmenuVariant): string {
  if (variant === 'develop') return '';
  return `bds-submenu--${variant}`;
}

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
  );
}

/**
 * Find the next nav item button after the current expanded one
 */
function getNextNavItem(): HTMLElement | null {
  const navItems = document.querySelectorAll<HTMLElement>('.bds-navbar__item');
  const currentIndex = Array.from(navItems).findIndex(item =>
    item.getAttribute('aria-expanded') === 'true'
  );
  if (currentIndex >= 0 && currentIndex < navItems.length - 1) {
    return navItems[currentIndex + 1];
  }
  // If at the last nav item, go to the first control button (search, etc.)
  const controls = document.querySelector<HTMLElement>('.bds-navbar__controls button, .bds-navbar__controls a');
  return controls;
}

/**
 * Unified Submenu component.
 * Handles all submenu variants (develop, use-cases, community, network).
 * ARIA compliant with full keyboard navigation support.
 */
export function Submenu({ variant, isActive, isClosing, onClose }: SubmenuProps) {
  const submenuRef = React.useRef<HTMLDivElement>(null);

  // Handle keyboard events for accessibility
  const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
    if (!isActive) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      onClose?.();
      // Return focus to the trigger button
      const triggerButton = document.querySelector<HTMLButtonElement>(
        `.bds-navbar__item[aria-expanded="true"]`
      );
      triggerButton?.focus();
    }

    // Handle Tab at end of submenu - move to next nav item
    if (event.key === 'Tab' && !event.shiftKey) {
      const activeSubmenu = document.querySelector<HTMLElement>('.bds-submenu--active');
      const focusableElements = getFocusableElements(activeSubmenu);
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        onClose?.();
        const nextItem = getNextNavItem();
        nextItem?.focus();
      }
    }

    // Handle Shift+Tab at start of submenu - move back to trigger button
    if (event.key === 'Tab' && event.shiftKey) {
      const activeSubmenu = document.querySelector<HTMLElement>('.bds-submenu--active');
      const focusableElements = getFocusableElements(activeSubmenu);
      const firstFocusable = focusableElements[0];

      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        onClose?.();
        // Return focus to the trigger button
        const triggerButton = document.querySelector<HTMLButtonElement>(
          `.bds-navbar__item[aria-expanded="true"]`
        );
        triggerButton?.focus();
      }
    }
  }, [isActive, onClose]);

  // Add keyboard event listener when submenu is active
  React.useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, handleKeyDown]);

  // Network submenu needs special handling for theme-aware patterns
  if (variant === 'network') {
    return <NetworkSubmenuContent isActive={isActive} isClosing={isClosing} onClose={onClose} />;
  }

  const data = getSubmenuData(variant);
  const classNames = [
    'bds-submenu',
    getVariantClass(variant),
    isActive ? 'bds-submenu--active' : '',
    isClosing ? 'bds-submenu--closing' : '',
  ].filter(Boolean).join(' ');

  // Standard two-column layout
  const leftItems = 'left' in data ? data.left : [];
  const rightItems = 'right' in data ? data.right : [];

  return (
    <div
      ref={submenuRef}
      className={classNames}
      role="menu"
      aria-hidden={!isActive}
    >
      <div className="bds-submenu__left">
        {leftItems.map((item: SubmenuItem | SubmenuItemWithChildren) => (
          <SubmenuSection key={item.label} item={item} />
        ))}
      </div>
      <div className="bds-submenu__right">
        {rightItems.map((item: SubmenuItem | SubmenuItemWithChildren) => (
          <SubmenuSection key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}

/** Network submenu with pattern images (same for light and dark mode) */
function NetworkSubmenuContent({ isActive, isClosing, onClose }: { isActive: boolean; isClosing: boolean; onClose?: () => void }) {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  // Handle keyboard events for accessibility
  const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
    if (!isActive) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      onClose?.();
      // Return focus to the trigger button
      const triggerButton = document.querySelector<HTMLButtonElement>(
        `.bds-navbar__item[aria-expanded="true"]`
      );
      triggerButton?.focus();
    }

    // Handle Tab at end of submenu - move to next nav item
    if (event.key === 'Tab' && !event.shiftKey) {
      const activeSubmenu = document.querySelector<HTMLElement>('.bds-submenu--active');
      const focusableElements = getFocusableElements(activeSubmenu);
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        onClose?.();
        const nextItem = getNextNavItem();
        nextItem?.focus();
      }
    }

    // Handle Shift+Tab at start of submenu - move back to trigger button
    if (event.key === 'Tab' && event.shiftKey) {
      const activeSubmenu = document.querySelector<HTMLElement>('.bds-submenu--active');
      const focusableElements = getFocusableElements(activeSubmenu);
      const firstFocusable = focusableElements[0];

      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        onClose?.();
        // Return focus to the trigger button
        const triggerButton = document.querySelector<HTMLButtonElement>(
          `.bds-navbar__item[aria-expanded="true"]`
        );
        triggerButton?.focus();
      }
    }
  }, [isActive, onClose]);

  // Add keyboard event listener when submenu is active
  React.useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, handleKeyDown]);

  // Use same pattern images for both light and dark mode
  const patternImages = {
    lilac: resourcesIconPattern,
    green: insightsIconPattern,
  };

  const classNames = [
    'bds-submenu',
    'bds-submenu--network',
    isActive ? 'bds-submenu--active' : '',
    isClosing ? 'bds-submenu--closing' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} role="menu" aria-hidden={!isActive}>
      {networkSubmenuData.map((section: NetworkSubmenuSection) => (
        <div key={section.label} className="bds-submenu__section">
          <a href={section.href} className="bds-submenu__tier1 bds-submenu__parent-link">
            <span className="bds-submenu__icon">
              <img src={walletIcons[section.icon]} alt="" />
            </span>
            <span className="bds-submenu__link bds-submenu__link--bold">
              {translate(section.label)}
              <span className="bds-submenu__arrow">
                <ArrowIcon animated />
              </span>
            </span>
          </a>
          <div className="bds-submenu__network-content">
            <div className="bds-submenu__tier2">
              {section.children.map((child) => (
                <a
                  key={child.label}
                  href={child.href}
                  className="bds-submenu__sublink"
                  target={child.href.startsWith('http') ? '_blank' : undefined}
                  rel={child.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {translate(child.label)}
                  <span className="bds-submenu__sublink-arrow">
                    <ArrowIcon animated={false} />
                  </span>
                </a>
              ))}
            </div>
            <div className="bds-submenu__pattern-container">
              <img src={patternImages[section.patternColor]} alt="" className="bds-submenu__pattern" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

