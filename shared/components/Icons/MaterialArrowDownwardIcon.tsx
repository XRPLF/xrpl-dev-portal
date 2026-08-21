/**
 * MaterialArrowDownwardIcon — Downward arrow.
 *
 * ---------------------------------------------------------------------------
 * THIRD-PARTY ARTWORK — Apache License, Version 2.0
 * ---------------------------------------------------------------------------
 * Material Icons, Copyright Google LLC. Used under the Apache License,
 * Version 2.0. Full terms and the pinned upstream commit are in the LICENSE
 * file at the repository root.
 *
 * UPSTREAM SOURCE — the exact file this was taken from:
 *
 *   google/material-design-icons
 *   src/navigation/arrow_downward/materialiconssharp/24px.svg
 *   @ e083cc60a0828fdd3b404cea0cb8a5b900e9c23e
 *
 * NOTICE OF MODIFICATION (Apache 2.0 §4(b) requires that changed files carry
 * a notice that they were changed). The changes are:
 *
 *   1. Re-expressed as a React component. The upstream .svg file itself is
 *      not redistributed; the path geometry is carried over verbatim.
 *   2. width/height changed from a fixed `24` to `1em`, so the icon scales
 *      with the surrounding text instead of pinning a pixel size.
 *   3. Added `fill="currentColor"` to the path, which upstream leaves unset
 *      (and which therefore defaults to black), so the icon inherits its
 *      colour from context instead of carrying its own.
 *   4. Dropped the transparent 24x24 bounding-box path upstream ships as
 *      its first element; the viewBox already establishes those bounds and
 *      the extra node is inert.
 *   5. Added the `bds-icon` base class and a `className` passthrough. The
 *      base class is the hook the icon-motion contract in `shared.scss` keys
 *      on; it changes nothing about the drawing.
 *   6. Added `aria-hidden="true"` and `focusable="false"` — decorative by
 *      default. A caller using this as the only content of a control must
 *      supply an accessible name on the control.
 *
 * The `d` attribute below is byte-for-byte the upstream path data. Nothing
 * about the drawing has been altered, optimised or re-exported.
 */
export const MaterialArrowDownwardIcon: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`bds-icon ${className}`.trim()}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
        fill="currentColor"
      />
    </svg>
  );
};
