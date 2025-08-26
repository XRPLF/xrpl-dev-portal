import React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";

export interface BenefitCard {
  id: string;
  title: string;
  description: React.ReactNode | string;
}

export interface BenefitsSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  cards: BenefitCard[];
  className?: string;
  showImages?: boolean;
  listId?: string;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({
  eyebrow,
  title,
  description,
  cards,
  className = "",
  showImages = true,
  listId = "benefits-list",
}) => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <section className={`container-new py-26 ${className}`}>
      <div className="d-flex flex-column-reverse col-lg-10 col-sm-8 p-0">
        <h3 className="h4 h2-sm">{translate(title)}</h3>
        {eyebrow && <h6 className="eyebrow mb-3">{translate(eyebrow)}</h6>}
      </div>
      {description && (
        <p className="mt-6 mb-0 col-lg-8 col-sm-8 p-0">{translate(description)}</p>
      )}
      <ul className="mt-10 card-grid card-grid-3xN" id={listId}>
        {cards.map(card => (
          <li className="col ls-none" key={card.id}>
            {showImages && <img id={card.id} alt={card.title + ' Icon'} />}
            <h4 className="mt-3 mb-0 h5">{translate(card.title)}</h4>
            <p className="mt-6-until-sm mt-3 mb-0">
              {typeof card.description === 'string' ? translate(card.description) : card.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

