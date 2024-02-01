// *******************************************************
// ****************  Set Minter  *************************
// *******************************************************

async function setMinter() {    
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results    
  await client.connect()
  results += '\nConnected, finding wallet.'
  standbyResultField.value = results    
  my_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  standbyResultField.value = results    

  tx_json = {
    "TransactionType": "AccountSet",
    "Account": my_wallet.address,
    "NFTokenMinter": standbyMinterField.value,
    "SetFlag": xrpl.AccountSetAsfFlags.asfAuthorizedNFTokenMinter
  } 
  results += '\nSet Minter.' 
  standbyResultField.value = results    
      
  const prepared = await client.autofill(tx_json)
  const signed = my_wallet.sign(prepared)
  const result = await client.submitAndWait(signed.tx_blob)
  if (result.result.meta.TransactionResult == "tesSUCCESS") {
    results += '\nAccount setting succeeded.\n'
    results += JSON.stringify(result,null,2)
    standbyResultField.value = results    
  } else {
    throw 'Error sending transaction: ${result}'
    results += '\nAccount setting failed.'
  standbyResultField.value = results    
  }
  client.disconnect()
} // End of configureAccount()

// *******************************************************
// ****************  Mint Other  *************************
// *******************************************************

async function mintOther() {
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results    
  let net = getNet()
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const client = new xrpl.Client(net)
  await client.connect()
  results += '\nConnected. Minting NFT.'
  standbyResultField.value = results    
      
  // This version adds the "Issuer" field.
  // ------------------------------------------------------------------------
  const tx_json = {
    "TransactionType": "NFTokenMint",
    "Account": standby_wallet.classicAddress,
    "URI": xrpl.convertStringToHex(standbyTokenUrlField.value),
    "Flags": parseInt(standbyFlagsField.value),
    "TransferFee": parseInt(standbyTransferFeeField.value),
    "Issuer": standbyIssuerField.value,
    "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
  }

  // ----------------------------------------------------- Submit transaction 
  const tx = await client.submitAndWait(tx_json, { wallet: standby_wallet} )
  const nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress  
  })
        
  // ------------------------------------------------------- Report results
  results += '\n\nTransaction result: '+ tx.result.meta.TransactionResult
  results += '\n\nnfts: ' + JSON.stringify(nfts, null, 2)
  standbyResultField.value = results  + (await
    client.getXrpBalance(standby_wallet.address))
  standbyResultField.value = results    
  client.disconnect()
} //End of mintToken()

// *******************************************************
// ****************  Set Operational Minter  **************
// ********************************************************

async function oPsetMinter() {    
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  await client.connect()
  results += '\nConnected, finding wallet.'
  operationalResultField.value = results
  my_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  operationalResultField.value = results

  tx_json = {
    "TransactionType": "AccountSet",
    "Account": my_wallet.address,
    "NFTokenMinter": operationalMinterField.value,
    "SetFlag": xrpl.AccountSetAsfFlags.asfAuthorizedNFTokenMinter
  } 
  results += '\nSet Minter.' 
  operationalResultField.value = results
      
  const prepared = await client.autofill(tx_json)
  const signed = my_wallet.sign(prepared)
  const result = await client.submitAndWait(signed.tx_blob)
  if (result.result.meta.TransactionResult == "tesSUCCESS") {
    results += '\nAccount setting succeeded.\n'
    results += JSON.stringify(result,null,2)
    operationalResultField.value = results
  } else {
    throw 'Error sending transaction: ${result}'
    results += '\nAccount setting failed.'
    operationalResultField.value = results
  }
      
  client.disconnect()
} // End of oPsetMinter()


// *******************************************************
// ************** Operational Mint Other *****************
// *******************************************************
      
async function oPmintOther() {
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  let net = getNet()
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const client = new xrpl.Client(net)
  await client.connect()
  results += '\nConnected. Minting NFT.'
  operationalResultField.value = results

  // This version adds the "Issuer" field.
  // ------------------------------------------------------------------------
  const tx_json = {
    "TransactionType": 'NFTokenMint',
    "Account": operational_wallet.classicAddress,
    "URI": xrpl.convertStringToHex(operationalTokenUrlField.value),
    "Flags": parseInt(operationalFlagsField.value),
    "Issuer": operationalIssuerField.value,
    "TransferFee": parseInt(operationalTransferFeeField.value),
    "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
  }
      
  // ----------------------------------------------------- Submit signed blob 
  const tx = await client.submitAndWait(tx_json, { wallet: operational_wallet} )
  const nfts = await client.request({
    method: "account_nfts",
    account: operational_wallet.classicAddress  
  })
        
  // ------------------------------------------------------- Report results
  results += '\n\nTransaction result: '+ tx.result.meta.TransactionResult
  results += '\n\nnfts: ' + JSON.stringify(nfts, null, 2)
  results += await client.getXrpBalance(operational_wallet.address)
  operationalResultField.value = results
  client.disconnect()
} //End of oPmintToken

