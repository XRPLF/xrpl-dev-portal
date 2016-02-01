# rippled #

The core peer-to-peer server that operates the Ripple Network is called `rippled`. Each `rippled` server connects to the Ripple Network, relays cryptographically signed transactions, and maintains a local copy of the complete shared global ledger. The source code for `rippled` is written in C++, and is [available on GitHub under an open-source license](https://github.com/ripple/rippled).

* [`rippled` Setup](rippled-setup.html)
* [API Reference](#api-methods)
* [Transaction Reference](transactions.html)
* Client Library - [Javascript](https://github.com/ripple/ripple-lib)

# WebSocket and JSON-RPC APIs #
If you want to communicate directly with the `rippled` server, you can use either the WebSocket API or the JSON-RPC API. Both APIs use the same list of commands, with almost entirely the same parameters in each command.

* The WebSocket API uses the [WebSocket protocol](http://www.html5rocks.com/en/tutorials/websockets/basics/), available in most browsers and Javascript implementations, to achieve persistent two-way communication. There is not a 1:1 correlation between requests and responses. Some requests prompt the server to send multiple messages back asynchronously; other times, responses may arrive in a different order than the requests that prompted them. The `rippled` server can be configured to accept secured (wss:), unsecured (ws:) WebSocket connections, or both.
* The JSON-RPC API relies on simple request-response communication via HTTP or HTTPS. (The `rippled` server can be configured to accept HTTP, HTTPS, or both.) For commands that prompt multiple responses, you can provide a callback URL.
* The `rippled` program can also be used as a quick commandline client to make JSON-RPC requests to a running `rippled` server. This is only intended for administrative purposes, and is not a supported API.

In general, we recommend using WebSocket, because WebSocket's push paradigm has less latency and less network overhead. JSON-RPC must open and close an HTTP connection for each individual message. WebSocket is also more reliable; you can worry less about missing messages and establishing multiple connections. However, all three have valid use cases and will continue to be supported for the foreseeable future.

## Changes to the APIs ##

The WebSocket and JSON-RPC APIs are still in development, and are subject to change. If you want to be notified of upcoming changes and future versions of `rippled`, subscribe to the Ripple Server mailing list:

[https://groups.google.com/forum/#!forum/ripple-server](https://groups.google.com/forum/#!forum/ripple-server)

## Connecting to rippled ##

Before you can run any commands against a `rippled` server, you must know which server you are connecting to. Most servers are configured not to accept requests directly from the outside network. 

Alternatively, you can [run your own local copy of `rippled`](rippled-setup.html). This is required if you want to access any of the [Admin Commands](#list-of-admin-commands). In this case, you should use whatever IP and port you configured the server to bind. (For example, `127.0.0.1:54321`) Additionally, in order to access admin functionality, you must connect from a port/IP address marked as admin in the config file.

The [example config file](https://github.com/ripple/rippled/blob/d7def5509d8338b1e46c0adf309b5912e5168af0/doc/rippled-example.cfg#L831-L854) listens for connections on the local loopback network (127.0.0.1), with JSON-RPC (HTTP) on port 5005 and WebSocket (WS) on port 6006, and treats all connected clients as admin.



### WebSocket API ###

If you are just looking to try out some methods on the Ripple network, you can skip writing your own WebSocket code and go straight to using the API at the [Ripple WebSocket API Tool](ripple-api-tool.html). Later on, when you want to connect to your own `rippled` server, you can build your own client in Javascript to run in a browser (See [this example](http://www.websocket.org/echo.html) ) or possibly [Node.js](https://github.com/einaros/ws).

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

### Commandline ###

The commandline interface connects to the same service as the JSON-RPC one, so the public servers and server configuration are the same. As a commandline client, `rippled` connects to the local instance. For example:

```
rippled --conf=/etc/rippled.cfg server_info
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
rippled account_info r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 validated true
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
| request | Object | A copy of the request that prompted this error, in JSON format. __*Caution:*__ If the request contained any account secrets, they are copied here! |

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
| result.request | Object | A copy of the request that prompted this error, in JSON format. __*Caution:*__ If the request contained any account secrets, they are copied here! __*Note:*__ The request is re-formatted in WebSocket format, regardless of the request made. This may be changed in the future: See [RIPD-279](https://ripplelabs.atlassian.net/browse/RIPD-279). |

### Caution on Errors ###

When your request results in an error, the entire request is copied back as part of the response, so that you can try to debug the error. However, this also includes any secrets that were passed as part of the request. When sharing error messages, be very careful not to accidentally expose important account secrets to others.

### Universal Errors ###

All methods can potentially return any of the following values for the `error` code:

* `unknownCmd` - The request does not contain a [command](#api-methods) that the `rippled` server recognizes.
* `jsonInvalid1 - (WebSocket only) The request is not a proper JSON object. 
    * JSON-RPC returns a 400 Bad Request HTTP error in this case instead.
* `missingCommand` - (WebSocket only) The request did not specify a `command` field.
    * JSON-RPC returns a 400 Bad Request HTTP error in this case instead.
* `tooBusy` - The server is under too much load to perform this command right now. Generally not returned if you are connected as an admin.
* `noNetwork` - The server is having trouble connecting to the rest of the Ripple Network (and is not running in stand-alone mode).
* `noCurrent` - The server does not know what the current ledger is, due to high load, network problems, validator failures, incorrect configuration, or some other problem.
* `noClosed` - The server does not have a closed ledger, typically because it has not finished starting up.
* `wsTextRequired` - (WebSocket only) The request's [opcode](https://tools.ietf.org/html/rfc6455#section-5.2) is not text. 

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

If you do not specify a ledger, the `current` (in-progress) ledger will be chosen by default. If you provide more than one field specifying ledgers, the deprecated `ledger` field will be used first if it exists, falling back to `ledger_hash`. The `ledger_index` field is ignored unless neither of the other two are present. __*Note:*__ Do not rely on this default behavior; it is subject to change. Instead, you should always specify a ledger version in each call.

The sequence number indicates the order of the ledgers; the hash value identifies the exact contents of the ledger. Two ledgers with the same hash are always identical. For closed ledgers, hash values and sequence numbers are equally valid and correlate 1:1. However, this is not true for in-progress ledgers:

* Two different rippled servers may have different contents for a current ledger with the same sequence number, due to transactions not being fully propagated throughout the network.
* A current ledger's contents change over time, which would cause its hash to change, even though its sequence number stays the same. Therefore, the hash of a ledger is not calculated until it is closed.

### Specifying Currency Amounts ###

Some API methods require you to specify an amount of currency. Depending on whether you are dealing in the network's native XRP currency or other currency units (sometimes referred to as IOUs), the style for specifying it is very different.

#### XRP ####

Amounts of XRP are represented as strings. (JSON integers are limited to 32 bits, so integer overflows are possible.) XRP is formally specified in "drops", which are equivalent to 0.000001 (one 1-millionth) of an XRP each. Thus, to represent 1.0 XRP in a JSON document, you would write:

```
"1000000"
```

**Do not specify XRP as an object.**

Unit tests are permitted to submit values of XRP (not drops) with a decimal point - for example, "1.23" meaning 1.23 XRP. All other cases should always specify XRP in drops, with no decimal point: e.g. "1230000" meaning 1.23 XRP.

#### Non-XRP ####

If you are specifying non-XRP currency (including fiat dollars, precious metals, cryptocurrencies, or other custom currency) you must specify it with a currency specification object. This is a JSON object with three fields:

| Field | Type | Description |
|-------|------|-------------|
| currency | String | 3-character currency code. We recommend using uppercase [ISO 4217 Currency Codes](http://www.xe.com/iso4217.php) only. The string `"XRP"` is disallowed. The following characters are permitted: all uppercase and lowercase letters, digits, as well as the symbols `?`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `<`, `>`, `(`, `)`, `{`, `}`, `[`, `]`, and <code>&#124;</code>. Instead of a 3-character code, this field could also be a 40-character hex value according to the internal [Currency format](https://wiki.ripple.com/Currency_format). |
| value | String | Quoted decimal representation of the amount of currency |
| issuer | String | Unique account address of the entity issuing the currency. In other words, the person or business where the currency can be redeemed. |

For example, to represent $153.75 US dollars issued by account `r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59`, you would specify:

```
{
	"currency": "USD",
	"value": "153.75",
	"issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
}
```

Unit tests are permitted to submit amounts of non-XRP currencies as a slash-separated string in the format `"amount/currency/issuer"`. All other cases should use the JSON object format above.

#### Specifying Currencies Without Amounts ####

If you are specifying a non-XRP currency without an amount (typically for defining an order book of currency exchange offers) you should specify it as above, but omit the `value` field.

If you are specifying XRP without an amount (typically for defining an order book) you should specify it as a JSON object with _only_ a `currency` field. Never include an `issuer` field for XRP.

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

__*Note:*__ The distinction between `full`, `validating`, and `proposing` is based on synchronization with the rest of the global network, and it is normal for a server to fluctuate between these states as a course of general operation.

### Markers and Pagination ###

Some methods return more data than can efficiently fit into one response. When there are more results than contained, the response includes a `marker` field. You can use this to retrieve more pages of data across multiple calls. In each subsequent request, pass the `marker` value from the previous response in order to resume from the point where you left off. If the `marker` is omitted from a response, then you have reached the end of the data set.

The format of the `marker` field is intentionally undefined. Each server can define a `marker` field as desired, so it may take the form of a string, a nested object, or another type. Different servers, and different methods provided by the same server, can have different `marker` definitions. Each `marker` is ephemeral, and may not work as expected after 10 minutes.


## Modifying the Ledger ##

All changes to Ripple's global shared ledger happen as the result of transactions. Consequently, this means that there is *only one* public API method that causes a change in the state of the Ripple Network at all: the [*submit*](#submit) command. Most of the other methods represent different ways to view the data represented in the Ripple Network, and the remaining ones just generate data for your convenience. (The [wallet_propose](#wallet-propose), [path_find](#path-find), and [random](#random) commands fall into this category.)

For more information on the various transactions you can submit, consult the [Transaction Format](transactions.html).




# API Methods #

API methods for the Websocket and JSON-RPC APIs are defined by command names, and are divided into Public Commands and Admin Commands. Public Commands are not necessarily meant for the general public, but they are used by any client attached to the server. (Think of Public Commands as being for members or customers of the organization running the server, while the Admin Commands are for the personnel in charge of keeping the server operational.) Public Commands include the general operations for Ripple use, including checking the state of the ledger, finding a path to connecting users, and submitting a transaction, among others. Admin Commands, on the other hand, are meant only for the operators of the server, and include commands for managing the state of the server, the nodes it uses for validation, and other administrative features.


## List of Public Commands ##

* [`account_currencies` - Get a list of currencies an account can send or receive](#account-currencies)
* [`account_info` - Get basic data about an account](#account-info)
* [`account_lines` - Get info about an account's trust lines](#account-lines)
* [`account_objects` - Get all ledger objects owned by an account](#account-objects)
* [`account_offers` - Get info about an account's currency exchange offers](#account-offers)
* [`account_tx` - Get info about an account's transactions](#account-tx)
* [`book_offers` - Get info about offers to exchange two currencies](#book-offers)
* [`gateway_balances` - Calculate total amounts issued by an account](#gateway-balances)
* [`ledger` - Get info about a ledger version](#ledger)
* [`ledger_closed` - Get the latest closed ledger version](#ledger-closed)
* [`ledger_current` - Get the current working ledger version](#ledger-current)
* [`ledger_data` - Get the raw contents of a ledger version](#ledger-data)
* [`ledger_entry` - Get one element from a ledger version](#ledger-entry)
* [`noripple_check` - Get recommended changes to an account's DefaultRipple and NoRipple settings](#noripple-check)
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

The `owner_info` command is deprecated. Use [`account_objects`](#account-objects) instead.

## List of Admin Commands ##

* [`can_delete` - Allow online deletion of ledgers up to a specific ledger](#can-delete)
* [`connect` - Force the rippled server to connect to a specific peer](#connect)
* [`consensus_info` - Get information about the state of consensus as it happens](#consensus-info)
* [`fetch_info` - Get information about the server's sync with the network](#fetch-info)
* [`get_counts` - Get statistics about the server's internals and memory usage](#get-counts)
* [`ledger_accept` - Close and advance the ledger in stand-alone mode](#ledger-accept)
* [`ledger_cleaner` - Configure the ledger cleaner service to check for corrupted data](#ledger-cleaner)
* [`ledger_request` - Query a peer server for a specific ledger version](#ledger-request)
* [`log_level` - Get or modify log verbosity](#log-level)
* [`logrotate` - Reopen the log file](#logrotate)
* [`peers` - Get information about the peer servers connected](#peers)
* [`print` - Get information about internal subsystems](#print)
* [`stop` - Shut down the rippled server](#stop)
* [`validation_create` - Generate keys for a new rippled validator](#validation-create)
* [`validation_seed` - Temporarily set key to be used for validating](#validation-seed)
* [`wallet_propose` - Generate keys for a new account](#wallet-propose)

The following admin commands are deprecated and may be removed without further notice: 

* `ledger_header` - Use the [`ledger` command](#ledger) instead.
* `unl_add`, `unl_delete`, `unl_list`, `unl_load`, `unl_network`, `unl_reset`, `unl_score` - Use the configuration file for UNL management instead.
* `wallet_seed` - Use [`wallet_propose`](#wallet-propose) instead.


## Commandline Access ##

The `rippled` application, in addition to acting as a server, can be run (as a separate instance) to act as a JSON-RPC client. In this mode, it has syntax for triggering most API methods with a single line from the command prompt, as described in each method. However, some methods don't have a commandline shortcut, so it also provides the following catch-all method for performing commands:

* [`json` - Pass JSON through the commandline](#json)



# Account Information #
Accounts are the core unit of authentication in the Ripple Network. Each account can hold balances in multiple currencies, and all transactions must be signed by an account's secret key. In order for an account to exist in a validated ledger version, it must hold a minimum reserve amount of XRP. (The [reserve for an account](reserves.html) increases with the amount of data it is responsible for in the shared ledger.) It is expected that accounts will correspond loosely to individual users. 


## account_currencies ##
[[Source]<br>](https://github.com/ripple/rippled/blob/df966a9ac6dd986585ecccb206aff24452e41a30/src/ripple/rpc/handlers/AccountCurrencies.cpp "Source")

The `account_currencies` command retrieves a simple list of currencies that an account can send or receive, based on its trust lines. (This is not a thoroughly confirmed list, but it can be used to populate user interfaces.)

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
{
    "command": "account_currencies",
    "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "strict": true,
    "ledger_index": "validated",
    "account_index": 0
}
```

*JSON-RPC*

```
{
    "method": "account_currencies",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "account_index": 0,
            "ledger_index": "validated",
            "strict": true
        }
    ]
}
```

</div>

[Try it! >](ripple-api-tool.html#account_currencies)

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| account | String | A unique identifier for the account, most commonly the account's address. |
| strict | Boolean | (Optional) If true, only accept an address or public key for the account parameter. Defaults to false. |
| ledger\_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger\_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger-instance))|

The following field is deprecated and should not be provided: `account_index`.

#### Response Format ####

An example of a successful response:

<div class='multicode'>

*WebSocket*

```
{
    "result": {
        "ledger_index": 11775844,
        "receive_currencies": [
            "BTC",
            "CNY",
            "DYM",
            "EUR",
            "JOE",
            "MXN",
            "USD",
            "015841551A748AD2C1F76FF6ECB0CCCD00000000"
        ],
        "send_currencies": [
            "ASP",
            "BTC",
            "CHF",
            "CNY",
            "DYM",
            "EUR",
            "JOE",
            "JPY",
            "MXN",
            "USD"
        ],
        "validated": true
    },
    "status": "success",
    "type": "response"
}
```

*JSON-RPC*

```
200 OK
{
    "result": {
        "ledger_index": 11775823,
        "receive_currencies": [
            "BTC",
            "CNY",
            "DYM",
            "EUR",
            "JOE",
            "MXN",
            "USD",
            "015841551A748AD2C1F76FF6ECB0CCCD00000000"
        ],
        "send_currencies": [
            "ASP",
            "BTC",
            "CHF",
            "CNY",
            "DYM",
            "EUR",
            "JOE",
            "JPY",
            "MXN",
            "USD"
        ],
        "status": "success",
        "validated": true
    }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| ledger\_hash | String | (May be omitted) The identifying hash of the ledger version used to retrieve this data, as hex. |
| ledger\_index | Integer | The sequence number of the ledger version used to retrieve this data. |
| receive\_currencies | Array of Strings | Array of currency codes for currencies that this account can receive. Each currency is either a 3-letter [ISO 4217 Currency Code](http://www.xe.com/iso4217.php) or a 160-bit hex value according to the [currency format](https://wiki.ripple.com/Currency_format). |
| send\_currencies | Array of Strings |  Array of currency codes for currencies that this account can send. Each currency is either a 3-letter [ISO 4217 Currency Code](http://www.xe.com/iso4217.php) or a 160-bit hex value according to the [currency format](https://wiki.ripple.com/Currency_format). |
| validated | Boolean | If `true`, this data comes from a validated ledger. |

*Note:* The currencies that an account can send or receive are defined based on a simple check of its trust lines. If an account has a trust line for a currency and enough room to increase its balance, it can receive that currency. If the trust line's balance can go down, the account can send that currency. This method *does not* check whether the trust line is frozen or authorized.

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The address specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.



## account_info ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/AccountInfo.cpp "Source")

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
rippled account_info r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 true
```

</div>

[Try it! >](ripple-api-tool.html#account_info)

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
| account_data.Flags | 32-bit unsigned integer | Integer with different bits representing the status of several [account flags](ripple-ledger.html#accountroot-flags) |
| account_data.LedgerEntryType | String | "AccountRoot" is the type of ledger entry that holds an account's data |
| account_data.OwnerCount | Integer | Number of other ledger entries (specifically, trust lines and offers) attributed to this account. This is used to calculate the total reserve required to use the account. |
| account\_data.PreviousTxnID | String | Hash value representing the most recent transaction that affected this account node directly. **Note:** This does not include all changes to the account's trust lines and offers. Use [account_tx](#account-tx) to get a more inclusive list. |
| account_data.Sequence | Integer | The sequence number of the next valid transaction for this account. (Each account starts with Sequence = 1 and increases each time a transaction is made.) |
| account_data.index | String | A unique index for the AccountRoot node that represents this account in the ledger. |
| ledger_current_index | Integer | (Omitted if `ledger_index` is provided instead) The sequence number of the most-current ledger, which was used when retrieving this information. The information does not contain any changes from ledgers newer than this one.  |
| ledger_index | Integer | (Omitted if `ledger_current_index` is provided instead) The sequence number of the ledger used when retrieving this information. The information does not contain any changes from ledgers newer than this one. |
| validated | Boolean | True if this data is from a validated ledger version; if omitted or set to false, this data is not final. ([New in version 0.26](https://ripplelabs.atlassian.net/browse/RIPD-275)) |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The address specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.



## account_lines ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/AccountLines.cpp "Source")

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

*JSON-RPC*

```
{
    "method": "account_lines",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "ledger": "current"
        }
    ]
}
```

</div>

[Try it! >](ripple-api-tool.html#account_lines)

The request accepts the following paramters:

| Field | Type | Description |
|-------|------|-------------|
| account | String | A unique identifier for the account, most commonly the account's address as a base-58 string. |
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger-instance))|
| peer | String | (Optional) A unique ID for a second account. If provided, show only lines of trust connecting the two accounts. |
| limit | Integer | (Optional, default varies) Limit the number of transactions to retrieve. The server is not required to honor this value. Cannot be smaller than 10 or larger than 400. ([New in 0.26.4](https://ripplelabs.atlassian.net/browse/RIPD-343)) |
| marker | [(Not Specified)](#markers-and-pagination) | (Optional) Server-provided value to specify where to resume retrieving data from. ([New in 0.26.4](https://ripplelabs.atlassian.net/browse/RIPD-343)) |

The following parameters are deprecated and may be removed without further notice: `ledger` and `peer_index`.

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
                "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                "balance": "5",
                "currency": "USD",
                "limit": "5",
                "limit_peer": "0",
                "no_ripple": true,
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rHpXfibHgSb64n8kK9QWDpdbfqSpYbM9a4",
                "balance": "481.992867407479",
                "currency": "MXN",
                "limit": "1000",
                "limit_peer": "0",
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                "balance": "0.793598266778297",
                "currency": "EUR",
                "limit": "1",
                "limit_peer": "0",
                "no_ripple": true,
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
                "balance": "0",
                "currency": "CNY",
                "limit": "3",
                "limit_peer": "0",
                "no_ripple": true,
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
                "balance": "1.326889190631542",
                "currency": "DYM",
                "limit": "3",
                "limit_peer": "0",
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                "balance": "0.3488146605801446",
                "currency": "CHF",
                "limit": "0",
                "limit_peer": "0",
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                "balance": "0",
                "currency": "BTC",
                "limit": "3",
                "limit_peer": "0",
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                "balance": "10.06051402019741",
                "currency": "USD",
                "limit": "5000",
                "limit_peer": "0",
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rpgKWEmNqSDAGFhy5WDnsyPqfQxbWxKeVd",
                "balance": "-0.00111",
                "currency": "BTC",
                "limit": "0",
                "limit_peer": "10",
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rBJ3YjwXi2MGbg7GVLuTXUWQ8DjL7tDXh4",
                "balance": "-0.0008744482690504699",
                "currency": "BTC",
                "limit": "0",
                "limit_peer": "10",
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                "balance": "0.982191732527743",
                "currency": "USD",
                "limit": "1",
                "limit_peer": "0",
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA",
                "balance": "9.07619790068559",
                "currency": "CNY",
                "limit": "100",
                "limit_peer": "0",
                "no_ripple": true,
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                "balance": "7.292695098901099",
                "currency": "JPY",
                "limit": "0",
                "limit_peer": "0",
                "no_ripple": true,
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
                "balance": "0",
                "currency": "AUX",
                "limit": "0",
                "limit_peer": "0",
                "no_ripple": true,
                "no_ripple_peer": true,
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "r9vbV3EHvXWjSkeQ6CAcYVPGeq7TuiXY2X",
                "balance": "0",
                "currency": "USD",
                "limit": "1",
                "limit_peer": "0",
                "no_ripple": true,
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                "balance": "12.41688780720394",
                "currency": "EUR",
                "limit": "100",
                "limit_peer": "0",
                "no_ripple": true,
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rfF3PNkwkq1DygW2wum2HK3RGfgkJjdPVD",
                "balance": "35",
                "currency": "USD",
                "limit": "500",
                "limit_peer": "0",
                "no_ripple": true,
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rwUVoVMSURqNyvocPCcvLu3ygJzZyw8qwp",
                "balance": "-5",
                "currency": "JOE",
                "limit": "0",
                "limit_peer": "50",
                "no_ripple_peer": true,
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rE6R3DWF9fBD7CyiQciePF9SqK58Ubp8o2",
                "balance": "0",
                "currency": "USD",
                "limit": "0",
                "limit_peer": "100",
                "no_ripple_peer": true,
                "quality_in": 0,
                "quality_out": 0
            },
            {
                "account": "rE6R3DWF9fBD7CyiQciePF9SqK58Ubp8o2",
                "balance": "0",
                "currency": "JOE",
                "limit": "0",
                "limit_peer": "100",
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
            },
            {
                "account": "rEhDDUUNxpXgEHVJtC2cjXAgyx5VCFxdMF",
                "balance": "0",
                "currency": "USD",
                "limit": "0",
                "limit_peer": "1",
                "quality_in": 0,
                "quality_out": 0
            }
        ],
        "status": "success"
    }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the address of the account and an array of trust-line objects. Specifically, the result object contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| account | String | Unique address of the account this request corresponds to |
| lines | Array | Array of trust-line objects, as described below. If the number of trust-lines is large, only returns up to the `limit` at a time. |
| ledger\_current\_index | Integer | (Omitted if `ledger_hash` or `ledger_index` provided) Sequence number of the ledger version used when retrieving this data. ([New in 0.26.4-sp1](https://ripplelabs.atlassian.net/browse/RIPD-682)) |
| ledger\_index | Integer | (Omitted if `ledger_current_index` provided instead) Sequence number, provided in the request, of the ledger version that was used when retrieving this data. ([New in 0.26.4-sp1](https://ripplelabs.atlassian.net/browse/RIPD-682)) |
| ledger\_hash | String | (May be omitted) Hex hash, provided in the request, of the ledger version that was used when retrieving this data. ([New in 0.26.4-sp1](https://ripplelabs.atlassian.net/browse/RIPD-682)) |
| marker | [(Not Specified)](#markers-and-pagination) | Server-defined value. Pass this to the next call in order to resume where this call left off. Omitted when there are no additional pages after this one. ([New in 0.26.4](https://ripplelabs.atlassian.net/browse/RIPD-343)) |

Each trust-line object has some combination of the following fields:

| Field | Type | Description |
|-------|------|-------------|
| account | String | The unique address of the account this line applies to. |
| balance | String | Representation of the numeric balance currently held against this line. A positive balance means that the account holds value; a negative balance means that the account owes value. |
| currency | String | The currency this line applies to |
| limit | String | The maximum amount of the given currency that this account is willing to owe the peer account |
| limit\_peer | String | The maximum amount of currency that the peer account is willing to owe this account |
| quality\_in | Unsigned Integer | Rate at which the account values incoming balances on this trust line, as a ratio of this value per 1 billion units. (For example, a value of 500 million represents a 0.5:1 ratio.) As a special case, 0 is treated as a 1:1 ratio. |
| quality\_out | Unsigned Integer | Rate at which the account values outgoing balances on this trust line, as a ratio of this value per 1 billion units. (For example, a value of 500 million represents a 0.5:1 ratio.) As a special case, 0 is treated as a 1:1 ratio. |
| no\_ripple | Boolean | (May be omitted) `true` if this account has enabled the [NoRipple flag](https://ripple.com/knowledge_center/understanding-the-noripple-flag/) for this line. If omitted, that is the same as `false`. |
| no\_ripple\_peer | Boolean | (May be omitted) `true` if the peer account has enabled the [NoRipple flag](https://ripple.com/knowledge_center/understanding-the-noripple-flag/). If omitted, that is the same as `false`. |
| freeze | Boolean | (May be omitted) `true` if this account has [frozen](freeze.html) this trust line. If omitted, that is the same as `false`. |
| freeze\_peer | (May be omitted) `true` if the peer account has [frozen](freeze.html) this trust line. If omitted, that is the same as `false`. |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The address specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `actMalformed` - If the `marker` field provided is not acceptable. (See [RIPD-684](https://ripplelabs.atlassian.net/browse/RIPD-684))


## account_offers ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/AccountOffers.cpp "Source")

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

*JSON-RPC*

```
{
    "method": "account_offers",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "ledger_index": "current"
        }
    ]
}
```

*Commandline*

```
#Syntax: account_offers account [ledger_index]
rippled account_offers r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 current
```

</div>

[Try it! >](ripple-api-tool.html#account_offers)

A request can include the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| account | String | A unique identifier for the account, most commonly the account's address as a base-58 string. |
| ledger | Unsigned integer, or String | (Deprecated, Optional) A unique identifier for the ledger version to use, such as a ledger sequence number, a hash, or a shortcut such as "validated". |
| ledger_hash | String | (Optional) A 20-byte hex string identifying the ledger version to use. |
| ledger_index | (Optional) Unsigned integer, or String | (Optional, defaults to `current`) The sequence number of the ledger to use, or "current", "closed", or "validated" to select a ledger dynamically. (See Ledger Indexes.) |
| limit | Integer | (Optional, default varies) Limit the number of transactions to retrieve. The server is not required to honor this value. Cannot be lower than 10 or higher than 400. ([New in 0.26.4](https://ripplelabs.atlassian.net/browse/RIPD-344)) |
| marker | [(Not Specified)](#markers-and-pagination) | Server-provided value to specify where to resume retrieving data from. ([New in 0.26.4](https://ripplelabs.atlassian.net/browse/RIPD-344)) |

The following parameter is deprecated and may be removed without further notice: `ledger`.

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

*JSON-RPC*

```
200 OK
{
    "result": {
        "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "offers": [],
        "status": "success"
    }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| account | String | Unique address identifying the account that made the offers |
| offers | Array | Array of objects, where each object represents an offer made by this account that is outstanding as of the requested ledger version. If the number of offers is large, only returns up to `limit` at a time. |
| ledger\_current\_index | Integer | (Omitted if `ledger_hash` or `ledger_index` provided) Sequence number of the ledger version used when retrieving this data. ([New in 0.26.4-sp1](https://ripplelabs.atlassian.net/browse/RIPD-682)) |
| ledger\_index | Integer | (Omitted if `ledger_current_index` provided instead) Sequence number, provided in the request, of the ledger version that was used when retrieving this data. ([New in 0.26.4-sp1](https://ripplelabs.atlassian.net/browse/RIPD-682)) |
| ledger\_hash | String | (May be omitted) Hex hash, provided in the request, of the ledger version that was used when retrieving this data. ([New in 0.26.4-sp1](https://ripplelabs.atlassian.net/browse/RIPD-682)) |
| marker | [(Not Specified)](#markers-and-pagination) | Server-defined value. Pass this to the next call in order to resume where this call left off. Omitted when there are no pages of information after this one. ([New in 0.26.4](https://ripplelabs.atlassian.net/browse/RIPD-344)) |


Each offer object contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| flags | Unsigned integer | Options set for this offer entry as bit-flags. |
| seq | Unsigned integer | Sequence number of the transaction that created this entry. (Transaction sequence numbers are relative to accounts.) |
| taker_gets | String or Object | The amount the account accepting the offer receives, as a String representing an amount in XRP, or a currency specification object. (See [Specifying Currency Amounts](#specifying-currency-amounts)) |
| taker_pays | String or Object | The amount the account accepting the offer provides, as a String representing an amount in XRP, or a currency specification object. (See [Specifying Currency Amounts](#specifying-currency-amounts)) |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The address specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `actMalformed` - If the `marker` field provided is not acceptable. (See [RIPD-684](https://ripplelabs.atlassian.net/browse/RIPD-684))


## account_objects ##
[[Source]<br>](https://github.com/ripple/rippled/blob/399c43cae6e90a428e9ce6a988123972b0f03c99/src/ripple/rpc/handlers/AccountObjects.cpp "Source")

The `account_objects` command returns the raw [ledger format][] for all objects owned by an account, such as [outstanding offers](transactions.html#lifecycle-of-an-offer), trust lines in non-default state, and tickets (which are part of forthcoming multi-sign code). For getting the balance of an account's trust lines, we recommend [`account_lines`](#account-lines) instead.

[ledger format]: ripple-ledger.html

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
{
  "id": 1,
  "command": "account_objects",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "ledger_index": "validated",
  "type": "state",
  "limit": 10
}
```

*JSON-RPC*

```
{
    "method": "account_objects",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "ledger_index": "validated",
            "limit": 10,
            "type": "state"
        }
    ]
}
```


*Commandline*

```
#Syntax: account_objects <account> [<ledger>]
rippled account_objects r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 validated
```

</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| account | String | A unique identifier for the account, most commonly the account's address. |
| type | String | (Optional) If included, filter results to include only this type of ledger node. Valid types include `state` (trust lines), `offer` (offers), and `ticket` (part of the forthcoming signing process). |
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger-instance))|
| limit   | Unsigned Integer | (Optional) The maximum number of objects to include in the results. Cannot be less than 10 or higher than 400 on non-admin connections. Defaults to 200. |
| marker | [(Not Specified)](#markers-and-pagination) | (Optional) Server-provided value to specify where to resume retrieving data from. |

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
        "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "account_objects": [
            {
                "Balance": {
                    "currency": "ASP",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 65536,
                "HighLimit": {
                    "currency": "ASP",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "ASP",
                    "issuer": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
                    "value": "10"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "BF7555B0F018E3C5E2A3FF9437A1A5092F32903BE246202F988181B9CED0D862",
                "PreviousTxnLgrSeq": 1438879,
                "index": "2243B0B630EA6F7330B654EFA53E27A7609D9484E535AB11B7F946DF3D247CE9"
            },
            {
                "Balance": {
                    "currency": "XAU",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 3342336,
                "HighLimit": {
                    "currency": "XAU",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "XAU",
                    "issuer": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
                    "value": "0"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "79B26D7D34B950AC2C2F91A299A6888FABB376DD76CFF79D56E805BF439F6942",
                "PreviousTxnLgrSeq": 5982530,
                "index": "9ED4406351B7A511A012A9B5E7FE4059FA2F7650621379C0013492C315E25B97"
            },
            {
                "Balance": {
                    "currency": "USD",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 1114112,
                "HighLimit": {
                    "currency": "USD",
                    "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "USD",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "5"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "6FE8C824364FB1195BCFEDCB368DFEE3980F7F78D3BF4DC4174BB4C86CF8C5CE",
                "PreviousTxnLgrSeq": 10555014,
                "index": "2DECFAC23B77D5AEA6116C15F5C6D4669EBAEE9E7EE050A40FE2B1E47B6A9419"
            },
            {
                "Balance": {
                    "currency": "MXN",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "481.992867407479"
                },
                "Flags": 65536,
                "HighLimit": {
                    "currency": "MXN",
                    "issuer": "rHpXfibHgSb64n8kK9QWDpdbfqSpYbM9a4",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "MXN",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "1000"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "A467BACE5F183CDE1F075F72435FE86BAD8626ED1048EDEFF7562A4CC76FD1C5",
                "PreviousTxnLgrSeq": 3316170,
                "index": "EC8B9B6B364AF6CB6393A423FDD2DDBA96375EC772E6B50A3581E53BFBDFDD9A"
            },
            {
                "Balance": {
                    "currency": "EUR",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0.793598266778297"
                },
                "Flags": 1114112,
                "HighLimit": {
                    "currency": "EUR",
                    "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "EUR",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "1"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "E9345D44433EA368CFE1E00D84809C8E695C87FED18859248E13662D46A0EC46",
                "PreviousTxnLgrSeq": 5447146,
                "index": "4513749B30F4AF8DA11F077C448128D6486BF12854B760E4E5808714588AA915"
            },
            {
                "Balance": {
                    "currency": "CNY",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 2228224,
                "HighLimit": {
                    "currency": "CNY",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "3"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "CNY",
                    "issuer": "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
                    "value": "0"
                },
                "LowNode": "0000000000000008",
                "PreviousTxnID": "2FDDC81F4394695B01A47913BEC4281AC9A283CC8F903C14ADEA970F60E57FCF",
                "PreviousTxnLgrSeq": 5949673,
                "index": "578C327DA8944BDE2E10C9BA36AFA2F43E06C8D1E8819FB225D266CBBCFDE5CE"
            },
            {
                "Balance": {
                    "currency": "DYM",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "1.336889190631542"
                },
                "Flags": 65536,
                "HighLimit": {
                    "currency": "DYM",
                    "issuer": "rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "DYM",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "3"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "6DA2BD02DFB83FA4DAFC2651860B60071156171E9C021D9E0372A61A477FFBB1",
                "PreviousTxnLgrSeq": 8818732,
                "index": "5A2A5FF12E71AEE57564E624117BBA68DEF78CD564EF6259F92A011693E027C7"
            },
            {
                "Balance": {
                    "currency": "CHF",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "-0.3488146605801446"
                },
                "Flags": 131072,
                "HighLimit": {
                    "currency": "CHF",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "CHF",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "value": "0"
                },
                "LowNode": "000000000000008C",
                "PreviousTxnID": "722394372525A13D1EAAB005642F50F05A93CF63F7F472E0F91CDD6D38EB5869",
                "PreviousTxnLgrSeq": 2687590,
                "index": "F2DBAD20072527F6AD02CE7F5A450DBC72BE2ABB91741A8A3ADD30D5AD7A99FB"
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
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "3"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "BTC",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "value": "0"
                },
                "LowNode": "0000000000000043",
                "PreviousTxnID": "03EDF724397D2DEE70E49D512AECD619E9EA536BE6CFD48ED167AE2596055C9A",
                "PreviousTxnLgrSeq": 8317037,
                "index": "767C12AF647CDF5FEB9019B37018748A79C50EDAF87E8D4C7F39F78AA7CA9765"
            },
            {
                "Balance": {
                    "currency": "USD",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "-16.00534471983042"
                },
                "Flags": 131072,
                "HighLimit": {
                    "currency": "USD",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "5000"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "USD",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "value": "0"
                },
                "LowNode": "000000000000004A",
                "PreviousTxnID": "CFFF5CFE623C9543308C6529782B6A6532207D819795AAFE85555DB8BF390FE7",
                "PreviousTxnLgrSeq": 14365854,
                "index": "826CF5BFD28F3934B518D0BDF3231259CBD3FD0946E3C3CA0C97D2C75D2D1A09"
            }
        ],
        "ledger_hash": "053DF17D2289D1C4971C22F235BC1FCA7D4B3AE966F842E5819D0749E0B8ECD3",
        "ledger_index": 14378733,
        "limit": 10,
        "marker": "F60ADF645E78B69857D2E4AEC8B7742FEABC8431BD8611D099B428C3E816DF93,94A9F05FEF9A153229E2E997E64919FD75AAE2028C8153E8EBDB4440BD3ECBB5",
        "validated": true
    }
}
```

*JSON-RPC*

```
200 OK
{
    "result": {
        "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "account_objects": [
            {
                "Balance": {
                    "currency": "ASP",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 65536,
                "HighLimit": {
                    "currency": "ASP",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "ASP",
                    "issuer": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
                    "value": "10"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "BF7555B0F018E3C5E2A3FF9437A1A5092F32903BE246202F988181B9CED0D862",
                "PreviousTxnLgrSeq": 1438879,
                "index": "2243B0B630EA6F7330B654EFA53E27A7609D9484E535AB11B7F946DF3D247CE9"
            },
            {
                "Balance": {
                    "currency": "XAU",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 3342336,
                "HighLimit": {
                    "currency": "XAU",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "XAU",
                    "issuer": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
                    "value": "0"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "79B26D7D34B950AC2C2F91A299A6888FABB376DD76CFF79D56E805BF439F6942",
                "PreviousTxnLgrSeq": 5982530,
                "index": "9ED4406351B7A511A012A9B5E7FE4059FA2F7650621379C0013492C315E25B97"
            },
            {
                "Balance": {
                    "currency": "USD",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 1114112,
                "HighLimit": {
                    "currency": "USD",
                    "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "USD",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "5"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "6FE8C824364FB1195BCFEDCB368DFEE3980F7F78D3BF4DC4174BB4C86CF8C5CE",
                "PreviousTxnLgrSeq": 10555014,
                "index": "2DECFAC23B77D5AEA6116C15F5C6D4669EBAEE9E7EE050A40FE2B1E47B6A9419"
            },
            {
                "Balance": {
                    "currency": "MXN",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "481.992867407479"
                },
                "Flags": 65536,
                "HighLimit": {
                    "currency": "MXN",
                    "issuer": "rHpXfibHgSb64n8kK9QWDpdbfqSpYbM9a4",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "MXN",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "1000"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "A467BACE5F183CDE1F075F72435FE86BAD8626ED1048EDEFF7562A4CC76FD1C5",
                "PreviousTxnLgrSeq": 3316170,
                "index": "EC8B9B6B364AF6CB6393A423FDD2DDBA96375EC772E6B50A3581E53BFBDFDD9A"
            },
            {
                "Balance": {
                    "currency": "EUR",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0.793598266778297"
                },
                "Flags": 1114112,
                "HighLimit": {
                    "currency": "EUR",
                    "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "EUR",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "1"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "E9345D44433EA368CFE1E00D84809C8E695C87FED18859248E13662D46A0EC46",
                "PreviousTxnLgrSeq": 5447146,
                "index": "4513749B30F4AF8DA11F077C448128D6486BF12854B760E4E5808714588AA915"
            },
            {
                "Balance": {
                    "currency": "CNY",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 2228224,
                "HighLimit": {
                    "currency": "CNY",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "3"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "CNY",
                    "issuer": "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
                    "value": "0"
                },
                "LowNode": "0000000000000008",
                "PreviousTxnID": "2FDDC81F4394695B01A47913BEC4281AC9A283CC8F903C14ADEA970F60E57FCF",
                "PreviousTxnLgrSeq": 5949673,
                "index": "578C327DA8944BDE2E10C9BA36AFA2F43E06C8D1E8819FB225D266CBBCFDE5CE"
            },
            {
                "Balance": {
                    "currency": "DYM",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "1.336889190631542"
                },
                "Flags": 65536,
                "HighLimit": {
                    "currency": "DYM",
                    "issuer": "rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "DYM",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "3"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "6DA2BD02DFB83FA4DAFC2651860B60071156171E9C021D9E0372A61A477FFBB1",
                "PreviousTxnLgrSeq": 8818732,
                "index": "5A2A5FF12E71AEE57564E624117BBA68DEF78CD564EF6259F92A011693E027C7"
            },
            {
                "Balance": {
                    "currency": "CHF",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "-0.3488146605801446"
                },
                "Flags": 131072,
                "HighLimit": {
                    "currency": "CHF",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "CHF",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "value": "0"
                },
                "LowNode": "000000000000008C",
                "PreviousTxnID": "722394372525A13D1EAAB005642F50F05A93CF63F7F472E0F91CDD6D38EB5869",
                "PreviousTxnLgrSeq": 2687590,
                "index": "F2DBAD20072527F6AD02CE7F5A450DBC72BE2ABB91741A8A3ADD30D5AD7A99FB"
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
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "3"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "BTC",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "value": "0"
                },
                "LowNode": "0000000000000043",
                "PreviousTxnID": "03EDF724397D2DEE70E49D512AECD619E9EA536BE6CFD48ED167AE2596055C9A",
                "PreviousTxnLgrSeq": 8317037,
                "index": "767C12AF647CDF5FEB9019B37018748A79C50EDAF87E8D4C7F39F78AA7CA9765"
            },
            {
                "Balance": {
                    "currency": "USD",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "-16.00534471983042"
                },
                "Flags": 131072,
                "HighLimit": {
                    "currency": "USD",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "5000"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "USD",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "value": "0"
                },
                "LowNode": "000000000000004A",
                "PreviousTxnID": "CFFF5CFE623C9543308C6529782B6A6532207D819795AAFE85555DB8BF390FE7",
                "PreviousTxnLgrSeq": 14365854,
                "index": "826CF5BFD28F3934B518D0BDF3231259CBD3FD0946E3C3CA0C97D2C75D2D1A09"
            }
        ],
        "ledger_hash": "4C99E5F63C0D0B1C2283B4F5DCE2239F80CE92E8B1A6AED1E110C198FC96E659",
        "ledger_index": 14380380,
        "limit": 10,
        "marker": "F60ADF645E78B69857D2E4AEC8B7742FEABC8431BD8611D099B428C3E816DF93,94A9F05FEF9A153229E2E997E64919FD75AAE2028C8153E8EBDB4440BD3ECBB5",
        "status": "success",
        "validated": true
    }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| account | String | Unique address of the account this request corresponds to |
| account\_objects | Array | Array of objects owned by this account. Each object is in its raw [ledger format][]. |
| ledger\_hash | String | (May be omitted) The identifying hash of the ledger that was used to generate this response. |
| ledger\_index | Number | (May be omitted) The sequence number of the ledger version that was used to generate this response. |
| ledger\_current\_index | Number | (May be omitted) The sequence number of the current in-progress ledger version that was used to generate this response. |
| limit | Number | (May be omitted) The limit that was used in this request, if any. |
| marker | [(Not Specified)](#markers-and-pagination) | Server-defined value. Pass this to the next call in order to resume where this call left off. Omitted when there are no additional pages after this one. |
| validated | Boolean | If `true`, this information comes from ledger version that has been validated by consensus. |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The address specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.



## account_tx ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/AccountTx.cpp "Source")

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
  "limit": 2,
  "forward": false
}
```

*JSON-RPC*
```
{
    "method": "account_tx",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "binary": false,
            "count": false,
            "descending": false,
            "forward": false,
            "ledger_index_max": -1,
            "ledger_index_min": -1,
            "limit": 2,
            "offset": 1
        }
    ]
}
```

*Commandline*
```
#Syntax account_tx account [ledger_index_min [ledger_index_max [limit]]] [binary] [count] [forward]
rippled account_tx r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 -1 -1 2 false false false
```

</div>

[Try it! >](ripple-api-tool.html#account_tx)

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| account | String | A unique identifier for the account, most commonly the account's address. | 
| ledger\_index\_min | Integer | Use to specify the earliest ledger to include transactions from. A value of `-1` instructs the server to use the earliest validated ledger version available. |
| ledger\_index\_max | Integer | Use to specify the most recent ledger to include transactions from. A value of `-1` instructs the server to use the most recent validated ledger version available. |
| ledger\_hash | String | (Optional) Use instead of ledger\_index\_min and ledger\_index\_max to look for transactions from a single ledger only. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger\_index | String or Unsigned Integer | (Optional) Use instead of ledger\_index\_min and ledger\_index\_max to look for transactions from a single ledger only. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| binary | Boolean | (Optional, defaults to False) If set to True, return transactions as hex strings instead of JSON. |
| forward | boolean | (Optional, defaults to False) If set to True, return values indexed with the oldest ledger first. Otherwise, the results are indexed with the newest ledger first. (Each page of results may not be internally ordered, but the pages are overall ordered.) |
| limit | Integer | (Optional, default varies) Limit the number of transactions to retrieve. The server is not required to honor this value. |
| marker | [(Not Specified)](#markers-and-pagination) | Server-provided value to specify where to resume retrieving data from. This value is stable even if there is a change in the server's range of available ledgers. |

[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/AccountTxSwitch.cpp "Source")
There is also a deprecated legacy variation of the `account_tx` method. For that reason, we recommend *not using any of the following fields*: `offset`, `count`, `descending`, `ledger_max`, `ledger_min`.

##### **Iterating over queried data** ######

As with other paginated methods, you can use the `marker` field to return multiple pages of data.

In the time between requests, `"ledger_index_min": -1` and `"ledger_index_max": -1` may change to refer to different ledger versions than they did before. The `marker` field can safely paginate even if there are changes in the ledger range from the request, so long as the marker does not indicate a point outside the range of ledgers specified in the request.

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

*JSON-RPC*
```
200 OK
{
    "result": {
        "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "ledger_index_max": 8696227,
        "ledger_index_min": 32570,
        "limit": 2,
        "offset": 1,
        "status": "success",
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
| ledger\_index\_min | Integer | The sequence number of the earliest ledger actually searched for transactions. |
| ledger\_index\_max | Integer | The sequence number of the most recent ledger actually searched for transactions. |
| limit | Integer | The `limit` value used in the request. (This may differ from the actual limit value enforced by the server.) |
| marker | [(Not Specified)](#markers-and-pagination) | Server-defined value. Pass this to the next call in order to resume where this call left off. |
| offset | Integer | The `offset` value used in the request. |
| transactions | Array | Array of transactions matching the request's criteria, as explained below. |
| validated | Boolean | If included and set to `true`, the information in this request comes from a validated ledger version. Otherwise, the information is subject to change. |

__*Note:*__ The server may respond with different values of `ledger_index_min` and `ledger_index_max` than you provided in the request, for example if it did not have the versions you specified on hand.

Each transaction object includes the following fields, depending on whether it was requested in JSON or hex string (`"binary":true`) format.

| Field | Type | Description |
|-------|------|-------------|
| ledger_index | Integer | The sequence number of the ledger version that included this transaction. |
| meta | Object (JSON) or String (Binary) | If `binary` is True, then this is a hex string of the transaction metadata. Otherwise, the transaction metadata is included in JSON format. |
| tx | Object | (JSON mode only) JSON object defining the transaction |
| tx_blob | String | (Binary mode only) Unique hashed String representing the transaction. |
| validated | Boolean | Whether or not the transaction is included in a validated ledger. Any transaction not yet in a validated ledger is subject to change. |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actMalformed` - If the address specified in the `account` field of the request is not formatted properly.
* `actBitcoin` - If the address specified in the `account` field is formatted like a Bitcoin address instead of a Ripple address.
* `lgrIdxsInvalid` - If the ledger specified by the `ledger_index_min` or `ledger_index_max` does not exist, or if it does exist but the server does not have it.


## noripple_check ##
[[Source]<br>](https://github.com/ripple/rippled/blob/9111ad1a9dc37d49d085aa317712625e635197c0/src/ripple/rpc/handlers/NoRippleCheck.cpp "Source")

The `noripple_check` command provides a quick way to check the status of [the DefaultRipple field for an account and the NoRipple flag of its trust lines](https://ripple.com/knowledge_center/understanding-the-noripple-flag/), compared with the recommended settings.

#### Request Format ####
An example of the request format:

<div class='multicode'>

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

</div>

**Note:** There is no command-line syntax for this method. Use the [`json` command](#json) to access this from the command line.

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| account | String | A unique identifier for the account, most commonly the account's address. |
| role    | String | Whether the account refers to a `gateway` or `user`. Recommendations depend on the role of the account. Gateways must have DefaultRipple enabled and must disable NoRipple on all trust lines. Users should have DefaultRipple disabled, and should enable NoRipple on all trust lines. |
| transactions | Boolean | (Optional) If `true`, include an array of suggested [transactions](transactions.html), as JSON objects, that you can sign and submit to fix the problems. Defaults to false. |
| limit   | Unsigned Integer | (Optional) The maximum number of trust line problems to include in the results. Defaults to 300. |
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger-instance))|

#### Response Format ####

An example of a successful response:

<div class='multicode'>

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
            "You should clear the no ripple flag on your USD line to rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
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

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| ledger\_current\_index | Number | The sequence number of the ledger used to calculate these results. |
| problems | Array | Array of strings with human-readable descriptions of the problems. This includes up to one entry if the account's DefaultRipple setting is not as recommended, plus up to `limit` entries for trust lines whose NoRipple setting is not as recommended. |
| transactions | Array | (May be omitted) If the request specified `transactions` as `true`, this is an array of JSON objects, each of which is the JSON form of a [transaction](transactions.html) that should fix one of the described problems. The length of this array is the same as the `problems` array, and each entry is intended to fix the problem described at the same index into that array. |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The address specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.


## gateway_balances ##
[[Source]<br>](https://github.com/ripple/rippled/blob/9111ad1a9dc37d49d085aa317712625e635197c0/src/ripple/rpc/handlers/GatewayBalances.cpp "Source")

The `gateway_balances` command calculates the total balances issued by a given account, optionally excluding amounts held by specific "hot wallet" addresses. _(New in [version 0.28.2](https://github.com/ripple/rippled/releases/tag/0.28.2).)_

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
{
    "id": "example_gateway_balances_1",
    "command": "gateway_balances",
    "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
    "strict": true,
    "hotwallet": ["rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ","ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt"],
    "ledger_index": "validated"
}
```

*JSON-RPC*

```
{
    "method": "gateway_balances",
    "params": [
        {
            "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
            "hotwallet": [
                "rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ",
                "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt"
            ],
            "ledger_index": "validated",
            "strict": true
        }
    ]
}
```

</div>

The request includes the following parameters:

| Field     | Type    | Description |
|-----------|---------|-------------|
| account   | String  | The address of the account to use |
| strict    | Boolean | (Optional) If true, only accept an address or public key for the account parameter. Defaults to false. |
| hotwallet | String or Array | The address of a hot wallet account to exclude from the balances issued, or an array of such addresses. |
| ledger\_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger\_index | String or Unsigned Integer| (Optional) The sequence number of the ledger version to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger-instance))|

#### Response Format ####

An example of a successful response:

<div class='multicode'>

*WebSocket*

```
{
  "id": 3,
  "status": "success",
  "type": "response",
  "result": {
    "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
    "assets": {
      "r9F6wk8HkXrgYWoJ7fsv4VrUBVoqDVtzkH": [
        {
          "currency": "BTC",
          "value": "5444166510000000e-26"
        }
      ],
      "rPFLkxQk6xUGdGYEykqe7PR25Gr7mLHDc8": [
        {
          "currency": "EUR",
          "value": "4000000000000000e-27"
        }
      ],
      "rPU6VbckqCLW4kb51CWqZdxvYyQrQVsnSj": [
        {
          "currency": "BTC",
          "value": "1029900000000000e-26"
        }
      ],
      "rpR95n1iFkTqpoy1e878f4Z1pVHVtWKMNQ": [
        {
          "currency": "BTC",
          "value": "4000000000000000e-30"
        }
      ],
      "rwmUaXsWtXU4Z843xSYwgt1is97bgY8yj6": [
        {
          "currency": "BTC",
          "value": "8700000000000000e-30"
        }
      ]
    },
    "balances": {
      "rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ": [
        {
          "currency": "EUR",
          "value": "29826.1965999999"
        }
      ],
      "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt": [
        {
          "currency": "USD",
          "value": "13857.70416"
        }
      ]
    },
    "ledger_hash": "61DDBF304AF6E8101576BF161D447CA8E4F0170DDFBEAFFD993DC9383D443388",
    "ledger_index": 14483195,
    "obligations": {
      "BTC": "5908.324927635318",
      "EUR": "992471.7419793958",
      "GBP": "4991.38706013193",
      "USD": "1997134.20229482"
    },
    "validated": true
  }
}
```

*JSON-RPC*

```
200 OK
{
    "result": {
        "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
        "assets": {
            "r9F6wk8HkXrgYWoJ7fsv4VrUBVoqDVtzkH": [
                {
                    "currency": "BTC",
                    "value": "5444166510000000e-26"
                }
            ],
            "rPFLkxQk6xUGdGYEykqe7PR25Gr7mLHDc8": [
                {
                    "currency": "EUR",
                    "value": "4000000000000000e-27"
                }
            ],
            "rPU6VbckqCLW4kb51CWqZdxvYyQrQVsnSj": [
                {
                    "currency": "BTC",
                    "value": "1029900000000000e-26"
                }
            ],
            "rpR95n1iFkTqpoy1e878f4Z1pVHVtWKMNQ": [
                {
                    "currency": "BTC",
                    "value": "4000000000000000e-30"
                }
            ],
            "rwmUaXsWtXU4Z843xSYwgt1is97bgY8yj6": [
                {
                    "currency": "BTC",
                    "value": "8700000000000000e-30"
                }
            ]
        },
        "balances": {
            "rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ": [
                {
                    "currency": "EUR",
                    "value": "29826.1965999999"
                }
            ],
            "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt": [
                {
                    "currency": "USD",
                    "value": "13857.70416"
                }
            ]
        },
        "ledger_hash": "980FECF48CA4BFDEC896692C31A50D484BDFE865EC101B00259C413AA3DBD672",
        "ledger_index": 14483212,
        "obligations": {
            "BTC": "5908.324927635318",
            "EUR": "992471.7419793958",
            "GBP": "4991.38706013193",
            "USD": "1997134.20229482"
        },
        "status": "success",
        "validated": true
    }
}
```

</div>

**Note:** There is no command-line syntax for this method. Use the [`json` command](#json) to access this from the command line.

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| obligations | Object | (Omitted if empty) Total amounts issued to accounts that are not hot wallets, as a map of currencies to the total value issued. |
| balances | Object | (Omitted if empty) Amounts issued to the `hotwallet` accounts from the request. The keys are hot wallet addresses and the values are arrays of currency amounts they hold. The issuer (omitted from the currency amounts) is the account from the request. |
| assets | Object | (Omitted if empty) Total amounts held that are issued by others. For the recommended gateway configuration, there should be none. |
| ledger\_hash | String | (May be omitted) The identifying hash of the ledger that was used to generate this response. |
| ledger\_index | Number | (May be omitted) The sequence number of the ledger version that was used to generate this response. |
| ledger\_current\_index | Number | (May be omitted) The sequence number of the current in-progress ledger version that was used to generate this response. |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `invalidHotWallet` - One or more of the addresses specified in the `hotwallet` field is not the address of an account holding currency issued by the account from the request.
* `actNotFound` - The address specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.



## wallet_propose ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/WalletPropose.cpp "Source")

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

*JSON-RPC*
```
{
    "method": "wallet_propose",
    "params": [
        {
            "passphrase": "test"
        }
    ]
}
```

*Commandline*
```
#Syntax: wallet_propose [passphrase]
rippled wallet_propose test
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

The key generated by this method can also be used as a regular key for an account if you use the [SetRegularKey transaction type](transactions.html#setregularkey) to do so.

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `badSeed` - The `passphrase` field of the request has an invalid value, such as an empty string, or a format resembling a Ripple address or Ripple secret.



# Ledger Information #

The globally-shared ledger is the core of the Ripple Network. Each `rippled` server keeps a current version of the ledger, which contains all the accounts, transactions, offers, and other data in the network in an optimized tree format. As transactions and offers are proposed, each server incorporates them into its current copy of the ledger, closes it periodically, and (if configured) participates in the process of advancing the globally-validated version. After concensus is reached in the network, that ledger version is validated and becomes permanently immutable. Any transactions that were not included in one ledger become candidates to be included in the next validated version.

## ledger ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerHandler.cpp "Source")

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

*JSON-RPC*
```
{
    "method": "ledger",
    "params": [
        {
            "accounts": false,
            "expand": false,
            "full": false,
            "ledger_index": "current",
            "transactions": false
        }
    ]
}
```

*Commandline*
```
#Syntax: ledger ledger_index|ledger_hash [full]
rippled ledger current false
```

</div>

[Try it! >](ripple-api-tool.html#ledger)

The request can contain the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| accounts | Boolean | (Optional, defaults to false) If true, return information on accounts in the ledger. *Admin required.* If enabled, this method returns a large amount of data, which may cause the request to fail due to a timeout, depending on the server load and capabilities. |
| transactions | Boolean | (Optional, defaults to false) If true, return information on transactions in the specified ledger version. |
| full | Boolean | (Optional, defaults to false) If true, return full information on the entire ledger. (Equivalent to enabling `transactions`, `accounts`, and `expand` *Admin required* |
| expand | Boolean | (Optional, defaults to false) Provide full JSON-formatted information for transaction/account information instead of just hashes |
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger-instance))|
| binary | Boolean | (Optional, defaults to false) If `transactions` and `expand` are both true, and this option is also true, return transaction information in binary format instead of JSON format. _(New in [rippled v0.28.0](https://github.com/ripple/rippled/releases/tag/0.28.0))_ |

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

*JSON-RPC*
```
200 OK
{
    "result": {
        "ledger": {
            "closed": false,
            "ledger_index": "8696231",
            "parent_hash": "A9008337AA9441B8961D9F97183B8BFB3EECFAA7D2FA65545B4CB552AEA65909",
            "seqNum": "8696231"
        },
        "status": "success"
    }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing information about the ledger, including the following fields:

| Field | Type | Description |
|-------|------|-------------|
| account_hash | String | Hash of all account state information in this ledger, as hex |
| close\_time | Integer | The time this ledger was closed, in seconds since the [Ripple Epoch](#specifying-time) |
| close\_time_human | String | The time this ledger was closed, in human-readable format |
| close\_time\_resolution | Integer | Approximate number of seconds between closing one ledger version and closing the next one |
| closed | Boolean | Whether or not this ledger has been closed |
| ledger\_hash | String | Unique identifying hash of the entire ledger. |
| ledger\_index | String | Ledger sequence number as a quoted integer |
| parent\_hash | String | Unique identifying hash of the ledger that came immediately before this one. |
| total\_coins | String | Total number of XRP drops in the network, as a quoted integer. (This decreases as transaction costs destroy XRP.) |
| transaction\_hash | String | Hash of the transaction information included in this ledger, as hex |

The following fields are deprecated and may be removed without further notice: `accepted`, `hash`, `seqNum`, `totalCoins`.

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `noPermission` - If you specified `full` or `accounts` as true, but are not connected to the server as an admin (usually, admin requires connecting on a local port).


## ledger_closed ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerClosed.cpp "Source")

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

*JSON-RPC*
```
{
    "method": "ledger_closed",
    "params": [
        {}
    ]
}
```

*Commandline*
```
#Syntax: ledger_closed
rippled ledger_closed
```

</div>

[Try it! >](ripple-api-tool.html#ledger_closed)

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

*JSON-RPC*
```
200 OK
{
    "result": {
        "ledger_hash": "8B5A0C5F6B198254A6E411AF55C29EE40AA86251D2E78DD0BB17647047FA9C24",
        "ledger_index": 8696231,
        "status": "success"
    }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| ledger_hash | String | 20-byte hex string with a unique hash of the ledger |
| ledger_index | Unsigned Integer | Sequence number of this ledger |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).


## ledger_current ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerCurrent.cpp "Source")

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

*JSON-RPC*
```
{
    "method": "ledger_current",
    "params": [
        {}
    ]
}
```

*Commandline*
```
#Syntax: ledger_current
rippled ledger_current
```

</div>

[Try it! >](ripple-api-tool.html#ledger_current)

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

*JSON-RPC*
```
200 OK
{
    "result": {
        "ledger_current_index": 8696233,
        "status": "success"
    }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following field:

| Field | Type | Description |
|-------|------|-------------|
| ledger_current_index | Unsigned Integer | Sequence number of this ledger |

A `ledger_hash` field is not provided, because the hash of the current ledger is constantly changing along with its contents.

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).


## ledger_data ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerData.cpp "Source")

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

*JSON-RPC*
```
{
    "method": "ledger_data",
    "params": [
        {
            "binary": true,
            "ledger_hash": "842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
            "limit": 5
        }
    ]
}
```

</div>

__*Note:*__ There is no commandline syntax for `ledger_data`. You can use the [`json` command](#json) to access this method from the commandline instead.

A request can include the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | (Arbitrary) | (WebSocket only) Any identifier to separate this request from others in case the responses are delayed or out of order. |
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger-instance))|
| binary | Boolean | (Optional, defaults to False) If set to true, return data nodes as hashed hex strings instead of JSON. |
| limit | Integer | (Optional, default varies) Limit the number of nodes to retrieve. The server is not required to honor this value. |
| marker | [(Not Specified)](#markers-and-pagination) | Server-provided value to specify where to resume retrieving data from. |

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

*JSON-RPC (binary:true)*
```
200 OK
{
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
        ],
        "status": "success"
    }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| ledger_index | Unsigned Integer | Sequence number of this ledger |
| ledger_hash | String | Unique identifying hash of the entire ledger. |
| state | Array | Array of JSON objects containing data from the tree, as defined below |
| marker | [(Not Specified)](#markers-and-pagination) | Server-defined value. Pass this to the next call in order to resume where this call left off. |

The format of each object in the `state` array depends on whether `binary` was set to true or not in the request. Each `state` object may include the following fields:

| Field | Type | Description |
|-------|------|-------------|
| data | String | (Only included if `"binary":true`) Hex representation of the requested data |
| LedgerEntryType | String | (Only included if `"binary":false`) String indicating what type of ledger node this object represents. See [ledger format][] for the full list. |
| (Additional fields) | (Various) | (Only included if `"binary":false`) Additional fields describing this object, depending on which LedgerEntryType it is. |
| index | String | Unique identifier for this ledger entry, as hex. |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors)
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.


## ledger_entry ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerEntry.cpp "Source")

The `ledger_entry` method returns a single ledger node from the Ripple Consensus Ledger. See [ledger format][] for information on the different types of objects you can retrieve.

__*Note:*__ There is no commandline version of this method. You can use the [`json` command](#json) to access this method from the commandline instead.

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

*JSON-RPC*
```
{
    "method": "ledger_entry",
    "params": [
        {
            "account_root": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "ledger_index": "validated",
            "type": "account_root"
        }
    ]
}
```

</div>

[Try it! >](ripple-api-tool.html#ledger_entry)

This method can retrieve several different types of data. You can select which type of item to retrieve by passing the appropriate parameters. Specifically, you should provide exactly one of the following fields:

1. `index` - Retrieve an individual ledger node by its unique index
2. `account_root` - Retrieve an account node, similar to the [account_info](#account-info) command
3. `directory` - Retrieve a directory node, which contains a list of IDs linking things
4. `offer` - Retrieve an offer node, which defines an offer to exchange currency
5. `ripple_state` - Retrieve a RippleState node, which is a trust line where non-XRP balances are held

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
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger-instance))|

The `generator` and `ledger` parameters are deprecated and may be removed without further notice.

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
}
```

*JSON-RPC*
```
200 OK
{
    "result": {
        "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05",
        "ledger_index": 8696234,
        "node": {
            "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "Balance": "13176802787",
            "Flags": 0,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 17,
            "PreviousTxnID": "E5D0235A236F7CD162C1AB87A0325056AE61CFC63D92D1494AB5D826AAD0CDCA",
            "PreviousTxnLgrSeq": 8554742,
            "Sequence": 1406,
            "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
        },
        "status": "success",
        "validated": true
    }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| index | String | Unique identifying key for this ledger_entry |
| ledger_index | Unsigned Integer | Unique sequence number of the ledger from which this data was retrieved |
| node | Object | (`"binary":false` only) Object containing the data of this ledger node, according to the [ledger format][]. |
| node_binary | String | (`"binary":true` only) Binary data of the ledger node retrieved, as hex. |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.


## ledger_request ##
[[Source]<br>](https://github.com/ripple/rippled/blob/e980e69eca9ea843d200773eb1f43abe3848f1a0/src/ripple/rpc/handlers/LedgerRequest.cpp "Source")

The `ledger_request` command tells server to fetch a specific ledger version from its connected peers. This only works if one of the server's immediately-connected peers has that ledger. You may need to run the command several times to completely fetch a ledger.

*The `ledger_request` request is an admin command that cannot be run by unpriviledged users!*

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
{
    "id": 102,
    "command": "ledger_request",
    "ledger_index": 13800000
}
```

*Commandline*

```
rippled ledger_request 13800000
```

</div>

The request includes the following parameters:

| Field         | Type   | Description |
|---------------|--------|-------------|
| ledger\_index | Number | (Optional) Retrieve the specified ledger by its sequence number. |
| ledger\_hash  | String | (Optional) Retrieve the specified ledger by its identifying hash. |

You must provide either `ledger_index` or `ledger_hash` but not both.

#### Response Format ####

The response follows the [standard format](#response-formatting). However, the request returns a failure response if it does not have the specified ledger _even if it successfully instructed the `rippled` server to start retrieving the ledger_.

**Note:** In order to retrieve a ledger, the rippled server must have a direct peer with that ledger in its history. If none of the peers have the requested ledger, you can use the [`connect` command](#connect) or the `fixed_ips` section of the config file to add Ripple Labs' full-history server at `s2.ripple.com` and then make the `ledger_request` request again.

A failure response indicates the status of fetching the ledger. A successful response contains the information for the ledger in a similar format to the [`ledger` command](#ledger).

<div class='multicode'>

*Commandline (failure)*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "error" : "ledgerNotFound",
      "hash" : "D6E25136ADF43DED49C886A6D049436DDC8F8CC02C84E7C89DE67E209F0FAAB6",
      "have_header" : false,
      "peers" : 2,
      "request" : {
         "command" : "ledger_request",
         "ledger_index" : 13800000
      },
      "status" : "error",
      "timeouts" : 0
   }
}
```

*Commandline (success)*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "ledger" : {
         "accepted" : true,
         "account_hash" : "84EBB27D9510AD5B9A3A328201921B3FD418D4A349E85D3DC69E33C7B506407F",
         "close_time" : 486691300,
         "close_time_human" : "2015-Jun-04 00:01:40",
         "close_time_resolution" : 10,
         "closed" : true,
         "hash" : "DCF5D723ECEE1EF56D2B0024CD9BDFF2D8E3DC211BD2B9460165922564ACD863",
         "ledger_hash" : "DCF5D723ECEE1EF56D2B0024CD9BDFF2D8E3DC211BD2B9460165922564ACD863",
         "ledger_index" : "13840000",
         "parent_hash" : "8A3F6FBC62C11DE4538D969F9C7966234635FE6CEB1133DDC37220978F8100A9",
         "seqNum" : "13840000",
         "totalCoins" : "99999022883526403",
         "total_coins" : "99999022883526403",
         "transaction_hash" : "3D759EF3AF1AE2F78716A8CCB2460C3030F82687E54206E883703372B9E1770C"
      },
      "ledger_index" : 13840000,
      "status" : "success"
   }
}

```

</div>


The fields of the "failure" response (the ledger was requested, but has not been fully retrieved yet) can include any of the following:

| Field                       | Type    | Description |
|-----------------------------|---------|-------------|
| hash                        | String  | The hash of the requested ledger, if the server knows it. |
| have\_header                | Boolean | Whether the server has the header section of the requested ledger. |
| have\_state                 | Boolean | (May be omitted) Whether the server has the state section of the requested ledger. |
| have\_transactions          | Boolean | (May be omitted) Whether the server has the transaction section of the requested ledger. |
| needed\_state\_hashes       | Array of Strings | (May be omitted) Up to 16 hashes of nodes in the state tree that the server still needs to retrieve. |
| needed\_transaction\_hashes | Array of Strings | (May be omitted) Up to 16 hashes of nodes in the transaction tree that the server still needs to retrieve. |
| peers                       | Number  | How many peers the server is querying in its attempt to find this ledger. |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing. This error can also occur if you specify a ledger index equal or higher than the current in-progress ledger.
* `ledgerNotFound` - If the ledger is not yet available. This indicates that the server has started fetching the ledger, although it may fail if none of its connected peers have the requested ledger.


## ledger_accept ##
[[Source]<br>](https://github.com/ripple/rippled/blob/a61ffab3f9010d8accfaa98aa3cacc7d38e74121/src/ripple/rpc/handlers/LedgerAccept.cpp "Source")

The `ledger_accept` method forces the server to close the current-working ledger and move to the next ledger number. This method is intended for testing purposes only, and is only available when the `rippled` server is running stand-alone mode.

*The `ledger_accept` method is an admin command that cannot be run by unpriviledged users!*

#### Request Format ####

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
#Syntax: ledger_accept
rippled ledger_accept
```

</div>

The request accepts no parameters.

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
| ledger\_current\_index | Unsigned Integer | Sequence number of the newly created 'current' ledger |

**Note:** When you close a ledger, `rippled` determines the canonical order of transactions in that ledger and replays them. This can change the outcome of transactions that were provisionally applied to the current ledger.

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `notStandAlone` - If the `rippled` server is not currently running in stand-alone mode.



# Transactions #

Transactions are the only thing that can modify the shared global ledger of the Ripple Network. All business on the Ripple Network takes the form of transactions, which include not only payments, but also currency-exchange offers, account settings, and changes to the properties of the network itself (like adopting new features).

There are several sources of complication in transactions. Unlike traditional banking, where a trusted third party (the bank, or the [ACH](http://en.wikipedia.org/wiki/Automated_Clearing_House)) verifies the participants' identities and ensures their balances are adjusted accurately, Ripple uses cryptography and decentralized computing power to accomplish the same thing. Sending XRP, the Ripple Network's native crypto-currency, requires no third party aside from the distributed network itself. However, that is missing out on the key feature of Ripple: unlike individual crypto-currencies, the Ripple Network natively supports balances in any currency. This brings far more power, but it also means that the system must account for [counterparty risk](http://en.wikipedia.org/wiki/Counterparty_risk#Counterparty_risk), currency conversions, and other issues. The Ripple Network must be robust to keep track of which transactions have been completely validated, even when subject to hardware failures, attacks, or natural disasters.

## tx ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Tx.cpp "Source")

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
rippled tx E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7 false
```

</div>

[Try it! >](ripple-api-tool.html#tx)

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

The response follows the [standard format](#response-formatting), with a successful result containing the fields of the [Transaction object](transactions.html) as well as the following additional fields:

| Field | Type | Description |
|-------|------|-------------|
| hash | String | The SHA-512 hash of the transaction |
| inLedger | Unsigned Integer | (Deprecated) Alias for `ledger_index`. |
| ledger_index | Unsigned Integer | The sequence number of the ledger that includes this transaction. |
| meta | Object | Various metadata about the transaction. |
| validated | Boolean | True if this data is from a validated ledger version; if omitted or set to false, this data is not final. |
| (Various) | (Various) | Other fields from the [Transaction object](transactions.html) |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `txnNotFound` - Either the transaction does not exist, or it was part of an older ledger version that `rippled` does not have available.



## transaction_entry ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/TransactionEntry.cpp "Source")

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
rippled transaction_entry E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7 348734
```

</div>

[Try it! >](ripple-api-tool.html#transaction_entry)

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| tx_hash | String | Unique hash of the transaction you are looking up |

__*Note:*__ This method does not support retrieving information from the current in-progress ledger. You must specify a ledger version in either `ledger_index` or `ledger_hash`. 

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
| tx_json | Object | JSON representation of the [Transaction object](transactions.html) |

There are a couple possible reasons the server may fail to find the transaction:

* The transaction just does not exist
* The transaction exists, but not in the specified ledger version
* The server does not have the specified ledger version available. Another server that has the correct version on hand may have a different response.

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `fieldNotFoundTransaction` - The `tx_hash` field was omitted from the request
* `notYetImplemented` - A ledger version was not specified in the request.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `transactionNotFound` - The transaction specified in the request could not be found in the specified ledger. (It might be in a different ledger version, or it might not be available at all.)

<!-- I think ledgerNotFound ( https://github.com/ripple/rippled/blob/develop/src/ripple/rpc/handlers/TransactionEntry.cpp#L62 ) should not occur because lookupLedger would have errored out first. -->


## tx_history ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/TxHistory.cpp "Source")

The `tx_history` method retrieves a selection of the most recent transactions made.

__*Caution:*__ This method is deprecated, and may be removed without further notice.

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

*JSON-RPC*
```
{
    "method": "tx_history",
    "params": [
        {
            "start": 0
        }
    ]
}
```

*Commandline*
```
#Syntax: tx_history [start]
rippled tx_history 0
```

</div>

[Try it! >](ripple-api-tool.html#tx_history)

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

*JSON-RPC*
```
200 OK
{
    "result": {
        "index": 0,
        "status": "success",
        "txs": [
            {
                "Account": "rPJnufUfjS22swpE7mWRkn2VRNGnHxUSYc",
                "Fee": "10",
                "Flags": 2147483648,
                "Sequence": 567546,
                "SigningPubKey": "0317766BFFC0AAF5DB4AFDE23236624304AC4BC903AA8B172AE468F6B512616D6A",
                "TakerGets": {
                    "currency": "BTC",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "1.12582"
                },
                "TakerPays": {
                    "currency": "ILS",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "1981.893528"
                },
                "TransactionType": "OfferCreate",
                "TxnSignature": "3045022100C66F3EE8F955724D750D148E3BB9DCAC16A002F9E4FC612C03AFBE9D8C13888902202607508AD0546C496093C9743B13FD596A1F5BE2B778EFE85BDB99F0E5B1D55F",
                "hash": "A95C701F6120061BC40323AE846BBDA51576E67EC38105030BE75C1D32231B61",
                "inLedger": 8696235,
                "ledger_index": 8696235
            },
            {
                "Account": "rwpxNWdpKu2QVgrh5LQXEygYLshhgnRL1Y",
                "Fee": "10",
                "Flags": 2147483648,
                "Sequence": 1865518,
                "SigningPubKey": "02BD6F0CFD0182F2F408512286A0D935C58FF41169DAC7E721D159D711695DFF85",
                "TakerGets": {
                    "currency": "LTC",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "1.12095"
                },
                "TakerPays": {
                    "currency": "ILS",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "20.77526133899999"
                },
                "TransactionType": "OfferCreate",
                "TxnSignature": "304402203F7435A2587A71878B09129A1F4C05066CE6E6463A4A10CD5C40C15FCBD9E42502207E0CB8421FEA4CE8FC052E5A63ACD2444ADAE253B174A153A1DBE901E21B3695",
                "hash": "A8C79DF180167E4D1281247325E2869984F54CBFA68631C1AF13DA346E6B3370",
                "inLedger": 8696235,
                "ledger_index": 8696235
            },
            {
                "Account": "rMWUykAmNQDaM9poSes8VLDZDDKEbmo7MX",
                "Fee": "10",
                "Flags": 2147483648,
                "Sequence": 1886203,
                "SigningPubKey": "0256C64F0378DCCCB4E0224B36F7ED1E5586455FF105F760245ADB35A8B03A25FD",
                "TakerGets": {
                    "currency": "LTC",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "24.154"
                },
                "TakerPays": {
                    "currency": "BTC",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "0.26907556"
                },
                "TransactionType": "OfferCreate",
                "TxnSignature": "30440220102CF96A86AF56BA11698C70D60F22436D763634FEA179D2FF45EB329CFF1CF8022029BF9301B11D09B38EBD4E8EB445ECC53B98C4F0CA7E19BE895272085ED6DBA2",
                "hash": "9EE340379612529F308CA1E4619EC0C8842C1D4308FCA136E25316CE28C28189",
                "inLedger": 8696235,
                "ledger_index": 8696235
            },
            {
                "Account": "rJJksugQDMVu12NrZyw3C55fEUmPtRYVRC",
                "Fee": "10",
                "Flags": 2147483648,
                "Sequence": 119205,
                "SigningPubKey": "03B918730C9FA2451284A00B1EFD08E9BEFD735D84CE09C6B3D7CB8FB0D1F9A84F",
                "TakerGets": "10136500000",
                "TakerPays": {
                    "currency": "USD",
                    "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                    "value": "50"
                },
                "TransactionType": "OfferCreate",
                "TxnSignature": "3044022044DB48A760AA7FBA2B1840E1357EF6B1EA9CC9DBBFFB5415C6BE301597B66766022021AA86070416330312E3AFC938376AD0A67A28195D7CD92EC8B03A6039D5C86C",
                "hash": "8149067582081FA1499A53841642345D21FE0750E29C61C6DC3C914E0D1819AB",
                "inLedger": 8696235,
                "ledger_index": 8696235
            },
            {
                "Account": "rLPrL6KUtVZZbDfJMjDXzTKkwH39Udfw6e",
                "Fee": "10",
                "Flags": 2147483648,
                "Sequence": 428775,
                "SigningPubKey": "03B2B67209DBDE2FA68555FB10BD791C4732C685349979FDC47D0DEF2B27EFA364",
                "TakerGets": {
                    "currency": "PPC",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "8.0635"
                },
                "TakerPays": {
                    "currency": "BTC",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "0.01355474349999999"
                },
                "TransactionType": "OfferCreate",
                "TxnSignature": "3045022100EDDC17FE2C32DEAD8ED5D9540B2ECE25D6CD1C65414211D2E4F98FC5BDABB99E0220389D6B3DE8BA50D27406BCE28E67D1E270C6A3A854CDEF25F042BBA52CDB53F8",
                "hash": "70B7DB8E2BD65E554CBF418D591E050A6FD0A387E9500ED0B79BEB775019D9CA",
                "inLedger": 8696235,
                "ledger_index": 8696235
            },
            {
                "Account": "rM7WN56kktEkE5qKwNkQ1af4BZ56bynVUf",
                "Fee": "10",
                "Flags": 2147483648,
                "Sequence": 435008,
                "SigningPubKey": "0256AE48790FEF5F61C1AB3765287EABCBE6B47C5098271F596A576DF7CFA15720",
                "TakerGets": {
                    "currency": "PPC",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "0.365"
                },
                "TakerPays": {
                    "currency": "ILS",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "0.9977421"
                },
                "TransactionType": "OfferCreate",
                "TxnSignature": "3044022057ECAE71B36746AA1574936B03016DC5747EB7DBBA7D85533063E8D35DD2BAF402204F37BCA51CB0D943758BCA89641C2655FB76F20B8AD1883A3ABF232D1E964E80",
                "hash": "572B0B2E96F4A9A88C7EDBDEB6D90AD2975528478186D9179AEC0E366D2778FC",
                "inLedger": 8696235,
                "ledger_index": 8696235
            },
            {
                "Account": "rLjhDX8zT6vy8T7hjUDvK48wTy5SYFpfwZ",
                "Fee": "10",
                "Flags": 2147483648,
                "OfferSequence": 432536,
                "Sequence": 432561,
                "SigningPubKey": "03892D08CE3CE600369BA83A92C3C7785FEA162739643358F1F35F8BE672AFD4A3",
                "TransactionType": "OfferCancel",
                "TxnSignature": "3045022100C25CE3756EB273F6ADD219E951DB7585ADFAF28090BEA3510458785D2EB91866022057A480F167F6D7263CDBFB0E13D571041313F6476176FFE2645CE867BA85DC2D",
                "hash": "521D7F2CF76DEAC8ED695AC5570DFF1E445EB8C599158A351BD46F1D34528373",
                "inLedger": 8696235,
                "ledger_index": 8696235
            },
            {
                "Account": "rn694SpeUFw3VJwapyRKx6bpru3ZpDHzji",
                "Fee": "10",
                "Flags": 2147483648,
                "Sequence": 396235,
                "SigningPubKey": "03896496732D098F2D8EE22D65ED9A88C0FF116785AE448EA1F521534C7C5BC6E3",
                "TakerGets": {
                    "currency": "ILS",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "0.700491"
                },
                "TakerPays": {
                    "currency": "NMC",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "0.22"
                },
                "TransactionType": "OfferCreate",
                "TxnSignature": "30440220218B5B90AB26EAE9FC9833E580653B20A15CEE86E8F1166F626FCDF4EFD4146902207FD99E35EE67E45142776CCD8F910A9E6E1A3C498737B59F182C73183C63D51F",
                "hash": "454479D7EEE4081CF25378571D74858C01B0B43D3A2530781647BD40CD0465E5",
                "inLedger": 8696235,
                "ledger_index": 8696235
            },
            {
                "Account": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
                "Fee": "10",
                "Flags": 2147483648,
                "Sequence": 676061,
                "SigningPubKey": "030BB49C591C9CD65C945D4B78332F27633D7771E6CF4D4B942D26BA40748BB8B4",
                "TakerGets": {
                    "currency": "BTC",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "0.09675"
                },
                "TakerPays": "10527647107",
                "TransactionType": "OfferCreate",
                "TxnSignature": "3044022014196BC5867AC2689F7EF31F23E4B2D1D1B7755465AC388B20F8E7721333EEE302201575263F381755E47AFCD37C1D5CCA4C012D624E7947140B40ABF1975959AA78",
                "hash": "22B2F477ADE9C22599EB5CEF70B3377C0478D708D74A47866D9E59B7A2CF57CF",
                "inLedger": 8696235,
                "ledger_index": 8696235
            },
            {
                "Account": "rJJksugQDMVu12NrZyw3C55fEUmPtRYVRC",
                "Fee": "10",
                "Flags": 2147483648,
                "OfferSequence": 119183,
                "Sequence": 119204,
                "SigningPubKey": "03B918730C9FA2451284A00B1EFD08E9BEFD735D84CE09C6B3D7CB8FB0D1F9A84F",
                "TransactionType": "OfferCancel",
                "TxnSignature": "30440220481760ED4F771F960F37FDF32DDEC70D10F9D5F9868571A58D6F5C09D75B71DE022049B35BEA448686D0929271E64EADA684D7684A9195D22826288AD9D9526B4FE9",
                "hash": "5E0E42BDDC7A929875F5E9214AB00C3673CC047833C0EFC093532F2EE1F790C2",
                "inLedger": 8696234,
                "ledger_index": 8696234
            },
            {
                "Account": "rM7WN56kktEkE5qKwNkQ1af4BZ56bynVUf",
                "Fee": "10",
                "Flags": 2147483648,
                "OfferSequence": 434977,
                "Sequence": 435007,
                "SigningPubKey": "0256AE48790FEF5F61C1AB3765287EABCBE6B47C5098271F596A576DF7CFA15720",
                "TransactionType": "OfferCancel",
                "TxnSignature": "304402204B04325A39F3D394A7EBC91CE3A1232E538EFFC80014473C97E84310886A19B302205B2D18C544086BB99E49A1037B65ADDF4864DA60545E33E4116A41599EEE63E3",
                "hash": "E8E55606C757219A740AFA0700506FE99781797E2F54A5144EF43582C65BF0F2",
                "inLedger": 8696234,
                "ledger_index": 8696234
            },
            {
                "Account": "rLPrL6KUtVZZbDfJMjDXzTKkwH39Udfw6e",
                "Fee": "10",
                "Flags": 2147483648,
                "OfferSequence": 428744,
                "Sequence": 428774,
                "SigningPubKey": "03B2B67209DBDE2FA68555FB10BD791C4732C685349979FDC47D0DEF2B27EFA364",
                "TransactionType": "OfferCancel",
                "TxnSignature": "304402202BCB4FCE73C3417AD3E67D795077DE025E766A9136CA20D5B07DA28EA717643E0220579CA32A7BB225DA01999637B316BF7D3902059F9A8DDB2D721F8A62685E5BB7",
                "hash": "E86788EC72CA9CFBBAE4C399744C6B7495E3F6443FE87D7A4118F16FA4A316DB",
                "inLedger": 8696234,
                "ledger_index": 8696234
            },
            {
                "Account": "rHsZHqa5oMQNL5hFm4kfLd47aEMYjPstpg",
                "Fee": "64",
                "Flags": 0,
                "Sequence": 4216371,
                "SigningPubKey": "025718736160FA6632F48EA4354A35AB0340F8D7DC7083799B9C57C3E937D71851",
                "TakerGets": "12566721624",
                "TakerPays": {
                    "currency": "USD",
                    "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                    "value": "74.999999999"
                },
                "TransactionType": "OfferCreate",
                "TxnSignature": "3045022100D0FA06A78D3333D35C798B45590CD47BD844164ED25FCA4149F5F0CF24BE9A380220243EB636C656D1FBA6888CE8E2873CDA40FE6DE5987BE2FF1C418610D8BDC300",
                "hash": "DD4CAD3EBCF67CE9B184A917FF2C78A80F0FE40A01187840E0EBC6B479DBFE1A",
                "inLedger": 8696234,
                "ledger_index": 8696234
            },
            {
                "Account": "rJJksugQDMVu12NrZyw3C55fEUmPtRYVRC",
                "Fee": "10",
                "Flags": 2147483648,
                "OfferSequence": 119182,
                "Sequence": 119203,
                "SigningPubKey": "03B918730C9FA2451284A00B1EFD08E9BEFD735D84CE09C6B3D7CB8FB0D1F9A84F",
                "TransactionType": "OfferCancel",
                "TxnSignature": "304402202F13D25C82240ABBBEE0D7E8BC2351C49FD6FDD62359EA232233C5A6C989BFAA022005A521A2C5A67BAC27218A6AD9E6917689CBD2F9BB9CE884B6B0EAAEDDEC2057",
                "hash": "C9D8A2ECE636057E8255A231E6C6B6464A730155BA0E75B5111A81EA769FBC89",
                "inLedger": 8696234,
                "ledger_index": 8696234
            },
            {
                "Account": "rGJrzrNBfv6ndJmzt1hTUJVx7z8o2bg3of",
                "Fee": "15",
                "Flags": 2147483648,
                "LastLedgerSequence": 8696241,
                "OfferSequence": 1579754,
                "Sequence": 1579755,
                "SigningPubKey": "03325EB29A014DDE22289D0EA989861D481D54D54C727578AB6C2F18BC342D3829",
                "TransactionType": "OfferCancel",
                "TxnSignature": "3045022100C9F283D461F8A56575A56F8AA31F84683AB0B44D58C9EFD5DC20D448D8AC13E3022012E0A8726BE2D900C4FB7A61AB8FBFEBEBE1F12B2A9880A2BA2AB8D3EC61CB8C",
                "hash": "C4953FE328D54E9104F66253AF50AEBC26E30D5826B433465A795262DFA75B48",
                "inLedger": 8696234,
                "ledger_index": 8696234
            },
            {
                "Account": "rn694SpeUFw3VJwapyRKx6bpru3ZpDHzji",
                "Fee": "10",
                "Flags": 2147483648,
                "Sequence": 396234,
                "SigningPubKey": "03896496732D098F2D8EE22D65ED9A88C0FF116785AE448EA1F521534C7C5BC6E3",
                "TakerGets": {
                    "currency": "ILS",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "0.3335471399999999"
                },
                "TakerPays": {
                    "currency": "NMC",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "0.102"
                },
                "TransactionType": "OfferCreate",
                "TxnSignature": "3045022100DEA2B6D5B0D555D54A4EB7A8FADC187F44C6A9CF7282A1D5491538200DFC97DA022033A52D1EC219553C86DB829108BB5A52B49ED7EF0A566941665DE7FFF70917ED",
                "hash": "A6BE633AECE9FF9CA83D67D09E7EF67F614A9D8B952D7AFB5CB630D03C54C9FC",
                "inLedger": 8696234,
                "ledger_index": 8696234
            },
            {
                "Account": "rwpxNWdpKu2QVgrh5LQXEygYLshhgnRL1Y",
                "Fee": "10",
                "Flags": 2147483648,
                "OfferSequence": 1865490,
                "Sequence": 1865517,
                "SigningPubKey": "02BD6F0CFD0182F2F408512286A0D935C58FF41169DAC7E721D159D711695DFF85",
                "TransactionType": "OfferCancel",
                "TxnSignature": "3044022074A4E9859A5A94169B2C902F074AA964C45E2B86EABEA73E83E083E1EC7549A402203E8F4D46705AFEDFC78C2D40FAA036792E6485AF8CADF7445EA3D427E9DC2474",
                "hash": "A49285E2CA7C5765B68A41EF4A8A65AD5CC7D4EF6C7B7F6D5040B2DE429E0125",
                "inLedger": 8696234,
                "ledger_index": 8696234
            },
            {
                "Account": "rPJnufUfjS22swpE7mWRkn2VRNGnHxUSYc",
                "Fee": "10",
                "Flags": 2147483648,
                "Sequence": 567545,
                "SigningPubKey": "0317766BFFC0AAF5DB4AFDE23236624304AC4BC903AA8B172AE468F6B512616D6A",
                "TakerGets": {
                    "currency": "BTC",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "0.66099"
                },
                "TakerPays": {
                    "currency": "ILS",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "1157.5521276"
                },
                "TransactionType": "OfferCreate",
                "TxnSignature": "3045022100CABC7C1F9FB42C8498E1E9C6C5E8482F325D39B15D9DAE4BD9878D5E508B8FDD0220407B059A22BBBF4FC4AE18BEDCD2DDA80109EE7226D679A8A3BBFC108EFDD3AB",
                "hash": "A0BED2F5A85C48A2AFBA252FF91FD2D5C90A6D6B769068B18891B031812E2AC0",
                "inLedger": 8696234,
                "ledger_index": 8696234
            },
            {
                "Account": "rLLq27Wat93Gxkq5mV5GxtKkT146Su949V",
                "Fee": "10",
                "Flags": 2147483648,
                "Sequence": 722529,
                "SigningPubKey": "02A1BC1CCFACECD00ADC6EE990E2E27148E00D5386A99791F25B6A880BCEC94EC9",
                "TakerGets": "130272502088",
                "TakerPays": {
                    "currency": "BTC",
                    "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
                    "value": "1.3177"
                },
                "TransactionType": "OfferCreate",
                "TxnSignature": "30440220436C4A368D534FE1E9A2596C51D1D54931432B789F249E312877FF9B38A3F4D502202A2DBF9517358C009FBEA61EE927DAF72A065A840C7B9136B10C125F25FCD175",
                "hash": "9627AEFC735A848AAE6C36D1089CB8797373DBE95B60E89F5412508CA907243A",
                "inLedger": 8696234,
                "ledger_index": 8696234
            },
            {
                "Account": "rMWUykAmNQDaM9poSes8VLDZDDKEbmo7MX",
                "Fee": "10",
                "Flags": 2147483648,
                "OfferSequence": 1886173,
                "Sequence": 1886202,
                "SigningPubKey": "0256C64F0378DCCCB4E0224B36F7ED1E5586455FF105F760245ADB35A8B03A25FD",
                "TransactionType": "OfferCancel",
                "TxnSignature": "304402202C7BD2C125A0B837CBD2E2FF568AEA1E0EE94615B22564A51C0434460C506C6F02204E39A7BD49086AA794B20F4EE28656217561909ECFBB18636CD400AB33AB0B17",
                "hash": "57277F527B8EBD68FE85906E613338D68F8F8BC4EB3D1748D9A204D7CDC3E174",
                "inLedger": 8696234,
                "ledger_index": 8696234
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

The fields included in each transaction object vary slightly depending on the type of transaction. See [Transaction Format](transactions.html) for details.

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `noPermission` - The `start` field specified was greater than 10000, but you are not connected to the server as an admin.


## path_find ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/PathFind.cpp "Source")

*WebSocket API only!* The `path_find` method searches for a path along which a transaction can possibly be made, and periodically sends updates when the path changes over time. For a simpler version that is supported by JSON-RPC, see [`ripple_path_find`](#ripple-path-find). For payments occurring strictly in XRP, it is not necessary to find a path, because XRP can be sent directly to any account. 

There are three different modes, or sub-commands, of the path_find command. Specify which one you want with the `subcommand` parameter:

* `create` - Start sending pathfinding information 
* `close` - Stop sending pathfinding information
* `status` - Get the information of the currently-open pathfinding request

Although the `rippled` server attempts to find the cheapest path or combination of paths for making a payment, it is not guaranteed that the paths returned by this method are, in fact, the best paths. Due to server load, pathfinding may not find the best results. Additionally, you should be careful with the pathfinding results from untrusted servers. A server could be modified to return less-than-optimal paths in order to earn money for its operators. If you do not have your own server that you can trust with pathfinding, you should compare the results of pathfinding from multiple servers operated by different parties, to minimize the risk of a single server returning poor results. (__*Note:*__ A server returning less-than-optimal results is not necessarily proof of malicious behavior; it could also be a symptom of heavy server load.)

### path_find create ###
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/PathFind.cpp#L38 "Source")

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

[Try it! >](ripple-api-tool.html#path_find)

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| subcommand | String | Use `"create"` to send the create subcommand |
| source\_account | String | Unique address of the account to find a path from. (In other words, the account that would be sending a payment.) |
| destination\_account | String | Unique address of the account to find a path to. (In other words, the account that would receive a payment.) |
| destination\_amount | String or Object | [Currency amount](#specifying-currency-amounts) that the destination account would receive in a transaction. **Special case:** _(New in [rippled 0.30.0](https://github.com/ripple/rippled/releases/tag/0.30.0))_ You can specify `"-1"` (for XRP) or provide -1 as the contents of the `value` field (for non-XRP currencies). This requests a path to deliver as much as possible, while spending no more than the amount specified in `send_max` (if provided). |
| send\_max | String or Object | (Optional) [Currency amount](#specifying-currency-amounts) that would be spent in the transaction. Not compatible with `source_currencies`. _(New in [rippled 0.30.0](https://github.com/ripple/rippled/releases/tag/0.30.0))_ |
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
    "source_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "full_reply": false
  }
}
```

</div>

The initial response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| alternatives | Array | Array of objects with suggested paths to take, as described below. If empty, then no paths were found connecting the source and destination accounts. |
| destination\_account | String | Unique address of the account that would receive a transaction |
| destination\_amount | String or Object | [Currency amount](#specifying-currency-amounts) that the destination would receive in a transaction |
| id | (Various) | (WebSocket only) The ID provided in the WebSocket request is included again at this level. |
| source\_account | String | Unique address of the account that would initiate a transaction |
| full\_reply | Boolean | If `false`, this is the result of an incomplete search, and a subsequent reply may have a better path. If `true`, then this is the best path found. (It is still theoretically possible that a better path could exist, but rippled won't find it.) Until you close the pathfinding request, rippled will continue to send updates each time a new ledger closes. _(New in [rippled 0.29.0](https://github.com/ripple/rippled/releases/tag/0.29.0))_ |

Each element in the `alternatives` array is an object that represents a path from one possible source currency (held by the initiating account) to the destination account and currency. This object has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| paths\_computed | Array | Array of arrays of objects defining [payment paths](paths.html) |
| source\_amount | String or Object | [Currency amount](#specifying-currency-amounts) that the source would have to send along this path in order for the destination to receive the desired amount |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `noEvents` - You are using a protocol that does not support asynchronous callbacks, for example JSON-RPC. (See [ripple\_path\_find](#ripple-path-find) for a pathfinding method that _is_ compatible with JSON-RPC.)

#### Asynchronous Follow-ups ####

In addition to the initial response, the server sends more messages in a similar format to update on the status of the paths over time. These messages include the `id` of the original WebSocket request so you can tell which request prompted them, and the field `"type": "path_find"` at the top level to indicate that they are additional responses. The other fields are defined in the same way as the initial response.

If the follow-up includes `"full_reply": true`, then this is the best path that rippled can find as of the current ledger.

Here is an example of an asychronous follow-up from a path_find create request:

<div class='multicode'>

*WebSocket*
```
{
    "id": 1,
    "type": "path_find",
    "alternatives": [
        /* paths omitted from this example; same format as the initial response */
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
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/PathFind.cpp#L46 "Source")

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

If a pathfinding request was successfully closed, the response follows the same format as the initial response to [`path_find create`](#path-find-create), plus the following field:

| Field | Type | Description |
|-------|------|-------------|
| closed | Boolean | The value `true` indicates this reply is in response to a `path_find close` command. |

If there was no outstanding pathfinding request, an error is returned instead.

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - If any fields are specified incorrectly, or any required fields are missing.
* `noEvents` - If you tried to use this method on a protocol that does not support asynchronous callbacks, for example JSON-RPC. (See [ripple\_path\_find](#ripple-path-find) for a pathfinding method that _is_ compatible with JSON-RPC.)
* `noPathRequest` - You tried to close a pathfinding request when there is not an open one.

### path_find status ###
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/PathFind.cpp#L57 "Source")

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

If a pathfinding request is open, the response follows the same format as the initial response to [`path_find create`](#path-find-create), plus the following field:

| Field | Type | Description |
|-------|------|-------------|
| status | Boolean | The value `true` indicates this reply is in response to a `path_find status` command. |

If there was no outstanding pathfinding request, an error is returned instead.

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `noEvents` - You are using a protocol that does not support asynchronous callbacks, for example JSON-RPC. (See [ripple\_path\_find](#ripple-path-find) for a pathfinding method that _is_ compatible with JSON-RPC.)
* `noPathRequest` - You tried to check the status of a pathfinding request when there is not an open one.


## ripple_path_find ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/RipplePathFind.cpp "Source")

The `ripple_path_find` method is a simplified version of [`path_find`](#path-find) that provides a single response to be used to make a payment transaction immediately. It is available in both the WebSocket and JSON-RPC APIs. However, the results tend to become outdated as time passes. Instead of making many subsequent calls, you should use [`path_find`](#path-find) instead where possible.

Although the `rippled` server attempts to find the cheapest path or combination of paths for making a payment, it is not guaranteed that the paths returned by this method are, in fact, the best paths. Due to server load, pathfinding may not find the best results. Additionally, you should be careful with the pathfinding results from untrusted servers. A server could be modified to return less-than-optimal paths in order to earn money for its operators. If you do not have your own server that you can trust with pathfinding, you should compare the results of pathfinding from multiple servers operated by different parties, to minimize the risk of a single server returning poor results. (__*Note:*__ A server returning less-than-optimal results is not necessarily proof of malicious behavior; it could also be a symptom of heavy server load.)

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

*JSON-RPC*

```
{
    "method": "ripple_path_find",
    "params": [
        {
            "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "destination_amount": {
                "currency": "USD",
                "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                "value": "0.001"
            },
            "source_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "source_currencies": [
                {
                    "currency": "XRP"
                },
                {
                    "currency": "USD"
                }
            ]
        }
    ]
}
```

*Commandline*

```
#Syntax ripple_path_find json ledger_index|ledger_hash
rippled ripple_path_find '{"source_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59", "source_currencies": [ { "currency": "XRP" }, { "currency": "USD" } ], "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59", "destination_amount": { "value": "0.001", "currency": "USD", "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B" } }'
```

</div>

[Try it! >](ripple-api-tool.html#ripple_path_find)

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| source\_account | String | Unique address of the account that would send funds in a transaction |
| destination\_account | String | Unique address of the account that would receive funds in a transaction |
| destination\_amount | String or Object | [Currency amount](#specifying-currency-amounts) that the destination account would receive in a transaction. **Special case:** _(New in [rippled 0.30.0](https://github.com/ripple/rippled/releases/tag/0.28.2))_ You can specify `"-1"` (for XRP) or provide -1 as the contents of the `value` field (for non-XRP currencies). This requests a path to deliver as much as possible, while spending no more than the amount specified in `send_max` (if provided). |
| send\_max | String or Object | (Optional) [Currency amount](#specifying-currency-amounts) that would be spent in the transaction. Not compatible with `source_currencies`. _(New in [rippled 0.30.0](https://github.com/ripple/rippled/releases/tag/0.28.2))_ |
| source\_currencies | Array | (Optional, defaults to all available) Array of currencies that the source account might want to spend. Each entry in the array should be a JSON object with a mandatory `currency` field and optional `issuer` field, similar to [currency amounts](#specifying-currency-amounts). |
| ledger\_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger\_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger-instance))|

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

*JSON-RPC*

```
200 OK
{
    "result": {
        "alternatives": [
            {
                "paths_canonical": [],
                "paths_computed": [
                    [
                        {
                            "currency": "USD",
                            "issuer": "rpDMez6pm6dBve2TJsmDpv7Yae6V5Pyvy2",
                            "type": 48,
                            "type_hex": "0000000000000030"
                        },
                        {
                            "account": "rpDMez6pm6dBve2TJsmDpv7Yae6V5Pyvy2",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "rfDeu7TPUmyvUrffexjMjq3mMcSQHZSYyA",
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
                            "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                            "type": 48,
                            "type_hex": "0000000000000030"
                        },
                        {
                            "account": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "raspZSGNiTKi5jmvFxUYCuYXPv1V8WhL5g",
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
                            "issuer": "rpHgehzdpfWRXKvSv6duKvVuo1aZVimdaT",
                            "type": 48,
                            "type_hex": "0000000000000030"
                        },
                        {
                            "account": "rpHgehzdpfWRXKvSv6duKvVuo1aZVimdaT",
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
                "source_amount": "207414"
            }
        ],
        "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "destination_currencies": [
            "USD",
            "JOE",
            "BTC",
            "DYM",
            "CNY",
            "EUR",
            "015841551A748AD2C1F76FF6ECB0CCCD00000000",
            "MXN",
            "XRP"
        ],
        "status": "success"
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
| paths\_computed | Array | Array of arrays of objects defining [payment paths](paths.html) |
| source\_amount | String or Object | [Currency amount](#specifying-currency-amounts) that the source would have to send along this path in order for the destination to receive the desired amount |

The following fields are deprecated, and may be omitted: `paths_canonical`, and `paths_expanded`. If they appear, you should disregard them.

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `tooBusy` - The server is under too much load to calculate paths. Not returned if you are connected as an admin.
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `srcActMissing` - The `source_account` field is omitted from the request.
* `srcActMalformed` - The `source_account` field in the request is not formatted properly.
* `dstActMissing` - The `destination_account` field is omitted from the request.
* `dstActMalformed` - The `destination_account` field in the request is not formatted properly.
* `srcCurMalformed` - The `source_currencies` field is not formatted properly.
* `srcIsrMalformed` - The `issuer` field of one or more of the currency objects in the request is not valid.




## sign ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/SignHandler.cpp "Source")

The `sign` method takes a transaction, specified as JSON, and a secret key, and returns a signed binary representation of the transaction that can be submitted. The result is always different, even when you provide the same transaction JSON and secret key.

__*Note:*__ It is possible and preferable to sign a transaction without connecting to a server instead of using this command, by using [ripple-lib](https://github.com/ripple/ripple-lib). You should prefer to do offline signing of a transaction, especially when you do not control the server you are sending a transaction to. An untrustworthy server can abuse its position to change the transaction before signing it, or worse, use your secret to sign additional arbitrary transactions as if they came from you.

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

*JSON-RPC*
```
{
    "method": "sign",
    "params": [
        {
            "offline": false,
            "secret": "sssssssssssssssssssssssssssss",
            "tx_json": {
                "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "Amount": {
                    "currency": "USD",
                    "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                    "value": "1"
                },
                "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
                "TransactionType": "Payment"
            }
        }
    ]
}
```

*Commandline*
```
#Syntax: sign secret tx_json [offline]
rippled sign sssssssssssssssssssssssssssss '{"TransactionType": "Payment", "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX", "Amount": { "currency": "USD", "value": "1", "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn" }}' false
```

</div>

[Try it! >](ripple-api-tool.html#sign)

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| tx_json | Object | [Transaction definition](transactions.html) in JSON format |
| secret | String | Secret key of the account supplying the transaction, used to sign it. Do not send your secret to untrusted servers or through unsecured network connections. |
| offline | Boolean | (Optional, defaults to false) If true, when constructing the transaction, do not attempt to automatically fill in or validate values. |
| build_path | Boolean | (Optional) If provided for a Payment-type transaction, automatically fill in the `Paths` field before signing. __*Caution:*__ The server looks for the presence or absence of this field, not its value. This behavior may change. (See [RIPD-173](https://ripplelabs.atlassian.net/browse/RIPD-173) for status.) |
| fee\_mult\_max | Integer | (Optional) If the `Fee` parameter ([transaction cost](tx-cost.html)) is omitted, this field limits the automatically-provided value so that it is less than or equal to the base transaction cost times this value. |

The server automatically attempts to fill in certain fields from the `tx_json` object if they are omitted, unless you specified `offline` as true. Otherwise, the following fields from the [transaction format](transactions.html) are automatically filled in:

* `Sequence` - The server automatically uses the next Sequence number from the sender's account information. Be careful: the next sequence number for the account is not incremented until this transaction is applied. If you sign multiple transactions without submitting and waiting for the response to each one, you must provide the correct sequence numbers in the request. Automatically filled unless `offline` is true.
* `Fee` - If you omit the `Fee` parameter, the server [automatically provides an appropriate transaction cost](tx-cost.html#automatically-specifying-the-transaction-cost) unless you specified `offline` as true. If you specify `offline` as true, you must fill in the transaction cost in the `Fee` parameter. Be careful: a malicious server can specify an excessively high transaction cost.
    * If `fee_mult_max` is included, and the automatically provided `Fee` value is greater than the long-term base transaction cost times `fee_mult_max`, then the transaction fails with the error `rpcHIGH_FEE`. This way, you can let the server fill in the current minimum `Fee` value as long as the current load-based transaction cost is not too high.
* `Paths` - For Payment-type transactions (excluding XRP-to-XRP transfers), the Paths field can be automatically filled, as if you did a [ripple_path_find](#ripple-path-find). Only filled if `build_path` is provided. 

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

*JSON-RPC*
```
200 OK
{
    "result": {
        "status": "success",
        "tx_blob": "1200002280000000240000000361D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100D184EB4AE5956FF600E7536EE459345C7BBCF097A84CC61A93B9AF7197EDB98702201CEA8009B7BEEBAA2AACC0359B41C427C1C5B550A4CA4B80CF2174AF2D6D5DCE81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
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
            "TxnSignature": "3045022100D184EB4AE5956FF600E7536EE459345C7BBCF097A84CC61A93B9AF7197EDB98702201CEA8009B7BEEBAA2AACC0359B41C427C1C5B550A4CA4B80CF2174AF2D6D5DCE",
            "hash": "82230B9D489370504B39BC2CE46216176CAC9E752E5C1774A8CBEC9FBB819208"
        }
    }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| tx_blob | String | Binary representation of the fully-qualified, signed transaction, as hex |
| tx_json | Object | JSON specification of the [complete transaction](transactions.html) as signed, including any fields that were automatically filled in |

__*Caution:*__ If this command results in an error messages, the message can contain the account secret from the request. Make sure that these errors are not visible to others, including:

* Do not write this error to a log file that can be seen by multiple people
* Do not paste this error to a public place for debugging
* Do not display the error message on a website, even by accident

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `highFee` - The `fee_mult_max` parameter was specified, but the server's current transaction cost multiplier exceeds the specified one.
* `tooBusy` - The transaction did not include paths, but the server is too busy to do pathfinding right now. Does not occur if you are connected as an admin.
* `noPath` - The transaction did not include paths, and the server was unable to find a path by which this payment can occur.


## submit ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Submit.cpp "Source")

The `submit` method sends a [transaction](transactions.html) to the network to be confirmed and included in future ledgers. 

This command has two modes:

* Submit-only mode takes a signed, serialized transaction as a binary blob, and submits it to the network as-is. Since signed transaction objects are immutable, no portion of the transaction can be modified or automatically filled in after submission.
* Sign-and-submit mode takes a JSON-formatted Transaction object, completes and signs the transaction in the same manner as the [sign command](#sign), and then submits the signed transaction. We recommend only using this mode for testing and development.

To send a transaction as robustly as possible, you should construct and [`sign`](#sign) it in advance, persist it somewhere that you can access even after a power outage, then `submit` it as a `tx_blob`. After submission, monitor the network with the [`tx`](#tx) command to see if the transaction was successfully applied; if a restart or other problem occurs, you can safely re-submit the `tx_blob` transaction: it won't be applied twice since it has the same sequence number as the old transaction. 

### Submit-Only Mode ###

A submit-only request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| tx_blob | String | Hex representation of the signed transaction to submit. |
| fail_hard | Boolean | (Optional, defaults to false) If true, and the transaction fails locally, do not retry or relay the transaction to other servers |

#### Request Format ####


<div class='multicode'>

*WebSocket*
```
{
    "id": 3,
    "command": "submit",
    "tx_blob": "1200002280000000240000001E61D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000B732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7447304502210095D23D8AF107DF50651F266259CC7139D0CD0C64ABBA3A958156352A0D95A21E02207FCF9B77D7510380E49FF250C21B57169E14E9B4ACFD314CEDC79DDD0A38B8A681144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754"
}
```

*JSON-RPC*
```
{
    "method": "submit",
    "params": [
        {
            "tx_blob": "1200002280000000240000000361D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100D184EB4AE5956FF600E7536EE459345C7BBCF097A84CC61A93B9AF7197EDB98702201CEA8009B7BEEBAA2AACC0359B41C427C1C5B550A4CA4B80CF2174AF2D6D5DCE81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754"
        }
    ]
}
```

*Commandline*
```
#Syntax: submit tx_blob
submit 1200002280000000240000000361D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100D184EB4AE5956FF600E7536EE459345C7BBCF097A84CC61A93B9AF7197EDB98702201CEA8009B7BEEBAA2AACC0359B41C427C1C5B550A4CA4B80CF2174AF2D6D5DCE81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754
```

</div>

[Try it! >](ripple-api-tool.html#submit)


### Sign-and-Submit Mode ###

A sign-and-submit request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| tx_json | Object | [Transaction definition](transactions.html) in JSON format, optionally omitting any auto-fillable fields. |
| secret | String | (Required if `tx_json` is supplied) Secret key of the account supplying the transaction, used to sign it. Do not send your secret to untrusted servers or through unsecured network connections. |
| fail_hard | Boolean | (Optional, defaults to false) If true, and the transaction fails locally, do not retry or relay the transaction to other servers |
| offline | Boolean | (Optional, defaults to false) If true, when constructing the transaction, do not attempt to automatically fill in or validate values. |
| build_path | Boolean | (Optional) If provided for a Payment-type transaction, automatically fill in the `Paths` field before signing. You must omit this field if the transaction is a direct XRP-to-XRP transfer. __*Caution:*__ The server looks for the presence or absence of this field, not its value. This behavior may change. (See [RIPD-173](https://ripplelabs.atlassian.net/browse/RIPD-173) for status.) |
| fee\_mult\_max | Integer | (Optional) If the `Fee` parameter is omitted, this field limits the automatically-provided `Fee` value so that it is less than or equal to the long-term base transaction cost times this value. |

See the [sign command](#sign) for detailed information on how the server automatically fills in certain fields.

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

*JSON-RPC*
```
{
    "method": "submit",
    "params": [
        {
            "secret": "sssssssssssssssssssssssssssss",
            "tx_json": {
                "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "Amount": {
                    "currency": "USD",
                    "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                    "value": "1"
                },
                "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
                "TransactionType": "Payment"
            }
        }
    ]
}
```

*Commandline*
```
#Syntax: submit secret json [offline]
submit sssssssssssssssssssssssssssss '{"TransactionType":"Payment", "Account":"rJYMACXJd1eejwzZA53VncYmiK2kZSBxyD", "Amount":"200000000","Destination":"r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV" }'
```

</div>

[Try it! >](ripple-api-tool.html#submit)

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

*JSON-RPC*
```
{
    "result": {
        "engine_result": "tesSUCCESS",
        "engine_result_code": 0,
        "engine_result_message": "The transaction was applied.",
        "status": "success",
        "tx_blob": "1200002280000000240000000361D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100D184EB4AE5956FF600E7536EE459345C7BBCF097A84CC61A93B9AF7197EDB98702201CEA8009B7BEEBAA2AACC0359B41C427C1C5B550A4CA4B80CF2174AF2D6D5DCE81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
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
            "TxnSignature": "3045022100D184EB4AE5956FF600E7536EE459345C7BBCF097A84CC61A93B9AF7197EDB98702201CEA8009B7BEEBAA2AACC0359B41C427C1C5B550A4CA4B80CF2174AF2D6D5DCE",
            "hash": "82230B9D489370504B39BC2CE46216176CAC9E752E5C1774A8CBEC9FBB819208"
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

__*Caution:*__ Even if the WebSocket response has `"status":"success"`, indicating that the command was successfully received, that does not necessarily indicate that the transaction has taken place. There are many cases that can prevent a transaction from processing successfully, such as a lack of trust lines connecting the two accounts in a payment, or changes in the state of the network since the time the transaction was constructed. Even if nothing is wrong, it may take several seconds to close and validate the ledger version that includes the transaction. See the [full list of transaction responses](transactions.html#full-transaction-response-list) for details, and do not consider the transaction's results final until they appear in a validated ledger version.

__*Caution:*__ If this command results in an error messages, the message can contain an account secret, if one was provided in the request. (This is not a problem if the request contained a signed tx_blob instead.) Make sure that these errors are not visible to others, including:

* Do not write an error including your secret to a log file that can be seen by multiple people
* Do not paste an error including your secret to a public place for debugging
* Do not display an error message including your secret on a website, even by accident


#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidTransaction` - The transaction is malformed or otherwise invalid.
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `highFee` - The `fee_mult_max` parameter was specified, but the server's current fee multiplier exceeds the specified one. (Sign-and-Submit mode only)
* `tooBusy` - The transaction did not include paths, but the server is too busy to do pathfinding right now. Does not occur if you are connected as an admin. (Sign-and-Submit mode only)
* `noPath` - The transaction did not include paths, and the server was unable to find a path by which this payment can occur. (Sign-and-Submit mode only)
* `internalTransaction` - An internal error occurred when processing the transaction. This could be caused by many aspects of the transaction, including a bad signature or some fields being malformed.
* `internalSubmit` - An internal error occurred when submitting the transaction. This could be caused by many aspects of the transaction, including a bad signature or some fields being malformed.
* `internalJson` - An internal error occurred when serializing the transaction to JSON. This could be caused by many aspects of the transaction, including a bad signature or some fields being malformed.


## book_offers ##
[[Source]<br>](https://github.com/ripple/rippled/blob/develop/src/ripple/rpc/handlers/BookOffers.cpp "Source")

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
    "currency": "XRP"
  },
  "taker_pays": {
    "currency": "USD",
    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  },
  "limit": 10
}
```

*JSON-RPC*

```
{
    "method": "book_offers",
    "params": [
        {
            "taker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "taker_gets": {
                "currency": "XRP"
            },
            "taker_pays": {
                "currency": "USD",
                "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            },
            "limit": 10
        }
    ]
}
```

*Commandline*

```
#Syntax: book_offers taker_pays taker_gets [taker [ledger [limit] ] ]
rippled book_offers 'USD/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B' 'EUR/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'
```

</div>

[Try it! >](ripple-api-tool.html#book_offers)

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| ledger_hash | String | (Optional) A 20-byte hex string for the ledger version to use. (See [Specifying a Ledger](#specifying-a-ledger-instance)) |
| ledger_index | String or Unsigned Integer| (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying a Ledger](#specifying-a-ledger-instance))|
| limit | Unsigned Integer | (Optional) If provided, the server will not provide more than this many offers in the results. *Note:* Depending on the number of unfunded orders in the ledger, fewer results may be returned. |
| taker | String | (Optional, defaults to [ACCOUNT_ONE](https://ripple.com/wiki/Accounts#ACCOUNT_ONE)) Unique base-58 address of an account to use as point-of-view. (This affects which unfunded offers are returned.) 
| taker_gets | Object | Specification of which currency the account taking the offer would receive, as an object with `currency` and `issuer` fields (omit issuer for XRP), similar to [currency amounts](#specifying-currency-amounts). |
| taker_pays | Object | Specification of which currency the account taking the offer would pay, as an object with `currency` and `issuer` fields (omit issuer for XRP), similar to [currency amounts](#specifying-currency-amounts). |

__*Note:*__ The other parameters of this command (`marker`, `proof`, and `autobridge`) cannot be fully implemented with the current design. (See [RIPD-295](https://ripplelabs.atlassian.net/browse/RIPD-295) for more information).

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

*JSON-RPC*
```
200 OK
{
    "result": {
        "ledger_current_index": 8696243,
        "offers": [],
        "status": "success",
        "validated": false
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
| offers | Array | Array of offer objects, each of which has the fields of an [OfferCreate transaction](transactions.html#offercreate) |

In addition to the standard Offer fields, the following fields may be included in members of the `offers` array:

| Field | Type | Description |
|-------|------|-------------|
| taker_gets_funded | String (XRP) or Object (non-XRP) | (Only included in partially-funded offers) The maximum amount of currency that the taker can get, given the funding status of the offer. |
| taker_pays_funded | String (XRP) or Object (non-XRP) | (Only included in partially-funded offers) The maximum amount of currency that the taker would pay, given the funding status of the offer.
| quality | Number | The exchange rate, as the ratio `taker_pays` divided by `taker_gets`. For fairness, offers that have the same quality are automatically taken first-in, first-out. (In other words, if multiple people offer to exchange currency at the same rate, the oldest offer is taken first.) |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `srcCurMalformed` - The `taker_pays` field in the request is not formatted properly.
* `dstAmtMalformed` - The `taker_gets` field in the request is not formatted properly.
* `srcIsrMalformed` - The `issuer` field of the `taker_pays` field in the request is not valid.
* `dstIsrMalformed` - The `issuer` field of the `taker_gets` field in the request is not valid.
* `badMarket` - The desired order book does not exist; for example, offers to exchange a currency for itself.




# Subscriptions #

Using subscriptions, you can have the server push updates to your client when various events happen, so that you can know right away and react accordingly. Subscriptions are only supported in the WebSocket API, where you can receive additional responses in the same channel.

JSON-RPC support for subscription callbacks is deprecated and may not work as expected.

## subscribe ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Subscribe.cpp "Source")

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

[Try it! >](ripple-api-tool.html#subscribe)

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
* `ledger` - Sends a message whenever the consensus process declares a new validated ledger
* `transactions` - Sends a message whenever a transaction is included in a closed ledger
* `transactions_proposed` - Sends a message whenever a transaction is included in a closed ledger, as well as some transactions that have not yet been included in a validated ledger and may never be. Not all proposed transactions appear before validation, however. (__*Note:*__ [Even some transactions that don't succeed are included](transactions.html#result-categories) in validated ledgers, because they take the anti-spam transaction fee.)

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

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `noPermission` - The request included the `url` field, but you are not connected as an admin.
* `unknownStream` - One or more the members of the `streams` field in the request was not recognized as a valid stream name.
* `malformedStream` - The `streams` field of the request was not formatted properly.
* `malformedAccount` - One of the addresses in the `accounts` or `accounts_proposed` fields of the request is not a properly-formatted Ripple address. (__*Note*__: You _can_ subscribe to the stream of an address that does not yet have an entry in the global ledger; if your subscription is still active, you will get a message when that account receives the payment that creates it.)
* `srcCurMalformed` - One or more `taker_pays` sub-fields of the `books` field in the request is not formatted properly.
* `dstAmtMalformed` - One or more `taker_gets` sub-fields of the `books` field in the request is not formatted properly.
* `srcIsrMalformed` - The `issuer` field of one or more `taker_pays` sub-fields of the `books` field in the request is not valid.
* `dstIsrMalformed` - The `issuer` field of one or more `taker_gets` sub-fields of the `books` field in the request is not valid.
* `badMarket` - One or more desired order books in the `books` field does not exist; for example, offers to exchange a currency for itself.


### Subscription Stream Messages ###

When you subscribe to a particular stream, you will receive periodic responses on that stream until you unsubscribe or close the WebSocket connection. The content of those responses depends on what you subscribed to. Here are some examples:

#### Stream: ledger Message ####

The ledger stream only sends `ledgerClosed` messages when [the consensus process](https://ripple.com/knowledge_center/the-ripple-ledger-consensus-process/) declares a new validated ledger. The message identifies the ledger and provides some information about its contents.

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
| fee\_base | Unsigned Integer | Cost of the 'reference transaction' in drops of XRP. (See [Transaction Cost](tx-cost.html) If the ledger includes a [SetFee pseudo-transaction](transactions.html#setfee) the new transaction cost applies to all transactions after this ledger. |
| fee\_ref | Unsigned Integer | Cost of the 'reference transaction' in 'fee units'. |
| ledger\_hash | String | Unique hash of the ledger that was closed, as hex |
| ledger\_index | Unsigned Integer | Sequence number of the ledger that was closed |
| ledger\_time | Unsigned Integer | The time this ledger was closed, in seconds since the [Ripple Epoch](#specifying-time) |
| reserve\_base | Unsigned Integer | The minimum reserve, in drops of XRP, that is required for an account. If the ledger includes a [SetFee pseudo-transaction](transactions.html#setfee) the new base reserve applies after this ledger. |
| reserve\_inc | Unsigned Integer | The increase in account reserve that is added for each item the account owns, such as offers or trust lines. If the ledger includes a [SetFee pseudo-transaction](transactions.html#setfee) the new owner reserve applies after this ledger.  |
| txn\_count | Unsigned Integer | Number of new transactions included in this ledger |
| validated\_ledgers | String | Range of ledgers that the server has available. This may be discontiguous. |

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
| engine_result | String | String [Transaction result code](transactions.html#result-categories) |
| engine_result_code | Number | Numeric [transaction response code](transactions.html#result-categories), if applicable. |
| engine_result_message | String | Human-readable explanation for the transaction response |
| ledger_current_index | Unsigned Integer | (Omitted for validated transactions) Sequence number of the current ledger version for which this transaction is currently proposed |
| ledger_hash | String | (Omitted for unvalidated transactions) Unique hash of the ledger version that includes this transaction, as hex |
| ledger_index | Unsigned Integer | (Omitted for unvalidated transactions) Sequence number of the ledger version that includes this transaction |
| meta | Object | (Omitted for unvalidated transactions) Various metadata about the transaction, including which ledger entries it affected |
| transaction | Object | The [definition of the transaction](transactions.html) in JSON format |
| validated | Boolean | If true, this transaction is included in a validated ledger. Responses from the `transaction` stream should always be validated. |


## unsubscribe ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Unsubscribe.cpp "Source")

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

[Try it! >](ripple-api-tool.html#unsubscribe)

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

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `noPermission` - The request included the `url` field, but you are not connected as an admin.
* *Unknown Stream* - One or more the members of the `streams` field in the request was not recognized as a valid stream name. (The response does not use an exact code; this is a bug. See [RIPD-702](https://ripplelabs.atlassian.net/browse/RIPD-702) for details and status.)
* `malformedStream` - The `streams` field of the request was not formatted properly.
* `malformedAccount` - One of the addresses in the `accounts` or `accounts_proposed` fields of the request is not a properly-formatted Ripple address. (__*Note*__: You _can_ subscribe to the stream of an address that does not yet have an entry in the global ledger; if your subscription is still active, you will get a message when that account receives the payment that creates it.)
* `srcCurMalformed` - One or more `taker_pays` sub-fields of the `books` field in the request is not formatted properly.
* `dstAmtMalformed` - One or more `taker_gets` sub-fields of the `books` field in the request is not formatted properly.
* `srcIsrMalformed` - The `issuer` field of one or more `taker_pays` sub-fields of the `books` field in the request is not valid.
* `dstIsrMalformed` - The `issuer` field of one or more `taker_gets` sub-fields of the `books` field in the request is not valid.
* `badMarket` - One or more desired order books in the `books` field does not exist; for example, offers to exchange a currency for itself.





# Server Information #

There are also commands that retrieve information about the current state of the server. These may be useful for monitoring the health of the server, or in preparing for making other API methods. For example, you may query for the current fee schedule before sending a transaction, or you may check which ledger versions are available before digging into the ledger history for a specific record.

## server_info ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/ServerInfo.cpp "Source")

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

*JSON-RPC*
```
{
    "method": "server_info",
    "params": [
        {}
    ]
}
```

</div>

[Try it! >](ripple-api-tool.html#server_info)

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

*JSON-RPC*
```
200 OK
{
    "result": {
        "info": {
            "build_version": "0.26.3",
            "complete_ledgers": "32570-8696244",
            "hostid": "AIR",
            "io_latency_ms": 1,
            "last_close": {
                "converge_time_s": 3.123,
                "proposers": 5
            },
            "load_factor": 1,
            "peers": 62,
            "pubkey_node": "n9LVtEwRBRfLhrs5cZcKYiYMw6wT9MgmAZEMQEXmX4Bwkq4D6hc1",
            "server_state": "full",
            "validated_ledger": {
                "age": 3,
                "base_fee_xrp": 1e-05,
                "hash": "43660857C8FD74D8D5B9D6D9E3D4BE11FAD92985F6B8C9A406DC1F87FF6CB77F",
                "reserve_base_xrp": 20,
                "reserve_inc_xrp": 5,
                "seq": 8696244
            },
            "validation_quorum": 3
        },
        "status": "success"
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
| io\_latency\_ms | Number | Amount of time spent waiting for I/O operations to be performed, in milliseconds. If this number is not very, very low, then the `rippled` server is probably having serious load issues. |
| last_close | Object | Information about the last time the server closed a ledger, including the amount of time it took to reach a consensus and the number of trusted validators participating. |
| load | Object | *Admin only* Detailed information about the current load state of the server |
| load.job\_types | Array | *Admin only* Information about the rate of different types of jobs being performed by the server and how much time it spends on each. |
| load.threads | Number | *Admin only* The number of threads in the server's main job pool, performing various Ripple Network operations. |
| load\_factor | Number | The load factor the server is currently enforcing, as a multiplier on the base transaction cost. The load factor is determined by the highest of the individual server's load factor, cluster's load factor, and the overall network's load factor. **Note:** This `load_factor` is calculated as the ratio of the `load_factor` and the `load_base` that are reported by the [`server_state` command](#server-state) |
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

<!--Note: keep the above table up-to-date with the Get Server Status method in the Ripple-REST documentation -->

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).



## server_state ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/ServerState.cpp "Source")

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

*JSON-RPC*
```
{
    "method": "server_state",
    "params": [
        {}
    ]
}
```

</div>

[Try it! >](ripple-api-tool.html#server_state)

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

*JSON-RPC*
```
200 OK
{
    "result": {
        "state": {
            "build_version": "0.26.3",
            "complete_ledgers": "32570-8696244",
            "io_latency_ms": 1,
            "last_close": {
                "converge_time": 2120,
                "proposers": 5
            },
            "load_base": 256,
            "load_factor": 256,
            "peers": 58,
            "pubkey_node": "n9LJ5eCNjeUXQpNXHCcLv9PQ8LMFYy4W8R1BdVNcpjc1oDwe6XZF",
            "server_state": "full",
            "validated_ledger": {
                "base_fee": 10,
                "close_time": 463192610,
                "hash": "43660857C8FD74D8D5B9D6D9E3D4BE11FAD92985F6B8C9A406DC1F87FF6CB77F",
                "reserve_base": 20000000,
                "reserve_inc": 5000000,
                "seq": 8696244
            },
            "validation_quorum": 3
        },
        "status": "success"
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
| load\_base | Number | This amount of server load is the baseline that is used to decide how much to charge in transaction fees; if the `load_factor` is equal to the `load_base` then only the base fee is enforced; if the `load_factor` is double the `load_base` then transaction fees are doubled. |
| load\_factor | Number | The load factor the server is currently enforcing. The ratio between this value and the load\_base determines the multiplier for transaction fees. The load factor is determined by the highest of the individual server's load factor, cluster's load factor, and the overall network's load factor. |
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

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).

## can_delete ##
[[Source]<br>](https://github.com/ripple/rippled/blob/develop/src/ripple/rpc/handlers/CanDelete.cpp "Source")

With `online_delete` and `advisory_delete` configuration options enabled, the `can_delete` method informs the rippled server of the latest ledger which may be deleted. 

_The `can_delete` method is an admin command that cannot be run by unpriviledged users._

#### Request Format ####

An example of the request format:

<div class='multicode'>

*WebSocket*
```
{
  "id": 2,
  "command": "can_delete",
  "can_delete": 11320417
}
```

*JSON-RPC*
```
{
    "method": "can_delete",
    "params": [
        {
            "can_delete": 11320417
        }
    ]
}
```

*Commandline*
```
#Syntax can_delete [<ledger_index>|<ledger_hash>|now|always|never]
rippled can_delete 11320417
```

</div>

The request includes the following optional parameter:

| Field | Type | Description |
|-------|------|-------------|
| can_delete | String or Integer | The maximum ledger to allow to be deleted. For `ledger_index` or `ledger_hash`, see [Specifying a Ledger](#specifying-a-ledger-instance). `never` sets the value to 0, and effectively disables online deletion until another `can_delete` is appropriately called.  `always` sets the value to the maximum possible ledger (4294967295), and online deletion will occur as of each configured `online_delete` interval. `now` triggers online deletion at the next validated ledger that meets or exceeds the configured `online_delete` interval, but no further. |

If no parameter is specified, no change is made.

The response follows the [standard format](#response-formatting), with
a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| can_delete | Integer | The maximum ledger index that may be removed by the online deletion routine. |

Use this command with no parameter to query the existing `can_delete` setting.

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `notEnabled` - Not enabled in configuration.
* `notReady` - Not ready to handle this request.
* `lgrNotFound` - Ledger not found.
* `invalidParams` - Invalid parameters.


## consensus_info ##
[[Source]<br>](https://github.com/ripple/rippled/blob/a61ffab3f9010d8accfaa98aa3cacc7d38e74121/src/ripple/rpc/handlers/ConsensusInfo.cpp "Source")

The `consensus_info` command provides information about the consensus process for debugging purposes.

_The `consensus_info` method is an admin command that cannot be run by unpriviledged users._

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
{
    "id": 99,
    "command": "consensus_info"
}
```

*JSON-RPC*

```
{
    "method": "consensus_info",
    "params": [
        {}
    ]
}
```

*Commandline*

```
#Syntax: consensus_info
rippled consensus_info
```

</div>

The request has no parameters.

#### Response Format ####

An example of a successful response:

<div class='multicode'>

*JSON-RPC*

```
{
   "result" : {
      "info" : {
         "acquired" : {
            "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306" : "acquired"
         },
         "close_granularity" : 10,
         "close_percent" : 50,
         "close_resolution" : 10,
         "close_times" : {
            "486082972" : 1,
            "486082973" : 4
         },
         "current_ms" : 1003,
         "have_time_consensus" : false,
         "ledger_seq" : 13701086,
         "our_position" : {
            "close_time" : 486082973,
            "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
            "propose_seq" : 0,
            "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
         },
         "peer_positions" : {
            "0A2EAF919033A036D363D4E5610A66209DDBE8EE" : {
               "close_time" : 486082972,
               "peer_id" : "n9KiYM9CgngLvtRCQHZwgC2gjpdaZcCcbt3VboxiNFcKuwFVujzS",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "1567A8C953A86F8428C7B01641D79BBF2FD508F3" : {
               "close_time" : 486082973,
               "peer_id" : "n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "202397A81F20B44CF44EA99AF761295E5A8397D2" : {
               "close_time" : 486082973,
               "peer_id" : "n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "5C29005CF4FB479FC49EEFB4A5B075C86DD963CC" : {
               "close_time" : 486082973,
               "peer_id" : "n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "EFC49EB648E557CC50A72D715249B80E071F7705" : {
               "close_time" : 486082973,
               "peer_id" : "n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            }
         },
         "previous_mseconds" : 2005,
         "previous_proposers" : 5,
         "proposers" : 5,
         "proposing" : false,
         "state" : "consensus",
         "synched" : true,
         "validating" : false
      },
      "status" : "success"
   }
}

```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "info" : {
         "acquired" : {
            "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306" : "acquired"
         },
         "close_granularity" : 10,
         "close_percent" : 50,
         "close_resolution" : 10,
         "close_times" : {
            "486082972" : 1,
            "486082973" : 4
         },
         "current_ms" : 1003,
         "have_time_consensus" : false,
         "ledger_seq" : 13701086,
         "our_position" : {
            "close_time" : 486082973,
            "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
            "propose_seq" : 0,
            "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
         },
         "peer_positions" : {
            "0A2EAF919033A036D363D4E5610A66209DDBE8EE" : {
               "close_time" : 486082972,
               "peer_id" : "n9KiYM9CgngLvtRCQHZwgC2gjpdaZcCcbt3VboxiNFcKuwFVujzS",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "1567A8C953A86F8428C7B01641D79BBF2FD508F3" : {
               "close_time" : 486082973,
               "peer_id" : "n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "202397A81F20B44CF44EA99AF761295E5A8397D2" : {
               "close_time" : 486082973,
               "peer_id" : "n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "5C29005CF4FB479FC49EEFB4A5B075C86DD963CC" : {
               "close_time" : 486082973,
               "peer_id" : "n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "EFC49EB648E557CC50A72D715249B80E071F7705" : {
               "close_time" : 486082973,
               "peer_id" : "n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            }
         },
         "previous_mseconds" : 2005,
         "previous_proposers" : 5,
         "proposers" : 5,
         "proposing" : false,
         "state" : "consensus",
         "synched" : true,
         "validating" : false
      },
      "status" : "success"
   }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| info | Object | Information that may be useful for debugging consensus. This output is subject to change without notice. |

The following is an incomplete summary of fields that may be contained in the `info` object:

| Field | Type | Description |
|-------|------|-------------|
| ledger\_seq | Number | The sequence number of the ledger currently in the consensus process |
| our\_position | Object | This server's expectation for the ledger in the consensus process. |
| peer\_positions | Object | Map of peers and their proposed versions of the ledger in the consensus process. |
| proposers | Number | The number of trusted validators participating in this consensus process. Which validators are trusted depends on this server's configuration. |
| synched | Boolean | Whether this server considers itself in sync with the network. |
| state | String | What portion of the consensus process is currently in progress: `open`, `consensus`, `finished`, or `accepted`. |

It is also normal to get a minimal result where the only field in `info` is `"consensus": "none"`. This indicates that the server is in between consensus rounds. 

The results of the `consensus_info` command can vary dramatically if you run it several times, even in short succession.


#### Possible Errors ####

* Any of the [universal error types](#universal-errors).


## fetch_info ##
[[Source]<br>](https://github.com/ripple/rippled/blob/315a8b6b602798a4cff4d8e1911936011e12abdb/src/ripple/rpc/handlers/FetchInfo.cpp "Source")

The `fetch_info` command returns information about objects that this server is currently fetching from the network, and how many peers have that information. It can also be used to reset current fetches. 

_The `fetch_info` method is an admin command that cannot be run by unpriviledged users._

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
{
    "id": 91,
    "command": "fetch_info",
    "clear": false
}
```

*JSON-RPC*

```
{
    "method": "fetch_info",
    "params": [
        {
            "clear": false
        }
    ]
}
```

*Commandline*

```
#Syntax: fetch_info [clear]
rippled fetch_info
```

</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| clear | Boolean | If `true`, reset current fetches. Otherwise, only get status of fetches in progress. |

#### Response Format ####

An example of a successful response:

<div class='multicode'>

*JSON-RPC*

```
{
   "result" : {
      "info" : {
         "348928" : {
            "hash" : "C26D432B06F84861BCACD7942EDC3FE0B2E1DEB966A9E516A0FD275A375C2010",
            "have_header" : true,
            "have_state" : false,
            "have_transactions" : true,
            "needed_state_hashes" : [
               "BF8DC6B1E10D1D3565BF0649075D22EBFD34F751AFCC0E53E81D74786BC88922",
               "34E37A71CB51A12C73A435250E6A6349F7884C7EEBA6B88FA31F0244E967E88F",
               "BFB7D3008A7D61FD6A0538D1C2E70CFB94CE8DC66606319C372F278A48629765",
               "41C0C61D701FB1EA586F0EF1FC7A91FEC476D979589DA60507F05C13F7C21975",
               "6DDE8840A2C3C7FF05E5FFEE4D06408694C16A8357338FE0C4581DC3D8A00BBA",
               "6C69D833B582C849917806FA009518832BB50E900E43716FD7CC1966428DD0CF",
               "1EDC020CFC4AF19B625C52E20B66D6AE672821CCC461E8A9C457A3B2955657F7",
               "FC0616A66A2B0589CA513F3341D4EA51E782C4601E5072308478E3CC19264640",
               "19FC607B5DE1B64681A676EC1ED5507B9555B0E098CD9D898320297DE1A64033",
               "5E128D3FC990074E35687387A14AA12D9FD287E5AB57CB9B2FD83DE635DF5CA9",
               "DE72820F3981770F2AA8770BC233B80661F1A452819D8529008875FF8DED87A9",
               "3ACB84BEE2C45556351FF60FD787D235C9CF5623FB8A35B01446B773598E7CC0",
               "0DD3A8DF69874148057F1F2BF305442FF2E89A76A08B4CC8C051E2ED69B874F3",
               "4AE9A9C4F12A5BD0355037DA40A0B145420A2168A9FEDE43E643BD13062F8ECE",
               "08CBF8CFFEC207F5AC4E4F24BC447011FD8C79D25B344281FBFB4732D7058ED4",
               "779B2577C5C4BAED6657421448EA506BBF50F86BE363E0924127C4EA17A58BBE"
            ],
            "peers" : 2,
            "timeouts" : 0
         }
      },
      "status" : "success"
   }
}

```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "info" : {
         "348928" : {
            "hash" : "C26D432B06F84861BCACD7942EDC3FE0B2E1DEB966A9E516A0FD275A375C2010",
            "have_header" : true,
            "have_state" : false,
            "have_transactions" : true,
            "needed_state_hashes" : [
               "BF8DC6B1E10D1D3565BF0649075D22EBFD34F751AFCC0E53E81D74786BC88922",
               "34E37A71CB51A12C73A435250E6A6349F7884C7EEBA6B88FA31F0244E967E88F",
               "BFB7D3008A7D61FD6A0538D1C2E70CFB94CE8DC66606319C372F278A48629765",
               "41C0C61D701FB1EA586F0EF1FC7A91FEC476D979589DA60507F05C13F7C21975",
               "6DDE8840A2C3C7FF05E5FFEE4D06408694C16A8357338FE0C4581DC3D8A00BBA",
               "6C69D833B582C849917806FA009518832BB50E900E43716FD7CC1966428DD0CF",
               "1EDC020CFC4AF19B625C52E20B66D6AE672821CCC461E8A9C457A3B2955657F7",
               "FC0616A66A2B0589CA513F3341D4EA51E782C4601E5072308478E3CC19264640",
               "19FC607B5DE1B64681A676EC1ED5507B9555B0E098CD9D898320297DE1A64033",
               "5E128D3FC990074E35687387A14AA12D9FD287E5AB57CB9B2FD83DE635DF5CA9",
               "DE72820F3981770F2AA8770BC233B80661F1A452819D8529008875FF8DED87A9",
               "3ACB84BEE2C45556351FF60FD787D235C9CF5623FB8A35B01446B773598E7CC0",
               "0DD3A8DF69874148057F1F2BF305442FF2E89A76A08B4CC8C051E2ED69B874F3",
               "4AE9A9C4F12A5BD0355037DA40A0B145420A2168A9FEDE43E643BD13062F8ECE",
               "08CBF8CFFEC207F5AC4E4F24BC447011FD8C79D25B344281FBFB4732D7058ED4",
               "779B2577C5C4BAED6657421448EA506BBF50F86BE363E0924127C4EA17A58BBE"
            ],
            "peers" : 2,
            "timeouts" : 0
         }
      },
      "status" : "success"
   }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| info | Object | Map of objects being fetched and the status of that object being fetched. A ledger being fetched may be identified by its sequence number; ledgers and other objects being fetched may also be identified by their hashes. |

The fields describing a fetch in progress are subject to change without notice. The following fields may be included:

| Field | Type | Description |
|-------|------|-------------|
| hash | String | The hash of the object being fetched. |
| have\_header | Boolean | For a ledger, whether this server has already obtained the ledger's header section. |
| have\_transactions | Boolean | For a ledger, whether this server has already obtained the transaction section of that ledger. |
| needed\_state\_hashes | Array of (Hash) Strings | The hash values of state nodes still needed from this object. If more than 16 are needed, the response contains only the first 16. |
| peers | Number | The number of peers who have this object available. |
| timeouts | Number | The number of times that fetching this object has resulted in a timeout (2.5 seconds). |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).


## get_counts ##
[[Source]<br>](https://github.com/ripple/rippled/blob/c7118a183a660648aa88a3546a6b2c5bce858440/src/ripple/rpc/handlers/GetCounts.cpp "Source")

The `get_counts` command provides various stats about the health of the server, mostly the number of objects of different types that it currently holds in memory. 

_The `get_counts` method is an admin command that cannot be run by unpriviledged users._

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
{
    "id": 90,
    "command": "get_counts",
    "min_count": 100
}
```

*JSON-RPC*

```
{
    "method": "get_counts",
    "params": [
        {
            "min_count": 100
        }
    ]
}
```

*Commandline*

```
#Syntax: get_counts [min_count]
rippled get_counts 100
```

</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| min_count | Number (Unsigned Integer) | Only return fields with a value at least this high. |

#### Response Format ####

An example of a successful response:

<div class='multicode'>

*JSON-RPC*

```
{
   "result" : {
      "AL_hit_rate" : 48.36725616455078,
      "HashRouterEntry" : 3048,
      "Ledger" : 46,
      "NodeObject" : 10417,
      "SLE_hit_rate" : 64.62035369873047,
      "STArray" : 1299,
      "STLedgerEntry" : 646,
      "STObject" : 6987,
      "STTx" : 4104,
      "STValidation" : 610,
      "Transaction" : 4069,
      "dbKBLedger" : 10733,
      "dbKBTotal" : 39069,
      "dbKBTransaction" : 26982,
      "fullbelow_size" : 0,
      "historical_perminute" : 0,
      "ledger_hit_rate" : 71.0565185546875,
      "node_hit_rate" : 3.808214902877808,
      "node_read_bytes" : 393611911,
      "node_reads_hit" : 1283098,
      "node_reads_total" : 679410,
      "node_writes" : 1744285,
      "node_written_bytes" : 794368909,
      "status" : "success",
      "treenode_cache_size" : 6650,
      "treenode_track_size" : 598631,
      "uptime" : "3 hours, 50 minutes, 27 seconds",
      "write_load" : 0
   }
}

```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "AL_hit_rate" : 48.36725616455078,
      "HashRouterEntry" : 3048,
      "Ledger" : 46,
      "NodeObject" : 10417,
      "SLE_hit_rate" : 64.62035369873047,
      "STArray" : 1299,
      "STLedgerEntry" : 646,
      "STObject" : 6987,
      "STTx" : 4104,
      "STValidation" : 610,
      "Transaction" : 4069,
      "dbKBLedger" : 10733,
      "dbKBTotal" : 39069,
      "dbKBTransaction" : 26982,
      "fullbelow_size" : 0,
      "historical_perminute" : 0,
      "ledger_hit_rate" : 71.0565185546875,
      "node_hit_rate" : 3.808214902877808,
      "node_read_bytes" : 393611911,
      "node_reads_hit" : 1283098,
      "node_reads_total" : 679410,
      "node_writes" : 1744285,
      "node_written_bytes" : 794368909,
      "status" : "success",
      "treenode_cache_size" : 6650,
      "treenode_track_size" : 598631,
      "uptime" : "3 hours, 50 minutes, 27 seconds",
      "write_load" : 0
   }
}
```

</div>

The response follows the [standard format](#response-formatting). The list of fields contained in the result is subject to change without notice, but it may contain any of the following (among others):

| Field | Type | Description |
|-------|------|-------------|
| Transaction | Number | The number of `Transaction` objects in memory |
| Ledger | Number | The number of ledgers in memory |
| uptime | String | The amount of time this server has been running uninterrupted. |

For most other entries, the value indicates the number of objects of that type currently in memory.

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.


## ledger_cleaner ##
[[Source]<br>](https://github.com/ripple/rippled/blob/df54b47cd0957a31837493cd69e4d9aade0b5055/src/ripple/rpc/handlers/LedgerCleaner.cpp "Source")

The `ledger_cleaner` command controls the [Ledger Cleaner](https://github.com/ripple/rippled/blob/f313caaa73b0ac89e793195dcc2a5001786f916f/src/ripple/app/ledger/README.md#the-ledger-cleaner), an asynchronous maintenance process that can find and repair corruption in rippled's database of ledgers. 

_The `ledger_cleaner` method is an admin command that cannot be run by unpriviledged users._

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
{
    "command": "ledger_cleaner",
    "max_ledger": 13818756,
    "min_ledger": 13818000,
    "stop": false
}
```

</div>

The request includes the following parameters:

| Field       | Type    | Description |
|-------------|---------|-------------|
| ledger      | Number (Ledger Sequence Number) | (Optional) If provided, check and correct this specific ledger only. |
| max_ledger  | Number (Ledger Sequence Number) | (Optional) Configure the ledger cleaner to check ledgers with sequence numbers equal or lower than this. |
| min_ledger  | Number (Ledger Sequence Number) | (Optional) Configure the ledger cleaner to check ledgers with sequence numbers equal or higher than this. |
| full        | Boolean | (Optional) If true, fix ledger state nodes and transations in the specified ledger(s). Defaults to false. Automatically set to `true` if `ledger` is provided. |
| fix_txns    | Boolean | (Optional) If true, correct transaction in the specified ledger(s). Overrides `full` if provided. |
| check_nodes | Boolean | (Optional) If true, correct ledger state nodes in the specified ledger(s). Overrides `full` if provided. |
| stop        | Boolean | (Optional) If true, disable the ledger cleaner. |

#### Response Format ####

An example of a successful response:

<div class='multicode'>

*JSON-RPC*

```
200 OK
{
   "result" : {
      "message" : "Cleaner configured",
      "status" : "success"
   }
}

```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| message | String | `Cleaner configured` on success. |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `internal` if one the parameters was specified in a way that the server couldn't interpret. (This is a bug, and it should return `invalidParams` instead. See [RPD-916](https://ripplelabs.atlassian.net/browse/RIPD-916) for status.)


## log_level ##
[[Source]<br>](https://github.com/ripple/rippled/blob/155fcdbcd0b4927152892c8c8be01d9cf62bed68/src/ripple/rpc/handlers/LogLevel.cpp "Source")

The `log_level` command changes the `rippled` server's logging verbosity, or returns the current logging level for each category (called a _partition_) of log messages.

_The `log_level` method is an admin command that cannot be run by unpriviledged users._

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
{
    "id": "ll1",
    "command": "log_level",
    "severity": "debug",
    "partition": "PathRequest"
}
```

*Commandline*

```
#Syntax: log_level [[partition] severity]
rippled log_level PathRequest debug
```

</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| severity | String | (Optional) What level of verbosity to set logging at. Valid values are, in order from least to most verbose: `fatal`, `error`, `warn`, `info`, `debug`, and `trace`. If omitted, return current log verbosity for all categories. |
| partition | String | (Optional) Ignored unless `severity` is provided. Which logging category to modify. If omitted, or if provided with the value `base`, set logging level for all categories. |

#### Response Format ####

Examples of successful responses:

<div class='multicode'>

*Commandline (set log level)*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "status" : "success"
   }
}
```

*Commandline (check log levels)*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "levels" : {
         "AmendmentTable" : "Error",
         "Application" : "Error",
         "CancelOffer" : "Error",
         "Collector" : "Error",
         "CreateOffer" : "Error",
         "DeferredCredits" : "Error",
         "FeeVote" : "Error",
         "InboundLedger" : "Error",
         "JobQueue" : "Error",
         "Ledger" : "Error",
         "LedgerCleaner" : "Error",
         "LedgerConsensus" : "Error",
         "LedgerEntrySet" : "Error",
         "LedgerMaster" : "Error",
         "LedgerTiming" : "Error",
         "LoadManager" : "Error",
         "LoadMonitor" : "Error",
         "NetworkOPs" : "Error",
         "NodeObject" : "Error",
         "OrderBookDB" : "Error",
         "Overlay" : "Error",
         "PathRequest" : "Debug",
         "Payment" : "Error",
         "Peer" : "Error",
         "PeerFinder" : "Error",
         "Protocol" : "Error",
         "RPC" : "Error",
         "RPCErr" : "Error",
         "RPCHandler" : "Error",
         "RPCManager" : "Error",
         "Resolver" : "Error",
         "Resource" : "Error",
         "RippleCalc" : "Error",
         "SHAMap" : "Error",
         "SHAMapStore" : "Error",
         "SNTPClient" : "Error",
         "STAmount" : "Error",
         "SerializedLedger" : "Error",
         "Server" : "Error",
         "SetAccount" : "Error",
         "SetTrust" : "Error",
         "TaggedCache" : "Error",
         "TransactionAcquire" : "Error",
         "TransactionEngine" : "Error",
         "UVL" : "Error",
         "UniqueNodeList" : "Error",
         "Validations" : "Error",
         "WALCheckpointer" : "Error",
         "WebSocket" : "Trace",
         "base" : "Error"
      },
      "status" : "success"
   }
}
```

</div>

The response follows the [standard format](#response-formatting). The response format depends on whether the request specified a `severity`. If it did, the log level is changed and a successful result contains no additional fields. 

Otherwise, the request contains the following field:

| Field | Type | Description |
|-------|------|-------------|
| level | Object | The current log levels of each category. This list of categories is subject to change without notice in future releases. You can use the field names as values to `partition` in requests to this command. |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.


## logrotate ##
[[Source]<br>](https://github.com/ripple/rippled/blob/743bd6c9175c472814448ea889413be79dfd1c07/src/ripple/rpc/handlers/LogRotate.cpp "Source")

The `logrotate` command closes and reopens the log file. This is intended to facilitate log rotation on Linux file systems.

_The `logrotate` method is an admin command that cannot be run by unpriviledged users._

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
{
    "id": "lr1",
    "command": "logrotate"
}
```

*Commandline*

```
rippled logrotate
```

</div>

The request includes no parameters.

#### Response Format ####

An example of a successful response:

<div class='multicode'>

*JSON-RPC*

```
200 OK
{
   "result" : {
      "message" : "The log file was closed and reopened.",
      "status" : "success"
   }
}

```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "message" : "The log file was closed and reopened.",
      "status" : "success"
   }
}

```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| message | String | On success, contains the message `The log file was closed and reopened.` |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).


## validation_create ##
[[Source]<br>](https://github.com/ripple/rippled/blob/315a8b6b602798a4cff4d8e1911936011e12abdb/src/ripple/rpc/handlers/ValidationCreate.cpp "Source")

Use the `validation_create` command to generate the keys for a rippled [validating node](rippled-setup.html#validator-setup). Similar to the [wallet_propose](#wallet-propose) command, this command makes no real changes, but only generates a set of keys in the proper format.

_The `validation_create` method is an admin command that cannot be run by unpriviledged users._

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
{
    "id": 0,
    "command": "validation_create",
    "secret": "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE"
}
```

*JSON-RPC*

```
{
    "method": "validation_create",
    "params": [
        {
            "secret": "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE"
        }
    ]
}
```

*Commandline*

```
#Syntax: validation_create [secret]
rippled validation_create "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE"
```

</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| secret | String | (Optional) Use this value as a seed to generate the credentials. The same secret always generates the same credentials. You can provide the seed in [RFC-1751](https://tools.ietf.org/html/rfc1751) format or Ripple's base-58 format. If omitted, generate a random seed. |

**Note:** The security of your validator depends on the entropy of your seed. Do not use a secret value that is not sufficiently randomized for real business purposes. We recommend omitting the `secret` when generating new credentials for the first time.

#### Response Format ####

An example of a successful response:

<div class='multicode'>

*JSON-RPC*

```
{
   "result" : {
      "status" : "success",
      "validation_key" : "FAWN JAVA JADE HEAL VARY HER REEL SHAW GAIL ARCH BEN IRMA",
      "validation_public_key" : "n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG",
      "validation_seed" : "ssZkdwURFMBXenJPbrpE14b6noJSu"
   }
}
```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "status" : "success",
      "validation_key" : "FAWN JAVA JADE HEAL VARY HER REEL SHAW GAIL ARCH BEN IRMA",
      "validation_public_key" : "n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG",
      "validation_seed" : "ssZkdwURFMBXenJPbrpE14b6noJSu"
   }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| validation\_key | String | The secret key for these validation credentials, in [RFC-1751](https://tools.ietf.org/html/rfc1751) format. |
| validation\_public\_key | String | The public key for these validation credentials, in Ripple's base-58 encoded string format. |
| validation\_seed | String | The secret key for these validation credentials, in Ripple's base-58 encoded string format. |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `badSeed` - The request provided an invalid seed value. This usually means that the seed value appears to be a valid string of a different format, such as an account address or validation public key.


## validation_seed ##
[[Source]<br>](https://github.com/ripple/rippled/blob/a61ffab3f9010d8accfaa98aa3cacc7d38e74121/src/ripple/rpc/handlers/ValidationSeed.cpp "Source")

The `validation_seed` command temporarily sets the secret value that rippled uses to sign validations. This value resets based on the config file when you restart the server.

*The `validation_seed` request is an admin command that cannot be run by unpriviledged users!*

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
{
    "id": "set_seed_1",
    "command": "validation_seed",
    "secret": "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE"
}
```

*Commandline*

```
#Syntax: validation_seed [secret]
rippled validation_seed 'BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE'
```

</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| secret | String | (Optional) If present, use this value as the secret value for the validating key pair. Valid formats include base-58, [RFC-1751](https://tools.ietf.org/html/rfc1751), or as a passphrase. If omitted, disables proposing validations to the network. |

#### Response Format ####

An example of a successful response:

<div class='multicode'>

*JSON-RPC*

```
200 OK
{
   "result" : {
      "status" : "success",
      "validation_key" : "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE",
      "validation_public_key" : "n9Jx6RS6zSgqsgnuWJifNA9EqgjTKAywqYNReK5NRd1yLBbfC3ng",
      "validation_seed" : "snjJkyBGogTem5dFGbcRaThKq2Rt3"
   }
}
```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "status" : "success",
      "validation_key" : "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE",
      "validation_public_key" : "n9Jx6RS6zSgqsgnuWJifNA9EqgjTKAywqYNReK5NRd1yLBbfC3ng",
      "validation_seed" : "snjJkyBGogTem5dFGbcRaThKq2Rt3"
   }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| validation\_key | String | (Omitted if proposing disabled) The secret key for these validation credentials, in [RFC-1751](https://tools.ietf.org/html/rfc1751) format. |
| validation\_public\_key | String | (Omitted if proposing disabled) The public key for these validation credentials, in Ripple's base-58 encoded string format. |
| validation\_seed | String | (Omitted if proposing disabled) The secret key for these validation credentials, in Ripple's base-58 encoded string format. |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `badSeed` - The request provided an invalid secret value. This usually means that the secret value appears to be a valid string of a different format, such as an account address or validation public key.


## peers ##
[[Source]<br>](https://github.com/ripple/rippled/blob/52f298f150fc1530d201d3140c80d3eaf781cb5f/src/ripple/rpc/handlers/Peers.cpp "Source")

The `peers` command returns a list of all other `rippled` servers currently connected to this one, including information on their connection and sync status.

*The `peers` request is an admin command that cannot be run by unpriviledged users!*

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
{
    "id": 5,
    "command": "peers"
}
```

*Commandline*

```
rippled peers
```

</div>

The request includes no additional parameters.

#### Response Format ####

An example of a successful response:

<div class='multicode'>

*JSON-RPC*

```
{
   "result" : {
      "peers" : [
         {
            "address" : "54.86.175.122:51235",
            "complete_ledgers" : "14088526 - 14089550",
            "ledger" : "D4D34FBDCF5AD9E9C1EF80FF3B37C161B6C1A30A393332296DCEBBD01DBD6EE5",
            "load" : 1,
            "public_key" : "n94rE1SydpHTvJ4NyX9vC1cdeDmYP5nQSXTyeMnLh8jMJSRdcy9Q",
            "version" : "rippled-0.28.1-hf2"
         },
         {
            "address" : "192.170.145.70:51235",
            "complete_ledgers" : "14088527 - 14089551",
            "latency" : 2913,
            "ledger" : "D4D34FBDCF5AD9E9C1EF80FF3B37C161B6C1A30A393332296DCEBBD01DBD6EE5",
            "load" : 10,
            "public_key" : "n9L7jeMAVM28wfzhdzoYZqcvBRkP5p6ZCvidgqmyEa62ThUdCE1x",
            "version" : "rippled-0.28.0-rc3"
         },
         {
            "address" : "192.170.145.69:51235",
            "complete_ledgers" : "14088527 - 14089551",
            "latency" : 7802,
            "ledger" : "D4D34FBDCF5AD9E9C1EF80FF3B37C161B6C1A30A393332296DCEBBD01DBD6EE5",
            "load" : 10,
            "public_key" : "n94JPD9sx9TetuJGn1ju5TRDG87Di7EEbUbXWCdjj52GKqZUsnKA",
            "version" : "rippled-0.28.1-hf2"
         },
         {
            "address" : "74.201.214.197:51235",
            "complete_ledgers" : "14088531 - 14089555",
            "ledger" : "77A37B94DDA7F1501076CC344F7DC0556684AFEB6ADA6EFF066977DCA3FB994F",
            "load" : 4,
            "public_key" : "n9LAPy9VbzXtodR4W58umSwwcbQsf9ZgFv1bpsd95CAgo7GWUvM4",
            "version" : "rippled-0.28.1-hf2"
         },
         {
            "address" : "93.190.138.234:51235",
            "complete_ledgers" : "13948110 - 14089552",
            "ledger" : "99288D510F63FDAC3F91BB410E4E251B050F92DF196CA33946A2F339DFF7483E",
            "load" : 52,
            "public_key" : "n9LYLVRw987hj8tyDdt2gVXZyrq4NvXF5vi4YwZPUNGaoPkqo4PH",
            "version" : "rippled-0.28.0-b18"
         },
         {
            "address" : "192.170.145.77:51235",
            "complete_ledgers" : "32570 - 14089555",
            "ledger" : "BFFF0AA3C71F9E1690F1B5537416CAEA2A038C896650FC5BB6E1057E464088ED",
            "load" : 4,
            "public_key" : "n9LwcmtjDAJQz4u8DZCMGQ9GXHuMEV4Cf8KpPL9NgqAV2puxdYc2",
            "version" : "rippled-0.28.1-hf2"
         },
         {
            "address" : "188.166.17.21:52345",
            "complete_ledgers" : "14089423 - 14089551",
            "latency" : 7894,
            "ledger" : "2DBD1EAD2BAE89C01C183BE818B35C2E67BB2D0B07922C58A57A399B1ABD48BA",
            "load" : 8,
            "public_key" : "n9M3pWqDot5jyDRSdre6AZQVTA4RFXwUzWZHfj8m2dqMX1S99erB",
            "version" : "rippled-0.27.0"
         },
         {
            "address" : "198.204.238.130:51235",
            "complete_ledgers" : "14087551 - 14089551",
            "latency" : 3427,
            "ledger" : "D4D34FBDCF5AD9E9C1EF80FF3B37C161B6C1A30A393332296DCEBBD01DBD6EE5",
            "load" : 8,
            "public_key" : "n94PN5sKswgBVjmg5UcJs2dwjSippFrbZXnHALvCm52LY1L3KGLT",
            "version" : "rippled-0.27.4"
         },
         {
            "address" : "162.217.98.92:51235",
            "complete_ledgers" : "14088527 - 14089551",
            "latency" : 2694,
            "ledger" : "D4D34FBDCF5AD9E9C1EF80FF3B37C161B6C1A30A393332296DCEBBD01DBD6EE5",
            "load" : 7,
            "public_key" : "n9L4MyAQHZgtnhUSYeNmbc2SeveoBbxu9kWDyxckijGgj5WuKmy2",
            "version" : "rippled-0.28.1-hf2"
         },
         {
            "address" : "72.251.233.166:51235",
            "complete_ledgers" : "14088531 - 14089555",
            "latency" : 9358,
            "ledger" : "77A37B94DDA7F1501076CC344F7DC0556684AFEB6ADA6EFF066977DCA3FB994F",
            "load" : 88,
            "public_key" : "n9MdrPRH9tQ6RDwwP4M41GJHTqgsVnBX2YLJd9XdYdgFzxSefdi8",
            "version" : "rippled-0.28.0-rc3"
         }
      ],
      "status" : "success"
   }
}
```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "peers" : [
         {
            "address" : "162.217.98.91:51235",
            "complete_ledgers" : "14014038 - 14015062",
            "latency" : 93,
            "ledger" : "4DBECEB8DA331D9616FFAE4146A919D7A1BA7D06938239258FBD8A82C37585A7",
            "load" : 15,
            "public_key" : "n94szsuScMEjP4Nu7c3mndcyjWJELepZcASEkDMcDSwXhHH6Sn37",
            "version" : "rippled-0.28.1-rc3"
         },
         {
            "address" : "54.186.248.91:51235",
            "complete_ledgers" : "14014038 - 14015062",
            "latency" : 68,
            "ledger" : "4DBECEB8DA331D9616FFAE4146A919D7A1BA7D06938239258FBD8A82C37585A7",
            "load" : 17,
            "public_key" : "n9MT5EjnV912KGuBUqPs4tpdhzMPGcnDBrTuWkD9sWQHJ1kDcUcz",
            "version" : "rippled-0.28.1-rc3"
         },
         {
            "address" : "162.217.98.136:51235",
            "complete_ledgers" : "32570 - 14015062",
            "latency" : 97,
            "ledger" : "4DBECEB8DA331D9616FFAE4146A919D7A1BA7D06938239258FBD8A82C37585A7",
            "load" : 32,
            "public_key" : "n944PcXEoZaiEHnwFD92xA4bxsS7jjYb27WcdDQwkHYyk1MWTEsX",
            "version" : "rippled-0.28.1-rc3"
         },
         {
            "address" : "54.186.73.52:51235",
            "complete_ledgers" : "14014038 - 14015062",
            "latency" : 68,
            "ledger" : "4DBECEB8DA331D9616FFAE4146A919D7A1BA7D06938239258FBD8A82C37585A7",
            "load" : 14,
            "public_key" : "n9JySgyBVcQKvyDoeRKg7s2Mm6ZcFHk22vUZb3o1HSosWxcj9xPt",
            "version" : "rippled-0.28.1-rc3"
         },
         {
            "address" : "72.251.233.165:51235",
            "complete_ledgers" : "14014038 - 14015062",
            "latency" : 39,
            "ledger" : "4DBECEB8DA331D9616FFAE4146A919D7A1BA7D06938239258FBD8A82C37585A7",
            "load" : 15,
            "public_key" : "n9M77Uc9CSaSFZqt5V7sxPR4kFwbha7hwUFBD5v5kZt2SQjBeoDs",
            "version" : "rippled-0.28.1-hf1"
         },
         {
            "address" : "72.251.233.164:51235",
            "complete_ledgers" : "14014038 - 14015062",
            "latency" : 35,
            "ledger" : "4DBECEB8DA331D9616FFAE4146A919D7A1BA7D06938239258FBD8A82C37585A7",
            "load" : 15,
            "public_key" : "n9LWq5vQbx9nrm5ERkjbvNmAN8erdoShdHWiHYj18Gbo3ExsnFDE",
            "version" : "rippled-0.28.1-rc3"
         },
         {
            "address" : "162.217.98.90:51235",
            "complete_ledgers" : "14014038 - 14015062",
            "latency" : 114,
            "ledger" : "4DBECEB8DA331D9616FFAE4146A919D7A1BA7D06938239258FBD8A82C37585A7",
            "load" : 14,
            "public_key" : "n9KJB2KWFQcqQcnjNN9wLZ5KPYjFcoVpvZ94m6t34tvjV5PquhCc",
            "version" : "rippled-0.28.1-rc3"
         },
         {
            "address" : "72.251.233.166:51235",
            "complete_ledgers" : "14014038 - 14015062",
            "latency" : 20,
            "ledger" : "4DBECEB8DA331D9616FFAE4146A919D7A1BA7D06938239258FBD8A82C37585A7",
            "load" : 9,
            "public_key" : "n9MdrPRH9tQ6RDwwP4M41GJHTqgsVnBX2YLJd9XdYdgFzxSefdi8",
            "version" : "rippled-0.28.0-rc3"
         },
         {
            "address" : "72.251.233.163:51235",
            "complete_ledgers" : "14014038 - 14015062",
            "latency" : 31,
            "ledger" : "4DBECEB8DA331D9616FFAE4146A919D7A1BA7D06938239258FBD8A82C37585A7",
            "load" : 16,
            "public_key" : "n94ne2Z5dX8qcJNa8cPtAbtn21gEaCoEduS8TwdGAhi1iLfCUMDm",
            "version" : "rippled-0.28.1-rc3"
         },
         {
            "address" : "72.251.232.171:51235",
            "complete_ledgers" : "32570 - 14015062",
            "latency" : 32,
            "ledger" : "4DBECEB8DA331D9616FFAE4146A919D7A1BA7D06938239258FBD8A82C37585A7",
            "load" : 44,
            "public_key" : "n9LJekVe9sUpxf1PEhWX3Csg63oShsTLMEfJ1mL4kpuzDu3bxotS",
            "version" : "rippled-0.28.1-rc3"
         }
      ],
      "status" : "success"
   }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing a `peers` array. Each member of the peers array is a peer object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| address | String | The IP address and port where this peer is connected |
| cluster | Boolean | (May be omitted) If `true`, the current server and the peer server are part of the same `rippled` cluster. |
| name | String | (May be omitted) If the peer is part of the same cluster, this is the display name for that node as defined in the config file. |
| complete\_ledgers | String | Range expression indicating the sequence numbers of the ledger versions the peer `rippled` has available |
| inbound | Boolean | (May be omitted) If `true`, the peer is connecting to the local server. |
| latency | Number | The network latency to the peer (in milliseconds) |
| ledger | String | The hash of the peer's most recently closed ledger |
| load | Number | A measure of the amount of load the peer server is putting on the local server. Larger numbers indicate more load. (The units by which load is measured are not formally defined.) |
| protocol | String | (May be omitted) The protocol version that the peer is using, if not the same as the local server. |
| public\_key | String | (May be omitted) A public key that can be used to verify the integrity of the peer's messages. This is not the same key that is used for validations, but it follows the same format. |
| sanity | String | (May be omitted) Whether this peer is following the same rules and ledger sequence as the current server. A value of `insane` probably indicates that the peer is part of a parallel network. The value `unknown` indicates that the current server is unsure whether the peer is compatible. |
| status | String | (May be omitted) The most recent status message from the peer. Could be `connecting`, `connected`, `monitoring`, `validating`, or `shutting`. |
| version | string | (May be omitted) The `rippled` version number of the peer server |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).


## print ##
[[Source]<br>](https://github.com/ripple/rippled/blob/315a8b6b602798a4cff4d8e1911936011e12abdb/src/ripple/rpc/handlers/Print.cpp "Source")

The `print` command returns the current status of various internal subsystems, including peers, the ledger cleaner, and the resource manager.

*The `print` request is an admin command that cannot be run by unpriviledged users!*

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
{
    "id": "print_req_1",
    "command": "print"
}
```

*Commandline*

```
rippled print
```

</div>

The request includes no parameters.

#### Response Format ####

An example of a successful response:

<div class='multicode'>

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "app" : {
         "ledgercleaner" : {
            "status" : "idle"
         },
         "peers" : {
            "peerfinder" : {
               "bootcache" : {
                  "entries" : 109
               },
               "config" : {
                  "auto_connect" : "true",
                  "features" : "",
                  "max_peers" : 21,
                  "out_peers" : 10,
                  "port" : 51235,
                  "want_incoming" : "true"
               },
               "counts" : {
                  "accept" : 0,
                  "close" : 0,
                  "cluster" : "0",
                  "connect" : 0,
                  "fixed" : "0",
                  "in" : "0/11",
                  "out" : "10/10",
                  "total" : "10"
               },
               "fixed" : 0,
               "livecache" : {
                  "entries" : [
                     {
                        "address" : "23.239.3.247:51235",
                        "expires" : "30000000000 nanoseconds",
                        "hops" : 2
                     },
                     {
                        "address" : "192.170.145.88:51235",
                        "expires" : "30000000000 nanoseconds",
                        "hops" : 1
                     },
                     {
                        "address" : "198.204.238.130:51235",
                        "expires" : "26000024558 nanoseconds",
                        "hops" : 1
                     },
                     {
                        "address" : "203.127.12.115:51235",
                        "expires" : "26000024558 nanoseconds",
                        "hops" : 2
                     },
                     {
                        "address" : "212.83.147.67:51235",
                        "expires" : "26000024558 nanoseconds",
                        "hops" : 2
                     }
                  ],
                  "hist" : "0, 10, 74, 10, 0, 0, 0, 0",
                  "size" : "94"
               },
               "peers" : [
                  {
                     "local_address" : "10.1.10.78:48923",
                     "remote_address" : "52.24.43.83:51235",
                     "state" : "active"
                  },
                  {
                     "local_address" : "10.1.10.78:50004",
                     "remote_address" : "52.26.205.197:51235",
                     "state" : "active"
                  },
                  {
                     "local_address" : "10.1.10.78:37019",
                     "remote_address" : "168.1.60.132:51235",
                     "state" : "active"
                  },
                  {
                     "local_address" : "10.1.10.78:38775",
                     "remote_address" : "192.170.145.88:51235",
                     "state" : "active"
                  },
                  {
                     "local_address" : "10.1.10.78:34793",
                     "remote_address" : "198.204.238.130:51235",
                     "state" : "active"
                  }
               ]
            }
         },
         "resource" : {
            "admin" : [
               {
                  "balance" : 0,
                  "count" : 1,
                  "name" : "\"127.0.0.1\""
               }
            ],
            "inactive" : [],
            "inbound" : [],
            "outbound" : [
               {
                  "balance" : 23,
                  "count" : 1,
                  "name" : "93.190.138.234:51235"
               },
               {
                  "balance" : 35,
                  "count" : 1,
                  "name" : "198.204.238.130:51235"
               },
               {
                  "balance" : 31,
                  "count" : 1,
                  "name" : "52.26.205.197:51235"
               },
               {
                  "balance" : 32,
                  "count" : 1,
                  "name" : "54.186.73.52:51235"
               },
               {
                  "balance" : 15,
                  "count" : 1,
                  "name" : "72.251.233.164:51235"
               }
            ]
         },
         "server" : {
            "active" : "2",
            "hist" : "16",
            "history" : [
               {
                  "bytes_in" : "214",
                  "bytes_out" : "11688",
                  "elapsed" : "0 seconds",
                  "id" : "16",
                  "requests" : 1,
                  "when" : "2015-Jun-16 16:33:50"
               },
               {
                  "bytes_in" : "214",
                  "bytes_out" : "11431",
                  "elapsed" : "0 seconds",
                  "id" : "15",
                  "requests" : 1,
                  "when" : "2015-Jun-16 16:11:59"
               },
               {
                  "bytes_in" : "227",
                  "bytes_out" : "337",
                  "elapsed" : "0 seconds",
                  "id" : "3",
                  "requests" : 1,
                  "when" : "2015-Jun-16 14:57:23"
               },
               {
                  "bytes_in" : "214",
                  "bytes_out" : "2917",
                  "elapsed" : "0 seconds",
                  "id" : "2",
                  "requests" : 1,
                  "when" : "2015-Jun-16 12:39:29"
               },
               {
                  "bytes_in" : "220",
                  "bytes_out" : "1426",
                  "elapsed" : "0 seconds",
                  "id" : "1",
                  "requests" : 1,
                  "when" : "2015-Jun-16 12:39:13"
               }
            ]
         },
         "validators" : {}
      },
      "status" : "success"
   }
}

```

</div>

The response follows the [standard format](#response-formatting). Additional fields in the result depend on the internal state of the `rippled` server. The results of this command are subject to change without notice.

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).



# Convenience Functions #

The rippled server also provides a few simple commands purely for convenience.

## ping ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Ping.cpp "Source")

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

*JSON-RPC*
```
{
    "method": "ping",
    "params": [
        {}
    ]
}
```

*Commandline*
```
#Syntax: ping
rippled ping
```

</div>

[Try it! >](ripple-api-tool.html#ping)

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

*JSON-RPC*
```
200 OK
{
    "result": {
        "status": "success"
    }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing no fields. The client can measure the round-trip time from request to response as latency.

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).


## random ##
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Random.cpp "Source")

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

*JSON-RPC*
```
{
    "method": "random",
    "params": [
        {}
    ]
}
```

*Commandline*
```
#Syntax: random
rippled random
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

*JSON-RPC*
```
200 OK
{
    "result": {
        "random": "4E57146AA47BC6E88FDFE8BAA235B900126C916B6CC521550996F590487B837A",
        "status": "success"
    }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following field:

| Field | Type | Description |
|-------|------|-------------|
| random | String | Random 256-bit hex value. |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `internal` - Some internal error occurred, possibly relating to the random number generator.


## json ##

The `json` method is a proxy to running other commands, and accepts the parameters for the command as a JSON value. It is *exclusive to the Commandline client*, and intended for cases where the commandline syntax for specifying parameters is inadequate or undesirable. 

#### Request Format ####
An example of the request format:

<div class='multicode'>

*Commandline*
```
# Syntax: json method json_stanza
rippled -q json ledger_closed '{}'
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


## connect ##
[[Source]<br>](https://github.com/ripple/rippled/blob/a61ffab3f9010d8accfaa98aa3cacc7d38e74121/src/ripple/rpc/handlers/Connect.cpp "Source")

The `connect` command forces the rippled server to connect to a specific peer rippled server.

*The `connect` request is an admin command that cannot be run by unpriviledged users!*

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
{
    "command": "connect",
    "ip": "192.170.145.88",
    "port": 51235
}
```

*JSON-RPC*

```
{
    "method": "connect",
    "params": [
        {
            "ip": "192.170.145.88",
            "port": 51235
        }
    ]
}
```


*Commandline*

```
#Syntax: connect ip [port]
rippled connect 192.170.145.88 51235
```

</div>

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| ip | String | IP address of the server to connect to |
| port | Number | (Optional) Port number to use when connecting. Defaults to 6561. |

#### Response Format ####

An example of a successful response:

<div class='multicode'>

*JSON-RPC*

```
{
   "result" : {
      "message" : "connecting",
      "status" : "success"
   }
}

```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "message" : "connecting",
      "status" : "success"
   }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| message | String | The value `connecting`, if the command was successful. |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* Cannot connect in standalone mode - Network-related commands are disabled in stand-alone mode.


## stop ##
[[Source]<br>](https://github.com/ripple/rippled/blob/develop/src/ripple/rpc/handlers/Stop.cpp "Source")

Gracefully shuts down the server.

*The `stop` request is an admin command that cannot be run by unpriviledged users!*

#### Request Format ####
An example of the request format:

<div class='multicode'>

*WebSocket*

```
{
    "id": 0,
    "command": "stop"
}
```

*JSON-RPC*

```
{
    "method": "stop",
    "params": [
        {}
    ]
}
```

*Commandline*

```
rippled stop
```

</div>

The request includes no parameters.

#### Response Format ####

An example of a successful response:

<div class='multicode'>

*JSON-RPC*

```
{
   "result" : {
      "message" : "ripple server stopping",
      "status" : "success"
   }
}
```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "message" : "ripple server stopping",
      "status" : "success"
   }
}
```

</div>

The response follows the [standard format](#response-formatting), with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| message | String | `ripple server stopping` on success. |

#### Possible Errors ####

* Any of the [universal error types](#universal-errors).

