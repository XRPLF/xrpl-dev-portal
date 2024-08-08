// Define client, network, and explorer.

  const WS_URL = 'wss://s.devnet.rippletest.net:51233'
  const EXPLORER = 'https://devnet.xrpl.org'
  const client = new xrpl.Client(WS_URL);
  let wallet = null
  let issuer = null

// Connect to devnet

  async function getAccount() {
    
    results = 'Connecting to Devnet ...'
    resultField.value = results

    await client.connect()

    results += '\nConnected, funding wallet.'
    resultField.value = results
  
  // Fund a new devnet wallet
    wallet = (await client.fundWallet()).wallet
          
    results += '\nPopulated wallet info.'
    resultField.value = results
        
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
    
    await client.connect()
    
    issuer = (await client.fundWallet()).wallet
    
    results += `\n\nCreated issuer account: ${issuer.address}`
    resultField.value = results

    // Enable issuer DefaultRipple
    const issuer_setup_result = await client.submitAndWait({
        "TransactionType": "AccountSet",
        "Account": issuer.address,
        "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple
    }, {autofill: true, wallet: issuer} )    
    
      results += `\n\nIssuer DefaultRipple enabled: ${EXPLORER}/transactions/${issuer_setup_result.result.hash}`
      resultField.value = results
      
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
      
    // Issue tokens
    
    results += '\n\nSending 1000 FOO tokens ...'
    resultField.value = results

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
        results += `\nTokens issued: ${EXPLORER}/transactions/${issue_result.result.hash}`
        resultField.value = results
      
    walletBalances = (await client.getBalances(wallet.address))

    const fooCurrency = walletBalances.find(item => item.currency === 'FOO');

    const fooValue = fooCurrency ? fooCurrency.value : 'Currency not found';
    fooField.value = fooValue

    client.disconnect()

}

// Check if AMM exists.

async function checkAMM() {

    await client.connect()

    results += '\n\nChecking AMM ...'
    resultField.value = results

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
      results += `\n\n ${JSON.stringify(amm_info_result.result.amm, null, 2)}`
    } catch(err) {
      if (err.data.error === 'actNotFound') {
        results += (`\nNo AMM exists for the pair FOO / XRP.`)
      } else {
        throw(err)
      }
    }

    resultField.value = results

    client.disconnect()

}

// Create new AMM.

async function createAMM() {

// This example assumes that 10 XRP ≈ 100 FOO in value.

    await client.connect()

    results += '\n\nCreating AMM ...'
    resultField.value = results

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

    // Update balances
      balanceField.value = (await client.getXrpBalance(wallet.address))
      walletBalances = (await client.getBalances(wallet.address))

      const fooCurrency = walletBalances.find(item => item.currency === 'FOO');
  
      const fooValue = fooCurrency ? fooCurrency.value : 'Currency not found';
      fooField.value = fooValue
  

    client.disconnect()

}