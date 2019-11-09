# 送金手数料

[XRP Ledgerで通貨を発行する金融機関](become-an-xrp-ledger-gateway.html)は、XRP Ledgerの`TransferRate`設定を使用して、 その金融機関が発行する通貨を送金するユーザーに対し _送金手数料_ を請求できます。この送金の送金元からは送金手数料に基づくパーセンテージが引き落とされ、送金先には予定額が入金されます。差額が送金手数料です。送金手数料は発行アドレスの資産となり、XRP Ledgerではこれ以上追跡されません。発行アカウントとの _直接_ の送金と入金には送金手数料は適用されませんが、[運用アドレス][]から別のユーザーへの送金には送金手数料が適用されます。

[運用アドレス]: issuing-and-operational-addresses.html
[発行アドレス]: issuing-and-operational-addresses.html

XRPにはイシュアーがいないため、送金手数料が発生することはありません。

たとえばACME BankがACMEイシュアンスの送金手数料を0.5%に設定するとします。支払いの受取人が2 EUR.ACMEを受領するには、送金元が2.01 EUR.ACMEを送金する必要があります。このトランザクションの後、XRP LedgerのACMEの債務残高は0.01€減少します。つまり、ACMEはそのXRP Ledgerイシュアンスの担保となるアカウントで当該の額を保有する必要がありません。

次の図は、XRP LedgerによるAliceからCharlieへの2 EUR.ACMEの支払い（送金手数料1%）を示します。

![Aliceが2,02€を送金し、Charlieが2,00€を受領し、XRP LedgerでのACMEの負債が0,02€減少します](img/e2g-with_transferrate.ja.png)

## ペイメントパスでの送金手数料

<!--{# TODO: Update this for OnwerPaysFee amendment when that gets added #}-->

送金手数料は、各送金においてイシュアンスが発行アカウントを通じて当事者間を移動するたびに適用されます。さらに複雑なトランザクションでは、手数料が複数回適用されます。送金手数料は、送金の終わりの時点から逆方向に適用されるので、最終的には支払いの送金者がすべての手数料をカバーするのに十分な額を送金する必要があります。次に例を示します。

![手数料が適用された複数通貨間の支払いの図](img/transfer_fees_example.ja.png)

このシナリオでは、ACMEが発行したEURをSalazar（送金元）が保有しており、WayGateが発行した100 USDをRosa（受取人）に送金したいと思っています。FXMakerはオーダーブックで最も良いレート（1 USD.WayGate = 0.9 EUR.ACME）のオファーを提供する通貨取引業者です。もし手数料がなければ、Salazarは90 EURを送金すればRosaに100 USDを送金することができます。しかしながら、ACMEで1%の送金手数料が発生し、WayGateで0.2%の送金手数料が発生します。つまり、次のようになります。

* Rosaが100 USD.WayGateを受領するには、FXMakerから100.20 USD.WayGateを送金する必要があります。
* 100.20 USD.WayGateを送金する場合のFXMakerの現在の買値は90.18 EUR.ACMEです。
* FXMakerが90.18 EUR.ACMEを受領するには、Salazarが91.0818 EUR.ACMEを送金する必要があります。

# 技術詳細

送金手数料は[発行アドレス][]の設定により表されます。送金手数料には、0%未満の値と100%を超える値は指定できず、0.0000001%の位までで切り捨てられます。TransferRate設定は同一アカウントにより発行されるすべての通貨に適用されます。通貨によって異なる送金手数料のパーセンテージを適用するには、通貨ごとに異なる[発行アドレス][発行アドレス]を使用します。

**注記:**`rippled`v0.80.0で導入され2017-11-14に有効となった[fix1201 Amendment](amendments.html)により、最大送金手数料は実効限度である約329%（32ビット整数の最大サイズに基づく）から100%に引き下げられました。送金手数料の設定が100%（`TransferRate`が`2000000000`）を上回るアカウントがレジャーにまだ含まれている可能性があります。すでに設定されている手数料はすべて、規定のレートで引き続き運用されます。

## RippleAPI

RippleAPIでは、送金手数料は`transferRate`フィールドに10進数で指定され、この数は受取人が同一通貨を1単位受領できるよう送金する必要のある額を表します。`transferRate`が`1.005`の場合、送金手数料0.5%に相当します。デフォルトでは`transferRate`は手数料なしに設定されています。`transferRate`には、`1.0`未満の値と`2.0`を上回る値は指定できません。送金手数料は、10桁の有効数字に丸められます（1の位の数字を含む）。値`null`は手数料なしの特殊なケースであり、`1.0`に相当します。

金融機関は、[発行アドレス][]から[Settingsトランザクション](rippleapi-reference.html#settings)を送信して、イシュアンスの`transferRate`を変更することができます。

アカウントの`transferRate`を確認するには、[getSettingsメソッド](rippleapi-reference.html#getsettings)を使用します。

## rippled

`rippled`のJSON-RPC APIおよびWebSocket APIでは、送金手数料は`TransferRate`フィールドに10進数で指定され、この数字は受取人が同一通貨を10億単位受領できるよう送金する必要のある額を表します。`TransferRate`が`1005000000`の場合、送金手数料0.5%に相当します。デフォルトでは`TransferRate`は手数料なしに設定されています。`TransferRate`には、`1000000000`（手数料「0%」）未満の値と`2000000000`（手数料「100%」）を上回る値は指定できません。値`0`は手数料なしの特殊なケースであり、`1000000000`に相当します。

金融機関は、[発行アドレス][]から[AccountSetトランザクション][]を送信して、イシュアンスの`TransferRate`を変更することができます。

アカウントの`TransferRate`を確認するには、[account_infoメソッド][]を使用します。`TransferRate`が省略されている場合は、手数料はありません。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
