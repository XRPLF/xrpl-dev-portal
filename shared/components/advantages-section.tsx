import React from "react";
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { Link } from "@redocly/theme/components/Link/Link";

interface AdvantageContent {
  href?: string;
  subtitle: string;
  description?: string;
}

interface Advantage {
  id: string;
  title: string;
  contents: AdvantageContent[];
}

interface AdvantagesSectionProps {
  title: string;
  description?: string;
  advantages: Advantage[];
  className?: string;
  useLinks?: boolean; // New prop to control whether to use links or bullet points
}

const AdvantageCard = (advantageContents: AdvantageContent[], useLinks: boolean = true) => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  
  if (useLinks) {
    // Original tokenization style with links
    return advantageContents.map((content) => (
      <div key={content.subtitle}>
        <Link to={content.href}><h5 className="card-subhead">{translate(content.subtitle)}:</h5></Link>
        <div className="card-text">
          {translate(content?.description || "")}
        </div>
      </div>
    ))
  } else {
    // Payments style with bullet points
    return (
      <ul className="advantages-list">
        {advantageContents.map((content) => (
          <li key={content.subtitle} className="advantage-item">
            <strong>{translate(content.subtitle)}</strong>
            {content.description && (
              <span className="advantage-description">{translate(content.description)}</span>
            )}
          </li>
        ))}
      </ul>
    )
  }
}

export const AdvantagesSection: React.FC<AdvantagesSectionProps> = ({
  title,
  description,
  advantages,
  className = "",
  useLinks = true
}) => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  // Dynamic grid class based on number of advantages
  const getGridClass = () => {
    const count = advantages.length;
    if (count === 3) return "security-card-grid-3";
    if (count === 4) return "security-card-grid-4";
    return "security-card-grid"; // fallback to original
  };

  const headerSpacingClass = useLinks ? "mb-16" : "mb-8"; // 32px for bullet version, 64px for links

  return (
    <section className={`advantages-section container-new py-20 ${className}`}>
      <div className="d-flex flex-column-reverse">
        <p className={headerSpacingClass}>
          {translate(description)}
        </p>
        <h4 className="eyebrow mb-8">{translate(title)}</h4>
      </div>
      <div
        className={`${getGridClass()} nav card-grid`}
        id="security-features"
      >
        {advantages.map((advantage) => (
          <div className="security-card" key={advantage.id}>
            <div className="card-body p-6">
              <h4 className="card-title h6">{translate(advantage.title)}</h4>
              {AdvantageCard(advantage.contents, useLinks)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
