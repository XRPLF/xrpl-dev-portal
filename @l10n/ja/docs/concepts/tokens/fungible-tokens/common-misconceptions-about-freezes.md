---
parent: freezes.html
html: common-misconceptions-about-freezes.html
seo:
    description: XRP Ledgerのフリーズ機能について、よくある誤解を解いていきます。
labels:
  - トークン
---
# トークンの凍結に関するよくある誤解

PayPalのような中央集権的なサービスがアカウントを停止して資金にアクセスできないようにするのと同様に、Ripple社などがXRPを凍結することができるというのはよくある誤解です。XRP Ledgerには[凍結機能](freezes.md)がありますが、これは発行トークンにのみ使用可能で、XRPには使用できません。 **XRPを凍結することは誰にもできません**。

XRP Ledgerのトークンは、[XRPとは根本的に異なる](../../../references/protocol/data-types/currency-formats.md#comparison)ものです。トークンは常にトラストライン上に存在し、それは凍結される可能性があります。XRPはアカウントに含まれており、凍結されることはありません。

## XRPは単なるRipple社のトークンではないのか？

いいえ、XRPはトークンとは異なります。XRPはXRP Ledger上の唯一のネイティブアセットであり、XRP Ledger上で取引を行うために必要なものです。XRPにはカウンタパーティが存在しません。つまり、誰かがXRPを保有するとき、その人は負債を保有しているのではなく、実際の通貨であるXRPを保有しているのです。この事実により、 _**<u>XRPはいかなる団体や個人によっても凍結することができません</u>**_ 。

## Ripple社またはXRP Ledger財団は私のトークンを凍結することができますか？

XRP Ledgerは分散型であり、Ripple社やXRP Ledger財団、そして他のいかなる存在もそれをコントロールすることはできません。

あるトークンの発行者は、 _そのトークンに限定して_ あなたのトラストラインを凍結することができます。あなたのアカウントの他の部分や、異なる発行者のトークンを凍結することはできませんし、あなたがXRP Ledgerを使うのを止めることもできないのです。

さらに、トークン発行者は、トークンを凍結する能力を自主的かつ永久的に放棄することができます。この["No Freeze"](freezes.md#no-freeze)設定は、他者がトークンの使用を止めることができないという意味で、トークンがより実際の現金のように振る舞うことを想定しています。


## しかし、Ripple社がJed McCaleb氏のXRPを凍結したと聞きましたが？

これは、2015年から2016年にかけて実際に起こった事件の誤報です。2013年にRipple社の創業者で同社を退社したJed McCaleb氏は、100万USドル以上のXRPをカストディ取引所であるBitstampで売却しようと試みました。Ripple社の代理人は、この売却はJed氏とRipple社が2014年に締結した契約に違反すると主張しました。Ripple社の要求により、[BitstampはJedのBitstampアカウントを凍結](https://www.coindesk.com/markets/2015/04/02/1-million-legal-fight-ensnares-ripple-bitstamp-and-jed-mccaleb/)し、裁判に持ち込まれました。この裁判は[最終的に和解](https://www.coindesk.com/markets/2016/02/12/ripple-settles-1-million-lawsuit-with-former-executive-and-founder/)となり、双方がその結果に納得したと表明しています。

注目すべきは、この「凍結」はXRP Ledger上で起こったものではなく、XRP Ledgerの凍結機能を使ったものでもないことです。他のカストディアン取引所と同様に、Bitstampはユーザのアカウントを凍結し、特にそれらの資金が法的紛争に巻き込まれている場合、取引や資金の引き出しを停止する権限を持っています。

一方、XRP Ledgerの[分散型取引所](../decentralized-exchange/index.md)で取引する場合は、自分で資産を管理するので、XRPの取引を止めることは誰にもできないのです。
