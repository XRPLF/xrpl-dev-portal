import {
  MPTokenIssuanceCreateFlags,
  Client,
  encodeMPTokenMetadata,
  decodeMPTokenMetadata,
} from "xrpl";

// Connect to network and get a wallet
const client = new Client("wss://s.devnet.rippletest.net:51233");
await client.connect();

console.log("=== Funding new wallet from faucet...===");
const { wallet: issuer } = await client.fundWallet();
console.log(`Issuer address: ${issuer.address}`);

// Define metadata as JSON
const mpt_metadata = {
  ticker: "TBILL",
  name: "T-Bill Yield Token",
  desc: "A yield-bearing stablecoin backed by short-term U.S. Treasuries and money market instruments.",
  icon: "https://example.org/tbill-icon.png",
  asset_class: "rwa",
  asset_subclass: "treasury",
  issuer_name: "Example Yield Co.",
  uris: [
    {
      uri: "https://exampleyield.co/tbill",
      category: "website",
      title: "Product Page",
    },
    {
      uri: "https://exampleyield.co/docs",
      category: "docs",
      title: "Yield Token Docs",
    },
  ],
  additional_info: {
    interest_rate: "5.00%",
    interest_type: "variable",
    yield_source: "U.S. Treasury Bills",
    maturity_date: "2045-06-30",
    cusip: "912796RX0",
  },
};

// Encode the metadata.
// The encodeMPTokenMetadata function shortens standard MPTokenMetadata
// field names to a compact key, then converts the JSON metadata object into a
// hex-encoded string, following the XLS-89 standard.
// https://xls.xrpl.org/xls/XLS-0089-multi-purpose-token-metadata-schema.html
console.log("\n=== Encoding metadata...===");
const mpt_metadata_hex = encodeMPTokenMetadata(mpt_metadata);
console.log("Encoded mpt_metadata_hex: ", mpt_metadata_hex);

// Define the transaction, including other MPT parameters
const mpt_issuance_create = {
  TransactionType: "MPTokenIssuanceCreate",
  Account: issuer.address,
  AssetScale: 4,
  MaximumAmount: "50000000",
  TransferFee: 0,
  Flags:
    MPTokenIssuanceCreateFlags.tfMPTCanTransfer |
    MPTokenIssuanceCreateFlags.tfMPTCanTrade,
  MPTokenMetadata: mpt_metadata_hex,
};

// Sign and submit the transaction
console.log("\n=== Sending MPTokenIssuanceCreate transaction...===");
console.log(JSON.stringify(mpt_issuance_create, null, 2));
const submit_response = await client.submitAndWait(mpt_issuance_create, {
  wallet: issuer,
  autofill: true,
});

// Check transaction results
console.log("\n=== Checking MPTokenIssuanceCreate results... ===");
console.log(JSON.stringify(submit_response.result, null, 2));
if (submit_response.result.meta.TransactionResult !== "tesSUCCESS") {
  const result_code = submit_response.result.meta.TransactionResult;
  console.warn(`Transaction failed with result code ${result_code}.`);
  await client.disconnect();
  process.exit(1);
}

const issuance_id = submit_response.result.meta.mpt_issuance_id;
console.log(
  `\n- MPToken created successfully with issuance ID: ${issuance_id}`
);
// View the MPT issuance on the XRPL Explorer
console.log(`- Explorer URL: https://devnet.xrpl.org/mpt/${issuance_id}`);

// Look up MPT Issuance entry in the validated ledger
console.log("\n=== Confirming MPT Issuance metadata in the validated ledger... ===");
const ledger_entry_response = await client.request({
  command: "ledger_entry",
  mpt_issuance: issuance_id,
  ledger_index: "validated",
});

// Decode the metadata.
// The decodeMPTokenMetadata function takes a hex-encoded string representing MPT metadata,
// decodes it to a JSON object, and expands any compact field names to their full forms.
const metadata_blob = ledger_entry_response.result.node.MPTokenMetadata;
const decoded_metadata = decodeMPTokenMetadata(metadata_blob);
console.log("Decoded MPT metadata:\n", decoded_metadata);

// Disconnect from the client
await client.disconnect();
