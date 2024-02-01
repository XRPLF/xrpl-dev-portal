---
html: ticksize.html
parent: decentralized-exchange.html
seo:
    description: 発行者は、為替レートのごくわずかな差を超えて、頻繁な取引を抑制するためにオーダーブックで通貨のカスタムチックサイズを設定することができます。
labels:
  - 分散型取引所
  - トークン
---
# ティックサイズ

_（[TickSize Amendment][]により追加されました。）_

オファーがオーダーブックに対して発行されると、そのオファーに関係する通貨の発行者によって設定された`TickSize`の値に基づいて、為替レートが切り捨てられます。トレーダーがXRPとトークンを交換するオファーを出した場合は、そのトークンの発行者からの`TickSize`が適用されます。トレーダーが2種類のトークンを交換するオファーを出した場合は、小さい方の`TickSize`の値（有効数字の桁数が少ない値）がこのオファーに適用されます。いずれの通貨にも`TickSize`が設定されていない場合、デフォルトが適用されます。

オーダーブックにオファーが発行されると、`TickSize` によりオファーの為替レートの _有効数字_ の桁数が切り捨てられます。発行者は[AccountSetトランザクション][]を使用して`TickSize`を`3`～`15`の整数に設定できます。為替レートは有効数字と指数で表されますが、`TickSize`は指数には影響しません。これにより、XRP Ledgerでは価値が大きく異なる資産（ハイパーインフレ通貨と希少通貨など）間の為替レートを表せます。発行者が設定する`TickSize`が小さいほど、トレーダーはより多くの増分をオファーして、既存のオファーよりも高い為替レートと見えるようにする必要があります。

`TickSize`は、オファーの即時に実行可能な部分には影響しません。（この理由から、`tfImmediateOrCancel`が指定されたOfferCreateトランザクションは`TickSize` の値の影響を受けません。）オファーを完全に実行できない場合、トランザクション処理エンジンは`TickSize`に基づいて為替レートを計算して切り捨てを行います。次にエンジンは、切り捨てた後の為替レートに一致するように、「重要性が低い」側からのオファーの残額を丸めます。デフォルトのOfferCreateトランザクション（「買い」オファー）の場合、`TakerPays`の額（購入額）が丸められます。`tfSell`フラグが有効な場合（「売り」オファー）`TakerGets`の額（売却額）が丸められます。

発行者が`TickSize`を有効化、無効化、または変更する場合、以前の設定で発行されたオファーはその影響を受けません。

## 参照項目

- [Dev Blog: Introducing the TickSize Amendment](https://ripple.com/dev-blog/ticksize-amendment-open-voting/#ticksize-amendment-overview)

- [AccountSetトランザクション][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
