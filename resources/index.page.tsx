import { useThemeHooks } from "@redocly/theme/core/hooks";
import { HeaderHeroSplitMedia } from "shared/sections/HeaderHeroSplitMedia/HeaderHeroSplitMedia";
import { CardsFeatured } from "shared/sections/CardsFeatured/CardsFeatured";
import { LinkTextDirectory } from "shared/sections/LinkTextDirectory/LinkTextDirectory";
import { FeatureTwoColumn } from "shared/sections/FeatureTwoColumn/FeatureTwoColumn";
import { FeatureSingleTopic } from "shared/sections/FeatureSingleTopic/FeatureSingleTopic";

export const frontmatter = {
  seo: {
    title: "XRPL Developer Resources",
    description:
      "Whether you’re exploring the XRP Ledger for the first time or scaling an enterprise solution, find essential blockchain and crypto resources to build, learn, and stay ahead.",
  },
};

const HUBSPOT_NEWSLETTER_FORM =
  "https://share.hsforms.com/18zNvJDR4QbObGPLDh3n5Bw4vgrs";

export default function Resources() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <div className="landing">
      <HeaderHeroSplitMedia
        title={translate("Everything you need in One Place.")}
        subtitle={translate(
          "Whether you’re exploring the XRP Ledger for the first time or scaling an enterprise solution, here you'll find the essential blockchain and crypto resources developers need to build, learn, and stay ahead."
        )}
        primaryCta={{
          label: translate("Explore Solutions"),
          href: "http://xrpl.org/develop",
        }}
        media={{
          src: require("../static/img/bds-2026/resources-hero-media.jpg"),
          alt: translate("Everything you need in One Place."),
        }}
      />

      <CardsFeatured
        heading={translate("Start Building")}
        description={translate(
          "Get up to speed with a comprehensive set of blockchain resources, including the tech, tools, and documentation that power the XRPL ecosystem."
        )}
        cards={[
          {
            image: require("../static/img/bds-2026/resources-feature-media-1.jpg"),
            imageAlt: translate("Documentation"),
            title: translate("Documentation"),
            subtitle: translate(
              "Access everything you need to get started on the XRPL."
            ),
            buttonLabel: translate("Get Started"),
            href: "https://xrpl.org/docs",
          },
          {
            image: require("../static/img/bds-2026/resources-feature-media-2.jpg"),
            imageAlt: translate("Guided Tutorials"),
            title: translate("Guided Tutorials"),
            subtitle: translate(
              "Follow step-by-step guides for frequent tasks."
            ),
            buttonLabel: translate("Guides"),
            href: "https://xrpl.org/docs/tutorials",
          },
          {
            image: require("../static/img/bds-2026/resources-feature-media-3.jpg"),
            imageAlt: translate("Fundamentals"),
            title: translate("Fundamentals"),
            subtitle: translate(
              "Read about the XRPL's foundational concepts."
            ),
            buttonLabel: translate("Fundamentals"),
            href: "https://xrpl.org/docs/introduction",
          },
          {
            image: require("../static/img/bds-2026/resources-feature-media-4.jpg"),
            imageAlt: translate("Languages"),
            title: translate("Languages"),
            subtitle: translate(
              "Find tools, documentation, and sample code in Python, Java, JavaScript, or use HTTP APIs."
            ),
            buttonLabel: translate("Languages"),
            href: "https://xrpl.org/docs/tutorials/python",
          },
          {
            image: require("../static/img/bds-2026/resources-feature-media-5.jpg"),
            imageAlt: translate("GitHub"),
            title: translate("GitHub"),
            subtitle: translate(
              "Dive into the open-source codebase and track new developments."
            ),
            buttonLabel: translate("GitHub"),
            href: "https://github.com/XRPLF/rippled",
          },
          {
            image: require("../static/img/bds-2026/community-feature-media-2.jpg"),
            imageAlt: translate("Learning Portal"),
            title: translate("Learning Portal"),
            subtitle: translate(
              "Start with the basics and then learn about tokenization, DEX trading, or how to issue stablecoins."
            ),
            buttonLabel: translate("Tokenization"),
            href: "https://learn.xrpl.org/course/tokenization-and-real-world-assets-on-the-xrpl/",
          },
        ]}
      />

      <LinkTextDirectory
        heading={translate("Explore XRPL Developer Tools")}
        description={translate(
          "Community-built tools to make development easier and faster"
        )}
        cards={[
          {
            heading: translate("Ecosystem Directory"),
            description: translate(
              "Discover XRPL tools, integrations, and community projects."
            ),
            buttons: [
              {
                label: translate("Ecosystem"),
                href: "https://xrpl.org/about/uses",
              },
            ],
          },
          {
            heading: translate("XRPL Explorer"),
            description: translate(
              "Track transactions and activity on the ledger in real time."
            ),
            buttons: [
              {
                label: translate("Explorer"),
                href: "https://livenet.xrpl.org/",
              },
            ],
          },
          {
            heading: translate("Faucet & Testnet Tools"),
            description: translate(
              "Access devnet and testnet environments to prototype and test."
            ),
            buttons: [
              {
                label: translate("Testnet"),
                href: "https://testnet.xrpl.org/",
              },
            ],
          },
          {
            heading: translate("Reference Implementations"),
            description: translate(
              "Get started with example projects and open templates."
            ),
            buttons: [
              {
                label: translate("References"),
                href: "https://xrpl.org/docs/references",
              },
            ],
          },
        ]}
      />

      <FeatureTwoColumn
        color="green"
        arrange="left"
        title={translate("XRPL Grants & Accelerator")}
        description={translate(
          "Apply for funding and guidance to bring your ideas to life and help them scale."
        )}
        links={[
          {
            label: translate("Funding and Guidance"),
            href: "https://xrplgrants.org/",
          },
        ]}
        media={{
          src: require("../static/img/bds-2026/resources-feature-media-7.jpg"),
          alt: translate("XRPL Grants & Accelerator"),
        }}
      />

      <FeatureTwoColumn
        color="green"
        arrange="right"
        title={translate("XRPL Commons")}
        description={translate(
          "Utilize the Core Dev Bootcamp to level up your blockchain journey and join The Aquarium Residency if you’re ready for launch."
        )}
        links={[
          {
            label: translate("Core Dev Bootcamp"),
            href: "https://www.xrpl-commons.org/build/core-dev-online-bootcamp",
          },
          {
            label: translate("The Aquarium Residency"),
            href: "https://www.xrpl-commons.org/residency",
          },
        ]}
        media={{
          src: require("../static/img/bds-2026/resources-feature-media-8.jpg"),
          alt: translate("XRPL Commons"),
        }}
      />

      <FeatureTwoColumn
        color="green"
        arrange="left"
        title={translate("Hackathons & Events")}
        description={translate(
          "Compete, connect, and contribute at upcoming global developer events."
        )}
        links={[
          {
            label: translate("Global Developer Events"),
            href: "https://xrpl.org/community/events",
          },
        ]}
        media={{
          src: require("../static/img/bds-2026/resources-feature-media-9.jpg"),
          alt: translate("Hackathons & Events"),
        }}
      />

      <FeatureSingleTopic
        orientation="left"
        title={translate("Building on XRPL Starts Here")}
        description={translate(
          "From docs to funding and beyond, you’ll find all the crypto resources you need to take your project further."
        )}
        buttons={[
          {
            label: translate("Sign Up to Newsletter"),
            href: HUBSPOT_NEWSLETTER_FORM,
          },
        ]}
        media={{
          src: require("../static/img/bds-2026/resources-feature-media-10.jpg"),
          alt: translate("Building on XRPL Starts Here"),
        }}
      />
    </div>
  );
}
