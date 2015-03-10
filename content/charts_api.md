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



# API Objects #

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


## Offers Exercised ##
[[Source]<br>](https://github.com/ripple/ripple-data-api/blob/master/api/routes/offersExercised.js "Source")

Retrieve information about currency-exchange orders being exercised on the network, for a specific pair of currencies and timeframe.

<div class='multicode'>

*15-minute increments*

```
POST /offers_exercised
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
POST /offers_exercised
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
