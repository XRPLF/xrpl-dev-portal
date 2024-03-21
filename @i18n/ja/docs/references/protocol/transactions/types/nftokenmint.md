---
html: nftokenmint.html
parent: transaction-types.html
seo:
    description: TokenMintを使用して新規NFTを発行する。
labels:
  - 非代替性トークン, NFT
---
# NFTokenMint
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/NFTokenMint.cpp "Source")

`NFTokenMint`トランザクションは非代替性トークンを作成し、`NFTokenMinter`に紐付く[NFTokenPageオブジェクト][]に[NFToken][]オブジェクトとして追加します。このトランザクションは`NFTokenMinter`にとって、不変と定義されているトークンフィールド(例えば`Flags`)を設定することができる唯一の方法です。

_([NonFungibleTokensV1_1 amendment][]により追加されました)_


## {% $frontmatter.seo.title %} JSONの例


```json
{
  "TransactionType": "NFTokenMint",
  "Account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
  "TransferFee": 314,
  "NFTokenTaxon": 0,
  "Flags": 8,
  "Fee": "10",
  "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
  "Memos": [
        {
            "Memo": {
                "MemoType":
                  "687474703A2F2F6578616D706C652E636F6D2F6D656D6F2F67656E65726963",
                "MemoData": "72656E74"
            }
        }
    ]
}
```

[トランザクションを取得してみる >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fs1.ripple.com%2F&req=%7B%22id%22%3A%22example_NFTokenMint%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%22B42C7A0C9C3061463C619999942D0F25E4AE5FB051EA0D7A4EE1A924DB6DFEE8%22%2C%22binary%22%3Afalse%7D)

{% raw-partial file="/@i18n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド      | JSONの型            | [内部の型][]        | 説明               |
|:--------------|:--------------------|:------------------|:-------------------|
| `NFTokenTaxon` | 数値 | UInt32 | トークンに関連する分類群。Taxonは通常、トークンの発行者が選択した値です。1つのTaxonは複数のトークンに使用することができます。`0xFFFFFFFF`より大きいTaxonの識別子は使用できません。 |
| `Issuer` | 文字列 | AccountID | _(省略可)_ 送信元アカウントが他のアカウントの代理としてトークンを発行する場合における、トークンの発行者。トランザクションを送信するアカウントが `NFToken` の発行者である場合、このフィールドは指定してはいけません。指定される場合、発行者の[AccountRootオブジェクト][]には `NFTokenMinter` フィールドが、このトランザクションの送信者(このトランザクションの`Account`フィールド)に設定されていなければなりません。 |
| `TransferFee` | 数値 | UInt16 | _(省略可)_ この値は、`NFToken`の二次販売が許可されている場合に、発行者が徴収する手数料を指定します。このフィールドの有効な値は0から50000の間で、0.001刻みで0.00%から50.00%の送金手数料を設定することができます。このフィールドが設定されている場合、トランザクションは[`tfTransferable`フラグ](#nftokenmintのフラグ) を有効にしなければなりません。 |
| `URI` | 文字列 | Blob | _(省略可)_ 最大256バイトの任意のデータ。JSONでは、16進数の文字列としてエンコードされる必要があります。URIを16進数に変換するために、[`xrpl.convertStringToHex`](https://js.xrpl.org/modules.html#convertStringToHex)ユーティリティを使用することができます。これは、NFTに関連するデータまたはメタデータを指し示すURIであることを想定しています。コンテンツは、HTTPまたはHTTPS URL、IPFS URI、マグネットリンク、[RFC2379 "data" URL](https://datatracker.ietf.org/doc/html/rfc2397) としてエンコードされた即値データ、あるいは発行者固有のエンコーディングにデコードされていることがあります。URIの有効性はチェックされません。 |



## NFTokenMintのフラグ

NFTokenMint型のトランザクションでは、以下のように[`Flags`フィールド](../common-fields.md#flagsフィールド)に追加の値を設定することが可能です。

| フラグ名       | 16進数値      | 整数値          | 説明                          |
|:--------------|:-------------|:--------------|:------------------------------|
| `tfBurnable` | `0x00000001` | 1 | 発行者(または発行者が許可した者)が`NFToken`を破棄できるようにします。(`NFToken`の所有者は常に破棄することができます)。 |
| `tfOnlyXRP` | `0x00000002` | 2 | 発行された`NFToken`はXRPでのみ売買が可能です。これは、トークンに送金手数料がかかり、発行者がXRP以外のトークンで手数料を受け取りたくない場合に望ましいでしょう。 |
| `tfTrustLine` | `0x00000004` | 4 | **非推奨** 発行者が、発行した`NFToken`を転送する際に受け取る手数料を保有するために、自動的に[トラストライン](../../../../concepts/tokens/fungible-tokens/index.md) を作成します。[fixRemoveNFTokenAutoTrustLine Amendment][]により、このフラグの設定は無効となります。 |
| `tfTransferable` | `0x00000008` | 8 | 発行された`NFToken`は他の人に譲渡することができます。このフラグが _有効でない_ 場合、トークンは _発行者から_ 、または _発行者へ_ のみ転送することができます。 |


## 追加情報の埋め込み

発行時に追加情報を指定する必要がある場合(たとえば、特定の[区画](https://en.wikipedia.org/wiki/Plat)を参照して不動産を特定できる詳細情報、[車両識別番号](https://ja.wikipedia.org/wiki/%E8%BB%8A%E4%B8%A1%E8%AD%98%E5%88%A5%E7%95%AA%E5%8F%B7)を指定して車両を特定できる詳細情報、その他オブジェクト固有の説明)、[取引メモ](../common-fields.md#memosフィールド)を使用することができます。メモは署名された取引の一部であり、履歴アーカイブから入手できますが、レジャーの状態データには保存されません。

## 他のアカウントの代わりとして発行する

別のアカウントでNFTを発行する場合、次の2つを実行する必要があります。*アカウント A*があなたのアカウントで、*アカウント B*がNFTokenを発行したいアカウントであるとします。

1. *アカウントB*の`NFTokenMinter`アカウント設定を、*アカウントA*に設定します。(これは、*アカウントB*が自分に代わってNFTを作成するために*アカウントA*を信頼することを意味します)。
2. NFTokenを発行する際、`Issuer`フィールドをアカウントBに設定します。

### NFTokenMintと発行者の組み合わせ例

```json
{
  "TransactionType": "NFTokenMint",
  "Account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
  "Issuer": "rNCFjv8Ek5oDrNiMJ3pw6eLLFtMjZLJnf2",
  "TransferFee": 25000,
  "NFTokenTaxon": 0,
  "Flags": 8,
  "Fee": "10",
  "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
  "Memos": [
        {
            "Memo": {
                "MemoType":
                  "687474703A2F2F6578616D706C652E636F6D2F6D656D6F2F67656E65726963",
                "MemoData": "72656E74"
            }
        }
    ]
}
```


このトランザクションは、発行者である`rNCFjv8Ek5oDrNiMJ3pw6eLFtMjZLJnf2`がその`AccountRoot`の`NFTokenMinter`フィールド `rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B`と設定して、そのアカウントが自身に代わってトークンを発行する権限を与えていると想定したものです。

## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは、次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード                    | 説明                                          |
|:------------------------------|:---------------------------------------------|
| `temDISABLED`                 | [NonFungibleTokensV1 Amendment][]は有効ではありません。 |
| `temBAD_NFTOKEN_TRANSFER_FEE` | `TransferFee`が許容範囲外です。 |
| `temINVALID_FLAG`             | `Flags`値には、許可されていない、または有効なフラグでないビットが有効になっています。[fixRemoveNFTokenAutoTrustLine amendment][]が有効になっている場合、`tfTrustLine`フラグはこのエラーを発生させます。|
| `temMALFORMED`                | トランザクションが正しく指定されていません。例えば、`URI`フィールドが256バイトより長い場合です。 |
| `tecNO_ISSUER`                | `Issuer`は、レジャーに存在しないアカウントを指定しています。 |
| `tecNO_PERMISSION`            | `Issuer`フィールドで参照されるアカウントは、このトランザクションの送信者（`NFTokenMinter`設定を使用）が自身の代わりに発行することを承認していません。 |
| `tecINSUFFICIENT_RESERVE`     | トークンを発行した後、オーナーは更新された[準備金要件](../../../../concepts/accounts/reserves.md)を満たせなくなります。新しい`NFToken`は、新しい[NFTokenPageオブジェクト][]を必要とする場合にのみ、オーナーの準備金を増加させることに注意する必要があり、それぞれ最大32NFTを格納することができます。|
| `tecMAX_SEQUENCE_REACHED`     | `Issuer`の`MintedNFTokens`フィールドはすでに最大値になっています。これは、発行者またはその代理人が合計で2<sup>32</sup>-1つの`NFToken`を発行した場合にのみ発生します。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
