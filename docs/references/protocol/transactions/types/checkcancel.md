---
html: checkcancel.html
parent: transaction-types.html
seo:
    description: Cancel a check.
labels:
  - Checks
---
# CheckCancel
[[Source]](https://github.com/XRPLF/rippled/blob/1e01cd34f7a216092ed779f291b43324c167167a/src/xrpld/app/tx/detail/CancelCheck.cpp "Source")

Cancels an unredeemed Check, removing it from the ledger without sending any money. The source or the destination of the check can cancel a Check at any time using this transaction type. If the Check has expired, any address can cancel it.

_(Added by the [Checks amendment][].)_

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "Account": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
    "TransactionType": "CheckCancel",
    "CheckID": "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0",
    "Fee": "12"
}
```

{% tx-example txid="D3328000315C6DCEC1426E4E549288E3672752385D86A40D56856DBD10382953" /%}


{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field       | JSON Type | [Internal Type][] | Description                    |
|:------------|:----------|:------------------|:-------------------------------|
| `CheckID`   | String    | UInt256           | The ID of the [Check ledger object](../../ledger-data/ledger-entry-types/check.md) to cancel, as a 64-character hexadecimal string. |

## Error Cases

- If the object identified by the `CheckID` does not exist or is not a Check, the transaction fails with the result `tecNO_ENTRY`.
- If the Check is not expired and the sender of the CheckCancel transaction is not the source or destination of the Check, the transaction fails with the result `tecNO_PERMISSION`.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
