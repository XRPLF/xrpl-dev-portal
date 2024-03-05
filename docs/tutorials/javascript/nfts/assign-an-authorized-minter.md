---
html: assign-an-authorized-minter-using-javascript.html
parent: nfts-using-javascript.html
seo:
    description: Authorize another account to mint NFTs for you.
labels:
  - Accounts
  - Quickstart
  - XRP
  - NFTs, NFTokens
---
# Assign an Authorized Minter Using JavaScript

You can assign another account permission to mint NFTs for you.

This example shows how to:

1. Authorize an account to create NFTs for your account.
2. Mint an NFT for another account, when authorized.

[![Token Test Harness](/docs/img/quickstart28.png)](/docs/img/quickstart28.png)

# Usage

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/)<!-- {.github-code-download} --> archive to try the sample in your own browser.

## Get Accounts

1. Open `6.authorized-minter.html` in a browser.
2. Choose your ledger instance (_Testnet_ or _Devnet_).
    1. If you have existing test account seeds:
        1. Paste the account seeds in the **Seeds** field.
        2. Click **Get Accounts from Seeds**.
    2. If you do not have existing test accounts:
        1. Click **Get New Standby Account**.
        2. Click **Get New Operational Account**.
        
## Authorize an Account to Create NFTs

To authorize another account to create NFTs for your account:

1. Copy the **Operational Account** value.
2. Paste the **Operational Account** value in the **Authorized Minter** field.
3. Click **Set Minter**.

[![Authorized Minter](/docs/img/quickstart29.png)](/docs/img/quickstart29.png)

## Mint an NFT for Another Account

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/3WwDaDcK8C4?si=RYDhuYihibjgXGCD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

This example uses the Operational account, which was authorized in the previous step, to mint a token on behalf of the Standby account.

To mint a non-fungible token for another account:

1. Set the **Flags** field. For testing purposes, we recommend setting the value to _8_. 
2. Enter the **NFT URL**. This is a URI that points to the data or metadata associated with the NFT object. You can use the sample URI provided if you do not have one of your own.
3. Enter the **Transfer Fee**, a percentage of the proceeds that the original creator receives from future sales of the NFT. This is a value of 0-50000 inclusive, allowing transfer rates between 0.000% and 50.000% in increments of 0.001%. If you do not set the **Flags** field to allow the NFT to be transferrable, set this field to 0.
4. Copy the **Standby Account** value.
5. Paste the **Standby Account** value in the Operational account **Issuer** field.
6. Click the Operational account **Mint Other** button.

[![Minted NFT for Another Account](/docs/img/quickstart30.png)](/docs/img/quickstart30.png)

Once the item is minted, the authorized minter can sell the NFT normally. The proceeds go to the authorized minter, less the transfer fee. The minter and the issuer can settle up on a division of the price separately.

## Create a Sell Offer

To create an NFT sell offer:

1. On the Operational account side, enter the **Amount** of the sell offer in drops (millionths of an XRP), for example 100000000 (100 XRP
2. Set the **Flags** field to _1_.
3. Enter the **NFT ID** of the minted NFT you want to sell.
4. Optionally, enter a number of days until **Expiration**.
5. Click **Create Sell Offer**.

The important piece of information in the response is the NFT Offer Index, labeled as `nft_offer_index`, which is used to accept the sell offer.

[![NFT Sell Offer](/docs/img/quickstart31.png)](/docs/img/quickstart31.png)

## Accept Sell Offer

Once a sell offer is available, you can create a new account to accept the offer and buy the NFT.

To accept an available sell offer:

1. Click **Get New Standby Account**.
1. Enter the **NFT Offer Index** (labeled as `nft_offer_index` in the NFT offer results. This is different from the `nft_id`).
2. Click **Accept Sell Offer**.

The results show that the Issuer account has been credited 25 XRP. The Buyer account was debited the 100 XRP price plus 12 drops as the transaction cost. The Seller (Authorized Minter) account is credited 75 XRP. the Issuer and the Seller can divide the proceeds per their agreement in a separate transaction.
[![Transaction Results](/docs/img/quickstart32.png)](/docs/img/quickstart32.png)

# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/)<!-- {.github-code-download} --> archive to try each of the samples in your own browser.

## Set Minter

This function sets the authorized minter for an account. Each account can have 0 or 1 authorized minter that can mint NFTs in its stead.

```javascript
// *******************************************************
// ****************  Set Minter  *************************
// *******************************************************

async function setMinter() {    
```

Connect to the ledger and get the account.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results    
  await client.connect()
  results += '\nConnected, finding wallet.'
  standbyResultField.value = results    
  my_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  standbyResultField.value = results    ```

Define the AccountSet transaction, setting the `NFTokenMinter` account and the `asfAuthorizedNFTokenMinter` flag.

```javascript
  tx_json = {
    "TransactionType": "AccountSet",
    "Account": my_wallet.address,
```

Set `NFTokenMinter` to the account number of the authorized minter.

```javascript
    "NFTokenMinter": standbyMinterField.value,
```

Set the `asfAuthorizedNFTokenMinter` flag (the numeric value is _10_).

```javascript
    "SetFlag": xrpl.AccountSetAsfFlags.asfAuthorizedNFTokenMinter
    }
```

Report progress.

```javascript
  results += '\nSet Minter.' 
  standbyResultField.value = results    
```

Prepare and send the transaction, then wait for results

```javascript
  const prepared = await client.autofill(tx_json)
  const signed = my_wallet.sign(prepared)
  const result = await client.submitAndWait(signed.tx_blob)
```

If the transaction succeeds, show the results. If not, report that the transaction failed.

```javascript
  if (result.result.meta.TransactionResult == "tesSUCCESS") {
    results += '\nAccount setting succeeded.\n'
    results += JSON.stringify(result,null,2)
    standbyResultField.value = results    
  } else {
    throw 'Error sending transaction: ${result}'
    results += '\nAccount setting failed.'
  standbyResultField.value = results    
  }
```

Disconnect from the XRP Ledger.

```javascript
  client.disconnect()
} // End of configureAccount()
```

## Mint Other

This revised mint function allows one account to mint for another issuer.

```javascript

// *******************************************************
// ****************  Mint Other  *************************
// *******************************************************

async function mintOther() {
```

Connect to the ledger and get the account.

```javascript
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results    
  let net = getNet()
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const client = new xrpl.Client(net)
  await client.connect()
```
Report success

```javascript
  results += '\nConnected. Minting NFT.'
  standbyResultField.value = results    
```
      
This transaction blob is the same as the one used for the previous [`mintToken()` function](./mint-and-burn-nfts.md#mint-token), with the addition of the `Issuer` field.

```javascript
  const tx_json = {
    "TransactionType": "NFTokenMint",
    "Account": standby_wallet.classicAddress,
```

The URI is a link to a data file represented by the NFT.

```javascript
    "URI": xrpl.convertStringToHex(standbyTokenUrlField.value),
```

At a minimum, we recommend that you set the `tfTransferable` flag (8) to enable accounts to sell and resell the NFT for testing purposes.

```javascript
    "Flags": parseInt(standbyFlagsField.value),
```

Transfer fee is a value 0-50000 representing .001% of the price for a resale to be returned to the original issuer. For example, _25000_ translates to 25% of the price to be sent to the issuer on resale.

```javascript
    "TransferFee": parseInt(standbyTransferFeeField.value),
```

The **Issuer** is the original creator of the object represented by the NFT. 

```javascript
    "Issuer": standbyIssuerField.value,
```

The `NFTokenTaxon` is an optional number field the issuer can use for their own purposes. The same taxon can be used for multiple tokens. Set it to 0 if you have no use for it.

```javascript
    "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
  }
```

Submit the transaction and wait for the results.

```javascript
  const tx = await client.submitAndWait(tx_json, { wallet: standby_wallet} )
  const nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress
  })
```

Report the results.

```javascript
  results += '\n\nTransaction result: '+ tx.result.meta.TransactionResult
  results += '\n\nnfts: ' + JSON.stringify(nfts, null, 2)
  standbyResultField.value = results  + (await
    client.getXrpBalance(standby_wallet.address))
  standbyResultField.value = results    
```

Disconnect from the XRP Ledger.

```javascript
  client.disconnect()
} //End of mintOther()
```

## Reciprocal Transactions

These functions duplicate the functions of the standby account for the operational account. See the corresponding standby account function for walkthrough information.

```javascript
// *******************************************************
// ****************  Set Operational Minter  **************
// ********************************************************

async function oPsetMinter() {    
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  await client.connect()
  results += '\nConnected, finding wallet.'
  operationalResultField.value = results
  my_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  operationalResultField.value = results

  tx_json = {
    "TransactionType": "AccountSet",
    "Account": my_wallet.address,
    "NFTokenMinter": operationalMinterField.value,
    "SetFlag": xrpl.AccountSetAsfFlags.asfAuthorizedNFTokenMinter
  } 
  results += '\nSet Minter.' 
  operationalResultField.value = results
      
  const prepared = await client.autofill(tx_json)
  const signed = my_wallet.sign(prepared)
  const result = await client.submitAndWait(signed.tx_blob)
  if (result.result.meta.TransactionResult == "tesSUCCESS") {
    results += '\nAccount setting succeeded.\n'
    results += JSON.stringify(result,null,2)
    operationalResultField.value = results
  } else {
    throw 'Error sending transaction: ${result}'
    results += '\nAccount setting failed.'
    operationalResultField.value = results
  }
      
  client.disconnect()
} // End of oPsetMinter()


// *******************************************************
// ************** Operational Mint Other *****************
// *******************************************************
      
async function oPmintOther() {
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  let net = getNet()
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const client = new xrpl.Client(net)
  await client.connect()
  results += '\nConnected. Minting NFT.'
  operationalResultField.value = results

  // This version adds the "Issuer" field.
  // ------------------------------------------------------------------------
  const tx_json = {
    "TransactionType": 'NFTokenMint',
    "Account": operational_wallet.classicAddress,
    "URI": xrpl.convertStringToHex(operationalTokenUrlField.value),
    "Flags": parseInt(operationalFlagsField.value),
    "Issuer": operationalIssuerField.value,
    "TransferFee": parseInt(operationalTransferFeeField.value),
    "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
  }
      
  // ----------------------------------------------------- Submit signed blob 
  const tx = await client.submitAndWait(tx_json, { wallet: operational_wallet} )
  const nfts = await client.request({
    method: "account_nfts",
    account: operational_wallet.classicAddress  
  })
        
  // ------------------------------------------------------- Report results
  results += '\n\nTransaction result: '+ tx.result.meta.TransactionResult
  results += '\n\nnfts: ' + JSON.stringify(nfts, null, 2)
  results += await client.getXrpBalance(operational_wallet.address)
  operationalResultField.value = results
  client.disconnect()
} //End of oPmintToken
```

## 6.authorized-minter.html

Update the form with fields and buttons to support the new functions.

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
    <script src='ripplex4-transfer-nfts.js'></script>
    <script src='ripplex6-authorized-minter.js'></script>
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
                      <td align="right">NFT Offer Index</td>
                      <td><input type="text" id="standbyTokenOfferIndexField" value="" size="80"/></td>
                    </tr>
                    <tr>
                      <td align="right">Owner</td>
                      <td><input type="text" id="standbyOwnerField" value="" size="80"/></td>
                    </tr>
                    <tr>
                        <td align="right">Authorized Minter</td>
                        <td><input type="text" id="standbyMinterField" value="" size="80"/></td>
                    </tr>
                    <tr>
                        <td align="right">Issuer</td>
                        <td><input type="text" id="standbyIssuerField" value="" size="80"/></td>
                    </tr>
                    <tr>
                        <td align="right">Destination</td>
                        <td><input type="text" id="standbyDestinationField" value="" size="80"/></td>
                    </tr>
                            <tr>
                                <td align="right">Expiration</td>
                                <td><input type="text" id="standbyExpirationField" value="" size="80"/></td>
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
                        <br/><br/>
                        <button type="button" onClick="setMinter('standby')">Set Minter</button>
                        <br/>
                        <button type="button" onClick="mintOther()">Mint Other</button>
                        <br/><br/>
                        <button type="button" onClick="createSellOffer()">Create Sell Offer</button>
                        <br/>
                        <button type="button" onClick="acceptSellOffer()">Accept Sell Offer</button>
                        <br/>
                        <button type="button" onClick="createBuyOffer()">Create Buy Offer</button>
                        <br/>
                        <button type="button" onClick="acceptBuyOffer()">Accept Buy Offer</button>
                        <br/>
                        <button type="button" onClick="getOffers()">Get Offers</button>
                        <br/>
                        <button type="button" onClick="cancelOffer()">Cancel Offer</button>
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
                        <br/><br/>
                        <button type="button" onClick="oPsetMinter()">Set Minter</button>
                        <br/>
                        <button type="button" onClick="oPmintOther()">Mint Other</button>
                        <br/><br/>
                        <button type="button" onClick="oPcreateSellOffer()">Create Sell Offer</button>
                        <br/>
                        <button type="button" onClick="oPacceptSellOffer()">Accept Sell Offer</button>
                        <br/>
                        <button type="button" onClick="oPcreateBuyOffer()">Create Buy Offer</button>
                        <br/>
                        <button type="button" onClick="oPacceptBuyOffer()">Accept Buy Offer</button>
                        <br/>
                        <button type="button" onClick="oPgetOffers()">Get Offers</button>
                        <br/>
                        <button type="button" onClick="oPcancelOffer()">Cancel Offer</button>
                      </td>
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
                            <td align="right">NFT Offer Index</td>
                            <td><input type="text" id="operationalTokenOfferIndexField" value="" size="80"/></td>
                          </tr>
                          <tr>
                            <td align="right">Owner</td>
                            <td><input type="text" id="operationalOwnerField" value="" size="80"/></td>
                          </tr>
                          <tr>
                        <td align="right">Authorized Minter</td>
                        <td><input type="text" id="operationalMinterField" value="" size="80"/></td>
                    </tr>
                    <tr>
                        <td align="right">Issuer</td>
                        <td><input type="text" id="operationalIssuerField" value="" size="80"/></td>
                    </tr>
                            <tr>
                              <td align="right">Destination</td>
                              <td><input type="text" id="operationalDestinationField" value="" size="80"/></td>
                            </tr>
                            <tr>
                              <td align="right">Expiration</td>
                              <td><input type="text" id="operationalExpirationField" value="" size="80"/></td>
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
