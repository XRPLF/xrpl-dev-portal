import { stringToHex, hexToString } from '@xrplf/isomorphic/dist/utils/index.js'
import { MPTokenIssuanceCreateFlags, Client } from 'xrpl'

// Connect to network and get a wallet
const client = new Client('wss://s.devnet.rippletest.net:51233')
await client.connect()

console.log('Funding new wallet from faucet...')
const { wallet } = await client.fundWallet()

// Define metadata as JSON
const mpt_metadata = {
  t: 'TBILL',
  n: 'T-Bill Yield Token',
  d: 'A yield-bearing stablecoin backed by short-term U.S. Treasuries and money market instruments.',
  i: 'https://example.org/tbill-icon.png',
  ac: 'rwa',
  as: 'treasury',
  in: 'Example Yield Co.',
  us: [
    {
      u: 'https://exampleyield.co/tbill',
      c: 'website',
      t: 'Product Page'
    },
    {
      u: 'https://exampleyield.co/docs',
      c: 'docs',
      t: 'Yield Token Docs'
    }
  ],
  ai: {
    interest_rate: '5.00%',
    interest_type: 'variable',
    yield_source: 'U.S. Treasury Bills',
    maturity_date: '2045-06-30',
    cusip: '912796RX0'
  }
}

// Convert JSON to a string (without excess whitespace), then string to hex
const mpt_metadata_hex = stringToHex(JSON.stringify(mpt_metadata))

// Define the transaction, including other MPT parameters
const mpt_issuance_create = {
  TransactionType: 'MPTokenIssuanceCreate',
  Account: wallet.address,
  AssetScale: 4,
  MaximumAmount: '50000000',
  TransferFee: 0,
  Flags: MPTokenIssuanceCreateFlags.tfMPTCanTransfer |
            MPTokenIssuanceCreateFlags.tfMPTCanTrade,
  MPTokenMetadata: mpt_metadata_hex
}

// Prepare, sign, and submit the transaction
console.log('Sending MPTokenIssuanceCreate transaction...')
const submit_response = await client.submitAndWait(mpt_issuance_create, { wallet, autofill: true })

// Check transaction results and disconnect
console.log(JSON.stringify(submit_response, null, 2))
if (submit_response.result.meta.TransactionResult !== 'tesSUCCESS') {
  const result_code = response.result.meta.TransactionResult
  console.warn(`Transaction failed with result code ${result_code}.`)
  process.exit(1)
}

const issuance_id = submit_response.result.meta.mpt_issuance_id
console.log(`MPToken created successfully with issuance ID ${issuance_id}.`)

// Look up MPT Issuance entry in the validated ledger
console.log('Confirming MPT Issuance metadata in the validated ledger.')
const ledger_entry_response = await client.request({
  "command": "ledger_entry",
  "mpt_issuance": issuance_id,
  "ledger_index": "validated"
})

// Decode the metadata
const metadata_blob = ledger_entry_response.result.node.MPTokenMetadata
const decoded_metadata = JSON.parse(hexToString(metadata_blob))
console.log('Decoded metadata:', decoded_metadata)


client.disconnect()
