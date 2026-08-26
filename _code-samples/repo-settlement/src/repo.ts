/**
 * The scenario layer: the repo trade's own vocabulary — two counterparties,
 * two tokens, a near leg and a far leg — expressed with the generic protocol
 * functions in xrpl.ts.
 *
 * Nothing here is protocol knowledge. Read xrpl.ts to learn how the XRP Ledger
 * pieces work; read this file to see how one deal wires them together, and
 * steps.ts to see the order a reader walks them in.
 */

import type { Batch, Client } from 'xrpl'

import { CONFIG } from './config'
import { CASH, COLLATERAL, PARTIES, type PartyKey, type TokenInfo } from './variables'
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
  readTokenBalance,
  signBatchCopy,
  submitBatch,
  submitMaybeSponsored,
  verifyBatchInners,
  type BatchSignerEntry,
  type ConfidentialAccount,
  type IssuanceOptions,
  type SponsorOptions,
  type TokenBalance,
  type TxRecord,
} from './xrpl'

/** Which of the deal's two tokens a call refers to. */
export type IssuanceKey = 'collateral' | 'cash'

/** The near leg opens the repo; the far leg unwinds it. */
export type LegDirection = 'near' | 'far'

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
  collateral: TokenBalance
  cash: TokenBalance
}

export type BalanceSnapshot = Partial<Record<PartyKey, PartyBalances>>

/** The deal's token definitions as generic MPT issuance parameters. */
function issuanceOptions(
  issuer: string,
  token: TokenInfo,
  requireAuth: boolean,
  sponsor?: string,
): IssuanceOptions {
  return {
    issuer,
    ticker: token.ticker,
    name: token.name,
    assetScale: token.assetScale,
    maximumAmount: token.maximumAmount,
    metadata: token.metadata,
    requireAuth,
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

  collateralIssuanceID?: string

  cashIssuanceID?: string

  readonly nearLeg: LegState = { signedCopies: {} }

  readonly farLeg: LegState = { signedCopies: {} }

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
    const id =
      which === 'collateral' ? this.collateralIssuanceID : this.cashIssuanceID
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

  // ----------------------------------------------------------- token issuance

  /** Create one of the deal's two token issuances and record its ID. */
  async createIssuance(
    token: TokenInfo,
    which: IssuanceKey,
    requireAuth: boolean,
    label: string,
    sponsor?: PartyKey,
  ): Promise<{ record: TxRecord; issuanceID: string }> {
    const issuer = this.party(token.issuer)
    const { record, mptIssuanceID } = await createIssuance(
      this.client,
      issuer.wallet,
      issuanceOptions(
        issuer.wallet.address,
        token,
        requireAuth,
        sponsor ? this.address(sponsor) : undefined,
      ),
      label,
      this.sponsorOptions(sponsor),
    )
    if (which === 'collateral') {
      this.collateralIssuanceID = mptIssuanceID
    } else {
      this.cashIssuanceID = mptIssuanceID
    }
    return { record, issuanceID: mptIssuanceID }
  }

  /** Register the issuer's encryption key, enabling confidential balances. */
  async registerIssuerKey(
    token: TokenInfo,
    which: IssuanceKey,
    label: string,
    sponsor?: PartyKey,
  ): Promise<TxRecord> {
    const issuer = this.party(token.issuer)
    return submitMaybeSponsored(
      this.client,
      buildIssuerEncryptionKey(
        issuer.wallet.address,
        this.requireIssuance(which),
        issuer.confidentialKeys.publicKey,
        sponsor ? this.address(sponsor) : undefined,
      ),
      issuer.wallet,
      label,
      this.sponsorOptions(sponsor),
    )
  }

  /**
   * Opt in to hold a token, or approve a holder as the issuer. Pass `sponsor`
   * to have xSecurities pay the fee and reserve.
   */
  async authorize(
    actor: PartyKey,
    which: IssuanceKey,
    label: string,
    options: { holder?: PartyKey; sponsor?: PartyKey } = {},
  ): Promise<TxRecord> {
    return submitMaybeSponsored(
      this.client,
      this.buildAuthorize(actor, which, options),
      this.party(actor).wallet,
      label,
      this.sponsorOptions(options.sponsor),
    )
  }

  /** Pay a public (unencrypted) MPT amount from one party to another. */
  async payToken(
    from: PartyKey,
    to: PartyKey,
    which: IssuanceKey,
    units: bigint,
    label: string,
    sponsor?: PartyKey,
  ): Promise<TxRecord> {
    return submitMaybeSponsored(
      this.client,
      buildMPTPayment(
        this.address(from),
        this.address(to),
        this.requireIssuance(which),
        units,
        sponsor ? this.address(sponsor) : undefined,
      ),
      this.party(from).wallet,
      label,
      this.sponsorOptions(sponsor),
    )
  }

  // ------------------------------------------------- confidential balances

  /** Encrypt a public balance. The amount lands in the holder's inbox. */
  async convertToConfidential(
    actor: PartyKey,
    which: IssuanceKey,
    units: bigint,
    label: string,
    sponsor?: PartyKey,
  ): Promise<TxRecord> {
    return convertToConfidential(
      this.client,
      this.party(actor),
      this.requireIssuance(which),
      units,
      label,
      this.sponsorOptions(sponsor, true),
    )
  }

  /** Move a confidential inbox balance into the spendable balance. */
  async mergeInbox(
    actor: PartyKey,
    which: IssuanceKey,
    label: string,
    sponsor?: PartyKey,
  ): Promise<TxRecord> {
    return mergeInbox(
      this.client,
      this.party(actor).wallet,
      this.requireIssuance(which),
      label,
      this.sponsorOptions(sponsor, true),
    )
  }

  // ------------------------------------------------------ atomic settlement

  /**
   * Build one repo leg as an all-or-nothing Batch of two confidential sends:
   * the collateral one way, the cash the other. The ledger settles both or
   * neither, and no observer sees an amount.
   */
  async constructLeg(
    direction: LegDirection,
    parties: {
      collateralSender: PartyKey
      collateralReceiver: PartyKey
      cashSender: PartyKey
      cashReceiver: PartyKey
    },
    amounts: { collateralUnits: bigint; cashUnits: bigint },
    assembler: PartyKey,
  ): Promise<Batch> {
    const unsigned = await constructConfidentialBatch(this.client, {
      assembler: this.address(assembler),
      sends: [
        {
          sender: this.party(parties.collateralSender),
          destination: this.address(parties.collateralReceiver),
          mptIssuanceID: this.requireIssuance('collateral'),
          units: amounts.collateralUnits,
        },
        {
          sender: this.party(parties.cashSender),
          destination: this.address(parties.cashReceiver),
          mptIssuanceID: this.requireIssuance('cash'),
          units: amounts.cashUnits,
        },
      ],
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
    await Promise.all(
      (Object.keys(this.parties) as PartyKey[]).map(async (key) => {
        snapshot[key] = await this.partyBalances(key)
      }),
    )
    return snapshot
  }

  private async partyBalances(key: PartyKey): Promise<PartyBalances> {
    const party = this.party(key)
    const [xrp, collateral, cash] = await Promise.all([
      readAccountXrp(this.client, party.wallet.address),
      this.tokenBalance(party, this.collateralIssuanceID, COLLATERAL.issuer),
      this.tokenBalance(party, this.cashIssuanceID, CASH.issuer),
    ])
    return { ...xrp, collateral, cash }
  }

  private async tokenBalance(
    party: Party,
    mptIssuanceID: string | undefined,
    issuerKey: PartyKey,
  ): Promise<TokenBalance> {
    if (mptIssuanceID == null) {
      return NO_TOKEN_BALANCE
    }
    return readTokenBalance(this.client, {
      holder: party.wallet.address,
      mptIssuanceID,
      holderPrivateKey: party.confidentialKeys.privateKey,
      issuerPrivateKey: this.parties[issuerKey]?.confidentialKeys.privateKey,
    })
  }

  // -------------------------------------------------------------- previews
  // The transaction each party is about to sign, shown before it acts. Each
  // preview returns the built transaction exactly as the matching action
  // submits it — no renaming, decoding, or reformatting — so the reader
  // inspects the object that goes to the ledger.

  private buildAuthorize(
    actor: PartyKey,
    which: IssuanceKey,
    options: { holder?: PartyKey; sponsor?: PartyKey } = {},
  ) {
    return buildAuthorize(this.address(actor), this.requireIssuance(which), {
      holder: options.holder ? this.address(options.holder) : undefined,
      sponsor: options.sponsor ? this.address(options.sponsor) : undefined,
    })
  }

  previewCreateIssuance(
    token: TokenInfo,
    requireAuth: boolean,
    sponsor?: PartyKey,
  ): unknown {
    return buildIssuanceCreate(
      issuanceOptions(
        this.address(token.issuer),
        token,
        requireAuth,
        sponsor ? this.address(sponsor) : undefined,
      ),
    )
  }

  previewRegisterIssuerKey(
    token: TokenInfo,
    which: IssuanceKey,
    sponsor?: PartyKey,
  ): unknown {
    return buildIssuerEncryptionKey(
      this.address(token.issuer),
      this.requireIssuance(which),
      this.encryptionKey(token.issuer),
      sponsor ? this.address(sponsor) : undefined,
    )
  }

  previewAuthorize(
    actor: PartyKey,
    which: IssuanceKey,
    options: { holder?: PartyKey; sponsor?: PartyKey } = {},
  ): unknown {
    return this.buildAuthorize(actor, which, options)
  }

  previewPayToken(
    from: PartyKey,
    to: PartyKey,
    which: IssuanceKey,
    units: bigint,
    sponsor?: PartyKey,
  ): unknown {
    return buildMPTPayment(
      this.address(from),
      this.address(to),
      this.requireIssuance(which),
      units,
      sponsor ? this.address(sponsor) : undefined,
    )
  }

  previewConvert(
    actor: PartyKey,
    which: IssuanceKey,
    units: bigint,
    sponsor?: PartyKey,
  ): unknown {
    return convertIntent(
      this.party(actor),
      this.requireIssuance(which),
      units,
      sponsor ? this.address(sponsor) : undefined,
    )
  }

  previewMergeInbox(
    actor: PartyKey,
    which: IssuanceKey,
    sponsor?: PartyKey,
  ): unknown {
    return buildMergeInbox(
      this.address(actor),
      this.requireIssuance(which),
      sponsor ? this.address(sponsor) : undefined,
    )
  }

  /**
   * The plan for a batch, before it is constructed. Deliberately not shaped
   * like a transaction: no batch exists yet, and presenting this as wire JSON
   * would imply the reader is inspecting something that will be submitted.
   */
  previewPlannedLeg(
    collateralSender: string,
    cashSender: string,
    collateralLabel: string,
    cashLabel: string,
  ): unknown {
    return {
      willBuild: 'Batch (tfAllOrNothing) with two ConfidentialMPTSend inners',
      inner1: `${collateralSender} → ${cashSender}, ${collateralLabel}`,
      inner2: `${cashSender} → ${collateralSender}, ${cashLabel}`,
    }
  }

  /** The unsigned batch, once constructed. */
  previewUnsignedLeg(direction: LegDirection): unknown {
    return this.leg(direction).unsigned
  }
}
