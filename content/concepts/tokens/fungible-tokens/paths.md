---
html: paths.html
parent: trust-lines-and-issuing.html
seo:
    description: Payments of tokens must traverse paths of connected users and order books.
labels:
  - Payments
  - Cross-Currency
---
# Paths

In the XRP Ledger, paths define a way for [tokens](../index.md) to flow through intermediary steps as part of a payment. Paths enable [cross-currency payments](../../payment-types/cross-currency-payments.md) by connecting sender and receiver through orders in the XRP Ledger's [decentralized exchange](../decentralized-exchange/index.md). Paths also enable complex settlement of offsetting debts.

A single Payment transaction in the XRP Ledger can use multiple paths, combining liquidity from different sources to deliver the desired amount. Thus, a transaction includes a _path set_, which is a collection of possible paths to take. All paths in a path set must start with the same currency, and must also end with the same currency as each other.

Since XRP can be sent directly to any address, an [XRP-to-XRP transaction](../../payment-types/direct-xrp-payments.md) does not use any paths.

## Path Steps

A path is made of steps that connect the sender to the receiver of the payment. Every step is either:

* Rippling through another address with the same currency
* Trading tokens or XRP using an order book

[Rippling](rippling.md) is the process of exchanging equivalent tokens using the same currency code. In the typical case, rippling through an issuer involves reducing the tokens issued to one party and increasing the tokens issued to another party by an equal amount. The path step specifies which account to ripple through.

[Trading tokens and possibly XRP](../decentralized-exchange/index.md) involves going to an order book and finding the best exchange rate between the assets involved for the amount being sent. The path step specifies which currency to change to, but does not record the state of the Offers in the order book. The canonical order of transactions is not final until a ledger is validated, so you cannot know for certain which Offers a transaction will take, until after the transaction has been validated. (You can make an educated guess, since each transaction takes the best available Offers at the time it executes in the final ledger.) <!-- STYLE_OVERRIDE: will -->

In both types of steps, each intermediate address gains and loses approximately equal value: either a balance ripples from a trust line to another trust line in the same currency, or they exchange currencies according to a previously-placed order. In some cases, the amounts gained and lost may not be exactly equivalent, due to [transfer fees](../transfer-fees.md), trust line quality settings, or rounding.

[{% inline-svg file="/img/paths-examples.svg" /%}](/img/paths-examples.svg "Diagram of three example paths")



# Technical Details

## Pathfinding

The `rippled` API has two methods that can be used for pathfinding. The [ripple_path_find method][] does a one-time lookup of possible path sets. The [path_find method][] (WebSocket only) expands on the search with follow-up responses whenever a ledger closes or the server finds a better path.

You can have `rippled` automatically fill in paths when you sign it, by including the `build_path` field in a request to the [sign method][] or [`submit` command (sign-and-submit mode)](../../../references/http-websocket-apis/public-api-methods/transaction-methods/submit.md#sign-and-submit-mode). However, we recommend pathfinding separately and confirming the results before signing, to avoid surprises.

**Caution:** Although `rippled` is designed to search for the cheapest paths possible, it may not always find them. Untrustworthy `rippled` instances could also be modified to change this behavior for profit. The actual cost to execute a payment along a path can change between submission and transaction execution.

Finding paths is a very challenging problem that changes slightly every few seconds as new ledgers are validated, so `rippled` is not designed to find the absolute best path. Still, you can find several possible paths and estimate the cost of delivering a particular amount.


## Implied Steps

By convention, several steps of a path are implied by the [fields of the Payment transaction](../../../references/protocol/transactions/types/payment.md): specifically, the `Account` (sender), `Destination` (receiver), `Amount` (currency and amount to be delivered) and `SendMax` (currency and amount to be sent, if specified). The implied steps are as follows:

* The first step of a path is always implied to be the sender of the transaction, as defined by the transaction's `Account` field.
* If the transaction includes a `SendMax` field with an `issuer` that is not the sender of the transaction, that issuer is implied to be the second step of the path.
    * If `issuer` of the `SendMax` _is_ the sending address, then the path starts at the sending address, and may use any of that address's trust lines for the given currency code. See [special values for `SendMax` and `Amount`](../../../references/protocol/transactions/types/payment.md#special-issuer-values-for-sendmax-and-amount) for details.
* If the `Amount` field of the transaction includes an `issuer` that is not the same as the `Destination` of the transaction, that issuer is implied to be the second-to-last step of the path.
* Finally, last step of a path is always implied to be the receiver of a transaction, as defined by the transaction's `Destination` field.


## Default Paths

In addition to explicitly specified paths, a transaction can execute along the _default path_. The default path is the simplest possible way to connect the [implied steps](#implied-steps) of the transaction.

The default path could be any of the following:

* If the transaction uses only one token (regardless of issuer), then the default path assumes the payment should ripple through the addresses involved. This path only works if those addresses are connected by trust lines.
    * If `SendMax` is omitted, or the `issuer` of the `SendMax` is the sender, the default path needs a trust line from the sending `Account` to the `issuer` of the destination `Amount` to work.
    * If the `SendMax` and `Amount` have different `issuer` values, and neither are the sender or receiver, the default path is probably not useful because it would need to ripple across a trust line between the two issuers. Ripple (the company) typically discourages issuers from trusting one another directly.
* For cross-currency transactions, the default path uses the order book between the source currency (as specified in the `SendMax` field) and the destination currency (as specified in the `Amount` field).

The following diagram enumerates all possible default paths:

[{% inline-svg file="/img/default-paths.svg" /%}](/img/default-paths.svg "Diagram of default paths")

You can use the [`tfNoDirectRipple` flag](../../../references/protocol/transactions/types/payment.md#payment-flags) to disable the default path. In this case, the transaction can only execute using the paths explicitly included in the transaction. Traders can use this option to take arbitrage opportunities.


## Path Specifications

A path set is an array. Each member of the path set is another array that represents an individual _path_. Each member of a path is an object that specifies the step. A step has the following fields:

| Field      | Value                  | Description                            |
|:-----------|:-----------------------|:---------------------------------------|
| `account`  | String - Address       | _(Optional)_ If present, this path step represents rippling through the specified address. MUST NOT be provided if this step specifies the `currency` or `issuer` fields. |
| `currency` | String - Currency Code | _(Optional)_ If present, this path step represents changing currencies through an order book. The currency specified indicates the new currency. MUST NOT be provided if this step specifies the `account` field. |
| `issuer`   | String - Address       | _(Optional)_ If present, this path step represents changing currencies and this address defines the issuer of the new currency. If omitted in a step with a non-XRP `currency`, a previous step of the path defines the issuer. If present when `currency` is omitted, indicates a path step that uses an order book between same-named currencies with different issuers. MUST be omitted if the `currency` is XRP. MUST NOT be provided if this step specifies the `account` field. |
| `type`     | Integer                | **DEPRECATED** _(Optional)_ An indicator of which other fields are present. |
| `type_hex` | String                 | **DEPRECATED**: _(Optional)_ A hexadecimal representation of the `type` field. |

In summary, the following combination of fields are valid, optionally with `type`, `type_hex`, or both:

- `account` by itself
- `currency` by itself
- `currency` and `issuer` as long as the `currency` is not XRP
- `issuer` by itself

Any other use of `account`, `currency`, and `issuer` fields in a path step is invalid.

The `type` field, used for the binary serialization of a path set, is actually constructed through bitwise operations on a single integer. The bits are defined as follows:

| Value (Hex) | Value (Decimal) | Description |
|-------------|-----------------|-------------|
| `0x01`      | 1               | A change of address (rippling): the `account` field is present. |
| `0x10`      | 16              | A change of currency: the `currency` field is present. |
| `0x20`      | 32              | A change of issuer: the `issuer` field is present. |


## See Also

- **Concepts:**
    - [Cross-Currency Payments](../../payment-types/cross-currency-payments.md)
    - [Decentralized Exchange](../decentralized-exchange/index.md)
    - [Partial Payments](../../payment-types/partial-payments.md)
- **References:**
    - [Payment transaction][]
    - [path_find method][] (WebSocket only)
    - [ripple_path_find method][]

{% raw-partial file="/_snippets/common-links.md" /%}
