import { useThemeHooks } from "@redocly/theme/core/hooks";
import { ArrowIcon } from "../icons";
import { walletIcons } from "../constants/icons";
import { hasChildren, type SubmenuItem, type SubmenuItemWithChildren, type SubmenuItemBase } from "../types";

interface SubmenuSectionProps {
  /** The menu item data */
  item: SubmenuItem | SubmenuItemWithChildren | SubmenuItemBase;
  /** Whether to render children links (default: true) */
  showChildren?: boolean;
}

/**
 * Unified submenu section component.
 * Renders a parent link with icon, and optionally child links if the item has them.
 *
 * Usage:
 * - For items that may or may not have children: <SubmenuSection item={item} />
 * - For parent-only rendering: <SubmenuSection item={item} showChildren={false} />
 */
export function SubmenuSection({ item, showChildren = true }: SubmenuSectionProps) {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const itemHasChildren = hasChildren(item as SubmenuItem);
  const shouldShowChildren = showChildren && itemHasChildren;

  return (
    <div className="bds-submenu__section">
      <a href={item.href} className="bds-submenu__tier1 bds-submenu__parent-link">
        <span className="bds-submenu__icon">
          <img src={walletIcons[item.icon]} alt="" />
        </span>
        <span className="bds-submenu__link bds-submenu__link--bold">
          {translate(item.label)}
          <span className="bds-submenu__arrow">
            <ArrowIcon animated />
          </span>
        </span>
      </a>
      {shouldShowChildren && (
        <div className="bds-submenu__tier2">
          {(item as SubmenuItemWithChildren).children.map((child) => (
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
      )}
    </div>
  );
}

// Backwards-compatible aliases (all use the unified SubmenuSection)
export const SubmenuParentOnly = ({ item }: { item: SubmenuItemBase }) => (
  <SubmenuSection item={item} showChildren={false} />
);

export const SubmenuWithChildren = ({ item }: { item: SubmenuItemWithChildren }) => (
  <SubmenuSection item={item} showChildren={true} />
);

