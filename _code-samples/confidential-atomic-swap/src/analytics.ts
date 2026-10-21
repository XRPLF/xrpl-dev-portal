/**
 * Engagement events, sent straight to Google Analytics 4 with gtag.js. The
 * tracking plan names one event per phase, fired once when the phase's last
 * action completes, so the events form a funnel: anyone who reaches step 4
 * has by construction passed steps 1 to 3. A separate event reports every
 * failed action, so a drop in the funnel can be told apart from a breakage.
 */

import {
  ConnectionError,
  DisconnectedError,
  NotConnectedError,
  RippledError,
  TimeoutError,
  ValidationError,
  XRPLFaucetError,
  XrplError
} from 'xrpl'

import { CONFIG } from './config'
import type { Phase } from './types'
import { LedgerError } from './xrpl'

/** True under the Vite dev server. Events are logged and never sent. */
const LOCAL = import.meta.env.DEV

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/** Sent whenever an action fails, with the step and a classified reason. */
export const ERROR_EVENT = 'cas-demo-error'

/** The event each phase fires when it completes. Every phase must have one. */
export const PHASE_EVENTS: Record<Phase, string> = {
  Setup: 'cas-demo-step1-fund',
  Issue: 'cas-demo-step2-issue-token',
  Authorize: 'cas-demo-step3-authorize',
  Purchase: 'cas-demo-step4-purchase',
  Convert: 'cas-demo-step5-convert',
  'Opening leg': 'cas-demo-step6-opening-leg',
  'Closing leg': 'cas-demo-step7-closing-leg'
}

/**
 * The page-level gtag function, created on first use. gtag.js reads its
 * commands as Arguments objects pushed onto the data layer and ignores plain
 * arrays, hence the old-style inner function.
 * See https://developers.google.com/tag-platform/gtagjs/reference
 */
function gtag (...args: unknown[]): void {
  window.dataLayer ??= []
  window.gtag ??= function () { window.dataLayer?.push(arguments) }
  window.gtag(...args)
}

/**
 * Load gtag.js once, if configured. Analytics storage is granted because the
 * demo holds no personal data and has no consent manager to ask; everything
 * advertising-related stays denied.
 *
 * Opening the page with `?ga_debug` in the URL marks this session's events
 * for GA4's DebugView. Only that session: debug hits can be filtered out of
 * reports as developer traffic, so it must never be on for real visitors.
 */
export function initAnalytics (): void {
  const id = CONFIG.gaMeasurementId
  if (LOCAL || id == null || typeof document === 'undefined') {
    return
  }
  const debug = new URLSearchParams(window.location.search).has('ga_debug')
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'granted',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    personalization_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  })
  gtag('js', new Date())
  gtag('config', id, debug ? { debug_mode: true } : {})

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(script)
}

/** Send one event, or log it under the dev server. */
function send (event: string, params: Record<string, string | number>): void {
  const payload = { demo: 'confidential-atomic-swap', ...params }
  if (LOCAL) {
    console.info('[analytics] not sent locally:', { event, ...payload })
    return
  }
  gtag('event', event, payload)
}

/**
 * Report a completed phase. Carries nothing from the ledger: no addresses,
 * seeds, or deal terms, just where in the flow the reader got to.
 */
export function trackPhaseComplete (phase: Phase, phaseIndex: number): void {
  send(PHASE_EVENTS[phase], { phase, phase_index: phaseIndex + 1 })
}

/** Where in the flow a failure happened. */
export interface ActionContext {
  phase: Phase
  phaseIndex: number
  /** Step and action IDs from steps.ts, for example 'open-submit' / 'submit'. */
  step: string
  /** The step's position within its phase, as the screen shows it. */
  stepIndex: number
  action: string
}

type ErrorClass = new (...args: never[]) => Error

/**
 * The xrpl.js failures worth telling apart, most specific first since the
 * connection errors extend ConnectionError. Labels are literals: the
 * minifier renames classes, so their runtime names are not usable.
 */
const SDK_ERRORS: Array<[ErrorClass, string]> = [
  [XRPLFaucetError, 'faucet'],
  [NotConnectedError, 'not_connected'],
  [DisconnectedError, 'disconnected'],
  [TimeoutError, 'timeout'],
  [ConnectionError, 'connection'],
  [RippledError, 'xrpld'],
  [ValidationError, 'invalid_transaction'],
  [XrplError, 'xrpl_sdk']
]

/**
 * Reduce a failure to a short, bounded label for the error_code dimension:
 * the ledger's result code when it gave one, otherwise which xrpl.js failure
 * it was. The message never leaves the page: it can carry addresses, hashes,
 * and faucet URLs, and free text makes a useless analytics dimension.
 */
export function classifyError (error: unknown): string {
  if (error instanceof LedgerError) {
    return error.code ?? 'ledger'
  }
  const sdk = SDK_ERRORS.find(([cls]) => error instanceof cls)
  if (sdk != null) {
    return sdk[1]
  }
  return error instanceof Error ? 'error' : 'unknown'
}

/** Report a failed action: where it was and a classified reason, nothing else. */
export function trackActionError (context: ActionContext, error: unknown): void {
  send(ERROR_EVENT, {
    phase: context.phase,
    phase_index: context.phaseIndex + 1,
    step: context.step,
    step_index: context.stepIndex + 1,
    action: context.action,
    error_code: classifyError(error)
  })
}
