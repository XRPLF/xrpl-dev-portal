# Transaction Metadata

Transaction metadata is a section of data that gets added to a transaction after it is processed. Any transaction that gets included in a ledger has metadata, regardless of whether it is successful. The transaction metadata describes the outcome of the transaction in detail.

**Warning:** The changes described in transaction metadata are only final if the transaction is in a validated ledger version.

Some fields that may appear in transaction metadata include:

| Field                                 | Value               | Description    |
|:--------------------------------------|:--------------------|:---------------|
| `AffectedNodes`                       | Array               | List of [ledger objects](ledger-object-types.html) that were created, deleted, or modified by this transaction, and specific changes to each. |
| `DeliveredAmount`                     | [Currency Amount][] | **DEPRECATED.** Replaced by `delivered_amount`. Omitted if not a partial payment. |
| `TransactionIndex`                    | Unsigned Integer    | The transaction's position within the ledger that included it. (For example, the value `2` means it was the 2nd transaction in that ledger.) |
| `TransactionResult`                   | String              | A [result code](transaction-results.html) indicating whether the transaction succeeded or how it failed. |
| [`delivered_amount`](#delivered-amount) | [Currency Amount][] | The [Currency Amount][] actually received by the `Destination` account. Use this field to determine how much was delivered, regardless of whether the transaction is a [partial payment](partial-payments.html). [New in: rippled 0.27.0][] |

## delivered_amount

The `Amount` of a [Payment transaction][] indicates the amount to deliver to the `Destination`, so if the transaction was successful, then the destination received that much -- **except if the transaction was a [partial payment](partial-payments.html)**. (In that case, any positive amount up to `Amount` might have arrived.) Rather than choosing whether or not to trust the `Amount` field, you should use the `delivered_amount` field of the metadata to see how much actually reached its destination.

The `delivered_amount` field of transaction metadata is included in all successful Payment transactions, and is formatted like a normal currency amount. However, the delivered amount is not available for transactions that meet both of the following criteria:

* Is a partial payment
* Included in a validated ledger before 2014-01-20

If both conditions are true, then `delivered_amount` contains the string value `unavailable` instead of an actual amount. If this happens, you can only figure out the actual delivered amount by reading the AffectedNodes in the transaction's metadata.

See also: [Partial Payments](partial-payments.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
