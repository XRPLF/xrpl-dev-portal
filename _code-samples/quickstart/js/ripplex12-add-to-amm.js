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
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const addXRP = standbyBalanceField.value
  const currency_code = standbyCurrencyField.value
  const addCurrency = standbyAmountField.value

  let ammdeposit = null

  if (addXRP && addCurrency) {
    
    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: "XRP"
      },
      "Asset2": {
        currency: currency_code,
        issuer: operational_wallet.address
      },
      "Account": standby_wallet.address,
      "Amount": xrpl.xrpToDrops(addXRP),
      "Amount2": {
        currency: currency_code,
        issuer: operational_wallet.address,
        value: addCurrency
      },
      "Flags": 0x00100000
    }

  } else if ( addXRP ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: "XRP"
      },
      "Asset2": {
        currency: currency_code,
        issuer: operational_wallet.address
      },
      "Account": standby_wallet.address,
      "Amount": xrpl.xrpToDrops(addXRP),
      "Flags": 0x00080000
    }

  } else if ( addCurrency ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: "XRP"
      },
      "Asset2": {
        currency: currency_code,
        issuer: operational_wallet.address
      },
      "Account": standby_wallet.address,
      "Amount": {
        currency: currency_code,
        issuer: operational_wallet.address,
        value: addCurrency
      },
      "Flags": 0x00080000
    }

  } else {

    results += `\n\nNo assets selected to add ...`
    standbyResultField.value = results
    standbyResultField.scrollTop = standbyResultField.scrollHeight

  }
 
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
  } else {
    results += `\n\nError sending transaction: ${lp_deposit}`
  }

  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight

  // Update LP token balance.

  standbyWalletBalances = (await client.getBalances(standby_wallet.address))

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

  const amm_info_result = await client.request(amm_info_request)

  // Get the AMM account address that issues LP tokens to depositors
  ammAccount = amm_info_result.result.amm.account

  const lpCurrency = standbyWalletBalances.find(item => item.issuer === ammAccount);

  const lpValue = lpCurrency ? lpCurrency.value : 'Currency not found';
  standbyLPField.value = lpValue

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
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const currency_code = standbyCurrencyField.value
  const voteFee = standbyFeeField.value

  const ammvote = {
    "TransactionType": "AMMVote",
    "Asset": {
      "currency": "XRP"
    },
    "Asset2": {
      "currency": currency_code,
      "issuer": operational_wallet.address
    },
    "Account": standby_wallet.address,
    "TradingFee": Number(voteFee)
  }
  
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
  } else {
    results += `\n\nError sending transaction: ${response_vote}`
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
          
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const currency_code = standbyCurrencyField.value

  const LPTokens = standbyLPField.value
  
  const amm_info = (await client.request({
    "command": "amm_info", 
    "asset": {
      "currency": "XRP"
    },
    "asset2": {
      "currency": currency_code,
      "issuer": operational_wallet.address
    }
  }))
  
  const my_share = LPTokens / amm_info.result.amm.lp_token.value
  
  const my_asset1 = (amm_info.result.amm.amount * my_share) / 1000000
  const my_asset2 = amm_info.result.amm.amount2.value * my_share
  
  results += `\n\nMy ${LPTokens} LP tokens are worth:\n
    XRP: ${my_asset1}
    ${amm_info.result.amm.amount2.currency}: ${my_asset2}`

  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight  

  client.disconnect()

}

// Withdraw by redeeming LP tokens.
async function redeemLP() {

  let net = getNet()

  const client = new xrpl.Client(net)
  results = `\n\nConnecting to ${getNet()} ...`
  standbyResultField.value = results

  await client.connect()
  results += '\n\nConnected.'
  standbyResultField.value = results
          
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const currency_code = standbyCurrencyField.value
  const LPTokens = standbyLPField.value

  // Get LP token info.
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

  const amm_info_result = await client.request(amm_info_request)
  const ammIssuer = amm_info_result.result.amm.lp_token.issuer
  const ammCurrency = amm_info_result.result.amm.lp_token.currency

  const ammwithdraw = {
    "TransactionType": "AMMWithdraw",
    "Asset": {
      "currency": "XRP"
    },
    "Asset2": {
      "currency": currency_code,
      "issuer": operational_wallet.address
    },
    "Account": standby_wallet.address,
    "LPTokenIn": {
      currency: ammCurrency,
      issuer: ammIssuer,
      value: LPTokens
    },
    "Flags": 0x00010000
  }
  
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
    results += `\n\nTransaction succeeded. Updating balances ...`
  } else {
    results += `\n\nError sending transaction: ${response_withdraw}`
  }

  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight

  // Update standby wallet XRP, token, and LP balances.
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  walletBalances = (await client.getBalances(standby_wallet.address))

  const currencyAmount = walletBalances.find(item => item.currency === currency_code);

  const currencyValue = currencyAmount ? currencyAmount.value : 'Currency not found';
  standbyAmountField.value = currencyValue

  ammAccount = amm_info_result.result.amm.account

  const lpCurrency = walletBalances.find(item => item.issuer === ammAccount);

  const lpValue = lpCurrency ? lpCurrency.value : 'Currency not found';
  standbyLPField.value = lpValue

  client.disconnect()

}