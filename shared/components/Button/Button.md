# Button

Built from the Figma-derived specification. Appearance is three axes —
`intention` × `context` × `emphasis` — bound straight to the token groups.
Geometry never varies: padding, the 40px minimums and the 1px border are
identical on every combination and every state.

Live at `/button-demo` — every combination, every state, on all three surfaces.

## Provenance

Every value comes from `github.com/samiamdesigns/pd-xrpl-developer-docs`:
`components/button.md` (the axes and the reasoning), `components/button.json`
(values resolved per mode), `components/button-examples.md` (the acceptance
checklist), plus `accessibility/focus-indicators.md`,
`implementation/icons-that-inherit-colour.md` and
`implementation/font-stacks.md`.

The colour matrix in `Button.scss` §2 was generated rather than transcribed and
verified back against `button.json`: all 270 values, both modes, no RGB
mismatch.

## API

```tsx
<Button>Get started</Button>

<Button intention="neutral" emphasis="standard">Learn more</Button>
<Button context="on-saturated">On a green block</Button>
<Button href="/docs" target="_blank">Read the docs</Button>
<Button loading>Submitting…</Button>
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
leaves the ring at its default renders perfectly.

### `neutral` + `on-saturated` does not compile

There are no tokens for it. The props are a discriminated union, so that
combination is a type error rather than a runtime surprise.

### Two `strong` buttons must not share a container

Emphasis is what says which action is primary. No checker catches this — a row
of identical `strong` buttons is contrast-clean and still wrong.

## States

Six states, three appearances. `hover`/`pressed`/`loading` resolve
byte-identically and `inactive` == `rest`, in all 15 combinations, in both
modes.

| Appearance | States |
|---|---|
| Resting | `rest`, `inactive` |
| Engaged | `hover`, `pressed`, `loading` |
| Disabled | `disabled` — its own group |

They stay separate code paths, because what distinguishes them is behaviour:

| | ARIA | tab order | activates |
|---|---|---|---|
| `loading` | `aria-busy` | in | no |
| `inactive` | `aria-disabled` | **in** | no |
| `disabled` | native `disabled` | **out** | no |

Collapsing `inactive` into `disabled` removes it from the tab order, and a
screen-reader user can then no longer find it.

**`disabled` is chosen by context alone** — not by intention, not by emphasis.
Emphasis only selects the shape: `strong` keeps fill and border, `standard`
drops the fill, `subtle` drops both.

## Anchor paint

`href` renders an `<a>`, so every bare `a` rule on the site applies to it —
Bootstrap's, the theme's, and any container styling its own anchors.
`Button.scss` §5 out-specifies them with a doubled class,
`a.bds-btn.bds-btn:link` and the other four link pseudo-classes.

**Do not collapse those into `:is()`.** PurgeCSS drops any rule whose selector
contains `:is()` or `:where()`, so the tidy form compiles, works in
`realm develop`, and vanishes from the production bundle — leaving anchor
buttons painted as links. §5 is also deliberately unlayered, since everything
above it sits in `@layer bds-btn.*`.

## Not from the token set

- **The background rise** — a `::before` scaling from `bottom center`. The spec
  says hover swaps the whole triplet; the rise is only *how* the fill arrives.
- **The animated arrow**, with the motion inside the icon's own viewBox so the
  button's geometry never changes on hover.
- Motion values: 150ms, `cubic-bezier(0.98, 0.12, 0.12, 0.98)`.

## Deliberate deviations from the spec

| Deviation | Why |
|---|---|
| `intention` is optional | `button.md`'s printed union marks it required, which would reject `<Button>Get started</Button>` — the zero-prop default its own examples show. `button.json` records `"default": "brand"`. **Reported upstream.** |
| Loader glyph is `LoaderIcon` | The spec's glyph is an explicit placeholder and asks us to pick one and report back. **This is the choice to report.** |
| The loader slows under reduced motion rather than stopping | Freezing it removes the only signal that anything is happening. `aria-busy` covers assistive technology; nothing covers a sighted user watching a motionless spinner. |
| Alpha comes from `_colors.scss`, not `button.json` | The JSON rounds alpha to 2dp; `_colors.scss` carries the generated 8-digit Radix value the tokens are built from. 57 of 270 values differ by up to 1.2/255 of alpha. No RGB channel differs anywhere. |

## Where the colours come from

**Every colour in the palette is a variable from `styles/_colors.scss`** — not
one hex literal in the map. `_colors.scss` already carries the generated Radix
scales the tokens are built from, so binding the variables is shorter and truer
than copying numbers, and a palette change propagates on its own.

The pairs double as documentation: `($sage-12, $sage-dark-12)` reads as "step 12
of the neutral scale, per mode", and the on-inverse groups visibly swap them.

Three exceptions, commented in the file: the focus ring's `#111111` and
`#000000` come from `mode-color.focus-indicator.*`, a token family with no
counterpart in any scale the site carries. White binds `$white`.

To change a colour, edit the map in §2 — one `@each` loop emits all 30 rules.
To re-derive it, re-resolve `button.json`; if `button.md` and `button.json`
disagree, **neither wins**, re-resolve from the token set.

## Traps

- **`line-height: 1` is a ratio, not `1px`.** `button.md` reversed this on
  2026-08-17; converting it is the documented trap.
- **`on-inverse` is not a mode-swap of its base group.** 104 of 108 values
  survive that shortcut and 4 border values do not, so it is emitted literally.
- **PurgeCSS.** The group/emphasis/context classes are composed from props at
  runtime and emitted from a Sass loop, so they appear as literals nowhere.
  `postcss.config.cjs` safelists `/^bds-btn/` and `/^bds-icon/`; without them
  the production build silently strips the component.
- **`:where(html.dark)` in §4 is load-bearing.** A bare `html.dark` selector
  outranks the state swaps and leaves disabled buttons with their resting fill
  in dark mode only.