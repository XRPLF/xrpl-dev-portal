---
html: ledger_cleaner.html
parent: logging-and-data-management-methods.html
seo:
    description: レジャークリーナーを制御し、レジャーデータベースの破損を検出して修復できる非同期メンテナンスをする。
labels:
  - データ保持
---
# ledger_cleaner
[[ソース]](https://github.com/XRPLF/rippled/blob/df54b47cd0957a31837493cd69e4d9aade0b5055/src/ripple/rpc/handlers/LedgerCleaner.cpp "Source")

`ledger_cleaner`コマンドは[レジャークリーナー](https://github.com/XRPLF/rippled/blob/f313caaa73b0ac89e793195dcc2a5001786f916f/src/ripple/app/ledger/README.md#the-ledger-cleaner)を制御します。レジャークリーナーは、`rippled`のレジャーデータベースの破損を検出して修復できる非同期メンテナンスプロセスです。

_`ledger_cleaner`メソッドは、権限のないユーザは実行できない[管理メソッド](../index.md)です。_

### リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "command": "ledger_cleaner",
    "max_ledger": 13818756,
    "min_ledger": 13818000,
    "stop": false
}
```
{% /tab %}

{% /tabs %}

リクエストには以下のパラメーターが含まれます。

| `Field`       | 型                        | 説明                             |
|:--------------|:--------------------------|:---------------------------------|
| `ledger` | 数値 - [レジャーインデックス][] | _（省略可）_ 指定されている場合は、指定されたレジャーのみをチェックして訂正します。 |
| `max_ledger` | 数値 - [レジャーインデックス][] | _（省略可）_ レジャーインデックスがこの番号以下のレジャーをチェックするようにレジャークリーナーを設定します。 |
| `min_ledger` | 数値 - [レジャーインデックス][] | _（省略可）_ レジャーインデックスがこの番号以上のレジャーをチェックするようにレジャークリーナーを設定します。 |
| `full` | ブール値 | _（省略可）_ trueの場合は、指定されたレジャーのレジャー状態オブジェクトとトランザクションを修正します。デフォルトではfalseです。`ledger`が指定されている場合は、自動的に`true`に設定されます。 |
| `fix_txns` | ブール値 | _（省略可）_ trueの場合は、指定されたレジャーのトランザクションを修正します。指定されている場合は`full`をオーバーライドします。 |
| `check_nodes` | ブール値 | _（省略可）_ trueの場合は、指定されているレジャーのレジャー状態オブジェクトを修正します。指定されている場合は`full`をオーバーライドします。 |
| `stop` | ブール値 | _（省略可）_ trueの場合は、レジャークリーナーを無効にします。 |

### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
   "result" : {
      "message" : "Cleaner configured",
      "status" : "success"
   }
}

```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`   | 型     | 説明                             |
|:----------|:-------|:---------------------------------|
| `message` | 文字列 | `Cleaner configured`: 正常終了の場合。 |

### 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `internal`: いずれかのパラメーターが正しく指定されていない場合。（これはバグです。本来のエラーコードは`invalidParams`です。）

{% raw-partial file="/docs/_snippets/common-links.md" /%}
