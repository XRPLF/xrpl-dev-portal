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

/** The component's own props — the same whichever element ends up rendered. */
type ButtonOwnProps = ButtonVariant & {
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
  className?: string;
};

/**
 * Everything not declared above is forwarded to the rendered element, so which
 * element that is decides which attributes are legal. `href` is the switch, and
 * making it the discriminant lets the compiler carry that decision: the button
 * member pins `href` to `never`, so a `formAction` and an `href` on the same
 * call cannot type-check, and the pass-through narrows to one attribute set on
 * an `href` check with nothing filtered at runtime.
 */
type ButtonAsButton = ButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps> & {
    href?: never;
    download?: never;
  };

type ButtonAsLink = ButtonOwnProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps | 'href' | 'target' | 'download'> & {
    href: string;
    target?: '_self' | '_blank';
    download?: boolean | string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

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
  className,
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

  // Render as an <a> if href is present, otherwise as a <button>.
  if (rest.href !== undefined) {
    const { href, target = '_self', download, onClick, ...anchorRest } = rest;

    // disabled always renders a <button>, even with href
    if (disabled) {
      return (
        <button
          {...(anchorRest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          type="button"
          className={classNames}
          disabled
          aria-busy={loading || undefined}
        >
          {content}
        </button>
      );
    }

    if (!suppressed && download) {
      return (
        <a
          {...anchorRest}
          href={href}
          target={target}
          download={download}
          className={classNames}
          onClick={onClick}
        >
          {content}
        </a>
      );
    }

    if (!suppressed) {
      return (
        <Link
          {...(anchorRest as Record<string, unknown>)}
          to={href}
          target={target}
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
    // nor Enter can navigate. Non-interactive but still in the accessibility tree.
    return (
      <a
        {...anchorRest}
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

  const { type = 'button', onClick, ...buttonRest } = rest;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (suppressed) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      {...buttonRest}
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
