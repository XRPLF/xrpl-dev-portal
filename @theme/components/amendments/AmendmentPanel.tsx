import * as React from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { useThemeHooks } from '@redocly/theme/core/hooks'
import { XrplArrowExternalLinkIcon, XrplArrowInternalLinkIcon } from 'shared/components/Icons'
import {
  Amendment, Dunl, Feature, Resource, Status,
  earliestActivation, fill, formatDate, serverName, voteCount,
} from './model'
import { StatusPill } from './StatusPill'

export type PanelSubject = { feature: Feature; amendment?: Amendment; status: Status }

const KIND_LABELS: Record<string, string> = {
  spec: 'Spec',
  concept: 'Docs',
  tutorial: 'Tutorial',
  usecase: 'Use case',
  code: 'Code',
  blog: 'Blog',
  audit: 'Audit',
  security: 'Security',
  performance: 'Performance',
  qa: 'QA',
  demo: 'Demo',
  other: 'Link',
}

// Literal class names, so PurgeCSS can see them.
const STEP_CLASS = { done: 'is-done', current: 'is-current', upcoming: 'is-upcoming' }

function isExternal(url: string) {
  return /^https?:\/\//.test(url) && !url.startsWith('https://xrpl.org/')
}

function localHref(url: string) {
  return url.startsWith('https://xrpl.org/') ? url.replace('https://xrpl.org', '') : url
}

function NewTab({ translate }: { translate: (s: string) => string }) {
  return <span className="visually-hidden"> {translate('(opens in a new tab)')}</span>
}

function ResourceRow({ r, translate }: { r: Resource; translate: (s: string) => string }) {
  const external = isExternal(r.url)
  return (
    <li>
      <a className="amd-resource" href={localHref(r.url)} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        <span className="amd-resource__kind">{translate(KIND_LABELS[r.kind] || KIND_LABELS.other)}</span>
        <span className="amd-resource__text">
          <span className="amd-resource__title">{r.title}</span>
          {r.text && <span className="amd-resource__desc">{r.text}</span>}
        </span>
        <span className="amd-resource__icon" aria-hidden="true">
          {external ? <XrplArrowExternalLinkIcon /> : <XrplArrowInternalLinkIcon />}
        </span>
        {external && <NewTab translate={translate} />}
      </a>
      {r.github && (
        <a className="amd-resource__github" href={r.github} target="_blank" rel="noopener noreferrer">
          {translate('Source on GitHub')}
          <NewTab translate={translate} />
        </a>
      )}
    </li>
  )
}

type KeyDate = { event: string; value: React.ReactNode; state: 'done' | 'current' | 'upcoming' }

// The four key dates from the opensource.ripple.com feature pages, filled from
// the ledgers and release notes instead of client-side GitHub lookups.
function keyDates(subject: PanelSubject, dunl: Dunl, translate: (s: string) => string): KeyDate[] {
  const { feature, amendment, status } = subject
  if (!amendment) {
    return feature.fixed_dates.map(d => ({ event: d.event, value: d.date, state: 'done' }))
  }
  const m = amendment.mainnet
  const notYet = translate('Not yet')
  const onDevnet = amendment.devnet || status !== 'development'

  let consensus: React.ReactNode = notYet
  let consensusState: KeyDate['state'] = 'upcoming'
  if (m?.status === 'enabled') {
    consensusState = 'done'
    consensus = (
      <>
        {fill(translate('Enabled {{date}}'), { date: formatDate(m.date) })}
        {m.tx_hash && (
          <>
            {' · '}
            <a href={`https://livenet.xrpl.org/transactions/${m.tx_hash}`} target="_blank" rel="noopener noreferrer">
              {translate('Transaction')}
              <NewTab translate={translate} />
            </a>
          </>
        )}
      </>
    )
  } else if (status === 'majority' && m?.status === 'voting') {
    consensusState = 'current'
    consensus = fill(translate('Majority since {{since}}. Earliest activation {{date}}.'), {
      since: formatDate(m.majority_since),
      date: formatDate(earliestActivation(m)),
    })
  } else if (status === 'voting') {
    const votes = voteCount(amendment, dunl)
    consensusState = 'current'
    consensus = votes ? (
      <span className="amd-consensus">
        <span>
          {fill(translate('{{yes}} of {{active}} validators vote yes. {{needed}} needed.'), {
            yes: votes.yes, active: votes.active, needed: votes.needed,
          })}
        </span>
        <span className="amd-consensus__bar" aria-hidden="true">
          <span className="amd-consensus__fill" style={{ width: `${(votes.yes / votes.active) * 100}%` }} />
          <span className="amd-consensus__mark" style={{ left: `${(votes.needed / votes.active) * 100}%` }} />
        </span>
      </span>
    ) : translate('Open for voting')
  }

  return [
    {
      event: translate('XLS spec live'),
      value: feature.xls_spec_date ? formatDate(feature.xls_spec_date) : notYet,
      state: feature.xls_spec_date ? 'done' : 'current',
    },
    {
      event: translate('Available to test on Devnet'),
      value: feature.devnet_date ? formatDate(feature.devnet_date) : onDevnet ? translate('Available') : notYet,
      state: onDevnet ? 'done' : 'current',
    },
    {
      event: translate('Open for voting on Mainnet'),
      value: amendment.introduced ? (
        <>
          {amendment.release_date && <>{formatDate(amendment.release_date)} · </>}
          {amendment.release_post ? <a href={amendment.release_post}>{serverName(amendment.introduced)}</a> : serverName(amendment.introduced)}
        </>
      ) : notYet,
      state: amendment.introduced ? 'done' : 'upcoming',
    },
    { event: translate('Vote consensus'), value: consensus, state: consensusState },
  ]
}

export function AmendmentPanel({ subject, dunl, onClose }: {
  subject: PanelSubject | null
  dunl: Dunl
  onClose: () => void
}) {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  const [target, setTarget] = React.useState<HTMLElement | null>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const openerRef = React.useRef<Element | null>(null)
  const open = subject !== null

  React.useEffect(() => setTarget(document.body), [])

  // Keep the latest close handler without re-running the dialog effect when
  // the URL changes while the panel stays open.
  const onCloseRef = React.useRef(onClose)
  onCloseRef.current = onClose

  // Runs once the portal target exists, so a deep link also moves focus into
  // the dialog. The rest of the page is inert while it is open.
  React.useEffect(() => {
    if (!open || !target) return
    openerRef.current = document.activeElement
    const html = document.documentElement
    const saved = [html.style.overflow, document.body.style.overflow]
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    const root = panelRef.current?.closest('.amd-panel-root')
    const others = Array.from(document.body.children).filter(el => el !== root && !el.hasAttribute('inert'))
    others.forEach(el => el.setAttribute('inert', ''))
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      others.forEach(el => el.removeAttribute('inert'))
      html.style.overflow = saved[0]
      document.body.style.overflow = saved[1]
      if (openerRef.current instanceof HTMLElement && document.contains(openerRef.current)) {
        openerRef.current.focus({ preventScroll: true })
      }
    }
  }, [open, target])

  React.useEffect(() => {
    panelRef.current?.querySelector('.amd-panel__body')?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [subject?.feature.slug])

  if (!target || !subject) return null
  const { feature, amendment, status } = subject
  const dates = keyDates(subject, dunl, translate)
  // Draft pages the resource cards don't already link to.
  const linked = new Set(feature.resources.map(r => r.url.replace(/\/$/, '')))
  const drafts = feature.subpages.filter(p => !linked.has(p.url.replace(/\/$/, '')))

  return createPortal(
    <div className="amd-panel-root">
      <div className="amd-panel__scrim" onClick={onClose} aria-hidden="true" />
      <div className="amd-panel" role="dialog" aria-modal="true" aria-labelledby="amd-panel-title" ref={panelRef}>
        <div className="amd-panel__head">
          <div className="amd-panel__eyebrow">{feature.xls}</div>
          <button type="button" className="amd-panel__close" onClick={onClose} ref={closeRef} aria-label={translate('Close')}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <h2 id="amd-panel-title" className="amd-panel__title h-sm">{feature.title}</h2>
          <div className="amd-panel__meta">
            <StatusPill status={status} label={amendment ? undefined : translate('Available')} />
            {amendment && <code className="amd-panel__name">{amendment.name}</code>}
          </div>
        </div>

        <div className="amd-panel__body">
          <p className="amd-panel__summary">{feature.summary}</p>
          {feature.description && feature.description !== feature.summary && (
            <p className="amd-panel__desc">{feature.description}</p>
          )}

          <section className="amd-panel__section amd-dates" aria-labelledby="amd-dates-title">
            <h3 className="amd-panel__h" id="amd-dates-title">{translate('Key dates')}</h3>
            <ol className="amd-steps">
              {dates.map((d, i) => (
                <li key={i} className={clsx('amd-steps__item', STEP_CLASS[d.state])}>
                  <span className="amd-steps__dot" aria-hidden="true" />
                  <span className="amd-steps__label">{d.event}</span>
                  <span className="amd-steps__date">{d.value}</span>
                </li>
              ))}
            </ol>
          </section>

          {feature.resources.length > 0 && (
            <section className="amd-panel__section">
              <h3 className="amd-panel__h">{translate('Resources')}</h3>
              <ul className="amd-resources">
                {feature.resources.map(r => <ResourceRow r={r} key={r.url + r.title} translate={translate} />)}
              </ul>
            </section>
          )}

          {drafts.length > 0 && (
            <section className="amd-panel__section">
              <h3 className="amd-panel__h">{translate('Documentation in progress')}</h3>
              <ul className="amd-resources amd-resources--compact">
                {drafts.map(p => (
                  <ResourceRow key={p.url} translate={translate} r={{ title: p.title, url: p.url, kind: 'concept', text: '' }} />
                ))}
              </ul>
            </section>
          )}

          <p className="amd-panel__source">
            <a href={feature.source_url} target="_blank" rel="noopener noreferrer">
              {translate('View this page on opensource.ripple.com')}
              <NewTab translate={translate} />
            </a>
            <br />
            {translate('Content from Ripple, licensed under')}{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
              CC BY 4.0
              <NewTab translate={translate} />
            </a>
            {translate(', adapted for xrpl.org.')}
          </p>
        </div>
      </div>
    </div>,
    target,
  )
}
