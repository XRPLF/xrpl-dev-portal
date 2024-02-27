---
html: account_currencies.html
parent: account-methods.html
seo:
    description: Get a list of currencies an account can send or receive.
labels:
  - Tokens
---
# account_currencies
[[Source]](https://github.com/XRPLF/rippled/blob/df966a9ac6dd986585ecccb206aff24452e41a30/src/ripple/rpc/handlers/AccountCurrencies.cpp "Source")

The `account_currencies` command retrieves a list of currencies that an account can send or receive, based on its trust lines. (This is not a thoroughly confirmed list, but it can be used to populate user interfaces.)

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "command": "account_currencies",
    "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "account_currencies",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "account_index": 0,
            "ledger_index": "validated"
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: account_currencies account [ledger_index|ledger_hash]
rippled account_currencies rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn validated
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#account_currencies)

The request includes the following parameters:

| `Field`        | Type                 | Required? | Description |
|:---------------|:---------------------|:----------|-------------|
| `account`      | String - [Address][] | Yes       | Look up currencies this account can send or receive. {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.11.0" %}Updated in: rippled 1.11.0{% /badge %} |
| `ledger_hash`  | String               | No        | A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | Number or String     | No        | The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |

The following fields are deprecated and should not be provided: `account_index`, `strict`.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
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
{% /tab %}

{% tab label="JSON-RPC" %}
```json
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
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "ledger_hash" : "F43A801ED4562FA744A35755B86BE898D91C5643BF499924EA3C69491B8C28D1",
      "ledger_index" : 56843649,
      "receive_currencies" : [ "USD" ],
      "send_currencies" : [ "NGN", "TRC" ],
      "status" : "success",
      "validated" : true
   }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`              | Type                       | Description              |
|:---------------------|:---------------------------|:-------------------------|
| `ledger_hash`        | String - [Hash][]          | (May be omitted) The identifying hash of the ledger version used to retrieve this data, as hex. |
| `ledger_index`       | Integer - [Ledger Index][] | The ledger index of the ledger version used to retrieve this data. |
| `receive_currencies` | Array of Strings           | Array of [Currency Code][]s for currencies that this account can receive. |
| `send_currencies`    | Array of Strings           | Array of [Currency Code][]s for currencies that this account can send. |
| `validated`          | Boolean                    | If `true`, this data comes from a validated ledger. |

**Note:** The currencies that an account can send or receive are defined based on a check of its trust lines. If an account has a trust line for a currency and enough room to increase its balance, it can receive that currency. If the trust line's balance can go down, the account can send that currency. This method _doesn't_ check whether the trust line is [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md) or authorized.

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The address specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
