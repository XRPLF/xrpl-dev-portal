import { LogoSquareGrid } from "shared/sections/LogoSquareGrid";

export function HomePartnerLogosSection() {
  return (
    <LogoSquareGrid
      variant="gray"
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
      ]}
    />
  );
}
