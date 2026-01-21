import { PageGrid, PageGridRow, PageGridCol } from 'shared/components/PageGrid/page-grid';
import { FeatureTwoColumn } from 'shared/patterns/FeatureTwoColumn';

export const frontmatter = {
  seo: {
    title: 'FeatureTwoColumn Pattern Showcase',
    description: 'Interactive showcase of the FeatureTwoColumn pattern with all color variants, arrangements, and button configurations.',
  },
};

export default function FeatureTwoColumnShowcase() {
  // Placeholder image
  const placeholderImage = '/img/demo-bg.png';

  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="my-5 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Pattern Showcase</h6>
            <h1 className="mb-4">FeatureTwoColumn Pattern</h1>
            <p className="longform">
              A feature section pattern that pairs editorial content with a media element
              in a two-column layout. Supports four color themes, left/right arrangements,
              and automatic button configuration based on link count.
            </p>
          </div>
        </section>

        {/* Button Behavior Section */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Button Behavior</h2>
              <p className="mb-4">
                The component automatically adjusts button rendering based on the number of links provided:
              </p>
              <ul className="mb-6">
                <li><strong>1 link:</strong> Secondary button</li>
                <li><strong>2 links:</strong> Primary + Tertiary buttons</li>
                <li><strong>3-5 links:</strong> Primary + Tertiary (row), Secondary, then remaining Tertiary links</li>
              </ul>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* 1 Link - Secondary Button */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>1 Link</strong> - Secondary Button
                  <br />
                  <small className="text-muted">Single action rendered as a secondary (outline) button.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureTwoColumn
            color="lilac"
            arrange="left"
            title="Institutions"
            description="Banks, asset managers, PSPs, and fintechs use XRPL to build financial products and DeFi solutions efficiently and with more flexibility."
            links={[
              { label: "Secondary Link", href: "#link1" }
            ]}
            media={{ src: placeholderImage, alt: "Feature illustration" }}
          />
        </div>

        {/* 2 Links - Primary + Tertiary */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>2 Links</strong> - Primary + Tertiary Buttons
                  <br />
                  <small className="text-muted">Primary action with a secondary tertiary link.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureTwoColumn
            color="neutral"
            arrange="left"
            title="Institutions"
            description="Banks, asset managers, PSPs, and fintechs use XRPL to build financial products and DeFi solutions efficiently and with more flexibility."
            links={[
              { label: "Primary Link", href: "#link1" },
              { label: "Tertiary Link", href: "#link2" }
            ]}
            media={{ src: placeholderImage, alt: "Feature illustration" }}
          />
        </div>

        {/* 5 Links - Multiple Tertiary */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>5 Links</strong> - Multiple Links Configuration
                  <br />
                  <small className="text-muted">Primary + Tertiary in first row, Secondary below, remaining as Tertiary list.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureTwoColumn
            color="neutral"
            arrange="left"
            title="Institutions"
            description="Banks, asset managers, PSPs, and fintechs use XRPL to build financial products and DeFi solutions efficiently and with more flexibility."
            links={[
              { label: "Primary Link", href: "#link1" },
              { label: "Tertiary Link", href: "#link2" },
              { label: "Secondary Link", href: "#link3" },
              { label: "Tertiary Link", href: "#link4" },
              { label: "Tertiary Link", href: "#link5" }
            ]}
            media={{ src: placeholderImage, alt: "Feature illustration" }}
          />
        </div>

        {/* Color Variants Section */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Color Variants</h2>
              <p className="mb-6">
                Four color themes available: neutral, lilac, yellow, and green.
                Each adapts automatically for light and dark modes.
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Neutral Variant */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Neutral</strong> - <code>color="neutral"</code>
                  <br />
                  <small className="text-muted">
                    Light: <code>$gray-100</code> (#F0F3F7) | Dark: <code>$gray-200</code> (#E6EAF0)
                    <br />
                    From <code>styles/_colors.scss</code>
                  </small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureTwoColumn
            color="neutral"
            arrange="left"
            title="Institutions"
            description="Banks, asset managers, PSPs, and fintechs use XRPL to build financial products and DeFi solutions efficiently and with more flexibility."
            links={[
              { label: "Get Started", href: "#start" },
              { label: "Learn More", href: "#learn" }
            ]}
            media={{ src: placeholderImage, alt: "Neutral theme" }}
          />
        </div>

        {/* Lilac Variant */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Lilac</strong> - <code>color="lilac"</code>
                  <br />
                  <small className="text-muted">
                    Light: <code>$lilac-200</code> (#D9CAFF) | Dark: <code>$lilac-200</code> (#D9CAFF)
                    <br />
                    From <code>styles/_colors.scss</code>
                  </small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureTwoColumn
            color="lilac"
            arrange="left"
            title="Institutions"
            description="Banks, asset managers, PSPs, and fintechs use XRPL to build financial products and DeFi solutions efficiently and with more flexibility."
            links={[
              { label: "Get Started", href: "#start" },
              { label: "Learn More", href: "#learn" }
            ]}
            media={{ src: placeholderImage, alt: "Lilac theme" }}
          />
        </div>

        {/* Yellow Variant */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Yellow</strong> - <code>color="yellow"</code>
                  <br />
                  <small className="text-muted">
                    Light: <code>$yellow-100</code> (#F3F1EB) | Dark: <code>$yellow-100</code> (#F3F1EB)
                    <br />
                    From <code>styles/_colors.scss</code>
                  </small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureTwoColumn
            color="yellow"
            arrange="left"
            title="Institutions"
            description="Banks, asset managers, PSPs, and fintechs use XRPL to build financial products and DeFi solutions efficiently and with more flexibility."
            links={[
              { label: "Get Started", href: "#start" },
              { label: "Learn More", href: "#learn" }
            ]}
            media={{ src: placeholderImage, alt: "Yellow theme" }}
          />
        </div>

        {/* Green Variant */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Green</strong> - <code>color="green"</code>
                  <br />
                  <small className="text-muted">
                    Light: <code>$green-300</code> (#21E46B) | Dark: <code>$green-300</code> (#21E46B)
                    <br />
                    From <code>styles/_colors.scss</code>
                  </small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureTwoColumn
            color="green"
            arrange="left"
            title="Institutions"
            description="Banks, asset managers, PSPs, and fintechs use XRPL to build financial products and DeFi solutions efficiently and with more flexibility."
            links={[
              { label: "Get Started", href: "#start" },
              { label: "Learn More", href: "#learn" }
            ]}
            media={{ src: placeholderImage, alt: "Green theme" }}
          />
        </div>

        {/* Arrangement Section */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Arrangement Variants</h2>
              <p className="mb-6">
                Control content position with the <code>arrange</code> prop.
                Use alternating arrangements for visual variety on pages with multiple sections.
              </p>
              <div className="mb-4 p-3" style={{ backgroundColor: '#f0f3f7', borderRadius: '8px' }}>
                <strong>📱 Responsive Behavior:</strong>
                <ul className="mb-0 mt-2">
                  <li><code>arrange="left"</code>: Content above media on mobile/tablet, content left on desktop</li>
                  <li><code>arrange="right"</code>: Media above content on mobile/tablet, content right on desktop</li>
                </ul>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Arrange Left */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Arrange Left (Default)</strong> - <code>arrange="left"</code>
                  <br />
                  <small className="text-muted">
                    Desktop: Content left, media right | Mobile/Tablet: Content above media
                  </small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureTwoColumn
            color="lilac"
            arrange="left"
            title="Content Left"
            description="This content appears on the left side of the layout on desktop, and above the media on mobile/tablet. This is the default arrangement."
            links={[
              { label: "Primary", href: "#primary" },
              { label: "Learn More", href: "#secondary" }
            ]}
            media={{ src: placeholderImage, alt: "Left arrangement" }}
          />
        </div>

        {/* Arrange Right */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Arrange Right</strong> - <code>arrange="right"</code>
                  <br />
                  <small className="text-muted">
                    Desktop: Content right, media left | Mobile/Tablet: Media above content
                  </small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureTwoColumn
            color="yellow"
            arrange="right"
            title="Content Right"
            description="This content appears on the right side on desktop, and below the media on mobile/tablet. The media-first approach works well for visual hierarchy."
            links={[
              { label: "Primary", href: "#primary" },
              { label: "Learn More", href: "#secondary" }
            ]}
            media={{ src: placeholderImage, alt: "Right arrangement" }}
          />
        </div>

        {/* Alternating Pattern Example */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Alternating Pattern</h2>
              <p className="mb-6">
                Use alternating arrangements and colors to create visual rhythm on feature-heavy pages.
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <FeatureTwoColumn
          color="neutral"
          arrange="left"
          title="First Feature"
          description="Banks, asset managers, PSPs, and fintechs use XRPL to build financial products."
          links={[{ label: "Learn More", href: "#learn" }]}
          media={{ src: placeholderImage, alt: "First feature" }}
        />

        <FeatureTwoColumn
          color="lilac"
          arrange="right"
          title="Second Feature"
          description="Build powerful applications on XRPL with comprehensive documentation and tools."
          links={[
            { label: "Get Started", href: "#start" },
            { label: "Documentation", href: "#docs" }
          ]}
          media={{ src: placeholderImage, alt: "Second feature" }}
        />

        <FeatureTwoColumn
          color="yellow"
          arrange="left"
          title="Third Feature"
          description="Scale your business with blockchain technology and enterprise-grade solutions."
          links={[
            { label: "Contact Sales", href: "#contact" },
            { label: "View Plans", href: "#plans" }
          ]}
          media={{ src: placeholderImage, alt: "Third feature" }}
        />

        <FeatureTwoColumn
          color="green"
          arrange="right"
          title="Fourth Feature"
          description="Join thousands of developers building the future of finance on XRPL."
          links={[
            { label: "Start Building", href: "#build" },
            { label: "Tutorials", href: "#tutorials" },
            { label: "API Reference", href: "#api" }
          ]}
          media={{ src: placeholderImage, alt: "Fourth feature" }}
        />

        {/* Design References */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Design References</h2>
              <div className="d-flex flex-column gap-3">
                <div>
                  <strong>Figma Design:</strong>{' '}
                  <a href="https://www.figma.com/design/3tmqxMrEvOVvpYhgOCxv2D/Pattern-Feature---Two-Column?node-id=20017-3501&m=dev" target="_blank" rel="noopener noreferrer">
                    Pattern - Feature - Two Column (Figma)
                  </a>
                </div>
                <div>
                  <strong>Component Location:</strong>{' '}
                  <code>shared/patterns/FeatureTwoColumn/</code>
                </div>
                <div>
                  <strong>Color Tokens:</strong>{' '}
                  <code>styles/_colors.scss</code>
                </div>
                <div>
                  <strong>Typography:</strong>{' '}
                  <code>styles/_font.scss</code>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </div>
    </div>
  );
}

