# Ledger Header
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/ledger/ReadView.h#L71 "Source")

Every ledger version has a unique header that describes the contents. You can look up a ledger's header information with the [ledger method][]. The contents of the ledger header are as follows:

| Field                        | JSON Type | [Internal Type][] | Description   |
|:-----------------------------|:----------|:------------------|:--------------|
| `ledger_index`               | String    | UInt32            | The [ledger index][Ledger Index] of the ledger. Some API methods display this as a quoted integer; some display it as a native JSON number. |
| `ledger_hash`                | String    | Hash256           | The [SHA-512Half][] of this ledger version. This serves as a unique identifier for this ledger and all its contents. |
| `account_hash`               | String    | Hash256           | The [SHA-512Half][] of this ledger's state tree information. |
| `close_time`                 | Number    | UInt32            | The approximate time this ledger version closed, as the number of seconds since the Ripple Epoch of 2000-01-01 00:00:00. This value is rounded based on the `close_time_resolution`. |
| `closed`                     | Boolean   | Boolean           | If `true`, this ledger version is no longer accepting new transactions. (However, unless this ledger version is validated, it might be replaced by a different ledger version with a different set of transactions.) |
| `parent_hash`                | String    | Hash256           | The `ledger_hash` value of the previous ledger version that is the direct predecessor of this one. If there are different versions of the previous ledger index, this indicates from which one the ledger was derived. |
| `total_coins`                | String    | UInt64            | The total number of [drops of XRP][] owned by accounts in the ledger. This omits XRP that has been destroyed by transaction fees. The actual amount of XRP in circulation is lower because some accounts are "black holes" whose keys are not known by anyone. |
| `transaction_hash`           | String    | Hash256           | The [SHA-512Half][] of the transactions included in this ledger. |
| `close_time_resolution`      | Number    | Uint8             | An integer in the range \[2,120\] indicating the maximum number of seconds by which the `close_time` could be rounded. |
| [`closeFlags`](#close-flags) | (Omitted) | UInt8             | A bit-map of flags relating to the closing of this ledger. |


## Ledger Index
{% include '_snippets/data_types/ledger_index.md' %}
<!--{#_ #}-->


## Close Flags

The ledger has only one flag defined for closeFlags: **sLCF_NoConsensusTime** (value `1`). If this flag is enabled, it means that validators had different close times for the ledger, but built otherwise the same ledger, so they declared consensus while "agreeing to disagree" on the close time. In this case, the consensus ledger version contains a `close_time` value that is 1 second after that of the previous ledger. (In this case, there is no official close time, but the actual real-world close time is probably 3-6 seconds later than the specified `close_time`.)

The `closeFlags` field is not included in any JSON representations of a ledger, but is included in the binary representation of a ledger, and is one of the fields that determine the ledger's hash.


## See Also

For ledger basics, see [Ledgers](ledgers.html).


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
