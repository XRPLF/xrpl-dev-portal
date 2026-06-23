---
html: server_definitions.html
parent: server-info-methods.html
seo:
    description: Retrieve an SDK-compatible `definitions.json`, generated from the `xrpld` instance currently running.
labels:
  - Core Server
---
# server_definitions

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/rpc/handlers/server_info/ServerDefinitions.cpp#L385 "Source")

The `server_definitions` command returns an SDK-compatible `definitions.json`, generated from the `xrpld` instance currently running. You can use this to query a node in a network, quickly receiving the definitions necessary to serialize/deserialize its binary data.

The response also includes the `TRANSACTION_FORMATS`, `LEDGER_ENTRY_FORMATS`, `TRANSACTION_FLAGS`, `LEDGER_ENTRY_FLAGS`, and `ACCOUNT_SET_FLAGS` sections, which describe the fields and flags of each transaction and ledger entry type. {% badge href="https://xrpl.org/blog/2026/xrpld-3.2.0" %}New in: xrpld 3.2.0{% /badge %}

You can also generate the same definitions without a running server using the [`--definitions`](../../../../infrastructure/commandline-usage.md) command-line flag.


## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "command": "server_definitions"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "server_definitions"
}
```
{% /tab %}

{% /tabs %}

{% try-it method="server_definitions" /%}

The request includes the following parameters:

| Field             | Type   | Required? | Description |
|:------------------|:-------|:----------|-------------|
| `hash`            | String | No        | If included and the hash matches the server's hash, the full set of definitions will not be returned. |


## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "result": {
    "FIELDS": [
      [
        "Generic",
        {
          "isSerialized": false,
          "isSigningField": false,
          "isVLEncoded": false,
          "nth": 0,
          "type": "Unknown"
        }
      ],
      [
        "Invalid",
        {
          "isSerialized": false,
          "isSigningField": false,
          "isVLEncoded": false,
          "nth": -1,
          "type": "Unknown"
        }
      ],
      [
        "ObjectEndMarker",
        {
          "isSerialized": true,
          "isSigningField": true,
          "isVLEncoded": false,
          "nth": 1,
          "type": "STObject"
        }
      ],
      [
        "ArrayEndMarker",
        {
          "isSerialized": true,
          "isSigningField": true,
          "isVLEncoded": false,
          "nth": 1,
          "type": "STArray"
        }
      ]
      ...
    ],
    "TRANSACTION_FORMATS": {
      "common": [
        {
          "name": "TransactionType",
          "optionality": 0
        },
        {
          "name": "Flags",
          "optionality": 1
        },
        {
          "name": "SourceTag",
          "optionality": 1
        }
        ...
      ],
      "AccountSet": [
        {
          "name": "EmailHash",
          "optionality": 1
        },
        ...
        {
          "name": "SetFlag",
          "optionality": 1
        }
        ...
      ]
      ...
    },
    "LEDGER_ENTRY_FORMATS": {
      "common": [
        {
          "name": "LedgerIndex",
          "optionality": 1
        },
        {
          "name": "LedgerEntryType",
          "optionality": 0
        },
        {
          "name": "Flags",
          "optionality": 0
        }
      ],
      "DID": [
        {
          "name": "Account",
          "optionality": 0
        },
        {
          "name": "DIDDocument",
          "optionality": 1
        }
        ...
      ]
      ...
    },
    "TRANSACTION_FLAGS": {
      "universal": {
        "tfFullyCanonicalSig": 2147483648,
        "tfInnerBatchTxn": 1073741824
      },
      "AccountSet": {
        "tfRequireDestTag": 65536,
        "tfOptionalDestTag": 131072
        ...
      }
      ...
    },
    "LEDGER_ENTRY_FLAGS": {
      "AccountRoot": {
        "lsfDisallowXRP": 524288
        ...
      }
      ...
    },
    "ACCOUNT_SET_FLAGS": {
      "asfRequireDest": 1,
      "asfRequireAuth": 2,
      "asfDisallowXRP": 3
      ...
    }
  }
}
```
{% /tab %}

{% /tabs %}

To see a full `definitions.json` file and descriptions of the top-level fields—including the `TRANSACTION_FORMATS`, `LEDGER_ENTRY_FORMATS`, `TRANSACTION_FLAGS`, `LEDGER_ENTRY_FLAGS`, and `ACCOUNT_SET_FLAGS` sections—see: [Definitions File](../../../protocol/binary-format.md#definitions-file).


## Possible Errors

Any of the [universal error types][].

{% raw-partial file="/docs/_snippets/common-links.md" /%}
