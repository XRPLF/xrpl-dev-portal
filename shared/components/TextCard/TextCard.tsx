import React from 'react';
import clsx from 'clsx';

/**
 * Color variants for the TextCard component
 * Maps to Figma design tokens (Light Mode):
 * - green: Default $green-200, Hover $green-300, Pressed $green-400
 * - neutral-light: Default $gray-200, Hover $gray-300, Pressed $gray-400
 * - neutral-dark: Default $gray-300, Hover $gray-400, Pressed $gray-500
 * - lilac: Default $lilac-200, Hover $lilac-300, Pressed $lilac-400
 * - yellow: Default $yellow-100, Hover $yellow-200, Pressed $yellow-300
 * - blue: Default $blue-100, Hover $blue-200, Pressed $blue-300
 */
export type TextCardColor = 'green' | 'neutral-light' | 'neutral-dark' | 'lilac' | 'yellow' | 'blue';

export interface TextCardProps extends Omit<React.ComponentPropsWithoutRef<'article'>, 'title'> {
  /** Card title text (heading-lg typography) */
  title: React.ReactNode;
  /** Card description text (body-l typography) */
  description?: React.ReactNode;
  /** Optional link URL - makes the card clickable */
  href?: string;
  /** Background color variant */
  color?: TextCardColor;
  /** Whether the card is disabled */
  disabled?: boolean;
}

/**
 * TextCard Component
 *
 * A card component with a title at the top and description at the bottom.
 * Used within the CardsTwoColumn pattern to display content in a 2x2 grid.
 *
 * Features:
 * - 6 color variants: green, neutral-light, neutral-dark, lilac, yellow, blue
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
      disabled = false,
      className,
      ...rest
    } = props;

    const rootClasses = clsx(
      'bds-text-card',
      `bds-text-card--${color}`,
      disabled && 'bds-text-card--disabled',
      className
    );

    const CardWrapper = href ? 'a' : 'article';
    const wrapperProps = href
      ? { href, className: rootClasses, ref: ref as React.Ref<HTMLAnchorElement> }
      : { className: rootClasses, ref };

    return (
      <CardWrapper {...(wrapperProps as any)} {...rest}>
        {/* Overlay for window shade animation */}
        <div className="bds-text-card__overlay" aria-hidden="true" />

        {/* Title at top */}
        <h3 className="bds-text-card__title h-lg">{title}</h3>

        {/* Description at bottom */}
        {description && (
          <p className="bds-text-card__description body-l">{description}</p>
        )}
      </CardWrapper>
    );
  }
);

TextCard.displayName = 'TextCard';

export default TextCard;

