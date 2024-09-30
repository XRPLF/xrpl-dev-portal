---
parent: concepts.html
html: tokens.html
seo:
    description: XRP Ledger上でデジタルな価値を表すトークンを作成することができます。
labels:
  - トークン
---
# トークン

XRP以外のすべての資産は、XRP Ledgerでは **トークン** として扱うことができます。通常のトークンは、アカウント間の[トラストライン](fungible-tokens/index.md) と呼ばれる関係で管理されます。すべてのアカウントは、トークンを保有することを許可する他のアカウントにはトークンを発行できますが、トークンを必要としないアカウントに一方的にトークンを配付することはできません。トークンは、台帳の外に存在する資産に裏付けられた「ステーブルコイン」、XRP Ledger上で独自に作成された純粋なデジタルトークン、コミュニティクレジットなど、様々な種類の価値を表すことが出来ます。

**注記:** XRP Ledger上のトークンは、過去に「IOUs」（[I-owe-you](https://en.wikipedia.org/wiki/IOU)の略）および「発行済み通貨」とも呼ばれてきました。しかし、これらの呼称は、XRP Ledgerのトークンが表すことのできるデジタル資産の全範囲をカバーしていないため、望ましくないとされています。<!-- STYLE_OVERRIDE: ious -->

通常のトークンは代替可能です。つまり、同じトークンはすべて代替可能であり、区別がつきません。非代替トークン(NFT)も可能です。XRP Ledgerでのネイティブ対応の詳細については、[非代替トークン(NFT)](nfts/index.md)をご覧ください。

トークンは[クロスカレンシー支払い](../payment-types/cross-currency-payments.md)に使用でき、[分散型取引所(DEX)](decentralized-exchange/index.md)で取引することができます。

トラストラインの残高は、どちら側から見るかによって、プラスまたはマイナスで表されます。マイナスの残高を持つ側は「発行者」と呼ばれ、そのトークンに関するいくつかの機能を設定することができます。発行者ではない別のアカウントにトークンを送ると、それらのトークンは発行者、場合によっては同じ通貨コードを使用している他のアカウントに「ripple」します。これは便利な場合もありますが、想定外の挙動を引き起こす可能性もあります。トラストラインに[No Ripple flag](fungible-tokens/rippling.md)を使用すると、トラストラインがripplingしないように設定することができます。

## ステーブルコイン

XRP Ledger におけるトークンの代表的なモデルとして、発行者が XRP Ledgerの外部に価値ある資産を保有し、その価値を表すトークンをLedger上で発行するというものがあります。このタイプの発行者は、そのサービスを通じてXRP Ledgerに通貨を送受信できることから、 _ゲートウェイ_ と呼ばれることもあります。トークンの裏付けとなる資産が、台帳上のトークンと同じ金額と額面を使用している場合、そのトークンは「ステーブルコイン」といえるでしょう。なぜなら、そのトークンと台帳外の資産との交換レートは理論上1：1で安定するはずだからです。

ステーブルコインの発行者は、XRP Ledgerの外側において、トークンを実際の通貨や資産と交換するための _入金_ と _出金_ のサービスを提供する必要があります。

実際には、XRP Ledger はただのシステムであり、その外側にいかなるルールも適用することはできません。そのため、XRP Ledger上のステーブルコインは、その発行者を信頼し、その発行者が要求に応じてトークンを現物資産へ交換することができなければ、そのステーブルコインの価値が維持されないと考えるべきでしょう。ユーザは、誰がトークンを発行しているのか、信頼できるのか、合法的なのか、支払能力があるのか、という点について十分に注意をしなければなりません。信頼できない場合は、そのトークンを保有するべきではないでしょう。

[Stablecoin Issuer](../../use-cases/tokenization/stablecoin-issuer.md)をご覧ください。

## コミュニティクレジット

XRP Ledgerのもう一つの利用方法として、「コミュニティクレジット」という、知人同士がXRP Ledgerを利用して、誰が誰にいくら借金があるのかを把握する仕組みがあります。この借金を自動的かつアトミックに活用し、[rippling](fungible-tokens/rippling.md)を通じて支払いを決済できるのが、XRP Ledgerの優れた機能です。

例えば、AsheeshがMarcusに20ドル、MarcusがBharathに50ドルの借金がある場合、BharathはAsheeshのMarcusに対する借金を帳消しにする代わりに、その分のMarcusに対する借金を帳消しすることによってAsheeshに20ドルを「支払う」ことができる。逆もまた可能である。AsheeshはMarcusを通してBharathに支払うことで、それぞれの負債を減らすことができるのです。XRP Ledgerは、このように複雑な連鎖的な取引を、中間にいるアカウントが何もせずとも、単一の取引で決済することができるのです。

このタイプの使用法については、[paths](fungible-tokens/paths.md)をご覧ください。<!--{# TODO: コミュニティクレジットのもっと例示的なページへのリンクができるといいですね。#}-->

## その他のトークン

XRP Ledgerで発行されるトークンには、その他にも使用例があります。例えば、セカンダリアドレスに一定数量の通貨を発行し、発行者に「キーを渡す」ことで、「ICO（Initial Coin Offering）」を行うことができます。

**警告:** ICOは米国では[証券と見なされ、規制対象となる](https://www.sec.gov/oiea/investor-alerts-and-bulletins/ib_coinofferings)可能性があります。

金融サービスビジネスを始める前に、関連規制を調査されることを強くお勧めします。

## トークンの特性

XRP Ledgerにおけるトークンは、[XRPと異なる性質](../../references/protocol/data-types/currency-formats.md#comparison)を持ちます。トークンは常に _トラストライン内_ に存在し、トークンのすべての移動はトラストラインに沿って行われます。他のアカウントに、トラストラインに設定された上限を超えるトークンを保有させることはできません。(自分のトラストラインを制限以上に増やすことは _可能_ です。例えば、[分散型取引所](decentralized-exchange/index.md)でさらに購入したり、すでにプラスの残高がある状態で上限値を下げたりすることができます。)

トークンは、精度が15桁の10進数（基数10）と指数を用いて、非常に大きな値（最大9999999999999999×10<sup>80</sup>）から、非常に小さな値（最小1.0×10<sup>-81</sup>まで）を表現することができます。

必要なトラストラインが設定されていれば、誰でも[Paymentトランザクション][]を送信することでトークンを発行することができます。トークンを発行者に送り返せば、トークンを「burn」することができます。また、発行者の設定により、[クロスカレンシー支払い](../payment-types/cross-currency-payments.md)やトレードでトークンをさらに生み出せるケースもあります。

発行者は、ユーザがトークンを送金する際に自動で差し引かれる「送金手数料」(transfer-fees.html)を設定することができます。発行者は、自分のトークンを含む取引レートの[ティックサイズ](decentralized-exchange/ticksize.md)を定義することもできます。発行者と一般アカウントのどちらも、トラストラインを[凍結](fungible-tokens/freezes.md)することができ、トラストライン内のトークンの使用方法を制限することができます。( XRPにはこのいずれも適用されません。)

トークン発行の技術的な手順については、[代替可能トークンの発行](../../tutorials/how-tos/use-tokens/issue-a-fungible-token.md) をご覧ください。

## 関連項目

- **コンセプト:**
  - [XRP?](../../introduction/what-is-xrp.md)
  - [クロスカレンシー支払い](../payment-types/cross-currency-payments.md)
  - [分散型取引所](decentralized-exchange/index.md)
- **チュートリアル:**
  - [代替可能トークンの発行](../../tutorials/how-tos/use-tokens/issue-a-fungible-token.md)
  - [XRP Ledgerゲートウェイの開設](../../use-cases/tokenization/stablecoin-issuer.md)
  - [トランザクションの結果の確認](../transactions/finality-of-results/look-up-transaction-results.md)
  - [専門化した支払いタイプの使用](../../tutorials/how-tos/use-specialized-payment-types/index.md)
- **リファレンス:**
  - [Paymentトランザクション][]
  - [TrustSetトランザクション][]
  - [RippleStateオブジェクト](../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md)
  - [account_linesメソッド][]
  - [account_currenciesメソッド][]
  - [gateway_balancesメソッド][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
