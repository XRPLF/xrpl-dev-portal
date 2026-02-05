import xrpl from 'xrpl'

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

console.log('Funding new wallet from faucet...')
const { wallet } = await client.fundWallet()
console.log(`Funded. Master key pair:
  Address: ${wallet.address}
  Seed: ${wallet.seed}
`)

// Generate a new key pair to use as the regular key ---------------------------
const algorithm = 'ed25519'
const regularKeyPair = xrpl.Wallet.generate(algorithm)
console.log(`Generated regular key pair:
  Address: ${regularKeyPair.address}
  Seed: ${regularKeyPair.seed}
  Algorithm: ${algorithm}
`)

// Send SetRegularKey transaction ----------------------------------------------
const regularKeyTx = {
  TransactionType: 'SetRegularKey',
  Account: wallet.address,
  RegularKey: regularKeyPair.address
}
xrpl.validate(regularKeyTx)

console.log('Signing and submitting the SetRegularKey transaction:',
  JSON.stringify(regularKeyTx, null, 2))
const response = await client.submitAndWait(regularKeyTx, { wallet, autofill: true })

// Check result of the SetRegularKey transaction -------------------------------
console.log(JSON.stringify(response.result, null, 2))
const setRegularKeyResultCode = response.result.meta.TransactionResult
if (setRegularKeyResultCode === 'tesSUCCESS') {
  console.log('Regular Key set successfully.')
} else {
  console.error(`SetRegularKey failed with code ${setRegularKeyResultCode}.`)
  client.disconnect()
  process.exit(1)
}

// Send a test transaction using the regular key -------------------------------
const testTx = {
  TransactionType: 'AccountSet',
  Account: wallet.address
}
xrpl.validate(testTx)

console.log('Signing and submitting the test transaction using the regular key')
const testResponse = await client.submitAndWait(testTx, {
  wallet: regularKeyPair, // IMPORTANT: use the regular key pair here
  autofill: true
})

// Check result of the test transaction ----------------------------------------
console.log(JSON.stringify(testResponse.result, null, 2))
const testResultCode = testResponse.result.meta.TransactionResult
const testSigningPubKey = testResponse.result.tx_json.SigningPubKey
if (testResultCode === 'tesSUCCESS') {
  console.log('Test transaction was successful.')
} else {
  console.log(`Test transaction failed with code ${testResultCode}`)
}
if (testSigningPubKey === regularKeyPair.publicKey) {
  console.log('This transaction was signed with the regular key pair.')
} else if (testSigningPubKey === wallet.publicKey) {
  console.warn('This transaction was signed with the master key pair.')
} else {
  console.warn(`Unexpected signing key mismatch.
    Regular key: ${regularKeyPair.publicKey}
    Key used: ${testSigningPubKey}`)
}

client.disconnect()
