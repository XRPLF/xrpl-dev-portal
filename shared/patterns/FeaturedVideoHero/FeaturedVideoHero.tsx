import React, { forwardRef, useCallback } from "react";
import clsx from "clsx";
import { PageGrid } from "shared/components/PageGrid/page-grid";
import { Button, ButtonProps } from "shared/components/Button/Button";
import { isEmpty, isEnvironment } from "shared/utils";
import {
  DesignConstrainedCallToActionsProps,
  DesignConstrainedVideoProps,
} from "shared/utils/types";

export interface FeaturedVideoHeroProps
  extends
    React.ComponentPropsWithoutRef<"header">,
    DesignConstrainedCallToActionsProps {
  headline: React.ReactNode;
  subtitle?: React.ReactNode;
  videoElement: DesignConstrainedVideoProps;
}
const FeaturedVideoHero = forwardRef<HTMLElement, FeaturedVideoHeroProps>(
  (props, ref) => {
    const {
      headline,
      subtitle,
      videoElement,
      callsToAction,
      className,
      ...rest
    } = props;

    const validateProps = useCallback<() => boolean>(() => {
      const requiredProps = { headline, videoElement } as const;
      let isValid = true;

      for (const [key, value] of Object.entries(requiredProps)) {
        if (isEmpty(value)) {
          if (isEnvironment(["development", "test"])) {
            console.warn(`${key} is required for FeaturedVideoHero`);
          }
          isValid = false;
        }
      }
      return isValid;
    }, [headline, videoElement]);

    if (!validateProps()) {
      return null;
    }

    const [primaryCta, secondaryCta] = callsToAction ?? [];

    /** At least one CTA must be non-empty to show the CTA section */
    const hasCallsToAction = callsToAction?.some((cta) => !isEmpty(cta));

    return (
      <header
        ref={ref}
        className={clsx("bds-featured-video-hero", className)}
        {...rest}
      >
        <PageGrid>
          <PageGrid.Row>
            <PageGrid.Col span={{ base: 4, md: 8, lg: 5 }}>
              <div className="bds-featured-video-hero__content">
                <h1 className="bds-featured-video-hero__title h-md">
                  {headline}
                </h1>
                {subtitle && (
                  <PageGrid.Row className="bds-featured-video-hero__subtitle body-l">
                    <PageGrid.Col
                      span={{ base: "fill", md: 6, lg: 10 }}
                      className="bds-featured-video-hero__subtitle-col"
                    >
                      {subtitle}
                    </PageGrid.Col>
                  </PageGrid.Row>
                )}
                {hasCallsToAction && (
                  <div className="bds-featured-video-hero__cta-buttons">
                    {!isEmpty(primaryCta) && (
                      <Button
                        {...primaryCta}
                        variant="primary"
                        color="green"
                        forceColor={true}
                      />
                    )}
                    {!isEmpty(secondaryCta) && (
                      <Button
                        {...secondaryCta}
                        variant="tertiary"
                        color="green"
                        forceColor={true}
                      />
                    )}
                  </div>
                )}
              </div>
            </PageGrid.Col>
            <PageGrid.Col
              span={{ base: 4, md: 8, lg: 6 }}
              offset={{ base: 0, md: 0, lg: 1 }}
            >
              <div className="bds-featured-video-hero__video-container">
                <video
                  {...videoElement}
                  className="bds-featured-video-hero__video"
                />
              </div>
            </PageGrid.Col>
          </PageGrid.Row>
        </PageGrid>
      </header>
    );
  },
);

FeaturedVideoHero.displayName = "FeaturedVideoHero";

export default FeaturedVideoHero;
