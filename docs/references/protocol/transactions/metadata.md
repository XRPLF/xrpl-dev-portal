---
html: transaction-metadata.html
parent: transaction-formats.html
seo:
    description: Transaction metadata describes the outcome of the transaction in detail, regardless of whether the transaction is successful.
labels:
  - Blockchain
---
# Transaction Metadata

Transaction metadata is a section of data that gets added to a transaction after it is processed. Any transaction that gets included in a ledger has metadata, regardless of whether it is successful. The transaction metadata describes the outcome of the transaction in detail.

**Warning:** The changes described in transaction metadata are only final if the transaction is in a validated ledger version.

Some fields that may appear in transaction metadata include:

{% partial file="/docs/_snippets/tx-metadata-field-table.md" /%} 


## Example Metadata

The following JSON object shows the metadata for an order, [trading XRP for USD](https://livenet.xrpl.org/transactions/424661CF1FD3675D11EC910CF161979553B6D135F9BD03E6F8D4611D88D27581):

```json
"meta": {
  "AffectedNodes": [
    {
      "ModifiedNode": {
        "FinalFields": {
          "Account": "rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjah",
          "Balance": "27724423128",
          "Flags": 0,
          "OwnerCount": 14,
          "Sequence": 129693478
        },
        "LedgerEntryType": "AccountRoot",
        "LedgerIndex": "1ED8DDFD80F275CB1CE7F18BB9D906655DE8029805D8B95FB9020B30425821EB",
        "PreviousFields": {
          "Balance": "27719423228",
          "Sequence": 129693477
        },
        "PreviousTxnID": "3110F983CDC090750B45C9BFB74B8CE629CA80F57C35612402B2760153822BA5",
        "PreviousTxnLgrSeq": 86724072
      }
    },
    {
      "DeletedNode": {
        "FinalFields": {
          "Account": "rPx6Rbh8fStXeP3LwECBisownN2ZyMyzYS",
          "BookDirectory": "DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4E1566CBCC208000",
          "BookNode": "0",
          "Flags": 0,
          "OwnerNode": "0",
          "PreviousTxnID": "DCB061EC44BBF73BBC20CE0432E9D8D7C4B8B28ABA8AE5A5BA687476E7A796EF",
          "PreviousTxnLgrSeq": 86724050,
          "Sequence": 86586865,
          "TakerGets": "0",
          "TakerPays": {
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "value": "0"
          }
        },
        "LedgerEntryType": "Offer",
        "LedgerIndex": "348AF66EBD872FBF2BD23085D3FB4A200E15509451475027C4A5EE8D8B77C623",
        "PreviousFields": {
          "TakerGets": "5000000",
          "TakerPays": {
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "value": "3.012"
          }
        }
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Flags": 0,
          "Owner": "rPx6Rbh8fStXeP3LwECBisownN2ZyMyzYS",
          "RootIndex": "4A68E363398C8DA470CF85237CA4A044476CD38BA7D5C9B8E8F19417A13B01C1"
        },
        "LedgerEntryType": "DirectoryNode",
        "LedgerIndex": "4A68E363398C8DA470CF85237CA4A044476CD38BA7D5C9B8E8F19417A13B01C1"
      }
    },
    {
     "ModifiedNode": {
        "FinalFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "-3.0120000001701"
          },
          "Flags": 2228224,
          "HighLimit": {
            "currency": "USD",
            "issuer": "rPx6Rbh8fStXeP3LwECBisownN2ZyMyzYS",
            "value": "0"
          },
          "HighNode": "0",
          "LowLimit": {
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "value": "0"
          },
          "LowNode": "bd5"
        },
        "LedgerEntryType": "RippleState",
        "LedgerIndex": "7345788A2C9121EB8168D2755950887CED3887CCDBC882015BC070A61C2AD1DA",
        "PreviousFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "-0.0000000001701"
          }
        },
        "PreviousTxnID": "B4726FC087FAB3DB3578A34095B96F9055075A86A16CE741B406D91202685998",
        "PreviousTxnLgrSeq": 86722015
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "-52157.74818800332"
          },
          "Flags": 2228224,
          "HighLimit": {
            "currency": "USD",
            "issuer": "rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjah",
            "value": "1000000000"
          },
          "HighNode": "0",
          "LowLimit": {
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "value": "0"
          },
          "LowNode": "b29"
        },
        "LedgerEntryType": "RippleState",
        "LedgerIndex": "8250CE37F6495903C1F7D16E072E8823ECE06FA73F011A0F8D79D5626BF581BB",
        "PreviousFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "-52160.76470600332"
          }
        },
        "PreviousTxnID": "B4726FC087FAB3DB3578A34095B96F9055075A86A16CE741B406D91202685998",
        "PreviousTxnLgrSeq": 86722015
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Account": "rPx6Rbh8fStXeP3LwECBisownN2ZyMyzYS",
          "Balance": "52479871",
          "Flags": 0,
          "OwnerCount": 2,
         "Sequence": 86586866
        },
        "LedgerEntryType": "AccountRoot",
        "LedgerIndex": "9D398F1DEA77448C78196D6B01289A13D32DFCB4F9023A2A06338F893FA85521",
        "PreviousFields": {
          "Balance": "57479871",
          "OwnerCount": 3
        },
        "PreviousTxnID": "DCB061EC44BBF73BBC20CE0432E9D8D7C4B8B28ABA8AE5A5BA687476E7A796EF",
        "PreviousTxnLgrSeq": 86724050
      }
    },
    {
      "DeletedNode": {
        "FinalFields": {
          "ExchangeRate": "4e1566cbcc208000",
          "Flags": 0,
          "RootIndex": "DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4E1566CBCC208000",
          "TakerGetsCurrency": "0000000000000000000000000000000000000000",
          "TakerGetsIssuer": "0000000000000000000000000000000000000000",
          "TakerPaysCurrency": "0000000000000000000000005553440000000000",
          "TakerPaysIssuer": "0A20B3C85F482532A9578DBB3950B85CA06594D1"
        },
        "LedgerEntryType": "DirectoryNode",
        "LedgerIndex": "DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4E1566CBCC208000"
      }
    }
  ],
  "TransactionIndex": 5,
  "TransactionResult": "tesSUCCESS"
}
```


## AffectedNodes

The `AffectedNodes` array contains a complete list of the [ledger entries](../ledger-data/ledger-entry-types/index.md) that this transaction modified in some way. Each item in this array is an object with one top-level field indicating what happened:

- `CreatedNode` indicates that the transaction created a new ledger entry.
- `DeletedNode` indicates that the transaction removed a ledger entry
- `ModifiedNode` indicates that the transaction modified an existing ledger entry.

The value of each of these fields is a JSON object describing the changes made to the ledger entry.


### CreatedNode Fields

A `CreatedNode` object contains the following fields:

| Field             | Value             | Description                                                                                                                                                                                                                                                                          |
| :---------------- | :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LedgerEntryType` | String            | The [type of ledger entry](../ledger-data/ledger-entry-types/index.md) that was created.                                                                                                                                                                                             |
| `LedgerIndex`     | String - [Hash][] | The [ID of this ledger entry](../ledger-data/common-fields.md) in the ledger's [state tree](../../../concepts/ledgers/index.md). **Note:** This is **not the same** as a [ledger index](../data-types/basic-data-types.md#ledger-index), even though the field name is very similar. |
| `NewFields`       | Object            | The content fields of the newly created ledger entry. Which fields are present depends on what type of ledger entry was created.                                                                                                                                                     |


### DeletedNode Fields

A `DeletedNode` object contains the following fields:

| Field             | Value             | Description                                                                                                                                                                                                                                                                          |
| :---------------- | :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LedgerEntryType` | String            | The [type of ledger entry](../ledger-data/ledger-entry-types/index.md) that was deleted.                                                                                                                                                                                             |
| `LedgerIndex`     | String - [Hash][] | The [ID of this ledger entry](../ledger-data/common-fields.md) in the ledger's [state tree](../../../concepts/ledgers/index.md). **Note:** This is **not the same** as a [ledger index](../data-types/basic-data-types.md#ledger-index), even though the field name is very similar. |
| `FinalFields`     | Object            | The content fields of the ledger entry immediately before it was deleted. Which fields are present depends on what type of ledger entry was created.                                                                                                                                 |
| `PreviousFields` | Object             | _(May be omitted)_ Selected fields of the ledger entry before it was deleted. Which fields are present depends on what type of ledger entry was created. |


### ModifiedNode Fields

A `ModifiedNode` object contains the following fields:

| Field               | Value                     | Description                                                                                                                                                                                                                                                                            |
| :------------------ | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LedgerEntryType`   | String                    | The [type of ledger entry](../ledger-data/ledger-entry-types/index.md) that was modified.                                                                                                                                                                                              |
| `LedgerIndex`       | String - [Hash][]         | The [ID of this ledger entry](../ledger-data/common-fields.md) in the ledger's [state tree](../../../concepts/ledgers/index.md). **Note:** This is **not the same** as a [ledger index](../data-types/basic-data-types.md#ledger-index), even though the field name is very similar.   |
| `FinalFields`       | Object                    | The content fields of the ledger entry after applying any changes from this transaction. Which fields are present depends on what type of ledger entry was created. This omits the `PreviousTxnID` and `PreviousTxnLgrSeq` fields, even though most types of ledger entries have them. |
| `PreviousFields`    | Object                    | The previous values for all fields of the object that were changed as a result of this transaction. If the transaction _only added_ fields to the object, this field is an empty object.                                                                                               |
| `PreviousTxnID`     | String - [Hash][]         | _(May be omitted)_ The [identifying hash][] of the previous transaction to modify this ledger entry. Omitted for ledger entry types that do not have a `PreviousTxnID` field.                                                                                                          |
| `PreviousTxnLgrSeq` | Number - [Ledger Index][] | _(May be omitted)_  The [Ledger Index][] of the ledger version containing the previous transaction to modify this ledger entry. Omitted for ledger entry types that do not have a `PreviousTxnLgrSeq` field.                                                                           |

**Note:** If the modified ledger entry has `PreviousTxnID` and `PreviousTxnLgrSeq` fields, the transaction always updates them with the transaction's own identifying hash and the index of the ledger version that included the transaction, but these fields' new value is not listed in the `FinalFields` of the `ModifiedNode` object, and their previous values are listed at the top level of the `ModifiedNode` object rather than in the nested `PreviousFields` object.


## NFT Fields

Transactions (`tx` and `account_tx`) involving NFTs can contain the following fields in the metadata. These values are added by the Clio server at request time and are not stored in the hashed binary metadata:

| Field         | Value  | Description                                                                                                                                                                                                                       |
| :------------ | :----- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nftoken_id`  | String | Shows the `NFTokenID` for the `NFToken` that changed on the ledger as a result of the transaction. Only present if the transaction is `NFTokenMint` or `NFTokenAcceptOffer`. See [NFTokenID](../data-types/nftoken.md#nftokenid). |
| `nftoken_ids` | Array  | Shows all the `NFTokenIDs` for the `NFTokens` that changed on the ledger as a result of the transaction. Only present if the transaction is `NFTokenCancelOffer`.                                                                 |
| `offer_id`    | String | Shows the `OfferID`of a new `NFTokenOffer` in a response from a `NFTokenCreateOffer` transaction.                                                                                                                                 |


## delivered_amount

The `Amount` of a [Payment transaction][] indicates the amount to deliver to the `Destination`, so if the transaction was successful, then the destination received that much -- **except if the transaction was a [partial payment](../../../concepts/payment-types/partial-payments.md)**. (In that case, any positive amount up to `Amount` might have arrived.) Rather than choosing whether or not to trust the `Amount` field, you should use the `delivered_amount` field of the metadata to see how much actually reached its destination.

The `rippled` server provides a `delivered_amount` field in JSON transaction metadata for all successful Payment transactions. This field is formatted like a normal currency amount. However, the delivered amount is not available for transactions that meet both of the following criteria:

* Is a partial payment
* Included in a validated ledger before 2014-01-20

If both conditions are true, then `delivered_amount` contains the string value `unavailable` instead of an actual amount. If this happens, you can only figure out the actual delivered amount by reading the `AffectedNodes` in the transaction's metadata.

**Note:** The `delivered_amount` field is generated on-demand for the request, and is not included in the binary format for transaction metadata, nor is it used when calculating the [hash](../data-types/basic-data-types.md#hashes) of the transaction metadata. In contrast, the `DeliveredAmount` field _is_ included in the binary format for partial payment transactions after 2014-01-20.

See also: [Partial Payments](../../../concepts/payment-types/partial-payments.md)

<!--{# Spell-check can ignore these field names used in headings #}-->
<!-- SPELLING_IGNORE: affectednodes, creatednode, deletednode, modifiednode, delivered_amount -->

{% raw-partial file="/docs/_snippets/common-links.md" /%}
