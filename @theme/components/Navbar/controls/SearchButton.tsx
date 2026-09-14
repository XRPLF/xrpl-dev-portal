import { useThemeHooks } from "@redocly/theme/core/hooks";
import { IconButton } from "./IconButton";
import { searchIcon } from "../constants/icons";

interface SearchButtonProps {
  onClick?: () => void;
}

/**
 * Search Button Component.
 * Icon button that triggers the search modal.
 */
export function SearchButton({ onClick }: SearchButtonProps) {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return <IconButton icon={searchIcon} ariaLabel={translate("Search")} onClick={onClick} />;
}

