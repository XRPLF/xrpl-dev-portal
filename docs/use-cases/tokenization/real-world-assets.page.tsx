import { useThemeHooks } from "@redocly/theme/core/hooks";
import { Link } from "@redocly/theme/components/Link/Link";
import { useEffect } from "react";

export const frontmatter = {
  seo: {
    title: "Real-World Asset Tokenization",
    description:
      "Power blockchain tokenization use cases on the XRP Ledger. Learn how to build RWA tokenization solutions with developer tools and APIs. Get started today.",
  },
};

const benefitsData = [
  {
    iconClass: "low-fees",
    title: "Fast Settlement and Low Fees",
    description:
      "Leverage transaction finality in 3-5 seconds at fractions of a cent, making XRP Ledger an ideal platform for handling large-scale tokenization with cost-effective, high-speed transactions.",
  },
  {
    iconClass: "access",
    title: "Access to Liquidity",
    description:
      "Integrate XRP Ledger's native liquidity pools and order books directly into your applications via API. Liquidity is aggregated at the protocol layer, rather than fragmented across various applications, providing developers with seamless access at the core blockchain level.",
  },
  {
    iconClass: "full-stack",
    title: "Full-Stack Tokenization Tools",
    description:
      "Issue, manage, and trade real-world assets without needing to build smart contracts. XRP Ledger's built-in functionality and compliance-enabling features allows you to focus on building without additional layers of complexity.",
  },
  {
    iconClass: "best-in-class",
    title: "Best-in-Class On-chain DEX",
    description:
      "Utilize XRP Ledger's native decentralized exchange (DEX) with integrated Automated Market Makers (AMM) and on-chain 24/7 order books, providing a developer-friendly environment to create DeFi solutions for traditional finance applications.",
  },
  {
    iconClass: "cross-chain",
    title: "Cross-Chain Interoperability",
    description:
      "Enable seamless interaction with other blockchains via secure cross-chain bridges, allowing you to expand your project's functionality and liquidity options across ecosystems.",
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
];

const features = [
  {
    title: "Token Issuance Tutorial",
    link: "/docs/tutorials/how-tos/use-tokens/issue-a-fungible-token",
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
      "XRP Ledger has been a trusted, battle-tested blockchain for over a decade, supported by a global developer community committed to financial innovation.",
    number: "01",
  },
  {
    title: "Purpose-Built for Finance",
    description:
      "XRP Ledger provides out-of-the-box institutional-grade functionality, reducing development overhead and eliminating the need for smart contracts.",
    number: "02",
  },
  {
    title: "Native Compliance & Security",
    description:
      "Maintain control over tokenized assets and user access with XRP Ledger's asset control features, multi-signature accounts, and built-in compliance tools.",
    number: "03",
  },
  {
    title: "Pathfinding & Auto-Bridging for Liquidity",
    description:
      "Streamline cross-currency transactions and trading with XRP Ledger's auto-bridging and pathfinding features to automatically increase liquidity between issued tokens and XRP.",
    number: "04",
  },
];

function FeatureCard({ title, description }) {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  return (
    <article className="feature-card">
      <header className="feature-header">
        <h2 className="feature-title">{translate(title)}</h2>
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
            {translate("Why Developers Choose XRPL for RWA Tokenization")}
          </h2>
          <p className="rwa-subtitle">
            {translate(
              "A developer-first blockchain for building efficient, scalable tokenization solutions."
            )}
          </p>
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
      style={{ "--aspect-ratio": aspectRatio }}
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
      "name": "Tokenization on XRP Ledger",
      "description": "The XRP Ledger was the first blockchain to support the tokenization of a variety of assets. This includes stablecoins or other forms of value – anything from US dollars, to euros, gold, stocks, and other cryptocurrencies like Bitcoin or Ethereum – and even non-fungible tokens (NFTs) that might represent valuable items like pieces of art or cinema tickets. Tokens are often called issued assets, or IOUs, on the XRPL.",
      "thumbnailUrl": "https://i.ytimg.com/vi/Oj4cWOiWf4A/hqdefault.jpg",
      "uploadDate": "2022-01-10",
      "embedUrl": "https://www.youtube.com/watch?v=Oj4cWOiWf4A"
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
            "Build Real-World Asset Tokenization Solutions on the XRP Ledger"
          )}
        </h1>
        <div className="d-lg-block small-100 ">
          <Link
            className="btn btn-primary btn-arrow-out"
            target="_blank"
            to="/docs/tutorials/how-tos/use-tokens/issue-a-fungible-token"
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
            src="https://www.youtube.com/embed/Oj4cWOiWf4A"
            title="YouTube video player"
            frameBorder="0"
          ></iframe>
        </div>
        <div className="token-video-text-container">
          <p>
            {translate(
              "Access the blockchain built for business to power financial asset tokenization with decentralized architecture, fast settlement, and institutional-grade tools."
            )}
          </p>
          <p>
            {translate(
              "XRP Ledger's open-source, decentralized technology is scalable, interoperable and highly efficient—specifically designed to enable tokenization of real-world financial assets."
            )}
          </p>
        </div>
      </div>

      <div className="token-cards-wrapper">
        <div className="token-cards-container">
          <div>
            <h2 className="cards-title-token">
              {translate(
                "Benefits of Real-World Asset Tokenization Development on XRP Ledger"
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
              to="/docs/tutorials/how-tos/use-tokens/issue-a-fungible-token"
            >
              {translate("Start Building Now")}
            </Link>
          </div>
        </div>
      </div>
      <div className="token-events-wrapper">
        <UpcomingEvents />
      </div>
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
