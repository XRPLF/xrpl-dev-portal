#!/usr/bin/env node

/**
 * Button spec audit
 *
 * Measures every `.bds-btn` on a page against the Button specification, in both
 * themes and in every interaction state, and reports where the cascade produced
 * something other than what Button.scss asked for.
 *
 *   node scripts/button-audit.mjs --pages /docs/agents/agentic-transactions
 *   npm run button-audit -- --pages /about
 *
 * WHY THIS EXISTS, given contrast-check.mjs already scans these pages: that
 * script checks the RESTING state only and reports only what axe can measure,
 * and every `.bds-btn` label is a node axe cannot compute -- the button's
 * background comes from a `::before`. So the component contrast-check is least
 * able to see is exactly the one the redesign is rolling out. This closes that
 * gap from the other direction: not "is the ratio adequate" but "is the painted
 * colour the specified one".
 *
 * WHAT IT COMPARES
 *
 *   expected  scripts/button-audit/spec.scss, which imports Button.scss and
 *             re-emits $bds-btn-palette / $bds-btn-disabled / $bds-btn-ring as
 *             data. There is no second copy of the values -- edit §2 of
 *             Button.scss and the expectations move with it.
 *   actual    getComputedStyle on the live page, after the full cascade.
 *
 * The gap between those two is the finding. Button.scss §5 raises specificity
 * with a doubled class and five anchor pseudo-classes precisely because
 * Bootstrap, Redocly and container rules like `.bds-link-text-card__content a`
 * all try to repaint an anchor button; this is what tells you when one wins.
 *
 * HOW THE STATES ARE REACHED
 *
 *   rest            as loaded
 *   hover, active   CDP CSS.forcePseudoState -- real hovering is flaky and
 *                   :active cannot be held across a measurement
 *   focus-visible   a real Tab press to set keyboard modality, then .focus().
 *                   Forcing this one over CDP is not portable across Chrome
 *                   versions, and a silent failure would read as a pass.
 *   disabled        synthesised by adding `.bds-btn--disabled`
 *   inactive        synthesised by setting aria-disabled="true"
 *
 * The last two are marked SYNTHETIC in the report: the class is real and the
 * cascade is real, but the page never puts the button in that state on its own.
 * Pass --no-synthetic to measure only what the page actually renders.
 *
 * Markup that already pins the appearance is honoured rather than forced:
 * a `.bds-btn--loading` button is compared against ENGAGED in every state (§4
 * lists loading alongside :hover), an `aria-disabled="true"` button against
 * REST (§4's engaged selectors exclude it), and an already-disabled button is
 * measured only in `disabled`, its one reachable state.
 *
 * WHAT IS CHECKED, PER STATE
 *
 *   colour     label, background, all four border sides
 *   ::before   background-color and transform -- the rise IS the hover fill, so
 *              a ::before that does not scale is a hover state that never
 *              arrives, and nothing else would show it
 *   outline    focus-visible only: width, style, offset and the ring colour.
 *              The ring is chosen by `context` alone, and Button.md is explicit
 *              that a wrong ring renders perfectly -- so it is measured, not eyed.
 *   geometry   padding, border width, min-height, radius, font, gap. Checked
 *              against the spec in rest, then checked for INVARIANCE across
 *              every other state, because "geometry never varies" is a spec
 *              guarantee and a hover rule that resizes a button breaks it.
 *
 * Exits 0 when clean, 1 when findings were reported, 2 on a setup problem.
 */

import fs from 'fs';
import path from 'path';
import * as sass from 'sass';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

// ------------------------------------------------------------------ colours

const COLOR = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code, s) => (COLOR ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const bold = s => c('1', s), dim = s => c('2', s);
const red = s => c('31', s), green = s => c('32', s);
const yellow = s => c('33', s), cyan = s => c('36', s), magenta = s => c('35', s);

function fail(msg) { console.error(`\n${red('error')} ${msg}\n`); process.exit(2); }

/** Paint a swatch in the terminal so a wrong colour is visible, not just numeric. */
const swatch = value => {
  const m = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(value || '');
  if (!COLOR || !m) return '';
  return `\x1b[48;2;${m[1]};${m[2]};${m[3]}m  \x1b[0m`;
};

// ---------------------------------------------------------------- arguments

const argv = process.argv.slice(2);
const has = f => argv.includes(f);
const val = (f, d) => { const i = argv.indexOf(f); return i > -1 && argv[i + 1] ? argv[i + 1] : d; };

if (has('--help') || has('-h')) {
  console.log(`
Button spec audit for the XRPL dev portal.

  node scripts/button-audit.mjs --pages <path> [path...]

  --base <url>        Preview server (default http://localhost:4000)
  --pages <p> [p...]  Paths to audit (required)
  --themes <l,d>      Themes to check (default light,dark)
  --viewport <v>      desktop | mobile | both (default both). Buttons hidden at
                      a width are reported as skipped, never as passing.
  --no-synthetic      Skip the disabled and inactive states
  --selector <css>    What counts as a button (default .bds-btn)
  --assume <g/e/c>    Axes for buttons with no bds-btn--* classes, e.g.
                      neutral/strong/on-theme. Needed for markup styled by the
                      bds-button() Sass mixin, which has no variant classes to
                      read. Classes still win where present.
  --verbose           Print every measurement, not only the failures
  --json              Emit findings as JSON instead of a report
  --inject <css>      Add this CSS after load. Use it to prove the audit can
                      fail before trusting a green run, or to test whether a
                      suspected rogue rule would actually beat the component:
                        --inject '.bds-btn{color:red}'
  --allow-stale       Run even when a .scss is newer than the compiled CSS.
                      The result then describes the last build, not your source.
  --help              This message

  Flags via npm need a separator:  npm run button-audit -- --pages /about
`);
  process.exit(0);
}

const BASE = val('--base', process.env.BASE || 'http://localhost:4000').replace(/\/$/, '');
const SELECTOR = val('--selector', '.bds-btn');
const VERBOSE = has('--verbose');
const AS_JSON = has('--json');
const SYNTHETIC = !has('--no-synthetic');
const INJECT = val('--inject', null);

/**
 * Fallback axes for buttons carrying no `bds-btn--*` classes.
 *
 * The Sass mixin form of the component sets the same custom properties as the
 * class form but leaves no classes behind to read them back from, so the axes
 * have to be supplied. Deliberately explicit rather than guessed: assuming a
 * default would silently check a `standard` button against `strong`'s palette
 * and report a wall of colour mismatches that describe the wrong expectation.
 */
const ASSUME = (() => {
  const v = val('--assume', null);
  if (!v) return null;
  const [group, emphasis, context] = v.split('/').map(s => s && s.trim());
  if (!group || !emphasis || !context) {
    fail(`--assume needs group/emphasis/context, e.g. neutral/strong/on-theme (got "${v}")`);
  }
  return { group, emphasis, context };
})();
const THEMES = val('--themes', 'light,dark').split(',').map(s => s.trim()).filter(Boolean);

let urls = [];
if (has('--pages')) {
  for (const a of argv.slice(argv.indexOf('--pages') + 1)) {
    if (a.startsWith('--')) break;
    urls.push(a);
  }
}
if (!urls.length) fail('No pages given.\n\n  node scripts/button-audit.mjs --pages /about');

// ------------------------------------------------------------- the spec data

/**
 * Compile scripts/button-audit/spec.scss and parse the four blocks it emits.
 * Compiled fresh on every run rather than checked in, so the audit cannot pass
 * against a stale copy of a palette that has since changed.
 */
function loadSpec() {
  const scss = path.join(HERE, 'button-audit', 'spec.scss');
  if (!fs.existsSync(scss)) fail(`Missing ${path.relative(ROOT, scss)}`);

  let css;
  try {
    // The same load paths as `npm run build-css`, so an @import that resolves
    // for the site resolves here.
    css = sass.compile(scss, {
      loadPaths: [path.join(ROOT, 'styles', 'scss'), ROOT],
      sourceMap: false,
      quietDeps: true,
      // Button.scss uses the legacy @import and global built-ins, as does the
      // rest of styles/. Silencing them here keeps the audit's own output clean
      // without touching how the site is built.
      silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
    }).css;
  } catch (e) {
    fail(`Could not compile the spec:\n\n${e.message}`);
  }

  // Each block is `#id { --a--b: value; ... }`. The names carry the axes, so
  // splitting on `--` recovers the map structure the Sass loop flattened.
  const block = id => {
    const m = new RegExp(`#${id}\\s*\\{([^}]*)\\}`).exec(css);
    if (!m) fail(`Spec block #${id} did not compile.`);
    const out = {};
    for (const line of m[1].split(';')) {
      const kv = /^\s*--([\w-]+)\s*:\s*(.+?)\s*$/.exec(line);
      if (kv) out[kv[1]] = kv[2];
    }
    return out;
  };

  const palette = {}, disabled = {}, ring = {}, geometry = {};

  // group--emphasis--state--slot--mode. Groups contain hyphens
  // (`brand-on-inverse`), so parse from the RIGHT, where the field count is fixed.
  for (const [k, v] of Object.entries(block('bds-btn-spec-palette'))) {
    const p = k.split('--');
    const mode = p.pop(), slot = p.pop(), state = p.pop(), emphasis = p.pop();
    const group = p.join('--');
    (((palette[group] ??= {})[emphasis] ??= {})[state] ??= {})[slot] ??= {};
    palette[group][emphasis][state][slot][mode] = v;
  }
  for (const [k, v] of Object.entries(block('bds-btn-spec-disabled'))) {
    const p = k.split('--');
    const mode = p.pop(), slot = p.pop();
    ((disabled[p.join('--')] ??= {})[slot] ??= {})[mode] = v;
  }
  for (const [k, v] of Object.entries(block('bds-btn-spec-ring'))) {
    const p = k.split('--');
    const mode = p.pop();
    (ring[p.join('--')] ??= {})[mode] = v;
  }
  Object.assign(geometry, block('bds-btn-spec-geometry'));

  return { palette, disabled, ring, geometry };
}

const SPEC = loadSpec();
const GROUPS = Object.keys(SPEC.palette);
const EMPHASES = ['strong', 'standard', 'subtle'];
const CONTEXTS = Object.keys(SPEC.disabled);

// Validate --assume against the spec now rather than letting an unknown axis
// surface later as a null expectation and a crash mid-run.
if (ASSUME) {
  if (!GROUPS.includes(ASSUME.group)) fail(`--assume group "${ASSUME.group}" is not one of: ${GROUPS.join(', ')}`);
  if (!EMPHASES.includes(ASSUME.emphasis)) fail(`--assume emphasis "${ASSUME.emphasis}" is not one of: ${EMPHASES.join(', ')}`);
  if (!CONTEXTS.includes(ASSUME.context)) fail(`--assume context "${ASSUME.context}" is not one of: ${CONTEXTS.join(', ')}`);
}

// -------------------------------------------------------------- freshness

/**
 * Refuse to run against a stale bundle.
 *
 * The expected side of this audit is compiled from source on every run; the
 * actual side is whatever `static/css/devportal2024-v1.css` currently holds,
 * because that is the file the preview server serves. `realm develop` does not
 * compile Sass -- `npm run build-css` does -- so editing a .scss and re-running
 * the audit measures the PREVIOUS build and reports on code that is no longer
 * there.
 *
 * That is not a theoretical hazard. It has already produced a clean run and
 * then four mismatches from the identical command, either side of a rebuild,
 * with no source change in between: the pass was measuring a fix that had been
 * deleted, and the failure was the truth. A green result is worthless if the
 * bundle can be older than the stylesheet, so this is a hard failure rather
 * than a warning -- a warning is something a passing run teaches you to skim.
 *
 * Rebuilding automatically would be worse: the audit would silently mutate the
 * artefact it is measuring, which is the same class of untracked rebuild that
 * caused the confusion in the first place.
 */
const CSS_BUNDLE = path.join(ROOT, 'static', 'css', 'devportal2024-v1.css');
const STYLE_ROOTS = ['styles', 'shared'];

function checkBundleFreshness() {
  if (has('--allow-stale')) return;

  // An mtime comparison only means anything when the server is serving THIS
  // working tree. A remote --base has a bundle of its own that no local file
  // predicts, so the check would be noise.
  if (!/^https?:\/\/(localhost|127\.0\.0\.1)([:/]|$)/.test(BASE)) {
    console.log(dim(`  (skipping the stale-bundle check: ${BASE} is not this working tree)`));
    return;
  }

  if (!fs.existsSync(CSS_BUNDLE)) {
    fail(`No compiled CSS at ${path.relative(ROOT, CSS_BUNDLE)}\n\n  npm run build-css`);
  }
  const builtAt = fs.statSync(CSS_BUNDLE).mtimeMs;

  const newer = [];
  for (const dir of STYLE_ROOTS) {
    const base = path.join(ROOT, dir);
    if (!fs.existsSync(base)) continue;
    for (const rel of fs.readdirSync(base, { recursive: true })) {
      const name = String(rel);
      if (!name.endsWith('.scss')) continue;
      const file = path.join(base, name);
      if (fs.statSync(file).mtimeMs > builtAt) newer.push(path.relative(ROOT, file));
    }
  }

  if (newer.length) {
    const shown = newer.slice(0, 8).map(f => `    ${f}`).join('\n');
    const more = newer.length > 8 ? `\n    …and ${newer.length - 8} more` : '';
    fail(
      `The compiled CSS is older than ${newer.length} stylesheet${newer.length === 1 ? '' : 's'}.\n` +
      `The audit measures ${path.relative(ROOT, CSS_BUNDLE)}, so it would be reporting\n` +
      `on the previous build, not on your source.\n\n${shown}${more}\n\n  npm run build-css`
    );
  }
}

// ------------------------------------------------------- dependencies, setup

let chromium;
try {
  ({ chromium } = await import('playwright-core'));
} catch {
  fail('Dependencies are missing. Run:\n\n  npm install');
}

try {
  const r = await fetch(BASE + '/', { method: 'HEAD' });
  if (!r.ok) throw new Error(String(r.status));
} catch {
  fail(`No preview server at ${BASE}\n\n  npm start`);
}

checkBundleFreshness();

/** playwright-core ships no browser; drive one that is already installed. */
async function launchBrowser() {
  for (const channel of ['chrome', 'msedge']) {
    try { return await chromium.launch({ channel }); } catch { /* try the next */ }
  }
  fail('No system Chrome or Edge found.\n\n  Install Google Chrome, or:  npx playwright install chromium');
}

// --------------------------------------------------------- expected per state

/**
 * The specified triplet for one button in one state.
 *
 * `background` stays at the RESTING value in every engaged state. §4 of
 * Button.scss swaps only --bds-btn-bd and --bds-btn-fg on hover; the engaged
 * fill is delivered by the ::before rise, not by the element's own background.
 * Asserting the element turns green on hover would be wrong, and would hide the
 * real failure mode -- a ::before that never scales.
 *
 * `on-saturated` + `strong` is the exception, and inverts all three of those.
 * Its engaged fill is `rgba(0, 0, 0, 0.6)`, which button.md reads as "black at
 * 60% over green" and measures at 7.0517 -- a figure only reachable if the soft
 * fill composites against the block BEHIND the button. Painted over the resting
 * #141414 the way the rise paints everything else, it resolves to #080808 and
 * measures 17.18, so the two layers swap for that combination: the element
 * carries the soft fill and the rise carries the solid one, collapsing upward
 * to uncover it. See §4 of Button.scss.
 *
 * The stroke swaps with them. It is `transparent` in both states, so it shows
 * whatever the element paints -- now the soft fill -- and is pinned to the
 * resting fill to close the 1px ring that would otherwise sit around the pill.
 */
function expectedFor({ group, emphasis, context, mode }, state) {
  const P = SPEC.palette[group]?.[emphasis];
  if (!P) return null;
  const rest = P.rest, engaged = P.engaged;
  const engagedBg = engaged.bg[mode];

  if (state === 'disabled') {
    const D = SPEC.disabled[context];
    // Emphasis does not choose disabled's colours, only which of them are
    // painted: standard drops the fill, subtle drops fill and stroke. The
    // on-saturated group carries an opaque strong-only stroke.
    let bg = D.bg[mode], bd = D.bd[mode];
    if (emphasis === 'standard') bg = 'transparent';
    if (emphasis === 'subtle') { bg = 'transparent'; bd = 'transparent'; }
    if (emphasis === 'strong' && D['strong-bd']) bd = D['strong-bd'][mode];
    return { color: D.fg[mode], background: bg, border: bd, beforeBg: null, rise: 'none' };
  }

  const engagedState = state === 'hover' || state === 'active' || state === 'focus-visible';
  const inverted = context === 'on-saturated' && emphasis === 'strong';

  return {
    color: engagedState ? engaged.fg[mode] : rest.fg[mode],
    background: inverted ? engagedBg : rest.bg[mode],
    border: inverted && !engagedState
      ? rest.bg[mode]
      : engagedState ? engaged.bd[mode] : rest.bd[mode],
    beforeBg: inverted ? rest.bg[mode] : engagedBg,
    // The rise still means "the engaged fill is showing"; inverted, that is the
    // rise being DOWN, because the solid fill it carries has collapsed away.
    rise: engagedState === !inverted ? 'up' : 'down',
  };
}

// ------------------------------------------------------------------ the page

const STATES = ['rest', 'hover', 'active', 'focus-visible'];
const SYNTHETIC_STATES = ['disabled', 'inactive'];

/**
 * Both widths by default, matching contrast-check.mjs. A page often ships two
 * copies of the same CTA behind `d-none d-lg-block` / `d-lg-none`, and auditing
 * one width leaves half of them permanently unmeasured while still printing a
 * clean summary.
 */
const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };
const VIEWPORT_NAMES = (() => {
  const v = val('--viewport', 'both');
  if (v === 'both') return Object.keys(VIEWPORTS);
  if (!VIEWPORTS[v]) fail(`Unknown --viewport "${v}". Use desktop, mobile or both.`);
  return [v];
})();

/**
 * Read everything the audit compares, for the button at `index`, right now.
 * One evaluate per measurement: the forced pseudo-state lives in the browser,
 * so the read has to happen while it is applied.
 */
const MEASURE = ({ s, i }) => {
  const el = document.querySelectorAll(s)[i];
  if (!el) return null;
  const cs = getComputedStyle(el);
  const before = getComputedStyle(el, '::before');
  const box = el.getBoundingClientRect();
  return {
    color: cs.color,
    background: cs.backgroundColor,
    borders: [cs.borderTopColor, cs.borderRightColor, cs.borderBottomColor, cs.borderLeftColor],
    borderWidths: [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth],
    beforeContent: before.content,
    beforeBg: before.backgroundColor,
    beforeTransform: before.transform,
    outline: [cs.outlineWidth, cs.outlineStyle, cs.outlineColor, cs.outlineOffset],
    textDecoration: cs.textDecorationLine,
    // A flex or grid item is BLOCKIFIED: `display: inline-flex` computes to
    // `flex`, per CSS Display 3 §2.7. That is the spec working, not a rogue
    // rule, and the three hero buttons on /docs/agents/agentic-transactions sit
    // in a `d-flex` row, so a naive equality check reports every one of them.
    // The parent's display decides which value is correct.
    blockified: (() => {
      const p = el.parentElement;
      if (!p) return false;
      const d = getComputedStyle(p).display;
      return d === 'flex' || d === 'inline-flex' || d === 'grid' || d === 'inline-grid';
    })(),
    geometry: {
      paddingTop: cs.paddingTop, paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom, paddingLeft: cs.paddingLeft,
      minHeight: cs.minHeight, minWidth: cs.minWidth,
      borderRadius: cs.borderTopLeftRadius,
      fontSize: cs.fontSize, lineHeight: cs.lineHeight, fontWeight: cs.fontWeight,
      gap: cs.columnGap, display: cs.display, boxSizing: cs.boxSizing,
      whiteSpace: cs.whiteSpace,
      width: Math.round(box.width * 100) / 100,
      height: Math.round(box.height * 100) / 100,
    },
    matchesFocusVisible: el.matches(':focus-visible'),
    /**
     * Whether the element generates a box at THIS viewport.
     *
     * A button whose own `display` is correct can still be unrendered because
     * an ancestor is hidden -- `d-lg-none` wrappers put the mobile copy of a
     * CTA in exactly that state at desktop width. getComputedStyle still
     * answers for such an element, but the answers are meaningless: the
     * ::before has no layout so its transform reads `none`, the outline
     * properties sit at their initial values because :focus-visible can never
     * match, and every one of those looks like a defect.
     *
     * getClientRects() is the test rather than `display`, because the element's
     * own display is not where the truth is.
     */
    rendered: el.getClientRects().length > 0,
  };
};

/**
 * Normalise a spec colour through the browser that produced the actual value,
 * so `transparent`, `#21E46B` and an 8-digit alpha all land in the same form as
 * getComputedStyle returns. Writing a parser here would be a second
 * implementation to keep in step with Chrome's serialisation.
 */
const NORMALISE = values => {
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;left:-9999px';
  document.body.appendChild(probe);
  const out = {};
  for (const v of values) {
    probe.style.color = '';
    probe.style.color = v;
    out[v] = getComputedStyle(probe).color;
  }
  probe.remove();
  return out;
};

async function auditPage(browser, url) {
  const findings = [];
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('dialog', d => d.dismiss().catch(() => {}));

  try {
    const resp = await page.goto(BASE + url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (!resp || resp.status() !== 200) throw new Error(`HTTP ${resp ? resp.status() : 0}`);

    // `html.ready` is Realm's hydration signal. Never wait for networkidle --
    // the dev-tools pages hold websockets open and never reach it.
    await page.waitForSelector('html.ready', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1000);

    // The consent widget overlaps page content and can intercept focus.
    await page.evaluate(() => {
      document.querySelectorAll('[class*="osano"],[id*="osano"]').forEach(e => e.remove());
    });

    // Freeze motion. `reducedMotion: 'reduce'` matches the media query that
    // guards §4's transitions, but a stray unguarded transition elsewhere would
    // still let a colour be sampled mid-flight -- and the ::before transform is
    // the whole hover signal, so reading it at scaleY(0.4) is a false failure.
    await page.addStyleTag({
      content: '*,*::before,*::after{transition:none!important;animation:none!important}',
    });

    // Last, so it wins on source order against everything the page shipped.
    if (INJECT) await page.addStyleTag({ content: INJECT });

    const count = await page.evaluate(s => document.querySelectorAll(s).length, SELECTOR);
    if (!count) {
      findings.push({ url, kind: 'empty', reason: `no ${SELECTOR} on the page` });
      return findings;
    }

    const cdp = await ctx.newCDPSession(page);
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');

    let nodeIds = [];
    const resolveNodes = async () => {
      const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
      ({ nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: SELECTOR }));
    };

    /**
     * Node ids go stale when the page re-renders under us -- a late hydration
     * pass, or a websocket-driven tutorial widget replacing its own DOM. CDP
     * then answers "Could not find node with given id" and, before this retry,
     * that killed the whole page's audit. Re-resolve once and try again;
     * failing twice is a real problem worth surfacing.
     */
    const force = async (i, classes) => {
      if (!nodeIds[i]) return;
      try {
        await cdp.send('CSS.forcePseudoState', { nodeId: nodeIds[i], forcedPseudoClasses: classes });
      } catch (e) {
        if (!/Could not find node/.test(e.message)) throw e;
        await resolveNodes();
        if (!nodeIds[i]) return;
        await cdp.send('CSS.forcePseudoState', { nodeId: nodeIds[i], forcedPseudoClasses: classes });
      }
    };

    for (const vp of VIEWPORT_NAMES) {
      await page.setViewportSize(VIEWPORTS[vp]);
      await page.waitForTimeout(400);

      // Re-resolve after the resize. Node ids survive a viewport change today,
      // but re-querying costs one round trip and removes the assumption.
      await resolveNodes();

    for (const theme of THEMES) {
      const mode = theme;
      await page.evaluate(t => {
        try {
          localStorage.setItem('user-prefers-color', t);
          localStorage.setItem('colorSchema', t);
        } catch { /* private mode */ }
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(t);
      }, theme);
      await page.waitForTimeout(250);

      const cls = await page.evaluate(() => document.documentElement.className);
      if (!new RegExp(`\\b${theme}\\b`).test(cls)) {
        findings.push({ url, kind: 'error', reason: `theme "${theme}" did not apply (html class "${cls}")` });
        continue;
      }

      for (let i = 0; i < count; i++) {
        const info = await page.evaluate(({ s, i }) => {
          const el = document.querySelectorAll(s)[i];
          return {
            label: (el.textContent || '').trim().slice(0, 48),
            classes: [...el.classList],
            tag: el.tagName.toLowerCase(),
            href: el.getAttribute('href'),
            // The PROPERTY, not the attribute. Markup may ship
            // `disabled="disabled"`, but the tutorial engine sets it with
            // jQuery's .prop("disabled", true), which never writes an
            // attribute -- so hasAttribute() misses every JS-gated control.
            alreadyDisabled: el.disabled === true || el.classList.contains('bds-btn--disabled'),
            alreadyLoading: el.classList.contains('bds-btn--loading'),
            alreadyInactive: el.getAttribute('aria-disabled') === 'true',
          };
        }, { s: SELECTOR, i });

        // Classes win where present; --assume fills in only what is missing, so
        // a run can mix component-rendered and mixin-styled buttons.
        const mod = n => info.classes.filter(x => x.startsWith('bds-btn--')).map(x => x.slice(9)).find(x => n.includes(x));
        const group = mod(GROUPS) || ASSUME?.group;
        const emphasis = mod(EMPHASES) || ASSUME?.emphasis;
        const context = mod(CONTEXTS) || ASSUME?.context;
        const id = { url, theme, vp, index: i, label: info.label, tag: info.tag, group, emphasis, context };

        // Not rendered here -- an ancestor is hidden at this width. Measuring it
        // yields a page of mismatches that describe the browser's initial
        // values, not the component. Record the skip so a green run cannot be
        // read as "everything was checked".
        if (!(await page.evaluate(({ s, i }) => document.querySelectorAll(s)[i].getClientRects().length > 0, { s: SELECTOR, i }))) {
          findings.push({ ...id, kind: 'skipped', reason: `not rendered at ${vp}` });
          continue;
        }

        if (!group || !emphasis || !context) {
          findings.push({
            ...id, kind: 'unclassified',
            reason: `cannot resolve axes from classes: ${info.classes.join(' ')}`
              + (ASSUME ? '' : ' — pass --assume group/emphasis/context if this is mixin-styled'),
          });
          continue;
        }

        // Every spec colour this button could need, normalised once.
        const wanted = new Set();
        for (const st of [...STATES, ...SYNTHETIC_STATES]) {
          const e = expectedFor({ group, emphasis, context, mode }, st === 'inactive' ? 'rest' : st);
          if (!e) continue;
          for (const v of [e.color, e.background, e.border, e.beforeBg]) if (v) wanted.add(v);
        }
        wanted.add(SPEC.ring[context][mode]);
        const norm = await page.evaluate(NORMALISE, [...wanted]);

        /**
         * A button that is ALREADY disabled has exactly one reachable state.
         *
         * §4 excludes disabled from the engaged swap
         * (`&:hover:not(:disabled)`), and a disabled control is out of the tab
         * order, so hover, active and focus-visible cannot occur. Measuring
         * them anyway compares the disabled palette against rest's and reports
         * a wall of mismatches that say nothing -- which is exactly what the
         * first genuinely-disabled button on the site produced.
         */
        const states = info.alreadyDisabled
          ? ['disabled']
          : [...STATES, ...(SYNTHETIC ? SYNTHETIC_STATES : [])];
        const geometries = {};

        for (const state of states) {

          // --- put the button in the state -----------------------------------
          let cleanup = null;
          if (state === 'hover') await force(i, ['hover']);
          else if (state === 'active') await force(i, ['hover', 'active']);
          else if (state === 'focus-visible') {
            // Keyboard modality first, or Chromium treats .focus() as
            // programmatic and :focus-visible never matches.
            await page.keyboard.press('Tab');
            await page.evaluate(({ s, i }) => document.querySelectorAll(s)[i].focus(), { s: SELECTOR, i });
          } else if (state === 'disabled' && !info.alreadyDisabled) {
            await page.evaluate(({ s, i }) => document.querySelectorAll(s)[i].classList.add('bds-btn--disabled'), { s: SELECTOR, i });
            cleanup = () => page.evaluate(({ s, i }) => document.querySelectorAll(s)[i].classList.remove('bds-btn--disabled'), { s: SELECTOR, i });
          } else if (state === 'inactive') {
            await page.evaluate(({ s, i }) => document.querySelectorAll(s)[i].setAttribute('aria-disabled', 'true'), { s: SELECTOR, i });
            cleanup = () => page.evaluate(({ s, i }) => document.querySelectorAll(s)[i].removeAttribute('aria-disabled'), { s: SELECTOR, i });
          }

          const m = await page.evaluate(MEASURE, { s: SELECTOR, i });
          const synthetic = (state === 'disabled' && !info.alreadyDisabled) || (state === 'inactive' && !info.alreadyInactive);

          // --- compare -------------------------------------------------------
          // `inactive` is specified to be indistinguishable from rest; that is
          // the point of it existing separately from disabled, so it is compared
          // against rest rather than getting its own row in the palette.
          //
          // Two markup states PIN the appearance, so which pseudo-class we force
          // stops mattering. Both were reported as defects before this existed,
          // and in both cases the component was right and the audit was wrong —
          // the measured values came out exactly inverted from the expectation,
          // which is the signature of modelling a state that does not apply:
          //
          //   .bds-btn--loading      §4 lists it alongside :hover/:active in the
          //                          engaged selector, so a loading button is
          //                          engaged at rest and stays engaged. Compare
          //                          every non-disabled state against engaged.
          //   aria-disabled="true"   §4's engaged selectors all carry
          //                          :not([aria-disabled='true']), so hover,
          //                          active and focus never engage. Compare
          //                          every non-disabled state against rest.
          //
          // `disabled` still resolves to the disabled group in both cases: §4's
          // disabled block out-ranks the engaged one, and a disabled button is
          // neither loading nor inactive as far as paint is concerned.
          const pinned = info.alreadyLoading ? 'hover' : info.alreadyInactive ? 'rest' : null;
          const expState = state === 'disabled'
            ? 'disabled'
            : pinned || (state === 'inactive' ? 'rest' : state);
          const exp = expectedFor({ group, emphasis, context, mode }, expState);
          const want = k => norm[exp[k]];

          const push = (what, expected, actual) => findings.push({
            ...id, kind: 'mismatch', state, synthetic, what, expected, actual,
          });

          if (m.color !== want('color')) push('label colour', want('color'), m.color);
          if (m.background !== want('background')) push('background', want('background'), m.background);

          const sides = ['top', 'right', 'bottom', 'left'];
          m.borders.forEach((b, s) => {
            if (b !== want('border')) push(`border-${sides[s]} colour`, want('border'), b);
          });

          if (state === 'focus-visible') {
            const [w, style, colour, offset] = m.outline;
            const ring = norm[SPEC.ring[context][mode]];
            if (!m.matchesFocusVisible) {
              findings.push({ ...id, kind: 'error', state, reason: ':focus-visible did not match; the focus row is unreliable' });
            }
            if (w !== SPEC.geometry['focus-width']) push('outline width', SPEC.geometry['focus-width'], w);
            if (style !== 'solid') push('outline style', 'solid', style);
            if (offset !== SPEC.geometry['focus-offset']) push('outline offset', SPEC.geometry['focus-offset'], offset);
            if (colour !== ring) push('focus ring colour', ring, colour);
          } else if (m.outline[1] !== 'none' && m.outline[0] !== '0px') {
            push('outline (should be absent outside focus-visible)', 'none', `${m.outline[0]} ${m.outline[1]}`);
          }

          // --- the rise ------------------------------------------------------
          // Disabled sets `content: none`, so there is no ::before box at all.
          if (exp.rise === 'none') {
            if (m.beforeContent !== 'none') {
              push('::before (disabled must remove it)', 'none', m.beforeContent);
            }
          } else {
            if (m.beforeBg !== norm[exp.beforeBg]) push('::before background', norm[exp.beforeBg], m.beforeBg);
            // scaleY(0) serialises as matrix(1,0,0,0,0,0); scaleY(1) as `none`
            // or matrix(1,0,0,1,0,0) depending on whether the transform is still
            // declared. Compare the y-scale itself rather than the string.
            const y = parseTransformY(m.beforeTransform);
            const wantY = exp.rise === 'up' ? 1 : 0;
            if (Math.abs(y - wantY) > 0.01) {
              push(`::before rise (scaleY)`, String(wantY), `${y} — "${m.beforeTransform}"`);
            }
          }

          // --- type ----------------------------------------------------------
          const wantDecoration = emphasis === 'subtle' ? 'underline' : 'none';
          if (m.textDecoration !== wantDecoration) push('text-decoration', wantDecoration, m.textDecoration);

          geometries[state] = { geometry: m.geometry, borderWidths: m.borderWidths, blockified: m.blockified };
          if (cleanup) await cleanup();
          await force(i, []);
          await page.evaluate(() => document.activeElement?.blur());
        }

        // --- geometry ---------------------------------------------------------
        // "Geometry never varies: padding, the 40px minimums and the 1px border
        // are identical on every combination and every state." Checked against
        // the spec once, then for invariance across the rest -- a hover rule
        // that changes padding is a different defect from a wrong constant.
        // Normally `rest` is the baseline. An already-disabled button never has
        // one -- disabled is its only reachable state -- so fall back to
        // whichever single state was measured. Geometry is invariant across
        // states by spec, so any of them is a valid baseline.
        const baseline = geometries.rest ? 'rest' : Object.keys(geometries)[0];
        const rest = geometries[baseline];
        if (!rest) continue;
        const px = v => (v.endsWith('rem') ? `${parseFloat(v) * 16}px` : v);
        const labelPx = parseFloat(px(SPEC.geometry['label-size']));
        const geoWant = {
          paddingTop: px(SPEC.geometry['pad-y']), paddingBottom: px(SPEC.geometry['pad-y']),
          paddingLeft: px(SPEC.geometry['pad-x']), paddingRight: px(SPEC.geometry['pad-x']),
          minHeight: SPEC.geometry['min-height'], minWidth: SPEC.geometry['min-width'],
          borderRadius: SPEC.geometry.radius,
          fontSize: px(SPEC.geometry['label-size']),
          // line-height is a RATIO, not a length. Converting it to px is the
          // trap Button.scss documents, so resolve it the way the browser does.
          lineHeight: `${labelPx * parseFloat(SPEC.geometry['label-line-height'])}px`,
          fontWeight: emphasis === 'subtle' ? '500' : '400',
          gap: px(SPEC.geometry.gap),
          display: rest.blockified ? 'flex' : 'inline-flex',
          boxSizing: 'border-box', whiteSpace: 'nowrap',
        };
        for (const [k, v] of Object.entries(geoWant)) {
          if (rest.geometry[k] !== v) {
            findings.push({ ...id, kind: 'mismatch', state: baseline, what: `geometry: ${k}`, expected: v, actual: rest.geometry[k] });
          }
        }
        // The border is on every variant, including the ones whose stroke
        // resolves transparent, so the box model does not shift with emphasis.
        rest.borderWidths.forEach((w, s) => {
          if (w !== SPEC.geometry['border-width']) {
            findings.push({
              ...id, kind: 'mismatch', state: 'rest',
              what: `geometry: border-${['top', 'right', 'bottom', 'left'][s]}-width`,
              expected: SPEC.geometry['border-width'], actual: w,
            });
          }
        });
        for (const [state, other] of Object.entries(geometries)) {
          if (state === baseline) continue;
          for (const k of Object.keys(rest.geometry)) {
            if (other.geometry[k] !== rest.geometry[k]) {
              findings.push({
                ...id, kind: 'mismatch', state,
                what: `geometry changed from rest: ${k}`,
                expected: String(rest.geometry[k]), actual: String(other.geometry[k]),
              });
            }
          }
        }

        // Always recorded, so the summary counts every button audited rather
        // than only the ones that failed -- a clean run reporting "0 buttons"
        // looks identical to a run that found nothing to measure.
        findings.push({ ...id, kind: 'measured', states: Object.keys(geometries).length });
      }
    }
    }
  } catch (e) {
    findings.push({ url, kind: 'error', reason: e.message });
  } finally {
    await ctx.close().catch(() => {});
  }
  return findings;
}

/** scaleY out of a computed transform matrix. `none` means no transform at all. */
function parseTransformY(t) {
  if (!t || t === 'none') return 1;
  const m = /^matrix\(([^)]+)\)$/.exec(t);
  if (m) return parseFloat(m[1].split(',')[3]);
  const m3 = /^matrix3d\(([^)]+)\)$/.exec(t);
  if (m3) return parseFloat(m3[1].split(',')[5]);
  return NaN;
}

// ------------------------------------------------------------------- report

const browser = await launchBrowser();
const all = [];
for (const url of urls) all.push(...await auditPage(browser, url));
await browser.close();

if (AS_JSON) {
  console.log(JSON.stringify(all, null, 2));
  process.exit(all.some(f => f.kind === 'mismatch' || f.kind === 'error') ? 1 : 0);
}

const mismatches = all.filter(f => f.kind === 'mismatch');
const errors = all.filter(f => f.kind === 'error' || f.kind === 'unclassified' || f.kind === 'empty');

console.log(`\n${bold('Button spec audit')}  ${dim(BASE)}\n`);

for (const url of urls) {
  const mine = all.filter(f => f.url === url);
  if (!mine.length) continue;
  const bad = mine.filter(f => f.kind === 'mismatch' || f.kind === 'error' || f.kind === 'unclassified' || f.kind === 'empty');
  console.log(`${bad.length ? red('✗') : green('✓')} ${bold(url)}`);

  // One heading per button, both themes underneath, so a defect that appears in
  // only one mode reads as exactly that.
  const buttons = [...new Set(mine.filter(f => f.index !== undefined).map(f => `${f.index}`))]
    .sort((a, b) => a - b);

  for (const bi of buttons) {
    const rows = mine.filter(f => String(f.index) === bi);
    const first = rows[0];
    const axes = `${first.group}/${first.emphasis} ${dim(first.context)}`;
    const problems = rows.filter(f => f.kind === 'mismatch' || f.kind === 'error' || f.kind === 'unclassified');
    const mark = problems.length ? red('✗') : green('✓');
    console.log(`  ${mark} ${cyan(`[${bi}]`)} ${first.label || dim('(no label)')}  ${dim(`<${first.tag}>`)} ${axes}`);

    // A button hidden at one width is not a pass there. Say so on its own
    // line, once per viewport, rather than letting the ✓ imply full coverage.
    const skips = [...new Set(rows.filter(f => f.kind === 'skipped').map(f => f.vp))];
    for (const vp of skips) {
      const measuredElsewhere = rows.some(f => f.kind === 'measured' && f.vp !== vp);
      console.log(`      ${dim(`skipped at ${vp} — not rendered${measuredElsewhere ? '' : yellow(' (never measured at any width)')}`)}`);
    }

    for (const vp of VIEWPORT_NAMES) {
      for (const theme of THEMES) {
        const t = problems.filter(f => f.theme === theme && f.vp === vp);
        if (!t.length) continue;
        console.log(`      ${bold(theme)} ${dim(`· ${vp}`)}`);
        for (const f of t) {
          if (f.kind !== 'mismatch') {
            console.log(`        ${red('!')} ${f.state ? `${f.state}: ` : ''}${f.reason}`);
            continue;
          }
          const tag = f.synthetic ? dim(' SYNTHETIC') : '';
          console.log(`        ${red('✗')} ${yellow(f.state)}${tag}  ${f.what}`);
          console.log(`            want ${swatch(f.expected)} ${f.expected}`);
          console.log(`            got  ${swatch(f.actual)} ${magenta(f.actual)}`);
        }
      }
    }
  }
  console.log('');
}

for (const e of errors.filter(f => f.index === undefined)) {
  console.log(`${red('!')} ${e.url}: ${e.reason}`);
}

const buttonsSeen = new Set(all.filter(f => f.index !== undefined).map(f => `${f.url}#${f.index}`)).size;

// A button skipped at every viewport was never actually checked. That has to
// reach the summary line, or a run that measured nothing reads as a pass.
const measuredAnywhere = new Set(all.filter(f => f.kind === 'measured').map(f => `${f.url}#${f.index}`));
const neverMeasured = [...new Set(all.filter(f => f.kind === 'skipped').map(f => `${f.url}#${f.index}`))]
  .filter(k => !measuredAnywhere.has(k));
if (neverMeasured.length) {
  console.log(`${yellow('!')} ${neverMeasured.length} button${neverMeasured.length === 1 ? ' was' : 's were'} never rendered at any audited width, so ${neverMeasured.length === 1 ? 'it was' : 'they were'} not checked.\n`);
}

const summary = mismatches.length
  ? red(`${mismatches.length} mismatch${mismatches.length === 1 ? '' : 'es'}`)
  : green('no mismatches');
console.log(`${bold('Summary')}  ${buttonsSeen} button${buttonsSeen === 1 ? '' : 's'} · ${VIEWPORT_NAMES.join('+')} · ${THEMES.length} theme${THEMES.length === 1 ? '' : 's'} · ${STATES.length + (SYNTHETIC ? SYNTHETIC_STATES.length : 0)} states · ${summary}\n`);

process.exit(mismatches.length || errors.length ? 1 : 0);
