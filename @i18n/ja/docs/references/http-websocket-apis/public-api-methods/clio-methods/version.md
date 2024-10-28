---
seo:
    description: APIバージョン情報を取得します。
labels:
  - コアサーバ
---
# version
[[ソース]](https://github.com/XRPLF/clio/blob/develop/src/rpc/handlers/VersionHandler.hpp "ソース")

`version`コマンドは、[Clioサーバ](../../../../concepts/networks-and-servers/the-clio-server.md)のAPIバージョン情報を取得します。`rippled`サーバーの場合は、代わりに[`version` (`rippled`)](../server-info-methods/version.md)をご覧ください。{% badge href="https://github.com/XRPLF/clio/releases/tag/1.0.0" %}新規: Clio v2.0.0{% /badge %}


## リクエストのフォーマット
リクエストフォーマットの例:

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

<!-- [Try it! >](websocket-api-tool.html#version) -->

リクエストはパラメーターを必要としません。

## レスポンスのフォーマット

成功したレスポンスの例:

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

レスポンスは[標準フォーマット][]に従い、成功した結果は`info`オブジェクトのみを含むものとなります。

`version`オブジェクトは、次のフィールドのいずれかを返します。

| フィールド | 型     | 説明 |
|:-----------|:-------|:------------------------------|
| `first`    | 文字列 | サポートされる最低のAPIリリース |
| `last`     | 文字列 | サポートされる最高のAPIリリース |
| `good`     | 文字列 | 指定されていない場合のデフォルトのAPI |

## 考えられるエラー

* [汎用エラータイプ][]のいずれか。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
