# Places that should probably be a Link, not a Button

A running list. Each entry is a call site rendering a `subtle` Button where the
design intent looks like navigation, not action.

## Why this list exists

`components/button.md`, under *A subtle Button and a resting Link are the same
colour*:

> `action.button.brand.subtle.rest.label-color` and
> `navigation.link.brand.rest.label-color` are byte-identical in both modes, and
> both are underlined. **Do not use one where the other belongs** — one renders
> `<button>` and acts, the other renders `<a href>` and navigates, and only
> geometry and behaviour tell them apart.
>
> **If both appear in the same block of content, raise it** — a design question,
> not a token defect, and not yet put to the client.

Geometry is half of what separates them, and the spec fixes it: padding is
`0.5rem 1rem` on *every* emphasis, and Button "has no inline variation — it is
always its own box". So a subtle Button stripped of its padding to sit flush
with body text has given up the only visual difference from a Link.

Every entry below was doing exactly that before the migration, via
`forceNoPadding` or a stylesheet override. None of them lost padding in the
migration — the containers now absorb the offset instead — so nothing here is
broken. They are listed because the shape of the call site suggests the wrong
component was reached for.

**These are design questions. Do not convert one without design sign-off** —
`Link` is not merely an unpadded Button; it has its own token group, its own
underline behaviour, and it navigates.

## Candidates

### 1. `FeatureTwoColumn` link stacks

- **Component:** `shared/sections/FeatureTwoColumn/FeatureTwoColumn.tsx`
- **Was:** `forceVariant="tertiary" forceNoPadding`, 3+ links in a block stack
- **Now:** `forceEmphasis="subtle"`, flush edge from `.bds-button-group--block`
- **Seen on:** `/docs`, `/develop`, `/resources`, `/`, `/community`,
  `/docs/use-cases/tokenization`
- **Why it looks like a Link:** a vertical stack of underlined, arrow-suffixed
  text sitting flush with the heading above it. The clearest instance is the
  "Payments" panel on `/docs` — three stacked labels that read as a link list,
  not as three buttons.

### 2. `HeaderHeroPrimaryMedia` secondary CTA

- **Component:** `shared/sections/HeaderHeroPrimaryMedia/_header-hero-primary-media.scss`
- **Was:** a stylesheet override zeroing `padding` on `.bds-btn--tertiary`,
  including `!important` on hover and focus
- **Now:** override removed; the button keeps spec geometry
- **Seen on:** `/docs`
- **Why it looks like a Link:** it is the second of two CTAs — a filled button
  next to an unpadded text label. That pairing is usually "primary action plus
  a link", and the override existed to make the second one stop looking like a
  button.

## Adding to this list

Anything that reaches for a subtle Button and then removes its padding, or that
sits inline in a paragraph, belongs here. Note the component, what the call site
does, which pages show it, and why it reads as navigation.
