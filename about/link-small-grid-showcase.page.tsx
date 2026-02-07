import * as React from "react";
import { LinkSmallGrid } from "shared/patterns/LinkSmallGrid";
import { Divider } from "shared/components/Divider";

export const frontmatter = {
  seo: {
    title: 'LinkSmallGrid Component Showcase',
    description: "A comprehensive showcase of the LinkSmallGrid pattern component with responsive grid layouts, color variants, and usage examples.",
  }
};

export default function LinkSmallGridShowcase() {
  const handleClick = (message: string) => {
    console.log(`Link clicked: ${message}`);
  };

  // Sample links for demonstrations
  const sampleLinks = [
    { label: "Documentation", href: "/docs" },
    { label: "Tutorials", href: "/tutorials" },
    { label: "API Reference", href: "/api" },
    { label: "Examples", href: "/examples" },
    { label: "Best Practices", href: "/best-practices" },
    { label: "Tools", href: "/tools" },
    { label: "Resources", href: "/resources" },
    { label: "Community", href: "/community" },
  ];

  return (
    <div className="landing">
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-26 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Pattern Showcase</h6>
            <h1 className="mb-4">LinkSmallGrid Pattern</h1>
            <p className="longform">
              A responsive grid section pattern for displaying navigational links using TileLink components.
              Features a heading, optional description, and a grid of clickable tiles with 2 color variants
              and full light/dark mode support.
            </p>
          </div>
        </section>

        <Divider color="gray" />

        {/* Full Example - Gray Variant */}
        <LinkSmallGrid
          variant="gray"
          heading="Quick Links"
          description="Navigate to key sections of our documentation and resources."
          links={sampleLinks}
        />

        <Divider color="gray" />

        {/* Full Example - Lilac Variant */}
        <LinkSmallGrid
          variant="lilac"
          heading="Get Started"
          description="Explore tutorials and guides to begin your journey with XRPL."
          links={sampleLinks.slice(0, 4)}
        />

        <Divider color="gray" />

        {/* Gray Variant - Heading Only */}
        <LinkSmallGrid
          variant="gray"
          heading="Developer Resources"
          links={sampleLinks.slice(0, 6)}
        />

        <Divider color="gray" />

        {/* Lilac Variant - With Click Handlers */}
        <LinkSmallGrid
          variant="lilac"
          heading="Interactive Examples"
          description="Click any tile to see the onClick handler in action (check console)."
          links={[
            { label: "Example 1", onClick: () => handleClick('Example 1') },
            { label: "Example 2", onClick: () => handleClick('Example 2') },
            { label: "Example 3", onClick: () => handleClick('Example 3') },
            { label: "Example 4", onClick: () => handleClick('Example 4') },
          ]}
        />

        <Divider color="gray" />

        {/* Different Link Counts */}
        <section className=" py-26">
          <div className="d-flex flex-column-reverse mb-10">
            <h2 className="h4 mb-8">Different Link Counts</h2>
            <h6 className="eyebrow mb-3">Responsive Behavior</h6>
          </div>

          <div className="mb-10">
            <h6 className="mb-4">2 Links</h6>
            <LinkSmallGrid
              variant="gray"
              heading="Featured Sections"
              links={sampleLinks.slice(0, 2)}
            />
          </div>

          <div className="mb-10">
            <h6 className="mb-4">3 Links</h6>
            <LinkSmallGrid
              variant="lilac"
              heading="Core Topics"
              links={sampleLinks.slice(0, 3)}
            />
          </div>

          <div className="mb-10">
            <h6 className="mb-4">5 Links</h6>
            <LinkSmallGrid
              variant="gray"
              heading="Learning Paths"
              description="Choose a path to start learning."
              links={sampleLinks.slice(0, 5)}
            />
          </div>

          <div className="mb-10">
            <h6 className="mb-4">12 Links</h6>
            <LinkSmallGrid
              variant="lilac"
              heading="Complete Navigation"
              description="Full grid with multiple rows."
              links={[
                ...sampleLinks,
                { label: "Blog", href: "/blog" },
                { label: "Events", href: "/events" },
                { label: "Newsletter", href: "/newsletter" },
                { label: "Support", href: "/support" },
              ]}
            />
          </div>
        </section>

        <Divider color="gray" />
      </div>
    </div>
  );
}

