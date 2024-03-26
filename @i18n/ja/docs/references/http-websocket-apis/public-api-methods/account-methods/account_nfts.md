---
html: account_nfts.html
parent: account-methods.html
seo:
    description: アカウントのすべてのNFTのリストを取得します。
labels:
  - 非代替性トークン, NFT
---
# account_nfts
[[ソース]](https://github.com/xrplf/rippled/blob/master/src/ripple/rpc/handlers/AccountObjects.cpp "ソース")

`account_nfts`メソッドは、指定したアカウントの`NFToken`オブジェクトの一覧を返します。

_([NonFungibleTokensV1_1 amendment][]により追加されました。)_

## リクエストのフォーマット
リクエストのフォーマットの例

{% raw-partial file="/@i18n/ja/docs/_snippets/no-cli-syntax.md" /%}

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "account_nfts",
  "account": "rsuHaTvJh1bDmDoxX9QcKP7HEBSBt4XsHx",
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "account_nfts",
  "params": [{
    "account": "rsuHaTvJh1bDmDoxX9QcKP7HEBSBt4XsHx",
    "ledger_index": "validated"
  }]
}
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#account_nfts)

リクエストには以下のパラメーターが含まれます。

| フィールド       | 型               | 説明                                      |
|:---------------|:-----------------|:-----------------------------------------|
| `account`      | 文字列            | アカウントの一意の識別子で、通常はアカウントの[アドレス][]です。このリクエストは、このアカウントが所有するNFTのリストを返します。 |
| `ledger_hash`  | 文字列            | _(省略可)_ 使用するレジャーのバージョンを示す20バイトの16進数の文字列。([レジャーの指定][]を参照)。 |
| `ledger_index` | 文字列 または 数値  | _(省略可)_ 使用するレジャーの[レジャーインデックス][]、またはレジャーを自動的に選択するためのショートカット文字列。([レジャーの指定][]を参照)。 |
| `limit`        | 整数              | _(省略可)_ 取得する[トークンのページ][NFTokenPage オブジェクト]の数を制限します。各ページには最大32個のNFTを含めることができます。`limit`の値は20以上・400以下で指定します。この範囲外の正の値は、最も近い有効な値に置き換えられます。デフォルトは100です。 |
| `marker`       | [マーカー][]       | _(省略可)_ 以前のページ分割されたレスポンスの値。そのレスポンスが終了したところからデータの取得を再開します。 |


## レスポンスのフォーマット
処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "account": "rsuHaTvJh1bDmDoxX9QcKP7HEBSBt4XsHx",
    "account_nfts": [
      {
        "Flags": 1,
        "Issuer": "rGJUF4PvVkMNxG6Bg6AKg3avhrtQyAffcm",
        "NFTokenID": "00010000A7CAD27B688D14BA1A9FA5366554D6ADCF9CE0875B974D9F00000004",
        "NFTokenTaxon": 0,
        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
        "nft_serial": 4
      },
      {
        "Flags": 1,
        "Issuer": "rGJUF4PvVkMNxG6Bg6AKg3avhrtQyAffcm",
        "NFTokenID": "00010000A7CAD27B688D14BA1A9FA5366554D6ADCF9CE087727D1EA000000005",
        "NFTokenTaxon": 0,
        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
        "nft_serial": 5
      }
    ],
    "ledger_hash": "7971093E67341E325251268A5B7CD665EF450B126F67DF8384D964DF834961E8",
    "ledger_index": 2380540,
    "validated": true
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "result": {
    "account": "rsuHaTvJh1bDmDoxX9QcKP7HEBSBt4XsHx",
    "account_nfts": [
      {
        "Flags": 1,
        "Issuer": "rGJUF4PvVkMNxG6Bg6AKg3avhrtQyAffcm",
        "NFTokenID": "00010000A7CAD27B688D14BA1A9FA5366554D6ADCF9CE0875B974D9F00000004",
        "NFTokenTaxon": 0,
        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
        "nft_serial": 4
      },
      {
        "Flags": 1,
        "Issuer": "rGJUF4PvVkMNxG6Bg6AKg3avhrtQyAffcm",
        "NFTokenID": "00010000A7CAD27B688D14BA1A9FA5366554D6ADCF9CE087727D1EA000000005",
        "NFTokenTaxon": 0,
        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
        "nft_serial": 5
      }
    ],
    "ledger_hash": "46497E9FF17A993324F1A0A693DC068B467184023C7FD162812265EAAFEB97CB",
    "ledger_index": 2380559,
    "status": "success",
    "validated": true
  }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`                | 型                          | 説明                                     |
|:-----------------------|:----------------------------|:----------------------------------------|
| `account`              | 文字列                       | NFTの一覧を所有するアカウント |
| `account_nfts`         | 配列                         | アカウントが所有するNFTのリストで、**NFTオブジェクト**（下記参照）としてフォーマットされます。 |
| `ledger_hash`          | 文字列                       | _(省略可能)_ このレスポンスの生成に使用されたレジャーの識別ハッシュ。 |
| `ledger_index`         | 数値 - [レジャーインデックス][] | _(省略可能)_ このレスポンスの生成に使用されたレジャーのインデックス。 |
| `ledger_current_index` | 数値 - [レジャーインデックス][] | _(省略可能)_ このレスポンスの生成に使用された、現在進行中のレジャーバージョンのレジャーインデックス。 |
| `validated`            | ブール値                     | このレスポンスに含まれ、`true`に設定されている場合、このレスポンスの情報は検証済みのレジャーバージョンから取得したものです。そうでない場合、情報は変更される可能性があります。 |

### NFTオブジェクト

`account_nfts`配列の各オブジェクトは1つの[NFToken][]を表し、以下のフィールドを保持しています

| `Field`        | 型                  | 説明                                  |
|:---------------|:------------------- |:-------------------------------------|
| `Flags`        | 数値                | このNFTokenで有効なブール値フラグのビットマップ。指定できる値については、[NFTokenフラグ](../../../protocol/data-types/nftoken.md#nftoken-フラグ)をご覧ください。 |
| `Issuer`       | 文字列 - [アドレス][] | このNFTokenを発行したアカウント。 |
| `NFTokenID`    | 文字列               | このNFTokenの一意の識別子（16進数）。 |
| `NFTokenTaxon` | 数値                | このトークンの[taxon](../../../protocol/data-types/nftoken.md#nftokentaxon分類群)の非乱数化した値。同じtaxonを持つ複数のトークンは、一つの限定されたシリーズのインスタンスを表すかもしれません。 |
| `URI`          | String              | このNFTokenに関連付けられた16進数のURI データ。 |
| `nft_serial`   | 文字列               | このNFTokenのトークンシーケンス番号。 |

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `actNotFound` - リクエストの`account`フィールドに指定されている[アドレス][]が、レジャーのアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
