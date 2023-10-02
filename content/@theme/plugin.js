// TODO: export function from root package
import { readSharedData } from '@redocly/portal/dist/server/utils/shared-data.js';

const INDEX_PAGE_INFO_DATA_KEY = 'index-page-items';

export default function indexPagesPlugin() {
  /** @type {import("@redocly/portal/dist/server/plugins/types").PluginInstance } */
  const pluginInstance = {
    // hook that gets executed after all routes were created
    async afterRoutesCreated(contentProvider, actions) {
      // get all the routes that are ind pages
      const indexRoutes = actions.getAllRoutes().filter(route => route.metadata?.indexPage);

      for (const route of indexRoutes) {
        // this uses some internals, we will expose them in nicer way in the future releases
        const sidebarId = actions.routesSharedData.get(route.slug)?.['sidebar']; // TODO: implement a helper function for this
        const sidebar = await readSharedData(sidebarId, actions.outdir);
        const item = findItemDeep(sidebar.items, route.fsPath);
        const childrenPaths =(item.items || []).map(item => item.fsPath).filter(Boolean);

        const childRoutes = childrenPaths.map(fsPath => actions.getRouteByFsPath(fsPath));
        const childRoutesData = await Promise.all(
          childRoutes.map(async route => {
            const {
              parsed: { data },
            } = contentProvider.loadContent(route.fsPath, 'frontmatter');
            return {
              ...data,
              slug: route.slug,
              title: await route.getNavText(),
            };
          })
        );

        const sharedDataId = await actions.createSharedData(route.slug + '_' + INDEX_PAGE_INFO_DATA_KEY, childRoutesData);
        actions.addRouteSharedData(route.slug, INDEX_PAGE_INFO_DATA_KEY, sharedDataId)
      }
    },
  };

  return pluginInstance;
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
