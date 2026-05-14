// The purpose of this plugin is to get a list of pages that are "children" of
// the current page and pass along their frontmatter as well as the path that
// can be used to link to those pages from other components.
// It uses experimental Redocly plugin interface stuff that is expected
// to be exposed in a "nicer" way in some theoretical future release.
// The ts-ignore and TODOs are more for Redocly's notes than for XRPLF.

// @ts-check
import { readSharedData } from '@redocly/realm/dist/server/utils/shared-data.js'; // TODO: export function from root package
const INDEX_PAGE_INFO_DATA_KEY = 'index-page-items';

export function indexPages() {
  /** @type {import("@redocly/realm/dist/server/types").ExternalPlugin } */
  const instance = {
    id: 'index-pages',
    // hook that gets executed after all routes were created
    async afterRoutesCreated(actions, { cache }) {
      // get all the routes that are ind pages
      const indexRoutes = actions
        .getAllRoutes()
        .filter((route) => route.metadata?.indexPage);

      for (const route of indexRoutes) {
        // @ts-ignore this uses some internals, we will expose them in nicer way in the future releases
        const sidebarId = actions.routesSharedData.get(route.slug)?.['sidebar']; // TODO: implement a helper function for this
        /** @type {any} */
        const sidebar = await readSharedData(sidebarId, actions.outdir);

        if (!sidebar) {
          console.log('[warn] Index route used with no sidebar', route.fsPath);
          continue;
        }

        const item = findItemDeep(sidebar.items, route.fsPath);
        const childrenPaths = (item.items || [])
          .map(
            // @ts-ignore
            (item) => item.fsPath
          )
          .filter(Boolean);

        const childRoutes = childrenPaths.map(
          // @ts-ignore
          (fsPath) =>
          actions.getRouteByFsPath(fsPath),
        );
        const childRoutesData = await Promise.all(
          childRoutes.map(
            // @ts-ignore
            async (route) => {
            const { data } = await cache.load(
              route.fsPath,
              'markdown-frontmatter',
            );
            const slug = route.slug;
            const title = await route.getNavText();
            return {
              ...data?.frontmatter,
              slug,
              title,
            };
          }),
        );

        const sharedDataId = await actions.createSharedData(
          route.slug + '_' + INDEX_PAGE_INFO_DATA_KEY,
          childRoutesData,
        );
        actions.addRouteSharedData(
          route.slug,
          INDEX_PAGE_INFO_DATA_KEY,
          sharedDataId,
        );
      }
    },
  };
  return instance;
}

// @ts-ignore
function findItemDeep(items, fsPath) {
  for (const item of items) {
    if (item.fsPath === fsPath) {
      return item;
    }

    if (item.items) {
      // @ts-ignore
      const found = findItemDeep(item.items, fsPath);
      if (found) {
        return found;
      }
    }
  }
}
