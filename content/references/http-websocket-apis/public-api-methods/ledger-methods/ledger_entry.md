---
html: ledger_entry.html
parent: ledger-methods.html
blurb: Get one element from a ledger version.
labels:
  - Blockchain
  - Data Retention
---
# ledger_entry
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerEntry.cpp "Source")

The `ledger_entry` method returns a single ledger object from the XRP Ledger in its raw format. See [ledger format][] for information on the different types of objects you can retrieve.

## Request Format

This method can retrieve several different types of data. You can select which type of item to retrieve by passing the appropriate parameters, comprised of the general and type-specific fields listed below, and following the standard [request formatting](request-formatting.html). (For example, a WebSocket request always has the `command` field and optionally an `id` field, and a JSON-RPC request uses the `method` and `params` fields.)

{% include '_snippets/no-cli-syntax.md' %}

### General Fields

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `binary`                | Boolean                    | _(Optional)_ If `true`, return the requested ledger object's contents as a hex string in the XRP Ledger's [binary format](serialization.html). Otherwise, return data in JSON format. The default is `false`. [Updated in: rippled 1.2.0][] |
| `ledger_hash`           | String                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index`          | String or Unsigned Integer | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string (e.g. "validated" or "closed" or "current") to choose a ledger automatically. (See [Specifying Ledgers][]) |

The `generator` and `ledger` parameters are deprecated and may be removed without further notice.

In addition to the general fields above, you must specify *exactly 1* of the following fields to indicate what type of object to retrieve, along with its sub-fields as appropriate. The valid fields are:

- [`index`](#get-ledger-object-by-id)
- [`account_root`](#get-accountroot-object)
- [`directory`](#get-directorynode-object)
- [`offer`](#get-offer-object)
- [`ripple_state`](#get-ripplestate-object)
- [`check`](#get-check-object)
- [`escrow`](#get-escrow-object)
- [`payment_channel`](#get-paychannel-object)
- [`deposit_preauth`](#get-depositpreauth-object)
- [`ticket`](#get-ticket-object)
- [`bridge`](#get-bridge-object)
- [`xchain_claim_id`](#get-xchain-claim-id-object)
- [`xchain_create_account_claim_id`](#get-xchain-create-account-claim-id-object)

**Caution:** If you specify more than 1 of these type-specific fields in a request, the server retrieves results for only 1 of them. It is not defined which one the server chooses, so you should avoid doing this.


### Get Ledger Object by ID

Retrieve any type of ledger object by its unique ID.

| `Field` | Type   | Description                                               |
|:--------|:-------|:----------------------------------------------------------|
| `index` | String | The [object ID](ledger-object-ids.html) of a single object to retrieve from the ledger, as a 64-character (256-bit) hexadecimal string. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "command": "ledger_entry",
  "index": "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
    "method": "ledger_entry",
    "params": [
        {
            "index": "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4",
            "ledger_index": "validated"
        }
    ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "index": "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4", "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry-by-object-id)

> **Tip:** You can use this type of request to get any singleton object, if it exists in the ledger data, because its ID is always the same. For example:
>
> - [`Amendments`](amendments-object.html) - `7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4`
> - [`FeeSettings`](feesettings.html) - `4BC50C9B0D8515D3EAAE1E74B29A95804346C491EE1A95BF25E4AAB854A6A651`
> - [Recent History `LedgerHashes`](ledgerhashes.html) - `B4979A36CDC7F3D3D5C31A4EAE2AC7D7209DDA877588B9AFC66799692AB0D66B`
> - [`NegativeUNL`](negativeunl.html) - `2E8A59AA9D3B5B186B0B9E0F62E6C02587CA74A4D778938E957B6357D364B244`



### Get AccountRoot Object

Retrieve an [AccountRoot object](accountroot.html) by its address. This is roughly equivalent to the [account_info method][].

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `account_root`          | String - [Address][]       | The classic address of the [AccountRoot object](accountroot.html) to retrieve. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_accountroot",
  "command": "ledger_entry",
  "account_root": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
    "method": "ledger_entry",
    "params": [
        {
            "account_root": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "ledger_index": "validated"
        }
    ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "account_root": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59", "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry-accountroot)




### Get DirectoryNode Object

Retrieve a [DirectoryNode](directorynode.html), which contains a list of other ledger objects. Can be provided as string (object ID of the Directory) or as an object.

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `directory`             | Object or String           | The [DirectoryNode](directorynode.html) to retrieve. If a string, must be the [object ID](ledger-object-ids.html) of the directory, as hexadecimal. If an object, requires either `dir_root` or `owner` as a sub-field, plus optionally a `sub_index` sub-field. |
| `directory.sub_index`   | Unsigned Integer           | _(Optional)_ If provided, jumps to a later "page" of the [DirectoryNode](directorynode.html). |
| `directory.dir_root`    | String                     | _(Optional)_ Unique index identifying the directory to retrieve, as a hex string. |
| `directory.owner`       | String                     | _(Optional)_ Unique address of the account associated with this directory. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 3,
  "command": "ledger_entry",
  "directory": {
    "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "sub_index": 0
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
              "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
              "sub_index": 0
            },
            "ledger_index": "validated"
        }
    ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "directory": { "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "sub_index": 0 }, "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry-directorynode)



### Get Offer Object

Retrieve an [Offer object](offer.html), which defines an offer to exchange currency. Can be provided as string (unique index of the Offer) or as an object.

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `offer`                 | Object or String           | The [Offer object](offer.html) to retrieve. If a string, interpret as the [unique object ID](ledgers.html#tree-format) to the Offer. If an object, requires the sub-fields `account` and `seq` to uniquely identify the offer. |
| `offer.account`         | String - [Address][]       | _(Required if `offer` is specified as an object)_ The account that placed the offer. |
| `offer.seq`             | Unsigned Integer           | _(Required if `offer` is specified as an object)_ The [Sequence Number][] of the transaction that created the Offer object. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_offer",
  "command": "ledger_entry",
  "offer": {
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "seq": 359
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
        "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "seq": 359
      },
      "ledger_index": "validated"
    }
  ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "offer": { "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "seq": 359}, "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry-offer)



### Get RippleState Object

Retrieve a [RippleState object](ripplestate.html), which tracks a (non-XRP) currency balance between two accounts.

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `ripple_state`          | Object                     | Object specifying the RippleState (trust line) object to retrieve. The `accounts` and `currency` sub-fields are required to uniquely specify the RippleState entry to retrieve. |
| `ripple_state.accounts` | Array                      | _(Required if `ripple_state` is specified)_ 2-length array of account [Address][]es, defining the two accounts linked by this [RippleState object](ripplestate.html). |
| `ripple_state.currency` | String                     | _(Required if `ripple_state` is specified)_ [Currency Code][] of the [RippleState object](ripplestate.html) to retrieve. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_ripplestate",
  "command": "ledger_entry",
  "ripple_state": {
    "accounts": [
      "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"
    ],
    "currency": "USD"
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
    "ripple_state": {
      "accounts": [
        "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"
      ],
      "currency": "USD"
    },
    "ledger_index": "validated"
  }]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "ripple_state": { "accounts": ["rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"], "currency": "USD"}, "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry-ripplestate)



### Get Check Object

Retrieve a [Check object](check.html), which is a potential payment that can be cashed by its recipient. [New in: rippled 1.0.0][]

| `Field` | Type   | Description                                               |
|:--------|:-------|:----------------------------------------------------------|
| `check` | String | The [object ID](ledger-object-ids.html) of a [Check object](check.html) to retrieve. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_check",
  "command": "ledger_entry",
  "check": "C4A46CCD8F096E994C4B0DEAB6CE98E722FC17D7944C28B95127C2659C47CBEB",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
    "check": "C4A46CCD8F096E994C4B0DEAB6CE98E722FC17D7944C28B95127C2659C47CBEB",
    "ledger_index": "validated"
  }]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "check": "C4A46CCD8F096E994C4B0DEAB6CE98E722FC17D7944C28B95127C2659C47CBEB", "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry-check)



### Get Escrow Object

Retrieve an [Escrow object](escrow-object.html), which holds XRP until a specific time or condition is met. Can be provided as string (object ID of the Escrow) or as an object. [New in: rippled 1.0.0][]

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `escrow`                | Object or String           | The [Escrow object](escrow-object.html) to retrieve. If a string, must be the [object ID](ledger-object-ids.html) of the Escrow, as hexadecimal. If an object, requires `owner` and `seq` sub-fields. |
| `escrow.owner`          | String - [Address][]       | _(Required if `escrow` is specified as an object)_ The owner (sender) of the Escrow object. |
| `escrow.seq`            | Unsigned Integer           | _(Required if `escrow` is specified as an object)_ The [Sequence Number][] of the transaction that created the Escrow object. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_escrow",
  "command": "ledger_entry",
  "escrow": {
    "owner": "rL4fPHi2FWGwRGRQSH7gBcxkuo2b9NTjKK",
    "seq": 126
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
    "escrow": {
      "account": "rL4fPHi2FWGwRGRQSH7gBcxkuo2b9NTjKK",
      "seq": 126
    },
    "ledger_index": "validated"
  }]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "escrow": { "account": "rL4fPHi2FWGwRGRQSH7gBcxkuo2b9NTjKK", "seq": 126 }, "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry-escrow)



### Get PayChannel Object

Retrieve a [PayChannel object](paychannel.html), which holds XRP for asynchronous payments. [New in: rippled 1.0.0][]

| `Field`           | Type   | Description                                     |
|:------------------|:-------|:------------------------------------------------|
| `payment_channel` | String | The [object ID](ledger-object-ids.html) of a [PayChannel object](paychannel.html) to retrieve. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_paychannel",
  "command": "ledger_entry",
  "payment_channel": "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
    "payment_channel": "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7",
    "ledger_index": "validated"
  }]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "payment_channel": "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7", "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry-paychannel)


### Get DepositPreauth Object

Retrieve a [DepositPreauth object](depositpreauth-object.html), which tracks preauthorization for payments to accounts requiring [Deposit Authorization](depositauth.html). Can be provided as string (object ID of the DepositPreauth) or as an object. [New in: rippled 1.1.0][]

| `Field`                      | Type                 | Description            |
|:-----------------------------|:---------------------|:-----------------------|
| `deposit_preauth`            | Object or String     | Specify a [DepositPreauth object](depositpreauth-object.html) to retrieve. If a string, must be the [object ID](ledger-object-ids.html) of the DepositPreauth object, as hexadecimal. If an object, requires `owner` and `authorized` sub-fields. |
| `deposit_preauth.owner`      | String - [Address][] | _(Required if `deposit_preauth` is specified as an object)_ The account that provided the preauthorization. |
| `deposit_preauth.authorized` | String - [Address][] | _(Required if `deposit_preauth` is specified as an object)_ The account that received the preauthorization. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_deposit_preauth",
  "command": "ledger_entry",
  "deposit_preauth": {
    "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "authorized": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
    "deposit_preauth": {
      "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "authorized": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
    },
    "ledger_index": "validated"
  }]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "deposit_preauth": { "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "authorized": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX" }, "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ledger_entry-depositpreauth)


### Get Ticket Object

Retrieve a [Ticket object](ticket.html), which represents a [sequence number][] set aside for future use. Can be provided as string (object ID of the Ticket) or as an object. _(Added by the [TicketBatch amendment][])_

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `ticket`                | Object or String           | The [Ticket object](ticket.html) to retrieve. If a string, must be the [object ID](ledger-object-ids.html) of the Ticket, as hexadecimal. If an object, the `owner` and `ticket_sequence` sub-fields are required to uniquely specify the Ticket entry. |
| `ticket.owner`          | String - [Address][]       | _(Required if `ticket` is specified as an object)_ The owner of the Ticket object. |
| `ticket.ticket_sequence` | Unsigned Integer          | _(Required if `ticket` is specified as an object)_ The Ticket Sequence number of the Ticket entry to retrieve. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_ticket",
  "command": "ledger_entry",
  "ticket": {
    "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "ticket_sequence": 23
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
    "ticket": {
      "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "ticket_sequence": 23
    },
    "ledger_index": "validated"
  }]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "ticket": { "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "ticket_sequence: 23 }, "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->


<!-- TODO: enable if/when Tickets are available on Mainnet
[Try it! >](websocket-api-tool.html#ledger_entry-ticket)
-->

### Get Bridge Object

Retrieve a [Bridge object](bridge.html) which connects a locking chain and an issuing chain. Can be provided as string (object ID of the Bridge) or as an object. _(Added by the [Sidechains amendment][])_

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `bridge`                | Object or String           | The [[Bridge object](bridge.html) to retrieve. |
| ``          | String - [Address][]       | _(Required if `ticket` is specified as an object)_ The owner of the Ticket object. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_bridge",
  "command": "ledger_entry",
  "bridge": {
    "issuing_chain_door": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
    "issuing_chain_issue": "XRP",
    "locking_chain_door": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
    "locking_chain_issue": "XRP"
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
   "bridge": {
    "issuing_chain_door": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
    "issuing_chain_issue": "XRP",
    "locking_chain_door": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
    "locking_chain_issue": "XRP"
   },
  "ledger_index": "validated"
  }]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "bridge": { "issuing_chain_door": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt", "issuing_chain_issue": "XRP", "locking_chain_door": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC", "locking_chain_issue": "XRP" }, "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

### Get xchain_claim_id

Retrieve a [Crosschain Claim ID object](xchains.html). Can be provided as string (object ID of the crosschain claim) or as an object. _(Added by the [Sidechains amendment][])_

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `bridge`                | Object or String           | The [[Bridge object](bridge.html) to retrieve. |
| ``          | String - [Address][]       | _(Required if `ticket` is specified as an object)_ The owner of the Ticket object. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_xchain_claim_id",
  "command": "ledger_entry",
  "xchain_claim_id": {
    "issuing_chain_door": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
    "issuing_chain_issue": "XRP",
    "locking_chain_door": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
    "locking_chain_issue": "XRP",
    "xchain_claim_id":1
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
   "xchain_claim_id": {
    "issuing_chain_door": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
    "issuing_chain_issue": "XRP",
    "locking_chain_door": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
    "locking_chain_issue": "XRP",
    "xchain_claim_id":1
  },
  "ledger_index": "validated"
  }]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "xchain_claim_id": { "issuing_chain_door": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt", "issuing_chain_issue": "XRP", "locking_chain_door": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC", "locking_chain_issue": "XRP", "xchain_claim_id":1 }, "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

### Get xchain_create_account_claim_id

The `xchain_create_account_claim_id` object is created when the sidechain is first notified (via an attestation) that a transaction occurred in the locking chain, and is removed when a quorum of attestations is reached. 

Retrieve a [xchain_create_account_claim_id object](bridge.html) which connects a locking chain and an issuing chain. Can be provided as string (object ID of the Bridge) or as an object. _(Added by the [Sidechains amendment][])_

| `Field`                 | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `bridge`                | Object or String           | The [[Bridge object](bridge.html) to retrieve. |
| ``          | String - [Address][]       | _(Required if `ticket` is specified as an object)_ The owner of the Ticket object. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_bridge",
  "command": "ledger_entry",
  "xchain_create_account_claim_id": {
    "issuing_chain_door": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
    "issuing_chain_issue": "XRP",
    "locking_chain_door": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
    "locking_chain_issue": "XRP",
    "xchain_create_account_claim_id": 1
    },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
  "xchain_create_account_claim_id": {
    "issuing_chain_door": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
    "issuing_chain_issue": "XRP",
    "locking_chain_door": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
    "locking_chain_issue": "XRP",
    "xchain_create_account_claim_id": 1
    },
  "ledger_index": "validated"
  }]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "xchain_create_account_claim_id": { "issuing_chain_door": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt", "issuing_chain_issue": "XRP", "locking_chain_door": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC", "locking_chain_issue": "XRP", "xchain_create_account_claim_id": 1 }, "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->


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
  "id": "example_get_accountroot",
  "result": {
    "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
    "ledger_hash": "31850E8E48E76D1064651DF39DF4E9542E8C90A9A9B629F4DE339EB3FA74F726",
    "ledger_index": 61966146,
    "node": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "AccountTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "Balance": "424021949",
      "Domain": "6D64756F31332E636F6D",
      "EmailHash": "98B4375E1D753E5B91627516F6D70977",
      "Flags": 9568256,
      "LedgerEntryType": "AccountRoot",
      "MessageKey": "0000000000000000000000070000000300",
      "OwnerCount": 12,
      "PreviousTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "PreviousTxnLgrSeq": 61965653,
      "RegularKey": "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
      "Sequence": 385,
      "TransferRate": 4294967295,
      "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8"
    },
    "validated": true
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
    "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
    "ledger_hash": "395946243EA36C5092AE58AF729D2875F659812409810A63096AC006C73E656E",
    "ledger_index": 61966165,
    "node": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "AccountTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "Balance": "424021949",
      "Domain": "6D64756F31332E636F6D",
      "EmailHash": "98B4375E1D753E5B91627516F6D70977",
      "Flags": 9568256,
      "LedgerEntryType": "AccountRoot",
      "MessageKey": "0000000000000000000000070000000300",
      "OwnerCount": 12,
      "PreviousTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "PreviousTxnLgrSeq": 61965653,
      "RegularKey": "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
      "Sequence": 385,
      "TransferRate": 4294967295,
      "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8"
    },
    "status": "success",
    "validated": true
  }
}
```

*Commandline*

```json
{
  "result": {
    "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
    "ledger_hash": "395946243EA36C5092AE58AF729D2875F659812409810A63096AC006C73E656E",
    "ledger_index": 61966165,
    "node": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "AccountTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "Balance": "424021949",
      "Domain": "6D64756F31332E636F6D",
      "EmailHash": "98B4375E1D753E5B91627516F6D70977",
      "Flags": 9568256,
      "LedgerEntryType": "AccountRoot",
      "MessageKey": "0000000000000000000000070000000300",
      "OwnerCount": 12,
      "PreviousTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "PreviousTxnLgrSeq": 61965653,
      "RegularKey": "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
      "Sequence": 385,
      "TransferRate": 4294967295,
      "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8"
    },
    "status": "success",
    "validated": true
  }
}
```

<!-- MULTICODE_BLOCK_END -->

### Response for Bridge Object

Here is a sample response for the Bridge object:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_bridge",
  "result": {
    "index": "DC74C41BDD449D5DC421E521E69CB903F3A4A97C9C12BD638E055BF46B1EF367",
    "ledger_current_index": 4,
    "node": { 
      "Account": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
      "Balance": "0",
      "Flags": 0,
      "LedgerEntryType": "Bridge",
      "MinAccountCreateAmount": "20000000",
      "OwnerNode": "0",
      "PreviousTxnID": "C73BBB7F7B22A5C27217597CADA505462E1F5DEABB32CF23C2D72BC4D36225EF",
      "PreviousTxnLgrSeq": 3,
      "SignatureReward": "1000000",
      "XChainAccountClaimCount": "0",
      "XChainAccountCreateCount": "0",
      "XChainBridge": {
        "IssuingChainDoor": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
        "IssuingChainIssue": "XRP",
        "LockingChainDoor": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
        "LockingChainIssue": "XRP"
      },
      "XChainClaimID": "0",
      "index": "DC74C41BDD449D5DC421E521E69CB903F3A4A97C9C12BD638E055BF46B1EF367"
    },
    "status": "success",
    "validated": false
  },
  "type": "response"
}
```

*JSON-RPC*

```json
200 OK

{
  "result": {
    "index": "DC74C41BDD449D5DC421E521E69CB903F3A4A97C9C12BD638E055BF46B1EF367",
    "ledger_current_index": 4,
    "node": { 
      "Account": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
      "Balance": "0",
      "Flags": 0,
      "LedgerEntryType": "Bridge",
      "MinAccountCreateAmount": "20000000",
      "OwnerNode": "0",
      "PreviousTxnID": "C73BBB7F7B22A5C27217597CADA505462E1F5DEABB32CF23C2D72BC4D36225EF",
      "PreviousTxnLgrSeq": 3,
      "SignatureReward": "1000000",
      "XChainAccountClaimCount": "0",
      "XChainAccountCreateCount": "0",
      "XChainBridge": {
        "IssuingChainDoor": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
        "IssuingChainIssue": "XRP",
        "LockingChainDoor": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
        "LockingChainIssue": "XRP"
      },
      "XChainClaimID": "0",
      "index": "DC74C41BDD449D5DC421E521E69CB903F3A4A97C9C12BD638E055BF46B1EF367"
    },
    "status": "success",
    "validated": false
  }
}
```

*Commandline*

```json
{
  "result": {
    "index": "DC74C41BDD449D5DC421E521E69CB903F3A4A97C9C12BD638E055BF46B1EF367",
    "ledger_current_index": 4,
    "node": { 
      "Account": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
      "Balance": "0",
      "Flags": 0,
      "LedgerEntryType": "Bridge",
      "MinAccountCreateAmount": "20000000",
      "OwnerNode": "0",
      "PreviousTxnID": "C73BBB7F7B22A5C27217597CADA505462E1F5DEABB32CF23C2D72BC4D36225EF",
      "PreviousTxnLgrSeq": 3,
      "SignatureReward": "1000000",
      "XChainAccountClaimCount": "0",
      "XChainAccountCreateCount": "0",
      "XChainBridge": {
        "IssuingChainDoor": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
        "IssuingChainIssue": "XRP",
        "LockingChainDoor": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
        "LockingChainIssue": "XRP"
      },
      "XChainClaimID": "0",
      "index": "DC74C41BDD449D5DC421E521E69CB903F3A4A97C9C12BD638E055BF46B1EF367"
    },
    "status": "success",
    "validated": false
  }
}
```

<!-- MULTICODE_BLOCK_END -->


 ### Response for XChain Claim ID


{"index": "B459014123A6535823584F96DB50721FE517FE697B7E21275A84C43FACBF9942",
 "ledger_current_index": 6,
 "node": 
 {"Account": "r9A8UyNpW3X46FUc6P7JZqgn6WgAPjBwPg",
  "Flags": 0,
  "LedgerEntryType": "XChainClaimID",
  "OtherChainAccount": "rnJmYAiqEVngtnb5ckRroXLtCbWC7CRUBx",
  "OwnerNode": "0",
  "PreviousTxnID": "29B3F0A2FD3A7765CBFDA15CC91B11BF6A1B574F1BE43611D7C33EF72353C000",
  "PreviousTxnLgrSeq": 4,
  "SignatureReward": "1000000",
  "XChainBridge": 
  {"IssuingChainDoor": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
   "IssuingChainIssue": "XRP",
   "LockingChainDoor": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
   "LockingChainIssue": "XRP"},
  "XChainClaimAttestations": [],
  "XChainClaimID": "1",
  "index": "B459014123A6535823584F96DB50721FE517FE697B7E21275A84C43FACBF9942"},
 "status": "success",
 "validated": false}

### Response for XChain Create Account Claim ID

 The `xchain_create_account_claim_id` object is created when the sidechain is first notified (via an attestation) that a transaction occurred in the locking chain, and is removed when a quorum of attestations is reached. The following example shows the state when the object had accumulated 3 attestations, one shy of the required quorum of 4.

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_accountroot",
  "result": {
    "index": "C6FFFA82BED460689AD1DD5F8F6208F40B7AC01E26F4000B7020D783264DBD54",
    "ledger_current_index": 5,
    "node": { 
      "Account": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
      "Flags": 0,
      "LedgerEntryType": "XChainCreateAccountClaimID",
      "OwnerNode": "0",
      "PreviousTxnID": "969D5B4F80266E795A965B2B0D3FCEB39395B826FBB205770175BBEF4BAEF9D9",
      "PreviousTxnLgrSeq": 4,
      "XChainAccountCreateCount": "1",
      "XChainBridge": { 
        "IssuingChainDoor": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
        "IssuingChainIssue": "XRP",
        "LockingChainDoor": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
        "LockingChainIssue": "XRP"
        },
      "XChainCreateAccountAttestations": [ { 
        "XChainCreateAccountProofSig": {
          "Amount": "1000000000",
          "AttestationRewardAccount": "rEziJZmeZzsJvGVUmpUTey7qxQLKYxaK9f",
          "AttestationSignerAccount": "rBdjyperRHKTzdxnZhyN94MpjN2aknRX8G",
          "Destination": "rnJ32bja1a9V4Wheerr76HnLgUJmYoLP5i",
          "SignatureReward": "1000000",
          "WasLockingChainSend": 1,
          "XChainAccountCreateCount": "1"
          }
        }, {
        "XChainCreateAccountProofSig": { 
          "Amount": "1000000000",
          "AttestationRewardAccount": "rEziJZmeZzsJvGVUmpUTey7qxQLKYxaK9f",
          "AttestationSignerAccount": "rJj2ty2MDGu7dtm1bvZMA5KuhzreNL2HHo",
          "Destination": "rnJ32bja1a9V4Wheerr76HnLgUJmYoLP5i",
          "SignatureReward": "1000000",
          "WasLockingChainSend": 1,
          "XChainAccountCreateCount": "1"
          }
        }, {
        "XChainCreateAccountProofSig": {
          "Amount": "1000000000",
          "AttestationRewardAccount": "rEziJZmeZzsJvGVUmpUTey7qxQLKYxaK9f",
          "AttestationSignerAccount": "rPQDTwG7tWYNzqjytf8YCYX6hZemGG9TTh",
          "Destination": "rnJ32bja1a9V4Wheerr76HnLgUJmYoLP5i",
          "SignatureReward": "1000000",
          "WasLockingChainSend": 1,
          "XChainAccountCreateCount": "1"
        }
      }
    ],
    "index": "C6FFFA82BED460689AD1DD5F8F6208F40B7AC01E26F4000B7020D783264DBD54"},
    "status": "success",
    "validated": false
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
    "index": "C6FFFA82BED460689AD1DD5F8F6208F40B7AC01E26F4000B7020D783264DBD54",
    "ledger_current_index": 5,
    "node": { 
      "Account": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
      "Flags": 0,
      "LedgerEntryType": "XChainCreateAccountClaimID",
      "OwnerNode": "0",
      "PreviousTxnID": "969D5B4F80266E795A965B2B0D3FCEB39395B826FBB205770175BBEF4BAEF9D9",
      "PreviousTxnLgrSeq": 4,
      "XChainAccountCreateCount": "1",
      "XChainBridge": { 
        "IssuingChainDoor": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
        "IssuingChainIssue": "XRP",
        "LockingChainDoor": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
        "LockingChainIssue": "XRP"
        },
      "XChainCreateAccountAttestations": [ { 
        "XChainCreateAccountProofSig": {
          "Amount": "1000000000",
          "AttestationRewardAccount": "rEziJZmeZzsJvGVUmpUTey7qxQLKYxaK9f",
          "AttestationSignerAccount": "rBdjyperRHKTzdxnZhyN94MpjN2aknRX8G",
          "Destination": "rnJ32bja1a9V4Wheerr76HnLgUJmYoLP5i",
          "SignatureReward": "1000000",
          "WasLockingChainSend": 1,
          "XChainAccountCreateCount": "1"
          }
        }, {
        "XChainCreateAccountProofSig": { 
          "Amount": "1000000000",
          "AttestationRewardAccount": "rEziJZmeZzsJvGVUmpUTey7qxQLKYxaK9f",
          "AttestationSignerAccount": "rJj2ty2MDGu7dtm1bvZMA5KuhzreNL2HHo",
          "Destination": "rnJ32bja1a9V4Wheerr76HnLgUJmYoLP5i",
          "SignatureReward": "1000000",
          "WasLockingChainSend": 1,
          "XChainAccountCreateCount": "1"
          }
        }, {
        "XChainCreateAccountProofSig": {
          "Amount": "1000000000",
          "AttestationRewardAccount": "rEziJZmeZzsJvGVUmpUTey7qxQLKYxaK9f",
          "AttestationSignerAccount": "rPQDTwG7tWYNzqjytf8YCYX6hZemGG9TTh",
          "Destination": "rnJ32bja1a9V4Wheerr76HnLgUJmYoLP5i",
          "SignatureReward": "1000000",
          "WasLockingChainSend": 1,
          "XChainAccountCreateCount": "1"
        }
      }
    ],
    "index": "C6FFFA82BED460689AD1DD5F8F6208F40B7AC01E26F4000B7020D783264DBD54"},
    "status": "success",
    "validated": false
  }
}
```

*Commandline*

```json
{
  "result": { 
    "index": "C6FFFA82BED460689AD1DD5F8F6208F40B7AC01E26F4000B7020D783264DBD54",
    "ledger_current_index": 5,
    "node": { 
      "Account": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
      "Flags": 0,
      "LedgerEntryType": "XChainCreateAccountClaimID",
      "OwnerNode": "0",
      "PreviousTxnID": "969D5B4F80266E795A965B2B0D3FCEB39395B826FBB205770175BBEF4BAEF9D9",
      "PreviousTxnLgrSeq": 4,
      "XChainAccountCreateCount": "1",
      "XChainBridge": { 
        "IssuingChainDoor": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
        "IssuingChainIssue": "XRP",
        "LockingChainDoor": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
        "LockingChainIssue": "XRP"
        },
      "XChainCreateAccountAttestations": [ { 
        "XChainCreateAccountProofSig": {
          "Amount": "1000000000",
          "AttestationRewardAccount": "rEziJZmeZzsJvGVUmpUTey7qxQLKYxaK9f",
          "AttestationSignerAccount": "rBdjyperRHKTzdxnZhyN94MpjN2aknRX8G",
          "Destination": "rnJ32bja1a9V4Wheerr76HnLgUJmYoLP5i",
          "SignatureReward": "1000000",
          "WasLockingChainSend": 1,
          "XChainAccountCreateCount": "1"
          }
        }, {
        "XChainCreateAccountProofSig": { 
          "Amount": "1000000000",
          "AttestationRewardAccount": "rEziJZmeZzsJvGVUmpUTey7qxQLKYxaK9f",
          "AttestationSignerAccount": "rJj2ty2MDGu7dtm1bvZMA5KuhzreNL2HHo",
          "Destination": "rnJ32bja1a9V4Wheerr76HnLgUJmYoLP5i",
          "SignatureReward": "1000000",
          "WasLockingChainSend": 1,
          "XChainAccountCreateCount": "1"
          }
        }, {
        "XChainCreateAccountProofSig": {
          "Amount": "1000000000",
          "AttestationRewardAccount": "rEziJZmeZzsJvGVUmpUTey7qxQLKYxaK9f",
          "AttestationSignerAccount": "rPQDTwG7tWYNzqjytf8YCYX6hZemGG9TTh",
          "Destination": "rnJ32bja1a9V4Wheerr76HnLgUJmYoLP5i",
          "SignatureReward": "1000000",
          "WasLockingChainSend": 1,
          "XChainAccountCreateCount": "1"
        }
      }
    ],
    "index": "C6FFFA82BED460689AD1DD5F8F6208F40B7AC01E26F4000B7020D783264DBD54"},
    "status": "success",
    "validated": false
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
