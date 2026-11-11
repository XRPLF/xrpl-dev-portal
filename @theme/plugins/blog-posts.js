// @ts-check
// The post list the blog index page reads as `usePageSharedData('blog-posts')`.

import { dirname } from 'node:path';
import moment from 'moment';
import { createEntityLoader } from '@redocly/framework/plugin';

import { extractFirstHeading, getInnerText, parseContentFile, toTitleCase } from './markdoc-text.js';

const BLOG_POST_RE = /^blog\/([^/]*)\/.*\.md$/;
const SHARED_DATA_KEY = 'blog-posts';
const ROUTES = ['/blog', '/ja/blog', '/es-es/blog'];

export const blogPostsLoader = createEntityLoader('xrpl:blog-posts', async (ctx) => {
  const posts = [];
  for (const { path, frontmatter } of ctx.args.files) {
    const ast = await parseContentFile(ctx, path);
    const title = extractFirstHeading(ast) || '';
    const category = extractCategory(frontmatter.labels);
    const year = path.split('/')[1];

    posts.push({
      path: dirname(path),
      author: frontmatter.author || '',
      title: title || toTitleCase(dirname(dirname(path))),
      description: getInnerText([ast.children[1]]).replace(title, '').trim(),
      year,
      date: frontmatter.date
        ? moment(frontmatter.date).format('YYYY-MM-DD')
        : moment(year).format('YYYY-MM-DD'),
      category: category || 'General',
      category_id: category ? category.toLowerCase().replace(/ /g, '_') : 'general',
      link: path.replace('blog/', '').replace('.md', ''),
    });
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return { value: { blogPosts: posts } };
});

export function blogPosts(ctx) {
  const files = ctx.files
    .filter((file) => BLOG_POST_RE.test(file.path))
    .map((file) => ({ path: file.path, frontmatter: file.manifest }));
  const ref = blogPostsLoader.withArgs({ files }, { stableKey: 'xrpl:blog-posts' });
  return { entities: [ref], attach: attachTo(ctx, ROUTES, SHARED_DATA_KEY, ref) };
}

/** Classic labels: the first one is the category, any "Release" label reads "Release Notes". */
function extractCategory(labels) {
  const first = Array.isArray(labels) ? labels[0] : undefined;
  if (typeof first !== 'string') return undefined;
  return first.includes('Release') ? 'Release Notes' : first;
}

/** One `attach` entry per slug that exists. */
export function attachTo(ctx, slugs, key, ref) {
  return slugs.filter((slug) => ctx.routes.bySlug(slug)).map((slug) => ({ slug, deps: { [key]: ref } }));
}
