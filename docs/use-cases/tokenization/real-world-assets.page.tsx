import { useThemeHooks } from "@redocly/theme/core/hooks";
import { Link } from "@redocly/theme/components/Link/Link";
import { useEffect } from "react";

export const frontmatter = {
  seo: {
    title: "RWA Tokenization on XRP Ledger",
    description:
      "Power blockchain tokenization use cases on the XRP Ledger. Learn how to issue tokens or build real-world asset (RWA) tokenization solutions with developer tools and APIs.",
  },
};

const benefitsData = [
  {
    iconClass: "low-fees",
    title: "Fast Settlement and Low Fees",
    description:
      "Settle transactions in 3-5 seconds for a fraction of a cent — ideal for large-scale, high-volume RWA tokenization.",
  },
  {
    iconClass: "access",
    title: "On-Chain Metadata",
    description:
      "Easily store key asset information or link to off-chain data using simple APIs giving token holders more transparency and functionality.",
  },
  {
    iconClass: "native-compliance",
    title: "Native Compliance Capabilities",
    description:
      "Automatically check investor credentials, control who can transfer assets, and keep a full record of every transaction. ",
  },
  {
    iconClass: "delegated-token-management",
    title: "Delegated Token Management",
    description:
      "Use a robust permission system to let trusted third parties manage the token on your behalf.",
  },
];

const companies = [
  {
    className: "archax",
    alt: "Archax",
    aspectRatio: 1.25,
    link: "https://archax.com/",
  },
  {
    className: "zoniqx",
    alt: "Zoniqx",
    aspectRatio: 2.7,
    link: "https://www.zoniqx.com/",
  },
  {
    className: "axiology",
    alt: "Axiology",
    aspectRatio: 1.25,
    link: "https://www.axiology.xyz/",
  },
  {
    className: "palisade",
    alt: "Palisade",
    aspectRatio: 1.25,
    link: "https://www.palisade.co/",
  },
  {
    className: "open-eden",
    alt: "Open Eden",
    aspectRatio: 5,
    link: "https://openeden.com/tbill",
  },
  {
    className: "ondo",
    alt: "Ondo",
    aspectRatio: 1.25,
    link: "https://ondo.finance/",
  },
  {
    className: "ripple-logo",
    alt: "Ripple",
    aspectRatio: 3.89,
    link: "https://ripple.com/rwa-tokenization",
  },
  {
    className: "meld",
    alt: "Meld",
    aspectRatio: 0.81,
    link: "https://www.meld.gold/",
  },
  {
    className: "hidden-road",
    alt: "Hidden Road",
    aspectRatio: 0.81,
    link: "https://www.hiddenroad.com/",
  },
];

const features = [
  {
    title: "Get Started with JavaScript",
    link: "https://github.com/XRPLF/xrpl.js",
  },
  {
    title: "Get Started with Python",
    link: "https://github.com/XRPLF/xrpl-py",
  },
  {
    title: "DEX Integration",
    link: "/docs/tutorials/how-tos/use-tokens/trade-in-the-decentralized-exchange",
  },
  {
    title: "Cross-chain Interoperability",
    link: "https://docs.xrplevm.org/docs/axelar/intro-to-axelar/",
  },
  
];
const featuresToken = [
  {
    title: "Proven Open-Source Technology",
    description:
      "With over 3.3B transactions processed, XRP Ledger has been a trusted, battle-tested blockchain for over a decade, supported by a global developer community committed to financial innovation. ",
    number: "01",
  },
  {
    title: "Purpose-Built for Finance",
    description:
      "XRP Ledger provides out-of-the-box institutional-grade functionality, reducing development overhead and eliminating the need for smart contracts. ",
    number: "02",
  },
  {
    title: "Native Compliance & Security",
    description:
      "Maintain control over tokenized assets and enforce compliance with precision using XRP Ledger's native tools such as issuer-defined Authorization, onchain Freeze capabilities, detailed metadata for attestations, and multi-signature accounts.",
    number: "03",
  },
  {
    title: "Pathfinding & Auto-Bridging for Liquidity",
    description:
      "Streamline cross-currency transactions and trading as XRP Ledger’s embedded trading features automatically identify the most efficient routes to enhance liquidity issued tokens and XRP. ",
    number: "04",
  },
];

function FeatureCard({ title, description }) {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  return (
    <article className="feature-card">
      <header className="feature-header">
        <h2 className="feature-title">
          {translate(title)}
        </h2>
      </header>
      <p className="feature-description">{translate(description)}</p>
    </article>
  );
}

function RwaTokenizationFeatures() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  return (
    <section className="rwa-tokenization">
      <div className="container max-w-1150">
        <header className="rwa-header">
          <h2 className="rwa-title">
            {translate("Key Features for Asset Tokenization and DeFi Development")}
          </h2>
        </header>
        <div className="feature-grid">
          {featuresToken.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
        <div className="cta-container">
          <Link
            to="/docs/concepts/tokens/decentralized-exchange/autobridging"
            className="btn btn-primary small-100 auto-bridge"
          >
            {translate("Learn About Auto-bridging")}
          </Link>
          <Link
            to="/docs/concepts/tokens/fungible-tokens/paths"
            className="btn btn-link"
          >
            {translate("Explore Pathfinding")}
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ title, link }) {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  return (
    <li className="feature-item">
      <Link to={link} target="_blank">
      <div className="feature-item__content">
        <span className="feature-item__title">{translate(title)}</span>
        <span className="right-arrow-item"> </span>
      </div>
      <div className="feature-item__divider"></div>
      </Link>
    </li>
  );
}

function DeveloperTools() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  return (
    <section className="developer-tools">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <header className="developer-tools__header">
              <h2 className="developer-tools__title">
                {translate("Developer Tools & APIs")}
              </h2>
              <p className="developer-tools__description">
                {translate(
                  "Streamline development and build powerful RWA tokenization solutions with XRP Ledger's comprehensive developer toolset:"
                )}
              </p>
            </header>
            <ul className="developer-tools__list">
              {features.map((feature, index) => (
                <FeatureItem
                  key={index}
                  link={feature.link}
                  title={feature.title}
                />
              ))}
            </ul>
          </div>
          <div className="col-lg-6 m-h-300">
            <div
              className="developer-tools__image"
              role="img"
              aria-label="Developer tools illustration"
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompanyLogo({ className, alt, aspectRatio, link }) {
  return (
    <div
      onClick={() => window.open(link, "_blank")}
      className={`company-logo ${className}`}
      role="img"
      aria-label={alt}
      style={{ "--aspect-ratio": aspectRatio } as React.CSSProperties}
    />
  );
}
function UpcomingEvents() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  return (
    <section className="upcoming-events">
      <h2 className="upcoming-events__title">
        {translate(
          "Explore the companies pioneering tokenization using XRP Ledger"
        )}
      </h2>
      <div className="upcoming-events__logo-container">
        {companies.map((company, index) => (
          <CompanyLogo key={index} {...company} />
        ))}
      </div>
    </section>
  );
}

const marketIntegrationData = [
  {
    title: "Trading",
    description: (
      <>
        Utilize XRP Ledger's native{" "}
        <Link to="/docs/concepts/tokens/decentralized-exchange">
          decentralized exchange (DEX)
        </Link>{" "}
        with integrated{" "}
        <Link to="/docs/concepts/tokens/decentralized-exchange/automated-market-makers">
          Automated Market Makers (AMM)
        </Link>{" "}
        and onchain 24/7 order books, providing a developer-friendly
        environment to create{" "}
        <Link to="/docs/use-cases/defi">DeFi solutions</Link> for traditional
        finance applications.
      </>
    ),
  },
  {
    title: "Collateral Mobility",
    description: (
      <>
        Issuers can enable{" "}
        <Link to="/docs/concepts/payment-types/escrow">
          escrow functionality
        </Link>{" "}
        to lock tokens and facilitate secure, conditional transfers of assets
        based on time-locks or other conditions to enable automated financial
        use cases onchain.
      </>
    ),
  },
  {
    title: "Delegated Distribution",
    description:
      "Token issuers can delegate user onboarding and token movement to distribution specialists, enabling them to scale their distribution network easily with a single transaction, while avoiding complex off-chain development.",
  },
  {
    title: "Cross-Chain Markets",
    description:
      "Access cross-chain trading and lending markets to enhance token utility and liquidity across ecosystems.",
  },
];

function TokenUtilitySection() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  return (
    <section className="token-utility-section">
      <div className="container">
        <h2 className="section-title">
          {translate("Token Utility and Market Integration")}
        </h2>
        <div className="utility-grid">
          {marketIntegrationData.map((item, index) => (
            <div key={index} className="utility-card">
              <h3 className="utility-title">{translate(item.title)}</h3>
              <p className="utility-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const BenefitCard = ({ iconClass, title, description }) => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  return (
    <article className="benefit-card">
      <div className={`benefit-icon ${iconClass}`}></div>
      <h3 className="benefit-title">{translate(title)}</h3>
      <p className="benefit-description">{translate(description)}</p>
    </article>
  );
};

export default function RwaTokenization() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  useEffect(() => {
    const script = document.createElement('script');
    script.id = 'video-schema'
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": "Generate and Send MPTs",
      "description": "Use the Account Configurator to create an Issuing account. Use the MPT Generator to create a Multi-purpose Token. Send the MPT from the Issuing account to any account that authorizes receipt of the MPT.",
      "thumbnailUrl": "https://i.ytimg.com/vi_webp/ZZ2KZTEJECg/sddefault.webp",
      "uploadDate": "2025-04-11",
      "embedUrl": "https://www.youtube.com/embed/ZZ2KZTEJECg"
    });
    document.head.appendChild(script);
    // Remove the script from the head when the component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  return (
    <div className="page-rwa-tokenization">
      <div className="position-relative d-none-sm">
        <img
          alt="orange waves"
          src={require("./../../../static/img/backgrounds/events-orange.svg")}
          id="events-orange"
        />
      </div>
      <div className="token-title-container">
        <h1 className="token-title">
          {translate(
            "Real-World Asset (RWA) Tokenization on the XRP Ledger"
          )}
        </h1>
        <div className="d-lg-block small-100 ">
          <Link
            className="btn btn-primary btn-arrow-out"
            target="_blank"
            to="/docs/use-cases/tokenization/creating-an-asset-backed-multi-purpose-token"
          >
            {translate("Get Started Now")}
          </Link>
        </div>
      </div>
      <div className="token-video-container">
        <div className="token-video">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/ZZ2KZTEJECg"
            title="Generate and Send MPTs"
            frameBorder="0"
          ></iframe>
        </div>
        <div className="token-video-text-container">
          <p>
            {translate(
              "Issue, manage, and trade real-world assets without needing to build smart contracts."
            )}
          </p>
          <p>
            {translate(
              "XRP Ledger's built-in functionality and compliance-enabling features allow asset tokenization without additional layers of complexity."
            )}
          </p>
        </div>
      </div>

      <div className="token-cards-wrapper">
        <div className="token-cards-container">
          <div>
            <h2 className="cards-title-token">
              {translate(
                "Why Financial Developers Choose XRPL as an RWA Tokenization Platform"
              )}
            </h2>
          </div>
          <div className="benefits-section">
            <div className="benefits-container">
              {benefitsData.map((benefit, index) => (
                <BenefitCard key={index} {...benefit} />
              ))}
            </div>
          </div>
          <div className="d-lg-block small-100">
            <Link
              className="btn btn-primary btn-arrow-out"
              target="_blank"
              to="/docs/use-cases/tokenization/creating-an-asset-backed-multi-purpose-token"
            >
              {translate("Start Building Now")}
            </Link>
          </div>
        </div>
      </div>
      <div className="token-events-wrapper">
        <UpcomingEvents />
      </div>
      <TokenUtilitySection />
      <div className="token-developer-tools-section">
        <DeveloperTools />
      </div>
      <div className="token-features-section">
        <RwaTokenizationFeatures />
      </div>
      <div className="token-dev-resources-section page-community">
        <section className="bottom-cards-section bug-bounty section-padding">
          <div className="com-card">
            <img
              className="top-right-img bug-bounty-card-bg"
              alt="Top Right Image"
            />
            <div className="card-content custom-gap">
              <h6 className="card-title">{translate("Developer Resources")}</h6>
              <p className="card-description">
                {translate("use-cases.rwa.dev-resources.p1", "Easily integrate with ")}
                <Link
                  target="_blank"
                  to="/docs/tutorials/public-servers"
                >
                  {translate("use-cases.rwa.dev-resources.p2", "existing infrastructure ")}
                </Link>
                {translate(
                    "use-cases.rwa.dev-resources.p3", 
                  "and access resources to support your development journey. Fund your project with XRPL Grants or speak to our dev advocates today."
                )}
              </p>
              <div className="card-links">
                <Link
                  className="com-card-link mt-16"
                  target="_blank"
                  to="https://xrplgrants.org/"
                >
                  {translate("Apply for XRPL Grants")}
                </Link>
                <Link
                  className="com-card-link "
                  target="_blank"
                  to="https://twitter.com/RippleDevRel"
                >
                  {translate("Talk to a Dev Advocate")}
                </Link>
              </div>
            </div>
          </div>
          <div className="com-card">
            <img
              className="bottom-right-img bug-bounty-card-bg-2"
              alt="Bottom Right Image"
            />
            <div className="card-content custom-gap">
              <h6 className="card-title">
                {translate("Learn & Stay Updated")}
              </h6>
              <p className="card-description">
                {translate(
                  "Stay ahead of the curve with the latest developments in RWA tokenization on the XRP Ledger by joining the developer Discord and signing up for the XRPL Community Newsletter."
                )}
              </p>
              <div className="card-links">
                <Link
                  target="_blank"
                  className="com-card-link mt-16"
                  to="https://discord.gg/sfX3ERAMjH"
                >
                  {translate("Join the Developer Discord")}
                </Link>
                <Link
                  target="_blank"
                  className="com-card-link"
                  to="https://xrplresources.org/subscribe"
                >
                  {translate("Sign up for the Newsletter")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
