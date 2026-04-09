import { useThemeHooks } from "@redocly/theme/core/hooks"
import { Link } from "@redocly/theme/components/Link/Link"
import { useRef, useState } from "react"

type TutorialLanguagesMap = Record<string, string[]>

interface TutorialMetadataItem {
  path: string
  title: string
  description: string
  lastModified: string
  category: string
}

interface Tutorial {
  title: string
  description?: string
  path: string
  // External community contribution fields (optional)
  author?: { name: string; url: string }
  github?: string
  externalUrl?: string
}

interface TutorialSection {
  id: string
  title: string
  description: string
  tutorials: Tutorial[]
}

// External community contribution - manually curated with author/repo/demo info
interface PinnedExternalTutorial {
  title: string
  description: string
  author: { name: string; url: string }
  github: string
  url?: string
}

// Pinned tutorial entry:
// - string: internal path (uses frontmatter title/description)
// - object with `path`: internal path with optional description override
// - PinnedExternalTutorial: external community contribution with author/repo/demo
type PinnedTutorial = string | { path: string; description?: string } | PinnedExternalTutorial

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

// Section configuration - defines display order, titles, and descriptions.
// "whats-new" and "get-started" are rendered separately; the rest are auto-populated category sections.
const sectionConfig: { id: string; title: string; description: string }[] = [
  {
    id: "whats-new",
    title: "What's New",
    description: "Recently added/updated tutorials to help you build on the XRP Ledger.",
  },
  {
    id: "get-started",
    title: "Get Started with SDKs",
    description: "These tutorials walk you through the basics of building a very simple XRP Ledger-connected application using your favorite programming language.",
  },
  {
    id: "tokens",
    title: "Tokens",
    description: "Create and manage tokens on the XRP Ledger.",
  },
  {
    id: "payments",
    title: "Payments",
    description: "Transfer XRP and issued currencies using various payment types.",
  },
  {
    id: "defi",
    title: "DeFi",
    description: "Trade, provide liquidity, and lend using native XRP Ledger DeFi features.",
  },
  {
    id: "best-practices",
    title: "Best Practices",
    description: "Learn recommended patterns for building reliable, secure applications on the XRP Ledger.",
  },
  {
    id: "compliance-features",
    title: "Compliance",
    description: "Implement compliance controls like destination tags, credentials, and permissioned domains.",
  },
  {
    id: "programmability",
    title: "Programmability",
    description: "Set up cross-chain bridges and submit interoperability transactions.",
  },
  {
    id: "advanced-developer-topics",
    title: "Advanced Developer Topics",
    description: "Explore advanced topics like WebSocket monitoring and testing devnet features.",
  },
  {
    id: "sample-apps",
    title: "Sample Apps",
    description: "Build complete, end-to-end applications like wallets and credential services.",
  },
]

// Pinned tutorials - featured tutorials that appear first in their section.
// - string: uses frontmatter title and description as-is.
// - { path, description? }: internal tutorial with optional description override.
// - { title, description, author, github, url? }: external community contribution.
const pinnedTutorials: Record<string, PinnedTutorial[]> = {
  "get-started": [
    { path: "/docs/tutorials/get-started/get-started-javascript/", description: "Using the xrpl.js client library." },
    { path: "/docs/tutorials/get-started/get-started-python/", description: "Using xrpl.py, a pure Python library." },
    { path: "/docs/tutorials/get-started/get-started-go/", description: "Using xrpl-go, a pure Go library." },
    { path: "/docs/tutorials/get-started/get-started-java/", description: "Using xrpl4j, a pure Java library." },
    { path: "/docs/tutorials/get-started/get-started-php/", description: "Using the XRPL_PHP client library." },
    { path: "/docs/tutorials/get-started/get-started-http-websocket-apis/", description: "Access the XRP Ledger directly through the APIs of its core server." },
  ],
  tokens: [
    { path: "/docs/tutorials/tokens/mpts/issue-a-multi-purpose-token/", description: "Issue new tokens using the v2 fungible token standard." },
    { path: "/docs/tutorials/tokens/fungible-tokens/issue-a-fungible-token/", description: "Issue new tokens using the v1 fungible token standard."},
    { path: "/docs/tutorials/tokens/nfts/mint-and-burn-nfts-js/", description: "Create new NFTs, retrieve existing tokens, and burn the ones you no longer need." },
    "/docs/tutorials/tokens/mpts/sending-mpts-in-javascript/",
  ],
  payments: [
    "/docs/tutorials/payments/send-xrp/",
    "/docs/tutorials/payments/create-trust-line-send-currency-in-javascript/",
    "/docs/tutorials/payments/send-a-conditional-escrow/",
    "/docs/tutorials/payments/send-a-timed-escrow/",
  ],
  defi: [
    "/docs/tutorials/defi/dex/create-an-automated-market-maker/",
    "/docs/tutorials/defi/dex/trade-in-the-decentralized-exchange/",
    "/docs/tutorials/defi/lending/use-the-lending-protocol/create-a-loan/",
    "/docs/tutorials/defi/lending/use-single-asset-vaults/create-a-single-asset-vault/",
  ],
  "best-practices": [
    "/docs/tutorials/best-practices/api-usage/",
  ],
  "sample-apps": [
    {
      title: "XRPL Lending Protocol Demo",
      description: "A full-stack web application that demonstrates the end-to-end flow of the Lending Protocol and Single Asset Vaults.",
      author: { name: "Aaditya-T", url: "https://github.com/Aaditya-T" },
      github: "https://github.com/Aaditya-T/lending_test",
      url: "https://lending-test-lovat.vercel.app/",
    },
  ],
}

// ── Components ──────────────────────────────────────────────────────────────

function TutorialCard({
  tutorial,
  detectedLanguages,
  showFooter = false,
  translate,
}: {
  tutorial: Tutorial
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
    <a href={href} target="_blank" rel="noopener noreferrer" className="meta-link">
      <i className={`fa fa-${icon}`} aria-hidden="true" />
      {label}
    </a>
  )
}

// Community Contribution Card 
function ContributionCard({
  tutorial,
  translate,
}: {
  tutorial: Tutorial
  translate: (text: string) => string
}) {
  const primaryUrl = tutorial.externalUrl || tutorial.github!

  const handleCardClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest(".card-meta-row")) return
    window.open(primaryUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div
      className="card contribution-card"
      onClick={handleCardClick}
      onKeyDown={(e) => { if (e.key === "Enter") handleCardClick(e) }}
      role="link"
      tabIndex={0}
    >
      <div className="card-header contribution-header">
        <span className="circled-logo contribution-icon">
          <i className="fa fa-users" aria-hidden="true" />
        </span>
        <div className="card-meta-row">
          {tutorial.author && (
            <>
              <MetaLink href={tutorial.author.url} icon="user" label={tutorial.author.name} />
              <span className="meta-dot" aria-hidden="true">·</span>
            </>
          )}
          <MetaLink href={tutorial.github!} icon="github" label={translate("GitHub")} />
        </div>
      </div>
      <div className="card-body">
        <h4 className="card-title h5">
          {translate(tutorial.title)}
          <span className="card-external-icon" aria-label={translate("External link")}>
            <i className="fa fa-external-link" aria-hidden="true" />
          </span>
        </h4>
        {tutorial.description && <p className="card-text">{translate(tutorial.description)}</p>}
      </div>
    </div>
  )
}

// Reusable section block for rendering tutorial sections
function TutorialSectionBlock({
  id,
  title,
  description,
  tutorials,
  tutorialLanguages,
  showFooter = false,
  maxTutorials,
  className = "",
  translate,
}: {
  id: string
  title: string
  description: string
  tutorials: Tutorial[]
  tutorialLanguages: TutorialLanguagesMap
  showFooter?: boolean
  maxTutorials?: number
  className?: string
  translate: (text: string) => string
}) {
  const [expanded, setExpanded] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const hasMore = maxTutorials ? tutorials.length > maxTutorials : false
  const displayTutorials = maxTutorials && !expanded ? tutorials.slice(0, maxTutorials) : tutorials

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

  return (
    <section ref={sectionRef} className={`container-new pt-10 pb-14 ${className}`.trim()} id={id}>
      <div className="col-12 col-xl-8 p-0">
        <h3 className="h4 mb-3">{translate(title)}</h3>
        <p className="mb-4">{translate(description)}</p>
      </div>
      <div className="row tutorial-cards">
        {displayTutorials.map((tutorial) => (
          <div key={tutorial.path} className="col-lg-4 col-md-6 mb-5">
            {tutorial.github ? (
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

// Copyable URL component with click-to-copy functionality
function CopyableUrl({ url, translate }: { url: string; translate: (text: string) => string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <button
      type="button"
      className={`quick-ref-value-btn ${copied ? "copied" : ""}`}
      onClick={handleCopy}
      title={copied ? translate("Copied!") : translate("Click to copy")}
    >
      <code className="quick-ref-value">{url}</code>
      <span className="copy-icon">{copied ? "✓" : ""}</span>
    </button>
  )
}

// Quick reference card showing public server URLs and faucet link
function QuickReferenceCard({ translate }: { translate: (text: string) => string }) {
  return (
    <div className="quick-ref-card">
      <div className="quick-ref-section">
        <span className="quick-ref-label">{translate("PUBLIC SERVERS")}</span>
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

  // Get tutorial metadata from the tutorial-metadata plugin.
  const tutorialMetadata = usePageSharedData<{ tutorials: TutorialMetadataItem[] }>("tutorial-metadata")
  const allTutorials = tutorialMetadata?.tutorials || []

  // Build Get Started tutorials from pinned config.
  const getStartedPinnedEntries = pinnedTutorials["get-started"] || []
  const getStartedTutorials = buildPinnedTutorials(getStartedPinnedEntries, allTutorials)

  // Get Started paths to exclude from "What's New".
  const getStartedPaths = new Set(getStartedPinnedEntries.map(getPinnedPath))

  // Get recent tutorials for "What's New" section.
  // Shows the most recently modified tutorials (excluding only Get Started).
  // Pinned tutorials in other sections CAN appear here if recently updated.
  const whatsNewTutorials: Tutorial[] = allTutorials
    .filter((t) => !getStartedPaths.has(t.path))
    .slice(0, MAX_WHATS_NEW)
    .map((t) => toTutorial(t))

  // Build category sections: pinned tutorials first, then auto-populated.
  const categorySectionIds = new Set(["whats-new", "get-started"])
  const allPinnedPaths = new Set(
    Object.values(pinnedTutorials).flat().map(getPinnedPath)
  )
  const sections: TutorialSection[] = sectionConfig
    .filter((config) => !categorySectionIds.has(config.id))
    .map((config) => {
      const pinned = buildPinnedTutorials(pinnedTutorials[config.id] || [], allTutorials)
      // allTutorials is already sorted by lastModified (newest first) from the plugin.
      const autoTutorials = allTutorials
        .filter((t) => t.category === config.id && !allPinnedPaths.has(t.path))
        .map((t) => toTutorial(t))
      return { ...config, tutorials: [...pinned, ...autoTutorials] }
    })
    .filter((section) => section.tutorials.length > 0)

  const whatsNewConfig = getSectionConfig("whats-new")
  const getStartedConfig = getSectionConfig("get-started")

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
                  <li><a href={`#${whatsNewConfig.id}`}>{translate(whatsNewConfig.title)}</a></li>
                )}
                {getStartedTutorials.length > 0 && (
                  <li><a href={`#${getStartedConfig.id}`}>{translate(getStartedConfig.title)}</a></li>
                )}
                {sections.map((section) => (
                  <li key={section.id}><a href={`#${section.id}`}>{translate(section.title)}</a></li>
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
          id={whatsNewConfig.id}
          title={whatsNewConfig.title}
          description={whatsNewConfig.description}
          tutorials={whatsNewTutorials}
          tutorialLanguages={tutorialLanguages}
          showFooter
          className="whats-new-section pb-20"
          translate={translate}
        />
      )}

      {/* Get Started */}
      {getStartedTutorials.length > 0 && (
        <TutorialSectionBlock
          id={getStartedConfig.id}
          title={getStartedConfig.title}
          description={getStartedConfig.description}
          tutorials={getStartedTutorials}
          tutorialLanguages={tutorialLanguages}
          showFooter
          className="pb-20"
          translate={translate}
        />
      )}

      {/* Other Tutorials */}
      {sections.map((section) => (
        <TutorialSectionBlock
          key={section.id}
          id={section.id}
          title={section.title}
          description={section.description}
          tutorials={section.tutorials}
          tutorialLanguages={tutorialLanguages}
          maxTutorials={MAX_TUTORIALS_PER_SECTION}
          className="category-section"
          translate={translate}
        />
      ))}
    </main>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Look up a section's config by id */
function getSectionConfig(id: string) {
  return sectionConfig.find((s) => s.id === id)!
}

/** Type guard for external community contributions */
function isExternalContribution(entry: PinnedTutorial): entry is PinnedExternalTutorial {
  return typeof entry !== "string" && "github" in entry
}

/** Get path from pinned tutorial entry*/
function getPinnedPath(entry: PinnedTutorial): string {
  return typeof entry === "string" ? entry : isExternalContribution(entry) ? entry.github : entry.path
}

/** Convert tutorial metadata to the common Tutorial type */
function toTutorial(t: TutorialMetadataItem, descriptionOverride?: string): Tutorial {
  return {
    title: t.title,
    description: descriptionOverride || t.description,
    path: t.path,
  }
}

/** Build Tutorial objects from pinned entries, resolving metadata for internal paths */
function buildPinnedTutorials(entries: PinnedTutorial[], allTutorials: TutorialMetadataItem[]): Tutorial[] {
  return entries
    .map((entry): Tutorial | null => {
      if (isExternalContribution(entry)) {
        return {
          title: entry.title,
          description: entry.description,
          path: entry.url || entry.github,
          author: entry.author,
          github: entry.github,
          externalUrl: entry.url,
        }
      }
      const path = getPinnedPath(entry)
      const descOverride = typeof entry === "string" ? undefined : entry.description
      const metadata = allTutorials.find((t) => t.path === path)
      return metadata ? toTutorial(metadata, descOverride) : null
    })
    .filter((t): t is Tutorial => t !== null)
}
