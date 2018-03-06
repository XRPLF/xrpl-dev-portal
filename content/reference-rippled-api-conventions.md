# rippled API Conventions

This page describes conventions `rippled` uses in its [API Methods](reference-rippled-intro.html), [Transaction Format](reference-transaction-format.html), and [Ledger Data](reference-ledger-format.html).

## Field Names

All field names are case-sensitive. In responses, fields that are taken directly from ledger objects or transaction instructions start with upper-case letters. Other fields, including ones that are dynamically generated for a response, are lower case.

Field names do not contain `.` characters. Occasionally, this documentation uses `.` to refer to nested fields. For example:

```
{
    "account_data": {
        "Account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
        "Balance": "999999999960"
    }
}
```

In the above data structure, `account_data.Balance` refers to the field whose value is `999999999960`.

## Common Data Types

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


## Universal Errors

All methods can potentially return any of the following values for the `error` code:

* `unknownCmd` - The request does not contain a method name that the `rippled` server recognizes. For the full list of valid method names, see the [List of Public Methods](reference-rippled-api-public.html) and the [List of Admin Methods](reference-rippled-api-admin.html).
* `jsonInvalid` - (WebSocket only) The request is not a proper JSON object.
    * JSON-RPC returns a 400 Bad Request HTTP error in this case instead.
* `missingCommand` - (WebSocket only) The request did not specify a `command` field.
    * JSON-RPC returns a 400 Bad Request HTTP error in this case instead.
* `tooBusy` - The server is under too much load to do this command right now. Generally not returned if you are connected as an admin.
* `noNetwork` - The server is having trouble connecting to the rest of the XRP Ledger peer-to-peer network (and is not running in stand-alone mode).
* `noCurrent` - The server does not know what the current ledger is, due to high load, network problems, validator failures, incorrect configuration, or some other problem.
* `noClosed` - The server does not have a closed ledger, typically because it has not finished starting up.
* `wsTextRequired` - (WebSocket only) The request's [opcode](https://tools.ietf.org/html/rfc6455#section-5.2) is not text.

## Time

The `rippled` server and its APIs represent time as an unsigned integer. This number measures the number of seconds since the "Ripple Epoch" of January 1, 2000 (00:00 UTC). This is like the way the [Unix epoch](http://en.wikipedia.org/wiki/Unix_time) works, except the Ripple Epoch is 946684800 seconds after the Unix Epoch.

Don't convert Ripple Epoch times to UNIX Epoch times in 32-bit variables: this could lead to integer overflows.

### Expiration Times and Ledger Resolution

When closing a ledger version, `rippled` servers round the closing time to a "close time resolution" interval of 10 seconds. If that would round a ledger's close time to the same time as its parent ledger, the child ledger's close time is incremented by 1. This helps achieve consensus on the official closing time of each ledger version, since different servers participating in the XRP Ledger network may have slight differences in their internal clocks.

When evaluating expiration times of various objects, such as [Offers](reference-ledger-format.html#offer), [Escrows](reference-ledger-format.html#escrow), and [Payment Channels](reference-ledger-format.html#paychannel), the XRP Ledger protocol evaluates expiration fields relative to the close time of the most recently closed ledger, not the `rippled` server's own clock. This means that, for example, an Offer can execute in a ledger that closes several seconds after the Offer's stated expiration time.

## Possible Server States

Depending on how the `rippled` server is configured, how long it has been running, and other factors, a server may be participating in the global XRP Ledger peer-to-peer network to different degrees. This is represented as the `server_state` field in the responses to the [`server_info`](reference-rippled-api-public.html#server-info) and [`server_state`](reference-rippled-api-public.html#server-state) commands. The possible responses follow a range of ascending interaction, with each later value superseding the previous one. Their definitions are as follows (in order of increasing priority):

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


<!--{# Common link includes #}-->
{% include 'snippets/rippled_versions.md' %}
{% include 'snippets/tx-type-links.md' %}
{% include 'snippets/rippled-api-links.md' %}
