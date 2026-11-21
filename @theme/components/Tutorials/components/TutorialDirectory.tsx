import { useThemeHooks } from "@redocly/theme/core/hooks"
import { useEffect, useId, useMemo, useState } from "react"
import clsx from "clsx"
import { PageGrid } from "shared/components/PageGrid/page-grid"
import Button from "shared/components/Button"
import { SectionHeader } from "shared/patterns/SectionHeader"
import { LanguageMenu } from "./LanguageMenu"
import { TopicSection } from "./TopicSection"
import {
  DIRECTORY_ID,
  DIRECTORY_TITLE,
  matchesCommunityFilters,
  matchesFilters,
  type TutorialSection,
} from "../model"

/**
 * The chosen topic, kept in sync with the URL hash (#payments) so links to a
 * topic keep working and a filtered view can be shared. On load, a hash that
 * names a topic selects its chip and brings the directory up.
 */
function useTopicHash(sectionIds: Set<string>): [string | null, (id: string | null) => void] {
  const [topic, setTopic] = useState<string | null>(null)

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

  return [topic, selectTopic]
}

export function TutorialDirectory({ sections }: { sections: TutorialSection[] }) {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  const [query, setQuery] = useState("")
  const [language, setLanguage] = useState<string | null>(null)
  const sectionIds = useMemo(() => new Set(sections.map((section) => section.id)), [sections])
  const [topic, selectTopic] = useTopicHash(sectionIds)
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
  // (so the chip can be deselected) but shows the empty state below.
  const shown = topic === null ? nonEmpty : nonEmpty.filter((entry) => entry.section.id === topic)

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
          heading={translate(DIRECTORY_TITLE)}
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
              <LanguageMenu value={language} onChange={setLanguage} />
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
              {/* chips for topics with matches, plus the chosen one so it can be deselected */}
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
                ? (matchCount === 1
                    ? translate("{{count}} tutorial matches", { count: matchCount })
                    : translate("{{count}} tutorials match", { count: matchCount }))
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
                />
              ))
            )}
          </PageGrid.Col>
        </PageGrid.Row>
      </PageGrid>
    </section>
  )
}
