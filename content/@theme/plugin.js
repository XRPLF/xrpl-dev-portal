import { indexPages } from './plugins/index-pages.js';
import { codeSamples } from './plugins/code-samples.js';

export default function customPlugin() {
  const indexPagesInst = indexPages();
  const codeSamplesInst = codeSamples();



  /** @type {import("@redocly/portal/dist/server/plugins/types").PluginInstance } */
  const pluginInstance = {
    processContent: async (content, actions) => {
      await indexPagesInst.processContent?.(content, actions);
      await codeSamplesInst.processContent?.(content, actions);
    },
    afterRoutesCreated: async (content, actions) => {
      await indexPagesInst.afterRoutesCreated?.(content, actions);
      await codeSamplesInst.afterRoutesCreated?.(content, actions);
    },
  };

  return pluginInstance;
}
