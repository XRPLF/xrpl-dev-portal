import { useThemeHooks } from "@redocly/theme/core/hooks";

import FeatureSingleTopic from "shared/sections/FeatureSingleTopic";

export function HomeStayConnectedSection() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <FeatureSingleTopic
      variant="default"
      orientation="left"
      title={translate("Stay Connected")}
      description={translate(
        "Join our community and stay in the loop. Get the latest insights on payments, tokenization, trading, and more — straight to your inbox.",
      )}
      buttons={[
        {
          label: translate("Sign Up to Newsletter"),
          href: "https://share.hsforms.com/18zNvJDR4QbObGPLDh3n5Bw4vgrs",
        },
      ]}
      media={{
        src: "/img/home/men-review-app.png",
        alt: translate("Image of a man reviewing an app"),
      }}
    />
  );
}
