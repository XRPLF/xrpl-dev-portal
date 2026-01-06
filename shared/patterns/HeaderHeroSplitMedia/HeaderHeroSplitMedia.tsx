import React from 'react';
import clsx from 'clsx';
import { Button } from '../../components/Button/Button';
import { PageGrid } from '../../components/PageGrid/page-grid';

export interface HeaderHeroSplitMediaProps {
  /** Surface variant - 'accent' adds green background behind hero title */
  surface?: 'default' | 'accent';
  /** Layout direction - content on left or right of media */
  layout?: 'content-left' | 'content-right';
  /** Hero title text (display-md typography) */
  title: string;
  /** Hero subtitle text (subhead-sm-l typography) */
  subtitle: string;
  /** Description text below title section (body-l typography) */
  description?: string;
  /** Primary CTA button configuration */
  primaryCta?: {
    label: string;
    href: string;
  };
  /** Secondary/Tertiary CTA button configuration */
  secondaryCta?: {
    label: string;
    href: string;
  };
  /** Hero media (image) configuration */
  media: {
    src: string;
    alt: string;
  };
  /** Additional CSS classes */
  className?: string;
}

/**
 * HeaderHeroSplitMedia Pattern
 *
 * A page-level hero pattern that pairs prominent editorial content with a primary
 * media element in a split layout. Designed to introduce major concepts, products,
 * or use cases while maintaining strong visual hierarchy and clear calls to action.
 *
 * Uses the PageGrid component system for responsive layout:
 * - Mobile: Stacked layout (columns 4/4 each, text spans full width)
 * - Tablet: Stacked layout (columns 8/8 each, text constrained to 6/8 = 75%)
 * - Desktop: Side-by-side (columns 6/12 each, text constrained to 5/12 ≈ 83.33%)
 *
 * Supports:
 * - Theme: Automatically controlled by html.light/html.dark classes
 * - Surface: Default (no background) / Accent (green background on title section)
 * - Layout: Content Left / Content Right
 * - Responsive: Desktop (side-by-side 1:1), Tablet (stacked), Mobile (stacked)
 *
 * @example
 * <HeaderHeroSplitMedia
 *   surface="accent"
 *   layout="content-left"
 *   title="Real-world asset tokenization"
 *   subtitle="Learn how to issue crypto tokens and build tokenization solutions"
 *   description="XRPL helps fintechs move money fast, globally, at low cost."
 *   primaryCta={{ label: "Get Started", href: "/docs" }}
 *   secondaryCta={{ label: "Learn More", href: "/about" }}
 *   media={{ src: "/img/hero.png", alt: "Hero illustration" }}
 * />
 */
export const HeaderHeroSplitMedia: React.FC<HeaderHeroSplitMediaProps> = ({
  surface = 'default',
  layout = 'content-left',
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  media,
  className,
}) => {
  // Determine if we have any description group content
  const hasDescriptionGroupContent = description || primaryCta || secondaryCta;

  // Build root class names
  const rootClasses = clsx(
    'bds-hero-split-media',
    `bds-hero-split-media--${surface}`,
    `bds-hero-split-media--${layout}`,
    {
      'bds-hero-split-media--title-only': !hasDescriptionGroupContent,
      'bds-hero-split-media--no-description': !description && hasDescriptionGroupContent,
    },
    className
  );

  // Render hero content section
  const renderHeroContent = () => (
    <div className="bds-hero-split-media__content">
      {/* Hero Title Section */}
      <div className="bds-hero-split-media__title-surface">
        <div className="bds-hero-split-media__title-group">
          <h1 className="bds-hero-split-media__title">{title}</h1>
          <p className="bds-hero-split-media__subtitle">{subtitle}</p>
        </div>
      </div>

      {/* Hero Description & CTA Section - only render if there's content */}
      {hasDescriptionGroupContent && (
        <div className="bds-hero-split-media__description-group">
          {description && (
            <p className="bds-hero-split-media__description">
              {description}
            </p>
          )}

          {/* CTA Buttons */}
          {(primaryCta || secondaryCta) && (
            <div className="bds-hero-split-media__cta">
              {primaryCta && (
                <Button
                  variant="primary"
                  href={primaryCta.href}
                >
                  {primaryCta.label}
                </Button>
              )}
              {secondaryCta && (
                <Button
                  variant="tertiary"
                  href={secondaryCta.href}
                >
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Render hero media section
  const renderHeroMedia = () => (
    <div className="bds-hero-split-media__media">
      <img
        src={media.src}
        alt={media.alt}
        className="bds-hero-split-media__media-img"
      />
    </div>
  );

  return (
    <section className={rootClasses}>
      <PageGrid className="bds-hero-split-media__container">
        <PageGrid.Row className="bds-hero-split-media__row">
              <PageGrid.Col 
                span={{ base: 4, md: 8, lg: 6 }}
                className="bds-hero-split-media__content-col"
              >
                {renderHeroContent()}
              </PageGrid.Col>
              <PageGrid.Col 
                span={{ base: 4, md: 8, lg: 6 }}
                className="bds-hero-split-media__media-col"
              >
                {renderHeroMedia()}
              </PageGrid.Col>
        </PageGrid.Row>
      </PageGrid>
    </section>
  );
};

export default HeaderHeroSplitMedia;
