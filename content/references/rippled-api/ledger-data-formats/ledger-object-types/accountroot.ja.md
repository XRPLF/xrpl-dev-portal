# AccountRoot
[[ソース]<br>](https://github.com/ripple/rippled/blob/5d2d88209f1732a0f8d592012094e345cbe3e675/src/ripple/protocol/impl/LedgerFormats.cpp#L27 "Source")

`AccountRoot`オブジェクトタイプは、1つの[アカウント](accounts.html)、そのアカウントの設定、XRP残高を記述します。

## {{currentpage.name}} JSONの例

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

## {{currentpage.name}}フィールド

`AccountRoot`オブジェクトのフィールドは次のとおりです。

| フィールド                         | JSONの型 | [内部の型][] | 説明  |
|:------------------------------|:----------|:------------------|:-------------|
| `LedgerEntryType`             | 文字列    | UInt16            | 値`0x0061`が文字列`AccountRoot`にマッピングされている場合は、これがAccountRootオブジェクトであることを示します。 |
| `Account`                     | 文字列    | AccountID         | このアカウントの識別用アドレス（rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpnなど）。 |
| `Balance`                     | 文字列    | Amount            | アカウントの現在の[drop単位のXRP残高][XRP、drop単位]で、文字列で表現されます。 |
| [`Flags`](#accountrootのフラグ) | 数値    | UInt32            | このアカウントに対して有効になっているブールフラグのビットマップ。 |
| `OwnerCount`                  | 数値    | UInt32            | レジャーでこのアカウントが所有しており、アカウント所有者の準備金に資金を付与するオブジェクトの数。 |
| `PreviousTxnID`               | 文字列    | Hash256           | 最後にこのオブジェクトを変更したトランザクションの識別用ハッシュ。 |
| `PreviousTxnLgrSeq`           | 数値    | UInt32            | 最後にこのオブジェクトを変更したトランザクションが記録された[レジャーインデックス][]。 |
| `Sequence`                    | 数値    | UInt32            | このアカウントの次に有効なトランザクションのシーケンス番号。（各アカウントはSequence = 1で開始し、トランザクションが作られるたびにこの値が増加します。） |
| `AccountTxnID`                | 文字列    | Hash256           | _（省略可）_ このアカウントが最後に送信したトランザクションの識別用ハッシュ。 |
| `Domain`                      | 文字列    | VariableLength    | _（省略可）_ このアカウントに関連付けられているドメイン。JSONではこれはドメインのASCII表現の16進数値です。 |
| `EmailHash`                   | 文字列    | Hash128           | _（省略可）_ メールアドレスのmd5ハッシュ。クライアントはこれを使用してサービス内で[Gravatar](https://en.gravatar.com/)などのアバターを検索できます。 |
| `MessageKey`                  | 文字列    | VariableLength    | _（省略可）_ 暗号化メッセージをこのアカウントに送信するときに使用できる公開鍵。JSONでは16進数値を使用します。33バイト以下です。 |
| `RegularKey`                  | 文字列    | AccountID         | _（省略可）_ このアカウントのトランザクションに署名するときにマスターキーの代わりに使用できるキーペアのアドレス。この値を変更するには[SetRegularKeyトランザクション][]を使用してください。 |
| `TickSize`                    | 数値    | UInt8             | _（省略可）_ このアドレスが発行した通貨が関わるオファーの為替レートに使用する有効桁数。有効な値は`3`以上`15`以下です。_（[TickSize Amendment][]が必要です。）_ |
| `TransferRate`                | 数値    | UInt32            | _（省略可）_ このアカウントが発行した通貨を他のユーザーが相互に送金する際に、これらのユーザーに請求する[送金手数料](https://ripple.com/knowledge_center/transfer-fees/)。 |
| `WalletLocator`               | 文字列    | Hash256           | _（省略可）_ **廃止予定**。使用しないでください。 |
| `WalletSize`                  | 数値    | UInt32            | _（省略可）_ **廃止予定**。使用しないでください。 |

## AccountRootのフラグ

このアカウントに対して有効化または無効化できる各種オプションがあります。これらのオプションを変更するには、[AccountSetトランザクション][]を使用します。レジャーではフラグはバイナリ値として表され、これらのバイナリ値はビットOR演算と組み合わせることができます。レジャーでのフラグのビット値は、トランザクションでこれらのフラグを有効または無効にするために使用する値とは異なります。レジャーのフラグには、 _lsf_ で始まる名前が付いています。

AccountRootオブジェクトには以下のフラグ値を指定できます。

| フラグ名 | 16進数値 | 10進数値 | 説明 | 対応する[AccountSetのフラグ](accountset.html#accountsetのフラグ) |
|-----------|-----------|---------------|-------------|-------------------------------|
| lsfDefaultRipple | 0x00800000 | 8388608 | このアドレスのトラストラインでデフォルトで[rippling](rippling.html)を有効にします。発行アドレスに必要です。他のアドレスでの使用は推奨されません。 | asfDefaultRipple |
| lsfDepositAuth | 0x01000000 | 16777216 | このアカウントは、アカウントが送信するトランザクションと、[事前承認された](depositauth.html#事前承認)アカウントからの資金だけを受領します。（[DepositAuth](depositauth.html)が有効になっています。） | asfDepositAuth |
| lsfDisableMaster | 0x00100000 | 1048576 | このアカウントのトランザクションの署名にマスターキーを使用することを禁止します。 | asfDisableMaster |
| lsfDisallowXRP | 0x00080000 | 524288 | クライアントアプリケーションはこのアカウントにXRPを送金しないでください。`rippled`により強制されるものではありません。 | asfDisallowXRP |
| lsfGlobalFreeze | 0x00400000 | 4194304 | このアドレスが発行するすべての資産が凍結されます。 | asfGlobalFreeze |
| lsfNoFreeze | 0x00200000 | 2097152 | このアドレスは、このアドレスに接続しているトラストラインを凍結できません。一度有効にすると、無効にできません。 | asfNoFreeze |
| lsfPasswordSpent | 0x00010000 | 65536 | このアカウントは無料のSetRegularKeyトランザクションを使用しています。 | （なし） |
| lsfRequireAuth | 0x00040000 | 262144 | このアカウントは、他のユーザーがこのアカウントのイシュアンスを保有することを個別に承認する必要があります。 | asfRequireAuth |
| lsfRequireDestTag | 0x00020000 | 131072 | 受信ペイメントには宛先タグの指定が必要です。 | asfRequireDest |

## AccountRoot IDのフォーマット

AccountRootオブジェクトのIDは、以下の値がこの順序で連結されている[SHA-512ハーフ][]です。

* Accountスペースキー（`0x0061`）
* アカウントのAccountID

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
