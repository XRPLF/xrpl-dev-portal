---
html: payment.html
parent: transaction-types.html
seo:
    description: アカウント間での価値の移動します。
labels:
  - 支払い
  - XRP
  - クロスカレンシー
  - トークン
---
# Payment
[[ソース]](https://github.com/XRPLF/rippled/blob/5425a90f160711e46b2c1f1c93d68e5941e4bfb6/src/ripple/app/transactors/Payment.cpp "ソース")

Paymentトランザクションは、アカウント間での価値の移動を表現するものです(通過するパスによっては、非可分的に発生する追加的な価値交換を伴うことがあります)。このトランザクションタイプはいくつかの[支払いの種類](#paymentの種類)に使用することがでできます。

Paymentは、[アカウントを作成](#アカウントの作成)する唯一の手段でもあります。

## {% $frontmatter.seo.title %}のJSONの例

```json
{
  "TransactionType" : "Payment",
  "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Amount" : {
     "currency" : "USD",
     "value" : "1",
     "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
  },
  "Fee": "12",
  "Flags": 2147483648,
  "Sequence": 2,
}
```

[Query example transaction. >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fxrplcluster.com%2F&req=%7B%22id%22%3A%22example_Payment%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%227BF105CFE4EFE78ADB63FE4E03A851440551FE189FD4B51CAAD9279C9F534F0E%22%2C%22binary%22%3Afalse%7D)

{% raw-partial file="/@i18n/ja/docs/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->


| フィールド       | JSONの型       | [内部の型][] | 説明      |
|:---------------|:--------------|:------------------|:-----------------|
| `Amount`         | [通貨額][]     | Amount            | 送金する通貨額。XRP以外の金額の場合、入れ子フィールドの名前では、アルファベットの小文字のみ使用してください。[**tfPartialPayment**フラグ](#paymentのフラグ)が設定されている場合は、この金額を _上限_ とする金額を送金します。 |
| `Destination`    | 文字列         | AccountID         | 支払いを受取るアカウントの一意アドレス。 |
| `DestinationTag` | 数値           | UInt32            |  _（省略可）_ 宛先（支払先となる、ホスティングされている受取人）への支払い理由を明確にするための任意のタグ。 |
| `InvoiceID`      | 文字列         | Hash256           |  _（省略可）_ この支払いの具体的な理由または識別子を表現する任意の256ビットハッシュ。 |
| `Paths`          | パス配列の配列  | PathSet           | （省略可。自動入力可能）このトランザクションに使用される[支払いパス](../../../../concepts/tokens/fungible-tokens/paths.md)の配列。XRP間のトランザクションでは省略する必要があります。 |
| `SendMax`        | [通貨額][]     | Amount            |  _（省略可）_ [送金手数料](../../../../concepts/tokens/transfer-fees.md)、為替レート、[スリッページ](http://en.wikipedia.org/wiki/Slippage_%28finance%29)を含め、このトランザクションに関して支払い元通貨での負担を許容する上限額。[トランザクションの送信コストとして消却されるXRP](../../../../concepts/transactions/transaction-cost.md)は含めないでください。XRP以外の金額の場合、入れ子フィールドの名前では、アルファベットの小文字のみ使用してください。クロスカレンシー支払いまたは複数のトークンを伴う支払いについては、このフィールドを入力する必要があります。XRP間の支払いでは省略する必要があります。 |
| `DeliverMin`     | [通貨額][]     | Amount            |  _（省略可）_ このトランザクションで送金する、宛先通貨での最少金額。[Partial Payments](../../../../concepts/payment-types/partial-payments.md)の場合のみ有効になります。XRP以外の金額の場合、入れ子フィールドの名前では、アルファベットの小文字のみ使用してください。 |


## Paymentの種類

Paymentトランザクションタイプは、いくつかの異なるタイプの抽象的なアクションを表現することができる汎用ツールです。下の表で説明するように、トランザクションのフィールドに基づいてトランザクションタイプを識別することができます。

| Paymentの種類 | `Amount`  | `SendMax`  | `Paths`   | `Address` = `Destination`? | 説明 |
|:-------------|:----------|:-----------|:----------|:---------------------------|:--|
| [XRP同士の直接支払い][] | String (XRP) | 省略 | 省略 | いいえ          | アカウント間でへ直接XRPを送金します。常に正確な金額を送信します。基本的な[取引コスト](../../../../concepts/transactions/transaction-cost.md)以外の手数料は適用されません。 |
| [発行通貨の作成・償還][] | Object | Object (任意) | 任意 | いいえ | XRP Ledgerに追跡されているXRP以外の通貨や資産の量を増減させます。[送金手数料](../../../../concepts/tokens/transfer-fees.md)と[凍結](../../../../concepts/tokens/fungible-tokens/freezes.md)は、直接送金・換金する際には適用されません。 |
| [クロスカレンシー（通貨間）決済][] | Object (non-XRP) / String (XRP) | Object (non-XRP) / String (XRP) | 通常は必須 | いいえ | 発行された通貨を保有者から別の保有者に送信します。`Amount`と`SendMax`の両方をXRPにすることはできません。これらの支払いは、発行者を介して[リップリング](../../../../concepts/tokens/fungible-tokens/rippling.md)し、トランザクションがパスセットを指定した場合、複数の仲介者を介してより長い[パス](../../../../concepts/tokens/fungible-tokens/paths.md)を取ることができます。トランザクション形式には、発行者が設定した[送金手数料](../../../../concepts/tokens/transfer-fees.md) が適用されます。これらのトランザクションは、異なる通貨間や、場合によっては同じ通貨コードで異なる発行者の通貨間を接続するために、[分散型取引所](../../../../concepts/tokens/decentralized-exchange/index.md)のオファーを利用します。 |
| [Partial payment][] | Object (non-XRP) / String (XRP) | Object (non-XRP) / String (XRP) | 通常は必須 | いいえ | 任意の通貨を特定の金額まで送ります。[`tfPartialPayment` フラグ](#paymentのフラグ)を使用します。トランザクションが成功するための最小値を指定する `DeliverMin` 値を含めることができます。トランザクションが `DeliverMin` を指定しない場合、_任意の正の値_ を指定して成功させることができる。 |
| 通貨変換 | Object (non-XRP) / String (XRP) | Object (non-XRP) / String (XRP) | 必須         | はい | [分散型取引所](../../../../concepts/tokens/decentralized-exchange/index.md)のオファーを消費して、ある通貨を別の通貨に交換し、[裁定取引](https://ja.wikipedia.org/wiki/%E8%A3%81%E5%AE%9A%E5%8F%96%E5%BC%95)の機会を得ることが出来ます。`Amount`と `SendMax` の両方を XRP にすることはできません。[Data API](../../../data-api.md) は、このタイプの取引を "payment" ではなく、"exchange" として追跡しています。 |

[XRP同士の直接支払い]: ../../../../concepts/payment-types/direct-xrp-payments.md
[発行通貨の作成・償還]: ../../../../concepts/tokens/index.md
[クロスカレンシー（通貨間）決済]: ../../../../concepts/payment-types/cross-currency-payments.md
[Partial payment]: ../../../../concepts/payment-types/partial-payments.md


## SendMaxおよびAmountで使用する特殊なissuerの値



ほとんどの場合、XRP以外の[通貨額][]の`issuer`フィールドは、金融機関の[発行アドレス](../../../../concepts/accounts/account-types.md)を示しています。ただし、支払いを記述するにあたって、支払いの`Amount`フィールドと`SendMax`フィールドにある`issuer`フィールドについては、特殊なルールが存在します。

* 2つのアドレス間で、同一の通貨に関して存在する残高は常に1つです。つまり、金額の`issuer`フィールドが実際に表しているのは、イシュアンスを作成したアドレスではなく、イシュアンスを換金する相手方であることがあります。
* 宛先`Amount`フィールドの`issuer`フィールドが`Destination`アドレスと一致している場合、「宛先が受け入れるあらゆるイシュアー」を意味する特殊なケースとして取り扱われます。これには、他のトラストラインで保持されている宛先によって作成されたイシュアンスに加え、宛先が当該アドレスまでトラストラインを延長しているすべてのアドレスが含まれます。
* `SendMax`フィールドの`issuer`フィールドが送信元アカウントのアドレスと一致している場合、「送信元が使用できるあらゆるイシュアー」を意味する特殊なケースとして取り扱われます。これには、他のアカウントが送信元アカウントまで延長しているトラストラインで新しいイシュアンスを作成すること、送信元アカウントが保持しているイシュアンスを他のイシュアーから送信することが含まれます。

## アカウントの作成

Payment型のトランザクションでは、資金供給のないアドレスに対して十分なXRPを送金することで、XRP Ledgerに新規のアカウントを作成できます。資金供給のないアドレスに対するその他のトランザクションは、常に失敗します。

詳細は、[アカウント](../../../../concepts/accounts/index.md#アカウントの作成)をご覧ください。

## パス

`Paths`フィールドが存在する場合、Pathフィールドには、 _パスセット_ （パス配列の配列）が記述されていなければなりません。個々のパスは、さまざまな仲介アカウントやオーダーブックを経由して、送信者から受信者へと価値が1つの方向へ流れることを表します。単一のトランザクションで、複数のパスを使用する可能性もあります。例えば、トランザクションで複数のオーダーブックやAMMを使用して、最も有利なレートで通貨を交換する場合です。

以下の場合を含め、直接の支払いでは`Paths`フィールドを省略する必要があります。

* XRP間の送金。
* 送信者と受信者を接続するトラストライン上での直接送金。

`Paths`フィールドを指定すると、サーバは、提供されたセットと _デフォルトパス_ の中から、使用するパス（指定されたアカウントに接続する上で、最も直行となる経路）をトランザクション処理時に判別します。このように決定された判別は、コストを最小化しようとするものですが、完璧であることは保証されません。

`Paths`フィールドを、空の配列としたり、メンバーがすべて空の配列あるような配列としたりすることはできません。

詳細は、[Paths](../../../../concepts/tokens/fungible-tokens/paths.md)をご覧ください。

## Paymentのフラグ

Payment型のトランザクションについては、[`Flags`フィールド](../common-fields.md#flagsフィールド)で以下の値が追加でサポートされます。

| フラグの名前         | 16進値        | 10進値        | 説明                  |
|:-------------------|:-------------|:--------------|:-----------------------------|
| `tfNoRippleDirect` | `0x00010000` | 65536         | デフォルトパスを使用せず、`Paths`フィールドに含まれているパスのみ使用します。これによりトランザクションは強制的に裁定機会を活用することになります。ほとんどのクライアントでは、これは必要ありません。 |
| `tfPartialPayment` | `0x00020000` | 131072        | `SendMax`を超えていないのに指定された`Amount`を送金できない場合、即座に失敗とするのではなく、受取られる額を減額します。詳細は、[Partial Payments](../../../../concepts/payment-types/partial-payments.md)をご覧ください。 |
| `tfLimitQuality`   | `0x00040000` | 262144        | すべての変換で、入力と出力との比率が`Amount`と`SendMax`との比率と同一であるか、さらに有利となるパスのみを採用します。詳細は、[クオリティの制限](#クオリティの制限)をご覧ください。 |

## Partial Payments

Partial Paymentsを利用すると、受取られる金額を減額することによって、支払いを成功させることができます。Partial Paymentsが有用なのは、追加的なコストを発生させずに[支払いを返金](../../../../concepts/payment-types/bouncing-payments.md)する場合です。その一方で、成功したトランザクションの`Amount`フィールドに、送金された金額が常に正しく記述されていることを前提としている環境において、悪用されるおそれもあります。

Partial Paymentsとは、**tfPartialPayment**フラグが有効になっている[Paymentトランザクション][]です。Partial Paymentsは、`SendMax`値を超える金額を送金することなく、`DeliverMin`フィールド以上の正の金額（`DeliverMin`が指定されていない場合、任意の正の金額）を送金する場合に成功します。

支払いのメタデータにある[`delivered_amount`](../metadata.md#delivered_amount)フィールドは、宛先アカウントが実際に受け取る通貨の金額を示しています。

詳細は、[Partial Payments](../../../../concepts/payment-types/partial-payments.md)の全文をご覧ください。


## クオリティの制限

XRP Ledgerでは、ある通貨での入金額と別の通貨での出金額の比率として、通貨取引の「クオリティ」を定義します。例えば、2米ドルと引き換えに1イギリスポンドを受け取る場合、その交換の「クオリティ」は`0.5`です。

[*tfLimitQuality*フラグ](#paymentのフラグ)を使用すると、実行する変換のクオリティについて下限を設定できます。このクオリティの制限は、宛先の`Amount`を`SendMax`の金額（通貨にかかわらず金額のみ）で除算することによって定義します。設定した場合、支払い処理エンジンは、クオリティの制限よりもクオリティ（為替レート）が低い（数値が小さい）パスの使用を回避します。

tfLimitQualityフラグは、それ自体、トランザクションが成功する状況を減少させるものになります。具体的には、好ましくない変換が支払いの一部で使用されている場合、支払いにおける変換の*平均*的なクオリティが全体としてクオリティの制限と同一か、それ以上であっても、支払いが拒否されます。支払いがこの形で拒否される場合、[トランザクションの結果](../transaction-results/index.md)は`tecPATH_DRY`です。

次の例を考えてみます。100人民元（`Amount` = 100人民元）を最大20米ドル（`SendMax` = 20米ドル）と引き換えに相手方に送金しようとする場合、クオリティの制限は`5`です。あるトレーダーが15米ドルと引き換えに95人民元をオファーしているものの（米ドルあたり約`6.3`人民元の比率）、市場の次善のオファーが2ドルに対して5人民元であるとします（米ドルあたり`2.5`人民元の比率）。両方のオファーを受諾して相手方に100人民元を送金する場合、送信元が負担するコストは17米ドルであり、平均のクオリティは約`5.9`です。

tfLimitQualityフラグが設定されていない場合、17米ドルというコストは指定された`SendMax`に収まっているため、このトランザクションは成功します。一方、tfLimitQualityフラグが有効になっている場合は失敗します。2番目のオファーを受諾するためのパスのクオリティは`2.5`であり、`5`というクオリティの制限よりも低いためです。

tfLimitQualityフラグが最も有用となるのは、[Partial Payments](../../../../concepts/payment-types/partial-payments.md)と組み合わせる場合です。*tfPartialPayment*と*tfLimitQuality*の両方がトランザクションに対して設定されている場合、トランザクションでは、クオリティの制限よりも低い変換を使用することなく、送金可能な最大限の宛先`Amount`が送金されます。

95人民元/15米ドルのオファーと5人民元/2米ドルのオファーがある上の例で、トランザクションに関してtfPartialPaymentとtfLimitQualityの両方が有効になっている場合、状況は異なります。20米ドルの`SendMax`および100人民元の宛先`Amount`を維持する場合も、クオリティの制限は`5`です。ただし、実行しようとするのはPartial Paymentsであるため、宛先に対する送金の全額を一度で送金できない場合、トランザクションを失敗とするのではなく、送金可能な最大限の金額が送金されます。つまり、トランザクションでは、クオリティが約`6.3`である95人民元/15米ドルのオファーは受け入れますが、5人民元/2米ドルのオファーはクオリティが`2.5`であり、クオリティの制限の`5`より低いため、拒否します。最終的に、トランザクションで送金されるのは満額の100人民元ではなく95人民元になりますが、不利な為替レートで資金を浪費することを避けられます。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
