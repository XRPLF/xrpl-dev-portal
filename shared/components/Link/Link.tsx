import React from 'react';
import clsx from 'clsx';
import { Link as RouterLink } from '@redocly/theme/components/Link/Link';
import { XrplArrowInternalLinkIcon, XrplArrowExternalLinkIcon } from '../Icons';

// Anchors that don't use this component (raw <a> in markdown, tag components
// like {% child-pages %}) don't get these styles automatically -- they fall
// back to the generic content-link CSS in styles/_content.scss, which mirrors
// this component's neutral/on-theme look but isn't driven by it.

export type LinkIntention = 'brand' | 'neutral';
export type LinkContext = 'on-theme' | 'on-inverse' | 'on-saturated';
export type LinkVariation = 'standalone' | 'inline';
export type LinkSize = 'sm' | 'md' | 'lg';

// No neutral+on-saturated group exists, so make that combination a type error.
export type LinkColorProps =
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

// Matches @redocly/realm's own Link (shared/components/Link/../../../@theme
// wiring aside, see node_modules/@redocly/realm's client Link.js): anything
// that isn't http(s)/mailto or a bare #fragment is routed through Redocly's
// own Link, not a plain <a>. That's not cosmetic -- Redocly's Link resolves
// relative paths against the current route, rewrites the path for the
// current locale (a hardcoded /docs/... on a /ja/... page would otherwise
// silently bounce a Japanese visitor to the English page), and drives
// client-side navigation + hover prefetch instead of a full page load. A
// plain <a> has none of that. External links and #-only anchors (e.g. the
// nonces link-demo.page.tsx uses to demo :visited) don't need any of it, so
// they stay plain <a> -- matching what Redocly's own Link does for them too.
const EXTERNAL_HREF_RE = /^(https?:\/\/|mailto:)/;

// Navigational anchor. Always renders <a> (directly, or via Redocly's Link,
// which also renders <a>). A control that acts rather than navigates is a
// Button, even when styled to look understated.
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
  // target="_blank" is this codebase's existing signal for "leaves the site" --
  // picks which of the two shared arrow icons to render, not just its color.
  const isExternalTarget = rest.target === '_blank';
  const linkClass = linkClassName({ intention, context, variation, size, className });
  const icon =
    showIcon &&
    // Must be a direct child of the rendered <a>, not wrapped in a span: the
    // bds-icon-engaged mixin (triggered on hover/focus-visible below) emits
    // `> .bds-icon`, so anything between them breaks the animation.
    (isExternalTarget ? <XrplArrowExternalLinkIcon /> : <XrplArrowInternalLinkIcon />);

  if (EXTERNAL_HREF_RE.test(href) || href.startsWith('#')) {
    return (
      <a href={href} className={linkClass} {...rest}>
        {children}
        {icon}
      </a>
    );
  }

  return (
    // RouterLink's onClick contract is () => void, unlike <a>'s -- it's
    // never called with the click event (see @redocly/realm's Link.js), so
    // a caller-supplied handler that reads the event wouldn't get one here
    // regardless of how this prop is typed.
    <RouterLink to={href} className={linkClass} {...(rest as Record<string, unknown>)}>
      {children}
      {icon}
    </RouterLink>
  );
};

Link.displayName = 'Link';

export default Link;
