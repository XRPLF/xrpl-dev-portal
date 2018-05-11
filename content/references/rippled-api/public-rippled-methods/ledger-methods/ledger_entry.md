# ledger_entry
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerEntry.cpp "Source")

The `ledger_entry` method returns a single ledger object from the XRP Ledger in its raw format. See [ledger format][] for information on the different types of objects you can retrieve.

**Note:** There is no commandline version of this method. You can use the [`json` command](#json) to access this method from the commandline instead.

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
2. `account_root` - Retrieve an [AccountRoot object](accountroot.html). This is roughly equivalent to the [account_info](#account-info) command.
3. `directory` - Retrieve a [DirectoryNode](directorynode.html), which contains a list of other ledger objects
4. `offer` - Retrieve an [Offer object](offer.html), which defines an offer to exchange currency
5. `ripple_state` - Retrieve a [RippleState object](ripplestate.html), which tracks a (non-XRP) currency balance between two accounts.

If you specify more than one of the above items, the server retrieves only of them; it is undefined which it chooses.

The full list of parameters recognized by this method is as follows:

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `index`                 | String                     | _(Optional)_ Specify the unique identifier of a single ledger entry to retrieve. |
| `account_root`          | String - [Address][]       | _(Optional)_ Specify an [AccountRoot object](accountroot.html) to retrieve. |
| `directory`             | Object or String           | _(Optional)_ Specify a [DirectoryNode](directorynode.html). (DirectoryNode objects each contain a list of IDs for things contained in them.) If a string, interpret as the [unique index](ledger-data-formats.html#tree-format) to the directory, in hex. If an object, requires either `dir_root` or `owner` as a sub-field, plus optionally a `sub_index` sub-field. |
| `directory.sub_index`   | Unsigned Integer           | _(Optional)_ If provided, jumps to a later "page" of the [Directory](directorynode.html). |
| `directory.dir_root`    | String                     | (Required if `directory` is specified as an object and `directory.owner` is not provided) Unique index identifying the directory to retrieve, as a hex string. |
| `directory.owner`       | String                     | (Required if `directory` is specified as an object and `directory.dir_root` is not provided) Unique address of the account associated with this directory |
| `offer`                 | Object or String           | _(Optional)_ Specify an [Offer object](offer.html) to retrieve. If a string, interpret as the [unique index](ledger-data-formats.html#tree-format) to the Offer. If an object, requires the sub-fields `account` and `seq` to uniquely identify the offer. |
| `offer.account`         | String - [Address][]       | (Required if `offer` specified) The account that placed the offer. |
| `offer.seq`             | Unsigned Integer           | (Required if `offer` specified) The sequence number of the transaction that created the Offer object. |
| `ripple_state`          | Object                     | _(Optional)_ Object specifying the RippleState (trust line) object to retrieve. The `accounts` and `currency` sub-fields are required to uniquely specify the RippleState entry to retrieve. |
| `ripple_state.accounts` | Array                      | (Required if `ripple_state` specified) 2-length array of account [Address][]es, defining the two accounts linked by this [RippleState object](ripplestate.html) |
| `ripple_state.currency` | String                     | (Required if `ripple_state` specified) [Currency Code][] of the [RippleState object](ripplestate.html) to retrieve. |
| `binary`                | Boolean                    | _(Optional)_ If true, return the requested ledger object's contents as a hex string. Otherwise, return data in JSON format. The default is `true` if searching by `index` and `false` otherwise. |
| `ledger_hash`           | String                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index`          | String or Unsigned Integer | _(Optional)_ The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |

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
| `index`        | String           | Unique identifying key for this ledger_entry |
| `ledger_index` | Unsigned Integer | Unique sequence number of the ledger from which this data was retrieved |
| `node`         | Object           | (Omitted if `"binary": true` specified.) Object containing the data of this ledger object, according to the [ledger format][]. |
| `node_binary`  | String           | (Omitted unless `"binary":true` specified) Binary data of the ledger object, as hex. |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.


<!-- TODO: we should add this ledger format link to rippled-api-links.md. account_objects.md is also including this as a one-off.-->
[ledger format]: reference-ledger-format.html
{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
