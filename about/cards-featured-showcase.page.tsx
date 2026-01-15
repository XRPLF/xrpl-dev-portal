import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";
import { CardsFeatured } from "shared/patterns/CardsFeatured";
import { Divider } from "shared/components/Divider";

export const frontmatter = {
  seo: {
    title: 'CardsFeatured Pattern Showcase',
    description: "A comprehensive showcase of the CardsFeatured pattern component demonstrating light and dark mode variations in the XRPL.org Design System.",
  }
};

// Sample image URL for demonstration
const SAMPLE_IMAGE = "/img/cards/card-image-showcase.png";

// Sample cards data - 6 cards for full showcase
const sampleCards = [
  {
    image: SAMPLE_IMAGE,
    imageAlt: "Documentation illustration",
    title: "Documentation",
    subtitle: "Access everything you need to get started working with the XRPL.",
    buttonLabel: "Get Started",
    href: "#docs",
  },
  {
    image: SAMPLE_IMAGE,
    imageAlt: "Tutorials illustration",
    title: "Tutorials",
    subtitle: "Step-by-step guides to help you build on the XRP Ledger.",
    buttonLabel: "View Tutorials",
    href: "#tutorials",
  },
  {
    image: SAMPLE_IMAGE,
    imageAlt: "API Reference illustration",
    title: "API Reference",
    subtitle: "Comprehensive API documentation for all XRPL methods.",
    buttonLabel: "Explore API",
    href: "#api",
  },
  {
    image: SAMPLE_IMAGE,
    imageAlt: "Use Cases illustration",
    title: "Use Cases",
    subtitle: "Explore real-world applications built on the XRP Ledger.",
    buttonLabel: "View Use Cases",
    href: "#use-cases",
  },
  {
    image: SAMPLE_IMAGE,
    imageAlt: "Community illustration",
    title: "Community",
    subtitle: "Join the global community of XRPL developers and enthusiasts.",
    buttonLabel: "Join Community",
    href: "#community",
  },
  {
    image: SAMPLE_IMAGE,
    imageAlt: "Resources illustration",
    title: "Resources",
    subtitle: "Tools, libraries, and resources to accelerate your development.",
    buttonLabel: "Browse Resources",
    href: "#resources",
  },
];

export default function CardsFeaturedShowcase() {
  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-26 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Pattern Showcase</h6>
            <h1 className="mb-4">CardsFeatured Pattern</h1>
            <p className="longform">
              A section pattern that displays a heading, description, and a responsive grid
              of CardImage components. Follows the "Logo Rectangle Grid" design from Figma.
            </p>
          </div>
        </section>

        {/* Design Specifications */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Design Specifications</h2>
              <div className="d-flex flex-row gap-6 mb-6" style={{ flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Typography</h6>
                  <ul className="mb-0">
                    <li><strong>Heading:</strong> heading-md (Tobias Light)</li>
                    <li><strong>Description:</strong> body-l (Booton Light)</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Header Gap</h6>
                  <ul className="mb-0">
                    <li><strong>Desktop:</strong> 16px</li>
                    <li><strong>Tablet:</strong> 8px</li>
                    <li><strong>Mobile:</strong> 8px</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Cards Column Gap</h6>
                  <ul className="mb-0">
                    <li><strong>Desktop:</strong> 8px</li>
                    <li><strong>Tablet:</strong> 8px</li>
                    <li><strong>Mobile:</strong> 48px</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Cards Row Gap (Vertical)</h6>
                  <ul className="mb-0">
                    <li><strong>Desktop:</strong> 56px</li>
                    <li><strong>Tablet:</strong> 53px</li>
                    <li><strong>Mobile:</strong> 48px</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Section Padding (Vertical)</h6>
                  <ul className="mb-0">
                    <li><strong>Desktop:</strong> 80px</li>
                    <li><strong>Tablet:</strong> 64px</li>
                    <li><strong>Mobile:</strong> 48px</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Grid</h6>
                  <ul className="mb-0">
                    <li><strong>Mobile:</strong> 1 column</li>
                    <li><strong>Tablet:</strong> 2 columns</li>
                    <li><strong>Desktop:</strong> 3 columns</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Colors</h6>
                  <ul className="mb-0">
                    <li><strong>Light:</strong> $black (#141414)</li>
                    <li><strong>Dark:</strong> $white (#FFFFFF)</li>
                  </ul>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <Divider />

        {/* 6 Cards Example - Full Showcase */}
        <section>
          <CardsFeatured
            heading="Trusted by Leaders in Real-World Asset Tokenization"
            description="Powering institutions and builders who are bringing real world assets on chain at global scale."
            cards={sampleCards}
          />
        </section>

        <Divider />

        {/* 3 Cards Example */}
        <section>
          <CardsFeatured
            heading="Developer Resources"
            description="Everything you need to start building on the XRP Ledger."
            cards={sampleCards.slice(0, 3)}
          />
        </section>

        <Divider />
      </div>
    </div>
  );
}

