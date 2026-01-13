import * as React from "react";
import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";
import { CalloutMediaBanner } from "shared/patterns/CalloutMediaBanner";

export const frontmatter = {
  seo: {
    title: 'CalloutMediaBanner Component Showcase',
    description: "A comprehensive showcase of the CalloutMediaBanner component variants, responsive behavior, and usage examples in the XRPL.org Design System.",
  }
};

export default function CalloutMediaBannerShowcase() {
  const handleClick = (message: string) => {
    console.log(`CalloutMediaBanner button clicked: ${message}`);
  };

  // Sample background images (placeholders)
  // To load an image from the `public` folder in Next.js (or Create React App), use the path relative to the `public` directory, starting with a slash.
  // For example, if you have `/public/backgrounds/Callout.jpg`, use:
  const sampleBackgroundImage = "/img/backgrounds/callout.jpg";
  const sampleLightBackgroundImage = "/img/backgrounds/callout-light.jpg";

  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="my-5 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Component Showcase</h6>
            <h1 className="mb-4">CalloutMediaBanner Component</h1>
            <p className="longform">
              A full-width banner component featuring a heading, subheading, and optional action buttons.
              Supports 5 color variants or a custom background image. Spans 100% of grid width and adapts
              responsively across mobile, tablet, and desktop viewports.
            </p>
          </div>
        </section>

        <CalloutMediaBanner
          variant="green"
          heading="The Compliant Ledger Protocol"
          subheading="A decentralized public Layer 1 blockchain for creating, transferring, and exchanging digital assets with a focus on compliance."
          primaryButton={{ label: "Get Started", onClick: () => handleClick('responsive-demo-primary') }}
          tertiaryButton={{ label: "Learn More", onClick: () => handleClick('responsive-demo-tertiary') }}
        />

        {/* Responsive Behavior */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Responsive Behavior</h2>
              <p className="mb-6">
                CalloutMediaBanner automatically adapts its spacing and typography based on viewport width.
                Resize your browser to see the responsive changes.
              </p>

              <div className="d-flex flex-column gap-4 mb-6">
                <div className="d-flex flex-row gap-4 align-items-start" style={{ flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <h6 className="mb-3">Desktop (≥1024px)</h6>
                    <ul className="mb-0">
                      <li><strong>Width:</strong> 100% of container</li>
                      <li><strong>Padding:</strong> 40px</li>
                      <li><strong>Content gap:</strong> 80px</li>
                      <li><strong>Heading:</strong> 40px font size</li>
                      <li><strong>Subheading:</strong> 32px font size</li>
                    </ul>
                  </div>
                  <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <h6 className="mb-3">Tablet (768px–1023px)</h6>
                    <ul className="mb-0">
                      <li><strong>Width:</strong> 100% of container</li>
                      <li><strong>Padding:</strong> 32px</li>
                      <li><strong>Content gap:</strong> 64px</li>
                      <li><strong>Heading:</strong> 36px font size</li>
                      <li><strong>Subheading:</strong> 28px font size</li>
                    </ul>
                  </div>
                  <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <h6 className="mb-3">Mobile (&lt;768px)</h6>
                    <ul className="mb-0">
                      <li><strong>Width:</strong> 100% of container</li>
                      <li><strong>Padding:</strong> 24px</li>
                      <li><strong>Content gap:</strong> 48px</li>
                      <li><strong>Heading:</strong> 32px font size</li>
                      <li><strong>Subheading:</strong> 24px font size</li>
                    </ul>
                  </div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Color Variants Section Header */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Color Variants</h2>
              <p className="mb-6">
                CalloutMediaBanner comes in 5 color variants to support different visual hierarchies and use cases.
                Color variants are only applied when no background image is provided.
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Default Variant */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Default</strong> - <code>variant="default"</code>
                  <br />
                  <small className="text-muted">White background, black text. General purpose, clean presentation.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CalloutMediaBanner
            variant="default"
            heading="Build on XRPL"
            subheading="Start building your next decentralized application on the XRP Ledger."
            primaryButton={{ label: "Start Building", href: "#start" }}
          />
        </div>

        {/* Light Gray Variant */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Light Gray</strong> - <code>variant="light-gray"</code>
                  <br />
                  <small className="text-muted">Subtle gray background for softer contrast.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CalloutMediaBanner
            variant="light-gray"
            heading="Developer Resources"
            subheading="Access comprehensive documentation, tutorials, and code samples."
            primaryButton={{ label: "View Docs", href: "#docs" }}
            tertiaryButton={{ label: "Browse Tutorials", href: "#tutorials" }}
          />
        </div>

        {/* Lilac Variant */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Lilac</strong> - <code>variant="lilac"</code>
                  <br />
                  <small className="text-muted">Distinctive purple tone for special announcements.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CalloutMediaBanner
            variant="lilac"
            heading="New Feature Release"
            subheading="Discover the latest enhancements and capabilities added to the XRP Ledger."
            primaryButton={{ label: "Learn More", href: "#features" }}
          />
        </div>

        {/* Green Variant */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Green</strong> - <code>variant="green"</code>
                  <br />
                  <small className="text-muted">Brand green for featured content and primary calls-to-action.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CalloutMediaBanner
            variant="green"
            heading="The Compliant Ledger Protocol"
            subheading="A decentralized public Layer 1 blockchain for creating, transferring, and exchanging digital assets with a focus on compliance."
            primaryButton={{ label: "Get Started", href: "#get-started" }}
            tertiaryButton={{ label: "Learn More", href: "#learn" }}
          />
        </div>

        {/* Gray Variant */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Gray</strong> - <code>variant="gray"</code>
                  <br />
                  <small className="text-muted">Medium gray for neutral, secondary content.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CalloutMediaBanner
            variant="gray"
            heading="Join the Community"
            subheading="Connect with developers building on XRPL."
            primaryButton={{ label: "Join Discord", href: "#discord" }}
            tertiaryButton={{ label: "View Events", href: "#events" }}
          />
        </div>

        {/* Background Image Variant Section Header */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Background Image Variant</h2>
              <p className="mb-4">
                When <code>backgroundImage</code> is provided, it overrides the <code>variant</code> prop.
                The component automatically adds a gradient overlay to ensure text remains readable.
                You can also specify <code>textColor</code> to fix the text color across both light and dark modes.
              </p>

              <div className="p-4 mb-6" style={{ backgroundColor: 'rgba(114, 119, 126, 0.1)', borderRadius: '8px' }}>
                <h6 className="mb-3">Image Priority Logic</h6>
                <ul className="mb-0">
                  <li><strong>If backgroundImage is provided:</strong> Image is used, variant color is ignored</li>
                  <li><strong>If only variant is provided:</strong> Solid color background is applied</li>
                  <li><strong>If neither:</strong> Defaults to white background (default variant)</li>
                  <li><strong>Text color:</strong> Defaults to white, or set to black via <code>textColor="black"</code></li>
                  <li><strong>Fixed text color:</strong> Text color remains consistent across light and dark modes</li>
                  <li><strong>Overlay gradient:</strong> Dark overlay for white text, light overlay for black text</li>
                </ul>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* White Text Example */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>White Text (Default)</strong> - <code>textColor="white"</code>
                  <br />
                  <small className="text-muted">Best for dark or colorful images. Includes dark overlay gradient.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CalloutMediaBanner
            backgroundImage={sampleBackgroundImage}
            subheading="A decentralized public Layer 1 blockchain for creating, transferring, and exchanging digital assets with a focus on compliance."
            primaryButton={{ label: "Start Building", onClick: () => handleClick('image-white-primary') }}
          />
        </div>

        {/* Black Text Example */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Black Text</strong> - <code>textColor="black"</code>
                  <br />
                  <small className="text-muted">Best for light or bright images. Includes light overlay gradient. Text remains black in both light and dark modes.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CalloutMediaBanner
            backgroundImage={sampleLightBackgroundImage}
            textColor="black"
            heading="Build the Future of Finance"
            subheading="Create powerful decentralized applications with XRPL's fast, efficient, and sustainable blockchain technology."
            primaryButton={{ label: "Start Building", onClick: () => handleClick('image-black-primary') }}
            tertiaryButton={{ label: "Explore Features", onClick: () => handleClick('image-black-tertiary') }}
          />
        </div>

        <PageGrid className="mb-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <p className="text-muted small">
                <em>Note: The image variant includes an automatic gradient overlay. White text gets a dark overlay, black text gets a light overlay. Text colors remain fixed across both light and dark modes.</em>
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Button Variations Section Header */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Button Variations</h2>
              <p className="mb-6">
                The component supports flexible button configurations. You can include a primary button, tertiary button, both, or neither.
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Both Buttons */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Primary + Tertiary Buttons</strong>
                  <br />
                  <small className="text-muted">Most common configuration with primary and secondary actions.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CalloutMediaBanner
            variant="default"
            heading="Complete Feature Set"
            subheading="Access all the tools you need to build on XRPL."
            primaryButton={{ label: "Get Started", href: "#start" }}
            tertiaryButton={{ label: "Learn More", href: "#learn" }}
          />
        </div>

        {/* Primary Only */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Primary Button Only</strong>
                  <br />
                  <small className="text-muted">Single, focused call-to-action.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CalloutMediaBanner
            variant="light-gray"
            heading="Simple Call-to-Action"
            subheading="Focus user attention on a single primary action."
            primaryButton={{ label: "Take Action", href: "#action" }}
          />
        </div>

        {/* Tertiary Only */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>No buttons</strong>
                  <br />
                  <small className="text-muted">Informational banner without call-to-action.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CalloutMediaBanner
            variant="lilac"
            heading="The Compliant Ledger Protocol"
            subheading="A decentralized public Layer 1 blockchain for creating, transferring, and exchanging digital assets with a focus on compliance."
          />
        </div>

        {/* No Buttons */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>No heading, buttons</strong>
                  <br />
                  <small className="text-muted">Alternative informational banner without call-to-action.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CalloutMediaBanner
            variant="green"
            subheading="Important information or announcement without requiring user action."
            primaryButton={{ label: "Take Action", href: "#action" }}
            tertiaryButton={{ label: "Learn More", href: "#learn" }}
          />
        </div>

        {/* Color Token Reference */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Color Token Reference</h2>
              <p className="mb-4">All colors are mapped from <code>styles/_colors.scss</code>. The component uses <code>html.light</code> and <code>html.dark</code> selectors for mode-specific styles.</p>

              <div className="d-flex flex-row gap-6 mb-6" style={{ flexWrap: 'wrap' }}>
                {/* Light Mode Colors */}
                <div style={{ flex: '1 1 400px', minWidth: '320px' }}>
                  <h6 className="mb-4">Light Mode</h6>

                  <div className="d-flex flex-column gap-3">
                    <div>
                      <strong className="d-block mb-2">Default Variant</strong>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#FFFFFF', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>$white</code> <small className="text-muted">#FFFFFF</small></div>
                      </div>
                    </div>

                    <div>
                      <strong className="d-block mb-2">Light Gray Variant</strong>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#E6EAF0', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>$gray-200</code> <small className="text-muted">#E6EAF0</small></div>
                      </div>
                    </div>

                    <div>
                      <strong className="d-block mb-2">Lilac Variant</strong>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#C0A7FF', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>$lilac-300</code> <small className="text-muted">#C0A7FF</small></div>
                      </div>
                    </div>

                    <div>
                      <strong className="d-block mb-2">Green Variant</strong>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#70EE97', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>$green-200</code> <small className="text-muted">#70EE97</small></div>
                      </div>
                    </div>

                    <div>
                      <strong className="d-block mb-2">Gray Variant</strong>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#CAD4DF', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>$gray-300</code> <small className="text-muted">#CAD4DF</small></div>
                      </div>
                    </div>

                    <div>
                      <strong className="d-block mb-2">Text Color</strong>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#141414', borderRadius: '4px', flexShrink: 0 }}></div>
                        <div><code>$black</code> <small className="text-muted">#141414</small></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dark Mode Colors */}
                <div style={{ flex: '1 1 400px', minWidth: '320px' }}>
                  <h6 className="mb-4">Dark Mode <code className="small">(html.dark)</code></h6>

                  <div className="d-flex flex-column gap-3">
                    <div>
                      <strong className="d-block mb-2">Default Variant</strong>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#232325', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>$gray-800</code> <small className="text-muted">#232325 + white text</small></div>
                      </div>
                    </div>

                    <div>
                      <strong className="d-block mb-2">Light Gray Variant</strong>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#343437', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>$gray-700</code> <small className="text-muted">#343437 + white text</small></div>
                      </div>
                    </div>

                    <div>
                      <strong className="d-block mb-2">Lilac Variant</strong>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#7649E3', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>$lilac-400</code> <small className="text-muted">#7649E3 + white text</small></div>
                      </div>
                    </div>

                    <div>
                      <strong className="d-block mb-2">Green Variant</strong>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#21E46B', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>$green-300</code> <small className="text-muted">#21E46B + black text</small></div>
                      </div>
                    </div>

                    <div>
                      <strong className="d-block mb-2">Gray Variant</strong>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#454549', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>$gray-600</code> <small className="text-muted">#454549 + white text</small></div>
                      </div>
                    </div>

                    <div>
                      <strong className="d-block mb-2">Image Variant Text</strong>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#FFFFFF', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>$white</code> <small className="text-muted">Always white for readability</small></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Component API */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Component API</h2>
              <div className="mb-10">
                {/* Header Row */}
                <div className="d-flex flex-row mb-3 pb-2" style={{ gap: '1rem', borderBottom: '2px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><strong>Prop</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Type</strong></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><strong>Default</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Description</strong></div>
                </div>

                {/* variant */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>variant</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>'default' | 'light-gray' | 'lilac' | 'green' | 'gray'</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>'default'</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Color variant (ignored if backgroundImage is provided)</div>
                </div>

                {/* backgroundImage */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>backgroundImage</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>undefined</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Background image URL - overrides variant color</div>
                </div>

                {/* textColor */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>textColor</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>'white' | 'black'</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>'white'</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Text color for image variant - fixed across light/dark modes (only used when backgroundImage is provided)</div>
                </div>

                {/* heading */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>heading</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><em>required</em></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Main heading text</div>
                </div>

                {/* subheading */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>subheading</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><em>required</em></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Subheading/description text</div>
                </div>

                {/* primaryButton */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>primaryButton</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>{`{ label, href?, onClick? }`}</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>undefined</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Primary button configuration</div>
                </div>

                {/* tertiaryButton */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>tertiaryButton</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>{`{ label, href?, onClick? }`}</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>undefined</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Tertiary button configuration</div>
                </div>

                {/* className */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>className</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>''</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Additional CSS classes</div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Design References */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Design References</h2>
              <div className="d-flex flex-column gap-3">
                <div>
                  <strong>Figma Design:</strong>{' '}
                  <a href="https://www.figma.com/design/i4OuOX6QSBauMaJE4iY4kV/Callout---Media-Banner?node-id=1-2&m=dev" target="_blank" rel="noopener noreferrer">
                    Callout - Media Banner (Figma)
                  </a>
                </div>
                <div>
                  <strong>Component Location:</strong>{' '}
                  <code>shared/patterns/CalloutMediaBanner/</code>
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
