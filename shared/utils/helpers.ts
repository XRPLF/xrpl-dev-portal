import React, {
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

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
