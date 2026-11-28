---
seo:
    description: APIのバージョン情報を取得します。
labels:
  - コアサーバ
---
# version
[[ソース]](https://github.com/XRPLF/clio/blob/develop/src/rpc/handlers/VersionHandler.hpp "ソース")

`version`コマンドは、[Clioサーバ](../../../../concepts/networks-and-servers/the-clio-server.md)のAPIバージョン情報を取得します。`xrpld`サーバについては、代わりに[`version`（`xrpld`）](../server-info-methods/version.md)を参照してください。{% badge href="https://github.com/XRPLF/clio/releases/tag/1.0.0" %}新規: Clio v2.0.0{% /badge %}


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

{% /tabs %}

{% try-it method="version" /%}

このリクエストはパラメーターを使用しません。

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "version": {
      "first": 1,
      "last": 2,
      "good": 1
    }
  },
  "status": "success",
  "type": "response",
  "warnings": [
    {
      "id": 2001,
      "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
    }
  ]
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
      "version": {
        "first": 1,
        "last": 2,
        "good": 1
      }
    },
    "status": "success",
    "type": "response",
    "warnings": [
        {
            "id":2001,
            "message":"This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
        }
    ]
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は、結果に唯一のフィールドとして`version`オブジェクトが含まれます。

`version`オブジェクトは以下のフィールドを含むことがあります。

| フィールド | 型   | 説明 |
|:---------|:-----|:-----|
| `first`  | 整数 | サポートされている最も古いAPIバージョン。 |
| `last`   | 整数 | サポートされている最も新しいAPIバージョン。 |
| `good`   | 整数 | APIバージョンを指定しなかった場合に使用されるデフォルトのAPIバージョン。 |

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
