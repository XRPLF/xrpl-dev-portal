# CheckCreate
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/CreateCheck.cpp "Source")

_(Added by the [Checks amendment][].)_

Create a Check object in the ledger, which is a deferred payment that can be cashed by its intended destination. The sender of this transaction is the sender of the Check.

## Example {{currentpage.name}} JSON

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

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->

| Field            | JSON Type           | [Internal Type][] | Description     |
|:-----------------|:--------------------|:------------------|:----------------|
| `Destination`    | String              | AccountID         | The unique address of the [account](accounts.html) that can cash the Check. |
| `SendMax`        | [Currency Amount][] | Amount            | Maximum amount of source currency the Check is allowed to debit the sender, including [transfer fees](transfer-fees.html) on non-XRP currencies. The Check can only credit the destination with the same currency (from the same issuer, for non-XRP currencies). For non-XRP amounts, the nested field names MUST be lower-case. |
| `DestinationTag` | Number              | UInt32            | _(Optional)_ Arbitrary tag that identifies the reason for the Check, or a hosted recipient to pay. |
| `Expiration`     | Number              | UInt32            | _(Optional)_ Time after which the Check is no longer valid, in [seconds since the Ripple Epoch][]. |
| `InvoiceID`      | String              | Hash256           | _(Optional)_ Arbitrary 256-bit hash representing a specific reason or identifier for this Check. |

## Error Cases

- If the `Destination` is the sender of the transaction, the transaction fails with the result code `temREDUNDANT`.
- If the `Destination` [account](accounts.html) does not exist in the ledger, the transaction fails with the result code `tecNO_DST`.
- If the `Destination` account has the `RequireDest` flag enabled but the transaction does not include a `DestinationTag` field, the transaction fails with the result code `tecDST_TAG_NEEDED`.
- If `SendMax` specifies an issued currency which is [frozen](freezes.html), the transaction fails with the result `tecFROZEN`.
- If the `Expiration` of the transaction is in the past, the transaction fails with the result `tecEXPIRED`.
- If the sender does not have enough XRP to meet the [owner reserve](reserves.html#owner-reserves) after adding the Check, the transaction fails with the result `tecINSUFFICIENT_RESERVE`.
- If either the sender or the destination of the Check cannot own more objects in the ledger, the transaction fails with the result `tecDIR_FULL`.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
