---
seo:
    description: Payment ChannelにXRPを追加します。
labels:
    - Payment Channel
---
# PaymentChannelFund
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/PayChan.cpp "Source")

Payment ChannelにXRPを追加する、有効期限の更新も可能。このトランザクションは、Channelの支払元アドレスだけが使用できます。

{% amendment-disclaimer name="PayChan" /%}

## {% $frontmatter.seo.title %} JSONの例

```json
{
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "TransactionType": "PaymentChannelFund",
    "Channel": "C1AE6DDDEEC05CF2978C0BAD6FE302948E9533691DC749DCDD3B9E5992CA6198",
    "Amount": "200000",
    "Expiration": 543171558
}
```

{% tx-example txid="877FA6E2FF8E08597D1F24E30BE8E52D0C9C06F0D620C5721E55622B6A632DFF" /%}

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド    | JSONの型  | [内部の型][]       | 説明                          |
|:-------------|:----------|:------------------|:------------------------------|
| `Channel` | 文字列 | UInt256 | 資金供給するChannelの一意のID（64文字の16進文字列）。 |
| `Amount` | 文字列 | Amount | Channelに追加する[XRPのdrop数][]の正の額。 |
| `Expiration` | 数値 | UInt32 | _（省略可）_ Channelに新たに設定する`Expiration`の時刻（Rippleエポック以降の経過秒数）。現行時刻にChannelの`SettleDelay`を加えた時刻よりも後であるか、またはChannelの既存の`Expiration`よりも後である必要があります。`Expiration`時刻の経過後には、トランザクションがそのChannelにアクセスするとChannelが閉鎖し、トランザクションの通常の処理は行われません。Channelの閉鎖時には未使用のXRPはすべて支払元アドレスに返金されます。（`Expiration`は、Channelの不変の`CancelAfter`時刻とは別のものです。）詳細は、[PayChannelレジャーオブジェクトタイプ](../../ledger-data/ledger-entry-types/paychannel.md)をご覧ください。 |

## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは、次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード | 説明        |
|:-----------|:------------|
| `tecINSUFFICIENT_RESERVE` | 支払元アカウントが[必要準備金](../../../../concepts/accounts/reserves.md)のXRPを持っていません。|
| `tecNO_DST`               | 送金先アカウントが削除されていました。 この可能性は、Payment Channelの作成時は[fixPayChanRecipientOwnerDir amendment](/resources/known-amendments.md#fixpaychanrecipientownerdir)が有効になった（2020-05-01）前の場合だけです。|
| `tecNO_ENTRY`             | `Channel`フィールドに指定されたPayment Channelがありません。 |
| `tecNO_PERMISSION`        | トランザクションの送金元アカウントはPayment Channelの支払元アカウントではありまっせん。|
| `tecUNFUNDED`             | 送金元アカウントは[必要準備金](../../../../concepts/accounts/reserves.md)以上に指定されたXRPを持っていません。|
| `temBAD_AMOUNT`           | トランザクションの`Amount`フィールドの指定が正しくない。負もゼロも無効です。|
| `temBAD_EXPIRATION`       | `Expiration`フィールドの指定が正しくない。|

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
