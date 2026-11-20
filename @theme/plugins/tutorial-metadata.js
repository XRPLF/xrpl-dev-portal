// @ts-check
// Tutorial metadata with last-modified dates (git, the same as "Last updated"), read on
// the tutorials landing page as `usePageSharedData('tutorial-metadata')`.
// Only tutorials that appear in the sidebar navigation (sidebars.yaml) are included.

import { createEntityLoader } from '@redocly/framework/plugin';

import { attachTo } from './blog-posts.js';

const SHARED_DATA_KEY = 'tutorial-metadata';
const ROUTES = ['/docs/tutorials', '/ja/docs/tutorials', '/es-es/docs/tutorials'];

export const tutorialMetadataLoader = createEntityLoader('xrpl:tutorial-metadata', async (ctx) => {
  const { tutorials: files, categories } = ctx.args;
  /** @type {Array<{path: string, title: string, description: string, lastModified: string, category: string}>} */
  const tutorials = [];

  for (const { path, key, category, description } of files) {
    const { title, lastModified } = await ctx.entities.load(key);
    if (!lastModified || !title) continue;
    tutorials.push({
      path: '/' + path.replace(/\/index\.md$/, '/').replace(/\.md$/, '/'),
      title,
      description,
      lastModified,
      category,
    });
  }

  tutorials.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
  return { value: { tutorials, categories } };
});

/** `tutorials`: the tutorial files and the keys of their per-file entities. */
export async function tutorialMetadata(ctx, tutorials) {
  const { pageCategory, categories } = extractSidebarData(await ctx.io.readFile('sidebars.yaml'));
  const listed = tutorials
    .filter(({ path }) => pageCategory.has(path))
    .map(({ path, key, frontmatter }) => ({
      path,
      key,
      category: pageCategory.get(path),
      description: frontmatter?.seo?.description || '',
    }));
  const ref = tutorialMetadataLoader.withArgs(
    { tutorials: listed, categories },
    { stableKey: 'xrpl:tutorial-metadata' },
  );
  return { entities: [ref], attach: attachTo(ctx, ROUTES, SHARED_DATA_KEY, ref) };
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
export function extractSidebarData(content) {
  /** @type {Map<string, string>} */
  const pageCategory = new Map();
  /** @type {Array<{id: string, title: string}>} */
  const categories = [];

  try {
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
