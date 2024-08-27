// Create AMM function

async function createAMM() {

  let net = getNet()

  const client = new xrpl.Client(net)
  results = `\n\nConnecting to ${getNet()} ...`
  standbyResultField.value = results

  await client.connect()
  results += '\n\nConnected.'
  standbyResultField.value = results
          
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const xrp_value = standbyBalanceField.value
  const currency_code = standbyCurrencyField.value
  const currency_value = standbyAmountField.value
  
  results += '\n\nCreating AMM ...'
  standbyResultField.value = results
  
  // AMMCreate requires burning one owner reserve. We can look up that amount
  // (in drops) on the current network using server_state:
  const ss = await client.request({"command": "server_state"})
  const amm_fee_drops = ss.result.state.validated_ledger.reserve_inc.toString()
  
  const ammcreate_result = await client.submitAndWait({
    "TransactionType": "AMMCreate",
    "Account": standby_wallet.address,
    "Amount": {
      "currency": currency_code,
      "issuer": operational_wallet.address,
      "value": currency_value
    },
    "Amount2": JSON.stringify(xrp_value * 1000000), // convert XRP to drops
    "TradingFee": 500, // 500 = 0.5%
    "Fee": amm_fee_drops,
  }, {autofill: true, wallet: standby_wallet, fail_hard: true}) // Use fail_hard so you don't waste the tx cost if you mess up

  checkAMM()
      
  client.disconnect()
  
}

// Check AMM function

async function checkAMM() {

  let net = getNet()

  const client = new xrpl.Client(net)
  results = `\n\nConnecting to ${getNet()} ...`
  standbyResultField.value = results

  await client.connect()
  results += '\n\nConnected.'
  standbyResultField.value = results
  
  // Gets the issuer and currency code
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const currency_code = standbyCurrencyField.value
  
  results += '\n\nChecking AMM ...'
  standbyResultField.value = results

  // Get AMM info transaction
  const amm_info_request = {
    "command": "amm_info",
    "asset": {
      "currency": "XRP"
    },
    "asset2": {
      "currency": currency_code,
      "issuer": operational_wallet.address
    },
    "ledger_index": "validated"
  }
  try {
    const amm_info_result = await client.request(amm_info_request)
    results += `\n\nAMM Info:\n${JSON.stringify(amm_info_result.result.amm, null, 2)}`
  } catch(err) {
    if (err.data.error === 'actNotFound') {
      results += `\n\nNo AMM exists for the pair ${currency_code} / XRP.`
    } else {
      results += `\n\n${err}`
    }
  }
  
  standbyResultField.value = results
      
  client.disconnect()
  
}