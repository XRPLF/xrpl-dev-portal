import * as React from "react";
import { SubmenuSection } from "./SubmenuSection";
import { ArrowIcon } from "../icons";
import { walletIcons, resourcesPurplePattern, insightsGreenPattern, darkInsightsGreenPattern, darkLilacPattern } from "../constants/icons";
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
 * Unified Submenu component.
 * Handles all submenu variants (develop, use-cases, community, network).
 */
export function Submenu({ variant, isActive, isClosing }: SubmenuProps) {
  // Network submenu needs special handling for theme-aware patterns
  if (variant === 'network') {
    return <NetworkSubmenuContent isActive={isActive} isClosing={isClosing} />;
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
    <div className={classNames}>
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

/** Network submenu with theme-aware pattern images */
function NetworkSubmenuContent({ isActive, isClosing }: { isActive: boolean; isClosing: boolean }) {
  // Start with null to indicate "not yet determined" - avoids hydration mismatch
  // by ensuring server and client both render the same initial state
  const [isDarkMode, setIsDarkMode] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Default to light mode patterns until client-side detection runs
  const patternImages = React.useMemo(() => ({
    lilac: isDarkMode === true ? darkLilacPattern : resourcesPurplePattern,
    green: isDarkMode === true ? darkInsightsGreenPattern : insightsGreenPattern,
  }), [isDarkMode]);

  const classNames = [
    'bds-submenu',
    'bds-submenu--network',
    isActive ? 'bds-submenu--active' : '',
    isClosing ? 'bds-submenu--closing' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {networkSubmenuData.map((section: NetworkSubmenuSection) => (
        <div key={section.label} className="bds-submenu__section">
          <a href={section.href} className="bds-submenu__tier1 bds-submenu__parent-link">
            <span className="bds-submenu__icon">
              <img src={walletIcons[section.icon]} alt="" />
            </span>
            <span className="bds-submenu__link bds-submenu__link--bold">
              {section.label}
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
                  {child.label}
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

