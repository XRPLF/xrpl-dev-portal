/**
 * Narrative types: the shape of the storyboard the UI renders. Everything
 * ledger-facing (transactions, balances, decryption) lives in xrpl.ts, and the
 * deal's own vocabulary in repo.ts.
 */

import type { PartyKey } from './variables'
import type { TxRecord } from './xrpl'

export interface StepArtifact {
  label: string
  json: unknown
}

export interface StepResult {
  txs: TxRecord[]
  notes: string[]
  artifacts?: StepArtifact[]
}

export interface StepDefinition {
  id: string
  phase: string
  title: string
  actors: PartyKey[]
  /** Narrative shown on the step card. */
  description: string
  callout?: { kind: 'info' | 'warn'; title: string; text: string }
  /** One sentence on what the XRP Ledger contributes in this step. */
  learn?: string
}
