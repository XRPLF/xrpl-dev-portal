import React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { PageWrapper } from 'shared/components/PageWrapper';
import { PageGrid, PageGridRow, PageGridCol } from 'shared/components/PageGrid/page-grid';
import { SectionHeader } from 'shared/patterns/SectionHeader';
import { HeaderHeroSplitMedia } from 'shared/sections/HeaderHeroSplitMedia/HeaderHeroSplitMedia';
import { CardStats } from 'shared/sections/CardStatsList/CardStatsList';
import { StandardCardGroupSection } from 'shared/sections/StandardCardGroupSection/StandardCardGroupSection';
import type { StandardCardPropsWithoutVariant } from 'shared/sections/StandardCardGroupSection/StandardCardGroupSection';
import { CardsTextGrid } from 'shared/sections/CardsTextGrid/CardsTextGrid';
import { LinkSmallGrid } from 'shared/sections/LinkSmallGrid/LinkSmallGrid';
import { CalloutMediaBanner } from 'shared/sections/CalloutMediaBanner/CalloutMediaBanner';
import { CarouselCardList, type CarouselCardConfig } from 'shared/sections/CarouselCardList';
import { StablecoinCorridorMap } from 'shared/patterns/StablecoinCorridorMap/StablecoinCorridorMap';

// Every string on this page comes from XRPL Payments Page - Wireframe v2, and every section
// maps to one of its sections, in its order. Section numbers in the comments refer to that
// document. There is exactly one string with no wireframe source: the heading on the stats
// band, flagged at its call site.
//
// Wireframe content still with no home on the page, all of it blocked on design or assets:
//   S2  social proof strip - 4 of the 5 named logos have no asset in the repo, and
//       Amarantha's comment asking whether they are cleared for xrpl.org is still open
//   S8  the seven-step stepper
//   S9  the "See all customer stories" tile - no customer-stories listing page exists
//   All eyebrows (S1, S3, S4, S5, S7, S8) and all animated visuals: no component in the
//   kit renders an eyebrow, and there is no payments art in bds-2026.

export const frontmatter = {
  seo: {
    // Wireframe v2 header block, verbatim. "| XRP Ledger" is appended by the theme.
    title: 'XRPL Payments Infrastructure',
    description:
      'Move money globally on XRPL. Native FX, deterministic settlement in 3-5 seconds, sub-cent fees, regulated stablecoins, and protocol-level compliance — the full payments stack on one chain.',
  },
};

const MIGRATION_PLAYBOOK =
  '/docs/use-cases/payments/migrate-a-payments-or-fx-stack-to-the-xrp-ledger';

// Not from the wireframe: rflynn's open comment on the doc ("we are missing the buy-in.
// Like why switch? Are we faster, cheaper, easier to use") asked for numbers, and the
// wireframe only carries them in the meta description. Every figure is verified, not
// recalled:
//   0.00001 XRP  live server_info on xrplcluster.com reports base_fee_xrp 1e-05. The
//                wireframe's own phrase for this is "sub-cent fees".
//   106M+        live server_info reports complete_ledgers "32570-106691468": an unbroken
//                range from the 2012 genesis ledger, so the count is evidenced rather than
//                claimed. Only ever grows, so "106M+" does not go stale.
//   3-5s         xrpl.org/xrp-overview; also the wireframe's "deterministic settlement in
//                3-5 seconds" and S3's "Ledgers close every 3 to 5 seconds".
//   1,500        xrpl.org/xrp-overview capacity figure.
// No dollar value for the fee on purpose: it tracks the XRP price and would rot.
//
// CardStat renders `statistic` at display-lg, which is 92px desktop / 112px xl and fits
// about four characters. Every value here is kept to three to five glyphs, and the type is
// scaled down to 40/48/56px by .payments-stat-band in styles/_landings.scss.
// Every figure is immutable, so this band never needs revisiting: 3-5s, 10 drops and 24/7
// are protocol properties and 1,500 TPS is a capacity ceiling rather than a running total.
// "106M+ ledgers closed" was dropped because it only ever grows, so it would silently
// understate itself; "2012" replaced it briefly but how long the network has been up is not
// something a payments reader is deciding on. 24/7 settlement is - it is the difference from
// the batch windows they run today, and it is wireframe language (S4: "No batch cutoffs.
// Settlement runs whenever volume runs.").
// Labels carry no terminal period: CardStat's own documented usage is label="Active
// wallets", and these are fragments rather than sentences.
const PAYMENT_STATS = [
  {
    statistic: '3-5s',
    label: 'Deterministic settlement',
  },
  {
    // No superscript: "drops" is five characters rendered at 0.7em on the same line box as
    // the figure, and it broke as "dr / ops" in a quarter-width card. Three glyphs cannot
    // wrap, and the precise figure moves into the label where it has room.
    // "Transaction cost" rather than "reference transaction cost": both are correct and our
    // own docs use the latter as a formal heading, but it means a specific technical thing
    // (the cheapest non-free transaction class) and reads as internal jargon here.
    statistic: '<1¢',
    label: '10 drops of XRP per transaction',
  },
  {
    statistic: '24/7',
    label: 'Settlement, no batch cutoffs',
  },
  {
    // Compliance stat: the PM's figure and phrase, kept at her direction.
    //
    // Her full string was "Protocol-Native Compliance - Built-in Freeze, Clawback, and
    // Credential controls requiring zero smart contract code." Only the length is changed:
    // at body-r 18px in a quarter-width card that runs five or six lines, and because the
    // cards stretch to the tallest label all four inflate with it. The freeze, clawback and
    // credential detail is not lost - it is the S7 four-card row further down the page.
    //
    // "100%" modifies "protocol-native", i.e. these controls are wholly native rather than
    // partly assembled at the application layer, which is the hero's thesis. Worth knowing
    // it does not mean a complete compliance program runs on ledger: screening, KYC
    // identity verification, travel-rule messaging and transaction monitoring stay off it.
    statistic: '100%',
    label: 'Protocol-native compliance',
  },
  // At the reduced type size (see .payments-stat-band in styles/_landings.scss) four across
  // fits comfortably, so the band is one row rather than CardStats' default 2x2.
].map((stat) => ({ ...stat, variant: 'light-gray' as const, span: { base: 4, md: 4, lg: 3 } }));

// Wireframe S3, S4 and S5, collapsed into a single carousel.
//
// The wireframe draws them as three separate sections, each with an H2, a body and a
// three-card feature row - about 700 words and three near-identical blocks. This is the
// approach rflynn proposed in the doc ("collapse the individual use case sections into a
// single section... link out to dedicated sub-pages", which Hinna agreed with) and it
// answers the wireframe's own open question, "Is each use case on a different page? TBD".
//
// Titles are the wireframe's section names verbatim ("Use case: Cross-border B2B
// settlement" etc.) and each description is that section's H2, verbatim. Everything else is
// dropped: the nine feature cells, the section bodies, and the animated visuals.
//
// LINKS ARE INTERIM. The three dedicated use-case pages do not exist; the only sub-pages
// under docs/use-cases/payments are peer-to-peer, restricting-deposits and smart-contracts,
// none of which is one of these. Each card points at the closest existing concept doc until
// its own page is written.
// StandardCardGroupSection rather than a carousel: it is hardcoded to lg: 4, so exactly
// three across, and its cards take a headline, a description and a CTA - title, small
// description, link out. The two other 3-across options do not work here: CardsIconGrid's
// cards have no href at all and it forces a 3/2 -> 4/3 aspect ratio, and SmallTilesSection
// has no description slot.
// "Read more" is the CTA label the wireframe uses on its own S10 cards.
const USE_CASE_CARDS: readonly StandardCardPropsWithoutVariant[] = [
  {
    headline: 'Cross-border B2B settlement',
    children: 'Atomic FX and settlement, in a single transaction',
    callsToAction: [
      { children: 'Read more', href: '/docs/concepts/payment-types/cross-currency-payments' },
    ],
  },
  {
    headline: 'Card network settlement',
    children: '24/7 stablecoin clearing between issuers, networks, and acquirers',
    callsToAction: [
      { children: 'Read more', href: '/docs/concepts/tokens/fungible-tokens/stablecoins' },
    ],
  },
  {
    headline: 'Agentic commerce',
    children: 'AI agents transact at machine speed, within rules the chain enforces',
    callsToAction: [{ children: 'Read more', href: '/docs/agents/agentic-transactions' }],
  },
];

// Wireframe S7. Card titles and descriptions verbatim, in the wireframe's order.
// The gap that used to open under these headings is fixed in styles/_landings.scss via the
// payments-text-cards class on the section, so the cards no longer need reordering by
// description length to keep each row's heights close.
const COMPLIANCE_CARDS = [
  {
    heading: 'Permissioned Domains',
    description: 'Credential-based access control for defined venues.',
  },
  {
    heading: 'Permissioned DEX',
    description:
      'Compliance-gated counterparty pools on the same DEX rail as the rest of the market.',
  },
  {
    heading: 'Freeze and Clawback',
    description: 'Opt-in issuer controls on issued currencies.',
  },
  {
    heading: 'Native credential framework',
    description: 'KYC/AML hooks compliance teams configure, not developers code.',
  },
];

// Wireframe S9, the card grid it draws: one card per customer with a one-liner and a link
// to the case study. One-liners are verbatim from the wireframe's "Current version has the
// below" table, in its order, em dashes included since they are the wireframe's own.
//
// A carousel rather than the 3-across grid this used to be. StandardCardGroupSection spans
// every card at 4 columns, and PageGrid is 8 columns at md and 12 at lg, so five customers
// left a ragged trailing row at every breakpoint above mobile - 3+2 at lg/xl, 2+2+1 at md,
// an empty cell either way. Five is also enough for a carousel to earn its controls: cards
// are 400px wide with 8px gaps, so the track is about 2030px against a container well under
// that, and the arrows do something. A sixth customer is now one array entry rather than a
// worse row.
//
// green, not the blue this section used to be, because CarouselCardList offers only neutral
// and green, and neutral would sit directly on top of S10 below, which is already neutral.
//
// This also satisfies the [image] the wireframe puts in each card, which the old grid could
// not: CardOffgrid's icon slot is an 84px container with a 68px image, and the raw assets
// ranged from 83% to 100% ink with two of them wordmark lockups that render illegibly at
// 68px (the Ripple lockup is 192x50, so 68x18). customer-marks/ holds a derived set, each
// one isolated to its mark and padded to 84% ink so all five carry the same visual weight.
// Card surfaces are $green-300 dark and $green-200 light, both bright, so the dark marks
// work in either theme and no light-mode variants are needed.
//
// CardOffgrid makes the whole card the link and has no CTA slot, so the wireframe's "Case
// study" label is gone. Every one of these five links leaves the page.
//
// Still missing: the sixth "See all customer stories" tile. There is no customer-stories
// listing page in the repo to link it to.
const CUSTOMER_MARKS = '/img/payments/customer-marks/';

const CUSTOMER_CARDS: readonly CarouselCardConfig[] = [
  {
    icon: `${CUSTOMER_MARKS}coinpayments.png`,
    title: 'CoinPayments',
    description:
      "CoinPayments uses XRPL's fast and low-cost payment rails to enable merchants to accept digital assets globally, with near-instant settlement and minimal transaction fees.",
    href: 'https://xrpl.org/blog/2025/coinpayments-xrpl-case-study-payment-processing',
  },
  {
    icon: `${CUSTOMER_MARKS}ripple.svg`,
    title: 'Ripple Payments',
    description:
      'Ripple Payments enables crypto companies, payment service providers and fintechs to facilitate real-time cross-border payments using stablecoins, digital assets and local currencies — with XRPL as a foundational transaction layer.',
    href: 'https://ripple.com/solutions/cross-border-payments/',
  },
  {
    icon: `${CUSTOMER_MARKS}friipay.png`,
    title: 'FriiPay',
    description:
      'FriiPay connects XRPL-based crypto wallets to point-of-sale terminals, allowing customers to pay with RLUSD or XRP while helping merchants save costs on card processing fees.',
    href: 'https://xrpl.org/blog/2025/frii-pay-xrpl-case-study-crypto-payment-solution',
  },
  {
    icon: `${CUSTOMER_MARKS}brale.png`,
    title: 'Brale',
    description:
      'Brale is an end-to-end platform for launching and managing stablecoins, now Brale goes live on XRPL, bringing regulated stablecoin issuance and Ripple USD settlement to businesses',
    href: 'https://brale.xyz/blog/brale-goes-live-on-the-xrp-ledger',
  },
  {
    icon: `${CUSTOMER_MARKS}brazabank.svg`,
    title: 'Braza Bank',
    description:
      'Braza Bank launched USDB stablecoin on XRPL, backed by Brazilian bonds and fully integrated in customer-facing services such as e-commerce, global purchases and investments',
    href: 'https://ripple.com/ripple-press/braza-group-announces-launch-of-bbrl-stablecoin-on-the-xrp-ledger/',
  },
];

// Wireframe S10, all three cards. Titles, one-liners and CTA labels verbatim. The wireframe
// supplies no URLs: Documentation points at the payment types docs it describes, and the
// Blog post card names a post ("Cross-border B2B on XRPL") that does not exist yet, so it
// points at the blog index until it does.
const LEARN_MORE_CARDS: readonly StandardCardPropsWithoutVariant[] = [
  {
    headline: 'Documentation',
    children:
      'XRPL Payments docs — Payment types, transaction reference, and integration guides.',
    callsToAction: [{ children: 'Read more', href: '/docs/concepts/payment-types' }],
  },
  {
    headline: 'Blog post',
    children:
      'Cross-border B2B on XRPL — How operators are using RLUSD and the stablecoin mix for corridor settlement.',
    callsToAction: [{ children: 'Read more', href: '/blog' }],
  },
  {
    headline: 'Developer spotlight',
    children:
      'Are you building? Peer-to-peer payments, stablecoin integrations, or RLUSD on XRPL.',
    callsToAction: [{ children: 'Share your work', href: 'https://xrpl.org/blog' }],
  },
];

export default function PaymentsPage() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  // Wireframe S8, "Two-column footer to this section - DIY vs Partner-led". Card titles
  // and body text verbatim; the wireframe's [bracketed] terms are the links.
  const diyVsPartnerCards = [
    {
      heading: translate('Build it yourself'),
      description: (
        <>
          {translate('For teams with crypto experience. Access ')}
          <a href="/docs">{translate('developer docs')}</a>
          {translate(', the Payments APIs, and ')}
          <a href="/resources/dev-tools">{translate('XRPL tooling')}</a>
          {translate('.')}
        </>
      ),
    },
    {
      heading: translate('Work with a partner'),
      description: (
        <>
          {translate('For regulated institutions and complex use cases. Connect with the ')}
          <a href="https://discord.com/invite/sfX3ERAMjH">{translate('Discord community')}</a>
          {translate('.')}
        </>
      ),
    },
  ];

  return (
    <PageWrapper className="landing">
      {/* Wireframe S1. H1, sub-headline and primary CTA verbatim. The eyebrow
          ("Solutions / Payments and FX") is dropped: no component renders one. The
          wireframe asks for an animated cross-currency routing diagram here; this is the
          existing page's photo, and it is 1500x844 where the Figma specifies 800x800. */}
      <HeaderHeroSplitMedia
        layout="content-left"
        title={translate('Move money across borders, on one chain')}
        description={translate(
          "Native FX, deterministic settlement, sub-cent fees, regulated stablecoins, protocol-level compliance, and agent-ready infrastructure. What's usually assembled at the application layer, XRPL ships at the protocol layer.",
        )}
        primaryCta={{ label: translate('Build on XRPL'), href: '/docs' }}
        media={{
          src: '/img/payments/payments-infrastructure-hero.jpg',
          alt: translate('Payments Infrastructure'),
        }}
      />

      {/* Not in the wireframe - added to answer rflynn's open "why switch" comment. The
          figures are sourced (see PAYMENT_STATS); this heading is not, and is the second of
          the two strings on the page needing the PM's sign-off. Kept as a plain label
          rather than a claim, since inventing a marketing line is what it must not be. */}
      <CardStats
        className="payments-stat-band"
        heading={translate('XRPL payments at a glance')}
        cards={PAYMENT_STATS}
      />

      {/* Wireframe S3, S4 and S5 as one three-card row - see USE_CASE_CARDS.
          The section needs a heading and the wireframe has none for a combined use-case
          section, so this is the shortest honest label drawn from her own section titles
          ("SECTION 3 - Use case: ..."); description is empty rather than invented. Like the
          stats heading, it needs her sign-off.
          Green so it does not read as the same block as the other three
          StandardCardGroupSections on the page (yellow, blue, neutral). */}
      <StandardCardGroupSection
        headline={translate('Use cases')}
        description=""
        variant="green"
        cards={USE_CASE_CARDS}
      />

      {/* Wireframe S5's callout block, verbatim, including its "Get started" CTA. Every
          named piece exists in the docs: /docs/agents/agentic-payments-x402,
          xrpl-agent-wallet-skill, xrpl-payments-skill. Without this, x402 - the
          differentiator for the agentic use case - appeared nowhere on the page.
          Deliberately a compact tile section and not a CalloutMediaBanner: in the wireframe
          this is a callout *inside* S5, subordinate to it. As a full-width banner it read as
          a page-level CTA competing with the migration and closing CTAs below.
          Her sentence names four pieces and stays verbatim as the description. Three of them
          have doc pages and become the tiles, using her names exactly; XRPL Docs MCP Server
          has no page yet, so it is named but not linked. A single "Get started" tile left
          the section looking empty, and these three are the entry points it pointed at. */}
      <LinkSmallGrid
        variant="lilac"
        heading={translate('XRPL AI Starter Kit')}
        description={translate(
          'XRPL Docs MCP Server, XRPL Agent Wallet Skill, XRPL Payment Skill, x402 facilitator.',
        )}
        links={[
          {
            label: translate('XRPL Agent Wallet Skill'),
            href: '/docs/agents/xrpl-agent-wallet-skill',
          },
          {
            label: translate('XRPL Payment Skill'),
            href: '/docs/agents/xrpl-payments-skill',
          },
          {
            label: translate('x402 facilitator'),
            href: '/docs/agents/agentic-payments-x402',
          },
        ]}
      />

      {/* Wireframe S6. Heading and body verbatim, and the [image] placeholder is now the
          actual graphic from the wireframe (Stablecoins.png in Drive), which replaces the
          six per-stablecoin cards the old page carried.
          Assembled from PageGrid + SectionHeader rather than a section component because
          every media slot in the kit crops: FeatureTwoColumn's is aspect-ratio 1/1 with
          object-fit: cover, which would cut the RLUSD label off the left edge and Australia
          off the right. This renders the graphic uncropped at its own proportions.
          The graphic is a vector component rather than the 512x409 screenshot it replaces,
          so it no longer softens when stretched and it follows the light/dark toggle. See
          StablecoinCorridorMap for why it is inlined instead of referenced as an <img>. */}
      <PageGrid>
        <SectionHeader
          heading={translate('Regulated stablecoins, issued natively on XRPL')}
          description={translate(
            "RLUSD is the default USD instrument on XRPL: regulated, institutionally backed, deepening as the network's anchor dollar. Pair it with regional native stablecoins for in-region settlement.",
          )}
          span={{ base: 12, md: 6, lg: 8 }}
        />
        <PageGridRow>
          <PageGridCol span={{ base: 12, md: 8, lg: 6 }}>
            <StablecoinCorridorMap />
          </PageGridCol>
        </PageGridRow>
      </PageGrid>

      {/* Wireframe S7. Section title and body verbatim. */}
      <CardsTextGrid
        className="payments-text-cards"
        heading={translate('Compliance, built in at the protocol')}
        description={translate(
          'On XRPL, the primitives ship with the protocol. Run gated counterparty pools and credentialed venues without writing the gating logic yourself.',
        )}
        cards={COMPLIANCE_CARDS}
      />

      {/* Wireframe S8, in its own position for the first time. The playbook CTA lives here,
          which is where the wireframe puts it - ahead of S9, S10 and S11 - rather than only
          on the closing banner at the very bottom. H2 and CTA verbatim; the subheading is
          the first sentence of S8's body.
          The seven-step stepper is still dropped, but the H2 names the seven steps and the
          CTA leads to the guide that contains them.
          Shortened: the banner now carries the two sentences of S8's H2, split across
          heading and subheading, and none of S8's body. Dropped from the body: "Most of what
          teams maintain as custom contracts on other chains is already a native transaction
          type on XRPL. Escrow, multi-party signing, on-chain FX, atomic settlement,
          credential-gated trading."
          The guide ships on the payments-fx-migration-guide branch, so this page must not
          reach production before it does or this CTA 404s. Redocly's link checker does not
          scan href props in .tsx, so CI will not catch that. */}
      <CalloutMediaBanner
        variant="light-gray"
        headingAs="h2"
        heading={translate('Seven steps from your current stack to XRPL.')}
        subheading={translate('The migration is mostly inventory, not engineering.')}
        buttons={[
          {
            label: translate('Read the full migration playbook'),
            href: MIGRATION_PLAYBOOK,
          },
        ]}
      />

      {/* Wireframe S8's two-column footer, directly beneath the S8 block it belongs to.
          CardsTextGrid requires a heading; the wireframe labels this block
          "DIY vs Partner-led", used verbatim. */}
      <CardsTextGrid
        className="payments-text-cards"
        heading={translate('DIY vs Partner-led')}
        cards={diyVsPartnerCards}
      />

      {/* Wireframe S9. H2 verbatim. S9 gives the section no body text, and `description` is
          required, so it is passed empty rather than filled in. */}
      <CarouselCardList
        variant="green"
        buttonVariant="green"
        heading={translate('Battle-tested by industry leaders')}
        description=""
        cards={CUSTOMER_CARDS}
      />

      {/* Wireframe S10, the full three-card row. Developer spotlight is one of the three
          cards here, not a section of its own. StandardCardGroupSection is 3-across, the
          shape the wireframe draws, and its cards take a title, a one-liner and a link,
          matching S10's three columns. `description` is required and S10 gives the section
          no body text, so it is passed empty rather than filled in. */}
      <StandardCardGroupSection
        headline={translate('Learn more')}
        description=""
        variant="neutral"
        cards={LEARN_MORE_CARDS}
      />

      {/* Wireframe S11. H2 and both CTAs verbatim. These are its own CTAs again now that the
          playbook has its proper home in S8 above; previously this banner had to carry the
          playbook because S8 did not exist as a section.
          S11 gives this banner no body text, so subheading is passed empty.
          S11 asks for a full-bleed background image; no payments art exists in bds-2026,
          so this uses the banner's solid-colour variant. */}
      <CalloutMediaBanner
        variant="lilac"
        headingAs="h2"
        heading={translate('Ready to move money on XRPL?')}
        subheading=""
        buttons={[
          { label: translate('Read the docs'), href: '/docs' },
          {
            label: translate('Join the Discord'),
            href: 'https://discord.com/invite/sfX3ERAMjH',
          },
        ]}
      />
    </PageWrapper>
  );
}
