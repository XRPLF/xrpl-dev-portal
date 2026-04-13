// @ts-check

import { getInnerText } from '@redocly/realm/dist/markdoc/helpers/get-inner-text.js';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '../..');

/**
 * Plugin to extract tutorial metadata including last modified dates.
 * Uses Redocly's built-in git integration for dates (same as "Last updated" display).
 * Only includes tutorials that appear in the sidebar navigation (sidebars.yaml).
 * This creates shared data for displaying "What's New" tutorials and
 * auto-generating tutorial sections on the landing page.
 */
export function tutorialMetadata() {
  /** @type {import("@redocly/realm/dist/server/plugins/types").PluginInstance } */
  const instance = {
    processContent: async (actions, { fs, cache }) => {
      try {
        // Extract tutorial paths and categories from sidebars.yaml.
        // Only tutorials present in the sidebar are included.
        const { pageCategory, categories } = extractSidebarData();

        /** @type {Array<{path: string, title: string, description: string, lastModified: string, category: string}>} */
        const tutorials = [];
        const allFiles = await fs.scan();

        // Find all markdown files in tutorials directory
        const tutorialFiles = allFiles.filter((file) =>
          file.relativePath.match(/^docs[\/\\]tutorials[\/\\].*\.md$/)
        );

        for (const { relativePath } of tutorialFiles) {
          try {
            // Skip tutorials not present in sidebar navigation
            const category = pageCategory.get(relativePath);
            if (!category) continue;

            const { data: { ast } } = await cache.load(relativePath, 'markdown-ast');
            const { data: { frontmatter } } = await cache.load(relativePath, 'markdown-frontmatter');

            // Get last modified date using Redocly's built-in git integration
            const lastModified = await fs.getLastModified(relativePath);
            if (!lastModified) continue; // Skip files without dates

            // Extract title from first heading
            const title = extractFirstHeading(ast) || '';
            if (!title) continue;

            // Get description from frontmatter or first paragraph
            const description = frontmatter?.seo?.description || '';

            // Convert file path to URL path
            const urlPath = '/' + relativePath
              .replace(/[\/\\]index\.md$/, '/')
              .replace(/\.md$/, '/')
              .replace(/\\/g, '/');

            tutorials.push({
              path: urlPath,
              title,
              description,
              lastModified,
              category,
            });
          } catch (err) {
            continue; // Skip files that can't be parsed
          }
        }

        // Sort by last modified date (newest first) for "What's New"
        tutorials.sort((a, b) =>
          new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        );

        // Create shared data including sidebar-derived categories
        actions.createSharedData('tutorial-metadata', { tutorials, categories });
        actions.addRouteSharedData('/docs/tutorials/', 'tutorial-metadata', 'tutorial-metadata');
        actions.addRouteSharedData('/ja/docs/tutorials/', 'tutorial-metadata', 'tutorial-metadata');
        actions.addRouteSharedData('/es-es/docs/tutorials/', 'tutorial-metadata', 'tutorial-metadata');
      } catch (e) {
        console.log('[tutorial-metadata] Error:', e);
      }
    },
  };
  return instance;
}

/**
 * Extract the first heading from the markdown AST
 */
function extractFirstHeading(ast) {
  let heading = null;

  visit(ast, (node) => {
    if (!isNode(node)) return;
    if (node.type === 'heading') {
      heading = getInnerText([node]);
      return EXIT;
    }
  });

  return heading;
}

function isNode(value) {
  return !!(value?.$$mdtype === 'Node');
}

const EXIT = Symbol('Exit visitor');

function visit(node, visitor) {
  if (!node) return;

  const res = visitor(node);
  if (res === EXIT) return res;

  if (node.children) {
    for (const child of node.children) {
      if (!child || typeof child === 'string') continue;
      const res = visit(child, visitor);
      if (res === EXIT) return res;
    }
  }
}

/**
 * Extract tutorial page paths and categories from sidebars.yaml.
 *
 * Returns:
 * - pageCategory: Map of relativePath to category id (slug)
 * - categories: Array of { id, title } in sidebar display order
 *
 * Top-level groups under the tutorials section become categories.
 * Pages not inside a group (e.g. public-servers.md) are skipped.
 */
function extractSidebarData() {
  /** @type {Map<string, string>} */
  const pageCategory = new Map();
  /** @type {Array<{id: string, title: string}>} */
  const categories = [];

  try {
    const content = readFileSync(resolve(PROJECT_ROOT, 'sidebars.yaml'), 'utf-8');
    const lines = content.split('\n');

    let inTutorials = false;
    let entryIndent = -1;       // indent of the tutorials entry itself
    let topItemIndent = -1;     // indent of direct children (groups/pages)
    let currentCategory = null; // current top-level group { id, title }

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const indent = line.search(/\S/);

      // Detect the tutorials section
      if (trimmed.includes('page: docs/tutorials/index.page.tsx')) {
        inTutorials = true;
        entryIndent = indent;
        continue;
      }

      if (!inTutorials) continue;

      // Exit tutorials when we reach a sibling entry at the same indent
      if (indent <= entryIndent && trimmed.startsWith('- ')) {
        break;
      }

      // Detect the indent of top-level items (first `- ` under tutorials items)
      if (topItemIndent === -1 && trimmed.startsWith('- ')) {
        topItemIndent = indent;
      }

      // Top-level group - start a new category
      if (indent === topItemIndent && trimmed.startsWith('- group:')) {
        const title = trimmed.replace('- group:', '').trim();
        const id = title.toLowerCase().replace(/\s+/g, '-');
        currentCategory = { id, title };
        categories.push(currentCategory);
        continue;
      }

      // Top-level page (no group, e.g. public-servers.md) - reset current category
      if (indent === topItemIndent && trimmed.startsWith('- page:')) {
        currentCategory = null;
        continue;
      }

      // Nested page under a group - assign to current category
      if (currentCategory) {
        const pageMatch = trimmed.match(/^- page:\s+(docs\/tutorials\/\S+\.md)/);
        if (pageMatch) {
          pageCategory.set(pageMatch[1], currentCategory.id);
        }
      }
    }
  } catch (err) {
    console.log('[tutorial-metadata] Warning: Could not read sidebars.yaml:', String(err));
  }

  return { pageCategory, categories };
}
