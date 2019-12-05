# account_currencies
[[Source]](https://github.com/ripple/rippled/blob/df966a9ac6dd986585ecccb206aff24452e41a30/src/ripple/rpc/handlers/AccountCurrencies.cpp "Source")

The `account_currencies` command retrieves a list of currencies that an account can send or receive, based on its trust lines. (This is not a thoroughly confirmed list, but it can be used to populate user interfaces.)

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "command": "account_currencies",
    "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "strict": true,
    "ledger_index": "validated"
}
```

*JSON-RPC*

```
{
    "method": "account_currencies",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "account_index": 0,
            "ledger_index": "validated",
            "strict": true
        }
    ]
}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#account_currencies)

The request includes the following parameters:

| `Field`        | Type                       | Description                    |
|:---------------|:---------------------------|:-------------------------------|
| `account`      | String                     | A unique identifier for the account, most commonly the account's [Address][]. |
| `strict`       | Boolean                    | _(Optional)_ If true, only accept an address or public key for the account parameter. Defaults to false. |
| `ledger_hash`  | String                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | String or Unsigned Integer | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |

The following field is deprecated and should not be provided: `account_index`.

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "result": {
        "ledger_index": 11775844,
        "receive_currencies": [
            "BTC",
            "CNY",
            "DYM",
            "EUR",
            "JOE",
            "MXN",
            "USD",
            "015841551A748AD2C1F76FF6ECB0CCCD00000000"
        ],
        "send_currencies": [
            "ASP",
            "BTC",
            "CHF",
            "CNY",
            "DYM",
            "EUR",
            "JOE",
            "JPY",
            "MXN",
            "USD"
        ],
        "validated": true
    },
    "status": "success",
    "type": "response"
}
```

*JSON-RPC*

```
200 OK
{
    "result": {
        "ledger_index": 11775823,
        "receive_currencies": [
            "BTC",
            "CNY",
            "DYM",
            "EUR",
            "JOE",
            "MXN",
            "USD",
            "015841551A748AD2C1F76FF6ECB0CCCD00000000"
        ],
        "send_currencies": [
            "ASP",
            "BTC",
            "CHF",
            "CNY",
            "DYM",
            "EUR",
            "JOE",
            "JPY",
            "MXN",
            "USD"
        ],
        "status": "success",
        "validated": true
    }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`              | Type                       | Description              |
|:---------------------|:---------------------------|:-------------------------|
| `ledger_hash`        | String - [Hash][]          | (May be omitted) The identifying hash of the ledger version used to retrieve this data, as hex. |
| `ledger_index`       | Integer - [Ledger Index][] | The ledger index of the ledger version used to retrieve this data. |
| `receive_currencies` | Array of Strings           | Array of [Currency Code][]s for currencies that this account can receive. |
| `send_currencies`    | Array of Strings           | Array of [Currency Code][]s for currencies that this account can send. |
| `validated`          | Boolean                    | If `true`, this data comes from a validated ledger. |

**Note:** The currencies that an account can send or receive are defined based on a check of its trust lines. If an account has a trust line for a currency and enough room to increase its balance, it can receive that currency. If the trust line's balance can go down, the account can send that currency. This method _doesn't_ check whether the trust line is [frozen](freezes.html) or authorized.

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The address specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.


{% include '_snippets/rippled-api-links.md' %}
