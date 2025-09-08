import React, { useState } from "react";
import { useThemeHooks } from '@redocly/theme/core/hooks';

interface Project {
  id: string;
  label: string;
  url: string;
  description?: string; // New optional field for payments page
  buttonText?: string; // Optional button text for battle-tested cards
}

interface ProjectCardsProps {
  title: string;
  projects: Project[];
  showCarousel?: boolean; // true for tokenization (carousel), false for payments (grid)
  className?: string;
}

const ProjectCard = ({ project, index, showCarousel = true }: { 
  project: Project; 
  index: number; 
  showCarousel?: boolean;
}) => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <a
      className={`col card float-up-on-hover ${
        showCarousel 
          ? (index % 2 === 0 ? "even" : "odd") 
          : `payments-project-card ${index % 2 === 0 ? "odd" : "even"}`
      }`}
      target="_blank"
      href={project.url}
    >
      <div className="project-logo d-flex justify-content-center align-items-center">
        <img className={project.id} alt={project.label} />
      </div>
      {!showCarousel && project.description && (
        <div className="project-description">
          {(() => {
            const words = project.description.split(' ');
            const firstWord = words[0];
            const restOfText = words.slice(1).join(' ');
            return (
              <>
                <strong className="first-word">{firstWord}</strong>
                {restOfText && <span className="rest-text"> {restOfText}</span>}
              </>
            );
          })()}
        </div>
      )}
      {!showCarousel && project.buttonText && (
        <div className="project-button">
          <span className="btn-arrow battle-tested-arrow">{translate(project.buttonText)}</span>
        </div>
      )}
    </a>
  );
};

const FeaturedProjectsCarousel = ({ projects }: { projects: Project[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < projects.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="featured-projects">
      <div className="project-cards-container card-grid card-grid-3xN">
        <ProjectCard project={projects[currentIndex]} index={currentIndex} />
        <ProjectCard
          project={projects[currentIndex + 1]}
          index={currentIndex + 1}
        />
        <ProjectCard
          project={projects[currentIndex + 2]}
          index={currentIndex + 2}
        />
      </div>
      <div className="arrow-wrapper d-flex justify-content-center mt-16">
        <button
          className={`arrow-button prev ${
            currentIndex > 0 ? "hover-color" : ""
          }`}
          onClick={handlePrev}
        >
          <img alt="left arrow" />
        </button>
        <button
          className={`arrow-button next ${
            currentIndex < projects.length - 3 ? "hover-color" : ""
          }`}
          onClick={handleNext}
        >
          <img alt="right arrow" />
        </button>
      </div>
    </div>
  );
};

const ProjectsGrid = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="payments-projects-grid card-grid">
      {projects.map((project, index) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          index={index} 
          showCarousel={false}
        />
      ))}
    </div>
  );
};

export const ProjectCards: React.FC<ProjectCardsProps> = ({
  title,
  projects,
  showCarousel = true,
  className = ""
}) => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <section className={`container-new py-20 ${className}`}>
      <div className="d-flex flex-column-reverse">
        <h4 className="eyebrow mb-16">
          {translate(title)}
        </h4>
      </div>
      <div className="project-cards">
        {showCarousel ? (
          <FeaturedProjectsCarousel projects={projects} />
        ) : (
          <ProjectsGrid projects={projects} />
        )}
      </div>
    </section>
  );
};
