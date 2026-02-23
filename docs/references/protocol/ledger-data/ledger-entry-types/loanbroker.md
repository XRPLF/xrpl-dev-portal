---
seo:
    description: A LoanBroker ledger entry represents the configuration and state of a lending protocol instance.
labels:
  - Decentralized Finance
  - Lending Protocol
status: not_enabled
---
# LoanBroker
[[Source]](https://github.com/XRPLF/rippled/blob/release-3.1/include/xrpl/protocol/detail/ledger_entries.macro#L519-L537 "Source")

A `LoanBroker` ledger entry defines the configuration and state of a lending protocol instance. It tracks details such as fees and first-loss capital cover. You can create a `LoanBroker` object with the [LoanBrokerSet transaction][].

The `LoanBroker` entry is tracked in an [Owner Directory](./directorynode.md) owned by the account that submitted the `LoanBrokerSet` transaction. To facilitate lookup, it is also tracked in the `OwnerDirectory` of the associated vault's _pseudo-account_.

{% admonition type="info" name="Note" %}
The lending protocol uses the pseudo-account of the associated `Vault` entry to hold the first-loss capital.
{% /admonition %}

{% amendment-disclaimer name="LendingProtocol" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "LedgerEntryType": "LoanBroker",
  "LedgerIndex": "E123F4567890ABCDE123F4567890ABCDEF1234567890ABCDEF1234567890ABCD",
  "Flags": "0",
  "PreviousTxnID": "9A8765B4321CDE987654321CDE987654321CDE987654321CDE987654321CDE98",
  "PreviousTxnLgrSeq": 12345678,
  "Sequence": 1,
  "LoanSequence": 2,
  "OwnerNode": 2,
  "VaultNode": 1,
  "VaultID": "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
  "Account": "rBROKER9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Owner": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Data": "5468697320697320617262697472617279206D657461646174612061626F757420746865206C6F616E62726F6B65722E",
  "ManagementFeeRate": 100,
  "OwnerCount": 3,
  "DebtTotal": 50000,
  "DebtMaximum": 100000,
  "CoverAvailable": 10000,
  "CoverRateMinimum": 1000,
  "CoverRateLiquidation": 500
}
```


## {% $frontmatter.seo.title %} Fields

In addition to the [common ledger entry fields][], {% code-page-name /%} entries have the following fields:

| Name                  | JSON Type | Internal Type | Required? | Description |
| :-------------------- | :-------- | :------------ | :-------- | :-----------|
| `PreviousTxnID`       | String    | Hash256       | Yes       | Identifies the transaction ID that most recently modified this object. |
| `PreviousTxnLgrSeq`   | Number    | UInt32        | Yes       | The sequence of the ledger that contains the transaction that most recently modified this object. |
| `Sequence`            | Number    | UInt32        | Yes       | The transaction sequence number that created the LoanBroker. |
| `LoanSequence`        | Number    | UInt32        | Yes       | A sequential identifier for `Loan` ledger entires, incremented each time a new loan is created by this `LoanBroker`. |
| `OwnerNode`           | Number    | UInt64        | Yes       | Identifies the page where this item is referenced in the owner's directory. |
| `VaultNode`           | Number    | UInt64        | Yes       | Identifies the page where this item is referenced in the `Vault` pseudo-account owner's directory. |
| `VaultID`             | String    | Hash256       | Yes       | The ID of the vault that provides the loaned assets. |
| `Account`             | String    | AccountID     | Yes       | The address of the `LoanBroker` pseudo-account. |
| `Owner`               | String    | AccountID     | Yes       | The account address of the vault owner. |
| `Data`                | String    | Blob          | No        | Arbitrary metadata about the vault. Limited to 256 bytes. |
| `ManagementFeeRate`   | Number    | UInt16        | No        | The fee charged by the lending protocol, in units of 1/10th basis points. Valid values are 0 to 100000 (inclusive), representing 0% to 100%. |
| `OwnerCount`          | Number    | UInt32        | Yes       | The number of active loans issued by the LoanBroker. |
| `DebtTotal`           | String    | Number        | Yes       | The total asset amount the protocol owes the vault, including interest. |
| `DebtMaximum`         | String    | Number        | Yes       | The maximum amount the protocol can owe the vault. The default value of `0` means there is no limit to the debt. |
| `CoverAvailable`      | String    | Number        | Yes       | The total amount of first-loss capital deposited into the lending protocol. |
| `CoverRateMinimum`    | Number    | UInt32        | Yes       | The 1/10th basis point of the `DebtTotal` that the first-loss capital must cover. Valid values are 0 to 100000 (inclusive), representing 0% to 100%. |
| `CoverRateLiquidation`| Number    | UInt12        | Yes       | The 1/10th basis point of minimum required first-loss capital that is moved to an asset vault to cover a loan default. Valid values are 0 to 100000 (inclusive), representing 0% to 100%. |


## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} ledger entries.


## {% $frontmatter.seo.title %} Reserve

`Loan` entries incur one owner reserve from the account that creates it.


## {% $frontmatter.seo.title %} ID Format

The ID of a `LoanBroker` entry is the [SHA512-Half][] of the following values, concatenated in order:

- The `LoanBroker` space key `0x006C`.
- The [AccountID][] of the account submitting the `LoanBrokerSet` transaction.
- The transaction `Sequence` number. If the transaction used a [Ticket][], the `TicketSequence` value is used instead.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
