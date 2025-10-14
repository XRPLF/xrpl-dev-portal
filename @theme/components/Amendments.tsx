import * as React from 'react'
import { Link } from '@redocly/theme/components/Link/Link'
import { useThemeHooks } from '@redocly/theme/core/hooks'

type Amendment = {
  name: string
  rippled_version: string
  tx_hash?: string
  consensus?: string
  date?: string
  id: string
  eta?: string
}

type AmendmentsResponse = {
  amendments: Amendment[]
}

type AmendmentsCachePayload = {
  timestamp: number
  amendments: Amendment[]
}

// API data caching
const amendmentsEndpoint = 'https://vhs.prod.ripplex.io/v1/network/amendments/vote/main/'
const amendmentsCacheKey = 'xrpl.amendments.mainnet.cache'
const amendmentsTTL = 15 * 60 * 1000 // 15 minutes in milliseconds

function readAmendmentsCache(): Amendment[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(amendmentsCacheKey)
    if (!raw) return null
    const parsed: AmendmentsCachePayload = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.amendments)) return null
    const fresh = Date.now() - parsed.timestamp < amendmentsTTL
    return fresh ? parsed.amendments : null
  } catch {
    return null
  }
}

function writeAmendmentsCache(amendments: Amendment[]) {
  if (typeof window === 'undefined') return
  try {
    const payload: AmendmentsCachePayload = { timestamp: Date.now(), amendments }
    window.localStorage.setItem(amendmentsCacheKey, JSON.stringify(payload))
  } catch {
    // Ignore quota or serialization errors
  }
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

// Generate amendments table with live mainnet data
export function AmendmentsTable() {
  const [amendments, setAmendments] = React.useState<Amendment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()

  React.useEffect(() => {
    const fetchAmendments = async () => {
      try {
        setLoading(true)
        // 1. Try cache first
        const cached = readAmendmentsCache()

        if (cached) {
          setAmendments(sortAmendments(cached))
          return // Use current cache (fresh)
        }
        // 2. Fetch new data if cache is stale
        const response = await fetch(amendmentsEndpoint)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: AmendmentsResponse = await response.json()
        writeAmendmentsCache(data.amendments)

        setAmendments(sortAmendments(data.amendments))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch amendments')
      } finally {
        setLoading(false)
      }
    }

    fetchAmendments()
  }, [])

  // Fancy schmancy loading icon
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
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
      setHref(undefined) // No link for voting amendments
    }
  }, [props.amendment, enabledLabel, etaLabel, votingLabel])

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
  mode: string
}) {
  const [amendmentStatus, setStatus] = React.useState<Amendment | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()

  const link = () => <Link to={`/resources/known-amendments#${props.name.toLowerCase()}`}>{props.name}{ props.compact ? "" : " amendment"}</Link>

  React.useEffect(() => {
    const loadAmendment = async () => {
      try {
        setLoading(true)
        // 1. Try cache first
        const cached = readAmendmentsCache()

        if (cached) {
          const found = cached.find(a => a.name === props.name)
            if (found) {
              setStatus(found)
              return // amendment successfully found in cache
            }
        }
        // 2. New API request for stale/missing cache. 
        // Also catches edge case of new amendment appearing
        // on mainnet within cache TTL window.
        const response = await fetch(amendmentsEndpoint)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: AmendmentsResponse = await response.json()
        writeAmendmentsCache(data.amendments)

        const found = data.amendments.find(a => a.name === props.name)
        if (!found) {
          throw new Error(`Couldn't find ${props.name} amendment in status table.`)
        }

        setStatus(found)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch amendments')
      } finally {
        setLoading(false)
      }
    };
    loadAmendment()
  }, [props.name])

  if (loading) {
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
