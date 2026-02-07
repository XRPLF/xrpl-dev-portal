import * as React from "react";
import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";
import { TileLink } from "shared/patterns/TileLinks";
import { Divider } from "shared/components/Divider";

export const frontmatter = {
  seo: {
    title: 'TileLink Component Showcase',
    description: "A comprehensive showcase of all TileLink component variants, states, and responsive behavior in the XRPL.org Design System.",
  }
};

export default function TileLinkShowcase() {
  const handleClick = (message: string) => {
    console.log(`TileLink clicked: ${message}`);
  };

  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-26 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Component Showcase</h6>
            <h1 className="mb-4">TileLink Component</h1>
            <p className="longform">
              A clickable tile component for link grids, featuring text content with an arrow icon.
              Supports gray and lilac color variants with full light/dark mode theming.
            </p>
          </div>
        </section>

        <Divider color="gray" />

        {/* Gray Variant Section */}
        <section className="container-new py-10">
          <div className="d-flex flex-column-reverse">
            <h2 className="h4 mb-8">Gray Variant</h2>
            <h6 className="eyebrow mb-3">Color Variants</h6>
          </div>
          <p className="mb-6 text-muted">
            The gray variant uses neutral gray tones. In light mode, it displays with gray-200 background.
            In dark mode, it uses gray-500 with white text.
          </p>
        </section>

        <PageGrid>
          <PageGridRow>
            <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
              <TileLink
                variant="gray"
                label="Documentation"
                href="/docs"
              />
            </PageGridCol>
            <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
              <TileLink
                variant="gray"
                label="Get Started"
                href="/get-started"
              />
            </PageGridCol>
            <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
              <TileLink
                variant="gray"
                label="Tutorials"
                onClick={() => handleClick('Tutorials')}
              />
            </PageGridCol>
            <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
              <TileLink
                variant="gray"
                label="API Reference"
                href="/api"
              />
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
        

        <Divider variant="gray" />

        {/* Lilac Variant Section */}
        <section className="container-new py-26">
          <div className="d-flex flex-column-reverse">
            <h2 className="h4 mb-8">Lilac Variant</h2>
            <h6 className="eyebrow mb-3">Color Variants</h6>
          </div>
          <p className="mb-6 text-muted">
            The lilac variant uses purple/lilac tones. In light mode, it displays with lilac-300 background.
            In dark mode, it uses lilac-400 with white text.
          </p>

          <PageGrid>
            <PageGridRow>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink
                  variant="lilac"
                  label="Community"
                  href="/community"
                />
              </PageGridCol>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink
                  variant="lilac"
                  label="Events"
                  href="/events"
                />
              </PageGridCol>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink
                  variant="lilac"
                  label="Blog"
                  onClick={() => handleClick('Blog')}
                />
              </PageGridCol>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink
                  variant="lilac"
                  label="Newsletter"
                  href="/newsletter"
                />
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
        </section>

        <Divider variant="gray" />

        {/* Mixed Variants Section */}
        <section className="container-new py-26">
          <div className="d-flex flex-column-reverse">
            <h2 className="h4 mb-8">Mixed Variants</h2>
            <h6 className="eyebrow mb-3">Combinations</h6>
          </div>
          <p className="mb-6 text-muted">
            Gray and lilac variants can be mixed in the same grid for visual variety.
          </p>

          <PageGrid>
            <PageGridRow>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink
                  variant="gray"
                  label="Introduction"
                  href="/intro"
                />
              </PageGridCol>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink
                  variant="lilac"
                  label="Quick Start"
                  href="/quick-start"
                />
              </PageGridCol>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink
                  variant="gray"
                  label="Concepts"
                  href="/concepts"
                />
              </PageGridCol>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink
                  variant="lilac"
                  label="Advanced Topics"
                  href="/advanced"
                />
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
        </section>

        <Divider variant="gray" />

        {/* Interactive States Section */}
        <section className="container-new py-26">
          <div className="d-flex flex-column-reverse">
            <h2 className="h4 mb-8">Interactive States</h2>
            <h6 className="eyebrow mb-3">States</h6>
          </div>
          <p className="mb-6 text-muted">
            TileLink supports multiple interaction states: default, hover, focus, pressed, and disabled.
            Hover over the tiles to see the window shade animation.
          </p>

          <div className="mb-8">
            <h6 className="mb-4">Gray Variant States</h6>
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                  <div className="mb-2">
                    <small className="text-muted">Default / Hover / Pressed</small>
                  </div>
                  <TileLink
                    variant="gray"
                    label="Interactive Link"
                    href="/link"
                  />
                </PageGridCol>
                <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                  <div className="mb-2">
                    <small className="text-muted">Button with onClick</small>
                  </div>
                  <TileLink
                    variant="gray"
                    label="Click Handler"
                    onClick={() => handleClick('Gray button clicked')}
                  />
                </PageGridCol>
                <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                  <div className="mb-2">
                    <small className="text-muted">Disabled State</small>
                  </div>
                  <TileLink
                    variant="gray"
                    label="Coming Soon"
                    disabled
                  />
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
          </div>

          <div className="mb-8">
            <h6 className="mb-4">Lilac Variant States</h6>
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                  <div className="mb-2">
                    <small className="text-muted">Default / Hover / Pressed</small>
                  </div>
                  <TileLink
                    variant="lilac"
                    label="Interactive Link"
                    href="/link"
                  />
                </PageGridCol>
                <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                  <div className="mb-2">
                    <small className="text-muted">Button with onClick</small>
                  </div>
                  <TileLink
                    variant="lilac"
                    label="Click Handler"
                    onClick={() => handleClick('Lilac button clicked')}
                  />
                </PageGridCol>
                <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                  <div className="mb-2">
                    <small className="text-muted">Disabled State</small>
                  </div>
                  <TileLink
                    variant="lilac"
                    label="Coming Soon"
                    disabled
                  />
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
          </div>
        </section>

        <Divider variant="gray" />

        {/* Responsive Behavior Section */}
        <section className="container-new py-26">
          <div className="d-flex flex-column-reverse">
            <h2 className="h4 mb-8">Responsive Behavior</h2>
            <h6 className="eyebrow mb-3">Layout</h6>
          </div>
          <p className="mb-6 text-muted">
            TileLink adapts to different screen sizes. Resize your browser to see the responsive behavior:
          </p>
          <ul className="mb-6 text-muted">
            <li><strong>Mobile (&lt; 576px):</strong> 1 column, 80px height, 12px padding, 16px font</li>
            <li><strong>Tablet (576px - 991px):</strong> 2 columns, 88px height, 16px padding, 16px font</li>
            <li><strong>Desktop (≥ 992px):</strong> 4 columns, 96px height, 20px padding, 18px font</li>
          </ul>

          <PageGrid>
            <PageGridRow>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink variant="gray" label="Responsive Tile 1" href="#1" />
              </PageGridCol>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink variant="lilac" label="Responsive Tile 2" href="#2" />
              </PageGridCol>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink variant="gray" label="Responsive Tile 3" href="#3" />
              </PageGridCol>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink variant="lilac" label="Responsive Tile 4" href="#4" />
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
        </section>

        <Divider variant="gray" />

        {/* Large Grid Example */}
        <section className="container-new py-26">
          <div className="d-flex flex-column-reverse">
            <h2 className="h4 mb-8">Large Grid Example</h2>
            <h6 className="eyebrow mb-3">Real-World Usage</h6>
          </div>
          <p className="mb-6 text-muted">
            Example of a larger grid with multiple rows, demonstrating how TileLink works in a typical section layout.
          </p>

          <PageGrid>
            <PageGridRow>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink variant="gray" label="Getting Started" href="/start" />
              </PageGridCol>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink variant="lilac" label="Core Concepts" href="/concepts" />
              </PageGridCol>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink variant="gray" label="Tutorials" href="/tutorials" />
              </PageGridCol>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink variant="lilac" label="API Reference" href="/api" />
              </PageGridCol>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink variant="gray" label="Examples" href="/examples" />
              </PageGridCol>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink variant="lilac" label="Best Practices" href="/best-practices" />
              </PageGridCol>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink variant="gray" label="Tools" href="/tools" />
              </PageGridCol>
              <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
                <TileLink variant="lilac" label="Resources" href="/resources" />
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
        </section>

        <Divider variant="gray" />

        {/* Code Examples Section */}
        <section className="container-new py-26">
          <div className="d-flex flex-column-reverse">
            <h2 className="h4 mb-8">Code Examples</h2>
            <h6 className="eyebrow mb-3">Implementation</h6>
          </div>

          <div className="mb-8">
            <h6 className="mb-4">Basic Usage</h6>
            <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4' }}>
              <pre style={{ margin: 0, overflow: 'auto' }}>
                <code>{`import { TileLink } from 'shared/patterns/TileLinks';

// Gray variant with link
<TileLink
  variant="gray"
  label="Documentation"
  href="/docs"
/>

// Lilac variant with click handler
<TileLink
  variant="lilac"
  label="Get Started"
  onClick={() => navigate('/start')}
/>

// Disabled state
<TileLink
  variant="gray"
  label="Coming Soon"
  disabled
/>`}</code>
              </pre>
            </div>
          </div>

          <div className="mb-8">
            <h6 className="mb-4">Grid Layout with PageGrid</h6>
            <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4' }}>
              <pre style={{ margin: 0, overflow: 'auto' }}>
                <code>{`import { PageGrid, PageGridRow, PageGridCol } from 'shared/components/PageGrid/page-grid';
import { TileLink } from 'shared/patterns/TileLinks';

<PageGrid>
  <PageGrid.Row>
    {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
    <PageGrid.Col span={{ base: 4, md: 4, lg: 3 }}>
      <TileLink variant="gray" label="Link 1" href="/link1" />
    </PageGrid.Col>
    <PageGrid.Col span={{ base: 4, md: 4, lg: 3 }}>
      <TileLink variant="lilac" label="Link 2" href="/link2" />
    </PageGrid.Col>
    <PageGrid.Col span={{ base: 4, md: 4, lg: 3 }}>
      <TileLink variant="gray" label="Link 3" href="/link3" />
    </PageGrid.Col>
    <PageGrid.Col span={{ base: 4, md: 4, lg: 3 }}>
      <TileLink variant="lilac" label="Link 4" href="/link4" />
    </PageGrid.Col>
  </PageGrid.Row>
</PageGrid>`}</code>
              </pre>
            </div>
          </div>

          <div className="mb-8">
            <h6 className="mb-4">Props API</h6>
            <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4' }}>
              <pre style={{ margin: 0, overflow: 'auto' }}>
                <code>{`interface TileLinkProps {
  /** Color variant: 'gray' (default) or 'lilac' */
  variant?: 'gray' | 'lilac';

  /** Link text/label */
  label: string;

  /** Link destination - renders as <a> */
  href?: string;

  /** Click handler - renders as <button> */
  onClick?: () => void;

  /** Disabled state - prevents interaction */
  disabled?: boolean;

  /** Additional CSS classes */
  className?: string;
}`}</code>
              </pre>
            </div>
          </div>
        </section>

        <Divider variant="gray" />

        {/* Features Section */}
        <section className="container-new py-26">
          <div className="d-flex flex-column-reverse">
            <h2 className="h4 mb-8">Features</h2>
            <h6 className="eyebrow mb-3">Component Capabilities</h6>
          </div>

          <div className="row">
            <div className="col-md-6 mb-6">
              <h6 className="mb-3">🎨 Color Variants</h6>
              <ul className="text-muted">
                <li>Gray variant with neutral tones</li>
                <li>Lilac variant with purple/lilac tones</li>
                <li>Full light and dark mode support</li>
              </ul>
            </div>

            <div className="col-md-6 mb-6">
              <h6 className="mb-3">✨ Animations</h6>
              <ul className="text-muted">
                <li>Window shade hover effect (bottom-to-top)</li>
                <li>Arrow animation on hover</li>
                <li>Smooth transitions (200ms cubic-bezier)</li>
              </ul>
            </div>

            <div className="col-md-6 mb-6">
              <h6 className="mb-3">📱 Responsive Design</h6>
              <ul className="text-muted">
                <li>Mobile: 80px height, 12px padding</li>
                <li>Tablet: 88px height, 16px padding</li>
                <li>Desktop: 96px height, 20px padding</li>
              </ul>
            </div>

            <div className="col-md-6 mb-6">
              <h6 className="mb-3">♿ Accessibility</h6>
              <ul className="text-muted">
                <li>Proper ARIA labels and roles</li>
                <li>Keyboard navigation support</li>
                <li>Focus states with visible outlines</li>
                <li>Disabled state handling</li>
              </ul>
            </div>

            <div className="col-md-6 mb-6">
              <h6 className="mb-3">🔗 Flexible Rendering</h6>
              <ul className="text-muted">
                <li>Renders as &lt;a&gt; tag when href is provided</li>
                <li>Renders as &lt;button&gt; for onClick handlers</li>
                <li>Supports disabled state for both</li>
              </ul>
            </div>

            <div className="col-md-6 mb-6">
              <h6 className="mb-3">🎯 Grid Integration</h6>
              <ul className="text-muted">
                <li>Designed to work with PageGrid system</li>
                <li>Responsive column spans</li>
                <li>Consistent 8px gap between tiles</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


