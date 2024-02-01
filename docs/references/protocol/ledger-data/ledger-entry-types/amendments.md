---
html: amendments-object.html #amendments.html is taken by the concept page
parent: ledger-entry-types.html
seo:
    description: Singleton ledger entry with status of enabled and pending amendments.
labels:
  - Blockchain
---
# Amendments
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L138-L144 "Source")

The `Amendments` ledger entry type contains a list of [Amendments](../../../../concepts/networks-and-servers/amendments.md) that are currently active. Each ledger version contains **at most one** `Amendments` entry.

## Example {% $frontmatter.seo.title %} JSON

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

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), the {% code-page-name /%} ledger entry has the following fields:

| Name              | JSON Type | [Internal Type][] | Required? | Description |
|-------------------|-----------|-------------------|-----------|-------------|
| `Amendments`      | Array     | Vector256         | No        | Array of 256-bit [amendment IDs](../../../../concepts/networks-and-servers/amendments.md) for all currently enabled amendments. If omitted, there are no enabled amendments. |
| `Flags`           | Number    | UInt32            | Yes       | A bit-map of boolean flags enabled for this object. Currently, the protocol defines no flags for `Amendments` objects. The value is always `0`. |
| `LedgerEntryType` | String    | UInt16            | Yes       | The value `0x0066`, mapped to the string `Amendments`, indicates that this object describes the status of amendments to the XRP Ledger. |
| `Majorities`      | Array     | STArray           | No        | Array of objects describing the status of amendments that have majority support but are not yet enabled. If omitted, there are no pending amendments with majority support. |

Each member of the `Majorities` field, if it is present, is an object with one field, `Majority`, whose contents are a nested object with the following fields:

| Name              | JSON Type | [Internal Type][] | Description |
|-------------------|-----------|-------------------|-------------|
| `Amendment`       | String    | Hash256           | The Amendment ID of the pending amendment. |
| `CloseTime`       | Number    | UInt32            | The [`close_time` field](../ledger-header.md) of the ledger version where this amendment most recently gained a majority. |

In the [amendment process](../../../../concepts/networks-and-servers/amendments.md#amendment-process), a consensus of validators adds a new amendment to the `Majorities` field using an [EnableAmendment][] pseudo-transaction with the `tfGotMajority` flag when 80% or more of validators support it. If support for a pending amendment goes below 80%, an [EnableAmendment][] pseudo-transaction with the `tfLostMajority` flag removes the amendment from the `Majorities` array. If an amendment remains in the `Majorities` field for at least 2 weeks, an [EnableAmendment][] pseudo-transaction with no flags removes it from `Majorities` and permanently adds it to the `Amendments` field.

**Note:** Technically, all transactions in a ledger are processed based on which amendments are enabled in the ledger version immediately before it. While applying transactions to a ledger version where an amendment becomes enabled, the rules don't change mid-ledger. After the ledger is closed, the next ledger uses the new rules as defined by any new amendments that applied.

## {% $frontmatter.seo.title %} Flags

There are no flags defined for the {% code-page-name /%} entry.


## {% $frontmatter.seo.title %} Reserve

The {% code-page-name /%} entry does not require a reserve.


## {% $frontmatter.seo.title %} ID Format

The ID of the `Amendments` entry is the hash of the `Amendments` space key (`0x0066`) only. This means that the ID is always:

```
7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4
```

(Don't mix up the ID of the `Amendments` ledger entry type with the Amendment ID of an individual amendment.)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
