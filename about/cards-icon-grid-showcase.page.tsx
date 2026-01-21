import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";
import { CardsIconGrid } from "shared/patterns/CardsIconGrid";
import { Divider } from "shared/components/Divider";

export const frontmatter = {
  seo: {
    title: 'CardsIconGrid Pattern Showcase',
    description: "A comprehensive showcase of the CardsIconGrid pattern component demonstrating light and dark mode variations in the XRPL.org Design System.",
  }
};

// Sample icon SVG for demonstration
const SAMPLE_ICON = "/img/icons/card-icon-placeholder.svg";

// Sample cards data - Green variant
const greenCards = [
  {
    icon: SAMPLE_ICON,
    iconAlt: "Digital Wallets icon",
    label: "Digital Wallets",
    href: "#wallets",
    variant: "green" as const,
  },
  {
    icon: SAMPLE_ICON,
    iconAlt: "B2B Payment Rails icon",
    label: "B2B Payment Rails",
    href: "#payments",
    variant: "green" as const,
  },
  {
    icon: SAMPLE_ICON,
    iconAlt: "Compliance-First Payments icon",
    label: "Compliance-First Payments",
    href: "#compliance",
    variant: "green" as const,
  },
  {
    icon: SAMPLE_ICON,
    iconAlt: "Merchant Settlement icon",
    label: "Merchant Settlement",
    href: "#settlement",
    variant: "green" as const,
  },
  {
    icon: SAMPLE_ICON,
    iconAlt: "Cross-Border Payments icon",
    label: "Cross-Border Payments",
    href: "#cross-border",
    variant: "green" as const,
  },
  {
    icon: SAMPLE_ICON,
    iconAlt: "Treasury Management icon",
    label: "Treasury Management",
    href: "#treasury",
    variant: "green" as const,
  },
];

// Sample cards data - Neutral variant
const neutralCards = [
  {
    icon: SAMPLE_ICON,
    iconAlt: "Documentation icon",
    label: "Documentation",
    href: "#docs",
    variant: "neutral" as const,
  },
  {
    icon: SAMPLE_ICON,
    iconAlt: "Tutorials icon",
    label: "Tutorials",
    href: "#tutorials",
    variant: "neutral" as const,
  },
  {
    icon: SAMPLE_ICON,
    iconAlt: "API Reference icon",
    label: "API Reference",
    href: "#api",
    variant: "neutral" as const,
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
              A section pattern that displays a heading, optional description, and a responsive grid
              of CardIcon components. Follows the "CardIconGrid" design from Figma.
            </p>
          </div>
        </section>

        {/* Design Tokens Reference */}
        <PageGrid className="py-10">
          <PageGridRow>
            <PageGridCol span={{ base: 4, md: 8, lg: 12 }}>
              <h2 className="h4 mb-6">Design Specifications</h2>
              <div className="d-flex flex-wrap gap-8">
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Typography</h6>
                  <ul className="mb-0">
                    <li><strong>Heading:</strong> heading-md (Tobias Light)</li>
                    <li><strong>Description:</strong> body-l (Booton Light)</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Grid Layout</h6>
                  <ul className="mb-0">
                    <li><strong>Mobile:</strong> 1 column</li>
                    <li><strong>Tablet:</strong> 2 columns</li>
                    <li><strong>Desktop:</strong> 3 columns</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Colors</h6>
                  <ul className="mb-0">
                    <li><strong>Light Mode:</strong> $black (#141414)</li>
                    <li><strong>Dark Mode:</strong> $white (#FFFFFF)</li>
                  </ul>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <Divider />

        {/* 6 Cards Example - Green Variant */}
        <section>
          <CardsIconGrid
            heading="Unlock new business models with embedded payments"
            description="Streamline development and build powerful RWA tokenization solutions with XRP Ledger's comprehensive developer toolset."
            cards={greenCards}
          />
        </section>

        <Divider />

        {/* 3 Cards Example - Neutral Variant */}
        <section>
          <CardsIconGrid
            heading="Developer Resources"
            description="Everything you need to start building on the XRP Ledger."
            cards={neutralCards}
          />
        </section>

        <Divider />

        {/* Without Description */}
        <PageGrid className="py-10">
          <PageGridRow>
            <PageGridCol span={{ base: 4, md: 8, lg: 12 }}>
              <h2 className="h4 mb-4">Without Description</h2>
              <p className="mb-0">
                The description prop is optional. When omitted, only the heading appears above the cards.
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <section>
          <CardsIconGrid
            heading="Funding & Support Programs"
            cards={greenCards.slice(0, 3)}
          />
        </section>

        <Divider />

        {/* Code Examples */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={{ base: 4, md: 8, lg: 10 }}>
              <h2 className="h4 mb-6">Code Examples</h2>

              <h5 className="mb-4">Basic Usage</h5>
              <div className="p-4 mb-8 br-4" style={{ backgroundColor: '#1a1a1a', fontFamily: 'monospace', fontSize: '14px' }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#f8f8f2' }}>{`import { CardsIconGrid } from 'shared/patterns/CardsIconGrid';

<CardsIconGrid
  heading="Unlock new business models"
  description="Build powerful solutions with XRPL."
  cards={[
    {
      icon: "/icons/wallet.svg",
      label: "Digital Wallets",
      href: "/docs/wallets",
      variant: "green"
    },
    {
      icon: "/icons/payments.svg",
      label: "B2B Payment Rails",
      href: "/docs/payments",
      variant: "green"
    },
    {
      icon: "/icons/compliance.svg",
      label: "Compliance-First Payments",
      href: "/docs/compliance",
      variant: "green"
    }
  ]}
/>`}</pre>
              </div>

              <h5 className="mb-4">Without Description</h5>
              <div className="p-4 mb-8 br-4" style={{ backgroundColor: '#1a1a1a', fontFamily: 'monospace', fontSize: '14px' }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#f8f8f2' }}>{`<CardsIconGrid
  heading="Developer Resources"
  cards={[
    { icon: "/icons/docs.svg", label: "Documentation", href: "/docs", variant: "neutral" },
    { icon: "/icons/tutorials.svg", label: "Tutorials", href: "/tutorials", variant: "neutral" },
    { icon: "/icons/api.svg", label: "API Reference", href: "/api", variant: "neutral" }
  ]}
/>`}</pre>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <Divider />

        {/* Design References */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={{ base: 4, md: 8, lg: 12 }}>
              <h2 className="h4 mb-6">Design References</h2>
              <div className="d-flex flex-column gap-3">
                <div>
                  <strong>Figma:</strong>{' '}
                  <a href="https://www.figma.com/design/Ojj6UpFBw3HMb0QqRaKxAU/Section-Cards---Icon?node-id=30071-3082&m=dev" target="_blank" rel="noopener noreferrer">
                    Section Cards - Icon Grid
                  </a>
                </div>
                <div>
                  <strong>Documentation:</strong>{' '}
                  <code>shared/patterns/CardsIconGrid/CardsIconGrid.md</code>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </div>
    </div>
  );
}

