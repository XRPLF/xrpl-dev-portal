---
html: unsubscribe.html
parent: subscription-methods.html
seo:
    description: Stop listening for updates about a particular subject.
labels:
  - Payments
  - Blockchain
  - Accounts
  - Smart Contracts
---
# unsubscribe

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Unsubscribe.cpp "Source")

The `unsubscribe` command tells the server to stop sending messages for a particular subscription or set of subscriptions.

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "Unsubscribe a lot of stuff",
    "command": "unsubscribe",
    "streams": ["ledger","server","transactions","transactions_proposed"],
    "accounts": ["rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1"],
    "accounts_proposed": ["rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1"],
    "books": [
        {
            "taker_pays": {
                "currency": "XRP"
            },
            "taker_gets": {
                "currency": "USD",
                "issuer": "rUQTpMqAF5jhykj4FExVeXakrZpiKF6cQV"
            },
            "both": true
        }
    ]
}
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#unsubscribe)

The parameters in the request are specified almost exactly like the parameters to the [subscribe method][], except that they are used to define which subscriptions to end instead. The parameters are:

| `Field`             | Type  | Required? | Description                                    |
|:--------------------|:------|:----------|:-----------------------------------------------|
| `streams`           | Array | No        | Array of string names of generic streams to unsubscribe from, including `ledger`, `server`, `transactions`, and `transactions_proposed`. |
| `accounts`          | Array | No        | Array of unique account addresses to stop receiving updates for, in the XRP Ledger's [base58][] format. (This only stops those messages if you previously subscribed to those accounts specifically. You cannot use this to filter accounts out of the general transactions stream.) |
| `accounts_proposed` | Array | No        | Like `accounts`, but for `accounts_proposed` subscriptions that included not-yet-validated transactions. |
| `books`             | Array | No        | Array of objects defining order books to unsubscribe from, as explained below. |

The `rt_accounts` and `url` parameters, and the `rt_transactions` stream name, are deprecated and may be removed without further notice.

The objects in the `books` array are defined almost like the ones from subscribe, except that they don't have all the fields. The fields they have are as follows:

| `Field`      | Type    | Required? | Description                                         |
|:-------------|:--------|:----------|:----------------------------------------------------|
| `taker_gets` | Object  | No        | Specification of which currency the account taking the offer would receive, as an object with `currency` and `issuer` fields. Omit `issuer` for XRP. |
| `taker_pays` | Object  | No        | Specification of which currency the account taking the offer would receive, as an object with `currency` and `issuer` fields. Omit `issuer` for XRP. |
| `both`       | Boolean | No        | If `true`, remove a subscription for both sides of the order book. |

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "Unsubscribe a lot of stuff",
    "result": {},
    "status": "success",
    "type": "response"
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing no fields.

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `noPermission` - The request included the `url` field, but you are not connected as an admin.
* `malformedStream` - The `streams` field of the request is not formatted properly.
* `malformedAccount` - One of the addresses in the `accounts` or `accounts_proposed` fields of the request is not a properly-formatted XRP Ledger address.
    * **Note:** You _can_ subscribe to the stream of an address that does not yet have an entry in the global ledger to get a message when that address becomes funded.
* `srcCurMalformed` - One or more `taker_pays` sub-fields of the `books` field in the request is not formatted properly.
* `dstAmtMalformed` - One or more `taker_gets` sub-fields of the `books` field in the request is not formatted properly.
* `srcIsrMalformed` - The `issuer` field of one or more `taker_pays` sub-fields of the `books` field in the request is not valid.
* `dstIsrMalformed` - The `issuer` field of one or more `taker_gets` sub-fields of the `books` field in the request is not valid.
* `badMarket` - One or more desired order books in the `books` field does not exist; for example, offers to exchange a currency for itself.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
