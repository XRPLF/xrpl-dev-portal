---
html: mint-and-burn-nfts-using-javascript.html
parent: nfts-using-javascript.html
seo:
    description: Mint and burn NFTs.
labels:
  - Quickstart
  - Tokens
  - Non-fungible tokens, NFTs
---
# Mint and Burn NFTs Using JavaScript

This example shows how to:

1. Mint new Non-fungible Tokens (NFTs).
2. Get a list of existing NFTs.
3. Delete (Burn) an NFT.

[![Test harness with mint NFT fields](/docs/img/quickstart8.png)](/docs/img/quickstart8.png)

# Usage

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/)<!-- {.github-code-download} --> archive to try the sample in your own browser.

## Get Accounts

1. Open `3.mint-nfts.html` in a browser.
2. Get test accounts.
    1. If you have existing Testnet account seeds:
        1. Paste the account seeds in the **Seeds** field.
        2. Click **Get Accounts from Seeds**.
    2. If you do not have existing Testnet accounts:
        1. Click **Get New Standby Account**.
        2. Click **Get New Operational Account**.

[![Get accounts](/docs/img/quickstart9.png)](/docs/img/quickstart9.png)

## Mint an NFT

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/oGzKbQJCTJ0?si=kCBG_jJkFAS7_mYU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

To mint a non-fungible token object:

1. Set the **Flags** field. For testing purposes, we recommend setting the value to _8_. This sets the _tsTransferable_ flag, meaning that the NFT object can be transferred to another account. Otherwise, the NFT object can only be transferred back to the issuing account.
2. Enter the **Token URL**. This is a URI that points to the data or metadata associated with the NFT object. You can use the sample URI provided if you do not have one of your own.
3. Enter the **Transfer Fee**, a percentage of the proceeds from future sales of the NFT that will be returned to the original creator. This is a value of 0-50000 inclusive, allowing transfer rates between 0.000% and 50.000% in increments of 0.001%. If you do not set the **Flags** field to allow the NFT to be transferrable, set this field to 0.
4. Click **Mint NFT**.

[![Mint NFT fields](/docs/img/quickstart10.png)](/docs/img/quickstart10.png)


## Get Tokens

Click **Get NFTs** to get a list of NFTs owned by the account.

[![Get NFTs](/docs/img/quickstart11.png)](/docs/img/quickstart11.png)

## Burn a Token

The current owner of an NFT can always destroy (or _burn_) an NFT object.

To permanently destroy an NFT:

1. Enter the **Token ID**.
2. Click **Burn NFT**.

[![Burn NFTs](/docs/img/quickstart12.png)](/docs/img/quickstart12.png)

# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/)<!-- {.github-code-download} --> archive to examine the code samples.

## ripplex3-mint-nfts.js
<!-- SPELLING_IGNORE: ripplex3 -->

### Mint Token

```javascript
// *******************************************************
// ********************** Mint Token *********************
// *******************************************************
      
async function mintToken() {
```

Connect to the ledger and get the account wallets.

```javascript
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results
  let net = getNet()
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const client = new xrpl.Client(net)
  await client.connect()
  results += '\nConnected. Minting NFT.'
  standbyResultField.value = results
```

Define the transaction.

```javascript

  const transactionJson = {
    "TransactionType": "NFTokenMint",
    "Account": standby_wallet.classicAddress,
```

Note that the URI field expects a hexadecimal value rather than the literal URI string. You can use the `convertStringToHex` utility to transform the URI in real time.

```javascript
    "URI": xrpl.convertStringToHex(standbyTokenUrlField.value),
```

If you want the NFT to be transferable to third parties, set the **Flags** field to _8_.


```javascript
    "Flags": parseInt(standbyFlagsField.value),
```

The Transfer Fee is a value 0 to 50000, used to set a royalty of 0.000% to 50.000% in increments of 0.001. 

```javascript
    "TransferFee": parseInt(standbyTransferFeeField.value),
```

The `TokenTaxon` is a required value. It is an arbitrary value defined by the issuer. If you do not have a use for the field, you can set it to _0_.


```javascript
    "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
  }
```


Send the transaction and wait for the response.

```javascript
  const tx = await client.submitAndWait(transactionJson, { wallet: standby_wallet} )
```

Request a list of NFTs owned by the account.

```javascript
  const nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress
  })
```

Report the results.

```javascript
  results += '\n\nTransaction result: '+ tx.result.meta.TransactionResult
  results += '\n\nnfts: ' + JSON.stringify(nfts, null, 2)
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  standbyResultField.value = results    
```

Disconnect from the ledger.

```javascript
  client.disconnect()
} //End of mintToken()
```


### Get Tokens

```javascript
// *******************************************************
// ******************* Get Tokens ************************
// *******************************************************

async function getTokens() {
```

Connect to the ledger and get the account.

```javascript
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...'
  standbyResultField.value = results
  await client.connect()
  results += '\nConnected. Getting NFTs...'
  standbyResultField.value = results
```

Request a list of NFTs owned by the account.

```javascript
  const nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress
  })
```

Report the results.

```javascript
  results += '\nNFTs:\n ' + JSON.stringify(nfts,null,2)
  standbyResultField.value = results
```

Disconnect from the ledger.

```javascript
  client.disconnect()
} //End of getTokens()
```

### Burn Token

```javascript
// *******************************************************
// ********************* Burn Token **********************
// *******************************************************
      
async function burnToken() {
```

Connect to the ledger and get the account wallets.

```javascript
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...'
  standbyResultField.value = results
  await client.connect()
  results += '\nConnected. Burning NFT...'
  standbyResultField.value = results
```

Define the transaction.

```javascript
  const transactionBlob = {
    "TransactionType": "NFTokenBurn",
    "Account": standby_wallet.classicAddress,
    "NFTokenID": standbyTokenIdField.value
  }
```

Submit the transaction and wait for the results.

```javascript
  const tx = await client.submitAndWait(transactionBlob,{wallet: standby_wallet})
```

Request a list of NFTs owned by the client.

```javascript
  const nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress
  })
```


Report the results.


```javascript
  results += '\nTransaction result: '+ tx.result.meta.TransactionResult
  results += '\nBalance changes: ' +
  JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  standbyResultField.value = results
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  results += '\nNFTs: \n' + JSON.stringify(nfts,null,2)
  standbyResultField.value = results
  client.disconnect()
}// End of burnToken()
```

### Reciprocal Transactions

These transactions are the same as the Standby account transactions, but for the Operational account.

```javascript
// *******************************************************
// ************** Operational Mint Token *****************
// *******************************************************
      
async function oPmintToken() {
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  let net = getNet()
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const client = new xrpl.Client(net)
  await client.connect()
  results += '\nConnected. Minting NFT.'
  operationalResultField.value = results

  // Note that you must convert the token URL to a hexadecimal 
  // value for this transaction.
  // ------------------------------------------------------------------------
  const transactionBlob = {
    "TransactionType": 'NFTokenMint',
    "Account": operational_wallet.classicAddress,
    "URI": xrpl.convertStringToHex(operationalTokenUrlField.value),
    "Flags": parseInt(operationalFlagsField.value),
    "TransferFee": parseInt(operationalTransferFeeField.value),
    "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
  }
      
  // ----------------------------------------------------- Submit signed blob 
  const tx = await client.submitAndWait(transactionBlob, { wallet: operational_wallet} )
  const nfts = await client.request({
    method: "account_nfts",
    account: operational_wallet.classicAddress
  })
        
  // ------------------------------------------------------- Report results
  results += '\n\nTransaction result: '+ tx.result.meta.TransactionResult
  results += '\n\nnfts: ' + JSON.stringify(nfts, null, 2)
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  operationalResultField.value = results
  client.disconnect()
} //End of oPmintToken
      
// *******************************************************
// ************** Operational Get Tokens *****************
// *******************************************************

async function oPgetTokens() {
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '...'
  operationalResultField.value = results
  await client.connect()
  results += '\nConnected. Getting NFTs...'
  operationalResultField.value = results
  const nfts = await client.request({
    method: "account_nfts",
    account: operational_wallet.classicAddress
  })
  results += '\nNFTs:\n ' + JSON.stringify(nfts,null,2)
  operationalResultField.value = results
  client.disconnect()
} //End of oPgetTokens
      
// *******************************************************
// ************* Operational Burn Token ******************
// *******************************************************
      
async function oPburnToken() {
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '...'
  operationalResultField.value = results
  await client.connect()
  results += '\nConnected. Burning NFT...'
  operationalResultField.value = results
      
  // ------------------------------------------------------- Prepare transaction
  const transactionBlob = {
    "TransactionType": "NFTokenBurn",
    "Account": operational_wallet.classicAddress,
    "NFTokenID": operationalTokenIdField.value
  }
      
  //-------------------------------------------------------- Submit signed blob
  const tx = await client.submitAndWait(transactionBlob,{wallet: operational_wallet})
  const nfts = await client.request({
    method: "account_nfts",
    account: operational_wallet.classicAddress
  })
  results += '\nTransaction result: '+ tx.result.meta.TransactionResult
  results += '\nBalance changes: ' +
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  operationalResultField.value = results
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  results += '\nNFTs: \n' + JSON.stringify(nfts,null,2)
  operationalResultField.value = results
  client.disconnect()
}
// End of oPburnToken()
```

## 3.mint-nfts.html

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
    <script src='https://unpkg.com/xrpl@2.7.0/build/xrpl-latest-min.js'></script>
    <script src='ripplex1-send-xrp.js'></script>
    <script src='ripplex2-send-currency.js'></script>
    <script src='ripplex3-mint-nfts.js'></script>
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
      &nbsp;&nbsp;
      <input type="radio" id="tn" name="server"
        value="wss://s.altnet.rippletest.net:51233" checked>
      <label for="testnet">Testnet</label>
      &nbsp;&nbsp;
      <input type="radio" id="dn" name="server"
        value="wss://s.devnet.rippletest.net:51233">
      <label for="devnet">Devnet</label>
      <br/><br/>
      <button type="button" onClick="getAccountsFromSeeds()">Get Accounts From Seeds</button>
      <br/>
      <textarea id="seeds" cols="40" rows= "2"></textarea>
      <br/><br/>
      <table>
        <tr valign="top">
          <td>
            <table>
              <tr valign="top">
                <td>
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
                    <tr>
                      <td align="right">
                        Amount
                      </td>
                      <td>
                        <input type="text" id="standbyAmountField" size="40"></input>
                        <br>
                      </td>
                    </tr>
                    <tr>
                      <td align="right">
                        Destination
                      </td>
                      <td>
                        <input type="text" id="standbyDestinationField" size="40"></input>
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
                      <td align="right">NFT URL</td>
                      <td><input type="text" id="standbyTokenUrlField"
                        value = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi" size="80"/>
                      </td>
                    </tr>
                    <tr>
                      <td align="right">Flags</td>
                      <td><input type="text" id="standbyFlagsField" value="1" size="10"/></td>
                    </tr>
                    <tr>
                      <td align="right">NFT ID</td>
                      <td><input type="text" id="standbyTokenIdField" value="" size="80"/></td>
                    </tr>
                            <tr>
                                <td align="right">Transfer Fee</td>
                                <td><input type="text" id="standbyTransferFeeField" value="" size="80"/></td>
                            </tr>
                  </table>
                  <p align="left">
                    <textarea id="standbyResultField" cols="80" rows="20" ></textarea>
                  </p>
                </td>
                </td>
                <td>
                  <table>
                    <tr valign="top">
                      <td align="center" valign="top">
                        <button type="button" onClick="sendXRP()">Send XRP&#62;</button>
                        <br/><br/>
                        <button type="button" onClick="createTrustline()">Create TrustLine</button>
                        <br/>
                        <button type="button" onClick="sendCurrency()">Send Currency</button>
                        <br/>
                        <button type="button" onClick="getBalances()">Get Balances</button>
                        <br/><br/>
                        <button type="button" onClick="mintToken()">Mint NFT</button>
                        <br/>
                        <button type="button" onClick="getTokens()">Get NFTs</button>
                        <br/>
                        <button type="button" onClick="burnToken()">Burn NFT</button>
                      </td>
                    </tr>
                    </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
          <td>
            <table>
              <tr>
                <td>
                <td>
                  <table>
                    <tr>
                      <td align="center" valign="top">
                        <button type="button" onClick="oPsendXRP()">&#60; Send XRP</button>
                        <br/><br/>
                        <button type="button" onClick="oPcreateTrustline()">Create TrustLine</button>
                        <br/>
                        <button type="button" onClick="oPsendCurrency()">Send Currency</button>
                        <br/>
                        <button type="button" onClick="getBalances()">Get Balances</button>
                        <br/><br/>
                        <button type="button" onClick="oPmintToken()">Mint NFT</button>
                        <br/>
                        <button type="button" onClick="oPgetTokens()">Get NFTs</button>
                        <br/>
                        <button type="button" onClick="oPburnToken()">Burn NFT</button>
                      <td valign="top" align="right">
                        <button type="button" onClick="getAccount('operational')">Get New Operational Account</button>
                        <table>
                          <tr valign="top">
                            <td align="right">
                              Operational Account
                            </td>
                            <td>
                              <input type="text" id="operationalAccountField" size="40"></input>
                              <br>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">
                              Public Key
                            </td>
                            <td>
                              <input type="text" id="operationalPubKeyField" size="40"></input>
                              <br>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">
                              Private Key
                            </td>
                            <td>
                              <input type="text" id="operationalPrivKeyField" size="40"></input>
                              <br>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">
                              Seed
                            </td>
                            <td>
                              <input type="text" id="operationalSeedField" size="40"></input>
                              <br>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">
                              XRP Balance
                            </td>
                            <td>
                              <input type="text" id="operationalBalanceField" size="40"></input>
                              <br>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">
                              Amount
                            </td>
                            <td>
                              <input type="text" id="operationalAmountField" size="40"></input>
                              <br>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">
                              Destination
                            </td>
                            <td>
                              <input type="text" id="operationalDestinationField" size="40"></input>
                              <br>
                            </td>
                          </tr>
                          <tr>
                            <td>
                            </td>
                            <td align="right">                        <input type="checkbox" id="operationalDefault" checked="true"/>
                              <label for="operationalDefault">Allow Rippling</label>
                              <button type="button" onClick="configureAccount('operational',document.querySelector('#operationalDefault').checked)">Configure Account</button>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">
                              Currency
                            </td>
                            <td>
                              <input type="text" id="operationalCurrencyField" size="40" value="USD"></input>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">NFT URL</td>
                            <td><input type="text" id="operationalTokenUrlField"
                              value = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi" size="80"/>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">Flags</td>
                            <td><input type="text" id="operationalFlagsField" value="1" size="10"/></td>
                          </tr>
                          <tr>
                            <td align="right">NFT ID</td>
                            <td><input type="text" id="operationalTokenIdField" value="" size="80"/></td>
                          </tr>
                          <tr>
                            <td align="right">Transfer Fee</td>
                            <td><input type="text" id="operationalTransferFeeField" value="" size="80"/></td>
                          </tr>
                                      </table>
                        <p align="right">
                          <textarea id="operationalResultField" cols="80" rows="20" ></textarea>
                        </p>
                      </td>
                      </td>
                    </tr>
                    </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </form>
  </body>
</html>
```
