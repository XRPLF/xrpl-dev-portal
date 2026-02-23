---
seo:
    description: Manages the state of a loan, including defaulting, impairing, or unimpairing a loan.
labels:
  - Transactions
  - Lending Protocol
status: not_enabled
---
# LoanManage
[[Source]](https://github.com/XRPLF/rippled/blob/release-3.1/src/xrpld/app/tx/detail/LoanManage.cpp "Source")

Manages the state of a `Loan` ledger entry, including defaulting, impairing, or unimpairing a loan.

Only the `LoanBroker` ledger entry owner can initiate this transaction.

{% amendment-disclaimer name="LendingProtocol" /%}


## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "LoanManage",
  "Account": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Fee": "12",
  "Flags": 65536,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "LoanID": "E123F4567890ABCDE123F4567890ABCDEF1234567890ABCDEF1234567890ABCD"
}
```


## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field Name     | JSON Type | Internal Type | Required? | Description |
|:-------------- |:----------|:-------------|:----------|:------------|
| `LoanID`       | String    | Hash256      | Yes       | The ID of the `Loan` ledger entry to manage. |


## {% $frontmatter.seo.title %} Flags

Transactions of the {% code-page-name /%} type support additional values in the [flags field], as follows:

| Field Name      | Hex Value    | Decimal Value | Description |
|:----------------|:-------------|:--------------|:------------|
| `tfLoanDefault` | `0x00010000` | `65536`       | Indicates the loan should be defaulted. |
| `tfLoanImpair`  | `0x00020000` | `131072`      | Indicates the the loan should be impaired. |
| `tfLoanUnimpair`| `0x00040000` | `262144`      | Indicates the the loan should be unimpaired. |


## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code          | Description                        |
| :------------------ | :----------------------------------|
| `temINVALID`        | the `LoanID` field is missing or set to zero. |
| `temINVALID_FLAG`   | Multiple management flags have been set. Only one can be set at a time. |
| `tecNO_ENTRY`       | The loan specified by `LoanID` doesn't exist. |
| `tecNO_PERMISSION`  | - The transaction is attempting to modify a defaulted loan, or a fully paid loan.<br>- The transaction is attempting to change the loan's impairment status to the one it already has. |
| `tecTOO_SOON`       | The loan can't be marked as defaulted before its payment due date and grace period have passed. |
| `tecLIMIT_EXCEEDED` | Marking the loan as impaired creates a loss greater than the vault's oustanding assets, which would put the vault in an invalid state. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
