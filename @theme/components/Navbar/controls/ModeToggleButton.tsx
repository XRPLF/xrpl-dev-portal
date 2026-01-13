import { IconButton } from "./IconButton";
import { modeToggleIcon } from "../constants/icons";

interface ModeToggleButtonProps {
  onClick?: () => void;
}

/**
 * Mode Toggle Button Component.
 * Icon button that toggles between light and dark mode.
 */
export function ModeToggleButton({ onClick }: ModeToggleButtonProps) {
  return <IconButton icon={modeToggleIcon} ariaLabel="Toggle color mode" onClick={onClick} />;
}

