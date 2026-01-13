import { Submenu } from "./Submenu";

interface CommunitySubmenuProps {
  isActive: boolean;
  isClosing: boolean;
}

/**
 * Desktop Community Submenu Component.
 * Wrapper for unified Submenu component with 'community' variant.
 */
export function CommunitySubmenu({ isActive, isClosing }: CommunitySubmenuProps) {
  return <Submenu variant="community" isActive={isActive} isClosing={isClosing} />;
}

