import { ButtonProps } from "../components/Button/Button";

/**
 * Omit, applied to each member of a union rather than to the union as a whole.
 *
 * The built-in Omit collapses a union into one object whose members are unions
 * of the originals. ButtonProps is a union over which element gets rendered, so
 * collapsing it pairs an anchor's event handlers with a button's — a shape
 * neither member accepts, and the omitted keys are not the ones at fault.
 */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

/**
 * Button props with design constraints applied.
 * Omits the styling axes, which are controlled at the component/section level
 * for design consistency.
 *
 * @example
 * const buttonProps: DesignConstrainedButtonProps = {
 *   children: 'Click me',
 *   href: '/docs',
 *   onClick: () => console.log('clicked')
 * };
 */
export type DesignConstrainedButtonProps = DistributiveOmit<
  ButtonProps,
  "intention" | "context" | "emphasis"
>;

export type DesignConstrainedCallsToActions = [
  DesignConstrainedButtonProps,
  DesignConstrainedButtonProps?,
];

export type DesignConstrainedCallToActionsProps = {
  callsToAction?: DesignConstrainedCallsToActions;
};

/** Link config for ButtonGroup - consistent with ButtonConfig (label + href) */
export interface DesignConstrainedLink {
  label: string;
  href: string;
}

export type DesignConstrainedLinksProps = {
  links?: DesignConstrainedLink[];
};

/**
 * Base props that all media elements must have to ensure proper styling.
 * These props are automatically applied to maintain the 9:16 aspect ratio
 * and object-fit: cover behavior.
 */
export type MediaStyleProps = {
  className?: string;
  style?: React.CSSProperties;
};

type ModifiedMediaProps = {
  alt?: string;
};

export type DesignConstrainedVideoProps = Omit<
  React.ComponentPropsWithRef<"video">,
  keyof MediaStyleProps
> &
  // the "alt" value here will be used with an aria label
  ModifiedMediaProps;

export type DesignConstrainedImageProps = Omit<
  React.ComponentPropsWithRef<"img">,
  keyof MediaStyleProps
>;
