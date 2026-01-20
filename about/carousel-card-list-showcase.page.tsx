import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";
import { CarouselCardList } from "shared/patterns/CarouselCardList";
import { Divider } from "shared/components/Divider";

export const frontmatter = {
  seo: {
    title: 'CarouselCardList Pattern Showcase',
    description: "A comprehensive showcase of the CarouselCardList pattern component demonstrating horizontal scrolling, navigation buttons, and color variants in the XRPL.org Design System.",
  }
};

// Sample icon components for demonstration
const TokenIcon = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="34" cy="34" r="20" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M34 22V46M26 34H42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="20" width="40" height="28" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="46" cy="34" r="4" fill="currentColor"/>
    <path d="M14 28H54" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 50L26 38L34 46L54 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M46 18H54V26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M34 12L52 20V32C52 44 44 52 34 56C24 52 16 44 16 32V20L34 12Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M26 34L32 40L42 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="34" cy="34" r="20" stroke="currentColor" strokeWidth="2" fill="none"/>
    <ellipse cx="34" cy="34" rx="10" ry="20" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M14 34H54" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const CodeIcon = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26 24L14 34L26 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M42 24L54 34L42 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M38 18L30 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Sample cards data for neutral variant
const neutralCards = [
  {
    icon: <TokenIcon />,
    title: "Native\nTokenization",
    description: "Issue and manage digital assets directly on the ledger without smart contracts.",
    href: "#tokenization",
  },
  {
    icon: <WalletIcon />,
    title: "Low Cost\nTransactions",
    description: "Transaction costs are a fraction of a cent, making microtransactions viable.",
    href: "#low-cost",
  },
  {
    icon: <ChartIcon />,
    title: "Built-in\nDEX",
    description: "Trade any token for any other token using the native decentralized exchange.",
    href: "#dex",
  },
  {
    icon: <ShieldIcon />,
    title: "Enterprise\nSecurity",
    description: "Multi-signature support and advanced key management for institutional needs.",
    href: "#security",
  },
  {
    icon: <GlobeIcon />,
    title: "Global\nReach",
    description: "Connect to a worldwide network of validators in seconds, not minutes.",
    href: "#global",
  },
  {
    icon: <CodeIcon />,
    title: "Developer\nFriendly",
    description: "Comprehensive SDKs and APIs for JavaScript, Python, Java, and more.",
    href: "#developer",
  },
];

// Sample cards data for green variant
const greenCards = [
  {
    icon: <TokenIcon />,
    title: "Stablecoin\nIssuance",
    description: "Create and manage compliant stablecoins with built-in freeze and clawback capabilities.",
    href: "#stablecoin",
  },
  {
    icon: <WalletIcon />,
    title: "Institutional\nCustody",
    description: "Multi-signature accounts and escrow features for enterprise-grade custody solutions.",
    href: "#custody",
  },
  {
    icon: <ChartIcon />,
    title: "Real-Time\nSettlement",
    description: "Transactions settle in 3-5 seconds with finality, enabling real-time payments.",
    href: "#settlement",
  },
  {
    icon: <ShieldIcon />,
    title: "Regulatory\nCompliance",
    description: "Built-in features for AML/KYC compliance and regulatory reporting requirements.",
    href: "#compliance",
  },
  {
    icon: <GlobeIcon />,
    title: "Cross-Border\nPayments",
    description: "Seamless international transfers without correspondent banking delays.",
    href: "#cross-border",
  },
];

export default function CarouselCardListShowcase() {
  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-26 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Pattern Showcase</h6>
            <h1 className="mb-4">CarouselCardList Pattern</h1>
            <p className="longform">
              A horizontal scrolling carousel that displays CardOffgrid components with navigation buttons.
              Supports neutral and green color variants, responsive sizing, and dark/light mode theming.
            </p>
          </div>
        </section>

        {/* Feature Overview */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Features</h2>
              <div className="d-flex flex-row gap-6" style={{ flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Layout</h6>
                  <ul className="mb-0">
                    <li>Horizontal scrolling cards</li>
                    <li>Navigation buttons (prev/next)</li>
                    <li>Title constrained to grid</li>
                    <li>Hidden scrollbar</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Responsive Behavior</h6>
                  <ul className="mb-0">
                    <li><strong>Mobile:</strong> 343×400px cards</li>
                    <li><strong>Tablet:</strong> 356×440px cards</li>
                    <li><strong>Desktop:</strong> 400×480px cards</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Button States</h6>
                  <ul className="mb-0">
                    <li>Enabled / Disabled</li>
                    <li>Hover / Active states</li>
                    <li>Focus ring for keyboard nav</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Theming</h6>
                  <ul className="mb-0">
                    <li>Dark mode (default)</li>
                    <li>Light mode (<code>html.light</code>)</li>
                    <li>Neutral &amp; Green card variants</li>
                    <li>Independent button colors (neutral, green, black)</li>
                  </ul>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        

        {/* Neutral Cards + Neutral Buttons (Default) */}
        <section className="py-10">
          <PageGrid className="mb-6">
            <PageGridRow>
              <PageGridCol span={12}>
                <h2 className="h4 mb-3">Neutral Cards + Neutral Buttons (Default)</h2>
                <p className="mb-0">
                  <code>variant="neutral"</code> - Gray cards with matching gray navigation buttons.
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CarouselCardList
            variant="neutral"
            buttonVariant="neutral"
            heading="Why Build on the XRP Ledger"
            description="Discover the unique features that make XRPL the ideal blockchain for building tokenization, payments, and DeFi applications."
            cards={neutralCards}
          />
        </section>



        {/* Neutral Cards + Green Buttons */}
        <section className="py-10">
          <PageGrid className="mb-6">
            <PageGridRow>
              <PageGridCol span={12}>
                <h2 className="h4 mb-3">Neutral Cards + Green Buttons</h2>
                <p className="mb-0">
                  <code>variant="neutral" buttonVariant="green"</code> - Gray cards with green navigation buttons.
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CarouselCardList
            variant="neutral"
            buttonVariant="green"
            heading="Platform Features"
            description="Gray cards paired with vibrant green buttons for emphasis."
            cards={neutralCards}
          />
        </section>



        {/* Neutral Cards + Black Buttons */}
        <section className="py-10">
          <PageGrid className="mb-6">
            <PageGridRow>
              <PageGridCol span={12}>
                <h2 className="h4 mb-3">Neutral Cards + Black Buttons</h2>
                <p className="mb-0">
                  <code>variant="neutral" buttonVariant="black"</code> - Gray cards with black navigation buttons.
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CarouselCardList
            variant="neutral"
            buttonVariant="black"
            heading="Developer Tools"
            description="Gray cards paired with black buttons for high contrast."
            cards={neutralCards}
          />
        </section>



        {/* Green Cards + Green Buttons */}
        <section className="py-10">
          <PageGrid className="mb-6">
            <PageGridRow>
              <PageGridCol span={12}>
                <h2 className="h4 mb-3">Green Cards + Green Buttons</h2>
                <p className="mb-0">
                  <code>variant="green" buttonVariant="green"</code> - Green cards with matching green navigation buttons.
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CarouselCardList
            variant="green"
            buttonVariant="green"
            heading="Enterprise Solutions"
            description="Purpose-built features for institutional adoption with cohesive green theming."
            cards={greenCards}
          />
        </section>



        {/* Green Cards + Black Buttons */}
        <section className="py-10">
          <PageGrid className="mb-6">
            <PageGridRow>
              <PageGridCol span={12}>
                <h2 className="h4 mb-3">Green Cards + Black Buttons</h2>
                <p className="mb-0">
                  <code>variant="green" buttonVariant="black"</code> - Green cards with black navigation buttons.
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CarouselCardList
            variant="green"
            buttonVariant="black"
            heading="Cross-Border Payments"
            description="Green cards with contrasting black buttons for visual interest."
            cards={greenCards}
          />
        </section>

        

        {/* Navigation Buttons */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Navigation Button Specifications</h2>

              <div className="d-flex flex-row gap-6 mb-6" style={{ flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 220px' }}>
                  <h6 className="mb-3">Dimensions</h6>
                  <ul className="mb-0">
                    <li><strong>Desktop:</strong> 40px × 40px</li>
                    <li><strong>Tablet/Mobile:</strong> 37px × 37px</li>
                    <li><strong>Gap:</strong> 8px between buttons</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 220px' }}>
                  <h6 className="mb-3">Neutral Colors (Dark Mode)</h6>
                  <ul className="mb-0">
                    <li><strong>Enabled:</strong> $gray-500 (#72777E)</li>
                    <li><strong>Hover:</strong> $gray-400 (#8A919A)</li>
                    <li><strong>Disabled:</strong> $gray-500 @ 50%</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 220px' }}>
                  <h6 className="mb-3">Green Colors (Dark Mode)</h6>
                  <ul className="mb-0">
                    <li><strong>Enabled:</strong> $green-300 (#21E46B)</li>
                    <li><strong>Hover:</strong> $green-200 (#70EE97)</li>
                    <li><strong>Disabled:</strong> $green-500 @ 50%</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 220px' }}>
                  <h6 className="mb-3">Black Colors (Dark Mode)</h6>
                  <ul className="mb-0">
                    <li><strong>Enabled:</strong> $black (#141414)</li>
                    <li><strong>Hover:</strong> $gray-500 (#72777E)</li>
                    <li><strong>Disabled:</strong> $black @ 50%</li>
                  </ul>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        

        {/* Spacing Tokens */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Spacing Tokens</h2>

              <div className="mb-6">
                <div className="d-flex flex-row mb-3 pb-2" style={{ gap: '1rem', borderBottom: '2px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '200px', flexShrink: 0 }}><strong>Token</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Mobile</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Tablet</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Desktop</strong></div>
                </div>

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '200px', flexShrink: 0 }}>Header Gap</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>8px</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>8px</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>16px</code></div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '200px', flexShrink: 0 }}>Section Gap</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>24px</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>32px</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>40px</code></div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '200px', flexShrink: 0 }}>Cards Gap</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>8px</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>8px</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>8px</code></div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '200px', flexShrink: 0 }}>Card Dimensions</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>343×400px</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>356×440px</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>400×480px</code></div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '200px', flexShrink: 0 }}>Card Padding</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>16px</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>20px</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>24px</code></div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        

        {/* API Reference */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Component API</h2>

              <h5 className="mb-4">CarouselCardListProps</h5>
              <div className="mb-8">
                <div className="d-flex flex-row mb-3 pb-2" style={{ gap: '1rem', borderBottom: '2px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><strong>Prop</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Type</strong></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><strong>Default</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Description</strong></div>
                </div>

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>variant</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>'neutral' | 'green'</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>'neutral'</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Color variant for cards</div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>buttonVariant</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>'neutral' | 'green' | 'black'</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>'neutral'</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Color variant for navigation buttons (independent of cards)</div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>heading</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>ReactNode</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>required</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Section heading text</div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>description</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>ReactNode</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>required</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Section description text</div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>cards</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>CarouselCardConfig[]</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>required</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Array of card configurations</div>
                </div>
              </div>

              <h5 className="mb-4">CarouselCardConfig</h5>
              <p className="mb-4">Each card in the <code>cards</code> array accepts the following properties (same as CardOffgrid, without variant):</p>
              <div className="mb-6">
                <div className="d-flex flex-row mb-3 pb-2" style={{ gap: '1rem', borderBottom: '2px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><strong>Prop</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Type</strong></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><strong>Required</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Description</strong></div>
                </div>

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>icon</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>ReactNode | string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>Yes</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Icon component or image URL</div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>title</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>Yes</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Card title (use \n for line breaks)</div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>description</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>Yes</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Card description text</div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>href</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>No</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Link destination URL</div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>onClick</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>() =&gt; void</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>No</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Click handler function</div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>disabled</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>boolean</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>No</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Disabled state</div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        

        {/* Usage Example */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Usage Example</h2>
              <div className="card p-4">
                <pre className="mb-0" style={{ backgroundColor: 'var(--bs-gray-800)', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`import { CarouselCardList } from 'shared/patterns/CarouselCardList';

// Basic usage - button color matches card color by default
<CarouselCardList
  variant="neutral"
  heading="Why Build on the XRP Ledger"
  description="Discover the unique features that make XRPL ideal for your project."
  cards={[
    {
      icon: <TokenIcon />,
      title: "Native\\nTokenization",
      description: "Issue and manage digital assets directly on the ledger.",
      href: "/docs/tokenization",
    },
    // ... more cards
  ]}
/>

// With independent button color
<CarouselCardList
  variant="neutral"
  buttonVariant="black"  // Button color independent of card color
  heading="Developer Tools"
  description="Gray cards with black navigation buttons."
  cards={cards}
/>`}
                </pre>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        

        {/* Design References */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Design References</h2>
              <div className="d-flex flex-column gap-3">
                <div>
                  <strong>Main Carousel Design:</strong>{' '}
                  <a href="https://www.figma.com/design/w0CVv1c40nWDRD27mLiMWS/Section-Carousel---Card-List?node-id=15055-3730&m=dev" target="_blank" rel="noopener noreferrer">
                    Section Carousel - Card List (Figma)
                  </a>
                </div>
                <div>
                  <strong>Button States:</strong>{' '}
                  <a href="https://www.figma.com/design/w0CVv1c40nWDRD27mLiMWS/Section-Carousel---Card-List?node-id=15055-1033&m=dev" target="_blank" rel="noopener noreferrer">
                    Carousel Button States (Figma)
                  </a>
                </div>
                <div>
                  <strong>Component Location:</strong>{' '}
                  <code>shared/patterns/CarouselCardList/</code>
                </div>
                <div>
                  <strong>Documentation:</strong>{' '}
                  <code>shared/patterns/CarouselCardList/CarouselCardList.md</code>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </div>
    </div>
  );
}

