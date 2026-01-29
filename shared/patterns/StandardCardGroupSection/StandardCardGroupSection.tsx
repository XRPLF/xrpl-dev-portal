import React from "react";
import clsx from "clsx";
import { PageGrid } from "../../components/PageGrid/page-grid";
import StandardCard, {
  StandardCardPropsWithoutVariant,
  StandardCardVariant,
} from "../../components/StandardCard";
import { getCardKey, getTextFromChildren, isEnvironment } from "../../utils";

// Re-export types for convenience
export type { StandardCardPropsWithoutVariant, StandardCardVariant };

/**
 * Props for the StandardCardGroupSection pattern component
 */
export interface StandardCardGroupSectionProps extends React.ComponentPropsWithoutRef<"section"> {
  /** Section headline text */
  headline: React.ReactNode;
  /** Section description text */
  description: React.ReactNode;
  /** Background color variant applied uniformly to all cards */
  variant: StandardCardVariant;
  /** Array of StandardCard configurations (variant is omitted and applied uniformly) */
  cards: readonly StandardCardPropsWithoutVariant[];
}

/**
 * StandardCardGroupSection Pattern Component
 *
 * A section pattern that displays a headline, description, and a responsive grid
 * of StandardCard components. All cards share a uniform variant determined by the section.
 *
 * Features:
 * - Responsive grid layout (1 column mobile, 3 columns tablet and desktop)
 * - Headline and description with consistent typography
 * - Uniform variant applied to all cards
 * - Proper spacing using PageGrid for container and alignment
 * - Full dark mode support
 *
 * @example
 * ```tsx
 * <StandardCardGroupSection
 *   headline="Our Features"
 *   description="Explore what we offer"
 *   variant="neutral"
 *   cards={[
 *     {
 *       headline: "Feature 1",
 *       callsToAction: [{ children: "Learn More", href: "/feature1" }],
 *       children: "Description 1"
 *     },
 *     {
 *       headline: "Feature 2",
 *       callsToAction: [{ children: "Learn More", href: "/feature2" }],
 *       children: "Description 2"
 *     },
 *   ]}
 * />
 * ```
 */
export const StandardCardGroupSection = React.forwardRef<
  HTMLElement,
  StandardCardGroupSectionProps
>((props, ref) => {
  const { headline, description, variant, cards, className, ...rest } = props;

  // Early return for empty cards array
  if (cards.length === 0) {
    if (isEnvironment("development")) {
      console.error("StandardCardGroupSection: No cards provided");
    }
    return null;
  }

  return (
    <section
      ref={ref}
      className={clsx("bds-standard-card-group-section", className)}
      {...rest}
    >
      <PageGrid>
        {/* Header content row */}
        <PageGrid.Row>
          <PageGrid.Col
            span={{
              base: "fill",
              md: 6,
              lg: 8,
            }}
          >
            <div className="bds-standard-card-group-section__header">
              {headline && (
                <h2 className="bds-standard-card-group-section__headline h-md">
                  {headline}
                </h2>
              )}
              {description && (
                <div className="bds-standard-card-group-section__description body-l">
                  {description}
                </div>
              )}
            </div>
          </PageGrid.Col>
        </PageGrid.Row>

        {/* Cards grid row */}
        <PageGrid.Row
          role="list"
          aria-label={
            typeof headline === "string"
              ? `List of ${headline.toLowerCase()} items`
              : "List of items"
          }
          className="bds-standard-card-group-section__cards"
        >
          {cards
            .map((card, index) => {
              const headlineStr =
                typeof card.headline === "string"
                  ? card.headline
                  : getTextFromChildren(card.headline) || undefined;
              return { card, index, headlineStr };
            })
            .map(({ card, index, headlineStr }) => {
              if (!card.headline) {
                if (isEnvironment("development")) {
                  console.warn(
                    "StandardCardGroupSection: Card has no headline",
                  );
                }
                return null;
              }
              return (
                <PageGrid.Col
                  key={getCardKey(headlineStr, index, "standard-card")}
                  role="listitem"
                  span={{
                    base: 12,
                    md: 4,
                    lg: 4,
                  }}
                >
                  <StandardCard {...card} variant={variant} />
                </PageGrid.Col>
              );
            })}
        </PageGrid.Row>
      </PageGrid>
    </section>
  );
});

StandardCardGroupSection.displayName = "StandardCardGroupSection";

export default StandardCardGroupSection;
