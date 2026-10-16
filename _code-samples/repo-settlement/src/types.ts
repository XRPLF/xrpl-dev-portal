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

export interface StepCallout {
  kind: 'info' | 'warn'
  title: string
  text: string
}

/**
 * The flow's phases, in order. Consecutive steps sharing a phase form one
 * entry in the stepper, and each phase reports one engagement event when it
 * completes (see analytics.ts), so this list is the contract between the two.
 */
export type Phase =
  | 'Setup'
  | 'Issue'
  | 'Authorize'
  | 'Purchase'
  | 'Convert'
  | 'Near leg'
  | 'Far leg'

export interface StepDefinition {
  id: string
  phase: Phase
  title: string
  actors: PartyKey[]
  /** Narrative shown on the step card. */
  description: string
  /** One aside, or several when a step has more than one thing to warn about. */
  callout?: StepCallout | StepCallout[]
  /** One sentence on what the XRP Ledger contributes in this step. */
  learn?: string
  /** Optional heading shown above the learn note. */
  learnTitle?: string
}
