---
seo:
    description: 本番環境のXRP Ledgerに関する既知のAmendmentのすべてとそのステータスをまとめた総合リストです。
labels:
  - ブロックチェーン
---
# 既知のAmendment
[[ソース]](https://github.com/XRPLF/rippled/blob/develop/include/xrpl/protocol/detail/features.macro "Source")

以下に示すのは、XRP Ledgerに関する既知のAmendmentのすべてとそのステータスをまとめた総合リストです。

## メインネットのステータス

以下のAmendmentは、XRP Ledgerメインネットですでに有効になっているか、投票中であり、2週間にわたって過半数の賛成が得られれば有効になる可能性があります。

{% amendments-table /%}

## 開発中のAmendment

以下は、現在開発中の[Amendment](../docs/concepts/networks-and-servers/amendments.md)のリストで、変更をテストするためのテストネットが利用可能です。

| 名前                               | ステータス                         | 追加情報                       |
|:----------------------------------|:------------------------------------|:-------------------------------|
 | [Hooks][]                         | {% badge %}開発中: 未定{% /badge %} | [XRPL Hooks](https://hooks.xrpl.org/) |
 | [InvariantsV1_1][]                | {% badge %}開発中: 未定{% /badge %} |  |
 | [OwnerPaysFee][]                  | {% badge %}開発中: 未定{% /badge %} |  |
 | [SingleAssetVault][]              | {% badge %}開発中: 未定{% /badge %} | [Single Asset Vault (Ripple Opensource)](https://opensource.ripple.com/docs/xls-65d-single-asset-vault) |

{% admonition type="info" name="注記" %}
このリストは手動で更新されています。もしあなたがAmendmentに取り組んでいて、その変更をテストするためのテストネットワークを持っているなら、このページを編集して開発中のamendmentをこのリストに追加することができます。XRP Ledgerへの貢献についての詳細は、[XRP Ledgerのコードへの貢献](contribute-code/index.md)をご覧ください。
{% /admonition %}


## 廃止されたAmendment

以下は、以前のバージョンで廃止され削除された、あるいは撤回され削除のマークが付けられた、既知の[Amendment](../docs/concepts/networks-and-servers/amendments.md)の一覧です。

| 名前                               | 登場       | ステータス                      |
|:----------------------------------|:-----------|:------------------------------|
 | [fixNFTokenNegOffer][]            | v1.9.2     | {% badge %}廃止: 削除予定{% /badge %} |
 | [fixNFTokenDirV1][]               | v1.9.1     | {% badge %}廃止: 削除予定{% /badge %} |
 | [NonFungibleTokensV1][]           | v1.9.0     | {% badge %}廃止: 削除予定{% /badge %} |
 | [CryptoConditionsSuite][]         | v0.60.0    | {% badge %}廃止: 削除予定{% /badge %} |
 | [SHAMapV2][]                      | v0.32.1    | {% badge href="https://xrpl.org/blog/2019/rippled-1.4.0.html" %}廃止: v1.4.0で削除済み{% /badge %} |
 | [Tickets][]                       | v0.30.1    | {% badge href="https://xrpl.org/blog/2018/rippled-0.90.0.html" %}廃止: v0.90.0で削除済み{% /badge %} |
 | [SusPay][]                        | v0.31.0    | {% badge href="https://xrpl.org/blog/2017/ticksize-voting.html#upcoming-features" %}廃止: v0.60.0で削除済み{% /badge %} |
 | [FlowV2][]                        | v0.32.1    | {% badge href="https://xrpl.org/blog/2016/flowv2-vetoed.html" %}廃止: v0.33.0で削除済み{% /badge %} |

## 既知のAmendmentsの詳細

### AMM
[AMM]: #amm

| Amendment    | AMM |
|:-------------|:----|
| Amendment ID | 8CC0774A3BF66D1D22E76BBDA8E8A232E6B6313834301B3B23E8601196AE6455 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

既存の分散型取引所と統合された形で、自動マーケットメーカー(AMM)機能に追加します。各アセット（トークンまたはXRP）のペアは、Ledger上に最大1つのAMMプールを持つことができ、誰でも流動性を提供することで、収益と為替リスクを比例配分することができます。各AMMプールのインスタンスはその資産を保持するための特別なアカウントを持ち、流動性プロバイダーに対してその預入額に応じて"LPトークン"を発行します。流動性プロバイダーは、LPトークンのシェアに基づいてAMMプールの取引手数料に投票することができます。ユーザは、一定期間取引手数料が割引される権利にLPトークンを使って入札することができます。

追加される新規トランザクション

- [AMMBid](../docs/references/protocol/transactions/types/ammbid.md) - 取引手数料を割引するAMMプールのオークション枠に入札します。
- [AMMCreate](../docs/references/protocol/transactions/types/ammcreate.md) - AMMプールの新しいインスタンスを作成し、初期資金を供給します。
- [AMMDelete](../docs/references/protocol/transactions/types/ammdelete.md) - 空となったAMMプールのインスタンスを削除します。
- [AMMDeposit](../docs/references/protocol/transactions/types/ammdeposit.md) - 既存のAMMプールに資金を供給し、LPトークンを受け取ります。
- [AMMWithdraw](../docs/references/protocol/transactions/types/ammwithdraw.md) - LPトークンをAMMプールに返却して資金を引き出します。
- [AMMVote](../docs/references/protocol/transactions/types/ammvote.md) - AMMプールの取引手数料について投票します。

既存のトランザクションを新たな機能でアップデートします。

- 資産の取引に利用可能なPaymentとOfferCreateトランザクションは、より最良の取引レートを利用可能とするためにOfferとAMMの任意の組み合わせを利用します。
- AMMの特別なアカウントに送信できないトランザクションがあります（例えば、AMMはCheckを換金できないため、AMMへのCheckCreateは許可されません）。

新しいタイプのレジャーエントリ`AMM`を追加し、`AccountRoot`レジャーエントリタイプに`AMMID`フィールドを追加します。

いくつかの新しい結果コードを追加します。


### AMMClawback
[AMMClawback]: #ammclawback

| Amendment    | AMMClawback |
|:-------------|:------------|
| Amendment ID | 726F944886BCDF7433203787E93DD9AA87FAB74DFE3AF4785BA03BEFC97ADA1F |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

このAmendmentにより、Clawbackが有効になっているトークンが自動マーケットメーカー(AMM)で使用できるようになります。新しいトランザクションを追加します。

- **AMMClawback** - トークンにClawbackが有効になっている場合、発行者は、AMMに預けられたトークンをClawbackできるようになります。

AMMDepositトランザクションタイプを修正し、AMMにフリーズされたトークンを預けることを防ぎます。

詳細については、[XLS-73: AMMClawback specification](https://github.com/XRPLF/XRPL-Standards/discussions/212)をご覧ください。


### Batch
[Batch]: #batch

| Amendment    | Batch |
|:-------------|:------|
| Amendment ID | 894646DD5284E97DECFE6674A6D6152686791C4A95F8C132CCA9BAF9E5812FB6 |
| ステータス     | 投票中 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

Allows multiple transactions to be bundled into a batch that's processed all together. Standard: [XLS-56d](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0056d-batch)


### CheckCashMakesTrustLine
[CheckCashMakesTrustLine]: #checkcashmakestrustline

| Amendment    | CheckCashMakesTrustLine |
|:-------------|:------------------------|
| Amendment ID | 98DECF327BF79997AEC178323AD51A830E457BFC6D454DAF3E46E5EC42DC619F |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

[CheckCashトランザクション][]を修正し、[Check](../docs/concepts/payment-types/checks.md)を現金化して発行されたトークンを入手すると、トークンを保持する[トラストライン](../docs/concepts/tokens/fungible-tokens/index.md)を自動的に作成するようにしました。この新しい動作は、ユーザが分散型取引所でトークンを購入する際の[OfferCreateトランザクション][]の動作に似ています。自動的に作成されたトラストラインには限度額0が設定されています。これにより、Checkでトークンを受け取る前にトラストラインを設定するという設定ステップがなくなります。(XRPを送信するCheckは影響を受けません)。

この修正を適用しない場合、ユーザは、Checkを発行トークンと交換する前に、別途[TrustSetトランザクション][]を送信する必要があります。

この修正は、XRP Ledgerにおいて不要なトークンを保持することを誰にも強制できないという原則を変えるものではありません。


### Checks
[Checks]: #checks

| Amendment    | Checks |
|:-------------|:-------|
| Amendment ID | 157D2D480E006395B76F948E3E07A45A05FE10230D88A7993C71F97AE4B1F2D1 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

「Checks」をXRP Ledgerに導入します。Checksは個人用の紙の小切手と同様の機能を持っています。送信者はトランザクションに署名して、具体的な最高額と受取人を入力したCheckを作成します。その後、受取人はCheckを換金して、指定された金額を上限として現金を受け取ることができます。金銭の移動が実際に発生するのはCheckが換金されるときなので、送信者の現在の残高と流動性の状況によっては、Checkを換金できない場合があります。Checkを換金できない場合、Checkオブジェクトはレジャーに残るため、後日換金できるようになる場合があります。

送信者と受信者は、換金前であればいつでもCheckを取り消すことができます。Checkには有効期限を設定できます。有効期限が過ぎた後は換金できなくなり、誰でもそのCheckを取り消すことができます。

新たに導入するトランザクションタイプは次の3つです。CheckCreate、CheckCancel、CheckCash。また、新しいレジャーオブジェクトタイプはCheckです。新たに追加するトランザクション結果コード`tecEXPIRED`は、有効期限が過去の日時であるCheckを作成しようとすると発生します。


### Clawback
[Clawback]: #clawback

| Amendment    | Clawback |
|:-------------|:---------|
| Amendment ID | 56B241D7A43D40354D02A9DC4C8DF5C7A1F930D92A9035C4E12291B3CA3E1C2B |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

規制上の目的から、発行者の中には、発行されたトークンがアカウントに配布された後に回収する能力を持たなければならない場合があります。例えば、トークンが違法行為で制裁を受けたアカウントに送られたことが発覚した場合、発行者はその資金を _回収(claw back)_ することができます。

Clawbackはデフォルトでは無効になっています。Clawbackを使用するには、`AccountSet`トランザクションを使用して`lsfAllowTrustLineClawback`フラグを設定する必要があります。

この修正の詳細については、[Clawback](../docs/concepts/tokens/fungible-tokens/clawing-back-tokens.md)をご覧ください。


### Credentials
[Credentials]: #credentials

| Amendment    | Credentials |
|:-------------|:------------|
| Amendment ID | 1CB67D082CF7D9102412D34258CEDB400E659352D3B207348889297A6D90F5EF |
| ステータス     | 投票中 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

XRP Ledgerを使用して資格情報およびコンプライアンス要件を管理するためのツールセット、Credentialsを追加します。 Credentialsを管理するための3つの新しいトランザクションタイプを追加します。

- CredentialCreateトランザクション - レジャーにCredentialを作成します。
- CredentialAcceptトランザクション - 発行されたCredentialを受け入れます。
- CredentialDeleteトランザクション - レジャーからCredentialを削除します。

既存のトランザクションタイプを修正します。

- DepositPreauthトランザクション - アカウントへの入金を承認します。Credentialに基づく承認を許可するように修正します。

いくつかの既存のトランザクションタイプに新しいフィールドを追加します。

- `CredentialIDs`フィールド - 入金の承認を認証するためのクレデンシャル。Payment、EscrowFinish、PaymentChannelClaim、および AccountDelete トランザクション・タイプに追加されます。

新しいレジャーエントリタイプを追加します。

- Credentialレジャーエントリ - レジャーにCredentialを保存します。

既存のレジャーエントリタイプを修正します。

- DepositPreauthレジャーエントリ - 特定のアカウントへの入金の承認を記録します。Credentialに基づく承認を許可するように修正します。

`deposit_authorized` APIメソッドを修正し、Credentialに基づく認証をチェックするようにします。また、`ledger_entry`メソッドを修正し、Credentialエントリの検索を許可します。

詳細については、[XLS-70: Credentials specification](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0070d-credentials)をご覧ください。


### CryptoConditions
[CryptoConditions]: #cryptoconditions

| Amendment    | CryptoConditions |
|:-------------|:-----------------|
| Amendment ID | 1562511F573A19AE9BD103B5D6B9E01B3B46805AEC5D3C4805C902B514399146 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | はい |

この修正は有効ですが、[SusPay](#suspay) Amendmentも有効でない限り、何の影響も及ぼしません。SusPayの修正は、[Escrow](#escrow)の修正に置き換えられたため、CryptoConditionsの修正は効力を持ちません。


### CryptoConditionsSuite
[CryptoConditionsSuite]: #cryptoconditionssuite

| Amendment    | CryptoConditionsSuite |
|:-------------|:----------------------|
| Amendment ID | 86E83A7D2ECE3AD5FA87AB2195AE015C950469ABF0B72EAACED318F74886AE90 |
| ステータス     | 廃止 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

[EscrowCreate][]トランザクションと[EscrowFinish][]トランザクションで使用するために、公式の[Crypto-Conditions仕様](https://tools.ietf.org/html/draft-thomas-crypto-conditions-03)から数種類のCrypto-Conditionsを導入するものでした。

しかし、この修正は実装が完了する前に`rippled` v0.60.0に追加されました。その結果、このAmendment IDは、ほとんど何もしない不完全なコードを参照することになりました。他のcrypto-conditionsのサポートを追加するために既存のAmendmentを変更すると、すでにリリースされたソフトウェアにある古いバージョンの修正案との衝突が発生します。将来のリリースで追加の暗号条件のサポートが追加される場合、新しい別のAmendment IDを使用する必要があります。


### DeepFreeze
[DeepFreeze]: #deepfreeze

| Amendment    | DeepFreeze |
|:-------------|:-----------|
| Amendment ID | DAF3A6EB04FA5DC51E8E4F23E9B7022B693EFA636F23F22664746C77B5786B23 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

This amendment enables issuers to deep freeze trustlines from interacting with payments, offers, AMMs, and the DEX. This prevents deep frozen accounts from sending and receiving frozen assets. With this amendment, four new flags are introduced:

- `RippleState` flags:
  - `lsfLowDeepFreeze`
  - `lsfHighDeepFreeze`
- `TrustSet` flags:
  - `tfSetDeepFreeze`
  - `tfClearDeepFreeze`


### DeletableAccounts
[DeletableAccounts]: #deletableaccounts

| Amendment    | DeletableAccounts |
|:-------------|:------------------|
| Amendment ID | 30CD365592B8EE40489BA01AE2F7555CAC9C983145871DC82A42A31CF5BAE7D9 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

[アカウント](../docs/concepts/accounts/index.md)を削除できるようになります。

この修正を適用しない場合、新しいアカウントは`Sequence`番号が必ず1で始まります。また、レジャーの状態データからアカウントを削除できません。

この修正を適用した場合、新しいアカウントは、そのアカウントが作成された[レジャーのインデックス][レジャーインデックス]に一致する`Sequence`番号に等しい`Sequence`番号で始まります。この変更により、一度削除され、その後再作成されたアカウントが、古いトランザクションを再度実行しないように保護することができます。新しい`AccountDelete`トランザクションタイプを追加すると、アカウントと、そのアカウントがレジャーに所有する特定のオブジェクトが削除されます。ただし、特定の種類のオブジェクトはこの方法で削除できないため、そのようなオブジェクトに関連付けられているアカウントは削除できません。また、現行のレジャーインデックスから256を引いた値がアカウントの現行`Sequence`番号より低い場合も、アカウントは削除できません。この修正に関する詳しい解説については、[XRP Community Standards Draft 7](https://github.com/XRPLF/XRPL-Standards/issues/8)をご覧ください。


### DepositAuth
[DepositAuth]: #depositauth

| Amendment    | DepositAuth |
|:-------------|:------------|
| Amendment ID | F64E1EABBE79D55B3BB82020516CEC2C582A98A6BFE20FBE9BB6A0D233418064 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

新しいアカウントフラグ`DepositAuth`を追加します。これにより、他のアカウントから送信されたトランザクションに係る入金が厳密に拒否されます。企業はこのフラグを使用することで、あらゆる送金人からの送金を受け入れる前に規則に準拠して適切に対処することができます。

支払先のアカウントのこのフラグが有効になっている場合、支払いがXRPでなされるか、トークンでなされるかにかかわらず、Paymentトランザクションは失敗となります。アカウントが支払先である場合、支払先アカウント自体から上記のトランザクションが送信されなければ、EscrowFinishトランザクションとPaymentChannelClaimトランザクションは失敗します。[Checks][] amendmentが有効である場合、CheckCashトランザクションを送信することによってXRPまたはトークンをアカウントで受け取ることができます。

例外として、`DepositAuth`が有効になっているアカウントでは、現在のXRP残高がアカウントの準備金を下回る場合、少額のXRP（[アカウント準備金](../docs/concepts/accounts/reserves.md)の最低額以下）のPaymentトランザクションを受け取ることができます。

また、EscrowCreateトランザクションとPaymentChannelCreateトランザクションで誤ってDisallowXRPフラグを適用してしまうバグも修正します。これは強制力のない勧告フラグとするものです。（レジャー自体にDisallowXRPフラグを適用しないことで、[アカウント準備金](../docs/concepts/accounts/reserves.md)を満たし[トランザクションコスト](../docs/concepts/transactions/transaction-cost.md)を支払うのに必要なXRPを、アカウントが引き続き受け取ることができます。）


### DepositPreauth
[DepositPreauth]: #depositpreauth

| Amendment    | DepositPreauth |
|:-------------|:---------------|
| Amendment ID | 3CBC5C4E630A1B82380295CDA84B32B49DD066602E74E39B85EF64137FA65194 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

[Deposit Authorization](../docs/concepts/accounts/depositauth.md)のユーザに特定の送信者を事前承認する手段を提供して、承認された送信者が支払いを直接送信できるようにします。

事前承認の追加または削除のために新しいトランザクションタイプDepositPreauthを、あるアカウントから別のアカウントへの事前承認の追跡のためにDepositPreauthレジャーオブジェクトタイプを追加します。JSON-RPCコマンド`deposit_authorized`を追加します。これは、アカウントが別のアカウントへ支払いを直接送金することが承認されているかどうかを問い合わせるためのものです。

あるアカウントからそれ自身へのクロスカレンシー決済において、そのアカウントがDeposit Authorizationを必要とする場合の動作を変更しました。このamendmentなしでは、これらの支払いは常に`tecNO_PERMISSION`というコードで失敗します。この修正により、Deposit Authorizationが無効な場合と同様に、これらの支払いは成功します。

また、アカウントにDeposit Authorizationが必要な場合、アカウントから自身への異なる通貨間での支払いの動作も変更します。この修正を行わない場合、これらの支払いはコードtecNO_PERMISSIONにて常に失敗します。この修正を行う場合、これらの支払いはDeposit Authorization無効時と同様に成功します。


### DID
[DID]: #did

| Amendment    | DID |
|:-------------|:----|
| Amendment ID | DB432C3A09D9D5DFC7859F39AE5FF767ABC59AED0A9FB441E83B814D8946C109 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

[World Wide Web Consortium](https://www.w3.org/press-releases/2022/did-rec/)標準に準拠した分散アイデンティティ(DID)機能を追加します。DIDは、中央集権的な機関に依存せず、DID主体によって管理されるデジタルIDを提供します。

次の新しいトランザクションを追加します。

- [DIDDelete](../docs/references/protocol/transactions/types/diddelete.md) - XRPLアカウントに関連付けられたDIDを削除します。
- [DIDSet](../docs/references/protocol/transactions/types/didset.md) - 新しいDIDを作成するか、既存のDIDを更新します。

新しい`DID`レジャーエントリタイプを追加します。

いくつかの新しいトランザクション結果コードを追加します。


### DisallowIncoming
[DisallowIncoming]: #disallowincoming

| Amendment    | DisallowIncoming |
|:-------------|:-----------------|
| Amendment ID | 47C3002ABA31628447E8E9A8B315FAA935CE30183F9A9B86845E469CA2CDC3DF |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

Checks、Payment Channels、NFTokenOffer、およびトラストラインを自分のアカウントが受信するのを個別にブロックするためのオプションを提供します。アカウントでこれらのオプションを有効にすると、他のアカウントは、そのアカウントを宛先としてその種類のオブジェクトを作成することができなくなります。

4つの新しいAccountSet Flagsを追加し、AccountSetトランザクションで有効化および無効化できるように変更します。

- asfDisallowIncomingCheck
- asfDisallowIncomingPayChan
- asfDisallowIncomingNFTOffer
- asfDisallowIncomingTrustline

対応するオブジェクトタイプを作成する前に、これらのフラグの状態をチェックするようにトランザクション処理を変更します。宛先アカウントがそのフラグを有効にしている場合、トランザクションはエラーコード`tecNO_PERMISSION`で失敗します。

この修正が適用されない場合、どのアカウントでも、任意のオブジェクトの宛先としてこれらのオブジェクトを作成することができます。これは通常問題はないものの、後でアカウントを削除する際に妨げになったり、詐欺の一部として使用される可能性があります。


### DynamicNFT
[DynamicNFT]: #dynamicnft

| Amendment    | DynamicNFT |
|:-------------|:-----------|
| Amendment ID | C1CE18F2A268E6A849C27B3DE485006771B4C01B2FCEC4F18356FE92ECD6BB74 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

Adds functionality to update the `URI` field of an `NFToken` ledger entry. This amendment introduces a new transaction type and `NFTokenMint` flag:

1. `NFTokenModify`: New transaction type that updates the `URI` field of an NFT.
2. `tfMutable`: New flag that enables authorized accounts to modify the `URI` of an NFT. This flag must be enabled when the NFT is initially minted.


### EnforceInvariants
[EnforceInvariants]: #enforceinvariants

| Amendment    | EnforceInvariants |
|:-------------|:------------------|
| Amendment ID | DC9CA96AEA1DCF83E527D1AFC916EFAF5D27388ECA4060A88817C1238CAEE0BF |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | はい |

トランザクション処理にサニティーチェックを追加して、所定の条件が常に満たされるようにします。これにより、トランザクション処理時のバグを防ぐ独立した追加のレイヤーができます。このレイヤーがなければXRP Ledgerが脆弱なものとなり悪用される可能性が生じます。`rippled`の将来バージョンでは、Amendmentを追加せずに不変性チェックをさらに追加する予定です。

2つの新しいトランザクションエラーコード、`tecINVARIANT_FAILED`と`tefINVARIANT_FAILED`を導入します。新しいチェックを追加するためにトランザクション処理を変更します。

不変性チェックの例:

- トランザクションによって消却されたXRPの合計額は、[トランザクションコスト](../docs/concepts/transactions/transaction-cost.md)と正確に一致していなければなりません。
- XRPは作成できません。
- [レジャー内の`AccountRoot`オブジェクト](../docs/references/protocol/ledger-data/ledger-entry-types/accountroot.md)は、[DeletableAccounts](#deletableaccounts)が有効でない限り削除できません。（関連項目: [アカウントの削除](../docs/concepts/accounts/deleting-accounts.md)）
- [レジャー内のオブジェクト](../docs/references/protocol/ledger-data/ledger-entry-types/index.md)のタイプは変更できません。（`LedgerEntryType`フィールドは変更できません。）
- XRPにトラストラインはありません。


### Escrow
[Escrow]: #escrow

| Amendment    | Escrow |
|:-------------|:-------|
| Amendment ID | 07D43DCE529B15A10827E5E04943B496762F9A88E3268269D69C44BE49E21104 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | はい |

[SusPay](#suspay)および[CryptoConditions](#cryptoconditions) Amendmentを置き換えます。

XRP Ledger内のEscrowにXRPの「仮払い」機能を提供します。これには[Interledger Protocol Crypto-Conditions](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02)のサポートが含まれます。仮払い用のレジャーオブジェクトタイプと、仮払いを作成、実行、取り消すためのトランザクションタイプを新規作成します。


### ExpandedSignerList
[ExpandedSignerList]: #expandedsignerlist

| Amendment    | ExpandedSignerList |
|:-------------|:-------------------|
| Amendment ID | B2A4DB846F0891BF2C76AB2F2ACC8F5B4EC64437135C6E56F3F859DE5FFD5856 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

この修正により、署名者リストの最大サイズが拡大され、各署名者にオプションのデータを関連付けることができるようになりました。追加データは署名者を特定するために使用でき、スマートコントラクトや、大規模な組織で誰が鍵を管理しているかを特定するのに便利です。例えば、IPv6アドレスやハードウェアセキュリティモジュール（HSM）の識別子を保存することができます。

この修正が適用されない場合、署名者リストの最大サイズは8人で、各署名者には`Account`と`SignerWeight`の2つのフィールドが存在します。

この修正により、[SignerListオブジェクト][]の最大サイズは32エントリになります。さらに、各`SignerEntry`オブジェクトは、任意のデータを含む256ビットの`WalletLocator`フィールドを含むことができます。この修正により、[SignerListSetトランザクション][]もそれに応じて変更されます。


### FeeEscalation
[FeeEscalation]: #feeescalation

| Amendment    | FeeEscalation |
|:-------------|:--------------|
| Amendment ID | 42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | はい |

提案されたトランザクションに[トランザクションコスト](../docs/concepts/transactions/transaction-cost.md)を適用する方法を変更します。トランザクションコストの高いトランザクションの優先順位が高くなるよう、コンセンサスプロセスを変更します。

この修正により、前のコンセンサスラウンドに含められなかったトランザクションに固定サイズのトランザクションキューが導入されます。コンセンサスネットワーク内の`rippled`サーバに重い負荷が課されている場合、トランザクションコストの低いトランザクションは後のレジャーのキューに入れられます。各コンセンサスラウンドでは、トランザクションコスト（`Fee`値）が高いキューのトランザクションが優先され、コンセンサスネットワークで処理できる限りのトランザクションが含められます。トランザクションキューが一杯になると、トランザクションコストが最も低いトランザクションから順にキューから完全に除外されます。

コンセンサスネットワークに重い負荷がかかる一方で、正規のユーザは高めのトランザクションコストを支払い、トランザクションを確実に処理することができます。この状況は、未処理の低コストのトランザクションが完全に処理または除外されるまで続きます。

1つのトランザクションは、以下のいずれかが発生するまでキュー内に残ります。

* 検証済みレジャーに適用される（成功か失敗かには関係ありません）
* 無効になる（例えば、[`LastLedgerSequence`](../docs/references/protocol/transactions/common-fields.md)によって有効期限切れとなる）
* キュー内にトランザクションコストの高いトランザクションがたくさんあるため除外される


### fix1201
[fix1201]: #fix1201

| Amendment    | fix1201 |
|:-------------|:--------|
| Amendment ID | B4D44CC3111ADD964E846FC57760C8B50FFCD5A82C86A72756F6B058DDDF96AD |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | はい |

[送金手数料](../docs/concepts/tokens/fungible-tokens/transfer-fees.md)に限度を正しく導入し、100%の料金にします。これは、`TransferRate`値の最大値である`2000000000`を表します。（この場合の100%の料金とは、送信する1ユニットごとに2ユニットのトークンを送信する必要があることを意味します。）この修正を行わない場合、有効な限度は`TransferRate`値の2<sup>32</sup>-1、つまり約329%の料金となります。

この修正を行う場合、[AccountSet][]トランザクションの`TransferRate`を`2000000000`より高く設定すると、トランザクションは結果コード`temBAD_TRANSFER_RATE`にて失敗します。以前のルールに従って高い値が設定されている既存のすべての`TransferRate`には、そのまま高い率が適用されます。


### fix1368
[fix1368]: #fix1368

| Amendment    | fix1368 |
|:-------------|:--------|
| Amendment ID | E2E6F2866106419B88C50045ACE96368558C345566AC8F2BDF5A5B5587F0E6FA |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | はい |

有効であるべき一部の支払いが失敗となる、トランザクション処理の小さなバグを修正します。具体的には、支払い処理中に、特定金額の通貨を生成する支払いステップの一部で、浮動小数点の表示に関する精度の不良により、わずかに異なる金額が生成されてしまうことがあります。この状況が発生すると、正確な金額を送金できないため支払いが失敗します。fix1368 Amendmentにより、トランザクション処理が修正されれば、このような支払いの失敗はなくなります。


### fix1373
[fix1373]: #fix1373

| Amendment    | fix1373 |
|:-------------|:--------|
| Amendment ID | 42EEA5E28A97824821D4EF97081FE36A54E9593C6E4F20CBAE098C69D2E072DC |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | はい |

特定の[支払いパス](../docs/concepts/tokens/fungible-tokens/paths.md)を作成する際にエラーを引き起こすトランザクション処理の小さなバグを修正します。この結果、有効であっても正しく作成されていないパスを、支払いで使用できなくなりました。この修正を行わない場合、支払い時に好ましくないパスの使用を強制されたり、失敗したりする恐れがあります。

fix1373 Amendmenによりこの問題は修正されるため、正しく作成されたパスを使用して支払いを行えます。また、現在は許可されているものの適切ではない一部のパスが無効になります。これには、同じオブジェクトを2回以上ループしてコンフリクトを起こすフィールドやパスを含む[ステップ](../docs/concepts/tokens/fungible-tokens/paths.md#パスの仕様)を持つパスが含まれます。


### fix1512
[fix1512]: #fix1512

| Amendment    | fix1512 |
|:-------------|:--------|
| Amendment ID | 6C92211186613F9647A89DFFBAB8F94C99D4C7E956D495270789128569177DA1 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | はい |

一部の無効な[PaymentChannelClaim][]トランザクションが、不正確なエラーコードで失敗するトランザクション処理のバグを修正します。この修正を行わない場合、トランザクションの結果コードは`tec`クラスとなりますが、レジャーに入力されず、[トランザクションコスト](../docs/concepts/transactions/transaction-cost.md)は支払われません。

この修正により、トランザクションは適切な結果コード`temBAD_AMOUNT`にて失敗します。


### fix1513
[fix1513]: #fix1513

| Amendment    | fix1513 |
|:-------------|:--------|
| Amendment ID | 67A34F2CF55BFC0F93AACD5B281413176FEE195269FA6D95219A2DF738671172 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

`FeeEscalation` Amendmentが行われると、新しい`STAmountCalcSwitchovers`コードが使用されないトランザクション処理のバグを修正します。

この修正により、新しい`STAmountCalcSwitchovers`コードが適用されるため、計算の違いによってトランザクション処理に若干の変更を生じる場合があります。金額の四捨五入のやり方が異なり、その結果、オファーが異なる順序で実行される場合があります。


### fix1515
[fix1515]: #fix1515

| Amendment    | fix1515 |
|:-------------|:--------|
| Amendment ID | 5D08145F0A4983F23AFFFF514E83FAD355C5ABFBB6CAB76FB5BC8519FF5F33BE |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

Paymentトランザクションがオファーを処理していく方法を変更して、支払処理とオファー処理における流動性の消費の仕方のわずかな違いをなくします。（[FlowCross][]が有効の場合、オファーCreateトランザクションの処理方法にも影響します。）

この修正を行わない場合、トランザクションが同じ為替レートで2000を超えるオファーを消費すると、支払い処理は特定のオーダーブックを使用しなくなります。この場合、支払いはそれらのオファーの流動性を使用せず、支払いを完了するときにそのオーダーブックに残された流動性を考慮しません。

この修正により、同じ為替レートで1000を超えるオファーを処理するトランザクションはすべて、そのトランザクションの最初の1000のオファーの流動性を消費し、支払いを完了時にはそのオーダーブックに残された流動性は考慮されません。

どちらの場合でも、トランザクション処理は他のパスまたは為替レートからの流動性を使用して完了できます。


### fix1523
[fix1523]: #fix1523

| Amendment    | fix1523 |
|:-------------|:--------|
| Amendment ID | B9E739B8296B4A1BB29BE990B17D66E21B62A300A909F25AC55C22D6C72E1F9D |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | はい |

支払先アカウント別の追跡機能を[Escrow](../docs/concepts/payment-types/escrow.md)に追加します。この修正を行わない場合、保留中のEscrowは送信者別にしか追跡できません。この修正により、[account_objectsメソッド][]を使用して支払先アドレスごとに保留中のEscrowを調べることができます。ただし、この修正が有効になる前に作成された保留中のEscrowを除きます。また、この修正では、[EscrowCreateトランザクション][]を支払先のトランザクション履歴に表示することができます。これは[account_txメソッド][]による表示と同様です。

この修正により、新しいEscrowが送信者と受信者両方の[所有者ディレクトリー](../docs/references/protocol/ledger-data/ledger-entry-types/directorynode.md)に追加されます。また、[Escrowレジャーオブジェクト](../docs/references/protocol/ledger-data/ledger-entry-types/escrow.md)に新しい`DestinationNode`フィールドも追加され、支払先の所有者ディレクトリのどのページにEscrowがあるかを表示します。


### fix1528
[fix1528]: #fix1528

| Amendment    | fix1528 |
|:-------------|:--------|
| Amendment ID | 1D3463A5891F9E589C5AE839FFAC4A917CE96197098A1EF22304E1BC5B98A454 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | はい |

バリデータがさまざまなタイムスタンプでコンセンサスレジャーを構築できることが原因で、検証済みレジャーの宣言プロセスに遅れをもたらす可能性があるバグを修正します。このような状況の発生は正確なタイミングを要するため、管理テスト環境の外部にいるバリデータがこのバグに遭遇することはあまりありません。

この修正は、バリデータがコンセンサスレジャーの終了時刻の交渉方法を変更して、レジャー内容について合意を得ることはできないが、異なるタイムスタンプでレジャーバージョンを構築できるようにします。


### fix1543
[fix1543]: #fix1543

| Amendment    | fix1543 |
|:-------------|:--------|
| Amendment ID | CA7C02118BA27599528543DFE77BA6838D1B0F43B447D4D7F53523CE6A0E9AC2 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

予約済のフラグ範囲を、まだ正しく適用されていないトランザクションタイプに適用します。未定義または未知のフラグ、または予約された範囲のフラグが有効になっている場合、影響を受けるトランザクションタイプのトランザクションは無効と見なされるようになります。（この変更による影響を受けないトランザクションには、すでに同じルールが正しく適用されています。）

この修正を行わない場合、特定のタイプのトランザクションで未定義または予約されたフラグが有効になっていても、そのトランザクションタイプは有効と見なされます。

影響を受けるトランザクションタイプは以下のとおりです。

- Escrowトランザクション: [EscrowCancel][]、[EscrowCreate][]、[EscrowFinish][]
- Payment Channelトランザクション: [PaymentChannelClaim][]、[PaymentChannelCreate][]、[PaymentChannelFund][]


### fix1571
[fix1571]: #fix1571

| Amendment    | fix1571 |
|:-------------|:--------|
| Amendment ID | 7117E2EC2DBF119CA55181D69819F1999ECEE1A0225A7FD2B9ED47940968479C |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

以下のようにEscrowの問題を修正します。

- [EscrowCreateトランザクション][]に`Condition`フィールドまたは`FinishAfter`フィールド（またはその両方）が必要となるように変更します。この修正以前に作成された、`Condition`や`FinishAfter`のいずれも持たないEscrowは、`CancelAfter`時間より前ならいつでも誰でも終了できます。
- 時間ベースのEscrowが特定の状況下で終了されるのを誤って妨げる欠陥を修正します。


### fix1578
[fix1578]: #fix1578

| Amendment    | fix1578 |
|:-------------|:--------|
| Amendment ID | FBD513F1B893AC765B78F250E6FFA6A11B573209D1842ADC787C850696741288 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

以下の2つのトランザクションタイプから返される結果コードを変更します。

- [OfferCreateトランザクション][]を変更して、オファーが`tfFillOrKill`フラグを使用していて中止された場合に、新しい結果コード`tecKILLED`が返されるようにします。この修正を行わない場合、オファーは中止されますが、トランザクション結果は`tesSUCCESS`になります。
- [TrustSetトランザクション][]を変更して、トラストラインがマイナス残高であるため、[NoRippleフラグ](../docs/concepts/tokens/fungible-tokens/rippling.md#norippleフラグ)を有効にしようとしてもできない場合に、`tecNO_PERMISSION`で失敗するようにします。この修正を行わない場合、トランザクションでNoRippleフラグを有効にできなくても、トランザクション結果は`tesSUCCESS`になります。


### fix1623
[fix1623]: #fix1623

| Amendment    | fix1623 |
|:-------------|:--------|
| Amendment ID | 58BE9B5968C4DA7C59BA900961828B113E5490699B21877DEF9A31E9D0FE5D5F |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

変動金額で換金されたCheckCashトランザクションのメタデータに送金額を追加します。（[Checks](#checks) Amendmentが有効でないかぎり効果がありません。）

この修正を行うと、トランザクション処理にて変動金額の[CheckCashトランザクション][]のメタデータに`DeliveredAmount`フィールドが追加されます（`DeliverMin`フィールドを使用します）。この変更はレジャーデータに書き込まれるため、この修正を行わずにトランザクションを処理した場合とは異なるレジャーハッシュとなります。これは実際に送信される金額には影響しません。また、この修正を有効にすると、[txメソッド][]と[account_txメソッド][]によってCheckCashトランザクションの[`delivered_amount`フィールド](../docs/references/protocol/transactions/metadata.md#delivered_amount)が返されます。（`delivered_amount`フィールドはトランザクションの検索時に計算されるものであり、レジャーに書き込まれるデータの一部ではありません。）

fix1623 Amendmentは、固定金額の[CheckCashトランザクション][]（`Amount`フィールドを使用）またはその他のトランザクションタイプには影響しません。


### fix1781
[fix1781]: #fix1781

| Amendment    | fix1781 |
|:-------------|:--------|
| Amendment ID | 25BA44241B3BD880770BFA4DA21C7180576831855368CBEC6A3154FDE4A7676E |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

循環パスの検出時に、特定のXRPエンドポイントがチェックされない不具合を修正します。

この修正が適用されない場合、[支払いパス](../docs/concepts/tokens/fungible-tokens/paths.md)の入力がXRPで、パスの中間ステップでもXRPが出力されるようなパスが存在し得ます。これは「ループ」決済であり、前方と後方で実行すると異なる結果になる可能性があるため、決済エンジンはこのようなパスを禁止しています。

この修正が適用された場合、これらの支払いは、代わりに[結果コード`temBAD_PATH_LOOP`](../docs/references/protocol/transactions/transaction-results/tem-codes.md)で失敗します。


### fixAmendmentMajorityCalc
[fixAmendmentMajorityCalc]: #fixamendmentmajoritycalc

| Amendment    | fixAmendmentMajorityCalc |
|:-------------|:-------------------------|
| Amendment ID | 4F46DF03559967AC60F2EB272FEFE3928A7594A45FF774B87A7E540DB0F8F068 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

丸め処理の影響により、Amendmentが過半数を達成した後、信頼できるバリデータの80%にわずかに満たない賛成で有効になることがあるバグを修正しました。

この修正が適用されない場合、Amendmentが有効になるための最小閾値は、信頼できるバリデータの204/256を丸めた値であり、これはその時の信頼できるバリデータの数に依存します。例えば、36人中28人(約77.8%)のバリデータがあれば、補正は有効になりえます。この修正により、実際に必要な最小限のバリデータの数は、信頼できるバリデータの80％を下回ることはありません。


### fixAMMOverflowOffer
[fixAMMOverflowOffer]: #fixammoverflowoffer

| Amendment    | fixAMMOverflowOffer |
|:-------------|:--------------------|
| Amendment ID | 12523DF04B553A0B1AD74F42DDB741DE8DC06A03FC089A0EF197E2A87F1D8107 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

このAmendmentにより、決済エンジンにおけるAMMの大規模な合成オファーの不適切な処理が修正されます。このAmendmentは重大な修正であるため、ソースコードのデフォルトの投票はYESに設定されています。


### fixAMMv1_1
[fixAMMv1_1]: #fixammv1_1

| Amendment    | fixAMMv1_1 |
|:-------------|:-----------|
| Amendment ID | 35291ADD2D79EB6991343BDA0912269C817D0F094B02226C1C14AD2858962ED4 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

AMMからのオファーの丸めと低品質なオーダーブックのオファーをAMMがブロックする問題を修正します。


### fixAMMv1_2
[fixAMMv1_2]: #fixammv1_2

| Amendment    | fixAMMv1_2 |
|:-------------|:-----------|
| Amendment ID | 1E7ED950F2F13C4F8E2A54103B74D57D5D298FFDBD005936164EE9E6484C438C |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

Automated Market Maker (AMM)トランザクション処理の2つのバグを修正します。

- AMMWithdrawが、特定の条件下においてトラストラインを作成する前に準備金チェックを適切に行わないバグを修正します。
- 特定の条件下においてAMMとオーダーブックの組み合わせから利用可能な流動性の全額を使用しない支払い処理のバグを修正します。


### fixAMMv1_3
[fixAMMv1_3]: #fixammv1_3

| Amendment    | fixAMMv1_3 |
|:-------------|:-----------|
| Amendment ID | 7CA70A7674A26FA517412858659EBC7EDEEF7D2D608824464E6FDEFD06854E14 |
| ステータス     | 投票中 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

Adds several fixes to Automated Market Maker code, specifically:

- Add several invariant checks to ensure that AMMs function as designed.
- Add rounding to AMM deposit and withdraw to ensure that the AMM's balance meets the invariant:
    - On deposit, tokens out are rounded downward and deposit amount is rounded upward.
    - On withdrawal, tokens in are rounded upward and withdrawal amount is rounded downward.
- Fix validation of [AMMBid transactions][] to ensure that `AuthAccounts` cannot contain duplicates or the transaction sender.


### fixCheckThreading
[fixCheckThreading]: #fixcheckthreading

| Amendment    | fixCheckThreading |
|:-------------|:------------------|
| Amendment ID | 8F81B066ED20DAECA20DF57187767685EEF3980B228E0667A650BAF24426D3B4 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

Checksトランザクションがアカウントのメタデータに影響を及ぼす方法を変更し、Checksが受信アカウントの[アカウント](../docs/concepts/accounts/index.md)履歴に適切に追加されるようにします。（具体的には、受信アカウントの[AccountRootオブジェクト](../docs/references/protocol/ledger-data/ledger-entry-types/accountroot.md)の`PreviousTxnID`フィールドと`PreviousTxnLedgerSeq`フィールドを更新します。これは、アカウントと、アカウントが所有するオブジェクトに影響を及ぼしたトランザクションの「スレッド」を追跡するために使用できます。）

この修正を適用しない場合、Checksトランザクション（[CheckCreate][]、[CheckCash][]、および[CheckCancel][]）は送信者のアカウント履歴のみを更新します。この修正を適用した場合、これらのトランザクションは、送信アカウントにも受信アカウントにも影響します。この修正は、[Checks Amendment](#checks)も有効でないかぎり効果がありません。


### fixDisallowIncomingV1
[fixDisallowIncomingV1]: #fixdisallowincomingv1

| Amendment    | fixDisallowIncomingV1 |
|:-------------|:----------------------|
| Amendment ID | 15D61F0C6DB6A2F86BCF96F1E2444FEC54E705923339EC175BD3E517C8B3FF91 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

このamendmentにより、ユーザが自分のアカウントで`lsfDisallowIncomingTrustline`フラグを有効にした後にトラストラインを承認する際の問題が修正されます。

この問題を再現するには

1. 発行者が自分のアカウントに`asfRequireAuth`を設定します。
2. ユーザが自分のアカウントに`asfDisallowIncomingTrustline`を設定します。
3. ユーザは`SetTrust`トランザクションを発行者に送信します。
4. 発行者はトラストラインを承認できません。

このamendmentにより、発行者はトラストラインを認可できるようになりました。

このamendmentは、[DisallowIncoming][] amendmentが有効でない場合、影響はありません。


### fixEmptyDID
[fixEmptyDID]: #fixemptydid

| Amendment    | fixEmptyDID |
|:-------------|:------------|
| Amendment ID | 755C971C29971C9F20C6F080F2ED96F87884E40AD19554A5EBECDCEC8A1F77FE |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

このAmendmentにより、空の DID エントリが作成されないようにするためのチェックが追加されます。

また、トランザクションで空の DID が作成されると、代わりに新しいエラーコード `tecEMPTY_DID` が返されます。

このAmendmentがない場合、空のDIDが作成される可能性があり、これはレジャーのスペースを消費し、所有者の準備金としてカウントされますが、何の役にも立ちません。

この修正は、[DID][]Amendmentが有効になっていない限り、何の影響もありません。


### fixEnforceNFTokenTrustline
[fixEnforceNFTokenTrustline]: #fixenforcenftokentrustline

| Amendment    | fixEnforceNFTokenTrustline |
|:-------------|:---------------------------|
| Amendment ID | 763C37B352BE8C7A04E810F8E462644C45AFEAD624BF3894A08E5C917CF9FF39 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

NFTの転送手数料とトラストラインの処理に関する2つのバグを修正します。

- NFTの発行者が送金手数料を受け取るためのトラストラインを持っていることを確認するため、[NFTokenAcceptOfferトランザクション][]にチェックを追加します。このAmendmentがない場合、このチェックはNFT取引のオファーが作成されるときにのみ適用され、オファーが承認されるときには適用されません。その結果、オファーの作成と承認の間に必要なトラストラインが削除された場合、オファーが承認されるときに不適切にトラストラインが再作成されてしまいます。このAmendmentでは、ミンターが送金手数料を受け取るためのトラストラインを持っていない場合、NFT取引オファーを承認するトランザクションは失敗します。(詳細については、[issue #4925](https://github.com/XRPLF/rippled/issues/4925)をご覧ください。)
- NFTの発行者が、送金手数料として支払われる代替可能トークンの発行者でもある場合のトラストラインの存在チェックを調整します。このAmendmentがない場合、対象のNFTに送金手数料が設定されており、オファー額が発行者が発行した代替可能トークンで指定され、オファーを出すアカウントがそれらのトークンのトラストラインを持っていない場合、[NFTokenCreateOfferトランザクション][]は結果コード`tecNO_LINE`で失敗します。このAmendmentでは、オファーは正常に作成できます。(詳細については、[issue #4941](https://github.com/XRPLF/rippled/issues/4941)をご覧ください。)


### fixEnforceNFTokenTrustlineV2
[fixEnforceNFTokenTrustlineV2]: #fixenforcenftokentrustlinev2

| Amendment    | fixEnforceNFTokenTrustlineV2 |
|:-------------|:-----------------------------|
| Amendment ID | B32752F7DCC41FB86534118FC4EEC8F56E7BD0A7DB60FD73F93F257233C08E3A |
| ステータス     | 投票中 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

Fix a bug where NFT transfer fees could bypass certain limitations on receiving tokens, specifically:

- Prevent an NFT issuer from receiving fungible tokens as transfer fees if the fungible tokens' issuer uses [authorized trust lines](/docs/concepts/tokens/fungible-tokens/authorized-trust-lines) and the NFT issuer's trust line is not authorized.
- Prevent an NFT issuer from receiving fungible tokens as transfer fees on a [deep-frozen](/docs/concepts/tokens/fungible-tokens/deep-freeze) trust line.

Without this amendment, NFT transfer fees could be paid to an NFT issuer circumventing these restrictions.


### fixFillOrKill
[fixFillOrKill]: #fixfillorkill

| Amendment    | fixFillOrKill |
|:-------------|:--------------|
| Amendment ID | 3318EA0CF0755AF15DAC19F2B5C5BCBFF4B78BDD57609ACCAABE2C41309B051A |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

このamendmentは`FlowCross`amendmentで導入された問題を修正します。`tfFillOrKill`フラグが設定され、`tfSell`フラグが設定されていないオファーは、オファーの取引レートがオーダーブックのレートよりも良いが、完全に一致しない場合に失敗します。

このamendmentにより、決済エンジンはこのシナリオを適切に処理できるようになり、オファーの交差が可能になります。

このamendmentは、[FlowCross][] amendmentが有効でない場合、影響はありません。


### fixFrozenLPTokenTransfer
[fixFrozenLPTokenTransfer]: #fixfrozenlptokentransfer

| Amendment    | fixFrozenLPTokenTransfer |
|:-------------|:-------------------------|
| Amendment ID | 83FD6594FF83C1D105BD2B41D7E242D86ECB4A8220BD9AF4DA35CB0F69E39B2A |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

This amendment fixes a loophole that enabled blacklisted accounts to transfer frozen LP tokens through alternative mechanisms, such as such as payments, checks, offers, or NFTs.

With this amendment enabled, if an LP token is associated with a liquidity pool that contains at least one frozen asset, the LP token is also frozen. This means:

1. The holder can't send the frozen LP token to other accounts.
2. The holder can receive frozen LP tokens, but can't send them out (similar to frozen trust lines).


### fixInnerObjTemplate
[fixInnerObjTemplate]: #fixinnerobjtemplate

| Amendment    | fixInnerObjTemplate |
|:-------------|:--------------------|
| Amendment ID | C393B3AEEBF575E475F0C60D5E4241B2070CC4D0EB6C4846B1A07508FAEFC485 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

このamendmentにより、AMMの`sfVoteEntry`と`sfAuctionSlot`の内部オブジェクトの`sfTradingFee`フィールドと`sfDiscountedFee`フィールドにアクセスする際の問題が修正されました。

現在、内部オブジェクトのテンプレートはオブジェクトの生成時に設定されません。オブジェクトに`soeDEFAULT`フィールドがあり、初期値にデフォルト値が設定されている場合、そのフィールドにアクセスすると、状況によっては`tefEXCEPTION`エラーが発生します。このamendmentにより、内部オブジェクトテンプレートを設定するための追加の真偽値引数を含む`STObject`コンストラクタのオーバーロードが追加されます。


### fixInnerObjTemplate2
[fixInnerObjTemplate2]: #fixinnerobjtemplate2

| Amendment    | fixInnerObjTemplate2 |
|:-------------|:---------------------|
| Amendment ID | 9196110C23EA879B4229E51C286180C7D02166DA712559F634372F5264D0EC59 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

このAmendmentは、内部オブジェクト([正規バイナリフォーマットのObject型フィールド](../docs/references/protocol/binary-format.md#object-fields))のフォーマットとデフォルト値の強制方法を標準化します。これは`fixInnerObjTemplate`がAMM関連フィールドに適用するのと同じタイプのチェックですが、このAmendmentは他のすべての種類の内部オブジェクトに適用されます。具体的には次の通りです。

- [NegativeUNLレジャーエントリ][]の`DisabledValidator`フィールド
- [Amendmentsレジャーエントリ][]の`Majorities`配列のメンバー
- マルチシグトランザクションの[`Signers`配列](../docs/references/protocol/transactions/common-fields.md#signers-field)のメンバー
- [SignerListレジャーエントリ][]の`SignerEntries`配列のメンバー
- [XChainBridge][] Amendment {% not-enabled /%}の複数の部分:
    - [XChainOwnedClaimIDレジャーエントリ][]の`XChainClaimAttestations`配列のメンバー
    - [XChainOwnedCreateAccountClaimIDレジャーエントリ][]の`XChainCreateAccountAttestations`配列のメンバー
    - [XChainAddClaimAttestationトランザクション][]の`XChainClaimAttestationBatch`配列のメンバー
    - [XChainAddClaimAttestationトランザクション][]の`XChainCreateAccountAttestationBatch`配列のメンバー

この変更はトランザクション処理に影響を与えないと考えられていますが、不適切にフォーマットされたトランザクションが異なるエラーを受け取るエッジケースが存在する可能性があります。このAmendmentでは、そのようなトランザクションは`temMALFORMED`などの異なる結果コードで失敗します。このAmendmentがない場合、それらのトランザクションは代わりに`tefEXCEPTION`コードで失敗すると予想されます。


### fixInvalidTxFlags
[fixInvalidTxFlags]: #fixinvalidtxflags

| Amendment    | fixInvalidTxFlags |
|:-------------|:------------------|
| Amendment ID | 8EC4304A06AF03BE953EA6EDA494864F6F3F30AA002BABA35869FBB8C6AE5D52 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

Adds flag checks for `CredentialCreate`, `CredentialAccept`, `CredentialDelete`, and `SignerListSet` transactions. With this amendment enabled, these transactions will return a `temINVALID_FLAG` error if they include a flag that doesn't exist, or a contradictory combination of flags.


### fixMasterKeyAsRegularKey
[fixMasterKeyAsRegularKey]: #fixmasterkeyasregularkey

| Amendment    | fixMasterKeyAsRegularKey |
|:-------------|:-------------------------|
| Amendment ID | C4483A1896170C66C098DEA5B0E024309C60DC960DE5F01CD7AF986AA3D9AD37 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

アカウントのレギュラーキーペアがマスターキーペアと一致するように設定できるものの、マスターキーが無効になった場合に、そのキーによって署名されたトランザクションを送信できなくなるバグを修正します。

この修正を適用しない場合、ユーザは、レギュラーキーがマスターキーと一致するように設定し、その後マスターキーを無効にすることで、意図せずアカウントを「ブラックホール」にしてしまうおそれがあります。ネットワークは、マスターキーペアとレギュラーキーペアの両方で署名されたトランザクションを拒否します。コードは、トランザクションが現在有効なレギュラーキーで署名されていると認識する前に、無効なマスターキーで署名されていると解釈するためです。

この修正を有効にした場合、SetRegularKeyトランザクションはレギュラーキーがマスターキーに一致するよう設定できないため、そのようなトランザクションでは、トランザクションコードが`temBAD_REGKEY`になります。また、この修正により、署名検証コードが変更されるため、レギュラーキーがマスターキーに一致するよう_すでに_設定しているアカウントは、そのキーペアを使用して正常にトランザクションを送信できます。


### fixNFTokenDirV1
[fixNFTokenDirV1]: #fixnftokendirv1

| Amendment    | fixNFTokenDirV1 |
|:-------------|:----------------|
| Amendment ID | 0285B7E5E08E1A8E4C15636F0591D87F73CB6A7B6452A932AD72BBC8E5D1CBE3 |
| ステータス     | 廃止 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

この修正では、`NFToken`オブジェクトがどの`NFTokenPage`に属するかを判断する際に、いくつかの特定のケースで発生した境界値判定エラーが修正されました。また、`NFTokenPage`の不変性チェックの制約を調整し、特定のエラーケースが`tecINVARIANT_FAILED`エラーコードで失敗する代わりに、`tecNO_SUITABLE_TOKEN_PAGE`などの適切なエラーコードで失敗するようにしました。

この修正は、[NonFungibleTokensV1][] Amendmentが有効でない限り、何の効果もありません。この修正は、その効果が[NonFungibleTokensV1_1][]の一部として含まれているため、廃止されました。


### fixNFTokenNegOffer
[fixNFTokenNegOffer]: #fixnftokennegoffer

| Amendment    | fixNFTokenNegOffer |
|:-------------|:-------------------|
| Amendment ID | 36799EA497B1369B170805C078AEFE6188345F9B3E324C21E9CA3FF574E3C3D6 |
| ステータス     | 廃止 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

この修正は、[NonFungibleTokensV1][] Amendmentのコードにおいて、NFTが負の金額で取引されてしまうバグを修正したものです。この修正が適用されない場合、ユーザは負の金額でNFTの売買を申し込むことができ、その結果、NFTを「買う」人は「売る」人からお金も受け取ることになります。この修正により、マイナスの金額でのNFTのオファーは無効とみなされます。

この修正は、[NonFungibleTokensV1][] Amendmentが有効でない限り、何の影響もありません。この修正は、その効果が[NonFungibleTokensV1_1][]の一部として含まれているため、廃止されました。


### fixNFTokenPageLinks
[fixNFTokenPageLinks]: #fixnftokenpagelinks

| Amendment    | fixNFTokenPageLinks |
|:-------------|:--------------------|
| Amendment ID | C7981B764EC4439123A86CC7CCBA436E9B3FF73B3F10A0AE51882E404522FC41 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

このAmendmentは、NFTディレクトリのチェーンの途中でリンクが欠落する可能性があるバグを修正します。また、将来同様の破損が発生するのを防ぐための不変性チェックを導入し、新しいトランザクションタイプも追加します。

- [LedgerStateFixトランザクション][]は、レジャーデータの破損を修復するために使用できます。このAmendmentが有効になると、LedgerStateFixトランザクションを使用してNFTディレクトリの破損したリンクを修復できます。将来のバグによって新しいタイプのレジャー破損が発生した場合、このトランザクションタイプを拡張して他のタイプの破損も修復できるようになります。

このAmendmentがない場合、特定の状況下でNFTディレクトリの最後のページを削除し、その後、前のページへのリンクが欠落した新しい最後のページを作成することが可能です。この問題を引き起こす可能性のあるシナリオの詳細な説明については、[PR #4945](https://github.com/XRPLF/rippled/pull/4945)をご覧ください。このAmendmentにより、その破損を引き起こしたバグが修正されます。さらに、新しい不変性チェックにより、他のバグが不適切に最後のページを削除できないようになります。


### fixNFTokenRemint
[fixNFTokenRemint]: #fixnftokenremint

| Amendment    | fixNFTokenRemint |
|:-------------|:-----------------|
| Amendment ID | AE35ABDEFBDE520372B31C957020B34A7A4A9DC3115A69803A44016477C84D6E |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

`fixNFTokenRemint` Amendmentは、同じNFTが同じシーケンス番号で複数回鋳造され、衝突の可能性を生じさせる事態を防ぐため、NFTシーケンス番号の構成方法を変更するものです。このAmendmentにより、NFTシーケンス番号の構成が次のように変更されます。

- `AccountRoot`に、新しいフィールド`FirstNFTSequence`を作成します。このフィールドは口座が最初のNFTを発行したときに現在のアカウントシーケンスに設定されます。それ以外の場合は設定されません。

- `FirstNFTSequence`+`MintedNFTokens`（その後、`MintedNFTokens`は1ずつ増加）として、新しく作成されたNFTのシーケンスを計算します。

このamendmentにより、アカウント削除の制限も導入されます。アカウントは、`FirstNFTSequence` + `MintedNFTokens` + 256が現在のレジャーシーケンスより小さい場合にのみ削除できます（256はアカウント削除のヒューリスティックな制限として選択されたもので、アカウント削除制約にすでに存在します）。この制約がなければ、特定の条件下で同一のNFTが再ミントされる可能性があります。

{% admonition type="warning" name="注意" %}これは、トークンをミントするためにローカルでNFTokenIDを計算しているプロジェクトやツールにとっては **破壊的な変更** です。NFTokenIDを計算するコードがある場合は、新しい計算式に合わせて更新する必要があります。後方互換性を保ちながらこれを行う方法の例については、こちらをご覧ください。[JavaScriptでのよく知られたリファレンス実装](https://gist.github.com/N3TC4T/a20fb528931ed009ebdd708be4938748?permalink_comment_id=4738760#gistcomment-4738760).{% /admonition %}


### fixNFTokenReserve
[fixNFTokenReserve]: #fixnftokenreserve

| Amendment    | fixNFTokenReserve |
|:-------------|:------------------|
| Amendment ID | 03BDC0099C4E14163ADA272C1B6F6FABB448CC3E51F522F978041E4B57D9158C |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

このamendmentにより、`NFTokenAcceptOffer`トランザクタに`OwnerCount`が変更されたかどうかのチェックが追加されます。変更された場合、更新されたオブジェクト数に対して準備金要件が満たされているかどうかを追加でチェックします。


### fixNonFungibleTokensV1_2
[fixNonFungibleTokensV1_2]: #fixnonfungibletokensv1_2

| Amendment    | fixNonFungibleTokensV1_2 |
|:-------------|:-------------------------|
| Amendment ID | 73761231F7F3D94EC3D8C63D91BDD0D89045C6F71B917D1925C01253515A6669 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

`fixNonFungibleTokensV1_2` Amendment は、プルリクエストプロセスを通じて個別に feature/nft-fixes にマージされたバグ修正の組み合わせです。

**バーン不可能なNFTの修正**

現在、NFTは500以上のオファーがあるとバーンすることができません。この制限を取り除くため、この修正では、NFTを焼却する際にちょうど500個のオファーを削除し、残りのオファーはそのままにします。これにより、発行者アカウントが`lsfBurnable`フラグを有効にしたNFTを、オファー数が多いために焼却できない問題が解決されます。

参考: [PR 4346](https://github.com/XRPLF/rippled/pull/4346).

**NFTokenのオファー承認に関する3つの問題の修正**

問題1：アカウントが資金不足という誤った条件により、取引を仲介できない問題を解決する。

問題2：買い手がアカウントの送金手数料をカバーするための資金が不足している問題を解決する。

問題3：トークン発行者が自身のトークンでNFTを売買できるようにする。

参考: [PR 4380](https://github.com/XRPLF/rippled/pull/4380).

**NFTokenの所有者への売却が仲介されないようにする （#4374を修正）**

この修正により、ブローカーが既にトークンを保有しているアカウントに対してNFTを販売することができなくなります。

参考: [Issue 4374](https://github.com/XRPLF/rippled/issues/4374).

**宛先のみがNFTオファーのブローカー決済可能とする (#4373を修正)**

NFTオファーに宛先を設定した場合、その宛先のみが仲介で決済できるように修正します。

参考: [Issue 4373](https://github.com/XRPLF/rippled/issues/4373).


### fixPayChanCancelAfter
[fixPayChanCancelAfter]: #fixpaychancancelafter

| Amendment    | fixPayChanCancelAfter |
|:-------------|:----------------------|
| Amendment ID | D3456A862DC07E382827981CA02E21946E641877F19B8889031CC57FDCAC83E2 |
| ステータス     | 投票中 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

Prevents new payment channels from being created with a `CancelAfter` time that is before the current ledger. Instead, the [PaymentChannelCreate transaction][] fails with the result code `tecEXPIRED`.

Without this amendment, transactions can create a payment channel whose `CancelAfter` time is in the past. This payment channel is automatically removed as expired by the next transaction to affect it.


### fixPayChanRecipientOwnerDir
[fixPayChanRecipientOwnerDir]: #fixpaychanrecipientownerdir

| Amendment    | fixPayChanRecipientOwnerDir |
|:-------------|:----------------------------|
| Amendment ID | 621A0B264970359869E3C0363A899909AAB7A887C8B73519E4ECF952D33258A8 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

[PaymentChannelCreateトランザクション][]タイプを変更し、受取人の[所有者ディレクトリ](../docs/references/protocol/ledger-data/ledger-entry-types/directorynode.md)に新しい[Payment Channel](../docs/concepts/payment-types/payment-channels.md)が追加されるようにします。この修正を適用しない場合、新しいPayment Channelは送金者の所有者ディレクトリーにのみ追加されます。この修正を有効にする場合、新しく作成したPayment Channelは両者の所有者ディレクトリーに追加されます。既存のPayment Channelは変更されません。

この修正により、受取人によるPayment Channelの検索が容易になります。また、アカウントがオープンPayment Channelの受取人だった場合に、そのアカウントが削除されないようにします（ただし、この修正の前に作成されたチャンネルを除きます）。


### fixPreviousTxnID
[fixPreviousTxnID]: #fixprevioustxnid

| Amendment    | fixPreviousTxnID |
|:-------------|:-----------------|
| Amendment ID | 7BB62DC13EC72B775091E9C71BF8CF97E122647693B50C5E87A80DFD6FCFAC50 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

このAmendmentにより、レジャーエントリ`DirectoryNode`、`Amendments`、`FeeSettings`、`NegativeUNL`、および`AMM`に`PreviousTxnID`および`PreviousTxnLgrSequence`フィールドが追加されます。

このAmendmentが有効になる前に作成されたレジャーエントリは、トランザクションがそれらのエントリを変更するたびに新しいフィールドを設定します。

この修正がない場合、一部のレジャーエントリにこれら2つのフィールドがないため、それらのレジャーエントリの変更履歴を追跡することが難しくなります。


### fixQualityUpperBound
[fixQualityUpperBound]: #fixqualityupperbound

| Amendment    | fixQualityUpperBound |
|:-------------|:---------------------|
| Amendment ID | 89308AF3B8B10B7192C4E613E1D2E4D9BA64B2EE2D5232402AE82A6A7220D953 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

クロスカレンシー決済における個々のステップの入出力比を計算するための使用されていないコードのバグを修正する。

この修正は、取引処理に影響を及ぼさないことが確認されています。


### fixReducedOffersV1
[fixReducedOffersV1]: #fixreducedoffersv1

| Amendment    | fixReducedOffersV1 |
|:-------------|:-------------------|
| Amendment ID | 27CD95EE8E1E5A537FF2F89B6CEB7C622E78E9374EBD7DCBEDFAE21CD6F16E0A |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

| Amendment前の機能は廃止? | No |

四捨五入を調整し、残額の四捨五入によって為替レートが影響を受ける減額オファーによってオーダーブックがブロックされることを回避します。

一般的に、オファーは3つの方法で減額することができます：

- オファーは、注文時に部分的に約定することができます。
- オファーはオーダーブックに登録された後、部分的に約定されることがあります。
- オファーは資金不足(オファーの所有者が指定した資金よりも少ない資金しか持っていない状態)になる可能性があります。

このamendmentにより、減額されたオファーの取引レートは、(テイカーの観点から)元のオファーと同等かそれ以上となるように丸められます。これにより、減額されたオファーは、元の全額と一致するオファーによって約定されます。丸められた金額は、XRPの1ドロップまたはトークンの1e-81を超えることはありません。

このamendmentがない場合、残額が非常に少ないオファーは、四捨五入後の取引レートが当初よりも大幅に悪化する可能性があります。このため、非常に少額のオファーが、同じオーダーブック内のより良いオファーの取得を「ブロック」してしまう可能性があります。


### fixReducedOffersV2
[fixReducedOffersV2]: #fixreducedoffersv2

| Amendment    | fixReducedOffersV2 |
|:-------------|:-------------------|
| Amendment ID | 31E0DA76FB8FB527CADCDF0E61CB9C94120966328EFA9DCA202135BAF319C0BA |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

このAmendmentは、「減額された」オファーによってオーダーブックがブロックされる可能性がある特定のケースにおける丸め処理を調整します。これはfixReducedOffersV1 Amendmentと同じ症状に対処するものですが、そのAmendmentでカバーされていなかった追加のケースに対応します。


### fixRemoveNFTokenAutoTrustLine
[fixRemoveNFTokenAutoTrustLine]: #fixremovenftokenautotrustline

| Amendment    | fixRemoveNFTokenAutoTrustLine |
|:-------------|:------------------------------|
| Amendment ID | DF8B4536989BDACE3F934F29423848B9F1D76D09BE6A1FCFE7E7F06AA26ABEAD |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

このフラグを使用した発行者に対するDoS攻撃から保護するために、[非代替性トークン](../docs/concepts/tokens/nfts/index.md)の`tfTrustLine`設定を削除します。このフラグを有効にすると、`tfTrustLine`フラグを有効にした[NFTokenMintトランザクション](../docs/references/protocol/transactions/types/nftokenmint.md)は無効とみなされ、コンセンサスによって検証されません。したがって、`NFToken`オブジェクトはこのフラグを使用してミントをすることができません。

この修正が適用されない場合、攻撃者は意味のない新しい代替可能トークンを作り、そのトークンとNFTを売買することで、発行者に紐づく多数の無駄なトラストラインを作り、発行者の準備金を増加させることができます。

この修正は、すでにミントされた`NFToken`オブジェクトのコードを変更するものではありません。NonFungibleTokensV1_1がすでに有効になっているテストネットワークでは、`tfTrustLine`フラグが有効なNFTokenをすでにミントしている発行者は、fixRemoveNFTokenAutoTrustLine Amendmentの有効後も脆弱性があることを意味しています。

この修正は、[NonFungibleTokensV1][]または [NonFungibleTokensV1_1][]が有効になっていない限り、影響を及ぼしません。発行者を保護するため、このamendmentは[NonFungibleTokensV1][]または[NonFungibleTokensV1_1][]の前に有効にする必要があります。


### fixRmSmallIncreasedQOffers
[fixRmSmallIncreasedQOffers]: #fixrmsmallincreasedqoffers

| Amendment    | fixRmSmallIncreasedQOffers |
|:-------------|:---------------------------|
| Amendment ID | B6B3EEDC0267AB50491FDC450A398AF30DBCD977CECED8BEF2499CAB5DAC19E2 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

この修正は、特定のオファーがほとんど約定された状態で、そのオファーが最初に配置されたときよりも取引レートが大幅に悪化する問題を修正するものです。これは、片方または両方の資産の残額が非常に小さいため、オファーが置かれたときと同様の比率に丸めることができない場合に起こるものです。

この修正が適用されない場合、この状態でのオファーは、よりレートの良いオファーがより深いオーダーブックでブロックされ、本来成功するはずの支払いやオファーが失敗することがあります。

この修正により、決済および取引は、通常、トランザクションが約定済みまたは未約定のオファーを削除するのと同じ方法で、これらのタイプのオファーを削除できるようになります。


### fixSTAmountCanonicalize
[fixSTAmountCanonicalize]: #fixstamountcanonicalize

| Amendment    | fixSTAmountCanonicalize |
|:-------------|:------------------------|
| Amendment ID | 452F5906C46D46F407883344BFDD90E672B672C5E9943DB4891E3A34FEEEB9DB |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

Amount型フィールドの[デシリアライズ](../docs/references/protocol/binary-format.md)におけるエッジケースの問題を修正しました。この修正が適用されない場合、一部の稀なケースで、この操作により、デシリアライズ中に有効なシリアライズされた金額がオーバーフローしてしまう可能性がありました。この修正により、XRP Ledgerはより迅速にエラー状態を検出し、問題となるようなケースを排除します。


### fixTakerDryOfferRemoval
[fixTakerDryOfferRemoval]: #fixtakerdryofferremoval

| Amendment    | fixTakerDryOfferRemoval |
|:-------------|:------------------------|
| Amendment ID | 2CD5286D8D687E98B41102BDD797198E81EA41DF7BD104E6561FEB104EFF2561 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

XRP Ledger内にドライオファーを残す可能性がある[オートブリッジ](../docs/concepts/tokens/decentralized-exchange/autobridging.md)のバグを修正します。ドライオファーとは、オファーを掛け合わせても資金を調達できないオファーのことです。

この修正を行わなければ、ドライオファーがレジャー上に残り、所有者の[必要準備金](../docs/concepts/accounts/reserves.md#所有者準備金)に加算されることになり、所有者に何も利益をもたらしません。正しいタイプとクオリティで掛け合わせた別のオファーによって、ドライオファーを除去することができます。ただし、タイプとクオリティがうまく掛け合わされたオファーがめったにない場合、ドライオファーの除去には時間がかかることがあります。

この修正により、これらのドライオファーがオートブリッジで一致した場合に、XRP Ledgerによって除去されます。


### fixTrustLinesToSelf
[fixTrustLinesToSelf]: #fixtrustlinestoself

| Amendment    | fixTrustLinesToSelf |
|:-------------|:--------------------|
| Amendment ID | F1ED6B4A411D8B872E65B9DCB4C8B100375B0DD3D62D07192E011D6D7F339013 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

この修正により、古いバグにより作成されたアカウントから自身へのトラストラインが2つ削除されます（いずれも2013-05-07のもの）。この修正が有効になると、IDが`2F8F21EFCAFD7ACFB07D5BB04F0D2E18587820C7611305BB674A64EAB0FA71E1`と`326035D5C0560A9DA8636545DD5A1B0DFCFF63E68D491B5522B767BB00564B1A`のトラストラインが存在していれば削除します。削除後、この修正は他に何もしません。

これらのトラストラインを持たないテストネットワークでは、この修正はは何の影響も及ぼしません。


### fixUniversalNumber
[fixUniversalNumber]: #fixuniversalnumber

| Amendment    | fixUniversalNumber |
|:-------------|:-------------------|
| Amendment ID | 2E2FB9CF8A44EB80F4694D38AADAE9B8B7ADAFD2F092E10068E61C98C4F092B0 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

10進浮動小数点演算のコードを簡略化し、統合します。場合によっては、以前のコードよりも精度が若干向上し、最下位桁が以前のコードで計算したときと異なる計算結果になることがあります。この計算結果の違いにより、オファーのランキングや複数の異なるパスを使用する支払い処理など、精密な計算が使用される他のエッジケースにおいて違いが生じる場合があります。
この修正が適用されない場合、コードは引き続き`STAmount`と`IOUAmount`オブジェクトに対して別々の計算を使用し、[自動マーケットメーカー(XLS-30d)](https://github.com/XRPLF/XRPL-Standards/discussions/78)は計算のために新しい3つめの計算方法を使用します。


### fixXChainRewardRounding
[fixXChainRewardRounding]: #fixxchainrewardrounding

| Amendment    | fixXChainRewardRounding |
|:-------------|:------------------------|
| Amendment ID | 2BF037D90E1B676B17592A8AF55E88DB465398B4B597AE46EECEE1399AB05699 |
| ステータス     | 投票中 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

この修正により、クロスチェーン取引の報酬シェアは常に切り捨てられるようになります。これにより、当初意図された動作が維持されます。

このAmendmentがなければ、[XChainBridge][]Amendmentは[fixUniversalNumber][]Amendmentと互換性がありません。この2つのAmendmentが有効になっている場合、トークン金額の中間計算に`Number`型を使用できます。場合によっては、これまで切り捨てられていた値が切り上げられるようになり、クロスチェーン取引における報酬シェアの計算がが意図しない切り上げ処理に変更されます。

このAmendmentにより、意図された丸め動作が復元されます。[XChainBridge][]と[fixUniversalNumber][]の両方のAmendmentも有効になっていない限り、このAmendmentは何も影響を及ぼしません。


### Flow
[Flow]: #flow

| Amendment    | Flow |
|:-------------|:-----|
| Amendment ID | 740352F2412A9909880C23A559FCECEDA3BE2126FED62FC7660D628A06927F11 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

支払い処理エンジンを、より堅固で効率的に作られたFlowエンジンに置き換えます。この新バージョンの支払い処理エンジンは、旧バージョンと同じルールを踏襲しますが、浮動小数点の丸め処理により異なる結果をもたらすことがあります。この修正は[FlowV2](https://xrpl.org/blog/2016/flowv2-vetoed.html) Amendmentに代わるものです。

また、Flowエンジンは、さらなるAmendmentを通じて、支払いエンジンの改善や拡張を容易にします。


### FlowCross
[FlowCross]: #flowcross

| Amendment    | FlowCross |
|:-------------|:----------|
| Amendment ID | 3012E8230864E95A58C60FD61430D7E1B4D3353195F2981DC12B0C7C0950FFAC |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

XRP Ledgerの分散型取引所において、オファーの掛け合わせのロジックを合理化します。[Flow](#flow) Amendmentから更新されたコードを使用してオファーの掛け合わせを行うため、[OfferCreateトランザクション][]と[Paymentトランザクション][]は多くのコードを共有します。オファーの処理方法には微妙な違いがあります。

- 丸め方が一部のケースで少し異なります。
- 丸め方の違いが原因で、一部のオファーの組み合わせのランク付けが以前のロジックより上下したり、優先されたりします。
- 新しいロジックによって、以前のロジックより多めまたは少なめにオファーが削除される場合があります。（これには、丸め方の違いによるケースや、以前のロジックによって資金供給なしとして不正に削除されたオファーが含まれます。）


### FlowSortStrands
[FlowSortStrands]: #flowsortstrands

| Amendment    | FlowSortStrands |
|:-------------|:----------------|
| Amendment ID | AF8DF7465C338AE64B1E937D6C8DA138C0D63AD5134A68792BBBE1F63356C422 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

決済エンジンの計算を改善し、最もコスト効率の良いクロスカレンシー取引の実行方法を見つけます。

この修正が適用されない場合、エンジンは可能な各パスを介して支払いをシミュレートし、各パスの品質（入力と出力の比率）を計算します。この修正により、エンジンは完全な支払いをシミュレートすることなく、各パスの理論的な品質を計算します。この変更により、決済エンジンは一部のクロスカレンシー決済をより速く実行し、より多くのケースで最も費用対効果の高いパスを見つけることができるようになり、従来の決済エンジンでは十分な流動性を見つけることができなかった特定の条件でも、一部の決済を成功させることができるようになります。


### FlowV2
[FlowV2]: #flowv2

| Amendment    | FlowV2 |
|:-------------|:-------|
| Amendment ID | 5CC22CFF2864B020BD79E0E1F048F63EF3594F95E650E43B3F837EF1DF5F4B26 |
| ステータス     | 廃止 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

これは[Flow](#flow) Amendmentの旧バージョンです。[バグが原因で不採用となり](https://xrpl.org/blog/2016/flowv2-vetoed.html)、バージョン0.33.0で除外されました。


### HardenedValidations
[HardenedValidations]: #hardenedvalidations

| Amendment    | HardenedValidations |
|:-------------|:--------------------|
| Amendment ID | 1F4AFA8FA1BC8827AD4C0F682C03A8B671DCDF6B5C4DE36D44243A684103EF88 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

バリデータは、バリデータが完全に検証されたとみなす最新の台帳のハッシュを証明する新しいオプションフィールドをバリデーションに含めることができるようにします。コンセンサスプロセスでは、この情報を使用してコンセンサスの堅牢性を高めることができます。


### Hooks
[Hooks]: #hooks

| Amendment    | Hooks |
|:-------------|:------|
| Amendment ID | ECE6819DBA5DB528F1A241695F5A9811EF99467CDE22510954FD357780BBD078 |
| ステータス     | 開発中 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

トランザクションの前後にアカウント上で実行できる小さなコードという形式で、オンチェーンのスマートコントラクトを追加します。詳細は[Hooksドキュメント （英語のみ）](https://xrpl-hooks.readme.io/)をご覧ください。


### ImmediateOfferKilled
[ImmediateOfferKilled]: #immediateofferkilled

| Amendment    | ImmediateOfferKilled |
|:-------------|:---------------------|
| Amendment ID | 75A7E01C505DD5A179DFE3E000A9B6F1EDDEB55A12F95579A23E15B15DC8BE5A |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

オファーが`tfImmediateOrCancel`を使用し、トランザクション処理で資金を移動せずにオファーを終了した場合、トランザクションは`tesSUCCESS`ではなく結果コード`tecKILLED`を使用するようにOfferCreateトランザクションを変更します。Offerが少額でも資金を交換した場合、トランザクションは引き続き`tesSUCCESS`を使用します。トランザクションの処理自体には変更はありません（例えば、トランザクション処理中に台帳に表示された期限切れのオファーや未入金のオファーをクリーンアップするかどうかという点など）。

この修正が適用されない場合、資金の移動に失敗した「Immediate or Cancel」注文は、結果コード「tesSUCCESS」を返し、そのトランザクションが事実上何もしなかったため、混乱する可能性を残します。


### InvariantsV1_1
[InvariantsV1_1]: #invariantsv1_1

| Amendment    | InvariantsV1_1 |
|:-------------|:---------------|
| Amendment ID | D8ED3BE0B2673496CB49DE8B5588C8805DF7B1DE203F38FE0367ACE703D36C0F |
| ステータス     | 開発中 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

このAmendmentは、トランザクション処理におけるバグからレジャーを保護するために、いくつかの新しい不変性チェックを追加します。開発者は、複数の不変性チェックが実装された後、投票のために開放することを意図しています。含まれる不変性は次の通りです。

- アカウントを削除する際、そのアカウントの`DirectoryNode`、`SignerList`、`NFTokenPage`、`AMM`ディレクトリなど、特定のタイプのレジャーエントリも一緒に削除されることを確認します。


### MPTokensV1
[MPTokensV1]: #mptokensv1

| Amendment    | MPTokensV1 |
|:-------------|:-----------|
| Amendment ID | 950AE2EA4654E47F04AA8739C0B214E242097E802FD372D24047A89AB1F5EC38 |
| ステータス     | 投票中 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

_Multi-Purpose Token(MPT)_ と呼ばれる新しいタイプの代替可能トークンを実装します。このトークンタイプは、ステーブルコインなどの一般的なトークンのユースケースに最適化されており、双方向のトラストラインに保存されるXRP Ledgerの既存の代替可能トークンに固有の複雑さを回避することを目的としています。このAmendmentは次のものを追加します。

**新しいレジャーエントリタイプ：**

- MPToken - 特定のアカウントが保有するトークンを表し、保有量と発行者の情報を含みます。
- MPTokenIssuance - MPTの特定の発行に関する情報と設定（スケールや送金手数料など）を記録します。

**トランザクションタイプ：**

- (新規) MPTokenIssuanceCreate - MPTの新しい発行を定義します。
- (新規) MPTokenIssuanceDestroy - MPTの発行定義を削除します。
- (新規) MPTokenIssuanceSet - MPTの発行定義を変更します。
- (新規) MPTokenAuthorize - アカウントが特定のMPTを保持することを許可します。
- (更新) [Paymentトランザクション][]でもMPTを送信できます。
- (更新) 発行定義でクローバックが許可されている場合、[Clawbackトランザクション][]でMPTのClawbackも可能です。

**APIメソッド：**

- (新規) `mpt_holders`メソッド - 特定のMPT発行を保有するアカウントのリストを返します。
- (更新) `ledger_entry`メソッド - MPTokenとMPTokenIssuanceのレジャーエントリタイプを検索できます。


### MultiSign
[MultiSign]: #multisign

| Amendment    | MultiSign |
|:-------------|:----------|
| Amendment ID | 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | はい |

トランザクションの承認方法として[マルチシグ](../docs/concepts/accounts/multi-signing.md)を導入します。[`SignerList`レジャーオブジェクトタイプ](../docs/references/protocol/ledger-data/ledger-entry-types/signerlist.md)と[`SignerListSet`トランザクションタイプ](../docs/references/protocol/transactions/types/signerlistset.md)を作成します。省略可能な`Signers`フィールドをすべてのトランザクションタイプに追加します。一部のトランザクション結果コードを変更します。

この修正により、マルチシグのアドレスからトランザクションを承認できる署名者のリストをそのアドレスに保持できるようになります。このリストには定数があり、1から8で重み付けされた署名者が記載されています。これにより、「5人のうち任意の3人」や「Aの署名とその他任意の2人の署名」などの多様な設定が可能になります。

署名者は資金供給のあるアドレスでも資金供給のないアドレスでも可能です。署名者リストのうち資金供給のあるアドレスは、レギュラーキー（定義済みの場合）またはマスターキー（無効でない場合）を使用して署名できます。資金供給のないアドレスは、マスターキーを使用して署名できます。マルチシグトランザクションは、レギュラーキーで署名されたトランザクションと同じ権限を持ちます。

SignerListを持つアドレスは、レギュラーキーが定義されていなくてもマスターキーを無効にすることができます。また、SignerListを持つアドレスは、マスターキーが無効な場合でもレギュラーキーを削除することができます。`tecMASTER_DISABLED`トランザクション結果コードは`tecNO_ALTERNATIVE_KEY`に名前が変更されます。`tecNO_REGULAR_KEY`トランザクション結果コードは廃止となり、`tecNO_ALTERNATIVE_KEY`に代わります。さらに、この修正は以下の新しい[トランザクション結果コード](../docs/references/protocol/transactions/transaction-results/index.md)を追加します。

* `temBAD_SIGNER`
* `temBAD_QUORUM`
* `temBAD_WEIGHT`
* `tefBAD_SIGNATURE`
* `tefBAD_QUORUM`
* `tefNOT_MULTI_SIGNING`
* `tefBAD_AUTH_MASTER`


### MultiSignReserve
[MultiSignReserve]: #multisignreserve

| Amendment    | MultiSignReserve |
|:-------------|:-----------------|
| Amendment ID | 586480873651E106F1D6339B0C4A8945BA705A777F3F4524626FF1FC07EFE41D |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

XRP Ledgerアカウントが[マルチシグ](../docs/concepts/accounts/multi-signing.md)SignerListを所有する場合、アカウントに加算される[所有者準備金](../docs/concepts/accounts/reserves.md#所有者準備金)を削減します。

この修正を行わない場合、SignerListの所有者準備金は、リスト内の署名者数に応じて15～50XRPの範囲となります。

この修正により、新しいSignerListの所有者準備金は、署名者数に関係なく5XRPとなります。以前に作成されたSignerListオブジェクトの準備金は、そのまま変更されません。この修正の後に作成されたSignerListオブジェクトの準備金を削減するには、この修正実施後に、[SignerListSetトランザクション](../docs/references/protocol/transactions/types/signerlistset.md)を使用してSignerListを置き換えます。（この置き換えは、前のバージョンの場合とまったく同じです。）


### NegativeUNL
[NegativeUNL]: #negativeunl

| Amendment    | NegativeUNL |
|:-------------|:------------|
| Amendment ID | B4E4F5D2D6FB84DF7399960A732309C9FD530EAE5941838160042833625A6076 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

ネットワークがどのバリデータが一時的にオフラインになったかを追跡し、定足数計算の際にそれらのバリデータを無視できる「ネガティブUNL」システムを実装します。これにより、ネットワークが不安定な状態でも、ネットワークを進展させる能力を高めることができます。


### NFTokenMintOffer
[NFTokenMintOffer]: #nftokenmintoffer

| Amendment    | NFTokenMintOffer |
|:-------------|:-----------------|
| Amendment ID | EE3CF852F0506782D05E65D49E5DCC3D16D50898CD1B646BAE274863401CC3CE |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

NFTの発行処理を変更し、同時にトークンの売却オファーも作成できるようにします。

このAmendmentにより、[NFTokenMintトランザクション][]でミントしたトークンの売却オファーを同時に出すことができます。これにより、トランザクションに3つのオプションフィールドが追加され、これらを提供するとNFTの売却オファーを定義できます。

- `Amount` - NFTの売却価格
- `Destination` - このアカウントのみが受け入れ可能となるように販売を制限
- `Expiration` - この売却オファーが期限切れとなる時間

このAmendmentがない場合、NFTをミントした後に売却オファーを出すには、別途[NFTokenCreateOfferトランザクション][]を送信する必要があります。


### NonFungibleTokensV1
[NonFungibleTokensV1]: #nonfungibletokensv1

| Amendment    | NonFungibleTokensV1 |
|:-------------|:--------------------|
| Amendment ID | 3C43D9A973AA4443EF3FC38E42DD306160FBFFDAB901CD8BAA15D09F2597EB87 |
| ステータス     | 廃止 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

非代替性トークンのネイティブサポートを追加します。標準規格案: [XLS-20d](https://github.com/XRPLF/XRPL-Standards/discussions/46)。

{% admonition type="warning" name="注意" %}この修正には、台帳に`tecINVARIANT_FAILED`エラーが表示される問題を含む、いくつかの既知の問題が存在します。これは[NonFungibleTokensV1_1 Amendment][]に置き換えられました。{% /admonition %}

この修正では、新たに5種類のトランザクションが追加されます。

- [NFTokenAcceptOffer][]
- [NFTokenBurn][]
- [NFTokenCancelOffer][]
- [NFTokenCreateOffer][]
- [NFTokenMint][]

また、新たに2種類の台帳オブジェクトが追加されます。

- [NFTokenOfferオブジェクト][]
- [NFTokenPageオブジェクト][]

さらに、[AccountRootオブジェクト][]型を変更し、`MintedNFTokens`、`BurnedNFTokens`、`NFTokenMinter`の3つの新しい任意のフィールドを追加しています。

また、[AccountSetトランザクション][]を変更し、`NFTokenMinter`フィールドを設定できるようにしました。


### NonFungibleTokensV1_1
[NonFungibleTokensV1_1]: #nonfungibletokensv1_1

| Amendment    | NonFungibleTokensV1_1 |
|:-------------|:----------------------|
| Amendment ID | 32A122F1352A4C7B3A6D790362CC34749C5E57FCE896377BFDC6CCD14F6CD627 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

[NonFungibleTokensV1][]の後に発見されたいくつかの問題の修正を含む[非代替性トークン](../docs/concepts/tokens/nfts/index.md)のネイティブサポートを追加します。

この修正は、以下の修正内容を統合し、個々のAmendmentsを廃止するものです。

- [NonFungibleTokensV1][]
- [fixNFTokenNegOffer][]
- [fixNFTokenDirV1][]

それ以外の影響はありません。

{% admonition type="warning" name="注意" %}[fixRemoveNFTokenAutoTrustLine][]は、このAmendmentの既知の問題を修正します。新しいテストネットワークを作成する場合、これらの修正を一緒に有効にするか、またはAmendmentの修正を先に有効にする必要があります。{% /admonition %}


### OwnerPaysFee
[OwnerPaysFee]: #ownerpaysfee

| Amendment    | OwnerPaysFee |
|:-------------|:-------------|
| Amendment ID | 9178256A980A86CF3D70D0260A7DA6402AAFE43632FDBCB88037978404188871 |
| ステータス     | 開発中 |
| デフォルトの投票(最新の安定版) | 非該当 |
| Amendment前の機能は廃止? | いいえ |

[OfferCreate](../docs/references/protocol/transactions/types/offercreate.md)トランザクションタイプと[Payment](../docs/references/protocol/transactions/types/payment.md)トランザクションタイプで、[送金手数料](../docs/concepts/tokens/fungible-tokens/transfer-fees.md)の計算方法に相違があるのを修正します。この修正を行わない場合、オファーがオファープレースメントで実行される際にイシュアンスの保有者が送金手数料を支払いますが、トランザクションの最初の送信者は支払い処理の過程で実行されるオファーの送金手数料を支払います。この修正により、オファーがPaymentトランザクションまたはOfferCreateトランザクションの一部として実行されるかどうかにかかわらず、イシュアンスの保有者が常に送金手数料を支払います。支払い以外のオファー処理は影響を受けません。

この修正については、[Flow Amendment](#flow)を有効にする必要があります。

{% admonition type="info" name="注記" %}不完全なバージョンのこのAmendmentについては、v0.33.0で導入され、v0.80.0で削除されました（有効となったことはありません）。{% /admonition %}


### PayChan
[PayChan]: #paychan

| Amendment    | PayChan |
|:-------------|:--------|
| Amendment ID | 08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | はい |

XRPの「Payment Channel」を作成します。Payment Channelは、2名の当事者間で一方向の繰り返しの支払い、またはそれに伴う一時的な貸付を容易に行えるようにするツールです。Rippleは、この機能が[Interledger Protocol](https://interledger.org/)に役立つと期待しています。ある当事者がPayment Channelを作成し、そのチャンネル内に有効期限を事前に設定してXRPをいくらか確保します。次に、レジャー外部の安全な通信を介して、送信者は「クレーム」メッセージを受信者に送信できます。受信者は有効期限の終了前にクレームメッセージを清算することも、支払いが必要ない場合は清算しないことも選択できます。受信者は、クレームを実際にネットワークに分散させてコンセンサスプロセスで清算されるのを待たなくとも、請求を個々に確認してから、有効期限内であれば多数の少額クレームをまとめて後で清算することができます。

新たに作成するトランザクションタイプは次の3つです。[PaymentChannelCreate][]、[PaymentChannelClaim][]、[PaymentChannelFund][]。新たに作成するレジャーオブジェクトタイプは[PayChannel](../docs/references/protocol/ledger-data/ledger-entry-types/paychannel.md)です。レジャー外のデータ構造`Claim`を定義し、ChannelClaimトランザクションに使用します。新たに作成する`rippled`APIメソッドは次のとおりです。[`channel_authorize`](../docs/references/http-websocket-apis/public-api-methods/payment-channel-methods/channel_authorize.md)（署名されたクレームを作成します）、[`channel_verify`](../docs/references/http-websocket-apis/public-api-methods/payment-channel-methods/channel_verify.md)（署名されたクレームを検証します）、[`account_channels`](../docs/references/http-websocket-apis/public-api-methods/account-methods/account_channels.md)（アカウントに関連するチャンネルをリストを作成します）。

詳細は、[Payment Channelsのチュートリアル](../docs/tutorials/how-tos/use-specialized-payment-types/use-payment-channels/index.md)をご覧ください。


### PermissionDelegation
[PermissionDelegation]: #permissiondelegation

| Amendment    | PermissionDelegation |
|:-------------|:---------------------|
| Amendment ID | AE6AB9028EEB7299EBB03C7CBCC3F2A4F5FBE00EA28B8223AA3118A0B436C1C5 |
| ステータス     | 投票中 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

Allows accounts to delegate some permissions to other accounts.

Specification: [XLS-75](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0075d-permission-delegation).


### PermissionedDEX
[PermissionedDEX]: #permissioneddex

| Amendment    | PermissionedDEX |
|:-------------|:----------------|
| Amendment ID | 677E401A423E3708363A36BA8B3A7D019D21AC5ABD00387BDBEA6BDE4C91247E |
| ステータス     | 投票中 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

Creates Permissioned DEXes, controlled environments for trading within the XRP Ledger's [decentralized exchange (DEX)](/docs/concepts/tokens/decentralized-exchange). Trading in a permissioned DEX works like trading in the open DEX, except that a permissioned domain controls who can place and accept offers.

Specification: [XLS-81](https://github.com/XRPLF/XRPL-Standards/pull/281)


### PermissionedDomains
[PermissionedDomains]: #permissioneddomains

| Amendment    | PermissionedDomains |
|:-------------|:--------------------|
| Amendment ID | A730EB18A9D4BB52502C898589558B4CCEB4BE10044500EE5581137A2E80E849 |
| ステータス     | 投票中 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

Permissioned domains are controlled environments within the broader ecosystem of the XRP Ledger blockchain. Domains do nothing on their own, but features such as Permissioned DEXes and Lending Protocols can use domains to restrict access, so that traditional financial institutions can offer services on chain while complying with various compliance rules.

This amendment creates a new ledger entry type, `PermissionedDomain`, and new transactions, `PermissionedDomainSet` (creates or modifies permissioned domains) and `PermissionedDomainDelete` (deletes permissioned domains).


### PriceOracle
[PriceOracle]: #priceoracle

| Amendment    | PriceOracle |
|:-------------|:------------|
| Amendment ID | 96FD2F293A519AE1DB6F8BED23E4AD9119342DA7CB6BAFD00953D16C54205D8B |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

この修正により、[XLS-47規格]（https://github.com/XRPLF/XRPL-Standards/blob/master/XLS-0047-PriceOracles/README.md）で定義されているとおり、XRPLedgerに「価格オラクル」機能が追加されます。ブロックチェーン・オラクルとは、外部世界に関する情報をブロックチェーンに提供するサービスであり、主にブロックチェーン上で、またはブロックチェーンを使用して実行される分散型アプリケーション（dApps）が利用できるシステムです。この価格オラクルは、XRP Ledgerの外に存在する資産ペアの価格情報を保存し、XRP Ledgerに依存するスマートコントラクトがこの情報を利用できるようにすることを目的としています。

このAmendmentにより、新しいレジャーエントリタイプ`PriceOracle`と新しいトランザクション`OracleSet`(オラクルデータの作成または変更)および`OracleDelete`(指定されたオラクルの削除)が作成されます。


### RequireFullyCanonicalSig
[RequireFullyCanonicalSig]: #requirefullycanonicalsig

| Amendment    | RequireFullyCanonicalSig |
|:-------------|:-------------------------|
| Amendment ID | 00C1FC4A53E60AB02C864641002B3172F38677E29C26C5406685179B37E1EDAC |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

XRP Ledgerプロトコルの署名要件を変更し、いかなる場合にも完全に正規でない署名は無効とします。これにより、[tfFullyCanonicalSigフラグ](../docs/references/protocol/transactions/common-fields.md#グローバルフラグ)を有効にしたトランザクションのみを保護することに代わって、_すべての_ トランザクションにおいて[トランザクションの展性](../docs/concepts/transactions/finality-of-results/transaction-malleability.md)から守られます。

この修正が適用されない場合、トランザクションがsecp256k1署名を使用し、tfFullyCanonicalSigが有効でない場合は、変更可能となります。ほとんどの署名ユーティリティは、デフォルトでtfFullyCanonicalSigを有効にしていますが、例外もあります。

この修正により、単独署名のトランザクションは展性になりません。(署名者が必要以上の署名を提供した場合、[マルチシグのトランザクションはまだ展性であるかもしれません](../docs/concepts/transactions/finality-of-results/transaction-malleability.md#マルチシグの展性))。すべてのトランザクションは、tfFullyCanonicalSigフラグに関係なく、署名の完全な正規の形式を使用する必要があります。完全に正規化された署名を作成しない署名ユーティリティはサポートされていません。Ripple社が提供するすべての署名ユーティリティは、少なくとも2014年以降、完全に正規化された署名のみを提供するようになっています。

詳しくは、[`rippled` issue #3042](https://github.com/XRPLF/rippled/issues/3042)をご覧ください。


### SHAMapV2
[SHAMapV2]: #shamapv2

| Amendment    | SHAMapV2 |
|:-------------|:---------|
| Amendment ID | C6970A8B603D8778783B61C0D445C23D1633CCFAEF0D43E7DBCD1521D34BD7C3 |
| ステータス     | 廃止 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

`rippled`がレジャーを表示する際に使用するハッシュツリー構造を変更します。新しい構造は以前のバージョンよりもコンパクトで効率的です。この修正はレジャーハッシュの計算方法が変わりますが、その他にユーザに与える影響はありません。

この修正が適用されると、ネットワークでハッシュツリー構造への変更を計算している間、XRP Ledgerはしばらく使用できなくなります。


### SingleAssetVault
[SingleAssetVault]: #singleassetvault

| Amendment    | SingleAssetVault |
|:-------------|:-----------------|
| Amendment ID | 81BD2619B6B3C8625AC5D0BC01DE17F06C3F0AB95C7C87C93715B87A4FD240D8 |
| ステータス     | 開発中 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

Creates a structure for aggregating assets from multiple depositors. This is intended to be used with the proposed on-chain Lending Protocol.

Specification: [XLS-65](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0065d-single-asset-vault).


### SortedDirectories
[SortedDirectories]: #sorteddirectories

| Amendment    | SortedDirectories |
|:-------------|:------------------|
| Amendment ID | CC5ABAE4F3EC92E94A59B1908C2BE82D2228B6485C00AFF8F22DF930D89C194E |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | はい |

[DirectoryNodeレジャーオブジェクト](../docs/references/protocol/ledger-data/ledger-entry-types/directorynode.md)内の項目をソートして、削除されるべき所有者ディレクトリのページが場合によっては削除されないというバグを修正します。

{% admonition type="danger" name="警告" %}このが適用されていない旧バージョンの`rippled`は、新しいルールでソートされたDirectoryNodeによって機能が停止するおそれがあります。この問題を回避するには、`rippled`バージョン0.80.0以降に[アップグレード](../docs/infrastructure/installation/index.md)してください。{% /admonition %}


### SusPay
[SusPay]: #suspay

| Amendment    | SusPay |
|:-------------|:-------|
| Amendment ID | DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13 |
| ステータス     | 廃止 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

この修正は、[Escrow](../docs/references/protocol/ledger-data/ledger-entry-types/escrow.md) Amendmentに置き換えられました。


### TicketBatch
[TicketBatch]: #ticketbatch

| Amendment    | TicketBatch |
|:-------------|:------------|
| Amendment ID | 955DF3FA5891195A9DAEFA1DDC6BB244B545DDE1BAA84CBB25D5F12A8DA68A0C |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | いいえ |

この修正により、通常のシーケンス番号順ではないトランザクションを送信する方法として、[Tickets](../docs/references/protocol/ledger-data/ledger-entry-types/ticket.md)が追加されます。

標準規格案: [XLS-13d](https://github.com/XRPLF/XRPL-Standards/issues/16).


### Tickets
[Tickets]: #tickets

| Amendment    | Tickets |
|:-------------|:--------|
| Amendment ID | C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490 |
| ステータス     | 廃止 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

この修正は、[TicketBatch][] Amendmentに置き換えられました。


### TickSize
[TickSize]: #ticksize

| Amendment    | TickSize |
|:-------------|:---------|
| Amendment ID | 532651B4FD58DF8922A49BA101AB3E996E5BFBF95A913B3E392504863E63B164 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | はい |

オーダーブック内で[オファー](../docs/concepts/tokens/decentralized-exchange/offers.md#オファーのライフサイクル)をランク付けする方法を変更して、通貨発行者がオファーを為替レートでランク付けする際に考慮する有効桁数を設定できるようにします。この修正により、オファーの交換レートが設定された有効桁数に丸められるため、同じ交換レートを持つオファーが増加します。この修正の目的は、以前のオファーよりもランク付けを高くするには、価格面で意味のある改善をしなければならないようにすることです。主要な発行者がこれを採用すれば、既存のオファーよりわずかなパーセンテージだけ上回るオファーでレジャーを攻撃しようとするスパムが低減します。また、よりバラツキの少ない為替レートでオファーをグループ化できるため、レジャー内のオーダーブックを効率的に保管できます。

アカウントに`TickSize`フィールドを追加します。このフィールドは[AccountSetトランザクションタイプ](../docs/references/protocol/transactions/types/accountset.md)を使用して設定できます。通貨発行者が`TickSize`フィールドを設定すれば、発行者の通貨を取引するオファーの為替レート（資金の入出金率）がXRP Ledgerによって丸められ、丸められた為替レートに合わせてオファーの金額が調整されます。トランザクションにて1つの通貨にのみ`TickSize`が設定されていれば、その有効桁数が適用されます。異なる`TickSize`値が設定された2つの通貨を取引する場合は、有効桁数が最も小さい`TickSize`が適用されます。XRPに`TickSize`は設定されません。


### TokenEscrow
[TokenEscrow]: #tokenescrow

| Amendment    | TokenEscrow |
|:-------------|:------------|
| Amendment ID | 138B968F25822EFBF54C00F97031221C47B1EAB8321D93C7C2AEAF85F04EC5DF |
| ステータス     | 投票中 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

Extends the existing Escrow functionality to support escrowing issued tokens or MPTs.

Specification: [XLS-85](https://github.com/XRPLF/XRPL-Standards/pull/272/)


### TrustSetAuth
[TrustSetAuth]: #trustsetauth

| Amendment    | TrustSetAuth |
|:-------------|:-------------|
| Amendment ID | 6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | はい |
| Amendment前の機能は廃止? | はい |

[承認されたトラストライン](../docs/concepts/tokens/fungible-tokens/authorized-trust-lines.md)を使用する場合に、会計関係の事前承認（ゼロバランストラストライン）を許可します。

この修正が適用されれば、[`tfSetfAuth`を有効にした](../docs/references/protocol/transactions/types/trustset.md#trustsetのフラグ)`TrustSet`トランザクションにおいて、`RippleState`ノードの他のすべての値をデフォルト状態にしたままでも、新しい[`RippleState`レジャーオブジェクト](../docs/references/protocol/ledger-data/ledger-entry-types/ripplestate.md)を作成できます。新しい`RippleState`ノードでは、トランザクションの送信者が低いノードと見なされるか高いノードと見なされるかに応じて、[`lsfLowAuth`フラグまたは`lsfHighAuth`フラグ](../docs/references/protocol/ledger-data/ledger-entry-types/ripplestate.md#ripplestateのフラグ)が有効になります。トランザクションの送信者は、[asfRequireAuthフラグを有効](../docs/references/protocol/transactions/types/accountset.md#accountsetのフラグ)にして[AccountSetトランザクション](../docs/references/protocol/transactions/types/accountset.md)を送信することで、事前に[`lsfRequireAuth`](../docs/references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountrootのフラグ)を有効にしておく必要があります。


### XChainBridge
[XChainBridge]: #xchainbridge

| Amendment    | XChainBridge |
|:-------------|:-------------|
| Amendment ID | C98D98EE9616ACD36E81FDEB8D41D349BF5F1B41DD64A0ABC1FE9AA5EA267E9C |
| ステータス     | 投票中 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

クロスチェーンブリッジを追加し、メインネットとサイドチェーンなどのネットワーク間でのデジタル資産の移動を可能にします。
標準規格草案： [XLS-38 Cross-Chain Bridge](https://github.com/XRPLF/XRPL-Standards/blob/master/XLS-0038-cross-chain-bridge/README.md)。

次の新しいトランザクションを追加します

- XChainAccountCreateCommit - 発行チェーン上でトランザクションを提出するために、Witnessサーバ用の新しいアカウントを作成します。
- XChainAddAccountCreateAttestation - Witnessサーバが使用するアカウントが作成されたことを証明します。
- XChainAddClaimAttestation - ロックチェーンで資産がロックされた証明書を提出します。
- XChainClaim - 送信先チェーンで資産を請求します。
- XChainCommit - ロックチェーン上の資産をロックします。
- XChainCreateBridge - Bridgeレジャーオブジェクトを作成します。
- XChainCreateClaimID - クロスチェーン送金に使用される新しいクロスチェーン請求IDを作成します。
- XChainModifyBridge - ブリッジのパラメータを変更します。

次の新しいレジャーエントリタイプを追加します

- Bridge - XRP Ledgerを別のブロックチェーンと接続する単一のクロスチェーンブリッジ。
- XChainOwnedClaimID - 送信元チェーン上の資金をロックまたはバーンする送信元チェーン上のアカウントの情報を含むクロスチェーン送金の値(ID)。
- XChainOwnedCreateAccountClaimID - クロスチェーン送金でアカウントを作成する際の証明書。

いくつかの新しいトランザクション結果コードを追加します。



メインネットとサイドチェーンなど異なるネットワーク間でアセットを同期させるための「クロスチェーンブリッジ」を追加します。標準規格草案： [XLS-0038 Cross-Chain Bridge](https://github.com/XRPLF/XRPL-Standards/blob/master/XLS-0038-cross-chain-bridge/README.md)。


### XRPFees
[XRPFees]: #xrpfees

| Amendment    | XRPFees |
|:-------------|:--------|
| Amendment ID | 93E516234E35E08CA689FA33A6D38E103881F8DCB53023F728C307AA89D515A7 |
| ステータス     | 有効 |
| デフォルトの投票(最新の安定版) | いいえ |
| Amendment前の機能は廃止? | いいえ |

トランザクションコストの計算を簡素化し、「手数料単位」で間接的に計算し、結果をXRPに変換するのではなく、直接XRPを使用するようにしました。プロトコルや台帳データにおける「手数料単位」のインスタンスを全て変更し、XRPの代わりにdropsを使用するように修正します。修正には以下を含みます。

- Fee Votingプロトコルを更新し、XRPのdropsを使用するように変更します。
- FeeSettingsの台帳の項目タイプを変更します。`BaseFee`、`ReferenceFeeUnits`、`ReserveBase`、`ReserveIncrement`フィールドを`BaseFeeDrops`、`ReserveBaseDrops`、`ReserveIncrementDrops`に置き換えます。
- SetFee トランザクションタイプを変更します。`BaseFee`、`ReferenceFeeUnits`、`ReserveBase`、`ReserveIncrement`フィールドを`BaseFeeDrops`、`ReserveBaseDrops`、`ReserveIncrementDrops`に置き換えます。

このAmendmentがなければ、トランザクションの形式と台帳の項目は同一です。



{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
