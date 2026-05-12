import React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import { FeatureSingleTopic } from "shared/sections/FeatureSingleTopic/FeatureSingleTopic";

export const StayConnectedSection: React.FC = () => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <FeatureSingleTopic
      orientation="left"
      title={translate("Stay Connected")}
      description={translate(
        "Stay ahead in the world of payments. Subscribe to receive the latest insights, trends, and updates on payment solutions — delivered directly to your inbox.",
      )}
      buttons={[
        {
          label: translate("Sign Up to Newsletter"),
          href: "https://share.hsforms.com/18zNvJDR4QbObGPLDh3n5Bw4vgrs",
        },
      ]}
      singleButtonVariant="secondary"
      media={{
        src: "/img/payments/xrpl-pattern.png",
        alt: translate("Stay Connected"),
      }}
    />
  );
};
