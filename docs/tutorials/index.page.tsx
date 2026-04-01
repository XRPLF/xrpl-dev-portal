import { useThemeHooks } from "@redocly/theme/core/hooks"
import { Link } from "@redocly/theme/components/Link/Link"
import { useState } from "react"

// Maximum number of tutorials to display per section
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

// Type for the tutorial languages map from the plugin
type TutorialLanguagesMap = Record<string, string[]>

// Type for tutorial metadata from the plugin
interface TutorialMetadataItem {
  path: string
  title: string
  description: string
  lastModified: string
  category: string
}

interface TutorialMetadata {
  tutorials: TutorialMetadataItem[]
}

interface Tutorial {
  title: string
  body?: string
  path: string
}

interface TutorialSection {
  id: string
  title: string
  description: string
  tutorials: Tutorial[]
}

// Section configuration - defines display order, titles, and descriptions.
// Tutorials are auto-populated from the plugin based on their file path category.
const sectionConfig: { id: string; title: string; description: string }[] = [
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
    id: "sample-apps",
    title: "Sample Apps",
    description: "Build complete, end-to-end applications like wallets and credential services.",
  },
]

// Pinned tutorial entry - can be just a path string, or an object with description override.
type PinnedTutorial = string | { path: string; description?: string }

// Pinned tutorials - these always appear in their designated sections.
// New tutorials appear in "What's New" automatically.
// Use an object with `description` to override the frontmatter description.
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
  ],
  payments: [
    "/docs/tutorials/payments/send-xrp/",
    "/docs/tutorials/tokens/mpts/sending-mpts-in-javascript/",
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
  ]
}

// Helper to get path from pinned tutorial entry
const getPinnedPath = (entry: PinnedTutorial): string =>
  typeof entry === "string" ? entry : entry.path

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
  // Get icons from auto-detected languages, fallback to XRPL icon
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
        {tutorial.body && <p className="card-text">{translate(tutorial.body)}</p>}
      </div>
      {showFooter && <div className="card-footer"></div>}
    </Link>
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
  const displayTutorials = maxTutorials ? tutorials.slice(0, maxTutorials) : tutorials

  return (
    <section className={`container-new pt-10 pb-14 ${className}`.trim()} id={id}>
      <div className="col-12 col-xl-8 p-0">
        <h3 className="h4 mb-3">{translate(title)}</h3>
        <p className="mb-4">{translate(description)}</p>
      </div>
      <div className="row tutorial-cards">
        {displayTutorials.map((tutorial, idx) => (
          <div key={idx} className="col-lg-4 col-md-6 mb-5">
            <TutorialCard
              tutorial={tutorial}
              detectedLanguages={tutorialLanguages[tutorial.path]}
              showFooter={showFooter}
              translate={translate}
            />
          </div>
        ))}
      </div>
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

export default function TutorialsIndex() {
  const { useTranslate, usePageSharedData } = useThemeHooks()
  const { translate } = useTranslate()

  // Get auto-detected languages from the plugin (maps tutorial paths to language arrays).
  const tutorialLanguages = usePageSharedData<TutorialLanguagesMap>("tutorial-languages") || {}

  // Get tutorial metadata from the tutorial-metadata plugin.
  const tutorialMetadata = usePageSharedData<TutorialMetadata>("tutorial-metadata")
  const allTutorials = tutorialMetadata?.tutorials || []

  // Helper to convert tutorial metadata to Tutorial type.
  const toTutorial = (
    t: TutorialMetadataItem,
    descriptionOverride?: string
  ): Tutorial => ({
    title: t.title,
    body: descriptionOverride || t.description,
    path: t.path,
  })

  // Helper to build tutorials from pinned entries.
  const buildPinnedTutorials = (entries: PinnedTutorial[]): Tutorial[] =>
    entries
      .map((entry) => {
        const path = getPinnedPath(entry)
        const descOverride = typeof entry === "string" ? undefined : entry.description
        const metadata = allTutorials.find((t) => t.path === path)
        return metadata ? toTutorial(metadata, descOverride) : null
      })
      .filter((t): t is Tutorial => t !== null)

  // Collect ALL pinned paths across all sections (to avoid duplicates in auto-population).
  const allPinnedPaths = new Set(
    Object.values(pinnedTutorials).flat().map(getPinnedPath)
  )

  // Build sections: pinned tutorials first, then auto-populated from category.
  const sections: TutorialSection[] = sectionConfig.map((config) => {
    const pinnedTutorialSection = buildPinnedTutorials(pinnedTutorials[config.id] || [])

    // Auto-populate remaining tutorials from this category.
    // Excludes tutorials pinned anywhere (not just this section) to avoid duplicates.
    // Sorted by lastModified (most recent first).
    const autoTutorials = allTutorials
      .filter((t) => t.category === config.id && !allPinnedPaths.has(t.path))
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
      .map((t) => toTutorial(t))

    return {
      ...config,
      tutorials: [...pinnedTutorialSection, ...autoTutorials],
    }
  }).filter((section) => section.tutorials.length > 0)

  // Build Get Started tutorials from pinned config.
  const getStartedPinnedEntries = pinnedTutorials["get-started"] || []
  const getStartedTutorials = buildPinnedTutorials(getStartedPinnedEntries)

  // Get Started paths to exclude from "What's New".
  const getStartedPaths = new Set(getStartedPinnedEntries.map(getPinnedPath))

  // Get recent tutorials for "What's New" section.
  // Shows the most recently modified tutorials (excluding only Get Started).
  // Pinned tutorials in other sections CAN appear here if recently updated.
  const whatsNewTutorials: Tutorial[] = allTutorials
    .filter((t) => !getStartedPaths.has(t.path))
    .slice(0, MAX_WHATS_NEW)
    .map((t) => toTutorial(t))

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
                  <li><a href="#whats-new">{translate("What's New")}</a></li>
                )}
                {getStartedTutorials.length > 0 && (
                  <li><a href="#get-started">{translate("Get Started with SDKs")}</a></li>
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
          id="whats-new"
          title="What's New"
          description="Recently added/updated tutorials to help you build on the XRP Ledger."
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
          id="get-started"
          title="Get Started with SDKs"
          description="These tutorials walk you through the basics of building a very simple XRP Ledger-connected application using your favorite programming language."
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
          translate={translate}
        />
      ))}
    </main>
  )
}
