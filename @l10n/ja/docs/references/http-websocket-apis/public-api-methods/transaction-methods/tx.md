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
| `min_ledger`  | 数値   | いいえ | `max_ledger`と一緒に使うことで、このレジャーを起点として最大1000件までの[レジャーインデックス][ledger index]の範囲を指定することができます(自身を含む)。サーバーが[トランザクションを見つけられない](#not-foundレスポンス)場合、この範囲内のいずれのレジャーにも存在しないことになります。 |
| `max_ledger`  | 数値   | いいえ | `min_ledger`と一緒に使うと、このレジャーで終わる最大1000個の[レジャーインデックス][ledger index]の範囲を指定できます(自身を含む)。サーバーが[トランザクションを見つけられない](#not-foundレスポンス)場合、この範囲内のいずれのレジャーにも存在しないことになります。 |

`ctid`または`transaction`のいずれか一方のみを提供する必要があります。

{% admonition type="warning" name="注意" %}このコマンドは、トランザクションが`min_ledger`から`max_ledger`の範囲外のレジャーに含まれている場合でも、トランザクションを見つけることができる場合があります。{% /admonition %}

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket (Hash)" %}
{% code-snippet file="/_api-examples/tx/ws-response-hash.json" language="json" /%}
{% /tab %}

{% tab label="WebSocket (CTID)" %}
{% code-snippet file="/_api-examples/tx/ws-response-ctid.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC (Hash)" %}
{% code-snippet file="/_api-examples/tx/jsonrpc-response-hash.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC (CTID)" %}
{% code-snippet file="/_api-examples/tx/jsonrpc-response-ctid.json" language="json" /%}
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "Account" : "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
      "Fee" : "12",
      "Flags" : 0,
      "LastLedgerSequence" : 56865248,
      "OfferSequence" : 5037708,
      "Sequence" : 5037710,
      "SigningPubKey" : "03B51A3EDF70E4098DA7FB053A01C5A6A0A163A30ED1445F14F87C7C3295FCB3BE",
      "TakerGets" : "15000000000",
      "TakerPays" : {
         "currency" : "CNY",
         "issuer" : "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
         "value" : "20160.75"
      },
      "TransactionType" : "OfferCreate",
      "TxnSignature" : "3045022100A5023A0E64923616FCDB6D664F569644C7C9D1895772F986CD6B981B515B02A00220530C973E9A8395BC6FE2484948D2751F6B030FC7FB8575D1BFB406368AD554D9",
      "date" : 648248020,
      "hash" : "C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9",
      "inLedger" : 56865245,
      "ledger_index" : 56865245,
      "meta" : {
         "AffectedNodes" : [
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "ExchangeRate" : "4F04C66806CF7400",
                     "Flags" : 0,
                     "RootIndex" : "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400",
                     "TakerGetsCurrency" : "0000000000000000000000000000000000000000",
                     "TakerGetsIssuer" : "0000000000000000000000000000000000000000",
                     "TakerPaysCurrency" : "000000000000000000000000434E590000000000",
                     "TakerPaysIssuer" : "CED6E99370D5C00EF4EBF72567DA99F5661BFB3A"
                  },
                  "LedgerEntryType" : "DirectoryNode",
                  "LedgerIndex" : "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400"
               }
            },
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Account" : "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
                     "Balance" : "10404767991",
                     "Flags" : 0,
                     "OwnerCount" : 3,
                     "Sequence" : 5037711
                  },
                  "LedgerEntryType" : "AccountRoot",
                  "LedgerIndex" : "1DECD9844E95FFBA273F1B94BA0BF2564DDF69F2804497A6D7837B52050174A2",
                  "PreviousFields" : {
                     "Balance" : "10404768003",
                     "Sequence" : 5037710
                  },
                  "PreviousTxnID" : "4DC47B246B5EB9CCE92ABA8C482479E3BF1F946CABBEF74CA4DE36521D5F9008",
                  "PreviousTxnLgrSeq" : 56865244
               }
            },
            {
               "DeletedNode" : {
                  "FinalFields" : {
                     "Account" : "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
                     "BookDirectory" : "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400",
                     "BookNode" : "0000000000000000",
                     "Flags" : 0,
                     "OwnerNode" : "0000000000000000",
                     "PreviousTxnID" : "8F5FF57B404827F12BDA7561876A13C3E3B3095CBF75334DBFB5F227391A660C",
                     "PreviousTxnLgrSeq" : 56865244,
                     "Sequence" : 5037708,
                     "TakerGets" : "15000000000",
                     "TakerPays" : {
                        "currency" : "CNY",
                        "issuer" : "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
                        "value" : "20160.75"
                     }
                  },
                  "LedgerEntryType" : "Offer",
                  "LedgerIndex" : "26AAE6CA8D29E28A47C92ADF22D5D96A0216F0551E16936856DDC8CB1AAEE93B"
               }
            },
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Flags" : 0,
                     "IndexNext" : "0000000000000000",
                     "IndexPrevious" : "0000000000000000",
                     "Owner" : "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
                     "RootIndex" : "47FAF5D102D8CE655574F440CDB97AC67C5A11068BB3759E87C2B9745EE94548"
                  },
                  "LedgerEntryType" : "DirectoryNode",
                  "LedgerIndex" : "47FAF5D102D8CE655574F440CDB97AC67C5A11068BB3759E87C2B9745EE94548"
               }
            },
            {
               "CreatedNode" : {
                  "LedgerEntryType" : "Offer",
                  "LedgerIndex" : "8BAEE3C7DE04A568E96007420FA11ABD0BC9AE44D35932BB5640E9C3FB46BC9B",
                  "NewFields" : {
                     "Account" : "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
                     "BookDirectory" : "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400",
                     "Sequence" : 5037710,
                     "TakerGets" : "15000000000",
                     "TakerPays" : {
                        "currency" : "CNY",
                        "issuer" : "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
                        "value" : "20160.75"
                     }
                  }
               }
            }
         ],
         "TransactionIndex" : 0,
         "TransactionResult" : "tesSUCCESS"
      },
      "status" : "success",
      "validated" : true
   }
}
```
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

{% raw-partial file="/docs/_snippets/common-links.md" /%}
