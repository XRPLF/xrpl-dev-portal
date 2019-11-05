# XRP

**XRP**は、XRP Ledgerのネイティブ暗号資産です。XRP Ledgerのすべての[アカウント](accounts.html)間で相互にXRPを送金できます。アカウントは、最小限度額のXRPを[準備金](reserves.html)として保有する必要があります。XRP Ledgerアドレス間にてXRPの直接送金が可能で、ゲートウェイや流動性プロバイダーを必要としません。このため、XRPは便利なブリッジ通貨となりました。

XRP Ledgerの高度機能の一部（[Escrow](escrow.html)や[Payment Channel](use-payment-channels.html)など）は、XRPでのみ使えます。オーダーブックの[オートブリッジング](https://ripple.com/dev-blog/introducing-offer-autobridging/)は、XRPを使用して、2つの発行済み通貨のオーダーブックをXRPオーダーブックにマージして、合成された一つのオーダーブックを作成することで、分散型取引所の流動性を高めます。（たとえば、オートブリッジングによりUSD:XRPオーダーとXRP:EURオーダーがマッチングされ、USD:EURオーダーブックとなります。）

XRPはまた、ネットワークのスパムの防御対策としても機能します。すべてのXRP Ledgerアドレスには、XRP Ledger維持管理コストを支払うために少額のXRPが必要です。[トランザクションコスト](transaction-cost.html)と[準備金](reserves.html)は、XRP建ての中立的な手数料であり、どの当事者にも支払われません。レジャーのデータフォーマットで、XRPは[AccountRootオブジェクト](accountroot.html)に保管されます。

XRPのユースケース、メリット、最新情報についての詳細は、[XRPポータル](https://ripple.com/xrp-portal/)を参照してください。

## XRPの特性

一番最初のレジャーにて1000億XRPが発行され、これ以上新しいXRPは作成できません。XRPは、[トランザクションコスト](transaction-cost.html)によって消却されるか、またはキーの所有者がいないアドレスに送金すると失われることがあります。このため、XRPは本質的にはやや[デフレ通貨](https://en.wikipedia.org/wiki/Deflation)です。XRPがなくなることを心配する必要はありません。現時点の消却のペースでは、すべてのXRPが消却されるまでに約7万年かかります。またXRPの総供給量の変化に伴い、XRPの[価格と手数料が調整される可能性があります](fee-voting.html)。

技術的には、XRPは0.000001 XRPの単位まで正確に計算され、「Drop」と呼ばれます。[`rippled`API](rippled-api.html)では、XRPの量は常にXRPのdrop単位で指定する必要があります。たとえば1 XRPは`1000000` dropと表されます。詳細については、[通貨フォーマットのリファレンス](currency-formats.html)を参照してください。
