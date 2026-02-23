---
seo:
    description: Creates or updates an existing `LoanBroker` ledger entry.
labels:
  - Transactions
  - Lending Protocol
status: not_enabled
---
# LoanBrokerSet
[[Source]](https://github.com/XRPLF/rippled/blob/release-3.1/src/xrpld/app/tx/detail/LoanBrokerSet.cpp "Source")

Creates or updates a `LoanBroker` ledger entry, configuring protocol parameters and associating it with a `Vault`.

Only the owner of the associated vault can initiate this transaction.

{% amendment-disclaimer name="LendingProtocol" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "LoanBrokerSet",
  "Account": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "VaultID": "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
  "LoanBrokerID": "E123F4567890ABCDE123F4567890ABCDEF1234567890ABCDEF1234567890ABCD",
  "Data": "5468697320697320617262697472617279206D657461646174612061626F757420746865206C6F616E62726F6B65722E",
  "ManagementFeeRate": 100,
  "DebtMaximum": 100000,
  "CoverRateMinimum": 1000,
  "CoverRateLiquidation": 500
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field Name             | JSON Type | Internal Type | Required? | Description |
|:-----------------------|:----------|:--------------|:----------|:------------|
| `VaultID`              | String    | Hash256       | Yes       | The ID of the vault that the lending protocol will use to access liquidity. |
| `LoanBrokerID`         | String    | Hash256       | No        | The loan broker ID that the transaction is modifying. |
| `Data`                 | String    | Blob          | No        | Arbitrary metadata in hex format--limited to 256 bytes. |
| `ManagementFeeRate`    | Number    | UInt16        | No        | The 1/10th basis point fee charged by the lending protocol owner. Valid values range from `0` to `10000` (inclusive), representing 0% to 10%. |
| `DebtMaximum`          | String    | Number        | No        | The maximum amount the protocol can owe the vault. The default value of `0` means there is no limit to the debt. Must be a positive value. |
| `CoverRateMinimum`     | Number    | UInt32        | No        | The 1/10th basis point `DebtTotal` that the first-loss capital must cover. Valid values range from `0` to `100000` (inclusive), representing 0% to 100%. |
| `CoverRateLiquidation` | Number    | UInt32        | No        | The 1/10th basis point of minimum required first-loss capital that is moved to an asset vault to cover a loan default. Valid values range from `0` to `100000` (inclusive), representing 0% to 100%. |

When this transaction modifies an existing `LoanBroker` ledger entry, you can only modify `Flags`, `Data`, and `DebtMaximum`.


## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code                | Description                        |
|:--------------------------|:-----------------------------------|
| `temINVALID`              | The transaction is trying to modify a fixed field. You can only update the values for `Flags`, `Data`, or `DebtMaximum`. |
| `tecNO_PERMISSION`        | The account submitting the transaction doesn't own the associated `Vault` ledger entry. You can also receive this error if the transaction tries to modify the `VaultID` of an existing `LoanBroker` ledger entry. |
| `tecNO_ENTRY`             | A `LoanBroker` entry with the specified ID does not exist. You can also receive this if the specified `VaultID` doesn't exist. |
| `tecINSUFFICIENT_RESERVE` | The owner's account doesn't have enough to cover the reserve requirement for the new `LoanBroker` ledger entry. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
