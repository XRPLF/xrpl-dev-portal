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

// Sample cards data
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
                  <h6 className="mb-3">Spacing</h6>
                  <ul className="mb-0">
                    <li><strong>Header gap:</strong> 16px</li>
                    <li><strong>Cards gap:</strong> 8px</li>
                    <li><strong>Section gap:</strong> 24-40px (responsive)</li>
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

        {/* Example */}
        <section className="py-26">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <h2 className="h4 mb-2">Example</h2>
                <p className="mb-8">
                  Toggle the site theme to see the component adapt to light and dark modes.
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <div className="pt-10">
            <CardsFeatured
              heading="Trusted by Leaders in Real-World Asset Tokenization"
              description="Powering institutions and builders who are bringing real world assets on chain at global scale."
              cards={sampleCards}
            />
          </div>
        </section>

        <Divider />
        <div style={{paddingTop: '100px'}}></div>
        {/* Two Cards Example */}
        <section className="py-26">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <h2 className="h4 mb-2">Two Cards Layout</h2>
                <p className="mb-8" style={{ color: '#72777E' }}>
                  The pattern gracefully handles fewer than 3 cards.
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CardsFeatured
            heading="Developer Resources"
            description="Everything you need to start building on the XRP Ledger."
            cards={sampleCards.slice(0, 2)}
          />
        </section>


        <Divider />
      </div>
    </div>
  );
}

