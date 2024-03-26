---
html: stablecoin-issuer.html
parent: tokenization.html
seo:
    description: XRP Ledgerの外にある同価値の資産に基づいて、ステーブルコインを発行することができます。
labels:
  - トークン
  - ステーブルコイン
---
# ステーブルコインの発行者

_金融の専門家として、私はステーブルコインを発行し、ステーブルコインの引き出しや送金に手数料を課すことで収入を得たいと考えています。_

ステーブルコインは、XRPL外の資産によって裏付けられたトークンです。ステーブルコインにより、ユーザは使い慣れた通貨で取引を行うことができ、資金をXRPLブロックチェーンに出し入れする便利な方法を提供します。

ステーブルコイン発行の仕組みは複雑ではありません。

1. ステーブルコインの名前を決めます(3文字のISO標準に従うか、160ビットの16進文字列を使用します。[通貨コード](../../references/protocol/data-types/currency-formats.md#通貨コード)をご覧ください)。
2. 発行アカウントと消費者のアカウントの間にトラストラインを作成し、送金するステーブルコインの最大数を設定します。
3. トラストラインの最大金額までのステーブルコインの支払いを消費者に送信します。

誰でもXRP Ledgerの任意の通貨コードでトークンを発行することができますが、ステーブルコインの価値は、対応する資産と交換できるという保証から生まれます。ステーブルコインの発行には、管轄区域によって異なる規制上の義務が伴う可能性があります。このような理由から、ステーブルコインの発行は、信頼できる事業者が成功する可能性が高いといえます。

[![ステーブルコインのワークフロー](/docs/img/uc-stablecoin-flow.png)](/docs/img/uc-stablecoin-flow.png)

新しいステーブルコインのリリース準備には、多くの決定事項や作成すべき成果物があります。XRPL財団の[自己評価アンケート](https://foundation.xrpl.org/wp-content/uploads/2022/03/self_assessment_questionnaire_140322.pdf)を出発点として、ローンチを成功させるために必要な情報を集め、作成することができます。

## ステーブルコインの種類を選択する

最初のステップは、作成したいステーブルコインの種類を決定することです。選択したステーブルコインの種類によっては、財務パートナーや監査パートナーとの署名など、追加のステップが必要になる場合があります。

![ステーブルコイン](/docs/img/uc-stablecoin-stable-coin.png)

XRPLで作成できる通貨トークンには、法定通貨担保、暗号資産担保、コモディティ担保、金融商品担保、非担保の5つの一般的なタイプがあります。[ステーブルコイン](../../concepts/tokens/fungible-tokens/stablecoins/index.md)をご覧ください。

## 自身のノードサービスを設定する

小規模なユースケースや個人であれば、無料のパブリックサーバを利用することができます。しかし、XRP Ledgerの利用が本格的になればなるほど、独自のインフラを持つことが重要になります。

独自のサーバを運用すべき理由はたくさんありますが、そのほとんどは、「自分のサーバが信頼できる」、「ワークロードをコントロールできる」、「いつ、どのようにアクセスするかを他人に依存しない」という点に集約されます。[独自サーバを運用する理由](../../concepts/networks-and-servers/index.md#独自サーバを運用する理由)をご覧ください。

または、OpenNodeのような外部のノードサービスプロバイダを使用することもできます。[OpenNode](https://www.opennodecloud.com)をご覧ください。

## サンドボックスへのアクセス

![サンドボックス](/docs/img/uc-stablecoin-sandbox.png)

テスト目的の場合、XRPL TestnetまたはDevnetサーバ上でステーブルコインを実装、デプロイ、取引することができます。XRP Faucetsページにアクセスし、テストネットワークの認証情報を生成してください。そのページに記載されているサーバURIを使用して、選択したテストネットワークに接続し、相互作用します。[XRP Faucets](/resources/dev-tools/xrp-faucets)をご覧ください。


## ステーブルコインの設定

新しいステーブルコインを発行する前に、最初にコインを発行すると変更不可能とする設定を行う必要があります。

[ステーブルコインの設定](../../concepts/tokens/fungible-tokens/stablecoins/settings.md)をご覧ください。

設定機能の詳細については[ステーブルコイン発行者の設定](../../concepts/tokens/fungible-tokens/stablecoins/configuration.md)をご覧ください。

## 資産の情報

潜在的なトレーダーがコインの安全性を確認できるように、あなたのステーブルコインに関する標準的な情報を公開してください。


### 資産の名称

通貨コードには3文字の文字列を選択してください。ISO4217では、非国家通貨コードは _X_ で始まります。[ISO 4217](https://ja.wikipedia.org/wiki/ISO_4217#X通貨)をご覧ください。

通貨コードは一意である必要はありません。例えば、ある国の法定通貨を担保とするステーブルコインを発行する場合、その通貨の公式コード、例えば _EUR_ を使用する方が良いでしょう。

### xrp-ledger.toml

自身のWebサイトで`xrp-ledger.toml`を公開することで、どの通貨を発行し、どのXRP Ledgerアドレスを管理しているかという情報を公開することで、偽者や混乱から守ることができます。この機械読み取り可能なフォーマットは、クライアントアプリケーションが処理するのに便利です。XRP Ledgerバリデータを実行する場合、同じファイルでキーを公開することもできます。

_Currencies_ テーブルを使って、あなたのステーブルコインに関する追加情報を提供することができます。これにより、あなたの暗号通貨に関する情報に、期待される場所と形式でアクセスできるようになり、透明性が高まります。[xrp-ledger.tomlファイル](../../references/xrp-ledger-toml.md#通貨)をご覧ください。


## アカウントと秘密鍵の管理

### マルチシグの方式

複数のキーと署名の重みを使用することで、発行者と資産保有者は、異なるユーザとシステム間で、アカウントのトランザクションを承認するための信頼と責任を分散することができます。これにより、内部プロセスやコントロールを使用して署名を管理する柔軟性が生まれます。

[マルチシグ](../../concepts/accounts/multi-signing.md)をご覧ください。

<!--
### Omnibus Wallets

For customers who prefer not to take custody of their own wallets, you can create an omnibus account with subaccounts, then assign these accounts to customers.

## Treasury Management

### Reconciliation

Periodically audit to verify that distributed stablecoins and stablecoins in escrow equal the total number of stablecoins.

### Checking Reserves

How to check reserves.

### Proof of Reserves

How to transparently report the current number of stablecoins held in reserve.
-->

## トークンの運用

### ステーブルコインの発行

ステーブルコインを発行するのは簡単です。実際には、ユーザが安心して取引できるステーブルコインを発行するには、多くの考慮事項があります。

ステーブルコインを発行する前に、[自己評価アンケート](https://foundation.xrpl.org/wp-content/uploads/2022/03/self_assessment_questionnaire_140322.pdf)の質問をダウンロードして読んでください。ステーブルコインを配布する準備ができたら、公開されている[トークン発行者自己評価アンケート](https://foundation.xrpl.org/token-assessment-framework/)に記入してください。これにより、あなたの新しいステーブルコインについてXRPLコミュニティに透明性を提供することができます。

その他の考慮事項については、こちらをご覧ください、

- [ステーブルコイン発行者 - 注意事項](../../concepts/tokens/fungible-tokens/stablecoins/precautions.md)
- [ステーブルコイン発行者 - コンプライアンス指針](../../concepts/tokens/fungible-tokens/stablecoins/compliance-guidelines.md)
- [代替可能トークンの発行](../../tutorials/how-tos/use-tokens/issue-a-fungible-token.md)

### トラストラインの作成

トラストラインは、トークンを保持するためのXRP Ledgerの仕組みです。トラストラインは、XRP Ledgerのルールである、他人が望んでいないトークンを保持することを禁止するものです。このような予防措置は、XRP Ledgerのユースケースであるコミュニティクレジットを可能にするために必要です。

各「トラストライン」は、次の要素から構成される双方向の関係です。

- トラストラインが接続する2つのアカウントの識別子。
- 一方のアカウントから見てプラス、他方のアカウントから見てマイナスの、単一の共有残高。
- 様々な設定とメタデータ。2つのアカウントはそれぞれ、トラストライン上の独自の設定を制御できます。それぞれがトラストラインの上限を設定します。

各トラストラインは、指定された通貨コードに対して固有のものです。2つのアカウントは、異なる通貨コードのトラストラインをいくつでも持つことができますが、特定の通貨コードの共有トラストラインは1つだけです。

[トラストライン](../../concepts/tokens/fungible-tokens/index.md#トラストライン)をご覧ください。

### 認可トラストライン

認可トラストライン機能は、発行者が特別に認可したアカウントでのみ保有できるトークンを作成することを可能にします。この機能はトークンにのみ適用され、XRPには適用されません。

認可トラストライン機能を使用するには、発行アカウントで`Require Auth`フラグを有効にします。この設定を有効にしている間、他のアカウントはあなたが発行したトークンを保持することができます。

[認可トラストライン](../../concepts/tokens/fungible-tokens/authorized-trust-lines.md)をご覧ください。


### トラストラインのFreeze

XRP Ledgerでトークンを発行する場合、_No Freeze_ 設定を有効にすることで、XRP Ledgerのトークン凍結機能を利用することを永久に停止することができます。(注意点として、これは発行されたトークンにのみ適用され、XRPには適用されません)。

_No Freeze_ 設定を有効にしない場合、アカウントが疑わしい動きを示したり、金融機関の利用規約に違反したりした場合、問題を解決する間、トラストラインを凍結する選択肢があります。

[トラストラインの凍結](../../concepts/tokens/fungible-tokens/freezes.md)をご覧ください。


### Global Freeze

不審な活動の兆候が見られた場合、アカウントをグローバルに凍結し、ユーザがトークンを相互に送信したり、分散型取引所でトークンを取引したりできないようにすることができます。

![Global Freeze](/docs/img/uc-stablecoin-global-freeze.png)

[Global Freezeの実行](../../tutorials/how-tos/use-tokens/enact-global-freeze.md)をご覧ください。


### Clawback

_([Clawback amendment][])_

Clawbackは、ステーブルコインの配布を開始する前に選択できるオプション設定です。規制上の目的から、発行者の中には発行されたトークンをアカウントに配布した後に回収する能力を持たなければならない場合があります。例えば、トークンが違法行為で制裁を受けたアカウントに送られたことが発覚した場合、発行者はその資金を回収することができます。

[Clawback](../../references/protocol/transactions/types/clawback.md)をご覧ください。

![Clawback](/docs/img/uc-stablecoin-clawback.png)

### 部分支払い

部分支払い(Partial Payment)に注意してください。partial paymentフラグが有効になっている支払いは、0でない金額が着金した場合、微々たる金額であっても"成功"とみなされます。
* トランザクションに`delivered_amount`フィールドがあるか確認してください。もし存在すれば、そのフィールドは`Destination`アドレスに実際にいくら着金したかを示します。
* xrpl.jsでは、[`xrpl.getBalanceChanges()`メソッド](https://js.xrpl.org/modules.html#getBalanceChanges)を使って、各アドレスがいくら受け取ったかを見ることができます。場合によっては、これを複数のトラストラインに分けることもできます。
* 
[Partial Payments](../../concepts/payment-types/partial-payments.md)をご覧ください。

### バーン

トークンの価値を管理する一つの方法は、トークンを破棄すること、つまりトークンを「バーン」することです。XRP Ledger上では、発行アドレスにトークンが送られると、代替可能なトークンは自動的に「バーン」されます。しかし、発行者は自由にトークンを増やすことができます。

供給量の上限を確実にするために、トークンを発行した後、発行者のレギュラーキーを`rrrrrrrrrrrrrrrrrrrrrhoLvTp`のような誰も秘密鍵を知らないアドレスに設定し、マスターキーペアを無効にすることで、「ブラックホール化」することができます。

**注意:** ブラックホール済アカウントはトランザクションを送信する手段を持たないため、その後アカウントに関する設定を更新したり、メンテナンスを行ったりすることはできません！

[マスターキーペアの無効化](../../tutorials/how-tos/manage-account-settings/disable-master-key-pair.md)をご覧ください。

### 信頼できるトランザクションの送信

確実にトランザクションを送信するためには、以下の2つの条件を有限の時間で実現する必要があります：

* 冪等性 - トランザクションは一度だけ処理されるか、まったく処理されないこと。
* 検証可能性 - アプリケーションはトランザクションの最終結果を判断できること。

トランザクションを確実に送信するには、以下のガイドラインに従ってください。

* トランザクションを送信する前にトランザクションの内容を永続化すること。
* `LastLedgerSequence`パラメーターを使用すること。(多くの[クライアントライブラリ](../../references/client-libraries.md)はデフォルトでそうなっています)。
* 現在の[レジャーインデックス][]がトランザクションの`LastLedgerSequence`パラメータ以下である検証済みのレジャーにトランザクションが表示されていない場合、トランザクションを再送信してください。

詳しくは[信頼できるトランザクションの送信](../../concepts/transactions/reliable-transaction-submission.md)をご覧ください。

### XRPLネイティブDEXへのリスト

分散型取引所(DEX)は分散型金融エコシステムに不可欠です。あなたのトークンをXRP Ledger組み込みのDEXに上場することで、その認知度と流動性を高めることができます。まず、[Sologenic](https://sologenic.org/trade)のような適切なインターフェイスを使って売りのオファーを出しましょう。念のため、取引には発行アドレスではなく別のアカウントを使用してください。


### AMMへのリスト
_([AMM amendment][])_

自動マーケットメイカー(AMM)は、XRP Ledgerの分散型取引所で流動性を提供するスマートコントラクトです。各AMMは2つの資産のプールを保有し、計算式で設定された取引レートでユーザがそれらの間でスワップを行うことを可能にします。

どの資産ペアに対しても、レジャーには最大1つのAMMが存在します。資産ペアのAMMがまだ存在しない場合は、新しいトークンでAMMを作成するか、別の既存のAMMに預けることができます。AMMに資産を預ける人は、流動性提供者(LP)と呼ばれ、AMMからLPトークンを受け取ります。

[自動マーケットメーカー](../../concepts/tokens/decentralized-exchange/automated-market-makers.md)をご覧ください。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
