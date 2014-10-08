# Ripple-REST API #

The Ripple-REST API provides a simplified, easy-to-use interface to the Ripple Network via a RESTful API. This page explains how to use the API to send and receive payments on Ripple.

We recommend Ripple-REST for users just getting started with Ripple, since it provides high-level abstractions and convenient simplifications in the data format. If you prefer to access a `rippled` server directly, you can use [rippled's WebSocket or JSON-RPC APIs](rippled-apis.html) instead, which provide the full power of Ripple at the cost of more complexity.

Installation instructions and source code can be found in the [Ripple-REST repository](https://github.com/ripple/ripple-rest).


## Available API Routes ##

#### Accounts ####

* [Generate Account - `GET /v1/accounts/new`](#generate-account)
* [Get Account Balances - `GET /v1/accounts/{:address}/balances`](#get-account-balances)
* [Get Account Settings - `GET /v1/accounts/{:address}/settings`](#get-account-settings)
* [Update Account Settings - `POST /v1/accounts/{:address}/settings`](#update-account-settings)

#### Payments ####

* [Prepare Payment - `GET /v1/accounts/{:address}/payments/paths`](#prepare-payment)
* [Submit Payment - `POST /v1/payments`](#submit-payment)
* [Confirm Payment - `GET /v1/accounts/{:address}/payments/{:payment}`](#confirm-payment)
* [Get Payment History - `GET /v1/accounts/{:address}/payments`](#get-payment-history)

#### Trustlines ####

* [Get Trustlines - `GET /v1/accounts/{:address}/trustlines`](#reviewing-trustlines)
* [Grant Trustline - `POST /v1/accounts/{:address}/trustlines`](#granting-a-trustline)

#### Notifications ####

* [Check Notifications - `GET /v1/accounts/{:address}/notifications/{:transaction_hash}`](#checking-notifications)

#### Status ####

* [Check Connection - `GET /v1/server/connected`](#check-connection-state)
* [Get Server Status - `GET /v1/server`](#get-server-status)

#### Utilities ####

* [Retrieve Ripple Transaction - `GET /v1/tx`](#retrieve-ripple-transaction)
* [Generate UUID - `GET /v1/uuid`](#create-client-resource-id)



## API Overview ##

### Ripple Concepts ###

Ripple is a system for making financial transactions.  You can use Ripple to send money anywhere in the world, in any currency, instantly and for free.

In the Ripple world, each account is identified by a [Ripple Address](https://ripple.com/wiki/Account).  A Ripple address is a string that uniquely identifies an account, for example: `rNsJKf3kaxvFvR8RrDi9P3LBk2Zp6VL8mp`

A Ripple ___payment___ can be sent using Ripple's native currency, XRP, directly from one account to another.  Payments can also be sent in other currencies, for example US dollars, Euros, Pounds or Bitcoins, though the process is slightly more complicated.

Payments are made between two accounts, by specifying the ___source___ and ___destination___ address for those accounts.  A payment also involves an ___amount___, which includes both the numeric amount and the currency, for example: `100+XRP`.

When you make a payment in a currency other than XRP, you also need to include the Ripple address of the ___issuer___.  The issuer is the gateway or other entity who holds the foreign-currency funds on your behalf.  For foreign-currency payments, the amount will look something like this: `100+USD+rNsJKf3kaxvFvR8RrDi9P3LBk2Zp6VL8mp`.

While the `ripple-rest` API provides a high-level interface for sending and receiving payments, there are other endpoints within the API that you can use to work with generic ripple transactions, and to check the status of the Ripple server.

### Sending Payments ###

Sending a payment involves three steps:

1. You need to generate the payment object by doing using what is called a pathfind(preparing a payment).  If the payment is to be made in a currency other than XRP, the Ripple system will identify the chain of trust, or ___path___, that connects the source and destination accounts; when creating the payment, the `ripple-rest` API will automatically find the set of possible paths for you.

2. You can modify the payment object if necessary, and then ___submit___ it to the API for processing. It is recommended to submit the payment object generated directly to prevent any errors from occuring.

3. Finally, you have to ___confirm___ that the payment has gone through by checking the payment's ___status___. This is because the payment submission is considered an asynchronous process, payments themselves can still fail even after they have been submitted successfully.

Note that when you submit a payment for processing, you have to assign a unique `client resource identifier` to that payment.  This is a string which uniquely identifies the payment, and ensures that you do not accidentally submit the same payment twice.  You can also use the `client_resource_id` to retrieve a payment once it has been submitted.

### Transaction Types ###

The Ripple protocol supports multiple types of transactions other than just payments. Transactions are considered to be any changes to the database made on behalf of a Ripple Address. Transactions are first constructed and then submitted to the network. After transaction processing, meta data is associated with the transaction which itemizes the resulting changes to the ledger.

 * Payment: A Payment transaction is an authorized transfer of balance from one address to another. (This maps to rippled's [Payment transaction type](transactions.html#payment))
 * Trustline: A Trustline transaction is an authorized grant of trust between two addresses. (This maps to rippled's [TrustSet transaction type](transactions.html#payment))
 * Setting: A Setting transaction is an authorized update of account flags under a Ripple Account. (This maps to rippled's [AccountSet transaction type](transactions.html#payment))

## Getting Started ##

### Setup ###

You don't need to do any setup to retrieve information from a public Ripple-REST server. Ripple Labs hosts a public Ripple-REST server here:

`https://api.ripple.com`

However, in order to submit payments or other transactions, you need an activated Ripple account. See the [online support](https://support.ripplelabs.com/hc/en-us/categories/200194196-Set-Up-Activation) for how you can create an account using the [Ripple Trade client](https://rippletrade.com/). 

Make sure you know both the account address and the account secret for your account:

 * The *address* can be found by clicking the *Show Address* button in the __Fund__ tab of Ripple Trade
 * The *secret* is provided when you first create your account. **WARNING: If you submit your secret to a server you do not control, your account can be stolen, along with all the money in it.** We recommend using a test account with very limited funds on the public Ripple-REST server.

If you want to run your own Ripple-REST server, see the [installation instructions](https://github.com/ripple/ripple-rest/#installing-and-running).


As a programmer, you will also need to have a suitable HTTP client that allows you to make secure HTTP (`HTTPS`) GET and POST requests. For testing, there are lots of options, including:

 * The [`curl`](http://curl.haxx.se/) commandline utility
 * The [Poster Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/poster/)
 * The [Postman Chrome extension](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en)
 
You can also use the [REST API Tool](rest-api-tool.html) here on the Dev Portal to try out the API.

[Try it! >](rest-api-tool.html)


### Exploring the API ###

A REST API makes resources available via HTTP, the same protocol used by your browser to access the web. This means you can even use your browser to get a response from the API. Try visiting the following URL:

https://api.ripple.com/v1/server

The response should be a page with content similar to the following:

```js
{
  "rippled_server_url": "wss://s-west.ripple.com:443",
  "rippled_server_status": {
    "build_version": "0.23.0",
    "complete_ledgers": "5526705-6142138",
    "fetch_pack": 2004,
    "hostid": "NEAT",
    "last_close": {
      "converge_time_s": 2.005,
      "proposers": 5
    },
    "load_factor": 1,
    "peers": 55,
    "pubkey_node": "n9KmrBnGoyVf89WYdiAnvGnKFaVqjLdAYjKrBuvg2r8pMxGPp6MF",
    "server_state": "full",
    "validated_ledger": {
      "age": 1,
      "base_fee_xrp": 0.00001,
      "hash": "BADDAB671EF21E8ED56B21253123D2C74139FE34E12DBE4B1F5527772EC88494",
      "reserve_base_xrp": 20,
      "reserve_inc_xrp": 5,
      "seq": 6142138
    },
    "validation_quorum": 3
  },
  "success": true,
  "api_documentation_url": "https://github.com/ripple/ripple-rest"
}
```

If you want to connect to your own server, just replace the hostname and port with the location of your instance. For example, if you are running Ripple-REST locally on port 5990, you can access the same information at the following URL:

http://localhost:5990/v1/server

Since the hostname depends on where your chosen Ripple-REST instance is, the methods in this document are identified using only the part of the path that comes after the hostname.



# Formatting Conventions #

The `ripple-rest` API conforms to the following general behavior for [RESTful API](http://en.wikipedia.org/wiki/Representational_state_transfer):

* You make HTTP (or HTTPS) requests to the API endpoint, indicating the desired resources within the URL itself. (The public server, for the sake of security, only accepts HTTPS requests.)
* The HTTP method identifies what you are trying to do.  Generally, HTTP `GET` requests are used to retrieve information, while HTTP `POST` requests are used to make changes or submit information.
* If more complicated information needs to be sent, it will be included as JSON-formatted data within the body of the HTTP POST request.
  * This means that you must set `Content-Type: application/json` in the headers when sending POST requests with a body.
* Upon successful completion, the server returns an [HTTP status code](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html) of 200 OK, and a `Content-Type` value of `application/json`.  The body of the response will be a JSON-formatted object containing the information returned by the endpoint.

As an additional convention, all responses from Ripple-REST contain a `"success"` field with a boolean value indicating whether or not the success 

## Errors ##

When errors occur, the server returns an HTTP status code in the 400-599 range, depending on the type of error. The body of the response contains more detailed information on the cause of the problem.

In general, the HTTP status code is indicative of where the problem occurred:

* Codes in the 200-299 range indicate success. (*Note:* This behavior is new in [Ripple-REST v1.3.0](https://github.com/ripple/ripple-rest/releases/tag/v1.3.0-rc4). Previous versions sometimes return 200 OK for some types of errors.)
    * Unless otherwise specified, methods are expected to return `200 OK` on success.
* Codes in the 400-499 range indicate that the request was invalid or incorrect somehow. For example:
    * `400 Bad Request` occurs if the JSON body is malformed. This includes syntax errors as well as when invalid or mutually-exclusive options are selected.
    * `404 Not Found` occurs if the path specified does not exist, or does not support that method (for example, trying to POST to a URL that only serves GET requests)
* Codes in the 500-599 range indicate that the server experienced a problem. This could be due to a network outage or a bug in the software somewhere. For example:
    * `500 Internal Server Error` occurs when the server does not catch an error. This is always a bug. If you can reproduce the error, file it at [our bug tracker](https://ripplelabs.atlassian.net/browse/RA/).
    * `502 Bad Gateway` occurs if Ripple-REST could not contact its `rippled` server at all.
    * `504 Gateway Timeout` occurs if the `rippled` server took too long to respond to the Ripple-REST server.

When possible, the server provides a JSON response body with more information about the error. These responses contain the following fields:

| Field | Type | Description |
|-------|------|-------------|
| success | Boolean | `false` indicates that an error occurred. |
| error_type | String | A short code identifying a general category for the error that occurred. |
| error | String | A human-readable summary of the error that occurred. |
| message | String | (May be omitted) A longer human-readable explanation for the error. |

Example error:

```js
{
    "success": false,
    "error_type": "invalid_request",
    "error": "Invalid parameter: destination_amount",
    "message": "Non-XRP payment must have an issuer"
}
```


## Quoted Numbers ##

In any case where a large number should be specified, Ripple-REST uses a string instead of the native JSON number type. This avoids problems with JSON libraries which might automatically convert numbers into native types with differing range and precision.

You should parse these numbers into a numeric data type with adequate precision. If it is not clear how much precision you need, we recommend using an arbitrary-precision data type.

## <a id="amount_object"></a> Currency Amounts ##

All currencies on the Ripple Network have issuers, except for XRP. In the case of XRP, the `issuer` field may be omitted or set to `""`. Otherwise, the `issuer` must be a valid Ripple address of the gateway that issues the currency.

For more information about XRP see [the Ripple wiki page on XRP](https://ripple.com/wiki/XRP). For more information about using currencies other than XRP on the Ripple Network see [the Ripple wiki page for gateways](https://ripple.com/wiki/Ripple_for_Gateways).

### Amounts in JSON ###

When an amount of currency (or other asset) is specified as part of a JSON body, it is encoded as an object with three fields:

| Field | Type | Description |
|-------|------|-------------|
| value | String (Quoted decimal) | The quantity of the currency |
| currency | String | Three-digit [ISO 4217 Currency Code](http://www.xe.com/iso4217.php) specifying which currency |
| issuer | String | The Ripple address of the account issuing the currency. This is usually an [issuing gateway](https://wiki.ripple.com/Gateway_List). Always an empty string for XRP. |

Example Amount Object:

```js
{
  "value": "1.0",
  "currency": "USD",
  "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
}
```

or for XRP:

```js
{
  "value": "1.0",
  "currency": "XRP",
  "issuer": ""
}
```

The `value` field can get very large or very small. See the [Currency Format](https://wiki.ripple.com/Currency_Format) for the exact limits of Ripple's precision.

### Amounts in URLs ###

When an amount of currency has to be specified in a URL, you use the same fields as the JSON object -- value, currency, and issuer -- but concatenate them with `+` symbols. 

Example Amount:

`1.0+USD+rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q`

When specifying an amount of XRP, omit the issuer entirely. For example:

`1.0+XRP`

## <a id="payment_object"></a> Payment Objects ##

The `Payment` object is a simplified version of the standard Ripple transaction format.

This `Payment` format is intended to be straightforward to create and parse, from strongly or loosely typed programming languages. Once a transaction is processed and validated it also includes information about the final details of the payment.

An example Payment object looks like this:

```js
{

    "source_address": "rKXCummUHnenhYudNb9UoJ4mGBR75vFcgz",
    "source_tag": "",
    "source_amount": {
        "value": "0.001",
        "currency": "XRP",
        "issuer": ""
    },
    "source_slippage": "0",
    "destination_address": "rNw4ozCG514KEjPs5cDrqEcdsi31Jtfm5r",
    "destination_tag": "",
    "destination_amount": {
        "value": "0.001",
        "currency": "XRP",
        "issuer": ""
    },
    "invoice_id": "",
    "paths": "[]",
    "flag_no_direct_ripple": false,
    "flag_partial_payment": false
}
```

The fields of a Payment object are defined as follows:

| Field | Type | Description |
|-------|------|-------------|
| `source_account` | String | The Ripple address of the account sending the payment |
| `source_amount` | [Amount Object](#amount_object) | The amount to deduct from the account sending the payment. |
| `destination_account` | String | The Ripple address of the account receiving the payment |
| `destination_amount` | [Amount Object](#amount_object) | The amount that should be deposited into the account receiving the payment. |
| `source_tag` | String (Quoted unsigned integer) | (Optional) A quoted 32-bit unsigned integer (0-4294967294, inclusive) to indicate a sub-category of the source account. Typically, it identifies a hosted wallet at a gateway as the sender of the payment. |
| `destination_tag` | String (Quoted unsigned integer) | (Optional) A quoted 32-bit unsigned integer (0-4294967294, inclusive) to indicate a particular sub-category of the destination account. Typically, it identifies a hosted wallet at a gateway as the recipient of the payment. |
| `source_slippage` | String (Quoted decimal) | (Optional) Provides the `source_amount` a cushion to increase its chance of being processed successfully. This is helpful if the payment path changes slightly between the time when a payment options quote is given and when the payment is submitted. The `source_address` will never be charged more than `source_slippage` + the `value` specified in `source_amount`. |
| `invoice_id` | String | (Optional) Arbitrary 256-bit hash that can be used to link payments to an invoice or bill. |
| `paths` | String | A "stringified" version of the Ripple PathSet structure. You can get a path for your payment from the [Prepare Payment](#prepare-payment) method. |
| `no_direct_ripple` | Boolean  | (Optional, defaults to false) `true` if `paths` are specified and the sender would like the Ripple Network to disregard any direct paths from the `source_address` to the `destination_address`. This may be used to take advantage of an arbitrage opportunity or by gateways wishing to issue balances from a hot wallet to a user who has mistakenly set a trustline directly to the hot wallet. Most users will not need to use this option. |
| `partial_payment` | Boolean | (Optional, defaults to false) If set to `true`, fees will be deducted from the delivered amount instead of the sent amount. (*Caution:* There is no minimum amount that will actually arrive as a result of using this flag; only a miniscule amount may actually be received.) See [Partial Payments](transactions.html#partial-payments) |
| `memos` | Array | (Optional) Array of [memo objects](#memo-objects), where each object is an arbitrary note to send with this payment. |

Submitted transactions can have additional fields reflecting the current status and outcome of the transaction, including:

[[Source]<br>](https://github.com/ripple/ripple-rest/blob/master/api/payments.js#L346 "Source")

| Field | Type | Description |
|-------|------|-------------|
| direction | String | The direction of the payment relative to the account from the URL, either `"outgoing"` (sent by the account in the URL) or `"incoming"` (received by the account in the URL) |
| state | String | The current status of the payment in transaction processing. A value of `"validated"` indicates that the transaction is finalized. |
| result | String | The [Ripple transaction status code](https://wiki.ripple.com/Transaction_errors) for the transaction. A value of `"tesSUCCESS"` indicates a successful transaction. |
| ledger | String | The sequence number of the ledger version that includes this transaction. |
| hash | String | A hash value that uniquely identifies this transaction in the Ripple network. |
| timestamp | String | The time the ledger containing this transaction was validated, as a [ISO8601 extended format](http://en.wikipedia.org/wiki/ISO_8601) string in the form `YYYY-MM-DDTHH:mm:ss.sssZ`. |
| fee | String (Quoted decimal) | The amount of XRP charged as a transaction fee. |
| source_balance_changes | Array | Array of [Amount objects](#amount_object) indicating changes in balances held by the account sending the transaction as a result of the transaction. |
| destination_balance_changes | Array | Array of [Amount objects](#amount_object) indicating changes in balances held by the account receiving the transaction as a result of the transaction. |


### Memo Objects ###

(New in [Ripple-REST v1.3.0](https://github.com/ripple/ripple-rest/releases/tag/v1.3.0-rc4))

Memo objects represent arbitrary data that can be included in a transaction. The overall size of the `memos` field cannot exceed 1KB after serialization.

Each Memo object must have at least one of the following fields:

| Field | Type | Description |
|-------|------|-------------|
| MemoType | String | Arbitrary string, conventionally a unique relation type (according to [RFC 5988](http://tools.ietf.org/html/rfc5988#section-4)) that defines the format of this memo. |
| MemoData | String | Arbitrary value representing the content of the memo. |

The MemoType field is intended to support URIs, so the contents of that field should only contain characters that are valid in URIs. In other words, MemoType should only consist of the following characters: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=%`

Example of the memos field:

```js
    "memos": [
      {
        "MemoType": "unformatted_memo",
        "MemoData": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      },
      {
        "MemoData": "Fusce est est, malesuada in tincidunt mattis, auctor eu magna."
      }
    ]
```


# ACCOUNTS #

Accounts are the core unit of authentication in the Ripple Network. Each account can hold balances in multiple currencies, and all transactions must be signed by an account’s secret key. In order for an account to exist in a validated ledger version, it must hold a minimum reserve amount of XRP. (The [account reserve](https://wiki.ripple.com/Reserves) increases with the amount of data it is responsible for in the shared ledger.) It is expected that accounts will correspond loosely to individual users. 



## Generate Account ##

(New in [Ripple-REST v1.3.0](https://github.com/ripple/ripple-rest/releases/tag/v1.3.0-rc4))

Randomly generate keys for a potential new Ripple account.

<div class='multicode'>
*REST*

```
GET /v1/accounts/new
```
</div>

[Try it! >](rest-api-tool.html#generate-account)

There are two steps to making a new account on the Ripple network: randomly creating the keys for that account, and sending it enough XRP to meet the account reserve.

Generating the keys can be done offline, since it does not affect the network at all. To make it easy, Ripple-REST can generate account keys for you.

*Caution:* Ripple account keys are very sensitive, since they give full control over that account's money on the Ripple network. Do not transmit them to untrusted servers, or unencrypted over the internet (for example, through HTTP instead of HTTPS). There *are* bad actors who are sniffing around for account keys so they can steal your money!

#### Response ####

The response is an object with the address and the secret for a potential new account:

```js
{
    "success": true,
    "account": {
        "address": "raqFu9wswvHYS4q5hZqZxVSYei73DQnKL8",
        "secret": "shUzHiYxoXX2FgA54j42cXCZ9dTVT"
    }
}
```

The second step is [making a payment](#making-payments) of XRP to the new account address. (Ripple lets you send XRP to any mathematically possible account address, which creates the account if necessary.) The generated account does not exist in the ledger until it receives enough XRP to meet the account reserve.



## Get Account Balances ##
[[Source]<br>](https://github.com/ripple/ripple-rest/blob/master/api/balances.js#L9 "Source")

Retrieve the current balances for the given Ripple account.

<div class='multicode'>
*REST*

```
GET /v1/accounts/{:address}/balances
```
</div>

[Try it! >](rest-api-tool.html#get-account-balances)

The following URL parameters are required by this API endpoint:

| Field | Type | Description |
|-------|------|-------------|
| address | String | The Ripple account address of the account whose balances to retrieve. |

Optionally, you can also include the following query parameters:

| Field | Type | Description |
|-------|------|-------------|
| currency | String ([ISO 4217 Currency Code](http://www.xe.com/iso4217.php)) | If provided, only include balances in the given currency. |
| counterparty | String (Address) | If provided, only include balances issued by the provided address (usually a gateway) |

#### Response ####

```js
{
  "success": true,
  "balances": [
    {
      "currency": "XRP",
      "amount": "1046.29877312",
      "issuer": ""
    },
    {
      "currency": "USD",
      "amount": "512.79",
      "issuer": "r...",
    }
    ...
  ]
}
```

There will be one entry in the `balances` array for the account's XRP balance, and additional entries for each combination of currency code and issuer.



## Get Account Settings ##
[[Source]<br>](https://github.com/ripple/ripple-rest/blob/master/api/settings.js#L53 "Source")

Retrieve the current settings for a given account.

<div class='multicode'>
*REST*

```
GET /v1/accounts/{:address}/settings
```
</div>

[Try it! >](rest-api-tool.html#get-account-settings)

The following URL parameters are required by this API endpoint:

| Field | Value | Description |
|-------|-------|-------------|
| address | String | The Ripple account address of the account whose settings to retrieve. |

#### Response ####

```js
{
  "success": true,
  "settings": {
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "transfer_rate": "",
    "password_spent": false,
    "require_destination_tag": false,
    "require_authorization": false,
    "disallow_xrp": false,
    "disable_master": false,
    "transaction_sequence": "36",
    "email_hash": "",
    "wallet_locator": "",
    "wallet_size": "",
    "message_key": "0000000000000000000000070000000300",
    "domain": "mduo13.com",
    "signers": ""
  }
}
```

The response contains a `settings` object, with the following fields:

| Field | Value | Description |
|-------|-------|-------------|
| account | String | The Ripple address of this account |
| transfer_rate | String (Quoted decimal number) | If set, imposes a fee for transferring balances issued by this account. Must be between 1 and 2, with up to 9 decimal places of precision. |
| password_spent | Boolean | If false, then this account can submit a special [SetRegularKey transaction](transactions.html#setregularkey) without a transaction fee. |
| require\_destination\_tag | Boolean | If true, require a destination tag to send payments to this account. (This is intended to protect users from accidentally omitting the destination tag in a payment to a gateway's hosted wallet.) |
| require_authorization | Boolean | If true, require authorization for users to hold balances issued by this account. (This prevents users unknown to a gateway from holding funds issued by that gateway.) |
| disallow_xrp | Boolean | If true, XRP should not be sent to this account. (Enforced in clients but not in the server, because it could cause accounts to become unusable if all their XRP were spent.) |
| disable_master | Boolean | If true, the master secret key cannot be used to sign transactions for this account. Can only be set to true if a Regular Key is defined for the account. |
| transaction_sequence | String (Quoted integer) | The sequence number of the next valid transaction for this account. (Each account starts with Sequence = 1 and increases each time a transaction is made.) |
| email_hash | String | Hash of an email address to be used for generating an avatar image. Conventionally, clients use [Gravatar](http://en.gravatar.com/site/implement/hash/) to display this image. |
| wallet_locator | String | (Not used) |
| wallet_size | String | (Not used) |
| message_key | A [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) public key that should be used to encrypt secret messages to this account. |
| domain | String | The domain that holds this account. Clients can use this to verify the account in the [ripple.txt](https://wiki.ripple.com/Ripple.txt) or [host-meta](https://wiki.ripple.com/Gateway_Services) of the domain. |



## Update Account Settings ##
[[Source]<br>](https://github.com/ripple/ripple-rest/blob/master/api/settings.js#L97 "Source")

Modify the existing settings for an account.

<div class='multicode'>
*REST*

```
POST /v1/accounts/{:address}/settings

{
  "secret": "sssssssssssssssssssssssssssss",
  "settings": {
    "transfer_rate": 1.02,
    "require_destination_tag": false,
    "require_authorization": false,
    "disallow_xrp": false,
    "disable_master": false,
    "transaction_sequence": 22
  }
}
```
</div>

[Try it! >](rest-api-tool.html#update-account-settings)

The following URL parameters are required by this API endpoint:

| Field | Value | Description |
|-------|-------|-------------|
| address | String | The Ripple account address of the account whose settings to retrieve. |

The request body must be a JSON object with the following fields:

| Field | Value | Description |
|-------|-------|-------------|
| secret | String | A secret key for your Ripple account. This is either the master secret, or a regular secret, if your account has one configured. |
| settings | Object | A map of settings to change for this account. Any settings not included are left unchanged. |

The `settings` object can contain any of the following fields (any omitted fields are left unchanged):

| Field | Value | Description |
|-------|-------|-------------|
| transfer_rate | String (Quoted decimal number) | If set, imposes a fee for transferring balances issued by this account. Must be between 1 and 2, with up to 9 decimal places of precision. |
| require\_destination\_tag | Boolean | If true, require a destination tag to send payments to this account. (This is intended to protect users from accidentally omitting the destination tag in a payment to a gateway's hosted wallet.) |
| require_authorization | Boolean | If true, require authorization for users to hold balances issued by this account. (This prevents users unknown to a gateway from holding funds issued by that gateway.) |
| disallow_xrp | Boolean | If true, XRP should not be sent to this account. (Enforced in clients but not in the server, because it could cause accounts to become unusable if all their XRP were spent.) |
| disable_master | Boolean | If true, the master secret key cannot be used to sign transactions for this account. Can only be set to true if a Regular Key is defined for the account. |
| transaction_sequence | String (Quoted integer) | The sequence number of the next valid transaction for this account.  |
| email_hash | String | Hash of an email address to be used for generating an avatar image. Conventionally, clients use [Gravatar](http://en.gravatar.com/site/implement/hash/) to display this image. |
| message_key | String | A [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) public key that should be used to encrypt secret messages to this account, as hex. |
| domain | String | The domain that holds this account, as lowercase ASCII. Clients can use this to verify the account in the [ripple.txt](https://wiki.ripple.com/Ripple.txt) or [host-meta](https://wiki.ripple.com/Gateway_Services) of the domain. |


#### Response ####

```js
{
  "success": true,
  "hash": "81FA244915767DAF65B0ACF262C88ABC60E9437A4A1B728F7A9F932E727B82C6",
  "ledger": "9248628",
  "settings": {
    "require_destination_tag": false,
    "require_authorization": false,
    "disallow_xrp": false,
    "email_hash": "98b4375e1d753e5b91627516f6d70977"
  }
}
```

The response is a JSON object containing the following fields:

| Field | Value | Description |
|-------|-------|-------------|
| hash | String | A unique hash that identifies the Ripple transaction to change settings |
| ledger | String (Quoted integer) | The sequence number of the ledger version where the settings-change transaction was applied. |
| settings | Object | The settings that were changed, as provided in the request. |




# PAYMENTS #

`ripple-rest` provides access to `ripple-lib`'s robust transaction submission processes. This means that it will set the fee, manage the transaction sequence numbers, sign the transaction with your secret, and resubmit the transaction up to 10 times if `rippled` reports an initial error that can be solved automatically.



## Prepare Payment ##
[[Source]<br>](https://github.com/ripple/ripple-rest/blob/master/api/payments.js#L538 "Source")

Get quotes for possible ways to make a particular payment.

<div class='multicode'>
*REST*

```
GET /v1/accounts/{:address}/payments/paths/{:destination_account}/{:destination_amount}
```
</div>

[Try it! >](rest-api-tool.html#prepare-payment)

The following URL parameters are required by this API endpoint:

| Field | Type | Description |
|-------|------|-------------|
| `address` | String | The Ripple address for the account that would send the payment. |
| `destination_account` | String | The Ripple address for the account that would receive the payment. |
| `destination_amount` | String ([URL-formatted Amount](#amounts-in-urls) | The amount that the destination account should receive. |

Optionally, you can also include the following as a query parameter:

| Field | Type | Description |
|-------|------|-------------|
| `source_currencies` | Comma-separated list of source currencies. Each should be an [ISO 4217 currency code](http://www.xe.com/iso4217.php), or a `{:currency}+{:issuer}` string. | Filters possible payments to include only ones that spend the source account's balances in the specified currencies. If an issuer is not specified, include all issuances of that currency held by the sending account. |

Before you make a payment, it is necessary to figure out the possible ways in which that payment can be made. This method gets a list possible ways to make a payment, but it does not affect the network. This method effectively performs a [ripple_path_find](rippled-apis.html#ripple-path-find) and constructs payment objects for the paths it finds.

You can then choose one of the returned payment objects, modify it as desired (for example, to set slippage values or tags), and then submit the payment for processing.

#### Response ####

```js
{
  "success": true,
  "payments": [
    { /* Payment */ },
    { /* Payment */ },
    ...
  ]
}
```

You can then select the desired payment, modify it if necessary, and submit the payment object to the [`POST /v1/payments`](#submit-payment) endpoint for processing.

__NOTE:__ This command may be quite slow. If the command times out, please try it again.



## Submit Payment ##
[[Source]<br>](https://github.com/ripple/ripple-rest/blob/master/api/payments.js#L43 "Source")

Submit a payment object to be processed and executed. 

<div class='multicode'>
*REST*

```
POST /v1/payments

{
  "secret": "s...",
  "client_resource_id": "123",
  "payment": {
    "source_account": "rBEXjfD3MuXKATePRwrk4AqgqzuD9JjQqv",
    "source_tag": "",
    "source_amount": {
      "value": "5.01",
      "currency": "USD",
      "issuer": ""
    },
    "source_slippage": "0",
    "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "destination_tag": "",
    "destination_amount": {
      "value": "5",
      "currency": "USD",
      "issuer": ""
    },
    "invoice_id": "",
    "paths": "[[{\"account\":\"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B\",\"type\":1,\"type_hex\":\"0000000000000001\"}]]",
    "partial_payment": false,
    "no_direct_ripple": false
  }
}
```
</div>

[Try it! >](rest-api-tool.html#submit-payment)

The following URL parameters are required by this API endpoint:

| Field | Type | Description |
|-------|------|-------------|
| payment | [Payment object](#payment_object) | The payment to send. You can generate a payment object using the [Prepare Payment](#prepare-payment) method. |
| client_resource_id | String | A unique identifier for this payment. You can generate one using the [`GET /v1/uuid`](#calculating_a_uuid) method. |
| secret | String | A secret key for your Ripple account. This is either the master secret, or a regular secret, if your account has one configured. |

__DO NOT SUBMIT YOUR SECRET TO AN UNTRUSTED REST API SERVER__ -- The secret key can be used to send transactions from your account, including spending all the balances it holds. For the public server, only use test accounts.

#### Response ####

```js
{
  "success": true,
  "client_resource_id": "123",
  "status_url": ".../v1/accounts/r1.../payments/123"
}
```

| Field | Type | Description |
|-------|------|-------------|
| client_resource_id | String | The client resource ID provided in the request |
| status_url | String | A URL that you can GET to check the status of the request. This refers to the [Confirm Payment](#confirm-payment) method. |



## Confirm Payment ##
[[Source]<br>](https://github.com/ripple/ripple-rest/blob/master/api/payments.js#L232 "Source")

Retrieve the details of a payment, including the current state of the transaction and the result of transaction processing.

<div class='multicode'>
*REST*

```
GET /v1/accounts/{:address}/payments/{:id}
```
</div>

[Try it! >](rest-api-tool.html#confirm-payment)

The following URL parameters are required by this API endpoint:

| Field | Type | Description |
|-------|------|-------------|
| address | String | The Ripple account address of an account involved in the transaction. |
| id | String | A unique identifier for the transaction: either a client resource ID or a transaction hash. |

#### Response ####

```js
{
  "success": true,
  "payment": {
    "source_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "source_tag": "",
    "source_amount": {
      "value": "0.00001",
      "currency": "XRP",
      "issuer": ""
    },
    "source_slippage": "0",
    "destination_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "destination_tag": "",
    "destination_amount": {
      "currency": "USD",
      "issuer": "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc",
      "value": "0.01"
    },
    "invoice_id": "",
    "paths": "[]",
    "no_direct_ripple": false,
    "partial_payment": true,
    "direction": "outgoing",
    "state": "validated",
    "result": "tesSUCCESS",
    "ledger": "8924146",
    "hash": "9D591B18EDDD34F0B6CF4223A2940AEA2C3CC778925BABF289E0011CD8FA056E",
    "timestamp": "2014-09-17T21:47:00.000Z",
    "fee": "0.00001",
    "source_balance_changes": [
      {
        "value": "-0.00002",
        "currency": "XRP",
        "issuer": ""
      }
    ],
    "destination_balance_changes": [
      {
        "value": "5.08e-8",
        "currency": "USD",
        "issuer": "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc"
      }
    ]
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| payment | Object | A [payment object](#payment-object) for the transaction. |

If the `payment.state` field has the value `"validated"`, then the payment has been finalized, and is included in the shared global ledger. However, this does not necessarily mean that it succeeded. Check the `payment.result` field for a value of `"tesSUCCESS"` to see if the payment was successfully executed. If the `payment.partial_payment` flag is *true*, then you should also consult the `payment.destination_balance_changes` array to see how much currency was actually delivered to the destination account.

Processing a payment can take several seconds to complete, depending on the [consensus process](consensus-whitepaper.html). If the payment does not exist yet, or has not been validated, you should wait a few seconds before checking again.



## Get Payment History ##
[[Source]<br>](https://github.com/ripple/ripple-rest/blob/master/api/payments.js#L460 "Source")

Retrieve a selection of payments that affected the specified account. 

<div class='multicode'>
*REST*

```
GET /v1/accounts/{:address}/payments
```
</div>

[Try it! >](rest-api-tool.html#get-payment-history)

The following URL parameters are required by this API endpoint:

| Field | Type | Description |
|-------|------|-------------|
| address | String | The Ripple account address of an account involved in the transaction. |

Optionally, you can also include the following query parameters:

| Field | Type | Description |
|-------|------|-------------|
| source_account | String (Address) | If provided, only include payments sent by a given account. |
| destination_account | String (Address) | If provided, only include payments received by a given account. |
| exclude_failed | Boolean | If true, only include successful transactions. Defaults to false. |
| direction | String | If provided, only include payments of the given type. Valid values include `"incoming"` (payments received by this account) and `"outgoing"` (payments sent by this account). |
| earliest_first | Boolean | If true, sort results with the oldest payments first. Defaults to false (sort with the most recent payments first). |
| start\_ledger | Integer (Ledger sequence number) | If provided, exclude payments from ledger versions older than the given ledger. |
| end\_ledger | Integer (Ledger sequence number) | If provided, exclude payments from ledger versions newer than the given ledger. |
| results\_per\_page | Integer | The maximum number of payments to be returned at once.  Defaults to 10. |
| page | Integer | The page number for the results to return, if more than `results_per_page` are available. The first page of results is page `1`, the second page is number `2`, and so on.  Defaults to `1`. |

#### Response ####

```js
{
  "success": true,
  "payments": [
    {
      "client_resource_id": "",
      "payment": {
        "source_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "source_tag": "",
        "source_amount": {
          "currency": "USD",
          "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
          "value": "1"
        },
        "source_slippage": "0",
        "destination_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "destination_tag": "",
        "destination_amount": {
          "currency": "USD",
          "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
          "value": "1"
        },
        "invoice_id": "",
        "paths": "[]",
        "no_direct_ripple": false,
        "partial_payment": false,
        "direction": "outgoing",
        "state": "validated",
        "result": "tesSUCCESS",
        "ledger": "9018940",
        "hash": "FED24FB85E5682E5FD03D2FFA047E1CE9F284671BCD82007C64B3FE735DD69B0",
        "timestamp": "2014-09-23T19:20:20.000Z",
        "fee": "0.000012",
        "source_balance_changes": [
          {
            "value": "-0.000012",
            "currency": "XRP",
            "issuer": ""
          },
          {
            "value": "-1",
            "currency": "USD",
            "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
          }
        ],
        "destination_balance_changes": [
          {
            "value": "1",
            "currency": "USD",
            "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
          }
        ]
      }
    },
    {
      "client_resource_id": "",
      "payment": {
        "source_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "source_tag": "",
        "source_amount": {
          "currency": "USD",
          "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
          "value": "1"
        },
        "source_slippage": "0",
        "destination_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "destination_tag": "",
        "destination_amount": {
          "currency": "USD",
          "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
          "value": "1"
        },
        "invoice_id": "",
        "paths": "[]",
        "no_direct_ripple": false,
        "partial_payment": false,
        "direction": "outgoing",
        "state": "validated",
        "result": "tesSUCCESS",
        "ledger": "9018905",
        "hash": "63BCCAFA0D6D56B2F914B5933D7FABCD25925450F0675179E836D12DFA530C28",
        "timestamp": "2014-09-23T19:17:30.000Z",
        "fee": "0.000012",
        "source_balance_changes": [
          {
            "value": "-0.000012",
            "currency": "XRP",
            "issuer": ""
          },
          {
            "value": "-1",
            "currency": "USD",
            "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
          }
        ],
        "destination_balance_changes": [
          {
            "value": "1",
            "currency": "USD",
            "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
          }
        ]
      }
    },
    {
      "client_resource_id": "",
      "payment": {
        "source_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "source_tag": "",
        "source_amount": {
          "value": "0.00001",
          "currency": "XRP",
          "issuer": ""
        },
        "source_slippage": "0",
        "destination_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "destination_tag": "",
        "destination_amount": {
          "currency": "USD",
          "issuer": "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc",
          "value": "0.01"
        },
        "invoice_id": "",
        "paths": "[]",
        "no_direct_ripple": false,
        "partial_payment": true,
        "direction": "outgoing",
        "state": "validated",
        "result": "tesSUCCESS",
        "ledger": "8924146",
        "hash": "9D591B18EDDD34F0B6CF4223A2940AEA2C3CC778925BABF289E0011CD8FA056E",
        "timestamp": "2014-09-17T21:47:00.000Z",
        "fee": "0.00001",
        "source_balance_changes": [
          {
            "value": "-0.00002",
            "currency": "XRP",
            "issuer": ""
          }
        ],
        "destination_balance_changes": [
          {
            "value": "5.08e-8",
            "currency": "USD",
            "issuer": "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc"
          }
        ]
      }
    },
    {
      "client_resource_id": "",
      "payment": {
        "source_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "source_tag": "",
        "source_amount": {
          "value": "1",
          "currency": "XRP",
          "issuer": ""
        },
        "source_slippage": "0",
        "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "destination_tag": "",
        "destination_amount": {
          "value": "1",
          "currency": "XRP",
          "issuer": ""
        },
        "invoice_id": "",
        "paths": "[]",
        "no_direct_ripple": false,
        "partial_payment": false,
        "direction": "incoming",
        "state": "validated",
        "result": "tesSUCCESS",
        "ledger": "8889845",
        "hash": "8496C20AEB453803CB80474B59AB1E8FAA26725561EFF5AF41BD588B325AFBA8",
        "timestamp": "2014-09-15T20:01:40.000Z",
        "fee": "0.000012",
        "source_balance_changes": [
          {
            "value": "-1.000012",
            "currency": "XRP",
            "issuer": ""
          }
        ],
        "destination_balance_changes": [
          {
            "value": "1",
            "currency": "XRP",
            "issuer": ""
          }
        ]
      }
    },
    {
      "client_resource_id": "",
      "payment": {
        "source_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "source_tag": "",
        "source_amount": {
          "currency": "USD",
          "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
          "value": "1"
        },
        "source_slippage": "0",
        "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "destination_tag": "",
        "destination_amount": {
          "currency": "USD",
          "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
          "value": "1"
        },
        "invoice_id": "",
        "paths": "[]",
        "no_direct_ripple": false,
        "partial_payment": false,
        "direction": "incoming",
        "state": "validated",
        "result": "tesSUCCESS",
        "ledger": "8889826",
        "hash": "4C9FA63D9F87AFC7E1BBD7F2644A1D4BD7537E833B1A945E27E5EC19F3B4B271",
        "timestamp": "2014-09-15T20:00:10.000Z",
        "fee": "0.000012",
        "source_balance_changes": [
          {
            "value": "-0.000012",
            "currency": "XRP",
            "issuer": ""
          },
          {
            "value": "-1",
            "currency": "USD",
            "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
          }
        ],
        "destination_balance_changes": [
          {
            "value": "1",
            "currency": "USD",
            "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
          }
        ]
      }
    },
    {
      "client_resource_id": "",
      "payment": {
        "source_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "source_tag": "",
        "source_amount": {
          "value": "30",
          "currency": "XRP",
          "issuer": ""
        },
        "source_slippage": "0",
        "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "destination_tag": "",
        "destination_amount": {
          "value": "30",
          "currency": "XRP",
          "issuer": ""
        },
        "invoice_id": "",
        "paths": "[]",
        "no_direct_ripple": false,
        "partial_payment": false,
        "direction": "incoming",
        "state": "validated",
        "result": "tesSUCCESS",
        "ledger": "8889256",
        "hash": "72549F0CB04C8C5F30F64256A4EBDE577B1943382AE44347F05FF70590FF7CCB",
        "timestamp": "2014-09-15T19:14:50.000Z",
        "fee": "0.000012",
        "source_balance_changes": [
          {
            "value": "-30.000012",
            "currency": "XRP",
            "issuer": ""
          }
        ],
        "destination_balance_changes": [
          {
            "value": "30",
            "currency": "XRP",
            "issuer": ""
          }
        ]
      }
    },
    {
      "client_resource_id": "",
      "payment": {
        "source_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "source_tag": "",
        "source_amount": {
          "currency": "USD",
          "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
          "value": "1"
        },
        "source_slippage": "0",
        "destination_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "destination_tag": "",
        "destination_amount": {
          "currency": "USD",
          "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
          "value": "1"
        },
        "invoice_id": "",
        "paths": "[]",
        "no_direct_ripple": false,
        "partial_payment": false,
        "direction": "outgoing",
        "state": "validated",
        "result": "tesSUCCESS",
        "ledger": "8803725",
        "hash": "6A6E503211A32F7AB92FE747A8AD2759A1E597055CB8961F0B2FEDE3A53975AB",
        "timestamp": "2014-09-10T23:22:20.000Z",
        "fee": "0.000015",
        "source_balance_changes": [
          {
            "value": "-0.000015",
            "currency": "XRP",
            "issuer": ""
          },
          {
            "value": "-1",
            "currency": "USD",
            "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
          }
        ],
        "destination_balance_changes": [
          {
            "value": "1",
            "currency": "USD",
            "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
          }
        ]
      }
    },
    {
      "client_resource_id": "",
      "payment": {
        "source_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "source_tag": "",
        "source_amount": {
          "currency": "USD",
          "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
          "value": "1"
        },
        "source_slippage": "0",
        "destination_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "destination_tag": "",
        "destination_amount": {
          "currency": "USD",
          "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
          "value": "1"
        },
        "invoice_id": "",
        "paths": "[]",
        "no_direct_ripple": false,
        "partial_payment": false,
        "direction": "outgoing",
        "state": "validated",
        "result": "tesSUCCESS",
        "ledger": "8711125",
        "hash": "82230B9D489370504B39BC2CE46216176CAC9E752E5C1774A8CBEC9FBB819208",
        "timestamp": "2014-09-05T19:59:50.000Z",
        "fee": "0.00001",
        "source_balance_changes": [
          {
            "value": "-0.00001",
            "currency": "XRP",
            "issuer": ""
          },
          {
            "value": "-1",
            "currency": "USD",
            "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
          }
        ],
        "destination_balance_changes": [
          {
            "value": "1",
            "currency": "USD",
            "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
          }
        ]
      }
    }
  ]
}
```

If the length of the `payments` array is equal to `results_per_page`, then there may be more results. To get them, increment the `page` query paramter and run the request again.

*Note:* It is not more efficient to specify more filter values, because Ripple-REST has to retrieve the full list of payments from the `rippled` before it can filter them.




# TRUSTLINES #

## Reviewing Trustlines ##

__`GET /v1/accounts/{:address}/trustlines`__

[Try it! >](rest-api-tool.html#get-trustlines)

Retrieves all trustlines associated with the Ripple address. Upon completion, the server will return a JSON object which represents each trustline individually along with the currency, limit, and counterparty.

The following query string parameters are supported to provide additional filtering for either trustlines to a particular currency or trustlines from a specific counterparty:

+ `currency` Three letter currency denominations (i.e. USD, BTC).
+ `counterparty` Ripple address of the counterparty trusted.

__`GET /v1/accounts/{:address}/trustlines?currency=USD&counterparty=rPs723Dsd...`__

The object returned looks like this:

```js
{
  "success": true,
  "lines": [
    {
      "account": "rPs7nVbSops6xm4v77wpoPFf549cqjzUy9",
      "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
      "currency": "USD",
      "trust_limit": "100",
      "reciprocated_trust_limit": "0",
      "account_allows_rippling": false,
      "counterparty_allows_rippling": true
    },
    {
      "account": "rPs7nVbSops6xm4v77wpoPFf549cqjzUy9",
      "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs58B",
      "currency": "BTC",
      "trust_limit": "5",
      "reciprocated_trust_limit": "0",
      "account_allows_rippling": false,
      "counterparty_allows_rippling": true
    }
  ]
}
```

## Granting a Trustline ##

__`POST /v1/accounts/{:address}/trustlines`__

A trustline can also updated and simply set with a currency,amount,counterparty combination by submitting to this endpoint with the following JSON object.

```js
{
  "secret": "sneThnzgBgxc3zXPG....",
  "trustline": {
  "limit": "110",
  "currency": "USD",
  "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
  "allows_rippling": false
  }
}
```

[Try it! >](rest-api-tool.html#grant-trustline)


A successful submission will result in a returning JSON object that includes a transaction hash to the trustline transaction.

```js
{
  "success": true,
  "line": {
    "account": "rPs7nVbSops6xm4v77wpoPGf549cqjzUy9",
    "counterparty": "rKB4oSXwPkRpb2sZRhgGyRfaEhhYS6tf4M",
    "currency": "USD",
    "trust_limit": "100",
    "allows_rippling": true
  },
  "ledger": "6146255",
  "hash": "6434F18B3997D81152F1AB31911E8D40E1346A05478419B7B3DF78B270C1151A"
}
```




# NOTIFICATIONS #

Notifications can be used as a looping mechanism to monitor any transactions against your Ripple address or to confirm against missed notifications if your connection to `rippled` goes down. Notifications are generic and can include all types of Ripple transactions which is different than the "Payments" endpoints which specifically retrieve payment transactions. The "Payments" endpoints also provide full payment objects versus the notification objects which described the transaction at a higher level with less detail.

## Checking Notifications ##

__`GET /v1/accounts/{:address}/notifications/{:transaction_hash}`__

[Try it! >](rest-api-tool.html#check-notifications)

This endpoint will grab the notification based on the specific transaction hash specified. Once called the notification object retreived will provide information on the type of transaction and also the previous and next notifications will be shown as well. The `previous_notification_url` and `next_notification_url` can be used to walk up and down the notification queue. Once the `next_notification_url` is empty that means you have the most current notification, this applies for the `previous_notification_url` similarly when it's empty as it means you are holding the earliest notification available on the `rippled` you are connecting to.

A successful retrieval will look like this:

```js
{
  "success": true,
  "notification": {
    "account": "rPs7nVbSops6xm4v77wpoPFf549cqjzUy9",
    "type": "payment",
    "direction": "outgoing",
    "state": "validated",
    "result": "tesSUCCESS",
    "ledger": "5704389",
    "hash": "EA1C8349FFFDB180BF6805FB69B32A41A5C86E27B4F79BED3CD8BA9A1E902721",
    "timestamp": "+046228-05-27T00:20:00.000Z",
    "transaction_url": "/v1/accounts/rPs7nVbSops6xm4v77wpoPFf549cqjzUy9/payments/EA1C8349FFFDB180BF6805FB69B32A41A5C86E27B4F79BED3CD8BA9A1E902721",
    "previous_hash": "1578758880412050B6C9C367DAE090B5452649549F00780276BED51BDEECF63C",
    "previous_notification_url": "/v1/accounts/rPs7nVbSops6xm4v77wpoPFf549cqjzUy9/notifications/1578758880412050B6C9C367DAE090B5452649549F00780276BED51BDEECF63C",
    "next_hash": "441E8AEC90A3674318710B4978E9598BD47190CF51E44CBD11C28FFF75FBC934",
    "next_notification_url": "/v1/accounts/rPs7nVbSops6xm4v77wpoPFf549cqjzUy9/notifications/441E8AEC90A3674318710B4978E9598BD47190CF51E44CBD11C28FFF75FBC934"
  }
}
```

The notification of the most recent transaction will show `next_notification_url` as an empty string.

The earliest notification available on the `rippled` server will show `previous_notification_url` as an empty string.

# RIPPLED SERVER STATUS #

The following two endpoints can be used to check if the `ripple-rest` API is currently connected to a `rippled` server, and to retrieve information about the current status of the API.

## Check Connection State ##

__`GET /v1/server/connected`__

[Try it! >](rest-api-tool.html#check-connection)

Checks to see if the `ripple-rest` API is currently connected to a `rippled` server, and is ready to be used.  This provides a quick and easy way to check to see if the API is up and running, before attempting to process transactions.

No additional parameters are required.  Upon completion, the server will return `true` if the API is connected, and `false` otherwise.

```js
{
  "success": true,
  "connected": true
}
```

## Get Server Status ##

__`GET /v1/server`__

[Try it! >](rest-api-tool.html#get-server-status)

Retrieve information about the current status of the `ripple-rest` API and the `rippled` server it is connected to.

This endpoint takes no parameters, and returns a JSON object with information on the current status of the API:

```js
{
  "success": true,
  "api_documentation_url": "https://github.com/ripple/ripple-rest",
  "rippled_server_url": "wss://s1.ripple.com:443",
  "rippled_server_status": {
    "build_version": "0.26.3-sp1",
    "complete_ledgers": "32570-8926343",
    "hostid": "LIED",
    "io_latency_ms": 1,
    "last_close": {
      "converge_time_s": 3.068,
      "proposers": 5
    },
    "load_factor": 1,
    "peers": 52,
    "pubkey_node": "n9LpxYuMx4Epz4Wz8Kg2kH3eBTx1mUtHnYwtCdLoj3HC85L2pvBm",
    "server_state": "full",
    "validated_ledger": {
      "age": 10,
      "base_fee_xrp": 0.00001,
      "hash": "5A24FC580674F444BAA72B897C906FF1E167227869BF3D2971C2D87272B038EF",
      "reserve_base_xrp": 20,
      "reserve_inc_xrp": 5,
      "seq": 8926343
    },
    "validation_quorum": 3
  }
}
```

If the server is not currently connected to the Ripple network, the following error will be returned:

```js
{
  "success": false,
  "error": "rippled Disconnected",
  "message": "ripple-rest is unable to connect to the specified rippled server, or the rippled server is unable to communicate with the rest of the Ripple Network. Please check your internet and rippled server settings and try again"
}
```
# UTILITIES #

## Retrieve Ripple Transaction ##

While the `ripple-rest` API is a high-level API built on top of the `rippled` server, there are times when you may need to access an underlying Ripple transaction rather than dealing with the `ripple-rest` data format.  When you need to do this, you can retrieve a standard Ripple formatted transaction by using the following endpoint:

__`GET /v1/tx/{:transaction_hash}`__

[Try it! >](rest-api-tool.html#retrieve-ripple-transaction)

This retrieves the underlying Ripple transaction with the given transaction hash value.  Upon completion, the server will return following JSON object:

```js
{
  "success": true,
  "tx": { /* Ripple Transaction */ }
}
```

Please refer to the [Transaction Format](https://ripple.com/wiki/Transactions) page in the Ripple Wiki for more information about Ripple transactions.

If the given transaction could not be found in the `rippled` server's historical database, the following error will be returned:

```js
{
  "success": false,
  "error": "txnNotFound",
  "message": "Transaction not found."
}
```


## Create Client Resource ID ##

__`GET /v1/uuid`__

[Try it! >](rest-api-tool.html#generate-uuid)

This endpoint creates a universally unique identifier (UUID) value which can be used to calculate a client resource ID for a payment.  This can be useful if the application does not have a UUID generator handy.

This API endpoint takes no parameters, and returns a JSON object which looks like the following:

```js
{
  "success": true,
  "uuid": "a5a8fe40-3795-4b10-b2b6-f05f3ca31db9"
}
```
