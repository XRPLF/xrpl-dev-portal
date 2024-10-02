---
seo:
    description: Cash a Check for any exact amount up to the amount it specifies.
labels:
  - Checks
---
# Cash a Check for an Exact Amount

This tutorial shows how to cash a [Check](/docs/concepts/payment-types/checks.md) for an exact amount. As long as the Check is not expired, the specified recipient can cash it to receive any exact amount up to the amount specified. You would cash a Check this way if you want to receive a specific amount, for example to pay off an invoice or bill exactly. If the sender does not have enough money, cashing the check fails but you can try again later.

You can also [cash a check for a flexible amount](./cash-a-check-for-a-flexible-amount.md).

## Prerequisites

- You should be familiar with the basics of using the [xrpl.js client library](../../../javascript/build-apps/get-started.md).
- You need an XRP Ledger account including its secret key. (You can get one on Testnet for free.) See also: [XRP Faucets](/resources/dev-tools/xrp-faucets).
- You need the ID of a Check ledger entry that you are the recipient of. See also: [Send a Check](./send-a-check.md) and [Look Up Checks](./look-up-checks.md).

## Source Code

The complete source code for this tutorial is available in the source repository for this website:

{% repo-link path="_code-samples/checks/js/" %}Checks sample code{% /repo-link %}

## Steps
### 1. Prepare the CheckCash transaction

Figure out the values of the [CheckCash transaction][] fields. You also need to create a `Wallet` instance for your account's key pair. To cash a check for an exact amount, the following fields are the bare minimum; everything else is either optional or can be [auto-filled](../../../../references/protocol/transactions/common-fields.md#auto-fillable-fields) when signing:

| Field             | Value                | Description                  |
|:------------------|:---------------------|:-----------------------------|
| `TransactionType` | String               | The value `CheckCash` indicates this is a CheckCash transaction. |
| `Account`         | String - [Address][] | The address of the sender who is cashing the Check. (In other words, your address.) |
| `CheckID`         | String               | The ID of the Check to cash. You can get this information from the person who sent you the Check, or by [looking up checks](./look-up-checks.md) where your account is the destination. |
| `Amount`          | [Currency Amount][]  | The amount to receive. The type of currency (token or XRP) must match the Check object. The quantity in the `value` field must be less than or equal to the amount in the Check object. (For currencies with transfer fees, you must cash the Check for less than its `SendMax` so the transfer fee can be paid by the `SendMax`.) For more information on specifying currency amounts, see [Specifying Currency Amounts][]. |

In the sample code, these values are hard-coded, so you should edit them to match your case:

{% code-snippet file="/_code-samples/checks/js/cash-check-exact.js" language="js" from="// Define parameters" before="async function main()" /%}

Then, you use these parameters to fill out the transaction. For example:

{% code-snippet file="/_code-samples/checks/js/cash-check-exact.js" language="js" from="// Prepare the transaction" before="// Submit the transaction" /%}


### 2. Submit the transaction

Send the transaction and wait for it to be validated by the consensus process, as normal:

{% code-snippet file="/_code-samples/checks/js/cash-check-exact.js" from="// Submit" before="// Confirm" /%}


### 3. Confirm transaction result

If the transaction succeeded, it should have a `"TransactionResult": "tesSUCCESS"` field in the metadata, and the field `"validated": true` in the result, indicating that this result is final.

{% admonition type="success" name="Tip" %}The `submitAndWait()` method in xrpl.js only returns when the transaction's result is final, so you can assume that the transaction is validated if it returns a result code of `tesSUCCESS`.{% /admonition %}

You can look at the transaction metadata to confirm the balance changes that occurred as a result of delivering the exact amount. The `xrpl.getBalanceChanges()` function can help to summarize this. For example:

{% code-snippet file="/_code-samples/checks/js/cash-check-exact.js" from="// Confirm transaction results" before="// Disconnect" /%}

Example balance changes output:

```json
Balance changes: [
  {
    "account": "rEHjrKs86KfPjgeZvso2uQqhU2iA7AqD6r",
    "balances": [
      {
        "currency": "XRP",
        "value": "29.999988"
      }
    ]
  },
  {
    "account": "rh8pPR6p87egsGuAg53QrJ7Y4PLf4Qdrf7",
    "balances": [
      {
        "currency": "XRP",
        "value": "-30"
      }
    ]
  }
]
```

{% admonition type="info" name="Note" %}
The metadata shows the net balance changes as the result of all of the transactions effects, which may be surprising in some cases. For example, in the above example, rEHjr... received 30 XRP from the Check but burned 12 drops of XRP on the transaction cost, resulting in a net gain of 29.99988 XRP from the transaction.

If an account receives exactly the same amount of XRP as it burns, its balance stays the same so it does not even appear in the list of balance changes.
{% /admonition %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
