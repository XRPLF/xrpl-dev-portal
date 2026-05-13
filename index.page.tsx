import {
  HomeBeginJourneySection,
  HomeBlockchainStatsSection,
  HomeComplianceDirectorySection,
  HomeDevelopersFeatureSection,
  HomeFutureFinanceCallout,
  HomeHeroCallout,
  HomeInstitutionsFeatureSection,
  HomePartnerLogosSection,
  HomeStayConnectedSection,
  HomeHero,
  HomeCarousel,
} from "pages/home/sections";

export const frontmatter = {
  seo: {
    title: "XRP Ledger Home | XRPL.org",
    description:
      "XRPL.org is a community-driven site for the XRP Ledger (XRPL), an open-source, public blockchain. Gain access to technical documentation, reference materials, and blockchain ledger tools.",
  },
};

export default function Index() {
  return (
    <div className="landing page-home">
      <div className="overflow-hidden">
        <HomeHero />
        <HomeHeroCallout />
        <HomeBlockchainStatsSection />
        <HomeCarousel />
        <HomeComplianceDirectorySection />
        <HomeFutureFinanceCallout />
        <HomeInstitutionsFeatureSection />
        <HomeDevelopersFeatureSection />
        <HomePartnerLogosSection />
        <HomeBeginJourneySection />
        <HomeStayConnectedSection />
      </div>
    </div>
  );
}
