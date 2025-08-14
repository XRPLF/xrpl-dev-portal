---
seo:
    description: Singleton object with consensus-approved base transaction cost and reserve requirements.
labels:
  - Fees
---
# FeeSettings
[[Source]](https://github.com/XRPLF/rippled/blob/f64cf9187affd69650907d0d92e097eb29693945/include/xrpl/protocol/detail/ledger_entries.macro#L297-L309 "Source")

The `FeeSettings` entry contains the current base [transaction cost](../../../../concepts/transactions/transaction-cost.md) and [reserve amounts](../../../../concepts/accounts/reserves.md) as determined by [fee voting](../../../../concepts/consensus-protocol/fee-voting.md). Each ledger version contains **at most one** `FeeSettings` entry.

## Example {% $frontmatter.seo.title %} JSON

This ledger entry has two formats, depending on whether the [XRPFees amendment][] was enabled at the time:

{% tabs %}
{% tab label="Current Format" %}
```json
{
  "BaseFeeDrops": "10",
  "Flags": 0,
  "LedgerEntryType": "FeeSettings",
  "PreviousTxnID": "4EEDB01BB943CE32E97BB468AC179ABF933B272D6FF990E76B6721FB48E069FC",
  "PreviousTxnLgrSeq": 92508417,
  "ReserveBaseDrops": "1000000",
  "ReserveIncrementDrops": "200000",
  "index": "4BC50C9B0D8515D3EAAE1E74B29A95804346C491EE1A95BF25E4AAB854A6A651"
}
```
{% /tab %}

{% tab label="Legacy Format" %}
```json
{
   "BaseFee": "000000000000000A",
   "Flags": 0,
   "LedgerEntryType": "FeeSettings",
   "ReferenceFeeUnits": 10,
   "ReserveBase": 20000000,
   "ReserveIncrement": 5000000,
   "index": "4BC50C9B0D8515D3EAAE1E74B29A95804346C491EE1A95BF25E4AAB854A6A651"
}
```
{% /tab %}
{% /tabs %}

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), the {% code-page-name /%} ledger entry has the following fields:

The fields of a SetFee pseudo-transaction depend on whether the [XRPFees amendment][] was enabled at the time. In addition to the [common fields](./pseudo-transaction-types.md), they can use the following:

{% tabs %}
{% tab label="Current Format" %}
| Name                    | JSON Type | [Internal Type][] | Required? | Description            |
|:------------------------|:----------|:------------------|:----------|:-----------------------|
| `BaseFeeDrops`          | String    | Amount            | Yes       | The [transaction cost](../../../../concepts/transactions/transaction-cost.md) of the "reference transaction" in drops of XRP. |
| `Flags`                 | Number    | UInt32            | Yes       | A bitmap of boolean flags enabled for this object. Currently, the protocol defines no flags for `FeeSettings` objects. The value is always `0`. |
| `LedgerEntryType`       | String    | UInt16            | Yes       | The value `0x0073`, mapped to the string `FeeSettings`, indicates that this object contains the ledger's fee settings. |
| `ReserveBaseDrops`      | String    | Amount            | Yes       | The [base reserve](../../../../concepts/accounts/reserves.md#base-reserve-and-owner-reserve) for an account in the XRP Ledger, as drops of XRP. |
| `ReserveIncrementDrops` | String    | Amount            | Yes       | The incremental [owner reserve](../../../../concepts/accounts/reserves.md#base-reserve-and-owner-reserve) for owning objects, as drops of XRP. |
| `PreviousTxnID`         | String    | UInt256           | No        | The identifying hash of the transaction that most recently modified this entry. _(Added by the [fixPreviousTxnID amendment][].)_ |
| `PreviousTxnLgrSeq` | Number    | UInt32            | No        | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this entry. _(Added by the [fixPreviousTxnID amendment][].)_ |
{% /tab %}

{% tab label="Legacy Format" %}
| Name                | JSON Type | [Internal Type][] | Required? | Description            |
|:--------------------|:----------|:------------------|:----------|:-----------------------|
| `BaseFee`           | String    | UInt64            | Yes       | The [transaction cost](../../../../concepts/transactions/transaction-cost.md) of the "reference transaction" in drops of XRP as hexadecimal. |
| `Flags`             | Number    | UInt32            | Yes       | A bit-map of boolean flags enabled for this object. Currently, the protocol defines no flags for `FeeSettings` objects. The value is always `0`. |
| `LedgerEntryType`   | String    | UInt16            | Yes       | The value `0x0073`, mapped to the string `FeeSettings`, indicates that this object contains the ledger's fee settings. |
| `ReferenceFeeUnits` | Number    | UInt32            | Yes       | The `BaseFee` translated into "fee units". |
| `ReserveBase`       | Number    | UInt32            | Yes       | The [base reserve](../../../../concepts/accounts/reserves.md#base-reserve-and-owner-reserve) for an account in the XRP Ledger, as drops of XRP. |
| `ReserveIncrement`  | Number    | UInt32            | Yes       | The incremental [owner reserve](../../../../concepts/accounts/reserves.md#base-reserve-and-owner-reserve) for owning objects, as drops of XRP. |
| `PreviousTxnID`     | String    | UInt256           | No        | The identifying hash of the transaction that most recently modified this entry. _(Added by the [fixPreviousTxnID amendment][].)_ |
| `PreviousTxnLgrSeq` | Number    | UInt32            | No        | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this entry. _(Added by the [fixPreviousTxnID amendment][].)_ |

{% admonition type="danger" name="Warning" %}The JSON format for this ledger entry type is unusual. The `BaseFee`, `ReserveBase`, and `ReserveIncrement` indicate drops of XRP but ***not*** in the usual format for [specifying XRP][Currency Amount].{% /admonition %}

{% /tab %}
{% /tabs %}


## {% $frontmatter.seo.title %} Flags

There are no flags defined for the {% code-page-name /%} entry.


## FeeSettings ID Format

The ID of the `FeeSettings` entry is the hash of the `FeeSettings` space key (`0x0065`) only. This means that the ID is always:

```
4BC50C9B0D8515D3EAAE1E74B29A95804346C491EE1A95BF25E4AAB854A6A651
```

{% raw-partial file="/docs/_snippets/common-links.md" /%}
