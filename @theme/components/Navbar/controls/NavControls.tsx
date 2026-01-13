import * as React from "react";
import { SearchButton } from "./SearchButton";
import { ModeToggleButton } from "./ModeToggleButton";
import { LanguagePill } from "./LanguagePill";

/**
 * Nav Controls Component.
 * Right side of the navbar containing search, mode toggle, and language selector.
 */
export function NavControls() {
  const handleSearch = () => {
    // Trigger the search modal
    const searchTrigger = document.querySelector('[data-component-name="Search/SearchTrigger"]') as HTMLElement;
    if (searchTrigger) {
      searchTrigger.click();
    }
  };

  const handleModeToggle = () => {
    // Toggle between light and dark theme
    const newTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    window.localStorage.setItem("user-prefers-color", newTheme);
    document.body.style.transition = "background-color .2s ease";
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(newTheme);
  };

  const handleLanguageClick = () => {
    // Placeholder - language selection will be enhanced in future phases
    console.log("Language selector clicked");
  };

  return (
    <div className="bds-navbar__controls">
      <SearchButton onClick={handleSearch} />
      <ModeToggleButton onClick={handleModeToggle} />
      <LanguagePill onClick={handleLanguageClick} />
    </div>
  );
}

