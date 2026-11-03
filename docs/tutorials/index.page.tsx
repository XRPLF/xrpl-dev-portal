import { useThemeHooks } from "@redocly/theme/core/hooks"
import { Link as RouteLink } from "@redocly/theme/components/Link/Link"
import { useEffect, useId, useMemo, useRef, useState } from "react"
import type { TOptions } from "i18next"
import clsx from "clsx"
import { PageWrapper } from "shared/components/PageWrapper"
import { PageGrid } from "shared/components/PageGrid/page-grid"
import Button from "shared/components/Button"
import { Link } from "shared/components/Link"
import { ButtonGroup } from "shared/patterns/ButtonGroup/ButtonGroup"
import { SectionHeader } from "shared/patterns/SectionHeader"
import { StandardCardGroupSection } from "shared/sections/StandardCardGroupSection/StandardCardGroupSection"
import {
  MaterialKeyboardArrowDownIcon,
  MaterialKeyboardArrowUpIcon,
  XrplArrowExternalLinkIcon,
  XrplArrowInternalLinkIcon,
} from "shared/components/Icons"
import CopyableUrl from "../../@theme/components/CopyableUrl"
import {
  PinnedExternalTutorial,
  PinnedTutorial,
  sectionConfig,
} from "./sections.config"

// ── Types ───────────────────────────────────────────────────────────────────

type TutorialLanguagesMap = Record<string, string[]>

interface TutorialMetadataItem {
  path: string
  title: string
  description: string
  lastModified: string
  category: string
  labels?: string[]
}

interface InternalTutorial {
  title: string
  description?: string
  path: string
  lastModified?: string
  labels: string[]
  languages: string[]
}

type ExternalTutorial = PinnedExternalTutorial

interface TutorialSection {
  id: string
  title: string
  description: string
  tutorials: InternalTutorial[]
  community?: ExternalTutorial[]
  communityDescription?: string
}

type Translate = (text: string, options?: TOptions) => string

interface Language {
  key: string
  label: string
  icon: string
}

// ── Constants ───────────────────────────────────────────────────────────────

const MAX_WHATS_NEW = 3
// Topics with more than COLLAPSE_THRESHOLD tutorials start collapsed to MAX_PER_TOPIC.
// Anything up to three full rows is shown in full; "Show all 7" after six is not worth a click.
const MAX_PER_TOPIC = 6
const COLLAPSE_THRESHOLD = 9
const SITE_URL = "https://xrpl.org"
const DIRECTORY_ID = "all-tutorials"

export const frontmatter = {
  seo: {
    title: "Tutorials",
    description:
      "Learn how to get started building on the XRP Ledger with these helpful crypto wallet and blockchain tutorials for developers.",
  },
}

// Language keys come from the tutorial-languages plugin, which detects them
// from each tutorial's code tabs, snippets, filename, or title.
const LANGUAGES: Language[] = [
  { key: "javascript", label: "JavaScript", icon: "/img/logos/black/js.svg" },
  { key: "typescript", label: "TypeScript", icon: "/img/logos/black/typescript.svg" },
  { key: "python", label: "Python", icon: "/img/logos/black/python.svg" },
  { key: "go", label: "Go", icon: "/img/logos/black/go.svg" },
  { key: "java", label: "Java", icon: "/img/logos/black/java.svg" },
  { key: "php", label: "PHP", icon: "/img/logos/black/php.svg" },
  { key: "http", label: "HTTP and WebSocket", icon: "/img/logos/black/globe.svg" },
]
const LANGUAGE_BY_KEY = new Map(LANGUAGES.map((lang) => [lang.key, lang]))
// Shown on a card when no language was detected, as the original page did.
const XRPL_MARK: Language = { key: "xrpl", label: "XRP Ledger", icon: "/img/logos/black/xrp-mark.svg" }
// Dropdown value that selects those tutorials: the ones with no code in a
// particular language, such as API usage guidance.
const NO_LANGUAGE = "none"
const WHATS_NEW = sectionConfig["whats-new"]

const NETWORKS = [
  { id: "mainnet", name: "Mainnet", ws: "wss://xrplcluster.com", rpc: "https://xrplcluster.com" },
  { id: "testnet", name: "Testnet", ws: "wss://s.altnet.rippletest.net:51233", rpc: "https://s.altnet.rippletest.net:51234" },
]

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Get the internal route path from a pinned entry */
function getPinnedPath(entry: PinnedTutorial): string {
  return typeof entry === "string" ? entry : entry.path
}

/** Convert tutorial metadata to an InternalTutorial */
function toInternalTutorial(
  t: TutorialMetadataItem,
  languages: TutorialLanguagesMap,
  descriptionOverride?: string,
): InternalTutorial {
  return {
    title: t.title,
    description: descriptionOverride || t.description,
    path: t.path,
    lastModified: t.lastModified,
    labels: t.labels ?? [],
    languages: languages[t.path] ?? [],
  }
}

/** Build InternalTutorial objects from pinned entries, resolving metadata by path */
function buildPinnedTutorials(
  entries: PinnedTutorial[],
  allTutorials: TutorialMetadataItem[],
  languages: TutorialLanguagesMap,
): InternalTutorial[] {
  return entries
    .map((entry): InternalTutorial | null => {
      const path = getPinnedPath(entry)
      const descOverride = typeof entry === "string" ? undefined : entry.description
      const metadata = allTutorials.find((t) => t.path === path)
      return metadata ? toInternalTutorial(metadata, languages, descOverride) : null
    })
    .filter((t): t is InternalTutorial => t !== null)
}

/** Build topic sections ordered by sectionConfig, with new sidebar categories appended */
function buildSections(
  sidebarCategories: { id: string; title: string }[],
  allTutorials: TutorialMetadataItem[],
  languages: TutorialLanguagesMap,
): TutorialSection[] {
  const specialIds = new Set(["whats-new"])
  const sidebarMap = new Map(sidebarCategories.map((category) => [category.id, category]))
  const allPinnedPaths = new Set(
    Object.values(sectionConfig).flatMap((config) => (config.pinned || []).map(getPinnedPath)),
  )

  const configIds = Object.keys(sectionConfig).filter((id) => !specialIds.has(id))
  const newIds = sidebarCategories
    .filter((category) => !specialIds.has(category.id) && !sectionConfig[category.id])
    .map((category) => category.id)

  return [...configIds, ...newIds]
    .filter((id) => sidebarMap.has(id))
    .map((id) => {
      const config = sectionConfig[id]
      const pinned = buildPinnedTutorials(config?.pinned || [], allTutorials, languages)
      const remaining = allTutorials
        .filter((t) => t.category === id && !allPinnedPaths.has(t.path))
        .map((t) => toInternalTutorial(t, languages))
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

/** Every whitespace-separated term of the query appears somewhere in the text */
function matchesQuery(text: string, query: string): boolean {
  if (!query) return true
  const haystack = text.toLowerCase()
  return query.toLowerCase().split(/\s+/).filter(Boolean).every((term) => haystack.includes(term))
}

/** Does the tutorial match the active search and language filter? */
function matchesFilters(tutorial: InternalTutorial, query: string, language: string | null): boolean {
  if (language === NO_LANGUAGE) {
    if (tutorial.languages.length > 0) return false
  } else if (language && !tutorial.languages.includes(language)) {
    return false
  }
  return matchesQuery([tutorial.title, tutorial.description ?? "", ...tutorial.labels].join(" "), query)
}

/** Community items carry no language metadata, so a language filter hides them; search still applies. */
function matchesCommunityFilters(tutorial: ExternalTutorial, query: string, language: string | null): boolean {
  if (language) return false
  return matchesQuery(`${tutorial.title} ${tutorial.description}`, query)
}

/** Stable, locale-independent date label so server and client markup agree */
function formatDate(iso: string | undefined): { label: string; dateTime: string } | null {
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

// ── Components ──────────────────────────────────────────────────────────────

function LanguageIcons({ languages, translate }: { languages: string[]; translate: Translate }) {
  const known = languages
    .map((key) => LANGUAGE_BY_KEY.get(key))
    .filter((lang): lang is Language => lang !== undefined)
  const shown = known.length > 0 ? known : [XRPL_MARK]
  const names = shown.map((lang) => translate(lang.label)).join(", ")
  return (
    <span className="tutorial-card__langs" role="img" aria-label={`${translate("Languages")}: ${names}`}>
      {shown.map((lang) => (
        <img key={lang.key} src={lang.icon} alt="" width={24} height={24} loading="lazy" decoding="async" />
      ))}
    </span>
  )
}

function TutorialCard({
  tutorial,
  headingAs: Heading,
  showDate = false,
  variant = "neutral",
  translate,
}: {
  tutorial: InternalTutorial
  headingAs: "h3" | "h4"
  showDate?: boolean
  variant?: "neutral" | "green"
  translate: Translate
}) {
  const date = showDate ? formatDate(tutorial.lastModified) : null

  return (
    <RouteLink to={tutorial.path} className={clsx("tutorial-card", variant === "green" && "tutorial-card--green")}>
      <span className="tutorial-card__overlay" aria-hidden="true" />
      <div className="tutorial-card__top">
        <LanguageIcons languages={tutorial.languages} translate={translate} />
      </div>
      <div className="tutorial-card__body">
        <Heading className="tutorial-card__title sh-sm-r">{translate(tutorial.title)}</Heading>
        {tutorial.description && (
          <p className="tutorial-card__desc label-l">{translate(tutorial.description)}</p>
        )}
      </div>
      <div className="tutorial-card__foot">
        {date ? (
          <time className="tutorial-card__date label-r" dateTime={date.dateTime}>
            {translate("Updated {{date}}", { date: date.label })}
          </time>
        ) : (
          <span />
        )}
        <span className="tutorial-card__arrow" aria-hidden="true">
          <XrplArrowInternalLinkIcon />
        </span>
      </div>
    </RouteLink>
  )
}

/** Initials for the avatar fallback: "Aaditya-T" -> "A", "Max Mustermann" -> "MM" */
function initialsOf(name: string): string {
  return name
    .split(/[\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

function avatarFor(author: ExternalTutorial["author"]): string | null {
  const match = /^https:\/\/github\.com\/([A-Za-z0-9-]+)\/?$/.exec(author.url)
  return match ? `https://github.com/${match[1]}.png?size=56` : null
}

/**
 * Community cards lead with the person who built the app where official cards
 * lead with the language. The card is one tile: the title link is stretched
 * over it (the demo, or the repo when there is no demo); the author and
 * GitHub links sit above that layer and stay separately clickable.
 */
function CommunityCard({ tutorial, translate }: { tutorial: ExternalTutorial; translate: Translate }) {
  const [avatarFailed, setAvatarFailed] = useState(false)
  const avatar = avatarFor(tutorial.author)
  const primaryUrl = tutorial.url ?? tutorial.github
  return (
    <li>
      <article className="tutorial-card tutorial-card--community">
        <span className="tutorial-card__overlay" aria-hidden="true" />
        <div className="tutorial-card__top">
          <a
            href={tutorial.author.url}
            target="_blank"
            rel="noopener noreferrer"
            className="tutorial-card__author label-r"
          >
            <span className="tutorial-card__avatar" aria-hidden="true">
              <span>{initialsOf(tutorial.author.name)}</span>
              {avatar && !avatarFailed && (
                <img src={avatar} alt="" width={28} height={28} loading="lazy" onError={() => setAvatarFailed(true)} />
              )}
            </span>
            <span>{tutorial.author.name}</span>
          </a>
          {tutorial.url && (
            <span className="tutorial-card__source">
              <Link href={tutorial.github} intention="neutral" variation="standalone" size="sm" iconEnd target="_blank" rel="noopener noreferrer">
                {translate("GitHub Source")}
              </Link>
            </span>
          )}
        </div>
        <div className="tutorial-card__body">
          <h4 className="tutorial-card__title sh-sm-r">
            <a href={primaryUrl} target="_blank" rel="noopener noreferrer" className="tutorial-card__link">
              {translate(tutorial.title)}
              <span className="visually-hidden">, {translate("opens in a new tab")}</span>
            </a>
          </h4>
          <p className="tutorial-card__desc label-l">{translate(tutorial.description)}</p>
        </div>
        <div className="tutorial-card__foot">
          <span className="tutorial-card__date label-r">
            {translate(tutorial.url ? "Live demo" : "Source on GitHub")}
          </span>
          <span className="tutorial-card__arrow" aria-hidden="true">
            <XrplArrowExternalLinkIcon />
          </span>
        </div>
      </article>
    </li>
  )
}

function NetworkPanel({ translate }: { translate: Translate }) {
  const headingId = useId()
  return (
    <aside className="tutorials-network" aria-labelledby={headingId}>
      <h2 id={headingId} className="tutorials-network__label label-r">{translate("Public Servers")}</h2>
      <dl className="tutorials-network__list">
        {NETWORKS.map((network) => (
          <div className="tutorials-network__group" key={network.id}>
            <dt className="tutorials-network__net label-r">{translate(network.name)}</dt>
            <dd className="tutorials-network__urls">
              <span className="tutorials-network__proto">{translate("WebSocket")}</span>
              <CopyableUrl url={network.ws} translate={translate} />
              <span className="tutorials-network__proto">{translate("JSON-RPC")}</span>
              <CopyableUrl url={network.rpc} translate={translate} />
            </dd>
          </div>
        ))}
      </dl>
      <div>
        <Link href="/docs/tutorials/public-servers/" intention="neutral" variation="standalone" size="sm" iconEnd>
          {translate("View all servers")}
        </Link>
      </div>
      <div className="tutorials-network__faucet">
        <Link href="/resources/dev-tools/xrp-faucets/" intention="brand" variation="standalone" iconEnd>
          {translate("Get Test XRP")}
        </Link>
      </div>
    </aside>
  )
}

function TopicSection({
  section,
  visible,
  visibleCommunity,
  filtering,
  translate,
}: {
  section: TutorialSection
  visible: InternalTutorial[]
  visibleCommunity: ExternalTutorial[]
  filtering: boolean
  translate: Translate
}) {
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<"official" | "community">("official")
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const headingId = `${section.id}-heading`
  const hasTabs = section.community !== undefined && section.community.length > 0
  // If the filter empties the active tab but not the other one, show the other
  // one. `activeTab` keeps the user's choice, so the view returns to it once the
  // filter changes; clicking the empty tab is a no-op while it stays empty.
  const tab: "official" | "community" =
    hasTabs && activeTab === "official" && visible.length === 0 && visibleCommunity.length > 0
      ? "community"
      : hasTabs && activeTab === "community" && visibleCommunity.length === 0 && visible.length > 0
        ? "official"
        : activeTab
  const showingCommunity = hasTabs && tab === "community"
  const collapsible = !filtering && !showingCommunity && visible.length > COLLAPSE_THRESHOLD
  const capped = collapsible && !expanded
  const panelId = `${section.id}-panel`
  const listId = `${section.id}-list`
  const note = showingCommunity ? section.communityDescription : section.description

  // Collapsing from the bottom of a long topic would leave the reader far below
  // it, so bring the heading back into view first, as the original page did.
  const toggleExpanded = () => {
    const next = !expanded
    setExpanded(next)
    if (!next && sectionRef.current && sectionRef.current.getBoundingClientRect().top < 0) {
      sectionRef.current.scrollIntoView()
    }
  }
  const tabs: { key: "official" | "community"; label: string; count: number }[] = [
    { key: "official", label: "xrpl.org", count: visible.length },
    { key: "community", label: translate("Community"), count: visibleCommunity.length },
  ]

  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    event.preventDefault()
    const next = (index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length
    setActiveTab(tabs[next].key)
    tabRefs.current[next]?.focus()
  }

  return (
    <section ref={sectionRef} className="tutorials-topic" id={section.id} aria-labelledby={headingId}>
      <div className="tutorials-topic__header">
        <h3 id={headingId} className="h-sm">{translate(section.title)}</h3>
        {section.description && !hasTabs && <p className="body-l">{translate(section.description)}</p>}
      </div>
      {hasTabs && (
        <div className="tutorials-tabs" role="tablist" aria-label={translate(section.title)}>
          {tabs.map((item, index) => (
            <button
              key={item.key}
              ref={(el) => { tabRefs.current[index] = el }}
              type="button"
              role="tab"
              id={`${section.id}-tab-${item.key}`}
              aria-selected={tab === item.key}
              aria-controls={panelId}
              tabIndex={tab === item.key ? 0 : -1}
              className={clsx("tutorials-tab label-r", tab === item.key && "is-active")}
              onClick={() => setActiveTab(item.key)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              {item.label}
              <span className="tutorials-tab__count">{item.count}</span>
            </button>
          ))}
        </div>
      )}
      {hasTabs && note && <p className="tutorials-topic__note label-l">{translate(note)}</p>}
      <div
        id={hasTabs ? panelId : undefined}
        role={hasTabs ? "tabpanel" : undefined}
        aria-labelledby={hasTabs ? `${section.id}-tab-${tab}` : undefined}
      >
        {showingCommunity ? (
          <ul className="tutorials-grid">
            {visibleCommunity.map((tutorial, index) => (
              <CommunityCard key={`${index}-${tutorial.github}`} tutorial={tutorial} translate={translate} />
            ))}
          </ul>
        ) : (
          <ul className="tutorials-grid" id={listId}>
            {visible.map((tutorial, index) => (
              <li key={tutorial.path} hidden={capped && index >= MAX_PER_TOPIC}>
                <TutorialCard tutorial={tutorial} headingAs="h4" translate={translate} />
              </li>
            ))}
          </ul>
        )}
      </div>
      {collapsible && (
        <div className="tutorials-topic__more">
          <Button
            type="button"
            intention="neutral"
            emphasis="standard"
            aria-expanded={expanded}
            aria-controls={listId}
            iconEnd={expanded ? <MaterialKeyboardArrowUpIcon /> : <MaterialKeyboardArrowDownIcon />}
            onClick={toggleExpanded}
          >
            {expanded ? translate("Show Less") : translate("Show All {{count}}", { count: visible.length })}
          </Button>
        </div>
      )}
    </section>
  )
}

/**
 * Language filter as a dropdown in the site's own style: the trigger is the
 * navbar language pill, the list reuses the navbar's .bds-lang-dropdown menu.
 */
function LanguageMenu({
  value,
  onChange,
  translate,
}: {
  value: string | null
  onChange: (value: string | null) => void
  translate: Translate
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const menuId = useId()
  const options: { key: string | null; label: string }[] = [
    { key: null, label: translate("All languages") },
    ...LANGUAGES.map((lang) => ({ key: lang.key, label: translate(lang.label) })),
    { key: NO_LANGUAGE, label: translate("No specific language") },
  ]
  const selectedIndex = Math.max(0, options.findIndex((option) => option.key === value))

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (open) itemRefs.current[selectedIndex]?.focus()
  }, [open, selectedIndex])

  const choose = (key: string | null) => {
    onChange(key)
    setOpen(false)
    buttonRef.current?.focus()
  }

  const onButtonKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      setOpen(true)
    }
  }

  const onItemKeyDown = (event: React.KeyboardEvent, index: number) => {
    let next: number | null = null
    if (event.key === "ArrowDown") next = (index + 1) % options.length
    else if (event.key === "ArrowUp") next = (index + options.length - 1) % options.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = options.length - 1
    else if (event.key === "Tab") {
      // Close and continue tabbing from the trigger, so focus has a known home
      // once the focused option is removed from the DOM.
      buttonRef.current?.focus()
      setOpen(false)
    }
    if (next === null) return
    event.preventDefault()
    itemRefs.current[next]?.focus()
  }

  return (
    <div className="tutorials-select" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={clsx("tutorials-select__button label-r", open && "is-open")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((state) => !state)}
        onKeyDown={onButtonKeyDown}
      >
        <span className="visually-hidden">{translate("Filter by language")}: </span>
        {options[selectedIndex].label}
        <MaterialKeyboardArrowDownIcon className="tutorials-select__icon" aria-hidden="true" />
      </button>
      {open && (
        <div
          id={menuId}
          className="bds-lang-dropdown tutorials-select__menu"
          role="listbox"
          aria-label={translate("Filter by language")}
        >
          {options.map((option, index) => (
            <button
              key={option.key ?? "all"}
              ref={(el) => { itemRefs.current[index] = el }}
              type="button"
              role="option"
              aria-selected={index === selectedIndex}
              tabIndex={index === selectedIndex ? 0 : -1}
              className={clsx("bds-lang-dropdown__item", index === selectedIndex && "bds-lang-dropdown__item--active")}
              onClick={() => choose(option.key)}
              onKeyDown={(event) => onItemKeyDown(event, index)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function TutorialDirectory({ sections, translate }: { sections: TutorialSection[]; translate: Translate }) {
  const [query, setQuery] = useState("")
  const [language, setLanguage] = useState<string | null>(null)
  const [topic, setTopic] = useState<string | null>(null)
  const sectionIds = useMemo(() => new Set(sections.map((section) => section.id)), [sections])
  const searchId = useId()
  const headingId = useId()
  const term = query.trim()
  const filtering = term.length > 0 || language !== null
  const total = sections.reduce((sum, section) => sum + section.tutorials.length + (section.community?.length ?? 0), 0)

  const filtered = useMemo(
    () =>
      sections.map((section) => ({
        section,
        visible: section.tutorials.filter((t) => matchesFilters(t, term, language)),
        visibleCommunity: (section.community ?? []).filter((t) => matchesCommunityFilters(t, term, language)),
      })),
    [sections, term, language],
  )
  const matchCount = filtered.reduce((sum, entry) => sum + entry.visible.length + entry.visibleCommunity.length, 0)
  const nonEmpty = filtered.filter((entry) => entry.visible.length > 0 || entry.visibleCommunity.length > 0)
  // A chosen topic that the search or language filter has emptied stays selected
  // (so the chip can be un-pressed) but shows the empty state below.
  const shown = topic === null ? nonEmpty : nonEmpty.filter((entry) => entry.section.id === topic)

  // Topic anchors: a chosen topic is written to the URL hash (#payments), so
  // links to a topic keep working and a filtered view can be shared. On load,
  // a hash that names a topic selects its chip and brings the directory up.
  const selectTopic = (id: string | null) => {
    setTopic(id)
    if (typeof window === "undefined") return
    const { pathname, search } = window.location
    window.history.replaceState(null, "", id ? `#${id}` : pathname + search)
  }

  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.slice(1)
      if (id && sectionIds.has(id)) {
        setTopic(id)
        document.getElementById(DIRECTORY_ID)?.scrollIntoView()
      }
    }
    applyHash()
    window.addEventListener("hashchange", applyHash)
    return () => window.removeEventListener("hashchange", applyHash)
  }, [sectionIds])

  const clearFilters = () => {
    setQuery("")
    setLanguage(null)
    selectTopic(null)
  }

  return (
    <section className="tutorials-directory" id={DIRECTORY_ID} aria-labelledby={headingId}>
      <PageGrid>
        <SectionHeader
          headingId={headingId}
          heading={translate("All tutorials")}
          description={translate("{{count}} tutorials across {{topics}} topics. Search by task, or filter by language and topic.", {
            count: total,
            topics: sections.length,
          })}
        />

        <PageGrid.Row>
          <PageGrid.Col span={{ base: 4, md: 8, lg: 12 }}>
            <div className="tutorials-directory__toolbar">
              <form className="tutorials-directory__search" role="search" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor={searchId} className="visually-hidden">{translate("Search tutorials")}</label>
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={translate("Search by task, for example “escrow”")}
                  autoComplete="off"
                />
              </form>
              <LanguageMenu value={language} onChange={setLanguage} translate={translate} />
            </div>
            <div className="tutorials-directory__topics" role="group" aria-label={translate("Filter by topic")}>
              <button
                type="button"
                className={clsx("tutorials-chip label-r", topic === null && "is-active")}
                aria-pressed={topic === null}
                onClick={() => selectTopic(null)}
              >
                {translate("All topics")}
                <span className="tutorials-chip__count">{matchCount}</span>
              </button>
              {filtered
                .filter((entry) => nonEmpty.includes(entry) || entry.section.id === topic)
                .map(({ section, visible, visibleCommunity }) => (
                  <button
                    key={section.id}
                    type="button"
                    className={clsx("tutorials-chip label-r", topic === section.id && "is-active")}
                    aria-pressed={topic === section.id}
                    onClick={() => selectTopic(topic === section.id ? null : section.id)}
                  >
                    {translate(section.title)}
                    <span className="tutorials-chip__count">{visible.length + visibleCommunity.length}</span>
                  </button>
                ))}
            </div>
            <p className="tutorials-directory__status label-r" aria-live="polite">
              {filtering
                ? translate(matchCount === 1 ? "{{count}} tutorial matches" : "{{count}} tutorials match", { count: matchCount })
                : ""}
            </p>
          </PageGrid.Col>
        </PageGrid.Row>

        <PageGrid.Row className="tutorials-directory__body">
          <PageGrid.Col span={{ base: 4, md: 8, lg: 12 }} className="tutorials-grid-host">
            {shown.length === 0 ? (
              <div className="tutorials-directory__empty">
                <p className="body-l">
                  {translate("No tutorials match these filters yet.")}
                </p>
                <Button type="button" intention="neutral" emphasis="standard" onClick={clearFilters}>
                  {translate("Clear Filters")}
                </Button>
              </div>
            ) : (
              shown.map(({ section, visible, visibleCommunity }) => (
                <TopicSection
                  key={section.id}
                  section={section}
                  visible={visible}
                  visibleCommunity={visibleCommunity}
                  filtering={filtering || topic !== null}
                  translate={translate}
                />
              ))
            )}
          </PageGrid.Col>
        </PageGrid.Row>
      </PageGrid>
    </section>
  )
}

/** Structured data so crawlers and AI agents get the full list without rendering React */
function StructuredData({ tutorials, description }: { tutorials: InternalTutorial[]; description: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "XRP Ledger Tutorials",
    url: `${SITE_URL}/docs/tutorials/`,
    description,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tutorials.length,
      itemListElement: tutorials.map((tutorial, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "TechArticle",
          name: tutorial.title,
          url: `${SITE_URL}${tutorial.path}`,
          description: tutorial.description || undefined,
          dateModified: formatDate(tutorial.lastModified)?.dateTime,
          programmingLanguage: tutorial.languages
            .map((key) => LANGUAGE_BY_KEY.get(key)?.label)
            .filter(Boolean),
          keywords: tutorial.labels.length ? tutorial.labels.join(", ") : undefined,
        },
      })),
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function TutorialsIndex() {
  const { useTranslate, usePageSharedData } = useThemeHooks()
  const { translate } = useTranslate()

  const tutorialLanguages = usePageSharedData<TutorialLanguagesMap>("tutorial-languages") || {}
  const tutorialMetadata = usePageSharedData<{
    tutorials: TutorialMetadataItem[]
    categories: { id: string; title: string }[]
  }>("tutorial-metadata")
  const allTutorials = tutorialMetadata?.tutorials || []
  const sidebarCategories = tutorialMetadata?.categories || []

  const sections = useMemo(
    () => buildSections(sidebarCategories, allTutorials, tutorialLanguages),
    [sidebarCategories, allTutorials, tutorialLanguages],
  )
  const directoryTutorials = sections.flatMap((section) => section.tutorials)

  // What's New: newest tutorials by last change, excluding the Get Started set.
  const getStartedPaths = new Set((sectionConfig["get-started"]?.pinned || []).map(getPinnedPath))
  const whatsNewTutorials = allTutorials
    .filter((tutorial) => !getStartedPaths.has(tutorial.path))
    .slice(0, MAX_WHATS_NEW)
    .map((tutorial) => toInternalTutorial(tutorial, tutorialLanguages))

  const scrollToDirectory = () => {
    const target = document.getElementById(DIRECTORY_ID)
    if (!target) return
    target.scrollIntoView({ behavior: "smooth", block: "start" })
    window.history.replaceState(null, "", `#${DIRECTORY_ID}`)
  }

  return (
    <PageWrapper className="landing page-tutorials">
      <header className="tutorials-hero">
        <PageGrid>
          <PageGrid.Row className="tutorials-hero__row">
            <PageGrid.Col span={{ base: 4, md: 8, lg: 7 }} className="tutorials-hero__copy">
              <div className="tutorials-hero__heading">
                <h1 className="tutorials-hero__title display-sm">
                  {translate("Crypto Wallet and Blockchain Development Tutorials")}
                </h1>
                <p className="tutorials-hero__eyebrow label-r">{translate("Tutorials")}</p>
              </div>
              <ButtonGroup
                gap="medium"
                buttons={[{ label: translate("Browse All Tutorials"), onClick: scrollToDirectory }]}
              />
            </PageGrid.Col>
            <PageGrid.Col span={{ base: 4, md: 8, lg: 5 }} className="tutorials-network-host">
              <NetworkPanel translate={translate} />
            </PageGrid.Col>
          </PageGrid.Row>
        </PageGrid>
      </header>

      {whatsNewTutorials.length > 0 && (
        <section className="tutorials-whats-new" id="whats-new" aria-labelledby="whats-new-heading">
          <PageGrid>
            <SectionHeader
              headingId="whats-new-heading"
              heading={translate(WHATS_NEW?.title ?? "What's New")}
              description={WHATS_NEW?.description ? translate(WHATS_NEW.description) : undefined}
            />
            <PageGrid.Row>
              <PageGrid.Col span={{ base: 4, md: 8, lg: 12 }} className="tutorials-grid-host">
                <ul className="tutorials-grid">
                  {whatsNewTutorials.map((tutorial) => (
                    <li key={tutorial.path}>
                      <TutorialCard tutorial={tutorial} headingAs="h3" showDate variant="green" translate={translate} />
                    </li>
                  ))}
                </ul>
              </PageGrid.Col>
            </PageGrid.Row>
          </PageGrid>
        </section>
      )}

      <TutorialDirectory sections={sections} translate={translate} />

      {/* Card text is each linked page's own frontmatter description. */}
      <StandardCardGroupSection
        headline={translate("Keep building")}
        description={translate("The source behind every tutorial, tooling for AI assistants, and how to add a tutorial of your own.")}
        variant="neutral"
        cards={[
          {
            headline: translate("Code samples"),
            children: translate("Browse sample code for building common use cases on the XRP Ledger."),
            callsToAction: [{ children: translate("Browse Code Samples"), href: "/resources/code-samples/" }],
          },
          {
            headline: translate("Use the docs with AI"),
            children: translate("Accelerate development on the XRPL with AI tools."),
            callsToAction: [{ children: translate("Set Up AI Tools"), href: "/resources/dev-tools/ai-tools/" }],
          },
          {
            headline: translate("Write a tutorial"),
            children: translate("Contribution guides for XRP Ledger documentation."),
            callsToAction: [{ children: translate("Read the Contribution Guide"), href: "/resources/contribute-documentation/" }],
          },
        ]}
      />

      <StructuredData tutorials={directoryTutorials} description={frontmatter.seo.description} />
    </PageWrapper>
  )
}
