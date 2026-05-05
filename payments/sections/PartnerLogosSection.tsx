import React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import {
  LogoSquareGrid,
  LogoItem,
  LogoSquareGridProps,
} from "shared/sections/LogoSquareGrid/LogoSquareGrid";

const PARTNER_LOGOS: LogoItem[] = [
  {
    logo: "/img/payments/coinpayments.png",
    alt: "CoinPayments",
    href: "https://xrpl.org/blog/2025/coinpayments-xrpl-case-study-payment-processing",
  },
  {
    logo: "/img/payments/Ripple - blueblack 1.svg",
    alt: "Ripple",
    href: "https://ripple.com/solutions/cross-border-payments/",
  },
  {
    logo: "/img/payments/ffii.svg",
    alt: "FriiPay",
    href: "https://xrpl.org/blog/2025/frii-pay-xrpl-case-study-crypto-payment-solution",
  },
  {
    logo: "/img/payments/brale.png",
    alt: "Brale",
    href: "https://brale.xyz/blog/brale-goes-live-on-the-xrp-ledger",
  },
  {
    logo: "/img/payments/brazabank.svg",
    alt: "BrazaBank",
    href: "https://ripple.com/ripple-press/braza-group-announces-launch-of-bbrl-stablecoin-on-the-xrp-ledger/",
  },
];

export const PartnerLogosSection: React.FC = () => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <LogoSquareGrid
      variant="gray"
      heading={translate(
        "Payments Solution, Battle-Tested by Industry Leaders",
      )}
      logos={PARTNER_LOGOS}
    />
  );
};
