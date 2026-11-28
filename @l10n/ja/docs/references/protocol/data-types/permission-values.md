---
seo:
    description: 他のアカウントに付与できる権限のフォーマットです。
labels:
    - 権限
---
# 権限の値

[権限委任](../../../concepts/accounts/permission-delegation.md)では、他のアカウントに付与できる権限が定義されています。これらの権限は次の種類に分かれます。

- **トランザクションタイプ権限** - 指定した[トランザクションタイプ](../transactions/types/index.md)のトランザクションを送信する権限です。
- **詳細権限(Granular Permission)** - 特定の一部の機能に限定してトランザクションを送信する権限です。

{% amendment-disclaimer name="PermissionDelegationV1_1" /%}

## 数値と文字列の値

トランザクションやレジャーデータの[正規バイナリーフォーマット](../binary-format.md)では、権限の値は数値（具体的には32ビットの符号なし整数）で保存されます。ただし、JSONでは利便性のため、トランザクションタイプの名前（`TransactionType`フィールド）と同様に、文字列形式で指定したり返したりできます。

JSONで権限の値を指定する場合は、数値と文字列のどちらでも使用できます。サーバーがデータを返す場合は、既知の値であれば文字列を、そうでなければ数値を返します。

{% admonition type="warning" name="注意" %}
数値のPermissionValueに対応していないクライアントライブラリもあります。ほとんどの場合、付与したい権限は文字列の名前で指定してください。
{% /admonition %}

- **トランザクションタイプ権限**の場合、文字列はトランザクションタイプの名前そのものです（大文字と小文字を区別します）。たとえば、権限の値`"PaymentChannelClaim"`は、[PaymentChannelClaimトランザクション][]を送信する権限を付与します。
- **詳細権限**の場合、文字列は詳細権限の名前です（大文字と小文字を区別します）。たとえば、権限の値`"TrustlineAuthorize"`は、トラストラインを認可するTrustSetトランザクションを送信する権限を付与します（トラストラインの上限やフリーズ状態など、他の設定を変更するTrustSetトランザクションは含みません）。

数値の`0`は「完全な権限」、つまりすべてのタイプのトランザクションを送信する権限のために予約されていますが、完全な権限を委任することはできません。

## トランザクションタイプ権限

トランザクションタイプ権限の数値は1から65536（つまり2<sup>16</sup>）までです（両端を含む）。これらは既知のトランザクションタイプに対応しますが、トランザクションタイプを権限の値として指定する場合は1を加えます。たとえば、文字列`"Payment"`は`TransactionType`の値では`0`に対応しますが、`PermissionValue`の値では`1`になります。Paymentトランザクションを送信する権限を付与するには、`"PermissionValue": "Payment"`または`"PermissionValue": 1`のどちらかを指定します。

サーバーが認識しているトランザクションタイプと、それに対応するトランザクションタイプの数値の対応表は、[server_definitionsメソッド][]の`TRANSACTION_TYPES`フィールドで確認してください。

### 委任できない権限の一覧

一部のトランザクションタイプは委任できません。これらの権限を被委任者に付与しようとすると、トランザクションは`tecNO_PERMISSION`などの[結果コード](../transactions/transaction-results/index.md)で失敗します。これには、別のキーペアやアカウントに他の権限を付与するために使えるトランザクションタイプがすべて含まれます。また、[疑似トランザクションタイプ](../transactions/pseudo-transaction-types/index.md)はそもそも通常のアカウントから送信できないため、すべて委任できません。

次の権限は委任できません。

| トランザクションタイプ | 権限の値 |
|:--------------------|:-----------------|
| [AccountDelete][]   | `22` |
| [AccountSet][]      | `4` |
| [Batch][]           | `72` |
| [ConfidentialMPTConvert][ConfidentialMPTConvertトランザクション] {% amendment-disclaimer name="ConfidentialTransfer" /%} | `86` |
| [DelegateSet][]     | `65` |
| [EnableAmendment][] | `101` |
| [LedgerStateFix][]  | `54` |
| [LoanBrokerCoverClawback](../transactions/types/loanbrokercoverclawback.md) {% amendment-disclaimer name="LendingProtocol" /%} | `79` |
| [LoanBrokerCoverDeposit](../transactions/types/loanbrokercoverdeposit.md) {% amendment-disclaimer name="LendingProtocol" /%} | `77` |
| [LoanBrokerCoverWithdraw](../transactions/types/loanbrokercoverwithdraw.md) {% amendment-disclaimer name="LendingProtocol" /%} | `78` |
| [LoanBrokerDelete](../transactions/types/loanbrokerdelete.md) {% amendment-disclaimer name="LendingProtocol" /%} | `76` |
| [LoanBrokerSet](../transactions/types/loanbrokerset.md) {% amendment-disclaimer name="LendingProtocol" /%} | `75` |
| [LoanDelete](../transactions/types/loandelete.md) {% amendment-disclaimer name="LendingProtocol" /%} | `82` |
| [LoanManage](../transactions/types/loanmanage.md) {% amendment-disclaimer name="LendingProtocol" /%} | `83` |
| [LoanPay](../transactions/types/loanpay.md) {% amendment-disclaimer name="LendingProtocol" /%} | `85` |
| [LoanSet](../transactions/types/loanset.md) {% amendment-disclaimer name="LendingProtocol" /%} | `81` |
| [SetFee][]          | `102` |
| [SetRegularKey][]   | `6` |
| [SignerListSet][]   | `13` |
| [SponsorshipTransfer](../transactions/types/sponsorshiptransfer.md) {% amendment-disclaimer name="Sponsor" /%} | `91` |
| [VaultClawback](../transactions/types/vaultclawback.md) {% amendment-disclaimer name="SingleAssetVault" /%} | `71` |
| [VaultCreate](../transactions/types/vaultcreate.md) {% amendment-disclaimer name="SingleAssetVault" /%} | `66` |
| [VaultDelete](../transactions/types/vaultdelete.md) {% amendment-disclaimer name="SingleAssetVault" /%} | `68` |
| [VaultDeposit](../transactions/types/vaultdeposit.md) {% amendment-disclaimer name="SingleAssetVault" /%} | `69` |
| [VaultSet](../transactions/types/vaultset.md) {% amendment-disclaimer name="SingleAssetVault" /%} | `67` |
| [VaultWithdraw](../transactions/types/vaultwithdraw.md) {% amendment-disclaimer name="SingleAssetVault" /%} | `70` |
| [UNLModify][]       | `103` |

{% admonition type="info" name="注記" %}
`Batch`トランザクション自体は委任できませんが、被委任者は権限を持っていれば内部トランザクションを送信 _できます_。
{% /admonition %}

## 詳細権限
{% source-link path="include/xrpl/protocol/detail/permissions.macro" /%}

詳細権限の数値は65537以上で、それぞれ特定の権限の名前に対応します。定義されていない値は使用できません。各詳細権限は、1つのトランザクションタイプの機能の一部分です。

| 数値          | 名前                     | トランザクションタイプ | 説明 |
|:--------------|:-------------------------|:-----------------------|:-----|
| `65537`       | `TrustlineAuthorize`     | [TrustSet][]           | [個々のトラストラインを認可](../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md)できます。 |
| `65538`       | `TrustlineFreeze`        | [TrustSet][]           | [個々のトラストラインをフリーズ](../../../concepts/tokens/fungible-tokens/freezes.md)できます。 |
| `65539`       | `TrustlineUnfreeze`      | [TrustSet][]           | [個々のトラストラインのフリーズを解除](../../../concepts/tokens/fungible-tokens/freezes.md)できます。 |
| `65540`       | `AccountDomainSet`       | [AccountSet][]         | アカウントの`Domain`フィールドを設定できます。 |
| `65541`       | `AccountEmailHashSet`    | [AccountSet][]         | アカウントの`EmailHash`フィールドを設定できます。 |
| `65542`       | `AccountMessageKeySet`   | [AccountSet][]         | アカウントの`MessageKey`フィールドを設定できます。 |
| `65543`       | `AccountTransferRateSet` | [AccountSet][]         | [アカウントが発行する代替可能トークンの送金手数料](../../../concepts/tokens/fungible-tokens/transfer-fees.md)を設定できます。 |
| `65544`       | `AccountTickSizeSet`     | [AccountSet][]         | [アカウントが発行する代替可能トークンのティックサイズ](../../../concepts/tokens/decentralized-exchange/ticksize.md)を設定できます。 |
| `65545`       | `PaymentMint`            | [Payment][]            | 代替可能トークンまたはMPTを新たに発行する支払いを送信できます。 |
| `65546`       | `PaymentBurn`            | [Payment][]            | 代替可能トークンまたはMPTをバーンする支払いを送信できます。ただし、残高をゼロ未満にすることはできません。{% amendment-disclaimer name="fixCleanup3_4_0" mode="updated" /%} |
| `65547`       | `MPTokenIssuanceLock`    | [MPTokenIssuanceSet][MPTokenIssuanceSetトランザクション] | アカウントが発行した特定のMPTの残高をロックできます。{% amendment-disclaimer name="MPTokensV1" /%} |
| `65548`       | `MPTokenIssuanceUnlock`  | [MPTokenIssuanceSet][MPTokenIssuanceSetトランザクション] | アカウントが発行した特定のMPTの残高のロックを解除できます。{% amendment-disclaimer name="MPTokensV1" /%} |

### 詳細権限の制限事項

詳細権限のセットはハードコードされており、独自の構成はできません。たとえば、特定の通貨に基づく権限を追加することはできません。新しい詳細権限を追加するにはAmendmentが必要です。


{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
