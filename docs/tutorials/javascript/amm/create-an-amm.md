# Create an AMM

This example shows how to:

1. Check if an AMM pair exists.
2. Issue tokens.
3. Create an AMM pair with the issued tokens and XRP.

[![Create AMM test harness](/docs/img/quickstart-create-amm1.png)](/docs/img/quickstart-create-amm1.png)

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/)<!-- {.github-code-download} --> archive to try each of the samples in your own browser.

{% admonition type="note" name="Note" %}
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

In the standby account fields:

1. Enter a [currency code](/docs/references/protocol/data-types/currency-formats.md#currency-codes) in the **Currency** field.
2. Enter a token issuer in the **Destination** field.
3. Click **Check AMM**.

[![Check AMM results](/docs/img/quickstart-create-amm3.png)](/docs/img/quickstart-create-amm3.png)


### Create Trustline

Create a trustline from the operational account to the standby account. In the standby account fields:

1. Enter a currency code in the **Currency** field.
2. Enter the maximum transfer limit in the **Amount** field.
3. Enter the operational account address in the **Destination** field.
4. Click **Create Trustline**.

[![Create trustline results](/docs/img/quickstart-create-amm4.png)](/docs/img/quickstart-create-amm4.png)


### Issue Tokens

Send issued tokens from the operational account to the standby account. In the operational account fields:

1. Select **Allow Rippling** and click **Configure Account**.
2. Enter a value in the **Amount** field.
3. Enter the standby account address in the **Destination** field.
4. Enter the currency code from the trustline in the **Currency** field.
5. Click **Send Currency**.

[![Issue token results](/docs/img/quickstart-create-amm5.png)](/docs/img/quickstart-create-amm5.png)


### Create an AMM

In the standby account fields:

1. Click **Get Balances** to verify how many tokens you have.
2. Enter how much XRP to add in the **XRP Balance** field.
3. Enter the operational account address in the **Destination** field.
4. Enter the currency code in the **Currency** field.
5. Enter how many issued tokens to add in the **Amount** field.
6. Click **Create AMM**.

[![Create AMM results](/docs/img/quickstart-create-amm6.png)](/docs/img/quickstart-create-amm6.png)


## Code Walkthrough

You can open `ripplex11-create-amm.js` from the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/) to view the source code.


### Check AMM

This checks if an AMM already exists. While multiple tokens can share the same currency code, each issuer makes them unique. When specifying an AMM, you must include the currency code and token issuer. If the AMM pair exists, this responds with the AMM information, such as token pair, trading fees, etc.

{% code-snippet file="/_code-samples/quickstart/js/ripplex11-create-amm.js" from="// Check AMM" language="js" /%}


### Create AMM

This sends the `AMMCreate` transaction and creates a new AMM, using the initial assets provided.

{% code-snippet file="/_code-samples/quickstart/js/ripplex11-create-amm.js" from="// Create AMM function" before="// Check AMM function" language="js" /%}
