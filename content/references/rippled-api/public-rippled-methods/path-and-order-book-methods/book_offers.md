# book_offers
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/BookOffers.cpp "Source")

The `book_offers` method retrieves a list of offers, also known as the [order book](http://www.investopedia.com/terms/o/order-book.asp), between two currencies. If the results are very large, a partial result is returned with a marker so that later requests can resume from where the previous one left off.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 4,
  "command": "book_offers",
  "taker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "taker_gets": {
    "currency": "XRP"
  },
  "taker_pays": {
    "currency": "USD",
    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  },
  "limit": 10
}
```

*JSON-RPC*

```
{
    "method": "book_offers",
    "params": [
        {
            "taker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "taker_gets": {
                "currency": "XRP"
            },
            "taker_pays": {
                "currency": "USD",
                "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            },
            "limit": 10
        }
    ]
}
```

*Commandline*

```
#Syntax: book_offers taker_pays taker_gets [taker [ledger [limit] ] ]
rippled book_offers 'USD/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B' 'EUR/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#book_offers)

The request includes the following parameters:

| `Field`        | Type                                       | Description                    |
|:---------------|:-------------------------------------------|:-------------------------------|
| `ledger_hash`  | String                                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | String or Unsigned Integer                 | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `limit`        | Unsigned Integer                           | _(Optional)_ If provided, the server does not provide more than this many offers in the results. The total number of results returned may be fewer than the limit, because the server omits unfunded offers. |
| `marker`       | [Marker][] | _(Optional)_ Value from a previous paginated response. Resume retrieving data where that response left off. |
| `taker`        | String                                     | _(Optional)_ The [Address][] of an account to use as a perspective. [Unfunded offers](offers.html#lifecycle-of-an-offer) placed by this account are always included in the response. (You can use this to look up your own orders to cancel them.) |
| `taker_gets`   | Object                                     | Specification of which currency the account taking the offer would receive, as an object with `currency` and `issuer` fields (omit issuer for XRP), like [currency amounts][Currency Amount]. |
| `taker_pays`   | Object                                     | Specification of which currency the account taking the offer would pay, as an object with `currency` and `issuer` fields (omit issuer for XRP), like [currency amounts][Currency Amount]. |

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 11,
  "status": "success",
  "type": "response",
  "result": {
    "ledger_current_index": 7035305,
    "offers": [
      {
        "Account": "rM3X3QSr8icjTGpaF52dozhbT2BZSXJQYM",
        "BookDirectory": "7E5F614417C2D0A7CEFEB73C4AA773ED5B078DE2B5771F6D55055E4C405218EB",
        "BookNode": "0000000000000000",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000AE0",
        "PreviousTxnID": "6956221794397C25A53647182E5C78A439766D600724074C99D78982E37599F1",
        "PreviousTxnLgrSeq": 7022646,
        "Sequence": 264542,
        "TakerGets": {
          "currency": "EUR",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "17.90363633316433"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "27.05340557506234"
        },
        "index": "96A9104BF3137131FF8310B9174F3B37170E2144C813CA2A1695DF2C5677E811",
        "quality": "1.511056473200875"
      },
      {
        "Account": "rhsxKNyN99q6vyYCTHNTC1TqWCeHr7PNgp",
        "BookDirectory": "7E5F614417C2D0A7CEFEB73C4AA773ED5B078DE2B5771F6D5505DCAA8FE12000",
        "BookNode": "0000000000000000",
        "Flags": 131072,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000001",
        "PreviousTxnID": "8AD748CD489F7FF34FCD4FB73F77F1901E27A6EFA52CCBB0CCDAAB934E5E754D",
        "PreviousTxnLgrSeq": 7007546,
        "Sequence": 265,
        "TakerGets": {
          "currency": "EUR",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "2.542743233917848"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "4.19552633596446"
        },
        "index": "7001797678E886E22D6DE11AF90DF1E08F4ADC21D763FAFB36AF66894D695235",
        "quality": "1.65"
      }
    ]
  }
}
```

*JSON-RPC*

```
200 OK
{
    "result": {
        "ledger_current_index": 8696243,
        "offers": [],
        "status": "success",
        "validated": false
    }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                | Type                      | Description             |
|:-----------------------|:--------------------------|:------------------------|
| `ledger_current_index` | Number - [Ledger Index][] | _(Omitted if `ledger_current_index` is provided)_ The [ledger index][] of the current in-progress ledger version, which was used to retrieve this information. |
| `ledger_index`         | Number - [Ledger Index][] | _(Omitted if `ledger_current_index` provided)_ The ledger index of the ledger version that was used when retrieving this data, as requested. |
| `ledger_hash`          | String - [Hash][]         | _(May be omitted)_ The identifying hash of the ledger version that was used when retrieving this data, as requested. |
| `marker`               | [Marker][]                | _(May be omitted)_ Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. Omitted when there are no pages of information after this one. |
| `offers`               | Array                     | Array of offer objects, each of which has the fields of an [Offer object](offer.html) |

In addition to the standard Offer fields, the following fields may be included in members of the `offers` array:

| `Field`             | Type                             | Description         |
|:--------------------|:---------------------------------|:--------------------|
| `owner_funds`       | String                           | Amount of the TakerGets currency the side placing the offer has available to be traded. (XRP is represented as drops; any other currency is represented as a decimal value.) If a trader has multiple offers in the same book, only the highest-ranked offer includes this field. |
| `taker_gets_funded` | String (XRP) or Object (non-XRP) | (Only included in partially-funded offers) The maximum amount of currency that the taker can get, given the funding status of the offer. |
| `taker_pays_funded` | String (XRP) or Object (non-XRP) | (Only included in partially-funded offers) The maximum amount of currency that the taker would pay, given the funding status of the offer. |
| `quality`           | String                           | The exchange rate, as the ratio `taker_pays` divided by `taker_gets`. For fairness, offers that have the same quality are automatically taken first-in, first-out. (In other words, if multiple people offer to exchange currency at the same rate, the oldest offer is taken first.) |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `srcCurMalformed` - The `taker_pays` field in the request is not formatted properly.
* `dstAmtMalformed` - The `taker_gets` field in the request is not formatted properly.
* `srcIsrMalformed` - The `issuer` field of the `taker_pays` field in the request is not valid.
* `dstIsrMalformed` - The `issuer` field of the `taker_gets` field in the request is not valid.
* `badMarket` - The desired order book does not exist; for example, offers to exchange a currency for itself.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
