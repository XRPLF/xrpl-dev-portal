import { Submenu } from "./Submenu";

interface UseCasesSubmenuProps {
  isActive: boolean;
  isClosing: boolean;
}

/**
 * Desktop Use Cases Submenu Component.
 * Wrapper for unified Submenu component with 'use-cases' variant.
 */
export function UseCasesSubmenu({ isActive, isClosing }: UseCasesSubmenuProps) {
  return <Submenu variant="use-cases" isActive={isActive} isClosing={isClosing} />;
}

