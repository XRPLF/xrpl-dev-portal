---
seo:
    description: APIバージョン情報を取得します。
labels:
    - コアサーバ
---
# version

{% source-link path="src/xrpld/rpc/handlers/server_info/Version.h" /%}

`version`コマンドは、xrpldサーバのAPIバージョン情報を取得します。[Clioサーバ](../../../../concepts/networks-and-servers/the-clio-server.md)については、[`version` (`clio`)](/docs/references/http-websocket-apis/public-api-methods/clio-methods/version.md)をご覧ください。


## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "version"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "version",
    "params": [
        {}
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: version
xrpld version
```
{% /tab %}

{% /tabs %}

{% try-it method="version" /%}

このリクエストにパラメーターはありません。

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "version": {
      "first": "1.0.0",
      "good": "1.0.0",
      "last": "1.0.0"
    }
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
    "version": {
      "first": "1.0.0",
      "good": "1.0.0",
      "last": "1.0.0"
    }
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
{
  "result": {
    "version": {
      "first": "1.0.0",
      "good": "1.0.0",
      "last": "1.0.0"
    }
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に`version`オブジェクトのみがフィールドとして含まれています。

`version`オブジェクトには、以下のフィールドのいくつかの組み合わせが含まれます。

| `Field`  | 型     | 説明                                   |
|:---------|:-------|:---------------------------------------|
| `first`  | 文字列 | サポートされている最も古いAPIリリース  |
| `last`   | 文字列 | サポートされている最も新しいAPIリリース |
| `good`   | 文字列 | 指定がない場合に使用されるデフォルトのAPI |

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
