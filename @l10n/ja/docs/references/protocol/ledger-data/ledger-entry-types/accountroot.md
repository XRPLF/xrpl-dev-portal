---
seo:
    description: あるアカウントの設定、XRP残高、その他のメタデータを表します。
labels:
  - アカウント
  - XRP
---
# AccountRoot
[[ソース]](https://github.com/XRPLF/rippled/blob/a5d238e7d4fa6ef2b539b759d58744d0a1c33c0c/include/xrpl/protocol/detail/ledger_entries.macro#L129-L153 "Source")

`AccountRoot`レジャーエントリタイプは、1つの[アカウント](../../../../concepts/accounts/index.md)と、その設定およびXRP残高を表します。十分な額のXRPを含む[Paymentトランザクション][]を数学的に有効なアドレスに送信すると、新しいアカウントを作成できます。

## {% $frontmatter.seo.title %} JSONの例

```json
{
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "AccountTxnID": "0D5FB50FA65C9FE1538FD7E398FFFE9D1908DFA4576D8D7A020040686F93C77D",
  "Balance": "148446663",
  "Domain": "6D64756F31332E636F6D",
  "EmailHash": "98B4375E1D753E5B91627516F6D70977",
  "Flags": 8388608,
  "LedgerEntryType": "AccountRoot",
  "MessageKey": "0000000000000000000000070000000300",
  "OwnerCount": 3,
  "PreviousTxnID": "0D5FB50FA65C9FE1538FD7E398FFFE9D1908DFA4576D8D7A020040686F93C77D",
  "PreviousTxnLgrSeq": 14091160,
  "Sequence": 336,
  "TransferRate": 1004999999,
  "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8"
}
```

## {% $frontmatter.seo.title %}フィールド

[共通フィールド](../common-fields.md)に加えて、{% code-page-name /%}エントリには次のフィールドがあります。

| フィールド                      | JSONの型 | [内部の型][]        | 必須？ | 説明  |
|:------------------------------|:---------|:------------------|:------|:------|
| `Account`                     | 文字列    | AccountID         | はい   | このアカウントを識別する[アドレス](../../../../concepts/accounts/addresses.md)。 |
| `AccountTxnID`                | 文字列    | UInt256           | いいえ | このアカウントから直近に送信されたトランザクションの識別用ハッシュ。[`AccountTxnID`トランザクションフィールド](../../transactions/common-fields.md#accounttxnid)を使用するには、このフィールドが有効になっている必要があります。有効にするには、[`asfAccountTxnID`フラグを有効にしたAccountSetトランザクション](../../transactions/types/accountset.md#accountsetのフラグ)を送信してください。 |
| `AMMID`                       | 文字列    | UInt256           | いいえ | このフィールドがある場合、このAccountRootがAMMの特別な[疑似アカウント](../../../../concepts/accounts/pseudo-accounts.md)であることを示します。AMM以外のアカウントでは常に省略されます。対応するAMMレジャーエントリのレジャーエントリIDが入ります。アカウントの作成時に設定され、変更できません。{% amendment-disclaimer name="AMM" /%} |
| `Balance`                     | 文字列    | Amount            | いいえ | アカウントの現在の[XRP残高（drop単位）][XRPのdrop数]を文字列で表したもの。 |
| `BurnedNFTokens`              | 数値      | UInt32            | いいえ | このアカウントが発行した[非代替性トークン](../../../../concepts/tokens/nfts/index.md)のうち、バーンされたトークンの総数。この数値は常に`MintedNFTokens`以下です。 |
| `Domain`                      | 文字列    | Blob              | いいえ | このアカウントに関連付けられたドメイン。JSONでは、ドメインのASCII表現を16進数で表します。[長さは256バイト以下にする必要があります。](https://github.com/XRPLF/rippled/blob/5b6e8b6f93b19c1e3f6a3467a25639031d9d9a53/include/xrpl/protocol/Protocol.h#L215) |
| `EmailHash`                   | 文字列    | UInt128           | いいえ | メールアドレスのmd5ハッシュ。クライアントはこれを使って、[Gravatar](https://ja.gravatar.com/)などのサービスでアバターを検索できます。 |
| `FirstNFTokenSequence`        | 数値      | UInt32            | いいえ | このアカウントが最初の[非代替性トークン](../../../../concepts/tokens/nfts/index.md)をミントした時点の、アカウントの[シーケンス番号][]。{% amendment-disclaimer name="fixNFTokenRemint" /%} |
| `MessageKey`                  | 文字列    | Blob              | いいえ | このアカウントに暗号化されたメッセージを送信するために使用できる公開鍵。JSONでは16進数を使用します。長さはちょうど33バイトで、最初の1バイトは鍵の種類を示します。secp256k1鍵の場合は`0x02`または`0x03`、Ed25519鍵の場合は`0xED`です。 |
| `MintedNFTokens`              | 数値      | UInt32            | いいえ | このアカウントによって、またはこのアカウントに代わってミントされた[非代替性トークン](../../../../concepts/tokens/nfts/index.md)の総数。{% amendment-disclaimer name="NonFungibleTokensV1_1" /%} |
| `NFTokenMinter`               | 文字列    | AccountID         | いいえ | このアカウントに代わって[非代替性トークン](../../../../concepts/tokens/nfts/index.md)をミントできる別のアカウント。{% amendment-disclaimer name="NonFungibleTokensV1_1" /%} |
| `OwnerCount`                  | 数値      | UInt32            | はい   | このアカウントがレジャー上で所有するオブジェクトの数。所有者準備金の計算に使われます。 |
| `PreviousTxnID`               | 文字列    | UInt256           | はい   | 最後にこのオブジェクトを変更したトランザクションの識別用ハッシュ。 |
| `PreviousTxnLgrSeq`           | 数値      | UInt32            | はい   | 最後にこのオブジェクトを変更したトランザクションが含まれる[レジャーのインデックス][レジャーインデックス]。 |
| `RegularKey`                  | 文字列    | AccountID         | いいえ | このアカウントのトランザクションに署名するときに、マスターキーの代わりに使用できる[キーペア](../../../../concepts/accounts/cryptographic-keys.md)のアドレス。この値を変更するには[SetRegularKeyトランザクション][]を使用してください。 |
| `Sequence`                    | 数値      | UInt32            | はい   | このアカウントの次の有効なトランザクションの[シーケンス番号](../../data-types/basic-data-types.md#アカウントシーケンス)。 |
| `Sponsor`                     | 文字列    | AccountID         | いいえ | このアカウントのアカウント準備金を支払うスポンサー。{% amendment-disclaimer name="Sponsor" /%} |
| `SponsoredOwnerCount`         | 数値      | UInt32            | いいえ | このアカウントが所有するオブジェクトのうち、別のアカウントがスポンサーになっているオブジェクトの数。{% amendment-disclaimer name="Sponsor" /%} |
| `SponsoringAccountCount`      | 数値      | UInt32            | いいえ | このアカウントがアカウント準備金のスポンサーになっているアカウントの数。{% amendment-disclaimer name="Sponsor" /%} |
| `SponsoringOwnerCount`        | 数値      | UInt32            | いいえ | このアカウントが準備金のスポンサーになっているオブジェクトの数。{% amendment-disclaimer name="Sponsor" /%} |
| `TicketCount`                 | 数値      | UInt32            | いいえ | このアカウントがレジャー上で所有する[チケット](../../../../concepts/accounts/tickets.md)の数。アカウントが一度に保有できるチケットの上限（250個）を超えないように、自動的に更新されます。チケットの数がゼロの場合、このフィールドは省略されます。 |
| `TickSize`                    | 数値      | UInt8             | いいえ | このアドレスが発行した通貨が関わるオファーの為替レートに使用する有効桁数。有効な値は`3`以上`15`以下です。 |
| `TransferRate`                | 数値      | UInt32            | いいえ | このアカウントが発行した通貨を他のユーザ同士が送金する際に、そのユーザに請求する[送金手数料](../../../../concepts/tokens/fungible-tokens/transfer-fees.md)。 |
| `VaultID`                     | 文字列    | UInt256           | いいえ | {% amendment-disclaimer name="SingleAssetVault" /%} このアカウントに関連付けられた`Vault`エントリのID。アカウントの作成時に設定され、変更できません。このフィールドがある場合、このAccountRootがVaultの特別な[疑似アカウント](../../../../concepts/accounts/pseudo-accounts.md)であることを示します。Vault以外のアカウントでは常に省略されます。 |
| `WalletLocator`               | 文字列    | UInt256           | いいえ | ユーザが設定できる任意の256ビット値。 |
| `WalletSize`                  | 数値      | UInt32            | いいえ | 未使用。（コード上ではこのフィールドをサポートしていますが、設定する方法はありません。） |

## AMMの特殊なAccountRootエントリ

{% amendment-disclaimer name="AMM" /%}

[自動マーケットメーカー](../../../../concepts/tokens/decentralized-exchange/automated-market-makers.md)(AMM)は、LPトークンを発行してAMMプール内の資産を保持するためにAccountRootレジャーエントリ（疑似アカウント）を使用し、AMMの詳細の一部を追跡するために[AMMレジャーエントリ](amm.md)を使用します。AMMのAccountRootのアドレスはランダム化されているため、ユーザがAMMの作成前にそのアドレスを特定して資金を送ることはできません。AMMのAccountRootオブジェクトは、通常のアカウントとは異なり、次の設定で作成されます。

- `lsfDisableMaster`が**有効**で、トランザクションを承認する手段がありません。これにより、誰もアカウントを直接操作できず、アカウントからトランザクションを送信することもできません。
- `lsfDepositAuth`が**有効**で、事前承認されたアカウントはありません。これにより、AMMアカウントに資金を追加する唯一の方法は[AMMDepositトランザクション][]になります。
- `lsfDefaultRipple`が**有効**です。これにより、ユーザ間でAMMのLPトークンを送金したり取引したりできます。

また、AMMのAccountRootエントリには次の特別なルールが適用されます。

- [準備金要件](../../../../concepts/accounts/reserves.md)の対象外です。XRPを保有できるのは、XRPがAMMのプール内の2つの資産のいずれかである場合のみです。
- チェック、エスクロー、ペイメントチャネルの宛先にすることはできません。そのようなエントリを作成するトランザクションは、結果コード`tecNO_PERMISSION`で失敗します。
- ユーザは、AMMのLPトークン以外のトークンのために、このアカウントへのトラストラインを作成できません。そのようなトラストラインを作成するトランザクションは、結果コード`tecNO_PERMISSION`で失敗します。（AMM自体は、プール内のトークンを保持するために2つのトラストラインを持ちます。プール内のもう一方の資産がXRPの場合は1つです。）
- [Clawback Amendment][]も有効になっている場合でも、発行者はAMMから資金を回収できません。

これらの例外を除けば、これらのアカウントは通常のアカウントと同じです。AMMが発行するLPトークンは、AMM関連のトランザクションでも使用できる点を除き、他の[トークン](../../../../concepts/tokens/index.md)と同様に動作します。AMMの残高や、AMMに影響を与えたトランザクションの履歴は、通常のアカウントと同じ方法で確認できます。

## Vaultの特殊なAccountRootエントリ

{% amendment-disclaimer name="SingleAssetVault" /%}

Vaultは、シェアを発行してVaultに預け入れられた資産を保持するためにAccountRootレジャーエントリ（疑似アカウント）を使用し、Vaultの設定と状態を追跡するために[Vaultエントリ](vault.md)を使用します。VaultのAccountRootのアドレスはランダム化されているため、ユーザがVaultの作成前にそのアドレスを特定して資金を送ることはできません。VaultのAccountRootオブジェクトは、通常のアカウントとは異なり、次の設定で作成されます。

- `lsfDisableMaster`が**有効**で、トランザクションを承認する手段がありません。これにより、誰もアカウントを直接操作できず、アカウントからトランザクションを送信することもできません。
- `lsfDepositAuth`が**有効**で、事前承認されたアカウントはありません。これにより、VaultのAccountRootに資金を追加する唯一の方法は[VaultDepositトランザクション](../../transactions/types/vaultdeposit.md)になります。
- `lsfDefaultRipple`が**有効**です。これにより、Vaultの疑似アカウントでRipplingが有効になります。

また、VaultのAccountRootエントリには次の特別なルールが適用されます。

- Vaultの所有者アカウントは、Vaultの作成時に、疑似アカウントの分として[所有者準備金](../../../../concepts/accounts/reserves.md#基本準備金と所有者準備金)を1アイテム分（現在は{% $env.PUBLIC_OWNER_RESERVE %}）支払う必要があります。
- `Sequence`番号は常に`0`で変化しないため、疑似アカウントはトランザクションを送信できません。
- 疑似アカウントはVaultが削除されると自動的に削除され、Vaultエントリとは独立して存在できません。

## AccountRootのフラグ

AccountRootオブジェクトの`Flags`フィールドには、次のフラグを組み合わせて指定できます。

| フラグ名                           | 16進数値       | 10進数値     | 説明 |
|-----------------------------------|--------------|------------|------|
| `lsfAllowTrustLineClawback`       | `0x80000000` | 2147483648 | このアカウントで[Clawback](../../../../concepts/tokens/fungible-tokens/clawing-back-tokens.md)が有効になっています。一度有効にすると、無効にできません。{% amendment-disclaimer name="Clawback" /%} |
| `lsfAllowTrustLineLocking`        | `0x40000000` | 1073741824 | このアカウントが発行するトラストライントークンで[エスクロー](../../../../concepts/payment-types/escrow.md)が有効になっています。{% amendment-disclaimer name="TokenEscrow" /%} |
| `lsfDefaultRipple`                | `0x00800000` | 8388608    | このアドレスのトラストラインで、デフォルトで[Rippling](../../../../concepts/tokens/fungible-tokens/rippling.md)を有効にします。トラストライントークンの発行者には必須で、それ以外のアカウントでの使用は推奨されません。 |
| `lsfDepositAuth`                  | `0x01000000` | 16777216   | このアカウントで[DepositAuth](../../../../concepts/accounts/depositauth.md)が有効になっています。つまり、このアカウントが資金を受け取れるのは、自身が送信したトランザクションと、[事前承認](../../../../concepts/accounts/depositauth.md#事前承認)されたアカウントからのみです。{% amendment-disclaimer name="DepositAuth" /%} |
| `lsfDisableMaster`                | `0x00100000` | 1048576    | このアカウントの[マスターキーペア](../../../../concepts/accounts/cryptographic-keys.md)は無効になっており、このアカウントのトランザクションの署名に使用できません。 |
| `lsfDisallowIncomingCheck`        | `0x08000000` | 134217728  | このアカウントは、受信する[チェック](../../../../concepts/payment-types/checks.md)をブロックします。{% amendment-disclaimer name="DisallowIncoming" /%} |
| `lsfDisallowIncomingNFTokenOffer` | `0x04000000` | 67108864   | このアカウントは、受信する[NFTオファー](../../../../concepts/tokens/nfts/trading.md)をブロックします。{% amendment-disclaimer name="DisallowIncoming" /%} |
| `lsfDisallowIncomingPayChan`      | `0x10000000` | 268435456  | このアカウントは、受信する[ペイメントチャネル](../../../../concepts/payment-types/payment-channels.md)をブロックします。{% amendment-disclaimer name="DisallowIncoming" /%} |
| `lsfDisallowIncomingTrustline`    | `0x20000000` | 536870912  | このアカウントは、受信する[トラストライン](../../../../concepts/tokens/fungible-tokens/trust-line-tokens.md)をブロックします。{% amendment-disclaimer name="DisallowIncoming" /%} |
| `lsfDisallowXRP`                  | `0x00080000` | 524288     | クライアントアプリケーションは、このアカウントにXRPを送金しないでください。（推奨事項であり、プロトコルでは強制されません。） |
| `lsfGlobalFreeze`                 | `0x00400000` | 4194304    | このアカウントが発行するトラストライントークンは[フリーズ](../../../../concepts/tokens/fungible-tokens/freezes.md)されています。 |
| `lsfNoFreeze`                     | `0x00200000` | 2097152    | このアカウントは、自身に接続されたトラストラインをフリーズできません。一度有効にすると、無効にできません。 |
| `lsfPasswordSpent`                | `0x00010000` | 65536      | このアカウントは、[無料のキーリセットトランザクション](../../../../concepts/transactions/transaction-cost.md#key-resetトランザクション)を使用済みです。 |
| `lsfRequireAuth`                  | `0x00040000` | 262144     | このアカウントが発行するトラストライントークンでは、[認可トラストライン](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md)（許可リスト方式）を使用します。 |
| `lsfRequireDestTag`               | `0x00020000` | 131072     | このアカウントへの支払いには、宛先タグの指定が必要です。取引所などの共有アカウントで、受信する支払いの入金先となる顧客や目的を指定させるためによく使われます。 |

### AccountSetのフラグとの対応

AccountRootのフラグの多くは、[AccountSetトランザクション][]で変更できるオプションに対応しています。ただし、レジャーエントリで使用されるビット値は、トランザクションでそれらのフラグを有効または無効にするために使用する値とは異なります。レジャーのフラグの名前は **`lsf`** で始まります。

次の表は、AccountRootのフラグと、それを制御するAccountSetのフラグとの対応を示しています。

| フラグ名                           | 対応する[AccountSetのフラグ](../../transactions/types/accountset.md#accountsetのフラグ) |
|-----------------------------------|-----------------------------------|
| `lsfAllowTrustLineClawback`       | `asfAllowTrustLineClawback`       |
| `lsfAllowTrustLineLocking`        | `asfAllowTrustLineLocking`        |
| `lsfDefaultRipple`                | `asfDefaultRipple`                |
| `lsfDepositAuth`                  | `asfDepositAuth`                  |
| `lsfDisableMaster`                | `asfDisableMaster`                |
| `lsfDisallowIncomingCheck`        | `asfDisallowIncomingCheck`        |
| `lsfDisallowIncomingNFTokenOffer` | `asfDisallowIncomingNFTokenOffer` |
| `lsfDisallowIncomingPayChan`      | `asfDisallowIncomingPayChan`      |
| `lsfDisallowIncomingTrustline`    | `asfDisallowIncomingTrustline`    |
| `lsfDisallowXRP`                  | `asfDisallowXRP`                  |
| `lsfGlobalFreeze`                 | `asfGlobalFreeze`                 |
| `lsfNoFreeze`                     | `asfNoFreeze`                     |
| `lsfPasswordSpent`                | （なし）                           |
| `lsfRequireAuth`                  | `asfRequireAuth`                  |
| `lsfRequireDestTag`               | `asfRequireDest`                  |


## {% $frontmatter.seo.title %}の準備金

AccountRootエントリの[準備金](../../../../concepts/accounts/reserves.md)は基本準備金で、現在は{% $env.PUBLIC_BASE_RESERVE %}です。ただし、AMMまたはVaultの特殊なAccountRootは除きます。

このXRPを他のアカウントに送ることはできませんが、[トランザクションコスト][]の一部としてバーンすることはできます。

## {% $frontmatter.seo.title %} IDのフォーマット

AccountRootエントリのIDは、以下の値をこの順序で連結した[SHA-512Half][]です。

* Accountスペースキー（`0x0061`）
* アカウントのAccountID

## 関連項目

- **コンセプト:**
    - [疑似アカウント](../../../../concepts/accounts/pseudo-accounts.md)

- **トランザクション:**
    - [AccountSetトランザクション][]
    - [AccountDeleteトランザクション][]

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
