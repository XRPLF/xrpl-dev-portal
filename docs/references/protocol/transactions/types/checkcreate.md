---
seo:
    description: Create a check.
labels:
    - Checks
    - Payments
txIcon: create
requiredAmendment: Checks
---
# CheckCreate
{% source-link path="src/libxrpl/tx/transactors/check/CheckCreate.cpp" /%}

Create an on-ledger [check](../../../../concepts/payment-types/checks.md), which is a deferred payment that can be cashed by its intended destination. The sender of this transaction is the sender of the check.

{% amendment-disclaimer name="Checks" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    "TransactionType": "CheckCreate",
    "SendMax": {
        "currency": "FOO",
        "issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
        "value": "100"
    },
    "Expiration": 1162029167,
    "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "DestinationTag": 67
}
```

{% tx-example txid="6ACA27C7BDA456C5B282B17F2E9A4508CD47D4ED6DECAE0CF8842F7115A16FD0" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field            | JSON Type           | [Internal Type][] | Description     |
|:-----------------|:--------------------|:------------------|:----------------|
| `Destination`    | String              | AccountID         | The unique address of the [account](../../../../concepts/accounts/index.md) that can cash the Check. |
| `SendMax`        | [Currency Amount][] | Amount            | Maximum amount of source currency the Check is allowed to debit the sender, including [transfer fees](../../../../concepts/tokens/fungible-tokens/transfer-fees.md) on non-XRP currencies. The Check can only credit the destination with the same currency (from the same issuer, for non-XRP currencies). For non-XRP amounts, the nested field names MUST be lower-case. |
| `DestinationTag` | Number              | UInt32            | _(Optional)_ Arbitrary tag that identifies the reason for the Check, or a hosted recipient to pay. |
| `Expiration`     | Number              | UInt32            | _(Optional)_ Time after which the Check is no longer valid, in [seconds since the Ripple Epoch][]. |
| `InvoiceID`      | String              | UInt256           | _(Optional)_ Arbitrary 256-bit hash representing a specific reason or identifier for this Check. |

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code | Description |
|:-----------|:------------|
| `tecNO_PERMISSION` | The `Destination` account is blocking incoming Checks. {% amendment-disclaimer name="DisallowIncoming" /%} |
| `temREDUNDANT` | The `Destination` is the sender of the transaction. |
| `tecNO_DST` | The `Destination` [account](../../../../concepts/accounts/index.md) does not exist in the ledger. |
| `tecDST_TAG_NEEDED` | The `Destination` account has the `RequireDest` flag enabled but the transaction does not include a `DestinationTag` field. |
| `tecFROZEN` | `SendMax` specifies a token which is [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md). |
| `tecEXPIRED` | The `Expiration` of the transaction is in the past. |
| `tecINSUFFICIENT_RESERVE` | The sender does not have enough XRP to meet the [owner reserve](../../../../concepts/accounts/reserves.md#owner-reserves) after adding the Check. |
| `tecDIR_FULL` | Either the sender or the destination of the Check cannot own more objects in the ledger.<br>This error is effectively impossible to receive if {% amendment-disclaimer name="fixDirectoryLimit" compact=true /%} is enabled. |

## See Also

- [Check entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
