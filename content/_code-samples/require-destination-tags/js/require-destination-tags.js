// Stand-alone code sample for the "Require Destination Tags" tutorial:
// https://xrpl.org/require-destination-tags.html

// Dependencies for Node.js.
// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}

// Connect -------------------------------------------------------------------
async function main() {
  console.log("Connecting to Testnet...")
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()

  // Get credentials from the Testnet Faucet -----------------------------------
  console.log("Requesting addresses from the Testnet faucet...")
  const { wallet, balance } = await client.fundWallet()

  // Send AccountSet transaction -----------------------------------------------
  const prepared = await client.autofill({
    "TransactionType": "AccountSet",
    "Account": wallet.address,
    "SetFlag": xrpl.AccountSetAsfFlags.asfRequireDest
  })
  console.log("Prepared transaction:", prepared)

  const signed = wallet.sign(prepared)
  console.log("Transaction hash:", signed.hash)

  const submit_result = await client.submitAndWait(signed.tx_blob)
  console.log("Submit result:", submit_result)


  // Confirm Account Settings --------------------------------------------------
  let account_info = await client.request({
    "command": "account_info",
    "account": address,
    "ledger_index": "validated"
  })
  const flags = xrpl.parseAccountFlags(account_info.result.account_data.Flags)
  console.log(JSON.stringify(flags, null, 2))
  if (flags.lsfRequireDestTag) {
    console.log("Require Destination Tag is enabled.")
  } else {
    console.log("Require Destination Tag is DISABLED.")
  }

  // End main()
}

main()
