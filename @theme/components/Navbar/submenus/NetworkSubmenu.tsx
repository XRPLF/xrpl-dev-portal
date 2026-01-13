import { Submenu } from "./Submenu";

interface NetworkSubmenuProps {
  isActive: boolean;
  isClosing: boolean;
}

/**
 * Desktop Network Submenu Component.
 * Wrapper for unified Submenu component with 'network' variant.
 */
export function NetworkSubmenu({ isActive, isClosing }: NetworkSubmenuProps) {
  return <Submenu variant="network" isActive={isActive} isClosing={isClosing} />;
}

