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
  description: React.ReactNode | string,
  icon?: string,
  iconAlt?: string,
  iconHeight?: number,
  iconWidth?: number
) => (
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
      <strong className="bds-card-text-icon-card__heading sh-md-r">{heading}</strong>
    </div>
    <p className="bds-card-text-icon-card__description body-l">
      {typeof description === 'string' ? <span dangerouslySetInnerHTML={{ __html: description }} /> : description}
    </p>
  </>
);

export const CardTextIconCard: React.FC<CardTextIconCardProps> = ({
  icon,
  iconAlt = '',
  heading,
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
        {cardContent(heading, description, icon, iconAlt, height, width)}
      </PageGrid.Col>
    );
  }

  return (
    <li
      className={clsx('bds-card-text-icon-card', className)}
      style={style}
    >
      {cardContent(heading, description, icon, iconAlt, height, width)}
    </li>
  );
};

export default CardTextIconCard;
