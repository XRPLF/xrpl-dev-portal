# Add Assets to an AMM

Follow the steps from the [Create an AMM](./create-an-amm-in-javascript.md) tutorial before proceeding.

This example shows how to:

1. Deposit assets to an existing [AMM](../../concepts/tokens/decentralized-exchange/automated-market-makers.md) and receive LP tokens.
2. Vote on AMM trading fees.
3. Check the value of your LP tokens.
4. Redeem LP tokens for assets in the AMM pair.

[![Add assets to AMM test harness](/docs/img/quickstart-add-to-amm1.png)](/docs/img/quickstart-add-to-amm1.png)

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/) archive to try each of the samples in your own browser.

{% admonition type="info" name="Note" %}
Without the Quickstart Samples, you will not be able to try the examples that follow.
{% /admonition %}


## Usage

### Get Accounts

1. Open `12.add-to-amm.html` in a browser.
2. Select **Testnet** or **Devnet**
3. Get test accounts.
   - If you have existing account seeds:
     1. Paste account seeds in the **Seeds** field.
     2. Click **Get Accounts from Seeds**.
   - If you don't have account seeds:
     1. Click **Get New Standby Account**.
     2. Click **Get New Operational Account**.

[![Get account results](/docs/img/quickstart-add-to-amm2.png)](/docs/img/quickstart-add-to-amm2.png)


### Get the AMM

Use the information from either the XRP/Token or Token/Token AMM you created in [Create an AMM](./create-an-amm-in-javascript.md#create-an-xrp/token-amm).

1. Enter a [currency code](/docs/references/protocol/data-types/currency-formats.md#currency-codes) in the **Asset 1 Currency** field. For example, `XRP`.
2. Enter a second currency code in the **Asset 2 Currency** field. For example, `TST`.
3. Enter the operational account address in the **Asset 2 Issuer** field.
4. Click **Check AMM**.

[![Get AMM results](/docs/img/quickstart-add-to-amm3.png)](/docs/img/quickstart-add-to-amm3.png)


### Deposit a Single Asset to the AMM

You can deposit either asset, but depositing only one asset reduces the amount of LP tokens you receive.

1. Click **Get Balances** to verify how many tokens you have.
2. Enter a value in the **Asset 1 Amount** field.
3. Click **Add to AMM**.

[![Add assets to AMM results](/docs/img/quickstart-add-to-amm4.png)](/docs/img/quickstart-add-to-amm4.png)


### Deposit Both Assets to the AMM

1. Click **Get Balances** to verify how many tokens you have.
2. Enter a value in the **Asset 1 Amount** field.
3. Enter a value in the **Asset 2 Amount** field.
4. Click **Add to AMM**.

[![Add assets to AMM results](/docs/img/quickstart-add-to-amm5.png)](/docs/img/quickstart-add-to-amm5.png)


### Vote on trading fees

1. Enter a value in the **Trading Fee** field. The proposed fee is in units of 1/100,000; a value of 1 is equivalent to 0.001%. The maximum value is 1000, indicating a 1% fee.
2. Click **Vote on Fee**.

[![Vote on trading fees results](/docs/img/quickstart-add-to-amm6.png)](/docs/img/quickstart-add-to-amm6.png)


### Redeem Your LP Tokens

1. Click **Get LP Value**.
2. Enter a value in the **LP Tokens** field.
3. Click **Redeem LP**.

[![Get LP token value results](/docs/img/quickstart-add-to-amm7.png)](/docs/img/quickstart-add-to-amm7.png)


## Code Walkthrough

You can open `ripplex12-add-to-amm.js` from the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/) to view the source code.


### Add Assets to an Existing AMM

This code checks if you're trying to add one or both assets, and then modifies the `AMMDeposit` transaction to be either a single or double-asset deposit.

```javascript
async function addAssets() {
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

Format the `AMMDeposit` transaction based on the combination of `XRP` and tokens.

```javascript
  // Check for all combinations of asset deposits.
  let ammdeposit = null

  if (asset1_currency == "XRP" && asset2_currency && asset1_amount && asset2_amount ) {
    
    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: "XRP"
      },
      "Asset2": {
        currency: asset2_currency,
        issuer: asset2_issuer
      },
      "Account": standby_wallet.address,
      "Amount": xrpl.xrpToDrops(asset1_amount),
      "Amount2": {
        currency: asset2_currency,
        issuer: asset2_issuer,
        value: asset2_amount
      },
      "Flags": 0x00100000
    }

  } else if ( asset1_currency && asset2_currency == "XRP" && asset1_amount && asset2_amount ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: asset1_currency,
        issuer: asset1_issuer
      },
      "Asset2": {
        currency: "XRP"
      },
      "Account": standby_wallet.address,
      "Amount": {
        currency: asset1_currency,
        issuer: asset1_issuer,
        value: asset1_amount
      },
      "Amount2": xrpl.xrpToDrops(asset2_amount),
      "Flags": 0x00100000
    }

  } else if ( asset1_currency && asset2_currency && asset1_amount && asset2_amount ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: asset1_currency,
        issuer: asset1_issuer
      },
      "Asset2": {
        currency: asset2_currency,
        issuer: asset2_issuer
      },
      "Account": standby_wallet.address,
      "Amount": {
        currency: asset1_currency,
        issuer: asset1_issuer,
        value: asset1_amount
      },
      "Amount2": {
        currency: asset2_currency,
        issuer: asset2_issuer,
        value: asset2_amount
      },
      "Flags": 0x00100000
    }

  } else if ( asset1_currency == "XRP" && asset2_currency && asset1_amount ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: "XRP"
      },
      "Asset2": {
        currency: asset2_currency,
        issuer: asset2_issuer
      },
      "Account": standby_wallet.address,
      "Amount": xrpl.xrpToDrops(asset1_amount),
      "Flags": 0x00080000
    }

  } else if ( asset1_currency && asset2_currency == "XRP" && asset1_amount ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: asset1_currency,
        issuer: asset1_issuer
      },
      "Asset2": {
        currency: "XRP"
      },
      "Account": standby_wallet.address,
      "Amount": {
        currency: asset1_currency,
        issuer: asset1_issuer,
        value: asset1_amount
      },
      "Flags": 0x00080000
    }

  } else if ( asset1_currency == "XRP" && asset2_currency && asset2_amount ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: "XRP"
      },
      "Asset2": {
        currency: asset2_currency,
        issuer: asset2_issuer
      },
      "Account": standby_wallet.address,
      "Amount": {
        currency: asset2_currency,
        issuer: asset2_issuer,
        value: asset2_amount
      },
      "Flags": 0x00080000
    }

  } else if ( asset1_currency && asset2_currency && asset1_amount ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: asset1_currency,
        issuer: asset1_issuer
      },
      "Asset2": {
        currency: asset2_currency,
        issuer: asset2_issuer
      },
      "Account": standby_wallet.address,
      "Amount": {
        currency: asset1_currency,
        issuer: asset1_issuer,
        value: asset1_amount
      },
      "Flags": 0x00080000
    }

  } else if ( asset1_currency && asset2_currency && asset2_amount ) {

    ammdeposit = {
      "TransactionType": "AMMDeposit",
      "Asset": {
        currency: asset1_currency,
        issuer: asset1_issuer
      },
      "Asset2": {
        currency: asset2_currency,
        issuer: asset2_issuer
      },
      "Account": standby_wallet.address,
      "Amount": {
        currency: asset2_currency,
        issuer: asset2_issuer,
        value: asset2_amount
      },
      "Flags": 0x00080000
    }

  } else {

    results += `\n\nNo assets selected to add ...`
    standbyResultField.value = results
    standbyResultField.scrollTop = standbyResultField.scrollHeight
    return

  }
```

Prepare the transaction for submission. Wrap the submission in a `try-catch` block to handle any errors.

```javascript
  try {
 
  const prepared_deposit = await client.autofill(ammdeposit)
  results += `\n\nPrepared transaction:\n${JSON.stringify(prepared_deposit, null, 2)}`
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight
```

Sign the transaction using the standby account wallet.

```javascript
  const signed_deposit = standby_wallet.sign(prepared_deposit)
  results += `\n\nSending AMMDeposit transaction ...`
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight
```

Submit the signed transaction to the XRPL. Run the `checkAMM()` function to update the AMM's information in the AMM log on a successful transaction.

```javascript
  const lp_deposit = await client.submitAndWait(signed_deposit.tx_blob)
  
  if (lp_deposit.result.meta.TransactionResult == "tesSUCCESS") {
    results += `\n\nTransaction succeeded.`
    checkAMM()
  } else {
    results += `\n\nError sending transaction: ${JSON.stringify(lp_deposit.result.meta.TransactionResult, null, 2)}`
  }

  } catch (error) {
    results += `\n\n${error.message}`
  }
```

Report the transaction results in the standby account log.

```javascript
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight

  client.disconnect()

}
```


### Vote on Trading Fees

Trading fees are applied to any transaction that interacts with the AMM. As with the `addAssets()` function, this one checks the combination of assets provided to modifty the `ammVote` transaction.

```javascript
async function voteFees() {
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

Get the AMM information and vote fee fields.

```javascript
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const voteFee = standbyFeeField.value

  const asset1_currency = asset1CurrencyField.value
  const asset1_issuer = asset1IssuerField.value

  const asset2_currency = asset2CurrencyField.value
  const asset2_issuer = asset2IssuerField.value
```

Format the `AMMVote` transaction based on the combination of `XRP` and tokens.

```javascript
  let ammvote = null

  if ( asset1_currency == "XRP" ) {

    ammvote = {
      "TransactionType": "AMMVote",
      "Asset": {
        "currency": "XRP"
      },
      "Asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      },
      "Account": standby_wallet.address,
      "TradingFee": Number(voteFee)
    }

  } else if ( asset2_currency == "XRP" ) {

    ammvote = {
      "TransactionType": "AMMVote",
      "Asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "Asset2": {
        "currency": "XRP"
      },
      "Account": standby_wallet.address,
      "TradingFee": Number(voteFee)
    }
  } else {

    ammvote = {
      "TransactionType": "AMMVote",
      "Asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "Asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      },
      "Account": standby_wallet.address,
      "TradingFee": Number(voteFee)
    }

  }
```

Prepare the transaction for submission. Wrap the submission in a `try-catch` block to handle any errors.

```javascript
  try {
  
  const prepared_vote = await client.autofill(ammvote)
  results += `\n\nPrepared transaction:\n${JSON.stringify(prepared_vote, null, 2)}`
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight
```

Sign the prepared transaction using the standby account wallet.

```javascript
  const signed_vote = standby_wallet.sign(prepared_vote)
  results += `\n\nSending AMMVote transaction ...`
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight  
```

Submit the signed transaction to the XRPL. Run the `checkAMM()` function to update the AMM's information in the AMM log on a successful transaction.

```javascript
  const response_vote = await client.submitAndWait(signed_vote.tx_blob)
  if (response_vote.result.meta.TransactionResult == "tesSUCCESS") {
    results += `\n\nTransaction succeeded.`
    checkAMM()
  } else {
    results += `\n\nError sending transaction: ${JSON.stringify(response_vote.result.meta.TransactionResult, null, 2)}`
  }

} catch (error) {
  results += `\n\n${error.message}`
}
```

Report the transaction results in the standby account log.

```javascript
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight  

  client.disconnect()

}
```


### Calculate the Value of Your LP Tokens

This function gets your LP token balance and calculates what you can withdraw from the AMM.

```javascript
async function calculateLP() {
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
  const standby_wallet = standbyAccountField.value

  const asset1_currency = asset1CurrencyField.value
  const asset1_issuer = asset1IssuerField.value

  const asset2_currency = asset2CurrencyField.value
  const asset2_issuer = asset2IssuerField.value
```

Format the `amm_info` command based on the combination of `XRP` and tokens.

```javascript
  let amm_info = null

  if ( asset1_currency == "XRP" ) {
  
    amm_info = {
      "command": "amm_info", 
      "asset": {
        "currency": "XRP"
      },
      "asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      }
    }
  
  } else if ( asset2_currency == "XRP" ) {

    amm_info = {
      "command": "amm_info", 
      "asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "asset2": {
        "currency": "XRP"
      }
    }

  } else {

    amm_info = {
      "command": "amm_info", 
      "asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      }
    }

  }
```

Get the standby account wallet balances and AMM details. Wrap the code in a `try-catch` block to handle any errors.

```javascript
  try {
  
  // Get LP token balance.
  standbyWalletBalances = await client.getBalances(standby_wallet)

  const amm_info_result = await client.request(amm_info)
```

Get the AMM account address. Any LP tokens received from depositing to the AMM is considered an issued token by that AMM account. Use the AMM account to find the LP token in the wallet balances and get the LP token balance.

```javascript
  // Get the AMM account address that issues LP tokens to depositors
  ammAccount = amm_info_result.result.amm.account

  const lpCurrency = standbyWalletBalances.find(item => item.issuer === ammAccount);

  const lpBalance = lpCurrency ? lpCurrency.value : 'Currency not found';
```

Check the AMM `value` fields to format the response. `XRP` is only reported as drops and doesn't have a `value` field. Although there isn't a dedicated method to calculate what you can redeem your LP tokens for, the math to do so is simple. The code checks the percentage of LP tokens in circulation that you own, and then applies that same percentage to the total assets in the AMM to give you their redemption value.

```javascript
  const my_share = lpBalance / amm_info_result.result.amm.lp_token.value

  let my_asset1 = null
  let my_asset2 = null

  if ( amm_info_result.result.amm.amount.value && amm_info_result.result.amm.amount2.value ) {

    my_asset1 = amm_info_result.result.amm.amount.value * my_share
    my_asset2 = amm_info_result.result.amm.amount2.value * my_share

    results += `\n\nI have a total of ${lpBalance} LP tokens that are worth:\n
    ${amm_info_result.result.amm.amount.currency}: ${my_asset1}
    ${amm_info_result.result.amm.amount2.currency}: ${my_asset2}`

  } else if ( amm_info_result.result.amm.amount.value == undefined ) {

    my_asset1 = (amm_info_result.result.amm.amount * my_share) / 1000000
    my_asset2 = amm_info_result.result.amm.amount2.value * my_share

    results += `\n\nI have a total of ${lpBalance} LP tokens that are worth:\n
    XRP: ${my_asset1}
    ${amm_info_result.result.amm.amount2.currency}: ${my_asset2}`

  } else {

    my_asset1 = amm_info_result.result.amm.amount.value * my_share
    my_asset2 = (amm_info_result.result.amm.amount2 * my_share) / 1000000

    results += `\n\nI have a total of ${lpBalance} LP tokens that are worth:\n
    ${amm_info_result.result.amm.amount.currency}: ${my_asset1}
    XRP: ${my_asset2}`

  }

  } catch (error) {
    results += `\n\n${error.message}`
  }
```

Report the transaction results in the standby account log.

```javascript
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight

  client.disconnect()

}
```


### Redeem Your LP Tokens

The code to redeem the LP tokens checks how many tokens you want to redeem, as well as the combination of assets to format `amm_info` and `AMMWithdraw`.

```javascript
async function redeemLP() {
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

  const asset2_currency = asset2CurrencyField.value
  const asset2_issuer = asset2IssuerField.value
```

Format the `amm_info` command based on the combination of `XRP` and tokens.

```javascript
  // Structure "amm_info" command based on asset combo.
  let amm_info = null

  if ( asset1_currency == "XRP" ) {
  
    amm_info = {
      "command": "amm_info", 
      "asset": {
        "currency": "XRP"
      },
      "asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      }
    }
  
  } else if ( asset2_currency == "XRP" ) {

    amm_info = {
      "command": "amm_info", 
      "asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "asset2": {
        "currency": "XRP"
      }
    }

  } else {

    amm_info = {
      "command": "amm_info", 
      "asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      }
    }

  }
```

Get the LP token information from the AMM.

```javascript
  // Get LP token info.

  let ammIssuer = null
  let ammCurrency = null
  const LPTokens = standbyLPField.value

  try {
  const amm_info_result = await client.request(amm_info)
  ammIssuer = amm_info_result.result.amm.lp_token.issuer
  ammCurrency = amm_info_result.result.amm.lp_token.currency
  } catch (error) {
    results += `\n\n${error.message}`
    standbyResultField.value = results
    standbyResultField.scrollTop = standbyResultField.scrollHeight
    return
  }
```

Format the `AMMWithdraw` transaction based on the combination of `XRP` and tokens. Add the LP token info into the transaction from the `amm_info` query.

```javascript
  // Structure ammwithdraw transaction based on asset combo.
  let ammwithdraw = null

  if ( asset1_currency == "XRP" ) {

    ammwithdraw = {
      "TransactionType": "AMMWithdraw",
      "Asset": {
        "currency": "XRP"
      },
      "Asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      },
      "Account": standby_wallet.address,
      "LPTokenIn": {
        currency: ammCurrency,
        issuer: ammIssuer,
        value: LPTokens
      },
      "Flags": 0x00010000
    }

  } else if ( asset2_currency == "XRP" ) {

    ammwithdraw = {
      "TransactionType": "AMMWithdraw",
      "Asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "Asset2": {
        "currency": "XRP"
      },
      "Account": standby_wallet.address,
      "LPTokenIn": {
        currency: ammCurrency,
        issuer: ammIssuer,
        value: LPTokens
      },
      "Flags": 0x00010000
    }

  } else {

    ammwithdraw = {
      "TransactionType": "AMMWithdraw",
      "Asset": {
        "currency": asset1_currency,
        "issuer": asset1_issuer
      },
      "Asset2": {
        "currency": asset2_currency,
        "issuer": asset2_issuer
      },
      "Account": standby_wallet.address,
      "LPTokenIn": {
        currency: ammCurrency,
        issuer: ammIssuer,
        value: LPTokens
      },
      "Flags": 0x00010000
    }

  }
```

Prepare the transaction for submission. Wrap the submission in a `try-catch` block to handle any errors.

```javascript
  try {

  const prepared_withdraw = await client.autofill(ammwithdraw)
  results += `\n\nPrepared transaction:\n${JSON.stringify(prepared_withdraw, null, 2)}`
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight    
```

Sign the prepared transaction with the standby account wallet.

```javascript
  const signed_withdraw = standby_wallet.sign(prepared_withdraw)
  results += `\n\nSending AMMWithdraw transaction ...`
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight
```

Submit the signed transaction to the XRPL. Update the AMM info log and get wallet balances on a successful transaction.

```javascript
  const response_withdraw = await client.submitAndWait(signed_withdraw.tx_blob)
  
  if (response_withdraw.result.meta.TransactionResult == "tesSUCCESS") {
    results += `\n\nTransaction succeeded.`
    checkAMM()
    getBalances()
  } else {
    results += `\n\nError sending transaction: ${JSON.stringify(response_withdraw.result.meta.TransactionResult, null, 2)}`
  }

  } catch (error) {
    results += `\n\n${error.message}`
  }
```

Report the transaction results to the standby account log.

```javascript
  standbyResultField.value = results
  standbyResultField.scrollTop = standbyResultField.scrollHeight

  client.disconnect()

}
```
