import { useThemeHooks } from "@redocly/theme/core/hooks";
import { Link } from "shared/components/Link";
import { PageWrapper } from "shared/components/PageWrapper";
import { HeaderHeroSplitMedia } from "shared/sections/HeaderHeroSplitMedia/HeaderHeroSplitMedia";
import FeaturedVideoHero from "shared/sections/FeaturedVideoHero/FeaturedVideoHero";
import { LinkTextDirectory } from "shared/sections/LinkTextDirectory/LinkTextDirectory";
import { CardsFeatured } from "shared/sections/CardsFeatured/CardsFeatured";
import { CarouselCardList } from "shared/sections/CarouselCardList/CarouselCardList";
import { LogoRectangleGrid } from "shared/sections/LogoRectangleGrid/LogoRectangleGrid";
import { CardsTextGrid } from "shared/sections/CardsTextGrid/CardsTextGrid";

export const frontmatter = {
  seo: {
    title: "Trading on the XRP Ledger",
    description:
      "Institutional DeFi (iDeFi) on the XRPL delivers high-speed, low-cost, compliance-first infrastructure for crypto trading and liquidity.",
  },
};

export default function Trading() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <PageWrapper className="landing">
      <HeaderHeroSplitMedia
        title={translate("Trading on the XRP Ledger")}
        description={translate(
          "Institutional DeFi (iDeFi) on the XRPL delivers high-speed, low-cost, compliance-first infrastructure for crypto trading and liquidity. Built for financial institutions, Web2 platforms, and crypto-native businesses, XRPL’s DEX and protocol ecosystem reduces complexity while preserving trust, transparency, and scale."
        )}
        media={{
          src: require("../../../static/img/bds-2026/trading-hero-media.jpg"),
          alt: translate("Trading on the XRP Ledger"),
        }}
      />

      <FeaturedVideoHero
        headline={translate("Compliance-First Trading on XRPL")}
        subtitle={translate(
          "Credentials and Permissioned Domains are native features that unlock private DeFi, enable regulated asset trading, and enforce KYC AML on-chain based on verified credentials. These tools create secure, programmable environments for trading tokenized money market funds, treasuries, and more."
        )}
        video={{
          source: {
            type: "embed",
            embedUrl: "https://fast.wistia.net/embed/iframe/14coho0rw2",
          },
          coverImage: {
            src: require("../../../static/img/bds-2026/trading-video-poster.jpg"),
            alt: translate("Compliance-First Trading on XRPL"),
          },
        }}
      />

      <LinkTextDirectory
        heading={translate("Why Trade on XRPL?")}
        cards={[
          {
            heading: translate("Instant Settlement and Low Fees"),
            description: translate(
              "Settle transactions in 3-5 seconds for a fraction of a cent."
            ),
            buttons: [],
          },
          {
            heading: translate("No Third-Party Contract Risk"),
            description: translate(
              "Built into XRPL for safer use:  no third-party contract risks, MEV-resistant by design, and self-custody of your funds by default."
            ),
            buttons: [],
          },
          {
            heading: translate("Unified Liquidity"),
            description: translate(
              "Unified liquidity pools for better pricing and execution."
            ),
            buttons: [],
          },
          {
            heading: translate("Compliance-First"),
            description: translate(
              "Asset controls and permissioned environments for regulatory alignment."
            ),
            buttons: [],
          },
        ]}
      />

      <CardsFeatured
        heading={translate("Use Cases to Meet Your Needs")}
        description=""
        cards={[
          {
            image: require("../../../static/img/bds-2026/trading-feature-media-1.jpg"),
            imageAlt: translate("Financial Institutions"),
            title: translate("Financial Institutions"),
            subtitle: translate(
              "• Permissioned FX trading with on-chain liquidity\n• Tokenized asset exchanges with compliance controls\n• Integrate onchain credit markets to fund strategies"
            ),
            buttonLabel: translate("Learn More"),
            href: "/docs/use-cases/defi",
          },
          {
            image: require("../../../static/img/bds-2026/trading-feature-media-2.jpg"),
            imageAlt: translate("Fintechs"),
            title: translate("Fintechs"),
            subtitle: translate(
              "• Embed instant, global payments in apps\n• Tap into a multi-asset liquidity ecosystem\n• Cross-border settlement without intermediaries"
            ),
            buttonLabel: translate("Learn More"),
            href: "/docs/use-cases/payments",
          },
          {
            image: require("../../../static/img/bds-2026/trading-feature-media-3.jpg"),
            imageAlt: translate("Unified Liquidity"),
            title: translate("Unified Liquidity"),
            subtitle: translate(
              "• Deploy trading pairs without contract risk\n• Tap into a multi-asset liquidity ecosystem\n• Integrate lending and borrowing with native XRPL tools"
            ),
            buttonLabel: translate("Learn More"),
            href: "/docs/concepts/tokens/decentralized-exchange",
          },
        ]}
      />

      <CarouselCardList
        variant="green"
        buttonVariant="green"
        heading={translate("Defining Trading Features on XRPL")}
        description=""
        cards={[
          {
            icon: require("../../../static/img/icons/2026/black/hybrid-dex.svg"),
            title: translate("Hybrid DEX"),
            description: translate(
              "Utilize XRP Ledger's native decentralized exchange (DEX) with integrated Automated Market Makers (AMM) and onchain 24/7 order books, providing a developer-friendly environment to create DeFi solutions for traditional finance applications."
            ),
            href: "/docs/concepts/tokens/decentralized-exchange",
          },
          {
            icon: require("../../../static/img/icons/2026/black/compliance-primitive.svg"),
            title: translate("Compliance Primitive"),
            description: translate(
              "Use built-in logic to stay compliant: freeze funds, manage access, control order books, and enforce access controls on-chain based on verified credentials."
            ),
            href: "/docs/concepts/transactions",
          },
          {
            icon: require("../../../static/img/icons/2026/black/token-standards.svg"),
            title: translate("Token Standards"),
            description: translate(
              "Adopt token standards that fit your business and regulatory needs: MPTs, stablecoins, IOUs, and NFTs."
            ),
            href: "/docs/concepts/tokens",
          },
          {
            icon: require("../../../static/img/icons/2026/black/transaction-simulation.svg"),
            title: translate("Transaction Simulation"),
            description: translate(
              "Remove execution risk and achieve clarity on transaction economics with transaction simulation."
            ),
            href: "/docs/references/http-websocket-apis/public-api-methods/transaction-methods/simulate",
          },
          {
            icon: require("../../../static/img/icons/2026/black/native-lending-protocol.svg"),
            title: translate("Native Lending Protocol"),
            description: translate(
              "Access deep, affordable capital directly on-chain to power your trading strategies."
            ),
            href: "/docs/concepts/tokens/lending-protocol",
          },
        ]}
      />


      <CardsTextGrid
        heading={translate("Get Started")}
        cards={[
          {
            heading: translate("Read the Trading Documentation"),
            description: (
              <>
                {translate(
                  "Deep dive into XRPL’s DEX, liquidity pools, and lending protocols."
                )}
                <br />
                <br />
                <Link href="https://xrpl.org/docs/tutorials/how-tos/use-tokens/trade-in-the-decentralized-exchange" intention="neutral">
                  {translate("Read the Documentation")}
                </Link>
                {" • "}
                <Link href="https://discord.com/invite/xrpl" intention="neutral">
                  {translate("Join the Developer Community")}
                </Link>
              </>
            ),
          },
          {
            heading: translate("Explore Ecosystem Partners"),
            description: (
              <>
                {translate(
                  "Connect with other builders and XRPL engineers. Find tooling, integrations, and liquidity providers."
                )}
                <br />
                <br />
                <Link href="https://xrpl.org/about/uses" intention="neutral">
                  {translate("Explore Partners")}
                </Link>
              </>
            ),
          },
        ]}
      />
    </PageWrapper>
  );
}
