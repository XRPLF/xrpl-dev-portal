import { useThemeHooks } from "@redocly/theme/core/hooks";

import { CalloutMediaBanner } from "shared/sections/CalloutMediaBanner";

export function HomeHeroCallout() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <CalloutMediaBanner
      variant="gray"
      heading={translate("XRP Ledger")}
      headingAs="h2"
      backgroundImage={"/img/backgrounds/callout-light.jpg"}
      backgroundImageDark={"/img/backgrounds/callout-dark.jpg"}
      subheading={translate(
        "A decentralized public Layer 1 blockchain for creating, transferring, and exchanging digital assets with a focus on compliance. ",
      )}
      buttons={[{ label: translate("Get Started"), href: "/docs" }]}
    />
  );
}
