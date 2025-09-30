import React, { useState } from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import { AdvantagesSection } from "shared/components/advantages-section";
import { ProjectCards } from "shared/components/project-cards";
import { BenefitsSection } from "shared/components/benefits-section";
import { DeveloperResourcesSection } from "shared/components/developer-resources-section";
import { FeatureItem } from "../tokenization/real-world-assets.page";

export const frontmatter = {
  seo: {
    title: 'XRP Ledger Payments Suite',
    description: "The XRP Ledger Payments Suite is a payments solution for use cases including stablecoin payments, cross-border remittance, B2B payment rails, and merchant settlement.",
  }
};

const PaymentsPage: React.FC = () => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  const video = {
    url: "https://www.youtube.com/embed/e2Iwsk37LMk?si=20-m6aQOWpaiQDW7",
    title: "Payments",
    src: "https://www.youtube.com/embed/e2Iwsk37LMk?si=20-m6aQOWpaiQDW7",
  };

  const paymentAdvantages = [
    {
      id: "cross-border-stablecoin",
      title: "Enable Cross-Border Stablecoin Payments",
      contents: [
        {
          subtitle: "RLUSD and USDC support",
          description: "",
        },
        {
          subtitle: "Easily receive, store, convert, issue and send stablecoins",
          description: "",
        },
      ],
    },
    {
      id: "reliable-infrastructure",
      title: "Access Reliable Payments Infrastructure",
      contents: [
        {
          subtitle: "99.99% uptime since 2012",
          description: "",
        },
        {
          subtitle: "Over $1.7T+ in value transferred",
          description: "",
        },
      ],
    },
    {
      id: "efficient-payments",
      title: "Move Money Efficiently",
      contents: [
        {
          subtitle: "Transactions settle in 3-5 seconds",
          description: "",
        },
        {
          subtitle: "Fractions of a cent per transaction",
          description: "",
        },
      ],
    },
  ];

  const paymentProjects = [
    {
      id: "ripple-usd",
      label: "Ripple USD",
      url: "https://ripple.com/solutions/stablecoin/",
      description: "RLUSD, Ripple's enterprise-grade stablecoin, is live on XRPL and fully backed by USD deposits.",
    },
    {
      id: "usdc", 
      label: "USDC",
      url: "https://www.circle.com/usdc",
      description: "USDC, issued by Circle, is the world's largest regulated dollar stablecoin and now live on XRPL.",
    },
    {
      id: "usdb",
      label: "USDB", 
      url: "https://www.brazabank.com.br/en/usdben/",
      description: "USDB, by Braza Group, is a USD-pegged stablecoin backed by U.S. and Brazilian bonds.",
    },
    {
      id: "europ",
      label: "EURØP",
      url: "https://schuman.io/europ/", 
      description: "EURØP, issued by Schuman Financial, is the first MiCA-compliant euro stablecoin on XRPL.",
    },
    {
      id: "xsgd",
      label: "XSGD",
      url: "https://www.straitsx.com/xsgd",
      description: "XSGD, from StraitsX, is a Singapore Dollar-backed stablecoin regulated by MAS (Monetary Authority of Singapore).",
    },
    {
      id: "audd",
      label: "AUDD", 
      url: "https://www.audd.digital/",
      description: "AUDD, an Australian dollar stablecoin, is live on XRPL and backed 1:1 with AUD.",
    },
  ];

  const embeddedPaymentsCards = [
    {
      id: 'digital-wallets',
      title: 'Digital Wallets',
      description: 'Offer fast, low-fee stablecoin payments between users and applications.',
    },
    {
      id: 'cross-border-remittance',
      title: 'Cross-Border Remittance',
      description: 'Use secure payment channels and the most optimal liquidity pathways for global remittances with RLUSD.',
    },
    {
      id: 'regulated-foreign-exchange',
      title: 'Regulated Foreign Exchange',
      description: 'Tap into a set of fiat-backed stablecoins, instantaneous swaps for efficient Foreign Exchange.',
    },
    {
      id: 'merchant-settlement',
      title: 'Merchant Settlement',
      description: 'Settle daily payments across assets using escrow or checks with compliance-focused features.',
    },
    {
      id: 'b2b-payment-rails',
      title: 'B2B Payment Rails',
      description: 'Build programmable payment flows with conditions and real-time data feeds.',
    },
    {
      id: 'compliance-first-payment-acceptance',
      title: 'Compliance-First Payment Acceptance',
      description: 'Add Deposit Authorization and whitelisting to comply with AML and KYC workflows.',
    },
  ];

  const battleTestedProjects = [
    {
      id: "coinpayments",
      label: "CoinPayments",
      url: "https://xrpl.org/blog/2025/coinpayments-xrpl-case-study-payment-processing",
      description: "CoinPayments uses XRPL's fast and low-cost payment rails to enable merchants to accept digital assets globally with near-instant settlement and minimal transaction fees.",
      buttonText: "Case Study"
    },
    {
      id: "ripple",
      label: "Ripple",
      url: "https://ripple.com/solutions/cross-border-payments/",
      description: "Ripple Payments enables crypto companies, payment service providers and fintech to facilitate real-time cross-border payments using stablecoins, digital assets and local currencies — with XRPL as a foundational transaction layer.",
      buttonText: "Case Study"
    },
    {
      id: "friipay",
      label: "FriiPay",
      url: "https://xrpl.org/blog/2025/frii-pay-xrpl-case-study-crypto-payment-solution",
      description: "FriiPay connects XRPL-based crypto wallets to point-of-sale terminals, allowing customers to pay with RLUSD or XRP while helping merchants save costs on card processing fees.",
      buttonText: "Case Study"
    },
  ];

  const integrationFeatures = [
    {
      title: "Access open documentation",
      link: "/docs/"
    },
    {
      title: "Use the Payments APIs + XRPL tooling",
      link: "/resources/dev-tools"
    },
  ];


  const paymentsResourcesCards = [
    {
      title: "Developer Spotlight",
      description: "Are you building a peer-to-peer payments solution, integrating stablecoins, or exploring RLUSD on the XRP Ledger?",
      links: [
        {
          text: "Share Your Work",
          url: "https://discord.gg/sfX3ERAMjH"
        }
      ],
      backgroundClass: "developer-spotlight"
    },
    {
      title: "Learn & Stay Updated", 
      description: "Stay ahead of the curve with the latest developments in XRPL Payments by joining the Developer Discord and signing up for the XRPL Community Newsletter.",
      links: [
        {
          text: "Join the Developer Discord",
          url: "https://discord.gg/sfX3ERAMjH"
        },
        {
          text: "Sign up for the Newsletter",
          url: "https://xrplresources.org/subscribe"
        }
      ],
      backgroundClass: "learn-stay-updated"
    }
  ];

  return (
    <main className="use-case-payments">
      <section className="use-case-payments__hero">
          <div className="video-content">
              <iframe
                width="100%"
                height="100%"
                src={video.src}
                title={video.title}
                frameBorder={0}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            
          </div>
          <div className="text-content">
            <h6 className="eyebrow mb-3 text-large">
              {translate("Payments")}
            </h6>
            <h2 className="h4 h2-sm mb-10">
              {translate("Payments Suite")}
            </h2>
            <p className="mb-10">
              {translate(
                "Helping fintechs and payment providers move money fast, globally, and at low cost - all through simple APIs."
              )}
            </p>
          </div>
      </section>

      <AdvantagesSection
        title="Why Choose XRPL Payments Suite for Your Payment Rails?"
        advantages={paymentAdvantages}
        useLinks={false}
        className="payments-advantages-spacing"
      />
      <ProjectCards
        title="Enterprise-Grade Stablecoins, Issued Natively on XRPL"
        projects={paymentProjects}
        showCarousel={false}
        className="mt-12 px-0"
      />
             <BenefitsSection
         title="Unlock New Business Models with Embedded Payments"
         description="XRPL Payments supports modern fintech use cases with plug-and-play APIs or partner-led deployments."
         cards={embeddedPaymentsCards}
         showImages={true}
         className="embedded-payments-section px-0"
         listId="embedded-payments-list"
       />
      
      <ProjectCards
        title="Payments Solution, Battle-Tested by Industry Leaders"
        projects={battleTestedProjects}
        showCarousel={false}
        className="battle-tested-section px-0"
      />

      <section className="payments-integration-section">
        <div className="developer-tools">
          <div className="">
            <header className="developer-tools__header text-center">
              <h2 className="developer-tools__title">
                {translate("Flexible Integration: DIY or Partner-Led")}
              </h2>
            </header>
            <div className="row">
              <div className="col-lg-6">
                <div className="integration-column">
                  <h3 className="integration-column__title">
                    {translate("Build It Yourself")}
                  </h3>
                  <p className="integration-column__subtitle">
                    {translate("Ideal for seasoned teams with crypto experience")}
                  </p>
                  <ul className="developer-tools__list">
                    {integrationFeatures.map((feature, index) => (
                      <FeatureItem
                        key={index}
                        link={feature.link}
                        title={feature.title}
                      />
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="integration-column">
                  <h3 className="integration-column__title">
                    {translate("Work with a Partner")}
                  </h3>
                  <p className="integration-column__subtitle">
                    {translate("Ideal for regulated institutions")}
                  </p>
                  <ul className="developer-tools__list">
                    <FeatureItem
                      link="https://discord.com/invite/KTNmhJDXqa"
                      title="Connect with the Community"
                    />
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <DeveloperResourcesSection cards={paymentsResourcesCards} />
    </main>
  );
};

export default PaymentsPage;
