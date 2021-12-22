---
html: nftoken-tester-tutorial.html
parent: use-nfts.html
blurb: Use a JavaScript test harness to mint, trade, and destroy NFTs.
filters:
 - include_code
labels:
  - Non-fungible Tokens, NFTs
status: not_enabled
---
# NFToken Tester Tutorial

{% include '_snippets/nfts-disclaimer.md' %}

This example builds a JavaScript test harness where you can create NFTokens and associated transactions. Each button triggers a frequently used request or transaction used to manage `NFTokens`. The fields provided let you enter required parameters.


[![NFTokenTester Tutorial Window](img/nftokentester1.png)](img/nftokentester1.png)

# Prerequisites

To mint a token, you need to generate Account and Secret credentials. Go to [https://xrpl.org/xrp-testnet-faucet.html](https://xrpl.org/xrp-testnet-faucet.html) and click **Generate Devnet credentials**. You can also obtain a second set of account credentials to try creating and accepting buy and sell offers.

You will need a URL to the token data you want to turn into a `NFToken`. You can use your own object or this example IPFS address for testing.


```
ipfs://QmQjDvDhfHcMyUgDAxKig4AoMTtS5JrsfpiEEpFa3F9QRt
```


Open `NFTokenTester.htm` in a web browser, and display the JavaScript console. For example, in Google Chrome choose **View>Developer>JavaScript Console**.

You can find the full code for the `NFTokenTester.htm` <a href="https://raw.githubusercontent.com/XRPLF/xrpl-dev-portal/master/content/tutorials/use-nfts/NFTokenTester.htm">here</a>. The walkthrough below describes key sections in the code. The functions share much of the same code, with the only changes in the body of the transaction arguments themselves.


## The `NFTokenMint` Transaction

The best place to begin is by creating your own `NFToken`.

To create an `NFToken`:



1. In the appropriate fields, enter your **Account** and **Secret** credentials.
2. Enter the URL to your NFT data.
3. If you want the NFT to be transferable, enter **8** in the **Flag** field. Otherwise, it can be transferred only one time to another account.
4.  Click **Mint Token**.
5. Wait about 5 - 6 seconds for the response. Expand the response by clicking the arrows on the left of each subordinate entry to see the record of your new NFToken.

[![NFTokenTester Tutorial Results](img/nftokentester2.png)](img/nftokentester2.png)

### The `mintToken()`Function

The `mintToken()`function creates a `NFToken` object on your account’s `NFTokenPage` ledger structure. The steps are:



1. Connect an account to the XRP ledger.
2. Create a `NFTokenMint` transaction.
3. Submit the transaction to the ledger.
4. List the NFTs associated with your account.
5. Request transaction details and updates to your account.
6. Disconnect from the server.


```
//***************************
//** Mint Token *************
//***************************

```



1. Create a wallet and client, then connect to the developer network.


```
async function mintToken() {
	const wallet = xrpl.Wallet.fromSeed(secret.value)
	const client = new
         xrpl.Client("wss://devnet.xrpl.org/:51233")
	await client.connect()
	console.log("Connected to devnet")

```



2. Create a `NFTokenMint` transaction using your account address and the `URI` to your token data. Note that you must convert the token `URI` to a hexadecimal value for this transaction. The `TokenTaxon` is a required field, but if you are not using the value as a custom indexing field, you can set it to 0.


```
	const transactionBlob = {
		TransactionType: "NFTokenMint",
		Account: wallet.classicAddress,
		URI: xrpl.convertStringToHex(tokenUrl.value),
		Flags: parseInt(flags.value),
		TokenTaxon: 0
	}

```



3. Submit the signed transaction blob and wait for the response.


```
	const tx = await client.submitAndWait(transactionBlob,{wallet})

```



4.  Send an `account_nfts` request to list all `NFTokens` for your account.


```
	const nfts = await client.request({
		method: "account_nfts",
		account: wallet.classicAddress  
	})
	console.log(nfts)

```



5. Request the transaction results and updates to the account balance.


```
	console.log("Transaction result:", tx.result.meta.TransactionResult)
	console.log("Balance changes:",
	  JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

```



6. `Disconnect`


```
	client.disconnect()
} //End of mintToken
```



## The `account_nfts` Request

Use the `account_nfts` request to list the `NFTokens` on your account’s `NFTokenPage`.

To request a list of NFTokens for your account:



1. In the appropriate fields, enter your **Account** and **Secret** credentials.
2. Click **Get Tokens**.
3. Expand the results in your console log.


### The `getTokens()`Function

The `getTokens` function steps are:



1. Connect to the devnet server.
2. Send an `account_nfts` request.
3. Display the results in your console log.
4. Disconnect from the server.


```
//***************************
//** Get Tokens *************
//***************************

```



1. Connect to the devnet server.


```
async function getTokens() {
	const wallet = xrpl.Wallet.fromSeed(secret.value)
	const client = new xrpl.Client("wss://devnet.xrpl.org/:51233")
	await client.connect()
	console.log("Connected to devnet")

```



2. Request `account_nfts` for your wallet account.


```
	const nfts = await client.request({
		method: "account_nfts",
		account: wallet.classicAddress  
	})

```



3. Display the results in your console log.


```
	console.log(nfts)

```



4. Disconnect from the server.


```
	client.disconnect()
} //End of getTokens
```



## The `NFTokenBurn` Transaction

Use `NFTokenBurn` to permanently destroy a `NFToken`. In practice, the `NFToken` is transferred to an account that is inaccessible, rendering it irretrievable.

To destroy a `NFToken`:



1. Enter your **Account** and **Secret** in the appropriate fields.
2. Enter the **Token ID** of the `NFToken` you want to destroy.
3. Click **Burn Token**.


### The `burnToken()` function

The `getTokens` function steps are:



1. Connect to the devnet server.
2. Prepare a transaction blob.
3. Submit the transaction and wait for the results.
4. Request a refreshed list of current `NFTokens`.
5. Display the results in your console log.
6. Disconnect from the server.


```
//***************************
//** Burn Token *************
//***************************

```



1. Connect to the devnet server


```
async function burnToken() {
  const wallet = xrpl.Wallet.fromSeed(secret.value)
  const client = new xrpl.Client("wss://devnet.xrpl.org/:51233")
  await client.connect()
  console.log("Connected to devnet")

```



2. Prepare the `NFTokenBurn` transaction.


```
  const transactionBlob = {
      "TransactionType": "NFTokenBurn",
      "Account": wallet.classicAddress,
      "TokenID": tokenId.value
  }

```



3. Submit the transaction and wait for the results.


```
  const tx = await client.submitAndWait(transactionBlob,{wallet})

```



4. Request a refreshed list of the current `NFTokens`, if any.


```
  const nfts = await client.request({
	method: "account_nfts",
	account: wallet.classicAddress  
  })

```



5. Display the results in your console log.


```
  console.log(nfts)
  console.log("Transaction result:", tx.result.meta.TransactionResult)
  console.log("Balance changes:",
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

```



6. Disconnect from the server.


```
  client.disconnect()
}
// End of burnToken()
```



## The `NFTokenCreateOffer` Transaction

You use `NFTokenCreateOffer` to offer `NFTokens` for sale or to propose a purchase of a `NFToken` from another account. The same transaction is used for the `createSellOffer` and `createBuyOffer` functions.


### The `createSellOffer()` function

The `createSellOffer`() function adds an item to the ledger placing a `NFToken` from your account up for sale. Other accounts can discover the offer and choose to accept the  transaction to purchase your item.

To create an offer to sell a `NFToken`:



1. Enter your **Account** and **Secret** in the appropriate fields.
2. Enter the **Token ID** of the NFToken you want to sell.
3. Set the **Flags** value to 1.
4. Enter the **Amount**, the sale price in drops (millionths of an xrp). For example, if you enter 1000000, the sale price is 1 xrp.
5. Click **Create Sell Offer**.
6. Expand the results in the console log to see your Sell Offer ledger entry.

The `createSellOffer()` function steps are:



1. Connect to the devnet server.
2. Prepare a transaction blob.
3. Submit the transaction and wait for the results.
4. Request lists of current Sell Offers and Buy Offers.
5. Display the results in your console log.
6. Disconnect from the server.


```
//********************************
//** Create Sell Offer ***********
//********************************

```



1. Connect to the devnet server.


```
async function createSellOffer() {
	const wallet = xrpl.Wallet.fromSeed(secret.value)
	const client = new xrpl.Client("wss://devnet.xrpl.org/:51233")
	await client.connect()
	console.log("Connected to devnet")

```



2. Prepare a transaction blob.


```
  const transactionBlob = {
      	"TransactionType": "NFTokenCreateOffer",
      	"Account": wallet.classicAddress,
      	"TokenID": tokenId.value,
      	"Amount": amount.value,
      	"Flags": 1 //parseInt(flags.value)
  }

```



3. Submit the transaction and wait for the results.


```


  const tx = await client.submitAndWait(transactionBlob,{wallet})//AndWait

```



4. Request lists of current Sell Offers and Buy Offers. Note that these requests must go in `Try/Catch` blocks: otherwise, If either the Buy offers or Sell offers are empty for the `NFToken`, the script fails with an error.


```
  console.log("***Sell Offers***")
  let nftSellOffers
    try {
	    nftSellOffers = await client.request({
		method: "nft_sell_offers",
		tokenid: tokenId.value  
	  })
	  } catch (err) {
	    console.log("No sell offers.")
	}
  console.log(JSON.stringify(nftSellOffers,null,2))
  console.log("***Buy Offers***")
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
	method: "nft_buy_offers",
	tokenid: tokenId.value })
  } catch (err) {
    console.log("No buy offers.")
  }
  console.log(JSON.stringify(nftBuyOffers,null,2))

```



5. Display the results in your console log.


```
  console.log("Transaction result:",
    JSON.stringify(tx.result.meta.TransactionResult, null, 2))
  console.log("Balance changes:",
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

```



6. Disconnect from the server.


```
  client.disconnect()
  // End of createSellOffer()
}
```



### The `createBuyOffer()` function

The `createBuyOffer() `function adds an item to the ledger where your account requests to purchase a `NFToken` for a proposed price. The owner of the `NFToken` can review your proposal and choose to accept it, completing the transaction.

To create an offer to buy a `NFToken`:



1. Enter your **Account** and **Secret** in the appropriate fields.
2. Set the **Flags** value to `0`.
3. Enter the **Token ID** of the `NFToken` you want to purchase.
4. Enter your proposed purchase **Amount** in drops (millionths of an xrp).
5. Enter the **Owner** account address.
6. Click **Create Buy Offer**.
7. Expand the results in the console log to see your Buy Offer ledger entry.

The `createBuyOffer()` function steps are:



1. Connect to the devnet server.
2. Prepare a transaction blob.
3. Submit the transaction and wait for the results.
4. Request lists of current Sell Offers and Buy Offers.
5. Display the results in your console log.
6. Disconnect from the server.


```
//********************************
//** Create Buy Offer ***********
//********************************

```



1. Connect to the devnet server.


```
async function createBuyOffer() {

	const wallet = xrpl.Wallet.fromSeed(secret.value)
	const client = new xrpl.Client("wss://devnet.xrpl.org/:51233")
	await client.connect()
	console.log("Connected to devnet")

```



2. Prepare a transaction blob.


```
  const transactionBlob = {
      	"TransactionType": "NFTokenCreateOffer",
      	"Account": wallet.classicAddress,
      	"Owner": owner.value,
      	"TokenID": tokenId.value,
      	"Amount": amount.value,
      	"Flags": 0 //parseInt(flags.value)
  }

```



3. Submit the transaction and wait for the results.


```
  const tx = await client.submit(transactionBlob,{wallet})//AndWait

```



4. Request lists of current Sell Offers and Buy Offers.


```
  console.log("***Sell Offers***")
  let nftSellOffers
    try {
	    nftSellOffers = await client.request({
		method: "nft_sell_offers",
		tokenid: tokenId.value  
	  })
	  } catch (err) {
	    console.log("No sell offers.")
	}
  console.log(JSON.stringify(nftSellOffers,null,2))
  console.log("***Buy Offers***")
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
	method: "nft_buy_offers",
	tokenid: tokenId.value })
  } catch (err) {
    console.log("No buy offers.")
  }
  console.log(JSON.stringify(nftBuyOffers,null,2))

```



5. Display the results in your console log.


```
  console.log("Transaction result:",
    JSON.stringify(tx.result.meta.TransactionResult, null, 2))
  console.log("Balance changes:",
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

```



6. Disconnect from the server.


```
  client.disconnect()
  // End of createBuyOffer()
}
```



## The `nft_sell_offers` and `nft_buy_offers` Requests

Use the `nft_sell_offers` and `nft_buy_offers` requests to get the current lists of offers associated with a NFToken.

To create an offer to buy a `NFToken`:



1. Enter your **Account** and **Secret** in the appropriate fields.
2. Enter the **Token ID** of the `NFToken` you want to list.
3. Click **Get Offers**.

The `getOffers()` function steps are:



1. Connect to the devnet server.
2. Request `nft_sell_offers` and `nft_buy_offers` for your wallet account and send the results to your console log.
3. Disconnect from the server.


```
//***************************
//** Get Offers *************
//***************************

async function getOffers() {

```



1. Enter your **Account** and **Secret** in the appropriate fields.


```
    const wallet = xrpl.Wallet.fromSeed(secret.value)
    const client = new xrpl.Client("wss://devnet.xrpl.org/:51233")
    await client.connect()
    console.log("Connected to devnet")

```



2. Request `nft_sell_offers` and `nft_buy_offers` for your wallet account and send the results to your console log.


```
    console.log("***Sell Offers***")
    let nftSellOffers
      try {
	  nftSellOffers = await client.request({
	    method: "nft_sell_offers",
	    tokenid: tokenId.value  
	  })
	} catch (err) {
	  console.log("No sell offers.")
	}
    console.log(JSON.stringify(nftSellOffers,null,2))
    console.log("***Buy Offers***")
    let nftBuyOffers
    try {
      nftBuyOffers = await client.request({
  	  method: "nft_buy_offers",
	  tokenid: tokenId.value
      })
    } catch (err) {
      console.log("No buy offers.")
    }
    console.log(JSON.stringify(nftBuyOffers,null,2))

```



3. Disconnect from the server.


```
    client.disconnect()
  // End of getOffers()
}
```



## The `NFTokenCancelOffer` Transaction

Use the `NFTokenCancelOffer` transaction to remove an offer from the ledger.

To cancel an offer to sell or buy a `NFToken`:



1. Enter your **Account** and **Secret** in the appropriate fields.
2. Enter the **Token Offer Index** of the offer you want to accept. (Labeled as **Index** in the responses to `nft_buy_offers `and` nft_sell_offers` requests.)
3. Click **Cancel Offer**.


### The `cancelOffer()` Function

The `cancelOffer()` function steps are:



1. Connect to the devnet server.
2. Prepare a transaction blob.
3. Submit the transaction and wait for the results.
4. Request lists of current Sell Offers and Buy Offers.
5. Display the results in your console log.
6. Disconnect from the server.


```
//***************************
//** Cancel Offer ***********
//***************************

```



1. Connect to the devnet server.


```
async function cancelOffer() {
	const wallet = xrpl.Wallet.fromSeed(secret.value)
	const client = new xrpl.Client("wss://devnet.xrpl.org/:51233")
	await client.connect()
	console.log("Connected to devnet")

```



2. Prepare a transaction blob. The tokenID argument requires an array rather than a single string.


```
	const tokenID = offerTokenId.value
	const tokenIDs = [tokenID]

      const transactionBlob = {
      	  "TransactionType": "NFTokenCancelOffer",
         "Account": wallet.classicAddress,
         "TokenIDs": tokenIDs
      }

```



3. Submit the transaction and wait for the results.


```
  const tx = await client.submitAndWait(transactionBlob,{wallet})

```



4. Request lists of current Sell Offers and Buy Offers.


```


  console.log("***Sell Offers***")
  let nftSellOffers
    try {
	    nftSellOffers = await client.request({
		method: "nft_sell_offers",
		tokenid: tokenId.value  
	  })
	  } catch (err) {
	    console.log("No sell offers.")
	}
  console.log(JSON.stringify(nftSellOffers,null,2))
  console.log("***Buy Offers***")
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
	method: "nft_buy_offers",
	tokenid: tokenId.value })
  } catch (err) {
    console.log("No buy offers.")
  }

```



5. Display the results in your console log.


```
  console.log(JSON.stringify(nftBuyOffers,null,2))
  console.log("Transaction result:",
    JSON.stringify(tx.result.meta.TransactionResult, null, 2))
  console.log("Balance changes:",
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

```



6. Disconnect from the server.


```
  client.disconnect()
  // End of cancelOffer()
}
```



## The `NFTokenAcceptOffer` Transaction

Use the NFTokenAcceptOffer transaction to accept buy or sell offers from other accounts.


### The acceptSellOffer() Function

Another account on your ledger can create an offer to sell a NFToken. If you agree with the price, you can purchase the NFToken by accepting the sell offer. The transaction completes immediately, debiting your XRP account and crediting the seller account.

To accept a sell offer:



1. Enter your **Account** and **Secret** in the appropriate fields.
2. Enter the **Token Offer Index** of the offer you want to cancel. (Labeled as **Index** in the responses to `nft_sell_offers` requests.)
3. Click **Accept Sell Offer**.

The `acceptSellOffer()` function steps are:



1. Connect to the devnet server.
2. Prepare a transaction blob.
3. Submit the transaction and wait for the results.
4. Display the results in your console log.
5. Disconnect from the server.


```
//***************************
//** Accept Sell Offer ******
//***************************

```



1. Connect to the devnet server.


```
async function acceptSellOffer() {

	const wallet = xrpl.Wallet.fromSeed(secret.value)
	const client = new xrpl.Client("wss://devnet.xrpl.org/:51233")
	await client.connect()
	console.log("Connected to devnet")

```



2. Prepare a transaction blob.


```
  const transactionBlob = {
      	"TransactionType": "NFTokenAcceptOffer",
      	"Account": wallet.classicAddress,
      	"SellOffer": tokenOfferIndex.value,
  }

```



3. Submit the transaction and wait for the results.


```
  const tx = await client.submitAndWait(transactionBlob,{wallet})

```



4. Display the results in your console log.


```
  const nfts = await client.request({
	method: "account_nfts",
	account: wallet.classicAddress  
  })
  console.log(JSON.stringify(nfts,null,2))
  console.log("Transaction result:",
    JSON.stringify(tx.result.meta.TransactionResult, null, 2))
  console.log("Balance changes:",
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

```



6. Disconnect from the server.


```
  client.disconnect()
  // End of acceptSellOffer()
}
```



### The `acceptBuyOffer()` Function

Another account holder can create a buy offer for one of your NFTokens. If you agree with the purchase price offered, you can use the `acceptBuyOffer()` function to complete the transaction.  

To accept a buy offer:



1. Enter your **Account** and **Secret** in the appropriate fields.
2. Enter the **Token Offer Index** of the offer you want to accept. (Labeled as **Index** in the responses to `nft_sell_offers` requests.)
3. Click **Accept Buy Offer**.

The `acceptBuyOffer()` function steps are:



1. Connect to the devnet server.
2. Prepare a transaction blob.
3. Submit the transaction and wait for the results.
4. Display the results in your console log.
5. Disconnect from the server.


```
//***************************
//** Accept Buy Offer ******
//***************************

async function acceptBuyOffer() {

```



1. Connect to the devnet server.


```
  const wallet = xrpl.Wallet.fromSeed(secret.value)
  const client = new xrpl.Client("wss://devnet.xrpl.org/:51233")
  await client.connect()
  console.log("Connected to devnet")

```



2. Prepare a transaction blob.


```
  const transactionBlob = {
      	"TransactionType": "NFTokenAcceptOffer",
      	"Account": wallet.classicAddress,
      	"BuyOffer": tokenOfferIndex.value
  }

```



3. Submit the transaction and wait for the results.


```
  const tx = await client.submitAndWait(transactionBlob,{wallet})

```



4. Display the results in your console log.


```
  const nfts = await client.request({
	method: "account_nfts",
	account: wallet.classicAddress  
  })
  console.log(JSON.stringify(nfts,null,2))
  console.log("Transaction result:",
      JSON.stringify(tx.result.meta.TransactionResult, null, 2))
  console.log("Balance changes:",
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

```



5. Disconnect from the server.


```
  client.disconnect()
  // End of submitTransaction()
}
</script>
```



## The NFToken Tester HTML Form

The remainder of the test harness file creates a standard HTML form with 9 buttons to initiate the form functions and 8 fields to hold the required parameters.


```
<title>NFToken Tester</title>
</head>
<body>
<h1>NFToken Tester</h1>
<form id="theForm">
<p>
<button type="button" onClick="mintToken()">Mint Token</button>&nbsp;&nbsp;
<button type="button" onClick="getTokens()">Get Tokens</button>&nbsp;&nbsp;
<button type="button" onClick="burnToken()">Burn Token</button>&nbsp;&nbsp;
</p>
<p>
<button type="button" onClick="createSellOffer()">Create Sell Offer</button>&nbsp;&nbsp;
<button type="button" onClick="createBuyOffer()">Create Buy Offer</button>&nbsp;&nbsp;
<button type="button" onClick="getOffers()">Get Offers</button>
</p>
<p>
<button type="button" onClick="acceptSellOffer()">Accept Sell Offer</button>&nbsp;&nbsp;
<button type="button" onClick="acceptBuyOffer()">Accept Buy Offer</button>&nbsp;&nbsp;
<button type="button" onClick="cancelOffer()">Cancel Offer</button>&nbsp;&nbsp;
</p>
<table>
  <tr>
    <td align="right">Account</td>
    <td><input type="text" id="account" value="" size="40" /></td>
  </tr>
  <tr>
    <td align="right">Secret</td>
    <td><input type="text" id="secret" value="" size="40" /></td>
  </tr>
  <tr>
    <td align="right">Token URL</td>
    <td><input type="text" id="tokenUrl"  
value = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi" size="80"/>
    </td>
  </tr>
  <tr>
    <td align="right">Flags</td>
    <td><input type="text" id="flags" value="1" size="10"/></td>
  </tr>
  <tr>
    <td align="right">Token ID</td>
    <td><input type="text" id="tokenId" value="" size="80"/></td>
  </tr>
  <tr>
    <td align="right">Amount</td>
    <td><input type="text" id="amount" value="1000000" size="20"/></td>
  </tr>
  <tr>
    <td align="right">Token Offer Index</td>
    <td><input type="text" id="tokenOfferIndex" value="" size="80"/></td>
  </tr>
  <tr>
    <td align="right">Owner</td>
    <td><input type="text" id="owner" value="" size="80"/></td>
  </tr>
</table>
</form>
</body>
</html>
```
