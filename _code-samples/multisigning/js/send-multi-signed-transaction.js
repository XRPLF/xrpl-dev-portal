import xrpl from 'xrpl'

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

console.log('Funding new wallet from faucet...')
const { wallet } = await client.fundWallet()
console.log(`Funded. Master key pair:
  Address: ${wallet.address}
  Seed: ${wallet.seed}
`)

// Set up multi-signing --------------------------------------------------------
// Skip this step if you are using an existing account with multi-signing
// already set up.
const algorithm = 'ed25519'
const signers = []
for (let i = 0; i < 3; i++) {
  const signer = xrpl.Wallet.generate(algorithm)
  console.log(`Generated key pair for signer ${i + 1}:
  Address: ${signer.address}
  Seed: ${signer.seed}
  Algorithm: ${algorithm}
`)
  signers.push(signer)
}
const signerEntries = []
for (const signer of signers) {
  signerEntries.push({
    SignerEntry: {
      Account: signer.address,
      SignerWeight: 1
    }
  })
}
const signerListSetTx = {
  TransactionType: 'SignerListSet',
  Account: wallet.address,
  SignerQuorum: 2,
  SignerEntries: signerEntries
}
xrpl.validate(signerListSetTx)
console.log('Setting up multi-signing...')
const response = await client.submitAndWait(signerListSetTx, { wallet, autofill: true })
const listSetResultCode = response.result.meta.TransactionResult
if (listSetResultCode === 'tesSUCCESS') {
  console.log('... done.')
} else {
  console.error(`SignerListSet failed with code ${listSetResultCode}.`)
  client.disconnect()
  process.exit(1)
}

// Prepare transaction ---------------------------------------------------------
// This example uses a no-op AccountSet, but you could send almost any type
// of transaction the same way.
const numSigners = 2
const txInstructions = await client.autofill({
  TransactionType: 'AccountSet',
  Account: wallet.address
}, numSigners)
console.log('Transaction ready for signing:')
console.log(JSON.stringify(txInstructions, null, 2))

// Collect signatures ----------------------------------------------------------
const txSignedByKey1 = signers[0].sign(txInstructions, true)
console.log('Signed by signer #1:', JSON.stringify(txSignedByKey1, null, 2))
const txSignedByKey2 = signers[1].sign(txInstructions, true)
console.log('Signed by signer #2:', JSON.stringify(txSignedByKey2, null, 2))

// Combine signatures and submit -----------------------------------------------
const multisignedTx = xrpl.multisign([txSignedByKey1.tx_blob, txSignedByKey2.tx_blob])
console.log('Combined multi-signed transaction:',
  JSON.stringify(multisignedTx, null, 2)
)

const response2 = await client.submitAndWait(multisignedTx)
const multisignedResultCode = response2.result.meta.TransactionResult
if (multisignedResultCode === 'tesSUCCESS') {
  const txHash = response2.result.hash
  console.log(`Multi-signed transaction ${txHash} succeeded!`)
} else {
  console.error('Multi-signed transaction failed with result code',
    multisignedResultCode
  )
  client.disconnect()
  process.exit(1)
}

client.disconnect()
