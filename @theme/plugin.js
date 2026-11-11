// @ts-check
// XRPL content plugin: page data the custom pages and Markdoc components read
// through `usePageSharedData`.

import { createEntityLoader, defineContentPlugin } from '@redocly/framework/plugin';

import { blogPosts, blogPostsLoader } from './plugins/blog-posts.js';
import { codeSamples, codeSamplesLoader } from './plugins/code-samples.js';
import { indexPageItemsLoader, indexPages } from './plugins/index-pages.js';
import { extractFirstHeading } from './plugins/markdoc-text.js';
import {
  detectLanguageFromPathAndTitle,
  extractLanguagesFromAst,
  tutorialLanguages,
  tutorialLanguagesLoader,
} from './plugins/tutorial-languages.js';
import { tutorialMetadata, tutorialMetadataLoader } from './plugins/tutorial-metadata.js';

const TUTORIAL_RE = /^docs\/tutorials\/.*\.md$/;

/** Per tutorial file: its title, languages and git last-modified date. */
const tutorialLoader = createEntityLoader('xrpl:tutorial', async (ctx) => {
  const ast = ctx.markdown.parseCached(await ctx.io.readFile(ctx.file.absolutePath));
  const title = extractFirstHeading(ast) || '';
  let languages = extractLanguagesFromAst(ast);
  if (languages.length === 0) {
    const fallback = detectLanguageFromPathAndTitle(ctx.file.path, title);
    languages = fallback ? [fallback] : [];
  }
  return { value: { title, languages, lastModified: ctx.file.lastModifiedAt } };
});

const tutorialKey = (path) => `xrpl:tutorial:${path}`;

export default defineContentPlugin({
  id: 'xrpl',
  version: '1.1.0',
  loaders: [
    tutorialLoader,
    blogPostsLoader,
    codeSamplesLoader,
    indexPageItemsLoader,
    tutorialLanguagesLoader,
    tutorialMetadataLoader,
  ],
  content: {
    filter: { extensions: ['.md'] },
    extractFile(file) {
      if (!TUTORIAL_RE.test(file.path)) return null;
      return {
        routes: [],
        entities: [tutorialLoader.withArgs(undefined, { stableKey: tutorialKey(file.path) })],
      };
    },
  },
  async finalize(ctx) {
    const tutorials = ctx.files
      .filter((file) => TUTORIAL_RE.test(file.path))
      .map((file) => ({ path: file.path, key: tutorialKey(file.path), frontmatter: file.manifest }));

    const parts = [
      blogPosts(ctx),
      await codeSamples(ctx),
      await indexPages(ctx),
      tutorialLanguages(ctx, tutorials),
      await tutorialMetadata(ctx, tutorials),
    ];
    return {
      entities: parts.flatMap((part) => part.entities),
      attach: parts.flatMap((part) => part.attach),
    };
  },
});
