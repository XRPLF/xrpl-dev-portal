import { ButtonProps } from '../components/Button/Button';

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
export type DesignConstrainedButtonProps = Omit<ButtonProps, 'variant' | 'color'>;
