# PaymentChannelFund
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/PayChan.cpp "Source")

_[PayChan Amendment][]が必要です。_

オープンPayment ChannelにXRPを追加するか、Channelの有効期限を更新するか、またはこの両方を行います。このトランザクションは、Channelの支払元アドレスだけが使用できます。（他のアドレスからのトランザクションはエラー`tecNO_PERMISSION`で失敗します。）

PaymentChannelFundの例:

```json
{
   "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "TransactionType": "PaymentChannelFund",
   "Channel": "C1AE6DDDEEC05CF2978C0BAD6FE302948E9533691DC749DCDD3B9E5992CA6198",
   "Amount": "200000",
   "Expiration": 543171558
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->

| フィールド     | JSONの型 | [内部の型][]        | 説明                   |
|:-------------|:---------|:------------------|:------------------------------|
| `Channel`    | 文字列    | Hash256           | 資金供給するChannelの一意のID（64文字の16進数文字列）。 |
| `Amount`     | 文字列    | Amount            | Channelに追加する[XRP、drop単位][]の額。Channelの有効期限を設定し、XRPを追加しない場合は、これを`"0"`に設定します。 |
| `Expiration` | 数値      | UInt32            | _（省略可）_ Channelに新たに設定する`Expiration`の時刻（Rippleエポック以降の経過秒数）。現行時刻にChannelの`SettleDelay`を加えた時刻よりも後であるか、またはChannelの既存の`Expiration`よりも後である必要があります。`Expiration`時刻の経過後には、トランザクションがそのChannelにアクセスするとChannelが閉鎖し、トランザクションの通常の処理は行われません。Channelの閉鎖時には未使用のXRPはすべて支払元アドレスに返金されます。（`Expiration`は、Channelの不変の`CancelAfter`時刻とは別のものです。）詳細は、[PayChannelレジャーオブジェクトタイプ](paychannel.html)を参照してください。 |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
