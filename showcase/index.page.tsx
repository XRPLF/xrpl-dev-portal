import * as React from "react";
import { Link } from "@redocly/theme/components/Link/Link";
import { PageGrid, PageGridRow, PageGridCol } from "shared/components/PageGrid/page-grid";

export const frontmatter = {
  seo: {
    title: "Design System Showcase",
    description:
      "Browse the XRPL.org Brand Design System showcase—components, patterns, and sections for building consistent, accessible interfaces.",
  },
};

const COMPONENTS = [
  { label: "Button (Primary)", href: "/showcase/button-primary" },
  { label: "Button (Secondary)", href: "/showcase/button-secondary" },
  { label: "Button (Tertiary)", href: "/showcase/button-tertiary" },
  { label: "CardImage", href: "/showcase/card-image" },
  { label: "CardIcon", href: "/showcase/card-icon" },
  { label: "CardOffgrid", href: "/showcase/card-offgrid" },
  { label: "Divider", href: "/showcase/divider" },
  { label: "Link", href: "/showcase/link" },
  { label: "TileLink", href: "/showcase/tile-link" },
  { label: "TileLogo", href: "/showcase/tile-logo" },
  { label: "PageGrid", href: "/showcase/grid" },
  { label: "Typography", href: "/showcase/typography" },
];

const SECTIONS = [
  { label: "CalloutMediaBanner", href: "/showcase/callout-media-banner" },
  { label: "CardStats", href: "/showcase/card-stats" },
  { label: "CardsFeatured", href: "/showcase/cards-featured" },
  { label: "CardsIconGrid", href: "/showcase/cards-icon-grid" },
  { label: "CardsTextGrid", href: "/showcase/cards-text-grid" },
  { label: "CardsTwoColumn", href: "/showcase/cards-two-column" },
  { label: "CarouselCardList", href: "/showcase/carousel-card-list" },
  { label: "CarouselFeatured", href: "/showcase/carousel-featured" },
  { label: "FeaturedVideoHero", href: "/showcase/featured-video-hero" },
  { label: "FeatureSingleTopic", href: "/showcase/feature-single-topic" },
  { label: "FeatureTwoColumn", href: "/showcase/feature-two-column" },
  { label: "HeaderHeroPrimaryMedia", href: "/showcase/header-hero-primary-media" },
  { label: "HeaderHeroSplitMedia", href: "/showcase/header-hero-split-media" },
  { label: "LinkSmallGrid", href: "/showcase/link-small-grid" },
  { label: "LinkTextDirectory", href: "/showcase/link-text-directory" },
  { label: "LogoRectangleGrid", href: "/showcase/logo-rectangle-grid" },
  { label: "LogoSquareGrid", href: "/showcase/logo-square-grid" },
  { label: "SmallTilesSection", href: "/showcase/small-tiles-section" },
  { label: "StandardCardGroupSection", href: "/showcase/standard-card-group-section" },
];

function ShowcaseColumn({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: Array<{ label: string; href: string }>;
}) {
  return (
    <div className="d-flex flex-column h-100">
      <h2 className="h4 mb-3">{title}</h2>
      <p className="text-muted mb-6">{description}</p>
      <ul className="list-unstyled mb-0" style={{ flex: 1 }}>
        {items.map((item) => (
          <li key={item.href} className="mb-3">
            <Link to={item.href} className="text-decoration-none">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ShowcaseIndex() {
  return (
    <div className="landing py-26">
      <div className="overflow-hidden">
        <section className="mb-8 text-center">
          <div className="col-lg-8 mx-auto">
            <h6 className="eyebrow mb-3">Brand Design System</h6>
            <h1 className="mb-4">Showcase</h1>
            <p className="longform">
              Explore the XRPL.org design system. Browse components, patterns, and sections to build consistent, accessible interfaces.
            </p>
          </div>
        </section>

        <PageGrid>
          <PageGridRow>
            <PageGridCol span={{ base: 4, lg: 6 }} className="mb-10 mb-lg-0">
              <div className="p-6-sm p-10-until-sm br-8 h-100" style={{border: "1px solid var(--bs-border-color)" }}>
                <ShowcaseColumn
                  title="Components & Patterns"
                  description="Reusable UI building blocks—buttons, cards, links, and layout primitives."
                  items={COMPONENTS}
                />
              </div>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8 h-100" style={{border: "1px solid var(--bs-border-color)" }}>
                <ShowcaseColumn
                  title="Sections"
                  description="Full page sections—card grids, logo grids, link directories, and more."
                  items={SECTIONS}
                />
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </div>
    </div>
  );
}
