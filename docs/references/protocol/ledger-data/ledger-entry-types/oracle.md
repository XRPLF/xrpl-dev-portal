---
seo:
    description: A record of price information about currency pairs from an outside source.
labels:
  - Decentralized Exchange
---
# Oracle
[[Source]](https://github.com/XRPLF/rippled/blob/f64cf9187affd69650907d0d92e097eb29693945/include/xrpl/protocol/detail/ledger_entries.macro#L385-L395 "Source")

An `Oracle` ledger entry holds data associated with a single [price oracle](../../../../concepts/decentralized-storage/price-oracles.md), which can store information on up to 10 asset pairs. You can create or modify a price oracle with an [OracleSet transaction][].

_(Added by the [PriceOracle amendment][])_

## Example Oracle JSON

```json
{
  "LedgerEntryType": "Oracle",
  "Owner": "rNZ9m6AP9K7z3EVg6GhPMx36V4QmZKeWds",
  "Provider": "70726F7669646572",
  "AssetClass": "63757272656E6379",
  "PriceDataSeries": [
    {
      "PriceData": {
        "BaseAsset": "XRP",
        "QuoteAsset": "USD",
        "AssetPrice": 740,
        "Scale": 3,
      }
    },
  ],
  "LastUpdateTime": 1724871860,
  "PreviousTxnID": "C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9",
  "PreviousTxnLgrSeq": 3675418
}
```


## Oracle Fields

| Field               | JSON Type | Internal Type | Required? | Description |
|---------------------|-----------|---------------|-----------|-------------|
| `Owner`             | String    | AccountID     | Yes       | The [account](../../../../concepts/accounts/index.md) with update and delete privileges for the oracle. It's recommended to set up [multi-signing](../../../../tutorials/how-tos/manage-account-settings/set-up-multi-signing.md) on this account. |
| `Provider`          | String    | Blob          | Yes       | An arbitrary value that identifies an oracle provider, such as Chainlink, Band, or DIA. This field is a string, up to 256 ASCII hex encoded characters (`0x20`-`0x7E`). |
| `PriceDataSeries`   | Array     | Array         | Yes       | An array of up to 10 `PriceData` objects, each representing the price information for an asset pair. More than five `PriceData` objects require two owner reserves. |
| `LastUpdateTime`    | Number    | UInt32        | Yes       | The time the data was last updated, represented in Unix time. (**Note:** Unlike many other time values on the XRP Ledger, this value does not use the Ripple Epoch.) |
| `URI`               | String    | Blob          | No        | An optional Universal Resource Identifier to reference price data off-chain. This field is limited to 256 bytes. |
| `AssetClass`        | String    | Blob          | Yes       | Arbitrary string to describe the type of asset, such as _currency_, _commodity_, or _index_. Must be formatted as hexadecimal representing ASCII characters (`0x20`-`0x7E`), maximum 16 bytes. |
| `OwnerNode`         | String    | UInt64        | Yes       | A hint indicating which page of the oracle owner's owner directory links to this entry, in case the directory consists of multiple pages. |
| `PreviousTxnID`     | String    | UInt256       | Yes       | The hash of the previous transaction that modified this entry. |
| `PreviousTxnLgrSeq` | String    | UInt32        | Yes       | The ledger index that this object was most recently modified or created in. |


### PriceData Fields

| Field               | JSON Type | Internal Type | Required? | Description |
|---------------------|-----------|---------------|-----------|-------------|
| `BaseAsset`         | String    | Currency      | Yes       | The primary asset in a trading pair. Any valid identifier, such as a stock symbol, bond CUSIP, or currency code is allowed. |
| `QuoteAsset`        | String    | Currency      | Yes       | The quote asset in a trading pair. The quote asset denotes the price of one unit of the base asset. |
| `AssetPrice`        | String    | UInt64        | No        | The asset price after applying the `Scale` precision level. It's not included if the last update transaction didn't include the `BaseAsset`/`QuoteAsset` pair. Displayed in hexadecimal format. |
| `Scale`             | Number    | UInt8         | No        | The scaling factor to apply to an asset price. For example, if `Scale` is 6 and original price is 0.155, then the scaled price is 155000. Valid scale ranges are 0-10. It's not included if the last update transaction didn't include the `BaseAsset`/`QuoteAsset` pair. |


## Oracle Reserve

An `Oracle` object counts as one item for purposes of the [owner reserve](../../../../concepts/accounts/reserves.md#base-reserve-and-owner-reserve) if it contains one to five `PriceData` objects, and counts as two items if it contains six to ten `PriceData` objects.


## Oracle ID Format

The ID of an `Oracle` object is the [SHA-512Half][] of the following values, concatenated in order:

1. The `Oracle` space key (`0x52`)
2. The `Owner` Account ID.
3. The `OracleDocumentID`.


## Currency Internal Format

The `Currency` field type contains 160 bits of arbitrary data representing a currency or asset code. If the data matches the XRPL's standard format for [currency codes][], the API displays it as a string such as `"USD"`; otherwise, it displays as 40 characters of hexadecimal. The following JSON example represents the `912810RR9/USD` trading pair. The `BaseAsset` is a CUSIP code `912810RR9` represented as a hexadecimal string, and the `QuoteAsset` is a standard `USD` currency code:

```json
{
  "PriceData" : {
    "BaseAsset" : "3931323831305252390000000000000000000000",
    "QuoteAsset" : "USD",
    "Scale" : 1,
    "SymbolPrice" : 740
  }
}
```

## See Also

- **Transactions:**
  - [OracleSet transaction][]
  - [OracleDelete transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
