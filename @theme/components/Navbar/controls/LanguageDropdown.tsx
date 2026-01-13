import * as React from "react";
import { useLanguagePicker } from "@redocly/theme/core/hooks";

interface LanguageDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Language Dropdown Component.
 * Displays available language options in a dropdown menu.
 * Based on Figma design: dark background with rounded corners.
 */
export function LanguageDropdown({ isOpen, onClose }: LanguageDropdownProps) {
  const { currentLocale, locales, setLocale } = useLanguagePicker();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Handle clicking outside to close
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Check if click was on the language pill (parent trigger)
        const target = event.target as HTMLElement;
        if (!target.closest('.bds-navbar__lang-pill')) {
          onClose();
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || locales.length < 2) {
    return null;
  }

  const handleLanguageSelect = (localeCode: string) => {
    setLocale(localeCode);
    onClose();
  };

  return (
    <div 
      ref={dropdownRef}
      className="bds-lang-dropdown"
      role="menu"
      aria-label="Language selection"
    >
      {locales.map((locale) => {
        const isActive = locale.code === currentLocale?.code;
        return (
          <button
            key={locale.code}
            type="button"
            role="menuitem"
            className={`bds-lang-dropdown__item ${isActive ? 'bds-lang-dropdown__item--active' : ''}`}
            onClick={() => handleLanguageSelect(locale.code)}
            aria-current={isActive ? 'true' : undefined}
          >
            {locale.name || locale.code}
          </button>
        );
      })}
    </div>
  );
}

