import React, { forwardRef, memo, useEffect } from "react";
import clsx from "clsx";
import { PageGrid } from "shared/components/PageGrid/page-grid";
import { Button, ButtonProps } from "shared/components/Button/Button";

const isEmpty = (val: unknown): boolean => {
  if (val === null || val === undefined) return true;
  if (typeof val === "string") return val.trim().length === 0;
  if (Array.isArray(val)) return val.length === 0 || !val[0];
  return Boolean(val);
};

type DesignContrainedButtonProps = Omit<ButtonProps, "variant" | "color">;

/**
 * Base props that all media elements must have to ensure proper styling.
 * These props are automatically applied to maintain the 9:16 aspect ratio
 * and object-fit: cover behavior.
 */
type MediaStyleProps = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Image media type - extends native img element props
 */
type ImageMediaProps = {
  type: "image";
} & Omit<
  React.ComponentPropsWithoutRef<"img">,
  keyof MediaStyleProps | "src" | "alt"
> & {
    src: string; // Required for image media
    alt: string; // Required for image media
  };

/**
 * Video media type - extends native video element props
 */
type VideoMediaProps = {
  type: "video";
} & Omit<
  React.ComponentPropsWithoutRef<"video">,
  keyof MediaStyleProps | "src"
> & {
    src: string; // Required for video media
    alt?: string; // Optional for video, but recommended for accessibility
  };

/**
 * Custom element media type - allows passing any React element
 * The element will be wrapped in a container with the required aspect ratio
 */
type CustomMediaProps = {
  type: "custom";
  element: React.ReactElement;
};

/**
 * Discriminated union of all supported media types.
 * Each type allows extending native React element props while ensuring
 * the media container maintains the 9:16 aspect ratio and object-fit: cover.
 */
export type HeaderHeroMedia =
  | ImageMediaProps
  | VideoMediaProps
  | CustomMediaProps;

export interface HeaderHeroPrimaryMediaProps
  extends React.ComponentPropsWithoutRef<"header"> {
  /** Hero title text (display-md typography) */
  headline: React.ReactNode;
  /** Hero subtitle text (subhead-sm-l typography) */
  subtitle: React.ReactNode;
  callsToAction: [DesignContrainedButtonProps, DesignContrainedButtonProps?];
  /** Media element - supports image, video, or custom React element */
  media: HeaderHeroMedia;
}

/**
 * Renders the appropriate media element based on the media type.
 * All media is wrapped in a container with 9:16 aspect ratio and object-fit: cover.
 */
const MediaRenderer: React.FC<{ media: HeaderHeroMedia }> = memo(
  ({ media }) => {
    const mediaContainerClassName =
      "bds-header-hero-primary-media__media-container";
    const mediaElementClassName =
      "bds-header-hero-primary-media__media-element";

    switch (media.type) {
      case "image":
        {
          const { type, ...imgProps } = media;
          return (
            <div className={mediaContainerClassName}>
              <img {...imgProps} className={mediaElementClassName} />
            </div>
          );
        }
        {
          /* className and style are omitted from video props and only available on the container */
        }
      case "video": {
        const { type, alt, ...videoProps } = media;
        return (
          <div className={mediaContainerClassName}>
            <video
              {...videoProps}
              className={mediaElementClassName}
              aria-label={alt}
            />
          </div>
        );
      }

      case "custom": {
        const { element } = media;
        return (
          <div className={mediaContainerClassName}>
            <div className={mediaElementClassName}>{element}</div>
          </div>
        );
      }

      default: {
        return null;
      }
    }
  }
);

const HeaderHeroPrimaryMedia = forwardRef<
  HTMLHeadElement,
  HeaderHeroPrimaryMediaProps
>((props, ref) => {
  const { headline, subtitle, callsToAction, media, className, ...restProps } =
    props;

  const [primaryCta, secondaryCta] = callsToAction;

  // Headline is critical - exit early if missing
  if (!headline) {
    console.error("Headline is required for HeaderHeroPrimaryMedia");
    return null;
  }

  // Validate other props and log warnings for missing optional/required fields
  // Note: These props log warnings but don't prevent rendering
  useEffect(() => {
    const propsToValidate = {
      subtitle: subtitle,
      callsToAction: callsToAction,
      media: media,
    };

    Object.entries(propsToValidate).forEach(([key, value]) => {
      if (!isEmpty(value)) {
        console.warn(`${key} is required for HeaderHeroPrimaryMedia`);
      }
    });
  }, [subtitle, callsToAction, media]);

  return (
    <header
      className={clsx("bds-header-hero-primary-media", className)}
      ref={ref}
      {...restProps}
    >
      <PageGrid>
        <PageGrid.Row>
          <PageGrid.Col
            span={{ base: 12, md: 6, lg: 6 }}
            className="bds-header-hero-primary-media__headline-container"
          >
            <h1 className="bds-header-hero-primary-media__headline display-md">
              <span>{headline}</span>
            </h1>
          </PageGrid.Col>
          <PageGrid.Col offset={{ base: 0, lg: 1 }} span={{ base: 12, lg: 5 }}>
            <div className="bds-header-hero-primary-media__cta-container">
              {subtitle && (
                <div className="bds-header-hero-primary-media__subtitle label-l">
                  {subtitle}
                </div>
              )}
              {(primaryCta || secondaryCta) && (
                <div className="bds-header-hero-primary-media__cta-buttons">
                  <Button
                    {...primaryCta}
                    variant="primary"
                    color="green"
                    showIcon={true}
                  />
                  {secondaryCta && (
                    <Button
                      {...secondaryCta}
                      className={clsx(
                        "bds-header-hero-primary-media__cta-button-tertiary",
                        secondaryCta?.className
                      )}
                      variant="tertiary"
                      color="green"
                      showIcon={true}
                    />
                  )}
                </div>
              )}
            </div>
          </PageGrid.Col>
        </PageGrid.Row>
        {/* Media */}
        {media && (
          <PageGrid.Row>
            <PageGrid.Col span={12}>
              <MediaRenderer media={media} />
            </PageGrid.Col>
          </PageGrid.Row>
        )}
      </PageGrid>
    </header>
  );
});

export default HeaderHeroPrimaryMedia;
