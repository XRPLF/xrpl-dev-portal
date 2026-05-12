import { useMemo } from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";

import { CardStats, CardStatsProps } from "shared/sections/CardStatsList";

export function HomeBlockchainStatsSection() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  const blockchainCardStats = useMemo<CardStatsProps["cards"]>(
    () => [
      {
        statistic: translate("12 Years"),
        label: translate("Continuous uptime"),
        superscript: "+",
        variant: "lilac",
      },
      {
        statistic: translate("7M"),
        label: translate("Active wallets"),
        superscript: "+",
        variant: "light-gray",
      },
      {
        statistic: translate("$1T"),
        label: translate("Value Moved"),
        superscript: "+",
        variant: "dark-gray",
      },
      {
        statistic: translate("~$0.00025"),
        label: translate("Predictable, ultra-low fees"),
        variant: "green",
      },
    ],
    [translate],
  );

  return (
    <CardStats
      heading={translate("Blockchain Trusted at Scale")}
      description={translate(
        "Streamline development and build powerful RWA tokenization solutions with XRP Ledger's comprehensive developer toolset.",
      )}
      cards={blockchainCardStats}
    />
  );
}
