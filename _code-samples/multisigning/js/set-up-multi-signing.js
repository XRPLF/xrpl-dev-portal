import xrpl from 'xrpl'

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

console.log('Funding new wallet from faucet...')
const { wallet } = await client.fundWallet()
console.log(`Funded. Master key pair:
  Address: ${wallet.address}
  Seed: ${wallet.seed}
`)

// Generate key pairs to use as signers ----------------------------------------
// If each signer represents a separate person, they should generate their own
// key pairs and send you just the address. These key pairs don't need to be
// funded accounts in the ledger.
const algorithm = 'ed25519'
const signerAddresses = []
for (let i = 0; i < 3; i++) {
  const signer = xrpl.Wallet.generate(algorithm)
  console.log(`Generated key pair for signer ${i + 1}:
  Address: ${signer.address}
  Seed: ${signer.seed}
  Algorithm: ${algorithm}
`)
  signerAddresses.push(signer.address)
}

// Send SignerListSet transaction ----------------------------------------------
// This example sets up a 2-of-3 requirement with all signers weighted equally
const signerEntries = []
for (const signerAddress of signerAddresses) {
  signerEntries.push({
    SignerEntry: {
      Account: signerAddress,
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

console.log('Signing and submitting the SignerListSet transaction:',
  JSON.stringify(signerListSetTx, null, 2))
const response = await client.submitAndWait(signerListSetTx, { wallet, autofill: true })

// Check result of the SignerListSet transaction -------------------------------
console.log(JSON.stringify(response.result, null, 2))
const listSetResultCode = response.result.meta.TransactionResult
if (listSetResultCode === 'tesSUCCESS') {
  console.log('Signer list set successfully.')
} else {
  console.error(`SignerListSet failed with code ${listSetResultCode}.`)
  client.disconnect()
  process.exit(1)
}

// Confirm signer list ---------------------------------------------------------
const accountInfoResp = await client.request({
  command: 'account_info',
  account: wallet.address,
  ledger_index: 'validated',
  signer_lists: true
})
if (accountInfoResp.error) {
  console.error('Error looking up account:', accountInfoResp.error)
  client.disconnect()
  process.exit(1)
}

if (accountInfoResp.result.signer_lists) {
  const lists = accountInfoResp.result.signer_lists
  console.log(`Account has ${lists.length} signer list(s):`)
  for (const l of lists) {
    console.log(`  List #${l.SignerListID} Quorum = ${l.SignerQuorum}`)
    for (const SEWrapper of l.SignerEntries) {
      const se = SEWrapper.SignerEntry
      console.log(`    Signer ${se.Account} Weight = ${se.SignerWeight}`)
    }
  }
} else {
  console.error(`No signer lists associated with ${wallet.address}`)
  client.disconnect()
  process.exit(1)
}

client.disconnect()
