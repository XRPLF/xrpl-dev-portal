// Stand-alone code sample for the "issue a token" tutorial:
// https://xrpl.org/issue-a-fungible-token.html

// Dependencies for Node.js.
// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
  // gotta use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
  var submit_and_verify = require('../../submit-and-verify/submit-and-verify2.js').submit_and_verify
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
  const hot_wallet = await api.generateFaucetWallet()
  const cold_wallet = await api.generateFaucetWallet()

  console.log("Waiting until we have a validated starting sequence number...")
  // If you go too soon, the funding transaction might slip back a ledger and
  // then your starting Sequence number will be off. This is mostly relevant
  // when you want to use a Testnet account right after getting a reply from
  // the faucet.
  while (true) {
    try {
      await api.request({
        command: "account_info",
        account: cold_wallet.classicAddress,
        ledger_index: "validated"
      })
      await api.request({
        command: "account_info",
        account: hot_wallet.classicAddress,
        ledger_index: "validated"
      })
      break
    } catch(e) {
      if (e.data.error != 'actNotFound') throw e
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  console.log(`Got hot address ${hot_wallet.classicAddress} and cold address ${cold_wallet.classicAddress}.`)

  // Configure issuer (cold address) settings ----------------------------------
  const cold_settings_tx = {
    "TransactionType": "AccountSet",
    "Account": cold_wallet.classicAddress,
    "TransferRate": 0,
    "TickSize": 5,
    "Domain": "6578616D706C652E636F6D", // "example.com"
    "SetFlag": 8 // enable Default Ripple
    //"Flags": (api.txFlags.AccountSet.DisallowXRP |
    //          api.txFlags.AccountSet.RequireDestTag)
    // TODO: update to txFlags' new location?
  }

  const cst_prepared = await api.autofill(cold_settings_tx)
  const cst_signed = cold_wallet.signTransaction(cst_prepared)
  // submit_and_verify helper function from:
  // https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/submit-and-verify/
  console.log("Sending cold address AccountSet transaction...")
  const cst_result = await submit_and_verify(api, cst_signed)
  if (cst_result == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${xrpl.computeSignedTransactionHash(cst_signed)}`)
  } else {
    throw `Error sending transaction: ${cst_result}`
  }


  // Configure hot address settings --------------------------------------------

  const hot_settings_tx = {
    "TransactionType": "AccountSet",
    "Account": hot_wallet.classicAddress,
    "Domain": "6578616D706C652E636F6D", // "example.com"
    "SetFlag": 2 // enable Require Auth so we can't use trust lines that users
                 // make to the hot address, even by accident.
    //"Flags": (api.txFlags.AccountSet.DisallowXRP |
    //          api.txFlags.AccountSet.RequireDestTag)
  }

  const hst_prepared = await api.autofill(hot_settings_tx)
  const hst_signed = hot_wallet.signTransaction(hst_prepared)
  console.log("Sending hot address AccountSet transaction...")
  const hst_result = await submit_and_verify(api, hst_signed)
  if (hst_result == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${xrpl.computeSignedTransactionHash(hst_signed)}`)
  } else {
    throw `Error sending transaction: ${hst_result}`
  }


  // Create trust line from hot to cold address --------------------------------
  const currency_code = "FOO"
  const trust_set_tx = {
    "TransactionType": "TrustSet",
    "Account": hot_wallet.classicAddress,
    "LimitAmount": {
      "currency": currency_code,
      "issuer": cold_wallet.classicAddress,
      "value": "10000000000" // Large limit, arbitrarily chosen
    }
  }

  const ts_prepared = await api.autofill(trust_set_tx)
  const ts_signed = hot_wallet.signTransaction(ts_prepared)
  console.log("Creating trust line from hot address to issuer...")
  const ts_result = await submit_and_verify(api, ts_signed)
  if (ts_result == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${xrpl.computeSignedTransactionHash(ts_signed)}`)
  } else {
    throw `Error sending transaction: ${ts_result}`
  }


  // Send token ----------------------------------------------------------------
  const issue_quantity = "3840"
  const send_token_tx = {
    "TransactionType": "Payment",
    "Account": cold_wallet.classicAddress,
    "Amount": {
      "currency": currency_code,
      "value": issue_quantity,
      "issuer": cold_wallet.classicAddress
    },
    "Destination": hot_wallet.classicAddress
  }

  const pay_prepared = await api.autofill(send_token_tx)
  const pay_signed = cold_wallet.signTransaction(pay_prepared)
  // submit_and_verify helper from _code-samples/submit-and-verify
  console.log(`Sending ${issue_quantity} ${currency_code} to ${hot_wallet.classicAddress}...`)
  const pay_result = await submit_and_verify(api, pay_signed)
  if (pay_result == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${xrpl.computeSignedTransactionHash(pay_signed)}`)
  } else {
    throw `Error sending transaction: ${pay_result}`
  }

  // Check balances ------------------------------------------------------------
  console.log("Getting hot address balances...")
  const hot_balances = await api.request({
    command: "account_lines",
    account: hot_wallet.classicAddress,
    ledger_index: "validated"
  })
  console.log(hot_balances.result)

  console.log("Getting cold address balances...")
  const cold_balances = await api.request({
    command: "gateway_balances",
    account: cold_wallet.classicAddress,
    ledger_index: "validated",
    hotwallet: [hot_wallet.classicAddress]
  })
  console.log(JSON.stringify(cold_balances.result, null, 2))

  api.disconnect()
} // End of main()

main()
