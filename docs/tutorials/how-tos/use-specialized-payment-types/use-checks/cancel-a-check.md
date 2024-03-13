---
html: cancel-a-check.html
parent: use-checks.html
seo:
    description: Cancel a Check object without sending money.
labels:
  - Checks
---
# Cancel a Check

This tutorial shows how to cancel a [Check](../../../../concepts/payment-types/checks.md), which removes the [Check object from the ledger](../../../../references/protocol/ledger-data/ledger-entry-types/check.md) without sending money.

You may want to cancel an incoming Check if you do not want it. You might cancel an outgoing Check if you made a mistake when sending it or if circumstances have changed. If a Check expires, it's also necessary to cancel it to remove it from the ledger so the sender gets their [owner reserve](../../../../concepts/accounts/reserves.md#owner-reserves) back.

## Prerequisites

To cancel a Check with this tutorial, you need the following:

- You need the ID of a Check object currently in the ledger.
    - For example, this tutorial includes examples that cancel a Check with the ID `49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0`, although you must use a different ID to go through these steps yourself.
- The **address** and **secret key** of a funded account to send the CheckCancel transaction. This address must be either the sender or the recipient of the Check, unless the Check is expired.
- A [secure way to sign transactions](../../../../concepts/transactions/secure-signing.md).
- A [client library](../../../../references/client-libraries.md) or any HTTP or WebSocket library.


## 1. Prepare the CheckCancel transaction

Figure out the values of the [CheckCancel transaction][] fields. The following fields are the bare minimum; everything else is either optional or can be [auto-filled](../../../../references/protocol/transactions/common-fields.md#auto-fillable-fields) when signing:

| Field             | Value            | Description                           |
|:------------------|:-----------------|:--------------------------------------|
| `TransactionType` | String           | Use the string `CheckCancel` when canceling a Check. |
| `Account`         | String (Address) | The address of the sender who is canceling the Check. (In other words, your address.) |
| `CheckID`         | String           | The ID of the Check object in the ledger to cancel. You can get this information by looking up the metadata of the CheckCreate transaction using the [tx method][] or by looking for Checks using the [account_objects method][]. |

### Example CheckCancel Preparation

The following examples show how to cancel a Check.

{% tabs %}

{% tab label="JSON-RPC, WebSocket, or Commandline" %}
```json
{
  "TransactionType": "CheckCancel",
  "Account": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
  "CheckID": "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0",
  "Fee": "12"
}
```
{% /tab %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/prepareCancel.js" language="js" /%}
{% /tab %}

{% /tabs %}

## 2. Sign the CheckCancel transaction

{% partial file="/docs/_snippets/tutorial-sign-step.md" /%} 

### Example Request

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/signCancel.js" language="js" /%}
{% /tab %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/sign-cancel-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}


### Example Response

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/sign-cancel-resp.txt" language="" /%}
{% /tab %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/sign-cancel-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}


## 3. Submit the signed CheckCancel transaction

{% partial file="/docs/_snippets/tutorial-submit-step.md" /%} 

### Example Request

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/submitCancel.js" language="js" /%}
{% /tab %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/submit-cancel-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}


### Example Response

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/submit-cancel-resp.txt" language="js" /%}
{% /tab %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/submit-cancel-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}

## 4. Wait for validation

{% partial file="/docs/_snippets/wait-for-validation.md" /%} 

## 5. Confirm final result

Use the [tx method][] with the CheckCancel transaction's identifying hash to check its status. Look for a `"TransactionResult": "tesSUCCESS"` field in the transaction's metadata, indicating that the transaction succeeded, and the field `"validated": true` in the result, indicating that this result is final.

Look for a `DeletedNode` object in the transaction metadata with `"LedgerEntryType": "Check"` to indicate that the transaction removed a [Check ledger object](../../../../references/protocol/ledger-data/ledger-entry-types/check.md). The `LedgerIndex` of this object should match the ID of the Check.

### Example Request

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/getCancelTx.js" language="js" /%}
{% /tab %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/tx-cancel-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}


### Example Response

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/get-cancel-tx-resp.txt" language="json" /%}
{% /tab %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/tx-cancel-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
