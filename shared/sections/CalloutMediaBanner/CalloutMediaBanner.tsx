import React from "react";
import clsx from "clsx";
import {
  PageGrid,
  PageGridCol,
  PageGridRow,
} from "shared/components/PageGrid/page-grid";
import {
  ButtonGroup,
  ButtonConfig,
  validateButtonGroup,
} from "shared/patterns/ButtonGroup/ButtonGroup";

export interface CalloutMediaBannerProps {
  /** Color variant - determines background color (ignored if backgroundImage is provided) */
  variant?: "default" | "light-gray" | "lilac" | "green" | "gray";
  /**
   * Background image URL. Overrides `variant` when provided.
   *
   * Used in light mode, and also in dark mode unless `backgroundImageDark`
   * is also provided.
   */
  backgroundImage?: string;
  /**
   * Optional background image URL used when the site is in dark mode
   * (i.e. `<html class="dark">`). Falls back to `backgroundImage` if omitted.
   *
   * If only `backgroundImageDark` is provided (no `backgroundImage`), it is
   * used in both modes.
   */
  backgroundImageDark?: string;
  /** Text color for image variant - fixes text color across light/dark modes (only applicable when backgroundImage is provided) */
  textColor?: "white" | "black";
  /** Main heading text */
  heading?: string;
  /** Heading element type - h1 through h6 (defaults to h6) */
  headingAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Subheading/description text */
  subheading: string;
  /** Button configurations (1-2 buttons supported) */
  buttons?: ButtonConfig[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * CalloutMediaBanner Component
 *
 * A full-width banner component featuring a heading, subheading, and optional action buttons.
 * Supports 5 color variants or a custom background image. Responsive across mobile, tablet, and desktop.
 *
 * @example
 * // Color variant with default h6 heading
 * <CalloutMediaBanner
 *   variant="green"
 *   heading="The Compliant Ledger Protocol"
 *   subheading="A decentralized public Layer 1 blockchain..."
 *   buttons={[
 *     { label: "Get Started", href: "/docs" },
 *     { label: "Learn More", href: "/about" }
 *   ]}
 * />
 *
 * @example
 * // With custom heading level (h1)
 * <CalloutMediaBanner
 *   variant="green"
 *   heading="The Compliant Ledger Protocol"
 *   headingAs="h1"
 *   subheading="A decentralized public Layer 1 blockchain..."
 *   buttons={[{ label: "Get Started", href: "/docs" }]}
 * />
 *
 * @example
 * // With background image (white text - default)
 * <CalloutMediaBanner
 *   backgroundImage="/images/hero-bg.jpg"
 *   heading="Build on XRPL"
 *   subheading="Start building your next project"
 *   buttons={[{ label: "Start Building", onClick: handleClick }]}
 * />
 *
 * @example
 * // With background image and black text (fixed across light/dark modes)
 * <CalloutMediaBanner
 *   backgroundImage="/images/light-hero-bg.jpg"
 *   textColor="black"
 *   heading="Build on XRPL"
 *   headingAs="h2"
 *   subheading="Start building your next project"
 *   buttons={[{ label: "Start Building", onClick: handleClick }]}
 * />
 *
 * @example
 * // Mode-aware background images (one per theme)
 * <CalloutMediaBanner
 *   backgroundImage="/img/backgrounds/callout-light.jpg"
 *   backgroundImageDark="/img/backgrounds/callout-dark.jpg"
 *   heading="Build on XRPL"
 *   subheading="Start building your next project"
 *   buttons={[{ label: "Start Building", href: "/docs" }]}
 * />
 */
export const CalloutMediaBanner: React.FC<CalloutMediaBannerProps> = ({
  variant = "default",
  backgroundImage,
  backgroundImageDark,
  textColor = "white",
  heading,
  headingAs = "h6",
  subheading,
  buttons,
  className = "",
}) => {
  // Validate buttons if provided (max 2 buttons supported)
  const buttonValidation = validateButtonGroup(buttons, 2);
  const hasButtons = buttonValidation.hasButtons;

  // Check if we should center content: no buttons OR (no heading but has buttons)
  const shouldCenter = !hasButtons || (!heading && hasButtons);

  // The "image variant" applies whenever any background image is provided,
  // for either mode.
  const hasImage = Boolean(backgroundImage || backgroundImageDark);

  // Determine button color: black for all variants except 'default' and 'image'
  const buttonColor: "green" | "black" =
    !hasImage && variant !== "default" ? "black" : "green";

  // Build class names using BEM with bds namespace
  const classNames = clsx(
    "bds-callout-media-banner",
    // Only apply variant class if NO background image is provided
    !hasImage && `bds-callout-media-banner--${variant}`,
    // Add image class when a background image is provided
    hasImage && "bds-callout-media-banner--image",
    // Add text color modifier for image variant
    hasImage &&
      textColor === "black" &&
      "bds-callout-media-banner--image-text-black",
    // Add centered class when content should be centered
    shouldCenter && "bds-callout-media-banner--centered",
    className,
  );

  // Expose background image URLs as CSS custom properties so the stylesheet
  // can pick the right one based on the active color scheme (`html.dark`
  // / `html.light`). Each property is omitted when not provided, letting the
  // CSS `var()` fallback chain handle it.
  // Cast through Record to allow custom CSS properties on style.
  const cssVars: Record<string, string> = {};
  if (backgroundImage) {
    cssVars["--bds-cmb-bg-image-light"] = `url(${backgroundImage})`;
  }
  if (backgroundImageDark) {
    cssVars["--bds-cmb-bg-image-dark"] = `url(${backgroundImageDark})`;
  }
  const inlineStyle = cssVars as React.CSSProperties;

  // Create the heading element dynamically
  const HeadingElement = headingAs;

  return (
    <PageGrid containerType="wide">
      <PageGridRow className={classNames} style={inlineStyle}>
        <PageGridCol span={{ base: 4, md: 6, lg: 8 }}>
          <div className="bds-callout-media-banner__content">
            {/* Text Content */}
            <div className="bds-callout-media-banner__text">
              {heading && (
                <HeadingElement className="bds-callout-media-banner__heading">
                  {heading}
                </HeadingElement>
              )}
              <p className="bds-callout-media-banner__subheading">
                {subheading}
              </p>
            </div>

            {/* Buttons */}
            {hasButtons && (
              <ButtonGroup
                buttons={buttonValidation.buttons}
                color={buttonColor}
                gap="none"
                forceColor={true}
              />
            )}
          </div>
        </PageGridCol>
      </PageGridRow>
    </PageGrid>
  );
};

export default CalloutMediaBanner;
