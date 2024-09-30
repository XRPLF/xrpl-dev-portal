---
html: crawl_shards.html
parent: logging-and-data-management-methods.html
seo:
    description: ピアが持つ履歴シャードについての情報をリクエストします。
labels:
  - データ保持
---
# crawl_shards

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/CrawlShards.cpp "Source")

使用可能な[履歴レジャーデータのシャード](../../../../infrastructure/configuration/data-retention/history-sharding.md)に関するピアサーバからの情報をリクエストします。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.2.0" %}新規: rippled 1.2.0{% /badge %}

_`crawl_shards`メソッドは、権限のないユーザは実行できない[管理メソッド](../index.md)です。_

### リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "crawl_shards",
  "pubkey": true,
  "limit": 0
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "crawl_shards",
  "params": [
    {
      "pubkey": true,
      "limit": 0
    }
  ]
}
```
{% /tab %}

{% /tabs %}

**注記:** このメソッドのコマンドライン構文はありません。コマンドラインからアクセスするには[jsonメソッド][]を使用してください。

リクエストには以下のフィールドが含まれます。

| `Field`  | 型      | 説明                                                     |
|:---------|:--------|:--------------------------------------------------------|
| `pubkey` | ブール値 | _（省略可）_ `true`の場合、レスポンスには、クロールされたサーバのノード公開鍵（ピアツーピア通信用）が含まれます。デフォルトは`false`です。 |
| `limit` | 数値 | _（省略可）_ 検索の深さを示すホップ数。デフォルトは0で、ダイレクトピアのみを検索します。`1`を制限値にすると、ピアのピアも検索します。最大値は`3`です。 |

**注意:** `limit`が増加すると、検索される可能性のあるピアの数は、指数関数的に増加します。2または3を制限値にすると、サーバがAPIリクエストにレスポンスするのに数秒かかる場合があります。


### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "complete_shards": "1-2,5,8-9,584,1973,2358",
    "peers": [
      {
        "complete_shards": "1-2,8,47,371,464,554,653,857,1076,1402,1555,1708,1813,1867",
        "public_key": "n9LxFZiySnfDSvfh23N94UxsFkCjWyrchTeKHcYE6tJJQL5iejb2"
      },
      {
        "complete_shards": "8-9,584",
        "ip": "192.168.1.132",
        "public_key": "n9MN5xwYqbrj64rtfZAXQy7Y3sNxXZJeLt7Lj61a9DYEZ4SE2tQQ"
      }
    ]
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
    "complete_shards": "1-2,5,8-9,584,1973,2358",
    "peers": [
      {
        "complete_shards": "1-2,8,47,371,464,554,653,857,1076,1402,1555,1708,1813,1867",
        "public_key": "n9LxFZiySnfDSvfh23N94UxsFkCjWyrchTeKHcYE6tJJQL5iejb2"
      },
      {
        "complete_shards": "8-9,584",
        "ip": "192.168.1.132",
        "public_key": "n9MN5xwYqbrj64rtfZAXQy7Y3sNxXZJeLt7Lj61a9DYEZ4SE2tQQ"
      }
    ],
    "status": "success"
  }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`           | 型     | 説明                                            |
|:------------------|:-------|:------------------------------------------------|
| `complete_shards` | 文字列 | _（省略可）_ ローカルサーバで利用可能な[履歴シャード](../../../../infrastructure/configuration/data-retention/history-sharding.md)の範囲。これは、空の文字列か、または連続していない範囲である場合があります。たとえば、`1-2,5,7-9`は、シャード1、2、5、7、8、9が利用可能であることを示します。このサーバで履歴シャーディングが有効になっていない場合は省略されます。 |
| `peers` | 配列 | 各ピアが使用可能な履歴シャードを表す**ピアシャードオブジェクト**のリスト（以下を参照）。 |

#### ピアシャードオブジェクト

レスポンスの`peers`配列のメンバーはそれぞれ、ピアツーピアネットワーク内の1つのサーバを表すオブジェクトです。リストには、少なくとも1つの完全な[履歴シャード](../../../../infrastructure/configuration/data-retention/history-sharding.md)が使用可能なピアのみが含まれます。配列の各オブジェクトには以下のフィールドが含まれます。


| `Field`   | 型     | 説明                                                     |
|:----------|:-------|:--------------------------------------------------------|
| `complete_shards` | 文字列 | このピアが使用可能な履歴シャードの範囲。連続していない場合があります。たとえば、`1-2,5,7-9`は、シャード1、2、5、7、8、9が利用可能であることを示します。 |
| `ip` | 文字列 | _（省略される場合があります）_ このオブジェクトが表すピアのIPアドレス。IPv4アドレスまたはIPv6アドレスを指定できます。[プライベートピア](../../../../concepts/networks-and-servers/peer-protocol.md#プライベートピア)の場合は省略されます。 |
| `public_key` | 文字列 | _(リクエストで`"pubkey": true`が指定されている場合を除き省略)_ XRP Ledgerの[base58フォーマット](../../../protocol/data-types/base58-encodings.md)で、このピアでピアツーピア通信に使用される公開鍵。 |


### 考えられるエラー

- いずれかの[汎用エラータイプ][]。
- `invalidParams` - リクエストで1つ以上の必須フィールドが省略されていたか、または指定されたフィールドのデータタイプが誤っています。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
