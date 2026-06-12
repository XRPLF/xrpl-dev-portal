import { PageWrapper } from "shared/components/PageWrapper";
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
import { FeatureTwoColumnWrapper } from "shared/sections/FeatureTwoColumn";

export const frontmatter = {
  seo: {
    title: "XRP Ledger Home | XRPL.org",
    description:
      "XRPL.org is a community-driven site for the XRP Ledger (XRPL), an open-source, public blockchain. Gain access to technical documentation, reference materials, and blockchain ledger tools.",
  },
};

export default function Index() {
  return (
    <PageWrapper className="landing page-home overflow-hidden">
      <HomeHero />
      <HomeHeroCallout />
      <HomeBlockchainStatsSection />
      <HomeCarousel />
      <HomeComplianceDirectorySection />
      <HomeFutureFinanceCallout />
      <FeatureTwoColumnWrapper>
        <HomeInstitutionsFeatureSection />
        <HomeDevelopersFeatureSection />
      </FeatureTwoColumnWrapper>
      <HomePartnerLogosSection />
      <HomeBeginJourneySection />
      <HomeStayConnectedSection />
    </PageWrapper>
  );
}
