# AccountSet

[[ソース]<br>](https://github.com/ripple/rippled/blob/f65cea66ef99b1de149c02c15f06de6c61abf360/src/ripple/app/transactors/SetAccount.cpp "ソース")

AccountSetトランザクションは、[XRP Ledgerのアカウント](accountroot.html)のプロパティーを修正します。

## {{currentpage.name}}のJSONの例

```json
{
    "TransactionType": "AccountSet",
    "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "12",
    "Sequence": 5,
    "Domain": "6578616D706C652E636F6D",
    "SetFlag": 5,
    "MessageKey": "rQD4SqHJtDxn5DDL7xNnojNa3vxS1Jx5gv"
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->


| フィールド            | JSONの型        | [内部の型][] | 説明        |
|:-----------------|:-----------------|:------------------|:-------------------|
| [ClearFlag][]    | 数値           | UInt32            |  _（省略可）_ このアカウントについてオプションを無効にするためのフラグの一意識別子。 |
| [Domain][]       | 文字列           | Blob              |  _（省略可）_ このアカウントを保有するドメインのASCII小文字を表現する16進文字列。 |
| EmailHash        | 文字列           | Hash128           |  _（省略可）_ アバターイメージの生成に使用されるメールアドレスのハッシュ。一般的に、クライアントは[Gravatar](http://en.gravatar.com/site/implement/hash/)を使用してこのイメージを表示しています。 |
| MessageKey       | 文字列           | Blob              |  _（省略可）_ 暗号化されたメッセージをこのアカウントに送信するための公開鍵。 |
| [SetFlag][]      | 数値           | UInt32            |  _（省略可）_ このアカウントについてオプションを有効にするための整数フラグ。 |
| [TransferRate][] | 符号なし整数 | UInt32            |  _（省略可）_ ユーザーがこのアカウントの発行済み通貨を送金するときに請求される手数料。通貨単位の10億分の1で表現されます。手数料なしを意味する特殊なケースの`0`を除いて、`2000000000`より大きくしたり、`1000000000`より小さくしたりすることはできません。 |
| [TickSize][]     | 符号なし整数 | UInt8             | _（省略可）_このアドレスによって発行されている通貨が関係するオファーに使用する為替レートの呼値の単位。それらのオファーの為替レートは、この有効桁数へと丸められます。有効な値は`3`から`15`、または無効にするための`0`です_（[TickSize Amendment][]が必要です）。_ |
| WalletLocator    | 文字列           | Hash256           |  _（省略可）_ 使用されません。 |
| WalletSize       | 数値           | UInt32            |  _（省略可）_ 使用されません。 |

[ClearFlag]: #accountsetのフラグ
[Domain]: #domain
[SetFlag]: #accountsetのフラグ
[TickSize]: ticksize.html
[TransferRate]: accountset.html#transferrate

これらのオプションがいずれも指定されていない場合、AccountSetトランザクションは（取引コストの消却以外に）意味がありません。詳細は、[トランザクションのキャンセルまたはスキップ](cancel-or-skip-a-transaction.html)を参照してください。

## Domain

`Domain`フィールドは、ドメインのASCII小文字を表す16進文字列で表現します。例えば、ドメイン*example.com*は`"6578616D706C652E636F6D"`として表現します。

`Domain`フィールドをアカウントから削除するには、Domainを空文字列に設定してAccountSetを送信します。

アカウントの`Domain`フィールドには任意のドメインを挿入できます。アカウントとドメインが同一の人物または企業に属していることを証明するには、「双方向リンク」を確立することをお勧めします。

- 所有するアカウントに対して、所有するドメインを`Domain`フィールドで設定します。
- そのドメインのWebサイトで、所有アカウントをリストするテキストファイルをホスティングし、必要に応じて、XRP Ledgerの用途に関するその他の情報も記述します。慣例上、このファイルの名前は`ripple.txt`とします。例については、<https://ripple.com/ripple.txt>を参照してください。
    **注意:** 中間者攻撃を防止するには、最新のTLS証明書を使用してHTTPSでWebサイトを提供します。

## AccountSetのフラグ

アカウントについて、有効または無効にできる複数のオプションが用意されています。アカウントのオプションは、状況に応じてさまざまなタイプのフラグで表現します。

* `AccountSet`タイプのトランザクションについては、`SetFlag`パラメーターとして渡すことでオプションを有効にしたり、`ClearFlag`パラメーターとして渡すことでオプションを無効にしたりできる複数の「AccountSetフラグ」が用意されています（プレフィクスは**asf**）。
* `AccountSet`タイプのトランザクションについては、`Flags`パラメーターとして渡すことでアカウントの特定のオプションを有効または無効にできる複数のトランザクションフラグが用意されています（プレフィクスは**tf**）。このタイプの利用はお勧めしません。新しいアカウントオプションには、対応するトランザクションフラグ（tf）が存在しません。
* `AccountRoot`レジャーオブジェクトタイプには、レジャー固有のフラグが用意されています（プレフィクスは**lsf**）。これらのフラグは、特定のレジャーに含まれている特定のアカウントオプションの状態を表します。これらの設定は、トランザクションによって変更されるまで適用されます。

アカウントのフラグを有効または無効にする手段としてお勧めするのは、AccountSetトランザクションの`SetFlag`パラメーターと`ClearFlag`パラメーターを使用する方法です。AccountSetのフラグは、名前が**asf**で始まります。

どのフラグも、デフォルトでは無効になっています。

使用できるAccountSetのフラグは、以下のとおりです。

| フラグの名前        | 10進値 | 対応するレジャーフラグ | 説明   |
|:-----------------|:--------------|:--------------------------|:--------------|
| asfAccountTxnID  | 5             | （なし）                    | このアカウントの直近のトランザクションのIDを追跡します。[AccountTxnID](transaction-common-fields.html#accounttxnid)については必須です。 |
| asfDefaultRipple | 8             | lsfDefaultRipple          | このアカウントのトラストラインでの[リップリング](rippling.html)をデフォルトで有効にします。[新規: rippled 0.27.3][] |
| asfDepositAuth   | 9             | lsfDepositAuth            | このアカウントに対して[Deposit Authorization](depositauth.html)を有効にします _（[DepositAuth Amendment][]が必要）。_  |
| asfDisableMaster | 4             | lsfDisableMaster          | マスターキーペアの使用を禁止します。[レギュラーキー](cryptographic-keys.html)や[署名者リスト](multi-signing.html)など、トランザクションに署名するための別の手段がアカウントで設定されている場合のみ有効にできます。 |
| asfDisallowXRP   | 3             | lsfDisallowXRP            | XRPがこのアカウントに送信されないようにします（`rippled`ではなくクライアントアプリケーションによって履行されます）。 |
| asfGlobalFreeze  | 7             | lsfGlobalFreeze           | このアカウントによって発行されたすべての資産を[凍結](freezes.html)します。 |
| asfNoFreeze      | 6             | lsfNoFreeze               | [個々のトラストラインの凍結またはGlobal Freezeの無効化](freezes.html)の機能を永続的に放棄します。このフラグは、有効にした後は無効にできません。 |
| asfRequireAuth   | 2             | lsfRequireAuth            | このアドレスによって発行された残高をユーザーが保持することについて、承認を要求します。アドレスにトラストラインが接続されていない場合のみ有効にできます。 |
| asfRequireDest   | 1             | lsfRequireDestTag         | トランザクションをこのアカウントに送信するための宛先タグを要求します。 |

`asfDisableMaster`フラグまたは`asfNoFreeze`フラグを有効にするには、マスターキーペアで署名することによって[トランザクションを承認](transaction-basics.html#取引の承認)する必要があります。レギュラーキーペアやマルチ署名を使用することはできません。レギュラーキーペアまたはマルチ署名を使用すると、`asfDisableMaster`を無効にする（つまり、マスターキーペアを再び有効にする）ことができます。[新規: rippled 0.28.0][]

以下の[トランザクションフラグ](transaction-common-fields.html#flagsフィールド)はAccountSetタイプのトランザクションに固有のもので、同様の目的を果たしますが、使用することはお勧めしません。

| フラグの名前         | 16進値  | 10進値 | 後継のAccountSetのフラグ |
|:------------------|:-----------|:--------------|:----------------------------|
| tfRequireDestTag  | 0x00010000 | 65536         | asfRequireDest（SetFlag）    |
| tfOptionalDestTag | 0x00020000 | 131072        | asfRequireDest（ClearFlag）  |
| tfRequireAuth     | 0x00040000 | 262144        | asfRequireAuth（SetFlag）    |
| tfOptionalAuth    | 0x00080000 | 524288        | asfRequireAuth（ClearFlag）  |
| tfDisallowXRP     | 0x00100000 | 1048576       | asfDisallowXRP（SetFlag）    |
| tfAllowXRP        | 0x00200000 | 2097152       | asfDisallowXRP（ClearFlag）  |

**注意:** トランザクションに含まれている`tf`フラグと`asf`フラグの数値は、レジャーに含まれている静的なアカウントに設定された値と合致しません。レジャーに含まれているアカウントのフラグを読み取るには、[`AccountRoot`フラグ](accountroot.html#accountrootのフラグ)を参照してください。


### 着信トランザクションのブロック

目的が不明確な着信トランザクションは、顧客による誤りを識別し、誤りに応じて、アカウントへの払い戻しや残高の調整を実施しなければならない場合がある金融機関にとって、不都合な存在です。`asfRequireDest`フラグと`asfDisallowXRP`フラグは、理由が不明確な状態で資金が誤って送金されることのないよう、ユーザーを保護することを目的としています。

例えば、宛先タグは通常、金融機関が支払いを受領したときに、保有しているどの残高に入金するのかを識別するために使用されます。宛先タグが省略されていると、入金先のアカウントが明確でない場合があり、払い戻しが必要になるなどの問題が発生します。`asfRequireDest`タグを使用すると、着信するすべての支払いに宛先タグが必ず設定され、他のユーザーから、宛先の不明な支払いが誤って送金される問題が発生しにくくなります。

XRP以外の通貨に関しては、それらの通貨のトラストラインを作成しないことで、無用な支払いの受入れを防止できます。XRPでは信頼が必須ではないことから、ユーザーによるアカウントへのXRPの送金を抑止するには、`asfDisallowXRP`フラグを使用します。ただし、このフラグによってアカウントが使用不可になる場合があるため、`rippled`では適用されません（このフラグを無効にしたトランザクションを送信するための十分なXRPがアカウントになかった場合、アカウントは完全に使用不可になります）。代わりに、クライアントアプリケーションでは、`asfDisallowXRP`フラグが有効なアカウントへのXRPの支払いを禁止または抑止します。

## TransferRate

TransferRateフィールドは、ユーザーの発行する通貨を相手方が送金するときに請求する手数料を指定します。詳細は、[送金手数料](transfer-fees.html)を参照してください。

`rippled`のWebSocketおよびJSON-RPCのAPIでは、TransferRate（相手方に10億単位の通貨を送金するのに必要な金額）は整数で表現します。例えば、送金手数料が20%である場合、値を`1200000000`と表現します。  値を1000000000未満にすることはできません（この値未満にした場合、トランザクションの送信について金銭の引き渡しが発生することになり、攻撃に利用されるおそれがあります）。1000000000の短縮形として、手数料なしを意味する0を指定できます。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
