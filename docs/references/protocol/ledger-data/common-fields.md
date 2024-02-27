---
html: ledger-entry-common-fields.html
seo:
    description: These common fields are part of every ledger entry.
---
# Ledger Entry Common Fields
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp)

Every entry in a [ledger](../../../concepts/ledgers/index.md)'s state data has the same set of common fields, plus additional fields based on the [ledger entry type](ledger-entry-types/index.md). Field names are case-sensitive. The common fields for all ledger entries are:

| Field                    | JSON Type | [Internal Type][] | Required? | Description |
|:-------------------------|:----------|:------------------|:----------|:------------|
| `index` or `LedgerIndex` | String    | Hash256           | No        | The unique ID for this ledger entry. In JSON, this field is represented with different names depending on the context and API method. (Note, even though this is specified as "optional" in the code, every ledger entry should have one unless it's legacy data from very early in the XRP Ledger's history.) |
| `LedgerEntryType`        | String    | UInt16            | Yes       | The type of ledger entry. Valid [ledger entry types](ledger-entry-types/index.md) include `AccountRoot`, `Offer`, `RippleState`, and others. |
| `Flags`                  | Number    | UInt32            | Yes       | Set of bit-flags for this ledger entry. |

**Caution:** In JSON, the ledger entry ID is in the `index` or `LedgerIndex` field. This is not the same as a [ledger index][] in the `ledger_index` field.


## Ledger Entry ID

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/Indexes.cpp)

Each ledger entry has a unique ID. The ID is derived by hashing important contents of the entry, along with a [namespace identifier](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/LedgerFormats.h). The [ledger entry type](ledger-entry-types/index.md) determines the namespace identifier to use and which contents to include in the hash. This ensures every ID is unique. The hash function is [SHA-512Half][].

Generally, a ledger entry's ID is returned as the `index` field in JSON, at the same level as the object's contents. In [transaction metadata](../transactions/metadata.md), the ledger object's ID in JSON is `LedgerIndex`.

Offer directories have special IDs, where part of the hash is replaced with the exchange rate of Offers in that directory.

[{% inline-svg file="/docs/img/ledger-object-ids.svg" /%}](/docs/img/ledger-object-ids.svg "Diagram: ID calculations for different types of ledger entries. The space key prevents IDs for different types from colliding.")


## Flags

Flags are on/off settings, which are represented as binary values that are combined into a single number using bitwise-OR operations. The bit values for the flags in ledger entries are different than the values used to enable or disable those flags in a transaction. Ledger state flags have names that begin with **`lsf`**.

The possible values for the flags field vary based on the ledger entry type. Some ledger entry types have no flags defined. In these cases, the `Flags` field always has the value `0`.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
