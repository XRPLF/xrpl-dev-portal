---
html: get-nftoken-list.html
parent: xrpl-quickstart.html
blurb: List extant tokens on the XRP Ledger, get their data from the Clio server.
labels:
  - NFTokens
  - Quickstart
---

# Get a List of NFTokens

You can list all of the tokens that currently exist from the XRP Ledger. The process involves repeatedly using the `ledger_data` request, filtering the NFToken page objects, then listing the array of NFToken objects stored on the page. This example demonstrates how to extract NFToken objects and NFTokenIDs, and how to get information for the listed NFTokens using the `nft_info` request to the Clio server.

## Usage

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/js/quickstart.zip){.github-code-download} archive to try the sample in your own browser.

### Get NFTokens

All transactions on the XRP Ledger are available for public review. You do not need an account or credentials to access information about minting and trading NFTokens.

To get a list of current NFTokens on the XRP Ledger, click **Get NFTokens**. The button retrieves 200 transactions (the maximum batch allowance), then filters to show only the information from NFToken pages. The row marker for the response is stored in the **Marker** field. Each new search starts at the marker to return a unique set of records for the next 200 transactions. Click **Get NFTokens** repeatedly to retrieve all of the NFTokens on the XRP Ledger.

### Get NFTokenIDs

Click **Get NFToken IDs** for a more finely grained search that returns only the NFTokenIDs from each batch of 200 transactions. Continue to click **Get NFToken IDs**  to retrieve all NFToken IDs on the XRP Ledger.


### Get Info

Having a list of NFTokens is all well and good, but it would be more interesting to do something with the NFTokenIDs returned. You can get information on the NFTokens in the response.

To review NFToken information for a selected NFTokenID:

1. Copy a NFTokenID from the list and paste it in the **NFTokenID** field.
2. Click **Get NFToken Info**.


# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/js/quickstart.zip){.github-code-download} archive to try each of the samples in your own browser.

## Get NFTokens

Declare variables used in the function.

```javascript
async function getNFTokens () {
	let jason
	let ledger_entry_type
	let nfTokens
	let nftoken_data
	let results = ""
	let stateTree
```

Connect to the XLS-20Devnet server.

```javascript
  const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233')
	await client.connect()
```

Check to see if the **Marker** field is populated with a 64 character value. If so, include the marker value in the `ledger_data` request. Set the limit of records to be returned to 200 transactions.

```javascript
  if (markerField.value.length == 64) {
		nftoken_data = await client.request({
			command: "ledger_data",
			id: "NFToken data request",
			limit: 200,
			marker: markerField.value
		})
```

Otherwise, send the `ledger_data` request without the marker field.

```javascript

  } else {
		nftoken_data = await client.request({
			command: "ledger_data",
			id: "NFToken data request",
			limit: 200
		}) 
  }
```

Turn the response into a JSON string.

```javascript
	jason =  JSON.stringify(nftoken_data.result, null, 2)
```

Parse the state tree from the JSON object.

```javascript
	stateTree = JSON.parse(jason).state
```

Inspect each ledger entry in the tree and capture any NFTokenPage objects.

```javascript
  for (i=0; i < 200; i++) {
		ledger_entry_type = stateTree[i].LedgerEntryType
		if (ledger_entry_type == "NFTokenPage") {
			nfTokens = stateTree[i].NFTokens
			for (j=0; j < nfTokens.length; j++) {
				results += JSON.stringify(nfTokens[j])
			}
		}
	}
```

Disconnect from the XLS-20Devnet.

```javascript
  client.disconnect()
```

Report the filtered NFToken objects in the resultField.

```javascript
  resultField.value = results
```

Save the marker value in the **Marker** field.

```javascript
	markerField.value = nftoken_data.result.marker
}
```

## Get NFTokenIDs

This function extends the `getNFTokens` function to further filter for just the NFTokenIDs.

Declare variables used in the function.

```javascript
async function getNFTokenIDs() {
	let jason
	let stateTree
	let ledger_entry_type
	let nfTokens
	let results = ""
	let nftoken_data
	let j_tokens
	let j_json
```

Connect to the XLS-20Devnet server.

```javascript
  const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233')
	await client.connect()
```

Check to see if the **Marker** field is populated with a 64 character value. If so, include the marker value in the `ledger_data` request. Set the limit of records to be returned to 200 transactions.

```javascript
  if (markerField.value.length == 64) {
		nftoken_data = await client.request({
			command: "ledger_data",
			id: "NFToken data request",
			limit: 200,
			marker: markerField.value
		})
```

Otherwise, send the `ledger_data` request without the marker field.

```javascript
  } else {
		nftoken_data = await client.request({
			command: "ledger_data",
			id: "NFToken data request",
			limit: 200
		}) 
  }
```

Turn the response into a JSON string.

```javascript
	jason =  JSON.stringify(nftoken_data.result, null, 2)
```

Parse the state tree from the JSON object.

```javascript
	stateTree = JSON.parse(jason).state
```
Scan the state tree for each instance of a NFTokenPage.

```javascript
  for (i=0; i < 200; i++) {
		ledger_entry_type = stateTree[i].LedgerEntryType
		if (ledger_entry_type == "NFTokenPage") {
```

Get the NFTokens from each NFToken page.

```javascript
			nfTokens = stateTree[i].NFTokens
```

Cycle through the NFTokens on the page. Parse the NFToken ID from each and append it to the `results` variable.

```javascript
			for (j=0; j < nfTokens.length; j++) {
				j_tokens = JSON.stringify(nfTokens[j])
 				j_json = JSON.parse(j_tokens) 
 				results += j_json.NFToken.NFTokenID + "\n"
			}
		}
	}
```

Disconnect from the XLS-20Devnet server.

```javascript
  client.disconnect()
```

Report the results in the `resultField`.

```javascript
	resultField.value = results
```

Update the **Marker** field with the next marker value.

```javascript
	markerField.value = nftoken_data.result.marker
}
```

## Get NFToken Info

Get the information about a single `NFToken` object based on its `NFTokenID`.

Declare the variables used in the function.

```javascript
async function getNFTokenInfo() {
  let nftoken_info
  let the_result
```

Connect to the Clio server.

```javascript
  const client = new xrpl.Client("wss://clionft.devnet.rippletest.net:51233")
  await client.connect()
```

Send the `nftoken_info` request and wait for the response.

```javascript
	nftoken_info = await client.request({
	  "command": "nft_info",
	  "nft_id": NFTokenIDField.value
	})
```

Turn the result of the request into a JSON string object.

```javascript
	the_result = JSON.stringify(nftoken_info)
```

Parse and format the `NFToken` information in the `infoField` text area.

```javascript
  client.disconnect()
	infoField.value += "NFToken ID........"   + JSON.parse(the_result).result.nft_id
	infoField.value += "\nIssuer............" + JSON.parse(the_result).result.issuer
  infoField.value += "\nOwner............." + JSON.parse(the_result).result.owner
	infoField.value += "\nFlags............." + JSON.parse(the_result).result.flags
	infoField.value += "\nIs Burned........." + JSON.parse(the_result).result.is_burned
	infoField.value += "\nLedger Index......" + JSON.parse(the_result).result.ledger_index
  infoField.value += "\nNFToken Sequence.." + JSON.parse(the_result).result.nft_sequence
  infoField.value += "\nNFToken Taxon....." + JSON.parse(the_result).result.nft_taxon
  infoField.value += "\nTransfer Fee......" + JSON.parse(the_result).result.transfer_fee
  infoField.value += "\nURI..............." + JSON.parse(the_result).result.uri
  infoField.value += "\nValidated........." + JSON.parse(the_result).result.validated
}
```

## 8.all-nftokens.html

Since there are no accounts or credentials required, you only need buttons to send requests and text areas to display the responses.

```html
<html>
  <head>
    <title>NFToken Data Retrieval</title>
    <link href='https://fonts.googleapis.com/css?family=Work Sans' rel='stylesheet'>
    <style>
       body{font-family: "Work Sans", sans-serif;padding: 20px;background: #fafafa;}
       h1{font-weight: bold;}
       input, button {padding: 6px;margin-bottom: 8px;}
       button{font-weight: bold;font-family: "Work Sans", sans-serif;}
       td{vertical-align: middle;}
    </style>
    <script src='https://unpkg.com/xrpl@2.2.3'></script>
    <script src='ripplex8-all-nftokens.js'></script>
  </head>
  
<!-- ************************************************************** -->
<!-- ********************** The Form ****************************** -->
<!-- ************************************************************** -->

  <body>
    <h1>NFToken Data Retrieval</h1>
    <form id="theForm">
		 <button type="button" onClick="getNFTokens()">Get NFTokens</button>
		 &nbsp;&nbsp;
		 <button type="button" onClick="getNFTokenIDs()">Get NFToken IDs</button>
		 <br/>
		 Marker:&nbsp;
		 <input type="text" id="markerField" size="80" ></input><br/>
		 <textarea id="resultField" cols="108.5" rows="20"></textarea><br/>
		 <br/><br/>
		 <button type="button" onClick="getNFTokenInfo()">Get NFToken Info</button>		 NFTokenID:
		 <input type="text" id="NFTokenIDField" size="80" ></input><br/>
		 <textarea id="infoField" cols="108.5" rows = "20"></textarea>
    </form>
  </body>
</html>
```

| Previous      | Next                                                             |
| :---          |                                                             ---: |
| [← Batch Mint NFTokens >](batch-minting.html)  | []|

