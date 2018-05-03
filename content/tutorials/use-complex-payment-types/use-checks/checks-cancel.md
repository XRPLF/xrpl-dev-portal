# Cancel a Check

This tutorial shows how to cancel a [Check](concept-checks.html), which removes the [Check object from the ledger](reference-ledger-format.html#check) without sending money.

You may want to cancel an incoming Check if you do not want it. You might cancel an outgoing Check if you made a mistake when sending it or if circumstances have changed. If a Check expires, it's also necessary to cancel it to remove it from the ledger so the sender gets their [owner reserve](concept-reserves.html#owner-reserves) back.

{% set cancel_n = cycler(* range(1,99)) %}

## Prerequisites

To cancel a Check with this tutorial, you need the following:

- You need the ID of a Check object currently in the ledger.
    - For example, this tutorial includes examples that cancel a Check with the ID `49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0`, although you must use a different ID to go through these steps yourself.
- The **address** and **secret key** of a funded account to send the CheckCancel transaction. This address must be either the sender or the recipient of the Check, unless the Check is expired.
- A secure way to sign transactions, such as [RippleAPI][] or your own [`rippled` server](tutorial-rippled-setup.html).
- A client library that can connect to a `rippled` server, such as [RippleAPI][] or any HTTP or WebSocket library.
    - For more information, see [Connecting to `rippled`](reference-rippled.html#connecting-to-rippled).


## {{cancel_n.next()}}. Prepare the CheckCancel transaction

Figure out the values of the [CheckCancel transaction][] fields. The following fields are the bare minimum; everything else is either optional or can be [auto-filled](reference-transaction-format.html#auto-fillable-fields) when signing:

| Field             | Value            | Description                           |
|:------------------|:-----------------|:--------------------------------------|
| `TransactionType` | String           | Use the string `CheckCancel` when canceling a Check. |
| `Account`         | String (Address) | The address of the sender who is canceling the Check. (In other words, your address.) |
| `CheckID`         | String           | The ID of the Check object in the ledger to cancel. You can get this information by looking up the metadata of the CheckCreate transaction using the [`tx` method](reference-rippled.html#tx) or by looking for Checks using the [`account_objects` method](reference-rippled.html#account-objects). |

If you are using [RippleAPI](reference-rippleapi.html), you can use the `prepareCheckCancel()` helper method.

**Note:** RippleAPI supports Checks in versions 0.19.0 and up.

### Example CheckCancel Preparation

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
{% include '_code-samples/checks/js/prepareCancel.js' %}
```

<!-- MULTICODE_BLOCK_END -->

## {{cancel_n.next()}}. Sign the CheckCancel transaction

{% include '_snippets/tutorial-sign-step.md' %}

### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/signCancel.js' %}
```

*Commandline*

```bash
{% include '_code-samples/checks/cli/sign-cancel-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```
{% include '_code-samples/checks/js/sign-cancel-resp.txt' %}
```

*Commandline*

```json
{% include '_code-samples/checks/cli/sign-cancel-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->


## {{cancel_n.next()}}. Submit the signed CheckCancel transaction

{% set step_1_link = "#1-prepare-the-checkcancel-transaction" %}
{% include '_snippets/tutorial-submit-step.md' %}

### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/submitCancel.js' %}
```

*Commandline*

```bash
{% include '_code-samples/checks/cli/submit-cancel-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/submit-cancel-resp.txt' %}
```

*Commandline*

```json
{% include '_code-samples/checks/cli/submit-cancel-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->

## {{cancel_n.next()}}. Wait for validation

{% include '_snippets/wait-for-validation.md' %}

## {{cancel_n.next()}}. Confirm final result

Use the [`tx` method](reference-rippled.html#tx) with the CheckCancel transaction's identifying hash to check its status. Look for a `"TransactionResult": "tesSUCCESS"` field in the transaction's metadata, indicating that the transaction succeeded, and the field `"validated": true` in the result, indicating that this result is final.

Look for a `DeletedNode` object in the transaction metadata with `"LedgerEntryType": "Check"` to indicate that the transaction removed a [Check ledger object](reference-ledger-format.html#check). The `LedgerIndex` of this object should match the ID of the Check.

### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/getCancelTx.js' %}
```

*Commandline*

```bash
{% include '_code-samples/checks/cli/tx-cancel-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```json
{% include '_code-samples/checks/js/get-cancel-tx-resp.txt' %}
```

*Commandline*

```json
{% include '_code-samples/checks/cli/tx-cancel-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->

<!--{# common links #}-->
[Specifying Currency Amounts]: reference-rippled.html#specifying-currency-amounts
[RippleAPI]: reference-rippleapi.html
{% include '_snippets/tx-type-links.md' %}
