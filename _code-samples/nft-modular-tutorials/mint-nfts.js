// *******************************************************
// ********************** Mint NFT ***********************
// *******************************************************

async function mintNFT() {
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value);
  const net = getNet();
  const client = new xrpl.Client(net);
  let results = `\n=== Connected. Minting NFT ===`;
  resultField.value = results;

  try {
    await client.connect();

    // Prepare transaction parameters
    const transactionParams = {
      TransactionType: "NFTokenMint",
      Account: wallet.classicAddress,
      URI: xrpl.convertStringToHex(nftURLfield.value),
      Flags: parseInt(flagsField.value, 10), // Parse to integer
      TransferFee: parseInt(transferFeeField.value, 10), // Parse to integer
      NFTokenTaxon: parseInt(nftTaxonField.value, 10), // Parse to integer
    };

    // Add optional fields
    if (amountField.value) {
         transactionParams.Amount = configureAmount(amountField.value);
    }

    if (expirationField.value) {
       transactionParams.Expiration = configureExpiration(expirationField.value);
    }

    if (destinationField.value) {
      transactionParams.Destination = destinationField.value;
    }

    console.log("Mint NFT Transaction Parameters:", transactionParams); // Log before submitting

    // Submit transaction
    const tx = await client.submitAndWait(transactionParams, { wallet });

    // Get minted NFTs
    const nfts = await client.request({
      method: "account_nfts",
      account: wallet.classicAddress,
    });

    // Report results
    results += `\n\n=== Transaction result: ${tx.result.meta.TransactionResult} ===`;
    results += `\n\n=== NFTs: ${JSON.stringify(nfts, null, 2)} ===`;
    results += `\n\n=== XRP Balance: ${await client.getXrpBalance(wallet.address)} ===`; // Await here
    resultField.value = results;

  } catch (error) {
    console.error("Error minting NFT:", error);
    results += `\n\n=== Error minting NFT: ${error.message} ===`; // Use error.message
    resultField.value = results;
  } finally {
    if (client && client.isConnected()) { // Check if connected before disconnecting
      await client.disconnect();
    }
  }
} // End of mintToken()

// *******************************************************
// ******************** Get NFTs *************************
// *******************************************************

async function getNFTs() {
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value);
  const net = getNet();
  const client = new xrpl.Client(net);
  let results = '\n=== Connected. Getting NFTs. ===';
  resultField.value = results;
  try {
    await client.connect();

    const nfts = await client.request({
      method: "account_nfts",
      account: wallet.classicAddress,
    });
    results = '\n=== NFTs:\n ' + JSON.stringify(nfts, null, 2) + ' ==='; // Consistent formatting
    resultField.value = results;
  } catch (error) {
    console.error("Error getting NFTs:", error);
    results += `\n\n=== Error getting NFTs: ${error.message} ===`; // User-friendly
    resultField.value = results;
  } finally {
    if (client && client.isConnected()) {
      await client.disconnect();
    }
  }
} // End of getNFTs()

// *******************************************************
// ********************** Burn NFT ***********************
// *******************************************************

async function burnNFT() {
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value);
  const net = getNet();
  const client = new xrpl.Client(net);
  let results = '\n=== Connected. Burning NFT. ===';
  resultField.value = results;
  try {
    await client.connect();

    // Prepare transaction
    const transactionBlob = {
      TransactionType: "NFTokenBurn",
      Account: wallet.classicAddress,
      NFTokenID: nftIdField.value,
    };

    console.log("Burn NFT Transaction Parameters:", transactionBlob); // Log before submit

    // Submit transaction and wait for the results
    const tx = await client.submitAndWait(transactionBlob, { wallet });
    const nfts = await client.request({ // Get nfts after burning.
      method: "account_nfts",
      account: wallet.classicAddress,
    });

    results = `\n=== Transaction result: ${tx.result.meta.TransactionResult} ===`; 
    results += '\n\n=== Balance changes: ' +
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2) + ' ===';
    results += '\n\n=== NFTs: \n' + JSON.stringify(nfts, null, 2) + ' ==='; 
    resultField.value = results;
    xrpBalanceField.value = (await client.getXrpBalance(wallet.address)); // Await

  } catch (error) {
    console.error("Error burning NFT:", error);
    results = `\n\n=== Error burning NFT: ${error.message} ===`; // User friendly
    resultField.value = results;
  } finally {
    if (client && client.isConnected()) {
      await client.disconnect();
    }
  }
} // End of burnNFT()
