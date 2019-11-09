# validation_create
[[ソース]<br>](https://github.com/ripple/rippled/blob/315a8b6b602798a4cff4d8e1911936011e12abdb/src/ripple/rpc/handlers/ValidationCreate.cpp "Source")

`validation_create`コマンドキーを使用して、[`rippled`サーバーがネットワークに対して自身の身元を識別させるのに使用できる暗号鍵](peer-protocol.html#ノードキーペア)を生成します。[wallet_proposeメソッド][]と同様に、このメソッドでは適切なフォーマットで一連のキーが単に生成されるだけです。XRP Ledgerのデータやサーバー構成は変更されません。

_`validation_create`メソッドは、権限のないユーザーは実行できない[管理メソッド](admin-rippled-methods.html)です。_

サーバーを設定することにより、生成されたキーペアを検証の署名（検証キーペア）に使用するか、または通常のピアツーピア通信の署名（[ノードキーペア](peer-protocol.html#ノードキーペア)）に使用するかを指定できます。

**ヒント:**　堅牢なバリデータを設定するには、`validator-keys`ツール（`rippled` RPMに付属）を使用してバリデータトークン（ローテーション可能）とオフラインマスターキーを生成してください。詳細は、[rippledサーバーで検証を有効化](run-rippled-as-a-validator.html#3-rippledサーバーで検証を有効化)を参照してください。


### 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id": 0,
   "command": "validation_create",
   "secret": "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE"
}
```

*JSON-RPC*

```
{
   "method": "validation_create",
   "params": [
       {
           "secret": "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE"
       }
   ]
}
```

*コマンドライン*

```
#Syntax: validation_create [secret]
rippled validation_create "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE"
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターが含まれます。

| `Field`  | 型   | 説明                                              |
|:---------|:-------|:---------------------------------------------------------|
| `secret` | 文字列 | _（省略可）_ クレデンシャルを生成するときにこの値をシードとして使用します。同じシークレットを使用すると常に同じクレデンシャルが生成されます。シードは[RFC-1751](https://tools.ietf.org/html/rfc1751)フォーマットまたはXRP Ledgerの[base58][]フォーマットで指定できます。省略すると、ランダムシードが生成されます。 |

**注記:** バリデータのセキュリティは、シードのエントロピーに応じて異なります。シークレット値が強力なランダム性のソースを使用して生成されている場合を除き、実際の事業目的のためにシークレット値を使用しないでください。新しいクレデンシャルを初めて生成するときには`secret`を省略することが推奨されます。

### 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC*

```
{
  "result" : {
     "status" : "success",
     "validation_key" : "FAWN JAVA JADE HEAL VARY HER REEL SHAW GAIL ARCH BEN IRMA",
     "validation_public_key" : "n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG",
     "validation_seed" : "ssZkdwURFMBXenJPbrpE14b6noJSu"
  }
}
```

*コマンドライン*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
  "result" : {
     "status" : "success",
     "validation_key" : "FAWN JAVA JADE HEAL VARY HER REEL SHAW GAIL ARCH BEN IRMA",
     "validation_public_key" : "n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG",
     "validation_seed" : "ssZkdwURFMBXenJPbrpE14b6noJSu"
  }
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`                 | 型   | 説明                               |
|:------------------------|:-------|:------------------------------------------|
| `validation_key`        | 文字列 | これらの検証クレデンシャルのシークレットキー（[RFC-1751](https://tools.ietf.org/html/rfc1751)フォーマット）。 |
| `validation_public_key` | 文字列 | これらの検証クレデンシャルの公開鍵（XRP Ledgerの[base58][]エンコード文字列フォーマット）。 |
| `validation_seed`       | 文字列 | これらの検証クレデンシャルのシークレットキー（XRP Ledgerの[base58][]エンコード文字列フォーマット）。 |

### 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `badSeed` - 要求に無効なシード値が指定されていました。この場合は通常、シード値が異なるフォーマットの有効文字列（アカウントアドレス、検証の公開鍵など）である可能性があります。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
