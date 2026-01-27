import { ButtonProps } from '../components/Button/Button';

/**
 * Button props with design constraints applied.
 * Omits 'variant' and 'color' props which are typically controlled
 * at the component/section level for design consistency.
 * 
 * Note: This type name intentionally keeps the original spelling "Contrained"
 * to maintain backward compatibility, though "Constrained" would be more correct.
 * 
 * @example
 * const buttonProps: DesignContrainedButtonProps = {
 *   children: 'Click me',
 *   href: '/docs',
 *   onClick: () => console.log('clicked')
 * };
 */
export type DesignContrainedButtonProps = Omit<ButtonProps, 'variant' | 'color'>;
