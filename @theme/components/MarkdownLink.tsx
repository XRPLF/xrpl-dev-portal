import React, { useCallback, useContext } from 'react';
import type { ComponentProps, ReactElement } from 'react';
import { MarkdownLinkContext } from '@redocly/theme/core/contexts';
import { Link as RouterLink } from '@redocly/theme/components/Link/Link';
import { linkClassName } from '../../shared/components/Link/Link';

// Overrides @redocly/theme's default MarkdownLink so plain markdown links get
// Link's class scheme, keeping client-side routing. intention="neutral" per
// design direction (docs/technical content stays black, not brand green).
type MarkdownLinkProps = Omit<ComponentProps<typeof RouterLink>, 'to' | 'onClick'> & {
  href: string;
};

export function MarkdownLink({ href, className, ...props }: MarkdownLinkProps): ReactElement {
  const markdownLinkContext = useContext(MarkdownLinkContext);
  const onClick = useCallback(() => {
    markdownLinkContext?.onMarkdownLinkClick?.(href);
  }, [markdownLinkContext, href]);

  const linkProps = {
    ...props,
    languageInsensitive: true,
    onClick,
    className: linkClassName({ variation: 'inline', intention: 'neutral', className }),
  };

  return <RouterLink to={href} {...linkProps} />;
}
