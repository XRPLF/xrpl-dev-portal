import React, { useState } from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import { AdvantagesSection } from "shared/components/advantages-section";
import { ProjectCards } from "shared/components/project-cards";

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
          subtitle: "100% uptime since 2012",
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
      url: "#",
      description: "RLUSD, Ripple's enterprise-grade stablecoin, is live on XRPL and fully backed by USD deposits.",
    },
    {
      id: "usdc", 
      label: "USDC",
      url: "#",
      description: "USDC, issued by Circle, is the world's largest regulated dollar stablecoin and now live on XRPL.",
    },
    {
      id: "usdb",
      label: "USDB", 
      url: "#",
      description: "USDB, by Braza Group, is a USD-pegged stablecoin backed by U.S. and Brazilian bonds.",
    },
    {
      id: "europ",
      label: "EUROP",
      url: "#", 
      description: "EUROP, issued by Schuman Financial, is the first MiCA-compliant euro stablecoin on XRPL.",
    },
    {
      id: "xsgd",
      label: "XSGD",
      url: "#",
      description: "XSGD, from StraitsX, is a Singapore Dollar-backed stablecoin regulated by MAS.",
    },
    {
      id: "audd",
      label: "AUDD", 
      url: "#",
      description: "AUDD, an Australian dollar stablecoin, is live on XRPL and backed 1:1 with AUD.",
    },
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
    </main>
  );
};

export default PaymentsPage;
