# TrustSet

[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/SetTrust.cpp "Source")

2つのアカウントをリンクするトラストラインを作成または変更します。

## {{currentpage.name}} JSONの例

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

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->

| フィールド                    | JSONの型 | [内部の型][] | 説明       |
|:-------------------------|:----------|:------------------|:------------------|
| `LimitAmount`            | オブジェクト    | Amount            | 作成または変更するトラストラインを定義する[通貨額][]フォーマットのオブジェクト。 |
| `LimitAmount`.`currency` | 文字列    | （Amount.currency） | このトラストラインが適用される通貨。3文字の[ISO 4217通貨コード](http://www.xe.com/iso4217.php)または[通貨フォーマット](currency-formats.html)に基づく160ビットの16進数値です。「XRP」は無効です。 |
| `LimitAmount`.`value`    | 文字列    | （Amount.value）    | このトラストラインに設定される限度を表す引用符で囲んだ10進数値。 |
| `LimitAmount`.`issuer`   | 文字列    | （Amount.issuer）   | 信頼したいアカウントのアドレス。 |
| `QualityIn`              | 数値    | UInt32            | _（省略可）_ このトラストラインの受入額を、1,000,000,000単位当たりのこの数値の割合で評価。値`0`は、残高を額面価格で扱うことを示す省略表現です。 |
| `QualityOut`             | 数値    | UInt32            | _（省略可）_ このトラストラインの払出額を、1,000,000,000単位当たりのこの数値の割合で評価。値`0`は、残高を額面価格で扱うことを示す省略表現です。 |


## TrustSetのフラグ

TrustSetタイプのトランザクションについては、[`Flags`フィールド](transaction-common-fields.html#flagsフィールド)で以下の値が追加でサポートされます。

| フラグ名       | 16進数値  | 10進数値 | 説明                   |
|:----------------|:-----------|:--------------|:------------------------------|
| tfSetfAuth      | 0x00010000 | 65536         | 他方の当事者がこのアカウントからのイシュアンスを保有することを承認します。（[*asfRequireAuth* AccountSet フラグ](accountset.html#accountsetのフラグ)を使用しない場合は効果がありません。）設定を解除できません。 |
| tfSetNoRipple   | 0x00020000 | 131072        | 同一通貨の2つのトラストラインでこのフラグが設定されている場合、これらのトラストライン間でのripplingがブロックされます。（詳細は、[NoRipple](rippling.html)を参照してください。）[fix1578 Amendment][]が有効な場合、トランザクションにこのフラグが使用されていてもNoRippleを有効にできないときは、そのトランザクションは結果コード`tecNO_PERMISSION`で失敗します。このAmendmentが有効ではない場合は、トラストラインでNoRippleを有効にできない場合でもトランザクションの結果が`tesSUCCESS`になることがあります（トランザクションで可能な他の変更を行います）。 |
| tfClearNoRipple | 0x00040000 | 262144        | No-Ripplingフラグをクリアします。（詳細は、[NoRipple](rippling.html)を参照してください。） |
| tfSetFreeze     | 0x00100000 | 1048576       | トラストラインを[凍結](freezes.html)します。 |
| tfClearFreeze   | 0x00200000 | 2097152       | トラストラインを[凍結解除](freezes.html)します。 |

トラストラインのAuthフラグは、トラストラインがその所有者のXRP必要準備金に反映されるかどうかを左右しません。ただしAuthフラグを有効にすると、トラストラインがデフォルト状態になることがありません。承認されたトラストラインは削除できません。イシュアーは、トラストラインの限度と残高が0であっても、`tfSetfAuth`フラグだけを使用してトラストラインを事前承認できます。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
