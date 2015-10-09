# Paths #

In the Ripple Consensus Ledger, paths define a way for payments to flow through intermediary steps on their way from sender to receiver. Paths enable cross-currency payments and exchanges. A single Payment transaction in the Ripple Consensus Ledger can use multiple paths, combining liquidity from different sources to deliver the desired amount. Thus, a transaction includes a _path set_ of possible paths to take. The paths in a path set must start and end with the same currency, although they could use different issuers.

Since XRP can be sent directly to any address, an XRP-to-XRP transaction does not use any paths.

## Path Steps ##

A path is made of steps that connect the sender to the receiver of the payment. In theory, there are many possible types of steps, but in practice, there are only two:

* Rippling through another account in the same currency
* Exchanging currency at an order book

In the case of a currency exchange step, the path step specifies which currency to change to, but does not record the state of the orders in the order book. Since the order of transactions is not finalized until a ledger is validated, it is impossible to determine for certain which offers a transaction will execute, until after the transaction has been validated. Consequently, you cannot know in advance which offers a transaction will take: only which order books the transaction will use.

Each intermediate account gains and loses equal value: either a balance ripples from a trust line to another trust line in the same currency, or they exchange currencies according to a previously-placed order.

### Auto-Bridging ###

In addition to any order books that are explicitly included in a path, any currency exchange between two non-XRP currencies could potentially use XRP as an intermediary currency in a synthetic order book. This is because of auto-bridging, which serves to improve liquidity across all currency pairs by using XRP as a vehicle currency.


## Default Paths ##

In addition to any paths that are specified in the transaction, a transaction can also execute along the _default path_. The default path of a transaction depends on the nature of the payment, but basically, the default path is the simplest possible way to connect the sender and receiver using the information provided.

The default path could be any of the following:

* The trust line that connects the source account and destination account
* The trust lines to the `issuer` of the source amount and/or destination amount
* The order book that connects the source amount to the destination amount

You can use the [`tfNoDirectRipple` flag](transactions.html#payment-flags) to disable the default path. In this case, the transaction can only execute using the paths explicitly included in the transaction. Traders can use this option to take arbitrage opportunities.



# Technical Details #

## Implied Steps ##

By convention, the sender and the receiver are implied, rather than included explicitly in a path, even though they are the proper first and last steps. Sometimes the second step and second-to-last step are also implied by the issuers of the currencies to send and receive. More specifically:

* The first step of a path is always implied to be the sender of the transaction, as defined by the transaction's `Account` field.
* If the transaction includes a `SendMax` field with an `issuer` that is not the sender of the transaction, that issuer is implied to be the second step of the path.
* If the `Amount` field of the transaction includes an `issuer` that is not the same as the `Destination` of the transaction, that issuer is implied to be the second-to-last step of the path.
* Finally, last step of a path is always implied to be the receiver of a transaction, as defined by the transaction's `Destination` field.


## Path Specifications ##

A path set is an array. Each member of the path set is another array that represents an individual _path_. Each member of a path is an object that specifies the step. A step has the following fields:

| Field | Value | Description |
|-------|-------|-------------|
| type  | Integer | The number `48` indicates a change of currency through an order book. The number `1` indicates rippling through another account. |
| type_hex | String | A hexadecimal representation of the `type` field. |
| account | String - Address | (Optional) The address of the account to ripple through. |
| currency | String - currency code | (Optional) The currency code of the currency to convert to |
| issuer | String - Address | (Optional) The issuer of the currency to convert to |

The `type` field, used for the binary serialization of a path set, is actually constructed through bitwise operations on a single integer. The bits are defined as follows:

| Value (Hex) | Value (Decimal) | Description |
|-------------|-----------------|-------------|
| 0x01        | 1               | A change of account (rippling): the `account` field is present. |
| 0x10        | 16              | A change of currency: the `currency` field is present. |
| 0x20        | 32              | A change of issuer: the `issuer` field is present. |





