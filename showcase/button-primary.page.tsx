import * as React from 'react';
import { Button } from 'shared/components/Button';
import { PageGrid, PageGridCol, PageGridRow } from 'shared/components/PageGrid/page-grid';

export const frontmatter = {
  seo: {
    title: 'BDS Button Component Showcase',
    description: 'Interactive showcase of the Brand Design System Button component with all states and variants.',
  },
};

export default function ButtonShowcase() {
  const [clickCount, setClickCount] = React.useState(0);

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
  };

  return (
    <div className="landing">
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse col-lg-8 mx-auto">
          <h1 className="mb-0">BDS Button Component</h1>
          <h6 className="eyebrow mb-3">Brand Design System</h6>
        </div>
        <p className="col-lg-8 mx-auto mt-10">
          A scalable button component following the XRPL Brand Design System. This showcase demonstrates all states,
          responsive behavior, and accessibility features of the Primary button variant.
        </p>
      </section>

      {/* Basic Usage */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Basic Usage</h2>
          <h6 className="eyebrow mb-3">Primary Variant</h6>
        </div>
        <div className="d-flex flex-wrap align-items-center">
          <Button variant="primary" onClick={handleClick} className="me-4 mb-4">
            Get Started
          </Button>
          <Button variant="primary" onClick={handleClick} className="me-4 mb-4">
            Submit Form
          </Button>
          <Button variant="primary" onClick={handleClick} className="mb-4">
            Continue
          </Button>
        </div>
        {clickCount > 0 && (
          <p className="mt-4 text-muted">Button clicked {clickCount} time{clickCount !== 1 ? 's' : ''}</p>
        )}
      </section>

      {/* States */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Button States</h2>
          <h6 className="eyebrow mb-3">Interactive States</h6>
        </div>
        <PageGrid>
          <PageGridRow>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <h5 className="mb-4">Enabled State</h5>
                <p className="mb-4 text-muted">Default state when button is ready for interaction.</p>
                <Button variant="primary" onClick={handleClick}>
                  Enabled Button
                </Button>
              </div>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <h5 className="mb-4">Disabled State</h5>
                <p className="mb-4 text-muted">Button cannot be interacted with.</p>
                <Button variant="primary" disabled>
                  Disabled Button
                </Button>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
        <div className="mt-10">
          <h5 className="mb-4">Hover & Focus States</h5>
          <p className="mb-4 text-muted">
            Hover over the buttons below or use Tab to focus them. Notice the background color change and icon swap.
          </p>
          <div className="d-flex flex-wrap">
            <Button variant="primary" onClick={handleClick} className="me-4 mb-4">
              Hover Me
            </Button>
            <Button variant="primary" onClick={handleClick} className="mb-4">
              Focus Me (Tab)
            </Button>
          </div>
        </div>
      </section>

      {/* Black Color Variant */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Black Color Variant</h2>
          <h6 className="eyebrow mb-3">Color Theme</h6>
        </div>
        <p className="mb-4 text-muted">
          Primary buttons can use a black color theme for dark backgrounds or alternative styling needs.
        </p>
        <div className="d-flex flex-wrap align-items-center">
          <Button variant="primary" color="black" onClick={handleClick} className="me-4 mb-4">
            Black Primary
          </Button>
          <Button variant="primary" color="black" onClick={handleClick} className="me-4 mb-4">
            Dark Button
          </Button>
          <Button variant="primary" color="black" onClick={handleClick} className="mb-4">
            Get Started
          </Button>
        </div>
      </section>

      {/* Black Variant States */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Black Variant States</h2>
          <h6 className="eyebrow mb-3">Interactive States</h6>
        </div>
        <PageGrid>
          <PageGridRow>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <h5 className="mb-4">Enabled State</h5>
                <p className="mb-4 text-muted">Black background with white text.</p>
                <Button variant="primary" color="black" onClick={handleClick}>
                  Enabled Button
                </Button>
              </div>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <h5 className="mb-4">Disabled State</h5>
                <p className="mb-4 text-muted">Same disabled styling as green variant.</p>
                <Button variant="primary" color="black" disabled>
                  Disabled Button
                </Button>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
        <div className="mt-10">
          <h5 className="mb-4">Hover & Focus States</h5>
          <p className="mb-4 text-muted">
            Hover over the buttons or use Tab to focus them. Notice the background darkens slightly on hover.
          </p>
          <div className="d-flex flex-wrap">
            <Button variant="primary" color="black" onClick={handleClick} className="me-4 mb-4">
              Hover Me
            </Button>
            <Button variant="primary" color="black" onClick={handleClick} className="mb-4">
              Focus Me (Tab)
            </Button>
          </div>
        </div>
      </section>

      {/* Green vs Black Comparison */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Green vs Black Comparison</h2>
          <h6 className="eyebrow mb-3">Color Themes</h6>
        </div>
        <p className="mb-4 text-muted">Compare the green (default) and black color themes side by side.</p>
        <div className="d-flex flex-wrap align-items-center">
          <Button variant="primary" color="green" onClick={handleClick} className="me-4 mb-4">
            Green Primary
          </Button>
          <Button variant="primary" color="black" onClick={handleClick} className="mb-4">
            Black Primary
          </Button>
        </div>
      </section>

      {/* Link Buttons */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Link Buttons</h2>
          <h6 className="eyebrow mb-3">Navigation</h6>
        </div>
        <p className="mb-4 text-muted">
          Buttons can function as links by passing an <code>href</code> prop. They render as anchor elements wrapped in a Redocly Link component for routing support.
        </p>
        <div className="d-flex flex-wrap align-items-center">
          <Button variant="primary" href="/docs" className="me-4 mb-4">
            View Documentation
          </Button>
          <Button variant="primary" href="https://xrpl.org" target="_blank" className="me-4 mb-4">
            Visit XRPL.org
          </Button>
          <Button variant="primary" color="black" href="/about" className="mb-4">
            About Us
          </Button>
        </div>
      </section>

      {/* Without Icon */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Without Icon</h2>
          <h6 className="eyebrow mb-3">Icon Control</h6>
        </div>
        <p className="mb-4 text-muted">Buttons can be rendered without the arrow icon when needed.</p>
        <div className="d-flex flex-wrap">
          <Button variant="primary" showIcon={false} onClick={handleClick} className="me-4 mb-4">
            No Icon Button
          </Button>
          <Button variant="primary" showIcon={true} onClick={handleClick} className="mb-4">
            With Icon Button
          </Button>
        </div>
      </section>

      {/* Button Types */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Button Types</h2>
          <h6 className="eyebrow mb-3">Form Integration</h6>
        </div>
        <p className="mb-4 text-muted">Different button types for form submission and actions.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Form submitted!');
          }}
          className="d-flex flex-wrap"
        >
          <Button variant="primary" type="submit" className="me-4 mb-4">
            Submit Button
          </Button>
          <Button variant="primary" type="reset" className="me-4 mb-4">
            Reset Button
          </Button>
          <Button variant="primary" type="button" onClick={handleClick} className="mb-4">
            Regular Button
          </Button>
        </form>
      </section>

      {/* Responsive Behavior */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Responsive Behavior</h2>
          <h6 className="eyebrow mb-3">Breakpoint Adjustments</h6>
        </div>
        <p className="mb-4 text-muted">
          Button padding adjusts automatically across breakpoints. Resize your browser window to see the changes:
        </p>
        <ul className="mb-4">
          <li>
            <strong>Desktop (≥1024px):</strong> Padding: 8px 19px 8px 20px, Gap: 16px
          </li>
          <li>
            <strong>Tablet/Mobile (≤1023px):</strong> Padding: 8px 15px 8px 16px, Gap: 16px
          </li>
          <li>
            <strong>Hover/Focus:</strong> Gap increases (22px desktop, 21px mobile) with adjusted padding to maintain
            button width
          </li>
        </ul>
        <div className="d-flex flex-wrap">
          <Button variant="primary" onClick={handleClick} className="me-4 mb-4">
            Responsive Button
          </Button>
          <Button variant="primary" onClick={handleClick} className="mb-4">
            Long Button Label Example
          </Button>
        </div>
      </section>

      {/* Accessibility */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Accessibility Features</h2>
          <h6 className="eyebrow mb-3">WCAG Compliance</h6>
        </div>
        <PageGrid>
          <PageGridRow>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <h5 className="mb-4">Keyboard Navigation</h5>
              <ul>
                <li>Tab to focus buttons</li>
                <li>Enter or Space to activate</li>
                <li>Focus indicator: 2px black border</li>
                <li>Disabled buttons are not focusable</li>
              </ul>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <h5 className="mb-4">Screen Reader Support</h5>
              <ul>
                <li>Button labels are announced</li>
                <li>Disabled state communicated via aria-disabled</li>
                <li>Icons are hidden from screen readers (aria-hidden)</li>
                <li>Semantic button element used</li>
              </ul>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
        <div className="mt-10">
          <h5 className="mb-4">Color Contrast</h5>
          <ul>
            <li>
              <strong>Enabled:</strong> Black text (#141414) on Green 300 (#21E46B) = 9.06:1 (AAA)
            </li>
            <li>
              <strong>Hover:</strong> Black text (#141414) on Green 200 (#70EE97) = 10.23:1 (AAA)
            </li>
            <li>
              <strong>Disabled:</strong> Gray 500 (#838386) on Gray 200 (#E0E0E1) = 2.12:1 (acceptable for disabled
              state)
            </li>
          </ul>
        </div>
      </section>

      {/* Code Examples */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Code Examples</h2>
          <h6 className="eyebrow mb-3">Implementation</h6>
        </div>
        <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4' }}>
          <pre style={{ margin: 0, overflow: 'auto' }}>
            <code>{`import { Button } from 'shared/components/Button';

// Basic usage (green theme - default)
<Button variant="primary" onClick={handleClick}>
  Get Started
</Button>

// Black color theme
<Button variant="primary" color="black" onClick={handleClick}>
  Dark Button
</Button>

// Disabled state
<Button variant="primary" disabled>
  Submit
</Button>

// Without icon
<Button variant="primary" showIcon={false}>
  Continue
</Button>

// Form integration
<Button variant="primary" type="submit">
  Submit Form
</Button>

// Link button (internal navigation)
<Button variant="primary" href="/docs">
  View Documentation
</Button>

// Link button (external, opens in new tab)
<Button variant="primary" href="https://xrpl.org" target="_blank">
  Visit XRPL.org
</Button>`}</code>
          </pre>
        </div>
      </section>

      {/* Design Specifications */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Design Specifications</h2>
          <h6 className="eyebrow mb-3">Visual Details</h6>
        </div>
        <PageGrid>
          <PageGridRow>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <h5 className="mb-4">Typography</h5>
              <ul>
                <li>Font: Booton, sans-serif</li>
                <li>Size: 16px</li>
                <li>Weight: 400</li>
                <li>Line Height: 23.2px</li>
                <li>Letter Spacing: 0px</li>
              </ul>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <h5 className="mb-4">Spacing & Layout</h5>
              <ul>
                <li>Border Radius: 100px (fully rounded)</li>
                <li>Icon Size: 15px × 14px</li>
                <li>Icon Gap: 16px (default), 22px (hover/focus desktop), 21px (hover/focus mobile)</li>
                <li>Min Height: 40px (touch target)</li>
              </ul>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
        <div className="mt-10">
          <h5 className="mb-4">State Colors - Green Theme</h5>
          <div style={{ width: '100%', backgroundColor: '#FFFFFF' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '2px solid #E0E0E1' }}>
              <div style={{ padding: '12px', fontWeight: 'bold' }}>State</div>
              <div style={{ padding: '12px', fontWeight: 'bold' }}>Text Color</div>
              <div style={{ padding: '12px', fontWeight: 'bold' }}>Background Color</div>
              <div style={{ padding: '12px', fontWeight: 'bold' }}>Border</div>
            </div>
            {/* Rows */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
              <div style={{ padding: '12px' }}>Enabled</div>
              <div style={{ padding: '12px' }}>#141414 (Neutral Black)</div>
              <div style={{ padding: '12px' }}>#21E46B (Green 300)</div>
              <div style={{ padding: '12px' }}>None</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
              <div style={{ padding: '12px' }}>Hover</div>
              <div style={{ padding: '12px' }}>#141414 (Neutral Black)</div>
              <div style={{ padding: '12px' }}>#70EE97 (Green 200)</div>
              <div style={{ padding: '12px' }}>None</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
              <div style={{ padding: '12px' }}>Focus</div>
              <div style={{ padding: '12px' }}>#141414 (Neutral Black)</div>
              <div style={{ padding: '12px' }}>#70EE97 (Green 200)</div>
              <div style={{ padding: '12px' }}>2px solid #141414</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
              <div style={{ padding: '12px' }}>Active</div>
              <div style={{ padding: '12px' }}>#141414 (Neutral Black)</div>
              <div style={{ padding: '12px' }}>#21E46B (Green 300)</div>
              <div style={{ padding: '12px' }}>None</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
              <div style={{ padding: '12px' }}>Disabled</div>
              <div style={{ padding: '12px' }}>#838386 (Gray 500)</div>
              <div style={{ padding: '12px' }}>#E0E0E1 (Gray 200)</div>
              <div style={{ padding: '12px' }}>None</div>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <h5 className="mb-4">State Colors - Black Theme</h5>
          <div style={{ width: '100%', backgroundColor: '#FFFFFF' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '2px solid #E0E0E1' }}>
              <div style={{ padding: '12px', fontWeight: 'bold' }}>State</div>
              <div style={{ padding: '12px', fontWeight: 'bold' }}>Text Color</div>
              <div style={{ padding: '12px', fontWeight: 'bold' }}>Background Color</div>
              <div style={{ padding: '12px', fontWeight: 'bold' }}>Border</div>
            </div>
            {/* Rows */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
              <div style={{ padding: '12px' }}>Enabled</div>
              <div style={{ padding: '12px' }}>#FFFFFF (White)</div>
              <div style={{ padding: '12px' }}>#141414 (Neutral Black)</div>
              <div style={{ padding: '12px' }}>None</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
              <div style={{ padding: '12px' }}>Hover</div>
              <div style={{ padding: '12px' }}>#FFFFFF (White)</div>
              <div style={{ padding: '12px' }}>rgba(20, 20, 20, 0.8) (80% Black)</div>
              <div style={{ padding: '12px' }}>None</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
              <div style={{ padding: '12px' }}>Focus</div>
              <div style={{ padding: '12px' }}>#FFFFFF (White)</div>
              <div style={{ padding: '12px' }}>rgba(20, 20, 20, 0.8) (80% Black)</div>
              <div style={{ padding: '12px' }}>2px solid #141414</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
              <div style={{ padding: '12px' }}>Active</div>
              <div style={{ padding: '12px' }}>#FFFFFF (White)</div>
              <div style={{ padding: '12px' }}>#141414 (Neutral Black)</div>
              <div style={{ padding: '12px' }}>None</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
              <div style={{ padding: '12px' }}>Disabled</div>
              <div style={{ padding: '12px' }}>#838386 (Gray 500)</div>
              <div style={{ padding: '12px' }}>#E0E0E1 (Gray 200)</div>
              <div style={{ padding: '12px' }}>None</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
