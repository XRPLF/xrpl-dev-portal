import React from "react";
import clsx from "clsx";
import {
  ButtonGroup,
  ButtonConfig,
  validateButtonGroup,
} from "shared/patterns/ButtonGroup/ButtonGroup";

export interface FeatureTwoColumnLink {
  /** Link label text */
  label: string;
  /** Link URL */
  href: string;
}

export interface FeatureTwoColumnProps {
  /** Color theme variant */
  color?: "neutral" | "lilac" | "yellow" | "green";
  /** Content arrangement - left places content on left side, right places content on right side */
  arrange?: "left" | "right";
  /** Feature title text (heading-md typography) */
  title: string;
  /** Feature description text (body-l typography) */
  description: string;
  /** Array of links (1-5 links supported).
   * Always rendered as tertiary buttons, whatever the count — see the note on
   * the component below.
   */
  links: FeatureTwoColumnLink[];
  /** Feature media (image) configuration */
  media: {
    src: string;
    alt: string;
  };
  /** Additional CSS classes */
  className?: string;
}

/**
 * FeatureTwoColumn Pattern
 *
 * A feature section pattern that pairs editorial content with a media element
 * in a two-column layout. Designed for showcasing features, products, or use cases.
 *
 * Responsive layout (single flex row/column):
 * - Mobile / tablet: media always on top, then content (`arrange` ignored) for consistent
 *   rhythm when multiple sections stack (media, content; media, content; …).
 * - Desktop (≥992px): side-by-side (50% / 50%); `arrange` controls left vs right placement.
 *
 * Button behavior:
 * - Every link renders as a tertiary button, regardless of count. This section
 *   pairs its links with editorial copy, so the design calls for a uniform
 *   text-link treatment rather than ButtonGroup's default count-based mix
 *   (1 → secondary, 2 → primary + tertiary, 3+ → tertiary).
 * - Buttons are flush-left with the title and description (no button padding).
 * - Layout still follows the count: inline at 1-2 links, stacked block at 3+.
 */
export const FeatureTwoColumn: React.FC<FeatureTwoColumnProps> = ({
  color = "neutral",
  arrange = "left",
  title,
  description,
  links = [],
  media,
  className,
}) => {
  // Determine button color based on background
  // Rule: Black buttons must be used for all backgrounds (including neutral)

  // Convert links to ButtonConfig format
  const buttonConfigs: ButtonConfig[] = links.map((link) => ({
    label: link.label,
    href: link.href,
  }));

  // Validate buttons (FeatureTwoColumn supports 1-5 links per design spec)
  const buttonValidation = validateButtonGroup(buttonConfigs, 5);
  const hasButtons = buttonValidation.hasButtons;

  const rootClasses = clsx(
    "bds-feature-two-column",
    `bds-feature-two-column--${color}`,
    `bds-feature-two-column--${arrange}`,
    className,
  );

  const contentClass = clsx("bds-feature-two-column__content", {
    "bds-feature-two-column__content--multiple":
      hasButtons && buttonValidation.buttons.length >= 3,
  });

  return (
    <section className={rootClasses}>
      <div className="bds-feature-two-column__layout">
        <div className="bds-feature-two-column__content-col">
          <div className="bds-feature-two-column__content-grid">
            <div className="bds-feature-two-column__content-wrapper">
              <div className={contentClass}>
                <div className="bds-feature-two-column__text-group">
                  <h2 className="bds-feature-two-column__title">{title}</h2>
                  <p className="bds-feature-two-column__description">
                    {description}
                  </p>
                </div>
                {hasButtons && (
                  <ButtonGroup
                    buttons={buttonValidation.buttons}
                    surface={{ context: "on-saturated" }}
                    // Uniform tertiary treatment for this section, flush with
                    // the text above it. `singleButtonVariant` is intentionally
                    // omitted — `forceVariant` supersedes it.
                    forceEmphasis="subtle"
                    gap="medium"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bds-feature-two-column__media-col">
          <div className="bds-feature-two-column__media">
            <img
              src={media.src}
              alt={media.alt}
              className="bds-feature-two-column__media-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureTwoColumn;
