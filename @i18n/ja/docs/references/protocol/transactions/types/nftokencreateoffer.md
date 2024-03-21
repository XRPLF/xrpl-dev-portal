---
html: nftokencreateoffer.html
parent: transaction-types.html
seo:
    description: NFTの売買のオファーを作成する。
labels:
  - 非代替性トークン, NFT
---
# NFTokenCreateOffer
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/NFTokenCreateOffer.cpp "ソース")

トランザクションを送信するアカウントが所有する`NFToken`に対する新しい _売却_ オファー、または別のアカウントが所有する`NFToken`に対する新しい _購入_ オファーを作成します。

成功した場合、トランザクションは[NFTokenOfferオブジェクト][]を作成します。各オファーは、オファーを提示したアカウントの[所有者準備金](../../../../concepts/accounts/reserves.md)に関連づけて1つのオブジェクトとしてカウントされます。

_([NonFungibleTokensV1_1 amendment][]により追加されました)_

## {% $frontmatter.seo.title %} JSONの例

```json
{
      "TransactionType": "NFTokenCreateOffer",
      "Account": "rs8jBmmfpwgmrSPgwMsh7CvKRmRt1JTVSX",
      "NFTokenID": "000100001E962F495F07A990F4ED55ACCFEEF365DBAA76B6A048C0A200000007",
      "Amount": "1000000",
      "Flags": 1
}
```


{% raw-partial file="/@i18n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド      | JSONの型            | [内部の型][]        | 説明               |
|:--------------|:--------------------|:------------------|:-------------------|
| `Owner`       | 文字列              | AccountID         | _(省略可)_ 対応する`NFToken`の所有者を指定します。トークンの購入オファーである場合、このフィールドは必ず存在し、`Account`フィールドとは異なるものでなければなりません(すでに保有しているトークンの購入オファーは無意味)。トークンの売却オファーである場合、このフィールドは存在してはいけません。所有者は暗黙のうちに`Account`と同じになるからです(すでに保有していないトークンを売却するオファーは無意味)。 |
| `NFTokenID`     | 文字列              | Hash256           | オファーが参照する`NFToken`オブジェクトを指定します。 |
| `Amount`      | [通貨額][] | Amount            | 対応する`NFToken`に対する売却希望額または売却提示額を表します。0を指定することは、トークンの現在の所有者が、誰でも、または`Destination`フィールドで指定されたアカウントに、トークンを無償で譲渡することを意味します。 |
| `Expiration`  | 数値              | UInt32            | _(省略可)_ オファーが無効となる時間を指定します。値は[Rippleエポック以降の経過秒数][]です。 |
| `Destination` | 文字列              | AccountID         | _(省略可)_ 存在する場合、このオファーは指定されたアカウントによってのみ受け入れることが可能であることを示します。他のアカウントによってこのオファーを受け入れることはできません。 |


## NFTokenCreateOfferフラグ

NFTokenCreateOfferタイプのトランザクションは、以下のように[`Flags`フィールド](../common-fields.md#flags-field)に追加の値を設定することが可能です。

| フラグ名         | 16進数値      | 整数値          | 説明                          |
|:----------------|:-------------|:--------------|:------------------------------|
| `tfSellNFToken` | `0x00000001` | `1`           | 有効な場合、オファーが売却オファーであることを示します。そうでない場合は、購入オファーであることを示します。 |


## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは、次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード                    | 説明                                          |
|:---------------------------------|:------------------------------------------|
| `temDISABLED`                    | [NonFungibleTokensV1 Amendment][]は有効ではありません。 |
| `temBAD_AMOUNT`                  | `Amount`フィールドが有効ではありません。例えば、購入オファーで金額がゼロであったり、金額はトークンであるが`NFToken`で[`lsfOnlyXRP`フラグ](../../data-types/nftoken.md#nftoken-フラグ)が有効になっている場合などです。 |
| `temBAD_EXPIRATION`              | 指定された`Expiration`は無効です（例：`0`）。 |
| `tecDIR_FULL`                    | 送信者がレジャーにすでにあまりにも多くのオブジェクトを所有しているか、またはこのトークンの売買のオファーがあまりにも多く存在しています。 |
| `tecEXPIRED`                     | 指定された`Expiration`の時間は既に経過しています。 |
| `tecFROZEN`                      | `Amount`はトークンで、このオファーからトークンを受け取るトラストラインは[凍結](../../../../concepts/tokens/fungible-tokens/freezes.md)されています。これは売却者のトラストラインか、`NFToken`の発行者のトラストライン（`NFToken`に送金手数料がある場合）である可能性があります。 |
| `tecINSUFFICIENT_RESERVE`        | 送信者はこのオファーを提示した後、[所有者準備金](../../../../concepts/accounts/reserves.md)を満たすのに十分なXRPを持っていません。 |
| `tecNO_DST`                      | `Destination`に指定されたアカウントがレジャーに存在しません。 |
| `tecNO_ENTRY`                    | `NFToken`フィールドで指定したアカウントは所有していません。 |
| `tecNO_ISSUER`                   | `Amount`フィールドで指定した発行者が存在しません。 |
| `tecNO_LINE`                     | `Amount`フィールドはトークンですが、`NFToken`の発行者はそのトークンのトラストラインを持っておらず、`NFToken`は[`lsfTrustLine`フラグ](../../data-types/nftoken.md#nftoken-フラグ)が有効ではありません。 |
| `tecNO_PERMISSION`               | `Destination`アカウントが着信する NFTokenOffer をブロックします。 _([DisallowIncoming amendment][] が必要です。)_
| `tecUNFUNDED_OFFER`              | 購入オファーの場合、送信者は`Amount`フィールドで指定された通貨を利用可能です。もし`Amount`がXRPである場合、これは準備不足によるものかもしれません。もし`Amount`がトークンである場合、これは[凍結](../../../../concepts/tokens/fungible-tokens/freezes.md)されている可能性があります。 |
| `tefNFTOKEN_IS_NOT_TRANSFERABLE` | `NFToken`は[`lsfTransferable`フラグ](../../data-types/nftoken.md#nftoken-flags)が無効になっており、このトランザクションでは`NFToken`を発行者に転送したり発行者から転送したりすることはできません。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
