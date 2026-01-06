import * as React from 'react';
import { PageGrid, PageGridRow, PageGridCol } from 'shared/components/PageGrid/page-grid';
import { HeaderHeroSplitMedia } from 'shared/patterns/HeaderHeroSplitMedia';

export const frontmatter = {
  seo: {
    title: 'HeaderHeroSplitMedia Pattern Showcase',
    description: 'Interactive showcase of the HeaderHeroSplitMedia pattern with all variants, layouts, and responsive behavior.',
  },
};

export default function HeaderHeroSplitMediaShowcase() {
  // Placeholder image - using the demo-bg.png file
  const placeholderImage = '/img/demo-bg.png';

  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-26 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Pattern Showcase</h6>
            <h1 className="mb-4">HeaderHeroSplitMedia Pattern</h1>
            <p className="longform">
              A page-level hero pattern that pairs prominent editorial content with a primary media element in a split layout.
              Designed to introduce major concepts, products, or use cases while maintaining strong visual hierarchy and clear calls to action.
            </p>
          </div>
        </section>

        {/* Surface Variants */}
        <section className="py-26">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="d-flex flex-column-reverse mb-8">
                  <h2 className="h4 mb-0">Surface Variants</h2>
                  <h6 className="eyebrow mb-3">Default vs Accent</h6>
                </div>
                <p className="mb-10">
                  The pattern supports two surface treatments: Default (no background) and Accent (green background on title section).
                  Theme is automatically controlled by <code>html.light</code> and <code>html.dark</code> classes.
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>

          {/* Default Surface */}
          <div className="mb-10">
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={12}>
                  <h3 className="h5 mb-4">Default Surface</h3>
                  <p className="mb-6 text-muted">
                    No background surface behind the hero title. Entire content area has uniform background.
                  </p>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
            <HeaderHeroSplitMedia
              surface="default"
              layout="content-left"
              title="Real-world asset tokenization"
              subtitle="Learn how to issue crypto tokens and build tokenization solutions with developer tools and APIs."
              description="XRPL Payments Suite helps fintechs and payment providers move money fast, globally, and at low cost - all through simple APIs."
              primaryCta={{ label: "Primary Link", href: "#primary" }}
              secondaryCta={{ label: "Tertiary Link", href: "#tertiary" }}
              media={{ src: placeholderImage, alt: "Tokenization illustration" }}
            />
          </div>

          {/* Accent Surface */}
          <div className="mb-10">
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={12}>
                  <h3 className="h5 mb-4">Accent Surface</h3>
                  <p className="mb-6 text-muted">
                    Green accent background with internal padding behind the hero title and subtitle section.
                  </p>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
            <HeaderHeroSplitMedia
              surface="accent"
              layout="content-left"
              title="Real-world asset tokenization"
              subtitle="Learn how to issue crypto tokens and build tokenization solutions with developer tools and APIs."
              description="XRPL Payments Suite helps fintechs and payment providers move money fast, globally, and at low cost - all through simple APIs."
              primaryCta={{ label: "Primary Link", href: "#primary" }}
              secondaryCta={{ label: "Tertiary Link", href: "#tertiary" }}
              media={{ src: placeholderImage, alt: "Tokenization illustration" }}
            />
          </div>
        </section>

        {/* Layout Variants */}
        <section className="py-26">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="d-flex flex-column-reverse mb-8">
                  <h2 className="h4 mb-0">Layout Variants</h2>
                  <h6 className="eyebrow mb-3">Content Position</h6>
                </div>
                <p className="mb-10">
                  Control whether the content block appears on the left or right side of the media.
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>

          {/* Content Left */}
          <div className="mb-10">
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={12}>
                  <h3 className="h5 mb-4">Content Left (Default)</h3>
                  <p className="mb-6 text-muted">
                    Content appears on the left, media on the right. This is the default layout.
                  </p>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
            <HeaderHeroSplitMedia
              surface="accent"
              layout="content-left"
              title="Build on the XRP Ledger"
              subtitle="Start developing with the most sustainable blockchain."
              description="Join thousands of developers building the future of finance."
              primaryCta={{ label: "Start Building", href: "#start" }}
              secondaryCta={{ label: "View Tutorials", href: "#tutorials" }}
              media={{ src: placeholderImage, alt: "XRPL development" }}
            />
          </div>

          {/* Content Right */}
          <div className="mb-10">
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={12}>
                  <h3 className="h5 mb-4">Content Right</h3>
                  <p className="mb-6 text-muted">
                    Content appears on the right, media on the left. Useful for visual variety.
                  </p>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
            <HeaderHeroSplitMedia
              surface="accent"
              layout="content-right"
              title="Enterprise Solutions"
              subtitle="Scale your business with blockchain technology."
              description="Leverage the XRPL Ledger for enterprise-grade applications."
              primaryCta={{ label: "Contact Sales", href: "#contact" }}
              secondaryCta={{ label: "Learn More", href: "#learn" }}
              media={{ src: placeholderImage, alt: "Enterprise solutions" }}
            />
          </div>
        </section>

        {/* Responsive Behavior */}
        <section className="py-26">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="d-flex flex-column-reverse mb-8">
                  <h2 className="h4 mb-0">Responsive Behavior</h2>
                  <h6 className="eyebrow mb-3">Breakpoint Adaptations</h6>
                </div>
                <p className="mb-6">
                  The pattern adapts responsively across desktop, tablet, and mobile breakpoints. Resize your browser window to see the changes.
                </p>

                <div className="d-flex flex-column gap-4 mb-10">
                  <div className="d-flex flex-row gap-4 align-items-start" style={{ flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                      <h6 className="mb-3">Desktop (≥992px)</h6>
                      <ul className="mb-0">
                        <li><strong>Layout:</strong> Side-by-side (50/50 split)</li>
                        <li><strong>Grid columns:</strong> Content 6/12, Media 6/12</li>
                        <li><strong>Text width:</strong> 5/12 of grid (83.33% of column)</li>
                        <li><strong>Content gap:</strong> 8px</li>
                        <li><strong>CTA gap:</strong> 24px (horizontal)</li>
                      </ul>
                    </div>
                    <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                      <h6 className="mb-3">Tablet (576px–991px)</h6>
                      <ul className="mb-0">
                        <li><strong>Layout:</strong> Stacked (content above media)</li>
                        <li><strong>Grid columns:</strong> Content 8/8, Media 8/8</li>
                        <li><strong>Text width:</strong> 6/8 of grid (75% of column)</li>
                        <li><strong>Content gap:</strong> 32px</li>
                        <li><strong>CTA gap:</strong> 24px (horizontal)</li>
                      </ul>
                    </div>
                    <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                      <h6 className="mb-3">Mobile (&lt;576px)</h6>
                      <ul className="mb-0">
                        <li><strong>Layout:</strong> Stacked (content above media)</li>
                        <li><strong>Grid columns:</strong> Content 4/4, Media 4/4</li>
                        <li><strong>Text width:</strong> Full width</li>
                        <li><strong>Content gap:</strong> 32px</li>
                        <li><strong>CTA gap:</strong> 16px (vertical)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 mb-10" style={{ backgroundColor: 'rgba(114, 119, 126, 0.1)', borderRadius: '8px' }}>
                  <h6 className="mb-3">Accent Surface Padding</h6>
                  <ul className="mb-0">
                    <li><strong>Desktop:</strong> 16px top, 16px left/right, 24px bottom</li>
                    <li><strong>Tablet:</strong> 16px top, 16px left/right, 24px bottom</li>
                    <li><strong>Mobile:</strong> 8px top, 8px left/right, 16px bottom</li>
                  </ul>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
        </section>

        {/* Optional Props Combinations */}
        <section className="py-26">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="d-flex flex-column-reverse mb-8">
                  <h2 className="h4 mb-0">Optional Props Combinations</h2>
                  <h6 className="eyebrow mb-3">Flexible Content</h6>
                </div>
                <p className="mb-10">
                  The pattern gracefully handles various combinations of optional props. Description, primaryCta, and secondaryCta are all optional.
                  The layout automatically adjusts based on which props are provided.
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>

          {/* Full Content - All Props */}
          <div className="mb-10">
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={12}>
                  <h3 className="h5 mb-4">Full Content (All Props)</h3>
                  <p className="mb-6 text-muted">
                    Title, subtitle, description, primary CTA, and secondary CTA all provided.
                  </p>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
            <HeaderHeroSplitMedia
              surface="default"
              layout="content-left"
              title="Real-world asset tokenization"
              subtitle="Learn how to issue crypto tokens and build tokenization solutions with developer tools and APIs."
              description="XRPL Payments Suite helps fintechs and payment providers move money fast, globally, and at low cost - all through simple APIs."
              primaryCta={{ label: "Primary Link", href: "#primary" }}
              secondaryCta={{ label: "Tertiary Link", href: "#tertiary" }}
              media={{ src: placeholderImage, alt: "Full content example" }}
            />
          </div>

          {/* Full Content - Accent Surface */}
          <div className="mb-10">
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={12}>
                  <h3 className="h5 mb-4">Full Content (Accent Surface)</h3>
                  <p className="mb-6 text-muted">
                    Same as above but with accent surface for the title section.
                  </p>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
            <HeaderHeroSplitMedia
              surface="accent"
              layout="content-left"
              title="Real-world asset tokenization"
              subtitle="Learn how to issue crypto tokens and build tokenization solutions with developer tools and APIs."
              description="XRPL Payments Suite helps fintechs and payment providers move money fast, globally, and at low cost - all through simple APIs."
              primaryCta={{ label: "Primary Link", href: "#primary" }}
              secondaryCta={{ label: "Tertiary Link", href: "#tertiary" }}
              media={{ src: placeholderImage, alt: "Full content accent example" }}
            />
          </div>

          {/* No Description - CTAs Only */}
          <div className="mb-10">
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={12}>
                  <h3 className="h5 mb-4">No Description (CTAs Only)</h3>
                  <p className="mb-6 text-muted">
                    Title, subtitle, and both CTAs - no description text. CTAs appear directly below the title section.
                  </p>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
            <HeaderHeroSplitMedia
              surface="default"
              layout="content-left"
              title="Real-world asset tokenization"
              subtitle="Learn how to issue crypto tokens and build tokenization solutions with developer tools and APIs."
              primaryCta={{ label: "Primary Link", href: "#primary" }}
              secondaryCta={{ label: "Tertiary Link", href: "#tertiary" }}
              media={{ src: placeholderImage, alt: "No description example" }}
            />
          </div>

          {/* No Description - Accent Surface */}
          <div className="mb-10">
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={12}>
                  <h3 className="h5 mb-4">No Description (Accent Surface)</h3>
                  <p className="mb-6 text-muted">
                    Same as above but with accent surface.
                  </p>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
            <HeaderHeroSplitMedia
              surface="accent"
              layout="content-left"
              title="Real-world asset tokenization"
              subtitle="Learn how to issue crypto tokens and build tokenization solutions with developer tools and APIs."
              primaryCta={{ label: "Primary Link", href: "#primary" }}
              secondaryCta={{ label: "Tertiary Link", href: "#tertiary" }}
              media={{ src: placeholderImage, alt: "No description accent example" }}
            />
          </div>

          {/* Primary CTA Only (No Description) */}
          <div className="mb-10">
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={12}>
                  <h3 className="h5 mb-4">Primary CTA Only (No Description)</h3>
                  <p className="mb-6 text-muted">
                    Title, subtitle, and only primary CTA - no description or secondary CTA.
                  </p>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
            <HeaderHeroSplitMedia
              surface="default"
              layout="content-left"
              title="Quick Start Guide"
              subtitle="Get up and running in minutes."
              primaryCta={{ label: "Begin", href: "#begin" }}
              media={{ src: placeholderImage, alt: "Primary CTA only example" }}
            />
          </div>

          {/* Primary CTA Only (With Description) */}
          <div className="mb-10">
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={12}>
                  <h3 className="h5 mb-4">Primary CTA Only (With Description)</h3>
                  <p className="mb-6 text-muted">
                    Title, subtitle, description, and only primary CTA - no secondary CTA.
                  </p>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
            <HeaderHeroSplitMedia
              surface="default"
              layout="content-left"
              title="Real-world asset tokenization"
              subtitle="Learn how to issue crypto tokens and build tokenization solutions with developer tools and APIs."
              description="XRPL Payments Suite helps fintechs and payment providers move money fast, globally, and at low cost - all through simple APIs."
              primaryCta={{ label: "Primary Link", href: "#primary" }}
              media={{ src: placeholderImage, alt: "Primary CTA with description example" }}
            />
          </div>

          {/* No CTAs (Description Only) */}
          <div className="mb-10">
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={12}>
                  <h3 className="h5 mb-4">No CTAs (Description Only)</h3>
                  <p className="mb-6 text-muted">
                    Title, subtitle, and description - no CTA buttons.
                  </p>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
            <HeaderHeroSplitMedia
              surface="default"
              layout="content-left"
              title="Real-world asset tokenization"
              subtitle="Learn how to issue crypto tokens and build tokenization solutions with developer tools and APIs."
              description="XRPL Payments Suite helps fintechs and payment providers move money fast, globally, and at low cost - all through simple APIs."
              media={{ src: placeholderImage, alt: "No CTAs example" }}
            />
          </div>

          {/* Title and Subtitle Only (Minimum) */}
          <div className="mb-10">
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={12}>
                  <h3 className="h5 mb-4">Title and Subtitle Only (Minimum)</h3>
                  <p className="mb-6 text-muted">
                    Only the required props: title, subtitle, and media. No description or CTAs.
                  </p>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
            <HeaderHeroSplitMedia
              surface="default"
              layout="content-left"
              title="Real-world asset tokenization"
              subtitle="Learn how to issue crypto tokens and build tokenization solutions with developer tools and APIs."
              media={{ src: placeholderImage, alt: "Minimum props example" }}
            />
          </div>

          {/* Title and Subtitle Only (Accent) */}
          <div className="mb-10">
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={12}>
                  <h3 className="h5 mb-4">Title and Subtitle Only (Accent Surface)</h3>
                  <p className="mb-6 text-muted">
                    Minimum props with accent surface - title section is centered vertically.
                  </p>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
            <HeaderHeroSplitMedia
              surface="accent"
              layout="content-left"
              title="Real-world asset tokenization"
              subtitle="Learn how to issue crypto tokens and build tokenization solutions with developer tools and APIs."
              media={{ src: placeholderImage, alt: "Minimum props accent example" }}
            />
          </div>
        </section>

        {/* Theme Support */}
        <section className="py-26">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="d-flex flex-column-reverse mb-8">
                  <h2 className="h4 mb-0">Theme Support</h2>
                  <h6 className="eyebrow mb-3">Light & Dark Modes</h6>
                </div>
                <p className="mb-6">
                  Theme is automatically controlled by the <code>html.light</code> and <code>html.dark</code> classes on the document root.
                  No theme prop is needed. Toggle your theme preference to see the pattern adapt.
                </p>
                <div className="p-4 mb-10" style={{ backgroundColor: 'rgba(114, 119, 126, 0.1)', borderRadius: '8px' }}>
                  <h6 className="mb-3">Theme Colors</h6>
                  <div className="d-flex flex-row gap-6" style={{ flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                      <strong className="d-block mb-2">Light Mode</strong>
                      <ul className="mb-0">
                        <li>Background: White</li>
                        <li>Title/Subtitle: Black (#141414)</li>
                        <li>Description: Gray 500 (#72777e)</li>
                      </ul>
                    </div>
                    <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                      <strong className="d-block mb-2">Dark Mode</strong>
                      <ul className="mb-0">
                        <li>Background: Black (#141414)</li>
                        <li>Title/Subtitle: White</li>
                        <li>Description: Neutral 200 (#e6eaf0)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
        </section>

        {/* Code Examples */}
        <section className="py-26">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="d-flex flex-column-reverse mb-8">
                  <h2 className="h4 mb-0">Code Examples</h2>
                  <h6 className="eyebrow mb-3">Implementation</h6>
                </div>
                <div className="p-6-sm p-10-until-sm br-8 mb-6" style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4' }}>
                  <pre style={{ margin: 0, overflow: 'auto' }}>
                    <code>{`import { HeaderHeroSplitMedia } from 'shared/patterns/HeaderHeroSplitMedia';

// Full content - all props provided
<HeaderHeroSplitMedia
  surface="accent"
  layout="content-left"
  title="Real-world asset tokenization"
  subtitle="Learn how to issue crypto tokens and build tokenization solutions."
  description="XRPL helps fintechs move money fast, globally, at low cost."
  primaryCta={{ label: "Get Started", href: "/docs" }}
  secondaryCta={{ label: "Learn More", href: "/about" }}
  media={{ src: "/img/hero.png", alt: "Hero illustration" }}
/>

// No description - CTAs directly below title
<HeaderHeroSplitMedia
  surface="default"
  layout="content-left"
  title="Build on XRPL"
  subtitle="Start developing today."
  primaryCta={{ label: "Start Building", href: "/docs" }}
  secondaryCta={{ label: "View Tutorials", href: "/tutorials" }}
  media={{ src: "/img/hero.png", alt: "Development" }}
/>

// Primary CTA only (no description, no secondary CTA)
<HeaderHeroSplitMedia
  surface="accent"
  layout="content-left"
  title="Quick Start"
  subtitle="Get up and running in minutes."
  primaryCta={{ label: "Begin", href: "/quickstart" }}
  media={{ src: "/img/quickstart.png", alt: "Quick start" }}
/>

// Primary CTA only with description
<HeaderHeroSplitMedia
  surface="default"
  layout="content-right"
  title="Enterprise Solutions"
  subtitle="Scale your business."
  description="Leverage XRPL for enterprise applications."
  primaryCta={{ label: "Contact Sales", href: "/contact" }}
  media={{ src: "/img/enterprise.png", alt: "Enterprise" }}
/>

// No CTAs - description only
<HeaderHeroSplitMedia
  surface="default"
  layout="content-left"
  title="About XRPL"
  subtitle="The decentralized ledger for everyone."
  description="Learn about the technology powering global payments."
  media={{ src: "/img/about.png", alt: "About XRPL" }}
/>

// Title and subtitle only (minimum required props)
<HeaderHeroSplitMedia
  title="Welcome"
  subtitle="Explore the possibilities."
  media={{ src: "/img/welcome.png", alt: "Welcome" }}
/>`}</code>
                  </pre>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
        </section>

        {/* Component API */}
        <section className="py-26">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="d-flex flex-column-reverse mb-8">
                  <h2 className="h4 mb-0">Component API</h2>
                  <h6 className="eyebrow mb-3">Props Reference</h6>
                </div>
                <div className="mb-10">
                  {/* Header Row */}
                  <div className="d-flex flex-row mb-3 pb-2" style={{ gap: '1rem', borderBottom: '2px solid var(--bs-border-color, #dee2e6)' }}>
                    <div style={{ width: '120px', flexShrink: 0 }}><strong>Prop</strong></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Type</strong></div>
                    <div style={{ width: '100px', flexShrink: 0 }}><strong>Default</strong></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Description</strong></div>
                  </div>

                  {/* surface */}
                  <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                    <div style={{ width: '120px', flexShrink: 0 }}><code>surface</code></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}><code>'default' | 'accent'</code></div>
                    <div style={{ width: '100px', flexShrink: 0 }}><code>'default'</code></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}>Surface variant - accent adds green background on title section</div>
                  </div>

                  {/* layout */}
                  <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                    <div style={{ width: '120px', flexShrink: 0 }}><code>layout</code></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}><code>'content-left' | 'content-right'</code></div>
                    <div style={{ width: '100px', flexShrink: 0 }}><code>'content-left'</code></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}>Controls content position relative to media</div>
                  </div>

                  {/* title */}
                  <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                    <div style={{ width: '120px', flexShrink: 0 }}><code>title</code></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                    <div style={{ width: '100px', flexShrink: 0 }}><em>required</em></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}>Hero title text (display-md typography)</div>
                  </div>

                  {/* subtitle */}
                  <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                    <div style={{ width: '120px', flexShrink: 0 }}><code>subtitle</code></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                    <div style={{ width: '100px', flexShrink: 0 }}><em>required</em></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}>Hero subtitle text (subhead-sm-l typography)</div>
                  </div>

                  {/* description */}
                  <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                    <div style={{ width: '120px', flexShrink: 0 }}><code>description</code></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                    <div style={{ width: '100px', flexShrink: 0 }}><code>undefined</code></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}>Description text below title section (body-l typography)</div>
                  </div>

                  {/* primaryCta */}
                  <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                    <div style={{ width: '120px', flexShrink: 0 }}><code>primaryCta</code></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}><code>{'{ label: string; href: string }'}</code></div>
                    <div style={{ width: '100px', flexShrink: 0 }}><code>undefined</code></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}>Primary CTA button configuration</div>
                  </div>

                  {/* secondaryCta */}
                  <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                    <div style={{ width: '120px', flexShrink: 0 }}><code>secondaryCta</code></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}><code>{'{ label: string; href: string }'}</code></div>
                    <div style={{ width: '100px', flexShrink: 0 }}><code>undefined</code></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}>Secondary/Tertiary CTA button configuration</div>
                  </div>

                  {/* media */}
                  <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                    <div style={{ width: '120px', flexShrink: 0 }}><code>media</code></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}><code>{'{ src: string; alt: string }'}</code></div>
                    <div style={{ width: '100px', flexShrink: 0 }}><em>required</em></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}>Hero media (image) configuration</div>
                  </div>

                  {/* className */}
                  <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                    <div style={{ width: '120px', flexShrink: 0 }}><code>className</code></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                    <div style={{ width: '100px', flexShrink: 0 }}><code>undefined</code></div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}>Additional CSS classes</div>
                  </div>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
        </section>

        {/* Design References */}
        <section className="py-26">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="d-flex flex-column-reverse mb-8">
                  <h2 className="h4 mb-0">Design References</h2>
                  <h6 className="eyebrow mb-3">Figma & Documentation</h6>
                </div>
                <div className="d-flex flex-column gap-3">
                  <div>
                    <strong>Figma Design:</strong>{' '}
                    <a href="https://www.figma.com/design/olsJKEo16jmwaNXpHxCdbN/Header-Hero---Split-Media?node-id=10066-2126&m=dev" target="_blank" rel="noopener noreferrer">
                      Header Hero - Split Media Pattern
                    </a>
                  </div>
                  <div>
                    <strong>Example Usage:</strong>{' '}
                    <a href="https://www.figma.com/design/olsJKEo16jmwaNXpHxCdbN/Header-Hero---Split-Media?node-id=10066-1792&m=dev" target="_blank" rel="noopener noreferrer">
                      Figma - Example Usage
                    </a>
                  </div>
                  <div>
                    <strong>Documentation:</strong>{' '}
                    <code>shared/patterns/HeaderHeroSplitMedia/HeaderHeroSplitMedia.md</code>
                  </div>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
        </section>
      </div>
    </div>
  );
}
