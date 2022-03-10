---
html: checkcreate.html
parent: transaction-types.html
blurb: Create a check.
labels:
  - Checks
---
# CheckCreate
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/CreateCheck.cpp "Source")

_(Added by the [Checks amendment][].)_

Create a Check object in the ledger, which is a deferred payment that can be cashed by its intended destination. The sender of this transaction is the sender of the Check.

## Example {{currentpage.name}} JSON

```json
{
  "TransactionType": "CheckCreate",
  "Account": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
  "Destination": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
  "SendMax": "100000000",
  "Expiration": 570113521,
  "InvoiceID": "6F1DFD1D0FE8A32E40E1F2C05CF1C15545BAB56B617F9C6C2D63A6B704BEF59B",
  "DestinationTag": 1,
  "Fee": "12"
}
```

## {{currentpage.name}} Testnet Transaction
```json
{
  "id": 1,
  "result": {
    "Account": "rJ21pxdiBbJ7To89HwZUFZUEbQceQiwwb2",
    "Destination": "rNmhMtto25Ty4yMEF3vdJaN7TyMh96oWi3",
    "DestinationTag": 1,
    "Expiration": 699993521,
    "Fee": "10",
    "Flags": 0,
    "LastLedgerSequence": 25549480,
    "SendMax": "110",
    "Sequence": 25549361,
    "SigningPubKey": "02399D64DC877997ABCA3FE6B112357F8A0A25993395DED6BB432463DF4B8B6292",
    "TransactionType": "CheckCreate",
    "TxnSignature": "3045022100F6BCE9C2C54B46A9F3CCEDAC3A7A963FE6AC279610A4FDDE84D5F55BE39F4DEF0220052AA44F147D4006CE6E22CEA6203E8D950248EBFA6AB13819C70A4B01543276",
    "date": 698978502,
    "hash": "AFED6CA221167C5E014D1A19060AD92DEDF40F8C611C0D3A9632AA8D16789A57",
    "inLedger": 25549463,
    "ledger_index": 25549463,
    "meta": {
      "AffectedNodes": [
        {
          "ModifiedNode": {
            "FinalFields": {
              "Flags": 0,
              "Owner": "rJ21pxdiBbJ7To89HwZUFZUEbQceQiwwb2",
              "RootIndex": "12F5D574DA9EAF524F54311330ECC01836704763338ED7EE542FD05C172B365C"
            },
            "LedgerEntryType": "DirectoryNode",
            "LedgerIndex": "12F5D574DA9EAF524F54311330ECC01836704763338ED7EE542FD05C172B365C"
          }
        },
        {
          "ModifiedNode": {
            "LedgerEntryType": "AccountRoot",
            "LedgerIndex": "83A580E04CF2ECDFF04365B23B8745F7F03D8B986F7548C499E09503941DF434",
            "PreviousTxnID": "0AD391179073415A17CB2DFA894E6A353FAABD87F086FC7CCE392ED43AF17175",
            "PreviousTxnLgrSeq": 25549444
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Account": "rJ21pxdiBbJ7To89HwZUFZUEbQceQiwwb2",
              "Balance": "999999970",
              "Flags": 0,
              "OwnerCount": 1,
              "Sequence": 25549362
            },
            "LedgerEntryType": "AccountRoot",
            "LedgerIndex": "BA56500F8877155F0690793130A2E1B787E00C7EC7E5A60A058414B499BA1C35",
            "PreviousFields": {
              "Balance": "999999980",
              "OwnerCount": 0,
              "Sequence": 25549361
            },
            "PreviousTxnID": "0AD391179073415A17CB2DFA894E6A353FAABD87F086FC7CCE392ED43AF17175",
            "PreviousTxnLgrSeq": 25549444
          }
        },
        {
          "CreatedNode": {
            "LedgerEntryType": "Check",
            "LedgerIndex": "C022B13E94524A157E1189C948DE6CD8B96041A2740316517D8F0CC7A1812282",
            "NewFields": {
              "Account": "rJ21pxdiBbJ7To89HwZUFZUEbQceQiwwb2",
              "Destination": "rNmhMtto25Ty4yMEF3vdJaN7TyMh96oWi3",
              "DestinationTag": 1,
              "Expiration": 699993521,
              "SendMax": "110",
              "Sequence": 25549361
            }
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Flags": 0,
              "Owner": "rNmhMtto25Ty4yMEF3vdJaN7TyMh96oWi3",
              "RootIndex": "F1D30301B8AB2826D1AB7A03372741A1F1D9C58236B471A9F71FE03B76CA0764"
            },
            "LedgerEntryType": "DirectoryNode",
            "LedgerIndex": "F1D30301B8AB2826D1AB7A03372741A1F1D9C58236B471A9F71FE03B76CA0764"
          }
        }
      ],
      "TransactionIndex": 0,
      "TransactionResult": "tesSUCCESS"
    },
    "validated": true
  },
  "status": "success",
  "type": "response"
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->

| Field            | JSON Type           | [Internal Type][] | Description     |
|:-----------------|:--------------------|:------------------|:----------------|
| `Destination`    | String              | AccountID         | The unique address of the [account](accounts.html) that can cash the Check. |
| `SendMax`        | [Currency Amount][] | Amount            | Maximum amount of source currency the Check is allowed to debit the sender, including [transfer fees](transfer-fees.html) on non-XRP currencies. The Check can only credit the destination with the same currency (from the same issuer, for non-XRP currencies). For non-XRP amounts, the nested field names MUST be lower-case. |
| `DestinationTag` | Number              | UInt32            | _(Optional)_ Arbitrary tag that identifies the reason for the Check, or a hosted recipient to pay. |
| `Expiration`     | Number              | UInt32            | _(Optional)_ Time after which the Check is no longer valid, in [seconds since the Ripple Epoch][]. |
| `InvoiceID`      | String              | Hash256           | _(Optional)_ Arbitrary 256-bit hash representing a specific reason or identifier for this Check. |

## Error Cases

- If the `Destination` is the sender of the transaction, the transaction fails with the result code `temREDUNDANT`.
- If the `Destination` [account](accounts.html) does not exist in the ledger, the transaction fails with the result code `tecNO_DST`.
- If the `Destination` account has the `RequireDest` flag enabled but the transaction does not include a `DestinationTag` field, the transaction fails with the result code `tecDST_TAG_NEEDED`.
- If `SendMax` specifies a token which is [frozen](freezes.html), the transaction fails with the result `tecFROZEN`.
- If the `Expiration` of the transaction is in the past, the transaction fails with the result `tecEXPIRED`.
- If the sender does not have enough XRP to meet the [owner reserve](reserves.html#owner-reserves) after adding the Check, the transaction fails with the result `tecINSUFFICIENT_RESERVE`.
- If either the sender or the destination of the Check cannot own more objects in the ledger, the transaction fails with the result `tecDIR_FULL`.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
