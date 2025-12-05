import * as React from "react";
import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";
import { CardOffgrid } from "shared/components/CardOffgrid";
import { Divider } from "shared/components/Divider";

export const frontmatter = {
  seo: {
    title: 'CardOffgrid Component Showcase',
    description: "A comprehensive showcase of all CardOffgrid component variants, states, and interactions in the XRPL.org Design System.",
  }
};

// Sample icon component for demonstration
const SampleIcon = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M34 8L58 20V44L34 56L10 44V20L34 8Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M34 8V32M34 32L58 20M34 32L10 20" stroke="currentColor" strokeWidth="2"/>
    <path d="M34 32V56" stroke="currentColor" strokeWidth="2"/>
    <circle cx="34" cy="32" r="6" fill="currentColor"/>
  </svg>
);

// Alternative icon for variety
const MetadataIcon = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 18C14 15.7909 15.7909 14 18 14H50C52.2091 14 54 15.7909 54 18V50C54 52.2091 52.2091 54 50 54H18C15.7909 54 14 52.2091 14 50V18Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M22 26H46M22 34H46M22 42H34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Chain icon
const ChainIcon = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 34H40M24 28C24 25.7909 25.7909 24 28 24H32C34.2091 24 36 25.7909 36 28V40C36 42.2091 34.2091 44 32 44H28C25.7909 44 24 42.2091 24 40V28Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M32 28C32 25.7909 33.7909 24 36 24H40C42.2091 24 44 25.7909 44 28V40C44 42.2091 42.2091 44 40 44H36C33.7909 44 32 42.2091 32 40V28Z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export default function CardOffgridShowcase() {
  const [clickedCard, setClickedCard] = React.useState<string | null>(null);

  const handleCardClick = (cardName: string) => {
    setClickedCard(cardName);
    setTimeout(() => setClickedCard(null), 1500);
  };

  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-26 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Component Showcase</h6>
            <h1 className="mb-4">CardOffgrid Component</h1>
            <p className="longform">
              A versatile card component for displaying feature highlights with an icon, title, and description.
              Supports neutral and green color variants with interactive states and bottom-to-top gradient hover animation.
            </p>
          </div>
        </section>

        {/* Variant Showcase */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Color Variants</h2>
              <p className="mb-6">CardOffgrid supports two color variants: <strong>neutral</strong> (default) and <strong>green</strong>.</p>
              
              <div className="d-flex flex-row gap-6 mb-6" style={{ flexWrap: 'wrap' }}>
                <div>
                  <h6 className="mb-3">Neutral Variant (Default)</h6>
                  <CardOffgrid
                    variant="neutral"
                    icon={<SampleIcon />}
                    title={"Onchain\nMetadata"}
                    description="Easily store key asset information or link to off-chain data using simple APIs, giving token holders transparency."
                    onClick={() => handleCardClick('neutral')}
                  />
                  {clickedCard === 'neutral' && (
                    <p className="mt-2 text-success">✓ Card clicked!</p>
                  )}
                </div>
                
                <div>
                  <h6 className="mb-3">Green Variant</h6>
                  <CardOffgrid
                    variant="green"
                    icon={<SampleIcon />}
                    title={"Onchain\nMetadata"}
                    description="Easily store key asset information or link to off-chain data using simple APIs, giving token holders transparency."
                    onClick={() => handleCardClick('green')}
                  />
                  {clickedCard === 'green' && (
                    <p className="mt-2 text-success">✓ Card clicked!</p>
                  )}
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Interactive States */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Interactive States</h2>
              <p className="mb-6">Hover, focus, and press the cards below to see the state transitions.</p>
              
              {/* Neutral States */}
              <h5 className="mb-4">Neutral Variant States</h5>
              <div className="d-flex flex-row gap-4 mb-8" style={{ flexWrap: 'wrap' }}>
                <div className="text-center">
                  <small className="d-block mb-2 text-muted">Default</small>
                  <CardOffgrid
                    variant="neutral"
                    icon={<MetadataIcon />}
                    title={"Token\nManagement"}
                    description="Create and manage fungible and non-fungible tokens with built-in compliance features."
                    onClick={() => handleCardClick('neutral-default')}
                  />
                </div>
                <div className="text-center">
                  <small className="d-block mb-2 text-muted">Disabled</small>
                  <CardOffgrid
                    variant="neutral"
                    icon={<MetadataIcon />}
                    title={"Token\nManagement"}
                    description="Create and manage fungible and non-fungible tokens with built-in compliance features."
                    disabled
                  />
                </div>
              </div>

              {/* Green States */}
              <h5 className="mb-4">Green Variant States</h5>
              <div className="d-flex flex-row gap-4 mb-6" style={{ flexWrap: 'wrap' }}>
                <div className="text-center">
                  <small className="d-block mb-2 text-muted">Default</small>
                  <CardOffgrid
                    variant="green"
                    icon={<ChainIcon />}
                    title={"Cross-Chain\nBridges"}
                    description="Connect XRPL with other blockchain networks through secure and efficient bridge protocols."
                    onClick={() => handleCardClick('green-default')}
                  />
                </div>
                <div className="text-center">
                  <small className="d-block mb-2 text-muted">Disabled</small>
                  <CardOffgrid
                    variant="green"
                    icon={<ChainIcon />}
                    title={"Cross-Chain\nBridges"}
                    description="Connect XRPL with other blockchain networks through secure and efficient bridge protocols."
                    disabled
                  />
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Color Palette */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Color Palette</h2>
              <p className="mb-6">
                All colors are mapped from <code>styles/_colors.scss</code>. 
                The site defaults to <strong>dark mode</strong>. Light mode is activated via <code>html.light</code>.
              </p>
              
              {/* Dark Mode Colors */}
              <h5 className="mb-4">Dark Mode (Default)</h5>
              <div className="d-flex flex-row gap-6 mb-6" style={{ flexWrap: 'wrap' }}>
                {/* Neutral Colors - Dark */}
                <div style={{ flex: '1 1 400px', minWidth: '320px' }}>
                  <h6 className="mb-4">Neutral Variant</h6>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#72777E', borderRadius: '4px', flexShrink: 0, border: '1px solid #444' }}></div>
                      <div>
                        <strong>Default:</strong> <code>$gray-500</code>
                        <br />
                        <small className="text-muted">#72777E (white text)</small>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#8A919A', borderRadius: '4px', flexShrink: 0, border: '1px solid #444' }}></div>
                      <div>
                        <strong>Hover/Focus:</strong> <code>$gray-400</code>
                        <br />
                        <small className="text-muted">#8A919A (white text)</small>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '60px', height: '40px', backgroundColor: 'rgba(114, 119, 126, 0.7)', borderRadius: '4px', flexShrink: 0, border: '1px solid #444' }}></div>
                      <div>
                        <strong>Pressed:</strong> <code>rgba($gray-500, 0.7)</code>
                        <br />
                        <small className="text-muted">70% opacity</small>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#72777E', borderRadius: '4px', flexShrink: 0, border: '1px solid #444', opacity: 0.3 }}></div>
                      <div>
                        <strong>Disabled:</strong> <code>$gray-500 @ 30%</code>
                        <br />
                        <small className="text-muted">opacity: 0.3</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Green Colors - Dark */}
                <div style={{ flex: '1 1 400px', minWidth: '320px' }}>
                  <h6 className="mb-4">Green Variant</h6>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#21E46B', borderRadius: '4px', flexShrink: 0, border: '1px solid #444' }}></div>
                      <div>
                        <strong>Default:</strong> <code>$green-300</code>
                        <br />
                        <small className="text-muted">#21E46B (black text)</small>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#70EE97', borderRadius: '4px', flexShrink: 0, border: '1px solid #444' }}></div>
                      <div>
                        <strong>Hover/Focus:</strong> <code>$green-200</code>
                        <br />
                        <small className="text-muted">#70EE97 (black text)</small>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#0DAA3E', borderRadius: '4px', flexShrink: 0, border: '1px solid #444' }}></div>
                      <div>
                        <strong>Pressed:</strong> <code>$green-400</code>
                        <br />
                        <small className="text-muted">#0DAA3E (black text)</small>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#72777E', borderRadius: '4px', flexShrink: 0, border: '1px solid #444', opacity: 0.3 }}></div>
                      <div>
                        <strong>Disabled:</strong> <code>$gray-500 @ 30%</code>
                        <br />
                        <small className="text-muted">opacity: 0.3 (white text)</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Divider color="gray" className="my-6" />

              {/* Light Mode Colors */}
              <h5 className="mb-4">Light Mode (<code>html.light</code>)</h5>
              <div className="d-flex flex-row gap-6 mb-6" style={{ flexWrap: 'wrap' }}>
                {/* Neutral Colors - Light */}
                <div style={{ flex: '1 1 400px', minWidth: '320px' }}>
                  <h6 className="mb-4">Neutral Variant</h6>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#E6EAF0', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                      <div>
                        <strong>Default:</strong> <code>$gray-200</code>
                        <br />
                        <small className="text-muted">#E6EAF0 (dark text)</small>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#CAD4DF', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                      <div>
                        <strong>Hover/Focus:</strong> <code>$gray-300</code>
                        <br />
                        <small className="text-muted">#CAD4DF (black text)</small>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#8A919A', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                      <div>
                        <strong>Pressed:</strong> <code>$gray-400</code>
                        <br />
                        <small className="text-muted">#8A919A (black text)</small>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#F0F3F7', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                      <div>
                        <strong>Disabled:</strong> <code>$gray-100</code>
                        <br />
                        <small className="text-muted">#F0F3F7 (gray text)</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Green Colors - Light */}
                <div style={{ flex: '1 1 400px', minWidth: '320px' }}>
                  <h6 className="mb-4">Green Variant</h6>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#70EE97', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                      <div>
                        <strong>Default:</strong> <code>$green-200</code>
                        <br />
                        <small className="text-muted">#70EE97 (black text)</small>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#21E46B', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                      <div>
                        <strong>Hover/Focus:</strong> <code>$green-300</code>
                        <br />
                        <small className="text-muted">#21E46B (black text)</small>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#0DAA3E', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                      <div>
                        <strong>Pressed:</strong> <code>$green-400</code>
                        <br />
                        <small className="text-muted">#0DAA3E (black text)</small>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#F0F3F7', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                      <div>
                        <strong>Disabled:</strong> <code>$gray-100</code>
                        <br />
                        <small className="text-muted">#F0F3F7 (gray text)</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Animation Details */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Animation Specifications</h2>
              
              <div className="d-flex flex-row gap-6 mb-6" style={{ flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <h6 className="mb-3">Timing</h6>
                  <ul className="mb-0">
                    <li><strong>Duration:</strong> 200ms</li>
                    <li><strong>Easing:</strong> <code>cubic-bezier(0.98, 0.12, 0.12, 0.98)</code></li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <h6 className="mb-3">Hover Effect ("Window Shade")</h6>
                  <ul className="mb-0">
                    <li><strong>Hover in:</strong> Shade rises up (bottom → top)</li>
                    <li><strong>Hover out:</strong> Shade falls down (top → bottom)</li>
                    <li>Darker pressed state on click</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <h6 className="mb-3">State Flow</h6>
                  <ul className="mb-0">
                    <li>Default → Hover → Pressed</li>
                    <li>Full card area is clickable</li>
                    <li>Focus ring on keyboard navigation</li>
                  </ul>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Link vs Button */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Link vs Button Rendering</h2>
              <p className="mb-6">The component renders as an <code>&lt;a&gt;</code> tag when <code>href</code> is provided, otherwise as a <code>&lt;button&gt;</code>.</p>
              
              <div className="d-flex flex-row gap-6 mb-6" style={{ flexWrap: 'wrap' }}>
                <div>
                  <h6 className="mb-3">As Button (onClick)</h6>
                  <CardOffgrid
                    variant="neutral"
                    icon={<SampleIcon />}
                    title={"Click Me"}
                    description="This card renders as a button element and triggers an onClick handler."
                    onClick={() => handleCardClick('button-demo')}
                  />
                  {clickedCard === 'button-demo' && (
                    <p className="mt-2 text-success">✓ Button clicked!</p>
                  )}
                </div>
                
                <div>
                  <h6 className="mb-3">As Link (href)</h6>
                  <CardOffgrid
                    variant="green"
                    icon={<SampleIcon />}
                    title={"Navigate"}
                    description="This card renders as an anchor element and navigates to the specified href."
                    href="#link-demo"
                  />
                  <p className="mt-2 text-muted">↑ Click to navigate to #link-demo</p>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Dimensions */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Dimensions</h2>
              
              <div className="mb-6">
                {/* Header Row */}
                <div className="d-flex flex-row mb-3 pb-2" style={{ gap: '1rem', borderBottom: '2px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '180px', flexShrink: 0 }}><strong>Property</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Value</strong></div>
                </div>
                
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '180px', flexShrink: 0 }}>Card Width</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>400px</code> (full-width on mobile)</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '180px', flexShrink: 0 }}>Card Height</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>480px</code></div>
                </div>
                <Divider weight="thin" color="gray" />
                
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '180px', flexShrink: 0 }}>Padding</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>24px</code></div>
                </div>
                <Divider weight="thin" color="gray" />
                
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '180px', flexShrink: 0 }}>Icon Container</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>84px × 84px</code></div>
                </div>
                <Divider weight="thin" color="gray" />
                
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '180px', flexShrink: 0 }}>Icon Size</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>~68px × 68px</code></div>
                </div>
                <Divider weight="thin" color="gray" />
                
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '180px', flexShrink: 0 }}>Content Gap</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>40px</code> (between title and description)</div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Typography */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Typography</h2>
              
              <div className="d-flex flex-row gap-6 mb-6" style={{ flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <h6 className="mb-3">Title</h6>
                  <ul className="mb-0">
                    <li><strong>Font Size:</strong> 32px</li>
                    <li><strong>Font Weight:</strong> 300 (light)</li>
                    <li><strong>Line Height:</strong> 40px</li>
                    <li><strong>Letter Spacing:</strong> -1px</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <h6 className="mb-3">Description</h6>
                  <ul className="mb-0">
                    <li><strong>Font Size:</strong> 18px</li>
                    <li><strong>Font Weight:</strong> 300 (light)</li>
                    <li><strong>Line Height:</strong> 26.1px</li>
                    <li><strong>Letter Spacing:</strong> -0.5px</li>
                  </ul>
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
              <div className="mb-10">
                {/* Header Row */}
                <div className="d-flex flex-row mb-3 pb-2" style={{ gap: '1rem', borderBottom: '2px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><strong>Prop</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Type</strong></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><strong>Default</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Description</strong></div>
                </div>
                
                {/* variant */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>variant</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>'neutral' | 'green'</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>'neutral'</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Color variant of the card</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* icon */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>icon</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>ReactNode | string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>required</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Icon element or image URL</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* title */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>title</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>required</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Card title (use \n for line breaks)</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* description */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>description</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>required</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Card description text</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* onClick */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>onClick</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>() =&gt; void</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>undefined</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Click handler (renders as button)</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* href */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>href</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>undefined</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Link destination (renders as anchor)</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* disabled */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>disabled</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>boolean</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>false</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Disabled state</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* className */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>className</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>''</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Additional CSS classes</div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Usage Examples */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Usage Examples</h2>
              
              <div className="d-flex flex-column gap-6">
                {/* Basic Usage */}
                <div className="card p-4">
                  <h6 className="mb-3">Basic Usage</h6>
                  <pre className="mb-0" style={{ backgroundColor: 'var(--bs-gray-800)', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`import { CardOffgrid } from 'shared/components/CardOffgrid';

<CardOffgrid
  variant="neutral"
  icon={<MyIcon />}
  title="Onchain\\nMetadata"
  description="Easily store key asset information..."
  onClick={() => console.log('clicked')}
/>`}
                  </pre>
                </div>

                {/* With Link */}
                <div className="card p-4">
                  <h6 className="mb-3">With Link</h6>
                  <pre className="mb-0" style={{ backgroundColor: 'var(--bs-gray-800)', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`<CardOffgrid
  variant="green"
  icon="/icons/metadata.svg"
  title="Learn More"
  description="Click to navigate to documentation..."
  href="/docs/metadata"
/>`}
                  </pre>
                </div>

                {/* Disabled State */}
                <div className="card p-4">
                  <h6 className="mb-3">Disabled State</h6>
                  <pre className="mb-0" style={{ backgroundColor: 'var(--bs-gray-800)', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`<CardOffgrid
  variant="neutral"
  icon={<MyIcon />}
  title="Coming Soon"
  description="This feature is not yet available..."
  disabled
/>`}
                  </pre>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Figma References */}
        <PageGrid className="py-26" id="link-demo">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Figma References</h2>
              <ul>
                <li>
                  <a href="https://www.figma.com/design/vwDwMJ3mFrAklj5zvZwX5M/Card---OffGrid?node-id=8001-1963&m=dev" target="_blank" rel="noopener noreferrer">
                    Light Mode Color States
                  </a>
                </li>
                <li>
                  <a href="https://www.figma.com/design/vwDwMJ3mFrAklj5zvZwX5M/Card---OffGrid?node-id=8001-2321&m=dev" target="_blank" rel="noopener noreferrer">
                    Dark Mode Color States
                  </a>
                </li>
                <li>
                  <a href="https://www.figma.com/design/vwDwMJ3mFrAklj5zvZwX5M/Card---OffGrid?node-id=8007-1096&m=dev" target="_blank" rel="noopener noreferrer">
                    Animation Specifications
                  </a>
                </li>
              </ul>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </div>
    </div>
  );
}
