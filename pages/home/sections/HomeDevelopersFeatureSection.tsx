import { useThemeHooks } from "@redocly/theme/core/hooks";

import { FeatureTwoColumn } from "shared/sections/FeatureTwoColumn";

export function HomeDevelopersFeatureSection() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
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
          href: "/developers",
        },
      ]}
    />
  );
}
