---
html: cash-a-check-for-a-flexible-amount.html
parent: use-checks.html
seo:
    description: Cash a Check for as much as possible.
labels:
  - Checks
---
# Cash a Check for a Flexible Amount

As long as the Check is in the ledger and not expired, the specified recipient can cash it to receive a flexible amount by sending a [CheckCash transaction][] with a `DeliverMin` field. When cashing a Check in this way, the receiver gets as much as is possible to deliver, debiting the Check's sender for the Check's full `SendMax` amount or as much as is available. Cashing fails if it doesn't deliver at least the `DeliverMin` amount to the Check's recipient.

You might cash a Check for a flexible amount if you want to get as much as possible from the Check.

The specified recipient can also [cash the check for an exact amount](cash-a-check-for-a-flexible-amount.md).


## Prerequisites

{% partial file="/docs/_snippets/checkcash-prereqs.md" /%}

## 1. Prepare the CheckCash transaction

Figure out the values of the [CheckCash transaction][] fields. To cash a check for a flexible amount, the following fields are the bare minimum; everything else is either optional or can be [auto-filled](../../../../references/protocol/transactions/common-fields.md#auto-fillable-fields) when signing:

| Field             | Value                     | Description                  |
|:------------------|:--------------------------|:-----------------------------|
| `TransactionType` | String                    | The value `CheckCash` indicates this is a CheckCash transaction. |
| `Account`         | String (Address)          | The address of the sender who is cashing the Check. (In other words, your address.) |
| `CheckID`         | String                    | The ID of the Check object in the ledger to cash. You can get this information by looking up the metadata of the CheckCreate transaction using the [tx method][] or by looking for Checks using the [account_objects method][]. |
| `DeliverMin`      | String or Object (Amount) | A minimum amount to receive from the Check. If you cannot receive at least this much, cashing the Check fails, leaving the Check in the ledger so you can try again. For XRP, this must be a string specifying drops of XRP. For tokens, this is an object with `currency`, `issuer`, and `value` fields. The `currency` and `issuer` fields must match the corresponding fields in the Check object, and the `value` must be less than or equal to the amount in the Check object. For more information on specifying currency amounts, see [Specifying Currency Amounts][]. |

### Example CheckCash Preparation for a flexible amount

The following examples show how to prepare a transaction to cash a Check for a flexible amount.

{% tabs %}

{% tab label="JSON-RPC, WebSocket, or Commandline" %}
```json
{
  "Account": "rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
  "TransactionType": "CheckCash",
  "DeliverMin": "95000000",
  "CheckID": "2E0AD0740B79BE0AAE5EDD1D5FC79E3C5C221D23C6A7F771D85569B5B91195C2"
}
```
{% /tab %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/prepareCashFlex.js" language="js" /%}
{% /tab %}

{% /tabs %}

## 2. Sign the CheckCash transaction

{% partial file="/docs/_snippets/tutorial-sign-step.md" /%} 

### Example Request

{% tabs %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/sign-cash-flex-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}


### Example Response

{% tabs %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/sign-cash-flex-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}


## 3. Submit the signed CheckCash transaction

{% partial file="/docs/_snippets/tutorial-submit-step.md" /%} 

### Example Request

{% tabs %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/submit-cash-flex-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}


### Example Response

{% tabs %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/submit-cash-flex-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}

## 4. Wait for validation

{% partial file="/docs/_snippets/wait-for-validation.md" /%} 

## 5. Confirm final result

Use the [tx method][] with the CheckCash transaction's identifying hash to check its status. Look for a `"TransactionResult": "tesSUCCESS"` field in the transaction's metadata, indicating that the transaction succeeded, and the field `"validated": true` in the result, indicating that this result is final.

### Example Request

{% tabs %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/tx-cash-flex-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}


### Example Response

{% tabs %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/tx-cash-flex-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}

### Handling Errors

If cashing the Check failed with a `tec`-class code, look up the code in the [Full Transaction Response List](../../../../references/protocol/transactions/transaction-results/index.md) and respond accordingly. Some common possibilities for CheckCash transactions:

| Result Code | Meaning | How to Respond |
|-------------|---------|----------------|
| `tecEXPIRED` | The Check has expired. | Cancel the Check and ask the sender to create a new Check with a later Expiration time. |
| `tecNO_ENTRY` | The Check ID doesn't exist. | Confirm that the `CheckID` from the CheckCash transaction is correct. Confirm that the Check has not already been canceled or successfully cashed. |
| `tecNO_LINE` | The recipient doesn't have a trust line for the Check's currency. | If you want to hold this currency from this issuer, create a trust line for the specified currency and issuer with a reasonable limit using a [TrustSet transaction][], then try to cash the check again. |
| `tecNO_PERMISSION` | The sender of the CheckCash transaction isn't the `Destination` of the Check. | Double-check the `Destination` of the Check. |
| `tecNO_AUTH` | The issuer of the currency from the check is using [Authorized Trust Lines](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md) but the recipient's trust line to the issuer is not approved. | Ask the issuer to authorize this trust line, then try again to cash the Check after they do. |
| `tecPATH_PARTIAL` | The Check could not deliver enough tokens, either due to trust line limits or because the sender does not have enough balance of the token to send (including the issuer's [transfer fee](../../../../concepts/tokens/transfer-fees.md), if there is one). | If the problem is the trust line limit, send a [TrustSet transaction][] to increase your limit (if desired) or lower your balance by spending some of the currency, then try to cash the Check again. If the problem is the sender's balance, wait for the sender to have more of the Check's currency, or try again to cash the Check for a lesser amount. |
| `tecUNFUNDED_PAYMENT` | The Check could not deliver enough XRP. | Wait for the sender to have more XRP, or try again to cash the Check for a lesser amount. |

## 6. Confirm delivered amount

If the Check was cashed for a flexible `DeliverMin` amount and succeeded, you can assume that the Check was cashed for at least the `DeliverMin` amount. To get the exact amount delivered, check the transaction metadata. The `delivered_amount` field in the metadata shows the exact amount delivered. (This field is only provided if the Check was cashed for a flexible amount. If the check was successfully cashed for a fixed amount, then the delivered amount is equal to the `Amount` of the CheckCash transaction.)

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

    - If the token has a [transfer fee](../../../../concepts/tokens/transfer-fees.md), the Check's sender may be debited more than the recipient is credited. (The difference is the transfer fee, which is returned to the issuer as a decreased net obligation.)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
