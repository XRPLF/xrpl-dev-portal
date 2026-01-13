import * as React from "react";
import { SubmenuArrow, SubmenuChildArrow } from "../icons";
import { walletIcons } from "../constants/icons";
import { hasChildren, type SubmenuItem } from "../types";

interface MobileMenuSectionProps {
  item: SubmenuItem;
}

/**
 * Reusable mobile menu section component.
 * Renders a parent link with icon, and optionally child links.
 */
export function MobileMenuSection({ item }: MobileMenuSectionProps) {
  const itemHasChildren = hasChildren(item);

  return (
    <React.Fragment>
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
      {itemHasChildren && (
        <div className="bds-mobile-menu__tier2">
          {item.children.map((child) => (
            <a
              key={child.label}
              href={child.href}
              className="bds-mobile-menu__sublink"
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
  );
}

