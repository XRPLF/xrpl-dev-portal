import fs from 'fs'
import {
  Client,
  MPTokenIssuanceSetFlags,
  Wallet,
  deriveConfidentialKeypair,
  fetchMPToken,
  fetchMPTokenIssuance,
  loadMptCrypto,
  prepareConfidentialClawback
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

// Set up accounts ----------------------
console.log(`\n=== Getting accounts... ===`)
const issuer = Wallet.fromSeed(setupData.issuer.seed)
const auditor = Wallet.fromSeed(setupData.auditor.seed)
const holder = Wallet.fromSeed(setupData.flaggedHolder.seed)

const issuerKeys = deriveConfidentialKeypair(issuer.seed)
const auditorKeys = deriveConfidentialKeypair(auditor.seed)
const holderKeys = deriveConfidentialKeypair(holder.seed)

const { ticker, mptIssuanceID } = setupData.stablecoin

console.log(`Issuer address: ${issuer.address}`)
console.log(`Holder address: ${holder.address}`)
console.log(`Auditor address: ${auditor.address}`)

// Lock the issuance for the holder ----------------------
console.log(`\n=== Locking ${ticker} for the holder... ===`)
const lockTx = {
  TransactionType: 'MPTokenIssuanceSet',
  Account: issuer.address,
  MPTokenIssuanceID: mptIssuanceID,
  Holder: holder.address,
  Flags: MPTokenIssuanceSetFlags.tfMPTLock
}

const lockResponse = await client.submitAndWait(lockTx, {
  wallet: issuer,
  autofill: true
})
if (lockResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = lockResponse.result.meta.TransactionResult
  console.error('Error: Unable to lock the issuance:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log(`${ticker} is locked for ${holder.address}.`)
console.log(`${EXPLORER}/transactions/${lockResponse.result.hash}`)

// Read the confidential supply before the clawback ----------------------
console.log(`\n=== Reading the confidential supply... ===`)
const mptIssuance = await fetchMPTokenIssuance(client, mptIssuanceID)
const confidentialSupply = BigInt(mptIssuance.ConfidentialOutstandingAmount)
console.log(`Confidential supply before clawback: ${confidentialSupply}`)

// Claw back the confidential balance ----------------------
console.log(`\n=== Clawing back the holder's confidential balance... ===`)
// prepareConfidentialClawback attaches the amount the issuer read and a
// Zero-Knowledge Proof (ZKP) that the amount matches the encrypted balance.
const clawbackTx = await prepareConfidentialClawback(client, {
  account: issuer.address,
  holder: holder.address,
  mptIssuanceID,
  issuerKeypair: issuerKeys
})

// A clawback takes the whole balance, so there is nothing left to reclaim if
// this sample has already run against this setup data. The protocol rejects a
// clawback of zero, so stop before submitting.
if (clawbackTx.MPTAmount === '0') {
  console.error(
    `Error: The confidential balance of ${holder.address} is already zero.`
  )
  console.error(
    'Delete confidentialTransfersSetup.json and run the setup script again.'
  )
  await client.disconnect()
  process.exit(1)
}
console.log(JSON.stringify(clawbackTx, null, 2))

const clawbackResponse = await client.submitAndWait(clawbackTx, {
  wallet: issuer,
  autofill: true
})
if (clawbackResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = clawbackResponse.result.meta.TransactionResult
  console.error('Error: Unable to claw back the balance:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log(`Clawed back ${clawbackTx.MPTAmount} ${ticker} from ${holder.address}.`)
console.log(`${EXPLORER}/transactions/${clawbackResponse.result.hash}`)

// Verify the clawback ----------------------
console.log(`\n=== Verifying the clawback... ===`)
const mptoken = await fetchMPToken(client, holder.address, mptIssuanceID)
console.log(`MPToken entry:`)
console.log(JSON.stringify(mptoken, null, 2))

const crypto = await loadMptCrypto()
const [spendingBalance, inboxBalance, issuerView, auditorView] =
  await Promise.all([
    crypto.decryptAmount(
      mptoken.ConfidentialBalanceSpending,
      holderKeys.privateKey,
      confidentialSupply
    ),
    crypto.decryptAmount(
      mptoken.ConfidentialBalanceInbox,
      holderKeys.privateKey,
      confidentialSupply
    ),
    crypto.decryptAmount(
      mptoken.IssuerEncryptedBalance,
      issuerKeys.privateKey,
      confidentialSupply
    ),
    crypto.decryptAmount(
      mptoken.AuditorEncryptedBalance,
      auditorKeys.privateKey,
      confidentialSupply
    )
  ])
console.log(`\nHolder reads its spending balance as ${spendingBalance} ${ticker}.`)
console.log(`Holder reads its inbox balance as ${inboxBalance} ${ticker}.\n`)
console.log(`Issuer reads the holder's balance as ${issuerView} ${ticker}.`)
console.log(`Auditor reads the holder's balance as ${auditorView} ${ticker}.\n`)

const issuanceAfter = await fetchMPTokenIssuance(client, mptIssuanceID)
const supplyAfter = issuanceAfter.ConfidentialOutstandingAmount
console.log(`Confidential supply after the clawback: ${supplyAfter}`)
console.log(`Total supply in circulation (public + confidential): ${issuanceAfter.OutstandingAmount}`)

await client.disconnect()
