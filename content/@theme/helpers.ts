/**
 * Slugify function, has to match the formula used in interactive-tutorial.js
 */
export function slugify(s) {
  const unacceptable_chars = /[^A-Za-z0-9._ ]+/g;
  const whitespace_regex = /\s+/g;
  s = s.replace(unacceptable_chars, '');
  s = s.replace(whitespace_regex, '_');
  s = s.toLowerCase();
  if (!s) {
    s = '_';
  }
  return s;
}
