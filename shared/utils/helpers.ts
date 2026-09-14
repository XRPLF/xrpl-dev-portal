import React from "react";

/**
 * Valid Node.js environment values
 */
export type Environment = "development" | "production" | "test";

/**
 * Checks if a value is empty.
 *
 * @param val - The value to check
 * @returns true if the value is empty, false otherwise
 *
 * @example
 * isEmpty(null) // true
 * isEmpty(undefined) // true
 * isEmpty('') // true
 * isEmpty('   ') // true
 * isEmpty([]) // true
 * isEmpty({}) // true
 * isEmpty(0) // true
 * isEmpty(false) // true
 * isEmpty('text') // false
 * isEmpty([1, 2]) // false
 */
export const isEmpty = (val: unknown): boolean => {
  if (val === null || val === undefined) return true;
  if (typeof val === "string") return val.trim().length === 0;
  if (Array.isArray(val)) return val.length === 0;
  return !Boolean(val);
};

/**
 * Extracts text content from a ReactNode recursively.
 * Useful for extracting accessible text from complex React children.
 *
 * @param children - The ReactNode to extract text from
 * @returns The extracted text content as a string
 *
 * @example
 * getTextFromChildren('Hello') // 'Hello'
 * getTextFromChildren(123) // '123'
 * getTextFromChildren(<span>World</span>) // 'World'
 * getTextFromChildren([<span>Hello</span>, ' ', <span>World</span>]) // 'Hello World'
 */
export const getTextFromChildren = (children: React.ReactNode): string => {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join("");
  }
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    if (props.children) {
      return getTextFromChildren(props.children);
    }
  }
  return "";
};

/**
 * Generates a stable key for a card or list item.
 *
 * @param identifier - Optional string identifier (e.g., href, title, label). If provided, combined with prefix and index.
 * @param index - The index of the item in the array (used as fallback if identifier is not provided)
 * @param prefix - Optional prefix to prepend to the key (defaults to 'card'). Useful for namespacing when used in different map functions.
 * @returns A stable key (string or number) for React key prop
 *
 * @example
 * getCardKey('/docs', 0) // 'card-/docs-0'
 * getCardKey('Feature 1', 0) // 'card-Feature 1-0'
 * getCardKey('Card Title', 1, 'custom') // 'custom-Card Title-1'
 * getCardKey(undefined, 2) // 'card-2'
 * getCardKey(undefined, 3, 'item') // 'item-3'
 */
export const getCardKey = (
  identifier: string | undefined,
  index: number,
  prefix: string = "card",
): string | number => {
  // If identifier is provided, combine it with prefix and index
  if (identifier) {
    return `${prefix}-${identifier}-${index}`;
  }

  // Fallback to index with prefix
  return `${prefix}-${index}`;
};

/**
 * Checks if the current environment matches the provided environment(s).
 *
 * @param environments - A single environment string or an array of environment strings to check against
 * @returns true if the current environment matches any of the provided environments, false otherwise
 *
 * @example
 * isEnvironment('development') // true if NODE_ENV === 'development'
 * isEnvironment(['development', 'test']) // true if NODE_ENV is 'development' or 'test'
 * isEnvironment('production') // true if NODE_ENV === 'production'
 */
export const isEnvironment = (
  environments: Environment | Environment[],
): boolean => {
  const currentEnv = (process.env.NODE_ENV || "development") as Environment;
  const envsToCheck = Array.isArray(environments)
    ? environments
    : [environments];
  return envsToCheck.includes(currentEnv);
};

/**
 * Calculates grid offset for tile alignment in responsive grids.
 *
 * This function implements right-alignment logic for tile grids by calculating
 * the appropriate offset for the first tile in each row. The offset ensures that
 * tiles are right-aligned when there are fewer than 10 total tiles.
 *
 * Grid Layout Assumptions:
 * - lg (12 columns): Each tile spans 3 columns, 4 tiles per row
 * - md (8 columns): Each tile spans 2 columns, 4 tiles per row
 * - base (4 columns): Each tile spans full width or 2 columns
 *
 * Offset Logic (lg breakpoint, 12-column grid):
 * - 3 tiles in row: offset 3 (right-aligned)
 * - 2 tiles in row: offset 6 (right-aligned)
 * - 1 tile in row: offset 9 (right-aligned)
 *
 * Offset Logic (md breakpoint, 8-column grid):
 * - 3 tiles in row: offset 2 (right-aligned)
 * - 2 tiles in row: offset 4 (right-aligned)
 * - 1 tile in row: offset 6 (right-aligned)
 *
 * Only tiles 1-9 (positions 0-8) are right-aligned. 10+ tiles = no offset (left-aligned).
 *
 * @param index - The tile's position in the array (0-based)
 * @param total - Total number of tiles in the grid
 * @returns Object with md and lg offset values for this tile (both 0 if not first tile of row)
 *
 * @example
 * // First tile of 3 total tiles
 * calculateTileOffset(0, 3) // { md: 2, lg: 3 }
 *
 * @example
 * // Second tile (no offset)
 * calculateTileOffset(1, 3) // { md: 0, lg: 0 }
 *
 * @example
 * // First tile of second row with 5 total tiles
 * calculateTileOffset(3, 5) // { md: 4, lg: 6 }
 *
 * @example
 * // 10+ tiles (no offset)
 * calculateTileOffset(0, 12) // { md: 0, lg: 0 }
 */
export const calculateTileOffset = (
  index: number,
  total: number,
): { md: number; lg: number } => {
  // No offset if 10+ tiles total (left-aligned grid)
  if (total >= 10) return { md: 0, lg: 0 };

  // Only first tile of each row gets offset (every 3rd position starting at 0)
  if (index % 3 !== 0) return { md: 0, lg: 0 };

  // Calculate which row this tile is in
  const row = Math.floor(index / 3);

  // Calculate how many tiles are in this row
  const tilesInThisRow = Math.min(3, total - row * 3);

  // Calculate offset to right-align
  // lg: (4 - tilesInRow) * 3 → 3 tiles = 3, 2 tiles = 6, 1 tile = 9
  // md: (4 - tilesInRow) * 2 → 3 tiles = 2, 2 tiles = 4, 1 tile = 6
  const lgOffset = (4 - tilesInThisRow) * 3;
  const mdOffset = (4 - tilesInThisRow) * 2;

  return { md: mdOffset, lg: lgOffset };
};
