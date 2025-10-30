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
  "id": 2,
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
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "ledger_index_min": 32570,
    "ledger_index_max": 91824401,
    "transactions": [
      {
        "meta": {
          "AffectedNodes": [
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                  "AccountTxnID": "932CC7E9BAC1F7B9FA5381679F293EEC0A646E5E7F2F6D14C85FEE2102F0E66C",
                  "Balance": "1086222646",
                  "Domain": "6D64756F31332E636F6D",
                  "EmailHash": "98B4375E1D753E5B91627516F6D70977",
                  "Flags": 9568256,
                  "MessageKey": "0000000000000000000000070000000300",
                  "OwnerCount": 17,
                  "RegularKey": "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
                  "Sequence": 393,
                  "TicketCount": 5,
                  "TransferRate": 4294967295
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
                "PreviousFields": {
                  "Balance": "1086222601"
                },
                "PreviousTxnID": "7E50969CDEF8E12B1AD26E64B338935813624A4D1CDDC4C9457832524F0FF74C",
                "PreviousTxnLgrSeq": 89353048
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rPJARH5nLWQisdmvDAbvzwS7N32Z1kusTZ",
                  "Balance": "55022190",
                  "Flags": 0,
                  "OwnerCount": 0,
                  "Sequence": 89113341
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "C0363F86E070B70E7DA129736C3B05E509261C8668F61A7E958C4C10F17EAB90",
                "PreviousFields": {
                  "Balance": "55022245",
                  "Sequence": 89113340
                },
                "PreviousTxnID": "60D0FE881F9B1457FB1711011C6E490C22532B1D495557D6488BE3A634167CEE",
                "PreviousTxnLgrSeq": 90136515
              }
            }
          ],
          "TransactionIndex": 2,
          "TransactionResult": "tesSUCCESS",
          "delivered_amount": "45"
        },
        "tx_json": {
          "Account": "rPJARH5nLWQisdmvDAbvzwS7N32Z1kusTZ",
          "DeliverMax": "45",
          "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
          "DestinationTag": 316562,
          "Fee": "10",
          "Sequence": 89113340,
          "SigningPubKey": "EDE21591E615E1D77C8C8A7F95372D001B3DF090AB47B99729CFCBC1E4E07D35F4",
          "TransactionType": "Payment",
          "TxnSignature": "D229FEB6ED82367102AC12DE5045BE6D548CBB52E0CB8F037A23171910A6158FA3377F5118B6CEAFDB07D6D43F76FE29CC26BE1ACBC7A86C9D86E14043C66104",
          "ledger_index": 90136515,
          "date": 777284672
        },
        "ledger_index": 90136515,
        "hash": "894541402AC968C98C329A88D097170B14BF4DEB8B2A7DF377EE89DDD332E018",
        "ledger_hash": "14110F60753176E1F6A71AA084B6AD8663CBB46193CCFCDFAC02561626AA6B75",
        "close_time_iso": "2024-08-18T08:24:32Z",
        "validated": true
      },
      {
        "meta": {
          "AffectedNodes": [
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                  "AccountTxnID": "932CC7E9BAC1F7B9FA5381679F293EEC0A646E5E7F2F6D14C85FEE2102F0E66C",
                  "Balance": "1086222601",
                  "Domain": "6D64756F31332E636F6D",
                  "EmailHash": "98B4375E1D753E5B91627516F6D70977",
                  "Flags": 9568256,
                  "MessageKey": "0000000000000000000000070000000300",
                  "OwnerCount": 17,
                  "RegularKey": "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
                  "Sequence": 393,
                  "TicketCount": 5,
                  "TransferRate": 4294967295
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
                "PreviousFields": {
                  "Balance": "1086222552"
                },
                "PreviousTxnID": "EED9EB1880B951FAB3EE0DBBEB67B7ABEE3FA77F15782B6BD40342B3C23CFB75",
                "PreviousTxnLgrSeq": 89343389
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rPSDqHdMPsnkmyUX4BvBkY8rycQYwrhUqw",
                  "Balance": "52611432",
                  "Flags": 0,
                  "OwnerCount": 0,
                  "Sequence": 89196186
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "20761D2C37004C70318F7A3C5A1C35817A90A0AE56485F6E3281FB2B3F05B0C9",
                "PreviousFields": {
                  "Balance": "52611491",
                  "Sequence": 89196185
                },
                "PreviousTxnID": "BAF86C2776C08407E0FAF42D374874E10430CB8C23AD464D9D9097EA326ABE92",
                "PreviousTxnLgrSeq": 89353024
              }
            }
          ],
          "TransactionIndex": 4,
          "TransactionResult": "tesSUCCESS",
          "delivered_amount": "49"
        },
        "tx_json": {
          "Account": "rPSDqHdMPsnkmyUX4BvBkY8rycQYwrhUqw",
          "DeliverMax": "49",
          "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
          "DestinationTag": 342662134,
          "Fee": "10",
          "Sequence": 89196185,
          "SigningPubKey": "ED7E4A2970ADFCCE93D59D469322745E98CBEB3D7D5388728B3BB2268E71F30B0F",
          "TransactionType": "Payment",
          "TxnSignature": "8CE14FD18BD186694DED8C204C3FCC2A527CC24AD51C2E0B2B792D035C85D662BC1A1450A8DF04BBEC66821B362056311127C627056AC7779B385517FD3A9202",
          "ledger_index": 89353048,
          "date": 774249571
        },
        "ledger_index": 89353048,
        "hash": "7E50969CDEF8E12B1AD26E64B338935813624A4D1CDDC4C9457832524F0FF74C",
        "ledger_hash": "ED54DA98F3E495C36C2B0D9A511565E04454A1F4503B9DEE3FD39301D7625865",
        "close_time_iso": "2024-07-14T05:19:31Z",
        "validated": true
      }
    ],
    "validated": true,
    "marker": {
      "ledger": 89353048,
      "seq": 4
    },
    "limit": 2
  },
  "api_version": 2,
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "result": {
        "account": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
        "ledger_index_min": 32570,
        "ledger_index_max": 91824423,
        "transactions": [{
            "meta": {
                "AffectedNodes": [{
                    "ModifiedNode": {
                        "FinalFields": {
                            "Account": "rLJmawLfNAFNyyYHFbNErTfCrfsbmRzrTc",
                            "Balance": "77694521",
                            "Domain": "7872702D6C65646765722D746F6D6C2E68746D6C",
                            "EmailHash": "CE29D0E8928E95C3FF5BDD8CFE82F445",
                            "Flags": 8388608,
                            "MessageKey": "02000000000000000000000000A9E7611C8B9AFE2DEDA42039DBF09F3BFA185F76",
                            "OwnerCount": 26,
                            "RegularKey": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                            "Sequence": 62418073
                        },
                        "LedgerEntryType": "AccountRoot",
                        "LedgerIndex": "548E97B1F63273FC2F339CBEB8C202FBF9231C4C61BC1BA51A6239501A2F6FB9",
                        "PreviousFields": {
                            "Balance": "77694533",
                            "Sequence": 62418072
                        },
                        "PreviousTxnID": "5FDB0B2ECE005EEA87DC35B33204424D0766AB37B764F1618A6C69C06BDDD511",
                        "PreviousTxnLgrSeq": 87319056
                    }
                }],
                "TransactionIndex": 24,
                "TransactionResult": "tesSUCCESS"
            },
            "tx_json": {
                "Account": "rLJmawLfNAFNyyYHFbNErTfCrfsbmRzrTc",
                "Fee": "12",
                "Flags": 131072,
                "LastLedgerSequence": 88061884,
                "LimitAmount": {
                    "currency": "QNT",
                    "issuer": "rGPsXnzAkdv1FYKkhC59GRp3M42axDhE1d",
                    "value": "500000000"
                },
                "Sequence": 62418072,
                "SigningPubKey": "023833AB55CD985EB4F7744DC2B02D34886A71ECC0177EE59749A0113ABEE8D64A",
                "TransactionType": "TrustSet",
                "TxnSignature": "304402201B00F6D2D9C3B290B8EB3CBAB15612C16C7C06E1D5D8A8B55528D4E1762EB7110220565D2A7369884D84F324FB3CA521BA4EDAFF8F2DDDE48AF8992CF99DF0EEB3F0",
                "ledger_index": 88061876,
                "date": 769309032
            },
            "ledger_index": 88061876,
            "hash": "735E296F0F271382FF8FBBBD0058AC7330419B8A1C955388A7384E5E3D5B2FCB",
            "ledger_hash": "95B2DA521829572779128884B145DF921B4239CC74057C08EB570DD31641A8F5",
            "close_time_iso": "2024-05-18T00:57:12Z",
            "validated": true
        }, {
            "meta": {
                "AffectedNodes": [{
                    "ModifiedNode": {
                        "FinalFields": {
                            "Account": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                            "Balance": "8579705270",
                            "Flags": 131072,
                            "OwnerCount": 0,
                            "Sequence": 1152385
                        },
                        "LedgerEntryType": "AccountRoot",
                        "LedgerIndex": "140FA03FE8C39540CA8189BC7A7956795C712BC0A542C6409C041150703C8574",
                        "PreviousFields": {
                            "Balance": "8554705270"
                        },
                        "PreviousTxnID": "DB31B6D0A304777F125CAD069E2D2C60829475BC30A5DB63376C425C10B85752",
                        "PreviousTxnLgrSeq": 86879421
                    }
                }, {
                    "ModifiedNode": {
                        "FinalFields": {
                            "Account": "rpKoCafrEz7FxQZ9FfktocuBGNZZyrz4KH",
                            "Balance": "802086263",
                            "Flags": 0,
                            "OwnerCount": 0,
                            "Sequence": 60818358
                        },
                        "LedgerEntryType": "AccountRoot",
                        "LedgerIndex": "481C0CDDC838688B61B960A1EE721F657BD8E501F64141A51E9A905A1D87A2C9",
                        "PreviousFields": {
                            "Balance": "827086275",
                            "Sequence": 60818357
                        },
                        "PreviousTxnID": "7C1671C63D75EBDDD87672D1DE9D5A9EAEAF34C37BDB29D1359301B85ECEF776",
                        "PreviousTxnLgrSeq": 60818357
                    }
                }],
                "TransactionIndex": 39,
                "TransactionResult": "tesSUCCESS",
                "delivered_amount": "25000000"
            },
            "tx_json": {
                "Account": "rpKoCafrEz7FxQZ9FfktocuBGNZZyrz4KH",
                "DeliverMax": "25000000",
                "Destination": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                "DestinationTag": 997786069,
                "Fee": "12",
                "LastLedgerSequence": 87598991,
                "Sequence": 60818357,
                "SigningPubKey": "0229DA128237D9A63FBA95666C5B8794F455875D843EDF39F6C02DF07FD5B4720D",
                "TransactionType": "Payment",
                "TxnSignature": "304402203B0048779085087566AABB4B878EF30EB41D3B29581937111F2708780EE4168702203E2D3B1B73F3F8B86EE009F818B226467E3BFC444B831AE851E0E0B0FB7F49C8",
                "ledger_index": 87598983,
                "date": 767543720
            },
            "ledger_index": 87598983,
            "hash": "16DFB8551F5301E3B7D1BCEAA8DB92E9AF5D783E6DCA7C0E11FD143D988E904A",
            "ledger_hash": "2B363FD30EA376E2662777CEBDDDE22C035A87DA3CD3EA0E6125CBBC9D8A7873",
            "close_time_iso": "2024-04-27T14:35:20Z",
            "validated": true
        }],
        "validated": true,
        "marker": {
            "ledger": 87598983,
            "seq": 39
        },
        "limit": 2,
        "status": "success"
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "account" : "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
      "ledger_index_max" : 57112094,
      "ledger_index_min" : 57105464,
      "limit" : 2,
      "marker" : {
         "ledger" : 57112074,
         "seq" : 9
      },
      "status" : "success",
      "transactions" : [
         {
            "ledger_index" : 57112090,
            "meta" : "201C0000002EF8E51100612503677617551E0297F38EF4FED7004E074D246B4EA3E550D9AE0F61BE40E08D3432091D52CE56140FA03FE8C39540CA8189BC7A7956795C712BC0A542C6409C041150703C8574E624000AB96E624000037771BFD270E1E7220002000024000AB96F2D0000000062400003776C784A418114D2E44C9FAF7BE9C536219800A6E698E4C7D2C911E1E1E311006156F7D315E0E992B1F1AC66B309C9D68961AA327FE770101B74D4C975F8C5DEC96AE8240367761A624000000005478807811403C95DC0C7CE402E8044A5F13304108013CE9963E1E1F1031000",
            "tx_blob" : "120000228000000024000AB96E201B036776306140000000054788076840000000000000287321020A46D8D02AC780C59853ACA309EAA92E7D8E02DD72A0B6AC315A7D18A6C3276A74463044022054811EEF61ACCFA1B5FC6BB05D2FA49CF5174062740370328382E6EA557C0E6A0220480584D487638C333A87CA37100354BD36209E355E8DB9FE79791A56E24C1F268114D2E44C9FAF7BE9C536219800A6E698E4C7D2C911831403C95DC0C7CE402E8044A5F13304108013CE9963",
            "validated" : true
         },
         {
            "ledger_index" : 57112087,
            "meta" : "201C00000026F8E5110061250367760A556B80EE9A9AD3FC40F471F29DCB80C678375137CE36220718902EF1EDCD375E7156140FA03FE8C39540CA8189BC7A7956795C712BC0A542C6409C041150703C8574E66240000376DEB77118E1E7220002000024000AB96E2D00000000624000037771BFD2708114D2E44C9FAF7BE9C536219800A6E698E4C7D2C911E1E1E511006125036776155591DA498D40AFD90670555F3D719883B48D224B4E4E906C634DEFA21163E8197756CC20FEBEA6D2AF969EC46F2BD92684D9FBABC3F238E841B5E056FE4EBF4379A9E62400071DA26240000001C0D849F8E1E722000200002400071DA32D0000000062400000012DCFE87881146914CB622B8E41E150DE431F48DA244A69809366E1E1F1031000",
            "tx_blob" : "12000022800000002400071DA22E00000001201B0367762D61400000009308615868400000000000002873210381575032E254BF4D699C3D8D6EFDB63B3A71F97475C6F6885BC7DAEEE55D9A0174473045022100E592BCCFD85CCE0B39075EFC66D6BCA594EBB451F12AD5AD9EE533A267F1381B02203635AB46AC110848FC44E797BD19D77A19E10A0F463AA5540B1C62E5D48C81F081146914CB622B8E41E150DE431F48DA244A698093668314D2E44C9FAF7BE9C536219800A6E698E4C7D2C911",
            "validated" : true
         }
      ],
      "validated" : true
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
| `close_time_iso` | String          | The ledger close time represented in ISO 8601 time format. |
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
