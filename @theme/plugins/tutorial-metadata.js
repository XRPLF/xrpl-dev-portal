// @ts-check

// Realm has no public API for reading another plugin's shared data; this is
// the same internal helper index-pages.js uses to read the resolved sidebar.
import { readSharedData } from '@redocly/realm/dist/server/utils/shared-data.js';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { detectTutorialLanguages } from './tutorial-languages.js';

const LANDING_PAGE = 'docs/tutorials/index.md';
const SHARED_DATA_KEY = 'tutorial-metadata';
const SNAPSHOT_PATH = '@theme/data/tutorials-metadata.json';

/**
 * @typedef {object} Tutorial
 * @property {string} path URL path, such as /docs/tutorials/payments/send-xrp/
 * @property {string} title
 * @property {string} description From the page's seo.description frontmatter
 * @property {string} lastModified ISO date of the last git commit to the page
 * @property {string} category Id of the sidebar group the page sits in
 * @property {string[]} labels Topic labels from the page's frontmatter, matched by the landing page's search
 * @property {string[]} languages Language keys the page has code for, see tutorial-languages.js
 */

/**
 * @typedef {object} NavItem Resolved sidebar entry, see ResolvedNavItem in @redocly/config
 * @property {string} [type] "link" or "group"
 * @property {string} [label]
 * @property {string} [fsPath] Content-relative path of the page
 * @property {NavItem[]} [items]
 */

/**
 * @typedef {object} TutorialSidebar
 * @property {Array<{id: string, title: string}>} categories Topics in sidebar order
 * @property {Map<string, string>} pageCategory Content-relative page path to its category id
 */

/**
 * Plugin that collects the data behind the tutorials landing page: every
 * tutorial in the sidebar with its title, description, last change, topic,
 * labels and languages, plus translated titles for each locale.
 *
 * Runs after routes are created so it can read Realm's resolved sidebar,
 * route slugs, nav titles and git dates instead of parsing files itself.
 * The result is shared data on the landing page in every locale, and a JSON
 * snapshot for the page's LLM Markdown rendering.
 */
export function tutorialMetadata() {
  // Result of the last full run. The dev server re-runs this hook on every
  // change, and on some of those runs the sidebar shared data is not available
  // yet; the previous result is kept rather than publishing an empty page.
  let lastData = null;

  /** @type {import('@redocly/realm/dist/server/types').ExternalPlugin} */
  const instance = {
    id: 'tutorial-metadata',
    afterRoutesCreated: async (actions, { fs, cache, logger }) => {
      try {
        const sidebar = await readTutorialSidebar(actions);
        const locales = getLocales(actions, fs);
        const data = sidebar ? await collectTutorials(sidebar, locales, actions, fs, cache) : lastData;
        if (!data) {
          logger.warn('[tutorial-metadata] Tutorials section not found in sidebar');
          return;
        }
        lastData = data;

        const dataId = await actions.createSharedData(SHARED_DATA_KEY, data);
        for (const locale of [locales.defaultLocale, ...locales.translated]) {
          const route = actions.getRouteByFsPath(locales.pathFor(locale, LANDING_PAGE));
          if (route) actions.addRouteSharedData(route.slug, SHARED_DATA_KEY, dataId);
        }

        await writeSnapshot(resolve(actions.contentDir, SNAPSHOT_PATH), data);
      } catch (e) {
        logger.error('[tutorial-metadata] Failed to collect tutorials: %s', e instanceof Error ? e.stack ?? e.message : String(e));
      }
    },
  };
  return instance;
}

/**
 * Every tutorial in the sidebar with its metadata, newest first, plus the
 * categories and translations the landing page needs.
 *
 * @param {TutorialSidebar} sidebar
 * @param {ReturnType<typeof getLocales>} locales
 * @param {import('@redocly/realm/dist/server/types').AfterRoutesCreatedActions} actions
 * @param {import('@redocly/realm/dist/server/fs/content-fs').ContentFs} fs
 * @param {import('@redocly/realm/dist/server/fs/cache').Cache} cache
 */
async function collectTutorials({ categories, pageCategory }, locales, actions, fs, cache) {
  /** @type {Array<{fsPath: string, tutorial: Tutorial}>} */
  const pages = [];
  for (const [fsPath, category] of pageCategory) {
    const route = actions.getRouteByFsPath(fsPath);
    const title = await route?.getNavText?.();
    const lastModified = await fs.getLastModified(fsPath);
    if (!route || !title || !lastModified) continue;

    const { data: { frontmatter } } = await cache.load(fsPath, 'markdown-frontmatter');
    const { data: { ast } } = await cache.load(fsPath, 'markdown-ast');

    pages.push({
      fsPath,
      tutorial: {
        path: toUrlPath(route.slug),
        title,
        description: frontmatter?.seo?.description || '',
        lastModified,
        category,
        labels: Array.isArray(frontmatter?.labels) ? frontmatter.labels.map(String) : [],
        languages: detectTutorialLanguages(ast, fsPath, title),
      },
    });
  }

  // Newest first, for the landing page's What's New row
  pages.sort((a, b) => Date.parse(b.tutorial.lastModified) - Date.parse(a.tutorial.lastModified));

  return {
    tutorials: pages.map((page) => page.tutorial),
    categories,
    translations: await readTranslations(pages, locales, actions, fs, cache),
  };
}

/**
 * Topics and page membership from the tutorials section of the resolved
 * sidebar. Each top-level group under Tutorials is a category; pages under it
 * (at any depth) belong to it. Pages directly under Tutorials, such as
 * public-servers.md, are not tutorials and are skipped.
 *
 * @param {import('@redocly/realm/dist/server/types').AfterRoutesCreatedActions} actions
 * @returns {Promise<TutorialSidebar | null>} Null when the sidebar is not available on this run
 */
async function readTutorialSidebar(actions) {
  const sidebarId = actions.getRouteSharedDataByFsPath(LANDING_PAGE)?.sidebar;
  const sidebar = /** @type {{ items?: NavItem[] } | undefined} */ (
    sidebarId ? await readSharedData(sidebarId, actions.outdir) : undefined
  );
  const landing = findNavItem(sidebar?.items ?? [], (item) => item.fsPath === LANDING_PAGE);
  if (!landing) return null;

  /** @type {Array<{id: string, title: string}>} */
  const categories = [];
  /** @type {Map<string, string>} */
  const pageCategory = new Map();
  for (const group of landing.items ?? []) {
    if (group.type !== 'group' || !group.label) continue;
    const id = group.label.toLowerCase().replace(/\s+/g, '-');
    categories.push({ id, title: group.label });
    for (const fsPath of collectPagePaths(group)) pageCategory.set(fsPath, id);
  }
  return { categories, pageCategory };
}

/** Route slug to the URL path used in links and sections.config.ts: always with a trailing slash */
function toUrlPath(slug) {
  return slug.endsWith('/') ? slug : `${slug}/`;
}

/**
 * Depth-first search of a nav tree
 * @param {NavItem[]} items
 * @param {(item: NavItem) => boolean} predicate
 * @returns {NavItem | undefined}
 */
function findNavItem(items, predicate) {
  for (const item of items) {
    if (predicate(item)) return item;
    const found = findNavItem(item.items ?? [], predicate);
    if (found) return found;
  }
  return undefined;
}

/**
 * Content-relative paths of every page inside a nav group, including nested groups
 * @param {NavItem} group
 */
function collectPagePaths(group) {
  /** @type {string[]} */
  const paths = [];
  for (const item of group.items ?? []) {
    if (item.type === 'group') paths.push(...collectPagePaths(item));
    else if (item.fsPath) paths.push(item.fsPath);
  }
  return paths;
}

/**
 * Locales from the site config, with a helper that turns a content-relative
 * path into the path of its copy in a locale (unchanged for the default locale).
 *
 * @param {import('@redocly/realm/dist/server/types').AfterRoutesCreatedActions} actions
 * @param {import('@redocly/realm/dist/server/fs/content-fs').ContentFs} fs
 */
function getLocales(actions, fs) {
  const l10n = actions.getConfig().l10n;
  const defaultLocale = l10n?.defaultLocale ?? '';
  const translated = (l10n?.locales ?? [])
    .map((locale) => locale.code)
    .filter((code) => code !== defaultLocale);
  const pathFor = (locale, relativePath) =>
    locale === defaultLocale ? relativePath : `${fs.localizationFolder}/${locale}/${relativePath}`;
  return { defaultLocale, translated, pathFor };
}

/**
 * Translated title and description per locale, keyed by the English URL path.
 * Realm gives every page a route in every locale. When a locale has no
 * translated file, that route just serves the English page, so only a locale
 * with its own file counts as translated.
 *
 * @param {Array<{fsPath: string, tutorial: Tutorial}>} pages
 * @param {ReturnType<typeof getLocales>} locales
 * @param {import('@redocly/realm/dist/server/types').AfterRoutesCreatedActions} actions
 * @param {import('@redocly/realm/dist/server/fs/content-fs').ContentFs} fs
 * @param {import('@redocly/realm/dist/server/fs/cache').Cache} cache
 * @returns {Promise<Record<string, Record<string, {title: string, description: string}>>>}
 */
async function readTranslations(pages, locales, actions, fs, cache) {
  /** @type {Record<string, Record<string, {title: string, description: string}>>} */
  const translations = {};
  for (const locale of locales.translated) {
    translations[locale] = {};
    for (const { fsPath, tutorial } of pages) {
      const localizedPath = locales.pathFor(locale, fsPath);
      const file = fs.getFileInfo(localizedPath);
      if (!file || file.isVirtual) continue; // no translated file; Realm points the route at the English page
      const route = actions.getRouteByFsPath(localizedPath);
      if (!route) continue;

      const title = await route.getNavText?.();
      if (!title) continue;
      const { data: { frontmatter } } = await cache.load(localizedPath, 'markdown-frontmatter');
      translations[locale][tutorial.path] = { title, description: frontmatter?.seo?.description || '' };
    }
  }
  return translations;
}

/**
 * Write plugin data to a JSON file for the tutorials landing tag's renderForLlms,
 * which runs at build time without access to shared data. Skips the write when
 * nothing changed so the dev server's file watcher is not retriggered.
 * @param {string} filePath
 * @param {unknown} data
 */
async function writeSnapshot(filePath, data) {
  const next = JSON.stringify(data, null, 2) + '\n';
  const current = await readFile(filePath, 'utf8').catch(() => null);
  if (current !== next) {
    await writeFile(filePath, next, 'utf8');
  }
}
