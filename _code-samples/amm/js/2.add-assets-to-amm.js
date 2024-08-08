// Define client, network, and explorer.

const WS_URL = 'wss://s.devnet.rippletest.net:51233'
const EXPLORER = 'https://devnet.xrpl.org'
const client = new xrpl.Client(WS_URL);
let wallet = null
let issuer = null
let wallet2 = null

// Connect to devnet.

async function getAccount() {
  
  results = 'Connecting to Devnet ...'
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight

  await client.connect()

  results += '\n\nConnected, funding wallet.'
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight

// Fund a new devnet wallet
  wallet = (await client.fundWallet()).wallet
        
  results += '\n\nPopulated wallet info.'
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight
      
// Get wallet info.
  accountField.value = wallet.address
  seedField.value = wallet.seed
  balanceField.value = (await client.getXrpBalance(wallet.address))

  client.disconnect()

}

// Issue FOO tokens to Devnet wallet.

async function issueFOO() {

// Create a new issuer on Devnet

  results += '\n\nIssuing FOO tokens ...'
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight
  
  await client.connect()
  
  issuer = (await client.fundWallet()).wallet
  
  results += `\n\nCreated issuer account: ${issuer.address}`
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight

  // Enable issuer DefaultRipple
  const issuer_setup_result = await client.submitAndWait({
      "TransactionType": "AccountSet",
      "Account": issuer.address,
      "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple
  }, {autofill: true, wallet: issuer} )    
  
    results += `\n\nIssuer DefaultRipple enabled: ${EXPLORER}/transactions/${issuer_setup_result.result.hash}`
    resultField.value = results
    resultField.scrollTop = resultField.scrollHeight
    
  // Create trust line from wallet to issuer
  const trust_result = await client.submitAndWait({
      "TransactionType": "TrustSet",
      "Account": wallet.address,
      "LimitAmount": {
        "currency": "FOO",
        "issuer": issuer.address,
        "value": "10000000000" // Large limit, arbitrarily chosen
      }
    }, {autofill: true, wallet: wallet})
      results += `\n\nTrust line created: ${EXPLORER}/transactions/${trust_result.result.hash}`
      resultField.value = results
      resultField.scrollTop = resultField.scrollHeight
    
  // Issue tokens
  
  results += '\n\nSending 1000 FOO tokens ...'
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight

  const issue_result = await client.submitAndWait({
      "TransactionType": "Payment",
      "Account": issuer.address,
      "Amount": {
        "currency": "FOO",
        "value": "1000",
        "issuer": issuer.address
      },
      "Destination": wallet.address
    }, {autofill: true, wallet: issuer})
      results += `\n\nTokens issued: ${EXPLORER}/transactions/${issue_result.result.hash}`
      resultField.value = results
      resultField.scrollTop = resultField.scrollHeight
    
  walletBalances = (await client.getBalances(wallet.address))

  const fooCurrency = walletBalances.find(item => item.currency === 'FOO');

  const fooValue = fooCurrency ? fooCurrency.value : 'Currency not found';
  fooField.value = fooValue

  client.disconnect()

}

// Check if AMM exists.

async function checkAMM() {

  await client.connect()

  results += '\n\nUpdating AMM Info ...'
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight

  const amm_info_request = {
    "command": "amm_info",
    "asset": {
      "currency": "XRP"
    },
    "asset2": {
      "currency": "FOO",
      "issuer": issuer.address
    },
    "ledger_index": "validated"
  }
  try {
    const amm_info_result = await client.request(amm_info_request)
    ammInfo = `${JSON.stringify(amm_info_result.result.amm, null, 2)}`
  } catch(err) {
    if (err.data.error === 'actNotFound') {
      ammInfo = (`No AMM exists for the pair FOO / XRP.`)
    } else {
      results += `\n\n${err}`
      resultField.value = results
      resultField.scrollTop = resultField.scrollHeight
    }
  }

  ammInfoField.value = ammInfo

  // Update AMM info box.

  

  client.disconnect()

}

// Create new AMM.

async function createAMM() {

// This example assumes that 10 XRP ≈ 100 FOO in value.

  await client.connect()

  results += '\n\nCreating AMM ...'
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight

  // AMMCreate requires burning one owner reserve. We can look up that amount
  // (in drops) on the current network using server_state:
  const ss = await client.request({"command": "server_state"})
  const amm_fee_drops = ss.result.state.validated_ledger.reserve_inc.toString()

  const ammcreate_result = await client.submitAndWait({
    "TransactionType": "AMMCreate",
    "Account": wallet.address,
    "Amount": {
      "currency": "FOO",
      "issuer": issuer.address,
      "value": "500"
    },
    "Amount2": "50000000", // 50 XRP in drops
    "TradingFee": 500, // 0.5%
    "Fee": amm_fee_drops,
  }, {autofill: true, wallet: wallet, fail_hard: true})
  // Use fail_hard so you don't waste the tx cost if you mess up
    results += `\n\nAMM created: ${EXPLORER}/transactions/${ammcreate_result.result.hash}`
    resultField.value = results
    resultField.scrollTop = resultField.scrollHeight

  // Update balances
    balanceField.value = (await client.getXrpBalance(wallet.address))
    walletBalances = (await client.getBalances(wallet.address))

    const fooCurrency = walletBalances.find(item => item.currency === 'FOO');

    const fooValue = fooCurrency ? fooCurrency.value : 'Currency not found';
    fooField.value = fooValue

  await updateAMM()

  client.disconnect()

}

// Fund second wallet.

async function getAccount2() {
  
  await client.connect()

  results += '\n\nFunding second wallet ...'
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight

// Fund a new devnet wallet
  wallet2 = (await client.fundWallet()).wallet
        
  results += '\n\nPopulated second wallet info.'
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight
      
// Get second wallet info.
  accountField2.value = wallet2.address
  seedField2.value = wallet2.seed
  balanceField2.value = (await client.getXrpBalance(wallet2.address))

  client.disconnect()

}

// Helper function to update AMM Info when changes are made.

async function updateAMM() {

  const amm_info_request = {
    "command": "amm_info",
    "asset": {
      "currency": "XRP"
    },
    "asset2": {
      "currency": "FOO",
      "issuer": issuer.address
    },
    "ledger_index": "validated"
  }
  try {
    const amm_info_result = await client.request(amm_info_request)
    ammInfo = `${JSON.stringify(amm_info_result.result.amm, null, 2)}`
  } catch(err) {
    if (err.data.error === 'actNotFound') {
      ammInfo = (`No AMM exists for the pair FOO / XRP.`)
    } else {
      results += `\n\n${err}`
      resultField.value = results
      resultField.scrollTop = resultField.scrollHeight
    }
  }

  ammInfoField.value = ammInfo

}

// Buy FOO tokens from the XRP/FOO AMM.

async function buyFOO() {

  await client.connect()

  // Get trading fee of the AMM.
  const amm_info_request = {
    "command": "amm_info",
    "asset": {
      "currency": "XRP"
    },
    "asset2": {
      "currency": "FOO",
      "issuer": issuer.address
    },
    "ledger_index": "validated"
  }

  const amm_info_result = await client.request(amm_info_request)
  ammTradingFee = amm_info_result.result.amm.trading_fee

  // Create offer to buy FOO.

  const offer = {
    "TransactionType": "OfferCreate",
    "Account": wallet2.address,
    "TakerPays": {
      currency: "FOO",
      issuer: issuer.address,
      value: "250"
    },
    // Assuming FOO:XRP is 10:1 value, calculation is
    // (amount FOO to buy * price per token) + amm trading fees
    "TakerGets": xrpl.xrpToDrops(250/10)+ammTradingFee
  }
    
  const prepared_offer = await client.autofill(offer)
  results += `\n\nPrepared transaction:\n${JSON.stringify(prepared_offer, null, 2)}`
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight

  const signed_offer = wallet2.sign(prepared_offer)
  results += `\n\nSending OfferCreate transaction...`
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight

  const result_offer = await client.submitAndWait(signed_offer.tx_blob)

  if (result_offer.result.meta.TransactionResult == "tesSUCCESS") {
    results += `\n\nTransaction succeeded: ${EXPLORER}/transactions/${signed_offer.hash}`
  } else {
    results += `\n\nError sending transaction: ${result_offer}`
  }

  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight

  // Update second wallet balances.
  balanceField2.value = (await client.getXrpBalance(wallet2.address))
  walletBalances2 = (await client.getBalances(wallet2.address))

  const fooCurrency2 = walletBalances2.find(item => item.currency === 'FOO');

  const fooValue2 = fooCurrency2 ? fooCurrency2.value : 'Currency not found';
  fooField2.value = fooValue2

  await updateAMM()

  client.disconnect()

}

// Deposit assets to AMM.

async function addAssets() {

  await client.connect()

  const addXRP = addXRPField.value
  const addFOO = addFOOField.value
  let ammdeposit = null

  if (addXRP && addFOO) {
    
    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: "XRP"
      },
      "Asset2": {
        currency: "FOO",
        issuer: issuer.address
      },
      "Account": wallet2.address,
      "Amount": xrpl.xrpToDrops(addXRP),
      "Amount2": {
        currency: "FOO",
        issuer: issuer.address,
        value: addFOO
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
        currency: "FOO",
        issuer: issuer.address
      },
      "Account": wallet2.address,
      "Amount": xrpl.xrpToDrops(addXRP),
      "Flags": 0x00080000
    }

  } else if ( addFOO ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: "XRP"
      },
      "Asset2": {
        currency: "FOO",
        issuer: issuer.address
      },
      "Account": wallet2.address,
      "Amount": {
        currency: "FOO",
        issuer: issuer.address,
        value: addFOO
      },
      "Flags": 0x00080000
    }

  } else {

    results += `\n\nNo assets selected to add ...`
    resultField.value = results
    resultField.scrollTop = resultField.scrollHeight

  }
 
  const prepared_deposit = await client.autofill(ammdeposit)
  results += `\n\nPrepared transaction:\n${JSON.stringify(prepared_deposit, null, 2)}`
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight  

  const signed_deposit = wallet2.sign(prepared_deposit)
  results += `\n\nSending AMMDeposit transaction ...`
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight
  
  const lp_deposit = await client.submitAndWait(signed_deposit.tx_blob)
  
  if (lp_deposit.result.meta.TransactionResult == "tesSUCCESS") {
    results += `\n\nTransaction succeeded: ${EXPLORER}/transactions/${signed_deposit.hash}`
  } else {
    results += `\n\nError sending transaction: ${lp_deposit}`
  }

  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight

  // Update second wallet balances.
  balanceField2.value = (await client.getXrpBalance(wallet2.address))
  walletBalances2 = (await client.getBalances(wallet2.address))

  const fooCurrency2 = walletBalances2.find(item => item.currency === 'FOO');

  const fooValue2 = fooCurrency2 ? fooCurrency2.value : 'Currency not found';
  fooField2.value = fooValue2

  // Update LP token value.

  const amm_info_request = {
    "command": "amm_info",
    "asset": {
      "currency": "XRP"
    },
    "asset2": {
      "currency": "FOO",
      "issuer": issuer.address
    },
    "ledger_index": "validated"
  }

  const amm_info_result = await client.request(amm_info_request)
  ammAccount = amm_info_result.result.amm.account

  const lpCurrency2 = walletBalances2.find(item => item.issuer === ammAccount);

  const lpValue2 = lpCurrency2 ? lpCurrency2.value : 'Currency not found';
  lpField2.value = lpValue2


  await updateAMM()

  client.disconnect()

}

// Vote on fees.
async function voteFees() {

  await client.connect()

  const voteFee = voteFeeField.value

  const ammvote = {
    "TransactionType": "AMMVote",
    "Asset": {
      "currency": "XRP"
    },
    "Asset2": {
      "currency": "FOO",
      "issuer": issuer.address
    },
    "Account": wallet2.address,
    "TradingFee": Number(voteFee)
  }
  
  const prepared_vote = await client.autofill(ammvote)
  results += `\n\nPrepared transaction:\n${JSON.stringify(prepared_vote, null, 2)}`
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight

  const signed_vote = wallet2.sign(prepared_vote)
  results += `\n\nSending AMMVote transaction ...`
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight  

  const response_vote = await client.submitAndWait(signed_vote.tx_blob)
  if (response_vote.result.meta.TransactionResult == "tesSUCCESS") {
    results += `\n\nTransaction succeeded: ${EXPLORER}/transactions/${signed_vote.hash}`
  } else {
    results += `\n\nError sending transaction: ${response_vote}`
  }

  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight  

  await updateAMM()

  client.disconnect()

}

// Calculate the value of LP tokens.
async function calculateLP() {

  await client.connect()

  const LPTokens = lpField2.value
  
  const amm_info = (await client.request({
    "command": "amm_info", 
    "asset": {
      "currency": "XRP"
    },
    "asset2": {
      "currency": "FOO",
      "issuer": issuer.address
    }
  }))
  
  const my_share = LPTokens / amm_info.result.amm.lp_token.value
  
  const my_asset1 = (amm_info.result.amm.amount * my_share) / 1000000
  const my_asset2 = amm_info.result.amm.amount2.value * my_share
  
  results += `\n\nMy ${LPTokens} LP tokens are worth:\n
    XRP: ${my_asset1}
    ${amm_info.result.amm.amount2.currency}: ${my_asset2}`

  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight  

  client.disconnect()

}

// Withdraw by redeeming LP tokens.
async function withdrawLP() {

  await client.connect()

  const LPTokens = lpField2.value

  // Get LP token info.

  const amm_info_request = {
    "command": "amm_info",
    "asset": {
      "currency": "XRP"
    },
    "asset2": {
      "currency": "FOO",
      "issuer": issuer.address
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
      "currency": "FOO",
      "issuer": issuer.address
    },
    "Account": wallet2.address,
    "LPTokenIn": {
      currency: ammCurrency,
      issuer: ammIssuer,
      value: LPTokens
    },
    "Flags": 0x00010000
  }
  
  const prepared_withdraw = await client.autofill(ammwithdraw)
  results += `\n\nPrepared transaction:\n${JSON.stringify(prepared_withdraw, null, 2)}`
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight    

  const signed_withdraw = wallet2.sign(prepared_withdraw)
  results += `\n\nSending AMMWithdraw transaction ...`
  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight

  const response_withdraw = await client.submitAndWait(signed_withdraw.tx_blob)
  
  if (response_withdraw.result.meta.TransactionResult == "tesSUCCESS") {
    results += `\n\nTransaction succeeded: ${EXPLORER}/transactions/${signed_withdraw.hash}`
  } else {
    results += `\n\nError sending transaction: ${response_withdraw}`
  }

  resultField.value = results
  resultField.scrollTop = resultField.scrollHeight

  // Update second wallet balances.
  balanceField2.value = (await client.getXrpBalance(wallet2.address))
  walletBalances2 = (await client.getBalances(wallet2.address))

  const fooCurrency2 = walletBalances2.find(item => item.currency === 'FOO');

  const fooValue2 = fooCurrency2 ? fooCurrency2.value : 'Currency not found';
  fooField2.value = fooValue2

  // Update LP token value.
  ammAccount = amm_info_result.result.amm.account

  const lpCurrency2 = walletBalances2.find(item => item.issuer === ammAccount);

  const lpValue2 = lpCurrency2 ? lpCurrency2.value : 'Currency not found';
  lpField2.value = lpValue2

  await updateAMM()

  client.disconnect()

}
