import { Link } from '@redocly/theme/components/Link/Link';
import { XRPLCard } from './XRPLCard';

interface Tutorial {
  title: string;
  body?: string;
  path?: string;
  links?: { language: string; path: string }[];
  languages?: string[]; // For cards with multiple language tabs
}

export interface TutorialCategoryProps {
  title: string;
  description?: string;
  tutorials: Tutorial[];
  maxTutorials?: number;
}

const LANGUAGES: Record<string, { icon: string; alt: string }> = {
  javascript: { icon: '/img/logos/javascript.svg', alt: 'JavaScript' },
  python: { icon: '/img/logos/python.svg', alt: 'Python' },
  java: { icon: '/img/logos/java.svg', alt: 'Java' },
  go: { icon: '/img/logos/golang.svg', alt: 'Go' },
  php: { icon: '/img/logos/php.svg', alt: 'PHP' },
  cli: { icon: '/img/logos/cli.svg', alt: 'Command Line' },
  http: { icon: '/img/logos/globe.svg', alt: 'HTTP / WebSocket' },
};

const DEFAULT_ICON = { icon: '/img/logos/xrp.svg', alt: 'XRP Ledger' };

export function TutorialCategory({ title, description, tutorials, maxTutorials = 6 }: TutorialCategoryProps) {
  return (
    <section className="tutorial-category">
      <h2>{title}</h2>
      {description && <p className="tutorial-category-description">{description}</p>}
      <div className="card-grid card-grid-3xN">
        {tutorials.slice(0, maxTutorials).map(tutorial => {
          const key = tutorial.path || tutorial.links?.[0]?.path || tutorial.title;
          const langs = resolveLanguages(tutorial.languages);

          // Multi-link card with language buttons (explicit links OR languages with multi flag)
          if (tutorial.links && tutorial.links.length > 0) {
            const languageLinks = getLanguageLinks(tutorial.links);
            return renderMultiLinkCard(key, tutorial, languageLinks);
          }

          // Single-link card
          const fullPath = expandPath(tutorial.path || '');
          const icons = langs.length > 0
            ? langs.map(l => LANGUAGES[l]).filter(Boolean)
            : [detectLanguageIcon(fullPath, tutorial.title)];

          // If multiple language icons, render custom card with icons
          if (icons.length > 1) {
            return (
              <Link key={key} to={fullPath || '#'} className="card float-up-on-hover">
                <div className="card-body">
                  <div className="card-icon-container multi-icon">
                    {icons.map(icon => (
                      <img key={icon.alt} src={icon.icon} alt={icon.alt} title={icon.alt} />
                    ))}
                  </div>
                  <h4 className="card-title h5">{tutorial.title}</h4>
                  {tutorial.body && <p className="card-text">{tutorial.body}</p>}
                </div>
                <div className="card-footer">&nbsp;</div>
              </Link>
            );
          }

          // Single icon - use XRPLCard
          return (
            <XRPLCard
              key={key}
              title={tutorial.title}
              body={tutorial.body}
              href={fullPath || '#'}
              image={icons[0]?.icon}
              imageAlt={icons[0]?.alt}
              external={false}
            />
          );
        })}
      </div>
    </section>
  );

  function renderMultiLinkCard(key: string, tutorial: Tutorial, languageLinks: { name: string; path: string; icon: string }[]) {
    const icons = languageLinks.map(l => ({ icon: l.icon, alt: l.name }));
    return (
      <div key={key} className="card float-up-on-hover multi-link-card">
        <div className="card-body">
          <div className={`card-icon-container ${icons.length > 1 ? 'multi-icon' : ''}`}>
            {icons.map(icon => (
              <img key={icon.alt} src={icon.icon} alt={icon.alt} title={icon.alt} />
            ))}
          </div>
          <h4 className="card-title h5">{tutorial.title}</h4>
          {tutorial.body && <p className="card-text">{tutorial.body}</p>}
        </div>
        <div className="card-links">
          {languageLinks.map(lang => (
            <Link key={lang.path} to={expandPath(lang.path)} className="card-link-btn">{lang.name}</Link>
          ))}
        </div>
        <div className="card-footer">&nbsp;</div>
      </div>
    );
  }
}

// Resolve languages array, or return empty
function resolveLanguages(languages: string[] | undefined): string[] {
  return languages || [];
}

// Expand short paths to full paths
function expandPath(path: string): string {
  if (!path || path.startsWith('/') || path.startsWith('http')) return path;
  return `/docs/tutorials/${path}/`;
}

// Get language links and icons for a multi-link card
function getLanguageLinks(links: { language: string; path: string }[]) {
  return links
    .map(link => {
      const lang = LANGUAGES[link.language.toLowerCase()];
      return lang ? { name: lang.alt, path: link.path, icon: lang.icon } : null;
    })
    .filter(Boolean) as { name: string; path: string; icon: string }[];
}

function detectLanguageIcon(path: string, title: string) {
  const t = `${path} ${title}`.toLowerCase();

  if (t.includes('javascript') || t.includes('-js')) return LANGUAGES.javascript;
  if (t.includes('python') || t.includes('-py')) return LANGUAGES.python;
  if ((t.includes('java') && !t.includes('javascript')) || t.includes('-java')) return LANGUAGES.java;
  if (t.includes('golang') || t.includes('-go') || t.includes('get-started-go')) return LANGUAGES.go;
  if (t.includes('php')) return LANGUAGES.php;
  if (t.includes('http') || t.includes('websocket')) return LANGUAGES.http;

  return DEFAULT_ICON;
}
