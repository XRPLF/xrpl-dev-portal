# account_lines
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/AccountLines.cpp "Source")

The `account_lines` method returns information about an account's trust lines, including balances in all non-XRP currencies and assets. All information retrieved is relative to a particular version of the ledger.

## Request Format

An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 1,
  "command": "account_lines",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
}
```

*JSON-RPC*

```
{
    "method": "account_lines",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
        }
    ]
}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#account_lines)

The request accepts the following paramters:

| `Field`        | Type                                       | Description    |
|:---------------|:-------------------------------------------|:---------------|
| `account`      | String                                     | A unique identifier for the account, most commonly the account's [Address][]. |
| `ledger_hash`  | String                                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | String or Unsigned Integer                 | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `peer`         | String                                     | _(Optional)_ The [Address][] of a second account. If provided, show only lines of trust connecting the two accounts. |
| `limit`        | Integer                                    | (Optional, default varies) Limit the number of trust lines to retrieve. The server is not required to honor this value. Must be within the inclusive range 10 to 400. [New in: rippled 0.26.4][] |
| `marker`       | [Marker][] | _(Optional)_ Value from a previous paginated response. Resume retrieving data where that response left off. [New in: rippled 0.26.4][] |

The following parameters are deprecated and may be removed without further notice: `ledger` and `peer_index`.

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": 1,
    "status": "success",
    "type": "response",
    "result": {
        "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "lines": [
            {
                "account": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
                "balance": "0",
                "currency": "ASP",
                "limit": "0",
                "limit_peer": "10",
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
                "balance": "0",
                "currency": "XAU",
                "limit": "0",
                "limit_peer": "0",
                "no_ripple": true,
                "no_ripple_peer": true,
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                "balance": "3.497605752725159",
                "currency": "USD",
                "limit": "5",
                "limit_peer": "0",
                "no_ripple": true,
                "quality_in": 0,
                "quality_out": 0
            }
        ]
    }
}
```

*JSON-RPC*

```
200 OK
{
    "result": {
        "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "lines": [
            {
                "account": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
                "balance": "0",
                "currency": "ASP",
                "limit": "0",
                "limit_peer": "10",
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
                "balance": "0",
                "currency": "XAU",
                "limit": "0",
                "limit_peer": "0",
                "no_ripple": true,
                "no_ripple_peer": true,
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rs9M85karFkCRjvc6KMWn8Coigm9cbcgcx",
                "balance": "0",
                "currency": "015841551A748AD2C1F76FF6ECB0CCCD00000000",
                "limit": "10.01037626125837",
                "limit_peer": "0",
                "no_ripple": true,
                "quality_in": 0,
                "quality_out": 0
            }
        ],
        "status": "success"
    }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the address of the account and an array of trust line objects. Specifically, the result object contains the following fields:

| `Field`                | Type                       | Description            |
|:-----------------------|:---------------------------|:-----------------------|
| `account`              | String                     | Unique [Address][] of the account this request corresponds to. This is the "perspective account" for purpose of the trust lines. |
| `lines`                | Array                      | Array of trust line objects, as described below. If the number of trust lines is large, only returns up to the `limit` at a time. |
| `ledger_current_index` | Integer - [Ledger Index][] | _(Omitted if `ledger_hash` or `ledger_index` provided)_ The ledger index of the current open ledger, which was used when retrieving this information. [New in: rippled 0.26.4-sp1][] |
| `ledger_index`         | Integer - [Ledger Index][] | _(Omitted if `ledger_current_index` provided instead)_ The ledger index of the ledger version that was used when retrieving this data. [New in: rippled 0.26.4-sp1][] |
| `ledger_hash`          | String - [Hash][]          | _(May be omitted)_ The identifying hash the ledger version that was used when retrieving this data. [New in: rippled 0.26.4-sp1][] |
| `marker`               | [Marker][]                 | Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. Omitted when there are no additional pages after this one. [New in: rippled 0.26.4][] |

Each trust line object has some combination of the following fields:

| `Field`          | Type             | Description                            |
|:-----------------|:-----------------|:---------------------------------------|
| `account`        | String           | The unique [Address][] of the counterparty to this trust line. |
| `balance`        | String           | Representation of the numeric balance currently held against this line. A positive balance means that the perspective account holds value; a negative balance means that the perspective account owes value. |
| `currency`       | String           | A [Currency Code][] identifying what currency this trust line can hold. |
| `limit`          | String           | The maximum amount of the given currency that this account is willing to owe the peer account |
| `limit_peer`     | String           | The maximum amount of currency that the counterparty account is willing to owe the perspective account |
| `quality_in`     | Unsigned Integer | Rate at which the account values incoming balances on this trust line, as a ratio of this value per 1 billion units. (For example, a value of 500 million represents a 0.5:1 ratio.) As a special case, 0 is treated as a 1:1 ratio. |
| `quality_out`    | Unsigned Integer | Rate at which the account values outgoing balances on this trust line, as a ratio of this value per 1 billion units. (For example, a value of 500 million represents a 0.5:1 ratio.) As a special case, 0 is treated as a 1:1 ratio. |
| `no_ripple`      | Boolean          | (May be omitted) `true` if this account has enabled the [NoRipple flag](rippling.html) for this line. If omitted, that is the same as `false`. |
| `no_ripple_peer` | Boolean          | (May be omitted) `true` if the peer account has enabled the [NoRipple flag](rippling.html). If omitted, that is the same as `false`. |
| `authorized`     | Boolean          | (May be omitted) `true` if this account has [authorized this trust line](authorized-trust-lines.html). If omitted, that is the same as `false`. |
| `peer_authorized`| Boolean          | (May be omitted) `true` if the peer account has [authorized this trust line](authorized-trust-lines.html). If omitted, that is the same as `false`. |
| `freeze`         | Boolean          | (May be omitted) `true` if this account has [frozen](freezes.html) this trust line. If omitted, that is the same as `false`. |
| `freeze_peer`    | Boolean          | (May be omitted) `true` if the peer account has [frozen](freezes.html) this trust line. If omitted, that is the same as `false`. |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The [Address][] specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `actMalformed` - If the `marker` field provided is not acceptable.


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
