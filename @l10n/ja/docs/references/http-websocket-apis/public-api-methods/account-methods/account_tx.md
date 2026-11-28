---
seo:
    description: アカウントに関連するトランザクションのリストを取得します。
labels:
    - 支払い
    - アカウント
---
# account_tx
{% source-link path="src/xrpld/rpc/handlers/account/AccountTx.cpp" /%}

`account_tx`メソッドは、指定したアカウントが関係する検証済みのトランザクションのリストを取得します。

## リクエストのフォーマット

リクエストのフォーマットの例:

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

{% tab label="コマンドライン" %}
```sh
# Syntax: account_tx account [ledger_index_min [ledger_index_max]] [limit] [offset] [binary] [count] [descending]
# For binary/count/descending, use the parameter name for true and omit for false.
xrpld -- account_tx rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w -1 -1 2 0 binary descending
```
{% /tab %}

{% /tabs %}

{% try-it method="account_tx" /%}

リクエストには以下のパラメーターが含まれます。

| フィールド           | 型                          | 説明 |
|:-------------------|:-------------------------------------------|:-----------|
| `account`          | 文字列                       | アカウントの一意の識別子。通常はアカウントのアドレスです。 |
| `tx_type`          | 文字列                       | _（省略可）_ **Clioのみ** "Clawback"、"AccountSet"、"AccountDelete"など、特定の種類のトランザクションのみを返します。大文字と小文字は区別されません。[トランザクションのタイプ](../../../protocol/transactions/types/index.md)を参照してください。[新規: Clio v2.0](https://github.com/XRPLF/clio/releases/tag/2.0.0 "BADGE_BLUE") [AMMのサポート: Clio v2.1.0](https://github.com/XRPLF/clio/releases/tag/2.1.0 "BADGE_GREEN") |
| `mpt_issuance_id`  | 文字列                       | _（省略可）_ **Clioのみ** この192ビットの16進数の`MPTokenIssuanceID`を持つ[MPTokenIssuanceエントリ][]を参照するトランザクションのみを返します。直接参照するトランザクションと、成功したトランザクションのメタデータで参照しているトランザクションが対象です。{% badge href="https://github.com/XRPLF/clio/releases/tag/2.8.0" %}新規: Clio v2.8.0{% /badge %} |
| `ledger_index_min` | 整数                         | _（省略可）_ トランザクションを含める最も古いレジャーを指定します。`-1`を指定すると、利用可能な検証済みレジャーのうち最も古いバージョンを使用するようサーバに指示します。 |
| `ledger_index_max` | 整数                         | _（省略可）_ トランザクションを含める最も新しいレジャーを指定します。`-1`を指定すると、利用可能な検証済みレジャーのうち最も新しいバージョンを使用するようサーバに指示します。 |
| `ledger_hash`      | 文字列                       | _（省略可）_ 単一のレジャーのトランザクションのみを検索する場合に使用します。（[レジャーの指定][]を参照してください。） |
| `ledger_index`     | 文字列または符号なし整数        | _（省略可）_ 単一のレジャーのトランザクションのみを検索する場合に使用します。（[レジャーの指定][]を参照してください。） |
| `binary`           | 真偽値                       | _（省略可）_ デフォルトは`false`です。`true`に設定すると、トランザクションをJSONではなく16進文字列として返します。 |
| `forward`          | 真偽値                       | _（省略可）_ デフォルトは`false`です。`true`に設定すると、最も古いレジャーを先頭として値を返します。それ以外の場合は、最も新しいレジャーを先頭として結果を返します。（結果の各ページの中は順序どおりでない場合がありますが、ページ全体としては順序付けられています。） |
| `limit`            | 正の整数                      | _（省略可）_ デフォルトは場合によって異なります。取得するトランザクションの数を制限します。サーバはこの値に従う必要はありません。 |
| `marker`           | [マーカー][Marker]            | 以前のページネーションされたレスポンスの値。そのレスポンスが中断したところからデータの取得を再開します。サーバが利用できるレジャーの範囲が変わっても、この値は変わりません。 |
| `delegate`         | オブジェクト                   | _（省略可）_ [トランザクションの委任](../../../../concepts/accounts/permission-delegation.md)の関係で結果を絞り込みます。このオブジェクトのフィールドについては、[`delegate`フィルター](#delegate-フィルター)を参照してください。{% amendment-disclaimer name="PermissionDelegationV1_1" /%} |

- [API v2][]: `ledger_index`または`ledger_hash`のいずれかを指定した場合に、`ledger_index_min`と`ledger_index_max`も含めると、`invalidParams`エラーが返されます。

#### `delegate`フィルター

`delegate`オブジェクトは、あるアカウント（被委任者）が別のアカウント（委任者）の代わりに署名して送信したトランザクションに、結果を絞り込みます。このオブジェクトには次のフィールドがあります。

| フィールド          | 型     | 説明 |
|:------------------|:-------|:------------|
| `delegate_filter` | 文字列  | _（必須）_ 絞り込みに使用する関係。`actor`は、他のアカウントが`account`の代わりに署名したトランザクションを返します（委任者の視点）。`authorizer`は、`account`が他のアカウントの代わりに署名したトランザクションを返します（被委任者の視点）。 |
| `counter_party`   | 文字列  | _（省略可）_ 絞り込みに使用する[アドレス][]。`delegate_filter`に`actor`を指定した場合は、この被委任者が署名したトランザクションだけに結果を絞り込みます。`delegate_filter`に`authorizer`を指定した場合は、この委任者の代わりに署名したトランザクションだけに結果を絞り込みます。 |


### 照会されたデータの繰り返し

他のページネーションされたメソッドと同様に、`marker`フィールドを使用して複数ページのデータを取得できます。

リクエストの合間に、`"ledger_index_min": -1`と`"ledger_index_max": -1`が、以前とは異なるレジャーバージョンを指すように変わることがあります。`marker`フィールドを使用すると、リクエストのレジャー範囲が変わった場合でも、マーカーがリクエストで指定したレジャーの範囲外の位置を指していない限り、安全にページネーションできます。

## レスポンスのフォーマット

処理が成功したレスポンスの例:

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

{% tab label="コマンドライン" %}
```json
Loading: "/etc/xrpld/xrpld.cfg"
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

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

{% tabs %}

{% tab label="API v2" %}

| フィールド         | 型                          | 説明 |
|:-------------------|:---------------------------|:---------------------------|
| `account`          | 文字列                       | 関連するアカウントを識別する一意の[アドレス][]。 |
| `ledger_index_min` | 整数 - [レジャーインデックス][] | トランザクションを実際に検索した最も古いレジャーのレジャーインデックス。 |
| `ledger_index_max` | 整数 - [レジャーインデックス][] | トランザクションを実際に検索した最も新しいレジャーのレジャーインデックス。 |
| `limit`            | 整数                         | リクエストで使用された`limit`の値。（サーバが実際に適用する上限の値とは異なる場合があります。） |
| `marker`           | [マーカー][Marker]            | レスポンスがページネーションされていることを示す、サーバが定義した値。この値を次の呼び出しに渡すと、この呼び出しが終わったところから再開します。 |
| `transactions`     | 配列                         | リクエストの条件に一致するトランザクションの配列。以下で説明します。 |
| `validated`        | 真偽値                       | このフィールドが含まれていて`true`に設定されている場合、このレスポンスの情報は検証済みのレジャーバージョンから取得されています。それ以外の場合、情報は変更される可能性があります。 |

{% admonition type="info" name="注記" %}サーバは、リクエストで指定したものとは異なる`ledger_index_min`と`ledger_index_max`の値を返すことがあります。例えば、指定したバージョンをサーバが保有していない場合などです。{% /admonition %}

各トランザクションオブジェクトには、JSONと16進文字列（`"binary":true`）のどちらのフォーマットでリクエストしたかに応じて、次のフィールドが含まれます。

| フィールド         | 型                  | 説明 |
|:-----------------|:----------------|:-------------------------|
| `close_time_iso` | 文字列               | このトランザクションを含むレジャーが閉鎖された時刻（[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)形式）。 |
| `hash`           | 文字列               | トランザクションを識別する一意のハッシュ。 |
| `ledger_hash`    | 文字列               | このトランザクションを含むレジャーバージョンを表す16進文字列。 |
| `ledger_index`   | 整数                 | このトランザクションを含むレジャーバージョンの[レジャーインデックス][]。 |
| `tx_json`        | オブジェクト（JSON）   | （JSONモード）トランザクションを定義するJSONオブジェクト。 |
| `tx_blob`        | 文字列（バイナリ）     | （バイナリモード）トランザクションを定義する一意の16進文字列。 |
| `meta`           | オブジェクト（JSON）   | （JSONモード）トランザクション結果のメタデータ（JSON）。 |
| `meta_blob`      | 文字列（バイナリ）     | （バイナリモード）トランザクション結果のメタデータ（16進文字列）。 |
| `validated`      | 真偽値               | トランザクションが検証済みのレジャーに含まれているかどうか。まだ検証済みのレジャーに含まれていないトランザクションは、変更される可能性があります。 |

{% /tab %}

{% tab label="API v1" %}

| フィールド         | 型                          | 説明 |
|:-------------------|:---------------------------|:---------------------------|
| `account`          | 文字列                       | 関連するアカウントを識別する一意の[アドレス][]。 |
| `ledger_index_min` | 整数 - [レジャーインデックス][] | トランザクションを実際に検索した最も古いレジャーのレジャーインデックス。 |
| `ledger_index_max` | 整数 - [レジャーインデックス][] | トランザクションを実際に検索した最も新しいレジャーのレジャーインデックス。 |
| `limit`            | 整数                         | リクエストで使用された`limit`の値。（サーバが実際に適用する上限の値とは異なる場合があります。） |
| `marker`           | [マーカー][Marker]            | レスポンスがページネーションされていることを示す、サーバが定義した値。この値を次の呼び出しに渡すと、この呼び出しが終わったところから再開します。 |
| `transactions`     | 配列                         | リクエストの条件に一致するトランザクションの配列。以下で説明します。 |
| `validated`        | 真偽値                       | このフィールドが含まれていて`true`に設定されている場合、このレスポンスの情報は検証済みのレジャーバージョンから取得されています。それ以外の場合、情報は変更される可能性があります。 |

{% admonition type="info" name="注記" %}サーバは、リクエストで指定したものとは異なる`ledger_index_min`と`ledger_index_max`の値を返すことがあります。例えば、指定したバージョンをサーバが保有していない場合などです。{% /admonition %}

各トランザクションオブジェクトには、JSONと16進文字列（`"binary":true`）のどちらのフォーマットでリクエストしたかに応じて、次のフィールドが含まれます。

| フィールド       | 型                                | 説明 |
|:---------------|:---------------------------------|:-------------------------|
| `ledger_index` | 整数                              | このトランザクションを含むレジャーバージョンの[レジャーインデックス][]。 |
| `tx`           | オブジェクト                        | （JSONモード）トランザクションを定義するJSONオブジェクト。 |
| `tx_blob`      | 文字列                             | （バイナリモード）トランザクションを表す16進文字列。 |
| `meta`         | オブジェクト（JSON）または文字列（バイナリ） | `binary`が`true`の場合、トランザクション結果のメタデータの16進文字列です。それ以外の場合、トランザクション結果のメタデータはJSONフォーマットで含まれます。 |
| `validated`    | 真偽値                             | トランザクションが検証済みのレジャーに含まれているかどうか。まだ検証済みのレジャーに含まれていないトランザクションは、変更される可能性があります。 |

{% /tab %}

{% /tabs %}

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。[API v1][]では、次のように指定した場合、このエラーは返されません。
  * `ledger_index_min`または`ledger_index_max`を指定したうえで、`ledger_index`または`ledger_hash`も指定しようとした場合。
  * `binary`または`forward`フィールドに真偽値以外の値を指定した場合。
* `actMalformed` - リクエストの`account`フィールドに指定した[アドレス][]が、正しいフォーマットではありません。
* `lgrIdxMalformed` - `ledger_index_min`または`ledger_index_max`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。[API v1][]では、サーバが保有しているレジャーの範囲を超える`ledger_index_min`または`ledger_index_max`の値を指定しても、このエラーは返されません。
* `lgrIdxsInvalid` - リクエストで`ledger_index_min`より前の`ledger_index_max`を指定したか、サーバが[ネットワークと同期していない](../../../../infrastructure/troubleshooting/server-doesnt-sync.md)ため検証済みのレジャーの範囲がありません。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
