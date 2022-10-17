---
html: batch-minting.html
parent: xrpl-quickstart.html
blurb: Broker a sale between a sell offer and a buy offer.
labels:
  - Accounts
  - Quickstart
  - Broker
  - XRP
---

# Batch Mint NFTokens

You can create an application that mints multiple NFTokens at one time. You can use a `for` loop to send one transaction after another.

A best practice is to use `Tickets` to reserve the transaction sequence numbers. If you create an application that creates NFTokens without using tickets, if any transaction fails for any reason, the application stops with an error. If you use tickets, the application continues to send transactions, and you can look into the reason for the failure afterward.

## Usage

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/js/quickstart.zip){.github-code-download} archive to try the sample in your own browser.

## Get an Account

1. Open `7.batch-minting.html` in a browser.
2. Get a test account.
    1. If you want to use an existing NFT-Devnet account seed:
        1. Paste the account seed in the **Seed** field.
        2. Click **Get Account from Seed**.
    2. If you do not want to use an existing NFT-Devnet account seed, click **Get New Standby Account**.

**Note:** Running this command throws an error in the JavaScript console because the `getAccountsFromSeeds` function in `ripplex1-send-xrp.js` looks for the operational seed field, which is not included in this form. You can ignore the error (or fix it in your own implementation).

## Batch Mint NFTokens

This example lets you mint multiple NFTokens for a single unique item. The NFToken might represent "prints" of an original artwork, tickets to an event, or another limited set of unique items. 

To batch mint a non-fungible token objects:

1. Set the **Flags** field. For testing purposes, we recommend setting the value to _8_. This sets the _tsTransferable_ flag, meaning that the NFToken object can be transferred to another account. Otherwise, the NFToken object can only be transferred back to the issuing account. See [NFTokenMint](nftokenmint.html) for information about all of the available flags for minting NFTokens.
2. Enter the **Token URL**. This is a URI that points to the data or metadata associated with the NFToken object. You can use the sample URI provided if you do not have one of your own.
3. Enter a **Token Count** of up to 200 NFTokens to create in one batch.
4. Enter the **Transfer Fee**, a percentage of the proceeds from future sales of the NFToken that will be returned to the original creator. This is a value of 0-50000 inclusive, allowing transfer rates between 0.000% and 50.000% in increments of 0.001%. If you do not set the **Flags** field to allow the NFToken to be transferrable, set this field to 0.
5. Click **Batch Mint**.

## Get Batch NFTokens

Click **Get Batch NFTokens** to get the current list of NFTokens for your account.

The difference between this function and the getTokens() function used earlier is that it allows for larger lists of tokens, and sends multiple requests if the tokens exceed the number of objects allowed in a single request.

# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/js/quickstart.zip){.github-code-download} archive to try each of the samples in your own browser.

## Get Account From Seed

This is a stripped-down version of `getAccountsFromSeeds()` that only gets the Standby account information.

```javascript
async function getAccountFromSeed() {
```

 Connect to the XRP Ledger.

```javascript
	let net = getNet()
	const client = new xrpl.Client(net)
	results = 'Connecting to ' + getNet() + '....'
	document.getElementById('standbyResultField').value = results
	await client.connect()
	results += '\nConnected, finding wallets.\n'
	document.getElementById('standbyResultField').value = results
```

Use the account seed to get information about the wallet.

```javascript
  var theSeed = document.getElementById('seeds').value
	const standby_wallet = xrpl.Wallet.fromSeed(theSeed)
```

Get the current XRP balance.

```javascript	
  const standby_balance = (await client.getXrpBalance(standby_wallet.address))  
```	

Populate the fields for Standby account.

```javascript
	document.getElementById('standbyAccountField').value = standby_wallet.address
	document.getElementById('standbyPubKeyField').value = standby_wallet.publicKey
	document.getElementById('standbyPrivKeyField').value = standby_wallet.privateKey
	document.getElementById('standbySeedField').value = standby_wallet.seed
	document.getElementById('standbyBalanceField').value = 
		(await client.getXrpBalance(standby_wallet.address))
```

Disconnect from the XRP Ledger.

```javascript
 client.disconnect()	
} 
```

## Get Batch NFTokens

This version of `getTokens()` allows for a larger set of NFTokens by watching for a `marker` at the end of each batch of NFTokens.

```javascript
async function getBatchNFTokens() {
```

Connect to the XRPLedger and get the account wallet.

```javascript
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...'
  document.getElementById('standbyResultField').value = results
  await client.connect()
  results += '\nConnected. Getting NFTokens...'
  document.getElementById('standbyResultField').value = results
```

Request the `account_nfts`. Set the `limit` to 400, the maximum amount, to retrieve up to 400 records in one batch.

```javascript
  results += "\n\nNFTs:\n"
  let nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress,
    limit: 400
  })
  results += JSON.stringify(nfts,null,2)
```

If the list of `NFTokens` exceeds your limit, the result includes a `marker` field that you can use as a parameter for the next `account_nfts` request. The `marker` indicates where the next batch of records starts. While the `marker` field is present, continue to request another batch of NFToken records.

```javascript
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
```

Report the final results.

```javascript
  document.getElementById('standbyResultField').value = results
```

Disconnect from the XRP Ledger.

```javascript
  client.disconnect()
} //End of getBatchTokens()
```

## Batch Mint

This script mints multiple copies of the same NFToken. 

```javascript
async function batchMint() {
```

Connect to the XRP Ledger and get the account wallet.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  document.getElementById('standbyResultField').value = results
  await client.connect() 
  results += '\nConnected, finding wallet.'
  document.getElementById('standbyResultField').value = results
  standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  document.getElementById('standbyResultField').value = results
```

Get the account information, particularly the `Sequence` number.

```javascript
  const account_info = await client.request({
    "command": "account_info",
    "account": standby_wallet.address
  })

  my_sequence = account_info.result.account_data.Sequence
  results += "\n\nSequence Number: " + my_sequence + "\n\n"
  document.getElementById('standbyResultField').value = results
```

Next, create ticket numbers for the batch. Without tickets, if one transaction fails, all others in the batch fail. With tickets, there can be failures, but the rest will continue, and you can investigate any problems afterward.

Parse the NFToken Count field value to an integer.

```javascript
  const nftokenCount = parseInt(standbyNFTokenCountField.value)
```

Create the `TicketCreate` transaction hash, automatically filling default values. Provide the `Sequence` number to indicate a starting point for the XRP Ledger.

```javascript
  const ticketTransaction = await client.autofill({
    "TransactionType": "TicketCreate",
    "Account": standby_wallet.address,
    "TicketCount": nftokenCount,
    "Sequence": my_sequence
  })
```

Sign and submit the transaction.

```javascript
   const signedTransaction = standby_wallet.sign(ticketTransaction)
   const tx = await client.submitAndWait(signedTransaction.tx_blob)
```

Send the request and wait for the result.

```javascript
  let response = await client.request({
    "command": "account_objects",
    "account": standby_wallet.address,
    "type": "ticket"
  })
```  

Populate the `tickets` array variable.

```javascript
  let tickets = []

  for (let i=0; i < nftokenCount; i++) {
    tickets[i] = response.result.account_objects[i].TicketSequence
  }
```

Report the function progress.

```javascript
  results += "Tickets generated, minting NFTokens.\n\n"
  document.getElementById('standbyResultField').value = results
```

Use a `for` loop to create the NFTokens one at a time, up to the NFTokenCount you specified.

```javascript
  for (let i=0; i < nftokenCount; i++) {
		const transactionBlob = {
			"TransactionType": "NFTokenMint",
			"Account": standby_wallet.classicAddress,
			"URI": xrpl.convertStringToHex(standbyTokenUrlField.value),
			"Flags": parseInt(standbyFlagsField.value),
			"TransferFee": parseInt(standbyTransferFeeField.value),
			"Sequence": 0,
```

Use the loop variable to step through the array. Set the `LastLedgerSequence` to `null`.

```javascript
			"TicketSequence": tickets[i],
			"LastLedgerSequence": null,
			"NFTokenTaxon": 0 
		}
```

Submit the signed transaction hash.

```javascript
		const tx =  client.submit(transactionBlob, { wallet: standby_wallet} )
  }
```

Use the same logic as `getBatchNFTokens`, above, to get the list of current NFTokens.
  
```javascript
  results += "\n\nNFTs:\n"
  let nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress,
    limit: 400
  })

  results += JSON.stringify(nfts,null,2)
  while (nfts.result.marker != null)
  {
		nfts = await client.request({
			method: "account_nfts",
			account: standby_wallet.classicAddress,
			limit: 400,
			marker: nfts.result.marker
		})
    results += '\n' + JSON.stringify(nfts,null,2)
  }
```

Report the results.

```javascript
	results += '\n\nTransaction result: '+ tx.result.meta.TransactionResult
	results += '\n\nnftokens: ' + JSON.stringify(nfts, null, 2)
	document.getElementById('standbyBalanceField').value = 
		(await client.getXrpBalance(standby_wallet.address))
	document.getElementById('standbyResultField').value = results
```

Disconnect from the XRP Ledger.

```javascript
  client.disconnect()
} // End of batchMint()
```

## 7.batch-minting.html

For this form:
* The unnecessary script references are removed. 
* The unused fields and buttons are removed.
* The `standbyResultField` capacity is set to the maximum value, 524288.

```html
<html>
  <head>
    <title>Token Test Harness</title>
    <link href='https://fonts.googleapis.com/css?family=Work Sans' rel='stylesheet'>
    <style>
       body{font-family: "Work Sans", sans-serif;padding: 20px;background: #fafafa;}
       h1{font-weight: bold;}
       input, button {padding: 6px;margin-bottom: 8px;}
       button{font-weight: bold;font-family: "Work Sans", sans-serif;}
       td{vertical-align: middle;}
    </style>
    <script src='https://unpkg.com/xrpl@2.2.3'></script>
    <script src='ripplex1-send-xrp.js'></script>
    <script src='ripplex3-mint-nfts.js'></script>
    <script src='ripplex7-batch-minting.js'></script>
    <script>
      if (typeof module !== "undefined") {
        const xrpl = require('xrpl')
      }
     
    </script>
  </head>
  
<!-- ************************************************************** -->
<!-- ********************** The Form ****************************** -->
<!-- ************************************************************** -->

  <body>
    <h1>Token Test Harness</h1>
    <form id="theForm">
      Choose your ledger instance:  
      <input type="radio" id="xls" name="server"
        value="wss://xls20-sandbox.rippletest.net:51233" checked>
      <label for="xls20">XLS20-NFT</label>
      &nbsp;&nbsp;
      <input type="radio" id="tn" name="server"
        value="wss://s.altnet.rippletest.net:51233">
      <label for="testnet">Testnet</label>
      &nbsp;&nbsp;
      <input type="radio" id="dn" name="server"
        value="wss://s.devnet.rippletest.net:51233">
      <label for="devnet">Devnet</label>
      <br/><br/>
      <button type="button" onClick="getAccountFromSeed()">Get Account From Seed</button>
      <br/>
      <textarea id="seeds" cols="40" rows= "1" maxlength="524,288"></textarea>
      <br/><br/>
			<table>
				<tr valign="top">
					<td>
						<button type="button" onClick="getAccount('standby')">Get New Standby Account</button>
						<table>
							<tr valign="top">
								<td align="right">
									Standby Account
								</td>
								<td>
									<input type="text" id="standbyAccountField" size="40"></input>
									<br>
								</td>
							</tr>
							<tr>
								<td align="right">
									Public Key
								</td>
								<td>
									<input type="text" id="standbyPubKeyField" size="40"></input>
									<br>
								</td>
							</tr>
							<tr>
								<td align="right">
									Private Key
								</td>
								<td>
									<input type="text" id="standbyPrivKeyField" size="40"></input>
									<br>
								</td>
							</tr>
							<tr>
								<td align="right">
									Seed
								</td>
								<td>
									<input type="text" id="standbySeedField" size="40"></input>
									<br>
								</td>
							</tr>
							<tr>
								<td align="right">
									XRP Balance
								</td>
								<td>
									<input type="text" id="standbyBalanceField" size="40"></input>
									<br>
								</td>
							</tr>
							<tr valign="top">
								<td><button type="button" onClick="configureAccount('standby',document.querySelector('#standbyDefault').checked)">Configure Account</button></td>
								<td>
									<input type="checkbox" id="standbyDefault" checked="true"/>
									<label for="standbyDefault">Allow Rippling</label>
								</td>
							</tr>
							<tr>
								<td align="right">
									Currency
								</td>
								<td>
									<input type="text" id="standbyCurrencyField" size="40" value="USD"></input>
								</td>
							</tr>
							<tr>
								<td align="right">NFToken URL</td>
								<td><input type="text" id="standbyTokenUrlField"
									value = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi" size="80"/>
								</td>
							</tr>
							<tr>
								<td align="right">Flags</td>
								<td><input type="text" id="standbyFlagsField" value="8" size="10"/></td>
							</tr>
							<tr>
								<td align="right">NFToken ID</td>
								<td><input type="text" id="standbyTokenIdField" value="" size="80"/></td>
							</tr>
							<tr>
								<td align="right">
									NFToken Count
								</td>
								<td>
									<input type="text" id="standbyNFTokenCountField" size="40"></input>
									<br>
								</td>
							</tr>
							<tr>
								<td align="right">Transfer Fee</td>
								<td><input type="text" id="standbyTransferFeeField" value="" size="80"/></td>
							</tr>
							</td>
							</tr>
							</table>
							</td>
							<td align="left" valign="top">
									<button type="button" onClick="batchMint()">Batch Mint</button>
									<br/>
									<button type="button" onClick="getBatchNFTokens()">Get Batch NFTokens</button>
									<br/>
									<p align="left">
									<textarea id="standbyResultField" cols="80" rows="20" maxlength="524288"></textarea>
									</p>
								</td>
							</tr>
						</table>
    </form>
  </body>
</html>
```

| Previous      | Next                                                             |
| :---          |                                                             ---: |
| [← Authorize Minter >](authorize-minter.html)  |  |

