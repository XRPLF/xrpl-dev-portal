import * as React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import { PageWrapper } from "shared/components/PageWrapper";
import { HeaderHeroSplitMedia } from "shared/sections/HeaderHeroSplitMedia/HeaderHeroSplitMedia";
import {
  CarouselFeatured,
  type CarouselSlide,
} from "shared/patterns/CarouselFeatured/CarouselFeatured";
import { LogoSquareGrid } from "shared/sections/LogoSquareGrid";
import { LinkTextDirectory } from "shared/sections/LinkTextDirectory/LinkTextDirectory";
import { FeatureSingleTopic } from "shared/sections/FeatureSingleTopic/FeatureSingleTopic";

export const frontmatter = {
  seo: {
    title: "Developer Funding",
    description:
      "Access grants, programs, and tailored support to build the next wave of blockchain innovation on the XRP Ledger.",
  },
};

export default function Funding() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  const carouselSlides: CarouselSlide[] = [
    {
      id: "xrpl-grants-accelerator",
      heading: translate("Explore XRPL Funding and Builders Programs"),
      features: [
        {
          title: translate("XRPL Grants & XRPL Accelerator"),
          description: (
            <>
              {translate(
                "Fueling innovation across DeFi, tokenization, and payments."
              )}
              <br />
              <br />
              {translate("→ Up to $200K in milestone-based funding")}
              <br />
              {translate("→ Open to global teams building with XRPL")}
              <br />
              {translate("→ Focused on DeFi, RWA, payments, trade finance")}
              <br />
              {translate("→ Grants available for MVPs")}
              <br />
              {translate("→ Unified application for all XRPL programs")}
              <br />
              {translate(
                "→ A 12-week, hybrid accelerator program supporting startups and institutional builders."
              )}
            </>
          ),
        },
      ],
      buttons: [
        { label: translate("Access Now"), href: "https://xrplgrants.org/" },
      ],
      imageSrc: require("../static/img/bds-2026/community-developer-funding-carousel-1.jpg"),
      imageAlt: translate("XRPL Grants and Accelerator"),
    },
    {
      id: "xrpl-student-builder-residency",
      heading: translate("Explore XRPL Funding and Builders Programs"),
      features: [
        {
          title: translate("XRPL Student Builder Residency"),
          description: (
            <>
              {translate(
                "Inviting highly motivated University Builders from technical disciplines to build on the XRPL in a 4-week accelerated learning program."
              )}
              <br />
              <br />
              {translate("→ Deploy and scale high-impact dApps on the XRPL")}
              <br />
              {translate(
                "→ Engage in one-on-one mentorship with expert blockchain developers"
              )}
              <br />
              {translate(
                "→ Expand your network within the XRPL community and beyond"
              )}
            </>
          ),
        },
      ],
      buttons: [
        {
          label: translate("Access Now"),
          href: "/community/developer-funding",
        },
      ],
      imageSrc: require("../static/img/bds-2026/community-developer-funding-carousel-2.jpg"),
      imageAlt: translate("XRPL Student Builder Residency"),
    },
    {
      id: "xrpl-commons",
      heading: translate("Explore XRPL Funding and Builders Programs"),
      features: [
        {
          title: translate("XRPL Commons"),
          description: (
            <>
              {translate(
                "Supporting the global XRPL community through education, innovation, and social impact."
              )}
              <br />
              <br />
              {translate("→ In-person builder support at XRPL Commons hub")}
              <br />
              {translate(
                "→ Programming for startups, researchers, NGOs, and investors"
              )}
              <br />
              {translate(
                "→ Partnerships with universities and corporations underway"
              )}
              <br />
              →{" "}
              <a href="https://www.xrpl-commons.org/residency">
                {translate("The Aquarium Residency")}
              </a>{" "}
              {translate("- 12-week onsite entrepreneurial program in Paris")}
              <br />
              →{" "}
              <a href="https://glow.xrpl-commons.org/">{translate("GLOW")}</a>{" "}
              {translate(
                "– rewards program for recognizing developer contributions to the XRPL"
              )}
            </>
          ),
        },
      ],
      buttons: [
        {
          label: translate("Access Now"),
          href: "https://www.xrpl-commons.org/",
        },
      ],
      imageSrc: require("../static/img/bds-2026/community-developer-funding-carousel-3.jpg"),
      imageAlt: translate("XRPL Commons"),
    },
  ];

  return (
    <PageWrapper className="landing">
      <HeaderHeroSplitMedia
        title={translate("Bring Your Vision to Life")}
        subtitle={translate(
          "Access grants, programs, and tailored support to build the next wave of blockchain innovation on the XRP Ledger."
        )}
        media={{
          src: require("../static/img/bds-2026/community-developer-funding-hero-media.jpg"),
          alt: translate("Bring Your Vision to Life"),
        }}
      />

      <CarouselFeatured slides={carouselSlides} background="yellow" />

      <LogoSquareGrid
        variant="gray"
        heading={translate("Shaping the Future Together")}
        description={translate(
          "Explore some of the innovative teams and how they are making a real-world difference in the financial landscape today."
        )}
        buttons={[
          {
            label: translate("Explore Awardees"),
            href: "https://xrplgrants.org/awardees",
          },
        ]}
        logos={[
          {
            logo: require("../static/img/logos/black/link.png"),
            alt: translate("LINK"),
            href: "https://www.linkio.world/",
          },
          {
            logo: require("../static/img/logos/black/propto.png"),
            alt: translate("Propto"),
            href: "https://www.propto.com/",
          },
          {
            logo: require("../static/img/logos/black/t54.png"),
            alt: translate("t54"),
            href: "https://www.t54.ai/",
          },
          {
            logo: require("../static/img/logos/black/anodos.png"),
            alt: translate("Anodos"),
            href: "https://anodos.finance/",
          },
        ]}
      />

      <FeatureSingleTopic
        title={translate(
          "Unveil Your Project at an XRPL Accelerator Demo Day"
        )}
        orientation="right"
        media={{
          src: require("../static/img/bds-2026/community-developer-funding-video-poster.jpg"),
          alt: translate("XRPL Accelerator Demo Day"),
        }}
        buttons={[
          {
            label: translate("Read More"),
            href: "https://dev.to/ripplexdev/inside-xrpl-accelerators-demo-day-at-the-dubai-fintech-summit-1be9",
          },
        ]}
      />

      <LinkTextDirectory
        heading={translate(
          "Explore Opportunities to Build and Get Started Today"
        )}
        description={translate(
          "XRP Ledger is a compliance-focused blockchain where financial applications come to life."
        )}
        cards={[
          {
            heading: translate(
              "Get XRPL Grants Updates Delivered to Your Inbox"
            ),
            description: translate(
              "Sign up to ensure you get the very latest Grants updates."
            ),
            buttons: [
              {
                label: translate("Sign Up"),
                href: "https://xrpl.org/docs/tutorials/how-tos/use-tokens/trade-in-the-decentralized-exchange",
              },
            ],
          },
          {
            heading: translate(
              "Get Your Questions Answered by XRPL Commons"
            ),
            description: translate(
              "Do you have burning questions related to XRPL Commons?"
            ),
            buttons: [
              {
                label: translate("Contact"),
                href: "https://discord.gg/sfX3ERAMjH",
              },
            ],
          },
          {
            heading: translate("Explore Previous Awardees"),
            description: translate(
              "Learn about what it takes to get comprehensive support!"
            ),
            buttons: [
              {
                label: translate("Explore"),
                href: "https://xrpl.org/about/uses",
              },
            ],
          },
        ]}
      />
    </PageWrapper>
  );
}
