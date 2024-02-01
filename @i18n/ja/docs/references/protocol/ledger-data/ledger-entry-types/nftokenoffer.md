---
html: nftokenoffer.html
parent: ledger-entry-types.html
seo:
    description: NFTを売買するオファーを作成する。
labels:
 - Non-fungible Tokens, NFTs
---
# NFTokenOffer

`lsfTransferable`フラグが設定されているトークンは、オファーを使って参加者間で転送することができます。`NFTokenOffer`オブジェクトは`NFToken`オブジェクトの購入、売却、または譲渡のオファーを表します。`NFToken`の所有者は`NFTokenCreateOffer`を使用して売買を行うことができます。

_([NonFungibleTokensV1_1 amendment][]により追加されました)_

## {% $frontmatter.seo.title %} JSONの例

```json
{
    "Amount": "1000000",
    "Flags": 1,
    "LedgerEntryType": "NFTokenOffer",
    "NFTokenID": "00081B5825A08C22787716FA031B432EBBC1B101BB54875F0002D2A400000000",
    "NFTokenOfferNode": "0",
    "Owner": "rhRxL3MNvuKEjWjL7TBbZSDacb8PmzAd7m",
    "OwnerNode": "17",
    "PreviousTxnID": "BFA9BE27383FA315651E26FDE1FA30815C5A5D0544EE10EC33D3E92532993769",
    "PreviousTxnLgrSeq": 75443565,
    "index": "AEBABA4FAC212BF28E0F9A9C3788A47B085557EC5D1429E7A8266FB859C863B3"
}
```


### `NFTokenOffer`のフィールド

| 名前                | JSONの型     | [内部の型][]        | 必須？ | 説明        |
|:--------------------|:------------|:------------------|:------|:-----------|
| `Amount`            | [通貨額][]   | AMOUNT            | はい   | NFTokenに対して見込まれる、または提示される金額です。トークンに`lsfOnlyXRP`フラグが設定されている場合、金額はXRPで指定する必要があります。XRP以外の資産を指定する売却オファーは、0以外の金額を指定する必要があります。XRPを指定する売却オファーは、`無料`にすることができます（つまり、このフィールドは`"0"`とすることができます）。 |
| `Destination`       | 文字列       | AccountID         | いいえ | このオファーの対象となるAccountID。存在する場合、そのアカウントのみがオファーを受け入れることができます。 |
| `Expiration`        | 数値         | UInt32            | いいえ | オファーが有効でなくなる時刻。値は、リップルエポックからの秒数です。 |
| `Flags`             | 数値         | UInt32            | はい   | このオブジェクトに関連付けられたフラグのセットで、様々なオプションや設定を指定するために使用されます。フラグは、以下の表に示すとおりです。 |
| `LedgerEntryType`   | 文字列       | UInt16            | はい   | レジャーオブジェクトの種類を示します（0x0074）。 |
| `NFTokenID`         | 文字列       | Hash256           | はい   | このオファーが参照するNFTokenオブジェクトのNFTokenID。 |
| `NFTokenOfferNode`  | 文字列       | UInt64            | いいえ | トークン購入または売却のオファーディレクトリの中で、このトークンが記録されている内部的な台帳です。このフィールドを使用することで、オファーを効率的に削除することができます。 |
| `Owner`             | 文字列       | AccountID         | はい   | オファーの作成者であり、所有者であるアカウント。NFTokenの現在の所有者のみがNFTokenの売却オファーを作成できますが、NFTokenの購入オファーはどのアカウントでも作成できます。 |
| `OwnerNode`         | 文字列       | UInt64            | いいえ | このトークンが記録されているオーナーディレクトリ内のページを示す、内部的な台帳です。このフィールドを使用することで、オファーを効率的に削除することができます。 |
| `PreviousTxnID`     | 文字列       | Hash256           | はい   | このオブジェクトを最も最近更新したトランザクションの識別ハッシュ。 |
| `PreviousTxnLgrSeq` | 数値         | UInt32            | はい   | このオブジェクトを最も最近更新したトランザクションを含むレジャーのインデックス。 |



#### NFTokenOfferのフラグ

|フラグ名            |16進数値      |10進数値|説明     |
|------------------|--------------|------|---------|
| `lsfSellNFToken `| `0x00000001` | 1    | 有効な場合、オファーは売却オファーとなります。そうでない場合、オファーは購入オファーとなります。 |

## `NFTokenOffer`トランザクション

[代替可能トークンに対するOffer](../../../../concepts/tokens/decentralized-exchange/offers.md)とは異なり、`NFTokenOffer`はオーダーブックに保存されず、自動的にマッチングされたり約定されたりすることはありません。買い手は売り手により提示されてた`NFTokenOffer`の受け入れを明示的に選択する必要があります。同様に、売り手は自分が所有する`NFToken`オブジェクトを買いたいと申し出た買い手の`NFTokenOffer`を受け入れることを明示的に選択しなければなりません。

`NFToken`の取引のためのトランザクションは3つあります。

- [NFTokenCreateOffer][]
- [NFTokenCancelOffer][]
- [NFTokenAcceptOffer][]


### `NFTokenOffer`オブジェクトの検索

各`NFToken`は、2つの[ディレクトリ](directorynode.md)があります。1つはトークンを購入するためのオファー、もう1つはトークンを売却するためのオファーが含まれています。マーケットプレイスやその他のクライアントアプリケーションは、ユーザに対し`NFToken`オブジェクトの取引オファーを提示したり、自動的にマッチングすることができます。


### `NFTokenOffer`の準備金

各`NFTokenOffer`オブジェクトは、オファーを出すアカウントに1つ分の準備金の増額を要求します。執筆時点では、準備金の増分は2XRPです。この準備金は、オファーをキャンセルすることで取り戻すことができます。


### `NFTokenOfferID`のフォーマット

`NFTokenOffer`オブジェクトのユニークID(`NFTokenOfferID`)は、以下の値を順番に結合したものです。

* `NFTokenOffer`のスペースキー、`0x0074`
* オファーを出すアカウントの`AccountID`
* `NFTokenCreateOffer`トランザクションが生成する`NFTokenCreateOffer`の`Sequence`(または`Ticket`)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
