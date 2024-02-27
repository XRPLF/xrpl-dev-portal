---
html: book_offers.html
parent: path-and-order-book-methods.html
seo:
    description: Get info about offers to exchange two currencies.
labels:
  - Decentralized Exchange
  - Cross-Currency
---
# book_offers
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/BookOffers.cpp "Source")

The `book_offers` method retrieves a list of [Offers](../../../../concepts/tokens/decentralized-exchange/offers.md) between two currencies, also known as an _order book_. The response omits [unfunded Offers](../../../../concepts/tokens/decentralized-exchange/offers.md#lifecycle-of-an-offer) and reports how much of each remaining Offer's total is currently funded.

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
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
{% /tab %}

{% tab label="JSON-RPC" %}
```json
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
                "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
            },
            "limit": 10
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: book_offers taker_pays taker_gets [taker [ledger [limit] ] ]
rippled book_offers 'USD/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B' 'EUR/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#book_offers)

The request includes the following parameters:

| `Field`        | Type             | Required? | Description |
|:---------------|:-----------------|:----------|-------------|
| `taker_gets`   | Object           | Yes       | The asset the account taking the Offer would receive, as a [currency without an amount](../../../protocol/data-types/currency-formats.md#specifying-without-amounts). |
| `taker_pays`   | Object           | Yes       | The asset the account taking the Offer would pay, as a [currency without an amount](../../../protocol/data-types/currency-formats.md#specifying-without-amounts). |
| `ledger_hash`  | [Hash][]         | No        | A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | [Ledger Index][] | No        | The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `limit`        | Number           | No        | The maximum number of Offers to return. The response may include fewer results. |
| `taker`        | String           | No        | The [Address][] of an account to use as a perspective. The response includes this account's Offers even if they are unfunded. (You can use this to see what Offers are above or below yours in the order book.) |


## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
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
{% /tab %}

{% tab label="JSON-RPC" %}
```json
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
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "ledger_current_index" : 56867201,
      "offers" : [
         {
            "Account" : "rnixnrMHHvR7ejMpJMRCWkaNrq3qREwMDu",
            "BookDirectory" : "7E5F614417C2D0A7CEFEB73C4AA773ED5B078DE2B5771F6D56038D7EA4C68000",
            "BookNode" : "0000000000000000",
            "Flags" : 131072,
            "LedgerEntryType" : "Offer",
            "OwnerNode" : "0000000000000000",
            "PreviousTxnID" : "E43ADD1BD4AC2049E0D9DE6BC279B7FD95A99C8DE2C4694A4A7623F6D9AAAE29",
            "PreviousTxnLgrSeq" : 47926685,
            "Sequence" : 219,
            "TakerGets" : {
               "currency" : "EUR",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "2.459108753792364"
            },
            "TakerPays" : {
               "currency" : "USD",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "24.59108753792364"
            },
            "index" : "3087B4828C6B5D8595EA325D69C0F396C57452893647799493A38F2C164990AB",
            "owner_funds" : "2.872409153061363",
            "quality" : "10"
         },
         {
            "Account" : "rKwjWCKBaASEvtHCxtvReNd2i9n8DxSihk",
            "BookDirectory" : "7E5F614417C2D0A7CEFEB73C4AA773ED5B078DE2B5771F6D56038D7EA4C68000",
            "BookNode" : "0000000000000000",
            "Flags" : 131072,
            "LedgerEntryType" : "Offer",
            "OwnerNode" : "0000000000000000",
            "PreviousTxnID" : "B63B2ECD124FE6B02BC2998929517266BD221A02FEE51DDE4992C1BCB7E86CD3",
            "PreviousTxnLgrSeq" : 43166305,
            "Sequence" : 19,
            "TakerGets" : {
               "currency" : "EUR",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "3.52"
            },
            "TakerPays" : {
               "currency" : "USD",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "35.2"
            },
            "index" : "89865F2C70D1140796D9D249AC2ED765AE2D007A52DEC6D6D64CCB1A77A6EB7F",
            "owner_funds" : "3.523192614770459",
            "quality" : "10",
            "taker_gets_funded" : {
               "currency" : "EUR",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "3.516160294182094"
            },
            "taker_pays_funded" : {
               "currency" : "USD",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "35.16160294182094"
            }
         }
      ],
      "status" : "success",
      "validated" : false
   }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                | Type             | Description             |
|:-----------------------|:-----------------|:------------------------|
| `ledger_current_index` | [Ledger Index][] | _(Omitted if `ledger_current_index` is provided)_ The [ledger index][] of the current in-progress ledger version, which was used to retrieve this information. |
| `ledger_index`         | [Ledger Index][] | _(Omitted if `ledger_current_index` provided)_ The ledger index of the ledger version that was used when retrieving this data, as requested. |
| `ledger_hash`          | [Hash][]         | _(May be omitted)_ The identifying hash of the ledger version that was used when retrieving this data, as requested. |
| `offers`               | Array            | Array of offer objects, each of which has the fields of an [Offer object](../../../protocol/ledger-data/ledger-entry-types/offer.md) |

In addition to the standard Offer fields, the following fields may be included in members of the `offers` array:

| `Field`             | Type                | Description         |
|:--------------------|:--------------------|:--------------------|
| `owner_funds`       | String              | Amount of the `TakerGets` currency the side placing the offer has available to be traded. (XRP is represented as drops; any other currency is represented as a decimal value.) If a trader has multiple offers in the same book, only the highest-ranked offer includes this field. |
| `taker_gets_funded` | [Currency Amount][] | _(Only included in partially-funded offers)_ The maximum amount of currency that the taker can get, given the funding status of the offer. |
| `taker_pays_funded` | [Currency Amount][] | _(Only included in partially-funded offers)_ The maximum amount of currency that the taker would pay, given the funding status of the offer. |
| `quality`           | String              | The exchange rate, as the ratio `taker_pays` divided by `taker_gets`. For fairness, offers that have the same quality are automatically taken first-in, first-out. (In other words, if multiple people offer to exchange currency at the same rate, the oldest offer is taken first.) |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `srcCurMalformed` - The `taker_pays` field in the request is not formatted properly.
* `dstAmtMalformed` - The `taker_gets` field in the request is not formatted properly.
* `srcIsrMalformed` - The `issuer` field of the `taker_pays` field in the request is not valid.
* `dstIsrMalformed` - The `issuer` field of the `taker_gets` field in the request is not valid.
* `badMarket` - The desired order book does not exist; for example, offers to exchange a currency for itself.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
