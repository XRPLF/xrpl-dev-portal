import React from 'react';
import clsx from 'clsx';
import { PageGrid } from '../../components/PageGrid/page-grid';
import { ButtonGroup, ButtonConfig, validateButtonGroup } from '../ButtonGroup/ButtonGroup';

export interface FeatureSingleTopicProps {
  /** Background variant for the title section
   * - 'default': No background on title section
   * - 'accentSurface': Gray background (#E6EAF0) on title section
   */
  variant?: 'default' | 'accentSurface';
  /** Content arrangement - controls position of image relative to content
   * - 'left': Image on left, content on right
   * - 'right': Image on right, content on left
   */
  orientation?: 'left' | 'right';
  /** Feature title text (heading-md typography) */
  title: string;
  /** Feature description text (label-l typography) */
  description?: string;
  /** Array of links (1-5 links supported)
   * - 1 link: renders as primary or secondary button (based on singleButtonVariant)
   * - 2 links: renders as primary + tertiary buttons side by side
   * - 3+ links: all tertiary buttons stacked
   */
  buttons?: ButtonConfig[];
  /** Button variant for single button configuration
   * - 'primary': Primary button (default)
   * - 'secondary': Secondary button
   */
  singleButtonVariant?: 'primary' | 'secondary';
  /** Feature media (image) configuration */
  media: {
    src: string;
    alt: string;
  };
  /** Additional CSS classes */
  className?: string;
}

/**
 * FeatureSingleTopic Pattern
 *
 * A feature section pattern that pairs a title/description with a media element
 * in a two-column layout. Supports two variants: default (no title background)
 * and accentSurface (gray background on title section).
 *
 * Layout based on Figma 1280px design:
 * - Desktop: Side-by-side with image 7 columns, content 5 columns
 * - Mobile/Tablet: Stacked layout (full width)
 */
export const FeatureSingleTopic: React.FC<FeatureSingleTopicProps> = ({
  variant = 'default',
  orientation = 'left',
  title,
  description,
  buttons = [],
  singleButtonVariant = 'primary',
  media,
  className,
}) => {
  // Validate buttons if provided (max 5 buttons supported)
  const buttonValidation = validateButtonGroup(buttons, 5);
  const hasButtons = buttonValidation.hasButtons;

  // Button color is always green for this component
  const buttonColor = 'green';
  const forceColor = false;

  // Build root class names
  const rootClasses = clsx(
    'bds-feature-single-topic',
    `bds-feature-single-topic--${variant}`,
    className
  );

  // Build row class names - column-reverse on mobile/tablet for both orientations
  const rowClasses = clsx(
    'bds-feature-single-topic__row',
    'flex-column-reverse flex-lg-row' // Content above image on mobile, side-by-side on desktop
  );


  // Render content section (title at top, description/CTA at bottom)
  const renderContent = () => (
    <div className="bds-feature-single-topic__content">
      <div className="bds-feature-single-topic__title-section">
        <h2 className="bds-feature-single-topic__title">{title}</h2>
      </div>
      <div className="bds-feature-single-topic__description-section">
      {description && (
        <p className="bds-feature-single-topic__description">{description}</p>
      )}
      {hasButtons && (
        <ButtonGroup
          buttons={buttonValidation.buttons}
          color={buttonColor}
          forceColor={forceColor}
          singleButtonVariant={singleButtonVariant}
        />
      )}
      </div>
    </div>
  );

  // Render media section
  const renderMedia = () => (
    <div className="bds-feature-single-topic__media">
      <img
        src={media.src}
        alt={media.alt}
        className="bds-feature-single-topic__media-img"
      />
    </div>
  );

  return (
    <section className={rootClasses}>
      <PageGrid className="bds-feature-single-topic__container" containerType="standard">
        <PageGrid.Row className={rowClasses}>
          <PageGrid.Col
            span={{ base: 4, md: 8, lg: 7 }}
            className={clsx(
              'bds-feature-single-topic__media-col',
              orientation === 'left' ? 'order-lg-1' : 'order-lg-2'
            )}
          >
            {renderMedia()}
          </PageGrid.Col>
          <PageGrid.Col
            span={{ base: 4, md: 8, lg: 5 }}
            className={clsx(
              'bds-feature-single-topic__content-col',
              orientation === 'left' ? 'order-lg-2' : 'order-lg-1'
            )}
          >
            {renderContent()}
          </PageGrid.Col>
        </PageGrid.Row>
      </PageGrid>
    </section>
  );
};

export default FeatureSingleTopic;

