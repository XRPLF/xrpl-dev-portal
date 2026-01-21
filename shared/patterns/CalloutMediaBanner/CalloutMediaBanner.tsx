import React from 'react';
import clsx from 'clsx';
import { PageGrid, PageGridCol, PageGridRow } from 'shared/components/PageGrid/page-grid';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';

export interface CalloutMediaBannerProps {
  /** Color variant - determines background color (ignored if backgroundImage is provided) */
  variant?: 'default' | 'light-gray' | 'lilac' | 'green' | 'gray';
  /** Background image URL - overrides variant color when provided */
  backgroundImage?: string;
  /** Text color for image variant - fixes text color across light/dark modes (only applicable when backgroundImage is provided) */
  textColor?: 'white' | 'black';
  /** Main heading text */
  heading?: string;
  /** Subheading/description text */
  subheading: string;
  /** Primary button configuration */
  primaryButton?: {
    label: string;
    href?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };
  /** Tertiary button configuration */
  tertiaryButton?: {
    label: string;
    href?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };
  /** Additional CSS classes */
  className?: string;
}

/**
 * CalloutMediaBanner Component
 * 
 * A full-width banner component featuring a heading, subheading, and optional action buttons.
 * Supports 5 color variants or a custom background image. Responsive across mobile, tablet, and desktop.
 * 
 * @example
 * // Color variant
 * <CalloutMediaBanner
 *   variant="green"
 *   heading="The Compliant Ledger Protocol"
 *   subheading="A decentralized public Layer 1 blockchain..."
 *   primaryButton={{ label: "Get Started", href: "/docs" }}
 *   tertiaryButton={{ label: "Learn More", href: "/about" }}
 * />
 * 
 * @example
 * // With background image (white text - default)
 * <CalloutMediaBanner
 *   backgroundImage="/images/hero-bg.jpg"
 *   heading="Build on XRPL"
 *   subheading="Start building your next project"
 *   primaryButton={{ label: "Start Building", onClick: handleClick }}
 * />
 * 
 * @example
 * // With background image and black text (fixed across light/dark modes)
 * <CalloutMediaBanner
 *   backgroundImage="/images/light-hero-bg.jpg"
 *   textColor="black"
 *   heading="Build on XRPL"
 *   subheading="Start building your next project"
 *   primaryButton={{ label: "Start Building", onClick: handleClick }}
 * />
 */
export const CalloutMediaBanner: React.FC<CalloutMediaBannerProps> = ({
  variant = 'default',
  backgroundImage,
  textColor = 'white',
  heading,
  subheading,
  primaryButton,
  tertiaryButton,
  className = '',
}) => {
  // Check if there are any buttons
  const hasButtons = !!(primaryButton || tertiaryButton);
  
  // Check if we should center content: no buttons OR (no heading but has buttons)
  const shouldCenter = !hasButtons || (!heading && hasButtons);

  // Determine button color: black for all variants except 'default' and 'image'
  const buttonColor: 'green' | 'black' = 
    !backgroundImage && variant !== 'default' ? 'black' : 'green';

  // Build class names using BEM with bds namespace
  const classNames = clsx(
    'bds-callout-media-banner',
    // Only apply variant class if NO backgroundImage is provided
    !backgroundImage && `bds-callout-media-banner--${variant}`,
    // Add image class when backgroundImage is provided
    backgroundImage && 'bds-callout-media-banner--image',
    // Add text color modifier for image variant
    backgroundImage && textColor === 'black' && 'bds-callout-media-banner--image-text-black',
    // Add centered class when content should be centered
    shouldCenter && 'bds-callout-media-banner--centered',
    className
  );

  // Inline style for background image (when provided)
  const inlineStyle: React.CSSProperties = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};

  return (
    <PageGrid containerType="wide">
      <PageGridRow className={classNames} style={inlineStyle}>
        <PageGridCol span={{base: 4, md: 6, lg: 8}}>
          <div className="bds-callout-media-banner__content">
            {/* Text Content */}
            <div className="bds-callout-media-banner__text">
              {heading && <h2 className="bds-callout-media-banner__heading">{heading}</h2>}
              <p className="bds-callout-media-banner__subheading">{subheading}</p>
            </div>

            {/* Buttons */}
            <ButtonGroup
              primaryButton={primaryButton}
              tertiaryButton={tertiaryButton}
              color={buttonColor}
              gap="none"
            />
          </div>
        </PageGridCol>
      </PageGridRow>
    </PageGrid>
  );
};

export default CalloutMediaBanner;

