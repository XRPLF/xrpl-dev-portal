import * as React from "react";
import {
  PageGrid,
  PageGridRow,
  PageGridCol,
} from "shared/components/PageGrid/page-grid";
import StandardCardGroupSection, {
  type StandardCardPropsWithoutVariant,
} from "shared/patterns/StandardCardGroupSection/StandardCardGroupSection";

export const frontmatter = {
  seo: {
    title: "StandardCardGroupSection Pattern Showcase",
    description:
      "Interactive showcase of the StandardCardGroupSection pattern with all variants, responsive behavior, and composition examples.",
  },
};

// Demo component for code examples
const CodeDemo = ({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description?: string;
  code?: string;
  children?: React.ReactNode;
}) => (
  <div className="mb-26">
    <h3 className="h4 mb-4">{title}</h3>
    {description && <p className="mb-6">{description}</p>}
    {code && (
      <div
        className="mb-6 p-4 bg-light br-4 text-black"
        style={{
          fontFamily: "monospace",
          fontSize: "14px",
          overflow: "auto",
        }}
      >
        <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "#000" }}>
          {code}
        </pre>
      </div>
    )}
    {children && (
      <div
        style={{
          border: "1px dashed #ccc",
          padding: "16px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        {children}
      </div>
    )}
  </div>
);

// Module-level card data to avoid recreating on each render
const BASIC_CARDS: readonly StandardCardPropsWithoutVariant[] = [
  {
    headline: "Feature 1",
    children: "Description of feature 1",
    callsToAction: [{ children: "Learn More", href: "/feature1" }],
  },
  {
    headline: "Feature 2",
    children: "Description of feature 2",
    callsToAction: [{ children: "Learn More", href: "/feature2" }],
  },
];

const GREEN_VARIANT_CARDS: readonly StandardCardPropsWithoutVariant[] = [
  {
    headline: "Developer Tools",
    children: "Comprehensive APIs and SDKs for building on XRPL",
    callsToAction: [{ children: "Get Started", href: "/docs" }],
  },
  {
    headline: "Payment Solutions",
    children: "Fast, low-cost global payment infrastructure",
    callsToAction: [{ children: "Learn More", href: "/payments" }],
  },
  {
    headline: "Tokenization",
    children: "Issue and manage digital assets on XRPL",
    callsToAction: [{ children: "Explore", href: "/tokens" }],
  },
  {
    headline: "DeFi Protocols",
    children: "Decentralized finance applications and liquidity pools",
    callsToAction: [{ children: "Discover", href: "/defi" }],
  },
  {
    headline: "NFT Marketplace",
    children: "Create, trade, and manage non-fungible tokens",
    callsToAction: [{ children: "View Marketplace", href: "/nfts" }],
  },
  {
    headline: "Enterprise Solutions",
    children: "Scalable blockchain infrastructure for businesses",
    callsToAction: [{ children: "Contact Sales", href: "/enterprise" }],
  },
];

const NEUTRAL_VARIANT_CARDS: readonly StandardCardPropsWithoutVariant[] = [
  {
    headline: "Documentation",
    children: "Comprehensive guides and API references",
    callsToAction: [{ children: "View Docs", href: "/docs" }],
  },
  {
    headline: "Tutorials",
    children: "Step-by-step guides and examples",
    callsToAction: [{ children: "Browse Tutorials", href: "/tutorials" }],
  },
];

const YELLOW_VARIANT_CARDS: readonly StandardCardPropsWithoutVariant[] = [
  {
    headline: "New Features",
    children: "Latest updates and enhancements to the platform",
    callsToAction: [{ children: "See What's New", href: "/features" }],
  },
  {
    headline: "Special Offers",
    children: "Exclusive deals and promotions for early adopters",
    callsToAction: [{ children: "View Offers", href: "/offers" }],
  },
  {
    headline: "Community Events",
    children: "Join upcoming workshops, webinars, and meetups",
    callsToAction: [{ children: "Browse Events", href: "/events" }],
  },
];

const BLUE_VARIANT_CARDS: readonly StandardCardPropsWithoutVariant[] = [
  {
    headline: "Cross-Border Payments",
    children: "Send money globally in seconds",
    callsToAction: [{ children: "Learn More", href: "/payments" }],
  },
  {
    headline: "NFT Marketplaces",
    children: "Create and trade digital collectibles",
    callsToAction: [{ children: "Explore", href: "/nfts" }],
  },
  {
    headline: "Central Bank Digital Currencies",
    children: "CBDC infrastructure and solutions",
    callsToAction: [{ children: "Read More", href: "/cbdc" }],
  },
];

const SECONDARY_CTA_CARDS: readonly StandardCardPropsWithoutVariant[] = [
  {
    headline: "Enterprise Solutions",
    children: "Scalable infrastructure for large organizations",
    callsToAction: [
      { children: "Contact Sales", href: "/contact" },
      { children: "View Case Studies", href: "/cases" },
    ],
  },
  {
    headline: "Developer Platform",
    children: "Tools and APIs for building on XRPL",
    callsToAction: [
      { children: "Get Started", href: "/start" },
      { children: "View Docs", href: "/docs" },
    ],
  },
];

const SINGLE_CTA_CARDS: readonly StandardCardPropsWithoutVariant[] = [
  {
    headline: "Documentation",
    children: "Complete API reference and guides",
    callsToAction: [{ children: "View Docs", href: "/docs" }],
  },
  {
    headline: "Community",
    children: "Join developers and builders",
    callsToAction: [{ children: "Join Now", href: "/community" }],
  },
  {
    headline: "Blog",
    children: "Latest news and updates",
    callsToAction: [{ children: "Read Blog", href: "/blog" }],
  },
];

export default function StandardCardGroupSectionShowcase() {
  return (
    <div className="landing">
      <PageGridRow>
        <PageGridCol>
          <div className="text-center mb-26">
            <h6 className="eyebrow mb-3">Pattern Showcase</h6>
            <h1 className="h2 mb-4">StandardCardGroupSection Pattern</h1>
            <p className="longform">
              A section pattern that displays a headline, description, and a
              responsive grid of StandardCard components. All cards share a
              uniform variant determined by the section, ensuring visual
              consistency across the group.
            </p>
          </div>
        </PageGridCol>
      </PageGridRow>

      {/* Basic Usage */}
      <PageGridRow>
        <PageGridCol>
          <CodeDemo
            title="Basic Usage"
            description="The simplest implementation with a headline, description, variant, and array of cards."
            code={`<StandardCardGroupSection
  headline="Our Features"
  description="Explore what we offer"
  variant="neutral"
  cards={[
    {
      headline: "Feature 1",
      children: "Description of feature 1",
      callsToAction: [
        { children: "Learn More", href: "/feature1" }
      ]
    },
    {
      headline: "Feature 2",
      children: "Description of feature 2",
      callsToAction: [
        { children: "Learn More", href: "/feature2" }
      ]
    }
  ]}
/>`}
          >
            <StandardCardGroupSection
              headline="Our Features"
              description="Explore what we offer"
              variant="neutral"
              cards={BASIC_CARDS}
            />
          </CodeDemo>
        </PageGridCol>
      </PageGridRow>

      {/* Variant: Green */}
      <PageGridRow>
        <PageGridCol>
          <CodeDemo
            title="Green Variant"
            description="Using the green variant for brand-focused content."
            code={`<StandardCardGroupSection
  headline="XRPL Solutions"
  description="Powerful tools and services built on XRPL"
  variant="green"
  cards={[...]}
/>`}
          />
        </PageGridCol>
      </PageGridRow>
      <StandardCardGroupSection
        headline="XRPL Solutions"
        description="Powerful tools and services built on XRPL"
        variant="green"
        cards={GREEN_VARIANT_CARDS}
      />

      {/* Variant: Light Gray */}
      <PageGridRow>
        <PageGridCol>
          <CodeDemo
            title="Neutral Variant"
            description="Using the neutral variant for subtle, neutral content."
            code={`<StandardCardGroupSection
  headline="Resources"
  description="Everything you need to get started"
  variant="neutral"
  cards={[...]}
/>`}
          />
        </PageGridCol>
      </PageGridRow>
      <StandardCardGroupSection
        headline="Resources"
        description="Everything you need to get started"
        variant="neutral"
        cards={NEUTRAL_VARIANT_CARDS}
      />

      {/* Variant: Yellow */}
      <PageGridRow>
        <PageGridCol>
          <CodeDemo
            title="Yellow Variant"
            description="Using the yellow variant for attention-grabbing, high-energy content."
            code={`<StandardCardGroupSection
  headline="Featured Highlights"
  description="Discover our most exciting features and opportunities"
  variant="yellow"
  cards={[...]}
/>`}
          />
        </PageGridCol>
      </PageGridRow>
      <StandardCardGroupSection
        headline="Featured Highlights"
        description="Discover our most exciting features and opportunities"
        variant="yellow"
        cards={YELLOW_VARIANT_CARDS}
      />

      {/* Variant: Blue */}
      <PageGridRow>
        <PageGridCol>
          <CodeDemo
            title="Blue Variant"
            description="Using the blue variant for secondary content sections."
            code={`<StandardCardGroupSection
  headline="Use Cases"
  description="Real-world applications of XRPL technology"
  variant="blue"
  cards={[...]}
/>`}
          />
        </PageGridCol>
      </PageGridRow>
      <StandardCardGroupSection
        headline="Use Cases"
        description="Real-world applications of XRPL technology"
        variant="blue"
        cards={BLUE_VARIANT_CARDS}
      />

      {/* With Secondary CTA */}
      <PageGridRow>
        <PageGridCol>
          <CodeDemo
            title="Cards with Secondary CTA"
            description="Cards can include both primary and secondary call-to-action buttons."
            code={`<StandardCardGroupSection
  headline="Services"
  description="Comprehensive solutions for your needs"
  variant="neutral"
  cards={[
    {
      headline: "Service 1",
      children: "Description",
      callsToAction: [
        { children: "Get Started", href: "/start" },
        { children: "Learn More", href: "/learn" }
      ]
    }
  ]}
/>`}
          />
        </PageGridCol>
      </PageGridRow>
      <StandardCardGroupSection
        headline="Services"
        description="Comprehensive solutions for your needs"
        variant="neutral"
        cards={SECONDARY_CTA_CARDS}
      />

      {/* Single CTA Only */}
      <PageGridRow>
        <PageGridCol>
          <CodeDemo
            title="Single CTA Only"
            description="Cards can have just a primary call-to-action button."
            code={`<StandardCardGroupSection
  headline="Quick Links"
  description="Fast access to key resources"
  variant="green"
  cards={[
    {
      headline: "Link 1",
      children: "Description",
      callsToAction: [
        { children: "Visit", href: "/link1" }
      ]
    }
  ]}
/>`}
          />
        </PageGridCol>
      </PageGridRow>
      <StandardCardGroupSection
        headline="Quick Links"
        description="Fast access to key resources"
        variant="green"
        cards={SINGLE_CTA_CARDS}
      />

      {/* Responsive Behavior */}
      <PageGridRow>
        <PageGridCol>
          <div className="mb-26">
            <h2 className="h3 mb-6">Responsive Behavior</h2>
            <p className="mb-6">
              The StandardCardGroupSection automatically adapts its layout based
              on screen size:
            </p>
            <ul className="mb-6">
              <li>
                <strong>Mobile (base):</strong> 1 column - cards stack
                vertically
              </li>
              <li>
                <strong>Tablet (md):</strong> 3 columns - cards display in a
                3-column grid
              </li>
              <li>
                <strong>Desktop (lg):</strong> 3 columns - cards display in a
                3-column grid
              </li>
            </ul>
            <p className="mb-6">
              Resize your browser window to see the responsive behavior in
              action.
            </p>
          </div>
        </PageGridCol>
      </PageGridRow>

      {/* Code Examples */}
      <PageGridRow>
        <PageGridCol>
          <div className="mb-26">
            <h2 className="h3 mb-6">Code Examples</h2>

            <h4 className="h5 mb-4">Import</h4>
            <div
              className="p-4 bg-light br-4 mb-6"
              style={{ fontFamily: "monospace", fontSize: "14px" }}
            >
              <pre style={{ margin: 0, color: "#000" }}>
                {`import StandardCardGroupSection from "shared/patterns/StandardCardGroupSection/StandardCardGroupSection";`}
              </pre>
            </div>

            <h4 className="h5 mb-4">Basic Example</h4>
            <div
              className="p-4 bg-light br-4 mb-6"
              style={{
                fontFamily: "monospace",
                fontSize: "14px",
                overflow: "auto",
                backgroundColor: "#1e1e1e",
                color: "#d4d4d4",
              }}
            >
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {`<StandardCardGroupSection
  headline="Our Features"
  description="Explore what we offer"
  variant="neutral"
  cards={[
    {
      headline: "Feature 1",
      children: "Description of feature 1",
      callsToAction: [
        { children: "Learn More", href: "/feature1" }
      ]
    },
    {
      headline: "Feature 2",
      children: "Description of feature 2",
      callsToAction: [
        { children: "Learn More", href: "/feature2" }
      ]
    }
  ]}
/>`}
              </pre>
            </div>

            <h4 className="h5 mb-4">With Secondary CTA</h4>
            <div
              className="p-4 bg-light br-4 mb-6"
              style={{
                fontFamily: "monospace",
                fontSize: "14px",
                overflow: "auto",
                backgroundColor: "#1e1e1e",
                color: "#d4d4d4",
              }}
            >
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {`<StandardCardGroupSection
  headline="Services"
  description="Comprehensive solutions"
  variant="green"
  cards={[
    {
      headline: "Service 1",
      children: "Description",
      callsToAction: [
        { children: "Get Started", href: "/start" },
        { children: "Learn More", href: "/learn" }
      ]
    }
  ]}
/>`}
              </pre>
            </div>
          </div>
        </PageGridCol>
      </PageGridRow>

      {/* Best Practices */}
      <PageGridRow>
        <PageGridCol>
          <div className="mb-26">
            <h2 className="h3 mb-6">Best Practices</h2>
            <ul>
              <li>
                <strong>Variant Consistency:</strong> All cards in a section
                share the same variant. This ensures visual consistency and
                prevents individual cards from having different variants.
              </li>
              <li>
                <strong>Card Count:</strong> Aim for multiples of 3 for best
                visual balance on desktop (3, 6, 9 cards).
              </li>
              <li>
                <strong>Headlines:</strong> Keep card headlines concise and
                impactful (1-2 lines preferred).
              </li>
              <li>
                <strong>Descriptions:</strong> Provide clear, actionable
                descriptions (2-3 lines max).
              </li>
              <li>
                <strong>CTAs:</strong> Use action-oriented button text ("Get
                Started" not "Click Here").
              </li>
              <li>
                <strong>Section Headline:</strong> Make it descriptive and
                specific to help users understand the card group's purpose.
              </li>
              <li>
                <strong>Accessibility:</strong> The component includes ARIA
                roles and labels for screen readers. Ensure card headlines are
                descriptive.
              </li>
            </ul>
          </div>
        </PageGridCol>
      </PageGridRow>
    </div>
  );
}
