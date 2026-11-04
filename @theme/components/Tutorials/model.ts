// Data model for the tutorials landing page. Pure TypeScript with no React or
// Node imports, so both the page component and the Markdown rendering for AI
// readers in forLlms.ts can share it.
import { sectionConfig, type PinnedExternalTutorial, type PinnedTutorial } from "docs/tutorials/sections.config"

// ── Types ───────────────────────────────────────────────────────────────────

/** A tutorial page on this site, as collected by the tutorial-metadata plugin */
export interface InternalTutorial {
  path: string
  title: string
  description: string
  lastModified: string
  category: string
  /** Topic labels from the page's frontmatter, matched by the search box */
  labels: string[]
  /** Language keys the page has code for, see LANGUAGES */
  languages: string[]
}

export interface SidebarCategory {
  id: string
  title: string
}

/** Translated title and description per locale, keyed by the English URL path */
export type TutorialTranslations = Record<string, Record<string, { title: string; description: string }>>

/** Shared data from the tutorial-metadata plugin, also written to @theme/data/tutorials-metadata.json */
export interface TutorialMetadata {
  tutorials: InternalTutorial[]
  categories: SidebarCategory[]
  translations: TutorialTranslations
}

export type ExternalTutorial = PinnedExternalTutorial

export interface TutorialSection {
  id: string
  title: string
  description: string
  tutorials: InternalTutorial[]
  community?: ExternalTutorial[]
  communityDescription?: string
}

export interface Language {
  key: string
  label: string
  icon: string
}

// ── Constants ───────────────────────────────────────────────────────────────

export const PAGE_TITLE = "Crypto Wallet and Blockchain Development Tutorials"
export const PAGE_DESCRIPTION =
  "Learn how to get started building on the XRP Ledger with these helpful crypto wallet and blockchain tutorials for developers."

const MAX_WHATS_NEW = 3
// Topics with more than COLLAPSE_THRESHOLD tutorials start collapsed to MAX_PER_TOPIC.
// The grid has three columns. Up to nine cards (three rows) show in full;
// collapsing nine to six would hide one row behind a click.
export const MAX_PER_TOPIC = 6
export const COLLAPSE_THRESHOLD = 9
// Mirrors seo.siteUrl in redocly.yaml. Used for the absolute URLs in JSON-LD and
// the LLM Markdown, neither of which has access to the site config at render time.
export const SITE_URL = "https://xrpl.org"
const DEFAULT_LOCALE = "en-US"
export const DIRECTORY_ID = "all-tutorials"

// Language keys come from the tutorial-metadata plugin, which detects them
// from each tutorial's code tabs, snippets, filename, or title.
export const LANGUAGES: Language[] = [
  { key: "javascript", label: "JavaScript", icon: "/img/logos/black/js.svg" },
  { key: "typescript", label: "TypeScript", icon: "/img/logos/black/typescript.svg" },
  { key: "python", label: "Python", icon: "/img/logos/black/python.svg" },
  { key: "go", label: "Go", icon: "/img/logos/black/go.svg" },
  { key: "java", label: "Java", icon: "/img/logos/black/java.svg" },
  { key: "php", label: "PHP", icon: "/img/logos/black/php.svg" },
  { key: "http", label: "HTTP and WebSocket", icon: "/img/logos/black/globe.svg" },
]
export const LANGUAGE_BY_KEY = new Map(LANGUAGES.map((lang) => [lang.key, lang]))
// Shown on a card when no language was detected.
export const XRPL_MARK: Language = { key: "xrpl", label: "XRP Ledger", icon: "/img/logos/black/xrp-mark.svg" }
// Dropdown value for the catch-all "Other": tutorials with no code in a
// particular language, such as API usage guidance, plus community sample apps,
// which carry no language data.
export const OTHER_LANGUAGES = "other"
export const WHATS_NEW = sectionConfig["whats-new"]
export const WHATS_NEW_TITLE = WHATS_NEW?.title ?? "What's New"

// ── Page copy ───────────────────────────────────────────────────────────────
// Every heading, sentence and link that is not tutorial data lives here, so
// the React page and the LLM Markdown render the same content. Edit copy here,
// not in the renderers.

export const NETWORKS = [
  { id: "mainnet", name: "Mainnet", ws: "wss://xrplcluster.com", rpc: "https://xrplcluster.com" },
  { id: "testnet", name: "Testnet", ws: "wss://s.altnet.rippletest.net:51233", rpc: "https://s.altnet.rippletest.net:51234" },
]
export const NETWORK_PANEL = {
  title: "Public Servers",
  allServers: { label: "View all servers", href: "/docs/tutorials/public-servers/" },
  faucet: { label: "Get Test XRP", href: "/resources/dev-tools/xrp-faucets/" },
}
export const DIRECTORY_TITLE = "All tutorials"
export const COMMUNITY_TAB = "Community"
export const KEEP_BUILDING = {
  title: "Keep building",
  description: "The source behind every tutorial, tooling for AI assistants, and how to add a tutorial of your own.",
  // Each card's text is copied from the linked page's seo.description, so keep them in step.
  cards: [
    {
      title: "Code samples",
      description: "Browse sample code for building common use cases on the XRP Ledger.",
      cta: "Browse Code Samples",
      href: "/resources/code-samples/",
    },
    {
      title: "Use the docs with AI",
      description: "Accelerate development on the XRPL with AI tools.",
      cta: "Set Up AI Tools",
      href: "/resources/dev-tools/ai-tools/",
    },
    {
      title: "Write a tutorial",
      description: "Contribution guides for XRP Ledger documentation.",
      cta: "Read the Contribution Guide",
      href: "/resources/contribute-documentation/",
    },
  ],
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function getPinnedPath(entry: PinnedTutorial): string {
  return typeof entry === "string" ? entry : entry.path
}

/** Resolve pinned entries to tutorials by path, applying any description override */
function buildPinnedTutorials(entries: PinnedTutorial[], allTutorials: InternalTutorial[]): InternalTutorial[] {
  return entries.flatMap((entry) => {
    const tutorial = allTutorials.find((t) => t.path === getPinnedPath(entry))
    if (!tutorial) return []
    const description = typeof entry === "string" ? undefined : entry.description
    return [description ? { ...tutorial, description } : tutorial]
  })
}

/** Build topic sections ordered by sectionConfig, with new sidebar categories appended */
function buildSections(sidebarCategories: SidebarCategory[], allTutorials: InternalTutorial[]): TutorialSection[] {
  const specialIds = new Set(["whats-new"])
  const sidebarMap = new Map(sidebarCategories.map((category) => [category.id, category]))
  // A tutorial pinned in any topic is not repeated in its own sidebar topic
  const allPinnedPaths = new Set(
    Object.values(sectionConfig).flatMap((config) => (config.pinned || []).map(getPinnedPath)),
  )

  const configIds = Object.keys(sectionConfig).filter((id) => !specialIds.has(id))
  const newIds = sidebarCategories
    .filter((category) => !specialIds.has(category.id) && !sectionConfig[category.id])
    .map((category) => category.id)

  // Config order first, then sidebar groups the config does not mention;
  // a topic is dropped only if the sidebar no longer has it
  return [...configIds, ...newIds]
    .filter((id) => sidebarMap.has(id))
    .map((id) => {
      const config = sectionConfig[id]
      const pinned = buildPinnedTutorials(config?.pinned || [], allTutorials)
      const remaining = allTutorials.filter((t) => t.category === id && !allPinnedPaths.has(t.path))
      const community = config?.community?.items ?? []
      return {
        id,
        title: config?.title || sidebarMap.get(id)!.title,
        description: config?.description || "",
        tutorials: [...pinned, ...remaining],
        community: community.length > 0 ? community : undefined,
        communityDescription: config?.community?.description,
      }
    })
    .filter((section) => section.tutorials.length > 0 || (section.community && section.community.length > 0))
}

/** What's New: newest tutorials by last change (the plugin sorts newest first), excluding the Get Started set */
function buildWhatsNew(allTutorials: InternalTutorial[]): InternalTutorial[] {
  const getStartedPaths = new Set((sectionConfig["get-started"]?.pinned || []).map(getPinnedPath))
  return allTutorials.filter((tutorial) => !getStartedPaths.has(tutorial.path)).slice(0, MAX_WHATS_NEW)
}

/** "" for the default locale, "/ja" for Japanese */
function localePrefix(locale: string | undefined): string {
  return !locale || locale === DEFAULT_LOCALE ? "" : `/${locale.toLowerCase()}`
}

/** Use a locale's translated title and description wherever a translated page exists */
function localizeTutorials(
  tutorials: InternalTutorial[],
  translations: TutorialTranslations | undefined,
  locale: string | undefined,
): InternalTutorial[] {
  const map = locale ? translations?.[locale] : undefined
  if (!map) return tutorials
  return tutorials.map((t) =>
    map[t.path] ? { ...t, title: map[t.path].title, description: map[t.path].description || t.description } : t,
  )
}

export interface TutorialsLanding {
  /**
   * URL prefix for the locale, "" for English. Realm's Link localizes internal
   * paths itself; this is only for absolute URLs built by hand (JSON-LD, the
   * LLM Markdown).
   */
  prefix: string
  sections: TutorialSection[]
  whatsNew: InternalTutorial[]
}

/**
 * Everything the page shows for one locale: translated titles where a translated
 * page exists, topics in config order, and the What's New row. Shared by the
 * React page and the LLM Markdown renderer.
 */
export function buildLanding(metadata: TutorialMetadata | undefined, locale: string | undefined): TutorialsLanding {
  const prefix = localePrefix(locale)
  const tutorials = localizeTutorials(metadata?.tutorials ?? [], metadata?.translations, locale)
  const sections = buildSections(metadata?.categories ?? [], tutorials)
  return { prefix, sections, whatsNew: buildWhatsNew(tutorials) }
}

/** Every whitespace-separated term of the query appears somewhere in the text */
function matchesQuery(text: string, query: string): boolean {
  if (!query) return true
  const haystack = text.toLowerCase()
  return query.toLowerCase().split(/\s+/).filter(Boolean).every((term) => haystack.includes(term))
}

export function matchesFilters(tutorial: InternalTutorial, query: string, language: string | null): boolean {
  if (language === OTHER_LANGUAGES) {
    if (tutorial.languages.length > 0) return false
  } else if (language && !tutorial.languages.includes(language)) {
    return false
  }
  return matchesQuery([tutorial.title, tutorial.description, ...tutorial.labels].join(" "), query)
}

/**
 * Community apps carry no language data, so they match no specific language.
 * They show with no filter and under "Other"; search still applies.
 */
export function matchesCommunityFilters(tutorial: ExternalTutorial, query: string, language: string | null): boolean {
  if (language && language !== OTHER_LANGUAGES) return false
  return matchesQuery(`${tutorial.title} ${tutorial.description}`, query)
}

/** Date label with a fixed locale and timezone, so server and browser render the same text and hydration does not mismatch */
export function formatDate(iso: string | undefined): { label: string; dateTime: string } | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  const label = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
  return { label, dateTime: date.toISOString().slice(0, 10) }
}

/** Languages to show for a tutorial, or the XRP Ledger logo when none was detected */
export function shownLanguages(languages: string[]): Language[] {
  const known = languages
    .map((key) => LANGUAGE_BY_KEY.get(key))
    .filter((lang): lang is Language => lang !== undefined)
  return known.length > 0 ? known : [XRPL_MARK]
}

export function languageLabels(languages: string[]): string[] {
  return shownLanguages(languages).map((lang) => lang.label)
}
