import fs from 'fs'
import {
  BatchFlags,
  Client,
  GlobalFlags,
  Wallet,
  combineBatchSigners,
  deriveConfidentialKeypair,
  fetchMPToken,
  fetchMPTokenIssuance,
  getConfidentialBalance,
  hashes,
  loadMptCrypto,
  prepareConfidentialMergeInbox,
  prepareConfidentialSend,
  signMultiBatch,
  validate
} from 'xrpl'

import { setup } from './confidentialTransfersSetup.js'

// Connect to the network ----------------------
const client = new Client('wss://s.devnet.rippletest.net:51233')
await client.connect()

const EXPLORER = 'https://devnet.xrpl.org'

// Load setup data ----------------------
// This step checks for the necessary setup data to run the tutorial.
// If missing, confidentialTransfersSetup.js will generate it.
if (!fs.existsSync('confidentialTransfersSetup.json')) {
  console.log(`\n=== Setup data doesn't exist. Running setup script... ===\n`)
  await setup()
}

const setupData = JSON.parse(
  fs.readFileSync('confidentialTransfersSetup.json', 'utf8')
)

// Set up accounts
console.log(`\n=== Getting accounts... ===`)
const { wallet: orchestrator } = await client.fundWallet()
const seller = Wallet.fromSeed(setupData.seller.seed)
const buyer = Wallet.fromSeed(setupData.buyer.seed)
const auditor = Wallet.fromSeed(setupData.auditor.seed)

// deriveConfidentialKeypair rebuilds a confidential encryption keypair from an
// account seed. The same seed always gives the same keypair.
const sellerKeys = deriveConfidentialKeypair(seller.seed)
const buyerKeys = deriveConfidentialKeypair(buyer.seed)
const auditorKeys = deriveConfidentialKeypair(auditor.seed)

console.log(`Orchestrator address: ${orchestrator.address}`)
console.log(`Seller address: ${seller.address}`)
console.log(`Buyer address: ${buyer.address}`)
console.log(`Auditor address: ${auditor.address}`)

// Make each holder's balance spendable ----------------------
console.log(`\n=== Merging inbox balance for seller and buyer... ===`)
const tokens = [setupData.fund, setupData.stablecoin]
const holders = [
  { name: 'Seller', holder: seller, keys: sellerKeys },
  { name: 'Buyer', holder: buyer, keys: buyerKeys }
]
const holdings = [
  { ...setupData.fund, holder: seller },
  { ...setupData.stablecoin, holder: buyer }
]

for (const { ticker, mptIssuanceID, holder } of holdings) {
  const mergeTx = await prepareConfidentialMergeInbox(client, {
    account: holder.address,
    mptIssuanceID
  })
  const mergeResponse = await client.submitAndWait(mergeTx, {
    wallet: holder,
    autofill: true
  })

  const mergeResult = mergeResponse.result.meta.TransactionResult
  if (mergeResult !== 'tesSUCCESS') {
    console.error(`Error: Unable to merge the ${ticker} inbox:`, mergeResult)
    await client.disconnect()
    process.exit(1)
  }
  console.log(`${holder.address} holds spendable confidential ${ticker}.`)
  console.log(`${EXPLORER}/transactions/${mergeResponse.result.hash}\n`)
}

// Build both confidential payments ----------------------
const fundAmount = BigInt(100)
const cashAmount = BigInt(500)

const [fundPayment, cashPayment] = await Promise.all([
  prepareConfidentialSend(client, {
    account: seller.address,
    destination: buyer.address,
    mptIssuanceID: setupData.fund.mptIssuanceID,
    amount: fundAmount,
    senderKeypair: sellerKeys
  }),
  prepareConfidentialSend(client, {
    account: buyer.address,
    destination: seller.address,
    mptIssuanceID: setupData.stablecoin.mptIssuanceID,
    amount: cashAmount,
    senderKeypair: buyerKeys
  })
])

console.log(`=== Prepared confidential payments ===`)
console.log(`Payment1 (Fund): ${JSON.stringify(fundPayment, null, 2)}`)
console.log(`\nPayment2 (Cash): ${JSON.stringify(cashPayment, null, 2)}`)

// Every inner batch transaction must have the tfInnerBatchTxn flag set.
fundPayment.Flags = GlobalFlags.tfInnerBatchTxn
cashPayment.Flags = GlobalFlags.tfInnerBatchTxn

// Settle both payments atomically ----------------------
console.log(`=== Submit confidential payments in batch... ===`)
console.log(`Seller sends ${setupData.fund.ticker} to Buyer.`)
console.log(`Buyer sends ${setupData.stablecoin.ticker} to Seller.\n`)

const batchTx = {
  TransactionType: 'Batch',
  Account: orchestrator.address,
  Flags: BatchFlags.tfAllOrNothing,
  RawTransactions: [
    { RawTransaction: fundPayment },
    { RawTransaction: cashPayment }
  ]
}
validate(batchTx)

const autofilledBatchTx = await client.autofill(batchTx, 2)

const sellerBatch = { ...autofilledBatchTx }
signMultiBatch(seller, sellerBatch)
const buyerBatch = { ...autofilledBatchTx }
signMultiBatch(buyer, buyerBatch)
const combinedBatchTx = combineBatchSigners([sellerBatch, buyerBatch])

const batchResponse = await client.submitAndWait(combinedBatchTx, {
  wallet: orchestrator
})
if (batchResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = batchResponse.result.meta.TransactionResult
  console.error('Error: Unable to submit the Batch:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log(`Batch transaction hash: ${batchResponse.result.hash}`)
console.log(`${EXPLORER}/transactions/${batchResponse.result.hash}`)

// Verify each payment individually ----------------------
// A tesSUCCESS on the Batch only means the Batch itself was well-formed. 
// Hash each inner transaction and look it up to confirm both payments applied.
console.log(`\n=== Verifying both payments... ===`)
const rawTransactions = batchResponse.result.tx_json.RawTransactions

for (const [index, { RawTransaction }] of rawTransactions.entries()) {
  const innerHash = hashes.hashSignedTx(RawTransaction)
  const innerTx = await client.request({ command: 'tx', transaction: innerHash })
  const innerResult = innerTx.result.meta.TransactionResult
  console.log(`Payment ${index + 1}: ${innerResult}`)
  console.log(`${EXPLORER}/transactions/${innerHash}`)

  if (innerResult !== 'tesSUCCESS') {
    console.error('Error: An inner payment failed:', innerResult)
    await client.disconnect()
    process.exit(1)
  }
}
console.log(`\nPayments both successful!`)

// Merge the received amounts into each spending balance ----------------------
console.log(`\n=== Merging settled amounts into spending balance... ===`)
const settlements = [
  { ...setupData.fund, recipient: buyer },
  { ...setupData.stablecoin, recipient: seller }
]

for (const { ticker, mptIssuanceID, recipient } of settlements) {
  const mergeTx = await prepareConfidentialMergeInbox(client, {
    account: recipient.address,
    mptIssuanceID
  })
  const mergeResponse = await client.submitAndWait(mergeTx, {
    wallet: recipient,
    autofill: true
  })
  const mergeResult = mergeResponse.result.meta.TransactionResult
  if (mergeResult !== 'tesSUCCESS') {
    console.error(`Error: Unable to merge the ${ticker} inbox:`, mergeResult)
    await client.disconnect()
    process.exit(1)
  }
  console.log(`${recipient.address} can spend the ${ticker} it received.`)
  console.log(`${EXPLORER}/transactions/${mergeResponse.result.hash}\n`)
}

// Decrypt balances as each holder ----------------------
console.log(`=== Decrypting balances as each holder... ===`)
for (const { name, holder, keys } of holders) {
  console.log(`${name} reads its own balance as:`)
  for (const token of tokens) {
    const balance = await getConfidentialBalance(
      client,
      holder.address,
      token.mptIssuanceID,
      keys.privateKey
    )
    console.log(`     - ${balance} ${token.ticker}`)
  }
}

// Decrypt the balances and amounts as the auditor ----------------------
console.log(`\n=== Decrypting balances and amounts as the auditor... ===`)
const crypto = await loadMptCrypto()

const confidentialSupplies = {}
for (const token of tokens) {
  const issuance = await fetchMPTokenIssuance(client, token.mptIssuanceID)
  confidentialSupplies[token.mptIssuanceID] = BigInt(
    issuance.ConfidentialOutstandingAmount
  )
}

for (const { name, holder } of holders) {
  console.log(`Auditor reads the ${name.toLowerCase()}'s balance as:`)
  for (const token of tokens) {
    const mptoken = await fetchMPToken(
      client,
      holder.address,
      token.mptIssuanceID
    )
    const auditorView = await crypto.decryptAmount(
      mptoken.AuditorEncryptedBalance,
      auditorKeys.privateKey,
      confidentialSupplies[token.mptIssuanceID]
    )
    console.log(`     - ${auditorView} ${token.ticker}`)
  }
}

console.log(`\nAuditor reads the settled amounts as:`)
const settled = [
  { token: setupData.fund, payment: fundPayment },
  { token: setupData.stablecoin, payment: cashPayment }
]
for (const { token, payment } of settled) {
  const settledAmount = await crypto.decryptAmount(
    payment.AuditorEncryptedAmount,
    auditorKeys.privateKey,
    confidentialSupplies[token.mptIssuanceID]
  )
  console.log(`     - ${settledAmount} ${token.ticker}`)
}

await client.disconnect()
