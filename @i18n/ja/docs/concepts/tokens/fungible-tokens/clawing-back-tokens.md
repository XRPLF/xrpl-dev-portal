---
html: clawing-back-tokens.html
parent: trust-lines-and-issuing.html
seo:
    description: 発行者は、トークンを発行する前にClawback機能を有効にすると、規制遵守の目的でトークンを取り戻すことができます。
labels:
  - トークン
---
# トークンの回収

{% partial file="/@i18n/ja/docs/_snippets/clawback-disclaimer.md" /%}

規制上の目的から、トークンがアカウントに送信された後にトークンを回収する機能を必要とする発行者が存在します。例えば、トークンが違法行為で制裁を受けたアカウントに送られたことが発覚した場合、発行者はその資金を「回収」することができます。

発行者は、発行アカウントで**Allow Clawback**フラグを有効にすることで、トークンを回収する権限を得ることができます。発行者がすでにトークンを発行している場合、このフラグを有効にすることはできません。

**注記:** アカウント自身が発行したトークンのみを回収することができます。この方法でXRPを回収することはできません。

Clawback機能はデフォルトで無効になっています。使用するには、[AccountSetトランザクション][]を送信して、**Allow Trust Line Clawback**設定を有効にする必要があります。**既存のトークンを持つ発行者はClawback機能を有効にすることはできません**。**Allow Trust Line Clawback**を有効にできるのは、所有者ディレクトリが完全に空の場合のみです。つまり、トラストライン、オファー、エスクロー、ペイメントチャネル、チェック、または署名者リストを設定する前に有効にする必要があります。

`lsfNoFreeze`が設定されているときに`lsfAllowTrustLineClawback`を設定しようとすると、トランザクションは`tecNO_PERMISSION`を返します。
逆に、`lsfAllowTrustLineClawback`が設定されている時に`lsfNoFreeze`を設定しようとすると、トランザクションは`tecNO_PERMISSION`を返します。

## Clawbackトランザクションの例

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

このトランザクションが成功した場合、rp6abvbTbjoce8ZDJkT6snvxTZSYMBCC9Sが発行し、rsA2LpzuawewSBQXkiju3YQTMzW13pAAdWが保有する最大314.159FOOを回収することになります。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
