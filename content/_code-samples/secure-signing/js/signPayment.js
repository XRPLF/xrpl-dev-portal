// Sample code demonstrating secure offline signing using xrpl.js library.
const xrpl = require('xrpl')

// Load seed value from an environment variable:
const my_wallet = xrpl.Wallet.fromSeed(process.env['MY_SEED'])

// For offline signing, you need to know your address's next Sequence number
let my_seq = 21404872

// Provide *all* required fields before signing a transaction
const txJSON = {
  "Account": my_wallet.classicAddress,
  "TransactionType":"Payment",
  "Destination":"rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Amount":"13000000",
  "Flags":2147483648,
  "LastLedgerSequence":7835923, // Optional, but recommended.
  "Fee":"13",
  "Sequence": my_seq
}

const tx_blob = my_wallet.signTransaction(txJSON)

console.log("tx_blob is:", tx_blob)
console.log("tx hash is:", xrpl.computeBinaryTransactionSigningHash(tx_blob))
