import React from "react";
import clsx from "clsx";
import { PageGrid } from "shared/components/PageGrid/page-grid";

export interface HomeHeroProps {
  /** Main heading lines, rendered stacked (each on its own line). */
  titleLines: React.ReactNode[];
  /** Accent subtitle line (monospace), rendered below the title lines. */
  subtitle?: React.ReactNode;
  /** Hero media image. */
  media: {
    src: string;
    alt: string;
    /** Intrinsic width in px (recommended to avoid layout shift). */
    width?: number;
    /** Intrinsic height in px (recommended to avoid layout shift). */
    height?: number;
  };
  /** Additional CSS classes applied to the root element. */
  className?: string;
}

/**
 * HomeHero
 *
 * The XRPL home page hero: a centered stacked heading with an optional
 * monospace accent subtitle, above a centered media image. Content is fully
 * prop-driven. Styles live in HomeHero.scss (imported globally via xrpl.scss).
 *
 * @example
 * <HomeHero
 *   titleLines={[translate("Built for Finance."), translate("Powered by Developers.")]}
 *   subtitle={translate("Trusted by Institutions.")}
 *   media={{ src: "/img/home/ripple-icon-timed.png", alt: translate("XRPL home"), width: 1280, height: 458 }}
 * />
 */
export const HomeHero: React.FC<HomeHeroProps> = ({
  titleLines,
  subtitle,
  media,
  className,
}) => {
  return (
    <header className={clsx("bds-home-hero", className)}>
      <PageGrid>
        <PageGrid.Row>
          <PageGrid.Col span={12}>
            <div className="bds-home-hero__content">
              <h1 className="bds-home-hero__header">
                {titleLines.map((line, index) => (
                  <React.Fragment key={index}>
                    <span>{line}</span>
                    <br />
                  </React.Fragment>
                ))}
                {subtitle ? (
                  <span className="bds-home-hero__subtitle">{subtitle}</span>
                ) : null}
              </h1>
              <div className="bds-home-hero__description">
                <img
                  className="bds-home-hero__media"
                  src={media.src}
                  alt={media.alt}
                  width={media.width}
                  height={media.height}
                />
              </div>
            </div>
          </PageGrid.Col>
        </PageGrid.Row>
      </PageGrid>
    </header>
  );
};

export default HomeHero;
