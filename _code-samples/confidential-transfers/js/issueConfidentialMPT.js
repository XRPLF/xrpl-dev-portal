import fs from 'fs'
import {
  Client,
  MPTokenIssuanceCreateFlags,
  encodeMPTokenMetadata
} from 'xrpl'
import {
  deriveConfidentialKeypair,
  fetchMPToken,
  fetchMPTokenIssuance,
  loadMptCrypto,
  prepareConfidentialConvert,
  prepareConfidentialMergeInbox
} from 'xrpl/confidential'

// Connect to the network ----------------------
const client = new Client('wss://s.devnet.rippletest.net:51233')
await client.connect()

const EXPLORER = 'https://devnet.xrpl.org'
const ticker = 'CTST'
const supplyAmount = 12000

// Fund the accounts ----------------------
// An issuer cannot hold a confidential balance on the account that issues the
// token, because an issuer's own balance is not counted as tokens in
// circulation. Confidential tokens enter circulation through a second account
// the issuer controls, which the ledger treats as a regular holder.
console.log(`\n=== Funding accounts... ===`)
const [{ wallet: issuer }, { wallet: issuerSecondAccount }, { wallet: auditor }] =
  await Promise.all([
    client.fundWallet(),
    client.fundWallet(),
    client.fundWallet()
  ])
console.log(`Issuer address: ${issuer.address}`)
console.log(`Issuer second account address: ${issuerSecondAccount.address}`)
console.log(`Auditor address: ${auditor.address}`)

// Generate confidential encryption keypairs ----------------------
// These ElGamal keypairs are separate from the accounts' signing keys.
console.log(`\n=== Generating confidential encryption keypairs... ===`)
const issuerKeys = deriveConfidentialKeypair(issuer.seed)
const issuerSecondAccountKeys = deriveConfidentialKeypair(issuerSecondAccount.seed)
const auditorKeys = deriveConfidentialKeypair(auditor.seed)
console.log(`Issuer public encryption key: ${issuerKeys.publicKey}`)
console.log(`Second account public encryption key: ${issuerSecondAccountKeys.publicKey}`)
console.log(`Auditor public encryption key: ${auditorKeys.publicKey}`)

// Create the MPT issuance ----------------------
console.log(`\n=== Creating the MPT issuance ===`)
const mptMetadata = {
  ticker,
  name: 'Confidential Token',
  desc: 'A confidential demo token.',
  icon: 'https://example.org/ctst-icon.png',
  asset_class: 'rwa',
  asset_subclass: 'treasury',
  issuer_name: 'Example Financial Corp',
  additional_info: {
    interest_rate: '4.25%',
    interest_type: 'fixed'
  }
}

const mptIssuanceCreate = {
  TransactionType: 'MPTokenIssuanceCreate',
  Account: issuer.address,
  AssetScale: 0,
  MaximumAmount: '1000000000',
  TransferFee: 0,
  Flags:
    MPTokenIssuanceCreateFlags.tfMPTCanHoldConfidentialBalance |
    MPTokenIssuanceCreateFlags.tfMPTCanTransfer |
    MPTokenIssuanceCreateFlags.tfMPTCanClawback |
    MPTokenIssuanceCreateFlags.tfMPTCanLock,
  MPTokenMetadata: encodeMPTokenMetadata(mptMetadata)
}

const createResponse = await client.submitAndWait(mptIssuanceCreate, {
  wallet: issuer,
  autofill: true
})
if (createResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = createResponse.result.meta.TransactionResult
  console.error('Error: Unable to create the MPT issuance:', resultCode)
  await client.disconnect()
  process.exit(1)
}
const mptIssuanceID = createResponse.result.meta.mpt_issuance_id
console.log(`MPT issuance ID: ${mptIssuanceID}`)
console.log(`${EXPLORER}/transactions/${createResponse.result.hash}`)

// Register the encryption keys on the issuance ----------------------
console.log(`\n=== Registering the encryption keys... ===`)
const mptIssuanceSet = {
  TransactionType: 'MPTokenIssuanceSet',
  Account: issuer.address,
  MPTokenIssuanceID: mptIssuanceID,
  IssuerEncryptionKey: issuerKeys.publicKey,
  AuditorEncryptionKey: auditorKeys.publicKey
}

const setResponse = await client.submitAndWait(mptIssuanceSet, {
  wallet: issuer,
  autofill: true
})
if (setResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = setResponse.result.meta.TransactionResult
  console.error('Error: Unable to register the encryption keys:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log('Issuer and auditor encryption keys registered.')
console.log(`${EXPLORER}/transactions/${setResponse.result.hash}`)

// Authorize the second account ----------------------
console.log(`\n=== Authorizing the issuer second account... ===`)
const mptAuthorize = {
  TransactionType: 'MPTokenAuthorize',
  Account: issuerSecondAccount.address,
  MPTokenIssuanceID: mptIssuanceID
}

const authorizeResponse = await client.submitAndWait(mptAuthorize, {
  wallet: issuerSecondAccount,
  autofill: true
})
if (authorizeResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = authorizeResponse.result.meta.TransactionResult
  console.error('Error: Unable to authorize the second account:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log(`${issuerSecondAccount.address} is authorized to hold the MPT.`)
console.log(`${EXPLORER}/transactions/${authorizeResponse.result.hash}`)

// Send public tokens to the second account ----------------------
console.log(`\n=== Sending public tokens to the second account... ===`)
const payment = {
  TransactionType: 'Payment',
  Account: issuer.address,
  Destination: issuerSecondAccount.address,
  Amount: {
    mpt_issuance_id: mptIssuanceID,
    value: String(supplyAmount)
  }
}

const paymentResponse = await client.submitAndWait(payment, {
  wallet: issuer,
  autofill: true
})
if (paymentResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = paymentResponse.result.meta.TransactionResult
  console.error('Error: Unable to send the payment:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log(`Issuer sent ${supplyAmount} ${ticker} to ${issuerSecondAccount.address}.`)
console.log(`${EXPLORER}/transactions/${paymentResponse.result.hash}`)

// Convert the public balance to a confidential balance ----------------------
console.log(`\n=== Converting public balance to confidential... ===`)
const convertTx = await prepareConfidentialConvert(client, {
  account: issuerSecondAccount.address,
  mptIssuanceID,
  amount: BigInt(supplyAmount),
  holderKeypair: issuerSecondAccountKeys
})
console.log(JSON.stringify(convertTx, null, 2))

const convertResponse = await client.submitAndWait(convertTx, {
  wallet: issuerSecondAccount,
  autofill: true
})
if (convertResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = convertResponse.result.meta.TransactionResult
  console.error('Error: Unable to convert the balance:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log(`Converted ${supplyAmount} ${ticker} into a confidential balance.`)
console.log(`${EXPLORER}/transactions/${convertResponse.result.hash}`)

// Merge the inbox into the spending balance ----------------------
// A conversion lands in the inbox balance. Merging folds it into the spending
// balance, which is the only balance a confidential send can draw from.
console.log(`\n=== Merging inbox into spending balance... ===`)
const mergeTx = await prepareConfidentialMergeInbox(client, {
  account: issuerSecondAccount.address,
  mptIssuanceID
})
console.log(JSON.stringify(mergeTx, null, 2))

const mergeResponse = await client.submitAndWait(mergeTx, {
  wallet: issuerSecondAccount,
  autofill: true
})
if (mergeResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = mergeResponse.result.meta.TransactionResult
  console.error('Error: Unable to merge the inbox:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log('Inbox merged into the spending balance.')
console.log(`${EXPLORER}/transactions/${mergeResponse.result.hash}`)

// Decrypt the confidential balance ----------------------
console.log(`\n=== Decrypting the confidential balance... ===`)
const [mptoken, mptIssuance] = await Promise.all([
  fetchMPToken(client, issuerSecondAccount.address, mptIssuanceID),
  fetchMPTokenIssuance(client, mptIssuanceID)
])

// The entry carries the same balance once per registered key, so each party
// reads it with their own private key.
console.log(`MPToken entry:`)
console.log(JSON.stringify(mptoken, null, 2))

const crypto = await loadMptCrypto()
const confidentialSupply = BigInt(mptIssuance.ConfidentialOutstandingAmount)

// Only a party holding the matching private key can decrypt the balance.
const secondAccountBalance = await crypto.decryptAmount(
  mptoken.ConfidentialBalanceSpending,
  issuerSecondAccountKeys.privateKey,
  confidentialSupply
)
console.log(`\nSecond account reads its balance as: ${secondAccountBalance} ${ticker}`)

// The auditor reads the same amount from a separate ciphertext on the same
// entry, using its own private key.
const auditorView = await crypto.decryptAmount(
  mptoken.AuditorEncryptedBalance,
  auditorKeys.privateKey,
  confidentialSupply
)
console.log(`Auditor reads the balance as: ${auditorView} ${ticker}`)

// Save the accounts and keys ----------------------
// Losing an encryption private key makes a confidential balance permanently
// unspendable, so write the seeds and keypairs to keys.json.
console.log(`\n=== Saving accounts and keys to keys.json... ===`)
const keysData = {
  description:
    'This file is auto-generated by issueConfidentialMPT.js. It stores the account seeds and confidential encryption keypairs that script created.',
  issuer: {
    seed: issuer.seed,
    privateKey: issuerKeys.privateKey,
    publicKey: issuerKeys.publicKey
  },
  issuerSecondAccount: {
    seed: issuerSecondAccount.seed,
    privateKey: issuerSecondAccountKeys.privateKey,
    publicKey: issuerSecondAccountKeys.publicKey
  },
  auditor: {
    seed: auditor.seed,
    privateKey: auditorKeys.privateKey,
    publicKey: auditorKeys.publicKey
  }
}

fs.writeFileSync('keys.json', JSON.stringify(keysData, null, 2))
console.log('Saved keys to file.')

await client.disconnect()
