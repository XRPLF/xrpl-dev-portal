#!/usr/bin/env node

/**
 * Color Contrast Check
 *
 * Scans a representative set of portal pages for WCAG 2.1 AA color-contrast
 * failures using axe-core, across every combination of:
 *
 *   theme  - light / dark
 *   width  - desktop 1440 / mobile 390
 *
 * Each page is loaded once; theme and width are permuted in place, so a run
 * costs one page load per URL rather than four.
 *
 * Drives the system Chrome (or Edge) through playwright-core, so there is no
 * bundled browser to download. Reports to the terminal only -- no files are
 * written.
 *
 * SCOPE: this checks the RESTING state only. Hover, focus, and active states are
 * not covered -- forcing those needs CSS.forcePseudoState over CDP plus a second
 * pass to discard colour combinations that cannot actually occur. That matters: in
 * a one-off audit of the interaction states the resting state was nearly clean
 * while hover/focus/active carried the overwhelming majority of failures. Passing
 * this script is necessary, not sufficient.
 *
 * It also reports only what axe can MEASURE. Elements axe cannot compute a ratio
 * for -- text on a background image, a background painted by a pseudo-element,
 * overlapping elements -- are hidden unless you pass --undetermined. Those are not
 * passes; notably every `.bds-btn` label is one, because the button background
 * comes from a `::before`.
 *
 *   npm run contrast-check
 *   node scripts/contrast-check.mjs --pages /docs/ /about/xrp
 *
 * Flags passed through `npm run` need a `--` separator, or npm tries to interpret
 * them itself and fails with EUNKNOWNCONFIG:
 *
 *   npm run contrast-check -- --ignore-redesigned    correct
 *   npm run contrast-check --ignore-redesigned       npm error: Unknown cli flag
 *
 * Calling this file directly avoids the separator entirely.
 *
 * Exits 0 when clean, 1 when violations or load errors were found, 2 on a
 * setup problem (missing dependency, no browser, preview server not running).
 */

import fs from 'fs';
import { createRequire } from 'module';

// ------------------------------------------------------------------ colours

const COLOR = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code, s) => COLOR ? `\x1b[${code}m${s}\x1b[0m` : String(s);
const bold = s => c('1', s), dim = s => c('2', s);
const red = s => c('31', s), green = s => c('32', s), yellow = s => c('33', s), cyan = s => c('36', s);

const rgb = hex => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
};
/**
 * Render the failing pair as real text-on-background, so the terminal shows the
 * actual contrast. Empty when colour is unavailable -- the hex codes are printed
 * on the following line either way.
 */
const specimen = (fg, bg, text) => {
  const f = rgb(fg), b = rgb(bg);
  if (!COLOR || !f || !b) return '';
  return `\x1b[38;2;${f.join(';')};48;2;${b.join(';')}m ${text} \x1b[0m `;
};

function fail(msg) { console.error(`\n${red('error')} ${msg}\n`); process.exit(2); }

// -------------------------------------------------------------------- pages

/**
 * The representative pages: a cross-section of the portal chosen to cover each
 * distinct template and component set, rather than every URL on the site.
 * Add a page here when a new template appears.
 */
const REPRESENTATIVE_PAGES = [
  // Landing and marketing
  '/',
  '/about',
  '/about/xrp',
  '/about/history',
  '/about/impact',
  '/about/uses',
  '/blog',
  '/community',
  '/community/events',
  '/community/developer-funding',
  '/develop',
  '/resources',

  // Use cases
  '/docs/use-cases/payments/',
  '/docs/use-cases/trading/',
  '/docs/use-cases/tokenization/',
  '/docs/use-cases/tokenization/real-world-assets',

  // Dev tools
  '/resources/code-samples',
  '/resources/dev-tools',
  '/resources/dev-tools/domain-verifier',
  '/resources/dev-tools/rpc-tool',
  '/resources/dev-tools/tx-sender',
  '/resources/dev-tools/websocket-api-tool',
  '/resources/dev-tools/xrp-faucets',
  '/resources/dev-tools/xrp-ledger-toml-checker',

  // Docs: tutorials
  '/docs/',
  '/docs/tutorials',
  '/docs/agents/agentic-transactions',
  '/docs/tutorials/get-started/get-started-javascript',
  '/docs/tutorials/tokens/fungible-tokens/issue-a-fungible-token',
  '/docs/infrastructure/configuration/connect-your-rippled-to-the-xrp-test-net',

  // Docs: references
  '/docs/references',
  '/docs/references/http-websocket-apis',
  '/docs/references/protocol/binary-format',
  '/docs/references/protocol/transactions/types',
  '/docs/references/protocol/transactions/types/permissioneddomainset',
  '/docs/references/protocol/ledger-data/ledger-entry-types/depositpreauth',
  '/docs/references/http-websocket-apis/public-api-methods/ledger-methods/ledger_entry',
  '/docs/references/http-websocket-apis/public-api-methods/clio-methods/server_info-clio',

  // Blog posts
  '/blog/2024/evolving-the-xrp-ledger',
  '/blog/2026/gpg-key-rotation',
  '/blog/2026/vulnerabilitydisclosurereport-bug-mar2026',
];

/**
 * The landing pages currently being rebuilt. Checking them against the current
 * design mostly reports defects that are about to be replaced. Delete this list
 * and the --ignore-redesigned flag once the redesign lands.
 */
const REDESIGNED = [
  '/',
  '/docs/',
  '/develop/',
  '/resources/',
  '/community/',
  '/community/developer-funding',
  '/docs/use-cases/payments/',
  '/docs/use-cases/trading/',
  '/docs/use-cases/tokenization/',
];

// Compare paths ignoring a trailing slash, so `/develop` and `/develop/` match.
// Matching is exact, not by prefix: ignoring `/docs/` must not drop `/docs/tutorials`.
const normPath = p => p.replace(/\/+$/, '') || '/';

// ---------------------------------------------------------------- arguments

const argv = process.argv.slice(2);
const has = f => argv.includes(f);
const val = (f, d) => { const i = argv.indexOf(f); return i > -1 && argv[i + 1] ? argv[i + 1] : d; };

if (has('--help') || has('-h')) {
  console.log(`
Color contrast check for the XRPL dev portal.

  node scripts/contrast-check.mjs [options]

  --base <url>        Preview server (default http://localhost:4000)
  --pages <p> [p...]  Check these paths instead of the representative pages
  --ignore-redesigned Skip the nine landing pages being redesigned
  --undetermined      Also report elements axe could not measure (not passes)
  --concurrency <n>   Parallel pages (default 4)
  --quiet             Only print the summary
  --help              This message

  Flags via npm need a separator:  npm run contrast-check -- --ignore-redesigned
`);
  process.exit(0);
}

const BASE = val('--base', process.env.BASE || 'http://localhost:4000').replace(/\/$/, '');
const CONCURRENCY = Number(val('--concurrency', process.env.CONCURRENCY || 4));
const QUIET = has('--quiet');
const UNDETERMINED = has('--undetermined');

let urls;
if (has('--pages')) {
  // Take paths up to the next flag, so `--pages /a /b --concurrency 2` works.
  urls = [];
  for (const a of argv.slice(argv.indexOf('--pages') + 1)) {
    if (a.startsWith('--')) break;
    urls.push(a);
  }
} else {
  urls = [...REPRESENTATIVE_PAGES];
}

let skipped = 0;
if (has('--ignore-redesigned')) {
  const skip = new Set(REDESIGNED.map(normPath));
  const before = urls.length;
  urls = urls.filter(u => !skip.has(normPath(u)));
  skipped = before - urls.length;
}

if (!urls.length) {
  fail(skipped ? 'Every page was skipped by --ignore-redesigned.' : 'No URLs to check.');
}

// ------------------------------------------------------- dependencies, setup

let chromium, AXE;
try {
  ({ chromium } = await import('playwright-core'));
  AXE = fs.readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
} catch {
  fail(`Dependencies are missing. Run:\n\n  npm install`);
}

// Fail fast with a useful message rather than one timeout per page.
try {
  const r = await fetch(BASE + '/', { method: 'HEAD' });
  if (!r.ok) throw new Error(String(r.status));
} catch {
  fail(`No preview server at ${BASE}\n\n  npm start`);
}

/**
 * playwright-core ships no browser, so drive one that is already installed.
 * Chrome first, then Edge -- both are Chromium and give identical results.
 */
async function launchBrowser() {
  for (const channel of ['chrome', 'msedge']) {
    try { return { browser: await chromium.launch({ channel }), channel }; } catch {}
  }
  fail(`No system Chrome or Edge found.\n\n  Install Google Chrome, or run against a\n  Playwright-managed build with:  npx playwright install chromium`);
}

// ---------------------------------------------------------------- the check

const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };
const THEMES = ['light', 'dark'];

/** Human label for the component a selector points at. */
function component(target, html) {
  const s = `${target} ${html || ''}`;
  if (/Breadcrumb/.test(s)) return 'breadcrumbs';
  if (/Admonition/.test(s)) return 'callout';
  if (/event-card/.test(s)) return 'event card';
  if (/bds-standard-card/.test(s)) return 'card';
  if (/bds-btn/.test(s)) return 'button';
  if (/tx-type-list/.test(s)) return 'tx type list';
  if (/side-nav|SideNav/i.test(s)) return 'side nav';
  if (/top-nav|navbar|Navbar/i.test(s)) return 'top nav';
  if (/footer/i.test(s)) return 'footer';
  return 'body copy';
}

const findings = [];
let done = 0;

async function scanPage(browser, url) {
  const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('dialog', d => d.dismiss().catch(() => {}));
  const local = [];

  try {
    const resp = await page.goto(BASE + url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const status = resp ? resp.status() : 0;
    if (status !== 200) throw new Error(`HTTP ${status}`);

    // `html.ready` is Realm's hydration signal. Do not wait for networkidle --
    // the dev-tools pages hold websockets open and never reach it.
    await page.waitForSelector('html.ready', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1500);

    // The consent widget is third-party CSS, is not theme-aware, and overlaps
    // page text -- it contributes failures nobody here can fix plus a pile of
    // undetermined nodes. Drop it before measuring.
    await page.evaluate(() => {
      document.querySelectorAll('[class*="osano"],[id*="osano"]').forEach(e => e.remove());
    });

    // Freeze animation. `reducedMotion` does NOT stop CSS transitions, and a
    // colour sampled mid-transition reports a ratio the page never actually has.
    await page.addStyleTag({
      content: '*,*::before,*::after{transition:none!important;animation:none!important}',
    });

    await page.addScriptTag({ content: AXE });

    for (const vp of Object.keys(VIEWPORTS)) {
      await page.setViewportSize(VIEWPORTS[vp]);
      for (const theme of THEMES) {
        // The site reads localStorage on boot; the toggle just swaps this class.
        await page.evaluate(t => {
          try { localStorage.setItem('user-prefers-color', t); } catch {}
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(t);
        }, theme);
        await page.waitForTimeout(400);

        const cls = await page.evaluate(() => document.documentElement.className);
        if (!new RegExp(`\\b${theme}\\b`).test(cls)) {
          local.push({ url, kind: 'error', reason: `theme "${theme}" did not apply (html class: "${cls}")` });
          continue;
        }

        // `resultTypes: ['violations']` caps every OTHER result type at one node per
        // rule. That is a useful speed-up when only violations are reported, but it
        // silently under-reports `incomplete` by orders of magnitude -- so it must
        // come off whenever --undetermined is asked for. Violations are unaffected
        // either way, which is what makes getting this wrong hard to notice.
        const res = await page.evaluate(async all => await axe.run(document, {
          runOnly: { type: 'rule', values: ['color-contrast'] },
          ...(all ? {} : { resultTypes: ['violations'] }),
        }), UNDETERMINED);

        for (const n of res.violations.flatMap(v => v.nodes)) {
          const d = n.any?.[0]?.data || {};
          const target = [].concat(n.target).join(' ');
          local.push({
            url, theme, vp, kind: 'violation', target,
            ratio: d.contrastRatio, required: d.expectedContrastRatio,
            fg: d.fgColor, bg: d.bgColor,
            component: component(target, n.html),
          });
        }

        if (UNDETERMINED) {
          for (const n of res.incomplete.flatMap(v => v.nodes)) {
            local.push({
              url, theme, vp, kind: 'incomplete',
              target: [].concat(n.target).join(' '),
              reason: n.any?.[0]?.data?.messageKey || 'unknown',
            });
          }
        }
      }
    }
  } catch (e) {
    local.push({ url, kind: 'error', reason: String(e.message || e).split('\n')[0].slice(0, 160) });
  } finally {
    await ctx.close().catch(() => {});
  }

  findings.push(...local);

  const v = local.filter(x => x.kind === 'violation').length;
  const e = local.filter(x => x.kind === 'error').length;
  if (!QUIET) {
    const tag = e ? red('error') : v ? red(`${v} violation${v === 1 ? '' : 's'}`) : green('ok');
    console.log(`${dim(`[${String(++done).padStart(String(urls.length).length)}/${urls.length}]`)} ${url.padEnd(56)} ${tag}`);
  } else { done++; }
}

const { browser, channel } = await launchBrowser();

console.log(`\n${bold('Color contrast')} ${dim(BASE)}`);
console.log(dim(`${urls.length} pages - light/dark - desktop 1440 / mobile 390 - resting state`));
if (skipped) console.log(dim(`${skipped} redesigned page${skipped === 1 ? '' : 's'} skipped`));
console.log(dim(`${channel} ${browser.version()}\n`));

const queue = [...urls];
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (queue.length) await scanPage(browser, queue.shift());
}));
await browser.close();

// ------------------------------------------------------------------- report

/**
 * Reading the output.
 *
 * Findings are grouped by COLOUR PAIR, not by selector. One bad token surfaces on
 * every element that uses it, so `#454549 on #141414` is the actionable unit; a
 * list of selectors like `li:nth-child(3)` is not. In a truecolor terminal each
 * group prints a swatch in the real colours, so the failure is visible rather than
 * something you decode from hex. Colour is suppressed when piped or under NO_COLOR.
 *
 * Within a group there is one line per ELEMENT, not per variant -- the same element
 * failing at two widths is one thing to fix. Variants collapse to `all modes`
 * (light + dark), `all screens` (desktop + mobile), or `all variants`, but only
 * when they form a complete cross-product. Something found in dark/desktop and
 * light/mobile touches both themes and both widths yet only two of the four
 * combinations, so it is listed in full rather than reported as more widespread
 * than it is.
 *
 * Selectors truncate in the MIDDLE, because what distinguishes two sibling
 * selectors is usually the tail (`:nth-child(3)`).
 *
 * To fix a finding: take the foreground hex, find the token that defines it in
 * `styles/`, and check whether the dark-mode branch overrides it. Beware tokens one
 * step apart on the same ramp -- that is what produced the 2.66:1 `.category_count`
 * chip, and adjacent ramp steps look deliberate in a diff.
 */

const violations = findings.filter(f => f.kind === 'violation');
const errors = findings.filter(f => f.kind === 'error');
const incomplete = findings.filter(f => f.kind === 'incomplete');

// Group by colour pair: one bad token surfaces on every element that uses it,
// so the pair is the actionable unit, not the selector.
const groups = new Map();
for (const f of violations) {
  const k = `${f.fg}|${f.bg}|${f.required}`;
  if (!groups.has(k)) groups.set(k, { ...f, items: [] });
  groups.get(k).items.push(f);
}
const sorted = [...groups.values()].sort((a, b) => b.items.length - a.items.length);

/**
 * Describe which variants a set of findings covers, collapsing a full sweep to
 * "all modes" / "all screens".
 *
 * Only collapses when the variants form a complete cross-product. A finding seen
 * in dark/desktop and light/mobile covers both themes and both widths but only
 * two of the four combinations, so it is listed in full rather than being
 * reported as something it is not.
 */
function variantLabel(items) {
  const combos = new Set(items.map(i => `${i.theme}/${i.vp}`));
  const themes = [...new Set(items.map(i => i.theme))];
  const widths = [...new Set(items.map(i => i.vp))];
  if (combos.size !== themes.length * widths.length) return [...combos].sort().join(' ');
  if (themes.length === 2 && widths.length === 2) return 'all variants';
  return `${themes.length === 2 ? 'all modes' : themes[0]}, ${widths.length === 2 ? 'all screens' : widths[0]}`;
}

console.log(`\n${dim('-'.repeat(72))}`);

if (!violations.length && !errors.length) {
  console.log(`${green(bold('PASS'))}  no contrast violations in ${urls.length} pages x 4 variants\n`);
} else {
  console.log(bold(`${violations.length} violation${violations.length === 1 ? '' : 's'} in ${sorted.length} colour pair${sorted.length === 1 ? '' : 's'}`));
  const clean = urls.filter(u => !violations.some(v => v.url === u)).length;
  console.log(dim(`${clean}/${urls.length} pages clean in all four variants\n`));

  sorted.forEach((g, i) => {
    const worst = Math.min(...g.items.map(x => x.ratio));
    const pages = new Set(g.items.map(x => x.url)).size;
    console.log(`${bold(`#${i + 1}`)}  ${specimen(g.fg, g.bg, 'Sample text')}${bold(`${worst}:1`)} ${dim(`needs ${g.required}`)}`);
    console.log(`    ${cyan(g.fg)} on ${cyan(g.bg)}  ${dim(`- ${g.items.length} finding${g.items.length === 1 ? '' : 's'} on ${pages} page${pages === 1 ? '' : 's'}, ${variantLabel(g.items)}`)}`);
    console.log(`    ${dim([...new Set(g.items.map(x => x.component))].join(', '))}`);

    // One line per element, not per variant: the same element failing at two
    // widths is one thing to fix.
    const byElement = new Map();
    for (const it of g.items) {
      const k = `${it.url}|${it.target}`;
      if (!byElement.has(k)) byElement.set(k, []);
      byElement.get(k).push(it);
    }
    const elements = [...byElement.values()].sort((a, b) => a[0].url.localeCompare(b[0].url));
    for (const items of elements) {
      const { url: u, target } = items[0];
      // Truncate the middle: what distinguishes two sibling selectors is usually
      // the tail (`:nth-child(3)`), so cutting the end makes them look identical.
      const sel = target.length > 60 ? `${target.slice(0, 30)}...${target.slice(-27)}` : target;
      console.log(`      ${yellow(variantLabel(items).padEnd(20))} ${dim(u.padEnd(46))} ${sel}`);
    }
    console.log();
  });
}

// --undetermined only. These are elements axe could not compute a ratio for, which
// is NOT the same as passing. Each is deduped to (reason, page, element) and its
// variants collapsed, because the same element is otherwise reported once per
// variant; the element counts are things to look at, the node counts are not.
if (incomplete.length) {
  const EXPLAIN = {
    bgImage: 'text sits on a background image',
    pseudoContent: 'background is painted by a pseudo-element',
    bgOverlap: 'element overlaps another background',
    elmPartiallyObscured: 'element is partly covered',
    elmPartiallyObscuring: 'element partly covers something else',
    bgGradient: 'background is a gradient',
    shortTextContent: 'too little text to judge automatically',
    equalRatio: 'foreground and background are identical',
    imgNode: 'text overlaps an image node',
    nonBmp: 'text is non-BMP characters (icons, emoji)',
  };

  const byReason = new Map();
  for (const f of incomplete) {
    const r = f.reason || 'unknown';
    if (!byReason.has(r)) byReason.set(r, []);
    byReason.get(r).push(f);
  }
  const uniqueElements = new Set(incomplete.map(f => `${f.reason}|${f.url}|${f.target}`)).size;

  console.log(`${yellow(bold(`${incomplete.length} undetermined`))} ${dim('- axe could not compute a ratio. These are NOT passes.')}`);
  console.log(dim(`${uniqueElements} unique elements once variants are collapsed.`));

  for (const [reason, items] of [...byReason.entries()].sort((a, b) => b[1].length - a[1].length)) {
    const elements = new Set(items.map(f => `${f.url}|${f.target}`)).size;
    const pages = new Map();
    for (const f of items) {
      if (!pages.has(f.url)) pages.set(f.url, []);
      pages.get(f.url).push(f);
    }
    console.log(`\n  ${bold(reason)} ${dim(EXPLAIN[reason] || '')}`);
    console.log(dim(`  ${items.length} nodes, ${elements} element${elements === 1 ? '' : 's'}, ${pages.size} page${pages.size === 1 ? '' : 's'}`));
    const rows = [...pages.entries()]
      .map(([url, group]) => ({ url, n: new Set(group.map(f => f.target)).size, label: variantLabel(group) }))
      .sort((a, b) => b.n - a.n || a.url.localeCompare(b.url));
    for (const r of rows.slice(0, 15)) {
      console.log(`      ${String(r.n).padStart(4)}  ${yellow(r.label.padEnd(20))} ${r.url}`);
    }
    if (rows.length > 15) console.log(dim(`      +${rows.length - 15} more pages`));
  }

  if (byReason.has('pseudoContent')) {
    const btn = byReason.get('pseudoContent').filter(f => /bds-btn/.test(f.target)).length;
    console.log(dim(`\n  ${btn} of the pseudoContent nodes are .bds-btn labels, whose background is painted`));
    console.log(dim(`  by a ::before -- check one per button style. The rest are other elements.`));
  }
  console.log();
}

if (errors.length) {
  console.log(red(bold(`${errors.length} page error${errors.length === 1 ? '' : 's'}`)));
  for (const e of errors) console.log(`    ${e.url} ${dim(e.reason)}`);
  console.log();
}

process.exit(violations.length || errors.length ? 1 : 0);
