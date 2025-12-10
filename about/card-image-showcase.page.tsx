import * as React from "react";
import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";
import { CardImage } from "shared/components/CardImage";
import { Divider } from "shared/components/Divider";

export const frontmatter = {
  seo: {
    title: 'CardImage Component Showcase',
    description: "A comprehensive showcase of all CardImage component variants, states, and responsive behavior in the XRPL.org Design System.",
  }
};

// Sample image URL for demonstration (1:1 ratio image)
const SAMPLE_IMAGE = "/img/cards/card-image-showcase.png";

// Image from Figma Image Scaling spec (node 4171-104)
const IMAGE_SCALING_DEMO = "/img/cards/card-image-scaling-demo.png";

export default function CardImageShowcase() {
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
            <h1 className="mb-4">CardImage Component</h1>
            <p className="longform">
              A responsive card component displaying an image, title, subtitle, and CTA button.
              Features three responsive size variants (LG/MD/SM) that adapt to viewport width,
              with card hover triggering the button's hover animation.
            </p>
          </div>
        </section>

        {/* Design Constraints */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Design Constraints</h2>
              <div className="d-flex flex-row gap-6 mb-6" style={{ flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Image</h6>
                  <ul className="mb-0">
                    <li><strong>Aspect Ratio:</strong> 1:1 (square)</li>
                    <li>Scales with card width</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Title</h6>
                  <ul className="mb-0">
                    <li><strong>Lines:</strong> 1 line only</li>
                    <li>Truncated with ellipsis</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Subtitle</h6>
                  <ul className="mb-0">
                    <li><strong>Lines:</strong> Max 3 lines</li>
                    <li>Truncated with ellipsis</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Button</h6>
                  <ul className="mb-0">
                    <li><strong>Position:</strong> Locked to bottom</li>
                    <li>30px margin from card bottom</li>
                  </ul>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Basic Showcase */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Basic Usage</h2>
              <p className="mb-6">
                The CardImage component displays an image (1:1 ratio), title (1 line only), subtitle (max 3 lines), and a primary button locked to the bottom.
                Hover over the card to see the button animation trigger.
              </p>
              
              <PageGridRow>
                <PageGridCol span={{ base: 12, md: 6, lg: 3 }}>
                  <h6 className="mb-3">With Link (href)</h6>
                  <CardImage
                    image={SAMPLE_IMAGE}
                    imageAlt="Documentation illustration"
                    title="Documentation"
                    subtitle="Access everything you need to get started working with the XRPL."
                    buttonLabel="Get Started"
                    href="#"
                  />
                </PageGridCol>
                
                <PageGridCol span={{ base: 12, md: 6, lg: 3 }}>
                  <h6 className="mb-3">With Click Handler</h6>
                  <CardImage
                    image={SAMPLE_IMAGE}
                    imageAlt="Feature illustration"
                    title="Developer Tools"
                    subtitle="Build powerful applications with our comprehensive SDK and API documentation."
                    buttonLabel="Learn More"
                    onClick={() => handleCardClick('click-handler')}
                  />
                  {clickedCard === 'click-handler' && (
                    <p className="mt-2 text-success">✓ Card clicked!</p>
                  )}
                </PageGridCol>
              </PageGridRow>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Interactive States */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Interactive States</h2>
              <p className="mb-6">
                Hover, focus, and press the cards below to see the state transitions.
                Notice how hovering the card triggers the button's hover animation.
              </p>
              
              <PageGridRow>
                <PageGridCol span={{ base: 12, md: 6, lg: 3 }}>
                  <div className="text-center">
                    <small className="d-block mb-2 text-muted">Default / Hover</small>
                    <CardImage
                      image={SAMPLE_IMAGE}
                      imageAlt="Default state"
                      title="Default State"
                      subtitle="Hover over this card to see the button animation. The entire card triggers the button's hover effect."
                      buttonLabel="Medium Link"
                      onClick={() => handleCardClick('default')}
                    />
                    {clickedCard === 'default' && (
                      <p className="mt-2 text-success">✓ Card clicked!</p>
                    )}
                  </div>
                </PageGridCol>
                
                <PageGridCol span={{ base: 12, md: 6, lg: 3 }}>
                  <div className="text-center">
                    <small className="d-block mb-2 text-muted">Disabled</small>
                    <CardImage
                      image={SAMPLE_IMAGE}
                      imageAlt="Disabled state"
                      title="Disabled State"
                      subtitle="This card is disabled. The button shows disabled styling and interactions are blocked."
                      buttonLabel="Unavailable"
                      disabled
                    />
                  </div>
                </PageGridCol>
              </PageGridRow>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Responsive Grid Demo */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Responsive Grid Layout</h2>
              <p className="mb-6">
                CardImage is designed to work with the PageGrid system. Resize your browser to see
                the responsive behavior: 3-column on desktop (LG), 2-column on tablet (MD), 1-column on mobile (SM).
              </p>
            </PageGridCol>
          </PageGridRow>
          
          <PageGridRow>
            <PageGridCol span={{ base: 12, md: 6, lg: 3 }}>
              <CardImage
                image={SAMPLE_IMAGE}
                imageAlt="Card 1"
                title="Documentation"
                subtitle="Access everything you need to get started working with the XRPL."
                buttonLabel="Get Started"
                href="#"
              />
            </PageGridCol>
            <PageGridCol span={{ base: 12, md: 6, lg: 3 }}>
              <CardImage
                image={SAMPLE_IMAGE}
                imageAlt="Card 2"
                title="Tutorials"
                subtitle="Step-by-step guides to help you build on the XRP Ledger."
                buttonLabel="View Tutorials"
                href="#"
              />
            </PageGridCol>
            <PageGridCol span={{ base: 12, md: 6, lg: 3 }}>
              <CardImage
                image={SAMPLE_IMAGE}
                imageAlt="Card 3"
                title="API Reference"
                subtitle="Comprehensive API documentation for all XRPL methods."
                buttonLabel="Explore API"
                href="#"
              />
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Color Palette - Light Mode */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Color Palette</h2>
              <p className="mb-6">
                All colors are mapped from <code>styles/_colors.scss</code>. 
                The site defaults to <strong>dark mode</strong>. Light mode is activated via <code>html.light</code>.
              </p>
              
              {/* Light Mode Colors */}
              <h5 className="mb-4">Light Mode (Default for this component)</h5>
              <div className="d-flex flex-column gap-3 mb-6">
                <div className="d-flex flex-row align-items-center gap-3">
                  <div style={{ width: '60px', height: '40px', backgroundColor: '#FFFFFF', borderRadius: '4px', flexShrink: 0, border: '1px solid #CAD4DF' }}></div>
                  <div>
                    <strong>Card Background:</strong> <code>$white</code>
                    <br />
                    <small className="text-muted">#FFFFFF</small>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center gap-3">
                  <div style={{ width: '60px', height: '40px', backgroundColor: '#CAD4DF', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                  <div>
                    <strong>Card Border:</strong> <code>$gray-300</code>
                    <br />
                    <small className="text-muted">#CAD4DF</small>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center gap-3">
                  <div style={{ width: '60px', height: '40px', backgroundColor: '#F0F3F7', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                  <div>
                    <strong>Image Container:</strong> <code>$gray-100</code>
                    <br />
                    <small className="text-muted">#F0F3F7</small>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center gap-3">
                  <div style={{ width: '60px', height: '40px', backgroundColor: '#141414', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                  <div>
                    <strong>Text Color:</strong> <code>#141414</code> (Neutral Black)
                    <br />
                    <small className="text-muted">Title and Subtitle</small>
                  </div>
                </div>
              </div>

              <Divider color="gray" className="my-6" />

              {/* Dark Mode Colors */}
              <h5 className="mb-4">Dark Mode (<code>html.dark</code>)</h5>
              <div className="d-flex flex-column gap-3 mb-6">
                <div className="d-flex flex-row align-items-center gap-3">
                  <div style={{ width: '60px', height: '40px', backgroundColor: '#111112', borderRadius: '4px', flexShrink: 0, border: '1px solid #444' }}></div>
                  <div>
                    <strong>Card Background:</strong> <code>$gray-900</code>
                    <br />
                    <small className="text-muted">#111112</small>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center gap-3">
                  <div style={{ width: '60px', height: '40px', backgroundColor: '#72777E', borderRadius: '4px', flexShrink: 0, border: '1px solid #444' }}></div>
                  <div>
                    <strong>Image Container:</strong> <code>$gray-500</code>
                    <br />
                    <small className="text-muted">#72777E</small>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center gap-3">
                  <div style={{ width: '60px', height: '40px', backgroundColor: '#FFFFFF', borderRadius: '4px', flexShrink: 0, border: '1px solid #444' }}></div>
                  <div>
                    <strong>Title:</strong> <code>$white</code>
                    <br />
                    <small className="text-muted">#FFFFFF</small>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center gap-3">
                  <div style={{ width: '60px', height: '40px', backgroundColor: '#E6EAF0', borderRadius: '4px', flexShrink: 0, border: '1px solid #444' }}></div>
                  <div>
                    <strong>Subtitle:</strong> <code>$gray-200</code>
                    <br />
                    <small className="text-muted">#E6EAF0</small>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center gap-3">
                  <div style={{ width: '60px', height: '40px', backgroundColor: 'rgba(114, 119, 126, 0.15)', borderRadius: '4px', flexShrink: 0, border: '1px solid #444' }}></div>
                  <div>
                    <strong>Hover Overlay:</strong> 15% black
                    <br />
                    <small className="text-muted">rgba(114, 119, 126, 0.15)</small>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center gap-3">
                  <div style={{ width: '60px', height: '40px', backgroundColor: 'rgba(114, 119, 126, 0.45)', borderRadius: '4px', flexShrink: 0, border: '1px solid #444' }}></div>
                  <div>
                    <strong>Pressed Overlay:</strong> 45% black
                    <br />
                    <small className="text-muted">rgba(114, 119, 126, 0.45)</small>
                  </div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Dimensions */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Responsive Dimensions</h2>
              
              <div className="mb-6">
                {/* Header Row */}
                <div className="d-flex flex-row mb-3 pb-2" style={{ gap: '1rem', borderBottom: '2px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '180px', flexShrink: 0 }}><strong>Variant</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Breakpoint</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Grid Columns</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Card Height</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Image Ratio</strong></div>
                </div>
                
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '180px', flexShrink: 0 }}><strong>LG (Large)</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>≥992px</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>3-column width</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>620px</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>1:1</code></div>
                </div>
                <Divider weight="thin" color="gray" />
                
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '180px', flexShrink: 0 }}><strong>MD (Medium)</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>576px - 991px</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>2-column width</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>560px</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>1:1</code></div>
                </div>
                <Divider weight="thin" color="gray" />
                
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '180px', flexShrink: 0 }}><strong>SM (Small)</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>&lt;576px</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>1-column width</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>536px</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>1:1</code></div>
                </div>
              </div>

              <Divider color="gray" className="my-6" />

              <h5 className="mb-4">Spacing Tokens</h5>
              <div className="mb-6">
                {/* Header Row */}
                <div className="d-flex flex-row mb-3 pb-2" style={{ gap: '1rem', borderBottom: '2px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '220px', flexShrink: 0 }}><strong>Property</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Value</strong></div>
                </div>
                
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '220px', flexShrink: 0 }}>Image-to-content gap</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>24px</code></div>
                </div>
                <Divider weight="thin" color="gray" />
                
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '220px', flexShrink: 0 }}>Title-to-subtitle gap</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>12px</code></div>
                </div>
                <Divider weight="thin" color="gray" />
                
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '220px', flexShrink: 0 }}>Content horizontal padding</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>8px</code></div>
                </div>
                <Divider weight="thin" color="gray" />
                
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '220px', flexShrink: 0 }}>Button margin-bottom</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>30px</code></div>
                </div>
                <Divider weight="thin" color="gray" />
                
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '220px', flexShrink: 0 }}>Border radius</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>16px</code></div>
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
                  <h6 className="mb-3">Title (<code>.sh-md-l</code>)</h6>
                  <ul className="mb-0">
                    <li><strong>Font Size:</strong> 28px</li>
                    <li><strong>Font Weight:</strong> 300 (light)</li>
                    <li><strong>Line Height:</strong> 35px</li>
                    <li><strong>Letter Spacing:</strong> -0.5px</li>
                    <li><strong>Lines:</strong> 1 (truncated)</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <h6 className="mb-3">Subtitle (<code>.body-l</code>)</h6>
                  <ul className="mb-0">
                    <li><strong>Font Size:</strong> 18px</li>
                    <li><strong>Font Weight:</strong> 300 (light)</li>
                    <li><strong>Line Height:</strong> 26.1px</li>
                    <li><strong>Letter Spacing:</strong> -0.5px</li>
                    <li><strong>Lines:</strong> Max 3 (truncated)</li>
                  </ul>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Image Scaling Animation */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Image Scaling Animation</h2>
              <p className="mb-6">
                On hover, focus, and pressed states, the image inside the card scales up by <strong>10%</strong> while 
                the image container remains fixed. This creates a subtle zoom effect that enhances interactivity without 
                disrupting the card layout.
              </p>
              
              <div className="d-flex flex-row gap-6 mb-6" style={{ flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <h6 className="mb-3">Container Behavior</h6>
                  <ul className="mb-0">
                    <li><strong>Image box:</strong> Does NOT increase</li>
                    <li><strong>Overflow:</strong> Hidden (clips scaled content)</li>
                    <li><strong>Background:</strong> Remains visible at edges</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <h6 className="mb-3">Image Behavior</h6>
                  <ul className="mb-0">
                    <li><strong>Scale:</strong> 110% (1.1x) on interaction</li>
                    <li><strong>Transform origin:</strong> Center</li>
                    <li><strong>Transition:</strong> 150ms cubic-bezier</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <h6 className="mb-3">Trigger States</h6>
                  <ul className="mb-0">
                    <li>Hover (mouse over card)</li>
                    <li>Focus (keyboard navigation)</li>
                    <li>Pressed (active click)</li>
                  </ul>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
          
          <PageGridRow>
            <PageGridCol span={{ base: 12, md: 6, lg: 3 }}>
              <div className="text-center">
                <small className="d-block mb-2 text-muted">Hover to see image zoom (fullBleed)</small>
                <CardImage
                  image={IMAGE_SCALING_DEMO}
                  imageAlt="3D metallic cubes illustration"
                  title="Documentation"
                  subtitle="Access everything you need to get started working with the XRPL. Line 3"
                  buttonLabel="Medium Link"
                  onClick={() => handleCardClick('image-scale')}
                  fullBleed
                />
                {clickedCard === 'image-scale' && (
                  <p className="mt-2 text-success">✓ Card clicked!</p>
                )}
              </div>
            </PageGridCol>
            
            <PageGridCol span={{ base: 12, md: 6, lg: 3 }}>
              <div className="text-center">
                <small className="d-block mb-2 text-muted">Custom backgroundColor</small>
                <CardImage
                  image={SAMPLE_IMAGE}
                  imageAlt="Sample illustration"
                  title="Custom Background"
                  subtitle="This card has a custom background color set via the backgroundColor prop."
                  buttonLabel="Medium Link"
                  onClick={() => handleCardClick('custom-bg')}
                  backgroundColor="#1a1a2e"
                />
                {clickedCard === 'custom-bg' && (
                  <p className="mt-2 text-success">✓ Card clicked!</p>
                )}
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
                    <li><strong>Duration:</strong> 150ms</li>
                    <li><strong>Easing:</strong> <code>cubic-bezier(0.98, 0.12, 0.12, 0.98)</code></li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <h6 className="mb-3">Card Hover → Button Animation</h6>
                  <ul className="mb-0">
                    <li>Button background fills bottom → top</li>
                    <li>Arrow icon line shrinks</li>
                    <li>Gap between label and icon increases</li>
                    <li>Padding adjusts for smooth transition</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <h6 className="mb-3">State Flow</h6>
                  <ul className="mb-0">
                    <li>Default → Hover → Pressed</li>
                    <li>Card hover triggers button hover</li>
                    <li>Focus ring on keyboard navigation</li>
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
                
                {/* image */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>image</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>required</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Image source URL</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* imageAlt */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>imageAlt</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>required</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Alt text for the image</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* title */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>title</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>required</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Card title (1 line only)</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* subtitle */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>subtitle</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>required</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Card subtitle (max 3 lines)</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* buttonLabel */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>buttonLabel</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>required</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Button label text</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* href */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>href</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>undefined</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Link destination (makes card clickable)</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* onClick */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>onClick</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>() =&gt; void</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>undefined</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Click handler for button</div>
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
                  <h6 className="mb-3">Basic Usage with Link</h6>
                  <pre className="mb-0" style={{ backgroundColor: 'var(--bs-gray-800)', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`import { CardImage } from 'shared/components/CardImage';

<CardImage
  image="/images/docs-hero.png"
  imageAlt="Documentation illustration"
  title="Documentation"
  subtitle="Access everything you need to get started..."
  buttonLabel="Get Started"
  href="/docs"
/>`}
                  </pre>
                </div>

                {/* With Click Handler */}
                <div className="card p-4">
                  <h6 className="mb-3">With Click Handler</h6>
                  <pre className="mb-0" style={{ backgroundColor: 'var(--bs-gray-800)', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`<CardImage
  image="/images/feature.png"
  imageAlt="Feature illustration"
  title="New Feature"
  subtitle="Learn about our latest feature..."
  buttonLabel="Learn More"
  onClick={() => console.log('clicked')}
/>`}
                  </pre>
                </div>

                {/* In PageGrid */}
                <div className="card p-4">
                  <h6 className="mb-3">With PageGrid (Responsive 3-Column)</h6>
                  <pre className="mb-0" style={{ backgroundColor: 'var(--bs-gray-800)', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`import { PageGrid, PageGridRow, PageGridCol } from 'shared/components/PageGrid/page-grid';
import { CardImage } from 'shared/components/CardImage';

<PageGrid>
  <PageGridRow>
    <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
      <CardImage
        image="/images/card1.png"
        imageAlt="Card 1"
        title="Documentation"
        subtitle="Access everything you need..."
        buttonLabel="Get Started"
        href="/docs"
      />
    </PageGridCol>
    <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
      <CardImage
        image="/images/card2.png"
        imageAlt="Card 2"
        title="Tutorials"
        subtitle="Step-by-step guides..."
        buttonLabel="View Tutorials"
        href="/tutorials"
      />
    </PageGridCol>
    <PageGridCol span={{ base: 4, md: 8, lg: 4 }}>
      <CardImage
        image="/images/card3.png"
        imageAlt="Card 3"
        title="API Reference"
        subtitle="Comprehensive API docs..."
        buttonLabel="Explore API"
        href="/api"
      />
    </PageGridCol>
  </PageGridRow>
</PageGrid>`}
                  </pre>
                </div>

                {/* Disabled State */}
                <div className="card p-4">
                  <h6 className="mb-3">Disabled State</h6>
                  <pre className="mb-0" style={{ backgroundColor: 'var(--bs-gray-800)', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`<CardImage
  image="/images/coming-soon.png"
  imageAlt="Coming soon"
  title="Coming Soon"
  subtitle="This feature is not yet available..."
  buttonLabel="Unavailable"
  disabled
/>`}
                  </pre>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Figma References */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Figma References</h2>
              <ul>
                <li>
                  <a href="https://www.figma.com/design/3KewCK6ylLtHm9Yd3eSZqs/Card---Image?node-id=4139-185&m=dev" target="_blank" rel="noopener noreferrer">
                    Light Mode Design States
                  </a>
                </li>
                <li>
                  <a href="https://www.figma.com/design/3KewCK6ylLtHm9Yd3eSZqs/Card---Image?node-id=4139-245&m=dev" target="_blank" rel="noopener noreferrer">
                    Dark Mode Design States
                  </a>
                </li>
                <li>
                  <a href="https://www.figma.com/design/3KewCK6ylLtHm9Yd3eSZqs/Card---Image?node-id=4171-104&m=dev" target="_blank" rel="noopener noreferrer">
                    Image Scaling Animation Spec
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
