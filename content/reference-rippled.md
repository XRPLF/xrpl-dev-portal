# rippled

The core peer-to-peer server that manages the XRP Ledger is called `rippled`. Each `rippled` server connects to a network of peers, relays cryptographically signed transactions, and maintains a local copy of the complete shared global ledger. The source code for `rippled` is written in C++, and is [available on GitHub under an open-source license](https://github.com/ripple/rippled).

* [`rippled` Setup](tutorial-rippled-setup.html)
* [API Reference](#api-methods)
* [Transaction Reference](reference-transaction-format.html)
* JavaScript Client Library - [RippleAPI](reference-rippleapi.html)


# WebSocket and JSON-RPC APIs

If you want to communicate directly with a `rippled` server, you can use either the WebSocket API or the JSON-RPC API. Both APIs use the same list of commands, with almost entirely the same parameters in each command. Alternatively, you can use [RippleAPI](reference-rippleapi.html), which is a simplified JavaScript client library, which communicates directly with a `rippled` server from [Node.js](http://nodejs.org/) or a web browser.

* The WebSocket API uses the [WebSocket protocol](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), available in most browsers and Javascript implementations, to achieve persistent two-way communication. There is not a 1:1 correlation between requests and responses. Some requests prompt the server to send multiple messages back asynchronously; other times, responses may arrive in a different order than the requests that prompted them. The `rippled` server can be configured to accept secured (wss:), unsecured (ws:) WebSocket connections, or both.
* The JSON-RPC API relies on request-response communication via HTTP or HTTPS. (The `rippled` server can be configured to accept HTTP, HTTPS, or both.) For commands that prompt multiple responses, you can provide a callback URL.

In general, we recommend using WebSocket, because WebSocket's push paradigm has less latency and less network overhead. WebSocket is also more reliable; you can worry less about missing messages and establishing multiple connections. On the other hand, there is widespread support for JSON-RPC because you can use a standard HTTP library to connect to `rippled`'s JSON-RPC API.

**Note:** The `rippled` program can also be used as a quick commandline client to make JSON-RPC requests to a running `rippled` server. The commandline interface is intended for administrative purposes only and is _not a supported API_.


## Changes to the APIs

The WebSocket and JSON-RPC APIs are still in development, and are subject to change. If you want to be notified of upcoming changes and future versions of `rippled`, subscribe to the Ripple Server mailing list:

[https://groups.google.com/forum/#!forum/ripple-server](https://groups.google.com/forum/#!forum/ripple-server)

## Connecting to rippled

Before you can run any commands against a `rippled` server, you must know which server you are connecting to. Most servers are configured not to accept API requests directly from the outside network.

Alternatively, you can [run your own local copy of `rippled`](tutorial-rippled-setup.html). This is required if you want to access any of the [Admin Commands](#list-of-admin-commands). In this case, you should use whatever IP and port you configured the server to bind. (For example, `127.0.0.1:54321`) Additionally, to access admin functionality, you must connect from a port/IP address marked as admin in the config file.

The [example config file](https://github.com/ripple/rippled/blob/release/doc/rippled-example.cfg#L907-L930) listens for connections on the local loopback network (127.0.0.1), with JSON-RPC (HTTP) on port 5005 and WebSocket (WS) on port 6006, and treats all connected clients as admin.

### WebSocket API

If you are looking to try out some methods on the XRP Ledger, you can skip writing your own WebSocket code and go straight to using the API at the [Ripple WebSocket API Tool](ripple-api-tool.html). Later on, when you want to connect to your own `rippled` server, you can [build your own client in the browser](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications) or [in Node.js](https://www.npmjs.com/package/ws).

#### Request Formatting

After you open a WebSocket to the `rippled` server, you can send commands as a [JSON](https://en.wikipedia.org/wiki/JSON) object, with the following attributes:

* Put command name in top-level `"command"` field
* All the relevant parameters for the command are also in the top level
* Optionally include an `"id"` field with an arbitrary value. The response to this request uses the same `"id"` field. This way, even if responses arrive out of order, you know which request prompted which response.

The response comes as a JSON object.

#### Public Servers

Currently Ripple (the company) maintains a set of public WebSocket servers at:

| `Domain`        | Port | Notes                                 |
|:----------------|:-----|:--------------------------------------|
| `s1.ripple.com` | 443  | `wss://` only; general purpose server |
| `s2.ripple.com` | 443  | `wss://` only; full-history server    |

These public servers are not for sustained or business use, and they may become unavailable at any time. For regular use, you should run your own `rippled` server or contract someone you trust to do so.


### JSON-RPC

You can use any HTTP client (like [Poster for Firefox](https://addons.mozilla.org/en-US/firefox/addon/poster/) or [Postman for Chrome](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en)) to make JSON-RPC calls a `rippled` server. Most programming languages have a library for making HTTP requests built in.

#### Request Formatting

To make a JSON-RPC request, send an HTTP **POST** request to the root path (`/`) on the port and IP where the `rippled` server is listening for JSON-RPC connections. You can use HTTP/1.0 or HTTP/1.1. If you use HTTPS, you should use TLS v1.2. For security reasons, `rippled` _does not support_ SSL v3 or earlier.

Always include a `Content-Type` header with the value `application/json`.

If you plan on making multiple requests, use [Keep-Alives](http://tools.ietf.org/html/rfc7230#section-6.3) so that you do not have to close and re-open the connection in between requests.

Send request body as a [JSON](https://en.wikipedia.org/wiki/JSON) object with the following attributes:

* Put the command in the top-level `"method"` field
* Include a top-level `"params"` field. The contents of this field should be **a one-item array** containing only a nested JSON object with all the parameters for the command.

The response is also a JSON object.

#### Public Servers

Currently, Ripple (the company) maintains a set of public JSON-RPC servers at:

| `Domain`        | Port  | Notes                  |
|:----------------|:------|:-----------------------|
| `s1.ripple.com` | 51234 | General purpose server |
| `s2.ripple.com` | 51234 | Full-history server    |

These public servers are not for sustained or business use, and they may become unavailable at any time. For regular use, you should run your own `rippled` server or contract someone you trust to do so.


### Commandline

The commandline interface connects to the same service as the JSON-RPC one, so the public servers and server configuration are the same. As a commandline client, `rippled` connects to the local instance. For example:

```
rippled --conf=/etc/rippled.cfg server_info
```

**Note:** The commandline interface is intended for administrative purposes only and is _not a supported API_.


#### Request Formatting

The commandline puts the command after any normal (dash-prefaced) commandline options, followed by a limited set of parameters, separated by spaces. For any parameter values that might contain spaces or other unusual characters, use single-quotes to encapsulate them.

## Example Request

<!-- MULTICODE_BLOCK_START -->

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

<!-- MULTICODE_BLOCK_END -->

## Response Formatting

#### Example Successful Response

<!-- MULTICODE_BLOCK_START -->

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

<!-- MULTICODE_BLOCK_END -->

The fields of a successful response include:

| `Field`         | Type     | Description                                     |
|:----------------|:---------|:------------------------------------------------|
| `id`            | (Varies) | (WebSocket only) ID provided in the request that prompted this response |
| `status`        | String   | (WebSocket only) The value `success` indicates the request was successfully received and understood by the server. |
| `result.status` | String   | (JSON-RPC and Commandline) The value `success` indicates the request was successfully received and understood by the server. |
| `type`          | String   | (WebSocket only) The value `response` indicates a successful response to a command. [Asynchronous notifications](#subscriptions) use a different value such as `ledgerClosed` or `transaction`. |
| `result`        | Object   | The result of the query; contents vary depending on the command. |

#### Commandline
The response format for commandline methods is the same as JSON-RPC responses, because they use the same interface.

## Error Responses
It is impossible to list all the possible ways an error can occur. Some may occur in the transport layer (for example, loss of network connectivity), in which case the results vary depending on what client and transport you are using. However, if the `rippled` server successfully receives your request, it tries to respond in a standardized error format.

Some example errors:

<!-- MULTICODE_BLOCK_START -->

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

<!-- MULTICODE_BLOCK_END -->

#### WebSocket API Error Response Format
| `Field`   | Type     | Description                                           |
|:----------|:---------|:------------------------------------------------------|
| `id`      | (Varies) | ID provided in the Web Socket request that prompted this response |
| `status`  | String   | `"error"` if the request caused an error              |
| `type`    | String   | Typically `"response"`, which indicates a successful response to a command. |
| `error`   | String   | A unique code for the type of error that occurred     |
| `request` | Object   | A copy of the request that prompted this error, in JSON format. **Caution:** If the request contained any account secrets, they are copied here! |

#### JSON-RPC API Error Response Format
Some JSON-RPC request respond with an error code on the HTTP layer. In these cases, the response is a plain-text explanation in the response body. For example, if you forgot to specify the command in the `method` parameter, the response is like this:

```
HTTP Status: 400 Bad Request
Null method
```

For other errors that returned with HTTP status code 200 OK, the responses are formatted in JSON, with the following fields:

| `Field`          | Type   | Description                                      |
|:-----------------|:-------|:-------------------------------------------------|
| `result`         | Object | Object containing the response to the query      |
| `result.error`   | String | A unique code for the type of error that occurred |
| `result.status`  | String | `"error"` if the request caused an error         |
| `result.request` | Object | A copy of the request that prompted this error, in JSON format. **Caution:** If the request contained any account secrets, they are copied here! **Note:** The request is re-formatted in WebSocket format, regardless of the request made. |

### Caution on Errors

When your request results in an error, the entire request is copied back as part of the response, so that you can try to debug the error. However, this also includes any secrets that were passed as part of the request. When sharing error messages, be very careful not to accidentally expose important account secrets to others.

### Universal Errors

All methods can potentially return any of the following values for the `error` code:

* `unknownCmd` - The request does not contain a [command](#api-methods) that the `rippled` server recognizes.
* `jsonInvalid` - (WebSocket only) The request is not a proper JSON object.
    * JSON-RPC returns a 400 Bad Request HTTP error in this case instead.
* `missingCommand` - (WebSocket only) The request did not specify a `command` field.
    * JSON-RPC returns a 400 Bad Request HTTP error in this case instead.
* `tooBusy` - The server is under too much load to do this command right now. Generally not returned if you are connected as an admin.
* `noNetwork` - The server is having trouble connecting to the rest of the XRP Ledger peer-to-peer network (and is not running in stand-alone mode).
* `noCurrent` - The server does not know what the current ledger is, due to high load, network problems, validator failures, incorrect configuration, or some other problem.
* `noClosed` - The server does not have a closed ledger, typically because it has not finished starting up.
* `wsTextRequired` - (WebSocket only) The request's [opcode](https://tools.ietf.org/html/rfc6455#section-5.2) is not text.

## Formatting Conventions

The WebSocket and JSON-RPC APIs generally take the same arguments, although they're provided in a different way (See [Request Formatting](#request-formatting) for details). Many similar parameters appear throughout the APIs, and there are conventions for how to specify these parameters.

All field names are case-sensitive. In responses, fields that are taken directly from ledger objects or transaction instructions start with upper-case letters. Other fields, including ones that are dynamically generated for a response, are lower case.

## Basic Data Types

Different types of objects are uniquely identified in different ways:

[Accounts](concept-accounts.html) are identified by their [Address][], for example `"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"`. Addresses always start with "r". Many `rippled` methods also accept a hexadecimal representation.

[Transactions](reference-transaction-format.html) are identified by a [Hash][] of the transaction's binary format. You can also identify a transaction by its sending account and [Sequence Number][].

Each closed [Ledger](reference-ledger-format.html) has a [Ledger Index][] and a [Hash][] value. When [Specifying a Ledger Instance](#specifying-ledgers) you can use either one.

### Addresses
[Address]: #addresses

{% include 'data_types/address.md' %}


### Hashes
[Hash]: #hashes

{% include 'data_types/hash.md' %}


### Account Sequence
[Sequence Number]: #account-sequence

{% include 'data_types/account_sequence.md' %}


### Ledger Index
[Ledger Index]: #ledger-index

{% include 'data_types/ledger_index.md' %}


### Specifying Ledgers

Many API methods require you to specify an instance of the ledger, with the data retrieved being considered up-to-date as of that particular version of the shared ledger. The commands that accept a ledger version all work the same way. There are three ways you can specify which ledger you want to use:

1. Specify a ledger by its [Ledger Index][] in the `ledger_index` parameter. Each closed ledger has an identifying sequence number that is 1 higher than the previously-validated ledger. (The Genesis Ledger has sequence number 0)
2. Specify a ledger by its [Hash][] value in the `ledger_hash` parameter.
3. Specify a ledger by one of the following shortcuts, in the `ledger_index` parameter:
    * `validated` for the most recent ledger that has been validated by the whole network
    * `closed` for the most recent ledger that has been closed for modifications and proposed for validation
    * `current` for the server's current working version of the ledger.

There is also a deprecated `ledger` parameter which accepts any of the above three formats. *Do not* use this parameter; it may be removed without further notice.

If you do not specify a ledger, the `current` (in-progress) ledger is chosen by default. If you provide more than one field specifying ledgers, the deprecated `ledger` field is used first if it exists, falling back to `ledger_hash`. The `ledger_index` field is ignored unless neither of the other two are present.

**Note:** Do not rely on this default behavior for specifying a ledger; it is subject to change. Always specify a ledger version in the request if you can.


## Currencies

There are two kinds of currencies in the XRP Ledger: XRP, and everything else. There are many differences between the two:

| `XRP`                                                           | Issued Currencies |
|:----------------------------------------------------------------|:-----------|
| Has no issuer.                                                  | Always issued by an XRP Ledger account |
| Specified as a string                                           | Specified as an object |
| Tracked in [accounts](reference-ledger-format.html#accountroot) | Tracked in [trust lines](reference-ledger-format.html#ripplestate) |
| Can never be created; can only be destroyed                     | Can be issued or redeemed freely |
| Maximum value `100000000000` (`1e11`)                           | Maximum value `9999999999999999e80` |
| Precise to the nearest ["drop"](#xrp) (0.000001 XRP)            | 15 decimal digits of precision, with a minimum nonzero absolute value of `1000000000000000e-96` |

**Caution:** The XRP Ledger uses decimal math with different precision than typical floating-point numbers, so currency amounts are always presented as strings.

### Specifying Currency Amounts

Some API methods require you to specify an amount of currency. Depending on whether you are dealing in the network's native XRP currency or other currency units (called _issuances_), the style for specifying it is very different.

#### XRP
[drops of XRP]: #xrp
[XRP, in drops]: #xrp

Amounts of XRP are represented as strings. (XRP has precision equivalent to a 64-bit integer, but JSON integers are limited to 32 bits, so XRP can overflow if represented in a JSON integer.) XRP is formally specified in "drops", which are equivalent to 0.000001 (one 1-millionth) of an XRP each. Thus, to represent 1.0 XRP in a JSON document, you would write:

```
"1000000"
```

**Do not specify XRP as an object.**

Unit tests are permitted to submit values of XRP (not drops) with a decimal point - for example, "1.23" meaning 1.23 XRP. All other cases should always specify XRP in drops, with no decimal point: e.g. "1230000" meaning 1.23 XRP.

#### Non-XRP

If you are specifying non-XRP currency (including fiat dollars, precious metals, cryptocurrencies, or other custom currency) you must specify it with a currency specification object. This is a JSON object with three fields:

| `Field`    | Type                       | Description                        |
|:-----------|:---------------------------|:-----------------------------------|
| `currency` | String - [Currency Code][] | Arbitrary code for currency to issue. Cannot be `XRP`. |
| `value`    | String                     | Quoted decimal representation of the amount of currency. This can include scientific notation, such as `1.23e11` meaning 123,000,000,000. Both `e` and `E` may be used. |
| `issuer`   | String                     | Unique account address of the entity issuing the currency. In other words, the person or business where the currency can be redeemed. |

**Caution:** These field names are case-sensitive.

For example, to represent $153.75 US dollars issued by account `r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59`, you would specify:

```
{
    "currency": "USD",
    "value": "153.75",
    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
}
```

Unit tests are permitted to submit amounts of non-XRP currencies as a slash-separated string in the format `"amount/currency/issuer"`. All other cases should use the JSON object format above.

#### Specifying Currencies Without Amounts

If you are specifying a non-XRP currency without an amount (typically for defining an order book of currency exchange offers) you should specify it as above, but omit the `value` field.

If you are specifying XRP without an amount (typically for defining an order book) you should specify it as a JSON object with _only_ a `currency` field. Never include an `issuer` field for XRP.

Finally, if the recipient account of the payment trusts multiple issuers for a currency, you can indicate that the payment should be made in any combination of issuers that the recipient accepts. To do this, specify the recipient account's address as the `issuer` value in the JSON object.

### Currency Codes
[Currency Code]: #currency-codes

{% include 'data_types/currency_code.md' %}


## Specifying Time

The `rippled` server and its APIs represent time as an unsigned integer. This number measures the number of seconds since the "Ripple Epoch" of January 1, 2000 (00:00 UTC). This is like the way the [Unix epoch](http://en.wikipedia.org/wiki/Unix_time) works, except the Ripple Epoch is 946684800 seconds after the Unix Epoch.

Don't convert Ripple Epoch times to UNIX Epoch times in 32-bit variables: this could lead to integer overflows.

## Possible Server States

Depending on how the `rippled` server is configured, how long it has been running, and other factors, a server may be participating in the global XRP Ledger peer-to-peer network to different degrees. This is represented as the `server_state` field in the responses to the [`server_info`](#server-info) and [`server_state`](#server-state) commands. The possible responses follow a range of ascending interaction, with each later value superseding the previous one. Their definitions are as follows (in order of increasing priority):

| `Value`        | Description                                                 |
|:---------------|:------------------------------------------------------------|
| `disconnected` | The server is not connected to the XRP Ledger peer-to-peer network whatsoever. It may be running in offline mode, or it may not be able to access the network for whatever reason. |
| `connected`    | The server believes it is connected to the network.         |
| `syncing`      | The server is currently behind on ledger versions. (It is normal for a server to spend a few minutes catching up after you start it.) |
| `tracking`     | The server is in agreement with the network                 |
| `full`         | The server is fully caught-up with the network and could participate in validation, but is not doing so (possibly because it has not been configured as a validator). |
| `validating`   | The server is currently participating in validation of the ledger |
| `proposing`    | The server is participating in validation of the ledger and currently proposing its own version. |

**Note:** The distinction between `full`, `validating`, and `proposing` is based on synchronization with the rest of the global network, and it is normal for a server to fluctuate between these states as a course of general operation.

## Markers and Pagination

Some methods return more data than can efficiently fit into one response. When there are more results than contained, the response includes a `marker` field. You can use this to retrieve more pages of data across multiple calls. In each request, pass the `marker` value from the previous response to resume from the point where you left off. If the `marker` is omitted from a response, then you have reached the end of the data set.

The format of the `marker` field is intentionally undefined. Each server can define a `marker` field as desired, so it may take the form of a string, a nested object, or another type. Different servers, and different methods provided by the same server, can have different `marker` definitions. Each `marker` is ephemeral, and may not work as expected after 10 minutes.


## Modifying the Ledger

All changes to the XRP Ledger happen as the result of transactions. The only API methods that can change the contents of the XRP Ledger are the commands that submit transactions. Even then, changes only apply permanently if the transactions are approved by the [consensus process](concept-consensus.html). Most other public methods represent different ways to view the data represented in the XRP Ledger, or request information about the state of the server.

Transaction submission commands:

- [`submit` command](#submit)
- [`submit_multisigned` command](#submit-multisigned)

For more information on the various transactions you can submit, see the [Transaction Reference](reference-transaction-format.html).



# API Methods

API methods for the Websocket and JSON-RPC APIs are defined by command names, and are divided into Public Commands and Admin Commands. Public Commands are not necessarily meant for the general public, but they are used by any client attached to the server. (Think of Public Commands as being for members or customers of the organization running the server, while the Admin Commands are for the personnel in charge of keeping the server operational.) Public Commands include operations such as checking the state of the ledger, finding a path to connecting users, and submitting a transaction, among others. Admin Commands, on the other hand, are meant only for trusted server operators, and include commands for managing, monitoring, and debugging the server.


## List of Public Commands

* [`account_currencies` - Get a list of currencies an account can send or receive](#account-currencies)
* [`account_channels` - Get a list of payment channels where the account is the source of the channel](#account-channels)
* [`account_info` - Get basic data about an account](#account-info)
* [`account_lines` - Get info about an account's trust lines](#account-lines)
* [`account_objects` - Get all ledger objects owned by an account](#account-objects)
* [`account_offers` - Get info about an account's currency exchange offers](#account-offers)
* [`account_tx` - Get info about an account's transactions](#account-tx)
* [`book_offers` - Get info about offers to exchange two currencies](#book-offers)
* [`channel_authorize` - Sign a claim for money from a payment channel](#channel-authorize)
* [`channel_verify` - Check a payment channel claim's signature](#channel-verify)
* [`fee` - Get information about transaction cost](#fee)
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
* [`sign_for` - Contribute to a multi-signature](#sign-for)
* [`submit` - Send a transaction to the network](#submit)
* [`submit_multisigned` - Send a multi-signed transaction to the network](#submit-multisigned)
* [`subscribe` - Listen for updates about a particular subject](#subscribe)
* [`transaction_entry` - Retrieve info about a transaction from a particular ledger version](#transaction-entry)
* [`tx` - Retrieve info about a transaction from all the ledgers on hand](#tx)
* [`tx_history` - Retrieve info about all recent transactions](#tx-history)
* [`unsubscribe` - Stop listening for updates about a particular subject](#unsubscribe)

The `owner_info` command is deprecated. Use [`account_objects`](#account-objects) instead.

## List of Admin Commands

Admin commands are only available if you [connect to `rippled`](#connecting-to-rippled) on a host and port that the config file identifies as admin. (By default, the commandline client uses an admin connection.)

* [`can_delete` - Allow online deletion of ledgers up to a specific ledger](#can-delete)
* [`connect` - Force the rippled server to connect to a specific peer](#connect)
* [`consensus_info` - Get information about the state of consensus as it happens](#consensus-info)
* [`feature` - Get information about protocol amendments](#feature)
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
* [`validators` - Get information about the current validators](#validators)
* [`validator_list_sites` - Get information about sites that publish validator lists](#validator-list-sites)
* [`wallet_propose` - Generate keys for a new account](#wallet-propose)

The following admin commands are deprecated and may be removed without further notice:

* `ledger_header` - Use the [`ledger` command](#ledger) instead.
* `unl_add`, `unl_delete`, `unl_list`, `unl_load`, `unl_network`, `unl_reset`, `unl_score` - Use the configuration file for UNL management instead.
* `wallet_seed` - Use [`wallet_propose`](#wallet-propose) instead.


## Commandline Access

You can use the `rippled` application (as a separate instance) as a JSON-RPC client. In this mode, it has syntax for triggering most API methods with a single line from the command prompt, as described in each method. However, some methods or options don't have commandline syntax. For otherwise unsupported syntax, you can use the following method:

* [`json` - Pass JSON through the commandline](#json)

**Note:** The commandline interface is intended for administrative purposes only and is _not a supported API_.


# Account Information
An "Account" in the XRP Ledger represents a holder of XRP and a sender of transactions. Accounts can send and receive XRP and issued assets, participate in the decentralized exchange, and change their own settings. Creating an account involves generating keys and then receiving XRP from another account. For more information, see [Accounts](concept-accounts.html).

{% include 'rippled-api-methods/account_currencies.md' %}

{% include 'rippled-api-methods/account_channels.md' %}

{% include 'rippled-api-methods/account_info.md' %}

{% include 'rippled-api-methods/account_lines.md' %}

{% include 'rippled-api-methods/account_offers.md' %}

{% include 'rippled-api-methods/account_objects.md' %}

{% include 'rippled-api-methods/account_tx.md' %}

{% include 'rippled-api-methods/noripple_check.md' %}

{% include 'rippled-api-methods/gateway_balances.md' %}

{% include 'rippled-api-methods/wallet_propose.md' %}

# Ledger Information

Each `rippled` server keeps a complete copy of the XRP Ledger's current state, which contains all the accounts, transactions, offers, and other data in the network in an optimized tree format. As transactions and offers are proposed, each server incorporates them into its current copy of the ledger, closes it periodically, and (if configured) participates in advancing the globally-validated version. After the network reaches consensus, that ledger version is validated and becomes permanently immutable. Any transactions that were not included in one ledger version become candidates to be included in the next validated version.

{% include 'rippled-api-methods/ledger.md' %}

{% include 'rippled-api-methods/ledger_closed.md' %}

{% include 'rippled-api-methods/ledger_current.md' %}

{% include 'rippled-api-methods/ledger_data.md' %}

{% include 'rippled-api-methods/ledger_entry.md' %}

{% include 'rippled-api-methods/ledger_request.md' %}

{% include 'rippled-api-methods/ledger_accept.md' %}

# Transactions

Transactions are the only thing that can modify the shared state of the XRP Ledger. All business on the XRP Ledger takes the form of transactions, which include not only payments, but also currency-exchange offers, account settings, and changes to the properties of the ledger itself (like adopting new features).

There are several sources of complication in transactions. Unlike traditional banking, where a trusted third party (the bank, or the [ACH](http://en.wikipedia.org/wiki/Automated_Clearing_House)) verifies the participants' identities and ensures their balances are adjusted accurately, Ripple uses cryptography and decentralized computing power to do the same thing. Sending XRP requires no third party aside from the distributed network itself. However, the XRP Ledger also supports issuing balances in any currency and trading them in a decentralized exchange. This brings far more power, but it also means that the system must account for [counterparty risk](http://en.wikipedia.org/wiki/Counterparty_risk#Counterparty_risk), currency conversions, and other issues. The XRP Ledger must be robust to keep track of which transactions have been completely validated, even when subject to hardware failures, attacks, or natural disasters.

{% include 'rippled-api-methods/tx.md' %}

{% include 'rippled-api-methods/transaction_entry.md' %}

{% include 'rippled-api-methods/tx_history.md' %}

{% include 'rippled-api-methods/path_find.md' %}

{% include 'rippled-api-methods/ripple_path_find.md' %}

{% include 'rippled-api-methods/sign.md' %}

{% include 'rippled-api-methods/sign_for.md' %}

{% include 'rippled-api-methods/submit.md' %}

{% include 'rippled-api-methods/submit_multisigned.md' %}

{% include 'rippled-api-methods/book_offers.md' %}

{% include 'rippled-api-methods/channel_authorize.md' %}

{% include 'rippled-api-methods/channel_verify.md' %}

# Subscriptions

Using subscriptions, you can have the server push updates to your client when various events happen, so that you can know and react right away. Subscriptions are only supported in the WebSocket API, where you can receive additional responses in the same channel.

JSON-RPC support for subscription callbacks is deprecated and may not work as expected.

{% include 'rippled-api-methods/subscribe.md' %}

{% include 'rippled-api-methods/unsubscribe.md' %}

# Server Information

There are also commands that retrieve information about the current state of the server. These may be useful for monitoring the health of the server, or in preparing for making other API methods. For example, you may query for the current fee schedule before sending a transaction, or you may check which ledger versions are available before digging into the ledger history for a specific record.

{% include 'rippled-api-methods/server_info.md' %}

{% include 'rippled-api-methods/server_state.md' %}

{% include 'rippled-api-methods/can_delete.md' %}

{% include 'rippled-api-methods/consensus_info.md' %}

{% include 'rippled-api-methods/fetch_info.md' %}

{% include 'rippled-api-methods/feature.md' %}

{% include 'rippled-api-methods/fee.md' %}

{% include 'rippled-api-methods/get_counts.md' %}

{% include 'rippled-api-methods/ledger_cleaner.md' %}

{% include 'rippled-api-methods/log_level.md' %}

{% include 'rippled-api-methods/logrotate.md' %}

{% include 'rippled-api-methods/validation_create.md' %}

{% include 'rippled-api-methods/validation_seed.md' %}

{% include 'rippled-api-methods/validators.md' %}

{% include 'rippled-api-methods/validator_list_sites.md' %}

{% include 'rippled-api-methods/peers.md' %}

{% include 'rippled-api-methods/print.md' %}


# Convenience Functions

The `rippled` server also provides a few commands purely for convenience.

{% include 'rippled-api-methods/ping.md' %}

{% include 'rippled-api-methods/random.md' %}

{% include 'rippled-api-methods/json.md' %}

{% include 'rippled-api-methods/connect.md' %}

{% include 'rippled-api-methods/stop.md' %}

# Peer Protocol

Servers in the XRP Ledger communicate to each other using the XRP Ledger peer protocol, also known as RTXP. Peer servers connect via HTTPS and then do an [HTTP upgrade](https://tools.ietf.org/html/rfc7230#section-6.7) to switch to RTXP. (For more information, see the [Overlay Network](https://github.com/ripple/rippled/blob/906ef761bab95f80b0a7e0cab3b4c594b226cf57/src/ripple/overlay/README.md#handshake) article in the [`rippled` repository](https://github.com/ripple/rippled).)

## Configuring the Peer Protocol

To participate in the XRP Ledger, `rippled` servers connects to arbitrary peers using the peer protocol. (All such peers are treated as untrusted, unless they are [clustered](tutorial-rippled-setup.html#clustering) with the current server.)

Ideally, the server should be able to send _and_ receive connections on the peer port. You should forward the port used for the peer protocol through your firewall to the `rippled` server. The [default `rippled` configuration file](https://github.com/ripple/rippled/blob/release/doc/rippled-example.cfg) listens for incoming peer protocol connections on port 51235 on all network interfaces. You can change the port used by editing the appropriate stanza in your `rippled.cfg` file.

Example:

```
[port_peer]
port = 51235
ip = 0.0.0.0
protocol = peer
```

## Peer Crawler

The Peer Crawler asks a `rippled` server to report information about the other `rippled` servers it is connected to as peers. The [`peers` command](#peers) in the [WebSocket and JSON-RPC APIs](#websocket-and-json-rpc-apis) also returns a similar, more comprehensive set of information, but requires [administrative access](#connecting-to-rippled) to the server. The Peer Crawler response is available to other servers on a non-privileged basis through the Peer Protocol (RTXP) port.

#### Request Format

To request the Peer Crawler information, make the following HTTP request:

* **Protocol:** https
* **HTTP Method:** GET
* **Host:** (any `rippled` server, by hostname or IP address)
* **Port:** (port number where the `rippled` server uses the Peer Protocol, typically 51235)
* **Path:** `/crawl`
* **Notes:** Most `rippled` servers use a self-signed certificate to respond to the request. By default, most tools (including web browsers) flag or block such responses for being untrusted. You must ignore the certificate checking (for example, if using cURL, add the `--insecure` flag) to display a response from those servers.

#### Response Format

The response has the status code **200 OK** and a JSON object in the message body.

The JSON object has the following fields:

| `Field`          | Value | Description                                       |
|:-----------------|:------|:--------------------------------------------------|
| `overlay.active` | Array | Array of Peer Objects, where each member is a peer that is connected to this server. |

Each member of the `active` array is a Peer Object with the following fields:

| `Field`      | Value                    | Description                        |
|:-------------|:-------------------------|:-----------------------------------|
| `ip`         | String (IPv4 Address)    | The IP address of this connected peer. |
| `port`       | String (Number)          | The port number on the peer server that serves RTXP. Typically 51235. |
| `public_key` | String (Base-64 Encoded) | The public key of the ECDSA key pair used by this peer to sign RTXP messages. (This is the same data as the `pubkey_node` reported in the peer server's [`server_info` command](#server-info).) |
| `type`       | String                   | The value `in` or `out`, indicating whether the TCP connection to the peer is incoming or outgoing. |
| `uptime`     | Number                   | The number of seconds the server has been has been connected to this peer. |
| `version`    | String                   | The `rippled` version number the peer reports to be using. |

#### Example

Request:

<!-- MULTICODE_BLOCK_START -->

*HTTP*

```
GET https://s1.ripple.com:51235/crawl
```

*cURL*

```
curl -k https://s1.ripple.com:51235/crawl
```

<!-- MULTICODE_BLOCK_END -->

Response:

```json
200 OK
{
    "overlay": {
        "active": [{
            "ip": "208.43.252.243",
            "port": "51235",
            "public_key": "A2GayQNaj7qbqLFiCFW2UXtAnEPghP/KWVqix2gUa6dM",
            "type": "out",
            "uptime": 107926,
            "version": "rippled-0.31.0-rc1"
        }, {
            "ip": "184.172.237.226",
            "port": "51235",
            "public_key": "Asv/wKq/dqMWbP2M4eR+QvkuojYMLRXhKhIPnW40bsaF",
            "type": "out",
            "uptime": 247376,
            "version": "rippled-0.31.0-rc1"
        }, {
            "ip": "54.186.73.52",
            "port": "51235",
            "public_key": "AjikFnq0P2XybCyREr2KPiqXqJteqwPwVRVbVK+93+3o",
            "type": "out",
            "uptime": 328776,
            "version": "rippled-0.31.0-rc1"
        }, {
            "ip": "169.53.155.59",
            "port": "51235",
            "public_key": "AyIcVhAhOGnP0vtfCt+HKUrx9B2fDvP/4XUkOtVQ37g/",
            "type": "out",
            "uptime": 328776,
            "version": "rippled-0.31.1"
        }, {
            "ip": "169.53.155.44",
            "port": "51235",
            "public_key": "AuVZszWXgMgM8YuTVhQsGE9OciEeBD8aMVe1mFid3n63",
            "type": "out",
            "uptime": 328776,
            "version": "rippled-0.32.0-b12"
        }, {
            "ip": "184.173.45.39",
            "port": "51235",
            "public_key": "Ao2GbGbp2QYQ2B4S9ckCtON7CsZdXqdK5Yon4x7qmWFm",
            "type": "out",
            "uptime": 63336,
            "version": "rippled-0.31.0-rc1"
        }, {
            "ip": "169.53.155.34",
            "port": "51235",
            "public_key": "A3inNJsIQzO7z7SS7uB9DyvN0wsiS9it/RGY/kNx6KEG",
            "type": "out",
            "uptime": 328776,
            "version": "rippled-0.31.0-rc1"
        }, {
            "ip": "169.53.155.45",
            "port": "51235",
            "public_key": "AglUUjwXTC2kUlK41WjDs2eAVN0SnlMpzYA9lEgB0UGP",
            "type": "out",
            "uptime": 65443,
            "version": "rippled-0.31.0-rc1"
        }, {
            "ip": "99.110.49.91",
            "port": "51301",
            "public_key": "AuQDH0o+4fpl2n+pR5U0Y4FTj0oGr4iEKe0MObPcSYj9",
            "type": "out",
            "uptime": 328776,
            "version": "rippled-0.32.0-b9"
        }, {
            "ip": "169.53.155.36",
            "port": "51235",
            "public_key": "AsR4xub7MLg2Zl5Fwd/n7dTz7mhbBoSyCc/v9bnubrVy",
            "type": "out",
            "uptime": 328776,
            "version": "rippled-0.31.0-rc1"
        }]
    }
}
```

### Concealing Peer Information

You can use the `[peer_private]` stanza of the `rippled` config file to request that peer servers do not report your IP address in the Peer Crawler response. You cannot force peers you do not control to follow this request, if they run custom software. However, you can use this to hide the IP addresses of `rippled` servers you control that _only_ connect to peers you control (using `[ips_fixed]` and a firewall). This can help to protect important [validating servers](tutorial-rippled-setup.html#types-of-rippled-servers).

Example:

```
# Configuration on a private server that only connects through
# a second rippled server at IP address 10.1.10.55
[ips_fixed]
10.1.10.55

[peer_private]
1
```


{% include 'snippets/rippled_versions.md' %}
{% include 'snippets/tx-type-links.md' %}
