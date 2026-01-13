import { MobileMenuSection } from "./MobileMenuSection";
import { developSubmenuData, useCasesSubmenuData, communitySubmenuData, networkSubmenuData } from "../constants/navigation";
import type { SubmenuItem, SubmenuItemWithChildren, NetworkSubmenuSection } from "../types";

export type MobileMenuKey = 'Develop' | 'Use Cases' | 'Community' | 'Network';

interface MobileMenuContentProps {
  /** Which menu section to render */
  menuKey: MobileMenuKey;
}

/** Get flattened menu items based on menu key */
function getMenuItems(menuKey: MobileMenuKey): (SubmenuItem | SubmenuItemWithChildren | NetworkSubmenuSection)[] {
  switch (menuKey) {
    case 'Develop':
      return [...developSubmenuData.left, ...developSubmenuData.right];
    case 'Use Cases':
      return [...useCasesSubmenuData.left, ...useCasesSubmenuData.right];
    case 'Community':
      return [...communitySubmenuData.left, ...communitySubmenuData.right];
    case 'Network':
      return networkSubmenuData;
  }
}

/**
 * Unified Mobile Menu Content component.
 * Renders accordion content for any menu section.
 */
export function MobileMenuContent({ menuKey }: MobileMenuContentProps) {
  const items = getMenuItems(menuKey);

  return (
    <div className="bds-mobile-menu__tier-list">
      {items.map((item) => (
        <MobileMenuSection key={item.label} item={item} />
      ))}
    </div>
  );
}

// Backwards-compatible named exports
export const MobileMenuDevelopContent = () => <MobileMenuContent menuKey="Develop" />;
export const MobileMenuUseCasesContent = () => <MobileMenuContent menuKey="Use Cases" />;
export const MobileMenuCommunityContent = () => <MobileMenuContent menuKey="Community" />;
export const MobileMenuNetworkContent = () => <MobileMenuContent menuKey="Network" />;

