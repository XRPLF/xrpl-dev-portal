---
html: issued-currencies-overview.html
parent: issued-currencies.html
blurb: 発行済み通貨の概要と、XRP Ledgerにおけるその特性について説明します。
labels:
  - トークン
---
# 発行済み通貨の概要

XRP Ledgerでは、XRP以外の通貨はすべて**発行済み通貨**とされます。このようなデジタル資産（「イシュアンス」または「IOU」とも呼ばれます）は、「トラストライン」と呼ばれるアドレス間の会計上の関係で管理されます。発行済み通貨は通常、負債とも資産とも見なされるため、トラストラインの残高は、見る視点によってマイナスにもプラスにもなります。どのアドレスも（XRP以外の）通貨を自由に発行できますが、他のアドレスが希望する保有量によってのみ制限されます。

発行済み通貨は、同一通貨コードを使用する複数のイシュアーと保有者を通じて「Rippling」されます。これが役立つ場合もありますが、予期しない結果や望ましくない結果が生じることもあります。トラストライン上で[NoRippleフラグ](rippling.html)を使用すれば、トラストラインを通じたRipplingを防ぐことができます。

XRP Ledgerの分散型取引所では、発行済み通貨対XRPの取引や、発行済み通貨間の取引を行えます。

一般的なモデルでは、発行済み通貨は、XRP Ledger外部で保有されている通貨またはその他の資産に結び付けられています。通貨のイシュアー（_ゲートウェイ_）は、XRP Ledger外部の通貨を、XRP Ledgerの発行済み通貨の同等の残高と交換するための入出金処理を行います。ゲートウェイの運用方法についての詳細は、[XRP Ledgerのゲートウェイになる](become-an-xrp-ledger-gateway.html)を参照してください。

XRP Ledgerの発行済み通貨は他の用途にも使えます。たとえば、固定量の通貨をセカンダリアドレスに発行し、イシュアーへキーを譲渡すれば、「イニシャルコインオファリング」（ICO）を作成できます。

**警告:** ICOは米国では[証券と見なされ、規制対象となる](https://www.sec.gov/oiea/investor-alerts-and-bulletins/ib_coinofferings)可能性があります。

金融サービスビジネスを始める前に、関連規制を調査されることを強くお勧めします。

## 発行済み通貨の使用方法

トラストラインは、ゲートウェイの債務を負う意思を明示的に表明するものです。（つまり、「あなたはXRP Ledgerの外部で私からこれだけのお金を借りることができます。」ということです。）

発行済み通貨の使用方法として想定されるモデルは、信頼できる金融機関である _ゲートウェイ_ で使用することです。ゲートウェイでは、外界の資産を管理し、[複数通貨間の支払い](cross-currency-payments.html)や[分散型取引所](decentralized-exchange.html)での取引のためにXRP Ledgerで使用できるようにします。この流れは以下のようになります。

1. 顧客がゲートウェイに通貨を送金します。通貨は、法定通貨やBitcoinなど、XRP Ledgerのネイティブ資産でないものが考えられます。
2. ゲートウェイは、その通貨を保管して記録します。
3. ゲートウェイは、その顧客に属するアドレスに対して、XRP Ledgerでの残高を同じ通貨建てで発行します。
4. 顧客は、[複数通貨間の支払い](cross-currency-payments.html)の送金や[分散型取引所](decentralized-exchange.html)での取引などによって、発行済み通貨をXRP Ledgerで自由に使用できます。
5. 顧客（必ずしも最初に預金した顧客ではない）は、発行済み通貨をゲートウェイのXRP Ledgerのアドレスに送金します。
6. ゲートウェイは、XRP Ledgerの資金の残高を送信した顧客のIDを確認し、対応する金額を _XRP Ledgerの外部で_ その顧客に付与します。

XRP Ledgerへの「入金」や「出金」のプロセスに関する詳細は、ゲートウェイ、法的管轄、関連する資産のタイプなどの要因に基づいて異なります。

## 発行済み通貨の特性

XRP Ledger内の発行済み通貨はすべてトラストラインに存在し、レジャーのデータでは[RippleStateオブジェクト](ripplestate.html)として表示されます。発行済み通貨を作成するには、発行アドレスは、対象となる通貨に対し非ゼロ制限のあるイシュアーへのトラストラインを持つアドレスに対し、[Paymentトランザクション][]を送信します。（発行済み通貨は、このようなトラストラインを通じてRipplingする方法でも作成できます。）発行済み通貨を消去するには、通貨をイシュアーに戻します。

通貨のイシュアーは、2名の当事者が発行済み通貨で取引をする際に差し引かれる[送金手数料](transfer-fees.html)のパーセンテージを定義できます。

アドレスは発行済み通貨を[凍結](freezes.html)することもでき、企業が当該地域の金融規制に準拠する際に有用です。この機能が不要で、通貨を凍結しない場合は、アドレスが有する個別のトラストラインを凍結する機能と、Global Freezeを取り消す機能を放棄できます。XRPは凍結できません。

発行済み通貨は、あらゆる種類の通貨または資産（額面価格が極めて低い、または高いものを含む）に相当するとされています。通貨コードの種類と発行済み通貨の表記の数値制限に関する技術的な詳細は、[通貨フォーマットのリファレンス](currency-formats.html)を参照してください。

## 関連項目

- **コンセプト:**
  - [XRP](xrp.html)
  - [複数通貨間の支払い](cross-currency-payments.html)
  - [分散型取引所](decentralized-exchange.html)
- **チュートリアル:**
  - [XRP Ledgerゲートウェイの開設](become-an-xrp-ledger-gateway.html)
  - [トランザクションの結果の確認](look-up-transaction-results.html)
  - [専門化した支払いタイプの使用](use-specialized-payment-types.html)
- **リファレンス:**
  - [Paymentトランザクション][]
  - [TrustSetトランザクション][]
  - [RippleStateオブジェクト](ripplestate.html)
  - [account_linesメソッド][]
  - [account_currenciesメソッド][]
  - [gateway_balancesメソッド][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
