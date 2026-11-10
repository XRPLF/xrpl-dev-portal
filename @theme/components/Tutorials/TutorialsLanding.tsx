import { useLanguagePicker, useThemeHooks } from "@redocly/theme/core/hooks"
import { useMemo } from "react"
import { PageWrapper } from "shared/components/PageWrapper"
import { PageGrid } from "shared/components/PageGrid/page-grid"
import { ButtonGroup } from "shared/patterns/ButtonGroup/ButtonGroup"
import { SectionHeader } from "shared/patterns/SectionHeader"
import { StandardCardGroupSection } from "shared/sections/StandardCardGroupSection/StandardCardGroupSection"
import { NetworkPanel, StructuredData, TutorialCard, TutorialDirectory } from "./components"
import {
  buildLanding,
  DIRECTORY_ID,
  KEEP_BUILDING,
  PAGE_TITLE,
  WHATS_NEW,
  WHATS_NEW_TITLE,
  type TutorialMetadata,
} from "./model"

/** Tutorials landing page, rendered by the {% tutorials-landing /%} Markdoc tag. */
export function TutorialsLanding() {
  const { useTranslate, usePageSharedData } = useThemeHooks()
  const { translate } = useTranslate()
  const { currentLocale } = useLanguagePicker()
  const tutorialMetadata = usePageSharedData<TutorialMetadata>("tutorial-metadata")
  const { prefix, sections, whatsNew } = useMemo(
    () => buildLanding(tutorialMetadata, currentLocale?.code),
    [tutorialMetadata, currentLocale?.code],
  )
  const directoryTutorials = sections.flatMap((section) => section.tutorials)

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
                <h1 className="tutorials-hero__title display-sm">{translate(PAGE_TITLE)}</h1>
                <p className="tutorials-hero__eyebrow label-r">{translate("Tutorials")}</p>
              </div>
              <ButtonGroup
                gap="medium"
                buttons={[{ label: translate("Browse All Tutorials"), onClick: scrollToDirectory }]}
              />
            </PageGrid.Col>
            <PageGrid.Col span={{ base: 4, md: 8, lg: 5 }} className="tutorials-network-host">
              <NetworkPanel />
            </PageGrid.Col>
          </PageGrid.Row>
        </PageGrid>
      </header>

      {whatsNew.length > 0 && (
        <section className="tutorials-whats-new" id="whats-new" aria-labelledby="whats-new-heading">
          <PageGrid>
            <SectionHeader
              headingId="whats-new-heading"
              heading={translate(WHATS_NEW_TITLE)}
              description={WHATS_NEW?.description ? translate(WHATS_NEW.description) : undefined}
            />
            <PageGrid.Row>
              <PageGrid.Col span={{ base: 4, md: 8, lg: 12 }} className="tutorials-grid-host">
                <ul className="tutorials-grid">
                  {whatsNew.map((tutorial) => (
                    <li key={tutorial.path}>
                      <TutorialCard tutorial={tutorial} headingAs="h3" showDate variant="green" />
                    </li>
                  ))}
                </ul>
              </PageGrid.Col>
            </PageGrid.Row>
          </PageGrid>
        </section>
      )}

      <TutorialDirectory sections={sections} />

      <StandardCardGroupSection
        headline={translate(KEEP_BUILDING.title)}
        description={translate(KEEP_BUILDING.description)}
        variant="neutral"
        cards={KEEP_BUILDING.cards.map((card) => ({
          headline: translate(card.title),
          children: translate(card.description),
          callsToAction: [{ children: translate(card.cta), href: card.href }],
        }))}
      />

      <StructuredData tutorials={directoryTutorials} prefix={prefix} />
    </PageWrapper>
  )
}
