---
html: download_shard.html
parent: logging-and-data-management-methods.html
seo:
    description: レジャー履歴の特定のシャードをダウンロードします。
labels:
  - データ保持
---
# download_shard
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/DownloadShard.cpp "Source")

サーバに対し、外部ソースから特定の[履歴レジャーデータのシャード](../../../../infrastructure/configuration/data-retention/history-sharding.md)をダウンロードするように指示します。`rippled`サーバで[履歴シャードが保管されるように設定する](../../../../infrastructure/configuration/data-retention/configure-history-sharding.md)必要があります。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.1.0" %}新規: rippled 1.1.0{% /badge %}

_`download_shard`メソッドは、権限のないユーザは実行できない[管理メソッド](../index.md)です。_

外部ソースからHTTPSを使用してシャードが[lz4圧縮](https://lz4.github.io/lz4/) [tarアーカイブ](https://en.wikipedia.org/wiki/Tar_(computing))として提供される必要があります。アーカイブには、NuDB形式のシャードディレクトリとデータファイルが含まれている必要があります。

通常、このメソッドを使用してシャードをダウンロードしてインポートすれば、ピアツーピアネットワークからシャードを個別に取得するよりも短い時間で取得できます。また、サーバから提供される特定範囲のシャードまたはシャードのセットを選択する場合にもこのメソッドを使用できます。

### リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "download_shard",
  "shards": [
    {"index": 1, "url": "https://example.com/1.tar.lz4"},
    {"index": 2, "url": "https://example.com/2.tar.lz4"},
    {"index": 5, "url": "https://example.com/5.tar.lz4"}
  ]
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "download_shard",
  "params": [
    {
      "shards": [
        {"index": 1, "url": "https://example.com/1.tar.lz4"},
        {"index": 2, "url": "https://example.com/2.tar.lz4"},
        {"index": 5, "url": "https://example.com/5.tar.lz4"}
      ]
    }
  ]
}
```
{% /tab %}

{% /tabs %}


リクエストには以下のフィールドが含まれます。

| `Field`    | 型      | 説明                                                  |
|:-----------|:--------|:------------------------------------------------------|
| `shards` | 配列 | ダウンロードするシャードとダウンロード元を記述したShard Descriptorオブジェクト（以下の説明を参照）のリスト。 |

`validate`のフィールドは廃止予定であり、今後予告なしに削除される可能性があります。`rippled`は全てのシャードの検証を実行します。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.6.0" %}更新: rippled 1.6.0{% /badge %}

`shards`配列の各**Shard Descriptorオブジェクト**には以下のフィールドが含まれています。

| `Field` | 型     | 説明                                                      |
|:--------|:-------|:----------------------------------------------------------|
| `index` | 数値 | 取得するシャードのインデックス。本番環境のXRP Ledgerでは、最も古いシャードのインデックスは1であり、このシャードにはレジャー32750～32768が含まれています。次のシャードのインデックスは2であり、このシャードにはレジャー32769～49152が含まれています。 |
| `url` | 文字列 | このシャードをダウンロードできるURL。このURLは`https://`か`http://`かで始まり`.tar.lz4`（大文字小文字の区別なし）で終わる必要があります。このダウンロードを提供するWebサーバは、信頼できる認証局（CA）によって署名された有効なTLS証明書を使用する必要があります。（`rippled`はオペレーティングシステムのCAストアーを使用します。） {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.7.0" %}更新: rippled 1.7.0{% /badge %} |

### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "message": "downloading shards 1-2,5"
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
    "message": "downloading shards 1-2,5",
    "status": "success"
  }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`   | 型     | 説明                                                    |
|:----------|:-------|:--------------------------------------------------------|
| `message` | 文字列 | このリクエストに対応して実行されたアクションを説明するメッセージ。 |

**ヒント:** サーバで使用可能なシャードを確認するには、[crawl_shardsメソッド][]を使用します。または、シャードストアーとして設定されたロケーションのサブフォルダー（`rippled.cfg`の`[shard_db]`の`path`パラメーター）を調べます。フォルダーには、シャードの番号に対応する名前が付いています。これらのフォルダーの1つに、シャードが未完了であることを示す`control.txt`ファイルが含まれていることがあります。

### 考えられるエラー

- いずれかの[汎用エラータイプ][]。
- `notEnabled` - サーバでシャードストアーを使用するように設定されていません。
- `tooBusy` - サーバはすでに、ピアツーピアネットワークから、または以前の`download_shard`リクエストの結果として、シャードをダウンロード中です。
- `invalidParams` - リクエストで1つ以上の必須フィールドが省略されていたか、または指定されたフィールドのデータタイプが誤っています。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
