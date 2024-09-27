---
html: account_offers.html
parent: account-methods.html
seo:
    description: 特定のアカウントから出されたオファーのリストを取得します。
labels:
  - 分散型取引所
---
# account_offers
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/AccountOffers.cpp "Source")

`account_offers`メソッドは、特定の[アカウント](../../../../concepts/accounts/index.md)から出された[オファー](../../../../concepts/tokens/decentralized-exchange/offers.md)のうち、特定の[レジャーバージョン](../../../../concepts/ledgers/index.md)で未処理であったオファーのリストを取得します。

## リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "command": "account_offers",
  "account": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "account_offers",
    "params": [
        {
            "account": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM"
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: account_offers account [ledger_index]
rippled account_offers r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 current
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#account_offers)

リクエストには以下のパラメーターを指定できます。

| `Field`        | 型                    | 必須? | 説明                          |
|:---------------|:----------------------|:-----|:------------------------------|
| `account`      | 文字列 - [Address][]   | はい  | このアカウントからのオファーを検索します。 |
| `ledger_hash`  | [ハッシュ][]           | いいえ | 使用するレジャーバージョンを識別する20バイトの16進文字列。 |
| `ledger_index` | [レジャーインデックス][] | いいえ | 使用するレジャーの[レジャーインデックス][]、レジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]をご覧ください |
| `limit`        | 整数                  | いいえ | 取得するオファーの数を制限します。サーバはこの数より少ない結果を返すことがあります。10～400の範囲内でなければなりません。この範囲外の正の値は、最も近い有効なオプションに置き換えられます。デフォルトは200です。 |
| `marker`       | [マーカー][]           | いいえ | 以前にページネーションされたレスポンスの値。そのレスポンスを停止した箇所からデータの取得を再開します。 |

以下のパラメーターは廃止予定であり、今後予告なしに削除される可能性があります。`ledger`,`strict`

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 9,
  "status": "success",
  "type": "response",
  "result": {
    "account": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM",
    "ledger_current_index": 18539550,
    "offers": [
      {
        "flags": 0,
        "quality": "0.00000000574666765650638",
        "seq": 6577664,
        "taker_gets": "33687728098",
        "taker_pays": {
          "currency": "EUR",
          "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
          "value": "193.5921774819578"
        }
      },
      {
        "flags": 0,
        "quality": "7989247009094510e-27",
        "seq": 6572128,
        "taker_gets": "2361918758",
        "taker_pays": {
          "currency": "XAU",
          "issuer": "rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67",
          "value": "0.01886995237307572"
        }
      },
      ... trimmed for length ...
    ],
    "validated": false
  }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "account": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM",
        "ledger_current_index": 18539596,
        "offers": [{
            "flags": 0,
            "quality": "0.000000007599140009999998",
            "seq": 6578020,
            "taker_gets": "29740867287",
            "taker_pays": {
                "currency": "USD",
                "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                "value": "226.0050145327418"
            }
        }, {
            "flags": 0,
            "quality": "7989247009094510e-27",
            "seq": 6572128,
            "taker_gets": "2361918758",
            "taker_pays": {
                "currency": "XAU",
                "issuer": "rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67",
                "value": "0.01886995237307572"
            }
        }, {
            "flags": 0,
            "quality": "0.00000004059594001318974",
            "seq": 6576905,
            "taker_gets": "3892952574",
            "taker_pays": {
                "currency": "CNY",
                "issuer": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
                "value": "158.0380691682966"
            }
        },

        ...

        ],
        "status": "success",
        "validated": false
    }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
{
   "result" : {
      "account" : "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM",
      "ledger_current_index" : 57110969,
      "offers" : [
         {
            "flags" : 0,
            "quality" : "1499850014.892974",
            "seq" : 7916201,
            "taker_gets" : {
               "currency" : "BCH",
               "issuer" : "rcyS4CeCZVYvTiKcxj6Sx32ibKwcDHLds",
               "value" : "0.5268598580881351"
            },
            "taker_pays" : "790210766"
         }
      ],
      "status" : "success",
      "validated" : false
   }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`                | 型                          | 説明                    |
|:-----------------------|:----------------------------|:------------------------|
| `account`              | 文字列                       | オファーを出したアカウントを識別する一意の[アドレス][] |
| `offers`               | 配列                         | オブジェクトの配列。各オブジェクトは、このアカウントが出したオファーの中で、レジャーバージョンがリクエストされた時点で未処理のオファーを表します。オファーの数が多い場合は、一度に`limit`の数までのオファーが返されます。 |
| `ledger_current_index` | 数値 - [レジャーインデックス][] | _（`ledger_hash`または`ledger_index`が指定されている場合は省略可）_ このデータの取得時に使用した、現在処理中のレジャーバージョンのレジャーインデックス。 |
| `ledger_index`         | 数値 - [レジャーインデックス][] | _（`ledger_current_index`が指定されている場合は省略可）_ リクエストに従って、このデータの取得時に使用されたレジャーバージョンのレジャーインデックス。 |
| `ledger_hash`          | 文字列 - [ハッシュ][]         | _（省略される場合があります）_ このデータの取得時に使用されたレジャーバージョンの識別用ハッシュ。 |
| `marker`               | [マーカー][]                 | _（省略される場合があります）_ レスポンスがページネーションされていることを示す、サーバが定義した値。この値を次のコールに渡して、このコールで終わった箇所から再開します。この後に情報ページがない場合は省略されます。 |


各Offerオブジェクトのフィールドを次に示します。

| `Field`      | 型                   | 説明                                       |
|:-------------|:---------------------|:-------------------------------------------|
| `flags`      | 符号なし整数           | このオファーエントリに対してビットフラグとして設定されているオプション。 |
| `seq`        | 符号なし整数           | このエントリを作成したトランザクションのシーケンス番号。（トランザクションの[シーケンス番号](../../../protocol/data-types/basic-data-types.md#アカウントシーケンス)はアカウントに関連付けられています。） |
| `taker_gets` | 文字列またはオブジェクト | オファーを受け入れるアカウントが受領する額。XRPまたは通貨指定オブジェクトの額を表す文字列として示されます。([通貨額の指定][通貨額]をご覧ください。) |
| `taker_pays` | 文字列またはオブジェクト | オファーを受け入れるアカウントが提供する額。XRPまたは通貨指定オブジェクトの額を表す文字列として示されます。([通貨額の指定][通貨額]をご覧ください。) |
| `quality`    | 文字列                | オファーの為替レート。元の`taker_pays`を元の`taker_gets`で割った比率です。オファーの実行時には、最も好ましい（最も低い）クオリティのオファーが最初に消費されます。同じクオリティのオファーは古いものから新しいものの順で実行されます。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.29.0" %}新規: rippled 0.29.0{% /badge %} |
| `expiration` | 符号なし整数           | （省略される場合があります）この時刻の経過後は、資金化されなかったオファーとみなされます（[Rippleエポック以降の経過秒数][]）。関連項目: [オファーの有効期限](../../../../concepts/tokens/decentralized-exchange/offers.md#オファーの有効期限)。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.30.1" %}新規: rippled 0.30.1{% /badge %} |

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `actNotFound` - リクエストの`account`フィールドに指定されている[アドレス][]が、レジャーのアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。
* `actMalformed` - 指定されている`marker`フィールドが受け入れられない場合。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
