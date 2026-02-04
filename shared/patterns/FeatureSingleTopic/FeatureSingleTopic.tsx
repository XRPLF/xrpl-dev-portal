import React from 'react';
import clsx from 'clsx';
import { PageGrid } from '../../components/PageGrid/page-grid';
import { Button } from '../../components/Button/Button';
import { ButtonConfig, validateButtonGroup } from '../ButtonGroup/ButtonGroup';

export interface FeatureSingleTopicLink {
  /** Link label text */
  label: string;
  /** Link URL */
  href: string;
}

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
  links?: FeatureSingleTopicLink[];
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
  links = [],
  singleButtonVariant = 'primary',
  media,
  className,
}) => {
  // Button color is always green for this component
  const buttonColor = 'green';
  const forceColor = false;

  // Convert links to ButtonConfig format
  const buttonConfigs: ButtonConfig[] = links.map(link => ({
    label: link.label,
    href: link.href,
    forceColor: forceColor,
  }));

  // Validate buttons (supports up to 5 links)
  const buttonValidation = validateButtonGroup(buttonConfigs, 5);

  // Log warnings in development mode
  if (process.env.NODE_ENV === 'development' && buttonValidation.warnings.length > 0) {
    buttonValidation.warnings.forEach(warning => console.warn(warning));
  }

  // Build root class names
  const rootClasses = clsx(
    'bds-feature-single-topic',
    `bds-feature-single-topic--${variant}`,
    `bds-feature-single-topic--${orientation}`,
    className
  );

  // Render title section
  const renderTitleSection = () => (
    <div className="bds-feature-single-topic__title-section">
      <h2 className="bds-feature-single-topic__title">{title}</h2>
    </div>
  );

  // Render CTA buttons based on count
  // - 1 link: primary or secondary button (based on singleButtonVariant prop)
  // - 2 links: primary + tertiary side by side
  // - 3+ links: all tertiary buttons stacked
  const renderCTA = () => {
    const buttons = buttonValidation.buttons;
    if (!buttonValidation.isValid || buttons.length === 0) return null;

    // 1 button: primary or secondary based on singleButtonVariant prop
    if (buttons.length === 1) {
      return (
        <div className="bds-feature-single-topic__cta">
          <Button variant={singleButtonVariant} color={buttonColor} href={buttons[0].href}>
            {buttons[0].label}
          </Button>
        </div>
      );
    }

    // 2 buttons: primary + tertiary side by side
    if (buttons.length === 2) {
      return (
        <div className="bds-feature-single-topic__cta">
          <div className="bds-feature-single-topic__cta-row">
            <Button variant="primary" color={buttonColor} href={buttons[0].href}>
              {buttons[0].label}
            </Button>
            <Button variant="tertiary" color={buttonColor} href={buttons[1].href} forceNoPadding>
              {buttons[1].label}
            </Button>
          </div>
        </div>
      );
    }

    // 3+ buttons: all tertiary buttons stacked
    return (
      <div className="bds-feature-single-topic__cta">
        {buttons.map((button, index) => (
          <Button
            key={index}
            variant="tertiary"
            color={buttonColor}
            href={button.href}
            forceNoPadding
          >
            {button.label}
          </Button>
        ))}
      </div>
    );
  };

  // Render description and CTA section
  const renderDescriptionSection = () => (
    <div className="bds-feature-single-topic__description-section">
      {description && (
        <p className="bds-feature-single-topic__description">{description}</p>
      )}
      {renderCTA()}
    </div>
  );

  // Render content section (title at top, description/CTA at bottom)
  const renderContent = () => (
    <div className="bds-feature-single-topic__content">
      {renderTitleSection()}
      {renderDescriptionSection()}
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
        <PageGrid.Row className="bds-feature-single-topic__row">
          <PageGrid.Col
            span={{ base: 4, md: 8, lg: 7 }}
            className="bds-feature-single-topic__media-col"
          >
            {renderMedia()}
          </PageGrid.Col>
          <PageGrid.Col
            span={{ base: 4, md: 8, lg: 5 }}
            className="bds-feature-single-topic__content-col"
          >
            {renderContent()}
          </PageGrid.Col>
        </PageGrid.Row>
      </PageGrid>
    </section>
  );
};

export default FeatureSingleTopic;

