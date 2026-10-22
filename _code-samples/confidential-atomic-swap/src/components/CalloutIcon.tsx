import type { ReactElement } from 'react'

/** The admonition icons xrpl.org uses: info, tip, caution, and danger. */
export type CalloutKind = 'note' | 'tip' | 'warn' | 'danger'

const PATHS: Record<CalloutKind, ReactElement> = {
  note: (
    <>
      <circle cx='12' cy='12' r='9' />
      <path d='M12 11v5M12 8h.01' />
    </>
  ),
  tip: (
    <>
      <circle cx='12' cy='12' r='9' />
      <path d='M8.5 12.5l2.5 2.5 4.5-5' />
    </>
  ),
  warn: (
    <>
      <path d='M12 4L3 19h18L12 4z' />
      <path d='M12 10v4M12 17h.01' />
    </>
  ),
  danger: (
    <>
      <circle cx='12' cy='12' r='9' />
      <path d='M9 9l6 6M15 9l-6 6' />
    </>
  )
}

export function CalloutIcon ({ kind }: { kind: CalloutKind }) {
  return (
    <svg
      className='callout-icon'
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden
    >
      {PATHS[kind]}
    </svg>
  )
}
