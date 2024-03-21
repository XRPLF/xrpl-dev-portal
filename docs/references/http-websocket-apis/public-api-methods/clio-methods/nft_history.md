---
html: nft_history.html
parent: clio-methods.html
seo:
    description: Retrieve the history of ownership and transfers for the specified NFT using Clio server's `nft_history` API.
labels:
  - Non-fungible Tokens, NFTs
---
# nft_history

[[Source]](https://github.com/XRPLF/clio/blob/develop/src/rpc/handlers/NFTHistory.cpp "Source")

The `nft_history` command asks the Clio server for past transaction metadata for the [NFT](../../../../concepts/tokens/nfts/index.md) being queried. {% badge href="https://github.com/XRPLF/clio/releases/tag/1.1.0" %}New in: Clio v1.1.0{% /badge %}

**Note** `nft_history` returns only _successful_ transactions associated with the NFT.

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "command": "nft_history",
  "nft_id": "00080000B4F4AFC5FBCBD76873F18006173D2193467D3EE70000099B00000000"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "nft_history",
    "params": [
      {
          "nft_id": "00080000B4F4AFC5FBCBD76873F18006173D2193467D3EE70000099B00000000"
      }
    ]
}
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#nft_history)

The request contains the following parameters:

| `Field`        | Type                       | Description                    |
|:---------------|:---------------------------|:-------------------------------|
| `nft_id`       | String                     | A unique identifier for the non-fungible token (NFT). |
| `ledger_index_min` | Integer                | _(Optional)_ Use to specify the earliest ledger from which to include NFTs. A value of `-1` instructs the server to use the earliest validated ledger version available.  |
| `ledger_index_max` | Integer                | _(Optional)_ Use to specify the most recent ledger to include NFTs from. A value of `-1` instructs the server to use the most recent validated ledger version available. |
| `ledger_hash`   | String                      | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | String or Unsigned Integer | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically.  Do not specify the `ledger_index` as `closed` or `current`; doing so forwards the request to the P2P `rippled` server and the `nft_history` API is not available on `rippled`. (See [Specifying Ledgers][]) |
| `binary`           | Boolean                                    | _(Optional)_ Defaults to `false`. If set to `true`, returns transactions as hex strings instead of JSON. |
| `forward`          | Boolean                 | _(Optional)_ Defaults to `false`. If set to `true`, returns values indexed with the oldest ledger first. Otherwise, the results are indexed with the newest ledger first. (Each page of results might not be internally ordered, but the pages are ordered overall.) |
| `limit`        | UInt32 | _(Optional)_ Limit the number of NFTs to retrieve. The server is not required to honor this value. |
| `marker`       | Marker | Value from a previous paginated response. Resume retrieving data where that response left off. This value is NOT stable if there is a change in the server's range of available ledgers. If you are querying the “validated” ledger, it is possible that new NFTs are created during your paging. |

**Note** If you do not specify a ledger version, Clio uses the latest validated ledger.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 0,
  "type": "response",
  "result": {
    "ledger_index_min": 21377274,
    "ledger_index_max": 27876163,
    "transactions": [
      {
        "meta": {
          "AffectedNodes": [
            {
              "CreatedNode": {
                "LedgerEntryType": "NFTokenPage",
                "LedgerIndex": "97707A94B298B50334C39FB46E245D4744C0F5B5FFFFFFFFFFFFFFFFFFFFFFFF",
                "NewFields": {
                  "NFTokens": [
                    {
                      "NFToken": {
                        "NFTokenID": "0008271097707A94B298B50334C39FB46E245D4744C0F5B50000099B00000000",
                        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"
                      }
                    }
                  ]
                }
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rNoj836fhDm1eXaHHefPKs7iDb4gwzS7nc",
                  "Balance": "999999988",
                  "Flags": 0,
                  "MintedNFTokens": 1,
                  "OwnerCount": 1,
                  "Sequence": 27876155
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "AC0A2AD29B67B5E6DA1C5DE696440F59BCD8DEA0A4CF7AFD683D1489AAB1ED24",
                "PreviousFields": {
                  "Balance": "1000000000",
                  "OwnerCount": 0,
                  "Sequence": 27876154
                },
                "PreviousTxnID": "B483F0F7100658380E42BCF1B15AD59B71C4082635AD53B78D08A5198BBB6939",
                "PreviousTxnLgrSeq": 27876154
              }
            }
          ],
          "TransactionIndex": 0,
          "TransactionResult": "tesSUCCESS"
        },
        "tx": {
          "Account": "rNoj836fhDm1eXaHHefPKs7iDb4gwzS7nc",
          "Fee": "12",
          "Flags": 8,
          "LastLedgerSequence": 27876176,
          "NFTokenTaxon": 0,
          "Sequence": 27876154,
          "SigningPubKey": "EDDC20C6791F9FB13AFDCE2C717BE8779DD451BB556243F1FDBAA3CD159D68A9F6",
          "TransactionType": "NFTokenMint",
          "TransferFee": 10000,
          "TxnSignature": "EF657AB47E86FDC112BA054D90587DFE64A61604D9EDABAA7B01B61B56433E3C2AC5BF5AD2E8F5D2A9EAC22778F289094AC383A3F172B2304157A533E0C79802",
          "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
          "hash": "E0774E1B8628E397C6E88F67D4424E55E4C81324607B19318255310A6FBAA4A2",
          "ledger_index": 27876158,
          "date": 735167200
        },
        "validated": true
      }
    ],
    "nft_id": "0008271097707A94B298B50334C39FB46E245D4744C0F5B50000099B00000000",
    "validated": true
  },
  "warnings": [
    {
      "id": 2001,
      "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
    }
  ]
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "result": {
    "ledger_index_min": 21377274,
    "ledger_index_max": 27876163,
    "transactions": [
      {
        "meta": {
          "AffectedNodes": [
            {
              "CreatedNode": {
                "LedgerEntryType": "NFTokenPage",
                "LedgerIndex": "97707A94B298B50334C39FB46E245D4744C0F5B5FFFFFFFFFFFFFFFFFFFFFFFF",
                "NewFields": {
                  "NFTokens": [
                    {
                      "NFToken": {
                        "NFTokenID": "0008271097707A94B298B50334C39FB46E245D4744C0F5B50000099B00000000",
                        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"
                      }
                    }
                  ]
                }
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rNoj836fhDm1eXaHHefPKs7iDb4gwzS7nc",
                  "Balance": "999999988",
                  "Flags": 0,
                  "MintedNFTokens": 1,
                  "OwnerCount": 1,
                  "Sequence": 27876155
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "AC0A2AD29B67B5E6DA1C5DE696440F59BCD8DEA0A4CF7AFD683D1489AAB1ED24",
                "PreviousFields": {
                  "Balance": "1000000000",
                  "OwnerCount": 0,
                  "Sequence": 27876154
                },
                "PreviousTxnID": "B483F0F7100658380E42BCF1B15AD59B71C4082635AD53B78D08A5198BBB6939",
                "PreviousTxnLgrSeq": 27876154
              }
            }
          ],
          "TransactionIndex": 0,
          "TransactionResult": "tesSUCCESS"
        },
        "tx": {
          "Account": "rNoj836fhDm1eXaHHefPKs7iDb4gwzS7nc",
          "Fee": "12",
          "Flags": 8,
          "LastLedgerSequence": 27876176,
          "NFTokenTaxon": 0,
          "Sequence": 27876154,
          "SigningPubKey": "EDDC20C6791F9FB13AFDCE2C717BE8779DD451BB556243F1FDBAA3CD159D68A9F6",
          "TransactionType": "NFTokenMint",
          "TransferFee": 10000,
          "TxnSignature": "EF657AB47E86FDC112BA054D90587DFE64A61604D9EDABAA7B01B61B56433E3C2AC5BF5AD2E8F5D2A9EAC22778F289094AC383A3F172B2304157A533E0C79802",
          "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
          "hash": "E0774E1B8628E397C6E88F67D4424E55E4C81324607B19318255310A6FBAA4A2",
          "ledger_index": 27876158,
          "date": 735167200
        },
        "validated": true
      }
    ],
    "nft_id": "0008271097707A94B298B50334C39FB46E245D4744C0F5B50000099B00000000",
    "validated": true
  },
  "warnings": [
    {
      "id": 2001,
      "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
    }
  ]
}
```
{% /tab %}

{% /tabs %}

With the `binary` parameter set to _true_, you receive a compact response that uses hex strings. It's not human readable, but much more concise.

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 0,
  "type": "response",
  "result": {
    "ledger_index_min": 21377274,
    "ledger_index_max": 27876275,
    "transactions": [
      {
        "meta": "201C00000000F8E31100505697707A94B298B50334C39FB46E245D4744C0F5B5FFFFFFFFFFFFFFFFFFFFFFFFE8FAEC5A0008271097707A94B298B50334C39FB46E245D4744C0F5B50000099B000000007542697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469E1F1E1E1E51100612501A95B3A55B483F0F7100658380E42BCF1B15AD59B71C4082635AD53B78D08A5198BBB693956AC0A2AD29B67B5E6DA1C5DE696440F59BCD8DEA0A4CF7AFD683D1489AAB1ED24E62401A95B3A2D0000000062400000003B9ACA00E1E722000000002401A95B3B2D00000001202B0000000162400000003B9AC9F4811497707A94B298B50334C39FB46E245D4744C0F5B5E1E1F1031000",
        "tx_blob": "12001914271022000000082401A95B3A201B01A95B50202A0000000068400000000000000C7321EDDC20C6791F9FB13AFDCE2C717BE8779DD451BB556243F1FDBAA3CD159D68A9F67440EF657AB47E86FDC112BA054D90587DFE64A61604D9EDABAA7B01B61B56433E3C2AC5BF5AD2E8F5D2A9EAC22778F289094AC383A3F172B2304157A533E0C798027542697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469811497707A94B298B50334C39FB46E245D4744C0F5B5",
        "ledger_index": 27876158,
        "date": 735167200,
        "validated": true
      }
    ],
    "nft_id": "0008271097707A94B298B50334C39FB46E245D4744C0F5B50000099B00000000",
    "validated": true
  },
  "warnings": [
    {
      "id": 2001,
      "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
    }
  ]
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "result": {
    "ledger_index_min": 21377274,
    "ledger_index_max": 27876275,
    "transactions": [
      {
        "meta": "201C00000000F8E31100505697707A94B298B50334C39FB46E245D4744C0F5B5FFFFFFFFFFFFFFFFFFFFFFFFE8FAEC5A0008271097707A94B298B50334C39FB46E245D4744C0F5B50000099B000000007542697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469E1F1E1E1E51100612501A95B3A55B483F0F7100658380E42BCF1B15AD59B71C4082635AD53B78D08A5198BBB693956AC0A2AD29B67B5E6DA1C5DE696440F59BCD8DEA0A4CF7AFD683D1489AAB1ED24E62401A95B3A2D0000000062400000003B9ACA00E1E722000000002401A95B3B2D00000001202B0000000162400000003B9AC9F4811497707A94B298B50334C39FB46E245D4744C0F5B5E1E1F1031000",
        "tx_blob": "12001914271022000000082401A95B3A201B01A95B50202A0000000068400000000000000C7321EDDC20C6791F9FB13AFDCE2C717BE8779DD451BB556243F1FDBAA3CD159D68A9F67440EF657AB47E86FDC112BA054D90587DFE64A61604D9EDABAA7B01B61B56433E3C2AC5BF5AD2E8F5D2A9EAC22778F289094AC383A3F172B2304157A533E0C798027542697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469811497707A94B298B50334C39FB46E245D4744C0F5B5",
        "ledger_index": 27876158,
        "date": 735167200,
        "validated": true
      }
    ],
    "nft_id": "0008271097707A94B298B50334C39FB46E245D4744C0F5B50000099B00000000",
    "validated": true
  },
  "warnings": [
    {
      "id": 2001,
      "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
    }
  ]
}

```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`            | Type                       | Description                |
|:-------------------|:---------------------------|:---------------------------|
| `nft_id`           | String                     | A unique identifier for the non-fungible token (NFT). |
| `ledger_index_min` | Integer - [Ledger Index][] | The ledger index of the earliest ledger actually searched for transactions. |
| `ledger_index_max` | Integer - [Ledger Index][] | The ledger index of the most recent ledger actually searched for transactions. |
| `limit`            | Integer                    | The `limit` value used in the request. (This may differ from the actual limit value enforced by the server.) |
| `marker`           | [Marker][]                 | Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. |
| `transactions`     | Array                      | Array of transactions matching the request's criteria, as explained below. |
| `validated`        | Boolean                    | If included and set to `true`, the information in this response comes from a validated ledger version. Otherwise, the information is subject to change. |

**Note:** The server may respond with different values of `ledger_index_min` and `ledger_index_max` than you provided in the request, for example if it did not have the versions you specified on hand.

Each transaction object includes the following fields, depending on whether it was requested in JSON or hex string (`"binary":true`) format.

| `Field`        | Type                             | Description              |
|:---------------|:---------------------------------|:-------------------------|
| `ledger_index` | Integer                          | The [ledger index][] of the ledger version that included this transaction. |
| `meta`         | Object (JSON) or String (Binary) | If `binary` is True, then this is a hex string of the transaction metadata. Otherwise, the transaction metadata is included in JSON format. |
| `tx`           | Object                           | (JSON mode only) JSON object defining the transaction |
| `tx_blob`      | String                           | (Binary mode only) Unique hashed String representing the transaction. |
| `validated`    | Boolean                          | Whether or not the transaction is included in a validated ledger. Any transaction not yet in a validated ledger is subject to change. |

For definitions of the fields returned in the `tx` object, see [Transaction Metadata](../../../protocol/transactions/metadata.md).

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actMalformed` - The [Address][] specified in the `account` field of the request is not formatted properly.
* `lgrIdxMalformed` - The ledger specified by the `ledger_index_min` or `ledger_index_max` does not exist, or if it does exist but the server does not have it.
* `lgrIdxsInvalid` - Either the request specifies a `ledger_index_max` that is before the `ledger_index_min`, or the server does not have a validated ledger range because it is [not synced with the network](../../../../infrastructure/troubleshooting/server-doesnt-sync.md).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
