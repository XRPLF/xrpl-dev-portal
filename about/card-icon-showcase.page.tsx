import * as React from "react";
import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";
import { CardIcon } from "shared/components/CardIcon";

export const frontmatter = {
  seo: {
    title: 'CardIcon Component Showcase',
    description: "A comprehensive showcase of the CardIcon component variants, states, and responsive sizing in the XRPL.org Design System.",
  }
};

export default function CardIconShowcase() {
  const handleClick = (message: string) => {
    console.log(`CardIcon clicked: ${message}`);
  };

  // Sample icon SVG (black version for light backgrounds)
  const cardIconSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='53' height='38' viewBox='0 0 53 38' fill='none'%3E%3Cpath d='M38.6603 0.0618191C35.7826 0.289503 33.3694 1.32168 31.5728 3.09764C29.7228 4.92673 28.8397 7.15805 28.8397 9.98896C28.8397 14.2239 30.5831 17.1839 34.4732 19.529C35.4629 20.121 36.8104 20.7661 39.1399 21.768C42.3144 23.1265 43.4944 23.7716 44.2481 24.5761C45.1769 25.5703 45.4357 27.1565 44.8495 28.3709C44.7353 28.6062 44.4384 29.0008 44.172 29.2664C43.2737 30.1696 41.8577 30.6477 40.0991 30.6477C37.1301 30.6477 34.9148 29.4334 33.1334 26.8074C32.8898 26.4583 32.669 26.1699 32.6385 26.1699C32.57 26.1699 26.7767 29.5017 26.6549 29.6156C26.5787 29.6839 26.6396 29.8433 26.9365 30.329C29.2508 34.2148 32.8669 36.4917 37.7544 37.1444C39.0333 37.319 41.4314 37.3114 42.657 37.1444C45.7326 36.7118 48.0393 35.6948 49.8283 33.9644C51.7315 32.1353 52.6679 29.7674 52.6679 26.7998C52.6679 24.9024 52.3558 23.4225 51.6478 21.9577C51.1605 20.9559 50.6733 20.2804 49.8359 19.4304C48.2296 17.8062 46.1513 16.5767 42.0023 14.8007C38.8658 13.4574 37.8153 12.8806 37.1225 12.1444C36.4602 11.4386 36.1785 10.6113 36.2394 9.57912C36.2927 8.75945 36.5211 8.20541 37.0235 7.66656C37.7468 6.88483 38.5842 6.55848 39.8783 6.56607C41.3476 6.56607 42.2992 6.94555 43.2661 7.91701C43.6086 8.25095 44.0502 8.78981 44.2557 9.11616C44.4917 9.48805 44.6668 9.69297 44.7277 9.6702C44.9256 9.58671 50.4602 6.01962 50.4602 5.9665C50.4602 5.93614 50.1785 5.49594 49.8359 4.97985C49.1051 3.88696 47.7881 2.52083 46.8821 1.92126C45.2073 0.813185 43.4183 0.243967 41.0583 0.0694065C39.9012 -0.0216694 39.7489 -0.0216694 38.6603 0.0618191Z' fill='black'/%3E%3Cpath d='M14.9592 13.8528L14.9364 27.2711L14.7689 27.901C14.5481 28.7283 14.2893 29.2216 13.8325 29.677C13.193 30.3145 12.3708 30.5802 11.0005 30.5877C9.04403 30.5953 7.87166 29.7681 6.50896 27.4457C6.28819 27.0814 6.09026 26.7854 6.06742 26.793C6.03697 26.8081 4.65905 27.6354 3.00706 28.6296L0 30.4511L0.228385 30.9065C1.59108 33.616 3.95105 35.6652 6.79064 36.6063C9.79009 37.6005 13.6422 37.5094 16.4665 36.3786C19.8542 35.0125 21.8412 32.1891 22.3665 27.9921C22.4121 27.5671 22.4426 22.8236 22.4426 13.8983V0.442009H18.7123H14.9896L14.9592 13.8528Z' fill='black'/%3E%3C/svg%3E";

  // Use the same icon for all examples
  const jsIconBlack = cardIconSvg;
  const jsIconWhite = cardIconSvg;
  const pythonIcon = cardIconSvg;
  const goIcon = cardIconSvg;
  const rustIcon = cardIconSvg;

  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-26 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Component Showcase</h6>
            <h1 className="mb-4">CardIcon Component</h1>
            <p className="longform">
              A clickable card component featuring an icon (top-left) and label text with arrow (bottom).
              Supports two color variants (Neutral and Green), five interaction states, and responsive
              sizing that adapts at breakpoints. Full card is clickable.
            </p>
          </div>
        </section>

        {/* Responsive Sizing */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Responsive Sizing</h2>
              <p className="mb-6">
                CardIcon automatically adapts its dimensions based on viewport width. Resize your browser to see the changes.
              </p>

              <div className="d-flex flex-column gap-4 mb-6">
                <div className="d-flex flex-row gap-4 align-items-start" style={{ flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <h6 className="mb-3">LG Breakpoint (≥992px)</h6>
                    <ul className="mb-0">
                      <li><strong>Column width:</strong> 3 columns</li>
                      <li><strong>Card height:</strong> 144px</li>
                      <li><strong>Icon bounding box:</strong> 64×64 (1:1 ratio)</li>
                      <li><strong>Padding:</strong> 16px</li>
                    </ul>
                  </div>
                  <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <h6 className="mb-3">MD Breakpoint (576px–991px)</h6>
                    <ul className="mb-0">
                      <li><strong>Column width:</strong> 2 columns</li>
                      <li><strong>Card height:</strong> 140px</li>
                      <li><strong>Icon bounding box:</strong> 60×60 (1:1 ratio)</li>
                      <li><strong>Padding:</strong> 12px</li>
                    </ul>
                  </div>
                  <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <h6 className="mb-3">SM Breakpoint (&lt;576px)</h6>
                    <ul className="mb-0">
                      <li><strong>Column width:</strong> 2 columns</li>
                      <li><strong>Card height:</strong> 136px</li>
                      <li><strong>Icon bounding box:</strong> 56×56 (1:1 ratio)</li>
                      <li><strong>Padding:</strong> 8px</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 mb-6" style={{ backgroundColor: 'rgba(114, 119, 126, 0.1)', borderRadius: '8px' }}>
                <h6 className="mb-3">Icon Requirements</h6>
                <ul className="mb-0">
                  <li><strong>Bounding box:</strong> 1:1 ratio (square)</li>
                  <li><strong>Icon padding:</strong> At least 4px padding within bounding box</li>
                  <li><strong>Icon color:</strong> Must be black or white (depending on background)</li>
                  <li><strong>Full card clickable:</strong> Entire card area is interactive</li>
                </ul>
              </div>

              <PageGridRow>
                <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                  <CardIcon
                    variant="neutral"
                    icon={jsIconBlack}
                    iconAlt="JavaScript"
                    label="Get Started with Javascript"
                    onClick={() => handleClick('responsive-demo')}
                  />
                </PageGridCol>
                <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                  <CardIcon
                    variant="green"
                    icon={jsIconBlack}
                    iconAlt="JavaScript"
                    label="Get Started with Javascript"
                    onClick={() => handleClick('responsive-demo-green')}
                  />
                </PageGridCol>
              </PageGridRow>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Color Variants */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Color Variants</h2>
              <p className="mb-6">
                CardIcon comes in two color variants to support different visual hierarchies and use cases.
              </p>

              <PageGridRow>
                <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                  <div className="d-flex flex-column align-items-center">
                    <CardIcon
                      variant="neutral"
                      icon={jsIconBlack}
                      iconAlt="JavaScript"
                      label="Get Started with Javascript"
                      onClick={() => handleClick('neutral')}
                    />
                    <div className="mt-3 text-center">
                      <strong>Neutral</strong>
                      <br />
                      <small className="text-muted">General purpose, subtle presentation</small>
                    </div>
                  </div>
                </PageGridCol>

                <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                  <div className="d-flex flex-column align-items-center">
                    <CardIcon
                      variant="green"
                      icon={jsIconBlack}
                      iconAlt="JavaScript"
                      label="Get Started with Javascript"
                      onClick={() => handleClick('green')}
                    />
                    <div className="mt-3 text-center">
                      <strong>Green</strong>
                      <br />
                      <small className="text-muted">Featured, primary highlights</small>
                    </div>
                  </div>
                </PageGridCol>
              </PageGridRow>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Interaction States - Neutral */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Interaction States: Neutral Variant</h2>
              <p className="mb-4">
                Hover over and interact with the cards below to see the different states.
                Use Tab key to see focus states.
              </p>

              <PageGridRow>
                {/* Default */}
                <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                  <div className="d-flex flex-column align-items-center">
                    <CardIcon
                      variant="neutral"
                      icon={jsIconBlack}
                      iconAlt="JavaScript"
                      label="Default State"
                      onClick={() => handleClick('neutral-default')}
                    />
                    <div className="mt-3 text-center">
                      <strong>Default</strong>
                      <br />
                      <code className="small">$gray-200</code>
                    </div>
                  </div>
                </PageGridCol>

                {/* Hover */}
                <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                  <div className="d-flex flex-column align-items-center">
                    <CardIcon
                      variant="neutral"
                      icon={jsIconBlack}
                      iconAlt="JavaScript"
                      label="Hover to see"
                      onClick={() => handleClick('neutral-hover')}
                    />
                    <div className="mt-3 text-center">
                      <strong>Hover</strong>
                      <br />
                      <code className="small">$gray-300</code>
                    </div>
                  </div>
                </PageGridCol>

                {/* Focus */}
                <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                  <div className="d-flex flex-column align-items-center">
                    <CardIcon
                      variant="neutral"
                      icon={jsIconBlack}
                      iconAlt="JavaScript"
                      label="Tab to see focus"
                      onClick={() => handleClick('neutral-focus')}
                    />
                    <div className="mt-3 text-center">
                      <strong>Focused</strong>
                      <br />
                      <code className="small">+ black border</code>
                    </div>
                  </div>
                </PageGridCol>

                {/* Pressed */}
                <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                  <div className="d-flex flex-column align-items-center">
                    <CardIcon
                      variant="neutral"
                      icon={jsIconBlack}
                      iconAlt="JavaScript"
                      label="Click to see"
                      onClick={() => handleClick('neutral-pressed')}
                    />
                    <div className="mt-3 text-center">
                      <strong>Pressed</strong>
                      <br />
                      <code className="small">$gray-400</code>
                    </div>
                  </div>
                </PageGridCol>

                {/* Disabled */}
                <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                  <div className="d-flex flex-column align-items-center">
                    <CardIcon
                      variant="neutral"
                      icon={jsIconBlack}
                      iconAlt="JavaScript"
                      label="Disabled State"
                      disabled
                    />
                    <div className="mt-3 text-center">
                      <strong>Disabled</strong>
                      <br />
                      <code className="small">$gray-100</code>
                    </div>
                  </div>
                </PageGridCol>
              </PageGridRow>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Interaction States - Green */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Interaction States: Green Variant</h2>
              <p className="mb-4">
                The green variant follows the same interaction pattern but uses the brand green color palette.
              </p>

              <PageGridRow>
                {/* Default */}
                <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                  <div className="d-flex flex-column align-items-center">
                    <CardIcon
                      variant="green"
                      icon={jsIconBlack}
                      iconAlt="JavaScript"
                      label="Default State"
                      onClick={() => handleClick('green-default')}
                    />
                    <div className="mt-3 text-center">
                      <strong>Default</strong>
                      <br />
                      <code className="small">$green-200</code>
                    </div>
                  </div>
                </PageGridCol>

                {/* Hover */}
                <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                  <div className="d-flex flex-column align-items-center">
                    <CardIcon
                      variant="green"
                      icon={jsIconBlack}
                      iconAlt="JavaScript"
                      label="Hover to see"
                      onClick={() => handleClick('green-hover')}
                    />
                    <div className="mt-3 text-center">
                      <strong>Hover</strong>
                      <br />
                      <code className="small">$green-300</code>
                    </div>
                  </div>
                </PageGridCol>

                {/* Focus */}
                <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                  <div className="d-flex flex-column align-items-center">
                    <CardIcon
                      variant="green"
                      icon={jsIconBlack}
                      iconAlt="JavaScript"
                      label="Tab to see focus"
                      onClick={() => handleClick('green-focus')}
                    />
                    <div className="mt-3 text-center">
                      <strong>Focused</strong>
                      <br />
                      <code className="small">+ black border</code>
                    </div>
                  </div>
                </PageGridCol>

                {/* Pressed */}
                <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                  <div className="d-flex flex-column align-items-center">
                    <CardIcon
                      variant="green"
                      icon={jsIconBlack}
                      iconAlt="JavaScript"
                      label="Click to see"
                      onClick={() => handleClick('green-pressed')}
                    />
                    <div className="mt-3 text-center">
                      <strong>Pressed</strong>
                      <br />
                      <code className="small">$green-400</code>
                    </div>
                  </div>
                </PageGridCol>

                {/* Disabled */}
                <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                  <div className="d-flex flex-column align-items-center">
                    <CardIcon
                      variant="green"
                      icon={jsIconBlack}
                      iconAlt="JavaScript"
                      label="Disabled State"
                      disabled
                    />
                    <div className="mt-3 text-center">
                      <strong>Disabled</strong>
                      <br />
                      <code className="small">$green-100</code>
                    </div>
                  </div>
                </PageGridCol>
              </PageGridRow>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Color Token Reference */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Color Token Reference</h2>
              <p className="mb-4">All colors are mapped from <code>styles/_colors.scss</code>. The component uses <code>html.dark</code> selector for dark mode styles.</p>

              <div className="d-flex flex-row gap-6 mb-6" style={{ flexWrap: 'wrap' }}>
                {/* Light Mode Colors */}
                <div style={{ flex: '1 1 400px', minWidth: '320px' }}>
                  <h6 className="mb-4">Light Mode</h6>

                  <div className="mb-4">
                    <strong className="d-block mb-2">Neutral Variant</strong>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#E6EAF0', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>Default: $gray-200</code> <small className="text-muted">#E6EAF0</small></div>
                      </div>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#CAD4DF', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>Hover/Focus: $gray-300</code> <small className="text-muted">#CAD4DF</small></div>
                      </div>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#8A919A', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>Pressed: $gray-400</code> <small className="text-muted">#8A919A</small></div>
                      </div>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#F0F3F7', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>Disabled: $gray-100</code> <small className="text-muted">#F0F3F7</small></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <strong className="d-block mb-2">Green Variant</strong>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#70EE97', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>Default: $green-200</code> <small className="text-muted">#70EE97</small></div>
                      </div>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#21E46B', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>Hover/Focus: $green-300</code> <small className="text-muted">#21E46B</small></div>
                      </div>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#0DAA3E', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>Pressed: $green-400</code> <small className="text-muted">#0DAA3E</small></div>
                      </div>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#EAFCF1', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>Disabled: $green-100</code> <small className="text-muted">#EAFCF1</small></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <strong className="d-block mb-2">Focus Border</strong>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '32px', height: '32px', backgroundColor: '#000000', borderRadius: '4px', flexShrink: 0 }}></div>
                      <div><code>$black</code> <small className="text-muted">#000000</small></div>
                    </div>
                  </div>
                </div>

                {/* Dark Mode Colors */}
                <div style={{ flex: '1 1 400px', minWidth: '320px' }}>
                  <h6 className="mb-4">Dark Mode <code className="small">(html.dark)</code></h6>

                  <div className="mb-4">
                    <strong className="d-block mb-2">Neutral Variant</strong>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#72777E', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>Default: $gray-500</code> <small className="text-muted">#72777E + white text</small></div>
                      </div>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#8A919A', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>Hover/Focus: $gray-400</code> <small className="text-muted">#8A919A + white text</small></div>
                      </div>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: 'rgba(114,119,126,0.7)', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>Pressed: 70% $gray-500</code></div>
                      </div>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: 'rgba(114,119,126,0.3)', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>Disabled: 30% opacity</code></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <strong className="d-block mb-2">Green Variant</strong>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#21E46B', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>Default: $green-300</code> <small className="text-muted">#21E46B + black text</small></div>
                      </div>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#70EE97', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>Hover/Focus: $green-200</code> <small className="text-muted">#70EE97 + black text</small></div>
                      </div>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#0DAA3E', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>Pressed: $green-400</code> <small className="text-muted">#0DAA3E</small></div>
                      </div>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: 'rgba(114,119,126,0.3)', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>Disabled: 30% $gray-500</code> <small className="text-muted">+ white text</small></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <strong className="d-block mb-2">Focus Border</strong>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <div style={{ width: '32px', height: '32px', backgroundColor: '#FFFFFF', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                      <div><code>$white</code> <small className="text-muted">#FFFFFF</small></div>
                    </div>
                  </div>
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

              <div className="d-flex flex-column gap-8 mb-10">
                {/* Language Tutorial Grid */}
                <div>
                  <h6 className="mb-4">Language Tutorial Cards</h6>
                  <p className="mb-4 text-muted">Use CardIcon for quick-access language tutorials in documentation.</p>
                  <PageGridRow>
                    <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                      <CardIcon variant="neutral" icon={jsIconBlack} iconAlt="JavaScript" label="JavaScript Tutorial" href="#javascript" />
                    </PageGridCol>
                    <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                      <CardIcon variant="neutral" icon={pythonIcon} iconAlt="Python" label="Python Tutorial" href="#python" />
                    </PageGridCol>
                    <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                      <CardIcon variant="neutral" icon={goIcon} iconAlt="Go" label="Go Tutorial" href="#go" />
                    </PageGridCol>
                    <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                      <CardIcon variant="neutral" icon={rustIcon} iconAlt="Rust" label="Rust Tutorial" href="#rust" />
                    </PageGridCol>
                  </PageGridRow>
                </div>

                {/* Featured Tutorials */}
                <div>
                  <h6 className="mb-4">Featured Content</h6>
                  <p className="mb-4 text-muted">Use green variant to highlight featured or recommended content.</p>
                  <PageGridRow>
                    <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                      <CardIcon variant="green" icon={jsIconBlack} iconAlt="JavaScript" label="Quick Start Guide" onClick={() => handleClick('featured-quickstart')} />
                    </PageGridCol>
                    <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                      <CardIcon variant="green" icon={pythonIcon} iconAlt="Python" label="Build Your First App" onClick={() => handleClick('featured-first-app')} />
                    </PageGridCol>
                    <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                      <CardIcon variant="neutral" icon={goIcon} iconAlt="Go" label="Advanced Topics" onClick={() => handleClick('advanced')} />
                    </PageGridCol>
                    <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                      <CardIcon variant="neutral" icon={rustIcon} iconAlt="Rust" label="API Reference" onClick={() => handleClick('api-ref')} />
                    </PageGridCol>
                  </PageGridRow>
                </div>

                {/* With Links */}
                <div>
                  <h6 className="mb-4">Linked Cards</h6>
                  <p className="mb-4 text-muted">Use href prop to navigate to other pages. Cards render as anchor elements.</p>
                  <PageGridRow>
                    <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                      <CardIcon variant="neutral" icon={jsIconBlack} iconAlt="JavaScript" label="View Documentation" href="#documentation" />
                    </PageGridCol>
                    <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                      <CardIcon variant="green" icon={pythonIcon} iconAlt="Python" label="Get Started Now" href="#get-started" />
                    </PageGridCol>
                  </PageGridRow>
                </div>

                {/* Disabled States */}
                <div>
                  <h6 className="mb-4">Coming Soon / Unavailable</h6>
                  <p className="mb-4 text-muted">Use disabled state for content that's not yet available.</p>
                  <PageGridRow>
                    <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                      <CardIcon variant="neutral" icon={jsIconBlack} iconAlt="Coming Soon" label="Coming Soon" disabled />
                    </PageGridCol>
                    <PageGridCol span={{ base: 2, md: 4, lg: 3 }}>
                      <CardIcon variant="green" icon={pythonIcon} iconAlt="Unavailable" label="Currently Unavailable" disabled />
                    </PageGridCol>
                  </PageGridRow>
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
                  <div style={{ width: '100px', flexShrink: 0 }}><strong>Prop</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Type</strong></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><strong>Default</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Description</strong></div>
                </div>

                {/* variant */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>variant</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>'neutral' | 'green'</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>'neutral'</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Color variant of the card</div>
                </div>

                {/* icon */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>icon</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><em>required</em></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Icon image source (URL or path). Must be black or white.</div>
                </div>

                {/* iconAlt */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>iconAlt</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>''</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Alt text for the icon image</div>
                </div>

                {/* label */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>label</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><em>required</em></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Card label text displayed at bottom</div>
                </div>

                {/* onClick */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>onClick</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>() =&gt; void</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>undefined</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Click handler - renders as button</div>
                </div>

                {/* href */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>href</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>undefined</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Link destination - renders as anchor</div>
                </div>

                {/* disabled */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>disabled</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>boolean</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>false</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Disabled state - prevents interaction</div>
                </div>

                {/* className */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>className</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '100px', flexShrink: 0 }}><code>''</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Additional CSS classes</div>
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
                  <strong>Light Mode:</strong>{' '}
                  <a href="https://www.figma.com/design/GypElq0Tas4ZwgPyBe4Ymi/Card---Icon?node-id=2028-612&m=dev" target="_blank" rel="noopener noreferrer">
                    Figma - Light Mode Design
                  </a>
                </div>
                <div>
                  <strong>Dark Mode:</strong>{' '}
                  <a href="https://www.figma.com/design/GypElq0Tas4ZwgPyBe4Ymi/Card---Icon?node-id=2072-188&m=dev" target="_blank" rel="noopener noreferrer">
                    Figma - Dark Mode Design
                  </a>
                </div>
                <div>
                  <strong>Documentation:</strong>{' '}
                  <code>shared/components/CardIcon/CardIcon.md</code>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </div>
    </div>
  );
}
