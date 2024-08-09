---
html: get_aggregate_price.html
parent: ledger-methods.html
blurb: Calculates the aggregate price of specified Oracle instances.
status: not_enabled
labels:
  - Oracle
---
# get_aggregate_price

_(Requires the [PriceOracle amendment][] {% not-enabled /%})_

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/GetAggregatePrice.cpp "Source")


The `get_aggregate_price` method retrieves the aggregate price of specified `Oracle` objects, returning three price statistics: mean, median, and trimmed mean.


## Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "get_aggregate_price",
  "ledger_index": "current",
  "base_asset": "XRP",
  "quote_asset": "USD",
  "trim": 20,
  "oracles": [
    {
      "account": "rp047ow9WcPmnNpVHMQV5A4BF6vaL9Abm6",
      "oracle_document_id": 34
    },
    {
      "account": "rp147ow9WcPmnNpVHMQV5A4BF6vaL9Abm7",
      "oracle_document_id": 56
    },
    {
      "account": "rp247ow9WcPmnNpVHMQV5A4BF6vaL9Abm8",
      "oracle_document_id": 2
    },
    {
      "account": "rp347ow9WcPmnNpVHMQV5A4BF6vaL9Abm9",
      "oracle_document_id": 7
    },
    {
      "account": "rp447ow9WcPmnNpVHMQV5A4BF6vaL9Abm0",
      "oracle_document_id": 109
    }
  ]
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "get_aggregate_price",
  "params": [
    {
      "ledger_index": "current",
      "base_asset": "XRP",
      "quote_asset": "USD",
      "trim": 20,
      "oracles": [
        {
          "account": "rp047ow9WcPmnNpVHMQV5A4BF6vaL9Abm6",
          "oracle_document_id": 34
        },
        {
          "account": "rp147ow9WcPmnNpVHMQV5A4BF6vaL9Abm7",
          "oracle_document_id": 56
        },
        {
          "account": "rp247ow9WcPmnNpVHMQV5A4BF6vaL9Abm8",
          "oracle_document_id": 2
        },
        {
          "account": "rp347ow9WcPmnNpVHMQV5A4BF6vaL9Abm9",
          "oracle_document_id": 7
        },
        {
          "account": "rp447ow9WcPmnNpVHMQV5A4BF6vaL9Abm0",
          "oracle_document_id": 109
        }
      ]
    }
  ]
}
```
{% /tab %}

{% /tabs %}


[Try it! >](/resources/dev-tools/websocket-api-tool#get_aggregate_price)


The request contains the following parameters:

| Field                        | Type   | Required? | Description |
|------------------------------|--------|-----------|-------------|
| `base_asset`                 | String | Yes       | The currency code of the asset to be priced. |
| `quote_asset`                | String | Yes       | The currency code of the asset to quote the price of the base asset. |
| `trim`                       | Number | No        | The percentage of outliers to trim. Valid trim range is 1-25. If included, the API returns statistics for the `trimmed mean`. |
| `trim_threshold`             | Number | No        | Defines a time range in seconds for filtering out older price data. Default value is 0, which doesn't filter any data. |
| `oracles`                    | Array  | Yes       | The oracle identifier. |
| `oracles.account`            | String | Yes       | The XRPL account that controls the `Oracle` object. |
| `oracles.oracle_document_id` | Number | Yes       | A unique identifier of the price oracle for the `Account` |


## Response Format

An example of the response format:

```json
{
  "entire_set" : {
    "mean" : "74.75",
    "size" : 10,
    "standard_deviation" : "0.1290994448735806"
  },
  "ledger_current_index" : 25,
  "median" : "74.75",
  "status" : "success",
  "trimmed_set" : {
    "mean" : "74.75",
    "size" : 6,
    "standard_deviation" : "0.1290994448735806"
  },
  "validated" : false,
  "time" : 78937648
}
```

| Field                       | Type   | Description |
|-----------------------------|--------|-------------|
| `entire_set` | Object | The statistics from the collected oracle prices. |
| `entire_set.mean` | String | The simple mean. |
| `entire_set.size` | Number | The size of the data set to calculate the mean. |
| `entire_set.standard_deviation` | String | The standard deviation. |
| `trimmed_set` | Object | The trimmed statistics from the collected oracle prices. Only appears if the `trim` field was specified in the request. |
| `trimmed_set.mean` | String | The simple mean of the trimmed data. |
| `trimmed_set.size` | Number | The size of the data to calculate the trimmed mean. |
| `trimmed_set.standard_deviation` | String | The standard deviation of the trimmed data. |
| `time` | Number | The most recent timestamp out of all `LastUpdateTime` values. |

{% admonition type="info" name="Notes" %}

- The most recent `Oracle` objects are obtained for the specified oracles.
- The most recent `LastUpdateTime` among all objects is chosen as the upper time threshold.
- An `Oracle` object is included in the aggregation dataset if it contains the specified `base_asset`/`quote_asset` pair, has an `AssetPrice` field, and its `LastUpdateTime` is within the time range specified.
- If an `Oracle` object doesn't contain an `AssetPrice` for the specified token pair, then up to three previous `Oracle` objects are examined and the most recent one that fulfills the requirements is included.

{% /admonition %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
