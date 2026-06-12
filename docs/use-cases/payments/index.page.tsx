import React from 'react';
import { PageWrapper } from 'shared/components/PageWrapper';
import {
  HeroSection,
  WhyChooseSection,
  AdvancedFeaturesSection,
  StablecoinsSection,
  EmbeddedPaymentsSection,
  PartnerLogosSection,
  FlexibleIntegrationSection,
  DeveloperSpotlightSection,
  StayConnectedSection,
} from 'pages/payments/sections';

export const frontmatter = {
  seo: {
    title: 'Payments Infrastructure',
    description:
      'The XRP Ledger Payments Infrastructure is a payments solution for use cases including stablecoin payments, cross-border remittance, B2B payment rails, and merchant settlement.',
  },
};

export default function PaymentsPage() {
  return (
    <PageWrapper className="landing">
      <HeroSection />
      <WhyChooseSection />
      <AdvancedFeaturesSection />
      <StablecoinsSection />
      <EmbeddedPaymentsSection />
      <PartnerLogosSection />
      <FlexibleIntegrationSection />
      <DeveloperSpotlightSection />
      <StayConnectedSection />
    </PageWrapper>
  );
}
