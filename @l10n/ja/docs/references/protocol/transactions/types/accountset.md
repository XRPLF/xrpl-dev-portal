---
seo:
    description: XRP Ledgerのアカウントのプロパティーを修正します。
labels:
  - アカウント
---
# AccountSet

[[ソース]](https://github.com/XRPLF/rippled/blob/f65cea66ef99b1de149c02c15f06de6c61abf360/src/ripple/app/transactors/SetAccount.cpp "ソース")

AccountSetトランザクションは、[XRP Ledgerのアカウント](../../ledger-data/ledger-entry-types/accountroot.md)のプロパティーを修正します。

## {% $frontmatter.seo.title %}のJSONの例

```json
{
    "TransactionType": "AccountSet",
    "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "12",
    "Sequence": 5,
    "Domain": "6578616D706C652E636F6D",
    "SetFlag": 5,
    "MessageKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB"
}
```

{% tx-example txid="327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70" /%}

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド         | JSONの型        | [内部の型][] | 説明        |
|:-----------------|:-----------------|:------------------|:-------------------|
| [`ClearFlag`](#accountsetのフラグ)    | 数値           | UInt32            |  _（省略可）_ このアカウントについてオプションを無効にするためのフラグの一意識別子。 |
| [`Domain`](#domain)       | 文字列           | Blob              |  _（省略可）_ このアカウントを保有するドメインのASCII小文字を表現する16進文字列。[256バイトを超える長さは使用できません。](https://github.com/XRPLF/rippled/blob/55dc7a252e08a0b02cd5aa39e9b4777af3eafe77/src/ripple/app/tx/impl/SetAccount.h#L34) |
| `EmailHash`        | 文字列           | Hash128           |  _（省略可）_ アバターイメージの生成に使用されるメールアドレスのハッシュ。一般的に、クライアントは[Gravatar](http://en.gravatar.com/site/implement/hash/)を使用してこのイメージを表示しています。 |
| `MessageKey`       | 文字列           | Blob              |  _（省略可）_ 暗号化されたメッセージをこのアカウントに送信するための公開鍵です。キーを設定するには、正確に33バイトである必要があり、最初のバイトはキーの種類を示します。secp256k1鍵の場合は`0x02`または`0x03`、Ed25519鍵の場合は`0xED`です。キーを削除するには、空の値を使用します。 |
| `NFTokenMinter`  | 文字列           | Blob              | _(省略可)_ あなたのために[NFTokensをミントする](../../../../tutorials/javascript/nfts/assign-an-authorized-minter.md)ことができる別のアカウント。 {% amendment-disclaimer name="NonFungibleTokensV1_1" /%} |
| [`SetFlag`](#accountsetのフラグ)      | 数値           | UInt32            |  _（省略可）_ このアカウントについてオプションを有効にするための整数フラグ。 |
| [`TransferRate`](#transferrate) | 符号なし整数 | UInt32            |  _（省略可）_ ユーザがこのアカウントのトークンを送金するときに請求される手数料。通貨単位の10億分の1で表現されます。手数料なしを意味する特殊なケースの`0`を除いて、`2000000000`より大きくしたり、`1000000000`より小さくしたりすることはできません。 |
| [`TickSize`](../../../../concepts/tokens/decentralized-exchange/ticksize.md)     | 符号なし整数 | UInt8             | _（省略可）_このアドレスによって発行されている通貨が関係するオファーに使用する為替レートの呼値の単位。それらのオファーの為替レートは、この有効桁数へと丸められます。有効な値は`3`から`15`、または無効にするための`0`です{% amendment-disclaimer name="TickSize" /%} |
| `WalletLocator`    | 文字列           | UInt256           |  _（省略可）_ 任意の256ビット値です。指定された場合、この値はアカウントの設定の一部として保存さ れますが、固有の定義や要件を持ちません。 |
| `WalletSize`       | 数値           | UInt32            |  _（省略可）_ 使用されません。このフィールドはAccountSetトランザクションで有効ですが、何の機能もありません |

(全てのフィールドは任意です。)

これらのオプションがいずれも指定されていない場合、AccountSetトランザクションは（取引コストの消却以外に）意味がありません。詳細は、[トランザクションのキャンセルまたはスキップ](../../../../concepts/transactions/finality-of-results/canceling-a-transaction.md)をご覧ください。

## Domain

`Domain`フィールドは、ドメインのASCII小文字を表す16進文字列で表現します。例えば、ドメイン*example.com*は`"6578616D706C652E636F6D"`として表現します。

`Domain`フィールドをアカウントから削除するには、Domainを空文字列に設定してAccountSetを送信します。

アカウントの`Domain`フィールドには任意のドメインを挿入できます。アカウントとドメインが同一の人物または企業に属していることを証明するには、「双方向リンク」を確立することをお勧めします。

- 所有するアカウントに対して、所有するドメインを`Domain`フィールドで設定します。
- そのドメインのWebサイトで、所有アカウントをリストするテキストファイルをホスティングし、必要に応じて、XRP Ledgerの用途に関するその他の情報も記述します。慣例上、このファイルの名前は[xrp-ledger.toml file](../../../xrp-ledger-toml.md)とします。

## AccountSetのフラグ

アカウントについて、有効または無効にできる複数のオプションが用意されています。アカウントのオプションは、状況に応じてさまざまなタイプのフラグで表現します。

* `AccountSet`タイプのトランザクションについては、`SetFlag`パラメーターとして渡すことでオプションを有効にしたり、`ClearFlag`パラメーターとして渡すことでオプションを無効にしたりできる複数の「AccountSetフラグ」が用意されています（プレフィクスは**asf**）。
* `AccountSet`タイプのトランザクションについては、`Flags`パラメーターとして渡すことでアカウントの特定のオプションを有効または無効にできる複数のトランザクションフラグが用意されています（プレフィクスは**tf**）。このタイプの利用はお勧めしません。新しいアカウントオプションには、対応するトランザクションフラグ（tf）が存在しません。
* `AccountRoot`レジャーオブジェクトタイプには、レジャー固有のフラグが用意されています（プレフィクスは**lsf**）。これらのフラグは、特定のレジャーに含まれている特定のアカウントオプションの状態を表します。これらの設定は、トランザクションによって変更されるまで適用されます。

アカウントのフラグを有効または無効にする手段としてお勧めするのは、AccountSetトランザクションの`SetFlag`パラメーターと`ClearFlag`パラメーターを使用する方法です。AccountSetのフラグは、名前が**asf**で始まります。

どのフラグも、デフォルトでは無効になっています。

使用できるAccountSetのフラグは、以下のとおりです。

| フラグの名前                        | 10進値 | 説明   |
|:----------------------------------|:------|:--------------|
| `asfAccountTxnID`                 | 5     | このアカウントの直近のトランザクションのIDを追跡します。[AccountTxnID](../common-fields.md#accounttxnid)については必須です。 |
| `asfAllowTrustLineClawback`       | 16      | アカウントの発行したトークンを回収する機能を有効にします。 {% amendment-disclaimer name="Clawback" /%}　所有者ディレクトリが存在する場合はClawback機能を有効にできません。つまり、トラストラインやオファー、エスクロー、ペイメントチャネル、チェック、または署名者リストを設定する前に行う必要があります。このフラグは、有効にした後は無効にできません。|
| `asfAuthorizedNFTokenMinter`      | 10    | このアカウントの代わりに、別のアカウントが非代替性トークン（NFToken）をミントすることを許可するために使用します。認可されたアカウントを[AccountRoot](../../ledger-data/ledger-entry-types/accountroot.md)オブジェクトの`NFTokenMinter`フィールドで指定します。認可されたアカウントを削除するには、このフラグを有効にして`NFTokenMinter`フィールドを省略します。 {% amendment-disclaimer name="NonFungibleTokensV1_1" /%} |
| `asfDefaultRipple`                | 8     | このアカウントのトラストラインでの[リップリング](../../../../concepts/tokens/fungible-tokens/rippling.md)をデフォルトで有効にします。 |
| `asfDepositAuth`                  | 9     | このアカウントに対して[Deposit Authorization](../../../../concepts/accounts/depositauth.md)を有効にします {% amendment-disclaimer name="DepositAuth" /%}  |
| `asfDisableMaster`                | 4     | マスターキーペアの使用を禁止します。[レギュラーキー](../../../../concepts/accounts/cryptographic-keys.md)や[署名者リスト](../../../../concepts/accounts/multi-signing.md)など、トランザクションに署名するための別の手段がアカウントで設定されている場合のみ有効にできます。 |
| `asfDisallowIncomingCheck`        | 13    | チェックの着信をブロックします。{% amendment-disclaimer name="DisallowIncoming" /%} |
| `asfDisallowIncomingNFTokenOffer` | 12    | NFTokenOffersの着信をブロックします。{% amendment-disclaimer name="DisallowIncoming" /%} |
| `asfDisallowIncomingPayChan`      | 14    | ペイメントチャネルの着信をブロックします。{% amendment-disclaimer name="DisallowIncoming" /%} |
| `asfDisallowIncomingTrustline`    | 15    | トラストラインの着信をブロックします。{% amendment-disclaimer name="DisallowIncoming" /%} |
| `asfDisallowXRP`                  | 3     | XRPがこのアカウントに送信されないようにします（勧告的なもので、XRP Ledgerのプロトコルでは強制されません）。 |
| `asfGlobalFreeze`                 | 7     | このアカウントによって発行されたすべての資産を[フリーズ](../../../../concepts/tokens/fungible-tokens/freezes.md)します。 |
| `asfNoFreeze`                     | 6     | [個々のトラストラインのフリーズまたはGlobal Freezeの無効化](../../../../concepts/tokens/fungible-tokens/freezes.md)の機能を永続的に放棄します。このフラグは、有効にした後は無効にできません。 |
| `asfRequireAuth`                  | 2     | このアドレスによって発行された残高をユーザが保持することについて、承認を要求します。アドレスにトラストラインが接続されていない場合のみ有効にできます。 |
| `asfRequireDest`                  | 1     | トランザクションをこのアカウントに送信するための宛先タグを要求します。 |

参考のため、各AccountSetフラグに対応するレジャーフラグは以下のとおりです。

| AccountSetフラグの名前             | 対応するレジャーフラグ               |
|:----------------------------------|:----------------------------------|
| `asfAccountTxnID`                 | （なし）                           |
| `asfAllowTrustLineClawback` | `lsfAllowTrustlineClawback` |
| `asfAuthorizedNFTokenMinter`      | （なし）                            |
| `asfDefaultRipple`                | `lsfDefaultRipple`                |
| `asfDepositAuth`                  | `lsfDepositAuth`                  |
| `asfDisableMaster`                | `lsfDisableMaster`                |
| `asfDisallowIncomingCheck`        | `lsfDisallowIncomingCheck`        |
| `asfDisallowIncomingNFTokenOffer` | `lsfDisallowIncomingNFTokenOffer` |
| `asfDisallowIncomingPayChan`      | `lsfDisallowIncomingPayChan`      |
| `asfDisallowIncomingTrustline`    | `lsfDisallowIncomingTrustline`    |
| `asfDisallowXRP`                  | `lsfDisallowXRP`                  |
| `asfGlobalFreeze`                 | `lsfGlobalFreeze`                 |
| `asfNoFreeze`                     | `lsfNoFreeze`                     |
| `asfRequireAuth`                  | `lsfRequireAuth`                  |
| `asfRequireDest`                  | `lsfRequireDestTag`               |

`asfDisableMaster`フラグまたは`asfNoFreeze`フラグを有効にするには、マスターキーペアで署名することによって[トランザクションを承認](../../../../concepts/transactions/index.md#トランザクションの承認)する必要があります。レギュラーキーペアやマルチ署名を使用することはできません。レギュラーキーペアまたはマルチ署名を使用すると、`asfDisableMaster`を無効にする（つまり、マスターキーペアを再び有効にする）ことができます。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.28.0" %}新規: rippled 0.28.0{% /badge %}

以下の[トランザクションフラグ](../common-fields.md#flagsフィールド)はAccountSetタイプのトランザクションに固有のもので、同様の目的を果たしますが、使用することはお勧めしません。限られたスペースのため、いくつかの設定には関連する `tf` フラグがありません。また、新しい `tf` フラグは `AccountSet` トランザクションタイプには追加されていません。一つのトランザクションで複数の設定を有効にするには、`tf`フラグと`asf`フラグを組み合わせて使用することができます。

| フラグの名前          | 16進値        | 10進値         | 後継のAccountSetのフラグ |
|:--------------------|:-------------|:--------------|:----------------------------|
| `tfRequireDestTag`  | `0x00010000` | 65536         | asfRequireDest（SetFlag）    |
| `tfOptionalDestTag` | `0x00020000` | 131072        | asfRequireDest（ClearFlag）  |
| `tfRequireAuth`     | `0x00040000` | 262144        | asfRequireAuth（SetFlag）    |
| `tfOptionalAuth`    | `0x00080000` | 524288        | asfRequireAuth（ClearFlag）  |
| `tfDisallowXRP`     | `0x00100000` | 1048576       | asfDisallowXRP（SetFlag）    |
| `tfAllowXRP`        | `0x00200000` | 2097152       | asfDisallowXRP（ClearFlag）  |

{% admonition type="warning" name="注意" %}トランザクションに含まれている`tf`フラグと`asf`フラグの数値は、レジャーに含まれている静的なアカウントに設定された値と合致しません。レジャーに含まれているアカウントのフラグを読み取るには、[`AccountRoot`フラグ](../../ledger-data/ledger-entry-types/accountroot.md#accountrootのフラグ)をご覧ください。{% /admonition %}


### 着信トランザクションのブロック

目的が不明確な着信トランザクションは、顧客による誤りを識別し、誤りに応じて、アカウントへの払い戻しや残高の調整を実施しなければならない場合がある金融機関にとって、不都合な存在です。`asfRequireDest`フラグと`asfDisallowXRP`フラグは、理由が不明確な状態で資金が誤って送金されることのないよう、ユーザを保護することを目的としています。

例えば、宛先タグは通常、金融機関が支払いを受領したときに、保有しているどの残高に入金するのかを識別するために使用されます。宛先タグが省略されていると、入金先のアカウントが明確でない場合があり、払い戻しが必要になるなどの問題が発生します。`asfRequireDest`タグを使用すると、着信するすべての支払いに宛先タグが必ず設定され、他のユーザから、宛先の不明な支払いが誤って送金される問題が発生しにくくなります。

XRP以外の通貨に関しては、それらの通貨のトラストラインを作成しないことで、無用な支払いの受入れを防止できます。XRPでは信頼が必須ではないことから、ユーザによるアカウントへのXRPの送金を抑止するには、`asfDisallowXRP`フラグを使用します。ただし、このフラグによってアカウントが使用不可になる場合があるため、`rippled`では適用されません（このフラグを無効にしたトランザクションを送信するための十分なXRPがアカウントになかった場合、アカウントは完全に使用不可になります）。代わりに、クライアントアプリケーションでは、`asfDisallowXRP`フラグが有効なアカウントへのXRPの支払いを禁止または抑止します。

_すべての_ 支払いの着信をブロックしたい場合、[Deposit Authorization](../../../../concepts/accounts/depositauth.md)を有効にすることができます。これは、あなたのアカウントが[準備金要件](../../../../concepts/accounts/reserves.md)を下回らない限り、たとえXRPであっても、あらゆるトランザクションからの送金をブロックします。

[DisallowIncoming amendment][] が有効化されている場合、着信するすべてのチェック、NFTokenOffer、ペイメントチャネル、およびトラストラインをブロックするオプションもあります。これらのオブジェクトを着信することは一般的に無害ですが、アカウントを削除することができなくなる場合があり、自分が作成したオブジェクトのリストに予期しないオブジェクトが混ざり混乱することがあります。オブジェクトの着信をブロックするには、次のアカウントフラグのいずれかを使用します。

- `asfDisallowIncomingCheck` - チェックオブジェクト用
- `asfDisallowIncomingNFTOffer` - NFTokenOfferオブジェクト用
- `asfDisallowIncomingPayChan` - PayChannelオブジェクト用
- `asfDisallowIncomingTrustline` - RippleState（トラストライン）オブジェクト用

これらのレジャーエントリを作成するトランザクションが発生する場合、宛先アカウントに対応するフラグが有効になっている場合、トランザクションは`tecNO_PERMISSION`という結果コードで失敗します。Deposit Authorizationとは異なり、これらの設定は一般的に支払いを受け取ることを妨げません。また、この設定を有効にしても、自分自身がこれらのタイプのオブジェクトを作成することを妨げません（もちろん、トランザクションの宛先がこの設定を使用している場合を除きます）。

## TransferRate

TransferRateフィールドは、ユーザの発行する通貨を相手方が送金するときに請求する手数料を指定します。

HTTPおよびWebSocketのAPIでは、TransferRate（相手方に10億単位の通貨を送金するのに必要な金額）は整数で表現します。例えば、送金手数料が20%である場合、値を`1200000000`と表現します。  値を1000000000未満にすることはできません（この値未満にした場合、トランザクションの送信について金銭の引き渡しが発生することになり、攻撃に利用されるおそれがあります）。`1000000000`の短縮形として、手数料なしを意味する`0`を指定できます。

詳細は、[送金手数料](../../../../concepts/tokens/fungible-tokens/transfer-fees.md)をご覧ください。

## NFTokenMinter

認可ミンターを削除するには、`ClearFlag`を10（`asfAuthorizedNFTokenMinter`）に設定し、`NFTokenMinter`フィールドを省略します。


{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
