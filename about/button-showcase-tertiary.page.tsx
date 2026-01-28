import * as React from 'react';
import { Button } from 'shared/components/Button';
import { PageGrid, PageGridCol, PageGridRow } from 'shared/components/PageGrid/page-grid';

export const frontmatter = {
  seo: {
    title: 'BDS Tertiary Button Component Showcase',
    description: 'Interactive showcase of the Brand Design System Tertiary Button component with all states and variants.',
  },
};

export default function ButtonShowcaseTertiary() {
  const [clickCount, setClickCount] = React.useState(0);

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
  };

  return (
    <div className="landing">
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse col-lg-8 mx-auto">
          <h1 className="mb-0">BDS Tertiary Button</h1>
          <h6 className="eyebrow mb-3">Brand Design System</h6>
        </div>
        <p className="col-lg-8 mx-auto mt-10">
          The Tertiary button is a text-only button style used for low-emphasis or contextual actions. It features no
          background fill or border, appearing as a simple text link with optional arrow icon. This variant provides the
          lowest visual emphasis while maintaining brand consistency through green text colors.
        </p>
      </section>

      {/* Basic Usage */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Basic Usage</h2>
          <h6 className="eyebrow mb-3">Tertiary Variant</h6>
        </div>
        <div className="d-flex flex-wrap align-items-center">
          <Button variant="tertiary" onClick={handleClick} className="me-4 mb-4">
            View Details
          </Button>
          <Button variant="tertiary" onClick={handleClick} className="me-4 mb-4">
            Learn More
          </Button>
          <Button variant="tertiary" onClick={handleClick} className="mb-4">
            Read More
          </Button>
        </div>
        {clickCount > 0 && (
          <p className="mt-4 text-muted">
            Button clicked {clickCount} time{clickCount !== 1 ? 's' : ''}
          </p>
        )}
      </section>

      {/* Primary vs Secondary vs Tertiary Comparison */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Primary vs Secondary vs Tertiary</h2>
          <h6 className="eyebrow mb-3">Visual Hierarchy</h6>
        </div>
        <p className="mb-4 text-muted">
          Use Primary for main actions, Secondary for supporting actions, and Tertiary for low-emphasis or contextual
          actions to create clear visual hierarchy.
        </p>
        <div className="d-flex flex-wrap align-items-center">
          <Button variant="primary" onClick={handleClick} className="me-4 mb-4">
            Get Started
          </Button>
          <Button variant="secondary" onClick={handleClick} className="me-4 mb-4">
            Learn More
          </Button>
          <Button variant="tertiary" onClick={handleClick} className="mb-4">
            View Details
          </Button>
        </div>
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
                <p className="mb-4 text-muted">Text-only style with green text color, no background or border.</p>
                <Button variant="tertiary" onClick={handleClick}>
                  Enabled Button
                </Button>
              </div>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <h5 className="mb-4">Disabled State</h5>
                <p className="mb-4 text-muted">Gray text indicates non-interactive state. Icon is hidden.</p>
                <Button variant="tertiary" disabled>
                  Disabled Button
                </Button>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
        <div className="mt-10">
          <h5 className="mb-4">Hover & Focus States</h5>
          <p className="mb-4 text-muted">
            Hover over the buttons or use Tab to focus them. Notice the underline appears and text color darkens to
            Green 500. The focus state adds a green outline around the text.
          </p>
          <div className="d-flex flex-wrap">
            <Button variant="tertiary" onClick={handleClick} className="me-4 mb-4">
              Hover Me
            </Button>
            <Button variant="tertiary" onClick={handleClick} className="mb-4">
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
          Tertiary buttons can use a black color theme with black text instead of green.
        </p>
        <div className="d-flex flex-wrap align-items-center">
          <Button variant="tertiary" color="black" onClick={handleClick} className="me-4 mb-4">
            Black Tertiary
          </Button>
          <Button variant="tertiary" color="black" onClick={handleClick} className="me-4 mb-4">
            View Details
          </Button>
          <Button variant="tertiary" color="black" onClick={handleClick} className="mb-4">
            Learn More
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
                <p className="mb-4 text-muted">Black text with transparent background.</p>
                <Button variant="tertiary" color="black" onClick={handleClick}>
                  Enabled Button
                </Button>
              </div>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <h5 className="mb-4">Disabled State</h5>
                <p className="mb-4 text-muted">Same disabled styling as green variant.</p>
                <Button variant="tertiary" color="black" disabled>
                  Disabled Button
                </Button>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
        <div className="mt-10">
          <h5 className="mb-4">Hover & Focus States</h5>
          <p className="mb-4 text-muted">
            Hover over the buttons or use Tab to focus them. Notice the underline appears on hover/focus.
          </p>
          <div className="d-flex flex-wrap">
            <Button variant="tertiary" color="black" onClick={handleClick} className="me-4 mb-4">
              Hover Me
            </Button>
            <Button variant="tertiary" color="black" onClick={handleClick} className="mb-4">
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
          <Button variant="tertiary" color="green" onClick={handleClick} className="me-4 mb-4">
            Green Tertiary
          </Button>
          <Button variant="tertiary" color="black" onClick={handleClick} className="mb-4">
            Black Tertiary
          </Button>
        </div>
      </section>

      {/* Without Icon */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Without Icon</h2>
          <h6 className="eyebrow mb-3">Icon Control</h6>
        </div>
        <p className="mb-4 text-muted">Tertiary buttons can also be rendered without the arrow icon.</p>
        <div className="d-flex flex-wrap">
          <Button variant="tertiary" showIcon={false} onClick={handleClick} className="me-4 mb-4">
            No Icon Button
          </Button>
          <Button variant="tertiary" showIcon={true} onClick={handleClick} className="mb-4">
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
        <p className="mb-4 text-muted">Tertiary buttons can be used for form actions like cancel or reset.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Form submitted!');
          }}
          className="d-flex flex-wrap"
        >
          <Button variant="primary" type="submit" className="me-4 mb-4">
            Submit
          </Button>
          <Button variant="tertiary" type="reset" className="me-4 mb-4">
            Reset
          </Button>
          <Button variant="tertiary" type="button" onClick={() => alert('Cancelled!')} className="mb-4">
            Cancel
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
            <strong>Desktop (≥1024px):</strong> Padding: 8px 20px, Gap: 16px
          </li>
          <li>
            <strong>Tablet/Mobile (≤1023px):</strong> Padding: 8px 16px, Gap: 16px
          </li>
          <li>
            <strong>Hover/Focus:</strong> Gap increases (22px desktop, 21px mobile) with adjusted padding
          </li>
        </ul>
        <div className="d-flex flex-wrap">
          <Button variant="tertiary" onClick={handleClick} className="me-4 mb-4">
            Responsive Button
          </Button>
          <Button variant="tertiary" onClick={handleClick} className="mb-4">
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
                <li>Focus indicator: 2px green outline (Green 500)</li>
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
              <strong>Enabled:</strong> Green 400 (#0DAA3E) on White = 4.52:1 (AA for large text)
            </li>
            <li>
              <strong>Hover/Focus:</strong> Green 500 (#078139) on White = 5.12:1 (AA)
            </li>
            <li>
              <strong>Disabled:</strong> Gray 400 (#A2A2A4) on White = reduced contrast (acceptable for disabled state)
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

// Basic tertiary button (green theme - default)
<Button variant="tertiary" onClick={handleClick}>
  View Details
</Button>

// Black color theme
<Button variant="tertiary" color="black" onClick={handleClick}>
  View Details
</Button>

// Disabled state
<Button variant="tertiary" disabled>
  Unavailable
</Button>

// Without icon
<Button variant="tertiary" showIcon={false}>
  Cancel
</Button>

// Primary + Secondary + Tertiary pairing
<Button variant="primary" type="submit">
  Submit
</Button>
<Button variant="secondary" type="button">
  Learn More
</Button>
<Button variant="tertiary" type="button">
  Cancel
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
                <li>Size: 18px (Body R token - different from Primary/Secondary)</li>
                <li>Weight: 400</li>
                <li>Line Height: 26.1px</li>
                <li>Letter Spacing: -0.5px</li>
              </ul>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <h5 className="mb-4">Spacing & Layout</h5>
              <ul>
                <li>Border Radius: 100px (fully rounded - inherited but not visually apparent)</li>
                <li>Border: None</li>
                <li>Background: Transparent</li>
                <li>Icon Size: 15px × 14px</li>
                <li>Icon Gap: 16px (default), 22px (hover/focus desktop), 21px (hover/focus mobile)</li>
                <li>Max Height: 40px</li>
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
              <div style={{ padding: '12px', fontWeight: 'bold' }}>Background</div>
              <div style={{ padding: '12px', fontWeight: 'bold' }}>Text Decoration</div>
            </div>
            {/* Rows */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
              <div style={{ padding: '12px' }}>Enabled</div>
              <div style={{ padding: '12px' }}>#0DAA3E (Green 400)</div>
              <div style={{ padding: '12px' }}>Transparent</div>
              <div style={{ padding: '12px' }}>None</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
              <div style={{ padding: '12px' }}>Hover</div>
              <div style={{ padding: '12px' }}>#078139 (Green 500)</div>
              <div style={{ padding: '12px' }}>Transparent</div>
              <div style={{ padding: '12px' }}>Underline</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
              <div style={{ padding: '12px' }}>Focus</div>
              <div style={{ padding: '12px' }}>#078139 (Green 500)</div>
              <div style={{ padding: '12px' }}>Transparent</div>
              <div style={{ padding: '12px' }}>Underline + 2px Green 500 outline</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
              <div style={{ padding: '12px' }}>Active</div>
              <div style={{ padding: '12px' }}>#0DAA3E (Green 400)</div>
              <div style={{ padding: '12px' }}>Transparent</div>
              <div style={{ padding: '12px' }}>Underline</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
              <div style={{ padding: '12px' }}>Disabled</div>
              <div style={{ padding: '12px' }}>#A2A2A4 (Gray 400)</div>
              <div style={{ padding: '12px' }}>Transparent</div>
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
              <div style={{ padding: '12px', fontWeight: 'bold' }}>Background</div>
              <div style={{ padding: '12px', fontWeight: 'bold' }}>Text Decoration</div>
            </div>
            {/* Rows */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
              <div style={{ padding: '12px' }}>Enabled</div>
              <div style={{ padding: '12px' }}>#141414 (Neutral Black)</div>
              <div style={{ padding: '12px' }}>Transparent</div>
              <div style={{ padding: '12px' }}>None</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
              <div style={{ padding: '12px' }}>Hover</div>
              <div style={{ padding: '12px' }}>#141414 (Neutral Black)</div>
              <div style={{ padding: '12px' }}>Transparent</div>
              <div style={{ padding: '12px' }}>Underline</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
              <div style={{ padding: '12px' }}>Focus</div>
              <div style={{ padding: '12px' }}>#141414 (Neutral Black)</div>
              <div style={{ padding: '12px' }}>Transparent</div>
              <div style={{ padding: '12px' }}>Underline + 2px Black outline</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
              <div style={{ padding: '12px' }}>Active</div>
              <div style={{ padding: '12px' }}>#141414 (Neutral Black)</div>
              <div style={{ padding: '12px' }}>Transparent</div>
              <div style={{ padding: '12px' }}>Underline</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
              <div style={{ padding: '12px' }}>Disabled</div>
              <div style={{ padding: '12px' }}>#A2A2A4 (Gray 400)</div>
              <div style={{ padding: '12px' }}>Transparent</div>
              <div style={{ padding: '12px' }}>None</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differences from Primary/Secondary */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Key Differences from Primary/Secondary</h2>
          <h6 className="eyebrow mb-3">Comparison</h6>
        </div>
        <div style={{ width: '100%', backgroundColor: '#FFFFFF' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '2px solid #E0E0E1' }}>
            <div style={{ padding: '12px', fontWeight: 'bold' }}>Aspect</div>
            <div style={{ padding: '12px', fontWeight: 'bold' }}>Primary</div>
            <div style={{ padding: '12px', fontWeight: 'bold' }}>Secondary</div>
            <div style={{ padding: '12px', fontWeight: 'bold' }}>Tertiary</div>
          </div>
          {/* Rows */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
            <div style={{ padding: '12px' }}>Background (Enabled)</div>
            <div style={{ padding: '12px' }}>Green 300 (#21E46B)</div>
            <div style={{ padding: '12px' }}>Transparent</div>
            <div style={{ padding: '12px' }}>Transparent</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
            <div style={{ padding: '12px' }}>Background (Hover)</div>
            <div style={{ padding: '12px' }}>Green 200 (#70EE97)</div>
            <div style={{ padding: '12px' }}>Green 100 (#EAFCF1)</div>
            <div style={{ padding: '12px' }}>Transparent</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
            <div style={{ padding: '12px' }}>Border (Enabled)</div>
            <div style={{ padding: '12px' }}>None</div>
            <div style={{ padding: '12px' }}>2px Green 400</div>
            <div style={{ padding: '12px' }}>None</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
            <div style={{ padding: '12px' }}>Text Color (Enabled)</div>
            <div style={{ padding: '12px' }}>Black (#141414)</div>
            <div style={{ padding: '12px' }}>Green 400 (#0DAA3E)</div>
            <div style={{ padding: '12px' }}>Green 400 (#0DAA3E)</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
            <div style={{ padding: '12px' }}>Text Decoration</div>
            <div style={{ padding: '12px' }}>None</div>
            <div style={{ padding: '12px' }}>None</div>
            <div style={{ padding: '12px' }}>Underline (hover/focus/active)</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
            <div style={{ padding: '12px' }}>Typography Token</div>
            <div style={{ padding: '12px' }}>Label R (16px)</div>
            <div style={{ padding: '12px' }}>Label R (16px)</div>
            <div style={{ padding: '12px' }}>Body R (18px)</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
            <div style={{ padding: '12px' }}>Focus Indicator</div>
            <div style={{ padding: '12px' }}>2px Black border</div>
            <div style={{ padding: '12px' }}>2px Black outline</div>
            <div style={{ padding: '12px' }}>2px Green 500 outline</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E0E0E1' }}>
            <div style={{ padding: '12px' }}>Disabled Background</div>
            <div style={{ padding: '12px' }}>Gray 200 (#E0E0E1)</div>
            <div style={{ padding: '12px' }}>Transparent</div>
            <div style={{ padding: '12px' }}>Transparent</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
            <div style={{ padding: '12px' }}>Arrow Icon</div>
            <div style={{ padding: '12px' }}>✅ Shared</div>
            <div style={{ padding: '12px' }}>✅ Shared</div>
            <div style={{ padding: '12px' }}>✅ Shared</div>
          </div>
        </div>
      </section>
    </div>
  );
}
