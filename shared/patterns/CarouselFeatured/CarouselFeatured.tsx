import React, { useState, useCallback, useMemo } from "react";
import clsx from "clsx";
import { CarouselButton } from "../../components/CarouselButton";
import { Divider } from "../../components/Divider";
import { PageGrid, PageGridRow, PageGridCol } from "../../components/PageGrid";
import {
  ButtonGroup,
  ButtonConfig,
  validateButtonGroup,
} from "../ButtonGroup/ButtonGroup";

/**
 * Props for a single slide in the CarouselFeatured component
 */
export interface CarouselSlide {
  /** Unique identifier for the slide */
  id: string | number;
  /** Heading text displayed at the top of the content area */
  heading: string;
  /** Array of feature items to display in the list */
  features: readonly CarouselFeatureItem[];
  /** Button configurations (1-2 buttons supported) */
  buttons?: ButtonConfig[];
  /** Image source URL */
  imageSrc: string;
  /** Alt text for the image */
  imageAlt: string;
}

/**
 * Props for a feature list item
 */
export interface CarouselFeatureItem {
  /** Feature title */
  title: React.ReactNode;
  /** Feature description */
  description: React.ReactNode;
}

/**
 * Background color options for CarouselFeatured
 * Each variant adapts to light/dark mode:
 * - 'grey': Light mode: gray-200 (#E6EAF0), Dark mode: gray-300 (#CAD4DF)
 * - 'neutral': Light mode: white (#FFF), Dark mode: black (#141414)
 * - 'yellow': Light mode: yellow-100 (#F3F1EB), Dark mode: yellow-100 (#F3F1EB)
 */
export type CarouselFeaturedBackground = "grey" | "neutral" | "yellow";

/**
 * Props for the CarouselFeatured pattern component
 */
export interface CarouselFeaturedProps extends React.ComponentPropsWithoutRef<"section"> {
  /** Array of slides to display */
  slides: readonly CarouselSlide[];
  /** Background color variant. Defaults to 'grey'. */
  background?: CarouselFeaturedBackground;
}

/**
 * CarouselFeatured Pattern Component
 *
 * A featured image carousel with two-column layout on desktop (image left, content right)
 * and single-column layout on tablet/mobile (content top, image bottom).
 * Features a heading, feature list with dividers, and optional buttons.
 *
 * @example
 * ```tsx
 * <CarouselFeatured
 *   slides={[
 *     {
 *       id: 1,
 *       heading: "Powered by Developers",
 *       features: [
 *         { title: "Easy-to-Integrate APIs", description: "Build with common languages..." },
 *         { title: "Full Lifecycle Support", description: "From dev tools to deployment..." },
 *       ],
 *       buttons: [
 *         { label: "Get Started", href: "/docs" },
 *         { label: "Learn More", href: "/about" }
 *       ],
 *       imageSrc: '/image1.jpg',
 *       imageAlt: 'Slide 1'
 *     },
 *   ]}
 * />
 * ```
 */
export const CarouselFeatured = React.forwardRef<
  HTMLElement,
  CarouselFeaturedProps
>((props, ref) => {
  const { slides, background = "grey", className, children, ...rest } = props;

  const [currentIndex, setCurrentIndex] = useState(0);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < slides.length - 1;

  const goToPrev = useCallback(() => {
    if (canGoPrev) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [canGoPrev]);

  const goToNext = useCallback(() => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [canGoNext]);

  // Early return for empty slides
  if (slides.length === 0) {
    console.warn("CarouselFeatured: No slides provided");
    return null;
  }

  // Determine carousel nav button variant based on background
  // grey/yellow → black (always), neutral → green (always)
  const buttonVariant = background === "neutral" ? "green" : "black";
  const currentSlide = slides[currentIndex];

  const NavigationButtons = useMemo(() => {
    return (
      <div className="bds-carousel-featured__nav">
        <CarouselButton
          direction="prev"
          variant={buttonVariant}
          disabled={!canGoPrev}
          onClick={goToPrev}
          aria-label="Previous slide"
        />
        <CarouselButton
          direction="next"
          variant={buttonVariant}
          disabled={!canGoNext}
          onClick={goToNext}
          aria-label="Next slide"
        />
      </div>
    );
  }, [buttonVariant, canGoPrev, canGoNext, goToPrev, goToNext]);

  return (
    <PageGrid
      ref={ref as React.Ref<HTMLDivElement>}
      className={clsx(
        "bds-carousel-featured",
        `bds-carousel-featured--bg-${background}`,
        className,
      )}
      aria-roledescription="carousel"
      aria-label={currentSlide.heading}
      {...rest}
    >
      <div
        className="bds-carousel-featured__slides"
        role="group"
        aria-roledescription="slide"
        aria-label={`Slide ${currentIndex + 1} of ${slides.length}`}
      >
        <div
          className="bds-carousel-featured__slide-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const slideButtonValidation = validateButtonGroup(slide.buttons, 2);
            const slideHasButtons = slideButtonValidation.hasButtons;

            return (
              <div
                key={slide.id}
                className={clsx("bds-carousel-featured__slide", {
                  "bds-carousel-featured__slide--active":
                    index === currentIndex,
                })}
                aria-hidden={index !== currentIndex}
              >
                <PageGridRow>
                  {/* Content Column - Right on desktop, top on mobile */}
                  <PageGridCol
                    span={{ base: 4, md: 8, lg: 6 }}
                    className="bds-carousel-featured__content-col order-1 order-lg-2"
                  >
                    <div className="bds-carousel-featured__content">
                      {/* Header row with heading */}
                      <div className="bds-carousel-featured__header">
                        <h2 className="bds-carousel-featured__heading h-md">
                          {slide.heading}
                        </h2>
                        {slides.length > 1 && (
                          <div className="bds-carousel-featured__nav-buttons-placeholder">
                            {NavigationButtons}
                          </div>
                        )}
                      </div>

                      {/* Bottom section: features + CTA grouped together */}
                      <div className="bds-carousel-featured__bottom">
                        {/* Feature list with dividers */}
                        <ul className="bds-carousel-featured__features">
                          {slide.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="bds-carousel-featured__feature"
                            >
                              <Divider color="base" weight="regular" />
                              <div className="bds-carousel-featured__feature-title body-r">
                                {feature.title}
                              </div>
                              <div className="bds-carousel-featured__feature-description label-l">
                                {feature.description}
                              </div>
                            </li>
                          ))}
                        </ul>

                        {/* CTA section with buttons */}
                        <div className="bds-carousel-featured__cta">
                          {/* Buttons wrapper - groups primary and tertiary together */}
                          {slideHasButtons && (
                            <ButtonGroup
                              buttons={slideButtonValidation.buttons}
                              color="black"
                              forceColor={background !== "neutral"}
                              className="bds-carousel-featured__buttons"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </PageGridCol>

                  {/* Image/Media Column - Left on desktop, bottom on mobile */}
                  <PageGridCol
                    span={{ base: 4, md: 8, lg: 6 }}
                    className="bds-carousel-featured__media-col order-2 order-lg-1"
                  >
                    <div className="bds-carousel-featured__media">
                      <img
                        src={slide.imageSrc}
                        alt={slide.imageAlt}
                        className="bds-carousel-featured__image"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  </PageGridCol>
                </PageGridRow>
              </div>
            );
          })}
        </div>
      </div>

      {slides.length > 1 && (
        <div className={clsx("bds-carousel-featured__nav", "clickable")}>
          {(["prev", "next"] as const).map((direction) => (
            <CarouselButton
              key={direction}
              direction={direction}
              variant={buttonVariant}
              disabled={direction === "prev" ? !canGoPrev : !canGoNext}
              onClick={direction === "prev" ? goToPrev : goToNext}
              aria-label={
                direction === "prev" ? "Previous slide" : "Next slide"
              }
            />
          ))}
        </div>
      )}
      {/* Render any additional children */}
      {children}
    </PageGrid>
  );
});

CarouselFeatured.displayName = "CarouselFeatured";

export default CarouselFeatured;
