import * as React from 'react';
import HeaderHeroPrimaryMedia from 'shared/sections/HeaderHeroPrimaryMedia/HeaderHeroPrimaryMedia';
import { CarouselCardList } from 'shared/sections/CarouselCardList/CarouselCardList';
import { CardsTextGrid } from 'shared/sections/CardsTextGrid/CardsTextGrid';
import FeaturedVideoHero from 'shared/sections/FeaturedVideoHero/FeaturedVideoHero';
import { LinkSmallGrid } from 'shared/sections/LinkSmallGrid/LinkSmallGrid';
import { LinkTextDirectory } from 'shared/sections/LinkTextDirectory/LinkTextDirectory';
import { FeatureTwoColumn } from 'shared/sections/FeatureTwoColumn/FeatureTwoColumn';
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
  return (
    <div className="landing page-docs page-docs-index">

      {/* 1. Hero */}
      <HeaderHeroPrimaryMedia
        headline="XRP Ledger (XRPL) Documentation"
        subtitle="Explore XRPL documentation with our essential guide for developers and admins who want to start building and integrating with the XRP Ledger."
        media={{ type: 'image', src: require('../static/img/bds-2026/HeroMedia.jpg'), alt: 'XRPL Documentation' }}
      />

      {/* 2. Get Started Carousel */}
      <CarouselCardList
        variant="green"
        buttonVariant="green"
        heading="Get Started: XRPL Developer & Admin Resources"
        description="Learn your way. Read docs, watch videos, or get hands-on with code samples. Explore different ways to learn on the XRP Ledger."
        cards={[
          {
            icon: require('../static/img/icons/2026/black/Ready-to-Use-Code-Samples.svg'),
            title: 'Ready-to-Use Code Samples',
            description:
              'Run complete code snippets to understand XRPL integration in seconds.',
            href: '/docs/tutorials/',
          },
          {
            icon: require('../static/img/icons/2026/black/Launch-Your-First-Project.svg'),
            title: 'Launch Your First Project',
            description:
              'Explore funding and development opportunities for your project on the XRPL.',
            href: '/resources/grant-funding/',
          },
          {
            icon: require('../static/img/icons/2026/black/Step-by-Step-Tutorials.svg'),
            title: 'Step-by-Step Tutorials',
            description:
              'Follow guided walkthroughs to master XRPL fundamentals and industry best practices.',
            href: '/docs/tutorials/',
          },
        ]}
      />

      {/* 3. Core Concepts Text Grid */}
      <CardsTextGrid
        heading="Dig Into Core Concepts & Tools"
        cards={[
          {
            heading: 'XRPL Fundamentals',
            description: (
              <>
                Discover the basics of the XRPL by learning about accounts,
                transactions, and the ledger structure.{' '}<br/><br/>
                <a href="/docs/concepts/">Read More</a>
              </>
            ),
          },
          {
            heading: 'Advanced XRPL Topics: Go Deeper',
            description: (
              <>
                Implement real-world solutions by combining XRPL primitives for
                lending, token issuance, DEX trading, and more.{' '}<br/><br/>
                <a href="/docs/use-cases/">Read More</a>
              </>
            ),
          },
        ]}
      />

      {/* 4. Featured Video — Advanced Payment Features */}
      <FeaturedVideoHero
        headline="Advanced Payment Features"
        subtitle="Master sophisticated movement of value through features such as escrows, checks, or payment channels."
        video={{
          source: {
            type: 'embed',
            embedUrl: 'https://www.youtube.com/embed/e2Iwsk37LMk',
          },
        }}
        links={[
          {
            label: 'Watch Now',
            href: 'https://youtube.com/playlist?list=PLJQ55Tj1hIVZtJ_JdTvSum2qMTsedWkNi',
          },
        ]}
      />

      {/* 5. Featured Video — Governance */}
      <FeaturedVideoHero
        headline="Governance and the Amendment Process"
        subtitle="Understand how the decentralized network evolves through validator voting and how new features are activated."
        video={{
          source: {
            type: 'embed',
            embedUrl: 'https://www.youtube.com/embed/4GbRdanHoR4',
          },
        }}
        links={[
          {
            label: 'Watch Now',
            href: 'https://youtube.com/playlist?list=PLJQ55Tj1hIVZtJ_JdTvSum2qMTsedWkNi',
          },
        ]}
      />

      {/* 6. Developer Reference Links */}
      <LinkSmallGrid
        variant="gray"
        heading="Developers"
        description="Master the Protocol: Essential References"
        links={[
          {
            label: 'Transaction Types',
            href: '/docs/references/protocol/transactions/types',
          },
          {
            label: 'Account Methods',
            href: '/docs/references/http-websocket-apis/public-api-methods/account-methods',
          },
          {
            label: 'Ledger Entry Types',
            href: '/docs/references/protocol/ledger-data/ledger-entry-types',
          },
          {
            label: 'Transaction Methods',
            href: '/docs/references/http-websocket-apis/public-api-methods/transaction-methods',
          },
          {
            label: 'Basic Data Types',
            href: '/docs/references/protocol/data-types/basic-data-types',
          },
          {
            label: 'Path and Orderbook Methods',
            href: '/docs/references/http-websocket-apis/public-api-methods/path-and-order-book-methods',
          },
        ]}
      />

      {/* 7. Server Admin Reference Links */}
      <LinkSmallGrid
        variant="gray"
        heading="Server Admins"
        description="Master the Protocol: Essential References"
        links={[
          {
            label: 'Commandline Usage',
            href: '/docs/infrastructure/commandline-usage',
          },
          {
            label: 'Admin API Methods',
            href: '/docs/references/http-websocket-apis/admin-api-methods',
          },
        ]}
      />

      {/* 8. Dev Tools Directory */}
      <LinkTextDirectory
        heading="Tools to Test & Deploy"
        cards={[
          {
            heading: 'Get Test XRP (Faucets)',
            description:
              'Get credentials and test-XRP for XRP Ledger Testnet or Devnet.',
            buttons: [
              { label: 'Access Here', href: '/resources/dev-tools/xrp-faucets' },
            ],
          },
          {
            heading: 'Send Test Transactions',
            description:
              'Test how your code handles various XRP Ledger transactions by sending them over the Testnet to the address.',
            buttons: [
              { label: 'Access Here', href: '/resources/dev-tools/tx-sender' },
            ],
          },
          {
            heading: 'Explore WebSocket API',
            description:
              'Send sample requests and get responses from the rippled API.',
            buttons: [
              {
                label: 'Access Here',
                href: '/resources/dev-tools/websocket-api-tool',
              },
            ],
          },
          {
            heading: 'Monitor the XRP Ledger',
            description:
              'View validations of new ledger versions in real-time, chart the location of servers in the XRP Ledger.',
            buttons: [
              { label: 'Access Here', href: 'https://livenet.xrpl.org/' },
            ],
          },
        ]}
      />

      {/* 9a. Use Cases — Payments */}
      <FeatureTwoColumn
        color="lilac"
        arrange="left"
        title="Payments"
        description=""
        media={{ src: require('../static/img/bds-2026/FeatureMedia-1.jpg'), alt: 'Payments' }}
        links={[
          {
            label: 'Peer-to-Peer Payments',
            href: '/docs/use-cases/payments/peer-to-peer-payments-uc',
          },
          {
            label: 'Cross-Currency Payments',
            href: '/docs/concepts/payment-types/cross-currency-payments',
          },
          {
            label: 'Smart Contracts',
            href: '/docs/use-cases/payments/smart-contracts-uc',
          },
        ]}
      />

      {/* 9b. Use Cases — Tokens */}
      <FeatureTwoColumn
        color="lilac"
        arrange="right"
        title="Tokens"
        description=""
        media={{ src: require('../static/img/bds-2026/FeatureMedia-2.jpg'), alt: 'Tokens' }}
        links={[
          {
            label: 'Stablecoin Issuer',
            href: '/docs/use-cases/tokenization/stablecoin-issuer',
          },
          {
            label: 'NFT Marketplace',
            href: '/docs/use-cases/tokenization/nft-mkt-overview',
          },
          {
            label: 'Digital Artist',
            href: '/docs/use-cases/tokenization/digital-artist',
          },
        ]}
      />

      {/* 9c. Use Cases — On-Chain Finance */}
      <FeatureTwoColumn
        color="lilac"
        arrange="left"
        title="On-Chain Finance"
        description=""
        media={{ src: require('../static/img/bds-2026/FeatureMedia-3.jpg'), alt: 'On-Chain Finance' }}
        links={[
          {
            label: 'List XRP as an Exchange',
            href: '/docs/use-cases/defi/list-xrp-as-an-exchange',
          },
          {
            label: 'Trade with an Auction Slot',
            href: '/docs/tutorials/javascript/amm/trade-with-auction-slot',
          },
        ]}
      />

      {/* 9d. Use Cases — Compliance Features */}
      <FeatureTwoColumn
        color="lilac"
        arrange="right"
        title="Compliance Features"
        description=""
        media={{ src: require('../static/img/bds-2026/FeatureMedia.jpg'), alt: 'Compliance Features' }}
        links={[
          {
            label: 'Build a Credential Issuing Service',
            href: '/docs/tutorials/javascript/build-apps/credential-issuing-service',
          },
          {
            label: 'Create a Permissioned Domain',
            href: '/docs/tutorials/javascript/compliance/create-permissioned-domains',
          },
        ]}
      />

      {/* 10. SDK Tiles */}
      <SmallTilesSection
        headline="Build with SDKs"
        cardVariant="neutral"
        cards={[
          {
            icon: require('../static/img/logos/black/js.svg'),
            iconAlt: 'JavaScript',
            label: 'Get Started with Javascript',
            href: '/docs/tutorials/javascript',
          },
          {
            icon: require('../static/img/logos/black/python.svg'),
            iconAlt: 'Python',
            label: 'Python',
            href: '/docs/tutorials/python',
          },
          {
            icon: require('../static/img/logos/black/java.svg'),
            iconAlt: 'Java',
            label: 'Java',
            href: '/docs/tutorials/java/build-apps/get-started',
          },
          {
            icon: require('../static/img/logos/black/go.svg'),
            iconAlt: 'Go',
            label: 'Go',
            href: '/docs/tutorials/go',
          },
          {
            icon: require('../static/img/logos/black/php.svg'),
            iconAlt: 'PHP',
            label: 'PHP',
            href: '/docs/tutorials/php',
          },
        ]}
      />

      {/* 11. Infrastructure Cards */}
      <CardsIconGrid
        heading="XRPL Infrastructure: Running a Server"
        cards={[
          {
            icon: require('../static/img/icons/2026/color/lilac/xrpl-server.svg'),
            iconAlt: 'Server',
            heading: 'Install Your XRPL Server: Rippled & Clio',
            description: (
              <>
                Take ownership of your connection to the blockchain with a core
                server that can submit transactions, read balances, and store a
                complete copy of the ledger data.{' '}
                <a href="/docs/infrastructure/installation">Learn More</a>
              </>
            ),
          },
          {
            icon: require('../static/img/icons/2026/color/lilac/node-configuration.svg'),
            iconAlt: 'Network',
            heading: 'Node Configuration',
            description: (
              <>
                Customize your server configuration for your use case, including
                data retention, network connectivity, and performance tuning.{' '}
                <a href="/docs/infrastructure/configuration">Learn More</a>
              </>
            ),
          },
          {
            icon: require('../static/img/icons/2026/color/lilac/troubleshooting-node.svg'),
            iconAlt: 'Tools',
            heading: 'Troubleshooting Your Node',
            description: (
              <>
                Diagnose and solve problems with your server to maximize uptime
                and reliability.{' '}
                <a href="/docs/infrastructure/troubleshooting">Learn More</a>
              </>
            ),
          },
        ]}
      />

      {/* 12. Contribute Cards */}
      <StandardCardGroupSection
        headline="Get Involved: Contribute to the XRP Ledger"
        description=""
        variant="neutral"
        cards={[
          {
            headline: 'Contribute to the Protocol',
            callsToAction: [
              { children: 'Contribute Now', href: '/resources/contribute-code' },
            ],
            children:
              'Have you identified gaps, edge cases, or improvements through real-world use? Contribute code or proposals and help shape the future of XRPL at the protocol level.',
          },
          {
            headline: 'Contribute to Docs',
            callsToAction: [
              {
                children: 'Contribute Now',
                href: '/resources/contribute-documentation',
              },
            ],
            children: (
              <>
                Contribute to{' '}
                <a href="https://xrpl.org/" target="_blank" rel="noreferrer">
                  XRPL.org
                </a>
                , the go-to resource for all things XRP Ledger.
              </>
            ),
          },
          {
            headline: 'Contribute a Blog Post',
            callsToAction: [
              {
                children: 'Contribute Now',
                href: '/resources/contribute-blog',
              },
            ],
            children:
              'Share how you solved a real-world problem using the XRP Ledger, including your architecture decisions, workflows, tradeoffs, and lessons learned. Contribute a blog post to help other developers build faster.',
          },
        ]}
      />

      {/* 13. Continuous Learning Cards */}
      <StandardCardGroupSection
        headline="Continuous Learning: Additional XRPL Resources"
        description=""
        variant="neutral"
        cards={[
          {
            headline: 'XRPL Learning Portal',
            callsToAction: [
              { children: 'Learn More', href: 'https://learn.xrpl.org/' },
            ],
            children:
              'From blockchain fundamentals to building on the XRPL, create your own learning journey and progress at your own pace.',
          },
          {
            headline: 'Aquarium Residency Program',
            callsToAction: [
              {
                children: 'Learn More',
                href: 'https://www.xrpl-commons.org/residency',
              },
            ],
            children:
              'A hands-on residency program helping teams build, test, and launch real-world solutions on the XRP Ledger.',
          },
          {
            headline: 'Developer Community Forum',
            callsToAction: [
              {
                children: 'Learn More',
                href: 'https://discord.gg/sfX3ERAMjH',
              },
            ],
            children:
              'Join the XRPL developer community on Discord! Ask questions, share tips, and collaborate with builders turning ideas into real-world projects.',
          },
        ]}
      />
    </div>
  );
}
