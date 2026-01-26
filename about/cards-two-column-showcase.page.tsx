import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";
import { CardsTwoColumn } from "shared/patterns/CardsTwoColumn";
import { TextCard } from "shared/patterns/CardsTwoColumn";
import { Divider } from "shared/components/Divider";

export const frontmatter = {
  seo: {
    title: 'CardsTwoColumn Pattern Showcase',
    description: "A comprehensive showcase of the CardsTwoColumn pattern component demonstrating different color combinations and arrangements in the XRPL.org Design System.",
  }
};

export default function CardsTwoColumnShowcase() {
  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-26 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Pattern Showcase</h6>
            <h1 className="mb-4">CardsTwoColumn Pattern</h1>
            <p className="longform">
              A section pattern with a header (title + description) and a 2x2 grid of TextCard components.
              Features 4 color variants and responsive behavior across all breakpoints.
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
                  <h6 className="mb-3">Section Typography</h6>
                  <ul className="mb-0">
                    <li><strong>Title:</strong> heading-md (Tobias Light)</li>
                    <li><strong>Description:</strong> body-l (Booton Light, muted)</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Card Typography</h6>
                  <ul className="mb-0">
                    <li><strong>Title:</strong> heading-lg (Tobias Light)</li>
                    <li><strong>Description:</strong> body-l (Booton Light)</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Card Heights</h6>
                  <ul className="mb-0">
                    <li><strong>Desktop:</strong> 340px</li>
                    <li><strong>Tablet:</strong> 309px</li>
                    <li><strong>Mobile:</strong> 274px</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Section Padding</h6>
                  <ul className="mb-0">
                    <li><strong>Desktop:</strong> 40px vertical, 32px horizontal</li>
                    <li><strong>Tablet:</strong> 32px vertical, 24px horizontal</li>
                    <li><strong>Mobile:</strong> 24px vertical, 16px horizontal</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Gap Between Header & Cards</h6>
                  <ul className="mb-0">
                    <li><strong>Desktop:</strong> 40px</li>
                    <li><strong>Tablet:</strong> 32px</li>
                    <li><strong>Mobile:</strong> 24px</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Grid Layout</h6>
                  <ul className="mb-0">
                    <li><strong>Desktop:</strong> 2×2 grid (8px gap)</li>
                    <li><strong>Tablet:</strong> 1 column stacked (8px gap)</li>
                    <li><strong>Mobile:</strong> 1 column stacked (8px gap)</li>
                  </ul>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <Divider />

        {/* Full Pattern Example */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Full Pattern Example</h2>
              <p className="mb-6">
                The CardsTwoColumn pattern includes a header section (title + description) and a 2×2 grid of TextCards.
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <CardsTwoColumn
          title="The Future of Finance is Already Onchain"
          description="XRP Ledger isn't about bold predictions. It's about delivering value now. Institutions, developers, and enterprises are already building on XRPL."
          secondaryDescription="On XRPL, you're not waiting for the future. You're building it."
          cards={[
            {
              title: "Institutions",
              description: "Banks, asset managers, PSPs, and fintechs use XRPL to build financial products and DeFi solutions efficiently and with more flexibility.",
              href: "#institutions",
              color: "lilac"
            },
            {
              title: "Developers",
              description: "Build decentralized applications with comprehensive documentation, tutorials, and developer tools.",
              href: "#developers",
              color: "neutral-light"
            },
            {
              title: "Enterprise",
              description: "Scale your business with enterprise-grade blockchain solutions and dedicated support.",
              href: "#enterprise",
              color: "neutral-dark"
            },
            {
              title: "Community",
              description: "Join the global community of XRPL developers, validators, and enthusiasts.",
              href: "#community",
              color: "green"
            }
          ]}
        />

        <Divider />

        {/* Color Variants Section */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Color Variant Combinations</h2>
              <p className="mb-6">
                TextCard supports 4 color variants: green ($green-300), neutral-light ($gray-200), neutral-dark ($gray-300), and lilac ($lilac-200).
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* All Green Cards */}
        <CardsTwoColumn
          title="All Green Variant"
          description="Using the same color creates a unified, cohesive look for related content."
          cards={[
            { title: "Payments", description: "Fast, low-cost cross-border payments.", color: "green" },
            { title: "Tokenization", description: "Issue and manage digital assets.", color: "green" },
            { title: "DeFi", description: "Decentralized finance solutions.", color: "green" },
            { title: "NFTs", description: "Non-fungible token marketplace.", color: "green" }
          ]}
        />

        <Divider />

        {/* Mixed Colors */}
        <CardsTwoColumn
          title="Mixed Color Arrangement"
          description="Different colors can be used to create visual hierarchy and distinguish between content types."
          cards={[
            { title: "Documentation", description: "Comprehensive guides and API references.", color: "lilac" },
            { title: "Tutorials", description: "Step-by-step learning resources.", color: "green" },
            { title: "Use Cases", description: "Real-world applications and success stories.", color: "neutral-light" },
            { title: "Resources", description: "Tools and libraries for development.", color: "neutral-dark" }
          ]}
        />

        <Divider />
      </div>
    </div>
  );
}

