import * as React from "react";
import { globeIcon, chevronDown } from "../constants/icons";

interface LanguagePillProps {
  onClick?: () => void;
}

/**
 * Language Pill Button Component.
 * Shows current language and opens language selector.
 */
export function LanguagePill({ onClick }: LanguagePillProps) {
  return (
    <button
      type="button"
      className="bds-navbar__lang-pill"
      aria-label="Select language"
      onClick={onClick}
    >
      <img src={globeIcon} alt="" className="bds-navbar__lang-pill-icon" />
      <span className="bds-navbar__lang-pill-text">
        <span>En</span>
        <img src={chevronDown} alt="" className="bds-navbar__lang-pill-chevron" />
      </span>
    </button>
  );
}

