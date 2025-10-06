---
seo:
    description: 新しいペイメントチャネルを作成します。
labels:
    - Payment Channel
---
# PaymentChannelCreate
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/PayChan.cpp "ソース")

[ペイメントチャンネル](../../../../concepts/payment-types/payment-channels.md)を作成し、XRPで資金を供給します。このトランザクションを送信するアドレスが、ペイメントチャネルの「送信元アドレス」となります。

{% amendment-disclaimer name="PayChan" /%}

## {% $frontmatter.seo.title %} JSONの例

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

{% tx-example txid="711C4F606C63076137FAE90ADC36379D7066CF551E96DA6FE2BDAB5ECBFACF2B" /%}

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}


| フィールド            | JSONの型 | [内部の型][] | 説明               |
|:-----------------|:----------|:------------------|:--------------------------|
| `Amount`         | 文字列    | Amount            | 送金元の残高から差し引いてこのChannelに留保する[XRPのdrop数][]の額。このChannelのオープン時には、XRPを`Destination`アドレスにのみ移動できます。Channelが閉鎖すると、未請求のXRPは支払元アドレスの残高に戻されます。 |
| `Destination`    | 文字列    | AccountID         | このChannelに対するXRPクレームを受け取るアドレス。Channelの「宛先アドレス」とも呼ばれます。送金元（`Account`）と同一にはできません。 |
| `SettleDelay`    | 数値    | UInt32            | Channelに未請求のXRPがある場合に、支払元アドレスがそのChannelを閉鎖するまでに待機する時間。 |
| `PublicKey`      | 文字列    | Blob              | 送信元がこのチャネルに対する請求に使用する鍵ペアの33バイトの公開鍵を16進数で指定します。これはsecp256k1またはEd25519の公開鍵であることができます。キーペアの詳細については、[鍵の導出](../../../../concepts/accounts/cryptographic-keys.md#鍵導出) をご覧ください。 |
| `CancelAfter`    | 数値    | UInt32            | _（省略可）_ このChannelの有効期限（[Rippleエポック以降の経過秒数][]）。この時刻の経過後にトランザクションがこのChannelを変更しようとすると、このChannelは閉鎖し、Channelは変更されません。この値は変更できません。Channelはこの時刻よりも早い時点で閉鎖できますが、この時刻の経過後にもオープンしたままにすることはできません。 |
| `DestinationTag` | 数値    | UInt32            | _（省略可）_ このPayment Channelの宛先（宛先アドレスのホスティングされている受取人など） を詳しく指定するための任意のタグ。 |

`Destination` アカウントがペイメントチャネルの着信をブロックしている場合、トランザクションは結果コード`tecNO_PERMISSION` 失敗します。{% amendment-disclaimer name="DisallowIncoming" /%}

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
