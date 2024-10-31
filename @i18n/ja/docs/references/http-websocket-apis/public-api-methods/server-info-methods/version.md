---
seo:
    description: APIバージョン情報を取得します。
labels:
  - コアサーバ
---
# version

[[ソース]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/beast/core/SemanticVersion.cpp "ソース")

`version`コマンドは、rippledサーバーのAPIバージョン情報を取得します。`Clio`サーバーの場合は、代わりに[`version` (`clio`)](../clio-methods/version.md)をご覧ください。


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

{% tab label="コマンドライン" %}
```sh
#Syntax: version
rippled version
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#version)

リクエストはパラメーターを必要としません。


## レスポンスのフォーマット

成功したレスポンスの例:

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

レスポンスは[標準フォーマット][]に従い、成功した結果は`version`オブジェクトのみを含むものとなります。

`version`オブジェクトは、次のフィールドのいずれかを返します。

| フィールド | 型     | 説明 |
|:-----------|:-------|:------------------------------|
| `first`    | 文字列 | サポートされる最低のAPIリリース |
| `last`     | 文字列 | サポートされる最高のAPIリリース |
| `good`     | 文字列 | 指定されていない場合のデフォルトのAPI |

### 考えられるエラー

* [汎用エラータイプ][]のいずれか。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
