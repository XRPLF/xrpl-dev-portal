import React from 'react';
import clsx from 'clsx';
import { PageGrid } from '../../components/PageGrid/page-grid';
import type { ResponsiveValue, PageGridSpanValue } from '../../components/PageGrid/page-grid';

const DEFAULT_SPAN = {
  base: 'fill' as const,
  md: 6,
  lg: 8,
};

export interface SectionHeaderProps {
  /** Section heading text */
  heading?: React.ReactNode;
  /** Section description text */
  description?: React.ReactNode;
  /** Polymorphic heading element - h1 through h6 */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** PageGrid.Col span - defaults to { base: 'fill', md: 6, lg: 8 } */
  span?: ResponsiveValue<PageGridSpanValue>;
  /** Optional slot for trailing content (e.g. ButtonGroup) */
  children?: React.ReactNode;
  /** Additional CSS classes for the header wrapper */
  className?: string;
}

/**
 * SectionHeader - Consolidated section header pattern
 *
 * Renders a PageGrid.Row + Col with heading (polymorphic h1-h6) and optional description.
 * Used across CardsFeatured, StandardCardGroupSection, CardsIconGrid, and other sections.
 *
 * Returns null if both heading and description are falsy and no children provided.
 */
export const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  (props, ref) => {
    const {
      heading,
      description,
      as = 'h2',
      span = DEFAULT_SPAN,
      children,
      className,
    } = props;

    const hasContent = heading || description || children;
    if (!hasContent) {
      return null;
    }

    const HeadingTag = as;

    return (
      <PageGrid.Row>
        <PageGrid.Col span={span}>
          <div
            ref={ref}
            className={clsx('bds-section-header', className)}
          >
            {heading != null && heading !== '' && (
              <HeadingTag className="bds-section-header__heading h-md">
                {heading}
              </HeadingTag>
            )}
            {description != null && description !== '' && (
              <p className="bds-section-header__description body-l">
                {description}
              </p>
            )}
            {children}
          </div>
        </PageGrid.Col>
      </PageGrid.Row>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
