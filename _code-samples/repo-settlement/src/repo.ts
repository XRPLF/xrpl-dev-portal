/**
 * The scenario layer: the repo trade's own vocabulary — two counterparties,
 * two tokens, a near leg and a far leg — expressed with the generic protocol
 * functions in xrpl.ts.
 *
 * Nothing here is protocol knowledge. Read xrpl.ts to learn how the XRP Ledger
 * pieces work; read this file to see how one deal wires them together, and
 * steps.ts to see the order a reader walks them in.
 */

import type { Batch, Client, SubmittableTransaction } from 'xrpl'

import { CONFIG } from './config'
import {
  PARTIES,
  TOKENS,
  TOKEN_KEYS,
  formatAmount,
  type IssuanceKey,
  type PartyKey,
  type TokenInfo,
} from './variables'
import {
  LedgerError,
  NO_TOKEN_BALANCE,
  batchSignerEntries,
  buildAuthorize,
  buildIssuanceCreate,
  buildIssuerEncryptionKey,
  buildMPTPayment,
  buildMergeInbox,
  combineSignedBatches,
  connect,
  constructConfidentialBatch,
  convertIntent,
  convertToConfidential,
  createClient,
  createConfidentialAccount,
  createIssuance,
  decodeBatchBlob,
  disconnect,
  isExpiredWindow,
  mergeInbox,
  readAccountXrp,
  readOwnerReserve,
  readTokenBalance,
  signBatchCopy,
  submit,
  submitBatch,
  verifyBatchInners,
  type BatchSignerEntry,
  type ConfidentialAccount,
  type IssuanceOptions,
  type SponsorOptions,
  type TokenBalance,
  type TxRecord,
} from './xrpl'

/** The near leg opens the repo; the far leg unwinds it. */
export type LegDirection = 'near' | 'far'

/** One confidential send inside a leg's batch. */
export interface LegSend {
  from: PartyKey
  to: PartyKey
  token: IssuanceKey
  units: bigint
}

/** What every single-transaction operation names, whatever it does. */
interface OpBase {
  /** Which of the deal's tokens the operation acts on. */
  token: IssuanceKey
  /** Who pays the fee, and the reserve wherever the protocol allows it. */
  sponsor?: PartyKey
  /** Overrides the label the demo otherwise derives from the operation. */
  label?: string
}

/** An operation signed by a party the token itself does not name. */
interface HolderOp extends OpBase {
  /** The party that signs, and therefore controls, the transaction. */
  actor: PartyKey
}

/**
 * One transaction the deal submits, declared as data rather than as a call.
 * The storyboard names an operation once; `RepoLedger.preview` and
 * `RepoLedger.run` both read that one declaration, so the transaction the
 * reader inspects is the transaction that gets submitted.
 *
 * The two issuer operations are signed by the token's own issuer, so they name
 * no actor; the rest say who signs.
 */
export type LedgerOp =
  | (OpBase & { kind: 'issue' })
  | (OpBase & { kind: 'issuerKey' })
  /** Opt in to hold a token, or, with `holder` set, approve one as the issuer. */
  | (HolderOp & { kind: 'authorize'; holder?: PartyKey })
  | (HolderOp & { kind: 'pay'; to: PartyKey; units: bigint })
  /** A zero-amount convert registers the actor's encryption key. */
  | (HolderOp & { kind: 'convert'; units: bigint })
  | (HolderOp & { kind: 'merge' })

/** Who signs an operation: the token's issuer, or the actor it names. */
export function opSigner(op: LedgerOp): PartyKey {
  return op.kind === 'issue' || op.kind === 'issuerKey'
    ? TOKENS[op.token].issuer
    : op.actor
}

/** One party of the deal: its account, keys, and which role it plays. */
export interface Party extends ConfidentialAccount {
  key: PartyKey
}

/** One leg's batch as it is assembled: unsigned, per-party copies, combined. */
export interface LegState {
  unsigned?: Batch
  /** Each counterparty's own signed copy of the same unsigned batch. */
  signedCopies: Partial<Record<PartyKey, Batch>>
  /** The combined, submittable blob once every signature is in. */
  combined?: string
}

export interface PartyBalances {
  xrpDrops: bigint | null
  sponsoringOwnerCount?: number
  /** Drops locked by those sponsorships: the count times the network's rate. */
  sponsoredReserveDrops?: bigint
  /** One entry per configured token, so the UI never names a token itself. */
  tokens: Record<IssuanceKey, TokenBalance>
}

export type BalanceSnapshot = Partial<Record<PartyKey, PartyBalances>>

/** The deal's token definitions as generic MPT issuance parameters. */
function issuanceOptions(
  issuer: string,
  token: TokenInfo,
  sponsor?: string,
): IssuanceOptions {
  return {
    issuer,
    ticker: token.ticker,
    name: token.name,
    assetScale: token.assetScale,
    maximumAmount: token.maximumAmount,
    metadata: token.metadata,
    requireAuth: token.requireAuth,
    sponsor,
  }
}

/**
 * The live state of one run of the deal: the connected client, each party's
 * account, both issuances, and the in-flight batch of whichever leg is being
 * assembled.
 *
 * Every method is one ledger interaction, named for what it does in the deal.
 * The storyboard in steps.ts calls them in order; neither file imports the
 * `xrpl` package itself.
 */
export class RepoLedger {
  readonly client: Client

  readonly parties = {} as Record<PartyKey, Party>

  /** Each token's ledger-assigned issuance ID, once it has been created. */
  readonly issuanceIDs: Partial<Record<IssuanceKey, string>> = {}

  readonly nearLeg: LegState = { signedCopies: {} }

  readonly farLeg: LegState = { signedCopies: {} }

  /** Cached after the first balance read; null if the server did not report it. */
  private ownerReserve?: bigint | null

  constructor() {
    this.client = createClient(CONFIG.wssUrl)
  }

  async connect(): Promise<void> {
    await connect(this.client)
  }

  async disconnect(): Promise<void> {
    await disconnect(this.client)
  }

  // --------------------------------------------------- accounts and identity

  /**
   * Create or load one party's account. A seed provided via .env pins the
   * party to an existing funded account; otherwise the Devnet faucet funds a
   * fresh one.
   */
  async initParty(key: PartyKey): Promise<Party> {
    const account = await createConfidentialAccount(
      this.client,
      CONFIG.seeds[key],
    )
    const party: Party = { key, ...account }
    this.parties[key] = party
    return party
  }

  party(key: PartyKey): Party {
    const party = this.parties[key]
    if (party == null) {
      throw new LedgerError(
        `${PARTIES[key].name} is not initialized. Run the setup step first`,
      )
    }
    return party
  }

  address(key: PartyKey): string {
    return this.party(key).wallet.address
  }

  encryptionKey(key: PartyKey): string {
    return this.party(key).confidentialKeys.publicKey
  }

  /** The ledger-assigned ID of an issuance, once it has been created. */
  requireIssuance(which: IssuanceKey): string {
    const id = this.issuanceIDs[which]
    if (id == null) {
      throw new LedgerError(`The ${which} token has not been issued yet`)
    }
    return id
  }

  leg(direction: LegDirection): LegState {
    return direction === 'near' ? this.nearLeg : this.farLeg
  }

  /**
   * How another party covers one transaction's cost. `feeOnly` is required for
   * transactions that create no ledger object, such as a convert or a merge.
   */
  private sponsorOptions(
    sponsor: PartyKey | undefined,
    feeOnly = false,
  ): SponsorOptions | undefined {
    return sponsor == null
      ? undefined
      : { sponsor: this.party(sponsor).wallet, feeOnly }
  }

  // ------------------------------------------------- single-transaction ops
  // An operation is declared once, in steps.ts, and read twice here: `preview`
  // builds the transaction to show the signer, `run` submits it. Both go
  // through the same `build*` function, so what the reader inspects cannot
  // drift from what reaches the ledger.

  /** The label the demo records for an operation, unless it names its own. */
  private opLabel(op: LedgerOp): string {
    if (op.label != null) {
      return op.label
    }
    const token = TOKENS[op.token]
    const actor = PARTIES[opSigner(op)].name
    switch (op.kind) {
      case 'issue':
        return `Create the ${token.ticker} issuance`
      case 'issuerKey':
        return `Register ${actor}'s encryption key`
      case 'authorize':
        return op.holder == null
          ? `${actor}: opt in to hold ${token.ticker}`
          : `${actor}: approve ${PARTIES[op.holder].name}`
      case 'pay':
        return `${actor}: send ${formatAmount(op.units, token)} → ${PARTIES[op.to].name}`
      case 'convert':
        return op.units === 0n
          ? `${actor}: register encryption key for ${token.ticker}`
          : `${actor}: convert ${formatAmount(op.units, token)} → confidential inbox`
      case 'merge':
        return `${actor}: merge ${token.ticker} inbox → spendable`
    }
  }

  private sponsorAddress(op: LedgerOp): string | undefined {
    return op.sponsor == null ? undefined : this.address(op.sponsor)
  }

  /** The transaction an operation submits, built from live state but unsigned. */
  private buildOp(
    op: Exclude<LedgerOp, { kind: 'convert' }>,
  ): SubmittableTransaction {
    const token = TOKENS[op.token]
    const sponsor = this.sponsorAddress(op)
    switch (op.kind) {
      case 'issue':
        return buildIssuanceCreate(
          issuanceOptions(this.address(token.issuer), token, sponsor),
        )
      case 'issuerKey':
        return buildIssuerEncryptionKey(
          this.address(token.issuer),
          this.requireIssuance(op.token),
          this.encryptionKey(token.issuer),
          sponsor,
        )
      case 'authorize':
        return buildAuthorize(
          this.address(op.actor),
          this.requireIssuance(op.token),
          {
            holder: op.holder == null ? undefined : this.address(op.holder),
            sponsor,
          },
        )
      case 'pay':
        return buildMPTPayment(
          this.address(op.actor),
          this.address(op.to),
          this.requireIssuance(op.token),
          op.units,
          sponsor,
        )
      case 'merge':
        return buildMergeInbox(
          this.address(op.actor),
          this.requireIssuance(op.token),
          sponsor,
        )
    }
  }

  /**
   * What the acting party is about to sign. A convert has no synchronous form —
   * its ciphertext and proof are generated against live state at submit time —
   * so it previews as its plaintext intent, and the UI says as much.
   */
  preview(op: LedgerOp): unknown {
    return op.kind === 'convert'
      ? convertIntent(
          this.party(op.actor),
          this.requireIssuance(op.token),
          op.units,
          this.sponsorAddress(op),
        )
      : this.buildOp(op)
  }

  /**
   * Submit one operation. A convert and a merge move value inside an MPToken
   * that already exists, so their sponsor covers the fee alone; every other
   * operation creates a ledger object, and its reserve is sponsored too.
   */
  async run(op: LedgerOp): Promise<TxRecord> {
    const label = this.opLabel(op)
    switch (op.kind) {
      case 'issue': {
        const token = TOKENS[op.token]
        const { record, mptIssuanceID } = await createIssuance(
          this.client,
          this.party(token.issuer).wallet,
          issuanceOptions(
            this.address(token.issuer),
            token,
            this.sponsorAddress(op),
          ),
          label,
          this.sponsorOptions(op.sponsor),
        )
        this.issuanceIDs[op.token] = mptIssuanceID
        return record
      }
      case 'convert':
        return convertToConfidential(
          this.client,
          this.party(op.actor),
          this.requireIssuance(op.token),
          op.units,
          label,
          this.sponsorOptions(op.sponsor, true),
        )
      case 'merge':
        return mergeInbox(
          this.client,
          this.party(op.actor).wallet,
          this.requireIssuance(op.token),
          label,
          this.sponsorOptions(op.sponsor, true),
        )
      default:
        return submit(
          this.client,
          this.buildOp(op),
          this.party(opSigner(op)).wallet,
          label,
          this.sponsorOptions(op.sponsor),
        )
    }
  }

  // ------------------------------------------------------ atomic settlement

  /**
   * Build one repo leg as an all-or-nothing Batch of confidential sends, one
   * per leg of the swap. The ledger settles every send or none of them, and no
   * observer sees an amount.
   */
  async constructLeg(
    direction: LegDirection,
    sends: LegSend[],
    assembler: PartyKey,
  ): Promise<Batch> {
    const unsigned = await constructConfidentialBatch(this.client, {
      assembler: this.address(assembler),
      sends: sends.map((send) => ({
        sender: this.party(send.from),
        destination: this.address(send.to),
        mptIssuanceID: this.requireIssuance(send.token),
        units: send.units,
      })),
    })

    const leg = this.leg(direction)
    leg.unsigned = unsigned
    leg.signedCopies = {}
    leg.combined = undefined
    return unsigned
  }

  /** Sign a constructed leg as one counterparty, on that party's own copy. */
  signLeg(
    direction: LegDirection,
    actor: PartyKey,
  ): BatchSignerEntry | undefined {
    const leg = this.leg(direction)
    if (leg.unsigned == null) {
      throw new LedgerError('Construct the batch before signing it')
    }
    const copy = signBatchCopy(this.party(actor).wallet, leg.unsigned)
    leg.signedCopies[actor] = copy
    return batchSignerEntries(copy)[0]
  }

  /** Combine both counterparties' signatures into one submittable batch. */
  combineLeg(direction: LegDirection, signers: PartyKey[]): string[] {
    const leg = this.leg(direction)
    const copies = signers.map((key) => {
      const copy = leg.signedCopies[key]
      if (copy == null) {
        throw new LedgerError('Both counterparties must sign before combining')
      }
      return copy
    })
    leg.combined = combineSignedBatches(copies)
    // The protocol requires BatchSigners sorted by account ID; read back the
    // order the SDK produced.
    return batchSignerEntries(decodeBatchBlob(leg.combined)).map(
      (entry) => entry.Account,
    )
  }

  /** The signature entry each counterparty has contributed so far. */
  legSigners(
    direction: LegDirection,
  ): Partial<Record<PartyKey, BatchSignerEntry>> {
    const leg = this.leg(direction)
    const entries: Partial<Record<PartyKey, BatchSignerEntry>> = {}
    for (const key of Object.keys(leg.signedCopies) as PartyKey[]) {
      const copy = leg.signedCopies[key]
      if (copy != null) {
        entries[key] = batchSignerEntries(copy)[0]
      }
    }
    return entries
  }

  /** The combined batch, decoded for display. */
  combinedLeg(direction: LegDirection): unknown {
    const { combined } = this.leg(direction)
    return typeof combined === 'string' ? decodeBatchBlob(combined) : combined
  }

  /**
   * Submit a combined leg, with the assembler signing the outer transaction,
   * then confirm every inner transaction individually.
   *
   * If the submission window expired while the counterparties were signing,
   * `rebuild` is called once to construct and re-sign a fresh batch.
   */
  async submitLeg(
    direction: LegDirection,
    submitter: PartyKey,
    label: string,
    innerLabels: string[],
    rebuild?: () => Promise<void>,
  ): Promise<{ txs: TxRecord[]; rebuilt: boolean }> {
    const attempt = async (): Promise<TxRecord> => {
      const { combined } = this.leg(direction)
      if (combined == null) {
        throw new LedgerError('Combine the signatures before submitting')
      }
      return submitBatch(
        this.client,
        combined,
        this.party(submitter).wallet,
        label,
      )
    }

    let outer: TxRecord
    let rebuilt = false
    try {
      outer = await attempt()
    } catch (error) {
      if (rebuild == null || !isExpiredWindow(error)) {
        throw error
      }
      await rebuild()
      rebuilt = true
      outer = await attempt()
    }
    const inners = await verifyBatchInners(this.client, outer.hash, innerLabels)
    return { txs: [outer, ...inners], rebuilt }
  }

  // -------------------------------------------------------------- balances

  /**
   * Read every party's ledger state: XRP, public MPT amounts, and the
   * confidential balances decrypted with each holder's own key, plus each
   * issuer's lawful view of its own token.
   */
  async snapshotBalances(): Promise<BalanceSnapshot> {
    const snapshot: BalanceSnapshot = {}
    const reserve = await this.ownerReserveDrops()
    await Promise.all(
      (Object.keys(this.parties) as PartyKey[]).map(async (key) => {
        snapshot[key] = await this.partyBalances(key, reserve)
      }),
    )
    return snapshot
  }

  /** Read the reserve rate once: validators vote on it, but not mid-demo. */
  private async ownerReserveDrops(): Promise<bigint | null> {
    if (this.ownerReserve === undefined) {
      this.ownerReserve = await readOwnerReserve(this.client)
    }
    return this.ownerReserve
  }

  private async partyBalances(
    key: PartyKey,
    reserveDrops: bigint | null,
  ): Promise<PartyBalances> {
    const party = this.party(key)
    const [xrp, ...tokenBalances] = await Promise.all([
      readAccountXrp(this.client, party.wallet.address),
      ...TOKEN_KEYS.map(async (token) => this.tokenBalance(party, token)),
    ])
    const tokens = {} as Record<IssuanceKey, TokenBalance>
    TOKEN_KEYS.forEach((token, index) => {
      tokens[token] = tokenBalances[index]
    })
    const sponsored = xrp.sponsoringOwnerCount ?? 0
    return {
      ...xrp,
      sponsoredReserveDrops:
        reserveDrops == null || sponsored === 0
          ? undefined
          : reserveDrops * BigInt(sponsored),
      tokens,
    }
  }

  private async tokenBalance(
    party: Party,
    token: IssuanceKey,
  ): Promise<TokenBalance> {
    const mptIssuanceID = this.issuanceIDs[token]
    if (mptIssuanceID == null) {
      return NO_TOKEN_BALANCE
    }
    const issuer = TOKENS[token].issuer
    return readTokenBalance(this.client, {
      holder: party.wallet.address,
      mptIssuanceID,
      holderPrivateKey: party.confidentialKeys.privateKey,
      issuerPrivateKey: this.parties[issuer]?.confidentialKeys.privateKey,
    })
  }

  // -------------------------------------------------------- batch previews

  /**
   * The plan for a batch, before it is constructed. Deliberately not shaped
   * like a transaction: no batch exists yet, and presenting this as wire JSON
   * would imply the reader is inspecting something that will be submitted.
   */
  previewPlannedLeg(sends: LegSend[]): unknown {
    return {
      willBuild: `Batch (tfAllOrNothing) with ${sends.length} ConfidentialMPTSend inners`,
      inners: sends.map(
        (send) =>
          `${PARTIES[send.from].name} → ${PARTIES[send.to].name}, ${formatAmount(send.units, TOKENS[send.token])}`,
      ),
    }
  }

  /** The unsigned batch, once constructed. */
  previewUnsignedLeg(direction: LegDirection): unknown {
    return this.leg(direction).unsigned
  }
}
