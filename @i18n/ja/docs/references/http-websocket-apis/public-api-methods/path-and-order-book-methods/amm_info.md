---
html: amm_info.html
parent: path-and-order-book-methods.html
seo:
    description: 自動マーケットメーカ(AMM)の情報を取得する。
status: not_enabled
labels:
  - 分散型取引所
  - クロスカレンシー
  - AMM
---
# amm_info
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/AMMInfo.cpp "Source")

{% code-page-name /%}メソッドは、自動マーケットメーカー（AMM）インスタンスに関する情報を取得します。

_([AMM amendment][])_


### リクエストのフォーマット

リクエストの例

{% raw-partial file="/@i18n/ja/docs/_snippets/no-cli-syntax.md" /%}

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "command": "{% $frontmatter.seo.title %}",
    "asset": {
      "currency": "XRP"
    },
    "asset2": {
      "currency": "TST",
      "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
    }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "{% $frontmatter.seo.title %}",
    "params": [{
      "asset": {
        "currency": "XRP"
      },
      "asset2": {
        "currency": "TST",
        "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
      }
    }]
}
```
{% /tab %}

{% /tabs %}

[試してみる>](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Famm.devnet.rippletest.net%3A51233%2F#amm_info)

リクエストには以下のパラメーターが含まれます。

| `フィールド`    | 型                  | 必須? |  説明                                |
|:--------------|:--------------------|:------|:-----------------------------------|
| `account`     | 文字列 - [アドレス][] | いいえ | この流動性プロバイダーが保有するLPトークンのみを表示します。 |
| `amm_account` | 文字列 - [アドレス][] | いいえ | AMMの特別なAccountRootのアドレス。(これはAMMのLPトークンの`issuer`です)。 |
| `asset`       | オブジェクト          | いいえ | [通貨額][Currency Amount]のように、`currency`と`issuer`フィールドを持つオブジェクトとして（XRPの場合は`issuer`を省略）、検索するAMMの資産の一つを指定します。 |
| `asset2`      | オブジェクト          | いいえ | AMMの資産のもう一方を、`currency`と`issuer`フィールド（XRPの場合は`issuer`を省略）を持つオブジェクトとして、[通貨額][Currency Amount]のように指定することが可能です。 |

`amm_account`、または`asset`と`asset2`の両方を指定する必要があります。

### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "amm": {
      "account": "rp9E3FN3gNmvePGhYnf414T2TkUuoxu8vM",
      "amount": "296890496",
      "amount2": {
        "currency": "TST",
        "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
        "value": "25.81656470648473"
      },
      "asset2_frozen": false,
      "auction_slot": {
        "account": "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
        "auth_accounts": [
          {
            "account": "r3f2WpQMsAd8k4Zoijv2PZ78EYFJ2EdvgV"
          },
          {
            "account": "rnW8FAPgpQgA6VoESnVrUVJHBdq9QAtRZs"
          }
        ],
        "discounted_fee": 0,
        "expiration": "2023-Jan-26 00:28:40.000000000 UTC",
        "price": {
          "currency": "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
          "issuer": "rp9E3FN3gNmvePGhYnf414T2TkUuoxu8vM",
          "value": "0"
        },
        "time_interval": 0
      },
      "lp_token": {
        "currency": "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
        "issuer": "rp9E3FN3gNmvePGhYnf414T2TkUuoxu8vM",
        "value": "87533.41976112682"
      },
      "trading_fee": 600,
      "vote_slots": [
        {
          "account": "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
          "trading_fee": 600,
          "vote_weight": 9684
        }
      ]
    },
    "ledger_current_index": 316725,
    "validated": false
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
    "amm": {
      "account": "rp9E3FN3gNmvePGhYnf414T2TkUuoxu8vM",
      "amount": "296890496",
      "amount2": {
        "currency": "TST",
        "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
        "value": "25.81656470648473"
      },
      "asset2_frozen": false,
      "auction_slot": {
        "account": "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
        "auth_accounts": [
          {
            "account": "r3f2WpQMsAd8k4Zoijv2PZ78EYFJ2EdvgV"
          },
          {
            "account": "rnW8FAPgpQgA6VoESnVrUVJHBdq9QAtRZs"
          }
        ],
        "discounted_fee": 60,
        "expiration": "2023-Jan-26 00:28:40.000000000 UTC",
        "price": {
          "currency": "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
          "issuer": "rp9E3FN3gNmvePGhYnf414T2TkUuoxu8vM",
          "value": "0"
        },
        "time_interval": 0
      },
      "lp_token": {
        "currency": "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
        "issuer": "rp9E3FN3gNmvePGhYnf414T2TkUuoxu8vM",
        "value": "87533.41976112682"
      },
      "trading_fee": 600,
      "vote_slots": [
        {
          "account": "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
          "trading_fee": 600,
          "vote_weight": 9684
        }
      ]
    },
    "ledger_current_index": 316745,
    "status": "success",
    "validated": false
  }
}
```
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従っており、成功した場合は以下のフィールドを含みます。

| フィールド               | 型                   | 説明                                               |
|:-----------------------|:---------------------|:----------------------------------------------------------|
| `amm`                  | オブジェクト           | リクエストに含まれる資産ペアの[**AMM詳細オブジェクト**](#amm詳細オブジェクト)です。 |
| `ledger_current_index` | [レジャーインデックス][] | _(`ledger_index`の指定がある場合は省略)_ この情報を取得する際に使用された、現在の進行中の台帳の[レジャーインデックス][]。 |
| `ledger_hash`          | [ハッシュ][]           | _(`ledger_current_index`の指定がある場合は省略)_ この情報を取得する際に使用された台帳のバージョンの識別ハッシュ。 |
| `ledger_index`         | [レジャーインデックス][] | _(`ledger_current_index`の指定がある場合は省略)_ この情報を取得する際に使用した台帳のバージョンの[レジャーインデックス][]。 |
| `validated`            | 真偽値                 | もし`true`なら、このリクエストに使用された台帳は検証済みで、これらの結果は最終的なものです。もし省略されるか`false`に設定されると、データは未確定で変更される可能性があります。 |


### AMM詳細オブジェクト

`amm`フィールドは、自動マーケットメーカー（AMM）の現在の状態を記述するオブジェクトであり、以下のフィールドを含みます。

| フィールド        | 型         | 説明 |
|-----------------|------------|-------------|
| `amm_account`   | 文字列      | AMMアカウントの[アドレス][]です。 |
| `amount`        | [通貨額][]  | AMMのプールにある1つの資産の合計額。(注記:リクエストに指定した`asset` _または_ `asset2`になります。) |
| `amount2`       | [通貨額][]  | AMMのプール内の他の資産の合計額。(注意:リクエストに指定した`asset` _または_ `asset2`になります。) |
| `asset_frozen`  | 真偽値      | _(XRPの場合、省略)_ `true`の場合、`amount`の通貨は現在[凍結](../../../../concepts/tokens/fungible-tokens/freezes.md)されています。 |
| `asset2_frozen` | 真偽値      | _(XRPの場合、省略)_ `true`の場合、`amount2`の通貨は現在[凍結](../../../../concepts/tokens/fungible-tokens/freezes.md)されています。 |
| `auction_slot`  | オブジェクト | _(省略される場合があります)_ 存在する場合、現在のオークションスロットの所有者を記述した[オークションスロットオブジェクト](#オークションスロットオブジェクト)です。 |
| `lp_token`      | [通貨額][]  | このAMMのLPトークンの発行残高の合計。リクエスト時に`account`フィールドで流動性プロバイダを指定した場合、その流動性プロバイダが保有するこのAMMのLPトークンの量です。 |
| `trading_fee`   | 数値        | AMMの現在の取引手数料。単位は1/100,000で、1は0.001%の手数料に相当します。 |
| `vote_slots`    | 配列        | _(省略される場合があります)_ AMMの取引手数料に対する現在の投票数。[投票スロットオブジェクト](#投票スロットオブジェクト)として表示されます。 |


### オークションスロットオブジェクト

`AMM`オブジェクトの`auction_slot`フィールドは、AMMの現在のオークションスロット保持者を表し、以下のフィールドを含みます。

| フィールド         | 型        | 説明         |
|------------------|-----------|-------------|
| `account`        | 文字列     | オークションスロットを所有するアカウントの[アドレス][]です。 |
| `auth_accounts`  | 配列       | オークションスロットの所有者が、取引手数料の割引の対象として指定した追加アカウントのリスト。この配列の各メンバーは、1つのフィールド`account`を持つオブジェクトで、指定したアカウントのアドレスが含まれています。 |
| `discounted_fee` | 数値       | このAMMに対して取引を行う際に、オークションスロットの保有者、および対象となるアカウントに適用される割引後の取引手数料です。これは通常の取引手数料の1/10です。 |
| `expiration`     | 文字列     | このオークションスロットが期限切れとなるISO8601のUTCタイムスタンプ。期限切れになると、オークションスロットは適用されません (ただし、別のトランザクションで置き換えられるかクリーンアップされるまで、データは台帳に残ります)。 |
| `price`          | [通貨額][] | オークションスロット所有者がオークションスロットを獲得するために支払った金額（LPトークン単位）です。これは、現在のスロット所有者を競り落とすための価格に影響します。 |
| `time_interval`  | 数値       | このオークションスロットが現在入っている72分の時間間隔を0から19までで指定します。オークションスロットは24時間後（72分間隔で20回）に失効し、現在の保有者を競り落とすためのコストと、誰かが競り落とした場合に現在の保有者が払い戻される金額に影響します。 |


### 投票スロットオブジェクト

`vote_slots`配列の各項目は、取引手数料を設定するための流動性供給者の投票権を表し、以下のフィールドを含みます。

| フィールド      | 型    | 説明 |
|---------------|-------|-------------|
| `account`     | 文字列 | この流動性供給者の[アドレス][]。 |
| `trading_fee` | 数値   | この流動性供給者が投票した取引手数料。単位は1/100,000です。 |
| `vote_weight` | 数値   | この流動性供給者の投票が、最終的な取引手数料にどれだけカウントさ れるかを表します。これは、この流動性供給者がAMMのLPトークンをどれだけ保有しているかに比例します。値は、この流動性供給者が保有するこのLPトークンの数の100,000倍を、発行済LPトークンの総数で割ったものになります。例えば、値が1000の場合、流動性供給者はこのAMMのLPトークンの1%を保有していることを意味します。 |


### 考えられるエラー

- [汎用エラータイプ][]のすべて。
- `actNotFound` - この資産ペアのAMMが存在しないか、リクエストで指定された発行アカウントが存在しません。
- `invalidParams` - 1つまたは複数のフィールドの指定に誤りがあるか、1つまたは複数の必須フィールドが欠落しています。


## 関連項目

 - [AMMオブジェクト](../../../protocol/ledger-data/ledger-entry-types/amm.md) - AMMオブジェクトの正規の保存形式
 - [AMMBid][] - オークションスロットと入札の仕組みについての詳細はこちら
 - [AMMVote][] - 取引手数料の投票メカニズムの詳細はこちら

{% raw-partial file="/docs/_snippets/common-links.md" /%}
