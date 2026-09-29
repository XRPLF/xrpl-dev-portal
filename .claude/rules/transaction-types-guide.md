---
paths:
  - "docs/references/protocol/transactions/types/**/*.md"
---

# XRPL Transaction Reference Conventions

The template below shows the full structure a transaction type reference page should follow. HTML comments serve two roles, distinguished by prefix:

- `<!-- TODO: ... -->` marks a slot that needs to be filled in by the author
- `<!-- RULE: ... -->` describes the convention that applies at that spot

Pull details from the `xrpld` source file that the `{% source-link /%}` path points to. If this file isn't provided, prompt the user for the most up-to-date file location on Github.

---

# <!-- TODO: Transaction name in PascalCase, e.g. LoanBrokerSet -->
<!-- TODO: Replace <path-to-source> with the repo-relative path the user provides. Example format: {% source-link path="src/libxrpl/tx/transactors/lending/LoanBrokerSet.cpp" /%} -->
{% source-link path="<path-to-source>" /%}

<!-- TODO: 1-3 sentences: what the transaction does and any preconditions (e.g. "Only the owner of the associated vault can submit this transaction."). If this reference page documents a feature that isn't enabled on mainnet yet, add the {% amendment-disclaimer /%} markdoc tag in a new line. You can verify the status of amendments at https://xrpl.org/resources/known-amendments.md -->


## Example {% $frontmatter.seo.title %} JSON
<!-- RULE: A complete, realistic JSON object showing every field, including common transaction fields. Use placeholder values unless otherwise specified by the user. Follow this format:

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

-->

## {% $frontmatter.seo.title %} Fields
<!-- RULE: Table of the transaction's own fields (the common fields are linked, not repeated). Note any special rules about the transaction fields below the table. -->

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

<!-- TODO: Update the fields table using the format below. Omit these common fields: `Account`, `TransactionType`, `Fee`, `Sequence`, `AccountTxnID`, `Delegate`, `Flags`, `LastLedgerSequence`, `Memos`, `NetworkID`, `Signers`, `SourceTag`, `SigningPubKey`, `TicketSequence`, `TxnSignature`.

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

-->


## {% $frontmatter.seo.title %} Flags
<!-- RULE: If the transaction doesn't have flags, delete all other content in this section and add this line as-is:
There are no flags defined for {% code-page-name /%} transactions.
-->

Transactions of the {% code-page-name /%} type support additional values in the [`Flags` field](../common-fields.md#flags-field), as follows:

<!-- TODO: Update the flags table using the following format:

| Flag Name          | Hex Value    | Decimal Value | Description                  |
|:-------------------|:-------------|:--------------|:-----------------------------|
| `tfNoRippleDirect` | `0x00010000` | 65536         | Do not use the default path; only use paths included in the `Paths` field. This is intended to force the transaction to take arbitrage opportunities. Most clients do not need this. |
| `tfPartialPayment` | `0x00020000` | 131072        | If the specified `Amount` cannot be sent without spending more than `SendMax`, reduce the received amount instead of failing outright. See [Partial Payments](#partial-payments) for more details. |
| `tfLimitQuality`   | `0x00040000` | 262144        | Only take paths where all the conversions have an input:output ratio that is equal or better than the ratio of `Amount`:`SendMax`. See [Limit Quality](#limit-quality) for details. |

-->


## Error Cases
<!-- RULE: Table of transaction-specific result codes, beyond the errors common to all transactions. -->

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

<!-- TODO: Update the error cases table using the following format:

| Error Code                | Description                        |
|:--------------------------|:-----------------------------------|
| `temINVALID`              | The transaction is trying to modify a fixed field. You can only update the values for `Flags`, `Data`, or `DebtMaximum`. |
| `tecNO_PERMISSION`        | The account submitting the transaction doesn't own the associated `Vault` ledger entry. |
| `tecNO_ENTRY`             | A `LoanBroker` entry with the specified ID does not exist. You can also receive this if the specified `VaultID` doesn't exist. |
| `tecINSUFFICIENT_RESERVE` | The owner's account doesn't have enough to cover the reserve requirement for the new `LoanBroker` ledger entry. |

-->


## See Also

<!-- TODO: Link to the associated ledger entry. -->

{% raw-partial file="/docs/_snippets/common-links.md" /%}
