import React from 'react';
import clsx from 'clsx';
import { ButtonGroup, ButtonConfig } from '../ButtonGroup';

export interface LinkTextCardProps {
  /** Card index for numbering (displays as index + 1) */
  index: number;
  /** Heading text (required) */
  heading: string;
  /** Description text (required) */
  description: string;
  /** Array of button configurations (max 2) */
  buttons: ButtonConfig[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * LinkTextCard Component
 *
 * A card component that displays a numbered item with heading, description, and action buttons.
 * Features a top divider, sequential numbering (01, 02, 03...), and up to 2 call-to-action buttons.
 *
 * Design:
 * - Flat HTML structure for minimal DOM depth
 * - Fixed green button color for brand consistency
 * - Responsive typography using existing design tokens
 * - Full light/dark mode support
 *
 * @example
 * // Basic usage
 * <LinkTextCard
 *   index={0}
 *   heading="Fast Settlement and Low Fees"
 *   description="Settle transactions in 3-5 seconds for a fraction of a cent"
 *   buttons={[
 *     { label: "Get Started", href: "/start" },
 *     { label: "Learn More", href: "/learn" }
 *   ]}
 * />
 *
 * @example
 * // Single button
 * <LinkTextCard
 *   index={1}
 *   heading="Secure and Reliable"
 *   description="Built on proven blockchain technology"
 *   buttons={[{ label: "Read Docs", href: "/docs" }]}
 * />
 */
export const LinkTextCard: React.FC<LinkTextCardProps> = ({
  index,
  heading,
  description,
  buttons,
  className,
}) => {
  // Format number with zero padding (01, 02, 03...)
  const formattedNumber = String(index + 1).padStart(2, '0');

  // Ensure max 2 buttons for proper layout
  const maxButtons = buttons.slice(0, 2);

  return (
  <li className={clsx('bds-link-text-card', className)}>
    <div className="bds-link-text-card__header">
      <p className="mb-0 body-l">{formattedNumber}</p>
      <h5 className="mb-0 sh-lg-l">{heading}</h5>
    </div>
    <div className="bds-link-text-card__content">
      <p className="mb-0 body-l">{description}</p>
      {maxButtons.length > 0 && (
        <ButtonGroup buttons={maxButtons} color="green" />
      )}
    </div>
  </li>
  );
};

export default LinkTextCard;
