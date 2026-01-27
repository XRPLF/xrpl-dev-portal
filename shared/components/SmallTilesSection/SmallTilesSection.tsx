import React, { forwardRef, useMemo, memo } from "react";
import { CardIconProps, CardIcon } from "../CardIcon";
import clsx from "clsx";
import { PageGrid } from "../PageGrid/page-grid";
import type { PageGridColProps } from "../PageGrid/page-grid";
import { getCardKey, isEnvironment } from "../../utils";

/**
 * Card icon props without the variant prop (which is controlled at section level)
 */
type ConstrainedCardIconProps = Omit<CardIconProps, "variant">;

/**
 * Props for the SmallTilesSection component
 */
export interface SmallTilesSectionProps
  extends React.ComponentPropsWithoutRef<"section"> {
  /** Section headline displayed as h2 */
  headline: React.ReactNode;
  /** Optional subtitle text displayed below headline */
  subtitle?: React.ReactNode;
  /** Color variant applied to all cards in the section; enforces consistency in UI */
  cardVariant: CardIconProps["variant"];
  /** Array of card configurations. Section renders nothing if array is empty. */
  cards: readonly ConstrainedCardIconProps[];
}

/**
 * Threshold for enabling spacer layout optimization.
 * When card count is <= this value, a centered spacer layout is used.
 */
const SPACER_THRESHOLD = 8 as const;

/**
 * Memoized card item component to prevent unnecessary re-renders
 * Only re-renders when card data or variant changes
 */
const CardListItem = memo<{
  card: ConstrainedCardIconProps;
  variant: CardIconProps["variant"];
}>(({ card, variant }) => (
  <li className="bds-small-tiles-section__cards-grid__card">
    <CardIcon {...card} variant={variant} />
  </li>
));

CardListItem.displayName = "CardListItem";

/**
 * SmallTilesSection Component
 *
 * A section component that displays multiple CardIcon components in a responsive grid layout.
 * This component is tightly coupled to CardIcon and creates a grouping of card icons with
 * consistent styling and behavior.
 *
 * Features:
 * - Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)
 * - Automatic spacer optimization for small card sets (≤8 cards)
 * - Consistent variant application across all cards
 * - Semantic HTML structure with proper accessibility
 *
 * @example
 * ```tsx
 * <SmallTilesSection
 *   headline="Language Tutorials"
 *   subtitle="Choose a language to get started"
 *   cardVariant="neutral"
 *   cards={[
 *     { icon: "/js.svg", label: "JavaScript", href: "/docs/js" },
 *     { icon: "/py.svg", label: "Python", href: "/docs/py" }
 *   ]}
 * />
 * ```
 */
export const SmallTilesSection = forwardRef<
  HTMLElement,
  SmallTilesSectionProps
>((props, ref) => {
  const { headline, subtitle, cardVariant, cards, className, ...rest } = props;

  const cardsCount = cards.length;

  // Early return for empty cards array
  if (cardsCount === 0) {
    if (isEnvironment("development")) {
      console.warn("SmallTilesSection: No cards provided");
    }
    return null;
  }

  // Memoize spacer calculation
  const needsSpacer = useMemo(
    () => cardsCount <= SPACER_THRESHOLD,
    [cardsCount]
  );

  // Memoize grid column span configuration
  // Using PageGridColProps['span'] type to ensure type safety without assertions
  const gridSpanConfig: NonNullable<PageGridColProps["span"]> = useMemo(
    () => ({
      base: "fill",
      lg: needsSpacer ? 8 : "fill",
    }),
    [needsSpacer]
  );

  // Memoize grid offset configuration
  // Using PageGridColProps['offset'] type to ensure type safety without assertions
  const gridOffsetConfig: NonNullable<PageGridColProps["offset"]> = useMemo(
    () => ({
      base: 0,
      lg: needsSpacer ? 4 : 0,
    }),
    [needsSpacer]
  );

  // Memoize grid class names
  const gridClassName = useMemo(
    () =>
      clsx("bds-small-tiles-section__cards-grid", {
        "__needs-spacer": needsSpacer,
      }),
    [needsSpacer]
  );

  // Memoize card items to prevent unnecessary re-renders
  const cardItems = useMemo(
    () =>
      cards.map((card, index) => (
        <CardListItem
          key={getCardKey(card.href || card.label, index, "small-tile")}
          card={card}
          variant={cardVariant}
        />
      )),
    [cards, cardVariant]
  );

  return (
    <section
      ref={ref}
      className={clsx("bds-small-tiles-section", className)}
      {...rest}
    >
      <PageGrid>
        <PageGrid.Row>
          <PageGrid.Col
            span={{
              base: "fill",
              md: 10,
              lg: 8,
            }}
          >
            <h2 className="bds-small-tiles-section__headline h4">{headline}</h2>
            {subtitle && (
              <p className="bds-small-tiles-section__subtitle body-r">
                {subtitle}
              </p>
            )}
          </PageGrid.Col>
        </PageGrid.Row>
        <PageGrid.Row>
          <PageGrid.Col
            className="bds-small-tiles-section__cards-grid-wrapper"
            span={gridSpanConfig}
            offset={gridOffsetConfig}
          >
            <ul className={gridClassName} role="list">
              {cardItems}
            </ul>
          </PageGrid.Col>
        </PageGrid.Row>
      </PageGrid>
    </section>
  );
});

SmallTilesSection.displayName = "SmallTilesSection";
