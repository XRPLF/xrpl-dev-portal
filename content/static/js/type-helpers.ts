type TypeofType =
  | 'bigint'
  | 'boolean'
  | 'function'
  | 'number'
  | 'object'
  | 'string'
  | 'undefined'

type TypeCheckFn = (thing: unknown) => boolean


/**
 * Curried function for creating typeof checker functions.
 * @param {string} type The type to check against (eg 'string', 'number')
 * @param {function} [secondaryTest] Optional additional test function to run in cases where a type match isn't always a sure indicator.
 * @returns {boolean} Whether the value matches the type
 */
const isTypeof =
  <T>(type: TypeofType, secondaryTest?: TypeCheckFn) =>
  (thing: unknown): thing is T => {
    const matches = typeof thing === type
    if (matches && secondaryTest) return secondaryTest(thing)
    return matches
  }

export const isFunction = isTypeof<(...args: unknown[]) => unknown>('function')
