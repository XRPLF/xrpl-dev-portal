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

**注意:** コマンドラインインターフェイスは管理目的でのみ使用することを意図しており、_サポートされているAPIではありません_です。新しいバージョンの`rippled`では、警告なしにコマンドラインAPIに破壊的な変更が導入される可能性があります！


## APIのバージョン管理

`rippled`サーバは、使用するAPIバージョンを識別するために単一の整数を使用します。現在、`1`と`2`{% badge href="https://github.com/XRPLF/rippled/releases/tag/2.0.0" %}新規: rippled 2.0.0{% /badge %}の2つのAPIバージョンがあります。サーバは`version`APIメソッドでサポートされるAPIバージョンの範囲を報告します。<!-- TODO: add a link when `version` method is documented. -->

それぞれのAPIバージョンは、破壊的な変更が導入されるときに新しいAPIバージョン番号を導入します。プレリリースやベータ、開発バージョンでは、同じAPIバージョン番号で破壊的な変更を導入することがあり、`account_tx`リクエストを使用してAPIバージョン2を使用し、同じ接続でAPIバージョン1を使用して別の`account_tx`リクエストを行うことができます。

将来の`rippled`のバージョンで破壊的な変更が導入されると、新しいAPIバージョン3が導入されます。


### 破壊的変更

次の種類の変更は**破壊的変更**です。

- リクエストやレスポンスのフィールドの削除や名前の変更
- リクエストやレスポンスのフィールドの型の変更
- リクエストやレスポンスのフィールドの意味の変更
- リクエストやレスポンスのフィールドの位置の変更、または他のリクエストやレスポンスのフィールドの前への新しいフィールドの追加
- APIメソッドの削除や名前の変更
- 既存のクライアントから確認できるAPI関数の動作の変更
- 次の種類の変更は、gRPC APIにのみ適用されます。
    - `proto`フィールド番号の変更
    - 列挙型または列挙型値の削除または名前の変更
    - `oneof`からのフィールドの追加または削除
    - `oneof`の分割または統合
    - メッセージフィールドが`optional`、`repeated`、または`required`であるかの変更
    - リクエストまたはレスポンスのストリーム値の変更
    - パッケージまたはサービスの削除または名前の変更

フルリリースで破壊的変更が加えられると、新しいAPIバージョン番号が導入されます。プレリリース版、ベータ版、開発版では、同じAPIバージョン番号に変更を加えることがあります。

### 非破壊的変更

次の種類の変更は**非破壊的変更**であり、APIバージョン番号の変更なしに発生する可能性があります。

- パラメータの位置の変更を含まない、新しいフィールドの追加
- 新しいAPIメソッドの追加

{% raw-partial file="/docs/_snippets/common-links.md" /%}
