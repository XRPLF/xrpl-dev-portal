/**
 * Engagement events, pushed to the Google Tag Manager (GTM) data layer. The
 * tracking plan names one event per phase, fired once when the phase's last
 * action completes, so the events form a funnel: anyone who reaches step 4
 * has by construction passed steps 1 to 3.
 *
 * Under `npm run dev` nothing is sent: each event is logged to the console
 * instead, so the funnel can be checked without a container. A built bundle
 * logs nothing and pushes every event to the data layer, loading GTM when
 * VITE_GTM_ID is set. A build hosted inside a page that already runs GTM
 * (xrpl.org does) reports without any env var at all.
 */

import { CONFIG } from './config'

/** True under the Vite dev server. Events are logged and never sent. */
const LOCAL = import.meta.env.DEV

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

/**
 * The event each phase fires when it completes, keyed by the phase name used
 * in steps.ts. A phase missing here fires nothing.
 */
export const PHASE_EVENTS: Record<string, string> = {
  Setup: 'cas-demo-step1-fund',
  Issue: 'cas-demo-step2-issue-token',
  Authorize: 'cas-demo-step3-authorize',
  Purchase: 'cas-demo-step4-purchase',
  Convert: 'cas-demo-step5-convert',
  'Near leg': 'cas-demo-step6-near-leg',
  'Far leg': 'cas-demo-step7-far-leg'
}

function dataLayer (): unknown[] {
  window.dataLayer ??= []
  return window.dataLayer
}

/**
 * Load GTM once, if configured. Consent defaults match xrpl.org: no analytics
 * cookies until a consent manager grants them, so the tag runs in cookieless
 * mode on a page with no banner.
 */
export function initAnalytics (): void {
  if (LOCAL || CONFIG.gtmId == null || typeof document === 'undefined') {
    return
  }
  const layer = dataLayer()
  // gtag commands must be pushed as an Arguments object, not an array, or
  // GTM's consent handling ignores them. Hence the old-style function.
  // eslint-disable-next-line prefer-rest-params
  function gtag (): void { layer.push(arguments) }
  // @ts-expect-error -- gtag takes variadic arguments by design.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    personalization_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  })
  layer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(CONFIG.gtmId)}`
  document.head.appendChild(script)
}

/**
 * Report a completed phase. Carries nothing from the ledger: no addresses,
 * seeds, or deal terms, just where in the flow the reader got to.
 */
export function trackPhaseComplete (phase: string, phaseIndex: number): void {
  const event = PHASE_EVENTS[phase]
  if (event == null) {
    return
  }
  const payload = {
    event,
    demo: 'repo-settlement',
    phase,
    phase_index: phaseIndex + 1
  }
  if (LOCAL) {
    console.info('[analytics] not sent locally:', payload)
    return
  }
  dataLayer().push(payload)
}
