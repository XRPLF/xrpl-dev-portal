---
html: ledger.html # Watch carefully for clashes w/ this filename
parent: ledger-methods.html
blurb: Get info about a ledger version.
labels:
  - Blockchain
---
# ledger
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerHandler.cpp "Source")

Retrieve information about the public [ledger](ledgers.html).

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
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

```json
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
rippled ledger validated
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger)

The request can contain the following parameters:

| `Field`        | Type             | Required? | Description |
|:---------------|:-----------------|:----------|-------------|
| `ledger_hash`  | [Hash][]         | No        | A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]). |
| `ledger_index` | [Ledger Index][] | No        | The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `full`         | Boolean          | No        | **Admin only** If `true`, return full information on the entire ledger. Ignored if you did not specify a ledger version. The default is `false`. (Equivalent to enabling `transactions`, `accounts`, and `expand`.) The [Clio server](the-clio-server.html) does not support this field. **Caution:** On Mainnet, this can be gigabytes worth of data, so the request is likely to time out. |
| `accounts`     | Boolean          | No        | **Admin only.** If `true`, return the ledger's entire state data. Ignored if you did not specify a ledger version. The default is `false`. **Caution:** On Mainnet, this can be gigabytes worth of data, so the request is likely to time out. Use [ledger_data][ledger_data method] instead to fetch state data across multiple paginated requests. |
| `transactions` | Boolean          | No        | If `true`, return information on transactions in the specified ledger version. The default is `false`. Ignored if you did not specify a ledger version. |
| `expand`       | Boolean          | No        | Provide full JSON-formatted information for transaction/account information instead of only hashes. The default is `false`. Ignored unless you request transactions, accounts, or both. |
| `owner_funds`  | Boolean          | No        | If `true`, include `owner_funds` field in the metadata of OfferCreate transactions in the response. The default is `false`. Ignored unless transactions are included and `expand` is true. |
| `binary`       | Boolean          | No        | If `true`, and `transactions` and `expand` are both also `true`, return transaction information in binary format (hexadecimal string) instead of JSON format. [New in: rippled 0.28.0][] |
| `queue`        | Boolean          | No        | If `true`, and the command is requesting the `current` ledger, includes an array of [queued transactions](transaction-cost.html#queued-transactions) in the results. |
| `type`         | String           | No        | Filter by a ledger entry type. {% include '_snippets/lowercase-types.md' %} Ignored unless you request `accounts` (state data). |


The `ledger` field is deprecated and may be removed without further notice.

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 14,
  "result": {
    "ledger": {
      "accepted": true,
      "account_hash": "53BD4650A024E27DEB52DBB6A52EDB26528B987EC61C895C48D1EB44CEDD9AD3",
      "close_flags": 0,
      "close_time": 638329241,
      "close_time_human": "2020-Mar-24 01:40:41.000000000 UTC",
      "close_time_resolution": 10,
      "closed": true,
      "hash": "1723099E269C77C4BDE86C83FA6415D71CF20AA5CB4A94E5C388ED97123FB55B",
      "ledger_hash": "1723099E269C77C4BDE86C83FA6415D71CF20AA5CB4A94E5C388ED97123FB55B",
      "ledger_index": "54300932",
      "parent_close_time": 638329240,
      "parent_hash": "DF68B3BCABD31097634BABF0BDC87932D43D26E458BFEEFD36ADF2B3D94998C0",
      "seqNum": "54300932",
      "totalCoins": "99991024049648900",
      "total_coins": "99991024049648900",
      "transaction_hash": "50B3A8FE2C5620E43AA57564209AEDFEA3E868CFA2F6E4AB4B9E55A7A62AAF7B"
    },
    "ledger_hash": "1723099E269C77C4BDE86C83FA6415D71CF20AA5CB4A94E5C388ED97123FB55B",
    "ledger_index": 54300932,
    "validated": true
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```json
200 OK

{
  "result": {
    "ledger": {
      "accepted": true,
      "account_hash": "B258A8BB4743FB74CBBD6E9F67E4A56C4432EA09E5805E4CC2DA26F2DBE8F3D1",
      "close_flags": 0,
      "close_time": 638329271,
      "close_time_human": "2020-Mar-24 01:41:11.000000000 UTC",
      "close_time_resolution": 10,
      "closed": true,
      "hash": "3652D7FD0576BC452C0D2E9B747BDD733075971D1A9A1D98125055DEF428721A",
      "ledger_hash": "3652D7FD0576BC452C0D2E9B747BDD733075971D1A9A1D98125055DEF428721A",
      "ledger_index": "54300940",
      "parent_close_time": 638329270,
      "parent_hash": "AE996778246BC81F85D5AF051241DAA577C23BCA04C034A7074F93700194520D",
      "seqNum": "54300940",
      "totalCoins": "99991024049618156",
      "total_coins": "99991024049618156",
      "transaction_hash": "FC6FFCB71B2527DDD630EE5409D38913B4D4C026AA6C3B14A3E9D4ED45CFE30D"
    },
    "ledger_hash": "3652D7FD0576BC452C0D2E9B747BDD733075971D1A9A1D98125055DEF428721A",
    "ledger_index": 54300940,
    "status": "success",
    "validated": true
  }
}
```

*Commandline*

```json
Loading: "/etc/opt/ripple/rippled.cfg"
2020-Mar-24 01:42:42.622264591 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "ledger" : {
         "accepted" : true,
         "account_hash" : "6B3101BE8F1431C5AC5B43D9731F1F3A747D24B3BEF89B687F0F3039E10EB65A",
         "close_flags" : 0,
         "close_time" : 638329360,
         "close_time_human" : "2020-Mar-24 01:42:40.000000000 UTC",
         "close_time_resolution" : 10,
         "closed" : true,
         "hash" : "C88A0EEC0E785A4C3E99F2A8B8EE0D7BDF3DE6C786C39B1B01547F6DAE5A4B7F",
         "ledger_hash" : "C88A0EEC0E785A4C3E99F2A8B8EE0D7BDF3DE6C786C39B1B01547F6DAE5A4B7F",
         "ledger_index" : "54300962",
         "parent_close_time" : 638329352,
         "parent_hash" : "96D2D70DC540BA4614A00C77FCFDED20E7D58AF3238E36655C38C407A56982A3",
         "seqNum" : "54300962",
         "totalCoins" : "99991024049218063",
         "total_coins" : "99991024049218063",
         "transaction_hash" : "47AC79011652D2A56AE04D3DD618C60A6669E3F94308C803554E890D2BD94481"
      },
      "ledger_hash" : "C88A0EEC0E785A4C3E99F2A8B8EE0D7BDF3DE6C786C39B1B01547F6DAE5A4B7F",
      "ledger_index" : 54300962,
      "status" : "success",
      "validated" : true
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
| `ledger.close_flags`           | Integer | A bit-map of [flags relating to the closing of this ledger](ledger-header.html#close-flags). |
| `ledger.close_time`            | Integer | The time this ledger was closed, in [seconds since the Ripple Epoch][] |
| `ledger.close_time_human`      | String  | The time this ledger was closed, in human-readable format. Always uses the UTC time zone. [Updated in: rippled 1.5.0][] |
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
| `validated`                    | Boolean | _(May be omitted)_ If `true`, this is a validated ledger version. If omitted or set to `false`, this ledger's data is not final. |
| `queue_data`                   | Array   | _(Omitted unless requested with the `queue` parameter)_ Array of objects describing queued transactions, in the same order as the queue. If the request specified `expand` as true, members contain full representations of the transactions, in either JSON or binary depending on whether the request specified `binary` as true. Added by the [FeeEscalation amendment][]. [New in: rippled 0.70.0][] |

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
