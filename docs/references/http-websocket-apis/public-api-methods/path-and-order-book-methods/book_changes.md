---
seo:
    description: Get information on order book changes
labels:
    - Decentralized Exchange
    - Cross-Currency
---
# book_changes
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/rpc/BookChanges.h "Source")

The {% code-page-name /%} method reports information about changes to the order books in the [decentralized exchange (DEX)](../../../../concepts/tokens/decentralized-exchange/index.md) compared with the previous ledger version. This may be useful for building "candlestick" charts.

### Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "example_book_changes",
    "command": "{% $frontmatter.seo.title %}",
    "ledger_index": 88530953
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "{% $frontmatter.seo.title %}",
    "params": [{
      "ledger_index": 88530953
    }]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: book_changes [<ledger hash|id>]
rippled book_changes 88530953
```
{% /tab %}

{% /tabs %}

{% try-it method="book_changes" /%}

The request includes the following parameters:

| Field          | Type             | Required? | Description |
|:---------------|:-----------------|:----------|-------------|
| `ledger_hash`  | [Hash][]         | No        | A 32-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | [Ledger Index][] | No        | The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/book_changes/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/book_changes/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% tab label="Commandline" %}
{% code-snippet file="/_api-examples/book_changes/jsonrpc-response.json" language="json" prefix="Loading: \"/etc/opt/ripple/rippled.cfg\"\n2024-Jun-07 18:41:45.257772761 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005\n\n" /%}
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| Field          | Type             | Description             |
|:---------------|:-----------------|:------------------------|
| `changes`      | Array            | List of [Book Update Objects](#book-update-objects), containing one entry for each order book that was updated in this ledger version. The array is empty if no order books were updated. |
| `ledger_hash`  | [Hash][]         | The identifying hash of the ledger version that was used when retrieving this data. |
| `ledger_index` | [Ledger Index][] | The ledger index of the ledger version that was used when retrieving this data. |
| `ledger_time`  | Number           | The official close time of the ledger that was used when retrieving this data, in [seconds since the Ripple Epoch][]. |
| `type`         | String           | The string `bookChanges`, which indicates that this is an order book update message. |
| `validated`    | Boolean          | _(May be omitted)_ If `true`, the information comes from a validated ledger version. |

### Book Update Objects

A Book Update Object represents the changes to a single order book in a single ledger version, and contains the following fields:

| Field          | Type             | Description             |
|:---------------|:-----------------|:------------------------|
| `currency_a`   | String | An identifier for the first of the two currencies in the order book. For XRP, this is the string `XRP_drops`. For [tokens](../../../../concepts/tokens/index.md), this is formatted as the address of the issuer in [base58][], followed by a forward-slash (`/`), followed by the [Currency Code][] for the token, which can be a 3-character standard code or a 20-character hexadecimal code. |
| `currency_b`   | String | An identifier for the second of two currencies in the order book. This is in the same format as `currency_a`, except `currency_b` can never be XRP. 
| `volume_a`     | String - Number | The total amount, or _volume_, of the first currency (that is, `currency_a`) that moved as a result of trades through this order book in this ledger. |
| `volume_b`     | String - Number | The volume of the second currency (that is, `currency_b`) that moved as a result of trades through this order book in this ledger. |
| `high`         | String - Number | The highest exchange rate among all offers matched in this ledger, as a ratio of the first currency to the second currency. (In other words, `currency_a : currency_b`.) |
| `low`          | String - Number | The lowest exchange rate among all offers matched in this ledger, as a ratio of the first currency to the second currency. |
| `open`         | String - Number | The exchange rate at the top of this order book before processing the transactions in this ledger, as a ratio of the first currency to the second currency. |
| `close`        | String - Number | The exchange rate at the top of this order book after processing the transactions in this ledger, as a ratio of the first currency to the second currency. |

For XRP-token order books, XRP is always `currency_a`. For token-token order books, the currencies are sorted alphabetically by the issuer and then currency code.

Exchange rates involving XRP are always calculated using [drops of XRP][]. For example, if the rate from XRP to FOO is 1.0 XRP to 1 FOO, the rate reported by the API is `1000000` (1 million drops of XRP per 1 FOO).

## Possible Errors

* Any of the [universal error types][].
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
