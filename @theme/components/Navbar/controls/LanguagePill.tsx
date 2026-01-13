import { useLanguagePicker } from "@redocly/theme/core/hooks";
import { globeIcon, chevronDown } from "../constants/icons";

interface LanguagePillProps {
  onClick?: () => void;
  isOpen?: boolean;
}

/**
 * Get short display name for a locale code.
 * e.g., "en-US" -> "En", "ja" -> "日本語"
 */
function getLocaleShortName(code: string | undefined): string {
  if (!code) return "En";

  // Map locale codes to short display names
  const shortNames: Record<string, string> = {
    "en-US": "En",
    "en": "En",
    "ja": "日本語",
  };

  return shortNames[code] || code.substring(0, 2).toUpperCase();
}

/**
 * Language Pill Button Component.
 * Shows current language and opens language selector.
 */
export function LanguagePill({ onClick, isOpen }: LanguagePillProps) {
  const { currentLocale } = useLanguagePicker();
  const displayName = getLocaleShortName(currentLocale?.code);

  return (
    <button
      type="button"
      className={`bds-navbar__lang-pill ${isOpen ? 'bds-navbar__lang-pill--open' : ''}`}
      aria-label="Select language"
      aria-expanded={isOpen}
      aria-haspopup="menu"
      onClick={onClick}
    >
      <img src={globeIcon} alt="" className="bds-navbar__lang-pill-icon" />
      <span className="bds-navbar__lang-pill-text">
        <span>{displayName}</span>
        <img src={chevronDown} alt="" className="bds-navbar__lang-pill-chevron" />
      </span>
    </button>
  );
}

