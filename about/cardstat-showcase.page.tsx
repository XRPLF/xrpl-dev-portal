import * as React from 'react';
import { CardStat } from 'shared/components/CardStat';
import { PageGrid, PageGridCol, PageGridRow } from 'shared/components/PageGrid/page-grid';

export const frontmatter = {
  seo: {
    title: 'CardStat Component Showcase',
    description: 'Interactive showcase of the Brand Design System CardStat component with all variants and configurations.',
  },
};

export default function CardStatShowcase() {
  const [clickCount, setClickCount] = React.useState<Record<string, number>>({});

  const handleClick = (id: string) => {
    setClickCount((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <div className="landing">
      {/* Hero Section */}
      <PageGrid className="py-26">
        <div className="d-flex flex-column-reverse col-lg-8 mx-auto">
          <h1 className="mb-0">CardStat Component</h1>
          <h6 className="eyebrow mb-3">Brand Design System</h6>
        </div>
        <p className="col-lg-8 mx-auto mt-10">
          A statistics card component following the XRPL Brand Design System. This showcase demonstrates
          all color variants, button configurations, and responsive behavior using PageGrid.
        </p>
      </PageGrid>

      {/* Basic Usage */}
      <PageGrid className="py-26">
        <PageGridRow>
          <div className="d-flex flex-column-reverse w-100">
            <h2 className="h4 mb-8">Basic Usage</h2>
            <h6 className="eyebrow mb-3">Simple Statistics</h6>
          </div>
          <p className="mb-8">
            CardStat components display prominent statistics with descriptive labels. They adapt responsively
            and can be used without buttons for purely informational displays.
          </p>
        </PageGridRow>
        <PageGridRow>
          <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
            <CardStat 
              statistic="6 Million"
              label="Active wallets"
              variant="lilac"
            />
          </PageGridCol>
          <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
            <CardStat 
              statistic="$1 Trillion"
              label="Value moved"
              variant="green"
            />
          </PageGridCol>
          <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
            <CardStat 
              statistic="12"
              superscript="+"
              label="Continuous uptime years"
              variant="light-gray"
            />
          </PageGridCol>
        </PageGridRow>
      </PageGrid>

      {/* Color Variants */}
      <PageGrid className="py-26">
        <PageGridRow>
          <div className="d-flex flex-column-reverse w-100">
            <h2 className="h4 mb-8">Color Variants</h2>
            <h6 className="eyebrow mb-3">Visual Themes</h6>
          </div>
          <p className="mb-8">
            Four color variants are available to match different types of statistics and visual contexts.
          </p>
        </PageGridRow>
        <PageGridRow>
          <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
            <CardStat 
              statistic="6M" 
              superscript="+"
              label="Active wallets"
              variant="lilac"
            />
            <p className="mt-4 text-muted"><strong>Lilac</strong> - User metrics, community stats</p>
          </PageGridCol>
          <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
            <CardStat 
              statistic="$1T" 
              superscript="+"
              label="Value moved"
              variant="green"
            />
            <p className="mt-4 text-muted"><strong>Green</strong> - Financial metrics, growth</p>
          </PageGridCol>
          <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
            <CardStat 
              statistic="12" 
              superscript="+"
              label="Uptime years"
              variant="light-gray"
            />
            <p className="mt-4 text-muted"><strong>Light Gray</strong> - Technical stats, reliability</p>
          </PageGridCol>
          <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
            <CardStat 
              statistic="70+" 
              label="Partners"
              variant="dark-gray"
            />
            <p className="mt-4 text-muted"><strong>Dark Gray</strong> - Neutral metrics, secondary info</p>
          </PageGridCol>
        </PageGridRow>
      </PageGrid>

      {/* With Single Button */}
      <PageGrid className="py-26">
        <PageGridRow>
        <div className="d-flex flex-column-reverse w-full">
          <h2 className="h4 mb-8">With Primary Button</h2>
          <h6 className="eyebrow mb-3">Single CTA</h6>
        </div>
        <p className="mb-8">
          Add a primary button for a main call-to-action. Buttons use the black variant for proper
          contrast on colored backgrounds.
        </p>
        </PageGridRow>
        <PageGridRow>
          <PageGridCol span={{ base: 4, md: 4, lg: 6 }}>
            <CardStat 
              statistic="6 Million" 
              superscript="+"
              label="Active wallets"
              variant="lilac"
              primaryButton={{
                label: "Explore",
                onClick: () => handleClick('explore-1')
              }}
            />
            {clickCount['explore-1'] > 0 && (
              <p className="mt-4 text-muted">Clicked {clickCount['explore-1']} time{clickCount['explore-1'] !== 1 ? 's' : ''}</p>
            )}
          </PageGridCol>
          <PageGridCol span={{ base: 4, md: 4, lg: 6 }}>
            <CardStat 
              statistic="$1 Trillion" 
              superscript="+"
              label="Value moved"
              variant="green"
              primaryButton={{
                label: "Learn More",
                onClick: () => handleClick('learn-1')
              }}
            />
            {clickCount['learn-1'] > 0 && (
              <p className="mt-4 text-muted">Clicked {clickCount['learn-1']} time{clickCount['learn-1'] !== 1 ? 's' : ''}</p>
            )}
          </PageGridCol>
          <PageGridCol span={{ base: 4, md: 4, lg: 12 }}>
            <CardStat 
              statistic="12" 
              superscript="+"
              label="Continuous uptime years"
              variant="light-gray"
              primaryButton={{
                label: "View Details",
                onClick: () => handleClick('view-1')
              }}
            />
            {clickCount['view-1'] > 0 && (
              <p className="mt-4 text-muted">Clicked {clickCount['view-1']} time{clickCount['view-1'] !== 1 ? 's' : ''}</p>
            )}
          </PageGridCol>
        </PageGridRow>
      </PageGrid>

      {/* With Two Buttons */}
      <PageGrid className="py-26">
        <PageGridRow>
        <div className="d-flex flex-column-reverse w-full">
          <h2 className="h4 mb-8">With Two Buttons</h2>
          <h6 className="eyebrow mb-3">Multiple CTAs</h6>
        </div>
        <p className="mb-8">
          Include both primary and secondary buttons for multiple action options. Buttons wrap responsively
          and maintain consistent spacing.
        </p>
        </PageGridRow>
      <PageGridRow>
        <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
          <CardStat 
            statistic="6 Million" 
            superscript="+"
            label="Active wallets"
            variant="lilac"
            primaryButton={{
              label: "Learn More",
              onClick: () => handleClick('primary-1')
            }}
            secondaryButton={{
              label: "Get Started",
              onClick: () => handleClick('secondary-1')
            }}
          />
          {(clickCount['primary-1'] > 0 || clickCount['secondary-1'] > 0) && (
            <p className="mt-4 text-muted">
              Primary: {clickCount['primary-1'] || 0}, Secondary: {clickCount['secondary-1'] || 0}
            </p>
          )}
        </PageGridCol>
        <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
          <CardStat 
            statistic="$1 Trillion" 
            superscript="+"
            label="Value moved"
            variant="green"
            primaryButton={{
              label: "Explore",
              onClick: () => handleClick('primary-2')
            }}
            secondaryButton={{
              label: "View Stats",
              onClick: () => handleClick('secondary-2')
            }}
          />
          {(clickCount['primary-2'] > 0 || clickCount['secondary-2'] > 0) && (
            <p className="mt-4 text-muted">
              Primary: {clickCount['primary-2'] || 0}, Secondary: {clickCount['secondary-2'] || 0}
            </p>
          )}
        </PageGridCol>
        <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
          <CardStat 
            statistic="12" 
            superscript="+"
            label="Continuous uptime years"
            variant="light-gray"
            primaryButton={{
              label: "Read More",
              onClick: () => handleClick('primary-3')
            }}
            secondaryButton={{
              label: "Try It",
              onClick: () => handleClick('secondary-3')
            }}
          />
          {(clickCount['primary-3'] > 0 || clickCount['secondary-3'] > 0) && (
            <p className="mt-4 text-muted">
              Primary: {clickCount['primary-3'] || 0}, Secondary: {clickCount['secondary-3'] || 0}
            </p>
          )}
        </PageGridCol>
      </PageGridRow>
    </PageGrid>

    {/* Responsive Behavior */}
    <PageGrid className="py-26">
      <PageGridRow>
      <div className="d-flex flex-column-reverse w-full">
        <h2 className="h4 mb-8">Responsive Layout</h2>
        <h6 className="eyebrow mb-3">Adaptive Grid</h6>
      </div>
      <p className="mb-8">
        Cards adapt to different screen sizes. On mobile (base), cards stack vertically. On tablet (md),
        they can be arranged in 2 columns. On desktop (lg+), up to 3-4 columns are supported.
      </p>
      </PageGridRow>
        <PageGridRow>
          <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
            <CardStat 
              statistic="1M" 
              superscript="+"
              label="Transactions daily"
              variant="lilac"
            />
          </PageGridCol>
          <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
            <CardStat 
              statistic="150" 
              superscript="+"
              label="Countries"
              variant="green"
            />
          </PageGridCol>
          <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>  
            <CardStat 
              statistic="99.9" 
              superscript="%"
              label="Uptime"
              variant="light-gray"
            />
          </PageGridCol>
          <PageGridCol span={{ base: 4, md: 4, lg: 3 }}>
            <CardStat 
              statistic="24/7" 
              label="Support"
              variant="dark-gray"
            />
          </PageGridCol>
        </PageGridRow>
      </PageGrid>

      {/* Mixed Configurations */}
      <PageGrid className="py-26">
        <PageGridRow>
          <div className="d-flex flex-column-reverse w-100">
            <h2 className="h4 mb-8">Mixed Configurations</h2>
            <h6 className="eyebrow mb-3">Flexible Usage</h6>
          </div>
          <p className="mb-8">
            Mix and match cards with different button configurations in the same layout.
          </p>
        </PageGridRow>
        <PageGridRow>
          <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
            <CardStat 
              statistic="6 Million" 
              superscript="+"
              label="Active wallets"
              variant="lilac"
            />
          </PageGridCol>
          <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
            <CardStat 
              statistic="$1 Trillion" 
              superscript="+"
              label="Value moved"
              variant="green"
              primaryButton={{
                label: "Learn More",
                onClick: () => handleClick('mixed-1')
              }}
            />
          </PageGridCol>
          <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
            <CardStat 
              statistic="12" 
              superscript="+"
              label="Continuous uptime years"
              variant="light-gray"
              primaryButton={{
                label: "Explore",
                onClick: () => handleClick('mixed-2')
              }}
              secondaryButton={{
                label: "Get Started",
                onClick: () => handleClick('mixed-3')
              }}
            />
          </PageGridCol>
        </PageGridRow>
      </PageGrid>

      {/* Wide Layout */}
      <PageGrid className="py-26">
        <PageGridRow>
        <div className="d-flex flex-column-reverse w-100">
          <h2 className="h4 mb-8">Wide Card Layout</h2>
          <h6 className="eyebrow mb-3">Larger Spans</h6>
        </div>
        <p className="mb-8">
          Cards can span multiple columns for wider layouts on larger screens.
        </p>
        </PageGridRow>
        <PageGridRow>
          <PageGridCol span={{ base: 4, md: 8, lg: 6 }}>
            <CardStat 
              statistic="6 Million" 
              superscript="+"
              label="Active wallets using XRPL"
              variant="lilac"
              primaryButton={{
                label: "Explore Wallets",
                onClick: () => handleClick('wide-1')
              }}
              secondaryButton={{
                label: "Get Started",
                onClick: () => handleClick('wide-2')
              }}
            />
          </PageGridCol>
          <PageGridCol span={{ base: 4, md: 8, lg: 6 }}>
            <CardStat 
              statistic="$1 Trillion" 
              superscript="+"
              label="Total value moved on the network"
              variant="green"
              primaryButton={{
                label: "View Statistics",
                onClick: () => handleClick('wide-3')
              }}
              secondaryButton={{
                label: "Learn More",
                onClick: () => handleClick('wide-4')
              }}
            />
          </PageGridCol>
        </PageGridRow>
      </PageGrid>

      {/* Usage Guidelines */}
      <PageGrid className="py-26">
        <PageGridRow>
        <div className="d-flex flex-column-reverse w-100">
          <h2 className="h4 mb-8">Usage Guidelines</h2>
          <h6 className="eyebrow mb-3">Best Practices</h6>
        </div>
        <div className="col-lg-8 mx-auto w-100">
          <h5 className="mb-4">When to Use</h5>
          <ul className="mb-8">
            <li><strong>Key metrics</strong> - Highlight important numbers prominently</li>
            <li><strong>Dashboard sections</strong> - Create stat-focused areas on landing pages</li>
            <li><strong>About pages</strong> - Showcase company or product statistics</li>
            <li><strong>Feature sections</strong> - Emphasize quantitative benefits</li>
          </ul>

          <h5 className="mb-4">Color Variant Selection</h5>
          <ul className="mb-8">
            <li><strong>Lilac</strong> - User-focused statistics, community metrics</li>
            <li><strong>Green</strong> - Financial metrics, growth indicators</li>
            <li><strong>Light Gray</strong> - Technical statistics, reliability metrics</li>
            <li><strong>Dark Gray</strong> - Neutral or secondary information</li>
          </ul>

          <h5 className="mb-4">Button Configuration</h5>
          <ul className="mb-8">
            <li><strong>No buttons</strong> - For purely informational displays</li>
            <li><strong>Single button</strong> - For one clear call-to-action</li>
            <li><strong>Two buttons</strong> - For multiple action options</li>
          </ul>

          <h5 className="mb-4">Tips</h5>
          <ul>
            <li>Keep statistics concise using abbreviations (M, K, T, +)</li>
            <li>Use descriptive labels that clearly explain the metric</li>
            <li>Choose colors that match the type of statistic</li>
            <li>Test on all breakpoints to ensure proper responsive behavior</li>
            <li>Limit buttons to essential actions</li>
          </ul>
        </div>
      </PageGridRow>
    </PageGrid>

      {/* Implementation Examples */}
      <PageGrid className="py-26">
        <PageGridRow>
        <div className="col-lg-10 mx-auto d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Code Examples</h2>
          <h6 className="eyebrow mb-3">Implementation</h6>
        </div>
        <div className="col-lg-10 mx-auto">
          <h5 className="mb-4">Basic Card</h5>
          <div className="p-4 mb-8 br-4" style={{ backgroundColor: '#f5f5f7', fontFamily: 'monospace', fontSize: '14px' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#000' }}>{`<CardStat 
  statistic="6 Million" 
  superscript="+"
  label="Active wallets"
  variant="lilac"
/>`}</pre>
          </div>

          <h5 className="mb-4">With Primary Button</h5>
          <div className="p-4 mb-8 br-4" style={{ backgroundColor: '#f5f5f7', fontFamily: 'monospace', fontSize: '14px' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#000' }}>{`<CardStat 
  statistic="$1 Trillion" 
  superscript="+"
  label="Value moved"
  variant="green"
  primaryButton={{
    label: "Learn More",
    href: "/about"
  }}
/>`}</pre>
          </div>

          <h5 className="mb-4">With Two Buttons</h5>
          <div className="p-4 mb-8 br-4" style={{ backgroundColor: '#f5f5f7', fontFamily: 'monospace', fontSize: '14px' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#000' }}>{`<CardStat 
  statistic="12" 
  superscript="+"
  label="Continuous uptime years"
  variant="light-gray"
  primaryButton={{
    label: "Learn More",
    onClick: handleLearnMore
  }}
  secondaryButton={{
    label: "Get Started",
    href: "/start"
  }}
/>`}</pre>
          </div>

          <h5 className="mb-4">In PageGrid Layout</h5>
          <div className="p-4 br-4" style={{ backgroundColor: '#f5f5f7', fontFamily: 'monospace', fontSize: '14px' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#000' }}>{`<PageGrid>
  <PageGridRow>
    <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
      <CardStat 
        statistic="6 Million" 
        superscript="+"
        label="Active wallets"
        variant="lilac"
      />
    </PageGridCol>
    <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
      <CardStat 
        statistic="$1 Trillion" 
        superscript="+"
        label="Value moved"
        variant="green"
      />
    </PageGridCol>
    <PageGridCol span={{ base: 4, md: 4, lg: 4 }}>
      <CardStat 
        statistic="12" 
        superscript="+"
        label="Uptime years"
        variant="light-gray"
      />
    </PageGridCol>
  </PageGridRow>
</PageGrid>`}</pre>
          </div>
        </div>
      </ PageGridRow>
    </ PageGrid>
    </div>
  );
}
