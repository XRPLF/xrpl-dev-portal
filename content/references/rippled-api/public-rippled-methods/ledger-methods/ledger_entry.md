# ledger_entry
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerEntry.cpp "Source")

The `ledger_entry` method returns a single ledger object from the XRP Ledger in its raw format. See [ledger format][] for information on the different types of objects you can retrieve.

## Request Format

This method can retrieve several different types of data. You can select which type of item to retrieve by passing the appropriate parameters, comprised of the general and type-specific fields listed below. Please also keep in mind standard [request formatting](request-formatting.html) (e.g. including an optional `id` with WebSocket calls or the `method` field to name the API method with JSON-RPC calls).

For WebSocket calls `command` will be set to "ledger_entry", and for JSON-RPC calls `method` will be set to "ledger_entry".

{% include '_snippets/no-cli-syntax.md' %}

### General Fields 

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `type`                  | String                     | _(Optional)_ The type of ledger entry to be retrieved. Refer to  [Type Specific Fields](ledger_entry.html#type-specific-fields) below for more details. |
| `binary`                | Boolean                    | _(Optional)_ If true, return the requested ledger object's contents as a hex string. Otherwise, return data in JSON format. The default is `false`. [Updated in: rippled 1.2.0][] |
| `ledger_hash`           | String                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index`          | String or Unsigned Integer | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string (e.g. "validated" or "closed" or "current") to choose a ledger automatically. (See [Specifying Ledgers][]) |



### Type Specific Fields

In addition to the general fields above, you must specify *exactly 1* of the following fields (and associated sub-fields as appropriate). The field name should match the value of the optional `type` field specified above for WebSocket calls. If you specify more than 1 of these type-specific fields (e.g. in `params` of JSON-RPC call), the server will retrieve results for only 1 of them. This is unwanted behavior and should be avoided as the results will not be predictable. 

{% set n = cycler(* range(1,99)) %}

#### {{n.next()}}. Specify Ledger Object

Retrieve any type of ledger object by its unique ID.

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `index`                 | String                     | _(Required if `type` is "index")_ Specify the [object ID](ledger-object-ids.html) of a single object to retrieve from the ledger. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 3,
  "command": "ledger_entry",
  "type": "index",
  "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
    "method": "ledger_entry",
    "params": [
        {
            "type": "index",
            "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05",
            "ledger_index": "validated"
        }
    ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05", "ledger_index": "validated", "type": "index" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry)

**Tip:** Copy the WebSocket example request above before clicking on the "Try It!" button. 



#### {{n.next()}}. Specify Account Root Object

Retrieve an [AccountRoot object](accountroot.html) by its address. This is roughly equivalent to the [account_info method][].

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `account_root`          | String - [Address][]       | _(Required if `type` is "ticket")_ Specify an [AccountRoot object](accountroot.html) to retrieve. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 3,
  "command": "ledger_entry",
  "type": "account_root",
  "account_root": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
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

*Commandline*

```sh
rippled json ledger_entry '{ "account_root": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59", "ledger_index": "validated", "type": "account_root" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry)

**Tip:** Copy the WebSocket example request above before clicking on the "Try It!" button. 



#### {{n.next()}}. Specify Directory Object

Retrieve a [DirectoryNode](directorynode.html), which contains a list of other ledger objects. Can be provided as string (object ID of the Directory) or as an object.

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `directory`             | Object or String           | _(Required if `type` is "ticket")_ Specify a [DirectoryNode](directorynode.html) to retrieve. If a string, must be the [object ID](ledger-object-ids.html) of the directory, as hexadecimal. If an object, requires either `dir_root` or `owner` as a sub-field, plus optionally a `sub_index` sub-field. |
| `directory.sub_index`   | Unsigned Integer           | _(Optional)_ If provided, jumps to a later "page" of the [DirectoryNode](directorynode.html). |
| `directory.dir_root`    | String                     | _(Required if `directory` is specified as an object and `directory.owner` is not provided)_ Unique index identifying the directory to retrieve, as a hex string. |
| `directory.owner`       | String                     | _(Required if `directory` is specified as an object and `directory.dir_root` is not provided)_ Unique address of the account associated with this directory. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 3,
  "command": "ledger_entry",
  "directory": {
    "owner": "rQ3fNyLjbvcDaPNS4EAJY8aT9zR3uGk17c"
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
    "method": "ledger_entry",
    "params": [
        {
            "directory": {
              "owner": "rQ3fNyLjbvcDaPNS4EAJY8aT9zR3uGk17c"
            },
            "ledger_index": "validated",
            "type": "directory"
        }
    ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "directory": { "owner": "rQ3fNyLjbvcDaPNS4EAJY8aT9zR3uGk17c"}, "ledger_index": "validated", "type": "directory" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry)

**Tip:** Copy the WebSocket example request above before clicking on the "Try It!" button. 


#### {{n.next()}}. Specify Offer Object

Retrieve an [Offer object](offer.html), which defines an offer to exchange currency. Can be provided as string (unique index of the Offer) or as an object.

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `offer`                 | Object or String           | _(Required if `type` is "offer")_ Specify an [Offer object](offer.html) to retrieve. If a string, interpret as the [unique index](ledgers.html#tree-format) to the Offer. If an object, requires the sub-fields `account` and `seq` to uniquely identify the offer. |
| `offer.account`         | String - [Address][]       | _(Required if `offer` is specified)_ The account that placed the offer. |
| `offer.seq`             | Unsigned Integer           | _(Required if `offer` is specified)_ The sequence number of the transaction that created the Offer object. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 3,
  "command": "ledger_entry",
  "offer": {
    "account": "rH2k8SkwoWgwry9J89jgFP9NbSWu13jnsu",
    "seq": 6134107
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
    "method": "ledger_entry",
    "params": [
      {
        "offer": {
          "account": "rH2k8SkwoWgwry9J89jgFP9NbSWu13jnsu",
          "seq": 6134107
        },
        "ledger_index": "validated"
      }
  ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "offer": { "account": "rH2k8SkwoWgwry9J89jgFP9NbSWu13jnsu", "seq": 6134107}, "ledger_index": "validated", "type": "offer" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry)

**Tip:** Copy the WebSocket example request above before clicking on the "Try It!" button. 


#### {{n.next()}}. Specify RippleState Object

Retrieve a [RippleState object](ripplestate.html), which tracks a (non-XRP) currency balance between two accounts.

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `ripple_state`          | Object                     | _(Required if `type` is "ticket")_ Object specifying the RippleState (trust line) object to retrieve. The `accounts` and `currency` sub-fields are required to uniquely specify the RippleState entry to retrieve. |
| `ripple_state.accounts` | Array                      | _(Required if `ripple_state` is specified)_ 2-length array of account [Address][]es, defining the two accounts linked by this [RippleState object](ripplestate.html). |
| `ripple_state.currency` | String                     | _(Required if `ripple_state` is specified)_ [Currency Code][] of the [RippleState object](ripplestate.html) to retrieve. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 3,
  "command": "ledger_entry",
  "ripple_state": {
    "accounts": ["rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"],
    "currency": "USD"
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
    "method": "ledger_entry",
    "params": [
        {
            "ripple_state": {
              "accounts": ["rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"],
              "currency": "USD"
            },
            "ledger_index": "validated",
            "type": "ripple_state"
        }
    ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "ripple_state": { "accounts": ["rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"], "currency": "USD"}, "ledger_index": "validated", "type": "ripple_state" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry)

**Tip:** Copy the WebSocket example request above before clicking on the "Try It!" button. 


#### {{n.next()}}. Specify Check Object

Retrieve a [Check object](check.html), which is a potential payment that can be cashed by its recipient. [New in: rippled 1.0.0][]

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `check`                 | String                     | _(Required if `type` is "check")_ Specify the [object ID](ledger-object-ids.html) of a [Check object](check.html) to retrieve. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 3,
  "command": "ledger_entry",
  "type": "check",
  "check": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
    "method": "ledger_entry",
    "params": [
        {
            "type": "check",
            "check": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
            "ledger_index": "validated"
        }
    ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "check": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo", "ledger_index": "validated", "type": "check" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry)

**Tip:** Copy the WebSocket example request above before clicking on the "Try It!" button. 


#### {{n.next()}}. Specify Escrow Object

Retrieve an [Escrow object](escrow-object.html), which holds XRP until a specific time or condition is met. Can be provided as string (object ID of the Escrow) or as an object. [New in: rippled 1.0.0][]

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `escrow`                | Object or String           | _(Required if `type` is "ticket")_ Specify an [Escrow object](escrow-object.html) to retrieve. If a string, must be the [object ID](ledger-object-ids.html) of the Escrow, as hexadecimal. If an object, requires `owner` and `seq` sub-fields. |
| `escrow.owner`          | String - [Address][]       | _(Required if `escrow` is specified as an object)_ The owner (sender) of the Escrow object. |
| `escrow.seq`            | Unsigned Integer           | _(Required if `escrow` is specified as an object)_ The sequence number of the transaction that created the Escrow object. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 3,
  "command": "ledger_entry",
  "type": "escrow",
  "escrow": {
    "account": "rH2k8SkwoWgwry9J89jgFP9NbSWu13jnsu",
    "seq": 6134107
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
    "method": "ledger_entry",
    "params": [
        {
            "escrow": {
              "account": "rH2k8SkwoWgwry9J89jgFP9NbSWu13jnsu",
              "seq": 6134107
            },
            "ledger_index": "validated",
            "type": "escrow"
        }
    ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "escrow": { "account": "rH2k8SkwoWgwry9J89jgFP9NbSWu13jnsu", "seq": 6134107 }, "ledger_index": "validated", "type": "escrow" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry)

**Tip:** Copy the WebSocket example request above before clicking on the "Try It!" button. 


#### {{n.next()}}. Specify PayChannel Object

Retrieve a [PayChannel object](paychannel.html), which holds XRP for asynchronous payments. [New in: rippled 1.0.0][]

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `payment_channel`       | String                     | _(Required if `type` is "payment_channel")_ Specify the [object ID](ledger-object-ids.html) of a [PayChannel object](paychannel.html) to retrieve. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 3,
  "command": "ledger_entry",
  "type": "payment_channel",
  "payment_channel": "rJ8x2MTstFJRWfMXyatcXYuB1TXQMeHtP2",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
    "method": "ledger_entry",
    "params": [
        {
            "payment_channel": "rJ8x2MTstFJRWfMXyatcXYuB1TXQMeHtP2",
            "ledger_index": "validated",
            "type": "payment_channel"
        }
    ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "payment_channel": "rJ8x2MTstFJRWfMXyatcXYuB1TXQMeHtP2", "ledger_index": "validated", "type": "payment_channel" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry)

**Tip:** Copy the WebSocket example request above before clicking on the "Try It!" button. ALSO PLEASE NOTE THAT YOU WILL NEED TO CHANGE CONNECTION SETTINGS TO "TESTNET PUBLIC CLUSTER"  


#### {{n.next()}}. Specify DepositPreauth Object

Retrieve a [DepositPreauth object](depositpreauth-object.html), which tracks preauthorization for payments to accounts requiring [Deposit Authorization](depositauth.html). Can be provided as string (object ID of the DepositPreauth) or as an object. [New in: rippled 1.1.0][]

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `deposit_preauth`       | Object or String           | _(Required if `type` is "ticket")_ Specify a [DepositPreauth object](depositpreauth-object.html) to retrieve. If a string, must be the [object ID](ledger-object-ids.html) of the DepositPreauth object, as hexadecimal. If an object, requires `owner` and `authorized` sub-fields. |
| `deposit_preauth.owner` | String - [Address][]       | _(Required if `deposit_preauth` is specified as an object)_ The account that provided the preauthorization. |
| `deposit_preauth.authorized` | String - [Address][]  | _(Required if `deposit_preauth` is specified as an object)_ The account that received the preauthorization. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 3,
  "command": "ledger_entry",
  "type": "deposit_preauth",
  "deposit_preauth": {
    "owner": "rPRVdmDUwV4q5FTpwPijLQuzJ4WjDbgNrE",
    "authorized": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
    "method": "ledger_entry",
    "params": [
        {
            "deposit_preauth": {
              "owner": "rPRVdmDUwV4q5FTpwPijLQuzJ4WjDbgNrE",
              "authorized": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
            },
            "ledger_index": "validated",
            "type": "deposit_preauth"
        }
    ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "deposit_preauth": { "owner": "rPRVdmDUwV4q5FTpwPijLQuzJ4WjDbgNrE", "authorized": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe" }, "ledger_index": "validated", "type": "deposit_preauth" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry)

**Tip:** Copy the WebSocket example request above before clicking on the "Try It!" button. ALSO PLEASE NOTE THAT YOU WILL NEED TO CHANGE CONNECTION SETTINGS TO "TESTNET PUBLIC CLUSTER"  


#### {{n.next()}}. Specify Ticket Object

Retrieve a [Ticket object](ticket.html), which records a [sequence number][] set aside for future use. Can be provided as string (object ID of the Ticket) or as an object. _(Requires the [TicketBatch amendment][])_

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `ticket`                | Object or String           | _(Required if `type` is "ticket")_ The [Ticket object](ticket.html) to retrieve. If a string, must be the [object ID](ledger-object-ids.html) of the Ticket, as hexadecimal. If an object, the `owner` and `ticket_sequence` sub-fields are required to uniquely specify the Ticket entry. |
| `ticket.owner`          | String - [Address][]       | _(Required if `ticket` is specified as an object)_ The owner of the Ticket object. |
| `ticket.ticket_sequence` | Unsigned Integer          | _(Required if `ticket` is specified as an object)_ The Ticket Sequence number of the Ticket entry to retrieve. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 3,
  "command": "ledger_entry",
  "type": "ticket",
  "ticket": {
    "owner": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "ticket_sequence: 23
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
    "method": "ledger_entry",
    "params": [
        {
          "type": "ticket",
          "ticket": {
            "owner": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "ticket_sequence: 23
          },
          "ledger_index": "validated"
        }
    ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "ticket": { "owner": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59", "ticket_sequence: 23 }, "ledger_index": "validated", "type": "ticket" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry)

**Tip:** Copy the WebSocket example request above before clicking on the "Try It!" button. 


#### Deprecated Parameters

**Note:** The `generator` and `ledger` parameters are deprecated and may be removed without further notice.


## Response Format

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`        | Type             | Description                              |
|:---------------|:-----------------|:-----------------------------------------|
| `index`        | String           | The unique ID of this [ledger object](ledger-object-types.html). |
| `ledger_index` | Unsigned Integer | The [ledger index][] of the ledger that was used when retrieving this data. |
| `node`         | Object           | _(Omitted if `"binary": true` specified.)_ Object containing the data of this ledger object, according to the [ledger format][]. |
| `node_binary`  | String           | _(Omitted unless `"binary":true` specified)_ The [binary representation](serialization.html) of the ledger object, as hexadecimal. |

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
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

```json
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

*Commandline*
```json
{
   "result" : {
      "index" : "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05",
      "ledger_hash" : "F434A8F21E401F84A2CDEDFDF801E6F3FC8B2567C6841818E684BEE019460179",
      "ledger_index" : 56866309,
      "node" : {
         "Account" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
         "Balance" : "13315612685",
         "Flags" : 0,
         "LedgerEntryType" : "AccountRoot",
         "OwnerCount" : 17,
         "PreviousTxnID" : "D2FA1C28EF87E53029327AA832C378674B3ACA0551CF9EA1F65BB8CA34913FAB",
         "PreviousTxnLgrSeq" : 55180009,
         "Sequence" : 1406,
         "index" : "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
      },
      "status" : "success",
      "validated" : true
   }
}
```

<!-- MULTICODE_BLOCK_END -->


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
