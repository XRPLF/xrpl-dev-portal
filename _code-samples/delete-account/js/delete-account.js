import { Client, Wallet, getBalanceChanges, validate } from 'xrpl'
import 'dotenv/config'

const client = new Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

// Where to send the deleted account's remaining XRP:
const DESTINATION_ACCOUNT = 'rJjHYTCPpNA3qAM8ZpCDtip3a8xg7B8PFo' // Testnet faucet

// Load the account to delete from .env file -----------------------------------
// If the seed value is still the default, get a new account from the faucet.
// It won't be deletable immediately.
let wallet
if (!process.env.ACCOUNT_SEED || process.env.ACCOUNT_SEED === 's████████████████████████████') {
  console.log("Couldn't load seed from .env; getting account from the faucet.")
  wallet = (await client.fundWallet()).wallet
  console.log(`Got new account from faucet:
    Address: ${wallet.address}
    Seed: ${wallet.seed}
  `)

  console.log('Edit the .env file to add this seed, then wait until the account can be deleted.')
} else {
  wallet = Wallet.fromSeed(process.env.ACCOUNT_SEED, { algorithm: process.env.ACCOUNT_ALGORITHM })
  console.log(`Loaded account: ${wallet.address}`)
}

// Check account info to see if account can be deleted -------------------------
let acctInfoResp
try {
  acctInfoResp = await client.request({
    command: 'account_info',
    account: wallet.address,
    ledger_index: 'validated'
  })
} catch (err) {
  console.error('account_info failed with error:', err)
  client.disconnect()
  process.exit(1)
}

let numProblems = 0

// Check if sequence number is too high
const acctSeq = acctInfoResp.result.account_data.Sequence
const lastValidatedLedgerIndex = acctInfoResp.result.ledger_index
if (acctSeq + 255 > lastValidatedLedgerIndex) {
  console.error(`Account is too new to be deleted.
    Account sequence + 255: ${acctSeq + 255}
    Validated ledger index: ${lastValidatedLedgerIndex}
    (Sequence + 255 must be less than or equal to the ledger index)`)

  // Estimate time until deletability assuming ledgers close every ~3.5 seconds
  const estWaitTimeS = (acctSeq + 255 - lastValidatedLedgerIndex) * 3.5
  if (estWaitTimeS < 120) {
    console.log(`Estimate: ${estWaitTimeS} seconds until account can be deleted`)
  } else {
    const estWaitTimeM = Math.round(estWaitTimeS / 60, 0)
    console.log(`Estimate: ${estWaitTimeM} minutes until account can be deleted`)
  }

  numProblems += 1
} else {
  console.log(`OK: Account sequence number (${acctSeq}) is low enough.`)
}

// Check if owner count is too high
const ownerCount = acctInfoResp.result.account_data.OwnerCount
if (ownerCount > 1000) {
  console.error(`Account owns too many objects in the ledger.
    Owner count: ${ownerCount}
    (Must be 1000 or less)`)
  numProblems += 1
} else {
  console.log(`OK: Account owner count (${ownerCount}) is low enough.`)
}

// Check if XRP balance is high enough
// Look up current incremental owner reserve to compare vs account's XRP balance
// using server_state so that both are in drops
let serverStateResp
try {
  serverStateResp = await client.request({
    command: 'server_state'
  })
} catch (err) {
  console.error('server_state failed with error:', err)
  client.disconnect()
  process.exit(1)
}
const deletionCost = serverStateResp.result.state.validated_ledger?.reserve_inc
if (!deletionCost) {
  console.error("Couldn't get reserve values from server. " +
    "Maybe it's not synced to the network?")
  client.disconnect()
  process.exit(1)
}

const acctBalance = acctInfoResp.result.account_data.Balance
if (acctBalance < deletionCost) {
  console.error(`Account does not have enough XRP to pay the cost of deletion.
    Balance: ${acctBalance}
    Cost of account deletion: ${deletionCost}`)
  numProblems += 1
} else {
  console.log(`OK: Account balance (${acctBalance} drops) is high enough.`)
}

// Check if FirstNFTSequence is too high
const firstNFTSeq = acctInfoResp.result.account_data.FirstNFTokenSequence || 0
const mintedNFTs = acctInfoResp.result.account_data.MintedNFTokens || 0
if (firstNFTSeq + mintedNFTs + 255 > lastValidatedLedgerIndex) {
  console.error(`Account's FirstNFTokenSequence + MintedNFTokens + 255 is too high.
    Current total: ${firstNFTSeq + mintedNFTs + 255}
    Validated ledger index: ${lastValidatedLedgerIndex}
    (FirstNFTokenSequence + MintedNFTokens + 255 must be less than or equal to the ledger index)`)
  numProblems += 1
} else {
  console.log('OK: FirstNFTokenSequence + MintedNFTokens is low enough.')
}

// Check that all issued NFTs have been burned
const burnedNFTs = acctInfoResp.result.account_data.BurnedNFTokens || 0
if (mintedNFTs > burnedNFTs) {
  console.error(`Account has issued NFTs outstanding.
    Number of NFTs minted: ${mintedNFTs}
    Number of NFTs burned: ${burnedNFTs}`)
  numProblems += 1
} else {
  console.log('OK: No outstanding, un-burned NFTs')
}

// Stop if any problems were found
if (numProblems) {
  console.error(`A total of ${numProblems} problem(s) prevent the account from being deleted.`)
  client.disconnect()
  process.exit(1)
}

// Check for deletion blockers -------------------------------------------------
const blockers = []
let marker
const ledger_index = 'validated'
while (true) {
  let accountObjResp
  try {
    accountObjResp = await client.request({
      command: 'account_objects',
      account: wallet.address,
      deletion_blockers_only: true,
      ledger_index,
      marker
    })
  } catch (err) {
    console.error('account_objects failed with error:', err)
    client.disconnect()
    process.exit(1)
  }

  for (const obj of accountObjResp.result.account_objects) {
    blockers.push(obj)
  }
  if (accountObjResp.result.marker) {
    marker = accountObjResp.result.marker
  } else {
    break
  }
}
if (!blockers.length) {
  console.log('OK: Account has no deletion blockers.')
} else {
  console.log(`Account cannot be deleted until ${blockers.length} blocker(s) are removed:`)
  for (const blocker of blockers) {
    console.log(JSON.stringify(blocker, null, 2))
  }
  client.disconnect()
  process.exit(1)
}

// Delete the account ----------------------------------------------------------
const accountDeleteTx = {
  TransactionType: 'AccountDelete',
  Account: wallet.address,
  Destination: DESTINATION_ACCOUNT
}
validate(accountDeleteTx)

console.log('Signing and submitting the AccountDelete transaction:',
  JSON.stringify(accountDeleteTx, null, 2))
const deleteTxResponse = await client.submitAndWait(accountDeleteTx, { wallet, autofill: true, failHard: true })

// Check result of the AccountDelete transaction -------------------------------
console.log(JSON.stringify(deleteTxResponse.result, null, 2))
const resultCode = deleteTxResponse.result.meta.TransactionResult
if (resultCode !== 'tesSUCCESS') {
  console.error(`AccountDelete failed with code ${resultCode}.`)
  client.disconnect()
  process.exit(1)
}

console.log('Account deleted successfully.')
const balanceChanges = getBalanceChanges(deleteTxResponse.result.meta)
console.log('Balance changes:', JSON.stringify(balanceChanges, null, 2))

client.disconnect()
