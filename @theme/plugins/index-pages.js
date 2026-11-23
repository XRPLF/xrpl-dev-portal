// @ts-check
// For every page with `metadata: { indexPage: true }`, the frontmatter, slug and
// title of its children in the sidebar, read by the child-pages and tx-category
// components as `usePageSharedData('index-page-items')`.

import { dirname, posix } from 'node:path';
import yaml from 'js-yaml';
import { createEntityLoader } from '@redocly/framework/plugin';

import { extractFirstHeading, parseContentFile } from './markdoc-text.js';

const SHARED_DATA_KEY = 'index-page-items';
const L10N_PATH_RE = /^@l10n\/([^/]+)\/(.*)$/;

export const indexPageItemsLoader = createEntityLoader('xrpl:index-page-items', async (ctx) => {
  const items = [];
  for (const { slug, path, frontmatter, label } of ctx.args.children) {
    let title = frontmatter.seo?.title;
    if (!title && path.endsWith('.md')) {
      title = extractFirstHeading(await parseContentFile(ctx, path));
    }
    items.push({ ...frontmatter, slug, title: String(title || label || '') });
  }
  return { value: items };
});

export async function indexPages(ctx) {
  const childrenByPage = await readSidebarChildren(ctx);
  const manifests = new Map(ctx.files.map((file) => [file.path, file.manifest]));
  const entities = [];
  const attach = [];

  for (const file of ctx.files) {
    if (file.manifest.metadata?.indexPage !== true) continue;
    const route = ctx.routes.byFilePath(file.path);
    if (!route) continue;

    const [, locale, defaultPath] = L10N_PATH_RE.exec(file.path) ?? [null, null, file.path];
    const children = childrenByPage.get(defaultPath);
    if (!children) {
      ctx.logger.warn(`Index page is not in a sidebar: ${file.path}`);
      continue;
    }

    const add = (slug, locale) => {
      const ref = indexPageItemsLoader.withArgs(
        { children: localizedChildren(ctx, manifests, children, locale) },
        { stableKey: `xrpl:index-page-items:${slug}` },
      );
      entities.push(ref);
      attach.push({ slug, deps: { [SHARED_DATA_KEY]: ref } });
    };

    add(route.slug, locale);
    if (locale) continue;
    // A locale serves an untranslated index page at its own URL; it lists that locale's children.
    for (const other of ctx.localeContext.locales) {
      if (ctx.routes.byFilePath(`@l10n/${other}/${file.path}`)) continue;
      add(ctx.localeContext.toL10nSlug(route.slug, other), other);
    }
  }

  return { entities, attach };
}

/** Each child's translation in `locale`, else the default page at its URL in that locale. */
function localizedChildren(ctx, manifests, children, locale) {
  return children.flatMap((child) => {
    const localized = locale ? `@l10n/${locale}/${child.page}` : null;
    const translation = localized && ctx.routes.byFilePath(localized);
    const route = translation || ctx.routes.byFilePath(child.page);
    if (!route) return [];
    const path = translation ? localized : child.page;
    const slug = translation || !locale ? route.slug : ctx.localeContext.toL10nSlug(route.slug, locale);
    return [{ slug, path, frontmatter: manifests.get(path) ?? {}, label: child.label ?? null }];
  });
}

/** Direct `page:` children of every sidebar item that has a `page:`, keyed by content path. */
async function readSidebarChildren(ctx) {
  const childrenByPage = new Map();
  for (const sidebarPath of await ctx.io.glob('**/sidebars.yaml')) {
    if (sidebarPath.startsWith('@l10n/')) continue;
    const baseDir = dirname(sidebarPath);
    const items = yaml.load(await ctx.io.readFile(sidebarPath));
    const toContentPath = (page) =>
      page.startsWith('/') ? page.slice(1) : posix.normalize(posix.join(baseDir, page));

    const walk = (list) => {
      for (const item of Array.isArray(list) ? list : []) {
        if (typeof item?.page === 'string') {
          childrenByPage.set(
            toContentPath(item.page),
            (item.items ?? [])
              .filter((child) => typeof child?.page === 'string')
              .map((child) => ({ page: toContentPath(child.page), label: child.label })),
          );
        }
        walk(item?.items);
      }
    };
    walk(items);
  }
  return childrenByPage;
}
