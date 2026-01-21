import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";
import { CardStats } from "shared/patterns/CardStats";
import { Divider } from "shared/components/Divider";

export const frontmatter = {
  seo: {
    title: 'CardStats Pattern Showcase',
    description: "A comprehensive showcase of the CardStats pattern component demonstrating different configurations and color variants in the XRPL.org Design System.",
  }
};

// Sample cards data matching Figma design (node 32051:2839)
const sampleCards = [
  {
    statistic: "12",
    superscript: "+" as const,
    label: "Continuous uptime years",
    variant: "lilac" as const,
    primaryButton: { label: "Learn More", href: "#uptime" },
  },
  {
    statistic: "6M",
    superscript: "2" as const,
    label: "Active wallets",
    variant: "light-gray" as const,
    primaryButton: { label: "Explore", href: "#wallets" },
  },
  {
    statistic: "$1T",
    superscript: "+" as const,
    label: "Value transferred",
    variant: "green" as const,
    primaryButton: { label: "View Stats", href: "#value" },
  },
  {
    statistic: "3-5s",
    label: "Transaction finality",
    variant: "green" as const,
    primaryButton: { label: "Learn More", href: "#speed" },
  },
  {
    statistic: "70",
    superscript: "+" as const,
    label: "Ecosystem partners",
    variant: "dark-gray" as const,
    primaryButton: { label: "Meet Partners", href: "#partners" },
  },
  {
    statistic: "100K",
    superscript: "+" as const,
    label: "Developer community",
    variant: "lilac" as const,
    primaryButton: { label: "Join Us", href: "#community" },
  },
];

export default function CardStatsShowcase() {
  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-26 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Pattern Showcase</h6>
            <h1 className="mb-4">CardStats Pattern</h1>
            <p className="longform">
              A section pattern that displays a heading, optional description, and a responsive
              grid of CardStat components. Designed for showcasing key statistics and metrics.
            </p>
          </div>
        </section>

        {/* Design Tokens Info */}
        <PageGrid className="py-10">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Design Specifications</h2>
              <div className="d-flex flex-wrap gap-6">
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
                    <li><strong>Mobile:</strong> 2 columns</li>
                    <li><strong>Tablet:</strong> 2 columns</li>
                    <li><strong>Desktop:</strong> 3 columns</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Color Variants</h6>
                  <ul className="mb-0">
                    <li><strong>Lilac:</strong> #C0A7FF</li>
                    <li><strong>Green:</strong> #21E46B</li>
                    <li><strong>Light Gray:</strong> #E6EAF0</li>
                    <li><strong>Dark Gray:</strong> #CAD4DF</li>
                  </ul>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <Divider />

        {/* Full Example - 6 Cards with Heading and Description */}
        <section>
          <CardStats
            heading="Blockchain Trusted at Scale"
            description="Streamline development and build powerful RWA tokenization solutions with XRP Ledger's comprehensive developer toolset."
            cards={sampleCards}
          />
        </section>

        <Divider />

        {/* Heading Only - No Description */}
        <section>
          <CardStats
            heading="XRPL Network Statistics"
            cards={sampleCards.slice(0, 3)}
          />
        </section>

        <Divider />

        {/* 4 Cards Example */}
        <section>
          <CardStats
            heading="Why Build on XRPL?"
            description="The XRP Ledger provides enterprise-grade infrastructure for building the future of finance."
            cards={sampleCards.slice(0, 4)}
          />
        </section>

        <Divider />

        {/* Two Buttons Example */}
        <PageGrid className="py-10">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-4">Two Button Cards</h2>
              <p className="mb-8">Cards can include both primary and secondary buttons for multiple CTAs.</p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
        <section>
          <CardStats
            heading="Get Started with XRPL"
            description="Explore the XRP Ledger ecosystem with comprehensive documentation and developer resources."
            cards={[
              {
                statistic: "12",
                superscript: "+" as const,
                label: "Continuous uptime years",
                variant: "lilac" as const,
                primaryButton: { label: "Learn More", href: "#learn" },
                secondaryButton: { label: "View Docs", href: "#docs" },
              },
              {
                statistic: "6M",
                superscript: "+" as const,
                label: "Active wallets",
                variant: "green" as const,
                primaryButton: { label: "Get Started", href: "#start" },
                secondaryButton: { label: "Explore", href: "#explore" },
              },
              {
                statistic: "$1T",
                superscript: "+" as const,
                label: "Value transferred",
                variant: "light-gray" as const,
                primaryButton: { label: "View Stats", href: "#stats" },
                secondaryButton: { label: "Learn More", href: "#about" },
              },
            ]}
          />
        </section>

        <Divider />

        {/* Code Examples */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-8">Code Examples</h2>

              <h5 className="mb-4">Basic Usage</h5>
              <div className="p-4 mb-8 br-4" style={{ backgroundColor: '#f5f5f7', fontFamily: 'monospace', fontSize: '14px' }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#000' }}>{`import { CardStats } from 'shared/patterns/CardStats';

<CardStats
  heading="Blockchain Trusted at Scale"
  description="Optional description text here."
  cards={[
    {
      statistic: "12",
      superscript: "+",
      label: "Continuous uptime years",
      variant: "lilac",
      primaryButton: { label: "Learn More", href: "/docs" }
    },
    {
      statistic: "6M",
      label: "Active wallets",
      variant: "green"
    },
    // ... more cards
  ]}
/>`}</pre>
              </div>

              <h5 className="mb-4">Without Description</h5>
              <div className="p-4 mb-8 br-4" style={{ backgroundColor: '#f5f5f7', fontFamily: 'monospace', fontSize: '14px' }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#000' }}>{`<CardStats
  heading="XRPL Network Statistics"
  cards={statsCards}
/>`}</pre>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <Divider />

        {/* Design References */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Design References</h2>
              <div className="d-flex flex-column gap-3">
                <div>
                  <strong>Figma Design:</strong>{' '}
                  <a href="https://www.figma.com/design/drnQQXnK9Q67MTPPKQsY9l/Section-Cards---Stats?node-id=32051-2839&m=dev" target="_blank" rel="noopener noreferrer">
                    Section Cards - Stats (Figma)
                  </a>
                </div>
                <div>
                  <strong>Pattern Location:</strong>{' '}
                  <code>shared/patterns/CardStats/</code>
                </div>
                <div>
                  <strong>Component Used:</strong>{' '}
                  <code>shared/components/CardStat/</code>
                </div>
                <div>
                  <strong>Color Tokens:</strong>{' '}
                  <code>styles/_colors.scss</code>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </div>
    </div>
  );
}

