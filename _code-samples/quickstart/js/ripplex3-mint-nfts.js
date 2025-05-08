// *******************************************************
// ********************** Mint Token *********************
// *******************************************************
      
async function mintToken() {
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results
  let net = getNet()
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const client = new xrpl.Client(net)
  await client.connect()
  results += '\nConnected. Minting NFT.'
  standbyResultField.value = results
      
  // Note that you must convert the token URL to a hexadecimal 
  // value for this transaction.
  // ------------------------------------------------------------------------
  const transactionJson = {
    "TransactionType": "NFTokenMint",
    "Account": standby_wallet.classicAddress,
    "URI": xrpl.convertStringToHex(standbyTokenUrlField.value),
    "Flags": parseInt(standbyFlagsField.value),
    "TransferFee": parseInt(standbyTransferFeeField.value),
    "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
  }

  // ----------------------------------------------------- Submit signed blob 
  const tx = await client.submitAndWait(transactionJson, { wallet: standby_wallet} )
  const nfts = await client.request({
    "method": "account_nfts",
    "account": standby_wallet.classicAddress
  })

  // ------------------------------------------------------- Report results
  results += '\n\nTransaction result: '+ tx.result.meta.TransactionResult
  results += '\n\nnfts: ' + JSON.stringify(nfts, null, 2)
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  standbyResultField.value = results    
  client.disconnect()
} //End of mintToken()

// *******************************************************
// ******************* Get Tokens ************************
// *******************************************************
      
async function getTokens() {
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...'
  standbyResultField.value = results
  await client.connect()
  results += '\nConnected. Getting NFTs...'
  standbyResultField.value = results
  const nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress
  })
  results += '\nNFTs:\n ' + JSON.stringify(nfts,null,2)
  standbyResultField.value = results
  client.disconnect()
} //End of getTokens()
      
// *******************************************************
// ********************* Burn Token **********************
// *******************************************************
      
async function burnToken() {
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...'
  standbyResultField.value = results
  await client.connect()
  results += '\nConnected. Burning NFT...'
  standbyResultField.value = results

  // ------------------------------------------------------- Prepare transaction
  const transactionBlob = {
    "TransactionType": "NFTokenBurn",
    "Account": standby_wallet.classicAddress,
    "NFTokenID": standbyTokenIdField.value
  }

  //---------------------------------- Submit transaction and wait for the results
  const tx = await client.submitAndWait(transactionBlob,{wallet: standby_wallet})
  const nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress
  })
  results += '\nTransaction result: '+ tx.result.meta.TransactionResult
  results += '\nBalance changes: ' +
  JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  standbyResultField.value = results
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  results += '\nNFTs: \n' + JSON.stringify(nfts,null,2)
  standbyResultField.value = results
  client.disconnect()
}// End of burnToken()

// **********************************************************************
// ****** Reciprocal Transactions ***************************************
// **********************************************************************
   
// *******************************************************
// ************** Operational Mint Token *****************
// *******************************************************
      
async function oPmintToken() {
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  let net = getNet()
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const client = new xrpl.Client(net)
  await client.connect()
  results += '\nConnected. Minting NFT.'
  operationalResultField.value = results

  // Note that you must convert the token URL to a hexadecimal 
  // value for this transaction.
  // ------------------------------------------------------------------------
  const transactionBlob = {
    "TransactionType": 'NFTokenMint',
    "Account": operational_wallet.classicAddress,
    "URI": xrpl.convertStringToHex(operationalTokenUrlField.value),
    "Flags": parseInt(operationalFlagsField.value),
    "TransferFee": parseInt(operationalTransferFeeField.value),
    "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
  }
      
  // ----------------------------------------------------- Submit signed blob 
  const tx = await client.submitAndWait(transactionBlob, { wallet: operational_wallet} )
  const nfts = await client.request({
    method: "account_nfts",
    account: operational_wallet.classicAddress
  })
        
  // ------------------------------------------------------- Report results
  results += '\n\nTransaction result: '+ tx.result.meta.TransactionResult
  results += '\n\nnfts: ' + JSON.stringify(nfts, null, 2)
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  operationalResultField.value = results
  client.disconnect()
} //End of oPmintToken
      
// *******************************************************
// ************** Operational Get Tokens *****************
// *******************************************************

async function oPgetTokens() {
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '...'
  operationalResultField.value = results
  await client.connect()
  results += '\nConnected. Getting NFTs...'
  operationalResultField.value = results
  const nfts = await client.request({
    method: "account_nfts",
    account: operational_wallet.classicAddress
  })
  results += '\nNFTs:\n ' + JSON.stringify(nfts,null,2)
  operationalResultField.value = results
  client.disconnect()
} //End of oPgetTokens
      
// *******************************************************
// ************* Operational Burn Token ******************
// *******************************************************
      
async function oPburnToken() {
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '...'
  operationalResultField.value = results
  await client.connect()
  results += '\nConnected. Burning NFT...'
  operationalResultField.value = results
      
  // ------------------------------------------------------- Prepare transaction
  const transactionBlob = {
    "TransactionType": "NFTokenBurn",
    "Account": operational_wallet.classicAddress,
    "NFTokenID": operationalTokenIdField.value
  }
      
  //-------------------------------------------------------- Submit signed blob
  const tx = await client.submitAndWait(transactionBlob,{wallet: operational_wallet})
  const nfts = await client.request({
    method: "account_nfts",
    account: operational_wallet.classicAddress
  })
  results += '\nTransaction result: '+ tx.result.meta.TransactionResult
  results += '\nBalance changes: ' +
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  operationalResultField.value = results
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  results += '\nNFTs: \n' + JSON.stringify(nfts,null,2)
  operationalResultField.value = results
  client.disconnect()
}
// End of oPburnToken()