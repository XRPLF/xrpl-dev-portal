import { Badge, Tooltip } from '@mantine/core'
import type { CSSProperties } from 'react'

import { PARTIES, type PartyKey } from '../variables'

/** A party's color, or the app's own accent for the demo harness. */
export function partyColor (party?: PartyKey): string {
  return party ? PARTIES[party].color : 'teal'
}

/**
 * CSS variables that tint an element with a party's color: the fill (also
 * its dot), a shade for small text that reads in either scheme, and two
 * candidate tints for a background. The stylesheet picks the palest shade in
 * light mode, as the demo first shipped, and Mantine's derived dark tint in
 * dark mode, as `--party-soft`.
 */
export function partyVars (party?: PartyKey): CSSProperties {
  const color = partyColor(party)
  return {
    '--party-strong': `var(--mantine-color-${color}-6)`,
    '--party-ink': `var(--mantine-color-${color}-text)`,
    /* Grey's palest shade is the tile's own tone, so grey tints two steps
       deeper to still show as a hover or a fill. */
    '--party-soft-light': `var(--mantine-color-${color}-${color === 'gray' ? 2 : 0})`,
    '--party-soft-dark': `var(--mantine-color-${color}-light)`,
    /* The pill as light mode draws it, so dark mode can draw the same one. */
    '--party-pill-bg': `var(--mantine-color-${color}-1)`,
    '--party-pill-fg': `var(--mantine-color-${color}-9)`
  } as CSSProperties
}

export function partyInitials (party?: PartyKey): string {
  if (!party) {
    return '⚙'
  }
  return (PARTIES[party].name.match(/[A-Z]/gu) ?? []).slice(0, 2).join('')
}

export function PartyBadge ({
  party,
  size = 'sm'
}: {
  party: PartyKey
  size?: string
}) {
  const info = PARTIES[party]
  return (
    <Tooltip label={`${info.roleLabel}. ${info.blurb}`} multiline w={300}>
      <Badge
        variant='light'
        color={partyColor(party)}
        size={size}
        className={`party-badge ${partyColor(party) === 'gray' ? 'badge-gray' : ''}`}
        style={partyVars(party)}
      >
        {info.name}
      </Badge>
    </Tooltip>
  )
}
