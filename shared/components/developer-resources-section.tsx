import React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import { Link } from "@redocly/theme/components/Link/Link";

export interface DeveloperResourcesCard {
  title: string;
  description: string | React.ReactNode;
  links: Array<{
    text: string;
    url: string;
    target?: "_blank" | "_self";
  }>;
  backgroundClass?: string;
}

export interface DeveloperResourcesSectionProps {
  cards: DeveloperResourcesCard[];
  className?: string;
}

export const DeveloperResourcesSection: React.FC<DeveloperResourcesSectionProps> = ({
  cards,
  className = ""
}) => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const isSingleCard = cards.length === 1;

  return (
    <div className={`container developer-resources-section page-community ${className} ${isSingleCard ? 'single-card' : ''}`}>
      <section className="bottom-cards-section bug-bounty section-padding">
        {cards.map((card, index) => (
          <div key={index} className={`com-card ${card.backgroundClass || ''}`}>
            <div className="card-content custom-gap">
              <h6 className="card-title">{translate(card.title)}</h6>
              <p className="card-description">
                {typeof card.description === 'string' ? translate(card.description) : card.description}
              </p>
              <div className="card-links">
                {card.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    className={`com-card-link ${linkIndex === 0 ? 'mt-16' : ''}`}
                    target={link.target || "_blank"}
                    to={link.url}
                  >
                    {translate(link.text)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
