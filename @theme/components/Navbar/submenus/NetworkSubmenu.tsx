import { Submenu } from "./Submenu";

interface NetworkSubmenuProps {
  isActive: boolean;
  isClosing: boolean;
  onClose?: () => void;
}

/**
 * Desktop Network Submenu Component.
 * Wrapper for unified Submenu component with 'network' variant.
 */
export function NetworkSubmenu({ isActive, isClosing, onClose }: NetworkSubmenuProps) {
  return <Submenu variant="network" isActive={isActive} isClosing={isClosing} onClose={onClose} />;
}

