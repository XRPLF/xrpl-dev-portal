import * as React from 'react';
import { PageGrid, PageGridRow, PageGridCol } from 'shared/components/PageGrid/page-grid';
import { Divider } from 'shared/components/Divider';

export const frontmatter = {
  seo: {
    title: 'Typography Showcase',
    description: 'A comprehensive showcase of the XRPL.org typography system including displays, headings, subheads, body text, and labels.',
  },
};

export default function TypographyShowcase() {
  return (
    <div className="landing">
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse col-lg-8 mx-auto">
          <h1 className="mb-0">Typography System</h1>
          <h6 className="eyebrow mb-3">Brand Design System</h6>
        </div>
        <p className="col-lg-8 mx-auto mt-10">
          A comprehensive overview of the XRPL typography system featuring responsive type scales, 
          font families (Booton and Tobias), and semantic styling for consistent visual hierarchy.
        </p>
      </section>

      {/* Display Styles */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Display Styles</h2>
          <h6 className="eyebrow mb-3">Largest Headlines</h6>
        </div>
        <p className="mb-10 text-muted">
          Display styles are used for the largest, most prominent headlines. They feature negative letter spacing 
          and are optimized for impact at large sizes.
        </p>
        
        <div className="d-flex flex-column gap-10">
          <div>
            <div className="mb-3">
              <code className="text-muted">display-lg</code>
              <span className="text-muted mx-2">·</span>
              <span className="text-muted">Booton Light (300)</span>
            </div>
            <div className="display-lg">Display Large</div>
            <div className="mt-3 text-muted">
              <small>Mobile: 64px · Tablet: 72px · Desktop: 92px · XL: 112px</small>
            </div>
          </div>

          <div>
            <div className="mb-3">
              <code className="text-muted">display-md</code>
              <span className="text-muted mx-2">·</span>
              <span className="text-muted">Tobias Light (300)</span>
            </div>
            <div className="display-md">Display Medium</div>
            <div className="mt-3 text-muted">
              <small>Mobile: 48px · Tablet: 60px · Desktop: 72px</small>
            </div>
          </div>

          <div>
            <div className="mb-3">
              <code className="text-muted">display-sm</code>
              <span className="text-muted mx-2">·</span>
              <span className="text-muted">Tobias Light (300)</span>
            </div>
            <div className="display-sm">Display Small</div>
            <div className="mt-3 text-muted">
              <small>Mobile: 40px · Tablet: 56px · Desktop: 64px</small>
            </div>
          </div>
        </div>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Heading Styles */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Heading Styles</h2>
          <h6 className="eyebrow mb-3">Section Headers</h6>
        </div>
        <p className="mb-10 text-muted">
          Heading styles are used for major section headers and page titles. All headings use the Tobias monospace 
          font family for a distinctive technical aesthetic.
        </p>

        <PageGrid>
          <PageGridRow>
            <PageGridCol span={{ base: 4, lg: 4 }}>
              <div className="mb-6">
                <div className="mb-3">
                  <code className="text-muted">heading-lg / .h-lg</code>
                </div>
                <div className="h-lg">Heading Large</div>
                <div className="mt-3 text-muted">
                  <small>Mobile: 36px · Tablet: 42px · Desktop: 48px</small>
                </div>
              </div>
            </PageGridCol>

            <PageGridCol span={{ base: 4, lg: 4 }}>
              <div className="mb-6">
                <div className="mb-3">
                  <code className="text-muted">heading-md / .h-md</code>
                </div>
                <div className="h-md">Heading Medium</div>
                <div className="mt-3 text-muted">
                  <small>Mobile: 32px · Tablet: 36px · Desktop: 40px</small>
                </div>
              </div>
            </PageGridCol>

            <PageGridCol span={{ base: 4, lg: 4 }}>
              <div className="mb-6">
                <div className="mb-3">
                  <code className="text-muted">heading-sm / .h-sm</code>
                </div>
                <div className="h-sm">Heading Small</div>
                <div className="mt-3 text-muted">
                  <small>Mobile: 24px · Tablet: 28px · Desktop: 32px</small>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <div className="mt-10">
          <h5 className="mb-4">Legacy H1-H6 Styles</h5>
          <p className="mb-6 text-muted">
            Traditional semantic HTML heading tags are also supported with responsive sizing.
          </p>
          
          <div className="d-flex flex-column gap-6">
            <div>
              <code className="text-muted mb-2 d-block">h1, .h1</code>
              <h1 className="mb-2">The quick brown fox jumps</h1>
              <small className="text-muted">Desktop: 62px / Mobile: 42px</small>
            </div>
            <div>
              <code className="text-muted mb-2 d-block">h2, .h2</code>
              <h2 className="mb-2">The quick brown fox jumps</h2>
              <small className="text-muted">Desktop: 56px / Mobile: 28px</small>
            </div>
            <div>
              <code className="text-muted mb-2 d-block">h3, .h3</code>
              <h3 className="mb-2">The quick brown fox jumps</h3>
              <small className="text-muted">Desktop: 48px / Mobile: 24px</small>
            </div>
            <div>
              <code className="text-muted mb-2 d-block">h4, .h4</code>
              <h4 className="mb-2">The quick brown fox jumps over the lazy dog</h4>
              <small className="text-muted">Desktop: 32px / Mobile: 20px</small>
            </div>
            <div>
              <code className="text-muted mb-2 d-block">h5, .h5</code>
              <h5 className="mb-2">The quick brown fox jumps over the lazy dog</h5>
              <small className="text-muted">Desktop: 24px / Mobile: 18px</small>
            </div>
            <div>
              <code className="text-muted mb-2 d-block">h6, .h6</code>
              <h6 className="mb-2">The quick brown fox jumps over the lazy dog</h6>
              <small className="text-muted">Desktop: 20px / Mobile: 16px</small>
            </div>
          </div>
        </div>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Subhead Styles */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Subhead Styles</h2>
          <h6 className="eyebrow mb-3">Supporting Headers</h6>
        </div>
        <p className="mb-10 text-muted">
          Subheads provide intermediate hierarchy between headings and body text. Available in two weights: 
          Regular (400) for emphasis and Light (300) for subtler styling.
        </p>

        <div className="d-flex flex-column gap-10">
          {/* Large Subheads */}
          <div>
            <h5 className="mb-6">Large Subheads</h5>
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={{ base: 4, lg: 6 }}>
                  <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                    <code className="text-muted mb-3 d-block">subhead-lg-r / .sh-lg-r</code>
                    <div className="sh-lg-r">Regular Weight Subhead</div>
                    <div className="mt-3 text-muted">
                      <small>Mobile: 24px · Tablet: 28px · Desktop: 32px · Weight: 400</small>
                    </div>
                  </div>
                </PageGridCol>
                <PageGridCol span={{ base: 4, lg: 6 }}>
                  <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                    <code className="text-muted mb-3 d-block">subhead-lg-l / .sh-lg-l</code>
                    <div className="sh-lg-l">Light Weight Subhead</div>
                    <div className="mt-3 text-muted">
                      <small>Mobile: 24px · Tablet: 28px · Desktop: 32px · Weight: 300</small>
                    </div>
                  </div>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
          </div>

          {/* Medium Subheads */}
          <div>
            <h5 className="mb-6">Medium Subheads</h5>
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={{ base: 4, lg: 6 }}>
                  <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                    <code className="text-muted mb-3 d-block">subhead-md-r / .sh-md-r</code>
                    <div className="sh-md-r">Regular Weight Subhead</div>
                    <div className="mt-3 text-muted">
                      <small>Mobile: 24px · Tablet: 26px · Desktop: 28px · Weight: 400</small>
                    </div>
                  </div>
                </PageGridCol>
                <PageGridCol span={{ base: 4, lg: 6 }}>
                  <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                    <code className="text-muted mb-3 d-block">subhead-md-l / .sh-md-l</code>
                    <div className="sh-md-l">Light Weight Subhead</div>
                    <div className="mt-3 text-muted">
                      <small>Mobile: 24px · Tablet: 26px · Desktop: 28px · Weight: 300</small>
                    </div>
                  </div>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
          </div>

          {/* Small Subheads */}
          <div>
            <h5 className="mb-6">Small Subheads</h5>
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={{ base: 4, lg: 6 }}>
                  <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                    <code className="text-muted mb-3 d-block">subhead-sm-r / .sh-sm-r</code>
                    <div className="sh-sm-r">Regular Weight Subhead</div>
                    <div className="mt-3 text-muted">
                      <small>Mobile: 18px · Tablet: 18px · Desktop: 24px · Weight: 400</small>
                    </div>
                  </div>
                </PageGridCol>
                <PageGridCol span={{ base: 4, lg: 6 }}>
                  <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                    <code className="text-muted mb-3 d-block">subhead-sm-l / .sh-sm-l</code>
                    <div className="sh-sm-l">Light Weight Subhead</div>
                    <div className="mt-3 text-muted">
                      <small>Mobile: 18px · Tablet: 18px · Desktop: 24px · Weight: 300</small>
                    </div>
                  </div>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
          </div>
        </div>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Body Text */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Body Text</h2>
          <h6 className="eyebrow mb-3">Content Typography</h6>
        </div>
        <p className="mb-10 text-muted">
          Body text styles are used for the main content areas. Available in Regular (400) for standard text 
          and Light (300) for less prominent content.
        </p>

        <PageGrid>
          <PageGridRow>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <code className="text-muted mb-3 d-block">body-r / .body-r</code>
                <div className="body-r">
                  The quick brown fox jumps over the lazy dog. This is the standard body text style 
                  used throughout the site. It provides good readability at comfortable sizes across 
                  all devices. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </div>
                <div className="mt-4 text-muted">
                  <small>Mobile: 16px (line: 23.2px) · Desktop: 18px (line: 26.1px) · Weight: 400</small>
                </div>
              </div>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <code className="text-muted mb-3 d-block">body-l / .body-l</code>
                <div className="body-l">
                  The quick brown fox jumps over the lazy dog. This is the light body text style 
                  for secondary content. It maintains the same size as regular body but with lighter 
                  weight for visual hierarchy. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </div>
                <div className="mt-4 text-muted">
                  <small>Mobile: 16px (line: 23.2px) · Desktop: 18px (line: 26.1px) · Weight: 300</small>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <div className="mt-10">
          <h5 className="mb-4">Standard Paragraph</h5>
          <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
            <code className="text-muted mb-3 d-block">p / default paragraph</code>
            <p>
              The standard paragraph element uses a base size of 16px with a 24px line height. 
              This is the default for all unstyled paragraph text. The quick brown fox jumps over 
              the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="text-muted">
              <small>Font-size: 16px · Line-height: 24px</small>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h5 className="mb-4">Longform Text</h5>
          <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
            <code className="text-muted mb-3 d-block">.longform</code>
            <div className="longform">
              Longform text is designed for extended reading experiences with larger sizing and 
              medium weight. Perfect for article introductions or key content blocks.
            </div>
            <div className="mt-4 text-muted">
              <small>Mobile: 20px (line: 26px) · Desktop: 24px (line: 32px) · Weight: 500</small>
            </div>
          </div>
        </div>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Labels */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Label Text</h2>
          <h6 className="eyebrow mb-3">UI Elements</h6>
        </div>
        <p className="mb-10 text-muted">
          Label styles are designed for UI elements, form labels, captions, and supplementary text. 
          Smaller and optimized for clarity at reduced sizes.
        </p>

        <PageGrid>
          <PageGridRow>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <code className="text-muted mb-3 d-block">label-r / .label-r</code>
                <div className="label-r mb-3">
                  Regular label text for form inputs, captions, and UI elements. 
                  Maintains readability at smaller sizes.
                </div>
                <div className="text-muted">
                  <small>Mobile: 14px (line: 20.1px) · Desktop: 16px (line: 23.2px) · Weight: 400</small>
                </div>
              </div>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <code className="text-muted mb-3 d-block">label-l / .label-l</code>
                <div className="label-l mb-3">
                  Light label text for secondary UI text, metadata, and supplementary information. 
                  Provides subtle hierarchy.
                </div>
                <div className="text-muted">
                  <small>Mobile: 14px (line: 20.1px) · Desktop: 16px (line: 23.2px) · Weight: 300</small>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Special Styles */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Special Styles</h2>
          <h6 className="eyebrow mb-3">Distinctive Elements</h6>
        </div>

        <div className="d-flex flex-column gap-10">
          <div>
            <h5 className="mb-4">Eyebrow Text</h5>
            <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
              <code className="text-muted mb-3 d-block">.eyebrow</code>
              <div className="eyebrow">Brand Design System</div>
              <p className="mt-4 mb-0 text-muted">
                Small uppercase labels that appear above headings to provide context or categorization.
              </p>
            </div>
          </div>

          <div>
            <h5 className="mb-4">Numbers (Statistics)</h5>
            <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#141414', color: 'white' }}>
              <code className="mb-3 d-block" style={{ color: '#70EE97' }}>.numbers</code>
              <div className="numbers">1,234</div>
              <p className="mt-4 mb-0" style={{ color: '#C1C1C2' }}>
                Extra-large bold numbers for statistics and key metrics. Desktop: 96px / Mobile: 62px
              </p>
            </div>
          </div>
        </div>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Font Families */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Font Families</h2>
          <h6 className="eyebrow mb-3">Type Stack</h6>
        </div>

        <PageGrid>
          <PageGridRow>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <h5 className="mb-4">Booton</h5>
                <p className="mb-4 text-muted">Primary sans-serif font family</p>
                <div style={{ fontFamily: 'Booton, sans-serif', fontSize: '32px', lineHeight: '1.2' }}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                  abcdefghijklmnopqrstuvwxyz<br />
                  0123456789
                </div>
                <div className="mt-4">
                  <p className="mb-2"><strong>Used for:</strong></p>
                  <ul className="mb-0">
                    <li>Display Large</li>
                    <li>All Subheads</li>
                    <li>Body Text</li>
                    <li>Labels</li>
                  </ul>
                </div>
              </div>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <h5 className="mb-4">Tobias</h5>
                <p className="mb-4 text-muted">Monospace font family</p>
                <div style={{ fontFamily: 'Tobias, monospace', fontSize: '32px', lineHeight: '1.2' }}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                  abcdefghijklmnopqrstuvwxyz<br />
                  0123456789
                </div>
                <div className="mt-4">
                  <p className="mb-2"><strong>Used for:</strong></p>
                  <ul className="mb-0">
                    <li>Display Medium & Small</li>
                    <li>All Headings</li>
                    <li>Legacy H1-H6</li>
                    <li>Code blocks</li>
                  </ul>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Typography in Context */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Typography in Context</h2>
          <h6 className="eyebrow mb-3">Real-World Examples</h6>
        </div>

        <div className="d-flex flex-column gap-10">
          {/* Article Layout */}
          <div>
            <h5 className="mb-6">Article Layout</h5>
            <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
              <div className="eyebrow mb-3">Documentation</div>
              <h2 className="h4 mb-4">Understanding the XRP Ledger</h2>
              <p className="longform mb-6">
                A comprehensive introduction to the decentralized blockchain that powers fast, 
                low-cost global payments.
              </p>
              <h5 className="mb-3">What is the XRP Ledger?</h5>
              <p className="mb-4">
                The XRP Ledger is a decentralized public blockchain. It was built to be a better 
                blockchain specifically for payments, with a unique design optimized for enterprise 
                use cases. The XRP Ledger allows anyone to transfer money across borders instantly, 
                reliably, and for fractions of a penny.
              </p>
              <h5 className="mb-3">Key Features</h5>
              <p className="mb-2">
                The ledger provides a number of innovative features that make it ideal for financial 
                applications:
              </p>
              <ul>
                <li>Fast transaction settlement (3-5 seconds)</li>
                <li>Low transaction costs (fractions of a penny)</li>
                <li>High throughput (1,500 transactions per second)</li>
              </ul>
            </div>
          </div>

          {/* Hero Section */}
          <div>
            <h5 className="mb-6">Hero Section</h5>
            <div className="p-6-sm p-10-until-sm br-8 text-center" style={{ backgroundColor: '#141414', color: 'white' }}>
              <div className="eyebrow mb-4" style={{ color: '#70EE97' }}>Blockchain for Payments</div>
              <div className="display-md mb-6" style={{ color: 'white' }}>
                Build the Future of Finance
              </div>
              <p className="longform col-lg-8 mx-auto mb-0" style={{ color: '#C1C1C2' }}>
                Join a global community developing on the XRP Ledger—the most sustainable 
                blockchain optimized for payments and tokenization.
              </p>
            </div>
          </div>

          {/* Card with Stats */}
          <div>
            <h5 className="mb-6">Statistics Card</h5>
            <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#141414', color: 'white' }}>
              <div className="text-center">
                <div className="numbers" style={{ color: '#21E46B' }}>10+</div>
                <div className="sh-md-r mb-3">Years of Operation</div>
                <p className="label-l mb-0" style={{ color: '#C1C1C2' }}>
                  Reliably processing transactions since 2012
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Responsive Behavior */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Responsive Behavior</h2>
          <h6 className="eyebrow mb-3">Breakpoint Adjustments</h6>
        </div>
        <p className="mb-6 text-muted">
          All typography styles automatically adjust across breakpoints for optimal readability on any device.
        </p>

        <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
          <h5 className="mb-4">Breakpoint System</h5>
          <ul className="mb-4">
            <li><strong>Mobile:</strong> Base styles (0-767px)</li>
            <li><strong>Tablet:</strong> Medium breakpoint (768px-1023px)</li>
            <li><strong>Desktop:</strong> Large breakpoint (1024px+)</li>
            <li><strong>XL:</strong> Extra large (1200px+) — only used for Display Large</li>
          </ul>
          <p className="mb-0 text-muted">
            Resize your browser window to see typography scale responsively. Font sizes, line heights, 
            and letter spacing all adjust to maintain optimal readability at every viewport size.
          </p>
        </div>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Usage Guidelines */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Usage Guidelines</h2>
          <h6 className="eyebrow mb-3">Best Practices</h6>
        </div>

        <PageGrid>
          <PageGridRow>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <h5 className="mb-4">Do</h5>
              <ul>
                <li>Use Display styles sparingly for maximum impact</li>
                <li>Maintain consistent hierarchy with heading levels</li>
                <li>Pair Regular and Light weights for visual contrast</li>
                <li>Use Eyebrow text above headings for context</li>
                <li>Apply Longform class to article introductions</li>
                <li>Let typography breathe with adequate spacing</li>
              </ul>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <h5 className="mb-4">Don't</h5>
              <ul>
                <li>Don't skip heading levels in the hierarchy</li>
                <li>Don't use Display styles for body content</li>
                <li>Don't mix too many font weights on one screen</li>
                <li>Don't override letter spacing on Display text</li>
                <li>Don't use Tobias for long-form reading</li>
                <li>Don't ignore responsive scaling</li>
              </ul>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Code Examples */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Code Examples</h2>
          <h6 className="eyebrow mb-3">Implementation</h6>
        </div>
        <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4' }}>
          <pre style={{ margin: 0, overflow: 'auto' }}>
            <code>{`// Display Styles
<div className="display-lg">Largest headline</div>
<div className="display-md">Medium display</div>
<div className="display-sm">Small display</div>

// Headings
<div className="h-lg">Large heading</div>
<div className="h-md">Medium heading</div>
<div className="h-sm">Small heading</div>

// Or use semantic HTML
<h1>Heading Level 1</h1>
<h2>Heading Level 2</h2>

// Subheads
<div className="sh-lg-r">Large subhead regular</div>
<div className="sh-md-l">Medium subhead light</div>
<div className="sh-sm-r">Small subhead regular</div>

// Body Text
<div className="body-r">Regular body text</div>
<div className="body-l">Light body text</div>
<p className="longform">Extended reading text</p>

// Labels
<div className="label-r">UI label regular</div>
<div className="label-l">UI label light</div>

// Special Styles
<div className="eyebrow">Category Label</div>
<div className="numbers">1,234</div>`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}

