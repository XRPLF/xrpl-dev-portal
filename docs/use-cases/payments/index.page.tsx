import React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { PageWrapper } from 'shared/components/PageWrapper';
import { HeaderHeroSplitMedia } from 'shared/sections/HeaderHeroSplitMedia/HeaderHeroSplitMedia';
import { LinkTextDirectory } from 'shared/sections/LinkTextDirectory/LinkTextDirectory';
import FeaturedVideoHero from 'shared/sections/FeaturedVideoHero/FeaturedVideoHero';
import { StandardCardGroupSection } from 'shared/sections/StandardCardGroupSection/StandardCardGroupSection';
import type { StandardCardPropsWithoutVariant } from 'shared/sections/StandardCardGroupSection/StandardCardGroupSection';
import { CardsIconGrid, CardsIconGridProps } from 'shared/sections/CardsIconGrid/CardsIconGrid';
import { LogoSquareGrid, LogoItem } from 'shared/sections/LogoSquareGrid/LogoSquareGrid';
import { CardsTextGrid } from 'shared/sections/CardsTextGrid/CardsTextGrid';
import { FeatureSingleTopic } from 'shared/sections/FeatureSingleTopic/FeatureSingleTopic';

export const frontmatter = {
  seo: {
    title: 'XRPL Payments Infrastructure',
    description:
      'Move money globally on XRPL. Native FX, deterministic settlement in 3-5 seconds, sub-cent fees, regulated stablecoins, and protocol-level compliance \u2014 the full payments stack on one chain.',
  },
};

const HUBSPOT_NEWSLETTER_FORM =
  'https://share.hsforms.com/18zNvJDR4QbObGPLDh3n5Bw4vgrs';

const STABLECOIN_CARDS: readonly StandardCardPropsWithoutVariant[] = [
  {
    headline: 'RLUSD',
    children:
      "Ripple's enterprise-grade stablecoin, is live on XRPL and fully backed by USD deposits. Built for institutions, it enables fast, compliant, low-cost cross-border payments.",
    callsToAction: [{ children: 'RLUSD', href: 'https://ripple.com/solutions/stablecoin/' }],
  },
  {
    headline: 'USDC',
    children:
      "Issued by Circle, is the world's largest regulated dollar stablecoin and now live on XRPL. It unlocks new corridors for enterprise payments, remittances, and DeFi for millions of users and developers.",
    callsToAction: [{ children: 'USDC', href: 'https://www.circle.com/usdc' }],
  },
  {
    headline: 'USDB',
    children:
      'By Braza Group, is a USD-pegged stablecoin backed by U.S. and Brazilian bonds. Built for FX and remittance, it supports both institutional and retail users via the Braza On app.',
    callsToAction: [{ children: 'USDB', href: 'https://www.brazabank.com.br/en/usdben/' }],
  },
  {
    headline: 'EUROP',
    children:
      'Issued by Schuman Financial, is the first MiCA-compliant euro stablecoin on XRPL. With full reserves at leading EU banks, it brings credible euro liquidity to payments, on-chain FX, and DeFi.',
    callsToAction: [{ children: 'EUROP', href: 'https://schuman.io/europ/' }],
  },
  {
    headline: 'XSGD',
    children:
      "From StraitsX, is a Singapore Dollar-backed stablecoin regulated by MAS. Its launch on XRPL enhances fast, low-cost payments in Southeast Asia's digital economy.",
    callsToAction: [{ children: 'XSGD', href: 'https://www.straitsx.com/xsgd' }],
  },
  {
    headline: 'AUDD',
    children:
      "An Australian dollar stablecoin, is live on XRPL and backed 1:1 with AUD. It supports value transfers, remittance, trade, cross-border transactions and DeFi, enabling AUD utility via XRPL's Decentralised Exchange.",
    callsToAction: [{ children: 'AUDD', href: 'https://www.audd.digital/' }],
  },
];

const EMBEDDED_PAYMENTS_CARDS: CardsIconGridProps['cards'] = [
  {
    heading: 'Digital Wallets',
    description:
      'Offer fast, low-fee stablecoin payments between users and applications.',
    icon: '/img/payments/filing.svg',
  },
  {
    heading: 'Cross-Border Remittance',
    description:
      'Use secure payment channels and the most optimal liquidity pathways for global remittances with RLUSD.',
    icon: '/img/payments/globe-1.svg',
  },
  {
    heading: 'Regulated Foreign Exchange',
    description:
      'Tap into a set of fiat-backed stablecoins, instantaneous swaps for efficient Foreign Exchange.',
    icon: '/img/payments/wallet-exchange.svg',
  },
  {
    heading: 'Merchant Settlement',
    description:
      'Settle daily payments across assets using escrow or checks with compliance-focused features.',
    icon: '/img/payments/money-hand.svg',
  },
  {
    heading: 'B2B Payment Rails',
    description:
      'Build programmable payment flows with conditions and real-time data feeds.',
    icon: '/img/payments/money-hand.svg',
  },
  {
    heading: 'Compliance-First Payments',
    description:
      'Add Deposit Authorization and whitelisting to comply with AML and KYC workflows.',
    icon: '/img/payments/checklist.svg',
  },
];

const PARTNER_LOGOS: LogoItem[] = [
  {
    logo: '/img/payments/coinpayments.png',
    alt: 'CoinPayments',
    href: 'https://xrpl.org/blog/2025/coinpayments-xrpl-case-study-payment-processing',
  },
  {
    logo: '/img/payments/ripple-blueblack.svg',
    alt: 'Ripple',
    href: 'https://ripple.com/solutions/cross-border-payments/',
  },
  {
    logo: '/img/payments/ffii.svg',
    alt: 'FriiPay',
    href: 'https://xrpl.org/blog/2025/frii-pay-xrpl-case-study-crypto-payment-solution',
  },
  {
    logo: '/img/payments/brale.png',
    alt: 'Brale',
    href: 'https://brale.xyz/blog/brale-goes-live-on-the-xrp-ledger',
  },
  {
    logo: '/img/payments/brazabank.svg',
    alt: 'BrazaBank',
    href: 'https://ripple.com/ripple-press/braza-group-announces-launch-of-bbrl-stablecoin-on-the-xrp-ledger/',
  },
];

export default function PaymentsPage() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  // Wireframe v2 sections 3-5. Each use case is one numbered card. Collapsed to a
  // single line apiece rather than the wireframe's three supporting features, so the
  // section is roughly a third of its previous height; the detail lives on the linked
  // concept pages.
  const useCaseCards = [
    {
      heading: translate('Atomic FX and settlement, in a single transaction'),
      description: (
        <ul>
          <li>{translate('Autobridging and pathfinding are built into the Payment transaction itself, quoting across CLOB, AMM, and Permissioned DEX.')}</li>
        </ul>
      ),
      buttons: [
        {
          label: translate('Cross-currency payments'),
          href: '/docs/concepts/payment-types/cross-currency-payments',
        },
      ],
    },
    {
      heading: translate('24/7 stablecoin clearing between issuers, networks, and acquirers'),
      description: (
        <ul>
          <li>{translate('No batch cutoffs, so settlement runs whenever volume runs and less working capital sits against batch windows.')}</li>
        </ul>
      ),
      buttons: [
        {
          label: translate('Stablecoins on XRPL'),
          href: '/docs/concepts/tokens/fungible-tokens/stablecoins',
        },
      ],
    },
    {
      heading: translate('AI agents transact at machine speed, within rules the chain enforces'),
      description: (
        <ul>
          <li>{translate('Fixed, predictable fees agents can budget against, with escrow, multi-sign, and Deposit Authorization bounding what they can do.')}</li>
        </ul>
      ),
      buttons: [
        {
          label: translate('Agentic transactions'),
          href: '/docs/agents/agentic-transactions',
        },
      ],
    },
  ];

  const flexibleIntegrationCards = [
    {
      heading: translate('Build it yourself'),
      description: (
        <>
          <p>{translate('For teams with crypto experience.')}</p>
          <ul>
            <li>
              {translate('Access the ')}<a href="/docs">{translate('developer docs')}</a>{translate(', the Payments APIs, and ')}<a href="/resources/dev-tools">{translate('XRPL tooling')}</a>
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: translate('Work with a partner'),
      description: (
        <>
          <p>{translate('For regulated institutions and complex use cases.')}</p>
          <ul>
            <li>
              {translate('Connect with the ')}<a href="https://discord.com/invite/sfX3ERAMjH">{translate('Discord community')}</a>
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <PageWrapper className="landing">
      <HeaderHeroSplitMedia
        layout="content-left"
        title={translate('Move money across borders, on one chain')}
        description={translate(
          "Native FX, deterministic settlement, sub-cent fees, regulated stablecoins, protocol-level compliance, and agent-ready infrastructure. What's usually assembled at the application layer, XRPL ships at the protocol layer.",
        )}
        primaryCta={{ label: translate('Build on XRPL'), href: '/docs' }}
        // Wireframe v2 section 8 is dropped from the page, but its CTA copy lives on
        // here so the migration guide keeps a prominent route in. The guide ships on
        // the payments-fx-migration-guide branch: this page must not reach production
        // before it does, or this link 404s. Redocly's link checker does not scan href
        // props in .tsx, so CI will not catch that.
        secondaryCta={{
          label: translate('Read the migration playbook'),
          href: '/docs/use-cases/payments/migrate-a-payments-or-fx-stack-to-the-xrp-ledger',
        }}
        media={{
          src: '/img/payments/payments-infrastructure-hero.jpg',
          alt: translate('Payments Infrastructure'),
        }}
      />

      <LinkTextDirectory
        heading={translate('Why Choose XRPL Payments Suite for Your Payment Rails?')}
        cards={useCaseCards}
      />

      <FeaturedVideoHero
        headline={translate('Advanced Payment Features')}
        subtitle={translate(
          'Helping fintechs and payment providers move money fast, globally, and at low cost - all through simple APIs.',
        )}
        video={{
          source: {
            type: 'embed',
            embedUrl: 'https://www.youtube.com/embed/e2Iwsk37LMk',
          },
        }}
        links={[
          {
            label: translate('Learn More'),
            href: 'https://xrpl.org/docs/concepts/payment-types',
          },
        ]}
      />

      <StandardCardGroupSection
        headline={translate('Regulated stablecoins, issued natively on XRPL')}
        description={translate(
          "RLUSD is the default USD instrument on XRPL: regulated, institutionally backed, deepening as the network's anchor dollar. Pair it with regional native stablecoins for in-region settlement.",
        )}
        variant="yellow"
        cards={STABLECOIN_CARDS}
      />

      <CardsIconGrid
        heading={translate('Unlock New Business Models with Embedded Payments')}
        description={translate(
          'XRPL Payments supports modern fintech use cases with plug-and-play APIs or partner-led deployments.',
        )}
        cards={EMBEDDED_PAYMENTS_CARDS}
      />

      <LogoSquareGrid
        variant="gray"
        heading={translate('Payments Solution, Battle-Tested by Industry Leaders')}
        logos={PARTNER_LOGOS}
      />

      <CardsTextGrid
        heading={translate('Flexible Integration: DIY or Partner-Led')}
        cards={flexibleIntegrationCards}
      />

      <FeaturedVideoHero
        headline={translate('Developer Spotlight')}
        subtitle={translate(
          'Are you building a peer-to-peer payments solution, integrating stablecoins, or exploring RLUSD on the XRP Ledger?',
        )}
        video={{
          source: {
            type: 'embed',
            embedUrl: 'https://www.youtube.com/embed/e2Iwsk37LMk',
          },
          coverImage: {
            src: '/img/payments/man-writing.jpg',
            alt: translate('Developer Spotlight'),
          },
        }}
        links={[
          {
            label: translate('Share Your Work'),
            href: 'https://xrpl.org/blog',
          },
          {
            label: translate('View Others'),
            href: 'https://xrplresources.org/developer-spotlight',
          },
        ]}
      />

      <FeatureSingleTopic
        orientation="left"
        title={translate('Stay Connected')}
        description={translate(
          'Stay ahead in the world of payments. Subscribe to receive the latest insights, trends, and updates on payment solutions — delivered directly to your inbox.',
        )}
        buttons={[
          {
            label: translate('Sign Up to Newsletter'),
            href: HUBSPOT_NEWSLETTER_FORM,
          },
        ]}
        singleButtonVariant="secondary"
        media={{
          src: '/img/payments/xrpl-pattern.png',
          alt: translate('Stay Connected'),
        }}
      />
    </PageWrapper>
  );
}
