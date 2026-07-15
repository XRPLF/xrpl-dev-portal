// Components related to XRPL Amendment previews and statuses

import * as React from 'react'
import type { Node } from '@markdoc/markdoc'
import { Link } from '@redocly/theme/components/Link/Link'
import { useThemeHooks } from '@redocly/theme/core/hooks'
import amendmentsSnapshot from '../data/amendments-snapshot.json'

type Amendment = {
  name: string
  rippled_version: string
  tx_hash?: string
  consensus?: string
  date?: string
  id: string
  eta?: string
  deprecated: boolean
}

type AmendmentsResponse = {
  amendments: Amendment[]
}

type AmendmentsCache = {
  timestamp: number
  vote: Amendment[]
  info: Amendment[]
}

// API data caching
const amendmentsVoteEndpoint = 'https://vhs.prod.ripplex.io/v1/network/amendments/vote/main/'
const amendmentsInfoEndpoint = 'https://vhs.prod.ripplex.io/v1/network/amendments/info/main/'
const amendmentsCacheKey = 'xrpl.amendments.mainnet.cache'
const amendmentsTTL = 15 * 60 * 1000 // 15 minutes in milliseconds

function readCache(): AmendmentsCache | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(amendmentsCacheKey)
    if (!raw) return null
    const parsed: AmendmentsCache = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.vote) || !Array.isArray(parsed.info)) return null
    const fresh = Date.now() - parsed.timestamp < amendmentsTTL
    return fresh ? parsed : null
  } catch {
    return null
  }
}

function writeCache(cache: AmendmentsCache) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(amendmentsCacheKey, JSON.stringify(cache))
  } catch {
    // Ignore quota or serialization errors
  }
}

// Fetch a single amendments endpoint (vote or info).
async function fetchAmendmentList(endpoint: string): Promise<Amendment[]> {
  const response = await fetch(endpoint)
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status} from ${endpoint}`)
  }
  const data: AmendmentsResponse = await response.json()
  return data.amendments
}

// Deduplicated fetching for the amendment data; concurrent callers share the same promise.
let inFlight: Promise<AmendmentsCache> | null = null

// Cache-first: return the fresh combined cache, or fetch both endpoints in parallel,
// stamp them with a single timestamp, and store them under one cache key.
function getAmendmentsCache(): Promise<AmendmentsCache> {
  const cached = readCache()
  if (cached) return Promise.resolve(cached)
  if (inFlight) return inFlight
  const request = (async () => {
    const [vote, info] = await Promise.all([
      fetchAmendmentList(amendmentsVoteEndpoint),
      fetchAmendmentList(amendmentsInfoEndpoint),
    ])
    const cache: AmendmentsCache = { timestamp: Date.now(), vote, info }
    writeCache(cache)
    return cache
  })()
  inFlight = request
  // Release the slot once settled so a later cold load can refresh.
  const release = () => { if (inFlight === request) inFlight = null }
  request.then(release, release)
  return request
}

// Vote list for the amendments table (the caller filters out obsolete amendments).
function getAmendments(): Promise<Amendment[]> {
  return getAmendmentsCache().then(cache => cache.vote)
}

// Look up a single amendment for a disclaimer: the vote list first, then the info
// list for obsolete/never-enabled amendments.
async function findAmendment(name: string): Promise<Amendment> {
  const { vote, info } = await getAmendmentsCache()
  const found = vote.find(a => a.name === name) ?? info.find(a => a.name === name)
  if (found) return found

  throw new Error(`Couldn't find ${name} amendment in status tables.`)
}

// Obsolete amendments (deprecated and never enabled, e.g. Batch) are documented
// in the "Obsolete and Retired Amendments" section, not the live Mainnet Status
// table, so filter them out here. Deprecated amendments that are enabled keep
// their functionality and remain in the table as Enabled.
// OBSOLETE_AMENDMENT_NAMES is a manually maintained override.

const OBSOLETE_AMENDMENT_NAMES = new Set<string>([
  'CryptoConditionsSuite',
  'fixNFTokenDirV1',
  'fixNFTokenNegOffer',
  'NonFungibleTokensV1',
])

function isObsolete(amendment: Amendment): boolean {
  return (
    OBSOLETE_AMENDMENT_NAMES.has(amendment.name) ||
    (Boolean(amendment.deprecated) && !amendment.tx_hash)
  )
}

// Sort amendments table by status, then chronologically, then alphabetically
function sortAmendments(list: Amendment[]): Amendment[] {
  const getStatusPriority = (amendment: Amendment): number => {
    if (amendment.consensus) return 0    // Open for Voting
    if (amendment.eta) return 1          // Expected
    if (amendment.tx_hash) return 2      // Enabled
    return 3                             // Fallback
  }

  const getChronoKey = (amendment: Amendment): number => {
    const raw = amendment.date || amendment.eta
    if (!raw) return 0
    const t = Date.parse(raw)
    return isNaN(t) ? 0 : t
  }

  return [...list].sort((a, b) => {
    // 1. Status
    const statusDiff = getStatusPriority(a) - getStatusPriority(b)
    if (statusDiff !== 0) return statusDiff

    // 2. Chronological (most recent first)
    const chronoA = getChronoKey(a)
    const chronoB = getChronoKey(b)
    if (chronoA !== chronoB) return chronoB - chronoA

    // 3. Alphabetical
    return a.name.localeCompare(b.name)
  })
}

// Get amendment status from snapshot data.
function amendmentStatusForLlms(a: Amendment): string {
  if (a.tx_hash) {
    const date = a.date ? new Date(a.date).toISOString().split('T')[0] : ''
    return date ? `Enabled: ${date}` : 'Enabled'
  }
  if (a.eta) return `Expected: ${new Date(a.eta).toISOString().split('T')[0]}`
  if (a.consensus) return `Open for Voting: ${a.consensus}`
  return 'Error'
}

// Build-time Markdown rendering of the amendments table for LLM export.
export function amendmentsTableForLlms(): string {
  const { fetched_at, amendments } = amendmentsSnapshot as unknown as {
    fetched_at?: string
    amendments?: Amendment[]
  }

  const asOf = fetched_at || 'unknown'

  if (!Array.isArray(amendments) || amendments.length === 0) {
    return `Note: Amendment status table is missing or malformed. For live status, visit https://xrpl.org/resources/known-amendments in a browser.\n`
  }

  const rows = sortAmendments(amendments.filter(a => !isObsolete(a)))

  const lines = [
    `Note: The amendment status table is a snapshot from ${asOf}. For live status, visit https://xrpl.org/resources/known-amendments in a browser.`,
    '',
    '| Name | Introduced | Status |',
    '|:-----|:-----------|:-------|',
    ...rows.map(
      a => `| [${a.name}](#${a.name.toLowerCase()}) | ${a.rippled_version} | ${amendmentStatusForLlms(a)} |`,
    ),
    '',
  ]

  return lines.join('\n')
}

// Calculate expected height of amendment table so there's little to no
// page-height jump when the actual table loads in. This ensures that anchor
// links go to the correct scroll position even before the amendment statuses
// have loaded.
function expectedTableHeight() {
  const numAmendmentsCached = amendmentsSnapshot.amendments.filter(
    a => !isObsolete(a)).length
  const rowHeight = 39 // pixel height per row, including border, based on CSS
  const headerHeight = 38 // pixel height of table header
  const wrapperMargin = 41 // extra margin added by the md-table-wrapper element
  return (numAmendmentsCached * rowHeight) + headerHeight + wrapperMargin
}

// Generate amendments table with live mainnet data
export function AmendmentsTable() {
  const [amendments, setAmendments] = React.useState<Amendment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()

  const estimatedHeight = `${expectedTableHeight()}px`

  React.useEffect(() => {
    let cancelled = false
    getAmendments()
      .then(list => {
        if (!cancelled) setAmendments(sortAmendments(list.filter(a => !isObsolete(a))))
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to fetch amendments')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  // Fancy schmancy loading icon
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '2rem',
        height: estimatedHeight }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">{translate("amendment.loading", "Loading amendments...")}</span>
        </div>
        <div style={{ marginTop: '1rem' }}>{translate("amendment.loading", "Loading amendments...")}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>{translate("amendment.error", "Error loading amendments:")}:</strong> {error}
      </div>
    )
  }

  // Render amendment table
  return (
    <div className="md-table-wrapper">
      <table className="md">
        <thead>
          <tr>
            <th align="left" data-label="Name">{translate("amendment.table.name", "Name")}</th>
            <th align="left" data-label="Introduced">{translate("amendment.table.introduced", "Introduced")}</th>
            <th align="left" data-label="Status">{translate("amendment.table.status", "Status")}</th>
          </tr>
        </thead>
        <tbody>
          {amendments.map((amendment) => (
            <tr key={amendment.id}>
              <td align="left">
                <Link to={`#${amendment.name.toLowerCase()}`}>{amendment.name}</Link>
              </td>
              <td align="left">{amendment.rippled_version}</td>
              <td align="left">
                <AmendmentBadge amendment={amendment} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AmendmentBadge(props: { amendment: Amendment }) {
  const [status, setStatus] = React.useState<string>('Loading...')
  const [href, setHref] = React.useState<string | undefined>(undefined)
  const [color, setColor] = React.useState<string>('blue')
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()

  const enabledLabel = translate("amendment.status.enabled", "Enabled")
  const votingLabel = translate("amendment.status.openForVoting", "Open for Voting")
  const etaLabel = translate("amendment.status.eta", "Expected")
  const inactiveLabel = translate("amendment.status.inactive", "Inactive")
  const inactiveButton = translate("amendment.status.inactiveButton", "Get details")

  React.useEffect(() => {
    const amendment = props.amendment
    
    // Check if amendment is enabled (has tx_hash)
    if (amendment.tx_hash) {
      const enabledDate = new Date(amendment.date).toISOString().split('T')[0]
      setStatus(`${enabledLabel}: ${enabledDate}`)
      setColor('green')
      setHref(`https://livenet.xrpl.org/transactions/${amendment.tx_hash}`)
    } 
    // Check if expected activation is provided (has eta field)
    else if (amendment.eta) {
      let etaDate = new Date(amendment.eta).toISOString().split('T')[0]
      setStatus(`${etaLabel}: ${etaDate}`)
      setColor('blue')
      setHref(undefined)
    }
    // Check if amendment is currently being voted on (has consensus field)
    else if (amendment.consensus) {
      setStatus(`${votingLabel}: ${amendment.consensus}`)
      setColor('80d0e0')
      setHref(undefined)
    }
    // Fallback: amendment is inactive
    else {
      setStatus(`${inactiveLabel}: ${inactiveButton}`)
      setColor('lightgrey')
      setHref(`/resources/known-amendments#${amendment.name.toLowerCase()}`)
    }
  }, [props.amendment, enabledLabel, etaLabel, votingLabel, inactiveLabel])
  
  // Split the status at the colon to create two-color badge
  const parts = status.split(':')
  const label = shieldsIoEscape(parts[0])
  const message = shieldsIoEscape(parts.slice(1).join(':'))
  
  const badgeUrl = `https://img.shields.io/badge/${label}-${message}-${color}`

  if (href) {
    return (
      <Link to={href} target="_blank">
        <img src={badgeUrl} alt={status} className="shield" />
      </Link>
    )
  }

  return <img src={badgeUrl} alt={status} className="shield" />
}

export function AmendmentDisclaimer(props: {
  name: string,
  compact: boolean,
  statusOnly: boolean,
  mode: string
}) {
  const [amendmentStatus, setStatus] = React.useState<Amendment | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()

  const link = () => <Link to={`/resources/known-amendments#${props.name.toLowerCase()}`}>{props.name}{ props.compact ? "" : " amendment"}</Link>

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    findAmendment(props.name)
      .then(found => {
        if (!cancelled) setStatus(found)
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to fetch amendments')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [props.name])

  if (loading) {
    if (props.statusOnly) {
      return <>
        {translate("amendment.loading_status", "Loading...")}
      </>
    }

    return (
      <p><em>
      {translate("component.amendment-status.requires.1", "Requires the ")}{link()}{translate("component.amendment-status.requires.2", ".")}
      {" "}
      <span className="spinner-border text-primary" role="status">
        <span className="sr-only">{translate("amendment.loading_status", "Loading...")}</span>
      </span>
      </em></p>
    )
  }
  
  if (error) {
    if (props.statusOnly) {
      return <>
        {translate("amendment.error_status", "Error loading amendment status")}: {error}
      </>
    }

    return (
      <p><em>
      {translate("component.amendment-status.requires.1", "Requires the ")}{link()}{translate("component.amendment-status.requires.2", ".")}
      {" "}
      <span className="alert alert-danger" style={{display: "block"}}>
        <strong>{translate("amendment.error_status", "Error loading amendment status")}:</strong> {error}
      </span>
      </em></p>
    )
  }

  if (props.statusOnly) {
    return(
      <AmendmentBadge amendment={amendmentStatus} />
    )
  }

  if (props.compact) {
    return (
      <>
        {link()}
        {" "}
        <AmendmentBadge amendment={amendmentStatus} />
      </>
    )
  }

  if (props.mode === "updated") {
    return (
      <p><em>(
        {
          amendmentStatus.date ? (
            <>
            {translate("component.amendment-status.updated.1", "Updated by the ")}{link()}
            {translate("component.amendment-status.updated.2", ".")}
            {" "}
            <AmendmentBadge amendment={amendmentStatus} />
            </>
          ) : (
            <>
            {translate("component.amendment-status.updates.1", "The ")}{link()}
            {translate("component.amendment-status.updates.2", " updates this.")}
            {" "}
            <AmendmentBadge amendment={amendmentStatus} />
            </>
          )
        }
      )</em></p>
    )
  }
  
  return (
    <p><em>(
      {
        amendmentStatus.date ? (
          <>
          {translate("component.amendment-status.added.1", "Added by the ")}{link()}
          {translate("component.amendment-status.added.2", ".")}
          {" "}
          <AmendmentBadge amendment={amendmentStatus} />
          </>
        ) : (
          <>
          {translate("component.amendment-status.requires.1", "Requires the ")}{link()}
          {translate("component.amendment-status.requires.2", ".")}
          {" "}
          <AmendmentBadge amendment={amendmentStatus} />
          </>
        )
      }
    )</em></p>
  )
}

export function amendmentDisclaimerForLlms(node: Node): string {
  const {
    name,
    compact,
    statusOnly,
    mode } = node.attributes
  // Note: useThemeHooks() does not work here because it's not a React
  // function component body. However, we would like to use translation.
  // For now, shim translate with a placeholder function that does nothing
  // but matches the syntax of the real translate function, in preparation for
  // when we can actually use it.
  // const { useTranslate } = useThemeHooks()
  // const { translate } = useTranslate()
  const translate = (key:string, s:string) => s; // Shim version of translate

  let amendment : Amendment | any = amendmentsSnapshot.amendments.find( (a) => a.name === name )
  let status = "Status Unknown"
  if (!amendment) {  
    status = translate("amendment.status.inactive", "Inactive")
    amendment = {
      name: name
    }
  } else {
    status = amendmentStatusForLlms(amendment)
  }
  if (statusOnly) {
    return status
  }
  const link = `/resources/known-amendments#${name.toLowerCase()}`

  if (compact) {
    return `[${name}](${link}) (${status})`
  }

  let text1, text2
  if (mode === "updated") {
    if (amendment.date) {
      text1 = translate("component.amendment-status.updated.1", "Updated by the ")
      text2 = translate("component.amendment-status.updated.2", ".")
    } else {
      text1 = translate("component.amendment-status.requires.1", "Requires the ")
      text2 = translate("component.amendment-status.requires.2", ".")
    }
  } else {
    if (amendment.date) {
      text1 = translate("component.amendment-status.added.1", "Added by the ")
      text2 = translate("component.amendment-status.added.2", ".")
    } else {
      text1 = translate("component.amendment-status.requires.1", "Requires the ")
      text2 = translate("component.amendment-status.requires.2", ".")
    }
  }
  return `_${text1}[${name} amendment](${link})${text2} (${status})_`
}

function shieldsIoEscape(s: string) {
  return s.trim()
    .replace(/-/g, '--')
    .replace(/_/g, '__')
    .replace(/%/g, '%25')
}

export function Badge(props: {
    children: React.ReactNode
    color: string
    href: string
}) {
    const DEFAULT_COLORS = {
      "open for voting": "80d0e0",
      "投票中": "80d0e0", // ja: open for voting
      "expected": "blue",
      "予定": "blue", // ja: expected
      "enabled": "green",
      "有効": "green", // ja: enabled
      "obsolete": "red",
      "removed in": "red",
      "削除": "red", // ja: removed in
      "廃止": "red", // ja: obsolete
      "撤回": "red", // ja: withdrawn/removed/vetoed
      "new in": "blue",
      "新規": "blue", // ja: new in
      "updated in": "blue",
      "更新": "blue", // ja: updated in
      "in development": "lightgrey",
      "開発中": "lightgrey", // ja: in development
      "inactive": "lightgrey",
      "無効": "lightgrey" // ja: inactive
    }

    let childstrings = ""

    React.Children.forEach(props.children, (child, index) => {
      if (typeof child == "string") {
        childstrings += child
      }
    })

    const parts = childstrings.split(":")
    const left : string = shieldsIoEscape(parts[0])
    const right : string = shieldsIoEscape(parts.slice(1).join(":"))

    let color = props.color
    if (!color) {
      if (DEFAULT_COLORS.hasOwnProperty(left.toLowerCase())) {
        color = DEFAULT_COLORS[left.toLowerCase()]
      } else {
        color = "lightgrey"
      }
    }

    let badge_url = `https://img.shields.io/badge/${left}-${right}-${color}.svg`

    if (props.href) {
      return (
        <Link to={props.href}>
          <img src={badge_url} alt={childstrings} className="shield" />
        </Link>
      )
    } else {
      return (
        <img src={badge_url} alt={childstrings} className="shield" />
      )
    }
}
