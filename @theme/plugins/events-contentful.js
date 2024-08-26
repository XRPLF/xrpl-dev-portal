// @ts-check
import path from 'node:path';
const EVENTS_SERVER_PROPS_ID = 'contentful-events';

export function eventsContentful() {
  /** @type {import("@redocly/realm/dist/server/plugins/types").LifecyclePluginInstance } */
  const instance = {
    id: 'events-contentful',
    processContent: async (actions, { fs }) => {
      actions.registerServerPropsGetter(EVENTS_SERVER_PROPS_ID, path.join(fs.cwd, 'community/events.server.ts'));
    },
    afterRoutesCreated: async (actions, context) => {
      const routes = [
        actions.getRouteByFsPath('community/events.page.tsx'),
        actions.getRouteByFsPath('community/index.page.tsx')
      ];
      routes.forEach(route => {
        if (route) {
          route.serverPropsGetterIds = [...(route.serverPropsGetterIds || []), EVENTS_SERVER_PROPS_ID];
          console.log('worked for route:', route.fsPath);
        }
      });
    },
  };
  return instance;
}
