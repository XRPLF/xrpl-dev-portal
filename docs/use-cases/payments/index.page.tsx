import React, { useState } from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";

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
    </main>
  );
};

export default PaymentsPage;
