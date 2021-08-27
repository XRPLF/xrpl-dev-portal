// Stand-alone code sample for the "Require Destination Tags" tutorial:
// https://xrpl.org/require-destination-tags.html

// Dependencies for Node.js.
// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
  // gotta use var here because const/let are block-scoped to the if statement.
  var ripple = require('ripple-lib')
}

// Connect -------------------------------------------------------------------
async function main() {
  console.log("Connecting to Testnet...")
  const api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
  await api.connect()

  // Get credentials from the Testnet Faucet -----------------------------------
  console.log("Requesting addresses from the Testnet faucet...")
  const data = await api.generateFaucetWallet()
  const address = data.account.address
  const secret = data.account.secret

  console.log("Waiting until we have a validated starting sequence number...")
  // If you go too soon, the funding transaction might slip back a ledger and
  // then your starting Sequence number will be off. This is mostly relevant
  // when you want to use a Testnet account right after getting a reply from
  // the faucet.
  while (true) {
    try {
      await api.request("account_info", {account: address, ledger_index: "validated"})
      break
    } catch(e) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }


  // Send AccountSet transaction -----------------------------------------------
  const prepared = await api.prepareTransaction({
    "TransactionType": "AccountSet",
    "Account": address,
    "SetFlag": 1 // RequireDest
  })
  console.log("Prepared transaction:", prepared.txJSON)
  const max_ledger = prepared.instructions.maxLedgerVersion

  const signed = api.sign(prepared.txJSON, secret)
  console.log("Transaction hash:", signed.id)
  const tx_id = signed.id
  const tx_blob = signed.signedTransaction

  const prelim_result = await api.request("submit", {"tx_blob": tx_blob})
  console.log("Preliminary result:", prelim_result)
  const min_ledger = prelim_result.validated_ledger_index

  // (Semi-)reliable Transaction Submission ------------------------------------
  console.log(`Begin final outcome lookup.
    tx_id: ${tx_id}
    max_ledger: ${max_ledger}
    min_ledger: ${min_ledger}`)
  let tx_status
  try {
    tx_status = await lookup_tx_final(api, tx_id, max_ledger, min_ledger)
  } catch(err) {
    tx_status = err
  }
  console.log("Final transaction status:", tx_status)

  // Confirm Account Settings --------------------------------------------------
  let account_info = await api.request("account_info", {
      "account": address,
      "ledger_index": "validated"
  })
  const flags = api.parseAccountFlags(account_info.account_data.Flags)
  console.log(JSON.stringify(flags, null, 2))
  if (flags.requireDestinationTag) {
    console.log("Require Destination Tag is enabled.")
  } else {
    console.log("Require Destination Tag is DISABLED.")
  }
}

main()
