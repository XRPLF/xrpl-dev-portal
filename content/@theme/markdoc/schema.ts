import { Schema, Tag } from '@markdoc/markdoc';

export const repoLink: Schema & { tagName: string } = {
    tagName: 'repo-link',
    attributes: {
      path: {
        type: 'String',
        required: true,
      },
    },
    render: 'RepoLink',
  };