# Paths #

In the Ripple Consensus Ledger, paths define a way for payments to flow through intermediary steps on their way from sender to receiver. Paths enable cross-currency payments by connecting sender and receiver via market makers. Paths also enable complex settlement of offsetting debts.

A single Payment transaction in the Ripple Consensus Ledger can use multiple paths, combining liquidity from different sources to deliver the desired amount. Thus, a transaction includes a _path set_, which is a collection of possible paths to take. The paths in a path set must start and end with the same currency.

Since XRP can be sent directly to any address, an XRP-to-XRP transaction does not use any paths.

## Path Steps ##

A path is made of steps that connect the sender to the receiver of the payment. Every step is either:

* Rippling through another account in the same currency
* Exchanging currency at an order book

Rippling through another account is the process of moving debt around. In the typical case, this involves reducing a gateway's obligation to one party and increasing the gateway's obligation to another party. Rippling can occur between any accounts that are connected by trust lines. See [Understanding the NoRipple Flag](concept-noripple.html) for more examples of rippling.

In the case of a currency exchange step, the path step specifies which currency to change to, but does not record the state of the orders in the order book. Since the order of transactions is not finalized until a ledger is validated, it is impossible to determine for certain which offers a transaction will execute, until after the transaction has been validated. Consequently, you cannot know in advance which offers a transaction will take: only which order books the transaction will use. (You can make an educated guess, since each transaction takes the best available offers at the time it executes in the final ledger.)

In both types of steps, each intermediate account gains and loses approximately equal value: either a balance ripples from a trust line to another trust line in the same currency, or they exchange currencies according to a previously-placed order. In some cases, the amounts gained and lost may not be exactly equivalent, due to [transfer fees](concept-transfer-fees.html), trust line quality, or rounding.

[![Diagram of three example paths](img/paths-examples.png)](img/paths-examples.png)



# Technical Details #

## Pathfinding ##

The `rippled` API has two methods that can be used for pathfinding. The [`ripple_path_find` command](reference-rippled.html#ripple-path-find) does a one-time lookup of possible path sets. The [`path_find` command](reference-rippled.html#path-find) (WebSocket only) expands on the initial search with follow-up responses whenever a ledger closes or the server finds a better path.

You can have `rippled` automatically fill in paths when you sign it, by including the `build_path` field in a request to the [`sign` command](reference-rippled.html#sign) or [`submit` command (sign-and-submit mode)](reference-rippled.html#sign-and-submit-mode). However, we recommend pathfinding separately and confirming the results prior to signing, in order to avoid surprises. There are no guarantees on how expensive the paths the server finds will be at the time of submission. (Although `rippled` is designed to search for the cheapest paths possible, it may not always find them. Untrustworthy `rippled` instances could also be modified to change this behavior for profit.)

Finding paths is a very challenging problem that changes slightly every few seconds as new ledgers are validated, so `rippled` is not designed to find the absolute best path. Still, you can find several possible paths and estimate the cost of delivering a particular amount.


## Implied Steps ##

By convention, several steps of a path are implied by the [fields of the Payment transaction](reference-transaction-format.html#payment): specifically, the `Account` (sender), `Destination` (receiver), `Amount` (currency and amount to be delivered) and `SendMax` (currency and amount to be sent, if specified). The implied steps are as follows:

* The first step of a path is always implied to be the sender of the transaction, as defined by the transaction's `Account` field.
* If the transaction includes a `SendMax` field with an `issuer` that is not the sender of the transaction, that issuer is implied to be the second step of the path.
    * If `issuer` of the `SendMax` _is_ the sending account, then the path starts at the sending account, and may use any of that account's trust lines in the given currency. See [special values for SendMax and Amount](reference-transaction-format.html#special-issuer-values-for-sendmax-and-amount) for details.
* If the `Amount` field of the transaction includes an `issuer` that is not the same as the `Destination` of the transaction, that issuer is implied to be the second-to-last step of the path.
* Finally, last step of a path is always implied to be the receiver of a transaction, as defined by the transaction's `Destination` field.


## Default Paths ##

In addition to any paths that are specified in the transaction, a transaction can also execute along the _default path_. The default path is the simplest possible way to connect the [implied steps](#implied-steps) of the transaction.

The default path could be any of the following:

* If the transaction is uses only one currency (regardless of issuer), then the default path assumes the payment will ripple through the accounts involved. This path will only work if there are trust lines connecting those accounts.
    * If `SendMax` is omitted, or the `issuer` of the `SendMax` is the sender, the default path needs a trust line from the sending `Account` to the `issuer` of the destination `Amount` in order to work.
    * If the `SendMax` and `Amount` have different `issuer` values, and neither are the sender or receiver, the default path is probably not useful because it would need to ripple across a trust line between the two issuers. Ripple (the company) typically discourages issuers from trusting one another directly.
* For cross-currency transactions, the default path uses the order book between the source currency (as specified in the `SendMax` field) and the destination currency (as specified in the `Amount` field).

The following diagram enumerates all possible default paths:
[![Diagram of default paths](img/paths-default_paths.png)](img/paths-default_paths.png)

You can use the [`tfNoDirectRipple` flag](reference-transaction-format.html#payment-flags) to disable the default path. In this case, the transaction can only execute using the paths explicitly included in the transaction. Traders can use this option to take arbitrage opportunities.


## Path Specifications ##

A path set is an array. Each member of the path set is another array that represents an individual _path_. Each member of a path is an object that specifies the step. A step has the following fields:

| Field | Value | Description |
|-------|-------|-------------|
| account | String - Address | (Optional) If present, this path step represents rippling through the specified account. |
| currency | String - currency code | (Optional) If present, this path step represents changing currencies through an order book. The currency specified indicates the new currency. |
| issuer | String - Address | (Optional) If the path step represents changing currencies through an order book, this field indicates the issuer of the new currency. This field is not present when changing to XRP. |
| type  | Integer | **DEPRECATED** (Optional) An indicator of which other fields are present. |
| type_hex | String | **DEPRECATED**: (Optional) A hexadecimal representation of the `type` field. |

The `type` field, used for the binary serialization of a path set, is actually constructed through bitwise operations on a single integer. The bits are defined as follows:

| Value (Hex) | Value (Decimal) | Description |
|-------------|-----------------|-------------|
| 0x01        | 1               | A change of account (rippling): the `account` field is present. |
| 0x10        | 16              | A change of currency: the `currency` field is present. |
| 0x20        | 32              | A change of issuer: the `issuer` field is present. |
