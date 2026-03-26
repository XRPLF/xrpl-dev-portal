import * as React from 'react';
import clsx from 'clsx';
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
          The Tertiary button is a text-only style for low-emphasis actions: no border, transparent background, optional
          arrow icon. On the green theme, hover/focus use Green 500 with underline; pressed/active returns label and icon
          to Green 400. On the black theme, pressed/active uses <strong>#434343</strong> for text and icon stroke. Light
          mode focus uses a 2px <strong>neutral black</strong> outline (not green); dark mode uses a white outline.
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
              <div>
                <h5 className="mb-4">Enabled State</h5>
                <p className="mb-4 text-muted">Text-only style with green text color, no background or border.</p>
                <Button variant="tertiary" onClick={handleClick}>
                  Enabled Button
                </Button>
              </div>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div>
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
            Hover or focus: underline + Green 500 text; focus adds a 2px neutral black outline (negative offset). Pressed:
            Green 400 text and arrow. Typography uses the Body R token (18px on large screens, 16px below the xl
            breakpoint).
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
              <div>
                <h5 className="mb-4">Enabled State</h5>
                <p className="mb-4 text-muted">Black text with transparent background.</p>
                <Button variant="tertiary" color="black" onClick={handleClick}>
                  Enabled Button
                </Button>
              </div>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div>
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
            Hover/focus: black text with underline. Pressed: text and arrow use <strong>#434343</strong>.
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
                <li>Focus: 2px neutral black outline (green theme); white outline in dark mode</li>
                <li>Disabled buttons are not focusable</li>
              </ul>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <h5 className="mb-4">Screen Reader Support</h5>
              <ul>
                <li>Button labels are announced</li>
                <li>Disabled state: <code>disabled</code> + <code>aria-disabled</code> on <code>&lt;button&gt;</code></li>
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
              <strong>Disabled:</strong> Gray 400 (#8A919A) — icon hidden when disabled
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
        <div className="p-4 br-8" style={{ backgroundColor: 'var(--code-bg, #1e1e1e)', color: 'var(--code-text, #d4d4d4)' }}>
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
                <li>Body R token: 18px / 26.1px / -0.5px letter-spacing at lg+; 16px / 23.2px / 0 below xl</li>
                <li>Weight: 400</li>
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
          <div className={clsx('grid-showcase-breakpoints-table', 'grid-showcase-breakpoints-table--4col')}>
            <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__header">
              <div className="grid-showcase-breakpoints-table__cell">State</div>
              <div className="grid-showcase-breakpoints-table__cell">Text Color</div>
              <div className="grid-showcase-breakpoints-table__cell">Background</div>
              <div className="grid-showcase-breakpoints-table__cell">Text Decoration</div>
            </div>
            <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
              <div className="grid-showcase-breakpoints-table__cell">Enabled</div>
              <div className="grid-showcase-breakpoints-table__cell">#0DAA3E (Green 400)</div>
              <div className="grid-showcase-breakpoints-table__cell">Transparent</div>
              <div className="grid-showcase-breakpoints-table__cell">None</div>
            </div>
            <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
              <div className="grid-showcase-breakpoints-table__cell">Hover</div>
              <div className="grid-showcase-breakpoints-table__cell">#078139 (Green 500)</div>
              <div className="grid-showcase-breakpoints-table__cell">Transparent</div>
              <div className="grid-showcase-breakpoints-table__cell">Underline</div>
            </div>
            <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
              <div className="grid-showcase-breakpoints-table__cell">Focus</div>
              <div className="grid-showcase-breakpoints-table__cell">#078139 (Green 500)</div>
              <div className="grid-showcase-breakpoints-table__cell">Transparent</div>
              <div className="grid-showcase-breakpoints-table__cell">Underline + 2px #141414 outline (inset)</div>
            </div>
            <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
              <div className="grid-showcase-breakpoints-table__cell">Active (pressed)</div>
              <div className="grid-showcase-breakpoints-table__cell">#0DAA3E (Green 400) — label + arrow</div>
              <div className="grid-showcase-breakpoints-table__cell">Transparent</div>
              <div className="grid-showcase-breakpoints-table__cell">Underline</div>
            </div>
            <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
              <div className="grid-showcase-breakpoints-table__cell">Disabled</div>
              <div className="grid-showcase-breakpoints-table__cell">#8A919A (Gray 400)</div>
              <div className="grid-showcase-breakpoints-table__cell">Transparent</div>
              <div className="grid-showcase-breakpoints-table__cell">None (no icon)</div>
            </div>
          </div>
          <p className="mt-4 text-muted">
            <strong>Dark mode (green tertiary):</strong> Green 300 default, Green 200 hover/focus, Green 400 pressed; focus outline is white.{' '}
            <strong>Dark mode (black tertiary):</strong> green palette when themed; pressed uses <strong>#434343</strong> for text and icon where the black variant applies.
          </p>
        </div>
        <div className="mt-10">
          <h5 className="mb-4">State Colors - Black Theme</h5>
          <div className={clsx('grid-showcase-breakpoints-table', 'grid-showcase-breakpoints-table--4col')}>
            <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__header">
              <div className="grid-showcase-breakpoints-table__cell">State</div>
              <div className="grid-showcase-breakpoints-table__cell">Text Color</div>
              <div className="grid-showcase-breakpoints-table__cell">Background</div>
              <div className="grid-showcase-breakpoints-table__cell">Text Decoration</div>
            </div>
            <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
              <div className="grid-showcase-breakpoints-table__cell">Enabled</div>
              <div className="grid-showcase-breakpoints-table__cell">#141414 (Neutral Black)</div>
              <div className="grid-showcase-breakpoints-table__cell">Transparent</div>
              <div className="grid-showcase-breakpoints-table__cell">None</div>
            </div>
            <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
              <div className="grid-showcase-breakpoints-table__cell">Hover</div>
              <div className="grid-showcase-breakpoints-table__cell">#141414 (Neutral Black)</div>
              <div className="grid-showcase-breakpoints-table__cell">Transparent</div>
              <div className="grid-showcase-breakpoints-table__cell">Underline</div>
            </div>
            <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
              <div className="grid-showcase-breakpoints-table__cell">Focus</div>
              <div className="grid-showcase-breakpoints-table__cell">#141414 (Neutral Black)</div>
              <div className="grid-showcase-breakpoints-table__cell">Transparent</div>
              <div className="grid-showcase-breakpoints-table__cell">Underline + 2px Black outline</div>
            </div>
            <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
              <div className="grid-showcase-breakpoints-table__cell">Active (pressed)</div>
              <div className="grid-showcase-breakpoints-table__cell">#434343 — label + arrow</div>
              <div className="grid-showcase-breakpoints-table__cell">Transparent</div>
              <div className="grid-showcase-breakpoints-table__cell">Underline</div>
            </div>
            <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
              <div className="grid-showcase-breakpoints-table__cell">Disabled</div>
              <div className="grid-showcase-breakpoints-table__cell">#8A919A (Gray 400)</div>
              <div className="grid-showcase-breakpoints-table__cell">Transparent</div>
              <div className="grid-showcase-breakpoints-table__cell">None (no icon)</div>
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
        <div className={clsx('grid-showcase-breakpoints-table', 'grid-showcase-breakpoints-table--4col')}>
          <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__header">
            <div className="grid-showcase-breakpoints-table__cell">Aspect</div>
            <div className="grid-showcase-breakpoints-table__cell">Primary</div>
            <div className="grid-showcase-breakpoints-table__cell">Secondary</div>
            <div className="grid-showcase-breakpoints-table__cell">Tertiary</div>
          </div>
          <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
            <div className="grid-showcase-breakpoints-table__cell">Background (Enabled)</div>
            <div className="grid-showcase-breakpoints-table__cell">Green 300 (#21E46B)</div>
            <div className="grid-showcase-breakpoints-table__cell">Transparent</div>
            <div className="grid-showcase-breakpoints-table__cell">Transparent</div>
          </div>
          <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
            <div className="grid-showcase-breakpoints-table__cell">Background (Hover)</div>
            <div className="grid-showcase-breakpoints-table__cell">Green 200 (#70EE97)</div>
            <div className="grid-showcase-breakpoints-table__cell">Green 100 (#EAFCF1)</div>
            <div className="grid-showcase-breakpoints-table__cell">Transparent</div>
          </div>
          <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
            <div className="grid-showcase-breakpoints-table__cell">Border (Enabled)</div>
            <div className="grid-showcase-breakpoints-table__cell">None</div>
            <div className="grid-showcase-breakpoints-table__cell">2px Green 400</div>
            <div className="grid-showcase-breakpoints-table__cell">None</div>
          </div>
          <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
            <div className="grid-showcase-breakpoints-table__cell">Text Color (Enabled)</div>
            <div className="grid-showcase-breakpoints-table__cell">Black (#141414)</div>
            <div className="grid-showcase-breakpoints-table__cell">Green 400 (#0DAA3E)</div>
            <div className="grid-showcase-breakpoints-table__cell">Green 400 (#0DAA3E)</div>
          </div>
          <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
            <div className="grid-showcase-breakpoints-table__cell">Text Decoration</div>
            <div className="grid-showcase-breakpoints-table__cell">None</div>
            <div className="grid-showcase-breakpoints-table__cell">None</div>
            <div className="grid-showcase-breakpoints-table__cell">Underline when hover/focus/active (except disabled)</div>
          </div>
          <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
            <div className="grid-showcase-breakpoints-table__cell">Typography Token</div>
            <div className="grid-showcase-breakpoints-table__cell">Label R (16px)</div>
            <div className="grid-showcase-breakpoints-table__cell">Label R (16px)</div>
            <div className="grid-showcase-breakpoints-table__cell">Body R (18px)</div>
          </div>
          <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
            <div className="grid-showcase-breakpoints-table__cell">Focus Indicator</div>
            <div className="grid-showcase-breakpoints-table__cell">2px Black border</div>
            <div className="grid-showcase-breakpoints-table__cell">2px Black outline</div>
            <div className="grid-showcase-breakpoints-table__cell">2px Black outline (green tertiary)</div>
          </div>
          <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
            <div className="grid-showcase-breakpoints-table__cell">Disabled Background</div>
            <div className="grid-showcase-breakpoints-table__cell">Gray 200 (#E6EAF0)</div>
            <div className="grid-showcase-breakpoints-table__cell">Transparent</div>
            <div className="grid-showcase-breakpoints-table__cell">Transparent</div>
          </div>
          <div className="grid-showcase-breakpoints-table__grid grid-showcase-breakpoints-table__row">
            <div className="grid-showcase-breakpoints-table__cell">Arrow Icon</div>
            <div className="grid-showcase-breakpoints-table__cell">✅ Shared</div>
            <div className="grid-showcase-breakpoints-table__cell">✅ Shared</div>
            <div className="grid-showcase-breakpoints-table__cell">✅ Shared</div>
          </div>
        </div>
      </section>
    </div>
  );
}
