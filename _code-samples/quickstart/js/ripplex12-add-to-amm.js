// Deposit assets to existing AMM.

async function addAssets() {

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

  // Check for all combinations of asset deposits.
  let ammdeposit = null

  if (asset1_currency == "XRP" && asset2_currency && asset1_amount && asset2_amount ) {
    
    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: "XRP"
      },
      "Asset2": {
        currency: asset2_currency,
        issuer: asset2_issuer
      },
      "Account": standby_wallet.address,
      "Amount": xrpl.xrpToDrops(asset1_amount),
      "Amount2": {
        currency: asset2_currency,
        issuer: asset2_issuer,
        value: asset2_amount
      },
      "Flags": 0x00100000
    }

  } else if ( asset1_currency && asset2_currency == "XRP" && asset1_amount && asset2_amount ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: asset1_currency,
        issuer: asset1_issuer
      },
      "Asset2": {
        currency: "XRP"
      },
      "Account": standby_wallet.address,
      "Amount": {
        currency: asset1_currency,
        issuer: asset1_issuer,
        value: asset1_amount
      },
      "Amount2": xrpl.xrpToDrops(asset2_amount),
      "Flags": 0x00100000
    }

  } else if ( asset1_currency && asset2_currency && asset1_amount && asset2_amount ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: asset1_currency,
        issuer: asset1_issuer
      },
      "Asset2": {
        currency: asset2_currency,
        issuer: asset2_issuer
      },
      "Account": standby_wallet.address,
      "Amount": {
        currency: asset1_currency,
        issuer: asset1_issuer,
        value: asset1_amount
      },
      "Amount2": {
        currency: asset2_currency,
        issuer: asset2_issuer,
        value: asset2_amount
      },
      "Flags": 0x00100000
    }

  } else if ( asset1_currency == "XRP" && asset2_currency && asset1_amount ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: "XRP"
      },
      "Asset2": {
        currency: asset2_currency,
        issuer: asset2_issuer
      },
      "Account": standby_wallet.address,
      "Amount": xrpl.xrpToDrops(asset1_amount),
      "Flags": 0x00080000
    }

  } else if ( asset1_currency && asset2_currency == "XRP" && asset1_amount ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: asset1_currency,
        issuer: asset1_issuer
      },
      "Asset2": {
        currency: "XRP"
      },
      "Account": standby_wallet.address,
      "Amount": {
        currency: asset1_currency,
        issuer: asset1_issuer,
        value: asset1_amount
      },
      "Flags": 0x00080000
    }

  } else if ( asset1_currency == "XRP" && asset2_currency && asset2_amount ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: "XRP"
      },
      "Asset2": {
        currency: asset2_currency,
        issuer: asset2_issuer
      },
      "Account": standby_wallet.address,
      "Amount": {
        currency: asset2_currency,
        issuer: asset2_issuer,
        value: asset2_amount
      },
      "Flags": 0x00080000
    }

  } else if ( asset1_currency && asset2_currency && asset1_amount ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: asset1_currency,
        issuer: asset1_issuer
      },
      "Asset2": {
        currency: asset2_currency,
        issuer: asset2_issuer
      },
      "Account": standby_wallet.address,
      "Amount": {
        currency: asset1_currency,
        issuer: asset1_issuer,
        value: asset1_amount
      },
      "Flags": 0x00080000
    }

  } else if ( asset1_currency && asset2_currency && asset2_amount ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: asset1_currency,
        issuer: asset1_issuer
      },
      "Asset2": {
        currency: asset2_currency,
        issuer: asset2_issuer
      },
      "Account": standby_wallet.address,
      "Amount": {
        currency: asset2_currency,
        issuer: asset2_issuer,
        value: asset2_amount
      },
      "Flags": 0x00080000
    }

  } else {

    results += `\n\nNo assets selected to add ...`
    standbyResultField.value = results
    standbyResultField.scrollTop = standbyResultField.scrollHeight
    return

  }

  try {
 
  const prepared_deposit = await client.autofill(ammdeposit)
  results += `\n\nPrepared transaction:\n${JSON.stringify(prepared_deposit, null, 2)}`
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight  

  const signed_deposit = standby_wallet.sign(prepared_deposit)
  results += `\n\nSending AMMDeposit transaction ...`
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight
  
  const lp_deposit = await client.submitAndWait(signed_deposit.tx_blob)
  
  if (lp_deposit.result.meta.TransactionResult == "tesSUCCESS") {
    results += `\n\nTransaction succeeded.`
    checkAMM()
  } else {
    results += `\n\nError sending transaction: ${JSON.stringify(lp_deposit.result.meta.TransactionResult, null, 2)}`
  }

  } catch (error) {
    results += `\n\n${error.message}`
  }

  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight

  client.disconnect()

}

// Vote on AMM trading fees
async function voteFees() {

  let net = getNet()

  const client = new xrpl.Client(net)
  results = `\n\nConnecting to ${getNet()} ...`
  standbyResultField.value = results

  await client.connect()
  results += '\n\nConnected.'
  standbyResultField.value = results
          
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const voteFee = standbyFeeField.value

  const asset1_currency = asset1CurrencyField.value
  const asset1_issuer = asset1IssuerField.value

  const asset2_currency = asset2CurrencyField.value
  const asset2_issuer = asset2IssuerField.value

  let ammvote = null

  if ( asset1_currency == "XRP" ) {

    ammvote = {
      "TransactionType": "AMMVote",
      "Asset": {
        "currency": "XRP"
      },
      "Asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      },
      "Account": standby_wallet.address,
      "TradingFee": Number(voteFee)
    }

  } else if ( asset2_currency == "XRP" ) {

    ammvote = {
      "TransactionType": "AMMVote",
      "Asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "Asset2": {
        "currency": "XRP"
      },
      "Account": standby_wallet.address,
      "TradingFee": Number(voteFee)
    }
  } else {

    ammvote = {
      "TransactionType": "AMMVote",
      "Asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "Asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      },
      "Account": standby_wallet.address,
      "TradingFee": Number(voteFee)
    }

  }

  try {
  
  const prepared_vote = await client.autofill(ammvote)
  results += `\n\nPrepared transaction:\n${JSON.stringify(prepared_vote, null, 2)}`
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight

  const signed_vote = standby_wallet.sign(prepared_vote)
  results += `\n\nSending AMMVote transaction ...`
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight  

  const response_vote = await client.submitAndWait(signed_vote.tx_blob)
  if (response_vote.result.meta.TransactionResult == "tesSUCCESS") {
    results += `\n\nTransaction succeeded.`
    checkAMM()
  } else {
    results += `\n\nError sending transaction: ${JSON.stringify(response_vote.result.meta.TransactionResult, null, 2)}`
  }

} catch (error) {
  results += `\n\n${error.message}`
}

  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight  

  client.disconnect()

}

// Calculate the value of your LP tokens.
async function calculateLP() {

  let net = getNet()

  const client = new xrpl.Client(net)
  results = `\n\nConnecting to ${getNet()} ...`
  standbyResultField.value = results

  await client.connect()
  results += '\n\nConnected.'
  standbyResultField.value = results

  const standby_wallet = standbyAccountField.value

  const asset1_currency = asset1CurrencyField.value
  const asset1_issuer = asset1IssuerField.value

  const asset2_currency = asset2CurrencyField.value
  const asset2_issuer = asset2IssuerField.value

  let amm_info = null

  if ( asset1_currency == "XRP" ) {
  
    amm_info = {
      "command": "amm_info", 
      "asset": {
        "currency": "XRP"
      },
      "asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      }
    }
  
  } else if ( asset2_currency == "XRP" ) {

    amm_info = {
      "command": "amm_info", 
      "asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "asset2": {
        "currency": "XRP"
      }
    }

  } else {

    amm_info = {
      "command": "amm_info", 
      "asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      }
    }

  }

  try {
  
  // Get LP token balance.
  standbyWalletBalances = await client.getBalances(standby_wallet)

  const amm_info_result = await client.request(amm_info)

  // Get the AMM account address that issues LP tokens to depositors
  ammAccount = amm_info_result.result.amm.account

  const lpCurrency = standbyWalletBalances.find(item => item.issuer === ammAccount);

  const lpBalance = lpCurrency ? lpCurrency.value : 'Currency not found';

  const my_share = lpBalance / amm_info_result.result.amm.lp_token.value
  
  let my_asset1 = null
  let my_asset2 = null

  if ( amm_info_result.result.amm.amount.value && amm_info_result.result.amm.amount2.value ) {

    my_asset1 = amm_info_result.result.amm.amount.value * my_share
    my_asset2 = amm_info_result.result.amm.amount2.value * my_share

    results += `\n\nI have a total of ${lpBalance} LP tokens that are worth:\n
    ${amm_info_result.result.amm.amount.currency}: ${my_asset1}
    ${amm_info_result.result.amm.amount2.currency}: ${my_asset2}`

  } else if ( amm_info_result.result.amm.amount.value == undefined ) {

    my_asset1 = (amm_info_result.result.amm.amount * my_share) / 1000000
    my_asset2 = amm_info_result.result.amm.amount2.value * my_share

    results += `\n\nI have a total of ${lpBalance} LP tokens that are worth:\n
    XRP: ${my_asset1}
    ${amm_info_result.result.amm.amount2.currency}: ${my_asset2}`

  } else {

    my_asset1 = amm_info_result.result.amm.amount.value * my_share
    my_asset2 = (amm_info_result.result.amm.amount2 * my_share) / 1000000

    results += `\n\nI have a total of ${lpBalance} LP tokens that are worth:\n
    ${amm_info_result.result.amm.amount.currency}: ${my_asset1}
    XRP: ${my_asset2}`

  }

  } catch (error) {
    results += `\n\n${error.message}`
  }

  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight

  client.disconnect()

}

// Redeem LP tokens.
async function redeemLP() {

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

  const asset2_currency = asset2CurrencyField.value
  const asset2_issuer = asset2IssuerField.value

  // Structure "amm_info" command based on asset combo.
  let amm_info = null

  if ( asset1_currency == "XRP" ) {
  
    amm_info = {
      "command": "amm_info", 
      "asset": {
        "currency": "XRP"
      },
      "asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      }
    }
  
  } else if ( asset2_currency == "XRP" ) {

    amm_info = {
      "command": "amm_info", 
      "asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "asset2": {
        "currency": "XRP"
      }
    }

  } else {

    amm_info = {
      "command": "amm_info", 
      "asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      }
    }

  }

  // Get LP token info.

  let ammIssuer = null
  let ammCurrency = null
  const LPTokens = standbyLPField.value

  try {
  const amm_info_result = await client.request(amm_info)
  ammIssuer = amm_info_result.result.amm.lp_token.issuer
  ammCurrency = amm_info_result.result.amm.lp_token.currency
  } catch (error) {
    results += `\n\n${error.message}`
    standbyResultField.value = results
    standbyResultField.scrollTop = standbyResultField.scrollHeight
    return
  }

  // Structure ammwithdraw transaction based on asset combo.
  let ammwithdraw = null

  if ( asset1_currency == "XRP" ) {

    ammwithdraw = {
      "TransactionType": "AMMWithdraw",
      "Asset": {
        "currency": "XRP"
      },
      "Asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      },
      "Account": standby_wallet.address,
      "LPTokenIn": {
        currency: ammCurrency,
        issuer: ammIssuer,
        value: LPTokens
      },
      "Flags": 0x00010000
    }

  } else if ( asset2_currency == "XRP" ) {

    ammwithdraw = {
      "TransactionType": "AMMWithdraw",
      "Asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "Asset2": {
        "currency": "XRP"
      },
      "Account": standby_wallet.address,
      "LPTokenIn": {
        currency: ammCurrency,
        issuer: ammIssuer,
        value: LPTokens
      },
      "Flags": 0x00010000
    }

  } else {

    ammwithdraw = {
      "TransactionType": "AMMWithdraw",
      "Asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "Asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      },
      "Account": standby_wallet.address,
      "LPTokenIn": {
        currency: ammCurrency,
        issuer: ammIssuer,
        value: LPTokens
      },
      "Flags": 0x00010000
    }

  }
  
  try {

  const prepared_withdraw = await client.autofill(ammwithdraw)
  results += `\n\nPrepared transaction:\n${JSON.stringify(prepared_withdraw, null, 2)}`
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight    

  const signed_withdraw = standby_wallet.sign(prepared_withdraw)
  results += `\n\nSending AMMWithdraw transaction ...`
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight

  const response_withdraw = await client.submitAndWait(signed_withdraw.tx_blob)
  
  if (response_withdraw.result.meta.TransactionResult == "tesSUCCESS") {
    results += `\n\nTransaction succeeded.`
    checkAMM()
    getBalances()
  } else {
    results += `\n\nError sending transaction: ${JSON.stringify(response_withdraw.result.meta.TransactionResult, null, 2)}`
  }

  } catch (error) {
    results += `\n\n${error.message}`
  }

  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight

  client.disconnect()

}