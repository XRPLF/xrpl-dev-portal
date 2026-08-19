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
    title: 'Payments Infrastructure',
    description:
      'The XRP Ledger Payments Infrastructure is a payments solution for use cases including stablecoin payments, cross-border remittance, B2B payment rails, and merchant settlement.',
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

  const whyChooseCards = [
    {
      heading: translate('Enable Cross-Border Stablecoin Payments'),
      description: (
        <ul>
          <li>{translate('Set of regulated stablecoins RLUSD, AUDD, BBRL, USDC etc live on XRPL')}</li>
          <li>{translate('Easily receive, store, convert, issue and send stablecoins')}</li>
        </ul>
      ),
      buttons: [],
    },
    {
      heading: translate('Access Reliable Payments Infrastructure'),
      description: (
        <ul>
          <li>{translate('Uninterrupted performance with 99.9% uptime since 2012')}</li>
          <li>{translate('Over $1T+ in value moving transactions processed to date')}</li>
        </ul>
      ),
      buttons: [],
    },
    {
      heading: translate('Move Money Efficiently'),
      description: (
        <ul>
          <li>{translate('Transactions settle atomically, in 3-5 seconds')}</li>
          <li>{translate('Predictable and ultra-low transaction fees')}</li>
        </ul>
      ),
      buttons: [],
    },
  ];

  const flexibleIntegrationCards = [
    {
      heading: translate('Build It Yourself'),
      description: (
        <>
          <p>{translate('Ideal for seasoned teams with crypto experience')}</p>
          <ul>
            <li>
              {translate('Access open ')}<a href="https://xrpl.org/docs">{translate('documentation')}</a>
            </li>
            <li>
              {translate('Use the Payments APIs + ')}<a href="https://xrpl.org/resources/dev-tools">{translate('XRPL tooling')}</a>
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: translate('Work with a Partner'),
      description: (
        <>
          <p>{translate('Ideal for regulated institutions')}</p>
          <ul>
            <li>
              {translate('Connect with the ')}<a href="https://discord.com/invite/KTNmhJDXqa">{translate('Community')}</a>
            </li>
            <li>{translate('Get help for more complex use cases')}</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <PageWrapper className="landing">
      <HeaderHeroSplitMedia
        layout="content-left"
        title={translate('Payments Infrastructure')}
        description={translate(
          'The XRP Ledger Payments Infrastructure is a payments solution for use cases including stablecoin payments, cross-border remittance, B2B payment rails, and merchant settlement.',
        )}
        media={{
          src: '/img/payments/payments-infrastructure-hero.jpg',
          alt: translate('Payments Infrastructure'),
        }}
      />

      <LinkTextDirectory
        heading={translate('Why Choose XRPL Payments Suite for Your Payment Rails?')}
        cards={whyChooseCards}
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
        headline={translate('Enterprise-Grade Stablecoins, Issued Natively on XRPL')}
        description=""
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
