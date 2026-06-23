import xrpl from 'xrpl'

// Use Tickets with multi-signing: each Ticket holds a Sequence slot for a
// transaction while you collect signatures from multiple signers.

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

// Set up the main account and three signers ------------------------------
// Signer accounts only need cryptographically valid keys; the addresses
// don't need to be funded or exist on the ledger.
console.log('Funding main account from the faucet...')
const { wallet: mainWallet } = await client.fundWallet()
const signer1 = xrpl.Wallet.generate()
const signer2 = xrpl.Wallet.generate()
const signer3 = xrpl.Wallet.generate()
console.log(`Main account: ${mainWallet.address}`)

// Configure the signer list (quorum 2 of 3) -------------------------------
console.log('Submitting SignerListSet...')
const signerListResult = await client.submitAndWait({
  TransactionType: 'SignerListSet',
  Account: mainWallet.address,
  SignerQuorum: 2,
  SignerEntries: [
    { SignerEntry: { Account: signer1.address, SignerWeight: 1 } },
    { SignerEntry: { Account: signer2.address, SignerWeight: 1 } },
    { SignerEntry: { Account: signer3.address, SignerWeight: 1 } }
  ]
}, { wallet: mainWallet, autofill: true })
console.log(`SignerListSet hash: ${signerListResult.result.hash}`)

// Create Tickets ----------------------------------------------------------
console.log('Submitting TicketCreate (3 Tickets)...')
const ticketCreateResult = await client.submitAndWait({
  TransactionType: 'TicketCreate',
  Account: mainWallet.address,
  TicketCount: 3
}, { wallet: mainWallet, autofill: true })
console.log(`TicketCreate hash: ${ticketCreateResult.result.hash}`)

// Pick a Ticket -----------------------------------------------------------
const ticketsResponse = await client.request({
  command: 'account_objects',
  account: mainWallet.address,
  type: 'ticket'
})
const useTicket = ticketsResponse.result.account_objects[0].TicketSequence
console.log(`Using Ticket Sequence: ${useTicket}`)

// Prepare a multi-signed transaction that consumes the Ticket.
// Omit LastLedgerSequence so the transaction does not expire while
// signatures are being collected.
const preparedTx = await client.autofill({
  TransactionType: 'AccountSet',
  Account: mainWallet.address,
  TicketSequence: useTicket,
  LastLedgerSequence: null,
  Sequence: 0
}, 3) // signersCount for multi-sig fee calculation

// In a real workflow you would share preparedTx with each signer and
// receive their signed blobs back; here we sign in one process for clarity.
const { tx_blob: signedBlob1 } = signer1.sign(preparedTx, true)
const { tx_blob: signedBlob2 } = signer2.sign(preparedTx, true)
const { tx_blob: signedBlob3 } = signer3.sign(preparedTx, true)

const multisignedBlob = xrpl.multisign([signedBlob1, signedBlob2, signedBlob3])
console.log('Submitting multi-signed AccountSet...')
const multisigResult = await client.submitAndWait(multisignedBlob)
console.log(`Multi-sig hash: ${multisigResult.result.hash}, result: ${multisigResult.result.meta.TransactionResult}`)

// Disconnect when done (If you omit this, Node.js won't end the process)
await client.disconnect()
