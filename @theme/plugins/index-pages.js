// @ts-check
import { readSharedData } from '@redocly/realm/dist/server/utils/shared-data.js'; // TODO: export function from root package
const INDEX_PAGE_INFO_DATA_KEY = 'index-page-items';

export function indexPages() {
  /** @type {import("@redocly/realm/dist/server/plugins/types").PluginInstance } */
  const instance = {
    // hook that gets executed after all routes were created
    async afterRoutesCreated(contentProvider, actions) {
      // get all the routes that are ind pages
      const indexRoutes = actions.getAllRoutes().filter(route => route.metadata?.indexPage);

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
        const childrenPaths = (item.items || []).map(item => item.fsPath).filter(Boolean);

        const childRoutes = childrenPaths.map(fsPath => actions.getRouteByFsPath(fsPath));
        const childRoutesData = await Promise.all(
          childRoutes.map(async route => {
            const { parsed } = contentProvider.loadContent(route.fsPath, 'frontmatter');
            const slug = route.slug;
            const title = await route.getNavText();
            return {
              ...parsed?.data,
              slug,
              title,
            };
          })
        );

        const sharedDataId = await actions.createSharedData(
          route.slug + '_' + INDEX_PAGE_INFO_DATA_KEY,
          childRoutesData
        );
        actions.addRouteSharedData(route.slug, INDEX_PAGE_INFO_DATA_KEY, sharedDataId);
      }
    },
  };
  return instance;
}

function findItemDeep(items, fsPath) {
  for (const item of items) {
    if (item.fsPath === fsPath) {
      return item;
    }

    if (item.items) {
      const found = findItemDeep(item.items, fsPath);
      if (found) {
        return found;
      }
    }
  }
}
