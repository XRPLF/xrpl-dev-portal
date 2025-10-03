---
seo:
    description: 発行したトークンを取り戻します。
labels:
  - トークン
---
# Clawback

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Clawback.cpp "ソース")

あなたのアカウントが発行したトークンを回収します。

Clawback機能はデフォルトで無効になっています。使用するには、[AccountSetトランザクション][]を送信して**Allow Trust Line Clawback**設定を有効にする必要があります。既存のトークンを持つ発行者はClawback機能を有効にできません。つまり、トラストライン、オファー、エスクロー、ペイメントチャネル、チェック、または署名者リストを設定する前に行う必要があります。Clawback機能を有効にした後、元に戻すことはできません：アカウントは永久にトラストラインで発行された資産を回収する権限を得ます。

{% amendment-disclaimer name="Clawback" /%}

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

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド         | JSONの型   | [内部の型][] | 説明       |
|:-------------------|:-----------|:-------------|:----------|
| `Amount`           | [通貨額][] | Amount       | 回収する金額と、その金額を回収する相手を表します。`value`サブフィールドの回収する数量はゼロであってはなりません。これが現在の残高より多い場合、トランザクションは全残高を回収します。サブフィールド`Amount`内の`issuer`はトークン所有者のアカウントを表します。|
| `Holder`           | 文字列     | AccountID    | (任意) 回収する相手のアカウントアドレスを指定します。回収対象のアカウントの所有する`MPToken`オブジェクトの残高が非ゼロである必要があります。 |

{% admonition type="info" name="注記" %}XRP LedgerのIOU(トラストライン)では、トークンを発行した側を_発行者_と呼びますが、トラストラインは双方向性があり、設定によっては双方を発行者とみなすことができます。このトランザクションでは、トークン発行者のアドレスは`Account`フィールドにあり、トークン保有者のアドレスは`Amount`フィールドの`issuer`サブフィールドにあります。{% /admonition %}

{% admonition type="info" name="注記" %}MPTの保有者から資金を回収するには、発行者は`MPTokenIssuanceCreate`トランザクションを使用してMPTを作成するときに`tfMPTCanClawback`フラグを設定して、MPTがClawbackを許可することを指定しなければなりません。このフラグが設定されたMPTが作成されたと仮定すると、`Clawback`トランザクションを使用して回収を行うことができます。{% /admonition %}


## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは、次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード | 説明 |
|:-----------|:------------|
| `temDISABLED` | [Clawback amendment](/resources/known-amendments.md#clawback)が有効ではありません。 |
| `temBAD_AMOUNT` | 保有者の残高が0です。回収しようとする金額が保有者の残高を超えていてもエラーにはなりません。また、`Amount`に記載されている相手がこのトランザクションを発行している`Account`と同じ場合にもエラーが発生します。 |
| `tecNO_LINE` | 取引相手とのトラストラインがない、またはトラストラインの残高が0です。 |
| `tecNO_PERMISSION` | `lsfNoFreeze`が設定されているときに`lsfAllowTrustlineClawback`を設定、または`lsfAllowTrustLineClawback`が設定されているときに`lsfNoFreeze`を設定しようとしています。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
