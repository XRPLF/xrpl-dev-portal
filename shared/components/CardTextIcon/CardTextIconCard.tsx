import React from 'react';
import clsx from 'clsx';
import { PageGrid } from '../PageGrid/page-grid';
import type { ResponsiveValue, PageGridSpanValue } from '../PageGrid/page-grid';

export interface CardTextIconCardProps {
  /** Icon image URL */
  icon?: string;
  /** Alt text for the icon image */
  iconAlt?: string;
  /** Card heading */
  heading: string;
  /** Semantic heading element. Defaults to `'h3'` so cards enter the document outline.
   *  Use a heading level that fits the page hierarchy (typically one below the section heading). */
  headingAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Card description; accepts rich content (e.g., text with inline links) */
  description: React.ReactNode | string;
  /** Optional aspect ratio for future use; applied via CSS variable */
  aspectRatio?: number;
  /** When provided, renders as PageGrid.Col as="li" with this span—card becomes the grid column */
  gridColSpan?: ResponsiveValue<PageGridSpanValue>;
  /** Additional CSS classes */
  className?: string;
  /** Optional height and width for the icon image */
  height?: number;
  width?: number;
}

/**
 * CardTextIconCard Component
 *
 * A card component featuring an icon, heading, and description.
 * Built from Section Cards - Icon and Section Cards - Text Grid Figma designs.
 *
 * The description accepts ReactNode so it can include hyperlinks and other rich content.
 *
 * @example
 * // Basic usage
 * <CardTextIconCard
 *   icon="/icons/docs.svg"
 *   iconAlt="Documentation"
 *   heading="Documentation"
 *   description="Access everything you need to get started with the XRPL."
 * />
 *
 * @example
 * // With inline link in description
 * <CardTextIconCard
 *   icon="/icons/docs.svg"
 *   heading="Documentation"
 *   description={
 *     <>
 *       Learn more in our{' '}
 *       <a href="/docs">documentation</a>.
 *     </>
 *   }
 * />
 */
const cardContent = (
  heading: string,
  headingAs: NonNullable<CardTextIconCardProps['headingAs']>,
  description: React.ReactNode | string,
  icon?: string,
  iconAlt?: string,
  iconHeight?: number,
  iconWidth?: number
) => {
  const HeadingElement = headingAs;
  return (
  <>
    <div className="bds-card-text-icon-card__icon">
      {icon && (
      <img
        src={icon}
        alt={iconAlt}
        {...(iconHeight != null && { height: iconHeight })}
        {...(iconWidth != null && { width: iconWidth })}
        className="bds-card-text-icon-card__icon-img"
      />
      )}
      <HeadingElement className="bds-card-text-icon-card__heading sh-md-r">{heading}</HeadingElement>
    </div>
    <p className="bds-card-text-icon-card__description body-l">
      {description}
    </p>
  </>
  );
};

export const CardTextIconCard: React.FC<CardTextIconCardProps> = ({
  icon,
  iconAlt = '',
  heading,
  headingAs = 'h3',
  description,
  aspectRatio,
  gridColSpan,
  className,
  height,
  width
}) => {
  const style = aspectRatio
    ? ({ '--bds-card-text-icon-aspect-ratio': aspectRatio } as React.CSSProperties)
    : undefined;

  if (gridColSpan) {
    return (
      <PageGrid.Col
        as="li"
        span={gridColSpan}
        className={clsx('bds-card-text-icon-card', 'bds-card-text-icon-card--grid-col', className)}
        style={style}
      >
        {cardContent(heading, headingAs, description, icon, iconAlt, height, width)}
      </PageGrid.Col>
    );
  }

  return (
    <div
      className={clsx('bds-card-text-icon-card', className)}
      style={style}
    >
      {cardContent(heading, description, icon, iconAlt, height, width)}
    </div>
  );
};

export default CardTextIconCard;
