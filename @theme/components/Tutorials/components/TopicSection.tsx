import { useThemeHooks } from "@redocly/theme/core/hooks"
import { useRef, useState } from "react"
import clsx from "clsx"
import Button from "shared/components/Button"
import { MaterialKeyboardArrowDownIcon, MaterialKeyboardArrowUpIcon } from "shared/components/Icons"
import { CommunityCard, TutorialCard } from "./TutorialCards"
import { COLLAPSE_THRESHOLD, MAX_PER_TOPIC, type ExternalTutorial, type InternalTutorial, type TutorialSection } from "../model"

type Tab = "official" | "community"

/**
 * The tab to show. If the filter empties the chosen tab but not the other one,
 * show the other one. The choice itself is kept, so the view returns to it
 * once the filter changes; clicking the empty tab is a no-op while it stays empty.
 */
function resolveTab(chosen: Tab, officialCount: number, communityCount: number): Tab {
  if (chosen === "official" && officialCount === 0 && communityCount > 0) return "community"
  if (chosen === "community" && communityCount === 0 && officialCount > 0) return "official"
  return chosen
}

export function TopicSection({
  section,
  visible,
  visibleCommunity,
  filtering,
}: {
  section: TutorialSection
  visible: InternalTutorial[]
  visibleCommunity: ExternalTutorial[]
  filtering: boolean
}) {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  const [expanded, setExpanded] = useState(false)
  const [chosenTab, setChosenTab] = useState<Tab>("official")
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  const ids = {
    heading: `${section.id}-heading`,
    panel: `${section.id}-panel`,
    list: `${section.id}-list`,
    tab: (tab: Tab) => `${section.id}-tab-${tab}`,
  }
  const hasTabs = section.community !== undefined && section.community.length > 0
  const tab = hasTabs ? resolveTab(chosenTab, visible.length, visibleCommunity.length) : chosenTab
  const showingCommunity = hasTabs && tab === "community"
  const collapsible = !filtering && !showingCommunity && visible.length > COLLAPSE_THRESHOLD
  const capped = collapsible && !expanded
  const note = showingCommunity ? section.communityDescription : section.description

  // Collapsing from the bottom of a long topic would leave the reader far below
  // it, so bring the heading back into view first.
  const toggleExpanded = () => {
    const next = !expanded
    setExpanded(next)
    if (!next && sectionRef.current && sectionRef.current.getBoundingClientRect().top < 0) {
      sectionRef.current.scrollIntoView()
    }
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "official", label: "xrpl.org", count: visible.length },
    { key: "community", label: translate("Community"), count: visibleCommunity.length },
  ]

  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    event.preventDefault()
    const next = (index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length
    setChosenTab(tabs[next].key)
    tabRefs.current[next]?.focus()
  }

  return (
    <section ref={sectionRef} className="tutorials-topic" id={section.id} aria-labelledby={ids.heading}>
      <div className="tutorials-topic__header">
        <h3 id={ids.heading} className="h-sm">{translate(section.title)}</h3>
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
              id={ids.tab(item.key)}
              aria-selected={tab === item.key}
              aria-controls={ids.panel}
              tabIndex={tab === item.key ? 0 : -1}
              className={clsx("tutorials-tab label-r", tab === item.key && "is-active")}
              onClick={() => setChosenTab(item.key)}
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
        id={hasTabs ? ids.panel : undefined}
        role={hasTabs ? "tabpanel" : undefined}
        aria-labelledby={hasTabs ? ids.tab(tab) : undefined}
      >
        {showingCommunity ? (
          <ul className="tutorials-grid">
            {visibleCommunity.map((tutorial, index) => (
              <CommunityCard key={`${index}-${tutorial.github}`} tutorial={tutorial} />
            ))}
          </ul>
        ) : (
          <ul className="tutorials-grid" id={ids.list}>
            {visible.map((tutorial, index) => (
              <li key={tutorial.path} hidden={capped && index >= MAX_PER_TOPIC}>
                <TutorialCard tutorial={tutorial} headingAs="h4" />
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
            aria-controls={ids.list}
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
