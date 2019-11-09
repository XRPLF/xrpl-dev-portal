# 取引所としてのXRPの上場

本書では、取引所がXRPを上場するために必要なステップを説明します。

## Alpha Exchange

本書での説明目的で、架空の企業である _Alpha Exchange_ を使用して、XRPを上場するために必要な手順の概要を説明します。本書では、Alpha Exchangeは以下のような取引所です。

* 現在BTC/USDの上場を専門としています

* BTC/XRPとXRP/USDの取引ペアの追加を希望しています

* すべての顧客の残高を保持しています

* サポートしている各通貨の残高を保持しています

### ユーザーの利益

Alpha Exchangeは、BTC/XRPおよびXRP/USDの取引ペアを上場することを希望しています。理由の1つとして、これらのペアがユーザーにとって有用なものであることが挙げられます。特に、このサポートによりユーザーは以下ができるようになります。

* XRP Ledger _から_ Alpha Exchange _に_ XRPを入金できます

* Alpha Exchange _から_ XRP Ledger _に_ XRPを送金できます

* XRPをBTCやUSDなどの他の通貨と交換できます

## XRPをサポートするための前提条件

XRPをサポートするために、Alpha Exchangeでは以下を行う必要があります。

* 新しい[アカウント](#アカウント)を作成して維持します

* [バランスシート](#バランスシート)を作成して維持します

関連項目:

* [ゲートウェイコンプライアンス](become-an-xrp-ledger-gateway.html#gateway-compliance) — ゲートウェイと取引所は異なりますが、取引所は地域の規制に準拠し、適切な当局の監督下になければなりません。

* [Requirements for Sending to XRP Ledger](become-an-xrp-ledger-gateway.html#requirements-for-sending-to-xrp-ledger)

* [Requirements for Receiving from XRP Ledger](become-an-xrp-ledger-gateway.html#requirements-for-receiving-from-xrp-ledger)

* [ゲートウェイの注意事項](become-an-xrp-ledger-gateway.html#precautions)

### Partial Payments

追加の前に、取引所は[Partial Payments](partial-payments.html)機能について知っておく必要があります。この機能を使用すると、XRP Ledgerのユーザーは、`SendMax`を増やさずに、受取金額を減額して、支払いを正常に送信できます。この機能は、送信者側に追加費用が発生せず、[支払いの返金](become-an-xrp-ledger-gateway.html#bouncing-payments)に便利です。

#### Partial Paymentsに関する警告

[tfPartialPaymentフラグ](payment.html#paymentのフラグ)が有効にされると、`Amount`フィールド **_は受取り金額とは同じでなくなることがあります_** 。支払いのメタデータにある`delivered_amount`フィールドは、宛先アカウントが実際に受け取る通貨の金額を示しています。支払いを受信するときに、Amountフィールドの代わりに、`delivered_amount`を使用してアカウントで受信した金額を判断します。

**警告:** この機能が悪用されることがあります。詳細については、[Partial Payments](partial-payments.html)を参照してください。

### アカウント

XRPは、XRP Ledgerの _アカウント_ （ _ウォレット_ や _アドレス_ とも呼ばれる）で保持されます。XRP Ledgerのアカウントは、例えばBitcoinのような、アカウントに経費がほとんどまたは一切かからない他のブロックチェーンの台帳とは異なります。XRP Ledgerでは、アカウントは[決して削除できず](accounts.html#アカウントの永続性)、各アカウントは個別の、他の人に送信することのできない、[XRPの準備金](reserves.html)を保持する必要があります。このような理由から、Rippleでは利用機関に対し、必要のない過剰なアカウントを作成しないように勧めています。

<!-- STYLE_OVERRIDE: hot wallet, warm wallet, cold wallet, wallet -->

Rippleが推奨するベストプラクティスに従い、Alpha Exchangeは、XRP Ledgerに最低2つのアカウントを作成する必要があります。シークレットキーが悪用された場合の危険を最小限にとどめるため、Rippleでは、[ _コールドアカウント_ 、 _ホットアカウント_ 、 _ウォームアカウント_ ](https://ripple.com/build/issuing-operational-addresses/)（それぞれコールドウォレット、ホットウォレット、ウォームウォレットとも呼ばれる）の作成をお勧めしています。コールド/ホット/ウォームのモデルは、セキュリティと利便性のバランスをとるためのものです。XRPを上場する取引所は、以下のアカウントを作成する必要があります。

* 大部分のXRPと顧客の資金を維持する[ _コールドウォレット_ ](issuing-and-operational-addresses.html#発行アドレス)。取引所にとって、これはユーザーが[預入れ](#取引所へのxrpの入金)をするアドレスです。   セキュリティを最適化するため、このアカウントのシークレットキーはオフラインにする必要があります。

    取引所のコールドウォレットが悪用されると、以下のような結果が生じるおそれがあります。

    * 不正使用者が、コールドウォレットの全XRPにアクセスできます。

    * マスターキーが悪用されると、不正使用者は（マスターキーを無効にし、新しいレギュラーキーや署名者リストを設定することにより）そのコールドウォレットを恒久的に制御できます。これにより、その不正使用者は今後そのコールドウォレットで受信するすべてのXRPも制御できるようになります。

        * このような事態が発生した場合には、取引所は新しいコールドウォレットアドレスを作成し、顧客にその新しいアドレスを伝える必要があります。

    * レギュラーキーや署名者リストが悪用された場合には、取引所はコールドウォレットの制御を取り戻すことができます。ただし、不正使用者の行為の中には、以下のように簡単に元に戻せないものもあります。 <!-- STYLE_OVERRIDE: easily -->

        * 不正使用者が、コールドウォレットを使用してXRP Ledgerで通貨を発行しても、その通貨の価値はだれにも認められません。（取引所が明示的にゲートウェイでもあると示した場合を除きます）。

        * 不正使用者が、アカウントにasfRequireAuthフラグを設定した場合。この設定は解除できません。ただし、これは通貨の発行のみに関係し、ゲートウェイではない取引所には影響しません。不正使用者がマスターキーで設定または設定解除したその他の設定は、元に戻すことができます。

* 顧客のXRP出金や入金を管理する、日常業務を遂行するための1つ以上の[ _ホットウォレット_ ](issuing-and-operational-addresses.html#運用アドレス)。例えば、ホットウォレットがあれば、取引所はこの種のXRPの自動送金を安全にサポートできます。出金要求にただちに応じるため、ホットウォレットはオンラインである必要があります。

    不正使用されたホットウォレットによって発生するおそれのある結果についての詳細は、[Operational Account Compromise](issuing-and-operational-addresses.html#運用アドレスの漏えい)を参照してください。

* オプションとして、コールドウォレットとホットウォレットの間で追加のセキュリティ層を提供する、1つ以上のウォームウォレット。ホットウォレットとは異なり、ウォームウォレットのシークレットキーはオンラインである必要はありません。さらに、ウォームウォレットのシークレットキーを複数の人に分散し、[マルチ署名](multi-signing.html)を導入してセキュリティを強化することもできます。

    不正使用されたウォームウォレットによって発生するおそれのある結果についての詳細は、[スタンバイアドレスの漏えい](issuing-and-operational-addresses.html#スタンバイアドレスの漏えい)を参照してください。


関連項目:

* ["Suggested Business Practices" in the _Gateway Guide_](become-an-xrp-ledger-gateway.html#suggested-business-practices)

* [発行アドレスと運用アドレス](issuing-and-operational-addresses.html)

* [アカウントの作成](accounts.html#アカウントの作成)

* [準備金](reserves.html)

### バランスシート

顧客のXRPを管理するため、Alpha Exchangeは各顧客のXRP残高と自身の保有残高を追跡する必要があります。このためには、Alpha Exchangeは別のバランスシートまたは会計システムを作成し、維持する必要があります。以下の表は、このバランスシートを説明するものです。

新しいXRP Ledgerアカウント（ _Alpha Hot_ 、 _Alpha Warm_ 、 _Alpha Cold_ ）が、「*XRP LedgerのXRP残高*」表の*ユーザー*列に示されています。

「*Alpha ExchangeのXRP残高*」表は、新しい追加のバランスシートを表します。Alpha Exchangeのソフトウェアは、この会計システムでユーザーのXRP残高を管理します。


<table>
  <tr>
    <td><b><i>XRP Ledgerの
XRP残高</i></b></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange
のXRP残高</i></b></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><b>ユーザー</b></td>
    <td><b>残高</b></td>
    <td></td>
    <td><b>アカウント番号</b></td>
    <td><b>ユーザー</b></td>
    <td><b>残高</b></td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Charlie</td>
    <td>50,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td>0</td>
  </tr>
  <tr>
    <td><i>Alpha Hot</i></td>
    <td>0</td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Warm</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Cold</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>

#### XRPの額

XRPの額は、XRP Ledgerで、符号なし整数の _drop_ として示されます。1XRPは1,000,000 dropです。Rippleでは、ソフトウェアでXRP残高をdropの整数値として格納し、これらの数値に整数演算を実行することをお勧めしています。ただし、ユーザーインターフェイスでは残高をXRPの単位で表示すべきです。

1drop（.000001XRP）はこれ以上分割できません。XRPと他の資産の間でFXレートを計算して表示するときには、この点にご注意ください。

詳細は、[通貨額の指定][]を参照してください。

#### 台帳上と台帳外

 _Alpha Exchange_ のような取引所では、XRPは「台帳上」または「台帳外」に存在します。

* **台帳上のXRP**: XRP保有者のパブリック[アドレス](accounts.html#アドレス)を指定し、パブリックのXRP Ledgerを通じて照会できるXRP。これらの残高の取引相手はXRP Ledgerです。詳細については、[XRP](xrp.html)を参照してください。

* **台帳外のXRP**: 取引所の会計システムに保持されている、取引所のインターフェイスで照会できるXRP。台帳外のXRP残高はクレジットペースです。取引相手は、XRPを保有している取引所です。

    台帳外のXRP残高は、取引所の参加者の間で取引されます。このような取引をサポートするため、取引所は取引で使用可能な、 _台帳外_ のXRP合計金額に等しい _台帳上_ のXRP残高を保持する必要があります。


## 資金の流れ

残りのセクションでは、ユーザーによる入金、取引、XRP残高の換金の過程で、Alpha Exchangeが管理するアカウントを通じて資金がどのように流れるのかを説明します。資金の流れを解説するため、本書では、[「バランスシート」セクション](#バランスシート)で使用した表を使用します。

取引所の一般的な資金の流れには、主要な4つステップが伴います。

1. [取引所へのXRPの入金](#取引所へのxrpの入金)

2. [XRPの保有高のリバランス](#xrpの保有高のリバランス)

3. [取引所からのXRPの出金](#取引所からのxrpの出金)

4. [取引所でのXRPの取引](#取引所でのxrpの取引)


このリストには、取引所の[前提条件](#xrpをサポートするための前提条件)が含まれていません。

この時点で、 _Alpha Exchange_ はXRP Ledgerの[ホットウォレット、ウォームウォレット、コールドウォレット](#アカウント)を作成し、それらをバランスシートに追加しましたが、ユーザーからの入金はまだ受け付けていません。


<table>
  <tr>
    <td><b><i>XRP Ledgerの
XRP残高</i></b></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange
のXRP残高</i></b></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><b>ユーザー</b></td>
    <td><b>残高</b></td>
    <td></td>
    <td><b>アカウント番号</b></td>
    <td><b>ユーザー</b></td>
    <td><b>残高</b></td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Charlie</td>
    <td>50,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td>0</td>
  </tr>
  <tr>
    <td><i>Alpha Hot</i></td>
    <td>0</td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Warm</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Cold</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>


### 取引所へのXRPの入金

[台帳外のXRP残高](#台帳上と台帳外)を追跡するには、取引所は新しい[バランスシート](#バランスシート)（または類似の会計システム）を作成する必要があります。以下の表は、ユーザーがXRPを入金するにつれ、Alpha Exchangeの新しいバランスシートで発生する残高の変化を示すものです。

CharlieというユーザーがAlpha Exchangeに50,000XRPを入金したいと希望しています。これには、以下のステップが伴います。

1. Charlieは50,000XRPの支払いを（[RippleAPI](rippleapi-reference.html)または類似のソフトウェアを使用して）、Alpha Exchangeの[コールドウォレット](#アカウント)に送信します。

    a. Charlieは識別子（このケースでは`789`）を支払いに追加し、Alpha Exchangeにある自身のアカウントに関連付けます。これは、[ _宛先タグ_ ](become-an-xrp-ledger-gateway.html#source-and-destination-tags)と呼ばれます。（これを使用するには、Alpha Exchangeは、すべての入金でCharlieのような宛先タグを必要とするように、すべてのアカウントでasfRequireDestフラグをオンに設定している必要があります。詳細については、[AccountSet Flags](accountset.html#accountsetのフラグ)を参照してください。）

2. Alpha Exchangeのソフトウェアは、受信される支払を検出し、`789`をチャーリーのアカウントの宛先タグとして認識します。

3. 受信される支払を検出すると、Alpha Exchangeのソフトウェアは、入金された50,000XRPがCharlieによって管理されるものであることを示すようにバランスシートを更新します。

    Charlieは、これで、取引所で最大50,000XRPまで使用できます。例えば、XRPをBTCやその他のAlpha Exchangeでサポートされている通貨と取引するオファー（注文）を作成できます。

<table>
  <tr>
    <td><b><i>XRP Ledgerの
XRP残高</i></b></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange
のXRP残高</i></b></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><b>ユーザー</b></td>
    <td><b>残高</b></td>
    <td></td>
    <td><b>アカウント番号</b></td>
    <td><b>ユーザー</b></td>
    <td><b>残高</b></td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Charlie</td>
    <td><s>100,000</s>
<br>50,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td><s>0</s>
<br>50,000</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Alpha Hot</td>
    <td>0</td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Alpha Warm</td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Alpha Cold</td>
    <td><s>0</s>
<br>50,000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>


### 取引所でのXRPの取引

Alpha Exchangeユーザー（Charlieなど）は、Alpha Exchangeでクレジットベースの残高を取引できます。Alpha Exchangeは、これらの取引の作成時に、新しいバランスシートでユーザーの残高を追跡する必要があります。これらの取引は、 _台帳外_ であり、XRP Ledgerから独立しています。このため、この残高の変化はXRP Ledgerには記録されません。

XRPを自身のXRP Ledgerアカウントに保有している顧客は、XRP Ledgerに組み込まれた分散型取引所 を使用して、ゲートウェイによって発行された通貨を取引することもできます。XRP Ledger _上_ での取引の詳細は、[オファーのライフサイクル](offers.html#オファーのライフサイクル)を参照してください。


### XRPの保有高のリバランス

取引所は、いつでもホットウォレットとコールドウォレットの間で残高を調整できます。各残高調整には、[トランザクションコスト](transaction-cost.html)がかかりますが、それ以外にはすべてのアカウントの合計残高に影響はありません。台帳上の合計残高は、取引所で取引に使用できる合計残高を常に上回る必要があります。（XRP Ledgerのトランザクションコストをカバーできるだけの十分な余剰が必要です。）

以下の表は、（XRP Ledgerで[Paymentトランザクション][]を介した）Alpha Exchangeのコールドウォレットとホットウォレットの間での80,000XRPの残高調整を示すものです。コールドウォレットから引き落としが行われ、ホットウォレットに入金が行われました。この支払いを逆にすると（ホットウォレットから引き落としが行われ、コールドウォレットに入金が行われる）、ホットウォレットの残高は減少します。このような残高調整は、取引所がオンラインホットウォレットにXRPを保持することに関連するリスクを抑えるために役立ちます。


<table>
  <tr>
    <td><b><i>Alpha Exchangeの
台帳外のXRP残高</i></b></td>
    <td></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchangeの台帳上のXRP残高</i></b></td>
    <td></td>
  </tr>
  <tr>
    <td><b>アカウント番号</b></td>
    <td><b>ユーザー</b></td>
    <td><b>残高</b></td>
    <td></td>
    <td><b>XRP Ledgerアカウント</b></td>
    <td><b>残高</b></td>
  </tr>
  <tr>
    <td>123</td>
    <td>Alice</td>
    <td>80,000</td>
    <td></td>
    <td>ホット</td>
    <td><s>0</s>
<br>80,000</td>
  </tr>
  <tr>
    <td>456</td>
    <td>Bob</td>
    <td>50,000</td>
    <td></td>
    <td>ウォーム</td>
    <td>0</td>
  </tr>
  <tr>
    <td>….</td>
    <td></td>
    <td></td>
    <td></td>
    <td>….</td>
    <td></td>
  </tr>
  <tr>
    <td>789</td>
    <td>Charlie</td>
    <td>50,000</td>
    <td></td>
    <td>コールド</td>
    <td><s>180,000</s>
<br>100,000</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td>...</td>
    <td></td>
  </tr>
</table>


### 取引所からのXRPの出金

出金により、取引所のユーザーは、取引所の台帳外バランスシートから、XRP LedgerのアカウントにXRPを移動できます。

この例では、Charlieは、Alpha Exchangeから25,000XRPを出金します。これには、以下のステップが伴います。

1. Charlieは、Alpha ExchangeのWebサイトでプロセスを開始します。彼は、25,000XRPをXRP Ledgerの特定のアカウント（以下の表では、「Charlie XRP Ledger」という名前）に送金する指示を出します。

2. Charlieの指示に対応し、Alpha Exchangeは以下の作業を実行します。

    A. その金額（25,000XRP）を台帳外バランスシートのCharlieのアカウントから引き出します。

    B. XRP Ledgerで、Alpha ExchangeのホットウォレットからCharlieのXRP Ledgerアカウントに同じ金額（25,000XRP）の支払いを送信します。


<table>
  <tr>
    <td><b><i>XRP Ledger台帳上のXRP残高</td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchangeの
台帳外のXRP残高</td>
    <td></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchangeの台帳上のXRP残高</td>
    <td></td>
  </tr>
  <tr>
    <td><b>ユーザー</td>
    <td><b>残高</td>
    <td></td>
    <td><b>アカウント番号</td>
    <td><b>ユーザー</td>
    <td><b>残高</td>
    <td></td>
    <td><b>XRP Ledgerアカウント</td>
    <td><b>残高</td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>80,000</td>
    <td></td>
    <td>ホット</td>
    <td><s>80,000</s>
<br>55,000</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>50,000</td>
    <td></td>
    <td>ウォーム</td>
    <td>0</td>
  </tr>
  <tr>
    <td>….</td>
    <td></td>
    <td></td>
    <td>….</td>
    <td></td>
    <td></td>
    <td></td>
    <td>….</td>
    <td></td>
  </tr>
  <tr>
    <td>CharlieのXRP Ledger</td>
    <td><s>50,000</s>
<br>75,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td><s>50,000</s>
<br>25,000</td>
    <td></td>
    <td>コールド</td>
    <td>100,000</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td>...</td>
    <td></td>
  </tr>
</table>


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
