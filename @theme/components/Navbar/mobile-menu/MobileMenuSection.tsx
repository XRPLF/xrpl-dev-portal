import * as React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import { SubmenuArrow, SubmenuChildArrow } from "../icons";
import { navIcons } from "../constants/icons";
import { hasChildren, type SubmenuItem } from "../types";

interface MobileMenuSectionProps {
  item: SubmenuItem;
  /** Invoked when any link in the section is clicked, so the menu closes on SPA navigation */
  onClose?: () => void;
}

/**
 * Reusable mobile menu section component.
 * Renders a parent link with icon, and optionally child links.
 */
export function MobileMenuSection({ item, onClose }: MobileMenuSectionProps) {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const itemHasChildren = hasChildren(item);

  return (
    <React.Fragment>
      <a
        href={item.href}
        className="bds-mobile-menu__tier1 bds-mobile-menu__parent-link"
        onClick={onClose}
      >
        <span className="bds-mobile-menu__icon">
          <img src={navIcons[item.icon]} alt="" />
        </span>
        <span className="bds-mobile-menu__link bds-mobile-menu__link--bold">
          {translate(item.labelTranslationKey ?? item.label, item.label)}
          <span className="bds-mobile-menu__arrow">
            <SubmenuArrow />
          </span>
        </span>
      </a>
      {itemHasChildren && (
        <div className="bds-mobile-menu__tier2">
          {item.children.map((child) => (
            <a
              key={child.label}
              href={child.href}
              className="bds-mobile-menu__sublink label-l"
              target={child.href.startsWith('http') ? '_blank' : undefined}
              rel={child.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              onClick={onClose}
            >
              {translate(child.labelTranslationKey ?? child.label, child.label)}
              <span className="bds-mobile-menu__sublink-arrow">
                <SubmenuChildArrow />
              </span>
            </a>
          ))}
        </div>
      )}
    </React.Fragment>
  );
}

