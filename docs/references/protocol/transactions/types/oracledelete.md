---
seo:
    description: Delete a price oracle.
labels:
    - Oracle
---
# OracleDelete
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/DeleteOracle.cpp "Source")

Delete a [price oracle](../../../../concepts/decentralized-storage/price-oracles.md). Only the owner of the price oracle can send this transaction.

{% amendment-disclaimer name="PriceOracle" /%}


## Example OracleDelete JSON

```json
{
  "TransactionType": "OracleDelete",
  "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
  "OracleDocumentID": 34
}
```

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field              | JSON Type | Internal Type | Required? | Description |
|--------------------|-----------|---------------|-----------|-------------|
| `OracleDocumentID` | Number    | UInt32        | Yes       | The identifying number of the price oracle, which must be unique per owner. |


## Error Cases

Besides errors that can occur for all transactions, `OracleDelete` transactions can result in the following transaction result codes.

| Error Code    | Description |
|---------------|-------------|
| `tecNO_ENTRY` | The `Oracle` object doesn't exist. |

## See Also

- [Oracle entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
