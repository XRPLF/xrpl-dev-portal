// *******************************************************
// ******************* Broker Sale ***********************
// *******************************************************

async function brokerSale() {
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value);
  const net = getNet();
  const client = new xrpl.Client(net);
  let results = `\n=== Connected. Brokering the sale. ===`;
  resultField.value = results;

  try {
    await client.connect();

    // Prepare transaction -------------------------------------------------------
    const brokerTx = {
      "TransactionType": "NFTokenAcceptOffer",
      "Account": wallet.classicAddress,
      "NFTokenSellOffer": nftSellOfferIndexField.value,
      "NFTokenBuyOffer": nftBuyOfferIndexField.value,
      "NFTokenBrokerFee": brokerFeeField.value
    }
    console.log(JSON.stringify(brokerTx, null, 2));
    // Submit transaction --------------------------------------------------------
    const tx = await client.submitAndWait(brokerTx, { wallet: wallet })

    // Check transaction results -------------------------------------------------
    results += "\n\nTransaction result:\n" +
      JSON.stringify(tx.result.meta.TransactionResult, null, 2)
    results += "\nBalance changes:\n" +
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
    xrpBalanceField.value = (await client.getXrpBalance(wallet.address))
    resultField.value += results
  } catch (error) {
    console.error("Error in broker sale:", error);
    results = `\n\n=== Error in broker sale: ${error.message} ===`; // User friendly
    resultField.value += results;
  }
  finally {
    if (client && client.isConnected()) {
      await client.disconnect();
    }
  }
}// End of brokerSale()