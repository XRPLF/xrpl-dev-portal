// *******************************************************
// ****************** Batch Mint  ***********************
// *******************************************************

async function batchMintNFTs() {
  let client; // Declare client here so it's accessible in finally block
  try {
    //--------------------- Connect to the XRP Ledger and get the account wallet.
    let net = getNet();
    client = new xrpl.Client(net); // Assign client
    results = 'Connecting to ' + getNet() + '....';
    resultField.value = results;
    await client.connect();
    results += '\nConnected, finding wallet.';
    resultField.value = results;

    let wallet;
    try {
      wallet = xrpl.Wallet.fromSeed(accountSeedField.value);
    } catch (error) {
      results += '\nError: Invalid account seed. Please check your seed.';
      resultField.value = results;
      return; // Stop execution if wallet cannot be derived
    }
    resultField.value = results;

    //----------------- Get account information, particularly the Sequence number.
    let account_info;
    try {
      account_info = await client.request({
        "command": "account_info",
        "account": wallet.address
      });
    } catch (error) {
      results += `\nError retrieving account info for ${wallet.address}: ${error.message}`;
      resultField.value = results;
      return;
    }

    let my_sequence = account_info.result.account_data.Sequence;
    results += "\n\nSequence Number: " + my_sequence + "\n\n";
    resultField.value = results;

    /* ###################################
       Create ticket numbers for the batch

       Without tickets, if one transaction fails, all others in the batch fail.
       With tickets, there can be failures, but the rest will continue, and you
       can investigate any problems afterward.
    */

    //---------------------- Parse the requested number from nftCountField.
    const nftCount = parseInt(nftCountField.value);
    if (isNaN(nftCount) || nftCount <= 0) {
      results += '\nError: Please enter a valid number of NFTs to mint.';
      resultField.value = results;
      return;
    }

    //-------------------------------------------- Create the transaction hash.
    let ticketTransaction;
    try {
      ticketTransaction = await client.autofill({
        "TransactionType": "TicketCreate",
        "Account": wallet.address,
        "TicketCount": nftCount,
        "Sequence": my_sequence
      });
    } catch (error) {
      results += `\nError autofilling ticket creation transaction: ${error.message}`;
      resultField.value = results;
      return;
    }


    //---------------------------------------------------- Sign the transaction.
    const signedTransaction = wallet.sign(ticketTransaction);

    //-------------------------- Submit the transaction and wait for the result.
    let tx;
    try {
      tx = await client.submitAndWait(signedTransaction.tx_blob);
    } catch (error) {
      results += `\nError submitting ticket creation transaction: ${error.message}`;
      resultField.value = results;
      return;
    }

    if (tx.result.meta.TransactionResult !== 'tesSUCCESS') {
      results += `\nError creating tickets. Transaction failed with result: ${tx.result.meta.TransactionResult}`;
      resultField.value = results;
      return;
    }
    results += `\nTickets created successfully. Transaction result: ${tx.result.meta.TransactionResult}\n\n`;
    resultField.value = results;

    let response;
    try {
      response = await client.request({
        "command": "account_objects",
        "account": wallet.address,
        "type": "ticket"
      });
    } catch (error) {
      results += `\nError retrieving account tickets: ${error.message}`;
      resultField.value = results;
      return;
    }

    //------------------------------------ Populate the tickets array variable.
    let tickets = [];
    if (response.result.account_objects && response.result.account_objects.length > 0) {
      for (let i = 0; i < nftCount; i++) {
        if (response.result.account_objects[i]) {
          tickets[i] = response.result.account_objects[i].TicketSequence;
        } else {
          results += `\nWarning: Fewer tickets found than requested. Expected ${nftCount}, found ${response.result.account_objects.length}.`;
          resultField.value = results;
          break; // Exit loop if tickets run out
        }
      }
    } else {
      results += '\nError: No tickets found for the account.';
      resultField.value = results;
      return;
    }

    //-------------------------------------------------------- Report progress.
    results += "Tickets generated, minting NFTs.\n\n";
    resultField.value = results;

    // ###################################
    // Mint NFTs

    let mintedNFTsCount = 0;
    for (let i = 0; i < tickets.length; i++) {
      const transactionParams = {
        "TransactionType": "NFTokenMint",
        "Account": wallet.classicAddress,
        "URI": xrpl.convertStringToHex(nftURLfield.value),
        "Flags": parseInt(flagsField.value),
        "TransferFee": parseInt(transferFeeField.value),
        "Sequence": 0, // Sequence is 0 when using TicketSequence
        "TicketSequence": tickets[i],
        "LastLedgerSequence": null, // Optional, can be used for time limits
        "NFTokenTaxon": nftTaxonField.value,
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

      try {
        const mintTx = await client.submit(transactionParams, {
          wallet: wallet
        });
        results += `\nNFT ${i+1} minted successfully.`;
        mintedNFTsCount++;
        resultField.value = results;
      } catch (error) {
        console.log(error);
      }
      // Add a small delay to avoid hitting rate limits if many NFTs are being minted
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    results += `\n\nAttempted to mint ${nftCount} NFTs. Successfully minted ${mintedNFTsCount} NFTs.`;

    results += "\n\nFetching minted NFTs...\n";
    let nfts;
    try {
      nfts = await client.request({
        method: "account_nfts",
        account: wallet.classicAddress,
        limit: 400
      });
      results += JSON.stringify(nfts, null, 2);

      while (nfts.result.marker) {
        nfts = await client.request({
          method: "account_nfts",
          account: wallet.classicAddress,
          limit: 400,
          marker: nfts.result.marker
        });
        results += '\n' + JSON.stringify(nfts, null, 2);
      }
    } catch (error) {
      results += `\nError fetching account NFTs: ${error.message}`;
    }

    try {
      xrpBalanceField.value = (await client.getXrpBalance(wallet.address));
    } catch (error) {
      results += `\nError fetching XRP balance: ${error.message}`;
    }

    resultField.value = results;

  } catch (error) {
    results += `\nAn unexpected error occurred during batch minting: ${error.message}`;
    resultField.value = results;
  } finally {
    if (client && client.isConnected()) {
      client.disconnect();
      results += '\nDisconnected from XRP Ledger.';
      resultField.value = results;
    }
  }
} // End of batchMint()


// *******************************************************
// **************** Get Batch Tokens *********************
// *******************************************************

async function getBatchNFTs() {
  let client; // Declare client here for finally block access
  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value);
    let net = getNet();
    client = new xrpl.Client(net); // Assign client
    results = 'Connecting to ' + net + '...';
    resultField.value = results;
    await client.connect();
    results += '\nConnected. Getting NFTs...';
    resultField.value = results;

    results += "\n\nNFTs:\n";
    let nfts;
    try {
      nfts = await client.request({
        method: "account_nfts",
        account: wallet.classicAddress,
        limit: 400
      });

      results += JSON.stringify(nfts, null, 2);
      while (nfts.result.marker) {
        nfts = await client.request({
          method: "account_nfts",
          account: wallet.classicAddress,
          limit: 400,
          marker: nfts.result.marker
        });
        results += '\n' + JSON.stringify(nfts, null, 2);
      }
    } catch (error) {
      results += `\nError fetching account NFTs: ${error.message}`;
    }
    resultField.value = results;

  } catch (error) {
    results += `\nAn unexpected error occurred while getting batch NFTs: ${error.message}`;
    resultField.value = results;
  } finally {
    if (client && client.isConnected()) {
      client.disconnect();
      results += '\nDisconnected from XRP Ledger.';
      resultField.value = results;
    }
  }
} //End of getBatchNFTs()
