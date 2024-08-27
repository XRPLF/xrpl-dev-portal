import { indexPages } from './plugins/index-pages.js';
import { codeSamples } from './plugins/code-samples.js';
import { blogPosts } from './plugins/blog-posts.js';
import { eventsContentful } from './plugins/events-contentful.js';

export default function customPlugin() {
  const indexPagesInst = indexPages();
  const codeSamplesInst = codeSamples();
  const blogPostsInst = blogPosts();
  const eventsContentfulInst = eventsContentful();

  /** @type {import("@redocly/realm/dist/server/plugins/types").LifecyclePluginInstance } */
  const pluginInstance = {
    id: 'xrpl',
    processContent: async (actions, context) => {
      await indexPagesInst.processContent?.(actions, context);
      await codeSamplesInst.processContent?.(actions, context);
      await blogPostsInst.processContent?.(actions, context);
      await eventsContentfulInst.processContent?.(actions, context);
    },
    afterRoutesCreated: async (actions, context) => {
      await indexPagesInst.afterRoutesCreated?.(actions, context);
      await codeSamplesInst.afterRoutesCreated?.(actions, context);
      await blogPostsInst.afterRoutesCreated?.(actions, context);
      await eventsContentfulInst.afterRoutesCreated?.(actions, context);
    },
  };

  return pluginInstance;
}
