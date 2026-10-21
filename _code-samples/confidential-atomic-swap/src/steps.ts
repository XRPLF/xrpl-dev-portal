/**
 * The narrative: the deal story told as an ordered storyboard of steps and
 * actions. Nothing here talks to the XRP Ledger directly. Every on-ledger
 * interaction goes through the SwapLedger class in swap.ts, so this file reads
 * as choreography and xrpl.ts reads as protocol.
 */

import {
  COUNTERPARTIES,
  ORCHESTRATOR,
  PARTIES,
  PARTY_KEYS,
  TOKENS,
  closingLegCashUnits,
  formatAmount,
  agreedReturnUnits,
  operatingCashUnits,
  type Counterparty,
  type DealTerms,
  type IssuanceKey,
  type PartyKey
} from './variables'
import type { StepDefinition, StepResult } from './types'
import {
  opSigner,
  type LedgerOp,
  type LegDirection,
  type LegSend,
  type SwapLedger
} from './swap'
import type { TxRecord } from './xrpl'

/**
 * The orchestrator funds every transaction and every object for the parties
 * inside the deal, so each of their actions names it as sponsor. Issuers, which
 * sit outside it, pay their own way.
 */
const SPONSOR = ORCHESTRATOR

/**
 * One user-driven action inside a step. A single party does a single thing.
 * Actions run strictly in order; the UI renders one button per action so the
 * reader performs the choreography instead of watching it.
 */
export interface StepAction {
  id: string
  /** Who acts. Undefined = the demo harness (for example, the faucet). */
  party?: PartyKey
  /** What happens, for example "Sign the batch". */
  label: string
  /** Short verb for the action button, for example "Sign". */
  cta: string
  /** One line on what happens at this exact point in the flow. */
  detail: string
  /**
   * The transaction about to be signed, shown in the console before the reader
   * acts. Returned exactly as it goes to the ledger. Must be synchronous and
   * may throw when earlier state is missing (the UI hides it then).
   */
  preview?: (ledger: SwapLedger) => unknown
  /**
   * Set when the preview is *not* the final transaction, with the reason why.
   * Confidential sends are the case that needs it: their ciphertexts and
   * proofs are generated against live ledger state at submit time, so they
   * cannot exist before the reader clicks.
   */
  previewCaveat?: string
  /**
   * What the console shows while the action runs. Defaults to "Submitting…",
   * which is right for anything that sends a transaction and waits on it. Set
   * it for the purely local actions (construct, sign, combine) and for the
   * faucet-funded setup, so the spinner never claims a submission that isn't
   * happening.
   */
  progress?: string
  execute: (ledger: SwapLedger) => Promise<StepResult>
}

/**
 * An action stated as the operations it submits, rather than as a preview and
 * an execute that have to agree. The ledger builds both from the same
 * declaration, so they cannot disagree.
 */
interface OpAction extends Omit<StepAction, 'preview' | 'previewCaveat' | 'execute'> {
  /** Run in order. The first one is what the console previews. */
  ops: LedgerOp[]
  /** What the console reports afterwards, given the state the ops produced. */
  notes?: string[] | ((ledger: SwapLedger) => string[])
}

export interface RunnableStep extends StepDefinition {
  actions: StepAction[]
}

/**
 * Why a confidential convert cannot be shown in full before it is signed: the
 * SDK encrypts the amount and generates its proof against the account's live
 * confidential state, which happens when the action runs.
 */
const CONVERT_CAVEAT =
  'The encrypted amount, blinding factor, and Zero-Knowledge Proof (ZKP) are generated against live ledger state when you click, so they cannot be shown yet. Everything above is sent as-is.'

/** Why a batch cannot be shown in full before it is constructed. */
const BATCH_CAVEAT =
  'The batch does not exist yet. This is the plan for it. Constructing it generates each inner transaction with its encrypted amount and proof, and the next steps show the real batch.'

/* The narrative names the deal's two tokens by the role each plays in it, so
   the story reads the same whatever they are called. */
const ASSET = TOKENS.asset
const CASH = TOKENS.cash

const fmt = (token: IssuanceKey, units: bigint): string =>
  formatAmount(units, TOKENS[token])
const fmtAsset = (units: bigint): string => fmt('asset', units)
const fmtCash = (units: bigint): string => fmt('cash', units)

/**
 * Turn an op-declared action into a runnable one. The console previews the
 * first operation, and clicking submits every operation in order, so a step
 * that converts and then merges stays one click for the reader.
 */
function opAction (action: OpAction): StepAction {
  const [first] = action.ops
  const { ops, notes, ...rest } = action
  return {
    ...rest,
    party: rest.party ?? opSigner(first),
    preview: (ledger) => ledger.preview(first),
    previewCaveat: first.kind === 'convert' ? CONVERT_CAVEAT : undefined,
    async execute (ledger) {
      const txs: TxRecord[] = []
      for (const op of ops) {
        // Strictly sequential: each operation depends on the state the last one
        // left, and a confidential proof binds to that state.
        txs.push(await ledger.run(op))
      }
      return {
        txs,
        notes: typeof notes === 'function' ? notes(ledger) : (notes ?? [])
      }
    }
  }
}

/** Convert a public balance to confidential, then merge it spendable. */
function convert (
  actor: Counterparty,
  token: IssuanceKey,
  units: bigint,
  extra: Partial<OpAction> = {}
): StepAction {
  const info = TOKENS[token]
  const amount = fmt(token, units)
  return opAction({
    id: `${actor}-convert-${token}`,
    label: `Convert ${amount} and merge`,
    cta: 'Convert',
    detail: `${PARTIES[actor].name} encrypts its ${info.ticker} position, then merges it from inbox to spendable.`,
    ops: [
      { kind: 'convert', actor, token, units, sponsor: SPONSOR },
      { kind: 'merge', actor, token, sponsor: SPONSOR }
    ],
    ...extra
  })
}

/** Create one token's issuance, and report the ID the ledger assigned it. */
function issueToken (token: IssuanceKey, sponsor?: PartyKey): StepAction {
  const info = TOKENS[token]
  const gating = info.requireAuth
    ? 'with RequireAuth gating who may hold it'
    : 'without RequireAuth'
  const cosign =
    sponsor == null ? '' : ` ${PARTIES[sponsor].name} co-signs as sponsor.`
  return opAction({
    id: 'create',
    label: `Create the ${info.ticker} issuance`,
    cta: 'Create',
    detail: `${PARTIES[info.issuer].name} submits MPTokenIssuanceCreate for ${info.ticker}, ${gating}.${cosign}`,
    ops: [{ kind: 'issue', token, sponsor }],
    notes: (ledger) => [
      `${info.ticker} issuance ID: ${ledger.requireIssuance(token)}`
    ]
  })
}

/** Register the issuer's encryption key, which enables confidential balances. */
function registerIssuerKey (token: IssuanceKey, sponsor?: PartyKey): StepAction {
  const info = TOKENS[token]
  return opAction({
    id: 'register-key',
    label: 'Register the encryption key',
    cta: 'Register',
    detail: `${PARTIES[info.issuer].name} registers its encryption public key on the ${info.ticker} issuance with MPTokenIssuanceSet. The private half never leaves the browser.`,
    ops: [{ kind: 'issuerKey', token, sponsor }],
    notes: [`${info.ticker} can now be held confidentially.`]
  })
}

/** One party opts in to hold a token, which creates its MPToken object. */
function optIn (
  actor: PartyKey,
  token: IssuanceKey,
  extra: Partial<OpAction> = {}
): StepAction {
  const info = TOKENS[token]
  return opAction({
    id: `${actor}-optin-${token}`,
    label: `Opt in to hold ${info.ticker}`,
    cta: 'Opt in',
    detail: `${PARTIES[actor].name} submits MPTokenAuthorize so its account can hold ${info.ticker}, and ${PARTIES[SPONSOR].name} co-signs as sponsor and pays the cost and reserve.`,
    ops: [{ kind: 'authorize', actor, token, sponsor: SPONSOR }],
    ...extra
  })
}

/** The issuer approves a holder, the second half of a RequireAuth handshake. */
function approve (holder: PartyKey, token: IssuanceKey): StepAction {
  const info = TOKENS[token]
  const issuer = PARTIES[info.issuer].name
  return opAction({
    id: `approve-${holder}`,
    label: `Approve ${PARTIES[holder].name}`,
    cta: 'Approve',
    detail: `${issuer} authorizes ${PARTIES[holder].name} as a ${info.ticker} holder.`,
    ops: [
      { kind: 'authorize', actor: info.issuer, token, holder, sponsor: SPONSOR }
    ]
  })
}

function pay (
  from: PartyKey,
  to: PartyKey,
  token: IssuanceKey,
  units: bigint,
  extra: Partial<OpAction> & { sponsor?: PartyKey } = {}
): StepAction {
  const { sponsor, ...rest } = extra
  const amount = fmt(token, units)
  return opAction({
    id: `pay-${from}-${to}-${token}`,
    label: `Send ${amount} → ${PARTIES[to].name}`,
    cta: 'Send',
    detail: `${PARTIES[from].name} pays ${PARTIES[to].name} ${amount}.`,
    ops: [{ kind: 'pay', actor: from, to, token, units, sponsor }],
    ...rest
  })
}

function mergeInbox (
  actor: Counterparty,
  token: IssuanceKey,
  extra: Partial<OpAction> = {}
): StepAction {
  const info = TOKENS[token]
  return opAction({
    id: `merge-${actor}`,
    label: `Merge ${info.ticker}`,
    cta: 'Merge',
    detail: `${PARTIES[actor].name} moves the ${info.ticker} it received from its inbox to its spendable balance.`,
    ops: [{ kind: 'merge', actor, token, sponsor: SPONSOR }],
    ...extra
  })
}

function signLeg (
  ledger: SwapLedger,
  direction: LegDirection,
  partyKey: Counterparty
): StepResult {
  const signer = ledger.signLeg(direction, partyKey)
  return {
    txs: [],
    notes: [
      `${PARTIES[partyKey].name}'s signature covers every inner transaction. Any change to the batch breaks it.`
    ],
    artifacts: (signer != null)
      ? [{ label: `${PARTIES[partyKey].name}'s BatchSigner entry`, json: signer }]
      : undefined
  }
}

/**
 * One signing action per counterparty, in signing order. Each party's `detail`
 * says what its own signature authorizes on this leg.
 */
function coSignActions (
  direction: LegDirection,
  details: Record<Counterparty, string>
): StepAction[] {
  return COUNTERPARTIES.map((party) => ({
    id: `sign-${party}`,
    party,
    label: 'Sign the batch',
    cta: 'Sign',
    detail: details[party],
    progress: 'Signing…',
    preview: (ledger: SwapLedger) => ledger.previewUnsignedLeg(direction),
    execute: async (ledger: SwapLedger) => signLeg(ledger, direction, party)
  }))
}

function combineLeg (ledger: SwapLedger, direction: LegDirection): StepResult {
  const accounts = ledger.combineLeg(direction, COUNTERPARTIES)
  return {
    txs: [],
    notes: ['Signatures combined, sorted by account ID as the protocol requires.'],
    artifacts: [{ label: 'Combined signer list', json: accounts }]
  }
}

/** Each counterparty's signature entry, or a note that it hasn't signed yet. */
function previewSigners (ledger: SwapLedger, direction: LegDirection): unknown {
  const entries = ledger.legSigners(direction)
  return COUNTERPARTIES.map(
    (key) => entries[key] ?? `${PARTIES[key].name}: not signed yet`
  )
}

/** Submit a combined leg, noting when an expired batch had to be rebuilt. */
async function submitLeg (
  ledger: SwapLedger,
  direction: LegDirection,
  label: string,
  innerLabels: string[],
  notes: string[],
  rebuild: () => Promise<void>
): Promise<StepResult> {
  const { txs, rebuilt } = await ledger.submitLeg(
    direction,
    ORCHESTRATOR,
    label,
    innerLabels,
    rebuild
  )
  return {
    txs,
    notes: rebuilt
      ? [
          'The submission window expired while you were signing, so the demo rebuilt and re-signed the batch, then submitted it.',
          ...notes
        ]
      : notes
  }
}

/**
 * Build the runnable steps for one set of deal terms. All amounts, labels,
 * and narratives derive from `deal`, so the reader's own numbers flow through
 * the whole settlement.
 */
export function buildSteps (deal: DealTerms): RunnableStep[] {
  const assetAmt = fmtAsset(deal.assetUnits)
  const cashAmt = fmtCash(deal.cashUnits)
  const returnAmt = fmtCash(agreedReturnUnits(deal))
  const closingCashAmt = fmtCash(closingLegCashUnits(deal))
  const opUnits = operatingCashUnits(deal)
  const operatingAmt = fmtCash(opUnits)

  /**
   * The sends one leg settles, declared once: the console previews this plan
   * and the same declaration builds the batch, so they cannot disagree. The
   * closing leg is the opening leg reversed, with the agreed return added to
   * the cash.
   */
  function legSends (direction: LegDirection): LegSend[] {
    const opening = direction === 'opening'
    const [first, second] = COUNTERPARTIES
    const [assetFrom, cashFrom] = opening ? [first, second] : [second, first]
    return [
      {
        from: assetFrom,
        to: cashFrom,
        token: 'asset',
        units: deal.assetUnits
      },
      {
        from: cashFrom,
        to: assetFrom,
        token: 'cash',
        units: opening ? deal.cashUnits : closingLegCashUnits(deal)
      }
    ]
  }

  /** Construct one leg of the swap: every send of that leg in one atomic Batch. */
  async function constructLeg (
    ledger: SwapLedger,
    direction: LegDirection
  ): Promise<StepResult> {
    const unsigned = await ledger.constructLeg(
      direction,
      legSends(direction),
      ORCHESTRATOR
    )
    return {
      txs: [],
      notes: ['Batch constructed. The amounts below are already encrypted.'],
      artifacts: [
        {
          label: `${direction === 'opening' ? 'Opening' : 'Closing'} leg batch (unsigned)`,
          json: unsigned
        }
      ]
    }
  }

  /** Rebuild an expired leg end to end: construct, both signatures, combine. */
  async function rebuildLeg (
    ledger: SwapLedger,
    direction: LegDirection
  ): Promise<void> {
    await constructLeg(ledger, direction)
    for (const party of COUNTERPARTIES) {
      signLeg(ledger, direction, party)
    }
    combineLeg(ledger, direction)
  }

  /** Both legs build the same way, so only the wording differs. */
  function constructAction (
    direction: LegDirection,
    copy: { label: string, detail: string }
  ): StepAction {
    return {
      id: 'construct',
      party: ORCHESTRATOR,
      cta: 'Construct',
      ...copy,
      progress: 'Constructing the batch…',
      preview: (ledger) => ledger.previewPlannedLeg(legSends(direction)),
      previewCaveat: BATCH_CAVEAT,
      execute: async (ledger) => await constructLeg(ledger, direction)
    }
  }

  return [
    {
      id: 'setup',
      phase: 'Setup',
      title: 'Fund the five accounts',
      actors: PARTY_KEYS,
      description:
        'Each party needs a funded XRP Ledger account and a confidential encryption key pair. The account’s own signing keys authorize its transactions, while the separate encryption key pair is what later encrypts that party’s confidential balances. The Devnet faucet funds each account with test XRP, which has no real-world value.',
      callout: {
        kind: 'info',
        title: 'Sponsored transactions',
        text: 'From the first issuance on, the orchestrator (xSecurities) pays the fees and reserves for AlphaFund, InvestCo, and TradeDesk. Watch for the “sponsored” tag on those transactions. Each party signs its own transaction and therefore keeps control of it.'
      },
      actions: [
        {
          id: 'fund',
          label: 'Fund all five wallets',
          cta: 'Fund',
          progress: 'Funding…',
          detail:
            'The Devnet faucet funds each account, and each party derives an encryption key pair for its confidential balances.',
          async execute (ledger) {
            await ledger.connect()
            await Promise.all(
              PARTY_KEYS.map(async (key) => await ledger.initParty(key))
            )
            return {
              txs: [],
              notes: PARTY_KEYS.map(
                (key) =>
                  `${PARTIES[key].name} (${PARTIES[key].roleLabel}): ${ledger.address(key)}`
              ),
              artifacts: [
                {
                  label: 'Encryption public keys, one per party',
                  json: Object.fromEntries(
                    PARTY_KEYS.map((key) => [
                      PARTIES[key].name,
                      ledger.encryptionKey(key)
                    ])
                  )
                }
              ]
            }
          }
        }
      ]
    },
    {
      id: 'issue-asset',
      phase: 'Issue',
      title: `Issue ${ASSET.ticker}, the asset`,
      actors: ['alphaFund', 'xSecurities'],
      description:
        `AlphaFund creates ${ASSET.ticker} as a Multi-Purpose Token (MPT) with three flags. RequireAuth gates who may hold it, CanTransfer allows holder-to-holder transfers, and CanHoldConfidentialBalance enables encrypted balances. Registering AlphaFund’s encryption key switches confidential transfers on and gives the issuer an auditor view of encrypted balances.`,
      callout: {
        kind: 'info',
        title: 'xSecurities pays from here on',
        text: 'The orchestrator sponsors every transaction and every object for AlphaFund, InvestCo, and TradeDesk. Each of them signs its own transaction and therefore keeps control of it.'
      },
      actions: [
        issueToken('asset', SPONSOR),
        registerIssuerKey('asset', SPONSOR)
      ]
    },
    {
      id: 'issue-cash',
      phase: 'Issue',
      title: `Issue ${CASH.ticker}, the cash`,
      actors: ['stableCorp'],
      learnTitle: 'One rail for every token',
      learn:
        'Cash is just another MPT, so tokenized assets and stablecoins settle on the same rails.',
      description:
        `StableCorp issues ${CASH.ticker} exactly as AlphaFund issued ${ASSET.ticker}, minus RequireAuth, so anyone may hold the cash. It registers its encryption key the same way too.`,
      actions: [issueToken('cash'), registerIssuerKey('cash')]
    },
    {
      id: 'distribute-cash',
      phase: 'Issue',
      title: `Send ${CASH.ticker} to TradeDesk`,
      actors: ['stableCorp', 'tradeDesk', 'xSecurities'],
      description:
        `TradeDesk opts in to hold ${CASH.ticker}, then StableCorp sends it the cash it pays in the opening leg. StableCorp sits outside the deal, so it is the one party that pays its own way.`,
      actions: [
        optIn('tradeDesk', 'cash'),
        pay('stableCorp', 'tradeDesk', 'cash', deal.cashUnits, {
          detail: 'StableCorp pays TradeDesk the cash it spends in the opening leg.',
          notes: [`TradeDesk now holds ${cashAmt} publicly.`]
        })
      ]
    },
    {
      id: 'authorize-investco',
      phase: 'Authorize',
      title: 'Authorize InvestCo as a holder',
      actors: ['investCo', 'alphaFund', 'xSecurities'],
      learnTitle: 'Compliance is a protocol-level check',
      learn:
        'Compliance is a protocol-level check rather than application code you write and audit. RequireAuth means the issuer must approve a holder on-ledger before it can hold a single unit.',
      description:
        `${ASSET.ticker} requires authorization, so onboarding is a handshake. The holder opts in, then AlphaFund approves it. InvestCo goes first, and xSecurities pays the cost and reserve on both sides.`,
      actions: [
        optIn('investCo', 'asset'),
        approve('investCo', 'asset')
      ]
    },
    {
      id: 'authorize-tradedesk',
      phase: 'Authorize',
      title: 'Authorize TradeDesk as a holder',
      actors: ['tradeDesk', 'alphaFund', 'xSecurities'],
      description:
        'The counterparty repeats the same handshake. TradeDesk opts in, AlphaFund approves it, and xSecurities pays for both again.',
      actions: [
        optIn('tradeDesk', 'asset'),
        approve('tradeDesk', 'asset')
      ]
    },
    {
      id: 'authorize-cash',
      phase: 'Authorize',
      title: `Authorize InvestCo to hold ${CASH.ticker}`,
      actors: ['investCo', 'xSecurities'],
      description:
        `InvestCo needs to hold ${CASH.ticker} too, because the opening leg pays it in cash. ${CASH.ticker} has no RequireAuth, so opting in is enough and no approval follows.`,
      actions: [
        optIn('investCo', 'cash', {
          detail:
            'InvestCo opts in to USD so it can receive the opening-leg cash, and xSecurities sponsors.',
          notes: [
            'Every object created so far is reserved against xSecurities, not against the party that owns it. Its sponsoring count in the balances panel climbs with each one.'
          ]
        })
      ]
    },
    {
      id: 'primary-purchase',
      phase: 'Purchase',
      title: 'Primary purchase',
      actors: ['alphaFund', 'investCo', 'xSecurities'],
      description:
        `InvestCo buys ${assetAmt} from AlphaFund. The purchase price is agreed off-chain. After confirmation, AlphaFund delivers the tokens with a standard MPT payment, sponsored like everything else it signs.`,
      actions: [
        pay('alphaFund', 'investCo', 'asset', deal.assetUnits, {
          sponsor: SPONSOR,
          label: `Deliver ${assetAmt} → InvestCo`,
          cta: 'Deliver',
          detail:
            'AlphaFund sends the tokens. The purchase price is settled off-chain.',
          notes: [`InvestCo now holds ${assetAmt} publicly.`]
        })
      ]
    },
    {
      id: 'operating-balance',
      phase: 'Convert',
      title: 'Fund InvestCo’s operating balance',
      actors: ['stableCorp', 'investCo'],
      description:
        `The closing leg returns the cash plus a ${returnAmt} agreed return, so InvestCo needs more cash than the ${cashAmt} it is about to receive. StableCorp funds the ${operatingAmt} difference now, while balances are still public and easy to follow.`,
      actions: [
        pay('stableCorp', 'investCo', 'cash', opUnits, {
          label: 'Send the operating balance → InvestCo',
          detail: `StableCorp funds the ${operatingAmt} InvestCo uses to pay the ${returnAmt} agreed return.`
        })
      ]
    },
    {
      id: 'convert-investco',
      phase: 'Convert',
      title: 'InvestCo goes confidential',
      actors: ['investCo', 'xSecurities'],
      description:
        `InvestCo encrypts both positions, the ${assetAmt} it swaps and the ${operatingAmt} cash it pays the agreed return from. Each conversion carries a ZKP, generated in your browser when you click.`,
      callout: {
        kind: 'warn',
        title: 'Convert lands in the inbox',
        text: 'Every confidential balance lands in your inbox first, whether you converted it or received it in a send, and can’t be spent until you merge it into your spendable balance. The merge is always a separate transaction from the convert or send; each action here submits both in one click for convenience.'
      },
      actions: [
        convert('investCo', 'asset', deal.assetUnits),
        convert('investCo', 'cash', opUnits, {
          label: `Convert the ${operatingAmt} operating balance and merge`,
          detail:
            'InvestCo encrypts its operating cash position, then merges it from inbox to spendable.',
          notes: [
            `This convert also registers InvestCo’s ${CASH.ticker} encryption key, which it needs to receive the opening leg.`
          ]
        })
      ]
    },
    {
      id: 'convert-tradedesk',
      phase: 'Convert',
      title: 'TradeDesk goes confidential',
      actors: ['tradeDesk', 'xSecurities'],
      description:
        `TradeDesk encrypts the ${cashAmt} it pays, then registers a ${ASSET.ticker} key so it can receive the asset encrypted. After this every balance in the trade is dark.`,
      actions: [
        convert('tradeDesk', 'cash', deal.cashUnits),
        opAction({
          id: 'tradeDesk-register-asset',
          label: `Register key to receive ${ASSET.ticker}`,
          cta: 'Register',
          detail:
            `A zero-amount convert registers TradeDesk’s key so it can receive ${ASSET.ticker}.`,
          ops: [
            {
              kind: 'convert',
              actor: 'tradeDesk',
              token: 'asset',
              units: 0n,
              sponsor: SPONSOR
            }
          ],
          notes: [
            'A zero-amount convert registers the key without moving funds. Both positions are now dark.'
          ]
        })
      ]
    },
    {
      id: 'open-construct',
      phase: 'Opening leg',
      title: 'Construct the opening leg',
      actors: ['xSecurities'],
      description:
        'xSecurities builds one all-or-nothing Batch with two confidential sends. Each inner transaction carries an encrypted amount and a ZKP that the sender has sufficient balance. Nothing is submitted yet.',
      callout: {
        kind: 'warn',
        title: 'Proofs are perishable',
        text: 'Each proof binds to the sender’s current balance state. Any intervening transaction invalidates it, so construct late and submit promptly.'
      },
      actions: [
        constructAction('opening', {
          label: 'Construct the batch',
          detail:
            'xSecurities prepares both encrypted sends and their proofs in one all-or-nothing batch.'
        })
      ]
    },
    {
      id: 'open-cosign',
      phase: 'Opening leg',
      title: 'Co-sign the opening leg',
      actors: COUNTERPARTIES,
      description:
        'Each counterparty signs the batch to authorize its own send. A signature covers the whole batch, so xSecurities can assemble it but can’t alter it. Any change breaks both signatures.',
      callout: {
        kind: 'info',
        title: 'Signing is an application-layer concern',
        text: 'In production, each party’s custodian signs independently. There is no standard cross-custodian signing API. This demo signs client-side with Devnet wallets.'
      },
      actions: coSignActions('opening', {
        investCo: 'InvestCo authorizes its send by signing the whole batch.',
        tradeDesk: 'TradeDesk authorizes its send by signing the whole batch.'
      })
    },
    {
      id: 'open-submit',
      phase: 'Opening leg',
      title: 'Assemble and submit the opening leg',
      actors: ['xSecurities'],
      learnTitle: 'Atomic settlement',
      learn:
        'Delivery and payment settle in the same instant, so no one risks handing over their side without receiving the other, and no middleman stands in between.',
      callout: {
        kind: 'info',
        title: 'Same flow, different assets',
        text: 'Swap a tokenized asset for a stablecoin and it’s delivery versus payment. Swap two stablecoins and it’s payment versus payment, which covers FX. Swap two tokenized assets and it’s delivery versus delivery. The batch, proofs, and signing are identical in every case.'
      },
      description:
        'xSecurities merges both signatures into one batch, then signs the outer transaction and submits. The ledger checks both signatures, validates both proofs, and applies both sends atomically. Either the full swap settles or nothing does. The received amounts land in each recipient’s confidential inbox.',
      actions: [
        {
          id: 'combine',
          party: 'xSecurities',
          label: 'Combine both signatures',
          cta: 'Combine',
          detail:
            'xSecurities merges both signatures into the BatchSigners array.',
          progress: 'Combining signatures…',
          preview: (ledger) => previewSigners(ledger, 'opening'),
          execute: async (ledger) => await Promise.resolve(combineLeg(ledger, 'opening'))
        },
        {
          id: 'submit',
          party: 'xSecurities',
          label: 'Submit the batch',
          cta: 'Submit',
          detail:
            'xSecurities signs the outer transaction and sends the batch to the ledger.',
          preview: (ledger) => ledger.combinedLeg('opening'),
          execute: async (ledger) =>
            await submitLeg(
              ledger,
              'opening',
              'Opening leg batch',
              [
                `InvestCo → TradeDesk: ${assetAmt} (encrypted)`,
                `TradeDesk → InvestCo: ${cashAmt} (encrypted)`
              ],
              [
                `Opening leg settled. InvestCo received ${cashAmt} and TradeDesk received ${assetAmt}, both in their confidential inboxes.`
              ],
              async () => await rebuildLeg(ledger, 'opening')
            )
        }
      ]
    },
    {
      id: 'open-merge',
      phase: 'Opening leg',
      title: 'Merge the inboxes',
      actors: ['investCo', 'tradeDesk', 'xSecurities'],
      description:
        'Each party merges what it received from its confidential inbox into its spendable balance.',
      callout: {
        kind: 'warn',
        title: 'Required before the closing leg',
        text: 'Inbox funds can’t be spent. Skip this merge and the closing leg’s proofs can’t be built.'
      },
      actions: [
        mergeInbox('investCo', 'cash', {
          label: `Merge received ${CASH.ticker}`
        }),
        mergeInbox('tradeDesk', 'asset', {
          label: `Merge received ${ASSET.ticker}`
        })
      ]
    },
    {
      id: 'close-construct',
      phase: 'Closing leg',
      title: 'Construct the closing leg',
      actors: ['xSecurities'],
      description:
        `${deal.termDays} days later (simulated immediately here), xSecurities builds the closing batch. TradeDesk returns the asset and InvestCo returns the cash plus the agreed return, ${fmtCash(deal.cashUnits)} × ${(Number(deal.returnRateBps) / 100).toFixed(2)}% × ${deal.termDays}/365 = ${returnAmt}. The ledger never calculates the return. The orchestrator embeds the agreed total in the encrypted amount.`,
      callout: {
        kind: 'warn',
        title: 'Proofs are perishable',
        text: 'These proofs bind to the balances the merge just produced. Send anything else from either account and the batch is rejected. Once the batch is prepared it is valid only until a set ledger, so signing and submitting have to finish before that passes. In production, the orchestrator can’t sign for anyone, so handling either case means rebuilding the batch and re-collecting every signature.'
      },
      actions: [
        constructAction('closing', {
          label: 'Construct the closing batch',
          detail:
            'xSecurities prepares the closing sends, with the agreed return added to the cash amount.'
        })
      ]
    },
    {
      id: 'close-cosign',
      phase: 'Closing leg',
      title: 'Co-sign the closing leg',
      actors: COUNTERPARTIES,
      description:
        'The choreography matches the opening leg. Each counterparty signs the closing batch to authorize its own return.',
      actions: coSignActions('closing', {
        investCo: 'InvestCo authorizes returning the cash plus the agreed return.',
        tradeDesk: 'TradeDesk authorizes returning the asset.'
      })
    },
    {
      id: 'close-submit',
      phase: 'Closing leg',
      title: 'Assemble and submit the closing leg',
      actors: ['xSecurities'],
      description:
        'xSecurities combines the signatures and submits the closing leg, exactly as it did for the opening leg.',
      actions: [
        {
          id: 'combine-submit',
          party: 'xSecurities',
          label: 'Combine and submit',
          cta: 'Submit',
          detail:
            'xSecurities merges the signatures and submits the closing leg.',
          preview: (ledger) => previewSigners(ledger, 'closing'),
          async execute (ledger) {
            const combined = combineLeg(ledger, 'closing')
            const submitted = await submitLeg(
              ledger,
              'closing',
              'Closing leg batch',
              [
                `TradeDesk → InvestCo: ${assetAmt} (encrypted)`,
                `InvestCo → TradeDesk: ${closingCashAmt} (encrypted)`
              ],
              ['Closing leg settled. The swap is reversed.'],
              async () => await rebuildLeg(ledger, 'closing')
            )
            return {
              txs: submitted.txs,
              notes: submitted.notes,
              artifacts: combined.artifacts
            }
          }
        }
      ]
    },
    {
      id: 'close-merge',
      phase: 'Closing leg',
      title: 'Final merge',
      actors: ['investCo', 'tradeDesk', 'xSecurities'],
      description:
        `One last merge makes the returned assets spendable. InvestCo ends with its ${assetAmt}. TradeDesk ends with ${closingCashAmt}, its cash plus the ${returnAmt} agreed return. No outside observer ever saw an amount.`,
      actions: [
        mergeInbox('investCo', 'asset', {
          label: `Merge returned ${ASSET.ticker}`,
          detail: 'InvestCo makes its returned asset spendable.'
        }),
        mergeInbox('tradeDesk', 'cash', {
          label: `Merge returned ${CASH.ticker}`,
          detail:
            'TradeDesk makes its returned cash spendable. The trade is closed.',
          notes: [
            `Trade complete. InvestCo holds ${assetAmt} and ${fmtCash(opUnits - agreedReturnUnits(deal))}. TradeDesk holds ${closingCashAmt}.`
          ]
        })
      ]
    }
  ]
}
