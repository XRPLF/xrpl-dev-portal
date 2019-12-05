# FeeSettings
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L115-L120 "Source")

The `FeeSettings` object type contains the current base [transaction cost](transaction-cost.html) and [reserve amounts](reserves.html) as determined by [fee voting](fee-voting.html). Each ledger version contains **at most one** `FeeSettings` object.

## Example {{currentpage.name}} JSON

Example `FeeSettings` object:

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

## {{currentpage.name}} Fields

The `FeeSettings` object has the following fields:

| Name                | JSON Type | [Internal Type][] | Description            |
|:--------------------|:----------|:------------------|:-----------------------|
| `LedgerEntryType`   | String    | UInt16            | The value `0x0073`, mapped to the string `FeeSettings`, indicates that this object contains the ledger's fee settings. |
| `BaseFee`           | String    | UInt64            | The [transaction cost](transaction-cost.html) of the "reference transaction" in drops of XRP as hexadecimal. |
| `ReferenceFeeUnits` | Number    | UInt32            | The `BaseFee` translated into "fee units". |
| `ReserveBase`       | Number    | UInt32            | The [base reserve](reserves.html#base-reserve-and-owner-reserve) for an account in the XRP Ledger, as drops of XRP. |
| `ReserveIncrement`  | Number    | UInt32            | The incremental [owner reserve](reserves.html#base-reserve-and-owner-reserve) for owning objects, as drops of XRP. |
| `Flags`             | Number    | UInt32            | A bit-map of boolean flags for this object. No flags are defined for this type. |

**Warning:** The JSON format for this ledger object type is unusual. The `BaseFee`, `ReserveBase`, and `ReserveIncrement` indicate drops of XRP but ***not*** in the usual format for [specifying XRP][Currency Amount].

## FeeSettings ID Format

The `FeeSettings` object ID is the hash of the `FeeSettings` space key (`0x0065`) only. This means that the ID of the `FeeSettings` object in a ledger is always:

```
4BC50C9B0D8515D3EAAE1E74B29A95804346C491EE1A95BF25E4AAB854A6A651
```

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
