---
seo:
  description: Execute a dry run of any transaction type to preview results and metadata.
labels:
  - Transaction Sending
---

# simulate

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/rpc/handlers/Simulate.cpp "Source")

The `simulate` method executes a dry run of _any_ transaction type, enabling you to preview the results and metadata of a transaction without committing them to the XRP Ledger. Since this command never submits a transaction to the network, it doesn't incur any fees.

{% admonition type="warning" name="Caution" %}
The `simulate` method isn't guaranteed to be the same when you actually submit a transaction because the ledger state--which affects how a transaction is processed--can change between the transaction simulation and submission.
{% /admonition %}

## Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}

```json
{
  "id": 2,
  "command": "simulate",
  "tx_json": {
    "TransactionType": "Payment",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Amount": {
      "currency": "USD",
      "value": "1",
      "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
    }
  }
}
```

{% /tab %}

{% tab label="JSON-RPC" %}

```json
{
  "method": "simulate",
  "params": [
    {
      "tx_json": {
        "TransactionType": "Payment",
        "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "Amount": {
          "currency": "USD",
          "value": "1",
          "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
        }
      }
    }
  ]
}
```

{% /tab %}

{% /tabs %}

{% try-it method="simulate" /%}

The request includes the following parameters:

| Field     | Type    | Required? | Description                                                                                                                                                              |
| --------- | ------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tx_blob` | String  | Yes       | The transaction to simulate, in [binary format](https://xrpl.org/docs/references/protocol/binary-format). If you include this field, do not also include `tx_json`.      |
| `tx_json` | Object  | Yes       | The transaction to simulate, in JSON format. If you include this field, do not also include `tx_blob`.                                                                   |
| `binary`  | Boolean | No        | The default value is `false`, which returns data and metadata in JSON format. If `true`, returns data and metadata in binary format, serialized to a hexadecimal string. |

- The simulated transaction must be unsigned.
- If the `Fee`, `Sequence`, `SigningPubKey`, or `NetworkID` fields are provided, they will be used in the transaction. Otherwise, the server will autofill them.

## Response Format

An example of a successful response:

```json
{
  "id": 2,
  "result": {
    "applied": false,
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The simulated transaction would have been applied.",
    "ledger_index": 3,
    "meta": {
      "AffectedNodes": [
        {
          "ModifiedNode": {
            "FinalFields": {
              "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
              "AccountTxnID": "4D5D90890F8D49519E4151938601EF3D0B30B16CD6A519D9C99102C9FA77F7E0",
              "Balance": "75159663",
              "Flags": 9043968,
              "OwnerCount": 5,
              "Sequence": 361,
              "TransferRate": 1004999999
            },
            "LedgerEntryType": "AccountRoot",
            "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
            "PreviousFields": {
              "AccountTxnID": "2B44EBE00728D04658E597A85EC4F71D20503B31ABBF556764AD8F7A80BA72F6",
              "Balance": "75169663",
              "Sequence": 360
            },
            "PreviousTxnID": "2B44EBE00728D04658E597A85EC4F71D20503B31ABBF556764AD8F7A80BA72F6",
            "PreviousTxnLgrSeq": 18555460
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Balance": {
                "currency": "USD",
                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                "value": "12.0301"
              },
              "Flags": 65536,
              "HighLimit": {
                "currency": "USD",
                "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "value": "0"
              },
              "HighNode": "0",
              "LowLimit": {
                "currency": "USD",
                "issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
                "value": "100"
              },
              "LowNode": "0"
            },
            "LedgerEntryType": "RippleState",
            "LedgerIndex": "96D2F43BA7AE7193EC59E5E7DDB26A9D786AB1F7C580E030E7D2FF5233DA01E9",
            "PreviousFields": {
              "Balance": {
                "currency": "USD",
                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                "value": "11.0301"
              }
            },
            "PreviousTxnID": "7FFE02667225DFE39594663DEDC823FAF188AC5F036A9C2CA3259FB5379C82B4",
            "PreviousTxnLgrSeq": 9787698
          }
        }
      ],
      "TransactionIndex": 0,
      "TransactionResult": "tesSUCCESS",
      "delivered_amount": {
        "currency": "USD",
        "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "value": "1"
      }
    },
    "tx_json": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "DeliverMax": {
        "currency": "USD",
        "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "value": "1"
      },
      "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "Fee": "10",
      "Sequence": 360,
      "TransactionType": "Payment"
    }
  },
  "status": "success",
  "type": "response"
}
```

The response follows the [standard format][], with a successful result containing the following fields:

| Field          | Type                                                                                               | Description                                                                                                                                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tx_json`      | Object                                                                                             | The transaction that was simulated, including auto-filled values. Included if `binary` was `false`.                                                                                                                                  |
| `tx_blob`      | String                                                                                             | The serialized transaction that was simulated, including auto-filled values. Included if `binary` was `true`.                                                                                                                        |
| `ledger_index` | [Ledger Index](https://xrpl.org/docs/references/protocol/data-types/basic-data-types#ledger-index) | The ledger index of the ledger that would have included this transaction.                                                                                                                                                            |
| `meta`         | Object                                                                                             | Transaction metadata, which describes the results of the transaction. Not included if the transaction fails with a code that means it wouldn’t be included in the ledger (such as a non-TEC code). Included if `binary` was `false`. |
| `meta_blob`    | String                                                                                             | Transaction metadata, which describes the results of the transaction. Not included if the transaction fails with a code that means it wouldn’t be included in the ledger (such as a non-TEC code). Included if `binary` was `true`.  |

## Possible Errors

- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
- `transactionSigned` - The transaction was signed. The simulated transaction must be unsigned.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
