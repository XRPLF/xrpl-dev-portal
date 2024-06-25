import React from "react";
import { useTranslate } from "@portal/hooks";

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
  const { translate } = useTranslate();
  return (
    <ul className="nav flex-column">
      {pages.map((useCase, index) => (
        <li className="nav-item" key={useCase.link}>
          <a
            href={useCase.link}
            className={`nav-link ${
              index === pages.length - 1 && !bottomBorder ? "border-none" : ""
            }`}
          >
            {translate(useCase.description)}
          </a>
        </li>
      ))}
    </ul>
  );
};
