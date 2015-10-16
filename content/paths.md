# Paths #

In the Ripple Consensus Ledger, paths define a way for payments to flow through intermediary steps on their way from sender to receiver. Paths enable cross-currency payments and exchanges. A single Payment transaction in the Ripple Consensus Ledger can use multiple paths, combining liquidity from different sources to deliver the desired amount. Thus, a transaction includes a _path set_ of possible paths to take. The paths in a path set must start and end with the same currency, although they could use different issuers.

Since XRP can be sent directly to any address, an XRP-to-XRP transaction does not use any paths.

## Path Steps ##

A path is made of steps that connect the sender to the receiver of the payment. In theory, there are many possible types of steps, but in practice, there are only two:

* Rippling through another account in the same currency
* Exchanging currency at an order book

In the case of a currency exchange step, the path step specifies which currency to change to, but does not record the state of the orders in the order book. Since the order of transactions is not finalized until a ledger is validated, it is impossible to determine for certain which offers a transaction will execute, until after the transaction has been validated. Consequently, you cannot know in advance which offers a transaction will take: only which order books the transaction will use. (You can make an educated guess, since each transaction takes the best available offers at the time it executes in the final ledger.)

Each intermediate account gains and loses approximately equal value: either a balance ripples from a trust line to another trust line in the same currency, or they exchange currencies according to a previously-placed order. In some cases, the amounts gained and lost may not be exact, due either to [transfer fees](https://ripple.com/knowledge_center/transfer-fees/) or rounding.

[![Diagram of three example paths](img/paths.png)](img/paths.png)

### Auto-Bridging ###

In addition to any order books that are explicitly included in a path, any currency exchange between two non-XRP currencies could potentially use XRP as an intermediary currency in a synthetic order book. This is because of auto-bridging, which serves to improve liquidity across all currency pairs by using XRP as a vehicle currency.



# Technical Details #

## Pathfinding ##

The `rippled` API has two methods that can be used for pathfinding. The [`ripple_path_find` command](rippled-apis.html#ripple-path-find) gets a single response. The [`path_find` command](rippled-apis.html#path-find) (WebSocket only) provides a path with follow-up responses when a ledger closes or the server finds a better path.

Finding paths is a very challenging problem that changes slightly every few seconds as new ledgers are validated, so `rippled` is not designed to find the absolute best path. Still, you can find several possible paths and estimate the cost of delivering a particular amount.


## Implied Steps ##

By convention, the sender and the receiver are implied, rather than included explicitly in a path, even though they are the proper first and last steps. Sometimes the second step and second-to-last step are also implied by the issuers of the currencies to send and receive. More specifically:

* The first step of a path is always implied to be the sender of the transaction, as defined by the transaction's `Account` field.
* If the transaction includes a `SendMax` field with an `issuer` that is not the sender of the transaction, that issuer is implied to be the second step of the path.
    * If `issuer` of the `SendMax` _is_ the sending account, then the path starts at the sending account, and may use any of that account's trust lines in the given currency. See [special values for SendMax and Amount](transactions.html#special-issuer-values-for-sendmax-and-amount) for details.
* If the `Amount` field of the transaction includes an `issuer` that is not the same as the `Destination` of the transaction, that issuer is implied to be the second-to-last step of the path.
* Finally, last step of a path is always implied to be the receiver of a transaction, as defined by the transaction's `Destination` field.

See [Payment Transaction Type](transactions.html#payment) for more information on the fields of a Payment.


## Default Paths ##

In addition to any paths that are specified in the transaction, a transaction can also execute along the _default path_. The default path is the simplest possible way to connect the [implied steps](#implied-steps) of the transaction.

The default path could be any of the following:

* If the transaction is uses one currency (regardless of issuer), then the default path connects the accounts of the implied steps directly. This path will only work if there is a trust line connecting those accounts.
    * If `SendMax` is omitted, or the `issuer` of the `SendMax` is the sender, the default path needs a trust line from the sending `Account` to the `issuer` of the destination `Amount` in order to work.
    * If the `SendMax` and `Amount` have different `issuer` values, and neither are the sender or receiver, the default path is probably not useful because it would need to ripple through a trust line between the two issuers. Ripple, Inc. typically discourages issuers from trusting one another directly.
* For cross-currency transactions, the default path automatically appends the order book between the source currency (as specified in the `SendMax` field) and the destination currency (as specified in the `Amount` field).

[![Diagram of default paths](img/default-paths.png)](img/default-paths.png)

You can use the [`tfNoDirectRipple` flag](transactions.html#payment-flags) to disable the default path. In this case, the transaction can only execute using the paths explicitly included in the transaction. Traders can use this option to take arbitrage opportunities.


## Path Specifications ##

A path set is an array. Each member of the path set is another array that represents an individual _path_. Each member of a path is an object that specifies the step. A step has the following fields:

| Field | Value | Description |
|-------|-------|-------------|
| account | String - Address | (Optional) The address of the account to ripple through. |
| currency | String - currency code | (Optional) The currency code of the currency to convert to |
| issuer | String - Address | (Optional) The issuer of the currency to convert to |
| type  | Integer | **DEPRECATED**: An indicator of which other fields are present. The value `1` indicates rippling to another account. The values `16` indicates a currency change to XRP through an order book. The value `48` indicates a currency change, with a new issuer, through an order book. |
| type_hex | String | **DEPRECATED**: A hexadecimal representation of the `type` field. |

The `type` field, used for the binary serialization of a path set, is actually constructed through bitwise operations on a single integer. The bits are defined as follows:

| Value (Hex) | Value (Decimal) | Description |
|-------------|-----------------|-------------|
| 0x01        | 1               | A change of account (rippling): the `account` field is present. |
| 0x10        | 16              | A change of currency: the `currency` field is present. |
| 0x20        | 32              | A change of issuer: the `issuer` field is present. |





