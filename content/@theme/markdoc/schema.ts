import { Schema, Tag } from '@markdoc/markdoc';

export const indexPageList: Schema & { tagName: string } = {
  tagName: 'index-page-items',
  render: 'IndexPageItems',
};

export const startStep: Schema & { tagName: string } = {
  tagName: 'start-step',
  attributes: {
    label: {
      type: 'String',
      required: true,
    },
    stepIdx: {
      type: 'Number',
      required: true,
    },
    steps: {
      type: 'Array',
      required: true,
    },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = replaceHtmlAttributeValuesVariables(node.transformChildren(config), config.variables.env);
    return new Tag(this.render, attributes, children);
  },
  render: 'StartStep',
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
