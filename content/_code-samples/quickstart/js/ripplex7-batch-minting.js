// *******************************************************
// ************  Get Account from Seed  ******************
// *******************************************************

async function getAccountFromSeed() {
	let net = getNet()
	const client = new xrpl.Client(net)
	results = 'Connecting to ' + getNet() + '....'
	document.getElementById('standbyResultField').value = results
	await client.connect()
	results += '\nConnected, finding wallets.\n'
	document.getElementById('standbyResultField').value = results

	// -------------------------------------------- Find the test account wallet.   
	var theSeed = document.getElementById('seeds').value
	const standby_wallet = xrpl.Wallet.fromSeed(theSeed)

	// ------------------------------------------------- Get the current balance.
	const standby_balance = (await client.getXrpBalance(standby_wallet.address))  
	
	// --------------------------------- Populate the fields for Standby account.
	document.getElementById('standbyAccountField').value = standby_wallet.address
	document.getElementById('standbyPubKeyField').value = standby_wallet.publicKey
	document.getElementById('standbyPrivKeyField').value = standby_wallet.privateKey
	document.getElementById('standbySeedField').value = standby_wallet.seed
	document.getElementById('standbyBalanceField').value = 
		(await client.getXrpBalance(standby_wallet.address))

 client.disconnect()
			
} // End of getAccountsFromSeeds()

// *******************************************************
// **************** Get Batch Tokens *********************
// *******************************************************
      
async function getBatchNFTokens() {
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...'
  document.getElementById('standbyResultField').value = results
  await client.connect()
  results += '\nConnected. Getting NFTokens...'
  document.getElementById('standbyResultField').value = results
  
  results += "\n\nNFTs:\n"
  let nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress,
    limit: 400
  })

  results += JSON.stringify(nfts,null,2)
  while (nfts.result.marker)
  {
    nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress,
    limit: 400,
    marker: nfts.result.marker
  })
    results += '\n' + JSON.stringify(nfts,null,2)
  }
  document.getElementById('standbyResultField').value = results
  client.disconnect()
} //End of getBatchTokens()

// *******************************************************
// ******************  Batch Mint  ***********************
// *******************************************************

async function batchMint() {    

//--------------------- Connect to the XRP Ledger and get the account wallet.

  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  document.getElementById('standbyResultField').value = results
  await client.connect() 
  results += '\nConnected, finding wallet.'
  document.getElementById('standbyResultField').value = results
  standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  document.getElementById('standbyResultField').value = results

//----------------- Get account information, particularly the Sequence number.

  const account_info = await client.request({
    "command": "account_info",
    "account": standby_wallet.address
  })
  
  my_sequence = account_info.result.account_data.Sequence
  results += "\n\nSequence Number: " + my_sequence + "\n\n"
  document.getElementById('standbyResultField').value = results

// ###################################
// Create ticket numbers for the batch

// Without tickets, if one transaction fails, all others in the batch fail.
// With tickets, there can be failures, but the rest will continue, and you 
// can investigate any problems afterward.


  //---------------------- Parse the requested number from NFTokenCountField.
  const nftokenCount = parseInt(standbyNFTokenCountField.value)

  //-------------------------------------------- Create the transaction hash.
  const ticketTransaction = await client.autofill({
    "TransactionType": "TicketCreate",
    "Account": standby_wallet.address,
    "TicketCount": nftokenCount,
    "Sequence": my_sequence
  })

  //---------------------------------------------------- Sign the transaction.
  const signedTransaction = standby_wallet.sign(ticketTransaction)
  
  //-------------------------- Submit the transaction and wait for the result.
  const tx = await client.submitAndWait(signedTransaction.tx_blob)

  let response = await client.request({
    "command": "account_objects",
    "account": standby_wallet.address,
    "type": "ticket"
  })
  
  //------------------------------------ Populate the tickets array variable.
  let tickets = []

  for (let i=0; i < nftokenCount; i++) {
    tickets[i] = response.result.account_objects[i].TicketSequence
  }

  //-------------------------------------------------------- Report progress.
  results += "Tickets generated, minting NFTokens.\n\n"
  document.getElementById('standbyResultField').value = results

// ###################################
// Mint NFTokens
  
  for (let i=0; i < nftokenCount; i++) {
		const transactionBlob = {
			"TransactionType": "NFTokenMint",
			"Account": standby_wallet.classicAddress,
			"URI": xrpl.convertStringToHex(standbyTokenUrlField.value),
			"Flags": parseInt(standbyFlagsField.value),
			"TransferFee": parseInt(standbyTransferFeeField.value),
			"Sequence": 0,
			"TicketSequence": tickets[i],
			"LastLedgerSequence": null,
			"NFTokenTaxon": 0 
		}

	//------------------------------------------------------ Submit signed blob. 
		const tx =  client.submit(transactionBlob, { wallet: standby_wallet} )
  }
  results += "\n\nNFTs:\n"
  let nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress,
    limit: 400
  })

  results += JSON.stringify(nfts,null,2)
  while (nfts.result.marker)
  {
		nfts = await client.request({
			method: "account_nfts",
			account: standby_wallet.classicAddress,
			limit: 400,
			marker: nfts.result.marker
		})
    results += '\n' + JSON.stringify(nfts,null,2)
  }

	results += '\n\nTransaction result: '+ tx.result.meta.TransactionResult
	results += '\n\nnftokens: ' + JSON.stringify(nfts, null, 2)
	document.getElementById('standbyBalanceField').value = 
		(await client.getXrpBalance(standby_wallet.address))
	document.getElementById('standbyResultField').value = results
  client.disconnect()
} // End of batchMint()


