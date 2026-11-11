// @ts-check
// The sample list the code samples page reads as `usePageSharedData('code-samples')`.

import { dirname, join, relative } from 'node:path';
import { createEntityLoader } from '@redocly/framework/plugin';

import { attachTo } from './blog-posts.js';
import { extractFirstHeading, getInnerText, parseContentFile, toTitleCase } from './markdoc-text.js';

const README_RE = /^_code-samples\/([^/]*)\/README\.md$/;
const SHARED_DATA_KEY = 'code-samples';
const ROUTES = ['/resources/code-samples', '/ja/resources/code-samples', '/es-es/resources/code-samples'];

export const codeSamplesLoader = createEntityLoader('xrpl:code-samples', async (ctx) => {
  const samples = [];
  const allLangs = new Set();

  for (const { readme, langs } of ctx.args.samples) {
    const ast = await parseContentFile(ctx, readme);
    const dirPath = dirname(readme);
    const title = extractFirstHeading(ast) || '';
    samples.push({
      path: dirPath,
      title: title || toTitleCase(dirname(dirPath)),
      description: getInnerText([ast.children[1]]).trim(),
      href: join('content', dirPath),
      langs,
    });
    langs.forEach((lang) => allLangs.add(lang));
  }

  samples.sort((a, b) => normalizeTitleForSort(a).localeCompare(normalizeTitleForSort(b)));
  return { value: { codeSamples: samples, langs: Array.from(allLangs) } };
});

export async function codeSamples(ctx) {
  // The READMEs are in `ignore` (they must not become pages), so neither `ctx.files` nor
  // `glob` lists them; `exists` and `readFile` still reach ignored files.
  const sampleFiles = await ctx.io.glob('_code-samples/**');
  const sampleDirs = Array.from(new Set(sampleFiles.map((path) => path.split('/').slice(0, 2).join('/'))));
  const samples = [];
  for (const dirPath of sampleDirs.sort()) {
    const readme = `${dirPath}/README.md`;
    if (!README_RE.test(readme) || !(await ctx.io.exists(readme))) continue;
    const langs = sampleFiles
      .filter((path) => path.startsWith(`${dirPath}/`))
      .map((path) => relative(dirPath, path).split('/')[0]);
    samples.push({ readme, langs: Array.from(new Set(langs)) });
  }

  const ref = codeSamplesLoader.withArgs({ samples }, { stableKey: 'xrpl:code-samples' });
  return { entities: [ref], attach: attachTo(ctx, ROUTES, SHARED_DATA_KEY, ref) };
}

function normalizeTitleForSort(sample) {
  return sample.title.includes('Intro') || sample.title.includes('Quickstart')
    ? ` ${sample.title}`
    : sample.title;
}
