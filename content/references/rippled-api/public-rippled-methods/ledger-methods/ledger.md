# ledger
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerHandler.cpp "Source")

Retrieve information about the public ledger.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": 14,
    "command": "ledger",
    "ledger_index": "validated",
    "full": false,
    "accounts": false,
    "transactions": false,
    "expand": false,
    "owner_funds": false
}
```

*JSON-RPC*

```
{
    "method": "ledger",
    "params": [
        {
            "ledger_index": "validated",
            "accounts": false,
            "full": false,
            "transactions": false,
            "expand": false,
            "owner_funds": false
        }
    ]
}
```

*Commandline*

```
#Syntax: ledger ledger_index|ledger_hash [full|tx]
# "full" is equivalent to "full": true
# "tx" is equivalent to "transactions": true
rippled ledger current
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger)

The request can contain the following parameters:

| `Field`        | Type                       | Description                    |
|:---------------|:---------------------------|:-------------------------------|
| `ledger_hash`  | String                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]). |
| `ledger_index` | String or Unsigned Integer | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `full`         | Boolean                    | _(Optional)_ **Admin required** If `true`, return full information on the entire ledger. Ignored if you did not specify a ledger version. Defaults to `false`. (Equivalent to enabling `transactions`, `accounts`, and `expand`.) **Caution:** This is a very large amount of data -- on the order of several hundred megabytes! |
| `accounts`     | Boolean                    | _(Optional)_ **Admin required.** If `true`, return information on accounts in the ledger. Ignored if you did not specify a ledger version. Defaults to `false`. **Caution:** This returns a very large amount of data! |
| `transactions` | Boolean                    | _(Optional)_ If `true`, return information on transactions in the specified ledger version. Defaults to `false`. Ignored if you did not specify a ledger version. |
| `expand`       | Boolean                    | _(Optional)_ Provide full JSON-formatted information for transaction/account information instead of only hashes. Defaults to `false`. Ignored unless you request transactions, accounts, or both. |
| `owner_funds`  | Boolean                    | _(Optional)_ If `true`, include `owner_funds` field in the metadata of OfferCreate transactions in the response. Defaults to `false`. Ignored unless transactions are included and `expand` is true. |
| `binary`       | Boolean                    | _(Optional)_ If `true`, and `transactions` and `expand` are both also `true`, return transaction information in binary format (hexadecimal string) instead of JSON format. [New in: rippled 0.28.0][] |
| `queue`        | Boolean                    | _(Optional)_ If `true`, and the command is requesting the `current` ledger, includes an array of [queued transactions](transaction-cost.html#queued-transactions) in the results.

The `ledger` field is deprecated and may be removed without further notice.

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 4,
  "status": "success",
  "type": "response",
  "result": {
    "ledger": {
      "accepted": true,
      "account_hash": "FD2709F6C07284C3EE85EDE32AC452D9013A89D9B9E781D67D9784457E86A9BB",
      "close_flags": 0,
      "close_time": 508541181,
      "close_time_human": "2016-Feb-11 21:26:21",
      "close_time_resolution": 10,
      "closed": true,
      "hash": "F1433E9D15F33E746B8820DEEE4879F48181704364E459332561DF8E52E4EB7E",
      "ledger_hash": "F1433E9D15F33E746B8820DEEE4879F48181704364E459332561DF8E52E4EB7E",
      "ledger_index": "18851530",
      "parent_close_time": 508541180,
      "parent_hash": "8300B70AA5A865961DED7DAC5B88047028762D5946ECA887D09D32DE442E2305",
      "seqNum": "18851530",
      "totalCoins": "99998102799411646",
      "total_coins": "99998102799411646",
      "transaction_hash": "E0DB0471A1D198611E1C050ADA4AE74EEB38CEC26E0550663E0FCB1364212A3B"
    },
    "ledger_hash": "F1433E9D15F33E746B8820DEEE4879F48181704364E459332561DF8E52E4EB7E",
    "ledger_index": 18851530,
    "validated": true
  }
}
```

*JSON-RPC*

```
200 OK
{
    "result": {
        "ledger": {
            "accepted": true,
            "account_hash": "B089E7CD4F5167249951611AAEC863D4BF84FF098500E9CB50561F1A89EED825",
            "close_flags": 0,
            "close_time": 508541222,
            "close_time_human": "2016-Feb-11 21:27:02",
            "close_time_resolution": 10,
            "closed": true,
            "hash": "85E6D422F1A3AE0BEA315C4F09CD0B45022312A4BBF0D308246E901536B61157",
            "ledger_hash": "85E6D422F1A3AE0BEA315C4F09CD0B45022312A4BBF0D308246E901536B61157",
            "ledger_index": "18851543",
            "parent_close_time": 508541221,
            "parent_hash": "C382DB117F2D5AAECFBFB43EA509F8E56D6E1D1297CE00C0D02A3EE695ABB78F",
            "seqNum": "18851543",
            "totalCoins": "99998102795090646",
            "total_coins": "99998102795090646",
            "transaction_hash": "BEC71A3CAD11BFC4E4013CD109F220E0850E9A3808B15FAA6DAE4D898970EFAF"
        },
        "ledger_hash": "85E6D422F1A3AE0BEA315C4F09CD0B45022312A4BBF0D308246E901536B61157",
        "ledger_index": 18851543,
        "status": "success",
        "validated": true
    }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing information about the ledger, including the following fields:

| `Field`                        | Type    | Description                       |
|:-------------------------------|:--------|:----------------------------------|
| `ledger`                       | Object  | The complete header data of this ledger. |
| `ledger.account_hash`          | String  | Hash of all account state information in this ledger, as hex |
| `ledger.accountState`          | Array   | (Omitted unless requested) All the [account-state information](ledger-data-formats.html) in this ledger. |
| `ledger.close_flags`           | Integer | A bit-map of flags relating to the closing of this ledger. Currently, the ledger has only one flag defined for `close_flags`: **sLCF_NoConsensusTime** (value 1). If this flag is enabled, it means that validators were in conflict regarding the correct close time for the ledger, but build otherwise the same ledger, so they declared consensus while "agreeing to disagree" on the close time. In this case, the consensus ledger contains a `close_time` that is 1 second after that of the previous ledger. (In this case, there is no official close time, but the actual real-world close time is probably 3-6 seconds later than the specified `close_time`.) |
| `ledger.close_time`            | Integer | The time this ledger was closed, in [seconds since the Ripple Epoch][] |
| `ledger.close_time_human`      | String  | The time this ledger was closed, in human-readable format |
| `ledger.close_time_resolution` | Integer | Ledger close times are rounded to within this many seconds. |
| `ledger.closed`                | Boolean | Whether or not this ledger has been closed |
| `ledger.ledger_hash`           | String  | Unique identifying hash of the entire ledger. |
| `ledger.ledger_index`          | String  | The [Ledger Index][] of this ledger, as a quoted integer |
| `ledger.parent_close_time`     | Integer | The time at which the previous ledger was closed. |
| `ledger.parent_hash`           | String  | Unique identifying hash of the ledger that came immediately before this one. |
| `ledger.total_coins`           | String  | Total number of XRP drops in the network, as a quoted integer. (This decreases as transaction costs destroy XRP.) |
| `ledger.transaction_hash`      | String  | Hash of the transaction information included in this ledger, as hex |
| `ledger.transactions`          | Array   | (Omitted unless requested) Transactions applied in this ledger version. By default, members are the transactions' identifying [Hash][] strings. If the request specified `expand` as true, members are full representations of the transactions instead, in either JSON or binary depending on whether the request specified `binary` as true. |
| `ledger_hash`                  | String  | Unique identifying hash of the entire ledger. |
| `ledger_index`                 | Number  | The [Ledger Index][] of this ledger. |
| `queue_data`                   | Array   | (Omitted unless requested with the `queue` parameter) Array of objects describing queued transactions, in the same order as the queue. If the request specified `expand` as true, members contain full representations of the transactions, in either JSON or binary depending on whether the request specified `binary` as true. Requires the [FeeEscalation amendment][]. [New in: rippled 0.70.0][] |

The following fields are deprecated and may be removed without further notice: `accepted`, `hash` (use `ledger_hash` instead), `seqNum` (use `ledger_index` instead), `totalCoins` (use `total_coins` instead).

Each member of the `queue_data` array represents one transaction in the queue. Some fields of this object may be omitted because they have not yet been calculated. The fields of this object are as follows:

| Field               | Value            | Description                         |
|:--------------------|:-----------------|:------------------------------------|
| `account`           | String           | The [Address][] of the sender for this queued transaction. |
| `tx`                | String or Object | By default, this is a String containing the [identifying hash](basic-data-types.html#hashes) of the transaction. If transactions are expanded in binary format, this is an object whose only field is `tx_blob`, containing the binary form of the transaction as a decimal string. If transactions are expanded in JSON format, this is an object containing the [transaction object](transaction-formats.html) including the transaction's identifying hash in the `hash` field. |
| `retries_remaining` | Number           | How many times this transaction can be retried before being dropped. |
| `preflight_result`  | String           | The tentative result from preliminary transaction checking. This is always `tesSUCCESS`. |
| `last_result`       | String           | _(May be omitted)_ If this transaction was left in the queue after getting a [retriable (`ter`) result](ter-codes.html), this is the exact `ter` result code it got. |
| `auth_change`       | Boolean          | _(May be omitted)_ Whether this transaction changes this address's [ways of authorizing transactions](transaction-basics.html#authorizing-transactions). |
| `fee`               | String           | _(May be omitted)_ The [Transaction Cost](transaction-cost.html) of this transaction, in [drops of XRP][]. |
| `fee_level`         | String           | _(May be omitted)_ The transaction cost of this transaction, relative to the minimum cost for this type of transaction, in [fee levels][]. |
| `max_spend_drops`   | String           | _(May be omitted)_ The maximum amount of [XRP, in drops][], this transaction could potentially send or destroy. |

If the request specified `"owner_funds": true` and expanded transactions, the response has a field `owner_funds` in the `metaData` object of each [OfferCreate transaction][]. The purpose of this field is to make it easier to track the [funding status of offers](offers.html#lifecycle-of-an-offer) with each new validated ledger. This field is defined slightly differently than the version of this field in [Order Book subscription streams](subscribe.html#order-book-streams):

| `Field`       | Value  | Description                                         |
|:--------------|:-------|:----------------------------------------------------|
| `owner_funds` | String | Numeric amount of the `TakerGets` currency that the `Account` sending this OfferCreate transaction has after the execution of all transactions in this ledger. This does not check whether the currency amount is [frozen](freezes.html). |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `noPermission` - If you specified `full` or `accounts` as true, but are not connected to the server as an admin (usually, admin requires connecting on a local port).


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
