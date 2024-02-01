---
html: noripple_check.html
parent: account-methods.html
seo:
    description: Get recommended changes to an account's Default Ripple and No Ripple settings.
labels:
  - Tokens
---
# noripple_check
[[Source]](https://github.com/XRPLF/rippled/blob/9111ad1a9dc37d49d085aa317712625e635197c0/src/ripple/rpc/handlers/NoRippleCheck.cpp "Source")

The `noripple_check` command provides a quick way to check the status of [the Default Ripple field for an account and the No Ripple flag of its trust lines](../../../../concepts/tokens/fungible-tokens/rippling.md), compared with the recommended settings.


## Request Format
An example of the request format:

{% raw-partial file="/docs/_snippets/no-cli-syntax.md" /%}

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 0,
    "command": "noripple_check",
    "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "role": "gateway",
    "ledger_index": "current",
    "limit": 2,
    "transactions": true
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "noripple_check",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "ledger_index": "current",
            "limit": 2,
            "role": "gateway",
            "transactions": true
        }
    ]
}
```
{% /tab %}

{% /tabs %}


The request includes the following parameters:

| `Field`        | Type                       | Description                    |
|:---------------|:---------------------------|:-------------------------------|
| `account`      | String                     | A unique identifier for the account, most commonly the account's address. |
| `role`         | String                     | Whether the address refers to a `gateway` or `user`. Recommendations depend on the role of the account. Issuers must have Default Ripple enabled and must disable No Ripple on all trust lines. Users should have Default Ripple disabled, and should enable No Ripple on all trust lines. |
| `transactions` | Boolean                    | [API v1][]: _(Optional)_ If `true`, include an array of suggested [transactions](../../../protocol/transactions/index.md), as JSON objects, that you can sign and submit to fix the problems. The default is `false`.<br>[API v2][]: Identical to v1, but also returns an `invalidParams` error if you use a non-boolean value. |
| `limit`        | Unsigned Integer           | _(Optional)_ The maximum number of trust line problems to include in the results. Defaults to 300. |
| `ledger_hash`  | String                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | String or Unsigned Integer | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 0,
  "status": "success",
  "type": "response",
  "result": {
    "ledger_current_index": 14342939,
    "problems": [
      "You should immediately set your default ripple flag",
      "You should clear the no ripple flag on your XAU line to r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
      "You should clear the no ripple flag on your USD line to rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
    ],
    "transactions": [
      {
        "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "Fee": 10000,
        "Sequence": 1406,
        "SetFlag": 8,
        "TransactionType": "AccountSet"
      },
      {
        "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "Fee": 10000,
        "Flags": 262144,
        "LimitAmount": {
          "currency": "XAU",
          "issuer": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
          "value": "0"
        },
        "Sequence": 1407,
        "TransactionType": "TrustSet"
      },
      {
        "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "Fee": 10000,
        "Flags": 262144,
        "LimitAmount": {
          "currency": "USD",
          "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
          "value": "5"
        },
        "Sequence": 1408,
        "TransactionType": "TrustSet"
      }
    ],
    "validated": false
  }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "ledger_current_index": 14380381,
        "problems": [
            "You should immediately set your default ripple flag",
            "You should clear the no ripple flag on your XAU line to r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
            "You should clear the no ripple flag on your USD line to rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
        ],
        "status": "success",
        "transactions": [
            {
                "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                "Fee": 10000,
                "Sequence": 1406,
                "SetFlag": 8,
                "TransactionType": "AccountSet"
            },
            {
                "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                "Fee": 10000,
                "Flags": 262144,
                "LimitAmount": {
                    "currency": "XAU",
                    "issuer": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
                    "value": "0"
                },
                "Sequence": 1407,
                "TransactionType": "TrustSet"
            },
            {
                "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                "Fee": 10000,
                "Flags": 262144,
                "LimitAmount": {
                    "currency": "USD",
                    "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                    "value": "5"
                },
                "Sequence": 1408,
                "TransactionType": "TrustSet"
            }
        ],
        "validated": false
    }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                | Type   | Description                                |
|:-----------------------|:-------|:-------------------------------------------|
| `ledger_current_index` | Number | The [ledger index][] of the ledger used to calculate these results. |
| `problems`             | Array  | Array of strings with human-readable descriptions of the problems. This includes up to one entry if the account's Default Ripple setting is not as recommended, plus up to `limit` entries for trust lines whose No Ripple setting is not as recommended. |
| `transactions`         | Array  | (May be omitted) If the request specified `transactions` as `true`, this is an array of JSON objects, each of which is the JSON form of a [transaction](../../../protocol/transactions/index.md) that should fix one of the described problems. The length of this array is the same as the `problems` array, and each entry is intended to fix the problem described at the same index into that array. |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The [Address][] specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
