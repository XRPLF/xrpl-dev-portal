import * as React from "react";
import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";
import { LogoSquareGrid } from "shared/patterns/LogoSquareGrid";

export const frontmatter = {
  seo: {
    title: 'LogoSquareGrid Component Showcase',
    description: "A comprehensive showcase of the LogoSquareGrid pattern component with responsive grid layouts, color variants, and usage examples.",
  }
};

export default function LogoSquareGridShowcase() {
  const handleClick = (message: string) => {
    console.log(`LogoSquareGrid button clicked: ${message}`);
  };

  // Sample logo - Ondo Finance logo SVG
  const sampleLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='151' height='46' viewBox='0 0 151 46' fill='none'%3E%3Cpath d='M22.2154 0H23.021C25.9433 0.0581414 28.8552 0.674289 31.5386 1.83712C34.6562 3.18041 37.4648 5.23876 39.6848 7.81058C41.7066 10.1385 43.2477 12.8847 44.1701 15.8296C45.1919 19.0651 45.4677 22.5332 44.9832 25.891C43.8958 25.888 42.8084 25.891 41.721 25.8895C42.2967 22.426 41.9365 18.8068 40.6441 15.5404C38.8408 10.9079 35.1807 7.0419 30.6622 4.98732C25.4603 2.57332 19.1762 2.65638 14.0497 5.23121C9.49129 7.45418 5.88844 11.5573 4.26599 16.3702C3.13789 19.6571 2.92915 23.2505 3.63977 26.6506C4.47021 30.6684 6.62694 34.3895 9.68119 37.1191C13.1484 40.255 17.7806 42.0581 22.4535 42.0679C26.388 42.0694 30.3231 42.0626 34.2583 42.0717C30.8755 44.1172 26.9501 45.2385 23.0006 45.305H22.1928C18.9645 45.2408 15.746 44.494 12.8372 43.0835C8.09114 40.819 4.19214 36.8337 2.02561 32.0351C0.73775 29.2217 0.0572717 26.1379 0 23.0459V22.2342C0.0640539 19.0009 0.80934 15.7782 2.21551 12.8651C4.47021 8.12167 8.43251 4.22167 13.2057 2.04703C16.0233 0.745267 19.1144 0.0581414 22.2154 0Z' fill='%23333'/%3E%3Cpath d='M15.6069 8.0703C18.1156 6.84556 20.9505 6.31625 23.7327 6.51106C26.472 6.69756 29.163 7.59838 31.4539 9.11685C34.0854 10.8369 36.1931 13.3468 37.4358 16.238C38.744 19.2516 39.0891 22.6721 38.4297 25.8903C37.325 25.8872 36.2202 25.8948 35.1155 25.8865C35.9821 22.5709 35.4606 18.914 33.6799 15.9858C32.6114 14.2069 31.111 12.6922 29.3431 11.6086C27.4584 10.4496 25.2715 9.7934 23.0613 9.72016C20.3861 9.61747 17.6853 10.3801 15.4615 11.8737C13.7418 13.0153 12.304 14.5776 11.3055 16.3853C10.1096 18.5312 9.55797 21.0283 9.71773 23.48C9.91668 26.9496 11.6039 30.2939 14.2565 32.5282C16.2339 34.2135 18.729 35.2842 21.3153 35.5319C22.0937 35.6203 22.8782 35.5863 23.6596 35.5931C29.4938 35.5923 35.3272 35.5931 41.1607 35.5923C40.3634 36.7582 39.4357 37.8296 38.4418 38.8301C33.2135 38.8301 27.9859 38.8301 22.7584 38.8301C19.5187 38.8739 16.2701 37.9036 13.5919 36.0741C10.4886 33.9983 8.15406 30.8028 7.11187 27.2139C6.21134 24.149 6.24676 20.8169 7.20832 17.7709C8.51955 13.5643 11.6348 9.9633 15.6069 8.0703Z' fill='%23333'/%3E%3Cpath d='M70.8021 8.74083C73.4359 8.543 76.1382 9.05948 78.4667 10.3242C81.57 11.9643 83.9399 14.8993 84.9543 18.2594C85.9904 21.6558 85.7696 25.4335 84.3062 28.6712C83.0726 31.4175 80.9008 33.7356 78.218 35.1023C73.9174 37.3215 68.4359 37.0791 64.3831 34.4129C61.9453 32.8295 60.0704 30.417 59.09 27.6806C57.9273 24.4518 57.9069 20.8131 59.0719 17.5829C60.0365 14.9061 61.8624 12.5457 64.2324 10.9729C66.1782 9.66958 68.4713 8.91148 70.8021 8.74083ZM70.729 12.3728C69.0591 12.5638 67.4404 13.1966 66.0938 14.2061C63.8006 15.8945 62.3545 18.6188 62.096 21.4451C61.7871 24.4549 62.6982 27.6262 64.7629 29.8665C66.5354 31.8434 69.1646 33.0001 71.8149 32.9979C73.9618 33.0311 76.1163 32.3259 77.8119 31.0014C79.2218 29.9103 80.3198 28.4266 80.9761 26.7692C81.8676 24.5175 82.01 21.9752 81.3763 19.6382C80.8292 17.6229 79.6604 15.7707 78.0342 14.4576C76.0176 12.7986 73.3115 12.0579 70.729 12.3728Z' fill='%23333'/%3E%3Cpath d='M124.998 9.08936C126.184 9.09011 127.372 9.09011 128.559 9.08936C128.56 18.1315 128.56 27.1743 128.559 36.2165C127.373 36.215 126.187 36.2172 125.001 36.215C124.999 34.9238 124.995 33.6326 125.004 32.3414C124.31 33.6839 123.266 34.8664 121.937 35.6003C120.699 36.2957 119.27 36.6008 117.859 36.6038C116.143 36.6204 114.424 36.1115 112.995 35.1609C110.839 33.7541 109.355 31.4224 108.853 28.908C108.48 27.0792 108.589 25.1515 109.183 23.3816C109.67 21.9356 110.484 20.5976 111.565 19.5201C112.772 18.3172 114.322 17.4579 115.99 17.1061C117.456 16.8003 118.999 16.8637 120.435 17.2858C121.845 17.7018 123.122 18.5543 124.041 19.7043C124.415 20.1581 124.722 20.6633 125.004 21.1782C124.991 17.1491 125.005 13.1192 124.998 9.08936ZM117.823 20.3658C116.194 20.5289 114.638 21.3481 113.596 22.6159C112.637 23.7538 112.118 25.2444 112.121 26.7304C112.102 28.2435 112.629 29.7628 113.607 30.9203C114.622 32.1473 116.12 32.9485 117.696 33.1418C119.072 33.3086 120.509 33.0791 121.736 32.4222C123.01 31.7517 124.028 30.6054 124.541 29.2569C125.05 27.9566 125.126 26.5008 124.815 25.1439C124.485 23.71 123.64 22.3909 122.438 21.5377C121.122 20.5749 119.432 20.2012 117.823 20.3658Z' fill='%23333'/%3E%3Cpath d='M17.2933 14.5376C18.8781 13.4843 20.7816 12.9263 22.6814 12.9489C24.8208 12.9534 26.9474 13.7063 28.6196 15.0428C29.8675 16.0312 30.8667 17.3329 31.4997 18.7955C32.4696 21.0185 32.5472 23.6039 31.7469 25.8903C30.563 25.8888 29.3799 25.8918 28.1968 25.8888C28.8404 24.8052 29.1305 23.5223 29.0551 22.2659C28.967 20.6659 28.2518 19.1096 27.0943 18.0034C25.9323 16.8572 24.3136 16.1965 22.6852 16.1859C21.3619 16.1633 20.0348 16.5673 18.9489 17.3254C17.8253 18.0971 16.9482 19.232 16.5104 20.5269C15.9565 22.0998 16.0462 23.8916 16.7613 25.398C17.4877 26.964 18.866 28.2152 20.499 28.7724C21.2458 29.0375 22.0431 29.1401 22.8336 29.1273C29.9813 29.1273 37.1289 29.1273 44.2766 29.1273C43.9465 30.2328 43.5381 31.3155 43.04 32.3553C36.7567 32.3553 30.4734 32.3553 24.1901 32.3553C23.0619 32.3432 21.9233 32.4195 20.8095 32.1929C18.8389 31.8237 16.9942 30.8187 15.6113 29.3644C14.5021 28.2061 13.6814 26.7692 13.2624 25.2182C12.7093 23.1863 12.8269 20.9717 13.6234 19.0205C14.3521 17.197 15.6551 15.6136 17.2933 14.5376Z' fill='%23333'/%3E%3Cpath d='M95.2947 17.4758C96.6413 16.8801 98.1643 16.8106 99.6051 17.0303C101.089 17.2538 102.543 17.8828 103.616 18.9505C104.589 19.8732 105.236 21.1002 105.596 22.3839C105.888 23.4289 105.996 24.5185 105.981 25.6013C105.981 29.1396 105.98 32.6779 105.982 36.2155C104.794 36.2162 103.607 36.214 102.42 36.217C102.42 33.1287 102.42 30.0404 102.42 26.9529C102.411 26.046 102.476 25.1256 102.259 24.2361C101.996 23.003 101.29 21.8425 100.225 21.1485C99.0068 20.3421 97.4567 20.1768 96.0452 20.4471C94.933 20.6615 93.8832 21.255 93.1907 22.1611C92.6534 22.8437 92.318 23.6713 92.1688 24.5245C92.0219 25.2766 92.0641 26.0453 92.0581 26.8071C92.0581 29.943 92.0588 33.0789 92.0581 36.2155C90.8591 36.2162 89.6602 36.2155 88.462 36.2155C88.4575 29.9105 88.462 23.6063 88.459 17.3014C89.6594 17.3006 90.8591 17.3014 92.0596 17.3006C92.0558 18.4053 92.0611 19.5108 92.0566 20.6162C92.737 19.2435 93.8802 18.0822 95.2947 17.4758Z' fill='%23333'/%3E%3Cpath d='M140.204 16.9698C141.94 16.7916 143.728 17.0596 145.318 17.7868C146.768 18.4399 148.047 19.4661 149.004 20.7376C150.93 23.2679 151.477 26.7368 150.557 29.7669C149.77 32.4361 147.758 34.7104 145.198 35.7955C142.085 37.1531 138.27 36.793 135.508 34.7973C134.288 33.9289 133.288 32.7601 132.6 31.4304C131.117 28.5611 131.136 24.9782 132.61 22.1096C133.234 20.9136 134.098 19.8383 135.16 19.004C136.598 17.8547 138.375 17.1495 140.204 16.9698ZM140.436 20.376C138.73 20.57 137.127 21.5222 136.154 22.9417C134.434 25.3829 134.597 29.0269 136.659 31.2212C137.449 32.079 138.487 32.7034 139.618 32.9896C141.253 33.4117 143.063 33.1814 144.508 32.2912C145.692 31.5761 146.612 30.4457 147.092 29.1485C147.627 27.7222 147.64 26.1168 147.184 24.6671C146.784 23.428 146.006 22.3105 144.958 21.5358C143.676 20.5776 142.017 20.1743 140.436 20.376Z' fill='%23333'/%3E%3C/svg%3E";

  // Sample logos using Ondo Finance logo
  const sampleLogos = [
    { src: sampleLogo, alt: "Ondo Finance", variant: "gray" },
    { src: sampleLogo, alt: "Ondo Finance", variant: "gray" },
    { src: sampleLogo, alt: "Ondo Finance", variant: "gray" },
    { src: sampleLogo, alt: "Ondo Finance", variant: "gray" },
    { src: sampleLogo, alt: "Ondo Finance", variant: "gray" },
    { src: sampleLogo, alt: "Ondo Finance", variant: "gray" },
    { src: sampleLogo, alt: "Ondo Finance", variant: "gray" },
    { src: sampleLogo, alt: "Ondo Finance", variant: "gray" },
  ];

  const clickableLogos = [
    { src: sampleLogo, alt: "Ondo Finance", href: "https://example.com" },
    { src: sampleLogo, alt: "Ondo Finance", href: "https://example.com" },
    { src: sampleLogo, alt: "Ondo Finance", href: "https://example.com" },
    { src: sampleLogo, alt: "Ondo Finance", href: "https://example.com" },
  ];

  const smallLogoSet = [
    { src: sampleLogo, alt: "Ondo Finance" },
    { src: sampleLogo, alt: "Ondo Finance" },
    { src: sampleLogo, alt: "Ondo Finance" },
    { src: sampleLogo, alt: "Ondo Finance" },
  ];

  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="my-5 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Component Showcase</h6>
            <h1 className="mb-4">LogoSquareGrid Pattern</h1>
            <p className="longform">
              A responsive grid pattern for displaying company/partner logos with an optional header section.
              Features square tiles arranged in a responsive grid with 2 color variants and full dark mode support.
              The grid automatically adapts from 2 columns on mobile to 4 columns on tablet and desktop.
            </p>
          </div>
        </section>

        {/* Full Example - Green Variant */}
        <LogoSquareGrid
          variant="green"
          heading="Developer tools & APIs"
          description="Streamline development and build powerful RWA tokenization solutions with XRP Ledger's comprehensive developer toolset."
          primaryButton={{ 
            label: "View Documentation", 
            onClick: () => handleClick('green-primary') 
          }}
          tertiaryButton={{ 
            label: "Explore Tools", 
            onClick: () => handleClick('green-tertiary')
          }}
          logos={sampleLogos}
        />

        {/* Responsive Behavior */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Responsive Behavior</h2>
              <p className="mb-6">
                LogoSquareGrid automatically adapts its grid layout based on viewport width.
                Resize your browser to see the responsive changes.
              </p>

              <div className="d-flex flex-column gap-4 mb-6">
                <div className="d-flex flex-row gap-4 align-items-start" style={{ flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <h6 className="mb-3">Desktop (≥1024px)</h6>
                    <ul className="mb-0">
                      <li><strong>Columns:</strong> 4</li>
                      <li><strong>Gap:</strong> 8px</li>
                      <li><strong>Tile Size:</strong> ~298px square</li>
                      <li><strong>Container:</strong> PageGrid standard</li>
                    </ul>
                  </div>
                  <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <h6 className="mb-3">Tablet (768px–1023px)</h6>
                    <ul className="mb-0">
                      <li><strong>Columns:</strong> 4</li>
                      <li><strong>Gap:</strong> 8px</li>
                      <li><strong>Tile Size:</strong> ~178px square</li>
                      <li><strong>Container:</strong> PageGrid standard</li>
                    </ul>
                  </div>
                  <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <h6 className="mb-3">Mobile (&lt;768px)</h6>
                    <ul className="mb-0">
                      <li><strong>Columns:</strong> 2</li>
                      <li><strong>Gap:</strong> 8px</li>
                      <li><strong>Tile Size:</strong> ~183px square</li>
                      <li><strong>Container:</strong> PageGrid standard</li>
                    </ul>
                  </div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Color Variants Section Header */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Color Variants</h2>
              <p className="mb-6">
                LogoSquareGrid comes in 2 color variants to support different visual contexts.
                Both variants support light and dark modes.
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Gray Variant */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Gray Variant</strong> - <code>variant="gray"</code>
                  <br />
                  <small className="text-muted">Light mode: Gray 200 (#E6EAF0), Dark mode: Gray 700 (#343437). General purpose, subtle integration.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <LogoSquareGrid
            variant="gray"
            heading="Our Partners"
            description="Leading companies building innovative solutions on the XRP Ledger."
            primaryButton={{ label: "View All Partners", href: "#partners" }}
            tertiaryButton={{ label: "Become a Partner", href: "#partner-program" }}
            logos={sampleLogos}
          />
        </div>

        {/* Green Variant */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Green Variant</strong> - <code>variant="green"</code>
                  <br />
                  <small className="text-muted">Light mode: Green 200 (#70EE97), Dark mode: Green 300 (#21E46B). Featured partnerships, brand-focused sections.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <LogoSquareGrid
            variant="green"
            heading="Featured Integrations"
            description="Connect with leading platforms and services built on XRPL."
            primaryButton={{ label: "See All Integrations", href: "#integrations" }}
            logos={sampleLogos}
          />
        </div>

        {/* Configuration Variations Section Header */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Configuration Variations</h2>
              <p className="mb-6">
                The component supports flexible configurations including with/without headers, different button combinations, and clickable logos.
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Without Header (Grid Only) */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Grid Only (No Header)</strong>
                  <br />
                  <small className="text-muted">Simple logo grid without heading, description, or buttons.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <LogoSquareGrid
            variant="gray"
            logos={sampleLogos}
          />
        </div>

        {/* With Clickable Logos */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Clickable Logos</strong>
                  <br />
                  <small className="text-muted">Each logo can link to an external URL. Hover to see the lift effect.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <LogoSquareGrid
            variant="gray"
            heading="Partner Ecosystem"
            description="Click any logo to visit partner websites."
            logos={clickableLogos}
          />
        </div>

        {/* With Single Button */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Single Button</strong>
                  <br />
                  <small className="text-muted">Component with heading, description, and only a primary button.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <LogoSquareGrid
            variant="green"
            heading="Developer Resources"
            description="Access comprehensive tools and libraries for building on XRPL."
            primaryButton={{ label: "Get Started", onClick: () => handleClick('single-button') }}
            logos={smallLogoSet}
          />
        </div>

        {/* Heading Only */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>Heading Only</strong>
                  <br />
                  <small className="text-muted">Component with just a heading, no description or buttons.</small>
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <LogoSquareGrid
            variant="gray"
            heading="Ecosystem Members"
            logos={smallLogoSet}
          />
        </div>

        {/* Different Logo Counts */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Different Logo Counts</h2>
              <p className="mb-6">
                The grid adapts to any number of logos. For best visual balance, aim for multiples of 4 on desktop.
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* 4 Logos */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>4 Logos</strong> - Perfect fit for desktop (1 row)
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <LogoSquareGrid
            variant="green"
            logos={smallLogoSet}
          />
        </div>

        {/* 8 Logos */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>8 Logos</strong> - Perfect fit for desktop (2 rows)
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <LogoSquareGrid
            variant="gray"
            logos={sampleLogos}
          />
        </div>

        {/* 6 Logos */}
        <div className="mb-5">
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <div className="mb-3">
                  <strong>6 Logos</strong> - Partial rows (1.5 rows on desktop)
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <LogoSquareGrid
            variant="green"
            logos={sampleLogos.slice(0, 6)}
          />
        </div>

        {/* Color Token Reference */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Color Token Reference</h2>
              <p className="mb-4">All colors are mapped from <code>styles/_colors.scss</code>. The component uses <code>html.light</code> and <code>html.dark</code> selectors for mode-specific styles.</p>

              <div className="d-flex flex-row gap-6 mb-6" style={{ flexWrap: 'wrap' }}>
                {/* Light Mode Colors */}
                <div style={{ flex: '1 1 400px', minWidth: '320px' }}>
                  <h6 className="mb-4">Light Mode</h6>

                  <div className="d-flex flex-column gap-3">
                    <div>
                      <strong className="d-block mb-2">Gray Variant</strong>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#E6EAF0', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>$gray-200</code> <small className="text-muted">#E6EAF0</small></div>
                      </div>
                    </div>

                    <div>
                      <strong className="d-block mb-2">Green Variant</strong>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#70EE97', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>$green-200</code> <small className="text-muted">#70EE97</small></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dark Mode Colors */}
                <div style={{ flex: '1 1 400px', minWidth: '320px' }}>
                  <h6 className="mb-4">Dark Mode <code className="small">(html.dark)</code></h6>

                  <div className="d-flex flex-column gap-3">
                    <div>
                      <strong className="d-block mb-2">Gray Variant</strong>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#343437', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>$gray-700</code> <small className="text-muted">#343437</small></div>
                      </div>
                    </div>

                    <div>
                      <strong className="d-block mb-2">Green Variant</strong>
                      <div className="d-flex flex-row align-items-center gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#21E46B', borderRadius: '4px', flexShrink: 0, border: '1px solid #ccc' }}></div>
                        <div><code>$green-300</code> <small className="text-muted">#21E46B</small></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Component API */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Component API</h2>
              <div className="mb-10">
                {/* Header Row */}
                <div className="d-flex flex-row mb-3 pb-2" style={{ gap: '1rem', borderBottom: '2px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><strong>Prop</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Type</strong></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><strong>Default</strong></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><strong>Description</strong></div>
                </div>

                {/* variant */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>variant</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>'gray' | 'green'</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>'gray'</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Color variant for tile backgrounds</div>
                </div>

                {/* heading */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>heading</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>undefined</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Optional heading text</div>
                </div>

                {/* description */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>description</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>undefined</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Optional description text</div>
                </div>

                {/* primaryButton */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>primaryButton</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>{`{ label, href?, onClick? }`}</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>undefined</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Primary button configuration</div>
                </div>

                {/* tertiaryButton */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>tertiaryButton</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>{`{ label, href?, onClick? }`}</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>undefined</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Tertiary button configuration</div>
                </div>

                {/* logos */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem', borderBottom: '1px solid var(--bs-border-color, #dee2e6)' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>logos</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>LogoItem[]</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><em>required</em></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Array of logo items (src, alt, href?, target?)</div>
                </div>

                {/* className */}
                <div className="d-flex flex-row py-3" style={{ gap: '1rem' }}>
                  <div style={{ width: '140px', flexShrink: 0 }}><code>className</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}><code>string</code></div>
                  <div style={{ width: '120px', flexShrink: 0 }}><code>''</code></div>
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>Additional CSS classes</div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Best Practices */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Best Practices</h2>
              
              <h4 className="h5 mb-4">Logo Image Guidelines</h4>
              <ul className="mb-6">
                <li>Use SVG format for crisp scaling at all screen sizes</li>
                <li>Ensure transparent backgrounds for consistency</li>
                <li>Keep logos reasonably sized (width: 120-200px recommended)</li>
                <li>Use monochrome or simple color schemes</li>
                <li>Maintain consistent visual weight across all logos</li>
                <li>Optimize SVG files (run through SVGO or similar)</li>
              </ul>

              <h4 className="h5 mb-4">Content Guidelines</h4>
              <ul className="mb-6">
                <li><strong>Heading:</strong> Keep concise (1 line preferred), use sentence case</li>
                <li><strong>Description:</strong> Provide context (2-3 lines max), complete sentences</li>
                <li><strong>Logo Count:</strong> Aim for multiples of 4 for visual balance on desktop</li>
                <li><strong>Alt Text:</strong> Use company/product names, not generic "logo"</li>
              </ul>

              <h4 className="h5 mb-4">When to Use Each Variant</h4>
              <ul className="mb-6">
                <li><strong>Gray:</strong> General-purpose logo grids, subtle integration into pages</li>
                <li><strong>Green:</strong> Featured partnerships, brand-focused sections, highlighted content</li>
              </ul>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Design References */}
        <PageGrid className="my-5">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Design References</h2>
              <div className="d-flex flex-column gap-3">
                <div>
                  <strong>Figma Design:</strong>{' '}
                  <a href="https://www.figma.com/design/ThBcoYLNKsBGw3r9g1L6Z8/Pattern-Logo---Square-Grid?node-id=1-2" target="_blank" rel="noopener noreferrer">
                    Pattern Logo - Square Grid (Figma)
                  </a>
                </div>
                <div>
                  <strong>Component Location:</strong>{' '}
                  <code>shared/patterns/LogoSquareGrid/</code>
                </div>
                <div>
                  <strong>Color Tokens:</strong>{' '}
                  <code>styles/_colors.scss</code>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </div>
    </div>
  );
}
