import { useThemeHooks } from "@redocly/theme/core/hooks";

import { CalloutMediaBanner } from "shared/sections/CalloutMediaBanner";

export function HomeFutureFinanceCallout() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <CalloutMediaBanner
      variant="default"
      heading={translate("The Future of Finance is Already Onchain")}
      headingAs="h2"
      subheading={translate(
        "XRPL delivers immediate value: faster, cheaper settlement with broad access and full-stack flexibility. XRPL is built for the evolving financial system.",
      )}
    />
  );
}
