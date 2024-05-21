---
html: nftokenpage.html
parent: ledger-entry-types.html
seo:
    description: NFTokenを記録するためのレジャー構造。
labels:
 - Non-fungible Tokens, NFTs
---
# NFTokenPage

`NFTokenPage`オブジェクトは、同じアカウントが所有する[NFT](../../../../concepts/tokens/nfts/index.md)のコレクションを表します。一つのアカウントは複数の`NFTokenPage`エントリを持つことができ、それらは双方向リストを形成します。

_([NonFungibleTokensV1_1 amendment][]により追加されました)_


## {% $frontmatter.seo.title %}のJSONの例

```json
{
  "LedgerEntryType": "NFTokenPage",
  "PreviousPageMin":
    "8A244DD75DAF4AC1EEF7D99253A7B83D2297818B2297818B70E264D2000002F2",
  "NextPageMin":
    "8A244DD75DAF4AC1EEF7D99253A7B83D2297818B2297818BE223B0AE0000010B",
  "PreviousTxnID":
    "95C8761B22894E328646F7A70035E9DFBECC90EDD83E43B7B973F626D21A0822",
  "PreviousTxnLgrSeq":
    42891441,
  "NFTokens": [
    {
      "NFToken": {
        "NFTokenID":
          "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65",
        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"
      }
    },
    /* 更に多くのオブジェクト */
  ]
}
```


## {% $frontmatter.seo.title %}のフィールド

[共通フィールド][]に加えて、{% $frontmatter.seo.title %}エントリは以下のフィールドを使用します。

| 名前                | JSONの型   | [内部の型][] | 必須？ | 説明        |
|:--------------------|:----------|:-----------|:----------|:------------|
| `LedgerEntryType`   | 文字列    | UInt16      | はい   | レジャーオブジェクトのタイプを識別文字列です。予約されているレジャーの種類は、0x0050です。|
| `NextPageMin`       | 文字列    | Hash256     | いいえ | 次のページの位置情報(もしあれば)。このフィールドの使用方法は、NFTokenオブジェクトの追加の項に記載しています。|
| `NFTokens`          | オブジェクト  | TOKEN    | はい   | このNFTokenPageオブジェクトに含まれる`NFToken`オブジェクトのコレクション。本仕様では、1ページあたり32のNFTokenオブジェクトを上限としています。オブジェクトは、`NFTokenID`をソートパラメータとして使用して、低いものから高いものへとソートされた順序で格納されています。|
| `PreviousPageMin`   | 文字列    | Hash256     | いいえ | 前のページの位置情報(もしあれば)。このフィールドの使用方法は、NFTokenオブジェクトの追加の項に記載しています。|
| `PreviousTxnID`     | 文字列    | HASH256     | いいえ | このNFTokenPageオブジェクトを最も最近変更したトランザクションのトランザクションIDの情報を示します。|
| `PreviousTxnLgrSeq` | 数値    | UInt32       | いいえ  | このNFTokenPageオブジェクトを最も最近変更したトランザクションを含むレジャーのシーケンスを示します。|


### NFTokenPage IDのフォーマット

`NFTokenPage`識別子は、`NFTokens`に最適で、より効率的なページング構造を採用できるように特別に構築されています。

`NFTokenPage`の識別子は、そのページの所有者の160ビットの`AccountID`と、そのページに特定の`NFTokenID`が含まれるかどうかを示す96ビットの値を連結して得られます。

具体的には、関数`low96(x)`が256ビットの値の下位96ビットを返すと仮定すると、`NFTokenID` `A` のNFTは`NFTokenPageID` `B`のページに含めることができるのは`low96(A) >= low96(B)`の場合のみとなります。

例えば、`000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65`というIDを持つ先ほどのNFTに`low96`関数を適用すると、`42540EE208C3098E00000D65`が返されます。

この不思議な構造は、SHAMapの構造を利用して、`NFTokenPages`の二重リンクされたリストを反復することなく、個々の`NFToken`オブジェクトを効率的に検索できるようにするものです。


### `NFToken`オブジェクトの検索

特定の`NFToken`を検索するには、上記のように所有者のアカウントとトークンの`NFTokenID`を使用して`NFTokenPageID`を計算します。識別子がその値以下であるレジャーの項目を検索します。そのエントリが存在しないか、`NFTokenPage`でない場合、`NFToken`は与えられたアカウントによって保持されていません。


### `NFToken`オブジェクトの追加

`NFToken`オブジェクトを追加するには、そのオブジェクトが含まれるべき`NFTokenPage`を見つけ(`NFToken`オブジェクトを検索するのと同じテクニックを使用します)、そのページに追加します。`NFTokenPage`が一杯である場合、前後のページを検索し、その3ページでバランスをとりながら、必要に応じて新しい`NFTokenPage`を挿入します。


### `NFToken`オブジェクトの削除

`NFToken`の削除も追加と同じように動作します。ページ内の`NFToken`の数がある閾値を下回ると、サーバはそのページを前後のページと統合して準備金を取り戻そうとします。


### {% $frontmatter.seo.title %}の準備金

`NFTokenPage`ごとに、所有者アカウントに追加で準備金の費用がかかります。つまり、複数のNFTを保有するアカウントでは、NFTあたりの _実効_ 準備金コストは _R_ /32（ _R_ は準備金増分）と低くすることが可能です。


### 準備金の実例

ページの分割と結合が機能するため、1ページあたりの`NFToken`オブジェクトの実際の数はやや予測不可能で、関係する実際の`NFTokenID`値に依存します。実際には、大量のNFTをミントまたは受領した後、各ページには16個のアイテムしかないこともあれば、32個のアイテムしかないこともあります。

以下の表は、様々なシナリオの下で、様々な数のNFTを所有した場合の**所有準備金の合計**を示したものです。


| 所有NFTの数  |  最良のケース | 一般 | 最悪のケース |
|:------------|:----------|:--------|:-----------|
| 32以下       | 2 XRP     | 2 XRP   | 2 XRP      |
| 50          | 4 XRP     | 6 XRP   | 8 XRP      |
| 200         | 14 XRP    | 18 XRP  | 26 XRP     |
| 1000        | 64 XRP    | 84 XRP  | 126 XRP    |

これらの数字は推定であり、実際の数字とは異なる場合があります。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
