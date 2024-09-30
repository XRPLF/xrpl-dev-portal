---
html: validation_seed.html
parent: server-control-methods.html
seo:
    description: 無効。rippledが検証の署名に使用するシークレット値を一時的に設定します。
status: removed
labels:
  - コアサーバ
---
# validation_seed
[[ソース]](https://github.com/XRPLF/rippled/blob/a61ffab3f9010d8accfaa98aa3cacc7d38e74121/src/ripple/rpc/handlers/ValidationSeed.cpp "Source")

`validation_seed`コマンドは、rippledが検証の署名に使用するシークレット値を一時的に設定します。サーバを再起動すると、この値は構成ファイルに基づいてリセットされます。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.29.1-rc1" %}rippled 0.29.1 以降では無効{% /badge %}

*`validation_seed`リクエストは、権限のないユーザは実行できない[管理メソッド](../index.md)です。*

### リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id": "set_seed_1",
   "command": "validation_seed",
   "secret": "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE"
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: validation_seed [secret]
rippled validation_seed 'BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE'
```
{% /tab %}

{% /tabs %}

リクエストには以下のパラメーターが含まれます。

| `Field`  | 型   | 説明                                              |
|:---------|:-------|:---------------------------------------------------------|
| `secret` | 文字列 | _（省略可）_ 指定されている場合は、この値はキーペアの検証のためのシークレット値として使用されます。有効なフォーマットには、XRP Ledgerの[base58][]フォーマット、[RFC-1751](https://tools.ietf.org/html/rfc1751)、またはパスフレーズがあります。省略されている場合は、ネットワークへの検証の提案が無効になります。 |

### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
  "result" : {
     "status" : "success",
     "validation_key" : "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE",
     "validation_public_key" : "n9Jx6RS6zSgqsgnuWJifNA9EqgjTKAywqYNReK5NRd1yLBbfC3ng",
     "validation_seed" : "snjJkyBGogTem5dFGbcRaThKq2Rt3"
  }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
  "result" : {
     "status" : "success",
     "validation_key" : "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE",
     "validation_public_key" : "n9Jx6RS6zSgqsgnuWJifNA9EqgjTKAywqYNReK5NRd1yLBbfC3ng",
     "validation_seed" : "snjJkyBGogTem5dFGbcRaThKq2Rt3"
  }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`                 | 型   | 説明                               |
|:------------------------|:-------|:------------------------------------------|
| `validation_key`        | 文字列 | （提案が無効な場合には省略可）これらの検証クレデンシャルのシークレットキー（[RFC-1751](https://tools.ietf.org/html/rfc1751)フォーマット）。 |
| `validation_public_key` | 文字列 | （提案が無効な場合には省略可）これらの検証クレデンシャルの公開鍵（XRP Ledgerの[base58][]エンコード文字列フォーマット） |
| `validation_seed`       | 文字列 | （提案が無効な場合には省略可）これらの検証クレデンシャルのシークレットキー（XRP Ledgerの[base58][]エンコード文字列フォーマット） |

### 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `badSeed` - リクエストに無効なシークレット値が指定されていました。この場合は通常、シークレット値が異なるフォーマットの有効文字列（アカウントアドレス、検証の公開鍵など）である可能性があります。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
