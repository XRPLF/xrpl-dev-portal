---
seo:
    description: Create or update a price oracle.
labels:
  - Oracle
---
# OracleSet
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/SetOracle.cpp "Source")

Creates a new `Oracle` ledger entry or updates the fields of an existing one, using the Oracle Document ID.

_(Added by the [PriceOracle amendment][].)_


## Example OracleSet JSON

```json
{
  "TransactionType": "OracleSet",
  "Account": "rNZ9m6AP9K7z3EVg6GhPMx36V4QmZKeWds",
  "OracleDocumentID": 34,
  "Provider": "70726F7669646572",
  "LastUpdateTime": 1724871860,
  "AssetClass": "63757272656E6379",
  "PriceDataSeries": [
    {
      "PriceData": {
        "BaseAsset": "XRP",
        "QuoteAsset": "USD",
        "AssetPrice": 740,
        "Scale": 3
      }
    }
  ]
}
```


## OracleSet Fields

| Field              | JSON Type | Internal Type | Required? | Description |
|--------------------|-----------|---------------|-----------|-------------|
| `Account`          | String    | AccountID     | Yes       | This account must match the account in the `Owner` field of the `Oracle` object. |
| `OracleDocumentID` | Number    | UInt32        | Yes       | A unique identifier of the price oracle for the `Account`. |
| `Provider`         | String    | Blob          | Variable  | An arbitrary value that identifies an oracle provider, such as Chainlink, Band, or DIA. This field is a string, up to 256 ASCII hex encoded characters (0x20-0x7E). This field is required when creating a new `Oracle` ledger entry, but is optional for updates. |
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

{% raw-partial file="/docs/_snippets/common-links.md" /%}
