# Send a Check

_Requires the [Checks amendment][]._

Sending a Check is like writing permission for an intended recipient to pull a payment from you. The outcome of this process is a [Check object in the ledger](check.html) which the recipient can cash later.

In many cases, you want to send a [Payment][] instead of a Check, since that delivers the money directly to the recipient in one step. However, if your intended recipient uses [DepositAuth](depositauth.html), you cannot send them Payments directly, so a Check is a good alternative.

This tutorial uses the example of a fictitious company, BoxSend SG (whose XRP Ledger address is rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za) paying a fictitious cryptocurrency consulting company named Grand Payments (with XRP Ledger address rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis) for some consulting work. Grand Payments prefers be paid in XRP, but to simplify their taxes and regulation, only accepts payments they've explicitly approved.

Outside of the XRP Ledger, Grand Payments sends an invoice to BoxSend SG with the ID `46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291`, and requests a Check for 100 XRP be sent to Grand Payments' XRP Ledger address of rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis.

{% set send_n = cycler(* range(1,99)) %}

## Prerequisites

To send a Check with this tutorial, you need the following:

- The **address** and **secret key** of a funded account to send the Check from.
    - You can use the [XRP Ledger Test Net Faucet](xrp-test-net-faucet.html) to get a funded address and secret with 10,000 Test Net XRP.
- The **address** of a funded account to receive the Check.
- A secure way to sign transactions, such as [RippleAPI][] or your own [`rippled` server](install-rippled.html).
- A client library that can connect to a `rippled` server, such as [RippleAPI][] or any HTTP or WebSocket library.
    - For more information, see [Get Started with the `rippled` API](get-started-with-the-rippled-api.html).

## {{send_n.next()}}. Prepare the CheckCreate transaction

Decide how much money the Check is for and who can cash it. Figure out the values of the [CheckCreate transaction][] fields. The following fields are the bare minimum; everything else is either optional or can be [auto-filled](transaction-common-fields.html#auto-fillable-fields) when signing:

| Field             | Value                     | Description                  |
|:------------------|:--------------------------|:-----------------------------|
| `TransactionType` | String                    | Use the string `CheckCreate` here. |
| `Account`         | String (Address)          | The address of the sender who is creating the Check. (In other words, your address.) |
| `Destination`     | String (Address)          | The address of the intended recipient who can cash the Check. |
| `SendMax`         | String or Object (Amount) | The maximum amount the sender can be debited when this Check gets cashed. For XRP, use a string representing drops of XRP. For issued currencies, use an object with `currency`, `issuer`, and `value` fields. See [Specifying Currency Amounts][] for details. If you want the recipient to be able to cash the Check for an exact amount of a non-XRP currency with a [transfer fee](transfer-fees.html), remember to include an extra percentage to pay for the transfer fee. (For example, for the recipient to cash a Check for 100 CAD from an issuer with a 2% transfer fee, you must set the `SendMax` to 102 CAD from that issuer.) |

If you are using [RippleAPI](rippleapi-reference.html), you can use the `prepareCheckCreate()` helper method.

**Note:** RippleAPI supports Checks in versions 0.19.0 and up.

### Example CheckCreate Preparation

The following example shows a prepared Check from BoxSend SG (rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za) to Grand Payments (rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis) for 100 XRP. As additional (optional) metadata, BoxSend SG adds the ID of the invoice from Grand Payments so Grand Payments knows which invoice this Check is intended to pay.

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/prepareCreate.js' %}
```

*JSON-RPC, WebSocket, or Commandline*

```
{
  "TransactionType": "CheckCreate",
  "Account": "rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za",
  "Destination": "rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
  "SendMax": "100000000",
  "InvoiceID": "46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291"
}
```

<!-- MULTICODE_BLOCK_END -->

## {{send_n.next()}}. Sign the CheckCreate transaction

{% include '_snippets/tutorial-sign-step.md' %}
<!--{#_ #}-->

### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/signCreate.js' %}
```

*WebSocket*

```json
{% include '_code-samples/checks/websocket/sign-create-req.json' %}
```

*Commandline*

```bash
{% include '_code-samples/checks/cli/sign-create-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->

#### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/sign-create-resp.txt' %}
```

*WebSocket*

```json
{% include '_code-samples/checks/websocket/sign-create-resp.json' %}
```

*Commandline*

```json
{% include '_code-samples/checks/cli/sign-create-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->

## {{send_n.next()}}. Submit the signed transaction

{% set step_1_link = "#1-prepare-the-checkcreate-transaction" %}
{% include '_snippets/tutorial-submit-step.md' %}
<!--{#_ #}-->

### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/submitCreate.js' %}
```

*WebSocket*

```json
{% include '_code-samples/checks/websocket/submit-create-req.json' %}
```

*Commandline*

```bash
{% include '_code-samples/checks/cli/submit-create-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->

### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/submit-create-resp.txt' %}
```

*WebSocket*

```json
{% include '_code-samples/checks/websocket/submit-create-resp.json' %}
```

*Commandline*

```json
{% include '_code-samples/checks/cli/submit-create-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->


## {{send_n.next()}}. Wait for validation

{% include '_snippets/wait-for-validation.md' %}
<!--{#_ #}-->

## {{send_n.next()}}. Confirm final result

Use the [tx method][] with the CheckCreate transaction's identifying hash to check its status. Look for a `"TransactionResult": "tesSUCCESS"` field in the transaction's metadata, indicating that the transaction succeeded, and the field `"validated": true` in the result, indicating that this result is final.

Look for a `CreatedNode` object in the transaction metadata with a `LedgerEntryType` of `"Check"`. This indicates that the transaction created a [Check ledger object](check.html). The `LedgerIndex` of this object is the ID of the Check. In the following example, the Check's ID is `84C61BE9B39B2C4A2267F67504404F1EC76678806C1B901EA781D1E3B4CE0CD9`.

**Note:** RippleAPI does not report the Check's ID when you look up a CheckCreate transaction. You can work around this by calculating the Check's ID from the [Check ID format](check.html#check-id-format), as in the example RippleAPI code below, or you can use the [getAccountObjects() method](rippleapi-reference.html#getaccountobjects) to look up the Check and find its ID.

### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```
{% include '_code-samples/checks/js/getCreateTx.js' %}
```

*WebSocket*

```json
{% include '_code-samples/checks/websocket/tx-create-req.json' %}
```

*Commandline*

```bash
{% include '_code-samples/checks/cli/tx-create-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->

### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```
{% include '_code-samples/checks/js/get-create-tx-resp.txt' %}
```

*WebSocket*

```json
{% include '_code-samples/checks/websocket/tx-create-resp.json' %}
```

*Commandline*

```json
{% include '_code-samples/checks/cli/tx-create-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->

<!--{# common link defs #}-->
[RippleAPI]: rippleapi-reference.html
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
