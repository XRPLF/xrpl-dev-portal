import xrpl from 'xrpl'

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

console.log('Funding new wallet from faucet...')
const { wallet } = await client.fundWallet()
console.log(`Funded. Master key pair:
  Address: ${wallet.address}
  Seed: ${wallet.seed}
`)

// Generate a regular key and assign it to the account -------------------------
// Skip this step if you are using a pre-existing account that already has a
// regular key configured.
const algorithm = 'ed25519'
const regularKeyPair = xrpl.Wallet.generate(algorithm)
console.log(`Generated regular key pair:
  Address: ${regularKeyPair.address}
  Seed: ${regularKeyPair.seed}
  Algorithm: ${algorithm}
`)
const regularKeyTx = {
  TransactionType: 'SetRegularKey',
  Account: wallet.address,
  RegularKey: regularKeyPair.address
}
xrpl.validate(regularKeyTx)

console.log('Assigning regular key to the account...')
const response = await client.submitAndWait(regularKeyTx, { wallet, autofill: true })
const setRegularKeyResultCode = response.result.meta.TransactionResult
if (setRegularKeyResultCode === 'tesSUCCESS') {
  console.log('Regular Key set successfully.')
} else {
  console.error(`SetRegularKey failed with code ${setRegularKeyResultCode}.`)
  client.disconnect()
  process.exit(1)
}

// Check regular key associated with account -----------------------------------
const accountInfoResp = await client.request({
  command: 'account_info',
  account: wallet.address,
  ledger_index: 'validated'
})
if (accountInfoResp.error) {
  console.error('Error looking up account:', accountInfoResp.error)
  client.disconnect()
  process.exit(1)
}
console.log(`Account info for ${wallet.address}:`)
console.log(JSON.stringify(accountInfoResp.result.account_data, null, 2))
if (accountInfoResp.result.account_data.RegularKey) {
  console.log('Current regular key:',
    accountInfoResp.result.account_data.RegularKey
  )
} else {
  console.log('No regular key set.')
  client.disconnect()
  process.exit(1)
}

// Remove regular key from account ---------------------------------------------
const removeRegularKeyTx = {
  TransactionType: 'SetRegularKey',
  Account: wallet.address
  // Omit RegularKey field to remove existing regular key from account
}
xrpl.validate(removeRegularKeyTx)

console.log('Removing regular key from account...')
const removeResp = await client.submitAndWait(removeRegularKeyTx, {
  wallet: regularKeyPair, // When removing, you can use the regular key or master key
  autofill: true
})
const removeRegularKeyResultCode = removeResp.result.meta.TransactionResult
if (removeRegularKeyResultCode === 'tesSUCCESS') {
  console.log('Regular Key successfully removed.')
} else {
  console.error('SetRegularKey (removing) failed with code', 
    removeRegularKeyResultCode
  )
  client.disconnect()
  process.exit(1)
}

// Confirm that the account has no regular key ---------------------------------
const accountInfoResp2 = await client.request({
  command: 'account_info',
  account: wallet.address,
  ledger_index: 'validated'
})
if (accountInfoResp2.error) {
  console.error('Error looking up account:', accountInfoResp2.error)
  client.disconnect()
  process.exit(1)
}
console.log(`Account info for ${wallet.address}:`)
console.log(JSON.stringify(accountInfoResp2.result.account_data, null, 2))
if (accountInfoResp2.result.account_data.RegularKey) {
  console.log('Regular key address is:', 
    accountInfoResp2.result.account_data.RegularKey
  )
} else {
  console.log('No regular key set.')
}

client.disconnect()
