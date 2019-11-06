# PaymentChannelCreate
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/PayChan.cpp "Source")

_[PayChan Amendment][]が必要です。_

一方向のChannelを作成し、XRPを供給します。このトランザクションを送信するアドレスは、Payment Channelの「支払元アドレス」になります。

## {{currentpage.name}} JSONの例

```json
{
   "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "TransactionType": "PaymentChannelCreate",
   "Amount": "10000",
   "Destination": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
   "SettleDelay": 86400,
   "PublicKey": "32D2471DB72B27E3310F355BB33E339BF26F8392D5A93D3BC0FC3B566612DA0F0A",
   "CancelAfter": 533171558,
   "DestinationTag": 23480,
   "SourceTag": 11747
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->


| フィールド            | JSONの型 | [内部の型][] | 説明               |
|:-----------------|:----------|:------------------|:--------------------------|
| `Amount`         | 文字列    | Amount            | 送金元の残高から差し引いてこのChannelに留保する[XRP、drop単位][]の額。このChannelのオープン時には、XRPを`Destination`アドレスにのみ移動できます。Channelが閉鎖すると、未請求のXRPは支払元アドレスの残高に戻されます。 |
| `Destination`    | 文字列    | AccountID         | このChannelに対するXRPクレームを受け取るアドレス。Channelの「宛先アドレス」とも呼ばれます。送金元（`Account`）と同一にはできません。 |
| `SettleDelay`    | 数値    | UInt32            | Channelに未請求のXRPがある場合に、支払元アドレスがそのChannelを閉鎖するまでに待機する時間。 |
| `PublicKey`      | 文字列    | Blob              | 支払元がこのChannelに対するクレームに署名するときに使用する公開鍵またはキーペア（16進数）。secp256k1公開鍵またはEd25519公開鍵を指定できます。 <!-- STYLE_OVERRIDE: will --> |
| `CancelAfter`    | 数値    | UInt32            | _（省略可）_ このChannelの有効期限（[Rippleエポック以降の経過秒数][]）。この時刻の経過後にトランザクションがこのChannelを変更しようとすると、このChannelは閉鎖し、Channelは変更されません。この値は変更できません。Channelはこの時刻よりも早い時点で閉鎖できますが、この時刻の経過後にもオープンしたままにすることはできません。 |
| `DestinationTag` | 数値    | UInt32            | _（省略可）_ このPayment Channelの宛先（宛先アドレスのホスティングされている受取人など） を詳しく指定するための任意のタグ。 |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
