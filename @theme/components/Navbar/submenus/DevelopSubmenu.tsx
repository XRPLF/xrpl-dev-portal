import { Submenu } from "./Submenu";

interface DevelopSubmenuProps {
  isActive: boolean;
  isClosing: boolean;
  onClose?: () => void;
}

/**
 * Desktop Develop Submenu Component.
 * Wrapper for unified Submenu component with 'develop' variant.
 */
export function DevelopSubmenu({ isActive, isClosing, onClose }: DevelopSubmenuProps) {
  return <Submenu variant="develop" isActive={isActive} isClosing={isClosing} onClose={onClose} />;
}

