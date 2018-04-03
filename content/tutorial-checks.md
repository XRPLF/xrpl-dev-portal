# Checks Tutorials

Checks in the XRP Ledger are similar to paper personal checks. This tutorial steps through the following processes for using Checks:

- [Send a Check](#send-a-check)
- [Look up Checks by sender address](#look-up-checks-by-sender-address)
- [Look up Checks by recipient address](#look-up-checks-by-recipient-address)
- [Cash a Check for an exact amount](#cash-a-check-for-an-exact-amount)
- [Cash a Check for a flexible amount](#cash-a-check-for-a-flexible-amount)
- [Cancel a Check](#cancel-a-check)


<!--{# Accounts used in old examples:
rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo snkuWqxoqt6aeykTbkEWrTMJHrWGM (as the sender)
rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy sn2Zh1tRZyodU9qNy9tMnQr9UbBss (as the dest.)

new examples:
rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za ssqSRChhs5qTiUzn9jYf25khmQuwL as the sender
rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis sn2DreVBky7kzbXJoaUMXMKCR8HAc as the receiver
#}-->

## Send a Check

Sending a Check involves sending a [CheckCreate transaction][], which creates a [Check object in the ledger](reference-ledger-format.html#check). Most of the fields of a CheckCreate transaction are similar to the fields of a (push) [Payment][], because a Check is like writing permission for an intended recipient to pull a payment from you. You can create a check for XRP or an issued currency.

{% set send_n = cycler(* range(1,99)) %}

### Prerequisites

To send a Check with this tutorial, you need the following:

- The **address** and **secret key** of a funded account to send the Check from.
    - You can use the [XRP Ledger Test Net Faucet](https://ripple.com/build/xrp-test-net/) to get a funded address and secret with 10,000 Test Net XRP.
- The **address** of a funded account to receive the Check.
- A secure way to sign transactions, such as [RippleAPI][] or your own [`rippled` server](tutorial-rippled-setup.html).
- A client library that can connect to a `rippled` server, such as [RippleAPI][] or any HTTP or WebSocket library.
    - For more information, see [Connecting to `rippled`](reference-rippled.html#connecting-to-rippled).

### {{send_n.next()}}. Prepare the CheckCreate transaction

Decide how much money the Check is for and who can cash it. Figure out the values of the [CheckCreate transaction][] fields. The following fields are the bare minimum; everything else is either optional or can be [auto-filled](reference-transaction-format.html#auto-fillable-fields) when signing:

| Field             | Value                     | Description                  |
|:------------------|:--------------------------|:-----------------------------|
| `TransactionType` | String                    | The value `CheckCreate` indicates this is a CheckCreate transaction. |
| `Account`         | String (Address)          | The address of the sender who is creating the Check. (In other words, your address.) |
| `Destination`     | String (Address)          | The address of the intended recipient who can cash the Check. |
| `SendMax`         | String or Object (Amount) | The maximum amount the sender can be debited when this Check gets cashed. For XRP, use a string representing drops of XRP. For issued currencies, use an object with `currency`, `issuer`, and `value` fields. See [Specifying Currency Amounts][] for details. If you want the recipient to be able to cash the Check for an exact amount of a non-XRP currency with a [transfer fee](concept-transfer-fees.html), remember to include an extra percentage to pay for the transfer fee. |

If you are using [RippleAPI](reference-rippleapi.html), you can use the `prepareCheckCreate()` helper method.

**Note:** RippleAPI supports Checks in versions 0.19.0 and up.

#### Example CheckCreate Preparation

The following examples create Checks from rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za to rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis for 100 XRP.

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC, WebSocket, or Commandline*

```
{
  "TransactionType": "CheckCreate",
  "Account": "rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za",
  "Destination": "rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
  "SendMax": "100000000",
  "Expiration": 570113521,
  "InvoiceID": "46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291",
  "DestinationTag": 1,
  "Fee": "12"
}
```

*RippleAPI*

```js
{% include 'code_samples/checks/js/prepareCreate.js' %}
```

<!-- MULTICODE_BLOCK_END -->

### {{send_n.next()}}. Sign the CheckCreate transaction

{% include 'snippets/tutorial-sign-step.md' %}

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include 'code_samples/checks/js/signCreate.js' %}
```

*WebSocket*

```json
{% include 'code_samples/checks/websocket/sign-create-req.json' %}
```

*Commandline*

```bash
{% include 'code_samples/checks/cli/sign-create-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->

#### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include 'code_samples/checks/js/sign-create-resp.txt' %}
```

*WebSocket*

```json
{% include 'code_samples/checks/websocket/sign-create-resp.json' %}
```

*Commandline*

```json
{% include 'code_samples/checks/cli/sign-create-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->

### {{send_n.next()}}. Submit the signed transaction

{% set step_1_link = "#1-prepare-the-checkcreate-transaction" %}
{% include 'snippets/tutorial-submit-step.md' %}

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include 'code_samples/checks/js/submitCreate.js' %}
```

*WebSocket*

```json
{% include 'code_samples/checks/websocket/submit-create-req.json' %}
```

*Commandline*

```bash
{% include 'code_samples/checks/cli/submit-create-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->

#### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include 'code_samples/checks/js/submit-create-resp.txt' %}
```

*WebSocket*

```json
{% include 'code_samples/checks/websocket/submit-create-resp.json' %}
```

*Commandline*

```json
{% include 'code_samples/checks/cli/submit-create-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->


### {{send_n.next()}}. Wait for validation

{% include 'snippets/wait-for-validation.md' %}

### {{send_n.next()}}. Confirm final result

Use the [`tx` method](reference-rippled.html#tx) with the CheckCreate transaction's identifying hash to check its status. Look for a `"TransactionResult": "tesSUCCESS"` field in the transaction's metadata, indicating that the transaction succeeded, and the field `"validated": true` in the result, indicating that this result is final.

Look for a `CreatedNode` object in the transaction metadata to indicate that the transaction created a [Check ledger object](reference-ledger-format.html#check). The `LedgerIndex` of this object is the ID of the Check. In the following example, the Check's ID is `49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0`.

**Note:** RippleAPI does not report the Check's ID when you look up a CheckCreate transaction. You can work around this by calculating the Check's ID from the [Check ID format](reference-ledger-format.html#check-id-format), as in the example RippleAPI code below. <!--{# TODO: Remove this and update the code samples if ripple-lib #876 gets fixed. #}-->

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```
{% include 'code_samples/checks/js/getCreateTx.js' %}
```

*WebSocket*

```json
{% include 'code_samples/checks/websocket/tx-create-req.json' %}
```

*Commandline*

```bash
{% include 'code_samples/checks/cli/tx-create-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->

#### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```
{% include 'code_samples/checks/js/get-create-tx-resp.txt' %}
```

*WebSocket*

```json
{% include 'code_samples/checks/websocket/tx-create-resp.json' %}
```

*Commandline*

```json
{% include 'code_samples/checks/cli/tx-create-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->


## Look up Checks by sender address

<!--{# TODO: Update if https://github.com/ripple/rippled/issues/2443 gets done #}-->

### 1. Look up all Checks for the address

To get a list of all incoming and outgoing Checks for an account, use the `account_objects` command with the sending account's address and set the `type` field of the request to `checks`.

**Note:** The commandline interface to the `account_objects` command does not accept the `type` field. You can use the [`json` command](reference-rippled.html#json) to send the JSON-RPC format request on the commandline instead.

**Caution:** RippleAPI does not have built-in support for the `account_objects` method. You can make a raw request in the WebSocket format using the `api.connection.request(websocket_request_json)` method. The response to this method is in the `rippled` API format. (For example, XRP is specified in integer "drops" rather than as a decimal.)

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include 'code_samples/checks/js/getChecks.js' %}
```

*JSON-RPC*

```json
{% include 'code_samples/checks/json-rpc/account_objects-req.json' %}
```

<!-- MULTICODE_BLOCK_END -->

#### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```
{% include 'code_samples/checks/js/get-checks-resp.txt' %}
```

*JSON-RPC*

```json
200 OK

{% include 'code_samples/checks/json-rpc/account_objects-resp.json' %}
```

<!-- MULTICODE_BLOCK_END -->

### 2. Filter the responses by sender

The response may include Checks where the account from the request is the sender and Checks where the account is the recipient. Each member of the `account_objects` array of the response represents one Check. For each such Check object, the address in the `Account` is address of that Check's sender.

The following pseudocode demonstrates how to filter the responses by sender:

```js
sender_address = "rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za"
account_objects_response = get_account_objects({
    account: sender_address,
    ledger_index: "validated",
    type: "check"
})

for (i=0; i < account_objects_response.account_objects.length; i++) {
  check_object = account_objects_response.account_objects[i]
  if (check_object.Account == sender_address) {
    log("Check from sender:", check_object)
  }
}
```


## Look up Checks by recipient address

### 1. Look up all Checks for the address

To get a list of all incoming and outgoing Checks for an account, use the `account_objects` command with the recipient account's address and set the `type` field of the request to `checks`.

**Note:** The commandline interface to the `account_objects` command does not accept the `type` field. You can use the [`json` command](reference-rippled.html#json) to send the JSON-RPC format request on the commandline instead.

**Note:** RippleAPI does not have built-in support for the `account_objects` method. You can make a raw request in the WebSocket format using the `api.connection.request(websocket_request_json)` method.

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include 'code_samples/checks/js/getChecks.js' %}
```

*JSON-RPC*

```json
{% include 'code_samples/checks/json-rpc/account_objects-req.json' %}
```

<!-- MULTICODE_BLOCK_END -->

#### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```
{% include 'code_samples/checks/js/get-checks-resp.txt' %}
```

*JSON-RPC*

```json
200 OK

{% include 'code_samples/checks/json-rpc/account_objects-resp.json' %}
```

<!-- MULTICODE_BLOCK_END -->


### 2. Filter the responses by recipient

The response may include Checks where the account from the request is the sender and Checks where the account is the recipient. Each member of the `account_objects` array of the response represents one Check. For each such Check object, the address in the `Destination` is address of that Check's recipient.

The following pseudocode demonstrates how to filter the responses by recipient:

```js
recipient_address = "rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za"
account_objects_response = get_account_objects({
    account: recipient_address,
    ledger_index: "validated",
    type: "check"
})

for (i=0; i < account_objects_response.account_objects.length; i++) {
  check_object = account_objects_response.account_objects[i]
  if (check_object.Account == recipient_address) {
    log("Check to recipient:", check_object)
  }
}
```

## Cancel a Check

Canceling a Check involves sending a [CheckCancel transaction][], which removes a [Check object from the ledger](reference-ledger-format.html#check) without redeeming it. Either the sender or the recipient of a Check can cancel it before it has been redeemed. If the Check has expired, anyone can cancel it (and no one can cash it).

{% set cancel_n = cycler(* range(1,99)) %}

### Prerequisites

To cancel a Check with this tutorial, you need the following:

- You need the ID of a Check object currently in the ledger.
    - For example, the ID of the Check created in the WebSocket examples above was `84C61BE9B39B2C4A2267F67504404F1EC76678806C1B901EA781D1E3B4CE0CD9`, although you must use a different ID to go through these steps yourself.
- The **address** and **secret key** of a funded account to send the CheckCancel transaction. This address must be either the sender or the recipient of the Check, unless the Check is expired.
- A secure way to sign transactions, such as [RippleAPI][] or your own [`rippled` server](tutorial-rippled-setup.html).
- A client library that can connect to a `rippled` server, such as [RippleAPI][] or any HTTP or WebSocket library.
    - For more information, see [Connecting to `rippled`](reference-rippled.html#connecting-to-rippled).


### {{cancel_n.next()}}. Prepare the CheckCancel transaction

Figure out the values of the [CheckCancel transaction][] fields. The following fields are the bare minimum; everything else is either optional or can be [auto-filled](reference-transaction-format.html#auto-fillable-fields) when signing:

| Field             | Value            | Description                           |
|:------------------|:-----------------|:--------------------------------------|
| `TransactionType` | String           | The value `CheckCancel` indicates this is a CheckCancel transaction. |
| `Account`         | String (Address) | The address of the sender who is canceling the Check. (In other words, your address.) |
| `CheckID`         | String           | The ID of the Check object in the ledger to cancel. You can get this information by looking up the metadata of the CheckCreate transaction using the [`tx` method](reference-rippled.html#tx) or by looking for Checks using the [`account_objects` method](reference-rippled.html#account-objects). |

If you are using [RippleAPI](reference-rippleapi.html), you can use the `prepareCheckCancel()` helper method.

**Note:** RippleAPI supports Checks in versions 0.19.0 and up.

#### Example CheckCancel Preparation

The following examples demonstrate how to cancel a Check.

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC, WebSocket, or Commandline*

```
{
  "TransactionType": "CheckCancel",
  "Account": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
  "CheckID": "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0",
  "Fee": "12"
}
```

*RippleAPI*

```js
{% include 'code_samples/checks/js/prepareCancel.js' %}
```

<!-- MULTICODE_BLOCK_END -->

### {{cancel_n.next()}}. Sign the CheckCancel transaction

{% include 'snippets/tutorial-sign-step.md' %}

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include 'code_samples/checks/js/signCancel.js' %}
```

*Commandline*

```bash
{% include 'code_samples/checks/cli/sign-cancel-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


#### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```
{% include 'code_samples/checks/js/sign-cancel-resp.txt' %}
```

*Commandline*

```json
{% include 'code_samples/checks/cli/sign-cancel-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->


### {{cancel_n.next()}}. Submit the signed CheckCancel transaction

{% set step_1_link = "#1-prepare-the-checkcancel-transaction" %}
{% include 'snippets/tutorial-submit-step.md' %}

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include 'code_samples/checks/js/submitCancel.js' %}
```

*Commandline*

```bash
{% include 'code_samples/checks/cli/submit-cancel-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


#### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include 'code_samples/checks/js/submit-cancel-resp.txt' %}
```

*Commandline*

```json
{% include 'code_samples/checks/cli/submit-cancel-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->

### {{cancel_n.next()}}. Wait for validation

{% include 'snippets/wait-for-validation.md' %}

### {{cancel_n.next()}}. Confirm final result

Use the [`tx` method](reference-rippled.html#tx) with the CheckCancel transaction's identifying hash to check its status. Look for a `"TransactionResult": "tesSUCCESS"` field in the transaction's metadata, indicating that the transaction succeeded, and the field `"validated": true` in the result, indicating that this result is final.

Look for a `DeletedNode` object in the transaction metadata with `"LedgerEntryType": "Check"` to indicate that the transaction removed a [Check ledger object](reference-ledger-format.html#check). The `LedgerIndex` of this object should match the ID of the Check.

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include 'code_samples/checks/js/getCancelTx.js' %}
```

*Commandline*

```bash
{% include 'code_samples/checks/cli/tx-cancel-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


#### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```json
{% include 'code_samples/checks/js/get-cancel-tx-resp.txt' %}
```

*Commandline*

```json
{% include 'code_samples/checks/cli/tx-cancel-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->


## Cash a Check for an exact amount

As long as the Check is in the ledger and not expired, the specified recipient can cash it to receive any exact amount up to the amount specified in the Check by sending a [CheckCash transaction][] with an `Amount` field.

The specified recipient can also [cash the check for a flexible amount](#cash-a-check-for-a-flexible-amount).

{% set cash_exact_n = cycler(* range(1,99)) %}

### Prerequisites

{% include 'snippets/checkcash-prereqs.md' %}

### {{cash_exact_n.next()}}. Prepare the CheckCash transaction

Figure out the values of the [CheckCash transaction][] fields. To cash a check for an exact amount, the following fields are the bare minimum; everything else is either optional or can be [auto-filled](reference-transaction-format.html#auto-fillable-fields) when signing:

| Field             | Value                     | Description                  |
|:------------------|:--------------------------|:-----------------------------|
| `TransactionType` | String                    | The value `CheckCancel` indicates this is a CheckCancel transaction. |
| `Account`         | String (Address)          | The address of the sender who is canceling the Check. (In other words, your address.) |
| `CheckID`         | String                    | The ID of the Check object in the ledger to cancel. You can get this information by looking up the metadata of the CheckCreate transaction using the [`tx` method](reference-rippled.html#tx) or by looking for Checks using the [`account_objects` method](reference-rippled.html#account-objects). |
| `Amount`          | String or Object (Amount) | The amount to redeem from the Check. For XRP, this must be a string specifying drops of XRP. For issued currencies, this is an object with `currency`, `issuer`, and `value` fields. The `currency` and `issuer` fields must match the corresponding fields in the Check object, and the `value` must be less than or equal to the amount in the Check object. For more information on specifying currency amounts, see [Specifying Currency Amounts][]. |


#### Example CheckCash Preparation for an exact amount

The following examples show how to prepare a transaction to cash a Check for a fixed amount.

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC, WebSocket, or Commandline*

```
{
  "Account": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
  "TransactionType": "CheckCash",
  "Amount": "100000000",
  "CheckID": "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334",
  "Fee": "12"
}
```

*RippleAPI*

```js
{% include 'code_samples/checks/js/prepareCashExact.js' %}
```

<!-- MULTICODE_BLOCK_END -->

### {{cash_exact_n.next()}}. Sign the CheckCash transaction

{% include 'snippets/tutorial-sign-step.md' %}

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```bash
{% include 'code_samples/checks/cli/sign-cash-exact-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


#### Example Response

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```json
{% include 'code_samples/checks/cli/sign-cash-exact-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->


### {{cash_exact_n.next()}}. Submit the signed CheckCash transaction

{% set step_1_link = "#1-prepare-the-checkcash-transaction" %}
{% include 'snippets/tutorial-submit-step.md' %}

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```bash
{% include 'code_samples/checks/cli/submit-cash-exact-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


#### Example Response

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```json
{% include 'code_samples/checks/cli/submit-cash-exact-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->

### {{cash_exact_n.next()}}. Wait for validation

{% include 'snippets/wait-for-validation.md' %}

### {{cash_exact_n.next()}}. Confirm final result

Use the [`tx` method](reference-rippled.html#tx) with the CheckCash transaction's identifying hash to check its status. Look for a `"TransactionResult": "tesSUCCESS"` field in the transaction's metadata, indicating that the transaction succeeded, and the field `"validated": true` in the result, indicating that this result is final.

If the check was cashed for an exact `Amount` and succeeded, you can assume that the recipient was credited for exactly that amount (with possible rounding for very large or very small amounts of issued currencies).

If cashing the Check failed, the Check remains in the ledger so you can try cashing again later. You may want to [cash the Check for a flexible amount](#cash-a-check-for-a-flexible-amount) instead.

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```bash
{% include 'code_samples/checks/cli/tx-cash-exact-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


#### Example Response

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```json
{% include 'code_samples/checks/cli/tx-cash-exact-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->



## Cash a Check for a flexible amount

As long as the Check is in the ledger and not expired, the specified recipient can cash it to receive a flexible amount by sending a [CheckCash transaction][] with a `DeliverMin` field. When cashing a Check in this way, the receiver gets as much as is possible to deliver, debiting the Check's sender for the Check's full `SendMax` amount or as much as is available. Cashing fails if it doesn't deliver at least the `DeliverMin` amount to the Check's recipient.

The specified recipient can also [cash the check for an exact amount](#cash-a-check-for-an-exact-amount).

{% set cash_flex_n = cycler(* range(1,99)) %}


### Prerequisites

{% include 'snippets/checkcash-prereqs.md' %}

### {{cash_flex_n.next()}}. Prepare the CheckCash transaction

Figure out the values of the [CheckCash transaction][] fields. To cash a check for a flexible amount, the following fields are the bare minimum; everything else is either optional or can be [auto-filled](reference-transaction-format.html#auto-fillable-fields) when signing:

| Field             | Value                     | Description                  |
|:------------------|:--------------------------|:-----------------------------|
| `TransactionType` | String                    | The value `CheckCancel` indicates this is a CheckCancel transaction. |
| `Account`         | String (Address)          | The address of the sender who is canceling the Check. (In other words, your address.) |
| `CheckID`         | String                    | The ID of the Check object in the ledger to cancel. You can get this information by looking up the metadata of the CheckCreate transaction using the [`tx` method](reference-rippled.html#tx) or by looking for Checks using the [`account_objects` method](reference-rippled.html#account-objects). |
| `DeliverMin`      | String or Object (Amount) | A minimum amount to receive from the Check. If you cannot receive at least this much, cashing the Check fails, leaving the Check in the ledger so you can try again. For XRP, this must be a string specifying drops of XRP. For issued currencies, this is an object with `currency`, `issuer`, and `value` fields. The `currency` and `issuer` fields must match the corresponding fields in the Check object, and the `value` must be less than or equal to the amount in the Check object. For more information on specifying currency amounts, see [Specifying Currency Amounts][]. |

#### Example CheckCash Preparation for a flexible amount

The following examples show how to prepare a transaction to cash a Check for a flexible amount.

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC, WebSocket, or Commandline*

```
{
  "Account": "rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
  "TransactionType": "CheckCash",
  "DeliverMin": "95000000",
  "CheckID": "2E0AD0740B79BE0AAE5EDD1D5FC79E3C5C221D23C6A7F771D85569B5B91195C2"
}
```

*RippleAPI*

```js
{% include 'code_samples/checks/js/prepareCashFlex.js' %}
```

<!-- MULTICODE_BLOCK_END -->

### {{cash_flex_n.next()}}. Sign the CheckCash transaction

{% include 'snippets/tutorial-sign-step.md' %}

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```bash
{% include 'code_samples/checks/cli/sign-cash-flex-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


#### Example Response

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```json
{% include 'code_samples/checks/cli/sign-cash-flex-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->


### {{cash_flex_n.next()}}. Submit the signed CheckCash transaction

{% set step_1_link = "#1-prepare-the-checkcash-transaction-1" %}
{% include 'snippets/tutorial-submit-step.md' %}

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```bash
{% include 'code_samples/checks/cli/submit-cash-flex-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


#### Example Response

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```json
{% include 'code_samples/checks/cli/submit-cash-flex-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->

### {{cash_flex_n.next()}}. Wait for validation

{% include 'snippets/wait-for-validation.md' %}

### {{cash_flex_n.next()}}. Confirm final result

Use the [`tx` method](reference-rippled.html#tx) with the CheckCash transaction's identifying hash to check its status. Look for a `"TransactionResult": "tesSUCCESS"` field in the transaction's metadata, indicating that the transaction succeeded, and the field `"validated": true` in the result, indicating that this result is final.

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```bash
{% include 'code_samples/checks/cli/tx-cash-flex-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


#### Example Response

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```json
{% include 'code_samples/checks/cli/tx-cash-flex-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->

#### Handling Errors

If cashing the Check failed with a `tec`-class code, look up the code in the [Full Transaction Response List](reference-transaction-format.html#full-transaction-response-list) and respond accordingly. Some common possibilities for CheckCash transactions:

| Result Code | Meaning | How to Respond |
|-------------|---------|----------------|
| `tecEXPIRED` | The Check has expired. | Cancel the Check and ask the sender to create a new Check with a later Expiration time. |
| `tecNO_ENTRY` | The Check ID doesn't exist. | Confirm that the `CheckID` from the CheckCash transaction is correct. Confirm that the Check has not already been canceled or successfully cashed. |
| `tecNO_LINE` | The recipient doesn't have a trust line for the Check's currency. | If you want to hold this currency from this issuer, create a trust line for the specified currency and issuer with a reasonable limit using a [TrustSet transaction][], then try to cash the check again. |
| `tecNO_PERMISSION` | The sender of the CheckCash transaction isn't the `Destination` of the Check. | Double-check the `Destination` of the Check. |
| `tecNO_AUTH` | The issuer of the currency from the check is using [Authorized Trust Lines](concept-authorized-trust-lines.html) but the recipient's trust line to the issuer is not approved. | Ask the issuer to authorize this trust line, then try again to cash the Check after they do. |
| `tecPATH_PARTIAL` | The Check could not deliver enough issued currency, either due to trust line limits or because the sender does not have enough balance of the currency to send (after including the issuer's [transfer fee](concept-transfer-fee.html), if there is one). | If the problem is the trust line limit, send a [TrustSet transaction][] to increase your limit (if desired) or lower your balance by spending some of the currency, then try to cash the Check again. If the problem is the sender's balance, wait for the sender to have more of the Check's currency, or try again to cash the Check for a lesser amount. |
| `tecUNFUNDED_PAYMENT` | The Check could not deliver enough XRP. | Wait for the sender to have more XRP, or try again to cash the Check for a lesser amount. |

### {{cash_flex_n.next()}}. Confirm delivered amount

If the Check was cashed for a flexible `DeliverMin` amount and succeeded, you can assume that the Check was cashed for at least the `DeliverMin` amount. To get the exact amount delivered, check the transaction metadata. <!--{# TODO: Update if RIPD-1623 adds a delivered_amount field. #}--> The metadata's `AffectedNodes` array contains one or two objects that reflect the change in balances from cashing the Check, depending on the type of currency.

- For XRP, the `AccountRoot` object of the Check's sender has its XRP `Balance` field debited. The `AccountRoot` object of the Check's recipient (the one who sent the CheckCash transaction) has its XRP `Balance` credited for at least the `DeliverMin` of the CheckCash transaction minus the [transaction cost](concept-transaction-cost.html) of sending the transaction.

    For example, the following `ModifiedNode` shows that the the account rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis, the Check's recipient and the sender of this CheckCash transaction, had its XRP balance change from `9999999970` drops to `10099999960` drops, meaning the recipient was credited a _net_ of 99.99999 XRP as a result of processing the transaction.

          {
            "ModifiedNode": {
              "FinalFields": {
                 "Account": "rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
                 "Balance": "10099999960",
                 "Flags": 0,
                 "OwnerCount": 2,
                 "Sequence": 5
              },
              "LedgerEntryType": "AccountRoot",
              "LedgerIndex": "7939126A732EBBDEC715FD3CCB056EB31E65228CA17E3B2901E7D30B90FD03D3",
              "PreviousFields": {
                 "Balance": "9999999970",
                 "Sequence": 4
              },
              "PreviousTxnID": "0283465F0D21BE6B1E91ABDE17266C24C1B4915BAAA9A88CC098A98D5ECD3E9E",
              "PreviousTxnLgrSeq": 8005334
            }
          }

    The net amount of 99.99999 XRP includes deducting the transaction cost is destroyed to pay for sending this CheckCash transaction. The following transaction instructions (excerpted) show that the transaction cost (the `Fee` field) was 10 drops of XRP. By adding this to the net balance change, we conclude that the recipient, rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis, was credited a _gross_ amount of exactly 100 XRP for cashing the Check.

        "Account" : "rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
        "TransactionType" : "CheckCash",
        "DeliverMin" : "95000000",
        "Fee" : "10",

- For issued currencies where the sender or recipient of the check is the issuer, the `RippleState` object representing the trust line between those accounts has its `Balance` adjusted in the favor of the Check's recipient.

    <!-- {# TODO: example of single-RippleState balance changes #}-->

- For issued currencies with a third-party issuer, there are changes to two `RippleState` objects, representing the trust lines connecting the sender to the issuer, and the issuer to the recipient. The `RippleState` object representing the relationship between the Check's sender and the issuer has its `Balance` changed in favor of the issuer, and the `RippleState` object representing the relationship between the issuer and the recipient has its `Balance` changed in favor of the recipient.

    <!--{# TODO: example of double-RippleState balance changes #}-->

    - If the issued currency has a [transfer fee](concept-transfer-fees.html), the Check's sender may be debited more than the recipient is credited. (The difference is the transfer fee, which is returned to the issuer as a decreased net obligation.)


<!--{# common links TODO change this after PR#321 #}-->
[Specifying Currency Amounts]: reference-rippled.html#specifying-currency-amounts
[RippleAPI]: reference-rippleapi.html
{% include 'snippets/tx-type-links.md' %}
