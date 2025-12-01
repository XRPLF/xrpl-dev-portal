import * as React from 'react';
import { Button } from 'shared/components/Button';
import { PageGrid, PageGridCol, PageGridRow } from 'shared/components/page-grid';

export const frontmatter = {
  seo: {
    title: 'BDS Button Component Showcase',
    description: 'Interactive showcase of the Brand Design System Button component with all states and variants.',
  },
};

export default function ButtonShowcase() {
  const [clickCount, setClickCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
  };

  const handleAsyncClick = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
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
            <Button variant="primary" onClick={handleClick} className="me-4 mb-4">
              Focus Me (Tab)
            </Button>
            <Button variant="primary" onClick={handleClick} className="mb-4">
              Active State (Click)
            </Button>
          </div>
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

      {/* Loading State Simulation */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Async Actions</h2>
          <h6 className="eyebrow mb-3">Loading States</h6>
        </div>
        <p className="mb-4 text-muted">
          Example of handling async actions. The button is disabled during the async operation.
        </p>
        <Button variant="primary" disabled={isLoading} onClick={handleAsyncClick}>
          {isLoading ? 'Loading...' : 'Async Action'}
        </Button>
        {clickCount > 0 && (
          <p className="mt-4 text-muted">Async action completed {clickCount} time{clickCount !== 1 ? 's' : ''}</p>
        )}
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

// Basic usage
<Button variant="primary" onClick={handleClick}>
  Get Started
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
          <h5 className="mb-4">State Colors</h5>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>State</th>
                <th>Text Color</th>
                <th>Background Color</th>
                <th>Border</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Enabled</td>
                <td>#141414 (Neutral Black)</td>
                <td>#21E46B (Green 300)</td>
                <td>None</td>
              </tr>
              <tr>
                <td>Hover</td>
                <td>#141414 (Neutral Black)</td>
                <td>#70EE97 (Green 200)</td>
                <td>None</td>
              </tr>
              <tr>
                <td>Focus</td>
                <td>#141414 (Neutral Black)</td>
                <td>#70EE97 (Green 200)</td>
                <td>2px solid #141414</td>
              </tr>
              <tr>
                <td>Active</td>
                <td>#141414 (Neutral Black)</td>
                <td>#21E46B (Green 300)</td>
                <td>None</td>
              </tr>
              <tr>
                <td>Disabled</td>
                <td>#838386 (Gray 500)</td>
                <td>#E0E0E1 (Gray 200)</td>
                <td>None</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
