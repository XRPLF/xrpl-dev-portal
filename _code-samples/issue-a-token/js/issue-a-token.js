// Stand-alone code sample for the "issue a token" tutorial:
// https://xrpl.org/issue-a-fungible-token.html

// Dependencies for Node.js.
// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}

// Connect ---------------------------------------------------------------------
async function main() {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  console.log("Connecting to Testnet...")
  await client.connect()

  // Get credentials from the Testnet Faucet -----------------------------------
  console.log("Requesting addresses from the Testnet faucet...")
  const hot_wallet = (await client.fundWallet()).wallet
  const cold_wallet = (await client.fundWallet()).wallet
  const customer_one_wallet = (await client.fundWallet()).wallet
  const customer_two_wallet = (await client.fundWallet()).wallet
  console.log(`Got hot address ${hot_wallet.address} and cold address ${cold_wallet.address}.`)
  console.log(`Got customer_one address ${hot_wallet.address} and customer_two address ${cold_wallet.address}.`)


  // Configure issuer (cold address) settings ----------------------------------
  const cold_settings_tx = {
    "TransactionType": "AccountSet",
    "Account": cold_wallet.address,
    "TransferRate": 0,
    "TickSize": 5,
    "Domain": "6578616D706C652E636F6D", // "example.com"
    "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple,
    // Using tf flags, we can enable more flags in one transaction
    "Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP |
             xrpl.AccountSetTfFlags.tfRequireDestTag)
  }

  const cst_prepared = await client.autofill(cold_settings_tx)
  const cst_signed = cold_wallet.sign(cst_prepared)
  console.log("Sending cold address AccountSet transaction...")
  const cst_result = await client.submitAndWait(cst_signed.tx_blob)
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
    // enable Require Auth so we can't use trust lines that users
    // make to the hot address, even by accident:
    "SetFlag": xrpl.AccountSetAsfFlags.asfRequireAuth,
    "Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP |
              xrpl.AccountSetTfFlags.tfRequireDestTag)
  }

  const hst_prepared = await client.autofill(hot_settings_tx)
  const hst_signed = hot_wallet.sign(hst_prepared)
  console.log("Sending hot address AccountSet transaction...")
  const hst_result = await client.submitAndWait(hst_signed.tx_blob)
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

  const ts_prepared = await client.autofill(trust_set_tx)
  const ts_signed = hot_wallet.sign(ts_prepared)
  console.log("Creating trust line from hot address to issuer...")
  const ts_result = await client.submitAndWait(ts_signed.tx_blob)
  if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed.hash}`)
  } else {
    throw `Error sending transaction: ${ts_result.result.meta.TransactionResult}`
  }

    // Create trust line from customer_one to cold address --------------------------------
  const trust_set_tx2 = {
    "TransactionType": "TrustSet",
    "Account": customer_one_wallet.address,
    "LimitAmount": {
      "currency": currency_code,
      "issuer": cold_wallet.address,
      "value": "10000000000" // Large limit, arbitrarily chosen
    }
  }

  const ts_prepared2 = await client.autofill(trust_set_tx2)
  const ts_signed2 = customer_one_wallet.sign(ts_prepared2)
  console.log("Creating trust line from customer_one address to issuer...")
  const ts_result2 = await client.submitAndWait(ts_signed2.tx_blob)
  if (ts_result2.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed2.hash}`)
  } else {
    throw `Error sending transaction: ${ts_result2.result.meta.TransactionResult}`
  }


  const trust_set_tx3 = {
    "TransactionType": "TrustSet",
    "Account": customer_two_wallet.address,
    "LimitAmount": {
      "currency": currency_code,
      "issuer": cold_wallet.address,
      "value": "10000000000" // Large limit, arbitrarily chosen
    }
  }

  const ts_prepared3 = await client.autofill(trust_set_tx3)
  const ts_signed3 = customer_two_wallet.sign(ts_prepared3)
  console.log("Creating trust line from customer_two address to issuer...")
  const ts_result3 = await client.submitAndWait(ts_signed3.tx_blob)
  if (ts_result3.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed3.hash}`)
  } else {
    throw `Error sending transaction: ${ts_result3.result.meta.TransactionResult}`
  }




  // Send token ----------------------------------------------------------------
  let issue_quantity = "3800"

  const send_token_tx = {
    "TransactionType": "Payment",
    "Account": cold_wallet.address,
    "Amount": {
      "currency": currency_code,
      "value": issue_quantity,
      "issuer": cold_wallet.address
    },
    "Destination": hot_wallet.address,
    "DestinationTag": 1 // Needed since we enabled Require Destination Tags
                        // on the hot account earlier.
  }

  const pay_prepared = await client.autofill(send_token_tx)
  const pay_signed = cold_wallet.sign(pay_prepared)
  console.log(`Cold to hot - Sending ${issue_quantity} ${currency_code} to ${hot_wallet.address}...`)
  const pay_result = await client.submitAndWait(pay_signed.tx_blob)
  if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}`)
  } else {
    console.log(pay_result)
    throw `Error sending transaction: ${pay_result.result.meta.TransactionResult}`
  }


  issue_quantity = "100"
  const send_token_tx2 = {
    "TransactionType": "Payment",
    "Account": hot_wallet.address,
    "Amount": {
      "currency": currency_code,
      "value": issue_quantity,
      "issuer": cold_wallet.address
    },
    "Destination": customer_one_wallet.address,
    "DestinationTag": 1 // Needed since we enabled Require Destination Tags
                        // on the hot account earlier.
  }

  const pay_prepared2 = await client.autofill(send_token_tx2)
  const pay_signed2 = hot_wallet.sign(pay_prepared2)
  console.log(`Hot to customer_one - Sending ${issue_quantity} ${currency_code} to ${customer_one_wallet.address}...`)
  const pay_result2 = await client.submitAndWait(pay_signed2.tx_blob)
  if (pay_result2.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed2.hash}`)
  } else {
    console.log(pay_result2)
    throw `Error sending transaction: ${pay_result2.result.meta.TransactionResult}`
  }


  issue_quantity = "12"
  const send_token_tx3 = {
    "TransactionType": "Payment",
    "Account": customer_one_wallet.address,
    "Amount": {
      "currency": currency_code,
      "value": issue_quantity,
      "issuer": cold_wallet.address
    },
    "Destination": customer_two_wallet.address,
    "DestinationTag": 1 // Needed since we enabled Require Destination Tags
                        // on the hot account earlier.
  }

  const pay_prepared3 = await client.autofill(send_token_tx3)
  const pay_signed3 = customer_one_wallet.sign(pay_prepared3)
  console.log(`Customer_one to customer_two - Sending ${issue_quantity} ${currency_code} to ${customer_two_wallet.address}...`)
  const pay_result3 = await client.submitAndWait(pay_signed3.tx_blob)
  if (pay_result3.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed3.hash}`)
  } else {
    console.log(pay_result3)
    throw `Error sending transaction: ${pay_result3.result.meta.TransactionResult}`
  }


  // Check balances ------------------------------------------------------------
  console.log("Getting hot address balances...")
  const hot_balances = await client.request({
    command: "account_lines",
    account: hot_wallet.address,
    ledger_index: "validated"
  })
  console.log(hot_balances.result)

  console.log("Getting cold address balances...")
  const cold_balances = await client.request({
    command: "gateway_balances",
    account: cold_wallet.address,
    ledger_index: "validated",
    hotwallet: [hot_wallet.address]
  })
  console.log(JSON.stringify(cold_balances.result, null, 2))

  client.disconnect()
} // End of main()

main()
