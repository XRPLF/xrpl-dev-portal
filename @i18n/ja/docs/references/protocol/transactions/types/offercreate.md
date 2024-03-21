---
html: offercreate.html
parent: transaction-types.html
seo:
    description: 通貨交換の注文を作成します。
labels:
  - 分散型取引所
---
# OfferCreate

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/CreateOffer.cpp "ソース")

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

{% raw-partial file="/@i18n/ja/docs/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->


| フィールド         | JSONの型   | [内部の型][] | 説明       |
|:-----------------|:----------|:------------|:-----------|
| [Expiration](../../../../concepts/tokens/decentralized-exchange/offers.md#オファーの有効期限)   | 数字       | UInt32      | _（省略可）_ オファーがアクティブでなくなるまでの時間（[Rippleエポック以降の経過秒数][]）。 |
| `OfferSequence`  | 数字       | UInt32      | _（省略可）_ 最初に削除されるオファー（[OfferCancel][]と同様に指定されます）。 |
| `TakerGets`      | [通貨額][] | Amount      | オファーの作成者によって作成される金額および通貨の種類。 |
| `TakerPays`      | [通貨額][] | Amount      | オファーの作成者によってリクエストされる金額および通貨の種類。 |

## OfferCreateフラグ

OfferCreate型のトランザクションについては、[`Flags`フィールド](../common-fields.md#flagsフィールド)で以下の値が追加でサポートされます。

| フラグ名               | 16進数        | 10進数         | 説明               |
|:----------------------|:-------------|:--------------|:-------------------|
| `tfPassive`           | `0x00010000` | 65536         | 有効な場合、オファーはオファーが完全に約定するオファーを消費せず、代わりにレジャーのOfferオブジェクトになります。それはまだクロスしたオファーを消費します。 |
| `tfImmediateOrCancel` | `0x00020000` | 131072        | オファーを[IOC注文](http://en.wikipedia.org/wiki/Immediate_or_cancel)として扱います。有効な場合、オファーはレジャーオブジェクトにはなりません。レジャー内の既存のオファーと約定させようとするだけです。即時にオファーがどのオファーとも約定しない場合、どの通貨とも取引せずに「正常に」実行します。この場合、トランザクションは`tesSUCCESS`の[結果コード](../transaction-results/index.md)を返しますが、レジャー内には、[Offerオブジェクト](../../ledger-data/ledger-entry-types/offer.md)を作成しません。 |
| `tfFillOrKill`        | `0x00040000` | 262144        | オファーを[FOK注文](http://en.wikipedia.org/wiki/Fill_or_kill)として扱います。レジャー内の既存のオファーのみを約定しようとします。またこれは、全`TakerPays`の数量が取得できる場合に限られます。[fix1578 amendment][]が有効な場合でオファーを配置した時に実行できない場合、トランザクションは`tecKILLED`の[結果コード](../transaction-results/index.md)を返します。そうでない場合は、トランザクションは、どの通貨とも取り引きせずにキャンセルされた場合でも`tesSUCCESS`の結果コードを返します。 |
| `tfSell`              | `0x00080000` | 524288        | 取引所で`TakerPays`Amountよりも多く取得することになっても、`TakerGets` Amountを交換します。 |

## エラーケース

| エラーコード               | 説明                                               |
|:-------------------------|:--------------------------------------------------|
| `temINVALID_FLAG`        | トランザクションが`tfImmediateOrCancel`と`tfFillOrKill`両方を指定した場合に発生します。|
| `tecEXPIRED`             | トランザクションが指定した`Expiration`の時間が既に経過している場合に発生します。 |
| `tecKILLED`              | トランザクションが`tfFillOrKill`を指定し、全額を約定できない場合に発生します。_[ImmediateOfferKilled amendment][]_ が有効な場合、この結果コードは、トランザクションが`tfImmediateOrCancel`を指定して資金が移動せずに実行された場合にも発生します（これまでは、これは`tesSUCCESS`を返していました）。 |
| `temBAD_EXPIRATION`      | トランザクションの`Expiration`フィールドの値が無効なフォーマットの場合に発生します。 |
| `temBAD_SEQUENCE`        | トランザクションの`OfferSequence`フィールドの値が無効なフォーマットであるか、トランザクション自身の`Sequence`番号より大きい場合に発生します。 |
| `temBAD_OFFER`           | OfferがXRPとXRPを交換しようとした場合、またはトークンの無効な量やマイナスの量を交換しようとした場合に発生します。 |
| `temREDUNDANT`           | トランザクションが同じトークン（同じ発行者、通貨コード）を指定した場合に発生します。 |
| `temBAD_CURRENCY`        | トランザクションで通貨コードが"XRP"のトークンが指定された場合に発生します。 |
| `temBAD_ISSUER`          | トランザクションが無効な`issuer`値を持つトークンを指定した場合に発生します。 |
| `tecNO_ISSUER`           | トランザクションで、`issuer`の値が台帳の有効化されたアカウントでないトークンを指定した場合に発生します。|
| `tecFROZEN`              | [凍結](../../../../concepts/tokens/fungible-tokens/freezes.md)されたトラストライン(ローカルおよびグローバルの凍結を含む)上のトークンを含むトランザクションの場合に発生します。 |
| `tecUNFUNDED_OFFER`      | トランザクションの送信者が`TakerGets`の通貨を正の値で保有していない場合に発生する。(例外: `TakerGets`にトランザクションの送信者が発行するトークンを指定した場合、トランザクションは成功します)。 |
| `tecNO_LINE`             | 発行者が[Authorized Trust Lines](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md)を使用しているトークンを含むトランザクションで、必要なトラストラインが存在しない場合に発生します。 |
| `tecNO_AUTH`             | 発行者が[Authorized Trust Lines](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md)を使用しているトークンを含むトランザクションで、トークンを受け取るトラストラインが存在するが認証されていない場合に発生します。 |
| `tecINSUF_RESERVE_OFFER` | 所有者が台帳に新しいOfferオブジェクトを追加するための準備要件を満たすのに十分なXRPを持っておらず、トランザクションがどの通貨も変換しなかった場合に発生します。(トランザクションが何らかの金額のトレードに成功した場合、トランザクションは結果コード`tesSUCCESS`で成功しますが、残りは台帳にOfferオブジェクトを作成しません)。 |
| `tecDIR_FULL`            | トランザクションの送信者が台帳で多くのアイテムを所有している場合、またはオーダーブックに同じ取引レートのオファーがすでに多く含まれている場合に発生します。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
