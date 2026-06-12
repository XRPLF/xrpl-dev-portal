import React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import FeaturedVideoHero from "shared/sections/FeaturedVideoHero/FeaturedVideoHero";

export const DeveloperSpotlightSection: React.FC = () => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <FeaturedVideoHero
      headline={translate("Developer Spotlight")}
      subtitle={translate(
        "Are you building a peer-to-peer payments solution, integrating stablecoins, or exploring RLUSD on the XRP Ledger?",
      )}
      video={{
        source: {
          type: "embed",
          embedUrl: "https://www.youtube.com/embed/e2Iwsk37LMk",
        },
        coverImage: {
          src: "/img/payments/man-writing.jpg",
          alt: translate("Developer Spotlight"),
        },
      }}
      links={[
        {
          label: translate("Share Your Work"),
          href: "https://xrpl.org/blog",
        },
        {
          label: translate("View Others"),
          href: "https://xrplresources.org/developer-spotlight",
        },
      ]}
    />
  );
};
