# LedgerHashes
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L104-L108 "Source")

(Not to be confused with the ["ledger hash" string data type][Hash], which uniquely identifies a ledger version. This section describes the `LedgerHashes` ledger object type.)

The `LedgerHashes` object type contains a history of prior ledgers that led up to this ledger version, in the form of their hashes. Objects of this ledger type are modified automatically in the process of closing a ledger. (This is the only time the ledger's "state" tree is modified without a transaction or pseudo-transaction.) The `LedgerHashes` objects exist to make it possible to look up a previous ledger's hash with only the current ledger version and at most one lookup of a previous ledger version.

There are two kinds of `LedgerHashes` object. Both types have the same fields. Each ledger version contains:

- Exactly one "recent history" `LedgerHashes` object
- A number of "previous history" `LedgerHashes` objects based on the current ledger index (that is, the length of the ledger history). Specifically, the XRP Ledger adds a new "previous history" object every 65536 ledger versions.

**Note:** As an exception, a new genesis ledger has no `LedgerHashes` objects at all, because it has no ledger history.

Example `LedgerHashes` object (trimmed for length):

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

A `LedgerHashes` object has the following fields:

| Name              | JSON Type | [Internal Type][] | Description |
|-------------------|-----------|-------------------|-------------|
| `LedgerEntryType` | String    | UInt16    | The value `0x0068`, mapped to the string `LedgerHashes`, indicates that this object is a list of ledger hashes. |
| `FirstLedgerSequence` | Number | UInt32   | **DEPRECATED** Do not use. (The "recent hashes" object of the production XRP Ledger has the value `2` in this field as a result of a previous `rippled` software. That value gets carried forward as the "recent hashes" object is updated. New "previous history" objects do not have this field, nor do "recent hashes" objects in [parallel networks](parallel-networks.html) started with more recent versions of `rippled`.) |
| `LastLedgerSequence` | Number | UInt32 | The [Ledger Index][] of the last entry in this object's `Hashes` array. |
| `Hashes` | Array of Strings | STI_VECTOR256 | An array of up to 256 ledger hashes. The contents depend on which sub-type of `LedgerHashes` object this is. |
| `Flags`             | Number    | UInt32    | A bit-map of boolean flags for this object. No flags are defined for this type. |

## Recent History LedgerHashes

There is exactly one `LedgerHashes` object of the "recent history" sub-type in every ledger after the genesis ledger. This object contains the identifying hashes of the most recent 256 ledger versions (or fewer, if the ledger history has less than 256 ledgers total) in the `Hashes` array. Whenever a new ledger is closed, part of the process of closing it involves updating the "recent history" object with the hash of the previous ledger version this ledger version is derived from (also known as this ledger version's _parent ledger_). When there are more than 256 hashes, the oldest one is removed.

Using the "recent history" `LedgerHashes` object of a given ledger, you can get the hash of any ledger index within the 256 ledger versions before the given ledger version.

## Previous History LedgerHashes

The "previous history" `LedgerHashes` entries collectively contain the hash of every 256th ledger version (also called "flag ledgers") in the full history of the ledger. When the child of a flag ledger closes, the flag ledger's hash is added to the `Hashes` array of the newest "previous history" `LedgerHashes` object. Every 65536 ledgers, `rippled` creates a new `LedgerHashes` object, so that each "previous history" object has the hashes of 256 flag ledgers.

**Note:** The oldest "previous history" `LedgerHashes` object contains only 255 entries because the genesis ledger has ledger index 1, not 0.

The "previous history" `LedgerHashes` objects act as a [skip list](https://en.wikipedia.org/wiki/Skip_list) so you can get the hash of any historical flag ledger from its index. From there, you can use that flag ledger's "recent history" object to get the hash of any other ledger.

## LedgerHashes ID Formats
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/Indexes.cpp#L26-L42)

There are two formats for `LedgerHashes` object IDs, depending on whether the object is a "recent history" sub-type or a "previous history" sub-type.

The **"recent history"** `LedgerHashes` object has an ID that is the [SHA-512Half][] of the `LedgerHashes` space key (`0x0073`). In other words, the "recent history" always has the ID `B4979A36CDC7F3D3D5C31A4EAE2AC7D7209DDA877588B9AFC66799692AB0D66B`.

The **"previous history"** `LedgerHashes` objects have an ID that is the [SHA-512Half][] of the following values, concatenated in order:

- The `LedgerHashes` space key (`0x0073`)
- The 32-bit [Ledger Index][] of a flag ledger in the object's `Hashes` array, divided by 65536.

    **Tip:** Dividing by 65536 keeps the most significant 16 bits, which are the same for all the flag ledgers listed in a "previous history" object, and only those ledgers. You can use this fact to look up the `LedgerHashes` object that contains the hash of any flag ledger.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
