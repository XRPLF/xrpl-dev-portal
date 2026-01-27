import React, { forwardRef } from "react";
import clsx from "clsx";
import Button from "../Button/Button";
import {
  DesignContrainedButtonProps,
  isEnvironment,
  isEmpty,
} from "../../utils";

/**
 * Available background color variants for StandardCard:
 * - 'neutral': Default neutral background
 * - 'green': XRPL brand green background
 * - 'yellow': Yellow background
 * - 'blue': Blue background
 */
export type StandardCardVariant = "neutral" | "green" | "yellow" | "blue";

export interface StandardCardProps extends React.ComponentPropsWithoutRef<"article"> {
  headline: React.ReactNode;
  /** Background color variant */
  variant: StandardCardVariant;
  callsToAction: [DesignContrainedButtonProps, DesignContrainedButtonProps?];
  children?: React.ReactNode;
}

/**
 * StandardCard props without the variant prop.
 * Used by StandardCardGroupSection to ensure uniform variant across all cards.
 */
export type StandardCardPropsWithoutVariant = Omit<
  StandardCardProps,
  "variant"
>;

const StandardCard = forwardRef<HTMLElement, StandardCardProps>(
  (props, ref) => {
    const {
      headline,
      variant = "neutral",
      callsToAction,
      className,
      children,
      ...rest
    } = props;

    const [primaryButton, secondaryButton] = callsToAction;

    const hasButtons = callsToAction.some((button) => button !== undefined);

    if (!headline) {
      if (isEnvironment("development")) {
        console.warn("Headline is required for StandardCard");
      }
      return null;
    }

    return (
      <article
        ref={ref}
        className={clsx(
          "bds-standard-card",
          `bds-standard-card--${variant}`,
          className,
        )}
        {...rest}
      >
        <div className="bds-standard-card__content">
          <h2 className="bds-standard-card__headline sh-md-r">{headline}</h2>
          {!isEmpty(children) && (
            <div className="bds-standard-card__description body-l">
              {children}
            </div>
          )}
        </div>
        {hasButtons && (
          <div className="bds-standard-card__buttons">
            {primaryButton && (
              <Button
                {...primaryButton}
                variant="primary"
                color="black"
                forceColor={true}
              />
            )}
            {secondaryButton && (
              <Button
                {...secondaryButton}
                variant="tertiary"
                color="black"
                forceColor={true}
              />
            )}
          </div>
        )}
      </article>
    );
  },
);

export default StandardCard;
