import xrpl from 'xrpl'
import fs from 'fs'
import { setup } from './sendMPTSetup.js'

// Connect to the network ----------------------
const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

// Load setup data ----------------------
// This step checks for the necessary setup data to run the tutorial.
// If missing, sendMPTSetup.js will generate it.
if (!fs.existsSync('sendMPTSetup.json')) {
  console.log(`\n=== Setup data doesn't exist. Running setup script... ===\n`)
  await setup()
}

// Load preconfigured sender wallet and MPT issuance ID.
const setupData = JSON.parse(fs.readFileSync('sendMPTSetup.json', 'utf8'))
const sender = xrpl.Wallet.fromSeed(setupData.sender.seed)
const mptIssuanceID = setupData.mptIssuanceID

console.log(`Sender address:   ${sender.address}`)
console.log(`MPT issuance ID:  ${mptIssuanceID}`)

// Fund a fresh receiver wallet from the faucet.
console.log(`\nCreating and funding receiver wallet...`)
const { wallet: receiver } = await client.fundWallet()
console.log(`Receiver address: ${receiver.address}`)

// Authorize receiver to hold the MPT ----------------------
console.log(`\n=== Authorizing receiver to hold the MPT... ===\n`)
const authorizeTx = {
  TransactionType: 'MPTokenAuthorize',
  Account: receiver.address,
  MPTokenIssuanceID: mptIssuanceID
}
xrpl.validate(authorizeTx)
console.log(JSON.stringify(authorizeTx, null, 2))

const authorizeResponse = await client.submitAndWait(authorizeTx, {
  wallet: receiver,
  autofill: true
})
if (authorizeResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const code = authorizeResponse.result.meta.TransactionResult
  console.error('Error: MPTokenAuthorize failed:', code)
  await client.disconnect()
  process.exit(1)
}
console.log('Receiver authorized to hold the MPT!')
console.log(`Explorer link: https://testnet.xrpl.org/transactions/${authorizeResponse.result.hash}`)

// Check initial balances ----------------------
/**
 * Return the MPTAmount for the given MPT issuance held by an account.
 *
 * Looks up the holder's MPToken ledger entry directly via ledger_entry. 
 * Returns "0" if the entry doesn't exist or has no
 * MPTAmount.
 *
 * @param {string} address - Classic address of the account to query.
 * @param {string} mptIssuanceID - MPT issuance ID to look up.
 * @returns {Promise<string>} The MPT amount as a string, or "0".
 */
async function getMPTBalance(address, mptIssuanceID) {
  try {
    const response = await client.request({
      command: 'ledger_entry',
      ledger_index: 'validated',
      mptoken: {
        mpt_issuance_id: mptIssuanceID,
        account: address
      }
    })
    return response.result.node?.MPTAmount ?? '0'
  } catch (e) {
    if (e.data?.error === 'entryNotFound') {
      return '0'
    }
    throw e
  }
}

console.log(`\n=== Checking initial MPT balances for issuance ${mptIssuanceID}... ===\n`)
const senderBalanceBefore = await getMPTBalance(sender.address, mptIssuanceID)
const receiverBalanceBefore = await getMPTBalance(receiver.address, mptIssuanceID)
console.log(`Sender balance:   ${senderBalanceBefore}`)
console.log(`Receiver balance: ${receiverBalanceBefore}`)

// Send MPT from sender to receiver ----------------------
console.log(`\n=== Sending MPT payment... ===\n`)
const paymentTx = {
  TransactionType: 'Payment',
  Account: sender.address,
  Destination: receiver.address,
  Amount: {
    mpt_issuance_id: mptIssuanceID,
    value: '100'
  }
}
xrpl.validate(paymentTx)
console.log(JSON.stringify(paymentTx, null, 2))

const paymentResponse = await client.submitAndWait(paymentTx, {
  wallet: sender,
  autofill: true
})
if (paymentResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const code = paymentResponse.result.meta.TransactionResult
  console.error('Error: Payment failed:', code)
  await client.disconnect()
  process.exit(1)
}
console.log('Payment successful!')
console.log(`Explorer link: https://testnet.xrpl.org/transactions/${paymentResponse.result.hash}`)

// Verify balances ----------------------
console.log(`\n=== Checking final MPT balances for issuance ${mptIssuanceID}... ===\n`)
const senderBalanceAfter = await getMPTBalance(sender.address, mptIssuanceID)
const receiverBalanceAfter = await getMPTBalance(receiver.address, mptIssuanceID)
console.log(`Sender balance:   ${senderBalanceAfter}`)
console.log(`Receiver balance: ${receiverBalanceAfter}`)

await client.disconnect()
