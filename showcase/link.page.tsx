import * as React from "react";
import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";
import { BdsLink } from "shared/components/Link/Link";

export const frontmatter = {
  seo: {
    title: 'Link Component Showcase',
    description: "A comprehensive showcase of all Link component variants, sizes, and states in the XRPL.org Design System.",
  }
};

export default function LinkShowcase() {
  return (
    <div className="landing">
      <div className="overflow-hidden">
        <section className="py-26 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Component Showcase</h6>
            <h1 className="mb-4">Link Component</h1>
            <p className="longform">
              A comprehensive showcase of all Link component variants, sizes, and states.
            </p>
          </div>
        </section>

        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Size by Variant Matrix</h2>
              <div className="mb-10">
                {/* Header Row */}
                <div className="d-flex flex-row mb-4" style={{ gap: '2rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}>
                    <h6 className="mb-0">Size</h6>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <h6 className="mb-0">Internal Links</h6>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <h6 className="mb-0">External Links</h6>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <h6 className="mb-0">Disabled State</h6>
                  </div>
                </div>
                {/* Small Row */}
                <div className="d-flex flex-row mb-5 align-items-center" style={{ gap: '2rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}>
                    <strong>Small</strong>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <BdsLink href="/docs" variant="internal" size="small">
                      Small Internal Link
                    </BdsLink>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <BdsLink href="https://example.com" variant="external" size="small" target="_blank" rel="noopener noreferrer">
                      Small External Link
                    </BdsLink>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <BdsLink href="#" variant="internal" size="small" disabled>
                      Disabled Internal Link
                    </BdsLink>
                  </div>
                </div>
                {/* Medium Row */}
                <div className="d-flex flex-row mb-5 align-items-center" style={{ gap: '2rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}>
                    <strong>Medium</strong>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <BdsLink href="/docs" variant="internal" size="medium">
                      Medium Internal Link
                    </BdsLink>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <BdsLink href="https://example.com" variant="external" size="medium" target="_blank" rel="noopener noreferrer">
                      Medium External Link
                    </BdsLink>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <BdsLink href="#" variant="external" size="medium" disabled>
                      Disabled External Link
                    </BdsLink>
                  </div>
                </div>
                {/* Large Row */}
                <div className="d-flex flex-row align-items-center" style={{ gap: '2rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}>
                    <strong>Large</strong>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <BdsLink href="/docs" variant="internal" size="large">
                      Large Internal Link
                    </BdsLink>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <BdsLink href="https://example.com" variant="external" size="large" target="_blank" rel="noopener noreferrer">
                      Large External Link
                    </BdsLink>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <BdsLink href="#" variant="internal" size="large" disabled>
                      Disabled Internal Link
                    </BdsLink>
                  </div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Sizes</h2>
              <p className="mb-4">Typography and icon sizes are responsive, scaling from Mobile/Tablet to Desktop (xl: 1280px+).</p>

              {/* Size Specs Table */}
              <div className="mb-6">
                <h6 className="mb-3">Typography Specs</h6>
                <table className="w-100 mb-6" style={{ fontSize: '14px' }}>
                  <thead>
                    <tr className="text-muted">
                      <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Size</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Mobile/Tablet</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Desktop (xl)</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Gap</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted">
                    <tr><td><strong>Small</strong></td><td>14px / 20.1px line</td><td>16px / 23.2px line</td><td>16px</td></tr>
                    <tr><td><strong>Medium</strong></td><td>16px / 23.2px line</td><td>18px / 26.1px line, -0.5px letter</td><td>16px</td></tr>
                    <tr><td><strong>Large</strong></td><td>18px / 30px line, -0.5px letter</td><td>24px / 30px line</td><td>24px</td></tr>
                  </tbody>
                </table>

                <h6 className="mb-3">Internal Arrow Icon Sizes</h6>
                <table className="w-100 mb-6" style={{ fontSize: '14px' }}>
                  <thead>
                    <tr className="text-muted">
                      <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Size</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Mobile/Tablet</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Desktop (xl)</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted">
                    <tr><td><strong>Small</strong></td><td>14×13px</td><td>15×14px</td></tr>
                    <tr><td><strong>Medium</strong></td><td>17×14px</td><td>17×16px</td></tr>
                    <tr><td><strong>Large</strong></td><td>20×16px</td><td>26×22px</td></tr>
                  </tbody>
                </table>

                <h6 className="mb-3">External Arrow Icon Sizes</h6>
                <table className="w-100 mb-6" style={{ fontSize: '14px' }}>
                  <thead>
                    <tr className="text-muted">
                      <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Size</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Mobile/Tablet</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Desktop (xl)</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted">
                    <tr><td><strong>Small</strong></td><td>14×14px</td><td>14×14px</td></tr>
                    <tr><td><strong>Medium</strong></td><td>16×16px</td><td>16×16px</td></tr>
                    <tr><td><strong>Large</strong></td><td>17×17px</td><td>21×21px</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="d-flex flex-column gap-4 mb-10">
                <div>
                  <h6 className="mb-3">Small</h6>
                  <BdsLink href="/docs" size="small">
                    Small Link
                  </BdsLink>
                </div>
                <div>
                  <h6 className="mb-3">Medium</h6>
                  <BdsLink href="/docs" size="medium">
                    Medium Link
                  </BdsLink>
                </div>
                <div>
                  <h6 className="mb-3">Large</h6>
                  <BdsLink href="/docs" size="large">
                    Large Link
                  </BdsLink>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Color States</h2>
              <p className="mb-4">Links automatically handle color states via CSS per theme:</p>

              <div className="d-flex flex-row gap-6 mb-6" style={{ flexWrap: 'wrap' }}>
                {/* Light Mode Colors */}
                <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                  <h6 className="mb-3">Light Mode</h6>
                  <ul className="mb-0">
                    <li><strong>Enabled:</strong> Green 400 <code style={{ color: '#0DAA3E' }}>#0DAA3E</code></li>
                    <li><strong>Hover/Focus:</strong> Green 500 <code style={{ color: '#078139' }}>#078139</code> + underline</li>
                    <li><strong>Active:</strong> Green 400 <code style={{ color: '#0DAA3E' }}>#0DAA3E</code> + underline</li>
                    <li><strong>Visited:</strong> Lilac 400 <code style={{ color: '#7649E3' }}>#7649E3</code></li>
                    <li><strong>Disabled:</strong> Gray 400 <code style={{ color: '#8A919A' }}>#8A919A</code></li>
                    <li><strong>Focus Outline:</strong> Black <code style={{ color: '#141414' }}>#141414</code></li>
                  </ul>
                </div>

                {/* Dark Mode Colors */}
                <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                  <h6 className="mb-3">Dark Mode</h6>
                  <ul className="mb-0">
                    <li><strong>Enabled:</strong> Green 300 <code style={{ color: '#21E46B' }}>#21E46B</code></li>
                    <li><strong>Hover/Focus:</strong> Green 200 <code style={{ color: '#70EE97' }}>#70EE97</code> + underline</li>
                    <li><strong>Active:</strong> Green 300 <code style={{ color: '#21E46B' }}>#21E46B</code> + underline</li>
                    <li><strong>Visited:</strong> Lilac 300 <code style={{ color: '#C0A7FF' }}>#C0A7FF</code></li>
                    <li><strong>Disabled:</strong> Gray 400 <code style={{ color: '#8A919A' }}>#8A919A</code></li>
                    <li><strong>Focus Outline:</strong> White <code style={{ color: '#FFFFFF', backgroundColor: '#333', padding: '0 4px' }}>#FFFFFF</code></li>
                  </ul>
                </div>
              </div>

              <div className="d-flex flex-column gap-4 mb-10">
                <div>
                  <h6 className="mb-3">Default (hover to see state changes and arrow animation)</h6>
                  <BdsLink href="/docs" size="medium">
                    Default Link
                  </BdsLink>
                </div>
                <div>
                  <h6 className="mb-3">Disabled</h6>
                  <BdsLink href="#" size="medium" disabled>
                    Disabled Link
                  </BdsLink>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Icon Types & Animation</h2>
              <p className="mb-4">Arrow icons animate to chevron shape on hover/focus using CSS transform.</p>

              {/* Animation Specs */}
              <div className="mb-6 p-4 br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <h6 className="mb-3">Animation Specs (per Figma)</h6>
                <ul className="mb-0 text-muted">
                  <li><strong>Duration:</strong> 150ms</li>
                  <li><strong>Timing:</strong> <code>cubic-bezier(0.98, 0.12, 0.12, 0.98)</code></li>
                  <li><strong>Internal arrow:</strong> Horizontal line scales to 0 from right (transform-origin: right center)</li>
                  <li><strong>External arrow:</strong> Diagonal line scales to 0 toward top-right corner</li>
                  <li><strong>Disabled state:</strong> Animation disabled, icon opacity 0.5</li>
                </ul>
              </div>

              <div className="d-flex flex-column gap-4 mb-10">
                <div>
                  <h6 className="mb-3">Arrow (Internal) - horizontal line shrinks to chevron on hover</h6>
                  <BdsLink href="/docs" size="medium" icon="arrow">
                    Arrow Link
                  </BdsLink>
                </div>
                <div>
                  <h6 className="mb-3">External - diagonal line shrinks to bracket on hover</h6>
                  <BdsLink href="https://example.com" size="medium" variant="external" target="_blank" rel="noopener noreferrer">
                    External Link
                  </BdsLink>
                </div>
                <div>
                  <h6 className="mb-3">Inline (No Icon)</h6>
                  <p>
                    This is a paragraph with an{" "}
                    <BdsLink href="/docs" variant="inline">
                      inline link
                    </BdsLink>{" "}
                    embedded within the text.
                  </p>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Variants</h2>
              <div className="d-flex flex-column gap-4 mb-10">
                <div>
                  <h6 className="mb-3">Internal</h6>
                  <BdsLink href="/docs" variant="internal" size="medium">
                    Internal Link
                  </BdsLink>
                </div>
                <div>
                  <h6 className="mb-3">External</h6>
                  <BdsLink href="https://example.com" variant="external" size="medium" target="_blank" rel="noopener noreferrer">
                    External Link
                  </BdsLink>
                </div>
                <div>
                  <h6 className="mb-3">Inline</h6>
                  <p>
                    This is a paragraph with an{" "}
                    <BdsLink href="/docs" variant="inline">
                      inline link
                    </BdsLink>{" "}
                    that appears within the text flow.
                  </p>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Real-World Examples</h2>
              <div className="d-flex flex-column gap-6 mb-10">
                <div>
                  <h6 className="mb-4">Navigation Links</h6>
                  <div className="d-flex flex-column gap-3">
                    <BdsLink href="/docs" size="medium">
                      View Documentation
                    </BdsLink>
                    <BdsLink href="/about" size="medium">
                      Learn More About XRPL
                    </BdsLink>
                    <BdsLink href="https://github.com/XRPLF/xrpl-dev-portal" variant="external" size="medium" target="_blank" rel="noopener noreferrer">
                      GitHub Repository
                    </BdsLink>
                  </div>
                </div>
                <div>
                  <h6 className="mb-4">Inline Text Links</h6>
                  <p className="longform">
                    The XRP Ledger is a decentralized public blockchain. You can{" "}
                    <BdsLink href="/docs" variant="inline">
                      read the technical documentation
                    </BdsLink>{" "}
                    to learn more about how it works. The network is maintained by a{" "}
                    <BdsLink href="/about" variant="inline">
                      global community
                    </BdsLink>{" "}
                    of developers and validators.
                  </p>
                </div>
                <div>
                  <h6 className="mb-4">Call-to-Action Links</h6>
                  <div className="d-flex flex-column gap-3">
                    <BdsLink href="/docs" size="large">
                      Get Started with XRPL
                    </BdsLink>
                    <BdsLink href="/about/uses" size="large">
                      Explore Use Cases
                    </BdsLink>
                  </div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </div>
    </div>
  );
}
