# Cancel a Check

_Requires the [Checks amendment][]._

This tutorial shows how to cancel a [Check](checks.html), which removes the [Check object from the ledger](check.html) without sending money.

You may want to cancel an incoming Check if you do not want it. You might cancel an outgoing Check if you made a mistake when sending it or if circumstances have changed. If a Check expires, it's also necessary to cancel it to remove it from the ledger so the sender gets their [owner reserve](reserves.html#owner-reserves) back.

{% set cancel_n = cycler(* range(1,99)) %}

## Prerequisites

To cancel a Check with this tutorial, you need the following:

- You need the ID of a Check object currently in the ledger.
    - For example, this tutorial includes examples that cancel a Check with the ID `49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0`, although you must use a different ID to go through these steps yourself.
- The **address** and **secret key** of a funded account to send the CheckCancel transaction. This address must be either the sender or the recipient of the Check, unless the Check is expired.
- A secure way to sign transactions, such as [RippleAPI][] or your own [`rippled` server](install-rippled.html).
- A client library that can connect to a `rippled` server, such as [RippleAPI][] or any HTTP or WebSocket library.
    - For more information, see [Get Started with the `rippled` API](get-started-with-the-rippled-api.html).


## {{cancel_n.next()}}. Prepare the CheckCancel transaction

Figure out the values of the [CheckCancel transaction][] fields. The following fields are the bare minimum; everything else is either optional or can be [auto-filled](transaction-common-fields.html#auto-fillable-fields) when signing:

| Field             | Value            | Description                           |
|:------------------|:-----------------|:--------------------------------------|
| `TransactionType` | String           | Use the string `CheckCancel` when canceling a Check. |
| `Account`         | String (Address) | The address of the sender who is canceling the Check. (In other words, your address.) |
| `CheckID`         | String           | The ID of the Check object in the ledger to cancel. You can get this information by looking up the metadata of the CheckCreate transaction using the [tx method][] or by looking for Checks using the [account_objects method][]. |

If you are using [RippleAPI](rippleapi-reference.html), you can use the `prepareCheckCancel()` helper method.

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

{% include '_snippets/tutorial-sign-step.md' %} <!--#{ fix md highlighting_ #}-->

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
{% include '_snippets/tutorial-submit-step.md' %} <!--#{ fix md highlighting_ #}-->

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

{% include '_snippets/wait-for-validation.md' %} <!--#{ fix md highlighting_ #}-->

## {{cancel_n.next()}}. Confirm final result

Use the [tx method][] with the CheckCancel transaction's identifying hash to check its status. Look for a `"TransactionResult": "tesSUCCESS"` field in the transaction's metadata, indicating that the transaction succeeded, and the field `"validated": true` in the result, indicating that this result is final.

Look for a `DeletedNode` object in the transaction metadata with `"LedgerEntryType": "Check"` to indicate that the transaction removed a [Check ledger object](check.html). The `LedgerIndex` of this object should match the ID of the Check.

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

<!--{# common link defs #}-->
[RippleAPI]: rippleapi-reference.html
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
