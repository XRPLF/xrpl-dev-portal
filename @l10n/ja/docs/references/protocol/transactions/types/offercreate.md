---
seo:
    description: 通貨交換の注文を作成します。
labels:
  - 分散型取引所
---
# OfferCreate

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/CreateOffer.cpp "ソース")

OfferCreateトランザクションは[分散型取引所](../../../../concepts/tokens/decentralized-exchange/index.md)で[注文](../../../../concepts/tokens/decentralized-exchange/offers.md)を作成します。

## {% $frontmatter.seo.title %} JSONの例

```json
{
    "TransactionType": "OfferCreate",
    "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Fee": "12",
    "Flags": 0,
    "LastLedgerSequence": 7108682,
    "Sequence": 8,
    "TakerGets": "6000000",
    "TakerPays": {
      "currency": "GKO",
      "issuer": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
      "value": "2"
    }
}
```

{% tx-example txid="0CD69FD1F0A890CC57CDA430213FD294F7D65FF4A0F379A0D09D07A222D324E6" /%}

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}


| フィールド       | JSONの型              | [内部の型][] | 必須?    | 説明       |
|:-----------------|:----------------------|:-------------|:---------|:-----------|
| `DomainID`       | 文字列 - [ハッシュ][] | Hash256      | いいえ   | 許可型DEXのレジャーエントリID。指定された場合、対応する[許可型DEX](../../../../concepts/tokens/decentralized-exchange/permissioned-dexes.md)のみを使用するパスを返します。([PermissionedDEX amendment][] {% not-enabled /%}が必要です。) |
| [`Expiration`](../../../../concepts/tokens/decentralized-exchange/offers.md#オファーの有効期限)   | 整数       | UInt32      | いいえ   | オファーがアクティブでなくなるまでの時間（[Rippleエポック以降の経過秒数][]）。 |
| `OfferSequence`  | 整数                  | UInt32       | いいえ   | 最初に削除されるオファー（[OfferCancel][]と同様に指定されます）。 |
| `TakerGets`      | [通貨額][]            | Amount       | はい     | オファーの作成者によって作成される金額および通貨の種類。 |
| `TakerPays`      | [通貨額][]            | Amount       | はい     | オファーの作成者によってリクエストされる金額および通貨の種類。 |

## OfferCreateフラグ

OfferCreate型のトランザクションについては、[`Flags`フィールド](../common-fields.md#flagsフィールド)で以下の値が追加でサポートされます。

| フラグ名               | 16進数      | 10進数         | 説明               |
|:----------------------|:-------------|:--------------|:-------------------|
| `tfPassive`           | `0x00010000` | 65536         | このオファーと完全に一致するオファーを約定しません。これにより、特定の値で交換レートを固定するオファーを台帳に設定できます。 |
| `tfImmediateOrCancel` | `0x00020000` | 131072        | オファーを[即時またはキャンセル注文](http://en.wikipedia.org/wiki/Immediate_or_cancel)として扱い、[Offerエントリ][]をオーダーブックに配置しません。トランザクションは、処理時に既存のオファーを約定し、可能な限り多くの取引を行います。 |
| `tfFillOrKill`        | `0x00040000` | 262144        | オファーを[即時またはキャンセル注文](http://en.wikipedia.org/wiki/Fill_or_kill)として扱い、[Offerエントリ][]をオーダーブックに配置しません。実行時に完全に約定できない場合、オファーをキャンセルします。デフォルトでは、所有者は完全な`TakerPays`の金額を受け取る必要があります。`tfSell`フラグが有効な場合、所有者は代わりに完全な`TakerGets`の金額を約定できる必要があります。 |
| `tfSell`              | `0x00080000` | 524288        | 取引所で`TakerPays`の金額よりも多く取得することになっても、`TakerGets`の金額を約定します。 |
| `tfHybrid`            | `0x00100000` | 1048576       | 許可型DEXとオープンDEXの両方を使用できるハイブリッドオファーにします。このフラグを使用する場合、`DomainID`フィールドを指定する必要があります。 |

## エラーケース

| エラーコード             | 説明                                               |
|:-------------------------|:--------------------------------------------------|
| `tecDIR_FULL`            | トランザクションの送信者が台帳で多くのアイテムを所有している場合、またはオーダーブックに同じ取引レートのオファーがすでに多く含まれている場合に発生します。 |
| `tecEXPIRED`             | トランザクションが指定した`Expiration`の時間が既に経過している場合に発生します。 |
| `tecFROZEN`              | [フリーズ](../../../../concepts/tokens/fungible-tokens/freezes.md)されたトラストライン(ローカルおよびグローバルのフリーズを含む)上のトークンを含むトランザクションの場合に発生します。`TakerPays`（購入額）トークンが発行者によってディープフリーズされている場合に発生します。 |
| `tecINSUF_RESERVE_OFFER` | 所有者が台帳に新しいOfferオブジェクトを追加するための準備要件を満たすのに十分なXRPを持っておらず、トランザクションがどの通貨も変換しなかった場合に発生します。(トランザクションが何らかの金額のトレードに成功した場合、トランザクションは結果コード`tesSUCCESS`で成功しますが、残りは台帳にOfferオブジェクトを作成しません)。 |
| `tecKILLED`              | トランザクションが`tfFillOrKill`を指定し、全額を約定できない場合に発生します。_[ImmediateOfferKilled amendment][]_ が有効な場合、この結果コードは、トランザクションが`tfImmediateOrCancel`を指定して資金が移動せずに実行された場合にも発生します（これまでは、これは`tesSUCCESS`を返していました）。 |
| `tecNO_AUTH`             | 発行者が[Authorized Trust Lines](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md)を使用しているトークンを含むトランザクションで、トークンを受け取るトラストラインが存在するが認証されていない場合に発生します。 |
| `tecNO_ISSUER`           | トランザクションで、`issuer`の値が台帳の有効化されたアカウントでないトークンを指定した場合に発生します。|
| `tecNO_LINE`             | 発行者が[Authorized Trust Lines](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md)を使用しているトークンを含むトランザクションで、必要なトラストラインが存在しない場合に発生します。 |
| `tecNO_PERMISSION`       | トランザクションが`DomainID`を使用しているが、送信者がそのドメインのメンバーではない場合に発生します。([PermissionedDEX amendment][] {% not-enabled /%}) |
| `tecUNFUNDED_OFFER`      | トランザクションの送信者が`TakerGets`の通貨を正の値で保有していない場合に発生する。(例外: `TakerGets`にトランザクションの送信者が発行するトークンを指定した場合、トランザクションは成功します)。 |
| `temBAD_CURRENCY`        | トランザクションで通貨コードが"XRP"のトークンが指定された場合に発生します。 |
| `temBAD_EXPIRATION`      | トランザクションの`Expiration`フィールドの値が無効なフォーマットの場合に発生します。 |
| `temBAD_ISSUER`          | トランザクションが無効な`issuer`値を持つトークンを指定した場合に発生します。 |
| `temBAD_OFFER`           | OfferがXRPとXRPを交換しようとした場合、またはトークンの無効な量やマイナスの量を交換しようとした場合に発生します。 |
| `temBAD_SEQUENCE`        | トランザクションの`OfferSequence`フィールドの値が無効なフォーマットであるか、トランザクション自身の`Sequence`番号より大きい場合に発生します。 |
| `temINVALID_FLAG`        | トランザクションが`tfImmediateOrCancel`と`tfFillOrKill`両方を指定した場合に発生します。|
| `temREDUNDANT`           | トランザクションが同じトークン（同じ発行者、通貨コード）を指定した場合に発生します。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
