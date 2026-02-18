import * as React from "react";
import { CardsTextGrid } from "shared/patterns/CardsTextGrid";
import { Divider } from "shared/components/Divider";

export const frontmatter = {
  seo: {
    title: "CardsTextGrid Pattern Showcase",
    description:
      "A comprehensive showcase of the CardsTextGrid section pattern with icon cards, responsive grid layout, and aspect ratios.",
  },
};

const SAMPLE_ICON = "/img/icons/docs.svg";

const sampleCards = [
  {
    heading: "Fast Settlement and Low Fees",
    description:
      "Settle transactions in 3-5 seconds for a fraction of a cent, ideal for large-scale, high-volume RWA tokenization. ",
  },
  {
    heading: "Tutorials",
    description:
      "Step-by-step guides to help you build on the XRP Ledger.",
  },
  {
    heading: "API Reference",
    description:
      "Comprehensive API documentation for all XRPL methods.",
  },
  {
    heading: "Use Cases",
    description:
      "Explore real-world applications built on the XRP Ledger.",
  },
  {
    heading: "Community",
    description:
      "Join the global community of XRPL developers and enthusiasts.",
  },
  {
    heading: "Resources",
    description:
      "Tools, libraries, and resources to accelerate your development.",
  },
];

export default function CardsTextGridShowcase() {
  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-26 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Pattern Showcase</h6>
            <h1 className="mb-4">CardsTextGrid Pattern</h1>
            <p className="longform">
              A section pattern with a header (heading + description) and a grid
              of CardTextIconCard components. Uses PageGrid.Row as="ul" with
              cards as PageGrid.Col as="li". Aspect ratios: sm 16:9, md 3:2, lg
              3:1. Three cards per row at base+md, two cards per row at lg.
            </p>
          </div>
        </section>

        <Divider color="gray" />

        {/* Full Example */}
        <CardsTextGrid
          heading="Explore XRPL Developer Tools"
          description="XRP Ledger is a compliance-focused blockchain where financial applications come to life. Choose a tool to get started."
          cards={sampleCards}
        />

        <Divider color="gray" />

        {/* Shorter Description */}
        <CardsTextGrid
          heading="Key Features"
          description="Everything you need to build amazing applications on XRPL."
          cards={sampleCards.slice(0, 3)}
        />

        <Divider color="gray" />

        {/* Without Description */}
        <CardsTextGrid
          heading="Platform Capabilities"
          cards={sampleCards.slice(0, 2)}
        />

        <Divider color="gray" />

        {/* With Inline Link in Description */}
        <CardsTextGrid
          heading="Resources with Links"
          description="Learn more about our documentation and community."
          cards={[
            {
              icon: SAMPLE_ICON,
              heading: "Documentation",
              description: (
                <>
                  Access everything you need. Learn more in our{" "}
                  <a href="/docs">documentation</a>.
                </>
              ),
            },
            {
              icon: SAMPLE_ICON,
              heading: "Community",
              description: (
                <>
                  Join the global community.{" "}
                  <a href="/community">Get involved</a>.
                </>
              ),
            },
          ]}
        />

        <Divider color="gray" />
      </div>
    </div>
  );
}
