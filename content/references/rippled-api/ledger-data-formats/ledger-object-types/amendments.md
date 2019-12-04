# Amendments
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L110-L113 "Source")

The `Amendments` object type contains a list of [Amendments](amendments.html) that are currently active. Each ledger version contains **at most one** `Amendments` object.

## Example {{currentpage.name}} JSON

```json
{
    "Majorities": [
        {
            "Majority": {
                "Amendment": "1562511F573A19AE9BD103B5D6B9E01B3B46805AEC5D3C4805C902B514399146",
                "CloseTime": 535589001
            }
        }
    ],
    "Amendments": [
        "42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE",
        "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373",
        "6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC",
        "740352F2412A9909880C23A559FCECEDA3BE2126FED62FC7660D628A06927F11"
    ],
    "Flags": 0,
    "LedgerEntryType": "Amendments",
    "index": "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4"
}
```

## {{currentpage.name}} Fields

| Name              | JSON Type | [Internal Type][] | Description |
|-------------------|-----------|-------------------|-------------|
| `Amendments`      | Array     | STI_VECTOR256     | _(Optional)_ Array of 256-bit [amendment IDs](amendments.html#about-amendments) for all currently-enabled amendments. If omitted, there are no enabled amendments. |
| `Majorities`      | Array     | STI_ARRAY | _(Optional)_ Array of objects describing the status of amendments that have majority support but are not yet enabled. If omitted, there are no pending amendments with majority support. |
| `Flags`           | Number    | UInt32    | A bit-map of boolean flags. No flags are defined for the Amendments object type, so this value is always `0`. |
| `LedgerEntryType` | String    | UInt16    |  The value `0x0066`, mapped to the string `Amendments`, indicates that this object describes the status of amendments to the XRP Ledger. |

Each member of the `Majorities` field, if it is present, is an object with one field, `Majority`, whose contents are a nested object with the following fields:

| Name              | JSON Type | [Internal Type][] | Description |
|-------------------|-----------|-------------------|-------------|
| `Amendment`       | String    | Hash256           | The Amendment ID of the pending amendment. |
| `CloseTime`       | Number    | UInt32            | The [`close_time` field](ledger-header.html) of the ledger version where this amendment most recently gained a majority. |

In the [amendment process](amendments.html#amendment-process), a consensus of validators adds a new amendment to the `Majorities` field using an [EnableAmendment][] pseudo-transaction with the `tfGotMajority` flag when 80% or more of validators support it. If support for a pending amendment goes below 80%, an [EnableAmendment][] pseudo-transaction with the `tfLostMajority` flag removes the amendment from the `Majorities` array. If an amendment remains in the `Majorities` field for at least 2 weeks, an [EnableAmendment][] pseudo-transaction with no flags removes it from `Majorities` and permanently adds it to the `Amendments` field.

**Note:** Technically, all transactions in a ledger are processed based on which amendments are enabled in the ledger version immediately before it. While applying transactions to a ledger version where an amendment becomes enabled, the rules don't change mid-ledger. After the ledger is closed, the next ledger uses the new rules as defined by any new amendments that applied.

## Amendments ID Format

The `Amendments` object ID is the hash of the `Amendments` space key (`0x0066`) only. This means that the ID of the `Amendments` object in a ledger is always:

```
7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4
```

(Don't mix up the ID of the `Amendments` ledger object type with the Amendment ID of an individual amendment.)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
