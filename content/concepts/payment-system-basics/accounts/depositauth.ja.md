# Deposit Authorization

_（[DepositAuth Amendment][]が必要です。）_

Deposit Authorization は、XRP Ledgerの[アカウント](accounts.html)のオプション機能です。Deposit Authorizationが有効な場合、トランザクションはそのトランザクションの送信者がアカウント自体でない限り、アカウントへはどのような資産も送信できません。これには、XRPと発行済み通貨の送金が含まれます。

デフォルトでは、新しいアカウントではDepositAuthが無効になっています。

## 背景

金融サービスの規制やライセンスによっては、企業や組織に対して、受領するすべてのトランザクションの送信者を把握するよう義務付けています。これは、自由に生成できる偽名で参加者を識別し、デフォルトですべてのアドレスからあらゆる宛先への支払いを可能とするXRP Ledgerのような分散型システムとっては課題となります。

Deposit Authorizationフラグにより、XRP Ledgerを使用するユーザーが分散型レジャーの基本的な特性を変えずにこのような規制に準拠するためのオプションを採用しました。Deposit Authorizationが有効な場合、アカウントはトランザクションを送信することで明示的に承認した資金のみを受領できます。Deposit Authorizationを使用するアカウントの所有者は、アカウントに資金を入金するトランザクションを送信する _前に_ 、資金の送金元の確認に必要なデューディリジェンス（確認調査）を実施できます。

Deposit Authorizationを有効にすると、[Checks](known-amendments.html#checks)、[Escrow](escrow.html)、および[Payment Channel](known-amendments.html#paychan)から資金を受領できます。このような「二段階」トランザクションモデルでは、最初に送金元は資金の送金を承認するトランザクションを送信し、次に送金先は資金受領を承認するトランザクションを送信します。

Deposit Authorizationが有効になっている場合に[Paymentトランザクション][]から資金を受領するには、このような支払の送金元を[事前承認](#事前承認)する必要があります。_（[DepositPreauth Amendment][]が必要です。）_

## 推奨される使い方

Deposit Authorizationを最大限に活用するため、以下の実施を推奨します。

- XRP残高が常に最低[必要準備金](reserves.html)を上回るようにする。
- DefaultRippleフラグをデフォルトの状態（無効）にしておく。トラストラインに対して[Rippling](rippling.html)を有効にしない。TrustSetトランザクションを送信するときには常に[`tfSetNoRipple`フラグ](trustset.html)を使用する。
- [オファー](offercreate.html)を行わない。このようなトランザクションの実行にあたり、消費される一致オファーを事前に把握することは不可能です。

## 詳細なセマンティクス

Deposit Authorizationが有効化されているアカウントの特徴は次のとおりです。

- [Paymentトランザクション][]の送信先には**できません**。ただし**以下の例外**は除きます。
    - 送金先により、支払の送金元が[事前承認](#事前承認)されている場合。_（[DepositPreauth Amendment][]が必要です）_
    - アカウントのXRP残高がアカウントの最低[必要準備金](reserves.html)以下で、XRP PaymentのAmountがアカウントの最低準備金（現時点では20 XRP）以下である場合は、このアカウントを送金先に指定できます。これにより、アカウントがトランザクションを送信することも、XRPを受領することもできずに操作不可能な状態になるのを防ぎます。この場合、アカウントの所有者の準備金は関係ありません。
- **以下に該当する場合にのみ**[PaymentChannelClaimトランザクション][]からXRPを受領できます。
    - PaymentChannelClaimトランザクションの送金元がPayment Channelの送金先である場合。
    - PaymentChannelClaimトランザクションの送金先がPaymentChannelClaimの送金元を[事前承認している](#事前承認)場合。_（[DepositPreauth Amendment][]が必要です）_
- **以下に該当する場合にのみ**[EscrowFinishトランザクション][]からXRPを受領できます。
    - EscrowFinishトランザクションの送金元がEscrowの送金先である場合。
    - EscrowFinishトランザクションの送金先がEscrowFinishの送金元を[事前承認している](#事前承認)場合。_（[DepositPreauth Amendment][]が必要です）_
- [CheckCash][]トランザクションを送信してXRPまたは発行済み通貨を受領**できます**。 _（[Checks Amendment][]が必要です:有効ではありません:）_
- [OfferCreateトランザクション][]を送信してXRPまたは発行済み通貨を受領**できます**。
    - 即時には完全に実行されないOfferCreateトランザクションがアカウントから送信される場合、このアカウントは、後でオファーが他のアカウントの[Payment][]トランザクションと[OfferCreate][]トランザクションによって消費される時点で、注文済みXRPと発行済み通貨のリマインダーを受信する**ことがあります**。
- アカウントが[NoRippleフラグ](rippling.html)を有効にせずにトラストラインを作成している場合、またはDefaultRippleフラグを有効にして通貨を発行した場合は、アカウントはRipplingの結果として、[Paymentトランザクション][]でそれらのトラストラインの発行済み通貨を受領**できます**。このようなトランザクションの送金先にすることはできません。
- 一般的に、以下のすべての条件に該当する場合は、XRP LedgerのアカウントはXRP LedgerでXRP以外の通貨を受領**できません**。（このルールは、DepositAuthフラグに特有のものではありません。）
    - アカウントにより、ゼロ以外の限度を指定したトラストラインが作成されていない。
    - アカウントが、その他のアカウントにより作成されたトラストラインで通貨を発行していない。
    - アカウントがまだオファーを出していない。

以下の表に、トランザクションタイプ別にDepositAuthが有効または無効な状態での入金の可否をまとめました。

{% include '_snippets/depositauth-semantics-table.html' %}
<!--{#_ #}-->


## Deposit Authorizationの有効化または無効化

アカウントのDeposit Authorizationを有効にするには、`SetFlag`フィールドに`asfDepositAuth`の値（9）を設定した[AccountSetトランザクション][]を送信します。アカウントのDeposit Authorizationを無効にするには、`ClearFlag`フィールドに`asfDepositAuth`の値（9）を設定した[AccountSetトランザクション][]を送信します。AccountSetフラグについての詳細は、[AccountSetフラグ](accountset.html)を参照してください。

## AccountのDepositAuthの有効化の確認

アカウントのDeposit Authorizationの有効化の状態を確認するには、[account_infoメソッド][]を使用してアカウントを調べます。`Flags`フィールド（`result.account_data`オブジェクト）の値を、[AccountRootレジャーオブジェクトのビット単位フラグ](accountroot.html)と比較します。

`Flags`値と`lsfDepositAuth`フラグ値（0x01000000）のビット単位のANDの結果がゼロ以外の場合、アカウントではDepositAuthが有効になっています。結果がゼロの場合、アカウントではDepositAuthが無効になっています。

## 事前承認

_（[DepositPreauth Amendment][]が必要です。）_

DepositAuthが有効なアカウントは、特定の送金元を _事前承認_ することにより、DepositAuthが有効になっていても、これらの送金元からの支払を受領することができます。これにより、特定の送金元からの資金の直接送金が可能となり、受取人はトランザクションごとに個別にアクションを実行する必要がなくなります。事前承認はDepositAuthの使用にあたり必須の要件ではありませんが、事前承認により特定の操作を実行しやすくなります。

事前承認は通貨に依存しません。特定の通貨のみについてアカウントを事前承認することはできません。

特定の送金元を事前承認するには、`Authorize`フィールドに事前承認する別のアカウントのアドレスを指定した[DepositPreauthトランザクション][]を送信します。事前承認を取り消すには、当該アカウントのアドレスを`Unauthorize`フィールドに指定します。通常どおり、`Account`フィールドには自分自身のアドレスを指定します。現在DepositAuthを有効にしていない場合でも、アカウントを事前承認または承認解除できます。他のアカウントに設定した事前認証ステータスは保存されますが、DepositAuthを有効にしない限り、このステータスの影響はありません。アカウントがアカウント自体を事前認証することはできません。事前認証は一方向であり、反対方向の支払には影響しません。

別のアカウントを事前認証すると、レジャーに[DepositPreauthオブジェクト](depositpreauth-object.html)が追加されます。これにより、認証を提供するアカウントの[所有者準備金](reserves.html#所有者準備金)が増加します。アカウントで事前承認が取り消されると、オブジェクトが削除され、準備金はこれに伴い減少します。

DepositPreauthトランザクションの処理が完了すると、承認済みアカウントからあなたのアカウントに資金を送金できるようになります。これは、以下のトランザクションタイプのいずれかを使用してDepositAuthを有効にしている場合にも該当します。

- [Payment][]
- [EscrowFinish][]
- [PaymentChannelClaim][]

事前承認は、DepositAuthが有効なアカウントへのその他の送金方法には影響しません。詳しいルールについては、[詳細なセマンティクス](#詳細なセマンティクス)を参照してください。

### 承認の確認

[deposit_authorizedメソッド][]を使用して、特定のアカウントに対し別のアカウントへの入金が許可されているかどうかを確認できます。このメソッドは次の2点を確認します。

- 送金先アカウントがDeposit Authorizationを必要としているかどうか。（承認を必要としていない場合は、すべての送金元アカウントが承認済みとみなされます。）
- 送金元アカウントに対し、送金先への送金が事前承認されているかどうか。


## 関連項目

- [DepositPreauthトランザクション][]リファレンス。
- [DepositPreauthレジャーオブジェクトタイプ](depositpreauth-object.html)。
- [`rippled` API](rippled-api.html)の[deposit_authorizedメソッド][]。
- [Authorized Trust Lines](authorized-trust-lines.html)機能（`RequireAuth`フラグ）により、アカウントが発行したXRP以外の通貨を保有できる取引相手が制限されます。
- `DisallowXRP`フラグは、アカウントがXRPを受領してはならないことを示します。これはDeposit Authorizationよりもソフトな保護機能であり、XRP Ledgerにより強制されません。（クライアントアプリケーションはこのフラグに従うか、または少なくともこのフラグについて警告します。）
- 送信トランザクションが[Destinationタグ](become-an-xrp-ledger-gateway.html#source-and-destination-tags)を指定している場合には、`RequireDest`フラグは、アカウントが通貨額のみを受領できることを示します。これにより、ユーザーが支払の目的を指定し忘れることがなくなりますが、恣意的な送金先タグを作成できる不明な送金元から受取人が保護されるわけではありません。
- [Partial Payment](partial-payments.html)により、アカウントは不要な支払を返金できます。この際、[送金手数料](transfer-fees.html)と為替レートは送金額には追加されず、送金された金額から差し引かれます。
<!--{# TODO: Add link to "check for authorization" tutorial DOC-1684 #}-->

<!--{# common link defs #}-->
[DepositPreauth Amendment]: known-amendments.html#depositpreauth
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
