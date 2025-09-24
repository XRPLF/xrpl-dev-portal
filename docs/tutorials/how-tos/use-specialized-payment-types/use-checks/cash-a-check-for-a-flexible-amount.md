---
seo:
    description: Cash a Check for as much as possible.
labels:
  - Checks
---
# Cash a Check for a Flexible Amount

This tutorial shows how to cash a [Check](/docs/concepts/payment-types/checks.md) for a flexible amount. As long as the Check is not expired, the specified recipient can cash it to receive the maximum amount available. You would cash a Check this way if you want to receive as much as possible. When doing this, you set a minimum amount to receive in case the sender does not have enough money to pay the full amount. If the check cannot deliver at least the minimum amount, cashing the check fails but you can try again later.

You can also [cash a check for an exact amount](cash-a-check-for-a-flexible-amount.md).


## Prerequisites

- You should be familiar with the basics of using the [xrpl.js client library](../../../javascript/build-apps/get-started.md).
- You need an XRP Ledger account including its secret key. (You can get one on Testnet for free.) See also: [XRP Faucets](/resources/dev-tools/xrp-faucets).
- You need the ID of a Check ledger entry that you are the recipient of. See also: [Send a Check](./send-a-check.md) and [Look Up Checks](./look-up-checks.md).


## Source Code

The complete source code for this tutorial is available in the source repository for this website:

{% repo-link path="_code-samples/checks/js/" %}Checks sample code{% /repo-link %}


## Steps
### 1. Prepare the CheckCash transaction

Figure out the values of the [CheckCash transaction][] fields. To cash a check for a flexible amount, the following fields are the bare minimum; everything else is either optional or can be [auto-filled](../../../../references/protocol/transactions/common-fields.md#auto-fillable-fields) when signing:

| Field             | Value                | Description                  |
|:------------------|:---------------------|:-----------------------------|
| `TransactionType` | String               | The value `CheckCash` indicates this is a CheckCash transaction. |
| `Account`         | String - [Address][] | The address of the sender who is cashing the Check. (In other words, your address.) |
| `CheckID`         | String               | The ID of the Check to cash. You can get this information from the person who sent you the Check, or by [looking up checks](./look-up-checks.md) where your account is the destination. |
| `DeliverMin`      | [Currency Amount][]  | A minimum amount to receive from the Check. If you cannot receive at least this much, cashing the Check fails, leaving the Check in the ledger so you can try again. For XRP, this must be a string specifying drops of XRP. For tokens, this is an object with `currency`, `issuer`, and `value` fields. The `currency` and `issuer` fields must match the corresponding fields in the Check object, and the `value` must be less than or equal to the amount in the Check object. For more information on specifying currency amounts, see [Specifying Currency Amounts][]. |

In the sample code, these values are hard-coded, so you should edit them to match your case:

{% code-snippet file="/_code-samples/checks/js/cash-check-flexible.js" language="js" from="// Define parameters" before="async function main()" /%}

Then, you use these parameters to fill out the transaction. For example:

{% code-snippet file="/_code-samples/checks/js/cash-check-flexible.js" language="js" from="// Prepare the transaction" before="// Submit the transaction" /%}


### 2. Submit the transaction

Send the transaction and wait for it to be validated by the consensus process, as normal:

{% code-snippet file="/_code-samples/checks/js/cash-check-flexible.js" from="// Submit" before="// Confirm" /%}


## 3. Confirm final result

If the transaction succeeded, it should have a `"TransactionResult": "tesSUCCESS"` field in the metadata, and the field `"validated": true` in the result, indicating that this result is final.

{% admonition type="success" name="Tip" %}The `submitAndWait()` method in xrpl.js only returns when the transaction's result is final, so you can assume that the transaction is validated if it returns a result code of `tesSUCCESS`.{% /admonition %}

If the transaction suceeded, you can assume that it delivered at least the `DeliverMin` amount of this transaction and at most the `SendMax` of the Check. To confirm the exact balance changes that occurred as a result of cashing the check, including how much was actually debited and credited, you must look at the transaction metadata. The `xrpl.getBalanceChanges()` function can help to summarize this. For example:

{% code-snippet file="/_code-samples/checks/js/cash-check-flexible.js" from="// Confirm transaction results" before="// Disconnect" /%}

{% admonition type="info" name="Note" %}
The metadata shows the net balance changes as the result of all of the transactions effects, which may be surprising in some cases. If an account receives exactly the same amount of XRP as it burns, its balance stays the same so it does not even appear in the list of balance changes.
{% /admonition %}

If you are not using `getBalanceChanges()`, the following guidelines should help with parsing the metadata:

- For XRP, the `AccountRoot` object of the Check's sender has its XRP `Balance` field debited. The `AccountRoot` object of the Check's recipient (the one who sent the CheckCash transaction) has its XRP `Balance` credited for at least the `DeliverMin` of the CheckCash transaction minus the [transaction cost](../../../../concepts/transactions/transaction-cost.md) of sending the transaction.

    For example, the following `ModifiedNode` shows that the account `rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis`, the Check's recipient and the sender of this CheckCash transaction, had its XRP balance change from `9999999970` drops to `10099999960` drops, meaning the recipient was credited a _net_ of 99.99999 XRP as a result of processing the transaction.

    ```
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
    ```

    The net amount of 99.99999 XRP includes deducting the transaction cost that is destroyed to pay for sending this CheckCash transaction. The following part of the transaction instructions shows that the transaction cost (the `Fee` field) was 10 drops of XRP. By adding this to the net balance change, we conclude that the recipient, `rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis`, was credited a _gross_ amount of exactly 100 XRP for cashing the Check.

    ```
    "Account" : "rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
    "TransactionType" : "CheckCash",
    "DeliverMin" : "95000000",
    "Fee" : "10",
    ```

- For tokens where the sender or recipient of the check is the issuer, the `RippleState` object representing the trust line between those accounts has its `Balance` adjusted in the favor of the Check's recipient.

- For tokens with a third-party issuer, there are changes to two `RippleState` objects, representing the trust lines connecting the sender to the issuer, and the issuer to the recipient. The `RippleState` object representing the relationship between the Check's sender and the issuer has its `Balance` changed in favor of the issuer, and the `RippleState` object representing the relationship between the issuer and the recipient has its `Balance` changed in favor of the recipient.

    - If the token has a [transfer fee](../../../../concepts/tokens/fungible-tokens/transfer-fees.md), the Check's sender may be debited more than the recipient is credited. (The difference is the transfer fee, which is returned to the issuer as a decreased net obligation.)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
