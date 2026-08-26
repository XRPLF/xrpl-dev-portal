/**
 * The narrative: the deal story told as an ordered storyboard of steps and
 * actions. Nothing here talks to the XRP Ledger directly. Every on-ledger
 * interaction goes through the RepoLedger class in repo.ts, so this file reads
 * as choreography and xrpl.ts reads as protocol.
 */

import {
  CASH,
  COLLATERAL,
  PARTIES,
  farLegCashUnits,
  formatUnits,
  interestUnits,
  operatingCashUnits,
  type DealTerms,
  type PartyKey,
  type TokenInfo,
} from './variables'
import type { StepDefinition, StepResult } from './types'
import type { IssuanceKey, LegDirection, RepoLedger } from './repo'

/** A counterparty to the repo itself, as opposed to an issuer or the orchestrator. */
type Counterparty = 'investCo' | 'tradeDesk'

const COUNTERPARTIES: Counterparty[] = ['investCo', 'tradeDesk']

/**
 * The orchestrator funds every transaction and every object for AlphaFund,
 * InvestCo, and TradeDesk, so each of their actions names it as sponsor. Only
 * StableCorp, which is outside the deal, pays its own way.
 */
const SPONSOR: PartyKey = 'xSecurities'

/**
 * One user-driven action inside a step. A single party does a single thing.
 * Actions run strictly in order; the UI renders one button per action so the
 * reader performs the choreography instead of watching it.
 */
export interface StepAction {
  id: string
  /** Who acts. Undefined = the demo harness (for example, the faucet). */
  party?: PartyKey
  /** What happens, e.g. "Sign the batch". */
  label: string
  /** Short verb for the action button, e.g. "Sign". */
  cta: string
  /** One line on what happens at this exact point in the flow. */
  detail: string
  /**
   * The transaction about to be signed, shown in the console before the reader
   * acts. Returned exactly as it goes to the ledger. Must be synchronous and
   * may throw when earlier state is missing (the UI hides it then).
   */
  preview?: (ledger: RepoLedger) => unknown
  /**
   * Set when the preview is *not* the final transaction, with the reason why.
   * Confidential sends are the case that needs it: their ciphertexts and
   * proofs are generated against live ledger state at submit time, so they
   * cannot exist before the reader clicks.
   */
  previewCaveat?: string
  execute: (ledger: RepoLedger) => Promise<StepResult>
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
  'The encrypted amount, blinding factor, and zero-knowledge proof are generated against live ledger state when you click, so they cannot be shown yet. Everything above is sent as-is.'

/** Why a batch cannot be shown in full before it is constructed. */
const BATCH_CAVEAT =
  'The batch does not exist yet. This is the plan for it. Constructing it generates each inner transaction with its encrypted amount and proof, and the next steps show the real batch.'

const fmtCollateral = (units: bigint): string =>
  `${formatUnits(units, COLLATERAL.assetScale)} ${COLLATERAL.ticker}`
const fmtCash = (units: bigint): string =>
  `${formatUnits(units, CASH.assetScale)} ${CASH.ticker}`

/** Create an issuance and report the ID the ledger assigned it. */
async function createIssuance(
  ledger: RepoLedger,
  token: TokenInfo,
  which: IssuanceKey,
  requireAuth: boolean,
  sponsor?: PartyKey,
): Promise<StepResult> {
  const { record, issuanceID } = await ledger.createIssuance(
    token,
    which,
    requireAuth,
    `Create the ${token.ticker} issuance`,
    sponsor,
  )
  return {
    txs: [record],
    notes: [`${token.ticker} issuance ID: ${issuanceID}`],
  }
}

/** Register the issuer's encryption key on its issuance. */
async function registerIssuerKey(
  ledger: RepoLedger,
  token: TokenInfo,
  which: IssuanceKey,
  sponsor?: PartyKey,
): Promise<StepResult> {
  const record = await ledger.registerIssuerKey(
    token,
    which,
    `Register ${PARTIES[token.issuer].name}'s encryption key`,
    sponsor,
  )
  return {
    txs: [record],
    notes: [`${token.ticker} can now be held confidentially.`],
  }
}

/** Convert a public balance to confidential, then merge it spendable. */
async function convertAndMerge(
  ledger: RepoLedger,
  partyKey: Counterparty,
  which: IssuanceKey,
  units: bigint,
  what: string,
): Promise<StepResult> {
  const name = PARTIES[partyKey].name
  const convertRecord = await ledger.convertToConfidential(
    partyKey,
    which,
    units,
    `${name}: convert ${what} → confidential inbox`,
    SPONSOR,
  )
  const mergeRecord = await ledger.mergeInbox(
    partyKey,
    which,
    `${name}: merge inbox → spendable`,
    SPONSOR,
  )
  return { txs: [convertRecord, mergeRecord], notes: [] }
}

/** Merge one party's confidential inbox into its spendable balance. */
async function mergeInbox(
  ledger: RepoLedger,
  partyKey: Counterparty,
  which: IssuanceKey,
  what: string,
): Promise<StepResult> {
  const record = await ledger.mergeInbox(
    partyKey,
    which,
    `${PARTIES[partyKey].name}: ${what} inbox → spendable`,
    SPONSOR,
  )
  return { txs: [record], notes: [] }
}

/** Sign a constructed leg as one counterparty. */
function signLeg(
  ledger: RepoLedger,
  direction: LegDirection,
  partyKey: Counterparty,
): StepResult {
  const signer = ledger.signLeg(direction, partyKey)
  return {
    txs: [],
    notes: [
      `${PARTIES[partyKey].name}'s signature covers every inner transaction. Any change to the batch breaks it.`,
    ],
    artifacts: signer
      ? [{ label: `${PARTIES[partyKey].name}'s BatchSigner entry`, json: signer }]
      : undefined,
  }
}

/** Combine both counterparties' signatures into one submittable batch. */
function combineLeg(ledger: RepoLedger, direction: LegDirection): StepResult {
  const accounts = ledger.combineLeg(direction, COUNTERPARTIES)
  return {
    txs: [],
    notes: ['Signatures combined, sorted by account ID as the protocol requires.'],
    artifacts: [{ label: 'Combined signer list', json: accounts }],
  }
}

/** Each counterparty's signature entry, or a note that it hasn't signed yet. */
function previewSigners(ledger: RepoLedger, direction: LegDirection): unknown {
  const entries = ledger.legSigners(direction)
  return COUNTERPARTIES.map(
    (key) => entries[key] ?? `${PARTIES[key].name}: not signed yet`,
  )
}

/** Submit a combined leg, noting when an expired batch had to be rebuilt. */
async function submitLeg(
  ledger: RepoLedger,
  direction: LegDirection,
  label: string,
  innerLabels: string[],
  notes: string[],
  rebuild: () => Promise<void>,
): Promise<StepResult> {
  const { txs, rebuilt } = await ledger.submitLeg(
    direction,
    'xSecurities',
    label,
    innerLabels,
    rebuild,
  )
  return {
    txs,
    notes: rebuilt
      ? [
          'The submission window expired while you were signing, so the demo rebuilt and re-signed the batch, then submitted it.',
          ...notes,
        ]
      : notes,
  }
}

/**
 * Build the runnable steps for one set of deal terms. All amounts, labels,
 * and narratives derive from `deal`, so the reader's own numbers flow through
 * the whole settlement.
 */
// eslint-disable-next-line max-lines-per-function -- a linear storyboard reads best in one place
export function buildSteps(deal: DealTerms): RunnableStep[] {
  const collateralAmt = fmtCollateral(deal.collateralUnits)
  const cashAmt = fmtCash(deal.cashUnits)
  const interestAmt = fmtCash(interestUnits(deal))
  const farCashAmt = fmtCash(farLegCashUnits(deal))
  const opUnits = operatingCashUnits(deal)
  const operatingAmt = fmtCash(opUnits)

  /** Construct one repo leg: two confidential sends in one atomic Batch. */
  async function constructLeg(
    ledger: RepoLedger,
    direction: LegDirection,
  ): Promise<StepResult> {
    const near = direction === 'near'
    const unsigned = await ledger.constructLeg(
      direction,
      {
        collateralSender: near ? 'investCo' : 'tradeDesk',
        collateralReceiver: near ? 'tradeDesk' : 'investCo',
        cashSender: near ? 'tradeDesk' : 'investCo',
        cashReceiver: near ? 'investCo' : 'tradeDesk',
      },
      {
        collateralUnits: deal.collateralUnits,
        cashUnits: near ? deal.cashUnits : farLegCashUnits(deal),
      },
      'xSecurities',
    )
    return {
      txs: [],
      notes: ['Batch constructed. The amounts below are already encrypted.'],
      artifacts: [{ label: `${direction} leg batch (unsigned)`, json: unsigned }],
    }
  }

  /** Rebuild an expired leg end to end: construct, both signatures, combine. */
  async function rebuildLeg(
    ledger: RepoLedger,
    direction: LegDirection,
  ): Promise<void> {
    await constructLeg(ledger, direction)
    signLeg(ledger, direction, 'investCo')
    signLeg(ledger, direction, 'tradeDesk')
    combineLeg(ledger, direction)
  }

  return [
    {
      id: 'setup',
      phase: 'Setup',
      title: 'Fund the five accounts',
      actors: ['alphaFund', 'stableCorp', 'investCo', 'tradeDesk', 'xSecurities'],
      learn:
        'An account and a keypair are all a party needs to join. In production each party holds its own keys with its own custodian; no single machine sees all five.',
      description:
        'Each party needs a funded XRPL account and an encryption keypair. The encryption keypair is what later encrypts that party’s confidential balances.',
      actions: [
        {
          id: 'fund',
          label: 'Fund all five wallets',
          cta: 'Fund',
          detail:
            'Each party gets a funded account and an encryption keypair for its confidential balances.',
          async execute(ledger) {
            await ledger.connect()
            const keys = [
              'alphaFund',
              'stableCorp',
              'investCo',
              'tradeDesk',
              'xSecurities',
            ] as const
            await Promise.all(keys.map(async (key) => ledger.initParty(key)))
            return {
              txs: [],
              notes: keys.map(
                (key) =>
                  `${PARTIES[key].name} (${PARTIES[key].role}): ${ledger.address(key)}`,
              ),
              artifacts: [
                {
                  label: 'Encryption public keys, one per party',
                  json: Object.fromEntries(
                    keys.map((key) => [
                      PARTIES[key].name,
                      ledger.encryptionKey(key),
                    ]),
                  ),
                },
              ],
            }
          },
        },
      ],
    },
    {
      id: 'issue-collateral',
      phase: 'Issue',
      title: `Issue ${COLLATERAL.ticker}, the collateral`,
      actors: ['alphaFund', 'xSecurities'],
      description:
        `AlphaFund creates ${COLLATERAL.ticker} as a Multi-Purpose Token with three flags. RequireAuth gates who may hold it, CanTransfer allows holder-to-holder transfers, and CanHoldConfidentialBalance enables encrypted balances. Registering AlphaFund’s encryption key switches confidential transfers on and gives the issuer a lawful view of encrypted balances.`,
      callout: {
        kind: 'info',
        title: 'xSecurities pays from here on',
        text: 'The orchestrator sponsors every transaction and every object for AlphaFund, InvestCo, and TradeDesk. Each of them still signs, and therefore still controls, its own transaction.',
      },
      actions: [
        {
          id: 'create',
          party: 'alphaFund',
          label: `Create the ${COLLATERAL.ticker} issuance`,
          cta: 'Create',
          detail:
            'AlphaFund submits MPTokenIssuanceCreate, defining tMMF and its flags on the ledger. xSecurities co-signs as sponsor.',
          preview: (ledger) =>
            ledger.previewCreateIssuance(COLLATERAL, true, SPONSOR),
          execute: (ledger) =>
            createIssuance(ledger, COLLATERAL, 'collateral', true, SPONSOR),
        },
        {
          id: 'register-key',
          party: 'alphaFund',
          label: 'Register the encryption key',
          cta: 'Register',
          detail:
            'AlphaFund registers its encryption public key on the issuance with MPTokenIssuanceSet. The private half never leaves the browser.',
          preview: (ledger) =>
            ledger.previewRegisterIssuerKey(COLLATERAL, 'collateral', SPONSOR),
          execute: (ledger) =>
            registerIssuerKey(ledger, COLLATERAL, 'collateral', SPONSOR),
        },
      ],
    },
    {
      id: 'issue-cash',
      phase: 'Issue',
      title: `Issue ${CASH.ticker}, the cash`,
      actors: ['stableCorp'],
      learn:
        'Cash is just another MPT, so fund tokens and stablecoins settle on the same rails.',
      description:
        `StableCorp issues ${CASH.ticker} exactly as AlphaFund issued ${COLLATERAL.ticker}, minus RequireAuth, so anyone may hold the cash. It registers its encryption key the same way too.`,
      actions: [
        {
          id: 'create',
          party: 'stableCorp',
          label: `Create the ${CASH.ticker} issuance`,
          cta: 'Create',
          detail:
            'StableCorp submits MPTokenIssuanceCreate for USD, without RequireAuth.',
          preview: (ledger) => ledger.previewCreateIssuance(CASH, false),
          execute: (ledger) => createIssuance(ledger, CASH, 'cash', false),
        },
        {
          id: 'register-key',
          party: 'stableCorp',
          label: 'Register the encryption key',
          cta: 'Register',
          detail:
            'StableCorp registers its encryption public key on the USD issuance. The private half never leaves the browser.',
          preview: (ledger) => ledger.previewRegisterIssuerKey(CASH, 'cash'),
          execute: (ledger) => registerIssuerKey(ledger, CASH, 'cash'),
        },
      ],
    },
    {
      id: 'distribute-cash',
      phase: 'Issue',
      title: `Send ${CASH.ticker} to TradeDesk`,
      actors: ['stableCorp', 'tradeDesk', 'xSecurities'],
      description:
        `TradeDesk opts in to hold ${CASH.ticker}, then StableCorp sends it the cash it pays in the near leg. StableCorp sits outside the deal, so it is the one party that pays its own way.`,
      actions: [
        {
          id: 'optin',
          party: 'tradeDesk',
          label: `Opt in to hold ${CASH.ticker}`,
          cta: 'Opt in',
          detail:
            'TradeDesk submits MPTokenAuthorize so its account can hold USD, sponsored by xSecurities.',
          preview: (ledger) =>
            ledger.previewAuthorize('tradeDesk', 'cash', { sponsor: SPONSOR }),
          async execute(ledger) {
            const record = await ledger.authorize(
              'tradeDesk',
              'cash',
              `TradeDesk: opt in to hold ${CASH.ticker}`,
              { sponsor: SPONSOR },
            )
            return { txs: [record], notes: [] }
          },
        },
        {
          id: 'distribute',
          party: 'stableCorp',
          label: `Send ${cashAmt} → TradeDesk`,
          cta: 'Send',
          detail:
            'StableCorp pays TradeDesk the cash it spends in the near leg.',
          preview: (ledger) =>
            ledger.previewPayToken(
              'stableCorp',
              'tradeDesk',
              'cash',
              deal.cashUnits,
            ),
          async execute(ledger) {
            const record = await ledger.payToken(
              'stableCorp',
              'tradeDesk',
              'cash',
              deal.cashUnits,
              `StableCorp: send ${cashAmt} → TradeDesk`,
            )
            return {
              txs: [record],
              notes: [`TradeDesk now holds ${cashAmt} publicly.`],
            }
          },
        },
      ],
    },
    {
      id: 'authorize-investco',
      phase: 'Authorize',
      title: 'Authorize InvestCo as a holder',
      actors: ['investCo', 'alphaFund', 'xSecurities'],
      learn:
        'Compliance is a protocol-level check rather than application code you write and audit. RequireAuth means the issuer must approve a holder on-ledger before it can hold a single unit.',
      description:
        `${COLLATERAL.ticker} requires authorization, so onboarding is a handshake. The holder opts in, then AlphaFund approves it. InvestCo goes first, and xSecurities pays the cost and reserve on both sides.`,
      actions: [
        {
          id: 'investco-optin-collateral',
          party: 'investCo',
          label: `Opt in to ${COLLATERAL.ticker}`,
          cta: 'Opt in',
          detail:
            'InvestCo signs the opt-in, and xSecurities co-signs as sponsor and pays the cost and reserve.',
          preview: (ledger) =>
            ledger.previewAuthorize('investCo', 'collateral', {
              sponsor: SPONSOR,
            }),
          async execute(ledger) {
            const record = await ledger.authorize(
              'investCo',
              'collateral',
              `InvestCo: opt in to hold ${COLLATERAL.ticker}`,
              { sponsor: SPONSOR },
            )
            return { txs: [record], notes: [] }
          },
        },
        {
          id: 'approve-investco',
          party: 'alphaFund',
          label: 'Approve InvestCo',
          cta: 'Approve',
          detail:
            'AlphaFund authorizes InvestCo as a tMMF holder.',
          preview: (ledger) =>
            ledger.previewAuthorize('alphaFund', 'collateral', {
              holder: 'investCo',
              sponsor: SPONSOR,
            }),
          async execute(ledger) {
            const record = await ledger.authorize(
              'alphaFund',
              'collateral',
              'AlphaFund: approve InvestCo',
              { holder: 'investCo', sponsor: SPONSOR },
            )
            return { txs: [record], notes: [] }
          },
        },
      ],
    },
    {
      id: 'authorize-tradedesk',
      phase: 'Authorize',
      title: 'Authorize TradeDesk as a holder',
      actors: ['tradeDesk', 'alphaFund', 'xSecurities'],
      description:
        'The buyer repeats the same handshake. TradeDesk opts in, AlphaFund approves it, and xSecurities pays for both again.',
      actions: [
        {
          id: 'tradedesk-optin-collateral',
          party: 'tradeDesk',
          label: `Opt in to ${COLLATERAL.ticker}`,
          cta: 'Opt in',
          detail:
            'TradeDesk signs the opt-in, and xSecurities co-signs as sponsor and pays the cost and reserve.',
          preview: (ledger) =>
            ledger.previewAuthorize('tradeDesk', 'collateral', {
              sponsor: SPONSOR,
            }),
          async execute(ledger) {
            const record = await ledger.authorize(
              'tradeDesk',
              'collateral',
              `TradeDesk: opt in to hold ${COLLATERAL.ticker}`,
              { sponsor: SPONSOR },
            )
            return { txs: [record], notes: [] }
          },
        },
        {
          id: 'approve-tradedesk',
          party: 'alphaFund',
          label: 'Approve TradeDesk',
          cta: 'Approve',
          detail:
            'AlphaFund authorizes TradeDesk as a tMMF holder.',
          preview: (ledger) =>
            ledger.previewAuthorize('alphaFund', 'collateral', {
              holder: 'tradeDesk',
              sponsor: SPONSOR,
            }),
          async execute(ledger) {
            const record = await ledger.authorize(
              'alphaFund',
              'collateral',
              'AlphaFund: approve TradeDesk',
              { holder: 'tradeDesk', sponsor: SPONSOR },
            )
            return { txs: [record], notes: [] }
          },
        },
      ],
    },
    {
      id: 'authorize-cash',
      phase: 'Authorize',
      title: `Authorize InvestCo to hold ${CASH.ticker}`,
      actors: ['investCo', 'xSecurities'],
      learn:
        'A sponsor can pay another account’s fee and reserve while that account still signs, and therefore still controls, its own transaction.',
      description:
        `InvestCo needs to hold ${CASH.ticker} too, because the near leg pays it in cash. ${CASH.ticker} has no RequireAuth, so opting in is enough and no approval follows.`,
      actions: [
        {
          id: 'investco-optin-cash',
          party: 'investCo',
          label: `Opt in to ${CASH.ticker}`,
          cta: 'Opt in',
          detail:
            'InvestCo opts in to USD so it can receive the near-leg cash, and xSecurities sponsors.',
          preview: (ledger) =>
            ledger.previewAuthorize('investCo', 'cash', {
              sponsor: SPONSOR,
            }),
          async execute(ledger) {
            const record = await ledger.authorize(
              'investCo',
              'cash',
              `InvestCo: opt in to hold ${CASH.ticker}`,
              { sponsor: SPONSOR },
            )
            return {
              txs: [record],
              notes: [
                'Every object created so far is reserved against xSecurities, not against the party that owns it. Its sponsoring count in the balances panel climbs with each one.',
              ],
            }
          },
        },
      ],
    },
    {
      id: 'primary-purchase',
      phase: 'Purchase',
      title: 'Primary purchase',
      actors: ['alphaFund', 'investCo', 'xSecurities'],
      learn:
        'Delivery is one payment with finality in seconds. AlphaFund’s active role ends here, and the repo itself is strictly between InvestCo and TradeDesk.',
      description:
        `InvestCo buys ${collateralAmt} from AlphaFund. The purchase price settles off-chain. After confirmation, AlphaFund delivers the tokens with a standard MPT payment, sponsored like everything else it signs.`,
      actions: [
        {
          id: 'deliver',
          party: 'alphaFund',
          label: `Deliver ${collateralAmt} → InvestCo`,
          cta: 'Deliver',
          detail:
            'AlphaFund sends the fund tokens. The purchase price settled off-chain.',
          preview: (ledger) =>
            ledger.previewPayToken(
              'alphaFund',
              'investCo',
              'collateral',
              deal.collateralUnits,
              SPONSOR,
            ),
          async execute(ledger) {
            const record = await ledger.payToken(
              'alphaFund',
              'investCo',
              'collateral',
              deal.collateralUnits,
              `AlphaFund: deliver ${collateralAmt} → InvestCo`,
              SPONSOR,
            )
            return {
              txs: [record],
              notes: [`InvestCo now holds ${collateralAmt} publicly.`],
            }
          },
        },
      ],
    },
    {
      id: 'operating-balance',
      phase: 'Convert',
      title: 'Fund InvestCo’s operating balance',
      actors: ['stableCorp', 'investCo'],
      description:
        `The far leg returns principal plus ${interestAmt} interest, so InvestCo needs more cash than the ${cashAmt} it is about to receive. StableCorp funds the ${operatingAmt} difference now, while balances are still public and easy to follow.`,
      actions: [
        {
          id: 'fund-operating',
          party: 'stableCorp',
          label: 'Send the operating balance → InvestCo',
          cta: 'Send',
          detail: `StableCorp funds the ${operatingAmt} InvestCo uses to pay the ${interestAmt} far-leg interest.`,
          preview: (ledger) =>
            ledger.previewPayToken('stableCorp', 'investCo', 'cash', opUnits),
          async execute(ledger) {
            const record = await ledger.payToken(
              'stableCorp',
              'investCo',
              'cash',
              opUnits,
              `StableCorp: send ${operatingAmt} → InvestCo`,
            )
            return { txs: [record], notes: [] }
          },
        },
      ],
    },
    {
      id: 'convert-investco',
      phase: 'Convert',
      title: 'InvestCo goes confidential',
      actors: ['investCo', 'xSecurities'],
      description:
        `InvestCo encrypts both positions, the ${collateralAmt} it lends out and the ${operatingAmt} cash it pays interest from. Each conversion carries a zero-knowledge proof, generated in your browser when you click.`,
      callout: [
        {
          kind: 'warn',
          title: 'Convert lands in the inbox',
          text: 'A converted balance can’t be spent until you merge it from the inbox. Each action here converts and merges in one go; between the repo legs you do the merge yourself.',
        },
        // {
        //   kind: 'info',
        //   title: 'Fee only, no reserve',
        //   text: 'A convert and a merge move value inside an MPToken that already exists, so there is no new object to reserve. xSecurities sponsors the fee alone, and the reserve on that MPToken is the one it already took on at the opt-in.',
        // },
      ],
      actions: [
        {
          id: 'investco-convert-collateral',
          party: 'investCo',
          label: `Convert ${collateralAmt} and merge`,
          cta: 'Convert',
          detail:
            'InvestCo encrypts its tMMF position, then merges it from inbox to spendable.',
          preview: (ledger) =>
            ledger.previewConvert(
              'investCo',
              'collateral',
              deal.collateralUnits,
              SPONSOR,
            ),
          previewCaveat: CONVERT_CAVEAT,
          execute: (ledger) =>
            convertAndMerge(
              ledger,
              'investCo',
              'collateral',
              deal.collateralUnits,
              collateralAmt,
            ),
        },
        {
          id: 'investco-convert-cash',
          party: 'investCo',
          label: `Convert the ${operatingAmt} operating balance and merge`,
          cta: 'Convert',
          detail:
            'InvestCo encrypts its operating cash, which also registers its USD key.',
          preview: (ledger) =>
            ledger.previewConvert('investCo', 'cash', opUnits, SPONSOR),
          previewCaveat: CONVERT_CAVEAT,
          async execute(ledger) {
            const result = await convertAndMerge(
              ledger,
              'investCo',
              'cash',
              opUnits,
              operatingAmt,
            )
            return {
              ...result,
              notes: [
                `This convert also registers InvestCo’s ${CASH.ticker} encryption key, which it needs to receive the near leg.`,
              ],
            }
          },
        },
      ],
    },
    {
      id: 'convert-tradedesk',
      phase: 'Convert',
      title: 'TradeDesk goes confidential',
      actors: ['tradeDesk', 'xSecurities'],
      // learn:
      //   'A zero-amount convert is how an account registers its encryption key without moving any funds.',
      description:
        `TradeDesk encrypts the ${cashAmt} it pays, then registers a ${COLLATERAL.ticker} key so it can receive the collateral encrypted. After this every balance in the trade is dark.`,
      actions: [
        {
          id: 'tradedesk-convert-cash',
          party: 'tradeDesk',
          label: `Convert ${cashAmt} and merge`,
          cta: 'Convert',
          detail: 'TradeDesk encrypts its USD, then merges it spendable.',
          preview: (ledger) =>
            ledger.previewConvert('tradeDesk', 'cash', deal.cashUnits, SPONSOR),
          previewCaveat: CONVERT_CAVEAT,
          execute: (ledger) =>
            convertAndMerge(ledger, 'tradeDesk', 'cash', deal.cashUnits, cashAmt),
        },
        {
          id: 'tradedesk-register-collateral',
          party: 'tradeDesk',
          label: `Register key to receive ${COLLATERAL.ticker}`,
          cta: 'Register',
          detail:
            'A zero-amount convert registers TradeDesk’s key so it can receive tMMF.',
          preview: (ledger) =>
            ledger.previewConvert('tradeDesk', 'collateral', 0n, SPONSOR),
          previewCaveat: CONVERT_CAVEAT,
          async execute(ledger) {
            const record = await ledger.convertToConfidential(
              'tradeDesk',
              'collateral',
              0n,
              `TradeDesk: register encryption key for ${COLLATERAL.ticker}`,
              SPONSOR,
            )
            return {
              txs: [record],
              notes: [
                'A zero-amount convert registers the key without moving funds. Both positions are now dark.',
              ],
            }
          },
        },
      ],
    },
    {
      id: 'near-construct',
      phase: 'Near leg',
      title: 'Construct the near leg',
      actors: ['xSecurities'],
      description:
        'xSecurities builds one all-or-nothing Batch with two confidential sends. Each inner transaction carries an encrypted amount and a zero-knowledge proof that the sender has sufficient balance. Nothing is submitted yet.',
      callout: {
        kind: 'warn',
        title: 'Proofs are perishable',
        text: 'Each proof binds to the sender’s current balance state. Any intervening transaction invalidates it, so construct late and submit promptly.',
      },
      actions: [
        {
          id: 'construct',
          party: 'xSecurities',
          label: 'Construct the batch',
          cta: 'Construct',
          detail:
            'xSecurities prepares both encrypted sends and their proofs in one all-or-nothing batch.',
          preview: (ledger) =>
            ledger.previewPlannedLeg(
              'InvestCo',
              'TradeDesk',
              collateralAmt,
              cashAmt,
            ),
          previewCaveat: BATCH_CAVEAT,
          execute: (ledger) => constructLeg(ledger, 'near'),
        },
      ],
    },
    {
      id: 'near-cosign',
      phase: 'Near leg',
      title: 'Co-sign the near leg',
      actors: ['investCo', 'tradeDesk'],
      description:
        'Each counterparty signs the batch to authorize its own send. A signature covers the whole batch, so xSecurities can assemble it but can’t alter it. Any change breaks both signatures.',
      callout: {
        kind: 'info',
        title: 'Signing is an application-layer concern',
        text: 'In production, each party’s custodian signs independently. There is no standard cross-custodian signing API. This demo signs client-side with Devnet wallets.',
      },
      actions: [
        {
          id: 'sign-investco',
          party: 'investCo',
          label: 'Sign the batch',
          cta: 'Sign',
          detail:
            'InvestCo authorizes its send by signing the whole batch.',
          preview: (ledger) => ledger.previewUnsignedLeg('near'),
          execute: (ledger) =>
            Promise.resolve(signLeg(ledger, 'near', 'investCo')),
        },
        {
          id: 'sign-tradedesk',
          party: 'tradeDesk',
          label: 'Sign the batch',
          cta: 'Sign',
          detail:
            'TradeDesk authorizes its send by signing the whole batch.',
          preview: (ledger) => ledger.previewUnsignedLeg('near'),
          execute: (ledger) =>
            Promise.resolve(signLeg(ledger, 'near', 'tradeDesk')),
        },
      ],
    },
    {
      id: 'near-submit',
      phase: 'Near leg',
      title: 'Assemble and submit the near leg',
      actors: ['xSecurities'],
      learn:
        'Atomic delivery versus payment, with no settlement risk and no clearing house.',
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
          preview: (ledger) => previewSigners(ledger, 'near'),
          execute: (ledger) => Promise.resolve(combineLeg(ledger, 'near')),
        },
        {
          id: 'submit',
          party: 'xSecurities',
          label: 'Submit the batch',
          cta: 'Submit',
          detail:
            'xSecurities signs the outer transaction and sends the batch to the ledger.',
          preview: (ledger) => ledger.combinedLeg('near'),
          execute: (ledger) =>
            submitLeg(
              ledger,
              'near',
              'Near leg batch',
              [
                `InvestCo → TradeDesk: ${collateralAmt} (encrypted)`,
                `TradeDesk → InvestCo: ${cashAmt} (encrypted)`,
              ],
              [
                `Near leg settled. InvestCo received ${cashAmt} and TradeDesk received ${collateralAmt}, both in their confidential inboxes.`,
              ],
              async () => rebuildLeg(ledger, 'near'),
            ),
        },
      ],
    },
    {
      id: 'near-merge',
      phase: 'Near leg',
      title: 'Merge the inboxes',
      actors: ['investCo', 'tradeDesk', 'xSecurities'],
      description:
        'Each party merges what it received from its confidential inbox into its spendable balance.',
      callout: {
        kind: 'warn',
        title: 'Required before the far leg',
        text: 'Inbox funds can’t be spent. Skip this merge and the far leg’s proofs can’t be built.',
      },
      actions: [
        {
          id: 'merge-investco',
          party: 'investCo',
          label: `Merge received ${CASH.ticker}`,
          cta: 'Merge',
          detail:
            'InvestCo moves the received USD from its inbox to its spendable balance.',
          preview: (ledger) =>
            ledger.previewMergeInbox('investCo', 'cash', SPONSOR),
          execute: (ledger) => mergeInbox(ledger, 'investCo', 'cash', CASH.ticker),
        },
        {
          id: 'merge-tradedesk',
          party: 'tradeDesk',
          label: `Merge received ${COLLATERAL.ticker}`,
          cta: 'Merge',
          detail:
            'TradeDesk moves the received tMMF from its inbox to its spendable balance.',
          preview: (ledger) =>
            ledger.previewMergeInbox('tradeDesk', 'collateral', SPONSOR),
          execute: (ledger) =>
            mergeInbox(ledger, 'tradeDesk', 'collateral', COLLATERAL.ticker),
        },
      ],
    },
    {
      id: 'far-construct',
      phase: 'Far leg',
      title: 'Construct the far leg',
      actors: ['xSecurities'],
      description:
        `${deal.tenorDays} days later (simulated immediately here), xSecurities builds the reverse batch. TradeDesk returns the collateral and InvestCo returns principal plus interest, ${fmtCash(deal.cashUnits)} × ${(Number(deal.interestRateBps) / 100).toFixed(2)}% × ${deal.tenorDays}/365 = ${interestAmt}. The ledger never calculates interest. The orchestrator embeds the agreed total in the encrypted amount.`,
      callout: {
        kind: 'warn',
        title: 'Proofs are perishable',
        text: 'These proofs bind to the balances the merge just produced. Pause here and send anything else from either account, and the batch is rejected on submit. The demo rebuilds and re-signs when that happens, but in production the orchestrator has to notice and do the same.',
      },
      actions: [
        {
          id: 'construct',
          party: 'xSecurities',
          label: 'Construct the reverse batch',
          cta: 'Construct',
          detail:
            'xSecurities prepares the reverse sends, with interest added to the cash amount.',
          preview: (ledger) =>
            ledger.previewPlannedLeg(
              'TradeDesk',
              'InvestCo',
              collateralAmt,
              farCashAmt,
            ),
          previewCaveat: BATCH_CAVEAT,
          execute: (ledger) => constructLeg(ledger, 'far'),
        },
      ],
    },
    {
      id: 'far-cosign',
      phase: 'Far leg',
      title: 'Co-sign the far leg',
      actors: ['investCo', 'tradeDesk'],
      description:
        'The choreography matches the near leg. Each counterparty signs the reverse batch to authorize its own return.',
      actions: [
        {
          id: 'sign-investco',
          party: 'investCo',
          label: 'Sign the batch',
          cta: 'Sign',
          detail:
            'InvestCo authorizes returning principal plus interest.',
          preview: (ledger) => ledger.previewUnsignedLeg('far'),
          execute: (ledger) =>
            Promise.resolve(signLeg(ledger, 'far', 'investCo')),
        },
        {
          id: 'sign-tradedesk',
          party: 'tradeDesk',
          label: 'Sign the batch',
          cta: 'Sign',
          detail:
            'TradeDesk authorizes returning the collateral.',
          preview: (ledger) => ledger.previewUnsignedLeg('far'),
          execute: (ledger) =>
            Promise.resolve(signLeg(ledger, 'far', 'tradeDesk')),
        },
      ],
    },
    {
      id: 'far-submit',
      phase: 'Far leg',
      title: 'Assemble and submit the far leg',
      actors: ['xSecurities'],
      learn:
        'The unwind reuses the same primitive. One batch, atomic and final.',
      description:
        'xSecurities combines the signatures and submits the unwind, exactly as it did for the near leg.',
      actions: [
        {
          id: 'combine-submit',
          party: 'xSecurities',
          label: 'Combine and submit',
          cta: 'Submit',
          detail:
            'xSecurities merges the signatures and submits the unwind.',
          preview: (ledger) => previewSigners(ledger, 'far'),
          async execute(ledger) {
            const combined = combineLeg(ledger, 'far')
            const submitted = await submitLeg(
              ledger,
              'far',
              'Far leg batch',
              [
                `TradeDesk → InvestCo: ${collateralAmt} (encrypted)`,
                `InvestCo → TradeDesk: ${farCashAmt} (encrypted)`,
              ],
              ['Far leg settled. The repo is unwound.'],
              async () => rebuildLeg(ledger, 'far'),
            )
            return {
              txs: submitted.txs,
              notes: submitted.notes,
              artifacts: combined.artifacts,
            }
          },
        },
      ],
    },
    {
      id: 'far-merge',
      phase: 'Far leg',
      title: 'Final merge',
      actors: ['investCo', 'tradeDesk', 'xSecurities'],
      learn:
        'A full repo lifecycle settled in minutes, with amounts hidden end to end.',
      description:
        `One last merge makes the returned assets spendable. InvestCo ends with its ${collateralAmt}. TradeDesk ends with ${farCashAmt}, its principal plus ${interestAmt} interest. No outside observer ever saw an amount.`,
      actions: [
        {
          id: 'merge-investco',
          party: 'investCo',
          label: `Merge returned ${COLLATERAL.ticker}`,
          cta: 'Merge',
          detail:
            'InvestCo makes its returned collateral spendable.',
          preview: (ledger) =>
            ledger.previewMergeInbox('investCo', 'collateral', SPONSOR),
          execute: (ledger) =>
            mergeInbox(ledger, 'investCo', 'collateral', COLLATERAL.ticker),
        },
        {
          id: 'merge-tradedesk',
          party: 'tradeDesk',
          label: `Merge returned ${CASH.ticker}`,
          cta: 'Merge',
          detail:
            'TradeDesk makes its returned cash spendable. The repo is closed.',
          preview: (ledger) =>
            ledger.previewMergeInbox('tradeDesk', 'cash', SPONSOR),
          async execute(ledger) {
            const result = await mergeInbox(ledger, 'tradeDesk', 'cash', CASH.ticker)
            return {
              ...result,
              notes: [
                `Repo complete. InvestCo holds ${collateralAmt} and ${fmtCash(opUnits - interestUnits(deal))}. TradeDesk holds ${farCashAmt}.`,
              ],
            }
          },
        },
      ],
    },
  ]
}
