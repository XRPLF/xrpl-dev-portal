import * as React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import { Link } from "shared/components/Link";
import { PageWrapper } from "shared/components/PageWrapper";
import { HeaderHeroSplitMedia } from "shared/sections/HeaderHeroSplitMedia/HeaderHeroSplitMedia";
import {
  PanelStack,
  type PanelStackPanel,
} from "shared/patterns/PanelStack";
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

  const carouselSlides: PanelStackPanel[] = [
    {
      id: "ripplex-ecosystem-programs",
      heading: translate("Explore XRPL Funding and Builders Programs"),
      features: [
        {
          title: translate("RippleX Ecosystem Programs"),
          description: (
            <>
              {translate(
                "Fueling innovation across DeFi, tokenization, and payments."
              )}
              <br />
              <br />
              {translate("→ Non-dilutive milestone- or incentive-based grants funding")}
              <br />
              {translate("→ Technical mentorship and integration support to go live on XRPL")}
              <br />
              {translate("→ Hackathons and builder competitions")}
              <br />
              {translate(
                "→ 6-12 weeks global accelerator programs")}
              <br />
              {translate("→ Ecosystem partnerships - co-marketing, distribution, and strategic alignment")}
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
      id: "ubri",
      heading: translate("Explore XRPL Funding and Builders Programs"),
      features: [
        {
          title: translate("University Blockchain Residency Initiative (UBRI)"),
          description: (
            <>
              {translate(
                " Supporting a diverse portfolio of blockchain research, technical development, and innovation at universities around the world."
              )}
              <br />
              <br />
              {translate("→ University Digital Xcelerator (UDAX)")}
              <br />
              {translate(
                "→ The Student Builder Residency"
              )}
              <br />
              {translate(
                "→ Research, education, and opportunities headquartered at 60+ universities around the world"
              )}
            </>
          ),
        },
      ],
      buttons: [
        {
          label: translate("Access Now"),
          href: "https://xrpl.org/community/ambassadors",
        },
      ],
      imageSrc: require("../static/img/bds-2026/community-developer-funding-carousel-2.jpg"),
      imageAlt: translate("XRPL Student Builder Residency"),
    },
    {
      id: "xrpl-commons",
      features: [
        {
          title: translate("XRPL Commons"),
          description: (
            <>
              {translate(
                "The builder hub for XRPL: education, acceleration, and funding to launch and grow."
              )}
              <br />
              <br />
              {translate("→ Learn with XRPL Academy, a platform with courses for developers and founders, including a core dev track")}
              <br />
              {translate(
                "→ Programs, grants, and open-source support to fast-track projects to Mainnet and growth."
              )}
              <br />
              {translate(
                "→ Education, innovation, social impact, and partnerships with universities and corporations."
              )}
              <br />
              →{" "}
              <Link href="https://www.xrpl-commons.org/residency" intention="neutral">
                {translate("The Aquarium Residency")}
              </Link>{" "}
              {translate("- 12-week onsite entrepreneurial program in Paris")}
              <br />
              →{" "}
              <Link href="https://glow.xrpl-commons.org/" intention="neutral">{translate("GLOW")}</Link>{" "}
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

      <PanelStack 
        heading={translate("Explore XRPL Funding and Builders Programs")}
        slides={carouselSlides} 
        background="yellow" 
      />

      <LogoSquareGrid
        variant="gray"
        heading={translate("Shaping the Future Together")}
        description={translate(
          "Explore some of the innovative teams and how they are making a real-world difference in the financial landscape today."
        )}

        logos={[
          {
            logo: require("../static/img/logos/black/lantern.svg"),
            alt: translate("LANTERN"),
            href: "https://lantern.finance/",
          },
          {
            logo: require("../static/img/logos/black/soil.svg"),
            alt: translate("SOIL"),
            href: "https://soil.co/",
          },
          {
            logo: require("../static/img/logos/black/t54.png"),
            alt: translate("t54"),
            href: "https://www.t54.ai/",
          },
          {
            logo: require("../static/img/logos/black/blockvault.png"),
            alt: translate("BlockVault"),
            href: "https://block.vault/",
          },
          {
            logo: require("../static/img/logos/black/lobstr.svg"),
            alt: translate("LOBSTR"),
            href: "https://lobstr/",
          },
        ]}
      />
    </PageWrapper>
  );
}
