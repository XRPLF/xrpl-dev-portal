import * as React from 'react'
import { getAmendmentsCache } from '../Amendments'
import { Amendment, DAY, Dunl, MAJORITY_DAYS, snapshot, tallyLive } from './model'

const VALIDATORS_ENDPOINT = 'https://vhs.prod.ripplex.io/v1/network/validators/main'
const VALIDATORS_CACHE_KEY = 'xrpl.amendments.validators.cache'
const TTL = 15 * 60 * 1000

type ValidatorsCache = { timestamp: number; validators: any[] }

async function getValidators(): Promise<ValidatorsCache> {
  try {
    const cached: ValidatorsCache = JSON.parse(window.localStorage.getItem(VALIDATORS_CACHE_KEY) || 'null')
    if (cached && Array.isArray(cached.validators) && Date.now() - cached.timestamp < TTL) return cached
  } catch {
    // Ignore unreadable cache
  }
  const response = await fetch(VALIDATORS_ENDPOINT)
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${VALIDATORS_ENDPOINT}`)
  const data = await response.json()
  const validators = Array.isArray(data) ? data : data.validators
  if (!Array.isArray(validators) || validators.length < 20) throw new Error('Unexpected validators response')
  const cache = { timestamp: Date.now(), validators }
  try {
    window.localStorage.setItem(VALIDATORS_CACHE_KEY, JSON.stringify(cache))
  } catch {
    // Ignore quota errors
  }
  return cache
}

// Default UNL membership comes from the snapshot (unl.xrplf.org sends no CORS
// header). Signing keys and last-seen ledgers come from VHS, so key rotations
// and offline validators show up without a rebuild.
function mergeDunl(validators: any[] | null): Dunl {
  if (!validators) return snapshot.dunl
  const byMaster = new Map(validators.filter(v => v.master_key).map(v => [v.master_key, v]))
  return {
    newest_ledger: Math.max(snapshot.dunl.newest_ledger, ...validators.map(v => Number(v.current_index) || 0)),
    validators: snapshot.dunl.validators.map(v => {
      const live = byMaster.get(v.master_key)
      return live
        ? { ...v, signing_key: live.signing_key || v.signing_key, last_seen: Number(live.current_index) || v.last_seen }
        : v
    }),
  }
}

function mergeAmendments(vote: any[] | null, dunl: Dunl): Amendment[] {
  if (!vote) return snapshot.amendments
  const live = new Map(vote.map(a => [a.id, a]))
  const newest = Math.max(
    0,
    ...vote.flatMap(a => (a.voted?.validators || []).map((v: any) => Number(v.ledger_index) || 0)),
  )
  return snapshot.amendments.map(a => {
    const v = live.get(a.id)
    if (!v || a.mainnet?.status === 'enabled') return a
    if (v.tx_hash) {
      return { ...a, mainnet: { status: 'enabled' as const, date: v.date, tx_hash: v.tx_hash } }
    }
    // A live ETA means a majority. Keep the snapshot's start time only if it
    // matches the ETA; otherwise the majority was lost and gained again.
    const derived = v.eta ? Date.parse(v.eta) - MAJORITY_DAYS * DAY : NaN
    const snap = a.mainnet?.status === 'voting' ? Date.parse(a.mainnet.majority_since || '') : NaN
    const majority_since = !v.eta
      ? null
      : Math.abs(snap - derived) < 3600000 && a.mainnet?.status === 'voting'
        ? a.mainnet.majority_since
        : new Date(derived).toISOString()
    return {
      ...a,
      mainnet: { status: 'voting' as const, eta: v.eta || null, majority_since },
      votes: tallyLive(v, dunl, newest) || a.votes,
    }
  })
}

// Snapshot data, updated with live votes and validator activity from VHS.
// Refreshes when the tab becomes visible again.
export function useAmendmentData() {
  const [vote, setVote] = React.useState<any[] | null>(null)
  const [validators, setValidators] = React.useState<any[] | null>(null)

  React.useEffect(() => {
    let cancelled = false
    const load = () => {
      Promise.all([getAmendmentsCache(), getValidators().catch(() => null)])
        .then(([cache, vals]) => {
          if (cancelled || !Array.isArray(cache.vote) || cache.vote.length < 50) return
          setVote(cache.vote)
          if (vals) setValidators(vals.validators)
        })
        .catch(() => {
          // Keep showing the snapshot
        })
    }
    load()
    const onVisible = () => {
      if (document.visibilityState === 'visible') load()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  const dunl = React.useMemo(() => mergeDunl(validators), [validators])
  const amendments = React.useMemo(() => mergeAmendments(vote, dunl), [vote, dunl])
  return { amendments, dunl }
}
