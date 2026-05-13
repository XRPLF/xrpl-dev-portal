import { useThemeHooks } from "@redocly/theme/core/hooks";

import { FeatureTwoColumn } from "shared/sections/FeatureTwoColumn";

export function HomeInstitutionsFeatureSection() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
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
          href: "https://www.figma.com/design/NVcAUZVHKIbYFdKCeOz0lq/Homepage?node-id=1079-885&m=dev",
        },
      ]}
      media={{
        src: "/img/home/xrpl-building-institutions.jpg",
        alt: translate("Image of institutions uisng XRPL"),
      }}
    />
  );
}
