import { useThemeHooks } from "@redocly/theme/core/hooks"
import { Link } from "@redocly/theme/components/Link/Link"
import { useRef, useState } from "react"
import CopyableUrl from "../../@theme/components/CopyableUrl"
import {
  PinnedExternalTutorial,
  PinnedTutorial,
  sectionConfig,
} from "./sections.config"

type TutorialLanguagesMap = Record<string, string[]>

interface TutorialMetadataItem {
  path: string
  title: string
  description: string
  lastModified: string
  category: string
}

interface InternalTutorial {
  kind: "internal"
  title: string
  description?: string
  path: string
}

interface ExternalTutorial {
  kind: "external"
  title: string
  description: string
  url?: string
  github?: string
  author: { name: string; url: string }
}

type Tutorial = InternalTutorial | ExternalTutorial

interface TutorialSection {
  id: string
  title: string
  description: string
  tutorials: InternalTutorial[]
  community?: ExternalTutorial[]
  communityDescription?: string
  showFooter?: boolean
}

const MAX_WHATS_NEW = 3
const MAX_TUTORIALS_PER_SECTION = 6

export const frontmatter = {
  seo: {
    title: "Tutorials",
    description:
      "Learn how to get started building on the XRP Ledger with these helpful crypto wallet and blockchain tutorials for developers.",
  },
}

const langIcons: Record<string, { src: string; alt: string }> = {
  javascript: { src: "/img/logos/javascript.svg", alt: "JavaScript" },
  python: { src: "/img/logos/python.svg", alt: "Python" },
  java: { src: "/img/logos/java.svg", alt: "Java" },
  go: { src: "/img/logos/golang.svg", alt: "Go" },
  php: { src: "/img/logos/php.svg", alt: "PHP" },
  http: { src: "/img/logos/globe.svg", alt: "HTTP / WebSocket" },
  xrpl: { src: "/img/logos/xrp-mark.svg", alt: "XRP Ledger" },
}

// ── Components ──────────────────────────────────────────────────────────────

function TutorialCard({
  tutorial,
  detectedLanguages,
  showFooter = false,
  translate,
}: {
  tutorial: InternalTutorial
  detectedLanguages?: string[]
  showFooter?: boolean
  translate: (text: string) => string
}) {
  // Get icons from auto-detected languages, or fallback to XRPL icon.
  const icons = detectedLanguages && detectedLanguages.length > 0
    ? detectedLanguages.map((lang) => langIcons[lang]).filter(Boolean)
    : [langIcons.xrpl]

  return (
    <Link to={tutorial.path} className="card">
      <div className="card-header d-flex align-items-center flex-wrap">
        {icons.map((icon, idx) => (
          <span className="circled-logo" key={idx}>
            <img src={icon.src} alt={icon.alt} />
          </span>
        ))}
      </div>
      <div className="card-body">
        <h4 className="card-title h5">{translate(tutorial.title)}</h4>
        {tutorial.description && <p className="card-text">{translate(tutorial.description)}</p>}
      </div>
      {showFooter && <div className="card-footer"></div>}
    </Link>
  )
}

// Inline meta link used in ContributionCard
function MetaLink({ href, icon, label }: {
  href: string
  icon: string
  label: string
}) {
  return (
    <Link to={href} target="_blank" rel="noopener noreferrer" className="meta-link">
      <i className={`fa fa-${icon}`} aria-hidden="true" />
      {label}
    </Link>
  )
}

// Community Contribution Card
function ContributionCard({
  tutorial,
  translate,
}: {
  tutorial: ExternalTutorial
  translate: (text: string) => string
}) {
  const primaryUrl = tutorial.url || tutorial.github

  const bodyContent = (
    <>
      <h4 className="card-title h5">
        {translate(tutorial.title)}
        <span className="card-external-icon" aria-label={translate("External link")}>
          <i className="fa fa-external-link" aria-hidden="true" />
        </span>
      </h4>
      {tutorial.description && <p className="card-text">{translate(tutorial.description)}</p>}
    </>
  )

  return (
    <div className="card contribution-card">
      <div className="card-header contribution-header">
        <span className="circled-logo contribution-icon">
          <i className="fa fa-users" aria-hidden="true" />
        </span>
        <div className="card-meta-row">
          <MetaLink href={tutorial.author.url} icon="user" label={tutorial.author.name} />
          {tutorial.github && (
            <>
              <span className="meta-dot" aria-hidden="true">·</span>
              <MetaLink href={tutorial.github} icon="github" label={translate("GitHub")} />
            </>
          )}
        </div>
      </div>
      <div className="card-body">
        {primaryUrl ? (
          <Link
            to={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="card-body-link"
          >
            {bodyContent}
          </Link>
        ) : (
          bodyContent
        )}
      </div>
    </div>
  )
}

// Reusable section block for rendering tutorial sections.
// When `community` is provided, renders a tab switcher above the grid.
function TutorialSectionBlock({
  id,
  title,
  description,
  tutorials,
  community,
  communityDescription,
  tutorialLanguages,
  showFooter = false,
  maxTutorials,
  className = "",
  translate,
}: {
  id: string
  title: string
  description: string
  tutorials: InternalTutorial[]
  community?: ExternalTutorial[]
  communityDescription?: string
  tutorialLanguages: TutorialLanguagesMap
  showFooter?: boolean
  maxTutorials?: number
  className?: string
  translate: (text: string) => string
}) {
  // Pagination state: cap the list when collapsed.
  const [expanded, setExpanded] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const isCapped = maxTutorials !== undefined

  const handleToggle = () => {
    if (expanded && sectionRef.current) {
      const offsetTop = sectionRef.current.getBoundingClientRect().top + window.scrollY
      setExpanded(false)
      requestAnimationFrame(() => {
        window.scrollTo({ top: offsetTop - 20 })
      })
    } else {
      setExpanded(true)
    }
  }

  // Tab state: which tutorial set to show.
  const [activeTab, setActiveTab] = useState<"official" | "community">("official")
  const hasTabs = community !== undefined && community.length > 0
  const currentTutorials: Tutorial[] =
    hasTabs && activeTab === "community" ? community : tutorials

  const handleTabChange = (tab: "official" | "community") => {
    if (tab === activeTab) return
    setExpanded(false)
    setActiveTab(tab)
  }

  // Derived display values.
  const hasMore = isCapped && currentTutorials.length > maxTutorials
  const displayTutorials =
    isCapped && !expanded ? currentTutorials.slice(0, maxTutorials) : currentTutorials

  return (
    <section ref={sectionRef} className={`container-new pt-10 pb-14 ${className}`.trim()} id={id}>
      <div className="col-12 col-xl-8 p-0">
        <h3 className="h4 mb-3">{translate(title)}</h3>
        {!hasTabs && <p className="mb-4">{translate(description)}</p>}
      </div>
      {hasTabs && (
        <div className="tutorial-tabs" role="tablist" aria-label={translate(title)}>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "official"}
            aria-controls={`${id}-panel`}
            className={`tutorial-tab ${activeTab === "official" ? "is-active" : ""}`}
            onClick={() => handleTabChange("official")}
          >
            {translate("xrpl.org")}
            <span className="tutorial-tab-count">{tutorials.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "community"}
            aria-controls={`${id}-panel`}
            className={`tutorial-tab ${activeTab === "community" ? "is-active" : ""}`}
            onClick={() => handleTabChange("community")}
          >
            {translate("Community")}
            <span className="tutorial-tab-count">{community!.length}</span>
          </button>
        </div>
      )}
      {hasTabs && activeTab === "official" && (
        <p className="tutorial-tab-description">{translate(description)}</p>
      )}
      {hasTabs && activeTab === "community" && communityDescription && (
        <p className="tutorial-tab-description">{translate(communityDescription)}</p>
      )}
      <div
        className="row tutorial-cards"
        id={hasTabs ? `${id}-panel` : undefined}
        role={hasTabs ? "tabpanel" : undefined}
      >
        {displayTutorials.map((tutorial, index) => (
          <div
            key={`${activeTab}-${index}-${tutorial.kind === "external" ? tutorial.url || tutorial.github : tutorial.path}`}
            className="col-lg-4 col-md-6 mb-5"
          >
            {tutorial.kind === "external" ? (
              <ContributionCard tutorial={tutorial} translate={translate} />
            ) : (
              <TutorialCard
                tutorial={tutorial}
                detectedLanguages={tutorialLanguages[tutorial.path]}
                showFooter={showFooter}
                translate={translate}
              />
            )}
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="explore-more-wrapper">
          <button
            className="explore-more-link"
            onClick={handleToggle}
          >
            {expanded ? translate("Show less") : translate("Explore more")} {expanded ? "↑" : "→"}
          </button>
        </div>
      )}
    </section>
  )
}

// Quick reference card showing public server URLs and faucet link
function QuickReferenceCard({ translate }: { translate: (text: string) => string }) {
  return (
    <div className="quick-ref-card">
      <div className="quick-ref-section">
        <span className="quick-ref-label">{translate("Public Servers")}</span>
        <div className="quick-ref-group">
          <span className="quick-ref-key"><strong>{translate("Mainnet")}</strong></span>
          <div className="quick-ref-urls">
            <span className="quick-ref-protocol">{translate("WebSocket")}</span>
            <CopyableUrl url="wss://xrplcluster.com" translate={translate} />
            <span className="quick-ref-protocol">{translate("JSON-RPC")}</span>
            <CopyableUrl url="https://xrplcluster.com" translate={translate} />
          </div>
        </div>
        <div className="quick-ref-group">
          <span className="quick-ref-key"><strong>{translate("Testnet")}</strong></span>
          <div className="quick-ref-urls">
            <span className="quick-ref-protocol">{translate("WebSocket")}</span>
            <CopyableUrl url="wss://s.altnet.rippletest.net:51233" translate={translate} />
            <span className="quick-ref-protocol">{translate("JSON-RPC")}</span>
            <CopyableUrl url="https://s.altnet.rippletest.net:51234" translate={translate} />
          </div>
        </div>
        <Link to="/docs/tutorials/public-servers/" className="quick-ref-link">
          {translate("View all servers")} →
        </Link>
      </div>
      <div className="quick-ref-divider"></div>
      <div className="quick-ref-section">
        <Link to="/resources/dev-tools/xrp-faucets/" className="quick-ref-faucet">
          <span>{translate("Get Test XRP")}</span>
          <span className="quick-ref-arrow">→</span>
        </Link>
      </div>
    </div>
  )
}

// ── Page Component ──────────────────────────────────────────────────────────

export default function TutorialsIndex() {
  const { useTranslate, usePageSharedData } = useThemeHooks()
  const { translate } = useTranslate()

  // Get auto-detected languages from the plugin (maps tutorial paths to language arrays).
  const tutorialLanguages = usePageSharedData<TutorialLanguagesMap>("tutorial-languages") || {}

  // Get tutorial metadata and sidebar categories from the tutorial-metadata plugin.
  const tutorialMetadata = usePageSharedData<{
    tutorials: TutorialMetadataItem[]
    categories: { id: string; title: string }[]
  }>("tutorial-metadata")
  const allTutorials = tutorialMetadata?.tutorials || []
  const sidebarCategories = tutorialMetadata?.categories || []

  // What's New: most recently modified tutorials, excluding Get Started.
  const whatsNewConfig = sectionConfig["whats-new"]!
  const getStartedPaths = new Set(
    (sectionConfig["get-started"]?.pinned || []).map(getPinnedPath)
  )
  const whatsNewTutorials: InternalTutorial[] = allTutorials
    .filter((tutorial) => !getStartedPaths.has(tutorial.path))
    .slice(0, MAX_WHATS_NEW)
    .map((tutorial) => toInternalTutorial(tutorial))

  // Category sections (including Get Started): ordered by sectionConfig, then any new sidebar categories.
  const sections = buildCategorySections(sidebarCategories, allTutorials)

  return (
    <main className="landing page-tutorials landing-builtin-bg">
      {/* Hero Section */}
      <section className="container-new py-20">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <div className="d-flex flex-column-reverse">
              <h1 className="mb-0">
                {translate("Crypto Wallet and Blockchain Development Tutorials")}
              </h1>
              <h6 className="eyebrow mb-3">{translate("Tutorials")}</h6>
            </div>
            <nav className="mt-4">
              <ul className="page-toc no-sideline d-flex flex-wrap gap-2 mb-0">
                {whatsNewTutorials.length > 0 && (
                  <li><Link to="#whats-new">{translate(whatsNewConfig.title)}</Link></li>
                )}
                {sections.map((section) => (
                  <li key={section.id}><Link to={`#${section.id}`}>{translate(section.title)}</Link></li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="col-lg-5 mt-6 mt-lg-0">
            <QuickReferenceCard translate={translate} />
          </div>
        </div>
      </section>

      {/* What's New */}
      {whatsNewTutorials.length > 0 && (
        <TutorialSectionBlock
          id="whats-new"
          title={whatsNewConfig.title!}
          description={whatsNewConfig.description!}
          tutorials={whatsNewTutorials}
          tutorialLanguages={tutorialLanguages}
          showFooter
          className="whats-new-section pb-20"
          translate={translate}
        />
      )}

      {/* Tutorial Sections */}
      {sections.map((section) => (
        <TutorialSectionBlock
          key={section.id}
          id={section.id}
          title={section.title}
          description={section.description}
          tutorials={section.tutorials}
          community={section.community}
          communityDescription={section.communityDescription}
          tutorialLanguages={tutorialLanguages}
          maxTutorials={section.showFooter ? undefined : MAX_TUTORIALS_PER_SECTION}
          showFooter={section.showFooter}
          className={section.showFooter ? "pb-20" : "category-section"}
          translate={translate}
        />
      ))}
    </main>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Get the internal route path from a pinned entry */
function getPinnedPath(entry: PinnedTutorial): string {
  return typeof entry === "string" ? entry : entry.path
}

/** Convert tutorial metadata to an InternalTutorial */
function toInternalTutorial(t: TutorialMetadataItem, descriptionOverride?: string): InternalTutorial {
  return {
    kind: "internal",
    title: t.title,
    description: descriptionOverride || t.description,
    path: t.path,
  }
}

/** Build InternalTutorial objects from pinned entries, resolving metadata by path */
function buildInternalTutorials(entries: PinnedTutorial[], allTutorials: TutorialMetadataItem[]): InternalTutorial[] {
  return entries
    .map((entry): InternalTutorial | null => {
      const path = getPinnedPath(entry)
      const descOverride = typeof entry === "string" ? undefined : entry.description
      const metadata = allTutorials.find((t) => t.path === path)
      return metadata ? toInternalTutorial(metadata, descOverride) : null
    })
    .filter((t): t is InternalTutorial => t !== null)
}

/** Build ExternalTutorial objects from community contribution entries */
function buildExternalContributions(items: PinnedExternalTutorial[]): ExternalTutorial[] {
  return items.map((item) => ({
    kind: "external",
    title: item.title,
    description: item.description,
    github: item.github,
    url: item.url,
    author: item.author,
  }))
}

/** Build category sections ordered by sectionConfig, with new sidebar categories appended */
function buildCategorySections(
  sidebarCategories: { id: string; title: string }[],
  allTutorials: TutorialMetadataItem[],
): TutorialSection[] {
  const specialIds = new Set(["whats-new"])
  const sidebarMap = new Map(sidebarCategories.map((category) => [category.id, category]))
  const allPinnedPaths = new Set(
    Object.values(sectionConfig).flatMap((config) => (config.pinned || []).map(getPinnedPath))
  )

  // Sections follow sectionConfig key order. New sidebar categories not in sectionConfig are appended at the end.
  const configIds = Object.keys(sectionConfig).filter((id) => !specialIds.has(id))
  const newIds = sidebarCategories
    .filter((category) => !specialIds.has(category.id) && !sectionConfig[category.id])
    .map((category) => category.id)

  return [...configIds, ...newIds]
    .filter((id) => sidebarMap.has(id))
    .map((id) => {
      const config = sectionConfig[id]
      const title = config?.title || sidebarMap.get(id)!.title
      const description = config?.description || ""
      const pinned = buildInternalTutorials(config?.pinned || [], allTutorials)
      const remaining = allTutorials
        .filter((t) => t.category === id && !allPinnedPaths.has(t.path))
        .map((t) => toInternalTutorial(t))
      const community = buildExternalContributions(config?.community?.items || [])
      return {
        id,
        title,
        description,
        tutorials: [...pinned, ...remaining],
        community: community.length > 0 ? community : undefined,
        communityDescription: config?.community?.description,
        showFooter: config?.showFooter,
      }
    })
    .filter((section) => section.tutorials.length > 0 || (section.community && section.community.length > 0))
}
