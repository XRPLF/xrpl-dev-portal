import React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import {
  CardsIconGrid,
  CardsIconGridProps,
} from "shared/sections/CardsIconGrid/CardsIconGrid";

const EMBEDDED_PAYMENTS_CARDS: CardsIconGridProps["cards"] = [
  {
    heading: "Digital Wallets",
    description:
      "Offer fast, low-fee stablecoin payments between users and applications.",
    icon: "/img/payments/filing.svg",
  },
  {
    heading: "Cross-Border Remittance",
    description:
      "Use secure payment channels and the most optimal liquidity pathways for global remittances with RLUSD.",
    icon: "/img/payments/globe-1.svg",
  },
  {
    heading: "Regulated Foreign Exchange",
    description:
      "Tap into a set of fiat-backed stablecoins, instantaneous swaps for efficient Foreign Exchange.",
    icon: "/img/payments/wallet-exchange.svg",
  },
  {
    heading: "Merchant Settlement",
    description:
      "Settle daily payments across assets using escrow or checks with compliance-focused features.",
    icon: "/img/payments/money-hand.svg",
  },
  {
    heading: "B2B Payment Rails",
    description:
      "Build programmable payment flows with conditions and real-time data feeds.",
    icon: "/img/payments/money-hand.svg",
  },
  {
    heading: "Compliance-First Payments",
    description:
      "Add Deposit Authorization and whitelisting to comply with AML and KYC workflows.",
    icon: "/img/payments/checklist.svg",
  },
];

export const EmbeddedPaymentsSection: React.FC = () => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <CardsIconGrid
      heading={translate("Unlock New Business Models with Embedded Payments")}
      description={translate(
        "XRPL Payments supports modern fintech use cases with plug-and-play APIs or partner-led deployments.",
      )}
      cards={EMBEDDED_PAYMENTS_CARDS}
    />
  );
};
