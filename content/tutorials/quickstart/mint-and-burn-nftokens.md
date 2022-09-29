---
html: mint-and-burn-nftokens.html
parent: xrpl-quickstart.html
blurb: Quickstart step 3, mint and burn NFTokens.
labels:
  - Quickstart
  - Tokens
  - Non-fungible tokens, NFTs
---

# 3. Mint and Burn NFTokens

{% include '_snippets/nfts-disclaimer.md' %}

This example shows how to:


1. Mint new Non-fungible Tokens (NFTokens).
2. Get a list of existing NFTokens.
3. Delete (Burn) a NFToken.


![Test harness with mint NFToken fields](img/quickstart8.png)



# Usage

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/js/quickstart.zip){.github-code-download} archive to try the sample in your own browser.

## Get Accounts



1. Open `3.mint-nfts.html` in a browser.
2. Get test accounts.
    1. If you have existing NFT-Devnet account seeds:
        1. Paste the account seeds in the **Seeds** field.
        2. Click **Get Accounts from Seeds**.
    2. If you do not have existing NFT-Devnet accounts:
        1. Click **Get New Standby Account**.
        2. Click **Get New Operational Account**.



![Get accounts](img/quickstart9.png)



## Mint a NFToken

To mint a non-fungible token object:

1. Set the **Flags** field. For testing purposes, we recommend setting the value to _8_. This sets the _tsTransferable_ flag, meaning that the NFToken object can be transferred to another account. Otherwise, the NFToken object can only be transferred back to the issuing account. See [NFToken Mint](https://xrpl.org/nftokenmint.html#:~:text=Example%20NFTokenMint%20JSON-,NFTokenMint%20Fields,-NFTokenMint%20Flags) for information about all of the available flags for minting NFTokens.
2. Enter the **Token URL**. This is a URI that points to the data or metadata associated with the NFToken object. You can use the sample URI provided if you do not have one of your own.
3. Enter the **Transfer Fee**, a percentage of the proceeds from future sales of the NFToken that will be returned to the original creator. This is a value of 0-50000 inclusive, allowing transfer rates between 0.000% and 50.000% in increments of 0.001%. If you do not set the **Flags** field to allow the NFToken to be transferrable, set this field to 0.
4. Click **Mint Token**.



![Mint NFToken fields](img/quickstart10.png)


## Get Tokens

Click **Get Tokens** to get a list of NFTokens owned by the account.



![Get NFTokens](img/quickstart11.png)



## Burn a Token

The current owner of a NFToken can always destroy (or _burn)_ a NFToken object.

To permanently destroy a NFToken:



1. Enter the **Token ID**.
2. Click **Burn Token**.



![Burn NFTokens](img/quickstart12.png)




# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/js/quickstart.zip){.github-code-download} archive to examine the code samples.

## ripplex3-mint-nfts.js


### Mint Token


```
// *******************************************************
// ********************** Mint Token *********************
// *******************************************************
async function mintToken() {
```


Connect to the ledger and get the account wallets.


```


  results = 'Connecting to ' + getNet() + '....'
  document.getElementById('standbyResultField').value = results
  let net = getNet()
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const client = new xrpl.Client(net)
  await client.connect()
  results += '\nConnected. Minting NFToken.'
  document.getElementById('standbyResultField').value = results



```


Define the transaction.


```
  const transactionBlob = {
    "TransactionType": "NFTokenMint",
    "Account": standby_wallet.classicAddress,
```


Note that the URI field expects a hexadecimal value rather than the literal URI string. You can use the `convertStringToHex` utility to transform the URI in real time.


```
    "URI": xrpl.convertStringToHex(standbyTokenUrlField.value),
```

If you want the NFToken to be transferable to third parties, set the **Flags** field to _8_.


```
    "Flags": parseInt(standbyFlagsField.value),
```

The Transfer Fee is a value 0 to 50000, used to set a royalty of 0.000% to 50.000% in increments of 0.001. 

```
    "TransferFee": parseInt(standbyTransferFeeField.value),
```

The TokenTaxon is a required value. It is an arbitrary value defined by the issuer. If you do not have a use for the field, you can set it to _0_.


```
    "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
  }


```


Send the transaction and wait for the response.


```
  const tx = await client.submitAndWait(transactionBlob, { wallet: standby_wallet} )
```


Request a list of NFTs owned by the account.


```
  const nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress  
  })


```


Report the results.


```
  results += '\n\nTransaction result: '+ tx.result.meta.TransactionResult
  results += '\n\nnfts: ' + JSON.stringify(nfts, null, 2)
  document.getElementById('standbyBalanceField').value = 
    (await client.getXrpBalance(standby_wallet.address))
  document.getElementById('operationalBalanceField').value = results    
```


Disconnect from the ledger.


```
  client.disconnect()
} //End of mintToken()
```



### Get Tokens


```
// *******************************************************
// ******************* Get Tokens ************************
// *******************************************************

async function getTokens() {
```


Connect to the ledger and get the account wallet.


```
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...'
  document.getElementById('standbyResultField').value = results
  await client.connect()
  results += '\nConnected. Getting NFTokens...'
  document.getElementById('standbyResultField').value = results
```


Request a list of NFTs owned by the account.


```
 const nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress  
  })
```


Report the results.


```
  results += '\nNFTs:\n ' + JSON.stringify(nfts,null,2)
  document.getElementById('standbyResultField').value = results
```


Disconnect from the ledger.


```
  client.disconnect()
} //End of getTokens()
```



### Burn Token


```
// *******************************************************
// ********************* Burn Token **********************
// *******************************************************
```


Connect to the ledger and get the account wallets.


```
  async function burnToken() {
    const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
    let net = getNet()
    const client = new xrpl.Client(net)
    results = 'Connecting to ' + net + '...'
    document.getElementById('standbyResultField').value = results
    await client.connect()
    results += '\nConnected. Burning NFToken...'
    document.getElementById('standbyResultField').value = results
```


Define the transaction.


```
    const transactionBlob = {
      "TransactionType": "NFTokenBurn",
      "Account": standby_wallet.classicAddress,
      "TokenID": standbyTokenIdField.value
    }
```


Submit the transaction and wait for the results.


```
    const tx = await client.submitAndWait(transactionBlob,{wallet: standby_wallet})
```


Request a list of NFTokens owned by the client.


```
    const nfts = await client.request({
      method: "account_nfts",
      account: standby_wallet.classicAddress  
    })
```


Report the results.


```
    results += '\nTransaction result: '+ tx.result.meta.TransactionResult
    results += '\nBalance changes: ' +
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
    document.getElementById('standbyResultField').value = results
    document.getElementById('standbyBalanceField').value = 
      (await client.getXrpBalance(standby_wallet.address))
    results += '\nNFTs: \n' + JSON.stringify(nfts,null,2)
    document.getElementById('standbyResultField').value = results
    client.disconnect()
  }
  // End of burnToken()
```



### Reciprocal Transactions


```
// *******************************************************
// ************** Operational Mint Token *****************
// *******************************************************
      
async function oPmintToken() {
  results = 'Connecting to ' + getNet() + '....'
  document.getElementById('operationalResultField').value = results
  let net = getNet()
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const client = new xrpl.Client(net)
  await client.connect()
  results += '\nConnected. Minting NFToken.'
  document.getElementById('operationalResultField').value = results

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
  document.getElementById('operationalBalanceField').value = 
    (await client.getXrpBalance(operational_wallet.address))
  document.getElementById('operationalResultField').value = results    

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
          document.getElementById('operationalResultField').value = results
        await client.connect()
          results += '\nConnected. Getting NFTokens...'
          document.getElementById('operationalResultField').value = results
        const nfts = await client.request({
          method: "account_nfts",
          account: operational_wallet.classicAddress  
        })
        results += '\nNFTs:\n ' + JSON.stringify(nfts,null,2)
          document.getElementById('operationalResultField').value = results
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
  document.getElementById('operationalResultField').value = results
  await client.connect()
  results += '\nConnected. Burning NFToken...'
   document.getElementById('operationalResultField').value = results
      
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
  document.getElementById('operationalResultField').value = results
  document.getElementById('operationalBalanceField').value = 
    (await client.getXrpBalance(operational_wallet.address))
  document.getElementById('operationalBalanceField').value = 
    (await client.getXrpBalance(operational_wallet.address))
  results += '\nNFTs: \n' + JSON.stringify(nfts,null,2)
  document.getElementById('operationalResultField').value = results
  client.disconnect()
}
// End of oPburnToken()
```



## 3.mint-nfts.html

Bold text in the following indicates changes to the form that support the new functions.


```
<html>
  <head>
    <title>Token Test Harness</title>
    <script src='https://unpkg.com/xrpl@2.2.3'></script>
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
                        <input type="text" id="standbyAmountField" size="40" value="100"></input>
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
                      <td align="right">NFToken URL</td>
                      <td><input type="text" id="standbyTokenUrlField"
                        value = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi" size="80"/>
                      </td>
                    </tr>
                    <tr>
                      <td align="right">Flags</td>
                      <td><input type="text" id="standbyFlagsField" value="1" size="10"/></td>
                    </tr>
                    <tr>
                      <td align="right">NFToken ID</td>
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
                        <button type="button" onClick="mintToken()">Mint NFToken</button>
                        <br/>
                        <button type="button" onClick="getTokens()">Get NFTokens</button>
                        <br/>
                        <button type="button" onClick="burnToken()">Burn NFToken</button>
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
                        <button type="button" onClick="oPmintToken()">Mint NFToken</button>
                        <br/>
                        <button type="button" onClick="oPgetTokens()">Get NFTokens</button>
                        <br/>
                        <button type="button" onClick="oPburnToken()">Burn NFToken</button>
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
                              <input type="text" id="operationalAmountField" size="40" value="100"></input>
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
                            <td align="right">NFToken URL</td>
                            <td><input type="text" id="operationalTokenUrlField"
                              value = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi" size="80"/>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">Flags</td>
                            <td><input type="text" id="operationalFlagsField" value="1" size="10"/></td>
                          </tr>
                          <tr>
                            <td align="right">NFToken ID</td>
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

---

| Previous      | Next                                                             |
| :---          |                                                             ---: |
| [← 2. Create Trust Line and Send Currency >](create-trustline-send-currency.html) | [4. Transfer NFTokens → >](transfer-nftokens.html) |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
