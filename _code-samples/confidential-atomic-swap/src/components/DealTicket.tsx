import {
  ActionIcon,
  Badge,
  Card,
  Collapse,
  Group,
  NumberInput,
  Stack,
  Text,
  Tooltip
} from '@mantine/core'
import { useEffect, useState } from 'react'

import {
  TOKENS,
  closingLegCashUnits,
  formatUnits,
  agreedReturnUnits,
  operatingCashUnits,
  type DealTerms
} from '../variables'

const ASSET = TOKENS.asset
const CASH = TOKENS.cash

/**
 * The four terms the reader can set, each stored as integer units at its own
 * scale: 100n TKN at scale 0, 100_000n USD at scale 2 (1,000.00), 10n days,
 * and 500n basis points at scale 2 (5.00%). One table drives both the editable
 * inputs and the locked read-only view.
 */
const TERMS: Array<{
  field: keyof DealTerms
  label: string
  description: string
  suffix: string
  scale: number
  min: number
  max: number
  step: number
}> = [
  {
    field: 'assetUnits',
    label: `Asset (${ASSET.ticker})`,
    description: 'InvestCo sells',
    suffix: '',
    scale: ASSET.assetScale,
    min: 1,
    max: 100_000,
    step: 10
  },
  {
    field: 'cashUnits',
    label: `Cash (${CASH.ticker})`,
    description: 'TradeDesk pays',
    suffix: '',
    scale: CASH.assetScale,
    min: 1,
    max: 1_000_000,
    step: 100
  },
  {
    field: 'termDays',
    label: 'Term (days)',
    description: 'Until the closing leg',
    suffix: ' days',
    scale: 0,
    min: 1,
    max: 365,
    step: 1
  },
  {
    field: 'returnRateBps',
    label: 'Agreed return (% p.a.)',
    description: 'Agreed off-chain',
    suffix: '%',
    scale: 2,
    min: 0,
    max: 25,
    step: 0.25
  }
]

/** The whole deal on one line, for the collapsed ticket. */
function DealSummary ({ deal }: { deal: DealTerms }) {
  return (
    <Text size='sm'>
      {formatUnits(deal.assetUnits, ASSET.assetScale)}{' '}
      {ASSET.ticker} ↔ {formatUnits(deal.cashUnits, CASH.assetScale)}{' '}
      {CASH.ticker} · {deal.termDays.toString()} days @{' '}
      {(Number(deal.returnRateBps) / 100).toFixed(2)}% · closing leg returns{' '}
      <Text span fw={600} c='teal.8'>
        {formatUnits(closingLegCashUnits(deal), CASH.assetScale)} {CASH.ticker}
      </Text>
    </Text>
  )
}

/**
 * The trade's economics, set before the flow starts. The agreed-return math updates
 * live, making it plain that the agreed return is an off-chain agreement the
 * orchestrator turns into an amount. Terms freeze once the first transaction is
 * signed, because the flow's amounts are baked into every step from then on.
 */
export function DealTicket ({
  deal,
  onChange,
  locked
}: {
  deal: DealTerms
  onChange: (deal: DealTerms) => void
  /** Terms freeze once the first on-ledger action has run. */
  locked: boolean
}) {
  const [open, setOpen] = useState(false)

  // Collapse again if the reader expanded it and the terms then lock.
  useEffect(() => {
    if (locked) {
      setOpen(false)
    }
  }, [locked])

  return (
    <Card
      withBorder
      shadow='sm'
      padding={open ? 'md' : 'xs'}
    >
      <Group justify='space-between' wrap='nowrap'>
        <Group gap='sm' wrap='nowrap'>
          <Text fw={700} size='sm'>
            Deal ticket
          </Text>
          <Badge variant='light' size='sm' color={locked ? 'gray' : 'teal'}>
            {locked ? 'Terms locked' : 'Set your terms, then run step 1'}
          </Badge>
        </Group>
        <ActionIcon
          variant='subtle'
          color='gray'
          aria-label={open ? 'Collapse deal ticket' : 'Expand deal ticket'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? '▲' : '▼'}
        </ActionIcon>
      </Group>

      {!open && <DealSummary deal={deal} />}

      <Collapse expanded={open}>
        {/* The four terms divide whatever width the row leaves rather than each
            claiming a fixed one, and fold before any gets too narrow to read. */}
        <Group gap={locked ? 24 : 'xs'} align='flex-start' wrap='wrap' mt='sm'>
          {TERMS.map((term) =>
            locked
              ? (
                <Stack key={term.field} gap={0} style={{ minWidth: 0 }}>
                  <Text size='xs' fw={600} tt='uppercase' c='dimmed' lts='0.05em'>
                    {term.label}
                  </Text>
                  <Text size='sm' fw={700}>
                    {formatUnits(deal[term.field], term.scale)}
                    {term.suffix}
                  </Text>
                </Stack>
                )
              : (
                <NumberInput
                  key={term.field}
                  label={term.label}
                  description={term.description}
                  size='xs'
                  value={Number(deal[term.field]) / 10 ** term.scale}
                  onChange={(value) => {
                    const num = typeof value === 'number' ? value : Number(value)
                    if (!Number.isFinite(num) || num < term.min || num > term.max) {
                      return
                    }
                    onChange({
                      ...deal,
                      [term.field]: BigInt(Math.round(num * 10 ** term.scale))
                    })
                  }}
                  min={term.min}
                  max={term.max}
                  step={term.step}
                  decimalScale={term.scale}
                  allowDecimal={term.scale > 0}
                  style={{ flex: '1 1 108px', minWidth: 0 }}
                />
                )
          )}
        </Group>

        <TicketMath deal={deal} />
      </Collapse>
    </Card>
  )
}

/** The agreed-return math the terms imply, shown under them. */
function TicketMath ({ deal }: { deal: DealTerms }) {
  const agreedReturn = agreedReturnUnits(deal)
  const closingTotal = closingLegCashUnits(deal)
  const operating = operatingCashUnits(deal)
  return (
    <Stack gap={2} mt='sm'>
      <Text size='xs' c='dimmed'>
        Agreed return = {formatUnits(deal.cashUnits, CASH.assetScale)} ×{' '}
        {(Number(deal.returnRateBps) / 100).toFixed(2)}% ×{' '}
        {deal.termDays.toString()}/365 ={' '}
        <Text span fw={600} c='teal.8'>
          {formatUnits(agreedReturn, CASH.assetScale)} {CASH.ticker}
        </Text>
      </Text>
      <Text size='xs' c='dimmed'>
        Closing leg: InvestCo returns{' '}
        <Text span fw={600} c='teal.8'>
          {formatUnits(closingTotal, CASH.assetScale)} {CASH.ticker}
        </Text>{' '}
        for its {formatUnits(deal.assetUnits, ASSET.assetScale)}{' '}
        {ASSET.ticker} ·{' '}
        <Tooltip
          label='The closing leg returns the cash plus the agreed return, so InvestCo carries extra cash to pay it (twice the return, with a 10.00 floor).'
          multiline
          w={300}
        >
          <Text span td='underline dotted' style={{ cursor: 'help' }}>
            operating balance {formatUnits(operating, CASH.assetScale)}{' '}
            {CASH.ticker}
          </Text>
        </Tooltip>
      </Text>
    </Stack>
  )
}
