---
html: account_tx.html
parent: account-methods.html
seo:
    description: 指定したアカウントに関連するトランザクションのリストを取得します。
labels:
  - アカウント
  - 支払い
---
# account_tx
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/AccountTx.cpp "Source")

`account_tx`メソッドは、指定したアカウントに関連するトランザクションのリストを取得します。

## リクエストのフォーマット

リクエストのフォーマットの例:

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
  "forward": false
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
            "limit": 2
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
# Syntax: account_tx account [ledger_index_min [ledger_index_max]] [limit] [offset] [binary] [count] [descending]
# For binary/count/descending, use the parameter name for true and omit for false.
rippled -- account_tx rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w -1 -1 2 0 binary descending
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#account_tx)

リクエストには以下のパラメーターが含まれます。

| `Field`            | 型                                         | 説明       |
|:-------------------|:-------------------------------------------|:-----------|
| `account` | 文字列 | アカウントの一意のIDであり、最も一般的なアカウントのアドレスが使用されます。 |
| `tx_type` | 文字列                                     | _(省略可)_ **Clioのみ** "Clawback"、"AccountSet"、"AccountDelete "など、特定のタイプのトランザクションのみを返します。 See [Transaction Types](../../../../references//protocol/transactions/types/index.md#transaction-types). [新規: Clio v2.0](https://github.com/XRPLF/clio/releases/tag/2.0.0 "BADGE_BLUE") [AMMのサポート: Clio v2.1.0](https://github.com/XRPLF/clio/releases/tag/2.1.0 "BADGE_GREEN") |
| `ledger_index_min` | 整数 | [API v1][]: _（省略可能）_ 含めるトランザクションのレジャーのうち最古のものを指定するのに使用します。`-1`の値は、使用可能な検証済みレジャーのうち最古のバージョンを使用するよう、サーバに指示します。<br>[API v2][]: v1と同じですが、サーバが持つレジャーの範囲を超えて値を指定すると`lgrIdxMalformed`エラーを返します。 |
| `ledger_index_max` | 整数 | _（省略可能）_ 含めるトランザクションのレジャーのうち最新のものを指定するのに使用します。`-1`の値は、使用可能な検証済みレジャーのうち最新のバージョンを使用するよう、サーバに指示します。<br>[API v2][]: v1と同じですが、サーバが持つレジャーの範囲を超えて値を指定すると`lgrIdxMalformed`エラーを返します。 |
| `ledger_hash` | 文字列 | [API v1][]: _（省略可能）_ 単一のレジャーからのみトランザクションを検索するのに使用します。（[レジャーの指定][]をご覧ください） |
| `ledger_index` | 文字列または符号なし整数 | _（省略可能）_ 単一のレジャーからのみトランザクションを検索するのに使用します。（[レジャーの指定][]をご覧ください） |
| `binary` | ブール値 | [API v1][]: _（省略可能）_ デフォルトは`false`です。`true`に設定すると、JSONの代わりに16進文字列でトランザクションが返されます。<br>[API v2][]: v1と同じですが、 真偽値以外の値を指定すると`invalidParams`エラーを返します。 |
| `forward` | ブール値 | [API v1][]: _（省略可能）_ デフォルトは`false`です。`true`に設定すると、最も古いレジャーを先頭としてインデックスが付けられた値が返されます。そうしない場合、最新のレジャーを先頭として結果にインデックスが付けられます。（結果を示した各ページの中身は順序よく整理されていない場合がありますが、ページ全体としては順序付けされています。）<br>[API v2][]: v1と同じですが、 真偽値以外の値を指定すると`invalidParams`エラーを返します。 |
| `limit` | 整数 | _（省略可能）_ デフォルトは変化します。取得するトランザクションの数を制限します。サーバはこの値を受け入れる必要はありません。 |
| `marker` | [マーカー][] | 以前にページネーションされたレスポンスの値。そのレスポンスを停止した箇所からデータの取得を再開します。サーバが使用できるレジャーの範囲に変更があっても、この値は変わりません。 |

- リクエスト内で次の各フィールドのうち1つ以上を使用する必要があります: `ledger_index`、`ledger_hash`、`ledger_index_min`、または`ledger_index_max`。
- [API v2]： `ledger_index` と `ledger_hash` のどちらかを指定した場合、`ledger_index_min` と `ledger_index_max` を含めると `invalidParams` エラーが返ります。


### 照会されたデータの繰り返し

他のページネーションメソッドと同様に、`marker`フィールドを使用すると複数ページのデータが返されます。

複数のリクエストの合間に、`"ledger_index_min": -1`と`"ledger_index_max": -1`が変更されて、以前とは異なるレジャーバージョンを参照する場合があります。`marker`フィールドを使用すると、リクエストからのレジャー範囲に変更がある場合でも、マーカーが示すポイントがリクエストで指定されたレジャーの範囲外でない限り、安全にページネーションできます。

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "result": {
    "account": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
    "ledger_index_max": 57111999,
    "ledger_index_min": 55886305,
    "limit": 2,
    "marker": {
      "ledger": 57111981,
      "seq": 16
    },
    "transactions": [
      {
        "meta": {
          "AffectedNodes": [
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                  "Balance": "3732969177079",
                  "Flags": 131072,
                  "OwnerCount": 0,
                  "Sequence": 702817
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "140FA03FE8C39540CA8189BC7A7956795C712BC0A542C6409C041150703C8574",
                "PreviousFields": {
                  "Balance": "3713891690008"
                },
                "PreviousTxnID": "D58864C16344ADCC15995C7986CFC607CB693E88F84D2E019F0A35FB29749202",
                "PreviousTxnLgrSeq": 57111994
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg",
                  "Balance": "40010160",
                  "Flags": 131072,
                  "OwnerCount": 0,
                  "Sequence": 466334
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "CC20FEBEA6D2AF969EC46F2BD92684D9FBABC3F238E841B5E056FE4EBF4379A9",
                "PreviousFields": {
                  "Balance": "19117497271",
                  "Sequence": 466333
                },
                "PreviousTxnID": "F6B8274D3D419A95A59681E5F55578084C395FF9051924360CA3EA745F5581E8",
                "PreviousTxnLgrSeq": 57111993
              }
            }
          ],
          "TransactionIndex": 25,
          "TransactionResult": "tesSUCCESS",
          "delivered_amount": "19077487071"
        },
        "tx": {
          "Account": "rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg",
          "Amount": "19077487071",
          "Destination": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
          "DestinationTag": 1,
          "Fee": "40",
          "Flags": 2147483648,
          "LastLedgerSequence": 57112020,
          "Sequence": 466333,
          "SigningPubKey": "0381575032E254BF4D699C3D8D6EFDB63B3A71F97475C6F6885BC7DAEEE55D9A01",
          "TransactionType": "Payment",
          "TxnSignature": "3045022100CFC5FD057C7C685C690637AD1E639E2642BBC00EFD8E06E3F6C72FA924BC99D40220317D0708E814F69F874D641B6732E37A53B1220B493B2B8390D9EF51E8062515",
          "date": 649200260,
          "hash": "46BF0B576677B0DEA2D94591424A57A2DE8E3D89383631E16F40D09A513C656C",
          "inLedger": 57111998,
          "ledger_index": 57111998
        },
        "validated": true
      },
      {
        "meta": {
          "AffectedNodes": [
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                  "Balance": "3713891690008",
                  "Flags": 131072,
                  "OwnerCount": 0,
                  "Sequence": 702817
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "140FA03FE8C39540CA8189BC7A7956795C712BC0A542C6409C041150703C8574",
                "PreviousFields": {
                  "Balance": "3714441690048",
                  "Sequence": 702816
                },
                "PreviousTxnID": "FDD5007913B39027BAF10B31144DBC1F7DC147528DF31FF048A06DC5D3108BD6",
                "PreviousTxnLgrSeq": 57111981
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "r9dU6Z7P2i7MrDi1VUZ7uyq6J77eg86YtB",
                  "Balance": "2629998983",
                  "Flags": 0,
                  "OwnerCount": 0,
                  "Sequence": 10
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "27B96FE681B33825CC95DA197358B30D3A1721F2125F2D76022D46B2418ABA0A",
                "PreviousFields": {
                  "Balance": "2079998983"
                },
                "PreviousTxnID": "44A47AC04C0C7237C32BE9A532B578D07641705D3A59DB9B3C5B6225001E39B7",
                "PreviousTxnLgrSeq": 56613857
              }
            }
          ],
          "TransactionIndex": 16,
          "TransactionResult": "tesSUCCESS",
          "delivered_amount": "550000000"
        },
        "tx": {
          "Account": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
          "Amount": "550000000",
          "Destination": "r9dU6Z7P2i7MrDi1VUZ7uyq6J77eg86YtB",
          "Fee": "40",
          "Flags": 2147483648,
          "LastLedgerSequence": 57112016,
          "Sequence": 702816,
          "SigningPubKey": "020A46D8D02AC780C59853ACA309EAA92E7D8E02DD72A0B6AC315A7D18A6C3276A",
          "TransactionType": "Payment",
          "TxnSignature": "3045022100D589029EF63F9E528F6100C7A36D26AFFF84085EC9AC16DA8E30E11F390D4E87022011466E0FE4A90B89142EE47E535545EEA4A2D65E0BD234DFB447721218B59C9B",
          "date": 649200241,
          "hash": "D58864C16344ADCC15995C7986CFC607CB693E88F84D2E019F0A35FB29749202",
          "inLedger": 57111994,
          "ledger_index": 57111994
        },
        "validated": true
      }
    ],
    "validated": true
  },
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
        "ledger_index_max": 57112019,
        "ledger_index_min": 56248229,
        "limit": 2,
        "marker": {
            "ledger": 57112007,
            "seq": 13
        },
        "status": "success",
        "transactions": [
            {
                "meta": {
                    "AffectedNodes": [
                        {
                            "ModifiedNode": {
                                "FinalFields": {
                                    "Account": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                                    "Balance": "3732290013101",
                                    "Flags": 131072,
                                    "OwnerCount": 0,
                                    "Sequence": 702820
                                },
                                "LedgerEntryType": "AccountRoot",
                                "LedgerIndex": "140FA03FE8C39540CA8189BC7A7956795C712BC0A542C6409C041150703C8574",
                                "PreviousFields": {
                                    "Balance": "3732745656171",
                                    "Sequence": 702819
                                },
                                "PreviousTxnID": "7C031FD5B710E3C048EEF31254089BEEC505900BCC9A842257A0319453333998",
                                "PreviousTxnLgrSeq": 57112010
                            }
                        },
                        {
                            "ModifiedNode": {
                                "FinalFields": {
                                    "Account": "raLPjTYeGezfdb6crXZzcC8RkLBEwbBHJ5",
                                    "Balance": "4231510602153",
                                    "Flags": 0,
                                    "OwnerCount": 0,
                                    "Sequence": 96486
                                },
                                "LedgerEntryType": "AccountRoot",
                                "LedgerIndex": "39DC5D448DECEFC3CD20818788E3DA891CA943935E8D7B12FCB5B5871FCB1638",
                                "PreviousFields": {
                                    "Balance": "4231054959123"
                                },
                                "PreviousTxnID": "33D2014C832610293730028CA37857AC183BFCE3E42B9979C491FB8B82B3E9DC",
                                "PreviousTxnLgrSeq": 57112004
                            }
                        }
                    ],
                    "TransactionIndex": 12,
                    "TransactionResult": "tesSUCCESS",
                    "delivered_amount": "455643030"
                },
                "tx": {
                    "Account": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                    "Amount": "455643030",
                    "Destination": "raLPjTYeGezfdb6crXZzcC8RkLBEwbBHJ5",
                    "DestinationTag": 18240312,
                    "Fee": "40",
                    "Flags": 2147483648,
                    "LastLedgerSequence": 57112037,
                    "Sequence": 702819,
                    "SigningPubKey": "020A46D8D02AC780C59853ACA309EAA92E7D8E02DD72A0B6AC315A7D18A6C3276A",
                    "TransactionType": "Payment",
                    "TxnSignature": "30450221008602B2E390C0C7B65182C6DBC86292052C1961B2BEFB79C2C8431722C0ADB911022024B74DCF910A4C8C95572CF662EB7F5FF67E1AC4D7B9B7BFE2A8EE851EC16576",
                    "date": 649200322,
                    "hash": "08EF5BDA2825D7A28099219621CDBECCDECB828FEA202DEB6C7ACD5222D36C2C",
                    "inLedger": 57112015,
                    "ledger_index": 57112015
                },
                "validated": true
            },
            {
                "meta": {
                    "AffectedNodes": [
                        {
                            "ModifiedNode": {
                                "FinalFields": {
                                    "Account": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                                    "Balance": "3732745656171",
                                    "Flags": 131072,
                                    "OwnerCount": 0,
                                    "Sequence": 702819
                                },
                                "LedgerEntryType": "AccountRoot",
                                "LedgerIndex": "140FA03FE8C39540CA8189BC7A7956795C712BC0A542C6409C041150703C8574",
                                "PreviousFields": {
                                    "Balance": "3732246155784"
                                },
                                "PreviousTxnID": "CCBCCB528F602007C937C496F0828C118E073DF180084CCD3646EC1E414844E4",
                                "PreviousTxnLgrSeq": 57112007
                            }
                        },
                        {
                            "ModifiedNode": {
                                "FinalFields": {
                                    "Account": "rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg",
                                    "Balance": "236476361",
                                    "Flags": 131072,
                                    "OwnerCount": 0,
                                    "Sequence": 466335
                                },
                                "LedgerEntryType": "AccountRoot",
                                "LedgerIndex": "CC20FEBEA6D2AF969EC46F2BD92684D9FBABC3F238E841B5E056FE4EBF4379A9",
                                "PreviousFields": {
                                    "Balance": "735976788",
                                    "Sequence": 466334
                                },
                                "PreviousTxnID": "C528B32DD588EFAE2FE833E8AA92E6AE2DF2C8DB3DB8C6C4F334AD37B253D72A",
                                "PreviousTxnLgrSeq": 57112010
                            }
                        }
                    ],
                    "TransactionIndex": 33,
                    "TransactionResult": "tesSUCCESS",
                    "delivered_amount": "499500387"
                },
                "tx": {
                    "Account": "rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg",
                    "Amount": "499500387",
                    "Destination": "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
                    "DestinationTag": 1,
                    "Fee": "40",
                    "Flags": 2147483648,
                    "LastLedgerSequence": 57112032,
                    "Sequence": 466334,
                    "SigningPubKey": "0381575032E254BF4D699C3D8D6EFDB63B3A71F97475C6F6885BC7DAEEE55D9A01",
                    "TransactionType": "Payment",
                    "TxnSignature": "3045022100C7EA1701FE48C75508EEBADBC9864CD3FFEDCEB48AB99AEA960BFA360AE163ED0220453C9577502924C9E1A9A450D4B950A44016813BC70E1F16A65A402528D730B7",
                    "date": 649200302,
                    "hash": "7C031FD5B710E3C048EEF31254089BEEC505900BCC9A842257A0319453333998",
                    "inLedger": 57112010,
                    "ledger_index": 57112010
                },
                "validated": true
            }
        ],
        "validated": true
    }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
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

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`            | 型                         | 説明                       |
|:-------------------|:---------------------------|:---------------------------|
| `account` | 文字列 | 関連するアカウントを識別する一意の[アドレス][]。 |
| `ledger_index_min` | 整数 - [レジャーインデックス][] | トランザクションで実際に検索された最古のレジャーのレジャーインデックス。 |
| `ledger_index_max` | 整数 - [レジャーインデックス][] | トランザクションで実際に検索された最新のレジャーのレジャーインデックス。 |
| `limit` | 整数 | リクエストで使用される`limit`値。（サーバによって強制される実際の制限値とは異なる場合があります。） |
| `marker` | [マーカー][] | レスポンスがページネーションされていることを示す、サーバが定義した値。この値を次のコールに渡して、このコールで終わった箇所から再開します。 |
| `transactions` | 配列 | 以降で説明する、リクエストの基準を満たすトランザクションの配列。 |
| `validated` | ブール値 | このフィールドが含まれていて`true`に設定されている場合、このレスポンス内の情報は検証済みのレジャーバージョンから取得されています。そうでない場合、情報は変更されることがあります。 |

**注記:** サーバから返される`ledger_index_min`および`ledger_index_max`の値がリクエストで指定したものとは異なる場合があります。例えば、サーバに手元の指定したバージョンがない場合など。

各トランザクションのオブジェクトには以下のフィールドが含まれます。含まれるフィールドは、JSONまたは16進文字列（`"binary":true`）フォーマットのどちらでリクエストされたかによって異なります。

| `Field`        | 型                               | 説明                     |
|:---------------|:---------------------------------|:-------------------------|
| `ledger_index` | 整数 | このトランザクションを含むレジャーバージョンの[レジャーインデックス][]。 |
| `meta` | オブジェクト（JSON）または文字列（バイナリ） | `binary`がTrueの場合、これは16進文字列のトランザクションメタデータです。そうでない場合、トランザクションメタデータはJSONフォーマットになります。 |
| `tx` | オブジェクト | （JSONモードのみ）トランザクションを定義するJSONオブジェクト。 |
| `tx_blob` | 文字列 | （バイナリモードのみ）トランザクションを表す一意のハッシュ化された文字列。 |
| `validated` | ブール値 | トランザクションが検証済みのレジャーに含まれるかどうか。検証済みのレジャーに含まれていないトランザクションはすべて、変更される場合があります。 |

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `actMalformed` - リクエストの`account`フィールドに指定した[アドレス][]が、正しいフォーマットではありません。
* `lgrIdxMalformed` - `ledger_index_min`または`ledger_index_max`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。
* `lgrIdxsInvalid` - リクエストで`ledger_index_min`の前にある`ledger_index_max`を指定したか、[ネットワークと同期](../../../../infrastructure/troubleshooting/index.md)されていないためにサーバに検証済みレジャーの範囲が存在しません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
