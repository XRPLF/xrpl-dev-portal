# Checks

_（[Checks Amendment][]が必要です :not_enabled:）_

XRP LedgerのChecks機能を使用すると、指定の受取人による取消または換金が可能な後払いの支払いを生成することができます。個人用の紙の小切手と同様に、XRP Ledger Checksでは最初に資金の送金元が金額と受取人を指定するCheckを作成します。受取人はCheckを換金して、送金元のアカウントから受取人のアカウントに資金を移動します。受取人がCheckを換金するまでは、実際の資金移動は発生しません。Checkの作成時には資金は保留されていないことから、受取人が換金する時点で送金元に十分な資金がない場合、従来の小切手同様に換金が失敗します。Checkを換金できなかった場合、送信者はCheckが有効期限切れになるまで再試行できます。

XRP Ledger Checksには有効期限があり、この期限を過ぎると換金できなくなります。受取人が有効期限までにCheckを換金できなかった場合、Checkオブジェクトは誰かに取り消されるまでXRP Ledgerに残ります。有効期限切れになったCheckは誰でも取り消すことができます。有効期限前、あるいはChecksが換金されるまでは、送金元と受取人のみがCheckを取り消すことができます。Checkオブジェクトは、送金元がそのCheckを換金できた時点または誰かが取り消した時点でLedgerから削除されます。

Checksは[Escrow](escrow.html)と[Payment Channel](use-payment-channels.html)に似ていますが、Checksとこれらの機能の間には重要な相違がいくつかあります。

* Checksでは発行済み通貨を送金できます。Payment ChannelとEscrowで送金できるのはXRPのみです。

* Checksは資金を凍結しません。Payment ChannelとEscrowでは、送金元が発行したクレームでXRPが清算されるか（Payment Channel）、または有効期限切れまたはCrypto-conditionsによってXRPがリリースされる（Escrow）までは、そのXRPを使用できません。

* EscrowではXRPを自分自身に送金できます。ChecksとPayment Channelを使用してXRP（Checksの場合は発行済み通貨）を自身に送金することはできません。


**注記:** [Checks Amendment][]:not_enabled: により、[OfferCreate][]トランザクションの有効期限が変更されます。詳細は[オファーの有効期限](offers.html#オファーの有効期限)を参照してください。


## Checksを利用する理由

従来の紙の小切手では、実際の通貨を即座にやり取りすることなく残高を送金できます。XRP Ledger Checksを使用すると、銀行業界でよく利用され受け入れられている方法で資金を非同期にやり取りすることができます。

XRP Ledger Checksは、XRP Ledgerに固有の問題も解決できます。たとえば、ユーザーが不審な支払いを拒否したり、支払いの一部のみを受領することを可能にします。これは、コンプライアンス上の理由から支払いの受け入れに慎重に対応する必要がある機関にとっては有用です。

Checksはその他のさまざまな用途に利用できる可能性があります。RippleはコミュニティにてChecksの新しく創造的な用途が探られていくことを推奨しています。


### ユースケース: 支払いの承認

**課題:** [BSA、KYC、AML、CFT](become-an-xrp-ledger-gateway.html#gateway-compliance)などの規制に準拠するにあたり、金融機関は受領する資金の送金元に関する文書を提出する必要があります。違法な資金移動を防止するため、これらの規制は金融機関に対して、処理済のすべての支払いについて、その送金元と送金先を開示するよう義務付けています。XRP Ledgerの性質上、誰でもXRPを（および該当する場合には発行済み通貨を）XRP Ledger上の金融機関のアカウントに送金することができます。金融機関のコンプライアンス部門では、このような不審な支払いへの対応にかかるコスト（罰金の可能性を含む）の増大と処理の遅れが生じます。

**解決策:** 金融機関は各自のXRP Ledgerのアカウントで、[`AccountSet`トランザクションの`asfDepositAuth`フラグを設定](accountset.html)することにより、[Deposit Authorization](depositauth.html)を有効にできます。これにより、アカウントはPaymentトランザクションを受領できなくなります。Deposit Authorizationが有効なアカウントは、Escrow、Payment Channel、またはChecksでのみ資金を受領できます。Deposit Authorizationが有効な場合、Checksが最もシンプルで使いやすく、柔軟な資金移動手段となります。


## 使用法

Checksの一般的なライフサイクルを以下で説明します。

<!--{# Diagram source: https://docs.google.com/drawings/d/1Ez8OZVB2TLH-b_kSFOAgfYqXlEQt4KaUBW6F3TJAv_Q/edit #}-->

[![Checkのフローチャート（換金に成功した場合）](img/checks-happy-path.ja.png)](img/checks-happy-path.ja.png)

**ステップ1:** Checkを作成するため、送金元が[CheckCreate][]トランザクションを送信し、受取人（`Destination`）、有効期限（`Expiration`）、および送金元アカウントからの引き落とし限度額（`SendMax`）を指定します。


**ステップ2:** CheckCreateトランザクションの処理が完了すると、XRP Ledgerに[Checkオブジェクト](check.html)が作成されます。このオブジェクトには、オブジェクトを作成したトランザクションにより定義されたCheckのプロパティーが含まれています。有効期限前にこのオブジェクトを変更できるのは、送金元（[CheckCancel][]トランザクションで取り消す）と受取人（取り消すかまたは換金する）だけです。有効期限の経過後は、誰でもCheckを取り消すことができます。

**ステップ3:** Checkを換金するため、受取人が[CheckCash][]トランザクションを送信します。受取人には次の2つのCheck換金オプションがあります。

* `Amount` — 受取人はこのオプションを使用して換金する正確な額を指定できます。これは、送金元が想定される[送金手数料](transfer-fees.html)をCheckの額に上乗せし、受取人は請求書やその他の契約に記載されている指定された額のみ受け取れるようにする場合に役立ちます。

* `DeliverMin` — 受取人はこのオプションを使用してCheckから受領する最小額を指定できます。受取人がこのオプションを使用する場合、`rippled`は可能な限り多くの送金を試み、少なくともこの額以上を送金します。受取人に入金できる額がこの額よりも少ない場合には、このトランザクションは失敗します。

送金元にCheckの裏付けとなる資金が十分あり、有効期限が経過してなければ、資金は送金元のアカウントから引き落とされ、受取人のアカウントに入金され、Checkオブジェクトは消却されます。



#### 有効期限切れの例

Checksが有効期限切れになった場合のライフサイクルを以下で説明します。

<!--{# Diagram source: https://docs.google.com/drawings/d/11auqa0kVUPonqlc_RaQUfHcSkUI47xneSKpwlLxzSK0/edit #}-->

[![Checkのフローチャート（有効期限切れ）](img/checks-expiration.ja.png)](img/checks-expiration.ja.png)


Checksはすべて同じ方法で開始されるため、**ステップ1と2**は換金の例と同じです。

**ステップ3a:** 受取人が換金する前にCheckが有効期限切れになると、そのCheckは換金できなくなりますが、レジャーに残ります。

**ステップ4a:** 有効期限切れになったCheckは、[CheckCancel][]トランザクションを送信することで誰でも取り消すことができます。このトランザクションによりレジャーからCheckが削除されます。  



## Checksの利用可能性

Checksを使用するには`rippled` v0.90.0以降が必要です。2018年10月11日の時点では、Checks Amendmentは本番環境のXRP Ledgerで有効になっていません。すべての既知のAmendmentの最新状況については、[既知のAmendment](known-amendments.html)を参照してください。Amendmentを有効化し、Amendmentに投票する方法については、[Amendmentプロセス](amendments.html#amendmentプロセス)を参照してください。

Test NetまたはプライベートXRP LedgerネットワークでのAmendmentの状況を確認するには、[featureメソッド][]を使用してください。


## 参考情報

XRP LedgerのChecksの詳細は、以下を参照してください。

- [トランザクションのリファレンス](transaction-types.html)
    - [CheckCreate][]
    - [CheckCash][]
    - [CheckCancel][]
- [Checksのチュートリアル](use-checks.html)
    - [Checkの送信](send-a-check.html)
    - [送金元アドレスに基づくChecksの検索](look-up-checks-by-sender.html)
    - [受取人アドレスに基づくChecksの検索](look-up-checks-by-recipient.html)
    - [Checkの指定された金額での換金](cash-a-check-for-an-exact-amount.html)
    - [Checkの変動金額での換金](cash-a-check-for-a-flexible-amount.html)
    - [Checkの取消し](cancel-a-check.html)
- [Checks Amendment][]

関連機能の詳細については、以下を参照してください。

* [Deposit Authorization](depositauth.html)
* [Escrow](escrow.html)
* [Payment Channelチュートリアル](use-payment-channels.html)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
