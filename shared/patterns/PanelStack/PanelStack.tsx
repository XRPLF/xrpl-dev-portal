import React from "react";
import clsx from "clsx";
import { Divider } from "../../components/Divider";
import { PageGrid, PageGridRow, PageGridCol } from "../../components/PageGrid";
import { ButtonGroup } from "../ButtonGroup/ButtonGroup";
import type {
  CarouselFeaturedBackground,
  CarouselFeaturedProps,
  CarouselSlide,
} from "../CarouselFeatured/CarouselFeatured";

/**
 * Props for a single panel in the PanelStack component.
 * Same shape as a CarouselFeatured slide.
 */
export type PanelStackPanel = CarouselSlide;

/**
 * Background color options for PanelStack.
 * Same variants as CarouselFeatured; each adapts to light/dark mode.
 */
export type PanelStackBackground = CarouselFeaturedBackground;

/**
 * Props for the PanelStack pattern component.
 * Matches CarouselFeatured, minus carousel-only behavior.
 */
export interface PanelStackProps extends CarouselFeaturedProps {
  /** Array of panels to display. Same shape as CarouselFeatured slides. */
  slides: readonly CarouselSlide[];
  /** Background color variant. Defaults to 'grey'. */
  background?: PanelStackBackground;
}

/**
 * PanelStack Pattern Component
 *
 * Statically stacks featured panels vertically using the same two-column
 * slide layout as CarouselFeatured (image left / content right on desktop;
 * content top / image bottom on tablet and mobile). There is no carousel
 * track, navigation, or other interaction.
 *
 * @example
 * ```tsx
 * <PanelStack
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
 *       imageAlt: 'Panel 1'
 *     },
 *   ]}
 * />
 * ```
 */
export const PanelStack = React.forwardRef<HTMLElement, PanelStackProps>(
  (props, ref) => {
    const { slides, background = "grey", className, children, ...rest } = props;

    if (slides.length === 0) {
      console.warn("PanelStack: No slides provided");
      return null;
    }

    return (
      <section
        ref={ref}
        className={clsx("bds-panel-stack", className)}
        {...rest}
      >
        {slides.map((slide, index) => (
          <PageGrid
            key={slide.id}
            className={clsx(
              "bds-carousel-featured",
              `bds-carousel-featured--bg-${background}`,
              "bds-panel-stack__panel",
            )}
          >
            <PageGridRow>
              <PageGridCol
                span={{ base: 4, md: 8, lg: 6 }}
                className="bds-carousel-featured__content-col order-1 order-lg-2"
              >
                <div className="bds-carousel-featured__content">
                  <div className="bds-carousel-featured__header">
                    <h2 className="bds-carousel-featured__heading h-md">
                      {slide.heading}
                    </h2>
                  </div>

                  <div className="bds-carousel-featured__bottom">
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

                    <div className="bds-carousel-featured__cta">
                      {slide.buttons && slide.buttons.length > 0 && (
                        <ButtonGroup
                          buttons={slide.buttons}
                          maxButtons={2}
                          color="black"
                          forceColor={background !== "neutral"}
                          className="bds-carousel-featured__buttons"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </PageGridCol>

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
          </PageGrid>
        ))}
        {children}
      </section>
    );
  },
);

PanelStack.displayName = "PanelStack";

export default PanelStack;
