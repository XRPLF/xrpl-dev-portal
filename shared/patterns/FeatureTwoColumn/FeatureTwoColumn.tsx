import React from 'react';
import clsx from 'clsx';
import { Button } from '../../components/Button/Button';
import { PageGrid } from '../../components/PageGrid/page-grid';

export interface FeatureTwoColumnLink {
  /** Link label text */
  label: string;
  /** Link URL */
  href: string;
}

export interface FeatureTwoColumnProps {
  /** Color theme variant */
  color?: 'neutral' | 'lilac' | 'yellow' | 'green';
  /** Content arrangement - left places content on left side, right places content on right side */
  arrange?: 'left' | 'right';
  /** Feature title text (heading-md typography) */
  title: string;
  /** Feature description text (body-l typography) */
  description: string;
  /** Array of links (1-5 links supported)
   * - 1 link: renders as secondary button
   * - 2 links: renders as primary + tertiary buttons
   * - 3-5 links: renders all as tertiary buttons
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
 * Uses the PageGrid component system for responsive layout:
 * - Mobile: Stacked layout (content above media)
 * - Tablet: Stacked layout (content above media)
 * - Desktop: Side-by-side (6/12 columns each)
 *
 * Button behavior based on link count:
 * - 1 link: Secondary button
 * - 2 links: Primary button (first) + Tertiary button (second)
 * - 3-5 links: All tertiary buttons (first is filled, rest are text-only)
 */
export const FeatureTwoColumn: React.FC<FeatureTwoColumnProps> = ({
  color = 'neutral',
  arrange = 'left',
  title,
  description,
  links = [],
  media,
  className,
}) => {
  // Build root class names
  const rootClasses = clsx(
    'bds-feature-two-column',
    `bds-feature-two-column--${color}`,
    `bds-feature-two-column--${arrange}`,
    className
  );

  // Determine button color based on background
  // Rule: Black buttons must be used for all backgrounds (including neutral)
  const buttonColor = 'black';
  const forceColor = true;

  // Render content section with appropriate CTA layout based on link count
  // For 3-5 links, items are direct children for space-between distribution
  const renderContent = () => {
    const linkCount = links.length;

    // 1 link: Secondary button
    if (linkCount === 1) {
      return (
        <div className="bds-feature-two-column__content">
          <div className="bds-feature-two-column__text-group">
            <h2 className="bds-feature-two-column__title">{title}</h2>
            <p className="bds-feature-two-column__description">{description}</p>
          </div>
          <div className="bds-feature-two-column__cta bds-feature-two-column__cta--single">
            <Button variant="secondary" color={buttonColor} forceColor={forceColor} href={links[0].href}>
              {links[0].label}
            </Button>
          </div>
        </div>
      );
    }

    // 2 links: Primary + Tertiary in a row
    if (linkCount === 2) {
      return (
        <div className="bds-feature-two-column__content">
          <div className="bds-feature-two-column__text-group">
            <h2 className="bds-feature-two-column__title">{title}</h2>
            <p className="bds-feature-two-column__description">{description}</p>
          </div>
          <div className="bds-feature-two-column__cta bds-feature-two-column__cta--double">
            <Button variant="primary" color={buttonColor} forceColor={forceColor} href={links[0].href}>
              {links[0].label}
            </Button>
            <Button variant="tertiary" color={buttonColor} forceColor={forceColor} href={links[1].href}>
              {links[1].label}
            </Button>
          </div>
        </div>
      );
    }

    // 3-5 links: Text group + Button group (contains all buttons with consistent 16px spacing)
    // Desktop: space-between distribution between text-group and button-group
    // Tablet: 32px gap, Mobile: 24px gap
    return (
      <div className="bds-feature-two-column__content bds-feature-two-column__content--multiple">
        <div className="bds-feature-two-column__text-group">
          <h2 className="bds-feature-two-column__title">{title}</h2>
          <p className="bds-feature-two-column__description">{description}</p>
        </div>
        {/* Button group - all buttons grouped with 16px spacing between them */}
        <div className="bds-feature-two-column__button-group">
          {/* First two links in a row: Primary + Tertiary */}
          <div className="bds-feature-two-column__cta-row">
            <Button variant="primary" color={buttonColor} forceColor={forceColor} href={links[0].href}>
              {links[0].label}
            </Button>
            {links[1] && (
              <Button variant="tertiary" color={buttonColor} forceColor={forceColor} href={links[1].href}>
                {links[1].label}
              </Button>
            )}
          </div>
          {/* Secondary button */}
          {links[2] && (
            <Button variant="secondary" color={buttonColor} forceColor={forceColor} href={links[2].href}>
              {links[2].label}
            </Button>
          )}
          {/* Remaining tertiary links */}
          {links.slice(3).map((link, index) => (
            <Button key={index} variant="tertiary" color={buttonColor} forceColor={forceColor} href={link.href}>
              {link.label}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  // Render media section (for mobile/tablet stacked layout)
  const renderMedia = () => (
    <div className="bds-feature-two-column__media">
      <img
        src={media.src}
        alt={media.alt}
        className="bds-feature-two-column__media-img"
      />
    </div>
  );

  return (
    <section className={rootClasses}>
      {/* Desktop layout - simple two-column flex with background image */}
      <div className="bds-feature-two-column__desktop-layout">
        <div className="bds-feature-two-column__content-col">
          <div className="bds-feature-two-column__content-grid">
            <div className="bds-feature-two-column__content-wrapper">
              {renderContent()}
            </div>
          </div>
        </div>
        <div
          className="bds-feature-two-column__media-col"
          style={{ backgroundImage: `url(${media.src})` }}
          role="img"
          aria-label={media.alt}
        />
      </div>

      {/* Mobile/Tablet layout - stacked with PageGrid */}
      <div className="bds-feature-two-column__mobile-layout">
        <PageGrid className="bds-feature-two-column__container" containerType="wide">
          <PageGrid.Row className="bds-feature-two-column__row">
            <PageGrid.Col
              span={{ base: 4, md: 8 }}
              className="bds-feature-two-column__content-col"
            >
              <div className="bds-feature-two-column__content-grid">
                <div className="bds-feature-two-column__content-wrapper">
                  {renderContent()}
                </div>
              </div>
            </PageGrid.Col>
            <PageGrid.Col
              span={{ base: 4, md: 8 }}
              className="bds-feature-two-column__media-col--mobile"
            >
              {renderMedia()}
            </PageGrid.Col>
          </PageGrid.Row>
        </PageGrid>
      </div>
    </section>
  );
};

export default FeatureTwoColumn;

