---
html: clawback.html
parent: transaction-types.html
seo:
    description: 発行したトークンを取り戻します。
labels:
  - トークン
---
# Clawback

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/Clawback.cpp "ソース")

{% partial file="/@i18n/ja/docs/_snippets/clawback-disclaimer.md" /%}

あなたのアカウントが発行したトークンを回収します。

Clawback機能はデフォルトで無効になっています。使用するには、[AccountSetトランザクション][]を送信して**Allow Trust Line Clawback**設定を有効にする必要があります。既存のトークンを持つ発行者はClawback機能を有効にできません。つまり、トラストライン、オファー、エスクロー、ペイメントチャネル、チェック、または署名者リストを設定する前に行う必要があります。Clawback機能を有効にした後、元に戻すことはできません：アカウントは永久にトラストラインで発行された資産を回収する権限を得ます。

## {% $frontmatter.seo.title %} JSONの例

```json
{
  "TransactionType": "Clawback",
  "Account": "rp6abvbTbjoce8ZDJkT6snvxTZSYMBCC9S",
  "Amount": {
      "currency": "FOO",
      "issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
      "value": "314.159"
    }
}
```

{% raw-partial file="/@i18n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド　         | JSONの型   | [内部の型][] | 説明       |
|:-------------------|:----------|:------------|:----------|
| `Amount`           | [通貨額][] | Amount      | 回収する金額と、その金額を回収する相手を表します。`value`サブフィールドの回収する数量はゼロであってはなりません。これが現在の残高より多い場合、トランザクションは全残高を回収します。サブフィールド`Amount`内の`issuer`はトークン所有者のアカウントを表します。|

このトランザクションを実行するアカウントは、回収する資産の発行者でなければなりません。XRP Ledgerでは、トラストラインは双方向であり、設定によっては双方が資産の*発行者*とみなされることに注意してください。この仕様において、*発行者*という用語は、未払い残高がある(つまり、発行された資産に"債務がある")トラストラインの側が、その資産を回収することを意味します。


## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは、次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード | 説明 |
|:-----------|:------------|
| `temDISABLED` | [Clawback amendment](/resources/known-amendments.md#clawback)が有効ではありません。 |
| `temBAD_AMOUNT` | 保有者の残高が0です。回収しようとする金額が保有者の残高を超えていてもエラーにはなりません。また、`Amount`に記載されている相手がこのトランザクションを発行している`Account`と同じ場合にもエラーが発生します。 |
| `tecNO_LINE` | 取引相手とのトラストラインがない、またはトラストラインの残高が0です。 |
| `tecNO_PERMISSION` | `lsfNoFreeze`が設定されているときに`lsfAllowTrustlineClawback`を設定、または`lsfAllowTrustLineClawback`が設定されているときに`lsfNoFreeze`を設定しようとしています。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
