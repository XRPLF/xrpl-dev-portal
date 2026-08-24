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
 * Extends CarouselSlide but makes heading optional since PanelStack
 * can display a single heading above all panels.
 */
export interface PanelStackPanel extends Omit<CarouselSlide, 'heading'> {
  /** Optional heading for this specific panel. If omitted, only the component-level heading is shown. */
  heading?: string;
}

/**
 * Background color options for PanelStack.
 * Same variants as CarouselFeatured; each adapts to light/dark mode.
 */
export type PanelStackBackground = CarouselFeaturedBackground;

/**
 * Props for the PanelStack pattern component.
 * Matches CarouselFeatured, minus carousel-only behavior.
 */
export interface PanelStackProps extends Omit<CarouselFeaturedProps, 'slides'> {
  /** Array of panels to display. Heading is optional for each panel. */
  slides: readonly PanelStackPanel[];
  /** Background color variant. Defaults to 'grey'. */
  background?: PanelStackBackground;
  /** Optional heading text displayed above all panels */
  heading?: string;
  /** Optional description text displayed below the heading */
  description?: string;
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
    const { slides, background = "grey", heading, description, className, children, ...rest } = props;

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
        {heading && (
          <PageGrid className="bds-panel-stack__header">
            <PageGridRow>
              <PageGridCol span={{ base: 4, md: 6, lg: 8 }}>
                <div className="bds-panel-stack__header-text">
                  <h4 className="h-md mb-0">{heading}</h4>
                  {description && <p className="body-l mb-0">{description}</p>}
                </div>
              </PageGridCol>
            </PageGridRow>
          </PageGrid>
        )}
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
                  {slide.heading && (
                    <div className="bds-carousel-featured__header">
                      <h2 className="bds-carousel-featured__heading h-md">
                        {slide.heading}
                      </h2>
                    </div>
                  )}

                  <div className="bds-carousel-featured__bottom">
                    <ul className="bds-carousel-featured__features">
                      {slide.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="bds-carousel-featured__feature"
                        >
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
                          surface={
                            background === "neutral"
                              ? { intention: "neutral" }
                              : { context: "on-saturated" }
                          }
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
