# ledger_entry
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerEntry.cpp "Source")

The `ledger_entry` method returns a single ledger object from the XRP Ledger in its raw format. See [ledger format][] for information on the different types of objects you can retrieve.

**Note:** There is no commandline version of this method. You can use the [json method][] to access this method from the commandline instead.

## Request Format

An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 3,
  "command": "ledger_entry",
  "type": "account_root",
  "account_root": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```
{
    "method": "ledger_entry",
    "params": [
        {
            "account_root": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "ledger_index": "validated",
            "type": "account_root"
        }
    ]
}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry)

This method can retrieve several different types of data. You can select which type of item to retrieve by passing the appropriate parameters. Specifically, you should provide exactly one of the following fields:

1. `index` - Retrieve any type of ledger object by its unique ID
2. `account_root` - Retrieve an [AccountRoot object](accountroot.html). This is roughly equivalent to the [account_info method][].
3. `directory` - Retrieve a [DirectoryNode](directorynode.html), which contains a list of other ledger objects.
4. `offer` - Retrieve an [Offer object](offer.html), which defines an offer to exchange currency.
5. `ripple_state` - Retrieve a [RippleState object](ripplestate.html), which tracks a (non-XRP) currency balance between two accounts.
6. `check` - Retrieve a [Check object](check.html), which is a potential payment that can be cashed by its recipient. [New in: rippled 1.0.0][]
7. `escrow` - Retrieve an [Escrow object](escrow-object.html), which holds XRP until a specific time or condition is met. [New in: rippled 1.0.0][]
8. `payment_channel` - Retrieve a [PayChannel object](paychannel.html), which holds XRP for asynchronous payments. [New in: rippled 1.0.0][]
9. `deposit_preauth` - Retrieve a [DepositPreauth object](depositpreauth-object.html), which tracks preauthorization for payments to accounts requiring [Deposit Authorization](depositauth.html). [New in: rippled 1.1.0][]

If you specify more than one of the above items, the server retrieves only one of them; it is undefined which it chooses.

The full list of parameters recognized by this method is as follows:

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `index`                 | String                     | _(Optional)_ Specify the [object ID](ledger-object-ids.html) of a single object to retrieve from the ledger. |
| `account_root`          | String - [Address][]       | _(Optional)_ Specify an [AccountRoot object](accountroot.html) to retrieve. |
| `check`                 | String                     | _(Optional)_ Specify the [object ID](ledger-object-ids.html) of a [Check object](check.html) to retrieve. |
| `deposit_preauth`       | Object or String           | _(Optional)_ Specify a [DepositPreauth object](depositpreauth-object.html) to retrieve. If a string, must be the [object ID](ledger-object-ids.html) of the DepositPreauth object, as hexadecimal. If an object, requires `owner` and `authorized` sub-fields. |
| `deposit_preauth.owner` | String - [Address][]       | _(Required if `deposit_preauth` is specified as an object)_ The account that provided the preauthorization. |
| `deposit_preauth.authorized` | String - [Address][]  | _(Required if `deposit_preauth` is specified as an object)_ The account that received the preauthorization. |
| `directory`             | Object or String           | _(Optional)_ Specify a [DirectoryNode](directorynode.html) to retrieve. If a string, must be the [object ID](ledger-object-ids.html) of the directory, as hexadecimal. If an object, requires either `dir_root` or `owner` as a sub-field, plus optionally a `sub_index` sub-field. |
| `directory.sub_index`   | Unsigned Integer           | _(Optional)_ If provided, jumps to a later "page" of the [DirectoryNode](directorynode.html). |
| `directory.dir_root`    | String                     | _(Required if `directory` is specified as an object and `directory.owner` is not provided)_ Unique index identifying the directory to retrieve, as a hex string. |
| `directory.owner`       | String                     | _(Required if `directory` is specified as an object and `directory.dir_root` is not provided)_ Unique address of the account associated with this directory. |
| `escrow` | Object or String | _(Optional)_ Specify an [Escrow object](escrow-object.html) to retrieve. If a string, must be the [object ID](ledger-object-ids.html) of the Escrow, as hexadecimal. If an object, requires `owner` and `seq` sub-fields. |
| `escrow.owner` | String - [Address][] | _(Required if `escrow` is specified as an object)_ The owner (sender) of the Escrow object. |
| `escrow.seq` | Unsigned Integer | _(Required if `escrow` is specified as an object)_ The sequence number of the transaction that created the Escrow object. |
| `offer`                 | Object or String           | _(Optional)_ Specify an [Offer object](offer.html) to retrieve. If a string, interpret as the [unique index](ledgers.html#tree-format) to the Offer. If an object, requires the sub-fields `account` and `seq` to uniquely identify the offer. |
| `offer.account`         | String - [Address][]       | _(Required if `offer` is specified)_ The account that placed the offer. |
| `offer.seq`             | Unsigned Integer           | _(Required if `offer` is specified)_ The sequence number of the transaction that created the Offer object. |
| `payment_channel` | String | _(Optional)_ Specify the [object ID](ledger-object-ids.html) of a [PayChannel object](paychannel.html) to retrieve. |
| `ripple_state`          | Object                     | _(Optional)_ Object specifying the RippleState (trust line) object to retrieve. The `accounts` and `currency` sub-fields are required to uniquely specify the RippleState entry to retrieve. |
| `ripple_state.accounts` | Array                      | _(Required if `ripple_state` is specified)_ 2-length array of account [Address][]es, defining the two accounts linked by this [RippleState object](ripplestate.html). |
| `ripple_state.currency` | String                     | _(Required if `ripple_state` is specified)_ [Currency Code][] of the [RippleState object](ripplestate.html) to retrieve. |
| `binary`                | Boolean                    | _(Optional)_ If true, return the requested ledger object's contents as a hex string. Otherwise, return data in JSON format. The default is `false`. [Updated in: rippled 1.2.0][] |
| `ledger_hash`           | String                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index`          | String or Unsigned Integer | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |

The `generator` and `ledger` parameters are deprecated and may be removed without further notice.

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```{
    "id": 3,
    "result": {
        "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05",
        "ledger_index": 6889347,
        "node": {
            "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "Balance": "27389517749",
            "Flags": 0,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 18,
            "PreviousTxnID": "B6B410172C0B65575D89E464AF5B99937CC568822929ABF87DA75CBD11911932",
            "PreviousTxnLgrSeq": 6592159,
            "Sequence": 1400,
            "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
        }
    },
    "status": "success",
    "type": "response"
}
```

*JSON-RPC*

```
200 OK
{
    "result": {
        "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05",
        "ledger_index": 8696234,
        "node": {
            "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "Balance": "13176802787",
            "Flags": 0,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 17,
            "PreviousTxnID": "E5D0235A236F7CD162C1AB87A0325056AE61CFC63D92D1494AB5D826AAD0CDCA",
            "PreviousTxnLgrSeq": 8554742,
            "Sequence": 1406,
            "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
        },
        "status": "success",
        "validated": true
    }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`        | Type             | Description                              |
|:---------------|:-----------------|:-----------------------------------------|
| `index`        | String           | The unique ID of this [ledger object](ledger-object-types.html). |
| `ledger_index` | Unsigned Integer | The [ledger index][] of the ledger that was used when retrieving this data. |
| `node`         | Object           | _(Omitted if `"binary": true` specified.)_ Object containing the data of this ledger object, according to the [ledger format][]. |
| `node_binary`  | String           | _(Omitted unless `"binary":true` specified)_ The [binary representation](serialization.html) of the ledger object, as hexadecimal. |

## Possible Errors

* Any of the [universal error types][].
* `deprecatedFeature` - The request specified a removed field, such as `generator`.
* `entryNotFound` - The requested ledger object does not exist in the ledger.
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `malformedAddress` - The request improperly specified an [Address][] field.
* `malformedCurrency` - The request improperly specified a [Currency Code][] field.
* `malformedOwner` - The request improperly specified the `escrow.owner` sub-field.
* `malformedRequest` - The request provided an invalid combination of fields, or provided the wrong type for one or more fields.
* `unknownOption` - The fields provided in the request did not match any of the expected request formats.



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
