import React from "react";
import { PageGrid } from "shared/components/PageGrid/page-grid";

export function HomeHero() {
  return (
    <header className="bds-home-hero">
      <PageGrid>
        <PageGrid.Row>
          <PageGrid.Col span={12}>
            <div className="bds-home-hero__content">
              <h1 className="bds-home-hero__header">
                <span>Built for Finance.</span>
                <br />
                <span>Powered by Developers.</span>
                <br />
                <span className="bds-home-hero__subtitle">
                  Trusted by Institutions.
                </span>
              </h1>
              <div className="bds-home-hero__description">
                <img
                  className="bds-home-hero__media"
                  src="/img/home/RIPPLE_ICON_TIMED_00193.png"
                  alt="XRPL home"
                  width={1280}
                  height={458}
                />
              </div>
            </div>
          </PageGrid.Col>
        </PageGrid.Row>
      </PageGrid>
    </header>
  );
}
