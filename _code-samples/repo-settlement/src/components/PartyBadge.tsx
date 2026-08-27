import { Badge, Tooltip } from '@mantine/core'
import type { CSSProperties } from 'react'

import { PARTIES, type PartyKey } from '../variables'

/** A party's color, or the app's own accent for the demo harness. */
export function partyColor (party?: PartyKey): string {
  return party ? PARTIES[party].color : 'teal'
}

/** CSS variables that tint an element with a party's color. */
export function partyVars (party?: PartyKey): CSSProperties {
  const color = partyColor(party)
  return {
    '--party-strong': `var(--mantine-color-${color}-6)`,
    '--party-soft': `var(--mantine-color-${color}-0)`
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
      <Badge variant='light' color={partyColor(party)} size={size}>
        {info.name}
      </Badge>
    </Tooltip>
  )
}
