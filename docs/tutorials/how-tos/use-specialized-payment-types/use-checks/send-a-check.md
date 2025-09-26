---
seo:
    description: Send a Check whose intended recipient can cash it to be paid later.
labels:
  - Checks
---
# Send a Check

Sending a [Check](/docs/concepts/payment-types/checks.md) is like writing permission for an intended recipient to pull a payment from you. The outcome of this process is a [Check entry in the ledger](../../../../references/protocol/ledger-data/ledger-entry-types/check.md) which the recipient can cash later.

In many cases, you want to send a [Payment][] instead of a Check, since that delivers the money directly to the recipient in one step. However, if your intended recipient uses [DepositAuth](../../../../concepts/accounts/depositauth.md), you cannot send them Payments directly, so a Check is a good alternative.

## Prerequisites

To send a Check with this tutorial, you need the following:

- The **address** and **secret key** of a funded account to send the Check from.
    - You can use the [XRP Ledger Test Net Faucet](/resources/dev-tools/xrp-faucets) to get a funded address and secret with 10,000 Test Net XRP.
- The **address** of a funded account to receive the Check.
- You should be familiar with the basics of using [xrpl.js](../../../javascript/build-apps/get-started.md).

## Source Code

The complete source code for this tutorial is available in the source repository for this website:

{% repo-link path="_code-samples/checks/js/" %}Checks sample code{% /repo-link %}

## Steps

### 1. Prepare the CheckCreate transaction

Decide how much money the Check is for and who can cash it. Figure out the values of the [CheckCreate transaction][] fields. The following fields are the bare minimum; everything else is either optional or can be [auto-filled](../../../../references/protocol/transactions/common-fields.md#auto-fillable-fields) when signing:

| Field             | Value                     | Description                  |
|:------------------|:--------------------------|:-----------------------------|
| `TransactionType` | String                    | Use the string `CheckCreate` here. |
| `Account`         | String (Address)          | The address of the sender who is creating the Check. (In other words, your address.) |
| `Destination`     | String (Address)          | The address of the intended recipient who can cash the Check. |
| `SendMax`         | String or Object (Amount) | The maximum amount the sender can be debited when this Check gets cashed. For XRP, use a string representing drops of XRP. For tokens, use an object with `currency`, `issuer`, and `value` fields. See [Specifying Currency Amounts][] for details. If you want the recipient to be able to cash the Check for an exact amount of a non-XRP currency with a [transfer fee](../../../../concepts/tokens/fungible-tokens/transfer-fees.md), remember to include an extra percentage to pay for the transfer fee. (For example, for the recipient to cash a Check for 100 CAD from an issuer with a 2% transfer fee, you must set the `SendMax` to 102 CAD from that issuer.) |

For example, imagine you were asked to pay a company named Grand Payments for some consulting work. By email, Grand Payments informs you that the maximum charge is 120 XRP, their XRP Ledger address is `rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis`, and this work has been billed with an invoice ID of `46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291` which they ask you to attach for their records. The following code shows how you could use a Check to send that payment:

{% code-snippet file="/_code-samples/checks/js/create-check.js" language="js" from="// Prepare the transaction" before="// Submit the transaction" /%}

{% admonition type="success" name="Tip" %}The `InvoiceID` is optional metadata that can be attached to any Check (or Payment). This field is purely informational and is not used in transaction processing.{% /admonition %}


### 2. Submit the transaction

Send the transaction and wait for it to be validated by the consensus process, as normal:

{% code-snippet file="/_code-samples/checks/js/create-check.js" language="js" from="// Submit the transaction" before="// Get transaction result" /%}


### 3. Confirm transaction result

If the transaction succeeded, it should have a `"TransactionResult": "tesSUCCESS"` field in the metadata, and the field `"validated": true` in the result, indicating that this result is final.

{% admonition type="success" name="Tip" %}The `submitAndWait()` method in xrpl.js only returns when the transaction's result is final, so you can assume that the transaction is validated if it returns a result code of `tesSUCCESS`.{% /admonition %}

To cash or cancel the Check later, you'll need the Check ID. You can find this in the transaction's metadata by looking for a `CreatedNode` entry with a `LedgerEntryType` of `"Check"`. This indicates that the transaction created a [Check ledger entry](../../../../references/protocol/ledger-data/ledger-entry-types/check.md). The `LedgerIndex` of this object is the ID of the Check. This should be a [hash][] value such as `84C61BE9B39B2C4A2267F67504404F1EC76678806C1B901EA781D1E3B4CE0CD9`.

At this point, it is up to the recipient to cash the Check.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
