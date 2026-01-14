---
seo:
    description: Create or update a price oracle.
labels:
    - Oracle
---
# OracleSet
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/SetOracle.cpp "Source")

Create or update a [price oracle](../../../../concepts/decentralized-storage/price-oracles.md). Only the owner of an existing price oracle can update it.

{% amendment-disclaimer name="PriceOracle" /%}


## Example OracleSet JSON

```json
{
  "Account": "roosteri9aGNFRXZrJNYQKVBfxHiE5abg",
  "AssetClass": "63757272656E6379",
  "Fee": "12",
  "LastUpdateTime": 1760397040,
  "OracleDocumentID": 3,
  "PriceDataSeries": [
    {
      "PriceData": {
        "AssetPrice": "267e",
        "BaseAsset": "XRP",
        "QuoteAsset": "SAR",
        "Scale": 3
      }
    },
    {
      "PriceData": {
        "AssetPrice": "214a",
        "BaseAsset": "XRP",
        "QuoteAsset": "THB",
        "Scale": 2
      }
    },
    {
      "PriceData": {
        "AssetPrice": "1abc8",
        "BaseAsset": "XRP",
        "QuoteAsset": "TRY",
        "Scale": 3
      }
    },
    {
      "PriceData": {
        "AssetPrice": "13b19",
        "BaseAsset": "XRP",
        "QuoteAsset": "TWD",
        "Scale": 3
      }
    },
    {
      "PriceData": {
        "AssetPrice": "686e090",
        "BaseAsset": "XRP",
        "QuoteAsset": "UAH",
        "Scale": 6
      }
    },
    {
      "PriceData": {
        "AssetPrice": "a34",
        "BaseAsset": "XRP",
        "QuoteAsset": "USD",
        "Scale": 3
      }
    },
    {
      "PriceData": {
        "AssetPrice": "11d9",
        "BaseAsset": "XRP",
        "QuoteAsset": "ZAR",
        "Scale": 2
      }
    }
  ],
  "Provider": "7468726565787270",
  "Sequence": 95076881,
  "TransactionType": "OracleSet",
  "URI": "68747470733A2F2F6174746573746174696F6E2E74687265657872702E6465762F63757272656E63793A39393530323934303A39353037363838313A33"
}
```

{% tx-example txid="11449FDBDF40345F08B2E1537EA9590369B5A662CDEB3DB71F9A2CC04E1012C1" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field              | JSON Type | Internal Type | Required? | Description |
|--------------------|-----------|---------------|-----------|-------------|
| `OracleDocumentID` | Number    | UInt32        | Yes       | The identifying number of the price oracle, which must be unique per owner. |
| `Provider`         | String    | Blob          | Variable  | An arbitrary value that identifies an oracle provider, such as Chainlink, Band, or DIA. This field is a string, up to 256 ASCII hex encoded characters (0x20-0x7E). This field is required when creating a new price oracle, but is optional for updates. |
| `URI`              | String    | Blob          | No        | An optional Universal Resource Identifier to reference price data off-chain. This field is limited to 256 bytes. |
| `LastUpdateTime`   | Number    | UInt32        | Yes       | The time the data was last updated, in seconds since the [UNIX Epoch](https://en.wikipedia.org/wiki/Unix_time). The value must be within 300 seconds (5 minutes) of the ledger's close time. |
| `AssetClass`       | String    | Blob          | Variable  | Describes the type of asset, such as "currency", "commodity", or "index". This field is a string, up to 16 ASCII hex encoded characters (0x20-0x7E). This field is required when creating a new `Oracle` ledger entry, but is optional for updates. |
| `PriceDataSeries`  | Array     | Array         | Yes       | An array of up to 10 `PriceData` objects, each representing the price information for a token pair. More than five `PriceData` objects require two owner reserves. |


### PriceData Fields

| Field               | JSON Type | Internal Type | Required? | Description |
|---------------------|-----------|---------------|-----------|-------------|
| `BaseAsset`         | String    | Currency      | Yes       | The primary asset in a trading pair. Any valid identifier, such as a stock symbol, bond CUSIP, or currency code is allowed. For example, in the BTC/USD pair, BTC is the base asset; in 912810RR9/BTC, 912810RR9 is the base asset. |
| `QuoteAsset`        | String    | Currency      | Yes       | The quote asset in a trading pair. The quote asset denotes the price of one unit of the base asset. For example, in the BTC/USD pair, BTC is the base asset; in 912810RR9/BTC, 912810RR9 is the base asset. |
| `AssetPrice`        | String    | UInt64        | No        | The asset price after applying the `Scale` precision level. It's not included if the last update transaction didn't include the `BaseAsset`/`QuoteAsset` pair. It's recommended you provide this value as a hexadecimal, but [client libraries](https://xrpl.org/docs/references#client-libraries) will accept decimal numbers and convert to hexadecimal strings. |
| `Scale`             | Number    | UInt8         | No        | The scaling factor to apply to an asset price. For example, if `Scale` is 6 and original price is 0.155, then the scaled price is 155000. Valid scale ranges are 0-10. It's not included if the last update transaction didn't include the `BaseAsset`/`QuoteAsset` pair.|

`PriceData` is created or updated, following these rules:

- New token pairs in the transaction are added to the object.
- Token pairs in the transaction overwrite corresponding token pairs in the object.
- Token pairs in the transaction with a missing `AssetPrice` field delete corresponding token pairs in the object.
- Token pairs that only appear in the object have `AssetPrice` and `Scale` removed to signify that the price is outdated.

When updating fewer entries than the existing oracle contains, the `LastUpdateTime` applies to all entries. Entries not included in the update have their prices removed to indicate they are out of date for the given `LastUpdateTime`. To access historical price data for these entries, you can:

- Use the `ledger_entry` method with `PreviousTxnLgrSeq` to traverse previous Oracle objects
- Use the `tx` method with `PreviousTxnID` to find historical transactions

This design choice saves space by having a single `LastUpdateTime` for all entries rather than tracking update times per token pair.

{% admonition type="info" name="Note" %}
The order of token pairs in the transaction isn't important because each token pair uniquely identifies the location of the `PriceData` object in the `PriceDataSeries`.
{% /admonition %}


## Error Cases

Besides errors that can occur for all transactions, `OracleSet` transactions can result in the following transaction result codes.

| Error Code                | Description |
|---------------------------|-------------|
| `temARRAY_EMPTY`          | The `PriceDataSeries` has no `PriceData` objects. |
| `tecARRAY_TOO_LARGE`      | The `PriceDataSeries` exceeds the ten `PriceData` objects limit. |
| `tecINVALID_UPDATE_TIME`  | The `LastUpdateTime` is invalid. This can occur when the time is more than 300 seconds before or after the ledger close time, or when updating an existing oracle, the new `LastUpdateTime` is not greater than the previous value. |
| `tecTOKEN_PAIR_NOT_FOUND` | The token pair you're trying to delete doesn't exist in the `Oracle` object. |
| `tecARRAY_EMPTY`          | The `PriceDataSeries` has no `PriceData` objects. |
| `temARRAY_TOO_LARGE`      | The `PriceDataSeries` exceeds the ten `PriceData` objects limit. |

## See Also

- [Oracle entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
