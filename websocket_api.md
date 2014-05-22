# WebSocket and JSON-RPC APIs #
If you want to communicate directly with the `rippled` server, you have three fairly similar options for how to do that. All of these APIs use the same list of commands, with almost entirely the same parameters in each command. Whereas the [Ripple-REST API](?p=ripple-rest-api) provides a simplified interface on top of the WebSocket API for easier integration, these APIs provide the full power of Ripple but require slightly more complexity:

* The WebSocket API uses the [WebSocket protocol](http://www.html5rocks.com/en/tutorials/websockets/basics/), available in most browsers and Javascript implementations, to achieve persistent two-way communication. There is not a 1:1 correlation between requests and responses. Some requests prompt the server to send multiple messages back asynchronously; other times, responses may arrive in a different order than the requests that prompted them. 
* The JSON-RPC API relies on simple request-response communication via HTTP. For commands that prompt multiple responses, you can provide a callback URL.
* The `rippled` program can also be used as a quick commandline client to make JSON-RPC requests to a running `rippled` server.

In general, we recommend using WebSocket, because WebSocket's push paradigm has less latency and less network overhead. JSON-RPC must open and close an HTTP connection for each individual message. WebSocket is also more reliable; you can worry less about missing messages and establishing multiple connections. However, all three have valid use cases and will continue to be supported for the foreseeable future.

## Connecting to rippled ##

Before you can run any commands against a `rippled` server, you must know which server you are connecting to. Most servers are configured not to accept requests directly from the outside network. 

Alternatively, and recommended if you are going to do heavy development work, you can run your own local copy of [`rippled`](https://ripple.com/wiki/Rippled). This is required if you want to access any of the [Admin Commands](#List-of-Admin-Commands). In this case, you should use whatever IP and port you configured the server to bind. (For example, `127.0.0.1:54321`)

### WebSocket API ###

If you are just looking to try out some methods on the Ripple network, you can skip writing your own WebSocket code and go straight to using the API at the [Ripple WebSocket API Tool](https://ripple.com/tools/api/). Later on, when you want to connect to your own `rippled` server, you can build your own client in Javascript to run in a browser or possibly [Node.js](https://github.com/einaros/ws).

Currently Ripple Labs maintains a set of public WebSocket servers at:

```
s1.ripple.com:443
```

### JSON-RPC ###

You can use any HTTP client (like [Poster for Firefox](https://addons.mozilla.org/en-US/firefox/addon/poster/) or [Postman for Chrome](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en)) to make JSON-RPC calls a `rippled` server. 

Currently, Ripple Labs maintains a set of public JSON-RPC servers at:

```
s1.ripple.com:51234
```

If you are running your own `rippled` server, make sure that you have enabled the JSON-RPC interface in your [rippled.cfg](https://ripple.com/wiki/Rippled.cfg) file, since JSON-RPC is disabled by default. The relevant section is something like this example:

```
# [rpc_ip]:
#   IP address or domain to bind to allow insecure RPC connections.
#   Defaults to not allow RPC connections.
#
# [rpc_port]:
#   Port to bind to if allowing insecure RPC connections.
[rpc_ip]
127.0.0.1

[rpc_port]
8088
```

### Commandline ###

The commandline interface connects to the same service as the JSON-RPC one, so the public servers and server configuration are the same. By default, `rippled` connects to the local instance; however, you can specify the server to connect to with the `--rpc-ip` commandline argument. For example:

```
rippled --rpc_ip=s1.ripple.com:51234 server_info
```

## Request Formatting ##

Both the WebSocket API and the JSON-RPC API use [JSON](http://www.w3schools.com/json/) for requests and responses. The methods and parameters available on both APIs are generally the same, but the exact formatting is slightly different between the two. The commandline interface supports the same commands, with the parameters in the commandline as well.

* A WebSocket request puts the command name in the `"command"` field alongside the command's parameters at the top level of the JSON object, with an optional `"id"` field that will be returned with the response, so you can identify responses that come back out of order. 
* A JSON-RPC request puts the command in the `"method"` field, with parameters in a separate object, as the first member of a `"params"` array. There is no `"id"` field, since all responses are direct replies to the requests.
* The commandline puts the command after any normal (dash-prefaced) commandline options, followed by a limited set of parameters, separated by spaces. 


#### Example Request ####
<div class='multicode'>
*WebSocket*
```
{
  "id": 2,
  "command": "account_info",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "strict": true,
  "ledger_index": "validated"
}
```

*JSON-RPC*
```
POST http://s1.ripple.com:51234/
{
    "method": "account_info",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "strict": true,
            "ledger_index": "validated"
        }
    ]
}
```
*Commandline*
```
rippled -- account_info r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 validated true
```
</div>

## Response Formatting ##

#### Example Successful Response ####
<div class='multicode'>
*WebSocket*
```
{
  "id": 2,
  "status": "success",
  "type": "response",
  "result": {
    "account_data": {
      "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "Balance": "27389517749",
      "Flags": 0,
      "LedgerEntryType": "AccountRoot",
      "OwnerCount": 18,
      "PreviousTxnID": "B6B410172C0B65575D89E464AF5B99937CC568822929ABF87DA75CBD11911932",
      "PreviousTxnLgrSeq": 6592159,
      "Sequence": 1400,
      "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
    },
    "ledger_index": 6760970
  }
}
```

*JSON-RPC*
```
HTTP Status: 200 OK
{
    "result": {
        "account_data": {
            "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "Balance": "27389517749",
            "Flags": 0,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 18,
            "PreviousTxnID": "B6B410172C0B65575D89E464AF5B99937CC568822929ABF87DA75CBD11911932",
            "PreviousTxnLgrSeq": 6592159,
            "Sequence": 1400,
            "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
        },
        "ledger_index": 6761012,
        "status": "success"
    }
}
```
*Commandline*
```
{
    "result": {
        "account_data": {
            "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "Balance": "27389517749",
            "Flags": 0,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 18,
            "PreviousTxnID": "B6B410172C0B65575D89E464AF5B99937CC568822929ABF87DA75CBD11911932",
            "PreviousTxnLgrSeq": 6592159,
            "Sequence": 1400,
            "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
        },
        "ledger_index": 6761012,
        "status": "success"
    }
}
```
</div>

The fields of a successful response include:

| Field | Type | Description |
|-------|------|-------------|
| `id` | (Varies) | (WebSocket only) ID provided in the request that prompted this response |
| `status` (WebSocket) <br\> `result.status` (JSON-RPC and Commandline) | String | `"success"` if the request successfully completed. In the WebSocket API responses, this is included at the top level; in JSON-RPC and Commandline responses, this is included as a sub-field of the `"result"` object. |
| `type` | String | (WebSocket only) Typically `"response"`, which indicates a successful response to a command. Asynchronous notifications use a different value such as `"ledgerClosed"` or `"transaction"`. |
| `result` | Object | The result of the query; contents vary depending on the command. |

#### Commandline ####
The response format for commandline methods is identical to JSON-RPC responses, because they use the same interface.

## Error Responses ##
It is impossible to enumerate all the possible ways an error can occur. Some may occur in the transport layer (for example, loss of network connectivity), in which case the results will vary depending on what client you are using. However, if the `rippled` server successfully receives your request, it will try to respond in a standardized error format.

Some example errors:
<div class='multicode'>
*WebSocket*
```
{
  "id": 3,
  "status": "error",
  "type": "response",
  "error": "ledgerIndexMalformed",
  "request": {
    "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "command": "account_info",
    "id": 3,
    "ledger_index": "-",
    "strict": true
  }
}
```

*JSON-RPC*
```
HTTP Status: 200 OK
{
    "result": {
        "error": "ledgerIndexMalformed",
        "request": {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "command": "account_info",
            "ledger_index": "-",
            "strict": true
        },
        "status": "error"
    }
}
```

*Commandline*
```
{
    "result": {
        "error": "ledgerIndexMalformed",
        "request": {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "command": "account_info",
            "ledger_index": "-",
            "strict": true
        },
        "status": "error"
    }
}
```
</div>

#### WebSocket API Error Response Format ####
| Field | Type | Description |
|-------|------|-------------|
| id | (Varies) | ID provided in the Web Socket request that prompted this response |
| status | String | `"error"` if the request caused an error |
| type | String | Typically `"response"`, which indicates a successful response to a command. |
| error | String | A unique code for the type of error that occurred |
| request | Object | A copy of the request that prompted this error, in JSON format. |

#### JSON-RPC API Error Response Format ####
Some JSON-RPC requests will respond with an error code on the HTTP layer. In these cases, the response is a plain-text explanation in the response body. For example, if you forgot to specify the command in the `method` parameter, the response is like this:
```
HTTP Status: 400 Bad Request
Null method
```

For other errors that returned with HTTP status code 200 OK, the responses are formatted in JSON

| Field | Type | Description |
|-------|------|-------------|
| result | Object | Object containing the response to the query |
| result.error | String | A unique code for the type of error that occurred |
| result.status | String | `"error"` if the request caused an error |
| result.request | Object | A copy of the request that prompted this error, in JSON format. Note that the request is re-formatted in WebSocket format. <span class='draft-comment'>(I think that's a bug...)</span> |

### Caution on Errors ###

When your request results in an error, the entire request is copied back as part of the response, so that you can try to debug the error. However, this also includes any secrets that were passed as part of the request. Be very careful when sharing error messages not to accidentally expose important account secrets to others.

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

# API Methods #

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
Accounts are the core identity in the Ripple Network. Each account can hold balances in multiple currencies. In order to be a valid account, however, there is a minimum reserve in XRP. (The [reserve for an account](https://ripple.com/wiki/Reserves) increases with the amount of data it is responsible for in the shared ledger.) It is expected that accounts will correspond loosely to individual users. An account is similar to a Bitcoin wallet, except that it is not limited strictly to holding digital crypto-currency.

## account_info ##

The `account_info` command retrieves information about an account, its activity, and its balances. All information retrieved is relative to a particular version of the ledger. 

#### Request Format ####

An example of an account_info request:
<div class='multicode'>
*WebSocket*
```
{
  "id": 2,
  "command": "account_info",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "strict": True,
  "ledger_index": "validated"
}
```

*JSON-RPC*
```
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

*Commandline*
```
account_info account [ledger_index] [strict]
```
</div>
<span class='draft-comment'>(Does the commandline accept a ledger_hash instead of ledger_index?)</span>

The request contains the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| account | String | A unique identifier for the account, most commonly the account's address. |
| strict | Boolean | (Optional, defaults to False) If set to True, then the `account` field will only accept a public key or account address. |
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger))|

The following fields are deprecated and should not be provided: `ident`, `account_index`, `ledger`.

#### Response Format ####

An example of a successful response:

<div class='multicode'>
*WebSocket*
```
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
</div>

The response follows the [standard format](#response-formatting), with the result containing the requested account, its data, and a ledger to which it applies, as the following fields:

| Field | Type | Description |
|-------|------|-------------|
| account_data | Object | Information about the requested account |
| account_data.Account | String | Address of the requested account |
| account_data.Balance | String | XRP balance in "drops" represented as a string |
| account_data.Flags | 32-bit unsigned integer | Integer with different bits representing the status of several [account flags](https://ripple.com/wiki/Transactions#AccountSet_.283.29) |
| account_data.LedgerEntryType | String | "AccountRoot" specifies that this is an Account  |
| account_data.OwnerCount | Integer | Number of other ledger entries (specifically, trust lines and offers) attributed to this account. This affects the total reserve required to use the account. |
| account_data.PreviousTxnID | String | Hash value representing the most recent transaction that affected this account |
| account_data.Sequence | Integer | The sequence number of the next valid transaction for this account. (Each account starts with Sequence = 1 and increases each time a transaction is made.) |
| account_data.index | String | (Deprecated) Data on another deterministic wallet that can be derived from the account's secret. (Not widely supported; this feature may be dropped in the future.) |
| ledger_current_index | Integer | (Omitted if `ledger_index` is provided instead) The sequence number of the most-current ledger, which was used when retrieving this information. The information does not contain any changes from ledgers newer than this one.  |
| ledger_index | Integer | (Omitted if `ledger_current_index` is provided instead) The sequence number of the ledger used when retrieving this information. The information does not contain any changes from ledgers newer than this one.<span class='draft-comment'>Right?</span> |
| validated | Boolean | (Upcoming) True if this data is from a validated ledger version; if omitted or set to false, this data is not final. |

## account_lines ##

The `account_lines` method returns information about the account's lines of trust (also known as credit lines). All information retrieved is relative to a particular version of the ledger.

#### Request Format ####

An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
  "id": 1,
  "command": "account_lines",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "ledger": "current"
}
```
</div>

The request accepts the following paramters:

| Field | Type | Description |
|-------|------|-------------|
| account | String | A unique identifier for the account, most commonly the account's address. |
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger))|
| peer | String | (Optional) A unique ID for a second account. If provided, show only lines of trust connecting the two accounts. |

The following parameters are deprecated and should not be used: `ledger` and `peer_index`.

#### Response Format ####

An example of a successful response:

<div class='multicode'>
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
</div>

The response follows the [standard format](#response-formatting), with a successful result containing the address of the account and an array of trust-line objects. Specifically, the result object contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| account | String | Unique address of the account this request corresponds to |
| lines | Array | Array of trust-line objects, as described below. |

Each trust-line object has some combination of the following fields, although not necessarily all of them:

| Field | Type | Description |
|-------|------|-------------|
| account | String | The unique address of the account this line applies to. |
| balance | String | Representation of the numeric balance currently held against this line |
| currency | String | The currency this line applies to |
| limit | String | The maximum amount of the given currency that the account is willing to owe the peer |
| limit_peer | String | The maximum amount of currency that the peer is willing to owe the account |
| no_ripple | Boolean | <span class='draft-comment'>Don't use as an intermediary for transactions?</span> |
| no_ripple_peer | Boolean | <span class='draft-comment'>?</span> |
| quality_in | Unsigned Integer | <span class='draft-comment'>Fee to charge?</span> |
| quality_out | Unsigned Integer | <span class='draft-comment'>Fee to charge?</span> |

## account_offers ##

The `account_offers` method retrieves a list of offers made by a given account that are outstanding as of a particular ledger version.

#### Request Format ####

An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
  "id": 2,
  "command": "account_offers",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "ledger_index": "current"
}
```

*Commandline*
```
account_offers account|nickname|seed|pass_phrase|key [ledger_index]
```
</div>

A request can include the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| account | String | A unique identifier for the account, most commonly the account's address. |
| ledger | Unsigned integer, or String | (Deprecated, Optional) A unique identifier for the ledger version to use, such as a ledger sequence number, a hash, or a shortcut such as "validated". |
| ledger_hash | String | (Optional) A 20-byte hex string identifying the ledger version to use. |
| ledger_index | (Optional) Unsigned integer, or String | (Optional, defaults to `current`) The sequence number of the ledger to use, or "current", "closed", or "validated" to select a ledger dynamically. (See Ledger Indexes.) |

The following parameter is deprecated and should not be used: `ledger`.


#### Response Format ####

An example of a successful response:

<div class='multicode'>
*WebSocket*
```
{
  "id": 2,
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
</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| account | String | Unique address identifying the account that made the offers |
| offers | Array | Array of objects, where each object represents an offer made by this account that is outstanding as of the requested ledger version. |

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

<div class='multicode'>
*WebSocket*
```
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

*Commandline*
```
account_tx accountID [ledger_min [ledger_max [limit]]] [binary] [count] [descending]
```
</div>

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
| marker | (Not Specified) | Server-provided value to specify where to resume retrieving data from. |

There is a legacy variation of the `account_tx` method that is used instead whenever any of the following fields are found. This mode is deprecated, and we recommend *not using any of the following fields*:

| Field | Type | Description |
|-------|------|-------------|
| offset | Integer | (Deprecated, Optional, defaults to 0) The number of values to skip over without returning. Use to iterate over data sets larger than the `limit` value. |
| count | Integer | (Deprecated, Optional) Number of transactions to skip over before retrieving. To iterate over the entire set, send multiple requests with this parameter set to the number of transactions you've already seen. |
| descending | Boolean | (Deprecated, Optional, defaults to False) If true, results are sorted in descending order.
| ledger_max | Integer or String | (Deprecated) The newest ledger version to search for transactions, or `-1` to use the newest available. (See [Specifying a ledger](#specifying-a-ledger) |
| ledger_min | Integer or String | (Deprecated) Theh oldest ledger version to search for transactions, or `-1` to use the oldest available. (See [Specifying a ledger](#specifying-a-ledger) | 

##### Iterating over queried data ######

If you want to retrieve an amount of data that is higher than the server's maximum `limit` value, or you want to break up your request into multiple smaller requests, you can use the `marker` field to pick up in the same place you left off. For each subsequent request, pass the `marker` value from the previous request to instruct rippled to resume from the point where you left off.

However, in the time between requests, things may change so that `"ledger_index_min": -1` and `"ledger_index_max": -1` may refer to different ledger versions than they did before. To make sure you iterate over the same exact data set, take the `ledger_index_min` and `ledger_index_max` values provided in the first response, and use those values for all subsequent requests.

#### Response Format ####

An example of a successful response:

<div class='multicode'>
*WebSocket*
```
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
</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| account | String | Unique address identifying the related account |
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

Use the `wallet_propose` method to generate the keys needed for a new account. The account created this way will only become officially included in the Ripple network when it receives a transaction that provides enough XRP to meet the account reserve. (The `wallet_propose` command does not affect the global network. Technically, it is not strictly necessary for creating a new account: you could generate keys some other way, but that is not recommended.)

*The `wallet_propose` request is an admin command that cannot be run by unpriviledged users!*

#### Request Format ####

An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
    "command": "wallet_propose",
    "passphrase": "test"
}
```
*Commandline*
```
wallet_propose [passphrase]
```

</div>

The request can contain the following parameter:

| Field | Type | Description |
|-------|------|-------------|
| passphrase | String | (Optional) Specify a passphrase, for testing purposes. If omitted, the server will generate a random passphrase. Outside of testing purposes, passphrases should always be randomly generated. |

#### Response Format ####

An example of a successful response:
<div class='multicode'>
*WebSocket*
```
{
   "result" : {
      "account_id" : "rp2YHP5k3bSd6LRFT4phDjVMLXQjH4hiaG",
      "master_key" : "AHOY CLAD JUDD NOON MINI CHAD CUBA JAN KANT AMID DEL LETS",
      "master_seed" : "ssyXjRurNo75TjXjubby65cD96ak8",
      "master_seed_hex" : "5BDD10A694F2E36CCAC0CBE28CE2AC49",
      "public_key" : "aBPXjfsA7fY2LLPxRuZ7Sj2ADzoSEGDW4Atd5MgxdHz5FQvGPbqU",
      "public_key_hex" : "02CF23BCB1252D153713954AF374F44F82C255170ECAEDB059783128F53288F34F",
      "status" : "success"
   }
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing various important information about the new account, including the following fields:

| Field | Type | Description |
|-------|------|-------------|
| master_seed | String | The master seed from which all other information about this account is derived, in encoded string <span class='draft-comment'>(how exactly?)</span> format. |
| master_seed_hex | String | The master seed, in hex format. |
| master_key | String | The master seed, in [RFC 1751](http://tools.ietf.org/html/rfc1751) format. |
| account_id | String | The public address of the account. |
| public_key | String | The public key of the account, in encoded string format. |
| public_key_hex | String | The public key of the account, in hex format. |

# Managing Ledgers #

The shared ledger is the core of the Ripple Network. Each `rippled` server keeps an entire copy of the ledger, which contains all the accounts, transactions, and offers in the network in an optimized tree format. As transactions and offers are proposed, each server incorporates them into its working copy of the ledger, closes it periodically, and volunteers the recently-closed ledgers to become the globally canonical version. Once concensus is reached in the network, that ledger version is validated and becomes permanently immutable. Any transactions that were not included in one ledger go into the working copy, to be included in the next closed version proposed for validation.

## ledger ##

Retrieve information about the public ledger.

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
    "command": "ledger",
    "full": false,
    "accounts": false,
    "transactions": false,
    "expand": false,
    "ledger_index": "current"
}
```

*Commandline*
```
ledger ledger_index|ledger_hash [full]
```
</div>

The request can contain the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| accounts | Boolean | (Optional, defaults to false) If true, return information on accounts in the ledger. *Admin required* |
| transactions | Boolean | (Optional, defaults to false) If true, return information on transactions. |
| full | Boolean | (Optional, defaults to false) If true, return full information on the entire ledger. (Equivalent to enabling `transactions`, `accounts`, and `expand` *Admin required* |
| expand | Boolean | (Optional, defaults to false) Provide full JSON-formatted information for transaction/account information instead of just hashes *Admin required<span class='draft-comment'>?</span>* |
| ledger_hash | String | (Optional) A 20-byte hex string identifying the ledger version to use. |
| ledger_index | (Optional) Unsigned integer, or String | (Optional, defaults to `current`) The sequence number of the ledger to use, or "current", "closed", or "validated" to select a ledger dynamically. (See Ledger Indexes.) |

The `ledger` field is deprecated and should not be used.

#### Response Format ####

An example of a successful response:

<div class='multicode'>
*WebSocket*
```
{
  "id": 14,
  "status": "success",
  "type": "response",
  "result": {
    "ledger": {
      "accepted": true,
      "account_hash": "03AC618315876C2B1F50EBB570C84BB11AB7FFE571CFE173E898326C8281C623",
      "close_time": 453452750,
      "close_time_human": "2014-May-15 07:05:50",
      "close_time_resolution": 10,
      "closed": true,
      "hash": "957034715D2A4065820E3EC1413FCE23AB4A6496C150A355C691B1F9A985416C",
      "ledger_hash": "957034715D2A4065820E3EC1413FCE23AB4A6496C150A355C691B1F9A985416C",
      "ledger_index": "6636643",
      "parent_hash": "22128FF378D06A0040B9C67D38EBBB2C175CB7ACDDA1F8772266338E97D90BAF",
      "seqNum": "6636643",
      "totalCoins": "99999990220863890",
      "total_coins": "99999990220863890",
      "transaction_hash": "D5B2F85496B00841A9FE16BFB91CBA4DA1C3D337CAD9F4EE13A0D7D8F198D02C"
    }
  }
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing information about the ledger, including the following fields:

| Field | Type | Description |
|-------|------|-------------|
| accepted | Boolean |
| account_hash | String | <span class='draft-comment'>Hash of the account information in this ledger?</span> |
| close_time | Integer | The time this ledger was closed, in seconds since the Ripple Epoch |
| close_time_human | String | The time this ledger was closed, in human-readable format |
| close_time_resolution | Integer | <span class='draft-comment'>?</span> |
| closed | Boolean | Whether or not this ledger has been closed |
| hash | String | Unique identifying hash of the entire ledger. |
| ledger_hash | String | Alias for `hash` |
| ledger_index | String | Ledger sequence number as a quoted integer |
| parent_hash | String | Unique identifying hash of the ledger that came immediately before this one. |
| seqNum | String | Alias for `ledger_index` |
| totalCoins | String | Total number of XRP drops in the network, as a quoted integer. (This decreases as transaction fees cause XRP to be destroyed.) |
| total_coins | String | Alias for `totalCoins` |
| transaction_hash | String | <span class='draft-comment'>Hash of the transaction information included in this ledger?</span> |


## ledger_closed ##

The `ledger_closed` method returns the unique identifiers of the most recently closed ledger. (This ledger is not necessarily validated and immutable yet.)

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
   "id": 2,
   "command": "ledger_closed"
}
```

*Commandline*
```
ledger_closed
```
</div>

This method accepts no parameters.

#### Response Format ####
An example of a successful response:

<div class='multicode'>
*WebSocket*
```
{
  "id": 1,
  "status": "success",
  "type": "response",
  "result": {
    "ledger_hash": "17ACB57A0F73B5160713E81FE72B2AC9F6064541004E272BD09F257D57C30C02",
    "ledger_index": 6643099
  }
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| ledger_hash | String | 20-byte hex string with a unique hash of the ledger |
| ledger_index | Unsigned Integer | Sequence number of this ledger |

## ledger_current ##
The `ledger_current` method returns the unique identifiers of the current in-progress ledger. This command is mostly useful for testing, because the ledger is still in flux.

#### Request Format ####

An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
   "id": 2,
   "command": "ledger_current"
}
```

*Commandline*
```
ledger_current
```
</div>

The request contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | (Arbitrary) | (WebSocket only) Any identifier to separate this request from others in case the responses are delayed or out of order. |


#### Response Format ####
An example of a successful response:

<div class='multicode'>
*WebSocket*
```
{
  "id": 2,
  "status": "success",
  "type": "response",
  "result": {
    "ledger_current_index": 6643240
  }
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following field:

| Field | Type | Description |
|-------|------|-------------|
| ledger_current_index | Unsigned Integer | Sequence number of this ledger |

A `ledger_hash` field is not provided, because the hash of the current ledger is constantly changing along with its contents.

## ledger_data ##
The `ledger_data` method retrieves contents of the specified ledger. You can iterate through several calls in order to retrieve the entire contents of a single ledger version.

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
   "id": 2,
   "command": "ledger_data",
   "limit": 5,
   "binary": true
}
```

</div>

A request can include the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | (Arbitrary) | (WebSocket only) Any identifier to separate this request from others in case the responses are delayed or out of order. |
| ledger | String or Unsigned Integer | (Optional, Deprecated) Hash, index, or shortcut value for the ledger to use. (See [Specifying a Ledger](#specifying-a-ledger))
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger))|
| binary | Boolean | (Optional, defaults to False) If set to True, return data nodes as hashed hex strings instead of JSON. |
| limit | Integer | (Optional, default varies) Limit the number of nodes to retrieve. The server is not required to honor this value. |
| marker | (Not Specified) | Server-provided value to specify where to resume retrieving data from. |

#### Response Format ####

An example of a successful response:
<span class='draft-comment'>Example needed</span>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| ledger_index | Unsigned Integer | Sequence number of this ledger |
| ledger_hash | String | Unique identifying hash of the entire ledger. |
| state | <span class='draft-comment'>?</span> | <span class='draft-comment'>Actual node data from the ledger tree?</span> |
| data | <span class='draft-comment'>?</span> | <span class='draft-comment'>Actual node data from the ledger tree?</span> |
| index | String | <span class='draft-comment'>?</span> |
| marker | (Not Specified) | Server-defined value. Pass this to the next call in order to resume where this call left off. |

## ledger_entry ##
The `ledger_entry` method returns a single entry from the specified ledger. <span class='draft-comment'>Some more information on this would be good</span>

#### Request Format ####

An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
  "id": 3,
  "command": "ledger_entry",
  "type": "account_root",
  "account_root": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "ledger_index": "validated"
}
```

</div>

This method has several modes that retrieve different things. You can select modes by passing the appropriate parameters, but you can only use one mode at a time. If you request multiple items, the server will perform whichever operation is first on the following list:

1. `account_root`
2. `directory`
3. `generator`
4. `offer`
5. `ripple_state`

The full list of parameters recognized by this method is as follows:

| Field | Type | Description |
|-------|------|-------------|
| id | (Arbitrary) | (WebSocket only) Any identifier to separate this request from others in case the responses are delayed or out of order. |
| index | String | <span class='draft-comment'>Hex code for something related to proof?</span> |
| account_root | String | (Optional) <span class='draft-comment'>Specify an account to retrieve from the ledger? Is this different from `account_info`?</span> |
| directory | Object or String | (Optional) Specify a directory node to retrieve from the tree. <span class='draft-comment'>... whatever a directory node is.</span> If a string, interpret as a <span class='draft-comment'>hex hash of something?</span>. If an object, requires either `dir_root` or `owner` as a sub-field, plus optionally a `sub_index` sub-field. |
| directory.sub_index | Unsigned Integer | (Optional) <span class='draft-comment'>?</span> |
| directory.dir_root | String |  (Optional) <span class='draft-comment'>?</span> |
| directory.owner | String | (Optional) Unique Account address of <span class='draft-comment'>the directory?</span> |
| generator | Object or String | (Optional) If a string, interpret as a <span class='draft-comment'>hex hash of something?</span> If an object, requires the sub-field `regular_seed` |
| generator.regular_seed | String | <span class='draft-comment'>?</span> |
| offer | Object or String | (Optional) If a string, interpret as a <span class='draft-comment'>hex hash of something?</span> If an object, requires the sub-fields `account` and `seq`. |
| offer.account | String | (Required if `offer` specified) The unique address of the account <span class='draft-comment'>making the offer?</span> |
| offer.seq | Unsigned Integer | (Required if `offer` specified)  <span class='draft-comment'>?</span> |
| ripple_state | Object | (Optional) <span class='draft-comment'>Information about the potential path between two accounts?</span> |
| ripple_state.accounts | Array | (Required if `ripple_state` specified) 2-length array of account address strings |
| ripple_state.currency | String | (Required if `ripple_state` specified) String representation of a currency <span class='draft-comment'>(like, the 3-letter or hex code?)</span> |
| binary | Boolean | (Optional, defaults to false) If true, return data as <span class='draft-comment'>"binary"?</span> Otherwise, return data in JSON format. |

#### Response Format ####

An example of a successful response:
<span class='draft-comment'>Example(s) needed</span>

## ledger_accept ##
The `ledger_accept` method forces the server to close the current-working ledger <span class='draft-comment'>and validate it?</span>. This method is intended for testing purposes only, and is only available when the `rippled` server is running stand-alone mode.

*The `ledger_accept` method is an admin command that cannot be run by unpriviledged users!*

#### Request Format ####

An example of the request format:
An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
   "id": "Accept my ledger!",
   "command": "ledger_accept"
}
```

*Commandline*
```
ledger_accept
```
</div>

The request contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | (Arbitrary) | (WebSocket only) Any identifier to separate this request from others in case the responses are delayed or out of order. |

#### Response Format ####

An example of a successful response:
```js
{
  "id": "Accept my ledger!",
  "status": "success",
  "type": "response",
  "result": {
    "ledger_current_index": 6643240
  }
}
```

The response follows the [standard format](#response-formatting), with a successful result containing the following field:

| Field | Type | Description |
|-------|------|-------------|
| ledger_current_index | Unsigned Integer | Sequence number of the newly created 'current' ledger |

# Managing Transactions #

Transactions are the most important aspect of the Ripple Network. All business on the Ripple Network takes the form of transactions, which include not only payments, but also currency-exchange offers, account settings, and changes to the properties of the network itself (like adopting new features).

Transactions are a tricky beast. <span class='draft-comment'>... in progress</span>
