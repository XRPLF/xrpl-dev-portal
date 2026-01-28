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
              <h2 className="h4 mb-6">All 6 Color Variants</h2>
              <p className="mb-6">
                TextCard supports 6 color variants with hover and pressed states. Hover over cards to see the window shade animation.
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* All Color Variants - Standalone TextCards */}
        <PageGrid className="pb-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <div className="d-flex flex-wrap gap-3">
                <TextCard
                  title="Green"
                  description="Default: $green-200 → Hover: $green-300 → Pressed: $green-400"
                  color="green"
                  style={{ flex: '1 1 300px', minWidth: 280 }}
                />
                <TextCard
                  title="Neutral Light"
                  description="Default: $gray-200 → Hover: $gray-300 → Pressed: $gray-400"
                  color="neutral-light"
                  style={{ flex: '1 1 300px', minWidth: 280 }}
                />
                <TextCard
                  title="Neutral Dark"
                  description="Default: $gray-300 → Hover: $gray-400 → Pressed: $gray-500"
                  color="neutral-dark"
                  style={{ flex: '1 1 300px', minWidth: 280 }}
                />
                <TextCard
                  title="Lilac"
                  description="Default: $lilac-200 → Hover: $lilac-300 → Pressed: $lilac-400"
                  color="lilac"
                  style={{ flex: '1 1 300px', minWidth: 280 }}
                />
                <TextCard
                  title="Yellow"
                  description="Default: $yellow-100 → Hover: $yellow-200 → Pressed: $yellow-300"
                  color="yellow"
                  style={{ flex: '1 1 300px', minWidth: 280 }}
                />
                <TextCard
                  title="Blue"
                  description="Default: $blue-100 → Hover: $blue-200 → Pressed: $blue-300"
                  color="blue"
                  style={{ flex: '1 1 300px', minWidth: 280 }}
                />
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <Divider />

        {/* Mixed Colors in Pattern */}
        <CardsTwoColumn
          title="All 6 Colors in Pattern"
          description="The CardsTwoColumn pattern accepts exactly 4 cards. Here we show various color combinations including the new blue variant."
          cards={[
            { title: "Lilac", description: "Primary accent color for highlights.", color: "lilac" },
            { title: "Blue", description: "Secondary accent for cool tones.", color: "blue" },
            { title: "Green", description: "Brand color for positive actions.", color: "green" },
            { title: "Yellow", description: "Secondary accent for warm tones.", color: "yellow" }
          ]}
        />

        <Divider />

        {/* Alternative Color Combo */}
        <CardsTwoColumn
          title="Alternative Color Arrangement"
          description="Different colors can be used to create visual hierarchy and distinguish between content types."
          cards={[
            { title: "Documentation", description: "Comprehensive guides and API references.", color: "neutral-dark" },
            { title: "Tutorials", description: "Step-by-step learning resources.", color: "green" },
            { title: "Use Cases", description: "Real-world applications and success stories.", color: "yellow" },
            { title: "Resources", description: "Tools and libraries for development.", color: "lilac" }
          ]}
        />

        <Divider />
      </div>
    </div>
  );
}

