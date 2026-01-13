import { useThemeHooks } from "@redocly/theme/core/hooks";
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
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return <IconButton icon={modeToggleIcon} ariaLabel={translate("Toggle color mode")} onClick={onClick} />;
}

