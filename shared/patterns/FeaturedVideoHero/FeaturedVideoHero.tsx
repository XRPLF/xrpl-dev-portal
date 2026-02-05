import React, { forwardRef, useCallback } from "react";
import clsx from "clsx";
import { PageGrid } from "shared/components/PageGrid/page-grid";
import { ButtonGroup, ButtonConfig } from "shared/patterns/ButtonGroup/ButtonGroup";
import { useButtonValidation } from "shared/patterns/ButtonGroup/buttonGroupUtils";
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

    // Convert callsToAction to ButtonConfig format for ButtonGroup
    const buttonConfigs: ButtonConfig[] = (callsToAction ?? [])
      .filter((cta) => !isEmpty(cta))
      .map((cta) => ({
        label: typeof cta?.children === 'string' ? cta.children : '',
        href: cta?.href,
        onClick: cta?.onClick,
        forceColor: true,
      }));

    // Validate buttons (max 2 CTAs supported)
    const { validation: buttonValidation, hasButtons: hasCallsToAction } = useButtonValidation(
      buttonConfigs,
      2,
      isEnvironment(["development", "test"]) // Only log warnings in dev/test
    );

    return (
      <header
        ref={ref}
        className={clsx("bds-featured-video-hero", className)}
        {...rest}
      >
        <PageGrid>
          <PageGrid.Row>
            <PageGrid.Col span={{ base: 4, md: 8, lg: 6 }}>
              <div className="bds-featured-video-hero__content">
                <h1 className="mb-0 h-md">
                  {headline}
                </h1>
                
                <div className="bds-featured-video-hero__bottom-group">
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
                    <ButtonGroup
                      buttons={buttonValidation!.buttons}
                      color="green"
                      forceColor
                      gap="small"
                    />
                  )}
                </div>
              </div>
            </PageGrid.Col>
            <PageGrid.Col
              span={{ base: 4, md: 8, lg: 6 }}
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
