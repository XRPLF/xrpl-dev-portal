# account_info
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/AccountInfo.cpp "Source")

The `account_info` command retrieves information about an account, its activity, and its XRP balance. All information retrieved is relative to a particular version of the ledger.

## Request Format

An example of an account_info request:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 2,
  "command": "account_info",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "strict": true,
  "ledger_index": "current",
  "queue": true
}
```

*JSON-RPC*

```
{
    "method": "account_info",
    "params": [
        {
            "account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
            "strict": true,
            "ledger_index": "current",
            "queue": true
        }
    ]
}
```

*Commandline*

```
#Syntax: account_info account [ledger_index|ledger_hash] [strict]
rippled account_info r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 true
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#account_info)

The request contains the following parameters:

| `Field`        | Type                       | Description                    |
|:---------------|:---------------------------|:-------------------------------|
| `account`      | String                     | A unique identifier for the account, most commonly the account's [Address][]. |
| `strict`       | Boolean                    | (Optional, defaults to False) If set to True, then the `account` field only accepts a public key or XRP Ledger address. |
| `ledger_hash`  | String                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | String or Unsigned Integer | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `queue`        | Boolean                    | _(Optional)_ If `true`, and the [FeeEscalation amendment][] is enabled, also returns stats about queued transactions associated with this account. Can only be used when querying for the data from the current open ledger. [New in: rippled 0.33.0][] |
| `signer_lists` | Boolean                    | _(Optional)_ If `true`, and the [MultiSign amendment][] is enabled, also returns any [SignerList objects](signerlist.html) associated with this account. [New in: rippled 0.31.0][] |

The following fields are deprecated and should not be provided: `ident`, `ledger`.

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": 5,
    "status": "success",
    "type": "response",
    "result": {
        "account_data": {
            "Account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
            "Balance": "999999999960",
            "Flags": 8388608,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 0,
            "PreviousTxnID": "4294BEBE5B569A18C0A2702387C9B1E7146DC3A5850C1E87204951C6FDAA4C42",
            "PreviousTxnLgrSeq": 3,
            "Sequence": 6,
            "index": "92FA6A9FC8EA6018D5D16532D7795C91BFB0831355BDFDA177E86C8BF997985F"
        },
        "ledger_current_index": 4,
        "queue_data": {
            "auth_change_queued": true,
            "highest_sequence": 10,
            "lowest_sequence": 6,
            "max_spend_drops_total": "500",
            "transactions": [
                {
                    "auth_change": false,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 6
                },
                ... (trimmed for length) ...
                {
                    "LastLedgerSequence": 10,
                    "auth_change": true,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 10
                }
            ],
            "txn_count": 5
        },
        "validated": false
    }
}
```

*JSON-RPC*

```
{
    "result": {
        "account_data": {
            "Account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
            "Balance": "999999999960",
            "Flags": 8388608,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 0,
            "PreviousTxnID": "4294BEBE5B569A18C0A2702387C9B1E7146DC3A5850C1E87204951C6FDAA4C42",
            "PreviousTxnLgrSeq": 3,
            "Sequence": 6,
            "index": "92FA6A9FC8EA6018D5D16532D7795C91BFB0831355BDFDA177E86C8BF997985F"
        },
        "ledger_current_index": 4,
        "queue_data": {
            "auth_change_queued": true,
            "highest_sequence": 10,
            "lowest_sequence": 6,
            "max_spend_drops_total": "500",
            "transactions": [
                {
                    "auth_change": false,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 6
                },
                ... (trimmed for length) ...
                {
                    "LastLedgerSequence": 10,
                    "auth_change": true,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 10
                }
            ],
            "txn_count": 5
        },
        "status": "success",
        "validated": false
    }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with the result containing the requested account, its data, and a ledger to which it applies, as the following fields:

| `Field`                | Type    | Description                               |
|:-----------------------|:--------|:------------------------------------------|
| `account_data`         | Object  | The [AccountRoot ledger object](accountroot.html) with this account's information, as stored in the ledger. |
| `signer_lists`         | Array   | _(Omitted unless the request specified `signer_lists` and at least one SignerList is associated with the account.)_ Array of [SignerList ledger objects](signerlist.html) associated with this account for [Multi-Signing](multi-signing.html). Since an account can own at most one SignerList, this array must have exactly one member if it is present. [New in: rippled 0.31.0][] |
| `ledger_current_index` | Integer | _(Omitted if `ledger_index` is provided instead)_ The [ledger index][] of the current in-progress ledger, which was used when retrieving this information. |
| `ledger_index`         | Integer | _(Omitted if `ledger_current_index` is provided instead)_ The [ledger index][] of the ledger version used when retrieving this information. The information does not contain any changes from ledger versions newer than this one. |
| `queue_data`           | Object  | _(Omitted unless `queue` specified as `true` and querying the current open ledger.)_ Information about [queued transactions](transaction-cost.html#queued-transactions) sent by this account. This information describes the state of the local `rippled` server, which may be different from other servers in the [peer-to-peer XRP Ledger network](consensus-network.html). Some fields may be omitted because the values are calculated "lazily" by the queuing mechanism. |
| `validated`            | Boolean | True if this data is from a validated ledger version; if omitted or set to false, this data is not final. [New in: rippled 0.26.0][] |

The `queue_data` parameter, if present, contains the following fields:

| `Field`                 | Type    | Description                              |
|:------------------------|:--------|:-----------------------------------------|
| `txn_count`             | Integer | Number of queued transactions from this address. |
| `auth_change_queued`    | Boolean | (May be omitted) Whether a transaction in the queue changes this address's [ways of authorizing transactions](transaction-basics.html#authorizing-transactions). If `true`, this address can queue no further transactions until that transaction has been executed or dropped from the queue. |
| `lowest_sequence`       | Integer | (May be omitted) The lowest [Sequence Number][] among transactions queued by this address. |
| `highest_sequence`      | Integer | (May be omitted) The highest [Sequence Number][] among transactions queued by this address. |
| `max_spend_drops_total` | String  | (May be omitted) Integer amount of [drops of XRP][] that could be debited from this address if every transaction in the queue consumes the maximum amount of XRP possible. |
| `transactions`          | Array   | (May be omitted) Information about each queued transaction from this address. |

Each object in the `transactions` array, if present, may contain any or all of the following fields:

| `Field`           | Type    | Description                                    |
|:------------------|:--------|:-----------------------------------------------|
| `auth_change`     | Boolean | Whether this transaction changes this address's [ways of authorizing transactions](transaction-basics.html#authorizing-transactions). |
| `fee`             | String  | The [Transaction Cost](transaction-cost.html) of this transaction, in [drops of XRP][]. |
| `fee_level`       | String  | The transaction cost of this transaction, relative to the minimum cost for this type of transaction, in [fee levels][]. |
| `max_spend_drops` | String  | The maximum amount of [XRP, in drops][], this transaction could send or destroy. |
| `seq`             | Integer | The [Sequence Number][] of this transaction.   |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing. For example, the request specified `queue` as `true` but specified a `ledger_index` that is not the current open ledger.
* `actNotFound` - The address specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.

[fee levels]: transaction-cost.html#fee-levels
{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
