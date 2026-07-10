import { useThemeHooks } from "@redocly/theme/core/hooks";
import { PageWrapper } from "shared/components/PageWrapper";
import { CalloutMediaBanner } from "shared/sections/CalloutMediaBanner";
import { CardStats, CardStatsProps } from "shared/sections/CardStatsList";
import { LinkTextDirectory, LinkTextDirectoryProps } from "shared/sections/LinkTextDirectory";
import {
  FeatureTwoColumn,
  FeatureTwoColumnWrapper,
} from "shared/sections/FeatureTwoColumn";
import { LogoSquareGrid } from "shared/sections/LogoSquareGrid";
import { StandardCardGroupSection } from "shared/sections/StandardCardGroupSection/StandardCardGroupSection";
import { FeatureSingleTopic } from "shared/sections/FeatureSingleTopic";
import type { StandardCardPropsWithoutVariant } from "shared/components/StandardCard";
import { BdsLink } from "shared/components/Link";
import { HomeHero } from "shared/sections/HomeHero/HomeHero";
import { CarouselFeatured } from "shared/patterns/CarouselFeatured";

export const frontmatter = {
  seo: {
    title: "XRP Ledger Home | XRPL.org",
    description:
      "XRPL.org is a community-driven site for the XRP Ledger (XRPL), an open-source, public blockchain. Gain access to technical documentation, reference materials, and blockchain ledger tools.",
  },
};

const HUBSPOT_NEWSLETTER_FORM =
  "https://share.hsforms.com/18zNvJDR4QbObGPLDh3n5Bw4vgrs";

export default function Index() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  const blockchainCardStats: CardStatsProps["cards"] = [
    {
      statistic: translate("12 Years"),
      label: translate("Continuous uptime"),
      superscript: "+",
      variant: "lilac",
    },
    {
      statistic: translate("7M"),
      label: translate("Active wallets"),
      superscript: "+",
      variant: "light-gray",
    },
    {
      statistic: translate("$1T"),
      label: translate("Value Moved"),
      superscript: "+",
      variant: "dark-gray",
    },
    {
      statistic: translate("~$0.00025"),
      label: translate("Predictable, ultra-low fees"),
      variant: "green",
    },
  ];

  const complianceDirectoryCards: LinkTextDirectoryProps["cards"] = [
    {
      heading: translate("Tokenization"),
      description: translate(
        "Tokenization solutions that make it easy to bring financial markets on-chain and enable dynamic, transparent and efficient financing",
      ),
      buttons: [{ label: translate("Find Out More"), href: "/docs/use-cases/tokenization" }],
    },
    {
      heading: translate("Payments"),
      description: translate(
        "Simple APIs and built-in compliance and custody infrastructure for Fintechs and PSPs to integrate, launch and scale stablecoin payments",
      ),
      buttons: [{ label: translate("Find Out More"), href: "/docs/use-cases/payments" }],
    },
    {
      heading: translate("Trading (Coming Soon)"),
      description: translate(
        "Built-in trading infrastructure that blends order book precision with AMM efficiency and gives institutions the efficiency they need, with the control they expect",
      ),
    },
    {
      heading: translate("Lending (Coming Soon)"),
      description: translate(
        "Native lending protocol enabling onchain credit origination with fixed-term, interest-accruing loans, and off-chain underwriting and risk management",
      ),
    },
  ];

  const beginJourneyCards: readonly StandardCardPropsWithoutVariant[] = [
    {
      headline: translate("Documentation"),
      children: translate(
        "Access the documentation you need to get started working with the XRPL.",
      ),
      callsToAction: [
        { children: translate("Documentation"), href: "/docs" },
      ] as const,
    },
    {
      headline: translate("Guided Tutorials"),
      children: translate("Follow step-by-step tutorials for frequent tasks."),
      callsToAction: [
        { children: translate("Start Tutorials"), href: "/docs/tutorials" },
      ] as const,
    },
    {
      headline: translate("XRPL Fundamentals"),
      children: translate("Read about the XRPL's foundational concepts."),
      callsToAction: [
        {
          children: translate("Foundational Concepts"),
          href: "/docs/introduction",
        },
      ] as const,
    },
    {
      headline: translate("Client Libraries"),
      children: (
        <span>
          {translate("Find tools, documentation, and sample code in")}{" "}
          <BdsLink
            variant="inline"
            href="/docs/tutorials/get-started/get-started-python"
          >
            {translate("Python")}
          </BdsLink>
          ,{" "}
          <BdsLink
            variant="inline"
            href="/docs/tutorials/get-started/get-started-java"
          >
            {translate("Java")}
          </BdsLink>
          ,{" "}
          <BdsLink
            variant="inline"
            href="/docs/tutorials/get-started/get-started-javascript?environment=Node"
          >
            {translate("JavaScript")}
          </BdsLink>
          {translate(", or use")}{" "}
          <BdsLink
            variant="inline"
            href="/docs/tutorials/get-started/get-started-http-websocket-apis"
          >
            {translate("HTTP APIs")}
          </BdsLink>
          .
        </span>
      ),
      callsToAction: [
        {
          children: translate("Explore Client Libraries"),
          href: "/docs/references/client-libraries",
        },
      ] as const,
    },
    {
      headline: translate("Get Inspired"),
      children: translate("See what your peers have built on the XRPL."),
      callsToAction: [
        {
          children: translate("Built on the XRPL"),
          href: "/docs/use-cases",
        },
      ] as const,
    },
    {
      headline: translate("XRPL Learning Portal"),
      children: (
        <span>
          {translate("Start with the basics and then learn about")}{" "}
          <BdsLink variant="inline" href="/docs/use-cases/defi">
            {translate("DeFi")}
          </BdsLink>
          ,{" "}
          <BdsLink variant="inline" href="/docs/use-cases/tokenization">
            {translate("tokenization")}
          </BdsLink>
          ,{" "}
          <BdsLink
            variant="inline"
            href="/docs/concepts/tokens/decentralized-exchange"
          >
            {translate("DEX")}
          </BdsLink>{" "}
          {translate("trading, or how to issue stablecoins.")}
        </span>
      ),
      callsToAction: [
        {
          children: translate("Learn Now"),
          href: "/docs/introduction",
        },
      ] as const,
    },
  ];

  return (
    <PageWrapper className="landing page-home overflow-hidden">
      <HomeHero
        titleLines={[
          translate("Built for Finance."),
          translate("Powered by Developers."),
        ]}
        subtitle={translate("Trusted by Institutions.")}
        media={{
          src: "/img/home/ripple-icon-timed.png",
          alt: translate("XRPL home graphic"),
          width: 1280,
          height: 458,
        }}
      />

      <CalloutMediaBanner
        variant="gray"
        heading={translate("XRP Ledger")}
        headingAs="h2"
        backgroundImage={"/img/backgrounds/callout-light.jpg"}
        backgroundImageDark={"/img/backgrounds/callout-dark.jpg"}
        subheading={translate(
          "A decentralized public Layer 1 blockchain for creating, transferring, and exchanging digital assets with a focus on compliance. ",
        )}
        buttons={[{ label: translate("Get Started"), href: "/docs" }]}
      />

      <CardStats
        heading={translate("Blockchain Trusted at Scale")}
        description={translate(
          "Streamline development and build powerful RWA tokenization solutions with XRP Ledger's comprehensive developer toolset.",
        )}
        cards={blockchainCardStats}
      />

      <CarouselFeatured
        slides={[
          {
            id: 0,
            heading: translate("Built for Finance"),
            features: [
              {
                title: translate("Low Cost, High-Speed:"),
                description: translate(
                  "Transactions settle in 3-5 seconds for fractions of a cent",
                ),
              },
              {
                title: translate("Compliance-Focused:"),
                description: translate(
                  "10+ years of enterprise-grade resilience and continuous performance",
                ),
              },
              {
                title: translate("Multi Asset Support:"),
                description: translate(
                  "From stablecoins to tokenized real-world assets",
                ),
              },
            ],
            imageSrc: "/img/home/coin-finance.png",
            imageAlt: translate("Built for Finance"),
          },
          {
            id: 1,
            heading: translate("Powered by Developers"),
            features: [
              {
                title: translate("$1B+ XRP Grants Program:"),
                description: translate(
                  "Available for developers and projects building on XRPL",
                ),
              },
              {
                title: translate("Easy-to-Integrate APIs:"),
                description: translate(
                  "Build with common languages and skip complex smart contract development",
                ),
              },
              {
                title: translate("Full Lifecycle Support:"),
                description: translate(
                  "From dev tools and testnets to deployment and growth-stage",
                ),
              },
            ],
            imageSrc: "/img/home/keyboard-switch.png",
            imageAlt: translate("Powered by Developers"),
          },
          {
            id: 2,
            heading: translate("Trusted by Institutions"),
            features: [
              {
                title: translate("Utilized by Ripple:"),
                description: translate(
                  "One of the leading names in enterprise blockchain",
                ),
              },
              {
                title: translate("Institutional-Grade Infrastructure:"),
                description: translate(
                  "Trusted network of on/off ramps, custodians, and compliance providers",
                ),
              },
              {
                title: translate("70+ Institutional Partners:"),
                description: translate(
                  "A growing ecosystem of regulated issuers, fintechs, and builders",
                ),
              },
            ],
            imageSrc: "/img/home/xrpl-scaffolding.png",
            imageAlt: translate("Trusted by Institutions"),
          },
        ]}
        background="grey"
      />

      <LinkTextDirectory
        heading={translate("The Compliance-Focused Financial Blockchain")}
        cards={complianceDirectoryCards}
      />

      <CalloutMediaBanner
        variant="default"
        heading={translate("The Future of Finance is Already Onchain")}
        headingAs="h2"
        subheading={translate(
          "XRPL delivers immediate value: faster, cheaper settlement with broad access and full-stack flexibility. XRPL is built for the evolving financial system.",
        )}
      />

      <FeatureTwoColumnWrapper>
        <FeatureTwoColumn
          color="green"
          arrange="left"
          title={translate("Institutions")}
          description={translate(
            "Banks, asset managers, PSPs, and fintechs use XRPL to build financial products and DeFi solutions efficiently and with more flexibility.",
          )}
          links={[
            {
              label: translate("Explore Institutional Use Cases"),
              href: "/docs/use-cases/",
            },
          ]}
          media={{
            src: "/img/home/xrpl-building-institutions.jpg",
            alt: translate("Image of institutions using XRPL"),
          }}
        />
        <FeatureTwoColumn
          arrange="right"
          color="yellow"
          title={translate("Developers")}
          description={translate(
            "Open-source tools, SDKs in multiple languages, and a thriving global community make XRPL the ideal environment to build.",
          )}
          media={{
            src: "/img/home/xrpl-building-developers.jpg",
            alt: translate("Image of developers using XRPL"),
          }}
          links={[
            {
              label: translate("Explore the Developer Hub"),
              href: "/develop",
            },
          ]}
        />
      </FeatureTwoColumnWrapper>

      <LogoSquareGrid
        heading={translate("Explore Institutional Use Cases")}
        variant="gray"
        buttons={[
          {
            label: translate("View All"),
            href: "/docs/use-cases/",
          },
        ]}
        logos={[
          {
            logo: "/img/home/ondo-finance.svg",
            alt: translate("Ondo Finance logo"),
          },
          {
            logo: "/img/home/archax-logo.svg",
            alt: translate("Archax logo"),
          },
          {
            logo: "/img/home/logo-zonix.svg",
            alt: translate("Zoniqx logo"),
          },
          {
            logo: "/img/logos/black/zeconomy.png",
            alt: translate("Zeconomy logo"),
          },
        ]}
      />

      <StandardCardGroupSection
        variant="blue"
        headline={translate("Begin Your Journey")}
        description={translate(
          "XRPL delivers immediate value: faster, cheaper settlement with broad access and full-stack flexibility. XRPL is built for the evolving financial system.",
        )}
        cards={beginJourneyCards}
      />

      <FeatureSingleTopic
        variant="default"
        orientation="left"
        title={translate("Stay Connected")}
        description={translate(
          "Join our community and stay in the loop. Get the latest insights on payments, tokenization, trading, and more — straight to your inbox.",
        )}
        buttons={[
          {
            label: translate("Sign Up to Newsletter"),
            href: HUBSPOT_NEWSLETTER_FORM,
          },
        ]}
        media={{
          src: "/img/home/men-review-app.png",
          alt: translate("Image of a man reviewing an app"),
        }}
      />
    </PageWrapper>
  );
}
