# Ripple Charts API #

The Ripple Charts API, also known as the **Data API**, provides past and present information about the state of the Ripple Network through an HTTP API, with additional information calculated for analysis purposes. The Ripple Charts API is used as a data source by applications such as [Ripple Charts](https://www.ripplecharts.com/) and [ripple.com](https://www.ripple.com/).

(The API does not follow the conventions of a REST API, but you can use an HTTP client to access it in the same way you would access a REST API.)

* [Architecture](#architecture)
* [Setup](#setup)
* [API Method Reference](#api-method-reference)



# Architecture #

The Ripple Charts API is a [Node.js](https://nodejs.org/) application that uses [CouchDB](https://couchdb.apache.org/) and [Redis](http://redis.io/) as its datastore. The Charts API continually monitors rippled for new ledgers and imports them.

## Components ##

### Ledger Importer ###
The ledger importer imports ledgers from the Ripple Network into the data store.  The process is set up to import continously in real time as ledgers are validated, and also import historical ledgers.

### Data Store ###
The data store uses CouchDB to store ledgers as a JSON document.  To retrieve structured data from the ledgers, the Charts API uses "views" that index specific elements from the ledger into a format that can be queried efficiently.  For example, one view collects all successful transactions that exercise offers and indexes them according to the currencies, issuers, and date, and returns the amounts and prices of the exercised offers.  We can then query this view and group the indexed results by time increments to get an array of offers excercised over time for a given pair of currencies.

### API Server ###
Accessing the historical data is not done by querying the database directly but through a node.js API server.  The server takes requests in the form of JSON data, interprets it into one or several couchDB queries, processes the data as necessary and returns the results.

### Memory Cache ###
To reduce the load on CouchDB, the Charts API uses Redis as a caching layer.  The cache expects the data stored in CouchDB to be accurate and up to date, so the API automatically disables the cache if the importer is unable to keep up. When the importer catches up, the API restarts the cache again.


# Setup #

Basic setup of the Ripple Charts API involves the following steps:

1. Install Node.js
2. Install CouchDB, or get access to a hosted CouchDB.
3. Install Redis. (This step is optional, but strong recommended.)
4. Clone the Ripple Charts repository:<br/>
    `git clone https://github.com/ripple/ripple-data-api.git`
5. Install dependencies using [npm](https://www.npmjs.com/):<br/>
    `npm install`
6. Copy the example configuration files to their expected locations:<br/>
    In the `ripple-data-api` top folder:<br/>
    `cp db.config.json.example db.config.json`<br/>
    `cp deployment.environments.json.example deployment.environments.json`
7. Modify the configuration files, providing the addresses and credentials of your CouchDB and Redis databases.
8. Push design documents to CouchDB:<br/>
    `grunt updateViews`<br/>
    (This requires write permissions to the CouchDB instance.)

At this point, the Ripple Charts API is installed, but not running, and has no data imported. You can [start the API service](#start-api-service) or [start the ledger importer](#start-ledger-importer) in any order.

## Start API Service ##

The following command starts the API service:

`grunt watch`

(This requires read permissions to CouchDB. Write permissions are not necessary.)

## Start Ledger Importer ##

The following command starts the ledger importer service:

`node db/importer`

Alternatively, you can use the experimental websocket-based importer:

`node db/import`

(Either way, you need write permission to the CouchDB database.)



# Formatting Conventions #

Requests to the Charts API generally take the same format:

- Use the HTTP POST method
- The URL defines the API method to use
- All parameters are in the request body.
- The `Content-Type` header has the value `application/json`. **Caution:** If you omit or specify the wrong Content-Type, the API may respond with misleading error messages such as `{"error":"Please specify an account"}`

## Dates and Times ##
[Date-Time]: #dates-and-times

The Ripple Charts API uses Moment.js to parse strings, and therefore accepts [any date-time string that Moment.js recognizes](http://momentjs.com/docs/#supported-iso-8601-strings) as input.

The Ripple Charts API always outputs dates in UTC, in the following format:

YYYY-MM-DDThh-mm-ss+00:00

For example:
`2015-03-01T00:00:00+00:00`
(midnight exactly on March 3, 2015 UTC)


## Currency Objects ##
[Currency Object]: #currency-objects

Many methods define **a currency** as an object with the following fields:

| Field | Value | Description |
|-------|-------|-------------|
| currency | String | Three-letter [ISO 4217 Currency Code](http://www.xe.com/iso4217.php) string, or a 160-bit hex string according to Ripple's internal [Currency format](https://wiki.ripple.com/Currency_format). |
| issuer | String | Account address of the counterparty holding the currency. Usually an issuing gateway in the Ripple network. Omitted or `null` for XRP. |

Some methods describe **an amount of currency**, for example a quantity traded in a currency exchange. In [JSON format][Response Format], this takes the form of a nested JSON object with the following fields:

| Field | Value | Description |
|-------|-------|-------------|
| currency | String | Same as the `currency` field of a currency object. |
| issuer | String | Same as the `issuer` field of a currency object. |
| amount | Number | The quantity of the currency exchanged. |

In [CSV or array format][Response Format], a currency amount is specified as three separate attributes that correspond to the fields of the JSON object. The name of the fields depends on the context: for example, the `baseAmount` column is equivalent to the `amount` field of the `base` currency amount object.

**Warning:** JavaScript's native number type does not support `rippled`'s full range of precision. When dealing with very large or very small numbers, the `amount` values returned by the Charts API lose precision.

## Response Formats ##
[Response Format]: #response-formats

Several methods provide a `format` parameter, which lets you request results in one of three formats:

* `csv` - [Comma-separated-values](http://en.wikipedia.org/wiki/Comma-separated_values) table. The first line is a row of column headers, and each subsequent line represents one result or interval, with its attributes in columns. The columns are separated by comma (`,`) characters.
* `json` - The request contains some top-level information at the top level, and a `results` array. Each member of the `results` array is a JSON object with attributes and values that represent one result or interval.
* **Two-dimensional array format** - If neither `csv` nor `json` is specified, the API returns an array of JSON arrays, in a format that resembles CSV. The first member of the top-level array is an array of table headers, and each subsequent member is a nested array representing one result or interval, with its members corresponding to the attribute names in the header row.



# API Method Reference #

To use a method in this document, append the path for that method to the hostname of the Charts API instance you want to use.  Ripple Labs runs a public instance of the Ripple Charts API with full data, available at:

**https://api.ripplecharts.com**

The API provides the following methods:

* [Account Offers Exercised - `POST /api/account_offers_exercised`](#account-offers-exercised)
* [Account Transaction Stats - `POST /api/account_transaction_stats`](#account-transaction-stats)
* [Account Transactions - `POST /api/account_transactions`](#account-transactions)
* [Accounts Created - `POST /api/accounts_created`](#accounts-created)
* [Exchange Rates - `POST /api/exchange_rates`](#exchange-rates)
* [Issuer Capitalization - `POST /api/issuer_capitalization`](#issuer-capitalization)
* [Ledgers Closed - `POST /api/ledgers_closed`](#ledgers-closed)
* [Market Traders - `POST /api/market_traders`](#market-traders)
* [Offers - `POST /api/offers`](#offers)
* [Offers Exercised - `POST /api/offers_exercised`](#offers-exercised)
* [Top Markets - `POST /api/top_markets`](#top-markets)
* [Total Network Value - `POST /api/total_network_value`](#total-network-value)
* [Total Value Sent - `POST /api/total_value_sent`](#total-value-sent)
* [Transaction Stats - `POST /api/transaction_stats`](#transaction-stats)
* [Value Sent - `POST /api/value_sent`](#value-sent)


## Account Offers Exercised ##
[[Source]<br>](https://github.com/ripple/ripple-data-api/blob/master/api/routes/accountOffersExercised.js "Source")

Retrieve currency-exchange orders being exercised for a single account.

#### Request Format ####

<div class='multicode'>

*JSON*

```
POST /api/account_offers_exercised
{
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "startTime": "2014",
    "limit": 5,
    "offset": 0,
    "format": "json"
}
```

*CSV*

```
POST /api/account_offers_exercised
{
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "startTime": "2014",
    "limit": 5,
    "offset": 0,
    "format": "csv"
}
```

*Array*

```
POST /api/account_offers_exercised
{
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "startTime": "2014",
    "limit": 5,
    "offset": 0
}
```

</div>

The request includes the following body parameters:

| Field | Value | Description |
|-------|-------|-------------|
| account | String (Ripple address) | Retrieve currency-exchange orders exercised as a result of this account sending a transaction, or another transaction modifying an order previously placed by this account. |
| startTime | String ([Date-Time][]) | (Optional) Retrieve information starting at this time. Defaults to 30 days before `endTime`. |
| endTime | String ([Date-Time][]) | (Optional) Retrieve information ending at this time. Defaults to the current time. |
| descending | Boolean | (Optional) If true, return results in descending order. Defaults to false. |
| limit | Number | (Optional) The maximum number of transactions to return in one response. Use with `offset` to paginate results. Defaults to 500. |
| offest | Number | (Optional) The number of transactions to skip before returning results. Use with `limit` to paginate results. Defaults to 0. |
| format | String | (Optional) The [Response Format][] to use: `csv` or `json`. If omitted, defaults to a CSV-like JSON array format. |

#### Response Format ####

The format of the response depends on the `format` parameter from the request. See [Response Format][] for details. Examples of successful responses:

<div class='multicode'>

*JSON*

```
{
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "startTime": "2014-01-01T00:00:00+00:00",
    "endTime": "2015-03-09T21:05:27+00:00",
    "results": [
        {
            "base": {
                "currency": "XRP",
                "issuer": null,
                "amount": 0.00001
            },
            "counter": {
                "currency": "USD",
                "issuer": "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc",
                "amount": 5.080000065049717e-8
            },
            "type": "buy",
            "rate": 196.8503937007874,
            "counterparty": "rUrgXPxenRbjnFDXKWUhH8mBJcQ2CyPfkG",
            "time": "2014-09-17T21:47:00+00:00",
            "txHash": "9D591B18EDDD34F0B6CF4223A2940AEA2C3CC778925BABF289E0011CD8FA056E",
            "ledgerIndex": 8924146
        }
    ]
}
```

*CSV*

```
baseCurrency, baseIssuer, baseAmount, counterCurrency, counterIssuer, counterAmount, type, rate, counterparty, time, txHash, ledgerIndex
XRP, , 0.00001, USD, rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc, 5.080000065049717e-8, buy, 196.8503937007874, rUrgXPxenRbjnFDXKWUhH8mBJcQ2CyPfkG, 2014-09-17T21:47:00+00:00, 9D591B18EDDD34F0B6CF4223A2940AEA2C3CC778925BABF289E0011CD8FA056E, 8924146
```

*Array*

```
[
    [
        "baseCurrency",
        "baseIssuer",
        "baseAmount",
        "counterCurrency",
        "counterIssuer",
        "counterAmount",
        "type",
        "rate",
        "counterparty",
        "time",
        "txHash",
        "ledgerIndex"
    ],
    [
        "XRP",
        null,
        0.00001,
        "USD",
        "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc",
        5.080000065049717e-8,
        "buy",
        196.8503937007874,
        "rUrgXPxenRbjnFDXKWUhH8mBJcQ2CyPfkG",
        "2014-09-17T21:47:00+00:00",
        "9D591B18EDDD34F0B6CF4223A2940AEA2C3CC778925BABF289E0011CD8FA056E",
        8924146
    ]
]
```

</div>

Each result in the response describes an individual transaction that exercised a currency exchange on the account. This includes [OfferCreate](transactions.html#offercreate) and cross-currency [Payment](transactions.html#payment) transactions that the account sent, as well as transactions that consumed an offer that the account had previously placed.

| Field | Type | Description |
|-------|------|-------------|
| base | Object ([Currency Amount][Currency Object]) | (JSON format only) Amount of one currency exchanged in this transaction. |
| baseCurrency | String ([currency name][Currency Object]) | (CSV and array formats only) Name of the base currency exchanged in this transaction. |
| baseIssuer | String ([currency issuer][Currency Object]) | (CSV and array formats only) Issuer of the base currency exchanged in this transaction. |
| baseAmount | String ([currency amount][Currency Object]) | (CSV and array formats only) Quantity of the base currency exchanged in this transaction. | 
| counter | Object ([Currency Amount][Currency Object]) | (JSON format only) Amount of the other currency exchanged in this transaction. |
| counterCurrency | String ([currency name][Currency Object]) | (CSV and array formats only) Name of the counter currency exchanged in this transaction. |
| counterIssuer | String ([currency issuer][Currency Object]) | (CSV and array formats only) Issuer of the counter currency exchanged in this transaction. |
| counterAmount | String ([currency amount][Currency Object]) | (CSV and array formats only) Quantity of the counter currency exchanged in this transaction. | 
| type | String | Either `buy` or `sell`. If the specified account sent the transaction, `buy` means the account acquired the counter currency. If another account sent the transaction, `buy` means the specified account acquired the base currency. (In both cases, `sell` means the reverse.) |
| rate | Number | The exchange ratio between the base and counter currency. |
| counterparty | String (Ripple address) | The other account involved in this exchange. |
| time | String ([Date-Time][]) | The time this transaction occurred, as defined by the close time of the ledger that included it. |
| txHash | String (Transaction Hash) | The identifying hash of the Ripple transaction that performed this exchange, as a hex string. |
| ledgerIndex | Number | The sequence number of the ledger that included this transaction. |


## Account Transaction Stats ##
[[Source]<br>](https://github.com/ripple/ripple-data-api/blob/develop/api/routes/accountTransactionStats.js "Source")

**DEPRECATED** This API method may return inaccurate results. Do not use it.

#### Request Format ####

<div class='multicode'>

*Expanded*

```
POST /api/account_transaction_stats
{
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "startTime": "Mar 9, 2014",
    "endTime": "Mar 10, 2015",
    "timeIncrement": "all",
    "descending": false,
    "reduce": false,
    "limit": 5,
    "offset": 0,
    "format": "json"
}
```

*Reduced*

```
POST /api/account_transaction_stats
{
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "startTime": "Mar 9, 2014",
    "endTime": "Mar 10, 2015",
    "timeIncrement": "hour",
    "descending": true,
    "reduce": true,
    "limit": 5,
    "offset": 0,
    "format": "json"
}
```

</div>

The request includes the following body parameters:

| Field | Value | Description |
|-------|-------|-------------|
| account | String (Ripple address) | Retrieve information about transactions sent by this account. |
| startTime | String ([Date-Time][]) | (Optional) Retrieve information starting at this time. Defaults to 30 days before `endTime`. |
| endTime | String ([Date-Time][]) | (Optional) Retrieve information ending at this time. Defaults to the current time. |
| timeIncrement | String | (Optional) Divide results into intervals of the specified length: `year`, `month`, `day`, `hour`, `minute`, or `second`. The value `all` collapses the results into just one interval. Defaults to `all`. Ignored if `reduce` is `false`. |
| descending | Boolean | (Optional) If true, return results with the most recent first. Defaults to true. |
| reduce | Boolean | (Optional) If `false`, include transactions individually instead of collapsing them into results over time. Defaults to `true`. |
| limit | Number | (Optional) The maximum number of transactions to return in one response. Use with `offset` to paginate results. Defaults to 500. |
| offest | Number | (Optional) The number of transactions to skip before returning results. Use with `limit` to paginate results. Defaults to 0. |
| format | String | (Optional) The [Response Format][] to use: `csv` or `json`. If omitted, defaults to a CSV-like JSON array format. |

#### Response Format ####

**DEPRECATED** Do not use this method.

An example of a successful response:

<div class='multicode'>

*Expanded*

```
{
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "startTime": "2014-03-09T00:00:00+00:00",
    "endTime": "2015-03-10T00:00:00+00:00",
    "timeIncrement": "all",
    "results": [
        {
            "time": "2014-06-02T22:47:50+00:00",
            "type": "Payment",
            "txHash": "7BF105CFE4EFE78ADB63FE4E03A851440551FE189FD4B51CAAD9279C9F534F0E",
            "ledgerIndex": 6979192
        },
        {
            "time": "2014-06-04T19:16:50+00:00",
            "type": "Payment",
            "txHash": "33EA42FC7A06F062A7B843AF4DC7C0AB00D6644DFDF4C5D354A87C035813D321",
            "ledgerIndex": 7013674
        },
        {
            "time": "2014-09-05T19:59:50+00:00",
            "type": "Payment",
            "txHash": "82230B9D489370504B39BC2CE46216176CAC9E752E5C1774A8CBEC9FBB819208",
            "ledgerIndex": 8711125
        },
        {
            "time": "2014-09-10T23:22:20+00:00",
            "type": "Payment",
            "txHash": "6A6E503211A32F7AB92FE747A8AD2759A1E597055CB8961F0B2FEDE3A53975AB",
            "ledgerIndex": 8803725
        },
        {
            "time": "2014-09-11T00:11:40+00:00",
            "type": "AccountSet",
            "txHash": "439E2E369C81A6F21E9EA2C7CA3094E74A792B1D1CE7EEA58A52FEFF7A1626CB",
            "ledgerIndex": 8804356
        }
    ]
}
```

*Reduced*

```
{
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "startTime": "2014-09-12T00:00:00+00:00",
    "endTime": "2014-09-05T00:00:00+00:00",
    "timeIncrement": "hour",
    "results": [
        {
            "AccountSet": 1,
            "time": "2014-09-11T00:00:00+00:00"
        },
        {
            "Payment": 1,
            "time": "2014-09-10T23:00:00+00:00"
        },
        {
            "Payment": 1,
            "time": "2014-09-05T19:00:00+00:00"
        }
    ]
}
```

</div>

**If the results are not reduced** (the default), then each result represents an individual transaction, with the following attributes, in order:

| Field | Type | Description |
|-------|------|-------------|
| time | String ([Date-Time][]) | The time this transaction occurred. |
| type | String | The transaction type. Valid types are: `AccountSet`, `OfferCancel`, `OfferCreate`, `Payment`, `SetFee`, `SetRegularKey`, and `TrustSet` |
| txHash | String (Transaction Hash) | The identifying hash of this transaction. |
| ledgerIndex | Number (Ledger Index) | The identifying sequence number of the ledger that included this transaction. |


**If the results are reduced** (the request used `"reduce":true`), then each result represents an interval of time, with the following attributes, in order:

| Field | Type | Description |
|-------|------|-------------|
| time | String ([Date-Time][]) | The time at which this interval begins. |
| Payment | Number | (May be omitted) The number of Payment transactions during this interval sent by the specified account. |
| OfferCreate | Number | (May be omitted) The number of OfferCreate transactions during this interval sent by the specified account. |
| OfferCancel | Number | (May be omitted) The number of OfferCancel transactions during this interval sent by the specified account. |
| TrustSet | Number | (May be omitted) The number of TrustSet transactions during this interval sent by the specified account. |
| AccountSet | Number | (May be omitted) The number of AccountSet transactions during this interval sent by the specified account. |
| SetFee | Number | (May be omitted) The number of SetFee pseudo-transactions during this interval sent by the specified account. Since SetFee is a pseudo-transaction, this transaction type only appears for [ACCOUNT_ZERO](https://wiki.ripple.com/Accounts#ACCOUNT_ZERO). |
| SetRegularKey |  Number | (May be omitted) The number of Payment transactions during this interval sent by the specified account. |

Each of the transaction type attributes is omitted when there is no data. In CSV or array format, columns are included for each type that has a nonzero value in any interval. In JSON format, each interval includes fields only for the types that have nonzero values in that particular interval.


## Account Transactions ##
[[Source]<br>](https://github.com/ripple/ripple-data-api/blob/develop/api/routes/accountTransactions.js "Source")

**DEPRECATED** This API method may return inaccurate results. Do not use it.

#### Request Format ####

<div class='multicode'>

*JSON*

```
POST /api/account_transactions
{
    "account":   "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "startTime" : "jan 1, 2014 10:00 am",
    "endTime"   : "mar 15, 2015 10:00 am",
    "descending": true,
    "limit": 5,
    "offset": 0,
    "format"    : "json"
}

```

</div>

The request includes the following body parameters:

| Field | Value | Description |
|-------|-------|-------------|
| account | String (Ripple address) | Retrieve transactions sent or received by this account. |
| startTime | String ([Date-Time][]) | (Optional) Retrieve information starting at this time. Defaults to 30 days before `endTime`. |
| endTime | String ([Date-Time][]) | (Optional) Retrieve information ending at this time. Defaults to the current time. |
| descending | Boolean | (Optional) If true, return results with the most recent first. Defaults to false. |
| limit | Number | (Optional) The maximum number of transactions to return in one response. Use with `offset` to paginate results. Defaults to 500. |
| offest | Number | (Optional) The number of transactions to skip before returning results. Use with `limit` to paginate results. Defaults to 0. |
| format | String | (Optional) The [Response Format][] to use: `csv` or `json`. If omitted, defaults to a CSV-like JSON array format. |

#### Response Format ####

This method is **DEPRECATED**. Do not use it.


## Accounts Created ##
[[Source]<br>](https://github.com/ripple/ripple-data-api/blob/develop/api/routes/accountsCreated.js "Source")

Retrieve information about the creation of new Ripple accounts.

#### Request Format ####

<div class='multicode'>

*Reduced*

```
POST /api/accounts_created
{
    "startTime": "jan 1, 2014 10:00 am",
    "endTime": "mar 15, 2015 10:00 am",
    "timeIncrement": "month",
    "descending": true,
    "reduce": true,
    "format": "json"
}
```

*Expanded*

```
POST /api/accounts_created
{
    "startTime": "mar 15, 2015 9:00 am",
    "endTime": "mar 15, 2015 5:00 pm",
    "descending": true,
    "reduce": false,
    "limit": 5,
    "offset": 0,
    "format": "json"
}
```

</div>

The request includes the following body parameters:

| Field | Value | Description |
|-------|-------|-------------|
| startTime | String ([Date-Time][]) | Retrieve information starting at this time. |
| endTime | String ([Date-Time][]) | Retrieve information ending at this time. |
| timeIncrement | String | (Optional) Divide results into intervals of the specified length: `year`, `month`, `day`, `hour`, `minute`, or `second`. The value `all` collapses the results into just one interval. Defaults to `all`. |
| descending | Boolean | (Optional) If true, return results in descending order. Defaults to false. |
| reduce | Boolean | (Optional) If `false`, include accounts individually instead of collapsing them into results over time. Ignored if `timeIncrement` is provided. Defaults to `true`. |
| limit | Number | (Optional) If reduce is `false`, this value defines the maximum number of transactions to return in one response. Use with `offset` to paginate results. Defaults to 500. |
| offset | Number | (Optional) If reduce is `false`, this value defines a number of transactions to skip before returning results. Use with `limit` to paginate results. Defaults to 0. |
| format | String | (Optional) The [Response Format][] to use: `csv` or `json`. If omitted, defaults to a CSV-like JSON array format. |

#### Response Format ####

The format of the response depends on the `format` and `reduce` parameters from the request. See [Response Format][] for details. Examples of successful responses:

<div class='multicode'>

*Reduced*

```
{
    "startTime": "2015-03-15T10:00:00+00:00",
    "endTime": "2014-01-01T10:00:00+00:00",
    "timeIncrement": "month",
    "total": 97417,
    "results": [
        {
            "time": "2015-03-01T00:00:00+00:00",
            "count": 2388
        },
        {
            "time": "2015-02-01T00:00:00+00:00",
            "count": 6770
        },
        {
            "time": "2015-01-01T00:00:00+00:00",
            "count": 7584
        },
        {
            "time": "2014-12-01T00:00:00+00:00",
            "count": 10760
        },
        {
            "time": "2014-11-01T00:00:00+00:00",
            "count": 6834
        },
        {
            "time": "2014-10-01T00:00:00+00:00",
            "count": 5787
        },
        {
            "time": "2014-09-01T00:00:00+00:00",
            "count": 4146
        },
        {
            "time": "2014-08-01T00:00:00+00:00",
            "count": 5301
        },
        {
            "time": "2014-07-01T00:00:00+00:00",
            "count": 7820
        },
        {
            "time": "2014-06-01T00:00:00+00:00",
            "count": 7031
        },
        {
            "time": "2014-05-01T00:00:00+00:00",
            "count": 10421
        },
        {
            "time": "2014-04-01T00:00:00+00:00",
            "count": 4771
        },
        {
            "time": "2014-03-01T00:00:00+00:00",
            "count": 5195
        },
        {
            "time": "2014-02-01T00:00:00+00:00",
            "count": 5299
        },
        {
            "time": "2014-01-01T00:00:00+00:00",
            "count": 7310
        }
    ]
}
```

*Expanded*

```
{
    "startTime": "2015-03-15T17:00:00+00:00",
    "endTime": "2015-03-15T09:00:00+00:00",
    "total": 5,
    "results": [
        {
            "time": "2015-03-15T15:34:20+00:00",
            "account": "rK6gVSDPNXeMPSR4p8LKx8yHVKST1qs6gX",
            "txHash": "75FB423CD1319A7DA68BD12B0918777D93111FB8FAD964E2A5C5CF99DC35F491",
            "ledgerIndex": 12273337
        },
        {
            "time": "2015-03-15T15:31:10+00:00",
            "account": "rUPGhr8vhPuobxnKGbWS5dAvUfL7LmjpNQ",
            "txHash": "FB018F1D19DAE75529F13F5B4F296817E62AAA2E032836AEA95A87F68C9C12C4",
            "ledgerIndex": 12273295
        },
        {
            "time": "2015-03-15T14:13:30+00:00",
            "account": "rap2yHgBKNKkb8D7PTdQNPEZM1D9YJSDJe",
            "txHash": "EF0CB7051983C16775E8FCDAE62760870B29053A751548B17ED526CD62F1A2A1",
            "ledgerIndex": 12272263
        },
        {
            "time": "2015-03-15T14:11:10+00:00",
            "account": "rnEffWJFRd1VVFbKoEXjhGR9gtqnJKTt1X",
            "txHash": "8CA751FD309BF5767339888AA410786FC2B7007B8C01941A91F7679BF92930B6",
            "ledgerIndex": 12272233
        },
        {
            "time": "2015-03-15T13:42:20+00:00",
            "account": "r4anmJmbTQ4C7ei1w2jSmFDxthypWaJTmp",
            "txHash": "A19D55662957DCC450FC91DBB3681CD917EFE00D4F902F7A0D196015D832141F",
            "ledgerIndex": 12271842
        }
    ]
}
```

</div>

**If results are reduced** (the default), then each result represents an interval of time, with the following attributes, in order:

| Field | Type | Description |
|-------|------|-------------|
| time  | String ([Date-Time][]) | The time this interval begins |
| count | Number | The number of accounts created (successfully funded with the XRP reserve) in this interval. |

**If the results are not reduced** (the request specified `reduce` as false and did not include a `timeIncrement`), then each result represents an individual account that was created, with the following attributes:

| Field | Type | Description |
|-------|------|-------------|
| time  | String ([Date-Time][]) | The time this account was created, as defined by the close time of the ledger containing the transaction that created it. |
| account | String (Ripple Address) | The address of the newly-created account. |
| txHash | String (Transaction Hash) | The identifying hash of the transaction that created this account. |
| ledgerIndex | Number | The sequence number of the ledger when this account was created. |


## Exchange Rates ##
[[Source]<br>](https://github.com/ripple/ripple-data-api/blob/develop/api/routes/exchangeRates.js "Source")

Retrieve information about the exchange rates between one or more pairs of currency, based on trading activity in the network.

#### Request Format ####

<div class='multicode'>

*Multiple*

```
POST /api/exchange_rates
{
    "pairs": [
        {
            "base": {
                "currency": "CNY",
                "issuer": "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK"
            },
            "counter": {
                "currency": "XRP"
            }
        },
        {
            "base": {
                "currency": "MXN",
                "issuer": "rG6FZ31hDHN1K5Dkbma3PSB5uVCuVVRzfn"
            },
            "counter": {
                "currency": "USD",
                "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
            }
        }
    ],
    "range": "day"
}
```

*Single*

```
{
    "base": {
        "currency": "CNY",
        "issuer": "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK"
    },
    "counter": {
        "currency": "XRP"
    },
    "range": "day"
}
```

*Live*

```
{
    "pairs": [
        {
            "base": {
                "currency": "BTC",
                "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
            },
            "counter": {
                "currency": "XRP"
            },
            "depth": 0
        },
        {
            "base": {
                "currency": "BTC",
                "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
            },
            "counter": {
                "currency": "XRP"
            },
            "depth": 1000
        }
    ],
    "live": true
}
```

</div>

The request includes the following body parameters:

| Field | Value | Description |
|-------|-------|-------------|
| pairs | Array | (Optional) Array of currency pairs to compare. Each member of the array should be an object with a `base` field and a `counter` field, whose values are [Currency Objects][Currency Object]. If `live` is true, each pair can also include a `depth` field specifying how deep to dig into the order book to calculate the live rate. |
| base  | Object ([Currency Object][]) | (Optional) One currency to compare. Ignored if `pairs` provided. |
| counter | Object ([Currency Object][]) | (Optional) The other currency to compare. Ignored if `pairs` provided. |
| depth | Number | (Optional) Ignored unless `live` is true. Ignored if `pairs` is provided. Retrieve exchange rates for this amount of the `counter` currency. Provides a more accurate picture when the best orders in the market do not have enough volume to fully satisfy an exchange. Defaults to 0 (use the first bid and ask only). |
| range | String | (Optional) Time period over which the exchange rate is calculated: `year`, `month`, `week`, `day`, or `hour`. Defaults to `day`. Ignored if `live` is true. |
| last | Boolean | (Optional) If true, only return the price from the most recent exchange, without calculating [VWAP](https://en.wikipedia.org/wiki/Volume-weighted_average_price). Use for a faster response. Defaults to false. |
| live | Boolean | (Optional) If true, retrieve the current price directly from the Ripple network instead, as the midpoint between weighted average of the bid and asks up to the depth specified . Otherwise, use historical data from the past `range` amount of time. Defaults to false. |

You must provide either `pairs` or both `base` and `counter`.

#### Response Format ####

Examples of successful responses:

<div class='multicode'>

*Single*

```
[
    {
        "base": {
            "currency": "CNY",
            "issuer": "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
            "name": "rippleCN"
        },
        "counter": {
            "currency": "XRP"
        },
        "rate": 15.360721689111838,
        "last": 15.699279
    }
]
```

*Multiple*

```
[
    {
        "base": {
            "currency": "CNY",
            "issuer": "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
            "name": "rippleCN"
        },
        "counter": {
            "currency": "XRP"
        },
        "rate": 15.360721689111838,
        "last": 15.699279
    },
    {
        "base": {
            "currency": "MXN",
            "issuer": "rG6FZ31hDHN1K5Dkbma3PSB5uVCuVVRzfn",
            "name": "Bitso"
        },
        "counter": {
            "currency": "USD",
            "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
            "name": "SnapSwap"
        },
        "rate": 0.0626248440992736,
        "last": 0.064269
    }
]
```

*Live*

```
[
    {
        "base": {
            "currency": "BTC",
            "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
            "name": "SnapSwap"
        },
        "counter": {
            "currency": "XRP"
        },
        "rate": 25136.142311030344
    },
    {
        "base": {
            "currency": "BTC",
            "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
            "name": "SnapSwap"
        },
        "counter": {
            "currency": "XRP"
        },
        "depth": 1000,
        "rate": 27250.470591648358
    }
]
```

</div>

A successful result contains a JSON array. Each member of the array represents a currency pair, as an object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| base  | Object ([Currency Object][]) | The base currency specified for this pair, possibly including a `name` field with the Ripple Name for the `issuer` address. |
| counter | Object ([Currency Object][]) | The counter currency specified for this pair, possibly including a `name` field with the Ripple Name for the `issuer` address. |
| depth | Number | (May be omitted) The depth to search for this currency pair, if provided. |
| rate  | Number | (May be omitted) The amount of the counter currency that you can purchase with 1 unit of the base currency. By default, this is calculated [volume-weighted average price](https://en.wikipedia.org/wiki/Volume-weighted_average_price) for all exchanges executed during the `range` period from the request. If the request specified `live` as true, this is instead calculated as the midpoint between the weighted average of current bid and ask rates in the network up to the specified `depth`. Omitted if the request specified `last` as `true`. |
| last | Number | (May be omitted) The rate of the single most recent exchange to take place. |

If no exchanges are found for a currency pair from the request, that pair is omitted from the response.


## Issuer Capitalization ##
[[Source]<br>](https://github.com/ripple/ripple-data-api/blob/develop/api/routes/issuerCapitalization.js "Source")

Retrieve the total capitalization (outstanding balance) of specified currency issuers over time.

#### Request Format ####

<div class='multicode'>

*Request*

```
POST /api/issuer_capitalization
{
    "currencies": [
        {
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        {
            "currency": "USD",
            "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
        }
    ],
    "startTime": "Jan 1, 2014",
    "endTime": "Jan 1, 2015",
    "timeIncrement": "month"
}
```

</div>

The request includes the following body parameters:

| Field | Value | Description |
|-------|-------|-------------|
| currencies | Array of [Currency Objects][Currency Object]) | A list of currency/issuer pairs to look up. |
| startTime |  String ([Date-Time][]) | Retrieve information starting at this time. |
| endTime | String ([Date-Time][]) | Retrieve information ending at this time. |
| timeIncrement | String | (Optional) Divide results into intervals of the specified length: `year`, `month`, `day`, `hour`, `minute`, or `second`. The value `all` collapses the results into just one interval. Defaults to `all`. Ignored if `reduce` is `false`. |

#### Response Format ####

An example of a successful response:

```
[
    {
        "currency": "USD",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        "name": "Bitstamp",
        "hotwallets": [
            "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
            "rGFuMiw48HdbnrUbkRYuitXTmfrDBNTCnX"
        ],
        "results": [
            [
                "2014-01-01T00:00:00+00:00",
                2182532.512563024
            ],
            [
                "2014-02-01T00:00:00+00:00",
                1672428.6072806932
            ],
            [
                "2014-03-01T00:00:00+00:00",
                1475205.4287192414
            ],
            [
                "2014-04-01T00:00:00+00:00",
                1475129.7523240475
            ],
            [
                "2014-05-01T00:00:00+00:00",
                1641170.5998081048
            ],
            [
                "2014-06-01T00:00:00+00:00",
                2823512.0227728607
            ],
            [
                "2014-07-01T00:00:00+00:00",
                2181718.7345464956
            ],
            [
                "2014-08-01T00:00:00+00:00",
                2150290.1475041625
            ],
            [
                "2014-09-01T00:00:00+00:00",
                1370978.1335410434
            ],
            [
                "2014-10-01T00:00:00+00:00",
                1386720.726560316
            ],
            [
                "2014-11-01T00:00:00+00:00",
                1171158.4417431813
            ],
            [
                "2014-12-01T00:00:00+00:00",
                1651264.0460538066
            ],
            [
                "2015-01-01T00:00:00+00:00",
                2272895.4608580153
            ]
        ]
    },
    {
        "currency": "USD",
        "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
        "name": "SnapSwap",
        "hotwallets": [
            "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt",
            "rQsAshmCjPsxkYnxY9GnmBTAeEUaePDAie",
            "rEk9i7G8ac1kUs1mFjtze1qjj9FzGvXAG",
            "rsTQ7iwrCik9Ugc3zbpcbo2K3SbAdYJss1",
            "rwm98fCBS8tV1YB8CGho8zUPW5J7N41th2",
            "rnd8KJ4qeip6FPJvC1fyv82nW2Lm8C8KjQ",
            "r5ymZSvtdNgbKVc8ay1Jhmq5f9QgnvEtj"
        ],
        "results": [
            [
                "2014-01-01T00:00:00+00:00",
                308414.17014300067
            ],
            [
                "2014-02-01T00:00:00+00:00",
                221127.8278553265
            ],
            [
                "2014-03-01T00:00:00+00:00",
                189103.31201476356
            ],
            [
                "2014-04-01T00:00:00+00:00",
                166239.66201052035
            ],
            [
                "2014-05-01T00:00:00+00:00",
                181126.05199917927
            ],
            [
                "2014-06-01T00:00:00+00:00",
                352360.96199815325
            ],
            [
                "2014-07-01T00:00:00+00:00",
                406900.8018140941
            ],
            [
                "2014-08-01T00:00:00+00:00",
                522981.4027866862
            ],
            [
                "2014-09-01T00:00:00+00:00",
                823727.7361699624
            ],
            [
                "2014-10-01T00:00:00+00:00",
                1285657.1682029555
            ],
            [
                "2014-11-01T00:00:00+00:00",
                1162233.7115210893
            ],
            [
                "2014-12-01T00:00:00+00:00",
                1631690.8946927704
            ],
            [
                "2015-01-01T00:00:00+00:00",
                3778040.482102244
            ]
        ]
    }
]
```

A successful result contains a **JSON array** of objects representing the issuers from the request. Each member object has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| currency | String | Currency code of the currency described by this record. |
| issuer | String (Ripple Address) | The account address of the gateway issuing this currency. |
| name | String | The name of this gateway, which usually corresponds to the Ripple Name of the account. |
| hotwallets | Array of Ripple Addresses | Hot wallets controlled by this gateway. Assets held by these accounts are not counted towards the capitalization. |
| results | Array of Arrays | The capitalization of the issuer/currency pair as an array of intervals. Each nested array has two values: a String ([Date-Time][]) specifying the beginning of the interval, and a number representing the total units of the currency distributed through the network at the time. |

The list of gateway names and hot wallets is defined by the [gateways.json](https://github.com/ripple/ripple-data-api/blob/a6c23a8c1bc5f073f2dd2bf32e8d763b66b6a2e3/api/gateways.json) file in the server tree. In the future, this may be [expanded to use host-meta](https://ripplelabs.atlassian.net/browse/RD-75).


## Ledgers Closed ##
[[Source]<br>](https://github.com/ripple/ripple-data-api/blob/develop/api/routes/ledgersClosed.js "Source")

Retrieve information about ledgers closed over time.

#### Request Format ####

<div class='multicode'>

*Reduced*

```
POST /api/ledgers_closed
{
    "startTime": "2014-01-01",
    "endTime": "2015-01-01",
    "timeIncrement": "month",
    "descending": false,
    "reduce": true,
    "format": "json"
}
```

*Expanded*

```
POST /api/ledgers_closed
{
    "startTime": "2015-01-01",
    "endTime": "2015-01-02",
    "descending": false,
    "reduce": false,
    "limit": 50,
    "offset": 0,
    "format": "json"
}
```

*Minimal*

```
POST /api/ledgers_closed
{}
```

</div>

The request includes the following body parameters:

| Field | Value | Description |
|-------|-------|-------------|
| startTime | String ([Date-Time][]) | (Optional) Retrieve information starting at this time. Defaults to 30 days before `endTime`. |
| endTime | String ([Date-Time][]) | (Optional) Retrieve information ending at this time. Defaults to the current time. |
| timeIncrement | String | (Optional) Divide results into intervals of the specified length: `year`, `month`, `day`, `hour`, `minute`, or `second`. The value `all` collapses the results into just one interval. Defaults to `all`. Ignored if `reduce` is `false`. |
| descending | Boolean | (Optional) If true, return results with the most recent first. Defaults to true. |
| reduce | Boolean | (Optional) If `false`, include ledgers individually instead of collapsing them into results over time. Defaults to `true`. |
| limit | Number | (Optional) The maximum number of ledgers to return in one response. Use with `offset` to paginate results. Ignored if `reduce` is false. Defaults to 500. |
| offest | Number | (Optional) The number of transactions to skip before returning results. Use with `limit` to paginate results. Ignored if `reduce` is false. Defaults to 0. |
| format | String | (Optional) The [Response Format][] to use: `csv` or `json`. If omitted, defaults to a CSV-like JSON array format. |

#### Response Format ####

The format of the response depends on the `format` and `reduce` parameters from the request. See [Response Format][] for details. Examples of successful responses:

<div class='multicode'>

*Reduced*

```
{
    "startTime": "2014-01-01T00:00:00+00:00",
    "endTime": "2015-01-01T00:00:00+00:00",
    "timeIncrement": "month",
    "total": 6655524,
    "results": [
        {
            "time": "2014-01-01T00:00:00+00:00",
            "count": 551361
        },
        {
            "time": "2014-02-01T00:00:00+00:00",
            "count": 528527
        },
        {
            "time": "2014-03-01T00:00:00+00:00",
            "count": 565889
        },
        {
            "time": "2014-04-01T00:00:00+00:00",
            "count": 546201
        },
        {
            "time": "2014-05-01T00:00:00+00:00",
            "count": 569552
        },
        {
            "time": "2014-06-01T00:00:00+00:00",
            "count": 551485
        },
        {
            "time": "2014-07-01T00:00:00+00:00",
            "count": 569394
        },
        {
            "time": "2014-08-01T00:00:00+00:00",
            "count": 558809
        },
        {
            "time": "2014-09-01T00:00:00+00:00",
            "count": 504121
        },
        {
            "time": "2014-10-01T00:00:00+00:00",
            "count": 558358
        },
        {
            "time": "2014-11-01T00:00:00+00:00",
            "count": 547955
        },
        {
            "time": "2014-12-01T00:00:00+00:00",
            "count": 603870
        },
        {
            "time": "2015-01-01T00:00:00+00:00",
            "count": 2
        }
    ]
}
```

*Expanded*

```
{
    "startTime": "2015-01-01T00:00:00+00:00",
    "endTime": "2015-01-02T00:00:00+00:00",
    "total": 10,
    "results": [
        {
            "time": "2015-01-01T00:00:00+00:00",
            "ledgerIndex": 10852618
        },
        {
            "time": "2015-01-01T00:00:00+00:00",
            "ledgerIndex": 10852619
        },
        {
            "time": "2015-01-01T00:00:10+00:00",
            "ledgerIndex": 10852620
        },
        {
            "time": "2015-01-01T00:00:10+00:00",
            "ledgerIndex": 10852621
        },
        {
            "time": "2015-01-01T00:00:20+00:00",
            "ledgerIndex": 10852622
        },
        {
            "time": "2015-01-01T00:00:20+00:00",
            "ledgerIndex": 10852623
        },
        {
            "time": "2015-01-01T00:00:20+00:00",
            "ledgerIndex": 10852624
        },
        {
            "time": "2015-01-01T00:00:30+00:00",
            "ledgerIndex": 10852625
        },
        {
            "time": "2015-01-01T00:00:30+00:00",
            "ledgerIndex": 10852626
        },
        {
            "time": "2015-01-01T00:00:40+00:00",
            "ledgerIndex": 10852627
        }
    ]
}
```

*Minimal*

```
581851
```

</div>

**If results are reduced** (the default), then each result represents an interval of time, with the following attributes, in order:

| Field | Type | Description |
|-------|------|-------------|
| time  | String ([Date-Time][]) | The start time of this interval. |
| count | Number | The number of ledgers that closed during this interval. |

**If the results are not reduced** (the request used `"reduce":false`), then each result represents an individual ledger, with the following attributes:

| Field | Type | Description |
|-------|------|-------------|
| time  | String ([Date-Time][]) | The approximate time this ledger closed. |
| ledgerIndex | Number | The sequence number of this ledger. |

**If neither reduce nor timeIncrement are provided**, the response body is simply an integer indicating the number of ledgers closed during the requested window. 


## Market Traders ##
[[Source]<br>](https://github.com/ripple/ripple-data-api/blob/develop/api/routes/marketTraders.js "Source")

Return a list of accounts that participated in trading a specified currency exchange.

#### Request Format ####

<div class='multicode'>

*Transactions Included*

```
POST /api/market_traders
{
    "base": {
        "currency": "XRP"
    },
    "counter": {
        "currency": "KRW",
        "issuer": "rUkMKjQitpgAM5WTGk79xpjT38DEJY283d"
    },
    "startTime": "2014-11-01",
    "transactions": true,
    "format": "json"
}
```

*Default Markets*

```
POST /api/market_traders
{
    "startTime": "2013-02-26",
    "format": "json"
}
```

</div>

The request includes the following body parameters:

| Field | Value | Description |
|-------|-------|-------------|
| base  | Object ([Currency Object][]) | (Optional) One of the currencies being exchanged. Required if `counter` is specified. |
| counter | Object ([Currency Object][]) | (Optional) The other of the currencies being exchanged. Required if `base` is specified. |
| startTime | String ([Date-Time][]) | (Optional) Retrieve information starting at this time. If omitted, use the `period` ending at the current time. |
| period | String | (Optional) One of the following values: `3d` (three days), `7d` (seven days), or `24h` (24 hours). Defaults to `24h`. |
| transactions | Boolean | (Optional) If true, include individual transactions in the response. Defaults to false. Ignored if `format` is csv. |
| format | String | (Optional) The [Response Format][] to use: `csv` or `json`. If omitted, defaults to a CSV-like JSON array format. |

If both `base` and `counter` are omitted, the API combines the results from a [hardcoded list of popular markets](https://github.com/ripple/ripple-data-api/blob/2d456ace25c7ee157ed510b801ccc987b58d5d92/api/routes/marketTraders.js#L81-L92) with XRP as the base currency.

**Note:** This method *does not* have an `endTime` parameter.

#### Response Format ####

Examples of successful responses:

<div class='multicode'>

*Transactions Included*

```
{
    "startTime": "2014-11-01T00:00:00+00:00",
    "endTime": "2014-11-02T00:00:00+00:00",
    "results": [
        {
            "buy": {
                "baseVolume": 0,
                "counterVolume": 0,
                "count": 0
            },
            "sell": {
                "baseVolume": 314,
                "counterVolume": 1776.2,
                "count": 7
            },
            "account": "rhLKAC1yy92YSfM45LE7KQ6CcuJF4pJSdR",
            "baseVolume": 314,
            "counterVolume": 1776.2,
            "count": 7,
            "transactions": [
                [
                    "2014-11-01T06:45:40+00:00",
                    5.6,
                    0.08,
                    0.44800000000009277,
                    "rhLKAC1yy92YSfM45LE7KQ6CcuJF4pJSdR",
                    "r3drXrWREtPbe8EjqwQib6fbpCoKBF2Pfg",
                    "12EEDEF7ACB178F589D3308962D394FC50A6B018B1CBFF1983E5F2AA00F35C3F",
                    9690578
                ],
                [
                    "2014-11-01T06:50:10+00:00",
                    5.6,
                    0.00823,
                    0.046087999999826934,
                    "rhLKAC1yy92YSfM45LE7KQ6CcuJF4pJSdR",
                    "r3drXrWREtPbe8EjqwQib6fbpCoKBF2Pfg",
                    "C131B35C504B29EA2A57F02E0930C8E6A70D5353B024FA811DD3319817E4F096",
                    9690630
                ],
                [
                    "2014-11-01T06:56:50+00:00",
                    5.6,
                    0.000001,
                    0.0000048198000968113774,
                    "rhLKAC1yy92YSfM45LE7KQ6CcuJF4pJSdR",
                    "r3drXrWREtPbe8EjqwQib6fbpCoKBF2Pfg",
                    "89BDB5CF8003DF370974E5755E68E055A38D75D3319F36698A4EA6FAEFD35562",
                    9690706
                ],
                [
                    "2014-11-01T07:32:10+00:00",
                    5.6,
                    0.00015,
                    0.0008370000000468281,
                    "rhLKAC1yy92YSfM45LE7KQ6CcuJF4pJSdR",
                    "r3drXrWREtPbe8EjqwQib6fbpCoKBF2Pfg",
                    "62E570CDA203BB757796BD2EFCC1ED6B723FA0AAB7084F0F6FC65AAD6D6466C8",
                    9691142
                ],
                [
                    "2014-11-01T14:17:10+00:00",
                    5.6,
                    199.911619,
                    1119.5050701802,
                    "rhLKAC1yy92YSfM45LE7KQ6CcuJF4pJSdR",
                    "rJ11W7nDukN1sWKcyhSGdZWbKKGQkYntyA",
                    "E0E22F48F9A61665C45932BC2BD4CF2112F5B2FA7A184A2AF647B90EE364FC2E",
                    9696061
                ],
                [
                    "2014-11-01T14:17:30+00:00",
                    5.699999999999999,
                    50,
                    285,
                    "rhLKAC1yy92YSfM45LE7KQ6CcuJF4pJSdR",
                    "rJ11W7nDukN1sWKcyhSGdZWbKKGQkYntyA",
                    "1BE8EDD238D3B7988412E605E44024912F5B715BDE92F5ECB2B5ADB5BCD17AC7",
                    9696066
                ],
                [
                    "2014-11-01T14:17:50+00:00",
                    5.800000000000001,
                    64,
                    371.2,
                    "rhLKAC1yy92YSfM45LE7KQ6CcuJF4pJSdR",
                    "rJ11W7nDukN1sWKcyhSGdZWbKKGQkYntyA",
                    "B5A56CCAB5DCEA40CEC8F8B9D2077185893D307282936024375B91CD4917240C",
                    9696070
                ]
            ]
        },
        {
            "buy": {
                "baseVolume": 0.088381,
                "counterVolume": 0.49492981980006334,
                "count": 4
            },
            "sell": {
                "baseVolume": 34.098334,
                "counterVolume": 187.54083700000047,
                "count": 1
            },
            "account": "r3drXrWREtPbe8EjqwQib6fbpCoKBF2Pfg",
            "baseVolume": 34.186715,
            "counterVolume": 188.03576681980053,
            "count": 5,
            "transactions": [
                [
                    "2014-11-01T06:45:40+00:00",
                    5.6,
                    0.08,
                    0.44800000000009277,
                    "rhLKAC1yy92YSfM45LE7KQ6CcuJF4pJSdR",
                    "r3drXrWREtPbe8EjqwQib6fbpCoKBF2Pfg",
                    "12EEDEF7ACB178F589D3308962D394FC50A6B018B1CBFF1983E5F2AA00F35C3F",
                    9690578
                ],
                [
                    "2014-11-01T06:50:10+00:00",
                    5.6,
                    0.00823,
                    0.046087999999826934,
                    "rhLKAC1yy92YSfM45LE7KQ6CcuJF4pJSdR",
                    "r3drXrWREtPbe8EjqwQib6fbpCoKBF2Pfg",
                    "C131B35C504B29EA2A57F02E0930C8E6A70D5353B024FA811DD3319817E4F096",
                    9690630
                ],
                [
                    "2014-11-01T06:56:50+00:00",
                    5.6,
                    0.000001,
                    0.0000048198000968113774,
                    "rhLKAC1yy92YSfM45LE7KQ6CcuJF4pJSdR",
                    "r3drXrWREtPbe8EjqwQib6fbpCoKBF2Pfg",
                    "89BDB5CF8003DF370974E5755E68E055A38D75D3319F36698A4EA6FAEFD35562",
                    9690706
                ],
                [
                    "2014-11-01T07:30:00+00:00",
                    5.500000000000001,
                    34.098334,
                    187.54083700000047,
                    "r3drXrWREtPbe8EjqwQib6fbpCoKBF2Pfg",
                    "rMcGGXYeY9QFNt1fQAP3Gfpe8CdRaEfAmM",
                    "0CF2D0F5EC58BE54F6C31CD2F3C0C5483A340FCE27D7B7C8D84AFA8888A6A0B4",
                    9691114
                ],
                [
                    "2014-11-01T07:32:10+00:00",
                    5.6,
                    0.00015,
                    0.0008370000000468281,
                    "rhLKAC1yy92YSfM45LE7KQ6CcuJF4pJSdR",
                    "r3drXrWREtPbe8EjqwQib6fbpCoKBF2Pfg",
                    "62E570CDA203BB757796BD2EFCC1ED6B723FA0AAB7084F0F6FC65AAD6D6466C8",
                    9691142
                ]
            ]
        },
        {
            "buy": {
                "baseVolume": 1463.376734,
                "counterVolume": 8048.572037,
                "count": 3
            },
            "sell": {
                "baseVolume": 0,
                "counterVolume": 0,
                "count": 0
            },
            "account": "rMcGGXYeY9QFNt1fQAP3Gfpe8CdRaEfAmM",
            "baseVolume": 1463.376734,
            "counterVolume": 8048.572037,
            "count": 3,
            "transactions": [
                [
                    "2014-11-01T07:30:00+00:00",
                    5.500000000000001,
                    34.098334,
                    187.54083700000047,
                    "r3drXrWREtPbe8EjqwQib6fbpCoKBF2Pfg",
                    "rMcGGXYeY9QFNt1fQAP3Gfpe8CdRaEfAmM",
                    "0CF2D0F5EC58BE54F6C31CD2F3C0C5483A340FCE27D7B7C8D84AFA8888A6A0B4",
                    9691114
                ],
                [
                    "2014-11-01T13:59:50+00:00",
                    5.500000000000001,
                    966.294955,
                    5314.622252499999,
                    "rajdkuhURyoFCg9z36eHd75r2QTuEESFKe",
                    "rMcGGXYeY9QFNt1fQAP3Gfpe8CdRaEfAmM",
                    "F6797151ACD0AFA86C4E7FAE8948CEAB67982F623BF2FBCD9044E5CA216876F4",
                    9695862
                ],
                [
                    "2014-11-01T14:00:10+00:00",
                    5.500000000000001,
                    462.983445,
                    2546.4089475,
                    "rajdkuhURyoFCg9z36eHd75r2QTuEESFKe",
                    "rMcGGXYeY9QFNt1fQAP3Gfpe8CdRaEfAmM",
                    "F4C06FBFFFEAA3B47034D99DACC6CB9738823E0F1473096C4BACA7035FCAC90D",
                    9695866
                ]
            ]
        },
        {
            "buy": {
                "baseVolume": 0,
                "counterVolume": 0,
                "count": 0
            },
            "sell": {
                "baseVolume": 1429.2784,
                "counterVolume": 7861.031199999999,
                "count": 2
            },
            "account": "rajdkuhURyoFCg9z36eHd75r2QTuEESFKe",
            "baseVolume": 1429.2784,
            "counterVolume": 7861.031199999999,
            "count": 2,
            "transactions": [
                [
                    "2014-11-01T13:59:50+00:00",
                    5.500000000000001,
                    966.294955,
                    5314.622252499999,
                    "rajdkuhURyoFCg9z36eHd75r2QTuEESFKe",
                    "rMcGGXYeY9QFNt1fQAP3Gfpe8CdRaEfAmM",
                    "F6797151ACD0AFA86C4E7FAE8948CEAB67982F623BF2FBCD9044E5CA216876F4",
                    9695862
                ],
                [
                    "2014-11-01T14:00:10+00:00",
                    5.500000000000001,
                    462.983445,
                    2546.4089475,
                    "rajdkuhURyoFCg9z36eHd75r2QTuEESFKe",
                    "rMcGGXYeY9QFNt1fQAP3Gfpe8CdRaEfAmM",
                    "F4C06FBFFFEAA3B47034D99DACC6CB9738823E0F1473096C4BACA7035FCAC90D",
                    9695866
                ]
            ]
        },
        {
            "buy": {
                "baseVolume": 313.911619,
                "counterVolume": 1775.7050701802,
                "count": 3
            },
            "sell": {
                "baseVolume": 0,
                "counterVolume": 0,
                "count": 0
            },
            "account": "rJ11W7nDukN1sWKcyhSGdZWbKKGQkYntyA",
            "baseVolume": 313.911619,
            "counterVolume": 1775.7050701802,
            "count": 3,
            "transactions": [
                [
                    "2014-11-01T14:17:10+00:00",
                    5.6,
                    199.911619,
                    1119.5050701802,
                    "rhLKAC1yy92YSfM45LE7KQ6CcuJF4pJSdR",
                    "rJ11W7nDukN1sWKcyhSGdZWbKKGQkYntyA",
                    "E0E22F48F9A61665C45932BC2BD4CF2112F5B2FA7A184A2AF647B90EE364FC2E",
                    9696061
                ],
                [
                    "2014-11-01T14:17:30+00:00",
                    5.699999999999999,
                    50,
                    285,
                    "rhLKAC1yy92YSfM45LE7KQ6CcuJF4pJSdR",
                    "rJ11W7nDukN1sWKcyhSGdZWbKKGQkYntyA",
                    "1BE8EDD238D3B7988412E605E44024912F5B715BDE92F5ECB2B5ADB5BCD17AC7",
                    9696066
                ],
                [
                    "2014-11-01T14:17:50+00:00",
                    5.800000000000001,
                    64,
                    371.2,
                    "rhLKAC1yy92YSfM45LE7KQ6CcuJF4pJSdR",
                    "rJ11W7nDukN1sWKcyhSGdZWbKKGQkYntyA",
                    "B5A56CCAB5DCEA40CEC8F8B9D2077185893D307282936024375B91CD4917240C",
                    9696070
                ]
            ]
        }
    ]
}
```

*Default Markets*

```
{
    "startTime": "2013-02-26T00:00:00+00:00",
    "endTime": "2013-02-27T00:00:00+00:00",
    "results": [
        {
            "buy": {
                "baseVolume": 1650,
                "counterVolume": 0.03,
                "count": 2
            },
            "sell": {
                "baseVolume": 1950,
                "counterVolume": 1,
                "count": 1
            },
            "account": "rN6DeCG5VvmfqjBywwoE24oXQsHzRDUfzh",
            "baseVolume": 3600,
            "counterVolume": 1.03,
            "count": 3
        },
        {
            "buy": {
                "baseVolume": 54890.21956,
                "counterVolume": 0.998003991999999,
                "count": 1
            },
            "sell": {
                "baseVolume": 0,
                "counterVolume": 0,
                "count": 0
            },
            "account": "r4EM4gBQfr1QgQLXSPF4r7h84qE9mb6iCC",
            "baseVolume": 54890.21956,
            "counterVolume": 0.998003991999999,
            "count": 1
        },
        {
            "buy": {
                "baseVolume": 43468.68636,
                "counterVolume": 1.66884978,
                "count": 3
            },
            "sell": {
                "baseVolume": 0,
                "counterVolume": 0,
                "count": 0
            },
            "account": "r49nVgaYSDuU7GEQh4mF1nyjsXSVRcUHsr",
            "baseVolume": 43468.68636,
            "counterVolume": 1.66884978,
            "count": 3
        },
        {
            "buy": {
                "baseVolume": 3998,
                "counterVolume": 2,
                "count": 1
            },
            "sell": {
                "baseVolume": 0,
                "counterVolume": 0,
                "count": 0
            },
            "account": "rhdAw3LiEfWWmSrbnZG3udsN7PoWKT56Qo",
            "baseVolume": 3998,
            "counterVolume": 2,
            "count": 1
        },
        {
            "buy": {
                "baseVolume": 0,
                "counterVolume": 0,
                "count": 0
            },
            "sell": {
                "baseVolume": 8200,
                "counterVolume": 0.2,
                "count": 1
            },
            "account": "rGsLivkDjTZHFQ8oV2h81uTcbTpgjEaEY7",
            "baseVolume": 8200,
            "counterVolume": 0.2,
            "count": 1
        },
        {
            "buy": {
                "baseVolume": 1688782.827518,
                "counterVolume": 26.242631108001902,
                "count": 18
            },
            "sell": {
                "baseVolume": 0,
                "counterVolume": 0,
                "count": 0
            },
            "account": "rKQLJpoBagwGiE7LVcY8YfDfE6EUREJjeq",
            "baseVolume": 1688782.827518,
            "counterVolume": 26.242631108001902,
            "count": 18
        },
        {
            "buy": {
                "baseVolume": 3688,
                "counterVolume": 0.071,
                "count": 3
            },
            "sell": {
                "baseVolume": 13608.0998,
                "counterVolume": 0.24950099800399195,
                "count": 4
            },
            "account": "rpuebQXsR7kAst5yidD6fmGmJHD4niXzbo",
            "baseVolume": 17296.0998,
            "counterVolume": 0.320500998003992,
            "count": 7
        },
        {
            "buy": {
                "baseVolume": 153840,
                "counterVolume": 3.2,
                "count": 5
            },
            "sell": {
                "baseVolume": 345998,
                "counterVolume": 8,
                "count": 5
            },
            "account": "rnZoUopPFXRSVGdeDkgbqdft8SbXfJxKYh",
            "baseVolume": 499838,
            "counterVolume": 11.2,
            "count": 10
        },
        {
            "buy": {
                "baseVolume": 0,
                "counterVolume": 0,
                "count": 0
            },
            "sell": {
                "baseVolume": 87300,
                "counterVolume": 1.56,
                "count": 6
            },
            "account": "rMFTySyNbLqyhy391qGL7GHdHWZ5LfvtG",
            "baseVolume": 87300,
            "counterVolume": 1.56,
            "count": 6
        },
        {
            "buy": {
                "baseVolume": 10000,
                "counterVolume": 0.19999999999999996,
                "count": 1
            },
            "sell": {
                "baseVolume": 0,
                "counterVolume": 0,
                "count": 0
            },
            "account": "rnwRcxX4JpHnPjTJpaDH8YZzRPTphvsHbE",
            "baseVolume": 10000,
            "counterVolume": 0.19999999999999996,
            "count": 1
        },
        {
            "buy": {
                "baseVolume": 307790.40518999996,
                "counterVolume": 4.78696007984032,
                "count": 6
            },
            "sell": {
                "baseVolume": 0,
                "counterVolume": 0,
                "count": 0
            },
            "account": "rNnLFDCRrAtuESodmwamAasMBZqCmkqQH9",
            "baseVolume": 307790.40518999996,
            "counterVolume": 4.78696007984032,
            "count": 6
        },
        {
            "buy": {
                "baseVolume": 0,
                "counterVolume": 0,
                "count": 0
            },
            "sell": {
                "baseVolume": 1827449.9996490004,
                "counterVolume": 28.469630993204063,
                "count": 27
            },
            "account": "ramJoEsBUHc299vFuMvn8NgLrF3Qrt3XV4",
            "baseVolume": 1827449.9996490004,
            "counterVolume": 28.469630993204063,
            "count": 27
        },
        {
            "buy": {
                "baseVolume": 800,
                "counterVolume": 0.016000000000000014,
                "count": 1
            },
            "sell": {
                "baseVolume": 0,
                "counterVolume": 0,
                "count": 0
            },
            "account": "rKuuVUKA14roSPTuquQTo7nmWZN8EsfxpT",
            "baseVolume": 800,
            "counterVolume": 0.016000000000000014,
            "count": 1
        },
        {
            "buy": {
                "baseVolume": 4597.960821,
                "counterVolume": 0.06568703136583831,
                "count": 1
            },
            "sell": {
                "baseVolume": 0,
                "counterVolume": 0,
                "count": 0
            },
            "account": "rNHf9nnX4JgHferxjRxmapDev7mWQZ6XXd",
            "baseVolume": 4597.960821,
            "counterVolume": 0.06568703136583831,
            "count": 1
        },
        {
            "buy": {
                "baseVolume": 11000,
                "counterVolume": 0.2,
                "count": 2
            },
            "sell": {
                "baseVolume": 0,
                "counterVolume": 0,
                "count": 0
            },
            "account": "rG8VFQPaJB2gNjx29Et1wKUJettQP1eLmk",
            "baseVolume": 11000,
            "counterVolume": 0.2,
            "count": 2
        }
    ]
}
```

</div>

A successful result contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| account | String (Account Address) | The account of the trader. |
| buy | Object | Object with `baseVolume` (volume of base currency bought), `counterVolume` (volume of counter currency bought), and `count` (number of buy transactions) fields describing the activity of this account. |
| sell | Object | Object with `baseVolume` (volume of base currency sold), `counterVolume` (volume of counter currency sold), and `count` (number of sell transactions) fields describing the activity of this account. |
| baseVolume | Number | The total amount of the base currency exchanged. |
| counterVolume | Number | The total amount of the counter currency exchanged. |
| count | Number | The number of exchanges this account performed. |
| transactions | Array | (Omitted unless the request specified `transactions` as true) Array of transactions sent that this account participated in. |

If transactions are included, each transaction is represented as an array with the following fields in order:

| Type | Description |
|------|-------------|
| String ([Date-Time][]) | The approximate time this transaction occurred. |
| Number | The amount of the counter currency received for each unit of the base spent. |
| Number | The amount of base currency in this transaction. |
| Number | The amount of counter currency in this transaction. |
| String (Ripple Address) | One party to this transaction. |
| String (Ripple Address) | The other party to this transaction. |
| String (Transaction Hash) | The identifying hash for this transaction. (This may be `null` for very old transactions.) |
| Number | The sequence number of the ledger that included this transaction. |


## Offers Exercised ##
[[Source]<br>](https://github.com/ripple/ripple-data-api/blob/master/api/routes/offersExercised.js "Source")

Retrieve information about currency-exchange orders being exercised on the network, for a specific pair of currencies and timeframe.

<div class='multicode'>

*15-minute increments*

```
POST /api/offers_exercised
{
    "base": {
        "currency": "USD",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    },
    "counter": {
        "currency": "BTC",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    },
    "endTime": "2015-03-01T00:00Z",
    "startTime": "2015-03-01T12:00Z",
    "timeIncrement": "minute",
    "timeMultiple": 15,
    "format": "json"
}
```

*Expanded*

```
POST /api/offers_exercised
{
    "base": {
        "currency": "USD",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    },
    "counter": {
        "currency": "BTC",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    },
    "endTime": "2015-03-01T00:00Z",
    "startTime": "2015-03-01T23:59Z",
    "reduce": false,
    "limit": 5,
    "offset": 0,
    "format": "json"
}
```

</div>

The request includes the following body parameters:

| Field | Value | Description |
|-------|-------|-------------|
| base  | Object ([Currency Object][]) | One of the currencies being exchanged. |
| counter | Object ([Currency Object][]) | The other of the currencies being exchanged. |
| startTime | String ([Date-Time][]) | Retrieve information starting at this time. |
| endTime | String ([Date-Time][]) | Retrieve information ending at this time. |
| timeIncrement | String | (Optional) Divide results into intervals of the specified length: `year`, `month`, `day`, `hour`, `minute`, or `second`. The value `all` collapses the results into just one interval. Defaults to `all`. |
| timeMultiple | Number | (Optional) Create larger intervals that are this many times the size of the `timeIncrement` (for example, 15-minute intervals). Defaults to 1. |
| descending | Boolean | (Optional) If true, return results in descending order. Defaults to false. |
| reduce | Boolean | (Optional) If `false`, include transactions individually instead of collapsing them into results over time. Defaults to `true`. Ignored if `timeIncrement` is provided. |
| limit | Number | (Optional) If reduce is `false`, this value defines the maximum number of transactions to return in one response. Use with `offset` to paginate results. Defaults to 500. |
| offset | Number | (Optional) If reduce is `false`, this value defines a number of transactions to skip before returning results. Use with `limit` to paginate results. Defaults to 0. |
| format | String | (Optional) The [Response Format][] to use: `csv` or `json`. If omitted, defaults to a CSV-like JSON array format. |

#### Response Format ####

The format of the response depends on the `format` and `reduce` parameters from the request. See [Response Format][] for details. Examples of successful responses:

<div class='multicode'>

*15-minute increments*

```
{
    "startTime": "2015-03-01T00:00:00+00:00",
    "endTime": "2015-03-01T12:00:00+00:00",
    "base": {
        "currency": "USD",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    },
    "counter": {
        "currency": "BTC",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    },
    "timeIncrement": "minutes",
    "timeMultiple": 15,
    "results": [
        {
            "startTime": "2015-03-01T00:45:00+00:00",
            "openTime": "2015-03-01T00:52:20+00:00",
            "closeTime": "2015-03-01T00:52:20+00:00",
            "baseVolume": 683.2001467024601,
            "counterVolume": 2.679229505167318,
            "count": 1,
            "open": 0.0039215880120912015,
            "high": 0.0039215880120912015,
            "low": 0.0039215880120912015,
            "close": 0.0039215880120912015,
            "vwap": 0.003921588012091202,
            "partial": false
        },
        {
            "startTime": "2015-03-01T09:45:00+00:00",
            "openTime": "2015-03-01T09:45:30+00:00",
            "closeTime": "2015-03-01T09:48:40+00:00",
            "baseVolume": 6025.771839536825,
            "counterVolume": 23.67880093810258,
            "count": 43,
            "open": "0.00391389432485323",
            "high": 0.003945508916212113,
            "low": "0.003912889366625167",
            "close": 0.003921642784865358,
            "vwap": 0.003929588037625179,
            "partial": false
        },
        {
            "startTime": "2015-03-01T11:45:00+00:00",
            "openTime": "2015-03-01T11:59:40+00:00",
            "closeTime": "2015-03-01T11:59:40+00:00",
            "baseVolume": 30.990503463384982,
            "counterVolume": 0.12348600141122801,
            "count": 1,
            "open": "0.003984640054561433",
            "high": "0.003984640054561433",
            "low": "0.003984640054561433",
            "close": "0.003984640054561433",
            "vwap": 0.003984640054561414,
            "partial": false
        }
    ]
}
```

*Expanded*

```
{
    "startTime": "2015-03-01T00:00:00+00:00",
    "endTime": "2015-03-01T23:59:00+00:00",
    "base": {
        "currency": "USD",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    },
    "counter": {
        "currency": "BTC",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    },
    "timeIncrement": "all",
    "results": [
        {
            "time": "2015-03-01T00:16:20+00:00",
            "price": "0.003926827277291318",
            "baseAmount": 128.95156374260318,
            "counterAmount": 0.506370517953824,
            "account": "rUBLCjWdsPPMkppdFXVJWhHnr3FNqCzgG3",
            "counterparty": "r4rCiFc9jpMeCpKioVJUMbT1hU4kj3XiSt",
            "tx_hash": "7257EC2FB029E76003B771755448334B650E376312B99AEF7F6B8DC85BF50C48",
            "ledgerIndex": 11991162
        },
        {
            "time": "2015-03-01T00:16:50+00:00",
            "price": "0.003928013992378335",
            "baseAmount": 271.64872683,
            "counterAmount": 1.06704,
            "account": "rUBLCjWdsPPMkppdFXVJWhHnr3FNqCzgG3",
            "counterparty": "rBxy23n7ZFbUpS699rFVj1V9ZVhAq6EGwC",
            "tx_hash": "57996435CAF193F427408187F4DE72879E76015E446D78C7C5702D8F193B478F",
            "ledgerIndex": 11991168
        },
        {
            "time": "2015-03-01T00:18:00+00:00",
            "price": "0.003958567143537345",
            "baseAmount": 12.608369653599198,
            "counterAmount": 0.04991107784431131,
            "account": "rDVBvAQScXrGRGnzrxRrcJPeNLeLeUTAqE",
            "counterparty": "r9bf8V4ae5xReYnKPXgnwERDFPoW34FhGy",
            "tx_hash": "5B1AEFDC4AF56843854CACEE885B856273F260F9DA5990600651F06B913136AB",
            "ledgerIndex": 11991181
        },
        {
            "time": "2015-03-01T00:18:00+00:00",
            "price": "0.003958567143537345",
            "baseAmount": 54.95776227293271,
            "counterAmount": 0.21755399201596803,
            "account": "rDVBvAQScXrGRGnzrxRrcJPeNLeLeUTAqE",
            "counterparty": "rfZ4YjC4CyaKFx9cgzYNKk4E2zTXRJif26",
            "tx_hash": "139159A556F7F240078D378F3FCF556D01EF2C99DB79DD84338E7AD71419EEA6",
            "ledgerIndex": 11991181
        },
        {
            "time": "2015-03-01T00:18:00+00:00",
            "price": "0.003958567143537345",
            "baseAmount": 91.90007712981681,
            "counterAmount": 0.3637926258146406,
            "account": "rDVBvAQScXrGRGnzrxRrcJPeNLeLeUTAqE",
            "counterparty": "rEiUs9rEiGHmpaprkYDNyXnJYg4ANxWLy9",
            "tx_hash": "10E7823DFE7B2F4EAD204A5FA212DCE9624FD87AA5B45E29AE21C2BFCC797CD8",
            "ledgerIndex": 11991181
        }
    ]
}
```

</div>

**If results are reduced** (the default), then each result represents an interval of time, with the following attributes, in order:

| Field | Value | Description |
|-------|-------|-------------|
| startTime | String ([Date-Time][]) | The start time of this interval. |
| baseVolume | Number | Total amount of the base currency traded in this interval. |
| counterVolume | Number | Total amount of the counter currency traded in this interval. |
| count | Number | Number of trades in this interval. |
| open | Number | Price of the first trade in this interval. |
| high | Number | Highest price traded in this interval. (Most counter currency received per unit of base currency spent.) |
| low | Number | Lowest price traded in this interval. (Least counter currency received per unit of base currency spent.) |
| close | Number | Price of the last trade in this interval. |
| vwap | Number | [Volume weighted average price](http://en.wikipedia.org/wiki/Volume-weighted_average_price) of trades in this interval. |
| openTime | String ([Date-Time][]) | The time at which the first trade in this interval occurred. |
| closeTime | String ([Date-Time][]) | The time at which the last trade in this interval occurred. |
| partial | Boolean | If true, this row may not include all trades in the interval due to the alignment of the requested time period. For example, a time interval of 1 minute was requested, but the end time for the range was 3:45:30. |

All prices are represented as the amount of the counter currency received for each unit of the base-currency spent.

The time of an exchange is defined as the close time of the ledger that contained the transaction exercising the exchange.

Note: The API omits intervals during which no exchanges occurred. This means that the rows may not be sequential. (They _are_ in order, but with gaps for empty intervals.)

**If the results are not reduced** (the request used `"reduce":false`), then each result represents an individual transaction that caused a currency exchange, with the following attributes:

| Field | Value | Description |
|-------|-------|-------------|
| time  | String ([Date-Time][]) | The time this transaction occurred, as defined by the close time of the ledger that included it. |
| price | Number | The amount of the counter currency received for each unit of the base-currency spent in this trade. |
| baseAmount | Number | Total amount of the base currency spent in this trade. |
| counterAmount | Number | Total amount of the counter currency received in this trade. |
| account | String | The Ripple address of the account providing the base currency. |
| counterparty | String | The Ripple address of the account providing the counter currency. |
| tx_hash | String | The identifying hash of the transaction where this transaction occurred. |
| ledgerIndex | Number | The sequence number of the ledger that included this transaction. |
