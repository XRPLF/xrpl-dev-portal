import * as React from "react";
import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";
import { Divider } from "shared/components/Divider";

export const frontmatter = {
  seo: {
    title: 'Divider Component Showcase',
    description: "A comprehensive showcase of all Divider component variants, weights, colors, and orientations in the XRPL.org Design System.",
  }
};

export default function DividerShowcase() {
  return (
    <div className="landing">
      <div className="overflow-hidden">
        <section className="py-26 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Component Showcase</h6>
            <h1 className="mb-4">Divider Component</h1>
            <p className="longform">
              A comprehensive showcase of all Divider component variants, weights, colors, and orientations.
            </p>
          </div>
        </section>

        {/* Weight by Color Matrix - Horizontal */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Horizontal Dividers: Weight by Color Matrix</h2>
              <div className="mb-10">
                {/* Header Row */}
                <div className="d-flex flex-row mb-4" style={{ gap: '2rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}>
                    <h6 className="mb-0">Weight</h6>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <h6 className="mb-0">Gray</h6>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <h6 className="mb-0">Black</h6>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <h6 className="mb-0">Green</h6>
                  </div>
                </div>

                {/* Thin Row */}
                <div className="d-flex flex-row mb-5 align-items-center" style={{ gap: '2rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}>
                    <strong>Thin</strong>
                    <br />
                    <small className="text-muted">0.5px</small>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <Divider weight="thin" color="gray" />
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <Divider weight="thin" color="black" />
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <Divider weight="thin" color="green" />
                  </div>
                </div>

                {/* Regular Row */}
                <div className="d-flex flex-row mb-5 align-items-center" style={{ gap: '2rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}>
                    <strong>Regular</strong>
                    <br />
                    <small className="text-muted">1px</small>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <Divider weight="regular" color="gray" />
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <Divider weight="regular" color="black" />
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <Divider weight="regular" color="green" />
                  </div>
                </div>

                {/* Strong Row */}
                <div className="d-flex flex-row align-items-center" style={{ gap: '2rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}>
                    <strong>Strong</strong>
                    <br />
                    <small className="text-muted">2px</small>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <Divider weight="strong" color="gray" />
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <Divider weight="strong" color="black" />
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <Divider weight="strong" color="green" />
                  </div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Vertical Dividers */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Vertical Dividers: Weight by Color Matrix</h2>
              <div className="mb-10">
                {/* Header Row */}
                <div className="d-flex flex-row mb-4" style={{ gap: '2rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}>
                    <h6 className="mb-0">Weight</h6>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <h6 className="mb-0">Gray</h6>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <h6 className="mb-0">Black</h6>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <h6 className="mb-0">Green</h6>
                  </div>
                </div>

                {/* Thin Row */}
                <div className="d-flex flex-row mb-5 align-items-stretch" style={{ gap: '2rem', height: '120px' }}>
                  <div style={{ width: '120px', flexShrink: 0 }} className="d-flex align-items-center">
                    <div>
                      <strong>Thin</strong>
                      <br />
                      <small className="text-muted">0.5px</small>
                    </div>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }} className="d-flex justify-content-center">
                    <Divider orientation="vertical" weight="thin" color="gray" />
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }} className="d-flex justify-content-center">
                    <Divider orientation="vertical" weight="thin" color="black" />
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }} className="d-flex justify-content-center">
                    <Divider orientation="vertical" weight="thin" color="green" />
                  </div>
                </div>

                {/* Regular Row */}
                <div className="d-flex flex-row mb-5 align-items-stretch" style={{ gap: '2rem', height: '120px' }}>
                  <div style={{ width: '120px', flexShrink: 0 }} className="d-flex align-items-center">
                    <div>
                      <strong>Regular</strong>
                      <br />
                      <small className="text-muted">1px</small>
                    </div>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }} className="d-flex justify-content-center">
                    <Divider orientation="vertical" weight="regular" color="gray" />
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }} className="d-flex justify-content-center">
                    <Divider orientation="vertical" weight="regular" color="black" />
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }} className="d-flex justify-content-center">
                    <Divider orientation="vertical" weight="regular" color="green" />
                  </div>
                </div>

                {/* Strong Row */}
                <div className="d-flex flex-row align-items-stretch" style={{ gap: '2rem', height: '120px' }}>
                  <div style={{ width: '120px', flexShrink: 0 }} className="d-flex align-items-center">
                    <div>
                      <strong>Strong</strong>
                      <br />
                      <small className="text-muted">2px</small>
                    </div>
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }} className="d-flex justify-content-center">
                    <Divider orientation="vertical" weight="strong" color="gray" />
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }} className="d-flex justify-content-center">
                    <Divider orientation="vertical" weight="strong" color="black" />
                  </div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }} className="d-flex justify-content-center">
                    <Divider orientation="vertical" weight="strong" color="green" />
                  </div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Weights Comparison */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Stroke Weights</h2>
              <p className="mb-4">Dividers are available in three stroke weights to represent different levels of visual hierarchy.</p>
              <div className="d-flex flex-column gap-5 mb-10">
                <div>
                  <h6 className="mb-3">Thin (0.5px) - Subtle separation</h6>
                  <Divider weight="thin" />
                </div>
                <div>
                  <h6 className="mb-3">Regular (1px) - Default weight</h6>
                  <Divider weight="regular" />
                </div>
                <div>
                  <h6 className="mb-3">Strong (2px) - Emphasized boundaries</h6>
                  <Divider weight="strong" />
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Color Variants */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Color Variants</h2>
              <p className="mb-4">Colors are mapped from the XRPL Design System color palette:</p>
              
              <div className="d-flex flex-row gap-6 mb-6" style={{ flexWrap: 'wrap' }}>
                {/* Dark Mode Colors (Default) */}
                <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                  <h6 className="mb-3">Dark Mode (Default)</h6>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#454549', borderRadius: '4px', flexShrink: 0, border: '1px solid var(--bs-border-color, #dee2e6)' }}></div>
                      <div>
                        <strong>Gray:</strong> <code>$gray-600</code>
                        <br />
                        <small className="text-muted">#454549</small>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#FFFFFF', borderRadius: '4px', flexShrink: 0, border: '1px solid var(--bs-border-color, #dee2e6)' }}></div>
                      <div>
                        <strong>Black:</strong> <code>$white</code>
                        <br />
                        <small className="text-muted">#FFFFFF</small>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#21E46B', borderRadius: '4px', flexShrink: 0, border: '1px solid var(--bs-border-color, #dee2e6)' }}></div>
                      <div>
                        <strong>Green:</strong> <code>$green-300</code>
                        <br />
                        <small className="text-muted">#21E46B</small>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Light Mode Colors */}
                <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                  <h6 className="mb-3">Light Mode</h6>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#C1C1C2', borderRadius: '4px', flexShrink: 0, border: '1px solid var(--bs-border-color, #dee2e6)' }}></div>
                      <div>
                        <strong>Gray:</strong> <code>$gray-300</code>
                        <br />
                        <small className="text-muted">#C1C1C2</small>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#111112', borderRadius: '4px', flexShrink: 0, border: '1px solid var(--bs-border-color, #dee2e6)' }}></div>
                      <div>
                        <strong>Black:</strong> <code>$gray-900</code>
                        <br />
                        <small className="text-muted">#111112</small>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#21E46B', borderRadius: '4px', flexShrink: 0, border: '1px solid var(--bs-border-color, #dee2e6)' }}></div>
                      <div>
                        <strong>Green:</strong> <code>$green-300</code>
                        <br />
                        <small className="text-muted">#21E46B</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column gap-5 mb-10">
                <div>
                  <h6 className="mb-3">Gray - Neutral separation (default)</h6>
                  <Divider color="gray" weight="regular" />
                </div>
                <div>
                  <h6 className="mb-3">Black - High contrast separation</h6>
                  <Divider color="black" weight="regular" />
                </div>
                <div>
                  <h6 className="mb-3">Green - Brand accent separation</h6>
                  <Divider color="green" weight="regular" />
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Real-World Examples */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Real-World Examples</h2>
              
              <div className="d-flex flex-column gap-6 mb-10">
                {/* Content Section Separation */}
                <div>
                  <h6 className="mb-4">Content Section Separation</h6>
                  <div className="card p-4">
                    <h5>Section Title</h5>
                    <p className="mb-4">This is some content in the first section that explains something important.</p>
                    <Divider color="gray" weight="thin" />
                    <p className="mt-4 mb-0">This is content in the second section that follows naturally from the first.</p>
                  </div>
                </div>

                {/* List Item Separation */}
                <div>
                  <h6 className="mb-4">List Item Separation</h6>
                  <div className="card p-4">
                    <div className="d-flex flex-column">
                      <div className="py-3">
                        <strong>Feature One</strong>
                        <p className="mb-0 text-muted">Description of the first feature</p>
                      </div>
                      <Divider color="gray" weight="thin" />
                      <div className="py-3">
                        <strong>Feature Two</strong>
                        <p className="mb-0 text-muted">Description of the second feature</p>
                      </div>
                      <Divider color="gray" weight="thin" />
                      <div className="py-3">
                        <strong>Feature Three</strong>
                        <p className="mb-0 text-muted">Description of the third feature</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vertical Divider Between Columns */}
                <div>
                  <h6 className="mb-4">Vertical Divider Between Columns</h6>
                  <div className="card p-4">
                    <div className="d-flex flex-row align-items-stretch" style={{ gap: '1.5rem', minHeight: '100px' }}>
                      <div style={{ flex: '1 1 0' }}>
                        <strong>Column One</strong>
                        <p className="mb-0 text-muted">Content for the first column</p>
                      </div>
                      <Divider orientation="vertical" color="gray" weight="regular" />
                      <div style={{ flex: '1 1 0' }}>
                        <strong>Column Two</strong>
                        <p className="mb-0 text-muted">Content for the second column</p>
                      </div>
                      <Divider orientation="vertical" color="gray" weight="regular" />
                      <div style={{ flex: '1 1 0' }}>
                        <strong>Column Three</strong>
                        <p className="mb-0 text-muted">Content for the third column</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Major Section Break */}
                <div>
                  <h6 className="mb-4">Major Section Break (Strong + Green)</h6>
                  <div className="card p-4">
                    <h5>Primary Section</h5>
                    <p className="mb-4">This section contains the main content of the page.</p>
                    <Divider color="green" weight="strong" />
                    <h5 className="mt-4">Secondary Section</h5>
                    <p className="mb-0">This section is clearly separated with a strong branded divider.</p>
                  </div>
                </div>

                {/* Navigation Separator */}
                <div>
                  <h6 className="mb-4">Navigation Item Separator</h6>
                  <div className="card p-4">
                    <div className="d-flex flex-row align-items-center" style={{ gap: '1rem', height: '24px' }}>
                      <span>Home</span>
                      <Divider orientation="vertical" color="gray" weight="thin" />
                      <span>Documentation</span>
                      <Divider orientation="vertical" color="gray" weight="thin" />
                      <span>API Reference</span>
                      <Divider orientation="vertical" color="gray" weight="thin" />
                      <span>Community</span>
                    </div>
                  </div>
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
                  <div style={{ width: '120px', flexShrink: 0 }}><strong>Default</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Description</strong></div>
                </div>
                
                {/* orientation */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>orientation</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>'horizontal' | 'vertical'</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>'horizontal'</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Sets the divider orientation</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* weight */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>weight</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>'thin' | 'regular' | 'strong'</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>'regular'</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Controls the stroke thickness</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* color */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>color</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>'gray' | 'black' | 'green'</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>'gray'</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Sets the divider color</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* className */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>className</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>''</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Additional CSS classes</div>
                </div>
                <Divider weight="thin" color="gray" />
                
                {/* decorative */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>decorative</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>boolean</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>true</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Whether the divider is purely decorative (hides from screen readers)</div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </div>
    </div>
  );
}
