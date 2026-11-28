---
seo:
    description: 発行者は、トークンを発行する前にClawback機能を有効にすると、規制遵守の目的でトークンを取り戻すことができます。
labels:
  - トークン
---
# トークンの回収

規制上の目的から、トークンがアカウントに配布された後にトークンを取り戻す機能を必要とする発行者がいます。たとえば、違法行為で制裁を受けたアカウントにトークンが送られたことが発覚した場合、発行者はその資金を取り戻す、つまり *回収（Clawback）* することができます。資金を回収する機能の制御方法は、トークンの種類によって異なります。

- 発行者は、発行アカウントで**Allow Clawback**フラグを有効にすると、自身が発行するすべての[トラストライントークン](./trust-line-tokens.md)を回収する機能を得られます。発行者がすでにトラストライントークンを発行している場合、このフラグは有効にできません。{% amendment-disclaimer name="Clawback" /%}
- [MPT](./multi-purpose-tokens.md)は、MPTの発行で**Can Clawback**フラグが有効になっている場合に、発行者が回収できます。{% amendment-disclaimer name="MPTokensV1" /%}
- XRPはトークンではないため、回収できません。


## トラストライントークンの回収を許可する

Clawback機能はデフォルトで無効になっています。使用するには、[AccountSetトランザクション][]を送信して、**Allow Trust Line Clawback**設定を有効にする必要があります。**既存のトークンを持つ発行者は、Clawback機能を有効にできません。** **Allow Trust Line Clawback**を有効にできるのは、所有者ディレクトリが完全に空の場合のみです。つまり、トラストライン、オファー、エスクロー、ペイメントチャネル、チェック、署名者リストを設定する前に有効にする必要があります。

`lsfNoFreeze`が設定されているときに`lsfAllowTrustLineClawback`を設定しようとすると、トランザクションは`tecNO_PERMISSION`を返します。トラストラインをフリーズする機能をすでに放棄したアカウントでは、Clawbackを有効にできないためです。
逆に、`lsfAllowTrustLineClawback`が設定されているときに`lsfNoFreeze`を設定しようとした場合も、トランザクションは`tecNO_PERMISSION`を返します。

## MPTの回収を許可する

Clawback機能はデフォルトで無効になっています。使用するには、MPTで**Can Clawback**フラグを有効にしておく必要があります。このフラグはMPTの発行の定義の一部で、トークンを発行する前に設定します。

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

このトランザクションが成功した場合、rp6abvbTbjoce8ZDJkT6snvxTZSYMBCC9Sが発行し、rsA2LpzuawewSBQXkiju3YQTMzW13pAAdWが保有する最大314.159 FOOが回収されます。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
