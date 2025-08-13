import { stringToHex } from '@xrplf/isomorphic/dist/utils/index.js'
import { MPTokenIssuanceCreateFlags, Client } from 'xrpl'

// Connect to network and get a wallet
const client = new Client('wss://s.devnet.rippletest.net:51233')
await client.connect()

console.log('Funding new wallet from faucet...')
const { wallet } = await client.fundWallet()

// Define metadata as JSON
const mpt_metadata = {
  ticker: 'TBILL',
  name: 'T-Bill Yield Token',
  desc: 'A yield-bearing stablecoin backed by short-term U.S. Treasuries and money market instruments.',
  icon: 'https://example.org/tbill-icon.png',
  asset_class: 'rwa',
  asset_subclass: 'treasury',
  issuer_name: 'Example Yield Co.',
  urls: [
    {
      url: 'https://exampleyield.co/tbill',
      type: 'website',
      title: 'Product Page'
    },
    {
      url: 'https://exampleyield.co/docs',
      type: 'docs',
      title: 'Yield Token Docs'
    }
  ],
  additional_info: {
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
const result = await client.submitAndWait(mpt_issuance_create, { wallet, autofill: true })

// Check transaction results and disconnect
console.log(JSON.stringify(result, null, 2))
if (result.result.meta.TransactionResult === 'tesSUCCESS') {
  const issuance_id = result.result.meta.mpt_issuance_id
  console.log(`MPToken created successfully with issuance ID ${issuance_id}.`)
}

client.disconnect()
