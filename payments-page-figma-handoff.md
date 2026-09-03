# XRPL Payments landing page: Figma handoff spec

What this is: a complete description of `docs/use-cases/payments/index.page.tsx` as built, so the
page can be rebuilt or edited in Figma and handed back as a design to implement.

**Source of truth is the code, not this file.** Copy strings below are verbatim from the page.
Where a string came from Hinna's "XRPL Payments Page - Wireframe v2" it is marked with its section
number (S1, S3 and so on). Two strings have no wireframe source and are flagged for sign-off.

Branch: `payments-landing-redesign`. Component library: `origin/design-int-testing-updates`.

---

## 1. Canvas and grid

| | Value |
|---|---|
| Container max width | 1440px (at xl and above) |
| Container side padding | 24px at md, 32px at lg, 112px at xl |
| Grid columns | **8** at sm/md, **12** at lg and above |
| Grid gutter | 8px |
| Breakpoints | sm 576, md 576, lg 992, xl 1280, xxl 1512 |

A `--wide` container variant exists at 1504px (xxl). This page does not use it.

## 2. Type and colour

- **Sans (all UI type): Booton.** `$font-family-sans-serif` resolves to
  `"Booton", "Noto Sans", -apple-system, ...`. Do not substitute Inter.
- **Serif: Tobias.** Confusingly this is `$font-family-monospace`. The smaller tokens in
  `$type-scale` switch to it, so changing a type size can change the typeface.
- Colour tokens live in `styles/_colors.scss`. The page uses `$green-300`, `$lilac-*`,
  `$gray-*`, and `$accent-blue-90`.
- The site is dark by default; light mode is the `html.light` class.

## 3. Page metadata (not visible on the page)

From the wireframe's header block, verbatim. `| XRP Ledger` is appended by the theme.

- **Title:** XRPL Payments Infrastructure
- **Description:** Move money globally on XRPL. Native FX, deterministic settlement in 3-5 seconds,
  sub-cent fees, regulated stablecoins, and protocol-level compliance — the full payments stack on
  one chain.

## 4. Section order

Eleven sections. The colour sequence is deliberate, so that no two adjacent blocks read as the
same component:

```
1   Hero                     media + content
2   Stat band                light-gray
3   Use cases                green
4   AI Starter Kit           lilac
5   Stablecoin map           dark navy panel
6   Compliance               default surface
7   Migration banner         light-gray
8   DIY vs Partner-led       default surface
9   Customers (carousel)     green
10  Learn more               neutral
11  Closing banner           lilac
```

---

## 5. Section detail

### 1. Hero — wireframe S1

`HeaderHeroSplitMedia` · `shared/sections/HeaderHeroSplitMedia/`

- `layout="content-left"`
- **H1:** Move money across borders, on one chain
- **Body:** Native FX, deterministic settlement, sub-cent fees, regulated stablecoins,
  protocol-level compliance, and agent-ready infrastructure. What's usually assembled at the
  application layer, XRPL ships at the protocol layer.
- **Primary CTA:** Build on XRPL → `/docs`
- **Media:** `/img/payments/payments-infrastructure-hero.jpg`, alt "Payments Infrastructure"

Notes for design:
- The eyebrow S1 asks for ("Solutions / Payments and FX") is **dropped**: nothing in the kit
  renders an eyebrow. Same for every other eyebrow on the page (S3, S4, S5, S7, S8).
- S1 asks for an **animated cross-currency routing diagram**. This is the old page's photograph
  standing in, and it is 1500x844 where the Figma spec calls for 800x800.

### 2. Stat band — not in the wireframe

`CardStats` · `shared/sections/CardStatsList/` · `className="payments-stat-band"`

- **Heading:** XRPL payments at a glance  ← **needs PM sign-off, no wireframe source**
- Four cards, `variant="light-gray"`, `span={{ base: 4, md: 4, lg: 3 }}` so one row of four.

| Figure | Label |
|---|---|
| 3-5s | Deterministic settlement |
| <1¢ | 10 drops of XRP per transaction |
| 24/7 | Settlement, no batch cutoffs |
| 100% | Protocol-native compliance |

Notes for design:
- Figures are overridden to **40px / 48px / 56px** (base / lg / xl) by `.payments-stat-band`.
  `CardStat`'s own `statistic` token is `display-lg`, which is 92px desktop and 112px xl and fits
  about four characters. Letter-spacing is overridden alongside it.
- Cards are forced to equal height and top-aligned content. `CardStat` ships
  `min-height` 200/208/298px plus `aspect-ratio: 1/1` at `lg-3`, which produced squares with a
  hole in the middle.
- Labels deliberately carry **no terminal period**.
- Every figure is immutable, so this band never needs maintenance. "106M+ ledgers closed" and
  "1,500 TPS" were both dropped: the first only ever grows, and a row of five does not fit a
  12-column grid.
- "100%" modifies "protocol-native", not "compliance". It does not claim a full compliance
  program runs on ledger. Screening, KYC, travel-rule messaging and monitoring all stay off it.

### 3. Use cases — wireframe S3 + S4 + S5 combined

`StandardCardGroupSection` · `variant="green"` · three cards, `lg: 4` each

- **Heading:** Use cases  ← **needs PM sign-off, no wireframe source**
- Description: empty (not invented)

| Card | Description | CTA |
|---|---|---|
| Cross-border B2B settlement | Atomic FX and settlement, in a single transaction | Read more |
| Card network settlement | 24/7 stablecoin clearing between issuers, networks, and acquirers | Read more |
| Agentic commerce | AI agents transact at machine speed, within rules the chain enforces | Read more |

Card titles are the wireframe's own section names; each description is that section's H2, verbatim.
The nine feature cells, three section bodies and animated visuals from S3/S4/S5 are all dropped.
This is the collapse rflynn proposed and Hinna agreed to, and it answers the wireframe's open
question "Is each use case on a different page? TBD".

**Links are interim.** The three dedicated use-case pages do not exist. Each card currently points
at the nearest existing concept doc:
`/docs/concepts/payment-types/cross-currency-payments`,
`/docs/concepts/tokens/fungible-tokens/stablecoins`,
`/docs/agents/agentic-transactions`.

### 4. AI Starter Kit — wireframe S5's callout

`LinkSmallGrid` · `variant="lilac"`

- **Heading:** XRPL AI Starter Kit
- **Description:** XRPL Docs MCP Server, XRPL Agent Wallet Skill, XRPL Payment Skill, x402 facilitator.
- Three tiles: XRPL Agent Wallet Skill → `/docs/agents/xrpl-agent-wallet-skill`;
  XRPL Payment Skill → `/docs/agents/xrpl-payments-skill`;
  x402 facilitator → `/docs/agents/agentic-payments-x402`

Notes for design:
- Deliberately a **compact tile section, not a full-width banner**. In the wireframe this is a
  callout *inside* S5, subordinate to it. As a banner it competed with the migration and closing
  CTAs below.
- The description names four things but only three are tiles. **XRPL Docs MCP Server has no page
  yet**, so it is named in the sentence and not linked.

### 5. Stablecoin corridor map — wireframe S6

Assembled from `PageGrid` + `SectionHeader` + `StablecoinCorridorMap`, not a section component.

- **Heading:** Regulated stablecoins, issued natively on XRPL
- **Body:** RLUSD is the default USD instrument on XRPL: regulated, institutionally backed,
  deepening as the network's anchor dollar. Pair it with regional native stablecoins for in-region
  settlement.
- `SectionHeader` span `{ base: 12, md: 6, lg: 8 }`; graphic column span `{ base: 12, md: 8, lg: 6 }`

The graphic (`shared/patterns/StablecoinCorridorMap/`):
- Inlined SVG component, 512x409 viewBox, traced from the designer's `Stablecoins.png`.
- **Keeps its dark navy panel in both themes.** A light variant is not possible while the
  highlights stay the designer's colours: `#FCFC06` on a `$gray-100` surface measures 1.01:1, and
  because the labels sit on top of the map, no land value satisfies highlight contrast and 8.6px
  body-copy contrast at the same time. Full measurements are in the component's SCSS.
- All 13 colours are the **designer's originals**, exposed as `--scm-*` custom properties.
- The RLUSD disc carries the real Ripple logomark, taken from `ripple-blueblack.svg`.

Still open on this graphic:
- **No vector source exists.** The designer does not have one; this component is the copy of record.
- **Four icons are still placeholders**: USDC, EURØP, XSGD and AUDD are hand-drawn approximations
  (a `$` in a double ring, a `€` on a disc, and so on), not the real marks. RLUSD is authentic,
  which makes the mismatch more visible than before.
- Why a media component was not used: every media slot in the kit crops. `FeatureTwoColumn`'s is
  `aspect-ratio: 1/1` with `object-fit: cover`, which would cut the RLUSD label off the left edge
  and Australia off the right.

### 6. Compliance — wireframe S7

`CardsTextGrid` · `className="payments-text-cards"`

- **Heading:** Compliance, built in at the protocol
- **Body:** On XRPL, the primitives ship with the protocol. Run gated counterparty pools and
  credentialed venues without writing the gating logic yourself.

| Card | Description |
|---|---|
| Permissioned Domains | Credential-based access control for defined venues. |
| Permissioned DEX | Compliance-gated counterparty pools on the same DEX rail as the rest of the market. |
| Freeze and Clawback | Opt-in issuer controls on issued currencies. |
| Native credential framework | KYC/AML hooks compliance teams configure, not developers code. |

`payments-text-cards` top-aligns the card content. Every card in the kit is
`justify-content: space-between` so a trailing CTA bottom-aligns; these cards have no CTA, so the
description dropped to the bottom and left a gap under each heading that read as a bug.

### 7. Migration banner — wireframe S8

`CalloutMediaBanner` · `variant="light-gray"` · `headingAs="h2"`

- **Heading:** Seven steps from your current stack to XRPL.
- **Subheading:** The migration is mostly inventory, not engineering.
- **CTA:** Read the full migration playbook →
  `/docs/use-cases/payments/migrate-a-payments-or-fx-stack-to-the-xrp-ledger`

Notes for design:
- The **seven-step stepper S8 draws is dropped** (no stepper component in the kit). The H2 names
  the seven steps and the CTA leads to the guide that contains them.
- ⚠️ **Merge order.** The playbook ships on the `payments-fx-migration-guide` branch. If this page
  reaches production first, this CTA is a live 404, and Redocly's link checker does not scan href
  props in `.tsx`, so CI will not catch it.

### 8. DIY vs Partner-led — wireframe S8's two-column footer

`CardsTextGrid` · `className="payments-text-cards"`

- **Heading:** DIY vs Partner-led
- **Build it yourself:** For teams with crypto experience. Access [developer docs](/docs), the
  Payments APIs, and [XRPL tooling](/resources/dev-tools).
- **Work with a partner:** For regulated institutions and complex use cases. Connect with the
  [Discord community](https://discord.com/invite/sfX3ERAMjH).

The wireframe's `[bracketed]` terms are the inline links.

### 9. Customers — wireframe S9

`CarouselCardList` · `variant="green"` · `buttonVariant="green"` · five `CardOffgrid` cards

- **Heading:** Battle-tested by industry leaders
- Description: empty (S9 gives none; the prop is required)

| Card | Description | Links to |
|---|---|---|
| CoinPayments | CoinPayments uses XRPL's fast and low-cost payment rails to enable merchants to accept digital assets globally, with near-instant settlement and minimal transaction fees. | xrpl.org case study |
| Ripple Payments | Ripple Payments enables crypto companies, payment service providers and fintechs to facilitate real-time cross-border payments using stablecoins, digital assets and local currencies — with XRPL as a foundational transaction layer. | ripple.com |
| FriiPay | FriiPay connects XRPL-based crypto wallets to point-of-sale terminals, allowing customers to pay with RLUSD or XRP while helping merchants save costs on card processing fees. | xrpl.org case study |
| Brale | Brale is an end-to-end platform for launching and managing stablecoins, now Brale goes live on XRPL, bringing regulated stablecoin issuance and Ripple USD settlement to businesses | brale.xyz |
| Braza Bank | Braza Bank launched USDB stablecoin on XRPL, backed by Brazilian bonds and fully integrated in customer-facing services such as e-commerce, global purchases and investments | ripple.com press |

Card geometry: 400x480 desktop, 356x440 tablet, 343x400 mobile. 8px gap. Icon slot is an 84px
container holding a 68px image. Card surface is `$green-300` in dark and `$green-200` in light,
both bright, with black text.

Notes for design:
- **A carousel, not the 3-across grid this was.** `StandardCardGroupSection` spans every card at 4
  columns, so five customers left a ragged trailing row at every breakpoint above mobile: 3+2 at
  lg/xl, 2+2+1 at md. Five cards make a ~2030px track, so the arrows genuinely do something.
- **Green, not blue.** `CarouselCardList` offers only `neutral` and `green`, and neutral would sit
  directly on top of "Learn more", which is already neutral.
- Logos live in `static/img/payments/customer-marks/`, normalised to **84% ink** on a square canvas
  so all five carry equal visual weight. Two needed surgery: the CoinPayments wallet mark was
  isolated from its wordmark, and the Ripple logomark was extracted from a 192x50 lockup that would
  otherwise render 68x18. Geometry unmodified in both, only framing.
- **The wireframe's "Case study" CTA label is gone.** `CardOffgrid` makes the whole card the link
  and has no CTA slot. All five links leave the page.
- Icons render `alt=""` `aria-hidden="true"`, which is correct: the card title carries the name.

### 10. Learn more — wireframe S10

`StandardCardGroupSection` · `variant="neutral"` · three cards

- **Heading:** Learn more · description empty

| Card | Description | CTA |
|---|---|---|
| Documentation | XRPL Payments docs — Payment types, transaction reference, and integration guides. | Read more → `/docs/concepts/payment-types` |
| Blog post | Cross-border B2B on XRPL — How operators are using RLUSD and the stablecoin mix for corridor settlement. | Read more → `/blog` |
| Developer spotlight | Are you building? Peer-to-peer payments, stablecoin integrations, or RLUSD on XRPL. | Share your work → `xrpl.org/blog` |

Developer spotlight is **one of these three cards, not a section of its own**. The wireframe supplies
no URLs. The named blog post ("Cross-border B2B on XRPL") **does not exist yet**, so that card
points at the blog index.

### 11. Closing banner — wireframe S11

`CalloutMediaBanner` · `variant="lilac"` · `headingAs="h2"`

- **Heading:** Ready to move money on XRPL?
- Subheading: empty (S11 gives none)
- **CTAs:** Read the docs → `/docs` · Join the Discord → `https://discord.com/invite/sfX3ERAMjH`

S11 asks for a **full-bleed background image**. No payments art exists in `bds-2026`, so this uses
the banner's solid-colour variant.

---

## 6. Component inventory

Everything on the page maps to a real component. If a Figma edit needs a shape not in this list,
it needs a new component built first, which is what caused the earlier round of rejected iterations.

| Component | Path under `shared/` | Used for |
|---|---|---|
| `HeaderHeroSplitMedia` | `sections/HeaderHeroSplitMedia/` | Hero |
| `CardStats` / `CardStat` | `sections/CardStatsList/`, `components/CardStat/` | Stat band |
| `StandardCardGroupSection` / `StandardCard` | `sections/StandardCardGroupSection/` | Use cases, Learn more |
| `LinkSmallGrid` | `sections/LinkSmallGrid/` | AI Starter Kit |
| `PageGrid`, `SectionHeader` | `components/PageGrid/`, `patterns/SectionHeader/` | Stablecoin section frame |
| `StablecoinCorridorMap` | `patterns/StablecoinCorridorMap/` | The map (page-specific) |
| `CardsTextGrid` / `CardTextIcon` | `sections/CardsTextGrid/`, `components/CardTextIcon/` | Compliance, DIY vs Partner |
| `CalloutMediaBanner` | `sections/CalloutMediaBanner/` | Migration banner, closing banner |
| `CarouselCardList` / `CardOffgrid` | `sections/CarouselCardList/`, `components/CardOffgrid/` | Customers |

Two undocumented details found while building, in case they matter to a redesign:
- `CarouselCardList` has a **`buttonVariant`** prop (`green | black | neutral`, default `neutral`)
  that its own `.md` does not mention. Its documented CSS class names are also stale: nav buttons
  come from the `Button` component now.
- `StandardCardGroupSection` is **hardcoded to `lg: 4`**, so exactly three across. It cannot do
  two-across or four-across rows.

## 7. Gaps that need design

These are wireframe items with no home on the page. All are blocked on assets or components, not
on a decision.

| # | Item | Blocker |
|---|---|---|
| S2 | Social proof logo strip | Four of the five named logos have no asset in the repo, and Amarantha's question about whether they are cleared for xrpl.org is still open |
| S1 | Animated cross-currency routing diagram | No payments art in `bds-2026`; a photo at the wrong aspect stands in |
| S8 | Seven-step stepper | No stepper component in the kit |
| S9 | "See all customer stories" tile | No customer-stories listing page exists to link it to |
| S11 | Full-bleed background image | No payments art in `bds-2026` |
| All | Eyebrows (S1, S3, S4, S5, S7, S8) | No component renders one |
| S6 | Vector source for the corridor map | Designer has none; four of its five stablecoin icons are still placeholders |
| S3/4/5 | Three dedicated use-case pages | Do not exist; card links are interim |
| S10 | "Cross-border B2B on XRPL" blog post | Does not exist; card points at the blog index |

## 8. Needs PM sign-off

Two strings on the page have **no wireframe source**:

1. **"XRPL payments at a glance"**, the stat band heading. Kept as a plain label rather than a
   claim, deliberately, since the brief was not to invent marketing copy.
2. **"Use cases"**, the combined S3/S4/S5 section heading. The shortest honest label drawn from her
   own section titles ("SECTION 3 - Use case: ..."). The description is left empty rather than
   invented.

The stat band itself is also not in the wireframe. It was added to answer rflynn's open comment on
the doc ("we are missing the buy-in. Like why switch? Are we faster, cheaper, easier to use").

## 9. If rebuilding this in Figma

Three constraints worth knowing before starting:

1. **Booton must be uploaded to the Figma org.** It is a licensed brand font. If it is missing,
   every text node silently falls back and the file will look wrong while reporting no error.
2. **Raster images cannot be scripted into Figma.** The write API cannot fetch URLs. The hero JPG
   and three of the five customer marks (CoinPayments, FriiPay, Brale) are PNGs and would arrive as
   empty named frames. Ripple and Braza Bank are SVGs and import as editable vectors.
3. **The corridor map is ~125KB of path data** against a 50,000 character script cap, so it cannot
   be written in one call. Easiest path is a correctly-sized placeholder frame with the PNG dropped
   in by hand.

Also note: a **View seat cannot do this at all.** Figma's MCP limit for View and Collab seats on an
Enterprise plan is 6 tool calls per month; Dev and Full seats get 600 per day. Building an
11-section page needs 30 to 50 calls.
