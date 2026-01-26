import React from 'react';
import clsx from 'clsx';

/**
 * Color variants for the TextCard component
 * Maps to Figma design tokens:
 * - green: Primary/Green/300 (#21E46B) → $green-300
 * - neutral-light: Neutral/200 (#E6EAF0) → $gray-200
 * - neutral-dark: Neutral/300 (#CAD4DF) → $gray-300
 * - lilac: Primary/Lilac/200 (#D9CAFF) → $lilac-200
 */
export type TextCardColor = 'green' | 'neutral-light' | 'neutral-dark' | 'lilac';

export interface TextCardProps extends React.ComponentPropsWithoutRef<'article'> {
  /** Card title text (heading-lg typography) */
  title: React.ReactNode;
  /** Card description text (body-l typography) */
  description?: React.ReactNode;
  /** Optional link URL - makes the card clickable */
  href?: string;
  /** Background color variant */
  color?: TextCardColor;
}

/**
 * TextCard Component
 *
 * A card component with a title at the top and description at the bottom.
 * Used within the CardsTwoColumn pattern to display content in a 2x2 grid.
 *
 * Features:
 * - 4 color variants: green, neutral-light, neutral-dark, lilac
 * - Responsive typography and spacing
 * - Title uses heading-lg typography (Tobias Light)
 * - Description uses body-l typography (Booton Light)
 *
 * Responsive behavior:
 * - Desktop: 604px × 340px, 24px padding
 * - Tablet: Full width × 309px, 20px padding
 * - Mobile: Full width × 274px, 16px padding
 *
 * @example
 * ```tsx
 * <TextCard
 *   title="Institutions"
 *   description="Banks, asset managers, PSPs, and fintechs use XRPL to build financial products..."
 *   href="/institutions"
 *   color="green"
 * />
 * ```
 */
export const TextCard = React.forwardRef<HTMLElement, TextCardProps>(
  (props, ref) => {
    const {
      title,
      description,
      href,
      color = 'neutral-light',
      className,
      ...rest
    } = props;

    const rootClasses = clsx(
      'bds-text-card',
      `bds-text-card--${color}`,
      className
    );

    const CardWrapper = href ? 'a' : 'article';
    const wrapperProps = href
      ? { href, className: rootClasses, ref: ref as React.Ref<HTMLAnchorElement> }
      : { className: rootClasses, ref };

    return (
      <CardWrapper {...(wrapperProps as any)} {...rest}>
        {/* Title at top */}
        <div className="bds-text-card__header">
          <h3 className="bds-text-card__title h-lg">{title}</h3>
        </div>

        {/* Description at bottom */}
        {description && (
          <div className="bds-text-card__footer">
            <p className="bds-text-card__description body-l">{description}</p>
          </div>
        )}
      </CardWrapper>
    );
  }
);

TextCard.displayName = 'TextCard';

export default TextCard;

