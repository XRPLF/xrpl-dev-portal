# PaymentChannelClaim
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/PayChan.cpp "Source")

_[PayChan Amendment][]が必要です。_

Payment Channelに対しXRPを請求するか、Payment Channelの有効期限を調整するか、またはこの両方の操作を行います。このトランザクションは、指定されたChannelでのトランザクション送信者の役割に応じてさまざまに利用できます。

Channelの**支払元アドレス**は以下の操作を実行できます。

- 署名済みクレームの有 _無_ にかかわらずChannelから宛先へXRPを送金します。
- Channelの`SettleDelay`が経過した時点で即時にChannelが有効期限切れになるように設定します。
- 保留中の`Expiration`時刻をクリアします。
- クレームを最初に処理するかどうかに関わらず、Channelを即時に閉鎖します。ChannelにXRPが残っている場合、支払元アドレスはそのChannelを即時に閉鎖できません。

Channelの**宛先アドレス**は以下の操作を実行できます。

- 署名済みクレームを使用してChannelからXRPを受領します。
- クレームの処理が完了したらChannelを即時に閉鎖し、未請求のXRPをすべてChannelの支払元に返金します。

このトランザクションを送信する**すべてのアドレス**は以下の操作を実行できます。

- Channelの`Expiration`または`CancelAfter`の時刻が前のレジャーの閉鎖時刻よりも古い場合にはChannelが閉鎖します。有効な形式のPaymentChannelClaimトランザクションでは、トランザクションの内容に関わらず常にこの効果があります。

## {{currentpage.name}} JSONの例

```json
{
 "Channel": "C1AE6DDDEEC05CF2978C0BAD6FE302948E9533691DC749DCDD3B9E5992CA6198",
 "Balance": "1000000",
 "Amount": "1000000",
 "Signature": "30440220718D264EF05CAED7C781FF6DE298DCAC68D002562C9BF3A07C1E721B420C0DAB02203A5A4779EF4D2CCC7BC3EF886676D803A9981B928D3B8ACA483B80ECA3CD7B9B",
 "PublicKey": "32D2471DB72B27E3310F355BB33E339BF26F8392D5A93D3BC0FC3B566612DA0F0A"
}
```

<!--{# TODO: replace the above example with one where the channel, pubkey, signature, and balance match #}-->

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->


| フィールド       | JSONの型 | [内部の型][] | 説明                    |
|:------------|:----------|:------------------|:-------------------------------|
| `Channel`   | 文字列    | Hash256           | Channelの一意のID（64文字の16進数文字列）。 |
| `Balance`   | 文字列    | Amount            | _（省略可）_ このクレームの処理後にこのChannelから送金される[XRP、drop単位][]。XRPを送金する場合に必須です。Channelからこれまでに送金された総額よりも大きく、署名済みクレームの`Amount`よりも少ない額である必要があります。Channelを閉鎖する場合を除き、指定する必要があります。 |
| `Amount`    | 文字列    | Amount            | _（省略可）_`Signature`により承認された[XRP、drop単位][]の額。これは、署名済みメッセージの額に一致している必要があります。これは、Channelが利用できるXRPの累計額であり、以前に精算されたXRPを含みます。 |
| `Signature` | 文字列    | Blob              | _（省略可）_ クレームの署名です（16進数）。署名付きメッセージには、Channel IDとクレームの額が含まれています。トランザクションの送信者がChannelの支払元アドレスでない場合には必須です。 |
| `PublicKey` | 文字列    | Blob              | _（省略可）_ 署名に使用する公開鍵（16進数）。公開鍵はレジャーに保管されているこのChannelの`PublicKey`と一致している必要があります。トランザクションの送信者がChannelの支払元アドレスでない場合には必須です。また`Signature`フィールドは省略されます。（`rippled`がトランザクションをレジャーに適用する前に署名の有効性をチェックできるように、トランザクションにPubKeyが指定されています。） |


## PaymentChannelClaimフラグ

PaymentChannelClaimタイプのトランザクションについては、[`Flags`フィールド](transaction-common-fields.html#flagsフィールド)で以下の値が追加でサポートされます。

| フラグ名 | 16進数値  | 10進数値 | 説明                         |
|:----------|:-----------|:--------------|:------------------------------------|
| `tfRenew` | 0x00010000 | 65536         | Channelの`Expiration`時刻をクリアします。（`Expiration`は、Channelの変更できない`CancelAfter`時刻とは異なります。）このフラグは、Payment Channelの支払元アドレスだけが使用できます。 |
| `tfClose` | 0x00020000 | 131072        | Channelの閉鎖を要求します。このフラグは、Channelの支払元アドレスと宛先アドレスだけが使用できます。このフラグにより、現在のクレームの処理後にChannelにこれ以上のXRPが割り当てられない場合、または宛先アドレスが使用している場合に、Channelが即時に閉鎖されます。XRPがまだChannelに保有されているときに、支払元アドレスがこのフラグを使用した場合、`SettleDelay`秒の経過後にChannelが閉鎖するようにスケジュールされます。（具体的には、Channelの`Expiration`は、前のレジャーの閉鎖時刻にChannelの`SettleDelay`の時間を加算した時刻に設定されます。ただし、Channelにこの時刻よりも早い`Expiration` 時刻がすでに設定されている場合を除きます。）XRPがまだChannelに保有されているときに、宛先アドレスがこのフラグを使用した場合、クレーム処理後に残っているXRPはすべて支払元アドレスに返金されます。 |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
