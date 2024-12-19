---
html: request-formatting.html
parent: api-conventions.html
seo:
    description: WebSocket、JSON-RPC、コマンドラインインターフェイスの標準のリクエストのフォーマットと例です。
---
# リクエストのフォーマット

## リクエストの例

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "command": "account_info",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "strict": true,
  "ledger_index": "validated",
  "api_version": 1
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
POST http://s1.ripple.com:51234/
Content-Type: application/json

{
    "method": "account_info",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "strict": true,
            "ledger_index": "validated",
            "api_version": 1
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
rippled account_info r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 validated strict
```
{% /tab %}

{% /tabs %}


## WebSocketフォーマット

`rippled`サーバへのWebSocketを開いた後、以下のフィールドを使用して、コマンドを[JSON](https://ja.wikipedia.org/wiki/JSON)オブジェクトとして送信できます。

| フィールド            | 型        | 説明                                        |
|:--------------------|:----------|:-------------------------------------------|
| `command`           | 文字列     | [APIメソッド](../public-api-methods/index.md)の名前。 |
| `id`                | (多種)     | _(省略可)_ リクエストを識別するための一意な値。このリクエストに対するレスポンスも同じ `id` フィールドを使用します。これにより、レスポンスが順番通りに返ってこない場合でも、どのリクエストがどのレスポンスを返したのかを知ることができます。 |
| `api_version`       | 数値       | _(省略可)_ 使用するAPIのバージョン。省略時はバージョン1を使用します。詳細については、[APIのバージョン管理](#api-versioning)をご覧ください。 |
| (メソッドのパラメータ) | (多種)     | トップレベルのメソッドに任意のパラメータを指定します。 |

サーバからのレスポンスについては[レスポンスのフォーマット](response-formatting.md)をご覧ください。

## JSON-RPCフォーマット

JSON-RPCリクエストを実行するには、`rippled`サーバがJSON-RPC接続をリッスンしているポートおよびIPで、HTTP **POST**リクエストをルートパス（`/`）に送信します。HTTP/1.0またはHTTP/1.1を使用できます。HTTPSを使用する場合は、TLS v1.2を使用してください。セキュリティ上の理由から、`rippled`ではSSL v3以前を _サポートしていません_ 。

`Content-Type`ヘッダ(値`application/json`)を常に指定してください。

複数のリクエストを実行する場合は、リクエスト間で再接続を行わずに済むように、[Keep-Alives](http://tools.ietf.org/html/rfc7230#section-6.3)を使用してください。

以下のフィールドを指定したリクエストボディを[JSON](https://en.wikipedia.org/wiki/JSON)オブジェクトとして送信します。


| フィールド            | 型        | 説明                                        |
|:--------------------|:----------|:-------------------------------------------|
| `method`            | 文字列     | [APIメソッド](../public-api-methods/index.md)の名前。 |
| `params`            | 配列       | _(省略可)_ このメソッドのパラメータを持つネストされたJSONオブジェクトを含む**一要素の配列**。メソッドがパラメータを必要としない場合は、このフィールドを省略できます。 |

`params`配列内のオブジェクトには以下のフィールドを含めることができます。

| フィールド            | 型        | 説明                                        |
|:--------------------|:----------|:-------------------------------------------|
| `api_version`       | 数値       | _(省略可)_ 使用するAPIのバージョン。省略時はバージョン1を使用します。詳細については、[APIのバージョン管理](#api-versioning)をご覧ください。 |
| (Method Parameters) | (多種)     | メソッドで利用する任意のパラメータ。 |

サーバからのレスポンスについては[レスポンスのフォーマット](response-formatting.md)をご覧ください。

## コマンドライン形式

APIのメソッド名は、通常の(ダッシュで始まる)コマンドラインオプションの後に、スペースで区切られた一部のパラメータを続けて指定します。スペースやその他の特殊文字を含む可能性のあるパラメータ値については、シングルクォートで囲んでください。すべてのメソッドがコマンドラインAPI構文を持っているわけではありません。詳しくは、[コマンドラインの使い方](../../../infrastructure/commandline-usage.md#client-mode-options)をご覧ください。

コマンドラインはJSON-RPCを呼び出すため、そのレスポンスは常にJSON-RPCの[レスポンスのフォーマット](response-formatting.md)と一致します。

コマンドラインは常に最新の[APIバージョン](#api-versioning)を使用します。

{% admonition type="warning" name="注意" %}コマンドラインインターフェイスは管理目的でのみ使用することを意図しており、_サポートされているAPIではありません_です。新しいバージョンの`rippled`では、警告なしにコマンドラインAPIに破壊的な変更が導入される可能性があります！{% /admonition %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
