# Link

`Link` (`shared/components/Link/Link.tsx`) is the site's anchor component,
built from the BDS Link spec (`components/link.md` / `link.json` /
`link-examples.md` in `pd-xrpl-developer-docs`). It's the only anchor that
should be used for new JSX anchor tags going forward. The old design-system
link, `BdsLink`, is kept intact but unused — see
[`legacy/BdsLink.md`](legacy/BdsLink.md).

A live reference of every variety (size × color group × with/without icon,
light and dark) is at `/link-demo` ([link-demo.page.tsx](../../../link-demo.page.tsx)),
each example labeled with the spec entry it matches.

## Usage

```tsx
import { Link } from 'shared/components/Link';
// or, in files that already import Redocly's routing Link:
import { Link as XrplLink } from 'shared/components/Link';

<Link href="/docs/concepts/" intention="brand" variation="standalone">
  Read More
</Link>

<p>
  Body copy with an <Link href="/docs/">inline link</Link> in a sentence.
</p>
```

`Link` always renders a real `<a href>`. It's for navigation. A clickable
control that performs an action rather than going somewhere is a `Button`,
even if it's meant to look like a link.

## Props

| Prop | Values | Default | Notes |
|---|---|---|---|
| `intention` | `brand` \| `neutral` | `brand` | `brand` = XRPL green. `neutral` = black/white, no distinct hover, sage `:visited`. |
| `context` | `on-theme` \| `on-inverse` \| `on-saturated` | `on-theme` | Which surface the link sits on — controls both color group and focus-ring color. `neutral` + `on-saturated` is a compile-time type error (no such combination exists in the spec). |
| `variation` | `inline` \| `standalone` | `inline` | `inline` sits inside running text: no fixed size (inherits the parent's font-size/line-height), no icon, `display: inline` so it wraps. `standalone` is a link acting as its own element (a card's "Read More", a CTA under a paragraph): fixed size, optional trailing icon, `display: inline-flex`. |
| `size` | `sm` \| `md` \| `lg` | `md` | Only affects `standalone` — `inline` always inherits from its parent. |
| `iconEnd` | `boolean` | `false` | Trailing arrow, from the shared icon set (`shared/components/Icons`) -- `XrplArrowInternalLinkIcon`, or `XrplArrowExternalLinkIcon` when `target="_blank"` is set. Only rendered when `variation="standalone"`; ignored on `inline`. |
| `href` | `string` | — | Required. |

Everything else (`target`, `rel`, `onClick`, `aria-*`, ...) passes through to
the `<a>`.

There's no `disabled` state — the old component had one, but the new spec
forbids it (ADR-XRPL-012): a disabled link is a contradiction, since a link
that can't be followed shouldn't render as a link.

## Color groups → intention × context

| `intention` | `context` | Result |
|---|---|---|
| `brand` | `on-theme` | XRPL green rest/hover, sage `:visited` |
| `brand` | `on-inverse` | Green-on-dark-surface variant (e.g. a link inside a dark card on a light page) |
| `brand` | `on-saturated` | Black-on-green (e.g. a link inside a solid-green banner) |
| `neutral` | `on-theme` | Black (light) / white (dark), flat across hover/active, sage `:visited` |
| `neutral` | `on-inverse` | Neutral tuned for a dark card on a light page |

Every resolved value lives in one place: [`styles/_link-tokens.scss`](../../../styles/_link-tokens.scss)'s
`xrpl-link-colors($group)` mixin. `Link`'s own stylesheet
([`_link.scss`](_link.scss)) just calls it per `--intention` class
(`.xrpl-link--brand`, `.xrpl-link--neutral-on-inverse`, etc.) — it never
hardcodes a color itself. Change a token once here and both `Link` and the
sitewide fallback (below) pick it up.

`neutral`'s `:hover`/`:active` are intentionally flattened to match its rest
color — that's a deliberate design decision (a black link doesn't get a color
change on hover), not an incomplete state. `:visited` is not flattened for
either group and follows the spec's sage values: `neutral` uses `$sage-11`/
`$sage-dark-11` (a muted gray, clearly distinct from rest), `brand` uses
`$sage-12`/`$sage-dark-12` (legitimately near-black/near-white). Both are
correct per spec, not bugs, and can only be seen with real browsing history —
not in an incognito/sandboxed browser, and not on `/link-demo`'s links
directly (see the reset button there, which points every demo link at a
fresh, never-visited URL instead).

## What plain `<a>` tags get (the fallback)

Most of the site's links aren't JSX — they're `[text](url)` or raw
`<a href="...">` inside `.md`/`.mdx` files. Two mechanisms make sure those
still get themed, without every markdown file needing to import a component:

1. **`MarkdownLink` override** — [`@theme/components/MarkdownLink.tsx`](../../../@theme/components/MarkdownLink.tsx)
   replaces Redocly's default renderer for markdoc's `[text](url)` syntax
   (registered in [`@theme/markdoc/components.tsx`](../../../@theme/markdoc/components.tsx)).
   It still renders Redocly's own routing `Link` (so client-side navigation
   keeps working) but stamps it with `Link`'s class scheme via the exported
   `linkClassName()` helper, forced to `intention="neutral" variation="inline"`
   — docs/technical body copy stays black, not brand green, per design
   direction. This covers the overwhelming majority of markdown links
   site-wide with no per-file changes.

2. **CSS-cascade fallback** — [`styles/_content.scss`](../../../styles/_content.scss)'s
   `a:not(.xrpl-link)` rule, scoped to `[data-component-name="Markdown/Markdown"] article`,
   applies the same neutral/on-theme mixins directly. This is the safety net
   for anything the `MarkdownLink` override doesn't reach: raw HTML `<a>`
   embedded directly in a `.md` file (markdoc passes those through as literal
   HTML, bypassing the `link` node entirely) and tag components that render
   their own `<a>` (e.g. `{% child-pages %}` → `ChildPages.tsx`).

Both paths call the exact same `_link-tokens.scss` mixins `Link` itself uses,
so there's one source of truth for color/underline/focus-ring values —
nothing is hand-duplicated.

If you're building raw HTML strings that can't use JSX at all (e.g. a data
array rendered with `dangerouslySetInnerHTML`, like the FAQ answers in
[`about/index.page.tsx`](../../../about/index.page.tsx)), you can opt a
specific link into a non-neutral treatment by writing `linkClassName()`'s
output literally into the string:

```html
<a href="..." class="xrpl-link xrpl-link--inline xrpl-link--md xrpl-link--brand xrpl-link--ctx-on-theme">...</a>
```

Anything without an `xrpl-link` class at all still falls through to the
neutral fallback above — it never renders unstyled.

## Adding a new `:not(.xrpl-link)` site

A handful of older, page/component-scoped stylesheets style `<a>` tags
directly (landing-page body copy, FAQ accordions, card descriptions, etc.),
predating this component. Each one needs a `:not(.xrpl-link)` exclusion so it
doesn't fight the component's own color rules on specificity — otherwise a
`Link` rendered inside that context can get silently overridden (this has
happened several times: `_landings.scss`, `_light-theme.scss`'s separate
`.landing` block, `_pages.scss`'s FAQ rule, `CardTextIconCard.scss`'s
description-link rule). If you add a new CSS rule that targets `a` by tag
inside some content area, exclude `.xrpl-link` from it, the same way the
existing ones do.

## Specificity gotcha: `:where()` and `bds-theme-mode`

`_link-tokens.scss`'s mixins wrap **both** light and dark branches in an
explicit `bds-theme-mode(light)` / `bds-theme-mode(dark)` call — neither is
left as an unscoped default. This isn't stylistic: an unscoped
`.xrpl-link--brand { color: ... }` is `(0,1,0)` specificity, and it loses to
`_light-theme.scss`'s generic `html.light a:where(:not(.bds-link)...)`
fallback, which resolves to `(0,1,2)` — `:where()` zeroes the specificity of
selectors *inside* it, but not `html`/`.light` sitting outside it. Wrapping
both branches the same way brings every `Link` color rule to `(0,2,1)`,
which wins cleanly without `!important`. Keep this pattern if you touch these
mixins.

## Files

- `Link.tsx` — component, types, `linkClassName()` helper
- `_link.scss` — geometry, typography, display, triggers the icon's built-in motion (see below)
- `../Icons` — `XrplArrowInternalLinkIcon` / `XrplArrowExternalLinkIcon`, the trailing arrow itself: artwork, sizing (`1em`, tracks this element's own font-size), and the hover/focus-visible motion, none of which lives in this component. See `shared/components/Icons/shared.scss` for the `bds-icon-engaged` contract and `/icon-demo` for a live reference.
- `../../../styles/_link-tokens.scss` — color/underline/focus mixins (shared with the fallback)
- `../../../@theme/components/MarkdownLink.tsx` — markdown `[text](url)` override
- `../../../styles/_content.scss` — raw-HTML-in-markdown fallback
- `../../../link-demo.page.tsx` — visual reference of every variant
- `legacy/BdsLink.tsx`, `legacy/LinkArrow.tsx` — old component, unused, kept for reference
