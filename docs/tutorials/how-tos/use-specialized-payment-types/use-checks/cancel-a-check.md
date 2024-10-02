---
seo:
    description: Cancel a Check without sending money.
labels:
  - Checks
---
# Cancel a Check

This tutorial shows how to cancel a [Check](../../../../concepts/payment-types/checks.md), which removes the [Check entry](../../../../references/protocol/ledger-data/ledger-entry-types/check.md) from the ledger without sending money.

You may want to cancel an incoming Check if you do not want it. You might cancel an outgoing Check if you made a mistake when sending it or if circumstances have changed. If a Check expires, it's also necessary to cancel it to remove it from the ledger so the sender gets their [owner reserve](../../../../concepts/accounts/reserves.md#owner-reserves) back.

## Prerequisites

- You should be familiar with the basics of using the [xrpl.js client library](../../../javascript/build-apps/get-started.md).
- You need an XRP Ledger account including its secret key. (You can get one on Testnet for free.) See also: [XRP Faucets](/resources/dev-tools/xrp-faucets).
- You need the ID of a Check ledger entry that you are either the sender or recipient of. See also: [Send a Check](./send-a-check.md).

## Source Code

The complete source code for this tutorial is available in the source repository for this website:

{% repo-link path="_code-samples/checks/js/" %}Checks sample code{% /repo-link %}

## Steps

### 1. Prepare the CheckCancel transaction

Figure out the values of the [CheckCancel transaction][] fields. The following fields are the bare minimum; everything else is either optional or can be [auto-filled](../../../../references/protocol/transactions/common-fields.md#auto-fillable-fields) when signing:

| Field             | Value            | Description                           |
|:------------------|:-----------------|:--------------------------------------|
| `TransactionType` | String           | Use the string `CheckCancel` when canceling a Check. |
| `Account`         | String (Address) | The address of the sender who is canceling the Check. (In other words, your address.) |
| `CheckID`         | String           | The ID of the Check entry to cancel. You can get this information when you [send a check](./send-a-check.md), or by [looking up checks](./look-up-checks.md). |

For example:

{% code-snippet file="/_code-samples/checks/js/cancel-check.js" from="// Prepare" before="// Submit" /%}

### 2. Submit the CheckCancel transaction

Submit the CheckCancel transaction in the usual way and wait for it to be validated. If the result code is `tesSUCCESS` and the transaction is in a validated ledger, the transaction is successful. For example:

{% code-snippet file="/_code-samples/checks/js/cancel-check.js" from="// Submit" before="// Confirm" /%}

## 3. Confirm transaction result

If the transaction succeeded, it should have a `"TransactionResult": "tesSUCCESS"` field in the metadata, and the field `"validated": true` in the result, indicating that this result is final. For example:

{% code-snippet file="/_code-samples/checks/js/cancel-check.js" from="// Confirm" before="// Disconnect" /%}

{% admonition type="success" name="Tip" %}The `submitAndWait()` method in xrpl.js only returns when the transaction's result is final, so you can assume that the transaction is validated if it returns a result code of `tesSUCCESS`.{% /admonition %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
