import { useThemeHooks } from "@redocly/theme/core/hooks"
import { formatDate, LANGUAGE_BY_KEY, PAGE_DESCRIPTION, PAGE_TITLE, SITE_URL, type InternalTutorial } from "../model"

/** Structured data so crawlers and AI agents get the full list without rendering React */
export function StructuredData({ tutorials, prefix }: { tutorials: InternalTutorial[]; prefix: string }) {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: translate(PAGE_TITLE),
    url: `${SITE_URL}${prefix}/docs/tutorials/`,
    description: translate(PAGE_DESCRIPTION),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tutorials.length,
      itemListElement: tutorials.map((tutorial, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "TechArticle",
          name: translate(tutorial.title),
          url: `${SITE_URL}${prefix}${tutorial.path}`,
          description: tutorial.description ? translate(tutorial.description) : undefined,
          dateModified: formatDate(tutorial.lastModified)?.dateTime,
          programmingLanguage: tutorial.languages.flatMap((key) => {
            const label = LANGUAGE_BY_KEY.get(key)?.label
            return label ? [translate(label)] : []
          }),
          keywords: tutorial.labels.length ? tutorial.labels.join(", ") : undefined,
        },
      })),
    },
  }
  return (
    <script
      type="application/ld+json"
      // A title containing "</script>" must not end the element
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
