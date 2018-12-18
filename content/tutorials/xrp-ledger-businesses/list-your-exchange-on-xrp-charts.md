# List Your Exchange on XRP Charts

In addition to providing data about the XRP Ledger network and its accounts and transactions, XRP Charts also provides [XRP market data](https://xrpcharts.ripple.com/#/xrp-markets). ***TODO: Correct? Is this the area of the site that exchanges are asking to be listed in? Live Chart, Multi Markets, Active Accounts, XRP Markets?*** This tutorial describes how to have your exchange and its XRP trade and order book data listed on XRP Charts.

To enable XRP Charts to list your exchange, complete the following tasks:

1. Provide a [Get Recently Executed Trades](#provide-a-get-recently-executed-trades-endpoint) REST API endpoint.

2. Provide a [Get Current Order Book](#provide-a-get-current-order-book-endpoint) REST API endpoint.

3. [Send a listing request to XRP Charts](#send-a-listing-request-to-xrp-charts).

If you have any questions about endpoint specifications, contact xxx@xxxxx.com. ***TODO: do we want to provide support? This will help avoid them guessing while building and then find out that their endpoint doesn't meet our specs only after they've requested listing.***


## Provide a Get Recently Executed Trades Endpoint

***TODO: Do we really mean "recently" only? If yes, how recent? last 500-1000 as described below?***

Provide a REST API endpoint that returns data about individual trades executed in a particular market. ***TODO: is this about trades that involve XRP as a base or counter curr only? I see a wider variety of currencies listed on the site.***

XRP Charts will query this endpoint at least every 15-30 seconds. The endpoint must be capable of returning 500-1,000 trades per response, but that number could be smaller when the `last_tid` query parameter is included. ***TODO: What is the purpose of this spec, just so I can better explain it? 500-1000 trades is a response without any query parameters. Does this mean that the endpoint doesn't have to be able to return anything older than the last 1,000 trades (since we specifically call this "get recently executed trades")? Or does the endpoint need to be able to respond to a request with a tid from 1 year ago - returning every trade since that tid - which could be more than 1000? Or is this saying that the endpoint needs to provide pagination that enables XRP Charts to request results in sets of 500 to 1,000 at a time -- with a query parameter of a tid from last year, for example?***


### Request Format

Provide a request format like the following:

```
GET {api_base_url}/v1/trades
```

***TODO: any authentication specs? or publicly accessible?***

#### Query Parameters

Provide the following query parameters. XRP Charts will optionally use them to narrow the trades returned in the response. ***TODO: true? will XRP Charts always make this call with both query params present? Or also with just one or the other, or none?***

| Field      | Type    | Description                                           |
|:-----------|:--------|:------------------------------------------------------|
| `market`   | String  | Returns trades executed in a particular market. Valid values can include `XRPBTC` or `USDXRP`, for example. For fiat currencies, use [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html) currency codes. For cryptocurrencies, see codes listed in the currency drop-down on XRP Charts [Markets page](https://xrpcharts.ripple.com/#/markets). For cryptocurrencies not listed in the drop-down, contact xxxxxx@xxxxxx.com. ***TODO: Is there a suggested format we want them to use for these market values -- such as <BASECURRENCY><COUNTERCURRENCY>? Is this currency code guidance okay? Who should they contact if they need guidance on a cryptocurrency code not already represented on XRP Charts?*** |
| `last_tid` | Integer | Returns trades executed after a specific trade ID. XRP Charts uses this parameter to get all trades after the last set of trades imported into site data, for example. The parameter also enables XRP Charts to ensure that it has recorded all trades. |


### Response Format

A successful response must be a JSON array of objects, one for each trade. Each trade must be described using the following fields. ***TODO: must or should? how strict are we being about field names, etc?***

| Field       | Type             | Description                                 |
|:------------|:-----------------|:--------------------------------------------|
| `tid`       | Integer          | Unique identifier of the trade. Ideally, this is a sequential integer. ***TODO: ideally, or required?*** |
| `type`      | String           | Valid values include `buy` and `sell`.      |
| `price`     | String or Number | Exchange rate of the trade.                 |
| `amount`    | String or Number | Amount of XRP bought or sold.               |
| `size`      | String or Number | Amount of counter currency traded.          |
| `timestamp` | String           | Time at which the trade was executed in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) or [Unix time](https://en.wikipedia.org/wiki/Unix_time) format. ***TODO: Type correct? If ISO 8601, the type can be `date-time`. But b/c Unix time, must be string?*** |


### Example

#### Request

```
GET https://api.example.com/v1/trades?market=XRPBTC&last_tid=75208825
```

#### Response

```json
[
   {
      "tid":75208827,
      "type":"buy",
      "price":"0.57201",
      "amount":"4954.0744",
      "size":"2833.7801",
      "timestamp":"2018-10-01T12:41:16.000Z"
   },
   {
      "tid":75208826,
      "type":"sell",
      "price":"0.57201",
      "amount":"4954.0744",
      "size":"2833.7801",
      "timestamp":"2018-10-01T12:41:16.000Z"
   },
   ...
]
```



## Provide a Get Current Order Book Endpoint

Provide a REST API endpoint that returns data about the current order book in a particular market.

XRP Charts will query this endpoint about every 30 seconds.


### Request Format

Provide a request format like the following:

```
GET {exchange_base_url}/v1/orderbook
```

***TODO: any authentication specs? or publicly accessible?***

#### Query Parameter

Provide the following query parameter. ***TODO: Will XRP Charts always make this call with the market query param present?***

| `Field`  | Type   | Description                                              |
|:---------|:-------|:---------------------------------------------------------|
| `market` | String | Returns the current order book in a particular market. Valid values can include `XRPBTC`, `USDXRP`, or `BTCXRP`, for example. For fiat currencies, use [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html) currency codes. For cryptocurrencies, see codes listed in the currency drop-down on XRP Charts [Markets page](https://xrpcharts.ripple.com/#/markets). For cryptocurrencies not listed in the drop-down, contact xxxxxx@xxxxxx.com. ***TODO: Is there a suggested format we want them to use for these market values -- such as <BASECURRENCY><COUNTERCURRENCY>? Is this currency code guidance okay? Who should they contact if they need guidance on a cryptocurrency code not already represented on XRP Charts?*** |


### Response Format

A successful response must be a JSON object that includes a timestamp and arrays of current bids and asks. The response does not need to provide the entire order book, but rather just enough data to provide a good idea of the current liquidity available in the market.

| Field       | Type             | Description                                 |
|:------------|:-----------------|:--------------------------------------------|
| `timestamp` | String           | Time at which the response was sent in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) or [Unix time](https://en.wikipedia.org/wiki/Unix_time) format. ***TODO: Not sure about the description - okay? Data type correct? If ISO 8601, the type can be `date-time`. But b/c Unix time, must be string?*** |
| `bids`      | Array of objects | Bids in the order book. Each object in the array must provide the offered `price` and `amount` of XRP available at that price. |
| `asks`      | Array of objects | Asks in the order book. Each object in the array must provide the offered `price` and `amount` of XRP available at that price. |


### Example

#### Request

```
GET https://api.example.com/v1/orderbook?market=XRPBTC
```

#### Response

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



## Send a Listing Request to XRP Charts

Contact xxx@xxxxx.com to request that your exchange be listed on XRP Charts.

In the request be sure to include: ***TODO: what do we need to know about them? do we want them to include links to their endpoints?***

- ABC

- XYZ

***TODO: alternatively, do we want to just have them submit everything via a Google Form like this one, for example? https://docs.google.com/forms/d/e/1FAIpQLScszfq7rRLAfArSZtvitCyl-VFA9cNcdnXLFjURsdCQ3gHW7w/viewform***
