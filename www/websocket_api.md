# Web Sockets API #
The Web Sockets API and JSON-RPC APIs are two methods of communicating with a `rippled` server in the Ripple network. Both APIs use the same JSON data format, although not all features are available on both APIs. Unlike the [Ripple-REST API](https://dev.ripple.com/index.html), the Websocket and JSON-RPC APIs are more difficult to use, but also provide the full power of Ripple.

In general, we recommend using Web Sockets, for several reasons:

*  Web Sockets' push paradigm has less latency and less network overhead. JSON-RPC's polling paradigm includes opening and closing an HTTP connection for each individual message.
*  Web Sockets are more reliable; you have less to worry about missing messages and establishing multiple connections.
*  Some functionality is not available in JSON-RPC

There is also a third way of accessing the same methods, which is to use the `rippled` command line, but that is not recommended.

## Understanding Web Sockets ##

Web Sockets are a Javascript feature that allows modern web browsers to open a persistent, two-way connection with a server from within a webpage. If you are just looking to try out some methods on the Ripple network, you can skip writing your own web sockets code and go straight to using the API at the [Ripple WebSocket API Tool](https://ripple.com/tools/api/) first. Later on, when you want to connect to your own `rippled` server, you can find some [good tutorials on Web Sockets](http://www.html5rocks.com/en/tutorials/websockets/basics/) to read.

In the JSON-RPC model, each request is an HTTP POST request to the server that prompts a direct response. The details of the request are in the request body.

In the Web Sockets model, each request is a JSON-formatted message sent over the socket to the server. However, there is not a 1:1 correlation between requests and responses. Some requests prompt the server to send multiple messages back asynchronously; other times, responses may arrive in a different order than the requests that prompted them. 

However, the requests on both the Web Sockets API and the JSON-RPC API use the same [JSON](http://www.w3schools.com/json/) object format.

## Specifying a Ledger Instance ##

Many API methods require you to specify an instance of the ledger, with the data retrieved being considered accurate and up-to-date as of that particular version of the shared ledger. All such APIs work the same way. There are three ways you can specify which ledger you want to use:

1. Specify a ledger by its Sequence Number in the `ledger_index` parameter. Each closed ledger has an identifying sequence number that is 1 higher than the previously-validated ledger. (The Genesis Ledger has sequence number 0)
2. Specify a ledger by its hash value in the `ledger_hash` parameter. 
3. Specify a ledger by one of the following shortcuts, in the `ledger_index` parameter:
	* `validated` for the most recent ledger that has been validated by the whole network
	* `closed` for the most recent ledger that has been closed for modifications and proposed for validation by the node
	* `current` for the node's current working version of the ledger.
	
There is also a deprecated `ledger` parameter which accepts any of the above three formats. For the sake of clarity and correctness, we recommend *not using* it.

If you do not specify a ledger, the `current` (in-progress) ledger will be chosen by default. If you provide more than one field specifying ledgers, the `ledger` field will be used first if it exists, falling back to `ledger_hash`. The `ledger_index` field is ignored unless neither of the other two are present.

## Specifying Currency Amounts ##

Some API methods require you to specify an amount of currency. Depending on whether you are dealing in the network's native XRP currency or other currency units (also known as IOUs), the style for specifying it is very different.

If you are specifying an amount of XRP in JSON, you should provide it in string format. (JSON integers are limited to 32 bits, so integer overflows are possible.) XRP is formally specified in "drops", which are equivalent to 0.000001 (one 1-millionth) of an XRP each. Thus, to represent 1.0 XRP in a JSON document, you would write `"1000000"`.

If you are specifying non-XRP currency (including fiat dollars, precious metals, cryptocurrencies, or other custom currency) you must specify it with a currency specification object. This is a JSON object with three fields:

| Field | Type | Description |
|-------|------|-------------|
| currency | String | Three-letter [ISO 4217 Currency Code](http://www.xe.com/iso4217.php) or an unsigned 160-bit hex value. ("XRP" is invalid) |
| value | String | Quoted decimal representation of the amount of currency |
| issuer | String | Unique account address of the entity issuing the currency. In other words, the person or business where the currency can be redeemed. |

For example, to represent $153.75 US dollars issued by account `r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59`, you would specify:

```js
{
	"currency": "USD",
	"value": "153.75",
	"issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
}
```

## API Methods ##

API methods for the Websocket and JSON-RPC APIs are defined by command names, and are divided into Public Commands and Admin Commands. Public commands are not necessarily meant for the general public, but they are used by any client attached to the server. Public commands include the general operations for Ripple use, including checking the state of the ledger, finding a path to connecting users, and submitting a transaction, among others. Admin commands, on the other hand, are meant only for the operators of the server, and include commands for managing the state of the server, logging, and creating new accounts.

### List of Public Commands ###
* [`account_info`](#account-info)
* [`account_lines`](#account-lines)
* [`account_offers`](#account-offers)
* [`account_tx`](#account-tx)
* [`book_offers`](#book-offers)
* [`data_sign`](#data-sign)
* [`data_verify`](#data-verify)
* [`json`](#json)
* [`ledger`](#ledger)
* [`ledger_closed`](#ledger-closed)
* [`ledger_current`](#ledger-current)
* [`ledger_data`](#ledger-data)
* [`ledger_entry`](#ledger-entry)
* [`path_find`](#path-find)
* [`ping`](#ping)
* [`random`](#random)
* [`ripple_path_find`](#ripple-path-find)
* [`sign`](#sign)
* [`submit`](#submit)
* [`subscribe`](#subscribe)
* [`server`](#server)
* [`ledger`](#ledger)
* [`transactions`](#transactions)
* [`transaction_entry`](#transaction-entry)
* [`tx`](#tx)
* [`tx_history`](#tx-history)
* [`unsubscribe`](#unsubscribe)
* [`wallet_accounts`](#wallet-accounts)
### List of Admin Commands ###
* [`connect`](#connect)
* [`data_delete`](#data-delete)
* [`data_fetch`](#data-fetch)
* [`data_store`](#data-store)
* [`ledger_accept`](#ledger-accept)
* [`log_level`](#log-level)
* [`logrotate`](#logrotate)
* [`peers`](#peers)
* [`proof_create`](#proof-create)
* [`proof_solve`](#proof-solve)
* [`proof_verify`](#proof-verify)
* [`server_info`](#server-info)
* [`server_state`](#server-state)
* [`sms`](#sms)
* [`stop`](#stop)
* [`unl_add`](#unl-add)
* [`unl_delete`](#unl-delete)
* [`unl_list`](#unl-list)
* [`unl_load`](#unl-load)
* [`unl_network`](#unl-network)
* [`unl_reset`](#unl-reset)
* [`validation_create`](#validation-create)
* [`validation_seed`](#validation-seed)
* [`wallet_propose`](#wallet-propose)
* [`wallet_seed`](#wallet-seed)

# Managing Accounts #
Accounts are the core identity in the Ripple Network. Each account can hold balances in multiple currencies. In order to be a valid account, however, there is a minimum reserve in XRP. (This value fluctuates with the load on the network; spamming new account creations increases the necessary reserve. <span class='draft-comment'>Does it really fluctuate dynamically?</span>) It is expected that accounts will correspond loosely to individual users. An account is similar to a Bitcoin wallet, except that it is not limited strictly to holding digital crypto-currency.

## account_info ##

The `account_info` command retrieves information about an account, its activity, and its balances. All information retrieved is relative to a particular version of the ledger. 

#### Request Format ####

An example of an account_info request:
```js-websocket
{
  "id": 2,
  "command": "account_info",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "strict": True,
  "ledger_index": "validated"
}
```
```js-jsonrpc
{
    "command": "account_info",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "strict": True,
            "ledger_index": "validated"
        }
    ]
}
```
```cli
account_info account [ledger_index] [strict]
```

| Field | Type | Description |
|-------|------|-------------|
| id | (Arbitrary) | (Web Sockets only) Any identifier to separate this request from others in case the responses are delayed or out of order. |
| account | String | A unique identifier for the account, most commonly the account's address. |
| ident | String | (Optional, Deprecated) Alias for `account`. Will only be used if `account` is omitted. |
| strict | Boolean | (Optional, defaults to False) If set to True, then the `account` field will only accept a public key or account address. |
| account_index | Unsigned Integer | (Optional) Return data on another deterministic wallet that can be derived from the account's secret. (Not widely supported; this feature may be dropped in the future.) |
| ledger | String or Unsigned Integer | (Optional, Deprecated) Hash, index, or shortcut value for the ledger to use. (See [Specifying a Ledger](#specifying-a-ledger))
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger))|

#### Response Format ####

An example of a successful response:
```js-websocket
{
  "id": 5,
  "status": "success",
  "type": "response",
  "result": {
    "account_data": {
      "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "Balance": "27389517749",
      "Flags": 0,
      "LedgerEntryType": "AccountRoot",
      "OwnerCount": 18,
      "PreviousTxnID": "2F804E1A00DBCBDAFBDB7D001409F79FE196785EB68FBA463E5924002BE4DEE9",
      "PreviousTxnLgrSeq": 6405716,
      "Sequence": 1400,
      "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
    },
    "ledger_current_index": 6507948
  }
}
```

The response contains the requested account, its data, and a ledger to which it applies, including the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | (Varies) | Unique ID of the Web Socket request that prompted this response |
| status | String | "success" if the request successfully completed |
| type | String | The type of response this is, usually either "response" or "error". |
| result | Object | The result of the query |
| result.account_data | Object | Information about the requested account |
| result.account_data.Account | String | Address of the requested account |
| result.account_data.Balance | String | <span class='draft-comment'>XRP balance in "drops" represented as a string?</span> |
| result.account_data.Flags | 32-bit unsigned integer | <span class='draft-comment'>?</span> |
| result.account_data.LedgerEntryType | String | <span class='draft-comment'>?</span> |
| result.account_data.OwnerCount | Integer | <span class='draft-comment'>?</span> |
| result.account_data.PreviousTxnID | String | Hash value representing the most recent transaction involving<span class='draft-comment'>(initiated by?)</span> this account |
| result.account_data.Sequence | Integer | <span class='draft-comment'>?</span> |
| result.account_data.index | String | <span class='draft-comment'>?</span> |
| result.ledger_current_index | Integer | The sequence number of the ledger used when retrieving this information. The information does not contain any changes from ledgers newer than this one.<span class='draft-comment'>Right?</span> |

## account_lines ##

The `account_lines` method returns information about the account's lines of trust (also known as credit lines). All information retrieved is relative to a particular version of the ledger.

#### Request Format ####

An example of the request format:

```js-websocket 
{
  "id": 1,
  "command": "account_lines",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "ledger": "current"
}
```

The request can include any of the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | (Arbitrary) | (Optional, Web Sockets only) Any identifier to separate this request from others in case the responses are delayed or out of order. |
| account | String | A unique identifier for the account, most commonly the account's address. |
| ledger | String or Unsigned Integer | (Optional, Deprecated) Hash, index, or shortcut value for the ledger to use. (See [Specifying a Ledger](#specifying-a-ledger))
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger))|
| peer | String | (Optional) A unique ID for a second account. If provided, show only lines of trust connecting the two accounts. |
| peer_index | Number | (Optional) Return data on another deterministic wallet derived from the specified peer. This feature is not widely supported and may be dropped in the future. |


#### Response Format ####

An example of a successful response:

```js-websocket
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

A successful response includes the address of the account and an array of trust-line objects. Specifically, the top-level response contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | (Varies) | Unique ID of the Web Socket request that prompted this response |
| status | String | "success" if the request successfully completed |
| type | String | Generally "response or "error"
| result | Object | Object containing with the main contents of the response |
| result.account | String | Unique address of the account this request corresponds to |
| result.lines | Array | Array of trust-line objects, as described below. |

Each trust-line object has some combination of the following fields, although not necessarily all of them:


| Field | Type | Description |
|-------|------|-------------|
| account | String | The unique address of the account this line applies to. |
| balance | String | Representation of the numeric balance currently held against this line |
| currency | String | The currency this line applies to |
| limit | String | The maximum amount of currency that the account for this line <span class='draft-comment'>can spend? borrow?</span> |
| limit_peer | String | <span class='draft-comment'>?</span> |
| no_ripple | Boolean | <span class='draft-comment'>Don't use as an intermediary for transactions?</span> |
| no_ripple_peer | String | <span class='draft-comment'>?</span> |
| quality_in | String | <span class='draft-comment'>Fee to charge?</span> |
| quality_out | String | <span class='draft-comment'>Fee to charge?</span> |

## account_offers ##

The `account_offers` method retrieves a list of offers made by a given account that are outstanding as of a particular ledger version.

#### Request Format ####

An example of the request format:

```js-websocket
{
  "id": 2,
  "command": "account_offers",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "ledger_index": "current"
}
```
```cli
account_offers account|nickname|seed|pass_phrase|key [ledger_index]
```

A request can include the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | (Arbitrary) | Any identifier to separate this request from others in case the responses are delayed or out of order. |
| account | String | A unique identifier for the account, most commonly the account's address. |
| ledger | Unsigned integer, or String | A unique identifier for the ledger version to use, such as a ledger sequence number, a hash, or a shortcut such as "validated". |
| ledger_hash | String | (Optional) A 20-byte hex string identifying the ledger version to use. |
| ledger_index | Unsigned integer, or String constant | (Optional, defaults to `current`) The sequence number of the ledger to use, or "current", "closed", or "validated" to select a ledger dynamically. (See Ledger Indexes.) |


#### Response Format ####

An example of a successful response:

```
{
  "id": 1,
  "status": "success",
  "type": "response",
  "result": {
    "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "offers": [
      {
        "flags": 0,
        "seq": 1399,
        "taker_gets": "16666666",
        "taker_pays": {
          "currency": "XAU",
          "issuer": "rs9M85karFkCRjvc6KMWn8Coigm9cbcgcx",
          "value": "0.0001"
        }
      }
    ]
  }
}
```

A successful response includes the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | (Varies) | Unique ID of the Web Socket request that prompted this response |
| status | String | "success" if the request successfully completed |
| type | String | Generally "response or "error"
| result | Object | Object containing with the main contents of the response |
| result.account | String | Unique address identifying the account that made the offers |
| result.offers | Array | Array of objects, where each object represents an offer made by this account that is outstanding as of the requested ledger version. |

Each offer object contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| flags | Unsigned integer | <span class='draft-comment'>?</span> |
| seq | Unsigned integer | <span class='draft-comment'>Sequence number of the ledger that this offer was first included in?</span> |
| taker_gets | String or Object | The amount the account accepting the offer receives, as a String representing an amount in XRP, or a currency specification object. (See [Specifying Currency Amounts](#specifying-currency-amounts)) |
| taker_pays | String or Object | The amount the account accepting the offer provides, as a String representing an amount in XRP, or a currency specification object. (See [Specifying Currency Amounts](#specifying-currency-amounts)) |

## account_tx ##

The `account_tx` method retrieves a list of transactions that involved the specified account.

#### Request Format ####

An example of the request format:

```js-websocket
{
  "id": 2,
  "command": "account_tx",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "ledger_index_min": -1,
  "ledger_index_max": -1,
  "binary": false,
  "count": false,
  "descending": false,
  "offset": 1,
  "limit": 2,
  "forward": false
}
```
```cli
account_tx accountID [ledger_min [ledger_max [limit]]] [binary] [count] [descending]
```

A request can include the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | (Arbitrary) | Any identifier to separate this request from others in case the responses are delayed or out of order. |
| account | String | A unique identifier for the account, most commonly the account's address. | 
| ledger_index_min | Integer | Use to specify the earliest ledger to include transactions from. A value of `-1` instructs the server to use the earliest ledger available. |
| ledger_index_max | Integer | Use to specify the most recent ledger to include transactions from. A value of `-1` instructs the server to use the most recent one available. |
| ledger_hash | String | (Optional) Use instead of ledger_index_min and ledger_index_max to look for transactions from a single ledger only. (See [Specifying a Ledger](#specifying-a-ledger)) |
| ledger_index | String or Unsigned Integer | (Optional) Use instead of ledger_index_min and ledger_index_max to look for transactions from a single ledger only. (See [Specifying a Ledger](#specifying-a-ledger)) |
| binary | Boolean | (Optional, defaults to False) If set to True, return transactions as hashed hex strings instead of JSON. |
| forward | boolean | (Optional, defaults to False) If set to True, return values sorted with the oldest ledger first. Otherwise, the results are sorted with the newest ledger first. |
| limit | Integer | (Optional, default varies) Limit the number of transactions to retrieve. The server is not required to honor this value. |

There is a legacy variation of the `account_tx` method that is used instead whenever any of the following fields are found. This mode is deprecated, and we recommend *not using any of the following fields*:

| Field | Type | Description |
|-------|------|-------------|
| offset | Integer | (Optional, defaults to 0) The number of values to skip over without returning. Use to iterate over data sets larger than the `limit` value. |
| count | Integer | (Optional) Number of transactions to skip over before retrieving. To iterate over the entire set, send multiple requests with this parameter set to the number of transactions you've already seen. |
| descending | Boolean | (Optional, defaults to False) If true, results are sorted in descending order.
| ledger_max | Integer or String | The newest ledger version to search for transactions, or `-1` to use the newest available. (See [Specifying a ledger](#specifying-a-ledger) |
| ledger_min | Integer or String | Theh oldest ledger version to search for transactions, or `-1` to use the oldest available. (See [Specifying a ledger](#specifying-a-ledger) | 

##### Iterating over queried data ######

If you want to retrieve an amount of data that is higher than the server's maximum `limit` value, or you want to break up your request into multiple smaller requests, you can use the `marker` field to pick up in the same place you left off. For each subsequent request, pass the `marker` value from the previous request to instruct rippled to resume from the point where you left off.

However, in the time between requests, things may change so that `"ledger_index_min": -1` and `"ledger_index_max": -1` may refer to different ledger versions than they did before. To make sure you iterate over the same exact data set, take the `ledger_index_min` and `ledger_index_max` values provided in the first response, and use those values for all subsequent requests.

#### Response Format ####

An example of a successful response:

```js
{
    "id": 2,
    "status": "success",
    "type": "response",
    "result": {
        "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "ledger_index_max": 6542489,
        "ledger_index_min": 32570,
        "limit": 2,
        "offset": 1,
        "transactions": [
            {
                "meta": {
                    "AffectedNodes": [
                        {
                            "ModifiedNode": {
                                "FinalFields": {
                                    "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                                    "Balance": "9999999980",
                                    "Flags": 0,
                                    "OwnerCount": 2,
                                    "Sequence": 3
                                },
                                "LedgerEntryType": "AccountRoot",
                                "LedgerIndex": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05",
                                "PreviousFields": {
                                    "Balance": "9999999990",
                                    "OwnerCount": 1,
                                    "Sequence": 2
                                },
                                "PreviousTxnID": "389720F6FD8A144F171708F9ECB334D704CBCFEFBCDA152D931AC34FB5F9E32B",
                                "PreviousTxnLgrSeq": 95405
                            }
                        },
                        {
                            "CreatedNode": {
                                "LedgerEntryType": "RippleState",
                                "LedgerIndex": "718C6D58DD3BBAAAEBFE48B8FBE3C32C9F6F2EBC395233BA95D0057078EE07DB",
                                "NewFields": {
                                    "Balance": {
                                        "currency": "USD",
                                        "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                                        "value": "0"
                                    },
                                    "Flags": 131072,
                                    "HighLimit": {
                                        "currency": "USD",
                                        "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                                        "value": "100"
                                    },
                                    "LowLimit": {
                                        "currency": "USD",
                                        "issuer": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                                        "value": "0"
                                    }
                                }
                            }
                        },
                        {
                            "ModifiedNode": {
                                "FinalFields": {
                                    "Flags": 0,
                                    "Owner": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                                    "RootIndex": "77F65EFF930ED7E93C6CC839C421E394D6B1B6A47CEA8A140D63EC9C712F46F5"
                                },
                                "LedgerEntryType": "DirectoryNode",
                                "LedgerIndex": "77F65EFF930ED7E93C6CC839C421E394D6B1B6A47CEA8A140D63EC9C712F46F5"
                            }
                        },
                        {
                            "ModifiedNode": {
                                "FinalFields": {
                                    "Account": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                                    "Balance": "78991384535796",
                                    "Flags": 0,
                                    "OwnerCount": 3,
                                    "Sequence": 188
                                },
                                "LedgerEntryType": "AccountRoot",
                                "LedgerIndex": "B33FDD5CF3445E1A7F2BE9B06336BEBD73A5E3EE885D3EF93F7E3E2992E46F1A",
                                "PreviousTxnID": "E9E1988A0F061679E5D14DE77DB0163CE0BBDC00F29E396FFD1DA0366E7D8904",
                                "PreviousTxnLgrSeq": 195455
                            }
                        },
                        {
                            "ModifiedNode": {
                                "FinalFields": {
                                    "ExchangeRate": "4E11C37937E08000",
                                    "Flags": 0,
                                    "RootIndex": "F60ADF645E78B69857D2E4AEC8B7742FEABC8431BD8611D099B428C3E816DF93",
                                    "TakerGetsCurrency": "0000000000000000000000000000000000000000",
                                    "TakerGetsIssuer": "0000000000000000000000000000000000000000",
                                    "TakerPaysCurrency": "0000000000000000000000004254430000000000",
                                    "TakerPaysIssuer": "5E7B112523F68D2F5E879DB4EAC51C6698A69304"
                                },
                                "LedgerEntryType": "DirectoryNode",
                                "LedgerIndex": "F60ADF645E78B69857D2E4AEC8B7742FEABC8431BD8611D099B428C3E816DF93"
                            }
                        }
                    ],
                    "TransactionIndex": 0,
                    "TransactionResult": "tesSUCCESS"
                },
                "tx": {
                    "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "Fee": "10",
                    "Flags": 0,
                    "LimitAmount": {
                        "currency": "USD",
                        "issuer": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                        "value": "100"
                    },
                    "Sequence": 2,
                    "SigningPubKey": "02BC8C02199949B15C005B997E7C8594574E9B02BA2D0628902E0532989976CF9D",
                    "TransactionType": "TrustSet",
                    "TxnSignature": "304402200EF81EC32E0DFA9BE376B20AFCA11765ED9FEA04CA8B77C7178DAA699F7F5AFF02202DA484DBD66521AC317D84F7717EC4614E2F5DB743E313E8B48440499CC0DBA4",
                    "date": 413620090,
                    "hash": "002AA492496A1543DBD3680BF8CF21B6D6A078CE4A01D2C1A4B63778033792CE",
                    "inLedger": 195480,
                    "ledger_index": 195480
                },
                "validated": true
            },
            {
                "meta": {
                    "AffectedNodes": [
                        {
                            "ModifiedNode": {
                                "FinalFields": {
                                    "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                                    "Balance": "9999999970",
                                    "Flags": 0,
                                    "OwnerCount": 3,
                                    "Sequence": 4
                                },
                                "LedgerEntryType": "AccountRoot",
                                "LedgerIndex": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05",
                                "PreviousFields": {
                                    "Balance": "9999999980",
                                    "OwnerCount": 2,
                                    "Sequence": 3
                                },
                                "PreviousTxnID": "002AA492496A1543DBD3680BF8CF21B6D6A078CE4A01D2C1A4B63778033792CE",
                                "PreviousTxnLgrSeq": 195480
                            }
                        },
                        {
                            "ModifiedNode": {
                                "FinalFields": {
                                    "Flags": 0,
                                    "Owner": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
                                    "RootIndex": "A39F044D860C5B5846AA7E0FAAD44DC8897F0A62B2F628AA073B21B3EC146010"
                                },
                                "LedgerEntryType": "DirectoryNode",
                                "LedgerIndex": "A39F044D860C5B5846AA7E0FAAD44DC8897F0A62B2F628AA073B21B3EC146010"
                            }
                        },
                        {
                            "ModifiedNode": {
                                "LedgerEntryType": "AccountRoot",
                                "LedgerIndex": "E0D7BDE68B468FF0B8D948FD865576517DA987569833A05374ADB9A72E870A06",
                                "PreviousTxnID": "0222B59280D165D40C464EA75AAD08A4D152C46A38C0625DEECF6EE87FC5B9E1",
                                "PreviousTxnLgrSeq": 343555
                            }
                        },
                        {
                            "CreatedNode": {
                                "LedgerEntryType": "RippleState",
                                "LedgerIndex": "EA4BF03B4700123CDFFB6EB09DC1D6E28D5CEB7F680FB00FC24BC1C3BB2DB959",
                                "NewFields": {
                                    "Balance": {
                                        "currency": "USD",
                                        "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                                        "value": "0"
                                    },
                                    "Flags": 131072,
                                    "HighLimit": {
                                        "currency": "USD",
                                        "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                                        "value": "100"
                                    },
                                    "LowLimit": {
                                        "currency": "USD",
                                        "issuer": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
                                        "value": "0"
                                    }
                                }
                            }
                        },
                        {
                            "ModifiedNode": {
                                "FinalFields": {
                                    "ExchangeRate": "4E11C37937E08000",
                                    "Flags": 0,
                                    "RootIndex": "F60ADF645E78B69857D2E4AEC8B7742FEABC8431BD8611D099B428C3E816DF93",
                                    "TakerGetsCurrency": "0000000000000000000000000000000000000000",
                                    "TakerGetsIssuer": "0000000000000000000000000000000000000000",
                                    "TakerPaysCurrency": "0000000000000000000000004254430000000000",
                                    "TakerPaysIssuer": "5E7B112523F68D2F5E879DB4EAC51C6698A69304"
                                },
                                "LedgerEntryType": "DirectoryNode",
                                "LedgerIndex": "F60ADF645E78B69857D2E4AEC8B7742FEABC8431BD8611D099B428C3E816DF93"
                            }
                        }
                    ],
                    "TransactionIndex": 0,
                    "TransactionResult": "tesSUCCESS"
                },
                "tx": {
                    "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "Fee": "10",
                    "Flags": 0,
                    "LimitAmount": {
                        "currency": "USD",
                        "issuer": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
                        "value": "100"
                    },
                    "Sequence": 3,
                    "SigningPubKey": "02BC8C02199949B15C005B997E7C8594574E9B02BA2D0628902E0532989976CF9D",
                    "TransactionType": "TrustSet",
                    "TxnSignature": "3044022058A89552068D1A274EE72BA71363E33E54E6608BC28A84DEC6EE530FC2B5C979022029F4D1EA1237A1F717C5F5EC526E6CFB6DF54C30BADD25EDDE7D2FDBC8F17E34",
                    "date": 416347560,
                    "hash": "53354D84BAE8FDFC3F4DA879D984D24B929E7FEB9100D2AD9EFCD2E126BCCDC8",
                    "inLedger": 343570,
                    "ledger_index": 343570
                },
                "validated": true
            }
        ],
        "validated": true
    }
}
```

A successful response includes the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | (Varies) | Unique ID of the Web Socket request that prompted this response |
| status | String | "success" if the request successfully completed |
| type | String | Generally "response or "error"
| result | Object | Object containing with the main contents of the response |
| result.account | String | Unique address identifying the related account |
| ledger_index_min | Integer | The sequence number of the earliest ledger with transactions <span class='draft-comment'>(actually or potentially?)</span> included in the response. |
| ledger_index_max | Integer | The sequence number of the most recent ledger with transactions <span class='draft-comment'>(actually or potentially?)</span> included in the response. |
| limit | Integer | The `limit` value used in the request. (This may differ from the actual limit value enforced by the server.) |
| offset | Integer | The `offset` value used in the request. |
| transactions | Array | Array of transactions matching the request's criteria, as explained below. |
| validated | Boolean | Whether or not <span class='draft-comment'>something? (the ledger?)</span> was validated. |

Each transaction object includes the following fields, depending on whether it was requested in JSON or hash string (`"binary":true`) format.

| Field | Type | Description |
| ledger_index | Integer | The sequence number of the ledger version that included this transaction. |
| meta | Object (JSON) or String (Binary) | If `binary` is True, then this is a hash string of the transaction metadata. Otherwise, the transaction metadata is included in JSON format. |
| tx | Object | (JSON mode only) JSON object defining the transaction |
| tx_blob | String | (Binary mode only) Unique hashed String representing the transaction. |
| validated | Boolean | Whether or not the transaction was validated <span class='draft-comment'>by/for what? (Included in a validated ledger?)</span> |

## wallet_propose ##

<span class='draft-comment'>(My speculation/impression of this method:</span> Use the `wallet_propose` method to provisionally create a new account. The account created this way will become officially included in the Ripple network when it receives a transaction that provides enough XRP to meet the account reserve. 

*The `wallet_propose` request is an admin command that cannot be run by unpriviledged users!*

#### Request Format ####

An example of the request format:

```cli
wallet_propose [passphrase]
```

```js-websocket
{
    "passphrase": "test"
}
```

The request contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | (Arbitrary) | (Web Sockets only) Any identifier to separate this request from others in case the responses are delayed or out of order. |
| passphrase | String | (Optional) Specify a passphrase, for testing purposes. If omitted, the server will generate a random passphrase. Outside of testing purposes, passphrases should always be randomly generated. |
f"re
#### Response Format ####

A successful response includes various important information about the new account. An example of a successful response:

```js
{
    "id": 2,
    "status": "success",
    "type": "response",
    "results": {
        "master_seed":
        "master_seed_hex":
        "master_key":
        "account_id":
        "public_key":
        "public_key_hex": 
    }
}
```

A succcessful response contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | (Varies) | Unique ID of the Web Socket request that prompted this response |
| status | String | "success" if the request successfully completed |
| type | String | Generally "response or "error"
| result | Object | Object containing with the main contents of the response |
| result.master_seed | <span class='draft-comment'>?</span> | <span class='draft-comment'>Master seed? Is that like a private key?</span> |
| result.master_seed_hex | String | <span class='draft-comment'>Master seed represented as a hex string?</span> |
| result.master_key | <span class='draft-comment'>?</span> | <span class='draft-comment'>?</span> |
| result.account_id | <span class='draft-comment'>?</span> | <span class='draft-comment'>?</span> |
| result.public_key | <span class='draft-comment'>?</span> | <span class='draft-comment'>?</span> |
| result.public_key_hex | String | <span class='draft-comment'>Public key represented as a hex string?</span> |

# Managing Ledgers #

## ledger ##
<span class='draft-comment'>stub</span>

## ledger_closed ##
<span class='draft-comment'>stub</span>

## ledger_current ##
<span class='draft-comment'>stub</span>

## ledger_data ##
<span class='draft-comment'>stub</span>

## ledger_entry ##
<span class='draft-comment'>stub</span>

## ledger_accept ##
<span class='draft-comment'>stub</span>
