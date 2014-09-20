# Ripple-REST API #

The `ripple-rest` API makes it easy to access the Ripple system via a RESTful web interface.  In this section, we will cover the concepts you need to understand, and get you started accessing the API and learning how to use it.

While there are other APIs to use with Ripple (i.e. Accessing the `rippled` server directly via a web socket), this documentation is meant only for the `ripple-rest` API as this is the high-level API recommended for working with Ripple and some of the endpoints provide abstractions to make it much easier to use than the traditional websocket APIs.

Installation instructions and source code can be found in the `ripple-rest` repository <a href="https://github.com/ripple/ripple-rest" target="_blank">here</a>.

Older versions of the `ripple-rest` documentation will archived <a href="https://github.com/ripple/ripple-dev-portal/archive" target="_blank">here</a>.


## Available API Routes ##

* [`GET /v1/accounts/new`](#generating-accounts)
* [`GET /v1/accounts/{:address}/payments/paths`](#preparing-a-payment)
* [`GET /v1/accounts/{:address}/payments`](#confirming-a-payment)
* [`GET /v1/accounts/{:address}/balances`](#account-balances)
* [`GET /v1/accounts/{:address}/settings`](#account-settings)
* [`GET /v1/accounts/{:address}/trustlines`](#reviewing-trustlines)
* [`GET /v1/accounts/{:address}/notifications/{:transaction_hash}`](#checking-notifications)
* [`GET /v1/server/connected`](#check-connection-state)
* [`GET /v1/server`](#get-server-status)
* [`GET /v1/tx`](#retrieve-ripple-transaction)
* [`GET /v1/uuid`](#create-client-resource-id)


* [`POST /v1/payments`](#submitting-a-payment)
* [`POST /v1/accounts/{:address}/settings`](#updating-account-settings)
* [`POST /v1/accounts/{:address}/trustlines`](#granting-a-trustline)

## API Overview ##

### Ripple Concepts ###

Ripple is a system for making financial transactions.  You can use Ripple to send money anywhere in the world, in any currency, instantly and for free.

In the Ripple world, each account is identified by a <a href="https://ripple.com/wiki/Account" target="_blank">Ripple Address</a>.  A Ripple address is a string that uniquely identifies an account, for example: `rNsJKf3kaxvFvR8RrDi9P3LBk2Zp6VL8mp`

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

+ Payment: A Payment transaction is an authorized transfer of balance from one address to another. (This maps to rippled's [Payment transaction type](transactions.html#payment))

+ Trustline: A Trustline transaction is an authorized grant of trust between two addresses. (This maps to rippled's [TrustSet transaction type](transactions.html#payment))

+ Setting: A Setting transaction is an authorized update of account flags under a Ripple Account. (This maps to rippled's [AccountSet transaction type](transactions.html#payment))

## Getting Started ##

### Setup ###

Before you can use the `ripple-rest` API, you will need to have three things:

 * An installed version of `ripple-rest` running locally or remotely. Instructions on installing `ripple-rest` can be found in the [readme.md file in the Github Repository](https://github.com/ripple/ripple-rest).

 * An activated Ripple account.  If you don't have a Ripple account, you can use the Ripple web client to create one, as described in the <a href="https://support.ripplelabs.com/hc/en-us/categories/200194196-Set-Up-Activation" target="_blank">online support</a>.  Make sure you have a copy of the Ripple address for your account; the address can be found by clicking the *Show Address* button in the __Fund__ tab of the [web client](https://rippletrade.com/).

 * The URL of the server running the `ripple-rest` API that you wish to use.  In this documentation, we will assume that the server is installed and running on a server you have connectivity to.

As a programmer, you will also need to have a suitable HTTP client library that allows you to make secure HTTP (`HTTPS`) requests.  To follow the examples below, you will need to have access to the `curl` command-line tool.


### Exploring the API ###

Let's start by using `curl` to see if the `ripple-rest` API is currently running.  Type the following into a terminal:

`curl http://[ripple-rest-server]/v1/server`

After a short delay, the following response should be displayed:

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

The `ripple-rest` API conforms to the following general behavior for a web interface:

* The HTTP method identifies what you are trying to do.  Generally, HTTP `GET` requests are used to retrieve information, while HTTP `POST` requests are used to make changes or submit information.

* You make HTTP (or HTTPS) requests to the API endpoint, including the desired resources within the URL itself.

* If more complicated information needs to be sent, it will be included as JSON-formatted data within the body of the HTTP POST request.

* Upon completion, the server will return an HTTP status code of 200 (OK), and a `Content-Type` value of `application/json`.  The body of the response will be a JSON-formatted object containing the information returned by the endpoint.

* The returned JSON object will include a `success` field indicating whether the request was successful or not.


### Errors ###

There are two different ways in which errors are returned by the `ripple-rest` API:

Low-level errors are indicated by the server returning an appropriate HTTP status code.  The following status codes are currently supported:

+ `Bad Request (400)` The JSON body submitted is malformed or invalid.
+ `Method Not Accepted (404)` The endpoint is not allowed.
+ `Gateway Timeout (502)` The rippled server is taking to long to respond.
+ `Bad Gateway (504)` The rippled server is non-responsive.

Application-level errors are described further in the body of the JSON response with the following fields:

+ `success` This will be set to `false` if an error occurred.

+ `error` A short string identifying the error that occurred.

+ `message` A longer human-readable string explaining what went wrong.


### API Objects ###

#### <a id="amount_object"></a> 1. Amount ####

All currencies on the Ripple Network have issuers, except for XRP. In the case of XRP, the `issuer` field may be omitted or set to `""`. Otherwise, the `issuer` must be a valid Ripple address of the gateway that issues the currency.

For more information about XRP see [the Ripple wiki page on XRP](https://ripple.com/wiki/XRP). For more information about using currencies other than XRP on the Ripple Network see [the Ripple wiki page for gateways](https://ripple.com/wiki/Ripple_for_Gateways).

Amount Object:

```js
{
  "value": "1.0",
  "currency": "USD",
  "issuer": "r..."
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

#### <a id="payment_object"></a> 2. Payment ####

The `Payment` object is a simplified version of the standard Ripple transaction format.

This `Payment` format is intended to be straightforward to create and parse, from strongly or loosely typed programming languages. Once a transaction is processed and validated it also includes information about the final details of the payment.

<!-- A minimal `Payment` object will look like this:

```js
{
  "src_address": "rKXCummUHnenhYudNb9UoJ4mGBR75vFcgz",
  "dst_address": "rNw4ozCG514KEjPs5cDrqEcdsi31Jtfm5r",
  "dst_amount": {
    "value": "0.001",
    "currency": "XRP",
    "issuer": ""
  }
}
```
-->

 + `source_address` is the Ripple address for the source account, as a string.

 + `destination_address` is the Ripple address for the destination account, as a string.

 + `destination_amount` is an [Amount](#amount_object) object representing the amount that should be deposited into the destination account.

The full set of fields accepted on `Payment` submission is as follows:

+ `source_tag` is an optional unsigned 32 bit integer (0-4294967294, inclusive) that is generally used if the sender is a hosted wallet at a gateway. This should be the same as the `destination_tag` used to identify the hosted wallet when they are receiving a payment.

+ `destination_tag` is an optional unsigned 32 bit integer (0-4294967294, inclusive) that is generally used if the receiver is a hosted wallet at a gateway.

+ `source_slippage` can be specified to give the `source_amount` a cushion and increase its chance of being processed successfully. This is helpful if the payment path changes slightly between the time when a payment options quote is given and when the payment is submitted. The `source_address` will never be charged more than `source_slippage` + the `value` specified in `source_amount`.

+ `invoice_id` is an optional 256-bit hash field that can be used to link payments to an invoice or bill.

+ `paths` is a "stringified" version of the Ripple PathSet structure. Most users of this API will want to treat this field as opaque. See the [Ripple Wiki](https://ripple.com/wiki/Payment_paths) for more information about Ripple pathfinding.

+ `flag_no_direct_ripple` is a boolean that can be set to `true` if `paths` are specified and the sender would like the Ripple Network to disregard any direct paths from the `source_address` to the `destination_address`. This may be used to take advantage of an arbitrage opportunity or by gateways wishing to issue balances from a hot wallet to a user who has mistakenly set a trustline directly to the hot wallet. Most users will not need to use this option.

+ `flag_partial_payment` is a boolean that, if set to true, indicates that this payment should go through even if the whole amount cannot be sent because of a lack of liquidity or funds in the `source_address` account. The vast majority of senders will never need to use this option.

Payment Object:

```js
{
    /* User Specified */

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

    /* Advanced Options */

    "invoice_id": "",
    "paths": "[]",
    "flag_no_direct_ripple": false,
    "flag_partial_payment": false
}
```
# PAYMENTS #

`ripple-rest` provides access to `ripple-lib`'s robust transaction submission processes. This means that it will set the fee, manage the transaction sequence numbers, sign the transaction with your secret, and resubmit the transaction up to 10 times if `rippled` reports an initial error that can be solved automatically.

## Making Payments ##

### Preparing a Payment ###

__GET /v1/accounts/{:address}/payments/paths/{:destination_account}/{:destination_amount}__

[Try it! >](rest-api-tool.html#prepare-payment)

To prepare a payment, you first make an HTTP `GET` call to the above endpoint.  This will generate a list of possible payments between the two parties for the desired amount, taking into account the established trustlines between the two parties for the currency being transferred.  You can then choose one of the returned payments, modify it if necessary (for example, to set slippage values or tags), and then submit the payment for processing.

The following URL parameters are required by this API endpoint:

+ `address` *[required]* The Ripple address for the source account.
+ `destination_account` *[required]* The Ripple address for the destination account.
+ `destination_amount` *[required]* The amount to be sent to the destination account.  Note that this value uses `+` characters to separate the `value`, `currency` and `issuer` fields.  
+ For XRP, the format is: `0.1+XRP`

+ For other currencies, you need to include the Ripple address of the currency's issuer, like this: `0.1+USD+r...`

Optionally, you can also include the following as a query string parameter:

`source_currencies` *[optional]* A comma-separated list of source currencies.  This is used to filter the returned list of possible payments.  Each source currency can be specified either as a currency code (eg, `USD`), or as a currency code and issuer (eg, `USD+r...`).  If the issuer is not specified for a currency other than XRP, then the results will be limited to the specified currency, but any issuer for that currency will be included in the results.

Note that this call is a wrapper around the [Ripple path-find](https://ripple.com/wiki/RPC_API#path_find) command, and returns an array of [`Payment`](#payment_object) objects, like this:

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
You can then select the desired payment, modify it if necessary, and submit the payment object to the [`POST /v1/payments`](#submitting-a-payment) endpoint for processing.

__NOTE:__ This command may be quite slow. If the command times out, please try it again.

### Submitting a Payment ###

__`POST /v1/payments`__

Before you can submit a payment, you will need to have three pieces of information:

+ The [`Payment`](#payment_object) *[required]* object to be submitted.

+ The `secret` *[required]* or private key for your Ripple account.

__DO NOT SUBMIT YOUR SECRET TO AN UNTRUSTED REST API SERVER__ -- this is the key to your account and your money. If you are using the test server provided, only use test accounts to submit payments.

+ A `client_resource_id` *[required]* that will uniquely identify this payment.  This is a 36-character UUID (universally unique identifier) value which will uniquely identify this payment within the `ripple-rest` API. This value can be any unique string such as "123" or "ABC123".  Note that you can use the [`GET /v1/uuid`](#calculating_a_uuid) endpoint to calculate a UUID value if you do not have a UUID generator readily available.

This HTTP `POST` request must have a content-type of `application/json`, and the body of the request should look like this:

```js
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

[Try it! >](rest-api-tool.html#submit-payment)

Upon completion, the server will return a JSON object which looks like the following:

```js
{
  "success": true,
  "client_resource_id": "123",
  "status_url": ".../v1/accounts/r1.../payments/123"
}
```

The `status_url` value is a URL that can be queried to get the current status for this payment.  This will be a reference to the `GET /v1/accounts/{:address}/payments` endpoint, with the client resource ID filled in to retrieve the details of the payment.  More information on this endpoint can be found in the section on [confirming a payment](#confirming-a-payment).

If an error occurred that prevented the payment from being submitted, the response object will look like this:

```js
{
  "success": false,
  "error": "tecPATH_DRY",
  "message": "Path could not send partial amount. Please ensure that the src_address has sufficient funds (in the src_amount currency, if specified) to execute this transaction."
}
```

More information about transaction errors can be found on the [Ripple Wiki](https://ripple.com/wiki/Transaction_errors).

Note that payments cannot be cancelled once they have been submitted.

### Confirming a Payment ###

__`GET /v1/accounts/{:address}/payments/{:id}`__

The `{:id}` value can be either a client resource identifier or a transaction hash value.

[Try it! >](rest-api-tool.html#confirm-payment)

To confirm that your payment has been submitted successfully, you can call this API endpoint.  The `hash` value can either be the transaction hash for the desired payment, or the payment's client resource ID.

The server will return the details of your payment:

```js
{
  "success": true,
  "payment": {
    "source_account": "rPs7nVbSops6xm4v77wpoPFf549cqjzUy9",
    "source_tag": "",
    "source_amount": {
    "value": "1",
    "currency": "XRP",
    "issuer": ""
  },
  "source_slippage": "0",
  "destination_account" "rKB4oSXwPkRpb2sZRhgGyRfaEhhYS6tf4M",
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
  "direction": "outgoing",
  "state": "validated",
  "result": "tesSUCCESS",
  "ledger": "6141074",
  "hash": "85C5E6762DE7969DC1BD69B3C8C7387A5B8FCE6A416AA1F74C0ED5D10F08EADD",
  "timestamp": "2014-04-18T01:21:00.000Z",
  "fee": "0.000012",
  "source_balance_changes":
  [
    {
      "value": "-1.000012",
      "currency": "XRP",
      "issuer": ""
    }
  ],
  "destination_balance_changes":
  [
    {
      "value": "1",
      "currency": "XRP",
      "issuer": ""
    }
  ]
}
```

You can then check the `state` field to see if the payment has gone through; it will have the value "validated" when the payment has been validated and written to the Ripple ledger.

If the payment cannot be found, then an error will be returned instead:

```js
{
  "success": true,
  "error": "Payment Not Found",
  "message": "This may indicate that the payment was never validated and written into the Ripple ledger and it was not submitted through this ripple-rest instance. This error may also be seen if the databases of either ripple-rest or rippled were recently created or deleted."
}
```

Note that there can be a delay in processing a submitted payment; if the payment does not exist yet, or has not been validated, you should wait for a short period of time before checking again.

## Receiving Payments ##

As well as sending payments, your application will need to know when incoming payments have been received.  To do this, you first make the following API call:

__`GET /v1/accounts/{:address}/payments`__

[Try it! >](rest-api-tool.html#get-payment-history)

This will return the most recent payments (both incoming and outgoing will be denoted in the direction)

```js
{
  "success": true,
  "payments": [
    { /* payment */ }.
    { /* payment */ }.
    { /* payment */ }.
    { /* payment */ }.
    { /* payment */ }
  ]
}
```
__`GET /v1/accounts/{:address}/payments?direction=incoming`__

This will return the most recent incoming payments for your account, up to a maximum of 20.  You can process these historical payments if you want, and also retrieve more historical payments if you need to by using the `page` parameter, as described in the [Payment History](#payment-history) section below.

Regardless of what else you do with these payments, you need to extract the value of the `ledger` field from the most recent (ie, first) payment in the returned list.  Convert this number to an integer and increment it by one.  The resulting value, which will we call the `next_ledger` value, is the starting point for polling for new payments.

Your application should then periodically make the following API call:

__`GET /v1/accounts/{:address}/payments?direction=incoming&earliest_first=true&start_ledger={next_ledger}`__

This will return any _new_ payments which have been received, up to a maximum of 20.  You should process these incoming payments.  If you received a list of 20 payments, there may be more payments to be processed.  You should then use the `page` parameter to get the next chunk of 20 payments, like this:

__`GET /v1/accounts/{:address}/payments?direction=incoming&earliest_first=true&start_ledger={next_ledger}&page=2`__

Continue retrieving the payments, incrementing the `page` parameter each time, until there are no new incoming payments to be processed.

__Note:__ We use the `earliest_first` parameter to retrieve the payments in ascending date order (ie, the oldest payment first).  This ensures that if any more payments come in after the first API call with `start_ledger` set to `next_ledger`, you won't miss any payments.  If you use the `page` parameter while retrieving the payments in descending order (ie, the most recent payment first), you may miss one or more payments while scanning through the pages.

Once you have retrieved all the payments, you should update your `next_ledger` value by once again taking the value of the `ledger` field from the most recent (ie, last) payment received, converting this value to an integer and incrementing it by one.  This will give you the `next_ledger` value to use the next time you poll for payments.

Using this approach, you can regularly poll for new incoming payments, confident that no payments will be processed twice, and no incoming payments will be missed.


## Payment History ##

__`GET /v1/accounts/{:address}/payments`__

[Try it! >](rest-api-tool.html#get-payment-history)

This API endpoint can be used to browse through an account's payment history and also used to confirm specific payments after a payment has been submitted. The following query string parameters can be used to filter the list of returned payments:

+ `source_account` Filter the results to only include payments sent by the given account.

+ `destination_account` Filter the results to only include payments received by the given account.

+ `exclude_failed` If set to `true`, the results will only include payments which were successfully validated and written into the ledger.  Otherwise, failed payments will be included.

+ `direction` Limit the results to only include the given type of payments.  The following direction values are currently supported:
 + `incoming`
 + `outgoing`
 + `pending`
 + `earliest_first` If set to `true`, the payments will be returned in ascending date order.  Otherwise, the payments will be returned in descending date order (ie, the most recent payment will be returned first).  Defaults to `false`.

+ `start_ledger` The index for the starting ledger.  If `earliest_first` is `true`, this will be the oldest ledger to be queried; otherwise, it will be the most recent ledger.  Defaults to the first ledger in the `rippled` server's database.

+ `end_ledger` The index for the ending ledger.  If `earliest_first` is `true`, this will be the most recent ledger to be queried; otherwise, it will be the oldest ledger.  Defaults to the most recent ledger in the `rippled` server's database.

+ `results_per_page` The maximum number of payments to be returned at once.  Defaults to 20.

+ `page` The page number to be returned.  The first page of results will have page number `1`, the second page will have page number `2`, and so on.  Defaults to `1`.

Upon completion, the server will return a JSON object which looks like the following:

```js
{
  "success": true,
  "payments": [
    {
      "client_resource_id": "3492375b-d4d0-42db-9a80-a6a82925ccd5",
      "payment": {
        /* Payment */
      }
    }, {
      "client_resource_id": "4a4e3fa5-d81e-4786-8383-7164c3cc9b01",
      "payment": {
        /* Payment */
      }
    }
  ]
}
```

If the server returns fewer than `results_per_page` payments, then there are no more pages of results to be returned.  Otherwise, increment the page number and re-issue the query to get the next page of results.

Note that the `ripple-rest` API has to retrieve the full list of payments from the server and then filter them before returning them back to the caller.  This means that there is no speed advantage to specifying more filter values.



# ACCOUNTS #

`ripple-rest` provides the ability to review and confirm on information regarding your Ripple account. You can view your current balances and settings, as well as the ability to set your account setting flags.

## Generating Accounts ##

(New in [Ripple-REST v1.3.0](https://github.com/ripple/ripple-rest/releases/tag/v1.3.0-rc1))

There are two steps to making a new account on the Ripple network: randomly creating the keys for that account, and sending it enough XRP to meet the account reserve.

Generating the keys can be done offline, since it does not affect the network at all. To make it easy, Ripple-REST can generate account keys for you.

*Caution:* Ripple account keys are very sensitive, since they give full control over that account's money on the Ripple network. Do not transmit them to untrusted servers, or unencrypted over the internet (for example, through HTTP instead of HTTPS). There *are* bad actors who are sniffing around for account keys so they can steal your money!

__`GET /v1/accounts/new`__

[Try it! >](rest-api-tool.html#generate-account)

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


## Account Balances ##

__`GET /v1/accounts/{:address}/balances`__

[Try it! >](rest-api-tool.html#get-account-balances)

Retrieve the current balances for the given Ripple account.

The `account` parameter should be set to the Ripple address of the desired account.  The server will return a JSON object which looks like the following:

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

## Account Settings ##

You can retrieve an account's settings by using the following endpoint:

__`GET /v1/accounts/{:address}/settings`__

[Try it! >](rest-api-tool.html#get-account-settings)

The server will return a list of the current settings in force for the given account, in the form of a JSON object:

```js
{
  "success": true,
  "settings": {
    "transfer_rate": 100,
    "password_spent": false,
    "require_destination_tag": false,
    "require_authorization": false,
    "disallow_xrp": false,
    "disable_master": false,
    "transaction_sequence": 22
  }
}
```

The following account settings are currently supported:

+ `PasswordSpent` `true` if the password has been "spent", else `false`.
<!--NOTE: This is not currently listed in the account settings schema, so I'm not sure what this setting is used for.
-->
+ `RequireDestTag` If this is set to `true`, incoming payments will only be validated if they include a `destination_tag` value.  Note that this is used primarily by gateways that operate exclusively with hosted wallets.

+ `RequireAuth` If this is set to `true`, incoming trustlines will only be validated if this account first creates a trustline to the counterparty with the authorized flag set to true.  This may be used by gateways to prevent accounts unknown to them from holding currencies they issue.

+ `DisallowXRP` If this is set to `true`, payments in XRP will not be allowed.

+ `EmailHash` The MD5 128-bit hash of the account owner's email address, if known.

+ `MessageKey` An optional public key, represented as a hex string, that can be used to allow others to send encrypted messages to the account owner.

+ `Domain` The domain name associated with this account.

+ `TransferRate` The rate charged each time a holder of currency issued by this account transfers some funds.  The default rate is `"1.0"; a rate of `"1.01"` is a 1% charge on top of the amount being transferred.  Up to nine decimal places are supported.

## Updating Account Settings ##

To change an account's settings, make an HTTP `POST` request to the above endpoint.  The request must have a content-type of `application/json`, and the body of the request should look like this:

__`POST /v1/accounts/{:address}/settings`__

```js
{
  "secret": "s...",
  "settings": {
    "transfer_rate": 100,
    "password_spent": false,
    "require_destination_tag": false,
    "require_authorization": false,
    "disallow_xrp": false,
    "disable_master": false,
    "transaction_sequence": 22
  }
}
```

[Try it! >](rest-api-tool.html#update-account-settings)

The given settings will be updated.

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

Notifications can be used as a looping mechanism to monitor any transactions against your Ripple address or to confirm against missed notifications if your connection to `rippled` goes down. Notifications are generic and span across all types of Ripple transactions which is different than the "Payments" endpoints which specifically retrieve payment transactions. The "Payments" endpoints also provide full payment objects versus the notification objects which described the transaction at a higher level with less detail.

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
