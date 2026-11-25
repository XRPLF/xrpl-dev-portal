// Data for /amendments, which brings the amendment feature pages from
// opensource.ripple.com to xrpl.org. The page renders from a snapshot written
// by tools/fetch-amendment-features.py and refreshes votes from the Validator
// History Service in the browser.

import data from '../../data/amendment-features.json'

export type Resource = {
  title: string
  kind: string
  url: string
  text: string
  github?: string
}

export type Feature = {
  slug: string
  xls: string
  title: string
  summary: string
  description: string
  xls_spec_date: string | null
  devnet_date: string | null
  fixed_dates: { date: string; event: string }[]
  source_url: string
  resources: Resource[]
  subpages: { title: string; url: string }[]
  amendment: string | null
}

export type MainnetState =
  | { status: 'enabled'; date?: string; tx_hash?: string }
  | { status: 'voting'; majority_since?: string | null; eta?: string | null }

export type Amendment = {
  id: string
  name: string
  introduced: string | null
  devnet: boolean
  mainnet?: MainnetState
  // Master keys of default UNL validators voting yes.
  votes?: string[]
  release_date?: string | null
  release_post?: string
}

export type Dunl = {
  newest_ledger: number
  validators: { master_key: string; signing_key: string | null; last_seen: number | null }[]
}

export const snapshot = data as unknown as {
  fetched_at: string
  dunl: Dunl
  features: Feature[]
  amendments: Amendment[]
}

export type Status = 'development' | 'voting' | 'majority' | 'enabled'

export const STAGES: Status[] = ['development', 'voting', 'majority', 'enabled']

export const STATUS_LABELS: Record<Status, string> = {
  development: 'In development',
  voting: 'Open for voting',
  majority: 'Majority',
  enabled: 'Enabled',
}

export const MAJORITY_DAYS = 14
export const DAY = 86400000

export function statusOf(a: Amendment): Status {
  if (a.mainnet?.status === 'enabled') return 'enabled'
  if (a.mainnet?.status === 'voting') return a.mainnet.majority_since || a.mainnet.eta ? 'majority' : 'voting'
  return 'development'
}

// Simulate is an API method with no amendment; it shipped in rippled 2.4.0.
export function featureStatus(f: Feature, byName: Map<string, Amendment>): Status {
  const a = f.amendment ? byName.get(f.amendment) : undefined
  return a ? statusOf(a) : 'enabled'
}

// xrpld stops counting a validator's votes after 24 hours without hearing
// from it: about 21,500 ledgers.
const STALE_LEDGERS = 21500

// An amendment needs more than 80% of the trusted validators heard from in
// the last 24 hours, not 80% of the whole list.
export function neededVotes(active: number): number {
  return active <= 1 ? 1 : Math.floor(active * 0.8) + 1
}

export function voteCount(a: Amendment, dunl: Dunl): { yes: number; active: number; needed: number } | null {
  if (a.mainnet?.status !== 'voting' || !a.votes) return null
  const active = new Set(
    dunl.validators
      .filter(v => v.last_seen !== null && dunl.newest_ledger - v.last_seen <= STALE_LEDGERS)
      .map(v => v.master_key),
  )
  return {
    yes: a.votes.filter(m => active.has(m)).length,
    active: active.size,
    needed: neededVotes(active.size),
  }
}

// Same as tally() in tools/fetch-amendment-features.py, for a live VHS vote
// entry. `newest` is the newest ledger in the whole response.
export function tallyLive(entry: any, dunl: Dunl, newest: number): string[] | undefined {
  const voters: any[] = entry?.voted?.validators
  if (!Array.isArray(voters)) return undefined
  const signing = new Map(
    dunl.validators.filter(v => v.signing_key).map(v => [v.signing_key as string, v.master_key]),
  )
  const seen = new Map<string, number>()
  for (const v of voters) {
    const master = signing.get(v.signing_key)
    const index = Number(v.ledger_index) || 0
    if (master && index > (seen.get(master) ?? -1)) seen.set(master, index)
  }
  return Array.from(seen).filter(([, index]) => newest - index <= STALE_LEDGERS).map(([master]) => master)
}

export function earliestActivation(m?: MainnetState): string | undefined {
  if (m?.status !== 'voting') return undefined
  if (m.eta) return m.eta
  if (m.majority_since) return new Date(Date.parse(m.majority_since) + MAJORITY_DAYS * DAY).toISOString()
  return undefined
}

// The server was called rippled before 3.2.0.
export function serverName(version: string): string {
  const [major, minor] = version.split('.').map(Number)
  return major < 3 || (major === 3 && minor < 2) ? `rippled ${version}` : `xrpld ${version}`
}

export function formatDate(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}

// Fill {{name}} placeholders in a translated sentence, so whole sentences go
// to translate() and translators can reorder the values.
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? String(vars[k]) : m))
}
