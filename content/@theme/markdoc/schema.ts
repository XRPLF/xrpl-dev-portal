import { Schema, Tag } from '@markdoc/markdoc';

export const repoLink: Schema & { tagName: string } = {
    tagName: 'repo-link',
    attributes: {
      path: {
        type: 'String',
        required: true,
      },
      github_fork: {
        type: 'String',
        required: false,
      },
      github_branch: {
        type: 'String',
        required: false,
      },
    },
    transform(node, config) {
        const attributes = node.transformAttributes(config);
        attributes["github_fork"] = attributes["github_fork"] || config.variables.env.PUBLIC_GITHUB_FORK;
        attributes["github_branch"] = attributes["github_branch"] || config.variables.env.PUBLIC_GITHUB_BRANCH;
        const children = node.transformChildren(config);
        return new Tag(this.render, attributes, children);
    },
    render: 'RepoLink',
  };