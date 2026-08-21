# RebrandButton

A rebuild of `Button` from the Figma-derived specification, kept alongside the
original so the two can be compared on maintainability and organisation.

If adopted, it will be renamed "Button" and all rb-btn ("rebrand-button") classes in styles and postcss must be renamed too.

**This is a bakeoff, not a migration.** Nothing currently rendering uses it, and
`shared/components/Button/` is untouched.

## Provenance

Every value comes from `github.com/samiamdesigns/pd-xrpl-developer-docs`:

| File | What it gave us |
|---|---|
| `components/button.md` | The axes, the reasoning, and which token to bind |
| `components/button.json` | Every value resolved per mode |
| `components/button-examples.md` | The acceptance checklist |
| `accessibility/focus-indicators.md` | Focus, specified once for the whole system |
| `implementation/icons-that-inherit-colour.md` | The icon rules |
| `implementation/font-stacks.md` | The sans stack to compose |

The colour matrix in `RebrandButton.scss` §2 was generated rather than
transcribed, and the built CSS was verified back against `button.json` — all
270 values, both modes, no RGB mismatch.

## Live at

`/about/rebrand-button-comparison` — a dev harness, not in `sidebars.yaml`.

## API

```tsx
<RebrandButton>Get started</RebrandButton>

<RebrandButton intention="neutral" emphasis="standard">Learn more</RebrandButton>
<RebrandButton context="on-saturated">On a green block</RebrandButton>
<RebrandButton href="/docs" target="_blank">Read the docs</RebrandButton>
<RebrandButton loading>Submitting…</RebrandButton>
```

| Prop | Values | Default |
|---|---|---|
| `intention` | `brand` · `neutral` | `brand` |
| `context` | `on-theme` · `on-inverse` · `on-saturated` | `on-theme` |
| `emphasis` | `strong` · `standard` · `subtle` | `strong` |
| `loading` | boolean — `aria-busy`, activation suppressed, indicator shown | `false` |
| `inactive` | boolean — `aria-disabled`, **stays in the tab order** | `false` |
| `disabled` | boolean — native `disabled`, leaves the tab order | `false` |
| `href` / `target` | renders an `<a>` | — |
| `iconStart` / `iconEnd` | decorative, `aria-hidden` | `iconEnd` = the XRPL arrow |
| `hideIconEnd` | boolean — suppress the trailing arrow | `false` |

### `context` is the axis to get right

Each context is measured against a different backdrop, so choosing the wrong one
is the likeliest way to produce a button that looks plausible and fails
contrast. It also drives the focus-ring colour, and **nothing will tell you if
that is wrong** — a button that takes `context="on-inverse"` for its paint and
leaves the ring at its default renders perfectly. No screenshot diff catches it.

### `neutral` + `on-saturated` does not compile

There are no tokens for it. The props are a discriminated union rather than
three enums, so that combination is a type error rather than a runtime
surprise. Verified:

```
Type '"on-saturated"' is not assignable to type '"on-inverse" | "on-theme" | undefined'.
```

### Two `strong` buttons must not share a container

Emphasis is what says which action is primary. No checker catches this — every
emphasis passes its own pairings, so a row of identical `strong` buttons is
contrast-clean and still wrong.

## States

Six states, three appearances. `hover`/`pressed`/`loading` resolve
byte-identically and `inactive` == `rest`, in all 15 combinations, in both
modes — verified against `button.json`, not assumed.

| Appearance | States |
|---|---|
| Resting | `rest`, `inactive` |
| Engaged | `hover`, `pressed`, `loading` |
| Disabled | `disabled` — its own group |

They are still separate code paths, because what distinguishes them is
behaviour:

| | element | ARIA | tab order | activates |
|---|---|---|---|---|
| `loading` | `<button>` | `aria-busy` | in | no |
| `inactive` | `<button>` | `aria-disabled` | **in** | no |
| `disabled` | `<button>` | native `disabled` | **out** | no |

Collapsing `inactive` into `disabled` removes it from the tab order, and a
screen-reader user can then no longer find it.

**`disabled` is chosen by context alone** — not by intention and not by
emphasis. `action.button.<group>.<emphasis>.disabled.*` resolves to nothing.
Emphasis only selects the *shape*: `strong` keeps fill and border, `standard`
drops the fill, `subtle` drops both.

## The icon contract

**Icons own their animation. Consumers own only the trigger.**

`XrplArrowInternalLink` is drawn as two elements (shaft + head) inside a
travelling `<g>`, because the design system names this arrow as one that must
not be flattened — a single-path replacement renders correctly and silently
loses the animation. Verified byte-identical to the original single path at
rest.

**The tail animates to nothing.** Fully engaged, the tail has zero extent and
what remains is the head alone — design's `arrowhead_internal` shape, used
unmodified. That is the whole reason the tail is a separate path: a single shape
cannot have one end retract.

**Every moving part is inside the SVG.** The `<g>` translates and the tail
scales, both in viewBox user units; the `<svg>` element itself is never
transformed. So the icon's box is identical whether it is animating or not, it
cannot nudge the text beside it, and nothing escapes its bounds.

**Both link arrows read the same property**, so one trigger drives either.
`XrplArrowExternalLink` is built the same way — head is `arrowhead_external`
(the corner bracket), tail is the diagonal. Both advance horizontally only.
Its tail is a 45&deg; bar, so it retracts via
`rotate(-45deg) scaleX() rotate(45deg)` about its head end; a plain scale would
thin it instead of shortening it.

Each travel distance puts the head flush against the viewBox edge it points at,
which is also the entire budget the artwork allows: 1.6884 units for the
internal arrow (tip at x=22.3116), 5 units for the external one (bracket at
x 9–19).

The whole contract is one custom property, and it is not arrow-specific:

```
--bds-icon-engaged   0 (default, static) … 1 (engaged)
```

It names the **cause, not the effect**, and that is the point. A button knows
its own hover, focus and pressed states; it does not know which icon it
contains, so it is in no position to say what should happen — only that it is
engaged. Each icon decides what engagement means for it: the link arrows
advance and shed their tails, and an icon with no stylesheet of its own ignores
the signal and stays static. Every icon component carries a `bds-icon` base
class, so a button can hold any of them and the wiring is unchanged.

The consumer API is one mixin, taking no arguments:

```scss
.card:hover             { @include bds-icon-engaged; }
.nav-item[aria-current] { @include bds-icon-engaged; }

.rb-btn:hover, .rb-btn:focus-visible {
  .rb-btn__icon { @include bds-icon-engaged; }   // the icon is wrapped
}
```

It emits `> .bds-icon`, so it must go on the icon's actual parent — which is
not always the element carrying the state. RebrandButton wraps every icon in
`.rb-btn__icon`, so the `@include` sits there rather than on `&`.

The rest value is `0`, so an icon dropped into a heading or a table cell is
static and costs nothing. The motion lives in `shared/components/Icons/` — one
stylesheet per icon component, plus `shared.scss` for the shared contract.

No `@property` registration is needed: the property is never itself
interpolated — it feeds a `transform`, which is already animatable.

**Reach is the sharp edge, and it bites twice.** Custom properties inherit, so
a container that just sets the property on itself reaches every icon anywhere
below it. The icon guards against that: `.bds-icon` declares the rest value on
itself, and a declared value always beats an inherited one, so
`.thing:hover { --bds-icon-engaged: 1 }` does nothing at all.

Neutralising that hand-written form is the guard's *only* job — the mixin never
emits it, so the guard is purely a defence against bypassing the mixin. Icons
are static by default because each per-icon stylesheet reads
`var(--bds-icon-engaged, 0)`, not because of the guard.

The obvious repair — `.thing:hover .bds-icon { … }` — has the **same** reach
in a different disguise, because a descendant selector also matches at any
depth. A hovered card would engage the arrow inside a button nobody is pointing
at, which is the failure the guard exists to prevent.

Hence the child combinator. `> .bds-icon` reaches one level and stops, so a
nested component's icons are structurally out of range — no marker classes, no
naming convention, and nothing for a consumer to pass or get wrong.

It also **fails in the safe direction**. Put the `@include` too high and the
selector matches nothing: no animation, obvious the first time anyone hovers
it. Every alternative here fails the other way, animating an icon that is not
yours while the page renders perfectly. The contract lives in
`shared/components/Icons/shared.scss`.

For a value driven by React state rather than a CSS state, pass it through the
icon's `style` prop — an inline declaration on the icon element outranks the
rest value, where a wrapper element would be shadowed by it.

### The loader is the other half of the same idea

`LoaderIcon` also owns its animation, but takes **no trigger at all**. The arrow
needs one because "engaged" is a state of whatever contains it; a spinner has
no such ambiguity — rendering it *is* the stimulus. It animates from the moment
it appears, and the button neither starts nor configures it.

Two properties of the motion are deliberate:

- **Stepped, not swept.** The glyph is eight ticks at 45&deg;, so the rotation is
  quantised with `steps(8)`. Every tick lands exactly where its neighbour was
  and the ring stays in register. A continuous rotation leaves the ticks between
  their own positions for seven eighths of every cycle.
- **Counter-clockwise.** Tick opacity descends clockwise from the brightest at
  12 o'clock, so the bright end is the head and the fade is the tail. Turning
  clockwise drives the head into its own trail.

Verified by sampling the computed transform across a full cycle: eight distinct
angles, every one an exact multiple of 45&deg;, none in between.

## Carried over from Button, not from the token set

Two behaviours are not in the specification and were kept deliberately:

- **The background rise.** A `::before` scaling from `bottom center`. The spec
  says hover swaps the whole triplet to the engaged treatment; the rise is only
  *how* the fill half of that swap arrives.
- **The animated arrow**, with one change: it no longer alters the button's
  geometry. The current Button animates padding and gap on hover and reflows;
  the spec fixes both, so the motion moved inside the icon's own viewBox.
  Measured on hover: height, padding and gap unchanged, and the `<svg>`
  element's own transform is `none`.

Motion values (150ms, `cubic-bezier(0.98, 0.12, 0.12, 0.98)`) also come from
Button, so the two are comparable on equal terms.

## Deliberate deviations from the spec

| Deviation | Why |
|---|---|
| `intention` is optional | `button.md`'s printed union marks it required, which would reject `<RebrandButton>Get started</RebrandButton>` — the zero-prop default its own examples show. `button.json` records `"default": "brand"`. The examples and the JSON agree; the printed union is the outlier. **Reported upstream.** |
| Loader glyph is `LoaderIcon` | The spec's glyph is an explicit placeholder and asks us to pick one and report back. **This is the choice to report** — an eight-tick ring, stepped counter-clockwise at 100ms per tick. |
| The loader slows under reduced motion rather than stopping | Freezing it removes the only visual signal that anything is happening. `aria-busy` covers assistive technology; nothing covers a sighted user watching a motionless spinner. A stepped ring at 3 ticks/second is already low motion. |
| Alpha values come from `_colors.scss`, not `button.json` | `button.json` rounds alpha to two decimals; `_colors.scss` carries the generated 8-digit Radix value the token set is actually built from. Binding the variable means 57 of 270 values differ from the JSON by up to **1.2/255 of alpha**. `button.md` is explicit that `button.json` is hand-written and that a disagreement means re-resolving rather than picking a file, so the generated scale wins. No RGB channel differs anywhere. |

## Where the colours come from

**Every colour in the palette is a variable from `styles/_colors.scss`.** There
is not one hex literal in the map. That works because `_colors.scss` already
carries the generated Radix scales the design tokens are built from —
`$xrpl-green-*` (generated from brand green `#21E46B`) and `$sage-*`, each with
light, dark and alpha variants. The spec's resolved values *are* those scales,
so binding the variables is both shorter and truer than copying the numbers.

The pairs double as documentation. `($sage-12, $sage-dark-12)` reads as "step 12
of the neutral scale, per mode", and the on-inverse groups visibly swap the two.

Three exceptions, all named and commented in the file: the focus ring's
`#111111` and `#000000` come from `mode-color.focus-indicator.*`, a different
token family with no counterpart in any scale the site carries. (`$sage-dark-1`
is `#101211` — close, and not the same colour.) White binds `$white`.

### Changing a colour

Edit the map in `RebrandButton.scss` §2. One `@each` loop emits all 30 rules
(15 combinations × 2 modes). Nothing else in the file names a colour — and now
that the map holds variables rather than values, a change to the site palette
propagates on its own.

To re-derive the map from source, re-resolve `button.json` — and note the
spec's own rule: if `button.md` and `button.json` disagree, **neither wins**;
re-resolve from the token set.

## Two traps this file already avoids

- **`line-height: 1` is a ratio, not `1px`.** Converting it is the documented
  trap; `button.md` reversed this on 2026-08-17.
- **`on-inverse` is not a mode-swap of its base group.** 104 of 108 values
  survive that shortcut and 4 border values do not, so the on-inverse groups are
  emitted literally.

## Verified

Against a running dev server, in both modes:

- All 270 emitted colour values checked against `button.json`: **0 RGB
  mismatches, 0 missing**. 213 alphas exact; the other 57 differ only because
  the JSON rounds alpha to 2dp, largest divergence 1.2/255
- Geometry: 40px min height/width, 1px border on every variant, 9999px radius,
  `0.5rem 1rem` padding, `0.5rem` gap, `line-height: 16px` (ratio 1 × 1rem)
- Hover: `--bds-icon-engaged: 1`, tail `scaleX(0)` (fully gone), travel group
  `translate(1.6884, 0)` in user units, `<svg>` transform `none`, rise
  `scaleY(1)`, engaged colours applied, **geometry unchanged**
- Focus ring colour tracks `context` (`#111`/`#fff`, `#fff`/`#000`, `#111`/`#000`)
- Disabled resolves by context alone — brand and neutral are byte-identical —
  with all three shapes and the on-saturated opaque-stroke special case
- `inactive` focusable, `disabled` not; `aria-busy` / `aria-disabled` as specified
- `prefers-reduced-motion: reduce` → every transition `0s`; the loader slows
  from 800ms to 2.4s rather than stopping
- Both arrows render byte-identical to their original single-path artwork at
  rest, and byte-identical to design's supplied arrowhead — positioned flush to
  the viewBox edge — when fully engaged. Four comparisons, all exact.
- The loader steps through exactly eight angles, all multiples of 45&deg;, and
  runs with no trigger both inside and outside a button

## Notes for whoever maintains this

**PurgeCSS.** The group/emphasis/context classes are composed from props at
runtime and emitted from a Sass loop, so they appear as literals nowhere in the
codebase. `postcss.config.cjs` safelists `/^rb-btn/` and `/^bds-icon/`. Without
those entries the production build silently strips the entire component.

**`:where(html.dark)` in §4 is load-bearing.** A bare `html.dark` selector
outranks the state swaps and leaves disabled buttons with their resting fill in
dark mode only. The comment in the file explains it; do not simplify it away.

## Out of scope

- Migrating existing `.bds-btn` / `.btn-primary` call sites
- `destructive` and `info` intentions — deliberately absent from the tokens
- The `black` / `forceColor` question, which `button.md` lists as an open client
  decision blocking `Button.scss` edits
- `XrplArrowExternalLink`, which has an analogous animation in the spec and will
  take the same contract
