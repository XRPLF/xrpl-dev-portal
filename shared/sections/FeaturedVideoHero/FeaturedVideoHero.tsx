import React, { forwardRef, useCallback } from "react";
import clsx from "clsx";
import { PageGrid } from "shared/components/PageGrid/page-grid";
import { Video, type VideoSource } from "shared/components/Video";
import { ButtonGroup, ButtonConfig, validateButtonGroup } from "shared/patterns/ButtonGroup/ButtonGroup";
import { isEmpty, isEnvironment } from "shared/utils";
import {
  DesignConstrainedLinksProps,
  DesignConstrainedVideoProps,
} from "shared/utils/types";

/** Video config for embed (YouTube/Vimeo/Wistia) with optional cover image */
export interface FeaturedVideoHeroVideoConfig {
  source: VideoSource;
  coverImage?: {
    src: string;
    alt: string;
  };
}

export interface FeaturedVideoHeroProps
  extends
    React.ComponentPropsWithoutRef<"header">,
    DesignConstrainedLinksProps {
  headline: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Native HTML video props (use when video is not provided) */
  videoElement?: DesignConstrainedVideoProps;
  /** Video config for embed + optional cover modal (use when videoElement is not provided) */
  video?: FeaturedVideoHeroVideoConfig;
}
const FeaturedVideoHero = forwardRef<HTMLElement, FeaturedVideoHeroProps>(
  (props, ref) => {
    const {
      headline,
      subtitle,
      videoElement,
      video,
      links,
      className,
      ...rest
    } = props;

    const hasVideo = !isEmpty(video) || !isEmpty(videoElement);

    const validateProps = useCallback<() => boolean>(() => {
      if (isEmpty(headline)) {
        if (isEnvironment(["development", "test"])) {
          console.warn("headline is required for FeaturedVideoHero");
        }
        return false;
      }
      if (!hasVideo) {
        if (isEnvironment(["development", "test"])) {
          console.warn("videoElement or video is required for FeaturedVideoHero");
        }
        return false;
      }
      return true;
    }, [headline, hasVideo]);

    if (!validateProps()) {
      return null;
    }

    // Map links to ButtonConfig format for ButtonGroup
    const buttonConfigs: ButtonConfig[] = (links ?? [])
      .filter((link) => !isEmpty(link) && link.label && link.href)
      .map((link) => ({
        label: link.label,
        href: link.href,
        forceColor: true,
      }));

    // Validate buttons (max 2 CTAs supported)
    const buttonValidation = validateButtonGroup(
      buttonConfigs,
      2,
      isEnvironment(["development", "test"]) // Only log warnings in dev/test
    );
    const hasLinks = buttonValidation.hasButtons;

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
                        as="p"
                      >
                        {subtitle}
                      </PageGrid.Col>
                    </PageGrid.Row>
                  )}
                  {hasLinks && (
                    <ButtonGroup
                      buttons={buttonValidation.buttons}
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
                {video ? (
                  <Video
                    source={video.source}
                    coverImage={video.coverImage}
                    className="bds-featured-video-hero__video"
                  />
                ) : (
                  <Video
                    source={{ type: "native", props: videoElement! }}
                    className="bds-featured-video-hero__video"
                  />
                )}
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
