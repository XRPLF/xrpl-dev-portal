# List Your Exchange on XRP Charts

In addition to providing data about the XRP Ledger network and its accounts and transactions, XRP Charts also provides [XRP market data](https://xrpcharts.ripple.com/#/xrp-markets) from external exchanges. This tutorial describes how to have your exchange and its XRP trade and order book data listed on XRP Charts.

To enable XRP Charts to list your exchange, complete the following tasks:

1. [Provide a Recently Executed Trades RESTful API endpoint](#provide-a-recently-executed-trades-endpoint).

2. [Provide a Current Order Book RESTful API endpoint](#provide-a-current-order-book-endpoint).

3. [Send an exchange listing request to XRP Charts](#send-an-exchange-listing-request-to-xrp-charts).

Your exchange may have existing RESTful API endpoints that can deliver data in the formats described in this document. If so, there may be little to no development effort required on your part to complete tasks 1 and 2.

If you have any questions about endpoint specifications, contact xxx@xxxxx.com. ***TODO: do we want to provide a way for them to contact us for dev support?***


## Provide a Recently Executed Trades Endpoint

Provide a RESTful API endpoint that returns the most recent 500-1,000 individual trades executed in a particular XRP market.

To ensure that it doesn't miss a trade, XRP Charts queries the endpoint frequently, between every 5 and 30 seconds, aiming to get responses that have overlapping trade data. Ensure that any rate limit enforced by your endpoint can accommodate this query frequency. XRP Charts records unique trade data only, even if it gets overlapping trades.

If XRP Charts needs to query your endpoint at a frequency that exceeds your rate limit, XRP Charts may request that you adjust the rate limit or provide the `last_tid` parameter. ***TODO: okay to state this? accurate?***


### Request Format

Provide a request format like the following:

```
GET {api_base_url}/v1/trades
```

#### Authentication

We prefer to work with a publicly accessible endpoint.

#### Parameters

Provide parameters that help XRP Charts filter trades returned in the response. The parameter field names are examples. You can use other names. Your endpoint doesn't have to provide the optional parameters, but they are useful.

| Field      | Type    | Description                                           |
|:-----------|:--------|:------------------------------------------------------|
| `market`   | String  | Returns trades executed in a particular market in which XRP is either the base or counter currency. Use a suggested format of `<basecurrency>_<countercurrency>` to provide valid values like `xrp_btc`, `btc_xrp`, `xrp_usd`, or `usd_xrp`, for example. |
| `last_tid` | Integer | _(Optional)_ Returns trades executed after a specific trade ID. For example, XRP Charts can use this parameter to get all trades after the last set of trades recorded in site data, ensuring that it has recorded all trades. |
| `limit`    | Integer | _(Optional)_ Returns no more than a specific number of trades in a response. |


### Response Format

A successful response must be a JSON array of objects, one for each trade. The parameter field names are examples. You can use other names. Your endpoint doesn't have to provide the optional parameters, but they are useful.

***TODO: `tid` should be required, is that right? Or is there some other way to determine uniqueness?***

| Field       | Type             | Description                                 |
|:------------|:-----------------|:--------------------------------------------|
| `price`     | String or Number | Exchange rate of the trade.                 |
| `amount`    | String or Number | Amount of XRP bought or sold.               |
| `timestamp` | String           | Time at which the trade was executed in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) or [Unix time](https://en.wikipedia.org/wiki/Unix_time) format. ***TODO: just making sure - either format okay?*** |
| `tid`       | Integer          | _(Optional)_ Unique identifier of the trade. Ideally, make this a sequential integer. |
| `type`      | String           | _(Optional)_ Type of trade. For example, valid values can include `buy` and `sell`. |
| `size`      | String or Number | _(Optional)_ Amount of counter currency traded. |
| `count`     | Integer          | _(Optional)_ Number of trade objects returned in the response. |


### Examples

***TODO: examples below okay - esp use of `limit` in URL and `count` in response message?***

#### Example Request

```
GET https://api.example.com/v1/trades?market=xrp_btc&last_tid=75208825&limit=500
```

#### Example Response

```json
[
   {
      "tid":75209326,
      "type":"buy",
      "price":"0.57201",
      "amount":"4954.0744",
      "size":"2833.7801",
      "timestamp":"2018-10-01T12:35:11.000Z"
   },
   ...
   {
      "tid":75208826,
      "type":"sell",
      "price":"0.57201",
      "amount":"4954.0744",
      "size":"2833.7801",
      "timestamp":"2018-10-01T12:31:16.000Z"
   }
   "count":"500"
]
```



## Provide a Current Order Book Endpoint

Provide a RESTful API endpoint that returns data about the current order book in a particular market.

XRP Charts will query this endpoint about every 30 seconds. ***TODO: does this frequency vary based on data retrieved?***


### Request Format

Provide a request format like the following:

```
GET {api_base_url}/v1/orderbook
```

#### Authentication

We prefer to work with a publicly accessible endpoint.

#### Parameter

Provide the following parameter. The parameter field name is an example. You can use another name.

| `Field`  | Type   | Description                                              |
|:---------|:-------|:---------------------------------------------------------|
| `market` | String | Returns the current order book in which XRP is either the base or counter currency. Use a suggested format of `<basecurrency>_<countercurrency>` to provide valid values like `xrp_btc`, `btc_xrp`, `xrp_usd`, or `usd_xrp`, for example. |


### Response Format

A successful response must be a JSON object that includes a timestamp and arrays of current bids and asks. The response does not need to provide the entire order book, but rather just enough data to provide a good idea of the current liquidity available in the market. The parameter field names are examples. You can use other names.

| Field       | Type             | Description                                 |
|:------------|:-----------------|:--------------------------------------------|
| `timestamp` | String           | Time at which the response was sent in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) or [Unix time](https://en.wikipedia.org/wiki/Unix_time) format. ***TODO: just making sure - either format okay?*** |
| `bids`      | Array of objects | Bids in the order book. Each object in the array must provide the offered `price` and `amount` of XRP available at that price. |
| `asks`      | Array of objects | Asks in the order book. Each object in the array must provide the offered `price` and `amount` of XRP available at that price. |


### Examples

#### Example Request

```
GET https://api.example.com/v1/orderbook?market=xrp_btc
```

#### Example Response

```json
{
   "timestamp":"2018-10-01T12:41:16.000Z",
   "bids":[
      {
         "price":0.00007103,
         "amount":140
      },
      {
         "price":0.000071,
         "amount":135
      },
      {
         "price":0.00007092,
         "amount":5266
      }
   ],
   "asks":[
      {
         "price":0.00007108,
         "amount":140
      },
      {
         "price":0.00007109,
         "amount":84
      },
      {
         "price":0.0000711,
         "amount":10650
      }
   ]
}
```



## Send an Exchange Listing Request to XRP Charts

Contact xxx@xxxxx.com to request that your exchange be listed on XRP Charts. ***TODO: alternatively, do we want to just have them submit everything via a Google Form like this one, for example? https://docs.google.com/forms/d/e/1FAIpQLScszfq7rRLAfArSZtvitCyl-VFA9cNcdnXLFjURsdCQ3gHW7w/viewform***

In the request be sure to include:

- A link to your API documentation

- ***TODO: Anything else we want them to provide?***
