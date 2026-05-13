import { useMemo } from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";

import {
  LinkTextDirectory,
  LinkTextDirectoryProps,
} from "shared/sections/LinkTextDirectory";

export function HomeComplianceDirectorySection() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  const developerToolsLinkTextDirectory = useMemo<
    LinkTextDirectoryProps["cards"]
  >(
    () => [
      {
        heading: translate("Tokenization"),
        description: translate(
          "Tokenization solutions that make it easy to bring financial markets on-chain and enable dynamic, transparent and efficient financing",
        ),
        buttons: [{ label: translate("Find Out More"), href: "/tokenization" }],
      },
      {
        heading: translate("Payments"),
        description: translate(
          "Simple APIs and built-in compliance and custody infrastructure for Fintechs and PSPs to integrate, launch and scale stablecoin payments",
        ),
        buttons: [{ label: translate("Find Out More"), href: "/payments" }],
      },
      {
        heading: translate("Trading"),
        description: translate(
          "Built-in trading infrastructure that blends order book precision with AMM efficiency and gives institutions the efficiency they need, with the control they expect",
        ),
        buttons: [{ label: translate("Find Out More"), href: "/trading" }],
      },
      {
        heading: translate("Lending (Coming Soon)"),
        description: translate(
          "Native lending protocol enabling onchain credit origination with fixed-term, interest-accruing loans, and off-chain underwriting and risk management",
        ),
      },
    ],
    [translate],
  );

  return (
    <LinkTextDirectory
      heading={translate("The Compliance-Focused Financial Blockchain")}
      cards={developerToolsLinkTextDirectory}
    />
  );
}
