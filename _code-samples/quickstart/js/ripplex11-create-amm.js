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

  const asset1_currency = asset1CurrencyField.value
  const asset1_issuer = asset1IssuerField.value
  const asset1_amount = asset1AmountField.value

  const asset2_currency = asset2CurrencyField.value
  const asset2_issuer = asset2IssuerField.value
  const asset2_amount = asset2AmountField.value

  let ammCreate = null
  
  results += '\n\nCreating AMM ...'
  standbyResultField.value = results
  
  // AMMCreate requires burning one owner reserve. We can look up that amount
  // (in drops) on the current network using server_state:
  const ss = await client.request({"command": "server_state"})
  const amm_fee_drops = ss.result.state.validated_ledger.reserve_inc.toString()

  if (asset1_currency == 'XRP') {

    ammCreate = {
      "TransactionType": "AMMCreate",
      "Account": standby_wallet.address,
      "Amount": JSON.stringify(asset1_amount * 1000000), // convert XRP to drops
      "Amount2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer,
        "value": asset2_amount
      },
      "TradingFee": 500, // 500 = 0.5%
      "Fee": amm_fee_drops
    }

  } else if (asset2_currency =='XRP') {

    ammCreate = {
      "TransactionType": "AMMCreate",
      "Account": standby_wallet.address,
      "Amount": {
        "currency": asset1_currency,
        "issuer": asset1_issuer,
        "value": asset1_amount
      },
      "Amount2": JSON.stringify(asset2_amount * 1000000), // convert XRP to drops
      "TradingFee": 500, // 500 = 0.5%
      "Fee": amm_fee_drops
    }

  } else {

    ammCreate = {
      "TransactionType": "AMMCreate",
      "Account": standby_wallet.address,
      "Amount": {
        "currency": asset1_currency,
        "issuer": asset1_issuer,
        "value": asset1_amount
      },
      "Amount2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer,
        "value": asset2_amount
      },
      "TradingFee": 500, // 500 = 0.5%
      "Fee": amm_fee_drops
    }
    
  }

  try {
 
    const prepared_create = await client.autofill(ammCreate)
    results += `\n\nPrepared transaction:\n${JSON.stringify(prepared_create, null, 2)}`
    standbyResultField.value = results
    standbyResultField.scrollTop = standbyResultField.scrollHeight  
  
    const signed_create = standby_wallet.sign(prepared_create)
    results += `\n\nSending AMMCreate transaction ...`
    standbyResultField.value = results
    standbyResultField.scrollTop = standbyResultField.scrollHeight
    
    const amm_create = await client.submitAndWait(signed_create.tx_blob)
    
    if (amm_create.result.meta.TransactionResult == "tesSUCCESS") {
      results += `\n\nTransaction succeeded.`
    } else {
      results += `\n\nError sending transaction: ${JSON.stringify(amm_create.result.meta.TransactionResult, null, 2)}`
    }
  
  } catch (error) {
    results += `\n\n${error.message}`
  }
  
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight

  checkAMM()
      
  client.disconnect()
  
}

// Check AMM function

async function checkAMM() {

  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  
  // Gets the issuer and currency code
  const asset1_currency = asset1CurrencyField.value
  const asset1_issuer = asset1IssuerField.value

  const asset2_currency = asset2CurrencyField.value
  const asset2_issuer = asset2IssuerField.value

  let amm_info_request = null

  // Get AMM info transaction

  if (asset1_currency == 'XRP') {

    amm_info_request = {
      "command": "amm_info",
      "asset": {
        "currency": "XRP"
      },
      "asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      },
      "ledger_index": "validated"
    }

  } else if (asset2_currency =='XRP') {

    amm_info_request = {
      "command": "amm_info",
      "asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "asset2": {
        "currency": "XRP"
      },
      "ledger_index": "validated"
    }

  } else {

    amm_info_request = {
      "command": "amm_info",
      "asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      },
      "ledger_index": "validated"
    }
    
  }

  try {
    const amm_info_result = await client.request(amm_info_request)
    ammInfo = `${JSON.stringify(amm_info_result.result.amm, null, 2)}`
  } catch(error) {
    ammInfo = `${error}`
  }
  
  ammInfoField.value = ammInfo
      
  client.disconnect()
  
}