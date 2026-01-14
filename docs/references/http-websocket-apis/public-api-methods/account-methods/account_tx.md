---
seo:
    description: Get a list of transactions affecting an account.
labels:
    - Payments
    - Accounts
---
# account_tx
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/rpc/handlers/AccountTx.cpp "Source")

The `account_tx` method retrieves a list of validated transactions that involve a given account.

## Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "example_account_tx",
  "command": "account_tx",
  "account": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
  "ledger_index_min": -1,
  "ledger_index_max": -1,
  "binary": false,
  "limit": 2,
  "forward": false,
  "api_version": 2
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "account_tx",
    "params": [
        {
            "account": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
            "binary": false,
            "forward": false,
            "ledger_index_max": -1,
            "ledger_index_min": -1,
            "limit": 2,
            "api_version": 2
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
# Syntax: account_tx account [ledger_index_min [ledger_index_max]] [limit] [offset] [binary] [count] [descending]
# For binary/count/descending, use the parameter name for true and omit for false.
rippled -- account_tx rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w -1 -1 2 0 binary descending
```
{% /tab %}

{% /tabs %}

{% try-it method="account_tx" /%}

The request includes the following parameters:

| `Field`            | Type                                       | Description |
|:-------------------|:-------------------------------------------|:-----------|
| `account`          | String                                     | A unique identifier for the account, most commonly the account's address. |
| `tx_type`          | String                                     | _(Optional)_ **Clio Only** Return only transactions of a specific type, such as "Clawback", "AccountSet", "AccountDelete", et al. Case-insensitive. See [Transaction Types](../../../../references//protocol/transactions/types/index.md#transaction-types). [New in: Clio v2.0](https://github.com/XRPLF/clio/releases/tag/2.0.0 "BADGE_BLUE") [AMM support since: Clio v2.1.0](https://github.com/XRPLF/clio/releases/tag/2.1.0 "BADGE_GREEN") |
| `ledger_index_min` | Integer                                    | _(Optional)_ Use to specify the earliest ledger to include transactions from. A value of `-1` instructs the server to use the earliest validated ledger version available. |
| `ledger_index_max` | Integer                                    | _(Optional)_ Use to specify the most recent ledger to include transactions from. A value of `-1` instructs the server to use the most recent validated ledger version available. |
| `ledger_hash`      | String                                     | _(Optional)_ Use to look for transactions from a single ledger only. (See [Specifying Ledgers][].) |
| `ledger_index`     | String or Unsigned Integer                 | _(Optional)_ Use to look for transactions from a single ledger only. (See [Specifying Ledgers][].) |
| `binary`           | Boolean                                    | _(Optional)_ Defaults to `false`. If set to `true`, returns transactions as hex strings instead of JSON. |
| `forward`          | Boolean                                    | _(Optional)_ Defaults to `false`. If set to `true`, returns values indexed with the oldest ledger first. Otherwise, the results are indexed with the newest ledger first. (Each page of results may not be internally ordered, but the pages are overall ordered.) |
| `limit`            | Integer                                    | _(Optional)_ Default varies. Limit the number of transactions to retrieve. The server is not required to honor this value. |
| `marker`           | [Marker][] | Value from a previous paginated response. Resume retrieving data where that response left off. This value is stable even if there is a change in the server's range of available ledgers. |

- [API v2]: If you specify either `ledger_index` or `ledger_hash`, including `ledger_index_min` and `ledger_index_max` returns an `invalidParams` error.


### Iterating over queried data

As with other paginated methods, you can use the `marker` field to return multiple pages of data.

In the time between requests, `"ledger_index_min": -1` and `"ledger_index_max": -1` may change to refer to different ledger versions than they did before. The `marker` field can safely paginate even if there are changes in the ledger range from the request, so long as the marker does not indicate a point outside the range of ledgers specified in the request.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "account": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
    "ledger_index_min": 32570,
    "ledger_index_max": 100973977,
    "transactions": [
      {
        "meta": {
          "AffectedNodes": [
            {
              "ModifiedNode": {
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "140FA03FE8C39540CA8189BC7A7956795C712BC0A542C6409C041150703C8574",
                "PreviousTxnID": "33BD699AEFAC9B5CEE05495FE7590F71B58BAC8BCFB70A9E5FAF149EF9D2E116",
                "PreviousTxnLgrSeq": 98918099
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Flags": 0,
                  "Owner": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                  "RootIndex": "31ECB4AC7F3713FB1FD97E07F5F4589FF872D746AB1B8BA604BA40ED8F9F3CD2"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "31ECB4AC7F3713FB1FD97E07F5F4589FF872D746AB1B8BA604BA40ED8F9F3CD2",
                "PreviousTxnID": "565B7B3D2DBE8EF1206A195965DC82413C7D0EE81CFAA99F79EE419217237F7C",
                "PreviousTxnLgrSeq": 98918107
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Flags": 0,
                  "Owner": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                  "RootIndex": "347C7476C61B99D4E7F6BBECDA911220042020C92A3E209282B69290BAE2F395"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "347C7476C61B99D4E7F6BBECDA911220042020C92A3E209282B69290BAE2F395",
                "PreviousTxnID": "33BD699AEFAC9B5CEE05495FE7590F71B58BAC8BCFB70A9E5FAF149EF9D2E116",
                "PreviousTxnLgrSeq": 98918099
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                  "Balance": "24799961",
                  "Flags": 0,
                  "OwnerCount": 4,
                  "Sequence": 98916980
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "6221E36CC407593A1E74EC8BDCEF82BFF1C4275B92FC4D6877AA9013214133CA",
                "PreviousFields": {
                  "Balance": "24799971",
                  "OwnerCount": 3,
                  "Sequence": 98916979
                },
                "PreviousTxnID": "565B7B3D2DBE8EF1206A195965DC82413C7D0EE81CFAA99F79EE419217237F7C",
                "PreviousTxnLgrSeq": 98918107
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "RippleState",
                "LedgerIndex": "BCDE567C108FB674AA379BCDBEFF705899B38A39535A1EFA23E9906F96403A9F",
                "NewFields": {
                  "Balance": {
                    "currency": "BTC",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                  },
                  "Flags": 1179648,
                  "HighLimit": {
                    "currency": "BTC",
                    "issuer": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                    "value": "10"
                  },
                  "LowLimit": {
                    "currency": "BTC",
                    "issuer": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                    "value": "0"
                  }
                }
              }
            }
          ],
          "TransactionIndex": 68,
          "TransactionResult": "tesSUCCESS"
        },
        "tx_json": {
          "Account": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
          "Fee": "10",
          "LastLedgerSequence": 98918129,
          "LimitAmount": {
            "currency": "BTC",
            "issuer": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
            "value": "10"
          },
          "Sequence": 98916979,
          "SigningPubKey": "ED954DCBC5CB557C330BEAB71D36A18DEED0CAA5DE5A8FF8C9589A49D3253B50CF",
          "TransactionType": "TrustSet",
          "TxnSignature": "23EE556A37E6E5A4C16B87489CE7E0A5E0FFDAC5DB4B5DA3A6682FA355A8258025DA0EF6F920116080AB7196C4CF82D37760CBB6EEA6E199B9DCC29BD6BC7A09",
          "ledger_index": 98918111,
          "ctid": "C5E55EDF00440000",
          "date": 811446652
        },
        "ledger_index": 98918111,
        "hash": "C58EB987B4AC3AE984ADF70DE375AD9B8A180569C30072DE57D6E17EFC69E7F0",
        "ledger_hash": "3A134DDA87A60A2531B9B9D504FA6EBDAC99738B0DB20C476BCD6196592B08B2",
        "close_time_iso": "2025-09-17T17:50:52Z",
        "validated": true
      },
      {
        "meta": {
          "AffectedNodes": [
            {
              "ModifiedNode": {
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "140FA03FE8C39540CA8189BC7A7956795C712BC0A542C6409C041150703C8574",
                "PreviousTxnID": "5E5313BA3C55755ED3FDACB53C53A7143997D997DAF5FB5C24B83C6B995D6363",
                "PreviousTxnLgrSeq": 98055207
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "31ECB4AC7F3713FB1FD97E07F5F4589FF872D746AB1B8BA604BA40ED8F9F3CD2",
                "NewFields": {
                  "Owner": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                  "RootIndex": "31ECB4AC7F3713FB1FD97E07F5F4589FF872D746AB1B8BA604BA40ED8F9F3CD2"
                }
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Flags": 0,
                  "Owner": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                  "RootIndex": "347C7476C61B99D4E7F6BBECDA911220042020C92A3E209282B69290BAE2F395"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "347C7476C61B99D4E7F6BBECDA911220042020C92A3E209282B69290BAE2F395"
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                  "Balance": "24799991",
                  "Flags": 0,
                  "OwnerCount": 1,
                  "Sequence": 98916977
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "6221E36CC407593A1E74EC8BDCEF82BFF1C4275B92FC4D6877AA9013214133CA",
                "PreviousFields": {
                  "Balance": "24800001",
                  "OwnerCount": 0,
                  "Sequence": 98916976
                },
                "PreviousTxnID": "71BBF54C1EABA54B375702085EA089037909B1B2B6F618979131C1ECD4337575",
                "PreviousTxnLgrSeq": 98916982
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "RippleState",
                "LedgerIndex": "CE8F932A1CA2D2EDEAA1267BAEE88978BAA886034C389B76FB242860A82572A6",
                "NewFields": {
                  "Balance": {
                    "currency": "USD",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                  },
                  "Flags": 1179648,
                  "HighLimit": {
                    "currency": "USD",
                    "issuer": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                    "value": "10000"
                  },
                  "LowLimit": {
                    "currency": "USD",
                    "issuer": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                    "value": "0"
                  }
                }
              }
            }
          ],
          "TransactionIndex": 20,
          "TransactionResult": "tesSUCCESS"
        },
        "tx_json": {
          "Account": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
          "Fee": "10",
          "LastLedgerSequence": 98918117,
          "LimitAmount": {
            "currency": "USD",
            "issuer": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
            "value": "10000"
          },
          "Sequence": 98916976,
          "SigningPubKey": "ED954DCBC5CB557C330BEAB71D36A18DEED0CAA5DE5A8FF8C9589A49D3253B50CF",
          "TransactionType": "TrustSet",
          "TxnSignature": "785C1D134E017F1C0C6168427F208950679DA90D4C90E479DB397DF8E2D3FEEED24466A63B1A18A41AEB6BE1806497E5314AF7B55939B6B8EF20F3E3876CF400",
          "ledger_index": 98918099,
          "ctid": "C5E55ED300140000",
          "date": 811446610
        },
        "ledger_index": 98918099,
        "hash": "33BD699AEFAC9B5CEE05495FE7590F71B58BAC8BCFB70A9E5FAF149EF9D2E116",
        "ledger_hash": "EBA54645E31446A2A79F60F6241B357EFFEB98A6F43E17B7B2F1EE4E80C132D6",
        "close_time_iso": "2025-09-17T17:50:10Z",
        "validated": true
      }
    ],
    "validated": true,
    "marker": {
      "ledger": 98918099,
      "seq": 20
    },
    "limit": 2
  },
  "id": "example_account_tx",
  "api_version": 2,
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
  "result": {
    "account": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
    "ledger_index_min": 32570,
    "ledger_index_max": 100974014,
    "transactions": [
      {
        "meta": {
          "AffectedNodes": [
            {
              "ModifiedNode": {
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "140FA03FE8C39540CA8189BC7A7956795C712BC0A542C6409C041150703C8574",
                "PreviousTxnID": "33BD699AEFAC9B5CEE05495FE7590F71B58BAC8BCFB70A9E5FAF149EF9D2E116",
                "PreviousTxnLgrSeq": 98918099
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Flags": 0,
                  "Owner": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                  "RootIndex": "31ECB4AC7F3713FB1FD97E07F5F4589FF872D746AB1B8BA604BA40ED8F9F3CD2"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "31ECB4AC7F3713FB1FD97E07F5F4589FF872D746AB1B8BA604BA40ED8F9F3CD2",
                "PreviousTxnID": "565B7B3D2DBE8EF1206A195965DC82413C7D0EE81CFAA99F79EE419217237F7C",
                "PreviousTxnLgrSeq": 98918107
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Flags": 0,
                  "Owner": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                  "RootIndex": "347C7476C61B99D4E7F6BBECDA911220042020C92A3E209282B69290BAE2F395"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "347C7476C61B99D4E7F6BBECDA911220042020C92A3E209282B69290BAE2F395",
                "PreviousTxnID": "33BD699AEFAC9B5CEE05495FE7590F71B58BAC8BCFB70A9E5FAF149EF9D2E116",
                "PreviousTxnLgrSeq": 98918099
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                  "Balance": "24799961",
                  "Flags": 0,
                  "OwnerCount": 4,
                  "Sequence": 98916980
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "6221E36CC407593A1E74EC8BDCEF82BFF1C4275B92FC4D6877AA9013214133CA",
                "PreviousFields": {
                  "Balance": "24799971",
                  "OwnerCount": 3,
                  "Sequence": 98916979
                },
                "PreviousTxnID": "565B7B3D2DBE8EF1206A195965DC82413C7D0EE81CFAA99F79EE419217237F7C",
                "PreviousTxnLgrSeq": 98918107
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "RippleState",
                "LedgerIndex": "BCDE567C108FB674AA379BCDBEFF705899B38A39535A1EFA23E9906F96403A9F",
                "NewFields": {
                  "Balance": {
                    "currency": "BTC",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                  },
                  "Flags": 1179648,
                  "HighLimit": {
                    "currency": "BTC",
                    "issuer": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                    "value": "10"
                  },
                  "LowLimit": {
                    "currency": "BTC",
                    "issuer": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                    "value": "0"
                  }
                }
              }
            }
          ],
          "TransactionIndex": 68,
          "TransactionResult": "tesSUCCESS"
        },
        "tx_json": {
          "Account": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
          "Fee": "10",
          "LastLedgerSequence": 98918129,
          "LimitAmount": {
            "currency": "BTC",
            "issuer": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
            "value": "10"
          },
          "Sequence": 98916979,
          "SigningPubKey": "ED954DCBC5CB557C330BEAB71D36A18DEED0CAA5DE5A8FF8C9589A49D3253B50CF",
          "TransactionType": "TrustSet",
          "TxnSignature": "23EE556A37E6E5A4C16B87489CE7E0A5E0FFDAC5DB4B5DA3A6682FA355A8258025DA0EF6F920116080AB7196C4CF82D37760CBB6EEA6E199B9DCC29BD6BC7A09",
          "ledger_index": 98918111,
          "ctid": "C5E55EDF00440000",
          "date": 811446652
        },
        "ledger_index": 98918111,
        "hash": "C58EB987B4AC3AE984ADF70DE375AD9B8A180569C30072DE57D6E17EFC69E7F0",
        "ledger_hash": "3A134DDA87A60A2531B9B9D504FA6EBDAC99738B0DB20C476BCD6196592B08B2",
        "close_time_iso": "2025-09-17T17:50:52Z",
        "validated": true
      },
      {
        "meta": {
          "AffectedNodes": [
            {
              "ModifiedNode": {
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "140FA03FE8C39540CA8189BC7A7956795C712BC0A542C6409C041150703C8574",
                "PreviousTxnID": "5E5313BA3C55755ED3FDACB53C53A7143997D997DAF5FB5C24B83C6B995D6363",
                "PreviousTxnLgrSeq": 98055207
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "31ECB4AC7F3713FB1FD97E07F5F4589FF872D746AB1B8BA604BA40ED8F9F3CD2",
                "NewFields": {
                  "Owner": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                  "RootIndex": "31ECB4AC7F3713FB1FD97E07F5F4589FF872D746AB1B8BA604BA40ED8F9F3CD2"
                }
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Flags": 0,
                  "Owner": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                  "RootIndex": "347C7476C61B99D4E7F6BBECDA911220042020C92A3E209282B69290BAE2F395"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "347C7476C61B99D4E7F6BBECDA911220042020C92A3E209282B69290BAE2F395"
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                  "Balance": "24799991",
                  "Flags": 0,
                  "OwnerCount": 1,
                  "Sequence": 98916977
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "6221E36CC407593A1E74EC8BDCEF82BFF1C4275B92FC4D6877AA9013214133CA",
                "PreviousFields": {
                  "Balance": "24800001",
                  "OwnerCount": 0,
                  "Sequence": 98916976
                },
                "PreviousTxnID": "71BBF54C1EABA54B375702085EA089037909B1B2B6F618979131C1ECD4337575",
                "PreviousTxnLgrSeq": 98916982
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "RippleState",
                "LedgerIndex": "CE8F932A1CA2D2EDEAA1267BAEE88978BAA886034C389B76FB242860A82572A6",
                "NewFields": {
                  "Balance": {
                    "currency": "USD",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                  },
                  "Flags": 1179648,
                  "HighLimit": {
                    "currency": "USD",
                    "issuer": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                    "value": "10000"
                  },
                  "LowLimit": {
                    "currency": "USD",
                    "issuer": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                    "value": "0"
                  }
                }
              }
            }
          ],
          "TransactionIndex": 20,
          "TransactionResult": "tesSUCCESS"
        },
        "tx_json": {
          "Account": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
          "Fee": "10",
          "LastLedgerSequence": 98918117,
          "LimitAmount": {
            "currency": "USD",
            "issuer": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
            "value": "10000"
          },
          "Sequence": 98916976,
          "SigningPubKey": "ED954DCBC5CB557C330BEAB71D36A18DEED0CAA5DE5A8FF8C9589A49D3253B50CF",
          "TransactionType": "TrustSet",
          "TxnSignature": "785C1D134E017F1C0C6168427F208950679DA90D4C90E479DB397DF8E2D3FEEED24466A63B1A18A41AEB6BE1806497E5314AF7B55939B6B8EF20F3E3876CF400",
          "ledger_index": 98918099,
          "ctid": "C5E55ED300140000",
          "date": 811446610
        },
        "ledger_index": 98918099,
        "hash": "33BD699AEFAC9B5CEE05495FE7590F71B58BAC8BCFB70A9E5FAF149EF9D2E116",
        "ledger_hash": "EBA54645E31446A2A79F60F6241B357EFFEB98A6F43E17B7B2F1EE4E80C132D6",
        "close_time_iso": "2025-09-17T17:50:10Z",
        "validated": true
      }
    ],
    "validated": true,
    "marker": {
      "ledger": 98918099,
      "seq": 20
    },
    "limit": 2,
    "status": "success"
  }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
Loading: "/etc/opt/ripple/rippled.cfg"
2025-Dec-19 03:16:00.638871262 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005

{
  "result": {
    "account": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
    "ledger_index_min": 32570,
    "ledger_index_max": 100974014,
    "transactions": [
      {
        "meta": {
          "AffectedNodes": [
            {
              "ModifiedNode": {
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "140FA03FE8C39540CA8189BC7A7956795C712BC0A542C6409C041150703C8574",
                "PreviousTxnID": "33BD699AEFAC9B5CEE05495FE7590F71B58BAC8BCFB70A9E5FAF149EF9D2E116",
                "PreviousTxnLgrSeq": 98918099
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Flags": 0,
                  "Owner": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                  "RootIndex": "31ECB4AC7F3713FB1FD97E07F5F4589FF872D746AB1B8BA604BA40ED8F9F3CD2"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "31ECB4AC7F3713FB1FD97E07F5F4589FF872D746AB1B8BA604BA40ED8F9F3CD2",
                "PreviousTxnID": "565B7B3D2DBE8EF1206A195965DC82413C7D0EE81CFAA99F79EE419217237F7C",
                "PreviousTxnLgrSeq": 98918107
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Flags": 0,
                  "Owner": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                  "RootIndex": "347C7476C61B99D4E7F6BBECDA911220042020C92A3E209282B69290BAE2F395"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "347C7476C61B99D4E7F6BBECDA911220042020C92A3E209282B69290BAE2F395",
                "PreviousTxnID": "33BD699AEFAC9B5CEE05495FE7590F71B58BAC8BCFB70A9E5FAF149EF9D2E116",
                "PreviousTxnLgrSeq": 98918099
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                  "Balance": "24799961",
                  "Flags": 0,
                  "OwnerCount": 4,
                  "Sequence": 98916980
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "6221E36CC407593A1E74EC8BDCEF82BFF1C4275B92FC4D6877AA9013214133CA",
                "PreviousFields": {
                  "Balance": "24799971",
                  "OwnerCount": 3,
                  "Sequence": 98916979
                },
                "PreviousTxnID": "565B7B3D2DBE8EF1206A195965DC82413C7D0EE81CFAA99F79EE419217237F7C",
                "PreviousTxnLgrSeq": 98918107
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "RippleState",
                "LedgerIndex": "BCDE567C108FB674AA379BCDBEFF705899B38A39535A1EFA23E9906F96403A9F",
                "NewFields": {
                  "Balance": {
                    "currency": "BTC",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                  },
                  "Flags": 1179648,
                  "HighLimit": {
                    "currency": "BTC",
                    "issuer": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                    "value": "10"
                  },
                  "LowLimit": {
                    "currency": "BTC",
                    "issuer": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                    "value": "0"
                  }
                }
              }
            }
          ],
          "TransactionIndex": 68,
          "TransactionResult": "tesSUCCESS"
        },
        "tx_json": {
          "Account": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
          "Fee": "10",
          "LastLedgerSequence": 98918129,
          "LimitAmount": {
            "currency": "BTC",
            "issuer": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
            "value": "10"
          },
          "Sequence": 98916979,
          "SigningPubKey": "ED954DCBC5CB557C330BEAB71D36A18DEED0CAA5DE5A8FF8C9589A49D3253B50CF",
          "TransactionType": "TrustSet",
          "TxnSignature": "23EE556A37E6E5A4C16B87489CE7E0A5E0FFDAC5DB4B5DA3A6682FA355A8258025DA0EF6F920116080AB7196C4CF82D37760CBB6EEA6E199B9DCC29BD6BC7A09",
          "ledger_index": 98918111,
          "ctid": "C5E55EDF00440000",
          "date": 811446652
        },
        "ledger_index": 98918111,
        "hash": "C58EB987B4AC3AE984ADF70DE375AD9B8A180569C30072DE57D6E17EFC69E7F0",
        "ledger_hash": "3A134DDA87A60A2531B9B9D504FA6EBDAC99738B0DB20C476BCD6196592B08B2",
        "close_time_iso": "2025-09-17T17:50:52Z",
        "validated": true
      },
      {
        "meta": {
          "AffectedNodes": [
            {
              "ModifiedNode": {
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "140FA03FE8C39540CA8189BC7A7956795C712BC0A542C6409C041150703C8574",
                "PreviousTxnID": "5E5313BA3C55755ED3FDACB53C53A7143997D997DAF5FB5C24B83C6B995D6363",
                "PreviousTxnLgrSeq": 98055207
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "31ECB4AC7F3713FB1FD97E07F5F4589FF872D746AB1B8BA604BA40ED8F9F3CD2",
                "NewFields": {
                  "Owner": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                  "RootIndex": "31ECB4AC7F3713FB1FD97E07F5F4589FF872D746AB1B8BA604BA40ED8F9F3CD2"
                }
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Flags": 0,
                  "Owner": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                  "RootIndex": "347C7476C61B99D4E7F6BBECDA911220042020C92A3E209282B69290BAE2F395"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "347C7476C61B99D4E7F6BBECDA911220042020C92A3E209282B69290BAE2F395"
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                  "Balance": "24799991",
                  "Flags": 0,
                  "OwnerCount": 1,
                  "Sequence": 98916977
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "6221E36CC407593A1E74EC8BDCEF82BFF1C4275B92FC4D6877AA9013214133CA",
                "PreviousFields": {
                  "Balance": "24800001",
                  "OwnerCount": 0,
                  "Sequence": 98916976
                },
                "PreviousTxnID": "71BBF54C1EABA54B375702085EA089037909B1B2B6F618979131C1ECD4337575",
                "PreviousTxnLgrSeq": 98916982
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "RippleState",
                "LedgerIndex": "CE8F932A1CA2D2EDEAA1267BAEE88978BAA886034C389B76FB242860A82572A6",
                "NewFields": {
                  "Balance": {
                    "currency": "USD",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                  },
                  "Flags": 1179648,
                  "HighLimit": {
                    "currency": "USD",
                    "issuer": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
                    "value": "10000"
                  },
                  "LowLimit": {
                    "currency": "USD",
                    "issuer": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                    "value": "0"
                  }
                }
              }
            }
          ],
          "TransactionIndex": 20,
          "TransactionResult": "tesSUCCESS"
        },
        "tx_json": {
          "Account": "r48QyLLbot7VCfw325LrXAUtP6CRfU3tb4",
          "Fee": "10",
          "LastLedgerSequence": 98918117,
          "LimitAmount": {
            "currency": "USD",
            "issuer": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
            "value": "10000"
          },
          "Sequence": 98916976,
          "SigningPubKey": "ED954DCBC5CB557C330BEAB71D36A18DEED0CAA5DE5A8FF8C9589A49D3253B50CF",
          "TransactionType": "TrustSet",
          "TxnSignature": "785C1D134E017F1C0C6168427F208950679DA90D4C90E479DB397DF8E2D3FEEED24466A63B1A18A41AEB6BE1806497E5314AF7B55939B6B8EF20F3E3876CF400",
          "ledger_index": 98918099,
          "ctid": "C5E55ED300140000",
          "date": 811446610
        },
        "ledger_index": 98918099,
        "hash": "33BD699AEFAC9B5CEE05495FE7590F71B58BAC8BCFB70A9E5FAF149EF9D2E116",
        "ledger_hash": "EBA54645E31446A2A79F60F6241B357EFFEB98A6F43E17B7B2F1EE4E80C132D6",
        "close_time_iso": "2025-09-17T17:50:10Z",
        "validated": true
      }
    ],
    "validated": true,
    "marker": {
      "ledger": 98918099,
      "seq": 20
    },
    "limit": 2,
    "status": "success"
  }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

{% tabs %}

{% tab label="API v2" %}

| `Field`            | Type                       | Description                |
|:-------------------|:---------------------------|:---------------------------|
| `account`          | String                     | Unique [Address][] identifying the related account |
| `ledger_index_min` | Integer - [Ledger Index][] | The ledger index of the earliest ledger actually searched for transactions. |
| `ledger_index_max` | Integer - [Ledger Index][] | The ledger index of the most recent ledger actually searched for transactions. |
| `limit`            | Integer                    | The `limit` value used in the request. (This may differ from the actual limit value enforced by the server.) |
| `marker`           | [Marker][]                 | Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. |
| `transactions`     | Array                      | Array of transactions matching the request's criteria, as explained below. |
| `validated`        | Boolean                    | If included and set to `true`, the information in this response comes from a validated ledger version. Otherwise, the information is subject to change. |

{% admonition type="info" name="Note" %}The server may respond with different values of `ledger_index_min` and `ledger_index_max` than you provided in the request, for example if it did not have the versions you specified on hand.{% /admonition %}

Each transaction object includes the following fields, depending on whether it was requested in JSON or hex string (`"binary":true`) format.

| `Field`          | Type            | Description              |
|:-----------------|:----------------|:-------------------------|
| `close_time_iso` | String          | The time the ledger containing this transaction was closed, in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format. |
| `hash`           | String          | The unique hash identifier of the transaction. |
| `ledger_hash`    | String          | A hex string of the ledger version that included this transaction. |
| `ledger_index`   | Integer         | The [ledger index][] of the ledger version that included this transaction. |
| `tx_json`        | Object (JSON)   | (JSON mode) JSON object defining the transaction. |
| `tx_blob`        | String (Binary) | (Binary mode) A unique hex string defining the transaction. |
| `meta`           | Object (JSON)   | (JSON mode) The transaction results metadata in JSON. |
| `meta_blob`      | String (Binary) | (Binary mode) The transaction results metadata as a hex string. |
| `validated`      | Boolean         | Whether or not the transaction is included in a validated ledger. Any transaction not yet in a validated ledger is subject to change. |

{% /tab %}

{% tab label="API v1" %}

| `Field`            | Type                       | Description                |
|:-------------------|:---------------------------|:---------------------------|
| `account`          | String                     | Unique [Address][] identifying the related account |
| `ledger_index_min` | Integer - [Ledger Index][] | The ledger index of the earliest ledger actually searched for transactions. |
| `ledger_index_max` | Integer - [Ledger Index][] | The ledger index of the most recent ledger actually searched for transactions. |
| `limit`            | Integer                    | The `limit` value used in the request. (This may differ from the actual limit value enforced by the server.) |
| `marker`           | [Marker][]                 | Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. |
| `transactions`     | Array                      | Array of transactions matching the request's criteria, as explained below. |
| `validated`        | Boolean                    | If included and set to `true`, the information in this response comes from a validated ledger version. Otherwise, the information is subject to change. |

{% admonition type="info" name="Note" %}The server may respond with different values of `ledger_index_min` and `ledger_index_max` than you provided in the request, for example if it did not have the versions you specified on hand.{% /admonition %}

Each transaction object includes the following fields, depending on whether it was requested in JSON or hex string (`"binary":true`) format.

| `Field`        | Type                             | Description              |
|:---------------|:---------------------------------|:-------------------------|
| `ledger_index` | Integer                          | The [ledger index][] of the ledger version that included this transaction. |
| `tx`           | Object                           | (JSON mode) JSON object defining the transaction. |
| `tx_blob`      | String                           | (Binary mode) Hex string representing the transaction. |
| `meta`         | Object (JSON) or String (Binary) | If `binary` is `true`, then this is a hex string of the transaction results metadata. Otherwise, the transaction results metadata is included in JSON format. |
| `validated`    | Boolean                          | Whether or not the transaction is included in a validated ledger. Any transaction not yet in a validated ledger is subject to change. |

{% /tab %}

{% /tabs %}

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing. In [API v1][], you won't receive this error if you specify:
  * `ledger_index_min` or `ledger_index_max`, but also try to specify `ledger_index` or `ledger_hash`.
  * A non-boolean value for the `binary` or `forward` fields.
* `actMalformed` - The [Address][] specified in the `account` field of the request is not formatted properly.
* `lgrIdxMalformed` - The ledger specified by the `ledger_index_min` or `ledger_index_max` does not exist, or if it does exist the server does not have it. In [API v1][], you won't receive this error if you specify a `ledger_index_min` or `ledger_index_max` value beyond the range of ledgers that the server has.
* `lgrIdxsInvalid` - Either the request specifies a `ledger_index_max` that is before the `ledger_index_min`, or the server does not have a validated ledger range because it is [not synced with the network](../../../../infrastructure/troubleshooting/server-doesnt-sync.md).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
