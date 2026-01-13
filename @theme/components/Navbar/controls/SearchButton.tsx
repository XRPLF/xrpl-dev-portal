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
  return <IconButton icon={searchIcon} ariaLabel="Search" onClick={onClick} />;
}

