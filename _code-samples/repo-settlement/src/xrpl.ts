/**
 * Every XRP Ledger interaction, in one file.
 *
 * Nothing here knows about a particular application: no UI, no narrative, no
 * business flow. Read this file alone to see how the protocol pieces work —
 * accounts and encryption keys, MPT issuance, confidential conversion,
 * atomic batches, sponsored fees, and how encrypted balances are read back —
 * then call these functions from your own app.
 *
 * The pieces used, and their specs:
 *   XLS-33 / XLS-89  Multi-Purpose Tokens
 *   XLS-96           Confidential Transfers (encrypted amounts, ZK proofs)
 *   XLS-56           Batch (atomic all-or-nothing settlement)
 *   XLS-68           Sponsored fees and reserves
 */

import {
  Client,
  SponsorFlags,
  Wallet,
  combineBatchSigners,
  decode,
  deriveConfidentialKeypair,
  encodeMPTokenMetadata,
  fetchMPToken,
  fetchMPTokenIssuance,
  hashes,
  loadMptCrypto,
  prepareConfidentialBatch,
  prepareConfidentialConvert,
  prepareConfidentialMergeInbox,
  signAsSponsor,
  signMultiBatch,
  type Batch,
  type BatchSigner,
  type ConfidentialKeypair,
  type ConfidentialMPTConvert,
  type ConfidentialMPTMergeInbox,
  type LedgerEntry,
  type MPTokenAuthorize,
  type MPTokenIssuanceCreate,
  type MPTokenIssuanceSet,
  type MPTokenMetadata,
  type Payment,
  type SubmittableTransaction,
  type TxResponse,
} from 'xrpl'

/** An account, plus the second keypair confidential balances need (XLS-96). */
export interface ConfidentialAccount {
  wallet: Wallet
  /** ElGamal-style encryption keypair for confidential balances (XLS-96). */
  confidentialKeys: ConfidentialKeypair
}

export interface TxRecord {
  label: string
  hash: string
  result: string
  /** The validated transaction as the ledger recorded it, with its metadata. */
  txJson?: unknown
  /** Set when another account paid the fee/reserve for the sender (XLS-68). */
  sponsored?: boolean
  /** Set for transactions that executed inside a Batch. */
  inner?: boolean
}

/**
 * A decryption outcome. `null` means no ciphertext exists; `failed` means a
 * ciphertext exists but could not be decrypted with the given key. A failed
 * decrypt must never render as zero.
 */
export type Decrypted = { units: bigint } | { failed: true } | null

/** One party's holdings of one token, in base units. `null` = not opted in. */
export interface TokenBalance {
  publicUnits: bigint | null
  /** Confidential balances decrypted with the holder's own key. */
  spendable: Decrypted
  inbox: Decrypted
  /** The same balance decrypted with the token issuer's key (lawful view). */
  issuerView: Decrypted
  /** Raw ElGamal ciphertexts, which is what everyone else sees on the ledger. */
  spendableCipher?: string
  inboxCipher?: string
}

/** The balance of a token an account has not opted in to hold. */
export const NO_TOKEN_BALANCE: TokenBalance = {
  publicUnits: null,
  spendable: null,
  inbox: null,
  issuerView: null,
}

/** One entry of a Batch's BatchSigners array: who authorized the batch. */
export type BatchSignerEntry = BatchSigner['BatchSigner']

/** A ledger interaction that failed, carrying the hash when there is one. */
export class LedgerError extends Error {
  constructor(
    message: string,
    public readonly hash?: string,
  ) {
    super(message)
    this.name = 'LedgerError'
  }
}

/**
 * How many ledgers a constructed batch stays submittable by default.
 * Autofill's own default (about 20 ledgers, roughly a minute) suits scripts,
 * not several parties signing at their own pace. 600 ledgers is roughly 35
 * minutes on Devnet.
 */
export const SUBMIT_WINDOW_LEDGERS = 600

/** The engine result code of a validated transaction, from its metadata. */
function resultCode(response: TxResponse): string {
  const meta = response.result.meta
  return typeof meta === 'object' && meta != null
    ? meta.TransactionResult
    : 'unknown'
}

/** Unwrap a Batch's BatchSigners array, which nests each entry one level. */
export function batchSignerEntries(batch: Batch): BatchSignerEntry[] {
  return batch.BatchSigners?.map((entry) => entry.BatchSigner) ?? []
}

/** Decode a combined batch blob back into a Batch, for reading or signing. */
export function decodeBatchBlob(blob: string): Batch {
  return decode(blob) as unknown as Batch
}

// ------------------------------------------------------------------ accounts

/**
 * A client for one endpoint. Confidential transfers, batches, and sponsored
 * fees each need their amendment enabled there: ConfidentialTransfer,
 * BatchV1_1, and Sponsor.
 */
export function createClient(wssUrl: string): Client {
  return new Client(wssUrl)
}

export async function connect(client: Client): Promise<void> {
  if (!client.isConnected()) {
    await client.connect()
  }
}

export async function disconnect(client: Client): Promise<void> {
  if (client.isConnected()) {
    await client.disconnect()
  }
}

/**
 * Load an account from a seed, or fund a fresh one from the faucet, and derive
 * the encryption keypair its confidential balances are stored under.
 *
 * Deriving the encryption key from the account's own seed means one backup
 * recovers both keys, which is why this demo does it. The SDK recommends a
 * dedicated seed in production: reusing the signing seed extends that key's
 * trust boundary into the confidential cryptography.
 */
export async function createConfidentialAccount(
  client: Client,
  seed?: string,
): Promise<ConfidentialAccount> {
  const wallet = seed
    ? Wallet.fromSeed(seed)
    : (await client.fundWallet()).wallet
  if (wallet.seed == null) {
    throw new LedgerError('Wallet has no seed to derive an encryption key from')
  }
  return { wallet, confidentialKeys: deriveConfidentialKeypair(wallet.seed) }
}

// ---------------------------------------------------------------- submission

/** Turn a validated response into a record, throwing on any failure code. */
export function toRecord(response: TxResponse, label: string): TxRecord {
  const code = resultCode(response)
  const hash = response.result.hash
  if (code !== 'tesSUCCESS') {
    throw new LedgerError(`${label} failed: ${code}`, hash)
  }
  return { label, hash, result: code, txJson: response.result }
}

/** Sign with one wallet, submit, and fail loudly on any non-success code. */
export async function submit(
  client: Client,
  tx: SubmittableTransaction,
  wallet: Wallet,
  label: string,
): Promise<TxRecord> {
  const response = await client.submitAndWait(tx, { wallet, autofill: true })
  return toRecord(response, label)
}

/** The fields that hand a transaction's fee and reserve to another account. */
export function sponsorFields(sponsor: string): {
  Sponsor: string
  SponsorFlags: number
} {
  return {
    Sponsor: sponsor,
    SponsorFlags: SponsorFlags.spfSponsorFee | SponsorFlags.spfSponsorReserve,
  }
}

/**
 * Submit a transaction whose fee and reserve another account covers (XLS-68).
 * The sending account signs first, then the sponsor co-signs that signed blob
 * to accept the cost, and the fully signed transaction goes to the ledger
 * as-is. The sponsor cannot alter or initiate what it pays for.
 */
export async function submitSponsored(
  client: Client,
  tx: SubmittableTransaction,
  sender: Wallet,
  sponsor: Wallet,
  label: string,
): Promise<TxRecord> {
  const prepared = await client.autofill({
    ...tx,
    ...sponsorFields(sponsor.address),
  })
  const senderSigned = sender.sign(prepared)
  const coSigned = signAsSponsor(sponsor, senderSigned.tx_blob)
  const response = await client.submitAndWait(coSigned.tx_blob)
  return { ...toRecord(response, label), sponsored: true }
}

// ------------------------------------------------------------ token issuance
// Each transaction has a `build*` function that returns it unsigned, so the
// same object can be shown to the signer and then submitted: a preview cannot
// drift from what the ledger receives.

export interface IssuanceOptions {
  issuer: string
  ticker: string
  name: string
  /** Decimal places: on-ledger amounts are integers of 10^-assetScale units. */
  assetScale: number
  maximumAmount: string
  /** The rest of the standard token metadata (XLS-89). */
  metadata: Omit<MPTokenMetadata, 'ticker' | 'name'>
  /** Gate holders: each one needs the issuer's approval before it can hold. */
  requireAuth?: boolean
}

/**
 * Authorization, transferability, and confidentiality are protocol flags on
 * the token itself, not contract code: `tfMPTCanTransfer` allows
 * holder-to-holder transfers, `tfMPTCanHoldConfidentialBalance` enables
 * encrypted balances, and `tfMPTRequireAuth` gates who may hold it.
 */
export function buildIssuanceCreate(
  options: IssuanceOptions,
): MPTokenIssuanceCreate {
  return {
    TransactionType: 'MPTokenIssuanceCreate',
    Account: options.issuer,
    AssetScale: options.assetScale,
    MaximumAmount: options.maximumAmount,
    Flags: {
      tfMPTCanTransfer: true,
      tfMPTCanHoldConfidentialBalance: true,
      tfMPTRequireAuth: options.requireAuth ?? false,
    },
    MPTokenMetadata: encodeMPTokenMetadata({
      ticker: options.ticker,
      name: options.name,
      ...options.metadata,
    }),
  }
}

/**
 * Register the issuer's encryption public key on its own issuance, which is
 * what switches confidential transfers on and gives the issuer a lawful view
 * of encrypted balances. The private half never leaves the client.
 */
export function buildIssuerEncryptionKey(
  issuer: string,
  mptIssuanceID: string,
  encryptionKey: string,
): MPTokenIssuanceSet {
  return {
    TransactionType: 'MPTokenIssuanceSet',
    Account: issuer,
    MPTokenIssuanceID: mptIssuanceID,
    IssuerEncryptionKey: encryptionKey,
  }
}

/**
 * Opt in to hold a token, or — when `holder` is given — approve a holder as
 * the issuer. The same transaction type covers both sides of the handshake.
 * Pass `sponsor` to have another account pay the fee and reserve.
 */
export function buildAuthorize(
  account: string,
  mptIssuanceID: string,
  options: { holder?: string; sponsor?: string } = {},
): MPTokenAuthorize {
  return {
    TransactionType: 'MPTokenAuthorize',
    Account: account,
    MPTokenIssuanceID: mptIssuanceID,
    ...(options.holder ? { Holder: options.holder } : {}),
    ...(options.sponsor ? sponsorFields(options.sponsor) : {}),
  }
}

/** A public (unencrypted) MPT payment of `units` base units. */
export function buildMPTPayment(
  from: string,
  to: string,
  mptIssuanceID: string,
  units: bigint,
): Payment {
  return {
    TransactionType: 'Payment',
    Account: from,
    Destination: to,
    Amount: { mpt_issuance_id: mptIssuanceID, value: units.toString() },
  }
}

/** Create an MPT issuance and read back its ledger-assigned ID. */
export async function createIssuance(
  client: Client,
  issuer: Wallet,
  options: IssuanceOptions,
  label: string,
): Promise<{ record: TxRecord; mptIssuanceID: string }> {
  const record = await submit(
    client,
    buildIssuanceCreate(options),
    issuer,
    label,
  )

  // The issuance ID is assigned by the ledger; read it back from the metadata.
  const created: TxResponse<MPTokenIssuanceCreate> = await client.request({
    command: 'tx',
    transaction: record.hash,
  })
  const meta = created.result.meta
  const mptIssuanceID =
    typeof meta === 'object' && meta != null ? meta.mpt_issuance_id : undefined
  if (mptIssuanceID == null) {
    throw new LedgerError(
      `No mpt_issuance_id in the ${options.ticker} create metadata`,
    )
  }
  return { record, mptIssuanceID }
}

// ----------------------------------------------------- confidential balances

/**
 * Encrypt a public balance. The transaction carries a zero-knowledge proof,
 * generated locally, that the plaintext matches the ciphertext.
 *
 * A converted amount lands in the holder's confidential *inbox*, not its
 * spendable balance, so every convert is followed by a merge. A zero-amount
 * convert is how a holder registers its encryption key without moving funds,
 * which it must do before it can receive a confidential send.
 */
export async function buildConvert(
  client: Client,
  holder: ConfidentialAccount,
  mptIssuanceID: string,
  units: bigint,
): Promise<ConfidentialMPTConvert> {
  return prepareConfidentialConvert(client, {
    account: holder.wallet.address,
    mptIssuanceID,
    amount: units,
    holderKeypair: holder.confidentialKeys,
  })
}

export async function convertToConfidential(
  client: Client,
  holder: ConfidentialAccount,
  mptIssuanceID: string,
  units: bigint,
  label: string,
): Promise<TxRecord> {
  const tx = await buildConvert(client, holder, mptIssuanceID, units)
  return submit(client, tx, holder.wallet, label)
}

/**
 * The plaintext intent of a convert, for showing the holder before it signs.
 * The encrypted amounts, blinding factor, and proof are added by
 * `buildConvert` at submit time, so they cannot be shown beforehand.
 */
export function convertIntent(
  holder: ConfidentialAccount,
  mptIssuanceID: string,
  units: bigint,
): Pick<
  ConfidentialMPTConvert,
  | 'TransactionType'
  | 'Account'
  | 'MPTokenIssuanceID'
  | 'MPTAmount'
  | 'HolderEncryptionKey'
> {
  return {
    TransactionType: 'ConfidentialMPTConvert',
    Account: holder.wallet.address,
    MPTokenIssuanceID: mptIssuanceID,
    MPTAmount: units.toString(),
    HolderEncryptionKey: holder.confidentialKeys.publicKey,
  }
}

/**
 * Move a confidential inbox balance into the spendable balance. Inbox funds
 * cannot be spent, and no proof can be built against them, so this is
 * mandatory after every convert and every confidential receipt.
 */
export function buildMergeInbox(
  account: string,
  mptIssuanceID: string,
): ConfidentialMPTMergeInbox {
  return {
    TransactionType: 'ConfidentialMPTMergeInbox',
    Account: account,
    MPTokenIssuanceID: mptIssuanceID,
  }
}

export async function mergeInbox(
  client: Client,
  holder: Wallet,
  mptIssuanceID: string,
  label: string,
): Promise<TxRecord> {
  const tx = await prepareConfidentialMergeInbox(client, {
    account: holder.address,
    mptIssuanceID,
  })
  return submit(client, tx, holder, label)
}

// ------------------------------------------------------------------- batches
// A Batch (XLS-56) executes its inner transactions all-or-nothing. Each
// counterparty signs its own copy of the same unsigned batch, the signatures
// are combined, and the assembler submits the result: it can build the batch
// but cannot alter it, because any change invalidates the signatures.

/** One confidential send inside a batch: an encrypted amount plus its proof. */
export interface ConfidentialSend {
  sender: ConfidentialAccount
  destination: string
  mptIssuanceID: string
  units: bigint
}

/**
 * Build an unsigned batch of confidential sends. Each inner transaction
 * carries an encrypted amount and a proof that the sender holds enough to
 * cover it, so the ledger settles all of them or none and no observer sees an
 * amount.
 *
 * The submission window is widened deliberately. Autofill's default expires in
 * about a minute, which suits a script but not several counterparties signing
 * at their own pace. The proofs stay valid as long as no other transaction
 * touches the confidential balances, so only the outer window needs extending.
 */
export async function constructConfidentialBatch(
  client: Client,
  params: {
    assembler: string
    sends: ConfidentialSend[]
    submitWindowLedgers?: number
  },
): Promise<Batch> {
  const unsigned = await prepareConfidentialBatch(client, {
    account: params.assembler,
    inners: params.sends.map((send) => ({
      operation: 'send' as const,
      account: send.sender.wallet.address,
      destination: send.destination,
      mptIssuanceID: send.mptIssuanceID,
      amount: send.units,
      senderKeypair: send.sender.confidentialKeys,
    })),
    signersCount: params.sends.length,
  })
  unsigned.LastLedgerSequence =
    (await client.getLedgerIndex()) +
    (params.submitWindowLedgers ?? SUBMIT_WINDOW_LEDGERS)
  return unsigned
}

/**
 * Sign a copy of an unsigned batch as one counterparty. The signature covers
 * every inner transaction. Signing a copy, rather than the batch itself, is
 * what lets the signatures be collected independently.
 */
export function signBatchCopy(wallet: Wallet, unsigned: Batch): Batch {
  const copy: Batch = { ...unsigned }
  signMultiBatch(wallet, copy)
  return copy
}

/** Combine each counterparty's signed copy into one submittable blob. */
export function combineSignedBatches(copies: Batch[]): string {
  return combineBatchSigners(copies)
}

/** Submit a combined batch, with the assembler signing the outer transaction. */
export async function submitBatch(
  client: Client,
  combined: string,
  submitter: Wallet,
  label: string,
): Promise<TxRecord> {
  const response = await client.submitAndWait(combined, { wallet: submitter })
  return toRecord(response, label)
}

/**
 * A tesSUCCESS on a Batch only means the outer transaction was well-formed.
 * Hash each inner transaction and look it up individually to confirm every
 * one of them actually applied.
 */
export async function verifyBatchInners(
  client: Client,
  batchHash: string,
  labels: string[],
): Promise<TxRecord[]> {
  const outer: TxResponse<Batch> = await client.request({
    command: 'tx',
    transaction: batchHash,
  })

  const records: TxRecord[] = []
  for (const [index, { RawTransaction }] of (
    outer.result.tx_json.RawTransactions ?? []
  ).entries()) {
    const innerHash = hashes.hashSignedTx(RawTransaction)
    const innerTx: TxResponse = await client.request({
      command: 'tx',
      transaction: innerHash,
    })
    const code = resultCode(innerTx)
    if (code !== 'tesSUCCESS') {
      throw new LedgerError(
        `Inner transaction "${labels[index]}" failed: ${code}`,
        innerHash,
      )
    }
    records.push({
      label: labels[index] ?? `Inner transaction ${index + 1}`,
      hash: innerHash,
      result: code,
      txJson: innerTx.result,
      inner: true,
    })
  }
  return records
}

/** True when a submission failed only because its ledger window expired. */
export function isExpiredWindow(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return /tefMAX_LEDGER|LastLedgerSequence/u.test(message)
}

// ------------------------------------------------------------------ balances

/**
 * An account's XRP balance, plus the reserves it is covering for others. While
 * a sponsorship stands the reserve counts against the sponsor's
 * `SponsoringOwnerCount`, not the sponsee's `OwnerCount`.
 */
export async function readAccountXrp(
  client: Client,
  address: string,
): Promise<{ xrpDrops: bigint | null; sponsoringOwnerCount?: number }> {
  try {
    const info = await client.request({
      command: 'account_info',
      account: address,
      ledger_index: 'validated',
    })
    const root = info.result.account_data
    return {
      xrpDrops: BigInt(root.Balance),
      sponsoringOwnerCount: root.SponsoringOwnerCount,
    }
  } catch {
    return { xrpDrops: null }
  }
}

/**
 * One holder's balance of one token: the public amount, and the confidential
 * spendable and inbox balances decrypted with the holder's key. Pass
 * `issuerPrivateKey` to also decrypt the issuer's view of the same balance,
 * which every confidential transaction encrypts under the issuer's key. The
 * raw ciphertexts are returned too, since that is what every observer sees.
 */
export async function readTokenBalance(
  client: Client,
  params: {
    holder: string
    mptIssuanceID: string
    holderPrivateKey: string
    issuerPrivateKey?: string
  },
): Promise<TokenBalance> {
  let token: LedgerEntry.MPToken
  try {
    token = await fetchMPToken(client, params.holder, params.mptIssuanceID)
  } catch {
    return NO_TOKEN_BALANCE
  }
  const balance: TokenBalance = {
    publicUnits: BigInt(token.MPTAmount ?? '0'),
    spendable: null,
    inbox: null,
    issuerView: null,
    spendableCipher: token.ConfidentialBalanceSpending,
    inboxCipher: token.ConfidentialBalanceInbox,
  }
  if (
    token.ConfidentialBalanceSpending == null &&
    token.ConfidentialBalanceInbox == null
  ) {
    return balance
  }
  const [issuance, crypto] = await Promise.all([
    fetchMPTokenIssuance(client, params.mptIssuanceID),
    loadMptCrypto(),
  ])
  const bound = BigInt(issuance.ConfidentialOutstandingAmount ?? '0')
  // A ciphertext that exists but fails to decrypt is reported as `failed`,
  // never as zero: in a financial UI those must be distinct states.
  const decrypt = async (
    cipher: string | undefined,
    privateKey: string,
  ): Promise<Decrypted> => {
    if (cipher == null) {
      return null
    }
    try {
      return { units: await crypto.decryptAmount(cipher, privateKey, bound) }
    } catch {
      return { failed: true }
    }
  }
  balance.spendable = await decrypt(
    token.ConfidentialBalanceSpending,
    params.holderPrivateKey,
  )
  balance.inbox = await decrypt(
    token.ConfidentialBalanceInbox,
    params.holderPrivateKey,
  )
  if (params.issuerPrivateKey != null) {
    balance.issuerView = await decrypt(
      token.IssuerEncryptedBalance,
      params.issuerPrivateKey,
    )
  }
  return balance
}

