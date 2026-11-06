// Markdown rendering of the tutorials landing page for the page's .md version,
// llms.txt, AI search and the MCP server. The React page reads the same data
// live from the plugin's shared data; renderForLlms runs at build time with no
// access to it, so it reads the JSON snapshot the plugin writes instead.
//
// Everything here comes from model.ts: the data from buildLanding and the copy
// from the page constants. Add new copy there so both renderers show it. Every
// string goes through the same translate function as the React page, so the
// locale's translations.yaml applies to both.
import type { RenderForLlmsContext } from "@redocly/theme/markdoc/tags/types"
import type { Node } from "@markdoc/markdoc"
import metadata from "../../data/tutorials-metadata.json"
import {
  buildLanding,
  DIRECTORY_TITLE,
  formatDate,
  KEEP_BUILDING,
  languageLabels,
  NETWORK_PANEL,
  NETWORKS,
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  SITE_URL,
  WHATS_NEW,
  WHATS_NEW_TITLE,
  type ExternalTutorial,
  type InternalTutorial,
  type TutorialMetadata,
  type TutorialSection,
} from "./model"

const snapshot = metadata as TutorialMetadata

type Translate = RenderForLlmsContext["translate"]

function tutorialLine(tutorial: InternalTutorial, prefix: string, translate: Translate, withDate = false): string {
  const languages = languageLabels(tutorial.languages).map((label) => translate(label))
  const meta = [`${translate("Languages")}: ${languages.join(", ")}`]
  const date = withDate ? formatDate(tutorial.lastModified) : null
  if (date) meta.push(translate("Updated {{date}}", { date: date.dateTime }))

  const description = tutorial.description ? `: ${translate(tutorial.description)}` : ""
  return `- [${translate(tutorial.title)}](${SITE_URL}${prefix}${tutorial.path})${description} (${meta.join("; ")})`
}

function communityLine(app: ExternalTutorial, translate: Translate): string {
  const links = [`${translate("Source on GitHub")}: ${app.github}`]
  if (app.url) links.unshift(`${translate("Live demo")}: ${app.url}`)
  return `- ${translate(app.title)} by [${app.author.name}](${app.author.url}): ${translate(app.description)} (${links.join("; ")})`
}

function sectionLines(section: TutorialSection, prefix: string, translate: Translate): string[] {
  const lines = [`### ${translate(section.title)}`, ""]
  if (section.description) lines.push(translate(section.description), "")
  lines.push(...section.tutorials.map((tutorial) => tutorialLine(tutorial, prefix, translate)), "")

  if (section.community?.length) {
    lines.push(`#### ${translate("Community sample apps")}`, "")
    if (section.communityDescription) lines.push(translate(section.communityDescription), "")
    lines.push(...section.community.map((app) => communityLine(app, translate)), "")
  }
  return lines
}

export function tutorialsLandingForLlms(_node: Node, { locale, translate }: RenderForLlmsContext): string {
  const { prefix, sections, whatsNew } = buildLanding(snapshot, locale)
  const total = sections.reduce((sum, section) => sum + section.tutorials.length, 0)
  const link = (href: string) => `${SITE_URL}${prefix}${href}`

  const lines: string[] = [
    `# ${translate(PAGE_TITLE)}`,
    "",
    translate(PAGE_DESCRIPTION),
    "",
    `## ${translate(NETWORK_PANEL.title)}`,
    "",
    `| ${translate("Network")} | ${translate("WebSocket")} | ${translate("JSON-RPC")} |`,
    "|:--|:--|:--|",
    ...NETWORKS.map((network) => `| ${translate(network.name)} | ${network.ws} | ${network.rpc} |`),
    "",
    `- [${translate(NETWORK_PANEL.allServers.label)}](${link(NETWORK_PANEL.allServers.href)})`,
    `- [${translate(NETWORK_PANEL.faucet.label)}](${link(NETWORK_PANEL.faucet.href)})`,
    "",
  ]

  if (whatsNew.length > 0) {
    lines.push(`## ${translate(WHATS_NEW_TITLE)}`, "")
    if (WHATS_NEW?.description) lines.push(translate(WHATS_NEW.description), "")
    lines.push(...whatsNew.map((tutorial) => tutorialLine(tutorial, prefix, translate, true)), "")
  }

  lines.push(
    `## ${translate(DIRECTORY_TITLE)}`,
    "",
    translate("{{count}} tutorials across {{topics}} topics.", { count: total, topics: sections.length }) +
      " " +
      translate("Each entry links to the tutorial and lists the programming languages it has code for."),
    "",
    ...sections.flatMap((section) => sectionLines(section, prefix, translate)),
    `## ${translate(KEEP_BUILDING.title)}`,
    "",
    translate(KEEP_BUILDING.description),
    "",
    ...KEEP_BUILDING.cards.map((card) => `- [${translate(card.cta)}](${link(card.href)}): ${translate(card.description)}`),
    "",
  )

  return lines.join("\n")
}
