import React from 'react';
import clsx from 'clsx';
import { PageGrid } from '../../components/PageGrid/page-grid';
import { ButtonGroup, ButtonConfig, validateButtonGroup } from '../ButtonGroup/ButtonGroup';

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
  // Determine button color based on background
  // Rule: Black buttons must be used for all backgrounds (including neutral)
  const buttonColor = 'black';
  const forceColor = true;

  // Convert links to ButtonConfig format
  const buttonConfigs: ButtonConfig[] = links.map(link => ({
    label: link.label,
    href: link.href,
    forceColor: forceColor,
  }));

  // Validate buttons (FeatureTwoColumn supports 1-5 links per design spec)
  const buttonValidation = validateButtonGroup(buttonConfigs, 5);

  // Log warnings in development mode
  if (process.env.NODE_ENV === 'development' && buttonValidation.warnings.length > 0) {
    buttonValidation.warnings.forEach(warning => console.warn(warning));
  }

  // Build root class names
  const rootClasses = clsx(
    'bds-feature-two-column',
    `bds-feature-two-column--${color}`,
    `bds-feature-two-column--${arrange}`,
    className
  );

  // Render content section with ButtonGroup
  const renderContent = () => {
    // Determine content class based on validated button count
    const contentClass = clsx(
      'bds-feature-two-column__content',
      {
        'bds-feature-two-column__content--multiple': buttonValidation.buttons.length >= 3,
      }
    );

    return (
      <div className={contentClass}>
        <div className="bds-feature-two-column__text-group">
          <h2 className="bds-feature-two-column__title">{title}</h2>
          <p className="bds-feature-two-column__description">{description}</p>
        </div>
        {buttonValidation.isValid && (
          <ButtonGroup
            buttons={buttonValidation.buttons}
            color={buttonColor}
            forceColor={forceColor}
            singleButtonVariant="secondary"
          />
        )}
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

