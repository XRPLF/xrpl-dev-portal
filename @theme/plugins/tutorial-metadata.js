// @ts-check

import { getInnerText } from '@redocly/realm/dist/server/plugins/markdown/markdoc/helpers/get-inner-text.js';

/**
 * Plugin to extract tutorial metadata including last modified dates.
 * Uses Redocly's built-in git integration for dates (same as "Last updated" display).
 * This creates shared data for displaying "What's New" tutorials and
 * auto-generating tutorial sections on the landing page.
 */
export function tutorialMetadata() {
  /** @type {import("@redocly/realm/dist/server/plugins/types").PluginInstance } */
  const instance = {
    processContent: async (actions, { fs, cache }) => {
      try {
        /** @type {Array<{path: string, title: string, description: string, lastModified: string, category: string}>} */
        const tutorials = [];
        const allFiles = await fs.scan();

        // Find all markdown files in tutorials directory (excluding the main landing page)
        const tutorialFiles = allFiles.filter((file) =>
          file.relativePath.match(/^docs[\/\\]tutorials[\/\\].*\.md$/) &&
          file.relativePath !== 'docs/tutorials/index.md' &&
          file.relativePath !== 'docs\\tutorials\\index.md'
        );

        for (const { relativePath } of tutorialFiles) {
          try {
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

            // Extract category from path (e.g., "tokens", "payments", "defi")
            const pathParts = relativePath.split(/[\/\\]/);
            const category = pathParts.length > 2 ? pathParts[2] : 'general';

            // Convert file path to URL path
            // Handle index.md files - they should produce /path/to/folder/ not /path/to/folder/index/
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
        const sortedTutorials = tutorials.sort((a, b) =>
          new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        );

        // Create shared data
        actions.createSharedData('tutorial-metadata', { tutorials: sortedTutorials });
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
