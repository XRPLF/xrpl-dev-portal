---
html: accountroot.html
parent: ledger-entry-types.html
seo:
    description: あるアカウントの設定、XRP残高、その他のメタデータを表します。
labels:
  - アカウント
  - XRP
---
# AccountRoot
[[ソース]](https://github.com/xrplf/rippled/blob/5d2d88209f1732a0f8d592012094e345cbe3e675/src/ripple/protocol/impl/LedgerFormats.cpp#L27 "Source")

`AccountRoot`オブジェクトタイプは、1つの[アカウント](../../../../concepts/accounts/index.md)、そのアカウントの設定、XRP残高を記述します。

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

`AccountRoot`オブジェクトのフィールドは次のとおりです。

| フィールド                      | JSONの型 | [内部の型][]        | 必須？ | 説明  |
|:------------------------------|:---------|:------------------|:------|:------|
| `Account`                     | 文字列    | AccountID         | はい   | この[アカウント](../../../../concepts/accounts/index.md)を識別するための（クラシック）アドレスです。 |
| `AccountTxnID`                | 文字列    | Hash256           | いいえ | このアカウントから直近に送信されたトランザクションの識別ハッシュ。このフィールドは、[`AccountTxnID`トランザクションフィールド](../../transactions/common-fields.md#accounttxnid)を使うために有効になっていなければなりません。これを有効にするには、[`asfAccountTxnID`フラグを有効にしたAccountSetトランザクション](../../transactions/types/accountset.md#accountsetのフラグ)を送信してください。 |
| `AMMID`                       | 文字列    | Hash256           | いいえ | _([AMM amendment][] {% not-enabled /%}が必要です。)_ 対応するAMMレジャーエントリのレジャーエントリID。アカウント作成時に設定します。AMM以外のアカウントでは常に省略されます。 |
| `Balance`                     | 文字列    | Amount            | いいえ | アカウントの現在の[drop単位のXRP残高][XRP、drop単位]で、文字列で表現されます。 |
| `BurnedNFTokens`              | 数値      | UInt32            | いいえ | このアカウントで発行された [非代替性トークン](../../../../concepts/tokens/nfts/index.md) のうち、バーンしたトークンの総数を表します。この数値は常に `MintedNFTokens` と同じかそれ以下となります。 |
| `Domain`                      | 文字列    | VariableLength    | いいえ | このアカウントに関連付けられたドメイン。JSONでは、ドメインのASCII表現を16進数で表現します。[256バイトを超える長さは使用できません](https://github.com/xrplf/rippled/blob/55dc7a252e08a0b02cd5aa39e9b4777af3eafe77/src/ripple/app/tx/impl/SetAccount.h#L34) |
| `EmailHash`                   | 文字列    | Hash128           | いいえ | メールアドレスのmd5ハッシュ。クライアントはこれを使用してサービス内で[Gravatar](https://ja.gravatar.com/)などのアバターを検索できます。 |
| [`Flags`](#accountrootのフラグ) | 数値     | UInt32            | はい   | このアカウントに対して有効になっているブールフラグのビットマップ。 |
| `LedgerEntryType`             | 文字列    | UInt16            | はい   | 値`0x0061`で文字列`AccountRoot`にマッピングされ、AccountRootオブジェクトであることを示します。 |
| `MessageKey`                  | 文字列    | VariableLength    | いいえ | このアカウントに暗号化されたメッセージを送信するために使用することができる公開鍵です。JSONでは、16進数で指定します。33バイトであることが必要で、最初の1バイトは鍵の種類を表します。secp256k1鍵の場合は`0x02`または`0x03`、Ed25519鍵の場合は`0xED`となります。 |
| `MintedNFTokens`              | 数値      | UInt32            | いいえ | このアカウントによって、またはこのアカウントのためにMintされた[非代替性トークン](../../../../concepts/tokens/nfts/index.md) の合計数。 |
| `NFTokenMinter`               | 文字列    | AccountID         | いいえ | このアカウントに代わって[非代替性トークン](../../../../concepts/tokens/nfts/index.md)をミントできる別のアカウントを表します。 |
| `OwnerCount`                  | 数値      | UInt32            | はい   | レジャーでこのアカウントが所有しており、アカウント所有者の準備金に資金を付与するオブジェクトの数。 |
| `PreviousTxnID`               | 文字列    | Hash256           | はい   | 最後にこのオブジェクトを変更したトランザクションの識別用ハッシュ。 |
| `PreviousTxnLgrSeq`           | 数値      | UInt32            | はい   | 最後にこのオブジェクトを変更したトランザクションが記録された[レジャーインデックス][]。 |
| `RegularKey`                  | 文字列    | AccountID         | いいえ |  このアカウントのトランザクションに署名するときにマスターキーの代わりに使用できる[キーペア](../../../../concepts/accounts/cryptographic-keys.md)のアドレス。この値を変更するには[SetRegularKeyトランザクション][]を使用してください。 |
| `Sequence`                    | 数値      | UInt32            | はい   | このアカウントの有効な次のトランザクションの[シーケンス番号](../../data-types/basic-data-types.md#アカウントシーケンス) を表します。 |
| `TicketCount`                 | 数値      | UInt32            | いいえ | このアカウントが台帳に保有する[チケット](../../../../concepts/accounts/tickets.md)の数です。これは、アカウントが一度に250 チケットという上限以内に留まることを保証するために自動的に更新されます。このフィールドは、チケットの数がゼロの場合は省略されます。 _([TicketBatch amendment][]により追加されました)_ |
| `TickSize`                    | 数値      | UInt8             | いいえ | このアドレスが発行した通貨が関わるオファーの為替レートに使用する有効桁数。有効な値は`3`以上`15`以下です。_（[TickSize Amendment][]により追加されました。）_ |
| `TransferRate`                | 数値      | UInt32            | いいえ | このアカウントが発行した通貨を他のユーザが相互に送金する際に、これらのユーザに請求する[送金手数料](../../../../concepts/tokens/transfer-fees.md)。 |
| `WalletLocator`               | 文字列    | Hash256           | いいえ | ユーザが設定できる任意の256bit値。 |
| `WalletSize`                  | 数値      | UInt32            | いいえ | 未使用。(コード上ではこのフィールドをサポートしていますが、設定する方法はありません)。 |

## AMMの特殊なAccountRootエントリ

_([AMM amendment][] {% not-enabled /%}が必要です。)_

[自動マーケットメーカー](../../../../concepts/tokens/decentralized-exchange/automated-market-makers.md)(AMM)は、AMMの詳細の一部を追跡するための[AMMレジャーエントリ](amm.md)に加えて、LPトークンを発行しAMMプール内の資産を保持するためにAccountRootレジャーエントリを使用します。AMMに関連するAccountRootのアドレスは、AMMが作成される前にユーザがそのアドレスを特定し資金を提供できないように、ランダム化されています。AMMのAccountRootは、通常のアカウントとは異なり、以下のような設定で作成されます。

- `lsfDisableMaster` **有効** : トランザクションへ署名する手段はありません。これにより、誰もそのアカウントを直接操作することができず、トランザクションを送信することができなくなります。
- `lsfRequireAuth` **有効** : 事前承認されているアカウントは存在しません。これにより、AMMアカウントに資産を追加する唯一の方法は、[AMMDepositトランザクション][]を使用することであることが保証されます。
- `lsfDefaultRipple` **有効** : ユーザ間でAMMのLPトークンを送信したり、取引したりすることが可能になります。

さらに、AMMのAccountRootエントリには以下の特別なルールが適用されます。

- このAMM向けの特殊なアカウントは、[準備金要件](../../../../concepts/accounts/reserves.md)の対象外ですが、AMMのプール内の2つの資産のうちの1つであれば、XRPを保有することができます。
- チェック、エスクロー、ペイメントチャネルの宛先にはできません。そのようなエントリを作成するトランザクションは結果コード`tecNO_PERMISSION`で失敗します。
- ユーザはAMMのLPトークン以外のためにトラストラインを作成することはできません。そのようなトラストラインを作成するトランザクションは結果コード`tecNO_PERMISSION`で失敗します。(AMMはそのプール内のトークンを保持するために2つのトラストラインを持っており、プール内の他の資産がXRPの場合は1つのトラストラインを持っています)。
- [Clawback Amendment][]も有効になっている場合においても、トークンの発行者はAMMから資金を回収することはできません。

LPトークンは他の[トークン](../../../../concepts/tokens/index.md)と同様に動作しますが、これらのトークンはAMM関連のトランザクションでも使用することができます。AMMの残高や、AMMに影響を与えたトランザクションの履歴は、通常のアカウントと同じように確認することができます。

## AccountRootのフラグ

AccountRootフラグの多くは、[AccountSetトランザクション][]で変更できるオプションに対応しています。ただし、レジャーで使用されるビット値は、トランザクションでそれらのフラグを有効または無効にするために使用される値とは異なります。レジャーのフラグは **lsf`** で始まる名前を持ちます。

AccountRootオブジェクトは`Flags`フィールドに以下のフラグを指定できます。

| フラグ名                           | 16進数値       | 10進数値 | 対応する[AccountSetのフラグ](../../transactions/types/accountset.md#accountsetのフラグ) | 説明 |
|-----------------------------------|--------------|----------|-------------------------------------|-------------------------------|
| `lsfAllowTrustLineClawback`       | `0x80000000` | 2147483648 | `asfAllowTrustLineClawback`       | このアカウントの[Clawback](../../../../concepts/tokens/fungible-tokens/clawing-back-tokens.md)を有効にします。 _([Clawback Amendment][]が必要です。)_ |
| `lsfDefaultRipple`                | `0x00800000` | 8388608    | `asfDefaultRipple`                | このアドレスのトラストラインでデフォルトで[rippling](../../../../concepts/tokens/fungible-tokens/rippling.md)を有効にします。発行アドレスに必要です。他のアドレスでの使用は推奨されません。 |
| `lsfDepositAuth`                  | `0x01000000` | 16777216   | `asfDepositAuth`                  | このアカウントは、アカウントが送信するトランザクションと、[事前承認された](../../../../concepts/accounts/depositauth.md#事前承認)アカウントからの資金だけを受領します。（[DepositAuth](../../../../concepts/accounts/depositauth.md)が有効になっています。） |
| `lsfDisableMaster`                | `0x00100000` | 1048576    | `asfDisableMaster`                | このアカウントのトランザクションの署名にマスターキーを使用することを禁止します。 |
| `lsfDisallowIncomingCheck`        | `0x08000000` | 134217728  | `asfDisallowIncomingCheck`        | このアカウントを宛先とするチェックの作成をブロックします。 _([DisallowIncoming Amendment][]により追加されました。)_ |
| `lsfDisallowIncomingNFTokenOffer` | `0x04000000` | 67108864   | `asfDisallowIncomingNFTokenOffer` | このアカウントを宛先とするNFTokenオファーの作成をブロックします。 _([DisallowIncoming Amendment][]により追加されました。)_ |
| `lsfDisallowIncomingPayChan`      | `0x10000000` | 268435456  | `asfDisallowIncomingPayChan`      | このアカウントを宛先とするペイメントチャネルの作成をブロックします。 _([DisallowIncoming Amendment][]により追加されました。)_ |
| `lsfDisallowIncomingTrustline`    | `0x20000000` | 536870912  | `asfDisallowIncomingTrustline`    | このアカウントに対するトラストラインの作成をブロックします。 _([DisallowIncoming Amendment][]により追加されました。)_ |
| `lsfDisallowXRP`                  | `0x00080000` | 524288     | `asfDisallowXRP`                  | クライアントアプリケーションはこのアカウントにXRPを送金しないでください。`rippled`により強制されるものではありません。 |
| `lsfGlobalFreeze`                 | `0x00400000` | 4194304    | `asfGlobalFreeze`                 | このアドレスが発行するすべての資産が凍結されます。 |
| `lsfNoFreeze`                     | `0x00200000` | 2097152    | `asfNoFreeze`                     | このアドレスは、このアドレスに接続しているトラストラインを凍結できません。一度有効にすると、無効にできません。 |
| `lsfPasswordSpent`                | `0x00010000` | 65536      | （なし）                           | このアカウントは無料のSetRegularKeyトランザクションを使用しています。 |
| `lsfRequireAuth`                  | `0x00040000` | 262144     | `asfRequireAuth`                  | このアカウントは、他のユーザがこのアカウントのトークンを保有することを個別に承認する必要があります。 |
| `lsfRequireDestTag`               | `0x00020000` | 131072     | `asfRequireDest`                  | 受信ペイメントには宛先タグの指定が必要です。 |

## {% $frontmatter.seo.title %}の準備金

AccountRootエントリの[準備金](../../../../concepts/accounts/reserves.md)は、特別なAMM AccountRootの場合を除き、現在の基本準備金である{% $env.PUBLIC_BASE_RESERVE %}です。

このXRPは他人に送ることはできませんが、[トランザクションコスト][]の一部として利用することができます。

## AccountRoot IDのフォーマット

AccountRootエントリのIDは、以下の値がこの順序で連結されている[SHA-512ハーフ][]です。

* Accountスペースキー（`0x0061`）
* アカウントのAccountID

{% raw-partial file="/docs/_snippets/common-links.md" /%}
