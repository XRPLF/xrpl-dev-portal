// Types for submenu data structures

export interface SubmenuChild {
  label: string;
  href: string;
  active?: boolean;
}

export interface SubmenuItemBase {
  label: string;
  href: string;
  icon: string;
}

export interface SubmenuItemWithChildren extends SubmenuItemBase {
  children: SubmenuChild[];
}

export type SubmenuItem = SubmenuItemBase | SubmenuItemWithChildren;

// Network submenu section with decorative images
export interface NetworkSubmenuSection {
  label: string;
  href: string;
  icon: string;
  children: SubmenuChild[];
  patternColor: 'lilac' | 'green';
}

// Nav item type
export interface NavItem {
  label: string;
  labelTranslationKey: string;
  href: string;
  hasSubmenu: boolean;
}

// Type guard to check if item has children
export function hasChildren(item: SubmenuItem): item is SubmenuItemWithChildren {
  return 'children' in item && Array.isArray((item as SubmenuItemWithChildren).children);
}

