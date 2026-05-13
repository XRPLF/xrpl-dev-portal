import { useThemeHooks } from "@redocly/theme/core/hooks";
import { LogoSquareGrid } from "shared/sections/LogoSquareGrid";

export function HomePartnerLogosSection() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <LogoSquareGrid
      heading={translate("Explore Institutional Use Cases")}
      variant="gray"
      buttons={[
        {
          label: translate("View All"),
          href: "/docs/use-cases/",
        },
      ]}
      logos={[
        {
          logo: "/img/home/ondo-finance.svg",
          alt: translate("Ondo Finance logo"),
        },
        {
          logo: "/img/home/archax-logo.svg",
          alt: translate("Archax logo"),
        },
        {
          logo: "/img/home/logo-zonix.svg",
          alt: translate("Zoniqx logo"),
        },
        {
          logo: "/img/logos/black/zeconomy.png",
          alt: translate("Zeconomy logo"),
        },
      ]}
    />
  );
}
