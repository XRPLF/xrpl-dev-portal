---
html: enableamendment.html
parent: pseudo-transaction-types.html
seo:
    description: Enable a change in transaction processing.
labels:
  - Blockchain
---
# EnableAmendment

An `EnableAmendment` pseudo-transaction marks a change in the status of a proposed amendment when it:

- Gains supermajority approval from validators.
- Loses supermajority approval.
- Is enabled on the XRP Ledger protocol.

<!-- TODO: Move to propose amendments tutorial.

A server only enables amendments when these conditions are met:
  
- A previous ledger includes an `EnableAmendment` pseudo-transaction with the `tfGotMajority` flag enabled.
- The previous ledger in question is an ancestor of the current ledger.
- The previous ledger in question has a close time that is at least two weeks before the close time of the latest flag ledger.
- There are no `EnableAmendment` pseudo-transactions for this amendment with the `tfLostMajority` flag enabled in the consensus ledgers between the `tfGotMajority` pseudo-transaction and the current ledger.

-->

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "Account": "rrrrrrrrrrrrrrrrrrrrrhoLvTp",
  "Amendment": "42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE",
  "Fee": "0",
  "LedgerSequence": 21225473,
  "Sequence": 0,
  "SigningPubKey": "",
  "TransactionType": "EnableAmendment"
}  
```


{% partial file="/docs/_snippets/pseudo-tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->

| Field            | JSON Type | [Internal Type][] | Description               |
|:-----------------|:----------|:------------------|:--------------------------|
| `Amendment`      | String    | Hash256           | A unique identifier for the amendment. This is not intended to be a human-readable name. See [Amendments](../../../../concepts/networks-and-servers/amendments.md) for a list of known amendments. |
| `LedgerSequence` | Number    | UInt32    | The [ledger index][] where this pseudo-transaction appears. This distinguishes the pseudo-transaction from other occurrences of the same change. |

## EnableAmendment Flags

The `Flags` value of the EnableAmendment pseudo-transaction indicates the status of the amendment at the time of the ledger including the pseudo-transaction.

A `Flags` value of `0` (no flags) or an omitted `Flags` field indicates that the amendment has been enabled, and applies to all ledgers afterward. Other `Flags` values are as follows:

| Flag Name        | Hex Value    | Decimal Value | Description                |
|:-----------------|:-------------|:--------------|:---------------------------|
| `tfGotMajority`  | `0x00010000` | 65536         | Support for this amendment increased to at least 80% of trusted validators starting with this ledger version. |
| `tfLostMajority` | `0x00020000` | 131072        | Support for this amendment decreased to less than 80% of trusted validators starting with this ledger version. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
