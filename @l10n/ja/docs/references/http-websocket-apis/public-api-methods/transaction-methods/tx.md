---
html: tx.html
parent: transaction-methods.html
seo:
    description: 1つのトランザクションに関する情報を取得します。
labels:
  - トランザクション送信
  - 支払い
---
# tx

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Tx.cpp "Source")

`tx`メソッドは1つのトランザクションに関する情報を取得します。

## リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket (Hash)" %}
```json
{
  "id": 1,
  "command": "tx",
  "transaction": "C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9",
  "binary": false,
  "api_version": 2
}
```
{% /tab %}

{% tab label="WebSocket (CTID)" %}
```json
{
  "id": "CTID example",
  "command": "tx",
  "ctid": "C005523E00000000",
  "binary": false,
  "api_version": 2
}
```
{% /tab %}

{% tab label="JSON-RPC (Hash)" %}
```json
{
    "method": "tx",
    "params": [
        {
            "transaction": "C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9",
            "binary": false,
            "api_version": 2
        }
    ]
}
```
{% /tab %}

{% tab label="JSON-RPC (CTID)" %}
```json
{
    "method": "tx",
    "params": [
        {
            "ctid": "C005523E00000000",
            "binary": false,
            "api_version": 2
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: tx transaction [binary]
rippled tx C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9 false
```
{% /tab %}

{% /tabs %}

{% try-it method="tx" /%}

リクエストには以下のパラメーターが含まれます。

| フィールド    | 型     | 必須?  | 説明 |
| :------------ | :----- | :----- | --- |
| `ctid`        | 文字列 | いいえ | 検索するトランザクションの[コンパクトトランザクション識別子](../../api-conventions/ctid.md)。大文字の16進数のみを使用する必要があります。 {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.12.0" %}新規: rippled 1.12.0{% /badge %} _(Clio v2.0以前では対応していません)_ |
| `transaction` | 文字列 | いいえ | 検索するトランザクションの16進数の256ビットハッシュ |
| `binary`      | 真偽値 | いいえ | `true` の場合、トランザクションデータとメタデータを16進数文字列へのバイナリ[シリアライズ](../../../protocol/binary-format.md)として返します。`false` の場合、トランザクションデータとメタデータを JSON で返します。デフォルトは `false` 。 |
| `min_ledger`  | 数値   | いいえ | `max_ledger`と一緒に使うことで、このレジャーを起点として最大1000件までの[レジャーインデックス][]の範囲を指定することができます(自身を含む)。サーバーが[トランザクションを見つけられない](#not-foundレスポンス)場合、この範囲内のいずれのレジャーにも存在しないことになります。 |
| `max_ledger`  | 数値   | いいえ | `min_ledger`と一緒に使うと、このレジャーで終わる最大1000個の[レジャーインデックス][]の範囲を指定できます(自身を含む)。サーバーが[トランザクションを見つけられない](#not-foundレスポンス)場合、この範囲内のいずれのレジャーにも存在しないことになります。 |

`ctid`または`transaction`のいずれか一方のみを提供する必要があります。

{% admonition type="warning" name="注意" %}このコマンドは、トランザクションが`min_ledger`から`max_ledger`の範囲外のレジャーに含まれている場合でも、トランザクションを見つけることができる場合があります。{% /admonition %}

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/tx/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/tx/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% tab label="Commandline" %}
{% code-snippet file="/_api-examples/tx/jsonrpc-response.json" language="json" prefix="Loading: \"/etc/opt/ripple/rippled.cfg\"\n2025-Dec-19 03:16:00.638871262 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005\n\n" /%}
{% /tab %}

{% /tabs %}

{% tabs %}

{% tab label="API v2" %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に[Transactionオブジェクト](../../../protocol/transactions/index.md)フィールドと以下の追加のフィールドが含まれています。

| `Field`        | 型                  | 説明 |
| :------------- | :------------------ | ---- |
| `ctid`         | 文字列              | 検索するトランザクションの[コンパクトトランザクション識別子](../../api-conventions/ctid.md)。大文字の16進数のみを使用する必要があります。 {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.12.0" %}新規: rippled 1.12.0{% /badge %} _(Clio v2.0以前では対応していません)_ |
| `date`         | 数値                | トランザクションが適用されたレジャーの[閉鎖時間](../../../../concepts/ledgers/ledger-close-times.md)。[Ripple Epoch][]からの秒数で表されます。 |
| `hash`         | 文字列              | トランザクションの一意の[識別ハッシュ][] |
| `inLedger`     | 数値                | _(非推奨)_ `ledger_index`の別名。 |
| `ledger_index` | 数値                | トランザクションが含まれるレジャーの[レジャーインデックス][]。 |
| `meta`         | オブジェクト (JSON) | (JSONモード) [Transaction metadata](../../../protocol/transactions/metadata.md)。トランザクションの結果を詳細に表示します。 |
| `meta_blob`    | 文字列 (バイナリ)   | (バイナリモード) [Transaction metadata](../../../protocol/transactions/metadata.md)。トランザクションの結果を詳細に表示します。 |
| `tx_blob`      | 文字列 (バイナリ)   | (バイナリモード) トランザクションデータを16進数の文字列で表したもの。 |
| `tx_json`      | オブジェクト (JSON) | (JSONモード) トランザクションデータをJSONで表したもの。 |
| `validated`    | 真偽値              | `true`の場合、このデータは検証済みのレジャーバージョンからのものです。`false`の場合、このデータはまだ検証されていません。 |

{% /tab %}

{% tab label="API v1" %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に[Transactionオブジェクト](../../../protocol/transactions/index.md)フィールドと以下の追加のフィールドが含まれています。

| `Field`        | 型                                       | 説明 |
| :------------- | :--------------------------------------- | --- |
| `ctid`         | 文字列                                   | 検索するトランザクションの[コンパクトトランザクション識別子](../../api-conventions/ctid.md)。大文字の16進数のみを使用する必要があります。 {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.12.0" %}新規: rippled 1.12.0{% /badge %} _(Clio v2.0以前では対応していません)_ |
| `date`         | 数値                                     | トランザクションが適用されたレジャーの[閉鎖時間](../../../../concepts/ledgers/ledger-close-times.md)。[Ripple Epoch][]からの秒数で表されます。 |
| `hash`         | 文字列                                   | トランザクションの一意の[識別ハッシュ][] |
| `inLedger`     | 数値                                     | _(非推奨)_ `ledger_index`の別名。 |
| `ledger_index` | 数値                                     | トランザクションが含まれるレジャーの[レジャーインデックス][]。 |
| `meta`         | オブジェクト (JSON) or 文字列 (バイナリ) | [Transaction metadata](../../../protocol/transactions/metadata.md)。トランザクションの結果を詳細に表示します。 |
| `tx`           | 文字列 (バイナリ)                        | (バイナリモード) トランザクションデータを16進数の文字列で表したもの。 |
| `tx_json`      | オブジェクト (JSON)                       | (JSONモード) トランザクションデータをJSONで表したもの。 |
| `validated`    | 真偽値                                   | `true`の場合、このデータは検証済みのレジャーバージョンからのものです。`false`の場合、このデータはまだ検証されていません。 |
| (その他)       | (その他)                                 | [Transactionオブジェクト](../../../protocol/transactions/index.md)のその他のフィールド |

{% /tab %}

{% /tabs %}

### Not Foundレスポンス

サーバがトランザクションを見つけられない場合、`txnNotFound`エラーを返します。これは2つのことを意味する可能性があります。

- トランザクションはどのレジャーバージョンにも含まれておらず、送信されていません。
- トランザクションは、サーバが保持していないレジャーバージョンに含まれていました。

`txnNotFound`単体では、トランザクションの[最終的な結果](../../../../concepts/transactions/finality-of-results/index.md)を知るためには不十分です。

さらに可能性を絞り込むために、リクエストに`min_ledger`と`max_ledger`フィールドを指定してレジャーの範囲を指定することができます。リクエストに`min_ledger`と`max_ledger`フィールドを指定した場合、`txnNotFound`レスポンスには以下のフィールドが含まれます。

| フィールド     | 型      | 説明                              |
|:---------------|:----------|:-----------------------------------------|
| `searched_all` | 真偽値   | _(リクエストに`min_ledger`と`max_ledger`が指定されていない場合は省略)_ サーバが指定されたすべてのレジャーバージョンを検索できた場合は`true`。サーバが指定されたすべてのレジャーバージョンを持っていないため、トランザクションがそれらのいずれかに含まれているかどうかを確認できない場合は`false`。 |

リクエストされたレジャー範囲を完全に検索した`txnNotFound`レスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "error": "txnNotFound",
  "error_code": 29,
  "error_message": "Transaction not found.",
  "id": 1,
  "request": {
    "binary": false,
    "command": "tx",
    "id": 1,
    "max_ledger": 54368673,
    "min_ledger": 54368573,
    "transaction": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7"
  },
  "searched_all": true,
  "status": "error",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
  "result": {
    "error": "txnNotFound",
    "error_code": 29,
    "error_message": "Transaction not found.",
    "request": {
      "binary": false,
      "command": "tx",
      "max_ledger": 54368673,
      "min_ledger": 54368573,
      "transaction": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7"
    },
    "searched_all": true,
    "status": "error"
  }
}
```
{% /tab %}

{% /tabs %}

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `txnNotFound` - トランザクションが存在しないか、または`rippled`で使用できない古いレジャーバージョンのトランザクションです。
* `excessiveLgrRange` - リクエストの`min_ledger`と`max_ledger`フィールドの差が1000を超えています。
* `invalidLgrRange` - 指定された`min_ledger`が`max_ledger`より大きいか、それらのパラメータのいずれかが有効なレジャーインデックスではありません。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
