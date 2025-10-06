---
seo:
    description: Enable a change in transaction processing.
labels:
    - Blockchain
---
# EnableAmendment
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Change.cpp "Source")

An `EnableAmendment` [pseudo-transaction](./index.md) marks a change in the status of a proposed [amendment to the protocol](../../../../concepts/networks-and-servers/amendments.md). The possible status changes are:

- The amendment gains supermajority approval from validators.
- The amendment loses supermajority approval.
- The amendment becomes enabled.

{% admonition type="info" name="Note" %}You cannot send a pseudo-transaction, but you may find one when processing ledgers.{% /admonition %}

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

| Field            | JSON Type | [Internal Type][] | Description               |
|:-----------------|:----------|:------------------|:--------------------------|
| `Amendment`      | String    | UInt256           | A unique identifier for the amendment. This is not intended to be a human-readable name. See [Known Amendments](../../../../../resources/known-amendments.md) for a list of known amendments. |
| `LedgerSequence` | Number    | UInt32            | The [ledger index][] where this pseudo-transaction appears. This distinguishes the pseudo-transaction from other occurrences of the same change. |

## EnableAmendment Flags

The `Flags` value of the EnableAmendment pseudo-transaction indicates the status of the amendment at the time of the ledger including the pseudo-transaction.

A `Flags` value of `0` (no flags) or an omitted `Flags` field indicates that the amendment has been enabled, and applies to all ledgers afterward. Other `Flags` values are as follows:

| Flag Name        | Hex Value    | Decimal Value | Description                |
|:-----------------|:-------------|:--------------|:---------------------------|
| `tfGotMajority`  | `0x00010000` | 65536         | Support for this amendment increased to at least 80% of trusted validators starting with this ledger version. |
| `tfLostMajority` | `0x00020000` | 131072        | Support for this amendment decreased to less than 80% of trusted validators starting with this ledger version. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
