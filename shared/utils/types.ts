import { ButtonProps } from "../components/Button/Button";

/**
 * Button props with design constraints applied.
 * Omits 'variant' and 'color' props which are typically controlled
 * at the component/section level for design consistency.
 *
 * @example
 * const buttonProps: DesignConstrainedButtonProps = {
 *   children: 'Click me',
 *   href: '/docs',
 *   onClick: () => console.log('clicked')
 * };
 */
export type DesignConstrainedButtonProps = Omit<
  ButtonProps,
  "variant" | "color"
>;

export type DesignConstrainedCallsToActions = [
  DesignConstrainedButtonProps,
  DesignConstrainedButtonProps?,
];

export type DesignConstrainedCallToActionsProps = {
  callsToAction?: DesignConstrainedCallsToActions;
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
