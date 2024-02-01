---
html: ledger-header.html
parent: ledger-data-formats.html
seo:
    description: A unique header that describes the contents of a ledger version.
labels:
  - Data Retention
  - Blockchain
---
# Ledger Header
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/ledger/ReadView.h#L71 "Source")

Every [ledger version](../../../concepts/ledgers/index.md) has a unique header that describes the contents. You can look up a ledger's header information with the [ledger method][]. The contents of the ledger header are as follows:

| Field                         | JSON Type | [Internal Type][] | Description   |
|:------------------------------|:----------|:------------------|:--------------|
| `ledger_index`                | String    | UInt32            | The [ledger index][Ledger Index] of the ledger. Some API methods display this as a quoted integer; some display it as a native JSON number. |
| `ledger_hash`                 | String    | Hash256           | The [SHA-512Half][] of this ledger version. This serves as a unique identifier for this ledger and all its contents. |
| `account_hash`                | String    | Hash256           | The [SHA-512Half][] of this ledger's state tree information. |
| [`close_flags`](#close-flags) | Number    | UInt8             | A bit-map of flags relating to the closing of this ledger. |
| `close_time`                  | Number    | UInt32            | The [approximate time this ledger version closed](../../../concepts/ledgers/ledger-close-times.md), as the number of seconds since the Ripple Epoch of 2000-01-01 00:00:00 UTC. This value is rounded based on the `close_time_resolution`. |
| `close_time_resolution`       | Number    | Uint8             | An integer in the range \[2,120\] indicating the maximum number of seconds by which the `close_time` could be rounded. |
| `closed`                      | Boolean   | Boolean           | If `true`, this ledger version is no longer accepting new transactions. (However, unless this ledger version is validated, it might be replaced by a different ledger version with a different set of transactions.) |
| `parent_hash`                 | String    | Hash256           | The `ledger_hash` value of the previous ledger version that is the direct predecessor of this one. If there are different versions of the previous ledger index, this indicates from which one the ledger was derived. |
| `total_coins`                 | String    | UInt64            | The total number of [drops of XRP][] owned by accounts in the ledger. This omits XRP that has been destroyed by transaction fees. The actual amount of XRP in circulation is lower because some accounts are "black holes" whose keys are not known by anyone. |
| `transaction_hash`            | String    | Hash256           | The [SHA-512Half][] of the transactions included in this ledger. |


## Ledger Index
{% partial file="/docs/_snippets/data_types/ledger_index.md" /%}



## Close Flags

The ledger has only one flag defined for `closeFlags`: **`sLCF_NoConsensusTime`** (value `1`). If this flag is enabled, it means that validators had different [close times for the ledger](../../../concepts/ledgers/ledger-close-times.md), but built otherwise the same ledger, so they declared consensus while "agreeing to disagree" on the close time. In this case, official `close_time` value of the ledger is 1 second after that of the parent ledger.


## See Also

For ledger basics, see [Ledgers](../../../concepts/ledgers/index.md).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
