---
html: transaction_entry.html
parent: transaction-methods.html
seo:
    description: 特定のレジャーバージョンから1つのトランザクションに関する情報を取得します。
labels:
  - トランザクション送信
---
# transaction_entry
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/TransactionEntry.cpp "Source")

`transaction_entry`メソッドは、特定のレジャーバージョンから1つのトランザクションに関する情報を取得します。（これに対して、[txメソッド][]はすべてのレジャーから指定のトランザクションを検索します。txメソッドの使用をお勧めします。）

## リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 4,
  "command": "transaction_entry",
  "tx_hash": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
  "ledger_index": 348734
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "transaction_entry",
    "params": [
        {
            "tx_hash": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
            "ledger_index": 348734
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: transaction_entry transaction_hash ledger_index|ledger_hash
rippled transaction_entry E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7 348734
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#transaction_entry)

リクエストには以下のパラメーターが含まれます。

| `Field`        | 型                         | 説明                           |
|:---------------|:---------------------------|:-------------------------------|
| `ledger_hash` | 文字列 | _（省略可）_ 使用するレジャーバージョンの20バイトの16進文字列。（[レジャーの指定][]をご覧ください） |
| `ledger_index` | 文字列または符号なし整数 | _（省略可）_ 使用するレジャーの[レジャーインデックス][]、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]をご覧ください） |
| `tx_hash` | 文字列 | 検索するトランザクションの一意のハッシュ |

**注記:** このメソッドでは、現在進行中のレジャーから情報を取得する操作はサポートされていません。`ledger_index`または`ledger_hash`でレジャーバージョンを指定する必要があります。

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 4,
    "result": {
        "ledger_index": 348734,
        "metadata": {
            "AffectedNodes": [
                {
                    "ModifiedNode": {
                        "FinalFields": {
                            "Account": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
                            "Balance": "59328999119",
                            "Flags": 0,
                            "OwnerCount": 11,
                            "Sequence": 89
                        },
                        "LedgerEntryType": "AccountRoot",
                        "LedgerIndex": "E0D7BDE68B468FF0B8D948FD865576517DA987569833A05374ADB9A72E870A06",
                        "PreviousFields": {
                            "Balance": "59328999129",
                            "Sequence": 88
                        },
                        "PreviousTxnID": "C26AA6B4F7C3B9F55E17CD0D11F12032A1C7AD2757229FFD277C9447A8815E6E",
                        "PreviousTxnLgrSeq": 348700
                    }
                },
                {
                    "ModifiedNode": {
                        "FinalFields": {
                            "Balance": {
                                "currency": "USD",
                                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                                "value": "-1"
                            },
                            "Flags": 131072,
                            "HighLimit": {
                                "currency": "USD",
                                "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                                "value": "100"
                            },
                            "HighNode": "0000000000000000",
                            "LowLimit": {
                                "currency": "USD",
                                "issuer": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
                                "value": "0"
                            },
                            "LowNode": "0000000000000000"
                        },
                        "LedgerEntryType": "RippleState",
                        "LedgerIndex": "EA4BF03B4700123CDFFB6EB09DC1D6E28D5CEB7F680FB00FC24BC1C3BB2DB959",
                        "PreviousFields": {
                            "Balance": {
                                "currency": "USD",
                                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                                "value": "0"
                            }
                        },
                        "PreviousTxnID": "53354D84BAE8FDFC3F4DA879D984D24B929E7FEB9100D2AD9EFCD2E126BCCDC8",
                        "PreviousTxnLgrSeq": 343570
                    }
                }
            ],
            "TransactionIndex": 0,
            "TransactionResult": "tesSUCCESS"
        },
        "tx_json": {
            "Account": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
            "Amount": {
                "currency": "USD",
                "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                "value": "1"
            },
            "Destination": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "Fee": "10",
            "Flags": 0,
            "Paths": [
                [
                    {
                        "account": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                        "currency": "USD",
                        "issuer": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                        "type": 49,
                        "type_hex": "0000000000000031"
                    }
                ],
                [
                    {
                        "account": "rD1jovjQeEpvaDwn9wKaYokkXXrqo4D23x",
                        "currency": "USD",
                        "issuer": "rD1jovjQeEpvaDwn9wKaYokkXXrqo4D23x",
                        "type": 49,
                        "type_hex": "0000000000000031"
                    },
                    {
                        "account": "rB5TihdPbKgMrkFqrqUC3yLdE8hhv4BdeY",
                        "currency": "USD",
                        "issuer": "rB5TihdPbKgMrkFqrqUC3yLdE8hhv4BdeY",
                        "type": 49,
                        "type_hex": "0000000000000031"
                    },
                    {
                        "account": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                        "currency": "USD",
                        "issuer": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                        "type": 49,
                        "type_hex": "0000000000000031"
                    }
                ]
            ],
            "SendMax": {
                "currency": "USD",
                "issuer": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
                "value": "1.01"
            },
            "Sequence": 88,
            "SigningPubKey": "02EAE5DAB54DD8E1C49641D848D5B97D1B29149106174322EDF98A1B2CCE5D7F8E",
            "TransactionType": "Payment",
            "TxnSignature": "30440220791B6A3E036ECEFFE99E8D4957564E8C84D1548C8C3E80A87ED1AA646ECCFB16022037C5CAC97E34E3021EBB426479F2ACF3ACA75DB91DCC48D1BCFB4CF547CFEAA0",
            "hash": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
            "inLedger": 348734,
            "ledger_index": 348734
        }
    },
    "status": "success",
    "type": "response"
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`        | 型                        | 説明                            |
|:---------------|:--------------------------|:--------------------------------|
| `ledger_index` | 数値 - [レジャーインデックス][] | トランザクションが検出されたレジャーバージョンのレジャーインデックス。これはリクエストのレジャーインデックスと同じです。 |
| `ledger_hash` | 文字列 - [ハッシュ][] | _（省略される場合があります）_ トランザクションが検出されたレジャーバージョンの識別用ハッシュ。これはリクエストのハッシュと同じです。 |
| `metadata` | オブジェクト | [トランザクションのメタデータ](../../../protocol/transactions/metadata.md)。トランザクションの正確な結果を詳細に表示します。 |
| `tx_json` | オブジェクト | [Transactionオブジェクト](../../../protocol/transactions/index.md)のJSON表現。 |

サーバがトランザクションの検出に失敗する原因として、次のようなものが考えられます。

* トランザクションが存在しません。
* トランザクションが存在しますが、指定のレジャーバージョンに含まれていません。
* サーバには、使用可能な指定のレジャーバージョンがありません。正しいバージョンを保管する別のサーバからのレスポンスは、異なる可能性があります。

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `fieldNotFoundTransaction` - `tx_hash`フィールドがリクエストで省略されています。
* `notYetImplemented` - レジャーバージョンがリクエストに指定されていません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。
* `transactionNotFound` - リクエストに指定されているトランザクションが指定のレジャーで見つかりませんでした。（トランザクションが異なるレジャーバージョンにあるか、またはトランザクションがまったく使用できない可能性があります。）

{% raw-partial file="/docs/_snippets/common-links.md" /%}
