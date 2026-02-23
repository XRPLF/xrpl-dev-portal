---
seo:
    description: Withdraws first-loss capital from a `LoanBroker` ledger entry.
labels:
  - Transactions
  - Lending Protocol
status: not_enabled
---
# LoanBrokerCoverWithdraw
[[Source]](https://github.com/XRPLF/rippled/blob/release-3.1/src/xrpld/app/tx/detail/LoanBrokerCoverWithdraw.cpp "Source")

Withdraws first-loss capital from a `LoanBroker` ledger entry.

Only the owner of the associated `LoanBroker` entry can initiate this transaction.

{% amendment-disclaimer name="LendingProtocol" /%}


## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "LoanBrokerCoverWithdraw",
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
| `LoanBrokerID` | String              | Hash256       | Yes       | The ID of the `LoanBroker` ledger entry to withdraw from. |
| `Amount`       | [Currency Amount][] | Amount        | Yes       | The amount of first-loss capital to withdraw. |
| `Destination`  | String              | AccountID     | No        | An account to receive the assets. |


## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code                | Description                        |
| :------------------------ | :----------------------------------|
| `temINVALID`              | The `LoanBrokerID` field is invalid. |
| `temBAD_AMOUNT`           | The amount to withdraw is lass than or equal to `0`. |
| `temMALFORMED`            | The `Destination` account is empty or `0`. You can also receive this error if the destination tag is set, but `Destination` isn't. |
| `tecNO_ENTRY`             | The specified `LoanBroker` ledger entry doesn't exist. |
| `tecWRONG_ASSET`          | The withdrawal asset doesn't match the asset in the vault. |
| `tecNO_DST`               | The `Destination` provided doesn't exist on the ledger. |
| `tecDST_TAG_NEEDED`       | The `Destination` account requires a destination tag. |
| `tecINSUFFICIENT_FUNDS`   | There isn't enough first-loss capital to withdraw. You can also receive this error if the issuer of the asset has frozen the account or placed a global freeze. |
| `tecNO_PERMISSION`        | The account sending the transaction isn't the owner of the `LoanBroker` ledger entry. |
| `tecPATH_DRY`             | The XRP Ledger failed to send the funds to the `Destination`. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
