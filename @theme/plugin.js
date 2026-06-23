import { indexPages } from './plugins/index-pages.js';
import { codeSamples } from './plugins/code-samples.js';
import { blogPosts } from './plugins/blog-posts.js';
import { tutorialLanguages } from './plugins/tutorial-languages.js';
import { tutorialMetadata } from './plugins/tutorial-metadata.js';

export default function customPlugin() {
  const indexPagesInst = indexPages();
  const codeSamplesInst = codeSamples();
  const blogPostsInst = blogPosts();
  const tutorialLanguagesInst = tutorialLanguages();
  const tutorialMetadataInst = tutorialMetadata();


  /** @type {import("@redocly/realm/dist/server/plugins/types").PluginInstance } */
  const pluginInstance = {
    id: 'xrpl',
    processContent: async (content, actions) => {
      await indexPagesInst.processContent?.(content, actions);
      await codeSamplesInst.processContent?.(content, actions);
      await blogPostsInst.processContent?.(content, actions);
      await tutorialLanguagesInst.processContent?.(content, actions);
      await tutorialMetadataInst.processContent?.(content, actions);
    },
    afterRoutesCreated: async (content, actions) => {
      await indexPagesInst.afterRoutesCreated?.(content, actions);
      await codeSamplesInst.afterRoutesCreated?.(content, actions);
      await blogPostsInst.afterRoutesCreated?.(content, actions);
      await tutorialLanguagesInst.processContent?.(content, actions);
      await tutorialMetadataInst.processContent?.(content, actions);
    },
  };

  return pluginInstance;
}
