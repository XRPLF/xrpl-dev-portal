import React from "react";
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { Link } from "@redocly/theme/components/Link/Link";

interface PageProps {
  description: string;
  link: string;
}

interface NavListProps {
  pages: PageProps[];
  bottomBorder?: boolean;
}

export const NavList: React.FC<NavListProps> = ({
  pages,
  bottomBorder = true,
}) => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  return (
    <ul className="nav flex-column">
      {pages.map((useCase, index) => (
        <li className="nav-item" key={useCase.link}>
          <Link
            to={useCase.link}
            className={`nav-link ${
              index === pages.length - 1 && !bottomBorder ? "border-none" : ""
            }`}
          >
            {translate(useCase.description)}
          </Link>
        </li>
      ))}
    </ul>
  );
};
