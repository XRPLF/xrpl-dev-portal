---
seo:
  description: 疑似アカウントとは、オンチェーンのプロトコルに代わって資産を保有する、特別な種類のXRPLアカウントです。
labels:
  - Single Asset Vault
  - AMM
  - レンディングプロトコル
status: not_enabled
---

# 疑似アカウント

XRP Ledgerはアカウントベースのブロックチェーンであり、XRP、トラストライントークン、Multi-Purpose Token(MPT)などの資産はアカウントが保有します。アカウントはオンチェーンでは[AccountRoot](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md)レジャーエントリとして表現されます。しかし、レジャーオブジェクトとの間で資産を移動できるようにする必要があるユースケースもあり、そのために疑似アカウントが必要になります。

疑似アカウントとは、オンチェーンのプロトコルに代わって資産を保有する、特別な種類のアカウントです。ユースケースには次のようなものがあります。

- **自動マーケットメーカー(AMM)**: [XLS-30 Amendment](../../../resources/known-amendments.md#amm)は、`AccountRoot`レジャーエントリに`AMMID`フィールドを追加することで、AMM向けの疑似アカウントを導入しました。このフィールドは疑似アカウントをAMMインスタンスに紐付け、プール内のXRPとトークンの残高を追跡し、AMMインスタンスに代わって`LPToken`を発行できるようにします。

- **Single Asset Vault**: Single Asset Vaultの疑似アカウントは、預け入れられた資金を保管し、シェアをMPTとして発行するために使用されます。`AccountRoot`レジャーエントリに新しい`VaultID`フィールドが導入され、疑似アカウントとVaultを紐付けます。

- **レンディングプロトコル**: レンディングプロトコルもSingle Asset Vaultの疑似アカウントを使用し、各`LoanBroker`は疑似アカウントの所有者ディレクトリで追跡されます。疑似アカウントは、ローンのデフォルトからVaultの預け入れ者を保護するファーストロス資本(最初に損失を吸収する資本)と、ローン資金そのものを保有します。

疑似アカウントには厳格な制限があります。他のアカウントからの支払いを受け取ることはできず、署名権限を持たないためトランザクションを送信することもできません。疑似アカウントは資産の保管または発行のためだけに存在します。

疑似アカウントは署名を行えないため、他のアカウントを代理して操作する権限を与えられることも、他のアカウントに自身の代理操作を許可することもできません。具体的には次のとおりです。

- `LendingProtocol`、`BatchV1_1`、`fixCleanup3_3_0`のいずれかのAmendmentが有効になった後は、疑似アカウントが署名したトランザクションはすべて`tefBAD_AUTH`で失敗します。
- `Authorize`フィールドに疑似アカウントを指定した[DelegateSetトランザクション](../../references/protocol/transactions/types/delegateset.md)は`tecPSEUDO_ACCOUNT`で失敗します。 {% amendment-disclaimer name="PermissionDelegationV1_1" /%}
- スポンサーまたは被スポンサーのいずれかに疑似アカウントを指定した[SponsorshipSetトランザクション](../../references/protocol/transactions/types/sponsorshipset.md)は`tecPSEUDO_ACCOUNT`で失敗します。 {% amendment-disclaimer name="Sponsor" /%}

## 準備金の要件

疑似アカウントの作成コストは、その疑似アカウントが別のアカウントによって所有・管理されるかどうかによって異なります。

- **所有者のいる疑似アカウント**: `Vault`のように、単一のアカウントが関連する疑似アカウントを所有・管理するオブジェクトでは、作成トランザクションによって所有者の必要準備金が[所有者準備金](../accounts/reserves.md#基本準備金と所有者準備金)1アイテム分(現在{% $env.PUBLIC_OWNER_RESERVE %})増加します。これは、そのトランザクションに伴う他の準備金要件(たとえば`Vault`オブジェクト自体の準備金)に追加されるものです。

- **所有者のいない疑似アカウント**: `AMM`のように、どのアカウントにも所有されないオブジェクトでは、作成トランザクションに通常より高額な特別なトランザクションコストが課されます。このコストは所有者準備金1つ分以上でなければなりません。この金額はバーンされ、準備金を特定の所有者に紐付けることなく、レジャー領域を恒久的に占有することへの対価となります。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
