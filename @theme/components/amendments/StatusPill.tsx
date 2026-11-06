import * as React from 'react'
import clsx from 'clsx'
import { useThemeHooks } from '@redocly/theme/core/hooks'
import { Status, STATUS_LABELS } from './model'

// Literal class names, so PurgeCSS can see them.
const PILL_CLASS: Record<Status, string> = {
  development: 'amd-pill--development',
  voting: 'amd-pill--voting',
  majority: 'amd-pill--majority',
  enabled: 'amd-pill--enabled',
}

// Stages still in progress get a filled pill; Enabled gets an outline.
export function StatusPill({ status, small = false, label }: { status: Status; small?: boolean; label?: string }) {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  return (
    <span className={clsx('amd-pill', PILL_CLASS[status], small && 'amd-pill--small')}>
      {status === 'enabled' && (
        <svg className="amd-pill__check" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
          <path d="M2 6.5l2.5 2.5L10 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )}
      {label || translate(STATUS_LABELS[status])}
    </span>
  )
}
