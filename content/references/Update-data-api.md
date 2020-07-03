# Ripple Data API v2

The Ripple Data API v2 provides access to information about changes in the XRP Ledger, including transaction history and processed analytical data. This information is stored in a dedicated database, with a REST-like interface to present the data in various formats.

Ripple provides the Data API as a public service at the following address:

[**https://data.ripple.com**](https://data.ripple.com)

**Note:** This API and the data it provides are derived from the public, decentralized XRP Ledger. They are provided for free, but also provided “as is,” without any express, implied, or statutory warranties including but not limited to the implied warranties of merchantability or fitness for a particular purpose, and all warranties are disclaimed. The API and data may be unavailable at times, they may change, or they may have errors, so please use them at your own risk and exercise appropriate caution before incorporating them into your infrastructure.


## More Information
The Ripple Data API v2 replaces the Historical Database v1 and the [Charts API](https://github.com/ripple/ripple-data-api/).

* [API Methods](#api-method-reference)
* [API Conventions](#api-conventions)
* [Source Code on Github](https://github.com/ripple/rippled-historical-database)
* [Release Notes](https://github.com/ripple/rippled-historical-database/releases)

[v2.0.4]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.0.4
[v2.0.5]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.0.5
[v2.0.6]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.0.6
[v2.0.7]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.0.7
[v2.0.8]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.0.8
[v2.1.0]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.1.0
[v2.2.0]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.2.0
[v2.3.0]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.3.0
[v2.3.2]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.3.2
[v2.3.5]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.3.5
[v2.3.7]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.3.7
[v2.4.0]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.4.0


# API Method Reference

The Data API v2 provides a REST API with the following methods:

Ledger Contents Methods:

* [Get Ledger - `GET /v2/ledgers/{ledger_identifier}`](#get-ledger)
* [Get Transaction - `GET /v2/transactions/{hash}`](#get-transaction)
* [Get Transactions - `GET /v2/transactions/`](#get-transactions)
* [Get Payments - `GET /v2/payments/{currency}`](#get-payments)
* [Get Exchanges - `GET /v2/exchanges/{base}/{counter}`](#get-exchanges)
* [Get Exchange Rates - `GET /v2/exchange_rates/{base}/{counter}`](#get-exchange-rates)
* [Normalize - `GET /v2/normalize`](#normalize)
* [Get Daily Reports - `GET /v2/reports/`](#get-daily-reports)
* [Get Stats - `GET /v2/stats/`](#get-stats)
* [Get Active Accounts - `GET /v2/active_accounts/{base}/{counter}`](#get-active-accounts)
* [Get Exchange Volume - `GET /v2/network/exchange_volume`](#get-exchange-volume)
* [Get Payment Volume - `GET /v2/network/payment_volume`](#get-payment-volume)
* [Get External Markets - `GET /v2/network/external_markets`](#get-external-markets)
* [Get XRP Distribution - `GET /v2/network/xrp_distribution`](#get-xrp-distribution)
* [Get Top Currencies - `GET /v2/network/top_currencies`](#get-top-currencies)
* [Get Top Markets - `GET /v2/network/top_markets`](#get-top-markets)

Account Methods:

* [Get Account - `GET /v2/accounts/{address}`](#get-account)
* [Get Accounts - `GET /v2/accounts`](#get-accounts)
* [Get Account Balances - `GET /v2/accounts/{address}/balances`](#get-account-balances)
* [Get Account Orders - `GET /v2/accounts/{address}/orders`](#get-account-orders)
* [Get Account Transaction History - `GET /v2/accounts/{address}/transactions`](#get-account-transaction-history)
* [Get Transaction By Account and Sequence - `GET /v2/accounts/{address}/transactions/{sequence}`](#get-transaction-by-account-and-sequence)
* [Get Account Payments - `GET /v2/accounts/{address}/payments`](#get-account-payments)
* [Get Account Exchanges - `GET /v2/accounts/{address}/exchanges`](#get-account-exchanges)
* [Get Account Balance Changes - `GET /v2/accounts/{address}/balance_changes`](#get-account-balance-changes)
* [Get Account Reports - `GET /v2/accounts/{address}/reports`](#get-account-reports)
* [Get Account Transaction Stats - `GET /v2/accounts/{address}/stats/transactions`](#get-account-transaction-stats)
* [Get Account Value Stats - `GET /v2/accounts/{address}/stats/value`](#get-account-value-stats)

External Information Methods:

* [Get All Gateways - `GET /v2/gateways`](#get-all-gateways)
* [Get Gateway - `GET /v2/gateways/{gateway}`](#get-gateway)
* [Get Currency Image - `GET /v2/currencies/{currencyimage}`](#get-currency-image)

Validation Network Methods:

* [Get Transaction Costs - `GET /v2/network/fees`](#get-transaction-costs)
* [Get Fee Stats - `GET /v2/network/fee_stats`](#get-fee-stats)
* [Get Ledger Validations - `GET /v2/ledger/{hash}/validations`](#get-ledger-validations)
* [Get Ledger Validation - `GET /v2/ledger/{hash}/validations/{pubkey}`](#get-ledger-validation)
* [Get Topology - `GET /v2/network/topology`](#get-topology)
* [Get Topology Nodes - `GET /v2/network/topology/nodes`](#get-topology-nodes)
* [Get Topology Node - `GET /v2/network/topology/nodes/{pubkey}`](#get-topology-node)
* [Get Topology Links - `GET /v2/network/topology/links`](#get-topology-links)
* [Get Validator  - `GET /v2/network/validators/{pubkey}`](#get-validator)
* [Get Validators  - `GET /v2/network/validators`](#get-validators)
* [Get Validator Manifests - `GET /v2/network/validators/{pubkey}/manifests`](#get-validator-manifests)
* [Get Single Validator Reports - `GET /v2/network/validators/{pubkey}/reports`](#get-single-validator-reports)
* [Get Daily Validator Reports - `GET /v2/network/validator_reports`](#get-daily-validator-reports)
* [Get `rippled` Versions - `GET /v2/network/rippled_versions`](#get-rippled-versions)

Health Checks:

* [API Health Check - `GET /v2/health/api`](#health-check-api)
* [Importer Health Check - `GET /v2/health/importer`](#health-check-ledger-importer)
* [Nodes ETL Health Check - `GET /v2/health/nodes_etl`](#health-check-nodes-etl)
* [Validations ETL Health Check - `GET /v2/health/validations_etl`](#health-check-validations-etl)


## Get Ledger
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getLedger.js "Source")

Retrieve a specific Ledger by hash, index, date, or latest validated.

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/ledgers/{identifier}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-ledger)

This method requires the following URL parameters:

| Field               | Value                                               | Description |
|:--------------------|:----------------------------------------------------|:--|
| `ledger_identifier` | Ledger [Hash][], [Ledger Index][], or [Timestamp][] | _(Optional)_ An identifier for the ledger to retrieve: either the full hash in hex, an integer ledger index, or a date-time. If a date-time is provided, retrieve the ledger that was most recently closed at that time. If omitted, retrieve the latest validated ledger. |

Optionally, you can provide the following query parameters:

| Field          | Value   | Description                                       |
|:---------------|:--------|:--------------------------------------------------|
| `transactions` | Boolean | If `true`, include the identifying hashes of all transactions that are part of this ledger. |
| `binary`       | Boolean | If `true`, include all transactions from this ledger as hex-formatted binary data. (If provided, overrides `transactions`.) |
| `expand`       | Boolean | If `true`, include all transactions from this ledger as nested JSON objects. (If provided, overrides `binary` and `transactions`.) |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field    | Value                            | Description                    |
|:---------|:---------------------------------|:-------------------------------|
| `result` | String                           | The value `success` indicates that this is a successful response. |
| `ledger` | [Ledger object](#ledger-objects) | The requested ledger.          |

#### Example

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
        "transaction_hash": "33e0b9c5fd7766343e67854aed4222f5ed9c9507e0ec0d7ae7d54d0f17adb98e",
        "close_time": 1408047740,
        "close_time_human": "2014-08-14T20:22:20+00:00"
    }
}
```



## Get Ledger Validations
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getLedger.js "Source")

Retrieve a any validations recorded for a specific ledger hash.  This dataset includes ledger versions that are outside the validated ledger chain. _(New in [v2.2.0][])_

**Note:** The Data API does not have a comprehensive record of all validations. The response only includes data that the Data API has recorded. Some ledger versions, especially older ledgers, may have no validations even if they were validated by consensus.

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/ledgers/{ledger_hash}/validations
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-ledger-validations)

This method requires the following URL parameters:

| Field         | Value    | Description                              |
|:--------------|:---------|:-----------------------------------------|
| `ledger_hash` | [Hash][] | Ledger hash to retrieve validations for. |

Optionally, you can provide the following query parameters:

| Field    | Value   | Description                                             |
|:---------|:--------|:--------------------------------------------------------|
| `limit`  | Integer | Maximum results per page. The default is 200. Cannot be more than 1000. |
| `marker` | String  | [Pagination](#pagination) key from previously returned response. |
| `format` | String  | Format of returned results: `csv` or `json`. The default is `json`. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field         | Value                           | Description                |
|:--------------|:--------------------------------|:---------------------------|
| `result`      | String - `success`              | Indicates that the body represents a successful response. |
| `ledger_hash` | String - [Hash][]               | The identifying hash of the ledger version requested. |
| `count`       | Integer                         | Number of validations returned. |
| `marker`      | String                          | (May be omitted) [Pagination](#pagination) marker. |
| `validations` | Array of [Validation Objects][] | All known validation votes for the ledger version. |


#### Example

Request:

```
GET /v2/ledgers/A10E9E338BA365D2B768814EC8B0A9A2D8322C0040735E20624AF711C5A593E7/validations?limit=2
```

Response:

```
200 OK
{
  "result": "success",
  "ledger_hash": "A10E9E338BA365D2B768814EC8B0A9A2D8322C0040735E20624AF711C5A593E7",
  "count": 2,
  "marker": "A10E9E338BA365D2B768814EC8B0A9A2D8322C0040735E20624AF711C5A593E7|n9KDJnMxfjH5Ez8DeWzWoE9ath3PnsmkUy3GAHiVjE7tn7Q7KhQ2|20160608001732",
  "validations": [
    {
      "count": 27,
      "first_datetime": "2016-06-08T00:17:32.352Z",
      "last_datetime": "2016-06-08T00:17:32.463Z",
      "ledger_hash": "A10E9E338BA365D2B768814EC8B0A9A2D8322C0040735E20624AF711C5A593E7",
      "reporter_public_key": "n9KJb7NMxGySRcjCqh69xEPMUhwJx22qntYYXsnUqYgjsJhNoW7g",
      "signature": "304402204C751D0033070EBC008786F0ECCA8E29195FD7DD8D22498EB6E4E732905FC7090220091F458976904E7AE4633A1EC405175E6A126798E4896DD452853B887B1E6359",
      "validation_public_key": "n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7"
    },
    {
      "count": 3,
      "first_datetime": "2016-06-08T00:17:32.653Z",
      "last_datetime": "2016-06-08T00:17:32.673Z",
      "ledger_hash": "A10E9E338BA365D2B768814EC8B0A9A2D8322C0040735E20624AF711C5A593E7",
      "reporter_public_key": "n9JCK5AML7Ejv3TcJmnvJk5qeYhf7Q9YwScjz5PhtUbtWCKH3NAm",
      "signature": "3045022100A48E5AF6EA9D0ACA6FDE18536081A7D2182535579EA580C3D0B0F18C2556C5D30220521615A3D677376069F8F3E608B59F14482DDE4CD2A304DE578B6CCE2F5E8D54",
      "validation_public_key": "n9K6YbD1y9dWSAG2tbdFwVCtcuvUeNkBwoy9Z6BmeMra9ZxsMTuo"
    }
  ]
}
```



## Get Ledger Validation
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getLedger.js "Source")

Retrieve a validation vote recorded for a specific ledger hash by a specific validator.  This dataset includes ledger versions that are outside the validated ledger chain. _(New in [v2.2.0][])_

**Note:** The Data API does not have a comprehensive record of all validations. The response only includes data that the Data API has recorded. Some ledger versions, especially older ledgers, may have no validations even if they were validated by consensus.

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/ledgers/{ledger_hash}/validations/{pubkey}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-ledger-validation)

This method requires the following URL parameters:

| Field         | Value                           | Description                |
|:--------------|:--------------------------------|:---------------------------|
| `ledger_hash` | [Hash][]                        | Ledger hash to retrieve validations for. |
| `pubkey`      | String - Base-58 [Public Key][] | Validator public key.      |

This request takes no query parameters.

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body containing a **[Validation Object][]** with the following additional field:

| Field    | Value  | Description                                              |
|:---------|:-------|:---------------------------------------------------------|
| `result` | String | The value `success` indicates that this is a successful response. |

#### Example

Request:

```
GET /v2/ledgers/A10E9E338BA365D2B768814EC8B0A9A2D8322C0040735E20624AF711C5A593E7/validations/n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7
```

Response:

```
200 OK
{
  "count": 27,
  "first_datetime": "2016-06-08T00:17:32.352Z",
  "last_datetime": "2016-06-08T00:17:32.463Z",
  "ledger_hash": "A10E9E338BA365D2B768814EC8B0A9A2D8322C0040735E20624AF711C5A593E7",
  "reporter_public_key": "n9KJb7NMxGySRcjCqh69xEPMUhwJx22qntYYXsnUqYgjsJhNoW7g",
  "signature": "304402204C751D0033070EBC008786F0ECCA8E29195FD7DD8D22498EB6E4E732905FC7090220091F458976904E7AE4633A1EC405175E6A126798E4896DD452853B887B1E6359",
  "validation_public_key": "n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7",
  "result": "success"
}
```



## Get Transaction
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getTransactions.js "Source")

Retrieve a specific transaction by its identifying hash.

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/transactions/{hash}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-transaction)

This method requires the following URL parameters:

| Field  | Value             | Description                              |
|:-------|:------------------|:-----------------------------------------|
| `hash` | String - [Hash][] | The identifying hash of the transaction. |

Optionally, you can provide the following query parameters:

| Field    | Value   | Description                                             |
|:---------|:--------|:--------------------------------------------------------|
| `binary` | Boolean | If `true`, return transaction data in binary format, as a hex string. Otherwise, return transaction data as nested JSON. The default is `false`. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field         | Value                  | Description                         |
|:--------------|:-----------------------|:------------------------------------|
| `result`      | String                 | The value `success` indicates that this is a successful response. |
| `transaction` | [Transaction object][] | The requested transaction.          |

[Transaction object]: #transaction-objects

#### Example

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





## Get Transactions
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getTransactions.js "Source")

Retrieve transactions by time

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/transactions/
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-transactions)

Optionally, you can provide the following query parameters:

| Field        | Value                  | Description                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | String - [Timestamp][] | Filter results to this time and later. |
| `end`        | String - [Timestamp][] | Filter results to this time and earlier. |
| `descending` | Boolean                | If `true`, return results in reverse chronological order. The default is `false`. |
| `type`       | String                 | Filter transactions to a specific [transaction type](transaction-types.html). |
| `result`     | String                 | Filter transactions for a specific [transaction result](transaction-results.html). |
| `binary`     | Boolean                | If `true`, return transactions in binary form. The default is `false`. |
| `limit`      | Integer                | Maximum results per page. The default is 20. Cannot be more than 100. |
| `marker`     | String                 | [Pagination](#pagination) marker from a previous response. |

#### Response Format
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field          | Value                            | Description              |
|:---------------|:---------------------------------|:-------------------------|
| `result`       | String                           | The value `success` indicates that this is a successful response. |
| `count`        | Integer                          | Number of Transactions returned. |
| `marker`       | String                           | (May be omitted) Pagination marker. |
| `transactions` | Array of [Transaction objects][] | The requested transactions. |

[Transaction objects]: #transaction-objects

#### Example

Request:

```
GET /v2/transactions/?result=tecPATH_DRY&limit=2&type=Payment
```

Response:

```
200 OK
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



## Get Payments
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getPayments.js "Source")

Retrieve Payments over time, where Payments are defined as `Payment` type transactions where the sender of the transaction is not also the destination. _(New in [v2.0.4][])_

Results can be returned as individual payments, or aggregated to a specific list of intervals if currency and issuer are provided.

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST - All Currencies*

```
GET /v2/payments/
```

*REST - Specific Currency*

```
GET /v2/payments/{currency}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-payments)

This method uses the following URL parameters:

| Field      | Value  | Description                                            |
|:-----------|:-------|:-------------------------------------------------------|
| `currency` | String | _(Optional)_ Currency code, followed by `+` and a counterparty address. (Or `XRP` with no counterparty.) If omitted, return payments for all currencies. |

Optionally, you can provide the following query parameters:

| Field        | Value                  | Description                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | String - [Timestamp][] | Filter results to this time and later. |
| `end`        | String - [Timestamp][] | Filter results to this time and earlier. |
| `descending` | Boolean                | If `true`, return results in reverse chronological order. The default is `false`. |
| `limit`      | Integer                | Maximum results per page. The default is 200. Cannot be more than 1000. |
| `marker`     | String                 | [Pagination](#pagination) key from previously returned response. |
| `format`     | String                 | Format of returned results: `csv` or `json`. The default is `json`. |

The `interval` parameter for aggregated results has been removed as of [v2.3.5][].

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field      | Value                        | Description                      |
|:-----------|:-----------------------------|:---------------------------------|
| `result`   | String                       | The value `success` indicates that this is a successful response. |
| `count`    | Integer                      | Number of payments returned.     |
| `marker`   | String                       | (May be omitted) [Pagination](#pagination) marker. |
| `payments` | Array of [Payment Objects][] | The requested payments.          |


#### Example

Request:

```
GET /v2/payments/BTC+rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q?limit=2
```

Response:

```
200 OK
{
  "result": "success",
  "count": 2,
  "marker": "20131124004240|000003504935|00002",
  "payments": [
    {
      "amount": "100.0",
      "delivered_amount": "100.0",
      "destination_balance_changes": [
        {
          "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
          "currency": "BTC",
          "value": "100"
        }
      ],
      "transaction_cost": "1.0E-5",
      "source_balance_changes": [
        {
          "counterparty": "rwm98fCBS8tV1YB8CGho8zUPW5J7N41th2",
          "currency": "BTC",
          "value": "-100"
        }
      ],
      "tx_index": 3,
      "currency": "BTC",
      "destination": "rwm98fCBS8tV1YB8CGho8zUPW5J7N41th2",
      "executed_time": "2013-09-27T04:03:00Z",
      "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
      "ledger_index": 2424349,
      "source": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
      "source_currency": "BTC",
      "tx_hash": "EDDE2601C38F886E1183B5E7E1BFD936105C76E3648E3FAD2A6C55E90BABDB47"
    },
    {
      "amount": "0.2",
      "delivered_amount": "0.2",
      "destination_balance_changes": [
        {
          "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
          "currency": "BTC",
          "value": "0.2"
        }
      ],
      "transaction_cost": "1.5E-5",
      "max_amount": "0.202",
      "source_balance_changes": [
        {
          "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
          "currency": "BTC",
          "value": "-0.2"
        }
      ],
      "tx_index": 1,
      "currency": "BTC",
      "destination": "rHfcNvcg8pBqBxtSvD9Ma8gF17uxauB31o",
      "executed_time": "2013-11-20T23:52:30Z",
      "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
      "ledger_index": 3445885,
      "source": "rwm98fCBS8tV1YB8CGho8zUPW5J7N41th2",
      "source_currency": "BTC",
      "tx_hash": "F30D6CED4B0C37660F6DD741C9CA49F0BCB2D2648CDB8FC8AD6CFD86A86384E2"
    }
  ]
}
```





## Get Exchanges
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getExchanges.js "Source")

Retrieve Exchanges for a given currency pair over time.  Results can be returned as individual exchanges or aggregated to a specific list of intervals

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/exchanges/{base}/{counter}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-exchanges)

This method requires the following URL parameters:

| Field     | Value  | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `base`    | String | Base currency of the pair, as a [Currency Code][], followed by `+` and the issuer [Address][] unless it's XRP. |
| `counter` | String | Counter currency of the pair, as a [Currency Code][], followed by `+` and the issuer [Address][] unless it's XRP. |

Optionally, you can provide the following query parameters:

| Field         | Value                  | Description                         |
|:--------------|:-----------------------|:------------------------------------|
| `start`       | String - [Timestamp][] | Filter results to this time and later. |
| `end`         | String - [Timestamp][] | Filter results to this time and earlier. |
| `interval`    | String                 | Aggregation interval: `1minute`, `5minute`, `15minute`, `30minute`, `1hour`, `2hour`, `4hour`, `1day`, `3day`, `7day`, or `1month`. The default is non-aggregated results. |
| `descending`  | Boolean                | If `true`, return results in reverse chronological order. |
| `reduce`      | Boolean                | If `true`, aggregate all individual results. The default is `false`. |
| `limit`       | Integer                | Maximum results per page. The default is 200. Cannot be more than 20,000 if `reduce` is true. Otherwise cannot be more than 1,000. |
| `marker`      | String                 | [Pagination](#pagination) key from previously returned response. |
| `autobridged` | Boolean                | If `true`, filter results to autobridged exchanges only. |
| `format`      | String                 | Format of returned results: `csv` or `json`. The default is `json`. |

#### Response Format
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field       | Value                         | Description                    |
|:------------|:------------------------------|:-------------------------------|
| `result`    | String                        | The value `success` indicates that this is a successful response. |
| `count`     | Integer                       | Number of Transactions returned. |
| `marker`    | String                        | (May be omitted) [Pagination](#pagination) marker. |
| `exchanges` | Array of [Exchange Objects][] | The requested exchanges.       |

#### Example

Request:

```
GET /v2/exchanges/USD+rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q/XRP?descending=true&limit=3&result=tesSUCCESS&type=OfferCreate
```

Response:

```
200 OK
{
    "result": "success",
    "count": 3,
    "marker": "USD|rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q|XRP||20151021222220|000016612683|00017|00000",
    "exchanges": [
        {
            "base_amount": 4.98954834453577,
            "counter_amount": 1047.806201,
            "node_index": 9,
            "rate": 210.00021000021,
            "tx_index": 0,
            "buyer": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM",
            "executed_time": "2015-10-21T23:09:50",
            "ledger_index": 16613308,
            "offer_sequence": 1010056,
            "provider": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM",
            "seller": "rK2o63evRPdRoMT2ZaW72wsHsFzcjnRLLq",
            "taker": "rK2o63evRPdRoMT2ZaW72wsHsFzcjnRLLq",
            "tx_hash": "25600A10E5395D45A9D514E1EC3D98C341C5451FD21C48FA9D104C310EC29D6B",
            "tx_type": "Payment",
            "base_currency": "USD",
            "base_issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
            "counter_currency": "XRP"
        },
        {
            "base_amount": 0.0004716155440678037,
            "counter_amount": 0.1,
            "node_index": 3,
            "rate": 212.03711637126,
            "tx_index": 0,
            "buyer": "rfh3pFHkCXv3TgzsEJgyCzF1CduZHCLi9o",
            "executed_time": "2015-10-21T23:09:50",
            "ledger_index": 16613308,
            "offer_sequence": 158081,
            "provider": "rfh3pFHkCXv3TgzsEJgyCzF1CduZHCLi9o",
            "seller": "rK2o63evRPdRoMT2ZaW72wsHsFzcjnRLLq",
            "taker": "rK2o63evRPdRoMT2ZaW72wsHsFzcjnRLLq",
            "tx_hash": "25600A10E5395D45A9D514E1EC3D98C341C5451FD21C48FA9D104C310EC29D6B",
            "tx_type": "Payment",
            "base_currency": "USD",
            "base_issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
            "counter_currency": "XRP"
        },
        {
            "base_amount": 0.0004714169229390923,
            "counter_amount": 0.1,
            "node_index": 3,
            "rate": 212.1264535361624,
            "tx_index": 17,
            "autobridged_currency": "USD",
            "autobridged_issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
            "buyer": "rfh3pFHkCXv3TgzsEJgyCzF1CduZHCLi9o",
            "executed_time": "2015-10-21T22:22:20",
            "ledger_index": 16612683,
            "offer_sequence": 158059,
            "provider": "rfh3pFHkCXv3TgzsEJgyCzF1CduZHCLi9o",
            "seller": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM",
            "taker": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM",
            "tx_hash": "F05F670B06D641D7F6FE18E450DDB2C7A4DDF76D580C34C820939DC22AD9F582",
            "tx_type": "OfferCreate",
            "base_currency": "USD",
            "base_issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
            "counter_currency": "XRP"
        }
    ]
}
```



## Get Exchange Rates
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getExchangeRate.js "Source")

Retrieve an exchange rate for a given currency pair at a specific time.

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/exchange_rates/{base}/{counter}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-exchange-rates)

This method requires the following URL parameters:

| Field     | Value  | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `base`    | String | Base currency of the pair, as a [Currency Code][], followed by `+` and the issuer [Address][]. Omit the `+` and the issuer for XRP. |
| `counter` | String | Counter currency of the pair, as a [Currency Code][], followed by `+` and the issuer [Address][]. Omit the `+` and the issuer for XRP. |


Optionally, you can provide the following query parameters:

| Field    | Value                  | Description                              |
|:---------|:-----------------------|:-----------------------------------------|
| `date`   | String - [Timestamp][] | Return an exchange rate for the specified time. The default is the current time. |
| `strict` | Boolean                | If `false`, allow rates derived from less than 10 exchanges. The default is `true`. |


#### Response Format
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field    | Value  | Description                                              |
|:---------|:-------|:---------------------------------------------------------|
| `result` | String | The value `success` indicates that this is a successful response. |
| `rate`   | Number | The requested exchange rate, or `0` if the exchange rate could not be determined. |

All exchange rates are calcuated by converting the base currency and counter currency to XRP.

The rate is derived from the volume weighted average over the calendar day specified, averaged with the volume weighted average of the last 50 trades within the last 14 days.

#### Example

Request:

```
GET /v2/exchange_rates/USD+rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q/XRP?date=2015-11-13T00:00:00Z
```

Response:

```
200 OK
{
  "result": "success",
  "rate": "224.65709"
}
```




## Normalize
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/normalize.js "Source")

Convert an amount from one currency and issuer to another, using the network exchange rates.

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/normalize
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#normalize)

You must provide at least some of the following query parameters:

| Field               | Value                      | Description               |
|:--------------------|:---------------------------|:--------------------------|
| `amount`            | Number                     | (Required) Amount of currency to normalize. |
| `currency`          | String - [Currency Code][] | The currency code of the `amount` to convert from. The default is XRP. |
| `issuer`            | String - [Address][]       | The issuer of the currency to convert from. (Required if `currency` is not XRP.) |
| `exchange_currency` | String - [Currency Code][] | The currency to convert to. The default is XRP. |
| `exchange_issuer`   | String - [Address][]       | The issuer of the currency to convert to. (Required if `exchange_currency` is not XRP.) |
| `date`              | String - [Timestamp][]     | Convert according to the exchange rate at this time. The default is the current time. |
| `strict`            | Boolean                    | If `true`, do not use exchange rates that are determined by less than 10 exchanges. The default is `true`. |


#### Response Format
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field       | Value  | Description                                           |
|:------------|:-------|:------------------------------------------------------|
| `result`    | String | The value `success` indicates that this is a successful response. |
| `amount`    | Number | Pre-conversion amount specified in the request.       |
| `converted` | Number | Post-conversion amount of the `exchange_currency`, or `0` if the exchange rate could not be determined. |
| `rate`      | Number | Exchange rate used to calculate the conversion, or `0` if the exchange rate could not be determined. |

All exchange rates are calculating by converting both currencies to XRP.

#### Example

Request:

```
GET /v2/normalize?amount=100&currency=XRP&exchange_currency=USD&exchange_issuer=rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q
```

Response:

```
200 OK
{
  "result": "success",
  "amount": "100",
  "converted": "0.4267798022744489",
  "rate": "0.0042677980"
}
```




## Get Daily Reports
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/reports.js "Source")

Retrieve per account per day aggregated payment summaries

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/reports/{date}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-daily-reports)

This method uses the following URL parameter:

| Field  | Value  | Description                                                   |
|:-------|:-------|:--------------------------------------------------------------|
| `date` | String | _(Optional)_ UTC query date. If omitted, use the current day. |

Optionally, you can provide the following query parameters:

| Field      | Value   | Description                                           |
|:-----------|:--------|:------------------------------------------------------|
| `accounts` | Boolean | If `true`, include lists of counterparty accounts. The default is `false`. |
| `payments` | Boolean | If `true`, include lists of individual payments. The default is `false`. |
| `format`   | String  | Format of returned results: `csv` or `json`. The default is `json`. |
| `limit`    | Integer | Maximum results per page. The default is 200. Cannot be more than 1000. |
| `marker`   | String  | [Pagination](#pagination) key from previously returned response. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field     | Value                        | Description                       |
|:----------|:-----------------------------|:----------------------------------|
| `result`  | String                       | The value `success` indicates that this is a successful response. |
| `date`    | String - [Timestamp][]       | The date for which this report applies. |
| `count`   | Integer                      | Number of reports returned.       |
| `marker`  | String                       | (May be omitted) [Pagination](#pagination) marker. |
| `reports` | Array of [Reports Objects][] | The requested reports. Each report pertains to a single account. |

**Caution:** This method may return a very large amount of data (more than 1 megabyte), which may cause poor performance in your client application.

#### Example

Request:

```
GET /v2/reports/2015-08-19T00:00:00Z?accounts=true&payments=true
```

Response (trimmed for size):

```
{
    "result": "success",
    "date": "2015-08-19T00:00:00Z",
    "count": 2,
    "marker": "20150819000000|r2nt4zXDP6Be5FNrLsiuuTEBETbGR9RFw",
    "reports": [
        {
            "account": "r2LXq2rZWSgQ1thhKiEytzi1smg6oEn8A",
            "date": "2015-08-19T00:00:00Z",
            "high_value_received": "7000",
            "high_value_sent": "3400",
            "payments": [
                {
                    "tx_hash": "A032EFBB219B1102BBD9BCCB91EDC6EAA8185509574FA476A2D3FE6BA79B04EF",
                    "amount": "1700",
                    "type": "received"
                },
                {
                    "tx_hash": "8B059360DC83777CDCABA84824C169651AFD6A7AB44E8742A3B8C6BC2AAF7384",
                    "amount": "40",
                    "type": "received"
                },

                ...(additional results trimmed)...

                {
                    "tx_hash": "76041BD6546389B5EC2CDBAA543200CF7B8D300F34F908BA5CA8523B0CA158C8",
                    "amount": "1400",
                    "type": "sent"
                }
            ],
            "payments_received": 155,
            "payments_sent": 49,
            "receiving_counterparties": [
                "rDMFJrKg2jyoNG6WDWJknXDEKZ6ywNFGwD",
                "r4XXHxraHLuCiLmLMw96FTPXXywZSnWSyR",

                ...(additional results trimmed)...


                "rp1C4Ld6uGjurFpempUJ8q5hPSWhak5EQf"
            ],
            "sending_counterparties": [
                "rwxcJVWZSEgN2DmLZYYjyagHjMx5jQ7BAa",

                ...(additional results trimmed)...


                "rBK1rLjbWsSU9EuST1cAz9RsiYdJPVGXXA"
            ],
            "total_value": "210940",
            "total_value_received": "100540",
            "total_value_sent": "110400"
        },
        {
            "account": "r2adXWaWFJt9mHeoWN77iHJozDz2FDAPA",
            "date": "2015-08-19T00:00:00Z",
            "high_value_received": "7400",
            "high_value_sent": "15900",
            "payments": [
                {
                    "tx_hash": "9C7EA76D467AE58E6AEFAAC7994D42FB4E7FA72BFA22F90260937386D76BDB64",
                    "amount": "900",
                    "type": "sent"
                },

                ...(additional results trimmed)...


                {
                    "tx_hash": "EC25427964419394BB5D06343BC74235C33655C1F70523C688F9A201957D65BA",
                    "amount": "100",
                    "type": "sent"
                }
            ],
            "payments_received": 43,
            "payments_sent": 62,
            "receiving_counterparties": [
                "rB4cyZxrBrTmJcWZSBc8YoW2t3bafiKRp",

                ...(additional results trimmed)...


                "rKybkw3Pu74VfJfrWr7QJbVPJNarnKP2EJ"
            ],
            "sending_counterparties": [
                "rNRCXw8PQRjvTwMDDLZVvuLHSKqqXUXQHv",
                "r7CLMVEuNvK2yXTPLPnkWMqzkkXuopWeL",

                ...(additional results trimmed)...


                "ranyeoYRhvwiFABzDvxSVyqQKp1bMkFsaX"
            ],
            "total_value": "117600",
            "total_value_received": "54700",
            "total_value_sent": "62900"
        }
    ]
}
```



## Get Stats
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/stats.js "Source")

Retrieve statistics about transaction activity in the XRP Ledger, divided into intervals of time.

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/stats
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-stats)

Optionally, you can provide the following query parameters:

| Field        | Value                  | Description                          |
|:-------------|:-----------------------|:-------------------------------------|
| `family`     | String                 | If provided, filter results to a single family of stats: `type`, `result`, or `metric`. By default, provides all stats from all families. |
| `metrics`    | String                 | Filter results to one or more metrics (in a comma-separated list). Requires the `family` of the metrics to be specified. By default, provides all metrics in the family. |
| `start`      | String - [Timestamp][] | Filter results to this time and later. |
| `end`        | String - [Timestamp][] | Filter results to this time and earlier. |
| `interval`   | String                 | Aggregation interval (`hour`, `day`, or `week`). The default is `day`. |
| `limit`      | Integer                | Maximum results per page. The default is 200. Cannot be more than 1000. |
| `marker`     | String                 | [Pagination](#pagination) key from previously returned response. |
| `descending` | Boolean                | If `true`, return results in reverse chronological order. The default is `false`. |
| `format`     | String                 | Format of returned results: `csv` or `json`. The default is `json`. |

##### Families and Metrics

The `family` and `metrics` query parameters provide a way to filter results to a specific subset of all metrics available for transactions in any given interval. Each metric is tied to a specific family, as follows:

| Family   | Included Metrics | Meaning |
|:---------|:-----------------|:--------|
| `type`   | All XRP Ledger [transaction types](transaction-formats.html), including `Payment`, `AccountSet`, `OfferCreate`, and others. | Number of transactions of the given type that occurred during the interval. |
| `result` | All [transaction result codes](transaction-results.html) (string codes, not the numeric codes), including `tesSUCCESS`, `tecPATH_DRY`, and many others. | Number of transactions that resulted in the given code during the interval. |
| `metric` | Data-API defined Special Transaction Metrics. | (Varies) |

##### Special Transaction Metrics

The Data API derives the following values for every interval. These metrics are part of the `metric` family.

| Field              | Value  | Description                                    |
|:-------------------|:-------|:-----------------------------------------------|
| `accounts_created` | Number | The number of new accounts funded during this interval. |
| `exchanges_count`  | Number | The number of currency exchanges that occurred during this interval. |
| `ledger_count`     | Number | The number of ledgers closed during this interval. |
| `ledger_interval`  | Number | The average number of seconds between ledgers closing during this interval. |
| `payments_count`   | Number | The number of payments from one account to another during this interval. |
| `transaction_count`| Number | The number of transactions that executed during this interval. |
| `tx_per_ledger`    | Number | The average number of transactions per ledger in this interval. |

If any of the metrics have a value of 0, they are omitted from the results.

#### Response Format
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field    | Value                  | Description                              |
|:---------|:-----------------------|:-----------------------------------------|
| `result` | String                 | The value `success` indicates that this is a successful response. |
| `count`  | Integer                | Number of reports returned.              |
| `marker` | String                 | (May be omitted) [Pagination](#pagination) marker. |
| `stats`  | Array of stats objects | The requested stats. Omits metrics with a value of 0, and intervals that have no nonzero metrics. |

#### Example

Request:

```
GET /v2/stats/?start=2015-08-30&end=2015-08-31&interval=day&family=metric&metrics=accounts_created,exchanges_count,ledger_count,payments_count
```

Response:

```
200 OK
{
  "result": "success",
  "count": 2,
  "stats": [
    {
      "accounts_created": 15,
      "exchanges_count": 19368,
      "ledger_count": 20307,
      "payments_count": 24763,
      "date": "2015-08-30T00:00:00Z"
    },
    {
      "accounts_created": 18,
      "exchanges_count": 17192,
      "ledger_count": 19971,
      "payments_count": 30894,
      "date": "2015-08-31T00:00:00Z"
    }
  ]
}
```



## Get Active Accounts
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/activeAccounts.js "Source")

Get information on which accounts are actively trading in a specific currency pair. _(New in [v2.0.4][])_

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/active_accounts/{base}/{counter}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-active-accounts)

This method requires the following URL parameters:

| Field     | Value  | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `base`    | String | Base currency of the pair, as a [Currency Code][], followed by `+` and the issuer [Address][] unless it's XRP. |
| `counter` | String | Counter currency of the pair, as a [Currency Code][], followed by `+` and the issuer [Address][] unless it's XRP. |

Optionally, you can provide the following query parameters:

| Field               | Value   | Description                                  |
|:--------------------|:--------|:---------------------------------------------|
| `period`            | String  | Get results for trading activity during a chosen time period. Valid periods are `1day`, `3day`, or `7day`. The default is `1day`. |
| `date`              | String  | Get results for the period starting at this time. The default is the most recent period available. |
| `include_exchanges` | Boolean | Include individual exchanges for each account in the results. |
| `format`            | String  | Format of returned results: `csv` or `json`. The default is `json`. |

#### Response Format
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field             | Value                                   | Description    |
|:------------------|:----------------------------------------|:---------------|
| `result`          | String                                  | The value `success` indicates that this is a successful response. |
| `count`           | Integer                                 | Number of accounts returned. |
| `exchanges_count` | Integer                                 | Total number of exchanges in the period. |
| `accounts`        | Array of active Account Trading Objects | Active trading accounts for the period. |

Each **Account Trading Object** describes the activity of a single account during this time period, and has the following fields:

| Field                 | Value                | Description                   |
|:----------------------|:---------------------|:------------------------------|
| `buy`                 | Object               | Summary of currency exchanges buying the base currency |
| `buy.base_volume`     | Number               | Amount of base currency the account bought in this period. |
| `buy.counter_volume`  | Number               | Amount of counter currency the account sold in this period. |
| `buy.count`           | Number               | Number of trades that bought the base currency in this period. |
| `sell`                | Object               | Summary of currency changes selling the base currency. |
| `sell.base_volume`    | Number               | Amount of the base currency the account sold this period. |
| `sell.counter_volume` | Number               | Amount of the counter currency the account bought this period. |
| `sell.count`          | Number               | Number of trades that sold the base currency. |
| `account`             | String - [Address][] | The address whose activity this object describes. |
| `base_volume`         | Number               | The total volume of the base currency the account bought and sold in this period. |
| `counter_volume`      | Number               | The total volume of the counter currency the account bought and sold in this period. |
| `count`               | Number               | The total number of exchanges the account made during this period. |

#### Example

Request:

```
GET /v2/active_accounts/XRP/USD+rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q
```

Response:

```
200 OK
{
    "result": "success",
    "count": 12,
    "exchanges_count": 11,
    "accounts": [
        {
            "buy": {
                "base_volume": 0,
                "counter_volume": 0,
                "count": 0
            },
            "sell": {
                "base_volume": 13084.822874,
                "counter_volume": 54.499328645454604,
                "count": 4
            },
            "account": "rGBQhB8EH5DmqMmfKPLchpqr3MR19pv6zN",
            "base_volume": 13084.822874,
            "counter_volume": 54.499328645454604,
            "count": 4
        },
        {
            "buy": {
                "base_volume": 12597.822874,
                "counter_volume": 52.4909286454546,
                "count": 1
            },
            "sell": {
                "base_volume": 0,
                "counter_volume": 0,
                "count": 0
            },
            "account": "rQE5Z3FgVnRMbVfS6xiVQFgB4J3X162FVD",
            "base_volume": 12597.822874,
            "counter_volume": 52.4909286454546,
            "count": 1
        },

        ... (additional results trimmed)...

        {
            "buy": {
                "base_volume": 1.996007,
                "counter_volume": 0.008782427920595,
                "count": 1
            },
            "sell": {
                "base_volume": 0,
                "counter_volume": 0,
                "count": 0
            },
            "account": "rD8LigXE7165r3VWhSQ4FwzJy7PNrTMwUq",
            "base_volume": 1.996007,
            "counter_volume": 0.008782427920595,
            "count": 1
        },
        {
            "buy": {
                "base_volume": 0,
                "counter_volume": 0,
                "count": 0
            },
            "sell": {
                "base_volume": 0.1,
                "counter_volume": 0.0004821658905462904,
                "count": 1
            },
            "account": "rfh3pFHkCXv3TgzsEJgyCzF1CduZHCLi9o",
            "base_volume": 0.1,
            "counter_volume": 0.0004821658905462904,
            "count": 1
        }
    ]
}
```



## Get Exchange Volume
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getMetric.js "Source")

Get aggregated exchange volume for a given time period. _(New in [v2.0.4][])_

The API returns results in units of a single _display currency_ rather than many different currencies. The conversion uses standard rates to and from XRP.

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/exchange_volume
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-exchange-volume)

Optionally, you can provide the following query parameters:

| Field               | Value                      | Description               |
|:--------------------|:---------------------------|:--------------------------|
| `live`              | String                     | Return a live rolling window of this length of time. Valid values are `day`, `hour`, or `minute`. _(New in [v2.3.0][])_ |
| `exchange_currency` | String - [Currency Code][] | Normalize all amounts to use this as a display currency. If not XRP, `exchange_issuer` is also required. The default is XRP. |
| `exchange_issuer`   | String - [Address][]       | Normalize results to the specified `currency` issued by this issuer. |
| `format`            | String                     | Format of returned results: `csv` or `json`. The default is `json`. |

The `start`, `end`, `interval`, `limit`, and `marker` parameters have been removed in [v2.3.5][].

#### Response Format
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field    | Value                                | Description                |
|:---------|:-------------------------------------|:---------------------------|
| `result` | String                               | The value `success` indicates that this is a successful response. |
| `count`  | Integer                              | Number of results returned. |
| `rows`   | Array of exchange [Volume Objects][] | Exchange volumes for each interval in the requested time period. (By default, this array contains only the most recent complete interval. If `live` is specified and `interval` isn't, this array contains the specified rolling window instead.) |

Each object in the `components` array of the Volume Objects represent the volume of exchanges in a market between two currencies, and has the following fields:

| Field              | Value  | Description                                    |
|:-------------------|:-------|:-----------------------------------------------|
| `count`            | Number | The number of exchanges in this market during this interval. |
| `rate`             | Number | The exchange rate from the base currency to the display currency. |
| `amount`           | Number | The amount of volume in the market, in units of the base currency. |
| `base`             | Object | The `currency` and `issuer` of the base currency of this market. There is no `issuer` for XRP. |
| `counter`          | Object | The `currency` and `issuer` of the counter currency of this market. There is no `issuer` for XRP. |
| `converted_amount` | Number | The total amount of volume in the market, converted to the display currency. _(Before [v2.1.0][], this was `convertedAmount`.)_ |

#### Example

Request:

```
GET /v2/network/exchange_volume?exchange_currency=USD&exchange_issuer=rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B
```


Response:

```
200 OK
{
    "result": "success",
    "count": 1,
    "rows": [
        {
            "components": [
                {
                    "count": 1711,
                    "rate": 5.514373809662552e-8,
                    "amount": 333.7038784107369,
                    "base": {
                        "currency": "BTC",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                    },
                    "counter": {
                        "currency": "XRP"
                    },
                    "converted_amount": 117720.99268355068
                },
                {
                    "count": 1977,
                    "rate": 0.000019601413454357618,
                    "amount": 74567.72531650064,
                    "base": {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                    },
                    "counter": {
                        "currency": "XRP"
                    },
                    "converted_amount": 74003.51871932109
                },

                ... (additional results trimmed) ...

                {
                    "count": 3,
                    "rate": 0.022999083584408355,
                    "amount": 85.40728674708998,
                    "base": {
                        "currency": "CNY",
                        "issuer": "razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA"
                    },
                    "counter": {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                    },
                    "converted_amount": 12.72863756671683
                },
                {
                    "count": 3,
                    "rate": 1.7749889023209692e-7,
                    "amount": 570.687912196755,
                    "base": {
                        "currency": "JPY",
                        "issuer": "r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN"
                    },
                    "counter": {
                        "currency": "BTC",
                        "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
                    },
                    "converted_amount": 4.4137945368632545
                }
            ],
            "count": 11105,
            "endTime": "2015-09-11T19:58:58+00:00",
            "exchange": {
                "currency": "USD",
                "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
            },
            "exchangeRate": 0.004410567085248279,
            "startTime": "2015-11-10T00:06:04+00:00",
            "total": 442442.5974313684
        }
    ]
}
```





## Get Payment Volume
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getMetric.js "Source")

Get aggregated payment volume for a given time period. _(New in [v2.0.4][])_

The API returns results in units of a single _display currency_ rather than many different currencies. The conversion uses standard rates to and from XRP.

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/payment_volume
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-payment-volume)

Optionally, you can provide the following query parameters:

| Field               | Value                      | Description               |
|:--------------------|:---------------------------|:--------------------------|
| `live`              | String                     | Return a live rolling window of this length of time. Valid values are `day`, `hour`, or `minute`. _(New in [v2.3.0][])_ |
| `exchange_currency` | String - [Currency Code][] | Normalize all amounts to use this as a display currency. If not XRP, `exchange_issuer` is also required. The default is XRP. |
| `exchange_issuer`   | String - [Address][]       | Normalize results to the specified `currency` issued by this issuer. |
| `format`            | String                     | Format of returned results: `csv` or `json`. The default is `json`. |

The `start`, `end`, `interval`, `limit`, and `marker` parameters have been removed in [v2.3.5][].

#### Response Format
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field    | Value                               | Description                 |
|:---------|:------------------------------------|:----------------------------|
| `result` | String                              | The value `success` indicates that this is a successful response. |
| `count`  | Integer                             | Number of results returned. |
| `rows`   | Array of payment [Volume Objects][] | Payment volumes for each interval in the requested time period. (By default, this array contains only the most recent interval. If `live` is specified and `interval` isn't, this array contains the specified rolling window instead.) |

Each object in the `components` array of the Volume Objects represent the volume of payments for one currencies and issuer, and has the following fields:

| Field              | Value                      | Description                |
|:-------------------|:---------------------------|:---------------------------|
| `currency`         | String - [Currency Code][] | The currency of this payment volume object. |
| `issuer`           | String - [Address][]       | (Omitted for XRP) The issuer of this payment volume object. |
| `amount`           | Number                     | Total payment volume for this currency during the interval, in units of the currency itself. |
| `count`            | Number                     | The total number of payments in this currency. |
| `rate`             | Number                     | The exchange rate between this currency and the display currency. |
| `converted_amount` | Number                     | Total payment volume for this currency, converted to the display currency. _(Before [v2.1.0][], this was `convertedAmount`.)_ |

#### Example

Request:

```
GET /v2/network/payment_volume
```

Response:

```
200 OK
{
    "result": "success",
    "count": 1,
    "rows": [
        {
            "components": [
                {
                    "currency": "USD",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "amount": 87279.59029136538,
                    "count": 331,
                    "rate": 0.004412045860957953,
                    "converted_amount": 19782113.1153009
                },
                {
                    "currency": "USD",
                    "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                    "amount": 0,
                    "count": 0,
                    "rate": 0.00451165816091143,
                    "converted_amount": 0
                },
                {
                    "currency": "BTC",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "amount": 279.03077460240354,
                    "count": 107,
                    "rate": 0.000013312520335244644,
                    "converted_amount": 20960026.169024874
                },

                ... (additional results trimmed) ...

                {
                    "currency": "MXN",
                    "issuer": "rG6FZ31hDHN1K5Dkbma3PSB5uVCuVVRzfn",
                    "amount": 49263.13280138676,
                    "count": 19,
                    "rate": 0.07640584677247926,
                    "converted_amount": 644756.0609868265
                },
                {
                    "currency": "XRP",
                    "amount": 296246369.30089426,
                    "count": 8691,
                    "rate": 1,
                    "converted_amount": 296246369.30089426
                }
            ],
            "count": 9388,
            "endTime": "2015-09-11T19:58:59+00:00",
            "exchange": {
                "currency": "XRP"
            },
            "exchangeRate": 1,
            "startTime": "2015-11-10T00:19:04+00:00",
            "total": 390754174.7837752
        }
    ]
}
```



## Get External Markets
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/externalMarkets.js "Source")

Get aggregated exchange volume from a list of off ledger exchanges for a specified rolling interval.

The API returns results in units of a single _display currency_ rather than many different currencies. The conversion uses standard rates to and from XRP.

#### Request Format ####

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/external_markets
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-external-markets)

Optionally, you can provide the following query parameters:

| Field               | Value                      | Description               |
|:--------------------|:---------------------------|:--------------------------|
| `period`            | String                     | Aggregation Period - valid intervals are `1hour`, `1day`, `3day`, `7day`, or `30day`. The default is `1day`. |
| `exchange_currency` | String - [Currency Code][] | Normalize all amounts to use this as a display currency. If not XRP, `exchange_issuer` is also required. The default is XRP. |
| `exchange_issuer`   | String - [Address][]       | Normalize results to the specified `currency` issued by this issuer. |


#### Response Format ####
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field         | Value  | Description                                         |
|:--------------|:-------|:----------------------------------------------------|
| `result`      | String | The value `success` indicates that this is a successful response. |
| `data`        | Object | Contains data for the specified period.             |
| `data.date`   | String | Date at which this period was calculated.           |
| `data.total`  | Number | Total XRP volume exchanged during the period.       |
| `data.period` | String | Name of the period queried.                         |

Each object in the `components` array of the Volume Objects represent the volume of a single external market.  Not all fields will be present for each market, depending on availability.

| Field              | Value  | Description                                    |
|:-------------------|:-------|:-----------------------------------------------|
| `source`           | String | Domain name of the specific external market.   |
| `base_volume`      | Number | Exchange volume in terms of the base currency (XRP). |
| `counter_volume`   | Number | Exchange volume in terms of the counter currency. |
| `base_currecy`     | String | Base currency of the market pair.              |
| `counter_currency` | String | Counter currency of the market pair.           |
| `rate`             | Number | Exchange rate.                                 |

#### Example ####

Request:

```
GET /v2/network/external_markets
```


Response:

```
200 OK

{
  "result": "success",
  "data": {
    "components": [
      {
        "base_volume": "52847221.256202064",
        "counter_volume": "619.8111371100003",
        "source": "poloniex.com",
        "base_currency": "XRP",
        "counter_currency": "BTC",
        "rate": "0.0000117284"
      },
      {
        "base_volume": "389955.29648717004",
        "counter_volume": "3212.07137265",
        "source": "poloniex.com",
        "base_currency": "XRP",
        "counter_currency": "USD",
        "rate": "0.00823702"
      },
      {
        "base_volume": "6025268.09143092",
        "counter_volume": "70.57870572291264",
        "count": 250,
        "source": "kraken.com",
        "base_currency": "XRP",
        "counter_currency": "BTC",
        "rate": "0.0000117138"
      },
      {
        "base_volume": "4141962.161763998",
        "source": "btc38.com",
        "base_currency": "XRP",
        "counter_currency": "CNY"
      },
      {
        "base_volume": "303505",
        "source": "btc38.com",
        "base_currency": "XRP",
        "counter_currency": "BTC"
      },
      {
        "base_volume": "1275008.2922999999",
        "source": "jubi.com",
        "base_currency": "XRP",
        "counter_currency": "CNY"
      }
    ],
    "date": "2016-10-31T20:45:20Z",
    "period": "1day",
    "total": "64982920.098184146"
  }
}
```



## Get XRP Distribution
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/xrpDistribution.js "Source")

Get information on the total amount of XRP in existence and in circulation, by weekly intervals. _(New in [v2.2.0][])_

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/xrp_distribution
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-xrp-distribution)

Optionally, you can provide the following query parameters:

| Field        | Value                  | Description                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | String - [Timestamp][] | Start time of query range. The default is the start of the most recent interval. |
| `end`        | String - [Timestamp][] | End time of query range. The default is the end of the most recent interval. |
| `limit`      | Integer                | Maximum results per page. The default is 200. Cannot be more than 1000. |
| `marker`     | String                 | [Pagination](#pagination) key from previously returned response. |
| `descending` | Boolean                | If `true`, return results in reverse chronological order. The default is `false`. |
| `format`     | String                 | Format of returned results: `csv` or `json`. The default is `json`. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field    | Value                         | Description                       |
|:---------|:------------------------------|:----------------------------------|
| `result` | String                        | The value `success` indicates that the body represents a successful response. |
| `count`  | Integer                       | Number of rows returned.          |
| `rows`   | Array of Distribution Objects | Weekly snapshots of the XRP distribution. |

Each Distribution Object has the following fields:

| Field           | Value                  | Description                       |
|:----------------|:-----------------------|:----------------------------------|
| `date`          | String - [Timestamp][] | The time of this snapshot.        |
| `total`         | String                 | Total XRP in existence.           |
| `undistributed` | String                 | Aggregate amount of XRP held by Ripple (the company). |
| `distributed`   | String                 | Aggregate amount of XRP held by others. |

#### Example

Request:

```
GET /v2/network/xrp_distribution
```

Response:

```
200 OK
{
  "result": "success",
  "count": 171,
  "rows": [
    {
      "date": "2016-04-10T00:00:00Z",
      "distributed": "34918644255.77274",
      "total": "99997725821.25714",
      "undistributed": "65079081565.4844"
    },
    ...
  ]
}
```



## Get Top Currencies
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/topCurrencies.js "Source")

Returns the top currencies on the XRP Ledger, ordered from highest rank to lowest. The ranking is determined by the volume and count of transactions and the number of unique counterparties. By default, returns results for the 30-day rolling window ending on the current date. You can specify a date to get results for the 30-day window ending on that date. _(New in [v2.1.0][])_


#### Request Format

<!-- MULTICODE_BLOCK_START -->

*Most Recent*

```
GET /v2/network/top_currencies
```

*By Date*

```
GET /v2/network/top_currencies/{date}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-top-currencies)

This method uses the following URL parameter:

| Field  | Value                  | Description                                |
|:-------|:-----------------------|:-------------------------------------------|
| `date` | String - ISO 8601 Date | _(Optional)_ Historical date to query. If omitted, use the most recent date available. |

Optionally, you can provide the following query parameters:

| Field    | Value   | Description                                             |
|:---------|:--------|:--------------------------------------------------------|
| `limit`  | Integer | Maximum results per page. The default is 1000. Cannot be more than 1000. |
| `format` | String  | Format of returned results: `csv` or `json`. The default is `json`. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field        | Value                         | Description                   |
|:-------------|:------------------------------|:------------------------------|
| `result`     | String                        | The value `success` indicates that this is a successful response. |
| `date`       | String - [Timestamp][]        | When this data was measured.  |
| `count`      | Integer                       | Number of objects in the `currencies` field. |
| `currencies` | Array of Top Currency Objects | The top currencies for this data sample. Each member represents one currency, by currency code and issuer. |

Each Top Currency Object has the following fields:

| Field                 | Value                      | Description             |
|:----------------------|:---------------------------|:------------------------|
| `currency`            | String - [Currency Code][] | The currency this object describes. |
| `issuer`              | String - [Address][]       | The XRP Ledger address that issues this currency. |
| `avg_exchange_count`  | [String - Number][]        | Daily average number of [exchanges](#exchange-objects). |
| `avg_exchange_volume` | [String - Number][]        | Daily average volume of exchanges, normalized to XRP. |
| `avg_payment_count`   | [String - Number][]        | Daily average number of [payments](#payment-objects). |
| `avg_payment_volume`  | [String - Number][]        | Daily average volume of payments, normalized to XRP. |
| `issued_value`        | [String - Number][]        | Total amount of this currency issued by this issuer, normalized to XRP. |

#### Example

Request:

```
GET /v2/network/top_currencies/2016-04-14?limit=2
```

Response:

```
200 OK
{
  "result": "success",
  "date": "2016-04-14T00:00:00Z",
  "count": 2,
  "currencies": [
    {
      "avg_exchange_count": "8099.967741935484",
      "avg_exchange_volume": "3.5952068085531615E7",
      "avg_payment_count": "624.28125",
      "avg_payment_volume": "3910190.139488101",
      "issued_value": "1.5276205395328993E8",
      "currency": "CNY",
      "issuer": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y"
    },
    {
      "avg_exchange_count": "3003.2258064516127",
      "avg_exchange_volume": "3.430482029838605E7",
      "avg_payment_count": "257.4375",
      "avg_payment_volume": "501442.0789529095",
      "issued_value": "2.6289124450524995E8",
      "currency": "USD",
      "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    }
  ]
}
```



## Get Top Markets
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/topMarkets.js "Source")

Returns the top exchange markets on the XRP Ledger, ordered from highest rank to lowest. The rank is determined by the number and volume of exchanges and the number of counterparties participating. By default, returns top markets for the 30-day rolling window ending on the current date. You can specify a date to get results for the 30-day window ending on that date. _(New in [v2.1.0][])_

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*Most Recent*

```
GET /v2/network/top_markets
```

*By Date*

```
GET /v2/network/top_markets/{date}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-top-markets)

This method uses the following URL parameter:

| Field  | Value                  | Description                                |
|:-------|:-----------------------|:-------------------------------------------|
| `date` | String - ISO 8601 Date | _(Optional)_ Historical date to query. If omitted, use the most recent date available. |

Optionally, you can provide the following query parameters:

| Field    | Value   | Description                                             |
|:---------|:--------|:--------------------------------------------------------|
| `limit`  | Integer | Maximum results per page. The default is 1000. Cannot be more than 1000. |
| `format` | String  | Format of returned results: `csv` or `json`. The default is `json`. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field     | Value                       | Description                        |
|:----------|:----------------------------|:-----------------------------------|
| `result`  | String                      | The value `success` indicates that this is a successful response. |
| `date`    | String - [Timestamp][]      | The end of the rolling window over which this data was calculated. |
| `count`   | Integer                     | Number of results in the `markets` field. |
| `markets` | Array of Top Market Objects | The top markets for this data sample. Each member represents a currency pair. |

Each Top Market object has the following fields:

| Field                | Value                      | Description              |
|:---------------------|:---------------------------|:-------------------------|
| `base_currency`      | String - [Currency Code][] | The base currency for this market. |
| `base_issuer`        | String - [Address][]       | (Omitted if `base_currency` is XRP) The XRP Ledger address that issues the base currency. |
| `counter_currency`   | String - [Currency Code][] | The counter currency for this market. |
| `counter_issuer`     | String - [Address][]       | (Omitted if `counter_currency` is XRP) The XRP Ledger address that issues the counter currency. |
| `avg_base_volume`    | String                     | Daily average volume in terms of the base currency. |
| `avg_counter_volume` | String                     | Daily average volume in terms of the counter currency. |
| `avg_exchange_count` | String                     | Daily average number of [exchanges](#exchange-objects). |
| `avg_volume`         | String                     | Daily average volume, normalized to XRP. |

#### Example

Request:

```
GET /v2/network/top_markets/2015-12-31
```

Response:

```
200 OK
{
  "result": "success",
  "date": "2015-12-31T00:00:00Z",
  "count": 58,
  "markets": [
    {
      "avg_base_volume": "116180.98607935428",
      "avg_counter_volume": "1.6657039295476614E7",
      "avg_exchange_count": "1521.4603174603174",
      "avg_volume": "1.6657039295476614E7",
      "base_currency": "USD",
      "base_issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
      "counter_currency": "XRP"
    },
    {
      "avg_base_volume": "410510.0286920887",
      "avg_counter_volume": "9117398.719214212",
      "avg_exchange_count": "1902.1587301587301",
      "avg_volume": "9117398.719214212",
      "base_currency": "CNY",
      "base_issuer": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
      "counter_currency": "XRP"
    },
    ...
  ]
}
```



## Get Transaction Costs
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getFees.js "Source")

Returns [transaction cost](transaction-cost.html) stats per ledger, hour, or day.  The data shows the average, minimum, maximum, and total transaction costs paid for the given interval or ledger. _(New in [v2.2.0][])_

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/fees
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-transaction-costs)

Optionally, you can provide the following query parameters:

| Field        | Value                  | Description                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | String - [Timestamp][] | Start time of query range. The default is to start from the earliest data available. |
| `end`        | String - [Timestamp][] | End time of query range. The default is to start from the latest data available. |
| `interval`   | String                 | Aggregation interval - valid intervals are `ledger`, `hour`, or `day`. The default is `ledger`. |
| `descending` | Boolean                | If `true`, sort results with most recent first. By default, sort results with oldest first. |
| `limit`      | Integer                | Maximum results per page. The default is 200. Cannot be more than 1000. |
| `marker`     | String                 | [Pagination](#pagination) key from previously returned response. |
| `format`     | String                 | Format of returned results: `csv` or `json`. The default is `json`. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field    | Value                        | Description                        |
|:---------|:-----------------------------|:-----------------------------------|
| `result` | String                       | The value `success` indicates that this is a successful response. |
| `marker` | String                       | (May be omitted) [Pagination](#pagination) marker. |
| `count`  | Integer                      | Number of results in the `markets` field. |
| `rows`   | Array of Fee Summary Objects | Transaction cost statistics for each interval. |

Each Fee Summary object has the following fields:

| Field          | Value                      | Description                    |
|:---------------|:---------------------------|:-------------------------------|
| `avg`          | Number                     | Average transaction cost paid in this interval. |
| `min`          | Number                     | Minimum  transaction cost paid in this interval. |
| `max`          | Number                     | Maximum  transaction cost paid in this interval. |
| `total`        | Number                     | Total XRP destroyed by transaction costs. |
| `tx_count`     | Number                     | Number of transactions in this interval. |
| `date`         | String - [Timestamp][]     | The start time of this interval (time intervals), or the close time of this ledger (`ledger` interval). |
| `ledger_index` | Integer - [Ledger Index][] | (Only present in `ledger` interval) The ledger this object describes. |

#### Example

Request:

```
GET /v2/network/fees?interval=day&limit=3&descending=true
```

Response:

```
200 OK
{
  "result": "success",
  "marker": "day|20160603000000",
  "count": 3,
  "rows": [
    {
      "avg": 0.011829,
      "max": 15,
      "min": 0.01,
      "total": 6682.15335,
      "tx_count": 564918,
      "date": "2016-06-06T00:00:00Z"
    },
    {
      "avg": 0.011822,
      "max": 4.963071,
      "min": 0.01,
      "total": 5350.832025,
      "tx_count": 452609,
      "date": "2016-06-05T00:00:00Z"
    },
    {
      "avg": 0.012128,
      "max": 15,
      "min": 0.01,
      "total": 5405.126404,
      "tx_count": 445689,
      "date": "2016-06-04T00:00:00Z"
    }
  ]
}
```




## Get Fee Stats
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getFeeStats.js "Source")

Returns snapshots of the metrics derived from `rippled`'s [`fee` command](fee.html). _(New in [v2.3.2][])_

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/fee_stats
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-fee-stats)

Optionally, you can provide the following query parameters:

| Field        | Value                  | Description                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | String - [Timestamp][] | Start time of query range. The default is to start from the earliest data available. |
| `end`        | String - [Timestamp][] | End time of query range.The default is to end at the latest data available. |
| `interval`   | String                 | The interval of the snapshots. Valid intervals are `minute`, `hour`, or `day`. Default interval is 5 seconds. |
| `descending` | Boolean                | If `true`, sort results with most recent first. By default, sort results with oldest first. |
| `limit`      | Integer                | Maximum results per page. The default is 200. Cannot be more than 1000. |
| `marker`     | String                 | [Pagination](#pagination) key from previously returned response. |
| `format`     | String                 | Format of returned results: `csv` or `json`. The default is `json`. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field    | Value                        | Description                        |
|:---------|:-----------------------------|:-----------------------------------|
| `result` | String                       | The value `success` indicates that this is a successful response. |
| `marker` | String                       | (May be omitted) [Pagination](#pagination) marker. |
| `count`  | Integer                      | Number of results in the `markets` field. |
| `rows`   | Array of Fee Summary Objects | Transaction cost statistics for each interval. |

Each **Fee Summary Object** has the following fields:

| Field                  | Value                  | Description                |
|:-----------------------|:-----------------------|:---------------------------|
| `date`                 | String - [Timestamp][] | The date-time this snapshot was taken. |
| `current_ledger_size`  | Number                 | Number of transactions in the current ledger at the specified time. |
| `expected_ledger_size` | Number                 | Number of transactions expected in the next ledger at the specified time. |
| `current_queue_size`   | Number                 | Number of transactions queued for inclusion in future ledgers. |
| `pct_max_queue_size`   | Number                 | current queue size in terms of percentage of maximum queue size. |
| `median_fee`           | Number                 | Median fee of transactions in the current ledger. |
| `minimum_fee`          | Number                 | Minimum fee for inclusion in any ledger. |
| `open_ledger_fee`      | Number                 | Cost threshold for inclusion in the ledger open at the time of the snapshot. |

#### Example

Request:

```
GET /v2/network/fee_stats
```

Response:

```
200 OK
{
  result: "success",
  marker: "raw|20160701032100",
  count: 200,
  rows: [
    {
      current_ledger_size: 39,
      current_queue_size: 0,
      date: "2016-07-01T00:00:00Z",
      expected_ledger_size: 59,
      median_fee: 0.005,
      minimum_fee: 0.00001,
      open_ledger_fee: 0.00001,
      pct_max_queue_size: 0
    },
    {
      current_ledger_size: 33,
      current_queue_size: 0,
      date: "2016-07-01T00:01:00Z",
      expected_ledger_size: 59,
      median_fee: 0.00543,
      minimum_fee: 0.00001,
      open_ledger_fee: 0.00001,
      pct_max_queue_size: 0
    },
    ...
  ]
}
```




## Get Topology
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getTopology.js "Source")

Get known `rippled` servers and peer-to-peer connections between them. _(New in [v2.2.0][])_


#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/topology
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-topology)

Optionally, you can provide the following query parameters:

| Field     | Value                  | Description                             |
|:----------|:-----------------------|:----------------------------------------|
| `date`    | String - [Timestamp][] | Date and time for historical query. By default, uses the most recent data available. |
| `verbose` | Boolean                | If `true`, include additional details about each server where available. The default is `false`. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field        | Value                       | Description                     |
|:-------------|:----------------------------|:--------------------------------|
| `result`     | String                      | The value `success` indicates that the body represents a successful response. |
| `date`       | String - [Timestamp][]      | The time of this measurement.   |
| `node_count` | Integer                     | Number of `rippled` servers in the topology. |
| `link_count` | Integer                     | Number of links in the topology. |
| `nodes`      | Array of [Server Objects][] | Details of `rippled` servers in the peer-to-peer network. |
| `links`      | Array of [Link Objects][]   | Network connections between `rippled` servers in the peer-to-peer network. |

#### Example

Request:

```
GET /v2/network/topology
```

Response:

```
200 OK
{
  "result": "success",
  "date": "2016-06-06T23:51:04Z",
  "node_count": 115,
  "link_count": 1913,
  "nodes": [
    {
      "node_public_key": "n94fDXS3ta92gRSi7DKngh47S7Rg4z1FuNsahvbiakFEg51dLeVa",
      "version": "rippled-0.31.0-rc1",
      "uptime": 266431,
      "inbound_count": 24,
      "last_updated": "2016-06-03T21:50:57Z"
    },
    {
      "node_public_key": "n94h5KNspwUGLaGcdHGxruYNmExWHjPkLcMvwsNrivR9czRp6Lor",
      "ip": "104.247.221.178",
      "port": 51235,
      "version": "rippled-0.31.0",
      "uptime": 608382,
      "inbound_count": 10,
      "outbound_count": 11,
      "city": "Atlanta",
      "country": "United States",
      "country_code": "US",
      "isp": "QuickPacket, LLC",
      "last_updated": "2016-05-28T06:29:43Z",
      "lat": "-84.3846",
      "long": "33.8379",
      "postal_code": "30305",
      "region": "Georgia",
      "region_code": "GA",
      "timezone": "America/New_York"
    },

    ...
  ],
  "links": [
    {
      "source": "n94Extku8HiQVY8fcgxeot4bY7JqK2pNYfmdnhgf6UbcmgucHFY8",
      "target": "n9KcFAX2bCuwF4vGF8gZZcpQQ6nyqm44e5TUygb3zvdZEpiJE5As"
    },
    {
      "source": "n94Extku8HiQVY8fcgxeot4bY7JqK2pNYfmdnhgf6UbcmgucHFY8",
      "target": "n9LGAj7PjvfTmEGQ75JaRKba6GQmVwFCnJTSHgX2HDXzxm6d2JpM"
    },

    ...
  ]
}
```



## Get Topology Nodes
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getNodes.js "Source")

Get known `rippled` nodes. (This is a subset of the data returned by the [Get Topology method](#get-topology).) _(New in [v2.2.0][])_

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/topology/nodes
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-topology-nodes)

Optionally, you can provide the following query parameters:

| Field     | Value                  | Description                             |
|:----------|:-----------------------|:----------------------------------------|
| `date`    | String - [Timestamp][] | Date and time for historical query. The default is most recent data. |
| `verbose` | Boolean                | If `true`, return full details for each server. The default is `false`. |
| `format`  | String                 | Format of returned results: `csv` or `json`. The default is `json`. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field    | Value                       | Description                         |
|:---------|:----------------------------|:------------------------------------|
| `result` | String                      | The value `success` indicates that the body represents a successful response. |
| `date`   | String - [Timestamp][]      | When this the data was measured.    |
| `count`  | Integer                     | Number of `rippled` servers described. |
| `nodes`  | Array of [Server Objects][] | Details of the `rippled` servers in the topology. |

#### Example

Request:

```
GET /v2/network/topology/nodes
```

Response:

```
200 OK
{
  "result": "success",
  "date": "2016-06-08T00:36:53Z",
  "count": 116,
  "nodes": [
    {
      "node_public_key": "n94BuARkPiYLrMuAVZqMQFhTAGpo12dqUPiH3yrzEnhaEcXfLAnV",
      "version": "rippled-0.30.1",
      "uptime": 122424,
      "inbound_count": 10,
      "last_updated": "2016-06-06T14:36:52Z"
    },
    {
      "node_public_key": "n94h5KNspwUGLaGcdHGxruYNmExWHjPkLcMvwsNrivR9czRp6Lor",
      "ip": "104.247.221.178",
      "port": 51235,
      "version": "rippled-0.31.2",
      "uptime": 38649,
      "inbound_count": 10,
      "outbound_count": 11,
      "city": "Atlanta",
      "country": "United States",
      "country_code": "US",
      "isp": "QuickPacket, LLC",
      "last_updated": "2016-06-07T13:53:12Z",
      "lat": "-84.3846",
      "long": "33.8379",
      "postal_code": "30305",
      "region": "Georgia",
      "region_code": "GA",
      "timezone": "America/New_York"
    },

    ...

  ]
}
```



## Get Topology Node
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getNodes.js "Source")

Get information about a single `rippled` server by its [node public key](#public-keys) (not validator public key). _(New in [v2.2.0][])_

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/topology/nodes/{pubkey}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-topology-node)

This method requires the following URL parameters:

| Field    | Value                           | Description                     |
|:---------|:--------------------------------|:--------------------------------|
| `pubkey` | String - Base-58 [Public Key][] | Node public key of the server to look up. |

This method takes no query parameters.

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with a **[Server Object][]** in the response with the following additional field:

| Field    | Value  | Description                                              |
|:---------|:-------|:---------------------------------------------------------|
| `result` | String | The value `success` indicates that this is a successful response. |

#### Example

Request:

```
GET /v2/network/topology/nodes/n94h5KNspwUGLaGcdHGxruYNmExWHjPkLcMvwsNrivR9czRp6Lor
```

Response:

```
200 OK
{
  "node_public_key": "n94h5KNspwUGLaGcdHGxruYNmExWHjPkLcMvwsNrivR9czRp6Lor",
  "ip": "104.247.221.178",
  "port": 51235,
  "version": "rippled-0.31.2",
  "uptime": 43342,
  "inbound_count": 10,
  "outbound_count": 11,
  "city": "Atlanta",
  "country": "United States",
  "country_code": "US",
  "isp": "QuickPacket, LLC",
  "last_updated": "2016-06-07T13:53:12Z",
  "lat": "-84.3846",
  "long": "33.8379",
  "postal_code": "30305",
  "region": "Georgia",
  "region_code": "GA",
  "timezone": "America/New_York",
  "result": "success"
}
```



## Get Topology Links
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getLinks.js "Source")

Get information on peer-to-peer connections between `rippled` servers. (This is a subset of the data returned by the [Get Topology method](#get-topology).) _(New in [v2.2.0][])_

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/topology/links
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-topology-links)

Optionally, you can provide the following query parameters:

| Field    | Value                  | Description                              |
|:---------|:-----------------------|:-----------------------------------------|
| `date`   | String - [Timestamp][] | Date and time for historical query. The default is the most recent data available. |
| `format` | String                 | Format of returned results: `csv` or `json`. The default is `json`. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field    | Value                     | Description                           |
|:---------|:--------------------------|:--------------------------------------|
| `result` | String                    | The value `success` indicates that the body represents a successful response. |
| `date`   | String - [Timestamp][]    | When this data was measured.          |
| `count`  | Integer                   | Number of links returned.             |
| `links`  | Array of [Link Objects][] | Links between `rippled` servers.      |

#### Example

Request:

```
GET /v2/network/topology/links
```

Response:

```
200 OK
{
  result: "success",
  date: "2016-03-21T16:38:52Z",
  count: 1632,
  links: [
    {
      source: "n94Extku8HiQVY8fcgxeot4bY7JqK2pNYfmdnhgf6UbcmgucHFY8",
      target: "n9JccBLfrDJBLBF2X5N7bUW8251riCwSf9e3VQ3P5fK4gYr5LBu4"
    },
    ...
  ]
}
```



## Get Validator
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getValidators.js "Source")

Get details of a single validator in the [consensus network](consensus.html). _(Updated in [v2.4.0][])_


#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/validators/{pubkey}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-validator)

This method requires the following URL parameters:

| Field    | Value                           | Description           |
|:---------|:--------------------------------|:----------------------|
| `pubkey` | String - Base-58 [Public Key][] | Validator public key. |

Optionally, you can provide the following query parameters:

| Field    | Value  | Description                                              |
|:---------|:-------|:---------------------------------------------------------|
| `format` | String | Format of returned results: `csv` or `json`. The default is `json`. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field                   | Value                           | Description      |
|:------------------------|:--------------------------------|:-----------------|
| `result`                | String                          | The value `success` indicates that the body represents a successful response. |
| `validation_public_key` | String - Base-58 [Public Key][] | This validator's validator public key. |
| `domain`                | String                          | (May be omitted) The DNS domain associated with this validator. |
| `chain`                 | String                          | Ledger hash chain which this validator is currently following. The value `main` indicates the main network and `altnet` indicates the XRP Test Network. Other forks are named `chain.{NUMBER}`, where `{NUMBER}` is a unique number for each fork. |
| `unl`                   | Bool                            | True if the validator is part of the ledger chain's recommended UNL. |
| `current_index`         | Number                          | Ledger index of most recently validated ledger. |
| `partial`               | Bool                            | True if the most recent validation was a partial one. |
| `agreement_1h`          | Agreement Object                | Object containing agreement stats for the most recent hour. |
| `agreement_24h`         | Agreement Object                | Object containing agreement stats for the most recent 24 hour period. |

#### Agreement Objects

| Field                   | Value                           | Description      |
|:------------------------|:--------------------------------|:-----------------|
| `score`                 | String                          | Score of agreement with the ledger chain being followed. |
| `missed`                | Integer                         | Number of ledgers not validated during the time period. |
| `total`                 | Integer                         | Number of ledgers that could have been validated during the time period. |
| `incomplete`            | Bool                            | True indicates the data does not cover the entire time period. |

#### Example

Request:

```
GET /v2/network/validators/nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec
```

Response:

```
200 OK
{
  "validation_public_key": "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
  "domain": "bitso.com",
  "chain": "main",
  "current_index": 42279525,
  "agreement_1h": {
    "missed": 0,
    "total": 981,
    "score": "1.0000",
    "incomplete": false
  },
  "agreement_24h": {
    "missed": 0,
    "total": 23519,
    "score": "1.0000",
    "incomplete": false
  },
  "partial": false,
  "unl": true,
  "result": "success"
}
```



## Get Validators
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getValidators.js "Source")

Get a list of known validators active in the last 24 hours. _(Updated in [v2.4.0][])_


#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/validators
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-validators)

Optionally, you can provide the following query parameters:

| Field    | Value  | Description                                              |
|:---------|:-------|:---------------------------------------------------------|
| `format` | String | Format of returned results: `csv` or `json`. The default is `json`. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field                   | Value                           | Description      |
|:------------------------|:--------------------------------|:-----------------|
| `result`                | String                          | The value `success` indicates that the body represents a successful response. |
| `count`                 | Integer                         | Number of validators returned. |
| `validators`            | Array of [Validator Objects][]  | List of validators active in the last 24 hours. |

#### Validator Objects
[Validator Objects]: #validator-objects

| Field                   | Value                           | Description      |
|:------------------------|:--------------------------------|:-----------------|
| `validation_public_key` | String - Base-58 [Public Key][] | This validator's validator public key. |
| `domain`                | String                          | (May be omitted) The DNS domain associated with this validator. |
| `chain`                 | String                          | Ledger hash chain which this validator is currently following. The value `main` indicates the main network and `altnet` indicates the XRP Test Network. Other forks are named `chain.{NUMBER}`, where `{NUMBER}` is a unique number for each fork. |
| `unl`                   | Bool                            | True if the validator is part of the ledger chain's recommended UNL. |
| `current_index`         | Number                          | Ledger index of most recently validated ledger. |
| `partial`               | Bool                            | True if the most recent validation was a partial one. |
| `agreement_1h`          | Agreement Object                | Object containing agreement stats for the most recent hour. |
| `agreement_24h`        | Agreement Object                | Object containing agreement stats for the most recent 24 hour period. |

#### Agreement Objects

| Field                   | Value                           | Description      |
|:------------------------|:--------------------------------|:-----------------|
| `score`                 | String                          | Score of agreement with the ledger chain being followed. |
| `missed`                | Integer                         | Number of ledgers not validated during the time period. |
| `total`                 | Integer                         | Number of ledgers that could have been validated during the time period. |
| `incomplete`            | Bool                            | True indicates the data does not cover the entire time period. |

#### Example

Request:

```
GET /v2/network/validators/
```

Response:

```
200 OK
{
  "result": "success",
  "count": 141,
  "validators": [
    {
      "validation_public_key": "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
      "domain: "bitso.com",
      "chain": "main",
      "current_index": 42281151,
      "agreement_1h": {
        "missed": 0,
        "total": 1029,
        "score": "1.0000",
        "incomplete": false
      },
      "agreement_24h": {
        "missed": 0,
        "total": 23585,
        "score": "1.0000",
        "incomplete": false
      },
      "partial": false,
      "unl": true
    },
    {
      "validation_public_key": "nHUStq4qu3NXaL6T42wbtpR8mare8gWMVYrUzek227c6QeUn6QGN",
      "domain": "blockchain.korea.ac.kr",
      "chain": "main",
      "current_index": 42860792,
      "agreement_1h": {
        "missed": 0,
        "total": 995,
        "score": "1.0000",
        "incomplete": false
      },
      "agreement_24h": {
        "missed": 0,
        "total": 23478,
        "score": "1.0000",
        "incomplete": false
      },
      "partial": false,
      "unl": true
    },

    ...
  ]
}
```



## Get Validator Manifests
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getManifests.js "Source")

Retrieve manifests signed by a specified validator. (Manifests, also called _subkey authorizations_, designate the ephemeral key a validator uses to sign proposals and validations.) _(New in [v2.3.7][])_

**Note:** The Data API does not have a comprehensive record of all manifests. The response only includes data that the Data API has recorded.

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/validators/{pubkey}/manifests
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-validator-manifests)

This method requires the following URL parameters:

| Field     | Value                           | Description           |
|:----------|:--------------------------------|:----------------------|
| `pubkey`  | String - Base-58 [Public Key][] | Validator public key. |

Optionally, you can provide the following query parameters:

| Field    | Value   | Description                                             |
|:---------|:--------|:--------------------------------------------------------|
| `limit`  | Integer | Maximum results per page. Defaults to 200. Cannot be more than 1000. |
| `marker` | String  | [Pagination](#pagination) key from previously returned response. |
| `format` | String  | Format of returned results: `csv` or `json`. Defaults to `json`. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field       | Value                         | Description                    |
|:------------|:------------------------------|:-------------------------------|
| `result`    | String                        | The value `success` indicates that the body represents a successful response. |
| `count`     | Integer                       | Number of manifests returned.  |
| `marker`    | String                        | (May be omitted) [Pagination](#pagination) marker. |
| `manifests` | Array of [Manifest Objects][] | The requested manifests.       |

#### Manifest Objects
[Manifest Objects]: #manifest-objects

Each manifest object contains the following:

| Field                  | Value                           | Description       |
|:-----------------------|:--------------------------------|:------------------|
| `count`                | Number                          | How many times the Data API has seen this manifest. Lower numbers mean the manifest is more recent. |
| `ephemeral_public_key` | String - Base-58 [Public Key][] | The ephemeral public key for this validator encoded in this manifest. |
| `first_datetime`       | String - [Timestamp][]          | The time the Data API first saw this manifest. |
| `last_datetime`        | String - [Timestamp][]          | The time the Data API most recently saw this manifest. |
| `master_public_key`    | String - Base-58 [Public Key][] | The master public key that identifies this validator. |
| `master_signature`     | String - Hexadecimal            | Signature from the validator master key authorizing this manifest. |
| `sequence`             | Number                          | The sequence number of this manifest. Higher-sequence manifests replace older manifests, rotating the ephemeral keys. |
| `signature`            | String - Hexadecimal            | Signature from ephemeral key authorized by this manifest. |

#### Example

Request:

```
GET /v2/network/validator/nHDEmQKb2nbcewdQ1fqCTGcPTcePhJ2Rh6MRftsCaf6UNRQLv7pB/manifests
```

Response:

```
200 OK
{
  "result": "success",
  "count": 2,
  "manifests": [
    {
      "count": 1,
      "ephemeral_public_key": "nHUvPMeNsrwdJd7d65eaYGkKx6bPEcxJGudjVDqwCybtEfrSUE8w",
      "first_datetime": "2018-09-06T20:20:08.353Z",
      "last_datetime": "2018-09-06T20:20:08.353Z",
      "master_public_key": "nHDEmQKb2nbcewdQ1fqCTGcPTcePhJ2Rh6MRftsCaf6UNRQLv7pB",
      "master_signature":
        "D8E78AD2C10ADA5A91D673C2EA66045926D3ED3D4C77DE4350AAA076379F69B8D0EC492A626EA9228964F694EED9EC63394D051001BA432EC57F2B6031204806",
      "sequence": "1",
      "signature":
        "C794C3D1159932FF8EE7360074E7D17CB59F6646B227EF35D439892C00832648C46FD1958714E153AF4BD0540A7B27011B7F58D357B68B87DCBF5CA81874480C"
    },
    {
      "count": 1,
      "ephemeral_public_key": "n9M7mktkbZCnKWa41LFkZsfXemBGdYsFT6fqJBXa4xupV8X8px7W",
      "first_datetime": "2018-09-06T20:20:08.357Z",
      "last_datetime": "2018-09-06T20:20:08.357Z",
      "master_public_key": "nHDEmQKb2nbcewdQ1fqCTGcPTcePhJ2Rh6MRftsCaf6UNRQLv7pB",
      "master_signature":
        "F7ECCB90F84ED3FC5E0DE1A6B0B7E835A8D2A94C8E985A74932DE30CD2EDCB46936FD14C39A5AA1BB3583CF888C869167979FEE068C6C34B9B63AB922850090E",
      "sequence": "2",
      "signature":
        "3044022055ED7EFF1245DE21D3C28C57D19301291F0D617CA3A6D3D4CFDF8692D9E0E68502200276215BA986BA61834E0AC71E8590706C851B8F55F0B80A44EECE868F71415F"
    }
  ]
}
```


## Get Single Validator Reports
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getValidatorReports.js "Source")

Get a single validator's validation vote stats for 24-hour intervals. _(Updated in [v2.4.0][])_

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/validators/{pubkey}/reports
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-single-validator-reports)

This method requires the following URL parameters:

| Field    | Value  | Description           |
|:---------|:-------|:----------------------|
| `pubkey` | String | Validator public key. |

Optionally, you can provide the following query parameters:

| Field    | Value                  | Description                              |
|:---------|:-----------------------|:-----------------------------------------|
| `start`      | String - [Timestamp][] | Start date and time for historical query. The default is to start 200 days before the current date. |
| `end`        | String - [Timestamp][] | End date and time for historical query. The default is to end with the most recent data available. |
| `descending` | Bool                   | Return results in reverse order. |
| `format`     | String                 | Format of returned results: `csv` or `json`. The default is `json`. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field        | Value                                    | Description        |
|:-------------|:-----------------------------------------|:-------------------|
| `result`     | String                                   | The value `success` indicates that the body represents a successful response. |
| `count`      | Integer                                  | Number of validator daily reports returned. |
| `reports`    | Array of [Single Validator Report Objects][] | Daily reports of each validator's performance on that day. |

##### Single Validator Report Objects
[Single Validator Report Objects]: #single-validator-report-objects

Each Single Validator Report Object describes a validator's performance on a given day and has the following fields:

| Field                | Value                           | Description                  |
|:---------------------|:--------------------------------|:-----------------------------|
| `validation_public_key` | String - Base-58 [Public Key][] | Validator public key. |
| `date`               | String - [Timestamp][]          | The start time of the date this object describes. |
| `chain`              | String                          | Ledger hash chain which this validator is currently following. The value `main` indicates the main network and `altnet` indicates the XRP Test Network. Other forks are named `chain.{NUMBER}`, where `{NUMBER}` is a unique number for each fork. |
| `score`              | String                          | Score of agreement with the ledger chain being followed. |
| `missed`             | Integer                         | Number of ledgers not validated during the time period. |
| `total`              | Integer                         | Number of ledgers that could have been validated during the time period. |
| `incomplete`         | Bool                            | True indicates the data does not cover the entire time period. |

#### Example

Request:

```
GET /v2/network/validators/n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7/reports
```

Response:

```
200 OK
{
  "result": "success",
  "count": 198,
  "reports": [
    {
      "date": "2015-11-20T00:00:00Z",
      "total_ledgers": 19601,
      "main_net_agreement": "1.0",
      "main_net_ledgers": 19601,
      "alt_net_agreement": "0.0",
      "alt_net_ledgers": 0,
      "other_ledgers": 0
    },
    {
      "date": "2015-11-21T00:00:00Z",
      "total_ledgers": 19876,
      "main_net_agreement": "1.0",
      "main_net_ledgers": 19876,
      "alt_net_agreement": "0.0",
      "alt_net_ledgers": 0,
      "other_ledgers": 0
    },

    ...
  ]
}
```


## Get Daily Validator Reports
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getValidatorReports.js "Source")

Get validation vote stats and validator information for all known validators in a 24-hour period.

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/validator_reports
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-daily-validator-reports)

Optionally, you can provide the following query parameters:

| Field    | Value                  | Description                              |
|:---------|:-----------------------|:-----------------------------------------|
| `date`   | String - [Timestamp][] | Date and time to query. By default, uses the most recent data available. |
| `format` | String                 | Format of returned results: `csv` or `json`. The default is `json`. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field     | Value                                   | Description            |
|:----------|:----------------------------------------|:-----------------------|
| `result`  | String                                  | The value `success` indicates that the body represents a successful response. |
| `count`   | Integer                                 | Number of reports returned. |
| `reports` | Array of [Daily Validator Report Objects][] | Daily summaries of validator performance for each validator active during this time period. |

#### Daily Validator Report Objects
[Daily Validator Report Objects]: #daily-validator-report-objects

Each member in the `reports` array describes one validator's performance on that day and has the following fields:

| Field                | Value                           | Description                  |
|:---------------------|:--------------------------------|:-----------------------------|
| `validation_public_key` | String - Base-58 [Public Key][] | Validator public key. |
| `date`               | String - [Timestamp][]          | The start time of the date this object describes. |
| `chain`              | String                          | Ledger hash chain which this validator is currently following. The value `main` indicates the main network and `altnet` indicates the XRP Test Network. Other forks are named `chain.{NUMBER}`, where `{NUMBER}` is a unique number for each fork. |
| `score`              | String                          | Score of agreement with the ledger chain being followed. |
| `missed`             | Integer                         | Number of ledgers not validated during the time period. |
| `total`              | Integer                         | Number of ledgers that could have been validated during the time period. |
| `incomplete`         | Bool - Optional                 | True indicates the data does not cover the entire time period. |

#### Example

Request:

```
GET /v2/network/validator_reports
```

Response:

```
200 OK
{
  "result": "success",
  "count": 27,
  "reports": [
    {
      "validation_public_key": "n9J2N3FfiUFC4rBX5UBob8JzgDGsYqUou1cwKdsaymS44mZDfnYe",
      "date": "2018-10-15T00:00:00Z",
      "chain": "main",
      "score": "0.6909",
      "total": "16127",
      "missed": "7216"
    }
  ]
}
```


## Get rippled Versions
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getVersions.js "Source")

Reports the latest versions of `rippled` available from the official Ripple Yum repositories. _(New in [v2.3.0][].)_

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/rippled_versions
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-rippled-versions)


#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field    | Value                    | Description                            |
|:---------|:-------------------------|:---------------------------------------|
| `result` | String                   | The value `success` indicates that the body represents a successful response. |
| `count`  | Integer                  | Number of rows returned.               |
| `rows`   | Array of Version Objects | Description of the latest `rippled` version in each repository. |

Each Version Object contains the following fields:

| Field     | Value                  | Description                             |
|:----------|:-----------------------|:----------------------------------------|
| `date`    | String - [Timestamp][] | The date this `rippled` version was released. |
| `repo`    | String                 | The Yum repository where this `rippled` is available. The `stable` repository has the latest production version. Other versions are for development and testing. |
| `version` | String                 | The version string for this version of `rippled`. |

#### Example

Request:

```
GET /v2/network/rippled_versions
```

Response:

```
200 OK
{
  "result": "success",
  "count": 3,
  "rows": [
    {
      "date": "2016-06-24T00:00:00Z",
      "repo": "nightly",
      "version": "0.32.0-rc2"
    },
    {
      "date": "2016-06-24T00:00:00Z",
      "repo": "stable",
      "version": "0.32.0"
    },
    {
      "date": "2016-06-24T00:00:00Z",
      "repo": "unstable",
      "version": "0.32.0-rc1"
    }
  ]
}
```



## Get All Gateways
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/gateways.js "Source")

Get information about [known gateways](https://github.com/ripple/rippled-historical-database/blob/v2.0.4/api/gateways/gateways.json). _(New in [v2.0.4][])_

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/gateways/
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-all-gateways)

This method takes no query parameters.

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body.

Each field in the top level JSON object is a [Currency Code][]. The content of each field is an array of objects, representing gateways that issue that currency. Each object has the following fields:

| Field      | Value                | Description                              |
|:-----------|:---------------------|:-----------------------------------------|
| `name`     | String               | A human-readable proper name for the gateway. |
| `account`  | String - [Address][] | The [issuing address](issuing-and-operational-addresses.html) of this currency. |
| `featured` | Boolean              | Whether this gateway is considered a "featured" issuer of the currency. Ripple decides which gateways to feature based on responsible business practices, volume, and other measures. |
| `label`    | String               | (May be omitted) Only provided when the [Currency Code][] is a 40-character hexadecimal value. This is an alternate human-readable name for the currency issued by this gateway. |
| `assets`   | Array of Strings     | Graphics filenames available for this gateway, if any. (Mostly, these are logos used by XRP Charts.) |

#### Example

Request:

```
GET /v2/gateways/
```

Response:

```
200 OK
{
    "AUD": [
        {
            "name": "Bitstamp",
            "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "featured": false,
            "assets": [
                "logo.grayscale.svg",
                "logo.svg"
            ]
        },
        {
            "name": "Coinex",
            "account": "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc",
            "featured": false,
            "assets": []
        }
    ],

... (additional results trimmed) ...

    "0158415500000000C1F76FF6ECB0BAC600000000": [
        {
            "name": "GBI",
            "account": "rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67",
            "featured": false,
            "label": "XAU (-0.5pa)",
            "assets": []
        }
    ],
    "KRW": [
        {
            "name": "EXRP",
            "account": "rPxU6acYni7FcXzPCMeaPSwKcuS2GTtNVN",
            "featured": true,
            "assets": []
        },
        {
            "name": "Pax Moneta",
            "account": "rUkMKjQitpgAM5WTGk79xpjT38DEJY283d",
            "featured": false,
            "assets": []
        }
    ]
}
```



## Get Gateway
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/gateways.js "Source")

<!-- STYLE_OVERRIDE: gateway, gateways -->
Get information about a specific gateway from [the Data API's list of known gateways](https://github.com/ripple/rippled-historical-database/blob/v2.0.4/api/gateways/gateways.json). _(New in [v2.0.4][])_

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/gateways/{gateway}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-gateway)

This method requires the following URL parameters:

| Field     | Value  | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `gateway` | String | The issuing [Address][], [URL-encoded name](https://en.wikipedia.org/wiki/Percent-encoding), or normalized name of the gateway. |

This method takes no query parameters.

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field        | Value                  | Description                          |
|:-------------|:-----------------------|:-------------------------------------|
| `name`       | String                 | Human-readable name of the gateway.  |
| `start_date` | String - [Timestamp][] | The approximate date of the first time exchanges for this gateway's currencies appeared in the ledger. |
| `accounts`   | Array                  | A list of [issuing addresses](issuing-and-operational-addresses.html) used by this gateway. (Gateways may use different issuing accounts for different currencies.) |
| `hotwallets` | Array of [Address][]es | This gateway's [operational addresses](issuing-and-operational-addresses.html). |
| `domain`     | String                 | The domain name where this gateway does business. |
| `normalized` | String                 | A normalized version of the `name` field suitable for including in URLs. |
| `assets`     | Array of Strings       | Graphics filenames available for this gateway, if any. (Mostly, these are logos used by XRP Charts.) |

Each object in the `accounts` field array has the following fields:

| Field        | Value  | Description                                          |
|:-------------|:-------|:-----------------------------------------------------|
| `address`    | String | The [issuing address](issuing-and-operational-addresses.html) used by this gateway. |
| `currencies` | Object | Each field in this object is a [Currency Code][] corresponding to a currency issued from this address. Each value is an object with a `featured` boolean indicating whether that currency is featured. Ripple decides which currencies and gateways to feature based on responsible business practices, volume, and other measures. |

#### Example

Request:

```
GET /v2/gateways/Gatehub
```

Response:

```
200 OK
{
    "name": "Gatehub",
    "start_date": "2015-02-15T00:00:00Z",
    "accounts": [
        {
            "address": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
            "currencies": {
                "EUR": {
                    "featured": true
                },
                "USD": {
                    "featured": true
                }
            }
        }
    ],
    "hotwallets": [
        "rhotcWYdfn6qxhVMbPKGDF3XCKqwXar5J4"
    ],
    "domain": "gatehub.net",
    "normalized": "gatehub",
    "assets": [
        "logo.grayscale.svg",
        "logo.svg"
    ]
}
```




## Get Currency Image

[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/gateways.js#L199 "Source")

Retrieve vector icons for various currencies. _(New in [v2.0.4][])_

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/currencies/{currencyimage}
```

<!-- MULTICODE_BLOCK_END -->

This method requires the following URL parameter:

| Field           | Value  | Description                                       |
|:----------------|:-------|:--------------------------------------------------|
| `currencyimage` | String | An image file for a currency, such as `xrp.svg`. See [the source code](https://github.com/ripple/rippled-historical-database/tree/develop/api/gateways/currencyAssets) for a list of available images. |

#### Response Format
A successful response uses the HTTP code **200 OK** and has a **Content-Type** header of `image/svg+xml` to indicate that the contents are XML representing a file in [SVG format](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics).

#### Example

Request:

```
GET /v2/currencies/mxn.svg
```

Response

```
200 OK
Content-Type: image/svg+xml
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 18.1.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
   width="200px" height="200px" viewBox="0 0 200 200" enable-background="new 0 0 200 200" xml:space="preserve">
<g>
  <path fill="#FC6E74" d="M105.1,181.5c-12.2,0-24-2.1-35.1-6.2c-11.1-4.1-21.6-10.5-31.1-19.1l-1.3-1.2l18.8-22.3l1.4,1.2
    c7.4,6.4,14.9,11.3,22.4,14.7c7.4,3.4,16,5.1,25.5,5.1c8,0,14.4-1.7,19-5c4.5-3.2,6.7-7.3,6.7-12.7c0-3-0.4-5.2-1.3-7.1
    c-0.8-1.8-2.4-3.6-4.8-5.4c-2.4-1.8-5.9-3.5-10.2-5.1c-4.5-1.6-10.3-3.2-17.5-4.8c-8.3-1.9-15.8-4.1-22.4-6.6
    c-6.6-2.5-12.3-5.6-16.8-9.2C54,94.3,50.4,89.8,48,84.5c-2.4-5.2-3.6-11.6-3.6-18.9c0-7.4,1.4-13.8,4.1-19.5
    c2.7-5.8,6.6-10.7,11.4-14.8c4.8-4.1,10.6-7.3,17.3-9.5c6.7-2.3,14-3.4,21.9-3.4c11.6,0,22.2,1.7,31.4,5.1
    c9.3,3.4,18.1,8.4,26.2,14.8l1.4,1.1l-16.8,23.6l-1.5-1.1c-6.9-5-13.9-9-20.7-11.6c-6.7-2.6-13.6-4-20.4-4
    c-7.5,0-13.4,1.6-17.5,4.9c-4,3.2-6,7-6,11.6c0,3.1,0.5,5.5,1.4,7.5c0.9,2,2.6,3.8,5,5.4c2.6,1.8,6.3,3.4,10.9,5
    c4.8,1.6,10.9,3.3,18.2,5c8.3,2.1,15.7,4.4,22,7c6.5,2.6,12,5.8,16.3,9.5c4.3,3.8,7.7,8.3,9.9,13.3c2.2,5,3.4,10.9,3.4,17.5
    c0,7.9-1.4,14.7-4.2,20.7c-2.8,6-6.8,11.1-11.9,15.3c-5,4.1-11.1,7.3-18.1,9.4C121.2,180.5,113.4,181.5,105.1,181.5z"/>
  <rect x="86.7" y="0" fill="#FC6E74" width="26.5" height="40.1"/>
  <rect x="86.5" y="159.2" fill="#FC6E74" width="27" height="40.8"/>
</g>
</svg>
```



## Get Accounts
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accounts.js "Source")

Retrieve information about the creation of new accounts in the XRP Ledger.

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-accounts)

Optionally, you can provide the following query parameters:

| Field        | Value                  | Description                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | String - [Timestamp][] | Start time of query range.           |
| `end`        | String - [Timestamp][] | End time of query range.             |
| `limit`      | Integer                | Maximum results per page. The default is 200. Cannot be more than 1,000. |
| `marker`     | String                 | [Pagination](#pagination) key from previously returned response. |
| `descending` | Boolean                | If `true`, return results in reverse chronological order. The default is `false`. |
| `parent`     | String                 | Filter results to children of the specified parent account. Not compatible with the `interval` parameter. |
| `format`     | String                 | Format of returned results: `csv` or `json`. The default is `json`. |

The `interval` and `reduce` parameters have been removed in [v2.3.5][].

#### Response Format
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field      | Value   | Description                                           |
|:-----------|:--------|:------------------------------------------------------|
| `result`   | String  | The value `success` indicates that this is a successful response. |
| `count`    | Integer | Number of accounts returned.                          |
| `marker`   | String  | (May be omitted) [Pagination](#pagination) marker.    |
| `accounts` | Array   |An array of [account creation objects](#account-creation-objects). |

#### Example

Request:

```
GET /v1/accounts?parent=rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn
```

Response:

```
200 OK
{
  "result": "success",
  "count": 3,
  "accounts": [
    {
      "balance": "20.0",
      "account": "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
      "executed_time": "2015-02-09T23:31:40+00:00",
      "ledger_index": 11620700,
      "parent": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "tx_hash": "1D381C0FCA00E8C34A6D4D3A91DAC9F3697B4E66BC49ED3D9B2D6F57D7F15E2E"
    },
    {
      "balance": "30",
      "account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
      "executed_time": "2015-06-16T21:15:40+00:00",
      "ledger_index": 14090928,
      "parent": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "tx_hash": "60B614622FC67DFCA8D796D7F6AF0B7AEC5E59BB268EA032F810395407DDF8D5"
    },
    {
      "balance": "50",
      "account": "rLFd1FzHMScFhLsXeaxStzv3UC97QHGAbM",
      "executed_time": "2015-09-23T23:05:20+00:00",
      "ledger_index": 16061430,
      "parent": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "tx_hash": "FAE331A6D5CB83BCE832E7EBEDBD807EDEFFAF39AB241683EE81A0326A1A6748"
    }
  ]
}
```


## Get Account
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getAccount.js "Source")

Get creation info for a specific ripple account

#### Request Format


<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts/{address}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-account)

This method requires the following URL parameters:

| Field     | Value  | Description                  |
|:----------|:-------|:-----------------------------|
| `address` | String | XRP Ledger address to query. |

#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field     | Value                                                  | Description |
|:----------|:-------------------------------------------------------|:--------|
| `result`  | String                                                 | The value `success` indicates that this is a successful response. |
| `account` | Object - [Account Creation](#account-creation-objects) | The requested account. |

#### Example

Request:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn
```

Response:

```
200 OK
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



## Get Account Balances
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountBalances.js "Source")

Get all balances held or owed by a specific XRP Ledger account.

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts/{address}/balances
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-account-balances)

This method requires the following URL parameters:

| Field     | Value  | Description                  |
|:----------|:-------|:-----------------------------|
| `address` | String | XRP Ledger address to query. |

Optionally, you can provide the following query parameters:

| Field          | Value   | Description                                       |
|:---------------|:--------|:--------------------------------------------------|
| `ledger_index` | Integer | Index of ledger for historical balances.          |
| `ledger_hash`  | String  | Ledger hash for historical balances.              |
| `date`         | String  | UTC date for historical balances.                 |
| `currency`     | String  | Restrict results to specified currency.           |
| `counterparty` | String  | Restrict results to specified counterparty/issuer. |
| `limit`        | Integer | Maximum results per page. The default is 200. Cannot be greater than 400, but you can use the value `all` to return all results. (Caution: When using limit=all to retrieve very many results, the request may time out. For large issuers, there can be several tens of thousands of results.) |
| `format`       | String  | Format of returned results: `csv` or `json`. The default is `json`. |

#### Response Format
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field          | Value                        | Description                  |
|:---------------|:-----------------------------|:-----------------------------|
| `result`       | String                       | The value `success` indicates that this is a successful response. |
| `ledger_index` | Integer                      | ledger index for balances query. |
| `close_time`   | String                       | close time of the ledger.    |
| `limit`        | String                       | number of results returned, if limit was exceeded. |
| `marker`       | String                       | (May be omitted) [Pagination](#pagination) marker. |
| `balances`     | Array of [Balance Object][]s | The requested balances.      |

#### Example

Request:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/balances?currency=USD&date=2015-01-01T00:00:00Z&limit=3
```

Response:

```
200 OK
{
  "result": "success",
  "ledger_index": 10852618,
  "close_time": "2015-01-01T00:00:00Z",
  "limit": 3,
  "balances": [
    {
      "currency": "USD",
      "counterparty": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "value": "-11.0301"
    },
    {
      "currency": "USD",
      "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
      "value": "0.0001"
    },
    {
      "currency": "USD",
      "counterparty": "rweYz56rfmQ98cAdRaeTxQS9wVMGnrdsFp",
      "value": "0"
    }
  ]
}
```


## Get Account Orders
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountOrders.js "Source")

Get orders in the order books, placed by a specific account. This does not return orders that have already been filled.

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/account/{address}/orders
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-account-orders)

This method requires the following URL parameters:

| Field     | Value                | Description                  |
|:----------|:---------------------|:-----------------------------|
| `address` | String - [Address][] | XRP Ledger address to query. |

Optionally, you can provide the following query parameters:

| Field          | Value                  | Description                        |
|:---------------|:-----------------------|:-----------------------------------|
| `ledger_index` | Integer                | Get orders as of this ledger. Not compatible with `ledger_hash` or `date`. |
| `ledger_hash`  | String                 | Get orders as of this ledger. Not compatible with `ledger_index` or `date`. |
| `date`         | String - [Timestamp][] | Get orders at this time. Not compatible with `ledger_index` or `ledger_hash`. |
| `limit`        | Integer                | Maximum results per page. The default is 200. Cannot be greater than 400. |
| `format`       | String                 | Format of returned results: `csv` or `json`. The default is `json`. |

If none of `ledger_index`, `ledger_hash`, or `date` are specified, the API uses the most current data available.

#### Response Format
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field          | Value                  | Description                        |
|:---------------|:-----------------------|:-----------------------------------|
| `result`       | String                 | The value `success` indicates that this is a successful response. |
| `ledger_index` | Integer                | `ledger_index` of the ledger version used. |
| `close_time`   | String                 | Close time of the ledger version used. |
| `limit`        | String                 | The `limit` from the request.      |
| `orders`       | Array of order objects | The requested orders.              |

Each order object has the following fields:

| Field                          | Value                | Description          |
|:-------------------------------|:---------------------|:---------------------|
| `specification`                | Object               | Details of this order's current state. |
| `specification.direction`      | String               | Either `buy` or `sell`. |
| `specification.quantity`       | [Balance Object][]   | The maximum amount of the base currency this order would buy or sell (depending on the direction). This value decreases as the order gets partially filled. |
| `specification.totalPrice`     | [Balance Object][]   | The maximum amount of the counter currency the order can spend or gain to buy or sell the base currency. This value decreases as the order gets partially filled. |
| `properties`                   | Object               | Details of how the order was placed. |
| `properties.maker`             | String - [Address][] | The XRP Ledger account that placed the order. |
| `properties.sequence`          | Number               | The sequence number of the transaction that placed this order. |
| `properties.makerExchangeRate` | [String - Number][]  | The exchange rate from the point of view of the account that submitted the order. |

#### Example

Request:

```
GET /v2/accounts/rK5j9n8baXfL4gzUoZsfxBvvsv97P5swaV/orders?limit=2&date=2015-11-11T00:00:00Z
```

Response:

```
200 OK
{
  "result": "success",
  "ledger_index": 17007855,
  "close_time": "2015-11-11T00:00:00Z",
  "limit": 2,
  "orders": [
    {
      "specification": {
        "direction": "buy",
        "quantity": {
          "currency": "JPY",
          "value": "56798.00687665813",
          "counterparty": "r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN"
        },
        "totalPrice": {
          "currency": "USD",
          "value": "433.792841227449",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "rK5j9n8baXfL4gzUoZsfxBvvsv97P5swaV",
        "sequence": 7418286,
        "makerExchangeRate": "130.9334813270407"
      }
    },
    {
      "specification": {
        "direction": "buy",
        "quantity": {
          "currency": "JPY",
          "value": "11557.02705273459",
          "counterparty": "r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN"
        },
        "totalPrice": {
          "currency": "USD",
          "value": "87.570156003591",
          "counterparty": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq"
        }
      },
      "properties": {
        "maker": "rK5j9n8baXfL4gzUoZsfxBvvsv97P5swaV",
        "sequence": 7418322,
        "makerExchangeRate": "131.9744942815983"
      }
    }
  ]
}
```




## Get Account Transaction History
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountTransactions.js "Source")

Retrieve a history of transactions that affected a specific account. This includes all transactions the account sent, payments the account received, and payments that rippled through the account.

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts/{address}/transactions
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-account-transaction-history)

This method requires the following URL parameters:

| Field     | Value                | Description                  |
|:----------|:---------------------|:-----------------------------|
| `address` | String - [Address][] | XRP Ledger address to query. |


Optionally, you can provide the following query parameters:

| Field          | Value                  | Description                        |
|:---------------|:-----------------------|:-----------------------------------|
| `start`        | String - [Timestamp][] | Start time of query range. The default is the earliest date available. |
| `end`          | String - [Timestamp][] | End time of query range. The default is the current date. |
| `min_sequence` | String                 | Minimum sequence number to query.  |
| `max_sequence` | String                 | Max sequence number to query.      |
| `type`         | String                 | Restrict results to a specified [transaction type](transaction-types.html). |
| `result`       | String                 | Restrict results to a specified [transaction result](transaction-results.html). |
| `binary`       | Boolean                | Return results in binary format.   |
| `descending`   | Boolean                | If `true`, return results in reverse chronological order. The default is `false`. |
| `limit`        | Integer                | Maximum results per page. The default is 20. Cannot be more than 1,000. |
| `marker`       | String                 | [Pagination](#pagination) key from previously returned response. |

**Note:** This method cannot return CSV format; only JSON results are supported for raw XRP Ledger transactions.


#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field          | Value                                                | Description |
|:---------------|:-----------------------------------------------------|:-----|
| `result`       | String                                               | The value `success` indicates that this is a successful response. |
| `count`        | Integer                                              | The number of objects contained in the `transactions` field. |
| `marker`       | String                                               | (May be omitted) [Pagination](#pagination) marker. |
| `transactions` | Array of [transaction objects](#transaction-objects) | All transactions matching the request. |

#### Example

Request:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/transactions?type=Payment&result=tesSUCCESS&limit=1
```

Response:

```
200 OK
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




## Get Transaction By Account And Sequence
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountTxSeq.js "Source")

Retrieve a specifc transaction originating from a specified account

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts/{address}/transactions/{sequence}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-transaction-by-account-and-sequence)

This method requires the following URL parameters:

| Field      | Value   | Description                  |
|:-----------|:--------|:-----------------------------|
| `address`  | String  | XRP Ledger address to query. |
| `sequence` | Integer | Transaction sequence number. |


Optionally, you can provide the following query parameters:

| Field    | Value   | Description                                             |
|:---------|:--------|:--------------------------------------------------------|
| `binary` | Boolean | If `true`, return transaction in binary format. The default is `false`. |


#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field         | Value                                      | Description     |
|:--------------|:-------------------------------------------|:----------------|
| `result`      | String                                     | The value `success` indicates that this is a successful response. |
| `transaction` | [transaction object](#transaction-objects) | The requested transaction. |

#### Example

Request:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/transactions/10?binary=true
```

Response:

```
200 OK
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



## Get Account Payments
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountPayments.js "Source")

Retrieve a payments for a specified account

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts/{address}/payments
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-account-payments)

This method requires the following URL parameters:

| Field     | Value  | Description                  |
|:----------|:-------|:-----------------------------|
| `address` | String | XRP Ledger address to query. |


Optionally, you can provide the following query parameters:

| Field             | Value                      | Description                 |
|:------------------|:---------------------------|:----------------------------|
| `start`           | String - [Timestamp][]     | Filter results to this time and later. |
| `end`             | String - [Timestamp][]     | Filter results to this time and earlier. |
| `type`            | String                     | Type of payment - `sent` or `received`. |
| `currency`        | String - [Currency Code][] | Filter results to specified currency. |
| `issuer`          | String - [Address][]       | Filter results to specified issuer. |
| `source_tag`      | Integer                    | Filter results to specified source tag. |
| `destination_tag` | Integer                    | Filter results to specified destination tag. |
| `limit`           | Integer                    | Maximum results per page. The default is 200. Cannot be more than 1,000. |
| `marker`          | String                     | [Pagination](#pagination) key from previously returned response. |
| `format`          | String                     | Format of returned results: `csv` or `json`. The default is `json`. |


#### Response Format

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field      | Value                        | Description                      |
|:-----------|:-----------------------------|:---------------------------------|
| `result`   | String                       | The value `success` indicates that this is a successful response. |
| `count`    | Integer                      | The number of objects contained in the `payments` field. |
| `marker`   | String                       | (May be omitted) [Pagination](#pagination) marker. |
| `payments` | Array of [payment objects][] | All payments matching the request, sorted with oldest first. |

#### Example

Request:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/payments?currency=USD&limit=1
```

Response:

```
200 OK
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
      "source_balance_changes": [
        {
          "counterparty": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
          "currency": "USD",
          "value": "-1"
        }
      ],
      "tx_index": 1,
      "currency": "USD",
      "destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "executed_time": "2014-06-02T22:47:50Z",
      "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "ledger_index": 6979192,
      "source": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "source_currency": "USD",
      "tx_hash": "7BF105CFE4EFE78ADB63FE4E03A851440551FE189FD4B51CAAD9279C9F534F0E",
      "transaction_cost": "1.0E-5"
    }
  ]
}
```




## Get Account Exchanges
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountExchanges.js "Source")

Retrieve Exchanges for a given account over time.

#### Request Format

There are two variations on this method:

<!-- MULTICODE_BLOCK_START -->

*REST - All Exchanges*

```
GET /v2/accounts/{address}/exchanges/
```

*REST - Specific Currency Pair*

```
GET /v2/accounts/{address}/exchanges/{base}/{counter}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-account-exchanges-all)

This method requires the following URL parameters:

| Field     | Value  | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `address` | String | XRP Ledger address to query.                            |
| `base`    | String | Base currency of the pair, as a [Currency Code][], followed by `+` and the issuer [Address][] unless it's XRP. |
| `counter` | String | Counter currency of the pair, as a [Currency Code][], followed by `+` and the issuer [Address][] unless it's XRP. |


Optionally, you can provide the following query parameters:

| Field        | Value                  | Description                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | String - [Timestamp][] | Filter results to this time and later. |
| `end`        | String - [Timestamp][] | Filter results to this time and earlier. |
| `descending` | Boolean                | If `true`, return results in reverse chronological order. The default is `false`. |
| `limit`      | Integer                | Maximum results per page. The default is 200. Cannot be more than 1000. |
| `marker`     | String                 | [Pagination](#pagination) key from previously returned response. |
| `format`     | String                 | Format of returned results: `csv` or `json`. The default is `json`. |


#### Response Format
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field       | Value                         | Description                    |
|:------------|:------------------------------|:-------------------------------|
| `result`    | String                        | The value `success` indicates that this is a successful response. |
| `count`     | Integer                       | Number of exchanges returned.  |
| `marker`    | String                        | (May be omitted) [Pagination](#pagination) marker. |
| `exchanges` | Array of [Exchange Objects][] | The requested exchanges.       |

#### Example

Request:

```
GET /v2/accounts/rsyDrDi9Emy6vPU78qdxovmNpmj5Qh4NKw/exchanges/KRW+rUkMKjQitpgAM5WTGk79xpjT38DEJY283d/XRP?start=2015-08-08T00:00:00Z&end=2015-08-31T00:00:00Z&limit=2

```

Response:

```
200 OK
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




## Get Account Balance Changes
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountBalanceChanges.js "Source")

Retrieve Balance changes for a given account over time.

#### Request Format

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts/{address}/balance_changes/
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-account-balance-changes)

This method requires the following URL parameters:

| Field     | Value  | Description                  |
|:----------|:-------|:-----------------------------|
| `address` | String | XRP Ledger address to query. |


Optionally, you can provide the following query parameters:

| Field          | Value                  | Description                        |
|:---------------|:-----------------------|:-----------------------------------|
| `currency`     | String                 | Restrict results to specified currency. |
| `counterparty` | String                 | Restrict results to specified counterparty/issuer. |
| `start`        | String - [Timestamp][] | Start time of query range.         |
| `end`          | String - [Timestamp][] | End time of query range.           |
| `descending`   | Boolean                | If `true`, return results in reverse chronological order. The default is `false`. |
| `limit`        | Integer                | Maximum results per page. The default is 200. Cannot be more than 1000. |
| `marker`       | String                 | [Pagination](#pagination) key from previously returned response. |
| `format`       | String                 | Format of returned results: `csv` or`json`. The default is `json`. |


#### Response Format
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field       | Value                                   | Description          |
|:------------|:----------------------------------------|:---------------------|
| `result`    | String                                  | The value `success` indicates that this is a successful response. |
| `count`     | Integer                                 | Number of balance changes returned. |
| `marker`    | String                                  | (May be omitted) [Pagination](#pagination) marker. |
| `exchanges` | Array of [balance change descriptors][] | The requested balance changes. |

#### Example

Request:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/balance_changes?descending=true&limit=3
```

Response:

```
200 OK
{
  "result": "success",
  "count": 3,
  "marker": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn|20160122235211|000018425487|00010|00001",
  "balance_changes": [
    {
      "amount_change": "-0.012",
      "final_balance": "75.169663",
      "tx_index": 7,
      "change_type": "transaction_cost",
      "currency": "XRP",
      "executed_time": "2016-01-29T22:57:20Z",
      "ledger_index": 18555460,
      "tx_hash": "2B44EBE00728D04658E597A85EC4F71D20503B31ABBF556764AD8F7A80BA72F6"
    },
    {
      "amount_change": "-25.0",
      "final_balance": "75.181663",
      "node_index": 1,
      "tx_index": 4,
      "change_type": "payment_source",
      "currency": "XRP",
      "executed_time": "2016-01-26T08:32:20Z",
      "ledger_index": 18489336,
      "tx_hash": "E5C6DD25B2DCF534056D98A2EFE3B7CFAE4EBC624854DE3FA436F733A56D8BD9"
    },
    {
      "amount_change": "-0.01",
      "final_balance": "100.181663",
      "tx_index": 4,
      "change_type": "transaction_cost",
      "currency": "XRP",
      "executed_time": "2016-01-26T08:32:20Z",
      "ledger_index": 18489336,
      "tx_hash": "E5C6DD25B2DCF534056D98A2EFE3B7CFAE4EBC624854DE3FA436F733A56D8BD9"
    }
  ]
}
```




## Get Account Reports
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountReports.js "Source")

Retrieve daily summaries of payment activity for an account.

<!-- MULTICODE_BLOCK_START -->

*REST - Date Omitted*

```
GET /v2/accounts/{address}/reports/
```

*REST - Date Specified*

```
GET /v2/accounts/{address}/reports/{date}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-account-reports-by-day)

This method requires the following URL parameters:

| Field     | Value  | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `address` | String | XRP Ledger address to query.                            |
| `date`    | String | _(Optional)_ UTC date for single report. If omitted, use the `start` and `end` query parameters. |


Optionally, you can provide the following query parameters:

| Field        | Value                  | Description                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | String - [Timestamp][] | Start time of query range. The default is the start of the current date. Ignored if `date` specified. |
| `end`        | String - [Timestamp][] | End time of query range. The default is the end of the current date. Ignored if `date` specified. |
| `accounts`   | Boolean                | If `true`, provide lists with addresses of all `sending_counterparties` and `receiving_counterparties` in results. Otherwise, return only the number of sending and receiving counterparties. The default is `false`. |
| `payments`   | Boolean                | Include [Payment Summary Objects][] in the `payments` field for each interval, with the payments that occurred during that interval. |
| `descending` | Boolean                | If `true`, sort results with most recent first. By default, sort results with oldest first. |
| `format`     | String                 | Format of returned results: `csv` or `json`. The default is `json`. |


#### Response Format
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field     | Value                        | Description                       |
|:----------|:-----------------------------|:----------------------------------|
| `result`  | String                       | The value `success` indicates that this is a successful response. |
| `count`   | Integer                      | Number of reports in the `reports` field. |
| `reports` | Array of [Reports Objects][] | Daily summaries of account activity for the given account and date range. |

#### Example

Request:

```
GET /v2/accounts/rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q/reports?start=2015-08-28T00:00:00&end=2015-08-28T00:00:00&accounts=true&payments=true&descending=true
```

Response:

```
200 OK
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



## Get Account Transaction Stats
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountStats.js "Source")

Retrieve daily summaries of transaction activity for an account. _(New in [v2.1.0][].)_

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts/{address}/stats/transactions
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-account-transaction-stats)

This method requires the following URL parameters:

| Field     | Value  | Description                  |
|:----------|:-------|:-----------------------------|
| `address` | String | XRP Ledger address to query. |


Optionally, you can provide the following query parameters:

| Field        | Value                  | Description                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | String - [Timestamp][] | Start time of query range. The default is the earliest date available. |
| `end`        | String - [Timestamp][] | End time of query range. The default is the current date. |
| `limit`      | Integer                | Maximum results per page. The default is 200. Cannot be more than 1000. |
| `descending` | Boolean                | If `true`, sort results with most recent first. By default, sort results with oldest first. |
| `marker`     | String                 | [Pagination](#pagination) key from previously returned response. |
| `format`     | String                 | Format of returned results: `csv` or `json`. The default is `json`. |


#### Response Format
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field    | Value                              | Description                  |
|:---------|:-----------------------------------|:-----------------------------|
| `result` | String                             | The value `success` indicates that this is a successful response. |
| `count`  | Integer                            | Number of transaction stats objects in the `rows` field. |
| `rows`   | Array of Transaction Stats Objects | Daily summaries of account transaction activity for the given account. |

Each Transaction Stats Object has the following fields:

| Field               | Value                  | Description                   |
|:--------------------|:-----------------------|:------------------------------|
| `date`              | String - [Timestamp][] | This object describes activity on this date. |
| `transaction_count` | Integer                | The total number of transactions sent by the account on this date. |
| `result`            | Object                 | Map of [transaction result codes](transaction-results.html), indicating how many of each result code occurred in the transactions sent by this account on this date. |
| `type`              | Object                 | Map of [transaction types](transaction-formats.html), indicating how many of each transaction type the account sent on this date. |

#### Example

Request:

```
GET /v2/accounts/rGFuMiw48HdbnrUbkRYuitXTmfrDBNTCnX/stats/transactions?start=2015-01-01&limit=2
```

Response:

```
200 OK
{
  "result": "success",
  "count": 2,
  "marker": "rGFuMiw48HdbnrUbkRYuitXTmfrDBNTCnX|20150116000000",
  "rows": [
    {
      "date": "2015-01-14T00:00:00Z",
      "transaction_count": 44,
      "result": {
        "tecUNFUNDED_PAYMENT": 1,
        "tesSUCCESS": 43
      },
      "type": {
        "Payment": 42,
        "TrustSet": 2
      }
    },
    {
      "date": "2015-01-15T00:00:00Z",
      "transaction_count": 116,
      "result": {
        "tesSUCCESS": 116
      },
      "type": {
        "Payment": 116
      }
    }
  ]
}
```



## Get Account Value Stats
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountStats.js "Source")

Retrieve daily summaries of transaction activity for an account. _(New in [v2.1.0][].)_

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts/{address}/stats/value
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#get-account-value-stats)

This method requires the following URL parameters:

| Field     | Value  | Description                  |
|:----------|:-------|:-----------------------------|
| `address` | String | XRP Ledger address to query. |


Optionally, you can provide the following query parameters:

| Field        | Value                  | Description                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | String - [Timestamp][] | Start time of query range. The default is the start of the most recent interval. |
| `end`        | String - [Timestamp][] | End time of query range. The default is the end of the most recent interval. |
| `limit`      | Integer                | Maximum results per page. The default is 200. Cannot be more than 1000. |
| `marker`     | String                 | [Pagination](#pagination) key from previously returned response. |
| `descending` | Boolean                | If `true`, sort results with most recent first. By default, sort results with oldest first. |
| `format`     | String                 | Format of returned results: `csv` or `json`. The default is `json`. |


#### Response Format
A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field    | Value                        | Description                        |
|:---------|:-----------------------------|:-----------------------------------|
| `result` | String                       | The value `success` indicates that this is a successful response. |
| `count`  | Integer                      | Number of value stats objects in the `rows` field. |
| `rows`   | Array of Value Stats Objects | Daily summaries of account value for the given account. |

Each Value Stats Object has the following fields:

| Field                  | Value                  | Description                |
|:-----------------------|:-----------------------|:---------------------------|
| `date`                 | String - [Timestamp][] | This object describes activity on this date. |
| `value`                | [String - Number][]    | The total of all currency held by this account, normalized to XRP. |
| `balance_change_count` | Number                 | The number of times the account's balance changed on this date. |

#### Example

Request:

```
GET /v2/accounts/rGFuMiw48HdbnrUbkRYuitXTmfrDBNTCnX/stats/value?limit=2&descending=true
```

Response:

```
200 OK
{
  "result": "success",
  "count": 2,
  "marker": "rGFuMiw48HdbnrUbkRYuitXTmfrDBNTCnX|20160412000000",
  "rows": [
    {
      "date": "2016-04-14T00:00:00Z",
      "account_value": "7.666658705139822E7",
      "balance_change_count": 58
    },
    {
      "date": "2016-04-13T00:00:00Z",
      "account_value": "1.0022208004947332E8",
      "balance_change_count": 184
    }
  ]
}
```




## Health Check - API
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/checkHealth.js "Source")

Check the health of the API service.

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/health/api
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#api-health-check)

Optionally, you can provide the following query parameters:

| Field       | Value   | Description                                          |
|:------------|:--------|:-----------------------------------------------------|
| `threshold` | Integer | Consider the API unhealthy if the database does not respond within this amount of time, in seconds. The default is 5 seconds. |
| `verbose`   | Boolean | If `true`, return a JSON response with data points. By default, return an integer value only. |

#### Response Format

A successful response uses the HTTP code **200 OK**. By default, the response body is an **integer health value only**.

The health value `0` always indicates a healthy status. Other health values are defined as follows:

| Value | Meaning                                                              |
|:------|:---------------------------------------------------------------------|
| `0`   | API service is up, and response time to HBase is less than `threshold` value from request. |
| `1`   | API service is up, but response time to HBase is greater than `threshold` value from request. |

If the request specifies `verbose=true` in the query parameters, the response body is a JSON object, with the following fields:

| Field                     | Value                        | Description       |
|:--------------------------|:-----------------------------|:------------------|
| `score`                   | 0-1                          | Health value, as defined above. |
| `response_time`           | String - Human-readable time | The actual response time of the database. |
| `response_time_threshold` | String - Human-readable time | The maximum response time to be considered healthy. |

#### Example

Request:

```
GET /v2/health/api?verbose=true
```

Response:

```
200 OK
{
  "score": 0,
  "response_time": "0.014s",
  "response_time_threshold": "5s"
}
```


## Health Check - Ledger Importer
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/checkHealth.js "Source")

Check the health of the Ledger Importer Service.

<!-- MULTICODE_BLOCK_START -->

*REST - Importer Health*

```
GET /v2/health/importer
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#importer-health-check)

Optionally, you can provide the following query parameters:

| Field        | Value   | Description                                         |
|:-------------|:--------|:----------------------------------------------------|
| `threshold`  | Integer | Consider the Importer unhealthy if more than this amount of time, in seconds, has elapsed since the latest validated ledger was imported. The default is 300 seconds. |
| `threshold2` | Integer | Consider the Importer unhealthy if more than this amount of time, in seconds, has elapsed since the latest ledger of any kind was imported. The default is 60 seconds. |
| `verbose`    | Boolean | If `true`, return a JSON response with data points. By default, return an integer value only. |

#### Response Format

A successful response uses the HTTP code **200 OK**. By default, the response body is an **integer health value only**.

The health value `0` always indicates a healthy status. Other health values are defined as follows:

| Value | Meaning                                                              |
|:------|:---------------------------------------------------------------------|
| `0`   | The most recent imported ledger was less than `threshold2` (Default: 60) seconds ago, and most recent validated ledger was less than `threshold` seconds ago. |
| `1`   | The most recent imported ledger was less than `threshold2` (Default: 60) seconds ago, but the most recent validated ledger is older than `threshold` seconds. |
| `2`   | The most recent imported ledger was more than `threshold2` seconds ago. |

If the request specifies `verbose=true` in the query parameters, the response body is a JSON object, with the following fields:

| Field                      | Value                        | Description      |
|:---------------------------|:-----------------------------|:-----------------|
| `score`                    | 0-2                          | Health value, as defined above. |
| `response_time`            | String                       | The actual response time of the database. |
| `ledger_gap`               | String - Human-readable time | Difference between the close time of the last saved ledger and the current time. |
| `ledger_gap_threshold`     | String - Human-readable time | Maximum ledger gap to be considered healthy. |
| `valildation_gap`          | String - Human-readable time | Difference between the close time of the last imported validated ledger and the current time. |
| `validation_gap_threshold` | String - Human-readable time | Maximum validation gap to be considered healthy. |

#### Example

Request:

```
GET /v2/health/importer?verbose=true
```

Response:

```
200 OK
{
    "score": 0,
    "response_time": "0.081s",
    "ledger_gap": "1.891s",
    "ledger_gap_threshold": "5.00m",
    "validation_gap": "29.894s",
    "validation_gap_threshold": "15.00m"
}
```



## Health Check - Nodes ETL
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/checkHealth.js "Source")

Check the health of the Topology Nodes Extract, Transform, Load (ETL) Service.

<!-- MULTICODE_BLOCK_START -->

*REST - Nodes ETL Health*

```
GET /v2/health/nodes_etl
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#nodes-etl-health-check)

Optionally, you can provide the following query parameters:

| Field       | Value   | Description                                          |
|:------------|:--------|:-----------------------------------------------------|
| `threshold` | Integer | Consider the service unhealthy if more than this amount of time, in seconds, has elapsed since the latest data was imported. The default is 120 seconds. |
| `verbose`   | Boolean | If `true`, return a JSON response with data points. By default, return an integer value only. |

#### Response Format

A successful response uses the HTTP code **200 OK**. By default, the response body is an **integer health value only**.

The health value `0` always indicates a healthy status. Other health values are defined as follows:

| Value | Meaning                                                              |
|:------|:---------------------------------------------------------------------|
| `0`   | The most recent imported topology data was less than `threshold` (Default: 120) seconds ago. |
| `1`   | The most recent imported topology data was more than `threshold` seconds ago. |


If the request specifies `verbose=true` in the query parameters, the response body is a JSON object, with the following fields:

| Field           | Value                        | Description                 |
|:----------------|:-----------------------------|:----------------------------|
| `score`         | 0-1                          | Health value, as defined above. |
| `gap`           | String - Human-readable time | Difference between the latest imported data and the current time. |
| `gap_threshold` | String - Human-readable time | Maximum gap to be considered healthy. |
| `message`       | String                       | Description of the reason for a non-zero score, if applicable. |

#### Example

Request:

```
GET /v2/health/nodes_etl?verbose=true
```

Response:

```
200 OK
{
  "score": 0,
  "gap": "1.891s",
  "gap_threshold": "2.00m",
}
```



## Health Check - Validations ETL
[[Source]](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/checkHealth.js "Source")

Check the health of the Validations Extract, Transform, Load (ETL) Service.

<!-- MULTICODE_BLOCK_START -->

*REST - Validations ETL Health*

```
GET /v2/health/validations_etl
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](data-api-v2-tool.html#validations-etl-health-check)

Optionally, you can provide the following query parameters:

| Field       | Value   | Description                                          |
|:------------|:--------|:-----------------------------------------------------|
| `threshold` | Integer | Consider the service unhealthy if more than this amount of time, in seconds, has elapsed since the latest data was imported. The default is 120 seconds. |
| `verbose`   | Boolean | If `true`, return a JSON response with data points. By default, return an integer value only. |

#### Response Format

A successful response uses the HTTP code **200 OK**. By default, the response body is an **integer health value only**.

The health value `0` always indicates a healthy status. Other health values are defined as follows:

| Value | Meaning                                                              |
|:------|:---------------------------------------------------------------------|
| `0`   | The most recent imported topology data was less than `threshold` (Default: 120) seconds ago. |
| `1`   | The most recent imported topology data was more than `threshold` seconds ago. |

If the request specifies `verbose=true` in the query parameters, the response body is a JSON object, with the following fields:

| Field           | Value                        | Description                 |
|:----------------|:-----------------------------|:----------------------------|
| `score`         | 0-1                          | Health value, as defined above. |
| `gap`           | String - Human-readable time | Difference between the latest imported data and the current time. |
| `gap_threshold` | String - Human-readable time | Maximum gap to be considered healthy. |
| `message`       | String                       | Description of the reason for a non-zero score, if applicable. |

#### Example

Request:

```
GET /v2/health/nodes_etl?verbose=true
```

Response:

```
200 OK
{
  "score": 0,
  "gap": "1.891s",
  "gap_threshold": "2.00m",
}
```




# API Conventions

## Basic Types

As a REST API, the Data API v2 uses [JSON](http://json.org/)'s native datatypes to represent API fields, with some special cases.

### Numbers and Precision
[String - Number]: #numbers-and-precision

{% include '_snippets/string-number-formatting.md' %}

The precision for amounts of **non-XRP currency** in the XRP Ledger is as follows:

* Minimum nonzero absolute value: `1000000000000000e-96`
* Maximum value: `9999999999999999e80`
* Minimum value: `-9999999999999999e80`
* 15 decimal digits of precision

**XRP** has a different internal representation, and its precision is different:

* Minimum value: `0`
* Maximum value: `100000000000` (`1e11`)
* Precise to the nearest `0.000001` (`1e-6`)

In other words, XRP has the same precision as a 64-bit unsigned integer where each unit is equivalent to 0.000001 XRP.

### Addresses
[Address]: #addresses

{% include '_snippets/data_types/address.md' %}


### Public Keys
[Public Key]: #public-keys

{% include '_snippets/data_types/public_key.md' %}


### Hashes
[Hash]: #hashes

{% include '_snippets/data_types/hash.md' %}


### Timestamps
[Timestamp]: #timestamps

All dates and times are written in ISO 8601 Timestamp Format, using UTC. This format is summarized as:

`YYYY-MM-DDThh:mm:ssZ`

* Four-digit year
* Two-digit month
* Two-digit day
* The letter `T` separating the date part and the time part
* Two-digit hour using a 24-hour clock
* Two digit minute
* The letter `Z` indicating zero offset from UTC.

(As of [v2.0.4][], the offset `+00:00` is no longer used.)

### Ledger Index
[Ledger Index]: #ledger-index

{% include '_snippets/data_types/ledger_index.md' %}

### Account Sequence
[Sequence Number]: #account-sequence

{% include '_snippets/data_types/account_sequence.md' %}

### Currency Code
[Currency Code]: #currency-code

{% include '_snippets/data_types/currency_code.md' %}

## Pagination

Many queries may return more data than is reasonable to return in a single HTTP response. The Data API uses a "limit and marker" system to control how much is returned in a single response ("page") and to query for additional content.

The `limit` query parameter to many requests restricts the response to a specific number of results in the response. The types of results and default values vary based on the method. For most methods, the `limit` is **200** by default, and can be set as high as **1000**. If you specify a `limit` larger than the maximum, the API uses the maximum value instead.

When a query has additional objects that are not contained in the current response, the JSON response contains a top-level field `marker` which indicates that you can retrieve additional results. To do so, make more requests with the previous value of the `marker` field as the `marker` query parameter. For each additional request, use the same parameters as the first request (except `marker`). When the response omits the `marker` parameter, that indicates that you have reached the end of the queryable data.

When a `marker` is or would be present, the response contains a [`Link` header](https://tools.ietf.org/html/rfc5988#section-5) with `rel="next"`. This is a full URL to the next page of results. You can use this to paginate over results when the response is in `csv` format instead of `json`. _(New in [v2.0.4][])_

## Transaction Objects

Transactions have two formats - a compact "binary" format where the defining fields of the transaction are encoded as strings of hex, and an expanded format where the defining fields of the transaction are nested as complete JSON objects.

### Full JSON Format

| Field          | Value                     | Description                     |
|:---------------|:--------------------------|:--------------------------------|
| `hash`         | String - [Hash][]         | An identifying hash value unique to this transaction, as a hex string. |
| `date`         | String - [Timestamp][]    | The time when this transaction was included in a validated ledger. |
| `ledger_index` | Number - [Ledger Index][] | The ledger index of the ledger that included this transaction. |
| `tx`           | Object                    | The fields of this transaction object, as defined by the [Transaction Format](transaction-formats.html). |
| `meta`         | Object                    | Metadata about the results of this transaction. |

### Binary Format

| Field          | Value                     | Description                     |
|:---------------|:--------------------------|:--------------------------------|
| `hash`         | String - [Hash][]         | An identifying hash value unique to this transaction, as a hex string. |
| `date`         | String - [Timestamp][]    | The time when this transaction was included in a validated ledger. |
| `ledger_index` | Number - [Ledger Index][] | The ledger index of the ledger that included this transaction. |
| `tx`           | String                    | The binary data that represents this transaction, as a hexadecimal string. |
| `meta`         | String                    | The binary data that represents this transaction's metadata, as a hex string. |

## Ledger Objects

A "ledger" is one version of the shared global ledger. Each ledger object has the following fields:

| Field               | Value                     | Description                |
|:--------------------|:--------------------------|:---------------------------|
| `ledger_hash`       | String - [Hash][]         | An identifying hash unique to this ledger, as a hex string. |
| `ledger_index`      | Number - [Ledger Index][] | The ledger index of the ledger. Each new ledger has a ledger index 1 higher than the ledger that came before it. |
| `parent_hash`       | String - [Hash][]         | The identifying hash of the previous ledger. |
| `total_coins`       | [String - Number][]       | The total number of "drops" of XRP still in existence at the time of the ledger. (Each XRP is 1,000,000 drops.) |
| `close_time_res`    | Number                    | The ledger close time is rounded to this many seconds. |
| `accounts_hash`     | String - [Hash][]         | Hash of the account information contained in this ledger, as hex. |
| `transaction_hash` | String - [Hash][]         | Hash of the transaction information contained in this ledger, as hex. |
| `close_time`        | Number                    | When this ledger was closed, in UNIX time. |
| `close_time_human`  | String - [Timestamp][]    | When this ledger was closed. |

**Note:** Ledger close times are approximate, typically rounded to about 10 seconds. Two ledgers could have the same `close_time` values, when their actual close times were several seconds apart. The ledger index makes it unambiguous which ledger closed first.

### Genesis Ledger

Due to a mishap early in the XRP Ledger's history, ledgers 1 through 32569 were lost. Thus, ledger #32570 is the earliest ledger available anywhere. For purposes of the Data API v2, ledger #32570 is considered the _genesis ledger_.

## Account Creation Objects

An account creation object represents the action of creating an account in the XRP Ledger. There are two variations, depending on whether the account was already present in ledger 32570, the earliest ledger available. Accounts that were already present in ledger 32570 are termed _genesis accounts_.

| Field             | Value                        | Description               |
|:------------------|:-----------------------------|:--------------------------|
| `address`         | String - [Address][]         | The identifying address of this account, in base-58. |
| `inception`       | String - [Timestamp][]       | The UTC timestamp when the address was funded. For genesis accounts, this is the timestamp of ledger 32570. |
| `ledger_index`    | Number - [Ledger Index][]    | The ledger index of the ledger when the account was created, or 32570 for genesis accounts. |
| `parent`          | String - [Address][]         | (Omitted for genesis accounts) The address that provided the XRP to fund this address. |
| `tx_hash`         | String - [Hash][]            | (Omitted for genesis accounts) The identifying hash of the transaction that funded this account. |
| `initial_balance` | [String - Number][]          | (Omitted for genesis accounts) The amount of XRP that funded this account. |
| `genesis_balance` | [String - Number][]          | (Genesis accounts only) The amount of XRP this account held as of ledger #32570. |
| `genesis_index`   | Number - [Sequence Number][] | (Genesis accounts only) The transaction sequence number of the account as of ledger #32570. |


## Exchange Objects
[Exchange Objects]: #exchange-objects

An exchange object represents an actual exchange of currency, which can occur in the XRP Ledger as the result of executing either an OfferCreate transaction or a Payment transaction. In order for currency to actually change hands, there must be a previously-unfilled Offer previously placed in the ledger with an OfferCreate transaction.

A single transaction can cause several exchanges to occur. In this case, the sender of the transaction is the taker for all the exchanges, but each exchange has a different provider, currency pair, or both.

| Field                  | Value                        | Description          |
|:-----------------------|:-----------------------------|:---------------------|
| `base_amount`          | Number                       | The amount of the base currency that was traded. |
| `counter_amount`       | Number                       | The amount of the counter currency that was traded. |
| `rate`                 | Number                       | The amount of the counter currency acquired per 1 unit of the base currency. |
| `autobridged_currency` | String - [Currency Code][]   | (May be omitted) If the offer was autobridged (XRP order books were used to bridge two non-XRP currencies), this is the other currency from the offer that executed this exchange. |
| `autobridged_issuer`   | String - [Address][]         | (May be omitted) If the offer was autobridged (XRP order books were used to bridge two non-XRP currencies), this is the other currency from the offer that executed this exchange. |
| `base_currency`        | String - [Currency Code][]   | The base currency.   |
| `base_issuer`          | String - [Address][]         | (Omitted for XRP) The account that issued the base currency. |
| `buyer`                | String - [Address][]         | The account that acquired the base currency. |
| `client`               | String                       | (May be omitted) If the transaction contains a memo indicating what client application sent it, this is the contents of the memo. |
| `counter_currency`     | String - [Currency Code][]   | The counter currency. |
| `counter_issuer`       | String - [Address][]         | (Omitted for XRP) The account that issued the counter currency. |
| `executed_time`        | String - [Timestamp][]       | The time the exchange occurred. |
| `ledger_index`         | Number - [Ledger Index][]    | The ledger index of the ledger that included this transaction. |
| `offer_sequence`       | Number - [Sequence Number][] | The sequence number of the `provider`'s existing offer in the ledger. |
| `provider`             | String - [Address][]         | The account that had an existing Offer in the ledger. |
| `seller`               | String - [Address][]         | The account that acquired the counter currency. |
| `taker`                | String - [Address][]         | The account that sent the transaction which executed this exchange. |
| `tx_hash`              | String - [Hash][]            | The identifying hash of the transaction that executed this exchange. (**Note:** This exchange may be one of several executed in a single transaction.) |
| `tx_type`              | String                       | The type of transaction that executed this exchange, either `Payment` or `OfferCreate`. |


## Reports Objects
[Reports Objects]: #reports-objects

Reports objects show the activity of a given account over a specific interval of time, typically a day. Reports have the following fields:

| Field                      | Value                                | Description |
|:---------------------------|:-------------------------------------|:---------|
| `account`                  | String - [Address][]                 | The address of the account to which this report pertains. |
| `date`                     | String - [Timestamp][]               | The start of the interval to which this report pertains. |
| `high_value_received`      | [String - Number][]                  | Largest amount received in a single transaction, normalized to XRP (as closely as possible). This includes payments and exchanges. |
| `high_value_sent`          | [String - Number][]                  | The largest amount sent in a single transaction, normalized to XRP (as closely as possible). |
| `payments`                 | Array of [Payment Summary Objects][] | (May be omitted) Array with information on each payment sent or received by the account during this interval. |
| `payments_received`        | Number                               | The number of payments sent to this account. (This only includes payments for which this account was the destination, not payments that only rippled through the account or consumed the account's offers.) |
| `payments_sent`            | Number                               | The number of payments sent by this account. |
| `receiving_counterparties` | Array or Number                      | If account lists requested, an array of addresses that received payments from this account. Otherwise, the number of different accounts that received payments from this account. |
| `sending_counterparties`   | Array or Number                      | If account lists requested, an array of addresses that sent payments to this account. Otherwise, the number of different accounts that sent payments to this account. |
| `total_value`              | [String - Number][]                  | Sum of total value received and sent in payments, normalized to XRP (as closely as possible). |
| `total_value_received`     | [String - Number][]                  | Sum value of all payments to this account, normalized to XRP (as closely as possible). |
| `total_value_sent`         | [String - Number][]                  | Sum value of all payments from this account, normalized to XRP (as closely as possible). |

## Payment Summary Objects
[Payment Summary Objects]: #payment-summary-objects

A Payment Summary Object contains a reduced amount of information about a single payment from the perspective of either the sender or receiver of that payment.

| Field              | Value                      | Description                |
|:-------------------|:---------------------------|:---------------------------|
| `tx_hash`          | String - [Hash][]          | The identifying hash of the transaction that caused the payment. |
| `delivered_amount` | [String - Number][]        | The amount of the destination `currency` actually received by the destination account. |
| `currency`         | String - [Currency Code][] | The currency delivered to the recipient of the transaction. |
| `issuer`           | String - [Address][]       | The gateway issuing the currency, or an empty string for XRP. |
| `type`             | String                     | Either `sent` or `received`, indicating whether the perspective account is sender or receiver of this transaction. |


## Payment Objects
[Payment Objects]: #payment-objects

In the Data API, a Payment Object represents an event where one account sent value to another account. This mostly lines up with XRP Ledger transactions of the `Payment` [transaction type](transaction-types.html), except that the Data API does not consider a transaction to be a payment if the sending `Account` and the `Destination` account are the same, or if the transaction failed.

Payment objects have the following fields:

| Field                         | Value                      | Description     |
|:------------------------------|:---------------------------|:----------------|
| `amount`                      | [String - Number][]        | The amount of the destination `currency` that the transaction was instructed to send. In the case of Partial Payments, this is a "maximum" amount. |
| `delivered_amount`            | [String - Number][]        | The amount of the destination `currency` actually received by the destination account. |
| `destination_balance_changes` | Array                      | Array of [balance change objects][], indicating all changes made to the `destination` account's balances. |
| `source_balance_changes`      | Array                      | Array of [balance change objects][], indicating all changes to the `source` account's balances (except the XRP transaction cost). |
| `transaction_cost`            | [String - Number][]        | The amount of XRP spent by the `source` account on the transaction cost. (Prior to [v2.0.4][], this parameter was called `fee`.) |
| `destination_tag`             | Integer                    | (May be omitted) A [destination tag](become-an-xrp-ledger-gateway.html#source-and-destination-tags) specified in this payment. |
| `source_tag`                  | Integer                    | (May be omitted) A [source tag](become-an-xrp-ledger-gateway.html#source-and-destination-tags) specified in this payment. |
| `currency`                    | String - [Currency Code][] | The currency that the `destination` account received. |
| `destination`                 | String - [Address][]       | The account that received the payment. |
| `executed_time`               | String - [Timestamp][]     | The time the ledger that included this payment closed. |
| `ledger_index`                | Number - [Ledger Index][]  | The ledger index of the ledger that included this payment. |
| `source`                      | String - [Address][]       | The account that sent the payment. |
| `source_currency`             | String - [Currency Code][] | The currency that the `source` account spent. |
| `tx_hash`                     | String - [Hash][]          | The identifying hash of the transaction that caused the payment. |


## Balance Objects and Balance Change Objects
[balance change objects]: #balance-objects-and-balance-change-objects
[Balance Object]: #balance-objects-and-balance-change-objects

Balance objects represent an XRP Ledger account's balance in a specific currency with a specific counterparty at a single point in time. Balance change objects represent a change to such balances that occurs in transaction execution.

A single XRP Ledger transaction may cause changes to balances with several counterparties, as well as changes to XRP.

Balance objects and Balance Change objects have the same format, with the following fields:

| Field          | Value                      | Description                    |
|:---------------|:---------------------------|:-------------------------------|
| `counterparty` | String - [Address][]       | The counterparty, or issuer, of the `currency`. In the case of XRP, this is an empty string. |
| `currency`     | String - [Currency Code][] | The currency for which this balance changed. |
| `value`        | [String - Number][]        | The amount of the `currency` that the associated account gained or lost. In balance change objects, this value can be positive (for amounts gained) or negative (for amounts lost). In balance objects, this value can be positive (for amounts the counterparty owes the account) or negative (for amounts owed to the counterparty). |


## Balance Change Descriptors
[Balance Change Descriptors]: #balance-change-descriptors

Balance Change Descriptors are objects that describe and analyze a single balance change that occurs in transaction execution. They represent the same events as [balance change objects][], but in greater detail.

Balance Change Descriptors have the following fields:

| Field           | Value                      | Description                   |
|:----------------|:---------------------------|:------------------------------|
| `amount_change` | [String - Number][]        | The difference in the amount of currency held before and after this change. _(Prior to [v2.0.6][], this field was called `change`.)_ |
| `final_balance` | [String - Number][]        | The balance after the change occurred. |
| `node_index`    | Number (or `null`)         | This balance change is represented by the entry at this index of the ModifiedNodes array within the metadata section of the transaction that executed this balance change. **Note:** When the transaction cost is combined with other changes to XRP balance, the transaction cost has a `node_index` of **null** instead. |
| `tx_index`      | Number                     | The transaction that executed this balance change is at this index in the array of transactions for the ledger that included it. |
| `change_type`   | String                     | One of several [](#change-types) describing what caused this balance change to occur. |
| `currency`      | String - [Currency Code][] | The change affected this currency. |
| `executed_time` | String - [Timestamp][]     | The time the change occurred. (This is based on the close time of the ledger that included the transaction that executed the change. |
| `counterparty`  | String - [Address][]       | (Omitted for XRP) The `currency` is held in a trust line to or from this account. _(Prior to [v2.0.6][], this field was called `issuer`.)_ |
| `ledger_index`  | Number - [Ledger Index][]  | The ledger index of the ledger that included the transaction that executed this balance change. |
| `tx_hash`       | String - [Hash][]          | The identifying hash of the transaction that executed this balance change. |

### Change Types

The following values are valid for the `change_type` field of a Balance Change Descriptor:

| Value                 | Meaning                                              |
|:----------------------|:-----------------------------------------------------|
| `transaction_cost`    | This balance change reflects XRP that was destroyed to relay a transaction. _(Prior to [v2.0.4][], this was `network fee` instead.)_ |
| `payment_destination` | This balance change reflects currency that was received from a payment. |
| `payment_source`      | This balance change reflects currency that was spent in a payment. |
| `exchange`            | This balance change reflects currency that was traded for other currency, or the same currency from a different issuer. This can occur in the middle of payment execution as well as from offers. |

## Volume Objects
[Volume Objects]: #volume-objects

Volume objects represent the total volumes of money moved, in either payments or exchanges, during a given period.

| Field           | Value                  | Description                       |
|:----------------|:-----------------------|:----------------------------------|
| `components`    | Array of Objects       | The data that was used to assemble this total. For payment volume, each object represents payments in a particular currency and issuer. For exchange volume, each object represents a market between two currencies. |
| `count`         | Number                 | The total number of exchanges in this period. |
| `end_time`      | String - [Timestamp][] | The end time of this interval.    |
| `exchange`      | Object                 | Indicates the display currency used, as with fields `currency` and (except for XRP) `issuer`. All amounts are normalized by first converting to XRP, and then to the display currency specified in the request. |
| `exchange_rate` | Number                 | The exchange rate to the displayed currency from XRP. |
| `start_time`    | String - [Timestamp][] | The start of this period.         |
| `total`         | Number                 | Total volume of all recorded exchanges in the period. |


## Server Objects
[Server Object]: #server-objects
[Server Objects]: #server-objects

A "Server Object" describes one `rippled` server in the XRP Ledger peer-to-peer network. Server objects are returned by the [Get Topology](#get-topology), [Get Toplogy Nodes](#get-topology-nodes), and [Get Topology Node](#get-topology-node) methods. The Data API collects reported network topology approximately every 30 seconds using the [peer crawler](peer-crawler.html).

Server objects have the following fields, with some only appearing if the request specified a verbose response:

| Field              | Value                           | Description           |
|:-------------------|:--------------------------------|:----------------------|
| `node_public_key`  | String - Base-58 [Public Key][] | The public key used by this server to sign its peer-to-peer communications, not including validations. |
| `version`          | String                          | The `rippled` version of this server, when it was last asked. |
| `uptime`           | Integer                         | Number of seconds this server has been connected to the network. |
| `ip`               | String                          | (May be omitted) IP address of the node (may be omitted). |
| `port`             | Integer                         | (May be omitted) Port where this server speaks the [`rippled` Peer Protocol](peer-protocol.html). |
| `inbound_count`    | Integer                         | (May be omitted) Number of inbound peer-to-peer connections to this server. |
| `inbound_added`    | String                          | (May be omitted) Number of new inbound peer-to-peer connections since the last measurement. |
| `inbound_dropped`  | String                          | (May be omitted) Number of inbound peer-to-peer connections dropped since the last measurement. |
| `outbound_count`   | Integer                         | (May be omitted) Number of outbound peer-to-peer connections to this server. |
| `outbound_added`   | String                          | (May be omitted) Number of new outbound peer-to-peer connections since the last measurement. |
| `outbound_dropped` | String                          | (May be omitted) Number of outbound peer-to-peer connections dropped since the last measurement. |
| `city`             | String                          | (Verbose only) The city where this server is located, according to IP geolocation. |
| `region`           | String                          | (Verbose only) The region where this server is located, according to IP geolocation. |
| `country`          | String                          | (Verbose only) The country where this server is located, according to IP geolocation. |
| `region_code`      | String                          | (Verbose only) The ISO code for the region where this server is located, according to IP geolocation. |
| `country_code`     | String                          | (Verbose only) The ISO code for the country where this server is located, according to IP geolocation. |
| `postal_code`      | String                          | (Verbose only) The postal code where this server is located, according to IP geolocation. |
| `timezone`         | String                          | (Verbose only) The ISO timezone where this server is located, according to IP geolocation. |
| `lat`              | String                          | (Verbose only) The latitude where this server is located, according to IP geolocation. |
| `long`             | String                          | (Verbose only) The longitude where this server is located, according to IP geolocation. |
| `isp`              | String                          | (Verbose only) The Internet Service Provider hosting this server's public IP address. |
| `org`              | String                          | (Verbose only) The organization that owns this server's public IP address. |


## Link Objects
[Link Object]: #link-objects
[Link Objects]: #link-objects

A Link Object represents a peer-to-peer network connection between two `rippled` servers. It has the following fields:

| Field    | Value                           | Description                     |
|:---------|:--------------------------------|:--------------------------------|
| `source` | String - Base-58 [Public Key][] | The node public key of the `rippled` making the outgoing connection. |
| `target` | String - Base-58 [Public Key][] | The node public key of the `rippled` receiving the incoming connection. |


## Validation Objects
[Validation Object]: #validation-objects
[Validation Objects]: #validation-objects

A Validation Object represents one vote from a validator to mark a ledger version as validated. (A ledger is only validated by the consensus process if a quorum of trusted validators votes for the same exact ledger version.)

**Note:** The Data API keeps only about 6 months of validation vote data.

A Validation Object has the following fields:

| Field                   | Value                           | Description      |
|:------------------------|:--------------------------------|:-----------------|
| `count`                 | Integer                         | (May be omitted) The number of `rippled` servers that reported seeing this validation. Not available for old data. |
| `ledger_hash`           | String - [Hash][]               | The hash of the ledger version this validation vote applies to. |
| `reporter_public_key`   | String - Base-58 [Public Key][] | The public key of the `rippled` server that first reported this validation, in base-58. |
| `validation_public_key` | String - Base-58 [Public Key][] | The public key of the validator used to sign this validation, in base-58. |
| `signature`             | String                          | The validator's signature of the validation details, in hexadecimal. |
| `first_datetime`        | String - [Timestamp][]          | Date and time of the first report of this validation. |
| `last_datetime`         | String - [Timestamp][]          | Date and time of the last report of this validation. |




<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
