---
seo:
    description: 閉鎖時刻からレジャーを検索します。
labels:
  - ブロックチェーン
---
# ledger_index
[[ソース]](https://github.com/XRPLF/clio/blob/develop/src/rpc/handlers/LedgerIndex.cpp "ソース")

`ledger_index`コマンドは、指定した現実の時刻の時点で最後に閉鎖されたレジャーに関する情報を検索します。これは、オフチェーンで起きた出来事をXRP Ledgerの履歴データと関連付ける場合に役立ちます。{% badge href="https://github.com/XRPLF/clio/releases/tag/2.3.0" date="TBD" %}新規: Clio v2.3.0{% /badge %}

このメソッドはClioサーバでのみ利用でき、`xrpld`では利用できません。

## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "example_ledger_index",
    "command": "ledger_index",
    "date": "2024-08-28T22:59:00Z"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "ledger_index",
    "params": [
        {
            "date": "2024-08-28T22:59:00Z"
        }
    ]
}
```
{% /tab %}

{% /tabs %}

{% try-it method="ledger_index" /%}

リクエストには以下のパラメーターを含めることができます。

| フィールド | 型     | 必須？ | 説明 |
|:---------|:-------|:------|:-----|
| `date`   | 文字列  | いいえ | 検索する時刻を表すISO 8601形式のタイムスタンプ。マイクロ秒を含めず、タイムゾーンの指定に`Z`を使用した形式にする必要があります。例: `2024-08-28T22:59:00Z`。省略した場合は現在の時刻を使用します。 |

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/ledger_index/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/ledger_index/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は、リクエストした時刻の時点で最後に閉鎖されたレジャーに関する情報が結果に含まれます。結果には次のフィールドが含まれます。

| フィールド       | 型     | 説明 |
|:---------------|:-------|:-----|
| `ledger_index` | 数値    | 指定した時刻の時点で最後に閉鎖されたレジャーの[レジャーインデックス][]。 |
| `ledger_hash`  | 文字列  | 指定した時刻の時点で最後に閉鎖されたレジャーを識別する[ハッシュ][]。 |
| `closed`       | 文字列  | 指定した時刻の時点で最後に閉鎖されたレジャーの公式な閉鎖時刻。 |
| `validated`    | 真偽値  | `true`の場合、このレジャーはコンセンサスプロセスによって検証済みで、変更されることはありません。それ以外の場合、レジャーの内容は確定しておらず、変更される可能性があります。 |

{% admonition type="info" name="注記" %}
レジャーの閉鎖時刻は丸められるため、レジャーの「公式な」閉鎖時刻と、レジャーが実際に閉鎖された現実の時刻との間には、最大10秒の差が生じることがあります。詳細は、[レジャーの閉鎖時刻](../../../../concepts/ledgers/ledger-close-times.md)を参照してください。
{% /admonition %}

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
    * 例えば、指定した`date`にマイクロ秒が含まれている場合に、このエラーが発生します。
* `lgrNotFound` - 指定した時点のレジャー履歴を、サーバが保有していません。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
