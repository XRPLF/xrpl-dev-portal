// Stand-alone code sample for the "issue a token" tutorial:
// https://xrpl.org/issue-a-fungible-token.html

// Dependencies for Node.js.
// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
  // gotta use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
} else {
  // TODO: remove when webpack is fixed
  var xrpl = ripple;
}

// Connect ---------------------------------------------------------------------
async function main() {
  api = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  console.log("Connecting to Testnet...")
  await api.connect()

  // Get credentials from the Testnet Faucet -----------------------------------
  console.log("Requesting addresses from the Testnet faucet...")
  const hot_wallet = (await api.fundWallet()).wallet
  const cold_wallet = (await api.fundWallet()).wallet
  console.log(`Got hot address ${hot_wallet.address} and cold address ${cold_wallet.address}.`)

  // Configure issuer (cold address) settings ----------------------------------
  const cold_settings_tx = {
    "TransactionType": "AccountSet",
    "Account": cold_wallet.address,
    "TransferRate": 0,
    "TickSize": 5,
    "Domain": "6578616D706C652E636F6D", // "example.com"
    "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple
    //"Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP |
    //          xrpl.AccountSetTfFlags.tfRequireDestTag)
  }

  const cst_prepared = await api.autofill(cold_settings_tx)
  const cst_signed = cold_wallet.sign(cst_prepared)
  console.log("Sending cold address AccountSet transaction...")
  const cst_result = await api.submitSignedReliable(cst_signed.tx_blob)
  if (cst_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${cst_signed.hash}`)
  } else {
    throw `Error sending transaction: ${cst_result}`
  }


  // Configure hot address settings --------------------------------------------

  const hot_settings_tx = {
    "TransactionType": "AccountSet",
    "Account": hot_wallet.address,
    "Domain": "6578616D706C652E636F6D", // "example.com"
    "SetFlag": 2 // enable Require Auth so we can't use trust lines that users
                 // make to the hot address, even by accident.
    //"Flags": (api.txFlags.AccountSet.DisallowXRP |
    //          api.txFlags.AccountSet.RequireDestTag)
  }

  const hst_prepared = await api.autofill(hot_settings_tx)
  const hst_signed = hot_wallet.sign(hst_prepared)
  console.log("Sending hot address AccountSet transaction...")
  const hst_result = await api.submitSignedReliable(hst_signed.tx_blob)
  if (hst_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${hst_signed.hash}`)
  } else {
    throw `Error sending transaction: ${hst_result.result.meta.TransactionResult}`
  }


  // Create trust line from hot to cold address --------------------------------
  const currency_code = "FOO"
  const trust_set_tx = {
    "TransactionType": "TrustSet",
    "Account": hot_wallet.address,
    "LimitAmount": {
      "currency": currency_code,
      "issuer": cold_wallet.address,
      "value": "10000000000" // Large limit, arbitrarily chosen
    }
  }

  const ts_prepared = await api.autofill(trust_set_tx)
  const ts_signed = hot_wallet.sign(ts_prepared)
  console.log("Creating trust line from hot address to issuer...")
  const ts_result = await api.submitSignedReliable(ts_signed.tx_blob)
  if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed.hash}`)
  } else {
    throw `Error sending transaction: ${ts_result.result.meta.TransactionResult}`
  }


  // Send token ----------------------------------------------------------------
  const issue_quantity = "3840"
  const send_token_tx = {
    "TransactionType": "Payment",
    "Account": cold_wallet.address,
    "Amount": {
      "currency": currency_code,
      "value": issue_quantity,
      "issuer": cold_wallet.address
    },
    "Destination": hot_wallet.address
  }

  const pay_prepared = await api.autofill(send_token_tx)
  const pay_signed = cold_wallet.sign(pay_prepared)
  console.log(`Sending ${issue_quantity} ${currency_code} to ${hot_wallet.address}...`)
  const pay_result = await api.submitSignedReliable(pay_signed.tx_blob)
  if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}`)
  } else {
    throw `Error sending transaction: ${pay_result.result.meta.TransactionResult}`
  }

  // Check balances ------------------------------------------------------------
  console.log("Getting hot address balances...")
  const hot_balances = await api.request({
    command: "account_lines",
    account: hot_wallet.address,
    ledger_index: "validated"
  })
  console.log(hot_balances.result)

  console.log("Getting cold address balances...")
  const cold_balances = await api.request({
    command: "gateway_balances",
    account: cold_wallet.address,
    ledger_index: "validated",
    hotwallet: [hot_wallet.address]
  })
  console.log(JSON.stringify(cold_balances.result, null, 2))

  api.disconnect()
} // End of main()

main()
