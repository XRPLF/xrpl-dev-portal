// @ts-check

import { getInnerText } from '@redocly/realm/dist/shared/markdoc.js';

import { dirname, relative, join as joinPath } from 'path';

export function codeSamples() {
  /** @type {import("@redocly/realm/dist/server/plugins/types").PluginInstance } */
  const instance = {
    processContent: async (actions, { fs, cache }) => {
      try {
        const samples = [];
        const allLands = new Set();
        const allCodeSampleFiles = await fs.scan();

        const readmes = allCodeSampleFiles.filter((file) => file.relativePath.match(/^_code-samples[\/\\]([^\\\/]*)[\/\\]README\.md$/));

        for (const { relativePath } of readmes) {
          const { data } = await cache.load(relativePath, 'markdown-ast');

          const dirPath = dirname(relativePath);
          const langs = unique(
            allCodeSampleFiles
              .filter((file) => file.relativePath.startsWith(dirPath) && !file.relativePath.endsWith('README.md'))
              .map((file) => relative(dirPath, file.relativePath).split('/')[0])
          );
          const title = extractFirstHeading(data.ast) || '';
          samples.push({
            path: dirPath,
            title: title || toTitleCase(dirname(dirPath)),
            description: getInnerText([data.ast.children[1]]).replace(title, '').trim(),
            href: joinPath('content', dirPath),
            langs,
          });

          langs.forEach((l) => allLands.add(l));
        }

        const sortedSamples = samples.sort((a, b) => normalizeTitleForSort(a).localeCompare(normalizeTitleForSort(b)));

        actions.createSharedData('code-samples', {
          codeSamples: sortedSamples,
          langs: Array.from(allLands),
        });
        actions.addRouteSharedData('/resources/code-samples/', 'code-samples', 'code-samples');
        actions.addRouteSharedData('/ja/resources/code-samples/', 'code-samples', 'code-samples');
      } catch (e) {
        console.log(e);
      }
    },
  };
  return instance;
}

function normalizeTitleForSort(cs) {
  if (cs.title.includes('Intro') || cs.title.includes('Quickstart')) {
    return ` ${cs.title}`;
  }
  return cs.title;
}

const WORDS_TO_CAPS = ['xrp'];

function toTitleCase(s) {
  const words = s.split(/_|[^\w']/);
  return words
    .filter((word) => word)
    .map((word) => (WORDS_TO_CAPS.includes(word) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ')
    .replace("'S", "'s")
    .replace(' A ', ' a ');
}

function unique(array) {
  return Array.from(new Set(array));
}

function extractFirstHeading(ast) {
  let heading;

  visit(ast, (node) => {
    if (!isNode(node)) {
      return;
    }

    if (node.type === 'heading') {
      heading = getInnerText([node]);
      return EXIT;
    }
  });

  return heading;
}

function isNode(value) {
  return !!(value?.$$mdtype === 'Node');
}

const EXIT = Symbol('Exit visitor');
function visit(node, visitor) {
  if (!node) return;

  const res = visitor(node);
  if (res === EXIT) return res;

  for (const child of node.children) {
    if (!child || typeof child === 'string') {
      continue;
    }
    const res = visit(child, visitor);
    if (res === EXIT) return res;
  }
}
