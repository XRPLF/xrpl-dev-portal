import * as React from "react";

interface ChevronIconProps {
  expanded: boolean;
}

/**
 * Chevron Icon Component for Mobile Accordion
 */
export function ChevronIcon({ expanded }: ChevronIconProps) {
  return (
    <svg
      className={`bds-mobile-menu__chevron ${expanded ? 'bds-mobile-menu__chevron--expanded' : ''}`}
      width="13"
      height="8"
      viewBox="0 0 13 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1L6.5 6.5L12 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

