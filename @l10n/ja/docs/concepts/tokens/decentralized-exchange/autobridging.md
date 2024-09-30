---
html: autobridging.html
parent: decentralized-exchange.html
seo:
    description: オートブリッジングは、コストが下がる場合はXRPを仲介として使用してオーダーブックを自動的に接続します。
labels:
  - XRP
  - 分散型取引所
---
# オートブリッジング

XRP Ledgerの[分散型取引所](index.md)で、XRP以外の2種類の通貨を交換する[オファー](offers.md)があった場合、合成されたオーダーブックで[XRP](../../../introduction/what-is-xrp.md)が中間通貨として使用されることがあります。これは _オートブリッジング_ によるものです。この機能は、通貨を直接交換するよりも安く済む場合にXRPを使用し、あらゆる通貨ペアの流動性を向上させる役割を担います。XRP Ledgerのネイティブ暗号資産であるというXRPの特性によりこのように機能します。オファーを実行する際は、直接オファーとオートブリッジングオファーを組み合わせることで全体として最良の為替レートを実現できます。

例: _AnitaはGBPを売却してBRLを購入するオファーを発行しました。このような一般的ではない通貨マーケットでは、オファーがあまりない場合があります。良いレートのオファーが1件ありますが、Anitaの取引を満たすのに十分な量ではありません。ただしGBPとXRPおよびBRLとXRPの間には、それぞれアクティブで競争力のあるマーケットが存在します。XRP Ledgerのオートブリッジングシステムは、あるトレーダーからXRPをGBPで購入し、そのXRPを別のトレーダーに支払ってBRLを購入することで、Anitaのオファーを履行できる方法を見つけます。AnitaはGBPとBRLを直接交換するマーケットでの少額オファーを、GBP対XRPのオファーとXRP対BRLのオファーをペアリングしてより良い複合レートと組み合わせて、最適なレートを自動的に得ることができます。_

オートブリッジングは、あらゆる[OfferCreateトランザクション][]で自動的に行われます。[Paymentトランザクション](../../../references/protocol/transactions/types/payment.md)ではオートブリッジングはデフォルトでは _行われません_ が、path-findingにより同様の効果のある[パス](../fungible-tokens/paths.md)を検索できます。

## 関連項目

- [Dev Blog: Introducing Autobridging](https://xrpl.org/blog/2014/introducing-offer-autobridging.html)

- [オファーの優先度](offers.md#オファーの優先度)

- [ペイメントパス](../fungible-tokens/paths.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
