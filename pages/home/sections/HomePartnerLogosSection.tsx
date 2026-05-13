import { LogoSquareGrid } from "shared/sections/LogoSquareGrid";

export function HomePartnerLogosSection() {
  return (
    <LogoSquareGrid
      heading="Explore Institutional Use Cases"
      variant="gray"
      buttons={[
        {
          label: "View Cases",
          href: "/docs/use-cases/",
        },
      ]}
      logos={[
        {
          logo: "/img/home/Ondo finance.svg",
          alt: "Ondo finance - logo",
        },
        {
          logo: "/img/home/archax logo.svg",
          alt: "Archax - logo",
        },
        {
          logo: "/img/home/logo_zonix.svg",
          alt: "Zonix",
        },
        {
          logo: "/img/logos/black/zeconomy.png",
          alt: "Zonix",
        },
      ]}
    />
  );
}
