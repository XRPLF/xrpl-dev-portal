# Create an AMM

This example shows how to:

1. Check if an [AMM](/docs/concepts/tokens/decentralized-exchange/automated-market-makers) pair exists.
2. Issue a token.
3. Create an AMM pair with the issued tokens and XRP.
4. Create another AMM pair with two issued tokens.

[![Create AMM test harness](/docs/img/quickstart-create-amm1.png)](/docs/img/quickstart-create-amm1.png)

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/) archive to try each of the samples in your own browser.

{% admonition type="info" name="Note" %}
Without the Quickstart Samples, you will not be able to try the examples that follow.
{% /admonition %}


## Usage

### Get Accounts

1. Open `11.create-amm.html` in a browser.
2. Select **Testnet** or **Devnet**
3. Get test accounts.
   - If you have existing account seeds:
     1. Paste account seeds in the **Seeds** field.
     2. Click **Get Accounts from Seeds**.
   - If you don't have account seeds:
     1. Click **Get New Standby Account**.
     2. Click **Get New Operational Account**.

[![Get account results](/docs/img/quickstart-create-amm2.png)](/docs/img/quickstart-create-amm2.png)


### Check AMM

Check if an AMM pair already exists. An AMM holds two different assets: at most one of these can be XRP, and one or both of them can be [tokens](/docs/concepts/tokens).

1. Enter a [currency code](/docs/references/protocol/data-types/currency-formats.md#currency-codes) in the **Asset 1 Currency** field. For example, `XRP`.
2. Enter a second currency code in the **Asset 2 Currency** field. For example, `TST`.
3. Enter the operational account address in the **Asset 2 Issuer** field.
4. Click **Check AMM**.

[![Check AMM results](/docs/img/quickstart-create-amm3.png)](/docs/img/quickstart-create-amm3.png)


### Create Trustline

Create a trustline from the operational account to the standby account. In the standby account fields:

1. Enter a maximum transfer limit in the **Amount** field, such as 10,000.
2. Enter the operational account address in the **Destination** field.
3. Enter a currency code in the **Currency** field. For example, `TST`.
4. Click **Create Trustline**.

[![Create trustline results](/docs/img/quickstart-create-amm4.png)](/docs/img/quickstart-create-amm4.png)


### Issue Tokens

Send issued tokens from the operational account to the standby account. In the operational account fields:

1. Select **Allow Rippling** and click **Configure Account**.
2. Enter a value in the **Amount** field, up to the maximum transfer amount you set in the trustline.
3. Enter the standby account address in the **Destination** field.
4. Enter the currency code from the trustline in the **Currency** field.
5. Click **Send Currency**.

[![Issue token results](/docs/img/quickstart-create-amm5.png)](/docs/img/quickstart-create-amm5.png)


### Create an XRP/Token AMM

Create a new AMM pool with XRP and the issued tokens.

1. Enter `XRP` in the **Asset 1 Currency** field.
2. Enter an amount of XRP in the **Asset 1 Amount** field. Save some `XRP` for later use in the tutorial.
3. Enter the currency code of your issued tokens in the **Asset 2 Currency** field.
4. Enter the operational account address in the **Asset 2 Issuer** field.
5. Enter an amount in the **Asset 2 Amount** field.
6. Click **Create AMM**.

{% admonition type="info" name="Note" %}
Save the seed values of the standby and operational accounts for subsequent AMM tutorials.
{% /admonition %}

[![Create AMM results](/docs/img/quickstart-create-amm6.png)](/docs/img/quickstart-create-amm6.png)


### Create a Token/Token AMM

Create a second AMM pool with two issued tokens.

1. Repeat the steps from [Create Trustline](#create-trustline), using a different currency code. For example, `FOO`.
2. Repeat the steps from [Issue Tokens](#issue-tokens), using the second currency.
3. Enter the first currency code in the **Asset 1 Currency** field.
4. Enter the operational account address in the **Asset 1 Issuer** field.
5. Enter an amount in the **Asset 1 Amount** field.
6. Enter the second currency code in the **Asset 2 Currency** field.
7. Enter the operaional account address in the **Asset 2 Issuer** field.
8. Enter an amount in the **Asset 2 Amount** field.
9. Click **Create AMM**.

[![Create AMM results](/docs/img/quickstart-create-amm7.png)](/docs/img/quickstart-create-amm7.png)


## Code Walkthrough

You can open `ripplex11-create-amm.js` from the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/) to view the source code.


### Create AMM

This sends the `AMMCreate` transaction and creates a new AMM, using the initial assets provided. The code checks the token currency fields and formats the `AMMCreate` transaction based on the combination of `XRP` and custom tokens.

```javascript
async function createAMM() {
```

Connect to the XRP Ledger.

```javascript
  let net = getNet()

  const client = new xrpl.Client(net)
  results = `\n\nConnecting to ${getNet()} ...`
  standbyResultField.value = results

  await client.connect()
  results += '\n\nConnected.'
  standbyResultField.value = results
```

Get the AMM information fields.

```javascript
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)

  const asset1_currency = asset1CurrencyField.value
  const asset1_issuer = asset1IssuerField.value
  const asset1_amount = asset1AmountField.value

  const asset2_currency = asset2CurrencyField.value
  const asset2_issuer = asset2IssuerField.value
  const asset2_amount = asset2AmountField.value
```

Format the `AMMCreate` transaction based on the combination of `XRP` and tokens.

```javascript
  let ammCreate = null
  
  results += '\n\nCreating AMM ...'
  standbyResultField.value = results
  
  // AMMCreate requires burning one owner reserve. We can look up that amount
  // (in drops) on the current network using server_state:
  const ss = await client.request({"command": "server_state"})
  const amm_fee_drops = ss.result.state.validated_ledger.reserve_inc.toString()

  if (asset1_currency == 'XRP') {

    ammCreate = {
      "TransactionType": "AMMCreate",
      "Account": standby_wallet.address,
      "Amount": JSON.stringify(asset1_amount * 1000000), // convert XRP to drops
      "Amount2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer,
        "value": asset2_amount
      },
      "TradingFee": 500, // 500 = 0.5%
      "Fee": amm_fee_drops
    }

  } else if (asset2_currency =='XRP') {

    ammCreate = {
      "TransactionType": "AMMCreate",
      "Account": standby_wallet.address,
      "Amount": {
        "currency": asset1_currency,
        "issuer": asset1_issuer,
        "value": asset1_amount
      },
      "Amount2": JSON.stringify(asset2_amount * 1000000), // convert XRP to drops
      "TradingFee": 500, // 500 = 0.5%
      "Fee": amm_fee_drops
    }

  } else {

    ammCreate = {
      "TransactionType": "AMMCreate",
      "Account": standby_wallet.address,
      "Amount": {
        "currency": asset1_currency,
        "issuer": asset1_issuer,
        "value": asset1_amount
      },
      "Amount2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer,
        "value": asset2_amount
      },
      "TradingFee": 500, // 500 = 0.5%
      "Fee": amm_fee_drops
    }
    
  }
```

Prepare the transaction for submission. Wrap the submission in a `try-catch` block to handle any errors.

```javascript
  try {
 
    const prepared_create = await client.autofill(ammCreate)
    results += `\n\nPrepared transaction:\n${JSON.stringify(prepared_create, null, 2)}`
    standbyResultField.value = results
    standbyResultField.scrollTop = standbyResultField.scrollHeight  
```

Sign the prepared transaction using the standy account wallet.

```javascript
    const signed_create = standby_wallet.sign(prepared_create)
    results += `\n\nSending AMMCreate transaction ...`
    standbyResultField.value = results
    standbyResultField.scrollTop = standbyResultField.scrollHeight
```

Submit the signed transaction to the XRPL.

```javascript
    const amm_create = await client.submitAndWait(signed_create.tx_blob)
    
    if (amm_create.result.meta.TransactionResult == "tesSUCCESS") {
      results += `\n\nTransaction succeeded.`
    } else {
      results += `\n\nError sending transaction: ${JSON.stringify(amm_create.result.meta.TransactionResult, null, 2)}`
    }
  
  } catch (error) {
    results += `\n\n${error.message}`
  }
```

Report the transaction results in the standby account log. Run the `checkAMM()` function to update the AMM's information in the AMM log.

```javascript
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight

  checkAMM()
      
  client.disconnect()
  
}
```


### Check AMM

This checks if an AMM already exists. While multiple tokens can share the same currency code, each issuer makes them unique. If the AMM pair exists, this responds with the AMM information, such as token pair, trading fees, etc.

```javascript
async function checkAMM() {
```

Connect to the XRP Ledger.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
```

Get the AMM info fields. When checking an AMM, you only need the currency code and issuer.

```javascript
  // Gets the issuer and currency code
  const asset1_currency = asset1CurrencyField.value
  const asset1_issuer = asset1IssuerField.value

  const asset2_currency = asset2CurrencyField.value
  const asset2_issuer = asset2IssuerField.value
```

Format the `amm_info` command based on the combination of `XRP` and tokens.

```javascript
  let amm_info_request = null

  // Get AMM info transaction

  if (asset1_currency == 'XRP') {

    amm_info_request = {
      "command": "amm_info",
      "asset": {
        "currency": "XRP"
      },
      "asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      },
      "ledger_index": "validated"
    }

  } else if (asset2_currency =='XRP') {

    amm_info_request = {
      "command": "amm_info",
      "asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "asset2": {
        "currency": "XRP"
      },
      "ledger_index": "validated"
    }

  } else {

    amm_info_request = {
      "command": "amm_info",
      "asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      },
      "ledger_index": "validated"
    }
    
  }
```

Submit the request in a `try-catch` block and update the AMM log.

```javascript
  try {
    const amm_info_result = await client.request(amm_info_request)
    ammInfo = `AMM Info:\n\n${JSON.stringify(amm_info_result.result.amm, null, 2)}`
  } catch(error) {
    ammInfo = `AMM Info:\n\n${error}`
  }
  
  ammInfoField.value = ammInfo
      
  client.disconnect()
  
}
```
