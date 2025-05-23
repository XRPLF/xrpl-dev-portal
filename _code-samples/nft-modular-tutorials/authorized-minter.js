// *******************************************************
// ************  Authorize Minter  ***********************
// *******************************************************

async function authorizeMinter() {
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value);
  const net = getNet();
  const client = new xrpl.Client(net);
  let results = `\n=== Connected. Authorizing Minter. ===`;
  resultField.value = results;

  try {
    await client.connect();
    tx_json = {
      "TransactionType": "AccountSet",
      "Account": wallet.address,
      "NFTokenMinter": authorizedMinterField.value,
      "SetFlag": xrpl.AccountSetAsfFlags.asfAuthorizedNFTokenMinter
    }

    const prepared = await client.autofill(tx_json)
    const signed = wallet.sign(prepared)
    const result = await client.submitAndWait(signed.tx_blob)
    results += '\nAccount setting succeeded.\n'
    results += JSON.stringify(result, null, 2)
    resultField.value = results
  } catch (error) {
    console.error("Error setting minter:", error);
    results = `\n\n=== Error setting minter: ${error.message}`;
    resultField.value += results;
  } finally {
    if (client && client.isConnected()) {
      await client.disconnect();
    }
  }
} // End of configureAccount()

// *******************************************************
// ****************  Mint Other  *************************
// *******************************************************

async function mintOther() {
  let results = 'Connecting to ' + getNet() + '....'
  resultField.value = results
  const net = getNet()
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  const client = new xrpl.Client(net)

  try {
    await client.connect()
    results += '\nConnected. Minting NFT.'
    resultField.value = results

    // This version adds the "Issuer" field.
    // ------------------------------------------------------------------------
    const tx_json = {
      "TransactionType": "NFTokenMint",
      "Account": wallet.classicAddress,
      "URI": xrpl.convertStringToHex(nftURLfield.value),
      "Flags": parseInt(flagsField.value),
      "TransferFee": parseInt(transferFeeField.value),
      "Issuer": issuerField.value,
      "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
    }

    // ----------------------------------------------------- Submit transaction
    const tx = await client.submitAndWait(tx_json, { wallet: wallet })
    const nfts = await client.request({
      method: "account_nfts",
      account: wallet.classicAddress
    })

    // ------------------------------------------------------- Report results
    results += '\n\n=== Transaction result: ' + tx.result.meta.TransactionResult
    results += '\n\n=== NFTs: ' + JSON.stringify(nfts, null, 2)
    resultField.value = results + (await client.getXrpBalance(wallet.address))
    // The line below seems redundant if the previous line already updates resultField.value
    // resultField.value = results
  } catch (error) {
    results += '\n\nAn error occurred: ' + error.message
    console.error(error) // Log the error for debugging
    resultField.value = results
  } finally {
    if (client.isConnected()) { // Check if the client is connected before attempting to disconnect
      client.disconnect()
      results += '\nDisconnected from XRPL.'
      resultField.value = results
    }
  }
} //End of mintOther()

