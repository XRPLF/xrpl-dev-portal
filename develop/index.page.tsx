import { useThemeHooks } from "@redocly/theme/core/hooks";
import { PageWrapper } from "shared/components/PageWrapper";
import { HeaderHeroSplitMedia } from "shared/sections/HeaderHeroSplitMedia/HeaderHeroSplitMedia";
import { CardsFeatured } from "shared/sections/CardsFeatured/CardsFeatured";
import { StandardCardGroupSection } from "shared/sections/StandardCardGroupSection/StandardCardGroupSection";
import { LogoSquareGrid } from "shared/sections/LogoSquareGrid";
import { FeatureTwoColumn, FeatureTwoColumnWrapper } from "shared/sections/FeatureTwoColumn";
import { LinkTextDirectory } from "shared/sections/LinkTextDirectory/LinkTextDirectory";
import { FeatureSingleTopic } from "shared/sections/FeatureSingleTopic/FeatureSingleTopic";

export const frontmatter = {
  seo: {
    title: "XRPL Developer Portal",
    description:
      "Build on XRPL: everything you need to go from idea to launch—documentation, SDKs, code samples, tutorials, and tools to build real-world apps on a decentralized, enterprise-grade ledger.",
  },
};

export default function Develop() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <PageWrapper className="landing">
      <HeaderHeroSplitMedia
        title={translate("XRPL Developer Portal")}
        subtitle={translate(
          "Build on XRPL: Your All-in-One Blockchain Developer Portal"
        )}
        description={translate(
          "Everything you need to go from idea to launch—documentation, SDKs, code samples, tutorials, and tools to build real-world apps on a decentralized, enterprise-grade ledger."
        )}
        primaryCta={{
          label: translate("Start Building"),
          href: "/docs",
        }}
        secondaryCta={{
          label: translate("Explore Tools"),
          href: "/resources/dev-tools",
        }}
        media={{
          src: require("../static/img/bds-2026/develop-hero-media.jpg"),
          alt: translate("XRPL Developer Portal"),
        }}
      />

      <CardsFeatured
        heading={translate("Learn the Fundamentals")}
        description={translate(
          "Start with the basics: clear concepts, in-depth tutorials, and comprehensive docs."
        )}
        cards={[
          {
            image: require("../static/img/bds-2026/develop-feature-media-1.jpg"),
            imageAlt: translate("Documentation"),
            title: translate("Documentation"),
            subtitle: translate(
              "Access everything you need to get started on the XRPL."
            ),
            buttonLabel: translate("Documentation"),
            href: "/docs",
          },
          {
            image: require("../static/img/bds-2026/develop-feature-media-2.jpg"),
            imageAlt: translate("Guided Tutorials"),
            title: translate("Guided Tutorials"),
            subtitle: translate(
              "Follow step-by-step guides for frequent tasks."
            ),
            buttonLabel: translate("Tutorials"),
            href: "/docs/tutorials",
          },
          {
            image: require("../static/img/bds-2026/develop-feature-media-3.jpg"),
            imageAlt: translate("Concepts"),
            title: translate("Concepts"),
            subtitle: translate(
              "Read about the XRPL's foundational concepts."
            ),
            buttonLabel: translate("Concepts"),
            href: "/docs/concepts",
          },
        ]}
      />

      <StandardCardGroupSection
        headline={translate("Build with Our Tools")}
        description={translate(
          "Go from zero to code with SDKs, client libraries, and practical samples."
        )}
        variant="green"
        cards={[
          {
            headline: translate("SDKs & Libraries"),
            children: translate(
              "Access everything you need to get started on the XRPL."
            ),
            callsToAction: [
              {
                children: translate("Access Here"),
                href: "/docs/references/client-libraries",
              },
            ],
          },
          {
            headline: translate("Code Samples"),
            children: translate(
              "Browse sample code for building common use cases on the XRP Ledger"
            ),
            callsToAction: [
              {
                children: translate("Access Here"),
                href: "/resources/code-samples",
              },
            ],
          },
          {
            headline: translate("Developer Tools"),
            children: translate(
              "Use the developer tools to test, explore, and validate XRP Ledger API requests and behavior."
            ),
            callsToAction: [
              {
                children: translate("Access Here"),
                href: "/resources/dev-tools",
              },
            ],
          },
        ]}
      />

      <LogoSquareGrid
        variant="gray"
        heading={translate("Apply to Real-World Use Cases")}
        description={translate(
          "See how XRPL powers tokenization, payments, credit markets, and beyond."
        )}
        buttons={[
          {
            label: translate("See What You Can Build"),
            href: "/about/uses",
          },
        ]}
        logos={[
          {
            logo: require("../static/img/logos/black/archax.svg"),
            alt: translate("Archax"),
          },
          {
            logo: require("../static/img/logos/black/zoniqx.png"),
            alt: translate("Zoniqx"),
          },
          {
            logo: require("../static/img/logos/black/hidden-road.png"),
            alt: translate("Hidden Road"),
          },
          {
            logo: require("../static/img/logos/black/coinpayments.png"),
            alt: translate("Coinpayments"),
          },
          {
            logo: require("../static/img/logos/black/ripple.png"),
            alt: translate("Ripple"),
          },
          {
            logo: require("../static/img/logos/black/frii.png"),
            alt: translate("Frii"),
          },
          {
            logo: require("../static/img/logos/black/sologenic.png"),
            alt: translate("Sologenic"),
          },
          {
            logo: require("../static/img/logos/black/first-ledger.png"),
            alt: translate("First Ledger"),
          },
        ]}
      />

      <FeatureTwoColumnWrapper>
        <FeatureTwoColumn
          color="yellow"
          arrange="left"
          title={translate("XRPL Explorer")}
          description={translate(
            "Search, track, and understand XRP Ledger transactions through an open-source explorer."
          )}
          links={[
            {
              label: translate("XRPL Explorer"),
              href: "https://livenet.xrpl.org/",
            },
          ]}
          media={{
            src: require("../static/img/bds-2026/develop-feature-media-4.jpg"),
            alt: translate("XRPL Explorer"),
          }}
        />

        <FeatureTwoColumn
          color="yellow"
          arrange="right"
          title={translate("Testnet Faucet")}
          description={translate(
            "Use testnets to trial XRPL updates and apps safely, without putting real funds at risk"
          )}
          links={[
            {
              label: translate("Testnet Faucet"),
              href: "/resources/dev-tools/xrp-faucets",
            },
          ]}
          media={{
            src: require("../static/img/bds-2026/develop-feature-media-5.jpg"),
            alt: translate("Testnet Faucet"),
          }}
        />

        <FeatureTwoColumn
          color="yellow"
          arrange="left"
          title={translate("Simulate")}
          description={translate(
            "The simulate method executes a dry run of any transaction type, enabling you to preview the results and metadata of a transaction without committing them to the XRP Ledger."
          )}
          links={[
            {
              label: translate("Simulate"),
              href: "/docs/references/http-websocket-apis/public-api-methods/transaction-methods/simulate",
            },
          ]}
          media={{
            src: require("../static/img/bds-2026/develop-feature-media-6.jpg"),
            alt: translate("Simulate"),
          }}
        />
      </FeatureTwoColumnWrapper>

      <LinkTextDirectory
        heading={translate("Developer Resources")}
        description={translate(
          "Stay connected with the latest releases, integrations, funding, and real-world blockchain developer stories."
        )}
        cards={[
          {
            heading: translate("Known Amendments"),
            description: translate(
              "Quick access to the latest XRPL release notes, amendments (XLS), and technical specifications."
            ),
            buttons: [
              {
                label: translate("Access Here"),
                href: "/resources/known-amendments",
              },
            ],
          },
          {
            heading: translate("Integration Points"),
            description: translate(
              "Explore wallets, custodians, bridges, and other partner integrations that will aid you in building full end-to-end solutions."
            ),
            buttons: [
              {
                label: translate("Explore Here"),
                href: "/about/uses",
              },
            ],
          },
          {
            heading: translate("Funding & Grants"),
            description: translate(
              "Information on XRPL Grants and funding opportunities for developers."
            ),
            buttons: [
              {
                label: translate("Find Out Here"),
                href: "https://xrplgrants.org/",
              },
            ],
          },
          {
            heading: translate("XRPL Blog"),
            description: translate(
              "Blockchain developer-focused blogs such as Dev Reflections and case studies showcasing real-world XRPL builds."
            ),
            buttons: [
              {
                label: translate("Read Here"),
                href: "/blog",
              },
            ],
          },
        ]}
      />

      <FeatureSingleTopic
        orientation="left"
        title={translate("Join the Community")}
        description={translate(
          "XRPL is open-source and community-driven. Run validators, contribute code, and shape the future."
        )}
        buttons={[
          {
            label: translate("Events"),
            href: "/community/events",
          },
          {
            label: translate("Contribute"),
            href: "https://github.com/XRPLF",
          },
          {
            label: translate("Join the Dev Forum"),
            href: "https://discord.com/invite/sfX3ERAMjH",
          },
        ]}
        media={{
          src: require("../static/img/bds-2026/develop-feature-media-7.jpg"),
          alt: translate("Join the Community"),
        }}
      />
    </PageWrapper>
  );
}
