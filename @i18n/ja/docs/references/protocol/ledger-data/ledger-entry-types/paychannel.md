---
html: paychannel.html
parent: ledger-entry-types.html
seo:
    description: 非同期XRP支払い用のチャネルです。
labels:
  - Payment Channel
---
# PayChannel
[[ソース]](https://github.com/XRPLF/rippled/blob/c0a0b79d2d483b318ce1d82e526bd53df83a4a2c/src/ripple/protocol/impl/LedgerFormats.cpp#L180-L198 "Source")

_（[PayChan Amendment][]により追加されました。）_

`PayChannel`エントリは1つの[支払いチャネル](../../../../concepts/payment-types/payment-channels.md)を表します。


## {% $frontmatter.seo.title %}のJSONの例

```json
{
  "Account": "rBqb89MRQJnMPq8wTwEbtz4kvxrEDfcYvt",
  "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Amount": "4325800",
  "Balance": "2323423",
  "PublicKey": "32D2471DB72B27E3310F355BB33E339BF26F8392D5A93D3BC0FC3B566612DA0F0A",
  "SettleDelay": 3600,
  "Expiration": 536027313,
  "CancelAfter": 536891313,
  "SourceTag": 0,
  "DestinationTag": 1002341,
  "DestinationNode": "0000000000000000",
  "Flags": 0,
  "LedgerEntryType": "PayChannel",
  "OwnerNode": "0000000000000000",
  "PreviousTxnID": "F0AB71E777B2DA54B86231E19B82554EF1F8211F92ECA473121C655BFC5329BF",
  "PreviousTxnLgrSeq": 14524914,
  "index": "96F76F27D8A327FC48753167EC04A46AA0E382E6F57F32FD12274144D00F1797"
}
```

## {% $frontmatter.seo.title %}のフィールド

[共通フィールド][]に加えて、{% $frontmatter.seo.title %}エントリは以下のフィールドを使用します。

| 名前                | JSONの型   | [内部の型][] | 必須? | 説明 |
|:--------------------|:---------|:------------|:----- |:-----|
| `Account`           | 文字列    | AccountID   | はい   | このPayment Channelを所有する支払元アドレス。これは、Channelを作成したトランザクションの送信側アドレスから取得されます。 |
| `Amount`            | 文字列    | Amount      | はい   | このChannelに割り当てられている [XRP、drop単位][]の合計です。これには宛先アドレスに支払われたXRPも含まれます。最初にChannelを作成したトランザクションにより設定され、支払元アドレスがPaymentChannelFundトランザクションを送信する場合に増加できます。 |
| `Balance`           | 文字列    | Amount      | はい   | このChannelがすでに支払った[XRP、drop単位][]の合計。この値と`Amount`フィールドの差異は、PaymentChannelClaimトランザクションの宛先アドレスに対して支払うことができるXRPの量を示します。Channelが閉鎖すると、残りの差額は支払元アドレスに返されます。 |
| `CancelAfter`       | 数値      | UInt32      | いいえ | _（省略可）_ このPayment Channelの不変の有効期限（[Rippleエポック以降の経過秒数][]）。この値が指定されており、前のレジャーの[`close_time`フィールド](../ledger-header.md)よりも小さい場合、Channelは有効期限切れです。これは、Channelを作成するトランザクションによりオプションで設定され、変更できません。 |
| `Destination`       | 文字列    | AccountID   | はい   | このPayment Channelの宛先アドレス。Payment Channelが開いている場合、このアドレスは、このChannelからXRPを受領できる唯一のアドレスです。これは、Channelを作成したトランザクションの`Destination`フィールドから取得されます。 |
| `DestinationTag`    | 数値      | UInt32      | いいえ | _（省略可）_ このPayment Channelの宛先（宛先アドレスのホスティングされている受取人など） を詳しく指定するための任意のタグ。 |
| `DestinationNode`   | 文字列    | UInt64      | いいえ | _（省略可）_ 宛先の所有者ディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。[fixPayChanRecipientOwnerDir Amendment][]を有効にする前に作成されたPayment Channelでは省略されています。 |
| `Expiration`        | 数値      | UInt32      | いいえ | _（省略可）_ このPayment Channelの変更可能な有効期限（[Rippleエポック以降の経過秒数][]）。この値が指定されており、前のレジャーの[`close_time`フィールド](../ledger-header.md)よりも小さい場合、Channelは有効期限切れです。詳細は、[Channel有効期限の設定](#channel有効期限の設定)をご覧ください。 |
| `LedgerEntryType`   | 文字列    | UInt16      | はい   | 値`0x0078`が文字列`PayChannel`にマッピングされている場合は、このオブジェクトがPayment Channelオブジェクトであることを示します。 |
| `OwnerNode`         | 文字列    | UInt64      | はい   | 支払元アドレスの所有者のディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。 |
| `PreviousTxnID`     | 文字列    | Hash256     | はい   | 最後にこのオブジェクトを変更したトランザクションの識別用ハッシュ。 |
| `PreviousTxnLgrSeq` | 数値      | UInt32      | はい   | 最後にこのオブジェクトを変更したトランザクションが記録された[レジャーインデックス][]。 |
| `PublicKey`         | 文字列    | PubKey      | はい   | このChannelに対するクレームの署名に使用できるキーペアの公開鍵（16進数）。有効なsecp256k1公開鍵またはEd25519公開鍵を指定できます。Channelを作成したトランザクションによって設定されます。Channelに対するクレームに使用される公開鍵と一致している必要があります。Channelの支払元アドレスは、署名付きクレームなしでこのChannelから宛先にXRPを送金することもできます。 |
| `SettleDelay`       | 数値      | UInt32      | はい   | ChannelにXRPがまだある場合に、支払元アドレスがそのChannelを閉鎖するまでに待機する秒数。値が小さい場合、支払元アドレスがChannelの閉鎖を要求した後で、宛先アドレスが未処理のクレームを精算できる時間が短くなります。32ビットの符号なし整数に収まる値（0～2^32-1）であれば任意の値を指定できます。これは、Channelを作成するトランザクションにより設定されます。 |
| `SourceTag`         | 数値      | UInt32      | いいえ | _（省略可）_ このPayment Channelの支払元（所有者のアドレスのホスティングされている受取人など） を詳しく指定するための任意のタグ。 |

## Channelの有効期限

Payment Channelの`Expiration`フィールドは、`CancelAfter`フィールドが表す変更不可能な有効期限とは対照的な変更可能な有効期限です。Channelの有効期限は常に、前のレジャーの[`close_time`フィールド](../ledger-header.md)を基準にしているものとみなされます。`PayChannel`オブジェクトの作成時には、`Expiration`フィールドが省略されます。`PayChannel`オブジェクトの`Expiration`フィールドはさまざまな方法で更新できます。要約すると、Channelが最初の閉鎖試行の操作の後、`SettleDelay`秒以上チャネルが常に開いたままであれば、Channelの支払元アドレスはChannelの`Expiration`を自由に設定できます。

Payment Channelが期限切れになると、新しいトランザクションだけが台帳の内容を変更できるため、最初は台帳に残ります。有効期限が切れた後にそのチャネルにアクセスするトランザクションがあると、トランザクション処理は自動的にそのチャネルを閉じます。期限切れのチャネルを閉じ、未使用のXRPを所有者に返却するには、何らかのアドレスがチャネルにアクセスする新しいPaymentChannelClaimまたはPaymentChannelFundトランザクションを送信する必要があります。


### 支払元アドレス

支払元アドレスは、PaymentChannelFundトランザクションタイプを使用して直接`Expiration`を設定できます。新しい値は、以下の早い方の値よりも前であってはなりません。

- 現在の`Expiration`値（設定されている場合）
- 前のレジャーの閉鎖時刻にChannelの`SettleDelay`を加算した値

つまり、有効期限がすでに設定されている場合、支払元アドレスは常に`Expiration`を遅らせることができます。支払元は、設定する新しい値が`SettleDelay`の秒数以上の値である限り、`Expiration`を早い値にするか、または`Expiration`がまだ設定されていない場合にこれを設定することができます。支払元アドレスが無効な`Expiration`の日付を設定しようとすると、トランザクションはエラーコード`temBAD_EXPIRATION`で失敗します。

支払元アドレスはPaymentChannelClaimトランザクションタイプの`tfClose`フラグを使用して`Expiration`を設定することもできます。このフラグが有効な場合、レジャーは自動的に`Expiration`を以下のいずれかの早い方の値に設定します。

- 現在の`Expiration`値（設定されている場合）
- 前のレジャーの閉鎖時刻にChannelの`SettleDelay`を加算した値

支払元アドレスはPaymentChannelClaimトランザクションタイプの`tfRenew`フラグを使用して`Expiration`を削除できます。

### 宛先アドレス

宛先アドレスは`Expiration`フィールドを設定できません。ただし、宛先アドレスはPaymentChannelClaimの`tfClose`フラグを使用してChannelを即時に閉鎖できます。

### その他のアドレス

その他のアドレスが`Expiration`フィールドを設定しようとすると、トランザクションはエラーコード`tecNO_PERMISSION`で失敗します。ただし、Channelがすでに有効期限切れになっている場合、このトランザクションでChannelが閉鎖し、その結果は`tesSUCCESS`になります。



## {% $frontmatter.seo.title %}の準備金

{% code-page-name /%}エントリは、台帳上にエントリがある限り、支払いチャネルを作成したアカウントの所有者準備金の対象の1つとしてカウントされます。チャネルを削除すると、準備金が解放されます。これは、チャネルの有効期限が切れた後（明示的にクローズされた場合を含む）にのみ実行できます。


## PayChannel IDのフォーマット

`PayChannel`オブジェクトのIDは、以下の値がこの順序で連結されている[SHA-512ハーフ][]です。

* PayChannelスペースキー（`0x0078`）
* 支払元アカウントのAccountID
* 宛先アカウントのAccountID
* Channelを作成したトランザクションのシーケンス番号

{% raw-partial file="/docs/_snippets/common-links.md" /%}
