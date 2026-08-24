import React from 'react';
import clsx from 'clsx';
import { Link } from '@redocly/theme/components/Link/Link';
import { LoaderIcon } from '../Icons';

/**
 * Button — built from the Figma-derived specification.
 *
 * Source: github.com/samiamdesigns/pd-xrpl-developer-docs
 *   components/button.md           the axes and the reasoning
 *   components/button.json         every value resolved per mode
 *   components/button-examples.md  the acceptance checklist
 *
 * See Button.md for how this differs from the current Button, and for
 * the two places the spec is deliberately not followed.
 */

export type ButtonEmphasis = 'strong' | 'standard' | 'subtle';
export type ButtonIntention = 'brand' | 'neutral';
export type ButtonContext = 'on-theme' | 'on-inverse' | 'on-saturated';

/**
 * The styling axes, as a union rather than three independent enums.
 *
 * `neutral` + `on-saturated` is absent because it has no tokens —
 * `mode-color.neutral.on-saturated` is not in the set, since nothing on a solid
 * brand block is neutral-coloured. Expressing the axes this way makes that
 * combination fail to compile instead of failing at runtime, so you do not have
 * to open Figma to find out which combinations are real.
 *
 * Note: button.md prints these members with `intention` required, which would
 * reject `<Button>Get started</Button>` — the zero-prop default
 * its own examples show. button.json records `"default": "brand"`, so the
 * examples and the JSON agree and the printed union is the outlier. `intention`
 * is optional here. Reported upstream.
 */
export type ButtonSurface =
  // brand on an ordinary page (the default)
  | { intention?: 'brand'; context?: 'on-theme' }
  // brand on an inverted block, or on solid brand green
  | { intention?: 'brand'; context: 'on-inverse' | 'on-saturated' }
  // neutral — no on-saturated group exists
  | { intention: 'neutral'; context?: 'on-theme' | 'on-inverse' };

/**
 * Emphasis is orthogonal: all three exist in every group, so it is intersected
 * across the union rather than repeated in each member. Keeping the pair
 * separable also lets a wrapper forward the surface as one value — spreading
 * two independently-typed variables would lose the correlation the union
 * exists to enforce.
 */
type ButtonVariant = ButtonSurface & { emphasis?: ButtonEmphasis };

export type ButtonProps = ButtonVariant & {
  /** Visible label. Always required. */
  children: React.ReactNode;
  /** Decorative, aria-hidden. Not used in current XRPL designs. */
  iconStart?: React.ReactNode;
  /** Decorative, aria-hidden. Replaced by the loader while loading. */
  iconEnd?: React.ReactNode;
  /** Action in flight: aria-busy, activation suppressed, indicator shown. */
  loading?: boolean;
  /** Non-interactive but still focusable and still in the accessibility tree. */
  inactive?: boolean;
  /** Native disabled. Leaves the tab order. */
  disabled?: boolean;
  /** Renders an <a> instead of a <button>. */
  href?: string;
  target?: '_self' | '_blank';
  /**
   * Save the target rather than navigating to it. Forces a plain <a>: a file
   * download is never a client-side route, and react-router's Link intercepts
   * the click and cancels the download unless target="_blank" happens to make
   * it bail out first. Depending on that coincidence is how this breaks later.
   */
  download?: boolean | string;
  rel?: string;
  className?: string;
} & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'disabled' | 'children'
  >;

/**
 * intention and context select ONE token group, because that is how the token
 * set groups them — `brand-onInverse` is a group, not brand plus a modifier.
 * kebab-cased here; the camelCase in the source files is a find-and-replace aid
 * there and is deliberately not normalised upstream.
 */
const groupClass = (intention: ButtonIntention, context: ButtonContext) =>
  context === 'on-theme' ? intention : `${intention}-${context}`;

export const Button: React.FC<ButtonProps> = ({
  intention = 'brand',
  context = 'on-theme',
  emphasis = 'strong',
  children,
  iconStart,
  iconEnd,
  loading = false,
  inactive = false,
  disabled = false,
  href,
  target = '_self',
  download,
  rel,
  className,
  onClick,
  type = 'button',
  ...rest
}) => {
  const classNames = clsx(
    'bds-btn',
    `bds-btn--${groupClass(intention, context)}`,
    `bds-btn--${emphasis}`,
    // The context class carries the focus-ring colour and the disabled group,
    // both of which are chosen by context alone.
    `bds-btn--${context}`,
    {
      'bds-btn--loading': loading,
      'bds-btn--disabled': disabled,
    },
    className
  );

  /**
   * Three non-interactive states, three code paths. They resolve identical
   * colours in several combinations, so appearance will not tell you which one
   * you built — what distinguishes them is behaviour.
   *
   *              element     ARIA              tab order   activates
   *   loading    <button>    aria-busy         in          no (suppressed)
   *   inactive   <button>    aria-disabled     in          no (suppressed)
   *   disabled   <button>    native disabled   OUT         no (native)
   *
   * Collapsing inactive into disabled removes it from the tab order, and a
   * screen-reader user can then no longer find it.
   */
  const suppressed = loading || inactive;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (suppressed) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  // The loader replacing icon-end in Figma is representation, not contract —
  // the spec explicitly allows toggling visibility instead. The glyph is a
  // placeholder in the design; LoaderIcon is our choice and is reportable back.
  // It spins on its own — the button neither starts nor configures it.
  const trailing = loading ? (
    <span className="bds-btn__icon" aria-hidden="true">
      <LoaderIcon />
    </span>
  ) : iconEnd ? (
    <span className="bds-btn__icon" aria-hidden="true">
      {iconEnd}
    </span>
  ) : null;

  // No focus-indicator element and no slot element. Both are Figma authoring
  // devices; building either ships a stray node that no token can remove.
  const content = (
    <>
      {iconStart && (
        <span className="bds-btn__icon" aria-hidden="true">
          {iconStart}
        </span>
      )}
      <span className="bds-btn__label">{children}</span>
      {trailing}
    </>
  );

  // disabled always renders a <button>, even with href, so there is nothing to
  // navigate to.
  if (href && !disabled && !suppressed && download) {
    return (
      <a
        href={href}
        target={target}
        download={download}
        rel={rel}
        className={classNames}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  if (href && !disabled && !suppressed) {
    return (
      <Link
        to={href}
        target={target}
        rel={rel}
        className={classNames}
        // Redocly's LinkProps narrows onClick to `() => void`. It spreads
        // straight onto react-router's Link, which forwards the event, so a
        // handler taking one still receives it. Only reached when not
        // suppressed, so no event guarding depends on this.
        onClick={onClick as unknown as (() => void) | undefined}
      >
        {content}
      </Link>
    );
  }

  // A suppressed link keeps anchor semantics and stays focusable, but drops
  // href entirely rather than relying on preventDefault — so neither a click
  // nor Enter can navigate, and no handler has to hold the line. This is what
  // "non-interactive but still in the accessibility tree" means for an <a>.
  if (href && !disabled) {
    return (
      <a
        role="link"
        tabIndex={0}
        className={classNames}
        aria-busy={loading || undefined}
        aria-disabled="true"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      {...rest}
      type={type}
      className={classNames}
      onClick={handleClick}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={inactive || undefined}
    >
      {content}
    </button>
  );
};

export default Button;
