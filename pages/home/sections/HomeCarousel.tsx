import React from "react";
import { CarouselFeatured } from "shared/patterns/CarouselFeatured";
import { useThemeHooks } from "@redocly/theme/core/hooks";

export const HomeCarousel = () => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  return (
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
  );
};
