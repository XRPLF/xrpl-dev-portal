import { RFC_2822 } from "moment";
import * as React from "react";
import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";

export const frontmatter = {
  seo: {
    title: 'PageGrid Showcase',
    description: "A comprehensive showcase and documentation for the PageGrid component system.",
  }
};

// Demo component with bordered divs to visualize grid
const GridDemo = ({ title, description, children, code }: { 
  title: string; 
  description?: string; 
  children: React.ReactNode;
  code?: string;
}) => (
  <div className="mb-26">
    <h3 className="h4 mb-4">{title}</h3>
    {description && <p className="mb-6">{description}</p>}
    {code && (
      <div className="mb-6 p-4 bg-light br-4 text-black" style={{ fontFamily: 'monospace', fontSize: '14px', overflow: 'auto' }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#000' }}>{code}</pre>
      </div>
    )}
    <div style={{ 
      border: '1px dashed #ccc', 
      padding: '16px', 
      backgroundColor: '#f9f9f9',
      borderRadius: '8px'
    }}>
      {children}
    </div>
  </div>
);

// Bordered column component for visualization
const BorderedCol = ({ children, ...props }: { children: React.ReactNode } & any) => (
  <PageGridCol 
    {...props}
    style={{
      border: '1px solid #0069ff',
      backgroundColor: 'rgba(0, 105, 255, 0.05)',
      padding: '16px',
      minHeight: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      ...props.style
    }}
  >
    {children}
  </PageGridCol>
);

export default function GridShowcase() {
  return (
    <div className="landing">
      <PageGrid className="py-26">
        <PageGridRow>
          <PageGridCol>
            <div className="text-center mb-26">
              <h1 className="h2 mb-4">PageGrid Component Showcase</h1>
              <p className="longform">
                A comprehensive guide to using the PageGrid responsive grid system. 
                All examples below use bordered divs to visualize the grid structure.
              </p>
            </div>
          </PageGridCol>
        </PageGridRow>

        {/* Basic Grid Structure */}
        <PageGridRow>
          <PageGridCol>
            <GridDemo
              title="Basic Grid Structure"
              description="The PageGrid system consists of three components: PageGrid (container), PageGrid.Row (rows), and PageGrid.Col (columns)."
              code={`<PageGrid>
  <PageGrid.Row>
    <PageGrid.Col span={6}>Column 1</PageGrid.Col>
    <PageGrid.Col span={6}>Column 2</PageGrid.Col>
    <PageGrid.Col>[No span set]</PageGrid.Col>
    <PageGrid.Col>[No span set]</PageGrid.Col>
  </PageGrid.Row>
</PageGrid>`}
            >
              <PageGrid>
                <PageGridRow>
                  <BorderedCol span={6}>span={6}</BorderedCol>
                  <BorderedCol span={6}>span={6}</BorderedCol>
                  <BorderedCol>[No span set]</BorderedCol>
                  <BorderedCol>[No span set]</BorderedCol>
                </PageGridRow>
              </PageGrid>
            </GridDemo>
          </PageGridCol>
        </PageGridRow>

        {/* Equal Columns */}
        <PageGridRow>
          <PageGridCol>
            <GridDemo
              title="Equal Width Columns"
              description="Create equal-width columns that automatically divide the available space."
              code={`<PageGrid>
  <PageGrid.Row>
    <PageGrid.Col span={4}>Column 1</PageGrid.Col>
    <PageGrid.Col span={4}>Column 2</PageGrid.Col>
    <PageGrid.Col span={4}>Column 3</PageGrid.Col>
  </PageGrid.Row>
</PageGrid>`}
            >
              <PageGrid>
                <PageGridRow>
                  <BorderedCol span={4}>span={4}</BorderedCol>
                  <BorderedCol span={4}>span={4}</BorderedCol>
                  <BorderedCol span={4}>span={4}</BorderedCol>
                </PageGridRow>
              </PageGrid>
            </GridDemo>
          </PageGridCol>
        </PageGridRow>

        {/* Auto and Fill */}
        <PageGridRow>
          <PageGridCol>
            <GridDemo
              title="Auto and Fill Columns"
              description="Use 'auto' for columns that size to their content, and 'fill' for columns that take remaining space."
              code={`<PageGrid>
  <PageGrid.Row>
    <PageGrid.Col span="auto">Auto</PageGrid.Col>
    <PageGrid.Col span="fill">Fill</PageGrid.Col>
    <PageGrid.Col span="auto">Auto</PageGrid.Col>
  </PageGrid.Row>
</PageGrid>`}
            >
              <PageGrid>
                <PageGridRow>
                  <BorderedCol span="auto">span="auto"</BorderedCol>
                  <BorderedCol span="fill">span="fill"</BorderedCol>
                  <BorderedCol span="auto">span="auto"</BorderedCol>
                </PageGridRow>
              </PageGrid>
            </GridDemo>
          </PageGridCol>
        </PageGridRow>

        {/* Responsive Layout */}
        <PageGridRow>
          <PageGridCol>
            <GridDemo
              title="Responsive Layout"
              description="Create layouts that adapt to different screen sizes using responsive span values."
              code={`<PageGrid>
  <PageGrid.Row>
    <PageGrid.Col span={{
      base: 12,  // Full width on mobile
      md: 6,     // Half width on tablet
      lg: 4      // Third width on desktop
    }}>
      Responsive Column
    </PageGrid.Col>
  </PageGrid.Row>
</PageGrid>`}
            >
              <PageGrid>
                <PageGridRow>
                  <BorderedCol span={{ base: 4, md: 6, lg: 4 }}>
                    base: 4, md: 6, lg: 4
                  </BorderedCol>
                  <BorderedCol span={{ base: 4, md: 6, lg: 4 }}>
                    base: 4, md: 6, lg: 4
                  </BorderedCol>
                  <BorderedCol span={{ base: 4, md: 8, lg: 4 }}>
                    base: 4, md: 8, lg: 4
                  </BorderedCol>
                </PageGridRow>
              </PageGrid>
            </GridDemo>
          </PageGridCol>
        </PageGridRow>

        {/* Offsets */}
        <PageGridRow>
          <PageGridCol>
            <GridDemo
              title="Column Offsets"
              description="Use offsets to push columns to the right, useful for centering content or creating spacing."
              code={`<PageGrid>
  <PageGrid.Row>
    <PageGrid.Col span={8} offset={2}>
      Centered (8 columns with 2 offset)
    </PageGrid.Col>
  </PageGrid.Row>
</PageGrid>`}
            >
              <PageGrid>
                <PageGridRow>
                  <BorderedCol span={8} offset={{ lg: 2 }}>
                    span={8}, offset: lg: 2
                  </BorderedCol>
                </PageGridRow>
              </PageGrid>
            </GridDemo>
          </PageGridCol>
        </PageGridRow>

        {/* Responsive Offsets */}
        <PageGridRow>
          <PageGridCol>
            <GridDemo
              title="Responsive Offsets"
              description="Offsets can also be responsive, changing at different breakpoints."
              code={`<PageGrid>
  <PageGrid.Row>
    <PageGrid.Col 
      span={6}
      offset={{
        base: 0,  // No offset on mobile
        md: 3      // Offset by 3 on tablet+
      }}
    >
      Responsive Offset
    </PageGrid.Col>
  </PageGrid.Row>
</PageGrid>`}
            >
              <PageGrid>
                <PageGridRow>
                  <BorderedCol span={6} offset={{ base: 0, md: 3 }}>
                    span={6}, offset: base=0, md=3
                  </BorderedCol>
                </PageGridRow>
              </PageGrid>
            </GridDemo>
          </PageGridCol>
        </PageGridRow>

        {/* Complex Layout */}
        <PageGridRow>
          <PageGridCol>
            <GridDemo
              title="Complex Layout Example"
              description="A real-world example showing a sidebar and main content area."
              code={`<PageGrid>
  <PageGrid.Row>
    <PageGrid.Col span={{ base: 12, lg: 4 }}>
      Sidebar
    </PageGrid.Col>
    <PageGrid.Col span={{ base: 12, lg: 8 }}>
      Main Content
    </PageGrid.Col>
  </PageGrid.Row>
</PageGrid>`}
            >
              <PageGrid>
                <PageGridRow>
                  <BorderedCol span={{ base: 4, lg: 4 }} style={{ backgroundColor: 'rgba(255, 200, 0, 0.1)' }}>
                    Sidebar<br />(base: 4, lg: 4)
                  </BorderedCol>
                  <BorderedCol span={{ base: 4, lg: 8 }} style={{ backgroundColor: 'rgba(0, 200, 255, 0.1)' }}>
                    Main Content<br />(base: 4, lg: 8)
                  </BorderedCol>
                </PageGridRow>
              </PageGrid>
            </GridDemo>
          </PageGridCol>
        </PageGridRow>

        {/* Breakpoints Documentation */}
        <PageGridRow>
          <PageGridCol>
            <div className="mb-26">
              <h2 className="h3 mb-6">Breakpoints</h2>
              <p className="mb-6">
                The PageGrid system uses the following breakpoints:
              </p>
              <div style={{ width: '100%', backgroundColor: '#FFFFFF', borderRadius: '4px', overflow: 'hidden', border: '1px solid #EEE', marginBottom: '24px' }}>
                {/* Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1fr 1.5fr',
                  borderBottom: '2px solid #E0E0E1',
                  background: '#FAFAFA'
                }}>
                  <div style={{ padding: '12px', fontWeight: 600 }}>Breakpoint</div>
                  <div style={{ padding: '12px', fontWeight: 600 }}>Min Width</div>
                  <div style={{ padding: '12px', fontWeight: 600 }}>Columns</div>
                  <div style={{ padding: '12px', fontWeight: 600 }}>Container Padding</div>
                </div>

                {/* Rows */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1.5fr', borderBottom: '1px solid #E0E0E1' }}>
                  <div style={{ padding: '12px' }}><code>base</code></div>
                  <div style={{ padding: '12px' }}>0px</div>
                  <div style={{ padding: '12px' }}>4 columns</div>
                  <div style={{ padding: '12px' }}>16px</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1.5fr', borderBottom: '1px solid #E0E0E1' }}>
                  <div style={{ padding: '12px' }}><code>sm</code></div>
                  <div style={{ padding: '12px' }}>576px</div>
                  <div style={{ padding: '12px' }}>8 columns</div>
                  <div style={{ padding: '12px' }}>24px</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1.5fr', borderBottom: '1px solid #E0E0E1' }}>
                  <div style={{ padding: '12px' }}><code>md</code></div>
                  <div style={{ padding: '12px' }}>576px</div>
                  <div style={{ padding: '12px' }}>8 columns</div>
                  <div style={{ padding: '12px' }}>24px</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1.5fr', borderBottom: '1px solid #E0E0E1' }}>
                  <div style={{ padding: '12px' }}><code>lg</code></div>
                  <div style={{ padding: '12px' }}>992px</div>
                  <div style={{ padding: '12px' }}>12 columns</div>
                  <div style={{ padding: '12px' }}>32px</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1.5fr' }}>
                  <div style={{ padding: '12px' }}><code>xl</code></div>
                  <div style={{ padding: '12px' }}>1280px</div>
                  <div style={{ padding: '12px' }}>12 columns</div>
                  <div style={{ padding: '12px' }}>112px (max-width: 1440px)</div>
                </div>
              </div>
            </div>
          </PageGridCol>
        </PageGridRow>

        {/* Usage Documentation */}
        <PageGridRow>
          <PageGridCol>
            <div className="mb-26">
              <h2 className="h3 mb-6">Usage</h2>
              
              <h4 className="h5 mb-4">Import</h4>
              <div className="p-4 bg-light br-4 mb-6" style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                <pre style={{ margin: 0, color: '#000' }}>{`import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";`}</pre>
              </div>

              <h4 className="h5 mb-4">Basic Example</h4>
              <div className="p-4 bg-light br-4 mb-6" style={{ fontFamily: 'monospace', fontSize: '14px', overflow: 'auto' }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#000' }}>{`<PageGrid>
  <PageGrid.Row>
    <PageGrid.Col span={6}>
      Column 1
    </PageGrid.Col>
    <PageGrid.Col span={6}>
      Column 2
    </PageGrid.Col>
  </PageGrid.Row>
</PageGrid>`}</pre>
              </div>

              <h4 className="h5 mb-4">Props</h4>
              <div className="mb-6">
                <h5 className="h6 mb-3">PageGrid.Col Props</h5>
                <ul>
                  <li><code>span</code> - Column span (number, "auto", "fill", or responsive object)</li>
                  <li><code>offset</code> - Column offset (number or responsive object)</li>
                  <li><code>className</code> - Additional CSS classes</li>
                  <li>All standard HTML div attributes</li>
                </ul>
              </div>

              <h4 className="h5 mb-4">Span Values</h4>
              <ul className="mb-6">
                <li><strong>Number</strong> (e.g., 1-12): Fixed column width</li>
                <li><strong>"auto"</strong>: Column sizes to its content</li>
                <li><strong>"fill"</strong>: Column fills remaining space</li>
                <li><strong>Responsive Object</strong>: Different spans for different breakpoints</li>
              </ul>

              <h4 className="h5 mb-4">Best Practices</h4>
              <ul>
                <li>Always wrap columns in a <code>PageGrid.Row</code></li>
                <li>Use responsive values for mobile-first design</li>
                <li>Total column spans in a row should not exceed the grid columns (4 for base, 8 for sm/md, 12 for lg/xl)</li>
                <li>Use offsets for spacing and centering content</li>
                <li>Test layouts at all breakpoints</li>
              </ul>
            </div>
          </PageGridCol>
        </PageGridRow>

        {/* Visual Grid Demonstration */}
        <PageGridRow>
          <PageGridCol>
            <div className="mb-26">
              <h2 className="h3 mb-6">Visual Grid Demonstration</h2>
              <p className="mb-6">
                Below is a visual representation of the 12-column grid system at the lg breakpoint:
              </p>
              <PageGrid>
                <PageGridRow>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <BorderedCol key={num} span={{ base: 2, lg: 1 }} style={{ fontSize: '12px' }}>
                      {num}
                    </BorderedCol>
                  ))}
                </PageGridRow>
              </PageGrid>
            </div>
          </PageGridCol>
        </PageGridRow>
      </PageGrid>
    </div>
  );
}
