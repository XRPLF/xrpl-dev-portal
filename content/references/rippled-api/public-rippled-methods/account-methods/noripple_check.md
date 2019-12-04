# noripple_check
[[Source]](https://github.com/ripple/rippled/blob/9111ad1a9dc37d49d085aa317712625e635197c0/src/ripple/rpc/handlers/NoRippleCheck.cpp "Source")

The `noripple_check` command provides a quick way to check the status of [the DefaultRipple field for an account and the NoRipple flag of its trust lines](rippling.html), compared with the recommended settings.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
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

*JSON-RPC*

```
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

<!-- MULTICODE_BLOCK_END -->

**Note:** There is no command-line syntax for this method. Use the [json method][] to access this from the command line.

The request includes the following parameters:

| `Field`        | Type                       | Description                    |
|:---------------|:---------------------------|:-------------------------------|
| `account`      | String                     | A unique identifier for the account, most commonly the account's address. |
| `role`         | String                     | Whether the address refers to a `gateway` or `user`. Recommendations depend on the role of the account. Issuers must have DefaultRipple enabled and must disable NoRipple on all trust lines. Users should have DefaultRipple disabled, and should enable NoRipple on all trust lines. |
| `transactions` | Boolean                    | _(Optional)_ If `true`, include an array of suggested [transactions](transaction-formats.html), as JSON objects, that you can sign and submit to fix the problems. Defaults to false. |
| `limit`        | Unsigned Integer           | _(Optional)_ The maximum number of trust line problems to include in the results. Defaults to 300. |
| `ledger_hash`  | String                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | String or Unsigned Integer | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
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

*JSON-RPC*

```
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

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                | Type   | Description                                |
|:-----------------------|:-------|:-------------------------------------------|
| `ledger_current_index` | Number | The [ledger index][] of the ledger used to calculate these results. |
| `problems`             | Array  | Array of strings with human-readable descriptions of the problems. This includes up to one entry if the account's DefaultRipple setting is not as recommended, plus up to `limit` entries for trust lines whose NoRipple setting is not as recommended. |
| `transactions`         | Array  | (May be omitted) If the request specified `transactions` as `true`, this is an array of JSON objects, each of which is the JSON form of a [transaction](transaction-formats.html) that should fix one of the described problems. The length of this array is the same as the `problems` array, and each entry is intended to fix the problem described at the same index into that array. |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The [Address][] specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
