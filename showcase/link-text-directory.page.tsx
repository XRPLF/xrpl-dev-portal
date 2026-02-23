import * as React from "react";
import { LinkTextDirectory } from "shared/sections/LinkTextDirectory";
import { Divider } from "shared/components/Divider";

export const frontmatter = {
  seo: {
    title: 'LinkTextDirectory Component Showcase',
    description: "A comprehensive showcase of the LinkTextDirectory section pattern with numbered cards, responsive layout, and usage examples.",
  }
};

export default function LinkTextDirectoryShowcase() {
  const handleClick = (message: string) => {
    console.log(`Button clicked: ${message}`);
  };

  // Sample cards for demonstrations
  const sampleCards = [
    {
      heading: "Fast Settlement and Low Fees",
      description: "Settle transactions in 3-5 seconds for a fraction of a cent, ideal for large-scale, high-volume RWA tokenization.",
      buttons: [
        { label: "Get Started", href: "/start" },
        { label: "Learn More", href: "/docs" }
      ]
    },
    {
      heading: "Secure and Reliable",
      description: "Built on proven blockchain technology with enterprise-grade security. XRPL has processed billions of transactions since 2012.",
      buttons: [
        { label: "Read Documentation", href: "/docs" }
      ]
    },
    {
      heading: "Developer Friendly",
      description: "Comprehensive APIs and SDKs for seamless integration. Extensive documentation and active community support.",
      buttons: [
        { label: "View API", href: "/api" },
        { label: "See Examples", href: "/examples" }
      ]
    },
    {
      heading: "Sustainability First",
      description: "XRPL is carbon-neutral and energy-efficient. Built for the long-term without compromising on performance.",
      buttons: [
        { label: "Sustainability Report", href: "/sustainability" }
      ]
    }
  ];

  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-26 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Pattern Showcase</h6>
            <h1 className="mb-4">LinkTextDirectory Pattern</h1>
            <p className="longform">
              A section pattern that displays a numbered list of LinkTextCard components.
              Features a heading, optional description, and a vertically stacked list of cards
              with automatic sequential numbering (01, 02, 03...).
            </p>
          </div>
        </section>

        <Divider color="gray" />

        {/* Full Example */}
        <LinkTextDirectory
          heading="Explore XRPL Developer Tools"
          description="XRP Ledger is a compliance-focused blockchain where financial applications come to life. XRP Ledger is a compliance-focused blockchain where financial applications come to life."
          cards={sampleCards}
        />

        <Divider color="gray" />

        {/* Shorter Description */}
        <LinkTextDirectory
          heading="Key Features"
          description="Everything you need to build amazing applications on XRPL."
          cards={sampleCards.slice(0, 3)}
        />

        <Divider color="gray" />

        {/* Without Description */}
        <LinkTextDirectory
          heading="Platform Capabilities"
          cards={sampleCards.slice(0, 2)}
        />

        <Divider color="gray" />

        {/* With Click Handlers */}
        <LinkTextDirectory
          heading="Interactive Examples"
          description="Click any button to see the onClick handler in action (check console)."
          cards={[
            {
              heading: "Example Card 1",
              description: "This card demonstrates onClick handlers for buttons.",
              buttons: [
                { label: "Primary Action", onClick: () => handleClick('Primary 1') },
                { label: "Secondary Action", onClick: () => handleClick('Secondary 1') }
              ]
            },
            {
              heading: "Example Card 2",
              description: "Mix of href and onClick for flexible interactions.",
              buttons: [
                { label: "Navigate", href: "/docs" },
                { label: "Fire Event", onClick: () => handleClick('Event fired') }
              ]
            }
          ]}
        />

        <Divider color="gray" />

        {/* Different Card Counts */}
        <section className="py-26">
          <div className="d-flex flex-column-reverse mb-10">
            <h2 className="h4 mb-8">Different Card Counts</h2>
            <h6 className="eyebrow mb-3">Responsive Behavior</h6>
          </div>

          <div className="mb-10">
            <h6 className="mb-4">1 Card</h6>
            <LinkTextDirectory
              heading="Single Feature"
              description="Layout with single card."
              cards={sampleCards.slice(0, 1)}
            />
          </div>

          <div className="mb-10">
            <h6 className="mb-4">2 Cards</h6>
            <LinkTextDirectory
              heading="Two Features"
              description="Compact layout with two cards."
              cards={sampleCards.slice(0, 2)}
            />
          </div>

          <div className="mb-10">
            <h6 className="mb-4">6 Cards</h6>
            <LinkTextDirectory
              heading="Extended List"
              description="Longer list with multiple cards."
              cards={[
                ...sampleCards,
                {
                  heading: "Low Fees",
                  description: "Minimal transaction costs make XRPL ideal for micro-transactions.",
                  buttons: [{ label: "View Fees", href: "/fees" }]
                },
                {
                  heading: "Open Source",
                  description: "Transparent, community-driven development with no vendor lock-in.",
                  buttons: [{ label: "GitHub", href: "/github" }]
                }
              ]}
            />
          </div>
        </section>

        <Divider color="gray" />
      </div>
    </div>
  );
}
