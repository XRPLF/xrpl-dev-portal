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
// regular key or multi-signing list configured.
// To black-hole an account, set the RegularKey to a well-known blackhole
// address such as rrrrrrrrrrrrrrrrrrrrrhoLvTp instead.
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

// Disable master key pair -----------------------------------------------------
const disableMasterKeyTx = {
  TransactionType: 'AccountSet',
  Account: wallet.address,
  SetFlag: xrpl.AccountSetAsfFlags.asfDisableMaster
}
xrpl.validate(disableMasterKeyTx)

console.log('Disabling master key pair...')
const response2 = await client.submitAndWait(disableMasterKeyTx, {
  wallet, // only the master key pair can disable itself
  autofill: true
})
const disableMasterResultCode = response2.result.meta.TransactionResult
if (disableMasterResultCode === 'tesSUCCESS') {
  console.log('Master key disabled successfully.')
} else {
  console.error(`AccountSet failed with code ${disableMasterResultCode}.`)
  client.disconnect()
  process.exit(1)
}

// Confirm account flags -------------------------------------------------------
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
console.log(`Flags for account ${wallet.address}:`)
console.log(JSON.stringify(accountInfoResp.result.account_flags, null, 2))
if (accountInfoResp.result.account_flags.disableMasterKey) {
  console.log('✅ Master key pair is disabled')
} else {
  console.log('❌ Master key pair is ENABLED')
}

client.disconnect()
