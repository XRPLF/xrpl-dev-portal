import { Submenu } from "./Submenu";

interface CommunitySubmenuProps {
  isActive: boolean;
  isClosing: boolean;
  onClose?: () => void;
}

/**
 * Desktop Community Submenu Component.
 * Wrapper for unified Submenu component with 'community' variant.
 */
export function CommunitySubmenu({ isActive, isClosing, onClose }: CommunitySubmenuProps) {
  return <Submenu variant="community" isActive={isActive} isClosing={isClosing} onClose={onClose} />;
}

