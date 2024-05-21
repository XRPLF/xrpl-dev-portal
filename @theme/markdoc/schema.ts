import { Schema, Tag } from '@markdoc/markdoc';

export const indexPageList: Schema & { tagName: string } = {
  tagName: 'child-pages',
  render: 'IndexPageItems',
  selfClosing: true,
};

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

export const codePageName: Schema & { tagName: string } = {
  tagName: 'code-page-name',
  attributes: {
    name: {
      type: 'String',
      required: false,
    },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    attributes["name"] = config.variables.frontmatter.seo.title;
    return new Tag(this.render, attributes);
  },
  render: 'CodePageName',
  selfClosing: true,
};

export const interactiveBlock: Schema & { tagName: string } = {
  tagName: 'interactive-block',
  attributes: {
    label: {
      type: 'String',
      required: true,
    },
    steps: {
      type: 'Array',
      required: true,
    },
    network: {
      type: 'Object',
      required: false,
      default: {
        name: "Testnet",
        websocket: "wss://s.altnet.rippletest.net:51233",
        explorer: "https://testnet.xrpl.org",
        faucet: "https://faucet.altnet.rippletest.net/accounts",
      }
    }
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = replaceHtmlAttributeValuesVariables(node.transformChildren(config), config.variables.env);
    return new Tag(this.render, attributes, children);
  },
  render: 'InteractiveBlock',
};

function replaceHtmlAttributeValuesVariables(nodes, variables) {
  for (const n of nodes) {
    if (n.attributes) {
      for (const attribName of Object.keys(n.attributes)) {
        const v = n.attributes[attribName];
        if (typeof v !== 'string') continue;
        n.attributes[attribName] = v.replace(/{%\s*\$env.([\w_\d]+)\s*%}/g, (_, name) => {
          return variables[name];
        });
      }
    }
    if (n.children) {
      replaceHtmlAttributeValuesVariables(n.children, variables);
    }
  }

  return nodes;
}

export const xrpLoader: Schema & { tagName: string } = {
  tagName: 'loading-icon',
  attributes: {
    message: {
      type: 'String',
      required: false,
      default: "...",
    },
  },
  render: 'XRPLoader',
  selfClosing: true,
};

export const badge: Schema & { tagName: string } = {
  tagName: 'badge',
  attributes: {
    color: {
      type: 'String',
      required: false,
      default: ""
    },
    href: {
      type: 'String',
      required: false
    },
    date: { // Not displayed, but useful for knowing how old an 'updated' badge is
      type: 'String',
      required: false
    }
  },
  render: 'Badge'
};

export const notEnabled: Schema & { tagName: string } = {
  tagName: 'not-enabled',
  render: 'NotEnabled',
  selfClosing: true,
};

export const xrplCard: Schema & { tagName: string } = {
  tagName: 'xrpl-card',
  attributes: {
    title: {
      type: 'String',
      required: true
    },
    href: {
      type: 'String',
      required: true
    },
    body: {
      type: 'String',
      required: false
    },
    image: {
      type: 'String',
      required: false
    },
    imageAlt: {
      type: 'String',
      required: false
    },
    external: { // Not actually implemented (yet)
      type: 'Boolean',
      required: false,
      default: false
    }
  },
  render: 'XRPLCard',
  selfClosing: true
}

export const cardGrid: Schema & { tagName: string } = {
  tagName: 'card-grid',
  attributes: {
    layout: {
      type: 'String',
      required: false,
      default: '3xN'
    }
  },
  render: 'CardGrid'
}
