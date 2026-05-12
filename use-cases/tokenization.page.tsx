import * as React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { HeaderHeroSplitMedia } from 'shared/sections/HeaderHeroSplitMedia/HeaderHeroSplitMedia';
import { CarouselCardList } from 'shared/sections/CarouselCardList/CarouselCardList';
import { LogoRectangleGrid } from 'shared/sections/LogoRectangleGrid/LogoRectangleGrid';
import { CarouselFeatured } from 'shared/patterns/CarouselFeatured/CarouselFeatured';
import { SmallTilesSection } from 'shared/sections/SmallTilesSection/SmallTilesSection';
import { LinkTextDirectory } from 'shared/sections/LinkTextDirectory/LinkTextDirectory';
import { FeatureTwoColumn } from 'shared/sections/FeatureTwoColumn/FeatureTwoColumn';

export const frontmatter = {
  seo: {
    title: 'Real-World Asset (RWA) Tokenization on XRPL',
    description:
      'Learn how to issue crypto tokens and build tokenization solutions on the XRP Ledger with developer tools and APIs purpose-built for finance.',
  },
};

export default function Tokenization() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <div className="landing page-use-cases page-use-cases-tokenization">

      {/* 1. Hero */}
      <HeaderHeroSplitMedia
        layout="content-left"
        title={translate('Real-World Asset (RWA) Tokenization')}
        subtitle=""
        description={translate(
          'Learn how to issue crypto tokens and build tokenization solutions with developer tools and APIs.'
        )}
        primaryCta={{
          label: translate('Get Started Now'),
          href: '/docs/use-cases/tokenization/creating-an-asset-backed-multi-purpose-token',
        }}
        media={{
          src: require('../static/img/bds-2026/use-cases-tokenization-hero-media.jpg'),
          alt: translate('Real-World Asset Tokenization on XRPL'),
        }}
      />

      {/* 2. Why Financial Developers Choose XRPL — Carousel (4 cards from Assets frame) */}
      <CarouselCardList
        variant="green"
        buttonVariant="green"
        heading={translate('Why Financial Developers Choose XRPL as an RWA Tokenization Platform')}
        description=""
        cards={[
          {
            icon: require('../static/img/icons/2026/black/fast-settlement-and-low-fees.svg'),
            title: translate('Fast Settlement and Low Fees'),
            description: translate(
              'Settle transactions in 3-5 seconds for a fraction of a cent — ideal for large-scale, high-volume RWA tokenization.'
            ),
          },
          {
            icon: require('../static/img/icons/2026/black/onchain-metadata.svg'),
            title: translate('Onchain Metadata'),
            description: translate(
              'Easily store key asset information or link to off-chain data using simple APIs, giving token holders more transparency and functionality.'
            ),
          },
          {
            icon: require('../static/img/icons/2026/black/native-compliance-capabilities.svg'),
            title: translate('Native Compliance Capabilities'),
            description: translate(
              'Automatically check investor credentials, control who can transfer assets, and keep a full record of every transaction, offering a secure framework for the expanding RWA crypto market.'
            ),
          },
          {
            icon: require('../static/img/icons/2026/black/delegated-token-management.svg'),
            title: translate('Delegated Token Management'),
            description: translate(
              'Use a robust permission system to let trusted third parties manage the token on your behalf.'
            ),
          },
        ]}
      />

      {/* 3. Multi Purpose Tokens (MPTs) */}
      <FeatureTwoColumn
        color="neutral"
        arrange="right"
        title={translate('Multi Purpose Tokens (MPTs)')}
        description={translate(
          "Issue, manage, and trade real-world assets without needing to build smart contracts. XRP Ledger's built-in functionality and compliance-enabling features allow asset tokenization without additional layers of complexity."
        )}
        links={[
          {
            label: translate('Download Whitepaper'),
            href: 'https://xrpl.org/static/pdf/Whitepaper_the_future_of_asset_tokenization.pdf',
          },
        ]}
        media={{
          src: require('../static/img/bds-2026/use-cases-tokenization-mpts-media.jpg'),
          alt: translate('Multi Purpose Tokens on XRPL'),
        }}
      />

      {/* 4. Trusted by Leaders — Logo Grid (8 distinct partner logos from Assets frame) */}
      <LogoRectangleGrid
        variant="gray"
        heading={translate('Trusted by Leaders in Real-World Asset Tokenization')}
        logos={[
          { logo: require('../static/img/logos/black/circle.png'), alt: translate('Circle') },
          { logo: require('../static/img/logos/black/ondo.png'), alt: translate('Ondo Finance') },
          { logo: require('../static/img/logos/black/db-schenker.png'), alt: translate('DB Schenker') },
          { logo: require('../static/img/logos/black/ripple.png'), alt: translate('Ripple') },
          { logo: require('../static/img/logos/black/societe-generale.png'), alt: translate('Société Générale') },
          { logo: require('../static/img/logos/black/zeconomy.png'), alt: translate('Zeconomy') },
          { logo: require('../static/img/logos/black/vert.png'), alt: translate('Vert') },
          { logo: require('../static/img/logos/black/braza.png'), alt: translate('Braza') },
        ]}
      />

      {/* 5. Token Utility and Market Integration — Carousel Featured (4 slides from Assets frame) */}
      <CarouselFeatured
        background="neutral"
        heading={translate('Token Utility and Market Integration')}
        features={[
          {
            title: translate('Trading'),
            description: translate(
              "Utilize XRP Ledger's native decentralized exchange (DEX) with integrated Automated Market Makers (AMM) and onchain 24/7 order books, providing a developer-friendly environment to create DeFi solutions for traditional finance applications."
            ),
          },
          {
            title: translate('Collateral Mobility'),
            description: translate(
              'Issuers can enable escrow functionality to lock tokens and facilitate secure, conditional transfers of assets based on time-locks or other conditions to enable automated financial use cases onchain.'
            ),
          },
          {
            title: translate('Delegated Distribution'),
            description: translate(
              'Token issuers can delegate user onboarding and token movement to distribution specialists, enabling them to scale their distribution network easily with a single transaction, while avoiding complex off-chain development.'
            ),
          },
          {
            title: translate('Cross-Chain Markets'),
            description: translate(
              'Access cross-chain trading and lending markets to enhance token utility and liquidity across ecosystems, a critical component for sustaining long-term XRP ledger tokenization growth.'
            ),
          },
        ]}
        buttons={[
          {
            label: translate('Decentralized exchange (DEX)'),
            href: '/docs/concepts/tokens/decentralized-exchange',
          },
          {
            label: translate('Escrow functionality'),
            href: '/docs/concepts/payment-types/escrow',
          },
        ]}
        slides={[
          {
            id: 'token-utility-trading',
            imageSrc: require('../static/img/bds-2026/use-cases-tokenization-token-utility-1-trading.jpg'),
            imageAlt: translate('Trading on the XRPL DEX'),
          },
          {
            id: 'token-utility-collateral',
            imageSrc: require('../static/img/bds-2026/use-cases-tokenization-token-utility-2-collateral.jpg'),
            imageAlt: translate('Collateral Mobility via Escrow'),
          },
          {
            id: 'token-utility-delegated',
            imageSrc: require('../static/img/bds-2026/use-cases-tokenization-token-utility-3-delegated.jpg'),
            imageAlt: translate('Delegated Distribution'),
          },
          {
            id: 'token-utility-crosschain',
            imageSrc: require('../static/img/bds-2026/use-cases-tokenization-token-utility-4-crosschain.jpg'),
            imageAlt: translate('Cross-Chain Markets'),
          },
        ]}
      />

      {/* 6. Developer Tools & APIs — Small Tiles */}
      <SmallTilesSection
        headline={translate('Developer Tools & APIs')}
        subtitle={translate(
          "Streamline development and build powerful RWA tokenization solutions with XRP Ledger's comprehensive developer toolset:"
        )}
        cardVariant="green"
        cards={[
          {
            icon: require('../static/img/logos/black/js.svg'),
            iconAlt: translate('JavaScript'),
            label: translate('Get Started with Javascript'),
            href: 'https://github.com/XRPLF/xrpl.js',
          },
          {
            icon: require('../static/img/logos/black/python.svg'),
            iconAlt: translate('Python'),
            label: translate('Get Started with Python'),
            href: 'https://github.com/XRPLF/xrpl-py',
          },
          {
            icon: require('../static/img/icons/2026/black/dex-integration.svg'),
            iconAlt: translate('DEX Integration'),
            label: translate('DEX Integration'),
            href: '/docs/tutorials/how-tos/use-tokens/trade-in-the-decentralized-exchange',
          },
          {
            icon: require('../static/img/logos/black/xrpl-evm.svg'),
            iconAlt: translate('XRPL EVM Sidechain'),
            label: translate('Cross-Chain Interoperability'),
            href: 'https://docs.xrplevm.org/docs/axelar/intro-to-axelar/',
          },
        ]}
      />

      {/* 7. Defining Features on XRPL — Link Text Directory */}
      <LinkTextDirectory
        heading={translate('Defining Features on XRPL')}
        cards={[
          {
            heading: translate('Proven Open-Source Technology'),
            description: translate(
              'With over 3.3B transactions processed, XRP Ledger has been a trusted, battle-tested blockchain for over a decade, supported by a global developer community committed to financial innovation.'
            ),
            buttons: [],
          },
          {
            heading: translate('Purpose-Built for Finance'),
            description: translate(
              'XRP Ledger provides out-of-the-box institutional-grade functionality, reducing development overhead and eliminating the need for smart contracts, which makes it ideal for the RWA crypto space.'
            ),
            buttons: [],
          },
          {
            heading: translate('Native Compliance & Security'),
            description: translate(
              'Maintain control over tokenized assets and enforce compliance using native tools such as issuer-defined Authorization, onchain Freeze capabilities, detailed metadata for attestations, and multi-signature accounts.'
            ),
            buttons: [],
          },
          {
            heading: translate('Optimal Liquidity Pathways'),
            description: translate(
              "Streamline cross-currency transactions and trading as XRP Ledger's embedded trading features automatically identify the most efficient routes to enhance liquidity issued tokens and XRP."
            ),
            buttons: [
              {
                label: translate('Explore Trading on the XRPL'),
                href: '/docs/tutorials/how-tos/use-tokens/trade-in-the-decentralized-exchange',
              },
            ],
          },
        ]}
      />

      {/* 8. Stay Connected — Feature Two Column (Assets-frame variant: "Sign Up") */}
      <FeatureTwoColumn
        color="yellow"
        arrange="right"
        title={translate('Stay Connected')}
        description={translate(
          'Stay ahead in the world of tokenization. Subscribe to receive the latest insights, trends, and updates on payment solutions — delivered directly to your inbox.'
        )}
        links={[
          {
            label: translate('Sign Up'),
            href: 'https://share.hsforms.com/18zNvJDR4QbObGPLDh3n5Bw4vgrs',
          },
        ]}
        media={{
          src: require('../static/img/bds-2026/use-cases-tokenization-stay-connected-media.jpg'),
          alt: translate('Stay Connected with XRPL'),
        }}
      />

    </div>
  );
}
