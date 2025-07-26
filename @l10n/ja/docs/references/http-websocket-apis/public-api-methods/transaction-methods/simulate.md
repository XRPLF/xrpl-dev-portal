---
seo:
    description: あらゆる種類のトランザクションを仮実行して、結果とメタデータをプレビューします。
labels:
  - トランザクション送信
---
# simulate
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/rpc/handlers/Simulate.cpp "ソース")

`simulate` メソッドは、あらゆる トランザクションを仮実行し、XRP Ledger に反映することなく、その結果やメタデータを事前に確認できます。このコマンドはネットワークにトランザクションを送信しないため、手数料は発生しません。

{% admonition type="warning" name="Caution" %}
`simulate` メソッドの結果は、実際にトランザクションを送信したときと同じになるとは限りません。これは、トランザクションの処理に影響する台帳の状態が、シミュレーションと送信の間に変化する可能性があるためです。
{% /admonition %}


## リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 2,
    "command": "simulate",
    "tx_json" : {
        "TransactionType" : "Payment",
        "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "Amount" : {
            "currency" : "USD",
            "value" : "1",
            "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
        }
    }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "simulate",
    "params": {
        "tx_json" : {
            "TransactionType" : "Payment",
            "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
            "Amount" : {
                "currency" : "USD",
                "value" : "1",
                "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
            }
        }
    }
}
```
{% /tab %}

{% /tabs %}

{% try-it method="simulate" /%}

リクエストには以下のパラメーターが含まれます。

| フィールド     | 型    | 必須? | 説明                                                                                                                                                              |
| --------- | ------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tx_blob` | 文字列  | はい       | シミュレーション対象のトランザクションを[バイナリフォーマット](https://xrpl.org/ja/docs/references/protocol/binary-format)で指定します。このフィールドを使用する場合、`tx_json`は同時に指定しないでください。      |
| `tx_json` | オブジェクト  | はい       | シミュレーション対象のトランザクションをJSON形式で指定します。このフィールドを使用する場合は、`tx_blob`を同時に指定しないでください。                                                                   |
| `binary`  | ブール値 | いいえ        | デフォルト値は`false`であり、この場合はデータとメタデータがJSON形式で返されます。`true`を指定すると、データとメタデータはバイナリフォーマットで返され、16進文字列としてシリアライズされます。 |

- シミュレーションで使用するトランザクションは、未署名でなければなりません。
- `Fee`、`Sequence`、`SigningPubKey`、または`NetworkID`フィールドが指定されている場合、それらはトランザクションに使用されます。指定されていない場合は、サーバーが自動的に補完します。

## レスポンスのフォーマット

処理が成功したレスポンスの例:

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

レスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| フィールド          | 型   | 説明 |
| -------------- | ------ | ----------- |
| `tx_json`      | オブジェクト | 自動補完された値を含む、シミュレーションされたトランザクション。`binary`が`false`の場合に含まれます。 |
| `tx_blob`      | 文字列 | 自動補完された値を含む、シリアライズされたシミュレーションされたトランザクション。`binary`が`true`の場合に含まれます。 |
| `ledger_index` | [レジャーインデックス](https://xrpl.org/ja/docs/references/protocol/data-types/basic-data-types#レジャーインデックス) | このトランザクションが含まれていたであろうレジャーインデックス。 |
| `meta`         | オブジェクト | トランザクションの結果を示すメタデータ。台帳に含まれないことを意味するコード（たとえば TEC 以外のコード）でトランザクションが失敗した場合は含まれません。`binary`が`false`の場合に含まれます。 |
| `meta_blob`    | 文字列 | トランザクションの結果を示すメタデータ。台帳に含まれないことを意味するコード（たとえば TEC 以外のコード）でトランザクションが失敗した場合は含まれません。`binary`が`true`の場合に含まれます。 |


## 考えられるエラー

* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `transactionSigned` - トランザクションが署名済みです。シミュレーションで使用するトランザクションは、未署名でなければなりません。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
