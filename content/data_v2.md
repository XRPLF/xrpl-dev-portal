Ripple Data API v2
==================

The Ripple Data API v2 provides access to raw and processed information about changes in the Ripple Consensus Ledger. This information is stored in a database for easy access, which frees `rippled` servers to maintain fewer historical ledger versions. Additionally, the Data API v2 acts as a source of processed analytic data to applications such as [Ripple Charts](https://www.ripplecharts.com/) and [ripple.com](https://www.ripple.com).

Ripple Labs provides a live instance of the `rippled` Historical Database API with as complete a transaction record as possible at the following address:

[**https://data.ripple.com**](https://data.ripple.com)


## More Information ##
The Ripple Data API v2 is an evolution of the [Historical Database v1](historical_data.html) and the [Charts API](charts_api.html). 

* [API Methods](#api-method-reference)
* [API Objects](#api-objects)
* [Setup (local instance)](#running-the-historical-database)
* [Source Code on Github](https://github.com/ripple/rippled-historical-database)



# API Method Reference #

The Data API v2 provides a REST API with the following methods:

General Methods:

* [Get Ledger - `GET /v2/ledgers/{:ledger_identifier}`](#get-ledger)
* [Get Transaction - `GET /v2/transactions/{:hash}`](#get-transaction)
* [Get Transactions - `GET /v2/transactions/`](#get-transactions)
* [Get Exchanges - `GET /v2/exchanges/:base/:counter`](#get-exchanges)
* [Get Daily Summary - `GET /v2/reports/`](#get-daily-summary)
* [Get Stats - `GET /v2/stats/`](#get-stats)

Account Methods:

* [Get Account - `GET /v2/accounts/{:address}`](#get-account)
* [Get Accounts - `GET /v2/accounts`](#get-accounts)
* [Get Account Balances - `GET /v2/accounts/{:address}/balances`](#get-account-balances)
* [Get Account Transaction History - `GET /v2/accounts/{:address}/transactions`](#get-account-transaction-history)
* [Get Transaction By Account and Sequence - `GET /v2/accounts/{:address}/transactions/{:sequence}`](#get-transaction-by-account-and-sequence)
* [Get Account Payments - `GET /v2/accounts/{:address}/payments`](#get-account-payments)
* [Get Account Exchanges - `GET /v2/accounts/{:address}/exchanges`](#get-account-exchanges)
* [Get Account Balance Changes - `GET /v2/accounts/{:address}/balance_changes`](#get-account-balance-changes)
* [Get Account Reports - `GET /v2/accounts/{:address}/reports`](#get-account-reports)


## Get Ledger ##
[[Source]<br>](https://github.com/ripple/rippled-historical-database/blob/develop/api/routesV2/getLedger.js "Source")

Retrieve a specific Ledger by hash, index, date, or latest validated.

#### Request Format ####

<div class='multicode'>

*REST*

```
GET /v2/ledgers/{:identifier}
```

</div>

The following URL parameters are required by this API endpoint:

| Field | Value | Description |
|-------|-------|-------------|
| ledger_identifier | Ledger [Hash][], [Ledger Index][], or [Timestamp][] | (Optional) An identifier for the ledger to retrieve: either the full hash in hex, an integer sequence number, or a date-time. If a date-time is provided, retrieve the ledger that was most recently closed at that time. If omitted, retrieve the latest validated ledger. |

Optionally, you can also include the following query parameters:

| Field | Value | Description |
|-------|-------|-------------|
| transactions | Boolean | If `true`, include the identifying hashes of all transactions that are part of this ledger. |
| binary | Boolean | If `true`, include all transactions from this ledger as hex-formatted binary data. (If provided, overrides `transactions`.) |
| expand | Boolean | If `true`, include all transactions from this ledger as nested JSON objects. (If provided, overrides `binary` and `transactions`.) |

#### Response Format ####

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field  | Value | Description |
|--------|-------|-------------|
| result | `success` | Indicates that the body represents a successful response. |
| ledger | [Ledger object](#ledger-objects) | The requested ledger |

#### Example ####

Request:

```
GET /v2/ledgers/3170DA37CE2B7F045F889594CBC323D88686D2E90E8FFD2BBCD9BAD12E416DB5
```

Response:

```
200 OK
{
    "result": "success",
    "ledger": {
        "ledger_hash": "3170da37ce2b7f045f889594cbc323d88686d2e90e8ffd2bbcd9bad12e416db5",
        "ledger_index": 8317037,
        "parent_hash": "aff6e04f07f441abc6b4133f8c50c65935b817a85b895f06dba098b3fbc1be90",
        "total_coins": 99999980165594400,
        "close_time_res": 10,
        "accounts_hash": "8ad73e49a34d8b9c31bc13b8a97c56981e45ee70225ef4892e8b198fec5a1f7d",
        "transactions_hash": "33e0b9c5fd7766343e67854aed4222f5ed9c9507e0ec0d7ae7d54d0f17adb98e",
        "close_time": 1408047740,
        "close_time_human": "2014-08-14T20:22:20+00:00"
    }
}
```



## Get Transaction ##
[[Source]<br>](https://github.com/ripple/rippled-historical-database/blob/develop/api/routesV2/getTransactions.js "Source")

Retrieve a specific transaction by its identifying hash.

#### Request Format ####

<div class='multicode'>

*REST*

```
GET /v2/transactions/{:hash}
```

</div>

The following URL parameters are required by this API endpoint:

| Field | Value | Description |
|-------|-------|-------------|
| hash  | String - [Hash][] | The identifying hash of the transaction. |

Optionally, you can also include the following query parameters:

| Field | Value | Description |
|-------|-------|-------------|
| binary | Boolean | If `true`, return transaction data in binary format, as a hex string. Otherwise, return transaction data as nested JSON. Defaults to false. |

#### Response Format ####

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field  | Value | Description |
|--------|-------|-------------|
| result | `success` | Indicates that the body represents a successful response. |
| transaction | [Transaction object](#transaction-objects) | The requested transaction |

#### Example ####

Request:

```
GET /v2/transactions/03EDF724397D2DEE70E49D512AECD619E9EA536BE6CFD48ED167AE2596055C9A
```

Response (trimmed for size):

```js
200 OK
{
    "result": "success",
    "transaction": {
        "ledger_index": 8317037,
        "date": "2014-08-14T20:22:20+00:00",
        "hash": "03EDF724397D2DEE70E49D512AECD619E9EA536BE6CFD48ED167AE2596055C9A",
        "tx": {
            "TransactionType": "OfferCreate",
            "Flags": 131072,
            "Sequence": 159244,
            "TakerPays": {
                "value": "0.001567373",
                "currency": "BTC",
                "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
            },
            "TakerGets": "146348921",
            "Fee": "64",
            "SigningPubKey": "02279DDA900BC53575FC5DFA217113A5B21C1ACB2BB2AEFDD60EA478A074E9E264",
            "TxnSignature": "3045022100D81FFECC36A3DEF0922EB5D16F1AA5AA0804C30A18ED3B512093A75E87C81AD602206B221E22A4E3158785C109E7508624AD3DE5C0E06108D34FA709FCC9575C9441",
            "Account": "r2d2iZiCcJmNL6vhUGFjs8U8BuUq6BnmT"
        },
        "meta": {
            "TransactionIndex": 0,
            "AffectedNodes": [
                {
                    "ModifiedNode": {
                        "LedgerEntryType": "AccountRoot",
                        "PreviousTxnLgrSeq": 8317036,
                        "PreviousTxnID": "A56793D47925BED682BFF754806121E3C0281E63C24B62ADF7078EF86CC2AA53",
                        "LedgerIndex": "2880A9B4FB90A306B576C2D532BFE390AB3904642647DCF739492AA244EF46D1",
                        "PreviousFields": {
                            "Balance": "275716601760"
                        },
                        "FinalFields": {
                            "Flags": 0,
                            "Sequence": 326323,
                            "OwnerCount": 27,
                            "Balance": "275862935331",
                            "Account": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
                            "RegularKey": "rfYqosNivHQFJ6KpArouxoci3QE3huKNYe"
                        }
                    }
                },
                
                ...
            ],
            "TransactionResult": "tesSUCCESS"
        }
    }
}
```





## Get Transactions ##
[[Source]<br>](https://github.com/ripple/rippled-historical-database/blob/develop/api/routesV2/getTransactions.js "Source")

Retrieve transactions by time

#### Request Format ####

<div class='multicode'>

*REST*

```
GET /v2/transactions/
```

</div>

Optionally, you can include the following query parameters:

| Field      | Value | Description |
|------------|-------|-------------|
| start      | String | UTC start time of query range |
| end        | String | UTC end time of query range |
| descending | Boolean | reverse chronological order |
| type       | String | filter transactions for a specific transaction type |
| result     | String | filter transactions for a specific transaction result |
| binary     | Boolean | return transactions in binary form |
| limit      | Integer | max results per page (defaults to 20) |
| marker     | String | The pagination marker from a previous response |

#### Response Format ####
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field  | Value | Description |
|--------|-------|-------------|
| result | `success` | Indicates that the body represents a successful response. |
| count | Integer | Number of Transactions returned. |
| marker | String | Pagination marker |
| transactions | Array of [Transaction object](#transaction-objects) | The requested transactions |

#### Example ####

Request:

```
GET /v2/transactions/?result=tecPATH_DRY&limit=2&type=Payment
```

Response:

```
{
  "result": "success",
  "count": 2,
  "marker": "20130106022000|000000053869|00000",
  "transactions": [
    {
      "hash": "B8E4335A94438EC8209135A4E861A4C88F988C651B819DDAF2E8C55F9B41E589",
      "date": "2013-01-02T20:13:40+00:00",
      "ledger_index": 40752,
      "ledger_hash": "55A900C2BA9483DC83F8FC065DE7789570662365BDE98EB75C5F4CE4F9B43214",
      "tx": {
        "TransactionType": "Payment",
        "Flags": 0,
        "Sequence": 61,
        "Amount": {
          "value": "96",
          "currency": "USD",
          "issuer": "rJ6VE6L87yaVmdyxa9jZFXSAdEFSoTGPbE"
        },
        "Fee": "10",
        "SigningPubKey": "02082622E4DA1DC6EA6B38A48956D816881E000ACF0C5F5B52863B9F698799D474",
        "TxnSignature": "304402200A0746192EBC7BC3C1B9D657F42B6345A49D75FE23EF340CB6F0427254C139D00220446BF9169C94AEDC87F56D01DB011866E2A67E2AADDCC45C4D11422550D044CB",
        "Account": "rB5TihdPbKgMrkFqrqUC3yLdE8hhv4BdeY",
        "Destination": "rJ6VE6L87yaVmdyxa9jZFXSAdEFSoTGPbE"
      },
      "meta": {
        "TransactionIndex": 0,
        "AffectedNodes": [
          {
            "ModifiedNode": {
              "LedgerEntryType": "AccountRoot",
              "PreviousTxnLgrSeq": 40212,
              "PreviousTxnID": "F491DC8B5E51045D4420297293199039D5AE1EA0C6D62CAD9A973E3C89E40CD6",
              "LedgerIndex": "9B242A0D59328CE964FFFBFF7D3BBF8B024F9CB1A212923727B42F24ADC93930",
              "PreviousFields": {
                "Sequence": 61,
                "Balance": "8178999999999400"
              },
              "FinalFields": {
                "Flags": 0,
                "Sequence": 62,
                "OwnerCount": 6,
                "Balance": "8178999999999390",
                "Account": "rB5TihdPbKgMrkFqrqUC3yLdE8hhv4BdeY"
              }
            }
          }
        ],
        "TransactionResult": "tecPATH_DRY"
      }
    },
    {
      "hash": "1E1C14BF5E61682F3DC9D035D9908816497B8E8843E05C0EE98E06DFDDDAE920",
      "date": "2013-01-05T08:43:10+00:00",
      "ledger_index": 51819,
      "ledger_hash": "88ED10E4E31FC7580285CF173B264690B0E8688A3FC9F5F9C62F1A295B96269D",
      "tx": {
        "TransactionType": "Payment",
        "Flags": 0,
        "Sequence": 10,
        "Amount": {
          "value": "2",
          "currency": "EUR",
          "issuer": "rfitr7nL7MX85LLKJce7E3ATQjSiyUPDfj"
        },
        "Fee": "10",
        "SigningPubKey": "03FDDCD97668B686100E60653FD1E5210A8310616669AACB3A1FCC6D2C090CCB32",
        "TxnSignature": "304402204F9BB7E37C14A3A3762E2A7DADB9A28D1AFFB3797521229B6FB98BA666B5491B02204F69AAEAFAC8FA473E52042FF06035AB3618A54E0B76C9852766D55184E98598",
        "Account": "rhdAw3LiEfWWmSrbnZG3udsN7PoWKT56Qo",
        "Destination": "rfitr7nL7MX85LLKJce7E3ATQjSiyUPDfj"
      },
      "meta": {
        "TransactionIndex": 0,
        "AffectedNodes": [
          {
            "ModifiedNode": {
              "LedgerEntryType": "AccountRoot",
              "PreviousTxnLgrSeq": 51814,
              "PreviousTxnID": "5EC1C179996BD87E2EB11FE60A37ADD0FB2229ADC7D13B204FAB04FABED8A38D",
              "LedgerIndex": "AC1B67084F84839A3158A4E38618218BF9016047B1EE435AECD4B02226AB2105",
              "PreviousFields": {
                "Sequence": 10,
                "Balance": "10000999910"
              },
              "FinalFields": {
                "Flags": 0,
                "Sequence": 11,
                "OwnerCount": 2,
                "Balance": "10000999900",
                "Account": "rhdAw3LiEfWWmSrbnZG3udsN7PoWKT56Qo"
              }
            }
          }
        ],
        "TransactionResult": "tecPATH_DRY"
      }
    }
  ]
}
```




## Get Exchanges ##
[[Source]<br>](https://github.com/ripple/rippled-historical-database/blob/develop/api/routesV2/getExchanges.js "Source")

Retrieve Exchanges for a given currency pair over time.  Results can be returned as individual exchanges or aggregated to a specific list of intervals

#### Request Format ####

<div class='multicode'>

*REST*

```
GET /v2/exchanges/{:base}/{:counter}
```

</div>

This method requires the following URL parameters:

| Field | Value | Description |
|-------|-------|-------------|
| base  | String | base currency of the pair in the format currency[+issuer] (required) |
| counter | String | counter currency of the pair in the format currency[+issuer] (required) |

Optionally, you can also include the following query parameters:

| Field       | Value | Description |
|-------------|-------|-------------|
| start       | String | UTC start time of query range |
| end         | String | UTC end time of query range |
| interval    | String | Aggregation interval: `1minute`, `5minute`, `15minute`, `30minute`, `1hour`, `2hour`, `4hour`, `1day`, `3day`, `7day`, or `1month` |
| descending  | Boolean | reverse chronological order |
| reduce      | Boolean | aggregate all individual results |
| limit       | Integer | max results per page (defaults to 200) |
| marker      | String | pagination key from previously returned response |
| autobridged | Boolean | return only results from autobridged exchanges |
| format      | String | format of returned results: `csv`,`json` defaults to `json` |

#### Response Format ####
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field  | Value | Description |
|--------|-------|-------------|
| result | `success` | Indicates that the body represents a successful response. |
| count | Integer | Number of Transactions returned. |
| marker | String | Pagination marker |
| exchanges | Array of [Exchange Objects][] | The requested exchanges |

#### Example ####

Request:

```
GET /v2/exchanges/USD+rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q/XRP?descending=true&limit=3&result=tesSUCCESS&type=OfferCreate
```

Response:

```
{
  "result": "success",
  "count": 3,
  "marker": "USD|rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q|XRP||20150820230940|000015383279|00002|00000",
  "exchanges": [
    {
      "base_amount": 1.5868807911938,
      "counter_amount": 207.598995,
      "rate": 130.8220479774132,
      "buyer": "rsCC4p8HGz9R7yHiNjW3WPn9R6sKQv2jbT",
      "executed_time": "2015-08-20T23:09:50",
      "ledger_index": 15383280,
      "offer_sequence": 2269,
      "provider": "rsCC4p8HGz9R7yHiNjW3WPn9R6sKQv2jbT",
      "seller": "rLMJ4db4uwHcd6NHg6jvTaYb8sH5Gy4tg5",
      "taker": "rLMJ4db4uwHcd6NHg6jvTaYb8sH5Gy4tg5",
      "tx_hash": "881A3704CF3DA1212955F9768D5A7A817669F2003046B83C32E96422103A7B2F",
      "tx_type": "Payment"
    },
    {
      "base_amount": 22.5,
      "counter_amount": 2946.032801,
      "rate": 130.9347911555556,
      "buyer": "rJoom9YSbpxnYcQ47SZzdoDE46iPxtZUA7",
      "executed_time": "2015-08-20T23:09:50",
      "ledger_index": 15383280,
      "offer_sequence": 2760,
      "provider": "rJoom9YSbpxnYcQ47SZzdoDE46iPxtZUA7",
      "seller": "rLMJ4db4uwHcd6NHg6jvTaYb8sH5Gy4tg5",
      "taker": "rLMJ4db4uwHcd6NHg6jvTaYb8sH5Gy4tg5",
      "tx_hash": "881A3704CF3DA1212955F9768D5A7A817669F2003046B83C32E96422103A7B2F",
      "tx_type": "Payment"
    },
    {
      "base_amount": 90.6280759869664,
      "counter_amount": 11866.368204,
      "rate": 130.934791171968,
      "buyer": "rMToPrWnbtX8wAKacb8KvV7Uq7oXqVePtm",
      "executed_time": "2015-08-20T23:09:50",
      "ledger_index": 15383280,
      "offer_sequence": 2757,
      "provider": "rMToPrWnbtX8wAKacb8KvV7Uq7oXqVePtm",
      "seller": "rLMJ4db4uwHcd6NHg6jvTaYb8sH5Gy4tg5",
      "taker": "rLMJ4db4uwHcd6NHg6jvTaYb8sH5Gy4tg5",
      "tx_hash": "881A3704CF3DA1212955F9768D5A7A817669F2003046B83C32E96422103A7B2F",
      "tx_type": "Payment"
    }
  ]
}
```




## Get Daily Summary ##
[[Source]<br>](https://github.com/ripple/rippled-historical-database/blob/develop/api/routesV2/reports.js "Source")

Retrieve per account per day aggregated payment summaries

#### Request Format ####

<div class='multicode'>

*REST*

```
GET /v2/reports/{:date}
```

</div>

This method requires the following URL parameters:

| Field | Value  | Description |
|-------|--------|-------------|
| date  | String | (Optional) UTC query date. If omitted, use the current day. |

Optionally, you can also include the following query parameters:

| Field    | Value   | Description |
|----------|---------|-------------|
| accounts | Boolean | Include lists of counterparty accounts |
| payments | Boolean | Include lists of individual payments |
| format   | String  | Format of returned results: `csv` or `json`. Defaults to `json`. |

#### Response Format ####

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field  | Value | Description |
|--------|-------|-------------|
| result | `success` | Indicates that the body represents a successful response. |
| count | Integer | Number of reports returned. |
| reports | Array of [Reports Objects][] | The requested reports |

**WARNING:** This method tends to return a very large response with no linebreaks, which may cause your tools or application to perform badly.

#### Example ####

Request:

```
GET /v2/reports/2015-08-19T00:00:00Z?accounts=true&payments=true
```

Response (trimmed for size):

```
{
    "result": "success",
    "count": 1153,
    "reports": [
        {
            "account": "r2LXq2rZWSgQ1thhKiEytzi1smg6oEn8A",
            "date": "2015-08-19T00:00:00+00:00",
            "high_value_received": 7000,
            "high_value_sent": 3400,
            "payments": [
                {
                    "tx_hash": "A032EFBB219B1102BBD9BCCB91EDC6EAA8185509574FA476A2D3FE6BA79B04EF",
                    "amount": 1700,
                    "currency": "XRP",
                    "type": "received"
                },
                {
                    "tx_hash": "76041BD6546389B5EC2CDBAA543200CF7B8D300F34F908BA5CA8523B0CA158C8",
                    "amount": 1400,
                    "currency": "XRP",
                    "type": "sent"
                }.
                ...
            ],
            "payments_received": 155,
            "payments_sent": 49,
            "receiving_counterparties": [
                "rnn4sCdC5jTCRRkPxxSbrrphSVYKZ4R7M5",
                ...
                "rw4jwYbMwfj3h5PSQhR1dgK9VJtwEVxRhR"
            ],
            "sending_counterparties": [
                "rw4jwYbMwfj3h5PSQhR1dgK9VJtwEVxRhR",
                 ...
                "raGwbQHagX7DVDRgKXkthFLETnVVN57fYA"
            ],
            "total_value": 210940,
            "total_value_received": 100540,
            "total_value_sent": 110400
        },
        ...
    ]
}
```



## Get Stats ##
[[Source]<br>](https://github.com/ripple/rippled-historical-database/blob/develop/api/routesV2/stats.js "Source")

Retrieve statistics about transaction activity in the Ripple Consensus Ledger, divided into intervals of time.

#### Request Format ####

<div class='multicode'>

*REST*

```
GET /v2/stats
```

</div>


Optionally, you can also include the following query parameters:

| Field      | Value   | Description |
|------------|---------|-------------|
| family     | String  | If provided, filter results to a single family of stats: `type`, `result`, or `metric`. By default, provides all stats from all families. |
| metrics    | String  | Filter results to one or more metrics (in a comma-separated list). Requires the `family` of the metrics to be specified. By default, provides all metrics in the family. |
| start      | String - [Timestamp][]  | Start time of query range |
| end        | String - [Timestamp][]  | End time of query range |
| interval   | String  | Aggregation interval (`hour`,`day`,`week`, defaults to `day`) |
| limit      | Integer | Max results per page (defaults to 200) |
| marker     | String  | Pagination key from previously returned response |
| descending | Boolean | Reverse chronological order |
| format     | String  | Format of returned results: `csv`,`json` defaults to `json` |

##### Families and Metrics #####

The `family` and `metrics` query parameters provide a way to filter results to a specific subset of all metrics available for transactions in any given interval. Each metric is tied to a specific family, as follows:

| Family | Included Metrics | Meaning |
|--------|------------------|---------|
| type | All Ripple transaction types, including `Payment`, `AccountSet`, `SetRegularKey`, `OfferCreate`, `OfferCancel`, `TrustSet`. | Number of transactions of the given type that occurred during the interval. |
| result | All [transaction result codes](transactions.html#transaction-results) (string codes, not the numeric codes), including `tesSUCCESS`, `tecPATH_DRY`, and many others. | Number of transactions that resulted in the given code during the interval. |
| metric | Data-API defined Special Transaction Metrics. | (Varies) |

##### Special Transaction Metrics #####

The Data API derives the following values for every interval. These metrics are part of the `metric` family.

| Field  | Value | Description |
|--------|-------|-------------|
| accounts\_created | Number | The number of new accounts funded during this interval. |
| exchanges\_count | Number | The number of currency exchanges that occurred during this interval. |
| ledger\_count | Number | The number of ledgers closed during this interval. |
| ledger\_interval | Number | The average number of seconds between ledgers closing during this interval. |
| payments\_count | Number | The number of payments from one account to another during this interval. |
| tx\_per\_ledger | Number | The average number of transactions per ledger in this interval. |

If any of the metrics have a value of 0, they are omitted from the results.

#### Response Format ####
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field  | Value | Description |
|--------|-------|-------------|
| result | `success` | Indicates that the body represents a successful response. |
| count | Integer | Number of reports returned. |
| marker | String | Pagination marker |
| stats | Array of stats objects | The requested stats. Omits metrics with a value of 0, and intervals that have no nonzero metrics. |


## Get Accounts ##
[[Source]<br>](https://github.com/ripple/rippled-historical-database/blob/develop/api/routesV2/accounts.js "Source")

Retrieve information about the creation of new accounts in the Ripple Consensus Ledger.

#### Request Format ####

<div class='multicode'>

*REST*

```
GET /v2/accounts
```

</div>

Optionally, you can include the following query parameters:

| Field      | Value   | Description |
|------------|---------|-------------|
| start      | String - [Timestamp][]  | Start time of query range |
| end        | String - [Timestamp][]  | End time of query range |
| interval   | String  | Aggregation interval (`hour`,`day`,`week`). If omitted, return individual accounts. Not compatible with the `parent` parameter. |
| limit      | Integer | Max results per page (defaults to 200) |
| marker     | String  | Pagination key from previously returned response |
| descending | Boolean | Reverse chronological order |
| parent     | String  | Limit results to specified parent account. Not compatible with the `interval` parameter. |
| reduce     | Boolean | Return a count of results only |
| format     | String  | Format of returned results: `csv`,`json` defaults to `json` |

#### Response Format ####
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field  | Value | Description |
|--------|-------|-------------|
| result | `success` | Indicates that the body represents a successful response. |
| count  | Integer | Number of reports returned. |
| marker | String | Pagination marker |
| accounts | Array | If the request used the `interval` query parameter, each member of the array is an interval object. Otherwise, this field is an array of [account creation objects](#account-creation-objects). |

##### Interval Objects #####

If the request uses the `interval` query parameter, the response has an array of interval objects, each of which represents the number of accounts created during a single interval. Interval objects have the following fields:

| Field  | Value | Description |
|--------|-------|-------------|
| date   | String - [Timestamp] | The time at which this interval starts. (The length of the interval is determined by the request.) |
| count  | Number | How many accounts were created in this interval. |

#### Example ####

Request:

```

```

Response (trimmed for size):

```
{
  "result": "success",
  "count": 200,
  "marker": "20150824051620|000015449034|00005",
  "accounts": [
    {
      "balance": "30",
      "account": "rLev753oLTgKTpSzzauKezXzCSVkuY5BPY",
      "executed_time": "2015-08-31T21:42:30+00:00",
      "ledger_index": 15604454,
      "parent": "rigorv4X4W5V49QA3JfAwb4G2T9CpucaY",
      "tx_hash": "030014A941199CBEEBB4764EB6448886B4F7834F48BFEA86C1BC4DBF8F97B174"
    },
    {
      "balance": "41",
      "account": "rsXoSLUWboosXJF3WX4nZY7y1RYwArVjsi",
      "executed_time": "2015-08-31T16:10:50+00:00",
      "ledger_index": 15599799,
      "parent": "rU8eTXdMFB8tpQzxfdN47CW1eAdBa6ZZkv",
      "tx_hash": "6A8CA215716A7661006DD6342DD422F8D00BA49911489D90388DD68718A31AC3"
    },
    
    ...
    
  ]
}
```


## Get Account ##
[[Source]<br>](https://github.com/ripple/rippled-historical-database/blob/develop/api/routesV2/getaccount.js "Source")

Get creation info for a specific ripple account

#### Request Format ####


<div class='multicode'>

*REST*

```
GET /v2/accounts/{:address}
```

</div>


This method requires the following URL parameters:

| Field   | Value  | Description |
|---------|--------|-------------|
| address | String | Ripple address to query |

#### Response Format ####

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field  | Value | Description |
|--------|-------|-------------|
| result | `success` | Indicates that the body represents a successful response. |
| account | Object - [Account Creation](#account-creation-objects) | The requested account |

#### Example ####

Request:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn
```

Response:

```
{
    "result": "success",
    "account": {
        "address": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "parent": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "initial_balance": "100.0",
        "inception": "2014-05-29T17:05:20+00:00",
        "ledger_index": 6902264,
        "tx_hash": "074415C5DC6DB0029E815EA6FC2629FBC29A2C9D479F5D040AFF94ED58ECC820"
    }
}
```



## Get Account Balances ##
[[Source]<br>](https://github.com/ripple/rippled-historical-database/blob/develop/api/routesV2/accountBalances.js "Source")

Get balances for a specific ripple account

<div class='multicode'>

*REST*

```
GET /v2/accounts/{:address}/balances
```

</div>

This method requires the following URL parameters:

| Field    | Value  | Description |
|----------|--------|-------------|
| address | String | Ripple address to query |

Optionally, you can also include the following query parameters:

| Field        | Value   | Description |
|--------------|---------|-------------|
| ledger_index | Integer | Index of ledger for historical balances |
| ledger_hash  | String  | Ledger hash for historical balances |
| date         | String  | UTC date for historical balances. (**Note:** Historical balances may not be available for all dates. See [RD-671](https://ripplelabs.atlassian.net/browse/RD-671) for details.) |
| currency     | String  | Restrict results to specified currency |
| issuer       | String  | Restrict results to specified counterparty/issuer |
| limit        | Integer | Max results per page (defaults to 200) |
| marker       | String  | Pagination key from previously returned response |
| format       | String  | Format of returned results: `csv`,`json` defaults to `json` |

#### Response Format ####
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field  | Value | Description |
|--------|-------|-------------|
| result | `success` | Indicates that the body represents a successful response. |
| ledger_index | Integer | ledger index for balances query |
| close_time | String | close time of the ledger |
| limit | String | number of results returned, if limit was exceeded |
| marker | String | Pagination marker |
| balances | Array of [balance objects][] | The requested balances |

#### Example ####

Request:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/balances?date=2015-08-01T00:00:00Z
```

Response:

```
{
    "result": "success",
    "ledger_index": 14979795,
    "close_time": "2015-08-01T00:00:00",
    "validated": true,
    "balances": [
        {
            "value": "148.446663",
            "currency": "XRP",
            "counterparty": ""
        },
        {
            "value": "-11.0301",
            "currency": "USD",
            "counterparty": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
        },
        {
            "value": "0.0001",
            "currency": "USD",
            "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
        },
        {
            "value": "0",
            "currency": "USD",
            "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        {
            "value": "10",
            "currency": "USD",
            "counterparty": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"
        },
        {
            "value": "0",
            "currency": "USD",
            "counterparty": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v"
        }
    ]
}
```




## Get Account Transaction History ##
[[Source]<br>](https://github.com/ripple/rippled-historical-database/blob/develop/api/routesV2/accountTransactions.js "Source")

Retrieve a history of transactions that affected a specific account. This includes all transactions the account sent, payments the account received, and payments that rippled through the account.

#### Request Format ####

<div class='multicode'>

*REST*

```
GET /v2/accounts/{:address}/transactions
```

</div>

This method requires the following URL parameters:

| Field    | Value  | Description |
|----------|--------|-------------|
| :address | String | Ripple address to query |


Optionally, you can also include the following query parameters:

| Field        | Value   | Description |
|--------------|---------|-------------|
| start        | String  | UTC start time of query range |
| end          | String  | UTC end time of query range |
| min_sequence | String  | Minimum sequence number to query |
| max_sequence | String  | Max sequence number to query |
| type         | String  | Restrict results to a specified transaction type |
| result       | String  | Restrict results to specified transaction result |
| binary       | Boolean | Return results in binary format |
| descending   | Boolean | Reverse chronological order |
| limit        | Integer | Max results per page (defaults to 20) |
| marker       | String  | Pagination key from previously returned response |
| format       | String  | Format of returned results: `csv`,`json` defaults to `json` |


#### Response Format ####

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field  | Value | Description |
|--------|-------|-------------|
| result | `success` | Indicates that the body represents a successful response. |
| count  | Integer | The number of objects contained in the `transactions` field. |
| marker | String | Pagination marker |
| transactions | Array of [transaction objects](#transaction-objects) | All transactions matching the request. |

#### Example ####

Request:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/transactions?type=Payment&result=tesSUCCESS&limit=1
```

Response:

```
{
  "result": "success",
  "count": 1,
  "marker": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn|20140602224750|000006979192|00001",
  "transactions": [
    {
      "hash": "074415C5DC6DB0029E815EA6FC2629FBC29A2C9D479F5D040AFF94ED58ECC820",
      "date": "2014-05-29T17:05:20+00:00",
      "ledger_index": 6902264,
      "tx": {
        "TransactionType": "Payment",
        "Flags": 0,
        "Sequence": 1,
        "LastLedgerSequence": 6902266,
        "Amount": "100000000",
        "Fee": "12",
        "SigningPubKey": "032ECFCC409F02057D8556988B89E17D48ECFC8373965036C6BA294AA2B7972971",
        "TxnSignature": "30450221008D8E251DA5EA17A29CC9192717860F3B4047E74DF005127A65D9140CAE870C0902201C8E4548D2D3BA11B3E13CE8A167EBC076920E2B1C38547275CAA75FEC436EB9",
        "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
      },
      "meta": {
        "TransactionIndex": 1,
        "AffectedNodes": [
          {
            "CreatedNode": {
              "LedgerEntryType": "AccountRoot",
              "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
              "NewFields": {
                "Sequence": 1,
                "Balance": "100000000",
                "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
              }
            }
          },
          {
            "ModifiedNode": {
              "LedgerEntryType": "AccountRoot",
              "PreviousTxnLgrSeq": 6486567,
              "PreviousTxnID": "FF9BFF3C200B475CA7EE54F9A98EAB7E92BBDBD2DBE95AC854405D8A85C9D535",
              "LedgerIndex": "43EA78783A089B137D5E87610DF3BD4129F989EDD02EFAF6C265924D3A0EF8CE",
              "PreviousFields": {
                "Sequence": 1,
                "Balance": "1000000000"
              },
              "FinalFields": {
                "Flags": 0,
                "Sequence": 2,
                "OwnerCount": 0,
                "Balance": "899999988",
                "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
              }
            }
          }
        ],
        "TransactionResult": "tesSUCCESS"
      }
    }
  ]
}
```




## Get Transaction By Account And Sequence ##
[[Source]<br>](https://github.com/ripple/rippled-historical-database/blob/develop/api/routesV2/accountTxSeq.js "Source")

Retrieve a specifc transaction originating from a specified account

#### Request Format ####

<div class='multicode'>

*REST*

```
GET /v2/accounts/{:address}/transactions/{:sequence}
```

</div>

This method requires the following URL parameters:

| Field     | Value   | Description |
|-----------|---------|-------------|
| :address  | String  | Ripple address to query |
| :sequence | Integer | Transaction sequence |


Optionally, you can also include the following query parameters:

| Field  | Value   | Description |
|--------|---------|-------------|
| binary | Boolean | Return transaction in binary format |


#### Response Format ####

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field  | Value | Description |
|--------|-------|-------------|
| result | `success` | Indicates that the body represents a successful response. |
| transaction | [transaction object](#transaction-objects) | requested transaction |

#### Example ####

Request:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/transactions/10?binary=true
```

Response:

```
{
  "result": "success",
  "transaction": {
    "hash": "4BFFBB86C12659B6C5BB88F0EB859356DE3433EBACBFD9F50F6E70B2C05CCFE0",
    "date": "2014-09-15T19:59:10+00:00",
    "ledger_index": 8889812,
    "tx": "1200052200000000240000000A68400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100AA4AF08726FCF0F28AA4A841C45F975C3BF1545648F6907DCB33F6E3DD7E85D6022037365B80AB1972BF8A4280009A0DBCF16A1D562ED0489B155750E48CC939039981144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
    "meta": "201C00000003F8E5110061250087A5C555CBCA96F4C42E0EBC0E75C5AD84B3403FEDF824A7DAFA45ADCA6ECB66AA143C1B5613F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8E6240000000A62400000000DB5852F8814D3484B9ED2556DCE16A3B928B438BA6EE0FF0989E1E72200010000240000000B2D0000000062400000000DB5852572110000000000000000000000070000000300770A6D64756F31332E636F6D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9E1E1F1031000"
  }
}
```



## Get Account Payments ##
[[Source]<br>](https://github.com/ripple/rippled-historical-database/blob/develop/api/routesV2/accountPayments.js "Source")

Retrieve a payments for a specified account

#### Request Format ####

<div class='multicode'>

*REST*

```
GET /v2/accounts/{:address}/payments
```

</div>

This method requires the following URL parameters:

| Field    | Value  | Description |
|----------|--------|-------------|
| :address | String | Ripple address to query |


Optionally, you can also include the following query parameters:

| Field      | Value   | Description |
|------------|---------|-------------|
| start      | String - [Timestamp][]  | Start time of query range |
| end        | String - [Timestamp][]  | End time of query range |
| type       | String  | Type of payment - `sent` or `received` |
| currency   | String  | Restrict results to specified currency |
| issuer     | String  | Restrict results to specified issuer |
| descending | Boolean | Reverse chronological order |
| limit      | Integer | Max results per page (defaults to 20) |
| marker     | String  | Pagination key from previously returned response |
| format     | String  | Format of returned results: `csv`,`json` defaults to `json` |


#### Response Format ####

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field  | Value | Description |
|--------|-------|-------------|
| result | `success` | Indicates that the body represents a successful response. |
| count  | Integer | The number of objects contained in the `payments` field. |
| marker | String | Pagination marker |
| payments | Array of [payment objects][] | All payments matching the request. |

#### Example ####

Request:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/payments?currency=USD&limit=1
```

Response:

```
{
  "result": "success",
  "count": 1,
  "marker": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn|20140604191650|000007013674|00000",
  "payments": [
    {
      "amount": "1.0",
      "delivered_amount": "1.0",
      "destination_balance_changes": [
        {
          "counterparty": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
          "currency": "USD",
          "value": "1"
        }
      ],
      "fee": "1.0E-5",
      "source_balance_changes": [
        {
          "counterparty": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
          "currency": "USD",
          "value": "-1"
        }
      ],
      "currency": "USD",
      "destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "executed_time": "2014-06-02T22:47:50",
      "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "ledger_index": 6979192,
      "source": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "source_currency": "USD",
      "tx_hash": "7BF105CFE4EFE78ADB63FE4E03A851440551FE189FD4B51CAAD9279C9F534F0E"
    }
  ]
}
```




## Get Account Exchanges ##
[[Source]<br>](https://github.com/ripple/rippled-historical-database/blob/develop/api/routesV2/accountExchanges.js "Source")

Retrieve Exchanges for a given account over time.

#### Request Format ####

There are two variations on this method:

<div class='multicode'>

*REST - All Exchanges*

```
GET /v2/accounts/{:address}/exchanges/
```

*REST - Specific Currency Pair*

```
GET /v2/accounts/{:address}/exchanges/{:base}/{:counter}
```

</div>

This method requires the following URL parameters:

| Field    | Value  | Description |
|----------|--------|-------------|
| :address | String | Ripple address to query |
| :base    | String | Base currency of the pair in the format currency[+issuer] |
| :counter | String | Counter currency of the pair in the format currency[+issuer] |


Optionally, you can also include the following query parameters:

| Field      | Value   | Description |
|------------|---------|-------------|
| start      | String - [Timestamp][]  | Start time of query range |
| end        | String - [Timestamp][]  | End time of query range |
| descending | Boolean | Reverse chronological order |
| limit      | Integer | Max results per page (defaults to 200) |
| marker     | String  | Pagination key from previously returned response |
| format     | String  | Format of returned results: `csv`,`json` defaults to `json` |


#### Response Format ####
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field  | Value | Description |
|--------|-------|-------------|
| result | `success` | Indicates that the body represents a successful response. |
| count | Integer | Number of exchanges returned. |
| marker | String | Pagination marker |
| exchanges | Array of [Exchange Objects][] | The requested exchanges |

#### Example ####

Request:

```
GET /v2/accounts/rsyDrDi9Emy6vPU78qdxovmNpmj5Qh4NKw/exchanges/KRW+rUkMKjQitpgAM5WTGk79xpjT38DEJY283d/XRP?start=2015-08-08T00:00:00Z&end=2015-08-31T00:00:00Z&limit=2

```

Response:

```
{
    "result": "success",
    "count": 2,
    "marker": "rsyDrDi9Emy6vPU78qdxovmNpmj5Qh4NKw|20150810014200|000015162386|00013|00003",
    "exchanges": [
        {
            "base_amount": 209.3501241148,
            "counter_amount": 20.424402,
            "rate": 0.097560973925,
            "autobridged_currency": "USD",
            "autobridged_issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "base_currency": "KRW",
            "base_issuer": "rUkMKjQitpgAM5WTGk79xpjT38DEJY283d",
            "buyer": "rnAqwsu2BEbCjacoZmsXrpViqd3miZhHbT",
            "counter_currency": "XRP",
            "executed_time": "2015-08-08T02:57:40",
            "ledger_index": 15122851,
            "offer_sequence": "1738",
            "provider": "rsyDrDi9Emy6vPU78qdxovmNpmj5Qh4NKw",
            "seller": "rsyDrDi9Emy6vPU78qdxovmNpmj5Qh4NKw",
            "taker": "rnAqwsu2BEbCjacoZmsXrpViqd3miZhHbT",
            "tx_hash": "506D109A609A5E0778276CCBB125A4AA7B78428059F069A2CB4F739B861C0C49",
            "tx_type": "OfferCreate"
        },
        {
            "base_amount": 86355.6498758851,
            "counter_amount": 8424.941452,
            "rate": 0.097560975618,
            "base_currency": "KRW",
            "base_issuer": "rUkMKjQitpgAM5WTGk79xpjT38DEJY283d",
            "buyer": "r9xQi5YT8jqVM3wZhbiV94ZKKvGHaVeSDj",
            "client": "rt1.1-26-gbeb68ab",
            "counter_currency": "XRP",
            "executed_time": "2015-08-08T07:15:00",
            "ledger_index": 15126536,
            "offer_sequence": "1738",
            "provider": "rsyDrDi9Emy6vPU78qdxovmNpmj5Qh4NKw",
            "seller": "rsyDrDi9Emy6vPU78qdxovmNpmj5Qh4NKw",
            "taker": "r9xQi5YT8jqVM3wZhbiV94ZKKvGHaVeSDj",
            "tx_hash": "C897A595DED16ADF5AD52E6FD9CE5DE65C78A93CCAA62A85248DC3015A78F5C4",
            "tx_type": "Payment"
        }
    ]
}
```




## Get Account Balance Changes ##
[[Source]<br>](https://github.com/ripple/rippled-historical-database/blob/develop/api/routesV2/accountBalanceChanges.js "Source")

Retrieve Balance changes for a given account over time.

#### Request Format ####

<div class='multicode'>

*REST*

```
GET /v2/accounts/{:address}/balance_changes/
```

</div>

This method requires the following URL parameters:

| Field    | Value  | Description |
|----------|--------|-------------|
| :address | String | Ripple address to query |


Optionally, you can also include the following query parameters:

| Field      | Value   | Description |
|------------|---------|-------------|
| currency   | String  | Restrict results to specified currency |
| issuer     | String  | Restrict results to specified counterparty/issuer |
| start      | String - [Timestamp][]  | Start time of query range |
| end        | String - [Timestamp][]  | End time of query range |
| descending | Boolean | Reverse chronological order |
| limit      | Integer | Max results per page (defaults to 200) |
| marker     | String  | Pagination key from previously returned response |
| format     | String  | Format of returned results: `csv`,`json` defaults to `json` |


#### Response Format ####
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field  | Value | Description |
|--------|-------|-------------|
| result | `success` | Indicates that the body represents a successful response. |
| count | Integer | Number of balance changes returned. |
| marker | String | Pagination marker |
| exchanges | Array of [balance change descriptors][] | The requested balance changes |

#### Example ####

Request:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/balance_changes?descending=true&limit=3
```

Response:

```
{
  "result": "success",
  "count": 3,
  "marker": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn|20150616212230|000014091020|00003|$",
  "balance_changes": [
    {
      "change": "-0.012",
      "final_balance": "148.446663",
      "tx_index": 1,
      "change_type": "network fee",
      "currency": "XRP",
      "executed_time": "2015-06-16T21:32:40",
      "ledger_index": 14091160,
      "tx_hash": "0D5FB50FA65C9FE1538FD7E398FFFE9D1908DFA4576D8D7A020040686F93C77D",
      "node_index": null
    },
    {
      "change": "-0.012",
      "final_balance": "148.458663",
      "tx_index": 20,
      "change_type": "network fee",
      "currency": "XRP",
      "executed_time": "2015-06-16T21:22:40",
      "ledger_index": 14091022,
      "tx_hash": "26C1C876D709380DF7136F307B84E7F16CD74381F82E9B2D352A92069C880D66",
      "node_index": null
    },
    {
      "change": "-30.0",
      "final_balance": "148.470663",
      "node_index": 0,
      "tx_index": 3,
      "change_type": "payment_source",
      "currency": "XRP",
      "executed_time": "2015-06-16T21:22:30",
      "ledger_index": 14091020,
      "tx_hash": "73699F26E2A4A8703EB48684FF38CD6362B7ABF217576AB460CBAA64D383D9EC"
    }
  ]
}
```




## Get Account Reports ##
[[Source]<br>](https://github.com/ripple/rippled-historical-database/blob/develop/api/routesV2/accountReports.js "Source")

Retrieve daily summaries of payment activity for an account.

<div class='multicode'>

*REST*

```
GET /v2/accounts/{:address}/reports/
GET /v2/accounts/{:address}/reports/{:date}
```

</div>

This method requires the following URL parameters:

| Field    | Value  | Description |
|----------|--------|-------------|
| :address | String | Ripple address to query |
| :date    | String | (Optional) UTC date for single report. If omitted, use the `start` and `end` query parameters. |


Optionally, you can also include the following query parameters:

| Field      | Value   | Description |
|------------|---------|-------------|
| start      | String  | UTC start time of query range. Defaults to start of current date. |
| end        | String  | UTC end time of query range. Defaults to current date. |
| accounts   | Boolean | If true, provide lists with addresses of all `sending_counterparties` and `receiving_counterparties` in results. Otherwise, return only the number of sending and receiving counterparties. |
| payments   | Boolean | Include [Payment Summary Objects][] in the `payments` field for each interval, with the payments that occurred during that interval. |
| descending | Boolean | If true, sort results with most recent first. By default, sort results with oldest first. |
| format     | String  | Format of returned results: `csv`,`json` defaults to `json` |


#### Response Format ####
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field  | Value | Description |
|--------|-------|-------------|
| result | `success` | Indicates that the body represents a successful response. |
| count | Integer | Number of reports returned. |
| reports | Array of [Reports Objects][] | Daily summaries of account activity for the given account and date range. |

#### Example ####

Request:

```
GET /v2/accounts/rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q/reports?start=2015-08-28T00:00:00&end=2015-08-28T00:00:00&accounts=true&payments=true&descending=true
```

Response:

```
{
  "result": "success",
  "count": 1,
  "reports": [
    {
      "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
      "date": "2015-08-28T00:00:00+00:00",
      "high_value_received": 89500.74142547617,
      "high_value_sent": 0,
      "payments": [
        {
          "tx_hash": "F2323EE7494384E77ABB18F31981FEE8C31767BBD27515B55FC3BD6792C4E408",
          "amount": 2.7,
          "currency": "BTC",
          "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
          "type": "received"
        },
        {
          "tx_hash": "FEAD462738EE430E154FF3122D3EE2DD27DDD8BEFBA080A60FE91B78E8865365",
          "amount": 3,
          "currency": "BTC",
          "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
          "type": "received"
        },
        {
          "tx_hash": "383B1D1EABB646AB2EFBBF9E8967FE279BFE5EF86A3B6BCD5BDA287210053116",
          "amount": 0.14,
          "currency": "BTC",
          "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
          "type": "received"
        }
      ],
      "payments_received": 3,
      "payments_sent": 0,
      "receiving_counterparties": [],
      "sending_counterparties": [
        "rhi4zZdCeFdfTokzek8D7p9bUWmtEFCZAe",
        "rP1hkW1LCiVos6FpzU7itmm9Tk29yqvyk5"
      ],
      "total_value": 174019.58324753598,
      "total_value_received": 174019.58324753598,
      "total_value_sent": 0
    }
  ]
}
```


# API Objects #

## Basic Types ##

As a REST API, the Data API v2 uses [JSON](http://json.org/)'s native datatypes to represent API fields, with some special cases.

### Numbers and Precision ###
[String - Number]: #numbers-and-precision

Currency amounts in Ripple require more precision than most native number types, so the Data API v2 uses the String type to represent some values.

Within the String value, the numbers are serialized in the same way as native JSON numbers:

* Base-10.
* Non-zero-prefaced.
* May contain `.` as a decimal point. For example, ½ is represented as `0.5`. (American style, not European)
* May contain `E` or `e` to indicate being raised to a power of 10. For example, `1.2E5` is equivalent to `120000`.
* No comma (`,`) characters are used.

The precision for amounts of **non-XRP currency** in Ripple is as follows:

* Minimum nonzero absolute value: `1000000000000000e-96`
* Maximum value: `9999999999999999e80`
* Minimum value: `-9999999999999999e80`
* 15 decimal digits of precision

**XRP** has a different internal representation, and consequently its precision is different:

* Minimum value: `0`
* Maximum value: `100000000000` (`1e11`)
* Precise to the nearest `0.000001` (`1e-6`)

In other words, XRP has the same precision as a 64-bit unsigned integer where each unit is equivalent to 0.000001 XRP.

### Addresses ###
[Address]: #addresses

Ripple Accounts are identified by a base-58 Ripple Address, which is derived from the account's master public key. An address is represented as a String in JSON, with the following characteristics:

* Between 25 and 35 characters in length
* Starts with the character `r`
* Case-sensitive
* Base-58 encoded using only the following characters: `rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz` That's alphanumeric characters, excluding zero (`0`), capital O (`O`), capital I (`I`), and lowercase L (`l`).
* Contains error-checking that makes it unlikely that a randomly-generated string is a valid address.

### Hashes ###
[Hash]: #hashes

Many objects in Ripple, particularly transactions and ledgers, are uniquely identified by a 64-bit hash value. This value is typically calculated as a "SHA-512Half", which calculates a SHA-512 hash from some contents, then takes the first 64 characters of the hexadecimal representation. Since the hash of an object is derived from the contents in a way that is extremely unlikely to produce collisions, two objects with the same hash can be considered identical.

A Ripple hash value has the following characteristics:

* Exactly 64 characters in length
* [Hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) character set: 0-9 and A-F.
* Typically written in upper case.

**Note:** SHA-512Half has similar security to the officially-defined _SHA-512/256_ hash function. However, Ripple's usage predates SHA-512/256 and is also easier to implement on top of an existing SHA-512 function (since support for SHA-512/256 is not common in cryptographic libraries as of this writing).


### Timestamps ###
[Timestamp]: #timestamps

All dates and times are written in ISO 8601 Timestamp Format, using UTC. This format is summarized as:

`YYYY-MM-DDThh:mmZ`

* Four-digit year
* Two-digit month
* Two-digit day
* The letter `T` indicating the beginning of the time portion
* Two-digit hour using a 24-hour clock
* Two digit minute
* The letter `Z` indicating zero offset from UTC. Alternatively, `+00:00` may appear instead, with the same meaning.

### Ledger Index ###
[Ledger Index]: #ledger-index

A ledger index is a 32-bit unsigned integer used to identify a ledger. The ledger index is also known as the ledger's sequence number. The very first ledger was ledger index 1, and each subsequent ledger has a ledger index 1 higher than that of the ledger immediately before it.

Two ledgers with the same ledger index are guaranteed to have identical contents _if they are validated by consensus_. Ledgers that are not validated by consensus may have different contents even with the same ledger index. (The [Hash][] values of two ledgers can tell you whether those ledgers have the exact same contents.)

### Account Sequence ###
[Sequence Number]: #account-sequence

A Sequence number is a 32-bit unsigned integer used to identify a transaction or Offer relative to a specific account.

Every [account object in the Ripple Consensus Ledger](ripple-ledger.html#accountroot) has a Sequence number, which starts at 1. For a transaction to be relayed to the network and possibly included in a validated ledger, it must have a `Sequence` field that matches the sending account's current `Sequence` number. An account's Sequence field is incremented whenever a transaction from that account is included in a validated ledger (regardless of whether the transaction succeeded or failed). This preserves the order of transactions submitted by an account, and differentiates transactions that would otherwise be identical.

Every [Offer node in the Ripple Consensus Ledger](ripple-ledger.html#offer) is marked with the sending `Account` [Address][] and the `Sequence` value of the [OfferCreate transaction](transactions.html#offercreate) that created it. These two fields, together, uniquely identify the Offer.

### Currency Code ###
[Currency Code]: #currency-code

Currencies in Ripple can be represented in two ways:

* As three-letter [ISO 4217 Currency Codes](http://www.xe.com/iso4217.php). These currency codes must be written in uppercase ("USD" is valid, "usd" is not). Ripple permits currency codes that are not officially approved, including currency codes with digits in them.
* As 160-bit hexadecimal values, such as `0158415500000000C1F76FF6ECB0BAC600000000`, according to Ripple's internal [Currency Format](https://wiki.ripple.com/Currency_format). This representation is uncommon.

## Transaction Objects ##

Transactions have two formats - a compact "binary" format where the defining fields of the transaction are encoded as strings of hex, and an expanded format where the defining fields of the transaction are nested as complete JSON objects.

### Full JSON Format ###

| Field | Value | Description |
|-------|-------|-------------|
| hash  | String - [Hash][] | An identifying hash value unique to this transaction, as a hex string. |
| date  | String - [Timestamp][] | The time when this transaction was included in a validated ledger. |
| ledger_index | Number - [Ledger Index][] | The sequence number of the ledger that included this ledger. |
| tx    | Object | The fields of this transaction object, as defined by the [Transaction Format](https://ripple.com/build/transactions) |
| meta  | Object | Metadata about the results of this transaction. |

### Binary Format ###

| Field | Value | Description |
|-------|-------|-------------|
| hash  | String - [Hash][] | An identifying hash value unique to this transaction, as a hex string. |
| date  | String - [Timestamp][] | The time when this transaction was included in a validated ledger. |
| ledger_index | Number - [Ledger Index][] | The sequence number of the ledger that included this ledger. |
| tx    | String | The binary data that represents this transaction, as a hexadecimal string. |
| meta  | String | The binary data that represents this transaction's metadata, as a hex string. |

## Ledger Objects ##

A "ledger" is one version of the shared global ledger. Each ledger object has the following fields:

| Field        | Value | Description |
|--------------|-------|-------------|
| ledger\_hash  | String - [Hash][] | An identifying hash unique to this ledger, as a hex string. |
| ledger\_index | Number - [Ledger Index][] | The sequence number of the ledger. Each new ledger has a ledger index 1 higher than the ledger that came before it. |
| parent\_hash  | String - [Hash][] | The identifying hash of the previous ledger. |
| total\_coins  | [String - Number][] | The total number of "drops" of XRP still in existence at the time of the ledger. (Each XRP is 1,000,000 drops.) |
| close\_time\_res | Number | The ledger close time is rounded to approximately this many seconds. |
| accounts\_hash | String - [Hash][] | Hash of the account information contained in this ledger, as hex. |
| transactions\_hash | String - [Hash][] | Hash of the transaction information contained in this ledger, as hex. |
| close\_time | Number | The time at which this ledger was closed, in UNIX time. |
| close\_time\_human | String - [Timestamp][] | The time at which this ledger was closed. |

**Note:** Ledger close times are approximate, typically rounded to about 10 seconds. Consequently, two subsequent ledgers could have the same close time recorded, when actual close times were several seconds apart. The sequence number (`ledger_index`) of the ledger makes it unambiguous which ledger closed first.

### Genesis Ledger ###

Due to a mishap early in Ripple's history, ledgers 1 through 32569 were lost. Thus, ledger #32570 is the earliest ledger available anywhere. For purposes of the Data API v2, ledger #32570 is considered the _genesis ledger_.

## Account Creation Objects ##

An account creation object represents the action of creating an account in the Ripple Consensus Ledger. There are two variations, depending on whether the account was already present in ledger 32570, the earliest ledger available. Accounts that were already present in ledger 32570 are termed _genesis accounts_.

| Field | Value | Description |
|-------|-------|-------------|
| address | String - [Address][] | The identifying address of this account, in base-58. |
| inception | String - [Timestamp][] | The UTC timestamp that the account was created. For genesis accounts, this is the timestamp of ledger 32570. |
| ledger\_index | Number - [Ledger Index][] | The sequence number of the ledger when the account was created, or 32570 for genesis accounts. |
| parent | String - [Address][] | (Omitted for genesis accounts) The identifying address of the account that provided the initial funding for this account. |
| tx\_hash | String - [Hash][] | (Omitted for genesis accounts) The identifying hash of the transaction that funded this account. |
| initial\_balance | [String - Number][] | (Omitted for genesis accounts) The amount of XRP that funded this account. |
| genesis\_balance | [String - Number][] | (Genesis accounts only) The amount of XRP this account held as of ledger #32570. |
| genesis\_index | Number - [Sequence Number][] | (Genesis accounts only) The transaction sequence number of the account as of ledger #32570. |


## Exchange Objects ##
[Exchange Objects]: #exchange-objects

An exchange object represents an actual exchange of currency, which can occur in the Ripple Consensus Ledger as the result of executing either an OfferCreate transaction or a Payment transaction. In order for currency to actually change hands, there must be a previously-unfilled Offer previously placed in the ledger with an OfferCreate transaction.

A single transaction can cause several exchanges to occur. In this case, the sender of the transaction is the taker for all the exchanges, but each exchange will have a different provider, currency pair, or both.

| Field | Value | Description |
|-------|-------|-------------|
| base\_amount | Number | The amount of the base currency that was traded |
| counter\_amount | Number | The amount of the counter currency that was traded |
| rate | Number | The amount of the counter currency acquired per 1 unit of the base currency |
| autobridged\_currency | String - [Currency Code][] | (May be omitted) If the offer was autobridged (XRP order books were used to bridge two non-XRP currencies), this is the other currency from the offer that executed this exchange. |
| autobridged\_issuer | String - [Address][] | (May be omitted) If the offer was autobridged (XRP order books were used to bridge two non-XRP currencies), this is the other currency from the offer that executed this exchange. |
| base\_currency | String - [Currency Code][] | (May be omitted) The base currency |
| base\_issuer | String - [Address][] | (May be omitted) The account that issued the base currency |
| buyer | String - [Address][] | The account that acquired the base currency |
| client | String | (May be omitted) If the transaction contains a memo indicating what client application sent it, this is the contents of the memo. |
| counter\_currency | String - [Currency Code][] | (May be omitted) The counter currency |
| counter\_issuer | String - [Address][] | (May be omitted) The account that issued the counter currency |
| executed\_time | String - [Timestamp][] | The time the exchange occurred |
| ledger\_index | Number - [Ledger Index][] | The sequence number of the ledger that included this transaction |
| offer\_sequence | Number - [Sequence Number][] | The sequence number of the `provider`'s existing offer in the ledger. |
| provider | String - [Address][] | The account that had an existing Offer in the ledger |
| seller | String - [Address][] | The account that acquired the counter currency |
| taker | String - [Address][] | The account that sent the transaction which executed this exchange |
| tx\_hash | String - [Hash][] | The identifying hash of the transaction that executed this exchange. (**Note:** This exchange may be one of several executed in a single transaction.) |
| tx\_type | String | The type of transaction that executed this exchange, either `Payment` or `OfferCreate`. |


## Reports Objects ##
[Reports Objects]: #reports-objects

Reports objects show the activity of a given account over a specific interval of time, typically a day. Reports have the following fields:

| Field | Value | Description |
|-------|-------|-------------|
| account | String - [Address][] | The address of the account to which this report pertains. |
| date | String - [Timestamp][] | The start of the interval to which this report pertains. |
| high\_value\_received | Number | Largest amount received in a single transaction, normalized to XRP (as closely as possible). This includes payments and exchanges. |
| high\_value\_sent | Number | The largest amount sent in a single transaction, normalized to XRP (as closely as possible). |
| payments | Array of [Payment Summary Objects][] | (May be omitted) Array with information on each payment sent or received by the account during this interval. |
| payments\_received | Number | The number of payments sent to this account. (This only includes payments for which this account was the destination, not payments that only rippled through the account or consumed the account's offers.) |
| payments\_sent | Number | The number of payments sent by this account. |
| receiving\_counterparties | Array or Number | If account lists requested, an array of addresses that received payments from this account. Otherwise, the number of different accounts that received payments from this account. |
| sending\_counterparties | Array or Number |  If account lists requested, an array of addresses that sent payments to this account. Otherwise, the number of different accounts that sent payments to this account. |
| total\_value | Number | Sum of total value received and sent in payments, normalized to XRP (as closely as possible). |
| total\_value\_received | Number | Sum value of all payments to this account, normalized to XRP (as closely as possible). |
| total\_value\_sent | Number | Sum value of all payments from this account, normalized to XRP (as closely as possible).

## Payment Summary Objects ##
[Payment Summary Objects]: #payment-summary-objects

A Payment Summary Object contains a reduced amount of information about a single payment from the perspective of either the sender or receiver of that payment. 

| Field | Value | Description |
|-------|-------|-------------|
| tx\_hash | String - [Hash][] | The identifying hash of the transaction that caused the payment. |
| delivered\_amount | [String - Number][] | The amount of the destination `currency` actually received by the destination account. |
| currency | String - [Currency Code][] | The currency delivered to the recipient of the transaction. |
| issuer | String - [Address][] | The gateway issuing the currency, or an empty string for XRP. |
| type | String | Either `sent` or `received`, indicating whether the perspective account is sender or receiver of this transaction. |


## Payment Objects ##
[Payment Objects]: #payment-objects

In the Data API, a Payment Object represents an event where one account sent value to another account. This mostly lines up with Ripple transactions of the `Payment` transaction type, except that the Data API does not consider a transaction to be a payment if the sending `Account` and the `Destination` account are the same, or if the transaction failed.

Payment objects have the following fields:

| Field | Value | Description |
|-------|-------|-------------|
| amount | String - Number | The amount of the destination `currency` that the transaction was instructed to send. In the case of Partial Payments, this is a "maximum" amount. |
| delivered\_amount | [String - Number][] | The amount of the destination `currency` actually received by the destination account. |
| destination\_balance\_changes | Array | Array of [balance change objects][], indicating all changes made to the `destination` account's balances. |
| source\_balance\_changes | Array | Array of [balance change objects][], indicating all changes to the `source` account's balances (except the XRP transaction cost). |
| fee | [String - Number][] | The amount of XRP spent by the `source` account on the transaction cost. |
| currency | String - [Currency Code][] | The currency that the `destination` account received. |
| destination | String - [Address][] | The account that received the payment. |
| executed\_time | String - [Timestamp][] | The time the ledger that included this payment closed. |
| ledger\_index | Number - [Ledger Index][] | The sequence number of the ledger that included this payment. |
| source | String - [Address][] | The account that sent the payment. |
| source\_currency | String - [Currency Code][] | The currency that the `source` account spent. |
| tx\_hash | String - [Hash][] | The identifying hash of the transaction that caused the payment. |


## Balance Objects and Balance Change Objects ##
[balance change objects]: #balance-objects-and-balance-change-objects
[balance objects]: #balance-objects-and-balance-change-objects

Balance objects represent an Ripple account's balance in a specific currency with a specific counterparty at a single point in time. Balance change objects represent a change to such balances that occurs in transaction execution.

A single Ripple transaction may cause changes to balances with several counterparties, as well as changes to XRP.

Balance objects and Balance Change objects have the same format, with the following fields:

| Field | Value | Description |
|-------|-------|-------------|
| counterparty | String - [Address][] | The counterparty, or issuer, of the `currency`. In the case of XRP, this is an empty string. |
| currency | String - [Currency Code][] | The currency for which this balance changed. |
| value | [String - Number][] | The amount of the `currency` that the associated account gained or lost. In balance change objects, this value can be positive (for amounts gained) or negative (for amounts lost). In balance objects, this value can be positive (for amounts the counterparty owes the account) or negative (for amounts owed to the counterparty). |


## Balance Change Descriptors ##
[Balance Change Descriptors]: #balance-change-descriptors

Balance Change Descriptors are objects that describe and analyze a single balance change that occurs in transaction execution. They represent the same events as [balance change objects][], but in greater detail.

Balance Change Descriptors have the following fields:

| Field | Value | Description |
|-------|-------|-------------|
| change | [String - Number][] | The difference in the amount of currency held before and after this change. |
| final\_balance | [String - Number][] | The balance after the change occurred. |
| node\_index | Number (or `null`)| This balance change is represented by the entry at this index of the ModifiedNodes array within the metadata section of the transaction that executed this balance change. **Note:** When the transaction cost is combined with other changes to XRP balance, the transaction cost has a `node_index` of **null** instead. |
| tx\_index | Number | The transaction that executed this balance change is at this index in the array of transactions for the ledger that included it. |
| change\_type | String | One of several [](#change-types) describing what caused this balance change to occur. |
| currency | String - [Currency Code][] | The change affected this currency. |
| executed\_time | String - [Timestamp][] | The time the change occurred. (This is based on the close time of the ledger that included the transaction that executed the change. |
| issuer | String - [Address][] | (Omitted for XRP) The `currency` was issued by this account. |
| ledger\_index | Number - [Ledger Index][] | The sequence number of the ledger that included the transaction that executed this balance change. |
| tx\_hash | String - [Hash][] | The identifying hash of the transaction that executed this balance change. |

### Change Types ###

The following values are valid for the `change_type` field of a Balance Change Descriptor:

| Value | Meaning |
|-------|---------|
| `network fee` | This balance change reflects XRP that was destroyed to relay a transaction. (This value may change; see [RD-635](https://ripplelabs.atlassian.net/browse/RD-635) for details.) |
| `payment_destination` | This balance change reflects currency that was received from a payment. |
| `payment_source` | This balance change reflects currency that was spent in a payment. |
| `exchange` | This balance change reflects currency that was traded for other currency, or the same currency from a different issuer. This can occur in the middle of payment execution as well as from offers. |




# Running the Historical Database #

You can also serve the Data API v2 from your own instance of the Historical Database software, and populate it with transactions from your own `rippled` instance. This is useful if you do not want to depend on Ripple Labs to operate the historical database indefinitely, or you want access to historical transactions from within your own intranet.

## Installation ##

### Dependencies ###

The Historical Database requires the following software installed first:

* [HBase](http://hbase.apache.org/) (required for v2),
* [Node.js](http://nodejs.org/)
* [npm](https://www.npmjs.org/)
* [git](http://git-scm.com/) (optional) for installation and updating.

### Installation Process ###

For v2 (hbase):

  1. Set up an hbase cluster
  2. Clone the rippled Historical Database Git Repository:
    `git clone https://github.com/ripple/rippled-historical-database.git`
    (You can also download and extract a zipped release instead.)
  3. Use npm to install additional modules:
    `cd rippled-historical-database`
    `npm install`
    The install script will also create the required config files: `config/api.config.json` and `config/import.config.json`
  4. Modify the API and import config files as needed. If you only wish to run the v2 endpoints, remove the `postgres` section from the api config file.

Reports, stats, and aggregated exchange data needs additional processing before the API can make it available. This processing uses Apache Storm as well as some custom scripts. See [Storm Setup](https://github.com/ripple/rippled-historical-database/blob/develop/storm/README.md) for more information.

At this point, the rippled Historical Database is installed. See [Services](#services) for the different components that you can run.

### Services ###

The `rippled` Historical Database consists of several processes that can be run separately.

* [Live Ledger Importer](#live-ledger-importer) - Monitors `rippled` for newly-validated ledgers.
    Command: `node import/live`
* [Backfiller](#backfiller) - Populates the database with older ledgers from a `rippled` instance.
    Command: `node import/postgres/backfill`
* API Server - Provides [REST API access](#usage) to the data.
    Command:  `npm start` (restarts the server automatically when source files change),
    or `node api/server.js` (simple start)

## Importing Data ##

In order to retrieve data from the `rippled` Historical Database, you must first populate it with data. Broadly speaking, there are two ways this can happen:

* Connect to a `rippled` server that has the historical ledgers, and retrieve them. (Later, you can reconfigure the `rippled` server not to maintain history older than what you have in your Historical Database.)
    * You can choose to retrieve only new ledgers as they are validated, or you can retrieve old ledgers, too.
* Or, you can load a dump from a database that already has the historical ledger data. (At this time, there are no publicly-available database dumps of historical data.) Use the standard process for your database.

In all cases, keep in mind that the integrity of the data is only as good as the original source. If you retrieve data from a public server, you are assuming that the operator of that server is trustworthy. If you load from a database dump, you are assuming that the provider of the dump has not corrupted or tampered with the data.

### Live Ledger Importer ###

The Live Ledger Importer is a service that connects to a `rippled` server using the WebSocket API, and listens for ledger close events. Each time a new ledger is closed, the Importer requests the latest validated ledger. Although this process has some fault tolerance built in to prevent ledgers from being skipped, it is still possible that the Importer may miss ledgers.

The Live Ledger Importer includes a secondary process that runs periodically to validate the data already imported and check for gaps in the ledger history.

The Live Ledger Importer can import to one or more different data stores concurrently. If you have configured the historical database to use another storage scheme, you can use the `--type` parameter to specify the database type or types to use. If not specified, the `rippled` Historical Database defaults to PostgreSQL.

Here are some examples:

```
// defaults to Hbase:
$ node import/live

// Use Postgres instead:
$ node import/live --type postgres

// Use PostgreSQL and Hbase simultaneously:
$ node import/live --type postgres,hbase
```

### Backfiller ###

The Backfiller retrieves old ledgers from a `rippled` instance by moving backwards in time. You can optionally provide start and stop indexes to retrieve a specific range of ledgers, by their sequence number.

The `--startIndex` parameter defines the most-recent ledger to retrieve. The Backfiller retrieves this ledger first and then continues retrieving progressively older ledgers. If this parameter is omitted, the Backfiller begins with the newest validated ledger.

The `--stopIndex` parameter defines the oldest ledger to retrieve. The Backfiller stops after it retrieves this ledger. If omitted, the Backfiller continues as far back as possible. Because backfilling goes from most recent to least recent, the stop index should be a smaller than the start index.

**Warning:** The Backfiller is best for filling in relatively short histories of transactions. Importing a complete history of all Ripple transactions using the Backfiller could take weeks. If you want a full history, we recommend acquiring a database dump with early transctions, and importing it directly. Ripple Labs used the internal SQLite database from an offline `rippled` to populate its historical databases with the early transactions, then used the Backfiller to catch up to date after the import finished.

Here are some examples:

```
// retrieve everything to PostgreSQL
node import/postgres/backfill

// get ledgers #1,000,000 to #2,000,000 (inclusive) and store in hbase
node import/hbase/backfill --startIndex 2000000 --stopIndex 1000000
```
accounts=true&payments=true&descending=true&start=2014-05-01&end=2014-07-01&format=csv
