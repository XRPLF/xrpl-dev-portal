import * as React from "react";
import { CardsIconGrid } from "shared/sections/CardsIconGrid";
import { Divider } from "shared/components/Divider";

export const frontmatter = {
  seo: {
    title: "CardsIconGrid Pattern Showcase",
    description:
      "A comprehensive showcase of the CardsIconGrid section pattern with icon cards, responsive grid layout, and aspect ratios.",
  },
};

const SAMPLE_ICON = "/img/navbar/docs.svg";

const sampleCards = [
  {
    icon: SAMPLE_ICON,
    iconAlt: "Digital Wallets",
    heading: "Digital Wallets",
    description:
      "Offer fast, low-fee stablecoin payments between users and applications.",
  },
  {
    icon: SAMPLE_ICON,
    iconAlt: "Tutorials",
    heading: "Tutorials",
    description:
      "Step-by-step guides to help you build on the XRP Ledger.",
  },
  {
    icon: SAMPLE_ICON,
    iconAlt: "API Reference", 
    heading: "API Reference",
    description:
      "Comprehensive API documentation for all XRPL methods.",
  },
  {
    icon: SAMPLE_ICON,
    iconAlt: "Use Cases",
    heading: "Use Cases",
    description:
      "Explore real-world applications built on the XRP Ledger.",
  },
  {
    icon: SAMPLE_ICON,
    iconAlt: "Community",
    heading: "Community",
    description:
      "Join the global community of XRPL developers and enthusiasts.",
  },
  {
    icon: SAMPLE_ICON,
    iconAlt: "Resources",
    heading: "Resources",
    description:
      "Tools, libraries, and resources to accelerate your development.",
  },
];

export default function CardsIconGridShowcase() {
  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-26 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Pattern Showcase</h6>
            <h1 className="mb-4">CardsIconGrid Pattern</h1>
            <p className="longform">
              A section pattern with a header (heading + description) and a grid
              of CardTextIconCard components. Uses PageGrid.Row as="ul" with
              cards as PageGrid.Col as="li". Aspect ratios: sm 3:2, md/lg 4:3.
              Three cards per row at all breakpoints.
            </p>
          </div>
        </section>

        <Divider color="gray" />

        {/* Full Example */}
        <CardsIconGrid
          heading="Unlock New Business Models with Embedded Payments"
          description="XRPL Payments supports modern fintech use cases with plug-and-play APIs or partner-led deployments."
          cards={sampleCards}
        />

        <Divider color="gray" />

        {/* Shorter Description */}
        <CardsIconGrid
          heading="Key Features"
          description="Everything you need to build amazing applications on XRPL."
          cards={sampleCards.slice(0, 3)}
        />

        <Divider color="gray" />

        {/* Without Description */}
        <CardsIconGrid
          heading="Platform Capabilities"
          cards={sampleCards.slice(0, 2)}
        />

        <Divider color="gray" />

        {/* With Inline Link in Description */}
        <CardsIconGrid
          heading="Resources with Links"
          description="Learn more about our documentation and community."
          cards={[
            {
              icon: SAMPLE_ICON,
              iconAlt: "Documentation",
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
              iconAlt: "Community",
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
