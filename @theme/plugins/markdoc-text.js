// @ts-check
// Text helpers over a parsed Markdoc AST (the shape `ctx.markdown.parseCached` returns).

import { join } from 'node:path';

/** Inner text of Markdoc nodes, the way classic Realm's `getInnerText` builds it. */
export function getInnerText(nodes) {
  const parts = [];
  for (const node of nodes) {
    if (node === null || node === undefined) continue;
    if (typeof node !== 'object') {
      parts.push(String(node));
      continue;
    }
    if (node.$$mdtype === 'Node') {
      if (node.type === 'tr') parts.push('\n');
      if (node.type === 'text' || node.type === 'code' || node.type === 'fence') {
        parts.push(getInnerText([node.attributes?.content]));
      } else {
        parts.push(getInnerText(node.children ?? []));
      }
    } else if (node.$$mdtype === 'Tag') {
      parts.push(getInnerText(node.children ?? []));
    } else if (node.$$mdtype === 'Function') {
      parts.push(getInnerText(Object.values(node.parameters ?? {})));
    }
  }
  return parts
    .map((part) => part.trim())
    .join(' ')
    .trim();
}

export const EXIT = Symbol('Exit visitor');

export function visit(node, visitor) {
  if (!node) return;
  const result = visitor(node);
  if (result === EXIT) return result;
  for (const child of node.children ?? []) {
    if (!child || typeof child === 'string') continue;
    if (visit(child, visitor) === EXIT) return EXIT;
  }
}

export function isNode(value) {
  return value?.$$mdtype === 'Node';
}

export function extractFirstHeading(ast) {
  let heading = null;
  visit(ast, (node) => {
    if (isNode(node) && node.type === 'heading') {
      heading = getInnerText([node]);
      return EXIT;
    }
  });
  return heading;
}

const WORDS_TO_CAPS = ['xrp'];

export function toTitleCase(value) {
  return value
    .split(/_|[^\w']/)
    .filter((word) => word)
    .map((word) =>
      WORDS_TO_CAPS.includes(word) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ')
    .replace("'S", "'s")
    .replace(' A ', ' a ');
}

export async function parseContentFile(ctx, path) {
  const source = await ctx.io.readFile(join(ctx.contentDir, path));
  return ctx.markdown.parseCached(source);
}
