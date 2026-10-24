import { strict as assert } from 'node:assert';
import { mkdtemp, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const temp = await mkdtemp(join(root, '.card-text-icon-card-'));
const output = join(temp, 'card.cjs');

try {
  await build({
    absWorkingDir: root,
    entryPoints: ['shared/components/CardTextIcon/CardTextIconCard.tsx'],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    outfile: output,
    alias: { shared: join(root, 'shared') },
    external: ['react'],
  });

  const { CardTextIconCard } = await import(pathToFileURL(output).href);
  const description = React.createElement(
    React.Fragment,
    null,
    React.createElement('p', null, 'Ideal for seasoned teams'),
    React.createElement(
      'ul',
      null,
      React.createElement('li', null, 'Read the documentation'),
    ),
  );
  const markup = renderToStaticMarkup(
    React.createElement(CardTextIconCard, {
      heading: 'Build It Yourself',
      description,
      gridColSpan: { base: 4, md: 4, lg: 6 },
    }),
  );

  assert.match(markup, /<p>Ideal for seasoned teams<\/p>/);
  assert.match(markup, /<ul><li>Read the documentation<\/li><\/ul>/);
  assert.doesNotMatch(markup, /<p[^>]*>\s*<(?:p|ul)(?:\s|>)/);
  console.log('card rich description renders without nested paragraph markup');
} finally {
  await rm(temp, { recursive: true, force: true });
}
