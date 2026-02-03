import { PageGrid, PageGridRow, PageGridCol } from 'shared/components/PageGrid/page-grid';
import { FeatureSingleTopic } from 'shared/patterns/FeatureSingleTopic';

export const frontmatter = {
  seo: {
    title: 'FeatureSingleTopic Pattern Showcase',
    description: 'Interactive showcase of the FeatureSingleTopic pattern with all variants, orientations, and button configurations.',
  },
};

export default function FeatureSingleTopicShowcase() {
  // Placeholder image
  const placeholderImage = '/img/demo-bg.png';

  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="my-5 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Pattern Showcase</h6>
            <h1 className="mb-4">FeatureSingleTopic Pattern</h1>
            <p className="longform">
              A feature section pattern that pairs a title and description with a media element
              in a two-column layout. Supports two variants (default and accentSurface) and
              left/right orientation for flexible content positioning.
            </p>
          </div>
        </section>

        {/* Variant Section */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Variants</h2>
              <p className="mb-4">
                The component supports two variants that control the title section background:
              </p>
              <ul className="mb-6">
                <li><strong>default:</strong> No background on title section</li>
                <li><strong>accentSurface:</strong> Gray background (#E6EAF0) on title section</li>
              </ul>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Default Variant */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Default Variant</strong> - <code>variant="default"</code>
                  <br />
                  <small className="text-muted">No background on title section. Clean, minimal look.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureSingleTopic
            variant="default"
            orientation="left"
            title="Developer Spotlight"
            description="Are you building a peer-to-peer payments solution, integrating stablecoins, or exploring RLUSD on the XRP Ledger?"
            media={{ src: placeholderImage, alt: "Feature illustration" }}
            links={[
              { label: "Get Started", href: "#start" },
              { label: "Learn More", href: "#learn" }
            ]}
          />
        </div>

        {/* AccentSurface Variant */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>AccentSurface Variant</strong> - <code>variant="accentSurface"</code>
                  <br />
                  <small className="text-muted">
                    Gray background (<code>$gray-200</code> / #E6EAF0) on title section.
                  </small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureSingleTopic
            variant="accentSurface"
            orientation="left"
            title="Developer Spotlight"
            description="Are you building a peer-to-peer payments solution, integrating stablecoins, or exploring RLUSD on the XRP Ledger?"
            media={{ src: placeholderImage, alt: "Feature illustration" }}
            links={[
              { label: "Get Started", href: "#start" },
              { label: "Learn More", href: "#learn" }
            ]}
          />
        </div>

        {/* Orientation Section */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Orientation Variants</h2>
              <p className="mb-6">
                Control image/content position with the <code>orientation</code> prop.
                Use alternating orientations for visual variety on pages with multiple sections.
              </p>
              <div className="mb-4 p-3" style={{ backgroundColor: '#f0f3f7', borderRadius: '8px' }}>
                <strong>📱 Responsive Behavior:</strong>
                <ul className="mb-0 mt-2">
                  <li><code>orientation="left"</code>: Image left, content right on desktop; image above content on mobile</li>
                  <li><code>orientation="right"</code>: Image right, content left on desktop; content above image on mobile</li>
                </ul>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Orientation Left */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Orientation Left (Default)</strong> - <code>orientation="left"</code>
                  <br />
                  <small className="text-muted">
                    Desktop: Image left, content right | Mobile: Image above content
                  </small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureSingleTopic
            variant="default"
            orientation="left"
            title="Image on Left"
            description="This layout places the image on the left side and content on the right on desktop screens."
            media={{ src: placeholderImage, alt: "Left orientation" }}
            links={[
              { label: "Primary Action", href: "#primary" },
              { label: "Secondary", href: "#secondary" }
            ]}
          />
        </div>

        {/* Orientation Right */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Orientation Right</strong> - <code>orientation="right"</code>
                  <br />
                  <small className="text-muted">
                    Desktop: Image right, content left | Mobile: Content above image
                  </small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureSingleTopic
            variant="accentSurface"
            orientation="right"
            title="Image on Right"
            description="This layout places the image on the right side and content on the left on desktop screens."
            media={{ src: placeholderImage, alt: "Right orientation" }}
            links={[
              { label: "Primary Action", href: "#primary" },
              { label: "Secondary", href: "#secondary" }
            ]}
          />
        </div>

        {/* Button Behavior Section */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Button Behavior</h2>
              <p className="mb-4">
                The component uses the ButtonGroup pattern which automatically adjusts button rendering based on the number of links provided:
              </p>
              <ul className="mb-6">
                <li><strong>1 link:</strong> Primary button</li>
                <li><strong>2 links:</strong> Primary + Tertiary buttons (responsive layout)</li>
                <li><strong>3+ links:</strong> All Tertiary buttons in block layout</li>
              </ul>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* 1 Link */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>1 Link</strong> - Primary Button
                  <br />
                  <small className="text-muted">Single action rendered as a primary (filled) button.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureSingleTopic
            variant="default"
            orientation="left"
            title="Single Action"
            description="This example shows a single call-to-action button."
            media={{ src: placeholderImage, alt: "Single button" }}
            links={[
              { label: "Get Started", href: "#start" }
            ]}
          />
        </div>

        {/* 2 Links */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>2 Links</strong> - Primary + Tertiary Side by Side
                  <br />
                  <small className="text-muted">Primary and tertiary buttons displayed side by side on desktop.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureSingleTopic
            variant="default"
            orientation="left"
            title="Two Actions"
            description="This example shows primary and tertiary buttons side by side."
            media={{ src: placeholderImage, alt: "Two buttons" }}
            links={[
              { label: "Primary Link", href: "#primary" },
              { label: "Tertiary Link", href: "#tertiary" }
            ]}
          />
        </div>

        {/* 3 Links */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>3 Links</strong> - Primary + Tertiary + Secondary
                  <br />
                  <small className="text-muted">Primary + tertiary side by side on first row, secondary button below.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureSingleTopic
            variant="default"
            orientation="left"
            title="Three Actions"
            description="This example shows the 3-link layout with secondary button."
            media={{ src: placeholderImage, alt: "Three buttons" }}
            links={[
              { label: "Primary Link", href: "#primary" },
              { label: "Tertiary Link", href: "#tertiary" },
              { label: "Secondary Link", href: "#secondary" }
            ]}
          />
        </div>

        {/* 5 Links */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>5 Links</strong> - Primary + Tertiary + Stacked Tertiary
                  <br />
                  <small className="text-muted">Primary + tertiary side by side on first row, remaining tertiary buttons stacked below.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <FeatureSingleTopic
            variant="accentSurface"
            orientation="left"
            title="Multiple Actions"
            description="This example shows the 5-link layout with stacked tertiary buttons."
            media={{ src: placeholderImage, alt: "Multiple buttons" }}
            links={[
              { label: "Primary Link", href: "#primary" },
              { label: "Tertiary Link", href: "#tertiary" },
              { label: "Tertiary Link", href: "#link3" },
              { label: "Tertiary Link", href: "#link4" },
              { label: "Tertiary Link", href: "#link5" }
            ]}
          />
        </div>



        {/* Alternating Pattern Example */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Alternating Pattern</h2>
              <p className="mb-6">
                Use alternating orientations and variants to create visual rhythm on feature-heavy pages.
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <FeatureSingleTopic
          variant="default"
          orientation="left"
          title="First Feature"
          description="Banks, asset managers, PSPs, and fintechs use XRPL to build financial products."
          links={[{ label: "Learn More", href: "#learn" }]}
          media={{ src: placeholderImage, alt: "First feature" }}
        />

        <FeatureSingleTopic
          variant="accentSurface"
          orientation="right"
          title="Second Feature"
          description="Build powerful applications on XRPL with comprehensive documentation and tools."
          links={[
            { label: "Get Started", href: "#start" },
            { label: "Documentation", href: "#docs" }
          ]}
          media={{ src: placeholderImage, alt: "Second feature" }}
        />

        <FeatureSingleTopic
          variant="default"
          orientation="left"
          title="Third Feature"
          description="Scale your business with blockchain technology and enterprise-grade solutions."
          links={[
            { label: "Contact Sales", href: "#contact" },
            { label: "View Plans", href: "#plans" }
          ]}
          media={{ src: placeholderImage, alt: "Third feature" }}
        />

        {/* Design References */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Design References</h2>
              <div className="d-flex flex-column gap-3">
                <div>
                  <strong>Figma Design (Default):</strong>{' '}
                  <a href="https://www.figma.com/design/sg6T5EptbN0V2olfCSHzcx/Section-Feature---Single-Topic?node-id=18030-2250&m=dev" target="_blank" rel="noopener noreferrer">
                    Section Feature - Single Topic (Default Variant)
                  </a>
                </div>
                <div>
                  <strong>Figma Design (AccentSurface):</strong>{' '}
                  <a href="https://www.figma.com/design/sg6T5EptbN0V2olfCSHzcx/Section-Feature---Single-Topic?node-id=18030-2251&m=dev" target="_blank" rel="noopener noreferrer">
                    Section Feature - Single Topic (AccentSurface Variant)
                  </a>
                </div>
                <div>
                  <strong>Component Location:</strong>{' '}
                  <code>shared/patterns/FeatureSingleTopic/</code>
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

