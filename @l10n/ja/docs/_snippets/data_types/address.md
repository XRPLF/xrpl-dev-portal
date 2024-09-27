XRP Ledgerのアカウントは、XRP Ledgerの[base58][]フォーマットのアドレスで識別されます。このアドレスはアカウントのマスター[公開鍵](https://en.wikipedia.org/wiki/Public-key_cryptography)から生成され、マスター公開鍵は秘密鍵から生成されます。アドレスはJSON文字列で記述され、以下の特徴があります。

* 長さは25から35文字
* 文字`r`から始まる
* 数字"`0`"、大文字"`O`"、大文字"`I`"、小文字"`l`"を除く英数字
* 大文字と小文字を区別
* 4バイトのチェックサムが含まれており、ランダムな文字から有効なアドレスが生成される確率はおよそ2<sup>32</sup>分の1

{% admonition type="info" name="注記" %}
[宛先タグ](../../concepts/transactions/source-and-destination-tags.md)をアドレスに「組み込む」**X**アドレス形式もあります。これらのアドレスは`X`（メインネット用）または`T`（[テストネットワーク](../../concepts/networks-and-servers/parallel-networks.md)用）で始まります。取引所とウォレットは、顧客が知る必要のあるすべてのデータを1つの値で表すためにXアドレスを使用できます。詳細については、[Xアドレスフォーマットサイト](https://xrpaddress.info/)と[コーデック](https://github.com/xrp-community/xrpl-tagged-address-codec)をご覧ください

XRP Ledgerプロトコルは「クラシック」アドレスのみをネイティブにサポートしていますが、多くの[クライアントライブラリ](../../references/client-libraries.md)はXアドレスもサポートしています。
{% /admonition %}
