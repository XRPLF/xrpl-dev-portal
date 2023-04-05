---
html: account_lines.html
parent: account-methods.html
blurb: Get info about an account's trust lines.
labels:
  - Tokens
---
# account_lines
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/AccountLines.cpp "Source")

The `account_lines` method returns information about an account's trust lines, which contain balances in all non-XRP currencies and assets. All information retrieved is relative to a particular version of the ledger.

## Request Format

An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 1,
  "command": "account_lines",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
}
```

*JSON-RPC*

```json
{
    "method": "account_lines",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
        }
    ]
}
```

*Commandline*

```sh
#Syntax: account_lines <account> [<peer>] [<ledger_index>|<ledger_hash>]
rippled account_lines r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#account_lines)

The request accepts the following parameters:

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

```json
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

```json
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

*Commandline*
```json
{
   "result" : {
      "account" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "ledger_current_index" : 56867265,
      "lines" : [
         {
            "account" : "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
            "balance" : "0",
            "currency" : "ASP",
            "limit" : "0",
            "limit_peer" : "10",
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
            "balance" : "0",
            "currency" : "XAU",
            "limit" : "0",
            "limit_peer" : "0",
            "no_ripple" : true,
            "no_ripple_peer" : true,
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
            "balance" : "5",
            "currency" : "USD",
            "limit" : "5",
            "limit_peer" : "0",
            "no_ripple" : true,
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rHpXfibHgSb64n8kK9QWDpdbfqSpYbM9a4",
            "balance" : "481.992867407479",
            "currency" : "MXN",
            "limit" : "1000",
            "limit_peer" : "0",
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
            "balance" : "0.793598266778297",
            "currency" : "EUR",
            "limit" : "1",
            "limit_peer" : "0",
            "no_ripple" : true,
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
            "balance" : "0",
            "currency" : "CNY",
            "limit" : "3",
            "limit_peer" : "0",
            "no_ripple" : true,
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
            "balance" : "1.336889190631542",
            "currency" : "DYM",
            "limit" : "3",
            "limit_peer" : "0",
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "balance" : "0.3488146605801446",
            "currency" : "CHF",
            "limit" : "0",
            "limit_peer" : "0",
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "balance" : "0",
            "currency" : "BTC",
            "limit" : "3",
            "limit_peer" : "0",
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "balance" : "11.68225001668339",
            "currency" : "USD",
            "limit" : "5000",
            "limit_peer" : "0",
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rpgKWEmNqSDAGFhy5WDnsyPqfQxbWxKeVd",
            "balance" : "-0.00111",
            "currency" : "BTC",
            "limit" : "0",
            "limit_peer" : "10",
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rBJ3YjwXi2MGbg7GVLuTXUWQ8DjL7tDXh4",
            "balance" : "-0.0008744482690504699",
            "currency" : "BTC",
            "limit" : "0",
            "limit_peer" : "10",
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
            "balance" : "0",
            "currency" : "USD",
            "limit" : "1",
            "limit_peer" : "0",
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA",
            "balance" : "9.07619790068559",
            "currency" : "CNY",
            "limit" : "100",
            "limit_peer" : "0",
            "no_ripple" : true,
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "balance" : "7.292695098901099",
            "currency" : "JPY",
            "limit" : "0",
            "limit_peer" : "0",
            "no_ripple" : true,
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
            "balance" : "0",
            "currency" : "AUX",
            "limit" : "0",
            "limit_peer" : "0",
            "no_ripple" : true,
            "no_ripple_peer" : true,
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "r9vbV3EHvXWjSkeQ6CAcYVPGeq7TuiXY2X",
            "balance" : "0.0004557360418801623",
            "currency" : "USD",
            "limit" : "1",
            "limit_peer" : "0",
            "no_ripple" : true,
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "balance" : "12.41688780720394",
            "currency" : "EUR",
            "limit" : "100",
            "limit_peer" : "0",
            "no_ripple" : true,
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rfF3PNkwkq1DygW2wum2HK3RGfgkJjdPVD",
            "balance" : "35",
            "currency" : "USD",
            "limit" : "500",
            "limit_peer" : "0",
            "no_ripple" : true,
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rwUVoVMSURqNyvocPCcvLu3ygJzZyw8qwp",
            "balance" : "-5",
            "currency" : "JOE",
            "limit" : "0",
            "limit_peer" : "50",
            "no_ripple_peer" : true,
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rE6R3DWF9fBD7CyiQciePF9SqK58Ubp8o2",
            "balance" : "0",
            "currency" : "USD",
            "limit" : "0",
            "limit_peer" : "100",
            "no_ripple_peer" : true,
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rE6R3DWF9fBD7CyiQciePF9SqK58Ubp8o2",
            "balance" : "0",
            "currency" : "JOE",
            "limit" : "0",
            "limit_peer" : "100",
            "no_ripple_peer" : true,
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rs9M85karFkCRjvc6KMWn8Coigm9cbcgcx",
            "balance" : "0",
            "currency" : "015841551A748AD2C1F76FF6ECB0CCCD00000000",
            "limit" : "10.01037626125837",
            "limit_peer" : "0",
            "no_ripple" : true,
            "quality_in" : 0,
            "quality_out" : 0
         },
         {
            "account" : "rEhDDUUNxpXgEHVJtC2cjXAgyx5VCFxdMF",
            "balance" : "0",
            "currency" : "USD",
            "limit" : "0",
            "limit_peer" : "1",
            "quality_in" : 0,
            "quality_out" : 0
         }
      ],
      "status" : "success",
      "validated" : false
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
| `no_ripple`      | Boolean          | _(May be omitted)_ If `true`, this account has enabled the [No Ripple flag](rippling.html) for this trust line. If present and `false`, this account has disabled the No Ripple flag, but, because the account also has the Default Ripple flag disabled, that is not considered [the default state](ripplestate.html#contributing-to-the-owner-reserve). If omitted, the account has the No Ripple flag disabled for this trust line and Default Ripple enabled. [Updated in: rippled 1.7.0][] |
| `no_ripple_peer` | Boolean          | _(May be omitted)_ If `true`, the peer account has enabled the [No Ripple flag](rippling.html) for this trust line. If present and `false`, this account has disabled the No Ripple flag, but, because the account also has the Default Ripple flag disabled, that is not considered [the default state](ripplestate.html#contributing-to-the-owner-reserve). If omitted, the account has the No Ripple flag disabled for this trust line and Default Ripple enabled. [Updated in: rippled 1.7.0][] |
| `authorized`     | Boolean          | _(May be omitted)_ If `true`, this account has [authorized this trust line](authorized-trust-lines.html). The default is `false`. |
| `peer_authorized`| Boolean          | _(May be omitted)_ If `true`, the peer account has [authorized this trust line](authorized-trust-lines.html). The default is `false`. |
| `freeze`         | Boolean          | _(May be omitted)_ If `true`, this account has [frozen](freezes.html) this trust line. The default is `false`. |
| `freeze_peer`    | Boolean          | _(May be omitted)_ If `true`, the peer account has [frozen](freezes.html) this trust line. The default is `false`. |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The [Address][] specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `actMalformed` - If the `marker` field provided is not acceptable.


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
