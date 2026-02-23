import React from 'react';
import clsx from 'clsx';
import { LinkArrow, LinkArrowVariant } from './LinkArrow';

export type LinkVariant = 'internal' | 'external' | 'inline';
export type LinkSize = 'small' | 'medium' | 'large';
export type LinkIconType = 'arrow' | 'external' | null;

export interface BdsLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Link variant - internal, external, or inline
   * @default 'internal'
   */
  variant?: LinkVariant;
  
  /**
   * Size of the link
   * @default 'medium'
   */
  size?: LinkSize;
  
  /**
   * Icon type - arrow, external, or null
   * If null, icon is determined by variant (internal/external)
   * Arrow icons animate to chevron shape on hover
   * @default null
   */
  icon?: LinkIconType;
  
  /**
   * Disabled state - prevents navigation and applies disabled styles
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Link URL (required)
   */
  href: string;
  
  /**
   * Link text content
   */
  children: React.ReactNode;
}

/**
 * BdsLink Component
 * 
 * A comprehensive link component supporting multiple sizes, icon types, and states.
 * Arrow icons animate to chevron shape on hover.
 * 
 * Color states are handled automatically via CSS per theme:
 * 
 * Light Mode:
 * - Enabled: Green 400 (#0DAA3E)
 * - Hover/Focus: Green 500 (#078139) + underline + arrow animates to chevron
 * - Active: Green 400 (#0DAA3E) + underline
 * - Visited: Lilac 400 (#7649E3)
 * - Disabled: Gray 400 (#A2A2A4)
 * - Focus outline: Black (#000000)
 * 
 * Dark Mode:
 * - Enabled: Green 300 (#21E46B)
 * - Hover/Focus: Green 200 (#70EE97) + underline + arrow animates to chevron
 * - Active: Green 300 (#21E46B) + underline
 * - Visited: Lilac 300 (#C0A7FF)
 * - Disabled: #8A919A
 * - Focus outline: White (#FFFFFF)
 * 
 * @see Link.md for full documentation
 * 
 * @example
 * ```tsx
 * // Basic internal link (arrow animates to chevron on hover)
 * <BdsLink href="/docs" size="medium">
 *   View documentation
 * </BdsLink>
 * 
 * // External link
 * <BdsLink href="https://example.com" variant="external" size="large">
 *   External resource
 * </BdsLink>
 * 
 * // Disabled link
 * <BdsLink href="#" disabled>
 *   Coming soon
 * </BdsLink>
 * 
 * // Inline link (no icon)
 * <BdsLink href="/docs" variant="inline">
 *   Learn more
 * </BdsLink>
 * ```
 */
export const BdsLink: React.FC<BdsLinkProps> = ({
  variant = 'internal',
  size = 'medium',
  icon = null,
  disabled = false,
  href,
  children,
  className,
  onClick,
  ...rest
}) => {
  // Determine icon type based on variant if not explicitly provided
  const getIconType = (): LinkArrowVariant | null => {
    if (icon === null) {
      // Auto-determine icon based on variant
      if (variant === 'external') {
        return 'external';
      }
      if (variant === 'internal') {
        return 'internal'; // Default to internal arrow for internal variant
      }
      return null; // Inline links have no icon
    }
    
    // Map icon prop to LinkArrow variant
    if (icon === 'arrow') return 'internal';
    if (icon === 'external') return 'external';
    return null;
  };

  const iconType = getIconType();
  const shouldShowIcon = variant !== 'inline' && iconType !== null;

  const classes = clsx(
    'bds-link',
    `bds-link--${variant}`,
    `bds-link--${size}`,
    {
      'bds-link--disabled': disabled,
    },
    className
  );

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  return (
    <a
      href={disabled ? '#' : href}
      className={classes}
      onClick={handleClick}
      aria-disabled={disabled}
      {...rest}
    >
      {children}
      {shouldShowIcon && (
        <LinkArrow
          variant={iconType as LinkArrowVariant}
          size={size}
          disabled={disabled}
        />
      )}
    </a>
  );
};

BdsLink.displayName = 'BdsLink';
