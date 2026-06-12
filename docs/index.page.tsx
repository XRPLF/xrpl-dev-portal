import * as React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { PageWrapper } from 'shared/components/PageWrapper';
import HeaderHeroPrimaryMedia from 'shared/sections/HeaderHeroPrimaryMedia/HeaderHeroPrimaryMedia';
import { CarouselCardList } from 'shared/sections/CarouselCardList/CarouselCardList';
import { CardsTextGrid } from 'shared/sections/CardsTextGrid/CardsTextGrid';
import FeaturedVideoHero from 'shared/sections/FeaturedVideoHero/FeaturedVideoHero';
import { LinkSmallGrid } from 'shared/sections/LinkSmallGrid/LinkSmallGrid';
import { LinkTextDirectory } from 'shared/sections/LinkTextDirectory/LinkTextDirectory';
import { FeatureTwoColumn, FeatureTwoColumnWrapper } from 'shared/sections/FeatureTwoColumn';
import { SmallTilesSection } from 'shared/sections/SmallTilesSection/SmallTilesSection';
import { CardsIconGrid } from 'shared/sections/CardsIconGrid/CardsIconGrid';
import { StandardCardGroupSection } from 'shared/sections/StandardCardGroupSection/StandardCardGroupSection';

export const frontmatter = {
  seo: {
    title: 'XRP Ledger Documentation & Developer Resources',
    description:
      'Explore XRP Ledger documentation and other blockchain developer resources needed to start building and integrating with the ledger.',
  },
};

export default function Docs() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <PageWrapper className="landing page-docs page-docs-index">

      {/* 1. Hero */}
      <HeaderHeroPrimaryMedia
        headline={translate("XRP Ledger (XRPL) Documentation")}
        subtitle={translate("Explore XRPL documentation with our essential guide for developers and admins who want to start building and integrating with the XRP Ledger.")}
        media={{ type: 'image', src: require('../static/img/bds-2026/docs-hero-media.jpg'), alt: translate('XRPL Documentation') }}
      />

      {/* 2. Get Started Carousel */}
      <CarouselCardList
        variant="green"
        buttonVariant="green"
        heading={translate("Get Started: XRPL Developer & Admin Resources")}
        description={translate("Learn your way. Read docs, watch videos, or get hands-on with code samples. Explore different ways to learn on the XRP Ledger.")}
        cards={[
          {
            icon: require('../static/img/icons/2026/black/Ready-to-Use-Code-Samples.svg'),
            title: translate('Ready-to-Use Code Samples'),
            description: translate(
              'Run complete code snippets to understand XRPL integration in seconds.'
            ),
            href: '/docs/tutorials/',
          },
          {
            icon: require('../static/img/icons/2026/black/Launch-Your-First-Project.svg'),
            title: translate('Launch Your First Project'),
            description: translate(
              'Explore funding and development opportunities for your project on the XRPL.'
            ),
            href: '/resources/grant-funding/',
          },
          {
            icon: require('../static/img/icons/2026/black/Step-by-Step-Tutorials.svg'),
            title: translate('Step-by-Step Tutorials'),
            description: translate(
              'Follow guided walkthroughs to master XRPL fundamentals and industry best practices.'
            ),
            href: '/docs/tutorials/',
          },
        ]}
      />

      {/* 3. Core Concepts Text Grid */}
      <CardsTextGrid
        heading={translate("Dig Into Core Concepts & Tools")}
        cards={[
          {
            heading: translate('XRPL Fundamentals'),
            description: (
              <>
                {translate("Discover the basics of the XRPL by learning about accounts, transactions, and the ledger structure.")}{' '}<br/><br/>
                <a href="/docs/concepts/">{translate("Read More")}</a>
              </>
            ),
          },
          {
            heading: translate('Advanced XRPL Topics: Go Deeper'),
            description: (
              <>
                {translate("Implement real-world solutions by combining XRPL primitives for lending, token issuance, DEX trading, and more.")}{' '}<br/><br/>
                <a href="/docs/use-cases/">{translate("Read More")}</a>
              </>
            ),
          },
        ]}
      />

      {/* 4. Featured Video — Advanced Payment Features */}
      <FeaturedVideoHero
        headline={translate("Advanced Payment Features")}
        subtitle={translate("Master sophisticated movement of value through features such as escrows, checks, or payment channels.")}
        video={{
          source: {
            type: 'embed',
            embedUrl: 'https://www.youtube.com/embed/e2Iwsk37LMk',
          },
        }}
        links={[
          {
            label: translate('Watch Now'),
            href: 'https://youtube.com/playlist?list=PLJQ55Tj1hIVZtJ_JdTvSum2qMTsedWkNi',
          },
        ]}
      />

      {/* 5. Featured Video — Governance */}
      <FeaturedVideoHero
        headline={translate("Governance and the Amendment Process")}
        subtitle={translate("Understand how the decentralized network evolves through validator voting and how new features are activated.")}
        video={{
          source: {
            type: 'embed',
            embedUrl: 'https://www.youtube.com/embed/4GbRdanHoR4',
          },
        }}
        links={[
          {
            label: translate('Watch Now'),
            href: 'https://youtube.com/playlist?list=PLJQ55Tj1hIVZtJ_JdTvSum2qMTsedWkNi',
          },
        ]}
      />

      {/* 6. Developer Reference Links */}
      <LinkSmallGrid
        variant="gray"
        heading={translate("Developers")}
        description={translate("Master the Protocol: Essential References")}
        links={[
          {
            label: translate('Transaction Types'),
            href: '/docs/references/protocol/transactions/types',
          },
          {
            label: translate('Account Methods'),
            href: '/docs/references/http-websocket-apis/public-api-methods/account-methods',
          },
          {
            label: translate('Ledger Entry Types'),
            href: '/docs/references/protocol/ledger-data/ledger-entry-types',
          },
          {
            label: translate('Transaction Methods'),
            href: '/docs/references/http-websocket-apis/public-api-methods/transaction-methods',
          },
          {
            label: translate('Basic Data Types'),
            href: '/docs/references/protocol/data-types/basic-data-types',
          },
          {
            label: translate('Path and Orderbook Methods'),
            href: '/docs/references/http-websocket-apis/public-api-methods/path-and-order-book-methods',
          },
        ]}
      />

      {/* 7. Server Admin Reference Links */}
      <LinkSmallGrid
        variant="gray"
        heading={translate("Server Admins")}
        description={translate("Master the Protocol: Essential References")}
        links={[
          {
            label: translate('Commandline Usage'),
            href: '/docs/infrastructure/commandline-usage',
          },
          {
            label: translate('Admin API Methods'),
            href: '/docs/references/http-websocket-apis/admin-api-methods',
          },
        ]}
      />

      {/* 8. Dev Tools Directory */}
      <LinkTextDirectory
        heading={translate("Tools to Test & Deploy")}
        cards={[
          {
            heading: translate('Get Test XRP (Faucets)'),
            description: translate(
              'Get credentials and test-XRP for XRP Ledger Testnet or Devnet.'
            ),
            buttons: [
              { label: translate('Access Here'), href: '/resources/dev-tools/xrp-faucets' },
            ],
          },
          {
            heading: translate('Send Test Transactions'),
            description: translate(
              'Test how your code handles various XRP Ledger transactions by sending them over the Testnet to the address.'
            ),
            buttons: [
              { label: translate('Access Here'), href: '/resources/dev-tools/tx-sender' },
            ],
          },
          {
            heading: translate('Explore WebSocket API'),
            description: translate(
              'Send sample requests and get responses from the rippled API.'
            ),
            buttons: [
              {
                label: translate('Access Here'),
                href: '/resources/dev-tools/websocket-api-tool',
              },
            ],
          },
          {
            heading: translate('Monitor the XRP Ledger'),
            description: translate(
              'View validations of new ledger versions in real-time, chart the location of servers in the XRP Ledger.'
            ),
            buttons: [
              { label: translate('Access Here'), href: 'https://livenet.xrpl.org/' },
            ],
          },
        ]}
      />

      <FeatureTwoColumnWrapper>
        {/* 9a. Use Cases — Payments */}
        <FeatureTwoColumn
          color="lilac"
          arrange="left"
          title={translate("Payments")}
          description=""
          media={{ src: require('../static/img/bds-2026/docs-feature-media-1.jpg'), alt: translate('Payments') }}
          links={[
            {
              label: translate('Peer-to-Peer Payments'),
              href: '/docs/use-cases/payments/peer-to-peer-payments-uc',
            },
            {
              label: translate('Cross-Currency Payments'),
              href: '/docs/concepts/payment-types/cross-currency-payments',
            },
            {
              label: translate('Smart Contracts'),
              href: '/docs/use-cases/payments/smart-contracts-uc',
            },
          ]}
        />

        {/* 9b. Use Cases — Tokens */}
        <FeatureTwoColumn
          color="lilac"
          arrange="right"
          title={translate("Tokens")}
          description=""
          media={{ src: require('../static/img/bds-2026/docs-feature-media-2.jpg'), alt: translate('Tokens') }}
          links={[
            {
              label: translate('Stablecoin Issuer'),
              href: '/docs/use-cases/tokenization/stablecoin-issuer',
            },
            {
              label: translate('NFT Marketplace'),
              href: '/docs/use-cases/tokenization/nft-mkt-overview',
            },
            {
              label: translate('Digital Artist'),
              href: '/docs/use-cases/tokenization/digital-artist',
            },
          ]}
        />

        {/* 9c. Use Cases — On-Chain Finance */}
        <FeatureTwoColumn
          color="lilac"
          arrange="left"
          title={translate("On-Chain Finance")}
          description=""
          media={{ src: require('../static/img/bds-2026/docs-feature-media-3.jpg'), alt: translate('On-Chain Finance') }}
          links={[
            {
              label: translate('List XRP as an Exchange'),
              href: '/docs/use-cases/defi/list-xrp-as-an-exchange',
            },
            {
              label: translate('Trade with an Auction Slot'),
              href: '/docs/tutorials/javascript/amm/trade-with-auction-slot',
            },
          ]}
        />

        {/* 9d. Use Cases — Compliance Features */}
        <FeatureTwoColumn
          color="lilac"
          arrange="right"
          title={translate("Compliance Features")}
          description=""
          media={{ src: require('../static/img/bds-2026/docs-feature-media.jpg'), alt: translate('Compliance Features') }}
          links={[
            {
              label: translate('Build a Credential Issuing Service'),
              href: '/docs/tutorials/javascript/build-apps/credential-issuing-service',
            },
            {
              label: translate('Create a Permissioned Domain'),
              href: '/docs/tutorials/javascript/compliance/create-permissioned-domains',
            },
          ]}
        />
      </FeatureTwoColumnWrapper>

      {/* 10. SDK Tiles */}
      <SmallTilesSection
        headline={translate("Build with SDKs")}
        cardVariant="neutral"
        cards={[
          {
            icon: require('../static/img/logos/black/js.svg'),
            iconAlt: translate('JavaScript'),
            label: translate('Get Started with Javascript'),
            href: '/docs/tutorials/javascript',
          },
          {
            icon: require('../static/img/logos/black/python.svg'),
            iconAlt: translate('Python'),
            label: translate('Python'),
            href: '/docs/tutorials/python',
          },
          {
            icon: require('../static/img/logos/black/java.svg'),
            iconAlt: translate('Java'),
            label: translate('Java'),
            href: '/docs/tutorials/java/build-apps/get-started',
          },
          {
            icon: require('../static/img/logos/black/go.svg'),
            iconAlt: translate('Go'),
            label: translate('Go'),
            href: '/docs/tutorials/go',
          },
          {
            icon: require('../static/img/logos/black/php.svg'),
            iconAlt: translate('PHP'),
            label: translate('PHP'),
            href: '/docs/tutorials/php',
          },
        ]}
      />

      {/* 11. Infrastructure Cards */}
      <CardsIconGrid
        heading={translate("XRPL Infrastructure: Running a Server")}
        cards={[
          {
            icon: require('../static/img/icons/2026/color/lilac/xrpl-server.svg'),
            iconAlt: translate('Server'),
            heading: translate('Install Your XRPL Server: Rippled & Clio'),
            description: (
              <>
                {translate("Take ownership of your connection to the blockchain with a core server that can submit transactions, read balances, and store a complete copy of the ledger data.")}{' '}
                <a href="/docs/infrastructure/installation">{translate("Learn More")}</a>
              </>
            ),
          },
          {
            icon: require('../static/img/icons/2026/color/lilac/node-configuration.svg'),
            iconAlt: translate('Network'),
            heading: translate('Node Configuration'),
            description: (
              <>
                {translate("Customize your server configuration for your use case, including data retention, network connectivity, and performance tuning.")}{' '}
                <a href="/docs/infrastructure/configuration">{translate("Learn More")}</a>
              </>
            ),
          },
          {
            icon: require('../static/img/icons/2026/color/lilac/troubleshooting-node.svg'),
            iconAlt: translate('Tools'),
            heading: translate('Troubleshooting Your Node'),
            description: (
              <>
                {translate("Diagnose and solve problems with your server to maximize uptime and reliability.")}{' '}
                <a href="/docs/infrastructure/troubleshooting">{translate("Learn More")}</a>
              </>
            ),
          },
        ]}
      />

      {/* 12. Contribute Cards */}
      <StandardCardGroupSection
        headline={translate("Get Involved: Contribute to the XRP Ledger")}
        description=""
        variant="neutral"
        cards={[
          {
            headline: translate('Contribute to the Protocol'),
            callsToAction: [
              { children: translate('Contribute Now'), href: '/resources/contribute-code' },
            ],
            children: translate(
              'Have you identified gaps, edge cases, or improvements through real-world use? Contribute code or proposals and help shape the future of XRPL at the protocol level.'
            ),
          },
          {
            headline: translate('Contribute to Docs'),
            callsToAction: [
              {
                children: translate('Contribute Now'),
                href: '/resources/contribute-documentation',
              },
            ],
            children: (
              <>
                {translate("Contribute to")}{' '}
                <a href="https://xrpl.org/" target="_blank" rel="noreferrer">
                  {translate("XRPL.org")}
                </a>
                {translate(", the go-to resource for all things XRP Ledger.")}
              </>
            ),
          },
          {
            headline: translate('Contribute a Blog Post'),
            callsToAction: [
              {
                children: translate('Contribute Now'),
                href: '/resources/contribute-blog',
              },
            ],
            children: translate(
              'Share how you solved a real-world problem using the XRP Ledger, including your architecture decisions, workflows, tradeoffs, and lessons learned. Contribute a blog post to help other developers build faster.'
            ),
          },
        ]}
      />

      {/* 13. Continuous Learning Cards */}
      <StandardCardGroupSection
        headline={translate("Continuous Learning: Additional XRPL Resources")}
        description=""
        variant="neutral"
        cards={[
          {
            headline: translate('XRPL Learning Portal'),
            callsToAction: [
              { children: translate('Learn More'), href: 'https://learn.xrpl.org/' },
            ],
            children: translate(
              'From blockchain fundamentals to building on the XRPL, create your own learning journey and progress at your own pace.'
            ),
          },
          {
            headline: translate('Aquarium Residency Program'),
            callsToAction: [
              {
                children: translate('Learn More'),
                href: 'https://www.xrpl-commons.org/residency',
              },
            ],
            children: translate(
              'A hands-on residency program helping teams build, test, and launch real-world solutions on the XRP Ledger.'
            ),
          },
          {
            headline: translate('Developer Community Forum'),
            callsToAction: [
              {
                children: translate('Learn More'),
                href: 'https://discord.gg/sfX3ERAMjH',
              },
            ],
            children: translate(
              'Join the XRPL developer community on Discord! Ask questions, share tips, and collaborate with builders turning ideas into real-world projects.'
            ),
          },
        ]}
      />
    </PageWrapper>
  );
}
