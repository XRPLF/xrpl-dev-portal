import * as React from "react";
import { SearchButton } from "./SearchButton";
import { ModeToggleButton } from "./ModeToggleButton";
import { LanguagePill } from "./LanguagePill";
import { LanguageDropdown } from "./LanguageDropdown";

interface NavControlsProps {
  onSearch?: () => void;
}

/**
 * Nav Controls Component.
 * Right side of the navbar containing search, mode toggle, and language selector.
 */
export function NavControls({ onSearch }: NavControlsProps) {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = React.useState(false);

  const handleModeToggle = () => {
    // Toggle between light and dark theme
    const newTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    window.localStorage.setItem("user-prefers-color", newTheme);
    document.body.style.transition = "background-color .2s ease";
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(newTheme);
  };

  const handleLanguageClick = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageDropdownClose = () => {
    setIsLanguageDropdownOpen(false);
  };

  return (
    <div className="bds-navbar__controls">
      <SearchButton onClick={onSearch} />
      <ModeToggleButton onClick={handleModeToggle} />
      <div className="bds-navbar__lang-wrapper">
        <LanguagePill onClick={handleLanguageClick} isOpen={isLanguageDropdownOpen} />
        <LanguageDropdown isOpen={isLanguageDropdownOpen} onClose={handleLanguageDropdownClose} />
      </div>
    </div>
  );
}

