---
html: checkcreate.html
parent: transaction-types.html
seo:
    description: Create a check.
labels:
  - Checks
---
# CheckCreate
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/CreateCheck.cpp "Source")

_(Added by the [Checks amendment][].)_

Create a Check object in the ledger, which is a deferred payment that can be cashed by its intended destination. The sender of this transaction is the sender of the Check.

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "CheckCreate",
  "Account": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
  "Destination": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
  "SendMax": "100000000",
  "Expiration": 570113521,
  "InvoiceID": "6F1DFD1D0FE8A32E40E1F2C05CF1C15545BAB56B617F9C6C2D63A6B704BEF59B",
  "DestinationTag": 1,
  "Fee": "12"
}
```

[Query example transaction. >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fxrplcluster.com%2F&req=%7B%22id%22%3A%22example_CheckCreate%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%224E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB%22%2C%22binary%22%3Afalse%7D)

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->

| Field            | JSON Type           | [Internal Type][] | Description     |
|:-----------------|:--------------------|:------------------|:----------------|
| `Destination`    | String              | AccountID         | The unique address of the [account](../../../../concepts/accounts/index.md) that can cash the Check. |
| `SendMax`        | [Currency Amount][] | Amount            | Maximum amount of source currency the Check is allowed to debit the sender, including [transfer fees](../../../../concepts/tokens/transfer-fees.md) on non-XRP currencies. The Check can only credit the destination with the same currency (from the same issuer, for non-XRP currencies). For non-XRP amounts, the nested field names MUST be lower-case. |
| `DestinationTag` | Number              | UInt32            | _(Optional)_ Arbitrary tag that identifies the reason for the Check, or a hosted recipient to pay. |
| `Expiration`     | Number              | UInt32            | _(Optional)_ Time after which the Check is no longer valid, in [seconds since the Ripple Epoch][]. |
| `InvoiceID`      | String              | Hash256           | _(Optional)_ Arbitrary 256-bit hash representing a specific reason or identifier for this Check. |

## Error Cases

- If the `Destination` account is blocking incoming Checks, the transaction fails with the result code `tecNO_PERMISSION`. _(Requires the [DisallowIncoming amendment][])_
- If the `Destination` is the sender of the transaction, the transaction fails with the result code `temREDUNDANT`.
- If the `Destination` [account](../../../../concepts/accounts/index.md) does not exist in the ledger, the transaction fails with the result code `tecNO_DST`.
- If the `Destination` account has the `RequireDest` flag enabled but the transaction does not include a `DestinationTag` field, the transaction fails with the result code `tecDST_TAG_NEEDED`.
- If `SendMax` specifies a token which is [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md), the transaction fails with the result `tecFROZEN`.
- If the `Expiration` of the transaction is in the past, the transaction fails with the result `tecEXPIRED`.
- If the sender does not have enough XRP to meet the [owner reserve](../../../../concepts/accounts/reserves.md#owner-reserves) after adding the Check, the transaction fails with the result `tecINSUFFICIENT_RESERVE`.
- If either the sender or the destination of the Check cannot own more objects in the ledger, the transaction fails with the result `tecDIR_FULL`.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
