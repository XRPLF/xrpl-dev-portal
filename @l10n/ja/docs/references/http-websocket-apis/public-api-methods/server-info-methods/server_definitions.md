---
html: server_definitions.html
parent: server-info-methods.html
seo:
    description: 実行中の`rippled`インスタンスから生成されるSDK互換の`definitions.json`を取得します。
labels:
  - コアサーバ
---
# server_definitions

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/ServerInfo.cpp#L43 "ソース")

`server_definitions`コマンドは実行中の`rippled`インスタンスから生成されたSDK互換の`definitions.json`を返します。これを使用してネットワーク上のノードにアクセスし、そのバイナリデータをシリアライズ/デシリアライズするために必要な定義を受け取ることができます。


## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "command": "server_definitions"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "server_definitions"
}
```
{% /tab %}

{% /tabs %}

[試してみよう! >](/resources/dev-tools/websocket-api-tool#server_definitions)

リクエストにパラメータは含まれません。


## レスポンスのフォーマット

レスポンスのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "result": {
    "FIELDS": [
      [
        "Generic",
        {
          "isSerialized": false,
          "isSigningField": false,
          "isVLEncoded": false,
          "nth": 0,
          "type": "Unknown"
        }
      ],
      [
        "Invalid",
        {
          "isSerialized": false,
          "isSigningField": false,
          "isVLEncoded": false,
          "nth": -1,
          "type": "Unknown"
        }
      ],
      [
        "ObjectEndMarker",
        {
          "isSerialized": true,
          "isSigningField": true,
          "isVLEncoded": false,
          "nth": 1,
          "type": "STObject"
        }
      ],
      [
        "ArrayEndMarker",
        {
          "isSerialized": true,
          "isSigningField": true,
          "isVLEncoded": false,
          "nth": 1,
          "type": "STArray"
        }
      ]
      ...
    ]
  }
}
```
{% /tab %}

{% /tabs %}

完全な`definitions.json`ファイルとトップレベルフィールドの説明を見るには、[定義ファイル](../../../protocol/binary-format.md#定義ファイル)をご覧ください。


## 考えられるエラー

いずれかの汎用エラータイプ。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
