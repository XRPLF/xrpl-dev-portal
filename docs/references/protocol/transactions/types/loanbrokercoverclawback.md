---
seo:
    description: Claw back first-loss capital from a `LoanBroker` ledger entry.
labels:
  - Transactions
  - Lending Protocol
status: not_enabled
---
# LoanBrokerCoverClawback
[[Source]](https://github.com/XRPLF/rippled/blob/release-3.1/src/xrpld/app/tx/detail/LoanBrokerCoverClawback.cpp "Source")

The `LoanBrokerCoverClawback` transaction claws back first-loss capital from a `LoanBroker` ledger entry. The transaction can only be submitted by the issuer of the asset used in the lending protocol, and can't clawback an amount that would cause the available first-loss capital to drop below the minimum amount defined by the `LoanBroker.CoverRateMinimum` value.

{% amendment-disclaimer name="LendingProtocol" /%}


## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "LoanBrokerCoverClawback",
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
| `LoanBrokerID` | String              | Hash256       | No        | The ID of the `LoanBroker` ledger entry to clawback first-loss capital. Must be provided if `Amount` is an MPT, or `Amount` is an IOU and the specified `issuer` matches the `Account` submitting the transaction. |
| `Amount`       | [Currency Amount][] | Amount        | No        | The amount of first-loss capital to claw back. If the value is `0` or empty, claw back all assets down to the minimum cover (`DebtTotal * CoverRateMinimum`). |


## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code               | Description                        |
| :----------------------- | :----------------------------------|
| `temINVALID`             | - The transaction is missing the `LoanBrokerID` and `Amount` fields.<br>- `LoanBrokerID` is invalid.<br>- `Amount` is an MPT and `LoanBrokerID` is missing.<br>- Amount is an IOU and its `issuer` matches `Account`. |
| `temBAD_AMOUNT`          | - `Amount` is less than or equal to zero.<br>- `Amount` specifies the native XRP. |
| `tecNO_ENTRY`            | - The `LoanBroker` ledger entry doesn't exist, or the asset `issuer` doesn't exist. |
| `tecNO_PERMISSION`       | - The asset doesn't support clawback, or the asset can't be frozen.<br>- The transaction is attempting to clawback native XRP.<br>- The `Account` isn't the asset issuer. |
| `tecWRONG_ASSET`         | The specified asset to clawback doesn't match the asset in the lending protocol vault. |
| `tecINTERNAL`            | The balance of the trust line doesn't match the `CoverAvailable` field. |
| `tecINSUFFICIENT_FUNDS`  | Clawing back the specified `Amount` puts the available cover below the minimum required. You can also receive this error if the issuer of the asset has frozen the account or placed a global freeze. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
