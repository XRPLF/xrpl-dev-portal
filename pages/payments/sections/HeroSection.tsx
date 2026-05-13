import React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import { HeaderHeroSplitMedia } from "shared/sections/HeaderHeroSplitMedia/HeaderHeroSplitMedia";

export const HeroSection: React.FC = () => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <HeaderHeroSplitMedia
      layout="content-left"
      title={translate("Payments Infrastructure")}
      subtitle=""
      description={translate(
        "The XRP Ledger Payments Infrastructure is a payments solution for use cases including stablecoin payments, cross-border remittance, B2B payment rails, and merchant settlement.",
      )}
      media={{
        src: "/img/payments/payments-infrastructure-hero.png",
        alt: translate("Payments Infrastructure"),
      }}
    />
  );
};
