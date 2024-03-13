---
html: cash-a-check-for-an-exact-amount.html
parent: use-checks.html
seo:
    description: Cash a Check in the ledger for any exact amount up to the amount it specifies.
labels:
  - Checks
---
# Cash a Check for an Exact Amount

As long as the Check is in the ledger and not expired, the specified recipient can cash it to receive any exact amount up to the amount specified in the Check by sending a [CheckCash transaction][] with an `Amount` field. You would cash a Check this way if you want to receive a specific amount, for example to pay off an invoice or bill exactly.

The specified recipient can also [cash the check for a flexible amount](cash-a-check-for-a-flexible-amount.md).

## Prerequisites

{% partial file="/docs/_snippets/checkcash-prereqs.md" /%} 

## 1. Prepare the CheckCash transaction

Figure out the values of the [CheckCash transaction][] fields. To cash a check for an exact amount, the following fields are the bare minimum; everything else is either optional or can be [auto-filled](../../../../references/protocol/transactions/common-fields.md#auto-fillable-fields) when signing:

| Field             | Value                     | Description                  |
|:------------------|:--------------------------|:-----------------------------|
| `TransactionType` | String                    | The value `CheckCash` indicates this is a CheckCash transaction. |
| `Account`         | String (Address)          | The address of the sender who is cashing the Check. (In other words, your address.) |
| `CheckID`         | String                    | The ID of the Check object in the ledger to cash. You can get this information by looking up the metadata of the CheckCreate transaction using the [tx method][] or by looking for Checks using the [account_objects method][]. |
| `Amount`          | String or Object (Amount) | The amount to redeem from the Check. For XRP, this must be a string specifying drops of XRP. For tokens, this is an object with `currency`, `issuer`, and `value` fields. The `currency` and `issuer` fields must match the corresponding fields in the Check object, and the `value` must be less than or equal to the amount in the Check object. (For currencies with transfer fees, you must cash the Check for less than its `SendMax` so the transfer fee can be paid by the `SendMax`.) If you cannot receive this much, cashing the Check fails, leaving the Check in the ledger so you can try again. For more information on specifying currency amounts, see [Specifying Currency Amounts][]. |


### Example CheckCash Preparation for an exact amount

The following examples show how to prepare a transaction to cash a Check for a fixed amount.

{% tabs %}

{% tab label="JSON-RPC, WebSocket, or Commandline" %}
```json
{
  "Account": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
  "TransactionType": "CheckCash",
  "Amount": "100000000",
  "CheckID": "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334",
  "Fee": "12"
}
```
{% /tab %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/prepareCashExact.js" language="js" /%}
{% /tab %}

{% /tabs %}

## 2. Sign the CheckCash transaction

{% partial file="/docs/_snippets/tutorial-sign-step.md" /%} 

### Example Request

{% tabs %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/sign-cash-exact-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}


### Example Response

{% tabs %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/sign-cash-exact-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}


## 3. Submit the signed CheckCash transaction

{% partial file="/docs/_snippets/tutorial-submit-step.md" /%} 

### Example Request

{% tabs %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/submit-cash-exact-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}


### Example Response

{% tabs %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/submit-cash-exact-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}

## 4. Wait for validation

{% partial file="/docs/_snippets/wait-for-validation.md" /%} 

## 5. Confirm final result

Use the [tx method][] with the CheckCash transaction's identifying hash to check its status. Look for a `"TransactionResult": "tesSUCCESS"` field in the transaction's metadata, indicating that the transaction succeeded, and the field `"validated": true` in the result, indicating that this result is final.

If the check was cashed for an exact `Amount` and succeeded, you can assume that the recipient was credited for exactly that amount (with possible rounding for very large or very small amounts of tokens).

If cashing the Check failed, the Check remains in the ledger so you can try cashing again later. You may want to [cash the Check for a flexible amount](cash-a-check-for-a-flexible-amount.md) instead.

### Example Request

{% tabs %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/tx-cash-exact-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}


### Example Response

{% tabs %}

{% tab label="Commandline" %}
{% code-snippet file="/_code-samples/checks/cli/tx-cash-exact-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
