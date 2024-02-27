---
html: transfer-fees.html
parent: tokens.html
seo:
    description: トークンの発行者は、自己のトークンの送金に手数料を課すことができます。
labels:
  - 手数料
  - トークン
---
# 送金手数料

[トークン](index.md)の発行者は、`TransferRate`の設定を使用して、ユーザに対し _送金手数料_ を請求できます。この送金の送金元からは送金手数料に基づく割合で引き落とされ、送金先へ入金されます。差額が送金手数料となります。

標準的なトークンの場合、送金手数料として支払われたトークンはバーンされ、XRP Ledgerでは記録されなくなります。トークンがレジャー外の資産で裏付けされている場合、これは発行者がXRP Ledgerでの債務を果たすために準備金として保有しなければならないそれらの資産の量を減らします。送金手数料は通常、外部資産で裏付けられていないトークンには適切ではありません。

非代替性トークンにも送金手数料がかかりますが、その仕組みは異なります。詳細は[非代替性トークン](nfts/index.md)をご覧ください。

送金手数料は、発行アカウントと直接送受信する場合には適用されませんが、[運用アドレス](../accounts/account-types.md)から他のユーザへ送金する場合には適用されます。

XRPは発行者が存在しないため、送金手数料がかかることはありません。

## 例

この例では、ACME銀行はXRP Ledger上でEURステーブルコインを発行します。ACME Bankは送金手数料を1%に設定するかもしれません。支払いの受取人が2 EUR.ACMEを得るためには、送金者は2.02 EUR.ACMEを送らなければなりません。トランザクションの後、XRP LedgerにおけるACMEの未払い債務は0.02ユーロ減少し、ACMEはEURステーブルコインの裏付けとなる銀行口座にその金額を保持する必要がなくなります。

以下の図は、AliceからCharlieへの2EUR.ACMEのXRP Ledger支払いを、送金手数料1%で表しています。

[{% inline-svg file="/docs/img/transfer-fees.ja.svg" /%}](/docs/img/transfer-fees.ja.svg "Aliceが2,02€を送金し、Charlieが2,00€を受け取り、ACMEはXRP Ledgerで0,02€を受け取ります。")

会計用語では、Alice、ACME、Charlieの貸借対照表はこのように変わっているでしょう。

[{% inline-svg file="/docs/img/transfer-fees-balance-sheets.ja.svg" /%}](/docs/img/transfer-fees-balance-sheets.ja.svg "Aliceの資産は2,02€減少、Charlieは2,00€増加、ACMEの負債は0,02€減少。")



## ペイメントパスでの送金手数料

<!--{# TODO: Update this for OnwerPaysFee amendment when that gets added #}-->

送金手数料は、各送金においてイシュアンスが発行アカウントを通じて当事者間を移動するたびに適用されます。さらに複雑なトランザクションでは、手数料が複数回適用されます。送金手数料は、送金の終わりの時点から逆方向に適用されるので、最終的には支払いの送金者がすべての手数料をカバーするのに十分な額を送金する必要があります。例:

[{% inline-svg file="/docs/img/transfer-fees-in-paths.ja.svg" /%}](/docs/img/transfer-fees-in-paths.ja.svg "手数料が適用されたクロスカレンシー支払いの図")

このシナリオでは、ACMEが発行したEURをSalazar（送金元）が保有しており、WayGateが発行した100 USDをRosa（受取人）に送金したいと思っています。FXMakerはオーダーブックで最も良いレート（1 USD.WayGate = 0.9 EUR.ACME）のオファーを提供する通貨取引業者です。もし手数料がなければ、Salazarは90 EURを送金すればRosaに100 USDを送金することができます。しかしながら、ACMEで1%の送金手数料が発生し、WayGateで0.2%の送金手数料が発生します。つまり、次のようになります。

* Rosaが100 USD.WayGateを受領するには、FXMakerから100.20 USD.WayGateを送金する必要があります。
* 100.20 USD.WayGateを送金する場合のFXMakerの現在の買値は90.18 EUR.ACMEです。
* FXMakerが90.18 EUR.ACMEを受領するには、Salazarが91.0818 EUR.ACMEを送金する必要があります。



# 技術詳細

送金手数料は発行アドレスの設定により表されます。送金手数料には、0%未満の値と100%を超える値は指定できず、0.0000001%の位までで切り捨てられます。TransferRate設定は同一アカウントにより発行されるすべての通貨に適用されます。通貨によって異なる送金手数料のパーセンテージを適用するには、通貨ごとに異なる発行アドレスを使用します。

送金手数料は`TransferRate`フィールドで指定します。このフィールドは受信者が同じトークンを10億単位で取得するために送金しなければならない金額を表す整数です。`TransferRate`が`1005000000`の場合、送金手数料は0.5%に相当します。デフォルトでは`TransferRate`は0%に設定されています。`TransferRate`の値を`1000000000`未満（"0%"未満の手数料）または`2000000000`以上（”100%”超の手数料）に設定することはできません。値`0`は手数料無料の特別な場合で、`1000000000`と同じです。

トークン発行者は、[AccountSetトランザクション][]を送信することで、発行するトークンすべての`TransferRate`を変更することができます。

アカウントの`TransferRate`は[account_infoメソッド][]で誰でも確認できます。もし`TransferRate`が省略されていれば、手数料は無料です。

**注記:** `rippled`v0.80.0で導入され2017-11-14に有効となった[fix1201 Amendment](../networks-and-servers/amendments.md)により、最大送金手数料は実効限度である約329%（32ビット整数の最大サイズに基づく）から100%に引き下げられました。送金手数料の設定が100%（`TransferRate`が`2000000000`）を上回るアカウントがレジャーにまだ含まれている可能性があります。すでに設定されている手数料はすべて、規定のレートで引き続き運用されます。

## クライアントライブラリのサポート

いくつかの[クライアントライブラリ](../../references/client-libraries.md)は`TransferRate`を取得・設定するための便利な関数を持っています。

**JavaScript:** `xrpl.percentToTransferRate()`を使うと、文字列からパーセンテージの送金手数料を対応する`TransferRate`値に変換することができます。

## 関連項目

- **コンセプト:**
  - [手数料（曖昧さの回避）](../transactions/fees.md)
  - [トランザクションコスト](../transactions/transaction-cost.md)
  - [パス](fungible-tokens/paths.md)
- **リファレンス:**
  - [account_linesメソッド][]
  - [account_infoメソッド][]
  - [AccountSetトランザクション][]
  - [AccountRootのフラグ](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountrootのフラグ)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
