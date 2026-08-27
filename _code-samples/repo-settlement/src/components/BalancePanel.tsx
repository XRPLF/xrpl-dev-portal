import { Badge, Card, Code, Group, Stack, Text, Tooltip } from '@mantine/core'
import type { KeyboardEvent, ReactNode } from 'react'
import { dropsToXrp } from 'xrpl'

import type { IdentityBook } from '../App'
import type { BalanceSnapshot } from '../repo'
import type { Decrypted, TokenBalance } from '../xrpl'
import {
  COUNTERPARTIES,
  PARTIES,
  PARTY_KEYS,
  TOKENS,
  TOKEN_KEYS,
  formatUnits,
  issuedToken,
  type IssuanceKey,
  type PartyKey,
  type TokenInfo
} from '../variables'
import { PartyBadge, partyVars } from './PartyBadge'

function xrp (drops: bigint | null): string {
  if (drops == null) {
    return '—'
  }
  return dropsToXrp(drops.toString()).toFixed(2)
}

/* A label and its value side by side rather than stacked, so every figure in
   the panel costs one line: five parties then fit without the reader scrolling
   the ledger to check a balance. The label is optional, for a figure that has
   no counterpart to be distinguished from. */
function Chip ({
  label,
  className,
  children
}: {
  label?: string
  className?: string
  children: ReactNode
}) {
  return (
    <span className={`bal-chip ${className ?? ''}`}>
      {label != null && <span className='bal-chip-label'>{label}</span>}
      {children}
    </span>
  )
}

/** Render a decryption outcome: an amount, an explicit failure, or zero. */
function DecryptedValue ({
  value,
  assetScale
}: {
  value: Decrypted
  assetScale: number
}) {
  if (value == null) {
    return <span className='bal-chip-value'>0</span>
  }
  if ('failed' in value) {
    return (
      <Tooltip label="A ciphertext exists but this key can't decrypt it. Not the same as a zero balance.">
        <span className='bal-chip-value locked-value'>⚠ locked</span>
      </Tooltip>
    )
  }
  return (
    <span className='bal-chip-value'>
      {formatUnits(value.units, assetScale)}
    </span>
  )
}

/** One pot of a holder's confidential wallet: locked ciphertext or a value. */
function Pot ({
  label,
  cipher,
  value,
  assetScale,
  unlocked,
  highlight
}: {
  label: string
  cipher?: string
  value: Decrypted
  assetScale: number
  unlocked: boolean
  highlight?: boolean
}) {
  return (
    <Chip label={label} className={highlight ? 'has-funds' : undefined}>
      {!unlocked && cipher != null
        ? (
          <Tooltip
            label={`On-ledger ciphertext: ${cipher.slice(0, 40)}…`}
            multiline
          >
            <Code c='dimmed' fz={10} px={4}>
              {cipher.slice(0, 6)}…
            </Code>
          </Tooltip>
          )
        : (
          <DecryptedValue value={value} assetScale={assetScale} />
          )}
    </Chip>
  )
}

/** A holder's wallet for one token: the plain balance, then the two encrypted
    pots. Only the pots carry a label, since a bare figure is the public one. */
function WalletRow ({
  token,
  balance,
  unlocked
}: {
  token: TokenInfo
  balance: TokenBalance
  unlocked: boolean
}) {
  const hasConfidential =
    balance.spendableCipher != null || balance.inboxCipher != null
  const inboxFunds =
    unlocked && balance.inbox != null && 'units' in balance.inbox
      ? balance.inbox.units > 0n
      : false
  return (
    <Group gap={6} wrap='nowrap'>
      <Text size='xs' ff='monospace' fw={700} w={40}>
        {token.ticker}
      </Text>
      {balance.publicUnits == null
        ? (
          <Text size='xs' c='dimmed'>
            not opted in
          </Text>
          )
        : (
          <Chip>
            <span className='bal-chip-value'>
              {formatUnits(balance.publicUnits, token.assetScale)}
            </span>
          </Chip>
          )}
      {balance.publicUnits != null && hasConfidential && (
        <>
          <Pot
            label='📥 Inbox'
            cipher={balance.inboxCipher}
            value={balance.inbox}
            assetScale={token.assetScale}
            unlocked={unlocked}
            highlight={inboxFunds}
          />
          <span
            className={`wallet-arrow ${inboxFunds ? 'active' : ''}`}
            aria-hidden
          >
            →
          </span>
          <Pot
            label='🔐 Spend'
            cipher={balance.spendableCipher}
            value={balance.spendable}
            assetScale={token.assetScale}
            unlocked={unlocked}
          />
        </>
      )}
    </Group>
  )
}

/**
 * An issuer's lawful view. Every confidential transaction also encrypts the
 * holder's new balance under the issuer's key, so an issuer can always read
 * the balances of its own token, and only its own token.
 */
function IssuerView ({
  token,
  balances
}: {
  token: IssuanceKey
  balances: BalanceSnapshot
}) {
  const info = TOKENS[token]
  return (
    <Group gap={6} wrap='nowrap' className='issuer-view'>
      <Tooltip
        label={`Your issuer key reads every ${info.ticker} balance.`}
        multiline
      >
        <Text size='xs' c='dimmed' style={{ whiteSpace: 'nowrap' }}>
          🔎 {info.ticker} view
        </Text>
      </Tooltip>
      {COUNTERPARTIES.map((holder) => {
        const view = balances[holder]?.tokens[token]?.issuerView
        return (
          <Chip key={holder} label={PARTIES[holder].name}>
            {view == null
              ? (
                <span className='bal-chip-value dim-value'>—</span>
                )
              : (
                <DecryptedValue value={view} assetScale={info.assetScale} />
                )}
          </Chip>
        )
      })}
    </Group>
  )
}

/**
 * The room: every party's state, always visible next to the flow. Clicking a
 * party makes it "you" — that's the only way to switch identity, so choosing
 * who acts happens where the parties live. The party whose move is next
 * glows. Confidential pots show ciphertexts until a key switch decrypts them;
 * issuers get their own lawful-view switch.
 */
export function BalancePanel ({
  balances,
  identities,
  turnParty,
  viewer,
  onSelect
}: {
  balances: BalanceSnapshot | null
  identities: IdentityBook
  turnParty: PartyKey | null
  /** The reader's selected identity: the only key available for decryption. */
  viewer: PartyKey | null
  /** Become a party: clicking its row hands the reader that party's keys. */
  onSelect: (party: PartyKey) => void
}) {
  const keyActivate = (event: KeyboardEvent, party: PartyKey): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(party)
    }
  }

  return (
    <Card withBorder shadow='sm' padding='sm' className='ledger-card'>
      {/* The heading is the panel's label, so it stays while the parties
          scroll: the card is the same height as the step panel. How the panel
          works sits behind the marker beside it rather than in a standing
          paragraph — it is read once, and the two lines it took were two lines
          of balances. */}
      <Group gap={6} align='center' mb={8}>
        <Text fw={700} size='sm'>
          Account balances
        </Text>
        <Tooltip
          label='Every account on the ledger, live. Click an account to act as that party.'
          multiline
          w={280}
        >
          <span className='panel-hint' tabIndex={0} aria-label='About this panel'>
            ?
          </span>
        </Tooltip>
      </Group>

      <Stack gap={0} className='panel-scroll'>
        {PARTY_KEYS.map((key) => {
          const partyBalances = balances?.[key]
          const identity = identities[key]
          const isHolder = PARTIES[key].role === 'counterparty'
          const issuerToken = issuedToken(key)
          const acting = turnParty === key
          return (
            <div
              key={key}
              className={`party-row clickable ${acting ? 'acting' : ''} ${
                viewer === key ? 'is-you' : ''
              }`}
              style={partyVars(key)}
              role='button'
              tabIndex={0}
              aria-pressed={viewer === key}
              data-party={key}
              onClick={() => onSelect(key)}
              onKeyDown={(event) => keyActivate(event, key)}
            >
              {/* Who the party is, then its address at the end of the same
                  line: the address identifies the party, so it belongs beside
                  the name rather than in the column of amounts below. Every
                  balance then shares the ticker column underneath, XRP
                  included. */}
              <Group align='center' gap={6} wrap='nowrap' mb={4}>
                <PartyBadge party={key} />
                {viewer === key && (
                  <Badge size='xs' variant='filled' color='dark'>
                    you
                  </Badge>
                )}
                <Text size='xs' c='dimmed' truncate style={{ minWidth: 0 }}>
                  {PARTIES[key].roleLabel}
                </Text>
                {acting && (
                  <Text
                    size='xs'
                    fw={700}
                    className='acting-label'
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    ● next
                  </Text>
                )}
                <span className='party-spacer' />
                {identity != null && (
                  <Text ff='monospace' className='party-address'>
                    {identity.address.slice(0, 8)}…{identity.address.slice(-4)}
                  </Text>
                )}
              </Group>
              {partyBalances == null ? (
                <Text size='xs' c='dimmed'>
                  No account yet — run the first step to fund it.
                </Text>
              ) : (
                <Stack gap={6}>
                  {/* XRP first, so it shares the ticker column with the tokens
                      below and all the figures read as one column. */}
                  <Group gap={6} wrap='nowrap'>
                    <Text size='xs' ff='monospace' fw={700} w={40}>
                      XRP
                    </Text>
                    <Chip>
                      <span className='bal-chip-value'>
                        {xrp(partyBalances.xrpDrops)}
                      </span>
                    </Chip>
                  </Group>

                  {/* A sponsored reserve is locked, not spent, so it never
                      appears in the balance above. The XRP amount is what the
                      sponsor actually gives up the use of, so it is stated
                      beside the count the ledger reports. */}
                  {(partyBalances.sponsoringOwnerCount ?? 0) > 0 && (
                    <Tooltip
                      label='Owner reserves this account covers for other accounts. The XRP stays in the balance above but cannot be spent while the sponsorships stand.'
                      multiline
                      w={280}
                    >
                      <Text size='xs' c='teal.8' fw={600}>
                        Sponsoring {partyBalances.sponsoringOwnerCount} owner
                        reserves
                        {partyBalances.sponsoredReserveDrops != null &&
                          ` · ${xrp(partyBalances.sponsoredReserveDrops)} XRP locked`}
                      </Text>
                    </Tooltip>
                  )}

                  {isHolder &&
                    TOKEN_KEYS.map((token) => (
                      <WalletRow
                        key={token}
                        token={TOKENS[token]}
                        balance={partyBalances.tokens[token]}
                        unlocked={viewer === key}
                      />
                    ))}

                  {issuerToken != null && viewer === key && balances != null && (
                    <IssuerView token={issuerToken} balances={balances} />
                  )}
                </Stack>
              )}
            </div>
          )
        })}
      </Stack>
    </Card>
  )
}
