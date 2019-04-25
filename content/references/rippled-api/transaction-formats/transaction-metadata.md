# Transaction Metadata

Transaction metadata is a section of data that gets added to a transaction after it is processed. Any transaction that gets included in a ledger has metadata, regardless of whether it is successful. The transaction metadata describes the outcome of the transaction in detail.

**Warning:** The changes described in transaction metadata are only final if the transaction is in a validated ledger version.

Some fields that may appear in transaction metadata include:

{% include '_snippets/tx-metadata-field-table.md' %} <!--_ -->

## Example Metadata

The following JSON object shows the metadata for [a complex cross-currency payment](https://xrpcharts.ripple.com/#/transactions/8C55AFC2A2AA42B5CE624AEECDB3ACFDD1E5379D4E5BF74A8460C5E97EF8706B):

```json
{% include '_code-samples/metadata/cross-currency-payment.json' %}
```

## AffectedNodes

The `AffectedNodes` array contains a complete list of the [objects in the ledger](ledger-object-types.html) that this transaction modified in some way. Each entry in this array is an object with one top-level field indicating what type it is:

- `CreatedNode` indicates that the transaction created a new object in the ledger.
- `DeletedNode` indicates that the transaction removed an object from the ledger.
- `ModifiedNode` indicates that the transaction modified an existing object in the ledger.

The value of each of these fields is a JSON object describing the changes made to the ledger object.

### CreatedNode Fields

A `CreatedNode` object contains the following fields:

| Field             | Value             | Description                          |
|:------------------|:------------------|:-------------------------------------|
| `LedgerEntryType` | String            | The [type of ledger object](ledger-object-types.html) that was created. |
| `LedgerIndex`     | String - [Hash][] | The [ID of this ledger object](ledger-object-ids.html) in the ledger's [state tree](ledgers.html). **Note:** This is **not the same** as a [ledger index](basic-data-types.html#ledger-index), even though the field name is very similar. |
| `NewFields`       | Object            | The content fields of the newly-created ledger object. Which fields are present depends on what type of ledger object was created. |

### DeletedNode Fields

A `DeletedNode` object contains the following fields:

| Field             | Value             | Description                          |
|:------------------|:------------------|:-------------------------------------|
| `LedgerEntryType` | String            | The [type of ledger object](ledger-object-types.html) that was deleted. |
| `LedgerIndex`     | String - [Hash][] | The [ID of this ledger object](ledger-object-ids.html) in the ledger's [state tree](ledgers.html). **Note:** This is **not the same** as a [ledger index](basic-data-types.html#ledger-index), even though the field name is very similar. |
| `FinalFields`     | Object            | The content fields of the ledger object just before it was deleted. Which fields are present depends on what type of ledger object was created. |

### ModifiedNode Fields

A `ModifiedNode` object contains the following fields:

| Field               | Value                     | Description                |
|:--------------------|:--------------------------|:---------------------------|
| `LedgerEntryType`   | String                    | The [type of ledger object](ledger-object-types.html) that was deleted. |
| `LedgerIndex`       | String - [Hash][]         | The [ID of this ledger object](ledger-object-ids.html) in the ledger's [state tree](ledgers.html). **Note:** This is **not the same** as a [ledger index](basic-data-types.html#ledger-index), even though the field name is very similar. |
| `FinalFields`       | Object                    | The content fields of the ledger object after applying any changes from this transaction. Which fields are present depends on what type of ledger object was created. This omits the `PreviousTxnID` and `PreviousTxnLgrSeq` fields, even though most types of ledger objects have them. |
| `PreviousFields`    | Object                    | The previous values for all fields of the object that were changed as a result of this transaction. If the transaction _only added_ fields to the object, this field is an empty object. |
| `PreviousTxnID`     | String - [Hash][]         | _(May be omitted)_ The [identifying hash][] of the previous transaction to modify this ledger object. Omitted for ledger object types that do not have a `PreviousTxnID` field. |
| `PreviousTxnLgrSeq` | Number - [Ledger Index][] | _(May be omitted)_  The [Ledger Index][] of the ledger version containing the previous transaction to modify this ledger object. Omitted for ledger object types that do not have a `PreviousTxnLgrSeq` field. |

**Note:** If the modified ledger object has `PreviousTxnID` and `PreviousTxnLgrSeq` fields, the transaction always updates them with the transaction's own identifying hash and the index of the ledger version that included the transaction, but these fields' new value is not listed in the `FinalFields` of the `ModifiedNode` object, and their previous values are listed at the top level of the `ModifiedNode` object rather than in the nested `PreviousFields` object.


## delivered_amount

The `Amount` of a [Payment transaction][] indicates the amount to deliver to the `Destination`, so if the transaction was successful, then the destination received that much -- **except if the transaction was a [partial payment](partial-payments.html)**. (In that case, any positive amount up to `Amount` might have arrived.) Rather than choosing whether or not to trust the `Amount` field, you should use the `delivered_amount` field of the metadata to see how much actually reached its destination.

The `rippled` server provides a `delivered_amount` field in JSON transaction metadata for all successful Payment transactions. This field is formatted like a normal currency amount. However, the delivered amount is not available for transactions that meet both of the following criteria:

* Is a partial payment
* Included in a validated ledger before 2014-01-20

If both conditions are true, then `delivered_amount` contains the string value `unavailable` instead of an actual amount. If this happens, you can only figure out the actual delivered amount by reading the AffectedNodes in the transaction's metadata.

**Note:** The `delivered_amount` field is generated on-demand for the request, and is not included in the binary format for transaction metadata, nor is it used when calculating the [hash](basic-data-types.html#hashes) of the transaction metadata. In contrast, the `DeliveredAmount` field _is_ included in the binary format for partial payment transactions after 2014-01-20.

See also: [Partial Payments](partial-payments.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
