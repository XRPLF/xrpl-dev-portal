
// *********************************************************
// *************** Create Sell Offer ***********************
// *********************************************************

async function createSellOffer() {
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value);
  let results = '\nCreating sell offer...';
  resultField.value = results;

  try {
    const client = new xrpl.Client(getNet());
    await client.connect();
    try {
      const destination = destinationField.value || undefined;
      const expiration = expirationField.value ? configureExpiration() : undefined;

      const transactionJson = {
        TransactionType: "NFTokenCreateOffer",
        Account: wallet.classicAddress,
        NFTokenID: nftIdField.value,
        Flags: 1,
      };

      const amount = configureAmount();
      if (amount) { // Only add Amount if it's defined
        transactionJson.Amount = amount;
      } else {
        console.warn("Amount is undefined. Sell offer might be invalid.");
        results += "\nWarning: Amount is undefined. Sell offer might be invalid, unless you plan to give away the NFT.";
        resultField.value = results;
      }

      if (expiration) {
        transactionJson.Expiration = expiration;
      }
      if (destination) {
        transactionJson.Destination = destination;
      }

      const tx = await client.submitAndWait(transactionJson, { wallet });
      results += `\nSell offer created successfully!\nTransaction Hash: ${tx.result.hash}\nEngine Result: ${tx.result.engine_result}`;
      resultField.value = results;

    } finally {
      client.disconnect();
    }
  } catch (error) {
    console.error("Error creating sell offer:", error);
    results = `\nError: ${error.message || error}`;
    resultField.value = results;
  }
}// End of createSellOffer()

// *******************************************************
// ***************** Create Buy Offer ********************
// *******************************************************

async function createBuyOffer() {
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value);
  let net = getNet();
  const client = new xrpl.Client(net);
  await client.connect();
  let results = '\n=== Connected. Creating buy offer. ===';
  resultField.value = results;

  try {
    // Use the external configureAmount() function
    let amount = configureAmount();
    // Use the external configureExpiration() function
    let expiration = configureExpiration(); // This will return a number or an empty string from the original logic

    let transactionJson = {
      "TransactionType": "NFTokenCreateOffer",
      "Account": wallet.classicAddress,
      "Owner": nftOwnerField.value,
      "NFTokenID": nftIdField.value,
      "Flags": 0, // Ensure no tfSellNFToken flag for a buy offer
    };

    // Only add Amount if it's defined (not undefined or an empty string)
    if (amount !== undefined && amount !== '') {
      transactionJson.Amount = amount;
    } else {
      results += "\nError: Amount field is required for a buy offer.";
      resultField.value = results;
      client.disconnect();
      return;
    }

    if (destinationField.value !== '') {
      transactionJson.Destination = destinationField.value;
    }

    // Only add Expiration if it's not an empty string
    if (expiration > 0) {
      transactionJson.Expiration = expiration;
    }

    const tx = await client.submitAndWait(transactionJson, { wallet: wallet });

    results += "\n\n=== Sell Offers ===\n";
    let nftSellOffers;
    try {
      nftSellOffers = await client.request({
        method: "nft_sell_offers",
        nft_id: nftIdField.value
      });
    } catch (err) {
      nftSellOffers = "=== No sell offers. ===";
    }
    results += JSON.stringify(nftSellOffers, null, 2);
    results += "\n\n=== Buy Offers ===\n";
    let nftBuyOffers;
    try {
      nftBuyOffers = await client.request({
        method: "nft_buy_offers",
        nft_id: nftIdField.value
      });
      results += JSON.stringify(nftBuyOffers, null, 2);
    } catch (err) {
      results += "=== No buy offers. ===";
    }

    // Check transaction results -------------------------------------------------
    results += "\n\n=== Transaction result:\n" +
      JSON.stringify(tx.result.meta.TransactionResult, null, 2);
    results += "\n\n=== Balance changes:\n" +
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2);
    resultField.value = results;

  } catch (error) {
    console.error('Error creating buy offer:', error);
    results += "\n\n=== Error: " + error;
    resultField.value = results;
  } finally {
    client.disconnect();
  }
}// End of createBuyOffer()

// *******************************************************
// ******************** Cancel Offer *********************
// *******************************************************

async function cancelOffer() {
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = "\n=== Connected. Cancelling offer. ==="
  resultField.value = results

  const tokenOfferIDs = [nftOfferIdField.value]

  // Prepare transaction -------------------------------------------------------
  const transactionJson = {
    "TransactionType": "NFTokenCancelOffer",
    "Account": wallet.classicAddress,
    "NFTokenOffers": tokenOfferIDs
  }
  // Submit transaction --------------------------------------------------------
  const tx = await client.submitAndWait(transactionJson, { wallet })

  results = "\n\n=== Sell Offers===\n"
  let nftSellOffers
  try {
    nftSellOffers = await client.request({
      method: "nft_sell_offers",
      nft_id: nftIdField.value
    })
  } catch (err) {
    nftSellOffers = '=== No sell offers. ===\n'
  }
  results += JSON.stringify(nftSellOffers, null, 2)
  results += "\n\n=== Buy Offers ===\n"
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
      method: "nft_buy_offers",
      nft_id: nftIdField.value
    })

  } catch (err) {
    nftBuyOffers = '=== No buy offers. ==='
  }
  results += JSON.stringify(nftBuyOffers, null, 2)
  resultField.value += results

  // Check transaction results -------------------------------------------------

  results = "\n=== Transaction result:\n" +
    JSON.stringify(tx.result.meta.TransactionResult, null, 2)
  results += "\n\n=== Balance changes:\n" +
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  resultField.value += results

  client.disconnect() // End of cancelOffer()
}

// *******************************************************
// ******************** Get Offers ***********************
// *******************************************************

async function getOffers() {
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()

  let results = '\nConnected. Getting offers...'
  resultField.value = results

  // --- Sell Offers ---
  results += '\n\n=== Sell Offers ===\n'
  let nftSellOffers
  try {
    nftSellOffers = await client.request({
      method: "nft_sell_offers",
      nft_id: nftIdField.value
    })
  } catch (err) {
    nftSellOffers = 'No sell offers found for this NFT ID.'
  }
  results += JSON.stringify(nftSellOffers, null, 2)
  resultField.value = results

  // --- Buy Offers ---
  results = '\n\n=== Buy Offers ===\n'
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
      method: "nft_buy_offers",
      nft_id: nftIdField.value
    })
  } catch (err) {
    // Log the actual error for debugging
    nftBuyOffers = 'No buy offers found for this NFT ID.' // More descriptive
  }
  results += JSON.stringify(nftBuyOffers, null, 2) // Append the JSON string
  resultField.value += results // Update the display with buy offers

  client.disconnect()
}// End of getOffers()

// *******************************************************
// ****************** Accept Sell Offer ******************
// *******************************************************

async function acceptSellOffer() {
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  try {
    await client.connect()
    let results = '\n=== Connected. Accepting sell offer. ===\n\n'
    resultField.value = results

    // Prepare transaction -------------------------------------------------------
    const transactionJson = {
      "TransactionType": "NFTokenAcceptOffer",
      "Account": wallet.classicAddress,
      "NFTokenSellOffer": nftOfferIdField.value,
    }
    // Submit transaction --------------------------------------------------------
    const tx = await client.submitAndWait(transactionJson, { wallet: wallet })
    const nfts = await client.request({
      method: "account_nfts",
      account: wallet.classicAddress
    })

    // Check transaction results -------------------------------------------------

    xrpBalanceField.value = (await client.getXrpBalance(wallet.address))


    results += '=== Transaction result:\n'
    results += JSON.stringify(tx.result.meta.TransactionResult, null, 2)
    results += '\n=== Balance changes:'
    results += JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
    results += JSON.stringify(nfts, null, 2)
    resultField.value += results
  } catch (error) {
    console.error('Error accepting sell offer:', error)
    resultField.value = `Error: ${error.message || error}`
  } finally {
    client.disconnect()
  }
}// End of acceptSellOffer()

// *******************************************************
// ******************* Accept Buy Offer ******************
// *******************************************************

async function acceptBuyOffer() {
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value);
  let net = getNet();
  const client = new xrpl.Client(net);
  let results = '\n=== Connected. Accepting buy offer. ==='; // Declare results locally

  try {
    await client.connect();
    resultField.value = results; // Update UI after connection

    // Prepare transaction -------------------------------------------------------
    const transactionJson = {
      "TransactionType": "NFTokenAcceptOffer",
      "Account": wallet.classicAddress,
      "NFTokenBuyOffer": nftOfferIdField.value
    };

    // Submit transaction --------------------------------------------------------
    const tx = await client.submitAndWait(transactionJson, { wallet: wallet });

    const nfts = await client.request({
      method: "account_nfts",
      account: wallet.classicAddress
    });

    results += JSON.stringify(nfts, null, 2);
    resultField.value = results;

    // Check transaction results -------------------------------------------------
    results += "\n\nTransaction result:\n" +
      JSON.stringify(tx.result.meta.TransactionResult, null, 2);
    results += "\nBalance changes:\n" +
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2);
    xrpBalanceField.value = (await client.getXrpBalance(wallet.address));
    resultField.value = results;

  } catch (error) {
    console.error('Error in acceptBuyOffer:', error); // Log the full error
    results = `\n=== Error accepting buy offer: ${error.message || 'Unknown error'} ===`; 
    resultField.value = results;
  } finally {
    if (client && client.isConnected()) {
      client.disconnect();
    }
  }
} // End of acceptBuyOffer()