import { useThemeHooks } from "@redocly/theme/core/hooks"
import { Link as RouteLink } from "@redocly/theme/components/Link/Link"
import { useState } from "react"
import clsx from "clsx"
import { Link } from "shared/components/Link"
import { XrplArrowExternalLinkIcon, XrplArrowInternalLinkIcon } from "shared/components/Icons"
import { formatDate, shownLanguages, type ExternalTutorial, type InternalTutorial } from "../model"

function LanguageIcons({ languages }: { languages: string[] }) {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  const shown = shownLanguages(languages)
  const names = shown.map((lang) => translate(lang.label)).join(", ")
  return (
    <span className="tutorial-card__langs" role="img" aria-label={`${translate("Languages")}: ${names}`}>
      {shown.map((lang) => (
        <img key={lang.key} src={lang.icon} alt="" width={24} height={24} loading="lazy" decoding="async" />
      ))}
    </span>
  )
}

export function TutorialCard({
  tutorial,
  headingAs: Heading,
  showDate = false,
  variant = "neutral",
}: {
  tutorial: InternalTutorial
  headingAs: "h3" | "h4"
  showDate?: boolean
  variant?: "neutral" | "green"
}) {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  const date = showDate ? formatDate(tutorial.lastModified) : null

  return (
    <RouteLink to={tutorial.path} className={clsx("tutorial-card", variant === "green" && "tutorial-card--green")}>
      <span className="tutorial-card__overlay" aria-hidden="true" />
      <div className="tutorial-card__top">
        <LanguageIcons languages={tutorial.languages} />
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
          <span /> /* keeps the arrow on the right */
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

/** GitHub serves a user's avatar at github.com/<user>.png; null for non-GitHub author links */
function avatarFor(author: ExternalTutorial["author"]): string | null {
  const match = /^https:\/\/github\.com\/([A-Za-z0-9-]+)\/?$/.exec(author.url)
  return match ? `https://github.com/${match[1]}.png?size=56` : null
}

/**
 * Community cards lead with the person who built the app where official cards
 * lead with the language. The whole card is clickable: the title link is
 * expanded with CSS to cover the card, pointing at the demo or at the repo
 * when there is no demo. The author and GitHub links are layered above it so
 * they stay clickable on their own.
 */
export function CommunityCard({ tutorial }: { tutorial: ExternalTutorial }) {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
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
            {tutorial.url ? translate("Live demo") : translate("Source on GitHub")}
          </span>
          <span className="tutorial-card__arrow" aria-hidden="true">
            <XrplArrowExternalLinkIcon />
          </span>
        </div>
      </article>
    </li>
  )
}
