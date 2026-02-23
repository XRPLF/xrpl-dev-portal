import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";
import { CarouselFeatured, type CarouselSlide, type CarouselFeatureItem } from "shared/patterns/CarouselFeatured";
import { Divider } from "shared/components/Divider";

export const frontmatter = {
  seo: {
    title: 'CarouselFeatured Pattern Showcase',
    description: "A comprehensive showcase of the CarouselFeatured pattern component demonstrating featured image carousels with navigation, background variants, and responsive behavior in the XRPL.org Design System.",
  }
};

// Sample image URL for demonstration
const SAMPLE_IMAGE = "/img/demo-bg.png";

// Sample slides data
const sampleSlides: CarouselSlide[] = [
  {
    id: 1,
    imageSrc: SAMPLE_IMAGE,
    imageAlt: "Featured slide 1 - XRPL Overview",
  },
  {
    id: 2,
    imageSrc: SAMPLE_IMAGE,
    imageAlt: "Featured slide 2 - Developer Tools",
  },
  {
    id: 3,
    imageSrc: SAMPLE_IMAGE,
    imageAlt: "Featured slide 3 - Enterprise Solutions",
  },
];

// Sample features data (matching Figma design)
const sampleFeatures: CarouselFeatureItem[] = [
  {
    title: "Easy-to-Integrate APIs",
    description: "Build with common languages and skip complex smart contract development",
  },
  {
    title: "Full Lifecycle Support",
    description: "From dev tools and testnets to deployment and growth-stage",
  },
  {
    title: "Enterprise-Grade Security",
    description: "Battle-tested infrastructure with 12+ years of continuous uptime",
  },
];

export default function CarouselFeaturedShowcase() {
  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-26 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Pattern Showcase</h6>
            <h1 className="mb-4">CarouselFeatured Pattern</h1>
            <p className="longform">
              A featured image carousel with two-column layout on desktop (image left, content right)
              and single-column layout on tablet/mobile (content top, image bottom).
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
                    <li>Two-column layout on desktop</li>
                    <li>Image left, content right</li>
                    <li>Feature list with dividers</li>
                    <li>Primary + tertiary buttons</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Background Colors</h6>
                  <ul className="mb-0">
                    <li><code>gray-200</code> (#E6EAF0) - default</li>
                    <li><code>gray-300</code> (#CAD4DF) - neutral</li>
                    <li><code>black</code> (#141414) - dark</li>
                    <li><code>yellow-100</code> (#F3F1EB) - warm</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Content</h6>
                  <ul className="mb-0">
                    <li>Heading (h-md typography)</li>
                    <li>Feature list items</li>
                    <li>Primary button (black pill)</li>
                    <li>Tertiary link (optional)</li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <h6 className="mb-3">Responsive</h6>
                  <ul className="mb-0">
                    <li><strong>Mobile:</strong> Single column, content top</li>
                    <li><strong>Tablet:</strong> Single column, content top</li>
                    <li><strong>Desktop:</strong> Two columns, image left</li>
                  </ul>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <Divider weight="strong" color="gray" />

        {/* Default: gray-200 background */}
        <section className="py-10">
          <PageGrid className="mb-6">
            <PageGridRow>
              <PageGridCol span={12}>
                <h2 className="h4 mb-3">Grey Background</h2>
                <p className="mb-0">
                  <code>background="grey"</code> - Light neutral background, the default option.
                  Light mode: gray-200 (#E6EAF0), Dark mode: gray-300 (#CAD4DF).
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CarouselFeatured
            background="grey"
            heading="Powered by Developers"
            features={sampleFeatures}
            buttons={[
              { label: "Get Started", href: "#get-started" },
              { label: "Learn More", href: "#learn-more" }
            ]}
            slides={sampleSlides.slice(0,1)}
          />
        </section>

        <Divider weight="strong" color="gray" />

        {/* neutral background */}
        <section className="py-10">
          <PageGrid className="mb-6">
            <PageGridRow>
              <PageGridCol span={12}>
                <h2 className="h4 mb-3">Neutral Background</h2>
                <p className="mb-0">
                  <code>background="neutral"</code> - High contrast neutral background.
                  Light mode: white (#FFF), Dark mode: black (#141414).
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CarouselFeatured
            background="neutral"
            heading="Platform Updates"
            features={sampleFeatures}
            buttons={[
              { label: "View Updates", href: "#updates" },
              { label: "See All", href: "#all" }
            ]}
            slides={sampleSlides}
          />
        </section>

        <Divider weight="strong" color="gray" />

        {/* yellow background */}
        <section className="py-10">
          <PageGrid className="mb-6">
            <PageGridRow>
              <PageGridCol span={12}>
                <h2 className="h4 mb-3">Yellow Background</h2>
                <p className="mb-0">
                  <code>background="yellow"</code> - Warm secondary background color.
                  Same in both modes: yellow-100 (#F3F1EB).
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CarouselFeatured
            background="yellow"
            heading="Community Highlights"
            features={sampleFeatures}
            buttons={[
              { label: "Join Community", href: "#community" },
              { label: "Learn More", href: "#learn" }
            ]}
            slides={sampleSlides}
          />
        </section>

        <Divider weight="strong" color="gray" />

        {/* Single button example */}
        <section className="py-10">
          <PageGrid className="mb-6">
            <PageGridRow>
              <PageGridCol span={12}>
                <h2 className="h4 mb-3">Single Button (Same Line on Mobile)</h2>
                <p className="mb-0">
                  When only one button is provided, the button and carousel navigation
                  stay on the same line on mobile instead of stacking.
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <CarouselFeatured
            background="grey"
            heading="Single Button Example"
            features={sampleFeatures}
            buttons={[
              { label: "Get Started", href: "#get-started" }
            ]}
            slides={sampleSlides}
          />
        </section>

        <Divider weight="strong" color="gray" />

        {/* API Reference */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Component API</h2>

              <h5 className="mb-4">CarouselFeaturedProps</h5>
              <div className="mb-8">
                <div className="d-flex flex-row mb-3 pb-2" style={{ gap: '1rem', borderBottom: '2px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><strong>Prop</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Type</strong></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><strong>Default</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Description</strong></div>
                </div>

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>heading</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>required</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Section heading text</div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>features</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>CarouselFeatureItem[]</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>required</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Array of feature items with title and description</div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>buttons</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>ButtonConfig[]</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>optional</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Array of button configurations (1-2 buttons supported, uses ButtonGroup)</div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>slides</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>CarouselSlide[]</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>required</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Array of slide configurations</div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>background</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>'grey' | 'neutral' | 'yellow'</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>'grey'</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Background color variant (adapts to light/dark mode)</div>
                </div>
              </div>

              <h5 className="mb-4">CarouselSlide</h5>
              <div className="mb-6">
                <div className="d-flex flex-row mb-3 pb-2" style={{ gap: '1rem', borderBottom: '2px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><strong>Prop</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Type</strong></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><strong>Required</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Description</strong></div>
                </div>

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>id</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string | number</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>Yes</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Unique identifier for the slide</div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>imageSrc</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>Yes</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Image source URL</div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>imageAlt</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>Yes</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Alt text for the image</div>
                </div>
              </div>

              <h5 className="mb-4">CarouselFeatureItem</h5>
              <div className="mb-6">
                <div className="d-flex flex-row mb-3 pb-2" style={{ gap: '1rem', borderBottom: '2px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><strong>Prop</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Type</strong></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><strong>Required</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Description</strong></div>
                </div>

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>title</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>Yes</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Feature title text</div>
                </div>
                <Divider weight="thin" color="gray" />

                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>description</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}>Yes</div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Feature description text</div>
                </div>
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
                  <strong>Figma:</strong>{' '}
                  <a href="https://www.figma.com/design/OO2UYKTmDZ7PJIekfaCGAg/Section-Carousel---Feature-Image?node-id=19075-4106" target="_blank" rel="noopener noreferrer">
                    Section Carousel - Feature Image
                  </a>
                </div>
                <div>
                  <strong>Component Location:</strong>{' '}
                  <code>shared/patterns/CarouselFeatured/</code>
                </div>
                <div>
                  <strong>Shared Button Component:</strong>{' '}
                  <code>shared/components/CarouselButton/</code>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </div>
    </div>
  );
}

