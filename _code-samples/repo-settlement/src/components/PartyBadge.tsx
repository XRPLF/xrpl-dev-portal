import { Badge, Tooltip } from '@mantine/core'
import type { CSSProperties } from 'react'

import { PARTIES, type PartyKey } from '../variables'

/* Pink, not teal, for InvestCo: teal is the app's own accent, so a teal party
   badge sat the same color as the ✓, the done badge, and the chrome. */
export const PARTY_COLOR: Record<PartyKey, string> = {
  alphaFund: 'violet',
  stableCorp: 'blue',
  investCo: 'pink',
  tradeDesk: 'orange',
  xSecurities: 'gray',
}

/** CSS variables that tint an element with a party's color. */
export function partyVars(party?: PartyKey): CSSProperties {
  const color = party ? PARTY_COLOR[party] : 'teal'
  return {
    '--party-strong': `var(--mantine-color-${color}-6)`,
    '--party-soft': `var(--mantine-color-${color}-0)`,
  } as CSSProperties
}

export function partyInitials(party?: PartyKey): string {
  if (!party) {
    return '⚙'
  }
  return (PARTIES[party].name.match(/[A-Z]/gu) ?? []).slice(0, 2).join('')
}

export function PartyBadge({
  party,
  size = 'sm',
}: {
  party: PartyKey
  size?: string
}) {
  const info = PARTIES[party]
  return (
    <Tooltip label={`${info.role}. ${info.blurb}`} multiline w={300}>
      <Badge variant="light" color={PARTY_COLOR[party]} size={size}>
        {info.name}
      </Badge>
    </Tooltip>
  )
}
