import React from 'react';
import clsx from 'clsx';

// Anchors that don't use this component (raw <a> in markdown, tag components
// like {% child-pages %}) don't get these styles automatically -- they fall
// back to the generic content-link CSS in styles/_content.scss, which mirrors
// this component's neutral/on-theme look but isn't driven by it.

export type LinkIntention = 'brand' | 'neutral';
export type LinkContext = 'on-theme' | 'on-inverse' | 'on-saturated';
export type LinkVariation = 'standalone' | 'inline';
export type LinkSize = 'sm' | 'md' | 'lg';

// No neutral+on-saturated group exists, so make that combination a type error.
type LinkColorProps =
  | { intention?: 'brand'; context?: LinkContext }
  | { intention: 'neutral'; context?: Extract<LinkContext, 'on-theme' | 'on-inverse'> };

export type LinkProps = LinkColorProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> & {
    /** inline never carries an icon. */
    variation?: LinkVariation;
    size?: LinkSize;
    /** Trailing arrow. standalone only. */
    iconEnd?: boolean;
    href: string;
    children: React.ReactNode;
  };

const ICON_VIEWBOX_SIZE = 24;

// The one documented trailing arrow -- no internal/external distinction yet.
// Sized entirely by CSS (see .xrpl-link__icon in _link.scss).
const LinkIcon: React.FC = () => {
  return (
    <span className="xrpl-link__icon" aria-hidden="true">
      <svg
        viewBox={`0 0 ${ICON_VIEWBOX_SIZE} ${ICON_VIEWBOX_SIZE}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 2L21 12L13 22"
          stroke="var(--link-icon-color, currentColor)"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
        <path
          d="M21 12H3"
          stroke="var(--link-icon-color, currentColor)"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          className="xrpl-link__icon-line"
        />
      </svg>
    </span>
  );
};

function colorGroup(intention: LinkIntention, context: LinkContext): string {
  if (context === 'on-inverse') return `${intention}-on-inverse`;
  if (context === 'on-saturated') return `${intention}-on-saturated`;
  return intention;
}

// Exported so other <a> renderers (e.g. the MarkdownLink markdoc override)
// can reuse Link's class scheme without duplicating it.
export function linkClassName({
  intention = 'brand',
  context = 'on-theme',
  variation = 'inline',
  size = 'md',
  className,
}: Pick<LinkProps, 'intention' | 'context' | 'variation' | 'size'> & { className?: string }): string {
  return clsx(
    'xrpl-link',
    `xrpl-link--${variation}`,
    `xrpl-link--${size}`,
    `xrpl-link--${colorGroup(intention as LinkIntention, context as LinkContext)}`,
    `xrpl-link--ctx-${context}`,
    className
  );
}

export { LinkIcon };

// Navigational anchor. Always renders <a>. A control that acts rather than
// navigates is a Button, even when styled to look understated.
export const Link: React.FC<LinkProps> = ({
  intention = 'brand',
  context = 'on-theme',
  variation = 'inline',
  size = 'md',
  iconEnd = false,
  href,
  children,
  className,
  ...rest
}) => {
  const showIcon = variation === 'standalone' && iconEnd;

  return (
    <a
      href={href}
      className={linkClassName({ intention, context, variation, size, className })}
      {...rest}
    >
      {children}
      {showIcon && <LinkIcon />}
    </a>
  );
};

Link.displayName = 'Link';

export default Link;
