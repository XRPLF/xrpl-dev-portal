# WebSocket and JSON-RPC APIs #
If you want to communicate directly with the `rippled` server, you have three fairly similar options for how to do that. All of these APIs use the same list of commands, with almost entirely the same parameters in each command. Whereas the [Ripple-REST API](?p=ripple-rest-api) provides a simplified interface on top of the WebSocket API for easier integration, these APIs provide the full power of Ripple but require slightly more complexity:

* The WebSocket API uses the [WebSocket protocol](http://www.html5rocks.com/en/tutorials/websockets/basics/), available in most browsers and Javascript implementations, to achieve persistent two-way communication. There is not a 1:1 correlation between requests and responses. Some requests prompt the server to send multiple messages back asynchronously; other times, responses may arrive in a different order than the requests that prompted them. 
* The JSON-RPC API relies on simple request-response communication via HTTP. For commands that prompt multiple responses, you can provide a callback URL.
* The `rippled` program can also be used as a quick commandline client to make JSON-RPC requests to a running `rippled` server. This is only intended for administrative purposes, and is not a supported API.

In general, we recommend using WebSocket, because WebSocket's push paradigm has less latency and less network overhead. JSON-RPC must open and close an HTTP connection for each individual message. WebSocket is also more reliable; you can worry less about missing messages and establishing multiple connections. However, all three have valid use cases and will continue to be supported for the foreseeable future.

## Changes to the APIs ##

The WebSocket and JSON-RPC APIs are still in development, and are subject to change. If you want to be notified of upcoming changes and future versions of `rippled`, subscribe to the Ripple Server mailing list:

https://groups.google.com/forum/#!forum/ripple-server

## Connecting to rippled ##

Before you can run any commands against a `rippled` server, you must know which server you are connecting to. Most servers are configured not to accept requests directly from the outside network. 

Alternatively, you can run your own local copy of [`rippled`](https://ripple.com/wiki/Rippled). This is required if you want to access any of the [Admin Commands](#List-of-Admin-Commands). In this case, you should use whatever IP and port you configured the server to bind. (For example, `127.0.0.1:54321`)

### Reasons to Run Your Own rippled ###

There are lots of reasons you might want to run your own `rippled` server, but most of them can be summarized as: you can trust your own server, you have control over its workload, and you're not at the mercy of others to decide when and how you can access it.

It is important that you can trust the `rippled` you use, so you can be certain that the software you are running will behave in the manner specified in its source code. Of course, you must also practice good network security to protect your server from malicious hackers. If you connect to a malicious server, there are myriad ways that it can take advantage of you or cause you to lose money. For example:

* A malicious server could report that you were paid when no such payment was made
* It could selectively show or hide payment paths and currency exchange offers to guarantee its own profit while not providing you the best deal
* If you sent it your account's secret, it could make arbitrary transactions on your behalf, and even transfer or destroy all the money in your account's balances.

Additionally, running your own server gives you admin control over it, which allows you to run important admin-only and load-intensive commands. If you use a shared server, you have to worry about other users of the same server competing with you for the server's computing power. Many of the commands in the WebSocket API can put a lot of strain on the server, so `rippled` has the option to scale back its responses when it needs to. If you share a server with others, you may not always get the best results possible.

### WebSocket API ###

If you are just looking to try out some methods on the Ripple network, you can skip writing your own WebSocket code and go straight to using the API at the [Ripple WebSocket API Tool](https://ripple.com/tools/api/). Later on, when you want to connect to your own `rippled` server, you can build your own client in Javascript to run in a browser (See [this example](http://www.websocket.org/echo.html) ) or possibly [Node.js](https://github.com/einaros/ws).

Currently Ripple Labs maintains a set of public WebSocket servers at:

| Domain | Port |
| ------- | ------- |
| s1.ripple.com | 443 |

These public servers are not for sustained or business use, and they may become unavailable at any time. For regular use, you should run your own `rippled` server or contract someone you trust to do so.

### JSON-RPC ###

You can use any HTTP client (like [Poster for Firefox](https://addons.mozilla.org/en-US/firefox/addon/poster/) or [Postman for Chrome](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en)) to make JSON-RPC calls a `rippled` server. 

Currently, Ripple Labs maintains a set of public JSON-RPC servers at:

| Domain | Port |
| ------- | ------- |
| s1.ripple.com | 51234 |

These public servers are not for sustained or business use, and they may become unavailable at any time. For regular use, you should run your own `rippled` server or contract someone you trust to do so.

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

The commandline interface connects to the same service as the JSON-RPC one, so the public servers and server configuration are the same. By default, `rippled` connects to the local instance; however, you can specify the server to connect to in the configuration file or with the `--rpc-ip` commandline argument. For example:

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
It is impossible to enumerate all the possible ways an error can occur. Some may occur in the transport layer (for example, loss of network connectivity), in which case the results will vary depending on what client and transport you are using. However, if the `rippled` server successfully receives your request, it will try to respond in a standardized error format.

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
| request | Object | A copy of the request that prompted this error, in JSON format. *Caution:* If the request contained any account secrets, they are copied here! |

#### JSON-RPC API Error Response Format ####
Some JSON-RPC requests will respond with an error code on the HTTP layer. In these cases, the response is a plain-text explanation in the response body. For example, if you forgot to specify the command in the `method` parameter, the response is like this:
```
HTTP Status: 400 Bad Request
Null method
```

For other errors that returned with HTTP status code 200 OK, the responses are formatted in JSON, with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| result | Object | Object containing the response to the query |
| result.error | String | A unique code for the type of error that occurred |
| result.status | String | `"error"` if the request caused an error |
| result.request | Object | A copy of the request that prompted this error, in JSON format. *Caution:* If the request contained any account secrets, they are copied here! *Note:* The request is re-formatted in WebSocket format, regardless of the request made. This may be changed in the future: See [RIPD-279](https://ripplelabs.atlassian.net/browse/RIPD-279). |

### Caution on Errors ###

When your request results in an error, the entire request is copied back as part of the response, so that you can try to debug the error. However, this also includes any secrets that were passed as part of the request. When sharing error messages, be very careful not to accidentally expose important account secrets to others.

## Formatting Conventions ##

The WebSocket and JSON-RPC APIs generally take the same arguments, although they're provided in a different way (See [Request Formatting](#request-formatting) for details). Many similar parameters appear throughout the APIs, and there are conventions for how to specify these parameters.

All field names are case-sensitive. In responses, fields that are taken directly from Ledger Node or Transaction objects start with upper-case letters. Other fields, including ones that are dynamically generated for a response, are lower case.

### Unique Identifiers ###

Different types of objects are uniquely identified in different ways:

*Accounts* are identified by their *address*, a [base-58-encoded](https://wiki.ripple.com/Encodings) string, for example `"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"`. Addresses always start with "r". You can also provide an un-encoded hex representation instead.

*Transactions* are identified by their *hash*, which is a [SHA-512](http://en.wikipedia.org/wiki/Sha512) hash of the transaction's binary format. Transaction hashes are represented as hex strings.

Each instance of the Ripple *Ledger* has a sequence number and a hash value. See [Specifying a Ledger Instance](#specifying-a-ledger-instance) for details.

### Specifying a Ledger Instance ###

Many API methods require you to specify an instance of the ledger, with the data retrieved being considered accurate and up-to-date as of that particular version of the shared ledger. The commands that accept a ledger version all work the same way. There are three ways you can specify which ledger you want to use:

1. Specify a ledger by its Sequence Number in the `ledger_index` parameter. Each closed ledger has an identifying sequence number that is 1 higher than the previously-validated ledger. (The Genesis Ledger has sequence number 0)
2. Specify a ledger by its hash value in the `ledger_hash` parameter. 
3. Specify a ledger by one of the following shortcuts, in the `ledger_index` parameter:
	* `validated` for the most recent ledger that has been validated by the whole network
	* `closed` for the most recent ledger that has been closed for modifications and proposed for validation by the node
	* `current` for the node's current working version of the ledger.
	
There is also a deprecated `ledger` parameter which accepts any of the above three formats. *Do not* use this parameter; it may be removed without further notice.

If you do not specify a ledger, the `current` (in-progress) ledger will be chosen by default. If you provide more than one field specifying ledgers, the deprecated `ledger` field will be used first if it exists, falling back to `ledger_hash`. The `ledger_index` field is ignored unless neither of the other two are present. *Note:* Do not rely on this default behavior; it is subject to change. Instead, you should always specify a ledger version in each call.

The sequence number indicates the order of the ledgers; the hash value identifies the exact contents of the ledger. Two ledgers with the same hash are always identical. For closed ledgers, hash values and sequence numbers are equally valid and correlate 1:1. However, this is not true for in-progress ledgers:

* Two different rippled servers may have different contents for a current ledger with the same sequence number, due to transactions not being fully propagated throughout the network.
* A current ledger's contents change over time, which would cause its hash to change, even though its sequence number stays the same. Therefore, the hash of a ledger is not calculated until it is closed.

### Specifying Currency Amounts ###

Some API methods require you to specify an amount of currency. Depending on whether you are dealing in the network's native XRP currency or other currency units (sometimes referred to as IOUs), the style for specifying it is very different.

#### XRP ####

Amounts of XRP are represented as strings. (JSON integers are limited to 32 bits, so integer overflows are possible.) XRP is formally specified in "drops", which are equivalent to 0.000001 (one 1-millionth) of an XRP each. Thus, to represent 1.0 XRP in a JSON document, you would write `"1000000"`.

Unit tests are permitted to submit values of XRP (not drops) with a decimal point - for example, "1.23" meaning 1.23 XRP. All other cases should always specify XRP in drops, with no decimal point: e.g. "1230000" meaning 1.23 XRP.

#### Non-XRP ####

If you are specifying non-XRP currency (including fiat dollars, precious metals, cryptocurrencies, or other custom currency) you must specify it with a currency specification object. This is a JSON object with three fields:

| Field | Type | Description |
|-------|------|-------------|
| currency | String | Three-letter [ISO 4217 Currency Code](http://www.xe.com/iso4217.php) string ("XRP" is invalid). Alternatively, an unsigned 160-bit hex value according to the [Currency format](https://wiki.ripple.com/Currency_format). |
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

Unit tests are permitted to submit amounts of non-XRP currencies as a slash-separated string in the format `"amount/currency/issuer"`. All other cases should use the JSON object format above.

#### Specifying Currencies Without Amounts ####

If you are specifying a non-XRP currency without an amount (typically for defining an order book of currency exchange offers) you should specify it as above, but omit the `value` field.

If you are specifying XRP without an amount -- also typically for defining an order book -- you should specify it as a JSON object with _only_ a `currency` field. Never include an `issuer` field for XRP.

Finally, if you are specifying a non-currency for a payment or path definition, and the recipient account of the payment trusts multiple gateways that issue the same currency, you can indicate that the payment should be made in any combination of issuers that the recipient accepts. To do this, specify the recipient account's address as the `issuer` value in the JSON object.

### Specifying Time ###

The `rippled` server and its APIs represent time as an unsigned integer. This number measures the number of seconds since the "Ripple Epoch" of January 1, 2000 (00:00 UTC). This is similar to the way the [Unix epoch](http://en.wikipedia.org/wiki/Unix_time) works, except the Ripple Epoch is 946684800 seconds after the Unix Epoch.

Don't convert Ripple Epoch times to UNIX Epoch times in 32-bit variables: this could lead to integer overflows.

### Possible Server States ###

Depending on how the `rippled` server is configured, how long it has been running, and other factors, a server may be participating in the global Ripple Network to different degrees. This is represented as the `server_state` field in the responses to the [`server_info`](#server-info) and [`server_state`](#server-state) commands. The possible responses follow a range of ascending interaction, with each subsequent value superseding the previous one. Their definitions are as follows (in order of increasing priority):

| Value | Description |
|-------|-------------|
| disconnected | The server is not connected to the Ripple Network whatsoever. It may be running in offline mode, or it may not be able to access the network for whatever reason. |
| connected | The server believes it is connected to the network. |
| syncing | The server is currently behind on ledger versions. (It is normal for a server to spend a few minutes catching up after you start it.) |
| tracking | The server is in agreement with the network |
| full | The server is fully caught-up with the network and could participate in validation, but is not doing so (possibly because it has not been configured as a validator). |
| validating | The server is currently participating in validation of the ledger |
| proposing | The server is participating in validation of the ledger and currently proposing its own version. |

*Note:* The distinction between `full`, `validating`, and `proposing` is based on synchronization with the rest of the global network, and it is normal for a server to fluctuate between these states as a course of general operation.

# API Methods #

API methods for the Websocket and JSON-RPC APIs are defined by command names, and are divided into Public Commands and Admin Commands. Public Commands are not necessarily meant for the general public, but they are used by any client attached to the server. (Think of Public Commands as being for members or customers of the organization running the server, while the Admin Commands are for the personnel in charge of keeping the server operational.) Public Commands include the general operations for Ripple use, including checking the state of the ledger, finding a path to connecting users, and submitting a transaction, among others. Admin Commands, on the other hand, are meant only for the operators of the server, and include commands for managing the state of the server, the nodes it uses for validation, and other administrative features.

This page deals with all the Public Commands available. 

## List of Public Commands ##
* [`account_info` - Get basic data about an account](#account-info)
* [`account_lines` - Get info about an account's trust lines](#account-lines)
* [`account_offers` - Get info about an account's currency exchange offers](#account-offers)
* [`account_tx` - Get info about an account's transactions](#account-tx)
* [`book_offers` - Get info about offers to exchange two currencies](#book-offers)
* [`ledger` - Get info about a ledger version](#ledger)
* [`ledger_closed` - Get the latest closed ledger version](#ledger-closed)
* [`ledger_current` - Get the current working ledger version](#ledger-current)
* [`ledger_data` - Get the raw contents of a ledger version](#ledger-data)
* [`ledger_entry` - Get one element from a ledger version](#ledger-entry)
* [`path_find` - Find a path for a payment between two accounts and receive updates](#path-find)
* [`ping` - Confirm connectivity with the server](#ping)
* [`random` - Generate a random number](#random)
* [`ripple_path_find` - Find a path for payment between two accounts, once](#ripple-path-find)
* [`server_info` - Retrieve status of the server in human-readable format](#server-info)
* [`server_state` - Retrieve status of the server in machine-readable format](#server-state)
* [`sign` - Cryptographically sign a transaction](#sign)
* [`submit` - Send a transaction to the network](#submit)
* [`subscribe` - Listen for updates about a particular subject](#subscribe)
* [`transaction_entry` - Retrieve info about a transaction from a particular ledger version](#transaction-entry)
* [`tx` - Retrieve info about a transaction from all the ledgers on hand](#tx)
* [`tx_history` - Retrieve info about all recent transactions](#tx-history)
* [`unsubscribe` - Stop listening for updates about a particular subject](#unsubscribe)

The `wallet_accounts` command is deprecated and may be removed without further notice.

## Admin Commands ##

Additionally, this page contains an explanation of the following important admin-only command:

* [`wallet_propose` - Generate keys for a new account](#wallet-propose)

For information about other Admin Commands, consult [the old wiki documentation](https://ripple.com/wiki/JSON_Messages).

## Commandline Access ##

The `rippled` application, in addition to acting as a server, can be run (as a separate instance) to act as a JSON-RPC client. In this mode, it has syntax for triggering most API methods with a single line from the command prompt, as described in each method. However, some methods don't have a commandline shortcut, so it also provides the following catch-all method for performing commands:

* [`json` - Pass JSON through the commandline](#json)


# Managing Accounts #
Accounts are the core unit of authentication in the Ripple Network. Each account can hold balances in multiple currencies, and all transactions must be signed by an account's secret key. In order for an account to exist in a validated ledger version, it must hold a minimum reserve amount of XRP. (The [reserve for an account](https://ripple.com/wiki/Reserves) increases with the amount of data it is responsible for in the shared ledger.) It is expected that accounts will correspond loosely to individual users. 

## account_info ##

The `account_info` command retrieves information about an account, its activity, and its XRP balance. All information retrieved is relative to a particular version of the ledger. 

#### Request Format ####

An example of an account_info request:
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
#Syntax: account_info account [ledger_index|ledger_hash] [strict]
rippled -- account_info r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 true
```
</div>

The request contains the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| account | String | A unique identifier for the account, most commonly the account's address. |
| strict | Boolean | (Optional, defaults to False) If set to True, then the `account` field will only accept a public key or account address. |
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger-instance))|

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
| account_data.LedgerEntryType | String | "AccountRoot" is the type of ledger entry that holds an account's data |
| account_data.OwnerCount | Integer | Number of other ledger entries (specifically, trust lines and offers) attributed to this account. This is used to calculate the total reserve required to use the account. |
| account_data.PreviousTxnID | String | Hash value representing the most recent transaction that affected this account |
| account_data.Sequence | Integer | The sequence number of the next valid transaction for this account. (Each account starts with Sequence = 1 and increases each time a transaction is made.) |
| account_data.index | String | (Deprecated) Data on another deterministic wallet that can be derived from the account's secret. (Not widely supported; this feature may be dropped in the future.) |
| ledger_current_index | Integer | (Omitted if `ledger_index` is provided instead) The sequence number of the most-current ledger, which was used when retrieving this information. The information does not contain any changes from ledgers newer than this one.  |
| ledger_index | Integer | (Omitted if `ledger_current_index` is provided instead) The sequence number of the ledger used when retrieving this information. The information does not contain any changes from ledgers newer than this one. |
| validated | Boolean | ([Upcoming](https://ripplelabs.atlassian.net/browse/RIPD-275)) True if this data is from a validated ledger version; if omitted or set to false, this data is not final. |

## account_lines ##

The `account_lines` method returns information about the account's lines of trust, including balances in all non-XRP currencies and assets. All information retrieved is relative to a particular version of the ledger.

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
| account | String | A unique identifier for the account, most commonly the account's address as a base-58 string. |
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger-instance))|
| peer | String | (Optional) A unique ID for a second account. If provided, show only lines of trust connecting the two accounts. |

The following parameters are deprecated and may be removed without further notice: `ledger` and `peer_index`.

This method may be changed in the future to provide better scalability. See [RIPD-343](https://ripplelabs.atlassian.net/browse/RIPD-343) for details and status.

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
| balance | String | Representation of the numeric balance currently held against this line. A positive balance means that the account holds value; a negative balance means that the account owes value. |
| currency | String | The currency this line applies to |
| limit | String | The maximum amount of the given currency that the account is willing to owe the peer account |
| limit_peer | String | The maximum amount of currency that the peer account is willing to owe the account |
| no_ripple | Boolean | Whether or not the account has the [NoRipple flag](https://ripple.com/wiki/No_Ripple) set for this line |
| no_ripple_peer | Boolean | Whether or not the peer account has the [NoRipple flag](https://ripple.com/wiki/No_Ripple) set for the other direction of this trust line |
| quality_in | Unsigned Integer | Ratio for incoming [transit fees](https://ripple.com/wiki/Transit_Fees) represented in billionths. (For example, a value of 500 million represents a 0.5:1 ratio.) As a special case, 0 is treated as a 1:1 ratio. |
| quality_out | Unsigned Integer | Ratio for outgoing [transit fees](https://ripple.com/wiki/Transit_Fees) represented in billionths. (For example, a value of 500 million represents a 0.5:1 ratio.) As a special case, 0 is treated as a 1:1 ratio. |

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
#Syntax: account_offers account [ledger_index]
rippled -- account_offers r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 current
```
</div>

A request can include the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| account | String | A unique identifier for the account, most commonly the account's address as a base-58 string. |
| ledger | Unsigned integer, or String | (Deprecated, Optional) A unique identifier for the ledger version to use, such as a ledger sequence number, a hash, or a shortcut such as "validated". |
| ledger_hash | String | (Optional) A 20-byte hex string identifying the ledger version to use. |
| ledger_index | (Optional) Unsigned integer, or String | (Optional, defaults to `current`) The sequence number of the ledger to use, or "current", "closed", or "validated" to select a ledger dynamically. (See Ledger Indexes.) |

The following parameter is deprecated and may be removed without further notice: `ledger`.

*Note:* This method may be changed in the future to support better scalability. See [RIPD-344](https://ripplelabs.atlassian.net/browse/RIPD-344) for details and status.

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
| flags | Unsigned integer | Options set for this offer entry as bit-flags. |
| seq | Unsigned integer | Sequence number of the transaction that created this entry. (Transaction sequence numbers are relative to accounts.) |
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
#Syntax account_tx account [ledger_index_min [ledger_index_max [limit]]] [binary] [count] [forward]
rippled -- account_tx r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 -1 -1 2 false false false
```
</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| account | String | A unique identifier for the account, most commonly the account's address. | 
| ledger_index_min | Integer | Use to specify the earliest ledger to include transactions from. A value of `-1` instructs the server to use the earliest ledger available. |
| ledger_index_max | Integer | Use to specify the most recent ledger to include transactions from. A value of `-1` instructs the server to use the most recent one available. |
| ledger_hash | String | (Optional) Use instead of ledger_index_min and ledger_index_max to look for transactions from a single ledger only. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger_index | String or Unsigned Integer | (Optional) Use instead of ledger_index_min and ledger_index_max to look for transactions from a single ledger only. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| binary | Boolean | (Optional, defaults to False) If set to True, return transactions as hex strings instead of JSON. |
| forward | boolean | (Optional, defaults to False) If set to True, return values indexed with the oldest ledger first. Otherwise, the results are indexed with the newest ledger first. (Each page of results may not be internally ordered, but the pages are overall ordered.) |
| limit | Integer | (Optional, default varies) Limit the number of transactions to retrieve. The server is not required to honor this value. |
| marker | (Not Specified) | Server-provided value to specify where to resume retrieving data from. |

There is also a deprecated legacy variation of the `account_tx` method. For that reason, we recommend *not using any of the following fields*: `offset`, `count`, `descending`, `ledger_max`, `ledger_min`

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
| ledger_index_min | Integer | The sequence number of the earliest ledger actually searched for transactions. |
| ledger_index_max | Integer | The sequence number of the most recent ledger actually searched for transactions. |
| limit | Integer | The `limit` value used in the request. (This may differ from the actual limit value enforced by the server.) |
| marker | (Not Specified) | Server-defined value. Pass this to the next call in order to resume where this call left off. |
| offset | Integer | The `offset` value used in the request. |
| transactions | Array | Array of transactions matching the request's criteria, as explained below. |
| validated | Boolean | If included and set to `true`, the information in this request comes from a validated ledger version. Otherwise, the information is subject to change. |

*Note:* The server may respond with different values of `ledger_index_min` and `ledger_index_max` than you provided in the request, for example if it did not have the versions you specified on hand. If you are iterating over data, you should check these fields with every call to make sure you don't miss anything if the values change over time.

Each transaction object includes the following fields, depending on whether it was requested in JSON or hex string (`"binary":true`) format.

| Field | Type | Description |
|-------|------|-------------|
| ledger_index | Integer | The sequence number of the ledger version that included this transaction. |
| meta | Object (JSON) or String (Binary) | If `binary` is True, then this is a hex string of the transaction metadata. Otherwise, the transaction metadata is included in JSON format. |
| tx | Object | (JSON mode only) JSON object defining the transaction |
| tx_blob | String | (Binary mode only) Unique hashed String representing the transaction. |
| validated | Boolean | Whether or not the transaction is included in a validated ledger. Any transaction not yet in a validated ledger is subject to change. |

## wallet_propose ##

Use the `wallet_propose` method to generate the keys needed for a new account. The account created this way will only become officially included in the Ripple network when it receives a transaction that provides enough XRP to meet the account reserve. (The `wallet_propose` command does not affect the global network. Technically, it is not strictly necessary for creating a new account: you could generate keys some other way, but that is not recommended.)

*The `wallet_propose` request is an admin command that cannot be run by unpriviledged users!* (Since admin commands are not transmitted over the outside network this command is protected against people sniffing the network for account secrets.)

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
#Syntax: wallet_propose [passphrase]
rippled -- wallet_propose test
```

</div>

The request can contain the following parameter:

| Field | Type | Description |
|-------|------|-------------|
| passphrase | String | (Optional) Specify a passphrase, for testing purposes. If omitted, the server will use a random number to generate the master key. Outside of testing purposes, keys should always be randomly generated. Some values, which resemble Ripple addresses and some other formats, are prohibited. |

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
| master_seed | String | The [master seed](https://ripple.com/wiki/Master_Key) from which all other information about this account is derived, in Ripple's base-58 encoded string format. |
| master_seed_hex | String | The master seed, in hex format. |
| master_key | String | The master seed, in [RFC 1751](http://tools.ietf.org/html/rfc1751) format. |
| account_id | String | The public address of the account. |
| public_key | String | The public key of the account, in encoded string format. |
| public_key_hex | String | The public key of the account, in hex format. |

The key generated by this method can also be used as a regular key for an account if you use the [SetRegularKey transaction type](https://ripple.com/wiki/index.php/API_Example_Transactions#Set_Regular_Key) to do so.

# Managing Ledgers #

The globally-shared ledger is the core of the Ripple Network. Each `rippled` server keeps a current version of the ledger, which contains all the accounts, transactions, offers, and other data in the network in an optimized tree format. As transactions and offers are proposed, each server incorporates them into its current copy of the ledger, closes it periodically, and (if configured) participates in the process of advancing the globally-validated version. After concensus is reached in the network, that ledger version is validated and becomes permanently immutable. Any transactions that were not included in one ledger become candidates to be included in the next validated version.

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
#Syntax: ledger ledger_index|ledger_hash [full]
rippled -- ledger current false
```
</div>

The request can contain the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| accounts | Boolean | (Optional, defaults to false) If true, return information on accounts in the ledger. *Admin required.* If enabled, this method returns a large amount of data, which may cause the request to fail due to a timeout, depending on the server load and capabilities. |
| transactions | Boolean | (Optional, defaults to false) If true, return information on transactions in the specified ledger version. |
| full | Boolean | (Optional, defaults to false) If true, return full information on the entire ledger. (Equivalent to enabling `transactions`, `accounts`, and `expand` *Admin required* |
| expand | Boolean | (Optional, defaults to false) Provide full JSON-formatted information for transaction/account information instead of just hashes |
| ledger_hash | String | (Optional) A 20-byte hex string identifying the ledger version to use. |
| ledger_index | (Optional) Unsigned integer, or String | (Optional, defaults to `current`) The sequence number of the ledger to use, or "current", "closed", or "validated" to select a ledger dynamically. (See Ledger Indexes.) |

The `ledger` field is deprecated and may be removed without further notice.

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
| accepted | Boolean | This designation is for internal protocol use, and should not be used. It does *not* mean the same as `validated` |
| account_hash | String | Hash of all account state information in this ledger, as hex |
| close_time | Integer | The time this ledger was closed, in seconds since the [Ripple Epoch](#specifying-time) |
| close_time_human | String | The time this ledger was closed, in human-readable format |
| close_time_resolution | Integer | Approximate number of seconds between closing one ledger version and closing the next one |
| closed | Boolean | Whether or not this ledger has been closed |
| ledger_hash | String | Unique identifying hash of the entire ledger. |
| ledger_index | String | Ledger sequence number as a quoted integer |
| parent_hash | String | Unique identifying hash of the ledger that came immediately before this one. |
| total_coins | String | Total number of XRP drops in the network, as a quoted integer. (This decreases as transaction fees cause XRP to be destroyed.) |
| transaction_hash | String | Hash of the transaction information included in this ledger, as hex |

The following fields are deprecated and may be removed without further notice: `hash`, `seqNum`, `totalCoins`.


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
#Syntax: ledger_closed
rippled -- ledger_closed
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
The `ledger_current` method returns the unique identifiers of the current in-progress ledger. This command is mostly useful for testing, because the ledger returned is still in flux.

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
#Syntax: ledger_current
rippled -- ledger_current
```
</div>

The request contains no parameters.


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
   "ledger_hash": "842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
   "command": "ledger_data",
   "limit": 5,
   "binary": true
}
```
</div>

*Note:* There is no commandline syntax for `ledger_data`.

A request can include the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | (Arbitrary) | (WebSocket only) Any identifier to separate this request from others in case the responses are delayed or out of order. |
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger-instance))|
| binary | Boolean | (Optional, defaults to False) If set to true, return data nodes as hashed hex strings instead of JSON. |
| limit | Integer | (Optional, default varies) Limit the number of nodes to retrieve. The server is not required to honor this value. |
| marker | (Not Specified) | Server-provided value to specify where to resume retrieving data from. |

The `ledger` field is deprecated and may be removed without further notice.

#### Response Format ####

An example of a successful response:
<div class='multicode'>
*WebSocket (binary:true)*
```
{
    "id": 2,
    "result": {
        "ledger_hash": "842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
        "ledger_index": "6885842",
        "marker": "0002A590029B53BE7857EFF9985F770EC792CE483720EB5E963C4D6A607D43DF",
        "state": [
            {
                "data": "11006122000000002400000001250062FEA42D0000000055C204A65CF2542946289A3358C67D991B5E135FABFA89F271DBA7A150C08CA0466240000000354540208114C909F42250CFE8F12A7A1A0DFBD3CBD20F32CD79",
                "index": "00001A2969BE1FC85F1D7A55282FA2E6D95C71D2E4B9C0FDD3D9994F3C00FF8F"
            },
            {
                "data": "11006F22000000002400000003250035788533000000000000000034000000000000000055555B93628BF3EC318892BB7C7CDCB6732FF53D12B6EEC4FAF60DD1AEE1C6101F501071633D7DE1B6AEB32F87F1A73258B13FC8CC32942D53A66D4F038D7EA4C6800064D4838D7EA4C68000000000000000000000000000425443000000000035DD7DF146893456296BF4061FBE68735D28F3286540000000000F42408114A4B8F5F7B644AEDC3447F9459C132EEB016A133B",
                "index": "000037C6659BB98F8D09F2F4CFEB27DE8EFEAFE54DD9E1C13AECDF5794B0C0F5"
            },
            {
                "data": "11006F2200020000240000000A250067395C33000000000000000034000000000000000055A160BC41A45B6BB118DF23D77E4FF23C723431B917F50DCB41319ECC2821F34C5010DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4C1AA535D3D0C00064D554C88B43EFA00000000000000000000000000055534400000000000A20B3C85F482532A9578DBB3950B85CA06594D165400000B59B9F780081148366FB9ACD2A0FD822E31112D2EB6F98C317C2C1",
                "index": "0000A8791F78CC9B39200E12A9BDAACCF40A72A512FA815525CFC9BA772990F7"
            },
            {
                "data": "1100612200000000240000000125003E742F2D0000000055286498B513710CFEB2D723A554C7557983D1952DF4DEE342C40DCB43067C9A21624000000306DC42008114225BAB89C4A4B94624BB069D6DB3C819F934991C",
                "index": "0000B717320558E2DE1A3B9FDB24E9A695BF05D1A44E4A4683212BB1DD0FBA23"
            },
            {
                "data": "110072220002000025000B65783700000000000000003800000000000000005587591A63051645F37B85D1FBA55EE69B1C96BFF16904F5C99F03FB93D42D03756280000000000000000000000000000000000000004254430000000000000000000000000000000000000000000000000166800000000000000000000000000000000000000042544300000000000A20B3C85F482532A9578DBB3950B85CA06594D167D4C38D7EA4C680000000000000000000000000004254430000000000C795FDF8A637BCAAEDAD1C434033506236C82A2D",
                "index": "000103996A3BAD918657F86E12A67D693E8FC8A814DA4B958A244B5F14D93E58"
            }
        ]
    },
    "status": "success",
    "type": "response"
}
```

*WebSocket (binary:false)*
```
{
    "id": 2,
    "result": {
        "ledger_hash": "842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
        "ledger_index": "6885842",
        "marker": "0002A590029B53BE7857EFF9985F770EC792CE483720EB5E963C4D6A607D43DF",
        "state": [
            {
                "Account": "rKKzk9ghA2iuy3imqMXUHJqdRPMtNDGf4c",
                "Balance": "893730848",
                "Flags": 0,
                "LedgerEntryType": "AccountRoot",
                "OwnerCount": 0,
                "PreviousTxnID": "C204A65CF2542946289A3358C67D991B5E135FABFA89F271DBA7A150C08CA046",
                "PreviousTxnLgrSeq": 6487716,
                "Sequence": 1,
                "index": "00001A2969BE1FC85F1D7A55282FA2E6D95C71D2E4B9C0FDD3D9994F3C00FF8F"
            },
            {
                "Account": "rGryPmNWFognBgMtr9k4quqPbbEcCrhNmD",
                "BookDirectory": "71633D7DE1B6AEB32F87F1A73258B13FC8CC32942D53A66D4F038D7EA4C68000",
                "BookNode": "0000000000000000",
                "Flags": 0,
                "LedgerEntryType": "Offer",
                "OwnerNode": "0000000000000000",
                "PreviousTxnID": "555B93628BF3EC318892BB7C7CDCB6732FF53D12B6EEC4FAF60DD1AEE1C6101F",
                "PreviousTxnLgrSeq": 3504261,
                "Sequence": 3,
                "TakerGets": "1000000",
                "TakerPays": {
                    "currency": "BTC",
                    "issuer": "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
                    "value": "1"
                },
                "index": "000037C6659BB98F8D09F2F4CFEB27DE8EFEAFE54DD9E1C13AECDF5794B0C0F5"
            },
            {
                "Account": "rUy8tW38MW9ma7kSjRgB2GHtTkQAFRyrN8",
                "BookDirectory": "DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4C1AA535D3D0C000",
                "BookNode": "0000000000000000",
                "Flags": 131072,
                "LedgerEntryType": "Offer",
                "OwnerNode": "0000000000000000",
                "PreviousTxnID": "A160BC41A45B6BB118DF23D77E4FF23C723431B917F50DCB41319ECC2821F34C",
                "PreviousTxnLgrSeq": 6764892,
                "Sequence": 10,
                "TakerGets": "780000000000",
                "TakerPays": {
                    "currency": "USD",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "value": "5850"
                },
                "index": "0000A8791F78CC9B39200E12A9BDAACCF40A72A512FA815525CFC9BA772990F7"
            },
            {
                "Account": "rh3C81VfNDhhWPQWCU8ZGgknvdgNUvRtM9",
                "Balance": "13000000000",
                "Flags": 0,
                "LedgerEntryType": "AccountRoot",
                "OwnerCount": 0,
                "PreviousTxnID": "286498B513710CFEB2D723A554C7557983D1952DF4DEE342C40DCB43067C9A21",
                "PreviousTxnLgrSeq": 4092975,
                "Sequence": 1,
                "index": "0000B717320558E2DE1A3B9FDB24E9A695BF05D1A44E4A4683212BB1DD0FBA23"
            },
            {
                "Balance": {
                    "currency": "BTC",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 131072,
                "HighLimit": {
                    "currency": "BTC",
                    "issuer": "rKUK9omZqVEnraCipKNFb5q4tuNTeqEDZS",
                    "value": "10"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "BTC",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "value": "0"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "87591A63051645F37B85D1FBA55EE69B1C96BFF16904F5C99F03FB93D42D0375",
                "PreviousTxnLgrSeq": 746872,
                "index": "000103996A3BAD918657F86E12A67D693E8FC8A814DA4B958A244B5F14D93E58"
            }
        ]
    },
    "status": "success",
    "type": "response"
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| ledger_index | Unsigned Integer | Sequence number of this ledger |
| ledger_hash | String | Unique identifying hash of the entire ledger. |
| state | Array | Array of JSON objects containing data from the tree, as defined below |
| marker | (Not Specified) | Server-defined value. Pass this to the next call in order to resume where this call left off. |

The format of each object in the `state` array depends on whether `binary` was set to true or not in the request. Each `state` object may include the following fields:

| Field | Type | Description |
|-------|------|-------------|
| data | String | (Only included if `"binary":true`) Hex representation of the requested data |
| LedgerEntryType | String | (Only included if `"binary":false`) String indicating what type of object this is. See [LedgerEntryType](https://ripple.com/wiki/Ledger_Format#Entries) |
| (Additional fields) | (Various) | (Only included if `"binary":false`) Additional fields describing this object, depending on which LedgerEntryType it is. |
| index | String | Unique identifier for this ledger entry, as hex. |


## ledger_entry ##
The `ledger_entry` method returns a single entry from the specified ledger. See [LedgerEntryType](https://ripple.com/wiki/Ledger_Format#Entries) for information on the different types of objects you can retrieve. *Note:* There is no commandline version of this method. You can use the [`json`](#json) command to access this method from the commandline instead.

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

This method can retrieve several different types of data. You can select which type of item to retrieve by passing the appropriate parameters. Specifically, you should provide exactly one of the following fields:

1. `index` - Retrieve an individual ledger entry by its unique index
2. `account_root` - Retrieve an account node, similar to the [account_info](#account-info) command
3. `directory` - Retrieve a directory node, which contains a list of IDs linking things
4. `offer` - Retrieve an offer node, which defines an offer to exchange currency
5. `ripple_state` - Retrieve a RippleState node, which defines currency (IOU) balances and credit limits between accounts

If you specify more than one of the above items, the server will retrieve only of them; it is undefined which one will be chosen.

The full list of parameters recognized by this method is as follows:

| Field | Type | Description |
|-------|------|-------------|
| index | String | (Optional) Specify the unique identifier of a single ledger entry to retrieve. |
| account_root | String | (Optional) Specify the unique address of an account object to retrieve. |
| directory | Object or String | (Optional) Specify a directory node to retrieve from the tree. (Directory nodes each contain a list of IDs for things contained in them.) If a string, interpret as the unique key to the directory, in hex. If an object, requires either `dir_root` or `owner` as a sub-field, plus optionally a `sub_index` sub-field. |
| directory.sub_index | Unsigned Integer | (Optional) If provided, jumps to a further sub-node in the directory linked-list. |
| directory.dir_root | String | (Required if `directory` is specified as an object and `directory.owner` is not provided) Unique index identifying the directory to retrieve, as a hex string. |
| directory.owner | String | (Required if `directory` is specified as an object and `directory.dir_root` is not provided) Unique address of the account associated with this directory |
| offer | Object or String | (Optional) Specify an offer to retrieve. If a string, interpret as a 256-key hex hash. If an object, requires the sub-fields `account` and `seq` to uniquely identify the offer. |
| offer.account | String | (Required if `offer` specified) The unique address of the account making the offer to retrieve. |
| offer.seq | Unsigned Integer | (Required if `offer` specified) The sequence number of the transaction making the offer to retrieve. |
| ripple_state | Object | (Optional) Object specifying the RippleState entry to retrieve. The `accounts` and `currency` sub-fields are required to uniquely specify the RippleState entry to retrieve. |
| ripple_state.accounts | Array | (Required if `ripple_state` specified) 2-length array of account address strings, defining the two accounts linked by this RippleState entry |
| ripple_state.currency | String | (Required if `ripple_state` specified) String representation of a currency that this RippleState entry relates to, as either a 3-letter currency code or a 40-character hex code |
| binary | Boolean | (Optional, defaults to false) If true, return hashed data as hex strings. Otherwise, return data in JSON format. |

The `generator` parameter is deprecated and may be removed without further notice.

#### Response Format ####

An example of a successful response:
<div class='multicode'>
*WebSocket*
```{
    "id": 3,
    "result": {
        "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05",
        "ledger_index": 6889347,
        "node": {
            "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "Balance": "27389517749",
            "Flags": 0,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 18,
            "PreviousTxnID": "B6B410172C0B65575D89E464AF5B99937CC568822929ABF87DA75CBD11911932",
            "PreviousTxnLgrSeq": 6592159,
            "Sequence": 1400,
            "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
        }
    },
    "status": "success",
    "type": "response"
}```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| index | String | Unique identifying key for this ledger_entry |
| ledger_index | Unsigned Integer | Unique sequence number of the ledger from which this data was retrieved |
| node | Object | (`"binary":false` only) Object containing the data of this ledger node; the exact contents vary depending on the [LedgerEntryType](https://ripple.com/wiki/Ledger_Format#Entries) of node retrieved. |
| node_binary | String | (`"binary":true` only) Binary data of the ledger node retrieved, as hex. |


# Managing Transactions #

Transactions are the only thing that can modify the shared global ledger of the Ripple Network. All business on the Ripple Network takes the form of transactions, which include not only payments, but also currency-exchange offers, account settings, and changes to the properties of the network itself (like adopting new features).

There are several sources of complication in transactions. Unlike traditional banking, where a trusted third party (the bank, or the [ACH](http://en.wikipedia.org/wiki/Automated_Clearing_House)) verifies the participants' identities and ensures their balances are adjusted accurately, Ripple uses cryptography and decentralized computing power to accomplish the same thing. Sending XRP, the Ripple Network's native crypto-currency, requires no third party aside from the distributed network itself. However, that is missing out on the key feature of Ripple: unlike individual crypto-currencies, the Ripple Network natively supports balances in any currency. This brings far more power, but it also means that the system must account for [counterparty risk](http://en.wikipedia.org/wiki/Counterparty_risk#Counterparty_risk), currency conversions, and other issues. The Ripple Network must be robust to keep track of which transactions have been completely validated, even when subject to hardware failures, attacks, or natural disasters.

## tx ##

The `tx` method retrieves information on a single transaction. 

#### Request Format ####

An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
  "id": 1,
  "command": "tx",
  "transaction": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
  "binary": false
}
```
*JSON-RPC*
```
{
    "method": "tx",
    "params": [
        {
            "transaction": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
            "binary": false
        }
    ]
}
```
*Commandline*
```
#Syntax: tx transaction [binary]
tx E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7 false
```
</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| transaction | String | The 256-bit hash of the transaction, as hex. |
| binary | Boolean | (Optional, defaults to false) If true, return transaction data and metadata as hex strings instead of JSON |

#### Response Format ####

An example of a successful response:
<div class='multicode'>
*WebSocket*
```
{
    "id": 1,
    "result": {
        "Account": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
        "Amount": {
            "currency": "USD",
            "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "value": "1"
        },
        "Destination": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "Fee": "10",
        "Flags": 0,
        "Paths": [
            [
                {
                    "account": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                    "currency": "USD",
                    "issuer": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                    "type": 49,
                    "type_hex": "0000000000000031"
                }
            ],
            [
                {
                    "account": "rD1jovjQeEpvaDwn9wKaYokkXXrqo4D23x",
                    "currency": "USD",
                    "issuer": "rD1jovjQeEpvaDwn9wKaYokkXXrqo4D23x",
                    "type": 49,
                    "type_hex": "0000000000000031"
                },
                {
                    "account": "rB5TihdPbKgMrkFqrqUC3yLdE8hhv4BdeY",
                    "currency": "USD",
                    "issuer": "rB5TihdPbKgMrkFqrqUC3yLdE8hhv4BdeY",
                    "type": 49,
                    "type_hex": "0000000000000031"
                },
                {
                    "account": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                    "currency": "USD",
                    "issuer": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                    "type": 49,
                    "type_hex": "0000000000000031"
                }
            ]
        ],
        "SendMax": {
            "currency": "USD",
            "issuer": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
            "value": "1.01"
        },
        "Sequence": 88,
        "SigningPubKey": "02EAE5DAB54DD8E1C49641D848D5B97D1B29149106174322EDF98A1B2CCE5D7F8E",
        "TransactionType": "Payment",
        "TxnSignature": "30440220791B6A3E036ECEFFE99E8D4957564E8C84D1548C8C3E80A87ED1AA646ECCFB16022037C5CAC97E34E3021EBB426479F2ACF3ACA75DB91DCC48D1BCFB4CF547CFEAA0",
        "hash": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
        "inLedger": 348734,
        "ledger_index": 348734,
        "meta": {
            "AffectedNodes": [
                {
                    "ModifiedNode": {
                        "FinalFields": {
                            "Account": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
                            "Balance": "59328999119",
                            "Flags": 0,
                            "OwnerCount": 11,
                            "Sequence": 89
                        },
                        "LedgerEntryType": "AccountRoot",
                        "LedgerIndex": "E0D7BDE68B468FF0B8D948FD865576517DA987569833A05374ADB9A72E870A06",
                        "PreviousFields": {
                            "Balance": "59328999129",
                            "Sequence": 88
                        },
                        "PreviousTxnID": "C26AA6B4F7C3B9F55E17CD0D11F12032A1C7AD2757229FFD277C9447A8815E6E",
                        "PreviousTxnLgrSeq": 348700
                    }
                },
                {
                    "ModifiedNode": {
                        "FinalFields": {
                            "Balance": {
                                "currency": "USD",
                                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                                "value": "-1"
                            },
                            "Flags": 131072,
                            "HighLimit": {
                                "currency": "USD",
                                "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                                "value": "100"
                            },
                            "HighNode": "0000000000000000",
                            "LowLimit": {
                                "currency": "USD",
                                "issuer": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
                                "value": "0"
                            },
                            "LowNode": "0000000000000000"
                        },
                        "LedgerEntryType": "RippleState",
                        "LedgerIndex": "EA4BF03B4700123CDFFB6EB09DC1D6E28D5CEB7F680FB00FC24BC1C3BB2DB959",
                        "PreviousFields": {
                            "Balance": {
                                "currency": "USD",
                                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                                "value": "0"
                            }
                        },
                        "PreviousTxnID": "53354D84BAE8FDFC3F4DA879D984D24B929E7FEB9100D2AD9EFCD2E126BCCDC8",
                        "PreviousTxnLgrSeq": 343570
                    }
                }
            ],
            "TransactionIndex": 0,
            "TransactionResult": "tesSUCCESS"
        },
        "validated": true
    },
    "status": "success",
    "type": "response"
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing the fields of the [Transaction object](https://ripple.com/wiki/Transaction_Format) as well as the following additional fields:

| Field | Type | Description |
|-------|------|-------------|
| hash | String | The SHA-512 hash of the transaction |
| inLedger | Unsigned Integer | (Deprecated) Alias for `ledger_index`. |
| ledger_index | Unsigned Integer | The sequence number of the ledger that includes this transaction. |
| meta | Object | Various metadata about the transaction. |
| validated | Boolean | True if this data is from a validated ledger version; if omitted or set to false, this data is not final. |
| (Various) | (Various) | Other fields from the [Transaction object](https://ripple.com/wiki/Transaction_Format) |

*Note:* If the transaction was not found, it means that the rippled server could not find it from the ledger versions on hand. However, that does not mean that the transaction does not exist; it may simply have been included in an older ledger version that the `rippled` does not have on hand anymore.

## transaction_entry ##

The `transaction_entry` method retrieves information on a single transaction from a specific ledger version. (The [`tx`](#tx) command, by contrast, searches all ledgers for the specified transaction. We recommend using that method instead.) 

#### Request Format ####

An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
  "id": 4,
  "command": "transaction_entry",
  "tx_hash": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
  "ledger_index": 348734
}
```
*JSON-RPC*
```
{
    "method": "transaction_entry",
    "params": [
        {
            "tx_hash": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
            "ledger_index": 348734
        }
    ]
}
```
*Commandline*
```
#Syntax: transaction_entry transaction_hash ledger_index|ledger_hash
rippled -- transaction_entry E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7 348734
```
</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| tx_hash | String | Unique hash of the transaction you are looking up |

*Note:* This method does not support retrieving information from the current in-progress ledger. You must specify a ledger version in either `ledger_index` or `ledger_hash`. 

#### Response Format ####

An example of a successful response:
<div class='multicode'>
*WebSocket*
```
{
    "id": 4,
    "result": {
        "ledger_index": 348734,
        "metadata": {
            "AffectedNodes": [
                {
                    "ModifiedNode": {
                        "FinalFields": {
                            "Account": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
                            "Balance": "59328999119",
                            "Flags": 0,
                            "OwnerCount": 11,
                            "Sequence": 89
                        },
                        "LedgerEntryType": "AccountRoot",
                        "LedgerIndex": "E0D7BDE68B468FF0B8D948FD865576517DA987569833A05374ADB9A72E870A06",
                        "PreviousFields": {
                            "Balance": "59328999129",
                            "Sequence": 88
                        },
                        "PreviousTxnID": "C26AA6B4F7C3B9F55E17CD0D11F12032A1C7AD2757229FFD277C9447A8815E6E",
                        "PreviousTxnLgrSeq": 348700
                    }
                },
                {
                    "ModifiedNode": {
                        "FinalFields": {
                            "Balance": {
                                "currency": "USD",
                                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                                "value": "-1"
                            },
                            "Flags": 131072,
                            "HighLimit": {
                                "currency": "USD",
                                "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                                "value": "100"
                            },
                            "HighNode": "0000000000000000",
                            "LowLimit": {
                                "currency": "USD",
                                "issuer": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
                                "value": "0"
                            },
                            "LowNode": "0000000000000000"
                        },
                        "LedgerEntryType": "RippleState",
                        "LedgerIndex": "EA4BF03B4700123CDFFB6EB09DC1D6E28D5CEB7F680FB00FC24BC1C3BB2DB959",
                        "PreviousFields": {
                            "Balance": {
                                "currency": "USD",
                                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                                "value": "0"
                            }
                        },
                        "PreviousTxnID": "53354D84BAE8FDFC3F4DA879D984D24B929E7FEB9100D2AD9EFCD2E126BCCDC8",
                        "PreviousTxnLgrSeq": 343570
                    }
                }
            ],
            "TransactionIndex": 0,
            "TransactionResult": "tesSUCCESS"
        },
        "tx_json": {
            "Account": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
            "Amount": {
                "currency": "USD",
                "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                "value": "1"
            },
            "Destination": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "Fee": "10",
            "Flags": 0,
            "Paths": [
                [
                    {
                        "account": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                        "currency": "USD",
                        "issuer": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                        "type": 49,
                        "type_hex": "0000000000000031"
                    }
                ],
                [
                    {
                        "account": "rD1jovjQeEpvaDwn9wKaYokkXXrqo4D23x",
                        "currency": "USD",
                        "issuer": "rD1jovjQeEpvaDwn9wKaYokkXXrqo4D23x",
                        "type": 49,
                        "type_hex": "0000000000000031"
                    },
                    {
                        "account": "rB5TihdPbKgMrkFqrqUC3yLdE8hhv4BdeY",
                        "currency": "USD",
                        "issuer": "rB5TihdPbKgMrkFqrqUC3yLdE8hhv4BdeY",
                        "type": 49,
                        "type_hex": "0000000000000031"
                    },
                    {
                        "account": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                        "currency": "USD",
                        "issuer": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                        "type": 49,
                        "type_hex": "0000000000000031"
                    }
                ]
            ],
            "SendMax": {
                "currency": "USD",
                "issuer": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
                "value": "1.01"
            },
            "Sequence": 88,
            "SigningPubKey": "02EAE5DAB54DD8E1C49641D848D5B97D1B29149106174322EDF98A1B2CCE5D7F8E",
            "TransactionType": "Payment",
            "TxnSignature": "30440220791B6A3E036ECEFFE99E8D4957564E8C84D1548C8C3E80A87ED1AA646ECCFB16022037C5CAC97E34E3021EBB426479F2ACF3ACA75DB91DCC48D1BCFB4CF547CFEAA0",
            "hash": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
            "inLedger": 348734,
            "ledger_index": 348734
        }
    },
    "status": "success",
    "type": "response"
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| ledger_index | Unsigned Integer | Sequence number of the ledger version the transaction was found in; this is the same as the one from the request. |
| ledger_hash | String | (May be omitted) Unique hash of the ledger version the transaction was found in; this is the same as the one from the request. |
| metadata | Object | Various metadata about the transaction. |
| tx_json | Object | JSON representation of the [Transaction object](https://ripple.com/wiki/Transaction_Format) |

There are a couple possible reasons the server may fail to find the transaction:

* The transaction just does not exist
* The transaction exists, but not in the specified ledger version
* The server does not have the specified ledger version available. Another server that has the correct version on hand may have a different response.

## tx_history ##

The `tx_history` method retrieves a selection of the most recent transactions made.

*Caution:* This method is deprecated, and may be removed without further notice.

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
  "id": 5,
  "command": "tx_history",
  "start": 0
}

```

*Commandline*
```
#Syntax: tx_history [start]
rippled -- tx_history 0
```
</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| start | Unsigned Integer | Number of transactions to skip over. |

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
    "index": 0,
    "txs": [
      {
        "Account": "r9bf8V4ae5xReYnKPXgnwERDFPoW34FhGy",
        "Fee": "12",
        "Flags": 2147483648,
        "LastLedgerSequence": 6907169,
        "Sequence": 3276,
        "SigningPubKey": "03B7857216DF96BABCC839686670A67602B3EE50D0F12B41C15F73760B8ED394C1",
        "TransactionType": "AccountSet",
        "TxnSignature": "3045022100CC0A2688DC36DC47BDBD5A571407316DD16A6CB3289E60C9589531707D30EBDB022010A2ED1F8562FEF61461B89E90E9D7245F5DD1AAE6680401A60F7FDA60184312",
        "hash": "30FF69D2F2C2FF517A82EC8BA62AA4879E27A6EAF2C9B4AA422B77C23CD11B35",
        "inLedger": 6907162,
        "ledger_index": 6907162
      },
      {
        "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
        "Fee": "15",
        "Flags": 0,
        "Sequence": 1479735,
        "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
        "TakerGets": "9999999999",
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "48.050907917"
        },
        "TransactionType": "OfferCreate",
        "TxnSignature": "3045022100C110F47609CED085E0C184396877685ACAFF0A5846C859E9A57A8E238788FAE2022042A578D36F3D911E2536A39D74B10A741EF4C77B40738DB66E9E4FA85B797DF2",
        "hash": "A5DE72E2E97CB0FA548713FB7C8542FD1A9723EC556D386F13B25F052435B29F",
        "inLedger": 6907162,
        "ledger_index": 6907162
      },
      {
        "Account": "r9bf8V4ae5xReYnKPXgnwERDFPoW34FhGy",
        "Fee": "12",
        "Flags": 2147483648,
        "LastLedgerSequence": 6907169,
        "Sequence": 3275,
        "SigningPubKey": "03B7857216DF96BABCC839686670A67602B3EE50D0F12B41C15F73760B8ED394C1",
        "TransactionType": "AccountSet",
        "TxnSignature": "3044022030E4CCDCBA8D9984C16AD9807D0FE654D4C558C08728B33A6D9F4D05DA811CF102202A6B53015583A6C24054EE93D9B9DDF0D17133676848304BBA5156DD2C2875BE",
        "hash": "55DFC8F7EF3976B5968DC462D91B29274E8097C35D43D6B3740AB20584336A9C",
        "inLedger": 6907162,
        "ledger_index": 6907162
      },
      {
        "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
        "Fee": "15",
        "Flags": 131072,
        "Sequence": 1479734,
        "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
        "TakerGets": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.009194668"
        },
        "TakerPays": "1073380944",
        "TransactionType": "OfferCreate",
        "TxnSignature": "304402202C0D26EABE058FCE8B6862EF5CAB70674637CE32B1B4E2F3551B9D5A2E1CDC7E02202C191D2697C65478BC2C1489721EB5799A6F3D4A1ECD8FE87A0C4FDCA3704A03",
        "hash": "2499BAE9947BE731D7FE2F8E7B6A55E1E5B43BA8D3A9F22E39F79A0CC027A1C8",
        "inLedger": 6907161,
        "ledger_index": 6907161
      },
      {
        "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
        "Fee": "15",
        "Flags": 131072,
        "Sequence": 1479733,
        "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
        "TakerGets": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "5.298037873"
        },
        "TakerPays": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.008937558999999999"
        },
        "TransactionType": "OfferCreate",
        "TxnSignature": "3044022075EF6054ABD08F9B8287314AD4904944A74A6C3BBED9D035BCE7D409FC46E49E022025CFEE7F72BEC1F87EA83E3565CB653643A57CDD13661798D6B70F47AF63FDB6",
        "hash": "F873CB065791DDD503580931A500BB896B9DBAFC9C285C1159B884354F3EF48B",
        "inLedger": 6907161,
        "ledger_index": 6907161
      },
      {
        "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
        "Fee": "15",
        "Flags": 0,
        "OfferSequence": 1479726,
        "Sequence": 1479732,
        "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
        "TransactionType": "OfferCancel",
        "TxnSignature": "3045022100E82B813DA3896051EAAA3D53E197F8F426DF4E51F07A2AB83E43B10CD4008D8402204D93BABA74E63E775D44D77F4F9B07D69B0C86930F2865BBBBD2DC956FA8AE4E",
        "hash": "203613CFA3CB7BFBCFABBBCF80D932DFBBFDECCBB869CCDBE756EAA4C8EEA41D",
        "inLedger": 6907161,
        "ledger_index": 6907161
      },
      {
        "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
        "Fee": "15",
        "Flags": 0,
        "OfferSequence": 1479725,
        "Sequence": 1479731,
        "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
        "TransactionType": "OfferCancel",
        "TxnSignature": "30440220678FF2E754A879EAE72207F191614BBA01B8088CD174AF509E9AA11448798CD502205B326E187A0530E4E90BDD1ED875492836657E4D593FBD655F64604178693D2F",
        "hash": "1CF4D0D583F6FC85BFD15A0BEF5E4779A8ACAD0DE43823F07C9CC2A20E29E422",
        "inLedger": 6907161,
        "ledger_index": 6907161
      },
      {
        "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
        "Fee": "15",
        "Flags": 0,
        "OfferSequence": 1479724,
        "Sequence": 1479730,
        "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
        "TransactionType": "OfferCancel",
        "TxnSignature": "3045022100A5533E81A67B6A88B674864E898FDF31D83787FECE496544EBEE88E6FC220500022002438599B2A0E4F70C2B46FB049CD339F76E466399CA4A8F72C4ADA03F615D90",
        "hash": "D96EC06F2ADF3CF7ED59BD76B8F1BDB127CDE46B45977B477703DB05B8DF5208",
        "inLedger": 6907161,
        "ledger_index": 6907161
      },
      {
        "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
        "Fee": "15",
        "Flags": 0,
        "OfferSequence": 1479723,
        "Sequence": 1479729,
        "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
        "TransactionType": "OfferCancel",
        "TxnSignature": "304402206DEF8C70103AE45BCED6762B238E6F155A57D46300E8FF0A1CD0197362483CAE022007BBDFD93A0BC2473EE4537B44095D1BB5EB83F76661A14230FB3B27C4EABB6D",
        "hash": "089D22F601FB52D0E55A8E27D393F05570DC24E92028BB9D9DCAD7BC3337ADF9",
        "inLedger": 6907161,
        "ledger_index": 6907161
      },
      {
        "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
        "Fee": "15",
        "Flags": 0,
        "OfferSequence": 1479722,
        "Sequence": 1479728,
        "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
        "TransactionType": "OfferCancel",
        "TxnSignature": "3044022065051B7240DE1D46865453B3D7F8FC59FB2B9FD609196AB394F857B75E2B8409022044683F3A35740FC97655A8A4516184D8C582E5D88CA360301B1AD308F4126763",
        "hash": "F6A660EF99E32D02B9AF761B14993CA1ED8BAF3507F580D90A7759ABFAF0284E",
        "inLedger": 6907161,
        "ledger_index": 6907161
      },
      {
        "Account": "rUBLCjWdsPPMkppdFXVJWhHnr3FNqCzgG3",
        "Fee": "15",
        "Flags": 0,
        "LastLedgerSequence": 6907168,
        "Sequence": 173286,
        "SigningPubKey": "03D606359EEA9C0A49CA9EF55F6AED6C8AEDDE604223C1BE51A2D0460A725CF173",
        "TakerGets": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.44942631"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "260"
        },
        "TransactionType": "OfferCreate",
        "TxnSignature": "304502205395AF4127AD0B890AC9C47F765B4F4046C70C3DFC6F8DCD2729552FAA97F13C022100C8C2DBA6A466D76D0F103AC88DB166D1EC7F6339238E2C4245C2C26308B38058",
        "hash": "F20F06F36B5FEFF43DD1E8AEDBE9A0ECEF0CE41402AE6F0FE4BEE1F2F82A4D54",
        "inLedger": 6907161,
        "ledger_index": 6907161
      },
      {
        "Account": "rDVynssGDojUPpM4abx9rxYeHG4HiLGxC",
        "Fee": "15",
        "Flags": 2147483648,
        "LastLedgerSequence": 6907169,
        "OfferSequence": 859,
        "Sequence": 860,
        "SigningPubKey": "02C37DA8D793142BD190CE13BB697521A89D1DC318A045816EE657F42527EBFC4E",
        "TakerGets": "19871628459",
        "TakerPays": {
          "currency": "BTC",
          "issuer": "rfYv1TXnwgDDK4WQNbFALykYuEBnrR4pDX",
          "value": "0.166766470665369"
        },
        "TransactionType": "OfferCreate",
        "TxnSignature": "3044022074737D253A0DB39DBB6C63E5BD522C1313CC57658B0A567E1F1DD3414DA3817502201F333D81F29845C53A0271D0C5B005DEE4A250529DAD1A880838E242D358EE35",
        "hash": "AD197326AEF75AA466F32FEA87358C9FB587F1C1ABF41C73E2C3EFDD83B6F33B",
        "inLedger": 6907161,
        "ledger_index": 6907161
      },
      {
        "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
        "Fee": "15",
        "Flags": 0,
        "OfferSequence": 1479721,
        "Sequence": 1479727,
        "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
        "TransactionType": "OfferCancel",
        "TxnSignature": "3045022100CCD7336F78291E1BCAA4F86695119175E0DBC26281B2F13B30A24C726419DFCA022062547E0A4894CEAE87C42CABA94E0731134560F07D8860AE62F4A87AFD16BC43",
        "hash": "20353EA4152C32E63941DE2F3175BA69657BA9FAB39D22BCE38B6CA1B3734D4B",
        "inLedger": 6907161,
        "ledger_index": 6907161
      },
      {
        "Account": "r9bf8V4ae5xReYnKPXgnwERDFPoW34FhGy",
        "Fee": "12",
        "Flags": 2147483648,
        "LastLedgerSequence": 6907168,
        "Sequence": 3274,
        "SigningPubKey": "03B7857216DF96BABCC839686670A67602B3EE50D0F12B41C15F73760B8ED394C1",
        "TransactionType": "AccountSet",
        "TxnSignature": "3045022100F8412BBB1DB830F314F7400E99570A9F92668ACCDEA6096144A47EDF98E18D5D02204AD89122224F353155EACC30F80BA214350968F744A480B4CD5A3174B473D6AF",
        "hash": "16F266ABCC617CF906A25AA83BDDAD2577125E6A692A36543934AA0F0C3B77C0",
        "inLedger": 6907161,
        "ledger_index": 6907161
      },
      {
        "Account": "r9bf8V4ae5xReYnKPXgnwERDFPoW34FhGy",
        "Fee": "12",
        "Flags": 2147483648,
        "LastLedgerSequence": 6907167,
        "Sequence": 3273,
        "SigningPubKey": "03B7857216DF96BABCC839686670A67602B3EE50D0F12B41C15F73760B8ED394C1",
        "TakerGets": "5397",
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.00002593363079073453"
        },
        "TransactionType": "OfferCreate",
        "TxnSignature": "3044022061685E23375A299747DE45DA302966C6AF8C07D2DA9BEBB4F5572E3B02C6564D02207187E626EC817EFAFFAD002E75FC16E17A5BD54DA41D4E339F3C2A9F86FFD523",
        "hash": "C9112B7C246FC8A9B377BD762F1D64F0DCA1128D55254A442E5735935A09D83E",
        "inLedger": 6907160,
        "ledger_index": 6907160
      },
      {
        "Account": "rBHMbioz9znTCqgjZ6Nx43uWY43kToEPa9",
        "Amount": {
          "currency": "USD",
          "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
          "value": "4"
        },
        "Destination": "r4X3WWZ3UZMDw3Z7T32FXK2NAaiitSWZ9c",
        "Fee": "12",
        "Flags": 0,
        "LastLedgerSequence": 6907168,
        "Paths": [
          [
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "XRP",
              "type": 16,
              "type_hex": "0000000000000010"
            },
            {
              "currency": "USD",
              "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ],
          [
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "USD",
              "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ],
          [
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "XRP",
              "type": 16,
              "type_hex": "0000000000000010"
            },
            {
              "currency": "USD",
              "issuer": "rwmUaXsWtXU4Z843xSYwgt1is97bgY8yj6",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rwmUaXsWtXU4Z843xSYwgt1is97bgY8yj6",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ],
          [
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "XRP",
              "type": 16,
              "type_hex": "0000000000000010"
            },
            {
              "currency": "USD",
              "issuer": "rfsEoNBUBbvkf4jPcFe2u9CyaQagLVHGfP",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rfsEoNBUBbvkf4jPcFe2u9CyaQagLVHGfP",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ]
        ],
        "SendMax": {
          "currency": "USD",
          "issuer": "rBHMbioz9znTCqgjZ6Nx43uWY43kToEPa9",
          "value": "4.132649022"
        },
        "Sequence": 4660,
        "SigningPubKey": "03DFEFC9A95AEF55232A2B89867745CE45373F5CE23C34D51D21343CEA92BD61AD",
        "TransactionType": "Payment",
        "TxnSignature": "30450220636E405B96C998BF5EBB665D519FA8B4431A6CB5962F754EEDD48EBE95F8C45F02210097851E297FEDA44F7DFED844AE109CF2D968BD58CD3C0E951B435278A91002FA",
        "hash": "5007E8ECAE64482D258E915FFDEFAF2FE35ED9520BA7BB424BE280691F997435",
        "inLedger": 6907160,
        "ledger_index": 6907160
      },
      {
        "Account": "rfESTMcbvbvCBqU1FTvGWiJP8cmUSu4GKg",
        "Amount": {
          "currency": "BTC",
          "issuer": "rTJdjjQ5wWAMh8TL1ToXXD2mZzesa6DSX",
          "value": "0.0998"
        },
        "Destination": "r3AWbdp2jQLXLywJypdoNwVSvr81xs3uhn",
        "Fee": "10",
        "Flags": 2147483648,
        "InvoiceID": "A98FD36C17BE2B8511AD36DC335478E7E89F06262949F36EB88E2D683BBCC50A",
        "SendMax": {
          "currency": "BTC",
          "issuer": "rTJdjjQ5wWAMh8TL1ToXXD2mZzesa6DSX",
          "value": "0.100798"
        },
        "Sequence": 18697,
        "SigningPubKey": "025D9E40A50D78347EB8AFF7A36222BBE173CB9D06E68D109D189FF8616FC21107",
        "TransactionType": "Payment",
        "TxnSignature": "3044022007AA39E0117963ABF03BAEF0C5AB45862093525344362D34B9F6BA8373A0C9DC02206AB4FE915F4CBDA84E668F7F21A9914DC95C83A72FB3F9A114B10D4ECB697A25",
        "hash": "C738A5095DCE3A256C843AA48BB26F0339EAD3FF09B6D75C2EF50C4AD4B4D17C",
        "inLedger": 6907159,
        "ledger_index": 6907159
      },
      {
        "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
        "Fee": "15",
        "Flags": 0,
        "Sequence": 1479726,
        "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
        "TakerGets": "37284087",
        "TakerPays": {
          "currency": "NZD",
          "issuer": "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc",
          "value": "0.291570426"
        },
        "TransactionType": "OfferCreate",
        "TxnSignature": "3045022100F246F043C97C0DA7947793E9390DBA5AB0C6EB4A0165DADF0E96C939B70D113C0220797F572368EF68490813663C0E2ACF03424CB73B64F3D6C8508C7E8F6D2CC767",
        "hash": "CAE39A38C222DF0BBC9AA25D30320220DC216646CE0A447F330BE279B20BD008",
        "inLedger": 6907159,
        "ledger_index": 6907159
      },
      {
        "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
        "Fee": "15",
        "Flags": 0,
        "Sequence": 1479725,
        "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
        "TakerGets": "10000000000",
        "TakerPays": {
          "currency": "BTC",
          "issuer": "ra9eZxMbJrUcgV8ui7aPc161FgrqWScQxV",
          "value": "0.091183099"
        },
        "TransactionType": "OfferCreate",
        "TxnSignature": "30440220376E6D149435B87CA761ED1A9BD205BA93C0C30D6EB1FB26D8B5D06A55977F510220213E882DD43BC78C96B51E43273D9BD451F8337DDF6960CBFB9802A347FF18E4",
        "hash": "CC07A503ED60F14AF023AB839C726B73591DE5C986D1234671E2518D8F840E12",
        "inLedger": 6907159,
        "ledger_index": 6907159
      },
      {
        "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
        "Fee": "15",
        "Flags": 0,
        "Sequence": 1479724,
        "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
        "TakerGets": "9094329166",
        "TakerPays": {
          "currency": "XAG",
          "issuer": "r9Dr5xwkeLegBeXq6ujinjSBLQzQ1zQGjH",
          "value": "3.022830117"
        },
        "TransactionType": "OfferCreate",
        "TxnSignature": "3045022100CFD63762B3809B37B6A1294C4B4C8DA39023D66893045BA4AA9767DD8570A8F9022005F42B08E94190637158E80DAE99F3FB104EC2AA30F69BBA3417E5BBCDB5DB77",
        "hash": "64029D736C34D21CDB100D976A06A988E2CA6E3BBC0DDFCE840D9619B853B47C",
        "inLedger": 6907159,
        "ledger_index": 6907159
      }
    ]
  }
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| index | Unsigned Integer | The value of `start` used in the request. |
| txs | Array | Array of transaction objects. |

The fields included in each transaction object vary slightly depending on the type of transaction. See [Transaction Format](https://ripple.com/wiki/Transaction_Format) for details.

## path_find ##

*WebSocket API only!* The `path_find` method searches for a path along which a transaction can possibly be made, and periodically sends updates when the path changes over time. For a simpler version that is supported by JSON-RPC, see [`ripple_path_find`](#ripple-path-find). For payments occurring strictly in XRP, it is not necessary to find a path, because XRP can be sent directly to any account. 

There are three different modes, or sub-commands, of the path_find command. Specify which one you want with the `subcommand` parameter:

* `create` - Start sending pathfinding information 
* `close` - Stop sending pathfinding information
* `status` - Get the information of the currently-open pathfinding request

Although the `rippled` server attempts to find the cheapest path or combination of paths for making a payment, it is not guaranteed that the paths returned by this method are, in fact, the best paths. Due to server load, pathfinding may not find the best results. Additionally, you should be careful with the pathfinding results from untrusted servers. A server could be modified to return less-than-optimal paths in order to earn money for its operators. If you do not have your own server that you can trust with pathfinding, you should compare the results of pathfinding from multiple servers operated by different parties, to minimize the risk of a single server returning poor results. (*Note:* A server returning less-than-optimal results is not necessarily proof of malicious behavior; it could also be a symptom of heavy server load.)

### path_find create ###

The `create` subcommand of `path_find` creates an ongoing request to find possible paths along which a payment transaction could be made from one specified account such that another account receives a desired amount of some currency. The initial response contains a suggested path between the two addresses that would result in the desired amount being received. After that, the server sends additional messages, with `"type": "path_find"`, with updates to the potential paths. The frequency of updates is left to the discretion of the server, but it usually means once every few seconds when there is a new ledger version.

A client can only have one pathfinding request open at a time. If another pathfinding request is already open on the same connection, the old request is automatically closed and replaced with the new request.

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
    "id": 8,
    "command": "path_find",
    "subcommand": "create",
    "source_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "destination_amount": {
        "value": "0.001",
        "currency": "USD",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    }
}
```
</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| subcommand | String | Use `"create"` to send the create subcommand |
| source_account | String | Unique address of the account to find a path from. (In other words, the account that would be sending a payment.) |
| destination_account | String | Unique address of the account to find a path to. (In other words, the account that would receive a payment.) |
| destination_amount | String (XRP)<br/>Object (Otherwise) | The amount of currency that needs to arrive at the destination. (See [Specifying Currency Amounts](#specifying-currency-amounts). Set the issuer to the destination account's address to use any issuer the destination accepts.) |
| paths | Array | (Optional) Array of arrays of objects, representing paths to confirm. You can use this to keep updated on changes to particular paths you already know about, or to check the overall cost to make a payment along a certain path. |

The server also recognizes the following fields, but the results of using them are not guaranteed: `source_currencies`, `bridges`. These fields should be considered reserved for future use.

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
    "alternatives": [
      {
        "paths_computed": [
          [
            {
              "currency": "USD",
              "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ],
          [
            {
              "currency": "USD",
              "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ],
          [
            {
              "currency": "USD",
              "issuer": "r9vbV3EHvXWjSkeQ6CAcYVPGeq7TuiXY2X",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "r9vbV3EHvXWjSkeQ6CAcYVPGeq7TuiXY2X",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ],
          [
            {
              "currency": "USD",
              "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ]
        ],
        "source_amount": "251686"
      },
      {
        "paths_computed": [
          [
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "USD",
              "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ],
          [
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "USD",
              "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ],
          [
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "USD",
              "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ]
        ],
        "source_amount": {
          "currency": "BTC",
          "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
          "value": "0.000001541291269274307"
        }
      },
      {
        "paths_computed": [
          [
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "USD",
              "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ]
        ],
        "source_amount": {
          "currency": "CHF",
          "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
          "value": "0.0009211546262510451"
        }
      },
      {
        "paths_computed": [
          [
            {
              "account": "razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "USD",
              "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ],
          [
            {
              "account": "razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "USD",
              "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ]
        ],
        "source_amount": {
          "currency": "CNY",
          "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
          "value": "0.006293562"
        }
      },
      {
        "paths_computed": [
          [
            {
              "account": "rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "USD",
              "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ],
          [
            {
              "account": "rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "USD",
              "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ],
          [
            {
              "account": "rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "USD",
              "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ]
        ],
        "source_amount": {
          "currency": "DYM",
          "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
          "value": "0.0007157142857142858"
        }
      },
      {
        "paths_computed": [
          [
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "USD",
              "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ],
          [
            {
              "account": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "USD",
              "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ],
          [
            {
              "account": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "USD",
              "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ]
        ],
        "source_amount": {
          "currency": "EUR",
          "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
          "value": "0.0007409623616236163"
        }
      },
      {
        "paths_computed": [
          [
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            },
            {
              "currency": "USD",
              "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 48,
              "type_hex": "0000000000000030"
            },
            {
              "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
              "type": 1,
              "type_hex": "0000000000000001"
            }
          ]
        ],
        "source_amount": {
          "currency": "JPY",
          "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
          "value": "0.103412412"
        }
      }
    ],
    "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "destination_amount": {
      "currency": "USD",
      "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
      "value": "0.001"
    },
    "id": 1,
    "source_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
  }
}
```
</div>

The initial response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| alternatives | Array | Array of objects with suggested paths to take, as described below. If empty, then no paths were found connecting the source and destination accounts. |
| destination_account | String | Unique address of the account that would receive a transaction |
| destination_amount | String or Object | [Currency amount](#specifying-currency-amounts) that the destination would receive in a transaction |
| id | (Various) | (WebSocket only) The ID provided in the WebSocket request is included again at this level. |
| source_account | String | Unique address of the account that would initiate a transaction |

Each element in the `alternatives` array is an object that represents a path from one possible source currency (held by the initiating account) to the destination account and currency. This object has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| paths_computed | Array | Array of arrays of objects defining [payment paths](https://ripple.com/wiki/Payment_paths) |
| source_amount | String or Object | [Currency amount](#specifying-currency-amounts) that the source would have to send along this path in order for the destination to receive the desired amount |

#### Asynchronous Follow-ups ####

In addition to the initial response, the server sends more messages in a similar format to update on the status of the paths over time. These messages include the `id` of the original WebSocket request so you can tell which request prompted them, and the field `"type": "path_find"` at the top level to indicate that they are additional responses. The other fields are defined in the same way as the initial response.

Here is an example of an asychronous follow-up from a path_find create request:

<div class='multicode'>
*WebSocket*
```
{
    "id": 1,
    "type": "path_find",
    "alternatives": [
        {
            "paths_computed": [
                [
                    {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "currency": "USD",
                        "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rG2pEp6WtqLfThH8wsVM9XYYvy9wSe9Zqu",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "currency": "USD",
                        "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rULnR9YhAkj9HrcxAcudzBhaXRSqT7zJkq",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "currency": "USD",
                        "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rwBWBFZrbLzHoe3PhwWYv89iHJdxAFrxcB",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ]
            ],
            "source_amount": "251686"
        },
        {
            "paths_computed": [
                [
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rpgKWEmNqSDAGFhy5WDnsyPqfQxbWxKeVd",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ]
            ],
            "source_amount": {
                "currency": "BTC",
                "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                "value": "0.000001529347313523348"
            }
        },
        {
            "paths_computed": [
                [
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rBVuBbPYvLyf8HvMdf48nayR8XF8X9J3Ds",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rBVuBbPYvLyf8HvMdf48nayR8XF8X9J3Ds",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ]
            ],
            "source_amount": {
                "currency": "CHF",
                "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                "value": "0.0009211546262510451"
            }
        },
        {
            "paths_computed": [
                [
                    {
                        "account": "razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rBVuBbPYvLyf8HvMdf48nayR8XF8X9J3Ds",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rBVuBbPYvLyf8HvMdf48nayR8XF8X9J3Ds",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ]
            ],
            "source_amount": {
                "currency": "CNY",
                "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                "value": "0.00626921726264844"
            }
        },
        {
            "paths_computed": [
                [
                    {
                        "account": "rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rBVuBbPYvLyf8HvMdf48nayR8XF8X9J3Ds",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rBVuBbPYvLyf8HvMdf48nayR8XF8X9J3Ds",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ]
            ],
            "source_amount": {
                "currency": "DYM",
                "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                "value": "0.0007157142857142858"
            }
        },
        {
            "paths_computed": [
                [
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ]
            ],
            "source_amount": {
                "currency": "EUR",
                "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                "value": "0.0007390991477027603"
            }
        },
        {
            "paths_computed": [
                [
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rBVuBbPYvLyf8HvMdf48nayR8XF8X9J3Ds",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rBVuBbPYvLyf8HvMdf48nayR8XF8X9J3Ds",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ]
            ],
            "source_amount": {
                "currency": "JPY",
                "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                "value": "0.103412412"
            }
        },
        {
            "paths_computed": [
                [
                    {
                        "account": "rHpXfibHgSb64n8kK9QWDpdbfqSpYbM9a4",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rHpXfibHgSb64n8kK9QWDpdbfqSpYbM9a4",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rHpXfibHgSb64n8kK9QWDpdbfqSpYbM9a4",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rBVuBbPYvLyf8HvMdf48nayR8XF8X9J3Ds",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rBVuBbPYvLyf8HvMdf48nayR8XF8X9J3Ds",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ],
                [
                    {
                        "account": "rHpXfibHgSb64n8kK9QWDpdbfqSpYbM9a4",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "currency": "XRP",
                        "type": 16,
                        "type_hex": "0000000000000010"
                    },
                    {
                        "currency": "USD",
                        "issuer": "rHHa9t2kLQyXRbdLkSzEgkzwf9unmFgZs9",
                        "type": 48,
                        "type_hex": "0000000000000030"
                    },
                    {
                        "account": "rHHa9t2kLQyXRbdLkSzEgkzwf9unmFgZs9",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    },
                    {
                        "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                        "type": 1,
                        "type_hex": "0000000000000001"
                    }
                ]
            ],
            "source_amount": {
                "currency": "MXN",
                "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                "value": "0.03202111959287532"
            }
        }
    ],
    "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "destination_amount": {
        "currency": "USD",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        "value": "0.001"
    },
    "source_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
}
```
</div>

### path_find close ###

The `close` subcommand of `path_find` instructs the server to stop sending information about the current open pathfinding request.

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
  "id": 57,
  "command": "path_find",
  "subcommand": "close"
}
```
</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| subcommand | String | Use `"close"` to send the close subcommand |

#### Response Format ####

If a pathfinding request was successfully closed, the response follows the same format as the initial response to [`path_find create`](#path_find-create). If there was no outstanding pathfinding request, an error is returned instead.

### path_find status ###

The `status` subcommand of `path_find` requests an immediate update about the client's currently-open pathfinding request.

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
  "id": 58,
  "command": "path_find",
  "subcommand": "status"
}
```
</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| subcommand | String | Use `"status"` to send the status subcommand |

#### Response Format ####

If a pathfinding request is open, the response follows the same format as the initial response to [`path_find create`](#path_find-create). If there was no outstanding pathfinding request, an error is returned instead. (Prior to version 0.26, the server erroneously reports success. See [RIPD-293](https://ripplelabs.atlassian.net/browse/RIPD-293) for more information.)


## ripple_path_find ##

The `ripple_path_find` method is a simplified version of [`path_find`](#path-find) that provides a single response to be used to make a payment transaction immediately. It is available in both the WebSocket and JSON-RPC APIs. However, the results tend to become outdated as time passes. Instead of making many subsequent calls, you should use [`path_find`](#path-find) instead where possible.

Although the `rippled` server attempts to find the cheapest path or combination of paths for making a payment, it is not guaranteed that the paths returned by this method are, in fact, the best paths. Due to server load, pathfinding may not find the best results. Additionally, you should be careful with the pathfinding results from untrusted servers. A server could be modified to return less-than-optimal paths in order to earn money for its operators. If you do not have your own server that you can trust with pathfinding, you should compare the results of pathfinding from multiple servers operated by different parties, to minimize the risk of a single server returning poor results. (*Note:* A server returning less-than-optimal results is not necessarily proof of malicious behavior; it could also be a symptom of heavy server load.)

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
    "id": 8,
    "command": "ripple_path_find",
    "source_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "source_currencies": [
        {
            "currency": "XRP"
        },
        {
            "currency": "USD"
        }
    ],
    "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "destination_amount": {
        "value": "0.001",
        "currency": "USD",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    }
}
```
*Commandline*
```
#Syntax ripple_path_find json ledger_index|ledger_hash
rippled -- ripple_path_find '{"source_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59", "source_currencies": [ { "currency": "XRP" }, { "currency": "USD" } ], "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59", "destination_amount": { "value": "0.001", "currency": "USD", "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B" } }' 
```
</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| source_account | String | Unique address of the account that would send funds in a transaction |
| destination_account | String | Unique address of the account that would receive funds in a transaction |
| destination_amount | String or Object | [Currency amount](#specifying-currency-amounts) that the destination account would receive in a transaction |
| source_currencies | Array | (Optional, defaults to all available) Array of currencies that the source account might want to spend. Each entry in the array should be a JSON object with a mandatory `currency` field and optional `issuer` field, similar to [currency amounts](#specifying-currency-amounts). |
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger-instance))|

#### Response Format ####

An example of a successful response:
<div class='multicode'>
*WebSocket*
```
{
    "id": 8,
    "status": "success",
    "type": "response",
    "result": {
        "alternatives": [
            {
                "paths_canonical": [],
                "paths_computed": [
                    [
                        {
                            "currency": "USD",
                            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                            "type": 48,
                            "type_hex": "0000000000000030"
                        },
                        {
                            "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        }
                    ],
                    [
                        {
                            "currency": "USD",
                            "issuer": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                            "type": 48,
                            "type_hex": "0000000000000030"
                        },
                        {
                            "account": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        }
                    ],
                    [
                        {
                            "currency": "USD",
                            "issuer": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                            "type": 48,
                            "type_hex": "0000000000000030"
                        },
                        {
                            "account": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "rLpq4LgabRfm1xEX5dpWfJovYBH6g7z99q",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        }
                    ],
                    [
                        {
                            "currency": "USD",
                            "issuer": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                            "type": 48,
                            "type_hex": "0000000000000030"
                        },
                        {
                            "account": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "rPuBoajMjFoDjweJBrtZEBwUMkyruxpwwV",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        }
                    ]
                ],
                "source_amount": "256987"
            }
        ],
        "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "destination_currencies": [
            "015841551A748AD2C1F76FF6ECB0CCCD00000000",
            "JOE",
            "DYM",
            "EUR",
            "CNY",
            "MXN",
            "BTC",
            "USD",
            "XRP"
        ]
    }
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| alternatives | Array | Array of objects with possible paths to take, as described below. If empty, then there are no paths connecting the source and destination accounts. |
| destination_account | String | Unique address of the account that would receive a payment transaction |
| destination_currencies | Array | Array of strings representing the currencies that the destination accepts, as 3-letter codes like `"USD"` or as 40-character hex like `"015841551A748AD2C1F76FF6ECB0CCCD00000000"` |

Each element in the `alternatives` array is an object that represents a path from one possible source currency (held by the initiating account) to the destination account and currency. This object has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| paths_computed | Array | Array of arrays of objects defining [payment paths](https://ripple.com/wiki/Payment_paths) |
| source_amount | String or Object | [Currency amount](#specifying-currency-amounts) that the source would have to send along this path in order for the destination to receive the desired amount |

The following fields are deprecated, and may be omitted: `paths_canonical`, and `paths_expanded`. If they appear, you should disregard them.

## sign ##

The `sign` method takes a transaction, specified as JSON, and a secret key, and returns a signed binary representation of the transaction that can be submitted. The result is always different, even when you provide the same transaction and secret key.

*Note:* It is possible and preferable to sign a transaction without connecting to a server instead of using this command. For example, [ripple-lib's rsign.js](https://github.com/ripple/ripple-lib/blob/develop/bin/rsign.js) demonstrates offline signing of a transaction. You should prefer to do offline signing of a transaction, especially when do not control the server you are sending a transaction to. An untrustworthy server can abuse its position to change the transaction before signing it, or worse, use your secret to sign additional arbitrary transactions as if they came from you.

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
  "id": 2,
  "command": "sign",
  "tx_json" : {
      "TransactionType" : "Payment",
      "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "Amount" : { 
         "currency" : "USD",
         "value" : "1",
         "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
      }
   },
   "secret" : "sssssssssssssssssssssssssssss",
   "offline": false
}
```

*Commandline*
```
#Syntax: sign secret tx_json [offline]
rippled -- sign sssssssssssssssssssssssssssss '{"TransactionType": "Payment", "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX", "Amount": { "currency": "USD", "value": "1", "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn" }}' false
```
</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| tx_json | Object | [Transaction definition](https://ripple.com/wiki/Transaction_Format) in JSON format |
| secret | String | Secret key of the account supplying the transaction, used to sign it. Do not send your secret to untrusted servers or through unsecured network connections. |
| offline | Boolean | (Optional, defaults to false) If true, when constructing the transaction, do not attempt to automatically fill in or validate values. |

The server automatically attempts to fill in certain fields from the `tx_json` object if they are omitted, unless you specified `offline` as true. Otherwise, the following fields are automatic:

* `Sequence` - The server automatically uses the next Sequence number from the sender's account information. Be careful: the next sequence number for the account is not incremented until this transaction is applied. If you sign multiple transactions without submitting and waiting for the response to each one, you must provide the correct sequence numbers in the request. 
* `Fee` - The server can automatically fill in an appropriate transaction fee (in drops of XRP) unless you specified `offline` as true. Otherwise, you must fill in the appropriate fee. Be careful: a malicious server can specify an excessively high fee.

#### Response Format ####

An example of a successful response:
<div class='multicode'>
*WebSocket*
```
{
    "id": 2,
    "result": {
        "tx_blob": "1200002280000000240000000361D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100BF06B6C01646005DEDD8F4F6D458AF4EE4006205A623FF31E0B5BCCE42564BA1022063C372D476379C109E3C22C5C04071594CD9EF64615C00B048AFFA5D7D6701F981144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
        "tx_json": {
            "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "Amount": {
                "currency": "USD",
                "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "value": "1"
            },
            "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
            "Fee": "10",
            "Flags": 2147483648,
            "Sequence": 3,
            "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
            "TransactionType": "Payment",
            "TxnSignature": "3045022100BF06B6C01646005DEDD8F4F6D458AF4EE4006205A623FF31E0B5BCCE42564BA1022063C372D476379C109E3C22C5C04071594CD9EF64615C00B048AFFA5D7D6701F9",
            "hash": "B4CBEBBA9E65A5BED25205806797600149599AAF2FD8103B3B75AE97B1B5F3E2"
        }
    },
    "status": "success",
    "type": "response"
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| tx_blob | String | Binary representation of the fully-qualified, signed transaction, as hex |
| tx_json | Object | JSON specification of the [complete transaction](https://ripple.com/wiki/Transaction_Format) as signed, including any fields that were automatically filled in |

*Warning:* If this command results in an error messages, the message can contain the account secret from the request. Make sure that these errors are not visible to others, including:

* Do not write this error to a log file that can be seen by multiple people
* Do not paste this error to a public place for debugging
* Do not display the error message on a website, even by accident

## submit ##

The `submit` method sends a transaction to the network to be confirmed and included in future ledgers. There are two ways to use it: either you can supply JSON along with your secret key, or you can take a pre-signed transaction blob (for example, one created with [`sign`](#sign)) and submit it as-is.

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
  "id": 2,
  "command": "submit",
  "tx_json" : {
      "TransactionType" : "Payment",
      "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "Amount" : { 
         "currency" : "USD",
         "value" : "1",
         "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
      }
   },
   "secret" : "sssssssssssssssssssssssssssss"
}
```

*Commandline*
```
#Syntax: submit secret json [offline]
submit sssssssssssssssssssssssssssss '{"TransactionType":"Payment", "Account":"rJYMACXJd1eejwzZA53VncYmiK2kZSBxyD", "Amount":"200000000","Destination":"r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV" }'
```
</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| tx_blob | String | (Do not include if tx_json and secret are supplied) Hex representation of the signed transaction to submit. |
| tx_json | Object | (Do not include if tx_blob is supplied) [Transaction definition](https://ripple.com/wiki/Transaction_Format) in JSON format |
| secret | String | (Required if tx_json is supplied) Secret key of the account supplying the transaction, used to sign it. Do not send your secret to untrusted servers or through unsecured network connections. |
| fail_hard | Boolean | (Optional, defaults to false) If true, and the transaction fails locally, do not retry or relay the transaction to other servers |
| offline | Boolean | (Optional, defaults to false) If true, when constructing the transaction, do not attempt to automatically fill in or validate values. (No effect when specifying the transaction as tx_blob.) |

The JSON format for `tx_json` varies depending on the type of transaction. In the case of sending non-XRP currency (IOUs), you can obtain appropriate values for the `Paths` field by doing a `find_path` or `ripple_find_path` command first. The `Paths` field is not required for sending XRP. The provided path or paths are used as options for the path the payment takes; the server selects one or more of them to use according to its own criteria. You can omit the `Paths` field, but that leaves it up to the server to choose a path on the fly. Since the total cost of making the payment, including transit fees, is automatically deducted from the sending account, you should find paths ahead of time to avoid getting surprised. 

By default, `rippled` tries to compute the cheapest combination of paths, but it may not have the resources to find the best option. A payment may even be broken up into multiple parts that take different paths if that is the cheapest way. An untrustworthy server could be modified to choose paths maliciously. 

If `offline` is not set to true, then the server tries to automatically fill the `Sequence` and `Fee` parameters appropriately. 

To send a transaction as robustly as possible, you should construct and [`sign`](#sign) it in advance, persist it somewhere that you can access even after a power outage, then `submit` it as a `tx_blob`. After submission, monitor the network with the [`tx`](#tx) command to see if the transaction was successfully applied; if a restart or other problem occurs, you can safely re-submit the `tx_blob` transaction: it won't be applied twice since it has the same sequence number as the old transaction. 

You should provide a [LastLedgerSequence](https://ripple.com/wiki/Transaction_Format#Basic_Transaction_Format) field in your transaction to make sure that it expires quickly in the case that it does not succeed. Otherwise, a transaction may end up in limbo, neither failing nor confirming, for a long time.

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
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied.",
    "tx_blob": "1200002280000000240000000161D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100F8A650C1D58325FE8D74634C1DC0802BB2271EB84773793EF34085CFC7E32B1302206ECE43AFE94B7F9F0359D53E6B195C2D526DFDFBBBF328D6FE3A598F1D51DEBA81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
    "tx_json": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Amount": {
        "currency": "USD",
        "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "value": "1"
      },
      "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "Fee": "10",
      "Flags": 2147483648,
      "Sequence": 1,
      "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
      "TransactionType": "Payment",
      "TxnSignature": "3045022100F8A650C1D58325FE8D74634C1DC0802BB2271EB84773793EF34085CFC7E32B1302206ECE43AFE94B7F9F0359D53E6B195C2D526DFDFBBBF328D6FE3A598F1D51DEBA",
      "hash": "7BF105CFE4EFE78ADB63FE4E03A851440551FE189FD4B51CAAD9279C9F534F0E"
    }
  }
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| engine_result | String | Code indicating the status of the transaction, for example `tesSUCCESS` |
| engine_result_code | Integer | Numeric code indicating the status of the transaction, directly correlated to `engine_result` |
| engine_result_message | String | Human-readable explanation of the status of the transaction |
| tx_blob | String | The complete transaction in hex string format |
| tx_json | Object | The complete transaction in JSON format |

*Important:* Even if the WebSocket response has `"status":"success"`, indicating that the command was successfully received, that does not necessarily indicate that the transaction has taken place. There are many cases that can prevent a transaction from processing successfully, such as a lack of trust lines connecting the two accounts in a payment, or changes in the state of the network since the time the transaction was constructed. Even if nothing is wrong, it may take several seconds to close and validate the ledger version that includes the transaction. See the [full list of transaction responses](https://ripple.com/wiki/Transaction_errors) for details, and do not consider the transaction's results final until they appear in a validated ledger version.

*Warning:* If this command results in an error messages, the message can contain an account secret, if one was provided in the request. (This is not a problem if the request contained a signed tx_blob instead.) Make sure that these errors are not visible to others, including:

* Do not write this error to a log file that can be seen by multiple people
* Do not paste this error to a public place for debugging
* Do not display the error message on a website, even by accident

## book_offers ##

The `book_offers` method retrieves a list of offers, also known as the [order book](http://www.investopedia.com/terms/o/order-book.asp), between two currencies. If the results are very large, a partial result is returned with a marker so that subsequent requests can resume from where the previous one left off.

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
  "id": 4,
  "command": "book_offers",
  "taker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "taker_gets": {
    "value": "1",
    "currency": "EUR",
    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  },
  "taker_pays": {
    "value": "1",
    "currency": "USD",
    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  }
}
```
*Commandline*
```
#Syntax: book_offers taker_pays taker_gets [taker [ledger [limit [proof [marker]]]]] [autobridge]
rippled -- book_offers 'USD/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B' 'EUR/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'
```
</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| taker | String | (Optional, defaults to [ACCOUNT_ONE](https://ripple.com/wiki/Accounts#ACCOUNT_ONE)) Unique base-58 address of an account to use as point-of-view. (This may affect funding of offers after transfer fees are included.) 
| taker_gets | Object | Specification of which currency the account taking the offer would receive, as an object with `currency` and `issuer` fields (omit issuer for XRP), similar to [currency amounts](#specifying-currency-amounts). |
| taker_pays | Object | Specification of which currency the account taking the offer would pay, as an object with `currency` and `issuer` fields (omit issuer for XRP), similar to [currency amounts](#specifying-currency-amounts). |

*Note:* The other parameters of this command -- `marker`, `limit`, `proof`, and `autobridge` -- are not yet fully implemented. (See [RIPD-295](https://ripplelabs.atlassian.net/browse/RIPD-295)).

Normally, offers that are not funded are omitted; however, offers made by the specified `taker` account are always displayed. This allows you to look up your own unfunded offers in order to cancel them with an OfferCancel transaction.

#### Response Format ####

An example of a successful response:
<div class='multicode'>
*WebSocket*
```
{
  "id": 11,
  "status": "success",
  "type": "response",
  "result": {
    "ledger_current_index": 7035305,
    "offers": [
      {
        "Account": "rM3X3QSr8icjTGpaF52dozhbT2BZSXJQYM",
        "BookDirectory": "7E5F614417C2D0A7CEFEB73C4AA773ED5B078DE2B5771F6D55055E4C405218EB",
        "BookNode": "0000000000000000",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000AE0",
        "PreviousTxnID": "6956221794397C25A53647182E5C78A439766D600724074C99D78982E37599F1",
        "PreviousTxnLgrSeq": 7022646,
        "Sequence": 264542,
        "TakerGets": {
          "currency": "EUR",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "17.90363633316433"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "27.05340557506234"
        },
        "index": "96A9104BF3137131FF8310B9174F3B37170E2144C813CA2A1695DF2C5677E811",
        "quality": "1.511056473200875"
      },
      {
        "Account": "rhsxKNyN99q6vyYCTHNTC1TqWCeHr7PNgp",
        "BookDirectory": "7E5F614417C2D0A7CEFEB73C4AA773ED5B078DE2B5771F6D5505DCAA8FE12000",
        "BookNode": "0000000000000000",
        "Flags": 131072,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000001",
        "PreviousTxnID": "8AD748CD489F7FF34FCD4FB73F77F1901E27A6EFA52CCBB0CCDAAB934E5E754D",
        "PreviousTxnLgrSeq": 7007546,
        "Sequence": 265,
        "TakerGets": {
          "currency": "EUR",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "2.542743233917848"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "4.19552633596446"
        },
        "index": "7001797678E886E22D6DE11AF90DF1E08F4ADC21D763FAFB36AF66894D695235",
        "quality": "1.65"
      }
    ]
  }
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| ledger_current_index | Integer | (Omitted if ledger version provided) Sequence number of the ledger version used when retrieving this data. |
| ledger_index | Integer | (Omitted if ledger_current_index provided instead) Sequence number, provided in the request, of the ledger version that was used when retrieving this data. |
| ledger_hash | String | (May be omitted) Hex hash, provided in the request, of the ledger version that was used when retrieving this data. |
| offers | Array | Array of offer objects, each of which has the fields of an [offer transaction](https://ripple.com/wiki/Transaction_Format#OfferCreate_.287.29) |

In addition to the standard Offer fields, the following fields may be included in members of the `offers` array:

| Field | Type | Description |
|-------|------|-------------|
| taker_gets_funded | String (XRP) or Object (non-XRP) | (Only included in partially-funded offers) The maximum amount of currency that the taker can get, given the funding status of the offer. |
| taker_pays_funded | String (XRP) or Object (non-XRP) | (Only included in partially-funded offers) The maximum amount of currency that the taker would pay, given the funding status of the offer.
| quality | Number | The exchange rate, as the ratio `taker_pays` divided by `taker_gets`. For fairness, offers that have the same quality are automatically taken first-in, first-out. (In other words, if multiple people offer to exchange currency at the same rate, the oldest offer is taken first.) |


# Subscriptions #

Using subscriptions, you can have the server push updates to your client when various events happen, so that you can know right away and react accordingly. Subscriptions are only supported in the WebSocket API, where you can receive additional responses in the same channel.

JSON-RPC support for subscription callbacks is deprecated and may not work as expected.
## subscribe ##

The `subscribe` method requests periodic notifications from the server when certain events happen. 

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket - accounts*
```
{
  "id": "Example watch Bitstamp's hot wallet",
  "command": "subscribe",
  "accounts": ["rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1"]
}
```
*WebSocket - offer book*
```
{
    "command": "subscribe",
    "books": [
        {
            "taker_pays": {
                "currency": "XRP"
            },
            "taker_gets": {
                "currency": "USD",
                "issuer": "rUQTpMqAF5jhykj4FExVeXakrZpiKF6cQV"
            },
            "snapshot": true
        }
    ]
}
```
</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| streams | Array | (Optional) Array of string names of generic streams to subscribe to, as explained below |
| accounts | Array | (Optional) Array with the unique base-58 addresses of accounts to monitor for validated transactions. The server sends a notification for any transaction that affects at least one of these accounts. |
| accounts_proposed | Array | (Optional) Like `accounts`, but include transactions that are not yet finalized. |
| books | Array | (Optional) Array of objects defining [order books](http://www.investopedia.com/terms/o/order-book.asp) to monitor for updates, as detailed below. |
| url | String | (Optional for Websocket; Required otherwise) URL where the server will send a JSON-RPC callback with each event. *Admin-only.* |
| url_username | String | (Optional) Username to provide for basic authentication at the callback URL. |
| url_password | String | (Optional) Password to provide for basic authentication at the callback URL. |

The following parameters are deprecated and may be removed without further notice: `user`, `password`, `rt_accounts`.

The `streams` parameter provides access to the following default streams of information:

* `server` - Sends a message whenever the status of the rippled server (for example, network connectivity) changes
* `ledger` - Sends a message whenever a new ledger version closes
* `transactions` - Sends a message whenever a transaction is included in a closed ledger
* `transactions_proposed` - Sends a message whenever a transaction is included in a closed ledger, as well as some transactions that have not yet been included in a validated ledger and may never be. Not all proposed transactions appear before validation, however. (Note that [even some transactions that don't succeed are included](https://ripple.com/wiki/Transaction_errors#Claimed_fee_only) in validated ledgers, because they take the anti-spam transaction fee.)

Each member of the `books` array, if provided, is an object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| taker_gets | Object | Specification of which currency the account taking the offer would receive, as a [currency object with no amount](#specifying-currencies-without-amounts). |
| taker_pays | Object | Specification of which currency the account taking the offer would pay, as a [currency object with no amount](#specifying-currencies-without-amounts). |
| taker | String | Unique base-58 account address to use as a perspective for viewing offers. (This affects the funding status and fees of offers.) |
| snapshot | Boolean | (Optional, defaults to false) If true, return the current state of the order book once when you subscribe before sending updates |
| both | Boolean | (Optional, defaults to false) If true, return both sides of the order book. |

The field `proof` is reserved for future use.

#### Response Format ####

An example of a successful response:
<div class='multicode'>
*WebSocket*
```
{
  "id": "Example watch Bitstamp's hot wallet",
  "status": "success",
  "type": "response",
  "result": {}
}
```
</div>

The response follows the [standard format](#response-formatting). The fields contained in the response vary depending on what subscriptions were included in the request.

* `accounts` and `accounts_proposed` - No fields returned
* *Stream: server* - Information about the server status, such as `load_base` (the current load level of the server), `random` (a randomly-generated value), and others, subject to change. 
* *Stream: transactions* and *Stream: transactions_proposed* - No fields returned
* *Stream: ledger* - Information about the ledgers on hand and current fee schedule, such as `fee_base` (current base fee for transactions in XRP), `fee_ref` (current base fee for transactions in fee units), `ledger_hash` (hash of the latest validated ledger), `reserve_base` (minimum reserve for accounts), and more.
* `books` - No fields returned by default. If `"snapshot": true` is set in the request, returns `offers` (an array of offer definition objects defining the order book)

### Subscription Stream Messages ###

When you subscribe to a particular stream, you will receive periodic responses on that stream until you unsubscribe or close the WebSocket connection. The content of those responses depends on what you subscribed to. Here are some examples:

#### Stream: ledger Message ####

```
{
  "type": "ledgerClosed",
  "fee_base": 10,
  "fee_ref": 10,
  "ledger_hash": "687F604EF6B2F67319E8DCC8C66EF49D84D18A1E18F948421FC24D2C7C3DB464",
  "ledger_index": 7125358,
  "ledger_time": 455751310,
  "reserve_base": 20000000,
  "reserve_inc": 5000000,
  "txn_count": 7,
  "validated_ledgers": "32570-7125358"
}
```

The fields from a ledger stream message are as follows:

| Field | Type | Description |
|-------|------|-------------|
| type | String | `ledgerClosed` indicates this is from the ledger stream |
| fee_base | Unsigned Integer | Cost of the 'reference transaction' in drops of XRP. (See [Transaction Fee Terminology](https://ripple.com/wiki/Transaction_Fee#Fee_Terminology) |
| fee_ref | Unsigned Integer | Cost of the 'reference transaction' in 'fee units'. (See [Transaction Fee Terminology](https://ripple.com/wiki/Transaction_Fee#Fee_Terminology) |
| ledger_hash | String | Unique hash of the ledger that was closed, as hex |
| ledger_index | Unsigned Integer | Sequence number of the ledger that was closed |
| ledger_time | Unsigned Integer | The time this ledger was closed, in seconds since the [Ripple Epoch](#specifying-time) |
| reserve_base | Unsigned Integer | The minimum reserve, in drops of XRP, that is required for an account |
| reserve_inc | Unsigned Integer | The increase in account reserve that is added for each item the account owns, such as offers or trust lines |
| txn_count | Unsigned Integer | Number of transactions newly included in this ledger |
| validated_ledgers | String | Range of ledgers that the server has available. This may be discontiguous. |

#### Transaction Messages ####

Most other subscriptions result in messages about transactions. The `transactions_proposed` stream, strictly speaking, is a superset of the `transactions` stream: it includes all validated transactions, as well as some suggested transactions that have not yet been included in a validated ledger and may never be. You can identify these "in-flight" transactions by their fields:

* The `validated` field is missing or has a value of `false`.
* There is no `meta` or `metadata` field.
* Instead of `ledger_hash` and `ledger_index` fields specifying in which ledger version the transactions were finalized, there is a `ledger_current_index` field specifying in which ledger version they are currently proposed.

Otherwise, the messages from the `transactions_proposed` stream are identical to ones from the `transactions` stream.

Since the only thing that can modify an account or an order book is a transaction, the messages that are sent as a result of subscribing to particular `accounts` or `books` also take the form of transaction messages, the same as the ones in the `transactions` stream. The only difference is that you only receive messages for transactions that affect the accounts or order books you're watching.

The `accounts_proposed` subscription works the same way, except it also includes unconfirmed transactions, like the `transactions_proposed` stream, for the accounts you're watching.

```
{
  "status": "closed",
  "type": "transaction",
  "engine_result": "tesSUCCESS",
  "engine_result_code": 0,
  "engine_result_message": "The transaction was applied.",
  "ledger_hash": "989AFBFD65D820C6BD85301B740F5D592F060668A90EEF5EC1815EBA27D58FE8",
  "ledger_index": 7125442,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Flags": 0,
            "IndexPrevious": "0000000000000000",
            "Owner": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
            "RootIndex": "ABD8CE2D1205D0C062876E9E1F3CBDC902ED8EF4E8D3D071B962C7ED0E113E68"
          },
          "LedgerEntryType": "DirectoryNode",
          "LedgerIndex": "0BBDEE7D0BE120F7BF27640B5245EBFE0C5FD5281988BA823C44477A70262A4D"
        }
      },
      {
        "DeletedNode": {
          "FinalFields": {
            "Account": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
            "BookDirectory": "892E892DC63D8F70DCF5C9ECF29394FF7DD3DC6F47DB8EB34A03920BFC5E99BE",
            "BookNode": "0000000000000000",
            "Flags": 0,
            "OwnerNode": "000000000000006E",
            "PreviousTxnID": "58A17D95770F8D07E08B81A85896F4032A328B6C2BDCDEC0A00F3EF3914DCF0A",
            "PreviousTxnLgrSeq": 7125330,
            "Sequence": 540691,
            "TakerGets": "4401967683",
            "TakerPays": {
              "currency": "BTC",
              "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
              "value": "0.04424"
            }
          },
          "LedgerEntryType": "Offer",
          "LedgerIndex": "386B7803A9210747941B0D079BB408F31ACB1CB98832184D0287A1CBF4FE6D00"
        }
      },
      {
        "DeletedNode": {
          "FinalFields": {
            "ExchangeRate": "4A03920BFC5E99BE",
            "Flags": 0,
            "RootIndex": "892E892DC63D8F70DCF5C9ECF29394FF7DD3DC6F47DB8EB34A03920BFC5E99BE",
            "TakerGetsCurrency": "0000000000000000000000000000000000000000",
            "TakerGetsIssuer": "0000000000000000000000000000000000000000",
            "TakerPaysCurrency": "0000000000000000000000004254430000000000",
            "TakerPaysIssuer": "92D705968936C419CE614BF264B5EEB1CEA47FF4"
          },
          "LedgerEntryType": "DirectoryNode",
          "LedgerIndex": "892E892DC63D8F70DCF5C9ECF29394FF7DD3DC6F47DB8EB34A03920BFC5E99BE"
        }
      },
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
            "Balance": "11133297300",
            "Flags": 0,
            "OwnerCount": 9,
            "Sequence": 540706
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "A6C2532E1008A513B3F822A92B8E5214BD0D413DC20AD3631C1A39AD6B36CD07",
          "PreviousFields": {
            "Balance": "11133297310",
            "OwnerCount": 10,
            "Sequence": 540705
          },
          "PreviousTxnID": "484D57DFC4E446DA83B4540305F0CE836D4E007361542EC12CC0FFB5F0A1BE3A",
          "PreviousTxnLgrSeq": 7125358
        }
      }
    ],
    "TransactionIndex": 1,
    "TransactionResult": "tesSUCCESS"
  },
  "transaction": {
    "Account": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
    "Fee": "10",
    "Flags": 2147483648,
    "OfferSequence": 540691,
    "Sequence": 540705,
    "SigningPubKey": "030BB49C591C9CD65C945D4B78332F27633D7771E6CF4D4B942D26BA40748BB8B4",
    "TransactionType": "OfferCancel",
    "TxnSignature": "30450221008223604A383F3AED25D53CE7C874700619893A6EEE4336508312217850A9722302205E0614366E174F2DFF78B879F310DB0B3F6DA1967E52A32F65E25DCEC622CD68",
    "date": 455751680,
    "hash": "94CF924C774DFDBE474A2A7E40AEA70E7E15D130C8CBEF8AF1D2BE97A8269F14"
  },
  "validated": true
}
```

| Field | Type | Description |
|-------|------|-------------|
| type | String | `transaction` indicates this is the notification of a transaction, which could come from the `transactions` or `transactions_proposed` streams, or from watching a particular account |
| engine_result | String | String [transaction response code](https://ripple.com/wiki/Transaction_errors) |
| engine_result_code | Number | Numeric [transaction response code](https://ripple.com/wiki/Transaction_errors) |
| engine_result_message | String | Human-readable explanation for the transaction response |
| ledger_current_index | Unsigned Integer | (Omitted for validated transactions) Sequence number of the current ledger version for which this transaction is currently proposed |
| ledger_hash | String | (Omitted for unvalidated transactions) Unique hash of the ledger version that includes this transaction, as hex |
| ledger_index | Unsigned Integer | (Omitted for unvalidated transactions) Sequence number of the ledger version that includes this transaction |
| meta | Object | (Omitted for unvalidated transactions) Various metadata about the transaction, including which ledger entries it affected |
| transaction | Object | The [definition of the transaction](https://ripple.com/wiki/Transaction_Format) in JSON format |
| validated | Boolean | If true, this transaction is included in a validated ledger. Responses from the `transaction` stream should always be validated. |


## unsubscribe ##

The `unsubscribe` command tells the server to stop sending messages for a particular subscription or set of subscriptions.

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket*
```
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
</div>

The parameters in the request are specified almost exactly like the parameters to [`subscribe`](#subscribe), except that they are used to define which subscriptions to end instead. The parameters are:

| Field | Type | Description |
|-------|------|-------------|
| streams | Array | (Optional) Array of string names of generic streams to unsubscribe from, including `ledger`, `server`, `transactions`, and `transactions_proposed`. |
| accounts | Array | (Optional) Array of unique base-58 account addresses to stop receiving updates for. (This only stops those messages if you previously subscribed to those accounts specifically. You cannot use this to filter accounts out of the general transactions stream.) |
| accounts_proposed | Array | (Optional) Like `accounts`, but for `accounts_proposed` subscriptions that included not-yet-validated transactions. |
| books | Array | (Optional) Array of objects defining order books to unsubscribe from, as explained below. |

The `rt_accounts` and `url` parameters, and the `rt_transactions` stream name, are deprecated and may be removed without further notice.

The objects in the `books` array are defined almost like the ones from subscribe, except that they don't have all the fields. The fields they have are as follows:

| Field | Type | Description |
|-------|------|-------------|
| taker_gets | Object | Specification of which currency the account taking the offer would receive, as an object with `currency` and `issuer` fields (omit issuer for XRP), similar to [currency amounts](#specifying-currency-amounts). |
| taker_pays | Object | Specification of which currency the account taking the offer would pay, as an object with `currency` and `issuer` fields (omit issuer for XRP), similar to [currency amounts](#specifying-currency-amounts). |
| both | Boolean | (Optional, defaults to false) If true, remove a subscription for both sides of the order book. |

#### Response Format ####

An example of a successful response:
<div class='multicode'>
*WebSocket*
```
{
    "id": "Unsubscribe a lot of stuff",
    "result": {},
    "status": "success",
    "type": "response"
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing no fields.

# Server Information #

There are also commands that retrieve information about the current state of the server. These may be useful for monitoring the health of the server, or in preparing for making other API methods. For example, you may query for the current fee schedule before sending a transaction, or you may check which ledger versions are available before digging into the ledger history for a specific record.

## server_info ##

The `server_info` command asks the server for a human-readable version of various information about the `rippled` server being queried.

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
  "id": 11,
  "command": "server_info"
}
```
</div>

The request does not takes any parameters.

#### Response Format ####

An example of a successful response:
<div class='multicode'>
*WebSocket*
```
{
  "id": 11,
  "status": "success",
  "type": "response",
  "result": {
    "info": {
      "build_version": "0.25.2",
      "complete_ledgers": "32570-7695432",
      "hostid": "AIR",
      "io_latency_ms": 1,
      "last_close": {
        "converge_time_s": 2.037,
        "proposers": 5
      },
      "load_factor": 1,
      "peers": 56,
      "pubkey_node": "n9LVtEwRBRfLhrs5cZcKYiYMw6wT9MgmAZEMQEXmX4Bwkq4D6hc1",
      "server_state": "full",
      "validated_ledger": {
        "age": 3,
        "base_fee_xrp": 0.00001,
        "hash": "274C27799A91DF08603AF9B5CB03372ECF844B6D643CAF69F25205C9509E212F",
        "reserve_base_xrp": 20,
        "reserve_inc_xrp": 5,
        "seq": 7695432
      },
      "validation_quorum": 3
    }
  }
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing an `info` object as its only field.

The `info` object may have some arrangement of the following fields:

| Field | Type | Description |
|-------|------|-------------|
| build_version | String | The version number of the running `rippled` version. |
| complete_ledgers | String | Range expression indicating the sequence numbers of the ledger versions the local rippled has in its database. It is possible to be a disjoint sequence, e.g. "2500-5000,32570-7695432". |
| hostid | String | On an admin request, returns the hostname of the server running the `rippled` instance; otherwise, returns a unique four letter word. |
| io_latency_ms | Number | Amount of time spent waiting for I/O operations to be performed, in milliseconds. If this number is not very, very low, then the `rippled` server is probably having serious load issues. |
| last_close | Object | Information about the last time the server closed a ledger, including the amount of time it took to reach a consensus and the number of trusted validators participating. |
| load | Object | *Admin only* Detailed information about the current load state of the server |
| load.job_types | Array | *Admin only* Information about the rate of different types of jobs being performed by the server and how much time it spends on each. |
| load.threads | Number | *Admin only* The number of threads in the server's main job pool, performing various Ripple Network operations. |
| load_factor | Number | The load factor the server is currently enforcing, which affects transaction fees. The load factor is determined by the highest of the individual server's load factor, cluster's load factor, and the overall network's load factor. See [Calculating Transaction Fees](https://ripple.com/wiki/Calculating_the_Transaction_Fee) for more details. |
| peers | Number | How many other `rippled` servers the node is currently connected to. |
| pubkey_node | String | Public key used to verify this node for internal communications; this key is automatically generated by the server the first time it starts up. (If deleted, the node can just create a new pair of keys.) |
| pubkey_validator | String | *Admin only* Public key used by this node to sign ledger validations; . |
| server_state | String | A string indicating to what extent the server is participating in the network. See [Possible Server States](#possible-server-states) for more details. |
| validated_ledger | Object | Information about the fully-validated ledger with the highest sequence number (the most recent) |
| validated_ledger.age | Unsigned Integer | The time since the ledger was closed, in seconds |
| validated_ledger.base_fee_xrp | Number | Base fee, in XRP. This may be represented in scientific notation such as 1e-05 for 0.00005 |
| validated_ledger.hash | String | Unique hash for the ledger, as hex |
| validated_ledger.reserve_base_xrp | Unsigned Integer | Minimum amount of XRP (not drops) necessary for every account to keep in reserve |
| validated_ledger.reserve_inc_xrp | Unsigned Integer | Amount of XRP (not drops) added to the account reserve for each object an account is responsible for in the ledger |
| validated_ledger.seq | Unsigned Integer | Identifying sequence number of this ledger version |
| validation_quorum | Number | Minimum number of trusted validations required in order to validate a ledger version. Some circumstances may cause the server to require more validations. |

## server_state ##

The `server_state` command asks the server for various machine-readable information about the `rippled` server's current state. The results are very similar to [`server_info`](#server-info), but generally the units are chosen to be easier to process instead of easier to read. (For example, XRP values are given in integer drops instead of scientific notation or decimal values, and time is given in milliseconds instead of seconds.)

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
  "id": 12,
  "command": "server_state"
}
```
</div>

The request does not takes any parameters.

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
    "state": {
      "build_version": "0.25.2",
      "complete_ledgers": "32570-7696746",
      "io_latency_ms": 1,
      "last_close": {
        "converge_time": 2097,
        "proposers": 4
      },
      "load_base": 256,
      "load_factor": 256,
      "peers": 61,
      "pubkey_node": "n9L4DuE6NsZiVWyYdHcYbKoELTXr4fs32VY8bdic5c4uVrfrADmX",
      "server_state": "full",
      "validated_ledger": {
        "base_fee": 10,
        "close_time": 458432860,
        "hash": "95A05F232C8C4B4DC313CB91A4C823A221120DD8692395150A3012876C8CD772",
        "reserve_base": 20000000,
        "reserve_inc": 5000000,
        "seq": 7696746
      },
      "validation_quorum": 3
    }
  }
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing a `state` object as its only field.

The `state` object may have some arrangement of the following fields:

| Field | Type | Description |
|-------|------|-------------|
| build_version | String | The version number of the running `rippled` version. |
| complete_ledgers | String | Range expression indicating the sequence numbers of the ledger versions the local rippled has in its database. It is possible to be a disjoint sequence, e.g. "2500-5000,32570-7695432". |
| io_latency_ms | Number | Amount of time spent waiting for I/O operations to be performed, in milliseconds. If this number is not very, very low, then the `rippled` server is probably having serious load issues. |
| load | Object | *Admin only* Detailed information about the current load state of the server |
| load.job_types | Array | *Admin only* Information about the rate of different types of jobs being performed by the server and how much time it spends on each. |
| load.threads | Number | *Admin only* The number of threads in the server's main job pool, performing various Ripple Network operations. |
| load_base | Number | This amount of server load is the baseline that is used to decide how much to charge in transaction fees; if the `load_factor` is equal to the `load_base` then only the base fee is enforced; if the `load_factor` is double the `load_base` then transaction fees are doubled. See [Calculating Transaction Fees](https://ripple.com/wiki/Calculating_the_Transaction_Fee) for more details. |
| load_factor | Number | The load factor the server is currently enforcing, which affects transaction fees. The load factor is determined by the highest of the individual server's load factor, cluster's load factor, and the overall network's load factor. |
| peers | Number | How many other `rippled` servers the node is currently connected to. |
| pubkey_node | String | Public key used by this server (along with the corresponding private key) for secure communications between nodes. This key pair is automatically created and stored in rippled's local database the first time it starts up; if lost or deleted, a new key pair can be generated with no ill effects. |
| pubkey_validator | String | *Admin only* Public key used by this server (along with the corresponding private key) to sign proposed ledgers for validation. |
| server_state | String | A string indicating to what extent the server is participating in the network. See [Possible Server States](#possible-server-states) for more details. |
| validated_ledger | Object | Information about the fully-validated ledger with the highest sequence number (the most recent) |
| validated_ledger.base_fee | Unsigned Integer | Base fee, in drops of XRP, for propagating a transaction to the network.
| validated_ledger.close_time | Number | Time this ledger was closed, in seconds since the [Ripple Epoch](#specifying-time) |
| validated_ledger.hash | String | Unique hash of this ledger version, as hex |
| validated_ledger.reserve_base | Unsigned Integer | Minimum amount, in drops of XRP, necessary for every account to keep in reserve |
| validated_ledger.reserve_inc | Unsigned Integer | Amount, in drops of XRP, that is added to the account reserve for each item the account owns in the ledger. |
| validated_ledger.seq | Unsigned Integer | Unique sequence number of this ledger
| validation_quorum | Number | Minimum number of trusted validations required in order to validate a ledger version. Some circumstances may cause the server to require more validations. |

# Convenience Functions #

The rippled server also provides a few simple commands purely for convenience.

## ping ##

The `ping` command returns an acknowledgement, so that clients can test the connection status and latency.

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
    "id": 1,
    "command": "ping"
}
```
*Commandline*
```
#Syntax: ping
rippled -- ping
```
</div>

The request includes no parameters.

#### Response Format ####

An example of a successful response:
<div class='multicode'>
*WebSocket*
```
{
    "id": 1,
    "result": {},
    "status": "success",
    "type": "response"
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing no fields. The client can measure the round-trip time from request to response as latency.

## random ##

The `random` command provides a random number to be used as a source of entropy for random number generation by clients.

#### Request Format ####
An example of the request format:

<div class='multicode'>
*WebSocket*
```
{
    "id": 1,
    "command": "random"
}
```
*Commandline*
```
#Syntax: ping
rippled -- random
```
</div>

The request includes no parameters.

#### Response Format ####

An example of a successful response:
<div class='multicode'>
*WebSocket*
```
{
    "id": 1,
    "result": {
        "random": "8ED765AEBBD6767603C2C9375B2679AEC76E6A8133EF59F04F9FC1AAA70E41AF"
    },
    "status": "success",
    "type": "response"
}
```
</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following field:

| Field | Type | Description |
|-------|------|-------------|
| random | String | Random 256-bit hex value. |

## json ##

The `json` method is a proxy to running other commands, and accepts the parameters for the command as a JSON value. It is *exclusive to the Commandline client*, and intended for cases where the commandline syntax for specifying parameters is inadequate or undesirable. 

#### Request Format ####
An example of the request format:

<div class='multicode'>
*Commandline*
```
# Syntax: json method json_stanza
rippled -q -- json ledger_closed '{}'
```
</div>

#### Response Format ####

An example of a successful response:
<div class='multicode'>
*WebSocket*
```
{
   "result" : {
      "ledger_hash" : "8047C3ECF1FA66326C1E57694F6814A1C32867C04D3D68A851367EE2F89BBEF3",
      "ledger_index" : 390308,
      "status" : "success"
   }
}

```
</div>

The response follows the [standard format](#response-formatting), with whichever fields are appropriate to the type of command made.
