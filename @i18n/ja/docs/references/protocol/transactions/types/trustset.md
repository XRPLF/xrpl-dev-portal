---
html: trustset.html
parent: transaction-types.html
seo:
    description: トラストラインを作成または変更します。
labels:
  - トークン
---
# TrustSet

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/SetTrust.cpp "Source")

2つのアカウントをリンクする[トラストライン](../../../../concepts/tokens/fungible-tokens/index.md)を作成または変更します。

## {% $frontmatter.seo.title %} JSONの例

```json
{
   "TransactionType": "TrustSet",
   "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
   "Fee": "12",
   "Flags": 262144,
   "LastLedgerSequence": 8007750,
   "LimitAmount": {
     "currency": "USD",
     "issuer": "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc",
     "value": "100"
   },
   "Sequence": 12
}
```

{% raw-partial file="/@i18n/ja/docs/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->

| フィールド                    | JSONの型 | [内部の型][] | 説明       |
|:-------------------------|:----------|:------------------|:------------------|
| `LimitAmount`            | オブジェクト    | Amount            | 作成または変更するトラストラインを定義する[通貨額][]フォーマットのオブジェクト。 |
| `LimitAmount`.`currency` | 文字列    | （Amount.currency） | このトラストラインが適用される通貨。3文字の[ISO 4217通貨コード](https://www.xe.com/iso4217.php)または[通貨フォーマット](../../data-types/currency-formats.md)に基づく160ビットの16進数値です。「XRP」は無効です。 |
| `LimitAmount`.`value`    | 文字列    | （Amount.value）    | このトラストラインに設定される限度を表す引用符で囲んだ10進数値。 |
| `LimitAmount`.`issuer`   | 文字列    | （Amount.issuer）   | 信頼したいアカウントのアドレス。 |
| `QualityIn`              | 数値    | UInt32            | _（省略可）_ このトラストラインの受入額を、1,000,000,000単位当たりのこの数値の割合で評価。値`0`は、残高を額面価格で扱うことを示す省略表現です。 |
| `QualityOut`             | 数値    | UInt32            | _（省略可）_ このトラストラインの払出額を、1,000,000,000単位当たりのこの数値の割合で評価。値`0`は、残高を額面価格で扱うことを示す省略表現です。 |

`LimitAmount.issuer`で指定されたアカウントがトラストラインの着信をブロックしている場合、結果コード`tecNO_PERMISSION`でトランザクションが失敗します。 _([DisallowIncoming amendment][] が必要です)_

## TrustSetのフラグ

TrustSetタイプのトランザクションについては、[`Flags`フィールド](../common-fields.md#flagsフィールド)で以下の値が追加でサポートされます。

| フラグ名           | 16進数値      | 10進数値       | 説明                   |
|:------------------|:-------------|:--------------|:----------------------|
| `tfSetfAuth`      | `0x00010000` | 65536         | [このアカウントから発行された通貨](../../../../concepts/tokens/index.md)を相手方に保有させることを許可します。（[*asfRequireAuth* AccountSet フラグ](accountset.md#accountsetのフラグ)を使用しない場合は効果がありません。）設定を解除できません。 |
| `tfSetNoRipple`   | `0x00020000` | 131072        | 2つのトラストラインの両方でこのフラグが有効になっている場合、同じ通貨のトラストライン間の[リップリング](../../../../concepts/tokens/fungible-tokens/rippling.md)をブロックする No Ripple フラグを有効にします。 |
| `tfClearNoRipple` | `0x00040000` | 262144        | No Rippleフラグを無効にし、このトラストラインで[リップリング](../../../../concepts/tokens/fungible-tokens/rippling.md)を許可します。 |
| `tfSetFreeze`     | `0x00100000` | 1048576       | トラストラインを[凍結](../../../../concepts/tokens/fungible-tokens/freezes.md)します。 |
| `tfClearFreeze`   | `0x00200000` | 2097152       | トラストラインを[凍結解除](../../../../concepts/tokens/fungible-tokens/freezes.md)します。 |

トランザクションがNo Rippleを有効にしようとしたができない場合、結果コード `tecNO_PERMISSION` で失敗します。[fix1578 amendment][]が有効になる前は、このようなトランザクションは代わりに`tesSUCCESS`（可能な限りの他の変更を行う）という結果になりました。

トラストラインのAuthフラグは、トラストラインがその所有者のXRP必要準備金に反映されるかどうかを左右しません。ただしAuthフラグを有効にすると、トラストラインがデフォルト状態になることがありません。承認されたトラストラインは削除できません。イシュアーは、トラストラインの限度と残高が0であっても、`tfSetfAuth`フラグだけを使用してトラストラインを事前承認できます。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
