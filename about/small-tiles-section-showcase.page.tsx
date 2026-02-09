import * as React from "react";
import {
  PageGrid,
  PageGridRow,
  PageGridCol,
} from "shared/components/PageGrid/page-grid";
import { SmallTilesSection } from "shared/patterns/SmallTilesSection/SmallTilesSection";

export const frontmatter = {
  seo: {
    title: "SmallTilesSection Component Showcase",
    description:
      "A comprehensive showcase of the SmallTilesSection component, demonstrating its grid layout, variants, and responsive behavior.",
  },
};

export default function SmallTilesSectionShowcase() {
  const handleClick = (message: string) => {
    console.log(`Card clicked: ${message}`);
  };

  // Sample icon SVG (black version for light backgrounds)
  const cardIconSvg =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='53' height='38' viewBox='0 0 53 38' fill='none'%3E%3Cpath d='M38.6603 0.0618191C35.7826 0.289503 33.3694 1.32168 31.5728 3.09764C29.7228 4.92673 28.8397 7.15805 28.8397 9.98896C28.8397 14.2239 30.5831 17.1839 34.4732 19.529C35.4629 20.121 36.8104 20.7661 39.1399 21.768C42.3144 23.1265 43.4944 23.7716 44.2481 24.5761C45.1769 25.5703 45.4357 27.1565 44.8495 28.3709C44.7353 28.6062 44.4384 29.0008 44.172 29.2664C43.2737 30.1696 41.8577 30.6477 40.0991 30.6477C37.1301 30.6477 34.9148 29.4334 33.1334 26.8074C32.8898 26.4583 32.669 26.1699 32.6385 26.1699C32.57 26.1699 26.7767 29.5017 26.6549 29.6156C26.5787 29.6839 26.6396 29.8433 26.9365 30.329C29.2508 34.2148 32.8669 36.4917 37.7544 37.1444C39.0333 37.319 41.4314 37.3114 42.657 37.1444C45.7326 36.7118 48.0393 35.6948 49.8283 33.9644C51.7315 32.1353 52.6679 29.7674 52.6679 26.7998C52.6679 24.9024 52.3558 23.4225 51.6478 21.9577C51.1605 20.9559 50.6733 20.2804 49.8359 19.4304C48.2296 17.8062 46.1513 16.5767 42.0023 14.8007C38.8658 13.4574 37.8153 12.8806 37.1225 12.1444C36.4602 11.4386 36.1785 10.6113 36.2394 9.57912C36.2927 8.75945 36.5211 8.20541 37.0235 7.66656C37.7468 6.88483 38.5842 6.55848 39.8783 6.56607C41.3476 6.56607 42.2992 6.94555 43.2661 7.91701C43.6086 8.25095 44.0502 8.78981 44.2557 9.11616C44.4917 9.48805 44.6668 9.69297 44.7277 9.6702C44.9256 9.58671 50.4602 6.01962 50.4602 5.9665C50.4602 5.93614 50.1785 5.49594 49.8359 4.97985C49.1051 3.88696 47.7881 2.52083 46.8821 1.92126C45.2073 0.813185 43.4183 0.243967 41.0583 0.0694065C39.9012 -0.0216694 39.7489 -0.0216694 38.6603 0.0618191Z' fill='black'/%3E%3Cpath d='M14.9592 13.8528L14.9364 27.2711L14.7689 27.901C14.5481 28.7283 14.2893 29.2216 13.8325 29.677C13.193 30.3145 12.3708 30.5802 11.0005 30.5877C9.04403 30.5953 7.87166 29.7681 6.50896 27.4457C6.28819 27.0814 6.09026 26.7854 6.06742 26.793C6.03697 26.8081 4.65905 27.6354 3.00706 28.6296L0 30.4511L0.228385 30.9065C1.59108 33.616 3.95105 35.6652 6.79064 36.6063C9.79009 37.6005 13.6422 37.5094 16.4665 36.3786C19.8542 35.0125 21.8412 32.1891 22.3665 27.9921C22.4121 27.5671 22.4426 22.8236 22.4426 13.8983V0.442009H18.7123H14.9896L14.9592 13.8528Z' fill='black'/%3E%3C/svg%3E";

  // Sample card data sets
  const languageTutorials = [
    {
      icon: cardIconSvg,
      iconAlt: "JavaScript",
      label: "JavaScript",
      href: "#javascript",
    },
    {
      icon: cardIconSvg,
      iconAlt: "Python",
      label: "Python",
      href: "#python",
    },
    {
      icon: cardIconSvg,
      iconAlt: "Go",
      label: "Go",
      href: "#go",
    },
    {
      icon: cardIconSvg,
      iconAlt: "Rust",
      label: "Rust",
      href: "#rust",
    },
    {
      icon: cardIconSvg,
      iconAlt: "Java",
      label: "Java",
      href: "#java",
    },
    {
      icon: cardIconSvg,
      iconAlt: "C++",
      label: "C++",
      href: "#cpp",
    },
  ];

  const featuredTopics = [
    {
      icon: cardIconSvg,
      iconAlt: "Quick Start",
      label: "Quick Start Guide",
      onClick: () => handleClick("quickstart"),
    },
    {
      icon: cardIconSvg,
      iconAlt: "Getting Started",
      label: "Get Started",
      onClick: () => handleClick("getting-started"),
    },
    {
      icon: cardIconSvg,
      iconAlt: "Tutorial",
      label: "Build Your First App",
      onClick: () => handleClick("first-app"),
    },
    {
      icon: cardIconSvg,
      iconAlt: "Advanced",
      label: "Advanced Topics",
      onClick: () => handleClick("advanced"),
    },
  ];

  const largeCardSet = [
    {
      icon: cardIconSvg,
      iconAlt: "Topic 1",
      label: "Topic One",
      href: "#topic1",
    },
    {
      icon: cardIconSvg,
      iconAlt: "Topic 2",
      label: "Topic Two",
      href: "#topic2",
    },
    {
      icon: cardIconSvg,
      iconAlt: "Topic 3",
      label: "Topic Three",
      href: "#topic3",
    },
    {
      icon: cardIconSvg,
      iconAlt: "Topic 4",
      label: "Topic Four",
      href: "#topic4",
    },
    {
      icon: cardIconSvg,
      iconAlt: "Topic 5",
      label: "Topic Five",
      href: "#topic5",
    },
    {
      icon: cardIconSvg,
      iconAlt: "Topic 6",
      label: "Topic Six",
      href: "#topic6",
    },
    {
      icon: cardIconSvg,
      iconAlt: "Topic 7",
      label: "Topic Seven",
      href: "#topic7",
    },
    {
      icon: cardIconSvg,
      iconAlt: "Topic 8",
      label: "Topic Eight",
      href: "#topic8",
    },
    {
      icon: cardIconSvg,
      iconAlt: "Topic 9",
      label: "Topic Nine",
      href: "#topic9",
    },
    {
      icon: cardIconSvg,
      iconAlt: "Topic 10",
      label: "Topic Ten",
      href: "#topic10",
    },
    {
      icon: cardIconSvg,
      iconAlt: "Topic 11",
      label: "Topic Eleven",
      href: "#topic11",
    },
  ];

  const mixedStates = [
    {
      icon: cardIconSvg,
      iconAlt: "Active Card",
      label: "Active Card",
      href: "#active",
    },
    {
      icon: cardIconSvg,
      iconAlt: "Clickable Card",
      label: "Clickable Card",
      onClick: () => handleClick("clickable"),
    },
    {
      icon: cardIconSvg,
      iconAlt: "Coming Soon",
      label: "Coming Soon",
      disabled: true,
    },
    {
      icon: cardIconSvg,
      iconAlt: "Another Active",
      label: "Another Active",
      href: "#another",
    },
    {
      icon: cardIconSvg,
      iconAlt: "Yet Another",
      label: "Yet Another",
      href: "#yetanother",
    },
  ];

  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-26 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Component Showcase</h6>
            <h1 className="mb-4">SmallTilesSection Component</h1>
            <p className="longform">
              A section component that displays multiple CardIcon components in
              a responsive grid layout. Features automatic grid adjustments at
              breakpoints, optional subtitle, and spacer support for large card
              sets (9+ cards).
            </p>
          </div>
        </section>

        {/* Basic Usage */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Basic Usage</h2>
              <p className="mb-6">
                SmallTilesSection automatically creates a responsive grid of
                CardIcon components. The grid adapts from 1 column on mobile, 2
                columns on tablets, to 3 columns on desktop.
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <SmallTilesSection
          headline="Language Tutorials"
          subtitle="Choose a language to get started with XRPL development"
          cardVariant="neutral"
          cards={languageTutorials}
        />

        {/* Green Variant */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Green Variant</h2>
              <p className="mb-6">
                Use the green variant to highlight featured or recommended
                content.
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <SmallTilesSection
          headline="Featured Topics"
          subtitle="Recommended content to help you get started"
          cardVariant="green"
          cards={featuredTopics}
        />

        {/* Without Subtitle */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Without Subtitle</h2>
              <p className="mb-6">
                The subtitle is optional. Here's an example without it.
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <SmallTilesSection
          headline="Quick Links"
          cardVariant="neutral"
          cards={featuredTopics.slice(0, 3)}
        />

        {/* Large Card Set with Spacer */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Large Card Set (Spacer Feature)</h2>
              <p className="mb-6">
                When a section contains more than 8 cards, the component
                automatically adds a spacer element to improve grid alignment.
                This ensures cards align properly even with varying card counts.
                The spacer is visible on large screens (≥992px).
              </p>

              <div
                className="p-4 mb-6"
                style={{
                  backgroundColor: "rgba(114, 119, 126, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <h6 className="mb-3">Spacer Details</h6>
                <ul className="mb-0">
                  <li>
                    <strong>Threshold:</strong> 8 cards (spacer appears with 9+
                    cards)
                  </li>
                  <li>
                    <strong>Visibility:</strong> Only visible on large screens
                    (≥992px)
                  </li>
                  <li>
                    <strong>Purpose:</strong> Ensures proper grid alignment with
                    varying card counts
                  </li>
                </ul>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <SmallTilesSection
          headline="All Topics"
          subtitle={`${largeCardSet.length} topics available (spacer enabled)`}
          cardVariant="neutral"
          cards={largeCardSet}
        />

        {/* Mixed States */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Mixed Card States</h2>
              <p className="mb-6">
                Individual cards within the section can have different states
                and behaviors. Cards can be links (href), buttons (onClick), or
                disabled.
              </p>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <SmallTilesSection
          headline="Mixed States Example"
          subtitle="Combination of links, click handlers, and disabled cards"
          cardVariant="neutral"
          cards={mixedStates}
        />

        {/* Responsive Behavior */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Responsive Grid Behavior</h2>
              <p className="mb-6">
                The grid automatically adjusts based on viewport width. Resize
                your browser to see the changes.
              </p>

              <div className="d-flex flex-column gap-4 mb-6">
                <div
                  className="d-flex flex-row gap-4 align-items-start"
                  style={{ flexWrap: "wrap" }}
                >
                  <div style={{ flex: "1 1 300px", minWidth: "280px" }}>
                    <h6 className="mb-3">Mobile (&lt;576px)</h6>
                    <ul className="mb-0">
                      <li>
                        <strong>Columns:</strong> 1
                      </li>
                      <li>
                        <strong>Gap:</strong> 8px
                      </li>
                      <li>
                        <strong>Layout:</strong> Single column stack
                      </li>
                    </ul>
                  </div>
                  <div style={{ flex: "1 1 300px", minWidth: "280px" }}>
                    <h6 className="mb-3">Tablet (576px–991px)</h6>
                    <ul className="mb-0">
                      <li>
                        <strong>Columns:</strong> 2
                      </li>
                      <li>
                        <strong>Gap:</strong> 8px
                      </li>
                      <li>
                        <strong>Layout:</strong> Two column grid
                      </li>
                    </ul>
                  </div>
                  <div style={{ flex: "1 1 300px", minWidth: "280px" }}>
                    <h6 className="mb-3">Desktop (≥992px)</h6>
                    <ul className="mb-0">
                      <li>
                        <strong>Columns:</strong> 3
                      </li>
                      <li>
                        <strong>Gap:</strong> 8px
                      </li>
                      <li>
                        <strong>Layout:</strong> Three column grid
                      </li>
                      <li>
                        <strong>Spacer:</strong> Enabled for 9+ cards
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <SmallTilesSection
          headline="Responsive Demo"
          subtitle="Resize your browser to see the grid adapt"
          cardVariant="neutral"
          cards={languageTutorials}
        />

        {/* Real-World Examples */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Real-World Examples</h2>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <div className="d-flex flex-column gap-8 mb-10">
          {/* Documentation Categories */}
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <h6 className="mb-4">Documentation Categories</h6>
                <p className="mb-4 text-muted">
                  Use SmallTilesSection to organize documentation by category or
                  topic.
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <SmallTilesSection
            headline="Browse by Category"
            subtitle="Explore documentation organized by topic"
            cardVariant="neutral"
            cards={[
              {
                icon: cardIconSvg,
                iconAlt: "Concepts",
                label: "Concepts",
                href: "#concepts",
              },
              {
                icon: cardIconSvg,
                iconAlt: "Tutorials",
                label: "Tutorials",
                href: "#tutorials",
              },
              {
                icon: cardIconSvg,
                iconAlt: "References",
                label: "References",
                href: "#references",
              },
              {
                icon: cardIconSvg,
                iconAlt: "Use Cases",
                label: "Use Cases",
                href: "#use-cases",
              },
            ]}
          />

          {/* Featured Resources */}
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <h6 className="mb-4">Featured Resources</h6>
                <p className="mb-4 text-muted">
                  Highlight important resources using the green variant.
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <SmallTilesSection
            headline="Featured Resources"
            subtitle="Start here for the most important resources"
            cardVariant="green"
            cards={[
              {
                icon: cardIconSvg,
                iconAlt: "Getting Started",
                label: "Getting Started",
                href: "#getting-started",
              },
              {
                icon: cardIconSvg,
                iconAlt: "Quick Start",
                label: "Quick Start Guide",
                href: "#quickstart",
              },
              {
                icon: cardIconSvg,
                iconAlt: "Best Practices",
                label: "Best Practices",
                href: "#best-practices",
              },
            ]}
          />

          {/* Development Tools */}
          <PageGrid>
            <PageGridRow>
              <PageGridCol span={12}>
                <h6 className="mb-4">Development Tools</h6>
                <p className="mb-4 text-muted">
                  Showcase available tools and SDKs.
                </p>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
          <SmallTilesSection
            headline="Development Tools & SDKs"
            cardVariant="neutral"
            cards={[
              {
                icon: cardIconSvg,
                iconAlt: "xrpl.js",
                label: "xrpl.js",
                href: "#xrpl-js",
              },
              {
                icon: cardIconSvg,
                iconAlt: "xrpl-py",
                label: "xrpl-py",
                href: "#xrpl-py",
              },
              {
                icon: cardIconSvg,
                iconAlt: "xrpl-clio",
                label: "xrpl-clio",
                href: "#xrpl-clio",
              },
              {
                icon: cardIconSvg,
                iconAlt: "XRPL Explorer",
                label: "XRPL Explorer",
                href: "#explorer",
              },
              {
                icon: cardIconSvg,
                iconAlt: "Testnet Faucet",
                label: "Testnet Faucet",
                href: "#faucet",
              },
              {
                icon: cardIconSvg,
                iconAlt: "Validator",
                label: "Validator",
                href: "#validator",
              },
            ]}
          />
        </div>

        {/* API Reference */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Component API</h2>
              <div className="mb-10">
                {/* Header Row */}
                <div
                  className="d-flex flex-row mb-3 pb-2"
                  style={{
                    gap: "1rem",
                    borderBottom: "2px solid var(--bs-border-color, #dee2e6)",
                  }}
                >
                  <div style={{ width: "120px", flexShrink: 0 }}>
                    <strong>Prop</strong>
                  </div>
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    <strong>Type</strong>
                  </div>
                  <div style={{ width: "100px", flexShrink: 0 }}>
                    <strong>Default</strong>
                  </div>
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    <strong>Description</strong>
                  </div>
                </div>

                {/* headline */}
                <div
                  className="d-flex flex-row py-3"
                  style={{
                    gap: "1rem",
                    borderBottom: "1px solid var(--bs-border-color, #dee2e6)",
                  }}
                >
                  <div style={{ width: "120px", flexShrink: 0 }}>
                    <code>headline</code>
                  </div>
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    <code>React.ReactNode</code>
                  </div>
                  <div style={{ width: "100px", flexShrink: 0 }}>
                    <em>required</em>
                  </div>
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    Section headline displayed as h2
                  </div>
                </div>

                {/* subtitle */}
                <div
                  className="d-flex flex-row py-3"
                  style={{
                    gap: "1rem",
                    borderBottom: "1px solid var(--bs-border-color, #dee2e6)",
                  }}
                >
                  <div style={{ width: "120px", flexShrink: 0 }}>
                    <code>subtitle</code>
                  </div>
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    <code>React.ReactNode</code>
                  </div>
                  <div style={{ width: "100px", flexShrink: 0 }}>
                    <code>undefined</code>
                  </div>
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    Optional subtitle text displayed below headline
                  </div>
                </div>

                {/* cardVariant */}
                <div
                  className="d-flex flex-row py-3"
                  style={{
                    gap: "1rem",
                    borderBottom: "1px solid var(--bs-border-color, #dee2e6)",
                  }}
                >
                  <div style={{ width: "120px", flexShrink: 0 }}>
                    <code>cardVariant</code>
                  </div>
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    <code>'neutral' | 'green'</code>
                  </div>
                  <div style={{ width: "100px", flexShrink: 0 }}>
                    <em>required</em>
                  </div>
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    Color variant applied to all cards in the section
                  </div>
                </div>

                {/* cards */}
                <div
                  className="d-flex flex-row py-3"
                  style={{
                    gap: "1rem",
                    borderBottom: "1px solid var(--bs-border-color, #dee2e6)",
                  }}
                >
                  <div style={{ width: "120px", flexShrink: 0 }}>
                    <code>cards</code>
                  </div>
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    <code>CardIconProps[]</code>
                  </div>
                  <div style={{ width: "100px", flexShrink: 0 }}>
                    <em>required</em>
                  </div>
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    Array of card configurations (CardIconProps without variant
                    prop). Section renders nothing if array is empty.
                  </div>
                </div>

                {/* className */}
                <div
                  className="d-flex flex-row py-3"
                  style={{
                    gap: "1rem",
                    borderBottom: "1px solid var(--bs-border-color, #dee2e6)",
                  }}
                >
                  <div style={{ width: "120px", flexShrink: 0 }}>
                    <code>className</code>
                  </div>
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    <code>string</code>
                  </div>
                  <div style={{ width: "100px", flexShrink: 0 }}>
                    <code>''</code>
                  </div>
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    Additional CSS classes for the section element
                  </div>
                </div>

                {/* Standard section props */}
                <div className="d-flex flex-row py-3" style={{ gap: "1rem" }}>
                  <div style={{ width: "120px", flexShrink: 0 }}>
                    <code>...rest</code>
                  </div>
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    <code>React.ComponentPropsWithoutRef&lt;"section"&gt;</code>
                  </div>
                  <div style={{ width: "100px", flexShrink: 0 }}>
                    <code>-</code>
                  </div>
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    All standard HTML section element props
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="h5 mb-4">Card Props (cards array items)</h3>
                <p className="mb-4">
                  Each item in the <code>cards</code> array accepts all CardIcon
                  props except <code>variant</code> (which is set via{" "}
                  <code>cardVariant</code>).
                </p>
                <ul>
                  <li>
                    <code>icon</code> (string, required) - Icon image source
                  </li>
                  <li>
                    <code>iconAlt</code> (string, optional) - Alt text for icon
                  </li>
                  <li>
                    <code>label</code> (string, required) - Card label text
                  </li>
                  <li>
                    <code>href</code> (string, optional) - Link destination
                    (renders as anchor)
                  </li>
                  <li>
                    <code>onClick</code> (() =&gt; void, optional) - Click
                    handler (renders as button)
                  </li>
                  <li>
                    <code>disabled</code> (boolean, optional) - Disabled state
                  </li>
                  <li>
                    <code>className</code> (string, optional) - Additional CSS
                    classes
                  </li>
                </ul>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        {/* Design Notes */}
        <PageGrid className="py-26">
          <PageGridRow>
            <PageGridCol span={12}>
              <h2 className="h4 mb-6">Design Notes</h2>
              <div className="d-flex flex-column gap-4">
                <div>
                  <h6 className="mb-2">Grid Layout</h6>
                  <ul>
                    <li>
                      Responsive grid with automatic column adjustments at
                      breakpoints
                    </li>
                    <li>
                      8px gap between cards (consistent across all breakpoints)
                    </li>
                    <li>
                      Grid uses CSS Grid with <code>grid-auto-flow: row</code>
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className="mb-2">Spacer Feature</h6>
                  <ul>
                    <li>Automatically enabled when card count exceeds 8</li>
                    <li>Spacer is a grid-spanning invisible element</li>
                    <li>
                      Only visible on large screens (≥992px) to improve
                      alignment
                    </li>
                    <li>
                      Helps maintain consistent grid layout with varying card
                      counts
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className="mb-2">Typography</h6>
                  <ul>
                    <li>
                      Headline uses <code>h4</code> class
                    </li>
                    <li>
                      Subtitle uses <code>body-r</code> class
                    </li>
                    <li>8px margin below headline</li>
                    <li>24px margin below subtitle (when present)</li>
                  </ul>
                </div>
                <div>
                  <h6 className="mb-2">Component Structure</h6>
                  <ul>
                    <li>
                      Returns <code>null</code> if cards array is empty
                    </li>
                    <li>
                      Each card is wrapped in a <code>&lt;li&gt;</code> element
                    </li>
                    <li>Cards are rendered using the CardIcon component</li>
                    <li>All cards in a section share the same variant</li>
                  </ul>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </div>
    </div>
  );
}
