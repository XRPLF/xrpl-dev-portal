---
seo:
    description: Deposits first-loss capital into a `LoanBroker` ledger entry.
labels:
  - Transactions
  - Lending Protocol
status: not_enabled
---
# LoanBrokerCoverDeposit
[[Source]](https://github.com/XRPLF/rippled/blob/release-3.1/src/xrpld/app/tx/detail/LoanBrokerCoverDeposit.cpp "Source")

Deposits first-loss capital into a `LoanBroker` ledger entry to provide protection for vault depositors.

Only the owner of the associated `LoanBroker` entry can initiate this transaction.

{% amendment-disclaimer name="LendingProtocol" /%}


## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "LoanBrokerCoverDeposit",
  "Account": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "LoanBrokerID": "E123F4567890ABCDE123F4567890ABCDEF1234567890ABCDEF1234567890ABCD",
  "Amount": {
    "currency": "USD",
    "issuer": "rIssuer1234567890abcdef1234567890abcdef",
    "value": "1000"
  }
}
```


## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field Name     | JSON Type           | Internal Type | Required? | Description |
|:-------------- |:--------------------|:--------------|:----------|:------------|
| `LoanBrokerID` | String              | Hash256       | Yes       | The ID of the `LoanBroker` ledger entry to deposit the first-loss capital. |
| `Amount`       | [Currency Amount][] | Amount        | Yes       | The amount of first-loss capital to deposit. |


## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code               | Description                        |
| :----------------------- | :----------------------------------|
| `temINVALID`             | The `LoanBrokerID` field is invalid. |
| `temBAD_AMOUNT`          | The `Amount` field is less than or equal to zero. |
| `tecNO_ENTRY`            | The `LoanBroker` ledger entry doesn't exist. |
| `tecNO_PERMISSION`       | The account sending the transaction isn't the owner of the `LoanBroker` ledger entry. |
| `tecWRONG_ASSET`         | The asset being deposited doesn't match the asset in the `LoanBroker` vault. |
| `tecINSUFFICIENT_FUNDS`  | The account depositing first-loss capital doesn't hold enough of the asset. You can also receive this error if the issuer of the asset has frozen the account or placed a global freeze. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
