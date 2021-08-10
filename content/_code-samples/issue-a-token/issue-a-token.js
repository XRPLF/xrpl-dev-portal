// Connect ---------------------------------------------------------------------
// ripple = require('ripple-lib') // For Node.js. In browsers, use <script>.
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
console.log("Connecting to Testnet...")
api.connect()
api.on('connected', async () => {

  // Get credentials from the Testnet Faucet -----------------------------------
  // This doesn't technically need to happen after you call api.connect() but
  // it's convenient to do here.
  async function get_faucet_address() {
    const faucet_url = "https://faucet.altnet.rippletest.net/accounts"
    const faucet_options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: '{}'
    }
    const response = await fetch(faucet_url, faucet_options)
    if (!response.ok) {
      throw `Faucet returned an error: ${data.error}`
    }
    const data = await response.json()
    return data
  }

  console.log("Requesting addresses from the Testnet faucet...")
  const hot_data = await get_faucet_address()
  const hot_address = hot_data.account.address
  const hot_secret = hot_data.account.secret

  const cold_data = await get_faucet_address()
  const cold_address = cold_data.account.address
  const cold_secret = cold_data.account.secret

  console.log("Waiting until we have a validated starting sequence number...")
  // If you go too soon, the funding transaction might slip back a ledger and
  // then your starting Sequence number will be off. This is mostly relevant
  // when you want to use a Testnet account right after getting a reply from
  // the faucet.
  while (true) {
    try {
      await api.request("account_info", {account: cold_address, ledger_index: "validated"})
      await api.request("account_info", {account: hot_address, ledger_index: "validated"})
      break
    } catch(e) {
      if (e.data.error != 'actNotFound') throw e
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  console.log(`Got hot address ${hot_address} and cold address ${cold_address}.`)

  // Configure issuer (cold address) settings ----------------------------------
  const cold_settings_tx = {
    "TransactionType": "AccountSet",
    "Account": cold_address,
    "TransferRate": 0,
    "TickSize": 5,
    "SetFlag": 8 // enable Default Ripple
    //"Flags": (api.txFlags.AccountSet.DisallowXRP |
    //          api.txFlags.AccountSet.RequireDestTag)
  }

  const cst_prepared = await api.prepareTransaction(cold_settings_tx, {maxLedgerVersionOffset: 10})
  const cst_signed = api.sign(cst_prepared.txJSON, cold_secret)
  // submit_and_verify helper function from:
  // https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/submit-and-verify/
  console.log("Sending cold address AccountSet transaction...")
  const cst_result = await submit_and_verify(api, cst_signed.signedTransaction)
  if (cst_result == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${cst_signed.id}`)
  } else {
    throw `Error sending transaction: ${cst_result}`
  }


  // Configure hot address settings --------------------------------------------

  const hot_settings_tx = {
    "TransactionType": "AccountSet",
    "Account": hot_address,
    "SetFlag": 2 // enable Require Auth so we can't use trust lines that users
                 // make to the hot address, even by accident.
    //"Flags": (api.txFlags.AccountSet.DisallowXRP |
    //          api.txFlags.AccountSet.RequireDestTag)
  }

  const hst_prepared = await api.prepareTransaction(hot_settings_tx, {maxLedgerVersionOffset: 10})
  const hst_signed = api.sign(hst_prepared.txJSON, hot_secret)
  console.log("Sending hot address AccountSet transaction...")
  const hst_result = await submit_and_verify(api, hst_signed.signedTransaction)
  if (hst_result == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${hst_signed.id}`)
  } else {
    throw `Error sending transaction: ${hst_result}`
  }


  // Create trust line from hot to cold address --------------------------------
  const currency_code = "FOO"
  const trust_set_tx = {
    "TransactionType": "TrustSet",
    "Account": hot_address,
    "LimitAmount": {
      "currency": currency_code,
      "issuer": cold_address,
      "value": "10000000000" // Large limit, arbitrarily chosen
    }
  }

  const ts_prepared = await api.prepareTransaction(trust_set_tx, {maxLedgerVersionOffset: 10})
  const ts_signed = api.sign(ts_prepared.txJSON, hot_secret)
  console.log("Creating trust line from hot address to issuer...")
  const ts_result = await submit_and_verify(api, ts_signed.signedTransaction)
  if (ts_result == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed.id}`)
  } else {
    throw `Error sending transaction: ${ts_result}`
  }


  // Send token ----------------------------------------------------------------
  const issue_quantity = "3840"
  const send_token_tx = {
    "TransactionType": "Payment",
    "Account": cold_address,
    "Amount": {
      "currency": currency_code,
      "value": issue_quantity,
      "issuer": cold_address
    },
    "Destination": hot_address
  }

  const payment_prepared = await api.prepareTransaction(send_token_tx, {maxLedgerVersionOffset: 10})
  const payment_signed = api.sign(payment_prepared.txJSON, cold_secret)
  // submit_and_verify helper from _code-samples/submit-and-verify
  console.log(`Sending ${issue_quantity} ${currency_code} to ${hot_address}...`)
  const payment_result = await submit_and_verify(api, payment_signed.signedTransaction)
  if (payment_result == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${payment_signed.id}`)
  } else {
    throw `Error sending transaction: ${payment_result}`
  }

  // Check balances ------------------------------------------------------------
  console.log("Getting hot address balances...")
  const hot_balances = await api.request("account_lines", {account: hot_address, ledger_index: "validated"})
  console.log(hot_balances)

  console.log("Getting cold address balances...")
  const cold_balances = await api.request("gateway_balances", {
    account: cold_address,
    ledger_index: "validated",
    hotwallet: [hot_address]
  })
  console.log(cold_balances)

}) // End of api.on.('connected')
