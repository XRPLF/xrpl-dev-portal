---
seo:
    description: Lists of prior ledger versions' hashes for history lookup.
labels:
  - Blockchain
---
# LedgerHashes
[[Source]](https://github.com/XRPLF/rippled/blob/1e01cd34f7a216092ed779f291b43324c167167a/include/xrpl/protocol/detail/ledger_entries.macro#L215-L219 "Source")

(Not to be confused with the ["ledger hash" string data type][Hash], which uniquely identifies a ledger version. This page describes the `LedgerHashes` ledger entry type.)

The `LedgerHashes` ledger entry type contains a history of prior ledgers that led up to this ledger version, in the form of their hashes. Entries of this type are modified automatically when closing a ledger. (This is one of the only times a ledger's state data is modified without a [transaction](../../../../concepts/transactions/index.md) or [pseudo-transaction](../../transactions/pseudo-transaction-types/pseudo-transaction-types.md).) The `LedgerHashes` entries exist to make it possible to look up a previous ledger's hash with only the current ledger version and at most one lookup of a previous ledger version.

There are two kinds of `LedgerHashes` entry. Both types have the same fields. Each ledger version contains:

- Exactly one "recent history" `LedgerHashes` entry.
- A number of "previous history" `LedgerHashes` entries based on the current ledger index (that is, the length of the ledger history). Specifically, the XRP Ledger adds a new "previous history" object every 65536 ledger versions.

{% admonition type="info" name="Note" %}As an exception, a new genesis ledger has no `LedgerHashes` objects at all, because it has no ledger history.{% /admonition %}

Example `LedgerHashes` entry (trimmed for length):

```json
{
  "LedgerEntryType": "LedgerHashes",
  "Flags": 0,
  "FirstLedgerSequence": 2,
  "LastLedgerSequence": 33872029,
  "Hashes": [
    "D638208ADBD04CBB10DE7B645D3AB4BA31489379411A3A347151702B6401AA78",
    "254D690864E418DDD9BCAC93F41B1F53B1AE693FC5FE667CE40205C322D1BE3B",
    "A2B31D28905E2DEF926362822BC412B12ABF6942B73B72A32D46ED2ABB7ACCFA",
    "AB4014846DF818A4B43D6B1686D0DE0644FE711577C5AB6F0B2A21CCEE280140",
    "3383784E82A8BA45F4DD5EF4EE90A1B2D3B4571317DBAC37B859836ADDE644C1",
    ... (up to 256 ledger hashes) ...
  ],
  "index": "B4979A36CDC7F3D3D5C31A4EAE2AC7D7209DDA877588B9AFC66799692AB0D66B"
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Name                  | JSON Type        | [Internal Type][] | Required? | Description |
|:----------------------|:-----------------|:------------------|:----------|:------------|
| `FirstLedgerSequence` | Number           | UInt32            | No        | **DEPRECATED** Do not use. (The "recent hashes" object on Mainnet has the value `2` in this field as a result of an old software bug. That value gets carried forward as the "recent hashes" object is updated. New "previous history" objects do not have this field, nor do "recent hashes" objects in [parallel networks](../../../../concepts/networks-and-servers/parallel-networks.md) started with more recent versions of `rippled`.) |
| `Hashes`              | Array of Strings | Vector256         | Yes       | An array of up to 256 ledger hashes. The contents depend on which sub-type of `LedgerHashes` object this is. |
| `LastLedgerSequence`  | Number           | UInt32            | No        | The [Ledger Index][] of the last entry in this object's `Hashes` array. |
| `LedgerEntryType`     | String           | UInt16            | Yes       | The value `0x0068`, mapped to the string `LedgerHashes`, indicates that this object is a list of ledger hashes. |


## Recent History LedgerHashes

There is exactly one `LedgerHashes` entry of the "recent history" sub-type in every ledger after the genesis ledger. This entry contains the identifying hashes of the most recent 256 ledger versions (or fewer, if the ledger history has less than 256 ledgers total) in the `Hashes` array. Whenever a new ledger is closed, part of the process of closing it involves updating the "recent history" entry with the hash of the previous ledger version this ledger version is derived from (also known as this ledger version's _parent ledger_). When there are more than 256 hashes, the oldest one is removed.

Using the "recent history" `LedgerHashes` entry of a given ledger, you can get the hash of any of the 256 ledger versions before it.


## Previous History LedgerHashes

The "previous history" `LedgerHashes` entries collectively contain the hash of every 256th ledger version (also called "flag ledgers") in the full history of the ledger. When the child of a flag ledger closes, the flag ledger's hash is added to the `Hashes` array of the newest "previous history" `LedgerHashes` entry. Every 65536 ledgers, `rippled` creates a new `LedgerHashes` entry, so that each "previous history" entry has the hashes of 256 flag ledgers.

{% admonition type="info" name="Note" %}The oldest "previous history" `LedgerHashes` entry contains only 255 hashes because the genesis ledger has ledger index 1, not 0.{% /admonition %}

The "previous history" `LedgerHashes` objects act as a [skip list](https://en.wikipedia.org/wiki/Skip_list) so you can get the hash of any historical flag ledger from its index. From there, you can use that flag ledger's "recent history" object to get the hash of any other ledger.


## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} entries.


## LedgerHashes ID Formats
[[Source]](https://github.com/XRPLF/rippled/blob/1e01cd34f7a216092ed779f291b43324c167167a/src/libxrpl/protocol/Indexes.cpp#L195-L201)

There are two formats for `LedgerHashes` ledger entry IDs, depending on whether the entry is a "recent history" sub-type or a "previous history" sub-type.

The **"recent history"** `LedgerHashes` entry has an ID that is the [SHA-512Half][] of the `LedgerHashes` space key (`0x0073`). In other words, the "recent history" always has the ID `B4979A36CDC7F3D3D5C31A4EAE2AC7D7209DDA877588B9AFC66799692AB0D66B`.

Each **"previous history"** `LedgerHashes` entry has an ID that is the [SHA-512Half][] of the following values, concatenated in order:

- The `LedgerHashes` space key (`0x0073`)
- The 32-bit [Ledger Index][] of a flag ledger in the object's `Hashes` array, divided by 65536.

    {% admonition type="success" name="Tip" %}Dividing by 65536 keeps the most significant 16 bits, which are the same for all the flag ledgers listed in a "previous history" entry, and only those ledgers. You can use this fact to look up the `LedgerHashes` entry that contains the hash of any flag ledger.{% /admonition %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
