---
seo:
    description: Delete a `Loan` ledger entry.
labels:
  - Transactions
  - Lending Protocol
status: not_enabled
---
# LoanDelete
[[Source]](https://github.com/XRPLF/rippled/blob/release-3.1/src/xrpld/app/tx/detail/LoanDelete.cpp "Source")

Deletes a `Loan` ledger entry. Only the loan broker or borrower can submit this transaction.

{% amendment-disclaimer name="LendingProtocol" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "LoanDelete",
  "Account": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "LoanID": "E123F4567890ABCDE123F4567890ABCDEF1234567890ABCDEF1234567890ABCD"
}
```


## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field Name     | JSON Type | Internal Type | Required? | Description |
|:-------------- |:----------|:--------------|:----------|:------------|
| `LoanID`       | String    | Hash256       | Yes       | The ID of the `Loan` ledger entry to delete. |


## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code           | Description |
|:---------------------|:------------|
| `temINVALID`         | The `LoanID` is missing or set to zero. |
| `tecNO_ENTRY`        | The loan specified by `LoanID` doesn't exist. |
| `tecHAS_OBLIGATIONS` | The loan can't be deleted because it still has outstanding payments due. |
| `tecNO_PERMISSION`   | The account submitting the transaction is neither the borrower of the `Loan` ledger entry nor the owner of the `LoanBroker` ledger entry. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
