---
seo:
    description: Deletes a `LoanBroker` ledger entry.
labels:
  - Transactions
  - Lending Protocol
status: not_enabled
---
# LoanBrokerDelete
[[Source]](https://github.com/XRPLF/rippled/blob/release-3.1/src/xrpld/app/tx/detail/LoanBrokerDelete.cpp "Source")

Deletes a `LoanBroker` ledger entry. Only the owner of the `LoanBroker` entry can delete it.

{% amendment-disclaimer name="LendingProtocol" /%}


## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "LoanBrokerDelete",
  "Account": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "LoanBrokerID": "E123F4567890ABCDE123F4567890ABCDEF1234567890ABCDEF1234567890ABCD"
}
```


## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field Name     | JSON Type | Internal Type | Required? | Description |
|:-------------- |:----------|:--------------|:----------|:------------|
| `LoanBrokerID` | String    | Hash256       | Yes       | The ID of the `LoanBroker` ledger entry to delete. |


## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code           | Description                        |
| :--------------------| :----------------------------------|
| `tecNO_ENTRY`        | The `LoanBroker` ledger entry specified doesn't exist. |
| `tec_NO_PERMISSION`  | The transaction submitter is not the owner of the `LoanBroker` ledger entry. |
| `tecHAS_OBLIGATIONS` | The `OwnerCount` field is greater than zero (active loans exist). This error can also occur if the loan broker's pseudo-account has a balance, owns other ledger entries, or has an owner directory. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
